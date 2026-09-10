import { currentIntlLocale } from "../i18n/intl.js";

/**
 * Formate une date dans la langue affichée. En français « 9 septembre 2026 »,
 * en anglais « 9 September 2026 » : l'ordre, la casse et la présence d'un
 * article changent d'une langue à l'autre, on ne les écrit donc jamais soi-même.
 *
 * @param {string|number|Date} value  date ISO renvoyée par l'API, ou Date
 * @param {Intl.DateTimeFormatOptions} [options]  format long si omis
 */
export function formatDate(value, options) {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  return new Intl.DateTimeFormat(currentIntlLocale(), options).format(date);
}

/** Format long : 9 septembre 2026 / 9 September 2026. */
export const formatLongDate = (value) =>
  formatDate(value, { day: "numeric", month: "long", year: "numeric" });
