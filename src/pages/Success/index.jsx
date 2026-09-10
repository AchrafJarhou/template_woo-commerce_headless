import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { showToast } from "../../slices/toastSlice";
import OrderDetails from "../../components/OrderDetails";
import "./Success.scss";
import { useTranslation } from "react-i18next";

// Adresse d'assistance : hors dictionnaire, ce n'est pas du texte à traduire.
const SUPPORT_EMAIL = "support@example.com";

export default function Success() {
  const { t } = useTranslation();
  const { orderId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(showToast(t("order.confirmedToast", { id: orderId })));
  }, [orderId, dispatch]);

  return (
    <div className="success-page">
      <div className="success-container">
        <div className="success-header">
          <div className="success-icon">✓</div>
          <h1>{t("order.confirmed")}</h1>
          <p className="order-number">
            {t("order.number")} : <strong>#{orderId}</strong>
          </p>
        </div>

        <div className="success-message">
          <p>{t("order.thanks")}</p>
          <p>{t("order.emailSent")}</p>
        </div>

        <div className="order-info">
          <div className="info-card">
            <h3>{t("order.emailTitle")}</h3>
            <p>{t("order.emailBody")}</p>
          </div>

          <div className="info-card">
            <h3>{t("order.trackingTitle")}</h3>
            <p>{t("order.trackingBody")}</p>
          </div>

          <div className="info-card">
            <h3>{t("order.helpTitle")}</h3>
            <p>{t("order.helpBody", { email: SUPPORT_EMAIL })}</p>
          </div>
        </div>

        <OrderDetails orderId={orderId} />

        <div className="success-actions">
          <button
            className="btn btn-primary"
            onClick={() => navigate("/")}
          >
            {t("order.backToShop")}
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => navigate("/profile")}
          >
            {t("order.myOrders")}
          </button>
        </div>
      </div>
    </div>
  );
}
