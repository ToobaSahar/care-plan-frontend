import React, { useState, useEffect, useRef, useId } from 'react';
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
import { SectionBar } from '../components/layout/SectionBar';
import { RailDrawer } from '../components/layout/RailDrawer';
import { RailFrame } from '../components/layout/RailFrame';
import { PersonHeader } from '../components/layout/PersonHeader';
import { EvidenceColumn } from '../components/layout/EvidenceColumn';
import { WorkSurface } from '../components/layout/WorkSurface';
import { Alert, Button, Card, Logo, Skeleton } from '../components/ui';
import { deriveEvidence, sectionCompletion } from '../lib/evidence';
import { newUuid } from '../lib/ids';
import { cn } from '../lib/cn';
import { RAIL_DOCK, useRailLayout } from '../hooks/useRailLayout';

import { useAssessment } from '../state/useAssessment';
import { carePlanAPI } from '../lib/carePlanApi';
import { useAuth } from '../auth/AuthProvider';
import { PERMISSIONS, can } from '../auth/permissions';
import { primeRecent, rememberRecent } from '../lib/recentRecords';

/** What a refused write means to the person who asked for it. */
const SAVE_FAILED =
  'This section could not be saved, so nothing has been recorded. Check your connection and try again — your answers are still on screen.';

export const AssessmentPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [showCompletionMessage, setShowCompletionMessage] = useState(false);

  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  /* A refused save. Held separately from the store's `error`, which is about
     opening the record: this one is about the attempt just made, and must be
     visible, because the alternative is a primary button that does nothing. */
  const [saveError, setSaveError] = useState<string | null>(null);
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

  // Where the section rail sits at this width: docked beside the work, or an
  // icon strip that opens a drawer over it.
  const rail = useRailLayout(RAIL_DOCK.assessment);
  const dockedRailId = useId();
  const drawerRailId = useId();

  // For the workspace rail's "Recently opened": the id goes to storage once
  // per open; the name stays in memory, kept current as it is edited.
  const { staff } = useAuth();
  const staffId = staff?.id;

  /* A viewer may read every record and change none of them — the database
     enforces that on its own. Without asking here, the form opened fully
     editable for them and each save was refused after the typing was done. */
  const canWrite = can(staff, PERMISSIONS.recordsWrite);
  const openedId = currentAssessment?.id === id ? id : undefined;
  const openedName = formData.personalDetails?.full_name;
  const openedNhs = formData.personalDetails?.nhs_number;

  useEffect(() => {
    if (staffId && openedId) rememberRecent(staffId, openedId);
  }, [staffId, openedId]);

  useEffect(() => {
    if (staffId && openedId) {
      primeRecent(staffId, {
        id: openedId,
        full_name: openedName || null,
        nhs_number: openedNhs || null,
      });
    }
  }, [staffId, openedId, openedName, openedNhs]);

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

  /* The pack for the record in hand. Naming the person is the difference
     between showing this assessment's pack and showing whichever service
     user happens to have been added to the system most recently — which, with
     two assessors working at once, is routinely somebody else. */
  const packPath = currentAssessment?.id
    ? `/critical-information?userId=${encodeURIComponent(currentAssessment.id)}`
    : '/critical-information';

  // Handle section navigation
  const handleNextSection = async () => {
    setSaveError(null);

    try {
      // Validate current section before proceeding
      if (!validateCurrentSection()) return;
      
      if (currentSection === 10) {
        // For Section 10, save both signatures and optionalAttachments data
        console.log('Saving Section 10 data (signatures and optionalAttachments)');
        
        // Save signatures data
        const signaturesSuccess = await saveSection('signatures');
        if (!signaturesSuccess) {
          setSaveError(SAVE_FAILED);
          return;
        }

        // Save optionalAttachments data
        const attachmentsSuccess = await saveSection('optionalAttachments');
        if (!attachmentsSuccess) {
          setSaveError(SAVE_FAILED);
          return;
        }
        
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
                navigate(packPath);
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
                navigate(packPath);
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
              navigate(packPath);
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

        // Save the current section data to Supabase. The section only advances
        // on a confirmed write, so "Save & continue" cannot carry someone past
        // work that was not recorded.
        const success = await saveSection(currentSectionKey);

        if (success) {
          setCurrentSection(currentSection + 1);
          setValidationErrors([]); // Clear validation errors when moving to next section
        } else {
          setSaveError(SAVE_FAILED);
        }
      }
    } catch (error) {
      console.error('Error saving section:', error);
      setSaveError(SAVE_FAILED);
    }
  };

  const handlePreviousSection = () => {
    if (currentSection > 1) {
      setCurrentSection(currentSection - 1);
      setValidationErrors([]); // Clear validation errors when going back
      setSaveError(null);
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
    const isReadOnly = currentAssessment?.status === 'locked' || !canWrite;

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
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-oat-100 px-6">
      <Logo size="lg" />
      {children}
    </div>
  );

  if (isLoading) {
    return (
      <div className="flex h-viewport overflow-hidden bg-oat-100">
        {/* The same rail shape the page will open with, so nothing jumps. */}
        <div
          className={cn(
            'hidden flex-none border-r border-oat-200 bg-oat-100 py-5 md:block',
            rail.expanded ? 'w-[248px] px-3' : 'w-[72px]',
          )}
        >
          {rail.expanded ? (
            <>
              <div className="px-3 pb-7 pt-1">
                <Logo size="md" />
              </div>
              <div className="flex flex-col gap-2 px-3">
                {Array.from({ length: 10 }).map((_, i) => (
                  <Skeleton key={i} className="h-6 w-full" />
                ))}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center gap-7">
              <div className="pt-1">
                <Logo variant="mark" size="md" />
              </div>
              {Array.from({ length: 10 }).map((_, i) => (
                <Skeleton key={i} className="h-5 w-5 rounded-full" />
              ))}
            </div>
          )}
        </div>
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex items-center gap-5 border-b border-oat-200 bg-white px-5 py-5 sm:px-8">
            <Skeleton className="h-12 w-12 flex-none rounded-full sm:h-14 sm:w-14" />
            <div className="flex min-w-0 flex-col gap-2.5">
              <Skeleton className="h-6 w-56 max-w-full" />
              <Skeleton className="h-3.5 w-80 max-w-full" />
            </div>
          </div>
          <div className="mx-auto flex w-full max-w-[760px] flex-col gap-5 px-4 py-6 sm:px-8 sm:py-8">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-72 w-full rounded-xl" />
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
          Back to service users
        </Button>
      </ShellFallback>
    );
  }

  if (!currentAssessment) {
    return (
      <ShellFallback>
        <Alert tone="info" title="No assessment open" className="max-w-md">
          Open an assessment from the service users list to start recording. Assessments are addressed
          by id, so this page needs one to know whose record to load.
        </Alert>
        <Button onClick={() => navigate('/assessments')} icon={<ArrowLeft />}>
          Go to service users
        </Button>
      </ShellFallback>
    );
  }

  const isFinalSection = currentSection === 10;


  const openSection = (n: number) => {
    setCurrentSection(n);
    setValidationErrors([]);
    setSaveError(null);
  };

  const goToServiceUsers = () => navigate('/assessments');

  const selectFromDrawer = (n: number) => {
    openSection(n);
    rail.closeDrawer();
  };

  /* Layout by width — the same record and the same order of work everywhere,
     arranged for the room available:

       ≥1280  rail docked (full or icon strip, the assessor's choice, kept on
              this device) · fields · evidence column beside them
       ≥1024  icon strip, expanding as a drawer · fields · evidence beside
       ≥768   icon strip, expanding as a drawer · fields, evidence beneath
       <768   the page scrolls as one: person header, then a sticky section
              bar that opens the drawer, fields, evidence beneath, and the
              action bar pinned to the foot of the screen                    */
  return (
    <div className="flex min-h-viewport bg-oat-100 md:h-viewport md:overflow-hidden">
      {/* Docked rail, in the same frame and with the same edge handle as
          every other screen. Below the docking width the handle opens the
          drawer instead of widening the rail. */}
      <RailFrame
        className="hidden md:block"
        expanded={rail.expanded}
        onToggle={rail.toggle}
        controls={rail.canDock ? dockedRailId : drawerRailId}
        toggleExpanded={rail.canDock ? rail.expanded : rail.drawerOpen}
      >
        <SectionRail
          id={dockedRailId}
          titles={sectionTitles}
          current={currentSection}
          completed={completion}
          onSelect={openSection}
          onBack={goToServiceUsers}
          collapsed={!rail.expanded}
        />
      </RailFrame>

      {/* The full rail over the content, wherever it cannot sit beside it. */}
      <RailDrawer
        id={drawerRailId}
        open={rail.drawerOpen}
        onClose={rail.closeDrawer}
        label="Assessment sections"
      >
        <SectionRail
          titles={sectionTitles}
          current={currentSection}
          completed={completion}
          onSelect={selectFromDrawer}
          onBack={goToServiceUsers}
        />
      </RailDrawer>

      <div className="flex min-w-0 flex-1 flex-col">
        {/* On a phone the docked rail is absent, so the header keeps its own
            way back; from tablet width up the rail carries it. */}
        <PersonHeader
          name={personal?.full_name}
          nhsNumber={personal?.nhs_number}
          dateOfBirth={personal?.date_of_birth}
          postcode={personal?.postcode}
          assessorName={formData.signatures?.assessor_name}
          status={currentAssessment.status}
          overallRisk={evidence.overall}
          onBack={goToServiceUsers}
          className="md:[&>button]:hidden"
        />

        {/* Fields on the oat ground, evidence one tonal step down beside
            them, so the two read as different kinds of surface. */}
        <div className="flex flex-1 md:min-h-0">
          <WorkSurface className="flex min-w-0 flex-1 flex-col md:overflow-hidden">
            <SectionBar
              className="md:hidden"
              title={sectionTitles[currentSection - 1]}
              index={currentSection}
              total={sectionTitles.length}
              personName={personal?.full_name || undefined}
              onOpenSections={rail.openDrawer}
              sectionsOpen={rail.drawerOpen}
              sectionsId={drawerRailId}
            />

            <div className="flex-1 px-4 py-6 sm:px-8 sm:py-9 md:overflow-y-auto">
              <div className="mx-auto flex w-full max-w-[760px] flex-col gap-5">
                {/* On a phone the sticky section bar carries this heading. */}
                <div className="hidden flex-wrap items-baseline justify-between gap-x-4 gap-y-1 md:flex">
                  <h2 className="text-2xl font-semibold text-teal-800">
                    {sectionTitles[currentSection - 1]}
                  </h2>
                  <p className="text-xs tabular-nums text-oat-500">
                    Section {currentSection} of {sectionTitles.length}
                  </p>
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

                {!canWrite && (
                  <Alert tone="info" title="You are reading this record">
                    This account can open assessments but not change them. Ask an administrator
                    if you need to record answers.
                  </Alert>
                )}

                {saveError && (
                  <Alert tone="error" title="This section was not saved">
                    {saveError}
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

                <Card flush className="p-5 sm:p-7">
                  {renderCurrentSection()}
                </Card>

                {/* Below 1024px the evidence cannot sit beside the fields, so it
                    follows them. The thesis holds on a tablet rather than
                    collapsing into a floating help button. */}
                <EvidenceColumn
                  evidence={evidence}
                  sectionIndex={currentSection}
                  onOpenSection={openSection}
                  onOpenAssistant={() => setIsChatOpen(true)}
                  inline
                  className="lg:hidden"
                />
              </div>
            </div>

            {/* Sticky action bar. The primary action never scrolls out of reach:
                pinned to the foot of the work area, and on a phone to the foot
                of the screen. */}
            <div className="sticky bottom-0 z-20 border-t border-oat-200 bg-white px-4 py-3 sm:px-8 sm:py-3.5 md:static">
              <div className="mx-auto flex w-full max-w-[760px] items-center gap-2.5">
                <Button
                  onClick={handleNextSection}
                  loading={isGeneratingCarePlan}
                  disabled={!canWrite}
                  iconRight={!isFinalSection ? <ChevronRight /> : undefined}
                  className="min-w-0 flex-1 sm:flex-none"
                >
                  {isGeneratingCarePlan ? (
                    'Generating care plan'
                  ) : isFinalSection ? (
                    <>
                      <span className="min-w-0 truncate sm:hidden">Complete &amp; generate care plan</span>
                      <span className="hidden sm:inline">Complete assessment &amp; generate care plan</span>
                    </>
                  ) : (
                    'Save & continue'
                  )}
                </Button>

                {/* On a phone Back is the arrow alone, left of the primary
                    action, so the primary can take the width. */}
                <Button
                  variant="ghost"
                  onClick={handlePreviousSection}
                  disabled={currentSection === 1}
                  icon={<ChevronLeft />}
                  className="order-first flex-none sm:order-none"
                >
                  <span className="sr-only sm:not-sr-only">Back</span>
                </Button>

                <p className="ml-auto hidden flex-none text-xs tabular-nums text-oat-500 sm:block">
                  {completion.filter(Boolean).length} of {sectionTitles.length} started
                </p>
              </div>
            </div>
          </WorkSurface>

          <div className="hidden w-[300px] flex-none lg:block xl:w-[340px]">
            <EvidenceColumn
              evidence={evidence}
              sectionIndex={currentSection}
              onOpenSection={openSection}
              onOpenAssistant={() => setIsChatOpen(true)}
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
