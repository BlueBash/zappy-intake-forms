import React from 'react';
import { ScreenProps } from './common';
import ScreenLayout from '../common/ScreenLayout';
import Checkbox from '../ui/Checkbox';
import Input from '../ui/Input';
import NavigationButtons from '../common/NavigationButtons';
import { MultiSelectScreen as MultiSelectScreenType } from '../../types';

const MultiSelectScreen: React.FC<ScreenProps & { screen: MultiSelectScreenType }> = ({ screen, answers, updateAnswer, onSubmit, showBack, onBack }) => {
  const { id, title, help_text, options = [], required, other_text_id } = screen;
  const selectedValues: string[] = answers[id] || [];

  const handleToggle = (value: string) => {
    let newValues: string[];
    
    if (value === 'none') {
        newValues = selectedValues.includes('none') ? [] : ['none'];
    } else {
        if (selectedValues.includes(value)) {
            newValues = selectedValues.filter(v => v !== value);
        } else {
            newValues = [...selectedValues.filter(v => v !== 'none'), value];
        }
    }
    updateAnswer(id, newValues);
  };
  
  const isComplete = !required || selectedValues.length > 0;

  return (
    <ScreenLayout title={title} helpText={help_text}>
      <div className="space-y-3 text-left mb-8">
        {options.map((option) => {
          const isSelected = selectedValues.includes(option.value);
          return (
            <div 
              key={option.value} 
              className={`
                p-4 bg-white rounded-lg cursor-pointer transition-all duration-200
                border-2 
                ${isSelected 
                  ? 'border-primary ring-4 ring-primary/10' 
                  : 'border-stone-200 hover:border-stone-300'
                }
              `}
              onClick={() => handleToggle(option.value)}
            >
              <Checkbox
                id={`${id}-${option.value}`}
                label={option.label}
                checked={isSelected}
                onChange={() => handleToggle(option.value)}
              />
            </div>
          );
        })}
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