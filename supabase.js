import { createClient } from '@supabase/supabase-js'

// These would typically be environment variables
// For demo purposes, using placeholder values
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://your-project.supabase.co'
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'your-anon-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database schema for care assessment form
export const createCareAssessmentTable = async () => {
  const { data, error } = await supabase.rpc('create_care_assessment_table')
  if (error) {
    console.error('Error creating table:', error)
    return false
  }
  return true
}

// Insert care assessment data
export const insertCareAssessment = async (formData) => {
  try {
    const { data, error } = await supabase
      .from('care_assessments')
      .insert([
        {
          // Section 1: Personal Details
          full_name: formData.fullName,
          date_of_birth: formData.dateOfBirth,
          nhs_number: formData.nhsNumber,
          local_authority_number: formData.localAuthorityNumber,
          preferred_name: formData.preferredName,
          address: formData.address,
          postcode: formData.postcode,
          phone_number: formData.phoneNumber,
          gp_name_contact: formData.gpNameContact,
          emergency_contact_name: formData.emergencyContactName,
          emergency_contact_number: formData.emergencyContactNumber,
          relationship_to_service_user: formData.relationshipToServiceUser,
          
          // Section 2: Basic Details
          communication_needs: formData.communicationNeeds,
          communication_aids: formData.communicationAids,
          language_spoken: formData.languageSpoken,
          religion: formData.religion,
          ethnicity: formData.ethnicity,
          cultural_preferences: formData.culturalPreferences,
          consent_for_sharing_info: formData.consentForSharingInfo,
          capacity_for_care_decisions: formData.capacityForCareDecisions,
          access_to_accommodation: formData.accessToAccommodation,
          key_safe: formData.keySafe,
          who_opens_the_door: formData.whoOpensTheDoor,
          lifeline_in_place: formData.lifelineInPlace,
          
          // Section 3: Health and Wellbeing
          primary_diagnosis: formData.primaryDiagnosis,
          other_health_conditions: formData.otherHealthConditions,
          allergies: formData.allergies,
          medication: formData.medication,
          gp_involvement: formData.gpInvolvement,
          specialist_support: formData.specialistSupport,
          mental_health_concerns: formData.mentalHealthConcerns,
          cognition: formData.cognition,
          
          // Section 4: Daily Living
          mobility: formData.mobility,
          transfers: formData.transfers,
          falls_risk: formData.fallsRisk,
          eating_drinking: formData.eatingDrinking,
          personal_care: formData.personalCare,
          continence: formData.continence,
          sleep: formData.sleep,
          communication: formData.communication,
          
          // Section 5: Risks & Safeguarding
          risk_of_falls: formData.riskOfFalls,
          choking_risk: formData.chokingRisk,
          pressure_sores_skin: formData.pressureSoresSkin,
          self_neglect: formData.selfNeglect,
          medication_risk_assessment: formData.medicationRiskAssessment,
          safeguarding_concerns: formData.safeguardingConcerns,
          mental_capacity_dols: formData.mentalCapacityDols,
          personal_evacuation_plan: formData.personalEvacuationPlan,
          
          // Section 6: Social & Emotional Wellbeing
          family_involvement: formData.familyInvolvement,
          hobbies_interests: formData.hobbiesInterests,
          routine_preferences: formData.routinePreferences,
          spiritual_religious_support: formData.spiritualReligiousSupport,
          emotional_mental_health_support: formData.emotionalMentalHealthSupport,
          
          // Section 7: Environment & Lifestyle
          living_arrangements: formData.livingArrangements,
          pets: formData.pets,
          smoking_alcohol: formData.smokingAlcohol,
          community_access: formData.communityAccess,
          transport_needs: formData.transportNeeds,
          hoarding_clutter: formData.hoardingClutter,
          
          // Section 8: Advance Preferences
          dnacpr_in_place: formData.dnacprInPlace,
          respect_form_in_place: formData.respectFormInPlace,
          advance_care_plan: formData.advanceCarePlan,
          power_of_attorney: formData.powerOfAttorney,
          
          // Section 9: Optional Areas
          financial_management_needs: formData.financialManagementNeeds,
          edi_considerations: formData.ediConsiderations,
          assistive_technology: formData.assistiveTechnology,
          legal_orders_restrictions: formData.legalOrdersRestrictions,
          sexuality_relationships: formData.sexualityRelationships,
          access_to_advocacy_services: formData.accessToAdvocacyServices,
          
          // Section 10: Signatures
          assessor_name: formData.assessorName,
          assessor_signature: formData.assessorSignature,
          assessor_date: formData.assessorDate,
          individual_representative_name: formData.individualRepresentativeName,
          individual_representative_signature: formData.individualRepresentativeSignature,
          individual_representative_date: formData.individualRepresentativeDate,
          
          // Metadata
          form_version: '2.0',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ])
      .select()

    if (error) {
      console.error('Error inserting data:', error)
      throw error
    }

    return { success: true, data }
  } catch (error) {
    console.error('Error in insertCareAssessment:', error)
    return { success: false, error: error.message }
  }
}

// Get all care assessments
export const getCareAssessments = async () => {
  try {
    const { data, error } = await supabase
      .from('care_assessments')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching data:', error)
      throw error
    }

    return { success: true, data }
  } catch (error) {
    console.error('Error in getCareAssessments:', error)
    return { success: false, error: error.message }
  }
}

// Update care assessment
export const updateCareAssessment = async (id, formData) => {
  try {
    const { data, error } = await supabase
      .from('care_assessments')
      .update({
        ...formData,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()

    if (error) {
      console.error('Error updating data:', error)
      throw error
    }

    return { success: true, data }
  } catch (error) {
    console.error('Error in updateCareAssessment:', error)
    return { success: false, error: error.message }
  }
}

// Delete care assessment
export const deleteCareAssessment = async (id) => {
  try {
    const { error } = await supabase
      .from('care_assessments')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting data:', error)
      throw error
    }

    return { success: true }
  } catch (error) {
    console.error('Error in deleteCareAssessment:', error)
    return { success: false, error: error.message }
  }
}

