import { useState } from 'react';
import { motion } from 'motion/react';
import { User, Check } from 'lucide-react';
import NavigationButtons from '../common/NavigationButtons';
import ScreenHeader from '../common/ScreenHeader';
import ValidationCheckmark from '../common/ValidationCheckmark';
import ErrorMessage from '../common/ErrorMessage';

interface DemographicsData {
  age?: string;
  dateOfBirth?: string;
  sex?: string;
  height_ft?: string;
  height_in?: string;
  weight?: string;
  highest_weight?: string;
  goal_weight?: string;
}

interface DemographicsScreenProps {
  onComplete: (data: DemographicsData) => void;
  onBack?: () => void;
  initialData?: DemographicsData;
  currentStep?: number;
  totalSteps?: number;
}

export default function DemographicsScreen({
  onComplete,
  onBack,
  initialData = {},
  currentStep,
  totalSteps,
}: DemographicsScreenProps) {
  const [data, setData] = useState<DemographicsData>(initialData);
  const [dobError, setDobError] = useState<string>('');
  const [heightFtError, setHeightFtError] = useState<string>('');
  const [heightInError, setHeightInError] = useState<string>('');
  const [weightError, setWeightError] = useState<string>('');
  const [highestWeightError, setHighestWeightError] = useState<string>('');
  const [goalWeightError, setGoalWeightError] = useState<string>('');

  // Calculate min and max dates for validation
  const today = new Date();
  const maxDate = new Date(today.getFullYear() - 12, today.getMonth(), today.getDate());
  const minDate = new Date(today.getFullYear() - 90, today.getMonth(), today.getDate());

  const handleChange = (field: keyof DemographicsData, value: string) => {
    setData((prev) => ({ ...prev, [field]: value }));
    
    // Clear errors when user changes values
    if (field === 'dateOfBirth') {
      setDobError('');
    } else if (field === 'height_ft') {
      setHeightFtError('');
    } else if (field === 'height_in') {
      setHeightInError('');
    } else if (field === 'weight') {
      setWeightError('');
    } else if (field === 'highest_weight') {
      setHighestWeightError('');
    } else if (field === 'goal_weight') {
      setGoalWeightError('');
    }
  };

  const isFieldFilled = (field: keyof DemographicsData) => {
    const value = data[field];
    return value !== undefined && value !== '';
  };

  const calculateAge = (dateOfBirth: string): number => {
    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  // Pure validation checks (no side effects) - safe to call during render
  const isDateOfBirthValid = (): boolean => {
    if (!data.dateOfBirth) return false;
    const age = calculateAge(data.dateOfBirth);
    return age >= 12 && age <= 90;
  };

  const isHeightFtValid = (): boolean => {
    if (!data.height_ft) return false;
    const ft = parseInt(data.height_ft);
    return !isNaN(ft) && ft >= 3 && ft <= 8;
  };

  const isHeightInValid = (): boolean => {
    if (data.height_in === undefined || data.height_in === '') return false;
    const inches = parseInt(data.height_in);
    return !isNaN(inches) && inches >= 0 && inches <= 11;
  };

  const isWeightValid = (): boolean => {
    if (!data.weight) return false;
    const lbs = parseInt(data.weight);
    return !isNaN(lbs) && lbs >= 80 && lbs <= 600;
  };

  const isHighestWeightValid = (): boolean => {
    if (!data.highest_weight) return false;
    const lbs = parseInt(data.highest_weight);
    return !isNaN(lbs) && lbs >= 80 && lbs <= 600;
  };

  const isGoalWeightValid = (): boolean => {
    if (!data.goal_weight) return false;
    const lbs = parseInt(data.goal_weight);
    return !isNaN(lbs) && lbs >= 80 && lbs <= 400;
  };

  // Validation with side effects (for onBlur) - sets error messages
  const validateDateOfBirth = (): boolean => {
    if (!data.dateOfBirth) return false;
    
    const age = calculateAge(data.dateOfBirth);
    
    if (age < 12) {
      setDobError('You must be at least 12 years old to use this service');
      return false;
    }
    
    if (age > 90) {
      setDobError('Please enter a valid date of birth');
      return false;
    }
    
    setDobError('');
    return true;
  };

  const validateHeightFt = (): boolean => {
    if (!data.height_ft) return false;
    
    const ft = parseInt(data.height_ft);
    
    if (isNaN(ft)) {
      setHeightFtError('Please enter a valid number');
      return false;
    }
    
    if (ft < 3 || ft > 8) {
      setHeightFtError('Height must be between 3 and 8 feet');
      return false;
    }
    
    setHeightFtError('');
    return true;
  };

  const validateHeightIn = (): boolean => {
    if (data.height_in === undefined || data.height_in === '') return false;
    
    const inches = parseInt(data.height_in);
    
    if (isNaN(inches)) {
      setHeightInError('Please enter a valid number');
      return false;
    }
    
    if (inches < 0 || inches > 11) {
      setHeightInError('Inches must be between 0 and 11');
      return false;
    }
    
    setHeightInError('');
    return true;
  };

  const validateWeight = (): boolean => {
    if (!data.weight) return false;
    
    const lbs = parseInt(data.weight);
    
    if (isNaN(lbs)) {
      setWeightError('Please enter a valid number');
      return false;
    }
    
    if (lbs < 80) {
      setWeightError('Weight must be at least 80 lbs');
      return false;
    }
    
    if (lbs > 600) {
      setWeightError('Please enter a valid weight');
      return false;
    }
    
    setWeightError('');
    return true;
  };

  const validateHighestWeight = (): boolean => {
    if (!data.highest_weight) return false;
    
    const lbs = parseInt(data.highest_weight);
    
    if (isNaN(lbs)) {
      setHighestWeightError('Please enter a valid number');
      return false;
    }
    
    if (lbs < 80) {
      setHighestWeightError('Weight must be at least 80 lbs');
      return false;
    }
    
    if (lbs > 600) {
      setHighestWeightError('Please enter a valid weight');
      return false;
    }
    
    // Validate: current weight <= highest weight
    if (data.weight) {
      const currentWeight = parseInt(data.weight);
      if (!isNaN(currentWeight) && lbs < currentWeight) {
        setHighestWeightError('Highest weight must be at least your current weight');
        return false;
      }
    }
    
    setHighestWeightError('');
    return true;
  };

  const validateGoalWeight = (): boolean => {
    if (!data.goal_weight) return false;
    
    const lbs = parseInt(data.goal_weight);
    
    if (isNaN(lbs)) {
      setGoalWeightError('Please enter a valid number');
      return false;
    }
    
    if (lbs < 80) {
      setGoalWeightError('Weight must be at least 80 lbs');
      return false;
    }
    
    if (lbs > 400) {
      setGoalWeightError('Please enter a realistic goal weight');
      return false;
    }
    
    // Validate: goal weight < current weight
    if (data.weight) {
      const currentWeight = parseInt(data.weight);
      if (!isNaN(currentWeight) && lbs >= currentWeight) {
        setGoalWeightError('Goal weight must be less than your current weight');
        return false;
      }
    }
    
    setGoalWeightError('');
    return true;
  };

  const isComplete = () => {
    return !!(
      data.dateOfBirth &&
      isDateOfBirthValid() &&
      data.sex &&
      data.height_ft &&
      isHeightFtValid() &&
      data.height_in !== undefined &&
      isHeightInValid() &&
      data.weight &&
      isWeightValid() &&
      data.highest_weight &&
      isHighestWeightValid() &&
      data.goal_weight &&
      isGoalWeightValid()
    );
  };

  const canContinue = isComplete();

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
              onBack={onBack}
              sectionLabel="Basic Information"
              progressPercentage={(currentStep / totalSteps) * 100}
            />
          )}

          {/* Header */}
          <div className="mb-6 text-center">
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-2xl sm:text-3xl md:text-4xl text-neutral-900 leading-tight tracking-tight"
              style={{ letterSpacing: '-0.02em' }}
            >
              A few things about you
            </motion.h1>
          </div>

          {/* Form Fields */}
          <div className="space-y-8">
            {/* Physical Information Group */}
            <div className="space-y-4">
            {/* Date of Birth */}
            <div>
              <label className="block text-sm text-neutral-700 mb-2">
                Date of birth
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={data.dateOfBirth || ''}
                  onChange={(e) => handleChange('dateOfBirth', e.target.value)}
                  onBlur={() => {
                    if (data.dateOfBirth) {
                      validateDateOfBirth();
                    }
                  }}
                  min={minDate.toISOString().split('T')[0]}
                  max={maxDate.toISOString().split('T')[0]}
                  placeholder="MM/DD/YYYY"
                  className={`w-full px-4 py-4 rounded-xl border-2 bg-white focus:border-[#1a7f72] focus:ring-4 focus:ring-[#1a7f72]/10 outline-none transition-all text-base shadow-sm appearance-none ${
                    dobError
                      ? 'border-red-500 bg-red-50'
                      : isFieldFilled('dateOfBirth') && !dobError
                      ? 'border-[#10b981] bg-[#10b981]/5'
                      : 'border-gray-300'
                  }`}
                  style={{
                    colorScheme: 'light',
                    WebkitAppearance: 'none',
                    MozAppearance: 'textfield'
                  }}
                />
                <ValidationCheckmark show={isFieldFilled('dateOfBirth') && !dobError} />
              </div>
              <ErrorMessage error={dobError} />
            </div>

            {/* Sex */}
            <div>
              <label className="block text-sm text-neutral-700 mb-3">
                Sex assigned at birth
              </label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: 'male', label: 'Male' },
                  { value: 'female', label: 'Female' },
                ].map((option) => {
                  const isSelected = data.sex === option.value;
                  return (
                    <motion.button
                      key={option.value}
                      onClick={() => handleChange('sex', option.value)}
                      whileTap={{ scale: 0.98 }}
                      className={`py-4 px-5 rounded-xl border-2 transition-all duration-300 focus:outline-none focus-visible:ring-4 focus-visible:ring-[#1a7f72]/20 ${
                        isSelected
                          ? 'border-[#1a7f72] bg-[#e6f3f2] shadow-md'
                          : 'border-gray-300 bg-white hover:border-[#1a7f72]/30 hover:shadow-md shadow-sm'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className={`text-base ${isSelected ? 'text-[#1a7f72]' : 'text-neutral-700'}`}>
                          {option.label}
                        </span>
                        {isSelected && (
                          <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                            className="w-5 h-5 rounded-full bg-[#00A896] flex items-center justify-center"
                          >
                            <Check className="w-3 h-3 text-white" strokeWidth={3} />
                          </motion.div>
                        )}
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Height */}
            <div>
              <label className="block text-sm text-neutral-700 mb-2">
                Height
              </label>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="relative">
                    <input
                      type="number"
                      value={data.height_ft || ''}
                      onChange={(e) => handleChange('height_ft', e.target.value)}
                      onBlur={() => {
                        if (data.height_ft) {
                          validateHeightFt();
                        }
                      }}
                      placeholder="5"
                      min="3"
                      max="8"
                      className={`w-full px-4 py-4 pr-12 rounded-xl border-2 bg-white focus:border-[#1a7f72] focus:ring-4 focus:ring-[#1a7f72]/10 outline-none transition-all text-base shadow-sm ${
                        heightFtError
                          ? 'border-red-500 bg-red-50'
                          : isFieldFilled('height_ft') && !heightFtError
                          ? 'border-[#10b981] bg-[#10b981]/5'
                          : 'border-gray-300'
                      }`}
                    />
                    <span className={`absolute right-4 top-1/2 -translate-y-1/2 text-sm transition-colors ${
                      isFieldFilled('height_ft') && !heightFtError ? 'text-[#10b981]' : 'text-neutral-500'
                    }`}>
                      ft
                    </span>
                    <ValidationCheckmark show={isFieldFilled('height_ft') && !heightFtError} className="right-12" />
                  </div>
                  <ErrorMessage error={heightFtError} className="text-sm" />
                </div>
                <div>
                  <div className="relative">
                    <input
                      type="number"
                      value={data.height_in || ''}
                      onChange={(e) => handleChange('height_in', e.target.value)}
                      onBlur={() => {
                        if (data.height_in !== undefined && data.height_in !== '') {
                          validateHeightIn();
                        }
                      }}
                      placeholder="10"
                      min="0"
                      max="11"
                      className={`w-full px-4 py-4 pr-12 rounded-xl border-2 bg-white focus:border-[#1a7f72] focus:ring-4 focus:ring-[#1a7f72]/10 outline-none transition-all text-base shadow-sm ${
                        heightInError
                          ? 'border-red-500 bg-red-50'
                          : isFieldFilled('height_in') && !heightInError
                          ? 'border-[#10b981] bg-[#10b981]/5'
                          : 'border-gray-300'
                      }`}
                    />
                    <span className={`absolute right-4 top-1/2 -translate-y-1/2 text-sm transition-colors ${
                      isFieldFilled('height_in') && !heightInError ? 'text-[#10b981]' : 'text-neutral-500'
                    }`}>
                      in
                    </span>
                    <ValidationCheckmark show={isFieldFilled('height_in') && !heightInError} className="right-12 w-5 h-5" />
                  </div>
                  <ErrorMessage error={heightInError} className="text-xs" />
                </div>
              </div>
            </div>

            {/* Weight */}
            <div>
              <label className="block text-sm text-neutral-700 mb-2">
                Current weight
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={data.weight || ''}
                  onChange={(e) => handleChange('weight', e.target.value)}
                  onBlur={() => {
                    if (data.weight) {
                      validateWeight();
                    }
                  }}
                  placeholder="Enter your weight"
                  min="80"
                  max="600"
                  className={`w-full px-4 py-4 pr-12 rounded-xl border-2 bg-white focus:border-[#1a7f72] focus:ring-4 focus:ring-[#1a7f72]/10 outline-none transition-all text-base shadow-sm ${
                    weightError
                      ? 'border-red-500 bg-red-50'
                      : isFieldFilled('weight') && !weightError
                      ? 'border-[#10b981] bg-[#10b981]/5'
                      : 'border-gray-300'
                  }`}
                />
                <span className={`absolute right-4 top-1/2 -translate-y-1/2 text-sm transition-colors ${
                  isFieldFilled('weight') && !weightError ? 'text-[#10b981]' : 'text-neutral-500'
                }`}>
                  lbs
                </span>
                <ValidationCheckmark show={isFieldFilled('weight') && !weightError} className="right-12" />
              </div>
              <ErrorMessage error={weightError} />
            </div>
            </div>

            {/* Weight History Group */}
            <div className="space-y-4 pt-2 border-t border-neutral-100">

            {/* Highest Weight */}
            <div>
              <label className="block text-sm text-neutral-700 mb-2">
                Highest weight
              </label>
              <p className="text-xs text-neutral-500 mb-2">Your best estimate is fine</p>
              <div className="relative">
                <input
                  type="number"
                  value={data.highest_weight || ''}
                  onChange={(e) => handleChange('highest_weight', e.target.value)}
                  onBlur={() => {
                    if (data.highest_weight) {
                      validateHighestWeight();
                    }
                  }}
                  placeholder="Enter your highest weight"
                  min="80"
                  max="600"
                  className={`w-full px-4 py-4 pr-12 rounded-xl border-2 bg-white focus:border-[#1a7f72] focus:ring-4 focus:ring-[#1a7f72]/10 outline-none transition-all text-base shadow-sm ${
                    highestWeightError
                      ? 'border-red-500 bg-red-50'
                      : isFieldFilled('highest_weight') && !highestWeightError
                      ? 'border-[#10b981] bg-[#10b981]/5'
                      : 'border-gray-300'
                  }`}
                />
                <span className={`absolute right-4 top-1/2 -translate-y-1/2 text-sm transition-colors ${
                  isFieldFilled('highest_weight') && !highestWeightError ? 'text-[#10b981]' : 'text-neutral-500'
                }`}>
                  lbs
                </span>
                <ValidationCheckmark show={isFieldFilled('highest_weight') && !highestWeightError} className="right-12" />
              </div>
              <ErrorMessage error={highestWeightError} />
            </div>

            {/* Goal Weight */}
            <div>
              <label className="block text-sm text-neutral-700 mb-2">
                Goal weight
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={data.goal_weight || ''}
                  onChange={(e) => handleChange('goal_weight', e.target.value)}
                  onBlur={() => {
                    if (data.goal_weight) {
                      validateGoalWeight();
                    }
                  }}
                  placeholder="Enter your goal weight"
                  min="80"
                  max="400"
                  className={`w-full px-4 py-4 pr-12 rounded-xl border-2 bg-white focus:border-[#1a7f72] focus:ring-4 focus:ring-[#1a7f72]/10 outline-none transition-all text-base shadow-sm ${
                    goalWeightError
                      ? 'border-red-500 bg-red-50'
                      : isFieldFilled('goal_weight') && !goalWeightError
                      ? 'border-[#10b981] bg-[#10b981]/5'
                      : 'border-gray-300'
                  }`}
                />
                <span className={`absolute right-4 top-1/2 -translate-y-1/2 text-sm transition-colors ${
                  isFieldFilled('goal_weight') && !goalWeightError ? 'text-[#10b981]' : 'text-neutral-500'
                }`}>
                  lbs
                </span>
                <ValidationCheckmark show={isFieldFilled('goal_weight') && !goalWeightError} className="right-12" />
              </div>
              <ErrorMessage error={goalWeightError} />
            </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="mt-8 pt-6 border-t border-neutral-100">
            <NavigationButtons
              onNext={() => onComplete(data)}
              isNextDisabled={!canContinue}
              nextLabel="See what is possible"
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
