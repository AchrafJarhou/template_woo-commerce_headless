import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import styles from "./Header.module.scss";
import menuBurgerIcon from "../../../../assets/icons/menu-burger.png";
import cartIcon from "../../../../assets/icons/logo-panier.png";
import { openAuthModal } from "../../../../slices/authModalSlice";
import LanguageSwitcher from "../../../../components/LanguageSwitcher";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const cartItems = useSelector((state) => state.cart.items);
  const { token } = useSelector((state) => state.user);
  const siteSettings = useSelector((state) => state.site.siteSettings);
  const siteLogo = siteSettings?.siteLogo;

  const cartCount = cartItems.reduce(
    (total, item) => total + (Number(item.quantity) || 0),
    0,
  );
  const cartBadgeValue = cartCount > 9 ? "9+" : String(cartCount);

  // Fonction de routage intelligent
  const handleUserClick = () => {
    if (token) {
      navigate("/profile"); // Redirige vers le profil si connecté
    } else {
      dispatch(openAuthModal("login")); // Ouvre le tiroir si déconnecté
    }
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          {/* Menu Burger */}
          <button
            className={styles.menuButton}
            onClick={() => setMenuOpen(true)}
            aria-label={t("header.openMenu")}
          >
            <img src={menuBurgerIcon} alt="" className={styles.icon} />
          </button>

          <LanguageSwitcher />
        </div>

        {/* Logo RAVI */}
        <Link to="/">
          {siteLogo ? (
            <img src={siteLogo} alt={t("header.logoAlt")} className={styles.logoImg} />
          ) : (
            <div className={styles.logo}>RAVI</div>
          )}
        </Link>

        <div className={styles.headerRight}>
          {/* Icône Utilisateur */}
          <button
            className={styles.userIconButton}
            onClick={handleUserClick}
            aria-label={t("header.account")}
          >
            <svg
              className={styles.icon}
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
          </button>

          {/* Icône Panier avec compteur */}
          <Link to="/panier" aria-label={t("header.cart")}>
            <div className={styles.cartWrapper}>
              {cartCount > 0 && (
                <span className={styles.cartCount}>{cartBadgeValue}</span>
              )}
              <img src={cartIcon} alt="" className={styles.icon} />
            </div>
          </Link>
        </div>
      </header>

      {/* Navigation fullscreen */}
      {menuOpen && (
        <nav className={styles.navFullscreen}>
          <button
            className={styles.closeButton}
            onClick={closeMenu}
            aria-label={t("header.closeMenu")}
          >
            ✕
          </button>
          <div className={styles.navContent}>
            <Link to="/" className={styles.navLink} onClick={closeMenu}>
              {t("header.nav.home")}
            </Link>
            <Link to="/faq" className={styles.navLink} onClick={closeMenu}>
              {t("header.nav.faq")}
            </Link>
            <Link to="/a-propos" className={styles.navLink} onClick={closeMenu}>
              {t("header.nav.about")}
            </Link>
            <Link to="/contact" className={styles.navLink} onClick={closeMenu}>
              {t("header.nav.contact")}
            </Link>
          </div>
        </nav>
      )}
    </>
  );
}
