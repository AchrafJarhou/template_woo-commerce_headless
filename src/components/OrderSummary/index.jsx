import React from "react";
import { formatPrice, formatAmount } from "../../utils/formatPrice";
import { useTranslation } from "react-i18next";

export default function OrderSummary({ items, totals, shippingCost }) {
  const { t } = useTranslation();

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
                <span>{t("cart.quantity")} : {item.quantity}</span>
              </div>
            </div>
            {/* Le line_total inclut déjà la multiplication par la quantité */}
            <div className="cart-item-price">
              {formatPrice(item.totals.line_total, item.totals)}
            </div>
          </div>
        ))}
      </div>

      <dl className="cart__summary">
        <div className="cart__summary-row">
          <dt>{t("cart.subtotal", { count: itemCount })}</dt>
          <dd>{formatPrice(totals.total_items, totals)}</dd>
        </div>

        <div className="cart__summary-row">
          <dt>{t("cart.shipping")}</dt>
          <dd>
            {shippingCost === 0
              ? t("cart.shippingTbd")
              : formatAmount(shippingCost, totals.currency_code)}
          </dd>
        </div>

        <div className="cart__summary-row cart__summary-row--total">
          <dt>{t("cart.total")}</dt>
          <dd>{formatAmount(finalTotal, totals.currency_code)}</dd>
        </div>
      </dl>
    </aside>
  );
}
