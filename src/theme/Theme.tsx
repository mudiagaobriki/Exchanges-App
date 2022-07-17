import React, { useContext } from "react";

const PRIMARY_COLOR = "#41bafe";
const BOX_RADIUS = 12;
const INPUT_HEIGHT = 50;
const GRAY = "gray";
const LIGHT_GRAY = "lightgray";

type ThemeType = {
  isDark: boolean;
  colors: {
    primaryColor: string;
    textColor: string;
    borderColor: string;
    windowBackground: string;
    gray: string;
    lightgray: string;
    tabBarActive: string;
    tabBarInactive: string;
    touchableHighlightUnderlayColor: string;
    disabledInputBG: string;
  };
  sizes: {
    boxRadius: number;
    inputHeight: number;
  };
  changeTheme: (isDark: boolean) => void;
};

export const Themes: {
  dark: ThemeType;
  light: ThemeType;
} = {
  dark: {
    isDark: true,
    colors: {
      primaryColor: PRIMARY_COLOR,
      textColor: "white",
      borderColor: "#242424",
      windowBackground: "#0d0d0d",
      gray: GRAY,
      lightgray: LIGHT_GRAY,
      tabBarActive: PRIMARY_COLOR,
      tabBarInactive: "#424242",
      touchableHighlightUnderlayColor: "#1c1c1c",
      disabledInputBG: "#e9ecef",
    },
    sizes: {
      boxRadius: BOX_RADIUS,
      inputHeight: INPUT_HEIGHT,
    },
    changeTheme: (isDark: boolean) => {},
  },
  light: {
    isDark: false,
    colors: {
      primaryColor: PRIMARY_COLOR,
      textColor: "black",
      borderColor: "#e0e0e0",
      windowBackground: "white",
      gray: GRAY,
      lightgray: LIGHT_GRAY,
      tabBarActive: PRIMARY_COLOR,
      tabBarInactive: LIGHT_GRAY,
      touchableHighlightUnderlayColor: "#f0f0f0",
      disabledInputBG: "#e9ecef",
    },
    sizes: {
      boxRadius: BOX_RADIUS,
      inputHeight: INPUT_HEIGHT,
    },
    changeTheme: (isDark: boolean) => {},
  },
};

export const ThemeContext = React.createContext<ThemeType>(Themes.light);
export const useTheme = () => useContext(ThemeContext);
