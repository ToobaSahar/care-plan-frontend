/* ──────────────────────────────────────────────────────────────────────────
   The team roster.

   Reads and writes go through the care plan API rather than Supabase
   directly, because creating an account needs the service role key and that
   key cannot be in a browser. Reading the roster could go either way; it is
   kept here so there is one place the team screen talks to.
   ────────────────────────────────────────────────────────────────────────── */

import { supabase } from './supabase';
import type { StaffRole } from '../auth/AuthProvider';
import type { Permission } from '../auth/permissions';

// Same rule as carePlanApi: resolved per call, never at module load, and the
// localhost fallback is a development convenience only.
const configuredBaseUrl = (import.meta as any).env.VITE_BACKEND_URL as string | undefined;
const isDev = Boolean((import.meta as any).env.DEV);
const API_BASE_URL = configuredBaseUrl || (isDev ? 'http://localhost:8000' : '');

export interface StaffMember {
  id: string;
  email: string | null;
  full_name: string | null;
  role: StaffRole;
  is_active: boolean;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface StaffListResponse {
  staff: StaffMember[];
  permissions: Permission[];
}

export interface CreateStaffResponse {
  staff: StaffMember;
  /** Shown once. The server does not keep a readable copy. */
  temporary_password: string;
}

/** Carries the API's own message, which is written to be shown to a person. */
export class StaffApiError extends Error {
  constructor(message: string, readonly status: number) {
    super(message);
  }
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  if (!API_BASE_URL) {
    throw new StaffApiError(
      'Team management is not available: this deployment has no backend configured.',
      0,
    );
  }

  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  if (!token) throw new StaffApiError('Your session has expired. Sign in again.', 401);

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...init,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        ...(init.headers ?? {}),
      },
    });
  } catch {
    // A failed fetch here is almost always the API not being reachable, which
    // is worth saying plainly rather than reporting as a generic failure.
    throw new StaffApiError(
      'The team service could not be reached. Check that the API is running.',
      0,
    );
  }

  if (!response.ok) {
    // FastAPI puts the readable message in `detail`; a validation error puts
    // a list there instead, which is not for showing to anyone.
    let message = `The request failed (${response.status}).`;
    try {
      const body = await response.json();
      if (typeof body?.detail === 'string') message = body.detail;
    } catch {
      /* keep the fallback */
    }
    throw new StaffApiError(message, response.status);
  }

  return (await response.json()) as T;
}

export const staffApi = {
  list: () => request<StaffListResponse>('/staff'),

  create: (input: { email: string; full_name: string; role: StaffRole }) =>
    request<CreateStaffResponse>('/staff', {
      method: 'POST',
      body: JSON.stringify(input),
    }),

  update: (id: string, changes: { role?: StaffRole; is_active?: boolean }) =>
    request<StaffMember>(`/staff/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(changes),
    }),
};
