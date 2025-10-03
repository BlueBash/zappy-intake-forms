import React from 'react';

interface HeaderProps {
  productName: string;
  showBackButton: boolean;
  onBack: () => void;
}

const Header: React.FC<HeaderProps> = ({ productName, showBackButton, onBack }) => {
  return (
    <header className="py-6 w-full flex items-center justify-between">
      <div className="w-10">
        {showBackButton && (
          <button 
            onClick={onBack} 
            className="p-2 text-secondary hover:text-primary transition-colors duration-200"
            aria-label="Go back"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}
      </div>
      <h1 className="text-xl font-semibold text-primary tracking-wide">
        {productName}
      </h1>
      <div className="w-10"></div>
    </header>
  );
};

export default Header;