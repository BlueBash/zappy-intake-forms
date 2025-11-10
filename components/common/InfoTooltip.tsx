import React, { useState } from 'react';
import { Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface InfoTooltipProps {
  content: string;
  side?: 'top' | 'right' | 'bottom' | 'left';
  className?: string;
  asSpan?: boolean;
}

export const InfoTooltip: React.FC<InfoTooltipProps> = ({ content, side = 'top', className = '', asSpan = false }) => {
  const [isOpen, setIsOpen] = useState(false);

  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
  };

  const iconContent = <Info className="w-3.5 h-3.5" strokeWidth={2.5} />;
  const sharedClassName = `inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#00A896]/10 hover:bg-[#00A896]/20 text-[#00A896] hover:text-[#E0F5F3] transition-all duration-200 ${className}`;

  return (
    <div className="relative inline-flex">
      {asSpan ? (
        <span
          className={sharedClassName}
          role="img"
          aria-label="More information"
          onMouseEnter={() => setIsOpen(true)}
          onMouseLeave={() => setIsOpen(false)}
        >
          {iconContent}
        </span>
      ) : (
        <button
          type="button"
          onMouseEnter={() => setIsOpen(true)}
          onMouseLeave={() => setIsOpen(false)}
          onFocus={() => setIsOpen(true)}
          onBlur={() => setIsOpen(false)}
          className={`${sharedClassName} focus:outline-none focus:ring-2 focus:ring-[#1a7f72]/40 focus:ring-offset-1`}
          aria-label="More information"
        >
          {iconContent}
        </button>
      )}

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={`absolute z-50 ${positionClasses[side]} pointer-events-none`}
          >
            <div className="max-w-[280px] px-4 py-3 bg-gradient-to-br from-neutral-900 to-neutral-800 text-white border border-neutral-700/50 rounded-xl shadow-2xl backdrop-blur-sm">
              <p className="text-xs leading-relaxed">{content}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
