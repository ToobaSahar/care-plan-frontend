import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText, Lock, Download, MessageSquare, Paperclip, PenTool, ChevronLeft, ChevronRight } from 'lucide-react';
// Removed AutosaveBadge import since we're disabling autosave functionality
import { Section1Personal } from '../components/forms/Section1Personal';
import { Section2Basic } from '../components/forms/Section2Basic';
import { Section3Health } from '../components/forms/Section3Health';
import { Section4DailyLiving } from '../components/forms/Section4DailyLiving';
import { Section5RisksSafeguarding } from '../components/forms/Section5SocialSupport';
import { Section6SocialEmotionalWellbeing } from '../components/forms/Section6Environment';
import { Section7EnvironmentLifestyle } from '../components/forms/Section7Financial';
import { Section8AdvancePreferences } from '../components/forms/Section8Financial';
import { Section9OptionalAreas } from '../components/forms/Section9Financial';
import { Section10Summary } from '../components/forms/Section10Summary';
import { AttachmentUploader } from '../components/AttachmentUploader';
import { SignaturePad } from '../components/SignaturePad';
import { ChatPanel, ChatButton } from '../components/Chat/ChatPanel';

import { useAssessment } from '../state/useAssessment';
import { assessmentApi } from '../lib/supabase';
import { carePlanAPI } from '../lib/carePlanApi';

export const AssessmentPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [showCompletionMessage, setShowCompletionMessage] = useState(false);

  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [isGeneratingCarePlan, setIsGeneratingCarePlan] = useState(false);
  
  const {
    currentAssessment,
    currentSection,
    isLoading,
    error,
    formData,
    setCurrentSection,
    loadAssessment,
    updateAssessmentStatus,
    generatePdf,
    saveSection
  } = useAssessment();

  // Load assessment on mount
  useEffect(() => {
    if (id) {
      loadAssessment(id);
    }
  }, [id, loadAssessment]);

  // Validation function to check required fields for each section
  const validateCurrentSection = (): boolean => {
    const errors: string[] = [];
    
    switch (currentSection) {
      case 1: // Personal Details - all fields are required
        const personalDetails = formData.personalDetails;
        if (!personalDetails.full_name?.trim()) errors.push('Full name is required');
        if (!personalDetails.date_of_birth?.trim()) errors.push('Date of birth is required');
        if (!personalDetails.nhs_number?.trim()) errors.push('NHS number is required');
        if (!personalDetails.address_line?.trim()) errors.push('Address is required');
        if (!personalDetails.phone_number?.trim()) errors.push('Phone number is required');
        if (!personalDetails.emergency_contact_name?.trim()) errors.push('Emergency contact name is required');
        if (!personalDetails.emergency_contact_number?.trim()) errors.push('Emergency contact phone is required');
        if (!personalDetails.relationship_to_service_user?.trim()) errors.push('Relationship to service user is required');
        break;
        
      case 2: // Basic Details - all fields are required
        const basicDetails = formData.basicDetails;
        if (!basicDetails.communication_needs?.trim()) errors.push('Communication needs is required');
        if (!basicDetails.communication_aids?.trim()) errors.push('Communication aids is required');
        if (!basicDetails.language_spoken?.trim()) errors.push('Language spoken is required');
        if (!basicDetails.religion_beliefs?.trim()) errors.push('Religion beliefs is required');
        if (!basicDetails.ethnicity?.trim()) errors.push('Ethnicity is required');
        if (!basicDetails.cultural_preferences?.trim()) errors.push('Cultural preferences is required');
        if (!basicDetails.consent_for_sharing_info) errors.push('Consent for sharing info is required');
        if (!basicDetails.capacity_for_care_decisions) errors.push('Capacity for care decisions is required');
        if (!basicDetails.access_to_accommodation?.trim()) errors.push('Access to accommodation is required');
        if (!basicDetails.key_safe) errors.push('Key safe is required');
        if (!basicDetails.who_opens_the_door?.trim()) errors.push('Who opens the door is required');
        if (!basicDetails.lifeline_in_place) errors.push('Lifeline in place is required');
        break;
        
      case 3: // Health & Wellbeing - all fields are required
        const healthWellbeing = formData.healthWellbeing;
        if (!healthWellbeing.primary_diagnosis?.trim()) errors.push('Primary diagnosis is required');
        if (!healthWellbeing.other_health_conditions?.trim()) errors.push('Other health conditions is required');
        if (!healthWellbeing.allergies?.trim()) errors.push('Allergies is required');
        if (!healthWellbeing.medication?.trim()) errors.push('Medication is required');
        if (!healthWellbeing.gp_involvement?.trim()) errors.push('GP involvement is required');
        if (!healthWellbeing.specialist_support?.trim()) errors.push('Specialist support is required');
        if (!healthWellbeing.mental_health_concerns?.trim()) errors.push('Mental health concerns is required');
        if (!healthWellbeing.cognition?.trim()) errors.push('Cognition is required');
        break;
        
      case 4: // Daily Living - all fields are required
        const dailyLiving = formData.dailyLiving;
        if (!dailyLiving.mobility) errors.push('Mobility is required');
        if (!dailyLiving.mobility_notes?.trim()) errors.push('Mobility notes is required');
        if (!dailyLiving.transfers?.trim()) errors.push('Transfers is required');
        if (!dailyLiving.transfers_notes?.trim()) errors.push('Transfers notes is required');
        if (!dailyLiving.falls_risk) errors.push('Falls risk is required');
        if (!dailyLiving.falls_risk_notes?.trim()) errors.push('Falls risk notes is required');
        if (!dailyLiving.eating_drinking?.trim()) errors.push('Eating drinking is required');
        if (!dailyLiving.eating_drinking_notes?.trim()) errors.push('Eating drinking notes is required');
        if (!dailyLiving.personal_care) errors.push('Personal care is required');
        if (!dailyLiving.personal_care_notes?.trim()) errors.push('Personal care notes is required');
        if (!dailyLiving.continence) errors.push('Continence is required');
        if (!dailyLiving.continence_notes?.trim()) errors.push('Continence notes is required');
        if (!dailyLiving.sleep_pattern) errors.push('Sleep pattern is required');
        if (!dailyLiving.sleep_pattern_notes?.trim()) errors.push('Sleep pattern notes is required');
        if (!dailyLiving.communication_mode) errors.push('Communication mode is required');
        if (!dailyLiving.communication_notes?.trim()) errors.push('Communication notes is required');
        break;
        
      case 5: // Risks & Safeguarding - all fields are required
        const risksSafeguarding = formData.risksSafeguarding;
        if (!risksSafeguarding.risk_of_falls) errors.push('Risk of falls is required');
        if (!risksSafeguarding.risk_of_falls_notes?.trim()) errors.push('Risk of falls notes is required');
        if (!risksSafeguarding.choking_risk) errors.push('Choking risk is required');
        if (!risksSafeguarding.choking_risk_notes?.trim()) errors.push('Choking risk notes is required');
        if (!risksSafeguarding.pressure_sores_skin) errors.push('Pressure sores skin is required');
        if (!risksSafeguarding.pressure_sores_skin_notes?.trim()) errors.push('Pressure sores skin notes is required');
        if (!risksSafeguarding.self_neglect) errors.push('Self neglect is required');
        if (!risksSafeguarding.self_neglect_notes?.trim()) errors.push('Self neglect notes is required');
        if (!risksSafeguarding.medication_risk_assessment?.trim()) errors.push('Medication risk assessment is required');
        if (!risksSafeguarding.safeguarding_concerns) errors.push('Safeguarding concerns is required');
        if (!risksSafeguarding.safeguarding_concerns_notes?.trim()) errors.push('Safeguarding concerns notes is required');
        if (!risksSafeguarding.mental_capacity_dols?.trim()) errors.push('Mental capacity DOLS is required');
        if (!risksSafeguarding.personal_evacuation_plan) errors.push('Personal evacuation plan is required');
        if (!risksSafeguarding.personal_evacuation_plan_notes?.trim()) errors.push('Personal evacuation plan notes is required');
        break;
        
      case 6: // Social & Emotional Wellbeing - all fields are required
        const socialEmotional = formData.socialEmotional;
        if (!socialEmotional.family_involvement_notes?.trim()) errors.push('Family involvement notes is required');
        if (!socialEmotional.hobbies_interests_notes?.trim()) errors.push('Hobbies interests notes is required');
        if (!socialEmotional.routine_preferences_notes?.trim()) errors.push('Routine preferences notes is required');
        if (!socialEmotional.spiritual_religious_support_notes?.trim()) errors.push('Spiritual religious support notes is required');
        if (!socialEmotional.emotional_mental_health_support_needs_notes?.trim()) errors.push('Emotional mental health support needs notes is required');
        break;
        
      case 7: // Environment & Lifestyle - all fields are required
        const environmentLifestyle = formData.environmentLifestyle;
        if (!environmentLifestyle.living_arrangements_notes?.trim()) errors.push('Living arrangements notes is required');
        if (!environmentLifestyle.pets_notes?.trim()) errors.push('Pets notes is required');
        if (!environmentLifestyle.smoking_alcohol_notes?.trim()) errors.push('Smoking alcohol notes is required');
        if (!environmentLifestyle.community_access_notes?.trim()) errors.push('Community access notes is required');
        if (!environmentLifestyle.transport_needs_notes?.trim()) errors.push('Transport needs notes is required');
        if (!environmentLifestyle.hoarding_clutter_notes?.trim()) errors.push('Hoarding clutter notes is required');
        break;
        
      case 8: // Advance Preferences - all fields are required
        const advancePreferences = formData.advancePreferences;
        if (!advancePreferences.dnacpr_in_place) errors.push('DNACPR in place is required');
        if (!advancePreferences.dnacpr_in_place_notes?.trim()) errors.push('DNACPR in place notes is required');
        if (!advancePreferences.respect_form_in_place) errors.push('Respect form in place is required');
        if (!advancePreferences.respect_form_in_place_notes?.trim()) errors.push('Respect form in place notes is required');
        if (!advancePreferences.advance_care_plan_wishes?.trim()) errors.push('Advance care plan wishes is required');
        if (!advancePreferences.advance_care_plan_wishes_notes?.trim()) errors.push('Advance care plan wishes notes is required');
        if (!advancePreferences.power_of_attorney?.trim()) errors.push('Power of attorney is required');
        if (!advancePreferences.power_of_attorney_notes?.trim()) errors.push('Power of attorney notes is required');
        break;
        
      case 9: // Optional Areas - all fields are required
        const optionalAreas = formData.optionalAreas;
        if (!optionalAreas.financial_management_needs?.trim()) errors.push('Financial management needs is required');
        if (!optionalAreas.equality_diversity_inclusion_edi_considerations?.trim()) errors.push('Equality diversity inclusion EDI considerations is required');
        if (!optionalAreas.assistive_technology_equipment?.trim()) errors.push('Assistive technology equipment is required');
        if (!optionalAreas.legal_orders_or_restrictions?.trim()) errors.push('Legal orders or restrictions is required');
        if (!optionalAreas.sexuality_and_relationships?.trim()) errors.push('Sexuality and relationships is required');
        if (!optionalAreas.access_to_advocacy_services?.trim()) errors.push('Access to advocacy services is required');
        break;
        
      case 10: // Signatures - all fields are required
        const signatures = formData.signatures;
        if (!signatures.assessor_name?.trim()) errors.push('Assessor name is required');
        if (!signatures.assessor_signature?.trim()) errors.push('Assessor signature is required');
        if (!signatures.assessor_date?.trim()) errors.push('Assessor date is required');
        if (!signatures.individual_representative_name?.trim()) errors.push('Individual representative name is required');
        if (!signatures.individual_representative_signature?.trim()) errors.push('Individual representative signature is required');
        if (!signatures.individual_representative_date?.trim()) errors.push('Individual representative date is required');
        break;
    }
    
    setValidationErrors(errors);
    return errors.length === 0;
  };

  // Handle section navigation
  const handleNextSection = async () => {
    try {
      // Validate current section before proceeding
      if (!validateCurrentSection()) {
        console.log('❌ Validation failed:', validationErrors);
        return; // Don't proceed if validation fails
      }
      
      if (currentSection === 10) {
        // For Section 10, save both signatures and optionalAttachments data
        console.log('Saving Section 10 data (signatures and optionalAttachments)');
        
        // Save signatures data
        const signaturesSuccess = await saveSection('signatures');
        if (!signaturesSuccess) {
          console.error('❌ Failed to save signatures data');
          return;
        }
        
        // Save optionalAttachments data
        const attachmentsSuccess = await saveSection('optionalAttachments');
        if (!attachmentsSuccess) {
          console.error('❌ Failed to save optionalAttachments data');
          return;
        }
        
        console.log('✅ Successfully saved Section 10 data');
        
        // Update assessment status to completed
        const statusSuccess = await updateAssessmentStatus('completed');
        if (statusSuccess) {
          console.log('✅ Assessment marked as completed');
        }
        
        // Generate care plan and show loader
        setIsGeneratingCarePlan(true);
        try {
          if (!currentAssessment?.id) {
            console.error('❌ No assessment ID available for care plan generation');
            throw new Error('No assessment ID available');
          }
          console.log('🔍 Generating care plan for assessment:', currentAssessment.id);
          const carePlanResponse = await carePlanAPI.generateCarePlanById(currentAssessment.id);
          
          if (carePlanResponse.success) {
            console.log('✅ Care plan generated and saved successfully');
            setShowCompletionMessage(true);
            // Show success message for 3 seconds then navigate
            setTimeout(() => {
              setIsGeneratingCarePlan(false);
              // Add a small delay to ensure data is fully saved
              setTimeout(() => {
                navigate('/critical-information');
              }, 1000);
            }, 3000);
          } else {
            console.error('❌ Failed to generate care plan:', carePlanResponse.message);
            setShowCompletionMessage(true);
            // Show message for 3 seconds then navigate
            setTimeout(() => {
              setIsGeneratingCarePlan(false);
              // Add a small delay to ensure data is fully saved
              setTimeout(() => {
                navigate('/critical-information');
              }, 1000);
            }, 3000);
          }
        } catch (error) {
          console.error('❌ Error generating care plan:', error);
          setShowCompletionMessage(true);
          // Show message for 3 seconds then navigate
          setTimeout(() => {
            setIsGeneratingCarePlan(false);
            // Add a small delay to ensure data is fully saved
            setTimeout(() => {
              navigate('/critical-information');
            }, 1000);
          }, 3000);
        }
        
      } else {
        // For other sections, save current section data before moving to next
        const sectionKeys = [
          'personalDetails',
          'basicDetails', 
          'healthWellbeing',
          'dailyLiving',
          'risksSafeguarding',
          'socialEmotional',
          'environmentLifestyle',
          'advancePreferences',
          'optionalAreas',
          'signatures'
        ];
        
        const currentSectionKey = sectionKeys[currentSection - 1] as any;
        console.log(`🔍 handleNextSection: Saving section ${currentSection} (${currentSectionKey}) data only`);
        console.log(`🔍 handleNextSection: Current section: ${currentSection}, Section key: ${currentSectionKey}`);
        
        // Save the current section data to Supabase
        const success = await saveSection(currentSectionKey);
        
        if (success) {
          console.log(`✅ Successfully saved section ${currentSection}`);
          setCurrentSection(currentSection + 1);
          setValidationErrors([]); // Clear validation errors when moving to next section
        } else {
          console.error(`❌ Failed to save section ${currentSection}`);
          // You might want to show an error message to the user here
        }
      }
    } catch (error) {
      console.error('Error saving section:', error);
      // You might want to show an error message to the user here
    }
  };

  const handlePreviousSection = () => {
    if (currentSection > 1) {
      setCurrentSection(currentSection - 1);
      setValidationErrors([]); // Clear validation errors when going back
    }
  };

  // Section titles
  const sectionTitles = [
    'Personal Details',
    'Basic Details', 
    'Health & Wellbeing',
    'Daily Living',
    'Risks & Safeguarding',
    'Social & Emotional Wellbeing',
    'Environment & Lifestyle',
    'Advance Preferences',
    'Optional Areas',
    'Signatures'
  ];

  // Handle status change
  const handleStatusChange = async (status: 'draft' | 'in_review' | 'completed' | 'locked') => {
    if (currentAssessment) {
      const success = await updateAssessmentStatus(status);
      if (success) {
        // Show success message
        console.log(`Assessment status updated to ${status}`);
      }
    }
  };

  // Handle PDF generation
  const handleGeneratePdf = async () => {
    if (currentAssessment) {
      const pdfUrl = await generatePdf();
      if (pdfUrl) {
        // Show success message and download link
        console.log('PDF generated successfully');
        window.open(pdfUrl, '_blank');
      }
    }
  };

  // Render current section
  const renderCurrentSection = () => {
    const isReadOnly = currentAssessment?.status === 'locked';

    switch (currentSection) {
      case 1:
        return <Section1Personal isReadOnly={isReadOnly} />;
      case 2:
        return <Section2Basic isReadOnly={isReadOnly} />;
      case 3:
        return <Section3Health isReadOnly={isReadOnly} />;
      case 4:
        return <Section4DailyLiving isReadOnly={isReadOnly} />;
      case 5:
        return <Section5RisksSafeguarding isReadOnly={isReadOnly} />;
      case 6:
        return <Section6SocialEmotionalWellbeing isReadOnly={isReadOnly} />;
      case 7:
        return <Section7EnvironmentLifestyle isReadOnly={isReadOnly} />;
      case 8:
        return <Section8AdvancePreferences isReadOnly={isReadOnly} />;
      case 9:
        return <Section9OptionalAreas isReadOnly={isReadOnly} />;
      case 10:
        return <Section10Summary readOnly={isReadOnly} onCompleteAssessment={handleNextSection} />;
      default:
        return <div>Invalid section</div>;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading assessment...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Assessment</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => navigate('/assessments')}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Back to Assessments
          </button>
        </div>
      </div>
    );
  }

  if (!currentAssessment) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading assessment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">

             {/* Main Content */}
       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
         {/* Universal Care Needs Assessment Title - Only on first section */}
         {currentSection === 1 && (
           <div className="mb-6">
             <h1 className="text-3xl font-bold text-gray-900 mb-2">Universal Care Needs Assessment</h1>
             <p className="text-gray-600">Comprehensive assessment for care and support planning</p>
           </div>
         )}

         {/* Success Message - Show when assessment is completed */}
         {showCompletionMessage && (
           <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
             <div className="flex items-center">
               <div className="flex-shrink-0">
                 <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                   <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                 </svg>
               </div>
               <div className="ml-3">
                 <h3 className="text-sm font-medium text-green-800">
                   Care Plan Generated and Saved Successfully!
                 </h3>
                 <p className="mt-1 text-sm text-green-700">
                   Your assessment has been completed and care plan has been generated and saved to the database. Redirecting to Critical Information page...
                 </p>
               </div>
             </div>
           </div>
         )}

         {/* Loading Message - Show while generating care plan */}
         {isGeneratingCarePlan && (
           <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
             <div className="flex items-center">
               <div className="flex-shrink-0">
                 <svg className="animate-spin h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                   <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                   <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                 </svg>
               </div>
               <div className="ml-3">
                 <h3 className="text-sm font-medium text-blue-800">
                   Generating Care Plan...
                 </h3>
                 <p className="mt-1 text-sm text-blue-700">
                   Please wait while the AI generates your personalized care plan and saves it to the database.
                 </p>
               </div>
             </div>
           </div>
         )}

         {/* Validation Errors Display */}
         {validationErrors.length > 0 && (
           <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
             <div className="flex items-center">
               <div className="flex-shrink-0">
                 <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                   <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                 </svg>
               </div>
               <div className="ml-3">
                 <h3 className="text-sm font-medium text-red-800">
                   Please complete all required fields before proceeding
                 </h3>
                 <ul className="mt-2 text-sm text-red-700 list-disc list-inside">
                   {validationErrors.map((error, index) => (
                     <li key={index}>{error}</li>
                   ))}
                 </ul>
               </div>
             </div>
           </div>
         )}

         {/* Section Title Bar */}
         <div className="bg-gray-600 text-white p-4 rounded-t-lg mb-0">
           <h2 className="text-xl font-bold">{sectionTitles[currentSection - 1]}</h2>
         </div>

        {/* Form Content */}
        <div className="bg-gray-100 border border-gray-600 border-t-0 rounded-b-lg p-6">
          {renderCurrentSection()}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center mt-6">
          <button
            onClick={handlePreviousSection}
            disabled={currentSection === 1}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
              currentSection === 1
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-gray-600 text-white hover:bg-gray-700'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <div className="text-sm text-gray-600">
            Section {currentSection} of 10
          </div>

          <button
            onClick={handleNextSection}
            disabled={isGeneratingCarePlan}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
              isGeneratingCarePlan
                ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                : currentSection === 10
                ? 'bg-green-600 text-white hover:bg-green-700'
                : 'bg-gray-600 text-white hover:bg-gray-700'
            }`}
          >
            {isGeneratingCarePlan ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Generating Care Plan...</span>
              </>
            ) : (
              <>
                <span>{currentSection === 10 ? 'Complete Assessment & Generate Care Plan' : 'Next'}</span>
                <ChevronRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>



      {/* Chat Panel */}
      <ChatPanel
        assessmentId={currentAssessment.id}
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
      />

      {/* Floating Chat Button */}
      <ChatButton onClick={() => setIsChatOpen(true)} />
    </div>
  );
};
