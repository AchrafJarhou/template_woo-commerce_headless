import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useSelector, useDispatch } from "react-redux";
import ShippingAddress from "./ShippingAddress";
import BillingAddress from "./BillingAddress";
import ShippingOptions from "./ShippingOptions";
import { showToast } from "../../slices/toastSlice";
import { emptyCartThunk } from "../../thunkActionsCreator/cartThunks";
import { fetchCurrentCustomerThunk } from "../../thunkActionsCreator/userThunks";
import { useTranslation } from "react-i18next";
import { HOME_CATALOG_PATH } from "../../constants/navigation";
import { buildCheckoutPrefill } from "./checkoutPrefill";

export default function CheckoutForm({ shippingMethod, setShippingMethod }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();
  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);
  const user = useSelector((state) => state.user);

  const [paymentType, setPaymentType] = useState("card");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Chaque champ affiche la saisie du client s'il en a fait une, sinon la
  // valeur connue du compte. Rien n'est recopié dans un état : des données
  // arrivées après l'affichage complètent les champs encore intacts sans
  // jamais écraser ce qui a été tapé, et une déconnexion les retire.
  const prefill = buildCheckoutPrefill(user.customer, user.profile);
  const [shippingEdits, setShippingEdits] = useState({});
  const [billingEdits, setBillingEdits] = useState({});
  const [sameAsBillingChoice, setSameAsBillingChoice] = useState(null);

  const shippingAddress = { ...prefill.shipping, ...shippingEdits };
  const billingAddress = { ...prefill.billing, ...billingEdits };
  const sameAsBilling = sameAsBillingChoice ?? prefill.sameAddress;

  const shippingOptions = [
    { id: "mondial_relay", name: t("checkout.shippingRelay"), price: 4.5 },
    { id: "colissimo", name: t("checkout.shippingStandard"), price: 7.9 },
    { id: "express", name: t("checkout.shippingExpress"), price: 12.9 },
  ];

  // Rechargé à chaque arrivée sur la page, et non seulement s'il manque : la
  // commande précédente a pu enregistrer une nouvelle adresse sur le compte.
  useEffect(() => {
    if (user.token) {
      dispatch(fetchCurrentCustomerThunk());
    }
  }, [user.token, dispatch]);

  const handleShippingChange = (e) => {
    const { name, value } = e.target;
    setShippingEdits((edits) => ({ ...edits, [name]: value }));
  };

  const handleBillingChange = (e) => {
    const { name, value } = e.target;
    setBillingEdits((edits) => ({ ...edits, [name]: value }));
  };

  const processCheckout = async (e) => {
    e.preventDefault();

    if (!stripe || !elements || loading) return;
    if (paymentType !== "card") {
      setError(t("checkout.errors.cardOnly"));
      return;
    }

    setLoading(true);
    setError(null);

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      setError(t("checkout.errors.cardField"));
      setLoading(false);
      return;
    }

    const { paymentMethod, error: stripeError } =
      await stripe.createPaymentMethod({
        type: "card",
        card: cardElement,
        billing_details: {
          name: `${billingAddress.first_name || ""} ${billingAddress.last_name || ""}`.trim(),
          email: shippingAddress.email,
          phone: shippingAddress.phone,
        },
      });

    if (stripeError) {
      setError(stripeError.message);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/wp-json/custom/v1/checkout`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            // Seul le jeton identifie le client côté WordPress : la commande
            // rejoint son historique et ses adresses sont enregistrées pour
            // pré-remplir la suivante. Sans lui, elle est passée en invité.
            ...(user.token && { Authorization: `Bearer ${user.token}` }),
          },
          body: JSON.stringify({
            shippingAddress: shippingAddress,
            billingAddress: sameAsBilling ? shippingAddress : billingAddress,
            cartItems: cart.items || [],
            paymentMethodId: paymentMethod.id,
            shippingMethod: shippingMethod,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || t("checkout.errors.order"));
      }

      if (data.success && data.order_id) {
        dispatch(showToast(t("order.confirmedToast", { id: data.order_id })));
        dispatch(emptyCartThunk());
        navigate(`/success/${data.order_id}`);
      } else {
        throw new Error(t("checkout.errors.notCreated"));
      }
    } catch (err) {
      setError(err.message || t("checkout.errors.order"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkout-left">
      <Link to={HOME_CATALOG_PATH} className="back-link">
        {t("checkout.backToShop")}
      </Link>

      <form id="checkout-payment-form" onSubmit={processCheckout}>
        <ShippingAddress
          address={shippingAddress}
          onChange={handleShippingChange}
        />

        <div className="form-group" style={{ marginBottom: "30px" }}>
          <label className="checkbox-group" style={{ cursor: "pointer" }}>
            <input
              type="checkbox"
              checked={sameAsBilling}
              onChange={(e) => setSameAsBillingChoice(e.target.checked)}
            />
            {t("address.sameAsShipping")}
          </label>
        </div>

        {!sameAsBilling && (
          <BillingAddress
            address={billingAddress}
            onChange={handleBillingChange}
          />
        )}

        <ShippingOptions
          options={shippingOptions}
          selectedMethod={shippingMethod}
          onSelect={setShippingMethod}
        />

        <h3>{t("checkout.paymentDetails")}</h3>
        <div className="form-group">
          <label
            className={`payment-method ${paymentType !== "card" ? "inactive-method" : ""}`}
          >
            <div className="payment-method-header">
              <span className="card-icon">💳</span>
              <div className="card-options">
                <strong>{t("checkout.card")}</strong>
                <div>{t("checkout.cardBrands")}</div>
              </div>
            </div>
            <input
              type="radio"
              name="payment"
              checked={paymentType === "card"}
              onChange={() => setPaymentType("card")}
            />
          </label>

          {paymentType === "card" && (
            <div className="stripe-elements-box">
              <CardElement
                options={{
                  style: {
                    base: {
                      fontSize: "16px",
                      color: "#424770",
                      fontFamily: "system-ui, -apple-system, sans-serif",
                      "::placeholder": {
                        color: "#aab7c4",
                      },
                    },
                    invalid: {
                      color: "#fa755a",
                    },
                  },
                }}
              />
            </div>
          )}
        </div>

        {error && (
          <div style={{ color: "red", marginTop: "10px" }}>{error}</div>
        )}

        <button
          type="submit"
          className="submit-btn desktop-submit"
          disabled={!stripe || loading}
        >
          {loading ? t("checkout.submitting") : t("checkout.submit")}
        </button>
      </form>
    </div>
  );
}
