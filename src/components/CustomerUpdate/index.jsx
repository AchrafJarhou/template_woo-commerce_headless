import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";

import { updateCurrentCustomerThunk } from "../../thunkActionsCreator/userThunks";
import { fetchCurrentCustomerThunk } from "../../thunkActionsCreator/userThunks";
import { useTranslation } from "react-i18next";

export function BillingUpdate() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const customer = useSelector((state) => state.user.customer);
  const [billing, setBilling] = useState(customer?.billing || {});
  const handleBillingChange = (key, value) => {
    setBilling((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmitBilling = (e) => {
    e.preventDefault();
    dispatch(updateCurrentCustomerThunk({ billing })); // pas de "shipping" ici
  };

  return (
    <div>
      <form onSubmit={handleSubmitBilling}>
        <h3>{t("account.editBilling")}</h3>
        {Object.keys(billing).map((key) => (
          <input
            key={key}
            placeholder={key}
            value={billing[key] || ""}
            onChange={(e) => handleBillingChange(key, e.target.value)}
          />
        ))}
        <button type="submit">{t("account.saveInfo")}</button>
      </form>
    </div>
  );
}

export function ShippingUpdate() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const customer = useSelector((state) => state.user.customer);
  const [shipping, setShipping] = useState(customer?.shipping || {});
  const handleShippingChange = (key, value) => {
    setShipping((prev) => ({ ...prev, [key]: value }));
  };
  const handleSubmitShipping = (e) => {
    e.preventDefault();
    dispatch(updateCurrentCustomerThunk({ shipping })); // pas de "billing" ici
  };
  return (
    <div>
      <form onSubmit={handleSubmitShipping}>
        <h3>{t("account.editShipping")}</h3>
        {Object.keys(shipping).map((key) => (
          <input
            key={key}
            placeholder={key}
            value={shipping[key] || ""}
            onChange={(e) => handleShippingChange(key, e.target.value)}
          />
        ))}
        <button type="submit">{t("account.saveInfo")}</button>
      </form>
    </div>
  );
}
