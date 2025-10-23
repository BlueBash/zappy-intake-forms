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
        <h2 
          className="text-3xl md:text-4xl font-semibold mb-10 text-neutral-700 leading-tight tracking-tight px-6 md:px-8"
          style={{ letterSpacing: '-0.02em' }}
        >
          {title}
        </h2>
      )}
      {helpText && (
        <p className="text-lg mb-10 max-w-xl text-neutral-700 leading-relaxed px-6 md:px-8">
          {helpText}
        </p>
      )}
      <div className="w-full max-w-[672px] px-6 md:px-8">
        {children}
      </div>
    </div>
  );
};

export default ScreenLayout;
