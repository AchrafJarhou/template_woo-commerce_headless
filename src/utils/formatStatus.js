// Fonction pour traduire le statut technique en texte utilisateur
export const formatStatus = (status) => {
  if (status === "processing" || status === "completed") {
    return "Payé";
  }
  if (status === "pending") {
    return "En attente de paiement";
  }
  if (status === "cancelled") {
    return "Annulé";
  }
  return status; // Par sécurité si un autre statut arrive
};
