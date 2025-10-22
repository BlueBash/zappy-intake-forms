interface MedicationFieldConfig {
  checkboxId: string;
  label: string;
  currentlyTakingField?: string;
  customNameField?: string;
}

const MEDICATION_FIELDS: MedicationFieldConfig[] = [
  { checkboxId: 'used_wegovy', label: 'Wegovy (semaglutide for weight loss)', currentlyTakingField: 'wegovy_currently_taking' },
  { checkboxId: 'used_ozempic', label: 'Ozempic (semaglutide for diabetes)', currentlyTakingField: 'ozempic_currently_taking' },
  { checkboxId: 'used_semaglutide_compound', label: 'Compounded semaglutide', currentlyTakingField: 'semaglutide_compound_currently_taking' },
  { checkboxId: 'used_zepbound', label: 'Zepbound (tirzepatide for weight loss)', currentlyTakingField: 'zepbound_currently_taking' },
  { checkboxId: 'used_mounjaro', label: 'Mounjaro (tirzepatide for diabetes)', currentlyTakingField: 'mounjaro_currently_taking' },
  { checkboxId: 'used_tirzepatide_compound', label: 'Compounded tirzepatide', currentlyTakingField: 'tirzepatide_compound_currently_taking' },
  { checkboxId: 'used_saxenda', label: 'Saxenda (liraglutide for weight loss)', currentlyTakingField: 'saxenda_currently_taking' },
  { checkboxId: 'used_victoza', label: 'Victoza (liraglutide for diabetes)', currentlyTakingField: 'victoza_currently_taking' },
  { checkboxId: 'used_other', label: 'Other GLP-1', currentlyTakingField: 'other_currently_taking', customNameField: 'other_name' },
];

export interface MedicationHistorySummary {
  selectedMedications: string[];
  currentlyTaking: string[];
}

const resolveLabel = (config: MedicationFieldConfig, answers: Record<string, any>): string => {
  if (config.customNameField) {
    const custom = answers[config.customNameField];
    if (typeof custom === 'string' && custom.trim().length > 0) {
      return custom.trim();
    }
  }
  return config.label;
};

export const buildMedicationHistorySummary = (answers: Record<string, any>): MedicationHistorySummary => {
  const selectedMedications: string[] = [];
  const currentlyTaking: string[] = [];

  for (const config of MEDICATION_FIELDS) {
    if (answers[config.checkboxId]) {
      const label = resolveLabel(config, answers);
      selectedMedications.push(label);

      if (config.currentlyTakingField && answers[config.currentlyTakingField] === 'yes') {
        currentlyTaking.push(label);
      }
    }
  }

  return { selectedMedications, currentlyTaking };
};

