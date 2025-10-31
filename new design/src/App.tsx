import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import TimelineQuestionScreen from './components/screens/TimelineQuestionScreen';
import StateSelectionScreen from './components/screens/StateSelectionScreen';
import DemographicsScreen from './components/screens/DemographicsScreen';
import MedicalAssessmentScreen from './components/screens/MedicalAssessmentScreen';
import { GLP1HistoryScreen } from './components/screens/GLP1HistoryScreen';
import WeightLossGraph from './components/WeightLossGraph';
import EmailCaptureScreen from './components/screens/EmailCaptureScreen';
import MedicationChoiceScreenStandalone from './components/screens/MedicationChoiceScreenStandalone';
import PlanSelectionScreenStandalone from './components/screens/PlanSelectionScreenStandalone';
import AccountCreationScreen from './components/screens/AccountCreationScreen';
import UniversalProgressBar from './components/common/UniversalProgressBar';
import SimpleInterstitialWrapper from './components/screens/SimpleInterstitialWrapper';
import MedicalCompletionCelebrationScreen from './components/screens/MedicalCompletionCelebrationScreen';
import GLP1ExperienceScreen from './components/screens/GLP1ExperienceScreen';

/**
 * COMPLETE FLOW - Zappy Weight Loss Application
 * 
 * Flow with consolidated screens:
 * 1. Timeline questions (3 goal questions)
 * 2. State selection
 * 3. Demographics (age, sex, height, weight)
 * 4. Weight loss graph interstitial ← Strike while hot!
 * 5. Email capture ← Capture while engaged!
 * 6. Medical Assessment intro
 * 7. Medical Assessment (7 sections consolidated)
 * 8. Medical completion celebration ← Celebrate progress!
 * 9. GLP-1 experience question (Have you tried GLP-1?)
 * 10. GLP-1 history (if YES to #9)
 * 11. Medication choice
 * 12. Plan selection
 * 13. Account creation (name, password, shipping address, payment)
 */

interface FormData {
  // Goals
  goalRange?: string;
  goalMotivations?: string[];
  goalChallenges?: string[];

  // Demographics
  state?: string;
  stateName?: string;
  age?: string;
  dateOfBirth?: string;
  sex?: string;
  heightFt?: string;
  heightIn?: string;
  weight?: string;

  // Medical Assessment
  medicalAssessment?: any;
  
  // GLP-1
  hasGLP1Experience?: boolean;
  glp1History?: any;
  medicationPreference?: string;

  // Medication & Plan
  selectedMedication?: string;
  selectedPlan?: any;

  // Email
  email?: string;

  // Account
  firstName?: string;
  lastName?: string;
  password?: string;
}

type Screen =
  | 'timeline_questions'
  | 'state_selection'
  | 'demographics'
  | 'weight_loss_interstitial'
  | 'email_capture'
  | 'medical_assessment_intro'
  | 'medical_assessment'
  | 'medical_completion_celebration'
  | 'glp1_experience'
  | 'glp1_history'
  | 'medication_choice'
  | 'plan_selection'
  | 'account_creation'
  | 'complete';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('timeline_questions');
  const [formData, setFormData] = useState<FormData>({});

  // Calculate current step and total steps
  const getProgressInfo = () => {
    const stepMap: Record<Screen, number> = {
      timeline_questions: 1,
      state_selection: 2,
      demographics: 3,
      weight_loss_interstitial: 4,
      email_capture: 5,
      medical_assessment_intro: 6,
      medical_assessment: 6,
      medical_completion_celebration: 7,
      glp1_experience: 8,
      glp1_history: 9,
      medication_choice: 10,
      plan_selection: 11,
      account_creation: 12,
      complete: 13,
    };

    const sectionLabels: Record<Screen, string | undefined> = {
      timeline_questions: 'Your Goals',
      state_selection: 'Location',
      demographics: 'Basic Information',
      weight_loss_interstitial: undefined, // No label for interstitials
      email_capture: 'Almost Done',
      medical_assessment_intro: undefined, // Interstitial
      medical_assessment: undefined, // Handled internally with subsections
      medical_completion_celebration: undefined, // Celebration interstitial
      glp1_experience: 'Medication History',
      glp1_history: 'Medication History',
      medication_choice: 'Treatment Options',
      plan_selection: 'Plan Selection',
      account_creation: 'Account Setup',
      complete: undefined,
    };
    
    const totalSteps = 12; // Not counting complete screen
    const currentStep = stepMap[currentScreen];
    const progress = (currentStep / totalSteps) * 100;
    const sectionLabel = sectionLabels[currentScreen];
    
    return { currentStep, totalSteps, progress, sectionLabel };
  };

  const { currentStep, totalSteps, progress, sectionLabel } = getProgressInfo();

  // Handle timeline questions completion
  const handleTimelineComplete = (answers: Record<string, any>) => {
    setFormData({
      ...formData,
      goalRange: answers['goal.range'],
      goalMotivations: answers['goal.motivations'],
      goalChallenges: answers['goal.challenges'],
    });
    setCurrentScreen('state_selection');
  };

  // Handle state selection
  const handleStateSelect = (stateCode: string, stateName: string) => {
    setFormData({
      ...formData,
      state: stateCode,
      stateName: stateName,
    });
    setCurrentScreen('demographics');
  };

  // Handle demographics completion
  const handleDemographicsComplete = (data: any) => {
    // Calculate age from date of birth if provided
    let calculatedAge = data.age;
    if (data.dateOfBirth) {
      const birthDate = new Date(data.dateOfBirth);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      calculatedAge = age.toString();
    }

    setFormData({
      ...formData,
      age: calculatedAge,
      dateOfBirth: data.dateOfBirth,
      sex: data.sex,
      heightFt: data.height_ft,
      heightIn: data.height_in,
      weight: data.weight,
    });
    // Show them exciting results first!
    setCurrentScreen('weight_loss_interstitial');
  };

  // Handle medical assessment completion
  const handleMedicalAssessmentComplete = (data: any) => {
    setFormData({
      ...formData,
      medicalAssessment: data,
    });
    
    // Show celebration screen first!
    setCurrentScreen('medical_completion_celebration');
  };

  // Handle medical completion celebration
  const handleMedicalCelebrationComplete = () => {
    // Ask about GLP-1 experience first
    setCurrentScreen('glp1_experience');
  };

  // Handle GLP-1 experience question
  const handleGLP1ExperienceComplete = (hasExperience: boolean, medicationPreference?: string) => {
    setFormData({
      ...formData,
      hasGLP1Experience: hasExperience,
      medicationPreference: medicationPreference,
    });
    
    if (hasExperience) {
      // If they have experience, show detailed history screen
      setCurrentScreen('glp1_history');
    } else {
      // If no experience, skip directly to medication choice
      setCurrentScreen('medication_choice');
    }
  };

  // Handle GLP-1 history completion
  const handleGLP1Complete = (history: any) => {
    setFormData({
      ...formData,
      glp1History: history,
    });
    setCurrentScreen('medication_choice');
  };

  // Handle weight loss interstitial
  const handleWeightLossInterstitialComplete = () => {
    // Capture email while they're excited!
    setCurrentScreen('email_capture');
  };

  // Handle medication choice
  const handleMedicationChoiceComplete = (medication: string) => {
    setFormData({
      ...formData,
      selectedMedication: medication,
    });
    setCurrentScreen('plan_selection');
  };

  // Handle plan selection
  const handlePlanSelectionComplete = (plan: any) => {
    setFormData({
      ...formData,
      selectedPlan: plan,
    });
    setCurrentScreen('account_creation');
  };

  // Handle account creation
  const handleAccountCreationComplete = (accountData: any) => {
    setFormData({
      ...formData,
      firstName: accountData.firstName,
      lastName: accountData.lastName,
      password: accountData.password,
    });
    setCurrentScreen('complete');
  };

  // Handle email submission
  const handleEmailSubmit = (email: string) => {
    setFormData({
      ...formData,
      email: email,
    });
    // Now proceed to medical assessment
    setCurrentScreen('medical_assessment_intro');
  };

  // Navigation helpers
  const goBack = () => {
    // Special handling for conditional flows
    if (currentScreen === 'medication_choice') {
      // Go back based on whether they had GLP-1 experience
      if (formData.hasGLP1Experience) {
        setCurrentScreen('glp1_history');
      } else {
        setCurrentScreen('glp1_experience');
      }
      return;
    }

    const screenOrder: Screen[] = [
      'timeline_questions',
      'state_selection',
      'demographics',
      'weight_loss_interstitial',
      'email_capture',
      'medical_assessment_intro',
      'medical_assessment',
      'medical_completion_celebration',
      'glp1_experience',
      'glp1_history',
      'medication_choice',
      'plan_selection',
      'account_creation',
    ];
    const currentIndex = screenOrder.indexOf(currentScreen);
    if (currentIndex > 0) {
      setCurrentScreen(screenOrder[currentIndex - 1]);
    }
  };

  // Define timeline questions
  const timelineQuestions = [
    {
      id: 'goal.range',
      type: 'single_select' as const,
      title: "How much are you hoping to lose?",
      auto_advance: true,
      options: [
        { value: '1-15', label: '1–15 lb' },
        { value: '16-30', label: '16–30 lb' },
        { value: '31-50', label: '31–50 lb' },
        { value: '50+', label: 'More than 50 lb' },
        { value: 'not_sure', label: 'Still figuring it out' },
      ],
    },
    {
      id: 'goal.motivations',
      type: 'multi_select' as const,
      title: 'What matters most to you?',
      options: [
        { value: 'lose_weight', label: 'Lose weight and keep it off' },
        { value: 'boost_energy', label: 'Boost energy and feel better' },
        { value: 'improve_health', label: 'Improve overall health' },
        { value: 'regain_confidence', label: 'Regain confidence' },
        { value: 'other', label: 'Other' },
      ],
    },
    {
      id: 'goal.challenges',
      type: 'multi_select' as const,
      title: "What would you like support with?",
      options: [
        { value: 'cravings', label: 'Controlling cravings and hunger' },
        { value: 'time', label: 'Finding time to exercise' },
        { value: 'motivation', label: 'Staying motivated' },
        { value: 'plateaus', label: 'Breaking through plateaus' },
        { value: 'consistency', label: 'Being consistent' },
        { value: 'other', label: 'Other' },
      ],
    },
  ];

  // Completion screen
  if (currentScreen === 'complete') {
    return (
      <div className="min-h-screen bg-[#fef8f2] flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-2xl"
        >
          {/* Success Icon */}
          <div className="w-24 h-24 rounded-full bg-[#00A896] flex items-center justify-center mx-auto mb-6 shadow-xl">
            <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h1 className="text-4xl md:text-5xl mb-4 text-neutral-900">
            Welcome, {formData.firstName}! 🎉
          </h1>
          
          <p className="text-xl text-neutral-600 mb-8">
            Your account has been created successfully. Check your email at <strong className="text-[#1a7f72]">{formData.email}</strong> to get started!
          </p>

          {/* Summary */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 text-left">
            <h3 className="text-lg mb-4 text-neutral-900">Your Journey Summary:</h3>
            <div className="space-y-3 text-sm text-neutral-700">
              <div className="flex justify-between border-b border-neutral-100 pb-2">
                <span className="text-neutral-500">Goal:</span>
                <span>{formData.goalRange} lb</span>
              </div>
              <div className="flex justify-between border-b border-neutral-100 pb-2">
                <span className="text-neutral-500">Location:</span>
                <span>{formData.stateName}</span>
              </div>
              <div className="flex justify-between border-b border-neutral-100 pb-2">
                <span className="text-neutral-500">Demographics:</span>
                <span>{formData.age}y, {formData.sex}, {formData.heightFt}'{formData.heightIn}", {formData.weight}lb</span>
              </div>
              <div className="flex justify-between border-b border-neutral-100 pb-2">
                <span className="text-neutral-500">Medication:</span>
                <span>{formData.selectedMedication}</span>
              </div>
              <div className="flex justify-between border-b border-neutral-100 pb-2">
                <span className="text-neutral-500">Plan:</span>
                <span>{formData.selectedPlan?.name}</span>
              </div>
            </div>
          </div>

          {/* CTA */}
          <button
            onClick={() => {
              setCurrentScreen('timeline_questions');
              setFormData({});
            }}
            className="bg-[#FF6B6B] hover:bg-[#FF5252] text-white px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all"
          >
            Start Over
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fef8f2]">
      <AnimatePresence mode="wait">
        {currentScreen === 'timeline_questions' && (
          <TimelineQuestionScreen
            key="timeline"
            questions={timelineQuestions}
            onComplete={handleTimelineComplete}
            currentStep={currentStep}
            totalSteps={totalSteps}
          />
        )}

        {currentScreen === 'state_selection' && (
          <StateSelectionScreen
            key="state"
            onSelect={handleStateSelect}
            onBack={goBack}
            currentStep={currentStep}
            totalSteps={totalSteps}
          />
        )}

        {currentScreen === 'demographics' && (
          <DemographicsScreen
            key="demographics"
            onComplete={handleDemographicsComplete}
            onBack={goBack}
            currentStep={currentStep}
            totalSteps={totalSteps}
          />
        )}

        {currentScreen === 'medical_assessment_intro' && (
          <SimpleInterstitialWrapper
            key="medical-intro"
            onNext={() => setCurrentScreen('medical_assessment')}
            onBack={goBack}
            currentStep={currentStep}
            totalSteps={totalSteps}
            sectionName="Health Assessment"
          >
            <div className="text-center space-y-6 max-w-2xl mx-auto">
              {/* Title */}
              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-2xl sm:text-3xl md:text-4xl text-neutral-900"
              >
                Next up: Your health assessment
              </motion.h2>

              {/* Description */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <p className="text-base sm:text-lg text-neutral-600 leading-relaxed">
                  To ensure GLP-1 medication is safe and right for you, we'll need to ask a few important health questions. This helps our medical team create your personalized care plan.
                </p>
              </motion.div>
            </div>
          </SimpleInterstitialWrapper>
        )}

        {currentScreen === 'medical_assessment' && (
          <MedicalAssessmentScreen
            key="medical"
            onNext={handleMedicalAssessmentComplete}
            onBack={goBack}
            sexBirth={formData.sex as any}
            currentStep={currentStep}
            totalSteps={totalSteps}
          />
        )}

        {currentScreen === 'medical_completion_celebration' && (
          <MedicalCompletionCelebrationScreen
            key="medical-celebration"
            onNext={handleMedicalCelebrationComplete}
            onBack={goBack}
            currentStep={currentStep}
            totalSteps={totalSteps}
          />
        )}

        {currentScreen === 'glp1_experience' && (
          <GLP1ExperienceScreen
            key="glp1-experience"
            onNext={handleGLP1ExperienceComplete}
            onBack={goBack}
            currentStep={currentStep}
            totalSteps={totalSteps}
          />
        )}

        {currentScreen === 'glp1_history' && (
          <GLP1HistoryScreen
            key="glp1"
            onNext={handleGLP1Complete}
            onBack={goBack}
            currentStep={currentStep}
            totalSteps={totalSteps}
          />
        )}

        {currentScreen === 'weight_loss_interstitial' && (
          <SimpleInterstitialWrapper
            key="interstitial"
            onNext={handleWeightLossInterstitialComplete}
            onBack={goBack}
            currentStep={currentStep}
            totalSteps={totalSteps}
            sectionName="Your Potential Results"
          >
            <div className="text-center mb-10">
              <h2 className="text-2xl sm:text-3xl md:text-4xl text-neutral-900 mb-3 sm:mb-4">
                Your potential transformation
              </h2>
              <p className="text-base sm:text-lg text-neutral-600 leading-relaxed max-w-xl mx-auto">
                You could shed <span className="font-bold text-[#FF6B4A]">{Math.round(parseInt(formData.highest_weight || formData.weight || '200') * 0.2)} lbs</span> from your starting weight
              </p>
            </div>

            <WeightLossGraph
              startingWeight={parseInt(formData.weight || '200')}
              highestWeight={parseInt(formData.highest_weight || formData.weight || '200')}
              goalWeight={parseInt(formData.weight || '200') - 30}
            />

            <p className="text-center text-sm text-neutral-500 mt-6">
              Individual results may vary. Graph shows typical patient journey based on clinical trials.
            </p>
          </SimpleInterstitialWrapper>
        )}

        {currentScreen === 'medication_choice' && (
          <MedicationChoiceScreenStandalone
            key="medication"
            onNext={handleMedicationChoiceComplete}
            onBack={goBack}
            currentStep={currentStep}
            totalSteps={totalSteps}
            hasGLP1Experience={formData.hasGLP1Experience}
          />
        )}

        {currentScreen === 'plan_selection' && (
          <PlanSelectionScreenStandalone
            key="plan"
            selectedMedication={formData.selectedMedication || 'semaglutide'}
            onNext={handlePlanSelectionComplete}
            onBack={goBack}
            currentStep={currentStep}
            totalSteps={totalSteps}
          />
        )}

        {currentScreen === 'account_creation' && (
          <AccountCreationScreen
            key="account"
            selectedPlan={formData.selectedPlan}
            selectedMedication={formData.selectedMedication || 'semaglutide'}
            onComplete={handleAccountCreationComplete}
            onBack={goBack}
            currentStep={currentStep}
            totalSteps={totalSteps}
          />
        )}

        {currentScreen === 'email_capture' && (
          <EmailCaptureScreen
            key="email"
            onSubmit={handleEmailSubmit}
            onBack={goBack}
            currentStep={currentStep}
            totalSteps={totalSteps}
            sectionLabel={sectionLabel}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
