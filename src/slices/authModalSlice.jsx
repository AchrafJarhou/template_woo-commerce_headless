import { createSlice } from "@reduxjs/toolkit";

export const authModalSlice = createSlice({
  name: "authModal",
  initialState: {
    isOpen: false,
    view: "login",
  },
  reducers: {
    openAuthModal: (state, action) => {
      state.isOpen = true;
      state.view = action.payload || "login";
    },
    closeAuthModal: (state) => {
      state.isOpen = false;
    },
    switchAuthModalView: (state, action) => {
      state.view = action.payload;
    },
  },
});

export const { openAuthModal, closeAuthModal, switchAuthModalView } =
  authModalSlice.actions;
