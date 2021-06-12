import React, { FC, ChangeEvent, useState, useEffect } from "react"

import {
	Typography,
	Accordion,
	AccordionDetails,
	AccordionSummary,
	TextField,
	Grid,
	AccordionActions,
	Button,
	Divider,
	Chip,
	useMediaQuery,
} from "@material-ui/core"

import { Theme, createStyles, makeStyles, useTheme } from "@material-ui/core/styles"

import ExpandMoreIcon from "@material-ui/icons/ExpandMore"
import LockOpenIcon from "@material-ui/icons/LockOpen"
import LockIcon from "@material-ui/icons/Lock"

import { useSelector, useDispatch } from "react-redux"
import { RootState } from "../../redux/store"
import { editCredential } from "../../redux/actions/credentialActions"

import { translate } from "../../lang"

import { AccessCredentialPropT } from "../../misc/types"

import CopyText from "../CopyText"
import EditCodes from "../EditCodes"

type Props = {
	label: string
	locked: boolean
	visible: boolean
	propName: AccessCredentialPropT
	isCrypto?: boolean
	maxChar?: number
}

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		heading: {
			fontSize: theme.typography.pxToRem(15),
			flexBasis: "80%",
			flexShrink: 0,

			[theme.breakpoints.down("xs")]: {
				flexBasis: "70%",
			},
		},
		textColor: {
			color: theme.palette.type === "dark" ? "white" : "black",
		},
		textCenter: {
			textAlign: "center",
		},
	})
)

const VisualizeCredentialProp: FC<Props> = (props) => {
	const { label, locked, visible, propName, isCrypto, maxChar } = props

	const { credential } = useSelector((state: RootState) => state.credential)
	const { lng } = useSelector((state: RootState) => state.lng)

	const [mainCharCount, setMainCharCount] = useState<number | null | undefined>(0)

	const [secondCharCount, setSecondCharCount] = useState<number | null | undefined>(0)

	const classes = useStyles()
	const theme = useTheme()
	const matches = useMediaQuery(theme.breakpoints.down("sm"))

	const dispatch = useDispatch()

	const textToCopy = (): string => {
		if (isCrypto && propName === "crypto_currency_access_codes") {
			if (credential.crypto_currency_access_codes) {
				return credential.crypto_currency_access_codes.join(" ")
			}
		}

		if (credential.multiple_security_code && propName === "multiple_security_code") {
			return credential.multiple_security_code[0]
		}

		if (typeof credential[propName] === "string" && credential[propName] !== undefined) {
			return credential[propName] ? (credential[propName] as string) : ""
		}

		return ""
	}

	useEffect(() => {
		const mainChar = credential[propName] as string

		const secondChar = credential.security_answer

		setMainCharCount(mainChar ? mainChar.length : 0)

		setSecondCharCount(secondChar ? secondChar.length : 0)
	}, [credential])

	const handleChange = (event: ChangeEvent<{ value: unknown }>) => {
		const target = event.target as HTMLInputElement

		const type = target.getAttribute("type")

		const variant = target.getAttribute("variant")

		switch (type) {
			case "text field":
				setMainCharCount(target.value.length)

				dispatch(
					editCredential({
						oldCredential: credential,
						prop: propName,
						newValue: target.value,
					})
				)

				break

			default:
				break
		}
	}

	const renderLayout = () => {
		const mainChar = credential[propName] ? credential[propName] : ""

		const secondChar = credential.security_answer ? credential.security_answer : ""

		if (propName === "description") {
			return "multiline"
		}

		if (propName === "multiple_security_code" || propName === "crypto_currency_access_codes") {
			const codes = isCrypto
				? credential.crypto_currency_access_codes
				: credential.multiple_security_code

			return (
				<Grid container spacing={4} justify="space-around">
					{codes &&
						codes.map((code: string, index: number) => (
							<Grid item key={index}>
								<Chip
									icon={locked ? <LockIcon /> : <LockOpenIcon />}
									key={code}
									label={showCodesLabel(index, code)}
									color="secondary"
									disabled={!visible}
									size={matches ? "small" : "medium"}
									data-testid={"test_chip_" + index}
								/>
							</Grid>
						))}
					{!locked && (
						<Grid item xs={12} className={classes.textCenter}>
							<EditCodes
								codes={codes ? codes : [""]}
								option={1}
								isCrypto={isCrypto ? isCrypto : false}
							/>
						</Grid>
					)}
				</Grid>
			)
		}

		if (propName === "security_question") {
			return "sqa"
		}

		return (
			<>
				<TextField
					label={label}
					variant="outlined"
					fullWidth
					className={classes.textColor}
					InputProps={{
						classes: {
							input: classes.textColor,
						},
					}}
					inputProps={{
						type: "text field",
						"data-testid": "test_text_field",
					}}
					value={mainChar}
					onChange={handleChange}
					disabled={locked}
				/>
				{maxChar && (
					<Typography variant="body1" data-testid="test_max_char">
						{mainCharCount} / {maxChar}
					</Typography>
				)}
			</>
		)
	}

	const showCodesLabel = (number: number, code: string) => {
		if ((isCrypto && visible) || (isCrypto && !locked)) {
			return number + 1 + ") " + code
		} else {
			return code
		}
	}

	const cardFooter = () => {
		if (!locked || visible) {
			return (
				<>
					<Divider />
					<AccordionActions>
						<CopyText body={textToCopy()}>
							<Button color="secondary">{translate("actions", lng, 0)}</Button>
						</CopyText>
					</AccordionActions>
				</>
			)
		}

		return null
	}

	return (
		<>
			<Grid item xs={12} md={6}>
				<Accordion defaultExpanded style={{ borderRadius: 8 }}>
					<AccordionSummary expandIcon={<ExpandMoreIcon />}>
						<Typography className={classes.heading}>{label}</Typography>
					</AccordionSummary>
					<AccordionDetails>
						<Grid container spacing={4}>
							{propName === "security_question" ? (
								renderLayout()
							) : (
								<Grid item xs={12}>
									{renderLayout()}
								</Grid>
							)}
						</Grid>
					</AccordionDetails>
					{cardFooter()}
				</Accordion>
			</Grid>
		</>
	)
}

export default VisualizeCredentialProp
