import { motion } from 'motion/react';
import { ScreenProps, ConsentScreen as ConsentScreenType, ConsentItem } from '../../types';
import ScreenLayout from '../common/ScreenLayout';
import NavigationButtons from '../common/NavigationButtons';
import Checkbox from '../ui/Checkbox';

export default function ConsentScreen({ screen, answers, updateAnswer, onSubmit, showBack, onBack }: ScreenProps & { screen: ConsentScreenType }) {
  const { title, items = [] } = screen;

  const handleToggle = (itemId: string, isChecked: boolean) => {
    updateAnswer(itemId, isChecked);
  };
  
  const isComplete = items
    .filter(item => item.required)
    .every(item => !!answers[item.id]);

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
                className="text-[#0D9488] underline hover:text-[#0F766E] transition-colors" 
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
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      <ScreenLayout title={title || ''}>
        {/* Friendly intro message */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="w-full max-w-[580px] mx-auto mb-6 p-4 bg-gradient-to-r from-[#0D9488]/5 to-[#14B8A6]/5 rounded-xl border border-[#0D9488]/20"
        >
          <p className="text-base text-neutral-700 text-center">
            We know legal language isn't fun, but these agreements help us protect you and provide great care. We've kept them as simple as possible.
          </p>
        </motion.div>

        <div className="w-full max-w-[580px] mx-auto space-y-4 mb-8 text-left">
          {items.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
              className={`p-5 border-2 rounded-xl cursor-pointer transition-all duration-300 ${
                answers[item.id]
                  ? 'border-[#0D9488] bg-gradient-to-r from-[#0D9488]/5 to-[#14B8A6]/5'
                  : 'border-gray-200 bg-white hover:border-[#0D9488]/30'
              }`}
              onClick={() => handleToggle(item.id, !answers[item.id])}
            >
              <Checkbox
                id={item.id}
                label={renderConsentLabel(item)}
                checked={!!answers[item.id]}
                onChange={() => {}}
              />
            </motion.div>
          ))}
        </div>
        <NavigationButtons
          showBack={showBack}
          onBack={onBack}
          onNext={onSubmit}
          isNextDisabled={!isComplete}
        />
      </ScreenLayout>
    </motion.div>
  );
}
