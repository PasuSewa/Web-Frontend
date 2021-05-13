import React, { FC, useState, ChangeEvent } from "react"

import {
	Typography,
	Accordion,
	AccordionDetails,
	AccordionSummary,
	TextField,
	Grid,
} from "@material-ui/core"

import Autocomplete from "@material-ui/lab/Autocomplete"

import { Theme, createStyles, makeStyles } from "@material-ui/core/styles"

import ExpandMoreIcon from "@material-ui/icons/ExpandMore"

import { CompanyT } from "../../misc/types"

import EditCodes from "../ShowCredential/CredentialCodes/EditCodes"

type LayoutOptions = "text field" | "select option" | "multiline" | "multiple codes" | "sqa"

type Props = {
	layout: LayoutOptions
	label: string
	isMandatory?: boolean
	defaultExpanded?: boolean
	companies?: CompanyT[]
	maxChar?: number
}

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		accordion: {
			width: "100%",
			borderRadius: 8,
		},
		heading: {
			fontSize: theme.typography.pxToRem(15),
			flexBasis: "80%",
			flexShrink: 0,

			[theme.breakpoints.down("xs")]: {
				flexBasis: "70%",
			},
		},
		secondaryHeading: {
			fontSize: theme.typography.pxToRem(15),
			color: theme.palette.text.secondary,
		},
		textColor: {
			color: theme.palette.type === "dark" ? "white" : "black",
		},
		textCenter: {
			textAlign: "center",
		},
		borderRadius: {
			borderRadius: 8,
		},
	})
)

const CreateCredentialProp: FC<Props> = (props) => {
	const { layout, label, isMandatory, defaultExpanded, companies, maxChar } = props

	const [mainCharCount, setMainCharCount] = useState(0)

	const [secondCharCount, setSecondCharCount] = useState(0)

	const [mainText, setMainText] = useState("")

	const [secondText, setSecondText] = useState("")

	const classes = useStyles()

	const handleChange = (event: ChangeEvent<{ value: unknown }>) => {
		const target = event.target as HTMLInputElement

		const inputType = target.getAttribute("input-type")

		const variant = target.getAttribute("variant")

		switch (inputType) {
			case "text field":
				setMainText(target.value)

				setMainCharCount(target.value.length)
				break

			case "select option":
				setMainText(target.value)

				setMainCharCount(target.value.length)
				break

			case "multiline":
				setMainText(target.value)

				setMainCharCount(target.value.length)
				break

			case "sqa":
				if (variant && variant === "security question") {
					setMainText(target.value)

					setMainCharCount(target.value.length)
				}

				if (variant && variant === "security answer") {
					setSecondText(target.value)

					setSecondCharCount(target.value.length)
				}

				break

			default:
				break
		}
	}

	const renderBody = (option: LayoutOptions) => {
		switch (option) {
			case "text field":
				return (
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
							"input-type": layout,
						}}
						value={mainText}
						onChange={handleChange}
					/>
				)

			case "select option":
				let options: CompanyT[]

				if (companies) {
					options = companies.sort(
						(a, b) => -b.name.charAt(0).localeCompare(a.name.charAt(0))
					)
				} else {
					options = [
						{
							id: 0,
							name: "",
							url_logo: "",
						},
					]
				}

				return (
					<Autocomplete
						freeSolo
						fullWidth
						options={options}
						groupBy={(option) => option.name.charAt(0)}
						getOptionLabel={(option) => option.name}
						renderInput={(params) => (
							<TextField
								{...params}
								label={label}
								variant="outlined"
								inputProps={{
									"input-type": layout,
								}}
								value={mainText}
								onChange={handleChange}
							/>
						)}
					/>
				)

			case "multiline":
				return (
					<TextField
						label={label}
						variant="outlined"
						fullWidth
						multiline
						className={classes.textColor}
						InputProps={{
							classes: {
								input: classes.textColor,
							},
						}}
						inputProps={{
							"input-type": layout,
						}}
						value={mainText}
						onChange={handleChange}
					/>
				)

			case "multiple codes":
				return <EditCodes codes={[""]} option={2} />

			case "sqa":
				return (
					<>
						<Grid container spacing={4}>
							<Grid item xs={12}>
								<TextField
									label="security question"
									variant="outlined"
									fullWidth
									className={classes.textColor}
									InputProps={{
										classes: {
											input: classes.textColor,
										},
									}}
									inputProps={{
										"input-type": layout,
										variant: "security question",
									}}
									value={mainText}
									onChange={handleChange}
								/>
							</Grid>
							<Grid item xs={12}>
								<TextField
									label="security answer"
									variant="outlined"
									fullWidth
									className={classes.textColor}
									InputProps={{
										classes: {
											input: classes.textColor,
										},
									}}
									inputProps={{
										"input-type": layout,
										variant: "security answer",
									}}
									value={secondText}
									onChange={handleChange}
								/>
							</Grid>
						</Grid>
					</>
				)

			default:
				return null
		}
	}

	return (
		<>
			<Accordion defaultExpanded={defaultExpanded} className={classes.borderRadius}>
				<AccordionSummary expandIcon={<ExpandMoreIcon />}>
					<Typography className={classes.heading}>{label}</Typography>
					<Typography className={classes.secondaryHeading}>
						{isMandatory ? "(Mandatory)" : "(Optional)"}
					</Typography>
				</AccordionSummary>
				<AccordionDetails>{renderBody(layout)}</AccordionDetails>
			</Accordion>
		</>
	)
}

export default CreateCredentialProp
