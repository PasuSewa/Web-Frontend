import { FC, useState, useEffect } from "react"

import { Grid, Typography } from "@material-ui/core"

import useStyles from "./styles"

import { useSelector, useDispatch } from "react-redux"
import { RootState } from "../../../redux/store"
import {
	initializeCredential,
	setDecryptedCredential,
} from "../../../redux/actions/credentialActions"
import { showError } from "../../../redux/actions/errorHandlingActions"
import { setErrorLoading, toggleLoading } from "../../../redux/actions/loadingActions"

import { translate } from "../../../lang"

import { findCredential, putCredential } from "../../../misc/indexedDB"
import getUserAgent from "../../../hooks/useUserAgent"
import { ApiCallI, ReduxCredentialT } from "../../../misc/types"
import { useApi } from "../../../hooks/useApi"

import UnlockData from "../../Utils/UnlockData"
import DisplayData from "../../Utils/DisplayData"
import GoBackBtn from "../../Utils/GoBackBtn"
import DeleteCredential from "../../UI-Components/DeleteCredential"
import Snackbar from "../../Utils/Snackbar"
import CredentialProp from "./CredentialProp"

const ShowCredential: FC<Props> = ({ getDecryptedCredential }) => {
	const { lng } = useSelector((state: RootState) => state.lng)
	const { credential } = useSelector((state: RootState) => state.credential)
	const { token } = useSelector((state: RootState) => state.token)

	const { REACT_APP_ENV_LOCAL } = process.env

	const [locked, setLocked] = useState(true)
	const [visible, setVisible] = useState(false)
	const [isAuthenticated, setIsAuthenticated] = useState(false)
	const [showSnackbar, setShowSnackbar] = useState(false)
	const [snackbarMessage, setSnackbarMessage] = useState("")

	const classes = useStyles()
	const dispatch = useDispatch()
	const callApi = useApi

	useEffect(() => {
		setIsAuthenticated(!locked)

		if (showSnackbar) {
			const timer = setTimeout(() => {
				setShowSnackbar(false)
			}, 12500)

			return () => {
				clearTimeout(timer)
			}
		}
	}, [locked, showSnackbar])

	const obtainCredential = async (id: number) => {
		const data = await findCredential(id)

		if (data === undefined) {
			return undefined
		}

		return data
	}

	const toggleVisibility = () => {
		if (!token) return

		if (!locked && visible) {
			setLocked(true)
		}

		if (!visible) {
			dispatch(toggleLoading(true))

			const request: ApiCallI = {
				lng,
				token,
				method: "POST",
				endpoint: "/auth/grant-access",
				body: {
					accessTo: "credential-data",
					credentialId: credential.id,
					accessingPlatform: "web",
					accessingDevice: getUserAgent(),
				},
			}

			return callApi(request).then((response) => {
				if (response.status !== 200) {
					setShowSnackbar(true)
					setSnackbarMessage(translate("access_denied_message", lng))
					dispatch(setErrorLoading(response.message))
				} else {
					dispatch(toggleLoading(false))
					setVisible(true)
					dispatch(setDecryptedCredential(response.data.decrypted_credential))
				}
			})
		}

		const id = credential.id ? credential.id : 0

		if (id !== 0) {
			obtainCredential(id).then((credentialDB: any) => {
				if (credentialDB) {
					setVisible(false)
					dispatch(initializeCredential(credentialDB))
				} else {
					setSnackbarMessage(translate("error_messages", lng, 3))
					setShowSnackbar(true)
				}
			})
		}
	}

	const toggleLock = () => {
		if (!token) return

		if (!locked) {
			updateCredential(credential)

			return
		}

		dispatch(toggleLoading(true))

		const request: ApiCallI = {
			lng,
			token,
			method: "POST",
			endpoint: "/auth/grant-access",
			body: {
				accessTo: "credential-data",
				credentialId: credential.id,
				accessingPlatform: "web",
				accessingDevice: getUserAgent(),
			},
		}

		callApi(request).then((response) => {
			if (response.status !== 200) {
				setShowSnackbar(true)
				setSnackbarMessage(translate("access_denied_message", lng))
				dispatch(setErrorLoading(response.message))
			} else {
				dispatch(toggleLoading(false))

				if (!visible && locked) {
					setVisible(true)
				}

				setLocked(false)
				setIsAuthenticated(true)
				dispatch(setDecryptedCredential(response.data.decrypted_credential))
			}
		})
	}

	const updateCredential = (credential: ReduxCredentialT) => {
		if (!token) return

		const request: ApiCallI = {
			lng,
			method: "PUT",
			endpoint: "/credential/update/" + credential.id,
			body: {
				...credential,
				accessing_device: getUserAgent(),
				accessing_platform: "web",
			},
			token,
		}

		dispatch(toggleLoading(true))

		callApi(request).then(async (response) => {
			if (response.status !== 200) {
				dispatch(setErrorLoading(response.message))
				return
			}

			const updatedCredential = await putCredential(response.data.credential)

			if (updatedCredential === undefined) {
				dispatch(showError(translate("error_messages", lng, 0)))

				return
			}

			dispatch(initializeCredential(response.data.credential))

			dispatch(toggleLoading(false))

			setLocked(true)

			setVisible(false)
		})
	}

	return (
		<>
			<Grid item xs={12} md={3}>
				<Grid container spacing={4}>
					<Grid item xs={12}>
						<Grid container justify="space-between" spacing={3}>
							<Grid item className={classes.title}>
								<Typography variant="h6">{credential.company_name}</Typography>
							</Grid>
							<Grid item className={classes.lockIcon}>
								<GoBackBtn
									altText={!locked ? translate("go_back", lng, 1) : undefined}
									altColor={!locked ? "primary" : undefined}
								/>
							</Grid>
						</Grid>
					</Grid>

					<CredentialProp
						propName="description"
						label={translate("description", lng)}
						maxChar="xl"
						locked={locked}
						visible={visible}
						credential={credential}
					/>

					<Grid item xs={12}>
						<Grid container justify="space-between" spacing={2}>
							<Grid item>
								<Typography variant="body2">
									{translate("credential_info", lng, 0)}:
								</Typography>
							</Grid>
							<Grid item>
								<Typography color="secondary" variant="body2">
									{credential.created_at}
								</Typography>
							</Grid>
						</Grid>
					</Grid>
					<Grid item xs={12}>
						<Grid container justify="space-between" spacing={2}>
							<Grid item>
								<Typography variant="body2">
									{translate("credential_info", lng, 1)}:
								</Typography>
							</Grid>
							<Grid item>
								<Typography color="secondary" variant="body2">
									{credential.updated_at}
								</Typography>
							</Grid>
						</Grid>
					</Grid>
					<Grid item xs={12}>
						<Grid container justify="space-between" spacing={2}>
							<Grid item>
								<Typography variant="body2">
									{translate("credential_info", lng, 2)}:
								</Typography>
							</Grid>
							<Grid item>
								<Typography color="secondary" variant="body2">
									{credential.last_seen}
								</Typography>
							</Grid>
						</Grid>
					</Grid>

					<Grid item xs={12}>
						<Grid container justify="space-around">
							<Grid item>
								<DisplayData toggleDisplay={toggleVisibility} visible={visible} />
							</Grid>
							{isAuthenticated && credential.id && (
								<Grid item>
									<DeleteCredential credentialId={credential.id} />
								</Grid>
							)}
							<Grid item className={classes.lockIcon}>
								<UnlockData
									toggleLock={toggleLock}
									testing={REACT_APP_ENV_LOCAL ? true : false}
									locked={locked}
									lockedTitle={translate("access_management", lng, 3)}
									unlockedTitle={translate("access_management", lng, 2)}
								/>
							</Grid>
						</Grid>
					</Grid>
				</Grid>
			</Grid>

			<Grid item xs={12} md={9}>
				<Grid container spacing={4}>
					<CredentialProp
						propName="user_name"
						label={translate("auth_form_texts", lng, 14)}
						locked={locked}
						visible={visible}
						credential={credential}
					/>
					<CredentialProp
						propName="email"
						label={translate("auth_form_texts", lng, 0)}
						locked={locked}
						visible={visible}
						credential={credential}
					/>
					<CredentialProp
						propName="username"
						label={translate("auth_form_texts", lng, 12)}
						locked={locked}
						visible={visible}
						credential={credential}
					/>
					<CredentialProp
						propName="password"
						label={translate("auth_form_texts", lng, 11)}
						locked={locked}
						visible={visible}
						credential={credential}
					/>
					<CredentialProp
						propName="phone_number"
						label={translate("auth_form_texts", lng, 7)}
						locked={locked}
						visible={visible}
						credential={credential}
					/>
					<CredentialProp
						propName="security_question"
						label={translate("encryption_examples", lng, 10)}
						locked={locked}
						visible={visible}
						credential={credential}
					/>
					<CredentialProp
						propName="unique_code"
						label={translate("auth_form_texts", lng, 13)}
						locked={locked}
						visible={visible}
						credential={credential}
						maxChar="xs"
					/>
					<CredentialProp
						propName="multiple_codes"
						label={translate("encryption_examples", lng, 8)}
						locked={locked}
						visible={visible}
						credential={credential}
						maxChar="xs"
					/>
					<CredentialProp
						propName="crypto_codes"
						label={translate("encryption_examples", lng, 9)}
						locked={locked}
						visible={visible}
						credential={credential}
						maxChar="xs"
						isCrypto
					/>
				</Grid>
			</Grid>

			{showSnackbar && (
				<Snackbar open={showSnackbar} message={snackbarMessage} duration={12000} />
			)}
		</>
	)
}

type Props = {
	getDecryptedCredential: (decrypted: true, agent: string) => Promise<boolean | undefined>
}

/**
 * @alias Section_ShowCredential
 *
 * @description This is the section that will show all the properties that a credential has, one each, using the {@link VisualizeCredentialProp} component
 *
 * @property {Function} getDecryptedCredential This function receives 2 params: 1- decrypted: true alweys, 2- agent: string (the user agent which is obtained inside of this component)
 */

export default ShowCredential
