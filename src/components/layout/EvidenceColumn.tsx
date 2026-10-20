import React from 'react';
import { MessageSquare, Paperclip, ShieldAlert, Users } from 'lucide-react';
import { Avatar, Badge, Button, RiskBadge } from '../ui';
import { SECTION_TITLES, scopeEvidence, type Evidence } from '../../lib/evidence';
import { cn } from '../../lib/cn';

export interface EvidenceColumnProps {
  evidence: Evidence;
  /** 1-indexed section currently in view. Scopes what is shown. */
  sectionIndex: number;
  onOpenSection: (sectionNumber: number) => void;
  onOpenAssistant: () => void;
  /** Light planes on the shell's dark ground; false renders it on paper. */
  onDark?: boolean;
  className?: string;
}

const Heading: React.FC<{ icon: React.ReactNode; onDark?: boolean; children: React.ReactNode }> = ({
  icon,
  onDark,
  children,
}) => (
  <h2
    className={cn(
      'flex items-center gap-2 text-2xs font-semibold uppercase',
      onDark ? 'text-teal-400' : 'text-oat-600',
    )}
  >
    <span className="[&>svg]:h-3.5 [&>svg]:w-3.5" aria-hidden="true">
      {icon}
    </span>
    {children}
  </h2>
);

const Empty: React.FC<{ onDark?: boolean; children: React.ReactNode }> = ({ onDark, children }) => (
  <p
    className={cn(
      'rounded-lg border border-dashed px-3 py-2.5 text-xs',
      onDark ? 'border-teal-600/70 text-teal-100/70' : 'border-oat-300 text-oat-600',
    )}
  >
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
  onDark = false,
  className,
}) => {
  const scoped = scopeEvidence(evidence, sectionIndex);
  const plane = onDark ? 'bg-teal-900/70 border-teal-700/60' : 'bg-white border-oat-200';

  return (
    <aside
      aria-label="Evidence for this section"
      className={cn(
        'flex h-full flex-col gap-5 overflow-y-auto px-5 py-5',
        onDark ? 'cf-rail' : 'border-l border-oat-200 bg-oat-100',
        className,
      )}
    >
      <p
        className={cn(
          'text-2xs font-semibold uppercase tracking-wide',
          onDark ? 'text-teal-100/60' : 'text-oat-500',
        )}
      >
        Evidence · {SECTION_TITLES[sectionIndex - 1] ?? 'Assessment'}
      </p>

      {/* Risk — the layer riding over the record, in its own reserved ink. */}
      <section className="flex flex-col gap-2.5">
        <Heading icon={<ShieldAlert />} onDark={onDark}>
          Raised by this record
        </Heading>
        {scoped.risks.length === 0 ? (
          <Empty onDark={onDark}>
            No risks flagged yet. They appear here as Risks &amp; Safeguarding is filled in.
          </Empty>
        ) : (
          scoped.risks.map((risk) => (
            <article key={risk.id} className={cn('cf-arrive rounded-lg border p-3', plane)}>
              <RiskBadge level={risk.level} prefix={risk.label} />
              {risk.note && (
                <p
                  className={cn(
                    'mt-2 text-xs leading-5',
                    onDark ? 'text-teal-50/90' : 'text-oat-700',
                  )}
                >
                  {risk.note}
                </p>
              )}
              <button
                type="button"
                onClick={() => onOpenSection(risk.sectionIndex)}
                className={cn(
                  'mt-2 text-2xs font-medium underline underline-offset-2',
                  onDark ? 'text-teal-300 hover:text-teal-100' : 'text-teal-700 hover:text-teal-800',
                )}
              >
                Raised in {SECTION_TITLES[risk.sectionIndex - 1]}
              </button>
            </article>
          ))
        )}
      </section>

      {/* People — the one place mulberry appears. */}
      <section className="flex flex-col gap-2.5">
        <Heading icon={<Users />} onDark={onDark}>
          {scoped.peopleAreScoped ? 'People named here' : 'People in this record'}
        </Heading>
        {scoped.people.length === 0 ? (
          <Empty onDark={onDark}>
            Nobody named yet. Carers, next of kin and clinicians appear here as they are recorded.
          </Empty>
        ) : (
          <div
            className={cn(
              'rounded-lg border px-3 py-2.5',
              onDark ? 'border-mulberry-700/70 bg-mulberry-900/40' : 'border-mulberry-200 bg-mulberry-50',
            )}
          >
            <ul className="flex flex-col gap-2.5">
              {scoped.people.map((person) => (
                <li key={person.id} className="flex items-center gap-2.5">
                  <Avatar name={person.name} size="sm" />
                  <span className="min-w-0 flex-1">
                    <span
                      className={cn(
                        'block truncate text-base font-medium',
                        onDark ? 'text-white' : 'text-oat-900',
                      )}
                    >
                      {person.name}
                    </span>
                    <span
                      className={cn(
                        'block truncate text-2xs',
                        onDark ? 'text-mulberry-200' : 'text-oat-600',
                      )}
                    >
                      {person.role}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>

      <section className="flex flex-col gap-2.5">
        <Heading icon={<Paperclip />} onDark={onDark}>
          Attached
        </Heading>
        {scoped.attachments.length === 0 ? (
          <Empty onDark={onDark}>
            No documents attached. Tick them in Signatures to list them here.
          </Empty>
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

      <section className="mt-auto flex flex-col gap-2.5 pt-2">
        <Heading icon={<MessageSquare />} onDark={onDark}>
          Assistant
        </Heading>
        <Button
          variant={onDark ? 'onDark' : 'secondary'}
          size="sm"
          fullWidth
          onClick={onOpenAssistant}
        >
          Ask about this assessment
        </Button>
      </section>
    </aside>
  );
};
