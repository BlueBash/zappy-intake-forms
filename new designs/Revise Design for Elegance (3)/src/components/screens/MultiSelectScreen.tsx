import { motion } from 'motion/react';
import { ScreenProps } from './common';
import ScreenLayout from '../common/ScreenLayout';
import CheckboxGroup from '../common/CheckboxGroup';
import Input from '../ui/Input';
import NavigationButtons from '../common/NavigationButtons';
import { MultiSelectScreen as MultiSelectScreenType } from '../../types';

export default function MultiSelectScreen({ screen, answers, updateAnswer, onSubmit, showBack, onBack }: ScreenProps & { screen: MultiSelectScreenType }) {
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
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      <ScreenLayout title={title || ''} helpText={help_text}>
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
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4"
            >
              <Input
                id={other_text_id}
                placeholder="Tell us more..."
                value={answers[other_text_id] || ''}
                onChange={(e) => updateAnswer(other_text_id, e.target.value)}
                autoFocus
              />
            </motion.div>
          )}
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
}
