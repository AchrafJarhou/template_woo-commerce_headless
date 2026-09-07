export function AddressSection({ title, address }) {
  return (
    <section className="profile__section">
      <h2 className="profile__section-title">{title}</h2>
      <div className="profile__address-grid">
        <div className="profile__address-item">
          {Object.values(address).map((line, i) => (
            <p key={i} className="profile__address-line">{line}</p>
          ))}
        </div>
      </div>
      <button className="profile__button profile__button--secondary">
        Modifier cette adresse
      </button>
    </section>
  );
}
