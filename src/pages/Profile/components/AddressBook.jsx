import React from "react";

export default function AddressBook() {
  const shipping = {
    name: "Jean Dupont",
    address: "10 Rue de la Paix",
    city: "75001 Paris",
    country: "France",
    phone: "+33 6 12 34 56 78",
  };

  return (
    <div>
      <h2 className="section-title">Adresse de Livraison (Par défaut)</h2>
      <div className="data-grid">
        <div className="data-item">
          <span className="data-label">Nom Complet</span>
          <span className="data-value">{shipping.name}</span>
        </div>
        <div className="data-item">
          <span className="data-label">Adresse</span>
          <span className="data-value">{shipping.address}</span>
        </div>
        <div className="data-item">
          <span className="data-label">Ville & Code Postal</span>
          <span className="data-value">{shipping.city}</span>
        </div>
        <div className="data-item">
          <span className="data-label">Téléphone</span>
          <span className="data-value">{shipping.phone}</span>
        </div>
      </div>
      <button className="action-btn">Modifier l'adresse</button>

      <h2 className="section-title" style={{ marginTop: "40px" }}>
        Adresse de Facturation
      </h2>
      <p style={{ fontSize: "14px", marginBottom: "20px" }}>
        Identique à l'adresse de livraison.
      </p>
      <button className="action-btn outline">
        Ajouter une adresse de facturation
      </button>
    </div>
  );
}
