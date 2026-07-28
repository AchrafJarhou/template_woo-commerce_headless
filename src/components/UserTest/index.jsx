// COMPOSANT DE TEST TEMPORAIRE - a supprimer une fois la validation terminee
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  loginThunk,
  registerThunk,
  updateCurrentUserThunk,
} from "../../thunkActionsCreator/userThunks";
import { logout } from "../../slices/userSlice";

export default function UserTest() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [regUsername, setRegUsername] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");

  const [newEmail, setNewEmail] = useState("");
  const [newFirstName, setNewFirstName] = useState("");
  const [newLastName, setNewLastName] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    dispatch(loginThunk({ username, password }));
  };

  const handleRegister = (e) => {
    e.preventDefault();
    dispatch(
      registerThunk({
        username: regUsername,
        email: regEmail,
        password: regPassword,
      }),
    );
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  const handleUpdateProfile = (e) => {
    e.preventDefault();
    dispatch(
      updateCurrentUserThunk({
        email: newEmail || undefined,
        firstName: newFirstName || undefined,
        lastName: newLastName || undefined,
        password: newPassword || undefined,
      }),
    );
  };

  return (
    <div style={{ padding: 20, fontFamily: "monospace" }}>
      <h2>Test temporaire - user</h2>

      <h3>Connexion</h3>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="identifiant"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" disabled={user.loading}>
          {user.loading ? "Connexion..." : "Se connecter"}
        </button>
      </form>

      <h3>Inscription</h3>
      <form onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="identifiant"
          value={regUsername}
          onChange={(e) => setRegUsername(e.target.value)}
        />
        <input
          type="email"
          placeholder="email"
          value={regEmail}
          onChange={(e) => setRegEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="mot de passe"
          value={regPassword}
          onChange={(e) => setRegPassword(e.target.value)}
        />
        <button type="submit" disabled={user.loading}>
          {user.loading ? "Creation..." : "Creer un compte"}
        </button>
      </form>

      <button onClick={handleLogout}>Se deconnecter</button>

      <h3>Modifier le profil</h3>
      <form onSubmit={handleUpdateProfile}>
        <input
          type="email"
          placeholder="nouvel email"
          value={newEmail}
          onChange={(e) => setNewEmail(e.target.value)}
        />
        <input
          type="text"
          placeholder="prenom"
          value={newFirstName}
          onChange={(e) => setNewFirstName(e.target.value)}
        />
        <input
          type="text"
          placeholder="nom"
          value={newLastName}
          onChange={(e) => setNewLastName(e.target.value)}
        />
        <input
          type="password"
          placeholder="nouveau mot de passe"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <button type="submit" disabled={user.loading}>
          {user.loading ? "Mise a jour..." : "Mettre a jour le profil"}
        </button>
      </form>

      <h3>State user actuel :</h3>
      <pre>{JSON.stringify(user, null, 2)}</pre>
    </div>
  );
}
