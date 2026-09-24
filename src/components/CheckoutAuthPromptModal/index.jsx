import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { openAuthModal } from "../../slices/authModalSlice";
import "./index.scss";

const CHECKOUT_PATH = "/checkout";

// Uniquement ce qu'un compte apporte réellement sur ce site : pré-remplissage
// des adresses (CheckoutForm) et historique des commandes (OrdersList).
const BENEFITS = ["addresses", "orders"];

const FOCUSABLE =
  'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

export default function CheckoutAuthPromptModal({ onClose }) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const dialogRef = useRef(null);

  // Toujours la dernière version de onClose, sans relancer l'effet de montage :
  // le relancer à chaque rendu du panier ramènerait le focus au début.
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  });

  useEffect(() => {
    const dialog = dialogRef.current;
    const triggerElement = document.activeElement;
    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";
    dialog.querySelector(FOCUSABLE)?.focus();

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onCloseRef.current();
        return;
      }
      if (event.key !== "Tab") return;

      // Piège de focus : Tab et Maj+Tab bouclent à l'intérieur de la modale.
      const focusable = [...dialog.querySelectorAll(FOCUSABLE)];
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      triggerElement?.focus?.();
    };
  }, []);

  const startAuthentication = (view) => {
    onClose();
    dispatch(openAuthModal({ view, redirectTo: CHECKOUT_PATH }));
  };

  // mousedown plutôt que click : une sélection de texte commencée dans la
  // modale et relâchée sur le voile ne doit pas la fermer.
  const handleBackdropMouseDown = (event) => {
    if (event.target === event.currentTarget) onClose();
  };

  return (
    <div className="checkout-prompt" onMouseDown={handleBackdropMouseDown}>
      <div
        ref={dialogRef}
        className="checkout-prompt__dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="checkout-prompt-title"
      >
        <header className="checkout-prompt__header">
          <h2 id="checkout-prompt-title" className="checkout-prompt__title">
            {t("authPrompt.title")}
          </h2>
          <button
            type="button"
            className="checkout-prompt__close"
            onClick={onClose}
            aria-label={t("common.close")}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </header>

        <div className="checkout-prompt__body">
          <p className="checkout-prompt__intro">{t("authPrompt.intro")}</p>

          <ul className="checkout-prompt__benefits">
            {BENEFITS.map((benefit) => (
              <li key={benefit} className="checkout-prompt__benefit">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M4.5 12.5l5 5 10-11" />
                </svg>
                <span>{t(`authPrompt.benefits.${benefit}`)}</span>
              </li>
            ))}
          </ul>

          <div className="checkout-prompt__actions">
            <button
              type="button"
              className="checkout-prompt__button checkout-prompt__button--primary"
              onClick={() => startAuthentication("login")}
            >
              {t("authPrompt.signIn")}
            </button>
            <button
              type="button"
              className="checkout-prompt__button"
              onClick={() => startAuthentication("register")}
            >
              {t("authPrompt.register")}
            </button>
            {/* Un lien et non un bouton : cette action mène à une page. */}
            <Link
              to={CHECKOUT_PATH}
              className="checkout-prompt__button"
              onClick={onClose}
            >
              {t("authPrompt.guest")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
