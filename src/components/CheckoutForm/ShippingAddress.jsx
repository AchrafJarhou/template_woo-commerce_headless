export default function ShippingAddress({ address, onChange }) {
  return (
    <>
      <h3>Adresse de livraison</h3>
      <div className="form-group">
        <div className="form-row">
          <div className="input-field">
            <label>Prénom</label>
            <input
              type="text"
              name="first_name"
              value={address.first_name || ""}
              onChange={onChange}
              required
            />
          </div>
          <div className="input-field">
            <label>Nom</label>
            <input
              type="text"
              name="last_name"
              value={address.last_name || ""}
              onChange={onChange}
              required
            />
          </div>
        </div>
        <div className="input-field">
          <label>Adresse</label>
          <input
            type="text"
            name="address_1"
            value={address.address_1 || ""}
            placeholder="Commencez à saisir votre adresse..."
            onChange={onChange}
            required
          />
        </div>
        <div className="form-row">
          <div className="input-field">
            <label>Ville</label>
            <input
              type="text"
              name="city"
              value={address.city || ""}
              onChange={onChange}
              required
            />
          </div>
          <div className="input-field">
            <label>Pays</label>
            <input
              type="text"
              name="country"
              value={address.country || "France"}
              onChange={onChange}
              required
            />
          </div>
        </div>
        <div className="form-row">
          <div className="input-field">
            <label>Code Postal</label>
            <input
              type="text"
              name="postcode"
              value={address.postcode || ""}
              onChange={onChange}
              required
            />
          </div>
          <div className="input-field">
            <label>Téléphone</label>
            <input
              type="tel"
              name="phone"
              value={address.phone || ""}
              onChange={onChange}
            />
          </div>
        </div>
        <div className="input-field">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={address.email || ""}
            onChange={onChange}
            required
          />
        </div>
      </div>
    </>
  );
}
