---
name: CareFrame
description: A warm-neutral clinical workspace where every recorded claim sits beside the thing that evidences it.
colors:
  sea-mist: "#78BDB5"
  deep-sea: "#2C6E6B"
  slate-teal: "#1F4A4C"
  teal-deepest: "#112829"
  teal-wash: "#F2F8F7"
  teal-edge: "#C0E0DC"
  dusty-mulberry: "#8F5C72"
  mulberry-wash: "#FAF4F6"
  mulberry-edge: "#E8CFD9"
  oat-ground: "#FAF8F4"
  oat-recessed: "#F3EFE8"
  oat-rule: "#E6E0D5"
  oat-stroke: "#D4CCBD"
  oat-quiet: "#7A7362"
  oat-label: "#3A352E"
  soft-charcoal: "#2E2C28"
  clinical-amber: "#C2410C"
  clinical-red: "#991B1B"
  clinical-green: "#15803D"
  surface-white: "#FFFFFF"
typography:
  headline:
    fontFamily: "Public Sans, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "1.5625rem"
    fontWeight: 600
    lineHeight: "2rem"
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Public Sans, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 600
    lineHeight: "1.625rem"
    letterSpacing: "-0.01em"
  body:
    fontFamily: "Public Sans, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: "1.375rem"
    letterSpacing: "normal"
  control:
    fontFamily: "Public Sans, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: "1.5rem"
    letterSpacing: "normal"
  label:
    fontFamily: "Public Sans, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 500
    lineHeight: "1.25rem"
    letterSpacing: "normal"
  micro:
    fontFamily: "Public Sans, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 400
    lineHeight: "1.125rem"
    letterSpacing: "normal"
  group-label:
    fontFamily: "Public Sans, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "0.6875rem"
    fontWeight: 600
    lineHeight: "1rem"
    letterSpacing: "0.04em"
rounded:
  sm: "4px"
  DEFAULT: "6px"
  md: "7px"
  lg: "9px"
  xl: "11px"
  "2xl": "14px"
  pill: "9999px"
spacing:
  "1.5": "6px"
  "2.5": "10px"
  "3.5": "14px"
  "5": "20px"
  "6": "24px"
  "7": "28px"
  rail: "232px"
  evidence: "340px"
  field-column: "760px"
components:
  button-primary:
    backgroundColor: "{colors.deep-sea}"
    textColor: "{colors.surface-white}"
    typography: "{typography.body}"
    rounded: "{rounded.md}"
    padding: "0 16px"
    height: "40px"
  button-primary-hover:
    backgroundColor: "#255B5B"
    textColor: "{colors.surface-white}"
  button-secondary:
    backgroundColor: "{colors.surface-white}"
    textColor: "#255B5B"
    typography: "{typography.body}"
    rounded: "{rounded.md}"
    padding: "0 16px"
    height: "40px"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "#4F4A40"
    typography: "{typography.body}"
    rounded: "{rounded.md}"
    padding: "0 16px"
    height: "40px"
  button-danger:
    backgroundColor: "{colors.clinical-red}"
    textColor: "{colors.surface-white}"
    typography: "{typography.body}"
    rounded: "{rounded.md}"
    padding: "0 16px"
    height: "40px"
  input:
    backgroundColor: "{colors.surface-white}"
    textColor: "#2E2C28"
    typography: "{typography.control}"
    rounded: "{rounded.md}"
    padding: "10px 12px"
  card:
    backgroundColor: "{colors.surface-white}"
    textColor: "{colors.soft-charcoal}"
    rounded: "{rounded.xl}"
    padding: "24px"
  badge:
    backgroundColor: "{colors.oat-ground}"
    textColor: "#635C4E"
    typography: "{typography.micro}"
    rounded: "{rounded.pill}"
    padding: "4px 10px"
  badge-people:
    backgroundColor: "{colors.mulberry-wash}"
    textColor: "#774B5F"
    typography: "{typography.micro}"
    rounded: "{rounded.pill}"
    padding: "4px 10px"
  section-rail:
    backgroundColor: "{colors.slate-teal}"
    textColor: "{colors.surface-white}"
    width: "{spacing.rail}"
    padding: "20px 0"
  evidence-column:
    backgroundColor: "{colors.oat-recessed}"
    textColor: "{colors.soft-charcoal}"
    width: "{spacing.evidence}"
    padding: "20px"
  avatar:
    backgroundColor: "{colors.dusty-mulberry}"
    textColor: "{colors.surface-white}"
    rounded: "{rounded.pill}"
    size: "36px"
---

# Design System: CareFrame

## Overview

**Creative North Star: "The Open Case File"**

CareFrame is a workspace that behaves like a well-kept paper case file opened flat on a kitchen table: a warm oat ground, white working sheets laid on it, hairline rules instead of boxes, and a tab edge down the left that tells you where you are in the record. Nothing is glossy, nothing floats, nothing asks for attention it has not earned. The register is clinical but domestic — this is at-home care, not a hospital console — which is why the neutral channel is warm oat rather than grey, and why the brand teal is a full-height field of colour on the rail rather than a decorative accent dropped on a white dashboard.

The organising conviction is evidential. The three-column shell — Slate Teal rail (232px), white work surface with a 760px field column, oat evidence column (340px) — exists so that what the record raises sits physically beside the field that raised it. Risk is a layer riding over the terrain in one reserved ink; it never recolours the fields beneath it. People are marked in Dusty Mulberry and nowhere else. Section state is a printed mark on a hairline — hairline at rest, filled when done, struck when skipped — because a list of marks reads as a record and a row of pills reads as a dashboard.

Density is high but unhurried. Body type is 14px with generous 22px leading, controls are 16px so they survive a tablet in bad lamplight, and all numerals are tabular. The build is light-only by decision: the use scene is daytime home visits and PDF output, and there is no dark mode to maintain across eleven section forms. Motion is state-only, 150–220ms on an exponential ease-out, and is fully suppressed under `prefers-reduced-motion`. There is no page-load choreography anywhere in the build.

**Key Characteristics:**
- Warm oat ground (`#FAF8F4`) with white work surfaces and 1px oat hairlines, never grey
- Slate Teal left rail as a full-height field of colour, not a tinted sidebar
- Mulberry reserved exclusively for named human beings in the record
- One typeface, Public Sans, self-hosted, on a fixed rem scale at a ~1.2 ratio
- Low offset shadows only; never a zero-offset halo
- Light-only, tabular numerals, one focus ring product-wide

## Colors

A warm, desaturated palette that sits deliberately between NHS blue and social-care green, with stock clinical hues left untouched beside it.

### Primary
- **Deep Sea** (`#2C6E6B`): The only button, link, caret, focus-ring and active-state colour in the product. Primary buttons, the current rail item, the input focus border, the text cursor, and `accent-color` on native controls all resolve here. If an interactive element is tinted, it is tinted this.
- **Slate Teal** (`#1F4A4C`): Structural chrome. The full-height section rail, the Critical Information pack's section bars, the logotype on light ground, and card group headings. It is a field of colour, not an outline.
- **Sea Mist** (`#78BDB5`): Completion and fill. The filled section mark, the progress bar's advancing fill, and the 3px inset edge on the current rail item. It is the only light teal that signals "done".

### Secondary
- **Dusty Mulberry** (`#8F5C72`): People in the record, and only people. Avatars, the evidence column's people panel, relationship and next-of-kin markers. It never carries system state, never carries status, never decorates. The `purple` scale is aliased to teal in the token config specifically so that a legacy `purple-*` class cannot reach mulberry by accident.

### Tertiary
- **Clinical Amber** (`#C2410C`) / **Clinical Red** (`#991B1B`) / **Clinical Green** (`#15803D`): Stock Tailwind `orange` / `red` / `green`, deliberately left unsoftened when the rest of the palette was warmed. These carry clinical meaning — medium and high risk, critical and error, success and complete — and their recognisability is worth more than palette harmony. Medium risk uses amber at 700 weight, high risk the same hue a step heavier, so the two separate without high reaching for the red that Critical owns.

### Neutral
- **Oat Ground** (`#FAF8F4`): The page itself, and the read-only field background.
- **Oat Recessed** (`#F3EFE8`): The evidence column and other recessed panels. One step down from the page tells you a region is secondary without a border doing it.
- **Oat Rule** (`#E6E0D5`): Every hairline divider, card border, and scrollbar thumb. 1px, always.
- **Oat Stroke** (`#D4CCBD`): Input and control borders at rest.
- **Oat Quiet** (`#7A7362`): Placeholders and the "Not provided" italic state.
- **Soft Charcoal** (`#2E2C28`): Body ink across the whole product.

### Named Rules
**The Mulberry Is People Rule.** Dusty Mulberry marks a named human being in the record and nothing else. If what you are colouring is a state, a status, a count, a category or a chart series, it is not mulberry. Audit test: point at any mulberry pixel and name the person it belongs to; if you cannot, it is wrong.

**The Green Channel Is Taken Rule.** The brand occupies the green channel, so Low risk is neutral oat — not green — and "saved / in progress" is carried by brand teal. Green remains reserved for the clinical success state only. Low risk should not shout; a quiet badge is the correct answer.

**The Colour Is Never Alone Rule.** No status is communicated by hue alone. Every risk badge carries an icon and a word; every alert carries an icon and a title. A screenshot rendered in greyscale must still be readable by a clinician.

**The Clinical Hues Don't Drift Rule.** `green`, `red`, `orange` and `yellow` stay exactly as Tailwind ships them. They were deliberately not warmed when the brand was. Do not harmonise them.

## Typography

**Display Font:** none — the system has no display face by design.
**Body Font:** Public Sans (fallback `system-ui`, `-apple-system`, `Segoe UI`, `sans-serif`)
**Label/Mono Font:** Public Sans for labels; `ui-monospace` / SF Mono exists in config but carries no shipped role.

**Character:** Public Sans is a public-service typeface with open apertures and true tabular numerals, legible at 13–16px in poor light — which is literally the use scene, a tablet on a kitchen table in daylight. One family carries everything; the hierarchy is built from size, weight and colour rather than from a second voice. It is self-hosted from `public/fonts`, so rendering a care record makes no third-party request. It replaced Inter on an overused-font finding.

### Hierarchy
- **Headline** (600, 1.5625rem/2rem, -0.02em): The section title at the top of each assessment section, in Slate Teal. This is the largest type that ships.
- **Title** (600, 1.125rem/1.625rem, -0.01em): Person name in the header, card group headings, empty-state titles, the logotype.
- **Body** (400, 0.875rem/1.375rem): The product's default. Rail items, card text, read-field values, alert copy.
- **Control** (400, 1rem/1.5rem): Every input, textarea and select. One step above body on purpose — the thing being typed into is the thing that must stay legible.
- **Label** (500, 0.8125rem/1.25rem): Field labels, in Oat Label. Always above the control, never floating inside it.
- **Micro** (400, 0.75rem/1.125rem): Metadata lines, hints, errors, badge text, secondary counts.
- **Group label** (600, 0.6875rem/1rem, +0.04em, uppercase): Structural region labels only — "ASSESSMENT" at the rail head, "EVIDENCE · <section>", and the evidence column's panel headings. This is a navigational label for a region, not editorial decoration.

### Named Rules
**The One Family Rule.** Public Sans does everything. There is no display face, no serif accent, no second sans. Hierarchy comes from the fixed rem scale, weight (400/500/600) and ink colour. Do not introduce a second family to make something feel important.

**The Tabular Numerals Rule.** `font-variant-numeric: tabular-nums` is set on `body` product-wide. NHS numbers, dates, phone numbers and counts align in columns and do not jitter as they change. Do not override it.

**The No Decorative Eyebrow Rule.** Uppercase 0.6875rem type labels a *region* (a rail, a column, a panel). It never sits above a heading as an editorial kicker or eyebrow. If a heading needs a line above it to be understood, the heading is wrong.

## Layout

The workspace is a three-column shell inside a full-height flex frame, each column scrolling independently: a 232px Slate Teal section rail, a fluid white work area, and a 340px oat evidence column. Above the work area sits a white person header (avatar, name, NHS/age/postcode metadata, status and risk badges right-aligned) separated by a 1px oat rule, so an assessor never has to navigate to recall whose record they are typing into.

Inside the work area the field column is capped at 760px and centred, with 20–28px horizontal padding and 24px vertical. Fields sit in a two-column grid with a 20px gutter that collapses to one column below the `md` breakpoint. The primary action lives in a sticky bar at the foot of the work area, above a 1px oat rule, so it never scrolls out of reach; the section-started count sits at its far right.

Responsive behaviour is a planned degradation, not a collapse. Below `xl` (1280px) the evidence column leaves the right edge and follows the fields inline as a bordered panel — the thesis holds on a tablet rather than retreating behind a floating help button. Below `lg` (1024px) the rail is replaced by a horizontally scrolling pill tablist across the top; this is the one place pills are correct, because it is a horizontal tab strip and not a state rail.

Spacing rhythm runs on a 2px-derived scale with 10px (`2.5`), 14px (`3.5`), 20px (`5`) and 24px (`6`) doing most of the work. Card interior padding is 24px; rail items are 20px horizontal by 10px vertical; evidence panels stack at 20px.

### Named Rules
**The Three-Column Thesis Rule.** The evidence column is not a sidebar that can be dropped on small screens. It reflows inline beneath the fields and keeps every entry's "raised in" provenance link. Never replace it with a floating help button, a modal or a drawer.

## Elevation & Depth

The system is near-flat and reads depth from tonal layering plus 1px hairlines, not from shadows. The stack is oat ground → white work surface → oat-recessed evidence column, each separated by an Oat Rule hairline. Where shadow is used at all it is low and offset to imply a sheet resting on a surface, never a glow and never a halo. The only zero-offset shadow in the system is the focus ring, which is a ring and not an elevation.

### Shadow Vocabulary
- **Resting sheet** (`box-shadow: 0 1px 2px rgb(31 28 24 / 0.05)`): Cards, primary buttons. The default and by far the most used.
- **Raised sheet** (`box-shadow: 0 1px 3px rgb(31 28 24 / 0.07), 0 1px 2px rgb(31 28 24 / 0.04)`): Slightly lifted panels.
- **Floating panel** (`box-shadow: 0 2px 8px rgb(31 28 24 / 0.08)`): Popovers and menus.
- **Overlay** (`box-shadow: 0 8px 24px rgb(31 28 24 / 0.10)`) / **Modal** (`0 16px 48px rgb(31 28 24 / 0.14)`): Reserved for true overlays.
- **Rail edge** (`box-shadow: inset -1px 0 0 rgb(31 28 24 / 0.06)`): An inset hairline where a rail meets content.
- **Focus ring** (`box-shadow: 0 0 0 3px rgb(44 110 107 / 0.20)`): The input focus halo, paired with a Deep Sea border shift.

### Named Rules
**The No Halo Rule.** Every elevation shadow carries a vertical offset and a cool-charcoal tint (`rgb(31 28 24 / …)`). A zero-offset, evenly-spread shadow is a glow, and the only legitimate glow in this system is the focus ring. No hard offset shadows, no coloured drop shadows.

## Shapes

Corners are gently curved on a tight 4–14px ramp: 4px on small controls, 6–7px on buttons and inputs, 9px on alerts and evidence entries, 11px on cards, 14px reserved. The ramp is deliberately narrow — nothing in the system is pill-shaped except badges and the section marks, where the full round is a semantic signal rather than a style.

Borders do the structural work. Everything that groups is a 1px Oat Rule hairline; nothing is separated by whitespace alone where a rule would be clearer, and nothing is separated by a shadow. Empty states in the evidence column use a 1px *dashed* oat border, which is the system's one dashed form and means "this slot exists and is not yet filled".

Section state in the rail uses an 18px circle: hairline border at rest with the section number inside, filled Sea Mist with a check when done, and a struck line-through mark when skipped. The three states are distinguishable by shape and glyph alone.

## Components

### Buttons
One component serves every action on all three surfaces; a control that looks like a button and is not one of these is a bug.
- **Shape:** Gently curved (`4px` at `sm`, `7px` at `md`/`lg`), heights 32 / 40 / 44px, padding 12 / 16 / 20px horizontal.
- **Primary:** Deep Sea ground, white label, transparent border, resting-sheet shadow. Hover deepens to `#255B5B`, active to Slate Teal.
- **Secondary:** White ground, Deep Sea border and `#255B5B` label; hover fills with the teal wash.
- **Ghost:** Transparent, Oat 700 label; hover fills Oat 100. Used for Back and other recessive actions.
- **Danger:** Clinical Red ground, white label. Reserved for destructive actions, never for risk display.
- **On-dark:** Deep Sea on the Slate Teal rail, hovering *lighter* rather than darker.
- **States:** 150ms colour transition on the exponential ease-out. Disabled is 45% opacity with the shadow removed. Loading swaps the leading icon for a spinner and keeps the width stable.

### Badges
- **Style:** Fully rounded, 1px border, tinted wash ground, 0.75rem semibold label, optional 14px leading icon. Tones: neutral (oat), brand (teal), people (mulberry), success (green), warning (amber), danger (solid Clinical Red with white text), info.
- **Risk scale:** Low = neutral oat + shield-check, Medium = amber-700 + alert-circle, High = amber at a heavier weight + triangle, Critical = solid red + octagon. Every level carries icon *and* word.
- **Status scale:** Draft = neutral, In progress = brand teal, Awaiting sign-off = warning, Complete = green with a check.

### Cards / Containers
- **Corner Style:** 11px.
- **Background:** White on the oat ground.
- **Shadow Strategy:** Resting sheet only.
- **Border:** 1px Oat Rule.
- **Internal Padding:** 24px, or flush when the card holds a table or list to its edges.
- **Group heading:** A 28px teal-wash rounded square holding a 16px icon, beside an 18px/600 Slate Teal heading, with an optional body-size oat description beneath.

### Inputs / Fields
- **Anatomy:** Label above, optional hint beneath the label, control, then error replacing the hint. One shape for every input in the assessment.
- **Style:** White ground, 1px Oat Stroke border, 7px radius, 16px type, 10px/12px padding.
- **Focus:** Border shifts to Deep Sea and a 3px 20%-opacity teal ring appears, on a 150ms shadow transition. The outline is never removed — assessors work by keyboard.
- **Error:** Border and 12px helper text in Clinical Red; the required marker is a red asterisk.
- **Disabled / read-only:** Oat 100 ground with quiet text / Oat 50 ground respectively.
- **Read mode:** `ReadField` shows the label and the value at body size, falling back to an italic quiet-oat "Not provided".
- **Migration boundary:** the eleven legacy section forms resolve through the `.cf-input` / `.cf-label` / `.cf-value` / `.cf-grid` / `.cf-btn` / `.cf-check` component classes rather than the React primitives. Those classes compile from the same tokens and render identically; the split exists because rewriting ~3,000 lines of form JSX risked the field wiring that drives validation and autosave. **New forms use the `<Field>` components.**

### Navigation
- **Section rail:** Full-height Slate Teal field, 232px, logo at the head on its own light chip, "ASSESSMENT" group label, then one row per section at body size. Current row is Deep Sea with a 3px inset Sea Mist edge and a white semibold label; resting rows are teal-100 at 80% opacity and hover to a translucent teal-700. The footer carries the started count and a Sea Mist progress bar on a near-black teal track. The rail gets its own teal scrollbar so it does not punch a light hole in itself.
- **Mobile:** below 1024px, a horizontally scrolling pill tablist on white, teal-filled when current and teal-washed when started.

### Evidence Column (signature)
The component that makes the thesis real. A 340px oat-recessed aside with a left hairline, headed `EVIDENCE · <section>`, holding three icon-labelled panels and an assistant footer. Risks always ride along regardless of the section in view, because risk is a layer over the whole record; people and attachments narrow to the section being worked. Every risk entry is a white 9px card carrying the risk badge, an optional note, and a "Raised in <section>" link back to the field that produced it — nothing appears here without a provenance. The people panel is the one mulberry-washed region in the product. New entries arrive via the 200ms `settle-in` keyframe, translating 4px up into place rather than appearing from nowhere.

## Do's and Don'ts

### Do:
- **Do** use the named `brand` / `teal` / `oat` / `mulberry` scales and the React primitives in `components/ui` for all new work.
- **Do** keep Dusty Mulberry `#8F5C72` for named human beings only — carers, next of kin, relationships, avatars.
- **Do** render Low risk as neutral oat and "saved / in progress" as brand teal; the green channel belongs to the brand.
- **Do** pair every status colour with an icon and a word.
- **Do** express section state as a printed mark on a hairline — hairline at rest, filled when done, struck when skipped.
- **Do** keep controls at 16px and body at 14px, and leave tabular numerals on.
- **Do** separate regions with 1px Oat Rule hairlines and tonal steps (oat ground → white → oat recessed).
- **Do** keep motion to state changes at 150–220ms on `cubic-bezier(0.16, 1, 0.3, 1)`, and leave the `prefers-reduced-motion` suppression intact.
- **Do** self-host type; a care record makes no third-party font request.
- **Do** carry every evidence entry with the field that produced it.

### Don't:
- **Don't** use mulberry for a system state, status, category or chart series.
- **Don't** soften, warm or re-tint `green` / `red` / `orange` / `yellow`; they carry clinical meaning.
- **Don't** add a dark mode or dark-mode variants. Light-only is a decision, not an omission.
- **Don't** add a second typeface, a display face, or a system display font. Public Sans is the whole voice.
- **Don't** use a zero-offset or hard-offset shadow for elevation; offset-and-tinted only, and the focus ring is the sole glow.
- **Don't** remove or restyle the product's single focus ring.
- **Don't** replace the section rail's marks with a row of filled pills (the sub-1024px tab strip is the one exception, and it is a tab strip).
- **Don't** put an uppercase kicker or eyebrow line above a heading; the 0.6875rem uppercase style labels regions only.
- **Don't** reach for stock `blue-*` / `gray-*` / `purple-*` / `indigo-*` classes in new code. They are remapped to brand ramps as a safety net for unmigrated markup, not as an API.
- **Don't** convert existing `.cf-*` section-form markup to the React primitives as a drive-by; that boundary is deliberate and the field wiring is load-bearing.
- **Don't** add page-load choreography, entrance animations or scroll-triggered reveals.
