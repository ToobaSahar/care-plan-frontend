import { z } from 'zod';

// NHS Number validation (10 digits with Mod 11 checksum)
export const nhsNumberSchema = z
  .string()
  .min(1, "NHS number is required")
  .refine((value) => {
    const clean = value.replace(/\s/g, '');
    if (clean.length !== 10 || !/^\d{10}$/.test(clean)) return false;
    
    // Mod 11 checksum validation
    const digits = clean.split('').map(Number);
    const weights = [10, 9, 8, 7, 6, 5, 4, 3, 2];
    let sum = 0;
    
    for (let i = 0; i < 9; i++) {
      sum += digits[i] * weights[i];
    }
    
    const remainder = sum % 11;
    const checkDigit = remainder === 0 ? 0 : 11 - remainder;
    
    return digits[9] === checkDigit;
  }, "Invalid NHS number format");

// UK Postcode validation
export const ukPostcodeSchema = z
  .string()
  .optional()
  .refine((value) => {
    if (!value) return true; // Optional field
    const postcodeRegex = /^[A-Z]{1,2}[0-9][A-Z0-9]? ?[0-9][A-Z]{2}$/i;
    return postcodeRegex.test(value);
  }, "Invalid UK postcode format");

// Date validation (must be in the past)
export const pastDateSchema = z
  .string()
  .min(1, "Date is required")
  .refine((value) => {
    const date = new Date(value);
    const today = new Date();
    today.setHours(23, 59, 59, 999); // End of today
    return date < today;
  }, "Date must be in the past");

// Section 1: Personal Details (Service User)
export const personalDetailsSchema = z.object({
  full_name: z.string().min(1, "Full name is required"),
  date_of_birth: pastDateSchema,
  nhs_number: nhsNumberSchema,
  local_authority_number: z.string().optional(),
  preferred_name: z.string().optional(),
  address_line: z.string().min(1, "Address is required"),
  postcode: ukPostcodeSchema,
  phone_number: z.string().min(1, "Phone number is required"),
  gp_name: z.string().optional(),
  gp_contact: z.string().optional(),
  emergency_contact_name: z.string().min(1, "Emergency contact name is required"),
  emergency_contact_number: z.string().min(1, "Emergency contact phone is required"),
  relationship_to_service_user: z.string().min(1, "Relationship is required")
});

// Section 2: Basic Details
export const basicDetailsSchema = z.object({
  communication_needs: z.string().optional(),
  communication_aids: z.string().optional(),
  language_spoken: z.string().optional(),
  religion_beliefs: z.string().optional(),
  ethnicity: z.string().optional(),
  cultural_preferences: z.string().optional(),
  consent_for_sharing_info: z.enum(['yes', 'no']).optional(),
  capacity_for_care_decisions: z.enum(['yes', 'no', 'requires_assessment']).optional(),
  access_to_accommodation: z.string().optional(),
  key_safe: z.enum(['yes', 'no']).optional(),
  who_opens_the_door: z.string().optional(),
  lifeline_in_place: z.enum(['yes', 'no']).optional()
});

// Section 3: Health & Wellbeing
export const healthWellbeingSchema = z.object({
  primary_diagnosis: z.string().optional(),
  other_health_conditions: z.string().optional(),
  allergies: z.string().optional(),
  medication: z.string().optional(),
  gp_involvement: z.string().optional(),
  specialist_support: z.string().optional(), // SALT, OT, MH
  mental_health_concerns: z.string().optional(),
  cognition: z.string().optional() // e.g., Dementia
});

// Section 4: Daily Living
export const dailyLivingSchema = z.object({
  mobility: z.enum(['independent', 'aided', 'hoist']).optional(),
  mobility_notes: z.string().optional(),
  transfers: z.string().optional(),
  transfers_notes: z.string().optional(),
  falls_risk: z.enum(['yes', 'no']).optional(),
  falls_risk_notes: z.string().optional(),
  eating_drinking: z.string().optional(),
  eating_drinking_notes: z.string().optional(),
  personal_care: z.enum(['independent', 'partial_support', 'full_support']).optional(),
  personal_care_notes: z.string().optional(),
  continence: z.enum(['pads', 'toilet', 'catheter', 'incontinent']).optional(),
  continence_notes: z.string().optional(),
  sleep_pattern: z.enum(['normal', 'disturbed', 'needs_checks']).optional(),
  sleep_pattern_notes: z.string().optional(),
  communication_mode: z.enum(['verbal', 'non_verbal', 'hearing_aids']).optional(),
  communication_notes: z.string().optional()
});

// Section 5: Risks & Safeguarding
export const risksSafeguardingSchema = z.object({
  risk_of_falls: z.enum(['yes', 'no']).optional(),
  risk_of_falls_notes: z.string().optional(),
  
  choking_risk: z.enum(['yes', 'no']).optional(),
  choking_risk_notes: z.string().optional(),
  
  pressure_sores_skin: z.enum(['yes', 'no']).optional(),
  pressure_sores_skin_notes: z.string().optional(),
  
  self_neglect: z.enum(['yes', 'no']).optional(),
  self_neglect_notes: z.string().optional(),
  
  medication_risk_assessment: z.string().optional(),
  
  safeguarding_concerns: z.enum(['yes', 'no']).optional(),
  safeguarding_concerns_notes: z.string().optional(),
  
  mental_capacity_dols: z.string().optional(),
  
  personal_evacuation_plan: z.enum(['yes', 'no']).optional(),
  personal_evacuation_plan_notes: z.string().optional()
});

// Section 6: Social & Emotional Wellbeing
export const socialEmotionalSchema = z.object({
  family_involvement_notes: z.string().optional(),
  hobbies_interests_notes: z.string().optional(),
  routine_preferences_notes: z.string().optional(),
  spiritual_religious_support_notes: z.string().optional(),
  emotional_mental_health_support_needs_notes: z.string().optional()
});

// Section 7: Environment & Lifestyle
export const environmentLifestyleSchema = z.object({
  living_arrangements_notes: z.string().optional(),
  pets_notes: z.string().optional(),
  smoking_alcohol_notes: z.string().optional(),
  community_access_notes: z.string().optional(),
  transport_needs_notes: z.string().optional(),
  hoarding_clutter_notes: z.string().optional()
});

// Section 8: Advance Preferences
export const advancePreferencesSchema = z.object({
  dnacpr_in_place: z.enum(['yes', 'no']).optional(),
  dnacpr_in_place_notes: z.string().optional(),
  respect_form_in_place: z.enum(['yes', 'no']).optional(),
  respect_form_in_place_notes: z.string().optional(),
  advance_care_plan_wishes: z.string().optional(),
  advance_care_plan_wishes_notes: z.string().optional(),
  power_of_attorney: z.string().optional(),
  power_of_attorney_notes: z.string().optional()
});

// Section 9: Optional Areas
export const optionalAreasSchema = z.object({
  financial_management_needs: z.string().optional(),
  equality_diversity_inclusion_edi_considerations: z.string().optional(),
  assistive_technology_equipment: z.string().optional(),
  legal_orders_or_restrictions: z.string().optional(),
  sexuality_and_relationships: z.string().optional(),
  access_to_advocacy_services: z.string().optional()
});

// Section 10: Signatures
export const signaturesSchema = z.object({
  assessor_name: z.string().optional(),
  assessor_signature: z.string().optional(),
  assessor_date: z.string().optional(),
  individual_representative_name: z.string().optional(),
  individual_representative_signature: z.string().optional(),
  individual_representative_date: z.string().optional()
});

// Optional Attachments
export const optionalAttachmentsSchema = z.object({
  risk_assessments: z.boolean().optional(),
  dnacpr: z.boolean().optional(),
  respect_form: z.boolean().optional(),
  medication_list: z.boolean().optional(),
  poa_documentation: z.boolean().optional(),
  peep_evacuation_plan: z.boolean().optional(),
  communication_passport: z.boolean().optional()
});

// Complete assessment data schema
export const assessmentDataSchema = z.object({
  personalDetails: personalDetailsSchema,
  basicDetails: basicDetailsSchema,
  healthWellbeing: healthWellbeingSchema,
  dailyLiving: dailyLivingSchema,
  risksSafeguarding: risksSafeguardingSchema,
  socialEmotional: socialEmotionalSchema,
  environmentLifestyle: environmentLifestyleSchema,
  advancePreferences: advancePreferencesSchema,
  optionalAreas: optionalAreasSchema,
  signatures: signaturesSchema,
  optionalAttachments: optionalAttachmentsSchema
});

// Type exports
export type PersonalDetails = z.infer<typeof personalDetailsSchema>;
export type BasicDetails = z.infer<typeof basicDetailsSchema>;
export type HealthWellbeing = z.infer<typeof healthWellbeingSchema>;
export type DailyLiving = z.infer<typeof dailyLivingSchema>;
export type RisksSafeguarding = z.infer<typeof risksSafeguardingSchema>;
export type SocialEmotional = z.infer<typeof socialEmotionalSchema>;
export type EnvironmentLifestyle = z.infer<typeof environmentLifestyleSchema>;
export type AdvancePreferences = z.infer<typeof advancePreferencesSchema>;
export type OptionalAreas = z.infer<typeof optionalAreasSchema>;
export type Signatures = z.infer<typeof signaturesSchema>;
export type OptionalAttachments = z.infer<typeof optionalAttachmentsSchema>;
export type AssessmentData = z.infer<typeof assessmentDataSchema>;

// Section keys for type safety
export const SECTION_KEYS = [
  'personalDetails',
  'basicDetails', 
  'healthWellbeing',
  'dailyLiving',
  'risksSafeguarding',
  'socialEmotional',
  'environmentLifestyle',
  'advancePreferences',
  'optionalAreas',
  'signatures',
  'optionalAttachments'
] as const;

export type SectionKey = typeof SECTION_KEYS[number];

// Assessment interface for database
export interface Assessment {
  id: string;
  service_user_id: string;
  assessor_name: string;
  assessment_date: string;
  status?: 'draft' | 'in_review' | 'completed' | 'locked';
  created_at: string;
  updated_at: string;
}

// Service User interface for database
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
  created_at: string;
  updated_at: string;
}

// Validation utilities
export const validateNhsNumber = (nhsNumber: string): boolean => {
  try {
    nhsNumberSchema.parse(nhsNumber);
    return true;
  } catch {
    return false;
  }
};

export const validateUkPostcode = (postcode: string): boolean => {
  try {
    ukPostcodeSchema.parse(postcode);
    return true;
  } catch {
    return false;
  }
};

export const validatePastDate = (date: string): boolean => {
  try {
    pastDateSchema.parse(date);
    return true;
  } catch {
    return false;
  }
};
