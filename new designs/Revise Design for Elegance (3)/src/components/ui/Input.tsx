import { forwardRef, InputHTMLAttributes } from 'react';
import { Label } from './label';
import { AlertCircle, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  id?: string;
  label?: string;
  help_text?: string;
  error?: string;
  suffix?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: () => void;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ id, label, help_text, error, suffix, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <Label htmlFor={id} className="mb-2 text-neutral-800">
            {label}
            {props.required && <span className="text-[#FF7A59] ml-1">*</span>}
          </Label>
        )}
        {help_text && (
          <p className="text-sm text-neutral-600 mb-3 flex items-start gap-2">
            <Info className="w-4 h-4 mt-0.5 flex-shrink-0 text-[#0D9488]" />
            {help_text}
          </p>
        )}
        <div className="relative">
          <input
            ref={ref}
            id={id}
            className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 bg-white shadow-sm ${
              suffix ? 'pr-16' : ''
            } ${
              error
                ? 'border-red-300 focus:border-red-400 focus:ring-4 focus:ring-red-50'
                : 'border-gray-300 focus:border-[#0D9488] focus:ring-4 focus:ring-[#0D9488]/8'
            } outline-none ${className}`}
            {...props}
          />
          {suffix && (
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500 font-medium">
              {suffix}
            </span>
          )}
        </div>
        <AnimatePresence>
          {error && (
            <motion.p
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="mt-2 text-sm text-red-500 flex items-center gap-1"
            >
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
