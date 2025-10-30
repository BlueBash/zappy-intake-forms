import { motion } from 'motion/react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

interface SimpleHeroScreenProps {
  onGetStarted: () => void;
}

export default function SimpleHeroScreen({ onGetStarted }: SimpleHeroScreenProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FDFBF7] via-white to-[#F8FCF9] flex items-center justify-center px-4 py-6">
      <div className="w-full max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center"
        >
          {/* Logo/Brand */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="mb-8"
          >
            <h1 className="text-6xl sm:text-7xl mb-4 bg-gradient-to-br from-[#0D9488] via-[#14B8A6] to-[#0D9488] bg-clip-text text-transparent">
              Zappy
            </h1>
            <p className="text-xl sm:text-2xl text-neutral-600">
              Your personalized weight loss journey
            </p>
          </motion.div>

          {/* Headline */}
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-4xl sm:text-5xl mb-6 text-neutral-900 max-w-3xl mx-auto"
          >
            Achieve your weight loss goals with
            <span className="bg-gradient-to-r from-[#0D9488] to-[#14B8A6] bg-clip-text text-transparent">
              {' '}GLP-1 medications
            </span>
          </motion.h2>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-xl text-neutral-600 mb-4 max-w-2xl mx-auto"
          >
            Get a personalized plan with medications like Ozempic, Wegovy, Mounjaro, and Zepbound. 
            Start your journey today.
          </motion.p>

          {/* Time Estimate */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="text-base text-neutral-500 mb-12 max-w-2xl mx-auto"
          >
            ⏱️ Takes about 8-10 minutes
          </motion.p>

          {/* Value Props */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="grid sm:grid-cols-3 gap-6 mb-12 max-w-3xl mx-auto"
          >
            {[
              { icon: '🏥', title: 'Medical Expertise', desc: 'Provider-guided care' },
              { icon: '💊', title: 'FDA-Approved', desc: 'Safe, proven medications' },
              { icon: '📱', title: 'Easy & Convenient', desc: 'Online consultations' },
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + index * 0.1, duration: 0.5 }}
                className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100"
              >
                <div className="text-4xl mb-3">{item.icon}</div>
                <h3 className="font-semibold text-neutral-900 mb-2">{item.title}</h3>
                <p className="text-sm text-neutral-600">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.9, duration: 0.5, type: 'spring', stiffness: 200 }}
          >
            <button
              onClick={onGetStarted}
              className="group relative inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#0D9488] to-[#14B8A6] text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 text-lg"
            >
              <span>Get Started</span>
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
