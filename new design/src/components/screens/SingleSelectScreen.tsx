import { motion } from 'motion/react';
import { ScreenProps, SingleSelectScreen as SingleSelectScreenType } from '../../types';
import ScreenLayout from '../common/ScreenLayout';
import NavigationButtons from '../common/NavigationButtons';
import SingleSelectButtonGroup from '../common/SingleSelectButtonGroup';
import Select from '../ui/Select';
import Button from '../ui/Button';
import { ArrowLeft } from 'lucide-react';

const DROPDOWN_THRESHOLD = 15;

export default function SingleSelectScreen({ screen, answers, updateAnswer, onSubmit, showBack, onBack }: ScreenProps & { screen: SingleSelectScreenType }) {
  const { id, title, help_text, options = [], required, auto_advance = true, field_id } = screen;
  const answerId = field_id || id;
  const selectedValue = answers[answerId];

  const syncAnswer = (value: string) => {
    updateAnswer(answerId, value);
    if (answerId !== id) {
      updateAnswer(id, value);
    }
  };

  const handleButtonSelect = (value: string) => {
    syncAnswer(value);
    if (auto_advance && options.length <= DROPDOWN_THRESHOLD) {
      setTimeout(onSubmit, 400);
    }
  };

  const handleDropdownChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    syncAnswer(e.target.value);
  };
  
  const isComplete = !required || (selectedValue !== undefined && selectedValue !== '');
  const renderAsDropdown = options.length > DROPDOWN_THRESHOLD;
  const showNavButtons = !auto_advance || renderAsDropdown;
  const showBackOnly = auto_advance && !renderAsDropdown && showBack;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      <ScreenLayout title={title || ''} helpText={help_text}>
        {renderAsDropdown ? (
          <div className="mb-8">
            <Select
              id={answerId}
              options={options}
              value={selectedValue || ''}
              onChange={handleDropdownChange}
              required={required}
            />
          </div>
        ) : (
          <div className="mb-14">
            <SingleSelectButtonGroup
              options={options}
              selectedValue={selectedValue}
              onSelect={handleButtonSelect}
            />
          </div>
        )}
        
        {showNavButtons && (
          <NavigationButtons
            showBack={showBack}
            onBack={onBack}
            onNext={onSubmit}
            isNextDisabled={!isComplete}
          />
        )}

        {!showNavButtons && showBackOnly && (
          <div className="w-full flex justify-start mt-10">
            <Button
              variant="ghost"
              onClick={onBack}
              aria-label="Go back to the previous question"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          </div>
        )}
      </ScreenLayout>
    </motion.div>
  );
}
