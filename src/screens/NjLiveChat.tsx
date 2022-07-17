import React, {useContext, useEffect, useRef, useState} from "react";
import {
    StyleSheet,
    ImageBackground,
    ScrollView,
    TouchableOpacity,
    RefreshControl,
    View,
    Dimensions,
} from "react-native";
import {Text, Icon, TextInput, HtmlView} from "../components";
import {useNavigation, useRoute} from "@react-navigation/native";
import SafeAreaView from "react-native-safe-area-view";
import { StackNavigationProp } from "@react-navigation/stack";
import { Colors } from "../constants";
import {AuthenticationContext} from "../context";
import WebView from "react-native-webview";

export const NjLiveChat = () => {
    const navigation = useNavigation<StackNavigationProp<any>>();

    const authContext = useContext(AuthenticationContext);
    const user = authContext.user;

    const inputRef = useRef<HTMLInputElement>(null);

    const script1 = `
      window.intercomSettings = {
        api_base: "https://api-iam.intercom.io",
        app_id: "d1beh3se"
      };`;

        const script2=`
        // We pre-filled your app ID in the widget URL: 'https://widget.intercom.io/widget/d1beh3se'
    (function(){var w=window;var ic=w.Intercom;if(typeof ic==="function"){ic('reattach_activator');ic('update',w.intercomSettings);}else{var d=document;var i=function(){i.c(arguments);};i.q=[];i.c=function(args){i.q.push(args);};w.Intercom=i;var l=function(){var s=d.createElement('script');s.type='text/javascript';s.async=true;s.src='https://widget.intercom.io/widget/d1beh3se';var x=d.getElementsByTagName('script')[0];x.parentNode.insertBefore(s,x);};if(document.readyState==='complete'){l();}else if(w.attachEvent){w.attachEvent('onload',l);}else{w.addEventListener('load',l,false);}}})();
        `;

        const script3 = `
        window.Intercom("boot", {
  api_base: "https://api-iam.intercom.io",
  app_id: "d1beh3se"
});
        `

    // setTimeout(() => {
    //     inputRef.current?.injectJavaScript(script1);
    //     inputRef.current?.injectJavaScript(script2);
    //     inputRef.current?.injectJavaScript(script3);
    // }, 3000);

    const html = `
      <html>
      <head>
      
     <script>
// We pre-filled your app ID in the widget URL: 'https://widget.intercom.io/widget/d1beh3se'
(function(){var w=window;var ic=w.Intercom;if(typeof ic==="function"){ic('reattach_activator');ic('update',w.intercomSettings);}else{var d=document;var i=function(){i.c(arguments);};i.q=[];i.c=function(args){i.q.push(args);};w.Intercom=i;var l=function(){var s=d.createElement('script');s.type='text/javascript';s.async=true;s.src='https://widget.intercom.io/widget/d1beh3se';var x=d.getElementsByTagName('script')[0];x.parentNode.insertBefore(s,x);};if(document.readyState==='complete'){l();}else if(w.attachEvent){w.attachEvent('onload',l);}else{w.addEventListener('load',l,false);}}})();
</script>
</head>
     
      <body>
        <h1>Mudi</h1>
       
      </body>
      </html>
    `;

    return (
        <SafeAreaView style={styles.container} forceInset={{ top: "always" }}>
            <WebView
                style={{width: width}}
                ref={inputRef}
                style={styles.container}
                source={{ uri: "https://transfy.io" }}
                // injectedJavaScript={script3}
            />
        </SafeAreaView>
    );
};

const { width, height } = Dimensions.get("window");
const styles = StyleSheet.create({
    container: { flex: 1, paddingHorizontal: 5 },
    topBar: {
        backgroundColor: "#fff",
        flexDirection: "row",
        paddingTop: 10,
    },
    button: {
        marginVertical: 30,
        backgroundColor: "#E8FFF1",
        borderColor: "#E8FFF1",
        color: Colors.text_success,
        borderRadius: 20,
        height: 55,
        width: "100%",
        alignSelf: "center",
        fontSize: 22,
        marginBottom: 100,
        justifyContent: "center",
    },
    inputFields: {
        marginTop: 20,
    },
    inputText: {
        fontSize: 16,
        marginBottom: 5,
        fontFamily: "Rubik-Regular",
    },
    viewBox: {
        justifyContent: "center",
        width: "100%",
        alignItems: "center"
    },
    acInfoImage: {
        resizeMode: "contain",
        width: "100%",
        height: (height - 200) / 4,
        borderRadius: 20,
        overflow: "hidden",
        marginTop: 20,
        marginBottom: 20,
    },
    modalView: {
        justifyContent: "center",
        backgroundColor: "#fff",
        borderRadius: 20,
        height: 'auto',
        padding: 30,
    },
});
