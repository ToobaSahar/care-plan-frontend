import React from 'react';
import { NavLink } from 'react-router-dom';
import { LogOut, Users, UserCog } from 'lucide-react';
import { cn } from '../../lib/cn';
import { useAuth } from '../../auth/AuthProvider';
import { can, PERMISSIONS, ROLE_LABELS, type Permission } from '../../auth/permissions';
import { WorkSurface } from './WorkSurface';
import { Button, Logo } from '../ui';

/* ──────────────────────────────────────────────────────────────────────────
   The frame every workspace screen sits in.

   Extracted when the team roster became a second destination. Two copies of
   a navigation rail drift within a week — one gains an item, the other keeps
   an old spacing — so there is one, and the pages supply only their own
   heading, actions and body.

   Navigation is driven by permissions rather than by role, so a colleague is
   never shown a door that will not open for them.
   ────────────────────────────────────────────────────────────────────────── */

interface NavItem {
  to: string;
  label: string;
  Icon: React.ElementType;
  permission: Permission;
}

const NAV: readonly NavItem[] = [
  {
    to: '/assessments',
    label: 'Caseload',
    Icon: Users,
    permission: PERMISSIONS.recordsRead,
  },
  {
    to: '/team',
    label: 'Team',
    Icon: UserCog,
    permission: PERMISSIONS.staffRead,
  },
];

/** Ends the session. Shared so the rail and the narrow header agree. */
export const SignOutButton: React.FC<{ className?: string }> = ({ className }) => {
  const { signOut } = useAuth();
  return (
    <Button
      variant="onDark"
      size="sm"
      icon={<LogOut />}
      onClick={() => void signOut()}
      className={className}
    >
      Sign out
    </Button>
  );
};

/**
 * Who is signed in, at the foot of the rail.
 *
 * Named rather than implied: in a shared-device setting — which is most of
 * domiciliary care — recording against the previous shift's account is a
 * governance incident, so the current identity stays on screen.
 */
const AccountFooter: React.FC = () => {
  const { staff, session } = useAuth();
  const name = staff?.full_name || session?.user.email || 'Signed in';

  return (
    <div className="border-t border-teal-600/60 pt-4">
      <p className="truncate text-xs font-medium text-teal-50" title={name}>
        {name}
      </p>
      {staff?.role && (
        <p className="mt-0.5 text-2xs text-teal-100/60">{ROLE_LABELS[staff.role]}</p>
      )}
      <SignOutButton className="mt-2.5" />
    </div>
  );
};

export interface WorkspaceShellProps {
  title: string;
  description: string;
  /** Controls for this screen, aligned right of the heading. */
  actions?: React.ReactNode;
  children: React.ReactNode;
}

export const WorkspaceShell: React.FC<WorkspaceShellProps> = ({
  title,
  description,
  actions,
  children,
}) => {
  const { staff } = useAuth();
  const items = NAV.filter((item) => can(staff, item.permission));

  return (
    <div className="flex min-h-screen bg-teal-800">
      <nav
        aria-label="Main"
        className="cf-rail hidden w-[212px] flex-none flex-col bg-teal-800 py-5 lg:flex"
      >
        <div className="px-5 pb-7">
          <Logo onDark size="md" />
        </div>

        {/* Assessments and care plans belong to a person, so they are reached
            from that person's row rather than from nav items that cannot know
            who is meant. */}
        <p className="px-5 pb-2 text-2xs font-semibold uppercase text-teal-400">Workspace</p>

        {items.map(({ to, label, Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-5 py-2.5 text-base font-semibold transition-colors duration-fast',
                isActive
                  ? 'bg-teal-600 text-white shadow-[inset_3px_0_0_#78BDB5]'
                  : 'text-teal-100/80 hover:bg-teal-700 hover:text-white',
              )
            }
          >
            <Icon className="h-4 w-4 flex-none" aria-hidden="true" />
            {label}
          </NavLink>
        ))}

        <div className="mt-auto px-5">
          <AccountFooter />
        </div>
      </nav>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="px-6 pb-6 pt-5">
          <div className="mx-auto flex w-full max-w-5xl flex-wrap items-end gap-x-4 gap-y-4">
            <div className="lg:hidden">
              {/* The dark-ground variant: the standard mark's frame is the
                  same Slate Teal as this header, so it all but disappears. */}
              <Logo size="sm" variant="mark" onDark />
            </div>
            <div className="min-w-0">
              <h1 className="text-3xl font-semibold tracking-tight text-white">{title}</h1>
              <p className="mt-1.5 text-base text-teal-100/80">{description}</p>
            </div>

            <div className="ml-auto flex flex-wrap items-center gap-2.5">
              {actions}
              {/* The rail carries these at desktop widths; below that there is
                  no rail, and both must still be reachable. */}
              {items.length > 1 && (
                <div className="flex items-center gap-2.5 lg:hidden">
                  {items.map(({ to, label }) => (
                    <NavLink
                      key={to}
                      to={to}
                      className={({ isActive }) =>
                        cn(
                          'rounded px-2.5 py-1.5 text-xs font-semibold transition-colors duration-fast',
                          isActive
                            ? 'bg-teal-600 text-white'
                            : 'text-teal-100/80 hover:bg-teal-700 hover:text-white',
                        )
                      }
                    >
                      {label}
                    </NavLink>
                  ))}
                </div>
              )}
              <SignOutButton className="lg:hidden" />
            </div>
          </div>
        </header>

        <WorkSurface className="flex-1 px-6 py-7">{children}</WorkSurface>
      </div>
    </div>
  );
};
