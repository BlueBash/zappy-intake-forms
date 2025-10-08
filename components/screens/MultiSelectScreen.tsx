import React from 'react';
import { ScreenProps } from './common';
import ScreenLayout from '../common/ScreenLayout';
import CheckboxGroup from '../common/CheckboxGroup';
import Input from '../ui/Input';
import NavigationButtons from '../common/NavigationButtons';
import { MultiSelectScreen as MultiSelectScreenType } from '../../types';

const MultiSelectScreen: React.FC<ScreenProps & { screen: MultiSelectScreenType }> = ({ screen, answers, updateAnswer, onSubmit, showBack, onBack }) => {
  const { id, title, help_text, options = [], required, other_text_id } = screen;
  const selectedValues: string[] = answers[id] || [];

  const handleChange = (newValues: string[]) => {
    updateAnswer(id, newValues);
    if (other_text_id && !newValues.includes('other')) {
      updateAnswer(other_text_id, '');
    }
  };

  const isComplete = !required || selectedValues.length > 0;

  return (
    <ScreenLayout title={title} helpText={help_text}>
      <div className="text-left mb-8">
        <CheckboxGroup
          id={id}
          label={screen.label ?? ''}
          help_text={help_text}
          options={options}
          selectedValues={selectedValues}
          onChange={handleChange}
          exclusiveValue="none"
          exclusiveMessage="We cleared your other selections so we can record 'None of these.'"
        />
        {other_text_id && selectedValues.includes('other') && (
          <div className="mt-3">
            <Input
              id={other_text_id}
              placeholder="Please specify"
              value={answers[other_text_id] || ''}
              onChange={(e) => updateAnswer(other_text_id, e.target.value)}
              autoFocus
            />
          </div>
        )}
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
