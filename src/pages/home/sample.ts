import type { RiskLevel } from '../../components/ui';

/* ──────────────────────────────────────────────────────────────────────────
   The home page's one sample record.

   Every person, number and answer here is fictional, and the page says so
   wherever it shows them. The identifiers are chosen so they cannot belong to
   anyone:

     · the NHS number sits in the 999 range NHS England reserves for test data,
       and still passes the product's own Mod 11 check;
     · the phone numbers are from Ofcom's 07700 900xxx range, set aside for
       drama and fiction.

   Everything the page derives (the evidence, the plan's risks, the emergency
   pack) is computed from this record by the same functions the workspace
   uses, so the demonstration cannot drift from the product.
   ────────────────────────────────────────────────────────────────────────── */

export const PERSON = {
  name: 'Edith Marlow',
  initials: 'EM',
  age: 84,
  nhs: '999 000 7918',
} as const;

export const personalDetails = {
  full_name: PERSON.name,
  date_of_birth: '1942-03-14',
  nhs_number: '9990007918',
  gp_name: 'Dr Anil Shah',
  gp_contact: '07700 900275',
  emergency_contact_name: 'Claire Marlow',
  emergency_contact_number: '07700 900412',
  relationship_to_service_user: 'Daughter',
};

export const healthWellbeing = {
  primary_diagnosis: "Parkinson's disease",
  other_health_conditions: 'Type 2 diabetes; osteoarthritis in both knees',
  allergies: 'Penicillin (rash)',
  medication: 'Co-careldopa four times a day; metformin',
  cognition: 'Mild memory difficulty; no dementia diagnosis',
};

export const dailyLiving = {
  mobility: 'aided',
  mobility_notes: 'Walking frame indoors, wheelchair outdoors',
  transfers: 'One carer to stand from the chair',
  eating_drinking: 'Soft diet',
  eating_drinking_notes: 'Thickened fluids since the January SALT review',
  personal_care: 'partial_support',
  personal_care_notes: 'Help with washing and buttons',
  communication_mode: 'verbal',
  communication_notes: 'Speaks quietly; face her and allow time',
};

export const signatures = {
  assessor_name: 'Joanne Price',
  individual_representative_name: PERSON.name,
};

/* ── The risks the visitor can change ──────────────────────────────────────
   Kept apart from the rest of the record because they are the live part of
   the page: the answers start here and the visitor may flip any of them. */

export type RiskKey =
  | 'risk_of_falls'
  | 'choking_risk'
  | 'pressure_sores_skin'
  | 'self_neglect'
  | 'safeguarding_concerns'
  | 'personal_evacuation_plan';

export type Answer = 'yes' | 'no';
export type RiskAnswers = Record<RiskKey, Answer>;

export interface RiskQuestion {
  key: RiskKey;
  label: string;
  /** The note an assessor wrote, shown only while the answer is "yes". */
  note: string;
  /** What the plan does about it, used by the Risks & Safeguarding area. */
  action: string;
}

export const RISK_QUESTIONS: readonly RiskQuestion[] = [
  {
    key: 'risk_of_falls',
    label: 'Risk of falls',
    note: 'Two falls since March, both at night',
    action: 'Night check at 02:00 and a sensor mat beside the bed.',
  },
  {
    key: 'choking_risk',
    label: 'Choking risk',
    note: 'Coughs on thin drinks',
    action: 'Thickened fluids, and carers trained in choking first aid.',
  },
  {
    key: 'pressure_sores_skin',
    label: 'Pressure sores / skin',
    note: 'Redness on the left heel',
    action: 'Heels checked at every call; pressure cushion on her chair.',
  },
  {
    key: 'self_neglect',
    label: 'Self-neglect',
    note: 'Meals left uneaten this month',
    action: 'A welfare check each day and an agreed routine for meals.',
  },
  {
    key: 'safeguarding_concerns',
    label: 'Safeguarding concerns',
    note: 'Unexplained bruising on the forearm',
    action: 'Raised with the local authority safeguarding team the same day.',
  },
  {
    key: 'personal_evacuation_plan',
    label: 'Personal evacuation plan',
    note: 'Frame kept by the back door',
    action: 'PEEP kept by the back door, frame always within reach.',
  },
];

export const INITIAL_RISKS: RiskAnswers = {
  risk_of_falls: 'yes',
  choking_risk: 'no',
  pressure_sores_skin: 'yes',
  self_neglect: 'no',
  safeguarding_concerns: 'no',
  personal_evacuation_plan: 'yes',
};

/** The section's free-text answers: recorded at the visit, raising no risk of their own. */
export const RISK_NOTES = [
  { key: 'medication_risk_assessment', label: 'Medication risk assessment', value: 'Carers give the evening dose; prompts in the morning' },
  { key: 'mental_capacity_dols', label: 'Mental capacity / DoLS', value: 'Has capacity; no DoLS' },
] as const;

/** The Risks & Safeguarding section as the product stores it. */
export function risksSection(answers: RiskAnswers): Record<string, string> {
  const out: Record<string, string> = Object.fromEntries(RISK_NOTES.map((n) => [n.key, n.value]));
  for (const q of RISK_QUESTIONS) {
    out[q.key] = answers[q.key];
    if (answers[q.key] === 'yes') out[`${q.key}_notes`] = q.note;
  }
  return out;
}

/* ── The three readers ─────────────────────────────────────────────────────
   One condensed sheet read three times. Each finding, plan line and check is
   pinned to the row that produced it, so the stage can reveal it as the
   reading line passes that row. */

export interface ReadRow {
  section: string;
  label: string;
  value: string;
}

export const READ_ROWS: readonly ReadRow[] = [
  { section: 'Risks & Safeguarding', label: 'Risk of falls', value: 'Yes — two falls since March, both at night' },
  { section: 'Daily Living', label: 'Sleep pattern', value: 'Disturbed — wakes twice to use the toilet' },
  { section: 'Risks & Safeguarding', label: 'Pressure sores / skin', value: 'Yes — redness on the left heel' },
  { section: 'Health & Wellbeing', label: 'Medication', value: 'Co-careldopa four times a day' },
  { section: 'Daily Living', label: 'Mobility', value: 'Aided — frame indoors, wheelchair outdoors' },
  { section: 'Advance Preferences', label: 'Advance care plan wishes', value: 'To stay at home if her health worsens' },
];

export interface ReaderOutput {
  /** Index into READ_ROWS of the row that produced this line. */
  row: number;
  text: string;
}

export interface Reader {
  id: 'analyser' | 'planner' | 'reviewer';
  name: string;
  job: string;
  outputTitle: string;
  outputs: readonly ReaderOutput[];
}

export const READERS: readonly Reader[] = [
  {
    id: 'analyser',
    name: 'Assessment Analyser',
    job: 'Reads every section and names the needs and risks it finds, against the answers that raised them.',
    outputTitle: 'Findings',
    outputs: [
      { row: 0, text: 'Falls at night are the leading risk.' },
      { row: 1, text: 'Night waking explains when she falls.' },
      { row: 2, text: 'Skin on the left heel needs watching.' },
      { row: 3, text: "Parkinson's doses are time-critical." },
      { row: 5, text: 'She wants to stay at home.' },
    ],
  },
  {
    id: 'planner',
    name: 'Care Plan Specialist',
    job: 'Turns each finding into a plan: the need, the outcome to aim for, how to reach it, and the level of support.',
    outputTitle: 'Risks & Safeguarding plan',
    outputs: [
      { row: 0, text: 'Need: falls at night, linked to waking.' },
      { row: 1, text: 'Outcome: no falls at night for three months.' },
      { row: 2, text: 'How: 02:00 check, sensor mat, commode by the bed.' },
      { row: 4, text: 'How: frame within reach of the bed.' },
      { row: 5, text: 'Level of need: High.' },
    ],
  },
  {
    id: 'reviewer',
    name: 'Quality Assurance Reviewer',
    job: 'Checks the whole draft against set criteria and approves it only when every one is met.',
    outputTitle: 'Review',
    outputs: [
      { row: 0, text: 'Complete' },
      { row: 1, text: 'Safe' },
      { row: 2, text: 'Practical' },
      { row: 3, text: 'Personal to Edith' },
      { row: 4, text: 'Evidence-based' },
      { row: 5, text: 'Measurable' },
    ],
  },
];

/* ── The care plan, as the planner writes it ───────────────────────────────
   The areas in the shape the backend validates. Risks & Safeguarding is not
   here: it is written from the visitor's answers, in PlanAreas' `riskArea`. */

export interface PlanArea {
  id: string;
  title: string;
  need: string;
  outcomes: string;
  how: string;
  level: 'High' | 'Medium' | 'Low';
}

export const PLAN_AREAS: readonly PlanArea[] = [
  {
    id: 'health',
    title: 'Health & Wellbeing',
    need: "Parkinson's medication has to be given on time, four times a day.",
    outcomes: 'Every dose given within 30 minutes of its time.',
    how: 'Carers prompt and record each dose; the GP reviews her medication in March.',
    level: 'Medium',
  },
  {
    id: 'daily',
    title: 'Daily Living',
    need: 'Help to wash, dress and stand from her chair.',
    outcomes: 'Edith washes and dresses each morning with one carer.',
    how: 'A 45-minute call at 08:00, and a perching stool in the bathroom.',
    level: 'Medium',
  },
  {
    id: 'social',
    title: 'Social & Emotional Wellbeing',
    need: 'Lonely in the afternoons since her husband died.',
    outcomes: 'Company on at least three afternoons a week.',
    how: 'Claire visits on Tuesdays; a befriending visit on Thursdays.',
    level: 'Low',
  },
  {
    id: 'environment',
    title: 'Environment & Lifestyle',
    need: 'Lives alone, with a step at the back door.',
    outcomes: 'She can get in and out of the house safely.',
    how: 'A grab rail at the back step, and a key safe for carers.',
    level: 'Low',
  },
  {
    id: 'advance',
    title: 'Advance Preferences',
    need: 'A DNACPR is in place and she wishes to stay at home.',
    outcomes: 'Everyone who cares for her knows her wishes.',
    how: 'A DNACPR copy in the kitchen drawer and in her emergency pack.',
    level: 'Medium',
  },
  {
    id: 'optional',
    title: 'Optional Areas',
    need: 'Her daughter manages the bills, as Edith has agreed.',
    outcomes: 'Her money is handled the way she has asked.',
    how: 'Claire holds lasting power of attorney for finance.',
    level: 'Low',
  },
];

/** How a recorded risk level becomes the plan's level of need. */
export function levelOfNeed(overall: RiskLevel): PlanArea['level'] {
  if (overall === 'critical' || overall === 'high') return 'High';
  if (overall === 'medium') return 'Medium';
  return 'Low';
}
