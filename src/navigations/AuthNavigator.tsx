import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import {NjForgetPasswordScreen, NjLoginScreen, NjRegisterScreen} from "../screens";
import NavigationNames from "./NavigationNames";
import {NjEmailVerificationScreen} from "../screens/NjEmailVerificationScreen";

const RootStack = createStackNavigator();

export default function () {
  return (
    <RootStack.Navigator
      headerMode="screen"
      screenOptions={{ headerShown: false }}
    >
      <RootStack.Screen
        name={NavigationNames.NjLoginScreen}
        component={NjLoginScreen}
      />
      <RootStack.Screen
        name={NavigationNames.NjRegisterScreen}
        component={NjRegisterScreen}
      />
      <RootStack.Screen
        name={NavigationNames.NjForgetPasswordScreen}
        component={NjForgetPasswordScreen}
      />
      <RootStack.Screen
          name={NavigationNames.NjEmailVerificationScreen}
          component={NjEmailVerificationScreen}
      />
      {/*<RootStack.Screen*/}
      {/*    name={NavigationNames.HomeScreenNew}*/}
      {/*    component={NjEmailVerificationScreen}*/}
      {/*/>*/}
    </RootStack.Navigator>
  );
}
