import axios from "axios";
import React, { useState, Children, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { UserModel } from "../models";

export type AuthenticationContextType = {
  isLoggedIn: boolean;
  splash: string;
  user?: UserModel;
  login: (user: UserModel) => Promise<boolean>;
  logout: () => Promise<boolean>;
  showSplash: () => Promise<boolean>;
  doneSplash: () => Promise<boolean>;
};

export const AuthenticationContext = React.createContext<
  AuthenticationContextType
>({
  isLoggedIn: false,
  splash: "want",
  user: undefined,
  login: (_: UserModel) => Promise.resolve(false),
  logout: () => Promise.resolve(false),
  showSplash: () => Promise.resolve(false),
  doneSplash: () => Promise.resolve(false),
});

export const AuthenticationProvider: React.FC<{ user?: UserModel, splash?: string }> = (
  props
) => {
  const [user, setUser] = useState<UserModel>();
  const [splash, setSplash] = useState("want");

  const login = async (user: UserModel) => {
    axios.defaults.headers["Authorization"] =
      "Bearer " + (await AsyncStorage.getItem("AccessToken"));
    setUser(user);
    return Promise.resolve(true);
  };

  const logout = async () => {
    await AsyncStorage.multiRemove(["AccessToken", "User"]);
    axios.defaults.headers["Authorization"] = null;
    setUser(undefined);
    return Promise.resolve(true);
  };

  const showSplash = async () => {
    await AsyncStorage.setItem("Splash", "want");
    setSplash("want");
    return Promise.resolve(true);
  };

  const doneSplash = async () => {
    await AsyncStorage.setItem("Splash", "showed");
    setSplash("showed");
    return Promise.resolve(true);
  };


  useEffect(() => {
    setUser(props.user);
    setSplash(props.splash == "showed"? "showed": "want");
  }, [props.user, props.splash]);

  return (
    <AuthenticationContext.Provider
      value={{ login, logout, showSplash, doneSplash, user: user, isLoggedIn: !!user, splash: splash }}
    >
      {Children.only(props.children)}
    </AuthenticationContext.Provider>
  );
};
