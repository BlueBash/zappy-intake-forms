import React, { useState, useEffect, useRef } from 'react';
import { ScreenProps } from './common';
import ScreenLayout from '../common/ScreenLayout';
import Input from '../ui/Input';
import NavigationButtons from '../common/NavigationButtons';
import { TextScreen as TextScreenType } from '../../types';

const TextScreen: React.FC<ScreenProps & { screen: TextScreenType }> = ({ screen, answers, updateAnswer, onSubmit, showBack, onBack, headerSize }) => {
  const { id, title, help_text, placeholder, required, validation, mask, min_today, multiline } = screen;
  const value = answers[id] || '';
  const [error, setError] = useState<string | undefined>(undefined);
  const inputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
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
      setError('This field is required.');
      return false;
    }

    if (!currentValue) {
      setError(undefined);
      return true; // Don't validate empty non-required fields
    }

    if (validation?.pattern && !new RegExp(validation.pattern).test(currentValue)) {
      setError(validation.error);
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
          setError(validation?.error || "Please enter a valid date.");
          return false;
        }

        // Age validation
        if (validation?.min_age !== undefined || validation?.max_age !== undefined) {
          const today = new Date();
          let age = today.getFullYear() - inputDate.getFullYear();
          const m = today.getMonth() - inputDate.getMonth();
          if (m < 0 || (m === 0 && today.getDate() < inputDate.getDate())) {
            age--;
          }
          if ((validation.min_age !== undefined && age < validation.min_age) || (validation.max_age !== undefined && age > validation.max_age)) {
            setError(validation.error);
            return false;
          }
        }
        
        // min_today validation
        if (min_today) {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
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

  return (
    <ScreenLayout title={title} helpText={help_text} headerSize={headerSize}>
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
                className="block w-full rounded-lg transition-all duration-200 py-[18px] px-5 text-[1.0625rem] text-stone-900 border-2 border-stone-200 focus:border-primary focus:ring-4 focus:ring-primary/10 focus:outline-none"
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
  );
};

export default TextScreen;
