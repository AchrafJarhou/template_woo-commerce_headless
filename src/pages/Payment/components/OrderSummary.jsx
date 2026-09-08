export function OrderSummary({ items, totals }) {
  return (
    <div className="payment__summary">
      <h3 className="payment__summary-title">Résumé de la commande</h3>

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
          <span>Sous-total</span>
          <span>{totals.subtotal}</span>
        </div>
        <div className="payment__total-row">
          <span>Livraison</span>
          <span>{totals.shipping}</span>
        </div>
        <div className="payment__total-row">
          <span>Taxes</span>
          <span>{totals.tax}</span>
        </div>
        <div className="payment__total-row payment__total-row--final">
          <span>Total</span>
          <span>{totals.total}</span>
        </div>
      </div>
    </div>
  );
}
