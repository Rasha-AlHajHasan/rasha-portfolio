# Portfolio content in Google Sheets

The site reads its content from a Google Sheet that is **published to the web as CSV**.
Editing the sheet updates the live site — no rebuild or redeploy.

All eight tabs are connected:

| Tab | Shown on |
|---|---|
| **Profile** | Home hero (tagline), Home + About introduction (bio). The name shown on the site is fixed in `src/content/text.js`. |
| **Projects** | Projects page, Home "Selected projects" |
| **Experience** | Experience page, Home "Experience" summary |
| **About** | About headline, "At a glance", "Areas of expertise", Home focus list, footer badges |
| **Skills** | Skills page (grouped), Home "Skills" summary |
| **Contact** | Contact page, Home contact section |
| **Stats** | Home "At a glance" strip (hidden while empty) |
| **Background** | About "Education & background" |

Page titles, button labels, the navigation menu and other UI text are fixed in the code, in
`src/content/text.js`, not sheet content.

Each tab has a bundled copy in `src/content/fallback/`. A tab without a configured URL, or
whose sheet can't be reached, shows that copy.

## Optional columns used by the redesign

- **Projects → `platform`**: `web`, `mobile` or `website`. Sets the platform label on the
  project card. Blank → guessed: Flutter/Dart/mobile → `mobile`; "website" in the
  title → `website`; otherwise `web`.
- **Skills → `category`**: groups skills on the Skills page. Use `backend`, `mobile`,
  `frontend`, `databases`, `erp` or `tools` for the built-in (translated) group names, or any
  other text for a custom group. Blank → grouped
  automatically by recognisable names (e.g. Flutter → mobile, SQL Server → databases);
  anything unrecognised goes under "Other skills".

## Replacing a tab's content with an updated CSV

Use this when a file in this folder is newer than its tab (e.g. after the October 2026
Experience / Skills / Contact update). It keeps the tab — and therefore its `gid` and published
URL — and only swaps the cells. **Never delete and re-create a tab**: a new tab gets a new
gid and the site's published URL for it stops working.

1. Open the tab (e.g. **Skills**) in the spreadsheet.
2. **File → Import → Upload** → choose the CSV from this folder.
3. *Import location:* **Replace current sheet** (only the open tab is affected).
   *Separator type:* **Comma**.
4. **Uncheck "Convert text to numbers, dates, and formulas"**. Otherwise `+961 3 676 425` is read
   as a formula and shows `#ERROR!`. (Typing by hand instead? Start the phone cell with `'`.)
5. **Import data**. Check that line breaks inside cells came through.
6. Nothing else to do: the tab stays published and "Automatically republish" picks up the change.
   Open the site with `?refresh` to see it immediately.

## Setting up the six new tabs (Experience, About, Skills, Contact, Stats, Background)

The ready-made files are in this folder: `experience.csv`, `about.csv`, `skills.csv`,
`contact.csv`, `stats.csv`, `background.csv`. For each one:

1. Open the matching tab in the spreadsheet. **If it already has content, don't import —
   copy the missing rows across by hand instead**, so nothing is overwritten.
2. If the tab is empty: **File → Import → Upload** → choose the CSV →
   *Import location:* **Replace current sheet** → *Separator:* **Detect automatically** →
   **Import data**. ("Replace current sheet" only affects the tab you are on.)
3. Publish it as CSV (section 2) and paste the URL into `.env` (section 3).

Profile and Projects already contain your data, so **don't import over them**. `profile.csv`
and `projects.csv` are a reference copy of what those tabs should hold.

All row-based tabs share these rules:
- The first row is the header. Header names are case-insensitive.
- `display_order` — number, lowest first; blank sorts last.
- `is_active` — `FALSE` hides the row; blank counts as active.
- `id` — optional; any unique text.
- Rows whose main cell is blank are skipped, so blank rows in the files are
  **placeholders waiting for your content**.

### Experience tab

| Column | Notes |
|---|---|
| `title` | **Required.** Job title. |
| `company`, `period` | e.g. `2023 – Present`. |
| `bullets` | One achievement per line (Alt+Enter / Ctrl+Enter in a cell) or separated by `\|`. Commas are fine inside a bullet. |
| `technologies` | Separated by `\|` or commas. Shown as tags. |

### About tab

One row per item; the `section` column says where it appears.

| `section` | Uses | Shown as |
|---|---|---|
| `headline` | `text` | Large heading at the top of the About page (first one only). |
| `highlight` | `title`, `text`, `icon` | Fact cards on About, "At a glance" on Contact. `icon`: `GraduationCap`, `Briefcase` or `MapPin`. |
| `focus` | `title`, `text` | "What I focus on" on About; titles also appear as tags in the Home hero. |
| `badge` | `title`, `icon` | Small footer badges. `icon`: `Laptop` or `Smartphone`. |

### Skills tab

`name` (**required**), `category` (see "Optional columns" above), `display_order`, `is_active`.

### Contact tab

| Column | Notes |
|---|---|
| `type` | **Required.** `email`, `phone`, `whatsapp`, `linkedin`, `github` or `location`. |
| `label` | Text above the value (defaults to the type). |
| `value` | For `email`/`phone`: the address/number. For `location`: the place (plain text, not a link). For links: optional display text (defaults to the link without `https://`). |
| `url` | For `whatsapp`/`linkedin`/`github`: the full `https://…` link, e.g. `https://wa.me/9611234567`. |

The Contact page shows only channels with a usable address or link — blank rows are hidden.
WhatsApp is set to `is_active` `FALSE` until a WhatsApp number is confirmed.
The large email block (with "Copy email") appears once an `email` row has an address.

### Stats tab

`title` (**required**), `value` (e.g. `5+`), `description`, `icon` (`Sparkles`, `Briefcase` or
`GraduationCap`). The Home "At a glance" strip is hidden while the tab is empty.

### Background tab

`name` (**required** — company, school or training), `role`, `period`, `notes`.

## 1. Create the spreadsheet

1. Create a new Google Sheet (e.g. "Portfolio content").
2. Rename the first tab to **Profile** (exact name doesn't matter to the site, but keep it tidy).
3. Import the sample: **File → Import → Upload** → `docs/sheets/profile.csv` →
   *Import location:* **Replace current sheet**.

The Profile tab has two columns:

| field     | value                                                  |
|-----------|--------------------------------------------------------|
| name      | Rasha Al Haj Hasan                                     |
| role      | Software Developer & ERP Professional                  |
| tagline   | Bridging business needs and technology through …       |
| bio       | Software professional experienced in .NET … (About page; line breaks start new paragraphs) |

- Only columns **A** (field) and **B** (value) are read. The `field,value` header row is optional;
  anything in columns C and beyond is ignored.
- Field names are case-insensitive and surrounding spaces are ignored (`name ` works).
- `name` is required. If it is missing, the site ignores the sheet and uses the bundled copy.
- Row order doesn't matter. Unknown fields are ignored.

### Projects tab

Add a tab named **Projects** and import `docs/sheets/projects.csv` (*Replace current sheet*).
One row per project; the first row must be the header:

| Column | Required | Notes |
|---|---|---|
| `id` | – | Any unique text or number. Generated automatically if blank. |
| `title` | **yes** | Rows without a title are skipped (useful for notes). |
| `summary` | – | Short description shown on the card. |
| `technologies` | – | Separate with `\|`, commas or line breaks: `Flutter \| Dart \| REST APIs`. Shown as tags and used by the Projects page filter. |
| `cover_url` | – | Main card image (`https://…` or `/images/…`). |
| `screenshots` | – | Extra images, separated with `\|` or line breaks. Shown in the screenshot viewer. If there's no `cover_url`, the first screenshot is used as the cover. |
| `demo_url` | – | Adds a **View project** button. |
| `github_url` | – | Adds a **GitHub** button. |
| `featured` | – | `TRUE` shows the project in Home → Featured projects (first 4). |
| `display_order` | – | Number; lowest first. Blank sorts last. |
| `is_active` | – | `FALSE` hides the project. Blank counts as active. |

- Header names are case-insensitive and surrounding spaces are ignored.
- `TRUE`, `yes`, `1` and Google Sheets checkboxes all count as true.
- Invalid links (anything not starting with `https://`, `http://` or `/`) are ignored, so the button or image just doesn't appear.
- Without any images, the card shows the "Preview coming soon" panel.

## 2. Publish the tab as CSV

1. **File → Share → Publish to web**.
2. Under *Link*, choose the **Profile** tab (not "Entire document") and **Comma-separated values (.csv)**.
3. Click **Publish** and confirm. Copy the URL — it looks like
   `https://docs.google.com/spreadsheets/d/e/2PACX-…/pub?gid=0&single=true&output=csv`
4. Leave *Automatically republish when changes are made* **checked** (under *Published content & settings*).

Repeat for each tab — every tab gets its own URL (they differ by `gid=`).

Publishing makes this tab readable by anyone with the link. Only put public portfolio content in it.

## 3. Configure the URL

**Local development** — the URL lives in `.env` (see `.env.example`):

```
VITE_SHEET_PROFILE_URL=https://docs.google.com/spreadsheets/d/e/2PACX-…/pub?gid=0&single=true&output=csv
VITE_SHEET_PROJECTS_URL=https://docs.google.com/spreadsheets/d/e/2PACX-…/pub?gid=1288495256&single=true&output=csv
VITE_SHEET_EXPERIENCE_URL=…
VITE_SHEET_ABOUT_URL=…
VITE_SHEET_SKILLS_URL=…
VITE_SHEET_CONTACT_URL=…
VITE_SHEET_STATS_URL=…
VITE_SHEET_BACKGROUND_URL=…
```

All published URLs share the same `2PACX-…` part and differ only in `gid=`. A tab's gid is
shown in the browser address bar (`#gid=…`) when that tab is open in the editor.

`.env.development` sets `VITE_SHEETS_CACHE_SECONDS=0`, so `npm run dev` fetches the sheet on every
page load. Production builds use the default `300` (5 minutes).
Vite restarts the dev server automatically when `.env` files change.

**Skip the cache on any build:** open any page with `?refresh`, e.g. `http://localhost:5173/?refresh`.
That visit ignores the browser cache and downloads the sheet again; the fresh copy is then cached.

**GitHub Pages** — `.env` is not committed. The deploy workflow reads the same eight
`VITE_SHEET_*_URL` names from **repository variables**: GitHub → repository **Settings →
Secrets and variables → Actions → Variables → New repository variable**. Use the same values as
your local `.env`. A missing variable shows a warning in the build log, and that tab uses its
bundled copy. Changing a variable only takes effect on the next deploy.

## 4. Check it works

1. Run `npm run dev` and open the Home page with the browser console open.
2. You should see `[content] profile loaded from Google Sheets`.
3. Change `tagline` in the sheet, wait for Google to republish (usually under a minute,
   occasionally up to ~5 minutes), then reload the page. The new tagline appears.

Other console messages:

| Message | Meaning |
|---|---|
| `profile loaded from browser cache` | Served from the 5-minute cache — expected when caching is on. |
| `live sheet unavailable (HTTP 4xx)` / `Received HTML instead of CSV` / `Failed to fetch` | The URL is wrong or the tab isn't published as CSV (Google redirects unpublished sheets to a sign-in page, which the browser blocks). |
| `live sheet unavailable (profile: no valid rows)` | The Profile sheet loaded but has no `name` row. |
| `live sheet unavailable (projects: no valid rows)` | The Projects sheet has no `title` column in its first row. |
| `… loaded from bundled fallback` | Neither the sheet nor a cached copy was available; the site shows `src/content/fallback/<tab>.csv`. |

## How updates reach visitors

- Google refreshes the published CSV after edits (usually within a minute, sometimes up to ~5 minutes).
- Each visitor's browser keeps a copy for `VITE_SHEETS_CACHE_SECONDS` (default 5 minutes).
- Worst case, an edit is visible to everyone within about 10 minutes. No deploy needed.
- If Google is unreachable, visitors see their last cached copy, or the bundled fallback.
