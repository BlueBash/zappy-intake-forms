import { FormConfig } from '../../types';

const formConfig: FormConfig = {
  "default_condition": "Weight Loss",
  "meta": {
    "product": "Physician-Guided Weight Management",
    "form_name": "Health Assessment & Eligibility",
    "version": "5.5.0",
    "language": "en-US"
  },
  "settings": {
    "theme": {
      "primary_hex": "#10b981",
      "accent_hex": "#34d399",
      "secondary_hex": "#78716c",
      "font_stack": "\"Nunito Sans\", sans-serif",
      "background_hex": "#ffffff",
      "selection_states": {
        "hover_hex": "#d1fae5",
        "active_hex": "#10b981",
        "selected_hex": "#059669",
        "border_selected_hex": "#047857"
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
    // ═══════════════════════════════════════════════════════════
    // PHASE 1: QUICK QUALIFY
    // ═══════════════════════════════════════════════════════════
    {
      "id": "goal.range",
      "type": "single_select",
      "phase": "qualify",
      "title": "How much weight would you like to lose?",
      "auto_advance": true,
      "options": [
        { "value": "1-15", "label": "1–15 lb" },
        { "value": "16-30", "label": "16–30 lb" },
        { "value": "31-50", "label": "31–50 lb" },
        { "value": "50+", "label": "More than 50 lb" },
        { "value": "not_sure", "label": "Still figuring it out" }
      ],
      "required": true,
      "next": "goal.motivations"
    },
    {
      "id": "goal.motivations",
      "type": "multi_select",
      "phase": "qualify",
      "title": "Which of these goals are important to you?",
      "help_text": "This helps us personalize your experience",
      "options": [
        { "value": "lose_weight", "label": "Lose weight and keep it off" },
        { "value": "boost_energy", "label": "Boost energy and feel better" },
        { "value": "improve_health", "label": "Improve overall health" },
        { "value": "regain_confidence", "label": "Regain confidence" },
        { "value": "none", "label": "None of these" },
        { "value": "other", "label": "Other" }
      ],
      "other_text_id": "goal_motivations_other",
      "required": true,
      "next": "goal.challenges"
    },
    {
      "id": "goal.challenges",
      "type": "multi_select",
      "phase": "qualify",
      "title": "What are your biggest challenges?",
      "help_text": "Understanding your obstacles helps us support you better",
      "options": [
        { "value": "cravings", "label": "Controlling cravings and hunger" },
        { "value": "time", "label": "Finding time to exercise" },
        { "value": "motivation", "label": "Staying motivated" },
        { "value": "plateaus", "label": "Breaking through plateaus" },
        { "value": "consistency", "label": "Being consistent" },
        { "value": "none", "label": "None of these" },
        { "value": "other", "label": "Other" }
      ],
      "other_text_id": "goal_challenges_other",
      "required": true,
      "next": "demographics.state"
    },
    {
      "id": "demographics.state",
      "type": "single_select",
      "phase": "qualify",
      "title": "Which state do you live in?",
      "help_text": "This helps us determine medication availability in your area.",
      "auto_advance": false,
      "options": [],
      "required": true,
      "next": "demographics.dob"
    },
    {
      "id": "demographics.dob",
      "type": "text",
      "phase": "qualify",
      "title": "When were you born?",
      "help_text": "We need this to determine if you're eligible for treatment",
      "placeholder": "MM/DD/YYYY",
      "mask": "##/##/####",
      "required": true,
      "validation": {
        "pattern": "^(0[1-9]|1[0-2])\\/(0[1-9]|[12][0-9]|3[01])\\/(19|20)\\d{2}$",
        "error": "Enter date as MM/DD/YYYY",
        "min_age": 12,
        "max_age": 90
      },
      "calculations": [
        {
          "id": "age",
          "formula": "AGE(demographics.dob)"
        }
      ],
      "next_logic": [
        {
          "if": "calc.age < 12",
          "go_to": "qualify.age_exclusion"
        },
        {
          "if": "calc.age > 90",
          "go_to": "qualify.age_exclusion"
        },
        {
          "if": "calc.age < 18",
          "go_to": "qualify.parental_consent"
        },
        {
          "else": "assess.body_measurements"
        }
      ]
    },
    {
      "id": "qualify.age_exclusion",
      "type": "terminal",
      "phase": "qualify",
      "status": "warning",
      "title": "Thanks for your interest",
      "body": "Our program is designed for ages 12-90, where GLP-1s are FDA-approved and thoroughly studied.\n\nYour doctor can help you find weight management options that are right for you. We appreciate you taking the time today.",
      "cta_primary": {
        "label": "Learn More"
      }
    },

    // ═══════════════════════════════════════════════════════════
    // PARENTAL CONSENT BRANCH
    // ═══════════════════════════════════════════════════════════
    {
      "id": "qualify.parental_consent",
      "type": "composite",
      "phase": "qualify",
      "title": "We'll need a parent or guardian to consent",
      "fields": [
        {
          "id": "parent_name",
          "type": "text",
          "label": "Parent or guardian's full name",
          "required": true,
          "validation": {
            "pattern": "^[a-zA-Z\\s\\-']{2,100}$",
            "error": "Enter a valid name"
          }
        },
        {
          "id": "parental_consent_agreement",
          "type": "consent_item",
          "label": "I'm the parent or legal guardian and I consent to this program. I've read the Terms of Service, Privacy Policy, and Telehealth Consent.",
          "required": true,
          "links": [
            { "label": "Terms of Service", "url": "https://hybrid.com/terms" },
            { "label": "Privacy Policy", "url": "https://hybrid.com/privacy" },
            { "label": "Telehealth Consent", "url": "https://hybrid.com/telehealth" }
          ]
        }
      ],
      "next": "transition.parent_consent_complete"
    },
    {
      "id": "transition.parent_consent_complete",
      "type": "content",
      "phase": "qualify",
      "headline": "Perfect—thank you!",
      "body": "Now let's get some baseline health information to understand where you're starting from.",
      "cta_primary": {
        "label": "Continue"
      },
      "next": "assess.body_measurements"
    },

    // ═══════════════════════════════════════════════════════════
    // BODY DATA & GOALS
    // ═══════════════════════════════════════════════════════════
    {
      "id": "assess.body_measurements",
      "type": "composite",
      "phase": "qualify",
      "title": "What's your height and weight?",
      "post_screen_note": "Thanks for sharing. This helps us understand your starting point.",
      "fields": [
        [
          {
            "id": "height_ft",
            "type": "number",
            "label": "Height (feet)",
            "required": true,
            "min": 3,
            "max": 8,
            "width": "half",
            "validation": {
              "min": 3,
              "max": 8,
              "error": "Enter height between 3-8 feet"
            }
          },
          {
            "id": "height_in",
            "type": "number",
            "label": "Height (inches)",
            "required": true,
            "min": 0,
            "max": 11,
            "width": "half",
            "validation": {
              "min": 0,
              "max": 11,
              "error": "Enter inches between 0-11"
            }
          }
        ],
        {
          "id": "weight",
          "type": "number",
          "label": "Current weight (lb)",
          "min": 70,
          "max": 700,
          "required": true,
          "validation": {
            "min": 70,
            "max": 700,
            "error": "Enter weight between 70-700 lbs",
            "less_than_field": {
              "field": "highest_weight",
              "error": "Current weight cannot be higher than your highest weight"
            }
          }
        },
        {
          "id": "highest_weight",
          "type": "number",
          "label": "What was your highest weight?",
          "help_text": "This helps us understand your journey",
          "min": 70,
          "max": 700,
          "required": true,
          "validation": {
            "min": 70,
            "max": 700,
            "error": "Enter weight between 70-700 lbs",
            "greater_than_field": {
              "field": "weight",
              "error": "Highest weight must be greater than or equal to current weight"
            }
          }
        }
      ],
      "calculations": [
        {
          "id": "bmi",
          "formula": "703 * weight / ((height_ft * 12 + height_in) ** 2)"
        }
      ],
      "next_logic": [
        {
          "if": "calc.bmi < 19",
          "go_to": "assess.bmi_too_low"
        },
        {
          "if": "calc.bmi < 27",
          "go_to": "assess.bmi_borderline"
        },
        {
          "else": "assess.goal_weight"
        }
      ]
    },
    {
      "id": "assess.bmi_too_low",
      "type": "terminal",
      "phase": "assess_safety",
      "status": "warning",
      "title": "Your weight is in a healthy range",
      "body": "Your BMI is ${calc.bmi}. GLP-1 medications are approved for BMI 27+ (with health conditions) or 30+.\n\nIf you have concerns about your weight, your doctor can help you explore safe approaches.",
      "cta_primary": {
        "label": "Learn More"
      }
    },
    {
      "id": "assess.bmi_borderline",
      "type": "content",
      "phase": "qualify",
      "status": "info",
      "headline": "We'll look at your full health picture",
      "body": "Your BMI is ${calc.bmi}. GLP-1 medications are typically recommended for:\n• BMI 30 or higher, or\n• BMI 27+ with weight-related health conditions (diabetes, high blood pressure, sleep apnea)\n\nOur provider will review your complete profile to see if medication makes sense for you.",
      "cta_primary": {
        "label": "Got It"
      },
      "next": "assess.goal_weight"
    },
    {
      "id": "assess.goal_weight",
      "type": "number",
      "phase": "qualify",
      "title": "What's your goal weight?",
      "help_text": "A rough estimate is fine",
      "label": "Target weight",
      "suffix": "lb",
      "min": 80,
      "max": 500,
      "required": true,
      "validation": {
        "min": 80,
        "max": 500,
        "error": "Enter weight between 80-500 lbs",
        "less_than_field": {
          "field": "weight",
          "error": "Goal weight must be less than your current weight"
        }
      },
      "next": "interstitial.success"
    },

    {
      "id": "interstitial.success",
      "type": "interstitial",
      "phase": "qualify",
      "variant": "stat_success",
      "next": "capture.email"
    },

    // ═══════════════════════════════════════════════════════════
    // EARLY EMAIL CAPTURE
    // ═══════════════════════════════════════════════════════════
    {
      "id": "capture.email",
      "type": "composite",
      "phase": "qualify",
      "title": "Let's find which treatments work for you",
      "fields": [
        {
          "id": "email",
          "type": "email",
          "label": "Email address",
          "placeholder": "john.doe@zappyhealth.com",
          "help_text": "We'll send your personalized plan here—no spam, just what matters",
          "required": true,
          "validation": {
            "pattern": "^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$",
            "error": "Enter a valid email address"
          }
        }
      ],
      "next": "transition.health_questions"
    },

    {
      "id": "transition.health_questions",
      "type": "content",
      "phase": "qualify",
      "headline": "Great progress! Let's build your health profile",
      "body": "Next up: a quick health assessment to make sure we find the safest, most effective treatment for you.\n\nThink of this as your personal roadmap—every answer helps us personalize your care.",
      "cta_primary": {
        "label": "Continue"
      },
      "next": "assess.sex_birth"
    },

    // ═══════════════════════════════════════════════════════════
    // PHASE 3: ASSESS HEALTH
    // ═══════════════════════════════════════════════════════════
    {
      "id": "assess.sex_birth",
      "type": "single_select",
      "phase": "assess_medical",
      "field_id": "sex_birth",
      "title": "What was your sex assigned at birth?",
      "auto_advance": true,
      "required": true,
      "options": [
        { "value": "male", "label": "Male" },
        { "value": "female", "label": "Female" },
        { "value": "intersex", "label": "Intersex" },
        { "value": "no_say", "label": "Prefer not to say" }
      ],
      "next": "assess.ethnicity"
    },
    {
      "id": "assess.ethnicity",
      "type": "single_select",
      "phase": "assess_medical",
      "field_id": "ethnicity",
      "title": "How would you describe your ethnicity?",
      "help_text": "Optional—helps us understand medication effects across different backgrounds",
      "auto_advance": true,
      "options": [
        { "value": "asian", "label": "Asian" },
        { "value": "black", "label": "Black or African American" },
        { "value": "hispanic", "label": "Hispanic or Latino" },
        { "value": "indigenous", "label": "Indigenous or Native American" },
        { "value": "middle_eastern", "label": "Middle Eastern" },
        { "value": "pacific_islander", "label": "Pacific Islander" },
        { "value": "white", "label": "White" },
        { "value": "multiple", "label": "Multiple ethnicities" },
        { "value": "other", "label": "Other" },
        { "value": "prefer_not_say", "label": "Prefer not to say" }
      ],
      "next": "assess.mental_health"
    },

    // Mental Health Cluster
    {
      "id": "assess.mental_health",
      "type": "composite",
      "phase": "assess_safety",
      "title": "Have you been diagnosed with any of these?",
      "help_text": "Some medications can affect mood, so we ask for safety",
      "safety_critical": true,
      "post_screen_note": "We appreciate your honesty. This helps us provide the safest care.",
      "fields": [
        {
          "id": "mental_health_diagnosis",
          "type": "multi_select",
          "label": "Mental health conditions",
          "options": [
            { "value": "depression", "label": "Depression" },
            { "value": "anxiety", "label": "Anxiety disorder" },
            { "value": "bipolar", "label": "Bipolar disorder" },
            { "value": "panic", "label": "Panic disorder" },
            { "value": "ptsd", "label": "PTSD" },
            { "value": "ocd", "label": "OCD" },
            { "value": "other", "label": "Other" },
            { "value": "none", "label": "None of these" }
          ]
        },
        {
          "id": "mental_health_other",
          "type": "text",
          "label": "Please specify",
          "placeholder": "Other mental health condition",
          "required": true,
          "conditional_display": {
            "show_if": "mental_health_diagnosis contains 'other'"
          }
        }
      ],
      "next": "assess.mental_health_ideation"
    },
    {
      "id": "assess.mental_health_ideation",
      "type": "single_select",
      "phase": "assess_safety",
      "field_id": "current_thoughts",
      "title": "Are you having thoughts of harming yourself or others right now?",
      "help_text": "This is a critical safety question.",
      "safety_critical": true,
      "auto_advance": true,
      "options": [
        { "value": "no", "label": "No" },
        { "value": "yes", "label": "Yes" }
      ],
      "required": true,
      "next_logic": [
        {
          "if": "answer == 'yes'",
          "go_to": "assess.mental_health_crisis"
        },
        {
          "else": "assess.eating_relationship"
        }
      ]
    },
    {
      "id": "assess.mental_health_crisis",
      "type": "terminal",
      "phase": "assess_safety",
      "status": "warning",
      "title": "Your safety comes first",
      "body": "Your safety comes first. Weight loss medications can affect mood, so we need you to get support before continuing.\n\nWe care about you and want you to get the support you deserve.\n\n**Please reach out now:**",
      "resources": [
        {
          "icon_name": "phone",
          "label": "988 Crisis Lifeline (24/7)",
          "value": "Call or text 988"
        },
        {
          "icon_name": "message",
          "label": "Crisis Text Line",
          "value": "Text HELLO to 741741"
        }
      ],
      "cta_primary": {
        "label": "Find Support"
      }
    },

    // Eating Disorder Screening
    {
      "id": "assess.eating_relationship",
      "type": "single_select",
      "phase": "assess_safety",
      "title": "Have you been diagnosed with an eating disorder?",
      "safety_critical": true,
      "auto_advance": true,
      "options": [
        { "value": "no", "label": "No" },
        { "value": "yes", "label": "Yes" }
      ],
      "required": true,
      "next_logic": [
        {
          "if": "answer == 'yes'",
          "go_to": "assess.eating_disorder_type"
        },
        {
          "else": "transition.lifestyle_questions"
        }
      ]
    },
    {
      "id": "assess.eating_disorder_type",
      "type": "multi_select",
      "phase": "assess_safety",
      "title": "Which type?",
      "safety_critical": true,
      "options": [
        { "value": "anorexia", "label": "Anorexia nervosa" },
        { "value": "bulimia", "label": "Bulimia nervosa" },
        { "value": "binge_eating", "label": "Binge eating disorder" },
        { "value": "other", "label": "Other or unspecified" }
      ],
      "required": true,
      "next_logic": [
        {
          "if": "answer contains 'anorexia' OR answer contains 'bulimia'",
          "go_to": "assess.eating_disorder_exclusion"
        },
        {
          "else": "assess.eating_disorder_support"
        }
      ]
    },
    {
      "id": "assess.eating_disorder_exclusion",
      "type": "terminal",
      "phase": "assess_safety",
      "status": "warning",
      "title": "We can't safely prescribe GLP-1 medications",
      "body": "We can't safely prescribe GLP-1 medications with anorexia or bulimia history, as they can cause serious harm.\n\nYour recovery is what matters most. An eating disorder specialist can guide you to approaches that support your health.\n\nWe're rooting for you.\n\n**Support:**",
      "resources": [
        {
          "icon_name": "phone",
          "label": "NEDA Helpline",
          "value": "1-800-931-2237"
        },
        {
          "icon_name": "message",
          "label": "NEDA Crisis Text",
          "value": "Text NEDA to 741741"
        }
      ],
      "cta_primary": {
        "label": "Find Support"
      }
    },
    {
      "id": "assess.eating_disorder_support",
      "type": "content",
      "phase": "assess_safety",
      "status": "warning",
      "headline": "We'll need to review this carefully",
      "body": "Eating disorder history comes with risks: electrolyte imbalances, worsening behaviors, cardiac complications.\n\nOur provider will review your case and may require clearance from an eating disorder specialist.\n\nSupport: NEDA 1-800-931-2237 | Text NEDA to 741741",
      "cta_primary": {
        "label": "Continue"
      },
      "next": "transition.lifestyle_questions"
    },
    {
      "id": "transition.lifestyle_questions",
      "type": "content",
      "phase": "assess_medical",
      "headline": "A few quick lifestyle questions",
      "body": "These help us understand your overall health and any factors that might affect treatment.",
      "cta_primary": {
        "label": "Let's Go"
      },
      "next": "assess.substance_use_alcohol"
    },

    {
      "id": "assess.substance_use_alcohol",
      "type": "single_select",
      "phase": "assess_medical",
      "title": "How often do you drink alcohol?",
      "auto_advance": true,
      "required": true,
      "options": [
        { "value": "none", "label": "I don't drink" },
        { "value": "occasional", "label": "Occasionally (1-2 drinks/week)" },
        { "value": "social", "label": "Socially (3-6 drinks/week)" },
        { "value": "moderate", "label": "Moderate (7-10 drinks/week)" },
        { "value": "heavy", "label": "Heavy (10+ drinks/week)" }
      ],
      "next": "assess.substance_use_tobacco"
    },
    {
      "id": "assess.substance_use_tobacco",
      "type": "single_select",
      "phase": "assess_medical",
      "title": "Do you use tobacco or nicotine?",
      "auto_advance": true,
      "required": true,
      "options": [
        { "value": "no", "label": "No" },
        { "value": "cigarettes", "label": "Cigarettes" },
        { "value": "vaping", "label": "Vaping or e-cigarettes" },
        { "value": "other", "label": "Other tobacco products" }
      ],
      "next": "assess.substance_use_recreational"
    },
    {
      "id": "assess.substance_use_recreational",
      "type": "multi_select",
      "phase": "assess_medical",
      "title": "Used any of these in the past 6 months?",
      "options": [
        { "value": "cannabis", "label": "Cannabis or marijuana" },
        { "value": "cocaine", "label": "Cocaine" },
        { "value": "opioids", "label": "Non-prescribed opioids" },
        { "value": "stimulants", "label": "Non-prescribed stimulants (Adderall, etc.)" },
        { "value": "methamphetamine", "label": "Methamphetamine" },
        { "value": "none", "label": "None of these" }
      ],
      "required": true,
      "next": "transition.medical_history"
    },
    {
      "id": "transition.medical_history",
      "type": "content",
      "phase": "assess_medical",
      "headline": "You're doing great—almost through this section!",
      "body": "Just a few more questions about your medical history, then we'll talk about treatment options.",
      "cta_primary": {
        "label": "Continue"
      },
      "next": "assess.diabetes"
    },

    // Medical Conditions Cluster
    {
      "id": "assess.diabetes",
      "type": "single_select",
      "phase": "assess_medical",
      "title": "Do you have diabetes?",
      "auto_advance": true,
      "options": [
        { "value": "no", "label": "No" },
        { "value": "yes", "label": "Yes" }
      ],
      "required": true,
      "next_logic": [
        {
          "if": "answer == 'yes'",
          "go_to": "assess.diabetes_type"
        },
        {
          "if": "sex_birth == 'female'",
          "go_to": "assess.pregnancy"
        },
        {
          "else": "assess.medical_conditions"
        }
      ]
    },
    {
      "id": "assess.diabetes_type",
      "type": "single_select",
      "phase": "assess_medical",
      "title": "What type?",
      "auto_advance": false,
      "options": [
        { "value": "type1", "label": "Type 1" },
        { "value": "type2", "label": "Type 2" },
        { "value": "prediabetes", "label": "Prediabetes" },
        { "value": "not_sure", "label": "Not sure" }
      ],
      "required": true,
      "next_logic": [
        {
          "if": "answer == 'type1'",
          "go_to": "assess.type1_denial"
        },
        {
          "if": "sex_birth == 'female'",
          "go_to": "assess.pregnancy"
        },
        {
          "else": "assess.medical_conditions"
        }
      ]
    },
    {
      "id": "assess.type1_denial",
      "type": "terminal",
      "phase": "assess_safety",
      "status": "warning",
      "title": "Type 1 needs specialized care",
      "body": "GLP-1s aren't FDA-approved for Type 1 and need very careful coordination with your endocrinologist.\n\nYour diabetes provider can help you explore whether GLP-1s might work for you and what monitoring you'd need.",
      "cta_primary": {
        "label": "I Understand"
      }
    },
    {
      "id": "assess.pregnancy",
      "type": "single_select",
      "phase": "assess_safety",
      "title": "Are you pregnant, trying to conceive, or nursing?",
      "auto_advance": true,
      "options": [
        { "value": "no", "label": "No" },
        { "value": "pregnant", "label": "Currently pregnant" },
        { "value": "trying", "label": "Trying to conceive or planning to soon" },
        { "value": "nursing", "label": "Currently breastfeeding" }
      ],
      "required": true,
      "next_logic": [
        {
          "if": "answer == 'pregnant'",
          "go_to": "assess.pregnancy_stop_pregnant"
        },
        {
          "if": "answer == 'trying'",
          "go_to": "assess.pregnancy_stop_trying"
        },
        {
          "if": "answer == 'nursing'",
          "go_to": "assess.pregnancy_stop_nursing"
        },
        {
          "else": "assess.medical_conditions"
        }
      ]
    },
    {
      "id": "assess.pregnancy_stop_pregnant",
      "type": "terminal",
      "phase": "assess_safety",
      "status": "warning",
      "title": "We'd love to help you after pregnancy",
      "body": "GLP-1s aren't safe during pregnancy, when trying to conceive, or while breastfeeding.\n\nWhen you are no longer pregnant, we'd be happy to work with you. In the meantime, your OB-GYN can help you explore safe options.",
      "cta_primary": {
        "label": "Return to Zappy Health",
        "url": "https://zappyhealth.com"
      }
    },
    {
      "id": "assess.pregnancy_stop_trying",
      "type": "terminal",
      "phase": "assess_safety",
      "status": "warning",
      "title": "Pause while you're trying to conceive",
      "body": "GLP-1s aren't safe when you're actively trying to get pregnant.\n\nOnce you're no longer trying to conceive or have delivered, we'd be happy to work with you. Your OB-GYN can help you plan the right timing.",
      "cta_primary": {
        "label": "Return to Zappy Health",
        "url": "https://zappyhealth.com"
      }
    },
    {
      "id": "assess.pregnancy_stop_nursing",
      "type": "terminal",
      "phase": "assess_safety",
      "status": "warning",
      "title": "Pause while you're breastfeeding",
      "body": "GLP-1s aren't recommended while breastfeeding.\n\nWhen you are no longer breastfeeding, we'd be happy to work with you. Your care team can help you plan the right timing.",
      "cta_primary": {
        "label": "Return to Zappy Health",
        "url": "https://zappyhealth.com"
      }
    },
    {
      "id": "assess.medical_conditions",
      "type": "multi_select",
      "phase": "assess_medical",
      "title": "Now, your medical history",
      "help_text": "Check all that apply",
      "options": [
        { 
          "value": "thyroid_cancer", 
          "label": "Medullary thyroid cancer (personal or family)",
          "risk_level": "critical"
        },
        { 
          "value": "men2", 
          "label": "MEN2 syndrome",
          "risk_level": "critical"
        },
        { 
          "value": "pancreatitis", 
          "label": "Pancreatitis (ever)",
          "risk_level": "high"
        },
        { 
          "value": "gallbladder_active", 
          "label": "Current gallbladder disease or gallstones",
          "risk_level": "high"
        },
        { 
          "value": "gastroparesis", 
          "label": "Gastroparesis (slow stomach emptying)"
        },
        { "value": "kidney_disease", "label": "Kidney disease" },
        { "value": "liver_disease", "label": "Liver disease" },
        { "value": "heart_disease", "label": "Heart disease or heart attack" },
        { "value": "stroke", "label": "Stroke or TIA" },
        { "value": "hypertension", "label": "High blood pressure" },
        { "value": "high_cholesterol", "label": "High cholesterol" },
        { "value": "sleep_apnea", "label": "Sleep apnea" },
        { "value": "pcos", "label": "PCOS" },
        { "value": "thyroid_other", "label": "Thyroid condition (not cancer)" },
        { "value": "gerd", "label": "GERD or chronic reflux" },
        { "value": "ibs", "label": "IBS or chronic digestive issues" },
        { "value": "autoimmune", "label": "Autoimmune condition" },
        { "value": "cancer_other", "label": "Other cancer history" },
        { "value": "none", "label": "None of these" },
        { "value": "other", "label": "Other condition" }
      ],
      "other_text_id": "medical_conditions_other",
      "next_logic": [
        {
          "if": "answer contains 'thyroid_cancer'",
          "go_to": "assess.thyroid_exclusion"
        },
        {
          "if": "answer contains 'men2'",
          "go_to": "assess.thyroid_exclusion"
        },
        {
          "if": "answer contains 'pancreatitis'",
          "go_to": "assess.pancreatitis_warning"
        },
        {
          "if": "answer contains 'gallbladder_active'",
          "go_to": "assess.gallbladder_warning"
        },
        {
          "else": "assess.glp1_safety"
        }
      ]
    },
    {
      "id": "assess.thyroid_exclusion",
      "type": "terminal",
      "phase": "assess_safety",
      "status": "warning",
      "title": "This is a safety contraindication",
      "body": "With this history, GLP-1s carry significant cancer risk according to FDA data.\n\nWe can't safely prescribe these medications. Use the button below to return to Zappy Health and explore alternative care options with your endocrinologist.",
      "cta_primary": {
        "label": "Return to Zappy Health",
        "url": "https://zappyhealth.com"
      }
    },
    {
      "id": "assess.pancreatitis_warning",
      "type": "content",
      "phase": "assess_safety",
      "status": "warning",
      "headline": "Pancreatitis history needs careful review",
      "body": "GLP-1s can increase recurrence risk. Our provider will need details about your history and may need gastroenterologist clearance.\n\nDepending on severity and timing, GLP-1s may not be appropriate.",
      "cta_primary": {
        "label": "Got It"
      },
      "next": "assess.glp1_safety"
    },
    {
      "id": "assess.gallbladder_warning",
      "type": "content",
      "phase": "assess_medical",
      "status": "info",
      "headline": "Active gallbladder disease needs resolution first",
      "body": "GLP-1s can worsen gallbladder problems. You may need to resolve this before starting treatment.\n\nOur provider will review your situation.",
      "cta_primary": {
        "label": "Understood"
      },
      "next": "assess.glp1_safety"
    },
    {
      "id": "assess.glp1_safety",
      "type": "multi_select",
      "phase": "assess_safety",
      "title": "Have you been diagnosed with any of these?",
      "safety_critical": true,
      "options": [
        {
          "value": "diabetic_retinopathy",
          "label": "Diabetic retinopathy (eye damage)",
          "risk_level": "high"
        },
        {
          "value": "glp1_allergy",
          "label": "Severe allergic reaction to GLP-1 medications",
          "risk_level": "critical"
        },
        {
          "value": "severe_gastroparesis",
          "label": "Severe gastroparesis",
          "risk_level": "high"
        },
        {
          "value": "bariatric_surgery",
          "label": "Bariatric surgery in the past 18 months",
          "risk_level": "high"
        },
        {
          "value": "kidney_stage4_5",
          "label": "Advanced kidney disease (Stage 4-5)",
          "risk_level": "high"
        },
        {
          "value": "suicide_attempt_history",
          "label": "History of suicide attempts",
          "risk_level": "high"
        },
        {
          "value": "other_glp1_current",
          "label": "Currently on another GLP-1 (Victoza, Byetta, Trulicity, etc.)",
          "risk_level": "critical"
        },
        {
          "value": "thyroid_nodules",
          "label": "Thyroid nodules",
          "risk_level": "medium"
        },
        { "value": "none", "label": "None of these" }
      ],
      "required": true,
      "next_logic": [
        {
          "if": "answer contains 'glp1_allergy'",
          "go_to": "assess.glp1_allergy_exclusion"
        },
        {
          "if": "answer contains 'other_glp1_current'",
          "go_to": "assess.duplicate_glp1_warning"
        },
        {
          "if": "answer contains ['diabetic_retinopathy','severe_gastroparesis','bariatric_surgery','kidney_stage4_5']",
          "go_to": "assess.glp1_high_risk_warning"
        },
        {
          "else": "assess.current_medications"
        }
      ]
    },
    {
      "id": "assess.glp1_allergy_exclusion",
      "type": "terminal",
      "phase": "assess_safety",
      "status": "warning",
      "title": "Your previous reaction makes this too risky",
      "body": "A severe allergic reaction to a GLP-1 means another one could cause a more serious—potentially life-threatening—reaction.\n\nYour doctor or allergist can help you explore safe alternatives.",
      "cta_primary": {
        "label": "Learn More"
      }
    },
    {
      "id": "assess.duplicate_glp1_warning",
      "type": "content",
      "phase": "assess_safety",
      "status": "info",
      "headline": "We'll need to coordinate this carefully",
      "body": "Since you're already on a GLP-1, we'll coordinate with your current provider if we prescribe a different one.\n\nWe'll get more details about your current medication later.",
      "cta_primary": {
        "label": "OK"
      },
      "next": "assess.current_medications"
    },
    {
      "id": "assess.glp1_high_risk_warning",
      "type": "content",
      "phase": "assess_safety",
      "status": "warning",
      "headline": "We'll review this carefully",
      "body": "These conditions need extra attention with GLP-1s. Our provider will review your case thoroughly and may request additional records or specialist input to ensure your safety.",
      "cta_primary": {
        "label": "All Set"
      },
      "next": "assess.current_medications"
    },
    {
      "id": "assess.current_medications",
      "type": "multi_select",
      "phase": "assess_medical",
      "title": "Are you taking any of these medications?",
      "options": [
        { "value": "insulin", "label": "Insulin" },
        { "value": "metformin", "label": "Metformin or other diabetes meds" },
        { "value": "blood_pressure", "label": "Blood pressure meds" },
        { "value": "blood_thinners", "label": "Blood thinners (warfarin, Eliquis, etc.)" },
        { "value": "cholesterol", "label": "Cholesterol meds (statins)" },
        { "value": "thyroid", "label": "Thyroid medication (levothyroxine, etc.)" },
        { "value": "antidepressants", "label": "Antidepressants or anti-anxiety meds" },
        { "value": "adhd", "label": "ADHD medications" },
        { "value": "antipsychotics", "label": "Antipsychotic medications" },
        { "value": "seizure", "label": "Seizure or epilepsy meds" },
        { "value": "steroids", "label": "Corticosteroids (prednisone, etc.)" },
        { "value": "immunosuppressants", "label": "Immunosuppressants" },
        { "value": "pain_chronic", "label": "Chronic pain medications" },
        { "value": "none", "label": "No prescription medications" },
        { "value": "other", "label": "Other medications" }
      ],
      "next_logic": [
        {
          "if": "answer contains 'insulin'",
          "go_to": "assess.insulin_exclusion"
        },
        {
          "if": "answer contains 'other'",
          "go_to": "assess.medications_detail"
        },
        {
          "else": "assess.supplements"
        }
      ]
    },
    {
      "id": "assess.medications_detail",
      "type": "text",
      "phase": "assess_medical",
      "title": "List your other medications",
      "help_text": "Include doses if you know them",
      "multiline": true,
      "rows": 6,
      "required": true,
      "next": "assess.supplements"
    },
    {
      "id": "assess.insulin_exclusion",
      "type": "terminal",
      "phase": "assess_safety",
      "status": "warning",
      "title": "Coordinate with your diabetes team",
      "body": "Combining insulin with GLP-1s needs careful coordination to prevent dangerous blood sugar drops.\n\nBecause you're currently using insulin, we aren't able to offer GLP-1 weight loss treatment right now. Please continue partnering with your diabetes team for your care.\n\nDon't change your medications.",
      "cta_primary": {
        "label": "Return to Zappy Health",
        "url": "https://zappyhealth.com"
      }
    },
    {
      "id": "assess.supplements",
      "type": "single_select",
      "phase": "assess_medical",
      "field_id": "taking_supplements",
      "title": "Any vitamins or supplements?",
      "auto_advance": true,
      "required": true,
      "options": [
        { "value": "no", "label": "No" },
        { "value": "yes", "label": "Yes" }
      ],
      "next_logic": [
        {
          "if": "answer == 'yes'",
          "go_to": "assess.supplements_detail"
        },
        {
          "else": "assess.allergies"
        }
      ]
    },
    {
      "id": "assess.supplements_detail",
      "type": "text",
      "phase": "assess_medical",
      "title": "List your vitamins and supplements",
      "placeholder": "Vitamin D 2000 IU daily, fish oil, multivitamin",
      "multiline": true,
      "rows": 4,
      "required": true,
      "next": "assess.allergies"
    },
    {
      "id": "assess.allergies",
      "type": "single_select",
      "phase": "assess_medical",
      "field_id": "has_allergies",
      "title": "Any medication allergies?",
      "auto_advance": true,
      "required": true,
      "options": [
        { "value": "no", "label": "No" },
        { "value": "yes", "label": "Yes" }
      ],
      "next_logic": [
        {
          "if": "answer == 'yes'",
          "go_to": "assess.allergies_detail"
        },
        {
          "else": "assess.activity_level"
        }
      ]
    },
    {
      "id": "assess.allergies_detail",
      "type": "text",
      "phase": "assess_medical",
      "title": "List them with reactions",
      "placeholder": "Penicillin (rash), sulfa drugs (hives)",
      "multiline": true,
      "rows": 4,
      "required": true,
      "next": "assess.activity_level"
    },
    {
      "id": "assess.activity_level",
      "type": "single_select",
      "phase": "assess_medical",
      "title": "How active are you right now?",
      "auto_advance": true,
      "required": true,
      "options": [
        { "value": "sedentary", "label": "Mostly sedentary (desk work, little movement)" },
        { "value": "light", "label": "Lightly active (some walking daily)" },
        { "value": "moderate", "label": "Moderately active (regular walks or exercise)" },
        { "value": "active", "label": "Active (consistent exercise routine)" },
        { "value": "very_active", "label": "Very active (intensive daily training)" }
      ],
      "next": "assess.journey_notes"
    },
    {
      "id": "assess.journey_notes",
      "type": "text",
      "phase": "assess_medical",
      "title": "Anything else we should know?",
      "help_text": "Share whatever feels important—we're listening and here to help.",
      "placeholder": "Feel free to share what's on your mind...",
      "multiline": true,
      "rows": 6,
      "required": false,
      "next": "treatment.side_effect_plan_interest"
    },
    {
      "id": "treatment.side_effect_plan_interest",
      "type": "single_select",
      "phase": "assess_medical",
      "title": "Would you be interested in a personalized plan that minimizes side effects?",
      "auto_advance": true,
      "options": [
        { "value": "yes", "label": "Yes, definitely" },
        { "value": "no", "label": "No, I'm not concerned" }
      ],
      "required": true,
      "next": "transition.treatment_intro"
    },

    // ═══════════════════════════════════════════════════════════
    // PHASE 4: TREATMENT & LOGISTICS
    // ═══════════════════════════════════════════════════════════
    {
      "id": "transition.treatment_intro",
      "type": "content",
      "phase": "treatment",
      "headline": "You're through the health questions—nice work!",
      "body": "Now let's talk treatment. If you've used GLP-1s before, we'd love to know what worked or didn't. This helps us find the right approach for you.",
      "cta_primary": {
        "label": "Continue"
      },
      "next": "treatment.glp1_experience"
    },
    {
      "id": "treatment.glp1_experience",
      "type": "single_select",
      "phase": "treatment",
      "field_id": "glp1_status",
      "title": "First: have you tried GLP-1 medications before?",
      "help_text": "Things like Wegovy, Ozempic, Mounjaro, etc.",
      "auto_advance": true,
      "required": true,
      "options": [
        { "value": "never", "label": "No, never used" },
        { "value": "yes", "label": "Yes, I've used them" }
      ],
      "next_logic": [
        {
          "if": "answer == 'never'",
          "go_to": "treatment.medication_preference"
        },
        {
          "else": "treatment.glp1_history"
        }
      ]
    },
    {
      "id": "treatment.glp1_history",
      "type": "composite",
      "phase": "treatment",
      "title": "Which GLP-1 medications have you used?",
      "help_text": "Details appear below each one you check",
      "fields": [
        {
          "id": "used_wegovy",
          "type": "checkbox",
          "label": "Wegovy (semaglutide for weight loss)",
          "value": false
        },
        {
          "id": "wegovy_duration",
          "type": "text",
          "label": "  ↳ How long?",
          "placeholder": "6 months, 1 year, etc.",
          "required": true,
          "conditional_display": {
            "show_if": "used_wegovy == true"
          }
        },
        {
          "id": "wegovy_dose",
          "type": "single_select",
          "label": "  ↳ What doses?",
          "required": true,
          "options": [
            { "value": "0.25mg", "label": "0.25 mg weekly" },
            { "value": "0.5mg", "label": "0.5 mg weekly" },
            { "value": "1mg", "label": "1 mg weekly" },
            { "value": "1.7mg", "label": "1.7 mg weekly" },
            { "value": "2mg", "label": "2 mg weekly" },
            { "value": "2.4mg", "label": "2.4 mg weekly" }
          ],
          "conditional_display": {
            "show_if": "used_wegovy == true"
          }
        },
        {
          "id": "wegovy_currently_taking",
          "type": "single_select",
          "label": "  ↳ Still taking it?",
          "required": true,
          "options": [
            { "value": "yes", "label": "Yes" },
            { "value": "no", "label": "No" }
          ],
          "conditional_display": {
            "show_if": "used_wegovy == true"
          }
        },
        {
          "id": "wegovy_why_stopped",
          "type": "text",
          "label": "  ↳ Why did you stop?",
          "placeholder": "Side effects, cost, reached goal, etc.",
          "conditional_display": {
            "show_if": "used_wegovy == true AND wegovy_currently_taking == 'no'"
          }
        },
        {
          "id": "wegovy_side_effects",
          "type": "text",
          "label": "  ↳ Any side effects? (optional)",
          "placeholder": "Nausea, constipation, fatigue, etc.",
          "multiline": true,
          "rows": 2,
          "conditional_display": {
            "show_if": "used_wegovy == true"
          }
        },
        
        {
          "id": "used_ozempic",
          "type": "checkbox",
          "label": "Ozempic (semaglutide for diabetes)",
          "value": false
        },
        {
          "id": "ozempic_duration",
          "type": "text",
          "label": "  ↳ How long?",
          "placeholder": "6 months, 1 year, etc.",
          "required": true,
          "conditional_display": {
            "show_if": "used_ozempic == true"
          }
        },
        {
          "id": "ozempic_dose",
          "type": "single_select",
          "label": "  ↳ What dose?",
          "required": true,
          "options": [
            { "value": "0.25mg", "label": "0.25 mg weekly" },
            { "value": "0.5mg", "label": "0.5 mg weekly" },
            { "value": "1mg", "label": "1 mg weekly" },
            { "value": "2mg", "label": "2 mg weekly" }
          ],
          "conditional_display": {
            "show_if": "used_ozempic == true"
          }
        },
        {
          "id": "ozempic_currently_taking",
          "type": "single_select",
          "label": "  ↳ Still taking it?",
          "required": true,
          "options": [
            { "value": "yes", "label": "Yes" },
            { "value": "no", "label": "No" }
          ],
          "conditional_display": {
            "show_if": "used_ozempic == true"
          }
        },
        {
          "id": "ozempic_why_stopped",
          "type": "text",
          "label": "  ↳ Why did you stop?",
          "placeholder": "Side effects, cost, reached goal, etc.",
          "conditional_display": {
            "show_if": "used_ozempic == true AND ozempic_currently_taking == 'no'"
          }
        },
        {
          "id": "ozempic_side_effects",
          "type": "text",
          "label": "  ↳ Any side effects? (optional)",
          "placeholder": "Nausea, constipation, fatigue, etc.",
          "multiline": true,
          "rows": 2,
          "conditional_display": {
            "show_if": "used_ozempic == true"
          }
        },
        
        {
          "id": "used_semaglutide_compound",
          "type": "checkbox",
          "label": "Compounded semaglutide",
          "value": false
        },
        {
          "id": "semaglutide_compound_duration",
          "type": "text",
          "label": "  ↳ How long?",
          "placeholder": "6 months, 1 year, etc.",
          "required": true,
          "conditional_display": {
            "show_if": "used_semaglutide_compound == true"
          }
        },
        {
          "id": "semaglutide_compound_dose",
          "type": "single_select",
          "label": "  ↳ What dose?",
          "required": true,
          "options": [
            { "value": "0.25mg", "label": "0.25 mg weekly" },
            { "value": "0.5mg", "label": "0.5 mg weekly" },
            { "value": "1mg", "label": "1 mg weekly" },
            { "value": "1.7mg", "label": "1.7 mg weekly" },
            { "value": "2mg", "label": "2 mg weekly" },
            { "value": "2.4mg", "label": "2.4 mg weekly" }
          ],
          "conditional_display": {
            "show_if": "used_semaglutide_compound == true"
          }
        },
        {
          "id": "semaglutide_compound_currently_taking",
          "type": "single_select",
          "label": "  ↳ Still taking it?",
          "required": true,
          "options": [
            { "value": "yes", "label": "Yes" },
            { "value": "no", "label": "No" }
          ],
          "conditional_display": {
            "show_if": "used_semaglutide_compound == true"
          }
        },
        {
          "id": "semaglutide_compound_why_stopped",
          "type": "text",
          "label": "  ↳ Why did you stop?",
          "placeholder": "Side effects, cost, reached goal, etc.",
          "conditional_display": {
            "show_if": "used_semaglutide_compound == true AND semaglutide_compound_currently_taking == 'no'"
          }
        },
        {
          "id": "semaglutide_compound_side_effects",
          "type": "text",
          "label": "  ↳ Any side effects? (optional)",
          "placeholder": "Nausea, constipation, fatigue, etc.",
          "multiline": true,
          "rows": 2,
          "conditional_display": {
            "show_if": "used_semaglutide_compound == true"
          }
        },
        
        {
          "id": "used_zepbound",
          "type": "checkbox",
          "label": "Zepbound (tirzepatide for weight loss)",
          "value": false
        },
        {
          "id": "zepbound_duration",
          "type": "text",
          "label": "  ↳ How long?",
          "placeholder": "6 months, 1 year, etc.",
          "required": true,
          "conditional_display": {
            "show_if": "used_zepbound == true"
          }
        },
        {
          "id": "zepbound_dose",
          "type": "single_select",
          "label": "  ↳ What dose?",
          "required": true,
          "options": [
            { "value": "2.5mg", "label": "2.5 mg weekly" },
            { "value": "5mg", "label": "5 mg weekly" },
            { "value": "7.5mg", "label": "7.5 mg weekly" },
            { "value": "10mg", "label": "10 mg weekly" },
            { "value": "12.5mg", "label": "12.5 mg weekly" },
            { "value": "15mg", "label": "15 mg weekly" }
          ],
          "conditional_display": {
            "show_if": "used_zepbound == true"
          }
        },
        {
          "id": "zepbound_currently_taking",
          "type": "single_select",
          "label": "  ↳ Still taking it?",
          "required": true,
          "options": [
            { "value": "yes", "label": "Yes" },
            { "value": "no", "label": "No" }
          ],
          "conditional_display": {
            "show_if": "used_zepbound == true"
          }
        },
        {
          "id": "zepbound_why_stopped",
          "type": "text",
          "label": "  ↳ Why did you stop?",
          "placeholder": "Side effects, cost, reached goal, etc.",
          "conditional_display": {
            "show_if": "used_zepbound == true AND zepbound_currently_taking == 'no'"
          }
        },
        {
          "id": "zepbound_side_effects",
          "type": "text",
          "label": "  ↳ Any side effects? (optional)",
          "placeholder": "Nausea, constipation, fatigue, etc.",
          "multiline": true,
          "rows": 2,
          "conditional_display": {
            "show_if": "used_zepbound == true"
          }
        },
        
        {
          "id": "used_mounjaro",
          "type": "checkbox",
          "label": "Mounjaro (tirzepatide for diabetes)",
          "value": false
        },
        {
          "id": "mounjaro_duration",
          "type": "text",
          "label": "  ↳ How long?",
          "placeholder": "6 months, 1 year, etc.",
          "required": true,
          "conditional_display": {
            "show_if": "used_mounjaro == true"
          }
        },
        {
          "id": "mounjaro_dose",
          "type": "single_select",
          "label": "  ↳ What dose?",
          "required": true,
          "options": [
            { "value": "2.5mg", "label": "2.5 mg weekly" },
            { "value": "5mg", "label": "5 mg weekly" },
            { "value": "7.5mg", "label": "7.5 mg weekly" },
            { "value": "10mg", "label": "10 mg weekly" },
            { "value": "12.5mg", "label": "12.5 mg weekly" },
            { "value": "15mg", "label": "15 mg weekly" }
          ],
          "conditional_display": {
            "show_if": "used_mounjaro == true"
          }
        },
        {
          "id": "mounjaro_currently_taking",
          "type": "single_select",
          "label": "  ↳ Still taking it?",
          "required": true,
          "options": [
            { "value": "yes", "label": "Yes" },
            { "value": "no", "label": "No" }
          ],
          "conditional_display": {
            "show_if": "used_mounjaro == true"
          }
        },
        {
          "id": "mounjaro_why_stopped",
          "type": "text",
          "label": "  ↳ Why did you stop?",
          "placeholder": "Side effects, cost, reached goal, etc.",
          "conditional_display": {
            "show_if": "used_mounjaro == true AND mounjaro_currently_taking == 'no'"
          }
        },
        {
          "id": "mounjaro_side_effects",
          "type": "text",
          "label": "  ↳ Any side effects? (optional)",
          "placeholder": "Nausea, constipation, fatigue, etc.",
          "multiline": true,
          "rows": 2,
          "conditional_display": {
            "show_if": "used_mounjaro == true"
          }
        },
        
        {
          "id": "used_tirzepatide_compound",
          "type": "checkbox",
          "label": "Compounded tirzepatide",
          "value": false
        },
        {
          "id": "tirzepatide_compound_duration",
          "type": "text",
          "label": "  ↳ How long?",
          "placeholder": "6 months, 1 year, etc.",
          "required": true,
          "conditional_display": {
            "show_if": "used_tirzepatide_compound == true"
          }
        },
        {
          "id": "tirzepatide_compound_dose",
          "type": "single_select",
          "label": "  ↳ What dose?",
          "required": true,
          "options": [
            { "value": "2.5mg", "label": "2.5 mg weekly" },
            { "value": "5mg", "label": "5 mg weekly" },
            { "value": "7.5mg", "label": "7.5 mg weekly" },
            { "value": "10mg", "label": "10 mg weekly" },
            { "value": "12.5mg", "label": "12.5 mg weekly" },
            { "value": "15mg", "label": "15 mg weekly" }
          ],
          "conditional_display": {
            "show_if": "used_tirzepatide_compound == true"
          }
        },
        {
          "id": "tirzepatide_compound_currently_taking",
          "type": "single_select",
          "label": "  ↳ Still taking it?",
          "required": true,
          "options": [
            { "value": "yes", "label": "Yes" },
            { "value": "no", "label": "No" }
          ],
          "conditional_display": {
            "show_if": "used_tirzepatide_compound == true"
          }
        },
        {
          "id": "tirzepatide_compound_why_stopped",
          "type": "text",
          "label": "  ↳ Why did you stop?",
          "placeholder": "Side effects, cost, reached goal, etc.",
          "conditional_display": {
            "show_if": "used_tirzepatide_compound == true AND tirzepatide_compound_currently_taking == 'no'"
          }
        },
        {
          "id": "tirzepatide_compound_side_effects",
          "type": "text",
          "label": "  ↳ Any side effects? (optional)",
          "placeholder": "Nausea, constipation, fatigue, etc.",
          "multiline": true,
          "rows": 2,
          "conditional_display": {
            "show_if": "used_tirzepatide_compound == true"
          }
        },
        
        {
          "id": "used_saxenda",
          "type": "checkbox",
          "label": "Saxenda (liraglutide)",
          "value": false
        },
        {
          "id": "saxenda_duration",
          "type": "text",
          "label": "  ↳ How long?",
          "placeholder": "6 months, 1 year, etc.",
          "required": true,
          "conditional_display": {
            "show_if": "used_saxenda == true"
          }
        },
        {
          "id": "saxenda_dose",
          "type": "single_select",
          "label": "  ↳ What dose?",
          "required": true,
          "options": [
            { "value": "0.6mg", "label": "0.6 mg daily" },
            { "value": "1.2mg", "label": "1.2 mg daily" },
            { "value": "1.8mg", "label": "1.8 mg daily" },
            { "value": "3mg", "label": "3 mg daily" }
          ],
          "conditional_display": {
            "show_if": "used_saxenda == true"
          }
        },
        {
          "id": "saxenda_currently_taking",
          "type": "single_select",
          "label": "  ↳ Still taking it?",
          "required": true,
          "options": [
            { "value": "yes", "label": "Yes" },
            { "value": "no", "label": "No" }
          ],
          "conditional_display": {
            "show_if": "used_saxenda == true"
          }
        },
        {
          "id": "saxenda_why_stopped",
          "type": "text",
          "label": "  ↳ Why did you stop?",
          "placeholder": "Side effects, cost, reached goal, etc.",
          "conditional_display": {
            "show_if": "used_saxenda == true AND saxenda_currently_taking == 'no'"
          }
        },
        {
          "id": "saxenda_side_effects",
          "type": "text",
          "label": "  ↳ Any side effects? (optional)",
          "placeholder": "Nausea, constipation, fatigue, etc.",
          "multiline": true,
          "rows": 2,
          "conditional_display": {
            "show_if": "used_saxenda == true"
          }
        },
        
        {
          "id": "used_victoza",
          "type": "checkbox",
          "label": "Victoza (liraglutide)",
          "value": false
        },
        {
          "id": "victoza_duration",
          "type": "text",
          "label": "  ↳ How long?",
          "placeholder": "6 months, 1 year, etc.",
          "required": true,
          "conditional_display": {
            "show_if": "used_victoza == true"
          }
        },
        {
          "id": "victoza_dose",
          "type": "single_select",
          "label": "  ↳ What dose?",
          "required": true,
          "options": [
            { "value": "0.6mg", "label": "0.6 mg daily" },
            { "value": "1.2mg", "label": "1.2 mg daily" },
            { "value": "1.8mg", "label": "1.8 mg daily" }
          ],
          "conditional_display": {
            "show_if": "used_victoza == true"
          }
        },
        {
          "id": "victoza_currently_taking",
          "type": "single_select",
          "label": "  ↳ Still taking it?",
          "required": true,
          "options": [
            { "value": "yes", "label": "Yes" },
            { "value": "no", "label": "No" }
          ],
          "conditional_display": {
            "show_if": "used_victoza == true"
          }
        },
        {
          "id": "victoza_why_stopped",
          "type": "text",
          "label": "  ↳ Why did you stop?",
          "placeholder": "Side effects, cost, reached goal, etc.",
          "conditional_display": {
            "show_if": "used_victoza == true AND victoza_currently_taking == 'no'"
          }
        },
        {
          "id": "victoza_side_effects",
          "type": "text",
          "label": "  ↳ Any side effects? (optional)",
          "placeholder": "Nausea, constipation, fatigue, etc.",
          "multiline": true,
          "rows": 2,
          "conditional_display": {
            "show_if": "used_victoza == true"
          }
        },
        
        {
          "id": "used_other",
          "type": "checkbox",
          "label": "Other GLP-1",
          "value": false
        },
        {
          "id": "other_name",
          "type": "text",
          "label": "  ↳ Which medication?",
          "placeholder": "Name of medication",
          "required": true,
          "conditional_display": {
            "show_if": "used_other == true"
          }
        },
        {
          "id": "other_duration",
          "type": "text",
          "label": "  ↳ How long?",
          "placeholder": "6 months, 1 year, etc.",
          "required": true,
          "conditional_display": {
            "show_if": "used_other == true"
          }
        },
        {
          "id": "other_dose",
          "type": "text",
          "label": "  ↳ What dose?",
          "placeholder": "Dose and frequency",
          "required": true,
          "conditional_display": {
            "show_if": "used_other == true"
          }
        },
        {
          "id": "other_currently_taking",
          "type": "single_select",
          "label": "  ↳ Still taking it?",
          "required": true,
          "options": [
            { "value": "yes", "label": "Yes" },
            { "value": "no", "label": "No" }
          ],
          "conditional_display": {
            "show_if": "used_other == true"
          }
        },
        {
          "id": "other_why_stopped",
          "type": "text",
          "label": "  ↳ Why did you stop?",
          "placeholder": "Side effects, cost, reached goal, etc.",
          "conditional_display": {
            "show_if": "used_other == true AND other_currently_taking == 'no'"
          }
        },
        {
          "id": "other_side_effects",
          "type": "text",
          "label": "  ↳ Any side effects? (optional)",
          "placeholder": "Nausea, constipation, fatigue, etc.",
          "multiline": true,
          "rows": 2,
          "conditional_display": {
            "show_if": "used_other == true"
          }
        }
      ],
      "validation": {
        "require_any": {
          "fields": [
            "used_wegovy",
            "used_ozempic",
            "used_semaglutide_compound",
            "used_zepbound",
            "used_mounjaro",
            "used_tirzepatide_compound",
            "used_saxenda",
            "used_victoza",
            "used_other"
          ],
          "error": "Please check at least one GLP-1 medication you've used"
        },
        "max_currently_taking": {
          "limit": 1,
          "fields": [
            "wegovy_currently_taking",
            "ozempic_currently_taking",
            "semaglutide_compound_currently_taking",
            "zepbound_currently_taking",
            "mounjaro_currently_taking",
            "tirzepatide_compound_currently_taking",
            "saxenda_currently_taking",
            "victoza_currently_taking",
            "other_currently_taking"
          ],
          "error": "You can only be currently taking one GLP-1 medication"
        }
      },
      "next": "treatment.medication_preference"
    },
    {
      "id": "treatment.medication_preference_initial",
      "type": "single_select",
      "phase": "treatment",
      "title": "Do you have a medication in mind?",
      "auto_advance": true,
      "required": true,
      "options": [
        { "value": "yes", "label": "Yes" },
        { "value": "no", "label": "No, I am open to recommendations" }
      ],
      "next_logic": [
        {
          "if": "answer == 'yes'",
          "go_to": "treatment.medication_preference"
        },
        {
          "else": "treatment.plan_selection.generic"
        }
      ]
    },
    {
      "id": "treatment.medication_preference",
      "type": "multi_select",
      "phase": "treatment",
      "title": "Which medications interest you?",
      "required": true,
      "next": "treatment.plan_selection.generic"
    },
    {
      "id": "treatment.plan_selection.semaglutide_brand",
      "type": "single_select",
      "phase": "treatment",
      "title": "Choose Your Brand Semaglutide Plan",
      "help_text": "Includes medication, provider consultations, and support.",
      "auto_advance": true,
      "required": true,
      "next": "logistics.discount_code"
    },
    {
      "id": "treatment.plan_selection.semaglutide_compound",
      "type": "single_select",
      "phase": "treatment",
      "title": "Choose Your Compounded Semaglutide Plan",
      "help_text": "Includes medication, provider consultations, and support.",
      "auto_advance": true,
      "required": true,
      "next": "logistics.discount_code"
    },
    {
      "id": "treatment.plan_selection.tirzepatide_brand",
      "type": "single_select",
      "phase": "treatment",
      "title": "Choose Your Brand Tirzepatide Plan",
      "help_text": "Includes medication, provider consultations, and support.",
      "auto_advance": true,
      "required": true,
      "next": "logistics.discount_code"
    },
    {
      "id": "treatment.plan_selection.tirzepatide_compound",
      "type": "single_select",
      "phase": "treatment",
      "title": "Choose Your Compounded Tirzepatide Plan",
      "help_text": "Includes medication, provider consultations, and support.",
      "auto_advance": true,
      "required": true,
      "next": "logistics.discount_code"
    },
    {
      "id": "treatment.plan_selection.generic",
      "type": "single_select",
      "phase": "treatment",
      "title": "Choose Your Plan",
      "help_text": "Your provider will recommend the best medication for you. Prices shown are for compounded options.",
      "auto_advance": true,
      "required": true,
      "next": "logistics.discount_code"
    },
    {
      "id": "logistics.discount_code",
      "type": "text",
      "phase": "treatment",
      "title": "Have a discount code?",
      "help_text": "Enter it below to apply it to your plan (optional)",
      "placeholder": "DISCOUNT20",
      "required": false,
      "next": "transition.final_section"
    },
    {
      "id": "transition.final_section",
      "type": "content",
      "phase": "treatment",
      "headline": "Almost there!",
      "body": "Just need your contact and shipping info, then you're all set. Your provider will review everything within 24 hours.",
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
              "pattern": "^[a-zA-Z\\s\\-']{1,50}$",
              "error": "Enter a valid first name"
            }
          },
          {
            "id": "last_name",
            "type": "text",
            "label": "Last name",
            "required": true,
            "validation": {
              "pattern": "^[a-zA-Z\\s\\-']{1,50}$",
              "error": "Enter a valid last name"
            }
          }
        ],
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
            "pattern": "^[a-zA-Z\\s\\-']{2,50}$",
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
        ]
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
        { "icon": "✓", "icon_name": "review", "label": "Physician review (24 hrs)", "status": "pending" },
        { "icon": "→", "icon_name": "plan", "label": "Treatment plan (48 hrs)", "status": "pending" },
        { "icon": "→", "icon_name": "journey", "label": "Start your journey", "status": "pending" }
      ],
      "cta_primary": {
        "label": "View Your Dashboard"
      },
      "links": [
        { "label": "Return to Zappy Health", "url": "https://zappyhealth.com" },
        { "label": "Back to Home", "url": "/" }
      ]
    }
  ],

  "eligibility_rules": [
    {
      "rule": "age_out_of_range",
      "if": "calc.age < 12 OR calc.age > 90",
      "action": "flag_no_medication",
      "severity": "critical"
    },
    {
      "rule": "underweight_no_meds",
      "if": "calc.bmi < 19",
      "action": "flag_no_medication",
      "severity": "critical"
    },
    {
      "rule": "low_bmi_review",
      "if": "calc.bmi < 27",
      "action": "flag_requires_comorbidity_check",
      "severity": "medium"
    },
    {
      "rule": "anorexia_bulimia_exclusion",
      "if": "assess.eating_disorder_type contains 'anorexia' OR assess.eating_disorder_type contains 'bulimia'",
      "action": "flag_no_medication",
      "severity": "critical"
    },
    {
      "rule": "thyroid_cancer_exclusion",
      "if": "assess.medical_conditions contains 'thyroid_cancer'",
      "action": "flag_no_medication",
      "severity": "critical"
    },
    {
      "rule": "men2_exclusion",
      "if": "assess.medical_conditions contains 'men2'",
      "action": "flag_no_medication",
      "severity": "critical"
    },
    {
      "rule": "glp1_allergy_exclusion",
      "if": "assess.glp1_safety contains 'glp1_allergy'",
      "action": "flag_no_medication",
      "severity": "critical"
    },
    {
      "rule": "pregnancy_exclusion",
      "if": "assess.pregnancy in ['pregnant','trying','nursing']",
      "action": "flag_no_medication",
      "severity": "critical"
    },
    {
      "rule": "insulin_requires_coordination",
      "if": "assess.current_medications contains 'insulin'",
      "action": "flag_requires_specialist_clearance",
      "severity": "critical"
    },
    {
      "rule": "type1_requires_specialist_clearance",
      "if": "assess.diabetes_type == 'type1'",
      "action": "flag_no_medication",
      "severity": "critical"
    },
    {
      "rule": "active_suicidal_ideation",
      "if": "current_thoughts == 'yes'",
      "action": "flag_mental_health_urgent_review",
      "severity": "critical"
    },
    {
      "rule": "pancreatitis_review",
      "if": "assess.medical_conditions contains 'pancreatitis'",
      "action": "flag_high_risk_requires_review",
      "severity": "high"
    },
    {
      "rule": "active_gallbladder_review",
      "if": "assess.medical_conditions contains 'gallbladder_active'",
      "action": "flag_high_risk_requires_review",
      "severity": "high"
    },
    {
      "rule": "eating_disorder_flag",
      "if": "assess.eating_relationship == 'yes'",
      "action": "flag_eating_disorder_review",
      "severity": "high"
    },
    {
      "rule": "recent_psych_hospitalization",
      "if": "recent_hospitalization == 'yes'",
      "action": "flag_mental_health_review",
      "severity": "high"
    },
    {
      "rule": "heavy_alcohol_use",
      "if": "alcohol_use == 'heavy'",
      "action": "flag_substance_review",
      "severity": "medium"
    },
    {
      "rule": "hard_drug_use",
      "if": "recreational_substances contains ['cocaine','methamphetamine','opioids']",
      "action": "flag_substance_review",
      "severity": "high"
    },
    {
      "rule": "pediatric_consent_required",
      "if": "calc.age >= 12 AND calc.age < 18",
      "action": "flag_parental_consent_required",
      "severity": "high"
    }
  ],

  "provider_packet": {
    "include_fields": [
      "email",
      "first_name",
      "last_name",
      "phone",
      "demographics.dob",
      "calc.age",
      "demographics.state",
      "sex_birth",
      "ethnicity",
      "parent_name",
      "goal.range",
      "height_ft",
      "height_in",
      "weight",
      "highest_weight",
      "goal_weight",
      "calc.bmi",
      "activity_level",
      "assess.eating_relationship",
      "assess.eating_disorder_type",
      "mental_health_diagnosis",
      "mental_health_other",
      "recent_hospitalization",
      "current_thoughts",
      "alcohol_use",
      "tobacco_use",
      "recreational_substances",
      "assess.diabetes",
      "assess.diabetes_type",
      "assess.pregnancy",
      "assess.medical_conditions",
      "medical_conditions_other",
      "assess.current_medications",
      "medications_detail",
      "taking_supplements",
      "supplements_detail",
      "has_allergies",
      "allergies_detail",
      "activity_level",
      "journey_notes",
      "glp1_status",
      "medications_used",
      "wegovy_duration",
      "wegovy_dose",
      "wegovy_currently_taking",
      "wegovy_why_stopped",
      "wegovy_side_effects",
      "ozempic_duration",
      "ozempic_dose",
      "ozempic_currently_taking",
      "ozempic_why_stopped",
      "ozempic_side_effects",
      "semaglutide_compound_duration",
      "semaglutide_compound_dose",
      "semaglutide_compound_currently_taking",
      "semaglutide_compound_why_stopped",
      "semaglutide_compound_side_effects",
      "zepbound_duration",
      "zepbound_dose",
      "zepbound_currently_taking",
      "zepbound_why_stopped",
      "zepbound_side_effects",
      "mounjaro_duration",
      "mounjaro_dose",
      "mounjaro_currently_taking",
      "mounjaro_why_stopped",
      "mounjaro_side_effects",
      "tirzepatide_compound_duration",
      "tirzepatide_compound_dose",
      "tirzepatide_compound_currently_taking",
      "tirzepatide_compound_why_stopped",
      "tirzepatide_compound_side_effects",
      "saxenda_duration",
      "saxenda_dose",
      "saxenda_currently_taking",
      "saxenda_why_stopped",
      "saxenda_side_effects",
      "victoza_duration",
      "victoza_dose",
      "victoza_currently_taking",
      "victoza_why_stopped",
      "victoza_side_effects",
      "other_name",
      "other_duration",
      "other_dose",
      "other_currently_taking",
      "other_why_stopped",
      "other_side_effects",
      "treatment.medication_preference",
      "treatment.side_effect_history",
      "side_effect_history_other",
      "treatment.side_effect_plan_interest",
      "address_line1",
      "address_line2",
      "city",
      "state",
      "zip_code",
      "medication_preferences",
      "medication_pharmacy_preferences"
    ],
    "summary_template": "PATIENT: {first_name} {last_name} | DOB: {demographics.dob} (Age {calc.age}) | {sex_birth} | {demographics.state}\n\nGOALS: Current {weight}lb → Goal {goal_weight}lb ({goal.range}) | BMI: {calc.bmi:.1f} | Activity: {activity_level}\n\nRED FLAGS: {flags}\n\nED HISTORY: {assess.eating_relationship} | Type: {assess.eating_disorder_type}\nMENTAL HEALTH: {mental_health_diagnosis} | Suicidal ideation: {current_thoughts} | Recent psych hospitalization: {recent_hospitalization}\nSUBSTANCE: Alcohol: {assess.substance_use_alcohol} | Tobacco: {assess.substance_use_tobacco} | Other: {assess.substance_use_recreational}\n\nMEDICAL: Diabetes: {assess.diabetes_type} | Pregnancy: {assess.pregnancy} | Conditions: {assess.medical_conditions}\nMEDICATIONS: {assess.current_medications}, {medications_detail}\nALLERGIES: {allergies_detail}\n\nGLP-1 EXPERIENCE: {glp1_status} | Medications used: {medications_used} | Currently taking: {currently_taking}\nExperience notes: {glp1_experience_notes}\nMEDICATION INTEREST: {treatment.medication_preference}\nSUPPORT NEEDS: {treatment.side_effect_management}\n\nADDITIONAL NOTES: {journey_notes}",
    "risk_stratification": {
      "critical": ["age_out_of_range", "underweight_no_meds", "anorexia_bulimia_exclusion", "thyroid_cancer_exclusion", "men2_exclusion", "pregnancy_exclusion", "glp1_allergy_exclusion", "insulin_requires_coordination", "type1_requires_specialist_clearance", "active_suicidal_ideation"],
      "high": ["eating_disorder_flag", "pancreatitis_review", "active_gallbladder_review", "hard_drug_use", "recent_psych_hospitalization"],
      "medium": ["low_bmi_review", "heavy_alcohol_use"],
      "review_required": ["pediatric_consent_required"]
    }
  }
};

export default formConfig;
