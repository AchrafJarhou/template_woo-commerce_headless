// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
// import { useDispatch, useSelector } from "react-redux";
// import { showToast } from "../../slices/toastSlice";
// import { emptyCartThunk } from "../../thunkActionsCreator/cartThunks";
// import {
//   fetchCurrentCustomerThunk,
//   fetchCurrentUserOrdersThunk,
//   fetchCurrentUserThunk,
// } from "../../thunkActionsCreator/userThunks";
// import CheckoutAuthPromptModal from "../CheckoutAuthPromptModal";

// export default function CheckoutForm() {
//   const navigate = useNavigate();
//   const stripe = useStripe();
//   const elements = useElements();
//   const dispatch = useDispatch();
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [showGuestModal, setShowGuestModal] = useState(false);

//   const user = useSelector((state) => state.user);
//   const cart = useSelector((state) => state.cart);

//   const [sameAsBilling, setSameAsBilling] = useState(false);

//   const [shippingAddress, setShippingAddress] = useState({
//     first_name: user?.customer?.shipping?.firstName || "Jean",
//     last_name: user?.customer?.shipping?.lastName || "Dupont",
//     address_1: user?.customer?.shipping?.address1 || "10 Rue de la Paix",
//     city: user?.customer?.shipping?.city || "Paris",
//     postcode: user?.customer?.shipping?.postcode || "75001",
//     country: user?.customer?.shipping?.country || "FR",
//     email: user?.profile?.email || "jean.dupont@example.com",
//   });

//   const [billingAddress, setBillingAddress] = useState({
//     first_name: user?.customer?.billing?.firstName || "Jean",
//     last_name: user?.customer?.billing?.lastName || "Dupont",
//     address_1: user?.customer?.billing?.address1 || "10 Rue de la Paix",
//     city: user?.customer?.billing?.city || "Paris",
//     postcode: user?.customer?.billing?.postcode || "75001",
//     country: user?.customer?.billing?.country || "FR",
//     email: user?.profile?.email || "jean.dupont@example.com",
//   });

//   useEffect(() => {
//     if (sameAsBilling) {
//       setBillingAddress(shippingAddress);
//     }
//   }, [shippingAddress, sameAsBilling]);

//   const processCheckout = async () => {
//     if (!stripe || !elements || loading) return;
//     setLoading(true);
//     setError(null);

//     const cardElement = elements.getElement(CardElement);
//     const { paymentMethod, error: stripeError } =
//       await stripe.createPaymentMethod({
//         type: "card",
//         card: cardElement,
//         billing_details: {
//           name: `${billingAddress?.first_name} ${billingAddress?.last_name}`,
//           email: billingAddress?.email,
//         },
//       });

//     if (stripeError) {
//       setError(stripeError.message);
//       setLoading(false);
//       return;
//     }

//     try {
//       const response = await fetch(
//         `${import.meta.env.VITE_API_URL}/wp-json/wc/store/v1/checkout`,
//         {
//           method: "POST",
//           credentials: "include",
//           headers: {
//             "Content-Type": "application/json",
//             Nonce: cart?.nonce || "",
//             ...(user?.token && { Authorization: `Bearer ${user.token}` }),
//           },
//           body: JSON.stringify({
//             payment_method: "stripe",
//             payment_data: [
//               { key: "stripe_source", value: paymentMethod.id },
//               { key: "wc-stripe-payment-method", value: paymentMethod.id },
//               { key: "payment_method", value: paymentMethod.id },
//             ],
//             billing_address: billingAddress,
//             shipping_address: shippingAddress,
//           }),
//         },
//       );

//       const data = await response.json();
//       if (!response.ok) {
//         throw new Error(data.message || "Erreur lors de la commande.");
//       }
//       if (data.payment_result?.redirect_url) {
//         dispatch(showToast(`Commande n°${data.order_id} confirmée`));
//         dispatch(emptyCartThunk());
//         dispatch(fetchCurrentUserThunk());
//         dispatch(fetchCurrentCustomerThunk());
//         dispatch(fetchCurrentUserOrdersThunk());
//         navigate(`/success/${data.order_id}`);
//       }
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (!user?.token) {
//       setShowGuestModal(true);
//       return;
//     }
//     processCheckout();
//   };

//   const handleContinueAsGuest = (e) => {
//     setShowGuestModal(false);
//     processCheckout();
//   };

//   const handleChangeAddress = (e) => {
//     const { name, value } = e.target;
//     setBillingAddress((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleChangeShippingAddress = (e) => {
//     const { name, value } = e.target;
//     setShippingAddress((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleCheckboxChange = (e) => {
//     const checked = e.target.checked;
//     setSameAsBilling(checked);
//     if (checked) {
//       setBillingAddress(shippingAddress);
//     }
//   };

//   return (
//     <>
//       <form onSubmit={handleSubmit}>
//         <h3>Adresse de livraison</h3>
//         <div>
//           <label>
//             Prénom
//             <input
//               name="first_name"
//               value={shippingAddress.first_name}
//               onChange={handleChangeShippingAddress}
//               required
//             />
//           </label>

//           <label>
//             Nom
//             <input
//               name="last_name"
//               value={shippingAddress.last_name}
//               onChange={handleChangeShippingAddress}
//               required
//             />
//           </label>

//           <label>
//             Adresse
//             <input
//               name="address_1"
//               value={shippingAddress.address_1}
//               onChange={handleChangeShippingAddress}
//               required
//             />
//           </label>

//           <label>
//             Ville
//             <input
//               name="city"
//               value={shippingAddress.city}
//               onChange={handleChangeShippingAddress}
//               required
//             />
//           </label>

//           <label>
//             Code postal
//             <input
//               name="postcode"
//               value={shippingAddress.postcode}
//               onChange={handleChangeShippingAddress}
//               required
//             />
//           </label>

//           <label>
//             Pays
//             <input
//               name="country"
//               value={shippingAddress.country}
//               onChange={handleChangeShippingAddress}
//               required
//             />
//           </label>

//           <br />
//           <label>
//             <input
//               type="checkbox"
//               id="sameAsBilling"
//               checked={sameAsBilling}
//               onChange={handleCheckboxChange}
//             />
//             Livrer à la même adresse (facturation identique)
//           </label>

//           {!sameAsBilling && (
//             <>
//               <h3>Adresse de facturation</h3>
//               <label>
//                 Prénom
//                 <input
//                   name="first_name"
//                   value={billingAddress.first_name}
//                   onChange={handleChangeAddress}
//                   required
//                 />
//               </label>

//               <label>
//                 Nom
//                 <input
//                   name="last_name"
//                   value={billingAddress.last_name}
//                   onChange={handleChangeAddress}
//                   required
//                 />
//               </label>

//               <label>
//                 Adresse
//                 <input
//                   name="address_1"
//                   value={billingAddress.address_1}
//                   onChange={handleChangeAddress}
//                   required
//                 />
//               </label>

//               <label>
//                 Ville
//                 <input
//                   name="city"
//                   value={billingAddress.city}
//                   onChange={handleChangeAddress}
//                   required
//                 />
//               </label>

//               <label>
//                 Code postal
//                 <input
//                   name="postcode"
//                   value={billingAddress.postcode}
//                   onChange={handleChangeAddress}
//                   required
//                 />
//               </label>

//               <label>
//                 Pays
//                 <input
//                   name="country"
//                   value={billingAddress.country}
//                   onChange={handleChangeAddress}
//                   required
//                 />
//               </label>
//             </>
//           )}

//           <br />
//           <label>
//             Email
//             <input
//               name="email"
//               type="email"
//               value={billingAddress.email}
//               onChange={handleChangeAddress}
//               required
//             />
//           </label>

//           <div>
//             <CardElement />
//           </div>

//           <button type="submit" disabled={!stripe || loading}>
//             {loading ? "Traitement..." : "Payer maintenant"}
//           </button>

//           {error && <p>{error}</p>}
//         </div>
//       </form>

//       {showGuestModal && (
//         <CheckoutAuthPromptModal
//           handleContinueAsGuest={handleContinueAsGuest}
//           onClose={() => setShowGuestModal(false)}
//         />
//       )}
//     </>
//   );
// }

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useSelector, useDispatch } from "react-redux";
import ShippingAddress from "./ShippingAddress";
import BillingAddress from "./BillingAddress";
import ShippingOptions from "./ShippingOptions";
import { showToast } from "../../slices/toastSlice";
import { emptyCartThunk } from "../../thunkActionsCreator/cartThunks";

export default function CheckoutForm({ shippingMethod, setShippingMethod }) {
  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();
  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);

  const [paymentType, setPaymentType] = useState("card");
  const [sameAsBilling, setSameAsBilling] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // États locaux pour gérer les champs des sous-composants
  const [shippingAddress, setShippingAddress] = useState({
    first_name: "",
    last_name: "",
    address_1: "",
    city: "",
    postcode: "",
    country: "FR",
    email: "",
  });
  const [billingAddress, setBillingAddress] = useState({
    first_name: "",
    last_name: "",
    address_1: "",
    city: "",
    postcode: "",
    country: "FR",
    email: "",
  });

  const shippingOptions = [
    { id: "mondial_relay", name: "Mondial Relay (Point Relais)", price: 4.5 },
    { id: "colissimo", name: "Colissimo (Standard)", price: 7.9 },
    { id: "express", name: "Chronopost (Express 24h)", price: 12.9 },
  ];

  const handleShippingChange = (e) => {
    setShippingAddress({ ...shippingAddress, [e.target.name]: e.target.value });
  };

  const handleBillingChange = (e) => {
    setBillingAddress({ ...billingAddress, [e.target.name]: e.target.value });
  };

  const processCheckout = async (e) => {
    e.preventDefault();

    if (!stripe || !elements || loading) return;
    if (paymentType !== "card") {
      setError("Seul le paiement par carte est actuellement disponible");
      return;
    }

    setLoading(true);
    setError(null);

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      setError("Erreur: champ de carte non trouvé");
      setLoading(false);
      return;
    }

    const { paymentMethod, error: stripeError } = await stripe.createPaymentMethod({
      type: "card",
      card: cardElement,
      billing_details: {
        name: `${billingAddress.first_name || ""} ${billingAddress.last_name || ""}`.trim(),
        email: shippingAddress.email,
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
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            shippingAddress: shippingAddress,
            billingAddress: sameAsBilling ? shippingAddress : billingAddress,
            cartItems: cart.items || [],
            paymentMethodId: paymentMethod.id,
            shippingMethod: shippingMethod,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erreur lors de la commande");
      }

      if (data.success && data.order_id) {
        dispatch(showToast(`Commande n°${data.order_id} confirmée`));
        dispatch(emptyCartThunk());
        navigate(`/success/${data.order_id}`);
      } else {
        throw new Error("Commande non créée");
      }
    } catch (err) {
      setError(err.message || "Erreur lors de la commande");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkout-left">
      <Link to="/cart" className="back-link">
        ← RETOUR À LA BOUTIQUE
      </Link>

      <div className="express-payment">
        <button
          type="button"
          className={`express-btn ${paymentType === "apple" ? "selected" : ""}`}
          onClick={() => setPaymentType("apple")}
        >
          A Pay
        </button>
        <button
          type="button"
          className={`express-btn ${paymentType === "google" ? "selected" : ""}`}
          onClick={() => setPaymentType("google")}
        >
          G Pay
        </button>
        <button
          type="button"
          className={`express-btn ${paymentType === "crypto" ? "selected" : ""}`}
          onClick={() => setPaymentType("crypto")}
        >
          Crypto
        </button>
      </div>

      <div className="divider">OU CONTINUER CI-DESSOUS</div>

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
              onChange={(e) => setSameAsBilling(e.target.checked)}
            />
            Adresse de facturation identique à l'adresse de livraison
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

        <h3>Détails du paiement</h3>
        <div className="form-group">
          <label
            className={`payment-method ${paymentType !== "card" ? "inactive-method" : ""}`}
          >
            <div className="payment-method-header">
              <span className="card-icon">💳</span>
              <div className="card-options">
                <strong>CARTE DE CRÉDIT / DÉBIT</strong>
                <div>Visa, Mastercard, Amex</div>
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

        {error && <div style={{ color: "red", marginTop: "10px" }}>{error}</div>}

        <button type="submit" className="submit-btn desktop-submit" disabled={!stripe || loading}>
          {loading ? "Traitement en cours..." : "Valider la commande"}
        </button>
      </form>
    </div>
  );
}
