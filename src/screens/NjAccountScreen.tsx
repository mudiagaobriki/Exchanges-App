import React, { useContext, useEffect, useState } from "react";
import {
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  View,
  Switch,
  Alert,
  Button,
  TextInput, Modal,
} from "react-native";
import {Text, NjScreenBottomSpacer, Icon, HtmlView} from "../components";
import { useNavigation } from "@react-navigation/native";
import SafeAreaView from "react-native-safe-area-view";
import NavigationNames from "../navigations/NavigationNames";
import { StackNavigationProp } from "@react-navigation/stack";
import { Colors } from "../constants";
import { AuthenticationContext } from "../context";
import { Ionicons } from "@expo/vector-icons";
import * as LocalAuthentication from "expo-local-authentication";
import Swipeable from "react-native-gesture-handler/Swipeable";
import * as SecureStore from "expo-secure-store";
import * as WebBrowser from "expo-web-browser";
import axios from "axios";
import {getLanguage, t} from "../localization/transfy";
import { RadioButton } from 'react-native-paper';
import {isUndefined} from "lodash";
import * as Localization from "expo-localization";

export const NjAccountScreen = () => {
  const authContext = useContext(AuthenticationContext);
  const navigation = useNavigation<StackNavigationProp<any>>();
  const [isEnabled, setIsEnabled] = useState(false);
  const [fingerprintSetting, setFingerprintSetting] = useState("");
  const [isBiometricSupported, setIsBiometricSupported] = useState(false);
  const [languageModalVisible, setLanguageModalVisible] = useState(false);
  const [preferredLanguage, setPreferredLanguage] = useState<any|any>(null)
  const [checked, setChecked] = React.useState('first');
  const [dummyVariable, setDummyVariable] = React.useState('');

  const toggleSwitch = () => {
    setIsEnabled((prevState) => !prevState);
    // isEnabled? setFingerprintSetting("on"): setFingerprintSetting("off")
  };

  useEffect(() => {
    (async () => {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      setIsBiometricSupported(compatible);
    })();
    getValueFor("fingerprint").then((result) => {
      setFingerprintSetting(result);
      setIsEnabled(result === "on" ? true : false);
    });
    console.log("Fingerprint Setting: ", fingerprintSetting);
    console.log("Switched enabled? : ", isEnabled);
  }, [fingerprintSetting, isEnabled]);

  if (preferredLanguage === null){
    getValueFor("preferred_language")
        .then(result => {
          let val = result
          if (isUndefined(result)){
            const choice = Localization.locale;
            val = choice.substr(0, 2)
            setPreferredLanguage(val)
          }
          else{
            setPreferredLanguage(result)
          }

          // setChecked(result)
        })
  }


  const fallBackToDefaultAuth = () => {
    console.log("fall back to password authentication");
  };

  const alertComponent = (
    title: string,
    mess: string,
    btnTxt: string,
    btnFunc: any
  ) => {
    return Alert.alert(title, mess, [
      {
        text: btnTxt,
        onPress: btnFunc,
      },
    ]);
  };

  const handleBiometricAuth = async () => {
    // Check if hardware supports biometrics
    const isBiometricAvailable = await LocalAuthentication.hasHardwareAsync();

    // Fallback to default authentication method (password) if Fingerprint is not available
    if (!isBiometricAvailable)
      return alertComponent(
        "Please enter your password",
        "Biometric Authentication not supported",
        "OK",
        () => fallBackToDefaultAuth()
      );

    // Check Biometrics types available (Fingerprint, Facial recognition, Iris recognition)
    let supportedBiometrics;
    if (isBiometricAvailable)
      supportedBiometrics = await LocalAuthentication.supportedAuthenticationTypesAsync();

    // Check Biometrics are saved locally in user's device
    const savedBiometrics = await LocalAuthentication.isEnrolledAsync();
    if (!savedBiometrics)
      return alertComponent(
        "Biometric record not found",
        "Please use a registered fingerprint and a fingerprint enabled device",
        "OK",
        () => fallBackToDefaultAuth()
      );

    // Authenticate use with Biometrics (Fingerprint, Facial recognition, Iris recognition)

    const biometricAuth = await LocalAuthentication.authenticateAsync({
      promptMessage: "Login with Biometrics",
      cancelLabel: "Cancel",
      disableDeviceFallback: true,
    });
    // Log the user in on success
    if (biometricAuth.success) {
      toggleSwitch();
      // if (isEnabled === false){
      // 	save("fingerprint","off")
      // 		.then(() => {
      // 			console.log("Fingerprint turned Off")
      // 		})
      // }
      // else {
      // 	save("fingerprint","on")
      // 		.then(() => {
      // 			console.log("Fingerprint turned on")
      // 		})
      // }

      getValueFor("fingerprint").then((result) => {
        // Alert.alert("Fingerprint: ", fingerprintSetting)
        if (result === "on") {
          save("fingerprint", "off");
        } else {
          save("fingerprint", "on");
        }
      });

      console.log("success");
    } else {
      Alert.alert(`${t("Wrong Fingerprint")}`);
    }

    console.log({ isBiometricAvailable });
    console.log({ supportedBiometrics });
    console.log({ savedBiometrics });
    console.log({ biometricAuth });
  };

  const onSwipeFromLeft = () => {
    authContext.logout().then(() => {});
  };

  const LeftActions = (dragX: any) => {
    const scale = dragX.interpolate({
      inputRange: [0, 100],
      outputRange: [0, 1],
      extrapolate: "clamp",
    });
    return (
      <View
        style={{
          backgroundColor: "#E8FFF1",
          justifyContent: "center",
          flex: 1,
        }}
      ></View>
    );
  };

  // const onSwipeFromLeft = () => {
  // 	authContext.logout().then(() => {});
  // };

  async function save(key, value) {
    await SecureStore.setItemAsync(key, value);
  }

  async function getValueFor(key) {
    let result = await SecureStore.getItemAsync(key);
    if (result) {
      return result;
      // alert("🔐 Here's your value 🔐 \n" + result);
    } else {
      console.log("No fingerprint settings stored for this device.");
    }
  }

  useEffect(() => {
    getLanguage()
        .then(() => {
          console.log("Language preference loaded")
        })
    console.log("Preferred Language: ", preferredLanguage)
  },[preferredLanguage])

  return (
    <SafeAreaView style={styles.container} forceInset={{ top: "always" }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <TouchableOpacity
          style={{ paddingTop: 20, ...styles.item }}
          onPress={() =>
            navigation.navigate(NavigationNames.NjBankDepositScreen)
          }
        >
          {/*<Image source={require("../../assets/images/account-screen/favourite.png")} />*/}
          <Ionicons name="server-outline" color="#3FC976" size={20} />
          <Text style={styles.title}>{t("Bank Deposit Request")}</Text>
          <View style={{ flexDirection: "row", flex: 1 }}>
            <Image
              style={styles.forwardIcon}
              source={require("../../assets/images/account-screen/forward-icon.png")}
            />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.item}
          onPress={() =>
            navigation.navigate(NavigationNames.NjBankWithdrawScreen)
          }
        >
          {/*<Image source={require("../../assets/images/account-screen/favourite.png")} />*/}
          <Ionicons name="reader-sharp" color="#3FC976" size={20} />
          <Text style={styles.title}>{t("Bank Withdrawal Request")}</Text>
          <View style={{ flexDirection: "row", flex: 1 }}>
            <Image
              style={styles.forwardIcon}
              source={require("../../assets/images/account-screen/forward-icon.png")}
            />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.item}
          onPress={() => navigation.navigate(NavigationNames.NjProfileScreen)}
        >
          <Image
            source={require("../../assets/images/account-screen/user-circle.png")}
            style={{ width: 20, height: 20, resizeMode: "stretch" }}
          />
          <Text style={styles.title}>{t("Personal Information")}</Text>
          <View style={{ flexDirection: "row", flex: 1 }}>
            <Image
              style={styles.forwardIcon}
              source={require("../../assets/images/account-screen/forward-icon.png")}
            />
          </View>
        </TouchableOpacity>

        {/*<TouchableOpacity style={styles.item} onPress={() => navigation.navigate(NavigationNames.NjWalletScreen)}>*/}
        {/*	<Image source={require("../../assets/images/account-screen/balance.png")} />*/}
        {/*	<Text style={styles.title}>Wallet</Text>*/}
        {/*	<View style={{ flexDirection: "row", flex: 1 }}>*/}
        {/*		<Image style={styles.forwardIcon} source={require("../../assets/images/account-screen/forward-icon.png")} />*/}
        {/*	</View>*/}
        {/*</TouchableOpacity>*/}

        <TouchableOpacity
          style={styles.item}
          onPress={() =>
            navigation.navigate(NavigationNames.NjAccountVerificationScreen)
          }
        >
          <Image
            source={require("../../assets/images/account-screen/account-verification.png")}
          />
          <Text style={styles.title}>{t("Account Verification")}</Text>
          <View style={{ flexDirection: "row", flex: 1 }}>
            <Image
              style={styles.forwardIcon}
              source={require("../../assets/images/account-screen/forward-icon.png")}
            />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.item}
          onPress={() =>
            navigation.navigate(NavigationNames.NjChangePasswordScreen)
          }
        >
          <Image
            source={require("../../assets/images/account-screen/password.png")}
          />
          <Text style={styles.title}>{t("Change Password")}</Text>
          <View style={{ flexDirection: "row", flex: 1 }}>
            <Image
              style={styles.forwardIcon}
              source={require("../../assets/images/account-screen/forward-icon.png")}
            />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
            style={styles.item}
            onPress={() =>
                setLanguageModalVisible(true)
            }
        >
          {/*<Image*/}
          {/*    source={require("../../assets/images/account-screen/password.png")}*/}
          {/*/>*/}
          <Icon name="globe" group="FontAwesome" size={25} color={Colors.text_success} />
          <Text style={styles.title}>{t("Language")}</Text>
          <View style={{ flexDirection: "row", flex: 1 }}>
            <Image
                style={styles.forwardIcon}
                source={require("../../assets/images/account-screen/forward-icon.png")}
            />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.item}
          onPress={() =>
            navigation.navigate(NavigationNames.NjChangePasswordScreen)
          }
        >
          <Image
            source={require("../../assets/images/account-screen/favourite.png")}
          />
          <Text style={styles.title}>{t("Fingerprint")}</Text>
          <View style={{ flexDirection: "row", flex: 1, paddingRight: 3 }}>
            {/*<Image style={styles.forwardIcon} source={require("../../assets/images/account-screen/forward-icon.png")} />*/}
            <Switch
              trackColor={{ false: "#767577", true: Colors.text_success }}
              thumbColor={isEnabled ? Colors.text_success : "#f4f3f4"}
              ios_backgroundColor="#3e3e3e"
              onValueChange={handleBiometricAuth}
              value={isEnabled}
              style={[
                {
                  transform: [{ scaleX: 1.0 }, { scaleY: 1.0 }],
                },
                styles.forwardIcon,
              ]}
            />
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.item}>
          <Image source={require("../../assets/images/home-screen/epin.png")} />
          <Text style={styles.title}>{t("Set/Manage Pin")}</Text>
          <View style={{ flexDirection: "row", flex: 1 }}>
            <Image
              style={styles.forwardIcon}
              source={require("../../assets/images/account-screen/forward-icon.png")}
            />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.item}
          onPress={() =>
            WebBrowser.openBrowserAsync("https://transfy.io/contact")
          }
        >
          {/*<Image source={require("../../assets/images/home-screen/epin.png")} />*/}
          <Ionicons name="mail-outline" color="#3FC976" size={20} />
          <Text style={styles.title}>{t("Live Chat")}</Text>
          <View style={{ flexDirection: "row", flex: 1 }}>
            <Image
              style={styles.forwardIcon}
              source={require("../../assets/images/account-screen/forward-icon.png")}
            />
          </View>
        </TouchableOpacity>

        <View
          style={{
            flex: 1,
            flexDirection: "row",
            backgroundColor: "#E8FFF1",
            padding: 10,
            alignItems: "center",
            borderRadius: 20,
            marginBottom: 60,
          }}
        >
          <Swipeable
            renderLeftActions={LeftActions}
            onSwipeableLeftOpen={onSwipeFromLeft}
          >
            <View
              style={{
                flexDirection: "row",
                alignContent: "center",
                justifyContent: "flex-start",
                alignItems: "center",
                width: 400,
              }}
            >
              <View
                style={{
                  backgroundColor: Colors.text_success,
                  width: 50,
                  height: 50,
                  justifyContent: "center",
                  alignContent: "center",
                  alignItems: "center",
                  borderRadius: 10,
                  marginRight: 10,
                }}
              >
                <Ionicons name="log-out-outline" size={30} color="white" />
              </View>
              <Text
                style={{
                  fontSize: 16,
                  color: Colors.text_success,
                  fontFamily: "Rubik-Regular",
                }}
              >
                {t("Slide to Sign Out")}
              </Text>
            </View>
          </Swipeable>
        </View>

        <View style={styles.container}></View>

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
                            navigation.replace(NavigationNames.NjAccountScreen)
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

        <NjScreenBottomSpacer />

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F2F2F2",
    flex: 1,
    paddingHorizontal: 30,
  },
  item: {
    paddingBottom: 40,
    alignItems: "center",
    flexDirection: "row",
  },
  title: {
    fontSize: 16,
    paddingLeft: 10,
    color: "#B8B8B8",
    fontFamily: "Rubik-Regular",
  },
  forwardIcon: {
    justifyContent: "flex-end",
    alignItems: "center",
    marginLeft: "auto",
  },
  actionText: {
    color: Colors.text_success,
    fontWeight: "600",
    padding: 20,
  },
  button: {
    marginVertical: 30,
    backgroundColor: "#E8FFF1",
    borderColor: "#E8FFF1",
    color: Colors.text_success,
    borderRadius: 20,
    height: 55,
    width: "100%",
    alignSelf: "center",
    fontSize: 22,
    marginBottom: 20,
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
