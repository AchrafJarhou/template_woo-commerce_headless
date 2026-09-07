export function UserInfo({ user }) {
  return (
    <section className="profile__section">
      <h2 className="profile__section-title">Informations Personnelles</h2>
      <div className="profile__info-grid">
        {Object.entries(user).map(([key, value]) => (
          <div key={key} className="profile__info-item">
            <label className="profile__label">
              {key === 'firstName' ? 'Prénom' : key === 'lastName' ? 'Nom' : key === 'username' ? 'Nom d\'utilisateur' : 'Email'}
            </label>
            <p className="profile__value">{value}</p>
          </div>
        ))}
      </div>
      <button className="profile__button profile__button--primary">
        Modifier mes informations
      </button>
    </section>
  );
}
