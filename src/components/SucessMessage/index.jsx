import StatusBadge from "../StatusBadge";

export default function SuccessMessage({ order }) {
  if (!order) {
    return null;
  }

  return (
    <div className="order-details">
      <p>Commande Numéro : {order.number ?? order.id}</p>

      {order.status && (
        <p>
          Statut : <StatusBadge status={order.status} />
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
        <strong>Total : {Number(order.total).toFixed(2)} €</strong>
      </p>
    </div>
  );
}