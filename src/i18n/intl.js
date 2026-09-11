import i18n, { DEFAULT_LANGUAGE } from "./index.js";

/**
 * Correspondance entre la langue de l'interface et l'étiquette de locale
 * attendue par l'API Intl du navigateur.
 *
 * Les deux ne se confondent pas : « en » ne suffit pas à Intl pour choisir
 * entre 1,234.56 $ et 1 234,56 €. On fixe donc explicitement la variante
 * régionale — en-GB pour une boutique qui facture en euros, jamais en-US
 * qui placerait le symbole monétaire du mauvais côté.
 */
const INTL_LOCALES = {
  fr: "fr-FR",
  en: "en-GB",
};

/** Locale Intl correspondant à la langue actuellement affichée. */
export const currentIntlLocale = () =>
  INTL_LOCALES[i18n.resolvedLanguage] ?? INTL_LOCALES[DEFAULT_LANGUAGE];

export default INTL_LOCALES;
