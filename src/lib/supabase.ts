import { createClient } from '@supabase/supabase-js';
import type { AssessmentData, SectionKey } from '../schema/assessment';

const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL;
const supabaseAnonKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY || (import.meta as any).env.VITE_SUPABASE_PUBLISHABLE_KEY;

// Debug logging
console.log('🔧 Supabase Configuration:');
console.log('URL:', supabaseUrl);
console.log('Key exists:', !!supabaseAnonKey);

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase environment variables!');
  console.error('Please check your .env.local file has VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY');
}

// ----------------------
// Supabase client
// ----------------------
export const supabase = createClient(supabaseUrl as string, supabaseAnonKey as string);

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
    try {
      // Generate a proper UUID if the ID is not a valid UUID
      let assessmentId = id;
      if (!id.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
        // Generate a UUID v4
        assessmentId = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
          const r = Math.random() * 16 | 0;
          const v = c == 'x' ? r : (r & 0x3 | 0x8);
          return v.toString(16);
        });
        console.log('Generated UUID for assessment:', assessmentId);
      }

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

      // If assessment doesn't exist, create a new one with the generated UUID (but don't create service user yet)
      console.log('Creating new assessment with ID:', assessmentId);
      const { data: newAssessment, error: createError } = await supabase
        .from('assessments')
        .insert({
          id: assessmentId,
          service_user_id: assessmentId, // Use the same ID for both
          assessor_name: 'Care Assessor',
          assessment_date: new Date().toISOString().split('T')[0],
          created_by: '00000000-0000-0000-0000-000000000000' // Use a dummy UUID to avoid foreign key constraint
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
        created_by: '00000000-0000-0000-0000-000000000000' // Use a dummy UUID to avoid foreign key constraint
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

  async createWithId(id: string, serviceUserId: string, assessorName: string, assessmentDate: string): Promise<Assessment | null> {
    try {
      // Ensure we have a valid UUID
      let assessmentId = id;
      if (!id.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
        // Generate a UUID v4
        assessmentId = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
          const r = Math.random() * 16 | 0;
          const v = c == 'x' ? r : (r & 0x3 | 0x8);
          return v.toString(16);
        });
        console.log('Generated UUID for createWithId:', assessmentId);
      }

      // Create the assessment (service user will be created when form data is saved)
      const { data, error } = await supabase
        .from('assessments')
        .insert({
          id: assessmentId,
          service_user_id: assessmentId, // Use the same ID for both
          assessor_name: assessorName,
          assessment_date: assessmentDate,
          created_by: '00000000-0000-0000-0000-000000000000' // Use a dummy UUID to avoid foreign key constraint
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
    try {
      // Ensure we have a valid UUID
      let validAssessmentId = assessmentId;
      if (!assessmentId.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
        // Generate a UUID v4
        validAssessmentId = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
          const r = Math.random() * 16 | 0;
          const v = c == 'x' ? r : (r & 0x3 | 0x8);
          return v.toString(16);
        });
        console.log('Generated UUID for updateSection:', validAssessmentId);
      }

      // Map sections to tables
      const tableMap: Record<string, string> = {
        'personalDetails': 'service_users',
        'basicDetails': 'basic_details',
        'healthWellbeing': 'health_wellbeing',
        'dailyLiving': 'daily_living',
        'risksSafeguarding': 'risks_safeguarding',
        'socialEmotional': 'social_emotional',
        'environmentLifestyle': 'environment_lifestyle',
        'advancePreferences': 'advance_preferences',
        'optionalAreas': 'optional_areas',
        'signatures': 'signatures',
        'optionalAttachments': 'optional_attachments'
      };

      const tableName = tableMap[sectionKey];
      if (!tableName) return false;

      // Try to update the section data
      let error;
      
      if (sectionKey === 'personalDetails') {
        // For personal details, we need to create or update the service user
        console.log('🔍 Debug: sectionData received:', sectionData);
        console.log('🔍 Debug: relationship_to_service_user value:', sectionData.relationship_to_service_user);
        
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
          // Update existing service user
          console.log('🔍 Debug: Updating existing service user with data:', sectionData);
          console.log('🔍 Debug: All form fields being updated:');
          Object.keys(sectionData).forEach(key => {
            console.log(`  ${key}: "${sectionData[key]}"`);
          });
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
            created_by: '00000000-0000-0000-0000-000000000000' // Use a dummy UUID to avoid foreign key constraint
          };
          
          console.log('🔍 Debug: Creating new service user with data:', serviceUserData);
          console.log('🔍 Debug: All form fields being created:');
          Object.keys(serviceUserData).forEach(key => {
            if (key !== 'id' && key !== 'created_by') {
              console.log(`  ${key}: "${(serviceUserData as any)[key]}"`);
            }
          });
          
          const { error: insertError } = await supabase
            .from('service_users')
            .insert(serviceUserData);
          error = insertError;
        }
      } else {
        // Update section data - only if there's actual data to save
        if (sectionData && Object.keys(sectionData).length > 0) {
          // Check if there's any non-empty data
          const hasData = Object.values(sectionData).some(value => 
            value !== null && value !== undefined && value !== ''
          );
          
          if (hasData) {
            console.log(`🔍 Debug: Saving ${sectionKey} data to ${tableName}:`, sectionData);
            const { error: upsertError } = await supabase
              .from(tableName)
              .upsert({ assessment_id: validAssessmentId, ...sectionData });
            error = upsertError;
          } else {
            console.log(`🔍 Debug: No data to save for ${sectionKey}, skipping database operation`);
            return true; // Return true since there's nothing to save
          }
        } else {
          console.log(`🔍 Debug: No sectionData provided for ${sectionKey}, skipping database operation`);
          return true; // Return true since there's nothing to save
        }
      }

      if (error) {
        console.error(`Error updating ${sectionKey}:`, error);
        return false;
      }

      console.log(`✅ Successfully updated ${sectionKey} for assessment ${validAssessmentId}`);
      return true;
    } catch (error) {
      console.error('Unexpected error in updateSection:', error);
      return false;
    }
  },

  async updateSectionProgress(id: string, sectionNumber: number, completed: boolean): Promise<boolean> {
    // This would need to be implemented based on your progress tracking needs
    return true;
  },

  async updateStatus(id: string, status: string): Promise<boolean> {
    // This would need to be implemented based on your status tracking needs
    return true;
  },

  async updatePdfUrl(id: string, pdfUrl: string): Promise<boolean> {
    // This would need to be implemented based on your PDF storage needs
    return true;
  }
};

export const serviceUserApi = {
  async getById(id: string): Promise<ServiceUser | null> {
    // Ensure we have a valid UUID
    let validId = id;
    if (!id.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
      // Generate a UUID v4
      validId = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
      console.log('Generated UUID for serviceUserApi.getById:', validId);
    }

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
