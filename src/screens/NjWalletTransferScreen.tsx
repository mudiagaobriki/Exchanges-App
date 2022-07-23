import React, { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  FlatList,
  Image,
  ImageBackground,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  View,
  Button,
  Alert,
  Dimensions,
} from "react-native";
import { Text, TextInput, Icon } from "../components";
import { useNavigation, useRoute } from "@react-navigation/native";
import SafeAreaView from "react-native-safe-area-view";
import { StackNavigationProp } from "@react-navigation/stack";
// import Modal from "react-native-modal";
import { Colors } from "../constants";
import { NjScreenBottomSpacer } from "../components/NjScreenBottomSpacer";
// import {NjWalletCarousel} from "../components/NjWalletCarousel";
import { axiosApiErrorAlert, mf } from "../helpers";
import NavigationNames from "../navigations/NavigationNames";
import { globalStyles } from "../helpers";
import DropDownPicker from "react-native-dropdown-picker";
import { SystemService, WalletService } from "../services";
import axios from "axios";
import moment from "moment";
import { t } from "../localization/transfy";

export const NjWalletTransferScreen = () => {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const NjWalletCarouselRef = useRef();

  const [email, setEmail] = useState("");
  const [accountName, setAccountName] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  // const [modalVisible, setModalVisible] = useState(false);
  // const [failedModalVisible, setFailedModalVisible] = useState(false);

  const [amountFrom, setAmountFrom] = useState("");
  const [amountTo, setAmountTo] = useState("");
  const [currencyFromDropDownPicker, setCurrencyFromDropDownPicker] = useState(
    false
  );
  const [currencyToDropDownPicker, setCurrencyToDropDownPicker] = useState(
    false
  );
  const [currencyFrom, setCurrencyFrom] = useState("");
  const [currencyTo, setCurrencyTo] = useState("");
  const [countries, setCountries] = useState([]);
  const [dailyLimits, setDailyLimits] = useState({});
  const [userBalances, setUserBalances] = useState([]);
  const [rates, setRates] = useState([]);
  const [rate, setRate] = useState(1);
  const [recentTransactions, setRecentTransactions] = useState([]);

  const route = useRoute();

  const onRefresh = () => {
    WalletService.getInfo().then((result) => {
      const { countries, balances, daily_limits } = result.data;
      setCountries(countries);
      setDailyLimits(daily_limits.withdraw);
      setUserBalances(balances);
    });
    SystemService.getConfig().then((result) => {
      const { exrts, ut, wmf } = result;
      setRates(exrts);
    });
    // axios.get("wallet/dt-orders")
    // 	.then((orders) => {
    // 		console.log("Recent 20 Transactions: ", orders.data.data)
    // 		setRecentTransactions(orders.data.data);
    // 	})
    // 	.catch((err) => alert(err.message));
  };

  useEffect(() => {
    onRefresh();
  }, []);

  useEffect(() => {
    // @ts-ignore
    if (countries.length > 0 && countries[0].currency_code) {
      if (route?.params?.activeCurrency != undefined) {
        setCurrencyFrom(route?.params?.activeCurrency.toUpperCase());
      } else {
        // @ts-ignore
        setCurrencyFrom(countries[0].currency_code);
      }
    }
  }, [countries]);

  const onClickTransfer = () => {
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
    // 		console.log("Time Difference in minutes: ", timeDifference)

    const fAmountFrom = mf(parseFloat(amountFrom), currencyFrom, {
      decimal: 2,
    });
    const fAmountTo = mf(parseFloat(amountTo), currencyTo, { decimal: 2 });

    // console.log("Amount from: ", amountFrom)
    // console.log("Amount to: ", amountTo)
    // console.log("Currency to: ", currencyTo)
    // console.log("Currency From: ", currencyFrom)
    // console.log("Recent Currency: ", recentTransactions[0].currency_code)
    // console.log("Comparison: ", currencyTo, "Base: ", Number(amountFrom) === Number(recentTransactions[0].raw_package_amount))

    // if ((orders.data.data[0].type === "transfer") && (timeDifference < 5) && (Number(amountFrom) === Number(orders.data.data[0].raw_package_amount) &&
    // 	(currencyTo.trim() === orders.data.data[0].currency_code.trim()))){
    // 	Alert.alert("Duplicate Transaction. Please wait a few minutes before tyring again")
    // 	return
    // }

    WalletService.transferMoney(currencyFrom, currencyTo, email, amountFrom)
      .then((result) => {
        if (result.order) {
          navigation.navigate(
            NavigationNames.NjTransactionDetailScreen,
            result.order
          );
        } else {
          setEmail("");
          setAmountFrom("");
          // @ts-ignore
          NjWalletCarouselRef.current.refresh();
          Alert.alert(result.message, "Order ID: #" + result.order_id);
        }
      })
      .catch((e) => {
        axiosApiErrorAlert(e);
      });
    // })
    // .catch((err) => alert(err.message));
  };

  return (
    <SafeAreaView style={styles.container} forceInset={{ top: "always" }}>
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
        {currencyFrom && dailyLimits ? (
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
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
        <View style={{ ...globalStyles.inputBox, ...{ flexDirection: "row" } }}>
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
              placeholder="From"
              placeholderStyle={globalStyles.dropdownPlaceholder}
              labelStyle={globalStyles.dropdownPlaceholder}
              modalTitle={t("Transfer From")}
              open={currencyFromDropDownPicker}
              value={currencyFrom}
              items={countries}
              setOpen={() => setCurrencyFromDropDownPicker(true)}
              onClose={() => setCurrencyFromDropDownPicker(false)}
              // @ts-ignore
              setValue={(val: Function) => {
                const cc = val();
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
                placeholder: `${t("Amount in")} ${currencyFrom}`,
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
          </View>
        </View>
        <View style={globalStyles.inputBox}>
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
            placeholder={t("Transfer To")}
            placeholderStyle={globalStyles.dropdownPlaceholder}
            labelStyle={globalStyles.dropdownPlaceholder}
            modalTitle="Transfer To"
            open={currencyToDropDownPicker}
            value={currencyTo}
            items={countries}
            setOpen={() => setCurrencyToDropDownPicker(true)}
            onClose={() => setCurrencyToDropDownPicker(false)}
            // @ts-ignore
            setValue={(val: Function) => {
              const cc = val();
              setCurrencyTo(cc);
              setCurrencyToDropDownPicker(false);
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
            }}
            style={globalStyles.dropdown}
          />
        </View>
        <View style={globalStyles.inputBox}>
          <TextInput
            style={globalStyles.input}
            inputProps={{
              keyboardType: "email-address",
              placeholder: `${t("User's Email")}`,
              autoCorrect: false,
              value: email,
              onChangeText: setEmail,
            }}
          />
        </View>
        <View style={globalStyles.inputBox}>
          <TextInput
            style={globalStyles.input}
            inputProps={{
              // keyboardType: "text",
              placeholder: `${t("Account Name")}`,
              autoCorrect: false,
              value: accountName,
              onChangeText: setAccountName,
            }}
          />
        </View>
        <View style={globalStyles.inputBox}>
          <TextInput
            style={globalStyles.input}
            inputProps={{
              // keyboardType: "text",
              placeholder: `${t("Description (Optional)")}`,
              autoCorrect: false,
              value: description,
              onChangeText: setDescription,
            }}
          />
        </View>
        <Text style={{ marginTop: 20, marginBottom: 15, fontSize: 14 }}>
          {t(
            "Choose Bank and enter Account Number to get Account Name If your account name wasn't fetched, you can input the account name manually"
          )}
        </Text>
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
          <Text
            style={{
              fontWeight: "bold",
              marginTop: 10,
              color: Colors.text_info,
            }}
          >
            {`Transaction fee: FREE`}
          </Text>
          <Text style={{ marginTop: 20, fontSize: 12 }}>
            NB:{" "}
            {t(
              "Ensure you’re sending to the correct beneficiary details Funds sent to a wrongful user can’t be reversed"
            )}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            onClickTransfer();
          }}
        >
          <Text
            style={{
              color: Colors.text_success,
              fontWeight: "bold",
              textAlign: "center",
            }}
          >
            {t("Transfer")}
          </Text>
        </TouchableOpacity>
        <NjScreenBottomSpacer />
      </ScrollView>
    </SafeAreaView>
  );
};

const win = Dimensions.get("window");
const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.bg,
    flex: 1,
    paddingHorizontal: 30,
  },
  topBar: {
    flexDirection: "row",
    paddingTop: 10,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 20,
  },
  transactionBtn: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Rubik-Regular",
    fontWeight: "bold",
    textAlign: "center",
    justifyContent: "center",
    alignItems: "center",
  },
  acInfoBox: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    paddingLeft: 10,
  },
  acInfoImage: {
    resizeMode: "contain",
    width: win.width - 60,
    height: (win.width - 20) / 2.6,
    marginTop: 10,
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: 30,
  },
  button: {
    marginVertical: 24,
    backgroundColor: "#E8FFF1",
    borderColor: "#E8FFF1",
    color: Colors.text_success,
    borderRadius: 20,
    paddingVertical: 20,
    width: "100%",
    alignSelf: "center",
    fontSize: 22,
  },
  transferWalletLabel: {
    color: "#131A22",
    fontSize: 18,
    fontFamily: "Rubik-Regular",
    fontWeight: "bold",
    paddingBottom: 60,
  },
  transferWalletInput: {
    paddingTop: 50,
    backgroundColor: "#fff",
    height: 60,
    paddingLeft: 10,
    borderBottomColor: "#000",
  },
  topitInputData: {
    marginTop: 20,
  },
  inputText: {
    fontSize: 16,
    marginBottom: 5,
    fontFamily: "Rubik-Regular",
  },
  modalView: {
    justifyContent: "center",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 30,
    height: "auto",
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
  failedModalView: {
    justifyContent: "center",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 30,
    height: "auto",
  },
});
