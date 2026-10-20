import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { healthWellbeingSchema } from '../../schema/assessment';
import { useCurrentSectionData } from '../../state/useAssessment';

interface Section3HealthProps {
  isReadOnly?: boolean;
}

export const Section3Health: React.FC<Section3HealthProps> = ({ isReadOnly = false }) => {
  const { data, updateData } = useCurrentSectionData('healthWellbeing');

  const {
    register,
    handleSubmit,
    setValue,
    formState: {},
  } = useForm<{ [k: string]: any }>({
    resolver: zodResolver(healthWellbeingSchema),
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

  if (isReadOnly) {
    return (
      <div className="space-y-6">
        <div className="cf-grid">
          <div>
            <label className="cf-label">Primary Diagnosis</label>
            <p className="cf-value">{data?.primary_diagnosis || 'Not provided'}</p>
          </div>
          <div>
            <label className="cf-label">Other Health Conditions</label>
            <p className="cf-value">{data?.other_health_conditions || 'Not provided'}</p>
          </div>
          <div>
            <label className="cf-label">Allergies</label>
            <p className="cf-value">{data?.allergies || 'Not provided'}</p>
          </div>
          <div>
            <label className="cf-label">Medication</label>
            <p className="cf-value">{data?.medication || 'Not provided'}</p>
          </div>
          <div>
            <label className="cf-label">GP Involvement</label>
            <p className="cf-value">{data?.gp_involvement || 'Not provided'}</p>
          </div>
          <div>
            <label className="cf-label">Specialist Support (SALT, OT, MH)</label>
            <p className="cf-value">{data?.specialist_support || 'Not provided'}</p>
          </div>
          <div>
            <label className="cf-label">Mental Health Concerns</label>
            <p className="cf-value">{data?.mental_health_concerns || 'Not provided'}</p>
          </div>
          <div>
            <label className="cf-label">Cognition (e.g., Dementia)</label>
            <p className="cf-value">{data?.cognition || 'Not provided'}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="cf-grid">
        <div>
          <label className="cf-label">Primary Diagnosis</label>
          <textarea
            {...register('primary_diagnosis', {
              onChange: (e) => updateData({ primary_diagnosis: e.target.value })
            })}
            rows={2}
            className="cf-input"
          />
        </div>
        <div>
          <label className="cf-label">Other Health Conditions</label>
          <textarea
            {...register('other_health_conditions', {
              onChange: (e) => updateData({ other_health_conditions: e.target.value })
            })}
            rows={2}
            className="cf-input"
          />
        </div>
        <div>
          <label className="cf-label">Allergies</label>
          <textarea
            {...register('allergies', {
              onChange: (e) => updateData({ allergies: e.target.value })
            })}
            rows={2}
            className="cf-input"
          />
        </div>
        <div>
          <label className="cf-label">Medication</label>
          <textarea
            {...register('medication', {
              onChange: (e) => updateData({ medication: e.target.value })
            })}
            rows={2}
            className="cf-input"
          />
        </div>
        <div>
          <label className="cf-label">GP Involvement</label>
          <textarea
            {...register('gp_involvement', {
              onChange: (e) => updateData({ gp_involvement: e.target.value })
            })}
            rows={2}
            className="cf-input"
          />
        </div>
        <div>
          <label className="cf-label">Specialist Support (SALT, OT, MH)</label>
          <textarea
            {...register('specialist_support', {
              onChange: (e) => updateData({ specialist_support: e.target.value })
            })}
            rows={2}
            className="cf-input"
          />
        </div>
        <div>
          <label className="cf-label">Mental Health Concerns</label>
          <textarea
            {...register('mental_health_concerns', {
              onChange: (e) => updateData({ mental_health_concerns: e.target.value })
            })}
            rows={2}
            className="cf-input"
          />
        </div>
        <div>
          <label className="cf-label">Cognition (e.g., Dementia)</label>
          <textarea
            {...register('cognition', {
              onChange: (e) => updateData({ cognition: e.target.value })
            })}
            rows={2}
            className="cf-input"
          />
        </div>
      </div>

    </form>
  );
};
