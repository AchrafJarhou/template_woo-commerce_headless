import StatusBadge from "../StatusBadge";
import { formatAmount } from "../../utils/formatPrice";
import { useTranslation } from "react-i18next";

export default function SuccessMessage({ order }) {
  const { t } = useTranslation();

  if (!order) {
    return null;
  }

  return (
    <div className="order-details">
      <p>Commande Numéro : {order.number ?? order.id}</p>

      {order.status && (
        <p>
          {t("order.status")} : <StatusBadge status={order.status} />
        </p>
      )}

      <ul className="order-items">
        {order.items.map((item) => (
          <li key={item.name} className="order-item">
            <div>
              <p>{item.name}</p>
              <p>Quantité : {item.quantity}</p>
              <p>Prix : {Number(item.total).toFixed(2)} €</p>
            </div>
          </li>
        ))}
      </ul>

      <p>
        <strong>{t("cart.total")} : {formatAmount(order.total)}</strong>
      </p>
    </div>
  );
}