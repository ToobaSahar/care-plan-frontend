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
import jsPDF from 'jspdf';
import { Button } from '../components/ui';

export const CriticalInformationPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const userId = searchParams.get('userId');
  const [serviceUser, setServiceUser] = useState<any>(null);
  const [healthCarePlan, setHealthCarePlan] = useState<any>(null);
  const [dailyLivingCarePlan, setDailyLivingCarePlan] = useState<any>(null);
  const [risksSafeguardingCarePlan, setRisksSafeguardingCarePlan] = useState<any>(null);
  const [socialEmotionalCarePlan, setSocialEmotionalCarePlan] = useState<any>(null);
  const [environmentLifestyleCarePlan, setEnvironmentLifestyleCarePlan] = useState<any>(null);
  const [advancePreferencesCarePlan, setAdvancePreferencesCarePlan] = useState<any>(null);
  const [optionalAreasCarePlan, setOptionalAreasCarePlan] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [carePlansLoading, setCarePlansLoading] = useState(true);

  useEffect(() => {
    const fetchServiceUser = async () => {
      try {
        let serviceUserData, serviceUserError;
        
        if (userId) {
          // Fetch specific user by ID
          const { data, error } = await supabase
            .from('service_users')
            .select('*')
            .eq('id', userId)
            .single();
          serviceUserData = data;
          serviceUserError = error;
        } else {
          // Fetch the most recently saved service user from the database
          const { data, error } = await supabase
            .from('service_users')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(1)
            .single();
          serviceUserData = data;
          serviceUserError = error;
        }

        console.log('🔍 CriticalInformationPage: Fetched service user data:', serviceUserData);

        if (serviceUserError) {
          console.error('Error fetching service user:', serviceUserError);
        } else {
          // Fetch the most recently saved basic details from the database
          const { data: basicDetailsData, error: basicDetailsError } = await supabase
            .from('basic_details')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

          // Fetch the most recently saved health wellbeing from the database
          const { data: healthWellbeingData, error: healthWellbeingError } = await supabase
            .from('health_wellbeing')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

          // Merge all the data
          let mergedData = { ...serviceUserData };
          
          if (!basicDetailsError && basicDetailsData) {
            mergedData = { ...mergedData, ...basicDetailsData };
          }
          
          if (!healthWellbeingError && healthWellbeingData) {
            mergedData = { ...mergedData, ...healthWellbeingData };
          }

          // Fetch the most recent health care plan
          let healthCarePlanData, healthCarePlanError;
          if (userId) {
            // Fetch care plan for specific user
            const { data, error } = await supabase
              .from('health_care_plan')
              .select('*')
              .eq('assessment_id', userId)
              .order('created_at', { ascending: false })
              .limit(1)
              .single();
            healthCarePlanData = data;
            healthCarePlanError = error;
          } else {
            // Fetch the most recent health care plan
            const { data, error } = await supabase
              .from('health_care_plan')
              .select('*')
              .order('created_at', { ascending: false })
              .limit(1)
              .single();
            healthCarePlanData = data;
            healthCarePlanError = error;
          }

          console.log('🔍 CriticalInformationPage: Fetched health care plan data:', healthCarePlanData);

          if (!healthCarePlanError && healthCarePlanData) {
            setHealthCarePlan(healthCarePlanData);
          }

          // Fetch the most recent daily living care plan
          let dailyLivingCarePlanData, dailyLivingCarePlanError;
          if (userId) {
            const { data, error } = await supabase
              .from('daily_living_care_plan')
              .select('*')
              .eq('assessment_id', userId)
              .order('created_at', { ascending: false })
              .limit(1)
              .single();
            dailyLivingCarePlanData = data;
            dailyLivingCarePlanError = error;
          } else {
            const { data, error } = await supabase
              .from('daily_living_care_plan')
              .select('*')
              .order('created_at', { ascending: false })
              .limit(1)
              .single();
            dailyLivingCarePlanData = data;
            dailyLivingCarePlanError = error;
          }

          if (!dailyLivingCarePlanError && dailyLivingCarePlanData) {
            setDailyLivingCarePlan(dailyLivingCarePlanData);
          }

          // Fetch the most recent risks & safeguarding care plan
          let risksSafeguardingCarePlanData, risksSafeguardingCarePlanError;
          if (userId) {
            const { data, error } = await supabase
              .from('risks_safeguarding_care_plan')
              .select('*')
              .eq('assessment_id', userId)
              .order('created_at', { ascending: false })
              .limit(1)
              .single();
            risksSafeguardingCarePlanData = data;
            risksSafeguardingCarePlanError = error;
          } else {
            const { data, error } = await supabase
              .from('risks_safeguarding_care_plan')
              .select('*')
              .order('created_at', { ascending: false })
              .limit(1)
              .single();
            risksSafeguardingCarePlanData = data;
            risksSafeguardingCarePlanError = error;
          }

          if (!risksSafeguardingCarePlanError && risksSafeguardingCarePlanData) {
            setRisksSafeguardingCarePlan(risksSafeguardingCarePlanData);
          }

          // Fetch the most recent social & emotional care plan
          let socialEmotionalCarePlanData, socialEmotionalCarePlanError;
          if (userId) {
            const { data, error } = await supabase
              .from('social_emotional_care_plan')
              .select('*')
              .eq('assessment_id', userId)
              .order('created_at', { ascending: false })
              .limit(1)
              .single();
            socialEmotionalCarePlanData = data;
            socialEmotionalCarePlanError = error;
          } else {
            const { data, error } = await supabase
              .from('social_emotional_care_plan')
              .select('*')
              .order('created_at', { ascending: false })
              .limit(1)
              .single();
            socialEmotionalCarePlanData = data;
            socialEmotionalCarePlanError = error;
          }

          if (!socialEmotionalCarePlanError && socialEmotionalCarePlanData) {
            setSocialEmotionalCarePlan(socialEmotionalCarePlanData);
          }

          // Fetch the most recent environment & lifestyle care plan
          let environmentLifestyleCarePlanData, environmentLifestyleCarePlanError;
          if (userId) {
            const { data, error } = await supabase
              .from('environment_lifestyle_care_plan')
              .select('*')
              .eq('assessment_id', userId)
              .order('created_at', { ascending: false })
              .limit(1)
              .single();
            environmentLifestyleCarePlanData = data;
            environmentLifestyleCarePlanError = error;
          } else {
            const { data, error } = await supabase
              .from('environment_lifestyle_care_plan')
              .select('*')
              .order('created_at', { ascending: false })
              .limit(1)
              .single();
            environmentLifestyleCarePlanData = data;
            environmentLifestyleCarePlanError = error;
          }

          if (!environmentLifestyleCarePlanError && environmentLifestyleCarePlanData) {
            setEnvironmentLifestyleCarePlan(environmentLifestyleCarePlanData);
          }

          // Fetch the most recent advance preferences care plan
          let advancePreferencesCarePlanData, advancePreferencesCarePlanError;
          if (userId) {
            const { data, error } = await supabase
              .from('advance_preferences_care_plan')
              .select('*')
              .eq('assessment_id', userId)
              .order('created_at', { ascending: false })
              .limit(1)
              .single();
            advancePreferencesCarePlanData = data;
            advancePreferencesCarePlanError = error;
          } else {
            const { data, error } = await supabase
              .from('advance_preferences_care_plan')
              .select('*')
              .order('created_at', { ascending: false })
              .limit(1)
              .single();
            advancePreferencesCarePlanData = data;
            advancePreferencesCarePlanError = error;
          }

          if (!advancePreferencesCarePlanError && advancePreferencesCarePlanData) {
            setAdvancePreferencesCarePlan(advancePreferencesCarePlanData);
          }

          // Fetch the most recent optional areas care plan
          let optionalAreasCarePlanData, optionalAreasCarePlanError;
          if (userId) {
            const { data, error } = await supabase
              .from('optional_areas_care_plan')
              .select('*')
              .eq('assessment_id', userId)
              .order('created_at', { ascending: false })
              .limit(1)
              .single();
            optionalAreasCarePlanData = data;
            optionalAreasCarePlanError = error;
          } else {
            const { data, error } = await supabase
              .from('optional_areas_care_plan')
              .select('*')
              .order('created_at', { ascending: false })
              .limit(1)
              .single();
            optionalAreasCarePlanData = data;
            optionalAreasCarePlanError = error;
          }

          if (!optionalAreasCarePlanError && optionalAreasCarePlanData) {
            setOptionalAreasCarePlan(optionalAreasCarePlanData);
          }

          // Set care plans loading to false after all care plans are fetched
          setCarePlansLoading(false);

          setServiceUser(mergedData);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchServiceUser();
  }, []);

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

  const criticalInfoCards = [
    {
      id: 'abilities',
      title: 'Abilities',
      status: 'Assessment Not Yet Completed',
      icon: <Users className="h-[18px] w-[18px]" />,
    },
    {
      id: 'allergies',
      title: 'Allergies',
      status: 'Assessment Not Yet Completed',
      icon: <AlertTriangle className="h-[18px] w-[18px]" />,
    },
    {
      id: 'diet',
      title: 'Diet',
      status: 'Assessment Not Yet Completed',
      icon: <Utensils className="h-[18px] w-[18px]" />,
    },
    {
      id: 'high-risk',
      title: 'High Risk',
      status: 'None',
      icon: <Shield className="h-[18px] w-[18px]" />,
    },
    {
      id: 'intolerance',
      title: 'Intolerance',
      status: 'Assessment Not Yet Completed',
      icon: <Activity className="h-[18px] w-[18px]" />,
    },
    {
      id: 'medical-conditions',
      title: 'Medical Conditions',
      status: 'Assessment Not Yet Completed',
      icon: <Heart className="h-[18px] w-[18px]" />,
    }
  ];

  /* ── Presentation ────────────────────────────────────────────────────────
     Everything below reads the state above and renders it as a document: one
     sheet, hairline-ruled fields, and each care plan area set once with all
     of its fields. The PDF is drawn separately by jsPDF, so this markup is
     free to be a screen document rather than an imitation of the printout. */

  const PENDING = 'Assessment Not Yet Completed';

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

  const statusText = (status: string) => (
    <span className={status === PENDING ? 'font-normal italic text-oat-500' : undefined}>{status}</span>
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
                ['Deprivation of Liberty Safeguards', shown(serviceUser?.safeguarding_concerns)],
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
                  { title: 'Call ambulance 999', status: PENDING },
                  { title: 'Emergency Situation', status: PENDING },
                  { title: 'Rescue Medication', status: PENDING },
                  { title: 'Emergency Contacts', status: PENDING },
                  { title: 'Personal Emergency Evacuation Plan', status: PENDING },
                  { title: 'Evacuation Equipment', status: PENDING },
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
