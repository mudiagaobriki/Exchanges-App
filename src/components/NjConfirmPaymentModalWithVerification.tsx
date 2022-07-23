import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import Modal from "react-native-modal";
import { Icon } from "./Icon";
import { Text } from "./Text";
import { Colors } from "../constants";
import { AuthService } from "../services";
import { useLocalization } from "../localization";
import { axiosApiErrorAlert, globalStyles } from "../helpers";
import { TextInput } from "./TextInput";
import { t } from "../localization/transfy";

export const NjConfirmPaymentModalWithVerification = React.forwardRef(
  (props: any = {}, ref) => {
    const { getString } = useLocalization();
    const [otp, setOtp] = useState("");

    const onClickGetOTP = () => {
      let email = props.user?.email;

      // setOtpModalVisible(true)

      AuthService.otp("profile")
        .then(async (success: any) => {
          if (success) {
            // console.log("Success: ", success)
            Alert.alert(
              `${t("OTP was sent to your registered mobile number")}`
            );
            // setOtpModalVisible(true)
          } else {
            Alert.alert(`${t("Something went wrong, Please try again later")}`);
          }
        })
        .catch((e) => Alert.alert(e.message));
      console.log("sms-verification", "result1");
    };

    const verifyOTP = (OTP: string) => {
      console.log("OTP: ", otp);
      if (OTP === "") {
        Alert.alert(`${t("Please input the OTP sent to your mobile number")}`);

        return;
      }
      AuthService.verifyOTP("profile", OTP)
        .then((result) => {
          if (result.success) {
            props.onModalSubmit();
            // Alert.alert("Successfully Verified")
          } else {
            Alert.alert(`${t("Invalid OTP")}`);
            // alert(result.message);
          }
        })
        .catch((e) => {
          axiosApiErrorAlert(e);
        });

      // setOtpModalVisible(false)
    };

    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>modalVisible = {props.modalVisible ? "YES" : "NO"}</Text>
        <Modal isVisible={props.modalVisible}>
          <View style={styles.modalView}>
            <View style={{ height: "auto" }}>
              <TouchableOpacity
                activeOpacity={1}
                onPress={() => {
                  props.setModalVisible(false);
                  console.log("props.setVisible", props.setModalVisible);
                }}
              >
                <Icon
                  name="close"
                  size={24}
                  color="#131A22"
                  style={{ alignItems: "flex-end" }}
                />
              </TouchableOpacity>
              <Text style={styles.modalTitleText}>
                {props.heading || "Confirm Payment"}
              </Text>
              {props.title ? (
                <Text style={styles.modalSubTitleText}>{props.title}</Text>
              ) : (
                <></>
              )}
              {props.subTitle ? (
                <Text style={styles.modalSubTitleBoldText}>
                  {props.subTitle}
                </Text>
              ) : (
                <></>
              )}
              <View style={styles.modalInfoTable}>
                <ScrollView>
                  {(props.data || []).map((v: React.ReactNode, i: number) => {
                    return (
                      <View key={"dkv-" + i} style={{ flexDirection: "row" }}>
                        <View>
                          {/* @ts-ignore */}
                          <Text style={styles.paymentText}>
                            {String(v?.title || " ")}
                          </Text>
                        </View>
                        <View style={{ width: 20 }} />
                        <View style={{ flex: 1 }}>
                          {/* @ts-ignore */}
                          <Text style={styles.paymentTextDetail}>
                            {String(v?.value || " ")}
                          </Text>
                        </View>
                      </View>
                    );
                  })}
                </ScrollView>
              </View>

              <View style={{ flexDirection: "row", marginTop: 10 }}>
                <View>
                  <Text style={styles.paymentText}>
                    {props.totalPaymentText || "Total Payment"}
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      color: Colors.text_success,
                      fontSize: 18,
                      fontFamily: "Rubik-Regular",
                      textAlign: "right",
                    }}
                  >
                    {props.totalPayment || ""}
                  </Text>
                </View>
              </View>

              {props.otpEnabled === "yes" && (
                <View style={styles.topitInputData}>
                  <Text style={styles.inputText}>
                    {t("OTP to verify your withdrawal")}
                  </Text>
                  <View style={{ flexDirection: "row" }}>
                    <TextInput
                      style={{ flex: 1, paddingRight: 65 }}
                      inputProps={{
                        placeholder: getString("OTP"),
                        secureTextEntry: true,
                        textContentType: "none",
                        autoCorrect: false,
                        keyboardType: "numeric",
                        value: otp,
                        onChangeText: setOtp,
                      }}
                    />
                    <TouchableOpacity
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
              )}

              <TouchableOpacity
                style={styles.modalSubmitButtonBox}
                onPress={() =>
                  props.otpEnabled === "yes"
                    ? verifyOTP(otp)
                    : props.onModalSubmit()
                }
              >
                <Text style={styles.modalSubmitButton}>{t("Confirm")}</Text>
              </TouchableOpacity>

              {props.fingerprintSetting === "on" && (
                <TouchableOpacity
                  style={[
                    globalStyles.button,
                    { marginTop: -10, backgroundColor: Colors.text_success },
                  ]}
                  onPress={() => props.onVerifyFingerprintClick()}
                >
                  <Text
                    style={{
                      color: "#ffffff",
                      fontWeight: "bold",
                      textAlign: "center",
                    }}
                  >
                    {t("Confirm with FingerPrint")}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </Modal>
      </View>
    );
  }
);

const styles = StyleSheet.create({
  modalView: {
    justifyContent: "center",
    backgroundColor: "#fff",
    borderRadius: 20,
    height: "auto",
    padding: 30,
  },
  modalTitleText: {
    color: "#131A22",
    fontSize: 20,
    fontFamily: "Rubik-Regular",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalSubTitleText: {
    color: "#B8B8B8",
    fontSize: 14,
    fontFamily: "Rubik-Regular",
    fontWeight: "bold",
    textAlign: "center",
    lineHeight: 30,
  },
  modalSubTitleBoldText: {
    color: "#000",
    fontSize: 12,
    fontFamily: "Rubik-Regular",
    fontWeight: "bold",
    textAlign: "center",
    lineHeight: 20,
  },
  modalInfoTable: {
    flexDirection: "row",
    borderStyle: "dashed",
    borderBottomWidth: 2,
    borderColor: "#B8B8B8",
    marginTop: 30,
    paddingBottom: 20,
  },
  modalSubmitButtonBox: {
    marginVertical: 30,
    backgroundColor: "#E8FFF1",
    borderColor: "#E8FFF1",
    color: Colors.text_success,
    borderRadius: 20,
    height: 55,
    width: "100%",
    alignSelf: "center",
    fontSize: 22,
  },
  modalSubmitButton: {
    color: Colors.text_success,
    fontWeight: "bold",
    textAlign: "center",
    paddingTop: 20,
  },
  paymentText: {
    color: "#B8B8B8",
    fontSize: 16,
    fontFamily: "Rubik-Regular",
    fontWeight: "normal",
    lineHeight: 30,
  },
  paymentTextDetail: {
    color: "#131A22",
    fontSize: 16,
    fontFamily: "Rubik-Regular",
    fontWeight: "normal",
    lineHeight: 30,
    textAlign: "right",
  },
  topitInputData: {
    marginTop: 5,
  },
  inputText: {
    fontSize: 16,
    marginBottom: 5,
    fontFamily: "Rubik-Regular",
    marginTop: 30,
  },
});
