import { createSlice } from "@reduxjs/toolkit";

export const authModalSlice = createSlice({
  name: "authModal",
  initialState: {
    isOpen: false,
    view: "login",
    // Page où conduire l'utilisateur une fois authentifié. Null : le tiroir
    // applique sa destination par défaut, le profil.
    redirectTo: null,
  },
  reducers: {
    // Deux formes acceptées : une vue seule ("login", "register"), comme dans
    // tous les appels historiques, ou { view, redirectTo } quand la connexion
    // doit reprendre un parcours — typiquement le passage à la commande.
    openAuthModal: (state, action) => {
      const payload = action.payload;
      const { view = "login", redirectTo = null } =
        payload !== null && typeof payload === "object"
          ? payload
          : { view: payload || "login" };

      state.isOpen = true;
      state.view = view;
      state.redirectTo = redirectTo;
    },
    // Fermer efface la destination : sans cela, une connexion ouverte plus
    // tard depuis le header renverrait encore vers la commande abandonnée.
    closeAuthModal: (state) => {
      state.isOpen = false;
      state.redirectTo = null;
    },
    switchAuthModalView: (state, action) => {
      state.view = action.payload;
    },
  },
});

export const { openAuthModal, closeAuthModal, switchAuthModalView } =
  authModalSlice.actions;
