import React from "react";
import { View, ViewStyle, StyleProp, I18nManager } from "react-native";
import {
  Fontisto,
  AntDesign,
  Ionicons,
  FontAwesome,
  FontAwesome5,
  MaterialIcons, Entypo, EvilIcons, Feather, Foundation, MaterialCommunityIcons, Octicons, SimpleLineIcons, Zocial,
} from "@expo/vector-icons";

type TProps = {
  group?: "AntDesign" | "Entypo" | "EvilIcons" | "Feather" | "Fontisto" | "FontAwesome" | "FontAwesome5" | "Foundation" | "Ionicons" | "MaterialCommunityIcons" | "MaterialIcons" | "Octicons" | "SimpleLineIcons" | "Zocial";
  name: string;
  size?: number;
  color?: string;
  style?: StyleProp<ViewStyle>;
  ignoreRTL?: boolean;
};

export const Icon: React.FC<TProps> = ({
  group,
  name,
  size,
  color,
  ignoreRTL,
  style,
}) => {
  let Icon;
  switch (group) {
    case "AntDesign":
      Icon = AntDesign
      break;
    case "Entypo":
      Icon = Entypo
      break;
    case "EvilIcons":
      Icon = EvilIcons
      break;
    case "Feather":
      Icon = Feather
      break;
    case "Fontisto":
      Icon = Fontisto
      break;
    case "FontAwesome":
      Icon = FontAwesome
      break;
    case "FontAwesome5":
      Icon = FontAwesome5
      break;
    case "Foundation":
      Icon = Foundation
      break;
    case "Ionicons":
      Icon = Ionicons
      break;
    case "MaterialCommunityIcons":
      Icon = MaterialCommunityIcons
      break;
    case "MaterialIcons":
      Icon = MaterialIcons
      break;
    case "Octicons":
      Icon = Octicons
      break;
    case "SimpleLineIcons":
      Icon = SimpleLineIcons
      break;
    case "Zocial":
      Icon = Zocial
      break;
    default:
      Icon = Ionicons;
      break;
  }

  return (
    <View style={style}>
      <Icon
        name={name}
        size={size ?? 24}
        color={color ?? "#000"}
        style={{
          transform: [{ scaleX: I18nManager.isRTL && !ignoreRTL ? -1 : 1 }],
        }}
      />
    </View>
  );
};
