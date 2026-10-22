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
 * Who this record is about — the white band across the top of the workspace.
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
    <header className={cn('border-b border-oat-200 bg-white px-5 pb-5 pt-4 sm:px-8 lg:pt-5', className)}>
      {onBack && (
        <Button variant="ghost" size="sm" onClick={onBack} icon={<ArrowLeft />} className="-ml-2.5 mb-2.5">
          Service users
        </Button>
      )}

      <div className="flex flex-wrap items-center gap-x-5 gap-y-3.5">
        <Avatar name={name} size="xl" className="ring-4 ring-mulberry-50" />

        <div className="min-w-[12rem] flex-1">
          {/* Never truncated: this is whose record it is. */}
          <h1 className="text-xl font-semibold tracking-tight text-teal-900 [overflow-wrap:anywhere] sm:text-2xl lg:text-3xl">
            {name || 'New assessment'}
          </h1>

          {facts.length > 0 ? (
            <dl className="mt-1.5 flex flex-wrap items-baseline gap-x-5 gap-y-1">
              {facts.map((f) => (
                <div key={f.label} className="flex items-baseline gap-1.5">
                  <dt className="text-xs text-oat-500">{f.label}</dt>
                  <dd className="text-base font-medium text-oat-800">{f.value}</dd>
                </div>
              ))}
            </dl>
          ) : (
            <p className="mt-1.5 text-base text-oat-500">Personal details not yet recorded</p>
          )}
        </div>

        <div className="flex basis-full flex-wrap items-center gap-2 sm:basis-auto">
          {status && <StatusBadge status={status} />}
          <RiskBadge level={overallRisk} prefix="Risk" />
        </div>
      </div>
    </header>
  );
};
