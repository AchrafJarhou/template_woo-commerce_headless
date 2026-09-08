import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import fr from "./locales/fr.json";
import en from "./locales/en.json";

export const DEFAULT_LANGUAGE = "fr";
export const SUPPORTED_LANGUAGES = ["fr", "en"];

const LANGUAGE_STORAGE_KEY = "wc_language";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      fr: { translation: fr },
      en: { translation: en },
    },
    supportedLngs: SUPPORTED_LANGUAGES,
    fallbackLng: DEFAULT_LANGUAGE,
    // Un navigateur annonce « en-GB » ou « fr-CA » : sans cette option,
    // i18next chercherait des ressources régionales qui n'existent pas.
    load: "languageOnly",
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
      lookupLocalStorage: LANGUAGE_STORAGE_KEY,
    },
    // React échappe déjà les valeurs interpolées.
    interpolation: { escapeValue: false },
  });

// L'attribut lang de <html> pilote la voix des lecteurs d'écran, la césure
// typographique et l'indexation : il doit suivre la langue affichée.
const syncDocumentLanguage = (language) => {
  document.documentElement.lang = language;
};

syncDocumentLanguage(i18n.resolvedLanguage);
i18n.on("languageChanged", syncDocumentLanguage);

// Les pages éditoriales vivent dans WordPress, qui est monolingue ici : la
// traduction d'une page est une autre page, suffixée par sa langue.
// Centralisé ici pour qu'un futur passage à Polylang ne touche qu'un endroit.
export const localizedPageSlug = (slug, language) =>
  language === DEFAULT_LANGUAGE ? slug : `${slug}-${language}`;

export default i18n;
