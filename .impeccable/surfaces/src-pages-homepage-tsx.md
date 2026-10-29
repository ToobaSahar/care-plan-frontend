---
version: 1
slug: "src-pages-homepage-tsx"
primary_target: "src/pages/HomePage.tsx"
related_targets: ["src/App.tsx"]
---

# Home page

Scope: the public home page at `/`, Persuade mode. Audience: care provider managers (owners and registered managers of home-care agencies), who decide and pay; also shown in person at demos. Job: recognise their own problem, understand the three-step answer, see it working, and start. Action: "Start an assessment", routed to `/assessment` so the existing gate sends a signed-out visitor through sign-in and on into a new assessment. No standalone sign-in button (user decision). Signed-in staff also get "Open workspace". All people, records and plans are fictional sample data, labelled. No counts of assessment sections or plan areas are stated (user decision: keep it generic). Claims stay to what the code does.

Structure (consumer-psychology order): attention, problem, plan, proof (incl. one live record), outcome, authority, objections, action.

Memorable moment: the scroll-scrubbed reading stage, three passes over one record.

Unresolved: a demo-request destination for prospects without an account (recommended; none exists yet).

## Direction contract

THESIS: One sample record is read three times on screen, analyser, planner, reviewer, so the mechanism is visible beside the benefit. Refuses the split hero with a static screenshot and a row of feature cards beneath.

OWN-WORLD: CareFrame's case file on oat: white 14px sheets with hairline groups, sections ruled off by hairlines, Public Sans alone, Deep Sea actions, reading passes in Sea Mist, Deep Sea and Slate Teal, mulberry only on named people; one full Slate Teal field carries the reading stage.

STORY: A manager sees the outcome with the product working, recognises the week it ends, learns the three steps, watches each one, changes an answer and sees evidence, plan and pack follow, sees the problems resolved, reads why it is safe, has objections answered, and starts an assessment.

FIRST VIEWPORT: Plain oat bar (lockup, four links, "Start an assessment"). Left six columns: two-line h1 "Less writing. Safer care plans." near 5.2vw, one-sentence lede, primary "Start an assessment", secondary "See how it works", signed-first reassurance. Right six: the sample section sheet at true UI scale, Replay in its header, a typed answer, three passes, reader notes beneath.

FORM: Three readers, #6 on my ranked list of seven, dealt lead. seed:1119bcef39fbdd84. Signature interaction: the pinned, scroll-scrubbed three-pass stage. Motion grammar: nothing readable waits on a trigger; passes sweep, marks fill and strike, the pack lands, signatures write, all on exponential ease-out; reduced motion shows every final state.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
