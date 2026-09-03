import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { addProductToCart } from "../../thunkActionsCreator/cartThunks";
import { showToast } from "../../slices/toastSlice";
import "./index.css";

export default function ProductModal({ product, onClose }) {
  const dispatch = useDispatch();
  const [itemVariation, setItemVariation] = useState({});

  const formatPrice = (priceInCents, currencyCode) => {
    if (!priceInCents) return "Prix sur demande";
    const priceInUnits = parseFloat(priceInCents) / 100;
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: currencyCode || "EUR",
    }).format(priceInUnits);
  };

  useEffect(() => {
    if (!product || !product.attributes) return;
    const defaults = {};
    product.attributes.forEach((attribute) => {
      if (attribute.options && attribute.options.length > 0) {
        defaults[attribute.name] = attribute.options[0];
      }
    });
    setItemVariation(defaults);
  }, [product]);

  const handleAddToCart = async () => {
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
      dispatch(showToast(result.payload || "Erreur lors de l'ajout au panier"));
    }
  };

  const stopPropagation = (e) => e.stopPropagation();

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={stopPropagation}>
        <button className="close-btn" onClick={onClose}>
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
            {product.category} · RÉF. {product.slug}
          </div>

          <h2 className="modal-title">{product.name}</h2>

          <div className="modal-price">
            {formatPrice(product.prices?.price, product.prices?.currency_code)}
          </div>

          <div
            className="modal-description"
            dangerouslySetInnerHTML={{ __html: product.short_description }}
          />

          <div className="modal-attributes">
            {product.attributes?.map((attr) => (
              <span key={attr.name} className="modal-attribute-item">
                <strong>{attr.name}</strong>
                {itemVariation[attr.name] || attr.options[0]}
              </span>
            ))}
          </div>

          <button className="add-btn" onClick={handleAddToCart}>
            Ajouter au panier
          </button>
        </div>
      </div>
    </div>
  );
}
