// Tests for src/data/content.js — run with `npm test`.
//
// content.js is loaded through Vite so `?raw` imports and import.meta.env work as in the app.
//   1. Live sheets: the URLs in .env (skipped when none are configured, e.g. in CI)
//   2. Mock sheets: a local server stands in for Google, so edits can be simulated
//   3. Base path: site-relative image paths resolve under /rasha-portfolio/

import assert from "node:assert/strict";
import http from "node:http";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import Papa from "papaparse";
import { createServer, loadEnv } from "vite";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const TABS = ["profile", "projects", "experience", "about", "skills", "contact", "stats", "background"];
const GETTERS = ["getProfile", "getProjects", "getExperience", "getAbout", "getSkills", "getContacts", "getStats", "getBackground"];

// Fetch every time, so simulated edits show up immediately
process.env.VITE_SHEETS_CACHE_SECONDS = "0";

// Keep test output readable: content.js logs its data sources
console.info = () => {};
console.warn = () => {};

async function loadContent(inlineConfig = {}) {
  const vite = await createServer({
    root: ROOT,
    mode: "development",
    logLevel: "error",
    server: { middlewareMode: true },
    ...inlineConfig,
  });
  const mod = await vite.ssrLoadModule("/src/data/content.js");
  return { mod, close: () => vite.close() };
}

let failures = 0;
async function check(name, fn) {
  try {
    await fn();
    console.log("PASS", name);
  } catch (error) {
    failures++;
    console.log("FAIL", name, "\n    ", error.message.split("\n").join("\n     "));
  }
}

// ---------- 1. Live sheets ----------
const env = loadEnv("development", ROOT, "VITE_");

if (!TABS.some((tab) => env[`VITE_SHEET_${tab.toUpperCase()}_URL`])) {
  console.log("SKIP live sheets (no VITE_SHEET_*_URL configured)");
} else {
  const { mod, close } = await loadContent();

  await check("live: every tab loads", async () => {
    for (const fn of GETTERS) assert.ok((await mod[fn]()) != null, fn);
    assert.ok((await mod.getProfile()).name, "profile has a name");
  });

  await check("live: projects match the sheet's active rows", async () => {
    const text = await (await fetch(env.VITE_SHEET_PROJECTS_URL)).text();
    const rows = Papa.parse(text, {
      header: true,
      skipEmptyLines: "greedy",
      transformHeader: (h) => h.trim().toLowerCase(),
    }).data;
    const isActive = (v = "") => !v.trim() || /^(true|yes|y|1|x|✓)$/i.test(v.trim());
    const expected = rows.filter((r) => r.title?.trim() && isActive(r.is_active)).map((r) => r.title.trim());

    const projects = await mod.getProjects();
    assert.deepEqual(projects.map((p) => p.title).sort(), expected.sort());
    assert.ok(projects.some((p) => p.title === "ANC Fabrics Mobile App" && p.featured), "ANC is active + featured");

    // Every image/link is either blank or a usable URL (e.g. a bare "www.…" cover is dropped)
    for (const p of projects) {
      for (const url of [p.cover_url, p.demo_url, p.github_url, ...p.gallery]) {
        assert.ok(url === "" || /^(https?:\/\/|\/)/.test(url), `${p.title}: ${url}`);
      }
    }

    const featured = await mod.getFeaturedProjects();
    assert.deepEqual(featured, projects.filter((p) => p.featured));
  });

  await close();
}

// ---------- 2. Mock sheets ----------
const files = {};
const server = http.createServer((req, res) => {
  const text = files[req.url];
  if (text == null) {
    res.writeHead(404);
    return res.end();
  }
  res.writeHead(200, { "content-type": text.startsWith("<") ? "text/html" : "text/csv" });
  res.end(text);
});
await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
const base = `http://127.0.0.1:${server.address().port}`;

for (const tab of TABS) {
  files["/" + tab] = readFileSync(`${ROOT}/docs/sheets/${tab}.csv`, "utf8");
  process.env[`VITE_SHEET_${tab.toUpperCase()}_URL`] = `${base}/${tab}`;
}

{
  const { mod, close } = await loadContent();

  await check("every docs/sheets CSV parses as a live sheet", async () => {
    for (const fn of GETTERS) assert.ok((await mod[fn]()) != null, fn);
    const about = await mod.getAbout();
    assert.equal(about.highlights.length, 2, "blank University placeholder skipped");
    assert.equal(about.focus.length, 3);
    assert.equal(about.headline, "");
    const contacts = await mod.getContacts();
    assert.deepEqual(
      contacts.map((c) => [c.type, c.value, c.href]),
      [
        ["email", "rashaalhajhasan@gmail.com", "mailto:rashaalhajhasan@gmail.com"],
        ["phone", "+961 3 676 425", "tel:+9613676425"],
        ["linkedin", "linkedin.com/in/rashahajhasan", "https://www.linkedin.com/in/rashahajhasan"],
        ["github", "github.com/Rasha-AlHajHasan", "https://github.com/Rasha-AlHajHasan"],
        ["location", "Lebanon", ""],
      ],
      "WhatsApp row stays hidden (is_active FALSE)"
    );

    const skills = await mod.getSkills();
    assert.equal(skills.length, 39);
    assert.equal(new Set(skills.map((s) => s.toLowerCase())).size, skills.length, "no duplicate skills");

    const experience = await mod.getExperience();
    assert.deepEqual(
      experience.map((e) => [e.title, e.company]),
      [
        ["Business Analyst / Full-Stack Developer", "Dynasoft Technology"],
        ["Lead Generator", "ERP Cloud (Odoo Partner)"],
        ["Odoo Functional Intern", "ERP Cloud (Odoo Partner)"],
      ]
    );
    for (const e of experience) {
      assert.equal(e.period, "", `${e.title}: no unverified dates`);
    }

    const profile = await mod.getProfile();
    assert.equal(profile.name, "Rasha Al Haj Hasan");
    assert.equal((await mod.getProjects()).length, 2, "Dynasoft template row is hidden (is_active FALSE)");
  });

  await check("edit without rebuild: a new project row creates a card", async () => {
    files["/projects"] +=
      '4,New Test App,"Summary, with comma","React, Vite",www.example.com,,https://demo.example,not-a-link,yes,0,\n';
    const all = await mod.getProjects();
    assert.deepEqual(all.map((p) => p.title), ["School Information System (SIS) Mobile App", "New Test App", "ANC Fabrics Mobile App"]);
    const p = all[1];
    assert.deepEqual(p.stack, ["React", "Vite"]);
    assert.equal(p.cover_url, "", "bare www. link dropped");
    assert.equal(p.github_url, "", "invalid link dropped");
    assert.deepEqual(p.gallery, []);
    assert.equal((await mod.getFeaturedProjects()).length, 3);
  });

  await check("is_active=FALSE hides a record in every row tab", async () => {
    files["/projects"] = files["/projects"].replace("TRUE,1,TRUE", "TRUE,1,FALSE");
    assert.ok(!(await mod.getProjects()).some((p) => p.title.startsWith("ANC")));
    files["/skills"] = files["/skills"].replace("2,.NET,backend,2,TRUE", "2,.NET,backend,2,FALSE");
    assert.ok(!(await mod.getSkills()).includes(".NET"));
    files["/contact"] = files["/contact"].replace("Rasha-AlHajHasan,5,TRUE", "Rasha-AlHajHasan,5,FALSE");
    assert.ok(!(await mod.getContacts()).some((c) => c.type === "github"));
  });

  await check("experience: bullets keep commas, technologies split", async () => {
    files["/experience"] += 'e1,Developer,Acme,2024,"Built X, Y and Z\nShipped W",".NET, Flutter",0,TRUE\n';
    const [e] = await mod.getExperience();
    assert.deepEqual(e.bullets, ["Built X, Y and Z", "Shipped W"]);
    assert.deepEqual(e.tech, [".NET", "Flutter"]);
  });

  await check("experience: summary column is optional", async () => {
    files["/experience"] = 'title,summary,bullets\nDeveloper,"Owned X, end to end",Built Y\nAnalyst,,Built Z\n';
    const [first, second] = await mod.getExperience();
    assert.equal(first.summary, "Owned X, end to end");
    assert.equal(second.summary, "");
  });

  await check("contact: email/phone links built from value", async () => {
    files["/contact"] = "type,value\nemail,me@example.com\nphone,+961 1 234 567\nlinkedin,\n";
    const contacts = await mod.getContacts();
    assert.deepEqual(contacts.map((c) => c.href), ["mailto:me@example.com", "tel:+9611234567"]);
  });

  await check("stats + background rows parse", async () => {
    files["/stats"] += "s1,Years,5+,desc,Briefcase,1,TRUE\n";
    files["/background"] += "b1,Some Co,Intern,2023,notes,1,TRUE\n";
    assert.equal((await mod.getStats())[0].value, "5+");
    assert.equal((await mod.getBackground())[0].role, "Intern");
  });

  await check("unpublished tab (HTML sign-in page) falls back to bundled copy", async () => {
    files["/skills"] = "<!doctype html><html>sign in</html>";
    assert.equal((await mod.getSkills()).length, 39);
  });

  await check("empty tab and 404 fall back to bundled copy", async () => {
    files["/about"] = "";
    assert.equal((await mod.getAbout()).focus.length, 3);
    delete files["/stats"];
    assert.deepEqual(await mod.getStats(), []);
  });

  await check("*_en is an alias for a column; leftover *_ar sheet columns are ignored", async () => {
    files["/profile"] = "field,value\nname_en,Test Name\nname_ar,اسم تجريبي\ntagline,Hello\n";
    const profile = await mod.getProfile();
    assert.equal(profile.name, "Test Name");
    assert.equal(profile.name_ar, undefined);

    files["/projects"] = "title_en,title_ar,summary,technologies\nShop,متجر,A store,React\n";
    const [p] = await mod.getProjects();
    assert.equal(p.title, "Shop");
    assert.equal(p.title_ar, undefined);
  });

  await check("projects: platform column, else inferred from title/technologies", async () => {
    files["/projects"] =
      "title,technologies,platform\n" +
      "ANC Fabrics Mobile App,Flutter | Dart,\n" +
      "Dynasoft Website,,\n" +
      "Admin Portal,.NET,\n" +
      "Flutter Web Thing,Flutter,web\n";
    const platforms = (await mod.getProjects()).map((p) => p.platform);
    assert.deepEqual(platforms, ["mobile", "website", "web", "web"]);
  });

  await check("skills: grouped by keyword, sheet category wins, order kept", async () => {
    files["/skills"] = readFileSync(`${ROOT}/docs/sheets/skills.csv`, "utf8");
    const groups = await mod.getSkillGroups();
    assert.deepEqual(
      groups.map((g) => [g.key, g.skills.length]),
      [["backend", 7], ["mobile", 5], ["frontend", 7], ["databases", 4], ["erp", 9], ["tools", 7]],
      "every row has a built-in category, nothing in 'other'"
    );
    assert.deepEqual(groups[0].skills.slice(0, 2).map((s) => s.name), ["C#", ".NET"]);
    assert.equal((await mod.getSkills()).length, 39, "getSkills still returns names");

    files["/skills"] = "name\n.NET\nFlutter\nDart\nREST APIs\nBusiness Analysis\n";
    assert.deepEqual(
      (await mod.getSkillGroups()).map((g) => g.key),
      ["backend", "mobile", "erp"],
      "without a category column, keyword grouping still works"
    );

    files["/skills"] = "name,category,category_ar\nSQL Server,,\nFigma,Design,تصميم\nC#,backend,\nClean Architecture,,\n";
    const custom = await mod.getSkillGroups();
    assert.deepEqual(custom.map((g) => g.key), ["backend", "databases", "custom:design", "other"]);
    assert.equal(custom[2].label, "Design");
  });

  await close();
}

// ---------- 3. Base path (GitHub Pages build) ----------
{
  const { mod, close } = await loadContent({ base: "/rasha-portfolio/" });

  await check("base path: site-relative images resolve under /rasha-portfolio/", async () => {
    files["/projects"] =
      "title,cover_url,screenshots,demo_url\n" +
      "P,/images/a.png,/rasha-portfolio/images/b.png | https://cdn.example/c.png,https://demo.example\n";
    const [p] = await mod.getProjects();
    assert.equal(p.cover_url, "/rasha-portfolio/images/a.png");
    assert.deepEqual(p.gallery, ["/rasha-portfolio/images/b.png", "https://cdn.example/c.png"], "no double prefix");
    assert.equal(p.demo_url, "https://demo.example");

  });

  await close();
}

server.close();
console.log(failures ? `\n${failures} FAILED` : "\nALL PASSED");
process.exit(failures ? 1 : 0);
