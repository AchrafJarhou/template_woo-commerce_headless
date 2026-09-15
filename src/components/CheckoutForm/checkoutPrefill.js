/**
 * Valeurs initiales du formulaire de commande, déduites du compte connecté.
 *
 * Deux sources, dans cet ordre :
 *  1. les adresses WooCommerce enregistrées (dernière commande, carnet
 *     d'adresses) — elles désignent le destinataire, qui n'est pas forcément
 *     le titulaire du compte ;
 *  2. l'identité du compte (prénom, nom, e-mail), pour tout ce qu'aucune
 *     adresse ne fournit — typiquement avant la première commande.
 *
 * Les clés produites sont celles du formulaire et de /custom/v1/checkout
 * (snake_case) ; l'API client les expose en camelCase.
 */

// Pays proposé par défaut depuis l'origine du formulaire.
const DEFAULT_COUNTRY = "FR";

// Champs qui distinguent réellement deux adresses : l'e-mail est commun aux
// deux formulaires, il ne compte pas.
const COMPARED_FIELDS = [
  "first_name",
  "last_name",
  "address_1",
  "city",
  "postcode",
  "country",
  "phone",
];

const isFilled = (value) => typeof value === "string" && value.trim() !== "";

const firstFilled = (...values) => values.find(isFilled) ?? "";

// Une adresse sans rue est inutilisable pour livrer : WooCommerce peut garder
// un nom ou un pays isolés, qu'on ne veut pas mélanger à une autre adresse.
const hasStreet = (address) => isFilled(address?.address1);

export function buildCheckoutPrefill(customer, profile) {
  const savedShipping = customer?.shipping;
  const savedBilling = customer?.billing;

  // Une adresse est reprise en bloc, jamais champ par champ : la rue de l'une
  // avec la ville de l'autre produirait une adresse qui n'existe pas.
  const shippingSource =
    (hasStreet(savedShipping) && savedShipping) ||
    (hasStreet(savedBilling) && savedBilling) ||
    {};
  const billingSource = hasStreet(savedBilling) ? savedBilling : shippingSource;

  // WooCommerce ne renseigne souvent que le téléphone de facturation.
  const knownPhone = firstFilled(savedShipping?.phone, savedBilling?.phone);

  const toFormAddress = (source) => ({
    first_name: firstFilled(source.firstName, profile?.firstName),
    last_name: firstFilled(source.lastName, profile?.lastName),
    address_1: firstFilled(source.address1),
    city: firstFilled(source.city),
    postcode: firstFilled(source.postcode),
    country: firstFilled(source.country, DEFAULT_COUNTRY),
    email: firstFilled(profile?.email),
    phone: firstFilled(source.phone, knownPhone),
  });

  const shipping = toFormAddress(shippingSource);
  const billing = toFormAddress(billingSource);

  return {
    shipping,
    billing,
    sameAddress: COMPARED_FIELDS.every(
      (field) => shipping[field] === billing[field],
    ),
  };
}
