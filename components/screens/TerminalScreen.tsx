import React from 'react';
import { ScreenProps } from './common';
import { FriendlyCheckmark } from '../ui/Illustrations';
import { TerminalScreen as TerminalScreenType } from '../../types';

const iconMap = {
    success: (
        <FriendlyCheckmark className="w-24 h-24" />
    ),
    warning: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
    ),
};


const TerminalScreen: React.FC<ScreenProps & { screen: TerminalScreenType }> = ({ screen }) => {
  const { title, body, status } = screen;
  const icon = status ? iconMap[status] : null;

  return (
    <div className="text-center w-full flex flex-col items-center py-16">
      {icon && <div className="mb-8">{icon}</div>}
      {title && (
        <h2 className="text-4xl sm:text-5xl font-semibold mb-5 text-stone-900 leading-tight -tracking-wider">
          {title}
        </h2>
      )}
      {body && (
        <p className="text-lg sm:text-xl max-w-[580px] text-stone-600 leading-relaxed">
          {body}
        </p>
      )}
    </div>
  );
};

export default TerminalScreen;