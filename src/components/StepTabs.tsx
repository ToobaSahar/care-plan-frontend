import React from 'react';
import { ChevronRight, CheckCircle, Circle } from 'lucide-react';
import { useAssessmentProgress } from '../state/useAssessment';

interface StepTabsProps {
  currentSection: number;
  onSectionChange: (section: number) => void;
}

const sectionTitles = [
  'Personal',
  'Basics',
  'Health',
  'Daily',
  'Safeguarding',
  'Wellbeing',
  'Environment',
  'Advance',
  'Financial',
  'Signatures'
];

const sectionIcons = [
  '👤', '📋', '🏥', '🏠', '⚠️', '❤️', '🌍', '⚖️', '💰', '✍️'
];

export const StepTabs: React.FC<StepTabsProps> = ({ currentSection, onSectionChange }) => {
  const { sectionProgress, progressPercentage } = useAssessmentProgress();

  return (
    <div className="w-full">
      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-medium text-gray-700">Assessment Progress</span>
          <span className="text-xs font-semibold text-gray-600">{progressPercentage}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-1.5">
          <div 
            className="bg-gray-600 h-1.5 rounded-full transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Section Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
        {sectionTitles.map((title, index) => {
          const sectionNumber = index + 1;
          const isCompleted = sectionProgress[sectionNumber.toString()] || false;
          const isCurrent = currentSection === sectionNumber;

          return (
            <button
              key={sectionNumber}
              onClick={() => onSectionChange(sectionNumber)}
              className={`
                relative p-3 rounded-lg border text-left transition-all duration-200
                ${isCurrent 
                  ? 'border-gray-600 bg-gray-200 shadow-sm' 
                  : isCompleted 
                    ? 'border-gray-500 bg-gray-100 hover:border-gray-600 hover:bg-gray-200' 
                    : 'border-gray-300 bg-white hover:border-gray-400 hover:bg-gray-50'
                }
              `}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xl">{sectionIcons[index]}</span>
                <div className="flex items-center">
                  {isCompleted ? (
                    <CheckCircle className="w-4 h-4 text-gray-600" />
                  ) : (
                    <Circle className="w-4 h-4 text-gray-400" />
                  )}
                </div>
              </div>

              <h3 className={`font-medium text-xs leading-tight truncate ${
                isCurrent ? 'text-gray-900' : 
                isCompleted ? 'text-gray-800' : 
                'text-gray-700'
              }`}>
                {title}
              </h3>

              <div className={`text-[10px] mt-0.5 ${
                isCurrent ? 'text-gray-600' : 
                isCompleted ? 'text-gray-500' : 
                'text-gray-500'
              }`}>
                {sectionNumber}/10
              </div>

              {isCurrent && (
                <div className="absolute -right-1 -top-1">
                  <div className="w-2.5 h-2.5 bg-gray-600 rounded-full animate-pulse" />
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Section Navigation */}
      <div className="flex items-center justify-between mt-4">
        <button
          onClick={() => onSectionChange(Math.max(1, currentSection - 1))}
          disabled={currentSection === 1}
          className={`
            flex items-center px-3 py-1.5 rounded-lg border text-sm transition-colors
            ${currentSection === 1 
              ? 'border-gray-200 text-gray-400 cursor-not-allowed' 
              : 'border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400'
            }
          `}
        >
          <ChevronRight className="w-4 h-4 rotate-180 mr-1" />
          Prev
        </button>

        <div className="text-xs text-gray-600">Section {currentSection} of 10</div>

        <button
          onClick={() => onSectionChange(Math.min(10, currentSection + 1))}
          disabled={currentSection === 10}
          className={`
            flex items-center px-3 py-1.5 rounded-lg border text-sm transition-colors
            ${currentSection === 10 
              ? 'border-gray-200 text-gray-400 cursor-not-allowed' 
              : 'border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400'
            }
          `}
        >
          Next
          <ChevronRight className="w-4 h-4 ml-1" />
        </button>
      </div>
    </div>
  );
};
