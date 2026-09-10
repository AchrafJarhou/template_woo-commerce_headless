import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import DOMPurify from "dompurify";
import { addProductToCart } from "../../thunkActionsCreator/cartThunks";
import { showToast } from "../../slices/toastSlice";
import "./index.css";
import { formatPrice } from "../../utils/formatPrice";
import { useTranslation } from "react-i18next";

export default function ProductModal({ product, onClose }) {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [itemVariation, setItemVariation] = useState({});
  const [descriptionNeedsScroll, setDescriptionNeedsScroll] = useState(false);

  // Le formatage des prix était réécrit ici, avec sa propre locale figée.
  // Il passe désormais par la fonction partagée, qui suit la langue affichée.
  const formatModalPrice = (priceInCents, currencyCode) =>
    priceInCents
      ? formatPrice(priceInCents, {
          currency_code: currencyCode || "EUR",
          currency_minor_unit: 2,
        })
      : t("product.priceOnRequest");

  useEffect(() => {
    if (!product || !product.attributes) return;
    const defaults = {};
    product.attributes.forEach((attribute) => {
      const options = attribute.options || (attribute.terms?.map(t => t.name) || []);
      if (options.length > 0) {
        defaults[attribute.name] = options[0];
      }
    });
    setItemVariation(defaults);
  }, [product]);

  useEffect(() => {
    if (product?.short_description) {
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = DOMPurify.sanitize(product.short_description);
      const textContent = tempDiv.textContent || "";
      setDescriptionNeedsScroll(textContent.length > 150);
    }
  }, [product]);

  const handleAddToCart = async () => {
    // Valider que toutes les tailles/attributs sont sélectionnés
    if (product.attributes?.length > 0) {
      for (const attr of product.attributes) {
        if (!itemVariation[attr.name]) {
          dispatch(showToast(`Veuillez sélectionner une ${attr.name.toLowerCase()}`));
          return;
        }
      }
    }

    const result = await dispatch(
      addProductToCart({
        productId: product.id,
        quantity: 1,
        variation: itemVariation,
      }),
    );
    if (addProductToCart.fulfilled.match(result)) {
      dispatch(showToast(`${product.name} ajouté au panier`));
      onClose();
    } else {
      dispatch(showToast(result.payload || t("product.addError")));
    }
  };

  const stopPropagation = (e) => e.stopPropagation();

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={stopPropagation}>
        <button className="close-btn" onClick={onClose} aria-label={t("common.close")}>
          ✕
        </button>

        <div className="modal-img-container">
          <img
            src={product.images[0]?.src || "https://placeholder.pics/svg/300"}
            alt={product.name}
            className="modal-img"
          />
        </div>

        <div className="modal-txt-container">
          <div className="modal-category">
            {product.category} · {t("product.reference")} {product.slug}
          </div>

          <h2 className="modal-title">{product.name}</h2>

          <div className="modal-price">
            {formatModalPrice(product.prices?.price, product.prices?.currency_code)}
          </div>

          <div
            className={`modal-description ${descriptionNeedsScroll ? "modal-description--scrollable" : ""}`}
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(product.short_description) }}
          />

          {product.attributes && product.attributes.length > 0 && (
            <div className="modal-attributes">
              {product.attributes.map((attr) => {
                const options = attr.options || (attr.terms?.map(t => t.name) || []);
                return (
                  <div key={attr.name} className="modal-attribute-group">
                    <label htmlFor={attr.name} className="modal-attribute-label">
                      {attr.name}
                    </label>
                    <select
                      id={attr.name}
                      value={itemVariation[attr.name] || ""}
                      onChange={(e) =>
                        setItemVariation((prev) => ({
                          ...prev,
                          [attr.name]: e.target.value,
                        }))
                      }
                      className="modal-attribute-select"
                    >
                      <option value="">{t("product.chooseOption")}</option>
                      {options?.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>
                );
              })}
            </div>
          )}

          <button className="add-btn" onClick={handleAddToCart}>
            {t("product.addToCart")}
          </button>
        </div>
      </div>
    </div>
  );
}
