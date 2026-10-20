import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { basicDetailsSchema } from '../../schema/assessment';
import { useCurrentSectionData } from '../../state/useAssessment';
import { SelectField, YES_NO_OPTIONS } from '../ui';

interface Section2BasicProps {
  isReadOnly?: boolean;
}

export const Section2Basic: React.FC<Section2BasicProps> = ({ isReadOnly = false }) => {
  const { data, updateData } = useCurrentSectionData('basicDetails');

  const {
    register,
    handleSubmit,
    setValue,
    formState: {},
  } = useForm<{ [k: string]: any }>({
    resolver: zodResolver(basicDetailsSchema),
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
    updateData({ [field]: value } as any);
  };

  const handleBlur = (field: string, value: any) => {
    updateData({ [field]: value } as any);
  };

  if (isReadOnly) {
    return (
      <div className="space-y-6">
        <div className="cf-grid">
          <div>
            <label className="cf-label">Communication Needs</label>
            <p className="cf-value">{data?.communication_needs || 'Not provided'}</p>
          </div>
          <div>
            <label className="cf-label">Communication Aids</label>
            <p className="cf-value">{data?.communication_aids || 'Not provided'}</p>
          </div>
          <div>
            <label className="cf-label">Language Spoken</label>
            <p className="cf-value">{data?.language_spoken || 'Not provided'}</p>
          </div>
          <div>
            <label className="cf-label">Religion / Beliefs</label>
            <p className="cf-value">{data?.religion_beliefs || 'Not provided'}</p>
          </div>
          <div>
            <label className="cf-label">Ethnicity</label>
            <p className="cf-value">{data?.ethnicity || 'Not provided'}</p>
          </div>
          <div>
            <label className="cf-label">Cultural Preferences</label>
            <p className="cf-value">{data?.cultural_preferences || 'Not provided'}</p>
          </div>
          <div>
            <label className="cf-label">Consent for Sharing Info</label>
            <p className="cf-value">{data?.consent_for_sharing_info || 'Not provided'}</p>
          </div>
          <div>
            <label className="cf-label">Capacity for Care Decisions</label>
            <p className="cf-value">{data?.capacity_for_care_decisions || 'Not provided'}</p>
          </div>
          <div>
            <label className="cf-label">Access to Accommodation</label>
            <p className="cf-value">{data?.access_to_accommodation || 'Not provided'}</p>
          </div>
          <div>
            <label className="cf-label">Key Safe</label>
            <p className="cf-value">{data?.key_safe || 'Not provided'}</p>
          </div>
          <div>
            <label className="cf-label">Who Opens the Door</label>
            <p className="cf-value">{data?.who_opens_the_door || 'Not provided'}</p>
          </div>
          <div>
            <label className="cf-label">Lifeline in Place</label>
            <p className="cf-value">{data?.lifeline_in_place || 'Not provided'}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="cf-grid">
        <div>
          <label className="cf-label">Communication Needs</label>
          <textarea
            {...register('communication_needs', {
              onChange: (e) => handleChange('communication_needs', e.target.value)
            })}
            onBlur={(e) => handleBlur('communication_needs', e.target.value)}
            rows={2}
            className="cf-input"
            placeholder="Describe any communication needs"
          />
        </div>
        <div>
          <label className="cf-label">Communication Aids</label>
          <textarea
            {...register('communication_aids', {
              onChange: (e) => handleChange('communication_aids', e.target.value)
            })}
            onBlur={(e) => handleBlur('communication_aids', e.target.value)}
            rows={2}
            className="cf-input"
            placeholder="e.g., hearing aid, communication board"
          />
        </div>
        <div>
          <label className="cf-label">Language Spoken</label>
          <input
            type="text"
            {...register('language_spoken', {
              onChange: (e) => handleChange('language_spoken', e.target.value)
            })}
            onBlur={(e) => handleBlur('language_spoken', e.target.value)}
            className="cf-input"
            placeholder="e.g., English"
          />
        </div>
        <div>
          <label className="cf-label">Religion / Beliefs</label>
          <input
            type="text"
            {...register('religion_beliefs', {
              onChange: (e) => handleChange('religion_beliefs', e.target.value)
            })}
            onBlur={(e) => handleBlur('religion_beliefs', e.target.value)}
            className="cf-input"
            placeholder="e.g., Christian"
          />
        </div>
        <div>
          <label className="cf-label">Ethnicity</label>
          <input
            type="text"
            {...register('ethnicity', {
              onChange: (e) => handleChange('ethnicity', e.target.value)
            })}
            onBlur={(e) => handleBlur('ethnicity', e.target.value)}
            className="cf-input"
            placeholder="e.g., White British"
          />
        </div>
        <div>
          <label className="cf-label">Cultural Preferences</label>
          <textarea
            {...register('cultural_preferences', {
              onChange: (e) => handleChange('cultural_preferences', e.target.value)
            })}
            onBlur={(e) => handleBlur('cultural_preferences', e.target.value)}
            rows={2}
            className="cf-input"
            placeholder="e.g., dietary or cultural practices"
          />
        </div>
        <div>
          <label className="cf-label">Consent for Sharing Info</label>
          <SelectField
            aria-label="Consent for sharing info"
            name="consent_for_sharing_info"
            value={(data as any)?.consent_for_sharing_info ?? ''}
            options={YES_NO_OPTIONS}
            onValueChange={(v) => handleChange('consent_for_sharing_info', v)}
            onBlur={(v) => handleBlur('consent_for_sharing_info', v)}
          />
        </div>
        <div>
          <label className="cf-label">Capacity for Care Decisions</label>
          <SelectField
            aria-label="Capacity for care decisions"
            name="capacity_for_care_decisions"
            value={(data as any)?.capacity_for_care_decisions ?? ''}
            options={[
              { value: 'yes', label: 'Yes' },
              { value: 'no', label: 'No' },
              { value: 'requires_assessment', label: 'Requires Assessment' },
            ]}
            onValueChange={(v) => handleChange('capacity_for_care_decisions', v)}
            onBlur={(v) => handleBlur('capacity_for_care_decisions', v)}
          />
        </div>
        <div>
          <label className="cf-label">Access to Accommodation</label>
          <input
            type="text"
            {...register('access_to_accommodation', {
              onChange: (e) => handleChange('access_to_accommodation', e.target.value)
            })}
            onBlur={(e) => handleBlur('access_to_accommodation', e.target.value)}
            className="cf-input"
            placeholder="e.g., key holder details"
          />
        </div>
        <div>
          <label className="cf-label">Key Safe</label>
          <SelectField
            aria-label="Key safe"
            name="key_safe"
            value={(data as any)?.key_safe ?? ''}
            options={YES_NO_OPTIONS}
            onValueChange={(v) => handleChange('key_safe', v)}
            onBlur={(v) => handleBlur('key_safe', v)}
          />
        </div>
        <div>
          <label className="cf-label">Who Opens the Door</label>
          <input
            type="text"
            {...register('who_opens_the_door', {
              onChange: (e) => handleChange('who_opens_the_door', e.target.value)
            })}
            onBlur={(e) => handleBlur('who_opens_the_door', e.target.value)}
            className="cf-input"
            placeholder="e.g., carer, relative"
          />
        </div>
        <div>
          <label className="cf-label">Lifeline in Place</label>
          <SelectField
            aria-label="Lifeline in place"
            name="lifeline_in_place"
            value={(data as any)?.lifeline_in_place ?? ''}
            options={YES_NO_OPTIONS}
            onValueChange={(v) => handleChange('lifeline_in_place', v)}
            onBlur={(v) => handleBlur('lifeline_in_place', v)}
          />
        </div>
      </div>

    </form>
  );
};
