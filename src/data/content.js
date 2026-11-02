// src/data/content.js
// Centralized read-only content layer backed by Google Sheets published CSVs.
//
// Bilingual columns: any text column can have an Arabic twin named `<column>_ar`
// (e.g. title_ar, summary_ar). `<column>_en` is accepted as an alias for the
// English column. Blank Arabic cells fall back to English in the UI.
//
// Load order per tab:
//   1. fresh browser cache (localStorage, within CACHE_SECONDS)
//   2. live CSV from Google Sheets
//   3. stale browser cache (last good copy, any age)
//   4. bundled fallback CSV shipped with the site

import Papa from "papaparse";

import profileFallback from "../content/fallback/profile.csv?raw";
import projectsFallback from "../content/fallback/projects.csv?raw";
import experienceFallback from "../content/fallback/experience.csv?raw";
import aboutFallback from "../content/fallback/about.csv?raw";
import skillsFallback from "../content/fallback/skills.csv?raw";
import contactFallback from "../content/fallback/contact.csv?raw";
import statsFallback from "../content/fallback/stats.csv?raw";
import backgroundFallback from "../content/fallback/background.csv?raw";

// ==========================
// CONFIG
// ==========================
const TABS = {
  profile: {
    url: import.meta.env.VITE_SHEET_PROFILE_URL,
    fallback: profileFallback,
    keyValue: true,
  },
  projects: {
    url: import.meta.env.VITE_SHEET_PROJECTS_URL,
    fallback: projectsFallback,
  },
  experience: {
    url: import.meta.env.VITE_SHEET_EXPERIENCE_URL,
    fallback: experienceFallback,
  },
  about: {
    url: import.meta.env.VITE_SHEET_ABOUT_URL,
    fallback: aboutFallback,
  },
  skills: {
    url: import.meta.env.VITE_SHEET_SKILLS_URL,
    fallback: skillsFallback,
  },
  contact: {
    url: import.meta.env.VITE_SHEET_CONTACT_URL,
    fallback: contactFallback,
  },
  stats: {
    url: import.meta.env.VITE_SHEET_STATS_URL,
    fallback: statsFallback,
  },
  background: {
    url: import.meta.env.VITE_SHEET_BACKGROUND_URL,
    fallback: backgroundFallback,
  },
};

// Opening any page with ?refresh skips every cache for that visit
const FORCE_REFRESH =
  typeof window !== "undefined" &&
  new URLSearchParams(window.location.search).has("refresh");

// 0 disables the browser cache (useful while testing sheet edits)
const CACHE_SECONDS = FORCE_REFRESH
  ? 0
  : Number(import.meta.env.VITE_SHEETS_CACHE_SECONDS ?? 300);
const FETCH_TIMEOUT_MS = 8000;
const STORAGE_PREFIX = "sheets:v1:";

const isDev = import.meta.env.DEV;
const log = (...args) => isDev && console.info("[content]", ...args);

// ==========================
// BROWSER CACHE
// ==========================
function readStored(tab, url) {
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + tab);
    if (!raw) return null;
    const entry = JSON.parse(raw);
    // A changed sheet URL invalidates the old copy
    return entry.url === url ? entry : null;
  } catch {
    return null;
  }
}

function writeStored(tab, url, text) {
  try {
    localStorage.setItem(
      STORAGE_PREFIX + tab,
      JSON.stringify({ url, text, savedAt: Date.now() })
    );
  } catch {
    // Storage full or unavailable — caching is best-effort
  }
}

// ==========================
// FETCH + PARSE
// ==========================
async function downloadCsv(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      cache: CACHE_SECONDS === 0 ? "no-store" : "default",
    });

    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const text = await response.text();
    // Unpublished or private sheets answer with an HTML sign-in page
    if (/^\s*</.test(text)) {
      throw new Error("Received HTML instead of CSV — is the tab published as CSV?");
    }

    return text;
  } finally {
    clearTimeout(timer);
  }
}

// "Title EN" / "title_en" -> "title": the English column keeps its plain name
const normalizeHeader = (h) => h.trim().toLowerCase().replace(/\s+/g, "_").replace(/_en$/, "");

// List tabs: first row is the header -> array of objects.
// The array also carries `fields` (the header names) so validators can
// tell an empty tab apart from one with the wrong columns.
function parseCsv(text) {
  const { data, meta } = Papa.parse(text, {
    header: true,
    skipEmptyLines: "greedy",
    transformHeader: normalizeHeader,
    transform: (value) => (typeof value === "string" ? value.trim() : value),
  });
  data.fields = meta.fields || [];
  return data;
}

// Two-column tabs (field | value): reads columns A and B only, header row optional
function parseKeyValueCsv(text) {
  const { data } = Papa.parse(text, { skipEmptyLines: "greedy" });

  return data
    .map(([field = "", value = ""]) => ({
      field: normalizeHeader(field),
      value: value.trim(),
    }))
    .filter(({ field }, i) => field && !(i === 0 && field === "field"));
}

// Each tab is downloaded at most once at a time, and at most once per page view
const inflight = new Map();
const memory = new Map();

async function loadRows(tab, validate) {
  if (memory.has(tab)) return memory.get(tab);
  if (inflight.has(tab)) return inflight.get(tab);

  const request = resolveRows(tab, validate).then((result) => {
    // With caching disabled, every page view refetches
    if (CACHE_SECONDS > 0) memory.set(tab, result);
    return result;
  });

  inflight.set(tab, request);
  request.finally(() => inflight.delete(tab));
  return request;
}

async function resolveRows(tab, validate) {
  const { url, fallback, keyValue } = TABS[tab];

  const attempt = (text, source) => {
    const rows = keyValue ? parseKeyValueCsv(text) : parseCsv(text);
    const data = validate(rows);
    if (data == null) throw new Error(`${tab}: no valid rows`);
    log(`${tab} loaded from ${source}`);
    return { data, source };
  };

  const stored = url ? readStored(tab, url) : null;
  const age = stored ? (Date.now() - stored.savedAt) / 1000 : Infinity;

  if (stored && age < CACHE_SECONDS) {
    try {
      return attempt(stored.text, "browser cache");
    } catch {
      // Corrupt cache entry — fall through to the network
    }
  }

  if (url) {
    try {
      const text = await downloadCsv(url);
      const result = attempt(text, "Google Sheets");
      writeStored(tab, url, text);
      return result;
    } catch (error) {
      console.warn(`[content] ${tab}: live sheet unavailable (${error.message})`);
    }
  } else {
    log(`${tab}: no sheet URL configured`);
  }

  if (stored) {
    try {
      return attempt(stored.text, "stale browser cache");
    } catch {
      // ignore and use the bundled copy
    }
  }

  return attempt(fallback, "bundled fallback");
}

// ==========================
// FIELD HELPERS
// ==========================

// Parsed field/value rows -> plain object
function toRecord(rows) {
  return rows.reduce((record, { field, value }) => {
    record[field] = value;
    return record;
  }, {});
}

// "/" in development, "/rasha-portfolio/" in the GitHub Pages build
const BASE_URL = import.meta.env.BASE_URL;

// Accepts absolute http(s) URLs and site-relative paths ("/images/...").
// Site-relative paths point into public/, so they are prefixed with the base path.
function toUrl(value) {
  if (!value) return "";
  if (/^https?:\/\//i.test(value)) return value;
  if (!value.startsWith("/")) return "";
  return value.startsWith(BASE_URL) ? value : BASE_URL + value.slice(1);
}

// TRUE / yes / 1 / ✓ -> true; blank -> fallbackValue
function toBool(value, fallbackValue = false) {
  if (!value) return fallbackValue;
  return /^(true|yes|y|1|x|✓)$/i.test(value);
}

// Blank or non-numeric -> Infinity, so those rows sort last
function toOrder(value) {
  const n = Number(value);
  return value !== "" && value != null && Number.isFinite(n) ? n : Infinity;
}

// List cells: items separated by "|" or line breaks (and commas when allowed)
function toList(value, { commas = false } = {}) {
  if (!value) return [];
  const separator = commas ? /[|\n,]/ : /[|\n]/;
  return value
    .split(separator)
    .map((item) => item.trim())
    .filter(Boolean);
}

// Stable sort by display_order; rows without one keep sheet order at the end
function byDisplayOrder(items) {
  return items
    .map((item, index) => ({ item, index }))
    .sort((a, b) => a.item.display_order - b.item.display_order || a.index - b.index)
    .map(({ item }) => item);
}

// Arabic twin of a text column (blank when the sheet doesn't have it)
function arabic(row, column) {
  return row[`${column}_ar`] || "";
}

// Rows must have the required column, otherwise the tab is treated as invalid
function hasColumns(rows, ...required) {
  return required.every((name) => rows.fields?.includes(name));
}

// Shared rules for every row-based tab:
//   - the tab must have the `required` column, otherwise it is invalid (null)
//   - rows with a blank `required` cell or is_active = FALSE are skipped
//   - every item gets a unique, stable id (for React keys) and a display_order
//   - items are sorted by display_order
function toItems(rows, required, mapRow) {
  if (!hasColumns(rows, required)) return null;

  const usedIds = new Set();

  const items = rows
    .filter((row) => row[required] && toBool(row.is_active, true))
    .map((row, index) => {
      let id = row.id || String(index + 1);
      if (usedIds.has(id)) id = `${id}-${index + 1}`;
      usedIds.add(id);

      return { ...mapRow(row), id, display_order: toOrder(row.display_order) };
    });

  return byDisplayOrder(items);
}

// ==========================
// PROFILE
// ==========================
// The bundled portrait is used when the sheet's image_url is blank or invalid
const DEFAULT_PROFILE_IMAGE = toUrl(toRecord(parseKeyValueCsv(profileFallback)).image_url);

function validateProfile(rows) {
  const record = toRecord(rows);
  if (!record.name) return null;

  return {
    name: record.name,
    role: record.role || "",
    tagline: record.tagline || "",
    bio: record.bio || "",
    image_url: toUrl(record.image_url) || DEFAULT_PROFILE_IMAGE,
    name_ar: arabic(record, "name"),
    role_ar: arabic(record, "role"),
    tagline_ar: arabic(record, "tagline"),
    bio_ar: arabic(record, "bio"),
  };
}

// { name, role, tagline, bio, image_url, *_ar } — bio paragraphs are separated by line breaks
export async function getProfile() {
  const { data } = await loadRows("profile", validateProfile);
  return data;
}

// ==========================
// PROJECTS
// ==========================
// Optional `platform` column: web | mobile | website (the label on project cards).
// Blank -> guessed from the title and technologies.
const PLATFORMS = ["web", "mobile", "website"];

function toPlatform(value, title, stack) {
  const explicit = (value || "").toLowerCase();
  if (PLATFORMS.includes(explicit)) return explicit;

  const text = [title, ...stack].join(" ").toLowerCase();
  if (/flutter|\bdart\b|kotlin|swift|react native|android|\bios\b|mobile/.test(text)) return "mobile";
  if (/website|landing page|wordpress/.test(text)) return "website";
  return "web";
}

// Sheet columns -> the shape ProjectCard expects:
//   technologies -> stack[], screenshots -> gallery[]
function validateProjects(rows) {
  return toItems(rows, "title", (row) => {
    const stack = toList(row.technologies, { commas: true });

    return {
      title: row.title,
      summary: row.summary || "",
      title_ar: arabic(row, "title"),
      summary_ar: arabic(row, "summary"),
      stack,
      platform: toPlatform(row.platform, row.title, stack),
      cover_url: toUrl(row.cover_url),
      gallery: toList(row.screenshots).map(toUrl).filter(Boolean),
      demo_url: toUrl(row.demo_url),
      github_url: toUrl(row.github_url),
      featured: toBool(row.featured),
    };
  });
}

// Active projects, sorted by display_order
export async function getProjects() {
  const { data } = await loadRows("projects", validateProjects);
  return data;
}

// Active projects with featured = TRUE (same request and cache as getProjects)
export async function getFeaturedProjects() {
  const projects = await getProjects();
  return projects.filter((p) => p.featured);
}

// ==========================
// EXPERIENCE
// ==========================
// bullets: one per line or separated by "|" (commas stay inside a bullet)
function validateExperience(rows) {
  return toItems(rows, "title", (row) => ({
    title: row.title,
    company: row.company || "",
    period: row.period || "",
    bullets: toList(row.bullets),
    tech: toList(row.technologies, { commas: true }),
    title_ar: arabic(row, "title"),
    company_ar: arabic(row, "company"),
    period_ar: arabic(row, "period"),
    bullets_ar: toList(arabic(row, "bullets")),
  }));
}

// Active roles, sorted by display_order
export async function getExperience() {
  const { data } = await loadRows("experience", validateExperience);
  return data;
}

// ==========================
// ABOUT
// ==========================
// One tab, grouped by the `section` column:
//   headline  -> About page heading (text)
//   highlight -> About fact cards + Contact "At a glance" (title + text)
//   focus     -> About "What I focus on" + Home hero tags (title + text)
//   badge     -> footer badges (title, icon)
function validateAbout(rows) {
  const items = toItems(rows, "section", (row) => ({
    section: row.section.toLowerCase(),
    title: row.title || "",
    text: row.text || "",
    icon: row.icon || "",
    title_ar: arabic(row, "title"),
    text_ar: arabic(row, "text"),
  }));
  if (items == null) return null;

  // Rows missing the cells their section needs are placeholders — skip them
  const pick = (section, ...needs) =>
    items.filter((item) => item.section === section && needs.every((key) => item[key]));

  const headline = pick("headline", "text")[0];

  return {
    headline: headline?.text || "",
    headline_ar: headline?.text_ar || "",
    highlights: pick("highlight", "title", "text"),
    focus: pick("focus", "title"),
    badges: pick("badge", "title"),
  };
}

// { headline, headline_ar, highlights[], focus[], badges[] }
export async function getAbout() {
  const { data } = await loadRows("about", validateAbout);
  return data;
}

// ==========================
// SKILLS
// ==========================
// Optional columns: name_ar, category (+ category_ar). Without a category, a skill is
// grouped by recognizable keywords; anything unrecognized goes to "other".
function validateSkills(rows) {
  return toItems(rows, "name", (row) => ({
    name: row.name,
    name_ar: arabic(row, "name"),
    category: row.category || "",
    category_ar: arabic(row, "category"),
  }));
}

// Skill names, sorted by display_order
export async function getSkills() {
  const { data } = await loadRows("skills", validateSkills);
  return data.map((skill) => skill.name);
}

// Display order of the built-in groups (labels live in the UI translation files).
// Matching runs in SKILL_RULES order, so e.g. "SQL Server" lands in databases, not backend.
export const SKILL_GROUPS = ["backend", "mobile", "frontend", "databases", "erp", "tools", "other"];

const SKILL_RULES = [
  ["erp", /\berp\b|dynamics|business central|navision|\bsap\b|odoo|\bcrm\b|business analysis/],
  ["mobile", /flutter|\bdart\b|kotlin|swift|react native|android|\bios\b|xamarin|mobile/],
  ["databases", /sql|mongo|postgres|sqlite|firebase|oracle|database|redis|supabase/],
  ["tools", /\bgit\b|github|docker|devops|jira|figma|postman|visual studio|vs ?code|ci\/cd|linux/],
  ["frontend", /html|css|javascript|typescript|react|vue|angular|tailwind|sass|next\.js|vite|blazor|front-?end/],
  ["backend", /\.net|c#|asp|node|express|php|laravel|\bjava\b|spring|python|django|\brest\b|\bapis?\b|graphql|back-?end/],
];

function skillGroupKey(skill) {
  const category = skill.category.toLowerCase();
  if (category) return SKILL_GROUPS.includes(category) ? category : `custom:${category}`;

  const name = skill.name.toLowerCase();
  return SKILL_RULES.find(([, pattern]) => pattern.test(name))?.[0] || "other";
}

// [{ key, label, label_ar, skills: [{ id, name, name_ar }] }]
// Built-in groups have an empty label (the UI translates `key`); sheet categories keep their text.
export async function getSkillGroups() {
  const { data } = await loadRows("skills", validateSkills);
  const groups = new Map();

  for (const skill of data) {
    const key = skillGroupKey(skill);
    if (!groups.has(key)) {
      const custom = key.startsWith("custom:");
      groups.set(key, {
        key,
        label: custom ? skill.category : "",
        label_ar: custom ? skill.category_ar : "",
        skills: [],
      });
    }
    groups.get(key).skills.push({ id: skill.id, name: skill.name, name_ar: skill.name_ar });
  }

  // Sheet categories sit just before "other"
  const rank = (key) => {
    const i = SKILL_GROUPS.indexOf(key);
    return i === -1 ? SKILL_GROUPS.length - 1.5 : i;
  };
  return [...groups.values()].sort((a, b) => rank(a.key) - rank(b.key));
}

// ==========================
// CONTACT
// ==========================
// type: email | phone | whatsapp | linkedin | github | location (others show as plain links)
// Email and phone links are built from `value`; `location` is plain text (value + value_ar);
// every other type links to `url`.
function contactHref(type, value, url) {
  if (type === "location") return "";
  if (type === "email") return value.includes("@") ? `mailto:${value}` : "";
  if (type === "phone") return value ? `tel:${value.replace(/[^\d+]/g, "")}` : "";
  return /^https?:\/\//i.test(url) ? url : "";
}

function validateContact(rows) {
  const items = toItems(rows, "type", (row) => {
    const type = row.type.toLowerCase();
    const href = contactHref(type, row.value || "", row.url || "");

    return {
      type,
      label: row.label || row.type,
      label_ar: arabic(row, "label"),
      // Blank value -> show the link without "https://www."
      value: row.value || href.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, ""),
      value_ar: arabic(row, "value"),
      href,
    };
  });

  // Rows without a usable link (or a location without text) are placeholders still waiting for content
  return items && items.filter((item) => item.href || (item.type === "location" && item.value));
}

// Active contact methods, sorted by display_order
export async function getContacts() {
  const { data } = await loadRows("contact", validateContact);
  return data;
}

// ==========================
// STATS
// ==========================
// Home page "At a glance" cards
function validateStats(rows) {
  return toItems(rows, "title", (row) => ({
    title: row.title,
    value: row.value || "",
    description: row.description || "",
    icon: row.icon || "",
    title_ar: arabic(row, "title"),
    description_ar: arabic(row, "description"),
  }));
}

export async function getStats() {
  const { data } = await loadRows("stats", validateStats);
  return data;
}

// ==========================
// BACKGROUND
// ==========================
// Companies, education and trainings (About page "Companies & trainings")
function validateBackground(rows) {
  return toItems(rows, "name", (row) => ({
    name: row.name,
    role: row.role || "",
    period: row.period || "",
    notes: row.notes || "",
    name_ar: arabic(row, "name"),
    role_ar: arabic(row, "role"),
    period_ar: arabic(row, "period"),
    notes_ar: arabic(row, "notes"),
  }));
}

export async function getBackground() {
  const { data } = await loadRows("background", validateBackground);
  return data;
}
