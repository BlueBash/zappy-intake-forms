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
    <div className="w-full flex flex-col items-center min-h-screen pt-12 md:pt-16 pb-8">
      <div className="w-full max-w-4xl">
        {title && (
          <h2
            className="text-2xl md:text-3xl font-semibold mb-4 text-neutral-800 leading-tight tracking-tight px-6 md:px-8 text-center"
            style={{ letterSpacing: '-0.02em' }}
          >
            {title}
          </h2>
        )}
        {helpText && (
          <p className="text-base mb-8 max-w-2xl mx-auto text-neutral-600 leading-relaxed px-6 md:px-8 text-center">
            {helpText}
          </p>
        )}
        <div className="w-full max-w-[672px] mx-auto px-6 md:px-8">
          {children}
        </div>
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
