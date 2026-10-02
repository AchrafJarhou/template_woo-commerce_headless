import { createAsyncThunk } from "@reduxjs/toolkit";
import { apiError } from "../i18n/apiError";

// Crée la commande côté WordPress (endpoint custom/v1/checkout).
// orderData : { shippingAddress, billingAddress, cartItems, paymentMethodId,
//               shipping_method_details }
// Le jeton JWT est lu dans le store : il rattache la commande au compte connecté
// (c'est le serveur qui décide, jamais un identifiant envoyé dans le corps).
// En cas de refus (stock insuffisant, mode de livraison invalide, téléphone
// manquant...), le message du serveur est repris tel quel, comme pour le panier.
export const placeOrderThunk = createAsyncThunk(
  "checkout/placeOrder",
  async (orderData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().user.token;

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/wp-json/custom/v1/checkout`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
          body: JSON.stringify(orderData),
        },
      );

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || apiError("errors.orderCreate"));
      }

      if (!data.success || !data.order_id) {
        throw new Error(apiError("errors.orderNotCreated"));
      }

      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);
