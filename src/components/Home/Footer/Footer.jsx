import styles from "./Footer.module.scss";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <nav className={styles.links}>
        <a href="#mentions">Mentions Légales</a>
        <a href="#confidentialite">Politique de Confidentialité</a>
        <a href="#cookies">Politique des Cookies</a>
        <a href="#cgv">CGV</a>
      </nav>
      <p className={styles.copyright}>© 2026 RAVI. TOUS DROITS RÉSERVÉS.</p>
    </footer>
  );
}
