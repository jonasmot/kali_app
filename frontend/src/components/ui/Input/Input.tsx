import React, { forwardRef } from 'react';
import './Input.css';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className={`kali-input-group ${className}`}>
        {label && (
          <label className="kali-input-label">
            {label} {props.required && <span className="kali-input-required">*</span>}
          </label>
        )}
        <input 
          ref={ref}
          className={`kali-input ${error ? 'kali-input--error' : ''}`}
          {...props} 
        />
        {error && <span className="kali-input-error-msg">{error}</span>}
      </div>
    );
  }
);
Input.displayName = 'Input';
