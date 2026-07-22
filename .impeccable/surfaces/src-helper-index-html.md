---
version: 1
slug: "src-helper-index-html"
primary_target: "src/helper/index.html"
related_targets: []
---

# Surface brief: `/helper/`

- Mode: Read.
- Primary audience: technical leaders and hiring managers evaluating senior applied AI engineering work.
- Job to be done: verify that Jarwis is a real production system and understand the non-obvious engineering decisions behind its reliability, cost, memory, and data paths.
- Primary action: open the live Telegram demo. Secondary action: contact Eugene about a similar production system.
- Proof required above the fold: production status, ×80 fast-path, ~31 ms latency, about −22% input cost, 2454 mixed-level tests, and two production bugs caught before release.
- Chosen structure: an engineering decision record. The narrative moves from proof to the system map and then through four decisions in problem → solution → result → trade-off form.
- Signature interaction: a CSS-only route selector that traces Fast-path, Agent + tools, Memory, and PDF paths through the same architecture without client JavaScript.
- Progressive disclosure: square `?` controls explain evidence metrics, architecture nodes, and PDF stages on hover, tap, and keyboard; click-away and Escape dismiss an open popover, and each decision also has a native expandable term note.
- Tone: restrained production dossier inside the established “Production Interchange” visual world; cobalt for the live-system entry, warm paper for reading, dark graphite for system internals.
- Accessibility and performance: semantic HTML, keyboard-operable controls, visible focus, responsive single-column reading, and one small inline controller only for popover dismissal; no additional local media assets.
- Privacy constraints: no medical documents, personal data, private logs, UUIDs, confidential code, or unverifiable ownership claims.
- Pre-publication checks: smoke-test the demo as a new user and confirm the public wording for the 24 → 15 memory-cleanup result.
