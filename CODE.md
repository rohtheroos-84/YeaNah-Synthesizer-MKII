# Codebase Documentation

This repository contains a client-only React/Vite app for a retro-styled binary decision tool. The application runs entirely in the browser: it collects a decision prompt, scores five factors, applies a small rule-based heuristic, and renders a YES/NO recommendation.

## Runtime Shape

- Framework: React 19 with TypeScript.
- Bundler/dev server: Vite.
- Styling: Tailwind CSS loaded from the CDN in `index.html`, plus inline global CSS in the same file and utility classes throughout the React components.
- State: Local React component state only. There is no backend, database, router package, or persisted storage.
- Deployment target: Any static host that can run `npm run build` and serve the generated `dist` folder.

## File Inventory

### `.gitignore`

Ignores common logs, package-manager debug output, `node_modules`, Vite build output (`dist`, `dist-ssr`), local environment files (`*.local`), and editor/OS metadata.

### `App.tsx`

Main application component. It owns all interactive app state:

- Current view: `HOME`, `APP`, or `ABOUT`.
- Decision input: question, optional context, factor ratings, and initial leaning.
- Analysis lifecycle: progress bar, loading messages, result object, and recent session history.
- Theme state: classic 1995 mode or cyber night mode.

It renders the home screen, algorithm/about screen, and primary decision-analysis interface. It calls `calculateDecision` from `services/decisionLogic.ts` when the user runs an analysis, then stores the latest result and the last three session history items in memory.

### `components/CRTOverlay.tsx`

Small presentational component that renders fixed-position CRT scanlines and a vignette overlay. It is pointer-event transparent and appears above the UI via a high z-index.

### `components/RetroUI.tsx`

Reusable retro UI component library used by `App.tsx`. It defines:

- `RetroWindow`: Windows-95-style outer shell with title bar controls.
- `RetroPanel`: Framed content panel with a title tab.
- `RetroInput`: Styled single-line text input.
- `RetroTextArea`: Styled multiline input.
- `RetroButton`: Styled command button with default and primary variants.
- `RetroSlider`: Segmented 1-5 factor selector.
- `RetroRadioGroup`: YES/NO initial-leaning selector.

The file also includes a local `cn` helper for joining conditional class names.

### `index.html`

Vite HTML entry file. It contains the root mount element, Tailwind CDN script, Google Font links for `VT323`, and global CSS for the retro cursor, scrollbar styling, and Windows-95 border utilities. The module script points Vite at `index.tsx`.

### `index.tsx`

React entry point. It finds the `#root` element, creates the React root, and renders `App` inside `React.StrictMode`.

### `metadata.json`

Small project metadata file containing the app name, a short description, and an empty `requestFramePermissions` array. It is not imported by the Vite app at runtime.

### `netlify.toml`

Netlify deployment configuration. It tells Netlify to run `npm run build`, publish the `dist` directory, and serve `index.html` for all routes. The redirect is harmless for the current state-based navigation and keeps the app safe if URL-based routing is added later.

### `package-lock.json`

NPM lockfile. It pins the exact resolved dependency graph used by `npm install`/`npm ci`, which keeps Netlify and local installs reproducible.

### `package.json`

Project manifest. It declares the package as a private ES module project and exposes three scripts:

- `npm run dev`: start Vite dev server.
- `npm run build`: produce the production static bundle in `dist`.
- `npm run preview`: preview the production bundle locally.

Runtime dependencies are React, React DOM, Lucide React icons, and `clsx`. Dev dependencies are Vite, the React Vite plugin, TypeScript, and Node type definitions.

### `README.md`

User-facing project overview with setup instructions, feature list, algorithm explanation, usage guide, project structure, and troubleshooting notes.

### `services/decisionLogic.ts`

Pure decision-scoring service. `calculateDecision(input)`:

- Determines the primary driver from the highest factor score with a fixed tie-break order.
- Generates upside and downside summary bullets.
- Produces a second-order effect statement.
- Computes a simple rule summary.
- Calculates benefit and cost scores.
- Applies a gut-feeling bonus when the user leans YES or NO.
- Returns a `DecisionResult` used by the UI.

This is the core business logic and can be tested independently from React.

### `tsconfig.json`

TypeScript configuration for the Vite app. It targets modern ES modules, enables React JSX transform, uses bundler-style module resolution, defines the `@/*` path alias, and runs in no-emit mode because Vite handles builds.

### `types.ts`

Shared TypeScript models:

- `DecisionFactors`
- `Leaning`
- `DecisionInput`
- `DecisionResult`
- `HistoryItem`

It also exports `FACTOR_LABELS`, the display labels used by the scoring logic.

### `vite.config.ts`

Vite configuration. It:

- Uses the React plugin.
- Runs the dev server on `0.0.0.0:3000`.
- Defines `process.env.API_KEY` and `process.env.GEMINI_API_KEY` from `GEMINI_API_KEY` for browser compatibility.
- Defines the `@` alias to the repository root.

The current app does not call Gemini or any external API, so Netlify does not require this environment variable for the existing functionality.

## Local Files Not Tracked By Git

### `.env.local`

Local-only environment file ignored by `.gitignore`. Do not commit it. If future code uses `GEMINI_API_KEY`, configure that value in Netlify environment variables instead of committing secrets.

### `dist/`

Generated Vite production output. It is ignored by `.gitignore` and should be rebuilt by Netlify during deploy.

### `node_modules/`

Installed dependencies. It is ignored by `.gitignore`; Netlify installs dependencies from `package-lock.json`.

## Data Flow

1. `index.html` loads the page and Vite module entry.
2. `index.tsx` renders `App`.
3. `App.tsx` collects user input through components from `components/RetroUI.tsx`.
4. `App.tsx` sends a `DecisionInput` to `calculateDecision`.
5. `services/decisionLogic.ts` returns a `DecisionResult`.
6. `App.tsx` renders the report and stores the last three results in in-memory history.

## Deployment Notes

The app is static and deployable as-is after running `npm run build`. The production artifact is the `dist` directory.
