import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signaturesSchema } from '../../schema/assessment';
import { useCurrentSectionData } from '../../state/useAssessment';
import { Heart, Clock, Users, Shield, Target, Paperclip } from 'lucide-react';

interface Section9CareNeedsProps {
  isReadOnly?: boolean;
}

export const Section9CareNeeds: React.FC<Section9CareNeedsProps> = ({ isReadOnly = false }) => {
  const { data, updateData } = useCurrentSectionData('careNeeds');

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isDirty },
    watch,
  } = useForm({
    resolver: zodResolver(signaturesSchema),
    defaultValues: data || {},
  });

  useEffect(() => {
    if (data) {
      Object.entries(data).forEach(([key, value]) => {
        setValue(key as keyof typeof data, value);
      });
    }
  }, [data, setValue]);

  const onSubmit = (formData: any) => {
    updateData(formData);
  };

  const handleInputChange = (field: keyof typeof data, value: any) => {
    setValue(field, value);
    if (isDirty) {
      updateData({ [field]: value });
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-blue-900">Care Needs</h3>
        <p className="text-blue-700 text-sm">Assessment of current and future care requirements</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Current Care Level */}
        <div className="border-t pt-6">
          <h4 className="text-md font-medium text-gray-900 mb-4 flex items-center">
            <Heart className="h-5 w-5 mr-2 text-blue-600" />
            Current Care Assessment
          </h4>
          <div className="cf-grid">
            <div>
              <label className="cf-label">
                Current Care Level *
              </label>
              <select
                {...register('currentCareLevel')}
                onChange={(e) => handleInputChange('currentCareLevel', e.target.value)}
                disabled={isReadOnly}
                className="cf-input"
              >
                <option value="">Select care level</option>
                <option value="none">None</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
              {errors.currentCareLevel && (
                <p className="mt-1 text-sm text-red-600">{errors.currentCareLevel.message}</p>
              )}
            </div>

            <div>
              <label className="cf-label">
                Care Hours Per Week *
              </label>
              <input
                type="number"
                {...register('careHoursPerWeek', { valueAsNumber: true })}
                onChange={(e) => handleInputChange('careHoursPerWeek', parseInt(e.target.value) || 0)}
                disabled={isReadOnly}
                min="0"
                placeholder="Enter hours per week"
                className="cf-input"
              />
              {errors.careHoursPerWeek && (
                <p className="mt-1 text-sm text-red-600">{errors.careHoursPerWeek.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Care Frequency and Type */}
        <div className="border-t pt-6">
          <h4 className="text-md font-medium text-gray-900 mb-4 flex items-center">
            <Clock className="h-5 w-5 mr-2 text-blue-600" />
            Care Schedule and Type
          </h4>
          <div className="cf-grid">
            <div>
              <label className="cf-label">
                Care Frequency *
              </label>
              <select
                {...register('careFrequency')}
                onChange={(e) => handleInputChange('careFrequency', e.target.value)}
                disabled={isReadOnly}
                className="cf-input"
              >
                <option value="">Select frequency</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="as_needed">As Needed</option>
              </select>
              {errors.careFrequency && (
                <p className="mt-1 text-sm text-red-600">{errors.careFrequency.message}</p>
              )}
            </div>

            <div>
              <label className="cf-label">
                Care Type *
              </label>
              <select
                {...register('careType')}
                onChange={(e) => handleInputChange('careType', e.target.value)}
                disabled={isReadOnly}
                className="cf-input"
              >
                <option value="">Select care type</option>
                <option value="personal_care">Personal Care</option>
                <option value="domestic_care">Domestic Care</option>
                <option value="nursing_care">Nursing Care</option>
                <option value="social_care">Social Care</option>
                <option value="other">Other</option>
              </select>
              {errors.careType && (
                <p className="mt-1 text-sm text-red-600">{errors.careType.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Care Services */}
        <div className="border-t pt-6">
          <h4 className="text-md font-medium text-gray-900 mb-4 flex items-center">
            <Users className="h-5 w-5 mr-2 text-blue-600" />
            Care Services
          </h4>
          <div className="space-y-4">
            <div>
              <label className="cf-label">
                Formal Care Services
              </label>
              <textarea
                {...register('formalCareServices')}
                onChange={(e) => handleInputChange('formalCareServices', e.target.value)}
                disabled={isReadOnly}
                rows={3}
                placeholder="Describe any formal care services currently being provided"
                className="cf-input"
              />
              {errors.formalCareServices && (
                <p className="mt-1 text-sm text-red-600">{errors.formalCareServices.message}</p>
              )}
            </div>

            <div>
              <label className="cf-label">
                Informal Care Services
              </label>
              <textarea
                {...register('informalCareServices')}
                onChange={(e) => handleInputChange('informalCareServices', e.target.value)}
                disabled={isReadOnly}
                rows={3}
                placeholder="Describe any informal care services (family, friends, volunteers)"
                className="cf-input"
              />
              {errors.informalCareServices && (
                <p className="mt-1 text-sm text-red-600">{errors.informalCareServices.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Future Care Planning */}
        <div className="border-t pt-6">
          <h4 className="text-md font-medium text-gray-900 mb-4 flex items-center">
            <Target className="h-5 w-5 mr-2 text-blue-600" />
            Future Care Planning
          </h4>
          <div className="cf-grid">
            <div>
              <label className="cf-label">
                Anticipated Care Level
              </label>
              <select
                {...register('anticipatedCareLevel')}
                onChange={(e) => handleInputChange('anticipatedCareLevel', e.target.value)}
                disabled={isReadOnly}
                className="cf-input"
              >
                <option value="">Select anticipated level</option>
                <option value="none">None</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
              {errors.anticipatedCareLevel && (
                <p className="mt-1 text-sm text-red-600">{errors.anticipatedCareLevel.message}</p>
              )}
            </div>

            <div>
              <label className="cf-label">
                Preferred Care Setting
              </label>
              <select
                {...register('preferredCareSetting')}
                onChange={(e) => handleInputChange('preferredCareSetting', e.target.value)}
                disabled={isReadOnly}
                className="cf-input"
              >
                <option value="">Select preferred setting</option>
                <option value="home">Home</option>
                <option value="sheltered_housing">Sheltered Housing</option>
                <option value="residential_care">Residential Care</option>
                <option value="nursing_home">Nursing Home</option>
                <option value="hospital">Hospital</option>
              </select>
              {errors.preferredCareSetting && (
                <p className="mt-1 text-sm text-red-600">{errors.preferredCareSetting.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Risk Assessment */}
        <div className="border-t pt-6">
          <h4 className="text-md font-medium text-gray-900 mb-4 flex items-center">
            <Shield className="h-5 w-5 mr-2 text-blue-600" />
            Risk Assessment
          </h4>
          <div className="cf-grid">
            <div>
              <label className="cf-label">
                Care Risk Level
              </label>
              <select
                {...register('careRiskLevel')}
                onChange={(e) => handleInputChange('careRiskLevel', e.target.value)}
                disabled={isReadOnly}
                className="cf-input"
              >
                <option value="">Select risk level</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
              {errors.careRiskLevel && (
                <p className="mt-1 text-sm text-red-600">{errors.careRiskLevel.message}</p>
              )}
            </div>

            <div>
              <label className="cf-label">
                Care Provider Satisfaction
              </label>
              <select
                {...register('careProviderSatisfaction')}
                onChange={(e) => handleInputChange('careProviderSatisfaction', e.target.value)}
                disabled={isReadOnly}
                className="cf-input"
              >
                <option value="">Select satisfaction level</option>
                <option value="very_satisfied">Very Satisfied</option>
                <option value="satisfied">Satisfied</option>
                <option value="neutral">Neutral</option>
                <option value="dissatisfied">Dissatisfied</option>
                <option value="very_dissatisfied">Very Dissatisfied</option>
              </select>
              {errors.careProviderSatisfaction && (
                <p className="mt-1 text-sm text-red-600">{errors.careProviderSatisfaction.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Optional Attachments */}
        <div className="border-t pt-6">
          <h4 className="text-md font-medium text-gray-900 mb-4 flex items-center">
            <Paperclip className="h-5 w-5 mr-2 text-blue-600" />
            Optional Attachments
          </h4>
          <div className="space-y-4">
            <div>
              <label className="cf-label">
                Risk assessments (falls, pressure ulcers, choking, mental capacity)
              </label>
              <input
                type="file"
                {...register('riskAssessments')}
                disabled={isReadOnly}
                className="cf-input"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              />
              {errors.riskAssessments && (
                <p className="mt-1 text-sm text-red-600">{errors.riskAssessments.message}</p>
              )}
            </div>

            <div>
              <label className="cf-label">
                GP summary or hospital discharge letter
              </label>
              <input
                type="file"
                {...register('gpSummary')}
                disabled={isReadOnly}
                className="cf-input"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              />
              {errors.gpSummary && (
                <p className="mt-1 text-sm text-red-600">{errors.gpSummary.message}</p>
              )}
            </div>

            <div>
              <label className="cf-label">
                Medication list
              </label>
              <input
                type="file"
                {...register('medicationList')}
                disabled={isReadOnly}
                className="cf-input"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              />
              {errors.medicationList && (
                <p className="mt-1 text-sm text-red-600">{errors.medicationList.message}</p>
              )}
            </div>

            <div>
              <label className="cf-label">
                Consent forms
              </label>
              <input
                type="file"
                {...register('consentForms')}
                disabled={isReadOnly}
                className="cf-input"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              />
              {errors.consentForms && (
                <p className="mt-1 text-sm text-red-600">{errors.consentForms.message}</p>
              )}
            </div>

            <div>
              <label className="cf-label">
                Power of Attorney documentation
              </label>
              <input
                type="file"
                {...register('powerOfAttorney')}
                disabled={isReadOnly}
                className="cf-input"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              />
              {errors.powerOfAttorney && (
                <p className="mt-1 text-sm text-red-600">{errors.powerOfAttorney.message}</p>
              )}
            </div>

            <div>
              <label className="cf-label">
                DNACPR form
              </label>
              <input
                type="file"
                {...register('dnacprForm')}
                disabled={isReadOnly}
                className="cf-input"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              />
              {errors.dnacprForm && (
                <p className="mt-1 text-sm text-red-600">{errors.dnacprForm.message}</p>
              )}
            </div>

            <div>
              <label className="cf-label">
                Communication Passport or Health Action Plan
              </label>
              <input
                type="file"
                {...register('communicationPassport')}
                disabled={isReadOnly}
                className="cf-input"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              />
              {errors.communicationPassport && (
                <p className="mt-1 text-sm text-red-600">{errors.communicationPassport.message}</p>
              )}
            </div>
          </div>
        </div>

        {!isReadOnly && (
          <div className="flex justify-end space-x-3 pt-6 border-t">
            <button
              type="submit"
              className="cf-btn"
            >
              Save Section
            </button>
          </div>
        )}
      </form>
    </div>
  );
};
