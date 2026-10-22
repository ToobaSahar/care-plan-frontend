import React from 'react';
import { ClipboardList, FileText } from 'lucide-react';
import { Avatar, Button } from '../ui';
import type { ServiceUserRow } from '../../lib/serviceUsers';
import type { RiskSignal } from '../../lib/serviceUserSignals';
import { ageFrom, formatDate, formatNhsNumber } from '../../lib/format';
import { PlanCell, RiskCell, SectionStrip, type SignalStatus } from './SignalCells';

/* ──────────────────────────────────────────────────────────────────────────
   One person on the service users list.

   From 1360px the signals sit in their own columns; below that they fold
   under the name, so a tablet shows the same facts without a sideways
   scroll. Both arrangements share one grid template with the header row.
   ────────────────────────────────────────────────────────────────────────── */

export const SERVICE_USER_COLUMNS =
  'grid-cols-[2.25rem_minmax(0,1fr)] sm:grid-cols-[2.25rem_minmax(0,1fr)_auto] ' +
  'min-[1360px]:grid-cols-[2.25rem_minmax(0,1fr)_9.5rem_10rem_6rem_13.5rem]';

export interface ServiceUserListRowProps {
  user: ServiceUserRow;
  /** Sections saved: undefined while reading, null when it could not be read. */
  saved: number | null | undefined;
  riskStatus: SignalStatus;
  risk: RiskSignal | undefined;
  planStatus: SignalStatus;
  planReady: boolean;
  onOpenAssessment: () => void;
  onOpenCarePlan: () => void;
}

export const ServiceUserListRow: React.FC<ServiceUserListRowProps> = ({
  user,
  saved,
  riskStatus,
  risk,
  planStatus,
  planReady,
  onOpenAssessment,
  onOpenCarePlan,
}) => {
  const age = ageFrom(user.date_of_birth);
  const meta = [
    user.nhs_number && `NHS ${formatNhsNumber(user.nhs_number)}`,
    age !== null && `Age ${age}`,
    `Added ${formatDate(user.created_at)}`,
  ].filter(Boolean);

  return (
    <article
      className={`grid items-center gap-x-4 gap-y-3 px-5 py-4 transition-colors duration-fast ease-out hover:bg-oat-100 ${SERVICE_USER_COLUMNS}`}
    >
      <Avatar name={user.full_name ?? undefined} size="md" />

      <div className="min-w-0">
        <h3 className="truncate text-base font-semibold text-oat-900">
          {user.full_name || 'Unnamed service user'}
        </h3>
        <p className="truncate text-xs text-oat-500">{meta.join(' · ')}</p>

        <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-2 min-[1360px]:hidden">
          <SectionStrip saved={saved} />
          <RiskCell status={riskStatus} signal={risk} compact />
          <PlanCell status={planStatus} ready={planReady} />
        </div>
      </div>

      <div className="hidden min-[1360px]:block">
        <SectionStrip saved={saved} />
      </div>
      <div className="hidden min-w-0 min-[1360px]:block">
        <RiskCell status={riskStatus} signal={risk} />
      </div>
      <div className="hidden min-[1360px]:block">
        <PlanCell status={planStatus} ready={planReady} />
      </div>

      {/* Both of a person's destinations, offered from the person — which is
          the only context in which either makes sense. */}
      <div className="col-start-2 flex items-center gap-2 sm:col-start-auto sm:justify-end">
        <Button variant="ghost" size="sm" onClick={onOpenAssessment} icon={<ClipboardList />}>
          Assessment
        </Button>
        <Button variant="secondary" size="sm" onClick={onOpenCarePlan} icon={<FileText />}>
          Care plan
        </Button>
      </div>
    </article>
  );
};
