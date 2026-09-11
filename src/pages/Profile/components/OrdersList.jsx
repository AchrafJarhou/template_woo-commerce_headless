import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { formatDate } from "../../../utils/formatDate";
import { formatAmount } from "../../../utils/formatPrice";
import { formatStatus } from "../../../utils/formatStatus";
import { fetchCurrentUserOrdersThunk } from "../../../thunkActionsCreator/userThunks";
import { useTranslation } from "react-i18next";

export default function OrdersList() {
  const { t } = useTranslation();
  // Récupération des commandes depuis le store Redux
  const dispatch = useDispatch();
  const orders = useSelector((state) => state.user.orders);

  const paidOrders = orders.filter(
    (order) => order.status === "processing" || order.status === "completed",
  );

  useEffect(() => {
    dispatch(fetchCurrentUserOrdersThunk());
  }, [dispatch]);

  // Les commandes renvoient tantôt des centimes, tantôt des euros : on garde
  // l'heuristique d'origine, mais le formatage passe par Intl et suit donc la
  // langue affichée — « 24,99 € » en français, « €24.99 » en anglais.
  const formatOrderPrice = (price) => {
    if (!price) return formatAmount(0);
    const value = Number(price) > 10000 ? Number(price) / 100 : Number(price);
    return formatAmount(value);
  };

  if (!paidOrders || paidOrders.length === 0) {
    return (
      <div>
        <h2 className="section-title">{t("account.myOrders")}</h2>
        <p className="facturation-text">{t("order.none")}</p>
      </div>
    );
  }

  const sortedOrders = [...paidOrders].sort(
    (a, b) => new Date(b.date) - new Date(a.date),
  );

  return (
    <div>
      {sortedOrders.map((order) => {
        const orderItems = order.line_items || order.items || [];

        return (
          <div key={order.id} style={{ marginBottom: "60px" }}>
            <div className="order-history-header">
              <div className="order-data">
                <div className="order-header-main">
                  Commande N° {order.number ?? order.id}
                </div>
                <div className="order-date">{formatDate(order.date)}</div>
              </div>
              <div className="order-header-main">
                statut : {formatStatus(order.status)}
              </div>
            </div>

            <div className="order-list-container">
              {orderItems.map((item, index) => {
                const imageUrl = item.images?.[0]?.thumbnail || item.image?.src;
                const imageAlt = item.images?.[0]?.alt || item.name;

                return (
                  <div key={item.id || index} className="order-product-row">
                    <div className="order-product-image">
                      {imageUrl && <img src={imageUrl} alt={imageAlt} />}
                    </div>

                    <div className="order-product-details">
                      <h3>{item.name}</h3>
                      <p>Quantité : {item.quantity}</p>

                      <br />
                      <p>Prix total: {formatOrderPrice(item.total)}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
