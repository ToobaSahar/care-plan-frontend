import React from 'react';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';

// Section 3: Health and Wellbeing
export const renderSection3 = (register, setValue, errors) => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-2">
        <Label htmlFor="primaryDiagnosis">Primary Diagnosis</Label>
        <Textarea
          id="primaryDiagnosis"
          {...register('primaryDiagnosis')}
          rows={2}
          placeholder="e.g., Parkinson's Disease"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="otherHealthConditions">Other Health Conditions</Label>
        <Textarea
          id="otherHealthConditions"
          {...register('otherHealthConditions')}
          rows={2}
          placeholder="e.g., Hypertension, mild dysphagia"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="allergies">Allergies</Label>
        <Textarea
          id="allergies"
          {...register('allergies')}
          rows={2}
          placeholder="e.g., None known"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="medication">Medication</Label>
        <Textarea
          id="medication"
          {...register('medication')}
          rows={2}
          placeholder="e.g., Co-careldopa, Amlodipine, Aspirin"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="gpInvolvement">GP Involvement</Label>
        <Textarea
          id="gpInvolvement"
          {...register('gpInvolvement')}
          rows={2}
          placeholder="e.g., Monthly reviews"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="specialistSupport">Specialist Support (SALT, OT, MH)</Label>
        <Textarea
          id="specialistSupport"
          {...register('specialistSupport')}
          rows={2}
          placeholder="e.g., SALT for swallowing; OT for daily aids"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="mentalHealthConcerns">Mental Health Concerns</Label>
        <Textarea
          id="mentalHealthConcerns"
          {...register('mentalHealthConcerns')}
          rows={2}
          placeholder="e.g., Mild depression; managed with activities"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="cognition">Cognition (e.g., Dementia)</Label>
        <Textarea
          id="cognition"
          {...register('cognition')}
          rows={2}
          placeholder="e.g., Alert with mild memory lapses"
        />
      </div>
    </div>
  </div>
);

// Section 4: Daily Living
export const renderSection4 = (register, setValue, errors) => (
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
      
      <div className="space-y-2">
        <Label htmlFor="transfers">Transfers</Label>
        <Textarea
          id="transfers"
          {...register('transfers')}
          rows={2}
          placeholder="e.g., Supervised - Uses bed rail and grab bars"
        />
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
      
      <div className="space-y-2">
        <Label htmlFor="eatingDrinking">Eating and Drinking</Label>
        <Textarea
          id="eatingDrinking"
          {...register('eatingDrinking')}
          rows={2}
          placeholder="Support needed? Dietary needs? e.g., Needs prompts and thickened fluids"
        />
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
            <Label htmlFor="care-partial">Partial</Label>
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
      
      <div className="space-y-2">
        <Label htmlFor="sleep">Sleep</Label>
        <Textarea
          id="sleep"
          {...register('sleep')}
          rows={2}
          placeholder="Normal / Disturbed / Needs checks - e.g., Wakes twice nightly to toilet"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="communication">Communication</Label>
        <Textarea
          id="communication"
          {...register('communication')}
          rows={2}
          placeholder="Verbal / Non-verbal / Hearing aids - e.g., Requires slower speech and eye contact"
        />
      </div>
    </div>
  </div>
);

// Section 5: Risks & Safeguarding
export const renderSection5 = (register, setValue, errors) => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-2">
        <Label htmlFor="riskOfFalls">Risk of Falls</Label>
        <Textarea
          id="riskOfFalls"
          {...register('riskOfFalls')}
          rows={2}
          placeholder="e.g., Yes – prevention plan in place"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="chokingRisk">Choking Risk</Label>
        <Textarea
          id="chokingRisk"
          {...register('chokingRisk')}
          rows={2}
          placeholder="e.g., Yes – SALT recommendations followed"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="pressureSoresSkin">Pressure Sores / Skin</Label>
        <Textarea
          id="pressureSoresSkin"
          {...register('pressureSoresSkin')}
          rows={2}
          placeholder="e.g., No current issues, heels checked daily"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="selfNeglect">Self-Neglect</Label>
        <Textarea
          id="selfNeglect"
          {...register('selfNeglect')}
          rows={2}
          placeholder="e.g., No – engages well with carers"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="medicationRiskAssessment">Medication Risk Assessment</Label>
        <Textarea
          id="medicationRiskAssessment"
          {...register('medicationRiskAssessment')}
          rows={2}
          placeholder="e.g., Needs full support with meds"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="safeguardingConcerns">Safeguarding Concerns</Label>
        <Textarea
          id="safeguardingConcerns"
          {...register('safeguardingConcerns')}
          rows={2}
          placeholder="e.g., No concerns"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="mentalCapacityDols">Mental Capacity / DoLS</Label>
        <Textarea
          id="mentalCapacityDols"
          {...register('mentalCapacityDols')}
          rows={2}
          placeholder="e.g., No DoLS; has capacity"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="personalEvacuationPlan">Personal Evacuation Plan [Fire Risk Assessment]</Label>
        <Textarea
          id="personalEvacuationPlan"
          {...register('personalEvacuationPlan')}
          rows={2}
          placeholder="e.g., Yes – PEEP completed; frame accessible near exits"
        />
      </div>
    </div>
  </div>
);

// Section 6: Social & Emotional Wellbeing
export const renderSection6 = (register, setValue, errors) => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-2">
        <Label htmlFor="familyInvolvement">Family Involvement</Label>
        <Textarea
          id="familyInvolvement"
          {...register('familyInvolvement')}
          rows={2}
          placeholder="e.g., Daughter visits 4x/week, very involved"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="hobbiesInterests">Hobbies / Interests</Label>
        <Textarea
          id="hobbiesInterests"
          {...register('hobbiesInterests')}
          rows={2}
          placeholder="e.g., Gardening, cricket on TV, word searches"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="routinePreferences">Routine Preferences</Label>
        <Textarea
          id="routinePreferences"
          {...register('routinePreferences')}
          rows={2}
          placeholder="e.g., Tea at 7 AM, prefers evening bath"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="spiritualReligiousSupport">Spiritual or Religious Support</Label>
        <Textarea
          id="spiritualReligiousSupport"
          {...register('spiritualReligiousSupport')}
          rows={2}
          placeholder="e.g., Watches televised Sunday service"
        />
      </div>
      
      <div className="space-y-2 md:col-span-2">
        <Label htmlFor="emotionalMentalHealthSupport">Emotional / Mental Health Support Needs</Label>
        <Textarea
          id="emotionalMentalHealthSupport"
          {...register('emotionalMentalHealthSupport')}
          rows={3}
          placeholder="e.g., Enjoys 1:1 conversation and music for mood regulation"
        />
      </div>
    </div>
  </div>
);

// Section 7: Environment & Lifestyle
export const renderSection7 = (register, setValue, errors) => (
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
            <Label htmlFor="living-others">With others</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="residential" id="living-residential" />
            <Label htmlFor="living-residential">Residential</Label>
          </div>
        </RadioGroup>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="pets">Pets</Label>
        <Textarea
          id="pets"
          {...register('pets')}
          rows={2}
          placeholder="e.g., None"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="smokingAlcohol">Smoking / Alcohol</Label>
        <Textarea
          id="smokingAlcohol"
          {...register('smokingAlcohol')}
          rows={2}
          placeholder="e.g., No"
        />
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
            <Label htmlFor="community-support">Support needed</Label>
          </div>
        </RadioGroup>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="transportNeeds">Transport Needs</Label>
        <Textarea
          id="transportNeeds"
          {...register('transportNeeds')}
          rows={2}
          placeholder="e.g., Wheelchair transport for hospital appointments"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="hoardingClutter">Hoarding/Clutter</Label>
        <Textarea
          id="hoardingClutter"
          {...register('hoardingClutter')}
          rows={2}
          placeholder="e.g., Tidy – no issues noted"
        />
      </div>
    </div>
  </div>
);

// Section 8: Advance Preferences
export const renderSection8 = (register, setValue, errors) => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
      
      <div className="space-y-3">
        <Label>ReSPECT Form in place?</Label>
        <RadioGroup
          onValueChange={(value) => setValue('respectFormInPlace', value)}
          className="flex space-x-6"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="yes" id="respect-yes" />
            <Label htmlFor="respect-yes">Yes</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="no" id="respect-no" />
            <Label htmlFor="respect-no">No</Label>
          </div>
        </RadioGroup>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="advanceCarePlan">Advance Care Plan / End-of-Life Wishes</Label>
        <Textarea
          id="advanceCarePlan"
          {...register('advanceCarePlan')}
          rows={3}
          placeholder="e.g., Wishes to stay in residence if condition worsens"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="powerOfAttorney">Power of Attorney (Health/Finance)</Label>
        <Textarea
          id="powerOfAttorney"
          {...register('powerOfAttorney')}
          rows={3}
          placeholder="e.g., Yes – daughter Jane Hamilton"
        />
      </div>
    </div>
  </div>
);

// Section 9: Optional Areas
export const renderSection9 = (register, setValue, errors) => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-2">
        <Label htmlFor="financialManagementNeeds">Financial Management Needs</Label>
        <Textarea
          id="financialManagementNeeds"
          {...register('financialManagementNeeds')}
          rows={2}
          placeholder="e.g., Requires support with bill payments"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="ediConsiderations">Equality, Diversity, Inclusion (EDI) Considerations</Label>
        <Textarea
          id="ediConsiderations"
          {...register('ediConsiderations')}
          rows={2}
          placeholder="e.g., Cultural dietary requirements"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="assistiveTechnology">Assistive Technology / Equipment</Label>
        <Textarea
          id="assistiveTechnology"
          {...register('assistiveTechnology')}
          rows={2}
          placeholder="e.g., Walking frame, hearing aids"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="legalOrdersRestrictions">Legal Orders or Restrictions (e.g., Court of Protection)</Label>
        <Textarea
          id="legalOrdersRestrictions"
          {...register('legalOrdersRestrictions')}
          rows={2}
          placeholder="e.g., None in place"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="sexualityRelationships">Sexuality and Relationships</Label>
        <Textarea
          id="sexualityRelationships"
          {...register('sexualityRelationships')}
          rows={2}
          placeholder="e.g., Widowed, maintains friendships"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="accessToAdvocacyServices">Access to Advocacy Services</Label>
        <Textarea
          id="accessToAdvocacyServices"
          {...register('accessToAdvocacyServices')}
          rows={2}
          placeholder="e.g., Not currently required"
        />
      </div>
    </div>
  </div>
);

