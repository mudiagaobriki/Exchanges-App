import React, {useEffect} from "react";
// @ts-ignore
import TabBar from "@mindinventory/react-native-tab-bar-interaction";
import NavigationNames from "../navigations/NavigationNames";
import {useNavigation, useRoute} from "@react-navigation/native";
import {StackNavigationProp} from "@react-navigation/stack";
import {Icon} from "./Icon";
import {Image} from "react-native";

export const NjBottomTabBar = () => {
	const tabData = [
		{
			name: 'home',
			activeIcon: <Icon group="AntDesign" name="appstore1" size={24} color="white" />,
			inactiveIcon: <Icon group="AntDesign" name="appstore1" size={24} color="black" />
		},
		{
			name: 'dashboard',
			activeIcon: <Image source={require("../../assets/images/icon/receipt-white.png")} style={{width: 22.4, height: 28}}/>,
			inactiveIcon: <Image source={require("../../assets/images/icon/receipt-black.png")} style={{width: 22.4, height: 28}}/>,
		},
		{
			name: 'account',
			activeIcon: <Icon group="Fontisto" name="person" size={24} color="white" />,
			inactiveIcon: <Icon group="Fontisto" name="person" size={24} color="black" />
		},
	];
	const navigation = useNavigation<StackNavigationProp<any>>();

	return (
		<TabBar
			tabs= {tabData}
			tabBarContainerBackground={"white"}
			tabBarBackground={"#F2F2F2"}
			// tabBarBackground={"rgba(38,191,101,0.5)"}
			activeTabBackground={"#26C165"}
			// labelStyle={{ color: '#4d4d4d', fontWeight: '600', fontSize: 11 }}
			labelStyle={{display: 'none'}}
			onTabChange={(item: any) => {

				switch (item.name) {
					case 'home':
						return navigation.navigate(NavigationNames.HomeScreenNew)
					case 'dashboard':
						return navigation.navigate(NavigationNames.NjWalletScreen)
					case 'account':
						return navigation.navigate(NavigationNames.NjAccountScreen)
					default:
						return navigation.navigate(NavigationNames.HomeScreenNew)
				}
			}}
		/>
	)
}
