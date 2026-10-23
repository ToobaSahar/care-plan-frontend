import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Users,
  AlertTriangle,
  Utensils,
  Shield,
  Activity,
  Heart,
  Download,
} from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { formatDate, formatNhsNumber, formatPhone } from '../lib/format';
import { supabase } from '../lib/supabase';
import { fetchSection } from '../lib/assessmentSections';
import {
  deriveCriticalInformation,
  type PackEntry,
  type PackSections,
} from '../lib/criticalInformation';
import jsPDF from 'jspdf';
import { Button } from '../components/ui';

/* ──────────────────────────────────────────────────────────────────────────
   The seven generated care plan areas, as their tables are named.

   Declared once: each was previously fetched by its own copy of the same
   twenty lines, and the copies had drifted — see `fetchLatestCarePlan`.
   ────────────────────────────────────────────────────────────────────────── */
const CARE_PLAN_TABLES = {
  health: 'health_care_plan',
  dailyLiving: 'daily_living_care_plan',
  risksSafeguarding: 'risks_safeguarding_care_plan',
  socialEmotional: 'social_emotional_care_plan',
  environmentLifestyle: 'environment_lifestyle_care_plan',
  advancePreferences: 'advance_preferences_care_plan',
  optionalAreas: 'optional_areas_care_plan',
} as const;

type CarePlanArea = keyof typeof CARE_PLAN_TABLES;
type CarePlans = Partial<Record<CarePlanArea, any>>;

/**
 * This person's latest plan for one area, or nothing.
 *
 * Always scoped to the assessment. Opened without `?userId=`, this page falls
 * back to the most recently added service user — and each of these reads then
 * used to drop its filter and take the newest row in the table instead. Those
 * are not the same record: the newest `daily_living_care_plan` belongs to
 * whoever was assessed last, who is generally someone else. The pack would
 * present one person's name above another person's plan, which on an
 * Emergency Admission Pack is the most consequential thing it could get wrong.
 */
async function fetchLatestCarePlan(table: string, assessmentId: string): Promise<any | null> {
  const { data, error } = await supabase
    .from(table)
    .select('*')
    .eq('assessment_id', assessmentId)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    // One unreadable area must not empty the other six.
    console.warn(`Could not load ${table}:`, error.message);
    return null;
  }
  return data;
}

export const CriticalInformationPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const userId = searchParams.get('userId');
  const [serviceUser, setServiceUser] = useState<any>(null);
  const [carePlanAreas, setCarePlanAreas] = useState<CarePlans>({});
  const [packSections, setPackSections] = useState<PackSections | null>(null);
  const [loading, setLoading] = useState(true);
  const [carePlansLoading, setCarePlansLoading] = useState(true);

  useEffect(() => {
    // The pack is addressed by `?userId=`, so changing person must refetch.
    // With an empty dependency list this ran once per mount, and moving
    // between two people left the first person's pack on screen under the
    // second one's URL.
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setCarePlansLoading(true);
      setServiceUser(null);
      setCarePlanAreas({});
      setPackSections(null);

      try {
        // Whose pack this is. Without an id, the most recently added record —
        // the banner below says so, and everything after this point is scoped
        // to whatever this resolves to.
        const base = supabase.from('service_users').select('*');
        const { data: serviceUserData, error: serviceUserError } = await (userId
          ? base.eq('id', userId).maybeSingle()
          : base.order('created_at', { ascending: false }).limit(1).maybeSingle());

        if (serviceUserError) throw serviceUserError;
        if (cancelled) return;
        if (!serviceUserData) return;

        const assessmentId = serviceUserData.id as string;

        // This person's own assessment sections and generated plans, every one
        // of them keyed by this id. Reading the newest row of each table
        // instead put whoever was assessed last onto this person's pack.
        const [sections, plans] = await Promise.all([
          Promise.all([
            fetchSection('basicDetails', assessmentId),
            fetchSection('healthWellbeing', assessmentId),
            fetchSection('dailyLiving', assessmentId),
            fetchSection('risksSafeguarding', assessmentId),
          ]),
          Promise.all(
            (Object.entries(CARE_PLAN_TABLES) as Array<[CarePlanArea, string]>).map(
              async ([area, table]) =>
                [area, await fetchLatestCarePlan(table, assessmentId)] as const,
            ),
          ),
        ]);

        if (cancelled) return;

        const [basicDetailsData, healthWellbeingData, dailyLivingData, risksSafeguardingData] =
          sections;

        setPackSections({
          healthWellbeing: healthWellbeingData,
          dailyLiving: dailyLivingData,
          risksSafeguarding: risksSafeguardingData,
        });

        // The flat view the "Basic Profile" and "Additional Info" grids read.
        // Risks & Safeguarding belongs here too: without it the pack's
        // Deprivation of Liberty Safeguards field was blank on every record,
        // however carefully it had been assessed.
        setServiceUser({
          ...serviceUserData,
          ...basicDetailsData,
          ...healthWellbeingData,
          ...risksSafeguardingData,
        });

        setCarePlanAreas(Object.fromEntries(plans) as CarePlans);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        // Both flags, on every path. Left set on the failure path, the
        // "Download PDF" button answered "data is still loading" for as long
        // as the page stayed open.
        if (!cancelled) {
          setLoading(false);
          setCarePlansLoading(false);
        }
      }
    };

    void load();

    return () => {
      cancelled = true;
    };
  }, [userId]);

  const {
    health: healthCarePlan,
    dailyLiving: dailyLivingCarePlan,
    risksSafeguarding: risksSafeguardingCarePlan,
    socialEmotional: socialEmotionalCarePlan,
    environmentLifestyle: environmentLifestyleCarePlan,
    advancePreferences: advancePreferencesCarePlan,
    optionalAreas: optionalAreasCarePlan,
  } = carePlanAreas;

  // Helper function to split full name into first and last name
  const splitFullName = (fullName: string) => {
    if (!fullName) return { firstName: '', lastName: '' };
    const parts = fullName.trim().split(' ');
    const firstName = parts[0] || '';
    const lastName = parts.slice(1).join(' ') || '';
    return { firstName, lastName };
  };

  // Function to download critical information as PDF
  const downloadPDF = () => {
    try {
      // Check if data is still loading
      if (loading || carePlansLoading) {
        alert('Data is still loading. Please wait a moment and try again.');
        return;
      }

      // Check if we have service user data
      if (!serviceUser) {
        alert('No user data available. Please refresh the page and try again.');
        return;
      }

      // Generate and download actual PDF
      generateAndDownloadPDF();
    } catch (error) {
      console.error('Error downloading PDF:', error);
      alert('Error downloading PDF. Please try again.');
    }
  };

  // Function to generate and download actual PDF
  const generateAndDownloadPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const margin = 20;
    const contentWidth = pageWidth - (2 * margin);
    let yPosition = 20;

    // Set font styles
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('CRITICAL INFORMATION REPORT', pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 15;

    // Header information
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    const currentDate = new Date().toLocaleDateString();
    const currentTime = new Date().toLocaleTimeString();
    const userName = serviceUser?.full_name || 'Unknown User';
    
    doc.text(`Generated on: ${currentDate} at ${currentTime}`, margin, yPosition);
    yPosition += 8;
    doc.text(`User: ${userName}`, margin, yPosition);
    yPosition += 8;
    doc.text('Organization: Integrative Supported Living Care - Lincolnshire', margin, yPosition);
    yPosition += 8;
    doc.text('Report Type: Emergency Admission Pack', margin, yPosition);
    yPosition += 15;

    // Basic Profile Section
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('BASIC PROFILE', margin, yPosition);
    yPosition += 10;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const basicProfileData = [
      ['Full Name', serviceUser?.full_name || 'N/A'],
      ['Preferred Name', serviceUser?.preferred_name || 'N/A'],
      ['Date of Birth', serviceUser?.date_of_birth || 'N/A'],
      ['Address', serviceUser?.address_line || 'N/A'],
      ['Postcode', serviceUser?.postcode || 'N/A'],
      ['Phone', serviceUser?.phone_number || 'N/A'],
      ['NHS Number', serviceUser?.nhs_number || 'N/A']
    ];

    basicProfileData.forEach(([label, value]) => {
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 20;
      }
      doc.text(`${label}: ${value}`, margin, yPosition);
      yPosition += 6;
    });

    yPosition += 10;

    // Care Plan Sections
    const carePlanSections = [
      { title: 'HEALTH & WELLBEING CARE PLAN', data: healthCarePlan },
      { title: 'DAILY LIVING CARE PLAN', data: dailyLivingCarePlan },
      { title: 'RISKS & SAFEGUARDING CARE PLAN', data: risksSafeguardingCarePlan },
      { title: 'SOCIAL & EMOTIONAL CARE PLAN', data: socialEmotionalCarePlan },
      { title: 'ENVIRONMENT & LIFESTYLE CARE PLAN', data: environmentLifestyleCarePlan },
      { title: 'ADVANCE PREFERENCES CARE PLAN', data: advancePreferencesCarePlan },
      { title: 'OPTIONAL AREAS CARE PLAN', data: optionalAreasCarePlan }
    ];

    carePlanSections.forEach((section) => {
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 20;
      }

      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text(section.title, margin, yPosition);
      yPosition += 10;

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      
      if (section.data) {
        // Format care plan data as readable text
        const carePlanFields = [
          ['Identified Need', section.data.identified_need || 'N/A'],
          ['Planned Outcomes', section.data.planned_outcomes || 'N/A'],
          ['How to Achieve Outcomes', section.data.how_to_achieve_outcomes || 'N/A'],
          ['Level of Need', section.data.level_of_need || 'N/A'],
          ['Next Review Date', section.data.next_review_date || 'N/A'],
          ['Description', section.data.description || 'N/A']
        ];

        carePlanFields.forEach(([label, value]) => {
          if (yPosition > 250) {
            doc.addPage();
            yPosition = 20;
          }
          
          // Format label
          doc.setFont('helvetica', 'bold');
          doc.text(`${label}:`, margin, yPosition);
          yPosition += 6;
          
          // Format value with proper text wrapping
          doc.setFont('helvetica', 'normal');
          if (value && value !== 'N/A') {
            const lines = doc.splitTextToSize(value, contentWidth - 10);
            lines.forEach((line: string) => {
              if (yPosition > 250) {
                doc.addPage();
                yPosition = 20;
              }
              doc.text(`  ${line}`, margin + 5, yPosition);
              yPosition += 5;
            });
          } else {
            doc.text('  N/A', margin + 5, yPosition);
            yPosition += 5;
          }
          yPosition += 3; // Extra spacing between fields
        });
      } else {
        doc.text('No data available', margin, yPosition);
        yPosition += 6;
      }
      
      yPosition += 10;
    });

    // Footer
    if (yPosition > 250) {
      doc.addPage();
      yPosition = 20;
    }
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('END OF REPORT', pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 8;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Generated by: Care Plan Management System', pageWidth / 2, yPosition, { align: 'center' });

    // Download the PDF
    const fileName = `Critical_Information_${serviceUser?.full_name || 'User'}_${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(fileName);
  };

  const { critical, emergency } = deriveCriticalInformation({
    personal: serviceUser,
    ...packSections,
  });

  const criticalInfoCards = [
    {
      id: 'abilities',
      title: 'Abilities',
      status: critical.abilities,
      icon: <Users className="h-[18px] w-[18px]" />,
    },
    {
      id: 'allergies',
      title: 'Allergies',
      status: critical.allergies,
      icon: <AlertTriangle className="h-[18px] w-[18px]" />,
    },
    {
      id: 'diet',
      title: 'Diet',
      status: critical.diet,
      icon: <Utensils className="h-[18px] w-[18px]" />,
    },
    {
      id: 'high-risk',
      title: 'High Risk',
      status: critical.highRisk,
      icon: <Shield className="h-[18px] w-[18px]" />,
    },
    {
      id: 'intolerance',
      title: 'Intolerance',
      status: critical.intolerance,
      icon: <Activity className="h-[18px] w-[18px]" />,
    },
    {
      id: 'medical-conditions',
      title: 'Medical Conditions',
      status: critical.medicalConditions,
      icon: <Heart className="h-[18px] w-[18px]" />,
    }
  ];

  /* ── Presentation ────────────────────────────────────────────────────────
     Everything below reads the state above and renders it as a document: one
     sheet, hairline-ruled fields, and each care plan area set once with all
     of its fields. The PDF is drawn separately by jsPDF, so this markup is
     free to be a screen document rather than an imitation of the printout. */

  const shown = (value: React.ReactNode, ellipsis = 'Loading…') => (loading ? ellipsis : value || '—');

  const displayName = loading
    ? 'Loading…'
    : serviceUser
    ? `${splitFullName(serviceUser.full_name).firstName} ${splitFullName(serviceUser.full_name).lastName}`
    : 'No Data';

  const initials =
    (serviceUser?.full_name || '')
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((w: string) => w[0]?.toUpperCase())
      .join('') || '—';

  const sectionHeading = (title: string, aside?: string) => (
    <div className="mb-6 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
      <h2 className="text-xl font-semibold text-teal-800">{title}</h2>
      {aside && <p className="text-xs font-medium text-oat-500">{aside}</p>}
    </div>
  );

  const fieldGrid = (
    fields: Array<[label: string, value: React.ReactNode]>,
    columns = 'sm:grid-cols-2 lg:grid-cols-3',
  ) => (
    <dl className={`grid grid-cols-1 gap-x-8 gap-y-5 ${columns}`}>
      {fields.map(([label, value]) => (
        <div key={label} className="min-w-0 border-t border-oat-200 pt-3">
          <dt className="text-xs text-oat-500">{label}</dt>
          <dd className="mt-1 text-base font-medium text-oat-900 [overflow-wrap:anywhere]">{value}</dd>
        </div>
      ))}
    </dl>
  );

  const statusText = (status: PackEntry) =>
    loading ? (
      'Loading…'
    ) : (
      <span className={status.placeholder ? 'font-normal italic text-oat-500' : 'whitespace-pre-line'}>
        {status.text}
      </span>
    );

  const carePlans: Array<{ title: string; plan: any }> = [
    { title: 'Health & Wellbeing', plan: healthCarePlan },
    { title: 'Daily Living', plan: dailyLivingCarePlan },
    { title: 'Risks & Safeguarding', plan: risksSafeguardingCarePlan },
    { title: 'Social & Emotional Wellbeing', plan: socialEmotionalCarePlan },
    { title: 'Environment & Lifestyle', plan: environmentLifestyleCarePlan },
    { title: 'Advance Preferences', plan: advancePreferencesCarePlan },
    { title: 'Optional Areas', plan: optionalAreasCarePlan },
  ];

  return (
    <div className="min-h-screen bg-oat-100">
      {/* Opened without a service user, this page falls back to the most
          recently added record. Say so rather than presenting someone's
          confidential pack as though it had been chosen deliberately. */}
      {!userId && !loading && serviceUser && (
        <div className="cf-no-print border-b border-orange-200 bg-orange-50 px-5 py-3 sm:px-8">
          <div className="mx-auto flex max-w-5xl items-start gap-2.5">
            <AlertTriangle
              className="mt-0.5 h-[18px] w-[18px] flex-none text-orange-700"
              aria-hidden="true"
            />
            <p className="text-base text-orange-900">
              <span className="font-semibold">No service user selected.</span> Showing the
              most recently added record
              {serviceUser.full_name ? ` — ${serviceUser.full_name}` : ''}. Open a care plan
              from the service users list to be sure you are reading the right person&rsquo;s pack.
            </p>
          </div>
        </div>
      )}

      {/* Toolbar — on screen only; the PDF carries none of this. */}
      <div className="cf-no-print sticky top-0 z-20 border-b border-oat-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center gap-3 px-5 py-3 sm:px-8">
          <Button
            variant="ghost"
            size="sm"
            icon={<ArrowLeft />}
            onClick={() => navigate('/assessments')}
            className="-ml-2.5"
          >
            Back to service users
          </Button>
          <Button icon={<Download />} onClick={() => downloadPDF()} className="ml-auto">
            Download PDF
          </Button>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-3 py-6 sm:px-8 sm:py-10">
        <article className="overflow-hidden rounded-2xl border border-oat-200 bg-white shadow-sheet">
          {/* Document header: who issued it, whose it is. */}
          <header className="border-b border-oat-200 px-5 pb-8 pt-6 sm:px-10 sm:pb-10 sm:pt-8">
            <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-3">
              <div className="flex items-center gap-3">
                <img src="/brand/careframe-mark.png" alt="CareFrame" className="h-9 w-9 flex-none" />
                <div>
                  <p className="text-base font-semibold leading-5 text-teal-800">
                    Integrative Supported Living Care
                  </p>
                  <p className="text-xs text-oat-600">Lincolnshire</p>
                </div>
              </div>
              <p className="text-xs text-oat-500 sm:text-right">
                Report run on 31/07/2025 15:52 by Pellagia Margolis
              </p>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-4">
              <span
                className="flex h-16 w-16 flex-none items-center justify-center rounded-full bg-mulberry-600 text-xl font-semibold tracking-tight text-white ring-4 ring-mulberry-50 sm:h-20 sm:w-20 sm:text-2xl"
                aria-hidden="true"
              >
                {initials}
              </span>
              <h1 className="min-w-0 flex-1 text-2xl font-semibold tracking-tight text-teal-900 sm:text-3xl">
                Emergency Admission Pack —{' '}
                {loading ? 'Loading…' : serviceUser ? serviceUser.full_name : 'No Data'}
              </h1>
            </div>
          </header>

          <div className="divide-y divide-oat-200">
            <section className="px-5 py-8 sm:px-10 sm:py-10">
              {sectionHeading('Basic Profile')}
              {fieldGrid([
                ['First Name', shown(serviceUser && splitFullName(serviceUser.full_name).firstName)],
                ['Last Name', shown(serviceUser && splitFullName(serviceUser.full_name).lastName)],
                ['Address', shown(serviceUser?.address_line)],
                ['Preferred Name', shown(serviceUser?.preferred_name)],
                ['Postcode', shown(serviceUser?.postcode)],
                ['Date of Birth', loading ? 'Loading…' : formatDate(serviceUser?.date_of_birth, '—')],
                ['Local Authority Number', shown(serviceUser?.local_authority_number)],
                ['NHS / CHI No.', loading ? 'Loading…' : formatNhsNumber(serviceUser?.nhs_number, '—')],
                ['Contact Number', loading ? 'Loading…' : formatPhone(serviceUser?.phone_number, '—')],
                ['Deprivation of Liberty Safeguards', shown(serviceUser?.mental_capacity_dols)],
                ['Relationship to Service User', shown(serviceUser?.relationship_to_service_user)],
                ['Emergency Contact Name', shown(serviceUser?.emergency_contact_name)],
                [
                  'Emergency Contact Number',
                  loading ? 'Loading…' : formatPhone(serviceUser?.emergency_contact_number, '—'),
                ],
              ])}
            </section>

            <section className="px-5 py-8 sm:px-10 sm:py-10">
              {sectionHeading('Critical Information', displayName)}
              <ul className="grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-oat-200 bg-oat-200 sm:grid-cols-2 lg:grid-cols-3">
                {criticalInfoCards.map((card) => (
                  <li key={card.id} className="flex items-start gap-3 bg-white p-5">
                    <span className="mt-0.5 flex-none text-teal-600" aria-hidden="true">
                      {card.icon}
                    </span>
                    <div className="min-w-0">
                      <h3 className="text-base font-semibold text-oat-900">{card.title}</h3>
                      <p className="mt-0.5 text-base text-oat-800">{statusText(card.status)}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </section>

            <section className="px-5 py-8 sm:px-10 sm:py-10">
              {sectionHeading('Emergency Information')}
              <dl className="grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-oat-200 bg-oat-200 sm:grid-cols-2 lg:grid-cols-3">
                {[
                  { title: 'Call ambulance 999', status: emergency.callAmbulance },
                  { title: 'Emergency Situation', status: emergency.emergencySituation },
                  { title: 'Rescue Medication', status: emergency.rescueMedication },
                  { title: 'Emergency Contacts', status: emergency.emergencyContacts },
                  { title: 'Personal Emergency Evacuation Plan', status: emergency.evacuationPlan },
                  { title: 'Evacuation Equipment', status: emergency.evacuationEquipment },
                ].map((item) => (
                  <div key={item.title} className="bg-white p-5">
                    <dt className="text-sm font-medium text-oat-700">{item.title}</dt>
                    <dd className="mt-1 text-base font-medium text-oat-900">
                      {statusText(item.status)}
                    </dd>
                  </div>
                ))}
              </dl>
            </section>

            <section className="px-5 py-8 sm:px-10 sm:py-10">
              {sectionHeading('Additional Info', displayName)}
              {fieldGrid(
                [
                  ['Language Spoken', shown(serviceUser?.language_spoken)],
                  ['Cultural Preferences', shown(serviceUser?.cultural_preferences)],
                  ['Nationality', '—'],
                  ['Ethnicity', shown(serviceUser?.ethnicity)],
                  ['Lifeline in Place', shown(serviceUser?.lifeline_in_place)],
                  ['Allergies', shown(serviceUser?.allergies)],
                  ['Religion', shown(serviceUser?.religion_beliefs)],
                  ['Primary Diagnosis', shown(serviceUser?.primary_diagnosis)],
                  ['Medication', shown(serviceUser?.medication)],
                ],
                'sm:grid-cols-2 lg:grid-cols-4',
              )}
            </section>

            <section className="px-5 py-8 sm:px-10 sm:py-10">
              {sectionHeading('Care Plans')}
              <div className="divide-y divide-oat-200 border-y border-oat-200">
                {carePlans.map(({ title, plan }) => (
                  <article
                    key={title}
                    className="grid gap-x-10 gap-y-5 py-7 lg:grid-cols-[minmax(0,1fr)_15rem]"
                  >
                    <div className="min-w-0">
                      <h3 className="text-lg font-semibold text-teal-800">{title}</h3>

                      <dl className="mt-5 flex max-w-prose flex-col gap-4">
                        {[
                          ['Description', plan?.description],
                          ['Identified Need', plan?.identified_need],
                          ['Planned Outcomes', plan?.planned_outcomes],
                          ['How to Achieve Outcomes', plan?.how_to_achieve_outcomes],
                        ].map(([label, value]) => (
                          <div key={label}>
                            <dt className="text-xs font-medium text-oat-500">{label}</dt>
                            <dd className="mt-1 text-base leading-6 text-oat-900">{shown(value)}</dd>
                          </div>
                        ))}
                      </dl>
                    </div>

                    <dl className="flex flex-col gap-4 self-start rounded-xl bg-oat-100 p-5 lg:mt-12">
                      <div>
                        <dt className="text-xs font-medium text-oat-500">Level of need</dt>
                        <dd className="mt-1 text-base font-semibold text-oat-900">
                          {shown(plan?.level_of_need)}
                        </dd>
                      </div>
                      <div className="border-t border-oat-200 pt-4">
                        <dt className="text-xs font-medium text-oat-500">Next review date</dt>
                        <dd className="mt-1 text-base font-semibold text-oat-900">
                          {shown(plan?.next_review_date)}
                        </dd>
                      </div>
                    </dl>
                  </article>
                ))}
              </div>
            </section>
          </div>
        </article>
      </div>
    </div>
  );
};
