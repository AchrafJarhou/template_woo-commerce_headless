import React, { useState } from "react";
import "./Checkout.css";
import CheckoutForm from "../../components/CheckoutForm";
import OrderSummaryK from "../../components/OrderSummaryK";
import {
  MOCK_CART_ITEMS,
  MOCK_CART_TOTALS,
} from "../../components/Cart/mockCart";

export default function Checkout() {
  const [shippingMethod, setShippingMethod] = useState(null);

  // Utilisation directe du mock (à remplacer plus tard par useSelector((state) => state.cart))
  const items = MOCK_CART_ITEMS;
  const totals = MOCK_CART_TOTALS;

  return (
    <div className="checkout-container">
      <CheckoutForm
        shippingMethod={shippingMethod}
        setShippingMethod={setShippingMethod}
      />
      <OrderSummaryK
        items={items}
        totals={totals}
        shippingCost={shippingMethod ? shippingMethod.price : 0}
      />

      <button
        type="submit"
        form="checkout-payment-form"
        className="submit-btn mobile-submit"
      >
        Valider la commande
      </button>
    </div>
  );
}
