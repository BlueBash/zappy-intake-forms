import { FormConfig } from './types';

const formConfig: FormConfig = {
  "meta": {
    "product": "Hybrid Weight-Loss Program",
    "form_name": "Optimized Medical Intake - Compliance & Conversion",
    "version": "4.0.0",
    "language": "en-US"
  },
  "settings": {
    "theme": {
      "primary_hex": "#ef5466",
      "accent_hex": "#ff6b7a",
      "secondary_hex": "#78716c",
      "font_stack": "\"Nunito Sans\", sans-serif",
      "background_hex": "#fafaf9"
    },
    "progress_bar": true,
    "show_back_button": true,
    "autosave_ms": 800
  },
  "screens": [
    {
      "id": "welcome",
      "type": "content",
      "headline": "Your weight loss journey starts here.",
      "body": "Answer a few questions so our medical team can create a plan that actually works for your body and your life.",
      "cta_primary": {
        "label": "Get Started"
      },
      "next": "goal.range"
    },
    {
      "id": "goal.range",
      "type": "single_select",
      "title": "How much weight are you looking to lose?",
      "help_text": "Just an estimate is fine.",
      "auto_advance": false,
      "options": [
        { "value": "1-15", "label": "1–15 lb" },
        { "value": "16-30", "label": "16–30 lb" },
        { "value": "31-50", "label": "31–50 lb" },
        { "value": "50+", "label": "More than 50 lb" },
        { "value": "not_sure", "label": "I'm not sure yet" }
      ],
      "required": true,
      "next": "conversion.stat_screen"
    },
    {
      "id": "conversion.stat_screen",
      "type": "content",
      "headline": "You're not alone in this.",
      "body": "Most people struggle with weight loss on their own. Medical support makes a real difference—our members see significantly better results than with diet and exercise alone.",
      "cta_primary": {
        "label": "Continue"
      },
      "next": "demographics.state"
    },
    {
      "id": "demographics.state",
      "type": "single_select",
      "title": "Which state do you live in?",
      "help_text": "We need to make sure we're licensed to provide care in your state.",
      "auto_advance": false,
      "options": [
        { "value": "AL", "label": "Alabama" },
        { "value": "AK", "label": "Alaska" },
        { "value": "AZ", "label": "Arizona" },
        { "value": "AR", "label": "Arkansas" },
        { "value": "CA", "label": "California" },
        { "value": "CO", "label": "Colorado" },
        { "value": "CT", "label": "Connecticut" },
        { "value": "DE", "label": "Delaware" },
        { "value": "FL", "label": "Florida" },
        { "value": "GA", "label": "Georgia" },
        { "value": "HI", "label": "Hawaii" },
        { "value": "ID", "label": "Idaho" },
        { "value": "IL", "label": "Illinois" },
        { "value": "IN", "label": "Indiana" },
        { "value": "IA", "label": "Iowa" },
        { "value": "KS", "label": "Kansas" },
        { "value": "KY", "label": "Kentucky" },
        { "value": "LA", "label": "Louisiana" },
        { "value": "ME", "label": "Maine" },
        { "value": "MD", "label": "Maryland" },
        { "value": "MA", "label": "Massachusetts" },
        { "value": "MI", "label": "Michigan" },
        { "value": "MN", "label": "Minnesota" },
        { "value": "MS", "label": "Mississippi" },
        { "value": "MO", "label": "Missouri" },
        { "value": "MT", "label": "Montana" },
        { "value": "NE", "label": "Nebraska" },
        { "value": "NV", "label": "Nevada" },
        { "value": "NH", "label": "New Hampshire" },
        { "value": "NJ", "label": "New Jersey" },
        { "value": "NM", "label": "New Mexico" },
        { "value": "NY", "label": "New York" },
        { "value": "NC", "label": "North Carolina" },
        { "value": "ND", "label": "North Dakota" },
        { "value": "OH", "label": "Ohio" },
        { "value": "OK", "label": "Oklahoma" },
        { "value": "OR", "label": "Oregon" },
        { "value": "PA", "label": "Pennsylvania" },
        { "value": "RI", "label": "Rhode Island" },
        { "value": "SC", "label": "South Carolina" },
        { "value": "SD", "label": "South Dakota" },
        { "value": "TN", "label": "Tennessee" },
        { "value": "TX", "label": "Texas" },
        { "value": "UT", "label": "Utah" },
        { "value": "VT", "label": "Vermont" },
        { "value": "VA", "label": "Virginia" },
        { "value": "WA", "label": "Washington" },
        { "value": "WV", "label": "West Virginia" },
        { "value": "WI", "label": "Wisconsin" },
        { "value": "WY", "label": "Wyoming" },
        { "value": "DC", "label": "District of Columbia" }
      ],
      "required": true,
      "next": "demographics.dob"
    },
    {
      "id": "demographics.dob",
      "type": "text",
      "title": "What's your date of birth?",
      "help_text": "We need this to make sure you're eligible and to calculate safe dosing.",
      "placeholder": "MM/DD/YYYY",
      "mask": "##/##/####",
      "validation": {
        "pattern": "^(0[1-9]|1[0-2])\\/(0[1-9]|[12][0-9]|3[01])\\/(19|20)\\d{2}$",
        "error": "Please enter a valid date in MM/DD/YYYY format."
      },
      "required": true,
      "next_logic": [
        {
          "if": "calc.age < 18",
          "go_to": "demographics.parental_consent"
        },
        {
          "else": "conversion.social_proof"
        }
      ],
      "calculations": [
        {
          "id": "age",
          "formula": "(new Date() - new Date(demographics.dob)) / (365.25 * 24 * 60 * 60 * 1000)"
        }
      ]
    },
    {
      "id": "demographics.parental_consent",
      "type": "composite",
      "title": "We'll need a parent or guardian's permission",
      "help_text": "Since you're under 18, we need consent from a parent or legal guardian before we can move forward.",
      "fields": [
        {
          "id": "parent_name",
          "type": "text",
          "label": "Parent or guardian's name",
          "required": true
        },
        {
          "id": "parent_email",
          "type": "email",
          "label": "Their email",
          "placeholder": "parent@example.com",
          "required": true
        },
        {
          "id": "parent_phone",
          "type": "text",
          "label": "Their phone number",
          "placeholder": "(555) 123-4567",
          "required": true
        }
      ],
      "footer_note": "We'll email them with the consent form before taking any next steps.",
      "next": "conversion.social_proof"
    },
    {
      "id": "conversion.social_proof",
      "type": "content",
      "headline": "See what's possible with the right support",
      "body": "Our members achieve real, lasting results with physician-guided plans. You don't have to figure this out alone.",
      "cta_primary": {
        "label": "Continue"
      },
      "next": "contact.email"
    },
    {
      "id": "contact.email",
      "type": "composite",
      "title": "Create your account",
      "help_text": "We'll send your treatment plan and all updates here.",
      "fields": [
        {
          "id": "email",
          "type": "email",
          "label": "Email address",
          "placeholder": "you@example.com",
          "required": true
        },
        {
          "id": "password",
          "type": "password",
          "label": "Password",
          "placeholder": "At least 8 characters",
          "required": true,
          "validation": {
            "pattern": "^.{8,}$",
            "error": "Password must be at least 8 characters"
          }
        }
      ],
      "footer_note": "Your health information is encrypted and secure.",
      "next": "transition.health_history"
    },
    {
      "id": "transition.health_history",
      "type": "content",
      "headline": "Now let's talk about your health",
      "body": "We'll ask about your medical history so we can make sure any treatment we recommend is safe for you. Everything you share stays confidential.",
      "image": "/images/transition-health-history.jpg",
      "cta_primary": {
        "label": "Continue"
      },
      "next": "anthro.body"
    },
    {
      "id": "anthro.body",
      "type": "composite",
      "title": "Let's start with your measurements",
      "fields": [
        [
          {
            "id": "height_ft",
            "type": "number",
            "label": "Height (ft)",
            "required": true,
            "min": 3,
            "max": 8
          },
          {
            "id": "height_in",
            "type": "number",
            "label": "(in)",
            "required": true,
            "min": 0,
            "max": 11
          }
        ],
        {
          "id": "weight",
          "type": "number",
          "label": "Current weight (lb)",
          "min": 70,
          "max": 700,
          "required": true
        },
        {
          "id": "highest_weight",
          "type": "number",
          "label": "Highest weight you've been (lb)",
          "help_text": "Your weight history helps us choose the right approach",
          "min": 70,
          "max": 700,
          "required": true
        }
      ],
      "calculations": [
        {
          "id": "bmi",
          "formula": "703*weight/((height_ft*12+height_in)**2)"
        }
      ],
      "next_logic": [
        {
          "if": "calc.bmi < 18.5",
          "go_to": "safety.underweight"
        },
        {
          "if": "calc.bmi < 27",
          "go_to": "safety.low_bmi"
        },
        {
          "else": "demographics.complete"
        }
      ]
    },
    {
      "id": "safety.underweight",
      "type": "content",
      "status": "warning",
      "headline": "You're already at a healthy weight",
      "body": "Based on your measurements, weight loss medication isn't recommended. If you'd like, we can provide guidance on healthy nutrition and fitness instead.",
      "cta_primary": {
        "label": "Continue"
      },
      "next": "demographics.complete"
    },
    {
      "id": "safety.low_bmi",
      "type": "content",
      "status": "warning",
      "headline": "We'll need to review your full health picture",
      "body": "FDA guidelines typically recommend GLP-1 medications for people with a BMI of 27 or higher (if they have weight-related health conditions) or 30 or higher (without other conditions). Our medical team will look at your complete health profile to figure out the best path forward.",
      "cta_primary": {
        "label": "Continue"
      },
      "next": "demographics.complete"
    },
    {
      "id": "demographics.complete",
      "type": "composite",
      "title": "A few more details",
      "fields": [
        {
          "id": "sex_birth",
          "type": "single_select",
          "label": "Sex assigned at birth",
          "help_text": "This affects how your body processes medications",
          "required": true,
          "options": [
            { "value": "male", "label": "Male" },
            { "value": "female", "label": "Female" },
            { "value": "intersex", "label": "Intersex" },
            { "value": "no_say", "label": "Prefer not to say" }
          ]
        },
        {
          "id": "ethnicity",
          "type": "multi_select",
          "label": "Ethnicity (optional)",
          "help_text": "Some medications work differently across ethnic backgrounds",
          "options": [
            { "value": "asian", "label": "Asian" },
            { "value": "black", "label": "Black or African American" },
            { "value": "hispanic", "label": "Hispanic or Latino" },
            { "value": "native_american", "label": "Native American" },
            { "value": "pacific_islander", "label": "Pacific Islander" },
            { "value": "white", "label": "White or Caucasian" },
            { "value": "other", "label": "Other" }
          ]
        }
      ],
      "next": "transition.safety_screening"
    },
    {
      "id": "transition.safety_screening",
      "type": "content",
      "headline": "Now for some health and safety questions",
      "body": "We're about to ask about some sensitive topics. Everything you share is private and only seen by licensed medical providers. These questions help us keep you safe.",
      "image": "/images/transition-safety-screening.jpg",
      "cta_primary": {
        "label": "Continue"
      },
      "next": "anthro.goals"
    },
    {
      "id": "anthro.goals",
      "type": "composite",
      "title": "What are you working toward?",
      "fields": [
        {
          "id": "goal_weight",
          "type": "number",
          "label": "Your target weight (lb)",
          "min": 80,
          "max": 500,
          "required": true
        },
        {
          "id": "activity_level",
          "type": "single_select",
          "label": "How active are you on a typical day?",
          "required": true,
          "options": [
            { "value": "sedentary", "label": "Mostly sedentary - desk work, minimal movement" },
            { "value": "light", "label": "Lightly active - some walking throughout the day" },
            { "value": "moderate", "label": "Moderately active - regular walking or exercise" },
            { "value": "active", "label": "Active - consistent exercise routine" },
            { "value": "very_active", "label": "Very active - intensive daily training" }
          ]
        }
      ],
      "next": "safety.eating_disorder"
    },
    {
      "id": "safety.eating_disorder",
      "type": "multi_select",
      "title": "Has any of the following applied to you?",
      "help_text": "Certain eating patterns can affect treatment safety. Your responses are confidential and help our medical team make the right recommendations.",
      "options": [
        { "value": "purging", "label": "Self-induced vomiting for weight control" },
        { "value": "binge", "label": "Episodes of eating large quantities without control" },
        { "value": "restriction", "label": "Extreme calorie restriction driven by intense weight concerns" },
        { "value": "diagnosed", "label": "Clinical diagnosis of anorexia, bulimia, or binge eating disorder" },
        { "value": "none", "label": "None of the above" }
      ],
      "required": true,
      "next_logic": [
        {
          "if": "answer contains ['purging','binge','restriction','diagnosed']",
          "go_to": "safety.eating_disorder_warning"
        },
        {
          "else": "medical.mental_health_diagnosis"
        }
      ]
    },
    {
      "id": "safety.eating_disorder_warning",
      "type": "content",
      "status": "warning",
      "headline": "Special considerations for your safety",
      "body": "When eating disorder history is present, weight loss medications carry increased risks including dangerous electrolyte disturbances and potential cardiac complications.\n\nOur medical team will carefully evaluate whether medication-based treatment is appropriate. If you engage in purging behaviors, severe caloric restriction, or your BMI drops below 18.5 during treatment, immediate medical consultation is required.",
      "cta_primary": {
        "label": "I Understand These Risks"
      },
      "next": "medical.mental_health_diagnosis"
    },
    {
      "id": "medical.mental_health_diagnosis",
      "type": "multi_select",
      "title": "Have you been diagnosed with any mental health conditions?",
      "help_text": "Some medications can affect mood, so we need a complete picture.",
      "options": [
        { "value": "depression", "label": "Depression" },
        { "value": "anxiety", "label": "Anxiety" },
        { "value": "bipolar", "label": "Bipolar disorder" },
        { "value": "panic", "label": "Panic disorder" },
        { "value": "recent_hospitalization", "label": "Psychiatric hospitalization within last 3 months" },
        { "value": "other", "label": "Other" },
        { "value": "none", "label": "None of these" }
      ],
      "other_text_id": "mental_health_other",
      "next": "medical.suicide_risk"
    },
    {
      "id": "medical.suicide_risk",
      "type": "single_select",
      "title": "Do you currently have thoughts of harming yourself or others?",
      "help_text": "We ask this so your provider can determine the safest treatment for you.",
      "auto_advance": false,
      "options": [
        { "value": "no", "label": "No" },
        { "value": "yes", "label": "Yes" }
      ],
      "required": true,
      "next_logic": [
        {
          "if": "answer == 'yes'",
          "go_to": "safety.mental_health"
        },
        {
          "else": "medical.substance_use"
        }
      ]
    },
    {
      "id": "safety.mental_health",
      "type": "content",
      "status": "warning",
      "headline": "Your safety is our priority",
      "body": "Thank you for sharing that. Some weight loss medications can affect mood, so we'll need to discuss this carefully with a provider.\n\nIf you're in crisis, please reach the National Suicide Prevention Lifeline at 988 or text HOME to 741741.\n\nOur team will review your case with extra care.",
      "cta_primary": {
        "label": "Continue"
      },
      "next": "medical.substance_use"
    },
    {
      "id": "medical.substance_use",
      "type": "composite",
      "title": "Substance use screening",
      "help_text": "Required for safe prescribing. This information is confidential.",
      "fields": [
        {
          "id": "alcohol",
          "type": "single_select",
          "label": "How often do you consume alcohol?",
          "required": true,
          "options": [
            { "value": "none", "label": "I don't drink" },
            { "value": "social", "label": "Socially (1-4 drinks/week)" },
            { "value": "moderate", "label": "Moderate (5-10 drinks/week)" },
            { "value": "heavy", "label": "Heavy (10+ drinks/week)" }
          ]
        },
        {
          "id": "substances",
          "type": "multi_select",
          "label": "Have you used any of these in the past 6 months?",
          "options": [
            { "value": "cocaine", "label": "Cocaine" },
            { "value": "opioids", "label": "Opioids" },
            { "value": "meth", "label": "Methamphetamine" },
            { "value": "cannabis", "label": "Cannabis" },
            { "value": "none", "label": "None of these" }
          ]
        }
      ],
      "next": "transition.medical_history"
    },
    {
      "id": "transition.medical_history",
      "type": "content",
      "headline": "Thank you for sharing that",
      "body": "That was the hardest part. Now we'll ask about your medical history so we can ensure any treatment is safe and appropriate for you.",
      "cta_primary": {
        "label": "Continue"
      },
      "next": "medical.diabetes"
    },
    {
      "id": "medical.diabetes",
      "type": "single_select",
      "title": "Do you have diabetes?",
      "auto_advance": false,
      "options": [
        { "value": "type2", "label": "Type 2 diabetes" },
        { "value": "type1", "label": "Type 1 diabetes" },
        { "value": "prediabetes", "label": "Prediabetes" },
        { "value": "no", "label": "No" }
      ],
      "required": true,
      "next_logic": [
        {
          "if": "answer == 'type1'",
          "go_to": "safety.type1"
        },
        {
          "if": "demographics.sex_birth == 'female'",
          "go_to": "medical.pregnancy"
        },
        {
          "else": "medical.conditions"
        }
      ]
    },
    {
      "id": "safety.type1",
      "type": "content",
      "status": "warning",
      "headline": "GLP-1 medications aren't approved for Type 1",
      "body": "These medications aren't FDA-approved for managing Type 1 diabetes. But we can still help with lifestyle and nutrition support, and we're happy to coordinate with your endocrinologist on safe weight management approaches.",
      "cta_primary": {
        "label": "Continue"
      },
      "next_logic": [
        {
          "if": "demographics.sex_birth == 'female'",
          "go_to": "medical.pregnancy"
        },
        {
          "else": "medical.conditions"
        }
      ]
    },
    {
      "id": "medical.pregnancy",
      "type": "single_select",
      "title": "Are you pregnant, planning to get pregnant, or nursing?",
      "auto_advance": false,
      "options": [
        { "value": "pregnant", "label": "Pregnant" },
        { "value": "planning", "label": "Planning pregnancy soon" },
        { "value": "nursing", "label": "Nursing" },
        { "value": "no", "label": "None of these" }
      ],
      "required": true,
      "next_logic": [
        {
          "if": "answer in ['pregnant','planning','nursing']",
          "go_to": "safety.pregnancy"
        },
        {
          "else": "medical.conditions"
        }
      ]
    },
    {
      "id": "safety.pregnancy",
      "type": "content",
      "status": "warning",
      "headline": "These medications aren't safe during pregnancy or nursing",
      "body": "GLP-1 medications aren't recommended if you're pregnant, planning pregnancy, or nursing. We can create a different plan focused on balanced nutrition and safe physical activity instead.",
      "cta_primary": {
        "label": "Continue"
      },
      "next": "medical.conditions"
    },
    {
      "id": "medical.conditions",
      "type": "multi_select",
      "title": "Do you have any of these conditions?",
      "help_text": "Check everything that applies. We need your complete medical history to prescribe safely.",
      "options": [
        { "value": "thyroid_cancer", "label": "Medullary thyroid cancer (you or family member)" },
        { "value": "men2", "label": "MEN2 syndrome (you or family member)" },
        { "value": "pancreatitis", "label": "History of pancreatitis or gallbladder problems" },
        { "value": "gastroparesis", "label": "Gastroparesis (slow stomach emptying)" },
        { "value": "type2_diabetes", "label": "Type 2 diabetes (if not mentioned above)" },
        { "value": "kidney", "label": "Kidney disease" },
        { "value": "liver", "label": "Liver disease" },
        { "value": "hypertension", "label": "High blood pressure" },
        { "value": "cholesterol", "label": "High cholesterol" },
        { "value": "heart", "label": "Heart disease or previous heart attack" },
        { "value": "stroke", "label": "Stroke or TIA" },
        { "value": "sleep_apnea", "label": "Sleep apnea" },
        { "value": "ibs", "label": "IBS or chronic digestive issues" },
        { "value": "gerd", "label": "GERD or chronic reflux" },
        { "value": "seizures", "label": "Seizure disorder or epilepsy" },
        { "value": "none", "label": "None of these" },
        { "value": "other", "label": "Other condition" }
      ],
      "other_text_id": "medical.other_detail",
      "next_logic": [
        { "if": "answer contains 'thyroid_cancer'", "go_to": "safety.thyroid" },
        { "if": "answer contains 'men2'", "go_to": "safety.thyroid" },
        { "if": "answer contains 'pancreatitis'", "go_to": "safety.pancreatitis" },
        { "else": "medical.medications" }
      ]
    },
    {
      "id": "safety.thyroid",
      "type": "content",
      "status": "warning",
      "headline": "GLP-1 medications aren't safe with this history",
      "body": "If you or a family member has had medullary thyroid cancer or MEN2 syndrome, GLP-1 medications aren't recommended. We can build you an alternative weight management plan focused on nutrition, activity, and other treatment options.",
      "cta_primary": {
        "label": "Continue"
      },
      "next": "medical.medications"
    },
    {
      "id": "safety.pancreatitis",
      "type": "content",
      "status": "warning",
      "headline": "We need to be careful with pancreatitis history",
      "body": "If you've had pancreatitis or active gallbladder disease, GLP-1 medications might not be safe—they can increase the risk of it happening again. Our medical team will look at whether lifestyle approaches or different medications would be better for you.",
      "cta_primary": {
        "label": "Continue"
      },
      "next": "medical.medications"
    },
    {
      "id": "medical.medications",
      "type": "multi_select",
      "title": "What medications and supplements are you currently taking?",
      "help_text": "Please include prescriptions, over-the-counter drugs, and any supplements.",
      "options": [
        { "value": "insulin", "label": "Insulin or diabetes medications" },
        { "value": "blood_thinners", "label": "Blood thinners (warfarin, etc.)" },
        { "value": "heart_meds", "label": "Heart or blood pressure medications" },
        { "value": "stimulants", "label": "Stimulants (ADHD meds, appetite suppressants)" },
        { "value": "antidepressants", "label": "Psychiatric medications" },
        { "value": "thyroid", "label": "Thyroid medication" },
        { "value": "none", "label": "No prescription medications" },
        { "value": "other", "label": "Other medications or supplements" }
      ],
      "next_logic": [
        { "if": "answer contains 'other'", "go_to": "medical.medications_other_detail" },
        { "else": "medical.allergies" }
      ]
    },
    {
      "id": "medical.medications_other_detail",
      "type": "text",
      "title": "What other medications or supplements are you taking?",
      "placeholder": "List any other prescription medications, OTC drugs, or supplements",
      "help_text": "Please list the names of any other medications or supplements you're currently taking",
      "required": true,
      "next": "medical.allergies"
    },
    {
      "id": "medical.allergies",
      "type": "text",
      "title": "Any medication allergies?",
      "placeholder": "List medications that caused allergic reactions, or write 'None'",
      "help_text": "This helps us avoid prescribing anything you've reacted to before",
      "required": true,
      "next": "transition.treatment_preferences"
    },
    {
      "id": "transition.treatment_preferences",
      "type": "content",
      "headline": "Almost done",
      "body": "Nice work getting through all that. Now let's talk about your treatment preferences so we can design the right plan for you.",
      "image": "/images/transition-treatment-preferences.jpg",
      "cta_primary": {
        "label": "Continue"
      },
      "next": "meds.status"
    },
    {
      "id": "meds.status",
      "type": "single_select",
      "title": "Have you used GLP-1 medications before?",
      "help_text": "These include semaglutide (Ozempic, Wegovy), tirzepatide (Mounjaro, Zepbound), and compounded versions.",
      "auto_advance": false,
      "options": [
        { "value": "currently_taking", "label": "I'm currently taking one" },
        { "value": "past_use", "label": "I've used one before but not now" },
        { "value": "never", "label": "I've never used one" }
      ],
      "required": true,
      "next_logic": [
        {
          "if": "flags contains 'flag_no_medication'",
          "go_to": "motivation.focus"
        },
        {
          "if": "answer == 'currently_taking'",
          "go_to": "meds.current_details"
        },
        {
          "if": "answer == 'past_use'",
          "go_to": "meds.past_details"
        },
        {
          "else": "meds.interest"
        }
      ]
    },
    {
      "id": "meds.current_details",
      "type": "composite",
      "title": "Tell us about your current medication",
      "fields": [
        {
          "id": "current_med_name",
          "type": "single_select",
          "label": "Which one?",
          "required": true,
          "options": [
            { "value": "semaglutide_brand", "label": "Brand semaglutide (Ozempic/Wegovy)" },
            { "value": "semaglutide_compounded", "label": "Compounded semaglutide" },
            { "value": "tirzepatide_brand", "label": "Brand tirzepatide (Mounjaro/Zepbound)" },
            { "value": "tirzepatide_compounded", "label": "Compounded tirzepatide" },
            { "value": "liraglutide", "label": "Liraglutide (Saxenda)" },
            { "value": "other", "label": "Other GLP-1" }
          ]
        },
        {
          "id": "current_dose",
          "type": "single_select",
          "label": "Current dose",
          "required": true,
          // FIX: Added empty `options` array to satisfy the SelectField type when using conditional_options.
          "options": [],
          "conditional_options": {
            "based_on": "current_med_name",
            "options_map": {
              "semaglutide_brand": [
                { "value": "0.25mg_weekly", "label": "0.25 mg weekly" },
                { "value": "0.5mg_weekly", "label": "0.5 mg weekly" },
                { "value": "1mg_weekly", "label": "1 mg weekly" },
                { "value": "1.7mg_weekly", "label": "1.7 mg weekly" },
                { "value": "2mg_weekly", "label": "2 mg weekly" },
                { "value": "2.4mg_weekly", "label": "2.4 mg weekly" }
              ],
              "semaglutide_compounded": [
                { "value": "0.25mg_weekly", "label": "0.25 mg weekly" },
                { "value": "0.5mg_weekly", "label": "0.5 mg weekly" },
                { "value": "1mg_weekly", "label": "1 mg weekly" },
                { "value": "1.7mg_weekly", "label": "1.7 mg weekly" },
                { "value": "2mg_weekly", "label": "2 mg weekly" },
                { "value": "2.4mg_weekly", "label": "2.4 mg weekly" },
                { "value": "2.5mg_weekly", "label": "2.5 mg weekly" }
              ],
              "tirzepatide_brand": [
                { "value": "2.5mg_weekly", "label": "2.5 mg weekly" },
                { "value": "5mg_weekly", "label": "5 mg weekly" },
                { "value": "7.5mg_weekly", "label": "7.5 mg weekly" },
                { "value": "10mg_weekly", "label": "10 mg weekly" },
                { "value": "12.5mg_weekly", "label": "12.5 mg weekly" },
                { "value": "15mg_weekly", "label": "15 mg weekly" }
              ],
              "tirzepatide_compounded": [
                { "value": "2.5mg_weekly", "label": "2.5 mg weekly" },
                { "value": "5mg_weekly", "label": "5 mg weekly" },
                { "value": "7.5mg_weekly", "label": "7.5 mg weekly" },
                { "value": "10mg_weekly", "label": "10 mg weekly" },
                { "value": "12.5mg_weekly", "label": "12.5 mg weekly" },
                { "value": "15mg_weekly", "label": "15 mg weekly" }
              ],
              "liraglutide": [
                { "value": "0.6mg_daily", "label": "0.6 mg daily" },
                { "value": "1.2mg_daily", "label": "1.2 mg daily" },
                { "value": "1.8mg_daily", "label": "1.8 mg daily" },
                { "value": "2.4mg_daily", "label": "2.4 mg daily" },
                { "value": "3mg_daily", "label": "3 mg daily" }
              ],
              "other": [
                { "value": "other", "label": "Other dose (will specify below)" }
              ]
            }
          }
        },
        {
          "id": "current_dose_other",
          "type": "text",
          "label": "Please specify your dose",
          "placeholder": "e.g., 0.75 mg weekly",
          "required": true,
          "conditional_display": {
            "show_if": "current_med_name == 'other' OR current_dose == 'other'"
          }
        },
        {
          "id": "weeks_on_dose",
          "type": "number",
          "label": "How many weeks on this dose?",
          "min": 0,
          "max": 104,
          "required": true
        },
        {
          "id": "current_provider",
          "type": "text",
          "label": "Who's prescribing it?",
          "placeholder": "e.g., my doctor, telehealth service",
          "required": true
        }
      ],
      "next": "meds.provider_switch"
    },
    {
      "id": "meds.provider_switch",
      "type": "single_select",
      "title": "If we prescribe a GLP-1, will you stop your current one?",
      "help_text": "It's not safe to take GLP-1 medications from multiple providers at the same time.",
      "auto_advance": false,
      "options": [
        { "value": "yes_switch", "label": "Yes, I'll stop my current medication and let my provider know" },
        { "value": "no_continue", "label": "No, I want to stay with my current provider" }
      ],
      "required": true,
      "next": "meds.side_effects"
    },
    {
      "id": "meds.past_details",
      "type": "composite",
      "title": "Tell us about your past experience",
      "fields": [
        {
          "id": "past_med_name",
          "type": "text",
          "label": "Which medication?",
          "placeholder": "e.g., Wegovy, compounded semaglutide",
          "required": true
        },
        {
          "id": "past_duration",
          "type": "text",
          "label": "How long did you use it?",
          "placeholder": "e.g., 4 months",
          "required": true
        },
        {
          "id": "why_stopped",
          "type": "text",
          "label": "Why did you stop?",
          "placeholder": "e.g., side effects, cost, reached my goal",
          "required": true
        }
      ],
      "next": "meds.side_effects"
    },
    {
      "id": "meds.side_effects",
      "type": "multi_select",
      "title": "Did you have any side effects?",
      "help_text": "This helps us plan your treatment better.",
      "options": [
        { "value": "nausea", "label": "Nausea" },
        { "value": "vomiting", "label": "Vomiting" },
        { "value": "constipation", "label": "Constipation" },
        { "value": "diarrhea", "label": "Diarrhea" },
        { "value": "reflux", "label": "Acid reflux" },
        { "value": "fatigue", "label": "Fatigue" },
        { "value": "none", "label": "No side effects" }
      ],
      "next": "motivation.focus"
    },
    {
      "id": "meds.interest",
      "type": "single_select",
      "title": "Are you interested in medication as part of your plan?",
      "auto_advance": false,
      "options": [
        { "value": "yes", "label": "Yes" },
        { "value": "maybe", "label": "I'd like to learn more first" },
        { "value": "no", "label": "No, I'd prefer no medication" }
      ],
      "required": true,
      "next": "motivation.focus"
    },
    {
      "id": "motivation.focus",
      "type": "multi_select",
      "title": "What do you want help with most?",
      "help_text": "Pick as many as you want.",
      "options": [
        { "value": "nutrition", "label": "Nutrition" },
        { "value": "activity", "label": "Exercise and movement" },
        { "value": "habits", "label": "Building better habits" },
        { "value": "mindset", "label": "Mindset and motivation" },
        { "value": "other", "label": "Something else" }
      ],
      "other_text_id": "motivation.other_detail",
      "next": "motivation.journey"
    },
    {
      "id": "motivation.journey",
      "type": "text",
      "title": "Tell us about your weight loss journey",
      "placeholder": "Share anything you think would help us understand your situation better - what you've tried, what's been hard, what you're hoping for...",
      "help_text": "This is optional, but it helps us personalize your plan. Write as much or as little as you'd like.",
      "required": false,
      "multiline": true,
      "next": "side_effects.baseline"
    },
    {
      "id": "side_effects.baseline",
      "type": "multi_select",
      "title": "Do you currently experience any of these symptoms?",
      "help_text": "We're asking about your baseline, before starting any new treatment.",
      "options": [
        { "value": "nausea", "label": "Nausea" },
        { "value": "vomiting", "label": "Vomiting" },
        { "value": "constipation", "label": "Constipation" },
        { "value": "diarrhea", "label": "Diarrhea" },
        { "value": "reflux", "label": "Heartburn or acid reflux" },
        { "value": "bloating", "label": "Bloating" },
        { "value": "fatigue", "label": "Fatigue or low energy" },
        { "value": "headaches", "label": "Frequent headaches" },
        { "value": "none", "label": "None of these" }
      ],
      "next": "side_effects.management_interest"
    },
    {
      "id": "side_effects.management_interest",
      "type": "single_select",
      "title": "Would you be interested in personalized treatment to help manage side effects?",
      "help_text": "If you experience side effects from your medication, we can provide additional support and treatments to help manage them.",
      "auto_advance": false,
      "options": [
        { "value": "yes", "label": "Yes, I'd like side effect management if needed" },
        { "value": "no", "label": "No, I'd prefer to manage them on my own" },
        { "value": "not_sure", "label": "I'm not sure, tell me more later" }
      ],
      "required": true,
      "next": "contact.details"
    },
    {
      "id": "contact.details",
      "type": "composite",
      "title": "Where should we reach you?",
      "help_text": "We'll use this to send updates and, if prescribed, ship your medication.",
      "fields": [
        [
          {
            "id": "first_name",
            "type": "text",
            "label": "First Name",
            "required": true
          },
          {
            "id": "last_name",
            "type": "text",
            "label": "Last Name",
            "required": true
          }
        ],
        {
          "id": "phone",
          "type": "text",
          "label": "Phone number",
          "placeholder": "(555) 123-4567",
          "required": true
        },
        {
          "id": "shipping_address",
          "type": "text",
          "label": "Street address",
          "placeholder": "123 Main St, Apt 4B",
          "required": true
        },
        {
          "id": "shipping_city",
          "type": "text",
          "label": "City",
          "required": true
        },
        {
          "id": "shipping_state",
          "type": "single_select",
          "label": "State",
          "required": true,
          "options": [
            { "value": "AL", "label": "Alabama" },
            { "value": "AK", "label": "Alaska" },
            { "value": "AZ", "label": "Arizona" },
            { "value": "AR", "label": "Arkansas" },
            { "value": "CA", "label": "California" },
            { "value": "CO", "label": "Colorado" },
            { "value": "CT", "label": "Connecticut" },
            { "value": "DE", "label": "Delaware" },
            { "value": "FL", "label": "Florida" },
            { "value": "GA", "label": "Georgia" },
            { "value": "HI", "label": "Hawaii" },
            { "value": "ID", "label": "Idaho" },
            { "value": "IL", "label": "Illinois" },
            { "value": "IN", "label": "Indiana" },
            { "value": "IA", "label": "Iowa" },
            { "value": "KS", "label": "Kansas" },
            { "value": "KY", "label": "Kentucky" },
            { "value": "LA", "label": "Louisiana" },
            { "value": "ME", "label": "Maine" },
            { "value": "MD", "label": "Maryland" },
            { "value": "MA", "label": "Massachusetts" },
            { "value": "MI", "label": "Michigan" },
            { "value": "MN", "label": "Minnesota" },
            { "value": "MS", "label": "Mississippi" },
            { "value": "MO", "label": "Missouri" },
            { "value": "MT", "label": "Montana" },
            { "value": "NE", "label": "Nebraska" },
            { "value": "NV", "label": "Nevada" },
            { "value": "NH", "label": "New Hampshire" },
            { "value": "NJ", "label": "New Jersey" },
            { "value": "NM", "label": "New Mexico" },
            { "value": "NY", "label": "New York" },
            { "value": "NC", "label": "North Carolina" },
            { "value": "ND", "label": "North Dakota" },
            { "value": "OH", "label": "Ohio" },
            { "value": "OK", "label": "Oklahoma" },
            { "value": "OR", "label": "Oregon" },
            { "value": "PA", "label": "Pennsylvania" },
            { "value": "RI", "label": "Rhode Island" },
            { "value": "SC", "label": "South Carolina" },
            { "value": "SD", "label": "South Dakota" },
            { "value": "TN", "label": "Tennessee" },
            { "value": "TX", "label": "Texas" },
            { "value": "UT", "label": "Utah" },
            { "value": "VT", "label": "Vermont" },
            { "value": "VA", "label": "Virginia" },
            { "value": "WA", "label": "Washington" },
            { "value": "WV", "label": "West Virginia" },
            { "value": "WI", "label": "Wisconsin" },
            { "value": "WY", "label": "Wyoming" },
            { "value": "DC", "label": "District of Columbia" }
          ]
        },
        {
          "id": "shipping_zip",
          "type": "text",
          "label": "ZIP code",
          "placeholder": "12345",
          "required": true,
          "validation": {
            "pattern": "^\\d{5}(-\\d{4})?$",
            "error": "Please enter a valid ZIP code"
          }
        }
      ],
      "next": "consent.terms"
    },
    {
      "id": "consent.terms",
      "type": "consent",
      "title": "Last step",
      "items": [
        {
          "id": "tos",
          "label": "I agree to the Terms of Use, Privacy Policy, and Telehealth Consent.",
          "links": [
            { "label": "Terms of Use", "url": "https://hybrid.com/terms" },
            { "label": "Privacy Policy", "url": "https://hybrid.com/privacy" },
            { "label": "Telehealth Consent", "url": "https://hybrid.com/telehealth" }
          ],
          "required": true
        },
        {
          "id": "marketing_opt_in",
          "label": "Send me health tips and updates",
          "required": false
        }
      ],
      "next": "review.summary"
    },
    {
      "id": "review.summary",
      "type": "review",
      "title": "Does everything look right?",
      "help_text": "Please double-check your answers before submitting.",
      "next": "end"
    },
    {
      "id": "end",
      "type": "terminal",
      "status": "success",
      "title": "Thanks for completing your assessment",
      "body": "We've received your information. Watch your email for next steps."
    }
  ],
  "eligibility_rules": [
    {
      "rule": "underweight_no_meds",
      "if": "calc.bmi < 18.5",
      "action": "flag_no_medication"
    },
    {
      "rule": "low_bmi_review",
      "if": "calc.bmi < 27",
      "action": "flag_requires_comorbidity_check"
    },
    {
      "rule": "thyroid_no_meds",
      "if": "medical.conditions contains ['thyroid_cancer','men2']",
      "action": "flag_no_medication"
    },
    {
      "rule": "pancreatitis_no_meds",
      "if": "medical.conditions contains 'pancreatitis'",
      "action": "flag_no_medication"
    },
    {
      "rule": "eating_disorder_flag",
      "if": "safety.eating_disorder contains ['purging','binge','restriction','diagnosed']",
      "action": "flag_eating_disorder_review"
    },
    {
      "rule": "type1_no_meds",
      "if": "medical.diabetes == 'type1'",
      "action": "flag_no_medication"
    },
    {
      "rule": "pregnant_no_meds",
      "if": "medical.pregnancy in ['pregnant','planning','nursing']",
      "action": "flag_no_medication"
    },
    {
      "rule": "mental_health_flag",
      "if": "medical.suicide_risk == 'yes'",
      "action": "flag_mental_health_review"
    },
    {
      "rule": "substance_use_flag",
      "if": "medical.substance_use.alcohol == 'heavy' or medical.substance_use.substances contains ['cocaine','meth','opioids']",
      "action": "flag_substance_review"
    },
    {
      "rule": "pediatric_consent_required",
      "if": "calc.age < 18",
      "action": "flag_parental_consent_required"
    }
  ],
  "provider_packet": {
    "include_fields": [
      "goal.range",
      "demographics.state",
      "demographics.dob",
      "demographics.sex_birth",
      "demographics.ethnicity",
      "first_name",
      "last_name",
      "email",
      "parent_name",
      "parent_email",
      "parent_phone",
      "height_ft",
      "height_in",
      "weight",
      "highest_weight",
      "goal_weight",
      "activity_level",
      "safety.eating_disorder",
      "medical.mental_health_diagnosis",
      "mental_health_other",
      "medical.suicide_risk",
      "medical.substance_use.alcohol",
      "medical.substance_use.substances",
      "medical.diabetes",
      "medical.pregnancy",
      "medical.conditions",
      "medical.other_detail",
      "medical.medications",
      "medical.medications_other_detail",
      "medical.allergies",
      "meds.status",
      "current_med_name",
      "current_dose",
      "weeks_on_dose",
      "current_provider",
      "meds.provider_switch",
      "past_med_name",
      "past_duration",
      "why_stopped",
      "meds.side_effects",
      "meds.interest",
      "motivation.focus",
      "motivation.other_detail",
      "motivation.journey",
      "side_effects.baseline",
      "side_effects.management_interest",
      "phone",
      "shipping_address",
      "shipping_city",
      "shipping_state",
      "shipping_zip"
    ],
    "summary_template": "Patient: {email} | Phone: {phone} | State: {demographics.state} | Age: {calc.age} | Sex: {demographics.sex_birth} | BMI: {calc.bmi:.1f} | Goal: -{goal.range} lb to {goal_weight} lb | ED History: {safety.eating_disorder} | Mental Health: {medical.mental_health_diagnosis} | Suicide Risk: {medical.suicide_risk} | Diabetes: {medical.diabetes} | Current GLP-1: {meds.status} | Conditions: {medical.conditions} | Medications: {medical.medications} | Allergies: {medical.allergies} | Side Effect Management: {side_effects.management_interest}"
  }
};

export default formConfig;