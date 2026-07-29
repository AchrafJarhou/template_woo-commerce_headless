import { createSlice } from "@reduxjs/toolkit";

export const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
    totals: null,
    nonce:
      typeof window !== "undefined"
        ? localStorage.getItem("wc_cart_nonce")
        : null,
  },
  reducers: {
    setCart: (state, action) => {
      state.items = action.payload.items;
      state.totals = action.payload.totals;
    },
    setNonce: (state, action) => {
      state.nonce = action.payload;
      if (action.payload) {
        localStorage.setItem("wc_cart_nonce", action.payload);
      } else {
        localStorage.removeItem("wc_cart_nonce");
      }
    },
    // setItems: (state, action) => {
    //   state.items = action.payload;
    // },
  },
});

export const { setCart, setNonce /*, setItems*/ } = cartSlice.actions;
