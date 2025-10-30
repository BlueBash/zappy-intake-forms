/**
 * Example: Complete Screen Flow Implementation
 * 
 * This demonstrates how to use all the screen components together
 * in a multi-step form flow with navigation and state management.
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { renderScreen } from '../utils/screenRouter';
import { Screen } from '../types';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Example screen configuration
const exampleScreens: Screen[] = [
  {
    type: 'text',
    id: 'email',
    title: "What's your email address?",
    help_text: "We'll use this to send you updates about your plan.",
    placeholder: 'you@example.com',
    required: true,
    validation: {
      pattern: '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$',
      error: 'Please enter a valid email address',
    },
  },
  {
    type: 'single_select',
    id: 'demographics.state',
    title: 'Which state do you live in?',
    help_text: 'This helps us determine medication availability in your area.',
    options: [], // Will be populated by RegionDropdown
    required: true,
  },
  {
    type: 'number',
    id: 'weight',
    title: "What's your current weight?",
    placeholder: '150',
    suffix: 'lbs',
    required: true,
    min: 50,
    max: 500,
  },
  {
    type: 'single_select',
    id: 'activity_level',
    title: 'How would you describe your activity level?',
    options: [
      { value: 'sedentary', label: 'Sedentary - Little to no exercise' },
      { value: 'light', label: 'Light - Exercise 1-3 days/week' },
      { value: 'moderate', label: 'Moderate - Exercise 3-5 days/week' },
      { value: 'very', label: 'Very Active - Exercise 6-7 days/week' },
    ],
    required: true,
    auto_advance: true,
  },
  {
    type: 'multi_select',
    id: 'goals',
    title: 'What are your health goals?',
    help_text: 'Select all that apply',
    options: [
      { value: 'weight_loss', label: 'Lose weight' },
      { value: 'energy', label: 'Increase energy' },
      { value: 'fitness', label: 'Improve fitness' },
      { value: 'health', label: 'Better overall health' },
    ],
    required: true,
  },
  {
    type: 'review',
    id: 'review',
    title: 'Review Your Information',
    help_text: 'Please review your answers before submitting.',
  },
  {
    type: 'terminal',
    id: 'success',
    title: 'Thank You!',
    body: "We've received your information and will be in touch soon.",
    status: 'success',
    next_steps: [
      {
        label: 'Check your email for next steps',
        icon_name: 'message',
      },
      {
        label: "We'll review your information within 24 hours",
        icon_name: 'review',
      },
    ],
    cta_primary: {
      label: 'Return to Homepage',
      url: '/',
      open_in_new_tab: false,
    },
  },
];

// Fields to show in review screen
const providerFields = [
  'email',
  'demographics.state',
  'weight',
  'activity_level',
  'goals',
];

export default function ScreenFlowExample() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  const currentScreen = exampleScreens[currentIndex];
  const totalScreens = exampleScreens.length;

  const updateAnswer = (id: string, value: any) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  };

  const handleNext = async () => {
    // Handle final submission on review screen
    if (currentScreen.type === 'review') {
      setIsSubmitting(true);
      setSubmissionError(null);

      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 2000));
        
        // Here you would send answers to your backend
        console.log('Submitting answers:', answers);
        
        // Move to success screen
        setCurrentIndex((prev) => prev + 1);
      } catch (error) {
        setSubmissionError('Something went wrong. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    // Move to next screen
    if (currentIndex < totalScreens - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const goToScreen = (screenId: string) => {
    const index = exampleScreens.findIndex((s) => s.id === screenId);
    if (index !== -1) {
      setCurrentIndex(index);
    }
  };

  const progressPercentage = ((currentIndex + 1) / totalScreens) * 100;

  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      {/* Progress Bar */}
      {currentScreen.type !== 'terminal' && (
        <div className="fixed top-0 left-0 right-0 z-50">
          <div className="h-1 bg-gray-200">
            <motion.div
              className="h-full bg-gradient-to-r from-[#0D9488] to-[#14B8A6]"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
      )}

      {/* Screen Container */}
      <div className="container mx-auto px-4 py-12 pt-16">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentScreen.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {renderScreen({
              screen: currentScreen,
              answers,
              updateAnswer,
              onSubmit: handleNext,
              showBack: currentIndex > 0,
              onBack: handleBack,
              // For review screen
              allScreens: exampleScreens,
              providerFields,
              goToScreen,
              isSubmitting,
              submissionError,
            })}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Step Indicator (optional) */}
      {currentScreen.type !== 'terminal' && currentScreen.type !== 'review' && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-white px-4 py-2 rounded-full shadow-lg border-2 border-gray-200">
          <p className="text-sm text-neutral-600">
            Step {currentIndex + 1} of {totalScreens - 2}
          </p>
        </div>
      )}
    </div>
  );
}

/**
 * USAGE:
 * 
 * import ScreenFlowExample from './examples/ScreenFlowExample';
 * 
 * function App() {
 *   return <ScreenFlowExample />;
 * }
 */
