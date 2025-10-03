import React, { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

import { useFormLogic } from './hooks/useFormLogic';
import formConfig from './data';
import { Screen } from './types';

import ProgressBar from './components/ui/ProgressBar';
import SingleSelectScreen from './components/screens/SingleSelectScreen';
import CompositeScreen from './components/screens/CompositeScreen';
import ContentScreen from './components/screens/ContentScreen';
import TextScreen from './components/screens/TextScreen';
import MultiSelectScreen from './components/screens/MultiSelectScreen';
import NumberScreen from './components/screens/NumberScreen';
import DateScreen from './components/screens/DateScreen';
import ConsentScreen from './components/screens/ConsentScreen';
import TerminalScreen from './components/screens/TerminalScreen';
import ReviewScreen from './components/screens/ReviewScreen';

const App: React.FC = () => {
  const { 
    currentScreen, 
    answers, 
    progress, 
    goToNext, 
    goToPrev,
    history,
    updateAnswer,
    goToScreen,
    direction,
  } = useFormLogic(formConfig);

  useEffect(() => {
    document.documentElement.style.setProperty('--primary-color', formConfig.settings.theme.primary_hex);
    document.documentElement.style.setProperty('--accent-color', formConfig.settings.theme.accent_hex);
    document.documentElement.style.setProperty('--secondary-color', formConfig.settings.theme.secondary_hex);
    document.documentElement.style.setProperty('--background-color', formConfig.settings.theme.background_hex);
  }, []);

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? '100%' : '-100%',
      opacity: 0,
    }),
  };

  const renderScreen = (screen: Screen) => {
    const commonProps = {
      key: screen.id,
      answers,
      updateAnswer,
      onSubmit: goToNext,
      showBack: history.length > 0,
      onBack: goToPrev,
    };
    
    switch (screen.type) {
      case 'single_select':
        return <SingleSelectScreen {...commonProps} screen={screen} />;
      case 'multi_select':
        return <MultiSelectScreen {...commonProps} screen={screen} />;
      case 'composite':
        return <CompositeScreen {...commonProps} screen={screen} />;
      case 'content':
        return <ContentScreen {...commonProps} screen={screen} />;
      case 'text':
        return <TextScreen {...commonProps} screen={screen} />;
      case 'number':
        return <NumberScreen {...commonProps} screen={screen} />;
      case 'date':
        return <DateScreen {...commonProps} screen={screen} />;
      case 'consent':
        return <ConsentScreen {...commonProps} screen={screen} />;
      case 'review':
        return <ReviewScreen 
                  {...commonProps} 
                  screen={screen}
                  allScreens={formConfig.screens} 
                  providerFields={formConfig.provider_packet.include_fields} 
                  goToScreen={goToScreen} 
               />;
      case 'terminal':
        return <TerminalScreen {...commonProps} screen={screen} />;
      default:
        return <div>Unknown screen type: {(screen as any).type}</div>;
    }
  };
  
  return (
    <div className="bg-background min-h-screen text-slate-800 flex flex-col items-center justify-start p-4 sm:p-6 md:p-8 font-sans transition-colors duration-300">
      <div className="w-full max-w-2xl mx-auto flex flex-col flex-grow">
        {formConfig.settings.progress_bar && <ProgressBar progress={progress} />}
        
        <main className="flex-grow w-full relative mt-8 flex flex-col">
            <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                    key={currentScreen.id}
                    custom={direction}
                    variants={variants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{
                        x: { type: "spring", stiffness: 300, damping: 30 },
                        opacity: { duration: 0.2 }
                    }}
                    className="w-full flex-grow flex"
                >
                    {renderScreen(currentScreen)}
                </motion.div>
            </AnimatePresence>
        </main>
        
        {!currentScreen.type.match(/terminal|content/) && <div className="h-20"></div>}
      </div>
    </div>
  );
};

export default App;