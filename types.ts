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
  | 'multi_select';

export interface Option {
  value: string;
  label: string;
}

export interface Validation {
  pattern: string;
  error: string;
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
}

export interface NumberField extends BaseField {
  type: 'number';
  min?: number;
  max?: number;
  suffix?: string;
}

export interface SelectField extends BaseField {
  type: 'single_select' | 'multi_select';
  options: Option[];
  other_text_id?: string;
}

export type Field = TextField | NumberField | SelectField;

export type FieldOrFieldGroup = Field | Field[];

// Screen types
interface BaseScreen {
  id: string;
  type: ScreenType;
  next?: string;
  next_logic?: NextLogic[];
  calculations?: Calculation[];
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
  options: Option[];
  required?: boolean;
}

export interface MultiSelectScreen extends BaseScreen {
  type: 'multi_select';
  title: string;
  help_text?: string;
  options: Option[];
  other_text_id?: string;
  required?: boolean;
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
}

export interface DateScreen extends BaseScreen {
  type: 'date';
  title: string;
  help_text?: string;
  required?: boolean;
  min_today?: boolean;
}

export interface CompositeScreen extends BaseScreen {
  type: 'composite';
  title: string;
  help_text?: string;
  fields: FieldOrFieldGroup[];
  footer_note?: string;
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
}

export interface TerminalScreen extends BaseScreen {
  type: 'terminal';
  status: 'success' | 'warning';
  title: string;
  body: string;
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
}

export interface Settings {
  theme: Theme;
  progress_bar: boolean;
  show_back_button: boolean;
  autosave_ms: number;
}

export interface EligibilityRule {
  rule: string;
  if: string;
  action: string;
}

export interface ProviderPacket {
  include_fields: string[];
  summary_template: string;
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
}