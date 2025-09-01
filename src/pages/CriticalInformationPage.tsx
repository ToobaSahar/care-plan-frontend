import React, { useState, useEffect } from 'react';
import { ArrowLeft, Users, AlertTriangle, Utensils, Shield, Activity, Heart } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import jsPDF from 'jspdf';

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

  // Temporary function to download as text file until jsPDF is installed
  const downloadAsTextFile = () => {
    const userName = serviceUser?.full_name || 'Unknown User';
    const currentDate = new Date().toLocaleDateString();
    const currentTime = new Date().toLocaleTimeString();
    
    let content = `CRITICAL INFORMATION REPORT
Generated on: ${currentDate} at ${currentTime}
User: ${userName}
Organization: Integrative Supported Living Care - Lincolnshire
Report Type: Emergency Admission Pack

===============================================

BASIC PROFILE:
- Full Name: ${serviceUser?.full_name || 'N/A'}
- Preferred Name: ${serviceUser?.preferred_name || 'N/A'}
- Date of Birth: ${serviceUser?.date_of_birth || 'N/A'}
- Address: ${serviceUser?.address_line || 'N/A'}
- Postcode: ${serviceUser?.postcode || 'N/A'}
- Phone: ${serviceUser?.phone_number || 'N/A'}
- NHS Number: ${serviceUser?.nhs_number || 'N/A'}

===============================================

HEALTH & WELLBEING CARE PLAN:
${healthCarePlan ? JSON.stringify(healthCarePlan, null, 2) : 'No data available'}

===============================================

DAILY LIVING CARE PLAN:
${dailyLivingCarePlan ? JSON.stringify(dailyLivingCarePlan, null, 2) : 'No data available'}

===============================================

RISKS & SAFEGUARDING CARE PLAN:
${risksSafeguardingCarePlan ? JSON.stringify(risksSafeguardingCarePlan, null, 2) : 'No data available'}

===============================================

SOCIAL & EMOTIONAL CARE PLAN:
${socialEmotionalCarePlan ? JSON.stringify(socialEmotionalCarePlan, null, 2) : 'No data available'}

===============================================

ENVIRONMENT & LIFESTYLE CARE PLAN:
${environmentLifestyleCarePlan ? JSON.stringify(environmentLifestyleCarePlan, null, 2) : 'No data available'}

===============================================

ADVANCE PREFERENCES CARE PLAN:
${advancePreferencesCarePlan ? JSON.stringify(advancePreferencesCarePlan, null, 2) : 'No data available'}

===============================================

OPTIONAL AREAS CARE PLAN:
${optionalAreasCarePlan ? JSON.stringify(optionalAreasCarePlan, null, 2) : 'No data available'}

===============================================

END OF REPORT
Generated by: Care Plan Management System

NOTE: This is a temporary text file. To get PDF format, please run: npm install
`;

    // Create blob and download
    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Critical_Information_${serviceUser?.full_name || 'User'}_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
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
      title: 'ABILITIES',
      status: 'Assessment Not Yet Completed',
      icon: <Users className="w-6 h-6" />,
      bgColor: 'bg-green-100',
      badgeColor: 'bg-green-500',
      iconBgColor: 'bg-green-50'
    },
    {
      id: 'allergies',
      title: 'ALLERGIES',
      status: 'Assessment Not Yet Completed',
      icon: <AlertTriangle className="w-6 h-6" />,
      bgColor: 'bg-orange-100',
      badgeColor: 'bg-orange-500',
      iconBgColor: 'bg-orange-50'
    },
    {
      id: 'diet',
      title: 'DIET',
      status: 'Assessment Not Yet Completed',
      icon: <Utensils className="w-6 h-6" />,
      bgColor: 'bg-purple-100',
      badgeColor: 'bg-purple-500',
      iconBgColor: 'bg-purple-50'
    },
    {
      id: 'high-risk',
      title: 'High Risk',
      status: 'None',
      icon: <Shield className="w-6 h-6" />,
      bgColor: 'bg-gray-100',
      badgeColor: 'bg-gray-400',
      iconBgColor: 'bg-gray-50'
    },
    {
      id: 'intolerance',
      title: 'Intolerance',
      status: 'Assessment Not Yet Completed',
      icon: <Activity className="w-6 h-6" />,
      bgColor: 'bg-gray-100',
      badgeColor: 'bg-gray-400',
      iconBgColor: 'bg-gray-50'
    },
    {
      id: 'medical-conditions',
      title: 'Medical Conditions',
      status: 'Assessment Not Yet Completed',
      icon: <Heart className="w-6 h-6" />,
      bgColor: 'bg-gray-100',
      badgeColor: 'bg-gray-400',
      iconBgColor: 'bg-gray-50'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - Emergency Admission Pack */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto p-6">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-start">
                {/* Left Side - Back Arrow and Organization Info */}
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <button
                      onClick={() => navigate('/assessments')}
                      className="flex items-center text-blue-600 hover:text-blue-800 transition-colors mr-4"
                    >
                      <ArrowLeft className="w-5 h-5 mr-1" />
                      <span className="text-sm font-medium">Back to Assessment</span>
                    </button>
                    
                    {/* Download PDF Button */}
                    <button
                      onClick={() => downloadPDF()}
                      className="flex items-center bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors shadow-sm hover:shadow-md"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span className="text-sm font-medium">Download PDF</span>
                    </button>
                  </div>
                  <h1 className="text-2xl font-bold text-gray-800 mb-1">Integrative Supported Living Care</h1>
                  <h2 className="text-xl font-bold text-gray-800 mb-2">Lincolnshire</h2>
                  <h3 className="text-lg font-semibold text-gray-700 mb-1">
                    Emergency Admission Pack - {loading ? 'Loading...' : (serviceUser ? serviceUser.full_name : 'No Data')}
                  </h3>
                  <p className="text-sm text-gray-500">Report run on 31/07/2025 15:52 by Pellagia Margolis</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6">
        {/* Basic Profile Section */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
          {/* Basic Profile Header */}
          <div className="bg-gray-600 text-white p-4">
            <h2 className="text-lg font-bold uppercase">Basic Profile</h2>
          </div>
          
          {/* Basic Profile Content */}
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Left Column - Profile Image */}
              <div className="lg:col-span-1">
                <div className="w-32 h-32 bg-gray-300 rounded-full flex items-center justify-center mx-auto">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                    <div className="w-8 h-8 bg-gray-400 rounded-full"></div>
                  </div>
                </div>
              </div>
              
              {/* Right Columns - Profile Information */}
              <div className="lg:col-span-3">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Row 1 */}
                                     <div className="bg-gray-50 p-3 rounded">
                     <label className="block text-sm font-medium text-gray-600">First Name</label>
                     <p className="text-sm text-gray-900">
                       {loading ? 'Loading...' : (serviceUser ? splitFullName(serviceUser.full_name).firstName : '-')}
                     </p>
                   </div>
                                     <div className="bg-white p-3 rounded">
                     <label className="block text-sm font-medium text-gray-600">Last Name</label>
                     <p className="text-sm font-bold text-gray-900">
                       {loading ? 'Loading...' : (serviceUser ? splitFullName(serviceUser.full_name).lastName : '-')}
                     </p>
                   </div>
                   <div className="bg-gray-50 p-3 rounded">
                     <label className="block text-sm font-medium text-gray-600">Address</label>
                     <p className="text-sm font-bold text-gray-900">
                       {loading ? 'Loading...' : (serviceUser?.address_line || '-')}
                     </p>
                   </div>
                  
                  {/* Row 2 */}
                                     <div className="bg-white p-3 rounded">
                     <label className="block text-sm font-medium text-gray-600">Preferred Name</label>
                     <p className="text-sm text-gray-900">
                       {loading ? 'Loading...' : (serviceUser?.preferred_name || '-')}
                     </p>
                   </div>
                                     <div className="bg-gray-50 p-3 rounded">
                     <label className="block text-sm font-medium text-gray-600">Postcode</label>
                     <p className="text-sm text-gray-900">
                       {loading ? 'Loading...' : (serviceUser?.postcode || '-')}
                     </p>
                   </div>
                                     <div className="bg-white p-3 rounded">
                     <label className="block text-sm font-medium text-gray-600">Date of Birth</label>
                     <p className="text-sm text-gray-900">
                       {loading ? 'Loading...' : (serviceUser?.date_of_birth || '-')}
                     </p>
                   </div>
                  
                  {/* Row 3 */}
                                     <div className="bg-gray-50 p-3 rounded">
                     <label className="block text-sm font-medium text-gray-600">Local Authority Number</label>
                     <p className="text-sm font-bold text-gray-900">
                       {loading ? 'Loading...' : (serviceUser?.local_authority_number || '-')}
                     </p>
                   </div>
                                     <div className="bg-white p-3 rounded">
                     <label className="block text-sm font-medium text-gray-600">NHS / CHI No.</label>
                     <p className="text-sm text-gray-900">
                       {loading ? 'Loading...' : (serviceUser?.nhs_number || '-')}
                     </p>
                   </div>
                                     <div className="bg-gray-50 p-3 rounded">
                     <label className="block text-sm font-medium text-gray-600">Contact Number</label>
                     <p className="text-sm text-gray-900">
                       {loading ? 'Loading...' : (serviceUser?.phone_number || '-')}
                     </p>
                   </div>
                  
                  {/* Row 4 */}
                                     <div className="bg-white p-3 rounded">
                     <label className="block text-sm font-medium text-gray-600">Deprivation of Liberty Safeguards</label>
                     <p className="text-sm font-bold text-gray-900">
                       {loading ? 'Loading...' : (serviceUser?.safeguarding_concerns || '-')}
                     </p>
                   </div>
                                     <div className="bg-gray-50 p-3 rounded">
                     <label className="block text-sm font-medium text-gray-600">Relationship to Service User</label>
                     <p className="text-sm font-bold text-gray-900">
                       {loading ? 'Loading...' : (serviceUser?.relationship_to_service_user || '-')}
                     </p>
                   </div>
                                     <div className="bg-white p-3 rounded">
                     <label className="block text-sm font-medium text-gray-600">Emergency Contact Name</label>
                     <p className="text-sm text-gray-900">
                       {loading ? 'Loading...' : (serviceUser?.emergency_contact_name || '-')}
                     </p>
                   </div>
                  
                                     {/* Row 5 */}
                   <div className="bg-gray-50 p-3 rounded">
                     <label className="block text-sm font-medium text-gray-600">Emergency Contact Number</label>
                     <p className="text-sm text-gray-900">
                       {loading ? 'Loading...' : (serviceUser?.emergency_contact_number || '-')}
                     </p>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Critical Information Grid */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Grid Header */}
          <div className="bg-gray-600 text-white p-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold uppercase">Critical Information</h2>
              <h3 className="text-lg font-bold uppercase">
                {loading ? 'Loading...' : (serviceUser ? splitFullName(serviceUser.full_name).firstName + ' ' + splitFullName(serviceUser.full_name).lastName : 'No Data')}
              </h3>
            </div>
          </div>

          {/* Grid Content */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {criticalInfoCards.map((card) => (
                <div
                  key={card.id}
                  className={`${card.bgColor} rounded-lg p-6 border border-gray-200`}
                >
                  <div className="flex items-start space-x-4">
                    {/* Icon */}
                    <div className={`${card.iconBgColor} p-3 rounded-full`}>
                      <div className="text-gray-700">
                        {card.icon}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <p className="text-gray-700 font-medium mb-2">
                        • {card.status}
                      </p>
                    </div>
                  </div>

                  {/* Badge */}
                  <div className="mt-4">
                    <span className={`${card.badgeColor} text-white px-3 py-1 rounded-full text-sm font-medium uppercase`}>
                      {card.title}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Additional Information Section */}
        <div className="mt-8 bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-gray-600 text-white p-4">
            <h2 className="text-lg font-bold uppercase">Emergency Information</h2>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { title: 'Call ambulance 999', status: 'Assessment Not Yet Completed' },
                { title: 'Emergency Situation', status: 'Assessment Not Yet Completed' },
                { title: 'Rescue Medication', status: 'Assessment Not Yet Completed' },
                { title: 'Emergency Contacts', status: 'Assessment Not Yet Completed' },
                { title: 'Personal Emergency Evacuation Plan', status: 'Assessment Not Yet Completed' },
                { title: 'Evacuation Equipment', status: 'Assessment Not Yet Completed' }
              ].map((item, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <h3 className="text-gray-500 text-sm mb-2">{item.title}</h3>
                  <p className="text-gray-900 font-semibold">{item.status}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Additional Info Section */}
        <div className="mt-8 bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Additional Info Header */}
          <div className="bg-gray-600 text-white p-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold uppercase">Additional Info</h2>
              <h3 className="text-lg font-bold uppercase">
                {loading ? 'Loading...' : (serviceUser ? splitFullName(serviceUser.full_name).firstName + ' ' + splitFullName(serviceUser.full_name).lastName : 'No Data')}
              </h3>
            </div>
          </div>
          
          {/* Additional Info Content */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Row 1 */}
                             <div className="bg-gray-50 p-3 rounded">
                 <label className="block text-sm font-medium text-gray-600">Language Spoken</label>
                 <p className="text-sm text-gray-900">
                   {loading ? 'Loading...' : (serviceUser?.language_spoken || '-')}
                 </p>
               </div>
                             <div className="bg-white p-3 rounded">
                 <label className="block text-sm font-medium text-gray-600">Cultural Preferences</label>
                 <p className="text-sm text-gray-900">
                   {loading ? 'Loading...' : (serviceUser?.cultural_preferences || '-')}
                 </p>
               </div>
                             <div className="bg-gray-50 p-3 rounded">
                 <label className="block text-sm font-medium text-gray-600">Nationality</label>
                 <p className="text-sm text-gray-900">-</p>
               </div>
               <div className="bg-white p-3 rounded">
                 <label className="block text-sm font-medium text-gray-600">Ethnicity</label>
                 <p className="text-sm text-gray-900">
                   {loading ? 'Loading...' : (serviceUser?.ethnicity || '-')}
                 </p>
               </div>
              
              {/* Row 2 */}
                             <div className="bg-gray-50 p-3 rounded">
                 <label className="block text-sm font-medium text-gray-600">Lifeline in Place</label>
                 <p className="text-sm text-gray-900">
                   {loading ? 'Loading...' : (serviceUser?.lifeline_in_place || '-')}
                 </p>
               </div>
                             <div className="bg-white p-3 rounded">
                 <label className="block text-sm font-medium text-gray-600">Allergies</label>
                 <p className="text-sm text-gray-900">
                   {loading ? 'Loading...' : (serviceUser?.allergies || '-')}
                 </p>
               </div>
                             <div className="bg-gray-50 p-3 rounded">
                 <label className="block text-sm font-medium text-gray-600">Religion</label>
                 <p className="text-sm text-gray-900">
                   {loading ? 'Loading...' : (serviceUser?.religion_beliefs || '-')}
                 </p>
               </div>
                             <div className="bg-white p-3 rounded">
                 <label className="block text-sm font-medium text-gray-600">Primary Diagnosis</label>
                 <p className="text-sm text-gray-900">
                   {loading ? 'Loading...' : (serviceUser?.primary_diagnosis || '-')}
                 </p>
               </div>
              
                             {/* Row 3 */}
               <div className="bg-gray-50 p-3 rounded">
                 <label className="block text-sm font-medium text-gray-600">Medication</label>
                 <p className="text-sm text-gray-900">
                   {loading ? 'Loading...' : (serviceUser?.medication || '-')}
                 </p>
               </div>
              <div className="bg-white p-3 rounded">
                <label className="block text-sm font-medium text-gray-600"></label>
                <p className="text-sm text-gray-900"></p>
              </div>
              <div className="bg-gray-50 p-3 rounded">
                <label className="block text-sm font-medium text-gray-600"></label>
                <p className="text-sm text-gray-900"></p>
              </div>
              <div className="bg-white p-3 rounded">
                <label className="block text-sm font-medium text-gray-600"></label>
                <p className="text-sm text-gray-900"></p>
              </div>
                         </div>
           </div>
         </div>

         {/* Care Plan Section */}
         <div className="mt-8 bg-white rounded-lg shadow-lg overflow-hidden border-t border-gray-400 border-b border-gray-300">
           {/* Care Plan Header - White section with dark icon */}
           <div className="bg-white p-4">
             <div className="flex items-center">
               {/* Dark circular icon with document symbol */}
               <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center mr-4">
                 <div className="w-5 h-5 bg-white rounded-sm relative">
                   {/* Document icon with folded corner */}
                   <div className="w-full h-full bg-white border border-gray-300 relative">
                     <div className="absolute top-0 right-0 w-2 h-2 bg-gray-300 transform rotate-45 origin-top-left"></div>
                     <div className="absolute top-2 left-1 w-3 h-0.5 bg-gray-400"></div>
                     <div className="absolute top-3 left-1 w-2 h-0.5 bg-gray-400"></div>
                     <div className="absolute top-4 left-1 w-3 h-0.5 bg-gray-400"></div>
                   </div>
                 </div>
               </div>
               
               {/* Text content */}
               <div>
                 <p className="text-sm text-gray-700 mb-1">2. Care Plans</p>
                 <h3 className="text-xl font-bold text-gray-800 uppercase">
                   {carePlansLoading ? 'Loading...' : 'Health & Wellbeing'}
                 </h3>
               </div>
             </div>
           </div>
           
           {/* Care Plan Content - Light gray section */}
           <div className="bg-gray-50 p-4">
             <div className="flex items-start">
               <label className="text-sm font-medium text-gray-700 mr-4">Description</label>
               <p className="text-sm text-gray-700">
                 {loading ? 'Loading...' : (healthCarePlan?.description || '-')}
               </p>
             </div>
           </div>
         </div>

         {/* New Care Plan Section - Matching Screenshot Design */}
         <div className="mt-8 bg-white rounded-lg shadow-lg overflow-hidden">
           {/* Care Plan Header - Dark Grey */}
           <div className="bg-gray-600 text-white p-4">
             <div className="flex justify-between items-center">
               <h2 className="text-lg font-bold uppercase">CARE PLAN</h2>
               <h3 className="text-lg font-bold uppercase">PETER HAMILTON</h3>
             </div>
           </div>
           
           {/* Care Plan Body - Two Column Layout */}
           <div className="bg-white">
             {/* Title Row - White Background */}
             <div className="bg-white p-4 border-b border-gray-200">
               <div className="flex justify-between items-center">
                 <div className="flex-1">
                   <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                   <p className="text-base font-bold text-gray-900">Health & Wellbeing</p>
                 </div>
               </div>
             </div>
             
             {/* Identified Need Row - Light Grey Background */}
             <div className="bg-gray-50 p-4 border-b border-gray-200">
               <div className="grid grid-cols-3 gap-4">
                 <div className="col-span-2">
                   <label className="block text-sm font-medium text-gray-700 mb-1">Identified Need</label>
                   <p className="text-sm text-gray-900">
                     {loading ? 'Loading...' : (healthCarePlan?.identified_need || '-')}
                   </p>
                 </div>
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Next review date</label>
                   <p className="text-sm text-gray-900">
                     {loading ? 'Loading...' : (healthCarePlan?.next_review_date || '-')}
                   </p>
                 </div>
               </div>
             </div>
             
             {/* Planned Outcomes Row - White Background */}
             <div className="bg-white p-4 border-b border-gray-200">
               <div className="grid grid-cols-3 gap-4">
                 <div className="col-span-2">
                   <label className="block text-sm font-medium text-gray-700 mb-1">Planned Outcomes</label>
                   <p className="text-sm text-gray-900">
                     {loading ? 'Loading...' : (healthCarePlan?.planned_outcomes || '-')}
                   </p>
                 </div>
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Level of need</label>
                   <p className="text-sm text-gray-900">
                     {loading ? 'Loading...' : (healthCarePlan?.level_of_need || '-')}
                   </p>
                 </div>
               </div>
             </div>
             
             {/* How to Achieve Outcomes Row - Light Grey Background */}
             <div className="bg-gray-50 p-4">
               <div className="grid grid-cols-3 gap-4">
                 <div className="col-span-2">
                   <label className="block text-sm font-medium text-gray-700 mb-1">How to Achieve Outcomes</label>
                   <p className="text-sm text-gray-900">
                     {loading ? 'Loading...' : (healthCarePlan?.how_to_achieve_outcomes || '-')}
                   </p>
                 </div>
                 <div>
                   {/* Empty right column for this row */}
                 </div>
               </div>
             </div>
           </div>
         </div>

         {/* Repeated Care Plan Section 1 - White section with dark icon */}
         <div className="mt-8 bg-white rounded-lg shadow-lg overflow-hidden border-t border-gray-400 border-b border-gray-300">
           {/* Care Plan Header - White section with dark icon */}
           <div className="bg-white p-4">
             <div className="flex items-center">
               {/* Dark circular icon with document symbol */}
               <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center mr-4">
                 <div className="w-5 h-5 bg-white rounded-sm relative">
                   {/* Document icon with folded corner */}
                   <div className="w-full h-full bg-white border border-gray-300 relative">
                     <div className="absolute top-0 right-0 w-2 h-2 bg-gray-300 transform rotate-45 origin-top-left"></div>
                     <div className="absolute top-2 left-1 w-3 h-0.5 bg-gray-400"></div>
                     <div className="absolute top-3 left-1 w-2 h-0.5 bg-gray-400"></div>
                     <div className="absolute top-4 left-1 w-3 h-0.5 bg-gray-400"></div>
                   </div>
                 </div>
               </div>
               
               {/* Text content */}
               <div>
                 <p className="text-sm text-gray-700 mb-1">2. Care Plans</p>
                 <h3 className="text-xl font-bold text-gray-800 uppercase">
                   {carePlansLoading ? 'Loading...' : 'DAILY LIVING'}
                 </h3>
               </div>
             </div>
           </div>
           
           {/* Care Plan Content - Light gray section */}
           <div className="bg-gray-50 p-4">
             <div className="flex items-start">
               <label className="text-sm font-medium text-gray-700 mr-4">Description</label>
               <p className="text-sm text-gray-700">
                 {loading ? 'Loading...' : (dailyLivingCarePlan?.description || '-')}
               </p>
             </div>
           </div>
         </div>

         {/* Repeated Care Plan Section 2 - Matching Screenshot Design */}
         <div className="mt-8 bg-white rounded-lg shadow-lg overflow-hidden">
           {/* Care Plan Header - Dark Grey */}
           <div className="bg-gray-600 text-white p-4">
             <div className="flex justify-between items-center">
               <h2 className="text-lg font-bold uppercase">CARE PLAN</h2>
               <h3 className="text-lg font-bold uppercase">PETER HAMILTON</h3>
             </div>
           </div>
           
           {/* Care Plan Body - Two Column Layout */}
           <div className="bg-white">
             {/* Title Row - White Background */}
             <div className="bg-white p-4 border-b border-gray-200">
               <div className="flex justify-between items-center">
                 <div className="flex-1">
                   <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                   <p className="text-base font-bold text-gray-900">DAILY LIVING</p>
                 </div>
               </div>
             </div>
             
             {/* Identified Need Row - Light Grey Background */}
             <div className="bg-gray-50 p-4 border-b border-gray-200">
               <div className="grid grid-cols-3 gap-4">
                 <div className="col-span-2">
                   <label className="block text-sm font-medium text-gray-700 mb-1">Identified Need</label>
                   <p className="text-sm text-gray-900">
                     {loading ? 'Loading...' : (dailyLivingCarePlan?.identified_need || '-')}
                   </p>
                 </div>
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Next review date</label>
                   <p className="text-sm text-gray-900">
                     {loading ? 'Loading...' : (dailyLivingCarePlan?.next_review_date || '-')}
                   </p>
                 </div>
               </div>
             </div>
             
             {/* Planned Outcomes Row - White Background */}
             <div className="bg-white p-4 border-b border-gray-200">
               <div className="grid grid-cols-3 gap-4">
                 <div className="col-span-2">
                   <label className="block text-sm font-medium text-gray-700 mb-1">Planned Outcomes</label>
                   <p className="text-sm text-gray-900">
                     {loading ? 'Loading...' : (dailyLivingCarePlan?.planned_outcomes || '-')}
                   </p>
                 </div>
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Level of need</label>
                   <p className="text-sm text-gray-900">
                     {loading ? 'Loading...' : (dailyLivingCarePlan?.level_of_need || '-')}
                   </p>
                 </div>
               </div>
             </div>
             
             {/* How to Achieve Outcomes Row - Light Grey Background */}
             <div className="bg-gray-50 p-4">
               <div className="grid grid-cols-3 gap-4">
                 <div className="col-span-2">
                   <label className="block text-sm font-medium text-gray-700 mb-1">How to Achieve Outcomes</label>
                   <p className="text-sm text-gray-900">
                     {loading ? 'Loading...' : (dailyLivingCarePlan?.how_to_achieve_outcomes || '-')}
                   </p>
                 </div>
                 <div>
                   {/* Empty right column for this row */}
                 </div>
               </div>
             </div>
           </div>
         </div>

         {/* Repeated Care Plan Section 3 - White section with dark icon */}
         <div className="mt-8 bg-white rounded-lg shadow-lg overflow-hidden border-t border-gray-400 border-b border-gray-300">
           {/* Care Plan Header - White section with dark icon */}
           <div className="bg-white p-4">
             <div className="flex items-center">
               {/* Dark circular icon with document symbol */}
               <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center mr-4">
                 <div className="w-5 h-5 bg-white rounded-sm relative">
                   {/* Document icon with folded corner */}
                   <div className="w-full h-full bg-white border border-gray-300 relative">
                     <div className="absolute top-0 right-0 w-2 h-2 bg-gray-300 transform rotate-45 origin-top-left"></div>
                     <div className="absolute top-2 left-1 w-3 h-0.5 bg-gray-400"></div>
                     <div className="absolute top-3 left-1 w-2 h-0.5 bg-gray-400"></div>
                     <div className="absolute top-4 left-1 w-3 h-0.5 bg-gray-400"></div>
                   </div>
                 </div>
               </div>
               
               {/* Text content */}
               <div>
                 <p className="text-sm text-gray-700 mb-1">2. Care Plans</p>
                 <h3 className="text-xl font-bold text-gray-800 uppercase">
                   {carePlansLoading ? 'Loading...' : 'RISKS & SAFEGUARDING'}
                 </h3>
               </div>
             </div>
           </div>
           
           {/* Care Plan Content - Light gray section */}
           <div className="bg-gray-50 p-4">
             <div className="flex items-start">
               <label className="text-sm font-medium text-gray-700 mr-4">Description</label>
               <p className="text-sm text-gray-700">
                 {loading ? 'Loading...' : (risksSafeguardingCarePlan?.description || '-')}
               </p>
             </div>
           </div>
         </div>

         {/* Repeated Care Plan Section 4 - Matching Screenshot Design */}
         <div className="mt-8 bg-white rounded-lg shadow-lg overflow-hidden">
           {/* Care Plan Header - Dark Grey */}
           <div className="bg-gray-600 text-white p-4">
             <div className="flex justify-between items-center">
               <h2 className="text-lg font-bold uppercase">CARE PLAN</h2>
               <h3 className="text-lg font-bold uppercase">PETER HAMILTON</h3>
             </div>
           </div>
           
           {/* Care Plan Body - Two Column Layout */}
           <div className="bg-white">
             {/* Title Row - White Background */}
             <div className="bg-white p-4 border-b border-gray-200">
               <div className="flex justify-between items-center">
                 <div className="flex-1">
                   <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                   <p className="text-base font-bold text-gray-900">RISKS & SAFEGUARDING</p>
                 </div>
               </div>
             </div>
             
             {/* Identified Need Row - Light Grey Background */}
             <div className="bg-gray-50 p-4 border-b border-gray-200">
               <div className="grid grid-cols-3 gap-4">
                 <div className="col-span-2">
                   <label className="block text-sm font-medium text-gray-700 mb-1">Identified Need</label>
                   <p className="text-sm text-gray-900">
                     {loading ? 'Loading...' : (risksSafeguardingCarePlan?.identified_need || '-')}
                   </p>
                 </div>
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Next review date</label>
                   <p className="text-sm text-gray-900">
                     {loading ? 'Loading...' : (risksSafeguardingCarePlan?.next_review_date || '-')}
                   </p>
                 </div>
               </div>
             </div>
             
             {/* Planned Outcomes Row - White Background */}
             <div className="bg-white p-4 border-b border-gray-200">
               <div className="grid grid-cols-3 gap-4">
                 <div className="col-span-2">
                   <label className="block text-sm font-medium text-gray-700 mb-1">Planned Outcomes</label>
                   <p className="text-sm text-gray-900">
                     {loading ? 'Loading...' : (risksSafeguardingCarePlan?.planned_outcomes || '-')}
                   </p>
                 </div>
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Level of need</label>
                   <p className="text-sm text-gray-900">
                     {loading ? 'Loading...' : (risksSafeguardingCarePlan?.level_of_need || '-')}
                   </p>
                 </div>
               </div>
             </div>
             
             {/* How to Achieve Outcomes Row - Light Grey Background */}
             <div className="bg-gray-50 p-4">
               <div className="grid grid-cols-3 gap-4">
                 <div className="col-span-2">
                   <label className="block text-sm font-medium text-gray-700 mb-1">How to Achieve Outcomes</label>
                   <p className="text-sm text-gray-900">
                     {loading ? 'Loading...' : (risksSafeguardingCarePlan?.how_to_achieve_outcomes || '-')}
                   </p>
                 </div>
                 <div>
                   {/* Empty right column for this row */}
                 </div>
               </div>
             </div>
           </div>
         </div>

         {/* Repeated Care Plan Section 5 - White section with dark icon */}
         <div className="mt-8 bg-white rounded-lg shadow-lg overflow-hidden border-t border-gray-400 border-b border-gray-300">
           {/* Care Plan Header - White section with dark icon */}
           <div className="bg-white p-4">
             <div className="flex items-center">
               {/* Dark circular icon with document symbol */}
               <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center mr-4">
                 <div className="w-5 h-5 bg-white rounded-sm relative">
                   {/* Document icon with folded corner */}
                   <div className="w-full h-full bg-white border border-gray-300 relative">
                     <div className="absolute top-0 right-0 w-2 h-2 bg-gray-300 transform rotate-45 origin-top-left"></div>
                     <div className="absolute top-2 left-1 w-3 h-0.5 bg-gray-400"></div>
                     <div className="absolute top-3 left-1 w-2 h-0.5 bg-gray-400"></div>
                     <div className="absolute top-4 left-1 w-3 h-0.5 bg-gray-400"></div>
                   </div>
                 </div>
               </div>
               
               {/* Text content */}
               <div>
                 <p className="text-sm text-gray-700 mb-1">2. Care Plans</p>
                 <h3 className="text-xl font-bold text-gray-800 uppercase">
                   {carePlansLoading ? 'Loading...' : 'SOCIAL & EMOTIONAL WELLBEING'}
                 </h3>
               </div>
             </div>
           </div>
           
           {/* Care Plan Content - Light gray section */}
           <div className="bg-gray-50 p-4">
             <div className="flex items-start">
               <label className="text-sm font-medium text-gray-700 mr-4">Description</label>
               <p className="text-sm text-gray-700">
                 {loading ? 'Loading...' : (socialEmotionalCarePlan?.description || '-')}
               </p>
             </div>
           </div>
         </div>

         {/* Repeated Care Plan Section 6 - Matching Screenshot Design */}
         <div className="mt-8 bg-white rounded-lg shadow-lg overflow-hidden">
           {/* Care Plan Header - Dark Grey */}
           <div className="bg-gray-600 text-white p-4">
             <div className="flex justify-between items-center">
               <h2 className="text-lg font-bold uppercase">CARE PLAN</h2>
               <h3 className="text-lg font-bold uppercase">PETER HAMILTON</h3>
             </div>
           </div>
           
           {/* Care Plan Body - Two Column Layout */}
           <div className="bg-white">
             {/* Title Row - White Background */}
             <div className="bg-white p-4 border-b border-gray-200">
               <div className="flex justify-between items-center">
                 <div className="flex-1">
                   <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                   <p className="text-base font-bold text-gray-900">SOCIAL & EMOTIONAL WELLBEING</p>
                 </div>
               </div>
             </div>
             
             {/* Identified Need Row - Light Grey Background */}
             <div className="bg-gray-50 p-4 border-b border-gray-200">
               <div className="grid grid-cols-3 gap-4">
                 <div className="col-span-2">
                   <label className="block text-sm font-medium text-gray-700 mb-1">Identified Need</label>
                   <p className="text-sm text-gray-900">
                     {loading ? 'Loading...' : (socialEmotionalCarePlan?.identified_need || '-')}
                   </p>
                 </div>
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Next review date</label>
                   <p className="text-sm text-gray-900">
                     {loading ? 'Loading...' : (socialEmotionalCarePlan?.next_review_date || '-')}
                   </p>
                 </div>
               </div>
             </div>
             
             {/* Planned Outcomes Row - White Background */}
             <div className="bg-white p-4 border-b border-gray-200">
               <div className="grid grid-cols-3 gap-4">
                 <div className="col-span-2">
                   <label className="block text-sm font-medium text-gray-700 mb-1">Planned Outcomes</label>
                   <p className="text-sm text-gray-900">
                     {loading ? 'Loading...' : (socialEmotionalCarePlan?.planned_outcomes || '-')}
                   </p>
                 </div>
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Level of need</label>
                   <p className="text-sm text-gray-900">
                     {loading ? 'Loading...' : (socialEmotionalCarePlan?.level_of_need || '-')}
                   </p>
                 </div>
               </div>
             </div>
             
             {/* How to Achieve Outcomes Row - Light Grey Background */}
             <div className="bg-gray-50 p-4">
               <div className="grid grid-cols-3 gap-4">
                 <div className="col-span-2">
                   <label className="block text-sm font-medium text-gray-700 mb-1">How to Achieve Outcomes</label>
                   <p className="text-sm text-gray-900">
                     {loading ? 'Loading...' : (socialEmotionalCarePlan?.how_to_achieve_outcomes || '-')}
                   </p>
                 </div>
                 <div>
                   {/* Empty right column for this row */}
                 </div>
               </div>
             </div>
           </div>
         </div>

         {/* Repeated Care Plan Section 7 - White section with dark icon */}
         <div className="mt-8 bg-white rounded-lg shadow-lg overflow-hidden border-t border-gray-400 border-b border-gray-300">
           {/* Care Plan Header - White section with dark icon */}
           <div className="bg-white p-4">
             <div className="flex items-center">
               {/* Dark circular icon with document symbol */}
               <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center mr-4">
                 <div className="w-5 h-5 bg-white rounded-sm relative">
                   {/* Document icon with folded corner */}
                   <div className="w-full h-full bg-white border border-gray-300 relative">
                     <div className="absolute top-0 right-0 w-2 h-2 bg-gray-300 transform rotate-45 origin-top-left"></div>
                     <div className="absolute top-2 left-1 w-3 h-0.5 bg-gray-400"></div>
                     <div className="absolute top-3 left-1 w-2 h-0.5 bg-gray-400"></div>
                     <div className="absolute top-4 left-1 w-3 h-0.5 bg-gray-400"></div>
                   </div>
                 </div>
               </div>
               
               {/* Text content */}
               <div>
                 <p className="text-sm text-gray-700 mb-1">2. Care Plans</p>
                 <h3 className="text-xl font-bold text-gray-800 uppercase">
                   {carePlansLoading ? 'Loading...' : 'ENVIRONMENT & LIFESTYLE'}
                 </h3>
               </div>
             </div>
           </div>
           
           {/* Care Plan Content - Light gray section */}
           <div className="bg-gray-50 p-4">
             <div className="flex items-start">
               <label className="text-sm font-medium text-gray-700 mr-4">Description</label>
               <p className="text-sm text-gray-700">
                 {loading ? 'Loading...' : (environmentLifestyleCarePlan?.description || '-')}
               </p>
             </div>
           </div>
         </div>

         {/* Repeated Care Plan Section 8 - Matching Screenshot Design */}
         <div className="mt-8 bg-white rounded-lg shadow-lg overflow-hidden">
           {/* Care Plan Header - Dark Grey */}
           <div className="bg-gray-600 text-white p-4">
             <div className="flex justify-between items-center">
               <h2 className="text-lg font-bold uppercase">CARE PLAN</h2>
               <h3 className="text-lg font-bold uppercase">PETER HAMILTON</h3>
             </div>
           </div>
           
           {/* Care Plan Body - Two Column Layout */}
           <div className="bg-white">
             {/* Title Row - White Background */}
             <div className="bg-white p-4 border-b border-gray-200">
               <div className="flex justify-between items-center">
                 <div className="flex-1">
                   <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                   <p className="text-base font-bold text-gray-900">ENVIRONMENT & LIFESTYLE</p>
                 </div>
               </div>
             </div>
             
             {/* Identified Need Row - Light Grey Background */}
             <div className="bg-gray-50 p-4 border-b border-gray-200">
               <div className="grid grid-cols-3 gap-4">
                 <div className="col-span-2">
                   <label className="block text-sm font-medium text-gray-700 mb-1">Identified Need</label>
                   <p className="text-sm text-gray-900">
                     {loading ? 'Loading...' : (environmentLifestyleCarePlan?.identified_need || '-')}
                   </p>
                 </div>
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Next review date</label>
                   <p className="text-sm text-gray-900">
                     {loading ? 'Loading...' : (environmentLifestyleCarePlan?.next_review_date || '-')}
                   </p>
                 </div>
               </div>
             </div>
             
             {/* Planned Outcomes Row - White Background */}
             <div className="bg-white p-4 border-b border-gray-200">
               <div className="grid grid-cols-3 gap-4">
                 <div className="col-span-2">
                   <label className="block text-sm font-medium text-gray-700 mb-1">Planned Outcomes</label>
                   <p className="text-sm text-gray-900">
                     {loading ? 'Loading...' : (environmentLifestyleCarePlan?.planned_outcomes || '-')}
                   </p>
                 </div>
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Level of need</label>
                   <p className="text-sm text-gray-900">
                     {loading ? 'Loading...' : (environmentLifestyleCarePlan?.level_of_need || '-')}
                   </p>
                 </div>
               </div>
             </div>
             
             {/* How to Achieve Outcomes Row - Light Grey Background */}
             <div className="bg-gray-50 p-4">
               <div className="grid grid-cols-3 gap-4">
                 <div className="col-span-2">
                   <label className="block text-sm font-medium text-gray-700 mb-1">How to Achieve Outcomes</label>
                   <p className="text-sm text-gray-900">
                     {loading ? 'Loading...' : (environmentLifestyleCarePlan?.how_to_achieve_outcomes || '-')}
                   </p>
                 </div>
                 <div>
                   {/* Empty right column for this row */}
                 </div>
               </div>
             </div>
           </div>
         </div>

         {/* Repeated Care Plan Section 9 - White section with dark icon */}
         <div className="mt-8 bg-white rounded-lg shadow-lg overflow-hidden border-t border-gray-400 border-b border-gray-300">
           {/* Care Plan Header - White section with dark icon */}
           <div className="bg-white p-4">
             <div className="flex items-center">
               {/* Dark circular icon with document symbol */}
               <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center mr-4">
                 <div className="w-5 h-5 bg-white rounded-sm relative">
                   {/* Document icon with folded corner */}
                   <div className="w-full h-full bg-white border border-gray-300 relative">
                     <div className="absolute top-0 right-0 w-2 h-2 bg-gray-300 transform rotate-45 origin-top-left"></div>
                     <div className="absolute top-2 left-1 w-3 h-0.5 bg-gray-400"></div>
                     <div className="absolute top-3 left-1 w-2 h-0.5 bg-gray-400"></div>
                     <div className="absolute top-4 left-1 w-3 h-0.5 bg-gray-400"></div>
                   </div>
                 </div>
               </div>
               
               {/* Text content */}
               <div>
                 <p className="text-sm text-gray-700 mb-1">2. Care Plans</p>
                 <h3 className="text-xl font-bold text-gray-800 uppercase">
                   {carePlansLoading ? 'Loading...' : 'ADVANCE PREFERENCES'}
                 </h3>
               </div>
             </div>
           </div>
           
           {/* Care Plan Content - Light gray section */}
           <div className="bg-gray-50 p-4">
             <div className="flex items-start">
               <label className="text-sm font-medium text-gray-700 mr-4">Description</label>
               <p className="text-sm text-gray-700">
                 {loading ? 'Loading...' : (advancePreferencesCarePlan?.description || '-')}
               </p>
             </div>
           </div>
         </div>

         {/* Repeated Care Plan Section 10 - Matching Screenshot Design */}
         <div className="mt-8 bg-white rounded-lg shadow-lg overflow-hidden">
           {/* Care Plan Header - Dark Grey */}
           <div className="bg-gray-600 text-white p-4">
             <div className="flex justify-between items-center">
               <h2 className="text-lg font-bold uppercase">CARE PLAN</h2>
               <h3 className="text-lg font-bold uppercase">PETER HAMILTON</h3>
             </div>
           </div>
           
           {/* Care Plan Body - Two Column Layout */}
           <div className="bg-white">
             {/* Title Row - White Background */}
             <div className="bg-white p-4 border-b border-gray-200">
               <div className="flex justify-between items-center">
                 <div className="flex-1">
                   <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                   <p className="text-base font-bold text-gray-900">ADVANCE PREFERENCES</p>
                 </div>
               </div>
             </div>
             
             {/* Identified Need Row - Light Grey Background */}
             <div className="bg-gray-50 p-4 border-b border-gray-200">
               <div className="grid grid-cols-3 gap-4">
                 <div className="col-span-2">
                   <label className="block text-sm font-medium text-gray-700 mb-1">Identified Need</label>
                   <p className="text-sm text-gray-900">
                     {loading ? 'Loading...' : (advancePreferencesCarePlan?.identified_need || '-')}
                   </p>
                 </div>
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Next review date</label>
                   <p className="text-sm text-gray-900">
                     {loading ? 'Loading...' : (advancePreferencesCarePlan?.next_review_date || '-')}
                   </p>
                 </div>
               </div>
             </div>
             
             {/* Planned Outcomes Row - White Background */}
             <div className="bg-white p-4 border-b border-gray-200">
               <div className="grid grid-cols-3 gap-4">
                 <div className="col-span-2">
                   <label className="block text-sm font-medium text-gray-700 mb-1">Planned Outcomes</label>
                   <p className="text-sm text-gray-900">
                     {loading ? 'Loading...' : (advancePreferencesCarePlan?.planned_outcomes || '-')}
                   </p>
                 </div>
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Level of need</label>
                   <p className="text-sm text-gray-900">
                     {loading ? 'Loading...' : (advancePreferencesCarePlan?.level_of_need || '-')}
                   </p>
                 </div>
               </div>
             </div>
             
             {/* How to Achieve Outcomes Row - Light Grey Background */}
             <div className="bg-gray-50 p-4">
               <div className="grid grid-cols-3 gap-4">
                 <div className="col-span-2">
                   <label className="block text-sm font-medium text-gray-700 mb-1">How to Achieve Outcomes</label>
                   <p className="text-sm text-gray-900">
                     {loading ? 'Loading...' : (advancePreferencesCarePlan?.how_to_achieve_outcomes || '-')}
                   </p>
                 </div>
                 <div>
                   {/* Empty right column for this row */}
                 </div>
               </div>
             </div>
           </div>
         </div>

         {/* Repeated Care Plan Section 11 - White section with dark icon */}
         <div className="mt-8 bg-white rounded-lg shadow-lg overflow-hidden border-t border-gray-400 border-b border-gray-300">
           {/* Care Plan Header - White section with dark icon */}
           <div className="bg-white p-4">
             <div className="flex items-center">
               {/* Dark circular icon with document symbol */}
               <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center mr-4">
                 <div className="w-5 h-5 bg-white rounded-sm relative">
                   {/* Document icon with folded corner */}
                   <div className="w-full h-full bg-white border border-gray-300 relative">
                     <div className="absolute top-0 right-0 w-2 h-2 bg-gray-300 transform rotate-45 origin-top-left"></div>
                     <div className="absolute top-2 left-1 w-3 h-0.5 bg-gray-400"></div>
                     <div className="absolute top-3 left-1 w-2 h-0.5 bg-gray-400"></div>
                     <div className="absolute top-4 left-1 w-3 h-0.5 bg-gray-400"></div>
                   </div>
                 </div>
               </div>
               
               {/* Text content */}
               <div>
                 <p className="text-sm text-gray-700 mb-1">2. Care Plans</p>
                 <h3 className="text-xl font-bold text-gray-800 uppercase">
                   {carePlansLoading ? 'Loading...' : 'OPTIONAL AREAS'}
                 </h3>
               </div>
             </div>
           </div>
           
           {/* Care Plan Content - Light gray section */}
           <div className="bg-gray-50 p-4">
             <div className="flex items-start">
               <label className="text-sm font-medium text-gray-700 mr-4">Description</label>
               <p className="text-sm text-gray-700">
                 {loading ? 'Loading...' : (optionalAreasCarePlan?.description || '-')}
               </p>
             </div>
           </div>
         </div>

         {/* Repeated Care Plan Section 12 - Matching Screenshot Design */}
         <div className="mt-8 bg-white rounded-lg shadow-lg overflow-hidden">
           {/* Care Plan Header - Dark Grey */}
           <div className="bg-gray-600 text-white p-4">
             <div className="flex justify-between items-center">
               <h2 className="text-lg font-bold uppercase">CARE PLAN</h2>
               <h3 className="text-lg font-bold uppercase">PETER HAMILTON</h3>
             </div>
           </div>
           
           {/* Care Plan Body - Two Column Layout */}
           <div className="bg-white">
             {/* Title Row - White Background */}
             <div className="bg-white p-4 border-b border-gray-200">
               <div className="flex justify-between items-center">
                 <div className="flex-1">
                   <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                   <p className="text-base font-bold text-gray-900">OPTIONAL AREAS</p>
                 </div>
               </div>
             </div>
             
             {/* Identified Need Row - Light Grey Background */}
             <div className="bg-gray-50 p-4 border-b border-gray-200">
               <div className="grid grid-cols-3 gap-4">
                 <div className="col-span-2">
                   <label className="block text-sm font-medium text-gray-700 mb-1">Identified Need</label>
                   <p className="text-sm text-gray-900">
                     {loading ? 'Loading...' : (optionalAreasCarePlan?.identified_need || '-')}
                   </p>
                 </div>
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Next review date</label>
                   <p className="text-sm text-gray-900">
                     {loading ? 'Loading...' : (optionalAreasCarePlan?.next_review_date || '-')}
                   </p>
                 </div>
               </div>
             </div>
             
             {/* Planned Outcomes Row - White Background */}
             <div className="bg-white p-4 border-b border-gray-200">
               <div className="grid grid-cols-3 gap-4">
                 <div className="col-span-2">
                   <label className="block text-sm font-medium text-gray-700 mb-1">Planned Outcomes</label>
                   <p className="text-sm text-gray-900">
                     {loading ? 'Loading...' : (optionalAreasCarePlan?.planned_outcomes || '-')}
                   </p>
                 </div>
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Level of need</label>
                   <p className="text-sm text-gray-900">
                     {loading ? 'Loading...' : (optionalAreasCarePlan?.level_of_need || '-')}
                   </p>
                 </div>
               </div>
             </div>
             
             {/* How to Achieve Outcomes Row - Light Grey Background */}
             <div className="bg-gray-50 p-4">
               <div className="grid grid-cols-3 gap-4">
                 <div className="col-span-2">
                   <label className="block text-sm font-medium text-gray-700 mb-1">How to Achieve Outcomes</label>
                   <p className="text-sm text-gray-900">
                     {loading ? 'Loading...' : (optionalAreasCarePlan?.how_to_achieve_outcomes || '-')}
                   </p>
                 </div>
                 <div>
                   {/* Empty right column for this row */}
                 </div>
               </div>
             </div>
           </div>
         </div>
       </div>
     </div>
   );
 };
