import { useCallback } from 'react';
import { motion } from 'motion/react';
import { ScreenProps } from './common';
import { FriendlyCheckmark, PhoneIcon, MessageIcon, ReviewIcon, PlanIcon, JourneyIcon } from '../ui/Illustrations';
import { TerminalScreen as TerminalScreenType } from '../../types';
import { interpolateText } from '../../utils/stringInterpolator';
import Button from '../ui/Button';
import { AlertTriangle } from 'lucide-react';

const statusIconMap = {
  success: <FriendlyCheckmark className="w-24 h-24" />,
  warning: <AlertTriangle className="w-20 h-20 text-amber-500" />,
};

const customIconMap: Record<string, React.FC<{ className?: string }>> = {
  phone: PhoneIcon,
  message: MessageIcon,
  review: ReviewIcon,
  plan: PlanIcon,
  journey: JourneyIcon,
};

export default function TerminalScreen({ screen, calculations = {}, showBack, onBack, onSubmit }: ScreenProps & { screen: TerminalScreenType }) {
  const { title, body, status, resources, next_steps, cta_primary, links } = screen;
  const icon = status ? statusIconMap[status] : null;

  const interpolatedTitle = interpolateText(title || '', calculations);
  const interpolatedBody = interpolateText(body || '', calculations);

  const handlePrimaryClick = useCallback(() => {
    if (!cta_primary?.url) return;

    if (cta_primary.open_in_new_tab) {
      window.open(cta_primary.url, '_blank', 'noopener,noreferrer');
    } else {
      window.location.href = cta_primary.url;
    }
  }, [cta_primary]);

  const handleContinue = useCallback(() => {
    if (onSubmit) {
      onSubmit();
    }
  }, [onSubmit]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="text-center w-full flex flex-col items-center py-8 px-6"
    >
      {icon && (
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 150, damping: 15, delay: 0.2 }}
          className="mb-8"
        >
          {icon}
        </motion.div>
      )}
      
      {interpolatedTitle && (
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-4xl sm:text-5xl text-[#1a1a1a] mb-5 leading-tight"
        >
          {interpolatedTitle}
        </motion.h2>
      )}
      
      {interpolatedBody && (
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-lg sm:text-xl max-w-[580px] text-neutral-600 leading-relaxed whitespace-pre-line mb-8"
        >
          {interpolatedBody}
        </motion.p>
      )}

      {resources && resources.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="w-full max-w-md space-y-3 my-8"
        >
          {resources.map((resource, index) => {
            const IconComponent = resource.icon_name ? customIconMap[resource.icon_name] : null;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                className="bg-gradient-to-r from-slate-50 to-slate-100 p-4 rounded-xl text-left flex items-center gap-4 border border-slate-200"
              >
                {IconComponent && <IconComponent className="w-8 h-8 text-slate-500 flex-shrink-0" />}
                <div>
                  <p className="text-slate-600">{resource.label}</p>
                  <p className="text-slate-900">{resource.value}</p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}

      {next_steps && next_steps.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="w-full max-w-md space-y-3 my-8"
        >
          {next_steps.map((step, index) => {
            const IconComponent = step.icon_name ? customIconMap[step.icon_name] : null;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                className="bg-white p-4 rounded-xl text-left flex items-center gap-4 border-2 border-[#0D9488]/20 hover:border-[#0D9488]/40 transition-colors"
              >
                {IconComponent ? (
                  <IconComponent className="w-8 h-8 text-[#0D9488] flex-shrink-0" />
                ) : (
                  <span className="text-[#0D9488] text-xl">{step.icon}</span>
                )}
                <div>
                  <p className="text-[#1a1a1a]">{step.label}</p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}

      {cta_primary?.url && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Button
            size="lg"
            onClick={handlePrimaryClick}
            className="mt-6"
          >
            {cta_primary.label}
          </Button>
        </motion.div>
      )}

      {/* If no cta_primary with URL, show a Continue button */}
      {!cta_primary?.url && onSubmit && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Button
            size="lg"
            onClick={handleContinue}
            className="mt-6"
          >
            {status === 'success' ? 'View Results' : 'Continue'}
          </Button>
        </motion.div>
      )}

      {links && links.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          {links.map((link, index) => {
            const isExternal = /^https?:/i.test(link.url);
            return (
              <a
                key={`${link.label}-${index}`}
                href={link.url}
                target={isExternal ? '_blank' : undefined}
                rel={isExternal ? 'noopener noreferrer' : undefined}
                className="relative inline-flex items-center gap-2 rounded-full border-2 border-[#0D9488]/40 bg-white px-5 py-2 text-sm text-[#0D9488] shadow-sm transition-all duration-300 hover:border-[#0D9488] hover:shadow-lg hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488]/50"
              >
                <span className="inline-flex h-1.5 w-1.5 rounded-full bg-[#0D9488]" />
                {link.label}
              </a>
            );
          })}
        </motion.div>
      )}

      {showBack && (!next_steps || next_steps.length === 0) && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-8"
        >
          <Button variant="secondary" onClick={onBack}>
            Back
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
}
