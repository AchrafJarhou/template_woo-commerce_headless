import { useTranslation } from "react-i18next";
import { SUPPORTED_LANGUAGES } from "../../i18n";
import "./index.scss";

export default function LanguageSwitcher() {
  const { t, i18n } = useTranslation();

  return (
    <div
      className="language-switcher"
      role="group"
      aria-label={t("language.label")}
    >
      {SUPPORTED_LANGUAGES.map((language) => (
        <button
          key={language}
          type="button"
          // Indique au lecteur d'écran de prononcer « EN » à l'anglaise.
          lang={language}
          className="language-switcher__option"
          aria-pressed={i18n.resolvedLanguage === language}
          onClick={() => i18n.changeLanguage(language)}
        >
          {language.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
