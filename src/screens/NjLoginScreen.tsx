import { useNavigation } from "@react-navigation/native";
import React, {useContext, useEffect, useState} from "react";
import {
    Alert,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    Image,
    View,
    Dimensions, Modal,
} from "react-native";
import SafeAreaView from "react-native-safe-area-view";
import { Ionicons } from "@expo/vector-icons";
import { TextInput, KeyboardView, Text } from "../components";
import { AuthenticationContext } from "../context";
import { useLocalization } from "../localization";
import NavigationNames from "../navigations/NavigationNames";
import { AuthService } from "../services";
import { useTheme } from "../theme";
import { Colors } from "../constants";
import { axiosApiErrorAlert } from "../helpers";
import * as linking from "expo-linking";
import * as WebBrowser from "expo-web-browser";
import * as SecureStore from "expo-secure-store";
import {getLanguage, t} from "../localization/transfy";
import {RadioButton} from "react-native-paper";

export const NjLoginScreen = () => {
  const authContext = useContext(AuthenticationContext);
  const navigation = useNavigation();

  const { colors } = useTheme();
  const { getString } = useLocalization();

  const [email, setEmail] = useState("");
  const [otp, setOTP] = useState("");
  const [password, setPassword] = useState("");
  const [preferredLanguage, setPreferredLanguage] = useState("");
  const [displayedLanguage, setDisplayedLanguage] = useState("");
  const [languageModalVisible, setLanguageModalVisible] = useState(false);
  const [isSecureEntry, setIsSecureEntry] = useState(true);
  const [checked, setChecked] = React.useState('first');
  const [dummyVariable, setDummyVariable] = React.useState('');

  const onClickLogin = () => {
    // console.log('Error112:', JSON.stringify({email, password, otp}));
    if (email === "" || password === "") {
      Alert.alert(getString(`${t("please fill fields")}`));
      return;
    }
    AuthService.login(email, otp, password)
      .then(async (user: any) => {
        // console.log('Error112:', JSON.stringify(user));
        //   getValueFor("emailVerified")
        //       .then(async (res:any) =>{
        //           console.log("Res from Login: ", res)
        //           if (res == "true"){
        //               // navigation.navigate(NavigationNames.HomeScreenNew)
        //               await authContext.login(user)
        //                   .then((done)=>{
        //                       console.log("Login: ", done)
        //                       // navigation.replace(NavigationNames.HomeScreenNew)
        //                   })
        //           }
        //           else{
        //               navigation.replace(NavigationNames.NjEmailVerificationScreen,{user})
        //           }
        //       })
        await authContext.login(user);
        // navigation.navigate(NavigationNames.NjEmailVerificationScreen,{user})
        // navigation.goBack();
      })
      .catch((e) => {
        axiosApiErrorAlert(e);
        // console.log('Error53221:', e, JSON.stringify(e.response.data));
        // Alert.alert(e.message)
      });
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

  const onClickGetOTP = () => {
    if (email === "") {
      Alert.alert(`${t("Enter your email address first")}`);
      return;
    }
    AuthService.otp("login", { email })
      .then(async (success: any) => {
        if (success) {
          Alert.alert(`${t("OTP was sent to your registered mobile number")}`);
        } else {
          Alert.alert(`${t("Something went wrong, Please try again later")}`);
        }
      })
      .catch((e) => Alert.alert(e.message));
    // console.log('sms-verification', 'result1');
  };

  const onClickRegister = () => {
    navigation.navigate(NavigationNames.NjRegisterScreen);
  };

    async function save(key, value) {
        await SecureStore.setItemAsync(key, value);
    }

    useEffect(() => {
        getValueFor("preferred_language")
            .then(res => {
                if (res != null && res != undefined){
                    console.log("Fetched Language: ", res)
                    if (String(res) === "en"){
                        setPreferredLanguage("en")
                        setDisplayedLanguage("English")
                    }
                    else if (String(res).includes( "fr") ){
                        setPreferredLanguage("fr")
                        setDisplayedLanguage("French")
                        console.log("french")
                    }
                }
                else{
                    setPreferredLanguage("en")
                    setDisplayedLanguage("English")
                }
            })
            .catch(err => console.log("Error: ", err))
    },[])

  return (
    <SafeAreaView style={styles.container} forceInset={{ top: "always" }}>
      <View style={styles.topBar}>
        {navigation.canGoBack() ? (
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => {
              navigation.canGoBack();
            }}
          >
            <Ionicons
              name="ios-arrow-back"
              size={30}
              style={{ color: "#fff", marginVertical: 10, marginRight: 10 }}
            />
          </TouchableOpacity>
        ) : (
          <></>
        )}
        <Text
          style={{
            fontSize: 20,
            marginTop: 13,
            color: "#fff",
            fontWeight: "bold",
            fontFamily: "Rubik-Regular",
          }}
        >
          {t("Login")}
        </Text>

      </View>
      <KeyboardView style={styles.content}>
        <ScrollView
          contentContainerStyle={styles.contentContainerStyle}
          showsVerticalScrollIndicator={false}
        >
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              marginBottom: 50,
            }}
          >
            <Image
              source={require("../../assets/images/logo-white.png")}
              style={styles.logo}
            />
          </View>
          <View>
            <Text style={styles.inputText}>{t("Email")}</Text>
            <TextInput
              inputProps={{
                placeholder: getString("email"),
                value: email,
                onChangeText: setEmail,
                keyboardType: "email-address",
              }}
            />
          </View>
          <View style={styles.topitInputData}>
            <Text style={styles.inputText}>OTP</Text>
            <View style={{ flexDirection: "row" }}>
              <TextInput
                style={{ flex: 1, paddingRight: 65 }}
                inputProps={{
                  placeholder: getString("OTP"),
                  value: otp,
                  onChangeText: setOTP,
                  autoCorrect: false,
                  textContentType: "none",
                  keyboardType: "numeric",
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
                onPress={onClickGetOTP}
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
                  Get OTP
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.topitInputData}>
            <Text style={styles.inputText}>{t("Password")}</Text>
            <TextInput
              inputProps={{
                placeholder: getString("password"),
                secureTextEntry: isSecureEntry,
                textContentType: "none",
                autoCorrect: false,
                value: password,
                onChangeText: setPassword,
              }}
              style={{ paddingRight: 40 }}
            />
            <TouchableOpacity
              onPress={() => setIsSecureEntry((prev) => !prev)}
              style={{
                padding: 7,
                borderRadius: 10,
                marginLeft: 5,
                position: "absolute",
                right: 10,
                top: 30,
              }}
            >
              <Text>
                {isSecureEntry ? (
                  <Ionicons
                    name="ios-eye-off"
                    size={25}
                    style={{
                      color: "#000",
                      marginVertical: 10,
                      marginRight: 10,
                    }}
                  />
                ) : (
                  <Ionicons
                    name="ios-eye"
                    size={25}
                    style={{
                      color: "#000",
                      marginVertical: 10,
                      marginRight: 10,
                    }}
                  />
                )}
              </Text>
            </TouchableOpacity>
          </View>

          <Text
            style={{
              textAlign: "right",
              color: "#fff",
              fontSize: 15,
              fontWeight: "bold",
              paddingVertical: 10,
            }}
            onPress={() =>
              WebBrowser.openBrowserAsync(
                "https://app.transfy.io/password/reset"
              )
            }
          >
            {t("Forgot Password?")}
          </Text>

          <TouchableOpacity
            onPress={onClickLogin}
            activeOpacity={1}
            style={styles.button}
          >
            <Text
              style={{
                color: "#fff",
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              {t("Continue")}
            </Text>
          </TouchableOpacity>

          <Text style={styles.registerText}>
            {t("Don't have account?")} &nbsp;
            <Text onPress={onClickRegister}>{t("Register here")}</Text>
          </Text>

            <Text
                style={[styles.registerText,{marginTop: 20}]}
            >
                {t("Language")}: <Text onPress={() => setLanguageModalVisible(true)}>{displayedLanguage} (Tap to Change)</Text>
            </Text>

            <Modal
                animationType="slide"
                transparent={true}
                visible={languageModalVisible}
                onRequestClose={() => {
                    setLanguageModalVisible(false);
                }}
            >
                {/*<ScrollView>*/}
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>


                        <View style={{marginTop: 10}}>
                            <Text style={[styles.actionText,{fontSize: 18}]}>{t('Please select your preferred language')}</Text>
                            <View>
                                <View style={{flexDirection: "row", alignItems: "center"}}>
                                    <RadioButton
                                        value={t("English")}
                                        status={ preferredLanguage === 'en' ? 'checked' : 'unchecked' }
                                        onPress={() => {
                                            setChecked('first')
                                            setPreferredLanguage('en')
                                        }}
                                        color = {Colors.text_success}
                                    />
                                    <TouchableOpacity
                                        onPress={() => {
                                            setChecked('first')
                                            setPreferredLanguage('en')
                                        }}
                                        style={{width: "100%"}}
                                    >
                                        <Text style={[styles.actionText,{fontSize: 18}]}>English</Text>
                                    </TouchableOpacity>

                                </View>

                                <View style={{flexDirection: "row", alignItems: "center"}}>
                                    <RadioButton
                                        value={t("French")}
                                        status={ preferredLanguage === 'fr' ? 'checked' : 'unchecked' }
                                        onPress={() => {
                                            setChecked('second')
                                            setPreferredLanguage('fr')
                                        }}
                                        color = {Colors.text_success}
                                    />
                                    <TouchableOpacity
                                        onPress={() => {
                                            setChecked('second')
                                            setPreferredLanguage('fr')
                                        }}
                                        style={{width: "100%"}}
                                    >
                                        <Text style={[styles.actionText,{fontSize: 18}]}>French</Text>
                                    </TouchableOpacity>
                                </View>

                                {/*<View style={{flexDirection: "row", alignItems: "center"}}>*/}
                                {/*  <RadioButton*/}
                                {/*      value={t('Arabic')}*/}
                                {/*      status={ preferredLanguage === 'ar' ? 'checked' : 'unchecked' }*/}
                                {/*      onPress={() => {*/}
                                {/*        setPreferredLanguage('ar')*/}
                                {/*        setChecked('third')*/}
                                {/*      }}*/}
                                {/*      color = {Colors.text_success}*/}
                                {/*  />*/}
                                {/*  <TouchableOpacity*/}
                                {/*      onPress={() => {*/}
                                {/*        setChecked('third')*/}
                                {/*        setPreferredLanguage('ar')*/}
                                {/*      }}*/}
                                {/*      style={{width: "100%"}}*/}
                                {/*  >*/}
                                {/*    <Text style={[styles.actionText,{fontSize: 18}]}>Arabic</Text>*/}
                                {/*  </TouchableOpacity>*/}
                                {/*</View>*/}
                            </View>
                        </View>

                        <TouchableOpacity
                            style={[styles.button, styles.buttonClose, {justifyContent: "center"}]}
                            onPress={() => {
                                console.log("Preferred Language: ", preferredLanguage)
                                save("preferred_language",preferredLanguage)
                                    .then(() => {
                                        getLanguage()
                                            .then(() => {
                                                console.log("Language successfully changed")
                                                setDummyVariable("dummy")
                                            })
                                        setLanguageModalVisible(false);
                                        navigation.replace(NavigationNames.NjLoginScreen)
                                        console.log("Language preference saved : ", preferredLanguage)
                                    })
                                    .catch(err => {
                                        console.log("Error in saving language preference: ", err)
                                        setLanguageModalVisible(false)
                                    })

                            }}
                        >
                            <Text style={styles.textStyle}>Save</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                {/*</ScrollView>*/}
            </Modal>
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
    backgroundColor: Colors.text_success,
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
    actionText: {
        color: Colors.text_success,
        fontWeight: "600",
        padding: 20,
    },
    modalView: {
        justifyContent: "center",
        backgroundColor: "#fff",
        borderRadius: 20,
        height: 'auto',
        padding: 30,
        width: "70%",
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22,
    },
    buttonClose: {
        backgroundColor: "#28a745",
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center",
    },

});
