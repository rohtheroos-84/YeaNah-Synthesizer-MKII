# Netlify Deployment Plan

This app is a static Vite/React site, so Netlify can deploy it directly from the repository without a backend service.

## What Was Prepared

- Added `netlify.toml` with the production build command and publish directory.
- Removed stale `index.html` references to a missing `/index.css` file and unused browser import map. Vite now bundles React and app dependencies from `package.json`.
- Confirmed `npm run build` succeeds locally.

## Required Netlify Settings

Use these settings if connecting the repository through the Netlify UI:

- Build command: `npm run build`
- Publish directory: `dist`
- Node version: Netlify default should work. If you pin it, use Node 20 or newer.

These settings are also captured in `netlify.toml`, so Netlify should auto-detect them after the repository is connected.

## Deploy From Git

1. Push this repository to GitHub, GitLab, or Bitbucket.
2. In Netlify, choose "Add new site" then "Import an existing project".
3. Select the repository.
4. Confirm the build command is `npm run build`.
5. Confirm the publish directory is `dist`.
6. Deploy the site.

## Deploy With Netlify CLI

Install and authenticate the Netlify CLI if needed:

```powershell
npm install -g netlify-cli
netlify login
```

Build locally:

```powershell
npm run build
```

Deploy a draft:

```powershell
netlify deploy --dir=dist
```

Deploy to production:

```powershell
netlify deploy --prod --dir=dist
```

## Environment Variables

No environment variables are required for the current app behavior.

`vite.config.ts` exposes `GEMINI_API_KEY` to browser code if it exists, but no current source file uses it. If future features call Gemini, add `GEMINI_API_KEY` in Netlify under:

Site configuration -> Environment variables

Do not commit `.env.local`.

## Redirects

`netlify.toml` includes a catch-all redirect to `/index.html`:

```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

The current app uses in-memory view state rather than URL routes, but this redirect makes direct links safe if a router is added later.

## Verification Checklist

Before or after deploying:

1. Run `npm install` or `npm ci`.
2. Run `npm run build`.
3. Confirm `dist/index.html` and `dist/assets/...js` are generated.
4. Open the deployed Netlify URL.
5. Start the app, enter a decision question, move all five factor controls, choose a leaning, and run analysis.
6. Confirm the recommendation renders and "COPY REPORT" works in a secure browser context.
7. Toggle day/night mode and open the About screen.

## Known Production Considerations

- Tailwind is loaded from `https://cdn.tailwindcss.com` at runtime. This works on Netlify, but for a stricter production setup, install Tailwind locally and generate a bundled CSS file.
- The app stores history only in React memory. Refreshing the page clears it.
- The decision algorithm is rule-based and deterministic; there is no server validation layer.
