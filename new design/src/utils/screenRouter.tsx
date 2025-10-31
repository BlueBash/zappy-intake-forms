import { Screen } from '../types';
import {
  TextScreen,
  NumberScreen,
  DateScreen,
  SingleSelectScreen,
  MultiSelectScreen,
  ConsentScreen,
  ReviewScreen,
  TerminalScreen,
  MedicationSelectionScreen,
  MedicationOptionsScreen,
  PlanSelectionScreen,
  DiscountCodeScreen,
  InterstitialScreen,
  GLP1HistoryScreen,
  ScreenProps,
} from '../components/screens';
import HeroScreen from '../components/screens/HeroScreen';
import MedicationPreferenceScreen from '../components/screens/MedicationPreferenceScreen';
import PlanSelectionExpanded from '../components/common/PlanSelectionExpanded';

interface RouterProps extends Omit<ScreenProps, 'screen'> {
  screen: Screen;
  allScreens?: Screen[];
  providerFields?: string[];
  goToScreen?: (screenId: string) => void;
  isSubmitting?: boolean;
  submissionError?: string | null;
}

export function renderScreen(props: RouterProps) {
  const { screen } = props;
  
  // Handle different screen types
  const screenType = screen.type || 'text';

  switch (screenType) {
    case 'hero':
      return <HeroScreen {...props} screen={screen as any} />;
    
    case 'text':
      return <TextScreen {...props} screen={screen as any} />;
    
    case 'number':
      return <NumberScreen {...props} screen={screen as any} />;
    
    case 'date':
      return <DateScreen {...props} screen={screen as any} />;
    
    case 'single_select':
      return <SingleSelectScreen {...props} screen={screen as any} />;
    
    case 'multi_select':
      return <MultiSelectScreen {...props} screen={screen as any} />;
    
    case 'consent':
      return <ConsentScreen {...props} screen={screen as any} />;
    
    case 'review':
      if (!props.allScreens || !props.providerFields || !props.goToScreen) {
        console.error('ReviewScreen requires allScreens, providerFields, and goToScreen props');
        return null;
      }
      return (
        <ReviewScreen
          screen={screen as any}
          answers={props.answers}
          onSubmit={props.onSubmit}
          allScreens={props.allScreens}
          providerFields={props.providerFields}
          goToScreen={props.goToScreen}
          showBack={props.showBack}
          onBack={props.onBack}
          isSubmitting={props.isSubmitting}
          submissionError={props.submissionError}
        />
      );
    
    case 'terminal':
      return <TerminalScreen {...props} screen={screen as any} />;
    
    case 'medication_selection':
      return <MedicationSelectionScreen {...props} screen={screen as any} />;
    
    case 'medication_options':
      return <MedicationOptionsScreen {...props} screen={screen as any} />;
    
    case 'plan_selection':
      return <PlanSelectionScreen {...props} screen={screen as any} />;
    
    case 'discount_code':
      return <DiscountCodeScreen {...props} screen={screen as any} />;
    
    case 'interstitial':
      return <InterstitialScreen screen={screen as any} onSubmit={props.onSubmit} />;
    
    case 'glp1_history':
      return (
        <GLP1HistoryScreen
          onNext={(data) => props.onSubmit(data)}
          onBack={props.onBack}
          initialData={props.answers}
        />
      );
    
    case 'medication_preference':
      return <MedicationPreferenceScreen {...props} screen={screen as any} />;
    
    case 'plan_selection_expanded':
      // Demo screen using PlanSelectionExpanded component
      // This wraps the component in a screen layout context
      return (
        <div className="min-h-screen bg-[#FDFBF7] p-6">
          <div className="max-w-6xl mx-auto">
            <div className="mb-8 text-center">
              <h2 className="text-3xl text-neutral-900 mb-2">{(screen as any).title || 'Choose your plan'}</h2>
              {(screen as any).help_text && (
                <p className="text-neutral-600">{(screen as any).help_text}</p>
              )}
            </div>
            <PlanSelectionExpanded
              serviceType="Weight Loss"
              state={props.answers['demographics.state'] || props.answers['state'] || 'CA'}
              medication={props.answers['selected_medication'] || 'Semaglutide'}
              pharmacyName={props.answers['selected_pharmacy'] || 'Pharmacy Partner'}
              selectedPlanId={props.answers['subscription.plan_expanded_demo'] || ''}
              onSelect={(planId, plan) => {
                props.updateAnswer('subscription.plan_expanded_demo', planId);
                props.updateAnswer('subscription.plan_expanded_demo_details', plan);
              }}
              requiresDoseStrategy={true}
              doseStrategy={props.answers['dose_strategy'] || 'maintenance'}
              onDoseStrategyChange={(value) => props.updateAnswer('dose_strategy', value)}
            />
            <div className="mt-8 flex justify-between">
              {props.showBack && (
                <button
                  onClick={props.onBack}
                  className="px-6 py-3 text-neutral-600 hover:text-neutral-900 transition-colors"
                >
                  ← Back
                </button>
              )}
              <button
                onClick={() => props.onSubmit()}
                className="ml-auto px-8 py-3 bg-gradient-to-r from-[#0D9488] to-[#14B8A6] text-white rounded-xl hover:shadow-lg transition-all"
              >
                Continue →
              </button>
            </div>
          </div>
        </div>
      );
    
    // Custom screen types based on screen ID patterns
    default:
      // Check screen ID for GLP-1 history
      if (screen.id === 'treatment.glp1_history' || screen.id?.includes('glp1_history')) {
        return (
          <GLP1HistoryScreen
            onNext={(data) => props.onSubmit(data)}
            onBack={props.onBack}
            initialData={props.answers}
          />
        );
      }
      
      // Check screen ID for medication/plan selection screens
      if (screen.id?.includes('medication_selection') || screen.id?.includes('treatment.medication')) {
        return <MedicationSelectionScreen {...props} screen={screen as any} />;
      }
      
      if (screen.id?.includes('medication_options')) {
        return <MedicationOptionsScreen {...props} screen={screen as any} />;
      }
      
      if (screen.id?.includes('plan_selection') || screen.id?.includes('treatment.plan')) {
        return <PlanSelectionScreen {...props} screen={screen as any} />;
      }
      
      if (screen.id?.includes('discount')) {
        return <DiscountCodeScreen {...props} screen={screen as any} />;
      }
      
      // Default fallback to TextScreen for unknown types
      console.warn(`Unknown screen type: ${screenType}. Falling back to TextScreen.`);
      return <TextScreen {...props} screen={screen as any} />;
  }
}
