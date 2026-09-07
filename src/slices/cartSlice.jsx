import { createSlice } from "@reduxjs/toolkit";

const readStoredValue = (key) =>
  typeof window !== "undefined" ? localStorage.getItem(key) : null;

const persistValue = (key, value) => {
  if (typeof window === "undefined") return;

  if (value) {
    localStorage.setItem(key, value);
  } else {
    localStorage.removeItem(key);
  }
};

// Toutes les opérations panier passent par un thunk préfixé "cart/" : ce
// prédicat les suit sans que le slice ait à les importer (import circulaire).
const isCartRequest = (suffix) => (action) =>
  action.type.startsWith("cart/") && action.type.endsWith(suffix);

export const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
    totals: null,
    coupons: [],
    nonce: readStoredValue("wc_cart_nonce"),
    cartToken: readStoredValue("wc_cart_token"),
    isSyncing: false,
  },
  reducers: {
    setCart: (state, action) => {
      state.items = action.payload.items;
      state.totals = action.payload.totals;
      state.coupons = action.payload.coupons || [];
    },
    setNonce: (state, action) => {
      state.nonce = action.payload;
      persistValue("wc_cart_nonce", action.payload);
    },
    // Identifie la session panier d'un invité côté WooCommerce : sans lui,
    // chaque requête cross-origin repart sur un panier vide.
    setCartToken: (state, action) => {
      state.cartToken = action.payload;
      persistValue("wc_cart_token", action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(isCartRequest("/pending"), (state) => {
        state.isSyncing = true;
      })
      .addMatcher(isCartRequest("/fulfilled"), (state) => {
        state.isSyncing = false;
      })
      .addMatcher(isCartRequest("/rejected"), (state) => {
        state.isSyncing = false;
      });
  },
});

export const { setCart, setNonce, setCartToken } = cartSlice.actions;
