import React, {useContext, useEffect, useState} from "react";
import WalletService from "../services/WalletService";
import {Dimensions, Image, StyleSheet, TouchableOpacity, View} from "react-native";
import {Text} from "./Text";
import {AuthenticationContext, SystemConfigContext} from "../context";
import {Colors} from "../constants";
import { convertToBase, getImageUrl, mf } from "../helpers";
import { t } from "../localization/transfy";


let dummyData = [{
	title: "GHS Wallet",
	sub_title: "GHS3,400,000.00",
	imgName: "GHSFlag.png",
	imgLink: require("../../assets/images/flags/GHSFlag.png")
},
	{
		title: "NGN Wallet",
		sub_title: "N10,000,000.00",
		imgName: "NGNFlag.png",
		imgLink: require("../../assets/images/flags/NGNFlag.png")
	},
	{
		title: "KES Wallet",
		sub_title: "KES75,000,000.00",
		imgName: "KESFlag.png",
		imgLink: require("../../assets/images/flags/KESFlag.png")
	},
	{
		title: "UGX Wallet",
		sub_title: "UGSX,500,000.00",
		imgName: "UGXFlag.png",
		imgLink: require("../../assets/images/flags/UGXFlag.png")
	}]

export const NjCurrenciesList = (props: any) => {
	const authContext = useContext(AuthenticationContext);
	const systemContext = useContext(SystemConfigContext);
	const [cryptoCoinsList, setCryptoCoinsList] = useState<Array<JSX.Element>>([]);
	const config = systemContext.config
	// @ts-ignore
	const baseCurrency = authContext?.user?.currency_code;
	// @ts-ignore
	const crpCoins = config?.crp?.coins
	// @ts-ignore
	const crp = systemContext.config.crp

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

		// Remove this when you are ready to go live
		const coins : JSX.Element[] = []
		for (let [i, data] of props.source.entries()){
				coins.push(
					<TouchableOpacity key={i} onPress={() => props.parentCallback(data)}>
						<View style={styles.coinContent} >
							<View>
								<Image source={data.imgLink} style={{width: 50, height: 50}}/>
							</View>
							<View style={styles.coinNameBox}>
								<Text style={styles.coinText}>{data.title}</Text>
								<Text style={styles.coinPrice}>({ data.title.trim().substring(0,3)})</Text>
							</View>
							<View style={styles.coinPriceBox}>
								{/*<Text style={styles.coinTotalRate}>Approx Price</Text>*/}
								<Text numberOfLines={1} style={styles.coinPriceSuccessPer}>{ data.sub_title }</Text>
								{/*<Text style={styles.coinPriceSuccessPer}>{convertToBase(crp, balances[key], key, 'sell')}</Text>*/}
							</View>
						</View>
					</TouchableOpacity>
				)
		}
		setCryptoCoinsList(coins);

		// Uncomment her to fetch from live data
		// WalletService.getWalletBalances()
		// 	.then((balances) => {
		// 		const coins : JSX.Element[] = []
		// 		Object.keys(balances).forEach(key => {
		// 			if(key === "BASE"){
		// 				return;
		// 			}
		// 			coins.push(
		// 				<View style={styles.coinContent} key={key}>
		// 					<View>
		// 						<Image source={{ uri: getImageUrl(crpCoins[key].image) }} style={{width: 50, height: 50}}/>
		// 					</View>
		// 					<View style={styles.coinNameBox}>
		// 						<Text style={styles.coinText}>{crpCoins[key].name}</Text>
		// 						<Text style={styles.coinPrice}>({ balances[key] || 0 } { key })</Text>
		// 					</View>
		// 					<View style={styles.coinPriceBox}>
		// 						{/*<Text style={styles.coinTotalRate}>Approx Price</Text>*/}
		// 						<Text numberOfLines={1} style={styles.coinPriceSuccessPer}>{ mf(convertToBase(crp, balances[key], key, 'sell'), baseCurrency, {decimal: 2}) }</Text>
		// 						{/*<Text style={styles.coinPriceSuccessPer}>{convertToBase(crp, balances[key], key, 'sell')}</Text>*/}
		// 					</View>
		// 				</View>
		// 			)
		// 		})
		// 		setCryptoCoinsList(coins);
		// 	})
		// 	.catch((err) => alert(err.message));
	};

	useEffect(() => {
		systemContext.refreshConfig()
			.then(() => {
			})
		fetchWalletBalances()
	}, [])

	return (
		<>
			{ cryptoCoinsList }
		</>
	)
}

const win = Dimensions.get("window");
const styles = StyleSheet.create({
	coinContent: {
		flexDirection: "row",
		backgroundColor: "#FCFBFC",
		borderRadius: 20,
		padding: 15,
		marginTop: 15,
	},
	coinNameBox: { flex: 1, marginLeft: 10, marginTop: 7 },
	coinPriceBox: { flex: 1, marginRight: 5, marginTop: 7 },
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
		fontSize: 12,
		fontWeight: "600",
		textAlign: "right",
		flexWrap: "wrap"
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
})
