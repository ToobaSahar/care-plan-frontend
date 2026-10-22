import React, { useId } from 'react';
import { NavLink } from 'react-router-dom';
import { LogOut, Users, UserCog } from 'lucide-react';
import { cn } from '../../lib/cn';
import { useAuth } from '../../auth/AuthProvider';
import { can, PERMISSIONS, ROLE_LABELS, type Permission } from '../../auth/permissions';
import { RAIL_DOCK, useRailLayout } from '../../hooks/useRailLayout';
import { WorkSurface } from './WorkSurface';
import { RailFrame } from './RailFrame';
import { Avatar, Button, Logo, Tooltip } from '../ui';
import { Greeting, RecentlyOpened } from './SidebarPanels';

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
    label: 'Dashboard',
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

const NAV_ACTIVE = 'bg-teal-600 font-semibold text-white shadow-[0_1px_2px_rgb(31_74_76/0.25)]';
// The rail is on the off-white ground, so a resting row lifts to white on hover.
const NAV_RESTING = 'text-oat-700 hover:bg-white hover:text-teal-800';
const NAV_ICON = 'h-[18px] w-[18px] flex-none text-teal-600 group-aria-[current=page]:text-white';

/** Ends the session. Shared so the rail and the narrow header agree. */
export const SignOutButton: React.FC<{
  className?: string;
  fullWidth?: boolean;
  /** On the Slate Teal account card rather than on oat. */
  onDark?: boolean;
}> = ({ className, fullWidth, onDark }) => {
  const { signOut } = useAuth();
  return (
    <Button
      variant={onDark ? 'onDark' : 'secondary'}
      size="sm"
      icon={<LogOut />}
      onClick={() => void signOut()}
      fullWidth={fullWidth}
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
const AccountFooter: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const { staff, session, signOut } = useAuth();
  const name = staff?.full_name || session?.user.email || 'Signed in';

  // Collapsed: the same Slate Teal card at strip width, still naming who is
  // signed in (on hover, and to a screen reader), with sign-out beneath it.
  if (compact) {
    const who = staff?.role ? `${name} · ${ROLE_LABELS[staff.role]}` : name;
    return (
      <div className="flex flex-col items-center gap-3">
        <Tooltip label={who}>
          <div className="flex w-11 justify-center rounded-xl bg-teal-800 py-2.5 shadow-sm">
            <Avatar name={staff?.full_name ?? undefined} size="sm" className="ring-2 ring-teal-700" />
            <span className="sr-only">Signed in as {who}</span>
          </div>
        </Tooltip>
        <Tooltip label="Sign out">
          <Button
            variant="secondary"
            icon={<LogOut />}
            aria-label="Sign out"
            onClick={() => void signOut()}
          />
        </Tooltip>
      </div>
    );
  }

  return (
    <div className="rounded-xl bg-teal-800 p-3.5 shadow-sm">
      <div className="flex items-center gap-3">
        <Avatar name={staff?.full_name ?? undefined} size="sm" className="ring-2 ring-teal-700" />
        <div className="min-w-0">
          <p className="truncate text-xs font-semibold text-white" title={name}>
            {name}
          </p>
          {staff?.role && (
            <p className="truncate text-2xs text-teal-200">{ROLE_LABELS[staff.role]}</p>
          )}
        </div>
      </div>
      <SignOutButton onDark fullWidth className="mt-3" />
    </div>
  );
};

export interface WorkspaceShellProps {
  title: string;
  description: string;
  /** Controls for this screen, aligned right of the heading. */
  actions?: React.ReactNode;
  /** A wider measure, for screens that carry a multi-column table. */
  wide?: boolean;
  children: React.ReactNode;
}

export const WorkspaceShell: React.FC<WorkspaceShellProps> = ({
  title,
  description,
  actions,
  wide = false,
  children,
}) => {
  const { staff } = useAuth();
  const items = NAV.filter((item) => can(staff, item.permission));
  const canReadRecords = can(staff, PERMISSIONS.recordsRead);

  // The same collapsible sidebar, edge handle and remembered preference as
  // the assessment, so it reads as one product from screen to screen.
  const rail = useRailLayout(RAIL_DOCK.workspace);
  const railId = useId();
  const collapsed = !rail.expanded;

  return (
    <div className="flex min-h-screen bg-oat-100">
      <RailFrame
        className="hidden lg:block"
        expanded={rail.expanded}
        onToggle={rail.toggle}
        controls={railId}
      >
        {collapsed ? (
          <nav
            id={railId}
            aria-label="Main"
            className="cf-rail flex h-full w-full flex-col items-center overflow-y-auto overflow-x-hidden py-5"
          >
            <div className="pb-4 pt-1">
              <Logo variant="mark" size="md" />
            </div>

            <div className="mb-3 h-px w-8 flex-none bg-oat-200" aria-hidden="true" />

            <div className="flex flex-col items-center gap-1">
              {items.map(({ to, label, Icon }) => (
                <Tooltip key={to} label={label}>
                  <NavLink
                    to={to}
                    aria-label={label}
                    className={({ isActive }) =>
                      cn(
                        'group flex h-11 w-11 items-center justify-center rounded-lg transition-colors duration-fast ease-out',
                        isActive ? NAV_ACTIVE : NAV_RESTING,
                      )
                    }
                  >
                    <Icon className={NAV_ICON} aria-hidden="true" />
                  </NavLink>
                </Tooltip>
              ))}
            </div>

            {canReadRecords && (
              <div className="mt-6">
                <RecentlyOpened staffId={staff?.id} compact />
              </div>
            )}

            <div className="mt-auto pt-6">
              <AccountFooter compact />
            </div>
          </nav>
        ) : (
          <nav
            id={railId}
            aria-label="Main"
            className="cf-rail flex h-full w-full flex-col overflow-y-auto py-5"
          >
            <div className="px-6 pb-6 pt-1">
              <Logo size="md" />
            </div>

            <Greeting name={staff?.full_name} />

            {/* Assessments and care plans belong to a person, so they are reached
                from that person's row rather than from nav items that cannot know
                who is meant. */}
            <p className="px-6 pb-2.5 text-2xs font-semibold uppercase text-teal-700">Workspace</p>

            <div className="flex flex-col gap-0.5 px-3">
              {items.map(({ to, label, Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  className={({ isActive }) =>
                    cn(
                      'group flex items-center gap-3 rounded-lg px-3 py-2 text-base font-medium transition-colors duration-fast ease-out',
                      isActive ? NAV_ACTIVE : NAV_RESTING,
                    )
                  }
                >
                  <Icon className={NAV_ICON} aria-hidden="true" />
                  {label}
                </NavLink>
              ))}
            </div>

            {canReadRecords && (
              <div className="mt-7 px-3">
                <RecentlyOpened staffId={staff?.id} />
              </div>
            )}

            <div className="mt-auto px-3 pt-7">
              <AccountFooter />
            </div>
          </nav>
        )}
      </RailFrame>

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Below the rail's breakpoint the brand and the destinations move to
            a slim bar on the same ground, so neither disappears on a tablet. */}
        <div className="flex items-center gap-3 border-b border-oat-200 bg-oat-100 px-5 py-3 lg:hidden">
          <Logo size="sm" />
          <div className="ml-auto flex items-center gap-1.5">
            {items.length > 1 &&
              items.map(({ to, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  className={({ isActive }) =>
                    cn(
                      'rounded-md px-2.5 py-1.5 text-xs font-semibold transition-colors duration-fast',
                      isActive
                        ? 'bg-teal-600 text-white'
                        : 'text-oat-700 hover:bg-white hover:text-teal-800',
                    )
                  }
                >
                  {label}
                </NavLink>
              ))}
            <SignOutButton className="ml-1" />
          </div>
        </div>

        <WorkSurface className="flex-1 px-5 pb-12 pt-8 sm:px-8 lg:px-12 lg:pt-11">
          <header
            className={cn(
              'mx-auto mb-8 flex w-full flex-wrap items-end gap-x-6 gap-y-5',
              wide ? 'max-w-6xl' : 'max-w-5xl',
            )}
          >
            <div className="min-w-0">
              <h1 className="text-3xl font-semibold tracking-tight text-teal-800">{title}</h1>
              <p className="mt-1.5 text-base text-oat-600">{description}</p>
            </div>

            {actions && (
              <div className="flex w-full flex-wrap items-center gap-2.5 sm:ml-auto sm:w-auto">
                {actions}
              </div>
            )}
          </header>

          {children}
        </WorkSurface>
      </div>
    </div>
  );
};
