import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { advancePreferencesSchema } from '../../schema/assessment';
import { useCurrentSectionData } from '../../state/useAssessment';
import { AlertTriangle, FileText, Shield, Heart } from 'lucide-react';

interface Section8AdvancePreferencesProps {
  isReadOnly?: boolean;
}

export const Section8AdvancePreferences: React.FC<Section8AdvancePreferencesProps> = ({ isReadOnly = false }) => {
  const { data, updateData } = useCurrentSectionData('advancePreferences');

  const {
    register,
    handleSubmit,
    setValue,
    formState: {},
  } = useForm<{ [k: string]: any }>({
    resolver: zodResolver(advancePreferencesSchema),
    defaultValues: data || {},
  });

  useEffect(() => {
    if (data) {
      Object.entries(data).forEach(([key, value]) => {
        setValue(key as any, value as any);
      });
    }
  }, [data, setValue]);

  const onSubmit = (formData: any) => {
    updateData(formData);
  };

  /* Free text commits on blur rather than per keystroke, so the record is
     written once per field instead of once per character. */
  const handleChange = (field: string, value: any) => {
    setValue(field as any, value);
  };

  const handleBlur = (field: string, value: any) => {
    updateData({ [field]: value } as any);
  };

  /**
   * A yes/no choice commits the moment it is made.
   *
   * Deferring these to blur, as the free-text fields do, was wrong in both
   * directions. A radio's blur event carries the `value` attribute of the
   * input that lost focus, not the group's selection — so tabbing through an
   * unanswered pair recorded whichever radio focus happened to land on. On
   * this section that meant a DNACPR of "Yes" could be written into a care
   * record by nothing more than passing over the field with the keyboard.
   *
   * There is also nothing to defer: a radio changes once per choice, so
   * committing on change costs one write and loses nothing. It is what
   * `SelectField` already does for the equivalent fields in Sections 4 and 5.
   */
  const handleChoice = (field: string, value: string) => {
    setValue(field as any, value);
    updateData({ [field]: value } as any);
  };

  const PreferenceArea: React.FC<{
    title: string;
    field: string;
    notesField: string;
    icon: React.ReactNode;
    notesPlaceholder: string;
  }> = ({ title, field, notesField, icon, notesPlaceholder }) => (
    <div className="cf-group">
      <h4 className="cf-group-title">
        {icon}
        <span className="ml-2">{title}</span>
      </h4>
      <div className="space-y-4">
        <div className="grid max-w-md grid-cols-2 gap-2.5">
          <label className="cf-check-row cursor-pointer">
            <input
              type="radio"
              {...register(field)}
              value="yes"
              onChange={(e) => handleChoice(field, e.target.value)}
              disabled={isReadOnly}
              className="cf-check"
            />
            <span className="text-base text-oat-900">Yes</span>
          </label>
          <label className="cf-check-row cursor-pointer">
            <input
              type="radio"
              {...register(field)}
              value="no"
              onChange={(e) => handleChoice(field, e.target.value)}
              disabled={isReadOnly}
              className="cf-check"
            />
            <span className="text-base text-oat-900">No</span>
          </label>
        </div>
        <div>
          <label className="cf-label">Notes</label>
          <textarea
            {...register(notesField)}
            onChange={(e) => handleChange(notesField, e.target.value)}
            onBlur={(e) => handleBlur(notesField, e.target.value)}
            disabled={isReadOnly}
            rows={3}
            placeholder={notesPlaceholder}
            className="cf-input"
          />
        </div>
      </div>
    </div>
  );

  if (isReadOnly) {
    return (
      <div className="space-y-6">
        <PreferenceArea 
          title="DNACPR in place?" 
          field="dnacpr_in_place" 
          notesField="dnacpr_in_place_notes" 
          icon={<AlertTriangle className="h-5 w-5 text-teal-600" />}
          notesPlaceholder="e.g., Yes – signed by GP"
        />
        <PreferenceArea 
          title="ReSPECT Form in place?" 
          field="respect_form_in_place" 
          notesField="respect_form_in_place_notes" 
          icon={<FileText className="h-5 w-5 text-blue-600" />}
          notesPlaceholder="e.g., Yes – attached"
        />
        <PreferenceArea 
          title="Advance Care Plan / End-of-Life Wishes" 
          field="advance_care_plan_wishes" 
          notesField="advance_care_plan_wishes_notes" 
          icon={<Heart className="h-5 w-5 text-teal-600" />}
          notesPlaceholder="e.g., Wishes to stay in residence if condition worsens"
        />
        <PreferenceArea 
          title="Power of Attorney (Health/Finance)" 
          field="power_of_attorney" 
          notesField="power_of_attorney_notes" 
          icon={<Shield className="h-5 w-5 text-teal-600" />}
          notesPlaceholder="e.g., Yes – daughter Jane Hamilton"
        />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <PreferenceArea 
        title="DNACPR in place?" 
        field="dnacpr_in_place" 
        notesField="dnacpr_in_place_notes" 
        icon={<AlertTriangle className="h-5 w-5 text-teal-600" />}
        notesPlaceholder="e.g., Yes – signed by GP"
      />
      <PreferenceArea 
        title="ReSPECT Form in place?" 
        field="respect_form_in_place" 
        notesField="respect_form_in_place_notes" 
        icon={<FileText className="h-5 w-5 text-blue-600" />}
        notesPlaceholder="e.g., Yes – attached"
      />
      <PreferenceArea 
        title="Advance Care Plan / End-of-Life Wishes" 
        field="advance_care_plan_wishes" 
        notesField="advance_care_plan_wishes_notes" 
        icon={<Heart className="h-5 w-5 text-teal-600" />}
        notesPlaceholder="e.g., Wishes to stay in residence if condition worsens"
      />
      <PreferenceArea 
        title="Power of Attorney (Health/Finance)" 
        field="power_of_attorney" 
        notesField="power_of_attorney_notes" 
        icon={<Shield className="h-5 w-5 text-teal-600" />}
        notesPlaceholder="e.g., Yes – daughter Jane Hamilton"
      />
    </form>
  );
};
