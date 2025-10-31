import { useEffect } from 'react';
import { motion } from 'motion/react';
import ScreenLayout from '../common/ScreenLayout';
import NavigationButtons from '../common/NavigationButtons';
import DiscountSelection from '../common/DiscountSelection';
import { ScreenProps } from './common';
import type { Discount } from '../../utils/api';

export default function DiscountCodeScreen({ screen, answers, updateAnswer, onSubmit, showBack, onBack }: ScreenProps) {
  const title = 'headline' in screen ? screen.headline : (screen as any).title;
  const helpText = 'body' in screen ? screen.body : (screen as any).help_text;

  const storedDiscount = (answers['discount_data'] as Discount | null) || null;
  const storedCode = answers['discount_code_entered'] || '';

  useEffect(() => {
    if (!storedDiscount) {
      updateAnswer('discount_id', '');
      updateAnswer('discount_code', '');
      updateAnswer('discount_amount', 0);
      updateAnswer('discount_percentage', 0);
      updateAnswer('discount_description', '');
    }
  }, []);

  const handleDiscountChange = (discount: Discount | null, code: string) => {
    updateAnswer('discount_code_entered', code);

    if (discount) {
      updateAnswer('discount_id', discount.id);
      updateAnswer('discount_code', discount.code);
      updateAnswer('discount_amount', discount.amount);
      updateAnswer('discount_percentage', discount.percentage);
      updateAnswer('discount_description', discount.description || '');
      updateAnswer('discount_data', discount);
    } else {
      updateAnswer('discount_id', '');
      updateAnswer('discount_code', '');
      updateAnswer('discount_amount', 0);
      updateAnswer('discount_percentage', 0);
      updateAnswer('discount_description', '');
      updateAnswer('discount_data', null);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      <ScreenLayout title={title || ''} helpText={helpText}>
        <DiscountSelection
          selectedDiscountId={answers['discount_id']}
          storedDiscount={storedDiscount}
          storedCode={storedCode}
          onSelect={handleDiscountChange}
        />

        <NavigationButtons
          showBack={showBack}
          onBack={onBack}
          onNext={onSubmit}
        />
      </ScreenLayout>
    </motion.div>
  );
}
