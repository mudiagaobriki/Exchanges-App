import i18n from "i18n-js";
// import { Localization } from "expo-localization";
import * as Localization from "expo-localization";

// Translation
import en from "./locales/en.json";
import fr from "./locales/fr.json";
import ar from "./locales/ar.json";
import * as SecureStore from "expo-secure-store";
// import {setPath} from "react-native-reanimated/lib/types/lib/reanimated2/animation/styleAnimation";
import {isUndefined} from "lodash";

// bind to i18n
i18n.translations = {
  en,
  fr,
  ar
};

// set app to local phone settings
export const getLanguage = async () => {
  try {
    const choice = await Localization.locale;
    // i18n.locale = choice.substr(0, 2);
    // let myLang = choice.substr(0,2)
    getValueFor("preferred_language")
        .then((result) => {
          if (isUndefined(result)){
            i18n.locale = choice.substr(0,2)
          }
          else{
            i18n.locale = result
          }
        })
        .catch(err => {
          console.log("Error in fetching local language: ", err)
          i18n.locale = choice.substr(0,2)
        })
    // let myLang = getValueFor("preferred_language") || choice.substr(0, 2)

    // i18n.locale = myLang;
    i18n.initAsync();
  } catch (error) {
    console.log("Unable to set language");
  }
};


async function save(key, value) {
  await SecureStore.setItemAsync(key, value);
}

async function getValueFor(key) {
  let result = await SecureStore.getItemAsync(key);
  if (result) {
    return result;
    // alert("🔐 Here's your value 🔐 \n" + result);
  } else {
    console.log("No fingerprint settings stored for this device.");
  }
}

getLanguage();

// export modules
export function t(name) {
  return i18n.t(name);
}
