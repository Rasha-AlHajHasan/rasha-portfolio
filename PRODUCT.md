# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Two audiences, weighted equally:

- **Employers**: recruiters and hiring managers screening Rasha for developer or business-analyst roles. They arrive from a CV, LinkedIn or GitHub and need to confirm, quickly, that the experience and skills match what they read elsewhere.
- **Direct clients**: businesses considering Rasha for software, mobile app or ERP (Odoo) work. They need to see what she has built, understand the kind of problems she solves, and find a way to get in touch.


## Product Purpose

The personal portfolio of Rasha Al Haj Hasan, a software developer based in Lebanon. It presents her projects, professional experience, skills and contact details, and is meant to make getting in touch easy. Contact is plain contact information, not an availability or job-seeking message.

Success is a visitor who leaves with an accurate picture of her work and a clear way to reach her.

## Positioning

**Developer first.** Rasha leads as a software developer (C#, ASP.NET Core, Flutter, SQL Server, React) who also brings business analysis and ERP experience: functional Odoo work, requirements gathering, demos and pre-sales at an Odoo partner. Few developers can also speak to requirements, ERP modules and end users; that combination is the distinguishing claim, with development as the headline and business fluency as the differentiator.

## Operating Context

- **Pages:** Home, Projects, Experience, About, Skills, Contact (plus 404).
- **Content management:** all portfolio content lives in a Google Sheet, "Rasha Portfolio Content Management", with eight tabs (Profile, Projects, Experience, About, Skills, Contact, Stats, Background). Each tab is published to the web as CSV; Rasha edits the sheet and the live site updates within minutes, without a rebuild or deploy.
- **Content fallback:** each tab has a bundled copy in `src/content/fallback/`, and ready-to-import copies plus instructions in `docs/sheets/`.
- **Language:** English only. UI text lives in `src/content/text.js`.
- **Themes:** light and dark, following the system setting until the visitor chooses one.
- **Hosting:** GitHub Pages at `/rasha-portfolio/`, built by a GitHub Actions workflow that reads the sheet URLs from repository variables.

## Capabilities and Constraints

- **Stack (existing):** React + Vite, Tailwind CSS, Framer Motion, React Router, Papa Parse. Tests in `tests/content.test.mjs` (`npm test`).
- **No backend:** no database, Supabase or custom server; Google Sheets is the only content source. Do not add complexity beyond that.
- **Sheet tabs are permanent:** never delete or re-create a tab. Its `gid` is part of the published CSV URL, and a new tab breaks the site's link to it.
- **Caching:** each visitor's browser keeps sheet data for 5 minutes; opening any page with `?refresh` bypasses it.
- **Content can be sparse or partial:** rows can be hidden (`is_active`), cells can be blank (e.g. no employment dates yet). Every page must still read well with whatever the sheet holds, and hide empty placeholders rather than show them.
- **Terminology:** "tab" = a sheet tab; "fallback" = the bundled CSV copy; `display_order` and `is_active` are the shared ordering and visibility columns.
- **Undecided:**
  - employment dates for all roles (not yet verified);
  - university / education entries;
  - whether +961 3 676 425 is also a WhatsApp number (WhatsApp is switched off until confirmed);
  - whether the Stats strip will be used.

## Brand Commitments

- **Name:** Rasha Al Haj Hasan (this spelling; matches GitHub and LinkedIn).
- **Role line:** "Software Developer & ERP Professional"; tagline "Bridging business needs and technology through practical, user-focused software solutions."
- **Voice:** concise, professional, plain. Real experience described accurately; no exaggerated claims, inflated metrics, skill percentages or seniority levels. Content should stay consistent with her CV for applicant-tracking systems (ATS).

## Evidence on Hand

- **Experience:** Dynasoft Technology, Business Analyst / Full-Stack Developer; ERP Cloud (Odoo partner), Lead Generator, and earlier Odoo Functional Intern. Responsibilities are documented in the Experience tab.
- **Projects:**
  - ANC Fabrics mobile app (Flutter, integrated with Microsoft Dynamics 365 Business Central);
  - a multi-tenant School Information System mobile app;
  - the Dynasoft SaaS website (Blazor / ASP.NET Core).
  - **Client names and screenshots may be shown publicly** (confirmed), but no client screenshots are in the repository yet; `public/images/school/` is empty.
- **Images in `public/images/`:** portrait `contact/rasha.jpeg`, `contact/rashaComputer.png`, recipe app screenshots in `receipe/`, and `recipe-app.jfif` / `school-app.jfif`.
- **Contact:** rashaalhajhasan@gmail.com, +961 3 676 425, linkedin.com/in/rashahajhasan, github.com/Rasha-AlHajHasan, Lebanon.
- **Absent, must not be fabricated:**
  - testimonials, client logos and quantified results or metrics;
  - employment dates;
  - education details;
  - certifications (a Certificates page exists in code but has no content).

## Product Principles

1. **Accuracy over impressiveness.** Show only verified facts. A blank field beats an invented one, and nothing is inflated to look senior.
2. **Developer first, business-fluent second.** Lead with what she builds; let the ERP and analysis experience explain why her software fits real operations.
3. **Serve the screener and the client at once.** An employer should verify roles and skills in seconds; a client should see real work and an obvious way to make contact.
4. **The sheet is the source of truth.** Design for content that changes, grows or goes missing, without code changes or redeploys.
