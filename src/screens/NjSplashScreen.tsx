import React, { useContext, useEffect, useState } from "react";
import { StyleSheet, Image, View, Dimensions } from "react-native";
import { Text } from "../components";
import { useNavigation } from "@react-navigation/native";
import SafeAreaView from "react-native-safe-area-view";
import { DashboardModel } from "../models";
import { StackNavigationProp } from "@react-navigation/stack";
import AppIntroSlider from "react-native-app-intro-slider";
import { Colors } from "../constants";
import { NjLoginScreen } from "./NjLoginScreen";
import { AuthenticationContext } from "../context";
import { t } from "../localization/transfy";

export const NjSplashScreen = () => {
  const [showRealApp, setShowRealApp] = useState(false);

  const authContext = useContext(AuthenticationContext);

  const onSkip = () => {
    setShowRealApp(true);
  };

  const slides = [
    {
      key: "s1",
      title: `${t("Welcome")}`,
      text: `${t(
        "We make payments look simple, Take full control over payments"
      )}`,
      image: require("../../assets/splash/1.png"),
    },
    {
      key: "s2",
      title: `${t("Welcome")}`,
      text: `${t("Buy Airtime and Pay bills with added convenience")}`,
      image: require("../../assets/splash/2.png"),
    },
    {
      key: "s3",
      title: `${t("Welcome")}`,
      text: `${t("Let’s try Transfy now! And get the best experience")}`,
      image: require("../../assets/splash/3.png"),
    },
  ];

  // @ts-ignore
  const RenderItem = ({ item }) => {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: item.backgroundColor,
          alignItems: "center",
          justifyContent: "center",
          paddingHorizontal: 30,
        }}
      >
        <View style={{ height: "auto", alignItems: "center" }}>
          <Image style={styles.introImageStyle} source={item.image} />
          <Text style={styles.introTitleStyle}>{item.title}</Text>
          <Text style={styles.introTextStyle}>{item.text}</Text>
        </View>
      </View>
    );
  };

  const renderNextButton = () => {
    return (
      <View style={styles.continueButton}>
        <Text
          style={{
            textAlign: "center",
            color: "#fff",
            fontFamily: "Rubik-Regular",
            fontSize: 18,
          }}
        >
          {t("Continue")}
        </Text>
      </View>
    );
  };

  const renderDoneButton = () => {
    return (
      <View style={styles.continueButton}>
        <Text
          style={{
            textAlign: "center",
            color: "#fff",
            fontFamily: "Rubik-Regular",
            fontSize: 18,
          }}
        >
          {t("Get Started")}
        </Text>
      </View>
    );
  };

  return (
    <>
      {showRealApp ? (
        <SafeAreaView style={styles.container}>
          <View style={styles.container}>
            <Text style={styles.paragraphStyle}>
              <NjLoginScreen />
            </Text>
          </View>
        </SafeAreaView>
      ) : (
        <AppIntroSlider
          data={slides}
          renderItem={RenderItem}
          onDone={authContext.doneSplash}
          showSkipButton={false}
          onSkip={onSkip}
          renderNextButton={renderNextButton}
          renderDoneButton={renderDoneButton}
          bottomButton
          activeDotStyle={{ backgroundColor: Colors.text_success }}
        />
      )}
    </>
  );
};

const win = Dimensions.get("window");
const styles = StyleSheet.create({
  container: { flex: 1 },
  titleStyle: {
    padding: 10,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
  },
  paragraphStyle: {
    padding: 20,
    textAlign: "center",
    fontSize: 16,
  },
  introImageStyle: {
    width: 200,
    height: 200,
  },
  introTitleStyle: {
    fontSize: 35,
    color: "#000",
    textAlign: "center",
    fontWeight: "bold",
    fontFamily: "Rubik-Regular",
    marginTop: 40,
  },
  introTextStyle: {
    fontSize: 18,
    color: Colors.text_success,
    textAlign: "center",
    fontFamily: "Rubik-Regular",
    marginTop: 20,
    marginBottom: 20,
  },
  continueButton: {
    padding: 20,
    backgroundColor: Colors.text_success,
    justifyContent: "center",
    textAlign: "center",
    borderRadius: 10,
  },
});
