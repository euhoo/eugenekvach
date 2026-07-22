# eugenekvach

Source code for [eugenekvach.ru](https://eugenekvach.ru) — the personal website of Eugene Kvach, Senior Frontend & Applied AI Engineer.

## Current version

The current release is a static HTML/CSS site in `src/`: the home page, the Applied AI role page at `/ai/`, the Senior Frontend role page at `/frontend/`, and the proof-first Jarwis case study at `/helper/`. It is intentionally framework-free.

Run it locally:

```bash
python3 -m http.server 4173 --directory src
```

Then open `http://127.0.0.1:4173/`.

## Deploy

Deployment is intentionally a local one-command workflow:

```bash
./deploy.sh
```

The script requires a clean `master` branch, validates the static source and the content-hash cache-buster on `styles.css`, pushes `master`, backs up the current server files, synchronizes `src/`, and runs external HTTPS smoke tests. If synchronization or verification fails, it restores the previous static release.

After editing `styles.css`, restamp the cache-buster instead of editing the `?v=` hash by hand. This recomputes the content hash and writes `styles.css?v=<hash>` into every HTML file; review and commit the result before deploying:

```bash
./deploy.sh --stamp
```

Preview the synchronization without changing GitHub or production:

```bash
./deploy.sh --dry-run
```

## Structure

- `PRODUCT.md` — stable product truth and constraints used for design decisions;
- `DESIGN.md` — durable visual system for the site;
- `.impeccable/` — machine-readable design tokens and route-level design briefs;
- `src/index.html` — the Russian-first home page;
- `src/ai/index.html` — the Applied AI Engineering role page;
- `src/frontend/index.html` — the Senior Frontend Engineering role page;
- `src/helper/index.html` — the proof-first Jarwis engineering case study;
- `src/styles.css` — design tokens, responsive layout, and diagrams;
- `src/assets/` — optimized public assets.
- `deploy.sh` — guarded production deployment with backup, verification, and rollback.

The site deliberately stays on plain HTML and CSS. Future routes will use static directory-based pages and the shared stylesheet. There is no package manager or build command; vanilla JavaScript may be added only for focused, useful interaction.
