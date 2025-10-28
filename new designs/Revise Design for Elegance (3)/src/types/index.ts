// Common types for the application

export interface Link {
  label: string;
  url: string;
}

export interface Option {
  value: string;
  label: string;
}

// Screen Props Interface
export interface ScreenProps {
  screen: Screen;
  answers: Record<string, any>;
  updateAnswer: (id: string, value: any) => void;
  onSubmit: () => void;
  showBack: boolean;
  onBack: () => void;
  headerSize?: string;
  calculations?: Record<string, any>;
  defaultCondition?: string;
}

// Field Types
export interface BaseField {
  id: string;
  type: string;
  label?: string;
  help_text?: string;
  required?: boolean;
  conditional_display?: {
    show_if: string;
  };
}

export interface TextField extends BaseField {
  type: 'text' | 'email' | 'password';
  placeholder?: string;
  multiline?: boolean;
  rows?: number;
  mask?: string;
  validation?: {
    pattern?: string;
    error?: string;
    min_age?: number;
    max_age?: number;
    matches?: string;
  };
}

export interface NumberField extends BaseField {
  type: 'number';
  placeholder?: string;
  min?: number;
  max?: number;
  suffix?: string;
  validation?: {
    min?: number;
    max?: number;
    error?: string;
    greater_than_field?: { field: string; error: string };
    less_than_field?: { field: string; error: string };
  };
}

export interface SelectField extends BaseField {
  type: 'single_select' | 'multi_select';
  options: Option[];
  conditional_options?: {
    based_on: string;
    options_map: Record<string, Option[]>;
  };
}

export interface CheckboxField extends BaseField {
  type: 'checkbox';
}

export interface ConsentItemField extends BaseField {
  type: 'consent_item';
  links?: Link[];
}

export interface MedicationDetailsGroupField extends BaseField {
  type: 'medication_details_group';
  fields: FieldOrFieldGroup[];
}

export type Field =
  | TextField
  | NumberField
  | SelectField
  | CheckboxField
  | ConsentItemField
  | MedicationDetailsGroupField;

export type FieldOrFieldGroup = Field | Field[];

// Screen Types
export interface BaseScreen {
  id: string;
  title?: string;
  headline?: string;
  help_text?: string;
  body?: string;
}

export interface TextScreen extends BaseScreen {
  type: 'text';
  placeholder?: string;
  required?: boolean;
  validation?: {
    pattern?: string;
    error?: string;
    min_age?: number;
    max_age?: number;
  };
  mask?: string;
  min_today?: boolean;
  multiline?: boolean;
}

export interface NumberScreen extends BaseScreen {
  type: 'number';
  placeholder?: string;
  required?: boolean;
  suffix?: string;
  min?: number;
  max?: number;
}

export interface DateScreen extends BaseScreen {
  type: 'date';
  required?: boolean;
  min_today?: boolean;
}

export interface SingleSelectScreen extends BaseScreen {
  type: 'single_select';
  options: Option[];
  required?: boolean;
  auto_advance?: boolean;
  field_id?: string;
}

export interface MultiSelectScreen extends BaseScreen {
  type: 'multi_select';
  options: Option[];
  required?: boolean;
  label?: string;
  other_text_id?: string;
}

export interface CompositeScreen extends BaseScreen {
  type: 'composite';
  fields: FieldOrFieldGroup[];
  footer_note?: string;
  post_screen_note?: string;
  validation?: {
    max_currently_taking?: {
      fields: string[];
      limit: number;
      error: string;
    };
  };
}

export interface ConsentItem {
  id: string;
  label: string;
  required?: boolean;
  links?: Link[];
}

export interface ConsentScreen extends BaseScreen {
  type: 'consent';
  items: ConsentItem[];
}

export interface TerminalScreen extends BaseScreen {
  type: 'terminal';
  status?: 'success' | 'warning';
  resources?: Array<{
    label: string;
    value: string;
    icon_name?: string;
  }>;
  next_steps?: Array<{
    label: string;
    icon?: string;
    icon_name?: string;
  }>;
  cta_primary?: {
    label: string;
    url: string;
    open_in_new_tab?: boolean;
  };
  links?: Link[];
}

export interface ReviewScreen extends BaseScreen {
  type: 'review';
}

export interface MedicationPreferenceScreen extends BaseScreen {
  type: 'medication_preference';
  required?: boolean;
}

export interface PlanSelectionExpandedScreen extends BaseScreen {
  type: 'plan_selection_expanded';
  required?: boolean;
}

export type Screen =
  | TextScreen
  | NumberScreen
  | DateScreen
  | SingleSelectScreen
  | MultiSelectScreen
  | CompositeScreen
  | ConsentScreen
  | TerminalScreen
  | ReviewScreen
  | MedicationPreferenceScreen
  | PlanSelectionExpandedScreen
  | BaseScreen;
