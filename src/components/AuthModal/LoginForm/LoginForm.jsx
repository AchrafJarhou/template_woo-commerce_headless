import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { loginThunk } from "../../../thunkActionsCreator/userThunks";
import { closeAuthModal, switchAuthModalView } from "../../../slices/authModalSlice";

export default function LoginForm() {
  const dispatch = useDispatch();
  const { loading, error, token } = useSelector((state) => state.user);

  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (token) dispatch(closeAuthModal());
  }, [dispatch, token]);

  const validate = () => {
    const newErrors = {};
    if (!form.username.trim() && !form.email.trim()) {
      newErrors.username = "Renseignez un nom d'utilisateur ou un e-mail.";
      newErrors.email = "Renseignez un nom d'utilisateur ou un e-mail.";
    }
    if (!form.password) newErrors.password = "Le mot de passe est requis.";
    else if (form.password.length < 8)
      newErrors.password = " Il faut au moins 8 caractères.";
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validation = validate();
    if (Object.keys(validation).length > 0) {
      setErrors(validation);
      return;
    }
    const identifier = form.username.trim() || form.email.trim();
    dispatch(loginThunk({ username: identifier, password: form.password }));
  };

  return (
    <>
      <h1>Bonjour</h1>
      <p className="auth-modal__subtitle">Identifiez-vous</p>

      <form className="auth-form" onSubmit={handleSubmit} noValidate>
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

        <p className="auth-modal__subtitle">
          Un seul des deux suffit pour vous connecter.
        </p>

        <div className="auth-form__field">
          <label htmlFor="password">Mot de passe </label>
          <input
            id="password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            className={errors.password ? "input--error" : ""}
            autoComplete="current-password"
          />
          {errors.password && (
            <span className="auth-form__error">{errors.password}</span>
          )}
        </div>

        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <button
            type="button"
            className="auth-form__forgot"
            onClick={() => dispatch(switchAuthModalView("register"))}
          >
            Vous n'avez pas de compte ?
          </button>
          <button
            type="button"
            className="auth-form__forgot"
            onClick={() => dispatch(switchAuthModalView("reset-password"))}
          >
            Vous avez oublié votre mot de passe ?
          </button>
        </div>

        {error && (
          <p
            className="auth-form__server-error"
            dangerouslySetInnerHTML={{ __html: error }}
          />
        )}

        <button className="auth-form__submit" type="submit" disabled={loading}>
          {loading ? "Signing in…" : "Se connecter"}
        </button>
      </form>
    </>
  );
}
