import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle } from 'lucide-react';
import { ScreenProps } from './common';
import ScreenLayout from '../common/ScreenLayout';
import CheckboxGroup from '../common/CheckboxGroup';
import Input from '../ui/Input';
import NavigationButtons from '../common/NavigationButtons';
import { MultiSelectScreen as MultiSelectScreenType } from '../../types';

const PILL_THRESHOLD = 6; // Switch to pills when more than 6 options

const MultiSelectScreen: React.FC<ScreenProps & { screen: MultiSelectScreenType }> = ({ screen, answers, updateAnswer, onSubmit, showBack, onBack, showLoginLink }) => {
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

  // Check if this screen should NOT have a "none of these apply" option
  const shouldHideExclusiveOption = () => {
    return id === 'goal_motivations' || id === 'goal_challenges';
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

  // Determine variant based on number of options
  const variant = options.length > PILL_THRESHOLD ? 'pills' : 'default';

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      <ScreenLayout title={title} helpText={help_text} showLoginLink={showLoginLink}>
        <div className="mb-8">
          <CheckboxGroup
            id={id}
            label={screen.label ?? ''}
            options={options}
            selectedValues={selectedValues}
            onChange={handleChange}
            exclusiveValue={shouldHideExclusiveOption() ? undefined : "none"}
            exclusiveLabel={shouldHideExclusiveOption() ? undefined : getExclusiveLabel()}
            exclusiveMessage="We cleared your other selections so we can record 'None of these.'"
            onExclusiveSelect={handleExclusiveSelect}
            variant={variant}
          />
          {other_text_id && selectedValues.includes('other') && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4"
            >
              <Input
                id={other_text_id}
                placeholder={other_text_placeholder ?? "Please specify"}
                value={answers[other_text_id] || ''}
                onChange={(e) => updateAnswer(other_text_id, e.target.value)}
                autoFocus
              />
            </motion.div>
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
    </motion.div>
  );
};

export default MultiSelectScreen;
