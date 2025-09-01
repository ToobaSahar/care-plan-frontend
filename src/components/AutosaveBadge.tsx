import React from 'react';
import { Save, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { useAssessment } from '../state/useAssessment';

export const AutosaveBadge: React.FC = () => {
  const { hasUnsavedChanges, isLoading, error } = useAssessment();

  if (isLoading) {
    return (
      <div className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-1.5 sm:py-2 bg-gray-200 border border-gray-300 rounded-lg">
        <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600 animate-spin" />
        <span className="text-xs sm:text-sm text-gray-700">
          <span className="hidden sm:inline">Saving...</span>
          <span className="sm:hidden">Save...</span>
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-1.5 sm:py-2 bg-gray-200 border border-gray-300 rounded-lg">
        <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600" />
        <span className="text-xs sm:text-sm text-gray-700">
          <span className="hidden sm:inline">Save failed</span>
          <span className="sm:hidden">Failed</span>
        </span>
      </div>
    );
  }

  if (hasUnsavedChanges) {
    return (
      <div className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-1.5 sm:py-2 bg-gray-200 border border-gray-300 rounded-lg">
        <Save className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600" />
        <span className="text-xs sm:text-sm text-gray-700">
          <span className="hidden sm:inline">Unsaved changes</span>
          <span className="sm:hidden">Unsaved</span>
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-1.5 sm:py-2 bg-gray-200 border border-gray-300 rounded-lg">
      <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600" />
      <span className="text-xs sm:text-sm text-gray-700">
        <span className="hidden sm:inline">All changes saved</span>
        <span className="sm:hidden">Saved</span>
      </span>
    </div>
  );
};
