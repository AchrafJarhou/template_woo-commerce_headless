import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCurrentUserThunk,
  updateCurrentUserThunk,
  deleteCurrentUserThunk,
} from "../../../thunkActionsCreator/userThunks"; // À ajuster selon ton arborescence
import { showToast } from "../../../slices/toastSlice"; // À ajuster selon ton arborescence

export default function UserInfo() {
  const dispatch = useDispatch();

  const user = useSelector((state) => state.user);
  const profile = user?.profile;
  const loading = useSelector((state) => state.user.loading);
  const error = useSelector((state) => state.user.error);

  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "••••••••",
  });
  const [savedUser, setSavedUser] = useState(formData);

  // Nouveaux états pour la suppression du compte
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");

  useEffect(() => {
    dispatch(fetchCurrentUserThunk());
  }, [dispatch]);

  useEffect(() => {
    if (profile) {
      const loadedData = {
        firstName: profile.firstName || "",
        lastName: profile.lastName || "",
        email: profile.email || "",
        password: "••••••••",
      };
      setFormData(loadedData);
      setSavedUser(loadedData);
    }
  }, [profile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    const updatePayload = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
    };

    if (formData.password !== "••••••••") {
      updatePayload.password = formData.password;
    }

    // Utilisation de unwrap() pour gérer le succès ou l'échec du Thunk
    dispatch(updateCurrentUserThunk(updatePayload))
      .unwrap()
      .then(() => {
        dispatch(showToast("Profil mis à jour avec succès !"));
        setSavedUser(formData);
        setIsEditing(false);
      })
      .catch((err) => {
        dispatch(showToast(err || "Erreur lors de la mise à jour du profil."));
      });
  };

  const handleCancel = () => {
    setFormData(savedUser);
    setIsEditing(false);
  };

  // --- LOGIQUE DE SUPPRESSION ---
  const handleConfirmDelete = () => {
    if (!deletePassword) {
      dispatch(showToast("Veuillez saisir votre mot de passe pour confirmer."));
      return;
    }

    dispatch(deleteCurrentUserThunk({ password: deletePassword }))
      .unwrap()
      .then(() => {
        dispatch(showToast("Votre compte a été supprimé."));
        // L'utilisateur est supprimé, il faudra le rediriger vers l'accueil
        // ou vider le store via un window.location.href = "/"
      })
      .catch((err) => {
        dispatch(
          showToast(
            err || "Mot de passe incorrect ou erreur lors de la suppression.",
          ),
        );
      });
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
    setDeletePassword(""); // On vide le champ par sécurité
  };

  if (loading && !profile)
    return (
      <p style={{ marginTop: "20px" }}>Chargement de vos informations...</p>
    );
  if (error) return <p style={{ color: "red" }}>Erreur: {error}</p>;

  return (
    <div>
      <h2 className="section-title">Informations Personnelles</h2>
      <div className="data-grid">
        <div className="data-item">
          <span className="data-label">Prénom</span>
          {isEditing ? (
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="data-input"
            />
          ) : (
            <span className="data-value">{formData.firstName}</span>
          )}
        </div>

        <div className="data-item">
          <span className="data-label">Nom</span>
          {isEditing ? (
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="data-input"
            />
          ) : (
            <span className="data-value">{formData.lastName}</span>
          )}
        </div>

        <div className="data-item">
          <span className="data-label">E-mail</span>
          {isEditing ? (
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="data-input"
            />
          ) : (
            <span className="data-value">{formData.email}</span>
          )}
        </div>

        <div className="data-item">
          <span className="data-label">Mot de passe</span>
          {isEditing ? (
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="data-input"
            />
          ) : (
            <span className="data-value">{formData.password}</span>
          )}
        </div>
      </div>

      <div className="action-buttons">
        {isEditing ? (
          <>
            <button
              className="action-btn"
              onClick={handleSave}
              disabled={loading}
            >
              {loading ? "Enregistrement..." : "Enregistrer"}
            </button>
            <button className="action-btn outline" onClick={handleCancel}>
              Annuler
            </button>
          </>
        ) : (
          <button className="action-btn" onClick={() => setIsEditing(true)}>
            Modifier mes informations
          </button>
        )}
      </div>

      {/* --- ZONE DE DANGER --- */}
      <div className="danger-divider">
        <h2 className="section-title">Supprimer mon compte</h2>

        {/* Bascule conditionnelle entre le bouton initial et l'input de confirmation */}
        {!showDeleteConfirm ? (
          <>
            <p className="text-delete-account">
              La suppression de votre compte est irréversible. Toutes vos
              données seront effacées.
            </p>
            <button
              className="action-btn outline"
              onClick={() => setShowDeleteConfirm(true)}
            >
              Supprimer mon compte
            </button>
          </>
        ) : (
          <div>
            <p className="delete-confirmation-message">
              Action irréversible. Veuillez confirmer avec votre mot de passe :
            </p>
            <input
              type="password"
              value={deletePassword}
              onChange={(e) => setDeletePassword(e.target.value)}
              placeholder="Votre mot de passe"
              className="data-input"
            />
            <div className="action-buttons">
              <button className="action-btn" onClick={handleConfirmDelete}>
                Confirmer la suppression
              </button>
              <button
                className="action-btn outline"
                onClick={handleCancelDelete}
              >
                Annuler
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
