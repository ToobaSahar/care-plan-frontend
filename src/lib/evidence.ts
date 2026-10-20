import type { RiskLevel } from '../components/ui';

/* ──────────────────────────────────────────────────────────────────────────
   Evidence derivation.

   The workspace's thesis is that nothing is asserted without the thing that
   evidences it. This module is where that becomes real: given the assessment's
   own form data, it resolves what the record currently raises — risks, people,
   attachments — and which field produced each one.

   Pure and side-effect free, so it stays cheap to call on every render and
   straightforward to test.
   ────────────────────────────────────────────────────────────────────────── */

export interface RiskEntry {
  id: string;
  label: string;
  level: RiskLevel;
  /** The human-readable field this came from. Shown beside the entry. */
  source: string;
  /** Section number that owns the field, for "raised in" wayfinding. */
  sectionIndex: number;
  note?: string;
}

export interface PersonEntry {
  id: string;
  name: string;
  role: string;
  sectionIndex: number;
}

export interface AttachmentEntry {
  id: string;
  label: string;
}

export interface Evidence {
  risks: RiskEntry[];
  people: PersonEntry[];
  attachments: AttachmentEntry[];
  /** Highest risk present anywhere in the record, for the person header. */
  overall: RiskLevel;
}

export const SECTION_TITLES = [
  'Personal Details',
  'Basic Details',
  'Health & Wellbeing',
  'Daily Living',
  'Risks & Safeguarding',
  'Social & Emotional Wellbeing',
  'Environment & Lifestyle',
  'Advance Preferences',
  'Optional Areas',
  'Signatures',
] as const;

/** Risk fields, in the order they should be read, with the weight each carries. */
const RISK_FIELDS: Array<{ key: string; label: string; level: RiskLevel }> = [
  { key: 'safeguarding_concerns', label: 'Safeguarding concern', level: 'critical' },
  { key: 'choking_risk', label: 'Choking', level: 'high' },
  { key: 'risk_of_falls', label: 'Falls', level: 'high' },
  { key: 'pressure_sores_skin', label: 'Pressure sores / skin', level: 'high' },
  { key: 'self_neglect', label: 'Self-neglect', level: 'high' },
  { key: 'personal_evacuation_plan', label: 'Evacuation plan', level: 'medium' },
];

const ATTACHMENT_LABELS: Record<string, string> = {
  risk_assessments: 'Risk assessments',
  dnacpr: 'DNACPR',
  respect_form: 'ReSPECT form',
  medication_list: 'Medication list',
  poa_documentation: 'Power of attorney documentation',
  peep_evacuation_plan: 'PEEP / evacuation plan',
  communication_passport: 'Communication passport',
};

const RISK_ORDER: RiskLevel[] = ['low', 'medium', 'high', 'critical'];

function highest(levels: RiskLevel[]): RiskLevel {
  return levels.reduce<RiskLevel>(
    (acc, l) => (RISK_ORDER.indexOf(l) > RISK_ORDER.indexOf(acc) ? l : acc),
    'low',
  );
}

function text(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

/** Treats the tri-state booleans the schema uses (`undefined | true | false`). */
function isYes(value: unknown): boolean {
  return value === true || value === 'yes' || value === 'Yes';
}

/** An explicit negative. Distinct from "not answered yet". */
function isNo(value: unknown): boolean {
  return value === false || value === 'no' || value === 'No';
}

export function deriveEvidence(formData: any): Evidence {
  const risksData = formData?.risksSafeguarding ?? {};
  const personal = formData?.personalDetails ?? {};
  const advance = formData?.advancePreferences ?? {};
  const signatures = formData?.signatures ?? {};
  const attachmentsData = formData?.optionalAttachments ?? {};

  const risks: RiskEntry[] = [];
  for (const field of RISK_FIELDS) {
    const answer = risksData[field.key];
    const note = text(risksData[`${field.key}_notes`]);

    // An explicit "no" is a cleared risk, whatever its note says. Assessors
    // routinely record why something is not a concern ("heels checked daily"),
    // and surfacing that as a flag is a false alarm that also inflates the
    // record's overall risk.
    if (isNo(answer)) continue;

    const flagged = isYes(answer);
    if (!flagged && !note) continue;

    risks.push({
      id: field.key,
      label: field.label,
      // A note with the question still unanswered is a concern someone wrote
      // down but did not confirm — real, but not yet the field's full weight.
      level: flagged ? field.level : 'medium',
      source: field.label,
      sectionIndex: 5,
      note: note || undefined,
    });
  }

  const people: PersonEntry[] = [];
  const pushPerson = (name: string, role: string, sectionIndex: number, id: string) => {
    const n = text(name);
    if (n) people.push({ id, name: n, role, sectionIndex });
  };

  pushPerson(personal.gp_name, 'GP', 1, 'gp');
  pushPerson(
    personal.emergency_contact_name,
    text(personal.relationship_to_service_user) || 'Emergency contact',
    1,
    'emergency',
  );
  pushPerson(advance.power_of_attorney, 'Power of attorney', 8, 'poa');
  pushPerson(signatures.assessor_name, 'Assessor', 10, 'assessor');
  pushPerson(
    signatures.individual_representative_name,
    'Individual representative',
    10,
    'representative',
  );

  const attachments: AttachmentEntry[] = Object.entries(ATTACHMENT_LABELS)
    .filter(([key]) => attachmentsData[key] === true)
    .map(([id, label]) => ({ id, label }));

  return {
    risks,
    people,
    attachments,
    overall: risks.length ? highest(risks.map((r) => r.level)) : 'low',
  };
}

/**
 * Narrows the full evidence set to what belongs beside the section in view.
 *
 * Risks always ride along — they are the layer over the record, and an
 * assessor filling in Daily Living still needs to see that falls are flagged.
 * People and attachments are scoped, because off-section ones are noise.
 */
export function scopeEvidence(evidence: Evidence, sectionIndex: number) {
  const scopedPeople = evidence.people.filter((p) => p.sectionIndex === sectionIndex);
  return {
    risks: evidence.risks,
    people: scopedPeople.length ? scopedPeople : evidence.people,
    peopleAreScoped: scopedPeople.length > 0,
    attachments: evidence.attachments,
  };
}

/** How complete the record is, for the rail's progress and the caseload list. */
export function sectionCompletion(formData: any): boolean[] {
  const keys = [
    'personalDetails',
    'basicDetails',
    'healthWellbeing',
    'dailyLiving',
    'risksSafeguarding',
    'socialEmotional',
    'environmentLifestyle',
    'advancePreferences',
    'optionalAreas',
    'signatures',
  ];

  return keys.map((key) => {
    const section = formData?.[key];
    if (!section || typeof section !== 'object') return false;
    return Object.values(section).some(
      (v) => (typeof v === 'string' && v.trim() !== '') || typeof v === 'boolean' || typeof v === 'number',
    );
  });
}
