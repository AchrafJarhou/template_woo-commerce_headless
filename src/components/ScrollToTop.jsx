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
  // avant la peinture. Avec un effet passif, on apercevrait le haut de la page
  // — donc la vidéo de l'accueil — juste avant le saut vers l'ancre.
  useLayoutEffect(() => {
    const anchor = hash ? document.getElementById(hash.slice(1)) : null;

    if (!anchor) {
      window.scrollTo(0, 0);
      return;
    }

    // La feuille de style globale impose `scroll-behavior: smooth`. On veut
    // arriver au catalogue, pas traverser la vidéo en défilant : on neutralise
    // l'animation le temps du saut. Un style en ligne l'emporte sur la feuille
    // de style, et cette méthode fonctionne partout — contrairement à
    // `behavior: "instant"`, refusé par les navigateurs antérieurs à 2022.
    const root = document.documentElement;
    const previousBehavior = root.style.scrollBehavior;
    root.style.scrollBehavior = "auto";

    // Coordonnées document = position à l'écran + défilement courant. On ne
    // suppose donc pas que la page est déjà en haut au moment du calcul.
    window.scrollTo(0, anchor.getBoundingClientRect().top + window.scrollY);

    root.style.scrollBehavior = previousBehavior;
  }, [pathname, hash]);

  return null;
}
