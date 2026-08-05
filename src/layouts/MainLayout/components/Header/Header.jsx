import styles from "./Header.module.scss";

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.headerLeft}>
        {/* Menu Burger */}
        <svg className={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 12h18M3 6h18M3 18h18" />
        </svg>
      </div>

      <div className={styles.logo}>RAVI</div>

      <div className={styles.headerRight}>
        {/* Icône Utilisateur */}
        <svg className={styles.icon} viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
        </svg>

        {/* Icône Panier avec compteur */}
        <div className={styles.cartWrapper}>
          <span className={styles.cartCount}>3</span>
          <svg className={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4zM3 6h18M16 10a4 4 0 0 1-8 0" />
          </svg>
        </div>
      </div>
    </header>
  );
}
