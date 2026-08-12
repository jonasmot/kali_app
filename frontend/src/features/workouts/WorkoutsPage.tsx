import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import type { Treino } from '../../types';
import { WorkoutCard } from './WorkoutCard';
import './workouts.css';

export const WorkoutsPage: React.FC = () => {
  const [treinos, setTreinos] = useState<Treino[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTreinos = async () => {
    setIsLoading(true);
    try {
      const data = await api.treinos.list();
      setTreinos(data);
    } catch (error) {
      console.error('Erro ao buscar treinos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTreinos();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm('Deseja realmente excluir este treino?')) return;
    try {
      await api.treinos.delete(id);
      setTreinos(prev => prev.filter(t => t.id !== id));
    } catch (error) {
      console.error('Erro ao excluir:', error);
    }
  };

  return (
    <div className="kali-workouts-page">
      <div className="kali-page-header kali-workouts-header">
        <div>
          <h1>Meus Treinos</h1>
          <p className="text-muted">Acompanhe seu progresso</p>
        </div>
      </div>

      {isLoading ? (
        <div className="kali-loading-state">Carregando...</div>
      ) : (
        <div className="kali-workouts-list">
          {treinos.map(treino => (
            <WorkoutCard 
              key={treino.id} 
              treino={treino} 
              onDelete={() => handleDelete(treino.id)}
              onUpdate={fetchTreinos}
            />
          ))}
          {treinos.length === 0 && (
            <div className="kali-empty-state">
              Nenhum treino criado. Clique em "Novo Treino" para começar.
            </div>
          )}
        </div>
      )}
    </div>
  );
};
