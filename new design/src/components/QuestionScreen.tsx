import { motion } from 'motion/react';
import { Button } from './ui/button';
import { ArrowLeft, Check } from 'lucide-react';
import { ProgressIndicator } from './ProgressIndicator';
import { useState } from 'react';

interface Option {
  id: string;
  label: string;
}

interface QuestionScreenProps {
  question: string;
  options: Option[];
  onBack: () => void;
  onNext: (selectedOption: string) => void;
  currentStep: number;
  totalSteps: number;
}

export function QuestionScreen({
  question,
  options,
  onBack,
  onNext,
  currentStep,
  totalSteps,
}: QuestionScreenProps) {
  const [selected, setSelected] = useState<string | null>(null);

  const handleSelect = (optionId: string) => {
    setSelected(optionId);
    setTimeout(() => {
      onNext(optionId);
    }, 400);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="w-full max-w-2xl mx-auto px-6 py-8"
    >
      <ProgressIndicator currentStep={currentStep} totalSteps={totalSteps} />

      <div className="mb-10 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-3xl md:text-4xl text-[#1a1a1a] leading-tight"
        >
          {question}
        </motion.h2>
      </div>

      <div className="space-y-3 mb-12">
        {options.map((option, index) => (
          <motion.button
            key={option.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08, duration: 0.3 }}
            onClick={() => handleSelect(option.id)}
            className={`w-full p-5 rounded-xl border-2 transition-all duration-300 text-left group relative overflow-hidden ${
              selected === option.id
                ? 'border-[#1a7f72] bg-[#e6f3f2] shadow-md scale-[0.98]'
                : 'border-gray-200 bg-white hover:border-[#1a7f72]/40 hover:shadow-sm hover:scale-[1.01]'
            }`}
            style={{
              transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            <div className="flex items-center justify-between relative z-10">
              <span className={`transition-colors duration-300 ${
                selected === option.id ? 'text-[#1a7f72]' : 'text-neutral-700'
              }`}>
                {option.label}
              </span>
              {selected === option.id ? (
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                  className="w-7 h-7 rounded-full bg-[#00A896] flex items-center justify-center shadow-md"
                >
                  <Check className="w-4 h-4 text-white" strokeWidth={3} />
                </motion.div>
              ) : (
                <div className="w-7 h-7 rounded-full border-2 border-gray-300 group-hover:border-[#1a7f72]/40 transition-colors" />
              )}
            </div>
            {selected !== option.id && (
              <div className="absolute inset-0 bg-[#00A896]/0 via-[#00A896]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            )}
          </motion.button>
        ))}
      </div>

      <div className="flex justify-between items-center">
        <Button
          onClick={onBack}
          variant="ghost"
          className="text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100 px-5 py-3 rounded-xl group"
        >
          <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          Back
        </Button>
        
        <span className="text-sm text-neutral-500">
          Select an option to continue
        </span>
      </div>
    </motion.div>
  );
}
