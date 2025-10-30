import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, Shield, Lock, Clock } from 'lucide-react';
import SingleSelectButtonGroup from '../common/SingleSelectButtonGroup';
import CheckboxGroup from '../common/CheckboxGroup';
import { Badge } from '../ui/badge';
import NavigationButtons from '../common/NavigationButtons';
import ScreenHeader from '../common/ScreenHeader';

interface TimelineQuestion {
  id: string;
  title: string;
  help_text?: string;
  type: 'single_select' | 'multi_select';
  options: Array<{
    value: string;
    label: string;
  }>;
  auto_advance?: boolean;
}

interface TimelineQuestionScreenProps {
  questions: TimelineQuestion[];
  onComplete: (answers: Record<string, any>) => void;
  onBack?: () => void;
  currentStep?: number;
  totalSteps?: number;
}

export default function TimelineQuestionScreen({
  questions,
  onComplete,
  onBack,
  currentStep: overallStep,
  totalSteps: overallTotalSteps,
}: TimelineQuestionScreenProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward');
  const [showAcknowledgment, setShowAcknowledgment] = useState(false);

  const currentQuestion = questions[currentStep];
  const progress = ((currentStep + 1) / questions.length) * 100;
  const isLastQuestion = currentStep === questions.length - 1;

  // Handle answer selection
  const handleAnswer = (questionId: string, value: any) => {
    const newAnswers = { ...answers, [questionId]: value };
    setAnswers(newAnswers);

    // Auto-advance for single select (after brief delay for visual feedback)
    if (currentQuestion.type === 'single_select' && currentQuestion.auto_advance !== false) {
      // Show acknowledgment briefly
      setShowAcknowledgment(true);
      setTimeout(() => {
        setShowAcknowledgment(false);
        handleNext();
      }, 600);
    }
  };

  // Move to next question
  const handleNext = () => {
    if (isLastQuestion) {
      onComplete(answers);
    } else {
      setDirection('forward');
      setCurrentStep((prev) => prev + 1);
    }
  };

  // Move to previous question
  const handlePrevious = () => {
    if (currentStep > 0) {
      setDirection('backward');
      setCurrentStep((prev) => prev - 1);
    } else if (onBack) {
      onBack();
    }
  };

  // Check if current question is answered
  const isAnswered = () => {
    const answer = answers[currentQuestion.id];
    if (currentQuestion.type === 'multi_select') {
      return answer && answer.length > 0;
    }
    return answer !== undefined && answer !== null && answer !== '';
  };

  const canContinue = isAnswered();

  return (
    <div className="min-h-screen bg-[#fef8f2] flex justify-center p-4 sm:p-6 pt-5 sm:pt-7">
      <div className="w-full max-w-2xl">
        {/* Top Progress Bar - Shows overall flow progress */}
        {overallStep !== undefined && overallTotalSteps !== undefined && (
          <ScreenHeader
            onBack={handlePrevious}
            sectionLabel="Your Goals"
            currentStep={currentStep + 1}
            totalSteps={questions.length}
            progressPercentage={(overallStep / overallTotalSteps) * 100}
          />
        )}

        {/* Question Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full"
        >
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentStep}
              custom={direction}
              initial={(custom) => ({
                opacity: 0,
                x: custom === 'forward' ? 100 : -100,
              })}
              animate={{
                opacity: 1,
                x: 0,
              }}
              exit={(custom) => ({
                opacity: 0,
                x: custom === 'forward' ? -100 : 100,
              })}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
              {/* Question Title */}
              <h2 className="text-2xl sm:text-3xl md:text-4xl text-neutral-900 mb-3 sm:mb-4 leading-snug">
                {currentQuestion.title}
              </h2>

              {/* Help Text */}
              {currentQuestion.help_text && (
                <p className="text-base sm:text-lg text-neutral-600 mb-6 sm:mb-8 leading-relaxed">
                  {currentQuestion.help_text}
                </p>
              )}

              {/* Answer Options */}
              <div className="mb-8">
                {currentQuestion.type === 'single_select' ? (
                  <SingleSelectButtonGroup
                    options={currentQuestion.options}
                    selectedValue={answers[currentQuestion.id] || ''}
                    onSelect={(value) => handleAnswer(currentQuestion.id, value)}
                  />
                ) : (
                  <CheckboxGroup
                    id={currentQuestion.id}
                    options={currentQuestion.options}
                    selectedValues={answers[currentQuestion.id] || []}
                    onChange={(value) => handleAnswer(currentQuestion.id, value)}
                  />
                )}
              </div>

              {/* Acknowledgment for single select */}
              {showAcknowledgment && currentQuestion.type === 'single_select' && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-center text-[#1a7f72] mb-4"
                >
                  {currentStep === 0 && "Perfect. Now let's talk about what drives you..."}
                  {currentStep === 1 && "Got it. Now let's identify what's been challenging..."}
                </motion.p>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="mt-8 pt-6 border-t border-neutral-100">
            {/* Continue Button (for multi-select) */}
            {currentQuestion.type === 'multi_select' && (
              <NavigationButtons
                onNext={handleNext}
                isNextDisabled={!canContinue}
                nextLabel={isLastQuestion ? 'Complete' : 'Continue'}
              />
            )}

            {/* Auto-advance indicator for single select */}
            {currentQuestion.type === 'single_select' &&
              currentQuestion.auto_advance !== false && (
                <div className="flex justify-center">
                  <div className="text-sm text-neutral-500 italic">
                    Select an option to continue
                  </div>
                </div>
              )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
