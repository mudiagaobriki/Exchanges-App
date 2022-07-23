import React, {forwardRef, useEffect, useImperativeHandle, useRef, useState} from "react";
import {StyleSheet, TextInput, TouchableOpacity, View} from "react-native";
import {Text} from "./Text";
import {Colors} from "../constants";
import {mf, parseDecimalNumber} from "../helpers";
import { SystemService, WalletService } from "../services";
import DropDownPicker from "react-native-dropdown-picker";
import {Icon} from "./Icon";

const _NjExchangeCurrencyInput = (props: any = {}, ref: ((instance: unknown) => void) | React.RefObject<unknown> | null | undefined) => {
	const [isSwitched, setIsSwitched] = useState(false);
	const [fromCurrency, setFromCurrency] = useState("");
	const [toCurrency, setToCurrency] = useState("");
	const [fromAmount, setFromAmount] = useState("");
	const [toAmount, setToAmount] = useState("");
	const [width, setWidth] = useState(18);
	const [toCurrencyDropDownPicker, setToCurrencyDropDownPicker] = useState(false);
	const [fromCurrencyDropDownPicker, setFromCurrencyDropDownPicker] = useState(false);
	const [userBalances, setUserBalances] = useState([])
	const [rates, setRates] = useState([])
	const [countries, setCountries] = useState([])
	const [rate, setRate] = useState(1)

	// refs
	const fromAmountInputRef = useRef();

	useEffect(() => {
		WalletService.getInfo().then(result => {
			const {balances} = result.data;
			setUserBalances(balances)
			setCountries(result.data?.countries || [])
		})
		SystemService.getConfig().then((result) => {
			const {exrts, ut, wmf} = result
			setRates(exrts)
		}).catch((err) => alert(err.message));

		/*
		const timeout = setTimeout(() => {
			// @ts-ignore
			fromAmountInputRef.current?.blur();
			// @ts-ignore
			fromAmountInputRef.current?.focus();
		}, 100);
		return () => clearTimeout(timeout);
		*/
	}, []);

	const setFromAmountInputWidth = (value: string) => {
		let valWidth = value.length * 20;
		valWidth = valWidth > 19? valWidth: 80
		valWidth = valWidth < 350? valWidth: 350
		setWidth(valWidth)
	}

	const onClickSwitchCurrency = () => {
		const _fromAmount = fromAmount
		const _toAmount = parseDecimalNumber(toAmount, 2)
		const _toCurrency = toCurrency
		const _fromCurrency = fromCurrency
		setFromCurrency(_toCurrency)
		setToCurrency(_fromCurrency)
		setIsSwitched(!isSwitched)
		setToAmount(String(_fromAmount))
		setFromAmount(String(_toAmount))
		setFromAmountInputWidth(_toAmount)
		// @ts-ignore
		const rt = _toCurrency && _fromCurrency ? parseFloat(rates[`${_toCurrency}_${_fromCurrency}`]): 1
		setRate(rt)
		setToAmount(String(rt * parseFloat(toAmount)))
		/*setTimeout(() => {
			// @ts-ignore
			fromAmountInputRef.current?.blur();
			// @ts-ignore
			fromAmountInputRef.current?.focus();
		}, 100);*/
	}

	// Return to parent component
	useImperativeHandle(ref, () => ({
		getAmount: () => {
			return fromAmount;
		},
		getToAmount: () => {
			return toAmount;
		},
		getFromCurrency: () => {
			return fromCurrency
		},
		getToCurrency: () => {
			return toCurrency
		},
		setAmount: () => {
			return setFromAmount("");
		},
	}))

	return (
		<>
			<View style={{
				backgroundColor: 'rgba(196, 196, 196, 0.28)',
				height: 160,
				flexDirection: "row",
				justifyContent: "space-between",
				// alignItems: "center",
				paddingHorizontal: 20,
				paddingTop: 40
				}}>
				<View>
					<View>
						<DropDownPicker
							schema={{
								label: 'currency_code', // required
								value: 'currency_code', // required
								icon: 'icon',
								parent: 'parent',
								selectable: 'selectable',
								disabled: 'disabled'
							}}
							listMode="MODAL"
							placeholder={"From"}
							modalTitle={"Exchange From"}
							open={fromCurrencyDropDownPicker}
							value={fromCurrency}
							items={countries}
							setOpen={() => setFromCurrencyDropDownPicker(true)}
							onClose={() => setFromCurrencyDropDownPicker(false)}
							// @ts-ignore
							setValue={(val:Function) => {
								setFromCurrency(val())
								setFromCurrencyDropDownPicker(false)
								const cc = val()
								// @ts-ignore
								const rt = toCurrency && cc ? parseFloat(rates[`${cc}_${toCurrency}`]): 1
								setRate(rt)
								setToAmount(String(rt * parseFloat(fromAmount)))
							}}
							style={{display: "none", position: "relative", height: 0, width: 0, opacity: 0}}
						/>
					</View>
					<TouchableOpacity onPress={() => setFromCurrencyDropDownPicker(true)}>
						<Text style={{fontSize: 24, fontWeight: "bold"}}>
							{fromCurrency || "Select From"}
						</Text>
					</TouchableOpacity>
					{
						fromCurrency && Object.keys(userBalances).length > 0?
							/* @ts-ignore */
							<Text style={{fontSize: 14, marginTop: 5}}>{ userBalances[fromCurrency] } Available</Text>
						: <></>
					}
				</View>
				<View>
					<TextInput
						// @ts-ignore
						ref={fromAmountInputRef}
						style={[styles.fromAmountInput, {width: width}]}
						onChangeText={(value) => {
							value = parseDecimalNumber(value, 2);
							setFromAmount(value)
							setFromAmountInputWidth(value)
							setToAmount(String(rate * parseFloat(value)))
						}}
						autoCorrect={false}
						autoCompleteType={"off"}
						keyboardType={"number-pad"}
						placeholder={"0"}
						placeholderTextColor={"#545454"}
						value={fromAmount}
					/>
				</View>
			</View>
			<View style={{ flexDirection: "row", justifyContent: "flex-start", marginTop: -65 }}>
				<TouchableOpacity style={{...styles.button, ...{
					borderRadius: 100,
					backgroundColor: "#FFFFFF",
					width: "auto",
					height: "auto",
					shadowOffset: {
						width: 10,
						height: 10,
					},
					shadowOpacity: 0.2,
					shadowColor: "#000000",
					elevation: 5,
					marginLeft: 30,
				}}} onPress={onClickSwitchCurrency}>
					<View style={{
						fontWeight: "bold",
						textAlign: "center",
						padding: 10,
						justifyContent:'center',
					}}
					><Icon name="swap-vertical" group="MaterialCommunityIcons" size={40}/></View>
				</TouchableOpacity>
				{
					fromCurrency && toCurrency ?
						<View style={{...styles.button, ...{
							borderRadius: 20,
							backgroundColor: "#FFFFFF",
							width: "auto",
							height: "auto",
							shadowOffset: {
								width: 10,
								height: 10,
							},
							shadowOpacity: 0.2,
							shadowColor: "#000",
							elevation: 5,
							padding: 7,
							marginLeft: 30,
						}}}>
							<Text style={{
								fontWeight: "bold",
								textAlign: "center",
								padding: 10,
							}}
							>{ mf(1, fromCurrency) } = { mf(rate, toCurrency) }</Text>
						</View>
					: <></>
				}
			</View>

			<View style={{
				height: 50,
				flexDirection: "row",
				justifyContent: "space-between",
				alignItems: "center",
				paddingHorizontal: 20,
				}}>
				<View>
					<View>
						<DropDownPicker
							schema={{
								label: 'currency_code', // required
								value: 'currency_code', // required
								icon: 'icon',
								parent: 'parent',
								selectable: 'selectable',
								disabled: 'disabled'
							}}
							listMode="MODAL"
							placeholder={"To"}
							modalTitle={"Exchange To"}
							open={toCurrencyDropDownPicker}
							value={toCurrency}
							items={countries}
							setOpen={() => setToCurrencyDropDownPicker(true)}
							onClose={() => setToCurrencyDropDownPicker(false)}
							// @ts-ignore
							setValue={(val:Function) => {
								setToCurrency(val())
								setToCurrencyDropDownPicker(false)
								const cc = val()
								// @ts-ignore
								const rt = fromCurrency && cc ? parseFloat(rates[`${fromCurrency}_${cc}`]): 1
								setRate(rt)
								setToAmount(String(rt * parseFloat(fromAmount)))
							}}
							style={{display: "none", position: "relative", height: 0, width: 0, opacity: 0}}
						/>
					</View>
					<TouchableOpacity onPress={() => setToCurrencyDropDownPicker(true)}>
						<Text style={{fontSize: 24, fontWeight: "bold"}}>
							{toCurrency || "Select To"}
						</Text>
					</TouchableOpacity>
				</View>
				<View>
					<Text style={{fontSize: 26, fontFamily: "default-black",}}>{mf(parseFloat(toAmount))}</Text>
				</View>
			</View>
		</>
	)
}

export const NjExchangeCurrencyInput = forwardRef(_NjExchangeCurrencyInput);

const styles = StyleSheet.create({
	fromAmountInput: {
		borderWidth: 0,
		textAlign: "right",
		color: "#000",
		fontSize: 26,
		fontFamily: "Rubik-Regular",
		fontWeight: "bold",
		alignSelf: "center",
	},
	switchButton: {
		justifyContent: "center",
		alignItems: "flex-end",
		marginRight: 30,
		marginTop: 10,
	},
	switchButtonIcon: {
		width: 30,
		height: 30
	},
	button: {
		marginVertical: 30,
		backgroundColor: "#E8FFF1",
		borderColor: "#E8FFF1",
		color: Colors.text_success,
		borderRadius: 20,
		height: 55,
		width: "100%",
		alignSelf: "center",
		fontSize: 22,
	},
})
