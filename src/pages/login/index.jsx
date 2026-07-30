import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import { loginThunk } from "../../thunkActionsCreator/userThunks";
import AuthModal from "../../components/AuthModal";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, token } = useSelector((state) => state.user);

  const [form, setForm] = useState({ username: "", password: "" });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (token) navigate("/");
  }, [navigate, token]);

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
    <AuthModal>
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

        <a
          className="auth-form__forgot"
          href="https://l-araignee.net/wooc/wp-login.php?action=lostpassword"
        >
          Forgot password?
        </a>

        {error && <p className="auth-form__server-error">{error}</p>}

        <button className="auth-form__submit" type="submit" disabled={loading}>
          {loading ? "Signing in…" : "Sign in"}
        </button>
        <Link to="/reset-password">Mot de passe oublié ?</Link>
        <button type="submit" disabled={loading}>
          {loading ? "Loading..." : "Login"}
        </button>
      </form>

      <p className="auth-modal__footer">
        No account? <Link to="/register">Register here</Link>
      </p>
    </AuthModal>
  );
}
