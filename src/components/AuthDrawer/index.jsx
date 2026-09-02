import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  closeAuthModal,
  switchAuthModalView,
} from "../../slices/authModalSlice";
import { showToast } from "../../slices/toastSlice";
import {
  loginThunk,
  registerThunk,
} from "../../thunkActionsCreator/userThunks";
import ResetPasswordForm from "../ResetPasswordForm/ResetPasswordForm";
import "./index.css";

export default function AuthDrawer() {
  const dispatch = useDispatch();
  const { isOpen, view } = useSelector((state) => state.authModal);
  const { loading, error, token } = useSelector((state) => state.user);

  const [mode, setMode] = useState("login");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (token) dispatch(closeAuthModal());
  }, [dispatch, token]);

  useEffect(() => {
    if (error) dispatch(showToast(error));
  }, [error, dispatch]);

  if (!isOpen) return null;

  const close = () => dispatch(closeAuthModal());
  const stopPropagation = (e) => e.stopPropagation();
  const toggleMode = () => {
    setMode(mode === "login" ? "register" : "login");
    setErrors({});
  };

  const validateLogin = (e, updatedForm = form) => {
    setErrors({});
    const newErrors = {};
    if (!updatedForm.username.trim()) {
      newErrors.username = "Le nom d'utilisateur est requis.";
    }
    if (!updatedForm.password) {
      newErrors.password = "Le mot de passe est requis.";
    } else if (updatedForm.password.length < 8) {
      newErrors.password = "Il faut au moins 8 caractères.";
    }

    if (mode === "register") {
      if (!updatedForm.email.trim()) {
        newErrors.email = "L'adresse e-mail est requise.";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(updatedForm.email)) {
        newErrors.email = "Entrez une adresse e-mail valide.";
      }
      if (!updatedForm.confirmPassword) {
        newErrors.confirmPassword = "Veuillez confirmer votre mot de passe.";
      } else if (updatedForm.confirmPassword !== updatedForm.password) {
        newErrors.confirmPassword = "Les mots de passe ne correspondent pas.";
      }
    }
    setErrors(newErrors);
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedForm = { ...form, [name]: value };
    setForm(updatedForm);
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
    validateLogin(e, updatedForm);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validation = validateLogin();
    if (Object.keys(validation).length > 0) {
      setErrors(validation);
      return;
    }

    if (mode === "login") {
      dispatch(
        loginThunk({ username: form.username.trim(), password: form.password }),
      );
    } else {
      dispatch(
        registerThunk({
          username: form.username.trim(),
          email: form.email.trim(),
          password: form.password,
        }),
      );
    }
  };

  // Petite fonction pour générer l'icône oeil proprement
  const renderEyeIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      {showPassword ? (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18"
        />
      ) : (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
        />
      )}
    </svg>
  );

  return (
    <div className="drawer-backdrop" onClick={close}>
      <div className="drawer-content" onClick={stopPropagation}>
        <button className="close-btn" onClick={close}>
          ✕
        </button>

        {view === "reset-password" ? (
          <ResetPasswordForm />
        ) : (
          <>
            <div className="drawer-header">
              <h2 className="drawer-title">
                {mode === "login" ? "Connexion" : "Créer un compte"}
              </h2>
            </div>

            <form className="drawer-form" onSubmit={handleSubmit}>
              <div className="input-group">
                <label htmlFor="username">Nom d'utilisateur</label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  value={form.username}
                  onChange={handleChange}
                  className={errors.username ? "input-error" : ""}
                  placeholder={errors.username || "Votre identifiant"}
                  autoComplete="username"
                />
              </div>

              {mode === "register" && (
                <div className="input-group">
                  <label htmlFor="email">Email</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    className={errors.email ? "input-error" : ""}
                    placeholder={errors.email || "votre@email.com"}
                    autoComplete="email"
                  />
                </div>
              )}

              <div className="input-group">
                <label htmlFor="password">Mot de passe</label>
                <div className="password-wrapper">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={handleChange}
                    className={errors.password ? "input-error" : ""}
                    placeholder={errors.password || "••••••••"}
                    autoComplete={
                      mode === "login" ? "current-password" : "new-password"
                    }
                  />
                  <button
                    type="button"
                    className="eye-btn"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label="Afficher le mot de passe"
                  >
                    {renderEyeIcon()}
                  </button>
                </div>
              </div>

              {mode === "register" && (
                <div className="input-group">
                  <label htmlFor="confirmPassword">
                    Confirmez le mot de passe
                  </label>
                  <div className="password-wrapper">
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showPassword ? "text" : "password"}
                      value={form.confirmPassword}
                      onChange={handleChange}
                      className={errors.confirmPassword ? "input-error" : ""}
                      placeholder={errors.confirmPassword || "••••••••"}
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      className="eye-btn"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label="Afficher le mot de passe"
                    >
                      {renderEyeIcon()}
                    </button>
                  </div>
                </div>
              )}

              {mode === "login" && (
                <button
                  type="button"
                  className="forgot-btn"
                  onClick={() =>
                    dispatch(switchAuthModalView("reset-password"))
                  }
                >
                  Mot de passe oublié ?
                </button>
              )}

              <button type="submit" className="submit-btn" disabled={loading}>
                {loading
                  ? "Chargement..."
                  : mode === "login"
                    ? "Se connecter"
                    : "S'inscrire"}
              </button>
            </form>

            <div className="drawer-footer">
              {mode === "login" ? (
                <>
                  <span>Pas encore de compte ?</span>
                  <button
                    type="button"
                    className="toggle-btn"
                    onClick={() => {
                      setMode("register");
                      setErrors({});
                    }}
                  >
                    Créer un compte gratuit
                  </button>
                </>
              ) : (
                <>
                  <span>Déjà un compte ?</span>
                  <button
                    type="button"
                    className="toggle-btn"
                    onClick={() => {
                      setMode("login");
                      setErrors({});
                    }}
                  >
                    Connectez-vous
                  </button>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
