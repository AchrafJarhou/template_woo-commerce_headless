#!/usr/bin/env node
/**
 * Contrôle que chaque page WordPress a la même forme dans les deux langues.
 *
 *   node scripts/pages-parity.mjs                  pages publiées
 *   node scripts/pages-parity.mjs --en-dir <dir>   version anglaise lue dans
 *                                                  <dir>/<slug>-en.html quand
 *                                                  le fichier existe
 *
 * Le site construit ses accordéons à partir des titres du contenu. Une page
 * anglaise saisie en simples paragraphes s'affiche donc à plat, sans erreur :
 * le défaut ne se voit qu'en comparant les deux langues. On compare la forme
 * — suite des blocs, niveaux de titre, listes, gras, italique, liens, code,
 * retours à la ligne — jamais les mots.
 *
 * Aucune dépendance autre que Vite, déjà présent, pour lire VITE_API_URL
 * exactement comme le fait l'application.
 */
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { loadEnv } from "vite";

const PAGES_DIR = "src/pages";
const MARKS = ["li", "strong", "em", "a", "code", "br"];
const BLOCK = /<(h[1-6]|p|ul|ol|table|blockquote|pre|figure)\b[^>]*>([\s\S]*?)<\/\1>/g;
const MAX_REPORTED = 5;

const enDirIndex = process.argv.indexOf("--en-dir");
const enDir = enDirIndex === -1 ? null : process.argv[enDirIndex + 1];

const { VITE_API_URL } = loadEnv("development", process.cwd(), "VITE_");
if (!VITE_API_URL) {
  console.error("VITE_API_URL introuvable : renseignez-le dans .env.development.");
  process.exit(2);
}

// Même règle que localizedPageSlug (src/i18n/index.js) : la traduction d'une
// page est une autre page, suffixée par sa langue.
const englishSlug = (slug) => `${slug}-en`;

const listFiles = (dir) =>
  readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? listFiles(path) : [path];
  });

// Les pages éditoriales sont déclarées par leur slug dans src/pages : la liste
// suit donc le site sans avoir à être tenue à jour ici.
const slugs = [
  ...new Set(
    listFiles(PAGES_DIR)
      .filter((path) => path.endsWith(".jsx"))
      .flatMap((path) =>
        [...readFileSync(path, "utf8").matchAll(/slug="([^"]+)"/g)].map((m) => m[1]),
      ),
  ),
].sort();

const decode = (text) =>
  text
    .replace(/&nbsp;/g, " ")
    .replace(/&rsquo;|&#8217;/g, "’")
    .replace(/&amp;/g, "&")
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)));

const textOf = (html) => decode(html.replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim();

// Forme d'une page : un élément par bloc non vide, par exemple « h3 » ou
// « p strong×1 code×1 ». Les commentaires Gutenberg et les attributs (classes
// de taille de police, couleurs…) sont ignorés.
const shapeOf = (html) =>
  [...html.replace(/<!--[\s\S]*?-->/g, "").matchAll(BLOCK)]
    .map(([, tag, inner]) => ({ tag, inner, text: textOf(inner) }))
    .filter((block) => block.text !== "")
    .map(({ tag, inner, text }) => {
      const marks = MARKS.map((mark) => [mark, inner.match(new RegExp(`<${mark}\\b`, "g"))?.length ?? 0])
        .filter(([, count]) => count > 0)
        .map(([mark, count]) => `${mark}×${count}`);
      return { shape: [tag, ...marks].join(" "), text };
    });

const fetchPage = async (slug) => {
  const url = `${VITE_API_URL}/wp-json/wp/v2/pages?slug=${encodeURIComponent(slug)}&_fields=content`;
  const response = await fetch(url);
  if (!response.ok) throw new Error(`${slug} : HTTP ${response.status}`);
  const [page] = await response.json();
  return page?.content?.rendered ?? null;
};

const readEnglish = async (slug) => {
  const localFile = enDir && join(enDir, `${englishSlug(slug)}.html`);
  if (localFile && existsSync(localFile)) {
    return { html: readFileSync(localFile, "utf8"), source: localFile };
  }
  return { html: await fetchPage(englishSlug(slug)), source: "WordPress" };
};

const excerpt = (block) => (block ? `${block.shape.padEnd(22)} « ${block.text.slice(0, 48)} »` : "(aucun bloc)");

let failures = 0;
console.log(`\nForme des pages FR / EN — ${VITE_API_URL}\n`);

for (const slug of slugs) {
  const [frenchHtml, english] = await Promise.all([fetchPage(slug), readEnglish(slug)]);

  if (frenchHtml === null || english.html === null) {
    failures += 1;
    const missing = [frenchHtml === null && slug, english.html === null && englishSlug(slug)].filter(Boolean);
    console.log(`  ✗ ${slug}\n      page introuvable dans WordPress : ${missing.join(", ")}`);
    continue;
  }

  const french = shapeOf(frenchHtml);
  const englishShape = shapeOf(english.html);
  const length = Math.max(french.length, englishShape.length);
  const gaps = [];
  for (let index = 0; index < length; index += 1) {
    if (french[index]?.shape !== englishShape[index]?.shape) gaps.push(index);
  }

  const origin = english.source === "WordPress" ? "" : `  (EN : ${english.source})`;
  if (gaps.length === 0) {
    console.log(`  ✓ ${slug} — ${french.length} blocs identiques${origin}`);
    continue;
  }

  failures += 1;
  console.log(`  ✗ ${slug} — ${gaps.length} bloc(s) différent(s) sur ${length}${origin}`);
  for (const index of gaps.slice(0, MAX_REPORTED)) {
    console.log(`      bloc ${index + 1}`);
    console.log(`        FR ${excerpt(french[index])}`);
    console.log(`        EN ${excerpt(englishShape[index])}`);
  }
  if (gaps.length > MAX_REPORTED) {
    console.log(`      … et ${gaps.length - MAX_REPORTED} autre(s)`);
  }
}

console.log(
  failures === 0
    ? `\n${slugs.length} pages : forme identique dans les deux langues.\n`
    : `\n${failures} page(s) sur ${slugs.length} à corriger.\n`,
);
process.exit(failures === 0 ? 0 : 1);
