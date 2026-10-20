import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { dailyLivingSchema } from '../../schema/assessment';
import { useCurrentSectionData } from '../../state/useAssessment';
import { SelectField } from '../ui';

interface Section4DailyLivingProps {
  isReadOnly?: boolean;
}

export const Section4DailyLiving: React.FC<Section4DailyLivingProps> = ({ isReadOnly = false }) => {
  const { data, updateData } = useCurrentSectionData('dailyLiving');

  const {
    register,
    handleSubmit,
    setValue,
    formState: {},
  } = useForm<{ [k: string]: any }>({
    resolver: zodResolver(dailyLivingSchema),
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
    console.log(`🔍 Section4DailyLiving: Updating field ${field} with value:`, value);
    setValue(field as any, value);
  };

  const handleBlur = (field: string, value: any) => {
    console.log(`🔍 Section4DailyLiving: Blur event for field ${field} with value:`, value);
    updateData({ [field]: value } as any);
  };

  const Area: React.FC<{
    title: string;
    needsField: string;
    notesField: string;
    needsType?: 'select' | 'text';
    options?: { value: string; label: string }[];
    needsPlaceholder?: string;
    notesPlaceholder?: string;
  }> = ({ title, needsField, notesField, needsType = 'text', options, needsPlaceholder, notesPlaceholder }) => (
    <div className="border rounded-lg p-4 bg-white">
      <h4 className="text-md font-medium text-gray-900 mb-3">{title}</h4>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div>
          <label className="cf-label">Needs</label>
                     {needsType === 'select' ? (
             <SelectField
               aria-label="Needs"
               name={needsField}
               value={(data as any)?.[needsField] ?? ''}
               options={options || []}
               disabled={isReadOnly}
               onValueChange={(v) => handleChange(needsField, v)}
               onBlur={(v) => handleBlur(needsField, v)}
             />
           ) : (
             <input
               type="text"
               {...register(needsField)}
               onChange={(e) => handleChange(needsField, e.target.value)}
               onBlur={(e) => handleBlur(needsField, e.target.value)}
               disabled={isReadOnly}
               placeholder={needsPlaceholder}
               className="cf-input"
             />
           )}
        </div>
        <div className="lg:col-span-2">
          <label className="cf-label">Notes</label>
                     <textarea
             {...register(notesField)}
             onChange={(e) => handleChange(notesField, e.target.value)}
             onBlur={(e) => handleBlur(notesField, e.target.value)}
             disabled={isReadOnly}
             rows={2}
             placeholder={notesPlaceholder}
             className="cf-input"
           />
        </div>
      </div>
    </div>
  );

  if (isReadOnly) {
    return (
      <div className="space-y-4">
        <Area 
          title="Mobility" 
          needsField="mobility" 
          notesField="mobility_notes" 
          needsType="select" 
          options={[
            { value: 'independent', label: 'Independent' },
            { value: 'aided', label: 'Aided' },
            { value: 'hoist', label: 'Hoist' },
          ]} 
          notesPlaceholder="Uses walking frame indoors, wheelchair for distance" 
        />
        
        <Area 
          title="Transfers" 
          needsField="transfers" 
          notesField="transfers_notes" 
          notesPlaceholder="Uses bed rail and grab bars" 
        />
        
        <Area 
          title="Falls Risk" 
          needsField="falls_risk" 
          notesField="falls_risk_notes" 
          needsType="select" 
          options={[
            { value: 'no', label: 'No' },
            { value: 'yes', label: 'Yes' },
          ]} 
          notesPlaceholder="One fall in Jan 2025, no injuries" 
        />
        
        <Area 
          title="Eating and Drinking" 
          needsField="eating_drinking" 
          notesField="eating_drinking_notes" 
          needsPlaceholder="Support needed? Dietary needs?" 
          notesPlaceholder="Soft diet recommended" 
        />
        
        <Area 
          title="Personal Care" 
          needsField="personal_care" 
          notesField="personal_care_notes" 
          needsType="select" 
          options={[
            { value: 'independent', label: 'Independent' },
            { value: 'partial_support', label: 'Partial Support' },
            { value: 'full_support', label: 'Full Support' },
          ]} 
          notesPlaceholder="Needs help with bathing, buttons" 
        />
        
        <Area 
          title="Continence" 
          needsField="continence" 
          notesField="continence_notes" 
          needsType="select" 
          options={[
            { value: 'pads', label: 'Pads' },
            { value: 'toilet', label: 'Toilet' },
            { value: 'catheter', label: 'Catheter' },
            { value: 'incontinent', label: 'Incontinent' },
          ]} 
          notesPlaceholder="Urge incontinence; uses pull-ups" 
        />
        
        <Area 
          title="Sleep" 
          needsField="sleep_pattern" 
          notesField="sleep_pattern_notes" 
          needsType="select" 
          options={[
            { value: 'normal', label: 'Normal' },
            { value: 'disturbed', label: 'Disturbed' },
            { value: 'needs_checks', label: 'Needs checks' },
          ]} 
          notesPlaceholder="Wakes twice nightly to toilet" 
        />
        
        <Area 
          title="Communication" 
          needsField="communication_mode" 
          notesField="communication_notes" 
          needsType="select" 
          options={[
            { value: 'verbal', label: 'Verbal' },
            { value: 'non_verbal', label: 'Non-verbal' },
            { value: 'hearing_aids', label: 'Hearing aids' },
          ]} 
          notesPlaceholder="Requires slower speech and eye contact" 
        />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Area 
        title="Mobility" 
        needsField="mobility" 
        notesField="mobility_notes" 
        needsType="select" 
        options={[
          { value: 'independent', label: 'Independent' },
          { value: 'aided', label: 'Aided' },
          { value: 'hoist', label: 'Hoist' },
        ]} 
        notesPlaceholder="Uses walking frame indoors, wheelchair for distance" 
      />

      <Area 
        title="Transfers" 
        needsField="transfers" 
        notesField="transfers_notes" 
        notesPlaceholder="Uses bed rail and grab bars" 
      />

      <Area 
        title="Falls Risk" 
        needsField="falls_risk" 
        notesField="falls_risk_notes" 
        needsType="select" 
        options={[
          { value: 'no', label: 'No' },
          { value: 'yes', label: 'Yes' },
        ]} 
        notesPlaceholder="One fall in Jan 2025, no injuries" 
      />

      <Area 
        title="Eating and Drinking" 
        needsField="eating_drinking" 
        notesField="eating_drinking_notes" 
        needsPlaceholder="Support needed? Dietary needs?" 
        notesPlaceholder="Soft diet recommended" 
      />

      <Area 
        title="Personal Care" 
        needsField="personal_care" 
        notesField="personal_care_notes" 
        needsType="select" 
        options={[
          { value: 'independent', label: 'Independent' },
          { value: 'partial_support', label: 'Partial Support' },
          { value: 'full_support', label: 'Full Support' },
        ]} 
        notesPlaceholder="Needs help with bathing, buttons" 
      />

      <Area 
        title="Continence" 
        needsField="continence" 
        notesField="continence_notes" 
        needsType="select" 
        options={[
          { value: 'pads', label: 'Pads' },
          { value: 'toilet', label: 'Toilet' },
          { value: 'catheter', label: 'Catheter' },
          { value: 'incontinent', label: 'Incontinent' },
        ]} 
        notesPlaceholder="Urge incontinence; uses pull-ups" 
      />

      <Area 
        title="Sleep" 
        needsField="sleep_pattern" 
        notesField="sleep_pattern_notes" 
        needsType="select" 
        options={[
          { value: 'normal', label: 'Normal' },
          { value: 'disturbed', label: 'Disturbed' },
          { value: 'needs_checks', label: 'Needs checks' },
        ]} 
        notesPlaceholder="Wakes twice nightly to toilet" 
      />

      <Area 
        title="Communication" 
        needsField="communication_mode" 
        notesField="communication_notes" 
        needsType="select" 
        options={[
          { value: 'verbal', label: 'Verbal' },
          { value: 'non_verbal', label: 'Non-verbal' },
          { value: 'hearing_aids', label: 'Hearing aids' },
        ]} 
        notesPlaceholder="Requires slower speech and eye contact" 
      />
    </form>
  );
};
