import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glass?: boolean;
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  className = '', 
  hover = false,
  glass = false
}) => {
  const baseClasses = 'rounded-2xl p-6 transition-all duration-300';
  const hoverClasses = hover ? 'hover:transform hover:-translate-y-2 hover:shadow-xl hover:shadow-emerald-600/10 cursor-pointer' : '';
  const glassClasses = glass ? 'bg-gray-800/60 backdrop-blur-xl border border-gray-700/50' : 'bg-gray-800';

  return (
    <div className={`${baseClasses} ${hoverClasses} ${glassClasses} ${className}`}>
      {children}
    </div>
  );
};

export default Card;