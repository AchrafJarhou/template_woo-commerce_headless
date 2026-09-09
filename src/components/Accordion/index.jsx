import { useId, useMemo, useState } from "react";
import DOMPurify from "dompurify";
import { parseAccordion, countPanels } from "./parseAccordion";
import "./index.scss";

export default function Accordion({ html, lang }) {
  const baseId = useId();
  // Un seul panneau ouvert pour toute la page : en ouvrir un referme le
  // précédent, où qu'il se trouve. Une clé ne peut pas valoir deux choses.
  const [openKey, setOpenKey] = useState(null);

  const document = useMemo(
    () => parseAccordion(DOMPurify.sanitize(html, { RETURN_DOM_FRAGMENT: true })),
    [html],
  );

  // Contenu sans titres exploitables : on rend la page telle quelle plutôt
  // que d'afficher un accordéon vide.
  if (countPanels(document) === 0) {
    return (
      <div
        lang={lang}
        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(html) }}
      />
    );
  }

  // Une rubrique unique qui n'introduit aucun contenu propre n'est qu'une
  // enveloppe autour des panneaux : son titre répète celui de la page et
  // n'est pas affiché. Si elle introduit son propre texte, c'est une vraie
  // section — on ne fait jamais disparaître un titre qui porte du contenu.
  const isWrapperTitle = (group) =>
    document.groups.length === 1 && !group.intro;

  return (
    <div className="accordion" lang={lang}>
      {document.intro && (
        <div
          className="accordion__intro"
          dangerouslySetInnerHTML={{ __html: document.intro }}
        />
      )}

      {document.groups.map((group, groupIndex) => (
        <section className="accordion__group" key={group.title || groupIndex}>
          {group.title && !isWrapperTitle(group) && <h2>{group.title}</h2>}

          {group.intro && (
            <div dangerouslySetInnerHTML={{ __html: group.intro }} />
          )}

          {group.panels.map((panel, panelIndex) => {
            const key = `${groupIndex}-${panelIndex}`;
            const isOpen = openKey === key;
            const triggerId = `${baseId}-t${key}`;
            const panelId = `${baseId}-p${key}`;

            return (
              <div className="accordion__item" data-open={isOpen} key={key}>
                <h3 className="accordion__heading">
                  <button
                    type="button"
                    id={triggerId}
                    className="accordion__trigger"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpenKey(isOpen ? null : key)}
                  >
                    <span>{panel.title}</span>
                    <span className="accordion__sign" aria-hidden="true" />
                  </button>
                </h3>

                <div
                  className="accordion__panel"
                  id={panelId}
                  aria-labelledby={triggerId}
                >
                  <div
                    className="accordion__body"
                    dangerouslySetInnerHTML={{ __html: panel.bodyHtml }}
                  />
                </div>
              </div>
            );
          })}
        </section>
      ))}
    </div>
  );
}
