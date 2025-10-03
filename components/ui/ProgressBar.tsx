import React from 'react';

interface ProgressBarProps {
  progress: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress }) => {
  return (
    <div className="w-full h-[3px] mb-8 bg-stone-100">
      <div 
        className="h-full transition-all duration-[400ms] ease-out bg-gradient-progress" 
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};

export default ProgressBar;