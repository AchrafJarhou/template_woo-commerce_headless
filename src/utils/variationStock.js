/**
 * Les variations du Store API désignent leur taille par le slug du terme
 * ("l", "35-5"), alors que l'attribut porte aussi son nom affiché ("L",
 * "35.5") : comparer les noms ne trouve jamais la variation. Toute la
 * sélection se fait donc sur le slug, le nom ne sert qu'à l'affichage.
 */

// Seuls les attributs « Utilisé pour les variations » se choisissent : les
// autres (matière, coupe…) sont purement descriptifs.
export function getVariationAttributes(product) {
  return (product?.attributes || []).filter(
    (attribute) => attribute.has_variations !== false,
  );
}

export function getAttributeOptions(attribute) {
  if (attribute.terms?.length) {
    return attribute.terms.map(({ name, slug }) => ({ name, slug }));
  }
  return (attribute.options || []).map((name) => ({ name, slug: name }));
}

// Une valeur vide côté variation signifie « n'importe quelle taille », et un
// attribut pas encore choisi côté client ne restreint rien non plus.
function matchesSelection(variation, selection) {
  return variation.attributes.every(
    ({ name, value }) => !value || !selection[name] || selection[name] === value,
  );
}

export function isSelectionInStock(product, selection) {
  if (!product.variations?.length) return Boolean(product.is_in_stock);

  return product.variations.some(
    (variation) => variation.is_in_stock && matchesSelection(variation, selection),
  );
}

// Une taille est épuisée quand aucune variation disponible ne la propose,
// compte tenu des autres attributs déjà choisis (une couleur, par exemple).
export function isOptionInStock(product, attributeName, slug, selection) {
  return isSelectionInStock(product, { ...selection, [attributeName]: slug });
}

// Quantité restante quand elle passe sous le seuil de stock faible réglé dans
// WooCommerce, sinon null. Pour un produit variable, il faut que toutes les
// tailles soient choisies pour désigner une seule variation.
export function getLowStockRemaining(product, selection) {
  if (!product.variations?.length) return product.low_stock_remaining ?? null;

  const isComplete = getVariationAttributes(product).every(
    (attribute) => selection[attribute.name],
  );
  if (!isComplete) return null;

  const variation = product.variations.find((candidate) =>
    matchesSelection(candidate, selection),
  );
  return variation?.low_stock_remaining ?? null;
}

// Présélectionne la première taille disponible plutôt que la première de la
// liste, qui peut être épuisée.
export function getDefaultSelection(product) {
  const selection = {};

  getVariationAttributes(product).forEach((attribute) => {
    const firstAvailable = getAttributeOptions(attribute).find((option) =>
      isOptionInStock(product, attribute.name, option.slug, selection),
    );
    if (firstAvailable) selection[attribute.name] = firstAvailable.slug;
  });

  return selection;
}
