import React from "react";
import {
  StyleSheet,
  I18nManager,
  TextStyle,
  StyleProp,
} from "react-native";
import HTML from "react-native-render-html";
import { useTheme } from "../theme";

type TProps = {
  htmlContent: string;
  imagesMaxWidthOffset: number;
  fontStyle?: StyleProp<TextStyle>;
};

export const HtmlView: React.FC<TProps> = (props) => {
  const { colors } = useTheme();
  return (
    <HTML
      baseFontStyle={{
        ...styles.htmlBaseFontStyle,
        color: colors.textColor,
        ...(props.fontStyle as any),
      }}
      source={{ html: props.htmlContent}}
      // imagesMaxWidth={props.imagesMaxWidthOffset}
      contentWidth={props.imagesMaxWidthOffset}
      ignoredStyles={["font-family"]}
      tagsStyles={{
        p: { marginVertical: 4 },
        h1: {
          marginTop: 12,
          marginBottom: 2,
          fontSize: 24,
          fontFamily: "default-medium",
        },
        h2: {
          marginTop: 12,
          marginBottom: 2,
          fontSize: 22,
          fontFamily: "default-medium",
        },
        h3: {
          marginTop: 12,
          marginBottom: 2,
          fontSize: 20,
          fontFamily: "default-medium",
        },
        h4: {
          marginTop: 12,
          marginBottom: 2,
          fontSize: 16,
          fontFamily: "default-medium",
        },
        strong: { fontFamily: "default-medium" },
      }}
    />
  );
};

const styles = StyleSheet.create({
  htmlBaseFontStyle: {
    fontSize: 15,
    fontFamily: "default-regular",
    writingDirection: I18nManager.isRTL ? "rtl" : "ltr",
    textAlign: "justify",
    color: "red",
  },
});
