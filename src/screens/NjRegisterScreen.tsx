import React, { useContext, useEffect, useState } from "react";
import {
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  View,
  Alert,
} from "react-native";
import { Text, TextInput, KeyboardView } from "../components";
import { useNavigation } from "@react-navigation/native";
import SafeAreaView from "react-native-safe-area-view";
// import { DashboardModel } from "../models";
import { StackNavigationProp } from "@react-navigation/stack";
import { Ionicons } from "@expo/vector-icons";
import NavigationNames from "../navigations/NavigationNames";
// import { useTheme } from "../theme";
import { useLocalization } from "../localization";
import { AuthService } from "../services";
import { AuthenticationContext } from "../context";
import DropDownPicker from "react-native-dropdown-picker";
import { RadioButton } from "react-native-paper";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Colors } from "../constants";
import {
  axiosApiErrorAlert,
  convertJsNativeDateToStringDate,
} from "../helpers";
import {getLanguage, t} from "../localization/transfy";
import * as SecureStore from "expo-secure-store";

export const NjRegisterScreen = () => {
  const authContext = useContext(AuthenticationContext);
  const navigation = useNavigation<StackNavigationProp<any>>();
  const { getString } = useLocalization();
  const onClickLogin = () => {
    navigation.navigate(NavigationNames.NjLoginScreen);
  };

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState("male");
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("");
  const [preferredLanguage, setPreferredLanguage] = useState("en");
  const [mobileNumber, setMobileNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [countryDropDownPicker, setCountryDropDownPicker] = useState(false);
  const [languageDropDownPicker, setLanguageDropDownPicker] = useState(false);
  const [dob, setDob] = useState();
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [isSecureEntry, setIsSecureEntry] = useState(true);

    const languages = [
        {id: 1, title: 'English', val: 'en'},
        {id: 2, title: 'French', val: 'fr'},
        {id: 3, title: 'Arabic', val: 'ar'},
    ];

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };
  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };
  const datePickerConfirm = (date: any) => {
    setDob(date);
    hideDatePicker();
  };

  const onClickGetOTP = () => {
    if (email === "") {
      Alert.alert(`${t("Enter your email address first")}`);
      return;
    }
    if (country === "") {
      Alert.alert(`${t("Select your country first")}`);
      return;
    }
    AuthService.otp("register", {
      mobile_number: mobileNumber,
      country,
    })
      .then(async (success: any) => {
        if (success) {
          Alert.alert(`${t("OTP was sent to your registered mobile number")}`);
        } else {
          Alert.alert(`${t("Something went wrong, Please try again later")}`);
        }
      })
      .catch((e) => {
        axiosApiErrorAlert(e);
      });
    // console.log('sms-verification', 'result1');
  };

  const onClickGetEmailOTP = () => {
    if (email === "") {
      Alert.alert(`${t("Enter your email address first")}`);
      return;
    }

    AuthService.sendEmailVerification(email).then((res) => {
      console.log("Email Verification Sending Result: ", res);
      Alert.alert(`${t("Email sent to the provided Email address")}`);
      // authContext.logout()
      //     .then( () => navigation.navigate(NavigationNames.NjLoginScreen))
    });
    // console.log('sms-verification', 'result1');
  };

  const onClickRegister = () => {
    if (
      email === "" ||
      password === "" ||
      passwordConfirmation === "" ||
      country === "" ||
      mobileNumber === "" ||
      otp === ""
    ) {
      Alert.alert(getString(`${t("please fill fields")}`));
      return;
    }
    console.log("country", country);

    save("preferred_language",preferredLanguage)
        .then(() => console.log("Language Preference saved"))
        .catch(err => console.log("Language Saving Error: ", err))

    // AuthService.sendEmailVerification(email)
    //     .then(res => console.log("Result: ", res))
    AuthService.register(
      name,
      // username,
      email,
      // gender,
      country,
      mobileNumber,
      otp,
      // moment(dob).format("DD/MM/YYYY"),
      // dob,
      // convertJsNativeDateToStringDate(dob,true),
      password,
      passwordConfirmation
    )
      .then(async (user: any) => {
        // console.log('Error4361:', JSON.stringify(user));
        //   await authContext.login(user);
        //   AuthService.sendEmailVerification(email)
        //       .then(res => {
        //           console.log("Result: ", res)
        //           Alert.alert("Registration successful. Please login to continue using the app.")
        //           authContext.logout()
        //               .then( () => navigation.navigate(NavigationNames.NjLoginScreen))
        //       })
        Alert.alert(
          `${t(
            "Registration successful Please login to continue using the app"
          )}`
        );
        navigation.navigate(NavigationNames.NjLoginScreen);
        // await authContext.login(user);
        // navigation.goBack();
      })
      .catch((e) => {
        axiosApiErrorAlert(e);
        // console.log('Error5681:', e, JSON.stringify(e.response));
        // Alert.alert(e.message)
      });
  };

  const fetchCountries = async () => {
    const countries = await AuthService.getCountries();
    // console.log("get Countries 1511", countries)
    setCountries(countries);

    //   .then(res => {
    //   })
    //   .catch((e) => Alert.alert(e.message));
    // // console.log('sms-verification', 'result1');
  };

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
      getLanguage()
          .then(() => {
              console.log("Language preference loaded")
          })
    if (countries.length === 0) {
      fetchCountries().then(() => console.log);
    }
    // fetchCountries().then(() => console.log)
    clearInterval();
    console.log("Name: ", name);
    console.log("DOb: ", dob);
    console.log("Country: ", country);
    console.log("Gender: ", gender);
    console.log("Mobile Number: ", mobileNumber);
    console.log("OTP: ", otp);
    console.log("Email: ", email);
    console.log("Password: ", password);
    console.log("Confirm Password: ", passwordConfirmation);
  }, [
    name,
    dob,
    country,
    gender,
    mobileNumber,
    otp,
    email,
    password,
    passwordConfirmation,
  ]);

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

  return (
    <SafeAreaView style={styles.container} forceInset={{ top: "always" }}>
      <View style={styles.topBar}>
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => {
            navigation.goBack();
          }}
        >
          <Ionicons
            name="ios-arrow-back"
            size={30}
            style={{ color: "#fff", marginVertical: 10, marginRight: 10 }}
          />
        </TouchableOpacity>
        <Text
          style={{
            fontSize: 20,
            marginTop: 13,
            color: "#fff",
            fontWeight: "bold",
            fontFamily: "Rubik-Regular",
          }}
        >
          {t("Register")}
        </Text>
      </View>
      <KeyboardView style={styles.content}>
        <ScrollView
          contentContainerStyle={styles.contentContainerStyle}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={false}
              onRefresh={() => fetchCountries()}
            />
          }
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
            <Text style={styles.inputText}>{t("Name")}</Text>
            <TextInput
              inputProps={{
                placeholder: getString("Your Name"),
                value: name,
                onChangeText: setName,
              }}
            />
          </View>
          {/*<View style={styles.topitInputData}>*/}
          {/*<View>*/}
          {/*    <Text style={styles.inputText}>Username</Text>*/}
          {/*    <TextInput*/}
          {/*        inputProps={{*/}
          {/*            placeholder: getString("Your Username"),*/}
          {/*            value: username,*/}
          {/*            onChangeText: setUsername,*/}
          {/*        }}*/}
          {/*    />*/}
          {/*</View>*/}
          {/*</View>*/}
          <View style={styles.topitInputData}>
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
          {/*<View style={styles.topitInputData}>*/}
          {/*  <Text style={styles.inputText}>Gender</Text>*/}
          {/*  <RadioButton.Group*/}
          {/*    onValueChange={(selectedGender) => setGender(selectedGender)}*/}
          {/*    value={gender}*/}
          {/*  >*/}
          {/*    <View*/}
          {/*      style={{*/}
          {/*        flexDirection: "row",*/}
          {/*        padding: 5,*/}
          {/*        justifyContent: "space-between",*/}
          {/*        alignItems: "center",*/}
          {/*        flex: 1,*/}
          {/*        alignContent: "center",*/}
          {/*      }}*/}
          {/*    >*/}
          {/*      <RadioButton.Item*/}
          {/*        label="Male"*/}
          {/*        value="male"*/}
          {/*        color="#000"*/}
          {/*        uncheckedColor="#000"*/}
          {/*        labelStyle={{ color: "#fff" }}*/}
          {/*        onPress={() => setGender}*/}
          {/*        status="checked"*/}
          {/*      />*/}
          {/*      <RadioButton.Item*/}
          {/*        label="Female"*/}
          {/*        value="female"*/}
          {/*        color="#000"*/}
          {/*        uncheckedColor="#000"*/}
          {/*        labelStyle={{ color: "#fff" }}*/}
          {/*        onPress={() => setGender}*/}
          {/*      />*/}
          {/*    </View>*/}
          {/*  </RadioButton.Group>*/}
          {/*</View>*/}
          <View style={styles.topitInputData}>
            <Text style={styles.inputText}>{t("Country")}</Text>
            <DropDownPicker
              schema={{
                label: "name", // required
                value: "code", // required
                icon: "icon",
                parent: "parent",
                selectable: "selectable",
                disabled: "disabled",
              }}
              listMode="MODAL"
              placeholder="Select a country"
              open={countryDropDownPicker}
              value={country}
              items={countries}
              setOpen={() => setCountryDropDownPicker(true)}
              onClose={() => setCountryDropDownPicker(false)}
              // @ts-ignore
              setValue={(val: Function) => {
                setCountry(val());
                setCountryDropDownPicker(false);
              }}
              style={{
                zIndex: 10,
                borderColor: "#e0e0e0",
                elevation: 0,
                shadowOffset: {
                  width: 0,
                  height: 4,
                },
              }}
            />
          </View>
            <View style={styles.topitInputData}>
                <Text style={styles.inputText}>{t("preferred_language")}</Text>
                <DropDownPicker
                    schema={{
                        label: "title", // required
                        value: "val", // required
                        icon: "icon",
                        parent: "parent",
                        selectable: "selectable",
                        disabled: "disabled",
                    }}
                    listMode="MODAL"
                    placeholder="Preferred Language"
                    open={languageDropDownPicker}
                    value={preferredLanguage}
                    items={languages}
                    setOpen={() => setLanguageDropDownPicker(true)}
                    onClose={() => setLanguageDropDownPicker(false)}
                    // @ts-ignore
                    setValue={(val: Function) => {
                        console.log("Language: ", val())
                        setPreferredLanguage(val());
                        setLanguageDropDownPicker(false);
                    }}
                    style={{
                        zIndex: 10,
                        borderColor: "#e0e0e0",
                        elevation: 0,
                        shadowOffset: {
                            width: 0,
                            height: 4,
                        },
                    }}
                />
            </View>
          <View style={styles.topitInputData}>
            <Text style={styles.inputText}>{t("Mobile Number")}</Text>
            <TextInput
              inputProps={{
                placeholder: getString("Mobile Number"),
                value: mobileNumber,
                onChangeText: setMobileNumber,
                autoCorrect: false,
                textContentType: "telephoneNumber",
                keyboardType: "numeric",
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
                  onChangeText: setOtp,
                  autoCorrect: false,
                  textContentType: "oneTimeCode",
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
                  {t("Get OTP")}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/*<View style={styles.topitInputData}>*/}
          {/*    <Text style={styles.inputText}>OTP (For Email)</Text>*/}
          {/*    <View style={{ flexDirection: "row" }}>*/}
          {/*        <TextInput*/}
          {/*            style={{ flex: 1, paddingRight: 65 }}*/}
          {/*            inputProps={{*/}
          {/*                placeholder: getString("OTP"),*/}
          {/*                value: otp,*/}
          {/*                onChangeText: setOtp,*/}
          {/*                autoCorrect: false,*/}
          {/*                textContentType: "oneTimeCode",*/}
          {/*                keyboardType: "numeric"*/}
          {/*            }}*/}
          {/*        />*/}
          {/*        <TouchableOpacity*/}
          {/*            activeOpacity={1}*/}
          {/*            style={{*/}
          {/*                padding: 7,*/}
          {/*                borderRadius: 10,*/}
          {/*                marginLeft: 5,*/}
          {/*                position: "absolute",*/}
          {/*                right: 10,*/}
          {/*            }}*/}
          {/*            onPress={onClickGetEmailOTP}*/}
          {/*        >*/}
          {/*            <Text*/}
          {/*                style={{*/}
          {/*                    paddingVertical: 10,*/}
          {/*                    color: Colors.text_success,*/}
          {/*                    fontSize: 15,*/}
          {/*                    fontWeight: "bold",*/}
          {/*                    textDecorationLine: "underline",*/}
          {/*                }}*/}
          {/*            >*/}
          {/*                Get Email OTP*/}
          {/*            </Text>*/}
          {/*        </TouchableOpacity>*/}
          {/*    </View>*/}
          {/*</View>*/}

          {/*<View style={styles.topitInputData}>*/}
          {/*  <Text style={styles.inputText}>Date Of Birth</Text>*/}
          {/*  <Text onPress={showDatePicker} style={styles.inputBox}>*/}
          {/*    <Text style={styles.inputBoxText}>*/}
          {/*      /!* @ts-ignore *!/*/}
          {/*      { dob? dob.toLocaleDateString() : getString("Date Of Birth") }*/}
          {/*    </Text>*/}
          {/*  </Text>*/}
          {/*  <DateTimePickerModal*/}
          {/*    isVisible={isDatePickerVisible}*/}
          {/*    mode="date"*/}
          {/*    onConfirm={datePickerConfirm}*/}
          {/*    onCancel={hideDatePicker}*/}
          {/*  />*/}
          {/*</View>*/}

          <View style={styles.topitInputData}>
            <Text style={styles.inputText}>{t("Password")}</Text>
            <TextInput
              inputProps={{
                placeholder: getString("password"),
                secureTextEntry: isSecureEntry,
                textContentType: "newPassword",
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

          <View style={styles.topitInputData}>
            <Text style={styles.inputText}>{t("Confirm Password")}</Text>
            <TextInput
              inputProps={{
                placeholder: getString("Confirm password"),
                secureTextEntry: isSecureEntry,
                textContentType: "newPassword",
                autoCorrect: false,
                value: passwordConfirmation,
                onChangeText: setPasswordConfirmation,
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

          <TouchableOpacity activeOpacity={1} style={styles.button}>
            <Text
              style={{
                color: "#fff",
                fontWeight: "bold",
                textAlign: "center",
              }}
              onPress={onClickRegister}
            >
              {t("Continue")}
            </Text>
          </TouchableOpacity>
          <Text style={styles.registerText}>
            {t("Already have an account?")} &nbsp;
            <Text onPress={onClickLogin}>{t("Login here")}</Text>
          </Text>
        </ScrollView>
      </KeyboardView>
    </SafeAreaView>
  );
};

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
    marginTop: 12,
    paddingVertical: 12,
    paddingHorizontal: 32,
  },
  logo: {
    width: 220,
    height: 80,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    marginVertical: 24,
    backgroundColor: "#000",
    borderColor: "#000",
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
  inputBox: {
    borderWidth: 1,
    padding: 16,
    borderRadius: 12,
    shadowOpacity: 1,
    shadowRadius: 4,
    backgroundColor: "#fff",
    borderColor: "#e0e0e0",
    elevation: 4,
    shadowOffset: {
      width: 0,
      height: 4,
    },
  },
  inputBoxText: {
    fontSize: 15,
    fontFamily: "default-medium",
    color: "gray",
  },
});
