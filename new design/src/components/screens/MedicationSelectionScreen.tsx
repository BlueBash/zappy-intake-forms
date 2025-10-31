import { motion } from 'motion/react';
import ScreenLayout from '../common/ScreenLayout';
import NavigationButtons from '../common/NavigationButtons';
import MedicationSelection from '../common/MedicationSelection';
import { ScreenProps } from './common';

const DEFAULT_SERVICE_TYPE = 'Weight Loss';

export default function MedicationSelectionScreen({ screen, answers, updateAnswer, onSubmit, showBack, onBack, defaultCondition }: ScreenProps) {
  const title = 'headline' in screen ? screen.headline : (screen as any).title;
  const helpText = 'body' in screen ? screen.body : (screen as any).help_text;

  const stateCode = answers['demographics.state'] || answers['shipping_state'] || answers['state'] || '';
  const serviceType =
    (screen as any)?.service_type && typeof (screen as any).service_type === 'string'
      ? (screen as any).service_type
      : defaultCondition || DEFAULT_SERVICE_TYPE;
  const selectedMedication = answers['selected_medication'] || '';

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      <ScreenLayout title={title || ''} helpText={helpText}>
        <div className="mb-8">
          <MedicationSelection
            serviceType={serviceType}
            state={stateCode}
            selectedMedication={selectedMedication}
            onSelect={(medication) => {
              updateAnswer('selected_medication', medication);
              updateAnswer('medication', medication);
            }}
          />
        </div>

        <NavigationButtons
          showBack={showBack}
          onBack={onBack}
          onNext={onSubmit}
          isNextDisabled={!selectedMedication}
        />
      </ScreenLayout>
    </motion.div>
  );
}
