import { currentIntlLocale } from "../i18n/intl.js";

/**
 * Un prix n'est pas un nombre suivi d'un symbole : sa ponctuation, l'espace
 * qui précède le symbole et la place de celui-ci changent avec la langue.
 * 24,99 € en français, €24.99 en anglais — c'est Intl qui décide, pas nous.
 */
export function formatPrice(amount, currency) {
  const minorUnit = currency?.currency_minor_unit ?? 2;
  const value = Number(amount) / 10 ** minorUnit;

  return new Intl.NumberFormat(currentIntlLocale(), {
    style: "currency",
    currency: currency?.currency_code || "EUR",
  }).format(value);
}

/**
 * Formate un montant déjà exprimé en unité principale (euros, et non
 * centimes). Le Store API renvoie des entiers en plus petite unité, mais
 * certains totaux sont calculés côté front : les deux formes existent, et
 * les confondre divise ou multiplie le prix par cent.
 */
export function formatAmount(value, currencyCode = "EUR") {
  return new Intl.NumberFormat(currentIntlLocale(), {
    style: "currency",
    currency: currencyCode || "EUR",
  }).format(Number(value) || 0);
}
