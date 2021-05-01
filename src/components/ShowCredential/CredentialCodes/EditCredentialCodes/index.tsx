import React, { FC, useState } from "react"

import {
	Button,
	Grid,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	useMediaQuery,
	OutlinedInput,
	FormControl,
	InputLabel,
	InputAdornment,
	IconButton,
	Tooltip,
} from "@material-ui/core"

import { makeStyles, useTheme } from "@material-ui/core/styles"
import DeleteIcon from "@material-ui/icons/Delete"

import { useSelector } from "react-redux"
import { RootState } from "../../../../redux/store"

import { translate } from "../../../../lang"

type Props = {
	codes: string[]
}

const useStyles = makeStyles({
	textCenter: {
		textAlign: "center",
	},
})

const EditCredentialCodes: FC<Props> = ({ codes }) => {
	const theme = useTheme()

	const fullScreen = useMediaQuery(theme.breakpoints.down("sm"))

	const classes = useStyles()

	const { lng } = useSelector((state: RootState) => state.lng)

	const [open, setOpen] = useState(false)

	const [editingCodes, setEditingCodes] = useState<string[]>(codes)

	const handleClickOpen = () => {
		setOpen(true)
	}

	const handleClose = () => {
		setOpen(false)
	}

	const removeCode = (i: number) => {
		let editedArray: string[] = []

		for (let index = 0; index < editingCodes.length; index++) {
			if (index !== i) {
				editedArray.push(editingCodes[index])
			}
		}

		setEditingCodes(editedArray)
	}

	return (
		<>
			<Grid item xs={12} className={classes.textCenter}>
				<Button
					size="large"
					color="primary"
					variant="contained"
					disableElevation
					onClick={handleClickOpen}
				>
					{translate("edit_codes", lng)}
				</Button>
			</Grid>
			<Dialog
				fullScreen={fullScreen}
				open={open}
				onClose={handleClose}
				aria-labelledby="edit-dialog"
				scroll="paper"
			>
				<DialogTitle id="edit-dialog">{translate("edit_codes", lng)}</DialogTitle>
				<DialogContent>
					<Grid container justify="space-around" spacing={4}>
						{editingCodes.map((code: string, index: number) => (
							<Grid key={index} item xs={12} md={6}>
								<FormControl variant="outlined" fullWidth>
									<InputLabel>{index + 1}</InputLabel>
									<OutlinedInput
										id={index + "-" + code}
										defaultValue={code}
										label={`${index + 1}`}
										endAdornment={
											<InputAdornment position="end">
												<Tooltip
													title={translate("delete", lng)}
													placement="top"
												>
													<IconButton
														aria-label="delete code"
														onClick={() => removeCode(index)}
													>
														<DeleteIcon />
													</IconButton>
												</Tooltip>
											</InputAdornment>
										}
									/>
								</FormControl>
							</Grid>
						))}

						<Grid item xs={12} className={classes.textCenter}>
							<Button
								variant="outlined"
								color="primary"
								onClick={() => setEditingCodes([...editingCodes, ""])}
							>
								añadir código
							</Button>
						</Grid>
					</Grid>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose} color="default">
						{translate("go_back", lng)}
					</Button>
					<Button onClick={handleClose} color="primary">
						{translate("access_management", lng, 2)}
					</Button>
				</DialogActions>
			</Dialog>
		</>
	)
}

export default EditCredentialCodes
