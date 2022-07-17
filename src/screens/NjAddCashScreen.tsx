import React, {useEffect, useRef, useState} from "react";
import {ScrollView, TouchableOpacity, View, Alert, RefreshControl} from "react-native";
import { Text, TextInput } from "../components";
import SafeAreaView from "react-native-safe-area-view";
import { useLocalization } from "../localization";
import Textarea from "react-native-textarea";
import {NjScreenBottomSpacer, NjWalletCarousel} from "../components";
import { WalletService } from "../services";
import {axiosApiErrorAlert} from "../helpers";
import {globalStyles} from "../helpers";
import DropDownPicker from "react-native-dropdown-picker";
import { t } from "../localization/transfy";

export const NjAddCashScreen = () => {
	const { getString } = useLocalization();
	const [ref, setRef] = useState("");
	const [amount, setAmount] = useState("");
	const [message, setMessage] = useState("");
	const [countries, setCountries] = useState([])
	const [currencyFromDropDownPicker, setCurrencyFromDropDownPicker] = useState(false);
	const [currencyFrom, setCurrencyFrom] = useState("")

	const NjWalletCarouselRef = useRef()

	const onClickSendRequest = () => {
		if(currencyFrom == "" || message == "" || ref == "" || amount == ""){
			Alert.alert(getString(`${t("please fill fields")}`));
			return;
		}
		WalletService.sendBankTransferRequest(currencyFrom, message, ref, amount)
			.then((result) => {
				Alert.alert(result.message);
				if(result.success){
					setRef("")
					setAmount("")
					setMessage("")
				}
			})
			.catch((e) => {
				axiosApiErrorAlert(e)
			});
	}

	const onRefresh = () => {
		// @ts-ignore
		NjWalletCarouselRef.current.refresh();
		WalletService.getInfo().then(result => {
			const {countries} = result.data;
			setCountries(countries)
		})
	}

	useEffect(() => {
		onRefresh();
	}, []);

	useEffect(() => {
		// @ts-ignore
		if(countries.length > 0 && countries[0].currency_code){
			// @ts-ignore
			setCurrencyFrom(countries[0].currency_code)
		}
	}, [countries]);

	return (
		<SafeAreaView style={globalStyles.container} forceInset={{ top: "always" }}>
			<ScrollView
				showsVerticalScrollIndicator={false}
				refreshControl={
					<RefreshControl
						refreshing={false}
						onRefresh={() => {
							onRefresh();
						}}
					/>
				}
			>
				<View style={{marginTop:10}}/>

				<NjWalletCarousel ref={NjWalletCarouselRef}/>

				<View style={{...globalStyles.inputBox, ...{flexDirection: "row"}}}>
					<View style={{ flex: 0.5, marginRight: 10 }}>
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
							placeholder={`${t("Currency")}`}
							placeholderStyle={globalStyles.dropdownPlaceholder}
							labelStyle={globalStyles.dropdownPlaceholder}
							modalTitle="Currency"
							open={currencyFromDropDownPicker}
							value={currencyFrom}
							items={countries}
							setOpen={() => setCurrencyFromDropDownPicker(true)}
							onClose={() => setCurrencyFromDropDownPicker(false)}
							// @ts-ignore
							setValue={(val:Function) => {
								const cc = val()
								setCurrencyFrom(cc)
								setCurrencyFromDropDownPicker(false)
							}}
							style={globalStyles.dropdown}
						/>
					</View>
					<View style={{ flex: 1 }}>
						<TextInput
							style={{...globalStyles.input, alignContent: "center", alignItems: "center"}}
							inputProps={{
								style: {textAlign: "center", alignContent: "center", alignItems: "center"},
								placeholder: `Amount in ${currencyFrom}`,
								keyboardType: "number-pad",
								autoCorrect: false,
								value: amount,
								onChangeText: (val) => {
									setAmount(val)
								},
							}}
						/>
					</View>
				</View>

				<View style={globalStyles.inputBox}>
					<TextInput
						style={globalStyles.input}
						inputProps={{
							placeholder: getString("Reference Number"),
							value: ref,
							onChangeText: setRef,
						}}
					/>
				</View>

				<View style={globalStyles.inputBox}>
					<Textarea
						containerStyle={globalStyles.textareaContainer}
						style={globalStyles.textarea}
						maxLength={100}
						placeholder={"Message"}
						placeholderTextColor={"#7f7f80"}
						underlineColorAndroid={"transparent"}
						defaultValue={message}
						onChangeText={setMessage}
					/>
				</View>

				<TouchableOpacity onPress={() => {onClickSendRequest()}} style={globalStyles.button}>
					<Text style={globalStyles.buttonText}>
						Send Request
					</Text>
				</TouchableOpacity>
				<NjScreenBottomSpacer/>
			</ScrollView>
		</SafeAreaView>
	);
};
