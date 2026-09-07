import { createAsyncThunk } from "@reduxjs/toolkit";
import { setCart, setNonce, setCartToken } from "../slices/cartSlice";

// Le Cart-Token porte la session panier de l'invité : le front et WooCommerce
// étant sur deux origines différentes, aucun cookie de session ne circule et
// une requête sans ce jeton repart systématiquement sur un panier vide.
const buildCartHeaders = (thunkAPI) => {
  const { nonce, cartToken } = thunkAPI.getState().cart;
  const token = thunkAPI.getState().user.token;

  return {
    "Content-Type": "application/json",
    ...(nonce && { Nonce: nonce }),
    ...(cartToken && { "Cart-Token": cartToken }),
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

// WooCommerce fait tourner ces jetons à chaque réponse : on rejoue toujours
// le dernier reçu, sans quoi la session se perd à la requête suivante.
const syncCartSession = (response, thunkAPI) => {
  const { nonce, cartToken } = thunkAPI.getState().cart;

  const nextNonce = response.headers.get("Nonce");
  if (nextNonce && nextNonce !== nonce) {
    thunkAPI.dispatch(setNonce(nextNonce));
  }

  const nextCartToken = response.headers.get("Cart-Token");
  if (nextCartToken && nextCartToken !== cartToken) {
    thunkAPI.dispatch(setCartToken(nextCartToken));
  }
};

// Le corps d'erreur porte le motif réel (rupture de stock, quantité maximale
// autorisée…), bien plus utile pour le client que notre message générique.
const assertCartResponse = async (response, fallbackMessage) => {
  if (response.ok) return;

  const errorBody = await response.json().catch(() => null);
  throw new Error(errorBody?.message || fallbackMessage);
};

export const initializeCartThunk = createAsyncThunk(
  "cart/initialize",
  async (_, thunkAPI) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/wp-json/wc/store/v1/cart`,
        {
          headers: buildCartHeaders(thunkAPI),
        },
      );

      await assertCartResponse(
        response,
        "Impossible de récupérer le panier initial.",
      );

      syncCartSession(response, thunkAPI);

      const cartData = await response.json();
      thunkAPI.dispatch(setCart(cartData));
      return cartData;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);

export const emptyCartThunk = createAsyncThunk(
  "cart/empty",
  async (_, thunkAPI) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/wp-json/wc/store/v1/cart/items`,
        {
          method: "DELETE",
          headers: buildCartHeaders(thunkAPI),
        },
      );

      await assertCartResponse(response, "Impossible de vider le panier.");

      syncCartSession(response, thunkAPI);

      const cartData = await response.json();
      cartData.items = [];
      thunkAPI.dispatch(setCart(cartData));
      return cartData;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);

export const addProductToCart = createAsyncThunk(
  "cart/addProduct",
  async ({ productId, quantity, variation = [] }, thunkAPI) => {
    try {
      const variationData = Object.entries(variation).map(
        ([attribute, value]) => ({
          attribute,
          value,
        }),
      );

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/wp-json/wc/store/v1/cart/add-item`,
        {
          method: "POST",
          headers: buildCartHeaders(thunkAPI),
          body: JSON.stringify({
            id: productId,
            quantity,
            variation: variationData,
          }),
        },
      );

      await assertCartResponse(
        response,
        "Impossible d'ajouter l'article au panier.",
      );

      syncCartSession(response, thunkAPI);

      const cartData = await response.json();
      thunkAPI.dispatch(setCart(cartData));
      return cartData;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);

export const deleteProductFromCart = createAsyncThunk(
  "cart/deleteProduct",
  async ({ itemKey }, thunkAPI) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/wp-json/wc/store/v1/cart/remove-item`,
        {
          method: "POST",
          headers: buildCartHeaders(thunkAPI),
          body: JSON.stringify({ key: itemKey }),
        },
      );

      await assertCartResponse(
        response,
        "Impossible de supprimer l'article du panier.",
      );

      syncCartSession(response, thunkAPI);

      const cartData = await response.json();
      thunkAPI.dispatch(setCart(cartData));
      return cartData;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);

const couponFetch = (endpoint, code, thunkAPI) =>
  fetch(
    `${import.meta.env.VITE_API_URL}/wp-json/wc/store/v1/cart/${endpoint}`,
    {
      method: "POST",
      headers: buildCartHeaders(thunkAPI),
      body: JSON.stringify({ code }),
    },
  );

export const applyCouponThunk = createAsyncThunk(
  "cart/applyCoupon",
  async ({ code }, thunkAPI) => {
    const response = await couponFetch("apply-coupon", code, thunkAPI);
    const data = await response.json();
    if (!response.ok)
      return thunkAPI.rejectWithValue(data.message || "Code promo invalide.");

    syncCartSession(response, thunkAPI);
    thunkAPI.dispatch(setCart(data));
    return data;
  },
);

export const removeCouponThunk = createAsyncThunk(
  "cart/removeCoupon",
  async ({ code }, thunkAPI) => {
    const response = await couponFetch("remove-coupon", code, thunkAPI);
    const data = await response.json();
    syncCartSession(response, thunkAPI);
    thunkAPI.dispatch(setCart(data));
    return data;
  },
);

// Incrémente une ligne déjà présente : on l'adresse par sa clé de panier, ce
// qui évite de redemander à WooCommerce de résoudre le produit et sa variation.
export const incrementProductInCart = createAsyncThunk(
  "cart/incrementProduct",
  async ({ itemKey, quantity }, thunkAPI) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/wp-json/wc/store/v1/cart/update-item`,
        {
          method: "POST",
          headers: buildCartHeaders(thunkAPI),
          body: JSON.stringify({
            key: itemKey,
            quantity: quantity + 1,
          }),
        },
      );

      await assertCartResponse(response, "Impossible de modifier l'article.");

      syncCartSession(response, thunkAPI);

      const cartData = await response.json();
      thunkAPI.dispatch(setCart(cartData));
      return cartData;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);

export const substractProductFromCart = createAsyncThunk(
  "cart/substractProduct",
  async ({ itemKey, quantity }, thunkAPI) => {
    try {
      // En dessous de 1, WooCommerce n'accepte pas de quantité : la ligne
      // entière doit être retirée.
      const isLastUnit = quantity <= 1;
      const endpoint = isLastUnit ? "remove-item" : "update-item";
      const payload = isLastUnit
        ? { key: itemKey }
        : { key: itemKey, quantity: quantity - 1 };

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/wp-json/wc/store/v1/cart/${endpoint}`,
        {
          method: "POST",
          headers: buildCartHeaders(thunkAPI),
          body: JSON.stringify(payload),
        },
      );

      await assertCartResponse(response, "Impossible de modifier l'article.");

      syncCartSession(response, thunkAPI);

      const cartData = await response.json();
      thunkAPI.dispatch(setCart(cartData));
      return cartData;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);
