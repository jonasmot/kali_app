import React from 'react';
import type { Exercicio } from '../../types';

interface ExerciseCardProps {
  exercicio: Exercicio;
  isSelected?: boolean;
  onToggleSelect?: () => void;
}

/**
 * Constrói a URL pública do vídeo a partir do Supabase Storage.
 * VITE_SUPABASE_STORAGE_URL aponta para o bucket público, ex:
 * https://[ref].supabase.co/storage/v1/object/public/kali-videos
 */
function buildVideoUrl(videoUrl: string | null): string | undefined {
  if (!videoUrl) return undefined;

  // Se já for uma URL completa (http/https), usar diretamente
  if (videoUrl.startsWith('http')) return videoUrl;

  const storageBase = import.meta.env.VITE_SUPABASE_STORAGE_URL;
  if (storageBase) return `${storageBase}/${videoUrl}`;

  // Fallback: backend local (desenvolvimento)
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
  return `${apiUrl}/videos/${videoUrl}`;
}

export const ExerciseCard: React.FC<ExerciseCardProps> = ({ exercicio, isSelected, onToggleSelect }) => {
  const videoUrl = buildVideoUrl(exercicio.video_url);

  return (
    <div
      className={`kali-exercise-card ${isSelected ? 'selected' : ''}`}
      onClick={onToggleSelect}
    >
      <div className="kali-exercise-media">
        {videoUrl ? (
          <img
            src={videoUrl}
            alt={exercicio.titulo}
            className="kali-exercise-video"
            style={{ imageRendering: 'pixelated', objectFit: 'cover', width: '100%', height: '100%' }}
          />
        ) : (
          <div className="kali-exercise-placeholder">
            <span>Sem imagem</span>
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
