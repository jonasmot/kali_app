import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../../components/ui/Button/Button';
import { Card } from '../../components/ui/Card/Card';
import { api } from '../../services/api';
import type { Treino, Exercicio } from '../../types';
import './profile.css';

export const ProfilePage = () => {
  const { usuario, logout } = useAuth();
  const [treinos, setTreinos] = useState<Treino[]>([]);
  const [exercicios, setExercicios] = useState<Exercicio[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [fetchedTreinos, fetchedExercicios] = await Promise.all([
          api.treinos.list(),
          api.exercicios.list()
        ]);
        setTreinos(fetchedTreinos);
        setExercicios(fetchedExercicios);
      } catch (error) {
        console.error('Erro ao buscar dados do perfil', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (usuario) {
      fetchData();
    }
  }, [usuario]);

  if (!usuario) return null;

  // Extrair iniciais
  const initials = usuario.nome
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  const getRoleName = (id: number) => {
    if (id === 1) return 'Aluno';
    if (id === 2) return 'Professor';
    if (id === 3) return 'Admin';
    return 'Usuário';
  };

  // Calcular estatísticas
  let stat1 = { label: 'Treinos', value: 0 };
  let stat2 = { label: 'Exercícios', value: 0 };

  if (usuario.tipo_perfil_id === 1) {
    // Aluno: treinos concluídos e exercícios concluídos
    stat1.label = 'Treinos Concluídos';
    stat1.value = treinos.filter(t => t.exercicios.length > 0 && t.exercicios.every(te => te.concluido)).length;
    
    stat2.label = 'Exercícios Concluídos';
    stat2.value = treinos.reduce((total, t) => total + t.exercicios.filter(te => te.concluido).length, 0);
  } else if (usuario.tipo_perfil_id === 2 || usuario.tipo_perfil_id === 3) {
    // Professor/Admin: treinos criados e exercícios criados
    stat1.label = 'Treinos Criados';
    stat1.value = treinos.length;

    stat2.label = 'Exercícios Criados';
    stat2.value = exercicios.filter(e => e.autor_id === usuario.id).length;
  }

  return (
    <div className="profile-page">
      <div className="profile-header">
        <h1>Meu Perfil</h1>
      </div>

      <div className="profile-content">
        <Card className="profile-card">
          <div className="profile-avatar-container">
            <div className="profile-avatar">
              <span>{initials}</span>
            </div>
            <div className="profile-role-badge">
              {getRoleName(usuario.tipo_perfil_id)}
            </div>
          </div>
          
          <div className="profile-info">
            <h2>{usuario.nome}</h2>
            <p className="profile-email">{usuario.email}</p>
          </div>

          <div className="profile-stats">
            {isLoading ? (
              <div style={{ textAlign: 'center', width: '100%', padding: '1rem' }}>Carregando estatísticas...</div>
            ) : (
              <>
                <div className="stat-item">
                  <span className="stat-value">{stat1.value}</span>
                  <span className="stat-label">{stat1.label}</span>
                </div>
                <div className="stat-divider"></div>
                <div className="stat-item">
                  <span className="stat-value">{stat2.value}</span>
                  <span className="stat-label">{stat2.label}</span>
                </div>
              </>
            )}
          </div>

          <div className="profile-actions">
            <Button variant="danger" fullWidth onClick={logout}>
              Sair da conta
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};
