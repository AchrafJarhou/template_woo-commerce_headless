#!/usr/bin/env node
/**
 * Contrôle de l'état de la traduction du site.
 *
 *   node scripts/i18n-audit.mjs            rapport
 *   node scripts/i18n-audit.mjs --strict   échoue si la dette a augmenté
 *
 * Trois contrôles indépendants :
 *   1. Parité des dictionnaires  — une clé présente dans fr.json doit exister
 *      dans en.json, et réciproquement. Une clé manquante ne casse rien à
 *      l'écran : i18next retombe sur le français. Le défaut est donc
 *      invisible, et c'est exactement pour ça qu'il faut le mesurer.
 *   2. Chaînes visibles non traduites — tout texte destiné à l'utilisateur
 *      qui ne passe pas par t().
 *   3. Locales figées — un "fr-FR" en dur formate les prix et les dates en
 *      français même quand le site est en anglais.
 *
 * Aucune dépendance : ce fichier doit rester exécutable sur un dépôt frais.
 */
import { readFileSync, readdirSync, statSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const LOCALES = "src/i18n/locales";
const BASELINE = "scripts/i18n-baseline.json";
// Textes volontairement non traduits (marques, sigles, masques de saisie).
// Les déclarer les rend visibles et discutables ; les ignorer en silence
// rendrait la dette impossible à distinguer d'un choix délibéré.
const NEUTRAL = new Set(
  JSON.parse(readFileSync("scripts/i18n-neutral.json", "utf8")).neutral,
);
// Composants non importés : les corriger n'aurait aucun effet à l'écran.
const DEAD = ["src/components/Product/", "src/components/Header/"];
// Jeux de données de démonstration : ce ne sont pas des textes
// d'interface mais du contenu factice, remplacé par l'API en production.
const FIXTURES = /mock|\/data\//i;
const ATTRS = ["aria-label", "placeholder", "alt", "title", "label"];

/* ── 1. Parité des dictionnaires ─────────────────────────────────────────── */
const flatten = (obj, prefix = "") =>
  Object.entries(obj).flatMap(([k, v]) =>
    v && typeof v === "object" ? flatten(v, `${prefix}${k}.`) : [`${prefix}${k}`]);

const locales = readdirSync(LOCALES).filter((f) => f.endsWith(".json"));
const keys = Object.fromEntries(
  locales.map((f) => [f.replace(".json", ""), new Set(flatten(JSON.parse(readFileSync(join(LOCALES, f), "utf8"))))]),
);
const [ref, ...others] = Object.keys(keys);
const parity = [];
for (const lng of others) {
  for (const k of keys[ref]) if (!keys[lng].has(k)) parity.push(`manque dans ${lng}.json : ${k}`);
  for (const k of keys[lng]) if (!keys[ref].has(k)) parity.push(`manque dans ${ref}.json : ${k}`);
}

/* ── 2. Chaînes visibles non traduites ───────────────────────────────────── */
const walk = (dir) =>
  readdirSync(dir).flatMap((f) => {
    const p = join(dir, f).replace(/\\/g, "/");
    if (statSync(p).isDirectory()) return f === "assets" ? [] : walk(p);
    return /\.jsx?$/.test(p) ? [p] : [];
  });

// Ajout des types MIME et en-têtes HTTP : ils prennent la forme d'un
// littéral de chaîne mais ne sont jamais affichés à personne.
const TECHNICAL = /^[\s\d\W]*$|^[a-z0-9_-]+$|^https?:|^\/|^#|^[a-z]+\/[a-z0-9.+-]+$/;
// Verbes HTTP et valeurs CSS : forme d'un littéral, jamais affichés.
const NOT_UI = /^(GET|POST|PUT|PATCH|DELETE|HEAD|OPTIONS)$|^\d+px |[#][0-9a-f]{3,8}\b|^(system-ui|-apple-system)/i;
// Identifiant camelCase (« authModal ») : un nom de code, pas une phrase.
// Un vrai libellé d'interface commence par une majuscule ou contient un espace.
const IDENTIFIER = /^[a-z][a-zA-Z0-9]*$/;
// Un texte d'interface ne commence jamais par une parenthèse fermante et
// ne finit jamais par une ouvrante : ces formes viennent d'un ternaire JSX
// dont le `>` et le `<` encadrent du code, pas du texte.
const CODE = /[;=`]|=>|&&|\|\||\breturn\b|\bconst\b|\bnew\b|\.\w+\(|\}\s*$|^\s*\{|^\)|\($/;
const isVisible = (s) => {
  const t = s.trim();
  if (NEUTRAL.has(t) || NOT_UI.test(t) || IDENTIFIER.test(t)) return false;
  return t.length >= 2 && !TECHNICAL.test(t) && !CODE.test(t) && !t.includes("\n") && /[A-Za-zÀ-ÿ]{2}/.test(t);
};
const stripComments = (s) =>
  s.replace(/\{\s*\/\*[\s\S]*?\*\/\s*\}/g, "").replace(/\/\*[\s\S]*?\*\//g, "").replace(/^[ \t]*\/\/.*$/gm, "");

const untranslated = {};
let tCalls = 0, hardcodedLocale = [];
for (const p of walk("src")) {
  if (DEAD.some((d) => p.startsWith(d)) || p.includes("/i18n/") || FIXTURES.test(p)) continue;
  const raw = readFileSync(p, "utf8");
  tCalls += (raw.match(/\bt\(\s*["'`]/g) || []).length;
  for (const m of raw.matchAll(/["'](fr-FR|fr)["']/g)) {
    if (/toLocaleDateString|toLocaleString|NumberFormat|DateTimeFormat/.test(raw.slice(Math.max(0, m.index - 60), m.index)))
      hardcodedLocale.push(`${p}:${raw.slice(0, m.index).split("\n").length}`);
  }
  const s = stripComments(raw);
  const hits = [];
  for (const m of s.matchAll(/>([^<>{}]+)</g)) if (isVisible(m[1])) hits.push(m[1].trim());
  for (const m of s.matchAll(new RegExp(`\\b(${ATTRS.join("|")})="([^"]*)"`, "g"))) if (isVisible(m[2])) hits.push(m[2]);
  for (const m of s.matchAll(/\b(showToast|alert|setError|setMessage|setStatus)\(\s*["']([^"']+)["']/g)) if (isVisible(m[2])) hits.push(m[2]);
  // Libellés déclarés dans un objet JS — invisibles pour un détecteur de JSX.
  // C'est ainsi que « TOUT » avait échappé au premier passage.
  for (const m of s.matchAll(/\b(label|title|heading|placeholder)\s*:\s*["']([^"']+)["']/g))
    if (isVisible(m[2])) hits.push(m[2]);

  // [rule:jsx-ternary] Chaînes rendues depuis un ternaire JSX :
  //   {loading ? <Loader /> : "Voir plus"}
  // Ce ne sont ni des noeuds de texte ni des attributs : les autres passes
  // les ignorent. On écarte les listes de classes CSS, tout en minuscules,
  // qui prennent exactement la même forme dans un className.
  for (const m of s.matchAll(/[?:]\s*["']([^"']{2,})["']/g))
    if (isVisible(m[1]) && !/^[a-z0-9 _-]+$/.test(m[1].trim())) hits.push(m[1]);
  for (const m of s.matchAll(/(?:new Error|rejectWithValue|\|\|)\s*\(?\s*["']([^"']{6,})["']/g))
    if (isVisible(m[1]) && /[À-ÿ]|\b(le|la|les|une|un|des|est|impossible|erreur|votre|vos)\b/i.test(m[1])) hits.push(m[1]);
  if (hits.length) untranslated[p] = hits;
}
const total = Object.values(untranslated).reduce((n, h) => n + h.length, 0);

/* ── Rapport ─────────────────────────────────────────────────────────────── */
const strict = process.argv.includes("--strict");
const dash = (l, v) => console.log(`  ${l.padEnd(38, ".")} ${v}`);
console.log("\nÉTAT DE LA TRADUCTION\n");
dash("Appels à t() en place", tCalls);
dash("Chaînes visibles non traduites", total);
dash("Fichiers concernés", Object.keys(untranslated).length);
dash("Écarts entre dictionnaires", parity.length);
dash("Locales figées en français", hardcodedLocale.length);
if (parity.length) { console.log("\n  Clés désynchronisées :"); parity.forEach((l) => console.log("    ✗ " + l)); }
if (hardcodedLocale.length) { console.log("\n  Locales en dur :"); [...new Set(hardcodedLocale)].forEach((l) => console.log("    ✗ " + l)); }
if (total) {
  console.log("\n  Fichiers les plus chargés :");
  Object.entries(untranslated).sort((a, b) => b[1].length - a[1].length).slice(0, 10)
    .forEach(([p, h]) => console.log(`    ${String(h.length).padStart(4)}  ${p}`));
}

if (!existsSync(BASELINE)) {
  writeFileSync(BASELINE, JSON.stringify({ untranslated: total, recordedAt: new Date().toISOString().slice(0, 10) }, null, 2) + "\n");
  console.log(`\n  Référence enregistrée dans ${BASELINE} (${total}).`);
} else {
  const b = JSON.parse(readFileSync(BASELINE, "utf8"));
  const delta = total - b.untranslated;
  console.log(`\n  Référence du ${b.recordedAt} : ${b.untranslated} → aujourd'hui ${total} (${delta >= 0 ? "+" : ""}${delta})`);
  if (strict && (delta > 0 || parity.length)) {
    console.error("\n  ÉCHEC : la dette de traduction a augmenté, ou les dictionnaires divergent.\n");
    process.exit(1);
  }
}
console.log();
