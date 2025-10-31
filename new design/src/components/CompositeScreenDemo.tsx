import { useState } from 'react';
import { ElegantCompositeScreen } from './ElegantCompositeScreen';

export function CompositeScreenDemo() {
  const [answers, setAnswers] = useState<Record<string, any>>({});

  const updateAnswer = (fieldId: string, value: any) => {
    setAnswers(prev => ({ ...prev, [fieldId]: value }));
  };

  // Example screen configuration
  const exampleScreen = {
    id: 'personal_info',
    title: 'Tell us about yourself',
    help_text: 'This information helps us personalize your weight loss plan',
    fields: [
      {
        id: 'first_name',
        type: 'text',
        label: 'First Name',
        placeholder: 'Enter your first name',
        required: true,
      },
      {
        id: 'last_name',
        type: 'text',
        label: 'Last Name',
        placeholder: 'Enter your last name',
        required: true,
      },
      {
        id: 'email',
        type: 'email',
        label: 'Email Address',
        placeholder: 'you@example.com',
        required: true,
        validation: {
          pattern: '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$',
          error: 'Please enter a valid email address',
        },
      },
      {
        id: 'phone',
        type: 'text',
        label: 'Phone Number',
        placeholder: '(555) 555-5555',
        mask: '(###) ###-####',
        required: true,
      },
      [
        {
          id: 'age',
          type: 'number',
          label: 'Age',
          placeholder: '25',
          required: true,
          validation: {
            min: 18,
            max: 100,
            error: 'Age must be between 18 and 100',
          },
        },
        {
          id: 'weight',
          type: 'number',
          label: 'Current Weight',
          placeholder: '150',
          suffix: 'lbs',
          required: true,
        },
      ],
      {
        id: 'gender',
        type: 'single_select',
        label: 'Gender',
        required: true,
        options: [
          { value: 'male', label: 'Male' },
          { value: 'female', label: 'Female' }
        ],
      },
      {
        id: 'goals',
        type: 'single_select',
        label: 'Primary Goal',
        help_text: 'What is your main objective?',
        required: true,
        options: [
          { value: 'lose_weight', label: 'Lose weight' },
          { value: 'maintain_weight', label: 'Maintain current weight' },
          { value: 'gain_muscle', label: 'Gain muscle mass' },
          { value: 'improve_health', label: 'Improve overall health' },
        ],
      },
      {
        id: 'exercise_frequency',
        type: 'single_select',
        label: 'How often do you currently exercise?',
        required: true,
        options: [
          { value: 'never', label: 'Never' },
          { value: '1-2', label: '1-2 times per week' },
          { value: '3-4', label: '3-4 times per week' },
          { value: '5+', label: '5+ times per week' },
        ],
      },
      {
        id: 'terms_consent',
        type: 'consent_item',
        label: 'I agree to the Terms of Service and Privacy Policy',
        required: true,
        links: [
          { label: 'Terms of Service', url: 'https://example.com/terms' },
          { label: 'Privacy Policy', url: 'https://example.com/privacy' },
        ],
      },
      {
        id: 'newsletter',
        type: 'checkbox',
        label: 'Send me health tips and updates via email',
        required: false,
      },
    ],
    footer_note: 'Your information is secure and will never be shared with third parties.',
    post_screen_note: 'Great! All required information provided.',
  };

  const handleSubmit = () => {
    console.log('Form submitted with answers:', answers);
    alert('Form submitted! Check console for data.');
  };

  const handleBack = () => {
    console.log('Going back...');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FDFBF7] via-[#FEF9F3] to-[#FDF6EF] py-12">
      <ElegantCompositeScreen
        screen={exampleScreen}
        answers={answers}
        updateAnswer={updateAnswer}
        onSubmit={handleSubmit}
        showBack={true}
        onBack={handleBack}
        currentStep={2}
        totalSteps={5}
      />
    </div>
  );
}
