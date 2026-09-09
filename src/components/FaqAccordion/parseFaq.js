/* Contrat de contenu, volontairement explicite :
     <h2> ouvre une rubrique, <h3> pose une question, et tout ce qui suit une
     question jusqu'au titre suivant constitue sa réponse.

   Deviner les questions dans la prose (« la phrase se termine par un point
   d'interrogation ») serait fragile : une virgule déplacée dans WordPress
   changerait le comportement de la page. La structure doit exister dans le
   document, pas être reconstituée à chaque affichage. */

export function parseFaq(fragment) {
  const page = { intro: "", sections: [] };
  let section = null;
  let item = null;

  const openSection = (title) => {
    section = { title, intro: "", items: [] };
    item = null;
    page.sections.push(section);
  };

  for (const node of fragment.children) {
    const tag = node.tagName.toLowerCase();

    if (tag === "h2") {
      openSection(node.textContent.trim());
      continue;
    }

    if (tag === "h3") {
      // Une question sans rubrique reste affichable : on lui en ouvre une
      // sans titre plutôt que de la perdre.
      if (!section) openSection("");
      item = { question: node.textContent.trim(), answerHtml: "" };
      section.items.push(item);
      continue;
    }

    if (item) item.answerHtml += node.outerHTML;
    else if (section) section.intro += node.outerHTML;
    else page.intro += node.outerHTML;
  }

  return page;
}

export const countQuestions = (page) =>
  page.sections.reduce((total, section) => total + section.items.length, 0);
