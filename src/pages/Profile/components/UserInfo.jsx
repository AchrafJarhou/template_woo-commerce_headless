import React from "react";

export default function UserInfo() {
  const user = {
    firstName: "Jean",
    lastName: "Dupont",
    email: "jean.dupont@example.com",
    password: "••••••••",
  };

  return (
    <div>
      <h2 className="section-title">Informations Personnelles</h2>
      <div className="data-grid">
        <div className="data-item">
          <span className="data-label">Prénom</span>
          <span className="data-value">{user.firstName}</span>
        </div>
        <div className="data-item">
          <span className="data-label">Nom</span>
          <span className="data-value">{user.lastName}</span>
        </div>
        <div className="data-item">
          <span className="data-label">E-mail</span>
          <span className="data-value">{user.email}</span>
        </div>
        <div className="data-item">
          <span className="data-label">Mot de passe</span>
          <span className="data-value">{user.password}</span>
        </div>
      </div>
      <button className="action-btn">Modifier mes informations</button>
    </div>
  );
}
