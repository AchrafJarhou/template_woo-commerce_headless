import { openAuthModal } from "../../slices/authModalSlice";
import { useDispatch } from "react-redux";
import "./index.css";
import { useTranslation } from "react-i18next";

export default function CheckoutAuthPromptModal({
  handleContinueAsGuest,
  onClose,
}) {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  return (
    <div className="checkout-modal-overlay">
      <div>
        <h3>{t("authPrompt.title")}</h3>
        <p>
          {t("authPrompt.guestWarning")}
        </p>
        <div className="checkout-modal-overlay-buttons">
          <button
            type="button"
            onClick={() => {
              onClose();
              dispatch(openAuthModal());
            }}
          >
            {t("authPrompt.signIn")}
          </button>
          <button type="button" onClick={(e) => handleContinueAsGuest(e)}>
            {t("authPrompt.guest")}
          </button>
        </div>
      </div>
    </div>
  );
}
