# CentiCare

## What it is

A Universal Care Needs Assessment tool for UK domiciliary (at-home) social care. An
assessor works through eleven sections about one service user, and the system turns that
record into a care plan and a printable Emergency Admission Pack.

The mechanism that is actually unique: the assessment is not a form that gets filed. It is
the input to three AI agents — an Assessment Analyzer, a Care Plan Specialist and a Quality
Assurance reviewer — that read the completed record and draft a care plan the assessor then
reviews and signs. The form is the raw material; the plan is the product.

## Who uses it

**Primary — care assessors and social workers.** They fill this in during a home visit,
frequently on a tablet, sitting in someone's living room or at a kitchen table. Daylight or
bad lamplight. Interruptions. They are not technical. Sessions run long: eleven sections is
not a five-minute task, and a single assessment may be picked up and put down across days.

**Secondary — the people being assessed, and their families**, who can see the screen while
it is being filled in. What is on it is about them, and it is often sensitive: diagnoses,
continence, finances, safeguarding concerns, end-of-life preferences.

**Tertiary — reviewers and commissioners**, who read the generated plan and the Emergency
Admission Pack rather than the form.

## What it does

- Eleven assessment sections: personal details, basic needs, health and medical, daily
  living, risks and safeguarding, social and emotional wellbeing, environment and lifestyle,
  advance preferences, optional areas, summary.
- Draft / in-progress / complete lifecycle per assessment, with section-level progress.
- Attachment upload and signature capture against an assessment.
- An assistant chat panel alongside the form.
- AI care plan generation from the completed record.
- A Critical Information view — the Emergency Admission Pack — exportable to PDF.
- Data lives in Supabase; care plan generation runs against a FastAPI/CrewAI backend.

## Constraints

- **No functional change.** Routes, data flow, state, API calls, validation rules, field
  semantics and copy meaning stay exactly as they are. This work is presentation only.
- **Stack is fixed:** React 18, TypeScript, Vite 4, Tailwind 3, Zustand, react-hook-form +
  zod, lucide-react, jsPDF, Supabase.
- The Critical Information page is exported to PDF via jsPDF/html2canvas, so whatever it
  renders has to survive rasterisation on a white page.
- Clinical status colour — success, warning, risk levels, error — carries meaning and cannot
  be re-assigned for aesthetic reasons.
- Light-only. The use scene is daytime home visits and printed output; there is no dark mode
  requirement and no appetite for maintaining one across eleven section forms.

## Brand commitments

Locked by the user before this work started, and not open for redesign:

- **Name and logo:** CentiCare. The mark is an abstract "E"/frame built from stacked leaves
  in the brand teals plus one mulberry leaf. Files live in `public/brand/`.
- **Palette:** Sea Mist `#78BDB5`, Deep Sea `#2C6E6B`, Slate Teal `#1F4A4C`, Dusty Mulberry
  `#8F5C72`, Soft Charcoal `#2E2C28`, on warm oat neutrals.
- **Assigned roles:** teal carries primary action and structure; mulberry is reserved for
  people in the record — carers, next of kin, relationships — and never for system state;
  oat replaces grey everywhere.
- The palette deliberately sits between NHS blue and social-care green. Because the brand
  occupies the green channel, "low risk" is neutral rather than green.

## What success looks like

The same build has to satisfy four audiences the user named together: a sales demo to care
providers, an investor pitch, a portfolio piece, and an assessor using it for eight hours.
That rules out a design that performs at the expense of the task, and equally rules out one
so self-effacing there is nothing to show.

The brief, in the user's words: innovative, clean, impressive, and it should read as the care
industry.
