import React, {useContext, useEffect, useState} from "react";
import { StyleSheet, FlatList, ScrollView, RefreshControl, View } from "react-native";
import { Text, NjScreenBottomSpacer } from "../components";
import SafeAreaView from "react-native-safe-area-view";
import {Colors, statusColor} from "../constants";
import {AuthenticationContext} from "../context";
import { WalletService } from "../services";
// import {mf} from "../helpers";
// import axios from "axios";
import { t } from "../localization/transfy";

export const NjBankWithdrawScreen = () => {
	const [BWRs, setBWRs] = useState([]);
	const [loading, setLoading] = useState(true);
	const [isNotFound, setIsNotFound] = useState(false);
	const authContext = useContext(AuthenticationContext);
	// @ts-ignore
	const baseCurrency = authContext?.user?.currency_code;

	// @ts-ignore
	const renderItem = ({ item }) => (
		<View style={styles.item}>
			<View style={{ flex: 1 }}>
				<Text style={styles.date}>{item.date}</Text>
				<Text style={styles.title}>{`#${item.reference_number}, Order: #${item.order_id}`}</Text>
				<Text style={styles.title}>{`Account: ${item.account_number} - ${item.account_name}, ${item.bank_name}`}</Text>
				{/*<Text style={styles.price}>{mf(item.amount, baseCurrency)}</Text>*/}
				<Text style={styles.price}>{`${item.package_amount.slice(-3)} ${Number(item.amount).toFixed(2)}`}</Text>
				<Text style={[styles.status, {color: statusColor(item.status)}]}>{item.status}</Text>
			</View>
		</View>
	);

	const fetchBWRs = () => {
		// axios.get("/wallet/bwr")
		// 	.then(res => {
		// 		console.log("Res: ", res.data)
		// 	})
		WalletService.getBWRs()
			.then((result) => {
				console.log("Result: ",result)
				setIsNotFound(result.length === 0)
				setBWRs(result);
				setLoading(false);
			})
			.catch((err) => alert(err.message));
	};

	useEffect(() => {
		// fetch("wallet/btr")
		// 	.then(res => {
		// 		console.log("Res: ", res)
		// 	})
		// 	.catch(err => {
		// 		console.log(err)
		// 	})
		fetchBWRs()
	}, []);

	return (
    <SafeAreaView style={styles.container} forceInset={{ top: "always" }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={false} onRefresh={() => fetchBWRs()} />
        }
      >
        {loading ? (
          <View>
            <Text>{t("Loading")}...</Text>
          </View>
        ) : isNotFound ? (
          <View>
            <Text>{t("Not Found")}</Text>
          </View>
        ) : (
          <FlatList
            renderItem={renderItem}
            data={BWRs}
            keyExtractor={(item) => `OD:${item.id}`}
            style={{ marginTop: 20 }}
          />
        )}
        <NjScreenBottomSpacer />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
	container: {
		backgroundColor: Colors.bg,
		flex: 1,
		paddingHorizontal: 30
	},
	item: {
		paddingBottom: 20,
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
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
		fontSize: 14,
		fontFamily: "Rubik-Regular",
		fontWeight: "normal",
		paddingBottom: 5,
	},
	price: {
		color: "#000",
		fontFamily: "Rubik-Regular",
		fontWeight: "normal",
		fontSize: 14,
	},
	status: {
		fontFamily: "Rubik-Regular",
		fontWeight: "bold",
		fontSize: 14,
		marginTop: 5,
		textTransform: "capitalize",
	},
});
