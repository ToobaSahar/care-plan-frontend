import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signaturesSchema } from '../../schema/assessment';
import { useCurrentSectionData } from '../../state/useAssessment';
import { Heart, Users, Clock, AlertTriangle, CheckCircle, FileText } from 'lucide-react';

interface Section8CareNeedsProps {
  readOnly?: boolean;
}

export const Section8CareNeeds: React.FC<Section8CareNeedsProps> = ({ readOnly = false }) => {
  const { data, updateData } = useCurrentSectionData(8);
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
        <h3 className="text-lg font-semibold text-blue-900">Care Needs and Support</h3>
        <p className="text-blue-700 text-sm">Assessment of current and future care requirements</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Current Care Provision */}
        <div className="border-t pt-6">
          <h4 className="text-md font-medium text-gray-900 mb-4 flex items-center">
            <Heart className="h-5 w-5 mr-2 text-blue-600" />
            Current Care Provision
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Care Level *
              </label>
              <select
                {...register('currentCareLevel')}
                onChange={(e) => handleInputChange('currentCareLevel', e.target.value)}
                disabled={readOnly}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select care level</option>
                <option value="none">None</option>
                <option value="low">Low</option>
                <option value="moderate">Moderate</option>
                <option value="high">High</option>
                <option value="very-high">Very High</option>
              </select>
              {errors.currentCareLevel && (
                <p className="mt-1 text-sm text-red-600">{errors.currentCareLevel.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Care Hours per Week
              </label>
              <input
                type="number"
                {...register('careHoursPerWeek')}
                onChange={(e) => handleInputChange('careHoursPerWeek', parseInt(e.target.value) || 0)}
                disabled={readOnly}
                min="0"
                placeholder="e.g., 10"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {errors.careHoursPerWeek && (
                <p className="mt-1 text-sm text-red-600">{errors.careHoursPerWeek.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Care Frequency
              </label>
              <select
                {...register('careFrequency')}
                onChange={(e) => handleInputChange('careFrequency', e.target.value)}
                disabled={readOnly}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select frequency</option>
                <option value="daily">Daily</option>
                <option value="several-times-week">Several times per week</option>
                <option value="weekly">Weekly</option>
                <option value="fortnightly">Fortnightly</option>
                <option value="monthly">Monthly</option>
                <option value="as-needed">As needed</option>
              </select>
              {errors.careFrequency && (
                <p className="mt-1 text-sm text-red-600">{errors.careFrequency.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Care Type
              </label>
              <select
                {...register('careType')}
                onChange={(e) => handleInputChange('careType', e.target.value)}
                disabled={readOnly}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select care type</option>
                <option value="personal-care">Personal Care</option>
                <option value="domestic-care">Domestic Care</option>
                <option value="nursing-care">Nursing Care</option>
                <option value="respite-care">Respite Care</option>
                <option value="day-care">Day Care</option>
                <option value="night-care">Night Care</option>
                <option value="live-in-care">Live-in Care</option>
              </select>
              {errors.careType && (
                <p className="mt-1 text-sm text-red-600">{errors.careType.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Care Providers */}
        <div className="border-t pt-6">
          <h4 className="text-md font-medium text-gray-900 mb-4 flex items-center">
            <Users className="h-5 w-5 mr-2 text-blue-600" />
            Care Providers
          </h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Formal Care Services
              </label>
              <textarea
                {...register('formalCareServices')}
                onChange={(e) => handleInputChange('formalCareServices', e.target.value)}
                disabled={readOnly}
                rows={3}
                placeholder="List any formal care services currently being used (e.g., home care agency, day center, nursing home)"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {errors.formalCareServices && (
                <p className="mt-1 text-sm text-red-600">{errors.formalCareServices.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Informal Care Support
              </label>
              <textarea
                {...register('informalCareSupport')}
                onChange={(e) => handleInputChange('informalCareSupport', e.target.value)}
                disabled={readOnly}
                rows={2}
                placeholder="Family, friends, or neighbors providing informal care support"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {errors.informalCareSupport && (
                <p className="mt-1 text-sm text-red-600">{errors.informalCareSupport.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Care Provider Satisfaction
              </label>
              <select
                {...register('careProviderSatisfaction')}
                onChange={(e) => handleInputChange('careProviderSatisfaction', e.target.value)}
                disabled={readOnly}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select satisfaction level</option>
                <option value="very-satisfied">Very Satisfied</option>
                <option value="satisfied">Satisfied</option>
                <option value="neutral">Neutral</option>
                <option value="dissatisfied">Dissatisfied</option>
                <option value="very-dissatisfied">Very Dissatisfied</option>
                <option value="not-applicable">Not Applicable</option>
              </select>
              {errors.careProviderSatisfaction && (
                <p className="mt-1 text-sm text-red-600">{errors.careProviderSatisfaction.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Future Care Needs */}
        <div className="border-t pt-6">
          <h4 className="text-md font-medium text-gray-900 mb-4 flex items-center">
            <Clock className="h-5 w-5 mr-2 text-blue-600" />
            Future Care Needs
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Anticipated Care Level
              </label>
              <select
                {...register('anticipatedCareLevel')}
                onChange={(e) => handleInputChange('anticipatedCareLevel', e.target.value)}
                disabled={readOnly}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select anticipated level</option>
                <option value="same">Same</option>
                <option value="increased">Increased</option>
                <option value="decreased">Decreased</option>
                <option value="significant-increase">Significant Increase</option>
                <option value="unknown">Unknown</option>
              </select>
              {errors.anticipatedCareLevel && (
                <p className="mt-1 text-sm text-red-600">{errors.anticipatedCareLevel.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Timeline for Changes
              </label>
              <select
                {...register('timelineForChanges')}
                onChange={(e) => handleInputChange('timelineForChanges', e.target.value)}
                disabled={readOnly}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select timeline</option>
                <option value="immediate">Immediate</option>
                <option value="within-3-months">Within 3 months</option>
                <option value="within-6-months">Within 6 months</option>
                <option value="within-1-year">Within 1 year</option>
                <option value="long-term">Long term</option>
                <option value="unknown">Unknown</option>
              </select>
              {errors.timelineForChanges && (
                <p className="mt-1 text-sm text-red-600">{errors.timelineForChanges.message}</p>
              )}
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Specific Future Needs
            </label>
            <textarea
              {...register('specificFutureNeeds')}
              onChange={(e) => handleInputChange('specificFutureNeeds', e.target.value)}
              disabled={readOnly}
              rows={3}
              placeholder="Describe any specific care needs that are anticipated in the future"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {errors.specificFutureNeeds && (
              <p className="mt-1 text-sm text-red-600">{errors.specificFutureNeeds.message}</p>
            )}
          </div>
        </div>

        {/* Support Preferences */}
        <div className="border-t pt-6">
          <h4 className="text-md font-medium text-gray-900 mb-4 flex items-center">
            <CheckCircle className="h-5 w-5 mr-2 text-blue-600" />
            Support Preferences
          </h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preferred Care Setting
              </label>
              <select
                {...register('preferredCareSetting')}
                onChange={(e) => handleInputChange('preferredCareSetting', e.target.value)}
                disabled={readOnly}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select preference</option>
                <option value="own-home">Own Home</option>
                <option value="family-home">Family Home</option>
                <option value="sheltered-housing">Sheltered Housing</option>
                <option value="extra-care-housing">Extra Care Housing</option>
                <option value="residential-care">Residential Care</option>
                <option value="nursing-home">Nursing Home</option>
                <option value="no-preference">No Preference</option>
              </select>
              {errors.preferredCareSetting && (
                <p className="mt-1 text-sm text-red-600">{errors.preferredCareSetting.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Care Provider Preferences
              </label>
              <textarea
                {...register('careProviderPreferences')}
                onChange={(e) => handleInputChange('careProviderPreferences', e.target.value)}
                disabled={readOnly}
                rows={2}
                placeholder="Any specific preferences for care providers (e.g., gender, language, cultural background)"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {errors.careProviderPreferences && (
                <p className="mt-1 text-sm text-red-600">{errors.careProviderPreferences.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cultural or Religious Considerations
              </label>
              <textarea
                {...register('culturalReligiousCareConsiderations')}
                onChange={(e) => handleInputChange('culturalReligiousCareConsiderations', e.target.value)}
                disabled={readOnly}
                rows={2}
                placeholder="Any cultural or religious considerations for care provision"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {errors.culturalReligiousCareConsiderations && (
                <p className="mt-1 text-sm text-red-600">{errors.culturalReligiousCareConsiderations.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Risk Assessment */}
        <div className="border-t pt-6">
          <h4 className="text-md font-medium text-gray-900 mb-4 flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2 text-blue-600" />
            Risk Assessment
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Risk Level
              </label>
              <select
                {...register('careRiskLevel')}
                onChange={(e) => handleInputChange('careRiskLevel', e.target.value)}
                disabled={readOnly}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select risk level</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="very-high">Very High</option>
              </select>
              {errors.careRiskLevel && (
                <p className="mt-1 text-sm text-red-600">{errors.careRiskLevel.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Risk Factors
              </label>
              <select
                {...register('careRiskFactors')}
                onChange={(e) => handleInputChange('careRiskFactors', e.target.value)}
                disabled={readOnly}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select risk factors</option>
                <option value="none">None</option>
                <option value="medication-management">Medication Management</option>
                <option value="mobility-issues">Mobility Issues</option>
                <option value="cognitive-decline">Cognitive Decline</option>
                <option value="social-isolation">Social Isolation</option>
                <option value="financial-vulnerability">Financial Vulnerability</option>
                <option value="multiple">Multiple Factors</option>
              </select>
              {errors.careRiskFactors && (
                <p className="mt-1 text-sm text-red-600">{errors.careRiskFactors.message}</p>
              )}
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Risk Mitigation Strategies
            </label>
            <textarea
              {...register('riskMitigationStrategies')}
              onChange={(e) => handleInputChange('riskMitigationStrategies', e.target.value)}
              disabled={readOnly}
              rows={2}
              placeholder="Strategies to reduce or manage identified risks"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {errors.riskMitigationStrategies && (
              <p className="mt-1 text-sm text-red-600">{errors.riskMitigationStrategies.message}</p>
            )}
          </div>
        </div>

        {/* Additional Notes */}
        <div className="border-t pt-6">
          <h4 className="text-md font-medium text-gray-900 mb-4">Additional Notes</h4>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Care Needs Assessment Notes
            </label>
            <textarea
              {...register('careNeedsNotes')}
              onChange={(e) => handleInputChange('careNeedsNotes', e.target.value)}
              disabled={readOnly}
              rows={3}
              placeholder="Additional observations or notes about care needs and support"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {errors.careNeedsNotes && (
              <p className="mt-1 text-sm text-red-600">{errors.careNeedsNotes.message}</p>
            )}
          </div>
        </div>

        {!readOnly && (
          <div className="flex justify-end space-x-3 pt-6 border-t">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Save Section
            </button>
          </div>
        )}
      </form>
    </div>
  );
};
