import React, { useEffect, useRef } from "react";
import {
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  View,
  RefreshControl,
} from "react-native";
import { Text } from "../components";
import { useNavigation } from "@react-navigation/native";
import SafeAreaView from "react-native-safe-area-view";
import { StackNavigationProp } from "@react-navigation/stack";
import NavigationNames from "../navigations/NavigationNames";
// import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../constants";
import { NjWalletCarousel } from "../components/NjWalletCarousel";
import { NjScreenBottomSpacer } from "../components/NjScreenBottomSpacer";
import { t } from "../localization/transfy";

export const NjWalletScreen = () => {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const NjWalletCarouselRef = useRef();

  const onRefresh = () => {
    NjWalletCarouselRef.current.refresh();
  };

  return (
    <SafeAreaView style={styles.container} forceInset={{ top: "always" }}>
      {/*
			<View style={styles.topBar}>
	        <TouchableOpacity
	          onPress={() => {
	            navigation.goBack();
	          }}
	        >
	          <Ionicons
	            name="ios-arrow-back"
	            size={30}
	            style={{ color: Colors.text_success, marginVertical: 10, marginRight: 10 }}
	          />
	        </TouchableOpacity>
	        <Text
	          style={{
	            fontSize: 20,
	            marginTop: 13,
	            color: Colors.text_success,
	            fontWeight: "bold",
	            fontFamily: "Rubik-Regular",
	          }}
	        >
	          Wallet
	        </Text>
	      </View>*/}
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
        <NjWalletCarousel
          ref={NjWalletCarouselRef}
          parentCallback={(index) => console.log(index)}
        />

        <TouchableOpacity
          onPress={() =>
            navigation.navigate(NavigationNames.NjTransactionHistoryScreen)
          }
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: "#FFF9EC",
            borderRadius: 20,
            padding: 30,
            marginTop: 30,
          }}
        >
          <View
            style={{
              backgroundColor: "#FFC75D",
              borderRadius: 10,
              height: 50,
              width: 50,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Image source={require("../../assets/images/icon/wallet.png")} />
          </View>
          <View style={{ flex: 1, paddingLeft: 10, alignItems: "center" }}>
            <Text
              style={{
                color: "#131A22",
                fontFamily: "Rubik-Regular",
                fontSize: 18,
                fontWeight: "bold",
              }}
            >
              {t("Transaction History")}
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() =>
            navigation.navigate(NavigationNames.NjBankDepositScreen)
          }
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: "#E8FFF1",
            borderRadius: 20,
            padding: 30,
            marginTop: 30,
          }}
        >
          <View
            style={{
              backgroundColor: Colors.text_success,
              borderRadius: 10,
              height: 50,
              width: 50,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Image source={require("../../assets/images/icon/card.png")} />
          </View>
          <View style={{ flex: 1, paddingLeft: 10, alignItems: "center" }}>
            <Text
              style={{
                color: "#131A22",
                fontFamily: "Rubik-Regular",
                fontSize: 18,
                fontWeight: "bold",
              }}
            >
              {t("Bank Deposit & Fund Requests")}
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() =>
            navigation.navigate(NavigationNames.NjBankWithdrawScreen)
          }
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: "#F5F2FE",
            borderRadius: 20,
            padding: 30,
            marginTop: 30,
          }}
        >
          <View
            style={{
              backgroundColor: "#6B3BED",
              borderRadius: 10,
              height: 50,
              width: 50,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Image source={require("../../assets/images/icon/wallet.png")} />
          </View>
          <View style={{ flex: 1, paddingLeft: 10, alignItems: "center" }}>
            <Text
              style={{
                color: "#131A22",
                fontFamily: "Rubik-Regular",
                fontSize: 18,
                fontWeight: "bold",
              }}
            >
              {t("Bank Withdraw Requests")}
            </Text>
          </View>
        </TouchableOpacity>

        <NjScreenBottomSpacer />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { backgroundColor: "#F2F2F2", flex: 1, paddingHorizontal: 30 },
  topBar: {
    flexDirection: "row",
    paddingTop: 10,
  },
});
