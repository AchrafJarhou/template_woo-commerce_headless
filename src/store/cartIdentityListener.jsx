import { createListenerMiddleware } from "@reduxjs/toolkit";
import { loginThunk, registerThunk } from "../thunkActionsCreator/userThunks";
import { initializeCartThunk } from "../thunkActionsCreator/cartThunks";
import { mergeGuestWishlistThunk } from "../thunkActionsCreator/wishlistThunks";
import { logout } from "../slices/userSlice";
import { setCartToken } from "../slices/cartSlice";
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
    const isLogout = logout.match(action);

    // A la deconnexion on abandonne la session panier : la conserver rendrait
    // le panier du client precedent visible par le visiteur suivant. A la
    // connexion on la garde au contraire, pour que WooCommerce rattache le
    // panier d'invite au compte.
    if (isLogout) {
      listenerApi.dispatch(setCartToken(null));
    }

    listenerApi.dispatch(initializeCartThunk());

    if (isLogout) {
      listenerApi.dispatch(resetToGuestWishlist());
    } else {
      listenerApi.dispatch(mergeGuestWishlistThunk());
    }
  },
});
