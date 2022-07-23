import React from "react";
import { Text } from "react-native";

export const configureGlobalTypography = () => {
  const oldTextRender = (Text as any).render;
  (Text as any).render = function (...args: any[]) {
    const origin = oldTextRender.call(this, ...args);
    return React.cloneElement(origin, {
      allowFontScaling: false,
      style: [{ fontFamily: "default-regular" }, origin.props.style],
    });
  };
};
