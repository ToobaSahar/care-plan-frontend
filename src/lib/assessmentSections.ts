import { supabase } from './supabase';

/* ──────────────────────────────────────────────────────────────────────────
   Reading a saved assessment back.

   Each section is persisted to its own table — personal details onto the
   service user itself, every other section keyed by `assessment_id`. Loading
   is the mirror of that write, so the two live side by side here and share
   one table map; when they were written separately, the save worked and the
   load silently returned nothing.
   ────────────────────────────────────────────────────────────────────────── */

/** The one place the section→table mapping is declared. */
export const SECTION_TABLES = {
  personalDetails: 'service_users',
  basicDetails: 'basic_details',
  healthWellbeing: 'health_wellbeing',
  dailyLiving: 'daily_living',
  risksSafeguarding: 'risks_safeguarding',
  socialEmotional: 'social_emotional',
  environmentLifestyle: 'environment_lifestyle',
  advancePreferences: 'advance_preferences',
  optionalAreas: 'optional_areas',
  signatures: 'signatures',
  optionalAttachments: 'optional_attachments',
} as const;

export type SectionName = keyof typeof SECTION_TABLES;

/**
 * Columns that belong to the row rather than to the form. Stripping them
 * keeps bookkeeping out of the editable payload, where it would be written
 * straight back on the next save.
 */
const META_COLUMNS = new Set([
  'id',
  'assessment_id',
  'service_user_id',
  'created_at',
  'updated_at',
  'created_by',
  'summary_embedding',
]);

type SectionData = Record<string, unknown>;

/**
 * Null and undefined are dropped rather than carried through: the store seeds
 * each field with an empty string, and writing null over that makes React
 * switch the input from controlled to uncontrolled mid-edit.
 */
function toFormData(row: Record<string, unknown> | null): SectionData {
  if (!row) return {};

  const out: SectionData = {};
  for (const [key, value] of Object.entries(row)) {
    if (META_COLUMNS.has(key)) continue;
    if (value === null || value === undefined) continue;
    out[key] = value;
  }
  return out;
}

/** One section of an assessment, as form data. Empty when unsaved or unreadable. */
export async function fetchSection(section: SectionName, assessmentId: string): Promise<SectionData> {
  const table = SECTION_TABLES[section];

  // Personal details live on the service user, which shares the assessment id.
  const column = section === 'personalDetails' ? 'id' : 'assessment_id';

  try {
    const { data, error } = await supabase
      .from(table)
      .select('*')
      .eq(column, assessmentId)
      .maybeSingle();

    if (error) {
      // One missing or unreadable section must not blank the other ten.
      console.warn(`Could not load "${section}" from ${table}:`, error.message);
      return {};
    }

    return toFormData(data as Record<string, unknown> | null);
  } catch (error) {
    console.warn(`Unexpected error loading "${section}":`, error);
    return {};
  }
}

/**
 * Loads every section of an assessment in parallel.
 *
 * Returns a complete object with an entry per section, so callers can merge it
 * over their defaults without checking for absent keys.
 */
export async function fetchAssessmentSections(
  assessmentId: string,
): Promise<Record<SectionName, SectionData>> {
  const sections = Object.keys(SECTION_TABLES) as SectionName[];

  const results = await Promise.all(
    sections.map(async (section) => [section, await fetchSection(section, assessmentId)] as const),
  );

  return Object.fromEntries(results) as Record<SectionName, SectionData>;
}
