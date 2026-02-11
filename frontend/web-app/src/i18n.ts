import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from "./locales/en.json";
import sv from "./locales/sv.json";

const savedLanguage = localStorage.getItem("lang");

/**
 * Uses and initiates i18next as the translation module.
 */
i18n.use(initReactI18next).init({
    lng: savedLanguage || "en",
    debug: true,

    /* Define language resources that are available to the application */
    resources: {
        en: { translation: en },
        sv: { translation: sv }
    },
});

/* Language persistance */
i18n.on("languageChanged", (lng) => { localStorage.setItem("lang", lng); });

export default i18n;
