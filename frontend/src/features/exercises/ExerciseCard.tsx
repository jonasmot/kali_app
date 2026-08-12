import React from 'react';
import type { Exercicio } from '../../types';

interface ExerciseCardProps {
  exercicio: Exercicio;
  isSelected?: boolean;
  onToggleSelect?: () => void;
}

export const ExerciseCard: React.FC<ExerciseCardProps> = ({ exercicio, isSelected, onToggleSelect }) => {
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
  const videoUrl = exercicio.video_url ? `${API_URL}/videos/${exercicio.video_url}` : undefined;

  return (
    <div 
      className={`kali-exercise-card ${isSelected ? 'selected' : ''}`}
      onClick={onToggleSelect}
    >
      <div className="kali-exercise-media">
        {videoUrl ? (
          <video 
            src={videoUrl} 
            className="kali-exercise-video"
            autoPlay 
            loop 
            muted 
            playsInline
          />
        ) : (
          <div className="kali-exercise-placeholder">
            <span>Sem vídeo</span>
          </div>
        )}
        <div className="kali-exercise-overlay">
          <h3>{exercicio.titulo}</h3>
          {isSelected && <div className="kali-exercise-check">✓</div>}
        </div>
      </div>
    </div>
  );
};
