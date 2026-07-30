import { useState } from "react";

export default function ResetPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => { 
    e.preventDefault();
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/wp-json/custom/v1/reset-password`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      }
    );
    const data = await response.json();
    setMessage(data.message);
  };

  return (
    <main>
      <h1>Mot de passe oublié</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="email">Votre email</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit">Envoyer le lien</button>
      </form>
      {message && <p>{message}</p>}
    </main>
  );
}
