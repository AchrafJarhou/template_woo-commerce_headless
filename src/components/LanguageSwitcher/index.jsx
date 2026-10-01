import { SUPPORTED_LANGUAGES } from "../../i18n";
import SegmentedControl from "../SegmentedControl";
import "./index.scss";
import { useTranslation } from "react-i18next";

export default function LanguageSwitcher() {
  const { t, i18n } = useTranslation();

  return (
    <SegmentedControl
      className="language-switcher"
      label={t("language.label")}
      options={SUPPORTED_LANGUAGES.map((language) => ({
        value: language,
        label: language.toUpperCase(),
        // Indique au lecteur d'écran de prononcer « EN » à l'anglaise.
        lang: language,
      }))}
      value={i18n.resolvedLanguage}
      onChange={(language) => i18n.changeLanguage(language)}
    />
  );
}
