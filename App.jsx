import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { Label } from './components/ui/label';
import { Textarea } from './components/ui/textarea';
import { RadioGroup, RadioGroupItem } from './components/ui/radio-group';
import { Progress } from './components/ui/progress';
import { ChevronLeft, ChevronRight, Save, FileText, User, Heart, Shield, Users, Home, FileCheck, Settings, Signature } from 'lucide-react';
import { renderSection3, renderSection4, renderSection5, renderSection6, renderSection7, renderSection8, renderSection9 } from './components/AllSections';
import './App.css';

// Complete form validation schema
const formSchema = z.object({
  // Section 1: Personal Details
  fullName: z.string().min(1, "Full name is required"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  nhsNumber: z.string().min(1, "NHS number is required"),
  localAuthorityNumber: z.string().optional(),
  preferredName: z.string().optional(),
  address: z.string().min(1, "Address is required"),
  postcode: z.string().optional(),
  phoneNumber: z.string().min(1, "Phone number is required"),
  gpNameContact: z.string().min(1, "GP name and contact is required"),
  emergencyContactName: z.string().min(1, "Emergency contact name is required"),
  emergencyContactNumber: z.string().min(1, "Emergency contact number is required"),
  relationshipToServiceUser: z.string().min(1, "Relationship to service user is required"),
  
  // Section 2: Basic Details
  communicationNeeds: z.string().optional(),
  communicationAids: z.string().optional(),
  languageSpoken: z.string().optional(),
  religion: z.string().optional(),
  ethnicity: z.string().optional(),
  culturalPreferences: z.string().optional(),
  consentForSharingInfo: z.enum(["yes", "no"]).optional(),
  capacityForCareDecisions: z.enum(["yes", "no", "requires_assessment"]).optional(),
  accessToAccommodation: z.string().optional(),
  keySafe: z.enum(["yes", "no"]).optional(),
  whoOpensTheDoor: z.string().optional(),
  lifelineInPlace: z.enum(["yes", "no"]).optional(),
  
  // Section 3: Health and Wellbeing
  primaryDiagnosis: z.string().optional(),
  otherHealthConditions: z.string().optional(),
  allergies: z.string().optional(),
  medication: z.string().optional(),
  gpInvolvement: z.string().optional(),
  specialistSupport: z.string().optional(),
  mentalHealthConcerns: z.string().optional(),
  cognition: z.string().optional(),
  
  // Section 4: Daily Living
  mobility: z.enum(["independent", "aided", "hoist"]).optional(),
  transfers: z.string().optional(),
  fallsRisk: z.enum(["yes", "no"]).optional(),
  eatingDrinking: z.string().optional(),
  personalCare: z.enum(["independent", "partial", "full_support"]).optional(),
  continence: z.enum(["pads", "toilet", "catheter", "incontinent"]).optional(),
  sleep: z.string().optional(),
  communication: z.string().optional(),
  
  // Section 5: Risks & Safeguarding
  riskOfFalls: z.string().optional(),
  chokingRisk: z.string().optional(),
  pressureSoresSkin: z.string().optional(),
  selfNeglect: z.string().optional(),
  medicationRiskAssessment: z.string().optional(),
  safeguardingConcerns: z.string().optional(),
  mentalCapacityDols: z.string().optional(),
  personalEvacuationPlan: z.string().optional(),
  
  // Section 6: Social & Emotional Wellbeing
  familyInvolvement: z.string().optional(),
  hobbiesInterests: z.string().optional(),
  routinePreferences: z.string().optional(),
  spiritualReligiousSupport: z.string().optional(),
  emotionalMentalHealthSupport: z.string().optional(),
  
  // Section 7: Environment & Lifestyle
  livingArrangements: z.enum(["alone", "with_others", "residential"]).optional(),
  pets: z.string().optional(),
  smokingAlcohol: z.string().optional(),
  communityAccess: z.enum(["independent", "support_needed"]).optional(),
  transportNeeds: z.string().optional(),
  hoardingClutter: z.string().optional(),
  
  // Section 8: Advance Preferences
  dnacprInPlace: z.enum(["yes", "no"]).optional(),
  respectFormInPlace: z.enum(["yes", "no"]).optional(),
  advanceCarePlan: z.string().optional(),
  powerOfAttorney: z.string().optional(),
  
  // Section 9: Optional Areas
  financialManagementNeeds: z.string().optional(),
  ediConsiderations: z.string().optional(),
  assistiveTechnology: z.string().optional(),
  legalOrdersRestrictions: z.string().optional(),
  sexualityRelationships: z.string().optional(),
  accessToAdvocacyServices: z.string().optional(),
  
  // Section 10: Signatures
  assessorName: z.string().min(1, "Assessor name is required"),
  assessorSignature: z.string().optional(),
  assessorDate: z.string().min(1, "Assessor date is required"),
  individualRepresentativeName: z.string().optional(),
  individualRepresentativeSignature: z.string().optional(),
  individualRepresentativeDate: z.string().optional(),
});

const sections = [
  { id: 1, title: "Personal Details", icon: User, description: "Basic personal information" },
  { id: 2, title: "Basic Details", icon: FileText, description: "Communication and cultural needs" },
  { id: 3, title: "Health and Wellbeing", icon: Heart, description: "Medical history and conditions" },
  { id: 4, title: "Daily Living", icon: Home, description: "Daily activities and support needs" },
  { id: 5, title: "Risks & Safeguarding", icon: Shield, description: "Risk assessment and safety" },
  { id: 6, title: "Social & Emotional Wellbeing", icon: Users, description: "Social connections and emotional needs" },
  { id: 7, title: "Environment & Lifestyle", icon: Home, description: "Living situation and lifestyle" },
  { id: 8, title: "Advance Preferences", icon: FileCheck, description: "Future care preferences" },
  { id: 9, title: "Optional Areas", icon: Settings, description: "Additional considerations" },
  { id: 10, title: "Signatures", icon: Signature, description: "Form completion and consent" },
];

function App() {
  const [currentSection, setCurrentSection] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      console.log('Form data:', data);
      
      // Simulate AI analysis
      const mockAnalysis = {
        riskLevel: 'medium',
        qualityScore: 85,
        compliant: true
      };
      
      alert(`Form submitted successfully! 
      
AI Analysis Summary:
- Risk Level: ${mockAnalysis.riskLevel}
- Quality Score: ${mockAnalysis.qualityScore}%
- Compliance: ${mockAnalysis.compliant ? 'Compliant' : 'Issues found'}

Note: This is a demo version. In production, this would integrate with Supabase and Relevance AI.`);
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Error submitting form. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextSection = () => {
    if (currentSection < sections.length) {
      setCurrentSection(currentSection + 1);
    }
  };

  const prevSection = () => {
    if (currentSection > 1) {
      setCurrentSection(currentSection - 1);
    }
  };

  const progress = (currentSection / sections.length) * 100;

  const renderSection1 = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="fullName">Full Name *</Label>
          <Input
            id="fullName"
            {...register('fullName')}
            className={errors.fullName ? 'border-red-500' : ''}
          />
          {errors.fullName && <p className="text-red-500 text-sm">{errors.fullName.message}</p>}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="dateOfBirth">Date of Birth *</Label>
          <Input
            id="dateOfBirth"
            type="date"
            {...register('dateOfBirth')}
            className={errors.dateOfBirth ? 'border-red-500' : ''}
          />
          {errors.dateOfBirth && <p className="text-red-500 text-sm">{errors.dateOfBirth.message}</p>}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="nhsNumber">NHS Number *</Label>
          <Input
            id="nhsNumber"
            {...register('nhsNumber')}
            placeholder="e.g., 485 629 1940"
            className={errors.nhsNumber ? 'border-red-500' : ''}
          />
          {errors.nhsNumber && <p className="text-red-500 text-sm">{errors.nhsNumber.message}</p>}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="localAuthorityNumber">Local Authority Number</Label>
          <Input
            id="localAuthorityNumber"
            {...register('localAuthorityNumber')}
            placeholder="e.g., Lincs-230582"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="preferredName">Preferred Name</Label>
          <Input
            id="preferredName"
            {...register('preferredName')}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="postcode">Postcode</Label>
          <Input
            id="postcode"
            {...register('postcode')}
            placeholder="e.g., NG31 8QT"
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="address">Address *</Label>
        <Textarea
          id="address"
          {...register('address')}
          className={errors.address ? 'border-red-500' : ''}
          rows={3}
        />
        {errors.address && <p className="text-red-500 text-sm">{errors.address.message}</p>}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="phoneNumber">Phone Number *</Label>
          <Input
            id="phoneNumber"
            {...register('phoneNumber')}
            className={errors.phoneNumber ? 'border-red-500' : ''}
          />
          {errors.phoneNumber && <p className="text-red-500 text-sm">{errors.phoneNumber.message}</p>}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="gpNameContact">GP Name & Contact *</Label>
          <Input
            id="gpNameContact"
            {...register('gpNameContact')}
            className={errors.gpNameContact ? 'border-red-500' : ''}
          />
          {errors.gpNameContact && <p className="text-red-500 text-sm">{errors.gpNameContact.message}</p>}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="emergencyContactName">Emergency Contact Name *</Label>
          <Input
            id="emergencyContactName"
            {...register('emergencyContactName')}
            className={errors.emergencyContactName ? 'border-red-500' : ''}
          />
          {errors.emergencyContactName && <p className="text-red-500 text-sm">{errors.emergencyContactName.message}</p>}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="emergencyContactNumber">Emergency Contact Number *</Label>
          <Input
            id="emergencyContactNumber"
            {...register('emergencyContactNumber')}
            className={errors.emergencyContactNumber ? 'border-red-500' : ''}
          />
          {errors.emergencyContactNumber && <p className="text-red-500 text-sm">{errors.emergencyContactNumber.message}</p>}
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="relationshipToServiceUser">Relationship to Service User *</Label>
        <Input
          id="relationshipToServiceUser"
          {...register('relationshipToServiceUser')}
          className={errors.relationshipToServiceUser ? 'border-red-500' : ''}
        />
        {errors.relationshipToServiceUser && <p className="text-red-500 text-sm">{errors.relationshipToServiceUser.message}</p>}
      </div>
    </div>
  );

  const renderSection2 = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="communicationNeeds">Communication Needs</Label>
          <Input
            id="communicationNeeds"
            {...register('communicationNeeds')}
            placeholder="e.g., Speaks softly, wears hearing aids"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="communicationAids">Communication Aids</Label>
          <Input
            id="communicationAids"
            {...register('communicationAids')}
            placeholder="e.g., Hearing aids, visual cue cards"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="languageSpoken">Language Spoken</Label>
          <Input
            id="languageSpoken"
            {...register('languageSpoken')}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="religion">Religion / Beliefs</Label>
          <Input
            id="religion"
            {...register('religion')}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="ethnicity">Ethnicity</Label>
          <Input
            id="ethnicity"
            {...register('ethnicity')}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="accessToAccommodation">Access to Accommodation</Label>
          <Input
            id="accessToAccommodation"
            {...register('accessToAccommodation')}
            placeholder="e.g., Front door with key safe"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="whoOpensTheDoor">Who Opens the Door</Label>
          <Input
            id="whoOpensTheDoor"
            {...register('whoOpensTheDoor')}
            placeholder="e.g., Carers or daughter"
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="culturalPreferences">Cultural Preferences</Label>
        <Textarea
          id="culturalPreferences"
          {...register('culturalPreferences')}
          rows={3}
          placeholder="e.g., Prefers English food, traditional music"
        />
      </div>
      
      <div className="space-y-4">
        <div className="space-y-3">
          <Label>Consent for Sharing Info</Label>
          <RadioGroup
            onValueChange={(value) => setValue('consentForSharingInfo', value)}
            className="flex space-x-6"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="consent-yes" />
              <Label htmlFor="consent-yes">Yes</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="consent-no" />
              <Label htmlFor="consent-no">No</Label>
            </div>
          </RadioGroup>
        </div>
        
        <div className="space-y-3">
          <Label>Capacity for Care Decisions</Label>
          <RadioGroup
            onValueChange={(value) => setValue('capacityForCareDecisions', value)}
            className="flex flex-col space-y-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="capacity-yes" />
              <Label htmlFor="capacity-yes">Yes</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="capacity-no" />
              <Label htmlFor="capacity-no">No</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="requires_assessment" id="capacity-assessment" />
              <Label htmlFor="capacity-assessment">Requires Assessment</Label>
            </div>
          </RadioGroup>
        </div>
        
        <div className="space-y-3">
          <Label>Key Safe</Label>
          <RadioGroup
            onValueChange={(value) => setValue('keySafe', value)}
            className="flex space-x-6"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="keysafe-yes" />
              <Label htmlFor="keysafe-yes">Yes</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="keysafe-no" />
              <Label htmlFor="keysafe-no">No</Label>
            </div>
          </RadioGroup>
        </div>
        
        <div className="space-y-3">
          <Label>Lifeline in Place</Label>
          <RadioGroup
            onValueChange={(value) => setValue('lifelineInPlace', value)}
            className="flex space-x-6"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="lifeline-yes" />
              <Label htmlFor="lifeline-yes">Yes</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="lifeline-no" />
              <Label htmlFor="lifeline-no">No</Label>
            </div>
          </RadioGroup>
        </div>
      </div>
    </div>
  );

  const renderSection10 = () => (
    <div className="space-y-6">
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
        <h3 className="text-lg font-semibold text-yellow-800 mb-2">Form Completion & Signatures</h3>
        <p className="text-yellow-700">Please ensure all required fields are completed before signing.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="assessorName">Assessor Name *</Label>
          <Input
            id="assessorName"
            {...register('assessorName')}
            className={errors.assessorName ? 'border-red-500' : ''}
          />
          {errors.assessorName && <p className="text-red-500 text-sm">{errors.assessorName.message}</p>}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="assessorSignature">Assessor Signature</Label>
          <Input
            id="assessorSignature"
            {...register('assessorSignature')}
            placeholder="Digital signature or typed name"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="assessorDate">Assessor Date *</Label>
          <Input
            id="assessorDate"
            type="date"
            {...register('assessorDate')}
            className={errors.assessorDate ? 'border-red-500' : ''}
          />
          {errors.assessorDate && <p className="text-red-500 text-sm">{errors.assessorDate.message}</p>}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="individualRepresentativeName">Individual / Representative Name</Label>
          <Input
            id="individualRepresentativeName"
            {...register('individualRepresentativeName')}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="individualRepresentativeSignature">Individual / Representative Signature</Label>
          <Input
            id="individualRepresentativeSignature"
            {...register('individualRepresentativeSignature')}
            placeholder="Digital signature or typed name"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="individualRepresentativeDate">Individual / Representative Date</Label>
          <Input
            id="individualRepresentativeDate"
            type="date"
            {...register('individualRepresentativeDate')}
          />
        </div>
      </div>
      
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
        <h4 className="text-md font-semibold text-blue-800 mb-2">Optional Attachments</h4>
        <p className="text-blue-700 text-sm mb-2">The following documents may be attached to this assessment:</p>
        <ul className="text-blue-700 text-sm space-y-1">
          <li>• Risk assessments (falls, pressure ulcers, choking, mental capacity)</li>
          <li>• GP summary or hospital discharge letter</li>
          <li>• Medication list</li>
          <li>• Consent forms</li>
          <li>• Power of Attorney documentation</li>
          <li>• DNACPR form</li>
          <li>• Communication Passport or Health Action Plan</li>
        </ul>
      </div>
    </div>
  );

  const renderCurrentSection = () => {
    switch (currentSection) {
      case 1:
        return renderSection1();
      case 2:
        return renderSection2();
      case 3:
        return renderSection3(register, setValue, errors);
      case 4:
        return renderSection4(register, setValue, errors);
      case 5:
        return renderSection5(register, setValue, errors);
      case 6:
        return renderSection6(register, setValue, errors);
      case 7:
        return renderSection7(register, setValue, errors);
      case 8:
        return renderSection8(register, setValue, errors);
      case 9:
        return renderSection9(register, setValue, errors);
      case 10:
        return renderSection10();
      default:
        return (
          <div className="text-center py-8 text-gray-500">
            <p>Section {currentSection} - Coming Soon</p>
            <p className="text-sm mt-2">This section will contain additional form fields for comprehensive care assessment.</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Universal Care Needs Assessment Form
          </h1>
          <p className="text-lg text-gray-600">
            For Use by Registered Managers, Care Coordinators, or Assessors
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">
              Section {currentSection} of {sections.length}
            </span>
            <span className="text-sm font-medium text-gray-700">
              {Math.round(progress)}% Complete
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Section Navigation */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-8">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <button
                key={section.id}
                onClick={() => setCurrentSection(section.id)}
                className={`p-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                  currentSection === section.id
                    ? 'bg-blue-600 text-white shadow-lg'
                    : currentSection > section.id
                    ? 'bg-green-100 text-green-800 hover:bg-green-200'
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-4 h-4 mx-auto mb-1" />
                <div className="truncate">{section.title}</div>
              </button>
            );
          })}
        </div>

        {/* Main Form */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <Card className="shadow-xl">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
              <CardTitle className="flex items-center space-x-2">
                {React.createElement(sections[currentSection - 1].icon, { className: "w-6 h-6" })}
                <span>Section {currentSection}: {sections[currentSection - 1].title}</span>
              </CardTitle>
              <CardDescription className="text-blue-100">
                {sections[currentSection - 1].description}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              {renderCurrentSection()}
            </CardContent>
          </Card>

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center mt-8">
            <Button
              type="button"
              variant="outline"
              onClick={prevSection}
              disabled={currentSection === 1}
              className="flex items-center space-x-2"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </Button>

            <div className="flex space-x-4">
              <Button
                type="button"
                variant="outline"
                className="flex items-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>Save Draft</span>
              </Button>

              {currentSection === sections.length ? (
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center space-x-2 bg-green-600 hover:bg-green-700"
                >
                  <FileCheck className="w-4 h-4" />
                  <span>{isSubmitting ? 'Submitting...' : 'Submit Form'}</span>
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={nextSection}
                  className="flex items-center space-x-2"
                >
                  <span>Next</span>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        </form>

        {/* Demo Notice */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-blue-800 mb-2">Demo Version</h3>
          <p className="text-blue-700 text-sm">
            This is a working demo of the Universal Care Needs Assessment Form. 
            In production, this would integrate with Supabase for data storage and Relevance AI for intelligent analysis.
            The form includes comprehensive validation, multi-section navigation, and professional UI design.
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;

