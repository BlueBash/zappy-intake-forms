import React, { useEffect, useRef } from 'react';
import { AlertCircle } from 'lucide-react';
import { ScreenProps } from './common';
import ScreenLayout from '../common/ScreenLayout';
import CheckboxGroup from '../common/CheckboxGroup';
import Input from '../ui/Input';
import NavigationButtons from '../common/NavigationButtons';
import { MultiSelectScreen as MultiSelectScreenType } from '../../types';

const MultiSelectScreen: React.FC<ScreenProps & { screen: MultiSelectScreenType }> = ({ screen, answers, updateAnswer, onSubmit, showBack, onBack, showLoginLink, progress = 0 }) => {
  const { id, title, help_text, options = [], required, other_text_id, other_text_placeholder } = screen;
  const selectedValues: string[] = answers[id] || [];
  const autoAdvanceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleChange = (newValues: string[]) => {
    updateAnswer(id, newValues);
    if (other_text_id && !newValues.includes('other')) {
      updateAnswer(other_text_id, '');
    }
  };

  const handleExclusiveSelect = () => {
    if (autoAdvanceTimeoutRef.current) {
      clearTimeout(autoAdvanceTimeoutRef.current);
    }
    autoAdvanceTimeoutRef.current = setTimeout(() => {
      onSubmit();
    }, 600);
  };

  // Determine contextual "none" label based on screen
  const getExclusiveLabel = () => {
    const titleLower = title.toLowerCase();
    if (titleLower.includes('medication') || titleLower.includes('taking')) {
      return "I don't take any of these medications";
    }
    if (titleLower.includes('condition') || titleLower.includes('medical') || titleLower.includes('diagnosed')) {
      return "I don't have any of these conditions";
    }
    if (titleLower.includes('goal') || titleLower.includes('important')) {
      return "None of these apply to me";
    }
    if (titleLower.includes('challenge') || titleLower.includes('obstacle')) {
      return "I don't face these challenges";
    }
    if (titleLower.includes('substance') || titleLower.includes('used')) {
      return "I haven't used any of these";
    }
    return "None of these apply to me";
  };

  useEffect(() => {
    return () => {
      if (autoAdvanceTimeoutRef.current) {
        clearTimeout(autoAdvanceTimeoutRef.current);
      }
    };
  }, []);

  const isComplete = !required || selectedValues.length > 0;

  // Check for conditional warnings
  const activeWarnings = screen.conditional_warnings?.filter(warning => 
    selectedValues.includes(warning.show_if_value)
  ) || [];

  return (
    <ScreenLayout 
      title={title} 
      helpText={help_text} 
      showLoginLink={showLoginLink}
      progress={progress}
      showBack={showBack}
      onBack={onBack}
      sectionLabel={screen.phase || 'Form'}
    >
      <div className="text-left mb-8">
        <CheckboxGroup
          id={id}
          label={screen.label ?? ''}
          options={options}
          selectedValues={selectedValues}
          onChange={handleChange}
          exclusiveValue="none"
          exclusiveLabel={getExclusiveLabel()}
          exclusiveMessage="We cleared your other selections so we can record 'None of these.'"
          onExclusiveSelect={handleExclusiveSelect}
        />
        {other_text_id && selectedValues.includes('other') && (
          <div className="mt-3">
            <Input
              id={other_text_id}
              placeholder={other_text_placeholder ?? "Please specify"}
              value={answers[other_text_id] || ''}
              onChange={(e) => updateAnswer(other_text_id, e.target.value)}
              autoFocus
            />
          </div>
        )}
        {activeWarnings.map((warning, index) => (
          <div key={index} className="mt-4 p-4 rounded-xl bg-red-50 border border-red-200 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-red-900">{warning.title || 'Important'}</p>
              <p className="text-sm text-red-700 mt-1">{warning.message}</p>
            </div>
          </div>
        ))}
      </div>
      <NavigationButtons
        showBack={showBack}
        onBack={onBack}
        onNext={onSubmit}
        isNextDisabled={!isComplete}
      />
    </ScreenLayout>
  );
};

export default MultiSelectScreen;
