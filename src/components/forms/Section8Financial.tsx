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
    formState: { errors },
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

  const handleChange = (field: string, value: any) => {
    setValue(field as any, value);
  };

  const handleBlur = (field: string, value: any) => {
    updateData({ [field]: value } as any);
  };

  const PreferenceArea: React.FC<{
    title: string;
    field: string;
    notesField: string;
    icon: React.ReactNode;
    notesPlaceholder: string;
  }> = ({ title, field, notesField, icon, notesPlaceholder }) => (
    <div className="border rounded-lg p-4">
      <h4 className="text-md font-medium text-gray-900 mb-3 flex items-center">
        {icon}
        <span className="ml-2">{title}</span>
      </h4>
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="flex items-center">
            <input
              type="radio"
              {...register(field)}
              value="yes"
              onChange={(e) => handleChange(field, e.target.value)}
              onBlur={(e) => handleBlur(field, e.target.value)}
              disabled={isReadOnly}
              className="mr-2"
            />
            <span className="text-sm text-gray-700">Yes</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              {...register(field)}
              value="no"
              onChange={(e) => handleChange(field, e.target.value)}
              onBlur={(e) => handleBlur(field, e.target.value)}
              disabled={isReadOnly}
              className="mr-2"
            />
            <span className="text-sm text-gray-700">No</span>
          </label>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Notes</label>
          <textarea
            {...register(notesField)}
            onChange={(e) => handleChange(notesField, e.target.value)}
            onBlur={(e) => handleBlur(notesField, e.target.value)}
            disabled={isReadOnly}
            rows={3}
            placeholder={notesPlaceholder}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-6 py-4"
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
          icon={<AlertTriangle className="h-5 w-5 text-red-600" />}
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
          icon={<Heart className="h-5 w-5 text-green-600" />}
          notesPlaceholder="e.g., Wishes to stay in residence if condition worsens"
        />
        <PreferenceArea 
          title="Power of Attorney (Health/Finance)" 
          field="power_of_attorney" 
          notesField="power_of_attorney_notes" 
          icon={<Shield className="h-5 w-5 text-purple-600" />}
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
        icon={<AlertTriangle className="h-5 w-5 text-red-600" />}
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
        icon={<Heart className="h-5 w-5 text-green-600" />}
        notesPlaceholder="e.g., Wishes to stay in residence if condition worsens"
      />
      <PreferenceArea 
        title="Power of Attorney (Health/Finance)" 
        field="power_of_attorney" 
        notesField="power_of_attorney_notes" 
        icon={<Shield className="h-5 w-5 text-purple-600" />}
        notesPlaceholder="e.g., Yes – daughter Jane Hamilton"
      />
    </form>
  );
};
