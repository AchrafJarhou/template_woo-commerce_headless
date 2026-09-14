import "./index.css";
import { useTranslation } from "react-i18next";

export default function Loader({ size = "md" }) {
  const { t } = useTranslation();

  return (
    <div className={`loader loader-${size}`} role="status" aria-label={t("common.loading")}>
      <span className="loader-spinner" />
    </div>
  );
}
