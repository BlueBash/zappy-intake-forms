// Utility to build medication history summary from answers

export function buildMedicationHistorySummary(answers: Record<string, any>) {
  const selectedMedications: string[] = [];
  const currentlyTaking: string[] = [];

  // Iterate through answers to find medication-related fields
  Object.keys(answers).forEach((key) => {
    if (key.startsWith('meds.') && key.endsWith('.used') && answers[key] === true) {
      const medicationName = key.replace('meds.', '').replace('.used', '');
      const formattedName = medicationName.charAt(0).toUpperCase() + medicationName.slice(1);
      selectedMedications.push(formattedName);

      // Check if currently taking
      const currentlyTakingKey = `meds.${medicationName}.currently_taking`;
      if (answers[currentlyTakingKey] === true) {
        currentlyTaking.push(formattedName);
      }
    }
  });

  return {
    selectedMedications,
    currentlyTaking,
  };
}
