import { Link } from 'react-router-dom';
import './index.css';
import { useTranslation } from "react-i18next";
import { HOME_CATALOG_PATH } from "../../constants/navigation";

export default function Error404() {
  const { t } = useTranslation();
  return (
    <div className="error-404-container">
      <div className="error-404-content">
        <div className="error-404-illustration">
          <div className="error-404-number">404</div>
          <div className="error-404-icon">
            <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
              <circle cx="100" cy="100" r="90" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.1" />
              <path d="M 70 120 Q 100 150 130 120" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
              <circle cx="80" cy="80" r="8" fill="currentColor" opacity="0.6" />
              <circle cx="120" cy="80" r="8" fill="currentColor" opacity="0.6" />
            </svg>
          </div>
        </div>

        <div className="error-404-text">
          <h1>{t("error404.title")}</h1>
          <p>{t("error404.body")}</p>
        </div>

        <div className="error-404-actions">
          <Link to="/" className="btn btn-primary">
            {t("error404.home")}
          </Link>
          <Link to={HOME_CATALOG_PATH} className="btn btn-secondary">
            {t("error404.continue")}
          </Link>
        </div>

        <div className="error-404-suggestions">
          <h3>{t("error404.suggestions")}</h3>
          <ul>
            <li><Link to="/">{t("error404.browse")}</Link></li>
            <li><Link to="/contact">{t("nav.contactUs")}</Link></li>
            <li><Link to="/faq">{t("nav.faq")}</Link></li>
          </ul>
        </div>
      </div>
    </div>
  );
}