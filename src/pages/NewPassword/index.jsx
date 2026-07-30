import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

export default function NewPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const key = searchParams.get("key");
  const login = searchParams.get("login");

  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/wp-json/custom/v1/new-password`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key, login, password }),
      },
    );
    const data = await response.json();
    setMessage(data.message);
    if (response.ok) navigate("/");
  };

  return (
    <main>
      <h1>Nouveau mot de passe</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="password">Nouveau mot de passe</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Confirmer</button>
      </form>
      {message && <p>{message}</p>}
    </main>
  );
}
