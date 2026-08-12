import React from 'react';
import './Card.css';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  animate?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, className = '', animate = true }) => {
  return (
    <div className={`kali-card ${animate ? 'animate-fade-up' : ''} ${className}`}>
      {children}
    </div>
  );
};
