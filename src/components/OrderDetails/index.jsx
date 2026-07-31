import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import SucessMessage from "../SucessMessage";

export default function OrderDetails({ order }) {
  if (!order) {
    return <p>Aucune commande trouvée.</p>;
  }

  const isPaid = ["processing", "completed"].includes(order.status);
  const orderRef = order.number ?? order.id;

  return (
    <div>
      <p className={isPaid ? "payment-ok" : "payment-pending"}>
        {isPaid
          ? `Paiement confirmé pour la commande n°${orderRef}`
          : `Paiement en attente de confirmation pour la commande n°${orderRef}`}
      </p>
      <SucessMessage order={order} />
    </div>
  );
}

function ShippingAddress({ address }) {
  if (!address) {
    return <p>Aucune adresse de livraison.</p>;
  }

  return (
    <div>
      <p>
        {address.first_name} {address.last_name}
      </p>
      <p>{address.address_1}</p>
      {address.address_2 && <p>{address.address_2}</p>}
      <p>
        {address.postcode} {address.city}
      </p>
      <p>
        {address.state} {address.country}
      </p>
    </div>
  );
}

function OrderFullDetails({ orderId }) {
  const token = useSelector((state) => state.user.token);
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchOrder() {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/wp-json/wc/store/v1/order/${orderId}`,
          { headers: { Authorization: `Bearer ${token}` } },
        );
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || "Impossible de recuperer la commande.");
        }
        if (!cancelled) setDetail(data);
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchOrder();
    return () => {
      cancelled = true;
    };
  }, [orderId, token]);

  if (loading) return <p>Chargement...</p>;
  if (error) return <p>{error}</p>;
  if (!detail) return null;

  return (
    <div>
      <ul className="order-items">
        {detail.items.map((item) => (
          <li key={item.id} className="order-item">
            {item.images?.[0] && (
              <img
                src={item.images[0].thumbnail}
                alt={item.images[0].alt || item.name}
                width={64}
                height={64}
              />
            )}
            <div>
              <p>{item.name}</p>
              <p>Quantité : {item.quantity}</p>
              <p>Prix : {(Number(item.totals.line_total) / 100).toFixed(2)} €</p>
            </div>
          </li>
        ))}
      </ul>

      <h3>Livraison</h3>
      <ShippingAddress address={detail.shipping_address} />
      <p>
        Frais de livraison :{" "}
        {(Number(detail.totals.total_shipping) / 100).toFixed(2)} €
      </p>
    </div>
  );
}

function OrderHistoryItem({ order }) {
  const [showDetails, setShowDetails] = useState(false);
  const orderRef = order.number ?? order.id;
  const orderDate = order.date
    ? new Date(order.date).toLocaleDateString("fr-FR")
    : null;

  return (
    <div>
      <p>
        Commande n°{orderRef}
        {orderDate && ` — ${orderDate}`}
      </p>
      <button type="button" onClick={() => setShowDetails((prev) => !prev)}>
        {showDetails ? "Voir moins" : "Voir plus"}
      </button>
      {showDetails && <OrderFullDetails orderId={order.id} />}
    </div>
  );
}

export function OrderAll() {
  const orders = useSelector((state) => state.user.orders);

  if (!orders || orders.length === 0) {
    return <p>Aucune commande trouvée.</p>;
  }

  const sortedOrders = [...orders].sort(
    (a, b) => new Date(b.date) - new Date(a.date),
  );

  return (
    <div>
      {sortedOrders.map((order) => (
        <OrderHistoryItem key={order.id} order={order} />
      ))}
    </div>
  );
}