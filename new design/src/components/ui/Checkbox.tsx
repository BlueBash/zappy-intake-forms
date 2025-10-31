import { InputHTMLAttributes } from 'react';
import { Check } from 'lucide-react';

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  id: string;
  label: React.ReactNode;
  checked?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function Checkbox({ id, label, checked, onChange, ...props }: CheckboxProps) {
  return (
    <div className="flex items-start gap-3">
      <div className="relative flex items-center justify-center mt-0.5">
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="peer sr-only"
          {...props}
        />
        <div className="w-5 h-5 rounded border-2 border-gray-300 bg-white transition-all duration-200 peer-checked:border-[#0D9488] peer-checked:bg-gradient-to-br peer-checked:from-[#0D9488] peer-checked:to-[#14B8A6] peer-focus:ring-4 peer-focus:ring-[#0D9488]/20 cursor-pointer flex items-center justify-center">
          {checked && <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />}
        </div>
      </div>
      <label htmlFor={id} className="cursor-pointer flex-1 text-neutral-700 select-none">
        {label}
      </label>
    </div>
  );
}
