import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import SucessMessage from "../SucessMessage";

const ordersCache = {};

export default function OrderDetails({ order = null, orderId = null }) {
  const token = useSelector((state) => state.user.token);

  const [detail, setDetail] = useState(
    orderId ? ordersCache[orderId] : null
  );

  const [loading, setLoading] = useState(
    Boolean(!order && orderId && !ordersCache[orderId])
  );

  const [error, setError] = useState("");

  useEffect(() => {
    if (order || !orderId || ordersCache[orderId]) return;

    let cancelled = false;

    // Fetch order details from the API
    async function fetchOrder() {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/wp-json/wc/store/v1/order/${orderId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok)
          throw new Error(
            data.message || "Impossible de récupérer la commande."
          );

        ordersCache[orderId] = data;

        if (cancelled) return;

        setDetail(data);
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchOrder();

    return () => (cancelled = true);
  }, [order, orderId, token]);

  const current = detail || order;

  if (loading) return <p>Chargement...</p>;
  if (error) return <p>{error}</p>;
  if (!current) return null;

  const isPaid = ["processing", "completed"].includes(current.status);
  const label = current.number ?? current.id;
  const statusText = isPaid
    ? `Paiement confirmé pour la commande n°${label}`
    : `Paiement en attente de confirmation pour la commande n°${label}`;

  return (
    <div className="order-details">
      <p className={isPaid ? "payment-ok" : "payment-pending"}>
        {statusText}
      </p>

      {!orderId && <SucessMessage order={current} />}

      {detail && (
        <>
          <h3>Produits</h3>

          <div className="order-items">
            {detail.items?.map((item) => (
              <div key={item.id} className="order-item">
                {item.images?.[0] && (
                  <img
                    src={item.images[0].thumbnail}
                    alt={item.images[0].alt || item.name}
                    width={70}
                  />
                )}

                <div>
                  <strong>{item.name}</strong>

                  <p>Quantité : {item.quantity}</p>

                  <p>
                    {(Number(item.totals.line_total) / 100).toFixed(2)} €
                  </p>
                </div>
              </div>
            ))}
          </div>

          {detail.shipping_address && (
            <>
              <h3>Adresse de livraison</h3>

              <p>
                {detail.shipping_address.first_name}{" "}
                {detail.shipping_address.last_name}
              </p>

              <p>{detail.shipping_address.address_1}</p>

              {detail.shipping_address.address_2 && (
                <p>{detail.shipping_address.address_2}</p>
              )}

              <p>
                {detail.shipping_address.postcode}{" "}
                {detail.shipping_address.city}
              </p>

              <p>
                {detail.shipping_address.state}{" "}
                {detail.shipping_address.country}
              </p>

              <p>
                Livraison :{" "}
                {(Number(detail.totals.total_shipping) / 100).toFixed(2)} €
              </p>
            </>
          )}
        </>
      )}
    </div>
  );
}

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