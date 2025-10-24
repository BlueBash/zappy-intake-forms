import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Option } from '../../types';

interface SingleSelectButtonGroupProps {
  options: Option[];
  selectedValue?: string;
  onSelect: (value: string) => void;
}

const SingleSelectButtonGroup: React.FC<SingleSelectButtonGroupProps> = ({
  options,
  selectedValue,
  onSelect
}) => {
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    setHasAnimated(true);
  }, []);

  const reducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  return (
    <div className="space-y-4">
      {options.map((option, index) => {
        const isSelected = selectedValue === option.value;
        
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
            whileTap={reducedMotion ? {} : { scale: 0.98 }}
            whileHover={reducedMotion ? {} : (isSelected ? {} : { scale: 1.01 })}
            onClick={() => onSelect(option.value)}
            type="button"
            className={`w-full text-left py-[18px] px-5 border-2 rounded-2xl text-lg transition-colors transform focus:outline-none leading-relaxed
              ${isSelected
                ? 'bg-primary/5 border-primary text-neutral-900 font-medium'
                : 'bg-white border-stone-200 hover:border-primary/30 hover:bg-gray-50'
              }`}
            style={{
              transitionDuration: 'var(--timing-normal)',
              transitionTimingFunction: 'var(--easing-elegant)'
            }}
          >
            <div className="flex items-center justify-between gap-4">
              <span>{option.label}</span>
              <div className="flex-shrink-0">
                {isSelected ? (
                  <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                ) : (
                  <motion.div
                    whileHover={reducedMotion ? {} : { scale: [1, 1.03, 1.01] }}
                    transition={reducedMotion ? { duration: 0.01 } : { duration: 0.35 }}
                    className="w-6 h-6 rounded-full border-2 border-neutral-300 group-hover:border-primary/50 transition-colors"
                    style={{
                      transitionDuration: 'var(--timing-normal)',
                      transitionTimingFunction: 'var(--easing-elegant)'
                    }}
                  />
                )}
              </div>
            </div>
          </motion.button>
        );
      })}
    </div>
  );
};

export default SingleSelectButtonGroup;
