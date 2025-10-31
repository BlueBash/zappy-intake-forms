import { useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { ScreenProps } from './common';
import ScreenLayout from '../common/ScreenLayout';
import Input from '../ui/Input';
import NavigationButtons from '../common/NavigationButtons';
import { DateScreen as DateScreenType } from '../../types';

export default function DateScreen({ screen, answers, updateAnswer, onSubmit, showBack, onBack }: ScreenProps & { screen: DateScreenType }) {
  const { id, title, help_text, required, min_today } = screen;
  const value = answers[id] || '';
  const inputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    inputRef.current?.focus();
  }, []);
  
  const getTodayString = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  const isComplete = !required || (value && value.length > 0);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      <ScreenLayout title={title || ''} helpText={help_text}>
        <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }} className="w-full space-y-8">
          <Input
            ref={inputRef}
            id={id}
            type="date"
            value={value}
            onChange={(e) => updateAnswer(id, e.target.value)}
            min={min_today ? getTodayString() : undefined}
            required={required}
          />
          <NavigationButtons
            showBack={showBack}
            onBack={onBack}
            onNext={onSubmit}
            isNextDisabled={!isComplete}
            nextButtonType="submit"
          />
        </form>
      </ScreenLayout>
    </motion.div>
  );
}
