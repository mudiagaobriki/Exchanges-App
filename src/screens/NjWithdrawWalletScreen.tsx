import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  /*StyleSheet, */
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  View,
  Alert,
  Dimensions,
  StyleSheet,
  Modal,
} from "react-native";
import { Text, TextInput } from "../components";
import { useNavigation, useRoute } from "@react-navigation/native";
import SafeAreaView from "react-native-safe-area-view";
import { StackNavigationProp } from "@react-navigation/stack";
import { Colors } from "../constants";
import { NjScreenBottomSpacer } from "../components/NjScreenBottomSpacer";
import DropDownPicker from "react-native-dropdown-picker";
import { axiosApiErrorAlert, mf } from "../helpers";
import NavigationNames from "../navigations/NavigationNames";
// import {NjConfirmPaymentModal} from "../components/NjConfirmPaymentModal";
import { useLocalization } from "../localization";
import {
  AuthService,
  SystemService,
  UserService,
  WalletService,
} from "../services";
import { debounce } from "lodash";
import { globalStyles } from "../helpers";
import * as LocalAuthentication from "expo-local-authentication";
import * as SecureStore from "expo-secure-store";
import { AuthenticationContext } from "../context";
// import moment from "moment";
import { NjConfirmPaymentModalWithVerification } from "../components/NjConfirmPaymentModalWithVerification";
import axios from "axios";
import moment from "moment";
import { t } from "../localization/transfy";

export const NjWithdrawWalletScreen = () => {
  const { getString } = useLocalization();
  const navigation = useNavigation<StackNavigationProp<any>>();
  const [banks, setBanks] = useState([]);
  const [bankDropDownPicker, setBankDropDownPicker] = useState(false);
  const [bankCode, setBankCode] = useState("");
  const [bankName, setBankName] = useState("");
  const [accountName, setAccountName] = useState("");
  const [accountNameEditable, setAccountNameEditable] = useState(true);
  const [accountNumber, setAccountNumber] = useState("");
  const [amountFrom, setAmountFrom] = useState("");
  const [amountTo, setAmountTo] = useState("");
  const [accountCountry, setAccountCountry] = useState("");
  const [accountCountryCode, setAccountCountryCode] = useState("");
  const [showCountry, setShowCountry] = useState(false);
  const [description, setDescription] = useState("");
  const [fees, setFees] = useState([]);
  const [fee, setFee] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [otpModalVisible, setOtpModalVisible] = useState(false);
  const [cpData, setCpData] = useState<{ value: any; title: string }[]>();
  const [totalPayment, setTotalPayment] = useState("");
  const [dailyLimits, setDailyLimits] = useState({});
  const [currencyFromDropDownPicker, setCurrencyFromDropDownPicker] = useState(
    false
  );
  const [currencyToDropDownPicker, setCurrencyToDropDownPicker] = useState(
    false
  );
  const [currencyFrom, setCurrencyFrom] = useState("");
  const [currencyTo, setCurrencyTo] = useState("");
  const [displayedCurrencyTo, setDisplayedCurrencyTo] = useState(""); // Combination of currency and country shown on the dropdown
  const [countries, setCountries] = useState([]);
  const [uniqueCountries, setUniqueCountries] = useState([]);
  const [rates, setRates] = useState([]);
  const [rate, setRate] = useState(1);
  const [userType, setUserType] = useState("user");
  const [paymentMethod, setPaymentMethod] = useState("manual");
  const [userBalances, setUserBalances] = useState([]);
  const [isSecureEntry, setIsSecureEntry] = useState(true);
  const [isBiometricSupported, setIsBiometricSupported] = useState(false);
  const [fingerprintSetting, setFingerprintSetting] = useState<any | any>("");
  const [otp, setOtp] = useState("");
  const [otpEnabled, setOtpEnabled] = useState(null);
  const authContext = useContext(AuthenticationContext);
  const user = authContext.user;
  const [recentTransactions, setRecentTransactions] = useState([]);

  const route = useRoute();
  const currToRef = useRef();

  const onRefresh = () => {
    WalletService.getInfo().then((result) => {
      const { countries, balances, daily_limits } = result.data;
      // console.log("Countries: ", countries)
      let currency_codes = [];
      let uCountries = []; //Represents unique countries
      for (let i = 0; i < countries.length; i++) {
        if (!currency_codes.includes(countries[i].currency_code)) {
          currency_codes.push(countries[i].currency_code);
          uCountries.push(countries[i]);
        }
        countries[i].combinedLabel =
          countries[i].currency_code + ` (${countries[i].name})`;
      }
      // setUniqueCountries(currency_codes)
      console.log("Currency Codes : ", currency_codes);
      console.log("Unique Countries : ", uCountries);
      console.log("Countries with combined label: ", countries);
      // let c = [...new Set(countries)]
      // console.log("Set of Countries: ", c)
      setCountries(countries);
      setUniqueCountries(uCountries);
      // setCountries(c)
      setDailyLimits(daily_limits.withdraw);
      setUserBalances(balances);
    });
    SystemService.getConfig().then((result) => {
      const { exrts, ut, wmf } = result;
      setRates(exrts);
      setUserType(ut);
      setFees(wmf);
    });
    // axios.get("wallet/dt-orders")
    // 	.then((orders) => {
    // 		// console.log("Recent 20 Transactions: ", orders.data.data)
    // 		setRecentTransactions(orders.data.data);
    // 	})
    // 	.catch((err) => alert(err.message));
  };

  const fetchProfileDetails = () => {
    UserService.getProfileDetails()
      .then((profile) => {
        console.log("User Profile: ", profile);
        setOtpEnabled(profile?.withdraw_otp_verification_required);
      })
      .catch((err) => alert(err.message));
  };

  useEffect(() => {
    onRefresh();
    (async () => {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      setIsBiometricSupported(compatible);
    })();
  }, []);

  useEffect(() => {
    // @ts-ignore
    if (
      countries.length > 0 &&
      countries[0].currency_code &&
      currencyFrom === ""
    ) {
      // @ts-ignore
      let curr = countries.filter(
        (c) =>
          c.currency_code.toUpperCase() ===
          route?.params?.activeCurrency.toUpperCase()
      );
      // setCurrencyFrom(countries[0].currency_code)
      setCurrencyFrom(curr[0].currency_code);
      console.log("Currencies: ", curr);
    }

    getValueFor("fingerprint").then((result) => {
      setFingerprintSetting(result);
    });

    if (otpEnabled === null) {
      fetchProfileDetails();
    }

    console.log("Active Currency: ", route?.params?.activeCurrency);
    console.log("Fingerprint Setting:", fingerprintSetting);
    // console.log("User: ", authContext)
    console.log("User: ", user);
    console.log("OTP Enabled : ", otpEnabled);
    console.log("Account Name: ", accountName);
    console.log("Account Country: ", accountCountry);
    console.log("Account Country Code: ", accountCountryCode);
  }, [
    countries,
    fingerprintSetting,
    otpEnabled,
    accountName,
    accountCountry,
    accountCountryCode,
  ]);

  const fallBackToDefaultAuth = () => {
    console.log("fall back to otp authentication");
  };

  const alertComponent = (
    title: string,
    mess: string,
    btnTxt: string,
    btnFunc: any
  ) => {
    return Alert.alert(title, mess, [
      {
        text: btnTxt,
        onPress: btnFunc,
      },
    ]);
  };

  const handleBiometricAuth = async () => {
    // Check if hardware supports biometrics
    const isBiometricAvailable = await LocalAuthentication.hasHardwareAsync();

    // Fallback to default authentication method (password) if Fingerprint is not available
    if (!isBiometricAvailable)
      return alertComponent(
        "Please enter your password",
        "Biometric Authentication not supported",
        "OK",
        () => fallBackToDefaultAuth()
      );

    // Check Biometrics types available (Fingerprint, Facial recognition, Iris recognition)
    let supportedBiometrics;
    if (isBiometricAvailable)
      supportedBiometrics = await LocalAuthentication.supportedAuthenticationTypesAsync();

    // Check Biometrics are saved locally in user's device
    const savedBiometrics = await LocalAuthentication.isEnrolledAsync();
    if (!savedBiometrics)
      return alertComponent(
        "Biometric record not found",
        "Please confirm with your password",
        "OK",
        () => fallBackToDefaultAuth()
      );

    // Authenticate use with Biometrics (Fingerprint, Facial recognition, Iris recognition)

    const biometricAuth = await LocalAuthentication.authenticateAsync({
      promptMessage: "Confirm with Fingerprint",
      cancelLabel: "Cancel",
      disableDeviceFallback: true,
    });
    // Log the user in on success
    if (biometricAuth.success) {
      // navigation.navigate(NavigationNames.HomeNavigator)
      // confirmWithdraw()
      onClickWithdraw();
      console.log("success");
    } else {
      Alert.alert(
        `${t(
          "Wrong Fingerprint or Fingerprint verification cancelled by user"
        )}`
      );
    }

    // console.log({ isBiometricAvailable });
    // console.log({ supportedBiometrics });
    // console.log({ savedBiometrics });
    // console.log({ biometricAuth });
  };

  const onClickWithdraw = () => {
    setModalVisible(false);
    // let countryTo = ""
    // if (currencyTo === "XAF"){
    // 	countryTo = "cameroon"
    // }
    // else if (currencyTo === "XOF"){
    // 	countryTo = "ivory_coast"
    // }

    WalletService.withdrawMoney({
      currency_from: currencyFrom,
      currency_to: currencyTo,
      bank_id: bankCode,
      account_name: accountName,
      account_number: accountNumber,
      amount: amountFrom,
      account_country:
        accountCountryCode !== "" ? accountCountryCode.toLowerCase() : "",
    })
      .then((result) => {
        if (result.order) {
          // onRefresh();
          navigation.replace(
            NavigationNames.NjTransactionDetailScreen,
            result.order
          );
        } else {
          setAccountName("");
          setAccountNumber("");
          setAmountFrom("");
          setAmountTo("");
          Alert.alert(result.message, "Order ID: #" + result.order_id);
        }
      })
      .catch((e) => {
        axiosApiErrorAlert(e);
      });
  };

  // const fetchAccountName = useCallback(debounce((currencyToVal: string, bankCodeVal: string,	accountNumberVal: string) => {
  // 	if(!currencyTo || !bankCodeVal || !accountNumberVal || paymentMethod == "manual" || currencyToVal.toUpperCase() != "NGN"){
  // 		return false
  // 	}
  //
  // 	console.log("Fetching")
  //
  // 	setAccountName("Fetching...")
  // 	setAccountNameEditable(false)
  //
  // 	WalletService.verifyBankAccount(currencyTo, bankCodeVal, accountNumberVal)
  // 		.then((result) => {
  // 			console.log("Account fetching Result: ", result)
  // 			if(result.success){
  // 				setAccountNameEditable(false)
  // 				setAccountName(result.account_name)
  // 				console.log(result.account_name)
  // 			}else{
  // 				console.log("Error fetching account name")
  // 				setAccountNameEditable(true)
  // 				setAccountName("")
  // 			}
  // 		})
  // 		.catch((e) => {
  // 			axiosApiErrorAlert(e)
  // 		});
  // }, 500), []);

  const fetchAccountName = (
    currencyToVal: string,
    bankCodeVal: string,
    accountNumberVal: string
  ) => {
    if (
      !currencyTo ||
      !bankCodeVal ||
      !accountNumberVal ||
      paymentMethod == "manual" ||
      currencyToVal.toUpperCase() != "NGN"
    ) {
      return false;
    }

    console.log("Fetching");

    setAccountName("Fetching...");
    setAccountNameEditable(false);

    WalletService.verifyBankAccount(currencyTo, bankCodeVal, accountNumberVal)
      .then((result) => {
        console.log("Account fetching Result: ", result);
        if (result.success) {
          setAccountNameEditable(false);
          setAccountName(result.account_name);
          console.log(result.account_name);
        } else {
          console.log("Error fetching account name");
          setAccountNameEditable(true);
          setAccountName("  Account Name not found.");
        }
      })
      .catch((e) => {
        axiosApiErrorAlert(e);
      });
  };

  const confirmWithdraw = () => {
    if (
      amountFrom === "" ||
      bankCode === "" ||
      accountName === "" ||
      accountNumber === ""
    ) {
      Alert.alert(getString(`${t("please fill fields")}`));
      return;
    }

    const fAmountFrom = mf(parseFloat(amountFrom), currencyFrom, {
      decimal: 2,
    });
    const fAmountTo = mf(parseFloat(amountTo), currencyTo, { decimal: 2 });

    setTotalPayment(fAmountTo);

    setCpData([
      { title: "Bank Name", value: bankName },
      { title: "Account Name", value: accountName },
      { title: "Account Number", value: accountNumber },
      { title: "Withdraw From", value: fAmountFrom },
      { title: "Withdraw To", value: fAmountTo },
      { title: "Description", value: description },
    ]);

    setModalVisible(true);

    // axios.get("wallet/dt-orders")
    // 	.then((orders) => {
    // 		console.log("Recent 20 Transactions: ", orders.data.data)
    // 		setRecentTransactions(orders.data.data);
    //
    // 		let a = moment(new Date(orders.data.data[0]?.date))
    // 		let b = moment(new Date())
    // 		let timeDifference = b.diff(a,"minutes")
    //
    // 		console.log("A: ", a)
    // 		console.log("B: ", b)
    // 		console.log("Current Time Difference in minutes: ", timeDifference)
    //
    //
    // 		const fAmountFrom = mf(parseFloat(amountFrom), currencyFrom, {decimal: 2})
    // 		const fAmountTo = mf(parseFloat(amountTo), currencyTo, {decimal: 2})
    //
    // 		setTotalPayment(fAmountTo)
    //
    // 		// console.log("Amount from: ", amountFrom)
    // 		// console.log("Amount to: ", amountTo)
    // 		// console.log("Currency to: ", currencyTo)
    // 		// console.log("Currency From: ", currencyFrom)
    // 		// console.log("Recent Currency: ", recentTransactions[0].currency_code)
    // 		// console.log("Comparison: ", currencyTo, "Base: ", Number(amountFrom) === Number(recentTransactions[0].raw_package_amount))
    //
    // 		// if ((orders.data.data[0].type === "withdraw") && (timeDifference < 5) && (Number(amountFrom) === Number(orders.data.data[0].raw_package_amount) &&
    // 		// 	(currencyTo.trim() === orders.data.data[0].currency_code.trim()))){
    // 		// 	Alert.alert("Duplicate Transaction. Please wait a few minutes before tyring again")
    // 		// 	return
    // 		// }
    //
    // 		setCpData([
    // 			{title: "Bank Name", value: bankName},
    // 			{title: "Account Name", value: accountName},
    // 			{title: "Account Number", value: accountNumber},
    // 			{title: "Withdraw From", value: fAmountFrom},
    // 			{title: "Withdraw To", value: fAmountTo},
    // 			{title: "Description", value: description},
    // 		])
    //
    // 		setModalVisible(true)
    //
    // 	})
    // 	.catch((err) => alert(err.message));
  };

  const fetchBanks = (currencyCode: string, countryCode: string) => {
    WalletService.getBanks(currencyCode).then((result) => {
      // console.log('result.banks', result.banks)
      // console.log('Selected Account Country Code: ', accountCountryCode)
      let selectedCountyBanks = result.banks.filter(
        (b) => b.country_code.trim() === countryCode.trim()
      );
      // setBanks(result.banks);
      setBanks(selectedCountyBanks);
    });
  };

  const fetchOrderPaymentMethod = (
    currencyToVal: string,
    bankCodeVal: string
  ) => {
    if (!currencyToVal || !bankCodeVal) {
      return false;
    }
    WalletService.getOrderPaymentMethod("withdraw", currencyToVal, bankCodeVal)
      .then((pm) => {
        setPaymentMethod(pm);
      })
      .catch((e) => {
        axiosApiErrorAlert(e);
      });
  };

  async function getValueFor(key) {
    let result = await SecureStore.getItemAsync(key);
    if (result) {
      return result;
      // alert("🔐 Here's your value 🔐 \n" + result);
    } else {
      console.log("No fingerprint settings stored for this device.");
    }
  }

  const onClickGetOTP = () => {
    let email = user?.email;

    // setOtpModalVisible(true)

    AuthService.otp("profile")
      .then(async (success: any) => {
        if (success) {
          // console.log("Success: ", success)
          Alert.alert(`${t("OTP was sent to your registered mobile number")}`);
          // setOtpModalVisible(true)
        } else {
          Alert.alert(`${t("Something went wrong, Please try again later")}`);
        }
      })
      .catch((e) => Alert.alert(e.message));
    console.log("sms-verification", "result1");
  };

  const verifyOTP = (OTP: string) => {
    if (OTP === "") {
      Alert.alert(`${t("Please input the OTP sent to your mobile number")}`);
      return;
    }
    AuthService.verifyOTP("profile", OTP)
      .then((result) => {
        if (result.success) {
          confirmWithdraw();
          // Alert.alert("Successfully Verified")
        } else {
          Alert.alert(`${t("Invalid OTP")}`);
          // alert(result.message);
        }
      })
      .catch((e) => {
        axiosApiErrorAlert(e);
      });

    setOtpModalVisible(false);
  };

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
        {currencyFrom && Object.keys(dailyLimits).length !== 0 ? (
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: 10,
            }}
          >
            {/* @ts-ignore */}
            <Text>
              {currencyFrom} {t("Balance")}: {userBalances[currencyFrom]}
            </Text>
            {/* @ts-ignore */}
            <Text>
              {t("Limit")}:{" "}
              {dailyLimits.total[currencyFrom] -
                dailyLimits.exceed[currencyFrom] >
              0
                ? dailyLimits.total[currencyFrom] -
                  dailyLimits.exceed[currencyFrom]
                : 0}{" "}
              / {dailyLimits.total[currencyFrom]}
            </Text>
          </View>
        ) : (
          <></>
        )}
        {/*<View style={{ flexDirection: "row" }}>*/}
        {/*	<View style={styles.viewBox}>*/}
        {/*		<ImageBackground style={[styles.acInfoImage,{height: 50, width: 230, borderRadius: 15}]} source={require("../../assets/images/account-screen/ac-bg.png")}>*/}
        {/*			<View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>*/}
        {/*				<View style={{ flex: 1, justifyContent: "center" }}>*/}
        {/*					<Text*/}
        {/*						style={{*/}
        {/*							fontFamily: "Rubik-Regular",*/}
        {/*							fontSize: 16,*/}
        {/*							fontWeight: "normal",*/}
        {/*							color: "black",*/}
        {/*							textAlign: "center",*/}
        {/*						}}*/}
        {/*					>*/}
        {/*						Mobile Money*/}
        {/*					</Text>*/}
        {/*				</View>*/}
        {/*			</View>*/}
        {/*		</ImageBackground>*/}
        {/*	</View>*/}
        {/*</View>*/}
        <View
          style={{
            ...globalStyles.inputBox,
            ...{ flexDirection: "row", marginTop: 50 },
          }}
        >
          <View style={{ flex: 0.6, marginRight: 10 }}>
            <DropDownPicker
              schema={{
                label: "currency_code", // required
                value: "currency_code", // required
                icon: "icon",
                parent: "parent",
                selectable: "selectable",
                disabled: "disabled",
              }}
              listMode="MODAL"
              placeholder={t("From")}
              placeholderStyle={globalStyles.dropdownPlaceholder}
              labelStyle={globalStyles.dropdownPlaceholder}
              modalTitle={t("Withdraw From")}
              open={currencyFromDropDownPicker}
              value={currencyFrom}
              // items={countries}
              items={uniqueCountries}
              setOpen={() => setCurrencyFromDropDownPicker(true)}
              onClose={() => setCurrencyFromDropDownPicker(false)}
              // @ts-ignore
              setValue={(val: Function) => {
                const cc = val();
                console.log("Currency From: ", cc);
                setCurrencyFrom(cc);
                setCurrencyFromDropDownPicker(false);
                // @ts-ignore
                const rt =
                  currencyTo && cc
                    ? parseFloat(rates[`${cc}_${currencyTo}`])
                    : 1;
                setRate(rt);
                if (rt && amountFrom) {
                  setAmountTo(String(parseFloat(amountFrom) * rt));
                } else {
                  setAmountTo("");
                }
                if (currencyTo && cc) {
                  // @ts-ignore
                  setFee(fees[`${cc}_${currencyTo}_${userType}`]);
                } else {
                  setFee(0);
                }
              }}
              style={globalStyles.dropdown}
            />
          </View>
          <View style={{ flex: 1 }}>
            <TextInput
              style={{
                ...globalStyles.input,
                alignContent: "center",
                alignItems: "center",
              }}
              inputProps={{
                style: {
                  textAlign: "center",
                  alignContent: "center",
                  alignItems: "center",
                },
                placeholder: `${t("Amount in")} ${currencyFrom}    `,
                keyboardType: "number-pad",
                autoCorrect: false,
                value: amountFrom,
                onChangeText: (val) => {
                  val = val.replace(/,/g, "");
                  setAmountFrom(val);
                  if (rate && val) {
                    setAmountTo(String(parseFloat(val) * rate));
                  } else {
                    setAmountTo("");
                  }
                },
              }}
            />
            {/*<TextInput*/}
            {/*	style={{...globalStyles.input, alignContent: "center", alignItems: "center", }}*/}
            {/*	keyboardType={"number-pad"}*/}
            {/*	value={amountFrom}*/}
            {/*	autoCorrect={false}*/}
            {/*	placeholder={`Amount in ${currencyFrom}`}*/}
            {/*	onChangeText={ (val) => {*/}
            {/*		setAmountFrom(val)*/}
            {/*		if(rate && val){*/}
            {/*			setAmountTo(String(parseFloat(val) * rate ))*/}
            {/*		}else{*/}
            {/*			setAmountTo("")*/}
            {/*		}*/}
            {/*	}}*/}
            {/*/>*/}
          </View>
        </View>
        <View style={globalStyles.inputBox}>
          <DropDownPicker
            schema={{
              // label: 'currency_code', // required
              label: "combinedLabel",
              // value: 'currency_code', // required
              value: "combinedLabel", // required
              icon: "icon",
              parent: "parent",
              selectable: "selectable",
              disabled: "disabled",
            }}
            listMode="MODAL"
            placeholder={t("Withdraw To")}
            placeholderStyle={globalStyles.dropdownPlaceholder}
            labelStyle={globalStyles.dropdownPlaceholder}
            modalTitle="Withdraw To"
            open={currencyToDropDownPicker}
            value={displayedCurrencyTo}
            items={countries}
            setOpen={() => setCurrencyToDropDownPicker(true)}
            onClose={() => setCurrencyToDropDownPicker(false)}
            ref={currToRef}
            // @ts-ignore
            setValue={(val: Function) => {
              let cc = val();
              setDisplayedCurrencyTo(cc);
              let selectedCountry =
                countries.length > 0
                  ? countries.filter((k) => k.combinedLabel === cc)
                  : "";
              // console.log("Selected To Country: ", selectedCountry)
              setAccountCountry(selectedCountry[0].name);
              setAccountCountryCode(selectedCountry[0].code);
              cc = cc.slice(0, cc.indexOf("(")).trim();
              fetchOrderPaymentMethod(cc, bankCode);
              setCurrencyTo(cc);
              fetchBanks(cc, selectedCountry[0].code);
              setCurrencyToDropDownPicker(false);
              fetchAccountName(cc, val(), accountNumber); //Check here
              // @ts-ignore
              const rt =
                currencyFrom && cc
                  ? parseFloat(rates[`${currencyFrom}_${cc}`])
                  : 1;
              setRate(rt);
              if (rt && amountFrom) {
                setAmountTo(String(parseFloat(amountFrom) * rt));
              } else {
                setAmountTo("");
              }
              if (currencyFrom && cc) {
                // @ts-ignore
                setFee(fees[`${currencyFrom}_${cc}_${userType}`]);
              } else {
                setFee(0);
              }
              console.log("Currency To: ", cc);
              // if (currencyTo === "XAF" || currencyTo === "XOF"){
              // 	setShowCountry(true)
              // }
              // else {
              // 	setShowCountry(false)
              // }
            }}
            style={globalStyles.dropdown}
          />
        </View>
        {showCountry && (
          <View style={globalStyles.inputBox}>
            <TextInput
              style={globalStyles.input}
              inputProps={{
                placeholder: "Country",
                placeholderTextColor: "#0072f8",
                // keyboardType: "numeric",
                autoCorrect: false,
                value: accountCountry,
                // onChangeText: (val) => {
                // 	setAccountCountry(val)
                // 	// Alert.alert("Value: ", val)
                // 	// fetchAccountName(currencyTo, bankCode, val)
                // },
                // onChange: (val) => {
                // 	// setAccountNumber(val)
                // 	console.log("Value: ", val)
                // 	// fetchAccountName(currencyTo, bankCode, val)
                // },
                // onEndEditing: () => {
                // 	console.log("Finished Editing Val: ", accountNumber)
                // 	fetchAccountName(currencyTo, bankCode, accountNumber)
                // }
              }}
            />
          </View>
        )}
        <View style={globalStyles.inputBox}>
          <DropDownPicker
            schema={{
              label: "name", // required
              value: "id", // required
              icon: "icon",
              parent: "parent",
              selectable: "selectable",
              disabled: "disabled",
            }}
            listMode="MODAL"
            placeholder="Choose Bank"
            placeholderStyle={globalStyles.dropdownPlaceholder}
            labelStyle={globalStyles.dropdownPlaceholder}
            modalTitle="Choose Bank"
            open={bankDropDownPicker}
            value={bankCode}
            items={banks}
            setOpen={() => setBankDropDownPicker(true)}
            onClose={() => setBankDropDownPicker(false)}
            // @ts-ignore
            setValue={(val: Function) => {
              const bk = val();
              setBankCode(bk);
              fetchOrderPaymentMethod(currencyTo, bk);
              let name = "";
              banks.map((r) => {
                // @ts-ignore
                if (r.id === bk) {
                  // @ts-ignore
                  name = r.name;
                }
              });
              setBankName(name);
              setBankDropDownPicker(false);
              fetchAccountName(currencyTo, bk, accountNumber);
            }}
            style={globalStyles.dropdown}
          />
        </View>
        <View style={globalStyles.inputBox}>
          <TextInput
            style={globalStyles.input}
            inputProps={{
              placeholder: `${t("Account Number")}`,
              placeholderTextColor: "#0072f8",
              keyboardType: "numeric",
              autoCorrect: false,
              value: accountNumber,
              onChangeText: (val) => {
                setAccountNumber(val);
                // Alert.alert("Value: ", val)
                // fetchAccountName(currencyTo, bankCode, val)
              },
              // onChange: (val) => {
              // 	// setAccountNumber(val)
              // 	console.log("Value: ", val)
              // 	// fetchAccountName(currencyTo, bankCode, val)
              // },
              onEndEditing: () => {
                console.log("Finished Editing Val: ", accountNumber);
                fetchAccountName(currencyTo, bankCode, accountNumber);
              },
            }}
          />
          {/*<TextInput*/}
          {/*	style={globalStyles.input}*/}
          {/*	placeholderTextColor={"#0072f8"}*/}
          {/*	keyboardType={"numeric"}*/}
          {/*	autoCorrect={false}*/}
          {/*	value={accountNumber}*/}
          {/*	onChangeText={(val)=>{*/}
          {/*		setAccountNumber(val)*/}
          {/*		console.log("Value: ", val)*/}
          {/*		fetchAccountName(currencyTo, bankCode, val)*/}
          {/*	}*/}
          {/*	}*/}
          {/*	placeholder={"Account Number"}*/}

          {/*/>*/}
        </View>
        <View style={[globalStyles.inputBox]}>
          <TextInput
            style={[globalStyles.input, { marginLeft: -13, borderRadius: 0 }]}
            inputProps={{
              placeholder: `${t("Account Name")}`,
              autoCorrect: false,
              value: accountName,
              onChangeText: setAccountName,
              editable: accountNameEditable,
            }}
          />
          {/*<TextInput*/}
          {/*	style={[globalStyles.input, {marginLeft: -13, borderRadius:0}]}*/}
          {/*	placeholder={"Account Name"}*/}
          {/*	autoCorrect={false}*/}
          {/*	value={accountName}*/}
          {/*	onChangeText={setAccountName}*/}
          {/*	editable={accountNameEditable}*/}
          {/*/>*/}
        </View>
        <View style={{ paddingHorizontal: 5 }}>
          <Text style={{ color: "#131A22", marginTop: 10 }}>
            {t(
              "Enter your account number to get the account name If your account name doesn't fetch you can input manually If you're Sending to a mobile money number input the mobile number in international prefix without the plus sign"
            )}
          </Text>
        </View>
        <View style={globalStyles.inputBox}>
          <TextInput
            style={globalStyles.input}
            inputProps={{
              placeholder: `${t("Description (Optional)")}`,
              value: description,
              onChangeText: setDescription,
            }}
          />
          {/*<TextInput*/}
          {/*	style={globalStyles.input}*/}
          {/*	placeholder={"Description (Optional)"}*/}
          {/*	value={description}*/}
          {/*	onChangeText={setDescription}*/}
          {/*/>*/}
        </View>
        <View style={{ paddingHorizontal: 5 }}>
          {currencyFrom !== currencyTo ? (
            <Text style={{ fontWeight: "bold", marginTop: 10 }}>
              {t("RATE")}::
              {amountFrom
                ? `${mf(parseFloat(amountFrom), currencyFrom)} = ${mf(
                    parseFloat(amountTo),
                    currencyTo
                  )} at`
                : ""}
              {` ${mf(1, currencyFrom)} = ${mf(rate, currencyTo)}`}
            </Text>
          ) : (
            <></>
          )}
          {fee && currencyFrom ? (
            <Text
              style={{
                fontWeight: "bold",
                marginTop: 10,
                color: Colors.text_info,
              }}
            >
              {`Transaction fee: ${mf(fee, currencyFrom)}`}
            </Text>
          ) : (
            <></>
          )}
          <Text style={{ marginTop: 20 }}>
            NB:{" "}
            {t(
              "Ensure you’re sending to the correct beneficiary details Funds sent to a wrongful user can’t be reversed"
            )}
          </Text>
        </View>
        {/*{(otpEnabled === "yes") && <View style={styles.topitInputData}>*/}
        {/*	<Text style={styles.inputText}>OTP to verify your withdrawal</Text>*/}
        {/*	<View style={{ flexDirection: "row" }}>*/}
        {/*		<TextInput*/}
        {/*			style={{ flex: 1, paddingRight: 65 }}*/}
        {/*			inputProps={{*/}
        {/*				placeholder: getString("OTP"),*/}
        {/*				secureTextEntry: true,*/}
        {/*				textContentType: "none",*/}
        {/*				autoCorrect: false,*/}
        {/*				keyboardType: "numeric",*/}
        {/*				value: otp,*/}
        {/*				onChangeText: setOtp,*/}
        {/*			}}*/}
        {/*		/>*/}
        {/*		<TouchableOpacity*/}
        {/*			style={{*/}
        {/*				padding: 7,*/}
        {/*				borderRadius: 10,*/}
        {/*				marginLeft: 5,*/}
        {/*				position: "absolute",*/}
        {/*				right: 10,*/}
        {/*			}}*/}
        {/*			onPress={onClickGetOTP}*/}
        {/*		>*/}
        {/*			<Text*/}
        {/*				style={{*/}
        {/*					paddingVertical: 10,*/}
        {/*					color: Colors.text_success,*/}
        {/*					fontSize: 15,*/}
        {/*					fontWeight: "bold",*/}
        {/*					textDecorationLine: "underline",*/}
        {/*				}}*/}
        {/*			>*/}
        {/*				Get OTP*/}
        {/*			</Text>*/}
        {/*		</TouchableOpacity>*/}
        {/*	</View>*/}
        {/*</View>}*/}

        {
          <TouchableOpacity
            style={[globalStyles.button, { marginBottom: -10 }]}
            onPress={() => {
              confirmWithdraw();
              // v
            }}
          >
            <Text
              style={{
                color: Colors.text_success,
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              {t("Withdraw")}
            </Text>
          </TouchableOpacity>
        }

        {/*{fingerprintSetting === "on" && <TouchableOpacity style={[globalStyles.button,{  marginTop: 25}]} onPress={() => fingerprintSetting === "on"? handleBiometricAuth():*/}
        {/*	Alert.alert("Fingerprint not activated in account settings")}>*/}
        {/*	<Text*/}
        {/*		style={{*/}
        {/*			color: Colors.text_success,*/}
        {/*			fontWeight: "bold",*/}
        {/*			textAlign: "center",*/}
        {/*		}}*/}
        {/*	>*/}
        {/*		Withdraw with FingerPrint*/}
        {/*	</Text>*/}
        {/*</TouchableOpacity>}*/}
        <NjScreenBottomSpacer />
      </ScrollView>
      <Modal
        animationType="slide"
        transparent={true}
        visible={otpModalVisible}
        onRequestClose={() => {
          setOtpModalVisible(false);
        }}
      >
        <ScrollView>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <View style={globalStyles.inputBox}>
                <TextInput
                  style={globalStyles.input}
                  inputProps={{
                    placeholder: "Confirm with OTP      ",
                    autoCorrect: false,
                    value: otp,
                    onChangeText: setOtp,
                    editable: accountNameEditable,
                    keyboardType: "numeric",
                  }}
                />
              </View>

              <TouchableOpacity
                style={[
                  styles.button,
                  styles.buttonClose,
                  { justifyContent: "center", width: 150 },
                ]}
                onPress={() => {
                  verifyOTP(otp);
                  // console.log(otp)
                  // setOtpModalVisible(false);
                }}
              >
                <Text style={styles.textStyle}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </Modal>
      {/*<NjConfirmPaymentModal*/}
      {/*	modalVisible={modalVisible}*/}
      {/*	setModalVisible={(value:boolean) => setModalVisible(value)}*/}
      {/*	onModalSubmit={() => onClickWithdraw()}*/}
      {/*	data={cpData}*/}
      {/*	heading="Confirm Withdraw"*/}
      {/*	totalPaymentText="You will receive"*/}
      {/*	totalPayment={totalPayment + ""}*/}
      {/*/>*/}

      <NjConfirmPaymentModalWithVerification
        modalVisible={modalVisible}
        setModalVisible={(value: boolean) => setModalVisible(value)}
        onModalSubmit={() => onClickWithdraw()}
        data={cpData}
        heading="Confirm Withdraw"
        totalPaymentText="You will receive"
        totalPayment={totalPayment + ""}
        otpEnabled={otpEnabled}
        user={user}
        fingerprintSetting={fingerprintSetting}
        onVerifyFingerprintClick={handleBiometricAuth}
      />
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
  currencyBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FCFBFC",
    borderRadius: 20,
    width: 150,
    height: 70,
    justifyContent: "center",
    marginRight: 10,
  },
  currencyImage: {
    width: 50,
    height: 50,
  },
  currencyText: {
    paddingLeft: 10,
    color: "#000",
    fontFamily: "Rubik-Regular",
    fontSize: 15,
    fontWeight: "bold",
  },
  paginationContainerStyle: {
    paddingVertical: 0,
    marginTop: 6,
  },
  paginationDotStyle: {
    marginHorizontal: -20,
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
  transferWalletInput: {
    paddingTop: 50,
    backgroundColor: "#fff",
    height: 60,
    paddingLeft: 10,
  },
  transferWalletLabel: {
    color: "#131A22",
    fontSize: 18,
    fontFamily: "Rubik-Regular",
    fontWeight: "bold",
    paddingBottom: 60,
  },
  inputData: {
    marginTop: 20,
  },
  inputText: {
    fontSize: 16,
    marginBottom: 5,
    fontFamily: "Rubik-Regular",
    marginTop: 30,
  },
  modalView: {
    justifyContent: "center",
    backgroundColor: "#000",
    borderRadius: 20,
    height: "auto",
    padding: 30,
  },
  paymentText: {
    color: "#B8B8B8",
    fontSize: 16,
    fontFamily: "Rubik-Regular",
    fontWeight: "normal",
    lineHeight: 30,
  },
  paymentTextDetail: {
    color: "#131A22",
    fontSize: 16,
    fontFamily: "Rubik-Regular",
    fontWeight: "normal",
    lineHeight: 30,
    textAlign: "right",
  },
  payButton: {
    marginVertical: 24,
    backgroundColor: "#E8FFF1",
    borderColor: "#E8FFF1",
    color: Colors.text_success,
    borderRadius: 50,
    height: 65,
    width: "100%",
    alignSelf: "center",
    fontSize: 22,
  },
  paymentLogo: {
    width: 50,
    height: 70,
  },
  viewBox: {
    justifyContent: "center",
    width: "100%",
    alignItems: "center",
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
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: height / 3,
    backgroundColor: "red",
    alignContent: "center",
    alignSelf: "center",
  },
  buttonClose: {
    backgroundColor: "#28a745",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  topitInputData: {
    marginTop: 5,
  },
});
