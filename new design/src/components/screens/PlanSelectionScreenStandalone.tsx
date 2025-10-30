import { useState } from 'react';
import { motion } from 'motion/react';
import ScreenHeader from '../common/ScreenHeader';
import NavigationButtons from '../common/NavigationButtons';
import PlanSelectionOnly from '../common/PlanSelectionOnly';
import type { PackagePlan } from '../../utils/api';

interface PlanSelectionScreenStandaloneProps {
  selectedMedication: string;
  onNext: (plan: any) => void;
  onBack: () => void;
  currentStep?: number;
  totalSteps?: number;
}

export default function PlanSelectionScreenStandalone({
  selectedMedication,
  onNext,
  onBack,
  currentStep,
  totalSteps
}: PlanSelectionScreenStandaloneProps) {
  const [selectedPlanId, setSelectedPlanId] = useState('');
  const [selectedPlanData, setSelectedPlanData] = useState<PackagePlan | null>(null);

  const handlePlanSelect = (planId: string, plan: PackagePlan | null) => {
    setSelectedPlanId(planId);
    setSelectedPlanData(plan);
  };

  const handleContinue = () => {
    if (selectedPlanData) {
      onNext(selectedPlanData);
    }
  };

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
              sectionLabel="Plan Selection"
              progressPercentage={(currentStep / totalSteps) * 100}
            />
          )}

          {/* Title */}
          <div className="mb-10 text-center">
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-2xl sm:text-3xl md:text-4xl text-neutral-900 mb-3 sm:mb-4 leading-snug tracking-tight"
              style={{ letterSpacing: '-0.02em' }}
            >
              Choose your plan
            </motion.h1>
          </div>

          <div className="space-y-6">
            <PlanSelectionOnly
              selectedMedication={selectedMedication}
              selectedPlanId={selectedPlanId}
              onPlanSelect={handlePlanSelect}
            />

            <NavigationButtons
              onNext={handleContinue}
              isNextDisabled={!selectedPlanId}
              nextLabel="Continue"
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
