import { useNavigate } from "react-router-dom";
import "./index.css";

export default function AuthModal({ children }) {
  const navigate = useNavigate();

  return (
    <div className="auth-overlay" onClick={() => navigate(-1)}>
      <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
        <button
          className="auth-modal__close"
          onClick={() => navigate(-1)}
          aria-label="Close"
        >
          ✕
        </button>
        {children}
      </div>
    </div>
  );
}
