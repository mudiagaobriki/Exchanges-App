import React, { useRef, useState } from "react";
import {
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  View,
  Alert,
} from "react-native";
import { Text } from "../components";
import { useNavigation } from "@react-navigation/native";
import SafeAreaView from "react-native-safe-area-view";
import { useLocalization } from "../localization";
import { StackNavigationProp } from "@react-navigation/stack";
import { Colors } from "../constants";
import {
  NjScreenBottomSpacer,
  NjConfirmPaymentModal,
  NjExchangeCurrencyInput,
} from "../components";
import { axiosApiErrorAlert, mf } from "../helpers";
import { WalletService } from "../services";
import NavigationNames from "../navigations/NavigationNames";
import { t } from "../localization/transfy";

export const NjExchangeScreen = () => {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const { getString } = useLocalization();
  const NjExchangeCurrencyInputRef = useRef();
  const [modalVisible, setModalVisible] = useState(false);
  const [cpData, setCpData] = useState<{ value: any; title: string }[]>();
  const [totalPayment, setTotalPayment] = useState("");

  const onClickExchange = () => {
    setModalVisible(false);
    // @ts-ignore
    const amount = NjExchangeCurrencyInputRef.current.getAmount();
    // @ts-ignore
    const currency_from = NjExchangeCurrencyInputRef.current.getFromCurrency();
    // @ts-ignore
    const currency_to = NjExchangeCurrencyInputRef.current.getToCurrency();

    // console.log('s', currency_from)
    WalletService.exchangeMoney({ currency_from, currency_to, amount })
      .then(async (result: any) => {
        if (result.order) {
          navigation.navigate(
            NavigationNames.NjTransactionDetailScreen,
            result.order
          );
        } else {
          Alert.alert(result.message, "Order ID: #" + result.order_id);
        }
      })
      .catch((e) => {
        axiosApiErrorAlert(e);
      });
  };

  const confirmTransaction = () => {
    // @ts-ignore
    const amount = NjExchangeCurrencyInputRef.current.getAmount();
    // @ts-ignore
    const amount_to = NjExchangeCurrencyInputRef.current.getToAmount();
    // @ts-ignore
    const currency_from = NjExchangeCurrencyInputRef.current.getFromCurrency();
    // @ts-ignore
    const currency_to = NjExchangeCurrencyInputRef.current.getToCurrency();

    // console.log(currency_to)

    if (!amount || !amount_to || !currency_from || !currency_to) {
      Alert.alert(getString(`${t("please fill fields")}`));
      return;
    }

    const cp: { value: any; title: string }[] = [];
    cp.push({
      title: "Deduct from",
      value: mf(parseFloat(amount), currency_from),
    });
    cp.push({
      title: "Credit to",
      value: mf(parseFloat(amount_to), currency_to),
    });

    setCpData(cp);
    setTotalPayment(mf(parseFloat(amount), currency_from));
    setModalVisible(true);
  };

  return (
    <SafeAreaView style={styles.container} forceInset={{ top: "always" }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ height: 40 }} />

        <NjExchangeCurrencyInput ref={NjExchangeCurrencyInputRef} />

        <View style={{ marginTop: 135, paddingHorizontal: 30 }}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => confirmTransaction()}
          >
            <Text
              style={{
                fontWeight: "bold",
                textAlign: "center",
                paddingTop: 20,
              }}
            >
              {t("Proceed")}
            </Text>
          </TouchableOpacity>
        </View>

        <NjScreenBottomSpacer />
      </ScrollView>

      <NjConfirmPaymentModal
        modalVisible={modalVisible}
        setModalVisible={(value: boolean) => setModalVisible(value)}
        onModalSubmit={() => onClickExchange()}
        data={cpData}
        heading="Confirm Exchange"
        totalPaymentText="You will pay"
        totalPayment={totalPayment + ""}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.bg,
    flex: 1,
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
});
