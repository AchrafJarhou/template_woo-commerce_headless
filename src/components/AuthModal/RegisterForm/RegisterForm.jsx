import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { registerThunk } from "../../../thunkActionsCreator/userThunks";
import { closeAuthModal, switchAuthModalView } from "../../../slices/authModalSlice";

export default function RegisterForm() {
  const dispatch = useDispatch();
  const { loading, error, token } = useSelector((state) => state.user);

  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (token) dispatch(closeAuthModal());
  }, [dispatch, token]);

  const validateStep1 = () => {
    const newErrors = {};
    if (!form.username.trim())
      newErrors.username = "Le nom d'utilisateur est requis.";
    if (!form.email.trim()) {
      newErrors.email = "L'adresse e-mail est requise.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Entrez une adresse e-mail valide.";
    }
    if (!form.password) {
      newErrors.password = "Le mot de passe est requis.";
    } else if (form.password.length < 8) {
      newErrors.password = "Au moins 8 caractères.";
    }
    return newErrors;
  };

  const validateStep2 = () => {
    const newErrors = {};
    if (!form.confirmPassword) {
      newErrors.confirmPassword = "Veuillez confirmer votre mot de passe.";
    } else if (form.confirmPassword !== form.password) {
      newErrors.confirmPassword = "Les mots de passe ne correspondent pas.";
    }
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleBack = () => {
    setErrors({});
    setStep(1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (step === 1) {
      const validation = validateStep1();
      if (Object.keys(validation).length > 0) {
        setErrors(validation);
        return;
      }
      setErrors({});
      setStep(2);
      return;
    }

    const validation = validateStep2();
    if (Object.keys(validation).length > 0) {
      setErrors(validation);
      return;
    }
    const { confirmPassword, ...payload } = form;
    dispatch(registerThunk(payload));
  };

  return (
    <>
      <h1>Créer un compte</h1>
      <p className="auth-modal__subtitle">
        {step === 1
          ? "Rejoignez-nous"
          : "Confirmez votre mot de passe"}
      </p>

      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        {step === 1 && (
          <>
            <div className="auth-form__field">
              <label htmlFor="username">Nom d'utilisateur</label>
              <input
                id="username"
                name="username"
                type="text"
                value={form.username}
                onChange={handleChange}
                className={errors.username ? "input--error" : ""}
                autoComplete="username"
              />
              {errors.username && (
                <span className="auth-form__error">{errors.username}</span>
              )}
            </div>

            <div className="auth-form__field">
              <label htmlFor="email">E-mail</label>
              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                className={errors.email ? "input--error" : ""}
                autoComplete="email"
              />
              {errors.email && (
                <span className="auth-form__error">{errors.email}</span>
              )}
            </div>

            <div className="auth-form__field">
              <label htmlFor="password">Mot de passe</label>
              <input
                id="password"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                className={errors.password ? "input--error" : ""}
                autoComplete="new-password"
              />
              {errors.password && (
                <span className="auth-form__error">{errors.password}</span>
              )}
            </div>
          </>
        )}

        {step === 2 && (
          <div className="auth-form__field">
            <label htmlFor="confirmPassword">Confirmez le mot de passe</label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={form.confirmPassword}
              onChange={handleChange}
              className={errors.confirmPassword ? "input--error" : ""}
              autoComplete="new-password"
              autoFocus
            />
            {errors.confirmPassword && (
              <span className="auth-form__error">{errors.confirmPassword}</span>
            )}
          </div>
        )}

        {error && (
          <p
            className="auth-form__server-error"
            dangerouslySetInnerHTML={{ __html: error }}
          />
        )}

        {step === 2 && (
          <button
            type="button"
            className="auth-form__forgot"
            onClick={handleBack}
          >
            Retour
          </button>
        )}

        <button className="auth-form__submit" type="submit" disabled={loading}>
          {step === 1
            ? "Suivant"
            : loading
              ? "Création du compte…"
              : "Créer le compte"}
        </button>
      </form>

      <p className="auth-modal__footer">
        <button
          type="button"
          className="auth-modal__link"
          onClick={() => dispatch(switchAuthModalView("login"))}
        >
          Vous avez déjà un compte ? Se connecter
        </button>
      </p>
    </>
  );
}
