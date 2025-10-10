import React, { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

import { useFormLogic } from './hooks/useFormLogic';
import type { Screen, FormConfig } from './types';
import defaultFormConfig from './forms/weight-loss/data';
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

interface AppProps {
  formConfig?: FormConfig;
  defaultCondition?: string;
}

const App: React.FC<AppProps> = ({ formConfig: providedFormConfig, defaultCondition }) => {
  const activeFormConfig = providedFormConfig ?? defaultFormConfig;
  const resolvedCondition = defaultCondition ?? activeFormConfig.default_condition ?? 'Weight Loss';
  const badgeTheme = useMemo(() => {
    const normalized = resolvedCondition.toLowerCase();
    if (normalized.includes('strength')) {
      return {
        background: 'bg-gradient-to-r from-indigo-500 via-sky-500 to-emerald-400 text-white',
        accent: 'text-white/80',
      };
    }
    if (normalized.includes('anti')) {
      return {
        background: 'bg-gradient-to-r from-purple-500 via-fuchsia-500 to-rose-500 text-white',
        accent: 'text-white/80',
      };
    }
    return {
      background: 'bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white',
      accent: 'text-white/80',
    };
  }, [resolvedCondition]);
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
  } = useFormLogic(activeFormConfig);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    const { theme } = activeFormConfig.settings;
    document.documentElement.style.setProperty('--primary-color', theme.primary_hex);
    document.documentElement.style.setProperty('--accent-color', theme.accent_hex);
    document.documentElement.style.setProperty('--secondary-color', theme.secondary_hex);
    document.documentElement.style.setProperty('--background-color', theme.background_hex);
  }, [activeFormConfig]);

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
      const normalizeString = (value: unknown): string => (typeof value === 'string' ? value.trim() : '');
      const street =
        normalizeString(responses.address_line1) ||
        normalizeString(responses.shipping_address) ||
        normalizeString(existingAddress.street);
      const unit =
        normalizeString(responses.address_line2) ||
        normalizeString(existingAddress.unit) ||
        normalizeString(existingAddress.address_line2);
      const locality =
        normalizeString(responses.city) ||
        normalizeString(responses.shipping_city) ||
        normalizeString(existingAddress.locality) ||
        normalizeString(existingAddress.city);
      const region =
        normalizeString(responses.state) ||
        normalizeString(responses.shipping_state) ||
        normalizeString(existingAddress.region);
      const postalCode =
        normalizeString(responses.zip_code) ||
        normalizeString(responses.shipping_zip) ||
        normalizeString(existingAddress.postalCode) ||
        normalizeString(existingAddress.postal_code);
      const country = (
        normalizeString(responses.country) ||
        normalizeString(existingAddress.country) ||
        'US'
      ).toUpperCase();
      const isDefault = typeof existingAddress.default === 'boolean' ? existingAddress.default : false;

      responses.address = {
        street,
        unit,
        locality,
        region: region.toUpperCase(),
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

      if (!responses.condition) {
        responses.condition = resolvedCondition;
      }

      const payload = {
        condition: responses.condition,
        responses,
        intake_form: activeFormConfig,
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
      defaultCondition: resolvedCondition,
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
        return (
          <ReviewScreen
            key={screen.id}
            {...commonProps}
            screen={screen}
            onSubmit={handleReviewSubmit}
            allScreens={activeFormConfig.screens}
            providerFields={activeFormConfig.provider_packet.include_fields}
            goToScreen={goToScreen}
            isSubmitting={isSubmitting}
            submissionError={submitError}
          />
        );
      case 'terminal':
        return <TerminalScreen key={screen.id} {...commonProps} screen={screen} />;
      default:
        return <div>Unknown screen type: {(screen as any).type}</div>;
    }
  };
  
  const isFirstScreen = currentScreen.id === activeFormConfig.screens[0].id;

  return (
    <div className="bg-background min-h-screen text-slate-800 flex flex-col items-center justify-start p-4 sm:p-6 md:p-8 font-sans transition-colors duration-300">
      <div className="relative w-full max-w-2xl mx-auto flex flex-col flex-grow">
        {isFirstScreen && (
          <div className="pointer-events-none absolute -top-2 right-0 z-10">
            <div
              className={`pointer-events-auto rounded-2xl px-5 py-4 text-right shadow-lg shadow-primary/20 backdrop-blur-sm ${badgeTheme.background}`}
            >
              <p className={`text-[10px] font-semibold uppercase tracking-[0.44em] ${badgeTheme.accent}`}>Program</p>
              <p className="mt-2 text-base font-semibold drop-shadow-sm">{resolvedCondition}</p>
            </div>
          </div>
        )}
        <div className={`flex flex-col flex-grow ${isFirstScreen ? 'pt-20 sm:pt-24' : ''}`}>
          {activeFormConfig.settings.progress_bar && <ProgressBar progress={progress} />}
          
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
    </div>
  );
};

export default App;
