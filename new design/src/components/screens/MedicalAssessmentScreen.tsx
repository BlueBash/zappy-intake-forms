import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertCircle, Info, Check, Phone, MessageCircle, Heart } from 'lucide-react';
import ScreenHeader from '../common/ScreenHeader';
import { TouchButton } from '../common/TouchButton';
import NavigationButtons from '../common/NavigationButtons';
import SingleSelectButtonGroup from '../common/SingleSelectButtonGroup';
import CheckboxGroup from '../common/CheckboxGroup';
import Input from '../ui/Input';
import { InfoTooltip } from '../common/InfoTooltip';

interface MedicalAssessmentData {
  // Section 1: Basic Info
  sex_birth?: string;
  ethnicity?: string;
  
  // Section 2: Mental Health
  mental_health_diagnosis?: string[];
  mental_health_other?: string;
  
  // Section 3: Eating & Substance Use
  eating_relationship?: string;
  eating_disorder_type?: string[];
  alcohol_use?: string;
  tobacco_use?: string;
  recreational_substances?: string[];
  
  // Section 4: Medical Conditions
  diabetes?: string;
  diabetes_type?: string;
  pregnancy?: string;
  medical_conditions?: string[];
  medical_conditions_other?: string;
  glp1_safety?: string[];
  
  // Section 5: Current Medications
  current_medications?: string[];
  medications_detail?: string;
  
  // Section 6: Allergies & Supplements
  supplements?: string;
  supplements_detail?: string;
  allergies?: string;
  allergies_detail?: string;
  
  // Section 7: Lifestyle
  activity_level?: string;
  journey_notes?: string;
}

interface MedicalAssessmentScreenProps {
  onNext: (data: MedicalAssessmentData & { exclusion?: any; warnings?: any[] }) => void;
  onBack: () => void;
  initialData?: MedicalAssessmentData;
  sexBirth?: 'male' | 'female';
  currentStep?: number;
  totalSteps?: number;
}

export default function MedicalAssessmentScreen({
  onNext,
  onBack,
  initialData = {},
  sexBirth,
  currentStep,
  totalSteps
}: MedicalAssessmentScreenProps) {
  const [formData, setFormData] = useState<MedicalAssessmentData>({
    sex_birth: sexBirth || initialData.sex_birth || '',
    ethnicity: initialData.ethnicity || '',
    mental_health_diagnosis: initialData.mental_health_diagnosis || [],
    mental_health_other: initialData.mental_health_other || '',
    eating_relationship: initialData.eating_relationship || '',
    eating_disorder_type: initialData.eating_disorder_type || [],
    alcohol_use: initialData.alcohol_use || '',
    tobacco_use: initialData.tobacco_use || '',
    recreational_substances: initialData.recreational_substances || [],
    diabetes: initialData.diabetes || '',
    diabetes_type: initialData.diabetes_type || '',
    pregnancy: initialData.pregnancy || '',
    medical_conditions: initialData.medical_conditions || [],
    medical_conditions_other: initialData.medical_conditions_other || '',
    glp1_safety: initialData.glp1_safety || [],
    current_medications: initialData.current_medications || [],
    medications_detail: initialData.medications_detail || '',
    supplements: initialData.supplements || '',
    supplements_detail: initialData.supplements_detail || '',
    allergies: initialData.allergies || '',
    allergies_detail: initialData.allergies_detail || '',
    activity_level: initialData.activity_level || '',
    journey_notes: initialData.journey_notes || '',
  });

  const [currentSection, setCurrentSection] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showMidAssessmentEncouragement, setShowMidAssessmentEncouragement] = useState(false);
  const hasInitialized = useRef(false);

  // Section labels mapping
  const sectionLabels: Record<number, string> = {
    1: 'Basic Information',
    2: 'Mental Health',
    3: 'Eating & Substance Use',
    4: 'Medical Conditions',
    5: 'Medications & Allergies',
    6: 'Lifestyle'
  };

  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;
  }, []);

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user updates field
    if (errors[field]) {
      const newErrors = { ...errors };
      delete newErrors[field];
      setErrors(newErrors);
    }
  };

  // Check for critical exclusions that should immediately stop the flow
  const checkCriticalExclusions = () => {
    // Mental health crisis
    if (formData.mental_health_diagnosis?.includes('thoughts_harm')) {
      return {
        type: 'mental_health_crisis',
        title: "We're worried about you",
        message: "Thank you for being honest with us. Your safety matters more than anything else.",
        resources: [
          { icon_name: 'phone', label: '988 Crisis Lifeline (24/7)', value: 'Call or text 988' },
          { icon_name: 'message', label: 'Crisis Text Line', value: 'Text HELLO to 741741' }
        ]
      };
    }

    // Eating disorder exclusions (anorexia or bulimia)
    if (formData.eating_disorder_type?.includes('anorexia') || 
        formData.eating_disorder_type?.includes('bulimia')) {
      return {
        type: 'eating_disorder_exclusion',
        title: "We can't safely prescribe GLP-1 medications",
        message: "We can't safely prescribe GLP-1 medications with anorexia or bulimia history, as they can cause serious harm.\n\nYour recovery is what matters most. An eating disorder specialist can guide you to approaches that support your health.",
        resources: [
          { icon_name: 'phone', label: 'NEDA Helpline', value: '1-800-931-2237' },
          { icon_name: 'message', label: 'NEDA Crisis Text', value: 'Text NEDA to 741741' }
        ]
      };
    }

    // Thyroid cancer or MEN2
    if (formData.medical_conditions?.includes('thyroid_cancer') ||
        formData.medical_conditions?.includes('men2')) {
      return {
        type: 'thyroid_exclusion',
        title: "This is a safety contraindication",
        message: "With this history, GLP-1s carry significant cancer risk according to FDA data.\n\nWe can't safely prescribe these medications. Use the button below to return to Zappy Health and explore alternative care options with your endocrinologist."
      };
    }

    // Pregnancy, trying to conceive, or nursing
    if (formData.pregnancy && formData.pregnancy !== 'no') {
      const titles = {
        pregnant: "We'd love to help you after pregnancy",
        trying: "Pause while you're trying to conceive",
        nursing: "Pause while you're breastfeeding"
      };
      
      const messages = {
        pregnant: "GLP-1s aren't safe during pregnancy, when trying to conceive, or while breastfeeding.\n\nWhen you are no longer pregnant, we'd be happy to work with you. In the meantime, your OB-GYN can help you explore safe options.",
        trying: "GLP-1s aren't safe when you're actively trying to get pregnant.\n\nOnce you're no longer trying to conceive or have delivered, we'd be happy to work with you. Your OB-GYN can help you plan the right timing.",
        nursing: "GLP-1s aren't recommended while breastfeeding.\n\nWhen you are no longer breastfeeding, we'd be happy to work with you. Your care team can help you plan the right timing."
      };
      
      return {
        type: 'pregnancy_exclusion',
        title: titles[formData.pregnancy as keyof typeof titles],
        message: messages[formData.pregnancy as keyof typeof messages]
      };
    }

    // Type 1 diabetes
    if (formData.diabetes_type === 'type1') {
      return {
        type: 'type1_denial',
        title: "Type 1 needs specialized care",
        message: "GLP-1s aren't FDA-approved for Type 1 and need very careful coordination with your endocrinologist.\n\nYour diabetes provider can help you explore whether GLP-1s might work for you and what monitoring you'd need."
      };
    }

    // Insulin use
    if (formData.current_medications?.includes('insulin')) {
      return {
        type: 'insulin_exclusion',
        title: "Coordinate with your diabetes team",
        message: "Combining insulin with GLP-1s needs careful coordination to prevent dangerous blood sugar drops.\n\nBecause you're currently using insulin, we aren't able to offer GLP-1 weight loss treatment right now. Please continue partnering with your diabetes team for your care.\n\nDon't change your medications."
      };
    }

    // GLP-1 allergy
    if (formData.glp1_safety?.includes('glp1_allergy')) {
      return {
        type: 'glp1_allergy_exclusion',
        title: "Your previous reaction makes this too risky",
        message: "A severe allergic reaction to a GLP-1 means another one could cause a more serious—potentially life-threatening—reaction.\n\nYour doctor or allergist can help you explore safe alternatives."
      };
    }

    return null;
  };

  // Check for conditions that need provider review but don't exclude
  const getProgressiveWarnings = () => {
    const warnings = [];

    // Binge eating or other eating disorders (not anorexia/bulimia)
    if (formData.eating_disorder_type?.includes('binge_eating') ||
        formData.eating_disorder_type?.includes('other')) {
      warnings.push({
        type: 'warning',
        title: "We'll need to review this carefully",
        message: "Eating disorder history comes with risks: electrolyte imbalances, worsening behaviors, cardiac complications.\n\nOur provider will review your case and may require clearance from an eating disorder specialist."
      });
    }

    // Pancreatitis
    if (formData.medical_conditions?.includes('pancreatitis')) {
      warnings.push({
        type: 'warning',
        title: "Pancreatitis history needs careful review",
        message: "GLP-1s can increase recurrence risk. Our provider will need details about your history and may need gastroenterologist clearance.\n\nDepending on severity and timing, GLP-1s may not be appropriate."
      });
    }

    // Active gallbladder disease
    if (formData.medical_conditions?.includes('gallbladder_active')) {
      warnings.push({
        type: 'info',
        title: "Active gallbladder disease needs resolution first",
        message: "GLP-1s can worsen gallbladder problems. You may need to resolve this before starting treatment.\n\nOur provider will review your situation."
      });
    }

    // Currently on another GLP-1
    if (formData.glp1_safety?.includes('other_glp1_current')) {
      warnings.push({
        type: 'info',
        title: "We'll need to coordinate this carefully",
        message: "Since you're already on a GLP-1, we'll coordinate with your current provider if we prescribe a different one.\n\nWe'll get more details about your current medication later."
      });
    }

    // High-risk GLP-1 safety conditions
    if (formData.glp1_safety?.some(item => 
      ['diabetic_retinopathy', 'severe_gastroparesis', 'bariatric_surgery', 'kidney_stage4_5'].includes(item)
    )) {
      warnings.push({
        type: 'warning',
        title: "We'll review this carefully",
        message: "These conditions need extra attention with GLP-1s. Our provider will review your case thoroughly and may request additional records or specialist input to ensure your safety."
      });
    }

    return warnings;
  };

  const validateCurrentSection = () => {
    const newErrors: Record<string, string> = {};

    switch (currentSection) {
      case 1: // Basic Info
        // Ethnicity is optional, no validation required
        break;
      
      case 2: // Mental Health
        if (!formData.mental_health_diagnosis || formData.mental_health_diagnosis.length === 0) {
          newErrors.mental_health_diagnosis = 'Please select at least one option';
        }
        if (formData.mental_health_diagnosis?.includes('other') && !formData.mental_health_other) {
          newErrors.mental_health_other = 'Please specify the condition';
        }
        break;
      
      case 3: // Eating & Substance
        if (!formData.eating_relationship) {
          newErrors.eating_relationship = 'Please answer this question';
        }
        if (formData.eating_relationship === 'yes' && (!formData.eating_disorder_type || formData.eating_disorder_type.length === 0)) {
          newErrors.eating_disorder_type = 'Please select the type';
        }
        if (!formData.alcohol_use) newErrors.alcohol_use = 'Please select an option';
        if (!formData.tobacco_use) newErrors.tobacco_use = 'Please select an option';
        if (!formData.recreational_substances || formData.recreational_substances.length === 0) {
          newErrors.recreational_substances = 'Please select at least one option';
        }
        break;
      
      case 4: // Medical Conditions
        if (!formData.diabetes) newErrors.diabetes = 'Please answer this question';
        if (formData.diabetes === 'yes' && !formData.diabetes_type) {
          newErrors.diabetes_type = 'Please select the type';
        }
        if (formData.sex_birth === 'female' && !formData.pregnancy) {
          newErrors.pregnancy = 'Please answer this question';
        }
        if (!formData.medical_conditions || formData.medical_conditions.length === 0) {
          newErrors.medical_conditions = 'Please select at least one option';
        }
        if (formData.medical_conditions?.includes('other') && !formData.medical_conditions_other) {
          newErrors.medical_conditions_other = 'Please specify the condition';
        }
        if (!formData.glp1_safety || formData.glp1_safety.length === 0) {
          newErrors.glp1_safety = 'Please select at least one option';
        }
        break;
      
      case 5: // Current Medications & Allergies/Supplements (Combined)
        if (!formData.current_medications || formData.current_medications.length === 0) {
          newErrors.current_medications = 'Please select at least one option';
        }
        if (formData.current_medications?.includes('other') && !formData.medications_detail) {
          newErrors.medications_detail = 'Please list your medications';
        }
        if (!formData.supplements) newErrors.supplements = 'Please answer this question';
        if (formData.supplements === 'yes' && !formData.supplements_detail) {
          newErrors.supplements_detail = 'Please list your supplements';
        }
        if (!formData.allergies) newErrors.allergies = 'Please answer this question';
        if (formData.allergies === 'yes' && !formData.allergies_detail) {
          newErrors.allergies_detail = 'Please list your allergies';
        }
        break;
      
      case 6: // Lifestyle (formerly section 7)
        if (!formData.activity_level) newErrors.activity_level = 'Please select your activity level';
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = () => {
    // Validate current section
    if (!validateCurrentSection()) {
      // Scroll to first error
      const firstErrorElement = document.querySelector('[data-error="true"]');
      if (firstErrorElement) {
        firstErrorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    // Check for critical exclusions after completing relevant sections
    if (currentSection >= 2) {
      const exclusion = checkCriticalExclusions();
      if (exclusion) {
        onNext({ ...formData, exclusion });
        return;
      }
    }

    // Move to next section or complete
    if (currentSection < 6) {
      // Show mid-assessment encouragement after section 3 (Eating & Substance)
      if (currentSection === 3) {
        setShowMidAssessmentEncouragement(true);
      } else {
        setCurrentSection(currentSection + 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else {
      // Final submission with warnings
      const warnings = getProgressiveWarnings();
      onNext({ ...formData, warnings });
    }
  };

  const handlePrevious = () => {
    if (currentSection > 1) {
      setCurrentSection(currentSection - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      onBack();
    }
  };

  const getSectionTitle = () => {
    const titles = [
      'Basic Information',
      'Mental Health',
      'Eating & Substance Use',
      'Medical Conditions',
      'Medications & Allergies',
      'Lifestyle & Notes'
    ];
    return titles[currentSection - 1];
  };

  // Mid-assessment encouragement screen
  if (showMidAssessmentEncouragement) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FDFBF7] via-white to-[#F8FCF9] flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="text-center"
          >
            {/* Icon */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5, type: 'spring', stiffness: 200 }}
              className="mb-6"
            >
              <div className="inline-flex items-center justify-center w-20 h-20 bg-[#00A896] rounded-full shadow-lg shadow-[#00A896]/30">
                <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </motion.div>

            {/* Title */}
            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-3xl sm:text-4xl mb-4 text-neutral-900"
            >
              You're making great progress!
            </motion.h2>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-lg sm:text-xl text-neutral-600 mb-8 max-w-xl mx-auto"
            >
              Just a few more questions to ensure we can support you safely. You're halfway there!
            </motion.p>

            {/* Continue Button */}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              onClick={() => {
                setShowMidAssessmentEncouragement(false);
                setCurrentSection(4);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="group relative inline-flex items-center gap-3 px-8 py-4 bg-[#FF6B6B] hover:bg-[#FF5252] text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 text-lg"
            >
              <span>Continue</span>
              <svg
                className="w-5 h-5 transition-transform group-hover:translate-x-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </motion.button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fef8f2] flex justify-center p-4 sm:p-6 pt-5 sm:pt-7">
      <div className="w-full max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Progress Bar */}
          {currentStep !== undefined && totalSteps !== undefined && (
            <ScreenHeader
              onBack={currentSection > 1 ? () => setCurrentSection(currentSection - 1) : onBack}
              sectionLabel={sectionLabels[currentSection]}
              currentStep={currentSection}
              totalSteps={6}
              progressPercentage={(currentStep / totalSteps) * 100}
            />
          )}

          <div className="space-y-6">

            {/* Dynamic Section Content */}
            <AnimatePresence mode="wait">
          <motion.div
            key={currentSection}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {currentSection === 1 && (
              <Section1BasicInfo 
                formData={formData} 
                updateFormData={updateFormData}
                errors={errors}
                onAutoAdvance={handleContinue}
              />
            )}
            {currentSection === 2 && (
              <Section2MentalHealth 
                formData={formData} 
                updateFormData={updateFormData}
                errors={errors}
              />
            )}
            {currentSection === 3 && (
              <Section3EatingSubstance 
                formData={formData} 
                updateFormData={updateFormData}
                errors={errors}
              />
            )}
            {currentSection === 4 && (
              <Section4MedicalConditions 
                formData={formData} 
                updateFormData={updateFormData}
                errors={errors}
                sexBirth={formData.sex_birth}
              />
            )}
            {currentSection === 5 && (
              <Section5CurrentMedications 
                formData={formData} 
                updateFormData={updateFormData}
                errors={errors}
              />
            )}
            {currentSection === 6 && (
              <Section7Lifestyle 
                formData={formData} 
                updateFormData={updateFormData}
                errors={errors}
              />
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="mt-8 pt-6 border-t border-neutral-100">
          <NavigationButtons
            onNext={handleContinue}
            nextLabel={currentSection === 6 ? "Complete Assessment" : "Continue"}
            layout="grouped"
          />
        </div>
      </div>
        </motion.div>
      </div>
    </div>
  );
}

// Section 1: Basic Information
function Section1BasicInfo({ formData, updateFormData, errors, onAutoAdvance }: any) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl sm:text-3xl md:text-4xl text-neutral-900 mb-3">
          How would you describe your ethnicity?
        </h3>
        <p className="text-neutral-600 mb-4">
          Optional—helps us understand medication effects across different backgrounds
        </p>
        <SingleSelectButtonGroup
          options={[
            { value: 'asian', label: 'Asian' },
            { value: 'black', label: 'Black or African American' },
            { value: 'hispanic', label: 'Hispanic or Latino' },
            { value: 'indigenous', label: 'Indigenous or Native American' },
            { value: 'middle_eastern', label: 'Middle Eastern' },
            { value: 'pacific_islander', label: 'Pacific Islander' },
            { value: 'white', label: 'White' },
            { value: 'multiple', label: 'Multiple ethnicities' },
            { value: 'other', label: 'Other' },
            { value: 'skip', label: 'Prefer not to say' }
          ]}
          selectedValue={formData.ethnicity || ''}
          onSelect={(value) => {
            updateFormData('ethnicity', value);
            // Auto advance after selection
            if (onAutoAdvance) {
              setTimeout(() => {
                onAutoAdvance();
              }, 300);
            }
          }}
        />
      </div>
    </div>
  );
}

// Section 2: Mental Health
function Section2MentalHealth({ formData, updateFormData, errors }: any) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl sm:text-3xl md:text-4xl text-neutral-900 mb-3">
          Do any of these apply to you?
        </h3>
        <p className="text-sm text-neutral-600 mb-4">
          We ask everyone this to provide the best care
        </p>
        
        <div data-error={errors.mental_health_diagnosis ? 'true' : undefined}>
          <CheckboxGroup
            id="mental_health_diagnosis"
            label=""
            options={[
              { value: 'none', label: 'None of these' },
              { value: 'depression', label: 'Depression' },
              { value: 'anxiety', label: 'Anxiety disorder' },
              { value: 'bipolar', label: 'Bipolar disorder' },
              { value: 'panic', label: 'Panic disorder' },
              { value: 'ptsd', label: 'PTSD' },
              { value: 'ocd', label: 'OCD' },
              { value: 'thoughts_harm', label: 'Thoughts of harming yourself or others' },
              { value: 'other', label: 'Other' }
            ]}
            selectedValues={formData.mental_health_diagnosis || []}
            onChange={(values) => updateFormData('mental_health_diagnosis', values)}
            exclusiveValue="none"
          />
          {errors.mental_health_diagnosis && (
            <p className="text-sm text-red-600 mt-2">{errors.mental_health_diagnosis}</p>
          )}
        </div>
      </div>

      {formData.mental_health_diagnosis?.includes('other') && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
        >
          <Input
            label="Please specify"
            placeholder="Other mental health condition"
            value={formData.mental_health_other || ''}
            onChange={(e) => updateFormData('mental_health_other', e.target.value)}
            error={errors.mental_health_other}
          />
        </motion.div>
      )}

      {formData.mental_health_diagnosis?.includes('thoughts_harm') && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-xl bg-red-50 border border-red-200 flex items-start gap-3"
        >
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-red-900">Your safety is our priority</p>
            <p className="text-sm text-red-700 mt-1">
              We'll need to address this before proceeding with GLP-1 medications.
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
}

// Section 3: Eating & Substance Use
function Section3EatingSubstance({ formData, updateFormData, errors }: any) {
  const [visibleQuestions, setVisibleQuestions] = useState(1);
  const alcoholQuestionRef = useRef<HTMLDivElement>(null);
  const tobaccoQuestionRef = useRef<HTMLDivElement>(null);
  const substancesQuestionRef = useRef<HTMLDivElement>(null);
  
  const handleSingleSelectAnswer = (field: string, value: any) => {
    updateFormData(field, value);
    
    // Auto-advance to next question after a short delay
    setTimeout(() => {
      setVisibleQuestions(prev => prev + 1);
      // Scroll the next question into view
      setTimeout(() => {
        let refToScroll = null;
        
        if (field === 'eating_relationship' && alcoholQuestionRef.current) {
          refToScroll = alcoholQuestionRef.current;
        } else if (field === 'alcohol_use' && tobaccoQuestionRef.current) {
          refToScroll = tobaccoQuestionRef.current;
        } else if (field === 'tobacco_use' && substancesQuestionRef.current) {
          refToScroll = substancesQuestionRef.current;
        }
        
        if (refToScroll) {
          refToScroll.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start',
            inline: 'nearest'
          });
        }
      }, 100);
    }, 400);
  };

  // Determine which questions should be visible
  const shouldShowEatingType = formData.eating_relationship === 'yes';
  const shouldShowAlcohol = visibleQuestions >= (shouldShowEatingType ? 2 : 1) && formData.eating_relationship;
  const shouldShowTobacco = visibleQuestions >= (shouldShowEatingType ? 3 : 2) && formData.alcohol_use;
  const shouldShowSubstances = visibleQuestions >= (shouldShowEatingType ? 4 : 3) && formData.tobacco_use;

  return (
    <div className="space-y-6">
      {/* Title and Eating Disorder Question */}
      <div>
        <div data-error={errors.eating_relationship ? 'true' : undefined}>
          <label className="block text-2xl sm:text-3xl md:text-4xl text-neutral-900 mb-3">
            Have you ever been diagnosed with an eating disorder?
          </label>
          <p className="text-neutral-600 mb-4">
            We need to ask a couple of questions about eating and substance use
          </p>
          <SingleSelectButtonGroup
            options={[
              { value: 'no', label: 'No' },
              { value: 'yes', label: 'Yes' }
            ]}
            selectedValue={formData.eating_relationship || ''}
            onSelect={(value) => handleSingleSelectAnswer('eating_relationship', value)}
          />
          {errors.eating_relationship && (
            <p className="text-sm text-red-600 mt-2">{errors.eating_relationship}</p>
          )}
        </div>
      </div>

      {/* Eating Disorder Type (if yes) */}
      {shouldShowEatingType && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div data-error={errors.eating_disorder_type ? 'true' : undefined}>
            <CheckboxGroup
              id="eating_disorder_type"
              label="Which type?"
              options={[
                { value: 'anorexia', label: 'Anorexia nervosa' },
                { value: 'bulimia', label: 'Bulimia nervosa' },
                { value: 'binge_eating', label: 'Binge eating disorder' },
                { value: 'other', label: 'Other or unspecified' }
              ]}
              selectedValues={formData.eating_disorder_type || []}
              onChange={(values) => updateFormData('eating_disorder_type', values)}
            />
            {errors.eating_disorder_type && (
              <p className="text-sm text-red-600 mt-2">{errors.eating_disorder_type}</p>
            )}
          </div>

          {(formData.eating_disorder_type?.includes('anorexia') || 
            formData.eating_disorder_type?.includes('bulimia')) && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-xl bg-red-50 border border-red-200 flex items-start gap-3"
            >
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-red-900">Safety Concern</p>
                <p className="text-sm text-red-700 mt-1">
                  We can't safely prescribe GLP-1 medications with this history.
                </p>
              </div>
            </motion.div>
          )}
        </motion.div>
      )}

      {/* Alcohol Question */}
      {shouldShowAlcohol && (
        <motion.div
          ref={alcoholQuestionRef}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div data-error={errors.alcohol_use ? 'true' : undefined}>
            <h3 className="text-2xl sm:text-3xl md:text-4xl text-neutral-900 mb-3">
              How often do you drink alcohol?
            </h3>
            <p className="text-neutral-600 mb-3">
              Alcohol can interact with medication, so this helps us keep you safe
            </p>
            <SingleSelectButtonGroup
              options={[
                { value: 'none', label: "I don't drink" },
                { value: 'occasional', label: 'Occasionally (1-2 drinks/week)' },
                { value: 'social', label: 'Socially (3-6 drinks/week)' },
                { value: 'moderate', label: 'Moderate (7-10 drinks/week)' },
                { value: 'heavy', label: 'Heavy (10+ drinks/week)' }
              ]}
              selectedValue={formData.alcohol_use || ''}
              onSelect={(value) => handleSingleSelectAnswer('alcohol_use', value)}
            />
            {errors.alcohol_use && (
              <p className="text-sm text-red-600 mt-2">{errors.alcohol_use}</p>
            )}
          </div>
        </motion.div>
      )}

      {/* Tobacco Question */}
      {shouldShowTobacco && (
        <motion.div
          ref={tobaccoQuestionRef}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div data-error={errors.tobacco_use ? 'true' : undefined}>
            <h3 className="text-2xl sm:text-3xl md:text-4xl text-neutral-900 mb-3">
              Do you use tobacco or nicotine?
            </h3>
            <SingleSelectButtonGroup
              options={[
                { value: 'no', label: 'No' },
                { value: 'cigarettes', label: 'Cigarettes' },
                { value: 'vaping', label: 'Vaping or e-cigarettes' },
                { value: 'other', label: 'Other tobacco products' }
              ]}
              selectedValue={formData.tobacco_use || ''}
              onSelect={(value) => handleSingleSelectAnswer('tobacco_use', value)}
            />
            {errors.tobacco_use && (
              <p className="text-sm text-red-600 mt-2">{errors.tobacco_use}</p>
            )}
          </div>
        </motion.div>
      )}

      {/* Recreational Substances Question */}
      {shouldShowSubstances && (
        <motion.div
          ref={substancesQuestionRef}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div data-error={errors.recreational_substances ? 'true' : undefined}>
            <h3 className="text-2xl sm:text-3xl md:text-4xl text-neutral-900 mb-3">
              Used any of these in the past 6 months?
            </h3>
            <CheckboxGroup
              id="recreational_substances"
              label=""
              options={[
                { value: 'none', label: 'None of these' },
                { value: 'cannabis', label: 'Cannabis or marijuana' },
                { value: 'cocaine', label: 'Cocaine' },
                { value: 'opioids', label: 'Non-prescribed opioids' },
                { value: 'stimulants', label: 'Non-prescribed stimulants (Adderall, etc.)' },
                { value: 'methamphetamine', label: 'Methamphetamine' }
              ]}
              selectedValues={formData.recreational_substances || []}
              onChange={(values) => updateFormData('recreational_substances', values)}
              exclusiveValue="none"
            />
            {errors.recreational_substances && (
              <p className="text-sm text-red-600 mt-2">{errors.recreational_substances}</p>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}

// Section 4: Medical Conditions
function Section4MedicalConditions({ formData, updateFormData, errors, sexBirth }: any) {
  const [visibleQuestions, setVisibleQuestions] = useState(1);
  const pregnancyQuestionRef = useRef<HTMLDivElement>(null);
  const medicalHistoryQuestionRef = useRef<HTMLDivElement>(null);
  const glp1SafetyQuestionRef = useRef<HTMLDivElement>(null);
  
  const handleSingleSelectAnswer = (field: string, value: any) => {
    updateFormData(field, value);
    
    // Auto-advance to next question after a short delay
    setTimeout(() => {
      setVisibleQuestions(prev => prev + 1);
      
      // Scroll to the next question smoothly
      setTimeout(() => {
        let refToScroll: HTMLDivElement | null = null;
        
        if (field === 'diabetes' && pregnancyQuestionRef.current && sexBirth === 'female') {
          refToScroll = pregnancyQuestionRef.current;
        } else if ((field === 'diabetes' && sexBirth !== 'female') || field === 'pregnancy') {
          refToScroll = medicalHistoryQuestionRef.current;
        }
        
        if (refToScroll) {
          refToScroll.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start',
            inline: 'nearest'
          });
        }
      }, 100);
    }, 400);
  };

  // Determine which questions should be visible
  const shouldShowDiabetesType = formData.diabetes === 'yes';
  const shouldShowPregnancy = visibleQuestions >= (shouldShowDiabetesType ? 2 : 1) && formData.diabetes && sexBirth === 'female';
  const shouldShowMedicalHistory = visibleQuestions >= (shouldShowDiabetesType ? (sexBirth === 'female' ? 3 : 2) : (sexBirth === 'female' ? 2 : 1)) && 
                                    formData.diabetes && 
                                    (!sexBirth || sexBirth !== 'female' || formData.pregnancy);
  const shouldShowGlp1Safety = visibleQuestions >= (shouldShowDiabetesType ? (sexBirth === 'female' ? 4 : 3) : (sexBirth === 'female' ? 3 : 2)) && 
                                formData.medical_conditions && 
                                formData.medical_conditions.length > 0;

  return (
    <div className="space-y-6">
      {/* Diabetes Question */}
      <div>
        <div data-error={errors.diabetes ? 'true' : undefined}>
          <h3 className="text-2xl sm:text-3xl md:text-4xl text-neutral-900 mb-3">
            Do you have diabetes?
          </h3>
          <SingleSelectButtonGroup
            options={[
              { value: 'no', label: 'No' },
              { value: 'yes', label: 'Yes' }
            ]}
            selectedValue={formData.diabetes || ''}
            onSelect={(value) => handleSingleSelectAnswer('diabetes', value)}
          />
          {errors.diabetes && (
            <p className="text-sm text-red-600 mt-2">{errors.diabetes}</p>
          )}
        </div>
      </div>

      {/* Diabetes Type (if yes) */}
      {shouldShowDiabetesType && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div data-error={errors.diabetes_type ? 'true' : undefined}>
            <h3 className="text-2xl sm:text-3xl md:text-4xl text-neutral-900 mb-3">
              What type?
            </h3>
            <SingleSelectButtonGroup
              options={[
                { value: 'type1', label: 'Type 1' },
                { value: 'type2', label: 'Type 2' },
                { value: 'prediabetes', label: 'Prediabetes' },
                { value: 'not_sure', label: 'Not sure' }
              ]}
              selectedValue={formData.diabetes_type || ''}
              onSelect={(value) => handleSingleSelectAnswer('diabetes_type', value)}
            />
            {errors.diabetes_type && (
              <p className="text-sm text-red-600 mt-2">{errors.diabetes_type}</p>
            )}
          </div>

          {formData.diabetes_type === 'type1' && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-4 rounded-xl bg-red-50 border border-red-200 flex items-start gap-3"
            >
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-red-900">Type 1 Needs Specialist Care</p>
                <p className="text-sm text-red-700 mt-1">
                  GLP-1s aren't FDA-approved for Type 1 and need careful coordination.
                </p>
              </div>
            </motion.div>
          )}
        </motion.div>
      )}

      {/* Pregnancy Question (for females) */}
      {shouldShowPregnancy && (
        <motion.div
          ref={pregnancyQuestionRef}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div data-error={errors.pregnancy ? 'true' : undefined}>
            <h3 className="text-2xl sm:text-3xl md:text-4xl text-neutral-900 mb-3">
              Are you pregnant, trying to conceive, or nursing?
            </h3>
            <SingleSelectButtonGroup
              options={[
                { value: 'no', label: 'No' },
                { value: 'pregnant', label: 'Currently pregnant' },
                { value: 'trying', label: 'Trying to conceive or planning to soon' },
                { value: 'nursing', label: 'Currently breastfeeding' }
              ]}
              selectedValue={formData.pregnancy || ''}
              onSelect={(value) => handleSingleSelectAnswer('pregnancy', value)}
            />
            {errors.pregnancy && (
              <p className="text-sm text-red-600 mt-2">{errors.pregnancy}</p>
            )}
          </div>

          {formData.pregnancy && formData.pregnancy !== 'no' && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-4 rounded-xl bg-red-50 border border-red-200 flex items-start gap-3"
            >
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-red-900">GLP-1s Not Safe During Pregnancy</p>
                <p className="text-sm text-red-700 mt-1">
                  We can't prescribe GLP-1 medications during pregnancy, when trying to conceive, or while breastfeeding.
                </p>
              </div>
            </motion.div>
          )}
        </motion.div>
      )}

      {/* Medical History Question */}
      {shouldShowMedicalHistory && (
        <motion.div
          ref={medicalHistoryQuestionRef}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div data-error={errors.medical_conditions ? 'true' : undefined}>
            <div className="mb-4">
              <h3 className="text-2xl sm:text-3xl md:text-4xl text-neutral-900 mb-2">Do any of these apply to you?</h3>
              <p className="text-neutral-600 mb-3">We need to ask about your medical history</p>
            </div>
          
          <CheckboxGroup
            id="medical_conditions"
            label=""
            options={[
              { value: 'none', label: 'None of these' },
              { value: 'thyroid_cancer', label: 'Medullary thyroid cancer (personal or family)' },
              { value: 'men2', label: 'MEN2 syndrome' },
              { value: 'pancreatitis', label: 'Pancreatitis (ever)' },
              { value: 'gallbladder_active', label: 'Current gallbladder disease or gallstones' },
              { value: 'gastroparesis', label: 'Gastroparesis (slow stomach emptying)' },
              { value: 'kidney_disease', label: 'Kidney disease' },
              { value: 'liver_disease', label: 'Liver disease' },
              { value: 'heart_disease', label: 'Heart disease or heart attack' },
              { value: 'stroke', label: 'Stroke or TIA' },
              { value: 'hypertension', label: 'High blood pressure' },
              { value: 'high_cholesterol', label: 'High cholesterol' },
              { value: 'sleep_apnea', label: 'Sleep apnea' },
              { value: 'pcos', label: 'PCOS' },
              { value: 'thyroid_other', label: 'Thyroid condition (not cancer)' },
              { value: 'gerd', label: 'GERD or chronic reflux' },
              { value: 'ibs', label: 'IBS or chronic digestive issues' },
              { value: 'autoimmune', label: 'Autoimmune condition' },
              { value: 'cancer_other', label: 'Other cancer history' },
              { value: 'other', label: 'Other condition' }
            ]}
            selectedValues={formData.medical_conditions || []}
            onChange={(values) => {
              updateFormData('medical_conditions', values);
              // Auto-advance if "none" is selected
              if (values.length === 1 && values[0] === 'none') {
                setTimeout(() => {
                  setVisibleQuestions(prev => prev + 1);
                  // Scroll to next question
                  setTimeout(() => {
                    if (glp1SafetyQuestionRef.current) {
                      glp1SafetyQuestionRef.current.scrollIntoView({ 
                        behavior: 'smooth', 
                        block: 'start',
                        inline: 'nearest'
                      });
                    }
                  }, 100);
                }, 400);
              }
            }}
            exclusiveValue="none"
          />
          {errors.medical_conditions && (
            <p className="text-sm text-red-600 mt-2">{errors.medical_conditions}</p>
          )}
          </div>

          {formData.medical_conditions?.includes('other') && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <Input
                label="Please specify other condition"
                placeholder="Describe your condition"
                value={formData.medical_conditions_other || ''}
                onChange={(e) => updateFormData('medical_conditions_other', e.target.value)}
                error={errors.medical_conditions_other}
              />
            </motion.div>
          )}

          {(formData.medical_conditions?.includes('thyroid_cancer') || 
            formData.medical_conditions?.includes('men2')) && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-xl bg-red-50 border border-red-200 flex items-start gap-3"
            >
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-red-900">Safety Contraindication</p>
                <p className="text-sm text-red-700 mt-1">
                  With this history, GLP-1s carry significant cancer risk according to FDA data.
                </p>
              </div>
            </motion.div>
          )}

          {formData.medical_conditions?.includes('pancreatitis') && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-3"
            >
              <Info className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-amber-900">Provider Review Required</p>
                <p className="text-sm text-amber-700 mt-1">
                  Pancreatitis history needs careful review. Our provider will assess your case.
                </p>
              </div>
            </motion.div>
          )}

          {formData.medical_conditions?.includes('gallbladder_active') && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-xl bg-blue-50 border border-blue-200 flex items-start gap-3"
            >
              <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-blue-900">Active Gallbladder Issue</p>
                <p className="text-sm text-blue-700 mt-1">
                  You may need to resolve this before starting treatment. Our provider will review.
                </p>
              </div>
            </motion.div>
          )}
        </motion.div>
      )}

      {/* GLP-1 Safety Question */}
      {shouldShowGlp1Safety && (
        <motion.div
          ref={glp1SafetyQuestionRef}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div data-error={errors.glp1_safety ? 'true' : undefined}>
            <div className="mb-4">
              <h3 className="text-2xl sm:text-3xl md:text-4xl text-neutral-900 mb-2">Have you been diagnosed with any of these?</h3>
              <p className="text-neutral-600 mb-3">Important safety questions about GLP-1 medications</p>
            </div>
            
            <CheckboxGroup
              id="glp1_safety"
              label=""
              options={[
                { value: 'none', label: 'None of these' },
                { value: 'diabetic_retinopathy', label: 'Diabetic retinopathy (eye damage from diabetes)' },
                { value: 'glp1_allergy', label: 'Severe allergic reaction to GLP-1 medications' },
                { value: 'severe_gastroparesis', label: 'Severe gastroparesis' },
                { value: 'bariatric_surgery', label: 'Bariatric surgery in the past 18 months' },
                { value: 'kidney_stage4_5', label: 'Advanced kidney disease (Stage 4-5)' },
                { value: 'suicide_attempt_history', label: 'History of suicide attempts' },
                { value: 'other_glp1_current', label: 'Currently on another GLP-1 (Victoza, Byetta, Trulicity, etc.)' },
                { value: 'thyroid_nodules', label: 'Thyroid nodules' }
              ]}
              selectedValues={formData.glp1_safety || []}
              onChange={(values) => {
                updateFormData('glp1_safety', values);
                // Auto-advance when "none" is selected
                if (values.length === 1 && values[0] === 'none') {
                  setTimeout(() => {
                    // This will trigger the next section validation and advancement
                    const continueButton = document.querySelector('[data-continue-button]') as HTMLButtonElement;
                    if (continueButton) {
                      continueButton.click();
                    }
                  }, 600);
                }
              }}
              exclusiveValue="none"
            />
            {errors.glp1_safety && (
              <p className="text-sm text-red-600 mt-2">{errors.glp1_safety}</p>
            )}
          </div>
        </motion.div>
      )}

      {formData.glp1_safety?.includes('glp1_allergy') && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-xl bg-red-50 border border-red-200 flex items-start gap-3"
        >
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-red-900">Previous Allergic Reaction</p>
            <p className="text-sm text-red-700 mt-1">
              A severe allergic reaction to a GLP-1 makes another one too risky.
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
}

// Section 5: Current Medications & Allergies (Combined with Progressive Disclosure)
function Section5CurrentMedications({ formData, updateFormData, errors }: any) {
  const [visibleQuestions, setVisibleQuestions] = useState(1);
  const supplementsQuestionRef = useRef<HTMLDivElement>(null);
  const allergiesQuestionRef = useRef<HTMLDivElement>(null);
  
  const handleSingleSelectAnswer = (field: string, value: any) => {
    updateFormData(field, value);
    
    // Auto-advance to next question after a short delay
    setTimeout(() => {
      setVisibleQuestions(prev => prev + 1);
      
      // Scroll to the next question smoothly
      setTimeout(() => {
        let refToScroll: HTMLDivElement | null = null;
        
        if (field === 'supplements' && allergiesQuestionRef.current) {
          refToScroll = allergiesQuestionRef.current;
        }
        
        if (refToScroll) {
          refToScroll.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start',
            inline: 'nearest'
          });
        }
      }, 100);
    }, 400);
  };

  // Determine which questions should be visible
  const shouldShowSupplements = visibleQuestions >= 1 && formData.current_medications && formData.current_medications.length > 0;
  const shouldShowAllergies = visibleQuestions >= 2 && formData.supplements;

  return (
    <div className="space-y-6">
      {/* Medications Question */}
      <div>
        <div data-error={errors.current_medications ? 'true' : undefined}>
          <div className="mb-4">
            <h3 className="text-2xl sm:text-3xl md:text-4xl text-neutral-900 mb-2">Do you take any medication?</h3>
            <p className="text-neutral-600 mb-3">We need to know about all your current medications</p>
          </div>
          <CheckboxGroup
            id="current_medications"
            label=""
            options={[
              { value: 'none', label: "I don't take any medication" },
              { value: 'insulin', label: 'Insulin' },
              { value: 'metformin', label: 'Metformin or other diabetes meds' },
              { value: 'blood_pressure', label: 'Blood pressure meds' },
              { value: 'blood_thinners', label: 'Blood thinners (warfarin, Eliquis, etc.)' },
              { value: 'cholesterol', label: 'Cholesterol meds (statins)' },
              { value: 'thyroid', label: 'Thyroid medication (levothyroxine, etc.)' },
              { value: 'antidepressants', label: 'Antidepressants or anti-anxiety meds' },
              { value: 'adhd', label: 'ADHD medications' },
              { value: 'antipsychotics', label: 'Antipsychotic medications' },
              { value: 'seizure', label: 'Seizure or epilepsy meds' },
              { value: 'steroids', label: 'Corticosteroids (prednisone, etc.)' },
              { value: 'immunosuppressants', label: 'Immunosuppressants' },
              { value: 'pain_chronic', label: 'Chronic pain medications' },
              { value: 'other', label: 'Other medications' }
            ]}
            selectedValues={formData.current_medications || []}
            onChange={(values) => {
              updateFormData('current_medications', values);
              // Auto-advance if "none" is selected
              if (values.length === 1 && values[0] === 'none') {
                setTimeout(() => {
                  setVisibleQuestions(prev => prev + 1);
                  // Scroll to next question
                  setTimeout(() => {
                    if (supplementsQuestionRef.current) {
                      supplementsQuestionRef.current.scrollIntoView({ 
                        behavior: 'smooth', 
                        block: 'start',
                        inline: 'nearest'
                      });
                    }
                  }, 100);
                }, 400);
              }
            }}
            exclusiveValue="none"
          />
          {errors.current_medications && (
            <p className="text-sm text-red-600 mt-2">{errors.current_medications}</p>
          )}
        </div>
      </div>

      {formData.current_medications?.includes('insulin') && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-xl bg-red-50 border border-red-200 flex items-start gap-3"
        >
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-red-900">Insulin Use Requires Coordination</p>
            <p className="text-sm text-red-700 mt-1">
              Combining insulin with GLP-1s needs careful coordination to prevent dangerous blood sugar drops.
            </p>
          </div>
        </motion.div>
      )}

      {formData.current_medications?.includes('other') && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
        >
          <div data-error={errors.medications_detail ? 'true' : undefined}>
            <label className="block text-2xl sm:text-3xl md:text-4xl text-neutral-900 mb-2">
              List your other medications
            </label>
            <p className="text-[13px] leading-relaxed text-neutral-600 mb-3 md:text-sm">Include doses if you know them</p>
            <textarea
              value={formData.medications_detail || ''}
              onChange={(e) => updateFormData('medications_detail', e.target.value)}
              placeholder="e.g., Lisinopril 10mg daily, Atorvastatin 20mg"
              rows={4}
              className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0D9488]/40 focus:border-[#0D9488] transition-all duration-200 resize-none"
            />
            {errors.medications_detail && (
              <p className="text-sm text-red-600 mt-2">{errors.medications_detail}</p>
            )}
          </div>
        </motion.div>
      )}

      {/* Supplements Question */}
      {shouldShowSupplements && (
        <motion.div
          ref={supplementsQuestionRef}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div data-error={errors.supplements ? 'true' : undefined}>
            <h3 className="text-2xl sm:text-3xl md:text-4xl text-neutral-900 mb-3">
              Any vitamins or supplements?
            </h3>
            <SingleSelectButtonGroup
              options={[
                { value: 'no', label: 'No' },
                { value: 'yes', label: 'Yes' }
              ]}
              selectedValue={formData.supplements || ''}
              onSelect={(value) => handleSingleSelectAnswer('supplements', value)}
            />
            {errors.supplements && (
              <p className="text-sm text-red-600 mt-2">{errors.supplements}</p>
            )}
          </div>

          {formData.supplements === 'yes' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4"
            >
              <div data-error={errors.supplements_detail ? 'true' : undefined}>
                <label className="block text-neutral-900 mb-2">
                  List your vitamins and supplements
                </label>
                <textarea
                  value={formData.supplements_detail || ''}
                  onChange={(e) => updateFormData('supplements_detail', e.target.value)}
                  placeholder="Vitamin D 2000 IU daily, fish oil, multivitamin"
                  rows={3}
                  className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0D9488]/40 focus:border-[#0D9488] transition-all duration-200 resize-none"
                />
                {errors.supplements_detail && (
                  <p className="text-sm text-red-600 mt-2">{errors.supplements_detail}</p>
                )}
              </div>
            </motion.div>
          )}
        </motion.div>
      )}

      {/* Allergies Question */}
      {shouldShowAllergies && (
        <motion.div
          ref={allergiesQuestionRef}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div data-error={errors.allergies ? 'true' : undefined}>
            <h3 className="text-2xl sm:text-3xl md:text-4xl text-neutral-900 mb-3">
              Any medication allergies?
            </h3>
            <SingleSelectButtonGroup
              options={[
                { value: 'no', label: 'No' },
                { value: 'yes', label: 'Yes' }
              ]}
              selectedValue={formData.allergies || ''}
              onSelect={(value) => updateFormData('allergies', value)}
            />
            {errors.allergies && (
              <p className="text-sm text-red-600 mt-2">{errors.allergies}</p>
            )}
          </div>

          {formData.allergies === 'yes' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4"
            >
              <div data-error={errors.allergies_detail ? 'true' : undefined}>
                <label className="block text-neutral-900 mb-2">
                  List them with reactions
                </label>
                <textarea
                  value={formData.allergies_detail || ''}
                  onChange={(e) => updateFormData('allergies_detail', e.target.value)}
                  placeholder="Penicillin (rash), sulfa drugs (hives)"
                  rows={3}
                  className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0D9488]/40 focus:border-[#0D9488] transition-all duration-200 resize-none"
                />
                {errors.allergies_detail && (
                  <p className="text-sm text-red-600 mt-2">{errors.allergies_detail}</p>
                )}
              </div>
            </motion.div>
          )}
        </motion.div>
      )}
    </div>
  );
}

// Section 6 is now combined with Section 5
function Section6AllergiesSupplements({ formData, updateFormData, errors }: any) {
  // This section is now part of Section 5
  return <Section5CurrentMedications formData={formData} updateFormData={updateFormData} errors={errors} />;
}

// Section 7: Lifestyle & Notes (with Progressive Disclosure)
function Section7Lifestyle({ formData, updateFormData, errors }: any) {
  const [visibleQuestions, setVisibleQuestions] = useState(1);
  const notesQuestionRef = useRef<HTMLDivElement>(null);
  
  const handleActivitySelect = (value: string) => {
    updateFormData('activity_level', value);
    
    // Auto-advance to notes question after a short delay
    setTimeout(() => {
      setVisibleQuestions(prev => prev + 1);
      
      // Scroll to notes question smoothly
      setTimeout(() => {
        if (notesQuestionRef.current) {
          notesQuestionRef.current.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start',
            inline: 'nearest'
          });
        }
      }, 100);
    }, 400);
  };

  const shouldShowNotes = visibleQuestions >= 2 && formData.activity_level;

  return (
    <div className="space-y-6">
      {/* Activity Level Question */}
      <div>
        <div data-error={errors.activity_level ? 'true' : undefined}>
          <h3 className="text-2xl sm:text-3xl md:text-4xl text-neutral-900 mb-3">
            How active are you right now?
          </h3>
          <SingleSelectButtonGroup
            options={[
              { value: 'sedentary', label: 'Mostly sedentary (desk work, little movement)' },
              { value: 'light', label: 'Lightly active (some walking daily)' },
              { value: 'moderate', label: 'Moderately active (regular walks or exercise)' },
              { value: 'active', label: 'Active (consistent exercise routine)' },
              { value: 'very_active', label: 'Very active (intensive daily training)' }
            ]}
            selectedValue={formData.activity_level || ''}
            onSelect={handleActivitySelect}
          />
          {errors.activity_level && (
            <p className="text-sm text-red-600 mt-2">{errors.activity_level}</p>
          )}
        </div>
      </div>

      {/* Optional Notes Question */}
      {shouldShowNotes && (
        <motion.div
          ref={notesQuestionRef}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <label className="block text-2xl sm:text-3xl md:text-4xl text-neutral-900 mb-2">
            Anything else we should know?
          </label>
          <p className="text-sm text-neutral-600 mb-3">
            Share whatever feels important—we're listening and here to help.
          </p>
          <textarea
            value={formData.journey_notes || ''}
            onChange={(e) => updateFormData('journey_notes', e.target.value)}
            placeholder="Feel free to share what's on your mind..."
            rows={6}
            className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0D9488]/40 focus:border-[#0D9488] transition-all duration-200 resize-none"
          />
          <p className="text-xs text-neutral-500 mt-2">Optional</p>
        </motion.div>
      )}
    </div>
  );
}
