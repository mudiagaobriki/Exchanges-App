import React, { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  ImageBackground,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  View,
  Dimensions,
} from "react-native";
import { Text, Icon, TextInput } from "../components";
import {useNavigation, useRoute} from "@react-navigation/native";
import SafeAreaView from "react-native-safe-area-view";
// import { DashboardService } from "../services";
import { DashboardModel } from "../models";
import { StackNavigationProp } from "@react-navigation/stack";
import { useLocalization } from "../localization";
import DropDownPicker from "react-native-dropdown-picker";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../constants";
import Modal from "react-native-modal";
import WalletService from "../services/WalletService";
import { t } from "../localization/transfy";

export const NjDepositScreen = () => {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const route = useRoute()
  const emptyDashboardState = {
    categories: [],
    highlightedNews: [],
    topCategories: [],
    news: [],
    stories: [],
  };
  const [modalVisible, setModalVisible] = useState(false);
  const [dashboardModel, setDashboardModel] = useState<DashboardModel>(
    emptyDashboardState
  );
    const [bank, setBank] = useState(null);
    const [banks, setBanks] = useState([
        { label: "United Bank for Africa", value: "uba" },
        { label: "Guarantee Trust Bank", value: "gtb" },
        { label: "Union Bank", value: "unb" },
        { label: "Zenith Bank", value: "znb" },
    ]);
  const { getString } = useLocalization();
  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
    console.log("Original Banks: ", banks)
      WalletService.getBanks("GHS", 'deposit')
          .then((result) => {
              // console.log("Banks: ",result.banks)
              let bk = []
              for (let i=0; i < result.banks.length; i++){
                  bk.push({"label": result.banks[i].name, value: result.banks[i].hubtel_code})
              }
              console.log("Bk: ", bk)
              setBanks(result.banks);
          })
  }, []);


  const [bankDropDownPicker, setBankDropDownPicker] = useState(false);


  // Uncomment these to fetch from API
  // ----------------------------------
  // const fetchDashboardItems = () => {
  //   // console.log('res4646');
  //   DashboardService.getDashboardItems()
  //     .then((res) => {
  //       // console.log(res)
  //       setDashboardModel(res.data);
  //     })
  //     .catch((err) => alert(err.message));
  // };

  // useEffect(() => fetchDashboardItems(), []);
  // ---------------------------------------


  const win = Dimensions.get("window");

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
            style={{ color: Colors.text_success, marginVertical: 10, marginRight: 10 }}
          />
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
          Add Cash
        </Text>
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={false}
            // onRefresh={() => fetchDashboardItems()}
          />
        }
      >
        <View style={{ marginTop: 10 }}>
          <View style={{ flexDirection: "row" }}>
            <View style={styles.viewBox}>
              <ImageBackground style={styles.acInfoImage} source={require("../../assets/images/account-screen/ac-bg.png")}>
                <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
                  <View style={{ flex: 1, justifyContent: "center" }}>
                    <Text
                        style={{
                          fontFamily: "Rubik-Regular",
                          fontSize: 24,
                          fontWeight: "bold",
                          color: "white",
                          textAlign: "center",
                        }}
                    >
                        {route.params.data.sub_title || "GHS 0.00"}
                    </Text>
                  </View>
                </View>
              </ImageBackground>
            </View>
          </View>
          <View>
          <Text style={{marginTop:10, fontFamily: "Rubik-Regular", fontSize: 18, fontWeight: "bold", alignSelf: "center"}}>Deposit Funds via</Text>
          </View>
          <View style={{ flexDirection: "row" }}>
            <View style={styles.viewBox}>
              <ImageBackground style={[styles.acInfoImage,{height: 50, width: 230, borderRadius: 15}]} source={require("../../assets/images/account-screen/ac-bg.png")}>
                <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
                  <View style={{ flex: 1, justifyContent: "center" }}>
                    <Text
                        style={{
                          fontFamily: "Rubik-Regular",
                          fontSize: 16,
                          fontWeight: "normal",
                          color: "black",
                          textAlign: "center",
                        }}
                    >
                      Mobile Money
                    </Text>
                  </View>
                </View>
              </ImageBackground>
            </View>
          </View>

          <View style={styles.inputFields}>
            <TextInput
                inputProps={{
                  placeholder: getString(`Amount in ${route.params.data.sub_title.substring(0,route.params.data.sub_title.indexOf(" "))}`),
                }}
            />
          </View>
          <View style={styles.inputFields}>
            <DropDownPicker
              schema={{
                label: 'label', // required
                value: 'value', // required
                icon: 'icon',
                parent: 'parent',
                selectable: 'selectable',
                disabled: 'disabled'
              }}
              listMode="MODAL"
              placeholder="Choose Bank"
              open={bankDropDownPicker}
              value={bank}
              items={banks}
              setOpen={() => setBankDropDownPicker(true)}
              onClose={() => setBankDropDownPicker(false)}
              setValue={(val:Function) => {
                setBank(val())
                setBankDropDownPicker(false)
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

          <View style={styles.inputFields}>
            <TextInput
              inputProps={{
                placeholder: getString("Account Number"),
              }}
            />
          </View>

          <View style={styles.inputFields}>
            <TextInput
                inputProps={{
                  placeholder: getString("Account Name"),
                }}
            />
          </View>
          <TouchableOpacity
              style={styles.button}
              activeOpacity={1}
              onPress={() => {
                setModalVisible(true);
              }}>
            <Text
                style={{
                  color: Colors.text_success,
                  fontWeight: "bold",
                  textAlign: "center",
                  paddingTop: 20,
                }}
            >
              DEPOSIT FUNDS
            </Text>
          </TouchableOpacity>

        </View>
      </ScrollView>
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Modal isVisible={modalVisible}>
          <View style={styles.modalView}>
            <View style={{ height: "auto" }}>
              <TouchableOpacity
                  activeOpacity={1}
                  onPress={() => {
                    setModalVisible(false);
                  }}
              >
                <Icon
                    name="close"
                    size={24}
                    color="#131A22"
                    style={{ alignItems: "flex-end" }}
                />
              </TouchableOpacity>
              <Icon group="FontAwesome" name="check-circle" size={45} color="green" style={{alignSelf: "center"}} />

              <Text
                  style={{
                    color: "#131A22",
                    fontSize: 24,
                    fontFamily: "Rubik-Regular",
                    fontWeight: "bold",
                    textAlign: "center",
                    marginVertical: 20
                  }}
              >
                Top Up Success
              </Text>
              <Text
                  style={{
                    color: "#B8B8B8",
                    fontSize: 14,
                    fontFamily: "Rubik-Regular",
                    fontWeight: "bold",
                    textAlign: "center",
                    lineHeight: 30,
                  }}
              >
                If you want to see the detail please check on <Text style={{color: "seagreen"}}>transaction detail</Text>
              </Text>

            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
};

const { width, height } = Dimensions.get("window");
const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 30 },
  topBar: {
    backgroundColor: "#fff",
    flexDirection: "row",
    paddingTop: 10,
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
    marginBottom: 100,
  },
  inputFields: {
    marginTop: 20,
  },
  inputText: {
    fontSize: 16,
    marginBottom: 5,
    fontFamily: "Rubik-Regular",
  },
  viewBox: {
    justifyContent: "center",
    width: "100%",
    alignItems: "center"
  },
  acInfoImage: {
    resizeMode: "contain",
    width: "100%",
    height: (height - 200) / 4,
    borderRadius: 20,
    overflow: "hidden",
    marginTop: 20,
    marginBottom: 20,
  },
  modalView: {
    justifyContent: "center",
    backgroundColor: "#fff",
    borderRadius: 20,
    height: 'auto',
    padding: 30,
  },
});
