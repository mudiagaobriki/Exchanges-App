import React, { useEffect, useRef, useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  Dimensions,
  TextInput,
  Alert,
} from "react-native";
// import OTPInputView from "@twotalltotems/react-native-otp-input";
// import Ionicons from "react-native-vector-icons/Ionicons";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Colors } from "../constants";
// import {Dropdown} from "react-native-element-dropdown";
import { Icon } from "../components";
import NavigationNames from "../navigations/NavigationNames";
import VirtualKeyboard from "react-native-virtual-keyboard";
import * as SecureStore from "expo-secure-store";
import { t } from "../localization/transfy";

const window = Dimensions.get("window");
const screen = Dimensions.get("screen");

export const NjConfirmPinScreen = () => {
  const box1 = useRef(null);
  const box2 = useRef(null);
  const box3 = useRef(null);
  const box4 = useRef(null);
  const keyboard = useRef(null);
  const [activeInput, setActiveInput] = useState("");
  const [otpFirstDigit, setOtpFirstDigit] = useState("");
  const [otpSecondDigit, setOtpSecondDigit] = useState("");
  const [otpThirdDigit, setOtpThirdDigit] = useState("");
  const [otpFourthDigit, setOtpFourthDigit] = useState("");
  const [otpConfirm, setOtpConfirm] = useState("");
  const navigation = useNavigation();
  const route = useRoute();

  useEffect(() => {
    console.log("Pin: ", route.params?.pin.length);
    console.log(
      "OTP: ",
      `${otpFirstDigit}${otpSecondDigit}${otpThirdDigit}${otpFourthDigit}`
        .length
    );
    // console.log("otp1: ", otpFirstDigit)
    // console.log("otp2: ", otpSecondDigit)
    // console.log("otp3: ", otpThirdDigit)
    console.log("otpConfirm: ", otpConfirm);
  }, [otpConfirm]);

  const confirmPin = () => {
    let pinTallies = route.params?.pin === otpConfirm;
    console.log(route.params?.pin === otpConfirm);
    // Alert.alert(pinTallies.toString())
    if (pinTallies) {
      save("pin", route.params?.pin).then(() => {
        Alert.alert(`${t("Pin set successfully")}`);
        navigation.navigate(NavigationNames.NjAccountScreen);
      });
    } else {
      Alert.alert(`${t("Pins do not tally. Please try again.")}`);
      return;
    }
  };

  async function save(key: any, value: any) {
    await SecureStore.setItemAsync(key, value);
  }

  async function getValueFor(key: any) {
    let result = await SecureStore.getItemAsync(key);
    if (result) {
      return result;
      // alert("🔐 Here's your value 🔐 \n" + result);
    } else {
      console.log("No fingerprint settings stored for this device.");
    }
  }

  return (
    <View style={styles.container} forceInset={{ top: "always" }}>
      <View style={styles.topBar}>
        {/*<TouchableOpacity*/}
        {/*	activeOpacity={1}*/}
        {/*	onPress={() => {*/}
        {/*		navigation.goBack();*/}
        {/*	}}*/}
        {/*>*/}
        {/*	<Ionicons name="ios-arrow-back" size={30} style={{ color: Colors.text_success, marginVertical: 10, marginRight: 10 }} />*/}
        {/*</TouchableOpacity>*/}
        {/*<Text style={{ fontSize: 20, marginTop: 13, color: Colors.text_success, fontWeight: "bold", fontFamily: "Rubik-Regular" }}>Confirm Pin</Text>*/}
      </View>
      <View
        style={{
          backgroundColor: "whitesmoke",
          marginBottom: 30,
          marginTop: 50,
        }}
      >
        <Text style={styles.heading}>{t("Please Confirm Pin")}</Text>
      </View>
      <View
        style={{
          width: "100%",
          maxHeight: 100,
          paddingHorizontal: 30,
          backgroundColor: "whitesmoke",
          flex: 1,
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <TextInput
          style={styles.underlineStyleBase}
          showSoftInputOnFocus={false}
          value={otpFirstDigit}
          onChangeText={setOtpFirstDigit}
          onFocus={() => setActiveInput("box1")}
          ref={box1}
        ></TextInput>
        <TextInput
          style={styles.underlineStyleBase}
          showSoftInputOnFocus={false}
          value={otpSecondDigit}
          onChangeText={setOtpSecondDigit}
          onFocus={() => setActiveInput("box2")}
          ref={box2}
        ></TextInput>
        <TextInput
          style={styles.underlineStyleBase}
          showSoftInputOnFocus={false}
          value={otpThirdDigit}
          onChangeText={setOtpThirdDigit}
          onFocus={() => setActiveInput("box3")}
          ref={box3}
        ></TextInput>
        <TextInput
          style={styles.underlineStyleBase}
          showSoftInputOnFocus={false}
          value={otpFourthDigit}
          onChangeText={setOtpFourthDigit}
          onFocus={() => setActiveInput("box4")}
          ref={box4}
        ></TextInput>
      </View>
      <View style={{ flex: 1 }}>
        <VirtualKeyboard
          color="white"
          pressMode="char"
          onPress={(val: string) => {
            // console.log(activeInput)
            if (activeInput === "box1" || activeInput === "") {
              if (val === "back") {
                setOtpFirstDigit("");
              } else {
                setOtpFirstDigit(val);
                box2.current?.focus();
              }
            } else if (activeInput === "box2") {
              if (val === "back") {
                setOtpSecondDigit("");
                if (otpSecondDigit === "") {
                  setOtpSecondDigit("");
                  box1.current?.focus();
                }
              } else {
                setOtpSecondDigit(val);
                box3.current?.focus();
              }
            } else if (activeInput === "box3") {
              if (val === "back") {
                setOtpThirdDigit("");
                if (otpThirdDigit === "") {
                  setOtpSecondDigit("");
                  box2.current?.focus();
                }
              } else {
                setOtpThirdDigit(val);
                box4.current?.focus();
              }
            } else if (activeInput === "box4") {
              if (val === "back") {
                setOtpFourthDigit("");
                if (otpFourthDigit === "") {
                  setOtpThirdDigit("");
                  box3.current?.focus();
                }
              } else {
                setOtpFourthDigit(val);
                setOtpConfirm(
                  `${otpFirstDigit}${otpSecondDigit}${otpThirdDigit}${val}`
                );
                setTimeout(() => confirmPin(), 1000);
              }
            }
          }}
          style={{
            backgroundColor: Colors.text_success,
            width: window.width,
            marginLeft: -30,
            paddingLeft: 0,
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
            height: window.height / 2,
            paddingTop: 30,
          }}
          cellStyle={{
            backgroundColor: "#3DC676",
            width: 50,
            marginHorizontal: 20,
            borderRadius: 18,
            paddingVertical: 8,
          }}
          ref={keyboard}
        />
      </View>
    </View>
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
  underlineStyleBase: {
    width: 50,
    height: 50,
    borderColor: "#E4E3E4",
    borderWidth: 1,
    color: "black",
    borderRadius: 10,
    textAlign: "center",
    backgroundColor: "#E4E3E4",
    fontWeight: "bold",
    fontSize: 16,
  },
  heading: {
    marginLeft: 30,
    fontWeight: "bold",
    marginBottom: 30,
    fontFamily: "Rubik-Regular",
    fontSize: 18,
  },
  submitBtn: {
    backgroundColor: "#131A22",
    width: 318,
    height: 48,
    borderRadius: 10,
    alignSelf: "center",
    marginBottom: 20,
    marginTop: 20,
  },
  btnText: {
    alignSelf: "center",
    color: "white",
    fontSize: 16,
    fontWeight: "500",
    alignContent: "center",
    marginTop: 14,
  },
});
