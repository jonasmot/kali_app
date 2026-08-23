import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import type { Exercicio } from '../../types';
import { ExerciseCard } from './ExerciseCard';
import { NewWorkoutModal } from './NewWorkoutModal';
import { useNavigate } from 'react-router-dom';
import './exercises.css';

const GRUPOS_MUSCULARES = ['Todos', 'Costas', 'Peito', 'Abdômen', 'Pernas', 'Ombros', 'Braços'];

export const ExercisesPage: React.FC = () => {
  const [exercicios, setExercicios] = useState<Exercicio[]>([]);
  const [filtroGrupo, setFiltroGrupo] = useState('Todos');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedExerciseIds, setSelectedExerciseIds] = useState<number[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchExercicios = async () => {
      setIsLoading(true);
      try {
        const data = await api.exercicios.list(filtroGrupo);
        setExercicios(data);
      } catch (error) {
        console.error('Erro ao buscar exercícios:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchExercicios();
  }, [filtroGrupo]);

  const toggleSelectExercise = (id: number) => {
    setSelectedExerciseIds(prev => 
      prev.includes(id) 
        ? prev.filter(exId => exId !== id)
        : [...prev, id]
    );
  };

  const handleCreateWorkout = async (nome: string, descricao: string) => {
    try {
      const payload = {
        nome,
        descricao,
        exercicios: selectedExerciseIds.map((exId, index) => ({
          exercicio_id: exId,
          ordem: index,
          series: 3,
          repeticoes: 10
        }))
      };
      
      await api.treinos.create(payload);
      
      setSelectedExerciseIds([]);
      setIsModalOpen(false);
      
      navigate('/workouts');
    } catch (error) {
      console.error('Erro ao criar treino:', error);
      setErrorMessage('Erro ao criar treino. Verifique os dados e tente novamente.');
      setTimeout(() => setErrorMessage(''), 5000);
    }
  };

  return (
    <div className="kali-exercises-page">
      <div className="kali-exercises-filter">
        {GRUPOS_MUSCULARES.map(grupo => (
          <button 
            key={grupo}
            className={`kali-filter-btn ${filtroGrupo === grupo ? 'active' : ''}`}
            onClick={() => setFiltroGrupo(grupo)}
          >
            {filtroGrupo === grupo && <span className="kali-filter-dot"></span>}
            {grupo.toUpperCase()}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="kali-loading-state">Carregando...</div>
      ) : (
        <div className="kali-exercises-grid">
          {exercicios.map(ex => (
            <ExerciseCard 
              key={ex.id} 
              exercicio={ex} 
              isSelected={selectedExerciseIds.includes(ex.id)}
              onToggleSelect={() => toggleSelectExercise(ex.id)}
            />
          ))}
          {exercicios.length === 0 && (
            <div className="kali-empty-state">
              Nenhum exercício encontrado.
            </div>
          )}
        </div>
      )}

      {errorMessage && (
        <div className="kali-alert kali-alert-error" style={{ position: 'fixed', bottom: '80px', right: '20px', zIndex: 1000, padding: '12px', background: '#ff4d4f', color: '#fff', borderRadius: '4px', boxShadow: '0 2px 8px rgba(0,0,0,0.2)' }}>
          {errorMessage}
          <button onClick={() => setErrorMessage('')} style={{ marginLeft: '12px', background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}>✖</button>
        </div>
      )}

      {/* FAB - Expanded on hover */}
      <button 
        className="kali-fab" 
        onClick={() => {
          if (selectedExerciseIds.length === 0) {
            setErrorMessage('Selecione pelo menos um exercício clicando neles para criar um treino.');
            setTimeout(() => setErrorMessage(''), 5000);
            return;
          }
          setIsModalOpen(true);
        }}
      >
        <span className="kali-fab-icon">+</span>
        <span className="kali-fab-text">Novo Treino</span>
      </button>

      <NewWorkoutModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateWorkout}
        selectedCount={selectedExerciseIds.length}
      />
    </div>
  );
};
