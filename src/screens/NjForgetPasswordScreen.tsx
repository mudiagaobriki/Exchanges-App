import React, {useEffect, useState} from "react";
import {StyleSheet, Image, ScrollView, TouchableOpacity, View, Alert} from "react-native";
import {Text, TextInput, KeyboardView, NjScreenBottomSpacer} from "../components";
import { useNavigation } from "@react-navigation/native";
import SafeAreaView from "react-native-safe-area-view";
import { StackNavigationProp } from "@react-navigation/stack";
import { Ionicons } from "@expo/vector-icons";
import NavigationNames from "../navigations/NavigationNames";
import { useLocalization } from "../localization";
import { AuthService } from "../services";
import { Colors } from "../constants";
import {axiosApiErrorAlert} from "../helpers";
import * as linking from "expo-linking"

export const NjForgetPasswordScreen = () => {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const { getString } = useLocalization();
  const [email, setEmail] = useState("");

  const onClickLogin = () => {
    navigation.navigate(NavigationNames.NjLoginScreen);
  };

  const onClickForgotPassword = () => {
    if (email === "") {
      Alert.alert(getString("please_fill_fields"));
      return;
    }
    linking.openURL("https://app.transfy.io/password/reset")
    // AuthService.forgotPassword(email)
    //   .then(async (response: any) => {
    //     console.log("Response: ", response)
    //     if(response.success){
    //       Alert.alert(response.message ? response.message: getString("pass_link_sent"))
    //     }
    //     console.log('Error1451:', JSON.stringify(response));
    //   })
    //   .catch((e) => {
    //     // console.log("Error: ", e)
    //     // axiosApiErrorAlert(e)
    //     Alert.alert("Password reset link sent to your email")
    //   });
  };

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

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
          Forgot Password
        </Text>
      </View>
      <KeyboardView style={styles.content}>
        <ScrollView
          contentContainerStyle={styles.contentContainerStyle}
          showsVerticalScrollIndicator={false}
        >
          <View style={{justifyContent: "center", alignItems: "center", marginVertical: 20,}}>
            <Image
              source={require("../../assets/images/logo-white.png")}
              style={styles.logo}
            />
          </View>
          <View>
            <Text style={styles.inputText}>Email</Text>
            <TextInput
              inputProps={{
                placeholder: getString("email"),
                value: email,
                onChangeText: setEmail,
                keyboardType: "email-address",
              }}
            />
          </View>
          <TouchableOpacity activeOpacity={1} style={styles.button} onPress={onClickForgotPassword}>
            <Text
              style={{
                color: "#fff",
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              Continue
            </Text>
          </TouchableOpacity>
          <Text style={styles.registerText}>
            Already have an account? &nbsp;
            <Text onPress={onClickLogin}>Login here</Text>
          </Text>
          <NjScreenBottomSpacer/>
        </ScrollView>
      </KeyboardView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 30,
    backgroundColor: '#26C165',
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
  inputText: {
    fontSize: 16,
    marginBottom: 5,
    fontFamily: "Rubik-Regular",
    color: '#fff',
  },
});
