const GUEST_WISHLIST_KEY = "wc_guest_wishlist";

export const readGuestWishlist = () => {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(GUEST_WISHLIST_KEY)) || [];
  } catch {
    return [];
  }
};

export const writeGuestWishlist = (items) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(GUEST_WISHLIST_KEY, JSON.stringify(items));
  }
};

export const clearGuestWishlistStorage = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem(GUEST_WISHLIST_KEY);
  }
};
