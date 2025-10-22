// Base types
export type ScreenType = 
  | 'content' 
  | 'single_select' 
  | 'multi_select' 
  | 'composite' 
  | 'text'
  | 'number'
  | 'date'
  | 'consent' 
  | 'review' 
  | 'terminal';

export type FieldType = 
  | 'text' 
  | 'email' 
  | 'password' 
  | 'number' 
  | 'single_select' 
  | 'multi_select'
  | 'checkbox'
  | 'consent_item'
  | 'medication_details_group';

export interface Option {
  value: string;
  label: string;
  risk_level?: string;
}

export interface Validation {
  pattern?: string;
  error?: string;
  min?: number;
  max?: number;
  min_age?: number;
  max_age?: number;
  less_than_field?: {
    field: string;
    error: string;
  };
  greater_than_field?: {
    field: string;
    error: string;
  };
  matches?: string;
}

export interface Link {
  label: string;
  url: string;
}

export interface ConsentItem {
  id: string;
  label: string;
  links?: Link[];
  required: boolean;
}

export interface Cta {
  label: string;
  url?: string;
  open_in_new_tab?: boolean;
}

export interface Calculation {
  id: string;
  formula: string;
}

export interface NextLogic {
  if?: string;
  go_to?: string;
  else?: string;
}

export interface ConditionalOptions {
  based_on: string;
  options_map: Record<string, Option[]>;
}

export interface ConditionalDisplay {
  show_if: string;
}

// Field types
export interface BaseField {
  id: string;
  type: FieldType;
  label: string;
  placeholder?: string;
  help_text?: string;
  required?: boolean;
  validation?: Validation;
  conditional_options?: ConditionalOptions;
  conditional_display?: ConditionalDisplay;
}

export interface TextField extends BaseField {
  type: 'text' | 'email' | 'password';
  mask?: string;
  multiline?: boolean;
  rows?: number;
}

export interface NumberField extends BaseField {
  type: 'number';
  min?: number;
  max?: number;
  suffix?: string;
  width?: string;
}

export interface SelectField extends BaseField {
  type: 'single_select' | 'multi_select';
  options: Option[];
  other_text_id?: string;
  risk_level?: string;
  auto_advance?: boolean;
}

export interface CheckboxField extends BaseField {
  type: 'checkbox';
  value?: boolean;
}

export interface ConsentItemField extends BaseField {
  type: 'consent_item';
  links?: Link[];
}

export interface MedicationDetailsGroupField extends BaseField {
  type: 'medication_details_group';
  fields: FieldOrFieldGroup[];
}

export type Field = TextField | NumberField | SelectField | CheckboxField | ConsentItemField | MedicationDetailsGroupField;

export type FieldOrFieldGroup = Field | Field[];

// Screen types
interface BaseScreen {
  id: string;
  type: ScreenType;
  phase?: string;
  next?: string;
  next_logic?: NextLogic[];
  calculations?: Calculation[];
  safety_critical?: boolean;
}

export interface ContentScreen extends BaseScreen {
  type: 'content';
  headline: string;
  body: string;
  image?: string;
  cta_primary: Cta;
  footer_note?: string;
  status?: 'warning' | 'success' | 'info';
  consent_items?: ConsentItem[];
}

export interface SingleSelectScreen extends BaseScreen {
  type: 'single_select';
  title: string;
  help_text?: string;
  auto_advance?: boolean;
  options?: Option[];
  required?: boolean;
  field_id?: string;
  safety_critical?: boolean;
}

export interface MultiSelectScreen extends BaseScreen {
  type: 'multi_select';
  title: string;
  help_text?: string;
  options?: Option[];
  other_text_id?: string;
  required?: boolean;
  safety_critical?: boolean;
}

export interface TextScreen extends BaseScreen {
  type: 'text';
  title: string;
  placeholder?: string;
  help_text?: string;
  mask?: string;
  validation?: Validation;
  required?: boolean;
  min_today?: boolean;
  // FIX: Added optional `multiline` property to support textarea inputs.
  multiline?: boolean;
  rows?: number;
}

export interface NumberScreen extends BaseScreen {
  type: 'number';
  title: string;
  help_text?: string;
  placeholder?: string;
  required?: boolean;
  suffix?: string;
  min?: number;
  max?: number;
  label?: string;
  validation?: Validation;
}

export interface DateScreen extends BaseScreen {
  type: 'date';
  title: string;
  help_text?: string;
  required?: boolean;
  min_today?: boolean;
  label?: string;
}

export interface CompositeScreenValidation {
  at_least_one_checked?: {
    fields: string[];
    error: string;
  };
  max_currently_taking?: {
    limit: number;
    fields: string[];
    error: string;
  };
}

export interface CompositeScreen extends BaseScreen {
  type: 'composite';
  title: string;
  help_text?: string;
  fields: FieldOrFieldGroup[];
  footer_note?: string;
  post_screen_note?: string;
  validation?: CompositeScreenValidation;
  safety_critical?: boolean;
}

export interface ConsentScreen extends BaseScreen {
  type: 'consent';
  title: string;
  items: ConsentItem[];
}

export interface ReviewScreen extends BaseScreen {
  type: 'review';
  title: string;
  help_text?: string;
  label?: string;
}

export interface TerminalResource {
  icon_name?: string;
  label: string;
  value: string;
}

export interface TerminalNextStep {
  icon?: string;
  icon_name?: string;
  label: string;
  status?: string;
}

export interface TerminalScreen extends BaseScreen {
  type: 'terminal';
  status: 'success' | 'warning';
  title: string;
  body: string;
  resources?: TerminalResource[];
  next_steps?: TerminalNextStep[];
  cta_primary?: Cta;
  links?: Link[];
}

export type Screen = 
  | ContentScreen 
  | SingleSelectScreen 
  | MultiSelectScreen 
  | TextScreen
  | NumberScreen
  | DateScreen
  | CompositeScreen 
  | ConsentScreen 
  | ReviewScreen 
  | TerminalScreen;

// Form configuration
export interface Theme {
  primary_hex: string;
  accent_hex: string;
  secondary_hex: string;
  font_stack: string;
  background_hex: string;
  selection_states?: {
    hover_hex: string;
    active_hex: string;
    selected_hex: string;
    border_selected_hex: string;
  };
  lavender_accent?: string;
  lavender_primary?: string;
}

export interface Settings {
  theme: Theme;
  progress_bar: boolean;
  show_back_button: boolean;
  autosave_ms: number;
  show_phase_indicator?: boolean;
}

export interface EligibilityRule {
  rule: string;
  if: string;
  action: string;
  severity?: string;
}

export interface ProviderPacket {
  include_fields: string[];
  summary_template: string;
  risk_stratification?: Record<string, string[]>;
}

export interface Meta {
  product: string;
  form_name: string;
  version: string;
  language: string;
}

export interface FormConfig {
  meta: Meta;
  settings: Settings;
  screens: Screen[];
  eligibility_rules: EligibilityRule[];
  provider_packet: ProviderPacket;
  default_condition?: string;
}
