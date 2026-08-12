import React from 'react';
import './ProgressBar.css';

interface ProgressBarProps {
  value: number;
  size?: 'sm' | 'md';
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ value, size = 'md' }) => {
  const clampedValue = Math.min(100, Math.max(0, value));
  const isComplete = clampedValue === 100;

  return (
    <div className={`kali-progress-container kali-progress--${size}`}>
      <div 
        className={`kali-progress-bar ${isComplete ? 'kali-progress-bar--complete' : ''}`}
        style={{ width: `${clampedValue}%` }}
      />
    </div>
  );
};
