import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { ScreenProps } from './common';
import ScreenHeader from '../common/ScreenHeader';
import ValidationCheckmark from '../common/ValidationCheckmark';
import ErrorMessage from '../common/ErrorMessage';
import Input from '../ui/Input';
import NavigationButtons from '../common/NavigationButtons';
import { TextScreen as TextScreenType } from '../../types';

interface TextScreenProps extends ScreenProps {
  screen: TextScreenType;
  progress?: number; // Actual form progress percentage
}

const TextScreen: React.FC<TextScreenProps> = ({ screen, answers, updateAnswer, onSubmit, showBack, onBack, headerSize, progress = 0 }) => {
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
      setError(isDobField ? 'Enter your date of birth to continue.' : 'This field is required.');
      return false;
    }

    if (!currentValue) {
      setError(undefined);
      return true; // Don't validate empty non-required fields
    }

    if (validation?.pattern && !new RegExp(validation.pattern).test(currentValue)) {
      const patternMessage =
        (isDobField && 'Enter your date of birth as MM/DD/YYYY.') ||
        validation.error ||
        'Enter a valid value.';
      setError(patternMessage);
      return false;
    }

    // Date-based validations
    if (mask === '##/##/####' || mask === '##-##-####') {
      const separator = mask.includes('/') ? '/' : '-';
      const parts = currentValue.split(separator);
      
      if (parts.length === 3 && parts[0].length === 2 && parts[1].length === 2 && parts[2].length === 4) {
        const [month, day, year] = parts.map(Number);
        
        const inputDate = new Date(year, month - 1, day);
        // Check if the date is valid (e.g., not Feb 30)
        if (isNaN(inputDate.getTime()) || inputDate.getFullYear() !== year || inputDate.getMonth() !== month - 1 || inputDate.getDate() !== day) {
          setError(
            (isDobField && 'That date doesn’t look right. Double-check the month, day, and year.') ||
            validation?.error ||
            'Please enter a valid date.'
          );
          return false;
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (inputDate > today) {
          setError(
            isDobField
              ? 'Dates in the future don’t work—please use your actual birth date.'
              : 'Date cannot be in the future.'
          );
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
            setError(
              isDobField
                ? `We’re only able to continue with patients who are at least ${validation.min_age} years old.`
                : (validation.error || 'Value is below the minimum allowed.')
            );
            return false;
          }
          if (validation.max_age !== undefined && age > validation.max_age) {
            setError(
              isDobField
                ? `We’re only able to support patients up to ${validation.max_age} years old.`
                : (validation.error || 'Value is above the maximum allowed.')
            );
            return false;
          }
        }
        // min_today validation (for future-only fields like appointments)
        if (min_today) {
          if (inputDate < today) {
            setError("Date cannot be in the past.");
            return false;
          }
        }
      }
    }
    
    setError(undefined);
    return true;
  };
  
  const handleBlur = () => {
    validate(value);
  }

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
      className="w-full flex flex-col items-center min-h-screen pt-4 pb-8"
    >
      <div className="w-full max-w-2xl px-6">
        {/* ⭐ ScreenHeader with back button, logo, and REAL progress */}
        <ScreenHeader
          onBack={showBack ? onBack : undefined}
          sectionLabel={screen.phase || "Form"}
          progressPercentage={progress}
        />
        
        {/* Title & Help Text */}
        {title && (
          <h2 className="text-2xl sm:text-3xl md:text-4xl text-neutral-900 mb-4 leading-tight tracking-tight text-center">
            {title}
          </h2>
        )}
        {help_text && (
          <p className="text-base mb-8 text-neutral-600 leading-relaxed text-center max-w-xl mx-auto">
            {help_text}
          </p>
        )}
        
        {/* 🎁 PROMOTIONAL BANNER - Only show on email screen */}
        {isEmailField && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="mb-8"
          >
            <div className="bg-gradient-to-r from-[#0D9488]/8 via-[#FF7A59]/8 to-[#0D9488]/8 border-2 border-[#FF7A59]/20 rounded-2xl px-6 py-4 flex items-center gap-3 shadow-sm">
              
              {/* ✅ ANIMATED CHECKMARK */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.4, type: 'spring', stiffness: 200, damping: 15 }}
                className="w-6 h-6 rounded-full bg-gradient-to-br from-[#FF7A59] to-[#0D9488] flex items-center justify-center flex-shrink-0 shadow-md"
              >
                <Check className="w-4 h-4 text-white" strokeWidth={3} />
              </motion.div>
              
              {/* 📝 PROMOTIONAL TEXT */}
              <p className="text-neutral-700">
                <span className="bg-gradient-to-r from-[#0D9488] to-[#FF7A59] bg-clip-text text-transparent">
                  Promo Applied:
                </span> Free Online Consultation
              </p>
              
            </div>
          </motion.div>
        )}
        
        <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="w-full space-y-4">
            {multiline ? (
              <div>
                <textarea
                  ref={textareaRef}
                  id={id}
                  value={value}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder={placeholder}
                  rows={5}
                  className="block w-full rounded-xl transition-colors py-[18px] px-5 text-[1.0625rem] text-stone-900 border-2 border-stone-300 focus:border-primary focus:outline-none"
                />
                {/* ⭐ NEW: Standardized error message */}
                <ErrorMessage error={error} />
              </div>
            ) : (
              <div className="relative">
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
                {/* ⭐ NEW: Validation checkmark appears when field is valid */}
                <ValidationCheckmark show={!error && isComplete && value.length > 0} />
              </div>
            )}
            <NavigationButtons 
              showBack={showBack}
              onBack={onBack}
              onNext={handleSubmit}
              isNextDisabled={!isComplete}
              nextButtonType="submit"
            />
        </form>
      </div>
    </motion.div>
  );
};

export default TextScreen;
