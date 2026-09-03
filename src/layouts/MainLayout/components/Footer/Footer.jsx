import { Link } from "react-router-dom";
import styles from "./Footer.module.scss";

export default function Footer() {
  return (
    <footer className={`${styles.footer} catalog-footer`}>
      <nav className={styles.links}>
        <Link to="/mentions-legales">Mentions Légales</Link>
        <Link to="/confidentialite">Politique de Confidentialité</Link>
        <Link to="/cookies">Politique des Cookies</Link>
        <Link to="/cgv">CGV</Link>
      </nav>
      <p className={styles.copyright}>© 2026 RAVI. TOUS DROITS RÉSERVÉS.</p>
    </footer>
  );
}
