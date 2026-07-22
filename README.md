# eugenekvach

Source code for [eugenekvach.ru](https://eugenekvach.ru) — the personal website of Eugene Kvach, Senior Frontend & Applied AI Engineer.

## Current version

The first release is a static HTML/CSS landing page in `prototype/`. It is intentionally framework-free so the approved visual direction can go live while the deeper `/ai`, `/frontend`, and `/helper` routes are developed.

Run it locally:

```bash
python3 -m http.server 4173 --directory prototype
```

Then open `http://127.0.0.1:4173/`.

## Structure

- `prototype/index.html` — the Russian-first home page;
- `prototype/styles.css` — design tokens, responsive layout, and diagrams;
- `prototype/assets/` — optimized public assets.

The site deliberately stays on plain HTML and CSS. Future routes will use static directory-based pages and the shared stylesheet. There is no package manager or build command; vanilla JavaScript may be added only for focused, useful interaction.
