import {useNavigation, useRoute} from "@react-navigation/native";
import React, {useContext, useEffect, useState} from "react";
import { Alert, ScrollView, StyleSheet, TouchableOpacity, Image, View, Dimensions, } from "react-native";
import SafeAreaView from "react-native-safe-area-view";
import { Ionicons } from "@expo/vector-icons";
import {
  TextInput,
  KeyboardView,
  Text,
} from "../components";
import { AuthenticationContext } from "../context";
import { useLocalization } from "../localization";
import NavigationNames from "../navigations/NavigationNames";
import {AuthService, UserService} from "../services";
import { useTheme } from "../theme";
import { Colors } from "../constants";
import {axiosApiErrorAlert} from "../helpers";
import moment from "moment";
import * as SecureStore from "expo-secure-store";


export const NjEmailVerificationScreen = () => {
  const authContext = useContext(AuthenticationContext);
  const navigation = useNavigation();
  const route = useRoute();

  const { colors } = useTheme();
  const { getString } = useLocalization();

  const [email, setEmail] = useState("");
  const [otp, setOTP] = useState("");
  const [password, setPassword] = useState("");
  const [isSecureEntry, setIsSecureEntry] = useState(true);
  const user = authContext.user;
  const [emailVerified, setEmailVerified] = useState("")



  useEffect(() => {
      console.log("Route Name :", route.name)
      authContext.login(user).then(() => {})
      getValueFor("emailVerified")
          .then(res =>{
              console.log("Res: ", res)
              if (res == "true"){
                  // navigation.navigate(NavigationNames.HomeScreenNew)
                  navigation.navigate("MainApp")
                  // authContext.login(user).then(() => {})
                  setEmailVerified(res)
              }
          })
      clearInterval()
  },[emailVerified])

  const onClickVerify = () => {
      if (otp === ""){
          Alert.alert("Please input OTP")
          return;
      }
    AuthService.confirmEmailVerification("user",otp)
        .then(res => {
            console.log(res)
            if (res["success"] == true){
                save("emailVerified", "true")
                    .then(() => {
                        Alert.alert("Email Verification Successful.")
                        authContext.login(user).then(() => {
                            navigation.navigate("MainApp")
                        })

                        // authContext.logout().then(() => {});
                        // navigation.navigate(NavigationNames.NjLoginScreen)
                    })
            }
            else{
                Alert.alert(res["message"])
                return
            }
        })
        .catch(err => console.log(err))

  };

  const onClickRegister = () => {
    navigation.navigate(NavigationNames.NjRegisterScreen);
  };

    const onClickGetEmailOTP = () => {
        // if (email === "") {
        //     Alert.alert("Enter your email address first");
        //     return;
        // }

        AuthService.sendEmailVerification(email)
            .then(res => {
                console.log("Email Verification Sending Result: ", res)
                Alert.alert("Email sent to the provided Email address.")
                // authContext.logout()
                //     .then( () => navigation.navigate(NavigationNames.NjLoginScreen))
            })
        // console.log('sms-verification', 'result1');
    };

    async function save(key, value) {
        await SecureStore.setItemAsync(key, value);
    }

    async function getValueFor(key) {
        let result = await SecureStore.getItemAsync(key);
        if (result) {
            return result
            // alert("🔐 Here's your value 🔐 \n" + result);
        } else {
            console.log('No fingerprint settings stored for this device.');
        }
    }

  return (
    <SafeAreaView style={[styles.container]} forceInset={{ top: "always" }}>
      <View style={styles.topBar}>
        {
          navigation.canGoBack() ?
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => {
                navigation.canGoBack();
              }}
            >
              <Ionicons
                name="ios-arrow-back"
                size={30}
                style={{ color: Colors.text_success, marginVertical: 10, marginRight: 10 }}
              />
            </TouchableOpacity>
          :
            <></>
        }
        <Text
          style={{
            fontSize: 20,
            marginTop: 13,
            color: Colors.text_success,
            fontWeight: "bold",
            fontFamily: "Rubik-Regular",
          }}
        >
          Email Verification
        </Text>
      </View>
      <KeyboardView style={styles.content}>
        <ScrollView contentContainerStyle={styles.contentContainerStyle} showsVerticalScrollIndicator={false}>
          <View style={{justifyContent: "center", alignItems: "center", marginBottom: 50 }}>
            <Image
              source={require("../../assets/images/logo.png")}
              style={styles.logo}
            />
          </View>
          {/*<View>*/}
          {/*  <Text style={styles.inputText}>Email</Text>*/}
          {/*  <TextInput*/}
          {/*    inputProps={{*/}
          {/*      placeholder: getString("email"),*/}
          {/*      value: email,*/}
          {/*      onChangeText: setEmail,*/}
          {/*      keyboardType: "email-address",*/}
          {/*    }}*/}
          {/*  />*/}
          {/*</View>*/}
          {/*  <View>*/}
          {/*      */}
          {/*  </View>*/}
          <View style={[styles.topitInputData, {marginBottom: 100}]}>
            <Text style={[styles.inputText,{color: "black"}]}>OTP</Text>
            <View style={{ flexDirection: "row" }}>
              <TextInput
                style={{ flex: 1, paddingRight: 65 }}
                inputProps={{
                  placeholder: getString("OTP"),
                  value: otp,
                  onChangeText: setOTP,
                  autoCorrect: false,
                  textContentType: "none",
                  keyboardType: "numeric"
                }}
              />
              <TouchableOpacity
                activeOpacity={1}
                style={{
                  padding: 7,
                  borderRadius: 10,
                  marginLeft: 5,
                  position: "absolute",
                  right: 10,
                }}
                onPress={onClickGetEmailOTP}
              >
                <Text
                  style={{
                    paddingVertical: 10,
                    color: Colors.text_success,
                    fontSize: 15,
                    fontWeight: "bold",
                    textDecorationLine: "underline",
                  }}
                >
                  Get Email OTP
                </Text>
              </TouchableOpacity>
            </View>
          </View>



          <TouchableOpacity
            onPress={onClickVerify}
            activeOpacity={1} style={styles.button}>
            <Text
              style={{
                color: "#fff",
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              Verify
            </Text>
          </TouchableOpacity>

          {/*<Text style={styles.registerText}>*/}
          {/*  Don't have account? &nbsp;*/}
          {/*  <Text onPress={onClickRegister}>Register here</Text>*/}
          {/*</Text>*/}
        </ScrollView>
      </KeyboardView>
    </SafeAreaView>
  );
};

const win = Dimensions.get("window");
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 30,
    // backgroundColor: Colors.text_success,
      backgroundColor: "#F2F2F2",
  },
  topBar: {
    flexDirection: "row",
    paddingTop: 10,
  },
  content: {
    flex: 1,
  },
  contentContainerStyle: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 16,
  },
  titleText: {
    fontSize: 42,
    fontFamily: "default-light",
    marginBottom: 24,
  },
  registerButton: {
    alignSelf: "center",
  },
  logo: {
    width: 220,
    height: 80,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    marginVertical: 20,
    backgroundColor: "#000",
    borderColor: "#000",
    color: Colors.text_success,
    borderRadius: 20,
    paddingVertical: 20,
    width: "100%",
    alignSelf: "center",
    fontSize: 22,
  },
  registerText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "bold",
  },
  topitInputData: {
    marginTop: 20,
  },
  inputText: {
    fontSize: 16,
    marginBottom: 5,
    fontFamily: "Rubik-Regular",
    color: "#fff",
  },
});
