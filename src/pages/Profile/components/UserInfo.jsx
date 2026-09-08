// export function UserInfo({ user }) {
//   return (
//     <section className="profile__section">
//       <h2 className="profile__section-title">Informations Personnelles</h2>
//       <div className="profile__info-grid">
//         {Object.entries(user).map(([key, value]) => (
//           <div key={key} className="profile__info-item">
//             <label className="profile__label">
//               {key === 'firstName' ? 'Prénom' : key === 'lastName' ? 'Nom' : key === 'username' ? 'Nom d\'utilisateur' : 'Email'}
//             </label>
//             <p className="profile__value">{value}</p>
//           </div>
//         ))}
//       </div>
//       <button className="profile__button profile__button--primary">
//         Modifier mes informations
//       </button>
//     </section>
//   );
// }
import React from "react";

export default function UserInfo() {
  const user = {
    firstName: "Jean",
    lastName: "Dupont",
    email: "jean.dupont@example.com",
    password: "••••••••",
  };

  return (
    <div>
      <h2 className="section-title">Informations Personnelles</h2>
      <div className="data-grid">
        <div className="data-item">
          <span className="data-label">Prénom</span>
          <span className="data-value">{user.firstName}</span>
        </div>
        <div className="data-item">
          <span className="data-label">Nom</span>
          <span className="data-value">{user.lastName}</span>
        </div>
        <div className="data-item">
          <span className="data-label">E-mail</span>
          <span className="data-value">{user.email}</span>
        </div>
        <div className="data-item">
          <span className="data-label">Mot de passe</span>
          <span className="data-value">{user.password}</span>
        </div>
      </div>
      <button className="action-btn">Modifier mes informations</button>
    </div>
  );
}
