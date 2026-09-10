import React, { useRef, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../../../slices/userSlice";
import { showToast } from "../../../slices/toastSlice";

export default function ProfileNavigation({ activeTab, onTabChange }) {
  const tabs = [
    { id: "profil", label: "Mon Profil" },
    { id: "adresses", label: "Carnet d'adresses" },
    { id: "commandes", label: "Mes Commandes" },
  ];

  const navRef = useRef(null);
  const [indicatorStyle, setIndicatorStyle] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // La barre du header n'expose plus de menu : c'est ici que la déconnexion
  // se fait désormais. `logout` vide aussi le jeton de panier invité, via
  // l'écouteur du store — la session suivante repart d'un panier propre.
  const handleLogout = () => {
    dispatch(logout());
    dispatch(showToast("Vous avez été déconnecté"));
    navigate("/");
  };

  // Met à jour la position de la ligne animée
  useEffect(() => {
    const updateIndicator = () => {
      if (window.innerWidth >= 768 && navRef.current) {
        const activeBtn = navRef.current.querySelector(
          `button[data-id="${activeTab}"]`,
        );
        if (activeBtn) {
          setIndicatorStyle({
            left: activeBtn.offsetLeft + "px",
            width: activeBtn.clientWidth + "px",
          });
        }
      }
    };

    updateIndicator();
    // Recalcule au redimensionnement de la fenêtre
    window.addEventListener("resize", updateIndicator);
    return () => window.removeEventListener("resize", updateIndicator);
  }, [activeTab]);

  return (
    <nav className="profile-nav" ref={navRef}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          data-id={tab.id}
          className={activeTab === tab.id ? "active" : ""}
          onClick={() => onTabChange(tab.id)}
        >
          {tab.label}
        </button>
      ))}
      {/* La ligne qui glisse */}
      <div className="nav-indicator" style={indicatorStyle} />

      <button className="logout-btn" onClick={handleLogout}>
        Déconnexion
      </button>
    </nav>
  );
}
