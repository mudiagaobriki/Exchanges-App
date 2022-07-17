import React, {useContext, useEffect, useRef, useState} from "react";
import {
    StyleSheet,
    FlatList,
    Image,
    ImageBackground,
    ScrollView,
    TouchableOpacity,
    RefreshControl,
    View,
    Dimensions, Modal
} from "react-native";
import {Text, HtmlView} from "../components";
import {useNavigation, useRoute} from "@react-navigation/native";
import SafeAreaView from "react-native-safe-area-view";
import {WalletService} from "../services";
import { DashboardModel } from "../models";
import { StackNavigationProp } from "@react-navigation/stack";
// import Carousel, { Pagination } from "react-native-snap-carousel";
import { useLocalization } from "../localization";
// import DropDownPicker from "react-native-dropdown-picker";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../constants";
// import Modal from "react-native-modal";
import {AuthenticationContext} from "../context";
import NavigationNames from "../navigations/NavigationNames";
import {globalStyles} from "../helpers";

export const NjGhanaDepositScreen = () => {
    const navigation = useNavigation<StackNavigationProp<any>>();

    const authContext = useContext(AuthenticationContext);
    const user = authContext.user;
    const [depositModalVisible, setDepositModalVisible] = useState(false);
    const [depositDetails, setDepositDetails] = useState([]);
    const [currentDepositDetails, setCurrentDepositDetails] = useState(null);
    const [depositCurrency, setDepositCurrency] = useState("");
    const [depositDropDownPicker, setDepositDropDownPicker] = useState(false);

    const fetchDepositDetails = () => {
        WalletService.getDepositDetails()
            .then((result) => {
                console.log("Active Currency: ", route.params?.data)
                // console.log("All Deposit Details : ", result)
                setDepositDetails(result.filter(r => r.currency_code === route.params?.data.title.replace(" Wallet","").trim()));
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
    const [dashboardModel, setDashboardModel] = useState<DashboardModel>(
        emptyDashboardState
    );
    const { getString } = useLocalization();
    useEffect(() => {
        navigation.setOptions({
            headerShown: false,
        });
        if (depositDetails.length === 0 && route.params?.depositDetails?.length === 0){
            fetchDepositDetails()
        }
        // else{
        //     setDepositDetails(route.params?.depositDetails)
        // }

        console.log("Deposit Details: ", depositDetails)
    }, [depositDetails]);

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
                    <TouchableOpacity
                        onPress={() => {
                            setDepositModalVisible(false);
                            // if (route?.params?.data.sub_title.includes("GHS") ||
                            //     route?.params?.data.sub_title.includes("XAF") ||
                            //     route?.params?.data.sub_title.includes("UGX")){
                                navigation.navigate(NavigationNames.NjDepositScreen2, {
                                    data: route.params.data
                                })
                            // }
                            // else{
                            //     navigation.navigate(NavigationNames.NjDepositScreen, {
                            //         data: route.params.data
                            //     })
                            // }

                        }}
                        style={[globalStyles.button, {width: 250}]}>
                        <Text style={globalStyles.buttonText}>
                            Transfer From Mobile Money
                        </Text>
                    </TouchableOpacity>
                    {/*<TouchableOpacity*/}
                    {/*    onPress={() => {*/}
                    {/*        setDepositModalVisible(true);*/}
                    {/*        setModalVisible(true);*/}
                    {/*        // navigation.navigate(NavigationNames.NjDepositScreen, {*/}
                    {/*        //     data: route.params.data*/}
                    {/*        // })*/}
                    {/*    }}*/}
                    {/*    style={[globalStyles.button, {width: 250, marginTop: 20, backgroundColor: Colors.bg}]}>*/}
                    {/*    <Text style={[globalStyles.buttonText,{color: Colors.text_success}]}>*/}
                    {/*        Add Cash through Bank Transfer*/}
                    {/*    </Text>*/}
                    {/*</TouchableOpacity>*/}


                    {/*<View style={{marginTop: 10, marginBottom: 100, paddingHorizontal: 10}}><HtmlView htmlContent={route.params?.depositDetails[0]?.info || depositDetails[0]?.info} imagesMaxWidthOffset={300}/></View>*/}
                    {/*<View>*/}
                    {/*    <Text style={{marginTop:10, fontFamily: "Rubik-Regular", fontSize: 18, fontWeight: "bold", alignSelf: "center"}}>Transfy Deposit Details</Text>*/}
                    {/*    <Text style={{marginTop:10, fontFamily: "Rubik-Regular", fontSize: 18, fontWeight: "bold", alignSelf: "center"}}>Bank: WEMA BANK</Text>*/}
                    {/*    <Text style={{marginTop:10, fontFamily: "Rubik-Regular", fontSize: 18, fontWeight: "bold", alignSelf: "center"}}>Account Number: 7123456789</Text>*/}
                    {/*</View>*/}
                    {/*<View style={{ flexDirection: "row" }}>*/}
                    {/*    <View style={{*/}
                    {/*        justifyContent: "center",*/}
                    {/*        alignItems: "center",*/}
                    {/*        width: "100%",*/}
                    {/*        backgroundColor: "#eeeeee",*/}
                    {/*        marginTop: 50,*/}
                    {/*        padding: 20,*/}
                    {/*    }}>*/}
                    {/*        <Text*/}
                    {/*            style={{*/}
                    {/*                fontFamily: "Rubik-Regular",*/}
                    {/*                fontSize: 14,*/}
                    {/*                fontWeight: "normal",*/}
                    {/*                color: "black",*/}
                    {/*                textAlign: "center",*/}
                    {/*            }}*/}
                    {/*        >*/}
                    {/*            Mobile sent to this account number will reflect automatically*/}
                    {/*        </Text>*/}
                    {/*    </View>*/}
                    {/*</View>*/}

                    {/*<Modal*/}
                    {/*    animationType="slide"*/}
                    {/*    transparent={true}*/}
                    {/*    visible={modalVisible}*/}
                    {/*    onRequestClose={() => {*/}
                    {/*        Alert.alert('Modal has been closed.');*/}
                    {/*        setModalVisible(!modalVisible);*/}
                    {/*    }}>*/}
                    {/*    <View >*/}
                    {/*        <View style={styles.modalView}>*/}
                    {/*            <Text >Hello World!</Text>*/}
                    {/*            <Pressable*/}
                    {/*                // style={[styles.button, styles.buttonClose]}*/}
                    {/*                onPress={() => setModalVisible(!modalVisible)}>*/}
                    {/*                <Text >Hide Modal</Text>*/}
                    {/*            </Pressable>*/}
                    {/*        </View>*/}
                    {/*    </View>*/}
                    {/*</Modal>*/}

                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={modalVisible}
                        onRequestClose={() => {
                            setModalVisible(false);
                        }}
                    >
                        <ScrollView>
                            <View style={styles.centeredView}>
                                <View style={styles.modalView}>


                                        <View style={{marginTop: 10}}><HtmlView htmlContent={route.params?.depositDetails[0]?.info || depositDetails[0]?.info} imagesMaxWidthOffset={300}/></View>

                                    <TouchableOpacity
                                        style={[styles.button, styles.buttonClose, {justifyContent: "center"}]}
                                        onPress={() => {
                                            setModalVisible(false);
                                        }}
                                    >
                                        <Text style={styles.textStyle}>Close</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </ScrollView>
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
        width: 300,
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
