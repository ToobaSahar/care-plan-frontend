import { createClient } from '@supabase/supabase-js';
import { fetchAssessmentSections, SECTION_TABLES } from './assessmentSections';
import type { AssessmentData, SectionKey } from '../schema/assessment';

const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL;
const supabaseAnonKey =
  (import.meta as any).env.VITE_SUPABASE_ANON_KEY ||
  (import.meta as any).env.VITE_SUPABASE_PUBLISHABLE_KEY;

// Misconfiguration should be loud in development and silent in production,
// where the console is somewhere strangers read. The anon key is public by
// design; the project URL is not worth volunteering to a visitor.
if (!supabaseUrl || !supabaseAnonKey) {
  const message =
    'Missing Supabase configuration. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.';
  if ((import.meta as any).env.DEV) console.error(message);
  // Without these, every call would fail later with a confusing network
  // error instead of naming the actual problem here.
  throw new Error(message);
}

// ----------------------
// Supabase client
// ----------------------
export const supabase = createClient(supabaseUrl as string, supabaseAnonKey as string, {
  auth: {
    // The session lives in storage and refreshes in the background, so a
    // shift does not end mid-assessment with an expired token.
    persistSession: true,
    autoRefreshToken: true,
    storageKey: 'careframe.auth',
    // PKCE keeps the code exchange safe in a browser, where no client secret
    // can be kept, and is what a password-recovery link returns through.
    flowType: 'pkce',
    detectSessionInUrl: true,
  },
  global: {
    headers: { 'x-application-name': 'careframe-web' },
  },
});

// ----------------------
// Audit authorship
// ----------------------

/**
 * The value legacy rows already carry. Keeping it means an unattributed
 * record reads as "unknown" rather than being quietly assigned to whoever
 * happened to be nearby.
 */
const UNKNOWN_AUTHOR = '00000000-0000-0000-0000-000000000000';

/**
 * Who to record as the author of a row.
 *
 * Every write now happens behind the sign-in gate, so in practice this is
 * always a real person. A care record that cannot say who entered it is of
 * limited use at an inspection, and the column was previously a constant.
 */
async function currentUserId(): Promise<string> {
  const { data } = await supabase.auth.getSession();
  return data.session?.user.id ?? UNKNOWN_AUTHOR;
}

// ----------------------
// Record identifiers
// ----------------------

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Whether a string addresses a record.
 *
 * Every call below used to answer a malformed id by minting a fresh random
 * UUID and carrying on. That is the worst available answer: a read created an
 * unrelated empty record and returned it as though it were the one asked for,
 * and a write landed on a row nobody would look at again — a different one
 * per call, so an assessment's sections scattered across orphan rows under
 * ids the URL never mentions. Refusing is recoverable; silently writing to
 * the wrong record is not.
 */
function isRecordId(value: string): boolean {
  return UUID_PATTERN.test(value);
}

// Database types for care schema
export interface ServiceUser {
  id: string;
  full_name: string;
  date_of_birth: string;
  nhs_number: string;
  local_authority_number: string | null;
  preferred_name: string | null;
  address_line: string | null;
  postcode: string | null;
  phone_number: string | null;
  gp_name: string | null;
  gp_contact: string | null;
  emergency_contact_name: string | null;
  emergency_contact_number: string | null;
  relationship_to_service_user: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface Assessment {
  id: string;
  service_user_id: string;
  assessor_name: string;
  assessment_date: string;
  created_by: string;
  status?: 'draft' | 'in_review' | 'completed' | 'locked';
  created_at: string;
  updated_at: string;
  /** Populated by getById from the per-section tables. */
  data?: AssessmentData;
  /** Per-section completion, keyed by section number. */
  section_progress?: Record<string, boolean>;
}

export interface BasicDetails {
  assessment_id: string;
  communication_needs: string | null;
  communication_aids: string | null;
  language_spoken: string | null;
  religion_beliefs: string | null;
  ethnicity: string | null;
  cultural_preferences: string | null;
  consent_for_sharing_info: 'yes' | 'no' | null;
  capacity_for_care_decisions: 'yes' | 'no' | 'requires_assessment' | null;
  access_to_accommodation: string | null;
  key_safe: 'yes' | 'no' | null;
  who_opens_the_door: string | null;
  lifeline_in_place: 'yes' | 'no' | null;
}

export interface HealthWellbeing {
  assessment_id: string;
  primary_diagnosis: string | null;
  other_health_conditions: string | null;
  allergies: string | null;
  medication: string | null;
  gp_involvement: string | null;
  specialist_support: string | null;
  mental_health_concerns: string | null;
  cognition: string | null;
}

export interface DailyLiving {
  assessment_id: string;
  mobility: 'independent' | 'aided' | 'hoist' | null;
  mobility_notes: string | null;
  transfers: string | null;
  transfers_notes: string | null;
  falls_risk: 'yes' | 'no' | null;
  falls_risk_notes: string | null;
  eating_drinking: string | null;
  eating_drinking_notes: string | null;
  personal_care: 'independent' | 'partial_support' | 'full_support' | null;
  personal_care_notes: string | null;
  continence: 'pads' | 'toilet' | 'catheter' | 'incontinent' | null;
  continence_notes: string | null;
  sleep_pattern: 'normal' | 'disturbed' | 'needs_checks' | null;
  sleep_pattern_notes: string | null;
  communication_mode: 'verbal' | 'non_verbal' | 'hearing_aids' | null;
  communication_notes: string | null;
}

export interface RisksSafeguarding {
  assessment_id: string;
  risk_of_falls: 'yes' | 'no' | null;
  risk_of_falls_notes: string | null;
  choking_risk: 'yes' | 'no' | null;
  choking_risk_notes: string | null;
  pressure_sores_skin: 'yes' | 'no' | null;
  pressure_sores_skin_notes: string | null;
  self_neglect: 'yes' | 'no' | null;
  self_neglect_notes: string | null;
  medication_risk_assessment: string | null;
  safeguarding_concerns: 'yes' | 'no' | null;
  safeguarding_concerns_notes: string | null;
  mental_capacity_dols: string | null;
  personal_evacuation_plan: 'yes' | 'no' | null;
  personal_evacuation_plan_notes: string | null;
}

export interface SocialEmotional {
  assessment_id: string;
  family_involvement_notes: string | null;
  hobbies_interests_notes: string | null;
  routine_preferences_notes: string | null;
  spiritual_religious_support_notes: string | null;
  emotional_mental_health_support_needs_notes: string | null;
}

export interface EnvironmentLifestyle {
  assessment_id: string;
  living_arrangements_notes: string | null;
  pets_notes: string | null;
  smoking_alcohol_notes: string | null;
  community_access_notes: string | null;
  transport_needs_notes: string | null;
  hoarding_clutter_notes: string | null;
}

export interface AdvancePreferences {
  assessment_id: string;
  dnacpr_in_place: 'yes' | 'no' | null;
  dnacpr_in_place_notes: string | null;
  respect_form_in_place: 'yes' | 'no' | null;
  respect_form_in_place_notes: string | null;
  advance_care_plan_wishes: string | null;
  advance_care_plan_wishes_notes: string | null;
  power_of_attorney: string | null;
  power_of_attorney_notes: string | null;
}

export interface OptionalAreas {
  assessment_id: string;
  financial_management_needs: string | null;
  equality_diversity_inclusion_edi_considerations: string | null;
  assistive_technology_equipment: string | null;
  legal_orders_or_restrictions: string | null;
  sexuality_and_relationships: string | null;
  access_to_advocacy_services: string | null;
}

export interface Signatures {
  assessment_id: string;
  assessor_name: string | null;
  assessor_signature: string | null;
  assessor_date: string | null;
  individual_representative_name: string | null;
  individual_representative_signature: string | null;
  individual_representative_date: string | null;
}

export interface OptionalAttachments {
  assessment_id: string;
  risk_assessments: boolean | null;
  dnacpr: boolean | null;
  respect_form: boolean | null;
  medication_list: boolean | null;
  poa_documentation: boolean | null;
  peep_evacuation_plan: boolean | null;
  communication_passport: boolean | null;
}



// ----------------------
// Database functions
// ----------------------
export const assessmentApi = {
  async getById(id: string): Promise<Assessment | null> {
    if (!isRecordId(id)) {
      console.error('Refusing to open an assessment: malformed id.');
      return null;
    }

    try {
      const assessmentId = id;

      // Try to get existing assessment first
      const { data: assessmentData, error: assessmentError } = await supabase
        .from('assessments')
        .select('*')
        .eq('id', assessmentId)
        .maybeSingle();

      if (assessmentError) {
        console.error('Error fetching assessment:', assessmentError);
        return null;
      }

      // If assessment exists, return it with empty data (no pre-filling)
      if (assessmentData) {
        return {
          ...assessmentData,
          data: await fetchAssessmentSections(assessmentId),
          section_progress: {}
        } as any;
      }

      // If assessment doesn't exist, create a new one with the generated UUID (but don't create service user yet)
      console.log('Creating new assessment with ID:', assessmentId);
      const { data: newAssessment, error: createError } = await supabase
        .from('assessments')
        .insert({
          id: assessmentId,
          service_user_id: assessmentId, // Use the same ID for both
          assessor_name: 'Care Assessor',
          assessment_date: new Date().toISOString().split('T')[0],
          created_by: await currentUserId(),
        })
        .select()
        .single();

      if (createError) {
        console.error('Error creating assessment:', createError);
        return null;
      }

      if (newAssessment) {
        return {
          ...newAssessment,
          data: {
            personalDetails: {},
            basicDetails: {},
            healthWellbeing: {},
            dailyLiving: {},
            risksSafeguarding: {},
            socialEmotional: {},
            environmentLifestyle: {},
            advancePreferences: {},
            optionalAreas: {},
            signatures: {},
            optionalAttachments: {}
          },
          section_progress: {}
        } as any;
      }
      return null;
    } catch (error) {
      console.error('Unexpected error in getById:', error);
      return null;
    }
  },

  async getList(): Promise<Assessment[]> {
    // Return empty array to avoid database queries
    return [];
  },

  async create(serviceUserId: string, assessorName: string, assessmentDate: string): Promise<Assessment | null> {
    // Create a real assessment in Supabase
    const { data, error } = await supabase
      .from('assessments')
      .insert({
        service_user_id: serviceUserId,
        assessor_name: assessorName,
        assessment_date: assessmentDate,
        created_by: await currentUserId(),
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating assessment:', error);
      return null;
    }

    console.log('Created assessment:', data.id);
    return data as Assessment;
  },

  async createWithId(id: string, _serviceUserId: string, assessorName: string, assessmentDate: string): Promise<Assessment | null> {
    if (!isRecordId(id)) {
      console.error('Refusing to create an assessment: malformed id.');
      return null;
    }

    try {
      const assessmentId = id;

      // Create the assessment (service user will be created when form data is saved)
      const { data, error } = await supabase
        .from('assessments')
        .insert({
          id: assessmentId,
          service_user_id: assessmentId, // Use the same ID for both
          assessor_name: assessorName,
          assessment_date: assessmentDate,
          created_by: await currentUserId(),
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating assessment with ID:', error);
        return null;
      }

      console.log('Created assessment with ID:', data.id);
      return data as Assessment;
    } catch (error) {
      console.error('Unexpected error in createWithId:', error);
      return null;
    }
  },

  async updateSection(
    assessmentId: string,
    sectionKey: SectionKey,
    sectionData: any
  ): Promise<boolean> {
    if (!isRecordId(assessmentId)) {
      console.error(`Refusing to save "${sectionKey}": malformed assessment id.`);
      return false;
    }

    try {
      const validAssessmentId = assessmentId;

      // Mapping lives in assessmentSections.ts so the read and the write
      // cannot drift apart.
      const tableMap: Record<string, string> = SECTION_TABLES;

      const tableName = tableMap[sectionKey];
      if (!tableName) return false;

      // Try to update the section data
      let error;
      
      if (sectionKey === 'personalDetails') {
        /* Personal details are the service user row itself, which shares the
           assessment's id.

           Nothing in here is logged. This is a person's name, address, NHS
           number and next of kin; the browser console is not a place to put
           them, and on a shared device it outlives the session. Failures are
           reported by their cause, never by their contents. */

        // First try to find existing service user for this assessment
        const { data: existingUser, error: fetchError } = await supabase
          .from('service_users')
          .select('id')
          .eq('id', validAssessmentId)
          .single();

        if (fetchError && fetchError.code !== 'PGRST116') {
          console.error('Error fetching service user:', fetchError);
          return false;
        }

        if (existingUser) {
          const { error: updateError } = await supabase
            .from('service_users')
            .update(sectionData)
            .eq('id', existingUser.id);
          error = updateError;
        } else {
          // Create new service user with the assessment ID as the service user ID
          const serviceUserData = {
            id: validAssessmentId,
            full_name: sectionData.full_name,
            date_of_birth: sectionData.date_of_birth,
            nhs_number: sectionData.nhs_number,
            local_authority_number: sectionData.local_authority_number,
            preferred_name: sectionData.preferred_name,
            address_line: sectionData.address_line,
            postcode: sectionData.postcode,
            phone_number: sectionData.phone_number,
            gp_name: sectionData.gp_name,
            gp_contact: sectionData.gp_contact,
            emergency_contact_name: sectionData.emergency_contact_name,
            emergency_contact_number: sectionData.emergency_contact_number,
            relationship_to_service_user: sectionData.relationship_to_service_user,
            created_by: await currentUserId(),
          };

          const { error: insertError } = await supabase
            .from('service_users')
            .insert(serviceUserData);
          error = insertError;
        }
      } else {
        // An untouched section is not a failure, and writing a row of empty
        // strings for it would make it read back as answered. `false` counts
        // as an answer here, as it does in the store.
        const hasAnswer = Object.values(sectionData ?? {}).some(
          (value) => value !== null && value !== undefined && value !== '',
        );

        if (!hasAnswer) return true;

        const { error: upsertError } = await supabase
          .from(tableName)
          .upsert({ assessment_id: validAssessmentId, ...sectionData });
        error = upsertError;
      }

      if (error) {
        // The message names the cause — a refused policy, a missing column, a
        // dropped connection — without repeating the record's contents.
        console.error(`Could not save "${sectionKey}": ${error.message}`);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Unexpected error in updateSection:', error);
      return false;
    }
  },

  async updateSectionProgress(_id: string, _sectionNumber: number, _completed: boolean): Promise<boolean> {
    // Not implemented: progress is derived from the section data itself.
    return true;
  },

  async updateStatus(_id: string, _status: string): Promise<boolean> {
    // Not implemented: the assessments table has no status column yet.
    return true;
  },

  async updatePdfUrl(_id: string, _pdfUrl: string): Promise<boolean> {
    // Not implemented: PDFs are generated client-side by jsPDF.
    return true;
  }
};

export const serviceUserApi = {
  async getById(id: string): Promise<ServiceUser | null> {
    if (!isRecordId(id)) {
      console.error('Refusing to read a service user: malformed id.');
      return null;
    }

    const validId = id;

    const { data, error } = await supabase
      .from('service_users')
      .select('*')
      .eq('id', validId)
      .single();

    if (error) {
      console.error('Error fetching service user:', error);
      return null;
    }

    return data as ServiceUser;
  },

  async getList(): Promise<ServiceUser[]> {
    // Return empty array to avoid database queries
    return [];
  },

  async create(userData: Omit<ServiceUser, 'id' | 'created_at' | 'updated_at'>): Promise<ServiceUser | null> {
    const { data, error } = await supabase
      .from('service_users')
      .insert(userData)
      .select()
      .single();

    if (error) {
      console.error('Error creating service user:', error);
      return null;
    }

    return data as ServiceUser;
  }
};

// Storage functions
export const storageApi = {
  async uploadFile(
    bucket: 'care-files',
    filePath: string,
    file: File
  ): Promise<string | null> {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file);

    if (error) {
      console.error('Error uploading file:', error);
      return null;
    }

    return data.path;
  },

  getFileUrl(bucket: 'care-files', filePath: string): string {
    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    return data.publicUrl;
  },

  async deleteFile(
    bucket: 'care-files',
    filePath: string
  ): Promise<boolean> {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([filePath]);

    if (error) {
      console.error('Error deleting file:', error);
      return false;
    }

    return true;
  }
};
