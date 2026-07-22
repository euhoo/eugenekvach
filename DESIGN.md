---
name: Eugene Kvach Portfolio
description: A proof-first engineering portfolio built as a production interchange.
colors:
  route-blue: "#175cff"
  route-blue-deep: "#0e42bd"
  cool-canvas: "#f3f5f8"
  paper-white: "#ffffff"
  signal-ink: "#101217"
  raised-ink: "#171a20"
  muted-steel: "#5d6470"
  route-line: "#d7dbe3"
  route-line-strong: "#a8afb9"
  dark-line: "#303641"
  dark-line-strong: "#4a5260"
  dark-panel: "#262b34"
  dark-muted: "#aeb6c5"
  blue-on-dark: "#dbe4ff"
typography:
  display:
    fontFamily: "Onest, Helvetica Neue, Arial, sans-serif"
    fontSize: "clamp(3.625rem, 6.4vw, 5.875rem)"
    fontWeight: 600
    lineHeight: 0.98
    letterSpacing: "-0.04em"
  body:
    fontFamily: "Onest, Helvetica Neue, Arial, sans-serif"
    fontSize: "clamp(1.0625rem, 1.35vw, 1.25rem)"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "Onest, Helvetica Neue, Arial, sans-serif"
    fontSize: "0.6875rem"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "0.06em"
  micro:
    fontFamily: "Onest, Helvetica Neue, Arial, sans-serif"
    fontSize: "9px"
    fontWeight: 600
    lineHeight: 1.2
  caption:
    fontFamily: "Onest, Helvetica Neue, Arial, sans-serif"
    fontSize: "10px"
    fontWeight: 600
    lineHeight: 1.3
  metadata:
    fontFamily: "Onest, Helvetica Neue, Arial, sans-serif"
    fontSize: "12px"
    fontWeight: 600
    lineHeight: 1.4
  navigation:
    fontFamily: "Onest, Helvetica Neue, Arial, sans-serif"
    fontSize: "14px"
    fontWeight: 500
    lineHeight: 1.4
  control:
    fontFamily: "Onest, Helvetica Neue, Arial, sans-serif"
    fontSize: "15px"
    fontWeight: 600
    lineHeight: 1.2
  body-compact:
    fontFamily: "Onest, Helvetica Neue, Arial, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.55
  title:
    fontFamily: "Onest, Helvetica Neue, Arial, sans-serif"
    fontSize: "clamp(17px, 1.4vw, 22px)"
    fontWeight: 600
    lineHeight: 1.2
rounded:
  none: "0"
  station: "999px"
spacing:
  xs: "8px"
  sm: "16px"
  md: "32px"
  lg: "64px"
  xl: "96px"
components:
  button-primary:
    backgroundColor: "{colors.signal-ink}"
    textColor: "{colors.paper-white}"
    rounded: "{rounded.none}"
    padding: "0 18px"
    height: "52px"
  button-primary-hover:
    backgroundColor: "{colors.route-blue}"
    textColor: "{colors.paper-white}"
---

# Design System: Eugene Kvach Portfolio

## Overview

**Creative North Star: "The Production Interchange"**

The portfolio behaves like a precise wayfinding system for an engineering practice with two connected routes. Applied AI and Frontend stay distinct, then visibly meet at production. The tone is minimalist and operational: few elements, exact alignment, strong type, factual labels, and diagrams that carry real information.

The old cream, serif, terracotta, broadsheet-like world is an explicit anti-reference. The replacement is cool, direct, and contemporary without using terminal cosplay or generic AI glow.

**Key Characteristics:**

- Two semantic route lines: cobalt for Applied AI, near-black for Frontend.
- Real evidence appears as stations, transfers, traces, and platform diagrams.
- One sans family with pronounced scale and weight contrast.
- Square surfaces and controls; circles are reserved for route stations.
- Spacious composition around dense, useful engineering diagrams.

## Colors

A cool neutral field makes evidence easy to scan; cobalt is semantic, not decorative.

### Primary

- **Route Blue** (`#175cff`): Applied AI routes, active destinations, focus, and the production convergence.
- **Route Blue Deep** (`#0e42bd`): hover and pressed states on blue-owned surfaces.

### Neutral

- **Cool Canvas** (`#f3f5f8`): default page background.
- **Paper White** (`#ffffff`): diagrams and precise foreground surfaces.
- **Signal Ink** (`#101217`): primary text, Frontend routes, and dark sections.
- **Raised Ink** (`#171a20`): system nodes and diagrams on dark sections.
- **Muted Steel** (`#5d6470`): supporting copy and labels on light surfaces.
- **Route Line** (`#d7dbe3`): structural dividers and map grids.
- **Route Line Strong** (`#a8afb9`): control borders and secondary rules.
- **Dark Line / Strong** (`#303641` / `#4a5260`): structural separation inside dark engineering diagrams.
- **Dark Panel** (`#262b34`): foundations and shared infrastructure inside dark diagrams.
- **Dark Muted** (`#aeb6c5`): supporting text on Signal Ink.
- **Blue on Dark** (`#dbe4ff`): blue-owned supporting text on dark or cobalt fields.

**The Route Ownership Rule.** Cobalt marks Applied AI or the point where the two practices converge. It is never scattered as generic emphasis.

## Typography

**Display Font:** Onest (with Helvetica Neue and Arial fallback)  
**Body Font:** Onest (with Helvetica Neue and Arial fallback)  
**Label Font:** Onest with uppercase reserved for map labels and operational metadata

**Character:** One Cyrillic-capable family keeps the system spare. Hierarchy comes from decisive scale, weight, measure, and numeric alignment rather than a decorative second voice.

### Hierarchy

- **Display** (600, `clamp(3.625rem, 6.4vw, 5.875rem)`, 0.98): hero thesis only.
- **Headline** (500–600, `clamp(2.5rem, 5vw, 4.5rem)`, 1.05): major destinations.
- **Title** (600, `17px–22px`, 1.2): station and evidence names.
- **Body** (400, `1.0625rem–1.25rem`, 1.6): explanatory copy capped around 70 characters.
- **Label** (700, `0.6875rem`, `0.06em`, uppercase): map categories, years, and states only.
- **Operational micro-scale** (`9px`, `10px`, `11px`, `12px`, `13px`, `14px`, `15px`, `16px`): diagram labels, metadata, navigation, controls, and compact mobile copy. Each step has a fixed role; never use these sizes for page headings.

**The One Voice Rule.** A single family is intentional; do not add a display serif or technical monospace as costume.

## Layout

The desktop shell is at most 1360px with 32px outer gutters. The hero is an asymmetric two-column interchange: thesis on the left, route map on the right. Long sections alternate between wide evidence diagrams and concise explanatory columns. At 1120px the hero stacks; at 680px navigation and diagrams simplify without shrinking labels into illegibility. Spacing follows an 8px base with 32, 64, and 96px as primary section intervals.

## Elevation & Depth

The system is flat by default. Depth appears only on the primary route map as a structural lifted sheet with a directional offset and soft blur. Dark and cobalt sections create depth through large tonal fields, not stacked card shadows.

## Shapes

Surfaces, buttons, diagrams, and labels use square corners. Circular forms belong exclusively to stations, transfers, and route legends. Thin borders describe structure; thick side accents and decorative pills are not part of the language.

## Components

### Buttons

- **Shape:** square, minimum 48–52px height.
- **Primary:** Signal Ink on Paper White or the inverse; generous horizontal gap between label and arrow.
- **Hover / Focus:** primary transitions to Route Blue and lifts by 2px; focus uses a 3px Route Blue outline.
- **Secondary:** text action with a structural bottom rule, never a rounded ghost button.

### Cards / Containers

Use a container only when the content is a real object: a map, trace, platform, or record. Default surfaces are square, white, and flat; the primary route map alone may use the ambient offset shadow.

### Navigation

Navigation pairs concise route names with outlined station dots. The contact action is a square bordered control. On mobile, the route links collapse while the public name and contact remain visible.

### Route Map

The signature component uses solid orthogonal paths, white-centered stations, real evidence labels, and an explicit production terminal. The grid is allowed only inside maps and engineering diagrams because it encodes coordinates.

### Context Hint

Technical evidence gets just-in-time explanation through a square `?` disclosure placed beside the claim or node it explains. It opens on hover, tap, or keyboard focus/activation and contains one short definition plus the local consequence. A click outside or `Escape` closes it, and only one popover stays open at a time. Keep the trigger visually quiet, preserve a visible focus state, and never rely on a native `title` tooltip as the only explanation.

## Do's and Don'ts

### Do:

- **Do** attach color, dots, lines, and labels to real route meaning.
- **Do** expose measurable evidence near the system element that produced it.
- **Do** vary page-scale density: diagram, quiet explanation, dark destination, and open close.
- **Do** preserve strong mobile type and reorganize diagrams instead of scaling them down.

### Don't:

- **Don't** return to cream, terracotta, serif display type, or editorial section numbering.
- **Don't** use gradients, glass, glow, decorative grids, or generic AI imagery.
- **Don't** build the page from repeated same-size cards.
- **Don't** use route graphics as decoration without information.
