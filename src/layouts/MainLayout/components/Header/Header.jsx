import { useState } from "react";
import { useSelector } from "react-redux";
import styles from "./Header.module.scss";
import menuBurgerIcon from "../../../../assets/icons/menu-burger.png";
import cartIcon from "../../../../assets/icons/logo-panier.png";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const cartItems = useSelector((state) => state.cart.items);

  const cartCount = cartItems.reduce(
    (total, item) => total + (Number(item.quantity) || 0),
    0,
  );
  const cartBadgeValue = cartCount > 9 ? "9+" : String(cartCount);

  return (
    <>
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          {/* Menu Burger */}
          <button
            className={styles.menuButton}
            onClick={() => setMenuOpen(true)}
            aria-label="Ouvrir le menu"
          >
            <img src={menuBurgerIcon} alt="Menu" className={styles.icon} />
          </button>
        </div>

        {/* Logo RAVI */}
        <div className={styles.logo}>RAVI</div>

        <div className={styles.headerRight}>
          {/* Icône Utilisateur */}
          <svg className={styles.icon} viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
          </svg>

          {/* Icône Panier avec compteur */}
          <div className={styles.cartWrapper}>
            {cartCount > 0 && <span className={styles.cartCount}>{cartBadgeValue}</span>}
            <img src={cartIcon} alt="Panier" className={styles.icon} />
          </div>
        </div>
      </header>

      {/* Navigation fullscreen */}
      {menuOpen && (
        <nav className={styles.navFullscreen}>
          <button
            className={styles.closeButton}
            onClick={() => setMenuOpen(false)}
            aria-label="Fermer le menu"
          >
            ✕
          </button>
          <div className={styles.navContent}>
            <a href="/" className={styles.navLink}>ACCUEIL</a>
            <a href="/faq" className={styles.navLink}>FAQ</a>
            <a href="/about" className={styles.navLink}>À PROPOS</a>
            <a href="/contact" className={styles.navLink}>CONTACT</a>
            <div className={styles.navLanguage}>
              <a href="#" className={styles.navLink}>FR</a>
              <span> / </span>
              <a href="#" className={styles.navLink}>EN</a>
            </div>
          </div>
        </nav>
      )}
    </>
  );
}
