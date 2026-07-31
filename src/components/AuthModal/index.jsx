import { useDispatch, useSelector } from "react-redux";
import "./index.css";

import { closeAuthModal } from "../../slices/authModalSlice";
import LoginForm from "../LoginForm/LoginForm";
import RegisterForm from "../RegisterForm/RegisterForm";
import ResetPasswordForm from "../ResetPasswordForm/ResetPasswordForm";

const VIEWS = {
  login: LoginForm,
  register: RegisterForm,
  "reset-password": ResetPasswordForm,
};

export default function AuthModal() {
  const dispatch = useDispatch();
  const { isOpen, view } = useSelector((state) => state.authModal);

  if (!isOpen) return null;

  const close = () => dispatch(closeAuthModal());
  const ActiveForm = VIEWS[view] || LoginForm;

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
        <ActiveForm />
      </div>
    </div>
  );
}
