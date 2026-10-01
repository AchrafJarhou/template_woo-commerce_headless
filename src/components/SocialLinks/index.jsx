import { useTranslation } from "react-i18next";
import { SOCIAL_LINKS } from "../../constants/social";
import "./index.scss";

/* Les deux marques sont des tracés, pas des images : elles n'ont donc aucun
   fond — ni blanc, ni noir — et prennent la couleur du texte qui les entoure
   grâce à `currentColor`. Elles restent nettes à toute taille et à tout
   grossissement d'écran, et ne coûtent aucune requête réseau.

   Elles sont dessinées dans le même repère de 24 unités, et leur encre y
   occupe la même hauteur : 19,9 unités sur 24, au même centre. Sans cette
   normalisation, le TikTok — qui remplit sa boîte d'origine de haut en bas —
   paraîtrait 20 % plus grand que l'Instagram à taille de boîte égale. Une
   seule taille suffit donc dans la feuille de style. */

function InstagramIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      aria-hidden="true"
      focusable="false"
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4.5" />
      <circle cx="16.8" cy="7.2" r="1.3" fill="currentColor" stroke="none" />
    </svg>
  );
}

function TikTokIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
      {/* La note est écrite dans un repère de 16 : la transformation la ramène
          à la hauteur d'encre de l'Instagram, centrée dans la même boîte. */}
      <g transform="translate(2 2) scale(1.25)">
        <path d="M9 0h1.98c.144.715.54 1.617 1.235 2.512C12.895 3.389 13.797 4 15 4v2c-1.753 0-3.07-.814-4-1.829V11a5 5 0 1 1-5-5v2a3 3 0 1 0 3 3V0Z" />
      </g>
    </svg>
  );
}

const ICONS = {
  instagram: InstagramIcon,
  tiktok: TikTokIcon,
};

/**
 * Liens vers les comptes de la boutique.
 *
 * @param {Function} [onNavigate] appelé au clic — le menu qui l'affiche s'en
 *                                sert pour se refermer derrière le visiteur.
 */
export default function SocialLinks({ onNavigate }) {
  const { t } = useTranslation();

  return (
    <ul className="social-links">
      {SOCIAL_LINKS.map(({ id, href }) => {
        const Icon = ICONS[id];
        // Un compte ajouté aux constantes sans dessin correspondant ne doit pas
        // faire tomber le menu : il est simplement ignoré.
        if (!Icon) return null;

        return (
          <li key={id} className="social-links__item">
            <a
              className="social-links__link"
              href={href}
              target="_blank"
              /* noopener : la page ouverte n'obtient aucune prise sur la nôtre.
                 noreferrer : elle n'apprend pas d'où vient le visiteur. */
              rel="noopener noreferrer"
              aria-label={t(`social.${id}`)}
              onClick={onNavigate}
            >
              <Icon />
            </a>
          </li>
        );
      })}
    </ul>
  );
}
