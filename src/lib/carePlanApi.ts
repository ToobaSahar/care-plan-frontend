// Care Plan API Client for React Frontend

import { supabase } from './supabase';

// In production the localhost fallback is wrong by definition: it resolves to
// the visitor's own machine, not the server. So it is only used in dev.
//
// The check happens when a call is made, never at module load. Throwing while
// this module is being evaluated takes down everything that imports it — and
// since AssessmentPage imports it, that is the whole application: a deploy
// missing one optional variable rendered a blank page, sign-in included.
// Care plan generation is one feature; it fails on its own.
const configuredBaseUrl = (import.meta as any).env.VITE_BACKEND_URL as string | undefined;
const isDev = Boolean((import.meta as any).env.DEV);

const API_BASE_URL = configuredBaseUrl || (isDev ? 'http://localhost:8000' : '');

/** Raised when the care plan service has not been configured for this build. */
export class CarePlanNotConfiguredError extends Error {}

/** Raised when the API rejects the session, so the UI can say so plainly. */
export class CarePlanAuthError extends Error {}

/**
 * The caller's Supabase session, forwarded to the generator.
 *
 * The API holds the service-role key and so bypasses row-level security
 * entirely; without this header it would be an unauthenticated route into
 * every record the database just locked down.
 */
async function authHeaders(): Promise<Record<string, string>> {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  if (!token) throw new CarePlanAuthError('Your session has expired. Sign in again.');
  return { Authorization: `Bearer ${token}` };
}

/** Turns the API's refusals into something a person can act on. */
async function parse<T>(response: Response): Promise<T> {
  if (response.status === 401 || response.status === 403) {
    throw new CarePlanAuthError(
      response.status === 401
        ? 'Your session has expired. Sign in again.'
        : 'This account is not permitted to generate care plans.',
    );
  }
  return (await response.json()) as T;
}

export interface CarePlanRequest {
  assessment_id?: string;
  use_recent?: boolean;
}

export interface CarePlanResponse {
  success: boolean;
  care_plan?: any;
  assessment_id?: number;
  message: string;
}

export interface CarePlanSection {
  description: string;
  identified_need: string;
  planned_outcomes: string;
  how_to_achieve: string;
  level_of_need: string;
}

export interface CarePlanData {
  health_wellbeing: CarePlanSection;
  daily_living: CarePlanSection;
  risks_safeguarding: CarePlanSection;
  social_emotional: CarePlanSection;
  environment_lifestyle: CarePlanSection;
  advance_preferences: CarePlanSection;
  optional_areas: CarePlanSection;
}

export class CarePlanAPI {
  private readonly baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  /**
   * The service root, or a failure that names the cause.
   *
   * Called per request rather than checked once at construction, so an
   * unconfigured deployment degrades to "this feature is unavailable" instead
   * of breaking every module that imports this one.
   */
  private root(): string {
    if (!this.baseUrl) {
      throw new CarePlanNotConfiguredError(
        'Care plan generation is not available: this deployment has no backend configured.',
      );
    }
    return this.baseUrl;
  }

  async checkHealth(): Promise<boolean> {
    if (!this.baseUrl) return false;
    try {
      // Left unauthenticated: /health reports liveness and nothing else,
      // and is also what the platform's own probe calls.
      const response = await fetch(`${this.root()}/health`);
      return response.ok;
    } catch (error) {
      console.error('Health check failed:', error);
      return false;
    }
  }

  async generateCarePlanForRecent(): Promise<CarePlanResponse> {
    try {
      const response = await fetch(`${this.root()}/generate-care-plan/recent`, {
        headers: await authHeaders(),
      });
      return await parse<CarePlanResponse>(response);
    } catch (error) {
      console.error('Error generating care plan for recent assessment:', error);
      throw error;
    }
  }

  async generateCarePlanById(assessmentId: string): Promise<CarePlanResponse> {
    try {
      const response = await fetch(`${this.root()}/generate-care-plan/${assessmentId}`, {
        headers: await authHeaders(),
      });
      return await parse<CarePlanResponse>(response);
    } catch (error) {
      console.error(`Error generating care plan for assessment ${assessmentId}:`, error);
      throw error;
    }
  }

  async generateCarePlan(request: CarePlanRequest): Promise<CarePlanResponse> {
    try {
      const response = await fetch(`${this.root()}/generate-care-plan`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(await authHeaders()),
        },
        body: JSON.stringify(request),
      });
      return await parse<CarePlanResponse>(response);
    } catch (error) {
      console.error('Error generating care plan:', error);
      throw error;
    }
  }

  // Helper method to format care plan for display
  formatCarePlan(carePlan: any): CarePlanData | null {
    if (!carePlan || !carePlan.care_plans) {
      return null;
    }

    return carePlan.care_plans as CarePlanData;
  }
}

// Export a default instance
export const carePlanAPI = new CarePlanAPI();
