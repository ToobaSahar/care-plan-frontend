import React from 'react';
import { ClipboardList, FileText, ShieldCheck } from 'lucide-react';
import { Avatar, Button, Card, RiskBadge, Skeleton } from '../ui';
import type { RiskLevel } from '../ui';
import type { ServiceUsersOverview } from '../../lib/serviceUserSignals';
import type { SignalState } from '../../hooks/useServiceUserSignals';
import { ageFrom, formatNhsNumber } from '../../lib/format';

/* ──────────────────────────────────────────────────────────────────────────
   Service users at a glance, and who among them needs attention first.

   Both read every service user rather than the page on screen, and both are
   written as sentences with their evidence beside them rather than as a row
   of big numbers: an assessor needs to know who, not how many.
   ────────────────────────────────────────────────────────────────────────── */

const LEVELS: Array<Exclude<RiskLevel, 'low'>> = ['critical', 'high', 'medium'];

export const ServiceUsersAtAGlance: React.FC<{ overview: SignalState<ServiceUsersOverview> }> = ({
  overview,
}) => {
  if (overview.status === 'unavailable') return null;

  if (overview.status === 'loading') {
    return (
      <div className="grid gap-5 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]" aria-hidden="true">
        {[0, 1].map((i) => (
          <Card key={i} className="flex flex-col gap-3.5">
            <Skeleton className="h-5 w-64 max-w-full" />
            <Skeleton className="h-2.5 w-full rounded-full" />
            <Skeleton className="h-3.5 w-40" />
          </Card>
        ))}
      </div>
    );
  }

  const { total, carePlanIds, risks, severityCounts } = overview.data;
  const ready = Math.min(carePlanIds.size, total);
  const awaiting = Math.max(0, total - ready);
  const share = total > 0 ? (ready / total) * 100 : 0;
  const flagged = risks.size;

  return (
    <section
      aria-label="Service users at a glance"
      className="grid gap-5 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]"
    >
      <Card>
        <h2 className="text-lg font-semibold text-oat-900">
          <span className="tabular-nums text-teal-800">{ready}</span> of{' '}
          <span className="tabular-nums">{total}</span> have a care plan ready
        </h2>

        <div
          role="img"
          aria-label={`${ready} of ${total} service users have a care plan ready`}
          className="mt-4 flex h-2.5 overflow-hidden rounded-full bg-oat-200"
        >
          <div
            className="h-full rounded-full bg-teal-400 transition-[width] duration-slow ease-out"
            style={{ width: `${share}%` }}
          />
        </div>

        <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-xs text-oat-600">
          <li className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-teal-400" aria-hidden="true" />
            Care plan ready <span className="font-semibold tabular-nums text-oat-900">{ready}</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-oat-300" aria-hidden="true" />
            Awaiting a care plan{' '}
            <span className="font-semibold tabular-nums text-oat-900">{awaiting}</span>
          </li>
        </ul>
      </Card>

      <Card>
        {flagged === 0 ? (
          <div className="flex items-start gap-3">
            <ShieldCheck className="mt-0.5 h-5 w-5 flex-none text-teal-600" aria-hidden="true" />
            <div>
              <h2 className="text-lg font-semibold text-oat-900">No risk flags across service users</h2>
              <p className="mt-1 text-sm text-oat-600">
                Flags appear here as Risks &amp; Safeguarding is recorded.
              </p>
            </div>
          </div>
        ) : (
          <>
            <h2 className="text-lg font-semibold text-oat-900">
              <span className="tabular-nums text-teal-800">{flagged}</span>{' '}
              {flagged === 1 ? 'person has' : 'people have'} risk flags
            </h2>
            <ul className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2.5">
              {LEVELS.filter((level) => severityCounts[level] > 0).map((level) => (
                <li key={level} className="flex items-center gap-2">
                  <RiskBadge level={level} />
                  <span className="text-base font-semibold tabular-nums text-oat-900">
                    {severityCounts[level]}
                  </span>
                </li>
              ))}
            </ul>
          </>
        )}
      </Card>
    </section>
  );
};

export const NeedsAttention: React.FC<{
  overview: SignalState<ServiceUsersOverview>;
  onOpenAssessment: (id: string) => void;
  onOpenCarePlan: (id: string) => void;
}> = ({ overview, onOpenAssessment, onOpenCarePlan }) => {
  if (overview.status !== 'ready' || overview.data.attention.length === 0) return null;

  const { attention, risks } = overview.data;
  const more = risks.size - attention.length;

  return (
    <section aria-labelledby="needs-attention" className="flex flex-col gap-4">
      <div>
        <h2 id="needs-attention" className="text-lg font-semibold text-oat-900">
          Needs attention
        </h2>
        <p className="mt-0.5 text-sm text-oat-600">
          The most serious risk flags across all service users, with what raised them.
        </p>
      </div>

      <Card flush className="overflow-hidden">
        <ul className="grid gap-px bg-oat-200 md:grid-cols-2">
          {attention.map((person) => {
            const [lead, ...others] = person.signal.risks;
            const age = ageFrom(person.date_of_birth);
            const meta = [
              person.nhs_number && `NHS ${formatNhsNumber(person.nhs_number)}`,
              age !== null && `Age ${age}`,
            ].filter(Boolean);

            return (
              <li key={person.id} className="cf-arrive flex flex-col bg-white p-5">
                <div className="flex items-start gap-3">
                  <Avatar name={person.full_name ?? undefined} size="md" />
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-base font-semibold text-oat-900">
                      {person.full_name || 'Unnamed service user'}
                    </h3>
                    {meta.length > 0 && (
                      <p className="text-xs text-oat-500">{meta.join(' · ')}</p>
                    )}
                  </div>
                  <RiskBadge level={person.signal.level} className="flex-none" />
                </div>

                <div className="mt-3.5 rounded-lg bg-oat-100 px-3.5 py-3">
                  <p className="text-sm font-semibold text-oat-900">{lead.label}</p>
                  {lead.note && (
                    <p className="mt-0.5 line-clamp-2 text-sm leading-5 text-oat-700">
                      {lead.note}
                    </p>
                  )}
                  {others.length > 0 && (
                    <p className="mt-1.5 text-xs text-oat-500">
                      Also flagged: {others.map((r) => r.label).join(', ')}
                    </p>
                  )}
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={<ClipboardList />}
                    onClick={() => onOpenAssessment(person.id)}
                    className="-ml-2"
                  >
                    Assessment
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    icon={<FileText />}
                    onClick={() => onOpenCarePlan(person.id)}
                  >
                    Care plan
                  </Button>
                  {!person.hasCarePlan && (
                    <span className="ml-auto text-xs text-oat-500">No care plan yet</span>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </Card>

      {more > 0 && (
        <p className="text-xs text-oat-600">
          {more} more {more === 1 ? 'person is' : 'people are'} flagged across all service users.
        </p>
      )}
    </section>
  );
};
