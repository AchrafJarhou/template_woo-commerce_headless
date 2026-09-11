import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCurrentCustomerThunk,
  updateCurrentCustomerThunk,
  fetchCurrentUserOrdersThunk,
} from "../../../thunkActionsCreator/userThunks";
import { showToast } from "../../../slices/toastSlice";
import { useTranslation } from "react-i18next";

export default function AddressBook() {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const customer = useSelector((state) => state.user.customer);
  const orders = useSelector((state) => state.user.orders || []);

  // Charger les infos client et les commandes au montage
  useEffect(() => {
    dispatch(fetchCurrentCustomerThunk());
    dispatch(fetchCurrentUserOrdersThunk());
  }, [dispatch]);

  // Vérifier si l'utilisateur a des commandes payées
  const paidOrders = orders.filter(
    (order) => order.status === "processing" || order.status === "completed",
  );
  const hasOrders = paidOrders.length > 0;

  // --- ÉTATS POUR L'ADRESSE DE LIVRAISON ---
  const [isEditingShipping, setIsEditingShipping] = useState(false);
  const [shippingData, setShippingData] = useState({
    firstName: "",
    lastName: "",
    address_1: "",
    city: "",
    postcode: "",
    phone: "",
  });
  const [savedShipping, setSavedShipping] = useState(shippingData);

  // --- ÉTATS POUR L'ADRESSE DE FACTURATION ---
  const [hasSeparateBilling, setHasSeparateBilling] = useState(false);
  const [isEditingBilling, setIsEditingBilling] = useState(false);
  const [billingData, setBillingData] = useState({
    firstName: "",
    lastName: "",
    address_1: "",
    city: "",
    postcode: "",
    phone: "",
  });
  const [savedBilling, setSavedBilling] = useState(billingData);

  // Synchronisation initiale avec les données reçues de l'API /wp-json/custom/v1/customer
  useEffect(() => {
    if (customer && !isEditingShipping && !isEditingBilling) {
      if (customer.shipping && customer.shipping.address1) {
        const ship = {
          firstName: customer.shipping.firstName || "",
          lastName: customer.shipping.lastName || "",
          address_1: customer.shipping.address1 || "",
          city: customer.shipping.city || "",
          postcode: customer.shipping.postcode || "",
          phone: customer.shipping.phone || "",
        };
        setShippingData(ship);
        setSavedShipping(ship);
      }

      if (customer.billing && customer.billing.address1) {
        const bill = {
          firstName: customer.billing.firstName || "",
          lastName: customer.billing.lastName || "",
          address_1: customer.billing.address1 || "",
          city: customer.billing.city || "",
          postcode: customer.billing.postcode || "",
          phone: customer.billing.phone || "",
        };
        setBillingData(bill);
        setSavedBilling(bill);
        setHasSeparateBilling(true);
      }
    }
  }, [customer, isEditingShipping, isEditingBilling]);

  const handleShippingChange = (e) => {
    const { name, value } = e.target;
    setShippingData((prev) => ({ ...prev, [name]: value }));
  };

  const handleShippingSave = () => {
    dispatch(updateCurrentCustomerThunk({ shipping: shippingData }))
      .unwrap()
      .then(() => {
        dispatch(showToast("Adresse de livraison mise à jour avec succès."));
        setSavedShipping(shippingData);
        setIsEditingShipping(false);
      })
      .catch((err) => {
        dispatch(showToast(err || "Erreur lors de la mise à jour."));
      });
  };

  const handleShippingCancel = () => {
    setShippingData(savedShipping);
    setIsEditingShipping(false);
  };

  const handleBillingChange = (e) => {
    const { name, value } = e.target;
    setBillingData((prev) => ({ ...prev, [name]: value }));
  };

  const handleBillingSave = () => {
    dispatch(updateCurrentCustomerThunk({ billing: billingData }))
      .unwrap()
      .then(() => {
        dispatch(showToast("Adresse de facturation mise à jour avec succès."));
        setSavedBilling(billingData);
        setIsEditingBilling(false);
      })
      .catch((err) => {
        dispatch(showToast(err || "Erreur lors de la mise à jour."));
      });
  };

  const handleBillingCancel = () => {
    setBillingData(savedBilling);
    setIsEditingBilling(false);
    if (!savedBilling.address_1) {
      setHasSeparateBilling(false);
    }
  };

  const handleAddBilling = () => {
    setHasSeparateBilling(true);
    setIsEditingBilling(true);
  };

  // L'adresse de livraison est considérée comme vide s'il n'y a pas d'adresse enregistrée
  const isShippingEmpty = !shippingData.address_1 && !hasOrders;

  return (
    <div>
      {/* =========================================
          SECTION : ADRESSE DE LIVRAISON
      ========================================= */}
      <h2 className="section-title">Adresse de Livraison (Par défaut)</h2>

      {isShippingEmpty ? (
        <p
          className="facturation-text"
          style={{ marginBottom: "20px", opacity: 0.8 }}
        >
          Vous n'avez pas encore d'adresse de livraison enregistrée. Elle sera
          automatiquement ajoutée lors de votre première commande.
        </p>
      ) : (
        <div className="data-grid">
          <div className="data-item">
            <span className="data-label">Prénom & Nom</span>
            {isEditingShipping ? (
              <div style={{ display: "flex", gap: "10px" }}>
                <input
                  type="text"
                  name="firstName"
                  value={shippingData.firstName}
                  onChange={handleShippingChange}
                  className="data-input"
                  placeholder="Prénom"
                />
                <input
                  type="text"
                  name="lastName"
                  value={shippingData.lastName}
                  onChange={handleShippingChange}
                  className="data-input"
                  placeholder="Nom"
                />
              </div>
            ) : (
              <span className="data-value">
                {shippingData.firstName} {shippingData.lastName}
              </span>
            )}
          </div>

          <div className="data-item">
            <span className="data-label">Adresse</span>
            {isEditingShipping ? (
              <input
                type="text"
                name="address_1"
                value={shippingData.address_1}
                onChange={handleShippingChange}
                className="data-input"
              />
            ) : (
              <span className="data-value">{shippingData.address_1}</span>
            )}
          </div>

          <div className="data-item">
            <span className="data-label">Code Postal & Ville</span>
            {isEditingShipping ? (
              <div style={{ display: "flex", gap: "10px" }}>
                <input
                  type="text"
                  name="postcode"
                  value={shippingData.postcode}
                  onChange={handleShippingChange}
                  className="data-input"
                  placeholder="Code postal"
                />
                <input
                  type="text"
                  name="city"
                  value={shippingData.city}
                  onChange={handleShippingChange}
                  className="data-input"
                  placeholder="Ville"
                />
              </div>
            ) : (
              <span className="data-value">
                {shippingData.postcode} {shippingData.city}
              </span>
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
              <span className="data-value">
                {shippingData.phone || "Non renseigné"}
              </span>
            )}
          </div>
        </div>
      )}

      <div className="action-buttons">
        {isEditingShipping ? (
          <>
            <button className="action-btn" onClick={handleShippingSave}>
              {t("common.save")}
            </button>
            <button
              className="action-btn outline"
              onClick={handleShippingCancel}
            >
              {t("common.cancel")}
            </button>
          </>
        ) : (
          <button
            className="action-btn"
            onClick={() => setIsEditingShipping(true)}
          >
            {isShippingEmpty
              ? "Ajouter une adresse de livraison"
              : "Modifier l'adresse"}
          </button>
        )}
      </div>

      {/* =========================================
          SECTION : ADRESSE DE FACTURATION
      ========================================= */}
      <h2
        className="section-title facturation-title"
        style={{ marginTop: "60px" }}
      >
        Adresse de Facturation
      </h2>

      {!hasSeparateBilling ? (
        <>
          <p className="facturation-text">
            {hasOrders
              ? "Identique à l'adresse de livraison."
              : "Aucune adresse de facturation spécifique enregistrée."}
          </p>
          <div className="action-buttons">
            <button className="action-btn outline" onClick={handleAddBilling}>
              {t("address.addBilling")}
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="data-grid">
            <div className="data-item">
              <span className="data-label">Prénom & Nom</span>
              {isEditingBilling ? (
                <div style={{ display: "flex", gap: "10px" }}>
                  <input
                    type="text"
                    name="firstName"
                    value={billingData.firstName}
                    onChange={handleBillingChange}
                    className="data-input"
                    placeholder="Prénom"
                  />
                  <input
                    type="text"
                    name="lastName"
                    value={billingData.lastName}
                    onChange={handleBillingChange}
                    className="data-input"
                    placeholder="Nom"
                  />
                </div>
              ) : (
                <span className="data-value">
                  {billingData.firstName} {billingData.lastName}
                </span>
              )}
            </div>

            <div className="data-item">
              <span className="data-label">{t("address.street")}</span>
              {isEditingBilling ? (
                <input
                  type="text"
                  name="address_1"
                  value={billingData.address_1}
                  onChange={handleBillingChange}
                  className="data-input"
                />
              ) : (
                <span className="data-value">{billingData.address_1}</span>
              )}
            </div>

            <div className="data-item">
              <span className="data-label">Code Postal & Ville</span>
              {isEditingBilling ? (
                <div style={{ display: "flex", gap: "10px" }}>
                  <input
                    type="text"
                    name="postcode"
                    value={billingData.postcode}
                    onChange={handleBillingChange}
                    className="data-input"
                    placeholder="Code postal"
                  />
                  <input
                    type="text"
                    name="city"
                    value={billingData.city}
                    onChange={handleBillingChange}
                    className="data-input"
                    placeholder="Ville"
                  />
                </div>
              ) : (
                <span className="data-value">
                  {billingData.postcode} {billingData.city}
                </span>
              )}
            </div>

            <div className="data-item">
              <span className="data-label">{t("address.phone")}</span>
              {isEditingBilling ? (
                <input
                  type="tel"
                  name="phone"
                  value={billingData.phone}
                  onChange={handleBillingChange}
                  className="data-input"
                />
              ) : (
                <span className="data-value">
                  {billingData.phone || "Non renseigné"}
                </span>
              )}
            </div>
          </div>

          <div className="action-buttons">
            {isEditingBilling ? (
              <>
                <button className="action-btn" onClick={handleBillingSave}>
                  {t("common.save")}
                </button>
                <button
                  className="action-btn outline"
                  onClick={handleBillingCancel}
                >
                  {t("common.cancel")}
                </button>
              </>
            ) : (
              <button
                className="action-btn"
                onClick={() => setIsEditingBilling(true)}
              >
                {t("address.editAddress")}
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
