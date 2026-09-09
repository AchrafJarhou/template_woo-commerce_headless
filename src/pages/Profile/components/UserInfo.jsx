import React, { useState } from "react";

export default function UserInfo() {
  const initialUser = {
    firstName: "Jean",
    lastName: "Dupont",
    email: "jean.dupont@example.com",
    password: "••••••••",
  };

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(initialUser);
  // Sauvegarde l'état validé pour pouvoir l'annuler
  const [savedUser, setSavedUser] = useState(initialUser);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    console.log("Sauvegarde des données:", formData);
    setSavedUser(formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData(savedUser); // Restaure les anciennes données
    setIsEditing(false);
  };

  return (
    <div>
      <h2 className="section-title">Informations Personnelles</h2>
      <div className="data-grid">
        <div className="data-item">
          <span className="data-label">Prénom</span>
          {isEditing ? (
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="data-input"
            />
          ) : (
            <span className="data-value">{formData.firstName}</span>
          )}
        </div>

        <div className="data-item">
          <span className="data-label">Nom</span>
          {isEditing ? (
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="data-input"
            />
          ) : (
            <span className="data-value">{formData.lastName}</span>
          )}
        </div>

        <div className="data-item">
          <span className="data-label">E-mail</span>
          {isEditing ? (
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="data-input"
            />
          ) : (
            <span className="data-value">{formData.email}</span>
          )}
        </div>

        <div className="data-item">
          <span className="data-label">Mot de passe</span>
          {isEditing ? (
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="data-input"
            />
          ) : (
            <span className="data-value">{formData.password}</span>
          )}
        </div>
      </div>

      <div className="action-buttons">
        {isEditing ? (
          <>
            <button className="action-btn" onClick={handleSave}>
              Enregistrer
            </button>
            <button className="action-btn outline" onClick={handleCancel}>
              Annuler
            </button>
          </>
        ) : (
          <button className="action-btn" onClick={() => setIsEditing(true)}>
            Modifier mes informations
          </button>
        )}
      </div>
    </div>
  );
}
