import React from 'react';
import { Link } from 'react-router-dom';
import { Avatar, Skeleton, Tooltip } from '../ui';
import { useRecentlyOpened } from '../../hooks/useRecentlyOpened';
import { formatNhsNumber } from '../../lib/format';

/* ──────────────────────────────────────────────────────────────────────────
   What the workspace rail carries beneath its navigation: whose session
   this is, and a way back into the records they were last working on.
   ────────────────────────────────────────────────────────────────────────── */

/** Good morning, by name, with the date: whose session this is, and when. */
export const Greeting: React.FC<{ name?: string | null }> = ({ name }) => {
  const now = new Date();
  const hour = now.getHours();
  const part = hour < 12 ? 'morning' : hour < 18 ? 'afternoon' : 'evening';
  const first = name?.trim().split(/\s+/)[0];
  const date = now.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });

  return (
    <div className="px-6 pb-6">
      <p className="text-lg font-semibold text-teal-800">
        Good {part}
        {first ? `, ${first}` : ''}
      </p>
      <p className="text-xs text-oat-500">{date}</p>
    </div>
  );
};

/**
 * The people this colleague opened last, on this device.
 *
 * `compact` is the collapsed sidebar's form: each person as their avatar
 * alone, named on hover and keyboard focus, so the way back into a record
 * survives the collapse.
 */
export const RecentlyOpened: React.FC<{ staffId?: string; compact?: boolean }> = ({
  staffId,
  compact = false,
}) => {
  const { people, pending, count } = useRecentlyOpened(staffId);
  if (!staffId) return null;

  if (compact) {
    if (people.length === 0) return null;
    return (
      <div className="flex flex-col items-center">
        <div className="mb-3 h-px w-8 flex-none bg-oat-200" aria-hidden="true" />
        <ul aria-label="Recently opened" className="flex flex-col items-center gap-1">
          {people.map((person) => {
            const name = person.full_name || 'Unnamed service user';
            return (
              <li key={person.id}>
                <Tooltip label={name}>
                  <Link
                    to={`/assessment/${person.id}`}
                    aria-label={name}
                    className="flex h-11 w-11 items-center justify-center rounded-lg transition-colors duration-fast ease-out hover:bg-white"
                  >
                    <Avatar name={person.full_name ?? undefined} size="sm" />
                  </Link>
                </Tooltip>
              </li>
            );
          })}
        </ul>
      </div>
    );
  }

  return (
    <div>
      <p className="px-3 pb-2 text-2xs font-semibold uppercase text-teal-700">Recently opened</p>

      {people.length === 0 && pending ? (
        <div className="flex flex-col gap-2 px-3" aria-hidden="true">
          {Array.from({ length: count }).map((_, i) => (
            <Skeleton key={i} className="h-9 w-full" />
          ))}
        </div>
      ) : people.length === 0 ? (
        <p className="px-3 text-xs leading-5 text-oat-500">
          People you open appear here, so you can pick up where you left off.
        </p>
      ) : (
        <ul className="flex flex-col">
          {people.map((person) => (
            <li key={person.id}>
              <Link
                to={`/assessment/${person.id}`}
                className="flex items-center gap-2.5 rounded-lg px-3 py-1.5 text-sm text-oat-800 transition-colors duration-fast ease-out hover:bg-white hover:text-teal-800"
              >
                <Avatar name={person.full_name ?? undefined} size="sm" />
                <span className="min-w-0 flex-1">
                  <span className="block truncate">
                    {person.full_name || 'Unnamed service user'}
                  </span>
                  {/* Two people can share a name; nobody shares this. */}
                  {person.nhs_number && (
                    <span className="block truncate text-2xs tabular-nums text-oat-500">
                      NHS {formatNhsNumber(person.nhs_number)}
                    </span>
                  )}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
