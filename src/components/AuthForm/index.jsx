import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  closeAuthModal,
  switchAuthModalView,
} from "../../slices/authModalSlice";
import {
  loginThunk,
  registerThunk,
} from "../../thunkActionsCreator/userThunks";

export default function AuthForm() {
  const dispatch = useDispatch();
  const [mode, setMode] = useState("login");
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const validateLogin = (e) => {
    setErrors({});
    const newErrors = {};
    if (!form.username.trim()) {
      if (e.target.className === "signin") {
        newErrors.username = "Le nom d'utilisateur est requis.";
      } else if (e.target.className === "login" && !form.email.trim()) {
        newErrors.username = "Le nom d'utilisateur est requis.";
      }
    }
    if (e.target.className === "signin") {
      if (!form.email.trim()) {
        newErrors.email = "L'adresse e-mail est requise.";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
        newErrors.email = "Entrez une adresse e-mail valide.";
      }
    }
    if (
      form.email.trim() &&
      e.target.className === "login" &&
      !form.username.trim() &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)
    ) {
      newErrors.email = "Entrez une adresse e-mail valide.";
    }
    if (!form.password) newErrors.password = "Le mot de passe est requis.";
    else if (form.password.length < 8)
      newErrors.password = " Il faut au moins 8 caractères.";
    if (!form.confirmPassword && e.target.className === "signin") {
      newErrors.confirmPassword = "Veuillez confirmer votre mot de passe.";
    } else if (
      form.confirmPassword !== form.password &&
      e.target.className === "signin"
    ) {
      newErrors.confirmPassword = "Les mots de passe ne correspondent pas.";
    }
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = (e) => {
    e.target.className === "login" ? setMode("login") : setMode("register");
    const validation = validateLogin(e);
    if (Object.keys(validation).length > 0) {
      setErrors(validation);
      return;
    }
    if (mode === "login") {
      dispatch(
        loginThunk({ username: form.username.trim(), password: form.password }),
      );
    }
    if (mode === "register") {
      dispatch(
        registerThunk({
          username: form.username.trim(),
          email: form.email.trim(),
          password: form.password,
        }),
        dispatch(closeAuthModal()),
      );
    }
    return;
  };

  return (
    <form className="auth-form">
      <h2>
        {mode === "login"
          ? "Bonjour"
          : mode === "register"
            ? "Créer un compte"
            : "Confirmez votre mot de passe"}
      </h2>
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
      {mode === "register" && (
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
      )}

      <div className="auth-form__field">
        <label htmlFor="password">Mot de passe</label>
        <input
          id="password"
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          className={errors.password ? "input--error" : ""}
          autoComplete={mode === "login" ? "current-password" : "new-password"}
        />
        {errors.password && (
          <span className="auth-form__error">{errors.password}</span>
        )}
      </div>

      {mode === "register" && (
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

      <button
        type="button"
        className="auth-form__forgot"
        onClick={() => dispatch(switchAuthModalView("reset-password"))}
      >
        Vous avez oublié votre mot de passe ?
      </button>
      <div>
        <button
          className="login"
          type="button"
          onClick={(e) => handleSubmit(e)}
        >
          Se connecter
        </button>
        <button
          type="button"
          className="signin"
          onClick={(e) => handleSubmit(e)}
        >
          S'inscrire
        </button>{" "}
      </div>
    </form>
  );
}
