import React from 'react';

interface ScreenLayoutProps {
  title?: string;
  helpText?: string;
  children: React.ReactNode;
}

const ScreenLayout: React.FC<ScreenLayoutProps> = ({ title, helpText, children }) => {
  return (
    <div className="text-center w-full flex flex-col items-center">
      {title && (
        <h2 className="text-4xl sm:text-5xl font-semibold mb-4 text-stone-900 leading-tight -tracking-wider">
          {title}
        </h2>
      )}
      {helpText && (
        <p className="text-lg sm:text-xl mb-12 max-w-xl text-stone-600 leading-relaxed">
          {helpText}
        </p>
      )}
      <div className="w-full max-w-[580px]">
        {children}
      </div>
    </div>
  );
};

export default ScreenLayout;