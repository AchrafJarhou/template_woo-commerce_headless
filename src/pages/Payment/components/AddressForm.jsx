export function AddressForm({ title, address, type }) {
  return (
    <div className="payment__address-section">
      <h3 className="payment__section-title">{title}</h3>
      <div className="payment__address-display">
        <div className="payment__address-line">
          <strong>{address.firstName} {address.lastName}</strong>
          {address.company && <span className="payment__address-company">{address.company}</span>}
        </div>
        <div className="payment__address-line">{address.address}</div>
        <div className="payment__address-line">{address.postcode} {address.city}</div>
        <div className="payment__address-line">{address.country}</div>
        <div className="payment__address-line payment__address-contact">
          <span>{address.email}</span>
          <span>{address.phone}</span>
        </div>
      </div>
      <button className="payment__button payment__button--secondary">
        Modifier {type === 'shipping' ? 'adresse de livraison' : 'adresse de facturation'}
      </button>
    </div>
  );
}
