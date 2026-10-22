import { supabase } from './supabase';
import { SECTION_TABLES } from './assessmentSections';
import { deriveEvidence, type RiskEntry } from './evidence';
import type { RiskLevel } from '../components/ui';

/* ──────────────────────────────────────────────────────────────────────────
   What the service users list knows about each person, beyond their name.

   Read-only, and derived from tables the assessment already writes: there is
   no status column on `assessments`, so progress is which section tables hold
   a row for the person, risk is their Risks & Safeguarding row scored by the
   same rules the evidence column uses, and "care plan ready" is a generated
   plan on record. Nothing here writes, and nothing here is load-bearing: the
   list renders without it if any of these reads fail.
   ────────────────────────────────────────────────────────────────────────── */

/** The ten sections, as the service users list counts them. Personal details is the
    service user row itself, so it is present by definition. */
export const SECTION_COUNT = 10;

const PROGRESS_TABLES = [
  SECTION_TABLES.basicDetails,
  SECTION_TABLES.healthWellbeing,
  SECTION_TABLES.dailyLiving,
  SECTION_TABLES.risksSafeguarding,
  SECTION_TABLES.socialEmotional,
  SECTION_TABLES.environmentLifestyle,
  SECTION_TABLES.advancePreferences,
  SECTION_TABLES.optionalAreas,
  SECTION_TABLES.signatures,
] as const;

/** Named columns only: the table also carries an embedding vector per row. */
const RISK_COLUMNS = [
  'assessment_id',
  'safeguarding_concerns',
  'safeguarding_concerns_notes',
  'choking_risk',
  'choking_risk_notes',
  'risk_of_falls',
  'risk_of_falls_notes',
  'pressure_sores_skin',
  'pressure_sores_skin_notes',
  'self_neglect',
  'self_neglect_notes',
  'personal_evacuation_plan',
  'personal_evacuation_plan_notes',
].join(', ');

/** A provider supports tens of people, not thousands; this only bounds a surprise. */
const OVERVIEW_LIMIT = 1000;

/** How many flagged people the attention panel leads with. */
const ATTENTION_LIMIT = 4;

const SEVERITY: Record<RiskLevel, number> = { low: 0, medium: 1, high: 2, critical: 3 };

export interface RiskSignal {
  level: RiskLevel;
  /** Flagged risks, most severe first. */
  risks: RiskEntry[];
}

export interface AttentionEntry {
  id: string;
  full_name: string | null;
  nhs_number: string | null;
  date_of_birth: string | null;
  signal: RiskSignal;
  hasCarePlan: boolean;
}

export interface ServiceUsersOverview {
  /** Every service user, regardless of any search. */
  total: number;
  /** Assessment ids with a generated care plan on record. */
  carePlanIds: Set<string>;
  /** Flagged risk per assessment id. Absent means nothing is flagged. */
  risks: Map<string, RiskSignal>;
  /** Count of flagged people at each severity. */
  severityCounts: Record<Exclude<RiskLevel, 'low'>, number>;
  /** The most severely flagged people, named. */
  attention: AttentionEntry[];
}

function scoreRisk(row: Record<string, unknown>): RiskSignal | null {
  const { risks, overall } = deriveEvidence({ risksSafeguarding: row });
  if (risks.length === 0) return null;
  return {
    level: overall,
    risks: [...risks].sort((a, b) => SEVERITY[b.level] - SEVERITY[a.level]),
  };
}

export async function fetchServiceUsersOverview(): Promise<ServiceUsersOverview> {
  const [people, plans, riskRows] = await Promise.all([
    supabase.from('service_users').select('id', { count: 'exact', head: true }),
    supabase.from('health_care_plan').select('assessment_id').limit(OVERVIEW_LIMIT),
    supabase.from('risks_safeguarding').select(RISK_COLUMNS).limit(OVERVIEW_LIMIT),
  ]);

  if (people.error) throw people.error;
  if (plans.error) throw plans.error;
  if (riskRows.error) throw riskRows.error;

  const carePlanIds = new Set(
    ((plans.data ?? []) as Array<{ assessment_id: string | null }>)
      .map((r) => r.assessment_id)
      .filter((id): id is string => Boolean(id)),
  );

  const risks = new Map<string, RiskSignal>();
  for (const row of (riskRows.data ?? []) as unknown as Array<Record<string, unknown>>) {
    const id = row.assessment_id;
    if (typeof id !== 'string') continue;
    const signal = scoreRisk(row);
    if (signal) risks.set(id, signal);
  }

  const severityCounts = { medium: 0, high: 0, critical: 0 };
  risks.forEach(({ level }) => {
    if (level !== 'low') severityCounts[level] += 1;
  });

  const leading = [...risks.entries()]
    .sort(
      ([, a], [, b]) =>
        SEVERITY[b.level] - SEVERITY[a.level] || b.risks.length - a.risks.length,
    )
    .slice(0, ATTENTION_LIMIT);

  let attention: AttentionEntry[] = [];
  if (leading.length > 0) {
    const { data, error } = await supabase
      .from('service_users')
      .select('id, full_name, nhs_number, date_of_birth')
      .in(
        'id',
        leading.map(([id]) => id),
      );
    if (error) throw error;

    const byId = new Map(
      ((data ?? []) as Array<Omit<AttentionEntry, 'signal' | 'hasCarePlan'>>).map((p) => [p.id, p]),
    );
    attention = leading.flatMap(([id, signal]) => {
      const person = byId.get(id);
      // A risk row whose person has gone is not someone to attend to.
      return person ? [{ ...person, signal, hasCarePlan: carePlanIds.has(id) }] : [];
    });
  }

  return {
    total: people.count ?? 0,
    carePlanIds,
    risks,
    severityCounts,
    attention,
  };
}

/* Coming back to the service users list within a short window reuses the last read
   rather than repeating six queries; a failed read is never reused. */
const OVERVIEW_TTL_MS = 30_000;
let cachedOverview: { at: number; promise: Promise<ServiceUsersOverview> } | null = null;

export function getServiceUsersOverview(): Promise<ServiceUsersOverview> {
  if (cachedOverview && Date.now() - cachedOverview.at < OVERVIEW_TTL_MS) {
    return cachedOverview.promise;
  }
  const promise = fetchServiceUsersOverview();
  cachedOverview = { at: Date.now(), promise };
  // A failed read is not worth remembering; the next caller tries again.
  promise.catch(() => {
    if (cachedOverview?.promise === promise) cachedOverview = null;
  });
  return promise;
}

/**
 * Sections saved per person, for the people on screen.
 *
 * One narrow read per section table, scoped to the visible ids. All or
 * nothing: a table that cannot be read would undercount everyone, and a
 * progress strip that is quietly wrong is worse than none.
 */
export async function fetchSectionProgress(ids: string[]): Promise<Map<string, number>> {
  const progress = new Map<string, number>(ids.map((id) => [id, 1]));
  if (ids.length === 0) return progress;

  const results = await Promise.all(
    PROGRESS_TABLES.map((table) =>
      supabase.from(table).select('assessment_id').in('assessment_id', ids),
    ),
  );

  for (const { data, error } of results) {
    if (error) throw error;
    const present = new Set(
      ((data ?? []) as Array<{ assessment_id: string | null }>).map((r) => r.assessment_id),
    );
    present.forEach((id) => {
      if (id && progress.has(id)) progress.set(id, (progress.get(id) ?? 1) + 1);
    });
  }

  return progress;
}
