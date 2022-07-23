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
import {Simulate} from "react-dom/test-utils";
// import load = Simulate.load;

export const NjBeneficiaryScreen = () => {
  const { getString } = useLocalization();
  const navigation = useNavigation<StackNavigationProp<any>>();
  const [banks, setBanks] = useState([]);
  const [bankDropDownPicker, setBankDropDownPicker] = useState(false);
  const [bankCode, setBankCode] = useState(route?.params?.beneficiary.bank_id || "");
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

  const [loadedBeneficiary, setLoadedBeneficiary] = useState(route?.params?.beneficiary)
  const [edit, setEdit] = useState(route?.params?.edit)

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
      // console.log("Currency Codes : ", currency_codes);
      // console.log("Unique Countries : ", uCountries);
      console.log("Countries with combined label: ", countries);
      // let c = [...new Set(countries)]
      // console.log("Set of Countries: ", c)
      setCountries(countries);
      setUniqueCountries(uCountries);
      // setCountries(c)
      setDailyLimits(daily_limits.withdraw);
      setUserBalances(balances);

      console.log("Loaded Currency: ", countries.filter(c => c.combinedLabel.includes(loadedBeneficiary.currency)))
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
        // console.log("User Profile: ", profile);
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

  useEffect(()=> {
    console.log("Loaded Beneficiary: ", loadedBeneficiary)

    console.log("Edit: ", edit)

    if (loadedBeneficiary != undefined && Object.keys(loadedBeneficiary).length > 0){

      if (countries.filter(c => c.combinedLabel.includes(loadedBeneficiary.currency)).length > 0){
        setDisplayedCurrencyTo(countries.filter(c => c.combinedLabel.includes(loadedBeneficiary.currency))[0].combinedLabel)
        let selectedCountry =
            countries.length > 0
                ? countries.filter((k) => k.combinedLabel === countries.filter(c => c.combinedLabel.includes(loadedBeneficiary.currency))[0].combinedLabel)
                : "";
        console.log("Selected To Countryy: ", selectedCountry)
        // setAccountCountry(selectedCountry[0].name);
        // setAccountCountryCode(selectedCountry[0].code);
        // cc = cc.slice(0, cc.indexOf("(")).trim();
        // fetchOrderPaymentMethod(cc, bankCode);
        // setCurrencyTo(cc);
        fetchBanks(loadedBeneficiary.currency, selectedCountry[0].code);
      }
      setCurrencyTo(loadedBeneficiary.currency)
      setBankCode(loadedBeneficiary.bank_id)
      let name = "";
      banks.map((r) => {
        // @ts-ignore
        if (r.id === loadedBeneficiary.bank_id) {
          // @ts-ignore
          name = r.name;
        }
      });
      setBankName(name);
      setAccountName(loadedBeneficiary.account_name)
      setAccountNumber(loadedBeneficiary.account_number)
    }
  },[countries])

  useEffect(() => {
  //   // @ts-ignore
  //   if (
  //     countries.length > 0 &&
  //     countries[0].currency_code &&
  //     currencyFrom === ""
  //   ) {
  //     // @ts-ignore
  //     let curr = countries.filter(
  //       (c) =>
  //         c.currency_code.toUpperCase() ===
  //         route?.params?.activeCurrency.toUpperCase()
  //     );
  //     // setCurrencyFrom(countries[0].currency_code)
  //     setCurrencyFrom(curr[0].currency_code);
  //     console.log("Currencies: ", curr);
  //   }

    // getValueFor("fingerprint").then((result) => {
    //   setFingerprintSetting(result);
    // });

    if (otpEnabled === null) {
      fetchProfileDetails();
    }

    // console.log("Active Currency: ", route?.params?.activeCurrency);
    // console.log("Fingerprint Setting:", fingerprintSetting);
    // console.log("User: ", authContext)
    // console.log("User: ", user);
    // console.log("OTP Enabled : ", otpEnabled);
    // console.log("Account Name: ", accountName);
    // console.log("Account Country: ", accountCountry);
    // console.log("Account Country Code: ", accountCountryCode);
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

  const addBeneficiary = () => {
    if (edit){
      WalletService.deleteBeneficiary(loadedBeneficiary.id)
          .then(() => {
            const payload = {
              account_name: accountName,
              account_number: accountNumber,
              bank_id: bankCode,
              currency: displayedCurrencyTo
                  .substring(0, displayedCurrencyTo.indexOf("("))
                  .trim(),
              deposit: 1,
            };
            console.log("Payload: ", payload);
            WalletService.addBeneficiary(payload)
                .then((res) => {
                  console.log("Response: ", res);
                  alert("Beneficiary added successfully");
                  navigation.navigate(NavigationNames.NjWithdrawWalletScreen);
                })
                .catch((err) => console.log("Error: ", err));
          })
          .catch(err => console.log("Error in deleting beneficiary: ", err))
    }
    else{
      const payload = {
        account_name: accountName,
        account_number: accountNumber,
        bank_id: bankCode,
        currency: displayedCurrencyTo
            .substring(0, displayedCurrencyTo.indexOf("("))
            .trim(),
        deposit: 1,
      };
      console.log("Payload: ", payload);
      WalletService.addBeneficiary(payload)
          .then((res) => {
            console.log("Response: ", res);
            alert("Beneficiary added successfully");
            navigation.navigate(NavigationNames.NjWithdrawWalletScreen);
          })
          .catch((err) => console.log("Error: ", err));
    }

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
          // confirmWithdraw();
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
        <View
          style={{
            ...globalStyles.inputBox,
            ...{ flexDirection: "row", marginTop: 90 },
          }}
        ></View>
        <View
          style={[globalStyles.inputBox, { marginTop: 50, marginBottom: 20 }]}
        >
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
            placeholder={t("Currency")}
            placeholderStyle={globalStyles.dropdownPlaceholder}
            labelStyle={globalStyles.dropdownPlaceholder}
            modalTitle={t("Currency")}
            open={currencyToDropDownPicker}
            value={displayedCurrencyTo}
            items={countries}
            setOpen={() => setCurrencyToDropDownPicker(true)}
            onClose={() => setCurrencyToDropDownPicker(false)}
            ref={currToRef}
            // @ts-ignore
            setValue={(val: Function) => {
              let cc = val();
              // console.log("Displayed Currency set: ", cc)
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
        <View style={[globalStyles.inputBox, { marginBottom: 20 }]}>
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
            placeholder={t("Choose Bank")}
            placeholderStyle={globalStyles.dropdownPlaceholder}
            labelStyle={globalStyles.dropdownPlaceholder}
            modalTitle={t("Choose Bank")}
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
        <View style={[globalStyles.inputBox, { marginBottom: 20 }]}>
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
        </View>
        <View style={[globalStyles.inputBox, { marginBottom: 20 }]}>
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
        </View>

        <TouchableOpacity
          style={[
            globalStyles.button,
            { marginBottom: -10, marginTop: 50, backgroundColor: "#000000" },
          ]}
          onPress={() => addBeneficiary()}
        >
          <Text
            style={{
              color: Colors.bg,
              fontWeight: "bold",
              textAlign: "center",
            }}
          >
            {edit? t('Edit Beneficiary'): t("Add Account")}
          </Text>
        </TouchableOpacity>

        <NjScreenBottomSpacer />
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
