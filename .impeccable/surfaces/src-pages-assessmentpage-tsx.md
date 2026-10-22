---
version: 1
slug: "src-pages-assessmentpage-tsx"
primary_target: "src/pages/AssessmentPage.tsx"
related_targets: ["src/App.tsx","src/pages/CriticalInformationPage.tsx"]
---

Scope: the CareFrame assessment workspace — the service users list, the eleven-section
assessment surface, and the Critical Information pack. Visitor mode: Operate.

Audience: care assessors and social workers, mid-home-visit, often on a tablet, in
sessions that run long and resume across days. Job: record one person's needs across
eleven sections accurately enough that three AI agents can draft a defensible care plan
from it. Action: complete a section, see what it raised, move on. Constraints: no
functional change; light-only; status colour carries clinical meaning; the Critical
Information page rasterises to PDF.

## Direction contract

THESIS: Nothing in a care record is asserted without the thing that evidences it. The
workspace pairs every section with its proof in a third column, so a risk flag, an
attachment and the people named are visible beside the field that produced them rather
than filed three screens away. It refuses the category default of a lone centred form
column with help hidden behind a floating button, and it refuses the dashboard-of-cards
opening that tells an assessor nothing about the person in front of them.

OWN-WORLD: Public Sans throughout (substituted for Inter on the detector overused-font
finding; self-hosted, one family, fixed rem scale at a 1.2 ratio). Warm oat ground (#FAF8F4 / #F3EFE8), white work surfaces, hairline oat rules
at 1px. Slate Teal #1F4A4C owns the left rail and page chrome as a full-height field of
colour, not an accent. Deep Sea #2C6E6B is the only button, link and focus-ring colour.
Sea Mist #78BDB5 marks completion and fills progress. Dusty Mulberry #8F5C72 appears only
where a human being is named. Radii 6–11px, shadows low and offset, never halos. One
family on a fixed rem scale. Recognisable with every word removed
by: the teal rail, the oat ground, the three-column split, and mulberry appearing exactly
where people are.

STORY: The assessor sees who this is about before anything else and never loses it. They
work down one column of fields. As they answer, the right column accumulates what those
answers raised. They finish a section knowing what it cost the person, not just that it
is ticked.

FIRST VIEWPORT: Slate-teal rail 232px at the left, CareFrame mark at its top, eleven
sections beneath as a hairline-marked list, progress pinned to its foot. Across the
remaining width, a white person header 72px tall: avatar in mulberry, name at 18px/600,
NHS number and locality beneath, live risk flags right-aligned. Below it the work area
splits — a 720px field column on oat, and a 340px evidence column on #F3EFE8 separated by
a 1px rule. Primary action sits bottom-left of the field column in a sticky save bar that
also carries the save state.

FORM: Evidence Column — candidate 7 of my ordered list of seven, dealt as the lead.
seed:4075115f57ebf12e

Raises taken from challengers the direction beat:
- From the orienteering map: risk is a layer riding over the record in one reserved ink,
  never editing the terrain beneath. Fields stay neutral; flags sit above them.
- From the boarding pass and gate board: a status that changes moves in place and stays
  lit until it has been seen, instead of vanishing and reappearing elsewhere.
- From the centre-rail reference setting: section states are printed marks on a hairline
  rail — hairline at rest, filled when done, struck when skipped — not a row of pills.

Signature interaction: the evidence column is scoped to the section in view and
re-resolves as the section changes, with each entry carrying the field that produced it.
Motion grammar: 150–200ms exponential ease-out, state only — rail mark filling, evidence
entry arriving in place, save state settling. No page-load choreography.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

## Unresolved

- Whether the Critical Information pack adopts the three-column shell or stays a
  document surface; it rasterises to PDF, so it likely stays a document.
