import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { basicDetailsSchema } from '../../schema/assessment';
import { useCurrentSectionData } from '../../state/useAssessment';

interface Section2BasicProps {
  isReadOnly?: boolean;
}

export const Section2Basic: React.FC<Section2BasicProps> = ({ isReadOnly = false }) => {
  const { data, updateData } = useCurrentSectionData('basicDetails');

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Communication Needs</label>
            <p className="mt-1 text-sm text-gray-900">{data?.communication_needs || 'Not provided'}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Communication Aids</label>
            <p className="mt-1 text-sm text-gray-900">{data?.communication_aids || 'Not provided'}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Language Spoken</label>
            <p className="mt-1 text-sm text-gray-900">{data?.language_spoken || 'Not provided'}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Religion / Beliefs</label>
            <p className="mt-1 text-sm text-gray-900">{data?.religion_beliefs || 'Not provided'}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Ethnicity</label>
            <p className="mt-1 text-sm text-gray-900">{data?.ethnicity || 'Not provided'}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Cultural Preferences</label>
            <p className="mt-1 text-sm text-gray-900">{data?.cultural_preferences || 'Not provided'}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Consent for Sharing Info</label>
            <p className="mt-1 text-sm text-gray-900">{data?.consent_for_sharing_info || 'Not provided'}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Capacity for Care Decisions</label>
            <p className="mt-1 text-sm text-gray-900">{data?.capacity_for_care_decisions || 'Not provided'}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Access to Accommodation</label>
            <p className="mt-1 text-sm text-gray-900">{data?.access_to_accommodation || 'Not provided'}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Key Safe</label>
            <p className="mt-1 text-sm text-gray-900">{data?.key_safe || 'Not provided'}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Who Opens the Door</label>
            <p className="mt-1 text-sm text-gray-900">{data?.who_opens_the_door || 'Not provided'}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Lifeline in Place</label>
            <p className="mt-1 text-sm text-gray-900">{data?.lifeline_in_place || 'Not provided'}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Communication Needs</label>
          <textarea
            {...register('communication_needs', {
              onChange: (e) => handleChange('communication_needs', e.target.value)
            })}
            onBlur={(e) => handleBlur('communication_needs', e.target.value)}
            rows={2}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-6 py-4"
            placeholder="Describe any communication needs"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Communication Aids</label>
          <textarea
            {...register('communication_aids', {
              onChange: (e) => handleChange('communication_aids', e.target.value)
            })}
            onBlur={(e) => handleBlur('communication_aids', e.target.value)}
            rows={2}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-6 py-4"
            placeholder="e.g., hearing aid, communication board"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Language Spoken</label>
          <input
            type="text"
            {...register('language_spoken', {
              onChange: (e) => handleChange('language_spoken', e.target.value)
            })}
            onBlur={(e) => handleBlur('language_spoken', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-6 py-4"
            placeholder="e.g., English"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Religion / Beliefs</label>
          <input
            type="text"
            {...register('religion_beliefs', {
              onChange: (e) => handleChange('religion_beliefs', e.target.value)
            })}
            onBlur={(e) => handleBlur('religion_beliefs', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-6 py-4"
            placeholder="e.g., Christian"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Ethnicity</label>
          <input
            type="text"
            {...register('ethnicity', {
              onChange: (e) => handleChange('ethnicity', e.target.value)
            })}
            onBlur={(e) => handleBlur('ethnicity', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-6 py-4"
            placeholder="e.g., White British"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Cultural Preferences</label>
          <textarea
            {...register('cultural_preferences', {
              onChange: (e) => handleChange('cultural_preferences', e.target.value)
            })}
            onBlur={(e) => handleBlur('cultural_preferences', e.target.value)}
            rows={2}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-6 py-4"
            placeholder="e.g., dietary or cultural practices"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Consent for Sharing Info</label>
          <select
            {...register('consent_for_sharing_info', {
              onChange: (e) => handleChange('consent_for_sharing_info', e.target.value)
            })}
            onBlur={(e) => handleBlur('consent_for_sharing_info', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-6 py-4"
          >
            <option value="">Select...</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Capacity for Care Decisions</label>
          <select
            {...register('capacity_for_care_decisions', {
              onChange: (e) => handleChange('capacity_for_care_decisions', e.target.value)
            })}
            onBlur={(e) => handleBlur('capacity_for_care_decisions', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-6 py-4"
          >
            <option value="">Select...</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
            <option value="requires_assessment">Requires Assessment</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Access to Accommodation</label>
          <input
            type="text"
            {...register('access_to_accommodation', {
              onChange: (e) => handleChange('access_to_accommodation', e.target.value)
            })}
            onBlur={(e) => handleBlur('access_to_accommodation', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-6 py-4"
            placeholder="e.g., key holder details"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Key Safe</label>
          <select
            {...register('key_safe', {
              onChange: (e) => handleChange('key_safe', e.target.value)
            })}
            onBlur={(e) => handleBlur('key_safe', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-6 py-4"
          >
            <option value="">Select...</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Who Opens the Door</label>
          <input
            type="text"
            {...register('who_opens_the_door', {
              onChange: (e) => handleChange('who_opens_the_door', e.target.value)
            })}
            onBlur={(e) => handleBlur('who_opens_the_door', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-6 py-4"
            placeholder="e.g., carer, relative"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Lifeline in Place</label>
          <select
            {...register('lifeline_in_place', {
              onChange: (e) => handleChange('lifeline_in_place', e.target.value)
            })}
            onBlur={(e) => handleBlur('lifeline_in_place', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-6 py-4"
            >
            <option value="">Select...</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
        </div>
      </div>

    </form>
  );
};
