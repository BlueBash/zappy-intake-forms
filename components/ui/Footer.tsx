import React from 'react';

interface FooterProps {
  show: boolean;
  onBack: () => void;
}

const Footer: React.FC<FooterProps> = ({ show, onBack }) => {
  if (!show) {
    return <div className="h-16"></div>;
  }

  return (
    <footer className="w-full flex justify-center items-center h-16 mt-4">
      <button
        onClick={onBack}
        className="font-semibold py-3 px-6 text-secondary hover:text-secondary-900 transition-colors duration-200"
        aria-label="Go back to the previous question"
      >
        Back
      </button>
    </footer>
  );
};

export default Footer;