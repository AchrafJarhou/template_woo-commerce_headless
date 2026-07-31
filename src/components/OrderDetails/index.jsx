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
