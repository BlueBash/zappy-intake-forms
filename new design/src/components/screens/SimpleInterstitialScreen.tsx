import { motion } from 'motion/react';
import { ReactNode } from 'react';

interface SimpleInterstitialScreenProps {
  title: string;
  description?: string;
  onContinue: () => void;
  children?: ReactNode;
}

export default function SimpleInterstitialScreen({
  title,
  description,
  onContinue,
  children,
}: SimpleInterstitialScreenProps) {
  return (
    <div className="min-h-screen bg-[#fef8f2] flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center"
        >
          {/* Title */}
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-3xl sm:text-4xl md:text-5xl mb-4 sm:mb-6 text-neutral-900"
          >
            {title}
          </motion.h1>

          {/* Description */}
          {description && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-lg sm:text-xl text-neutral-600 mb-8 sm:mb-12 max-w-2xl mx-auto"
            >
              {description}
            </motion.p>
          )}

          {/* Content (e.g., WeightLossGraph) */}
          {children && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="mb-8 sm:mb-12"
            >
              {children}
            </motion.div>
          )}

          {/* Continue Button */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            onClick={onContinue}
            className="group relative inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#0D9488] to-[#14B8A6] text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 text-lg"
          >
            <span>Continue</span>
            <svg
              className="w-5 h-5 transition-transform group-hover:translate-x-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
