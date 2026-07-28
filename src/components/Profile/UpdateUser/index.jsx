import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { updateCurrentUserThunk } from "../../../thunkActionsCreator/userThunks";

export function UpdateForm() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const profile = user?.profile;
  const [newEmail, setNewEmail] = useState("");
  const [newFirstName, setNewFirstName] = useState("");
  const [newLastName, setNewLastName] = useState("");
  const [newPassword, setNewPassword] = useState("");
  useEffect(() => {
    profile && profile.email ? setNewEmail(profile.email) : null;
    profile && profile.firstName ? setNewFirstName(profile.firstName) : null;
    profile && profile.lastName ? setNewLastName(profile.lastName) : null;
  }, [profile]);

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
    <div>
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
    </div>
  );
}
