import { useSelector } from "react-redux";
import styles from "./Header.module.scss";
import menuBurgerIcon from "../../../../assets/icons/menu-burger.png";
import searchBarIcon from "../../../../assets/icons/search-bar.png";
import cartIcon from "../../../../assets/icons/logo-panier.png";

export default function Header() {
  const cartItems = useSelector((state) => state.cart.items);

  const cartCount = cartItems.reduce(
    (total, item) => total + (Number(item.quantity) || 0),
    0,
  );
  const cartBadgeValue = cartCount > 9 ? "9+" : String(cartCount);

  return (
    <header className={styles.header}>
      <div className={styles.headerLeft}>
        {/* Menu Burger */}
        <img src={menuBurgerIcon} alt="Menu" className={styles.icon} />
      </div>

      {/* Logo RAVI */}
      <div className={styles.logo}>RAVI</div>

      <div className={styles.headerRight}>
        {/* Icône Utilisateur */}
        <svg className={styles.icon} viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
        </svg>

        {/* Icône Search Bar */}
        <img src={searchBarIcon} alt="Recherche" className={styles.icon} />

        {/* Icône Panier avec compteur */}
        <div className={styles.cartWrapper}>
          {cartCount > 0 && <span className={styles.cartCount}>{cartBadgeValue}</span>}
          <img src={cartIcon} alt="Panier" className={styles.icon} />
        </div>
      </div>
    </header>
  );
}
