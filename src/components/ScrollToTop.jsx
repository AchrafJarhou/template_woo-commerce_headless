import { useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Repositionne la page à chaque navigation.
 *
 * Deux cas, un seul responsable : sans ancre on revient en haut, avec une
 * ancre on se cale sur l'élément visé. Laisser deux composants décider du
 * défilement mènerait à une course dont l'issue dépendrait de l'ordre des
 * effets — donc de détails d'implémentation de React.
 */
export default function ScrollToTop() {
  const { pathname, hash } = useLocation();

  // useLayoutEffect et non useEffect : le repositionnement doit être appliqué
  // avant la peinture. Avec un effet passif, on apercevrait la nouvelle page à
  // la hauteur de l'ancienne — ou la vidéo de l'accueil — juste avant le saut.
  useLayoutEffect(() => {
    const anchor = hash ? document.getElementById(hash.slice(1)) : null;

    // Coordonnées document = position à l'écran + défilement courant. On ne
    // suppose donc pas que la page est déjà en haut au moment du calcul.
    const top = anchor
      ? anchor.getBoundingClientRect().top + window.scrollY
      : 0;

    // La feuille de style globale impose `scroll-behavior: smooth`, prévu pour
    // les liens internes à une page. Une nouvelle page doit apparaître à sa
    // position, pas y défiler : sinon on la verrait remonter depuis la hauteur
    // où l'on se trouvait sur la précédente, ou traverser la vidéo pour
    // atteindre le catalogue. Un style en ligne l'emporte sur la feuille de
    // style, et cette méthode fonctionne partout — contrairement à
    // `behavior: "instant"`, refusé par les navigateurs antérieurs à 2022.
    const root = document.documentElement;
    const previousBehavior = root.style.scrollBehavior;
    root.style.scrollBehavior = "auto";

    window.scrollTo(0, top);

    root.style.scrollBehavior = previousBehavior;
  }, [pathname, hash]);

  return null;
}
