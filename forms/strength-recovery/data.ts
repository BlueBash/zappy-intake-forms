import { FormConfig } from '../../types';

const formConfig: FormConfig = {
  "default_condition": "Strength Recovery",
  "meta": {
    "product": "Strength Recovery Program",
    "form_name": "Strength Recovery Assessment",
    "version": "1.0.0",
    "language": "en-US"
  },
  "settings": {
    "theme": {
      "primary_hex": "#4f46e5",
      "accent_hex": "#22d3ee",
      "secondary_hex": "#6b7280",
      "font_stack": "\"Nunito Sans\", sans-serif",
      "background_hex": "#f8fafc",
      "selection_states": {
        "hover_hex": "#e0e7ff",
        "active_hex": "#4f46e5",
        "selected_hex": "#4338ca",
        "border_selected_hex": "#3730a3"
      },
      "lavender_accent": "#E8E7F3",
      "lavender_primary": "#8B7FC5"
    },
    "progress_bar": true,
    "show_back_button": true,
    "autosave_ms": 800,
    "show_phase_indicator": true
  },
  "screens": [
    // INTRO
    {
      "id": "welcome",
      "type": "content",
      "phase": "intro",
      "headline": "Welcome! Let's build your strength recovery plan.",
      "body": "We'll ask about your goals, health, and daily routine so we can tailor a recovery program that safely supports you. Takes about 10 minutes.",
      "cta_primary": {
        "label": "Let's Begin"
      },
      "next": "demographics.state"
    },
    {
      "id": "demographics.state",
      "type": "single_select",
      "phase": "intake",
      "title": "Which state do you live in?",
      "auto_advance": false,
      "options": [],
      "required": true,
      "next": "sr.medical_allergies"
    },

    // MEDICAL HISTORY
    {
      "id": "sr.medical_allergies",
      "type": "text",
      "phase": "intake",
      "title": "Medication Allergies",
      "help_text": "Example: 'Penicillin'",
      "placeholder": "List any medication allergies",
      "next": "sr.health_conditions"
    },
    {
      "id": "sr.health_conditions",
      "type": "multi_select",
      "phase": "intake",
      "title": "Relevant Health Conditions",
      "help_text": "Select all that apply to you.",
      "required": true,
      "options": [
        { "value": "cardiovascular_disease", "label": "Cardiovascular disease" },
        { "value": "high_cholesterol", "label": "High cholesterol" },
        { "value": "osteoporosis", "label": "Osteoporosis or bone density issues" },
        { "value": "cognitive_decline", "label": "Cognitive decline or Alzheimer's" },
        { "value": "hormonal_imbalance", "label": "Hormonal imbalances" },
        { "value": "type2_diabetes", "label": "Type 2 diabetes" },
        { "value": "high_blood_pressure", "label": "High blood pressure" },
        { "value": "cancer_history", "label": "Cancer treatment or history" },
        { "value": "none", "label": "None" }
      ],
      "next": "sr.other_conditions"
    },
    {
      "id": "sr.other_conditions",
      "type": "text",
      "phase": "intake",
      "title": "Other Medical Conditions & Surgeries",
      "help_text": "Include major conditions or surgeries relevant to long-term health. Example: 'Heart bypass surgery - 03/15/2010'.",
      "placeholder": "Add any additional medical history details",
      "next": "sr.current_medications"
    },
    {
      "id": "sr.current_medications",
      "type": "text",
      "phase": "intake",
      "title": "Current Medications & Dosages",
      "help_text": "Example: 'Omega-3 - 1000 mg daily'.",
      "placeholder": "List current medications and dosages",
      "next": "sr.recent_screenings"
    },
    {
      "id": "sr.recent_screenings",
      "type": "multi_select",
      "phase": "intake",
      "title": "Recent Health Screenings (past 12 months)",
      "help_text": "Select any screenings completed within the last year.",
      "required": true,
      "options": [
        { "value": "blood_pressure", "label": "Blood pressure check" },
        { "value": "cholesterol_panel", "label": "Cholesterol panel" },
        { "value": "vitamin_d", "label": "Vitamin D levels" },
        { "value": "bone_density", "label": "Bone density test" },
        { "value": "telomere_length", "label": "Telomere length test" },
        { "value": "other", "label": "Other relevant longevity markers" },
        { "value": "none", "label": "None" }
      ],
      "next_logic": [
        {
          "if": "answer contains 'other'",
          "go_to": "sr.recent_screenings_other"
        },
        {
          "else": "sr.exercise_routine"
        }
      ]
    },
    {
      "id": "sr.recent_screenings_other",
      "type": "text",
      "phase": "intake",
      "title": "Other Longevity Markers",
      "placeholder": "List any additional markers or tests",
      "required": true,
      "next": "sr.exercise_routine"
    },

    // LIFESTYLE
    {
      "id": "sr.exercise_routine",
      "type": "single_select",
      "phase": "intake",
      "title": "Exercise Routine",
      "help_text": "This helps us understand how movement fits into your day.",
      "required": true,
      "options": [
        { "value": "none", "label": "I do not exercise at all" },
        { "value": "light", "label": "Light exercising (1-2 days/week)" },
        { "value": "moderate", "label": "Moderate exercising (3-4 days/week)" },
        { "value": "heavy", "label": "Heavy exercising (5+ days/week)" },
        { "value": "other", "label": "Other" }
      ],
      "next_logic": [
        {
          "if": "answer == 'other'",
          "go_to": "sr.exercise_other"
        },
        {
          "else": "sr.nutritional_focus"
        }
      ]
    },
    {
      "id": "sr.exercise_other",
      "type": "text",
      "phase": "intake",
      "title": "Tell us more about your routine",
      "required": true,
      "next": "sr.nutritional_focus"
    },
    {
      "id": "sr.nutritional_focus",
      "type": "single_select",
      "phase": "intake",
      "title": "Nutritional Focus for Longevity",
      "required": true,
      "options": [
        { "value": "no_restrictions", "label": "I eat without restrictions" },
        { "value": "balanced", "label": "Balanced, heart-healthy diet" },
        { "value": "plant_based", "label": "Plant-based or anti-inflammatory diet" },
        { "value": "other", "label": "Other" }
      ],
      "next_logic": [
        {
          "if": "answer == 'other'",
          "go_to": "sr.nutritional_focus_other"
        },
        {
          "else": "sr.diet_history"
        }
      ]
    },
    {
      "id": "sr.nutritional_focus_other",
      "type": "text",
      "phase": "intake",
      "title": "Describe your nutrition approach",
      "required": true,
      "next": "sr.diet_history"
    },
    {
      "id": "sr.diet_history",
      "type": "text",
      "phase": "intake",
      "title": "Diet History & Experience",
      "help_text": "Example: 'Followed a Mediterranean diet for heart health, felt more energetic.'",
      "next": "sr.alcohol_consumption"
    },
    {
      "id": "sr.alcohol_consumption",
      "type": "single_select",
      "phase": "intake",
      "title": "Alcohol Consumption",
      "required": true,
      "options": [
        { "value": "none", "label": "No" },
        { "value": "moderate", "label": "Less than 7 drinks/week (women) or 14 (men)" },
        { "value": "high", "label": "More than 7 drinks/week (women) or 14 (men)" }
      ],
      "next": "sr.caffeine_intake"
    },
    {
      "id": "sr.caffeine_intake",
      "type": "single_select",
      "phase": "intake",
      "title": "Caffeine Intake",
      "required": true,
      "options": [
        { "value": "none", "label": "No caffeine" },
        { "value": "one_two", "label": "1-2 cups/day" },
        { "value": "three_four", "label": "3-4 cups/day" },
        { "value": "five_plus", "label": "5+ cups/day" },
        { "value": "other", "label": "Other" }
      ],
      "next_logic": [
        {
          "if": "answer == 'other'",
          "go_to": "sr.caffeine_details"
        },
        {
          "else": "sr.smoking_habits"
        }
      ]
    },
    {
      "id": "sr.caffeine_details",
      "type": "text",
      "phase": "intake",
      "title": "Tell us about your caffeine habits",
      "required": true,
      "next": "sr.smoking_habits"
    },
    {
      "id": "sr.smoking_habits",
      "type": "single_select",
      "phase": "intake",
      "title": "Smoking Habits",
      "required": true,
      "options": [
        { "value": "none", "label": "No" },
        { "value": "light", "label": "0-1 pack/day" },
        { "value": "heavy", "label": "More than 1 pack/day" }
      ],
      "next": "sr.sleep_hours"
    },
    {
      "id": "sr.sleep_hours",
      "type": "number",
      "phase": "intake",
      "title": "How many hours of sleep do you get per night (average)?",
      "required": true,
      "validation": {
        "min": 2,
        "max": 14,
        "error": "Enter hours between 2 and 14"
      },
      "next": "sr.medication_experience"
    },
    {
      "id": "sr.medication_experience",
      "type": "text",
      "phase": "intake",
      "title": "Medication Experience (if applicable)",
      "placeholder": "Share any experience with recovery or longevity therapies",
      "next": "sr.safety_intro"
    },

    // SAFETY
    {
      "id": "sr.safety_intro",
      "type": "content",
      "phase": "intake",
      "headline": "Safety screening for advanced therapies",
      "body": "Some therapies are not appropriate during pregnancy, active cancer treatment, or certain endocrine disorders.",
      "cta_primary": {
        "label": "Continue"
      },
      "next": "sr.safety_checklist"
    },
    {
      "id": "sr.safety_checklist",
      "type": "multi_select",
      "phase": "intake",
      "title": "Do any of the following apply to you?",
      "required": true,
      "options": [
        { "value": "pregnant", "label": "Currently pregnant or breastfeeding" },
        { "value": "minor", "label": "Child or adolescent" },
        { "value": "personal_cancer_history", "label": "Current or past personal history of cancer" },
        { "value": "active_cancer_treatment", "label": "Currently undergoing cancer treatment" },
        { "value": "organ_dysfunction", "label": "Severe organ dysfunction (kidney or liver disease)" },
        { "value": "critical_illness", "label": "Critical illness such as renal failure" },
        { "value": "recent_hospitalization", "label": "Recently hospitalized or surgery within past year" },
        { "value": "organ_transplant", "label": "History of organ transplant or on immunosuppressants" },
        { "value": "untreated_hypothyroidism", "label": "Uncontrolled or untreated hypothyroidism" },
        { "value": "critical_illness_general", "label": "Other critical illness (e.g., heart conditions, intracranial hypertension)" },
        { "value": "nad_allergy", "label": "Known hypersensitivity/allergy to NAD+" },
        { "value": "glutathione_allergy", "label": "Known hypersensitivity/allergy to Glutathione" },
        { "value": "sermorelin_allergy", "label": "Known hypersensitivity/allergy to Sermorelin" },
        { "value": "asthma", "label": "History of asthma or breathing difficulty" },
        { "value": "severe_sleep_apnea", "label": "Severe obstructive sleep apnea or untreated edema" },
        { "value": "g6pd", "label": "G6PD Deficiency" },
        { "value": "genetic_cancer_risk", "label": "Strong family history or genetic predisposition to cancer" },
        { "value": "intracranial_hypertension", "label": "Current or past intracranial hypertension" },
        { "value": "glucocorticoids", "label": "Currently taking glucocorticoids or somatostatin analogs" },
        { "value": "thyroid_condition", "label": "Thyroid condition or taking thyroid medication" },
        { "value": "none", "label": "I confirm that none of the above apply" }
      ],
      "next_logic": [
        {
          "if": "answer contains 'none'",
          "go_to": "sr.additional_health_details"
        },
        {
          "else": "sr.safety_details"
        }
      ]
    },
    {
      "id": "sr.safety_details",
      "type": "text",
      "phase": "intake",
      "title": "Tell us more about your condition(s)",
      "help_text": "Include relevant medical history, treatments, or instructions from your doctor.",
      "required": true,
      "next": "sr.additional_health_details"
    },
    {
      "id": "sr.additional_health_details",
      "type": "text",
      "phase": "intake",
      "title": "Any additional concerns or health details?",
      "placeholder": "Share anything else our clinical team should know",
      "next": "sr.supplements_intro"
    },

    // SUPPLEMENTS
    {
      "id": "sr.supplements_intro",
      "type": "content",
      "phase": "intake",
      "headline": "Tell us about supplements and preferences",
      "body": "Understanding your supplement history helps us recommend the right recovery tools.",
      "cta_primary": {
        "label": "Continue"
      },
      "next": "sr.supplements_used"
    },
    {
      "id": "sr.supplements_used",
      "type": "single_select",
      "phase": "intake",
      "title": "Have you used any supplements or peptides besides the medications mentioned earlier?",
      "required": true,
      "options": [
        { "value": "yes", "label": "Yes" },
        { "value": "no", "label": "No" }
      ],
      "next_logic": [
        {
          "if": "answer == 'yes'",
          "go_to": "sr.supplements_current"
        },
        {
          "else": "sr.supplement_preferences"
        }
      ]
    },
    {
      "id": "sr.supplements_current",
      "type": "single_select",
      "phase": "intake",
      "title": "Are you currently taking these supplements or peptides?",
      "required": true,
      "options": [
        { "value": "yes", "label": "Yes" },
        { "value": "no", "label": "No" }
      ],
      "next_logic": [
        {
          "if": "answer == 'yes'",
          "go_to": "sr.supplements_experience"
        },
        {
          "else": "sr.supplement_preferences"
        }
      ]
    },
    {
      "id": "sr.supplements_experience",
      "type": "text",
      "phase": "intake",
      "title": "Experience with longevity-focused supplements or medications",
      "help_text": "Include start dates, milestones, or how they made you feel.",
      "required": true,
      "next": "sr.supplement_conditions"
    },
    {
      "id": "sr.supplement_conditions",
      "type": "multi_select",
      "phase": "intake",
      "title": "Do any of the following conditions apply to you?",
      "required": true,
      "options": [
        { "value": "pregnant", "label": "Currently pregnant or breastfeeding" },
        { "value": "minor", "label": "Child or adolescent" },
        { "value": "personal_cancer_history", "label": "Current or past personal history of cancer" },
        { "value": "active_cancer_treatment", "label": "Currently undergoing cancer treatment" },
        { "value": "organ_dysfunction", "label": "Severe organ dysfunction (kidney or liver disease)" },
        { "value": "critical_illness", "label": "Critical illness such as renal failure" },
        { "value": "recent_hospitalization", "label": "Recently hospitalized or surgery within the past year" },
        { "value": "organ_transplant", "label": "History of organ transplant or on immunosuppressants" },
        { "value": "untreated_hypothyroidism", "label": "Uncontrolled or untreated hypothyroidism" },
        { "value": "critical_illness_general", "label": "Other critical illness (e.g., heart conditions, intracranial hypertension)" },
        { "value": "nad_allergy", "label": "Known hypersensitivity/allergy to NAD+" },
        { "value": "glutathione_allergy", "label": "Known hypersensitivity/allergy to Glutathione" },
        { "value": "sermorelin_allergy", "label": "Known hypersensitivity/allergy to Sermorelin" },
        { "value": "asthma", "label": "History of asthma or breathing difficulty" },
        { "value": "severe_sleep_apnea", "label": "Severe obstructive sleep apnea or untreated edema" },
        { "value": "g6pd", "label": "G6PD Deficiency" },
        { "value": "genetic_cancer_risk", "label": "Strong family history or genetic predisposition to cancer" },
        { "value": "intracranial_hypertension", "label": "Current or past intracranial hypertension" },
        { "value": "glucocorticoids", "label": "Currently taking glucocorticoids or somatostatin analogs" },
        { "value": "thyroid_condition", "label": "Thyroid condition or taking thyroid medication" },
        { "value": "none", "label": "I confirm that none of the above apply to me" }
      ],
      "next_logic": [
        {
          "if": "answer contains 'none'",
          "go_to": "sr.additional_notes"
        },
        {
          "else": "sr.supplement_condition_details"
        }
      ]
    },
    {
      "id": "sr.supplement_condition_details",
      "type": "text",
      "phase": "intake",
      "title": "Share details about the condition(s) you selected",
      "help_text": "Include relevant history, current treatments, or guidance from your provider.",
      "required": true,
      "next": "sr.additional_notes"
    },
    {
      "id": "sr.additional_notes",
      "type": "text",
      "phase": "intake",
      "title": "Any other concerns, medications, or conditions we should know about?",
      "placeholder": "Add anything else for our clinical team",
      "next": "treatment.medication_preference"
    },
    {
      "id": "treatment.medication_preference",
      "type": "multi_select",
      "phase": "treatment",
      "title": "Which therapies interest you?",
      "help_text": "Select a therapy to see availability for your state.",
      "service_type": "Strength Recovery",
      "required": true,
      "next": "treatment.plan_selection.generic"
    },
    {
      "id": "treatment.plan_selection.generic",
      "type": "single_select",
      "phase": "treatment",
      "title": "Choose your recovery plan",
      "help_text": "Plans and pricing are based on your selected therapy and state.",
      "service_type": "Strength Recovery",
      "auto_advance": true,
      "required": true,
      "next": "logistics.discount_code"
    },
    {
      "id": "logistics.discount_code",
      "type": "text",
      "phase": "treatment",
      "title": "Have a discount code?",
      "help_text": "Enter it below to apply it to your plan (optional).",
      "placeholder": "DISCOUNT20",
      "required": false,
      "next": "transition.final_section"
    },

    // LOGISTICS
    {
      "id": "transition.final_section",
      "type": "content",
      "phase": "treatment",
      "headline": "Almost there!",
      "body": "Just need your contact and shipping info, then you're all set. Our clinical team will review everything within 24 hours.",
      "cta_primary": {
        "label": "Finish Up"
      },
      "next": "logistics.contact_info"
    },
    {
      "id": "logistics.contact_info",
      "type": "composite",
      "phase": "treatment",
      "title": "Where can we reach you?",
      "fields": [
        [
          {
            "id": "first_name",
            "type": "text",
            "label": "First name",
            "required": true,
            "validation": {
              "pattern": "^[a-zA-Z\\s\-']{1,50}$",
              "error": "Enter a valid first name"
            }
          },
          {
            "id": "last_name",
            "type": "text",
            "label": "Last name",
            "required": true,
            "validation": {
              "pattern": "^[a-zA-Z\\s\-']{1,50}$",
              "error": "Enter a valid last name"
            }
          }
        ],
        {
          "id": "email",
          "type": "text",
          "label": "Email address",
          "placeholder": "you@example.com",
          "required": true,
          "validation": {
            "pattern": "^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$",
            "error": "Enter a valid email address"
          }
        },
        {
          "id": "phone",
          "type": "text",
          "label": "Phone number",
          "placeholder": "(555) 123-4567",
          "mask": "(###) ###-####",
          "required": true,
          "validation": {
            "pattern": "^\\(\\d{3}\\) \\d{3}-\\d{4}$",
            "error": "Enter a valid phone number"
          }
        }
      ],
      "next": "logistics.shipping_address"
    },
    {
      "id": "logistics.shipping_address",
      "type": "composite",
      "phase": "treatment",
      "title": "Where should we ship your medication?",
      "fields": [
        {
          "id": "address_line1",
          "type": "text",
          "label": "Street address",
          "placeholder": "123 Main Street",
          "required": true,
          "validation": {
            "pattern": "^[a-zA-Z0-9\\s,.-]{5,100}$",
            "error": "Enter a valid street address"
          }
        },
        {
          "id": "address_line2",
          "type": "text",
          "label": "Apt, suite, etc. (optional)",
          "placeholder": "Apt 4B",
          "validation": {
            "pattern": "^[a-zA-Z0-9\\s,.-]{0,50}$",
            "error": "Enter a valid apartment/suite"
          }
        },
        {
          "id": "city",
          "type": "text",
          "label": "City",
          "required": true,
          "validation": {
            "pattern": "^[a-zA-Z\\s\-']{2,50}$",
            "error": "Enter a valid city"
          }
        },
        [
          {
            "id": "state",
            "type": "single_select",
            "label": "State",
            "required": true,
            "options": []
          },
          {
            "id": "zip_code",
            "type": "text",
            "label": "ZIP",
            "placeholder": "12345",
            "mask": "#####",
            "required": true,
            "validation": {
              "pattern": "^\\d{5}$",
              "error": "Enter a valid 5-digit ZIP"
            }
          }
        ],
        {
          "id": "country",
          "type": "single_select",
          "label": "Country",
          "required": true,
          "options": [
            { "value": "united_states", "label": "United States" },
            { "value": "canada", "label": "Canada" },
            { "value": "other", "label": "Other" }
          ]
        }
      ],
      "next": "logistics.create_password"
    },
    {
      "id": "logistics.create_password",
      "type": "composite",
      "phase": "treatment",
      "title": "Create your account",
      "fields": [
        {
          "id": "password",
          "type": "password",
          "label": "Password",
          "placeholder": "At least 8 characters",
          "required": true,
          "validation": {
            "pattern": "^.{8,}$",
            "error": "Must be at least 8 characters"
          }
        },
        {
          "id": "password_confirm",
          "type": "password",
          "label": "Confirm password",
          "placeholder": "Re-enter password",
          "required": true,
          "validation": {
            "matches": "password",
            "error": "Passwords don't match"
          }
        },
        {
          "id": "all_consents",
          "type": "consent_item",
          "label": "By creating an account, I agree to the Terms of Service, Privacy Policy, Telehealth Consent, and HIPAA Authorization. I understand prescriptions are at provider discretion.",
          "links": [
            { "label": "Terms of Service", "url": "https://hybrid.com/terms" },
            { "label": "Privacy Policy", "url": "https://hybrid.com/privacy" },
            { "label": "Telehealth Consent", "url": "https://hybrid.com/telehealth" },
            { "label": "HIPAA Authorization", "url": "https://hybrid.com/hipaa" }
          ],
          "required": true
        },
        {
          "id": "notification_consent",
          "type": "consent_item",
          "label": "Send me helpful tips and updates",
          "required": false
        }
      ],
      "next": "review.summary"
    },
    {
      "id": "review.summary",
      "type": "review",
      "phase": "treatment",
      "title": "Does everything look right?",
      "help_text": "Review your answers before you submit so we can get started right away.",
      "next": "complete.success"
    },
    {
      "id": "complete.success",
      "type": "terminal",
      "phase": "treatment",
      "status": "success",
      "title": "You did it!",
      "body": "Thanks for trusting us with your health information. Here's what happens next:",
      "next_steps": [
        { "icon": "✓", "icon_name": "review", "label": "Clinician review (24 hrs)", "status": "pending" },
        { "icon": "→", "icon_name": "plan", "label": "Personalized recovery plan (48 hrs)", "status": "pending" },
        { "icon": "→", "icon_name": "journey", "label": "Begin your program", "status": "pending" }
      ],
      "cta_primary": {
        "label": "View Your Dashboard"
      }
    }
  ],
  "eligibility_rules": [],
  "provider_packet": {
    "include_fields": [
      "first_name",
      "last_name",
      "email",
      "phone",
      "address_line1",
      "address_line2",
      "city",
      "state",
      "zip_code",
      "country",
      "demographics.state",
      "sr.medical_allergies",
      "sr.health_conditions",
      "sr.other_conditions",
      "sr.current_medications",
      "sr.recent_screenings",
      "sr.recent_screenings_other",
      "sr.exercise_routine",
      "sr.nutritional_focus",
      "sr.diet_history",
      "sr.alcohol_consumption",
      "sr.caffeine_intake",
      "sr.smoking_habits",
      "sr.sleep_hours",
      "sr.medication_experience",
      "sr.safety_checklist",
      "sr.additional_health_details",
      "sr.supplements_used",
      "sr.supplements_current",
      "sr.supplements_experience",
      "sr.supplement_preferences",
      "sr.supplement_conditions",
      "sr.supplement_condition_details",
      "sr.additional_notes",
      "sr.referral_source",
      "selected_medication",
      "selected_plan",
      "selected_plan_details"
    ],
    "summary_template":
      "PATIENT: {first_name} {last_name} | Contact: {email}, {phone}\n" +
      "ADDRESS: {address_line1}, {city}, {state} {zip_code} {country}\n" +
      "MEDICAL: Allergies {sr.medical_allergies} | Conditions {sr.health_conditions} | Medications {sr.current_medications}\n" +
      "LIFESTYLE: Exercise {sr.exercise_routine} | Nutrition {sr.nutritional_focus} | Alcohol {sr.alcohol_consumption} | Sleep {sr.sleep_hours} hrs\n" +
      "SUPPLEMENTS: History {sr.supplements_used}/{sr.supplements_current} | Preferences {sr.supplement_preferences}",
    "risk_stratification": {
      "critical": [],
      "high": [],
      "medium": [],
      "review_required": []
    }
  }
};

export default formConfig;
