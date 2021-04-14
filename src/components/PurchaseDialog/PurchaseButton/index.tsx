import React, { FC, useState, useEffect } from "react"

import { Button, Grid, CircularProgress, Typography } from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles"

import { useSelector } from "react-redux"
import { RootState } from "../../../redux/store"

import { translate } from "../../../lang"

import { PayPalButton } from "react-paypal-button-v2"

import Snackbar from "../../Snackbar"

import { generateCoinbaseCharge, CoinbaseChargeT } from "../../../misc/ajaxManager"

type Props = {
	amount: number
	method: "PayPal" | "Crypto"
	type: "slots" | "premium"
	goBack: () => void
	testing?: boolean
}

let firstCall = true

const useStyles = makeStyles({
	link: {
		textDecoration: "none",
		marginBottom: "2rem",
	},
	marginBottom: {
		marginBottom: "2rem",
	},
	centerAll: {
		display: "flex",
		justifyContent: "center",
		textAlign: "center",
		alignItems: "center",
	},
})

const PurchaseButton: FC<Props> = ({ amount, method, type, goBack }) => {
	const { lng } = useSelector((state: RootState) => state.lng)

	const classes = useStyles()

	const {
		REACT_APP_ENV_LOCAL,
		REACT_APP_PAYPAL_CLIENT_ID,
		REACT_APP_COINBASE_API_KEY,
	} = process.env

	const [message, setMessage] = useState<string | null>(null)

	const [cryptoUrl, setCryptoUrl] = useState("")

	const [cryptoCode, setCryptoCode] = useState("")

	const [loading, setLoading] = useState(true)

	const [error, setError] = useState(false)

	const finalAmount = type === "slots" ? amount * 10 : amount * 5

	useEffect(() => {
		if (REACT_APP_COINBASE_API_KEY && firstCall && method === "Crypto") {
			callCoinbaseAPI(finalAmount, REACT_APP_COINBASE_API_KEY)
		}

		if (!REACT_APP_COINBASE_API_KEY && method === "Crypto") {
			onError("There is no api key for coinbase")
		}
	}, [])

	const onSuccess = (details: any) => {
		console.log("success!")
		console.log("Order id: " + details.id)

		setMessage(translate("success_message", lng))
	}

	const onError = (error: any) => {
		console.log("error...")
		console.error(error)

		setMessage(translate("error_messages", lng, 6))

		setError(true)
		setLoading(false)
	}

	const callCoinbaseAPI = async (finalAmount: number, apiKey: string) => {
		firstCall = false

		const name = translate("purchase_name", lng, type === "slots" ? 0 : 1)

		const description = translate("purchase_description", lng, type === "slots" ? 0 : 1)

		const charge: CoinbaseChargeT = {
			name,
			description,
			local_price: {
				amount: finalAmount,
				currency: "USD",
			},
			pricing_type: "fixed_price",
		}

		const data: any = await generateCoinbaseCharge(apiKey, charge)

		if (!data.successful) {
			onError(data.error)

			return
		}

		setCryptoUrl(data.data.hosted_url)

		setCryptoCode(data.data.code)

		setLoading(false)

		return
	}

	console.log(cryptoCode)

	const renderCryptoOption = () => {
		return (
			<>
				{loading && <CircularProgress className={classes.marginBottom} />}

				{cryptoUrl && (
					<Grid container spacing={4} justify="center">
						<Grid item>
							<a href={cryptoUrl} target="_blank" className={classes.link}>
								<Button variant="contained" color="primary" disableElevation>
									{translate("purchase_now", lng)}
								</Button>
							</a>
						</Grid>

						<Grid item xs={12}>
							<Typography variant="body2" className={classes.marginBottom}>
								{translate("crypto_purchase_warning", lng)}
							</Typography>
						</Grid>
					</Grid>
				)}
			</>
		)
	}

	const renderPaypalOption = () => {
		if (REACT_APP_ENV_LOCAL) {
			return (
				<PayPalButton
					amount={finalAmount}
					shippingPreference="NO_SHIPPING"
					onSuccess={onSuccess}
					onError={onError}
					catchError={onError}
					data-testid="test_paypal_btn"
				/>
			)
		} else {
			if (!REACT_APP_PAYPAL_CLIENT_ID) {
				onError("There is no PayPal Client ID.")

				return null
			}

			return (
				<PayPalButton
					amount={finalAmount}
					shippingPreference="NO_SHIPPING"
					onSuccess={onSuccess}
					onError={onError}
					catchError={onError}
					options={{
						clientId: REACT_APP_PAYPAL_CLIENT_ID,
					}}
				/>
			)
		}
	}

	return (
		<>
			<Grid container justify="center" spacing={2}>
				<Grid item xs={12} className={classes.centerAll}>
					{method === "PayPal" ? renderPaypalOption() : renderCryptoOption()}
				</Grid>
				{error && (
					<Grid item xs={12}>
						<Typography variant="body2" className={classes.marginBottom}>
							{message}
						</Typography>
					</Grid>
				)}
				<Grid item xs={12} className={classes.centerAll}>
					<Button variant="contained" color="secondary" onClick={() => goBack()}>
						{translate("go_back", lng, 0)}
					</Button>
				</Grid>
			</Grid>
			{message && (
				<Snackbar message={message} open={message ? true : false} duration={45000} />
			)}
		</>
	)
}

export default PurchaseButton