import { motion } from 'motion/react';
import { ChevronRight } from 'lucide-react';
import { ScreenProps } from '../../types';

interface HeroOption {
  value: string;
  label: string;
  subtitle?: string;
  icon?: string;
}

interface HeroScreenType {
  type: 'hero';
  id: string;
  title?: string;
  subtitle?: string;
  headline?: string;
  logo?: string;
  options: HeroOption[];
  required?: boolean;
}

export default function HeroScreen({ 
  screen, 
  answers, 
  updateAnswer, 
  onSubmit 
}: ScreenProps & { screen: HeroScreenType }) {
  const { id, title, subtitle, headline, options } = screen;
  const selectedValue = answers[id];

  const handleSelect = (value: string) => {
    updateAnswer(id, value);
    // Auto-advance after selection with smooth delay
    setTimeout(onSubmit, 450);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-2xl"
      >
        {/* Logo/Brand Section */}
        <motion.div 
          className="text-center mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          {headline && (
            <motion.h1 
              className="text-5xl sm:text-6xl mb-4 bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-700 bg-clip-text text-transparent"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              {headline}
            </motion.h1>
          )}
          
          {subtitle && (
            <motion.p 
              className="text-xl text-neutral-600 max-w-xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              {subtitle}
            </motion.p>
          )}
        </motion.div>

        {/* Main Title */}
        {title && (
          <motion.h2 
            className="text-3xl sm:text-4xl text-center mb-8 text-neutral-900"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            {title}
          </motion.h2>
        )}

        {/* Options */}
        <div className="space-y-4">
          {options.map((option, index) => (
            <motion.button
              key={option.value}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ 
                delay: 0.6 + index * 0.1, 
                duration: 0.5,
                ease: [0.16, 1, 0.3, 1]
              }}
              whileHover={{ 
                scale: 1.02,
                transition: { duration: 0.2 }
              }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleSelect(option.value)}
              className={`
                w-full p-6 rounded-2xl border-2 transition-all duration-300
                flex items-center justify-between group
                ${selectedValue === option.value
                  ? 'border-[#0D9488] bg-gradient-to-r from-[#0D9488]/10 to-[#14B8A6]/10 shadow-lg shadow-[#0D9488]/10'
                  : 'border-gray-200 bg-white hover:border-[#0D9488]/50 hover:shadow-md'
                }
              `}
            >
              <div className="flex items-center gap-4 flex-1 text-left">
                <div className="flex-1">
                  <div className="text-lg text-neutral-900 transition-colors">
                    {option.label}
                  </div>
                </div>
              </div>
              
              <motion.div
                className={`
                  flex items-center justify-center w-10 h-10 rounded-full 
                  transition-all duration-300
                  ${selectedValue === option.value
                    ? 'bg-[#0D9488] shadow-lg shadow-[#0D9488]/30'
                    : 'bg-gray-100 group-hover:bg-[#0D9488]/10'
                  }
                `}
                animate={{
                  rotate: selectedValue === option.value ? 0 : 0
                }}
              >
                <ChevronRight 
                  className={`
                    w-5 h-5 transition-all duration-300
                    ${selectedValue === option.value
                      ? 'text-white'
                      : 'text-neutral-400 group-hover:text-[#0D9488]'
                    }
                  `}
                />
              </motion.div>
            </motion.button>
          ))}
        </div>

        {/* Optional Footer Note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="text-center mt-12 text-sm text-neutral-500"
        >
          Your personalized journey starts here
        </motion.div>
      </motion.div>
    </div>
  );
}
