import React from 'react';
import { motion } from 'framer-motion';
import ScreenLayout from '../common/ScreenLayout';
import WeightLossGraph from '../ui/WeightLossGraph';
import NavigationButtons from '../common/NavigationButtons';
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
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      <ScreenLayout
        title={(screen as any).title || screen.headline || 'Your potential transformation'}
        helpText={(screen as any).subtitle || screen.body}
      >
        <div className="space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <WeightLossGraph companyName="Zappy" className="my-8" />
          </motion.div>
          
          {/* Statistics or subtitle if provided */}
          {(screen as any).stat_number && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="text-center space-y-2"
            >
              <div className="text-2xl sm:text-3xl font-bold text-[#00A896]">
                {(screen as any).stat_number}
              </div>
              <div className="text-base text-[#666666]">
                {(screen as any).stat_text}
              </div>
            </motion.div>
          )}
          
          {/* Message/disclaimer */}
          {(screen as any).message && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="text-center"
            >
              <p className="text-sm text-[#666666] italic">
                {(screen as any).message}
              </p>
            </motion.div>
          )}
          
          <NavigationButtons
            showBack={showBack}
            onBack={onBack}
            onNext={onSubmit}
            nextLabel={screen.cta_primary?.label || 'Continue'}
          />
        </div>
      </ScreenLayout>
    </motion.div>
  );
};

export default WeightLossGraphScreen;
