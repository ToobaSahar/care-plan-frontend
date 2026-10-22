---
name: CareFrame
description: A warm-neutral clinical workspace where every recorded claim sits beside the thing that evidences it.
colors:
  sea-mist: "#78BDB5"
  deep-sea: "#2C6E6B"
  slate-teal: "#1F4A4C"
  teal-deepest: "#112829"
  teal-ink: "#1A3C3E"
  teal-wash: "#F2F8F7"
  teal-edge: "#C0E0DC"
  dusty-mulberry: "#8F5C72"
  mulberry-wash: "#FAF4F6"
  mulberry-edge: "#E8CFD9"
  oat-ground: "#F3EFE8"
  oat-recessed: "#F3EFE8"
  oat-rule: "#E6E0D5"
  oat-stroke: "#D4CCBD"
  oat-quiet: "#716A5A"
  oat-label: "#3A352E"
  soft-charcoal: "#2E2C28"
  clinical-amber: "#C2410C"
  clinical-red: "#991B1B"
  clinical-green: "#15803D"
  surface-white: "#FFFFFF"
typography:
  page-title:
    fontFamily: "Public Sans, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "1.875rem"
    fontWeight: 600
    lineHeight: "2.25rem"
    letterSpacing: "-0.025em"
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
  group-title:
    fontFamily: "Public Sans, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "1rem"
    fontWeight: 600
    lineHeight: "1.5rem"
    letterSpacing: "-0.015em"
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
  sm: "5px"
  DEFAULT: "7px"
  md: "8px"
  lg: "10px"
  xl: "14px"
  "2xl": "18px"
  pill: "9999px"
spacing:
  "1.5": "6px"
  "2.5": "10px"
  "3.5": "14px"
  "5": "20px"
  "6": "24px"
  "7": "28px"
  rail: "248px"
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
    padding: "10px 14px"
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
    backgroundColor: "#DFEFED"
    textColor: "{colors.teal-ink}"
    width: "{spacing.rail}"
    padding: "20px 0"
  rail-row-current:
    backgroundColor: "{colors.deep-sea}"
    textColor: "{colors.surface-white}"
    typography: "{typography.body}"
    rounded: "{rounded.lg}"
    padding: "8px 12px"
  person-header:
    backgroundColor: "{colors.surface-white}"
    textColor: "{colors.teal-ink}"
    typography: "{typography.page-title}"
    padding: "20px 32px"
  evidence-column:
    backgroundColor: "{colors.oat-recessed}"
    textColor: "{colors.soft-charcoal}"
    width: "{spacing.evidence}"
    padding: "24px 20px"
  avatar:
    backgroundColor: "{colors.dusty-mulberry}"
    textColor: "{colors.surface-white}"
    rounded: "{rounded.pill}"
    size: "36px"
  avatar-person:
    backgroundColor: "{colors.dusty-mulberry}"
    textColor: "{colors.surface-white}"
    rounded: "{rounded.pill}"
    size: "56px"
---

# Design System: CareFrame

## Overview

**Creative North Star: "The Open Case File"**

CareFrame is a workspace that behaves like a well-kept paper case file opened flat on a kitchen table: a warm oat ground, white working sheets laid on it, hairline rules instead of boxes, and a tab edge down the left that tells you where you are in the record. Nothing is glossy, nothing floats, nothing asks for attention it has not earned. The register is clinical but domestic — this is at-home care, not a hospital console — which is why the neutral channel is warm oat rather than grey, and why the brand teal is a full-height field of colour on the rail rather than a decorative accent dropped on a white dashboard. Everything to the right of the rail is daylight: oat ground, white sheets, hairline rules. The rail is the one full-height field of colour on any screen, which is what lets it say CareFrame on its own.

The organising conviction is evidential. The three-column shell — Sea Mist tint rail (248px), a white section sheet in a 760px field column on the oat ground, oat-recessed evidence column (340px) — exists so that what the record raises sits physically beside the field that raised it. Risk is a layer riding over the terrain in one reserved ink; it never recolours the fields beneath it. People are marked in Dusty Mulberry and nowhere else. Section state is a printed mark on a hairline — hairline at rest, filled when done, struck when skipped — because a list of marks reads as a record and a row of pills reads as a dashboard.

Density is high but unhurried. Body type is 14px with generous 22px leading, controls are 16px so they survive a tablet in bad lamplight, and all numerals are tabular. The build is light-only by decision: the use scene is daytime home visits and PDF output, and there is no dark mode to maintain across eleven section forms. Motion is state-only, 150–220ms on an exponential ease-out, and is fully suppressed under `prefers-reduced-motion`. There is no page-load choreography anywhere in the build.

**Key Characteristics:**
- Warm oat ground (`#FAF8F4`) with white sheets and 1px oat hairlines, never grey
- Daylight shell: the Sea Mist tint left rail (teal-100 with a teal-200 hairline edge) is the only full-height field of colour
- One sheet per record view; groups inside it are hairline-separated, never nested cards
- Mulberry reserved exclusively for named human beings in the record
- One typeface, Public Sans, self-hosted, on a fixed rem scale at a ~1.2 ratio
- Low offset shadows only; never a zero-offset halo
- Light-only, tabular numerals, one focus ring product-wide

## Colors

A warm, desaturated palette that sits deliberately between NHS blue and social-care green, with stock clinical hues left untouched beside it.

### Primary
- **Deep Sea** (`#2C6E6B`): The only button, link, caret, focus-ring and active-state colour in the product. Primary buttons, the current rail row's fill, the input focus border, the secondary button's hover edge, the text cursor, and `accent-color` on native controls all resolve here. If an interactive element is tinted, it is tinted this.
- **Slate Teal** (`#1F4A4C`): Structural ink. The logotype wordmark (including on the tint rail, the narrow-screen top bar and the sign-in brand panel), and every heading that names a part of the record (page titles, section titles, group titles). It owns no full-height field; the rail is the Sea Mist tint (`#DFEFED`).
- **Teal Ink** (`#1A3C3E`): The person's name, in the person header and on the Critical Information pack. One step deeper than Slate Teal so the name outranks every heading around it; also the ink of the rail's foot-block values and active row text (resting rows at 85%), the sign-in product name, and working alerts.
- **Sea Mist** (`#78BDB5`): Completion and fill. The progress bar's advancing fill on daylight. On the tint rail, completion steps one shade deeper (teal-500, `#46918C`) for the filled section mark and the rail progress fill so it holds against the tint. The rail itself is Sea Mist's tint (`#DFEFED`, teal-100) edged in `#C0E0DC` (teal-200).

### Secondary
- **Dusty Mulberry** (`#8F5C72`): People in the record, and only people. Avatars (with a Mulberry Wash ring at header scale), the evidence column's people panel, relationship and next-of-kin markers. It never carries system state, never carries status, never decorates. The `purple` scale is aliased to teal in the token config specifically so that a legacy `purple-*` class cannot reach mulberry by accident.

### Tertiary
- **Clinical Amber** (`#C2410C`) / **Clinical Red** (`#991B1B`) / **Clinical Green** (`#15803D`): Stock Tailwind `orange` / `red` / `green`, deliberately left unsoftened when the rest of the palette was warmed. These carry clinical meaning — medium and high risk, critical and error, success and complete — and their recognisability is worth more than palette harmony. Medium risk uses amber at 700 weight, high risk the same hue a step heavier, so the two separate without high reaching for the red that Critical owns.

### Neutral
- **Oat Ground** (`#F3EFE8`, `oat-100`): The one off-white. The page ground, every sidebar and top bar, the evidence column, inset panels inside white sheets, read-only fields, and the hover tint on white rows. There is no second off-white: `#FAF8F4` (`oat-50`) is no longer used as a surface. Anything on this ground that needs a hover lifts to white rather than to another oat.
- **Surface White** (`#FFFFFF`): The one white. Sheets, the person header, the action bar, inputs, popovers, count chips, and the hover for rows on the oat ground. No translucent whites.
- **Oat Rule** (`#E6E0D5`): Every hairline divider, sheet border, group separator, and scrollbar thumb. 1px, always.
- **Oat Stroke** (`#D4CCBD`): Input and control borders at rest, and the secondary button's edge until hover commits it to teal.
- **Oat Quiet** (`#716A5A`; was `#7A7362`, darkened one step so small text holds 4.5:1 on Oat Ground): Placeholders and the "Not provided" italic state.
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
- **Page title** (600, 1.875rem/2.25rem, -0.025em): The workspace page heading (Service users, Team), the sign-in heading, and the person's name in the header at desktop width (it steps down to 1.3125rem and 1.5625rem on narrower screens). The largest type that ships, and reserved for naming the page or the person.
- **Headline** (600, 1.5625rem/2rem, -0.02em): The section title at the top of each assessment section, in Slate Teal, with "Section N of 10" beside it in micro Oat Quiet. Plain words, not a monospaced counter.
- **Title** (600, 1.125rem/1.625rem, -0.01em): List headings above a sheet ("Service users", "Care team"), form-sheet headings, care plan area titles in the pack, empty-state titles, the logotype.
- **Group title** (600, 1rem/1.5rem, -0.015em): The heading of a field group inside a section sheet, in Slate Teal with an optional 18px Deep Sea icon.
- **Body** (400, 0.875rem/1.375rem): The product's default. Rail items, card text, read-field values, alert copy.
- **Control** (400, 1rem/1.5rem): Every input, textarea and select. One step above body on purpose — the thing being typed into is the thing that must stay legible.
- **Label** (500, 0.8125rem/1.25rem): Field labels, in Oat Label. Always above the control, never floating inside it.
- **Micro** (400, 0.75rem/1.125rem): Metadata lines, hints, errors, badge text, secondary counts.
- **Group label** (600, 0.6875rem/1rem, +0.04em, uppercase): Structural region labels only — "ASSESSMENT" / "WORKSPACE" at the rail head, "EVIDENCE · <section>", the evidence column's panel headings, and the date picker's weekday header. Everything else that labels a fact (person-header facts, pack field labels, column headers) is sentence-case micro in Oat Quiet. This is a navigational label for a region, not editorial decoration.

### Named Rules
**The One Family Rule.** Public Sans does everything. There is no display face, no serif accent, no second sans. Hierarchy comes from the fixed rem scale, weight (400/500/600) and ink colour. Do not introduce a second family to make something feel important.

**The Tabular Numerals Rule.** `font-variant-numeric: tabular-nums` is set on `body` product-wide. NHS numbers, dates, phone numbers and counts align in columns and do not jitter as they change. Do not override it.

**The No Decorative Eyebrow Rule.** Uppercase 0.6875rem type labels a *region* (a rail, a column, a panel). It never sits above a heading as an editorial kicker or eyebrow. If a heading needs a line above it to be understood, the heading is wrong.

## Layout

Every screen is daylight on Oat Ground beside one 248px Sea Mist tint rail. The assessment is a three-column shell inside a full-height flex frame, each column scrolling independently: the section rail, a fluid oat work area, and a 340px oat-recessed evidence column. Above the work area and evidence sits the person header, a white band with a bottom Oat Rule hairline: a 56px mulberry avatar (48px on narrow screens) with a 4px Mulberry Wash ring, the name in Teal Ink at page-title scale and never truncated, then a run of facts (NHS, Age, Postcode, Assessor) as sentence-case micro Oat Quiet labels beside medium-weight Oat Label values, with status and risk badges trailing. An assessor never has to navigate to recall whose record they are typing into.

Inside the work area the field column is capped at 760px and centred (20px padding, 32px from `sm`). It holds the section headline, any alerts, then the section as one white sheet (20px padding, 28px from `sm`). Fields sit in a two-column grid with a 20px gutter that collapses to one column below `md`. The primary action lives in a white sticky bar at the foot of the work area, above a 1px oat rule, so it never scrolls out of reach; the started count sits at its far right.

Service users and Team share one workspace frame: the same 248px rail (logo, "WORKSPACE" label, icon nav rows, and the signed-in account in a white/70 foot block with a teal-200 ring), and a work area capped at 1024px (`max-w-5xl`) with a page-title heading, a one-line Oat 600 description and right-aligned actions. Sign-in is a split: a Sea Mist tint brand panel (5 of 12 parts, teal-200 right hairline) carrying the full-colour logo lockup and the product name in Teal Ink at page-title scale — the mark appears once, whole, and is never cropped, ghosted or used as a watermark; the form sits directly on oat in a 400px column, with no card around it.

Responsive behaviour is a planned degradation, not a collapse. On the assessment: from `xl` (1280px) the 248px rail docks beside the work and the assessor can collapse it to a 72px icon strip (marks only, titles on hover and keyboard focus); that choice is remembered on the device. From `md` (768px) to `xl` the rail is always the icon strip, and its expand control slides the full rail over the content as a drawer instead of squeezing the fields. From `lg` (1024px) the evidence column sits beside the fields (300px, 340px from `xl`); below `lg` it follows the section sheet inline as a rounded, hairline-bordered panel, so the thesis holds on a tablet rather than retreating behind a floating help button. Below `md` the page scrolls as one: the person header scrolls away, a sticky white section bar (section title, the person's name and "Section N of 10") opens the same drawer, and the action bar pins to the foot of the screen with Back reduced to its arrow. Workspace screens and sign-in still give way below `lg` to a slim Sea Mist tint top bar with a teal-200 bottom hairline carrying the logo, nav and sign-out, so the brand field never disappears.

Spacing rhythm runs on a 2px-derived scale with 10px (`2.5`), 14px (`3.5`), 20px (`5`) and 24px (`6`) doing most of the work. Card interior padding is 24px; list rows are 20px by 14px; rail rows are 12px by 8px inside a 12px inset; field groups inside a sheet are separated by 24px above a hairline; evidence panels stack at 24px.

### Named Rules
**The Three-Column Thesis Rule.** The evidence column is not a sidebar that can be dropped on small screens. It reflows inline beneath the fields and keeps every entry's "raised in" provenance link. Never replace it with a floating help button, a modal or a drawer.

**The One Sheet Rule.** A record view is one white sheet. Groups inside it are separated by a hairline and a heading, never by a second bordered box; a card inside a card reads as two documents, and this is one record. Lists (service users, team) are likewise one sheet with hairline rows, not a stack of cards.

## Elevation & Depth

The system is near-flat and reads depth from tonal layering plus 1px hairlines, not from shadows. The stack is oat ground → white sheet → oat-recessed evidence column, each separated by an Oat Rule hairline. Where shadow is used at all it is low and offset to imply a sheet resting on a surface, never a glow and never a halo. The only zero-offset shadow in the system is the focus ring, which is a ring and not an elevation.

### Shadow Vocabulary
- **Sheet** (`box-shadow: 0 1px 2px rgb(31 28 24 / 0.04), 0 4px 16px -6px rgb(31 28 24 / 0.08)`): Every white sheet laid on the oat ground — the section sheet, service users and team list sheets, the add-colleague form, skeleton lists, the Critical Information document. Hairline-weight contact plus a soft offset fall: paper resting on a table.
- **Resting** (`box-shadow: 0 1px 2px rgb(31 28 24 / 0.05)`): Small objects rather than sheets — primary and secondary buttons, evidence entries.
- **Raised** (`box-shadow: 0 1px 3px rgb(31 28 24 / 0.07), 0 1px 2px rgb(31 28 24 / 0.04)`) / **Floating** (`0 2px 8px rgb(31 28 24 / 0.08)`): Defined in the scale; no current primitive uses them.
- **Overlay** (`box-shadow: 0 8px 24px rgb(31 28 24 / 0.10)`): The date picker and select listbox popovers.
- **Modal** (`box-shadow: 0 16px 48px rgb(31 28 24 / 0.14)`): The assistant drawer.
- **Rail row** (`box-shadow: 0 1px 2px rgb(31 74 76 / 0.25)`): The current Deep Sea row on the Sea Mist tint rail. On the teal tint the contact shadow takes Slate Teal rather than charcoal, the same principle as charcoal on oat.
- **Focus ring** (`box-shadow: 0 0 0 3px rgb(44 110 107 / 0.20)`): The input focus halo, paired with a Deep Sea border shift.

### Named Rules
**The No Halo Rule.** Every elevation shadow carries a vertical offset and takes the tint of the ground it falls on: cool charcoal (`rgb(31 28 24 / …)`) on daylight, Slate Teal on the tint rail. A zero-offset, evenly-spread shadow is a glow, and the only legitimate glow in this system is the focus ring. No hard offset shadows, no accent-coloured drop shadows.

## Shapes

Corners are softly curved on a 5–18px ramp, softened one step from the original so sheets read as paper laid down rather than boxes drawn: 7px on small buttons, 8px on buttons, inputs and small icon tiles, 10px on rail rows, alerts, evidence entries, check rows, popovers and 36px icon tiles, 14px on sheets, list sheets, callouts, the inline evidence panel and the rail's foot blocks, and 18px only for the Critical Information document and the empty-state icon tile. The full round is reserved for things that are tokens rather than surfaces: badges, count chips, avatars, section marks, progress bars, and the narrow-screen section tab strip.

Borders do the structural work. Everything that groups is a 1px Oat Rule hairline; nothing is separated by whitespace alone where a rule would be clearer, and nothing is separated by a shadow. Grids of facts use one of two hairline forms: a field grid where each cell is topped by a hairline (label beneath it, value below), or a tile grid where white tiles sit 1px apart on an Oat Rule ground inside a 14px bordered frame, so the gaps draw the rules. Empty states in the evidence column use a 1px *dashed* oat border, which is the system's one dashed form and means "this slot exists and is not yet filled".

Section state in the rail uses an 18px circle: hairline border at rest with the section number inside, filled teal-500 with a white check when done, and a struck line-through mark when skipped. The three states are distinguishable by shape and glyph alone.

## Components

### Buttons
One component serves every action on all three surfaces; a control that looks like a button and is not one of these is a bug.
- **Shape:** Softly curved (7px at `sm`, 8px at `md`/`lg`), heights 32 / 40 / 44px, padding 12 / 16 / 20px horizontal.
- **Primary:** Deep Sea ground, white label, transparent border, resting-sheet shadow. Hover deepens to `#255B5B`, active to Slate Teal.
- **Secondary:** White ground, Oat Stroke edge and `#255B5B` label, resting shadow; hover commits the edge to Deep Sea and fills with the teal wash. A neutral edge at rest because a list of rows each carrying a teal outline reads as a list of calls to action.
- **Ghost:** Transparent, Oat 700 label; hover fills Oat 100. Used for Back and other recessive actions.
- **Danger:** Clinical Red ground, white label. Reserved for destructive actions, never for risk display.
- **On-dark:** Deep Sea hovering *lighter* rather than darker; still defined but unused now the rail is a light tint. Recessive rail actions ("Back to service users", "Sign out") use Secondary.
- **States:** 150ms colour transition on the exponential ease-out. Disabled is 45% opacity with the shadow removed. Loading swaps the leading icon for a spinner and keeps the width stable.

### Badges
- **Style:** Fully rounded, 1px border, tinted wash ground, 0.75rem semibold label, optional 14px leading icon. Tones: neutral (oat), brand (teal), people (mulberry), success (green), warning (amber), danger (solid Clinical Red with white text), info.
- **Role badges:** Admin is brand teal, everyone else neutral. A role is a permission, not a person, so it is never mulberry.
- **Count chips:** A count beside a list heading or evidence panel heading is a small fully-rounded white chip with an Oat Rule edge and tabular Oat 600 numerals. Shown only when the count is above zero.
- **Risk scale:** Low = neutral oat + shield-check, Medium = amber-700 + alert-circle, High = amber at a heavier weight + triangle, Critical = solid red + octagon. Every level carries icon *and* word.
- **Status scale:** Draft = neutral, In progress = brand teal, Awaiting sign-off = warning, Complete = green with a check.

### Sheets / Containers
- **Corner Style:** 14px.
- **Background:** White on the oat ground.
- **Shadow Strategy:** Sheet shadow only.
- **Border:** 1px Oat Rule.
- **Internal Padding:** 24px (the section sheet runs 20px, 28px from `sm`), or flush when the sheet holds a list to its edges.
- **Field groups:** Inside a section sheet, each group after the first sits under a 1px Oat Rule hairline with 24px above its content, headed by a group title in Slate Teal with an optional 18px Deep Sea icon. Sub-headings inside a group are body-size 600 Oat Label.
- **Check rows:** A checkbox and its label set as one selectable row: 10px corners, Oat Rule edge on white, the whole row is the hit area; hover steps to Oat Stroke on Oat Ground, and a checked row turns to a teal-wash ground with a teal-200 edge.
- **Callout:** The closing call to action on the last section: a 14px teal-wash panel with a teal-200 edge and 24px padding. The add-colleague one-time-password notice uses the same form.

### Lists (Service users, Team)
One white sheet per list, under a title-size Oat 900 heading with its count chip. The service users list carries a column header row (Oat Ground, micro Oat Quiet labels, bottom hairline); rows are 20px by 14px, divided by Oat Recessed hairlines, hovering to Oat Ground. Each row leads with the person's mulberry avatar. On the team roster an account without access sits on Oat Ground in Oat 600 ink rather than being hidden. Loading is skeleton rows inside the same sheet, never a centred spinner.

### Inputs / Fields
- **Anatomy:** Label above, optional hint beneath the label, control, then error replacing the hint. One shape for every input in the assessment.
- **Style:** White ground, 1px Oat Stroke border stepping to Oat 400 on hover, 8px radius, 16px type, 10px/14px padding, and a near-invisible 1px contact line beneath.
- **Focus:** Border shifts to Deep Sea and a 3px 20%-opacity teal ring appears, on a 150ms shadow transition. The outline is never removed — assessors work by keyboard.
- **Error:** Border and 12px helper text in Clinical Red; the required marker is a red asterisk.
- **Disabled / read-only:** Oat 100 ground with quiet text / Oat 50 ground respectively.
- **Read mode:** `ReadField` shows the label and the value at body size, falling back to an italic quiet-oat "Not provided".
- **Migration boundary:** the eleven legacy section forms resolve through the `.cf-input` / `.cf-label` / `.cf-value` / `.cf-grid` / `.cf-btn` / `.cf-check` component classes rather than the React primitives. Those classes compile from the same tokens and render identically; the split exists because rewriting ~3,000 lines of form JSX risked the field wiring that drives validation and autosave. **New forms use the `<Field>` components.**

### Navigation
- **Section rail:** Full-height Sea Mist tint field (`#DFEFED`, teal-100) with a 1px teal-200 (`#C0E0DC`) right edge, 248px, the full-colour logo mark with Slate Teal wordmark at the head, an "ASSESSMENT" group label in teal-700, then one row per section at body size. Rows are inset rounded rows (12px from each rail edge, 10px corners, 8px by 12px) with a section mark and a label that wraps rather than truncates. The current row fills Deep Sea with a white semibold label and the rail-row contact shadow; resting rows are Teal Ink at 85% and hover to a 70% white fill with full Teal Ink text. Section marks: resting is a teal-300 ring with a teal-700 numeral; done is a teal-500 fill with a white check (white fill, teal-700 check when also current); current is an 80% white ring; skipped is a teal-400 ring with a teal-600 minus. At the foot, the started count (teal-800 label, Teal Ink value) and a progress bar in its `onTint` mode (white track with a teal-200 inset ring, teal-500 fill) sit in a 14px white/70 block with a 1px teal-200 ring, with "Back to service users" as a secondary button beneath. The rail's scrollbar thumb is teal-300 (`#A9D7D1`) on a transparent track.
- **Workspace rail:** The same field, width, row form and current state for Service users and Team, with an 18px icon on each row, a "WORKSPACE" label, and the signed-in name (Teal Ink), role (teal-700) and a secondary "Sign out" in the same white/70, teal-200-ringed foot block. The account stays named on screen because devices are shared.
- **Sidebar toggle (every screen):** one collapse preference for the whole product, remembered on the device, shared by the assessment rail and the workspace rail through the same `RailFrame`. The control is a 24px round handle straddling the sidebar's 1px edge, 144px above the foot of the screen: white, Oat Stroke edge, Deep Sea chevron (left to collapse, right to expand), committing to the teal wash (`teal-50`) and a Deep Sea edge on hover, with a 40px hit area. The drawer carries the same handle at the same height on its own edge to close. The collapsed workspace strip keeps the nav icons, recent people as avatars and the account as an avatar in the Slate Teal card with sign-out beneath; every icon is named by tooltip.
- **Collapsed rail and drawer:** the icon strip keeps the rail's marks and current-row fill in 44px square rows, the logo mark alone at its head with the expand control beneath, the started count as a compact Slate Teal block, and Back as a square secondary button. Titles appear in a white tooltip with an Oat Rule edge and the overlay shadow, on mouse hover and keyboard focus only. The drawer is the full rail at 280px on the oat ground with the modal shadow over an oat-950/30 scrim, a close control in place of the collapse toggle; it holds focus, closes on Escape, the scrim or a chosen section, and returns focus to whatever opened it. It carries navigation only, never evidence.
- **Mobile:** below 768px, the assessment uses the sticky section bar described under Layout; workspace screens use the slim Sea Mist tint top bar with a teal-200 bottom hairline.

### Evidence Column (signature)
The component that makes the thesis real. A 340px Oat Recessed aside with a left hairline, headed `EVIDENCE · <section>`, holding three panels and an assistant footer above a hairline. Each panel heading is a group label with a 14px Deep Sea icon and a count chip. It is always on the light ground; it narrows to 300px between 1024px and 1280px, and below 1024px the same component renders inline after the section sheet as a 14px bordered panel. Risks always ride along regardless of the section in view, because risk is a layer over the whole record; people and attachments narrow to the section being worked. Every risk entry is a white 10px card with the resting shadow, carrying the risk badge, an optional note, and a "Raised in <section>" link back to the field that produced it — nothing appears here without a provenance. The people panel is one mulberry-washed list with mulberry-edged hairline rows, the one mulberry-washed region in the workspace. Empty panels are dashed slots that say what will appear and where it comes from. New entries arrive via the 200ms `settle-in` keyframe, translating 4px up into place rather than appearing from nowhere.

### Critical Information Pack
The printable summary of one person's record, as a single document sheet (18px corners, sheet shadow) on the oat ground, capped at 1024px. A screen-only sticky white toolbar with a bottom hairline carries Back and Download PDF; it and any notice banner are hidden in print, and the page ground turns white. Inside the sheet: a header with the dark logo mark, provider and date, then the person at scale (a 64–80px mulberry avatar with a Mulberry Wash ring and the name in Teal Ink at headline-to-page-title scale); then sections divided by Oat Rule hairlines at 40px padding, each with a 1.3125rem Slate Teal title. Facts use the hairline-topped field grid; care status and key facts use the hairline tile grid with an 18px Deep Sea icon set inline beside each title, never boxed; each care plan area is one block (title, its fields at a prose measure) with an Oat Ground side panel for level of need and next review date.

## Do's and Don'ts

### Do:
- **Do** use the named `brand` / `teal` / `oat` / `mulberry` scales and the React primitives in `components/ui` for all new work.
- **Do** keep Dusty Mulberry `#8F5C72` for named human beings only — carers, next of kin, relationships, avatars.
- **Do** render Low risk as neutral oat and "saved / in progress" as brand teal; the green channel belongs to the brand.
- **Do** pair every status colour with an icon and a word.
- **Do** express section state as a printed mark on a hairline — hairline at rest, filled when done, struck when skipped.
- **Do** keep controls at 16px and body at 14px, and leave tabular numerals on.
- **Do** separate regions with 1px Oat Rule hairlines and tonal steps (oat ground → white → oat recessed).
- **Do** keep everything right of the rail on the light ground; the Sea Mist tint rail (and its narrow-screen top bar and the sign-in brand panel, in the same tint) is the only field of colour.
- **Do** group fields inside a sheet with a hairline and a group title.
- **Do** keep motion to state changes at 150–220ms on `cubic-bezier(0.16, 1, 0.3, 1)`, and leave the `prefers-reduced-motion` suppression intact.
- **Do** self-host type; a care record makes no third-party font request.
- **Do** carry every evidence entry with the field that produced it.

### Don't:
- **Don't** use mulberry for a system state, status, category or chart series.
- **Don't** soften, warm or re-tint `green` / `red` / `orange` / `yellow`; they carry clinical meaning.
- **Don't** add a dark mode or dark-mode variants. Light-only is a decision, not an omission. This includes dark-ground versions of the work area, person header or evidence column.
- **Don't** nest a bordered card inside a section sheet, or render a list as a stack of cards.
- **Don't** add a second typeface, a display face, or a system display font. Public Sans is the whole voice.
- **Don't** use a zero-offset or hard-offset shadow for elevation; offset-and-tinted only, and the focus ring is the sole glow.
- **Don't** remove or restyle the product's single focus ring.
- **Don't** replace the section rail's marks with a row of filled pills; the collapsed strip and the drawer keep the same marks.
- **Don't** put an uppercase kicker or eyebrow line above a heading; the 0.6875rem uppercase style labels regions only.
- **Don't** reach for stock `blue-*` / `gray-*` / `purple-*` / `indigo-*` classes in new code. They are remapped to brand ramps as a safety net for unmigrated markup, not as an API.
- **Don't** convert existing `.cf-*` section-form markup to the React primitives as a drive-by; that boundary is deliberate and the field wiring is load-bearing.
- **Don't** add page-load choreography, entrance animations or scroll-triggered reveals.
