import React, { useState } from "react";
import {
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  View,
  Dimensions,
  Alert,
} from "react-native";
import {
  Text,
  TextInput,
  KeyboardView,
  NjScreenBottomSpacer,
} from "../components";
import SafeAreaView from "react-native-safe-area-view";
import { Colors } from "../constants";
import { ProfileService } from "../services";
import { axiosApiErrorAlert } from "../helpers";
import { useLocalization } from "../localization";
import { t } from "../localization/transfy";

export const NjChangePasswordScreen = () => {
  const { getString } = useLocalization();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirmation, setNewPasswordConfirmation] = useState("");

  const inputProps = {
    placeholder: "..........",
    secureTextEntry: true,
    autoCorrect: false,
  };

  const onClickChangePassword = () => {
    if (
      currentPassword === "" ||
      newPassword === "" ||
      newPasswordConfirmation === ""
    ) {
      Alert.alert(getString(`${t("please fill fields")}`));
      return;
    }
    ProfileService.changePassword(
      currentPassword,
      newPassword,
      newPasswordConfirmation
    )
      .then(async (res: any) => {
        Alert.alert(res.message);
        setCurrentPassword("");
        setNewPassword("");
        setNewPasswordConfirmation("");
      })
      .catch((e) => {
        axiosApiErrorAlert(e);
      });
  };

  return (
    <SafeAreaView style={styles.container} forceInset={{ top: "always" }}>
      <KeyboardView style={styles.content}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View>
            <Text style={styles.inputText}>{t("Current Password")}</Text>
            <TextInput
              inputProps={{
                ...inputProps,
                ...{
                  value: currentPassword,
                  onChangeText: setCurrentPassword,
                },
              }}
            />
          </View>

          <View style={styles.topitInputData}>
            <Text style={styles.inputText}>{t("New Password")}</Text>
            <TextInput
              inputProps={{
                ...inputProps,
                ...{
                  value: newPassword,
                  onChangeText: setNewPassword,
                },
              }}
            />
          </View>

          <View style={styles.topitInputData}>
            <Text style={styles.inputText}>{t("Confirm Password")}</Text>
            <TextInput
              inputProps={{
                ...inputProps,
                ...{
                  value: newPasswordConfirmation,
                  onChangeText: setNewPasswordConfirmation,
                },
              }}
            />
          </View>

          <TouchableOpacity
            onPress={onClickChangePassword}
            activeOpacity={1}
            style={styles.button}
          >
            <Text
              style={{
                color: Colors.text_success,
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              {t("Continue")}
            </Text>
          </TouchableOpacity>
          <NjScreenBottomSpacer />
        </ScrollView>
      </KeyboardView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F2F2F2",
    flex: 1,
    paddingHorizontal: 30,
  },
  content: {
    flex: 1,
  },
  button: {
    marginVertical: 20,
    backgroundColor: "#E8FFF1",
    borderColor: "#E8FFF1",
    borderRadius: 20,
    paddingVertical: 20,
    width: "100%",
    alignSelf: "center",
    fontSize: 22,
  },
  topitInputData: {
    marginTop: 20,
  },
  inputText: {
    fontSize: 16,
    marginBottom: 5,
    fontFamily: "Rubik-Regular",
    color: "#000",
  },
});
