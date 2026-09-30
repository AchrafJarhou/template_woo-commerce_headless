/**
 * WordPress est monolingue : les traductions d'un produit sont saisies dans
 * des champs ACF et arrivent sous product.translations.<langue>. Un champ
 * laissé vide n'y figure pas, on retombe alors sur le texte d'origine — un
 * produit non traduit reste affiché plutôt que vide.
 */
export function getProductName(product, language) {
  return product?.translations?.[language]?.name || product?.name || "";
}

// La description affichée est la description courte : c'est elle que traduit
// le champ « English Description ».
export function getProductDescription(product, language) {
  return (
    product?.translations?.[language]?.description ||
    product?.short_description ||
    ""
  );
}
