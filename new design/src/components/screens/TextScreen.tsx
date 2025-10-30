import { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { ScreenProps, TextScreen as TextScreenType } from '../../types';
import ScreenLayout from '../common/ScreenLayout';
import Input from '../ui/Input';
import NavigationButtons from '../common/NavigationButtons';
import { Check } from 'lucide-react';

export default function TextScreen({ screen, answers, updateAnswer, onSubmit, showBack, onBack, headerSize }: ScreenProps & { screen: TextScreenType }) {
  const { id, title, help_text, placeholder, required, validation, mask, min_today, multiline } = screen;
  const value = answers[id] || '';
  const [error, setError] = useState<string | undefined>(undefined);
  const inputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const isDobField = id === 'demographics.dob';
  
  useEffect(() => {
    if (multiline) {
      textareaRef.current?.focus();
    } else {
      inputRef.current?.focus();
    }
  }, [multiline]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    let inputValue = e.target.value;
    
    if (mask === '##-##-####' || mask === '##/##/####') {
      const separator = mask.includes('/') ? '/' : '-';
      const digitsOnly = inputValue.replace(/\D/g, '');
      const limitedDigits = digitsOnly.slice(0, 8);
      let formattedValue = '';
      if (limitedDigits.length > 4) {
        formattedValue = `${limitedDigits.slice(0, 2)}${separator}${limitedDigits.slice(2, 4)}${separator}${limitedDigits.slice(4)}`;
      } else if (limitedDigits.length > 2) {
        formattedValue = `${limitedDigits.slice(0, 2)}${separator}${limitedDigits.slice(2)}`;
      } else {
        formattedValue = limitedDigits;
      }
      inputValue = formattedValue;
    }

    updateAnswer(id, inputValue);
    if (error) {
      validate(inputValue);
    }
  };

  const validate = (currentValue: string): boolean => {
    if (required && !currentValue) {
      setError(isDobField ? 'We need your date of birth to continue.' : 'This field is required.');
      return false;
    }

    if (!currentValue) {
      setError(undefined);
      return true;
    }

    if (validation?.pattern && !new RegExp(validation.pattern).test(currentValue)) {
      setError(validation.error || 'Please enter a valid value.');
      return false;
    }

    // Date validation
    if (mask === '##/##/####' || mask === '##-##-####') {
      const separator = mask.includes('/') ? '/' : '-';
      const parts = currentValue.split(separator);
      
      if (parts.length === 3 && parts[0].length === 2 && parts[1].length === 2 && parts[2].length === 4) {
        const [month, day, year] = parts.map(Number);
        const inputDate = new Date(year, month - 1, day);
        
        if (isNaN(inputDate.getTime()) || inputDate.getFullYear() !== year || inputDate.getMonth() !== month - 1 || inputDate.getDate() !== day) {
          setError('Please enter a valid date.');
          return false;
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (inputDate > today && !min_today) {
          setError('Please enter a date in the past.');
          return false;
        }

        // Age validation
        if (validation?.min_age !== undefined || validation?.max_age !== undefined) {
          let age = today.getFullYear() - inputDate.getFullYear();
          const m = today.getMonth() - inputDate.getMonth();
          if (m < 0 || (m === 0 && today.getDate() < inputDate.getDate())) {
            age--;
          }
          if (validation.min_age !== undefined && age < validation.min_age) {
            setError(`You must be at least ${validation.min_age} years old.`);
            return false;
          }
          if (validation.max_age !== undefined && age > validation.max_age) {
            setError(`Maximum age is ${validation.max_age} years.`);
            return false;
          }
        }
      }
    }
    
    setError(undefined);
    return true;
  };
  
  const handleBlur = () => validate(value);

  const handleSubmit = () => {
    if (validate(value)) {
      onSubmit();
    } else {
      if (multiline) {
        textareaRef.current?.focus();
      } else {
        inputRef.current?.focus();
      }
    }
  };

  const isComplete = !required || (value && value.length > 0);
  const isEmailField = id === 'email';

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      <ScreenLayout title={title || ''} helpText={help_text} headerSize={headerSize}>
        {/* Promotional Banner - Only show on email screen */}
        {isEmailField && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="mb-8"
          >
            <div className="bg-gradient-to-r from-[#0D9488]/8 via-[#FF7A59]/8 to-[#0D9488]/8 border-2 border-[#FF7A59]/20 rounded-2xl px-6 py-4 flex items-center gap-3 shadow-sm">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.4, type: 'spring', stiffness: 200, damping: 15 }}
                className="w-6 h-6 rounded-full bg-gradient-to-br from-[#FF7A59] to-[#0D9488] flex items-center justify-center flex-shrink-0 shadow-md"
              >
                <Check className="w-4 h-4 text-white" strokeWidth={3} />
              </motion.div>
              <p className="text-neutral-700">
                <span className="bg-gradient-to-r from-[#0D9488] to-[#FF7A59] bg-clip-text text-transparent">Promo Applied:</span> Free Online Consultation
              </p>
            </div>
          </motion.div>
        )}
        
        <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="w-full space-y-8">
          {multiline ? (
            <textarea
              ref={textareaRef}
              id={id}
              value={value}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder={placeholder}
              rows={5}
              className="block w-full rounded-xl transition-all duration-300 py-4 px-4 text-base text-neutral-900 border-2 border-gray-200 focus:border-[#0D9488] focus:ring-4 focus:ring-[#0D9488]/10 focus:outline-none resize-none"
            />
          ) : (
            <Input
              ref={inputRef}
              id={id}
              value={value}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder={placeholder}
              error={error}
              maxLength={mask === '##/##/####' || mask === '##-##-####' ? 10 : undefined}
            />
          )}
          <NavigationButtons 
            showBack={showBack}
            onBack={onBack}
            onNext={handleSubmit}
            isNextDisabled={!isComplete}
            nextButtonType="submit"
          />
        </form>
      </ScreenLayout>
    </motion.div>
  );
}
