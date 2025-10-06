import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

import { useFormLogic } from './hooks/useFormLogic';
import formConfig from './data';
import { Screen } from './types';
import { apiClient } from './utils/api';

import ProgressBar from './components/ui/ProgressBar';
import SingleSelectScreen from './components/screens/SingleSelectScreen';
import CompositeScreen from './components/screens/CompositeScreen';
import ContentScreen from './components/screens/ContentScreen';
import TextScreen from './components/screens/TextScreen';
import MultiSelectScreen from './components/screens/MultiSelectScreen';
import NumberScreen from './components/screens/NumberScreen';
import DateScreen from './components/screens/DateScreen';
import ConsentScreen from './components/screens/ConsentScreen';
import TerminalScreen from './components/screens/TerminalScreen';
import ReviewScreen from './components/screens/ReviewScreen';
import MedicationSelectionScreen from './components/screens/MedicationSelectionScreen';
import PlanSelectionScreen from './components/screens/PlanSelectionScreen';
import MedicationOptionsScreen from './components/screens/MedicationOptionsScreen';
import DiscountCodeScreen from './components/screens/DiscountCodeScreen';

const App: React.FC = () => {
  const { 
    currentScreen, 
    answers,
    calculations,
    progress, 
    goToNext, 
    goToPrev,
    history,
    updateAnswer,
    goToScreen,
    direction,
  } = useFormLogic(formConfig);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    document.documentElement.style.setProperty('--primary-color', formConfig.settings.theme.primary_hex);
    document.documentElement.style.setProperty('--accent-color', formConfig.settings.theme.accent_hex);
    document.documentElement.style.setProperty('--secondary-color', formConfig.settings.theme.secondary_hex);
    document.documentElement.style.setProperty('--background-color', formConfig.settings.theme.background_hex);
  }, []);

  // Scroll to top whenever screen changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentScreen.id]);

  useEffect(() => {
    if (currentScreen.id !== 'review.summary' && submitError) {
      setSubmitError(null);
      setIsSubmitting(false);
    }
  }, [currentScreen.id, submitError]);

  const handleReviewSubmit = async () => {
    if (isSubmitting) return;
    try {
      setSubmitError(null);
      setIsSubmitting(true);

      console.warn('[Consultation] handleReviewSubmit triggered');

      const responses = JSON.parse(JSON.stringify(answers));

      const existingAddress = responses.address || {};
      const street = responses.shipping_address || existingAddress.street || '';
      const locality = responses.shipping_city || existingAddress.locality || existingAddress.city || '';
      const region = responses.shipping_state || existingAddress.region || '';
      const postalCode = responses.shipping_zip || existingAddress.postalCode || existingAddress.postal_code || '';
      const country = existingAddress.country || 'US';
      const isDefault = typeof existingAddress.default === 'boolean' ? existingAddress.default : false;

      responses.address = {
        street,
        locality,
        region,
        postalCode,
        country,
        default: isDefault,
      };

      if (!responses.selected_plan && responses.selected_plan_id) {
        responses.selected_plan = responses.selected_plan_id;
      }

      if (responses.notification_consent === undefined || responses.notification_consent === null || responses.notification_consent === '') {
        responses.notification_consent = 'false';
      }

      responses.selected_plan_details = responses.selected_plan_details || answers['selected_plan_details'] || null;
      responses.medication_preferences = responses.medication_preferences || answers['medication_preferences'] || [];
      responses.medication_pharmacy_preferences = responses.medication_pharmacy_preferences || answers['medication_pharmacy_preferences'] || {};

      const payload = {
        condition: responses.condition || 'Weight Loss',
        responses,
        intake_form: formConfig,
        timestamp: new Date().toISOString(),
      };

      console.warn('[Consultation] Submitting payload', payload);
      await apiClient.submitConsultation(payload);
      goToNext();
    } catch (error) {
      console.error(error);
      setSubmitError(error instanceof Error ? error.message : 'Failed to submit form');
    } finally {
      setIsSubmitting(false);
    }
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? '100%' : '-100%',
      opacity: 0,
    }),
  };

  const renderScreen = (screen: Screen) => {
    const commonProps = {
      answers,
      calculations,
      updateAnswer,
      onSubmit: goToNext,
      showBack: history.length > 0,
      onBack: goToPrev,
    };

    if (screen.id === 'treatment.medication_preference') {
      return <MedicationOptionsScreen key={screen.id} {...commonProps} screen={screen} />;
    }

    if (screen.id.startsWith('treatment.plan_selection')) {
      return <PlanSelectionScreen key={screen.id} {...commonProps} screen={screen} />;
    }

    if (screen.id === 'logistics.discount_code') {
      return <DiscountCodeScreen key={screen.id} {...commonProps} screen={screen} />;
    }

    switch (screen.type) {
      case 'single_select':
        return <SingleSelectScreen key={screen.id} {...commonProps} screen={screen} />;
      case 'multi_select':
        return <MultiSelectScreen key={screen.id} {...commonProps} screen={screen} />;
      case 'composite':
        return <CompositeScreen key={screen.id} {...commonProps} screen={screen} />;
      case 'content':
        return <ContentScreen key={screen.id} {...commonProps} screen={screen} />;
      case 'text':
        return <TextScreen key={screen.id} {...commonProps} screen={screen} />;
      case 'number':
        return <NumberScreen key={screen.id} {...commonProps} screen={screen} />;
      case 'date':
        return <DateScreen key={screen.id} {...commonProps} screen={screen} />;
      case 'consent':
        return <ConsentScreen key={screen.id} {...commonProps} screen={screen} />;
      case 'review':
        return <ReviewScreen 
                  key={screen.id}
                  {...commonProps} 
                  screen={screen}
                  onSubmit={handleReviewSubmit}
                  allScreens={formConfig.screens} 
                  providerFields={formConfig.provider_packet.include_fields} 
                  goToScreen={goToScreen} 
                  isSubmitting={isSubmitting}
                  submissionError={submitError}
               />;
      case 'terminal':
        return <TerminalScreen key={screen.id} {...commonProps} screen={screen} />;
      default:
        return <div>Unknown screen type: {(screen as any).type}</div>;
    }
  };
  
  return (
    <div className="bg-background min-h-screen text-slate-800 flex flex-col items-center justify-start p-4 sm:p-6 md:p-8 font-sans transition-colors duration-300">
      <div className="w-full max-w-2xl mx-auto flex flex-col flex-grow">
        {formConfig.settings.progress_bar && <ProgressBar progress={progress} />}
        
        <main className="flex-grow w-full relative mt-8 flex flex-col">
            <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                    key={currentScreen.id}
                    custom={direction}
                    variants={variants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{
                        x: { type: "spring", stiffness: 300, damping: 30 },
                        opacity: { duration: 0.2 }
                    }}
                    className="w-full flex-grow flex"
                >
                    {renderScreen(currentScreen)}
                </motion.div>
            </AnimatePresence>
        </main>
        
        {!currentScreen.type.match(/terminal|content/) && <div className="h-20"></div>}
      </div>
    </div>
  );
};

export default App;
