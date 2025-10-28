import { motion } from 'motion/react';
import { Button } from './ui/button';
import { ArrowRight, Shield } from 'lucide-react';

interface WelcomeScreenProps {
  onNext: () => void;
}

export function WelcomeScreen({ onNext }: WelcomeScreenProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-2xl mx-auto px-6 py-6 text-center"
    >
      <div className="mb-10">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="inline-block mb-8"
        >
          <div className="w-20 h-1.5 bg-[#00A896] rounded-full mx-auto" />
        </motion.div>
        
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-4xl md:text-5xl mb-6 text-[#1a1a1a] leading-tight"
        >
          Welcome! Let's find your perfect weight loss plan.
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="text-lg text-neutral-700 max-w-xl mx-auto leading-relaxed mb-6"
        >
          We'll ask about your goals, health, and preferences so we can tailor your personalized weight loss program.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#0D9488]/10 rounded-full mb-2"
        >
          <svg className="w-4 h-4 text-[#0D9488]" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span className="text-sm text-[#0D9488]">Only takes 10 minutes</span>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="space-y-4"
      >
        <Button
          onClick={onNext}
          className="bg-[#FF6B6B] hover:bg-[#FF5252] text-white px-10 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group"
        >
          Let's Begin
          <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
        </Button>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="flex items-center justify-center gap-2 text-sm text-neutral-600"
        >
          <Shield className="w-4 h-4" />
          <span>Science-backed program · Trusted by 50,000+ members</span>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
