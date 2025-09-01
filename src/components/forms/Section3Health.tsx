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
    formState: { errors },
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

  const handleChange = (field: string, value: any) => {
    setValue(field as any, value);
    updateData({ [field]: value } as any);
  };

  if (isReadOnly) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Primary Diagnosis</label>
            <p className="mt-1 text-sm text-gray-900">{data?.primary_diagnosis || 'Not provided'}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Other Health Conditions</label>
            <p className="mt-1 text-sm text-gray-900">{data?.other_health_conditions || 'Not provided'}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Allergies</label>
            <p className="mt-1 text-sm text-gray-900">{data?.allergies || 'Not provided'}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Medication</label>
            <p className="mt-1 text-sm text-gray-900">{data?.medication || 'Not provided'}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">GP Involvement</label>
            <p className="mt-1 text-sm text-gray-900">{data?.gp_involvement || 'Not provided'}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Specialist Support (SALT, OT, MH)</label>
            <p className="mt-1 text-sm text-gray-900">{data?.specialist_support || 'Not provided'}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Mental Health Concerns</label>
            <p className="mt-1 text-sm text-gray-900">{data?.mental_health_concerns || 'Not provided'}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Cognition (e.g., Dementia)</label>
            <p className="mt-1 text-sm text-gray-900">{data?.cognition || 'Not provided'}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Primary Diagnosis</label>
          <textarea
            {...register('primary_diagnosis', {
              onChange: (e) => updateData({ primary_diagnosis: e.target.value })
            })}
            rows={2}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-6 py-4"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Other Health Conditions</label>
          <textarea
            {...register('other_health_conditions', {
              onChange: (e) => updateData({ other_health_conditions: e.target.value })
            })}
            rows={2}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-6 py-4"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Allergies</label>
          <textarea
            {...register('allergies', {
              onChange: (e) => updateData({ allergies: e.target.value })
            })}
            rows={2}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-6 py-4"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Medication</label>
          <textarea
            {...register('medication', {
              onChange: (e) => updateData({ medication: e.target.value })
            })}
            rows={2}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-6 py-4"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">GP Involvement</label>
          <textarea
            {...register('gp_involvement', {
              onChange: (e) => updateData({ gp_involvement: e.target.value })
            })}
            rows={2}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-6 py-4"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Specialist Support (SALT, OT, MH)</label>
          <textarea
            {...register('specialist_support', {
              onChange: (e) => updateData({ specialist_support: e.target.value })
            })}
            rows={2}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-6 py-4"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Mental Health Concerns</label>
          <textarea
            {...register('mental_health_concerns', {
              onChange: (e) => updateData({ mental_health_concerns: e.target.value })
            })}
            rows={2}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-6 py-4"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Cognition (e.g., Dementia)</label>
          <textarea
            {...register('cognition', {
              onChange: (e) => updateData({ cognition: e.target.value })
            })}
            rows={2}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-6 py-4"
          />
        </div>
      </div>

    </form>
  );
};
