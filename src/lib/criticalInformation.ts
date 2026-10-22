import { deriveEvidence } from './evidence';
import { formatPhone } from './format';

/* ──────────────────────────────────────────────────────────────────────────
   Critical and Emergency Information, as the Emergency Admission Pack prints
   them.

   Each entry resolves from the assessment section that records it, and says
   which of four things is true, because a clinician reading the pack acts on
   each of them differently:

     · the section holds an answer          → the answer itself
     · the section has not been saved yet   → "Assessment Not Yet Completed"
     · the section is saved, field is blank → "None recorded"
     · the assessment asks no such question → "Not covered by this assessment"

   Pure and side-effect free, like `evidence.ts`, whose risk scoring it reuses
   so the pack and the service users list cannot disagree about what is high
   risk.
   ────────────────────────────────────────────────────────────────────────── */

type Section = Record<string, unknown>;

/** One entry on the pack. */
export interface PackEntry {
  /** One fact per line. */
  text: string;
  /** True when `text` describes the state of the record rather than the person. */
  placeholder: boolean;
}

/** The assessment sections the pack reads, each keyed as `assessmentSections.ts` loads them. */
export interface PackSections {
  healthWellbeing: Section;
  dailyLiving: Section;
  risksSafeguarding: Section;
}

export interface PackSource extends Partial<PackSections> {
  /** The service user row, which carries the personal details section. */
  personal?: Section | null;
}

export interface CriticalInformation {
  critical: {
    abilities: PackEntry;
    allergies: PackEntry;
    diet: PackEntry;
    highRisk: PackEntry;
    intolerance: PackEntry;
    medicalConditions: PackEntry;
  };
  emergency: {
    callAmbulance: PackEntry;
    emergencySituation: PackEntry;
    rescueMedication: PackEntry;
    emergencyContacts: PackEntry;
    evacuationPlan: PackEntry;
    evacuationEquipment: PackEntry;
  };
}

const PENDING: PackEntry = { text: 'Assessment Not Yet Completed', placeholder: true };
const NONE_RECORDED: PackEntry = { text: 'None recorded', placeholder: true };
const NOT_COVERED: PackEntry = { text: 'Not covered by this assessment', placeholder: true };
const NO_HIGH_RISK: PackEntry = { text: 'None', placeholder: false };

/** Labels for the stored option values, as the section forms show them. */
const OPTION_LABELS: Record<string, string> = {
  yes: 'Yes',
  no: 'No',
  independent: 'Independent',
  aided: 'Aided',
  hoist: 'Hoist',
  partial_support: 'Partial Support',
  full_support: 'Full Support',
  verbal: 'Verbal',
  non_verbal: 'Non-verbal',
  hearing_aids: 'Hearing aids',
};

/** Same test as `sectionCompletion`: a section counts once it holds any answer. */
function isRecorded(section: Section | null | undefined): section is Section {
  if (!section) return false;
  return Object.values(section).some(
    (v) => (typeof v === 'string' && v.trim() !== '') || typeof v === 'boolean' || typeof v === 'number',
  );
}

/** A field's answer as display text, with stored option values given their form label. */
function field(section: Section | null | undefined, key: string): string {
  const value = section?.[key];
  if (typeof value !== 'string') return '';
  const trimmed = value.trim();
  return OPTION_LABELS[trimmed] ?? trimmed;
}

/** "Aided — walking frame indoors": an answer with its note, or whichever of the two exists. */
function withNote(value: string, note: string): string {
  return value && note ? `${value} — ${note}` : value || note;
}

/** A form area: its answer and the `_notes` field beside it. */
function area(section: Section | null | undefined, key: string): string {
  return withNote(field(section, key), field(section, `${key}_notes`));
}

function labelled(label: string, value: string): string {
  return value ? `${label}: ${value}` : '';
}

/** "Jane Smith (Daughter) — 07814 334901". */
function contact(name: string, relationship: string, number: string): string {
  const who = relationship ? `${name} (${relationship})`.trim() : name;
  return withNote(who, number);
}

/** The entry for facts read from one section. */
function resolve(section: Section | null | undefined, lines: string[]): PackEntry {
  if (!isRecorded(section)) return PENDING;
  const present = lines.filter(Boolean);
  return present.length ? { text: present.join('\n'), placeholder: false } : NONE_RECORDED;
}

function highRisks(risks: Section | undefined): PackEntry {
  if (!isRecorded(risks)) return PENDING;
  // Already ordered most severe first.
  const flagged = deriveEvidence({ risksSafeguarding: risks })
    .risks.filter((r) => r.level === 'high' || r.level === 'critical')
    .map((r) => withNote(r.label, r.note ?? ''));
  return flagged.length ? { text: flagged.join('\n'), placeholder: false } : NO_HIGH_RISK;
}

export function deriveCriticalInformation({
  personal,
  healthWellbeing: health,
  dailyLiving: daily,
  risksSafeguarding: risks,
}: PackSource): CriticalInformation {
  return {
    critical: {
      abilities: resolve(daily, [
        labelled('Mobility', area(daily, 'mobility')),
        labelled('Transfers', area(daily, 'transfers')),
        labelled('Personal care', area(daily, 'personal_care')),
        labelled('Communication', withNote(field(daily, 'communication_mode'), field(daily, 'communication_notes'))),
      ]),
      allergies: resolve(health, [field(health, 'allergies')]),
      diet: resolve(daily, [area(daily, 'eating_drinking')]),
      highRisk: highRisks(risks),
      intolerance: NOT_COVERED,
      medicalConditions: resolve(health, [
        labelled('Primary diagnosis', field(health, 'primary_diagnosis')),
        labelled('Other conditions', field(health, 'other_health_conditions')),
      ]),
    },
    emergency: {
      callAmbulance: NOT_COVERED,
      emergencySituation: NOT_COVERED,
      rescueMedication: NOT_COVERED,
      emergencyContacts: resolve(personal, [
        contact(
          field(personal, 'emergency_contact_name'),
          field(personal, 'relationship_to_service_user'),
          formatPhone(personal?.emergency_contact_number, ''),
        ),
        labelled('GP', withNote(field(personal, 'gp_name'), field(personal, 'gp_contact'))),
      ]),
      evacuationPlan: resolve(risks, [
        labelled('Risk present', field(risks, 'personal_evacuation_plan')),
        field(risks, 'personal_evacuation_plan_notes'),
      ]),
      evacuationEquipment: NOT_COVERED,
    },
  };
}
