import i18n, { DEFAULT_LANGUAGE } from "./index.js";

/**
 * Choisit le message d'erreur à montrer après un appel d'API.
 *
 * WooCommerce répond dans la langue du serveur — ici le français — quel que
 * soit l'en-tête Accept-Language envoyé : c'est vérifiable en interrogeant
 * directement l'API. Son message est donc précieux tant que l'interface est
 * en français, et inutilisable dès qu'elle ne l'est plus. Dans ce cas on
 * affiche notre propre message, traduit, quitte à être moins précis : mieux
 * vaut une phrase juste et générale qu'une phrase exacte dans la mauvaise
 * langue.
 *
 * @param {string|undefined} serverMessage  message renvoyé par l'API
 * @param {string} key                      clé de repli, traduite
 */
export const apiErrorMessage = (serverMessage, key) =>
  (i18n.resolvedLanguage === DEFAULT_LANGUAGE && serverMessage) || i18n.t(key);

/** Message traduit, sans message serveur à considérer. */
export const apiError = (key) => i18n.t(key);
