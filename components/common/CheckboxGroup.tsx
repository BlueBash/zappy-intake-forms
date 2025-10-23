import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Option } from '../../types';
import Checkbox from '../ui/Checkbox';

interface CheckboxGroupProps {
  id: string;
  label: string;
  help_text?: string;
  options: Option[];
  selectedValues: string[];
  onChange: (newValues: string[]) => void;
  exclusiveValue?: string;
  exclusiveMessage?: string;
}

const CheckboxGroup: React.FC<CheckboxGroupProps> = ({
  id,
  label,
  help_text,
  options,
  selectedValues,
  onChange,
  exclusiveValue,
  exclusiveMessage,
}) => {
  const [clearedMessage, setClearedMessage] = useState<string | null>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    setHasAnimated(true);
  }, []);

  useEffect(() => {
    if (!clearedMessage) return;
    const timer = window.setTimeout(() => setClearedMessage(null), 5000);
    return () => window.clearTimeout(timer);
  }, [clearedMessage]);

  const exclusiveOptionValue = useMemo(() => {
    if (exclusiveValue) return exclusiveValue;
    const hasNone = options.some((option) => option.value === 'none');
    return hasNone ? 'none' : undefined;
  }, [exclusiveValue, options]);

  const exclusiveOptionLabel = exclusiveOptionValue
    ? options.find((option) => option.value === exclusiveOptionValue)?.label ?? exclusiveOptionValue
    : undefined;

  const exclusiveSelected = exclusiveOptionValue ? selectedValues.includes(exclusiveOptionValue) : false;

  const handleToggle = (value: string) => {
    if (exclusiveOptionValue && value === exclusiveOptionValue) {
      const alreadySelected = selectedValues.includes(exclusiveOptionValue);
      if (alreadySelected) {
        const newValues = selectedValues.filter((v) => v !== exclusiveOptionValue);
        onChange(newValues);
        setClearedMessage(null);
      } else {
        const hadOtherSelections = selectedValues.some((v) => v !== exclusiveOptionValue);
        onChange([exclusiveOptionValue]);
        if (hadOtherSelections) {
          setClearedMessage(
            exclusiveMessage ??
              `We cleared your other selections so we can record "${exclusiveOptionLabel ?? 'None of these'}".`
          );
        } else {
          setClearedMessage(null);
        }
      }
      return;
    }

    let workingValues = selectedValues;
    if (exclusiveOptionValue && selectedValues.includes(exclusiveOptionValue)) {
      workingValues = selectedValues.filter((v) => v !== exclusiveOptionValue);
    }

    const newValues = workingValues.includes(value)
      ? workingValues.filter((v) => v !== value)
      : [...workingValues, value];

    onChange(newValues);
    setClearedMessage(null);
  };

  return (
    <div className="w-full">
      <label className="block font-semibold mb-3 text-stone-900 text-[0.9375rem]">
        {label}
      </label>
      {help_text && (
        <p className="text-sm -mt-2 mb-3 text-stone-600">
          {help_text}
        </p>
      )}
      <div className="space-y-4">
        {options.map((option, index) => {
          const isDisabled = exclusiveSelected && option.value !== exclusiveOptionValue;
          const isChecked = selectedValues.includes(option.value);
          const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
          
          return (
            <motion.button
              key={option.value}
              initial={hasAnimated || reducedMotion ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={reducedMotion ? { duration: 0.01 } : {
                delay: hasAnimated ? 0 : index * 0.1,
                duration: 0.45,
                ease: [0.25, 0.1, 0.25, 1]
              }}
              whileHover={reducedMotion ? {} : (isDisabled ? {} : { scale: 1.01 })}
              whileTap={reducedMotion ? {} : { scale: 0.98 }}
              type="button"
              onClick={() => {
                if (isDisabled) return;
                handleToggle(option.value);
              }}
              disabled={isDisabled}
              className={`w-full flex items-center justify-between py-[18px] px-5 border-2 rounded-xl text-base transition-colors transform focus-within:ring-2 focus-within:ring-primary/40 focus-within:ring-offset-2 focus:outline-none text-left ${
                isChecked
                  ? 'border-primary bg-gradient-to-r from-primary/5 via-accent-warm/5 to-primary-light/5 shadow-md text-primary'
                  : isDisabled
                    ? 'border-gray-200 opacity-60 cursor-not-allowed bg-white text-neutral-400'
                    : 'bg-white border-gray-200 hover:border-accent-warm/30 hover:shadow-md text-neutral-600'
              }`}
              style={{
                transitionDuration: 'var(--timing-slow)',
                transitionTimingFunction: 'var(--easing-elegant)'
              }}
            >
              <span className="text-left flex-1">{option.label}</span>
              <div className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                isChecked
                  ? 'bg-gradient-to-r from-primary to-primary-light shadow-md'
                  : 'border-2 border-gray-300'
              }`}
              style={{
                transitionDuration: 'var(--timing-normal)',
                transitionTimingFunction: 'var(--easing-elegant)'
              }}>
                {isChecked && (
                  <motion.svg
                    initial={reducedMotion ? { opacity: 1 } : { pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={reducedMotion ? { duration: 0.01 } : {
                      pathLength: { type: 'spring', stiffness: 180, damping: 25 },
                      opacity: { duration: 0.3 }
                    }}
                    className="w-4 h-4 text-white"
                    fill="none"
                    strokeWidth="3"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <motion.path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </motion.svg>
                )}
              </div>
            </motion.button>
          );
        })}
      </div>
      {clearedMessage && (
        <div
          className="mt-4 rounded-2xl border border-primary/20 bg-primary/10 px-4 py-3 text-sm text-primary"
          role="status"
          aria-live="polite"
        >
          {clearedMessage}
        </div>
      )}
    </div>
  );
};

export default CheckboxGroup;
