export function DangerZone() {
  return (
    <section className="profile__section profile__section--danger">
      <h2 className="profile__section-title">Supprimer mon compte</h2>
      <p className="profile__danger-text">
        Une fois votre compte supprimé, il ne pourra pas être récupéré. Veuillez être certain.
      </p>
      <button className="profile__button profile__button--danger">
        Supprimer mon compte
      </button>
    </section>
  );
}
