import { useState } from "react";
import { useDispatch } from "react-redux";
import { switchAuthModalView } from "../../slices/authModalSlice";
import "./ResetPasswordForm.css";
import { useTranslation } from "react-i18next";

export default function ResetPasswordForm() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/wp-json/custom/v1/reset-password`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      },
    );
    const data = await response.json();
    setMessage(data.message);
  };

  return (
    <>
      <div className="drawer-header">
        <h2 className="drawer-title">{t("auth.resetTitle")}</h2>
        <p className="drawer-subtitle">
          {t("auth.resetHint")}
        </p>
      </div>

      <form className="drawer-form" onSubmit={handleSubmit} noValidate>
        <div className="input-group">
          <label htmlFor="reset-email">{t("common.email")}</label>
          <input
            id="reset-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />
        </div>

        {message && <p className="drawer-message">{message}</p>}

        <button className="submit-btn" type="submit">
          {t("auth.sendLink")}
        </button>
      </form>

      <div className="drawer-footer">
        <button
          type="button"
          className="toggle-btn"
          onClick={() => dispatch(switchAuthModalView("login"))}
        >
          {t("auth.backToSignIn")}
        </button>
      </div>
    </>
  );
}
