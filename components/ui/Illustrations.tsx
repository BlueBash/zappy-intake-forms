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
