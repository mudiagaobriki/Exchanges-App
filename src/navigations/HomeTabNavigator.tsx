import * as React from "react";
import {
  createStackNavigator,
  TransitionPresets,
} from "@react-navigation/stack";
import NavigationNames from "./NavigationNames";
import { View, StyleSheet } from "react-native";
import { NjBottomTabBar } from "../components";
import { Colors } from "../constants";

import {
  HomeScreenNew,
  NjAppLoadingScreen,
  NjExchangeScreen,
  NjAccountScreen,
  NjProfileScreen,
  NjTransactionHistoryScreen,
  NjTransactionDetailScreen,
  NjAddCashScreen,
  NjWalletScreen,
  NjBankDepositScreen,
  NjBankWithdrawScreen,
  NjWalletTransferScreen,
  NjWithdrawWalletScreen,
  NjAccountVerificationScreen,
  NjForgetPasswordScreen,
  NjChangePasswordScreen,
  NjLoginScreen,
} from "../screens";
import { NjDepositScreen } from "../screens/NjDepositScreen";
import { NjNairaDepositScreen } from "../screens/NjNairaDepositScreen";
import { NjGhanaDepositScreen } from "../screens/NjGhanaDepositScreen";
import { NjDepositScreen2 } from "../screens/NjDepositScreen2";
import { NjCreatePinScreen } from "../screens/NjCreatePinScreen";
import { NjConfirmPinScreen } from "../screens/NjConfirmPinScreen";
import { NjInputPinScreen } from "../screens/NjInputPinScreen";
import { NjEmailVerificationScreen } from "../screens/NjEmailVerificationScreen";
import { NjBeneficiaryScreen } from "../screens/NjBeneficiaryScreen";
import {
  getFocusedRouteNameFromRoute,
  useRoute,
} from "@react-navigation/native";
import { useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import { NjLiveChat } from "../screens/NjLiveChat";
import { t } from "../localization/transfy";

const Stack = createStackNavigator();

const HomeStack = () => {
  const defaultNavigatorScreenOptions = {
    headerShown: true,
    // headerTransparent: true,
    headerTitleStyle: {
      fontWeight: "bold",
      fontFamily: "Rubik-Regular",
      fontSize: 20,
    },
    headerBackground: () => (
      <View style={[StyleSheet.absoluteFill, { backgroundColor: "#F2F2F2" }]} />
    ),
    headerTintColor: Colors.text_success,
    headerBackTitleVisible: false,
    ...TransitionPresets.ScaleFromCenterAndroid,
  };
  return (
    <Stack.Navigator
      // @ts-ignore
      screenOptions={defaultNavigatorScreenOptions}
      headerMode="float"
    >
      <Stack.Screen
        name={NavigationNames.HomeScreenNew}
        component={HomeScreenNew}
        options={{ title: "" }}
      />
      <Stack.Screen
        name={NavigationNames.NjExchangeScreen}
        component={NjExchangeScreen}
        options={{ title: `${t("Exchange")}` }}
      />
      <Stack.Screen
        name={NavigationNames.NjAppLoadingScreen}
        component={NjAppLoadingScreen}
        options={{ title: "" }}
      />
      <Stack.Screen
        name={NavigationNames.NjAccountScreen}
        component={NjAccountScreen}
        options={{ title: `${t("Account")}` }}
      />
      <Stack.Screen
        name={NavigationNames.NjWalletScreen}
        component={NjWalletScreen}
        options={{ title: `${t("Wallet")}` }}
      />
      <Stack.Screen
        name={NavigationNames.NjProfileScreen}
        component={NjProfileScreen}
        options={{ title: `${t("Personal Information")}` }}
      />
      <Stack.Screen
        name={NavigationNames.NjTransactionHistoryScreen}
        component={NjTransactionHistoryScreen}
        options={{ title: `${t("Transaction History")}` }}
      />
      <Stack.Screen
        name={NavigationNames.NjTransactionDetailScreen}
        component={NjTransactionDetailScreen}
        options={{ title: "Transaction Detail", headerShown: false }}
      />
      <Stack.Screen
        name={NavigationNames.NjAddCashScreen}
        component={NjAddCashScreen}
        options={{ title: `${t("Add Cash")}` }}
      />
      <Stack.Screen
        name={NavigationNames.NjBankDepositScreen}
        component={NjBankDepositScreen}
        options={{ title: `${t("Bank Deposit & Fund Requests")}` }}
      />
      <Stack.Screen
        name={NavigationNames.NjBankWithdrawScreen}
        component={NjBankWithdrawScreen}
        options={{ title: `${t("Bank Withdraw Requests")}` }}
      />
      <Stack.Screen
        name={NavigationNames.NjWalletTransferScreen}
        component={NjWalletTransferScreen}
        options={{ title: `${t("Transfer Funds")}` }}
      />
      <Stack.Screen
        name={NavigationNames.NjWithdrawWalletScreen}
        component={NjWithdrawWalletScreen}
        options={{ title: `${t("Withdraw Funds")}` }}
      />
      <Stack.Screen
        name={NavigationNames.NjAccountVerificationScreen}
        component={NjAccountVerificationScreen}
        options={{ title: `${t("Account Verification")}` }}
      />
      <Stack.Screen
        name={NavigationNames.NjForgetPasswordScreen}
        component={NjForgetPasswordScreen}
      />
      <Stack.Screen
        name={NavigationNames.NjChangePasswordScreen}
        component={NjChangePasswordScreen}
        options={{ title: `${t("Change Password")}` }}
      />
      <Stack.Screen
        name={NavigationNames.NjDepositScreen}
        component={NjDepositScreen}
        options={{ title: "Deposit" }}
      />
      <Stack.Screen
        name={NavigationNames.NjDepositScreen2}
        component={NjDepositScreen2}
        options={{ title: "Deposit" }}
      />
      <Stack.Screen
        name={NavigationNames.NjNairaDepositScreen}
        component={NjNairaDepositScreen}
        options={{ title: "Naira Deposit" }}
      />
      <Stack.Screen
        name={NavigationNames.NjGhanaDepositScreen}
        component={NjGhanaDepositScreen}
        options={{ title: "GHS Deposit" }}
      />
      <Stack.Screen
        name={NavigationNames.NjCreatePinScreen}
        component={NjCreatePinScreen}
        options={{ title: "Create Pin" }}
      />
      <Stack.Screen
        name={NavigationNames.NjConfirmPinScreen}
        component={NjConfirmPinScreen}
        options={{ title: "Confirm Pin" }}
      />
      <Stack.Screen
        name={NavigationNames.NjInputPinScreen}
        component={NjInputPinScreen}
        options={{ title: "Input Pin" }}
      />
      <Stack.Screen
        name={NavigationNames.NjLiveChat}
        component={NjLiveChat}
        options={{ title: "Live Chat", headerShown: false }}
      />
      <Stack.Screen
          name={NavigationNames.NjBeneficiaryScreen}
          component={NjBeneficiaryScreen}
          options={{ title: "Beneficiary", headerShown: true }}
      />
    </Stack.Navigator>
  );
};

const VerifyStack = () => {
  const defaultNavigatorScreenOptions = {
    headerShown: false,
    // headerTransparent: true,
    headerTitleStyle: {
      fontWeight: "bold",
      fontFamily: "Rubik-Regular",
      fontSize: 20,
    },
    headerBackground: () => (
      <View style={[StyleSheet.absoluteFill, { backgroundColor: "#F2F2F2" }]} />
    ),
    headerTintColor: Colors.text_success,
    headerBackTitleVisible: false,
    ...TransitionPresets.ScaleFromCenterAndroid,
  };
  return (
    <Stack.Navigator
      // @ts-ignore
      screenOptions={defaultNavigatorScreenOptions}
      headerMode="float"
      options={{ headerShown: false }}
    >
      <Stack.Screen
        name={NavigationNames.NjEmailVerificationScreen}
        component={NjEmailVerificationScreen}
        options={{ title: "" }}
      />
      <Stack.Screen
        name={"MainApp"}
        component={MainApp}
        options={{ title: "" }}
      />
    </Stack.Navigator>
  );
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

function MainApp() {
  return (
    <>
      <HomeStack />
      <NjBottomTabBar />
    </>
  );
}

export default function HomeTabNavigator() {
  const [emailVerificationStatus, setEmailVerificationStatus] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // setTimeout(() => {
    //   setLoading(true)
    // },2000)
    getValueFor("emailVerified").then((res) => {
      console.log("Email Verified from Tabbus: ", res);
      if (res == "true") {
        setEmailVerificationStatus(res.toString());
      } else {
        setEmailVerificationStatus(null);
      }
      // setEmailVerificationStatus(res.toString() === "true"? "true": null)
    });
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, [emailVerificationStatus]);

  if (emailVerificationStatus !== "true") {
    if (loading) {
      return <></>;
    } else {
      return <VerifyStack />;
    }
  } else {
    return (
      <>
        <HomeStack />
        <NjBottomTabBar />
      </>
    );
  }
}
