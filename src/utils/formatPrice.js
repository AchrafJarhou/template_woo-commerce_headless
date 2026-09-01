export function formatPrice(amount, currency) {
  const minorUnit = currency?.currency_minor_unit ?? 2;
  const code = currency?.currency_code ?? "EUR";
  const value = Number(amount) / 10 ** minorUnit;

  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: code,
  }).format(value);
}