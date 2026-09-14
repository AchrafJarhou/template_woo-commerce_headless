import { useTranslation } from "react-i18next";
export default function BillingAddress({ address, onChange }) {
  const { t } = useTranslation();

  return (
    <>
      <h3>{t("address.billing")}</h3>
      <div className="form-group">
        <div className="form-row">
          <div className="input-field">
            <label>{t("common.firstName")}</label>
            <input
              type="text"
              name="first_name"
              value={address.first_name || ""}
              onChange={onChange}
              required
            />
          </div>
          <div className="input-field">
            <label>{t("common.lastName")}</label>
            <input
              type="text"
              name="last_name"
              value={address.last_name || ""}
              onChange={onChange}
              required
            />
          </div>
        </div>
        <div className="input-field">
          <label>{t("address.street")}</label>
          <input
            type="text"
            name="address_1"
            value={address.address_1 || ""}
            placeholder={t("address.streetPlaceholder")}
            onChange={onChange}
            required
          />
        </div>
        <div className="form-row">
          <div className="input-field">
            <label>{t("address.city")}</label>
            <input
              type="text"
              name="city"
              value={address.city || ""}
              onChange={onChange}
              required
            />
          </div>
          <div className="input-field">
            <label>{t("address.country")}</label>
            <input
              type="text"
              name="country"
              value={address.country || "France"}
              onChange={onChange}
              required
            />
          </div>
        </div>
        <div className="form-row">
          <div className="input-field">
            <label>{t("address.postcode")}</label>
            <input
              type="text"
              name="postcode"
              value={address.postcode || ""}
              onChange={onChange}
              required
            />
          </div>
          <div className="input-field">
            <label>{t("address.phone")}</label>
            <input
              type="tel"
              name="phone"
              value={address.phone || ""}
              onChange={onChange}
            />
          </div>
        </div>
      </div>
    </>
  );
}
