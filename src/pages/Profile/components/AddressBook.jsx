import React, { useState } from "react";

export default function AddressBook() {
  // --- ÉTATS POUR L'ADRESSE DE LIVRAISON ---
  const initialShipping = {
    name: "Jean Dupont",
    address: "10 Rue de la Paix",
    city: "75001 Paris",
    phone: "+33 6 12 34 56 78",
  };

  const [isEditingShipping, setIsEditingShipping] = useState(false);
  const [shippingData, setShippingData] = useState(initialShipping);
  const [savedShipping, setSavedShipping] = useState(initialShipping);

  const handleShippingChange = (e) => {
    const { name, value } = e.target;
    setShippingData((prev) => ({ ...prev, [name]: value }));
  };

  const handleShippingSave = () => {
    setSavedShipping(shippingData);
    setIsEditingShipping(false);
  };

  const handleShippingCancel = () => {
    setShippingData(savedShipping);
    setIsEditingShipping(false);
  };

  // --- ÉTATS POUR L'ADRESSE DE FACTURATION ---
  const initialBilling = {
    name: "",
    address: "",
    city: "",
    phone: "",
  };

  const [hasSeparateBilling, setHasSeparateBilling] = useState(false);
  const [isEditingBilling, setIsEditingBilling] = useState(false);
  const [billingData, setBillingData] = useState(initialBilling);
  const [savedBilling, setSavedBilling] = useState(initialBilling);

  const handleBillingChange = (e) => {
    const { name, value } = e.target;
    setBillingData((prev) => ({ ...prev, [name]: value }));
  };

  const handleBillingSave = () => {
    setSavedBilling(billingData);
    setIsEditingBilling(false);
  };

  const handleBillingCancel = () => {
    setBillingData(savedBilling);
    setIsEditingBilling(false);
    // Si on annule alors qu'aucune adresse de facturation n'avait été enregistrée avant, on repasse en mode "identique"
    if (!savedBilling.name) {
      setHasSeparateBilling(false);
    }
  };

  const handleAddBilling = () => {
    setHasSeparateBilling(true);
    setIsEditingBilling(true);
  };

  return (
    <div>
      {/* =========================================
          SECTION : ADRESSE DE LIVRAISON
      ========================================= */}
      <h2 className="section-title">Adresse de Livraison (Par défaut)</h2>
      <div className="data-grid">
        <div className="data-item">
          <span className="data-label">Nom Complet</span>
          {isEditingShipping ? (
            <input
              type="text"
              name="name"
              value={shippingData.name}
              onChange={handleShippingChange}
              className="data-input"
            />
          ) : (
            <span className="data-value">{shippingData.name}</span>
          )}
        </div>

        <div className="data-item">
          <span className="data-label">Adresse</span>
          {isEditingShipping ? (
            <input
              type="text"
              name="address"
              value={shippingData.address}
              onChange={handleShippingChange}
              className="data-input"
            />
          ) : (
            <span className="data-value">{shippingData.address}</span>
          )}
        </div>

        <div className="data-item">
          <span className="data-label">Ville & Code Postal</span>
          {isEditingShipping ? (
            <input
              type="text"
              name="city"
              value={shippingData.city}
              onChange={handleShippingChange}
              className="data-input"
            />
          ) : (
            <span className="data-value">{shippingData.city}</span>
          )}
        </div>

        <div className="data-item">
          <span className="data-label">Téléphone</span>
          {isEditingShipping ? (
            <input
              type="tel"
              name="phone"
              value={shippingData.phone}
              onChange={handleShippingChange}
              className="data-input"
            />
          ) : (
            <span className="data-value">{shippingData.phone}</span>
          )}
        </div>
      </div>

      <div className="action-buttons">
        {isEditingShipping ? (
          <>
            <button className="action-btn" onClick={handleShippingSave}>
              Enregistrer
            </button>
            <button
              className="action-btn outline"
              onClick={handleShippingCancel}
            >
              Annuler
            </button>
          </>
        ) : (
          <button
            className="action-btn"
            onClick={() => setIsEditingShipping(true)}
          >
            Modifier l'adresse
          </button>
        )}
      </div>

      {/* =========================================
          SECTION : ADRESSE DE FACTURATION
      ========================================= */}
      <h2 className="section-title facturation-title">
        Adresse de Facturation
      </h2>

      {!hasSeparateBilling ? (
        <>
          <p className="facturation-text">
            Identique à l'adresse de livraison.
          </p>
          <div className="action-buttons">
            <button className="action-btn outline" onClick={handleAddBilling}>
              Ajouter une adresse de facturation
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="data-grid">
            <div className="data-item">
              <span className="data-label">Nom Complet</span>
              {isEditingBilling ? (
                <input
                  type="text"
                  name="name"
                  value={billingData.name}
                  onChange={handleBillingChange}
                  className="data-input"
                  placeholder="Jean Dupont"
                />
              ) : (
                <span className="data-value">{billingData.name}</span>
              )}
            </div>

            <div className="data-item">
              <span className="data-label">Adresse</span>
              {isEditingBilling ? (
                <input
                  type="text"
                  name="address"
                  value={billingData.address}
                  onChange={handleBillingChange}
                  className="data-input"
                  placeholder="10 Rue de la Paix"
                />
              ) : (
                <span className="data-value">{billingData.address}</span>
              )}
            </div>

            <div className="data-item">
              <span className="data-label">Ville & Code Postal</span>
              {isEditingBilling ? (
                <input
                  type="text"
                  name="city"
                  value={billingData.city}
                  onChange={handleBillingChange}
                  className="data-input"
                  placeholder="75001 Paris"
                />
              ) : (
                <span className="data-value">{billingData.city}</span>
              )}
            </div>

            <div className="data-item">
              <span className="data-label">Téléphone</span>
              {isEditingBilling ? (
                <input
                  type="tel"
                  name="phone"
                  value={billingData.phone}
                  onChange={handleBillingChange}
                  className="data-input"
                  placeholder="+33 6 12 34 56 78"
                />
              ) : (
                <span className="data-value">{billingData.phone}</span>
              )}
            </div>
          </div>

          <div className="action-buttons">
            {isEditingBilling ? (
              <>
                <button className="action-btn" onClick={handleBillingSave}>
                  Enregistrer
                </button>
                <button
                  className="action-btn outline"
                  onClick={handleBillingCancel}
                >
                  Annuler
                </button>
              </>
            ) : (
              <button
                className="action-btn"
                onClick={() => setIsEditingBilling(true)}
              >
                Modifier l'adresse
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
