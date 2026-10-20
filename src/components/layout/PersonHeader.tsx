import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Avatar, Button, RiskBadge, StatusBadge } from '../ui';
import type { RiskLevel } from '../ui';
import { ageFrom, formatNhsNumber } from '../../lib/format';
import { cn } from '../../lib/cn';

export interface PersonHeaderProps {
  name?: string;
  nhsNumber?: string;
  dateOfBirth?: string;
  postcode?: string;
  assessorName?: string;
  status?: string;
  overallRisk: RiskLevel;
  onBack?: () => void;
  className?: string;
}

/**
 * Who this record is about, set on the shell's own dark ground.
 *
 * This is the page's one moment of scale. An assessor should never have to
 * navigate to remember whose details they are typing, and the name is the
 * largest thing on the screen because it is the most important thing on it.
 * The risk rides here so it is visible from every section rather than only
 * from the one that raised it.
 */
export const PersonHeader: React.FC<PersonHeaderProps> = ({
  name,
  nhsNumber,
  dateOfBirth,
  postcode,
  assessorName,
  status,
  overallRisk,
  onBack,
  className,
}) => {
  const years = ageFrom(dateOfBirth);
  const facts = [
    nhsNumber && { label: 'NHS', value: formatNhsNumber(nhsNumber) },
    years !== null && { label: 'Age', value: String(years) },
    postcode && { label: 'Postcode', value: postcode },
    assessorName && { label: 'Assessor', value: assessorName },
  ].filter(Boolean) as Array<{ label: string; value: string }>;

  return (
    <header className={cn('px-5 pb-5 pt-4 sm:px-7', className)}>
      {onBack && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          icon={<ArrowLeft />}
          className="-ml-2 mb-2 text-teal-100/80 hover:bg-teal-700/50 hover:text-white"
        >
          Caseload
        </Button>
      )}

      <div className="flex flex-wrap items-end gap-x-5 gap-y-3">
        <Avatar name={name} size="lg" className="mb-1 h-11 w-11 text-sm sm:h-12 sm:w-12 sm:text-base" />

        <div className="min-w-[12rem] flex-1">
          {/* Never truncated: this is whose record it is. */}
          <h1 className="text-xl font-semibold tracking-tight text-white [overflow-wrap:anywhere] sm:text-2xl lg:text-3xl">
            {name || 'New assessment'}
          </h1>

          {facts.length > 0 ? (
            <dl className="mt-2 flex flex-wrap items-baseline gap-x-5 gap-y-1">
              {facts.map((f) => (
                <div key={f.label} className="flex items-baseline gap-1.5">
                  <dt className="text-2xs font-semibold uppercase text-teal-400">{f.label}</dt>
                  <dd className="text-base text-teal-50">{f.value}</dd>
                </div>
              ))}
            </dl>
          ) : (
            <p className="mt-2 text-base text-teal-100/70">Personal details not yet recorded</p>
          )}
        </div>

        <div className="flex basis-full flex-wrap items-center gap-2 pb-1 sm:basis-auto">
          {status && <StatusBadge status={status} />}
          <RiskBadge level={overallRisk} prefix="Risk" />
        </div>
      </div>
    </header>
  );
};
