import { useState } from "react";
import { useSelector } from "react-redux";
import OrderDetails from "../OrderDetails";

export function OrderAll() {
  const orders = useSelector((state) => state.user.orders);

  const [opened, setOpened] = useState(null);

  if (!orders?.length) {
    return <p>Aucune commande trouvée.</p>;
  }

  const sortedOrders = [...orders].sort(
    (a, b) => new Date(b.date) - new Date(a.date),
  );

  return (
    <div className="orders-history">
      {sortedOrders.map((order) => (
        <div key={order.id} className="history-order">
          <div className="history-header">
            <div>
              <strong>Commande n°{order.number ?? order.id}</strong>

              <p>
                {order.date &&
                  new Date(order.date).toLocaleDateString("fr-FR")}
              </p>

              <p>{order.status}</p>
            </div>

            <button
              type="button"
              onClick={() =>
                setOpened((prev) => (prev === order.id ? null : order.id))
              }
            >
              {opened === order.id ? "Voir moins" : "Voir plus"}
            </button>
          </div>

          {opened === order.id && (
            <OrderDetails orderId={order.id} />
          )}
        </div>
      ))}
    </div>
  );
}
