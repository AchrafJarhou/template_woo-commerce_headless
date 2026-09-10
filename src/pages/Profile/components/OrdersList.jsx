import React, { useEffect } from "react"; // 1. Ajoute useEffect
import { useSelector, useDispatch } from "react-redux"; // 2. Ajoute useDispatch
import { fetchCurrentUserOrdersThunk } from "../../../thunkActionsCreator/userThunks"; // 3. Importe le thunk
import { formatStatus } from "../../../utils/formatStatus";

export default function OrdersList() {
  const dispatch = useDispatch();
  const orders = useSelector((state) => state.user.orders);

  console.log("orders :", orders);

  const paidOrders = orders.filter(
    (order) => order.status === "processing" || order.status === "completed",
  );

  useEffect(() => {
    dispatch(fetchCurrentUserOrdersThunk());
  }, [dispatch]);

  // Fonction de formatage des prix
  const formatPrice = (price, minorUnit = 2) => {
    if (!price) return "0,00 €";
    const numericPrice =
      Number(price) > 10000
        ? Number(price) / Math.pow(10, minorUnit)
        : Number(price);
    return `${numericPrice.toFixed(2).replace(".", ",")} €`;
  };

  if (!paidOrders || paidOrders.length === 0) {
    return (
      <div>
        <h2 className="section-title">Mes Commandes</h2>
        <p className="facturation-text">Aucune commande trouvée.</p>
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
                <div className="order-date">
                  {order.date &&
                    new Date(order.date).toLocaleDateString("fr-FR")}
                </div>
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
                      <p>Prix total: {formatPrice(item.total, 2)}</p>
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
