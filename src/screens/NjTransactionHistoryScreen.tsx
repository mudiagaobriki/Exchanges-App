import React, { useContext, useEffect, useState } from "react";
import {
  StyleSheet,
  FlatList,
  Image,
  ScrollView,
  RefreshControl,
  View,
  TouchableOpacity,
} from "react-native";
import { Text } from "../components";
import { useNavigation } from "@react-navigation/native";
import SafeAreaView from "react-native-safe-area-view";
import { WalletService } from "../services";
import { StackNavigationProp } from "@react-navigation/stack";
import NavigationNames from "../navigations/NavigationNames";
import { Colors } from "../constants";
// import { mf } from "../helpers";
import { AuthenticationContext } from "../context";
import { NjScreenBottomSpacer } from "../components/NjScreenBottomSpacer";
import axios from "axios";
import { t } from "../localization/transfy";

export const NjTransactionHistoryScreen = () => {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const authContext = useContext(AuthenticationContext);
  // @ts-ignore
  const baseCurrency = authContext?.user?.currency_code;

  // @ts-ignore
  const renderItem = ({ item }) => (
    <TouchableOpacity
      activeOpacity={1}
      onPress={() =>
        navigation.navigate(NavigationNames.NjTransactionDetailScreen, item)
      }
      style={styles.item}
    >
      <View style={{ flex: 1 }}>
        <Text style={styles.date}>{item.date}</Text>
        <Text style={styles.title}>{`#${item.id} - ${item.name}`}</Text>
        {/*<Text style={styles.price}>{mf(item.total, baseCurrency, {decimal: 2})}</Text>*/}
        <Text style={styles.price}>{`${item.currency_code} ${item.total
          .replace(item.currency_code, "")
          .trim()}`}</Text>
      </View>
      <View style={{ paddingLeft: 30 }}>
        <View>
          <Image
            style={styles.forwardIcon}
            source={require("../../assets/images/account-screen/forward-icon.png")}
          />
        </View>
      </View>
    </TouchableOpacity>
  );

  const fetchOrders = () => {
    if (setOrders.length === 0) {
      axios
        .get("wallet/dt-orders")
        .then((orders) => {
          console.log("Orders: ", orders);
          setOrders(orders);
          setLoading(false);
        })
        .catch((err) => alert(err.message));
    } else {
      WalletService.getOrders()
        .then((orders) => {
          // console.log("Orders: ", orders)
          setOrders(orders);
          setLoading(false);
        })
        .catch((err) => alert(err.message));
    }
  };

  useEffect(() => fetchOrders(), []);

  return (
    <SafeAreaView style={styles.container} forceInset={{ top: "always" }}>
      {/*<View style={styles.topBar}>
				<TouchableOpacity
					activeOpacity={1}
					onPress={() => {
						navigation.goBack();
					}}
				>
					<Ionicons name="ios-arrow-back" size={30} style={{ color: Colors.text_success, marginVertical: 10, marginRight: 10 }} />
				</TouchableOpacity>
				<Text style={{ fontSize: 20, marginTop: 13, color: Colors.text_success, fontWeight: "bold", fontFamily: "Rubik-Regular" }}>Transaction History</Text>
			</View>*/}
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={false} onRefresh={() => fetchOrders()} />
        }
      >
        {loading ? (
          <View>
            <Text>{t("Loading")}...</Text>
          </View>
        ) : orders.length === 0 ? (
          <View>
            <Text>{t("No transaction yet")}.</Text>
          </View>
        ) : (
          <FlatList
            renderItem={renderItem}
            data={orders}
            keyExtractor={(item) => `OD:${item.id}`}
          />
        )}
        {/*{*/}
        {/*	orders.length === 0 ?*/}
        {/*		<View><Text>No transaction yet.</Text></View>*/}
        {/*	:*/}
        {/*	<FlatList*/}
        {/*		renderItem={renderItem}*/}
        {/*		data={orders}*/}
        {/*		keyExtractor={(item) => `OD:${item.id}`}*/}
        {/*	/>*/}
        {/*}*/}
        <NjScreenBottomSpacer />
      </ScrollView>
    </SafeAreaView>
  );
};

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
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
  },
  forwardIcon: {
    marginLeft: "auto",
  },
  date: {
    color: "#979797",
    fontSize: 14,
    fontFamily: "Rubik-Regular",
    fontWeight: "normal",
    lineHeight: 30,
  },
  title: {
    color: "#000",
    fontSize: 13,
    fontFamily: "Rubik-Regular",
    fontWeight: "normal",
    paddingBottom: 5,
    lineHeight: 20,
    marginTop: 3,
  },
  price: {
    color: Colors.text_success,
    fontFamily: "Rubik-Regular",
    fontWeight: "bold",
    fontSize: 14,
    marginTop: 5,
  },
});
