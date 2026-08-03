import "./index.css";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setFilters } from "../../slices/filtersSlice";
import { useNavigate } from "react-router-dom";
import Autocomplete from "../Autocomplete";
import { logout } from "../../slices/userSlice";
import { openAuthModal } from "../../slices/authModalSlice";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const token = useSelector((state) => state.user.token);
  const cartItems = useSelector((state) => state.cart.items);
  const wishlistItems = useSelector((state) => state.wishlist.items);
  const logoUrl = useSelector((state) => state.site.logoUrl);
  const dispatch = useDispatch();
  const isAuthentificated = useSelector((state) => state.user?.token);
  const cartCount = cartItems.reduce(
    (total, item) => total + (Number(item.quantity) || 0),
    0,
  );
  const cartBadgeValue = cartCount > 9 ? "9+" : String(cartCount);
  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="header">
      <div className="margin"></div>
      <div className="content">
        <Link to="/" className="header-logo" aria-label="Ecommerce">
          <img src={logoUrl || "./logo.webp"} alt="Logo" />
        </Link>

        {/* <div
            className={`header-overlay ${menuOpen ? "open" : ""}`}
            onClick={closeMenu}
            aria-hidden="true"
          /> */}
        <div className="menu">
          <nav
            className={`header-nav ${menuOpen ? "open" : ""}`}
            aria-hidden={!menuOpen}
          >
            <button
              className="header-close"
              onClick={closeMenu}
              aria-label="Fermer le menu"
            >
              ✕
            </button>
            <button
              className="header-burger"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Menu"
              aria-expanded={menuOpen}
            >
              ☰
            </button>
            <Link to="/catalogue" onClick={closeMenu}>
              Catalogue
            </Link>
            <Link to="/blog" onClick={closeMenu}>
              Blog
            </Link>
          </nav>
          <div className="header-actions">
            <Autocomplete />
            <Link
              to="/catalogue"
              className="header-icon"
              aria-label="Recherche"
            >
              🔍
            </Link>

            {isAuthentificated ? (
              <Link to="/profile" className="header-icon" aria-label="Profil">
                👤
              </Link>
            ) : (
              <button
                type="button"
                className="header-icon"
                aria-label="Profil"
                onClick={() => dispatch(openAuthModal("login"))}
              >
                👤
              </button>
            )}

            <Link
              to="/panier"
              className="header-icon header-cart-link"
              aria-label={`Panier (${cartBadgeValue})`}
            >
              🛒
              {cartCount > 0 && (
                <span className="header-cart-badge">{cartBadgeValue}</span>
              )}
            </Link>
            <Link
              to="/wishlist"
              className="header-icon header-wishlist-link"
              aria-label={`Favoris (${wishlistItems.length})`}
            >
              ❤️
              {wishlistItems.length > 0 && (
                <span className="header-cart-badge">
                  {wishlistItems.length > 9 ? "9+" : wishlistItems.length}
                </span>
              )}
            </Link>

            {token && (
              <button onClick={() => dispatch(logout())}>Déconnexion</button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
