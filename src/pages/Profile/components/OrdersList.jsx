import React from "react";
import { MOCK_CART_ITEMS } from "../../../components/Cart/mockCart";

export default function OrdersList() {
  const formatPrice = (priceString, minorUnit = 2) => {
    const numericPrice = Number(priceString) / Math.pow(10, minorUnit);
    return `${numericPrice.toFixed(2).replace(".", ",")} €`;
  };

  const mockOrder = {
    id: "484854",
    date: "02/04/2026",
    status: "Livré",
    items: MOCK_CART_ITEMS,
  };

  return (
    <div>
      <div className="order-history-header">
        <div className="order-data">
          <div className="order-header-main">Commande N° {mockOrder.id}</div>
          <div className="order-date">{mockOrder.date}</div>
        </div>
        <div className="order-header-main">statut : {mockOrder.status}</div>
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
              <h3>{item.name}</h3>
              <p>ID du produit: {item.id}</p>

              {item.variation?.map((v, i) => (
                <p key={i}>
                  {v.attribute}: {v.value}
                </p>
              ))}

              <br />
              <p>
                Prix d'achat:{" "}
                {formatPrice(
                  item.prices.price,
                  item.prices.currency_minor_unit,
                )}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
