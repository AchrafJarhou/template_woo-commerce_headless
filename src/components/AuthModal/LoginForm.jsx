import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { loginThunk } from "../../thunkActionsCreator/userThunks";
import { closeAuthModal, switchAuthModalView } from "../../slices/authModalSlice";

export default function LoginForm() {
  const dispatch = useDispatch();
  const { loading, error, token } = useSelector((state) => state.user);

  const [form, setForm] = useState({ username: "", password: "" });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (token) dispatch(closeAuthModal());
  }, [dispatch, token]);

  const validate = () => {
    const newErrors = {};
    if (!form.username.trim())
      newErrors.username = "Le nom d'utilisateur est requis.";
    if (!form.password) newErrors.password = "Le mot de passe est requis.";
    else if (form.password.length < 6)
      newErrors.password = "Au moins 6 caractères.";
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
    dispatch(loginThunk(form));
  };

  return (
    <>
      <h1>Welcome back</h1>
      <p className="auth-modal__subtitle">Sign in to your account</p>

      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        <div className="auth-form__field">
          <label htmlFor="username">Username</label>
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
          <label htmlFor="password">Password</label>
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

        <button
          type="button"
          className="auth-form__forgot"
          onClick={() => dispatch(switchAuthModalView("reset-password"))}
        >
          Forgot password?
        </button>

        {error && (
          <p
            className="auth-form__server-error"
            dangerouslySetInnerHTML={{ __html: error }}
          />
        )}

        <button className="auth-form__submit" type="submit" disabled={loading}>
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>

      <p className="auth-modal__footer">
        No account?{" "}
        <button
          type="button"
          className="auth-modal__link"
          onClick={() => dispatch(switchAuthModalView("register"))}
        >
          Register here
        </button>
      </p>
    </>
  );
}
