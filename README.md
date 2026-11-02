# Rasha Al Haj Hasan — Portfolio

Personal portfolio built with React and Vite, in English and Arabic (RTL) with light and dark themes.

**Live site:** https://rasha-alhajhasan.github.io/rasha-portfolio/

## Run locally

```bash
npm ci
npm run dev      # http://localhost:5173/
npm test         # content layer tests
npm run lint
npm run build    # production build in dist/
npm run preview  # serve the build at /rasha-portfolio/
```

## Content

Page content comes from published Google Sheets CSV tabs, so editing a sheet updates the site without a rebuild. See [docs/sheets/README.md](docs/sheets/README.md).

Copy `.env.example` to `.env` and fill in the sheet URLs for local work. A tab with no URL uses its bundled copy from `src/content/fallback/`.

## Deployment

Every push to `main` builds and deploys to GitHub Pages through [.github/workflows/deploy.yml](.github/workflows/deploy.yml). The build reads the sheet URLs from the repository variables named `VITE_SHEET_*_URL`.

The site's path is set by `base` in `vite.config.js`, and must match the repository name.
