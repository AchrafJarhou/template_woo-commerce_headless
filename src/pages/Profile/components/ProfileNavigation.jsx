import React, { useRef, useEffect, useState } from "react";

export default function ProfileNavigation({ activeTab, onTabChange }) {
  const tabs = [
    { id: "profil", label: "Mon Profil" },
    { id: "adresses", label: "Carnet d'adresses" },
    { id: "commandes", label: "Mes Commandes" },
  ];

  const navRef = useRef(null);
  const [indicatorStyle, setIndicatorStyle] = useState({});

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

      <button className="logout-btn" onClick={() => alert("Déconnexion...")}>
        Déconnexion
      </button>
    </nav>
  );
}
