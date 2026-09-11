import { useTranslation } from "react-i18next";
export function OrderSummary({ items, totals }) {
  const { t } = useTranslation();
  return (
    <div className="payment__summary">
      <h3 className="payment__summary-title">{t("order.summary")}</h3>

      <div className="payment__items">
        {items.map((item) => (
          <div key={item.id} className="payment__item">
            <img src={item.image} alt={item.name} className="payment__item-image" />
            <div className="payment__item-details">
              <p className="payment__item-name">{item.name}</p>
              <p className="payment__item-qty">Quantité: {item.quantity}</p>
              <p className="payment__item-price">{item.price}</p>
            </div>
            <p className="payment__item-total">{item.total}</p>
          </div>
        ))}
      </div>

      <div className="payment__totals">
        <div className="payment__total-row">
          <span>{t("order.subtotal")}</span>
          <span>{totals.subtotal}</span>
        </div>
        <div className="payment__total-row">
          <span>{t("cart.shipping")}</span>
          <span>{totals.shipping}</span>
        </div>
        <div className="payment__total-row">
          <span>{t("cart.taxes")}</span>
          <span>{totals.tax}</span>
        </div>
        <div className="payment__total-row payment__total-row--final">
          <span>{t("cart.total")}</span>
          <span>{totals.total}</span>
        </div>
      </div>
    </div>
  );
}
