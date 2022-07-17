import React, {useContext, useEffect, useRef, useState} from "react";
import {
    StyleSheet,
    ImageBackground,
    ScrollView,
    TouchableOpacity,
    RefreshControl,
    View,
    Dimensions,
} from "react-native";
import {Text, Icon, TextInput, HtmlView} from "../components";
import {useNavigation, useRoute} from "@react-navigation/native";
import SafeAreaView from "react-native-safe-area-view";
import {DashboardService, WalletService} from "../services";
import { DashboardModel } from "../models";
import { StackNavigationProp } from "@react-navigation/stack";
import Carousel, { Pagination } from "react-native-snap-carousel";
import { useLocalization } from "../localization";
import DropDownPicker from "react-native-dropdown-picker";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../constants";
import Modal from "react-native-modal";
import {AuthenticationContext} from "../context";
import * as Clipboard from 'expo-clipboard';
import {globalStyles} from "../helpers";
import axios from "axios";

export const NjNairaDepositScreen = () => {
    const navigation = useNavigation<StackNavigationProp<any>>();

    const authContext = useContext(AuthenticationContext);
    const user = authContext.user;
    const [depositModalVisible, setDepositModalVisible] = useState(false);
    const [depositDetails, setDepositDetails] = useState([]);
    const [currentDepositDetails, setCurrentDepositDetails] = useState(null);
    const [depositCurrency, setDepositCurrency] = useState("");
    const [depositDropDownPicker, setDepositDropDownPicker] = useState(false);
    const [bankName, setBankName] = useState(null)
    const [accountNumber, setAccountNumber] = useState(null)
    const [submitClicked, setSubmitClicked] = useState(false)
    const [reloadPage, setReloadPage] = useState(false)

    const fetchDepositDetails = () => {
        WalletService.getDepositDetails()
            .then((result) => {
                console.log("Deposit Details: ", result)
                setDepositDetails(result.filter(r => r.currency_code === "NGN"));
            })
            .catch((err) => alert(err.message));
    };

    const route = useRoute()
    const emptyDashboardState = {
        categories: [],
        highlightedNews: [],
        topCategories: [],
        news: [],
        stories: [],
    };
    const [modalVisible, setModalVisible] = useState(false);
    const [bvn, setBvn] = useState("");
    const [dashboardModel, setDashboardModel] = useState<DashboardModel>(
        emptyDashboardState
    );
    const { getString } = useLocalization();
    useEffect(() => {
        if (bankName === null || accountNumber === null){
            axios.get("https://app.transfy.io/api/v1/user/profile")
                .then(res => {
                    // console.log("Profile Results: ", res.data.data)
                    // let k = res.data.data
                    // delete k.bvn_response
                    setBankName(res.data.data.fva_bank)
                    setAccountNumber(res.data.data.fva_number)
                    console.log("Profile Results: ", res.data.data)
                })
        }

        navigation.setOptions({
            headerShown: false,
        });
        if (depositDetails.length === 0 && route.params?.depositDetails?.length === 0){
            fetchDepositDetails()
        }
        else{
            setDepositDetails(route.params?.depositDetails)
        }
        // console.log("New Deposit Details: ", depositDetails)
        console.log("Naira Deposit Details: ", depositDetails[0]?.info?.slice(depositDetails[0]?.info?.indexOf("Number : ") + 9,
            depositDetails[0]?.info?.indexOf("Account Number : ") + 27))
    }, [depositDetails, bankName, accountNumber, reloadPage]);

    const [bank, setBank] = useState(null);
    const [banks, setBanks] = useState([
        { label: "United Bank for Africa", value: "uba" },
        { label: "Guarantee Trust Bank", value: "gtb" },
        { label: "Union Bank", value: "unb" },
        { label: "Zenith Bank", value: "znb" },
    ]);
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

    const [copiedText, setCopiedText] = React.useState('');

    const copyToClipboard = () => {
        Clipboard.setString(String(accountNumber));
    };

    const fetchCopiedText = async () => {
        const text = await Clipboard.getStringAsync();
        setCopiedText(text);
    };

    const createVirtualAccount = (bvn:string, user:any) =>{
        console.log("Bvn: ", bvn)
        console.log("User email: ", user.email)

        axios.post("https://app.transfy.io/api/v1/user/create-virtual-account",{
            "bvn": bvn,
            "email": user.email
        })
            .then(res => {
                console.log("Response: ", res)
                setReloadPage(!reloadPage)
                setModalVisible(false)
            })
            .catch(err => console.log("Error: ", err))
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
                                            {route.params.data.sub_title || "GHS 9000135.00"}
                                        </Text>
                                    </View>
                                </View>
                            </ImageBackground>
                        </View>
                    </View>
                    <View>
                        <Text style={{marginTop:10, fontFamily: "Rubik-Regular", fontSize: 18, fontWeight: "bold", alignSelf: "center"}}>Transfy Deposit Details</Text>
                        <Text style={{marginTop:10, fontFamily: "Rubik-Regular", fontSize: 18, fontWeight: "bold", alignSelf: "center"}}>Bank: {bankName? bankName: ""}</Text>
                        <Text style={{marginTop:10, fontFamily: "Rubik-Regular", fontSize: 18, fontWeight: "bold", alignSelf: "center"}}>Account Number: {accountNumber? accountNumber: ""}</Text>
                        {bankName !== null && <View style={{ flexDirection: "row", borderRadius: 15 }}>
                            <View style={{
                                justifyContent: "center",
                                alignItems: "center",
                                width: "100%",
                                backgroundColor: "#e0e0e0",
                                marginTop: 50,
                                padding: 20,
                                borderRadius: 15
                            }}>
                                <Text
                                    style={{
                                        fontFamily: "Rubik-Regular",
                                        fontSize: 14,
                                        fontWeight: "normal",
                                        color: "black",
                                        textAlign: "center",
                                    }}
                                >
                                    Money sent to this account number will reflect automatically
                                </Text>
                            </View>
                        </View>}

                        {bankName !== null && <View>
                            <TouchableOpacity style={styles.button} onPress={copyToClipboard}>
                                <Text
                                    style={{
                                        color: Colors.text_success,
                                        fontWeight: "bold",
                                        textAlign: "center",
                                    }}
                                >
                                    Copy Account Number
                                </Text>
                                {/*<Text style={{height: 150}}>*/}
                                {/*    {route.params?.depositDetails[0]?.info || depositDetails[0]?.info} `M*/}
                                {/*</Text>*/}
                            </TouchableOpacity>
                        </View>}
                    </View>
                    {/*<View style={{marginTop: 10}}><HtmlView htmlContent={route.params?.depositDetails[0]?.info || depositDetails[0]?.info} imagesMaxWidthOffset={300}/></View>*/}


                    {bankName === null && <View>
                        <TouchableOpacity style={styles.button} onPress={() => {
                            setModalVisible(true)
                        }} >
                            <Text
                                style={{
                                    color: Colors.text_success,
                                    fontWeight: "bold",
                                    textAlign: "center",
                                }}
                            >
                                Create Virtual Account
                            </Text>
                            {/*<Text style={{height: 150}}>*/}
                            {/*    {route.params?.depositDetails[0]?.info || depositDetails[0]?.info} `M*/}
                            {/*</Text>*/}
                        </TouchableOpacity>
                    </View>}



                </View>

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
                                <TextInput
                                    style={{...globalStyles.input, marginTop: 20, alignContent: "center", alignItems: "center", borderColor: "#eeeeee", borderWidth: 1 }}
                                    inputProps={{
                                        style: {textAlign: "center", alignContent: "center", alignItems: "center",
                                        width: "100%"},
                                        placeholder: `Input you BVN     `,
                                        keyboardType: "number-pad",
                                        autoCorrect: false,
                                        value: bvn,
                                        onChangeText: (val) => {
                                            setBvn(val)
                                        },
                                    }}
                                />
                                <TouchableOpacity style={[styles.button,{marginBottom: 20}]} onPress={() => {
                                    setSubmitClicked(true)
                                    createVirtualAccount(bvn, user)
                                }} disabled={submitClicked} >
                                    <Text
                                        style={{
                                            color: submitClicked? Colors.bg: Colors.text_success,
                                            fontWeight: "bold",
                                            textAlign: "center",
                                        }}
                                    >
                                        {!submitClicked? "Submit": "Creating..."}
                                    </Text>
                                    {/*<Text style={{height: 150}}>*/}
                                    {/*    {route.params?.depositDetails[0]?.info || depositDetails[0]?.info} `M*/}
                                    {/*</Text>*/}
                                </TouchableOpacity>

                            </View>
                        </View>
                    </Modal>
                </View>
            </ScrollView>
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
        justifyContent: "center",
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
