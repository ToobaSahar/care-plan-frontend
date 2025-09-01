import React from 'react';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';

export const renderSection3 = (register, errors, setValue) => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-2">
        <Label htmlFor="primaryDiagnosis">Primary Diagnosis</Label>
        <Input
          id="primaryDiagnosis"
          {...register('primaryDiagnosis')}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="otherHealthConditions">Other Health Conditions</Label>
        <Textarea
          id="otherHealthConditions"
          {...register('otherHealthConditions')}
          rows={2}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="allergies">Allergies</Label>
        <Textarea
          id="allergies"
          {...register('allergies')}
          rows={2}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="medication">Medication</Label>
        <Textarea
          id="medication"
          {...register('medication')}
          rows={2}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="gpInvolvement">GP Involvement</Label>
        <Input
          id="gpInvolvement"
          {...register('gpInvolvement')}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="specialistSupport">Specialist Support (SALT, OT, MH)</Label>
        <Input
          id="specialistSupport"
          {...register('specialistSupport')}
        />
      </div>
    </div>
    
    <div className="space-y-2">
      <Label htmlFor="mentalHealthConcerns">Mental Health Concerns</Label>
      <Textarea
        id="mentalHealthConcerns"
        {...register('mentalHealthConcerns')}
        rows={3}
      />
    </div>
    
    <div className="space-y-2">
      <Label htmlFor="cognition">Cognition (e.g., Dementia)</Label>
      <Textarea
        id="cognition"
        {...register('cognition')}
        rows={3}
      />
    </div>
  </div>
);

export const renderSection4 = (register, errors, setValue) => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-3">
        <Label>Mobility</Label>
        <RadioGroup
          onValueChange={(value) => setValue('mobility', value)}
          className="flex flex-col space-y-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="independent" id="mobility-independent" />
            <Label htmlFor="mobility-independent">Independent</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="aided" id="mobility-aided" />
            <Label htmlFor="mobility-aided">Aided</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="hoist" id="mobility-hoist" />
            <Label htmlFor="mobility-hoist">Hoist</Label>
          </div>
        </RadioGroup>
      </div>
      
      <div className="space-y-3">
        <Label>Falls Risk</Label>
        <RadioGroup
          onValueChange={(value) => setValue('fallsRisk', value)}
          className="flex space-x-6"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="yes" id="falls-yes" />
            <Label htmlFor="falls-yes">Yes</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="no" id="falls-no" />
            <Label htmlFor="falls-no">No</Label>
          </div>
        </RadioGroup>
      </div>
      
      <div className="space-y-3">
        <Label>Personal Care</Label>
        <RadioGroup
          onValueChange={(value) => setValue('personalCare', value)}
          className="flex flex-col space-y-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="independent" id="care-independent" />
            <Label htmlFor="care-independent">Independent</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="partial" id="care-partial" />
            <Label htmlFor="care-partial">Partial Support</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="full_support" id="care-full" />
            <Label htmlFor="care-full">Full Support</Label>
          </div>
        </RadioGroup>
      </div>
      
      <div className="space-y-3">
        <Label>Continence</Label>
        <RadioGroup
          onValueChange={(value) => setValue('continence', value)}
          className="flex flex-col space-y-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="pads" id="continence-pads" />
            <Label htmlFor="continence-pads">Pads</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="toilet" id="continence-toilet" />
            <Label htmlFor="continence-toilet">Toilet</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="catheter" id="continence-catheter" />
            <Label htmlFor="continence-catheter">Catheter</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="incontinent" id="continence-incontinent" />
            <Label htmlFor="continence-incontinent">Incontinent</Label>
          </div>
        </RadioGroup>
      </div>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-2">
        <Label htmlFor="transfers">Transfers</Label>
        <Textarea
          id="transfers"
          {...register('transfers')}
          rows={2}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="eatingDrinking">Eating and Drinking</Label>
        <Textarea
          id="eatingDrinking"
          {...register('eatingDrinking')}
          rows={2}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="sleep">Sleep</Label>
        <Textarea
          id="sleep"
          {...register('sleep')}
          rows={2}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="communication">Communication</Label>
        <Textarea
          id="communication"
          {...register('communication')}
          rows={2}
        />
      </div>
    </div>
  </div>
);

export const renderSection5 = (register, errors, setValue) => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-2">
        <Label htmlFor="riskOfFalls">Risk of Falls</Label>
        <Textarea
          id="riskOfFalls"
          {...register('riskOfFalls')}
          rows={3}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="chokingRisk">Choking Risk</Label>
        <Textarea
          id="chokingRisk"
          {...register('chokingRisk')}
          rows={3}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="pressureSoresSkin">Pressure Sores / Skin</Label>
        <Textarea
          id="pressureSoresSkin"
          {...register('pressureSoresSkin')}
          rows={3}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="selfNeglect">Self-Neglect</Label>
        <Textarea
          id="selfNeglect"
          {...register('selfNeglect')}
          rows={3}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="medicationErrors">Medication Errors</Label>
        <Textarea
          id="medicationErrors"
          {...register('medicationErrors')}
          rows={3}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="safeguardingConcerns">Safeguarding Concerns</Label>
        <Textarea
          id="safeguardingConcerns"
          {...register('safeguardingConcerns')}
          rows={3}
        />
      </div>
    </div>
    
    <div className="space-y-2">
      <Label htmlFor="mentalCapacityDoLS">Mental Capacity / DoLS</Label>
      <Textarea
        id="mentalCapacityDoLS"
        {...register('mentalCapacityDoLS')}
        rows={3}
      />
    </div>
  </div>
);

export const renderSection6 = (register, errors, setValue) => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-2">
        <Label htmlFor="familyInvolvement">Family Involvement</Label>
        <Textarea
          id="familyInvolvement"
          {...register('familyInvolvement')}
          rows={3}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="hobbiesInterests">Hobbies / Interests</Label>
        <Textarea
          id="hobbiesInterests"
          {...register('hobbiesInterests')}
          rows={3}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="routinePreferences">Routine Preferences</Label>
        <Textarea
          id="routinePreferences"
          {...register('routinePreferences')}
          rows={3}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="spiritualReligiousSupport">Spiritual or Religious Support</Label>
        <Textarea
          id="spiritualReligiousSupport"
          {...register('spiritualReligiousSupport')}
          rows={3}
        />
      </div>
    </div>
    
    <div className="space-y-2">
      <Label htmlFor="emotionalMentalHealthSupport">Emotional / Mental Health Support Needs</Label>
      <Textarea
        id="emotionalMentalHealthSupport"
        {...register('emotionalMentalHealthSupport')}
        rows={4}
      />
    </div>
  </div>
);

export const renderSection7 = (register, errors, setValue) => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-3">
        <Label>Living Arrangements</Label>
        <RadioGroup
          onValueChange={(value) => setValue('livingArrangements', value)}
          className="flex flex-col space-y-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="alone" id="living-alone" />
            <Label htmlFor="living-alone">Alone</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="with_others" id="living-others" />
            <Label htmlFor="living-others">With Others</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="residential" id="living-residential" />
            <Label htmlFor="living-residential">Residential</Label>
          </div>
        </RadioGroup>
      </div>
      
      <div className="space-y-3">
        <Label>Community Access</Label>
        <RadioGroup
          onValueChange={(value) => setValue('communityAccess', value)}
          className="flex flex-col space-y-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="independent" id="community-independent" />
            <Label htmlFor="community-independent">Independent</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="support_needed" id="community-support" />
            <Label htmlFor="community-support">Support Needed</Label>
          </div>
        </RadioGroup>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="pets">Pets</Label>
        <Input
          id="pets"
          {...register('pets')}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="smokingAlcohol">Smoking / Alcohol</Label>
        <Input
          id="smokingAlcohol"
          {...register('smokingAlcohol')}
        />
      </div>
    </div>
    
    <div className="space-y-2">
      <Label htmlFor="transportNeeds">Transport Needs</Label>
      <Textarea
        id="transportNeeds"
        {...register('transportNeeds')}
        rows={3}
      />
    </div>
  </div>
);

export const renderSection8 = (register, errors, setValue) => (
  <div className="space-y-6">
    <div className="space-y-3">
      <Label>DNACPR in place?</Label>
      <RadioGroup
        onValueChange={(value) => setValue('dnacprInPlace', value)}
        className="flex space-x-6"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="yes" id="dnacpr-yes" />
          <Label htmlFor="dnacpr-yes">Yes</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="no" id="dnacpr-no" />
          <Label htmlFor="dnacpr-no">No</Label>
        </div>
      </RadioGroup>
    </div>
    
    <div className="space-y-2">
      <Label htmlFor="advanceCarePlan">Advance Care Plan / End-of-Life Wishes</Label>
      <Textarea
        id="advanceCarePlan"
        {...register('advanceCarePlan')}
        rows={4}
      />
    </div>
    
    <div className="space-y-2">
      <Label htmlFor="powerOfAttorney">Power of Attorney (Health/Finance)</Label>
      <Textarea
        id="powerOfAttorney"
        {...register('powerOfAttorney')}
        rows={3}
      />
    </div>
  </div>
);

export const renderSection9 = (register, errors, setValue) => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-2">
        <Label htmlFor="financialManagementNeeds">Financial Management Needs</Label>
        <Textarea
          id="financialManagementNeeds"
          {...register('financialManagementNeeds')}
          rows={3}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="ediConsiderations">Equality, Diversity, Inclusion (EDI) Considerations</Label>
        <Textarea
          id="ediConsiderations"
          {...register('ediConsiderations')}
          rows={3}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="assistiveTechnology">Assistive Technology / Equipment</Label>
        <Textarea
          id="assistiveTechnology"
          {...register('assistiveTechnology')}
          rows={3}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="legalOrdersRestrictions">Legal Orders or Restrictions (e.g., Court of Protection)</Label>
        <Textarea
          id="legalOrdersRestrictions"
          {...register('legalOrdersRestrictions')}
          rows={3}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="sexualityRelationships">Sexuality and Relationships</Label>
        <Textarea
          id="sexualityRelationships"
          {...register('sexualityRelationships')}
          rows={3}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="accessToAdvocacyServices">Access to Advocacy Services</Label>
        <Textarea
          id="accessToAdvocacyServices"
          {...register('accessToAdvocacyServices')}
          rows={3}
        />
      </div>
    </div>
  </div>
);

export const renderSection10 = (register, errors, setValue) => (
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
        <Label htmlFor="individualRepresentativeDate">Individual / Representative Date</Label>
        <Input
          id="individualRepresentativeDate"
          type="date"
          {...register('individualRepresentativeDate')}
        />
      </div>
    </div>
    
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <h4 className="text-md font-semibold text-blue-800 mb-2">Optional Attachments</h4>
      <p className="text-blue-700 text-sm mb-3">The following documents can be attached if available:</p>
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

