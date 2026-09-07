export function OrdersList({ orders }) {
  return (
    <section className="profile__section">
      <h2 className="profile__section-title">Mes Commandes</h2>
      {orders.length > 0 ? (
        <div className="profile__orders">
          {orders.map((order) => (
            <div key={order.id} className="profile__order-card">
              <div className="profile__order-header">
                <div>
                  <p className="profile__order-number">{order.number}</p>
                  <p className="profile__order-date">{order.date}</p>
                </div>
                <span className={`profile__order-status profile__order-status--${order.status === 'Livré' ? 'delivered' : 'pending'}`}>
                  {order.status}
                </span>
              </div>
              <div className="profile__order-footer">
                <p className="profile__order-items">{order.items} article{order.items > 1 ? 's' : ''}</p>
                <p className="profile__order-total">{order.total}</p>
              </div>
              <button className="profile__button profile__button--tertiary">
                Voir les détails
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="profile__empty-state">Aucune commande pour le moment.</p>
      )}
    </section>
  );
}
