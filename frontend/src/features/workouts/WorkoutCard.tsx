import React, { useState } from 'react';
import type { Treino } from '../../types';
import { api } from '../../services/api';
import { Card } from '../../components/ui/Card/Card';
import { ProgressBar } from '../../components/ui/ProgressBar/ProgressBar';
import { Button } from '../../components/ui/Button/Button';
import { Input } from '../../components/ui/Input/Input';
import { ExerciseCard } from '../exercises/ExerciseCard';

interface WorkoutCardProps {
  treino: Treino;
  onDelete: () => void;
  onUpdate: () => void;
}

export const WorkoutCard: React.FC<WorkoutCardProps> = ({ treino, onDelete, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(treino.nome);
  const [isSaving, setIsSaving] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const totalEx = treino.exercicios.length;
  const completedEx = treino.exercicios.filter(e => e.concluido).length;
  const progress = totalEx === 0 ? 0 : (completedEx / totalEx) * 100;

  const handleToggle = async (exercicioId: number, currentStatus: boolean) => {
    try {
      await api.treinos.updateExercicio(treino.id, exercicioId, { concluido: !currentStatus });
      onUpdate();
    } catch (error) {
      console.error('Erro ao atualizar exercício', error);
    }
  };

  const handleSaveName = async () => {
    if (!editName.trim() || editName === treino.nome) {
      setIsEditing(false);
      return;
    }
    setIsSaving(true);
    try {
      await api.treinos.update(treino.id, { nome: editName });
      onUpdate();
    } catch (error) {
      console.error('Erro ao atualizar nome', error);
    } finally {
      setIsSaving(false);
      setIsEditing(false);
    }
  };

  return (
    <Card className="kali-workout-card">
      <div className="kali-workout-header">
        {isEditing ? (
          <div className="kali-workout-edit-name">
            <Input 
              value={editName} 
              onChange={e => setEditName(e.target.value)} 
              autoFocus 
            />
            <Button size="sm" onClick={handleSaveName} isLoading={isSaving}>Salvar</Button>
            <Button size="sm" variant="secondary" onClick={() => setIsEditing(false)}>Cancelar</Button>
          </div>
        ) : (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <div>
              <h2 className="kali-workout-title" style={{ marginBottom: '4px' }}>{treino.nome}</h2>
              {treino.descricao && <p className="text-small text-muted" style={{ margin: 0 }}>{treino.descricao}</p>}
            </div>
            <div className="kali-workout-actions">
              <button className="kali-icon-btn" onClick={() => setIsEditing(true)}>✎</button>
              <button className="kali-icon-btn text-danger" onClick={onDelete}>🗑</button>
            </div>
          </div>
        )}
      </div>

      <div className="kali-workout-progress-section" style={{ marginTop: '1rem', marginBottom: '1rem' }}>
        <div className="kali-workout-progress-text">
          <span className="text-small text-muted">Progresso</span>
          <span className="text-small font-semibold">{completedEx} / {totalEx}</span>
        </div>
        <ProgressBar value={progress} />
      </div>

      <div style={{ textAlign: 'center', margin: '0.5rem 0' }}>
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          style={{ 
            background: 'transparent', 
            border: 'none', 
            color: 'var(--accent-primary)', 
            cursor: 'pointer',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            width: '100%',
            padding: '8px'
          }}
        >
          {isExpanded ? 'Ocultar Exercícios ▲' : 'Ver Exercícios ▼'}
        </button>
      </div>

      {isExpanded && (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', 
          gap: '1rem', 
          marginTop: '1rem',
          paddingTop: '1rem',
          borderTop: '1px solid var(--border-color)'
        }}>
          {treino.exercicios.map(te => (
            te.exercicio ? (
              <div key={te.id} style={{ position: 'relative' }}>
                <ExerciseCard exercicio={te.exercicio} />
                
                {/* Concluído Checkbox Flutuante */}
                <div style={{ position: 'absolute', top: 10, right: 10, zIndex: 10, background: 'rgba(0,0,0,0.6)', borderRadius: '8px', padding: '4px' }}>
                  <label className="kali-checkbox-container" style={{ margin: 0 }}>
                    <input 
                      type="checkbox" 
                      checked={te.concluido}
                      onChange={() => handleToggle(te.exercicio_id, te.concluido)}
                    />
                    <span className="kali-checkmark"></span>
                  </label>
                </div>

                {/* Info de Séries/Reps */}
                {(te.series || te.repeticoes) && (
                  <div style={{ 
                    position: 'absolute', 
                    top: 10, 
                    left: 10, 
                    zIndex: 10, 
                    background: 'var(--accent-primary)', 
                    color: 'white',
                    padding: '4px 8px', 
                    borderRadius: '4px', 
                    fontSize: '0.8rem',
                    fontWeight: 'bold',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.3)'
                  }}>
                    {te.series}x{te.repeticoes}
                  </div>
                )}
              </div>
            ) : (
              <div key={te.id} className="kali-empty-state">Exercício não encontrado</div>
            )
          ))}
          {totalEx === 0 && <p className="text-small text-muted" style={{ gridColumn: '1 / -1', textAlign: 'center' }}>Nenhum exercício neste treino.</p>}
        </div>
      )}
    </Card>
  );
};
