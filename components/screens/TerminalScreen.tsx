import React, { useCallback } from 'react';
import { ScreenProps } from './common';
import { FriendlyCheckmark, PhoneIcon, MessageIcon, ReviewIcon, PlanIcon, JourneyIcon } from '../ui/Illustrations';
import { TerminalScreen as TerminalScreenType } from '../../types';
import { interpolateText } from '../../utils/stringInterpolator';
import Button from '../ui/Button';

const statusIconMap = {
    success: (
        <FriendlyCheckmark className="w-24 h-24" />
    ),
    warning: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-[var(--coral)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
    ),
};

const customIconMap: Record<string, React.FC<{ className?: string }>> = {
    phone: PhoneIcon,
    message: MessageIcon,
    review: ReviewIcon,
    plan: PlanIcon,
    journey: JourneyIcon,
};

const TerminalScreen: React.FC<ScreenProps & { screen: TerminalScreenType }> = ({ screen, calculations = {}, answers = {}, showBack, onBack }) => {
  const { title, body, status, resources, next_steps, cta_primary, links } = screen;
  const icon = status ? statusIconMap[status] : null;

  const interpolatedTitle = interpolateText(title, calculations, answers);
  const interpolatedBody = interpolateText(body, calculations, answers);

  const handlePrimaryClick = useCallback(() => {
    if (!cta_primary?.url) {
      return;
    }

    if (cta_primary.open_in_new_tab) {
      window.open(cta_primary.url, '_blank', 'noopener,noreferrer');
    } else {
      window.location.href = cta_primary.url;
    }
  }, [cta_primary]);

  return (
    <div className="text-center w-full flex flex-col items-center py-16">
      {icon && <div className="mb-8">{icon}</div>}
      {interpolatedTitle && (
        <h2 className="text-4xl sm:text-5xl font-semibold mb-5 text-stone-900 leading-tight -tracking-wider">
          {interpolatedTitle}
        </h2>
      )}
      {interpolatedBody && (
        <p className="text-lg sm:text-xl text-stone-600 leading-relaxed whitespace-pre-line mb-8">
          {interpolatedBody}
        </p>
      )}

      {resources && resources.length > 0 && (
        <div className="w-full space-y-3 my-8">
          {resources.map((resource, index) => {
            const IconComponent = resource.icon_name ? customIconMap[resource.icon_name] : null;
            return (
              <div key={index} className="bg-slate-50 p-4 rounded-lg text-left flex items-center gap-4 border border-slate-200">
                {IconComponent && <IconComponent className="w-8 h-8 text-slate-500 flex-shrink-0" />}
                <div>
                  <p className="font-semibold text-slate-700">{resource.label}</p>
                  <p className="text-slate-600">{resource.value}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {next_steps && next_steps.length > 0 && (
        <div className="w-full space-y-3 my-8">
          {next_steps.map((step, index) => {
            const IconComponent = step.icon_name ? customIconMap[step.icon_name] : null;
            return (
              <div key={index} className="bg-white p-4 rounded-lg text-left flex items-center gap-4 border-2 border-primary-100">
                {IconComponent ? 
                  <IconComponent className="w-8 h-8 text-primary flex-shrink-0" /> :
                  <span className="text-primary font-bold text-xl">{step.icon}</span>
                }
                <div>
                  <p className="font-semibold text-primary-800">{step.label}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {cta_primary?.url && (
        <Button
          size="lg"
          onClick={handlePrimaryClick}
          className="mt-6"
        >
          {cta_primary.label}
        </Button>
      )}

      {links && links.length > 0 && (
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          {links.map((link, index) => {
            const isExternal = /^https?:/i.test(link.url);
            return (
              <a
                key={`${link.label}-${index}`}
                href={link.url}
                target={isExternal ? '_blank' : undefined}
                rel={isExternal ? 'noopener noreferrer' : undefined}
                className="relative inline-flex items-center gap-2 rounded-full border-2 border-primary/40 bg-white px-5 py-2 text-sm font-semibold text-primary shadow-sm transition transform hover:-translate-y-0.5 hover:border-primary hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
              >
                <span
                  aria-hidden="true"
                  className="inline-flex h-1.5 w-1.5 rounded-full bg-primary"
                />
                {link.label}
              </a>
            );
          })}
        </div>
      )}

      {showBack && (!next_steps || next_steps.length === 0) && (
        <div className="mt-8">
          <Button
            variant="secondary"
            onClick={onBack}
            aria-label="Go back to the previous question"
          >
            Back
          </Button>
        </div>
      )}
    </div>
  );
};

export default TerminalScreen;
