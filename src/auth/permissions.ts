/* ──────────────────────────────────────────────────────────────────────────
   What a role may do.

   Mirrors `public.role_permissions`, which is the source of truth. This copy
   exists so the UI can decide what to render without a round trip, and so a
   component asks `can(staff, 'staff:manage')` rather than
   `staff.role === 'admin'` — the check that is correct until the day a
   fourth role appears, and then wrong in thirty places at once.

   Nothing here is a security control. The database refuses the same requests
   on its own; this only decides what is worth showing.
   ────────────────────────────────────────────────────────────────────────── */

import type { StaffProfile, StaffRole } from './AuthProvider';

export const PERMISSIONS = {
  recordsRead: 'records:read',
  recordsWrite: 'records:write',
  carePlanGenerate: 'careplan:generate',
  staffRead: 'staff:read',
  staffManage: 'staff:manage',
} as const;

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

const MATRIX: Record<StaffRole, readonly Permission[]> = {
  viewer: [PERMISSIONS.recordsRead],

  assessor: [PERMISSIONS.recordsRead, PERMISSIONS.recordsWrite, PERMISSIONS.carePlanGenerate],

  admin: [
    PERMISSIONS.recordsRead,
    PERMISSIONS.recordsWrite,
    PERMISSIONS.carePlanGenerate,
    PERMISSIONS.staffRead,
    PERMISSIONS.staffManage,
  ],
};

/** Every permission held by a role. An unknown role holds none. */
export function permissionsFor(role: StaffRole | undefined): readonly Permission[] {
  return (role && MATRIX[role]) || [];
}

/**
 * The one question the UI should ask about authorisation.
 *
 * Inactive staff hold nothing regardless of role, which matches the database:
 * `is_active_staff()` is the first term of every policy.
 */
export function can(staff: StaffProfile | null, permission: Permission): boolean {
  if (!staff?.is_active) return false;
  return permissionsFor(staff.role).includes(permission);
}

/** Human labels, kept beside the matrix so a new role cannot arrive unnamed. */
export const ROLE_LABELS: Record<StaffRole, string> = {
  admin: 'Administrator',
  assessor: 'Assessor',
  viewer: 'Viewer',
};

export const ROLE_DESCRIPTIONS: Record<StaffRole, string> = {
  admin: 'Everything an assessor can do, and manages who else has access.',
  assessor: 'Carries out assessments and generates care plans.',
  viewer: 'Reads records but cannot change them.',
};

export const ROLE_ORDER: readonly StaffRole[] = ['admin', 'assessor', 'viewer'];
