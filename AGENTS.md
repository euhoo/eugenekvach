# AGENTS.md

## Purpose

This repository contains the personal professional website of Eugene Kvach.
The site presents two connected tracks: Senior Frontend Engineering and Applied AI Engineering.

## Product direction

- The primary domain is `eugenekvach.ru`.
- The first release is Russian-first.
- The main entry points are `/`, `/ai`, `/frontend`, and `/helper`.
- `/ai` leads with the production Helper project and its measurable engineering results.
- `/frontend` leads with 7+ years of Angular/Nx and enterprise frontend experience.
- `/helper` is the detailed proof-first engineering case study.
- The website complements role-specific resumes; it does not replace them.

## Engineering principles

- Prefer a static-first implementation with minimal client-side JavaScript.
- Keep the site framework-free: semantic HTML, shared CSS, and only small amounts of vanilla JavaScript when interaction clearly improves the story.
- Do not introduce Astro, TypeScript, npm, a package manager, or a build step unless the user explicitly reverses this decision.
- Treat accessibility, semantic HTML, responsive behavior, and performance as product requirements.
- Keep content concise and evidence-based. Never invent experience, ownership, or metrics.
- Never commit secrets, private medical data, corporate source code, or confidential internal details.
- Avoid generic AI aesthetics and decorative complexity that does not improve the story.

## Workflow

- The default branch is `master`.
- Inspect the repository before editing and preserve unrelated user changes.
- Keep changes small and scoped to the requested task.
- Keep the project dependency-free; there is no package manager or application scaffold.
- Run the relevant build, checks, and tests before handing off code changes.
- Update this file and `README.md` when the project structure or standard commands change.
- Deploy the static site only with `./deploy.sh`; use `./deploy.sh --dry-run` to inspect synchronization without changing production.
- After changing `styles.css`, `evidence.css`, or `evidence.js`, run `./deploy.sh --stamp` to regenerate their cache-busters in the HTML links, then commit. Never edit a hash by hand; `deploy.sh` still fails if a stale hash reaches deployment.

## Current state

The production source lives in `src/` and runs without a build step. Use `python3 -m http.server 4173 --directory src` for local review.

Future `/ai`, `/frontend`, and `/helper` routes should also be plain static pages using the shared stylesheet. There is intentionally no package manager, framework, or build command.

Production deployment is automated by `./deploy.sh`. It requires a clean `master`, pushes the branch, backs up the current remote files, synchronizes only `src/`, verifies HTTPS externally, and rolls back the static files on failure.
