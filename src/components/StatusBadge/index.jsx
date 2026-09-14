import { useTranslation } from "react-i18next";

// WooCommerce renvoie des codes de statut stables (« on-hold », « refunded »),
// jamais leur libellé. C'est donc le code qu'on traduit : il ne change pas de
// langue, contrairement au texte, et la correspondance vit dans le dictionnaire.
// `defaultValue` laisse passer un statut inconnu tel quel plutôt que d'afficher
// une clé brute à l'écran.
export default function StatusBadge({ status }) {
  const { t } = useTranslation();

  return (
    <span className={`badge badge-${status}`}>
      {t(`status.${status}`, { defaultValue: status })}
    </span>
  );
}