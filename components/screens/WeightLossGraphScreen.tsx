import React from 'react';
import ScreenLayout from '../common/ScreenLayout';
import WeightLossGraph from '../ui/WeightLossGraph';
import type { ContentScreen } from '../../types';

interface WeightLossGraphScreenProps {
  screen: ContentScreen;
  onSubmit: () => void;
  showBack: boolean;
  onBack: () => void;
}

const WeightLossGraphScreen: React.FC<WeightLossGraphScreenProps> = ({
  screen,
  onSubmit,
  showBack,
  onBack,
}) => {
  return (
    <ScreenLayout
      title={screen.headline || ''}
      helpText={screen.body}
      showBack={showBack}
      onBack={onBack}
    >
      <div className="space-y-8">
        <WeightLossGraph companyName="Zappy" className="my-8" />
        
        <button
          onClick={onSubmit}
          className="w-full py-4 px-6 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 transition-colors"
        >
          {screen.cta_primary?.label || 'Continue'}
        </button>
      </div>
    </ScreenLayout>
  );
};

export default WeightLossGraphScreen;
