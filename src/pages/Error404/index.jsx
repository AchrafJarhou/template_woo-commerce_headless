import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Seo from "../../components/Seo";
import { HOME_CATALOG_PATH } from "../../constants/navigation";
import "./index.css";

/**
 * Page introuvable.
 *
 * Même composition que les autres écrans qui n'ont qu'une chose à dire — le
 * panier vide et la confirmation de commande : un intitulé, un titre, un
 * filet, une phrase, puis les deux boutons du site. Un seul chemin principal,
 * revenir aux articles ; l'aide reste à portée, en retrait.
 */
export default function Error404() {
  const { t, i18n } = useTranslation();

  return (
    <section className="not-found">
      {/* L'application répond 200 à toute adresse : sans cette consigne, un
          moteur de recherche pourrait indexer la page comme un vrai contenu. */}
      <Seo title={t("error404.title")} noIndex lang={i18n.resolvedLanguage} />

      <div className="not-found__inner">
        <p className="not-found__code">{t("error404.code")}</p>
        <h1 className="not-found__title">{t("error404.title")}</h1>
        <p className="not-found__message">{t("error404.body")}</p>

        <div className="not-found__actions">
          <Link className="not-found__cta" to={HOME_CATALOG_PATH}>
            {t("error404.continue")}
          </Link>
          <Link className="not-found__secondary" to="/">
            {t("error404.home")}
          </Link>
        </div>

        <p className="not-found__help">
          {t("error404.help")}
          <Link to="/contact">{t("nav.contactUs")}</Link>
          <Link to="/faq">{t("nav.faq")}</Link>
        </p>
      </div>
    </section>
  );
}
