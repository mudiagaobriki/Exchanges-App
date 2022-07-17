import React, {useEffect, useRef, useState} from "react";
import {
	ScrollView,
	TouchableOpacity,
	View,
	Alert,
	RefreshControl,
	ImageBackground,
	Dimensions,
	StyleSheet
} from "react-native";
import {Icon, Text, TextInput} from "../components";
import SafeAreaView from "react-native-safe-area-view";
import { useLocalization } from "../localization";
import {NjScreenBottomSpacer, NjWalletCarousel} from "../components";
import { WalletService } from "../services";
import {axiosApiErrorAlert} from "../helpers";
import {globalStyles} from "../helpers";
import DropDownPicker from "react-native-dropdown-picker";
import NavigationNames from "../navigations/NavigationNames";
import {useNavigation} from "@react-navigation/native";
import {StackNavigationProp} from "@react-navigation/stack";
import {sleepAsync} from "eas-cli/build/utils/promise";
import {Colors} from "../constants";
import Modal from "react-native-modal";

export const NjDepositScreen2 = ({ route }:any) => {
	const navigation = useNavigation<StackNavigationProp<any>>();
	const { getString } = useLocalization();
	const [bankDropDownPicker, setBankDropDownPicker] = useState(false);
	const [banks, setBanks] = useState([]);
	const [bank, setBank] = useState("");
	const [accountName, setAccountName] = useState("");
	const [accountNumber, setAccountNumber] = useState("");
	const [amount, setAmount] = useState("");
	const [currencyFrom, setCurrencyFrom] = useState("GHS")
	const [waitPayment, setWaitPayment] = useState(false);
	const [orderId, setOrderId] = useState("");
	const [modalVisible, setModalVisible] = useState(false);
	const [code, setCode] = useState("");
	const [submitClicked, setSubmitClicked] = useState(false);
	const NjWalletCarouselRef = useRef()

	const onClickDeposit = () => {
		if(currencyFrom == "" || accountName == "" || accountNumber == "" || amount == ""){
			Alert.alert(getString("please_fill_fields"));
			return;
		}
		WalletService.depositMoney(currencyFrom, amount, bank, accountName, accountNumber, code)
			.then((result) => {
				Alert.alert(result.message);
				if(result.success){
					setWaitPayment(true);
					setOrderId(String(result.order_id))
					if(result?.order_id) {
						refreshOrderStatus(result.order_id)
					}
				}
			})
			.catch((e) => {
				axiosApiErrorAlert(e)
			});
	}

	const refreshOrderStatus = (order_id: string|number|null) => {
		if(!order_id){return;}
		WalletService.getOrder(order_id)
			.then((result) => {
				if (['failed', 'completed'].includes(result.service_status)) {
					navigation.navigate(NavigationNames.NjTransactionDetailScreen, result);
				} else {
					// setTimeout(() =>refreshOrderStatus(order_id),2000)
					sleepAsync(2000).then(() => {
						refreshOrderStatus(order_id)
					})
				}
			})
	}

	const onRefresh = () => {
		// const currency = "UGX"
		const currency = route.params.data.sub_title.substr(0,3)
		console.log("data: ",route.params.data)
		setCurrencyFrom(currency)
		WalletService.getBanksDeposit(currency, 'deposit')
			.then((result) => {
				console.log("Banks: ", result.banks)
				setBanks(result.banks);
			})
	}

	useEffect(() => {
		refreshOrderStatus(orderId)
	}, [orderId])


	useEffect(() => {
		onRefresh();
	}, [route])


	return (
		<SafeAreaView style={globalStyles.container} forceInset={{ top: "always" }}>
			<ScrollView
				showsVerticalScrollIndicator={false}
				refreshControl={
					<RefreshControl
						refreshing={false}
						onRefresh={() => {
							refreshOrderStatus(orderId);
						}}
					/>
				}
			>
				<View style={{marginTop:10}}/>

				{/*<NjWalletCarousel ref={NjWalletCarouselRef}/>*/}

				<View style={{ flexDirection: "row" }}>
					<View style={styles.viewBox}>
						<ImageBackground style={styles.acInfoImage} source={require("../../assets/images/account-screen/ac-bg.png")}>
							<View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
								<View style={{ flex: 1, justifyContent: "center" }}>
									<Text
										style={{
											fontFamily: "Rubik-Regular",
											fontSize: 24,
											fontWeight: "bold",
											color: "white",
											textAlign: "center",
										}}
									>
										{route.params.data.sub_title || "GHS 0.00"}
									</Text>
								</View>
							</View>
						</ImageBackground>
					</View>
				</View>

				<View style={globalStyles.inputBox}>
					<TextInput
						style={globalStyles.input}
						inputProps={{
							placeholder: `Amount in ${currencyFrom}`,
							keyboardType: "number-pad",
							autoCorrect: false,
							value: amount,
							onChangeText: (val) => {
								setAmount(val)
							},
							editable: !waitPayment
						}}
					/>
				</View>

				<View style={globalStyles.inputBox}>
					<DropDownPicker
						schema={{
							label: 'name', // required
							value: 'id', // required
							icon: 'icon',
							parent: 'parent',
							selectable: 'selectable',
							disabled: 'disabled'
						}}
						listMode="MODAL"
						placeholder="Choose Bank"
						placeholderStyle={globalStyles.dropdownPlaceholder}
						labelStyle={globalStyles.dropdownPlaceholder}
						modalTitle="Choose Bank"
						open={bankDropDownPicker}
						value={bank}
						items={banks}
						setOpen={() => waitPayment ? () => {} : setBankDropDownPicker(true)}
						onClose={() => setBankDropDownPicker(false)}
						// @ts-ignore
						setValue={(val:Function) => {
							const bk = val()
							// console.log("Bank: ", bk)
							setBank(bk)
							setBankDropDownPicker(false)
						}}
						style={globalStyles.dropdown}
					/>
				</View>



				<View style={globalStyles.inputBox}>
					<TextInput
						style={globalStyles.input}
						inputProps={{
							placeholder: getString("Account Name"),
							value: accountName,
							onChangeText: setAccountName,
							editable: !waitPayment
						}}
					/>
				</View>

				<View style={globalStyles.inputBox}>
					<TextInput
						style={globalStyles.input}
						inputProps={{
							placeholder: getString("Account Number"),
							value: accountNumber,
							onChangeText: setAccountNumber,
							editable: !waitPayment
						}}
					/>
				</View>

				{	waitPayment ?
					<View style={{backgroundColor: "#ccc", paddingHorizontal: 30, paddingVertical: 20, borderRadius: 10, marginTop: 20 }}>
						<Text style={{ textAlign: "center", fontSize: 20 }}>Waiting for your payment...</Text>
						<Text style={{ textAlign: "center", marginTop: 10 }}>When we receive your payment amount will be credited to your wallet balance</Text>
					</View>
					:

					<TouchableOpacity onPress={() => {
						// console.log("Bank: ", bank.toString().length)
						if (bank.toString() === "281"){
							setModalVisible(true)
						}
						else{
							onClickDeposit()
						}
					}} style={globalStyles.button}>
						<Text style={globalStyles.buttonText}>
							Send Request
						</Text>
					</TouchableOpacity>
				}
				<NjScreenBottomSpacer/>

				<View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
					<Modal isVisible={modalVisible}>
						<View style={styles.modalView}>
							<View style={{ height: "auto" }}>
								<TouchableOpacity
									activeOpacity={1}
									onPress={() => {
										setModalVisible(false);
									}}
								>
									<Icon
										name="close"
										size={24}
										color="#131A22"
										style={{ alignItems: "flex-end" }}
									/>
								</TouchableOpacity>
								<TextInput
									style={{...globalStyles.input, marginTop: 20, alignContent: "center", alignItems: "center", borderColor: "#eeeeee", borderWidth: 1 }}
									inputProps={{
										style: {textAlign: "center", alignContent: "center", alignItems: "center", width: "100%",
										},
										placeholder: `OTP     `,
										keyboardType: "number-pad",
										autoCorrect: false,
										value: code,
										onChangeText: (val) => {
											setCode(val)
										},
									}}
								/>
								<TouchableOpacity style={[styles.button,{marginBottom: 20, justifyContent: "center"}]} onPress={() => {
									setSubmitClicked(true)
									onClickDeposit()
									setModalVisible(false)
								}} >
									<Text
										style={{
											color: !submitClicked? Colors.text_success: Colors.bg,
											fontWeight: "bold",
											textAlign: "center",
										}}
									>
										{!submitClicked? "Submit": "Submitting..."}
									</Text>
									{/*<Text style={{height: 150}}>*/}
									{/*    {route.params?.depositDetails[0]?.info || depositDetails[0]?.info} `M*/}
									{/*</Text>*/}
								</TouchableOpacity>

							</View>
						</View>
					</Modal>
				</View>


			</ScrollView>
		</SafeAreaView>
	);
};

const { width, height } = Dimensions.get("window");
const styles = StyleSheet.create({
	container: { flex: 1, paddingHorizontal: 30 },
	topBar: {
		backgroundColor: "#fff",
		flexDirection: "row",
		paddingTop: 10,
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
		marginBottom: 100,
	},
	inputFields: {
		marginTop: 20,
	},
	inputText: {
		fontSize: 16,
		marginBottom: 5,
		fontFamily: "Rubik-Regular",
	},
	viewBox: {
		justifyContent: "center",
		width: "100%",
		alignItems: "center"
	},
	acInfoImage: {
		resizeMode: "contain",
		width: "100%",
		height: (height - 200) / 4,
		borderRadius: 20,
		overflow: "hidden",
		marginTop: 20,
		marginBottom: 20,
	},
	modalView: {
		justifyContent: "center",
		backgroundColor: "#fff",
		borderRadius: 20,
		height: 'auto',
		padding: 30,
	},
});
