import { Link } from "react-router-dom";
import styles from "./Footer.module.scss";
import SocialLinks from "../../../../components/SocialLinks";
import { useTranslation } from "react-i18next";

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className={`${styles.footer} catalog-footer`}>
      <nav className={styles.links}>
        <Link to="/mentions-legales">{t("nav.legal")}</Link>
        <Link to="/confidentialite">{t("nav.privacy")}</Link>
        <Link to="/cookies">{t("nav.cookies")}</Link>
        <Link to="/cgv">{t("nav.cgv")}</Link>
      </nav>

      {/* Mêmes comptes que le menu, même composant : les adresses ne sont
          écrites qu'une fois, dans les constantes. Aucun gestionnaire de
          fermeture ici — il n'y a pas de menu à refermer. */}
      <div className={styles.social}>
        <SocialLinks />
      </div>

      <p className={styles.copyright}>
        {t("footer.rights", { year: new Date().getFullYear() })}
      </p>
    </footer>
  );
}
