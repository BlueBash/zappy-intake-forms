import React from 'react';
import { ScreenProps } from './common';
import ScreenLayout from '../common/ScreenLayout';
import NavigationButtons from '../common/NavigationButtons';
import RegionDropdown from '../common/RegionDropdown';
import Select from '../ui/Select';
import Button from '../ui/Button';
import { SingleSelectScreen as SingleSelectScreenType } from '../../types';

const DROPDOWN_THRESHOLD = 15;

const SingleSelectScreen: React.FC<ScreenProps & { screen: SingleSelectScreenType }> = ({ screen, answers, updateAnswer, onSubmit, showBack, onBack }) => {
  const { id, title, help_text, options = [], required, auto_advance = true, field_id } = screen;
  // Use field_id if provided, otherwise use id
  const answerId = field_id || id;
  const selectedValue = answers[answerId];

  const syncAnswer = (value: string) => {
    updateAnswer(answerId, value);
    if (answerId !== id) {
      updateAnswer(id, value);
    }
  };

  if (screen.id === 'demographics.state') {
    const stateValue = selectedValue || '';
    const handleStateChange = (code: string) => {
      syncAnswer(code);
    };

    return (
      <ScreenLayout title={title} helpText={help_text}>
        <div className="space-y-4">
          <RegionDropdown
            value={stateValue}
            onChange={handleStateChange}
            placeholder="Select your state"
          />
        </div>
        <NavigationButtons
          showBack={showBack}
          onBack={onBack}
          onNext={onSubmit}
          isNextDisabled={!stateValue}
        />
      </ScreenLayout>
    );
  }

  const handleButtonSelect = (value: string) => {
    syncAnswer(value);
    if (auto_advance) {
        // Auto-submit on selection for a faster flow
        setTimeout(onSubmit, 200);
    }
  };

  const handleDropdownChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    syncAnswer(e.target.value);
  };
  
  const isComplete = !required || (selectedValue !== undefined && selectedValue !== '');

  const renderAsDropdown = options.length > DROPDOWN_THRESHOLD;

  // For dropdowns, we never auto_advance and always show nav buttons.
  const showNavButtons = !auto_advance || renderAsDropdown;
  const showBackOnly = auto_advance && !renderAsDropdown && showBack;

  return (
    <ScreenLayout title={title} helpText={help_text}>
      {renderAsDropdown ? (
        <Select
          id={answerId}
          options={options}
          value={selectedValue || ''}
          onChange={handleDropdownChange}
          required={required}
        />
      ) : (
        <div className="space-y-4">
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => handleButtonSelect(option.value)}
              className={`w-full text-left p-5 border-2 rounded-2xl text-lg transition-all duration-200 ease-in-out transform focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary/30
                ${selectedValue === option.value
                  ? 'bg-primary border-primary text-white shadow-lg -translate-y-0.5'
                  : 'bg-white border-stone-200 shadow hover:border-primary hover:-translate-y-0.5 hover:shadow-lg'
                }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
      
      {showNavButtons && (
        <NavigationButtons
          showBack={showBack}
          onBack={onBack}
          onNext={onSubmit}
          isNextDisabled={!isComplete}
        />
      )}

      {!showNavButtons && showBackOnly && (
        <div className="w-full flex justify-start mt-10">
          <Button
            variant="secondary"
            onClick={onBack}
            aria-label="Go back to the previous question"
          >
            Back
          </Button>
        </div>
      )}
    </ScreenLayout>
  );
};

export default SingleSelectScreen;
