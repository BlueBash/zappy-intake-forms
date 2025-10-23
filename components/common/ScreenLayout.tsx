import React from 'react';

interface ScreenLayoutProps {
  title?: string;
  helpText?: string;
  children: React.ReactNode;
  showLoginLink?: boolean;
  headerSize?: 'small' | 'default';
}

const ScreenLayout: React.FC<ScreenLayoutProps> = ({ title, helpText, children, showLoginLink = false, headerSize = 'default' }) => {
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
      {showLoginLink && (
        <div className="mt-8 text-center">
          <p className="text-sm text-stone-500">
            Already have an account?{' '}
            <a 
              href="/login" 
              className="text-primary hover:text-primary-600 font-medium hover:underline transition-colors"
            >
              Log in
            </a>
          </p>
        </div>
      )}
    </div>
  );
};

export default ScreenLayout;
