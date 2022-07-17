import React, { useContext, useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  View,
  Dimensions,
  Modal,
  Alert,
  Platform,
  Linking,
} from "react-native";
import {
  Text,
  Icon,
  HtmlView,
  NjScreenBottomSpacer,
  NjWalletCarousel,
  NjWalletBalancesList,
} from "../components";
import { useNavigation } from "@react-navigation/native";
import SafeAreaView from "react-native-safe-area-view";
import { StackNavigationProp } from "@react-navigation/stack";
import NavigationNames from "../navigations/NavigationNames";
import { Colors } from "../constants";
import { AuthenticationContext } from "../context";
import { WalletService, UserService } from "../services";
import DropDownPicker from "react-native-dropdown-picker";
import { IdVerifiedOptions } from "../models";
import * as SecureStore from "expo-secure-store";
import Constants from "expo-constants";
import * as Notifications from "expo-notifications";
import * as Permissions from "expo-permissions";
import {
  onSnapshot,
  collection,
  addDoc,
  getDoc,
  doc,
  setDoc,
} from "firebase/firestore";
import { firestore } from "../firebase";
import axios from "axios";
import {getLanguage, t} from "../localization/transfy";

var walletBalances: any = null;
var walletBalancesForSlider = {};

const wait = (timeout: number) => {
  return new Promise((resolve) => setTimeout(resolve, timeout));
};

export const HomeScreenNew = () => {
  const authContext = useContext(AuthenticationContext);
  const [user, setUser] = useState(authContext.user);
  const [verificationStatus, setVerificationStatus] = useState(
    user?.id_proof_verify_status?.toString()
  );
  const [emailVerificationStatus, setEmailVerificationStatus] = useState(null);
  const navigation = useNavigation<StackNavigationProp<any>>();
  const [depositModalVisible, setDepositModalVisible] = useState(false);
  const [depositDetails, setDepositDetails] = useState([]);
  const [currentDepositDetails, setCurrentDepositDetails] = useState(null);
  const [depositCurrency, setDepositCurrency] = useState("");
  const [depositDropDownPicker, setDepositDropDownPicker] = useState(false);
  const NjWalletCarouselRef = useRef();
  const NjWalletBalancesRef = useRef();
  const [activeCurrency, setActiveCurrency] = useState<any | any>(null);
  const [refreshing, setRefreshing] = React.useState(false);
  const [walletBalancesFromState, setWalletBalancesFromState] = useState<
    any | any
  >(null);

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });

  React.useEffect(() => {
      // getLanguage()
      //     .then(() => {
      //         console.log("Language preference loaded")
      //     })
    // const subscription = Notifications.addNotificationResponseReceivedListener(response => {
    // 	const url = response.notification.request.content.data.url;
    // 	Linking.openURL("transfy://");
    // });
    // return () => subscription.remove();

    // This listener is fired whenever a notification is received while the app is foregrounded
    const subscription1 = Notifications.addNotificationReceivedListener(
      (response) => {
        // const url = response.notification.request.content.data.url;
        Linking.openURL("transfy://");
      }
    );
    // Notifications.addNotificationReceivedListener(_handleNotification);

    // This listener is fired whenever a user taps on or interacts with a notification (works when app is     foregrounded, backgrounded, or killed)
    const subscription2 = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        console.log(response);
        const url = response.notification.request.content.data.url;
        Linking.openURL("transfy://");
      }
    );
    Notifications.addNotificationResponseReceivedListener(
      _handleNotificationResponse
    );

    return () => {
      subscription1.remove();
      subscription2.remove();
    };
  }, []);

  const onRefresh2 = React.useCallback(() => {
    setRefreshing(true);
    fetchDepositDetails();
    fetchWalletBalances();
    wait(2000).then(() => setRefreshing(false));
  }, []);

  const fetchDepositDetails = () => {
    // setDepositDetails([])
    WalletService.getDepositDetails()
      .then((result) => {
        setDepositDetails(result);
        console.log("Deposit Details: ", result);
      })
      .catch((err) => alert(err.message));
  };

  const fetchWalletBalances = () => {
    WalletService.getBalances()
      .then((result) => {
        // setWalletBalancesForSlider(result)\
        let userCurrency = user?.currency_code;
        let homeCurrencyBalance = result[userCurrency];
        console.log("Balances from Home Screen: ", result);
        console.log("User Currency from Home Screen: ", userCurrency);
        console.log(
          "Home Currency Balance from Home Screen: ",
          homeCurrencyBalance
        );
        delete result[userCurrency];
        result = { [userCurrency]: homeCurrencyBalance, ...result };
        console.log(
          "Rearranged Balances from Home Screen: ",
          result[Object.keys(result)[0]]
        );
        console.log("Wallet Balances Details from Home Screen: ", result);
        walletBalancesForSlider = result;
      })
      .catch((err) => alert(err.message));
  };

  const fetchWalletDetails = () => {
    fetchDepositDetails();
    setWalletBalancesFromState(null);
    WalletService.getInfo()
      // .then(result => console.log(result.data.balances[Object.keys(result.data.balance)[0]]))
      .then((result) => {
        // console.log("Raw result data: ", result.data)
        // setWalletBalances(result.data.balances)
        let userCurrency = user?.currency_code;
        let homeCurrencyBalance = result.data.balances[userCurrency];
        delete result.data.balances[userCurrency];
        console.log(
          "Prearranged Home Currency Balance from Home Screen: ",
          result.data.balances
        );
        result.data.balances = {
          [userCurrency]: homeCurrencyBalance,
          ...result.data.balances,
        };
        // result = {}
        // result.data.balance = result.data.balance.filter()
        // console.log("Balances from Home Screen: ",result);
        // console.log("User Currency from Home Screen: ",userCurrency);
        console.log(
          "Home Currency Balance from Home Screen: ",
          homeCurrencyBalance
        );
        console.log(
          "Rearranged Home Currency Balance from Home Screen: ",
          result.data.balances[Object.keys(result.data.balances)[0]]
        );

        // delete result[userCurrency]
        // result = {[userCurrency]: homeCurrencyBalance, ...result}
        // console.log("Rearranged Balances from Home Screen: ",result[Object.keys(result)[0]]);
        // console.log("Wallet Balances Details from Home Screen: ", result)

        walletBalances = result.data.balances;
        setWalletBalancesFromState(result);
        let key = Object.keys(result.data.balances)[0];
        let value = result.data.balances[Object.keys(result.data.balances)[0]];
        setActiveCurrency({
          title: `${key} Wallet`,
          sub_title: `${key} ${value}`,
        });
      });
  };

  const onRefresh = () => {
      // getLanguage()
      //     .then(() => {
      //         console.log("Language preference loaded")
      //     })
    fetchDepositDetails();
    fetchWalletDetails();
    // @ts-ignore
    if (Object.keys(walletBalancesForSlider).length === 0) {
      fetchWalletBalances();
    }
    NjWalletCarouselRef?.current.refresh();
    NjWalletBalancesRef?.current.refresh();
  };

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
      getLanguage()
          .then(() => {
              console.log("Language preference loaded")
          })
    onRefresh();
    // save("emailVerified","")
    // 	.then((r) => console.log(r))
    // getValueFor("emailVerified")
    // 	.then(res => {
    // 		console.log("Email Verified: ", res)
    // 		if (res == "true"){
    // 			setEmailVerificationStatus(res.toString())
    // 		}
    // 		else{
    // 			setEmailVerificationStatus(null)
    // 		}
    // 		// setEmailVerificationStatus(res.toString() === "true"? "true": null)
    // 	})
    if (walletBalances === null) {
      fetchWalletDetails();
    }

    registerForPushNotificationsAsync()
      .then((token) => {
        console.log("Token: ", token);
        let payload = {
          name: user?.name,
          email: user?.email,
          userId: user?.id,
          phone: user?.mobile_number,
          country: user?.country_name,
          pushToken: token,
        };

        // axios.patch(`https://transfy.mybellemarket.com/api/tokens-patch/${user?.email}`,payload)
        // 	.then(res => {
        // 		console.log(res)
        // 		console.log("Token successfully updated")
        // 		// alert("Token successfully saved")
        // 	})
        // 	.catch(err => {
        // 		console.log("Error: ", err)
        // 	})

        axios
          .get("https://transfy.mybellemarket.com/api/tokens")
          .then((res) => {
            console.log("Push Data: ", res.data);

            let exists = res.data.filter((d) => d.email === user?.email);
            if (exists.length > 0) {
              console.log("Data Exists: ", exists);
              if (exists[0].pushToken !== token) {
                console.log("E dey");
                axios
                  .patch(
                    `https://transfy.mybellemarket.com/api/tokens/${exists[0].ID}`,
                    payload
                  )
                  .then((res) => {
                    console.log(res);
                    console.log("Token successfully updated");
                    // alert("Token successfully saved")
                  })
                  .catch((err) => {
                    console.log("Error: ", err);
                  });
              }
            } else {
              console.log("E no dey");
              axios
                .post("https://transfy.mybellemarket.com/api/tokens", payload)
                .then((res) => {
                  console.log(res);
                  console.log("Token successfully saved");
                  // alert("Token successfully saved")
                })
                .catch((err) => {
                  console.log("Error: ", err);
                });
            }
          });

        // const collectionRef = collection(firestore,"appUsers")
        // // console.log("Collection Reference: ", collectionRef)
        //
        // const docRef = doc(firestore, "appUsers", String(user?.email) );
        // // const docRef = doc(firestore, "appUsers", "mudiinvents@gmail.com" );
        // // console.log("Document Reference: ", docRef)
        // getDoc(docRef)
        // 	.then(docSnap => {
        // 		console.log("Document Data: ", docSnap.data())
        // 		if (docSnap.data()){
        // 			console.log("Document Exists")
        // 			setDoc(doc(collectionRef, user?.email), payload)
        // 				.then(res => {
        // 					alert("User Token updated successfully")
        // 					console.log("setDoc response: ", res)
        // 				})
        // 		}
        // 		else{
        // 			console.log("Document does not exist")
        // 			setDoc(doc(collectionRef, user?.email), payload)
        // 				.then(res => {
        // 					alert("User Token added successfully")
        // 					console.log("setDoc response: ", res)
        // 				})
        // 		}
        // 	})
        // 	.catch(err => {
        // 		console.log("Document Fetching Error: ", err)
        // 	})

        // const docSnap = await getDoc(docRef);

        // addDoc(collectionRef,payload)
        // 	.then((res) => {
        // 		alert("User Token Added Successfully")
        // 		console.log(res)
        // 		// window.location.href = "/auth/login"
        // 		// return user
        // 	})
        // 	.catch(err => console.log(err))

        // setDoc(doc(collectionRef, user?.email), payload)
        // 	.then(res => {
        // 		alert("User Token added successfully")
        // 		console.log("setDoc response: ", res)
        // 	})
      })
      .catch((err) => {
        console.log("Error: ", err);
      });

    Notifications.addNotificationReceivedListener(_handleNotification);

    Notifications.addNotificationResponseReceivedListener(
      _handleNotificationResponse
    );

    if (verificationStatus === "unverified") {
      setInterval(() => {
        // if (emailVerificationStatus !== "true"){
        // 	navigation.navigate(NavigationNames.NjEmailVerificationScreen,{user})
        // }
        UserService.getAccountVerificationStatus().then((res) => {
          console.log("Verification Status: ", verificationStatus);
          setVerificationStatus(res.id_proof_status);
        });
      }, 120000);
    }

    // if (emailVerificationStatus !== true){
    // 	setInterval(() => {
    // 		if (emailVerificationStatus !== "true"){
    // 			navigation.navigate(NavigationNames.NjEmailVerificationScreen,{user})
    // 		}
    // 	},1000)
    // }
    // else{
    // 	clearInterval()
    // }

    // if (emailVerificationStatus !== "true"){
    // 	Alert.alert("Please verify your email to continue.")
    // 	authContext.logout().then(() => {});
    // 	// navigation.navigate(NavigationNames.NjEmailVerificationScreen)
    // }

    console.log("Active Currency:", activeCurrency);
    console.log("User: ", user);
    console.log("Email Verification Status: ", emailVerificationStatus);
    // console.log(walletBalances)
  }, [emailVerificationStatus]);

  const homeIconSize = 42;
  const dashboardIconSize = 42;

  const _handleNotification = (notification: any) => {
    console.log("Notification: ", notification);
    // navigation.navigate(NavigationNames.HomeScreenNew)
  };

  const _handleNotificationResponse = (response: any) => {
    console.log("Notification Response: ", response);
    navigation.navigate(NavigationNames.HomeScreenNew);
  };

  const UpdateCurrency = (curr: String) => {
    let value = walletBalances[curr];
    // console.log("Updated Value: ", value)
    setActiveCurrency({
      title: `${curr} Wallet`,
      sub_title: `${curr} ${value}`,
    });
  };

  const openDepositScreen = (current: any) => {
    // let currentCurrencyIndex = NjWalletCarouselRef.current.current.currentIndex
    // let currentCurrency = walletBalances[currentCurrencyIndex]
    // console.log("Current Currency: ", currentCurrencyIndex)
    // Restrict Deposit to home currency name only
    // if (emailVerificationStatus !== "true"){
    // 	navigation.navigate(NavigationNames.NjEmailVerificationScreen)
    // }

    if (verificationStatus !== "verified") {
      Alert.alert(
        `${t("Please kindly verify your identity to use this function")}`
      );
      return;
    }

    if (!current.title.includes(user?.currency_code.toUpperCase())) {
      Alert.alert(`${t("You can only deposit in your home currency")}`);
      return;
    }

    if (current.title.includes("NGN") || current.title.includes("ZAR")) {
      navigation.navigate(NavigationNames.NjNairaDepositScreen, {
        data: activeCurrency,
        depositDetails: depositDetails.filter(
          (r) =>
            r.currency_code ===
            activeCurrency.title.replace(" Wallet", "").trim()
        ),
      });
    } else if (
      current.title.includes("GHS") ||
      current.title.includes("RWF") ||
      current.title.includes("XAF") ||
      current.title.includes("KES") ||
      current.title.includes("UGX") ||
      current.title.includes("XOF")
    ) {
      navigation.navigate(NavigationNames.NjGhanaDepositScreen, {
        data: activeCurrency,
        depositDetails: depositDetails.filter(
          (r) =>
            r.currency_code ===
            activeCurrency.title.replace(" Wallet", "").trim()
        ),
      });
    }
    // else{
    // 	navigation.navigate(NavigationNames.NjDepositScreen,{data: activeCurrency})
    // }
  };

  const OpenWithdrawalScreen = () => {
    // console.log("Id: ", user?.id_proof_verify_status)
    // console.log("Id2: ", IdVerifiedOptions.verified)
    // if (emailVerificationStatus !== "true"){
    // 	navigation.navigate(NavigationNames.NjEmailVerificationScreen)
    // }

    // if (verificationStatus !== "verified") {
    //   Alert.alert(
    //     `${t("Please kindly verify your identity to use this function")}`
    //   );
    //   return;
    // }

    navigation.navigate(NavigationNames.NjBeneficiaryScreen, {
      activeCurrency: activeCurrency.title.replace(" Wallet", "").trim(),
    });
  };

  const OpenTransferScreen = () => {
    // console.log("Id: ", user?.id_proof_verify_status)
    // console.log("Id2: ", IdVerifiedOptions.verified)
    // if (emailVerificationStatus !== "true"){
    // 	navigation.navigate(NavigationNames.NjEmailVerificationScreen)
    // }

    if (verificationStatus !== "verified") {
      Alert.alert(
        `${t("Please kindly verify your identity to use this function")}`
      );
      return;
    }

    navigation.navigate(NavigationNames.NjWalletTransferScreen, {
      activeCurrency: activeCurrency.title.replace(" Wallet", "").trim(),
    });
  };

  const OpenExchangeScreen = () => {
    // console.log("Id: ", user?.id_proof_verify_status)
    // console.log("Id2: ", IdVerifiedOptions.verified)
    // if (emailVerificationStatus !== "true"){
    // 	navigation.navigate(NavigationNames.NjEmailVerificationScreen)
    // }

    if (verificationStatus !== "verified") {
      Alert.alert(
        `${t("Please kindly verify your identity to use this function")}`
      );
      return;
    }

    navigation.navigate(NavigationNames.NjExchangeScreen);
  };

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

  const registerForPushNotifications2 = async () => {
    let token;
    // const {status} = await Permissions.getAsync(Permissions.NOTIFICATIONS)
    const { status } = await Notifications.getPermissionsAsync();
    if (status != "granted") {
      // const {status} = await Permissions.askAsync(Permissions.NOTIFICATIONS)
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
    }
    if (status != "granted") {
      alert("Failed to get push token");
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
    return token;
  };

  const registerForPushNotificationsAsync = async () => {
    let token;
    if (Constants.isDevice) {
      const {
        status: existingStatus,
      } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== "granted") {
        alert("Failed to get push token for push notification!");
        return;
      }
      token = (await Notifications.getExpoPushTokenAsync()).data;
      console.log(token);
    } else {
      alert("Must use physical device for Push Notifications");
    }

    if (Platform.OS === "android") {
      Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }

    return token;
  };

  // @ts-ignore
  return (
    <SafeAreaView style={styles.container} forceInset={{ top: "always" }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={false}
            onRefresh={() => {
              onRefresh();
            }}
          />
        }
      >
        <Text
          style={{
            fontSize: 28,
            fontWeight: "bold",
            fontFamily: "Rubik-Regular",
            marginTop: 20,
          }}
        >
          {t("Hello")}!
        </Text>

        <Text style={{ fontSize: 16, fontFamily: "Rubik-Regular" }}>
          {user?.name}
        </Text>

        <NjWalletCarousel
          ref={NjWalletCarouselRef}
          parentCallback={(index) =>
            UpdateCurrency(Object.keys(walletBalancesForSlider)[index])
          }
        />

        {activeCurrency != null && (
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: 20,
            }}
          >
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => openDepositScreen(activeCurrency)}
            >
              <View style={styles.dashboardIconBox}>
                <Icon
                  group="Octicons"
                  name="diff-added"
                  size={dashboardIconSize}
                  color="black"
                />
              </View>
              <Text style={styles.dashboardOptionText}>{t("Deposit")}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => OpenWithdrawalScreen()}
            >
              <View style={styles.dashboardIconBox}>
                <Icon
                  group="Entypo"
                  name="arrow-with-circle-down"
                  size={dashboardIconSize - 2}
                  color="black"
                />
              </View>
              <Text style={styles.dashboardOptionText}>{t("Withdraw")}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={1}
              onPress={() => OpenTransferScreen()}
            >
              <View style={styles.dashboardIconBox}>
                <Icon
                  group="SimpleLineIcons"
                  name="paper-plane"
                  size={dashboardIconSize}
                  color="black"
                />
              </View>
              <Text style={styles.dashboardOptionText}>{t("Transfer")}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={1}
              onPress={() => OpenExchangeScreen()}
            >
              <View style={styles.dashboardIconBox}>
                <Icon
                  group="SimpleLineIcons"
                  name="refresh"
                  size={dashboardIconSize}
                  color="black"
                />
              </View>
              <Text style={styles.dashboardOptionText}>{t("Exchange")}</Text>
            </TouchableOpacity>
          </View>
        )}

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: 30,
          }}
        >
          <View style={{ flex: 1 }}>
            <Text
              style={{
                marginLeft: 10,
                textAlign: "left",
                color: "#131A22",
                fontSize: 17,
                fontFamily: "Rubik-Regular",
                fontWeight: "bold",
              }}
            >
              {t("Wallet Balance")}
            </Text>
          </View>
        </View>

        {/*<NjWalletBalancesList parentCallback={(curr:any) => UpdateCurrency(curr)}/>*/}

        <NjWalletBalancesList
          parentCallback={(curr: any) => {
            let currencyIndex = Object.keys(walletBalancesForSlider).indexOf(
              curr
            );
            console.log("Currency Index: ", currencyIndex);
            console.log("Currency: ", curr);
            NjWalletCarouselRef.current.current.snapToItem(currencyIndex);
            UpdateCurrency(curr);
          }}
          ref={NjWalletBalancesRef}
        />

        <NjScreenBottomSpacer />

        <Modal
          animationType="slide"
          transparent={true}
          visible={depositModalVisible}
          onRequestClose={() => {
            setDepositModalVisible(false);
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <DropDownPicker
                schema={{
                  label: "currency_code", // required
                  value: "currency_code", // required
                  icon: "icon",
                  parent: "parent",
                  selectable: "selectable",
                  disabled: "disabled",
                }}
                listMode="MODAL"
                placeholder={"Currency"}
                modalTitle={"Currency"}
                open={depositDropDownPicker}
                value={depositCurrency}
                items={depositDetails}
                setOpen={() => setDepositDropDownPicker(true)}
                onClose={() => setDepositDropDownPicker(false)}
                // @ts-ignore
                setValue={(val: Function) => {
                  const cc = val();
                  setDepositCurrency(cc);
                  setDepositDropDownPicker(false);
                  // @ts-ignore
                  const currentDD = depositDetails.filter(
                    (v) => v.currency_code == cc
                  );
                  if (currentDD.length > 0) {
                    setCurrentDepositDetails(currentDD[0]);
                  }
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

              {// @ts-ignore
              depositCurrency && currentDepositDetails ? (
                <View style={{ marginTop: 10 }}>
                  <HtmlView
                    htmlContent={currentDepositDetails?.info}
                    imagesMaxWidthOffset={300}
                  />
                </View>
              ) : (
                <></>
              )}
              {// @ts-ignore
              currentDepositDetails?.paid_request_allowed ? (
                <TouchableOpacity
                  style={[styles.button, styles.buttonClose]}
                  onPress={() => {
                    setDepositModalVisible(false);
                    navigation.navigate(NavigationNames.NjAddCashScreen);
                  }}
                >
                  <Text style={styles.textStyle}>I Have Paid</Text>
                </TouchableOpacity>
              ) : (
                <></>
              )}
              <TouchableOpacity
                style={[styles.button, styles.buttonClose]}
                onPress={() => {
                  setDepositModalVisible(false);
                }}
              >
                <Text style={styles.textStyle}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
};

const { height } = Dimensions.get("window");
const styles = StyleSheet.create({
  container: { backgroundColor: "#F2F2F2", flex: 1, paddingHorizontal: 30 },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalContent: {
    backgroundColor: "white",
    paddingLeft: 30,
    paddingRight: 30,
    justifyContent: "center",
    borderRadius: 10,
    paddingTop: 20,
    paddingBottom: 20,
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 8,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    marginTop: 20,
    width: 140,
    borderRadius: 8,
    padding: 10,
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#28a745",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },

  topBar: {
    flexDirection: "row",
    paddingTop: 10,
  },
  viewBox: {
    justifyContent: "center",
    width: "100%",
    alignItems: "center",
  },
  acInfoImage: {
    resizeMode: "contain",
    width: "100%",
    height: (height - 200) / 4,
    marginTop: 10,
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: 30,
  },
  cryptoOptions: {
    // marginRight: 10,
  },
  cryptoIconBox: {
    backgroundColor: "#E4FEEF",
    padding: 18,
    borderRadius: 10,
  },
  cryptoOptionText: {
    color: "#131A22",
    fontFamily: "Rubik-Regular",
    fontSize: 13,
    fontWeight: "bold",
    marginTop: 10,
    textAlign: "center",
  },
  coinContent: {
    flexDirection: "row",
    backgroundColor: "#FCFBFC",
    borderRadius: 20,
    padding: 15,
    marginTop: 15,
  },
  coinText: {
    color: "#000",
    fontFamily: "Rubik-Regular",
    fontSize: 15,
    fontWeight: "bold",
  },
  coinPrice: {
    color: "#000",
    fontFamily: "Rubik-Regular",
    fontSize: 14,
    fontWeight: "600",
    lineHeight: 20,
  },
  coinTotalRate: {
    color: "#000",
    fontFamily: "Rubik-Regular",
    fontSize: 12,
    fontWeight: "600",
  },
  coinPriceSuccessPer: {
    color: Colors.text_success,
    fontFamily: "Rubik-Regular",
    fontSize: 12,
    fontWeight: "600",
    textAlign: "right",
    lineHeight: 20,
  },
  coinPriceDangerPer: {
    color: "#FF4133",
    fontFamily: "Rubik-Regular",
    fontSize: 12,
    fontWeight: "600",
    textAlign: "right",
    lineHeight: 20,
  },
  paginationContainerStyle: { paddingVertical: 0, marginTop: 6 },
  paginationDotStyle: { marginHorizontal: -20 },
  dashboardIconBox: {
    backgroundColor: "#FCFBFC",
    padding: 18,
    borderRadius: 10,
  },
  dashboardOptionText: {
    color: "#131A22",
    fontFamily: "Rubik-Regular",
    fontSize: 13,
    fontWeight: "bold",
    marginTop: 10,
    textAlign: "center",
  },
});
