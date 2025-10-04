import React from 'react';

export const SparkleIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path 
      d="M50 10 L55 40 L85 45 L55 50 L50 80 L45 50 L15 45 L45 40 Z" 
      fill="#ef5466" 
      opacity="0.9"
    />
    <path 
      d="M30 25 L32 35 L42 37 L32 39 L30 49 L28 39 L18 37 L28 35 Z" 
      fill="#ff6b7a" 
      opacity="0.7"
    />
    <path 
      d="M70 60 L72 70 L82 72 L72 74 L70 84 L68 74 L58 72 L68 70 Z" 
      fill="#ff8f9c" 
      opacity="0.7"
    />
  </svg>
);

export const FriendlyCheckmark: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="45" fill="#10b981" />
    <path 
      d="M30 50 L 45 65 L 70 40" 
      stroke="white" 
      strokeWidth="10" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
    />
  </svg>
);

export const BloomingPlantIllustration: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M32 59V26" stroke="#78716c" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M32 44C24 44 24 32 32 32" stroke="#78716c" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M32 36C40 36 40 24 32 24" stroke="#78716c" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M32 17C32 17 35 12 40 12C45 12 45 19 40 19C35 19 32 17 32 17Z" fill="#ef5466"/>
        <path d="M32 17C32 17 29 12 24 12C19 12 19 19 24 19C29 19 32 17 32 17Z" fill="#ef5466"/>
        <path d="M32 17C32 17 36 22 41 22C46 22 45 29 40 29C35 29 32 17 32 17Z" fill="#ff6b7a"/>
        <path d="M32 17C32 17 28 22 23 22C18 22 19 29 24 29C29 29 32 17 32 17Z" fill="#ff6b7a"/>
        <circle cx="32" cy="17" r="4" fill="#fff5f7"/>
    </svg>
);

export const WelcomeIllustration: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="100" cy="100" r="80" fill="currentColor" opacity="0.1"/>
        <path d="M70 90C70 90 80 80 100 80C120 80 130 90 130 90" stroke="currentColor" strokeWidth="6" strokeLinecap="round"/>
        <circle cx="80" cy="85" r="8" fill="currentColor"/>
        <circle cx="120" cy="85" r="8" fill="currentColor"/>
        <path d="M75 120C75 120 85 130 100 130C115 130 125 120 125 120" stroke="currentColor" strokeWidth="6" strokeLinecap="round"/>
    </svg>
);

export const BMIGauge: React.FC<{ bmi: number }> = ({ bmi }) => {
  const clampedBMI = Math.max(15, Math.min(50, bmi));
  const angle = ((clampedBMI - 15) / 35) * 180 - 90;
  
  const getColor = () => {
    if (bmi < 18.5) return '#60a5fa'; // blue
    if (bmi < 25) return '#10b981'; // green
    if (bmi < 30) return '#f59e0b'; // amber
    return '#ef4444'; // red
  };

  const getLabel = () => {
    if (bmi < 18.5) return 'Underweight';
    if (bmi < 25) return 'Normal';
    if (bmi < 30) return 'Overweight';
    return 'Obese';
  };

  return (
    <div className="flex flex-col items-center gap-4 p-6 bg-white rounded-2xl border-2 border-stone-100 shadow-sm">
      <div className="relative w-48 h-24">
        <svg viewBox="0 0 200 100" className="w-full h-full">
          <path
            d="M 20 80 A 80 80 0 0 1 180 80"
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="20"
            strokeLinecap="round"
          />
          <path
            d="M 20 80 A 80 80 0 0 1 180 80"
            fill="none"
            stroke={getColor()}
            strokeWidth="20"
            strokeLinecap="round"
            strokeDasharray={`${((clampedBMI - 15) / 35) * 251.2} 251.2`}
          />
          <line
            x1="100"
            y1="80"
            x2="100"
            y2="20"
            stroke="#1f2937"
            strokeWidth="3"
            strokeLinecap="round"
            transform={`rotate(${angle} 100 80)`}
          />
          <circle cx="100" cy="80" r="8" fill="#1f2937" />
        </svg>
      </div>
      <div className="text-center">
        <div className="text-3xl font-bold text-stone-900">{bmi.toFixed(1)}</div>
        <div className="text-sm font-medium" style={{ color: getColor() }}>
          {getLabel()}
        </div>
      </div>
    </div>
  );
};

export const PhoneIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
  </svg>
);

export const MessageIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
  </svg>
);

export const ReviewIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export const PlanIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
  </svg>
);

export const JourneyIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </svg>
);
