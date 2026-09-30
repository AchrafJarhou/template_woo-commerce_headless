import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import DOMPurify from "dompurify";
import { addProductToCart } from "../../thunkActionsCreator/cartThunks";
import { showToast } from "../../slices/toastSlice";
import "./index.css";
import { formatPrice } from "../../utils/formatPrice";
import { useTranslation } from "react-i18next";
import {
  getAttributeOptions,
  getDefaultSelection,
  getDisplayPrices,
  getLowStockRemaining,
  getVariationAttributes,
  isOptionInStock,
  isSelectionInStock,
} from "../../utils/variationStock";

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

  const variationAttributes = getVariationAttributes(product);

  useEffect(() => {
    if (!product) return;
    setItemVariation(getDefaultSelection(product));
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
    if (variationAttributes.length > 0) {
      for (const attr of variationAttributes) {
        if (!itemVariation[attr.name]) {
          dispatch(
            showToast(`Veuillez sélectionner une ${attr.name.toLowerCase()}`),
          );
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

  const isInStock = isSelectionInStock(product, itemVariation);
  const lowStockRemaining = getLowStockRemaining(product, itemVariation);

  const displayPrices = getDisplayPrices(product, itemVariation);
  const currencyCode = product.prices?.currency_code;
  const formattedPrice = formatModalPrice(displayPrices.price, currencyCode);
  const isOnSale =
    Number(displayPrices.regular_price) > Number(displayPrices.price);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={stopPropagation}>
        <button
          className="close-btn"
          onClick={onClose}
          aria-label={t("common.close")}
        >
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
            {t("product.reference")} {product.slug}
          </div>

          <h2 className="modal-title">{product.name}</h2>

          <div className="modal-price">
            {isOnSale && (
              <del className="modal-price__regular">
                {formatModalPrice(displayPrices.regular_price, currencyCode)}
              </del>
            )}
            {displayPrices.isFrom
              ? t("product.priceFrom", { price: formattedPrice })
              : formattedPrice}
          </div>

          <div
            className={`modal-description ${descriptionNeedsScroll ? "modal-description--scrollable" : ""}`}
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(product.short_description),
            }}
          />

          {variationAttributes.length > 0 && (
            <div className="modal-attributes">
              {variationAttributes.map((attr) => (
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
                    {getAttributeOptions(attr).map((option) => {
                      const available = isOptionInStock(
                        product,
                        attr.name,
                        option.slug,
                        itemVariation,
                      );
                      return (
                        <option
                          key={option.slug}
                          value={option.slug}
                          disabled={!available}
                        >
                          {available
                            ? option.name
                            : `${option.name} — ${t("product.outOfStock")}`}
                        </option>
                      );
                    })}
                  </select>
                </div>
              ))}
            </div>
          )}

          {isInStock && lowStockRemaining && (
            <p className="modal-low-stock">
              {t("product.lowStock", { count: lowStockRemaining })}
            </p>
          )}

          {isInStock ? (
            <button className="add-btn" onClick={handleAddToCart}>
              {t("product.addToCart")}
            </button>
          ) : (
            <button className="add-btn" disabled>
              {t("product.outOfStock")}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
