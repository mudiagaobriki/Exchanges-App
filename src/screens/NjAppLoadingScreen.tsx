import React, {useEffect} from "react";
import {StyleSheet, Image, View, Dimensions} from "react-native";
import { useNavigation } from "@react-navigation/native";
import SafeAreaView from "react-native-safe-area-view";
import { StackNavigationProp } from "@react-navigation/stack";

export const NjAppLoadingScreen = () => {
  const navigation = useNavigation<StackNavigationProp<any>>();
  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  return (
    <SafeAreaView style={styles.container} forceInset={{ top: "always" }}>
      <View style={{flex: 1, backgroundColor: "white", alignItems: "center", justifyContent: "center", paddingHorizontal: 30,}}>
        <View style={{ height:'auto', alignItems: 'center' }}>
          <Image style={{ width: win.width, height: win.width / 3}} source={require('../../assets/images/logo.png')} />
        </View>
      </View>
    </SafeAreaView>
);
};

const win = Dimensions.get('window');
const styles = StyleSheet.create({
    container: { flex: 1, paddingHorizontal: 30 },
    topBar:{
      backgroundColor: '#fff',
      flexDirection: 'row',
      paddingTop: 10
    },
});
