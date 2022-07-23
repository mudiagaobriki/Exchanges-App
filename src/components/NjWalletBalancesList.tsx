import React, {
  useContext,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { WalletService } from "../services";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { Text } from "./Text";
import { AuthenticationContext, SystemConfigContext } from "../context";
import { Colors } from "../constants";
import { mf } from "../helpers";
import { t } from "../localization/transfy";

export const NjWalletBalancesList = React.forwardRef((props: any, ref) => {
  const systemContext = useContext(SystemConfigContext);
  const [cryptoCoinsList, setCryptoCoinsList] = useState<Array<JSX.Element>>(
    []
  );
  const inputRef = useRef();
  const authContext = useContext(AuthenticationContext);
  const user = authContext.user;

  useImperativeHandle(ref, () => ({
    refresh: () => {
      // setCryptoCoinsList([])
      fetchWalletBalances();
    },
    current: inputRef.current,
  }));

  const fetchWalletBalances = () => {
    setCryptoCoinsList([
      <View style={styles.coinContent} key="loading">
        <View>
          <Image
            source={require("../../assets/images/loading.gif")}
            style={{ width: 50, height: 50 }}
          />
        </View>
        <View style={styles.coinNameBox}>
          <Text style={{ ...styles.coinText, ...{ marginTop: 7 } }}>
            {t("Loading")}...
          </Text>
        </View>
      </View>,
    ]);

    WalletService.getInfo()
      .then((result) => {
        let userCurrency = user?.currency_code;
        let homeCurrencyBalance = result.data.balances[userCurrency];

        // console.log("Rearranged Balances from wallet carousel: ",balances[Object.keys(balances)[0]]);
        let { countries, balances, country_icons } = result.data;
        const coins: JSX.Element[] = [];
        let userCountry = countries.filter(
          (c: any) => c.currency_code === "NGN"
        );
        countries = countries.filter((c: any) => c.currency_code !== "NGN");
        countries.unshift(userCountry[0]);
        // @ts-ignore
        countries.forEach((country) => {
          const currency = country?.currency_code;
          const currency_name = country?.currency_name;
          if (!currency) return false;
          coins.push(
            <TouchableOpacity
              key={currency}
              onPress={() => props.parentCallback(currency)}
            >
              <View style={styles.coinContent} key={currency}>
                <View>
                  <Image
                    source={{ uri: country_icons[currency] }}
                    style={{ width: 50, height: 50, borderRadius: 100 }}
                  />
                </View>
                <View style={styles.coinNameBox}>
                  <Text style={styles.coinText}>{currency_name}</Text>
                  <Text style={styles.coinText}>({currency})</Text>
                </View>
                <View style={styles.coinPriceBox}>
                  <Text numberOfLines={1} style={styles.coinTotalRate}>
                    {mf(balances[currency], currency, {
                      decimal: 2,
                      currency_before: false,
                    })}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        });
        setCryptoCoinsList(coins);
      })
      .catch((err) => alert(err.message));
  };

  useEffect(() => {
    systemContext.refreshConfig().then(() => {});
    fetchWalletBalances();
  }, []);

  return <View ref={inputRef}>{cryptoCoinsList}</View>;
});

const styles = StyleSheet.create({
  coinContent: {
    flexDirection: "row",
    backgroundColor: "#FCFBFC",
    borderRadius: 20,
    padding: 15,
    marginTop: 15,
  },
  coinNameBox: { flex: 1, marginLeft: 10, marginTop: 7 },
  coinPriceBox: {
    flex: 0.7,
    marginRight: 5,
    marginTop: 7,
    justifyContent: "center",
  },
  coinText: {
    color: "#000",
    fontFamily: "Rubik-Regular",
    fontSize: 15,
    fontWeight: "bold",
  },
  coinPrice: {
    color: "#000",
    fontFamily: "Rubik-Regular",
    fontSize: 14,
    fontWeight: "600",
    lineHeight: 20,
  },
  coinTotalRate: {
    color: "#000",
    fontFamily: "Rubik-Regular",
    fontSize: 14,
    fontWeight: "600",
    textAlign: "right",
    flexWrap: "wrap",
  },
  coinPriceSuccessPer: {
    color: Colors.text_success,
    fontFamily: "Rubik-Regular",
    fontSize: 12,
    fontWeight: "600",
    textAlign: "right",
    lineHeight: 20,
    marginTop: 5,
    flex: 1,
  },
  coinPriceDangerPer: {
    color: "#FF4133",
    fontFamily: "Rubik-Regular",
    fontSize: 12,
    fontWeight: "600",
    textAlign: "right",
    lineHeight: 20,
  },
});
