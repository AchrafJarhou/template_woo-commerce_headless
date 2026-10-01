import "./index.scss";

/**
 * Choix exclusif entre quelques options côte à côte. L'option active est
 * remplie d'encre, et ce remplissage glisse jusqu'à l'option cliquée.
 *
 * Toutes les options ont la même largeur — celle du plus long libellé. Le
 * remplissage se place donc par calcul (rang × largeur d'une option), sans
 * rien mesurer dans la page : il reste juste quand la police finit de
 * charger, quand la langue change ou quand l'écran tourne.
 *
 * @param {string}   label       nom du groupe, lu par les lecteurs d'écran
 * @param {Array}    options     [{ value, label, lang, alternates }]
 *                               `lang` : quand le libellé n'est pas dans la
 *                               langue de la page.
 *                               `alternates` : les autres libellés que
 *                               l'option peut afficher (ses traductions). Leur
 *                               largeur est réservée : le contrôle ne change
 *                               pas de taille quand le libellé change.
 * @param {string}   value       valeur de l'option active
 * @param {Function} onChange    reçoit la valeur de l'option cliquée, même
 *                               si elle est déjà active
 * @param {string}   [className] classe de l'écran hôte : typographie, marges
 *                               et variables --segmented-*
 */
export default function SegmentedControl({
  label,
  options,
  value,
  onChange,
  className,
}) {
  const activeIndex = options.findIndex((option) => option.value === value);

  return (
    <div
      className={
        className ? `segmented-control ${className}` : "segmented-control"
      }
      role="group"
      aria-label={label}
      style={{
        "--segment-count": options.length,
        "--segment-index": activeIndex,
      }}
    >
      {/* Aucun remplissage si la valeur ne désigne aucune option — une
          catégorie disparue après une recherche, par exemple. */}
      {activeIndex !== -1 && (
        <span className="segmented-control__indicator" aria-hidden="true" />
      )}

      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          lang={option.lang}
          className="segmented-control__option"
          aria-pressed={option.value === value}
          onClick={() => onChange(option.value)}
        >
          {option.alternates ? (
            <span className="segmented-control__label">
              <span>{option.label}</span>
              {/* Invisibles, et donc ignorés des lecteurs d'écran : ils ne
                  servent qu'à réserver la largeur. La liste est fixe, l'index
                  suffit comme clé. */}
              {option.alternates.map((text, index) => (
                <span key={index} className="segmented-control__reserve">
                  {text}
                </span>
              ))}
            </span>
          ) : (
            option.label
          )}
        </button>
      ))}
    </div>
  );
}
