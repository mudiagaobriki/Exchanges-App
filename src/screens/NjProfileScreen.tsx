import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  View,
  Platform,
  Alert,
} from "react-native";
import { Text, TextInput } from "../components";
import SafeAreaView from "react-native-safe-area-view";
import { useLocalization } from "../localization";
import { RadioButton } from "react-native-paper";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Colors } from "../constants";
import { NjScreenBottomSpacer } from "../components/NjScreenBottomSpacer";
import { UserService, AuthService } from "../services";
import moment from "moment";
import { axiosApiErrorAlert } from "../helpers";
import { AuthenticationContext } from "../context";
import { isNull } from "lodash";
import { t } from "../localization/transfy";

export const NjProfileScreen = () => {
  const [profile, setProfile] = useState({});
  const { getString } = useLocalization();
  const [gender, setGender] = useState("male");
  const [OTPRequired, setOTPRequired] = useState(false);
  const [emailOTPRequired, setEmailOTPRequired] = useState(false);
  const [withdrawOTPRequired, setWithdrawOTPRequired] = useState("no");
  const [activateEmailOTP, setActivateEmailOTP] = useState("yes");
  const [OTP, setOTP] = useState("");
  /////////////
  const [DOB, setDOB] = useState(new Date());
  const [mode, setMode] = useState("date");
  const [showDOBPicker, setShowDOBPicker] = useState(false);
  const [username, setUsername] = useState("");

  const onClickGetOTP = () => {
    AuthService.otp("profile")
      .then(async (success: any) => {
        if (success) {
          Alert.alert(`${t("OTP was sent to your registered mobile number")}`);
        } else {
          Alert.alert(`${t("Something went wrong, Please try again later")}`);
        }
      })
      .catch((e) => Alert.alert(e.message));
  };

  const fetchProfileDetails = () => {
    UserService.getProfileDetails()
      .then((profile) => {
        setProfile(profile);
        setGender(profile?.gender);
        setWithdrawOTPRequired(profile?.withdraw_otp_verification_required);
        var date = isNull(profile?.date_of_birth)
          ? moment(new Date(), "DD/MM/YYYY").toDate()
          : moment(profile?.date_of_birth, "DD/MM/YYYY").toDate();
        setDOB(date);
        setUsername(profile?.username);
        console.log("Profile: ", profile);
        console.log("Date of Birth: ", isNull(profile?.date_of_birth));
      })
      .catch((err) => alert(err.message));
  };

  const updateProfileDetailsWithoutOTP = () => {
    UserService.updateProfileDetails({
      gender: gender,
      withdraw_otp_verification_required: withdrawOTPRequired,
      date_of_birth: moment(DOB).format("DD/MM/YYYY"),
      username: username,
      activate_email_otp: activateEmailOTP,
    })
      .then((result) => {
        if (result.success) {
          setOTP("");
          setOTPRequired(false);
          console.log("Result: ", result);
        }
        alert(result?.message);
      })
      .catch((e) => {
        console.log("Error Result: ", e);
        axiosApiErrorAlert(e);
      });
  };

  const updateProfileDetails = () => {
    if (OTPRequired) {
      if (!OTP.match("^\\d{6}$")) {
        Alert.alert(`${t("Invalid OTP")}`);
        return;
      }
      AuthService.verifyOTP("profile", OTP)
        .then((result) => {
          if (result.success) {
            updateProfileDetailsWithoutOTP();
          } else {
            alert(result.message);
          }
        })
        .catch((e) => {
          axiosApiErrorAlert(e);
        });
    } else {
      updateProfileDetailsWithoutOTP();
    }
  };

  const onChangeDOB = (event: any, selectedDate: Date) => {
    const currentDate = selectedDate || DOB;
    setShowDOBPicker(Platform.OS === "ios");
    setDOB(currentDate);
  };

  const showMode = (currentMode: React.SetStateAction<string>) => {
    setShowDOBPicker(true);
    setMode(currentMode);
    // console.log(showDOBPicker)
  };

  const showDatepicker = () => {
    // console.log("Mudi clicked Date Picker")
    showMode("date");
  };

  useEffect(() => {
    fetchProfileDetails();
  }, []);

  /*
	const [profileImage, profileSetImage] = useState(null);

	useEffect(() => {
		(async () => {
			if (Platform.OS !== "web") {
				const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
				if (status !== "granted") {
					alert("Sorry, we need camera roll permissions to make this work!");
				}
			}
		})();
	}, []);

	const transfyProfileImage = async () => {
		let profileImageResult = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.All,
			allowsEditing: true,
			aspect: [4, 3],
			quality: 1,
		});
		if (!profileImageResult.cancelled) {
			profileSetImage(profileImageResult.uri);
		}
	};
	*/

  return (
    <SafeAreaView style={styles.container} forceInset={{ top: "always" }}>
      {/*<View style={styles.topBar}>
				<TouchableOpacity
					onPress={() => {
						navigation.goBack();
					}}
				>
					<Ionicons name="ios-arrow-back" size={30} style={{ color: Colors.text_success, marginVertical: 10, marginRight: 10 }} />
				</TouchableOpacity>
				<Text
					style={{
						fontSize: 20,
						marginTop: 13,
						color: Colors.text_success,
						fontWeight: "bold",
						fontFamily: "Rubik-Regular",
					}}
				>
					Update Profile
				</Text>
			</View>*/}
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={false}
            onRefresh={() => fetchProfileDetails()}
          />
        }
      >
        <React.Fragment>
          {/*<View style={{flexDirection: "row"}}>
						<View style={{flexDirection: "row"}}>
							{profileImage && <Image source={{ uri: profileImage }} style={{ width: 70, height: 70, borderRadius: 50 }} />}
							{!profileImage && <Image source={require("../../assets/images/account-screen/avatar.png")} style={{ width: 70, height: 70, alignItems: "center" }} />}
						</View>
						<View style={{ marginTop: 20, marginLeft: 10 }}>
							<TouchableOpacity onPress={transfyProfileImage} style={styles.uploadBtn}>
								<Ionicons
									name="ios-pencil"
									size={25}
									style={{
										color: Colors.text_success,
									}}
								/>
							</TouchableOpacity>
						</View>
					</View>*/}

          <View>
            <View style={styles.topitInputData}>
              <Text style={styles.inputText}>{t("Name")}</Text>
              <TextInput
                inputProps={{
                  placeholder: getString("Name"),
                  // @ts-ignore
                  value: profile?.name,
                  editable: false,
                }}
              />
            </View>

            <View style={styles.topitInputData}>
              <Text style={styles.inputText}>{t("Username")}</Text>
              <TextInput
                inputProps={{
                  placeholder: getString("Username"),
                  // @ts-ignore
                  value: username,
                  editable: true,
                  onChangeText: setUsername,
                }}
              />
            </View>

            <View style={styles.topitInputData}>
              <Text style={styles.inputText}>{t("Mobile Number")}</Text>
              <TextInput
                inputProps={{
                  placeholder: getString("Mobile Number"),
                  // @ts-ignore
                  value: `${profile?.mobile_number || ""}`,
                  editable: false,
                }}
              />
            </View>

            <View style={styles.topitInputData}>
              <Text style={styles.inputText}>{t("Email ID")}</Text>
              <TextInput
                inputProps={{
                  placeholder: getString("Email ID"),
                  // @ts-ignore
                  value: profile?.email,
                  editable: false,
                }}
              />
            </View>

            <View style={styles.topitInputData}>
              <Text style={styles.inputText}>
                {t("Gender")} {gender}
              </Text>
              <RadioButton.Group
                onValueChange={(checked) => setGender(checked)}
                value={gender}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "flex-start",
                    flex: 1,
                    marginTop: -10,
                  }}
                >
                  <RadioButton.Item
                    position="leading"
                    label="Male"
                    value="male"
                    color="#26C165"
                    uncheckedColor="#26C165"
                    labelStyle={{ marginTop: -3 }}
                    style={{ paddingLeft: 0 }}
                  />
                  <RadioButton.Item
                    position="leading"
                    label="Female"
                    value="female"
                    color="#26C165"
                    uncheckedColor="#26C165"
                    labelStyle={{ marginTop: -3 }}
                  />
                </View>
              </RadioButton.Group>
            </View>

            <View style={styles.topitInputData}>
              <Text style={styles.inputText}>
                {t("Withdraw OTP Verification Required")}
              </Text>
              <RadioButton.Group
                onValueChange={(checked) => {
                  setOTPRequired(true);
                  setWithdrawOTPRequired(checked);
                }}
                value={withdrawOTPRequired}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "flex-start",
                    flex: 1,
                    marginTop: -10,
                  }}
                >
                  <RadioButton.Item
                    position="leading"
                    label="Yes"
                    value="yes"
                    color="#26C165"
                    uncheckedColor="#26C165"
                    labelStyle={{ marginTop: -3 }}
                    style={{ paddingLeft: 0 }}
                  />
                  <RadioButton.Item
                    position="leading"
                    label="No"
                    value="no"
                    color="#26C165"
                    uncheckedColor="#26C165"
                    labelStyle={{ marginTop: -3 }}
                  />
                </View>
              </RadioButton.Group>
            </View>

            <View style={styles.topitInputData}>
              <Text style={styles.inputText}>{t("Active Email OTP")}</Text>
              <RadioButton.Group
                onValueChange={(checked) => {
                  setEmailOTPRequired(true);
                  setActivateEmailOTP(checked);
                }}
                value={activateEmailOTP}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "flex-start",
                    flex: 1,
                    marginTop: -10,
                  }}
                >
                  <RadioButton.Item
                    position="leading"
                    label="Yes"
                    value="yes"
                    color="#26C165"
                    uncheckedColor="#26C165"
                    labelStyle={{ marginTop: -3 }}
                    style={{ paddingLeft: 0 }}
                  />
                  <RadioButton.Item
                    position="leading"
                    label="No"
                    value="no"
                    color="#26C165"
                    uncheckedColor="#26C165"
                    labelStyle={{ marginTop: -3 }}
                  />
                </View>
              </RadioButton.Group>
            </View>

            <View style={{ marginTop: 10 }}>
              <Text style={styles.inputText}>{t("Date Of Birth")}</Text>
              <Text onPress={showDatepicker} style={styles.dateInput}>
                {DOB !== null
                  ? moment(DOB).format("DD/MM/YYYY")
                  : new Date().toISOString()}
              </Text>
              {DOB && showDOBPicker && (
                <DateTimePicker
                  testID="dateTimePicker"
                  value={DOB}
                  // @ts-ignore
                  mode={mode}
                  is24Hour={false}
                  display="default"
                  // @ts-ignore
                  onChange={(event, date) => onChangeDOB(event, date)}
                />
              )}
            </View>

            <View style={styles.topitInputData}>
              <Text style={styles.inputText}>{t("Country")}</Text>
              <TextInput
                inputProps={{
                  placeholder: getString("Country"),
                  // @ts-ignore
                  value: profile?.country_name,
                  editable: false,
                }}
              />
            </View>

            {OTPRequired ? (
              <View style={styles.topitInputData}>
                <Text style={styles.inputText}>
                  {t("Need to verify your current mobile number")}
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
                      onChangeText: setOTP,
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
            ) : (
              <></>
            )}
          </View>
          <TouchableOpacity
            style={styles.button}
            onPress={() => updateProfileDetails()}
          >
            <Text
              style={{
                color: Colors.text_success,
                fontWeight: "bold",
                textAlign: "center",
                paddingTop: 20,
              }}
            >
              {t("Save Changes")}
            </Text>
          </TouchableOpacity>
        </React.Fragment>
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
  topBar: {
    flexDirection: "row",
    paddingTop: 10,
    paddingBottom: 20,
  },
  button: {
    marginVertical: 24,
    backgroundColor: "#E8FFF1",
    borderColor: "#E8FFF1",
    color: Colors.text_success,
    borderRadius: 20,
    height: 55,
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
  },
  uploadBtn: {
    width: "100%",
    borderRadius: 10,
    padding: 7,
    alignSelf: "center",
  },
  uploadBtnText: {
    color: Colors.text_success,
    fontSize: 16,
    fontFamily: "Rubik-Regular",
    textDecorationLine: "underline",
    fontWeight: "bold",
  },
  dateInput: {
    borderWidth: 1,
    fontSize: 15,
    padding: 16,
    fontFamily: "default-medium",
    borderRadius: 12,
    shadowOpacity: 1,
    shadowRadius: 4,
    backgroundColor: "#fff",
    borderColor: "#e0e0e0",
    elevation: 0,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    color: "gray",
  },
});
