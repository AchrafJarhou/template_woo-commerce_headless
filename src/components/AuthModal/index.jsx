import { useDispatch, useSelector } from "react-redux";
import "./index.css";

import { closeAuthModal } from "../../slices/authModalSlice";
import AuthForm from "../AuthForm/";
import ResetPasswordForm from "../ResetPasswordForm/ResetPasswordForm";

export default function AuthModal() {
  const dispatch = useDispatch();
  const { isOpen, view } = useSelector((state) => state.authModal);

  if (!isOpen) return null;

  const close = () => dispatch(closeAuthModal());

  return (
    <div className="auth-overlay" onClick={close}>
      <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
        <button
          className="auth-modal__close"
          onClick={close}
          aria-label="Close"
        >
          ✕
        </button>
        {view === "login" ? <AuthForm /> : <ResetPasswordForm />}
      </div>
    </div>
  );
}
