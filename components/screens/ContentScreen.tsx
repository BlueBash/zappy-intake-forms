import React, { useState, useEffect } from 'react';
import { ScreenProps } from './common';
import { ContentScreen as ContentScreenType, ConsentItem } from '../../types';
import NavigationButtons from '../common/NavigationButtons';
import Checkbox from '../ui/Checkbox';
import { WelcomeIllustration } from '../ui/Illustrations';
import { interpolateText } from '../../utils/stringInterpolator';

const ContentScreen: React.FC<ScreenProps & { screen: ContentScreenType }> = ({ screen, onSubmit, showBack, onBack, updateAnswer, answers, calculations = {}, headerSize = 'text-4xl sm:text-5xl' }) => {
  const { headline, body, cta_primary, status, consent_items, image } = screen;

  const interpolatedHeadline = interpolateText(headline, calculations, answers);
  const interpolatedBody = interpolateText(body, calculations, answers);

  const initialConsents = consent_items?.reduce((acc, item) => {
    acc[item.id] = !!answers[item.id];
    return acc;
  }, {} as Record<string, boolean>) || {};

  const [consents, setConsents] = useState(initialConsents);

  useEffect(() => {
    if (consent_items) {
      Object.entries(consents).forEach(([id, value]) => {
        updateAnswer(id, value);
      });
    }
  }, [consents, consent_items, updateAnswer]);
  
  const isComplete = !consent_items || consent_items.filter(item => item.required).every(item => consents[item.id]);

  const renderConsentLabel = (item: ConsentItem) => {
    if (!item.links || item.links.length === 0) {
      return item.label;
    }
  
    let label: (string | React.ReactNode)[] = [item.label];
    item.links.forEach((link, i) => {
      const newLabel: (string | React.ReactNode)[] = [];
      label.forEach(part => {
        if (typeof part !== 'string') {
          newLabel.push(part);
          return;
        }
        const split = part.split(link.label);
        split.forEach((text, j) => {
          newLabel.push(text);
          if (j < split.length - 1) {
            newLabel.push(
              <a key={`${link.url}-${i}-${j}`} href={link.url} target="_blank" rel="noopener noreferrer" className="text-primary font-semibold hover:underline" onClick={e => e.stopPropagation()}>
                {link.label}
              </a>
            );
          }
        });
      });
      label = newLabel;
    });
  
    return <span>{label}</span>;
  };

  const statusBorderClass = status ? `border-l-4 pl-8 ${status === 'warning' ? 'border-amber-400' : 'border-emerald-500'}` : '';
  const isInspirePhase = screen.phase === 'inspire';

  return (
    <div className={`w-full text-center flex-grow flex flex-col justify-center items-center ${statusBorderClass} ${isInspirePhase ? 'inspire-phase-content' : ''}`}>
        {image === 'welcome_illustration' && <WelcomeIllustration className="w-48 h-48 mb-8 text-primary" />}

        <h2 className={`${headerSize} font-semibold mb-4 text-stone-900 leading-tight -tracking-wider`}>
            {interpolatedHeadline}
        </h2>
        {interpolatedBody && <p className="text-lg sm:text-xl mb-12 max-w-xl text-stone-600 leading-relaxed whitespace-pre-line">{interpolatedBody}</p>}
        
        {consent_items && (
          <div className="w-full max-w-[580px] space-y-4 mb-8 text-left">
            {consent_items.map(item => (
              <div
                key={item.id}
                className="p-5 bg-white border border-stone-200 rounded-2xl shadow-sm cursor-pointer hover:bg-accent hover:border-secondary transition-colors"
                onClick={() => setConsents(prev => ({...prev, [item.id]: !prev[item.id]}))}
              >
                  <Checkbox
                    id={item.id}
                    label={renderConsentLabel(item)}
                    checked={!!consents[item.id]}
                    onChange={(e) => setConsents(prev => ({...prev, [item.id]: e.target.checked}))}
                  />
              </div>
            ))}
          </div>
        )}

        <NavigationButtons
            showBack={showBack}
            onBack={onBack}
            onNext={onSubmit}
            isNextDisabled={!isComplete}
            nextLabel={cta_primary.label}
        />
    </div>
  );
};

export default ContentScreen;
