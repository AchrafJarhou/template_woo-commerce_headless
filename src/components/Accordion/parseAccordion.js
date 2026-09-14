/* Découpe un contenu WordPress en panneaux dépliables.

   Le niveau de titre qui porte la structure d'un document est celui auquel
   il se répète : un titre qui n'apparaît qu'une fois est un intitulé, pas
   une section. On retient donc comme niveau de panneau celui qui en produit
   le plus — ce qui donne le bon découpage aussi bien pour une FAQ
   (rubriques en h2, questions en h3) que pour des CGV (articles en h3) ou
   une politique de confidentialité (sections en h2), sans réglage par page.

   Quand les panneaux sont des h3, les h2 restants deviennent des rubriques
   qui les regroupent. Quand les panneaux sont des h2, les h3 sont du
   contenu et restent à l'intérieur du panneau. */

const PANEL_LEVELS = ["H2", "H3"];

export function detectPanelTag(fragment) {
  const counts = { H2: 0, H3: 0 };

  for (const node of fragment.children) {
    const tag = node.tagName.toUpperCase();
    if (PANEL_LEVELS.includes(tag)) counts[tag] += 1;
  }

  // À égalité, le niveau le plus haut l'emporte : il est le plus structurant.
  return counts.H3 > counts.H2 ? "H3" : "H2";
}

export function parseAccordion(fragment, panelTag = detectPanelTag(fragment)) {
  const groupTag = panelTag === "H3" ? "H2" : null;

  const document = { intro: "", groups: [] };
  let group = null;
  let panel = null;

  const openGroup = (title) => {
    group = { title, intro: "", panels: [] };
    panel = null;
    document.groups.push(group);
  };

  for (const node of fragment.children) {
    const tag = node.tagName.toUpperCase();

    if (groupTag && tag === groupTag) {
      openGroup(node.textContent.trim());
      continue;
    }

    if (tag === panelTag) {
      // Un panneau sans rubrique reste affichable : on lui en ouvre une
      // sans titre plutôt que de le perdre.
      if (!group) openGroup("");
      panel = { title: node.textContent.trim(), bodyHtml: "" };
      group.panels.push(panel);
      continue;
    }

    if (panel) panel.bodyHtml += node.outerHTML;
    else if (group) group.intro += node.outerHTML;
    else document.intro += node.outerHTML;
  }

  return document;
}

export const countPanels = (document) =>
  document.groups.reduce((total, group) => total + group.panels.length, 0);
