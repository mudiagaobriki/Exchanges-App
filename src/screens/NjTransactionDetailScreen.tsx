import React, { useRef } from "react";
import { StyleSheet, ScrollView, TouchableOpacity, View } from "react-native";
import { Text } from "../components";
import { useNavigation } from "@react-navigation/native";
import SafeAreaView from "react-native-safe-area-view";
// import { DashboardModel } from "../models";
import NavigationNames from "../navigations/NavigationNames";
import { StackNavigationProp } from "@react-navigation/stack";
// import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../constants";
import { mf } from "../helpers";
import { NjScreenBottomSpacer } from "../components/NjScreenBottomSpacer";
import ViewShot from "react-native-view-shot";
import * as Sharing from "expo-sharing";
import { Ionicons } from "@expo/vector-icons";
import { t } from "../localization/transfy";

export const NjTransactionDetailScreen = ({ route }: any) => {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const item = route.params;
  const viewShotRef = useRef();

  const captureAndShareScreenshot = () => {
    // @ts-ignore
    viewShotRef.current.capture().then((uri) => {
      Sharing.shareAsync(uri).then(() => console.log);
    });
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: Colors.bg }}
      forceInset={{ top: "always" }}
    >
      <View style={styles.topBar}>
        <TouchableOpacity
          onPress={() => {
            navigation.replace(NavigationNames.HomeScreenNew);
          }}
          activeOpacity={1}
        >
          <Ionicons
            name="ios-arrow-back"
            size={30}
            style={{
              color: Colors.text_success,
              marginVertical: 10,
              marginRight: 10,
              marginLeft: 20,
            }}
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
          {t("Transaction Detail")}
        </Text>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/*<Text>{JSON.stringify(item)}</Text>*/}
        {/* @ts-ignore */}
        <ViewShot
          style={{ flex: 1, backgroundColor: Colors.bg, paddingHorizontal: 30 }}
          ref={viewShotRef}
          options={{ format: "jpg", quality: 1 }}
        >
          <View style={{ marginTop: 20 }}>
            <Text
              style={{
                color: "#131A22",
                fontFamily: "Rubik-Regular",
                fontSize: 14,
                fontWeight: "normal",
              }}
            >
              {item.date}
            </Text>
          </View>
          <View style={{ alignItems: "center", marginTop: 30 }}>
            {/*borderStyle: "dashed", borderBottomWidth: 2, borderColor: "#B8B8B8", borderRadius: 0.5*/}
            <Text
              style={{ paddingBottom: 5, fontSize: 17, fontWeight: "bold" }}
            >
              {t("Order ID")} : {item.id}
            </Text>
          </View>
          <View style={[{ height: 1, overflow: "hidden" }]}>
            <View
              style={[
                {
                  borderWidth: 2,
                  borderColor: "#B8B8B8",
                  borderStyle: "dashed",
                  borderRadius: 1,
                },
              ]}
            />
          </View>
          <View style={{ width: "100%", paddingBottom: 20 }}>
            <View style={styles.item}>
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    color: "#B8B8B8",
                    fontSize: 13,
                    fontFamily: "Rubik-Regular",
                  }}
                >
                  {t("Details")}
                </Text>
              </View>
              <View style={{ flex: 2.5 }}>
                <Text
                  style={{
                    color: "#B8B8B8",
                    fontSize: 13,
                    fontFamily: "Rubik-Regular",
                    width: "100%",
                  }}
                >
                  {item.name}
                </Text>
              </View>
              <View style={{ flex: 1.3 }}>
                <Text
                  style={{
                    color: "#1A2129",
                    fontSize: 13,
                    fontFamily: "Rubik-Regular",
                    textAlign: "right",
                  }}
                >
                  {mf(item.raw_package_amount, item.currency_code)}
                </Text>
              </View>
            </View>
            <View style={styles.item}>
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    color: "#B8B8B8",
                    fontSize: 13,
                    fontFamily: "Rubik-Regular",
                  }}
                >
                  {t("Payment")}
                </Text>
              </View>
              <View style={{ flex: 3.5 }}>
                <Text
                  style={{
                    color: "#B8B8B8",
                    fontSize: 13,
                    fontFamily: "Rubik-Regular",
                    textAlign: "left",
                    paddingLeft: 0,
                  }}
                >
                  {item.payment_status}
                </Text>
              </View>
            </View>
            <View style={styles.item}>
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    color: "#B8B8B8",
                    fontSize: 13,
                    fontFamily: "Rubik-Regular",
                  }}
                >
                  {t("Service")}
                </Text>
              </View>
              <View style={{ flex: 3.5 }}>
                <Text
                  style={{
                    color: "#B8B8B8",
                    fontSize: 13,
                    fontFamily: "Rubik-Regular",
                    textAlign: "left",
                    paddingLeft: 0,
                  }}
                >
                  {item.service_status}
                </Text>
              </View>
            </View>
            <View style={styles.item}>
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    color: "#B8B8B8",
                    fontSize: 13,
                    fontFamily: "Rubik-Regular",
                  }}
                >
                  {t("Status")}
                </Text>
              </View>
              <View style={{ flex: 3.5 }}>
                <Text
                  style={{
                    color: "#B8B8B8",
                    fontSize: 13,
                    fontFamily: "Rubik-Regular",
                    textAlign: "left",
                    paddingLeft: 0,
                  }}
                >
                  {item.status}
                </Text>
              </View>
            </View>
          </View>
          <View style={[{ height: 1, overflow: "hidden" }]}>
            <View
              style={[
                {
                  borderWidth: 2,
                  borderColor: "#B8B8B8",
                  borderStyle: "dashed",
                  borderRadius: 1,
                },
              ]}
            />
          </View>
          <View style={styles.item}>
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  color: "#1A2129",
                  fontSize: 16,
                  fontFamily: "Rubik-Regular",
                }}
              >
                {t("Total Payment")}
              </Text>
            </View>
            <View>
              <Text
                style={{
                  color: Colors.text_success,
                  fontSize: 18,
                  fontFamily: "Rubik-Regular",
                  textAlign: "left",
                }}
              >
                {mf(item.raw_total, item.currency_code)}
              </Text>
            </View>
          </View>
          <View style={{ height: 40 }} />
        </ViewShot>

        <View
          style={{
            paddingHorizontal: 30,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => navigation.replace(NavigationNames.HomeScreenNew)}
            style={{
              backgroundColor: Colors.text_success,
              borderColor: Colors.text_success,
              borderRadius: 10,
              width: 250,
              paddingVertical: 15,
            }}
          >
            <Text style={styles.transactionBtn}>{t("Back To Wallet")}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              backgroundColor: "#CEA31B",
              borderColor: "#CEA31B",
              borderRadius: 10,
              marginTop: 30,
              width: 250,
              paddingVertical: 15,
            }}
            onPress={captureAndShareScreenshot}
          >
            <Text style={styles.transactionBtn}>{t("Share Receipt")}</Text>
          </TouchableOpacity>

          {/* <TouchableOpacity activeOpacity = { 1 } style={{ backgroundColor:'#131A22', borderColor: '#131A22',borderRadius: 10, marginTop: 30, width: 250, paddingVertical: 15}}>
		                <Text style={styles.transactionBtn}>Add to Favourite</Text>
		            </TouchableOpacity> */}
        </View>
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
    flex: 1,
    justifyContent: "space-between",
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
});
