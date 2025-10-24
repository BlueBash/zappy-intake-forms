import React, { useEffect, useMemo, useState, useCallback, useRef } from 'react';
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
import InterstitialScreen from './components/screens/InterstitialScreen';
import GLP1HistoryScreen from './components/screens/GLP1HistoryScreen';
import { buildMedicationHistorySummary } from './utils/medicationHistory';

type ProgramTheme = {
  headerBg: string;
  headerBorder: string;
  badgeBg: string;
  badgeText: string;
  badgeShadow: string;
};

const getProgramTheme = (condition: string): ProgramTheme => {
  const normalized = condition.toLowerCase();
  if (normalized.includes('strength')) {
    return {
      headerBg: 'bg-sky-50/90',
      headerBorder: 'border-sky-100',
      badgeBg: 'bg-gradient-to-r from-sky-500 to-emerald-500',
      badgeText: 'text-white',
      badgeShadow: 'shadow-sky-200/60',
    };
  }
  if (normalized.includes('anti')) {
    return {
      headerBg: 'bg-fuchsia-50/90',
      headerBorder: 'border-fuchsia-100',
      badgeBg: 'bg-gradient-to-r from-fuchsia-500 to-rose-500',
      badgeText: 'text-white',
      badgeShadow: 'shadow-fuchsia-200/60',
    };
  }
  return {
    headerBg: 'bg-orange-50/90',
    headerBorder: 'border-orange-100',
    badgeBg: 'bg-gradient-to-r from-orange-500 to-amber-500',
    badgeText: 'text-white',
    badgeShadow: 'shadow-orange-200/60',
  };
};

const ProgramHeader: React.FC<{ condition: string; theme: ProgramTheme }> = ({ condition, theme }) => (
  <header
    className={`mb-8 w-full rounded-3xl border ${theme.headerBorder} ${theme.headerBg} px-6 py-5 shadow-sm shadow-slate-200/40 backdrop-blur-sm`}
  >
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <a href="https://zappyhealth.com" className="inline-flex items-center" aria-label="ZappyHealth home">
        <img
          src="https://zappyhealth.com/wp-content/uploads/2022/09/Zappy-logo-2.webp"
          srcSet="https://zappyhealth.com/wp-content/uploads/2022/09/Zappy-logo-2.webp 352w, https://zappyhealth.com/wp-content/uploads/2022/09/Zappy-logo-2-300x109.webp 300w"
          sizes="(max-width: 220px) 100vw, 220px"
          width={220}
          height={80}
          alt="ZappyHealth"
          loading="lazy"
          className="h-10 w-auto sm:h-12"
        />
      </a>
      <div className={`inline-flex flex-col items-center rounded-2xl px-4 py-2 text-xs font-semibold uppercase tracking-[0.32em] ${theme.badgeBg} ${theme.badgeText} shadow-lg ${theme.badgeShadow}`}>
        <span>Program</span>
        <span className="mt-1 text-sm font-semibold tracking-normal uppercase">{condition}</span>
      </div>
    </div>
  </header>
);

const LEAD_SESSION_STORAGE_KEY = 'consultation_lead_id';

const toServiceSlug = (value: string): string =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '') || 'general';

const isValidEmail = (value: unknown): value is string =>
  typeof value === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

type LeadSyncReason = 'email_capture' | 'screen_transition' | 'form_submission';

interface LeadSyncContext {
  reason: LeadSyncReason;
  previousScreenId?: string | null;
  formRequestId?: string;
}

const extractFormRequestId = (response: unknown): string | undefined => {
  if (!response || typeof response !== 'object') {
    return undefined;
  }

  const candidate = response as Record<string, any>;
  const id = candidate.form_request_id;
  return typeof id === 'string' && id ? id : undefined;
};

interface AppProps {
  formConfig?: FormConfig;
  defaultCondition?: string;
}

const App: React.FC<AppProps> = ({ formConfig: providedFormConfig, defaultCondition }) => {
  const activeFormConfig = providedFormConfig ?? defaultFormConfig;
  const resolvedCondition = defaultCondition ?? activeFormConfig.default_condition ?? 'Weight Loss';
  const programTheme = useMemo(() => getProgramTheme(resolvedCondition), [resolvedCondition]);
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

  const serviceSlug = useMemo(() => toServiceSlug(resolvedCondition), [resolvedCondition]);
  const [leadId, setLeadId] = useState<string | null>(() => {
    if (typeof window === 'undefined') {
      return null;
    }
    try {
      return window.sessionStorage.getItem(LEAD_SESSION_STORAGE_KEY);
    } catch (error) {
      console.warn('[Consultation] Unable to read lead id from session storage', error);
      return null;
    }
  });
  const lastEmailSyncedRef = useRef<string | null>(null);
  const previousScreenIdRef = useRef<string | null>(null);
  const formSubmittedRef = useRef(false);

  if (previousScreenIdRef.current === null) {
    previousScreenIdRef.current = currentScreen.id;
  }

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [screenAnnouncement, setScreenAnnouncement] = useState<string>('');

  useEffect(() => {
    const { theme } = activeFormConfig.settings;
    document.documentElement.style.setProperty('--primary-color', theme.primary_hex);
    document.documentElement.style.setProperty('--accent-color', theme.accent_hex);
    document.documentElement.style.setProperty('--secondary-color', theme.secondary_hex);
    document.documentElement.style.setProperty('--background-color', theme.background_hex);
  }, [activeFormConfig]);

  // Scroll to top and announce screen change for screen readers
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Announce screen title for screen readers
    const announcement = ('title' in currentScreen ? currentScreen.title : null) || 
                        (currentScreen.type === 'content' ? (currentScreen as any).headline : null) ||
                        'New screen';
    setScreenAnnouncement(announcement);
    
    // Clear announcement after it's been read
    const timeout = setTimeout(() => setScreenAnnouncement(''), 1000);
    return () => clearTimeout(timeout);
  }, [currentScreen.id]);

  useEffect(() => {
    if (currentScreen.id !== 'review.summary' && submitError) {
      setSubmitError(null);
      setIsSubmitting(false);
    }
  }, [currentScreen.id, submitError]);

  const syncLead = useCallback(async (context: LeadSyncContext) => {
    if (formSubmittedRef.current) {
      return;
    }

    if (!isValidEmail(answers.email)) {
      return;
    }

    const email = (answers.email as string).trim();
    const status = context.reason === 'form_submission' ? 'submitted' : 'new';

    let answersSnapshot: Record<string, unknown> = {};
    try {
      answersSnapshot = JSON.parse(JSON.stringify(answers ?? {}));
    } catch (error) {
      console.warn('[Consultation] Failed to serialize answers for lead payload', error);
    }

    const metaData: Record<string, unknown> = {
      answers: answersSnapshot,
      condition: resolvedCondition,
      current_screen_id: currentScreen.id,
      previous_screen_id: context.previousScreenId ?? previousScreenIdRef.current ?? null,
      form_name: activeFormConfig.meta?.form_name ?? null,
      form_version: activeFormConfig.meta?.version ?? null,
      submission_status: status,
    };

    if (context.formRequestId) {
      metaData.form_request_id = context.formRequestId;
    }

    try {
      const response = await apiClient.createOrUpdateLead({
        email,
        service: serviceSlug,
        status,
        meta_data: metaData,
        ...(leadId ? { id: leadId } : {}),
        ...(context.formRequestId ? { form_request_id: context.formRequestId } : {}),
      });

      if (response?.lead?.id) {
        setLeadId(prev => {
          if (prev === response.lead.id) {
            return prev;
          }
          if (typeof window !== 'undefined') {
            try {
              window.sessionStorage.setItem(LEAD_SESSION_STORAGE_KEY, response.lead.id);
            } catch (storageError) {
              console.warn('[Consultation] Unable to persist lead id in session storage', storageError);
            }
          }
          return response.lead.id;
        });
      }
    } catch (error) {
      console.error('[Consultation] Failed to sync lead', error);
    }
  }, [answers, resolvedCondition, currentScreen.id, activeFormConfig.meta?.form_name, activeFormConfig.meta?.version, serviceSlug, leadId]);

  useEffect(() => {
    if (formSubmittedRef.current) {
      return;
    }

    if (!isValidEmail(answers.email)) {
      return;
    }

    const normalizedEmail = (answers.email as string).trim().toLowerCase();
    if (lastEmailSyncedRef.current === normalizedEmail && leadId) {
      return;
    }

    lastEmailSyncedRef.current = normalizedEmail;
    void syncLead({
      reason: 'email_capture',
      previousScreenId: previousScreenIdRef.current,
    });
  }, [answers.email, leadId, syncLead]);

  useEffect(() => {
    if (formSubmittedRef.current) {
      previousScreenIdRef.current = currentScreen.id;
      return;
    }

    const previousScreenId = previousScreenIdRef.current;
    const advancedToNewScreen = previousScreenId && previousScreenId !== currentScreen.id;

    if (advancedToNewScreen && direction >= 0 && isValidEmail(answers.email)) {
      void syncLead({
        reason: 'screen_transition',
        previousScreenId,
      });
    }

    previousScreenIdRef.current = currentScreen.id;
  }, [currentScreen.id, direction, answers.email, syncLead]);

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

      const medicationHistorySummary = buildMedicationHistorySummary(responses);
      responses.medications_used = medicationHistorySummary.selectedMedications.length > 0
        ? medicationHistorySummary.selectedMedications.join(', ')
        : 'None';
      responses.currently_taking = medicationHistorySummary.currentlyTaking.length > 0
        ? medicationHistorySummary.currentlyTaking.join(', ')
        : 'None';

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
      const submissionResponse = await apiClient.submitConsultation(payload);
      const formRequestId = extractFormRequestId(submissionResponse);

      try {
        await syncLead({
          reason: 'form_submission',
          previousScreenId: previousScreenIdRef.current,
          formRequestId,
        });
      } catch (leadSyncError) {
        console.error('[Consultation] Failed to update lead after submission', leadSyncError);
      } finally {
        formSubmittedRef.current = true;
        lastEmailSyncedRef.current = null;
        previousScreenIdRef.current = currentScreen.id;
        try {
          if (typeof window !== 'undefined') {
            window.sessionStorage.removeItem(LEAD_SESSION_STORAGE_KEY);
          }
        } catch (storageError) {
          console.warn('[Consultation] Unable to clear lead id from session storage', storageError);
        }
        setLeadId(null);
      }

      goToNext();
    } catch (error) {
      console.error(error);
      setSubmitError(error instanceof Error ? error.message : 'Failed to submit form');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Check for reduced motion preference
  const reducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const variants = {
    enter: (direction: number) => (reducedMotion ? {
      opacity: 1,
      x: 0,
    } : {
      x: direction > 0 ? 20 : -20,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => (reducedMotion ? {
      opacity: 1,
      x: 0,
    } : {
      zIndex: 0,
      x: direction < 0 ? 20 : -20,
      opacity: 0,
    }),
  };

  const renderScreen = (screen: Screen) => {
    // Show login link on screens before email capture
    const showLoginLink = screen.id !== 'capture.email' && 
                          !answers['email'] && 
                          screen.type !== 'terminal' && 
                          screen.type !== 'interstitial' &&
                          screen.type !== 'content';
    
    const commonProps = {
      answers,
      calculations,
      updateAnswer,
      onSubmit: goToNext,
      showBack: history.length > 0,
      onBack: goToPrev,
      defaultCondition: resolvedCondition,
      showLoginLink,
    };

    if (screen.id === 'treatment.glp1_history') {
      return <GLP1HistoryScreen key={screen.id} {...commonProps} screen={screen} />;
    }

    if (screen.id === 'treatment.medication_preference' || screen.id === 'treatment.medication_preference_initial') {
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
      case 'interstitial':
        return <InterstitialScreen key={screen.id} screen={screen} onSubmit={goToNext} />;
      default:
        return <div>Unknown screen type: {(screen as any).type}</div>;
    }
  };
  
  return (
    <div className="min-h-screen text-neutral-700 flex flex-col items-center justify-start p-4 sm:p-6 md:p-8 font-sans">
      {/* Screen reader announcements for dynamic content */}
      <div 
        role="status" 
        aria-live="polite" 
        aria-atomic="true"
        className="sr-only"
      >
        {screenAnnouncement}
      </div>
      
      <div className="relative w-full max-w-2xl mx-auto flex flex-col flex-grow">
        <div className="flex flex-col flex-grow">
          {activeFormConfig.settings.progress_bar && <ProgressBar progress={progress} />}
          
          <main className="flex-grow w-full relative flex flex-col min-h-0">
              <AnimatePresence mode="wait" initial={false} custom={direction}>
                  <motion.div
                      key={currentScreen.id}
                      custom={direction}
                      variants={variants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={reducedMotion ? {
                          duration: 0.01
                      } : {
                          duration: 0.5,
                          ease: [0.25, 0.1, 0.25, 1]
                      }}
                      className="w-full flex-grow flex"
                      style={{ position: 'relative' }}
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
