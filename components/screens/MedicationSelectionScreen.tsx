import React from 'react';
import ScreenLayout from '../common/ScreenLayout';
import NavigationButtons from '../common/NavigationButtons';
import MedicationSelection from '../common/MedicationSelection';
import { ScreenProps } from './common';

const DEFAULT_SERVICE_TYPE = 'Weight Loss';

const MedicationSelectionScreen: React.FC<ScreenProps> = ({
  screen,
  answers,
  updateAnswer,
  onSubmit,
  showBack,
  onBack,
  defaultCondition,
}) => {
  const title = 'headline' in screen ? screen.headline : (screen as any).title;
  const helpText = 'body' in screen ? screen.body : (screen as any).help_text;

  const stateCode = answers['demographics.state'] || answers['shipping_state'] || answers['state'] || '';
  const serviceType =
    (screen as any)?.service_type && typeof (screen as any).service_type === 'string'
      ? (screen as any).service_type
      : defaultCondition || DEFAULT_SERVICE_TYPE;
  const selectedMedication = answers['selected_medication'] || '';

  return (
    <ScreenLayout title={title} helpText={helpText}>
      <MedicationSelection
        serviceType={serviceType}
        state={stateCode}
        selectedMedication={selectedMedication}
        onSelect={(medication) => {
          updateAnswer('selected_medication', medication);
          updateAnswer('medication', medication);
        }}
      />

      <NavigationButtons
        showBack={showBack}
        onBack={onBack}
        onNext={onSubmit}
        isNextDisabled={!selectedMedication}
      />
    </ScreenLayout>
  );
};

export default MedicationSelectionScreen;
