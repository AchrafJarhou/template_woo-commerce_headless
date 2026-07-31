import { createSlice } from "@reduxjs/toolkit";
import {
  fetchWishlistThunk,
  addToWishlistThunk,
  removeFromWishlistThunk,
  mergeGuestWishlistThunk,
} from "../thunkActionsCreator/wishlistThunks";
import { readGuestWishlist, writeGuestWishlist } from "../utils/guestWishlist";

export const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: {
    // Invite (pas de token) : la wishlist n'existe qu'en local, pas de session
    // cote WooCommerce comme pour le panier. On l'hydrate directement depuis
    // le localStorage ; elle sera ecrasee par fetchWishlistThunk si un token
    // est present au demarrage (cf. main.jsx).
    items: readGuestWishlist(),
    loading: false,
    error: null,
  },
  reducers: {
    // Utilisee a la deconnexion : on retombe sur la wishlist locale de
    // l'invite plutot que de la vider, au cas ou elle en avait deja une avant
    // de se connecter.
    resetToGuestWishlist: (state) => {
      state.items = readGuestWishlist();
      state.error = null;
    },
    addLocalWishlistItem: (state, action) => {
      const product = action.payload;
      if (!state.items.some((item) => item.id === product.id)) {
        state.items.push(product);
      }
      writeGuestWishlist(state.items);
    },
    removeLocalWishlistItem: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
      writeGuestWishlist(state.items);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWishlistThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWishlistThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchWishlistThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addToWishlistThunk.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(removeFromWishlistThunk.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(mergeGuestWishlistThunk.fulfilled, (state, action) => {
        state.items = action.payload;
      });
  },
});

export const {
  resetToGuestWishlist,
  addLocalWishlistItem,
  removeLocalWishlistItem,
} = wishlistSlice.actions;
