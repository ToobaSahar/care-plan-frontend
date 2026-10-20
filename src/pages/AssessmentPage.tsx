import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
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
import { ChatPanel } from '../components/Chat/ChatPanel';

import { SectionRail } from '../components/layout/SectionRail';
import { PersonHeader } from '../components/layout/PersonHeader';
import { EvidenceColumn } from '../components/layout/EvidenceColumn';
import { RiskSpine } from '../components/layout/RiskSpine';
import { WorkSurface } from '../components/layout/WorkSurface';
import { Alert, Button, Logo, Skeleton } from '../components/ui';
import { deriveEvidence, sectionCompletion } from '../lib/evidence';
import { newUuid } from '../lib/ids';

import { useAssessment } from '../state/useAssessment';
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
    saveSection
  } = useAssessment();

  /* Reaching /assessment with no id means "start a new one". Mint the id and
     redirect to its own URL; `loadAssessment` then takes the normal path and
     creates the row, so there is one create path rather than two.

     The id is held in a ref so React 18 StrictMode's double-invoked effect
     cannot mint two and leave an orphan assessment behind, and the redirect
     replaces the history entry so Back does not bounce into another new one. */
  const newAssessmentIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (id) {
      loadAssessment(id);
      return;
    }

    if (!newAssessmentIdRef.current) {
      newAssessmentIdRef.current = newUuid();
    }

    navigate(`/assessment/${newAssessmentIdRef.current}`, { replace: true });
  }, [id, loadAssessment, navigate]);

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


  /* ── Derived presentation state ─────────────────────────────────────────
     Everything below reads from formData; none of it writes. The evidence
     column is a view of the record, never a second source of truth.        */
  const evidence = deriveEvidence(formData);
  const completion = sectionCompletion(formData);
  const personal = formData.personalDetails;

  const ShellFallback: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-oat-50 px-6">
      <Logo size="lg" />
      {children}
    </div>
  );

  if (isLoading) {
    return (
      <div className="flex h-screen overflow-hidden bg-oat-50">
        <div className="hidden w-[232px] flex-none bg-teal-800 p-5 lg:block">
          <Logo onDark size="md" />
          <div className="mt-8 flex flex-col gap-2.5">
            {Array.from({ length: 10 }).map((_, i) => (
              <Skeleton key={i} className="h-7 w-full bg-teal-700/60" />
            ))}
          </div>
        </div>
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex items-center gap-4 border-b border-oat-200 bg-white px-6 py-3.5">
            <Skeleton className="h-11 w-11 rounded-full" />
            <div className="flex flex-col gap-2">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-3 w-72" />
            </div>
          </div>
          <div className="flex flex-col gap-5 p-7">
            <Skeleton className="h-6 w-64" />
            <Skeleton className="h-40 w-full rounded-xl" />
            <Skeleton className="h-40 w-full rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <ShellFallback>
        <Alert tone="error" title="This assessment could not be opened" className="max-w-md">
          {error}
        </Alert>
        <Button onClick={() => navigate('/assessments')} icon={<ArrowLeft />}>
          Back to caseload
        </Button>
      </ShellFallback>
    );
  }

  if (!currentAssessment) {
    return (
      <ShellFallback>
        <Alert tone="info" title="No assessment open" className="max-w-md">
          Open an assessment from the caseload to start recording. Assessments are addressed
          by id, so this page needs one to know whose record to load.
        </Alert>
        <Button onClick={() => navigate('/assessments')} icon={<ArrowLeft />}>
          Go to caseload
        </Button>
      </ShellFallback>
    );
  }

  const isFinalSection = currentSection === 10;


  return (
    <div className="flex h-screen overflow-hidden bg-teal-800">
      {/* Section rail — the far edge of one continuous teal ground. */}
      <div className="hidden w-[232px] flex-none lg:block">
        <SectionRail
          titles={sectionTitles}
          current={currentSection}
          completed={completion}
          onSelect={(n) => {
            setCurrentSection(n);
            setValidationErrors([]);
          }}
          footer={
            <button
              type="button"
              onClick={() => navigate('/assessments')}
              className="text-xs font-medium text-teal-200 underline underline-offset-2 hover:text-white"
            >
              Back to caseload
            </button>
          }
        />
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <PersonHeader
          name={personal?.full_name}
          nhsNumber={personal?.nhs_number}
          dateOfBirth={personal?.date_of_birth}
          postcode={personal?.postcode}
          assessorName={formData.signatures?.assessor_name}
          status={currentAssessment.status}
          overallRisk={evidence.overall}
          onBack={() => navigate('/assessments')}
          className="lg:[&>button]:hidden"
        />

        {/* Fields sit on a warm plane lifted off the ground; evidence stays on
            the ground itself, so the two read as different kinds of surface. */}
        <div className="flex min-h-0 flex-1">
          <WorkSurface className="flex min-w-0 flex-1 flex-col overflow-hidden">
            {/* Compact stepper for narrow screens, where the rail is hidden. */}
            <div
              className="flex gap-1.5 overflow-x-auto border-b border-oat-200 px-4 py-2.5 lg:hidden"
              role="tablist"
              aria-label="Assessment sections"
            >
              {sectionTitles.map((title, i) => (
                <button
                  key={title}
                  type="button"
                  role="tab"
                  aria-selected={currentSection === i + 1}
                  onClick={() => {
                    setCurrentSection(i + 1);
                    setValidationErrors([]);
                  }}
                  className={
                    currentSection === i + 1
                      ? 'flex-none rounded-full bg-teal-700 px-3 py-1.5 text-xs font-semibold text-white'
                      : completion[i]
                      ? 'flex-none rounded-full border border-teal-200 bg-teal-50 px-3 py-1.5 text-xs font-medium text-teal-700'
                      : 'flex-none rounded-full border border-oat-200 px-3 py-1.5 text-xs text-oat-600'
                  }
                >
                  {i + 1}. {title}
                </button>
              ))}
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-7 sm:px-8">
              <div className="mx-auto flex w-full max-w-[760px] flex-col gap-5">
                <div className="flex items-baseline gap-3">
                  <h2 className="text-2xl font-semibold text-teal-800">
                    {sectionTitles[currentSection - 1]}
                  </h2>
                  <span className="ml-auto font-mono text-xs text-oat-500">
                    {String(currentSection).padStart(2, '0')}
                    <span className="text-oat-300"> / {sectionTitles.length}</span>
                  </span>
                </div>

                {showCompletionMessage && (
                  <Alert tone="success" title="Care plan generated and saved">
                    The assessment is complete and the plan has been written to the record.
                    Taking you to Critical Information.
                  </Alert>
                )}

                {isGeneratingCarePlan && (
                  <Alert tone="working" title="Generating the care plan">
                    Three agents are reading the record — analysing needs, drafting the plan,
                    then reviewing it. This takes a moment.
                  </Alert>
                )}

                {validationErrors.length > 0 && (
                  <Alert tone="error" title="Some required answers are still missing">
                    <ul className="mt-1 list-inside list-disc space-y-0.5">
                      {validationErrors.map((err, i) => (
                        <li key={i}>{err}</li>
                      ))}
                    </ul>
                  </Alert>
                )}

                <div className="rounded-xl border border-oat-200 bg-white p-6 shadow-xs">
                  {renderCurrentSection()}
                </div>

                {/* Below 1280px the evidence cannot sit beside the fields, so it
                    follows them. The thesis holds on a tablet rather than
                    collapsing into a floating help button. */}
                <div className="overflow-hidden rounded-xl border border-oat-200 bg-oat-100 xl:hidden">
                  <RiskSpine level={evidence.overall} orientation="horizontal" />
                  <EvidenceColumn
                    evidence={evidence}
                    sectionIndex={currentSection}
                    onOpenSection={(n) => {
                      setCurrentSection(n);
                      setValidationErrors([]);
                    }}
                    onOpenAssistant={() => setIsChatOpen(true)}
                    className="border-l-0"
                  />
                </div>
              </div>
            </div>

            {/* Sticky action bar. The primary action never scrolls out of reach. */}
            <div className="border-t border-oat-200 bg-white px-5 py-3.5 sm:px-8">
              <div className="mx-auto flex w-full max-w-[760px] flex-wrap items-center gap-2.5">
                <Button
                  onClick={handleNextSection}
                  loading={isGeneratingCarePlan}
                  iconRight={!isFinalSection ? <ChevronRight /> : undefined}
                >
                  {isGeneratingCarePlan
                    ? 'Generating care plan'
                    : isFinalSection
                    ? 'Complete assessment & generate care plan'
                    : 'Save & continue'}
                </Button>

                <Button
                  variant="ghost"
                  onClick={handlePreviousSection}
                  disabled={currentSection === 1}
                  icon={<ChevronLeft />}
                >
                  Back
                </Button>

                <p className="ml-auto hidden text-xs text-oat-600 sm:block">
                  {completion.filter(Boolean).length} of {sectionTitles.length} started
                </p>
              </div>
            </div>
          </WorkSurface>

          {/* The record's risk, as the edge between the fields and their evidence. */}
          <RiskSpine level={evidence.overall} className="hidden w-1.5 xl:block" />

          <div className="hidden w-[340px] flex-none xl:block">
            <EvidenceColumn
              evidence={evidence}
              sectionIndex={currentSection}
              onOpenSection={(n) => {
                setCurrentSection(n);
                setValidationErrors([]);
              }}
              onOpenAssistant={() => setIsChatOpen(true)}
              onDark
            />
          </div>
        </div>
      </div>

      <ChatPanel
        assessmentId={currentAssessment.id}
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
      />
    </div>
  );
};
