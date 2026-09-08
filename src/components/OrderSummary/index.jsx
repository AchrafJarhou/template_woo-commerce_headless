import React from "react";

export default function OrderSummary({ items, totals, shippingCost }) {
  // Fonction pour convertir les prix API WooCommerce (ex: "54000" -> 540,00 €)
  const formatPrice = (priceString, minorUnit = 2) => {
    const numericPrice = Number(priceString) / Math.pow(10, minorUnit);
    return `${numericPrice.toFixed(2).replace(".", ",")} €`;
  };

  // Calcul du nombre total d'articles
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  // Calcul du total final (Sous-total + Frais de port + Taxes)
  const subtotalNumeric =
    Number(totals.total_items) / Math.pow(10, totals.currency_minor_unit);
  const taxNumeric =
    Number(totals.total_tax) / Math.pow(10, totals.currency_minor_unit);
  const finalTotal = subtotalNumeric + shippingCost + taxNumeric;

  return (
    <aside className="checkout-right">
      <div className="cart-items">
        {items.map((item) => (
          <div key={item.key} className="cart-item">
            <div className="cart-item-info">
              <a href={item.permalink} target="_blank" rel="noreferrer">
                {item.images?.[0] && (
                  <img
                    src={item.images[0].thumbnail}
                    alt={item.images[0].alt || item.name}
                  />
                )}
              </a>
              <div className="cart-item-details">
                <p>{item.name}</p>
                {/* Affichage des variations s'il y en a (ex: Taille: 42) */}
                {item.variation?.map((v, idx) => (
                  <span
                    key={idx}
                    style={{ display: "block", fontSize: "10px", opacity: 0.7 }}
                  >
                    {v.attribute} : {v.value}
                  </span>
                ))}
                <span>QTÉ : {item.quantity}</span>
              </div>
            </div>
            {/* Le line_total inclut déjà la multiplication par la quantité */}
            <div className="cart-item-price">
              {formatPrice(
                item.totals.line_total,
                item.totals.currency_minor_unit,
              )}
            </div>
          </div>
        ))}
      </div>

      <dl className="cart__summary">
        <div className="cart__summary-row">
          <dt>
            Sous-total ({itemCount} article{itemCount > 1 ? "s" : ""})
          </dt>
          <dd>{formatPrice(totals.total_items, totals.currency_minor_unit)}</dd>
        </div>

        <div className="cart__summary-row">
          <dt>Livraison</dt>
          <dd>
            {shippingCost === 0
              ? "À définir"
              : `${shippingCost.toFixed(2).replace(".", ",")} €`}
          </dd>
        </div>

        <div className="cart__summary-row cart__summary-row--total">
          <dt>Total</dt>
          <dd>{`${finalTotal.toFixed(2).replace(".", ",")} €`}</dd>
        </div>
      </dl>
    </aside>
  );
}
