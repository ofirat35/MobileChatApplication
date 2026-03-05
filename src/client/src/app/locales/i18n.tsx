import i18next from "i18next";
import { getLocales } from "react-native-localize";
import { initReactI18next } from "react-i18next";
import en from "./en/common.json";
import tr from "./tr/common.json";

i18next.use(initReactI18next).init({
  lng: getLocales()[0].languageCode,
  fallbackLng: "en",
  debug: true,
  resources: {
    en: { translation: en },
    tr: { translation: tr },
  },
  interpolation: { escapeValue: false },
  react: { useSuspense: false },
});
