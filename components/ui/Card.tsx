import React from 'react';

interface CardProps {
  children: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ children }) => {
  return (
    <div className="bg-white rounded-xl w-full p-6 sm:p-8 md:p-12 shadow-card overflow-hidden">
      {children}
    </div>
  );
};

export default Card;