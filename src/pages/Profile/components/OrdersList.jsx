import React from "react";
import { MOCK_CART_ITEMS } from "../../../components/Cart/mockCart";

export default function OrdersList() {
  // Fonction de formatage des prix WooCommerce
  const formatPrice = (priceString, minorUnit = 2) => {
    const numericPrice = Number(priceString) / Math.pow(10, minorUnit);
    return `${numericPrice.toFixed(2).replace(".", ",")} €`;
  };

  // Mock d'une commande complète contenant vos articles
  const mockOrder = {
    id: "CMD-484854",
    date: "02/04/2026",
    location: "Magasin en ligne",
    items: MOCK_CART_ITEMS,
  };

  return (
    <div>
      <div className="order-history-header">
        <span>{mockOrder.items.length} article(s)</span>
        <span>Filtre ≚</span>
      </div>

      <div className="order-list-container">
        {mockOrder.items.map((item) => (
          <div key={item.key} className="order-product-row">
            <div className="order-product-image">
              {item.images?.[0] && (
                <img
                  src={item.images[0].thumbnail}
                  alt={item.images[0].alt || item.name}
                />
              )}
            </div>

            <div className="order-product-details">
              <div>
                <h3>{item.name}</h3>
                <p>ID du produit: {item.id}</p>

                {/* Affiche "Taille: 42" par exemple */}
                {item.variation?.map((v, i) => (
                  <p key={i}>
                    {v.attribute}: {v.value}
                  </p>
                ))}

                <br />
                <p>Date d'achat: {mockOrder.date}</p>
                <p>Lieu de l'achat: {mockOrder.location}</p>
                <p>
                  Prix d'achat:{" "}
                  {formatPrice(
                    item.prices.price,
                    item.prices.currency_minor_unit,
                  )}
                </p>
              </div>

              <button className="btn-black btn-review">
                Donnez-nous votre avis
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
