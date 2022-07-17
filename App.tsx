import React, { useState, useEffect } from "react";
import { useFonts }  from 'expo-font';
import * as ExpoLocalization from "expo-localization";
import {
  AppNavigator,
  configureGlobalTypography,
  initLocalization,
  ThemeContext,
  Themes,
} from "./src";
import {StatusBar, LogBox} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthenticationProvider, SystemConfigProvider } from "./src/context";
import { LoadingLayout, LoadingManager } from "./src/presentation";
import axios from "axios";
import {API_URL, Colors, getLang} from "./src/constants";
import { UserModel } from "./src/models";

LogBox.ignoreLogs([
  "VirtualizedLists should never be nested", // TODO: Remove when fixed
]);

axios.defaults.timeout = 15000;
axios.defaults.baseURL = API_URL;
axios.interceptors.request.use(
  (config) => {
  // @ts-ignore
	if(!config.hideLoading){
	  LoadingManager.showLoading();
	}else{
	  LoadingManager.hideLoading();
	}
    return config;
  },
  (err) => {
    LoadingManager.hideLoading();
    // console.log('err6213', err);
    return Promise.reject(err);
  }
);

axios.interceptors.response.use(
  (config) => {
    // console.log('response', config);
    LoadingManager.hideLoading();
    return config;
  },
  (err) => {
    LoadingManager.hideLoading();
    // console.log('err6214', err.config);
    return Promise.reject(err);
  }
);

const App = () => {
  const [user, setUser] = useState<UserModel>();
  const [splash, setSplash] = useState("want");
  const [theme, setTheme] = useState(Themes.light);

  useEffect(() => {
    AsyncStorage.multiGet(["APP_LANGUAGE", "THEME"]).then((response) => {
      let _appLang = response[0][1];
      const _theme = response[1][1];

      if (_theme === undefined || _theme === null) {
        setTheme(Themes.light);
      } else {
        setTheme(_theme === "dark" ? Themes.dark : Themes.light);
      }

      if (_appLang === undefined || _appLang === null) {
        _appLang = ExpoLocalization.locale.split("-")[0];
      }
      const availableLang = getLang(_appLang);
      initLocalization(availableLang);
    });

    AsyncStorage.multiGet(["AccessToken", "User"]).then((response) => {
      const _accessToken = response[0][1];
      const _user = response[1][1];
      // console.log(`AccessToken IS: ${_accessToken}`)

      if (_accessToken && _user) {
        axios.defaults.headers["Authorization"] = "Bearer " + _accessToken;
        setUser(JSON.parse(_user));
      }
    });

    AsyncStorage.getItem("Splash").then((response) => {
      const _splash = response;
      // console.log('splash-6263212-oo', _splash)

      if (_splash) {
        // console.log('splash-6263212', _splash)
        setSplash(_splash);
      }
    });
  }, []);

  const [isFontLoaded] = useFonts({
    "default-thin": require("./assets/fonts/Rubik-Light.ttf"),
    "default-light": require("./assets/fonts/Rubik-Light.ttf"),
    "default-regular": require("./assets/fonts/Rubik-Regular.ttf"),
    "default-medium": require("./assets/fonts/Rubik-Medium.ttf"),
    "default-semi-bold": require("./assets/fonts/Rubik-SemiBold.ttf"),
    "default-bold": require("./assets/fonts/Rubik-Bold.ttf"),
    "default-extra-bold": require("./assets/fonts/Rubik-ExtraBold.ttf"),
    "default-black": require("./assets/fonts/Rubik-Black.ttf"),
    "Rubik-Regular": require("./assets/fonts/Rubik-Regular.ttf"),
  });

  if (!isFontLoaded) {
    return null;
  }

  configureGlobalTypography();

  return (
    <>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={Colors.bg}
      />
      <AuthenticationProvider user={user} splash={splash}>

        <ThemeContext.Provider
          value={{
            ...theme,
            changeTheme: (isDark: boolean) => {
              AsyncStorage.setItem("THEME", isDark ? "dark" : "light").then(() => {});
              setTheme(isDark ? Themes.dark : Themes.light);
            },
          }}
        >
	        <SystemConfigProvider>
		        <AppNavigator />
	        </SystemConfigProvider>
          <LoadingLayout ref={(ref) => LoadingManager?.setLoadingView(ref!!)} />
        </ThemeContext.Provider>
      </AuthenticationProvider>
    </>
  );
};

export default App;
