import { createListenerMiddleware } from "@reduxjs/toolkit";
import { loginThunk, registerThunk } from "../thunkActionsCreator/userThunks";
import { initializeCartThunk } from "../thunkActionsCreator/cartThunks";
import { mergeGuestWishlistThunk } from "../thunkActionsCreator/wishlistThunks";
import { logout } from "../slices/userSlice";
import { resetToGuestWishlist } from "../slices/wishlistSlice";

// Le nonce Store API est lie a l'identite (invite vs client connecte via le
// token JWT). Quand cette identite change, on redemande un panier/nonce frais
// plutot que de garder celui de l'ancienne identite en memoire/localStorage.
// La wishlist invite vit en localStorage (pas de session cote WooCommerce
// comme pour le panier) : a la connexion on la fusionne dans le compte, a la
// deconnexion on retombe sur la wishlist locale de l'invite.
export const cartIdentityListener = createListenerMiddleware();

cartIdentityListener.startListening({
  matcher: (action) =>
    loginThunk.fulfilled.match(action) ||
    registerThunk.fulfilled.match(action) ||
    logout.match(action),
  effect: async (action, listenerApi) => {
    listenerApi.dispatch(initializeCartThunk());

    if (logout.match(action)) {
      listenerApi.dispatch(resetToGuestWishlist());
    } else {
      listenerApi.dispatch(mergeGuestWishlistThunk());
    }
  },
});
