import React from "react";
import {
  View,
  StyleSheet,
  StyleProp,
  ViewStyle,
  TextInput as RNTextInput,
  TextInputProps,
  I18nManager,
} from "react-native";
import { useTheme } from "../theme";

type TProps = {
  style?: StyleProp<ViewStyle>;
  inputProps?: TextInputProps;
};

export const TextInput = React.forwardRef<RNTextInput, TProps>(
  ({ inputProps, style }, ref) => {
    const { isDark, colors, sizes } = useTheme();
    return (
      <View
        style={[
          styles.container,
          {
            borderColor: colors.borderColor,
            // @ts-ignore
            backgroundColor: inputProps.editable === false ? colors.disabledInputBG: colors.windowBackground,
            shadowColor: isDark ? "#FFFFFF10" : "#00000010",
          },
          style,
        ]}
      >
        <RNTextInput
          ref={ref}
          {...inputProps}
          style={[
            styles.input,
            { height: sizes.inputHeight, color: colors.textColor },
            inputProps?.style,
          ]}
          placeholderTextColor={colors.gray}
        />
      </View>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    borderWidth: 0.5,
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 0,
    shadowOffset: {
      width: 0,
      height: 4,
    },
  },
  input: {
    fontSize: 15,
    paddingHorizontal: 16,
    fontFamily: "default-medium",
    writingDirection: I18nManager.isRTL ? "rtl" : "ltr",
  },
});
