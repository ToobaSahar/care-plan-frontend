import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signaturesSchema } from '../../schema/assessment';
import { useCurrentSectionData } from '../../state/useAssessment';
import { FileText, CheckCircle, AlertTriangle, Lightbulb, Shield, Calendar, Star, Users } from 'lucide-react';

interface Section11SummaryProps {
  isReadOnly?: boolean;
}

export const Section11Summary: React.FC<Section11SummaryProps> = ({ isReadOnly = false }) => {
  const { data, updateData } = useCurrentSectionData('summaryRecommendations');

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
        <h3 className="text-lg font-semibold text-blue-900">Summary and Recommendations</h3>
        <p className="text-blue-700 text-sm">Comprehensive assessment summary and action plan</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Overall Assessment Summary */}
        <div className="border-t pt-6">
          <h4 className="text-md font-medium text-gray-900 mb-4 flex items-center">
            <FileText className="h-5 w-5 mr-2 text-blue-600" />
            Overall Assessment Summary
          </h4>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Assessment Summary *
            </label>
            <textarea
              {...register('overallAssessmentSummary')}
              onChange={(e) => handleInputChange('overallAssessmentSummary', e.target.value)}
              disabled={isReadOnly}
              rows={4}
              placeholder="Provide a comprehensive summary of the assessment findings, including key observations and overall impressions"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {errors.overallAssessmentSummary && (
              <p className="mt-1 text-sm text-red-600">{errors.overallAssessmentSummary.message}</p>
            )}
          </div>
        </div>

        {/* Key Findings */}
        <div className="border-t pt-6">
          <h4 className="text-md font-medium text-gray-900 mb-4 flex items-center">
            <CheckCircle className="h-5 w-5 mr-2 text-blue-600" />
            Key Findings
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Key Strengths *
              </label>
              <textarea
                {...register('keyStrengths')}
                onChange={(e) => handleInputChange('keyStrengths', e.target.value)}
                disabled={isReadOnly}
                rows={4}
                placeholder="Identify and describe the individual's key strengths and positive attributes"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {errors.keyStrengths && (
                <p className="mt-1 text-sm text-red-600">{errors.keyStrengths.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Areas of Concern *
              </label>
              <textarea
                {...register('areasOfConcern')}
                onChange={(e) => handleInputChange('areasOfConcern', e.target.value)}
                disabled={isReadOnly}
                rows={4}
                placeholder="Identify and describe areas that require attention or intervention"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {errors.areasOfConcern && (
                <p className="mt-1 text-sm text-red-600">{errors.areasOfConcern.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Recommendations */}
        <div className="border-t pt-6">
          <h4 className="text-md font-medium text-gray-900 mb-4 flex items-center">
            <Lightbulb className="h-5 w-5 mr-2 text-blue-600" />
            Recommendations
          </h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Primary Recommendations *
              </label>
              <textarea
                {...register('primaryRecommendations')}
                onChange={(e) => handleInputChange('primaryRecommendations', e.target.value)}
                disabled={isReadOnly}
                rows={4}
                placeholder="Provide the main recommendations for care, support, and intervention"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {errors.primaryRecommendations && (
                <p className="mt-1 text-sm text-red-600">{errors.primaryRecommendations.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Service Recommendations
              </label>
              <textarea
                {...register('serviceRecommendations')}
                onChange={(e) => handleInputChange('serviceRecommendations', e.target.value)}
                disabled={isReadOnly}
                rows={3}
                placeholder="Specific recommendations for services, equipment, or adaptations"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {errors.serviceRecommendations && (
                <p className="mt-1 text-sm text-red-600">{errors.serviceRecommendations.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Equipment/Adaptations
              </label>
              <textarea
                {...register('equipmentAdaptations')}
                onChange={(e) => handleInputChange('equipmentAdaptations', e.target.value)}
                disabled={isReadOnly}
                rows={3}
                placeholder="Recommendations for equipment, adaptations, or environmental modifications"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {errors.equipmentAdaptations && (
                <p className="mt-1 text-sm text-red-600">{errors.equipmentAdaptations.message}</p>
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
                Overall Risk Level
              </label>
              <select
                {...register('overallRiskLevel')}
                onChange={(e) => handleInputChange('overallRiskLevel', e.target.value)}
                disabled={isReadOnly}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select risk level</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
              {errors.overallRiskLevel && (
                <p className="mt-1 text-sm text-red-600">{errors.overallRiskLevel.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Risk Management Plan
              </label>
              <select
                {...register('riskManagementPlan')}
                onChange={(e) => handleInputChange('riskManagementPlan', e.target.value)}
                disabled={isReadOnly}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select plan status</option>
                <option value="in_place">In Place</option>
                <option value="in_progress">In Progress</option>
                <option value="required">Required</option>
                <option value="not_required">Not Required</option>
              </select>
              {errors.riskManagementPlan && (
                <p className="mt-1 text-sm text-red-600">{errors.riskManagementPlan.message}</p>
              )}
            </div>
          </div>

          <div className="mt-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Risk Management Actions
              </label>
              <textarea
                {...register('riskManagementActions')}
                onChange={(e) => handleInputChange('riskManagementActions', e.target.value)}
                disabled={isReadOnly}
                rows={3}
                placeholder="Specific actions required to manage identified risks"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {errors.riskManagementActions && (
                <p className="mt-1 text-sm text-red-600">{errors.riskManagementActions.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Review and Monitoring */}
        <div className="border-t pt-6">
          <h4 className="text-md font-medium text-gray-900 mb-4 flex items-center">
            <Calendar className="h-5 w-5 mr-2 text-blue-600" />
            Review and Monitoring
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Review Frequency
              </label>
              <select
                {...register('reviewFrequency')}
                onChange={(e) => handleInputChange('reviewFrequency', e.target.value)}
                disabled={isReadOnly}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select frequency</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
                <option value="six_monthly">Six Monthly</option>
                <option value="annually">Annually</option>
              </select>
              {errors.reviewFrequency && (
                <p className="mt-1 text-sm text-red-600">{errors.reviewFrequency.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Next Review Date
              </label>
              <input
                type="date"
                {...register('nextReviewDate')}
                onChange={(e) => handleInputChange('nextReviewDate', e.target.value)}
                disabled={isReadOnly}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {errors.nextReviewDate && (
                <p className="mt-1 text-sm text-red-600">{errors.nextReviewDate.message}</p>
              )}
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Monitoring Requirements
            </label>
            <textarea
              {...register('monitoringRequirements')}
              onChange={(e) => handleInputChange('monitoringRequirements', e.target.value)}
              disabled={isReadOnly}
              rows={3}
              placeholder="Specific monitoring requirements and ongoing assessment needs"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {errors.monitoringRequirements && (
              <p className="mt-1 text-sm text-red-600">{errors.monitoringRequirements.message}</p>
            )}
          </div>
        </div>

        {/* Stakeholders and Communication */}
        <div className="border-t pt-6">
          <h4 className="text-md font-medium text-gray-900 mb-4 flex items-center">
            <Users className="h-5 w-5 mr-2 text-blue-600" />
            Stakeholders and Communication
          </h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Key Stakeholders
              </label>
              <textarea
                {...register('keyStakeholders')}
                onChange={(e) => handleInputChange('keyStakeholders', e.target.value)}
                disabled={isReadOnly}
                rows={3}
                placeholder="Identify key stakeholders involved in the individual's care and support"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {errors.keyStakeholders && (
                <p className="mt-1 text-sm text-red-600">{errors.keyStakeholders.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Communication Plan
              </label>
              <textarea
                {...register('communicationPlan')}
                onChange={(e) => handleInputChange('communicationPlan', e.target.value)}
                disabled={isReadOnly}
                rows={3}
                placeholder="Outline the communication plan for sharing assessment findings and recommendations"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {errors.communicationPlan && (
                <p className="mt-1 text-sm text-red-600">{errors.communicationPlan.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Quality Assurance */}
        <div className="border-t pt-6">
          <h4 className="text-md font-medium text-gray-900 mb-4 flex items-center">
            <Star className="h-5 w-5 mr-2 text-blue-600" />
            Quality Assurance
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Assessment Quality Rating
              </label>
              <select
                {...register('assessmentQualityRating')}
                onChange={(e) => handleInputChange('assessmentQualityRating', e.target.value)}
                disabled={isReadOnly}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select rating</option>
                <option value="excellent">Excellent</option>
                <option value="good">Good</option>
                <option value="satisfactory">Satisfactory</option>
                <option value="needs_improvement">Needs Improvement</option>
              </select>
              {errors.assessmentQualityRating && (
                <p className="mt-1 text-sm text-red-600">{errors.assessmentQualityRating.message}</p>
              )}
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quality Assurance Notes
            </label>
            <textarea
              {...register('qualityAssuranceNotes')}
              onChange={(e) => handleInputChange('qualityAssuranceNotes', e.target.value)}
              disabled={isReadOnly}
              rows={3}
              placeholder="Any quality assurance notes or observations about the assessment process"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {errors.qualityAssuranceNotes && (
              <p className="mt-1 text-sm text-red-600">{errors.qualityAssuranceNotes.message}</p>
            )}
          </div>
        </div>

        {!isReadOnly && (
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
