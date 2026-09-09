/**
 * Cibles de navigation partagées entre plusieurs composants distants.
 *
 * L'ancre du catalogue est posée par CatalogSection et visée par le panier :
 * la chaîne doit être identique des deux côtés, elle n'est donc écrite qu'ici.
 */

/** Identifiant DOM de la section catalogue, sur la page d'accueil. */
export const HOME_CATALOG_ANCHOR = "catalogue";

/**
 * Destination prête pour <Link> : la page d'accueil, cadrée d'emblée sur son
 * catalogue. Le catalogue de l'accueil et la page /catalogue sont deux écrans
 * distincts — c'est bien le premier que vise cette constante.
 */
export const HOME_CATALOG_PATH = `/#${HOME_CATALOG_ANCHOR}`;
