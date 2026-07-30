import "./index.css";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setFilters } from "../../slices/filtersSlice";
import { useNavigate } from "react-router-dom";
// import { fetchSearchSuggestionsThunk } from "../../thunkActionsCreator/productsThunks";
import Autocomplete from "../Autocomplete";
import { logout } from "../../slices/userSlice";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  // const [suggestions, setSuggestions] = useState([]);
  // const navigate = useNavigate();
  const token = useSelector((state) => state.user.token);
  const cartItems = useSelector((state) => state.cart.items);
  const logoUrl = useSelector((state) => state.site.logoUrl);
  const dispatch = useDispatch();

  //const filters = useSelector((state) => state.filters);
  const isAuthentificated = !!useSelector((state) => state.user?.token);
  const cartCount = cartItems.reduce(
    (total, item) => total + (Number(item.quantity) || 0),
    0,
  );
  const cartBadgeValue = cartCount > 9 ? "9+" : String(cartCount);

  // Suggestions d'autocomplétion : état local, volontairement séparé de
  // state.products.list pour ne pas écraser le catalogue ni le slider.
  // useEffect(() => {
  //   if (!filters.search) {
  //     setSuggestions([]);
  //     return;
  //   }
  //   let active = true;
  //   dispatch(
  //     fetchSearchSuggestionsThunk({ search: filters.search, per_page: 5 }),
  //   )
  //     .unwrap()
  //     .then((data) => {
  //       if (active) setSuggestions(data);
  //     })
  //     .catch(() => {
  //       if (active) setSuggestions([]);
  //     });
  //   return () => {
  //     active = false;
  //   };
  // }, [filters.search, dispatch]);

  // const handleSearchChange = (e) => {
  //   dispatch(setFilters({ search: e.target.value }));
  // };

  // const handleSearchRedirect = (e) => {
  //   if (e.key === "Enter") navigate("/catalogue");
  // };

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="header">
      <div className="header-top">
        <div className="header-left">
          {/* Burger menu mobile */}
          <button
            className="header-burger"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
            aria-expanded={menuOpen}
          >
            ☰
          </button>

          {/* Logo */}
          <Link to="/" className="header-logo" aria-label="Ecommerce">
            <img src={logoUrl || "/logo.webp"} alt="Logo" />
          </Link>
        </div>

        {/* Overlay mobile */}
        <div
          className={`header-overlay ${menuOpen ? "open" : ""}`}
          onClick={closeMenu}
          aria-hidden="true"
        />

        {/* Navigation */}
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
          <Link to="/catalogue" onClick={closeMenu}>
            Catalogue
          </Link>
          <Link to="/blog" onClick={closeMenu}>
            Blog
          </Link>
        </nav>

        <div className="header-actions">
          <label htmlFor="search">Rechercher:</label>
          <Autocomplete />

          <Link to="/catalogue" className="header-icon" aria-label="Recherche">
            🔍
          </Link>

          <Link
            to={isAuthentificated ? "/profile" : "/login"}
            className="header-icon"
            aria-label="Profil"
          >
            👤
          </Link>

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

          {token && (
            <button onClick={() => dispatch(logout())}>Déconnexion</button>
          )}
        </div>
      </div>
    </header>
  );
}
