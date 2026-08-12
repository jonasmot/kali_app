import React, { useEffect } from 'react';
import './Modal.css';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="kali-modal-overlay animate-fade-in" onClick={onClose}>
      <div 
        className="kali-modal-content animate-fade-up" 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="kali-modal-header">
          <h3>{title}</h3>
          <button className="kali-modal-close" onClick={onClose} aria-label="Close modal">
            &times;
          </button>
        </div>
        <div className="kali-modal-body">
          {children}
        </div>
      </div>
    </div>
  );
};
