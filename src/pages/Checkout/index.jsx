import React, { useState } from "react";
import { useSelector } from "react-redux";
import "./Checkout.scss";
import CheckoutForm from "../../components/CheckoutForm";
import StripeWrapper from "../../components/StripeWrapper";
import OrderSummaryK from "../../components/OrderSummary";
import {
  MOCK_CART_ITEMS,
  MOCK_CART_TOTALS,
} from "../../components/Cart/mockCart";

export default function Checkout() {
  const [shippingMethod, setShippingMethod] = useState(null);

  const cartState = useSelector((state) => state.cart);
  const items = cartState?.items?.length > 0 ? cartState.items : MOCK_CART_ITEMS;
  const totals = cartState?.totals || MOCK_CART_TOTALS;

  return (
    <div className="checkout-container">
      <StripeWrapper>
        <CheckoutForm
          shippingMethod={shippingMethod}
          setShippingMethod={setShippingMethod}
        />
      </StripeWrapper>
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
