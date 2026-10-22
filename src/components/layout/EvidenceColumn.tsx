import React from 'react';
import { CornerDownRight, MessageSquare, Paperclip, ShieldAlert, Users } from 'lucide-react';
import { Avatar, Badge, Button, RiskBadge } from '../ui';
import { SECTION_TITLES, scopeEvidence, type Evidence } from '../../lib/evidence';
import { cn } from '../../lib/cn';

export interface EvidenceColumnProps {
  evidence: Evidence;
  /** 1-indexed section currently in view. Scopes what is shown. */
  sectionIndex: number;
  onOpenSection: (sectionNumber: number) => void;
  onOpenAssistant: () => void;
  /** Follows the fields as a panel, below the width where it can sit beside them. */
  inline?: boolean;
  className?: string;
}

const Heading: React.FC<{ icon: React.ReactNode; count?: number; children: React.ReactNode }> = ({
  icon,
  count,
  children,
}) => (
  <h2 className="flex items-center gap-2 text-2xs font-semibold uppercase text-oat-600">
    <span className="text-teal-600 [&>svg]:h-3.5 [&>svg]:w-3.5" aria-hidden="true">
      {icon}
    </span>
    {children}
    {count !== undefined && count > 0 && (
      <span className="ml-auto rounded-full bg-white px-1.5 text-2xs font-semibold tabular-nums tracking-normal text-oat-600 ring-1 ring-oat-200">
        {count}
      </span>
    )}
  </h2>
);

const Empty: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <p className="rounded-lg border border-dashed border-oat-300 px-3.5 py-3 text-xs leading-5 text-oat-600">
    {children}
  </p>
);

/**
 * What the record currently evidences, beside the section that produced it.
 *
 * Risks always ride along — they are a layer over the whole record, and an
 * assessor working in Daily Living still needs to see that falls are flagged.
 * People and attachments narrow to the section in view, and each entry names
 * the field it came from so nothing appears without a provenance.
 */
export const EvidenceColumn: React.FC<EvidenceColumnProps> = ({
  evidence,
  sectionIndex,
  onOpenSection,
  onOpenAssistant,
  inline = false,
  className,
}) => {
  const scoped = scopeEvidence(evidence, sectionIndex);

  return (
    <aside
      aria-label="Evidence for this section"
      className={cn(
        'flex flex-col gap-6 bg-oat-100 px-5 py-6',
        inline ? 'rounded-xl border border-oat-200' : 'h-full overflow-y-auto border-l border-oat-200',
        className,
      )}
    >
      <p className="text-2xs font-semibold uppercase tracking-wide text-oat-500">
        Evidence · {SECTION_TITLES[sectionIndex - 1] ?? 'Assessment'}
      </p>

      {/* Risk — the layer riding over the record, in its own reserved ink. */}
      <section className="flex flex-col gap-2.5">
        <Heading icon={<ShieldAlert />} count={scoped.risks.length}>
          Raised by this record
        </Heading>
        {scoped.risks.length === 0 ? (
          <Empty>
            No risks flagged yet. They appear here as Risks &amp; Safeguarding is filled in.
          </Empty>
        ) : (
          <ul className="flex flex-col gap-2">
            {scoped.risks.map((risk) => (
              <li key={risk.id}>
                <article className="cf-arrive rounded-lg border border-oat-200 bg-white p-3.5 shadow-xs">
                  <RiskBadge level={risk.level} prefix={risk.label} />
                  {risk.note && (
                    <p className="mt-2.5 text-xs leading-5 text-oat-700">{risk.note}</p>
                  )}
                  <button
                    type="button"
                    onClick={() => onOpenSection(risk.sectionIndex)}
                    className="mt-2.5 inline-flex items-center gap-1 text-2xs font-medium text-teal-700 underline underline-offset-2 hover:text-teal-800"
                  >
                    <CornerDownRight className="h-3 w-3" aria-hidden="true" />
                    Raised in {SECTION_TITLES[risk.sectionIndex - 1]}
                  </button>
                </article>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* People — the one place mulberry appears. */}
      <section className="flex flex-col gap-2.5">
        <Heading icon={<Users />} count={scoped.people.length}>
          {scoped.peopleAreScoped ? 'People named here' : 'People in this record'}
        </Heading>
        {scoped.people.length === 0 ? (
          <Empty>
            Nobody named yet. Carers, next of kin and clinicians appear here as they are recorded.
          </Empty>
        ) : (
          <ul className="flex flex-col divide-y divide-mulberry-100 overflow-hidden rounded-lg border border-mulberry-200 bg-mulberry-50">
            {scoped.people.map((person) => (
              <li key={person.id} className="flex items-center gap-3 px-3.5 py-2.5">
                <Avatar name={person.name} size="sm" />
                <span className="min-w-0 flex-1">
                  <span
                    className="block truncate text-base font-medium text-oat-900"
                    title={person.name}
                  >
                    {person.name}
                  </span>
                  <span className="block truncate text-2xs text-mulberry-700">{person.role}</span>
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="flex flex-col gap-2.5">
        <Heading icon={<Paperclip />} count={scoped.attachments.length}>
          Attached
        </Heading>
        {scoped.attachments.length === 0 ? (
          <Empty>No documents attached. Tick them in Signatures to list them here.</Empty>
        ) : (
          <ul className="flex flex-wrap gap-1.5">
            {scoped.attachments.map((a) => (
              <li key={a.id}>
                <Badge tone="brand">{a.label}</Badge>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-auto flex flex-col gap-2.5 border-t border-oat-200 pt-5">
        <Heading icon={<MessageSquare />}>Assistant</Heading>
        <Button
          variant="secondary"
          size="md"
          fullWidth
          icon={<MessageSquare />}
          onClick={onOpenAssistant}
        >
          Ask about this assessment
        </Button>
      </section>
    </aside>
  );
};
