import { openAuthModal } from "../../slices/authModalSlice";
import { useDispatch } from "react-redux";
import "./index.css";

export default function CheckoutAuthPromptModal({
  handleContinueAsGuest,
  onClose,
}) {
  const dispatch = useDispatch();

  return (
    <div className="checkout-modal-overlay">
      <div>
        <h3>Créer un compte ou se connecter ?</h3>
        <p>
          Vous êtes actuellement en train de commander en tant qu'invité. Sans
          compte, vous ne pourrez pas suivre votre historique de commande ni
          retrouver cette facture plus tard sur le site.
        </p>
        <div className="checkout-modal-overlay-buttons">
          <button
            type="button"
            onClick={() => {
              onClose();
              dispatch(openAuthModal());
            }}
          >
            Se connecter / S'inscrire
          </button>
          <button type="button" onClick={(e) => handleContinueAsGuest(e)}>
            Continuer sans compte
          </button>
        </div>
      </div>
    </div>
  );
}
