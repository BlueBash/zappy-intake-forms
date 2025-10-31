import React, { useEffect, useMemo, useState, useCallback, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

import { useFormLogic } from './hooks/useFormLogic';
import type { Screen, FormConfig } from './types';
import defaultFormConfig from './forms/weight-loss/data';
import { apiClient } from './utils/api';

import ProgressBar from './components/ui/ProgressBar';
import SectionIndicator from './components/common/SectionIndicator';
import ScreenHeader from './components/common/ScreenHeader';
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
// import MedicationSelectionScreen from './components/screens/MedicationSelectionScreen';
import PlanSelectionScreen from './components/screens/PlanSelectionScreen';
import MedicationOptionsScreen from './components/screens/MedicationOptionsScreen';
import DiscountCodeScreen from './components/screens/DiscountCodeScreen';
import InterstitialScreen from './components/screens/InterstitialScreen';
import GLP1HistoryScreen from './components/screens/GLP1HistoryScreen';
import MedicationChoiceScreen from './components/screens/MedicationChoiceScreen';
import AccountCreationScreen from './components/screens/AccountCreationScreen';
import MedicationPreferenceInitialScreen from './components/screens/MedicationPreferenceInitialScreen';
import MedicationPreferenceScreen from './components/screens/MedicationPreferenceScreen';
import WeightLossGraphScreen from './components/screens/WeightLossGraphScreen';
import EmailCaptureScreen from './components/screens/EmailCaptureScreen';
import { buildMedicationHistorySummary } from './utils/medicationHistory';
import AutocompleteScreen from './components/screens/AutocompleteScreen';

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
      headerBg: 'bg-[#E0F5F3]/90',
      headerBorder: 'border-[#E8E8E8]',
      badgeBg: 'bg-[#00A896]',
      badgeText: 'text-white',
      badgeShadow: 'shadow-lg',
    };
  }
  if (normalized.includes('anti')) {
    return {
      headerBg: 'bg-[#FFF5F3]/90',
      headerBorder: 'border-[#E8E8E8]',
      badgeBg: 'bg-[#FF6B6B]',
      badgeText: 'text-white',
      badgeShadow: 'shadow-lg',
    };
  }
  return {
    headerBg: 'bg-[#fef8f2]/90',
    headerBorder: 'border-[#E8E8E8]',
    badgeBg: 'bg-[#00A896]',
    badgeText: 'text-white',
    badgeShadow: 'shadow-lg',
  };
};


const LEAD_SESSION_STORAGE_KEY = 'consultation_lead_id';

const toServiceSlug = (value: string): string =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '') || 'general';

const getSectionLabel = (screen: Screen): string => {
  // Specific screen ID mappings for better UX
  if (screen.id.includes('goal') || screen.id === 'goal_range' || screen.id === 'goal_motivations' || screen.id === 'goal_challenges') {
    return 'Your Goals';
  }
  if (screen.id === 'home_state' || screen.id.includes('demographics') || screen.id.includes('personal') || screen.id.includes('age') || screen.id.includes('dob')) {
    return 'About You';
  }
  if (screen.id.includes('medical') || screen.id.includes('health') || screen.id.includes('glp1') || screen.id.includes('medication') || screen.id.includes('eating') || screen.id.includes('substance')) {
    return 'Health History';
  }
  if (screen.id.includes('weight') || screen.id.includes('height') || screen.id.includes('measurement')) {
    return 'Your Measurements';
  }
  if (screen.id.includes('plan') || screen.id.includes('subscription')) {
    return 'Plan Selection';
  }
  if (screen.id.includes('account') || screen.id.includes('payment') || screen.id.includes('checkout')) {
    return 'Account Setup';
  }
  if (screen.id.includes('review') || screen.id.includes('summary')) {
    return 'Review & Submit';
  }
  if (screen.id.includes('ethnicity') || screen.id.includes('race')) {
    return 'Background';
  }
  
  // Default based on screen type - avoid generic "Assessment"
  switch (screen.type) {
    case 'content':
    case 'interstitial':
      return 'Information';
    case 'consent':
      return 'Terms & Consent';
    case 'terminal':
      return 'Complete';
    default:
      return 'Questions'; // Remove generic "Assessment"
  }
};

const isValidEmail = (value: unknown): value is string =>
  typeof value === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

type LeadSyncReason = 'email_capture' | 'screen_transition' | 'form_submission';

interface LeadSyncContext {
  reason: LeadSyncReason;
  previousScreenId?: string | null;
  formRequestId?: string;
}

type AccountSubmissionData = {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  [key: string]: unknown;
};

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

const FORM_SAVE_PREFIX = 'zappy_form_save_';
const AUTO_SAVE_INTERVAL_MS = 30000; // 30 seconds

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
  
  // Auto-save state
  const [lastSavedTime, setLastSavedTime] = useState<Date | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const lastEmailSyncedRef = useRef<string | null>(null);
  const previousScreenIdRef = useRef<string | null>(null);
  const formSubmittedRef = useRef(false);
  const latestAccountDataRef = useRef<AccountSubmissionData | null>(null);
  const sessionIdRef = useRef<string>(() => {
    // Generate or retrieve session ID for saving progress before email is captured
    const stored = typeof window !== 'undefined' ? localStorage.getItem('zappy_session_id') : null;
    if (stored) return stored;
    const newId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    if (typeof window !== 'undefined') {
      localStorage.setItem('zappy_session_id', newId);
    }
    return newId;
  });

  if (previousScreenIdRef.current === null) {
    previousScreenIdRef.current = currentScreen.id;
  }

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [screenAnnouncement, setScreenAnnouncement] = useState<string>('');

  // Get save key based on email or session ID
  const getSaveKey = useCallback(() => {
    if (isValidEmail(answers.email)) {
      return `${FORM_SAVE_PREFIX}${(answers.email as string).trim().toLowerCase()}`;
    }
    return `${FORM_SAVE_PREFIX}${sessionIdRef.current}`;
  }, [answers.email]);

  // Save progress to localStorage
  const saveProgress = useCallback(() => {
    if (formSubmittedRef.current) return;
    
    try {
      setIsSaving(true);
      setSaveError(null);
      
      const saveData = {
        answers,
        currentScreenId: currentScreen.id,
        history,
        calculations,
        timestamp: Date.now(),
        condition: resolvedCondition,
      };
      
      const saveKey = getSaveKey();
      localStorage.setItem(saveKey, JSON.stringify(saveData));
      setLastSavedTime(new Date());
      
      // If user has provided email, also save under email key and clear session save
      if (isValidEmail(answers.email)) {
        const sessionKey = `${FORM_SAVE_PREFIX}${sessionIdRef.current}`;
        if (sessionKey !== saveKey) {
          localStorage.removeItem(sessionKey);
        }
      }
    } catch (error) {
      console.error('[AutoSave] Failed to save progress', error);
      setSaveError('Unable to save progress');
    } finally {
      setIsSaving(false);
    }
  }, [answers, currentScreen.id, history, calculations, resolvedCondition, getSaveKey]);

  // Auto-save effect - saves every 30 seconds
  useEffect(() => {
    if (formSubmittedRef.current) return;
    
    // Save immediately on answer change (debounced by interval)
    const saveInterval = setInterval(() => {
      saveProgress();
    }, AUTO_SAVE_INTERVAL_MS);

    return () => clearInterval(saveInterval);
  }, [saveProgress]);

  // Save on screen change
  useEffect(() => {
    if (!formSubmittedRef.current && history.length > 0) {
      saveProgress();
    }
  }, [currentScreen.id, saveProgress, history.length]);


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

  const handleReviewSubmit = async (accountData?: AccountSubmissionData) => {
    if (isSubmitting) return;
    try {
      setSubmitError(null);
      setIsSubmitting(true);

      if (accountData && typeof accountData === 'object') {
        latestAccountDataRef.current = accountData;
      }

      const mergedAccountData = latestAccountDataRef.current;
      const responses = JSON.parse(JSON.stringify(answers));
      const normalizeString = (value: unknown): string => (typeof value === 'string' ? value.trim() : '');

      let normalizedAccountEntries: Record<string, string> = {};

      if (mergedAccountData) {
        normalizedAccountEntries = Object.entries(mergedAccountData).reduce<Record<string, string>>((acc, [key, value]) => {
          const normalized = normalizeString(value);
          if (!normalized) {
            return acc;
          }
          acc[key] = normalized;
          const accountKey = `account_${key}`;
          responses[accountKey] = key === 'state' ? normalized.toUpperCase() : normalized;
          return acc;
        }, {});

        if (normalizedAccountEntries.email) {
          const loweredEmail = normalizedAccountEntries.email.toLowerCase();
          responses.account_email = loweredEmail;
          responses.email = loweredEmail;
        }

        if (normalizedAccountEntries.password) {
          responses.account_password = normalizedAccountEntries.password;
        }

        if (normalizedAccountEntries.address) {
          responses.account_address = normalizedAccountEntries.address;
          if (!normalizeString(responses.address_line1)) {
            responses.address_line1 = normalizedAccountEntries.address;
          }
        }

        if (normalizedAccountEntries.city) {
          responses.account_city = normalizedAccountEntries.city;
        }

        if (normalizedAccountEntries.state) {
          const upperState = normalizedAccountEntries.state.toUpperCase();
          responses.account_state = upperState;
          normalizedAccountEntries.state = upperState;
        }

        if (normalizedAccountEntries.zipCode) {
          responses.account_zipCode = normalizedAccountEntries.zipCode;
        }
      }

      const resolvedFirstName =
        normalizeString(responses.account_firstName) ||
        normalizeString(responses.account_first_name) ||
        normalizeString(responses.first_name) ||
        normalizedAccountEntries.firstName;
      if (resolvedFirstName) {
        responses.account_firstName = resolvedFirstName;
        responses.first_name = resolvedFirstName;
      }

      const resolvedLastName =
        normalizeString(responses.account_lastName) ||
        normalizeString(responses.account_last_name) ||
        normalizeString(responses.last_name) ||
        normalizedAccountEntries.lastName;
      if (resolvedLastName) {
        responses.account_lastName = resolvedLastName;
        responses.last_name = resolvedLastName;
      }

      const resolvedPhone =
        normalizeString(responses.phone) ||
        normalizeString(responses.account_phone) ||
        normalizedAccountEntries.phone;
      if (resolvedPhone) {
        responses.account_phone = resolvedPhone;
        responses.phone = resolvedPhone;
      }

      const existingAddress = responses.address || {};
      const pickAddressValue = (...values: unknown[]): string => {
        for (const value of values) {
          const normalized = normalizeString(value);
          if (normalized) {
            return normalized;
          }
        }
        return '';
      };
      const street = pickAddressValue(
        responses.address_line1,
        responses.shipping_address,
        existingAddress.street,
        existingAddress.address_line1,
        responses.account_address,
        responses.account_address_line1,
        normalizedAccountEntries.address
      );
      const unit = pickAddressValue(
        responses.address_line2,
        existingAddress.unit,
        existingAddress.address_line2,
        responses.account_address_line2
      );
      const locality = pickAddressValue(
        responses.city,
        responses.shipping_city,
        existingAddress.locality,
        existingAddress.city,
        responses.account_city,
        responses.home_city,
        normalizedAccountEntries.city
      );
      const region = pickAddressValue(
        responses.state,
        responses.shipping_state,
        existingAddress.region,
        existingAddress.state,
        responses.home_state,
        responses.account_state,
        normalizedAccountEntries.state
      );
      const postalCode = pickAddressValue(
        responses.zip_code,
        responses.shipping_zip,
        existingAddress.postalCode,
        existingAddress.postal_code,
        existingAddress.zip_code,
        responses.account_zipCode,
        responses.account_zipcode,
        responses.home_zip,
        normalizedAccountEntries.zipCode
      );
      const countryRaw = pickAddressValue(
        responses.country,
        existingAddress.country,
        responses.account_country,
        responses.home_country
      );
      const country = (countryRaw || 'US').toUpperCase();
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

      const discountData = (responses.discount_data ?? answers['discount_data']) as
        | { id?: string; code?: string; amount?: number; percentage?: number; description?: string | null }
        | null
        | undefined;
      const existingDiscountId =
        typeof responses.discount_id === 'string'
          ? responses.discount_id
          : typeof answers['discount_id'] === 'string'
          ? answers['discount_id']
          : '';
      const resolvedDiscountId = existingDiscountId || (discountData?.id ?? '');
      responses.discount_id = resolvedDiscountId || '';
      if (!responses.discount_code && discountData?.code) {
        responses.discount_code = discountData.code;
      }
      if ((responses.discount_amount === undefined || responses.discount_amount === null) && typeof discountData?.amount === 'number') {
        responses.discount_amount = discountData.amount;
      }
      if ((responses.discount_percentage === undefined || responses.discount_percentage === null) && typeof discountData?.percentage === 'number') {
        responses.discount_percentage = discountData.percentage;
      }
      if (!responses.discount_description && typeof discountData?.description === 'string') {
        responses.discount_description = discountData.description;
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

      console.log('answers', answers);

      const clientRecordId = answers['client_record_id'] ?? (typeof window !== 'undefined' ? window.sessionStorage.getItem('client_record_id') : null);

      const payload = {
        condition: responses.condition,
        responses,
        client_record_id: clientRecordId || undefined,
        // intake_form: activeFormConfig,
        // timestamp: new Date().toISOString(),
      };

      const submissionResponse :any = await apiClient.submitConsultation(payload);
      const formRequestId = extractFormRequestId(submissionResponse);

      const invoice = submissionResponse?.invoice;
      const paymentIntent = submissionResponse?.payment_intent;
      const paymentIntentId = paymentIntent?.id ?? paymentIntent?.payment_intent_id ?? paymentIntent?.paymentIntentId;
      const paymentClientSecret = paymentIntent?.client_secret ?? paymentIntent?.clientSecret;
      const paymentAmount = paymentIntent?.amount;
      const paymentCurrency = paymentIntent?.currency;
      const invoiceId = invoice?.id ?? invoice?.invoice_id ?? invoice?.invoiceId;

      const shouldRedirectToPayment = Boolean(invoice && paymentIntent && paymentIntentId && paymentClientSecret);
      const paymentUrl = shouldRedirectToPayment
        ? `/payment.html?client_secret=${encodeURIComponent(paymentClientSecret)}&payment_intent=${encodeURIComponent(paymentIntentId)}${paymentAmount ? `&amount=${encodeURIComponent(paymentAmount)}` : ''}${invoiceId ? `&invoice_id=${encodeURIComponent(invoiceId)}` : ''}${paymentCurrency ? `&currency=${encodeURIComponent(paymentCurrency)}` : ''}`
        : null;
      
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
        latestAccountDataRef.current = null;
      }

      if (shouldRedirectToPayment && paymentUrl) {
        window.location.href = paymentUrl;
        return;
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
      screen,
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
      return <GLP1HistoryScreen key={screen.id} {...commonProps} />;
    }

    if (screen.id === 'treatment.medication_choice') {
      return <MedicationChoiceScreen {...commonProps} />;
    }

    if (screen.id === 'checkout.account_creation') {
      return <AccountCreationScreen key={screen.id} {...commonProps} onSubmit={handleReviewSubmit}/>;
    }

    if (screen.id === 'treatment.medication_preference_initial') {
      return <MedicationPreferenceInitialScreen key={screen.id} {...commonProps} />;
    }

    if (screen.id === 'treatment.medication_options') {
      return <MedicationOptionsScreen key={screen.id} {...commonProps} goToScreen={goToScreen} />;
    }

    if (screen.id === 'treatment.medication_preference') {
      return <MedicationPreferenceScreen key={screen.id} {...commonProps} />;
    }

    if (screen.id === 'logistics.discount_code') {
      return <DiscountCodeScreen key={screen.id} {...commonProps} />;
    }

    if (screen.id === 'capture.email') {
      return <EmailCaptureScreen key={screen.id} {...commonProps} screen={screen} />;
    }

    switch (screen.type) {
      case 'single_select':
        return <SingleSelectScreen key={screen.id} {...commonProps} screen={screen} />;
      case 'autocomplete':
        return <AutocompleteScreen key={screen.id} {...commonProps} screen={screen} />;
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
        return <TerminalScreen {...commonProps} screen={screen} key={screen.id} />;
      case 'interstitial':
        return <InterstitialScreen screen={screen} onSubmit={goToNext} />;
      case 'plan_selection':
        return <PlanSelectionScreen {...commonProps} screen={screen} />;
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
        {/* Header with logo and back button */}
        <ScreenHeader
          onBack={history.length > 0 ? goToPrev : undefined}
          sectionLabel={getSectionLabel(currentScreen)}
          currentStep={history.length + 1}
          totalSteps={38}
          showProgress={activeFormConfig.settings.progress_bar}
          progressPercentage={(history.length / 38) * 100}
        />
        
        <div className="flex flex-col flex-grow">
          
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
