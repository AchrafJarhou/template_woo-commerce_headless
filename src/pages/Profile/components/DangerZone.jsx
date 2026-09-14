import { useTranslation } from "react-i18next";
export function DangerZone() {
  const { t } = useTranslation();

  return (
    <section className="profile__section profile__section--danger">
      <h2 className="profile__section-title">{t("account.deleteTitle")}</h2>
      <p className="profile__danger-text">
        {t("account.deleteWarning")}
      </p>
      <button className="profile__button profile__button--danger">
        {t("account.deleteTitle")}
      </button>
    </section>
  );
}
