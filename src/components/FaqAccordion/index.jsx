import { useId, useMemo, useState } from "react";
import DOMPurify from "dompurify";
import { parseFaq, countQuestions } from "./parseFaq";
import "./index.scss";

export default function FaqAccordion({ html, lang }) {
  const baseId = useId();
  // Une seule question ouverte pour toute la page : ouvrir la suivante
  // referme la précédente, où qu'elle se trouve.
  const [openKey, setOpenKey] = useState(null);

  const faq = useMemo(
    () => parseFaq(DOMPurify.sanitize(html, { RETURN_DOM_FRAGMENT: true })),
    [html],
  );

  // Contenu qui ne suit pas le contrat (aucune question balisée) : on rend la
  // page telle quelle plutôt que d'afficher un accordéon vide.
  if (countQuestions(faq) === 0) {
    return (
      <div
        lang={lang}
        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(html) }}
      />
    );
  }

  // Un titre de rubrique unique ne distingue rien : il ne fait que répéter
  // le titre de la page. On ne l'affiche qu'à partir de deux rubriques.
  const showSectionTitles = faq.sections.length > 1;

  return (
    <div className="faq" lang={lang}>
      {faq.intro && (
        <div className="faq__intro" dangerouslySetInnerHTML={{ __html: faq.intro }} />
      )}

      {faq.sections.map((section, sectionIndex) => (
        <section className="faq__section" key={section.title || sectionIndex}>
          {showSectionTitles && section.title && <h2>{section.title}</h2>}

          {section.intro && (
            <div dangerouslySetInnerHTML={{ __html: section.intro }} />
          )}

          {section.items.map((item, itemIndex) => {
            const key = `${sectionIndex}-${itemIndex}`;
            const isOpen = openKey === key;
            const triggerId = `${baseId}-q${key}`;
            const panelId = `${baseId}-a${key}`;

            return (
              <div className="faq__item" data-open={isOpen} key={key}>
                <h3 className="faq__question">
                  <button
                    type="button"
                    id={triggerId}
                    className="faq__trigger"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpenKey(isOpen ? null : key)}
                  >
                    <span>{item.question}</span>
                    <span className="faq__sign" aria-hidden="true" />
                  </button>
                </h3>

                <div
                  className="faq__panel"
                  id={panelId}
                  aria-labelledby={triggerId}
                >
                  <div
                    className="faq__answer"
                    dangerouslySetInnerHTML={{ __html: item.answerHtml }}
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
