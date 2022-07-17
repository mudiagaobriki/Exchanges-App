import React from "react";
import {
  Text as RNText,
  StyleSheet,
  TextProps,
  I18nManager,
} from "react-native";
import { useTheme } from "../theme";

type TProps = TextProps & {};

export const Text: React.FC<TProps> = (props) => {
  const { colors } = useTheme();
  return (
    <RNText
      {...props}
      style={[styles.text, { color: colors.textColor }, props.style]}
    >
      {props.children}
    </RNText>
  );
};

const styles = StyleSheet.create({
  text: {
    writingDirection: I18nManager.isRTL ? "rtl" : "ltr",
    includeFontPadding: false,
  },
});
