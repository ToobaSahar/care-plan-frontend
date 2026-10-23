import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { Assessment, AssessmentData, SectionKey } from '../schema/assessment';
import { assessmentApi } from '../lib/supabase';

interface AssessmentState {
  // Current assessment
  currentAssessment: Assessment | null;
  isLoading: boolean;
  error: string | null;
  
  // Section management
  currentSection: number;
  sectionProgress: Record<string, boolean>;
  
  // Form data
  formData: AssessmentData;
  hasUnsavedChanges: boolean;
  
  // Actions
  setCurrentAssessment: (assessment: Assessment | null) => void;
  setCurrentSection: (section: number) => void;
  updateSectionData: (sectionKey: SectionKey, data: Partial<AssessmentData[SectionKey]>) => void;
  markSectionComplete: (sectionNumber: number, completed: boolean) => void;
  saveSection: (sectionKey: SectionKey) => Promise<boolean>;
  autosave: () => Promise<void>;
  resetForm: () => void;
  clearError: () => void;
  
  // Assessment operations
  createAssessment: (serviceUserId: string, assessorName: string, assessmentDate: string) => Promise<Assessment | null>;
  loadAssessment: (id: string) => Promise<void>;
  updateAssessmentStatus: (status: string) => Promise<boolean>;
  generatePdf: () => Promise<string | null>;
}

/**
 * The blank form: every section, every field it can hold.
 *
 * This is the shape, not just a starting value. `mergeFormData` overlays a
 * loaded record onto it so an unanswered field arrives as an empty string
 * rather than `undefined`, which is what keeps an input from flipping from
 * controlled to uncontrolled mid-edit — so a field missing from here is a
 * field with no default anywhere. Seven of Daily Living's notes fields were
 * absent while the schema, the section and the table all carried them.
 */
const initialFormData: AssessmentData = {
  personalDetails: {
    full_name: '',
    date_of_birth: '',
    nhs_number: '',
    local_authority_number: '',
    preferred_name: '',
    address_line: '',
    postcode: '',
    phone_number: '',
    gp_name: '',
    gp_contact: '',
    emergency_contact_name: '',
    emergency_contact_number: '',
    relationship_to_service_user: ''
  },
  basicDetails: {
    communication_needs: '',
    communication_aids: '',
    language_spoken: '',
    religion_beliefs: '',
    ethnicity: '',
    cultural_preferences: '',
    consent_for_sharing_info: undefined,
    capacity_for_care_decisions: undefined,
    access_to_accommodation: '',
    key_safe: undefined,
    who_opens_the_door: '',
    lifeline_in_place: undefined
  },
  healthWellbeing: {
    primary_diagnosis: '',
    other_health_conditions: '',
    allergies: '',
    medication: '',
    gp_involvement: '',
    specialist_support: '',
    mental_health_concerns: '',
    cognition: ''
  },
  dailyLiving: {
    mobility: undefined,
    mobility_notes: '',
    transfers: '',
    transfers_notes: '',
    falls_risk: undefined,
    falls_risk_notes: '',
    eating_drinking: '',
    eating_drinking_notes: '',
    personal_care: undefined,
    personal_care_notes: '',
    continence: undefined,
    continence_notes: '',
    sleep_pattern: undefined,
    sleep_pattern_notes: '',
    communication_mode: undefined,
    communication_notes: ''
  },
  risksSafeguarding: {
    risk_of_falls: undefined,
    risk_of_falls_notes: '',
    choking_risk: undefined,
    choking_risk_notes: '',
    pressure_sores_skin: undefined,
    pressure_sores_skin_notes: '',
    self_neglect: undefined,
    self_neglect_notes: '',
    medication_risk_assessment: '',
    safeguarding_concerns: undefined,
    safeguarding_concerns_notes: '',
    mental_capacity_dols: '',
    personal_evacuation_plan: undefined,
    personal_evacuation_plan_notes: ''
  },
  socialEmotional: {
    family_involvement_notes: '',
    hobbies_interests_notes: '',
    routine_preferences_notes: '',
    spiritual_religious_support_notes: '',
    emotional_mental_health_support_needs_notes: ''
  },
  environmentLifestyle: {
    living_arrangements_notes: '',
    pets_notes: '',
    smoking_alcohol_notes: '',
    community_access_notes: '',
    transport_needs_notes: '',
    hoarding_clutter_notes: ''
  },
  advancePreferences: {
    dnacpr_in_place: undefined,
    dnacpr_in_place_notes: '',
    respect_form_in_place: undefined,
    respect_form_in_place_notes: '',
    advance_care_plan_wishes: '',
    advance_care_plan_wishes_notes: '',
    power_of_attorney: '',
    power_of_attorney_notes: ''
  },
  optionalAreas: {
    financial_management_needs: '',
    equality_diversity_inclusion_edi_considerations: '',
    assistive_technology_equipment: '',
    legal_orders_or_restrictions: '',
    sexuality_and_relationships: '',
    access_to_advocacy_services: ''
  },
  signatures: {
    assessor_name: '',
    assessor_signature: '',
    assessor_date: '',
    individual_representative_name: '',
    individual_representative_signature: '',
    individual_representative_date: ''
  },
  optionalAttachments: {
    risk_assessments: false,
    dnacpr: false,
    respect_form: false,
    medication_list: false,
    poa_documentation: false,
    peep_evacuation_plan: false,
    communication_passport: false
  }
};

/**
 * Overlays a loaded assessment onto the blank form shape.
 *
 * Every section keeps its full set of keys with their empty-string defaults,
 * and saved answers are layered on top. Without this, a partially completed
 * record hands React `undefined` for unanswered fields.
 */
function mergeFormData(loaded: unknown): AssessmentData {
  if (!loaded || typeof loaded !== 'object') return initialFormData;

  const source = loaded as Record<string, Record<string, unknown> | undefined>;

  return Object.fromEntries(
    Object.entries(initialFormData).map(([section, defaults]) => [
      section,
      { ...(defaults as Record<string, unknown>), ...(source[section] ?? {}) },
    ]),
  ) as AssessmentData;
}

export const useAssessment = create<AssessmentState>()(
  devtools(
    (set, get) => ({
      // Initial state
      currentAssessment: null,
      isLoading: false,
      error: null,
      currentSection: 1,
      sectionProgress: {},
      formData: initialFormData,
      hasUnsavedChanges: false,

      // Actions
      setCurrentAssessment: (assessment) => {
        set({ 
          currentAssessment: assessment,
          formData: initialFormData, // Reset form data when assessment changes
          sectionProgress: {},
          hasUnsavedChanges: false
        });
      },

      setCurrentSection: (section) => {
        set({ currentSection: section });
      },

      updateSectionData: (sectionKey, data) => {
        const currentData = get().formData;
        const updatedData = {
          ...currentData,
          [sectionKey]: {
            ...currentData[sectionKey],
            ...data
          }
        };
        
        set({ 
          formData: updatedData,
          hasUnsavedChanges: true
        });
      },

      markSectionComplete: (sectionNumber, completed) => {
        const currentProgress = get().sectionProgress;
        const updatedProgress = {
          ...currentProgress,
          [sectionNumber.toString()]: completed
        };
        
        set({ sectionProgress: updatedProgress });
      },

      saveSection: async (sectionKey) => {
        const { currentAssessment, formData } = get();
        if (!currentAssessment) return false;

        const sectionData = formData[sectionKey];
        if (!sectionData || Object.keys(sectionData).length === 0) return true;

        // Unanswered fields are left out so an untouched section does not
        // create a row of empty strings. `false` is an answer, not an empty
        // one: it is how an unticked attachment and an explicit "no" are
        // recorded, and dropping it meant a box could be ticked and saved
        // but never unticked again — the stored `true` simply stayed.
        const answered = Object.fromEntries(
          Object.entries(sectionData).filter(
            ([, value]) => value !== null && value !== undefined && value !== '',
          ),
        );

        if (Object.keys(answered).length === 0) return true;

        const success = await assessmentApi.updateSection(
          currentAssessment.id,
          sectionKey,
          answered,
        );

        if (success) {
          set({ hasUnsavedChanges: false });
        } else {
          console.error(`Could not save "${sectionKey}".`);
        }

        return success;
      },

      autosave: async () => {
        const { currentAssessment, formData, hasUnsavedChanges } = get();
        if (!currentAssessment || !hasUnsavedChanges) return;

        try {
          set({ isLoading: true });
          
          // Save all sections with data
          const sectionsToSave = Object.entries(formData).filter(([_, data]) => 
            data && Object.keys(data).length > 0
          );

          for (const [sectionKey, sectionData] of sectionsToSave) {
            await assessmentApi.updateSection(
              currentAssessment.id,
              sectionKey as SectionKey,
              sectionData
            );
          }

          set({ hasUnsavedChanges: false });
        } catch (error) {
          console.error('Autosave failed:', error);
          set({ error: 'Autosave failed' });
        } finally {
          set({ isLoading: false });
        }
      },

      resetForm: () => {
        set({ 
          formData: initialFormData,
          hasUnsavedChanges: false,
          error: null
        });
      },

      clearError: () => {
        set({ error: null });
      },

      // Assessment operations
      createAssessment: async (serviceUserId, assessorName, assessmentDate) => {
        try {
          set({ isLoading: true, error: null });
          
          const assessment = await assessmentApi.create(serviceUserId, assessorName, assessmentDate);
          if (assessment) {
            set({ 
              currentAssessment: assessment,
              formData: initialFormData,
              sectionProgress: {},
              hasUnsavedChanges: false
            });
          }
          
          return assessment;
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to create assessment';
          set({ error: errorMessage });
          return null;
        } finally {
          set({ isLoading: false });
        }
      },

      loadAssessment: async (id) => {
        try {
          set({ isLoading: true, error: null });
          
          const assessment = await assessmentApi.getById(id);
          if (assessment) {
            set({
              currentAssessment: assessment,
              // Overlay saved values onto the defaults rather than replacing
              // them: a loaded section only carries the fields that were
              // answered, and an absent field would otherwise arrive as
              // undefined and flip its input from controlled to uncontrolled.
              formData: mergeFormData(assessment.data),
              sectionProgress: assessment.section_progress || {},
              hasUnsavedChanges: false
            });
          } else {
            /* `getById` opens the record or creates it, so nothing back means
               the record could not be reached at all — a refused policy, a
               malformed id in the URL, a dropped connection.

               This used to substitute a fabricated assessment so the form
               still rendered. The form then worked in every visible respect
               while every save was refused, which is the one outcome a care
               record must never produce. Say so instead; the page offers the
               way back. */
            set({
              currentAssessment: null,
              formData: initialFormData,
              sectionProgress: {},
              hasUnsavedChanges: false,
              error:
                'This assessment could not be opened. Check the link, or go back and open it from the service users list.',
            });
          }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to load assessment';
          set({ error: errorMessage });
        } finally {
          set({ isLoading: false });
        }
      },

      updateAssessmentStatus: async (status) => {
        const { currentAssessment } = get();
        if (!currentAssessment) return false;

        try {
          set({ isLoading: true, error: null });
          
          const success = await assessmentApi.updateStatus(currentAssessment.id, status);
          if (success) {
            set({ 
              currentAssessment: { ...currentAssessment, status: status as any }
            });
          }
          
          return success;
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to update assessment status';
          set({ error: errorMessage });
          return false;
        } finally {
          set({ isLoading: false });
        }
      },

      generatePdf: async () => {
        const { currentAssessment } = get();
        if (!currentAssessment) return null;

        try {
          set({ isLoading: true, error: null });
          
          // This would need to be implemented based on your PDF generation needs
          const saved = await assessmentApi.updatePdfUrl(currentAssessment.id, 'mock-pdf-url');

          // updatePdfUrl reports success; the contract here is the URL itself.
          return saved ? 'mock-pdf-url' : null;
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to generate PDF';
          set({ error: errorMessage });
          return null;
        } finally {
          set({ isLoading: false });
        }
      }
    })
  )
);

// Auto-save effect (debounced)
let autosaveTimeout: NodeJS.Timeout;

export const useAutosave = () => {
  const { autosave, hasUnsavedChanges } = useAssessment();

  const triggerAutosave = () => {
    if (autosaveTimeout) {
      clearTimeout(autosaveTimeout);
    }
    
    autosaveTimeout = setTimeout(() => {
      if (hasUnsavedChanges) {
        autosave();
      }
    }, 800); // 800ms debounce
  };

  return { triggerAutosave };
};

// Computed selectors
export const useAssessmentProgress = () => {
  const { sectionProgress } = useAssessment();
  
  const completedSections = Object.values(sectionProgress).filter(Boolean).length;
  const totalSections = 12;
  const progressPercentage = Math.round((completedSections / totalSections) * 100);
  
  return {
    completedSections,
    totalSections,
    progressPercentage,
    sectionProgress
  };
};

export const useCurrentSectionData = <T extends SectionKey>(sectionKey: T) => {
  const { formData, updateSectionData } = useAssessment();
  
  const updateData = (data: Partial<AssessmentData[T]>) => {
    updateSectionData(sectionKey, data);
    // Removed triggerAutosave() to prevent automatic saving on every input
  };
  
  return {
    data: formData[sectionKey] as AssessmentData[T],
    updateData
  };
};
