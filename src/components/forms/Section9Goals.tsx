import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signaturesSchema } from '../../schema/assessment';
import { useCurrentSectionData } from '../../state/useAssessment';
import { Target, Calendar, CheckCircle, TrendingUp, Users, FileText } from 'lucide-react';

interface Section9GoalsProps {
  readOnly?: boolean;
}

export const Section9Goals: React.FC<Section9GoalsProps> = ({ readOnly = false }) => {
  const { data, updateData } = useCurrentSectionData(9);
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
        <h3 className="text-lg font-semibold text-blue-900">Goals and Outcomes</h3>
        <p className="text-blue-700 text-sm">Personal goals and desired outcomes from care and support</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Short-term Goals */}
        <div className="border-t pt-6">
          <h4 className="text-md font-medium text-gray-900 mb-4 flex items-center">
            <Target className="h-5 w-5 mr-2 text-blue-600" />
            Short-term Goals (0-6 months)
          </h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Primary Short-term Goal *
              </label>
              <textarea
                {...register('primaryShortTermGoal')}
                onChange={(e) => handleInputChange('primaryShortTermGoal', e.target.value)}
                disabled={readOnly}
                rows={3}
                placeholder="What is the main goal to achieve in the next 6 months?"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {errors.primaryShortTermGoal && (
                <p className="mt-1 text-sm text-red-600">{errors.primaryShortTermGoal.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional Short-term Goals
              </label>
              <textarea
                {...register('additionalShortTermGoals')}
                onChange={(e) => handleInputChange('additionalShortTermGoals', e.target.value)}
                disabled={readOnly}
                rows={3}
                placeholder="List any other short-term goals or objectives"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {errors.additionalShortTermGoals && (
                <p className="mt-1 text-sm text-red-600">{errors.additionalShortTermGoals.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Priority Level
                </label>
                <select
                  {...register('shortTermGoalPriority')}
                  onChange={(e) => handleInputChange('shortTermGoalPriority', e.target.value)}
                  disabled={readOnly}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select priority</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
                {errors.shortTermGoalPriority && (
                  <p className="mt-1 text-sm text-red-600">{errors.shortTermGoalPriority.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expected Completion
                </label>
                <input
                  type="date"
                  {...register('shortTermGoalExpectedCompletion')}
                  onChange={(e) => handleInputChange('shortTermGoalExpectedCompletion', e.target.value)}
                  disabled={readOnly}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {errors.shortTermGoalExpectedCompletion && (
                  <p className="mt-1 text-sm text-red-600">{errors.shortTermGoalExpectedCompletion.message}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Medium-term Goals */}
        <div className="border-t pt-6">
          <h4 className="text-md font-medium text-gray-900 mb-4 flex items-center">
            <Calendar className="h-5 w-5 mr-2 text-blue-600" />
            Medium-term Goals (6-12 months)
          </h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Primary Medium-term Goal
              </label>
              <textarea
                {...register('primaryMediumTermGoal')}
                onChange={(e) => handleInputChange('primaryMediumTermGoal', e.target.value)}
                disabled={readOnly}
                rows={3}
                placeholder="What is the main goal to achieve in the next 6-12 months?"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {errors.primaryMediumTermGoal && (
                <p className="mt-1 text-sm text-red-600">{errors.primaryMediumTermGoal.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional Medium-term Goals
              </label>
              <textarea
                {...register('additionalMediumTermGoals')}
                onChange={(e) => handleInputChange('additionalMediumTermGoals', e.target.value)}
                disabled={readOnly}
                rows={2}
                placeholder="List any other medium-term goals or objectives"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {errors.additionalMediumTermGoals && (
                <p className="mt-1 text-sm text-red-600">{errors.additionalMediumTermGoals.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Long-term Goals */}
        <div className="border-t pt-6">
          <h4 className="text-md font-medium text-gray-900 mb-4 flex items-center">
            <TrendingUp className="h-5 w-5 mr-2 text-blue-600" />
            Long-term Goals (1+ years)
          </h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Primary Long-term Goal
              </label>
              <textarea
                {...register('primaryLongTermGoal')}
                onChange={(e) => handleInputChange('primaryLongTermGoal', e.target.value)}
                disabled={readOnly}
                rows={3}
                placeholder="What is the main long-term goal or aspiration?"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {errors.primaryLongTermGoal && (
                <p className="mt-1 text-sm text-red-600">{errors.primaryLongTermGoal.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional Long-term Goals
              </label>
              <textarea
                {...register('additionalLongTermGoals')}
                onChange={(e) => handleInputChange('additionalLongTermGoals', e.target.value)}
                disabled={readOnly}
                rows={2}
                placeholder="List any other long-term goals or aspirations"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {errors.additionalLongTermGoals && (
                <p className="mt-1 text-sm text-red-600">{errors.additionalLongTermGoals.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Goal Categories */}
        <div className="border-t pt-6">
          <h4 className="text-md font-medium text-gray-900 mb-4 flex items-center">
            <CheckCircle className="h-5 w-5 mr-2 text-blue-600" />
            Goal Categories
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Health and Wellbeing Goals
              </label>
              <textarea
                {...register('healthWellbeingGoals')}
                onChange={(e) => handleInputChange('healthWellbeingGoals', e.target.value)}
                disabled={readOnly}
                rows={2}
                placeholder="Goals related to physical health, mental health, or general wellbeing"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {errors.healthWellbeingGoals && (
                <p className="mt-1 text-sm text-red-600">{errors.healthWellbeingGoals.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Independence Goals
              </label>
              <textarea
                {...register('independenceGoals')}
                onChange={(e) => handleInputChange('independenceGoals', e.target.value)}
                disabled={readOnly}
                rows={2}
                placeholder="Goals related to maintaining or increasing independence"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {errors.independenceGoals && (
                <p className="mt-1 text-sm text-red-600">{errors.independenceGoals.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Social Goals
              </label>
              <textarea
                {...register('socialGoals')}
                onChange={(e) => handleInputChange('socialGoals', e.target.value)}
                disabled={readOnly}
                rows={2}
                placeholder="Goals related to social activities, relationships, or community involvement"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {errors.socialGoals && (
                <p className="mt-1 text-sm text-red-600">{errors.socialGoals.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lifestyle Goals
              </label>
              <textarea
                {...register('lifestyleGoals')}
                onChange={(e) => handleInputChange('lifestyleGoals', e.target.value)}
                disabled={readOnly}
                rows={2}
                placeholder="Goals related to hobbies, interests, or lifestyle changes"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {errors.lifestyleGoals && (
                <p className="mt-1 text-sm text-red-600">{errors.lifestyleGoals.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Goal Achievement */}
        <div className="border-t pt-6">
          <h4 className="text-md font-medium text-gray-900 mb-4 flex items-center">
            <CheckCircle className="h-5 w-5 mr-2 text-blue-600" />
            Goal Achievement
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Progress
              </label>
              <select
                {...register('currentProgress')}
                onChange={(e) => handleInputChange('currentProgress', e.target.value)}
                disabled={readOnly}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select progress level</option>
                <option value="not-started">Not Started</option>
                <option value="beginning">Beginning</option>
                <option value="in-progress">In Progress</option>
                <option value="nearly-complete">Nearly Complete</option>
                <option value="completed">Completed</option>
              </select>
              {errors.currentProgress && (
                <p className="mt-1 text-sm text-red-600">{errors.currentProgress.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Barriers to Achievement
              </label>
              <select
                {...register('barriersToAchievement')}
                onChange={(e) => handleInputChange('barriersToAchievement', e.target.value)}
                disabled={readOnly}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select barriers</option>
                <option value="none">None</option>
                <option value="health-issues">Health Issues</option>
                <option value="financial-constraints">Financial Constraints</option>
                <option value="lack-support">Lack of Support</option>
                <option value="accessibility">Accessibility Issues</option>
                <option value="motivation">Motivation</option>
                <option value="multiple">Multiple Barriers</option>
              </select>
              {errors.barriersToAchievement && (
                <p className="mt-1 text-sm text-red-600">{errors.barriersToAchievement.message}</p>
              )}
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Support Required
            </label>
            <textarea
              {...register('supportRequired')}
              onChange={(e) => handleInputChange('supportRequired', e.target.value)}
              disabled={readOnly}
              rows={2}
              placeholder="What support is needed to achieve these goals?"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {errors.supportRequired && (
              <p className="mt-1 text-sm text-red-600">{errors.supportRequired.message}</p>
            )}
          </div>
        </div>

        {/* Outcomes and Measures */}
        <div className="border-t pt-6">
          <h4 className="text-md font-medium text-gray-900 mb-4 flex items-center">
            <TrendingUp className="h-5 w-5 mr-2 text-blue-600" />
            Outcomes and Measures
          </h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Desired Outcomes
              </label>
              <textarea
                {...register('desiredOutcomes')}
                onChange={(e) => handleInputChange('desiredOutcomes', e.target.value)}
                disabled={readOnly}
                rows={3}
                placeholder="What specific outcomes are desired from achieving these goals?"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {errors.desiredOutcomes && (
                <p className="mt-1 text-sm text-red-600">{errors.desiredOutcomes.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Success Measures
              </label>
              <textarea
                {...register('successMeasures')}
                onChange={(e) => handleInputChange('successMeasures', e.target.value)}
                disabled={readOnly}
                rows={2}
                placeholder="How will success be measured? What indicators will show progress?"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {errors.successMeasures && (
                <p className="mt-1 text-sm text-red-600">{errors.successMeasures.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Additional Notes */}
        <div className="border-t pt-6">
          <h4 className="text-md font-medium text-gray-900 mb-4">Additional Notes</h4>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Goals and Outcomes Assessment Notes
            </label>
            <textarea
              {...register('goalsOutcomesNotes')}
              onChange={(e) => handleInputChange('goalsOutcomesNotes', e.target.value)}
              disabled={readOnly}
              rows={3}
              placeholder="Additional observations or notes about goals and outcomes"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {errors.goalsOutcomesNotes && (
              <p className="mt-1 text-sm text-red-600">{errors.goalsOutcomesNotes.message}</p>
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
