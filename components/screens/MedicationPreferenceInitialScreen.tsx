import React, { useState } from 'react';
import ScreenLayout from '../common/ScreenLayout';
import NavigationButtons from '../common/NavigationButtons';
import { ScreenProps } from './common';

const MedicationPreferenceInitialScreen: React.FC<ScreenProps & { screen: any }> = ({
  answers,
  updateAnswer,
  onSubmit,
  showBack,
  onBack,
  showLoginLink,
  screen,
}) => {
  const [selectedValue, setSelectedValue] = useState<string | null>(null);
  
  // Use field_id if specified, otherwise use screen id
  const answerKey = (screen as any).field_id || screen.id;

  const handlePreferenceChange = (value: string) => {
    setSelectedValue(value);
    // Update the answer with the correct key
    updateAnswer(answerKey, value);
    
    // Auto-advance immediately - visual feedback will show during transition
    onSubmit();
  };

  return (
    <ScreenLayout
      title="Do you have a GLP-1 medication in mind?"
      showLoginLink={showLoginLink}
    >
      <div className="space-y-3">
          <button
            onClick={() => handlePreferenceChange('yes')}
            className={`w-full flex items-center justify-between p-5 border-2 rounded-xl text-base focus:outline-none transition-colors duration-200 ${
              selectedValue === 'yes'
                ? 'border-primary bg-primary/5 text-primary'
                : 'bg-white border-gray-200 hover:border-primary/30 hover:bg-gray-50 text-neutral-600'
            }`}
          >
            <span className="text-left flex-1">Yes, I have a specific medication in mind</span>
            <div className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
              selectedValue === 'yes'
                ? 'bg-primary'
                : 'border-2 border-gray-300'
            }`}>
              {selectedValue === 'yes' && (
                <svg
                  className="w-4 h-4 text-white"
                  fill="none"
                  strokeWidth="3"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              )}
            </div>
          </button>
          
          <button
            onClick={() => handlePreferenceChange('no')}
            className={`w-full flex items-center justify-between p-5 border-2 rounded-xl text-base focus:outline-none transition-colors duration-200 ${
              selectedValue === 'no'
                ? 'border-primary bg-primary/5 text-primary'
                : 'bg-white border-gray-200 hover:border-primary/30 hover:bg-gray-50 text-neutral-600'
            }`}
          >
            <span className="text-left flex-1">No, I'm open to recommendations</span>
            <div className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
              selectedValue === 'no'
                ? 'bg-primary'
                : 'border-2 border-gray-300'
            }`}>
              {selectedValue === 'no' && (
                <svg
                  className="w-4 h-4 text-white"
                  fill="none"
                  strokeWidth="3"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              )}
            </div>
          </button>
      </div>

      <NavigationButtons
        showBack={showBack}
        onBack={onBack}
        onNext={onSubmit}
        isNextDisabled={selectedValue === null}
      />
    </ScreenLayout>
  );
};

export default MedicationPreferenceInitialScreen;
