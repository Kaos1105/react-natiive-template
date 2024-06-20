import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import { LOCALE } from "@/enums/locale.enum";
import japanese from "@/locales/ja";

export const resources = {
    ja: { translation: japanese },
} as const;

i18next.use(initReactI18next).init({
    compatibilityJSON: 'v3',
    lng: Object.keys(LOCALE)[1], // japanese
    resources,
    interpolation: {
        escapeValue: false,
    },
    returnNull: false,
    returnEmptyString: true,
});

export default i18next;
