import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import HomeTabNavigator from "./HomeTabNavigator";
import NavigationNames from "./NavigationNames";
import { useTheme } from "../theme";
import {NjAppLoadingScreen, NjSplashScreen} from "../screens";
import AuthNavigator from "./AuthNavigator";
import {AuthenticationContext} from "../context";
import {useContext, useEffect, useState} from "react";
import * as SecureStore from "expo-secure-store";
import axios from "axios";

const Stack = createStackNavigator();

function AppNavigator() {
  const { colors } = useTheme();
  const authContext = useContext(AuthenticationContext);
  const [loading, setLoading] = useState(true)
  const [emailVerified, setEmailVerified] = useState("")
  const [sessionPing, setSessionPing] = useState({})
  useEffect(() => {
      getValueFor("emailVerified")
          .then(res =>{
              console.log("Email Verified from App Stack: ", res)
              if (res == "true"){
                  setEmailVerified(res)
              }
          })
    setTimeout(() => {
      setLoading(false)
    }, 1000)
      console.log("Email Verified from App Stack 2: ", emailVerified)

  }, [emailVerified])

    // useEffect(() => {
    //     let interval = setTimeout(() => {
    //         axios.post("user/session-ping")
    //             .then(res => {
    //                 console.log("Session ping response: ", res)
    //                 if (res.status === 200){
    //                     setSessionPing(res)
    //                 }
    //                 else{
    //                     clearInterval(interval)
    //                 }
    //
    //             })
    //     }, 10000)
    //
    // },[sessionPing])

  async function getValueFor(key) {
    let result = await SecureStore.getItemAsync(key);
    if (result) {
      return result
      // alert("🔐 Here's your value 🔐 \n" + result);
    } else {
      console.log('No fingerprint settings stored for this device.');
    }
  }

  return (
    <NavigationContainer
      theme={{
        dark: false,
        colors: {
          background: colors.windowBackground,
          border: colors.borderColor,
          card: colors.windowBackground,
          primary: "rgb(0, 122, 255)",
          text: colors.primaryColor,
          notification: colors.primaryColor,
        },
      }}
    >
      <Stack.Navigator headerMode="screen" mode="modal">
        {
          loading ?
            <>
              <Stack.Screen
                name={NavigationNames.NjAppLoadingScreen}
                component={NjAppLoadingScreen}
                options={{ headerShown: false }}
              />
            </>
          : (
          authContext.splash == "want" ?
            <Stack.Screen
              name={NavigationNames.NjSplashScreen}
              component={NjSplashScreen}
              options={{ headerShown: false }}
            />
          :
            authContext.isLoggedIn
            ?
              <>
                <Stack.Screen
                  name={NavigationNames.HomeTabRootStack}
                  component={HomeTabNavigator}
                  options={{ headerShown: false }}
                />
              </>
            :
              <>
                <Stack.Screen
                  name={NavigationNames.NjLoginScreen}
                  component={AuthNavigator}
                  options={{ headerShown: false }}
                />
              </>
            )
        }
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default AppNavigator;
