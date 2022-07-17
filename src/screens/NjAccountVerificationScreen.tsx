import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  View,
  Platform,
  Alert,
} from "react-native";
import { Text, NjScreenBottomSpacer } from "../components";
import { useLocalization } from "../localization";
import SafeAreaView from "react-native-safe-area-view";
import { Ionicons } from "@expo/vector-icons";
// @ts-ignore
import { ProgressSteps, ProgressStep } from "react-native-progress-steps";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";
import { Colors, statusColor } from "../constants";
import { UserService } from "../services";
import { t } from "../localization/transfy";
import { axiosApiErrorAlert, getFileExtension, getMimeType } from "../helpers";

export const NjAccountVerificationScreen = () => {
  const { getString } = useLocalization();

  const [acStatus, setAcStatus] = useState({});
  const [idProof, setIdProof] = useState(null);
  const [idProofWithSelfie, setIdProofWithSelfie] = useState(null);
  const [addressProof, setAddressProof] = useState(null);
  const [addressProofExtraFile, setAddressProofExtraFile] = useState(null);

  useEffect(() => {
    (async () => {
      if (Platform.OS !== "web") {
        const {
          status,
        } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          alert("Sorry, we need camera roll permissions to make this work!");
        }
      }
    })();
    UserService.getAccountVerificationStatus()
      .then((result) => {
        setAcStatus(result);
      })
      .catch((err) => alert(err.message));
  }, []);

  const mediaOptions = {};

  const onClickUpdateStatus = (action: string) => {
    const formData = new FormData();
    formData.append("action", action);
    if (action === "id_proof_verify") {
      if (!idProof || !idProofWithSelfie) {
        Alert.alert(getString(`${t("please fill fields")}`));
        return;
      }
      formData.append("id_proof", {
        // @ts-ignore
        uri: idProof.uri,
        // @ts-ignore
        name: idProof.name,
        // @ts-ignore
        type: getMimeType(getFileExtension(idProof.name)) || "",
      });
      formData.append("id_proof_with_selfie", {
        // @ts-ignore
        uri: idProofWithSelfie.uri,
        // @ts-ignore
        name: idProofWithSelfie.name,
        // @ts-ignore
        type: getMimeType(getFileExtension(idProofWithSelfie.name)) || "",
      });
    } else if (action === "address_proof_verify") {
      if (!addressProof) {
        Alert.alert(getString(`${t("please fill fields")}`));
        return;
      }
      formData.append("address_proof", {
        // @ts-ignore
        uri: addressProof.uri,
        // @ts-ignore
        name: addressProof.name,
        // @ts-ignore
        type: getMimeType(getFileExtension(addressProof.name)) || "",
      });
      if (addressProofExtraFile) {
        formData.append("address_proof_extra_file", {
          // @ts-ignore
          uri: addressProofExtraFile.uri,
          // @ts-ignore
          name: addressProofExtraFile.name,
          // @ts-ignore
          type: getMimeType(getFileExtension(addressProofExtraFile.name)) || "",
        });
      }
    } else {
      Alert.alert("Invalid action");
    }

    UserService.accountVerification(formData)
      .then(async (result: any) => {
        Alert.alert("Success", result.message);
        if (result.success) {
          setIdProof(null);
          setIdProofWithSelfie(null);
          setAddressProof(null);
          setAddressProofExtraFile(null);
          setAcStatus(result);
        }
      })
      .catch((e) => {
        axiosApiErrorAlert(e);
      });
  };

  return (
    <SafeAreaView style={styles.container} forceInset={{ top: "always" }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ flex: 1 }}>
          <ProgressSteps>
            <ProgressStep
              label="Documents"
              nextBtnTextStyle={styles.buttonTextStyle}
              previousBtnTextStyle={{ display: "none" }}
            >
              <Text style={styles.titleText}>
                {t("ID Verification (Government Issued ID only)")}
              </Text>
              {/* @ts-ignore */}
              <Text style={styles.statusText}>
                {t("Status")}:{" "}
                <Text
                  style={{ color: statusColor(acStatus.id_proof_status) }}
                >{` ${acStatus.id_proof_status || "Loading..."}`}</Text>
              </Text>
              <View style={styles.inputContainer}>
                <View>
                  {idProof ? (
                    <>
                      {// @ts-ignore
                      idProof.name.toLowerCase().includes(".pdf") ? (
                        // @ts-ignore
                        <Text style={{ marginRight: 25, fontSize: 16 }}>
                          {idProof.name.slice(0, 35)}
                        </Text>
                      ) : (
                        // @ts-ignore
                        <Image
                          source={{ uri: idProof.uri }}
                          style={{ width: 100, height: 100 }}
                        />
                      )}
                      <TouchableOpacity
                        style={styles.imageDeleteButton}
                        onPress={() => setIdProof(null)}
                      >
                        <Ionicons
                          name="ios-close"
                          size={25}
                          style={{ color: "#F70000" }}
                        />
                      </TouchableOpacity>
                    </>
                  ) : (
                    <></>
                  )}
                </View>
                <View style={{ marginTop: 10 }}>
                  <TouchableOpacity
                    onPress={async () => {
                      let res = await DocumentPicker.getDocumentAsync(
                        mediaOptions
                      );
                      // @ts-ignore
                      if (res.cancelled || res.type == "cancel") {
                      } else {
                        // @ts-ignore
                        if (
                          ["JPG", "JPEG", "PNG", "PDF"].includes(
                            getFileExtension(res.name).toUpperCase()
                          )
                        ) {
                          // @ts-ignore
                          setIdProof(res);
                        } else {
                          Alert.alert(
                            `${t(
                              "Your selected file is not acceptable!, Please choose only JPG, JPEG, PNG, PDF formats"
                            )}`
                          );
                        }
                      }
                    }}
                    style={styles.selectFileBtn}
                  >
                    <Text style={styles.selectFileBtnText}>
                      {t("Select ID Proof")}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.inputContainer}>
                <View>
                  {idProofWithSelfie ? (
                    <>
                      {// @ts-ignore
                      idProofWithSelfie.name.toLowerCase().includes(".pdf") ? (
                        // @ts-ignore
                        <Text style={{ marginRight: 25, fontSize: 16 }}>
                          {idProofWithSelfie.name.slice(0, 35)}
                        </Text>
                      ) : (
                        // @ts-ignore
                        <Image
                          source={{ uri: idProofWithSelfie.uri }}
                          style={{ width: 100, height: 100 }}
                        />
                      )}
                      <TouchableOpacity
                        style={styles.imageDeleteButton}
                        onPress={() => setIdProofWithSelfie(null)}
                      >
                        <Ionicons
                          name="ios-close"
                          size={25}
                          style={{ color: "#F70000" }}
                        />
                      </TouchableOpacity>
                    </>
                  ) : (
                    <></>
                  )}
                </View>
                <View style={{ marginTop: 10 }}>
                  <TouchableOpacity
                    onPress={async () => {
                      let res = await DocumentPicker.getDocumentAsync(
                        mediaOptions
                      );
                      // @ts-ignore
                      if (res.cancelled || res.type == "cancel") {
                      } else {
                        // @ts-ignore
                        if (
                          ["JPG", "JPEG", "PNG", "PDF"].includes(
                            getFileExtension(res.name).toUpperCase()
                          )
                        ) {
                          // @ts-ignore
                          setIdProofWithSelfie(res);
                        } else {
                          Alert.alert(
                            `${t(
                              "Your selected file is not acceptable!, Please choose only JPG, JPEG, PNG, PDF formats"
                            )}`
                          );
                        }
                      }
                    }}
                    style={styles.selectFileBtn}
                  >
                    <Text style={styles.selectFileBtnText}>
                      {t("Select ID Proof with Selfie")}
                    </Text>
                  </TouchableOpacity>
                </View>
                <View style={{ marginTop: 10 }}>
                  <Text style={[styles.titleText, { fontSize: 12 }]}>
                    NB:{" "}
                    {t(
                      "If you're verified and unable to access the app features, please logout and login"
                    )}
                  </Text>
                </View>
              </View>
              <TouchableOpacity style={styles.button}>
                <Text
                  style={styles.submitButtonText}
                  onPress={() => onClickUpdateStatus("id_proof_verify")}
                >
                  {t("Update Now")}
                </Text>
              </TouchableOpacity>
            </ProgressStep>

            <ProgressStep
              label="Address"
              nextBtnTextStyle={{ display: "none" }}
              previousBtnTextStyle={styles.buttonTextStyle}
            >
              <Text style={styles.titleText}>
                {t("Address Verification (Government Issued ID only)")}
              </Text>
              <Text style={[styles.titleText, { fontSize: 12 }]}>
                N/B:{" "}
                {t("Bank Statement showing registered address is preferred")}
              </Text>
              {/* @ts-ignore */}
              <Text style={styles.statusText}>
                Status:{" "}
                <Text
                  style={{ color: statusColor(acStatus.address_proof_status) }}
                >{` ${acStatus.address_proof_status || "Loading..."}`}</Text>
              </Text>
              <View style={styles.inputContainer}>
                <View>
                  {addressProof ? (
                    <>
                      {// @ts-ignore
                      addressProof.name.toLowerCase().includes(".pdf") ? (
                        // @ts-ignore
                        <Text style={{ marginRight: 25, fontSize: 16 }}>
                          {addressProof.name.slice(0, 35)}
                        </Text>
                      ) : (
                        // @ts-ignore
                        <Image
                          source={{ uri: addressProof.uri }}
                          style={{ width: 100, height: 100 }}
                        />
                      )}
                      <TouchableOpacity
                        style={styles.imageDeleteButton}
                        onPress={() => setAddressProof(null)}
                      >
                        <Ionicons
                          name="ios-close"
                          size={25}
                          style={{ color: "#F70000" }}
                        />
                      </TouchableOpacity>
                    </>
                  ) : (
                    <></>
                  )}
                </View>
                <View style={{ marginTop: 10 }}>
                  <TouchableOpacity
                    onPress={async () => {
                      let res = await DocumentPicker.getDocumentAsync(
                        mediaOptions
                      );
                      // @ts-ignore
                      if (res.cancelled || res.type == "cancel") {
                      } else {
                        // @ts-ignore
                        if (
                          ["JPG", "JPEG", "PNG", "PDF"].includes(
                            getFileExtension(res.name).toUpperCase()
                          )
                        ) {
                          // @ts-ignore
                          setAddressProof(res);
                        } else {
                          Alert.alert(
                            `${t(
                              "Your selected file is not acceptable!, Please choose only JPG, JPEG, PNG, PDF formats"
                            )}`
                          );
                        }
                      }
                    }}
                    style={styles.selectFileBtn}
                  >
                    <Text style={styles.selectFileBtnText}>
                      Select Address Document
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.inputContainer}>
                <View>
                  {addressProofExtraFile ? (
                    <>
                      {// @ts-ignore
                      addressProofExtraFile.name
                        .toLowerCase()
                        .includes(".pdf") ? (
                        // @ts-ignore
                        <Text style={{ marginRight: 25, fontSize: 16 }}>
                          {addressProofExtraFile.name.slice(0, 35)}
                        </Text>
                      ) : (
                        // @ts-ignore
                        <Image
                          source={{ uri: addressProofExtraFile.uri }}
                          style={{ width: 100, height: 100 }}
                        />
                      )}
                      <TouchableOpacity
                        style={styles.imageDeleteButton}
                        onPress={() => setAddressProofExtraFile(null)}
                      >
                        <Ionicons
                          name="ios-close"
                          size={25}
                          style={{ color: "#F70000" }}
                        />
                      </TouchableOpacity>
                    </>
                  ) : (
                    <></>
                  )}
                </View>
                <View style={{ marginTop: 10 }}>
                  <TouchableOpacity
                    onPress={async () => {
                      let res = await DocumentPicker.getDocumentAsync(
                        mediaOptions
                      );
                      // @ts-ignore
                      if (res.cancelled || res.type == "cancel") {
                      } else {
                        // @ts-ignore
                        if (
                          ["JPG", "JPEG", "PNG", "PDF"].includes(
                            getFileExtension(res.name).toUpperCase()
                          )
                        ) {
                          // @ts-ignore
                          setAddressProofExtraFile(res);
                        } else {
                          Alert.alert(
                            `${t(
                              "Your selected file is not acceptable!, Please choose only JPG, JPEG, PNG, PDF formats"
                            )}`
                          );
                        }
                      }
                    }}
                    style={styles.selectFileBtn}
                  >
                    <Text style={styles.selectFileBtnText}>
                      {t("Supporting Address Document (Optional)")}
                    </Text>
                  </TouchableOpacity>
                </View>
                <View style={{ marginTop: 10 }}>
                  <Text style={[styles.titleText, { fontSize: 12 }]}>
                    NB:{" "}
                    {t(
                      "If you're verified and unable to access the app features, please logout and login"
                    )}
                  </Text>
                </View>
              </View>
              <TouchableOpacity style={styles.button}>
                <Text
                  style={styles.submitButtonText}
                  onPress={() => onClickUpdateStatus("address_proof_verify")}
                >
                  {t("Update Now")}
                </Text>
              </TouchableOpacity>
            </ProgressStep>

            {/*<ProgressStep label="Business" nextBtnTextStyle={{ display: "none" }} previousBtnTextStyle={styles.buttonTextStyle}>*/}
            {/*	<Text style={styles.titleText}>Business Verification</Text>*/}
            {/*	/!* @ts-ignore *!/*/}
            {/*	<Text style={styles.statusText}>Status: <Text style={{color: statusColor(acStatus.zoho_status)}}>{ ` ${acStatus.zoho_status || "Loading..."}` }</Text></Text>*/}
            {/*	<View style={{marginTop: 10}}>*/}
            {/*		<Text style={[styles.titleText,{fontSize: 12}]}>*/}
            {/*			NB: If you're verified and unable to access the app features, please logout and login*/}
            {/*		</Text>*/}
            {/*	</View>*/}
            {/*	<View style={{ marginTop: 30 }}/>*/}
            {/*</ProgressStep>*/}
          </ProgressSteps>
        </View>
        <NjScreenBottomSpacer />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.bg,
    flex: 1,
    paddingHorizontal: 30,
  },
  inputContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30,
  },
  titleText: {
    textAlign: "center",
    fontSize: 16,
    fontFamily: "default-regular",
    marginTop: 20,
  },
  statusText: {
    textAlign: "center",
    fontSize: 16,
    fontFamily: "default-bold",
    marginTop: 20,
    textTransform: "capitalize",
  },
  submitButtonText: {
    color: Colors.text_success,
    fontWeight: "bold",
    textAlign: "center",
    paddingTop: 20,
  },
  button: {
    backgroundColor: "#E8FFF1",
    borderColor: "#E8FFF1",
    color: Colors.text_success,
    borderRadius: 20,
    height: 55,
    width: "100%",
    alignSelf: "center",
    fontSize: 22,
    marginTop: 40,
    marginBottom: 20,
  },
  selectFileBtn: {
    width: "100%",
    borderRadius: 10,
    padding: 10,
    alignSelf: "center",
    borderColor: "#ccc",
    borderWidth: 1,
  },
  selectFileBtnText: {
    color: "#848484",
    fontSize: 16,
    fontFamily: "default-regular",
  },
  inputText: {
    fontSize: 16,
    marginBottom: 5,
    fontFamily: "Rubik-Regular",
  },
  imageDeleteButton: {
    position: "absolute",
    paddingBottom: 26,
    right: -10,
    top: -10,
    borderWidth: 1,
    borderColor: "red",
    borderRadius: 200,
    backgroundColor: "white",
    height: 27,
    width: 27,
  },
  buttonTextStyle: {
    color: "#848484",
    borderRadius: 20,
    fontSize: 18,
    fontWeight: "bold",
    borderColor: "#ccc",
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
});
