import React, { FC, useEffect, useState } from "react"
import { makeStyles } from "@material-ui/core/styles"

import {
	Card,
	CardContent,
	TableRow,
	TableHead,
	TableContainer,
	TableCell,
	TableBody,
	Table,
	CircularProgress,
	Typography,
} from "@material-ui/core"

import { useSelector } from "react-redux"
import { RootState } from "../../../redux/store"

import { translate } from "../../../lang"

import { recentlySeen4Testing } from "../../../misc/Data4Testing"

import { getRecentlySeen, putRecentlySeen } from "../../../misc/indexedDB"

import { RecentlySeenT } from "../../../misc/types"

type Props = { testing?: boolean }

const useStyles = makeStyles({
	table: {
		minWidth: 650,
	},
	card: {
		borderRadius: 8,
		marginBottom: "3rem",
	},
	marginTop: {
		marginTop: 20,
	},
	textCapitalize: {
		textTransform: "capitalize",
	},
	subTitle: {
		marginTop: 25,
		float: "left",
		paddingBottom: 25,
	},
})

const RecentAccessTable: FC<Props> = ({ testing }) => {
	const { lng } = useSelector((state: RootState) => state.lng)

	const [credentials, setCredentials] = useState<RecentlySeenT[]>([])

	const [loading, setLoading] = useState(true)

	const classes = useStyles()

	useEffect(() => {
		if (!testing) {
			obtainRecentAccess()
		} else {
			setCredentials(recentlySeen4Testing)

			setLoading(false)
		}
	}, [])

	const obtainRecentAccess = async () => {
		let data: any

		data = await getRecentlySeen()

		if (data === undefined) {
			return getFromApi()
		}

		setCredentials(data)

		setLoading(false)
	}

	const getFromApi = async () => {
		//fake api call on component did mount
		const fakeTimer = setTimeout(() => {
			setCredentials(recentlySeen4Testing)

			putRecentlySeen(recentlySeen4Testing)

			setLoading(false)
		}, 4000)

		return () => {
			clearTimeout(fakeTimer)
		}
	}

	return (
		<Card className={classes.card} elevation={2} data-testid="test_recently_seen_table">
			<CardContent>
				{loading ? (
					<CircularProgress color="primary" className={classes.marginTop} />
				) : (
					<>
						<TableContainer>
							<Table className={classes.table} size="small">
								<TableHead>
									<TableRow>
										<TableCell align="left">
											{translate("recently_seen", lng, 1)}
										</TableCell>
										<TableCell align="left">
											{translate("recently_seen", lng, 2)}
										</TableCell>
										<TableCell align="left">
											{translate("recently_seen", lng, 3)}
										</TableCell>
										<TableCell align="right">
											{translate("recently_seen", lng, 4)}
										</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{credentials.length >= 1 ? (
										credentials.map((credential) => (
											<TableRow
												key={credential.id}
												data-testid={"test_RS_row_" + credential.id}
											>
												<TableCell
													component="th"
													scope="row"
													className={classes.textCapitalize}
												>
													{credential.name}
												</TableCell>
												<TableCell align="left">
													{credential.last_seen}
												</TableCell>
												<TableCell align="left">
													{credential.accessing_device}
												</TableCell>
												<TableCell
													align="right"
													className={classes.textCapitalize}
												>
													{credential.accessing_platform}
												</TableCell>
											</TableRow>
										))
									) : (
										<TableRow>
											<TableCell colSpan={5}>
												{translate("recently_seen", lng, 5)}
											</TableCell>
										</TableRow>
									)}
								</TableBody>
							</Table>
						</TableContainer>
						{credentials.length >= 1 && (
							<Typography variant="body2" className={classes.subTitle}>
								{translate("recently_seen", lng, 6)}
							</Typography>
						)}
					</>
				)}
			</CardContent>
		</Card>
	)
}

export default RecentAccessTable
