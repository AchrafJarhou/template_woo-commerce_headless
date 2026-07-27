import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { deleteCurrentUserThunk } from "../../thunkActionsCreator/userThunks";

export default function DeleteAccountButton() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.user);
  const [password, setPassword] = useState("");

  const handleDelete = (e) => {
    e.preventDefault();

    const confirmed = window.confirm(
      "Êtes-vous sûr de vouloir supprimer définitivement votre compte ? Cette action est irréversible.",
    );

    if (confirmed) {
      dispatch(deleteCurrentUserThunk({ password }))
        .unwrap()
        .then(() => {
          alert("Votre compte a été supprimé avec succès.");
          navigate("/"); // Redirection vers l'accueil après suppression
        })
        .catch((err) => {
          console.error("Erreur lors de la suppression :", err);
        });
    }
  };

  return (
    <form className="delete-account-section" onSubmit={handleDelete}>
      <input
        type="password"
        placeholder="mot de passe (confirmation)"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button
        type="submit"
        disabled={loading}
        style={{ backgroundColor: "red", color: "white" }}
      >
        {loading ? "Suppression en cours..." : "Supprimer mon compte"}
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}
    </form>
  );
}
