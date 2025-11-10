import React from 'react';
import { ScreenProps } from './common';
import { ConsentScreen as ConsentScreenType, ConsentItem } from '../../types';
import ScreenLayout from '../common/ScreenLayout';
import NavigationButtons from '../common/NavigationButtons';
import Checkbox from '../ui/Checkbox';

const ConsentScreen: React.FC<ScreenProps & { screen: ConsentScreenType }> = ({
  screen,
  answers,
  updateAnswer,
  onSubmit,
  showBack,
  onBack,
}) => {
  const { title, items } = screen;

  const handleToggle = (itemId: string, isChecked: boolean) => {
    // Update the central form state directly
    updateAnswer(itemId, isChecked);
  };
  
  // Check if all required items are consented to by reading from the central `answers` prop
  const isComplete = items
    .filter(item => item.required)
    .every(item => !!answers[item.id]);

  // Renders label text and correctly embeds anchor tags for any links
  const renderConsentLabel = (item: ConsentItem) => {
    if (!item.links || item.links.length === 0) {
      return item.label;
    }
  
    let label: (string | React.ReactNode)[] = [item.label];
    item.links.forEach((link, i) => {
      const newLabel: (string | React.ReactNode)[] = [];
      label.forEach(part => {
        if (typeof part !== 'string') {
          newLabel.push(part);
          return;
        }
        const split = part.split(link.label);
        split.forEach((text, j) => {
          newLabel.push(text);
          if (j < split.length - 1) {
            newLabel.push(
              <a 
                key={`${link.url}-${i}-${j}`} 
                href={link.url} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-primary font-semibold hover:underline" 
                onClick={e => e.stopPropagation()}
              >
                {link.label}
              </a>
            );
          }
        });
      });
      label = newLabel;
    });
  
    return <span>{label}</span>;
  };


  return (
    <ScreenLayout title={title}>
      <div className="w-full space-y-4 mb-8 text-left">
        {items.map(item => (
          <div
            key={item.id}
            className="p-5 bg-white border-2 border-stone-200 rounded-2xl shadow-sm cursor-pointer hover:border-primary/50 transition-colors"
            onClick={() => handleToggle(item.id, !answers[item.id])}
          >
              <Checkbox
                id={item.id}
                label={renderConsentLabel(item)}
                checked={!!answers[item.id]}
                // The parent div's onClick handles the logic, so this is just for visual sync
                onChange={() => {}} 
              />
          </div>
        ))}
      </div>
      <NavigationButtons
        showBack={showBack}
        onBack={onBack}
        onNext={onSubmit}
        isNextDisabled={!isComplete}
      />
    </ScreenLayout>
  );
};

export default ConsentScreen;
