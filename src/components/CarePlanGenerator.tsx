import React, { useState } from 'react';
import { carePlanAPI, CarePlanResponse, CarePlanData, CarePlanSection } from '../lib/carePlanApi';

interface CarePlanGeneratorProps {
  assessmentId?: string;
  onCarePlanGenerated?: (carePlan: CarePlanData) => void;
}

export const CarePlanGenerator: React.FC<CarePlanGeneratorProps> = ({
  assessmentId,
  onCarePlanGenerated
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [carePlan, setCarePlan] = useState<CarePlanData | null>(null);
  const [error, setError] = useState<string | null>(null);



  const generateCarePlan = async () => {
    setIsGenerating(true);
    setError(null);
    setCarePlan(null);

    try {
      let response: CarePlanResponse;

      if (assessmentId) {
        response = await carePlanAPI.generateCarePlanById(assessmentId);
      } else {
        response = await carePlanAPI.generateCarePlanForRecent();
      }

      if (response.success && response.care_plan) {
        const formattedCarePlan = carePlanAPI.formatCarePlan(response.care_plan);
        if (formattedCarePlan) {
          setCarePlan(formattedCarePlan);
          onCarePlanGenerated?.(formattedCarePlan);
        } else {
          setError('Failed to format care plan data.');
        }
      } else {
        setError(response.message || 'Failed to generate care plan.');
      }
    } catch (err) {
      setError('An error occurred while generating the care plan.');
      console.error('Care plan generation error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const renderCarePlanSection = (title: string, section: CarePlanSection) => {
    if (!section) return null;

    return (
      <div className="mb-6 p-4 bg-white rounded-lg shadow border-l-4 border-blue-500">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <p className="text-gray-900 bg-gray-50 p-2 rounded">{section.description || '-'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Identified Need</label>
              <p className="text-gray-900 bg-gray-50 p-2 rounded">{section.identified_need || '-'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Planned Outcomes</label>
              <p className="text-gray-900 bg-gray-50 p-2 rounded">{section.planned_outcomes || '-'}</p>
            </div>
          </div>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">How to Achieve Outcomes</label>
              <p className="text-gray-900 bg-gray-50 p-2 rounded">{section.how_to_achieve || '-'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Level of Need</label>
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                section.level_of_need === 'High' ? 'bg-red-100 text-red-800' :
                section.level_of_need === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                'bg-green-100 text-green-800'
              }`}>
                {section.level_of_need || '-'}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          AI Care Plan Generator
        </h2>



        {/* Generate Button */}
        <div className="mb-6">
          <button
            onClick={generateCarePlan}
            disabled={isGenerating}
            className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
              isGenerating
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-green-500 hover:bg-green-600 text-white'
            }`}
          >
            {isGenerating ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating Care Plan...
              </span>
            ) : (
              'Generate Care Plan'
            )}
          </button>
          {assessmentId && (
            <p className="text-sm text-gray-600 mt-2">
              Generating care plan for Assessment ID: {assessmentId}
            </p>
          )}
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Care Plan Display */}
        {carePlan && (
          <div className="space-y-6">
            <div className="bg-gray-800 text-white p-4 rounded-lg">
              <h3 className="text-xl font-semibold">CARE PLAN</h3>
              <p className="text-sm text-gray-300">Generated by AI Agent</p>
            </div>

            {/* Health & Wellbeing */}
            {renderCarePlanSection('Health & Wellbeing', carePlan.health_wellbeing)}

            {/* Daily Living */}
            {renderCarePlanSection('Daily Living Activities & Mobility', carePlan.daily_living)}

            {/* Risks & Safeguarding */}
            {renderCarePlanSection('Risks & Safeguarding', carePlan.risks_safeguarding)}

            {/* Social & Emotional Wellbeing */}
            {renderCarePlanSection('Social & Emotional Wellbeing', carePlan.social_emotional)}

            {/* Environment & Lifestyle */}
            {renderCarePlanSection('Environment & Lifestyle', carePlan.environment_lifestyle)}

            {/* Advance Preferences */}
            {renderCarePlanSection('Advance Preferences', carePlan.advance_preferences)}

            {/* Optional Areas */}
            {renderCarePlanSection('Optional Areas', carePlan.optional_areas)}

            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h4 className="font-semibold text-blue-900 mb-2">Next Review Date</h4>
              <p className="text-blue-700">3 months from generation date</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
