import i18next from "i18next";
import { getLocales } from "react-native-localize";
import { initReactI18next } from "react-i18next";
import en from "./en/common.json";
import tr from "./tr/common.json";
// import AsyncStorage from "@react-native-async-storage/async-storage";

export const initI18n = async () => {
  let lng = "en";
  // try {
  //   const stored = await AsyncStorage.getItem("@user_language");
  //   lng = stored || getLocales()[0].languageCode || "en";
  // } catch (e) {
  //   lng = "en";
  // }

  await i18next.use(initReactI18next).init({
    resources: {
      en: { translation: en },
      tr: { translation: tr },
    },
    lng,
    fallbackLng: "en",
    interpolation: { escapeValue: false },
    react: { useSuspense: false },
  });
};
