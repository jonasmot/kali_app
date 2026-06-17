import { useState, useEffect, useMemo } from 'react';
import '../App.css';
import { useAuth } from '../contexts/AuthContext';
import { SegmentedControl } from '../components/SegmentedControl';
import { useNavigate } from 'react-router-dom';
interface Treino {
  id: number;
  nome: string;
  categoria: string;
  data_criacao: string;
  exercicios?: { id: string; concluido: boolean }[];
}

interface ExercicioLibrary {
  id: string;
  titulo: string;
  dificuldade: string;
  grupo_muscular: string;
  imageUrl?: string;
  reps?: string;
}

// MOCK DATA PARA O FRONTEND (Sem imagens para focar no texto, aceita vídeo via código depois)
const MOCK_LIBRARY: ExercicioLibrary[] = [
  { id: '1', titulo: 'Muscle Up', dificuldade: 'Avançado', grupo_muscular: 'Barra', reps: 'Objetivo: 5 Reps' },
  { id: '2', titulo: 'Pull Up', dificuldade: 'Iniciante', grupo_muscular: 'Barra', reps: 'Objetivo: 10 Reps' },
  { id: '3', titulo: 'Push Up', dificuldade: 'Iniciante', grupo_muscular: 'Flexões', reps: 'Objetivo: 15 Reps' },
  { id: '4', titulo: 'L-Sit no Chão', dificuldade: 'Intermediário', grupo_muscular: 'L-Sit', reps: 'Objetivo: 15s' },
  { id: '5', titulo: 'Pistol Squat', dificuldade: 'Avançado', grupo_muscular: 'Agachamento', reps: 'Objetivo: 5/perna' },
  { id: '6', titulo: 'Dragon Flag', dificuldade: 'Avançado', grupo_muscular: 'Abdominais', reps: 'Objetivo: 10 Reps' }
];

const CATEGORIES = ['Todos', 'Barra', 'Flexões', 'L-Sit', 'Agachamento', 'Abdominais'];

export function Profile() {
  const [treinos, setTreinos] = useState<Treino[]>([]);
  const [nome, setNome] = useState('');
  const [categoria, setCategoria] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const [activeTab, setActiveTab] = useState('Library');
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [viewFormat, setViewFormat] = useState<'reels' | 'square'>('reels');

  // Estados para edição de Treino existente
  const [editingTreinoId, setEditingTreinoId] = useState<number | null>(null);
  const [editNome, setEditNome] = useState('');
  const [editCategoria, setEditCategoria] = useState('');

  // Seleção de exercícios para o Cronograma
  const [selectedWorkoutIds, setSelectedWorkoutIds] = useState<string[]>([]);

  const toggleExercise = (id: string) => {
    setSelectedWorkoutIds(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const { token, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const fetchTreinos = async () => {
    if (!token) return;
    try {
      const res = await fetch('http://localhost:3000/treino', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setTreinos(data);
      }
    } catch (error) {
      console.error('Erro ao buscar treinos:', error);
    }
  };

  useEffect(() => {
    fetchTreinos();
  }, [token]);

  const handleCreateTreino = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (!nome || !categoria) return;
    setIsLoading(true);

    const exerciciosFormatados = selectedWorkoutIds.map(id => ({ id, concluido: false }));
    try {
      const res = await fetch('http://localhost:3000/treino', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ nome, categoria, exercicios: exerciciosFormatados }),
      });
      if (res.ok) {
        fetchTreinos();
        setNome('');
        setCategoria('');
        setSelectedWorkoutIds([]); // Limpa a seleção após criar
      }
    } catch (error) {
      console.error('Erro ao criar treino:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveEdit = async (treinoId: number) => {
    const treinoExistente = treinos.find(t => t.id === treinoId);
    const exerciciosAtuais = treinoExistente?.exercicios || [];
    
    const exerciciosFormatados = selectedWorkoutIds.map(id => {
      const existente = exerciciosAtuais.find(e => e.id === id);
      return { id, concluido: existente ? existente.concluido : false };
    });

    try {
      const res = await fetch(`http://localhost:3000/treino/${treinoId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ nome: editNome, categoria: editCategoria, exercicios: exerciciosFormatados }),
      });
      if (res.ok) {
        fetchTreinos();
        setEditingTreinoId(null);
        setSelectedWorkoutIds([]);
      }
    } catch (error) {
      console.error('Erro ao atualizar treino:', error);
    }
  };

  const handleToggleTreinoExercicio = async (treinoId: number, exercicioId: string) => {
    const treino = treinos.find(t => t.id === treinoId);
    if (!treino) return;

    // Toggle local
    const novosExercicios = (treino.exercicios || []).map(ex => 
      ex.id === exercicioId ? { ...ex, concluido: !ex.concluido } : ex
    );

    // Atualiza estado local imediatamente para feedback visual
    setTreinos(prev => prev.map(t => t.id === treinoId ? { ...t, exercicios: novosExercicios } : t));

    // Salva no banco de dados
    try {
      await fetch(`http://localhost:3000/treino/${treinoId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ exercicios: novosExercicios }),
      });
    } catch (error) {
      console.error('Erro ao atualizar treino:', error);
    }
  };

  const handleDeleteTreino = async (treinoId: number) => {
    if (!window.confirm('Deseja realmente apagar este ritual do seu histórico?')) return;
    
    // Deleta localmente para feedback imediato
    setTreinos(prev => prev.filter(t => t.id !== treinoId));

    try {
      await fetch(`http://localhost:3000/treino/${treinoId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
    } catch (error) {
      console.error('Erro ao deletar treino:', error);
      fetchTreinos(); // rollback visual em caso de erro
    }
  };

  const handleEditTreino = (treino: Treino) => {
    setEditingTreinoId(treino.id);
    setEditNome(treino.nome);
    setEditCategoria(treino.categoria);
    setSelectedWorkoutIds(treino.exercicios?.map(e => e.id) || []);
  };

  const filteredLibrary = useMemo(() => {
    if (activeCategory === 'Todos') return MOCK_LIBRARY;
    return MOCK_LIBRARY.filter(v => v.grupo_muscular === activeCategory);
  }, [activeCategory]);

  return (
    // Removido o Sidebar, Container toma tela toda com padding
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', color: 'var(--text-primary)', display: 'flex', flexDirection: 'column' }}>
      
      {/* Top Navigation Global Centered */}
      <header style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        padding: '1.5rem 1rem', 
        position: 'relative' 
      }}>

        <SegmentedControl 
          options={['Library', `My Workout (${selectedWorkoutIds.length})`]} 
          activeOption={activeTab === 'Library' ? 'Library' : `My Workout (${selectedWorkoutIds.length})`} 
          onChange={(opt) => setActiveTab(opt.startsWith('My Workout') ? 'My Workout' : 'Library')} 
        />
      </header>

      {/* Main Content Space */}
      <main style={{ padding: '0 1rem', flex: 1 }}>
        
        {/* Category Filters row */}
        {activeTab === 'Library' && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', minHeight: '50px' }}>
            <div className="filter-wrapper">
              <div className="filter-dot"></div>
              <div className="category-filters">
                {CATEGORIES.map(cat => (
                  <button 
                    key={cat} 
                    className={`filter-pill ${activeCategory === cat ? 'active' : ''}`}
                    onClick={() => setActiveCategory(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
            
            {/* View Toggles */}
            <div style={{ display: 'flex', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', padding: '2px', transition: 'all 0.3s ease' }}>
              {/* Botão REELS */}
              <button 
                onClick={() => setViewFormat('reels')}
                style={{ 
                  background: viewFormat === 'reels' ? 'var(--text-primary)' : 'transparent', 
                  color: viewFormat === 'reels' ? 'var(--bg-primary)' : 'var(--text-secondary)', 
                  border: 'none', borderRadius: '2px', padding: '0.2rem 0.5rem', cursor: 'pointer', transition: 'all 0.3s ease' 
                }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>
              </button>
              
              {/* Botão SQUARE */}
              <button 
                onClick={() => setViewFormat('square')}
                style={{ 
                  background: viewFormat === 'square' ? 'var(--text-primary)' : 'transparent', 
                  color: viewFormat === 'square' ? 'var(--bg-primary)' : 'var(--text-secondary)', 
                  border: 'none', borderRadius: '2px', padding: '0.2rem 0.5rem', cursor: 'pointer', transition: 'all 0.3s ease' 
                }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
              </button>
            </div>
          </div>
        )}

        {/* --- LIBRARY TAB --- */}
        {activeTab === 'Library' && (
          <div className={`fade-in ${viewFormat === 'reels' ? 'reels-grid' : 'square-grid'}`}>
            {filteredLibrary.length === 0 ? (
               <p style={{ color: 'var(--text-secondary)', fontStyle: 'italic', gridColumn: '1 / -1', padding: '2rem 0' }}>
                 Nenhum conhecimento registrado sob essa escola.
               </p>
            ) : (
              filteredLibrary.map((video) => {
                const isSelected = selectedWorkoutIds.includes(video.id);
                return (
                <div 
                  key={video.id} 
                  className={`${viewFormat === 'reels' ? 'reels-card' : 'square-card'} ${isSelected ? 'selected' : ''}`}
                  onClick={() => toggleExercise(video.id)}
                >
                  <div className={viewFormat === 'reels' ? 'reels-card-bg' : 'square-card-bg'} 
                       style={video.imageUrl ? { backgroundImage: `url(${video.imageUrl})` } : { background: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}></div>
                  
                  {viewFormat === 'reels' ? (
                    // REELS FORMAT CONTENT
                    <div className="reels-card-content">
                      <h3 className="reels-title">{video.titulo}</h3>
                      <div className="reels-subtitle">
                        {video.dificuldade} • {video.grupo_muscular}
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginTop: '1rem' }}>
                        <span style={{ fontWeight: '600', marginLeft: '1rem', whiteSpace: 'nowrap' }}>{video.reps}</span>
                      </div>
                    </div>
                  ) : (
                    // SQUARE FORMAT CONTENT
                    <>
                      <div className="square-card-content">
                        <h3 className="square-title">{video.titulo}</h3>
                        <div className="square-subtitle">
                          <span>{video.grupo_muscular}</span>
                          <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{video.reps}</span>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )})
            )}
          </div>
        )}

               {/* --- MY WORKOUT TAB (GERENCIAMENTO DE TREINOS) --- */}
        {activeTab === 'My Workout' && (
          <div className="fade-in" style={{ maxWidth: '700px', margin: '0 auto', paddingBottom: '4rem' }}>
            
            {/* Formulário de Criação (Oculto durante edição) */}
            {!editingTreinoId && (
              <div style={{ background: 'var(--bg-secondary)', padding: '2rem', borderRadius: '4px', border: '1px solid var(--border-color)', marginBottom: '3rem', boxShadow: '0 10px 30px rgba(0,0,0,0.3)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                   <h3 style={{ fontFamily: 'var(--font-heading)', marginTop: 0, fontSize: '1.3rem', margin: 0 }}>Forjar Novo Ritual</h3>
                   <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                     {selectedWorkoutIds.length === 0 
                       ? 'Nenhum movimento selecionado na Library' 
                       : `${selectedWorkoutIds.length} Movimento(s) na Forja`}
                   </span>
                </div>

                {/* Preview de Exercícios Selecionados */}
                {selectedWorkoutIds.length > 0 && (
                  <div className="horizontal-preview-scroll" style={{ display: 'flex', gap: '1rem', overflowX: 'auto', paddingBottom: '0.5rem', marginBottom: '1.5rem' }}>
                    {selectedWorkoutIds.map(id => {
                      const video = MOCK_LIBRARY.find(v => v.id === id);
                      if (!video) return null;
                      return (
                        <div key={id} style={{ flexShrink: 0, width: '140px', background: 'rgba(255,255,255,0.02)', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.1)', position: 'relative', transition: 'transform 0.2s', cursor: 'default' }}>
                          <div style={{ width: '100%', height: '70px', backgroundImage: video.imageUrl ? `url(${video.imageUrl})` : 'none', backgroundColor: 'rgba(0,0,0,0.3)', backgroundSize: 'cover', backgroundPosition: 'center', borderTopLeftRadius: '5px', borderTopRightRadius: '5px' }}></div>
                          <div style={{ padding: '0.5rem' }}>
                            <div style={{ fontSize: '0.8rem', fontFamily: 'var(--font-heading)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{video.titulo}</div>
                            <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>{video.reps}</div>
                          </div>
                          <button 
                            type="button" 
                            onClick={() => toggleExercise(id)} 
                            style={{ position: 'absolute', top: '4px', right: '4px', background: 'rgba(0,0,0,0.6)', color: '#ff4444', border: 'none', borderRadius: '50%', width: '22px', height: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'background 0.2s' }}
                            title="Remover"
                            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0.8)'}
                            onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0.6)'}
                          >
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
                
                <form onSubmit={handleCreateTreino} style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-end', flexWrap: 'wrap' }}>
                   <div style={{ flex: '1 1 200px' }}>
                     <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>Nome da Sessão</label>
                     <input type="text" value={nome} onChange={e => setNome(e.target.value)} required placeholder="Ex: Treino de Força A" style={{ width: '100%', background: 'transparent', border: 'none', borderBottom: '1px solid var(--border-color)', color: 'var(--text-primary)', padding: '0.5rem 0', outline: 'none' }} />
                   </div>
                   <div style={{ flex: '1 1 200px' }}>
                     <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>Categoria</label>
                     <select value={categoria} onChange={e => setCategoria(e.target.value)} required style={{ width: '100%', background: 'transparent', border: 'none', borderBottom: '1px solid var(--border-color)', color: 'var(--text-primary)', padding: '0.5rem 0', outline: 'none' }}>
                        <option value="" disabled>Selecione...</option>
                        <option value="Membros Superiores" style={{ background: 'var(--bg-secondary)' }}>Membros Superiores</option>
                        <option value="Membros Inferiores" style={{ background: 'var(--bg-secondary)' }}>Membros Inferiores</option>
                        <option value="Movimentos Estáticos" style={{ background: 'var(--bg-secondary)' }}>Movimentos Estáticos</option>
                        <option value="Core" style={{ background: 'var(--bg-secondary)' }}>Core</option>
                     </select>
                   </div>
                   <button type="submit" className="btn-primary" disabled={isLoading} style={{ padding: '0.6rem 1.5rem' }}>Cadastrar Treino</button>
                </form>
              </div>
            )}

            {/* Lista de Treinos Cadastrados */}
            <div>
              <h2 className="section-title" style={{ fontFamily: 'var(--font-heading)', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '1rem' }}>Meus Rituais Ativos</h2>
              
              {treinos.length === 0 ? (
                <p style={{ color: 'var(--text-secondary)', fontStyle: 'italic', textAlign: 'center', marginTop: '2rem' }}>O vazio. Adicione movimentos na Library e forje o seu primeiro ritual.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                  {treinos.map(treino => {
                     const isEditing = editingTreinoId === treino.id;
                     
                     // Se estiver em modo de edição e este for o treino editado, mostramos a lista provisória de selectedWorkoutIds
                     // Caso contrário, mostramos os exercícios gravados no banco.
                     const displayExercicios = isEditing 
                       ? selectedWorkoutIds.map(id => {
                           const salvo = treino.exercicios?.find(e => e.id === id);
                           return { id, concluido: salvo ? salvo.concluido : false };
                         })
                       : (treino.exercicios || []);

                     const concluidos = displayExercicios.filter(e => e.concluido).length;
                     const total = displayExercicios.length;
                     const progresso = total === 0 ? 0 : Math.round((concluidos / total) * 100);

                     return (
                       <div key={treino.id} 
                            style={{ 
                              background: isEditing ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.02)', 
                              padding: '2rem', 
                              borderRadius: '4px', 
                              border: isEditing ? '1px solid var(--text-primary)' : '1px solid var(--border-color)',
                              boxShadow: isEditing ? '0 0 20px rgba(255,255,255,0.05)' : 'none',
                              transition: 'all 0.3s ease'
                            }}>
                          
                          {isEditing ? (
                            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                              <input type="text" value={editNome} onChange={e => setEditNome(e.target.value)} style={{ flex: '1 1 200px', background: 'transparent', border: 'none', borderBottom: '1px solid var(--text-primary)', color: 'var(--text-primary)', fontSize: '1.2rem', fontFamily: 'var(--font-heading)', padding: '0.3rem 0', outline: 'none' }} />
                              <select value={editCategoria} onChange={e => setEditCategoria(e.target.value)} style={{ flex: '1 1 150px', background: 'transparent', border: 'none', borderBottom: '1px solid var(--text-primary)', color: 'var(--text-primary)', fontSize: '0.9rem', padding: '0.3rem 0', outline: 'none' }}>
                                 <option value="Membros Superiores" style={{ background: 'var(--bg-secondary)' }}>Membros Superiores</option>
                                 <option value="Membros Inferiores" style={{ background: 'var(--bg-secondary)' }}>Membros Inferiores</option>
                                 <option value="Movimentos Estáticos" style={{ background: 'var(--bg-secondary)' }}>Movimentos Estáticos</option>
                                 <option value="Core" style={{ background: 'var(--bg-secondary)' }}>Core</option>
                              </select>
                              <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <button onClick={() => handleSaveEdit(treino.id)} style={{ background: 'var(--text-primary)', color: 'var(--bg-primary)', border: 'none', padding: '0.4rem 1rem', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Salvar</button>
                                <button onClick={() => { setEditingTreinoId(null); setSelectedWorkoutIds([]); }} style={{ background: 'transparent', color: 'var(--text-secondary)', border: '1px solid var(--border-color)', padding: '0.4rem 1rem', borderRadius: '4px', cursor: 'pointer' }}>Cancelar</button>
                              </div>
                            </div>
                          ) : (
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                               <div>
                                 <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{treino.categoria} • {new Date(treino.data_criacao).toLocaleDateString('pt-BR')}</span>
                                 <h3 style={{ fontFamily: 'var(--font-heading)', margin: '0.3rem 0 0 0', fontSize: '1.5rem' }}>{treino.nome}</h3>
                               </div>
                               <div style={{ textAlign: 'right', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                 <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 'bold', fontSize: '1.5rem', color: progresso === 100 ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                                   {progresso}%
                                 </span>
                                 <button 
                                   onClick={() => handleEditTreino(treino)} 
                                   style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '0.3rem', transition: 'color 0.3s' }} 
                                   title="Editar Ritual"
                                   onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
                                   onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
                                 >
                                   <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                                 </button>
                                 <button 
                                   onClick={() => handleDeleteTreino(treino.id)} 
                                   style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '0.3rem', transition: 'color 0.3s' }} 
                                   title="Desfazer Ritual"
                                   onMouseEnter={(e) => e.currentTarget.style.color = '#ff4444'}
                                   onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
                                 >
                                   <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                                 </button>
                               </div>
                            </div>
                          )}
                          
                          {/* Barra de Progresso */}
                          <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', marginBottom: '2rem', overflow: 'hidden' }}>
                             <div style={{ width: `${progresso}%`, height: '100%', background: progresso === 100 ? 'var(--text-primary)' : 'rgba(255,255,255,0.4)', transition: 'width 0.8s cubic-bezier(0.16, 1, 0.3, 1)', boxShadow: progresso === 100 ? '0 0 10px rgba(255,255,255,0.5)' : 'none' }}></div>
                          </div>

                          {/* Checklist de Exercícios */}
                          {total === 0 ? (
                             <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>Este ritual foi forjado vazio.</p>
                          ) : (
                             <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {displayExercicios.map((ex, idx) => {
                                   const libItem = MOCK_LIBRARY.find(l => l.id === ex.id);
                                   return (
                                      <div key={ex.id || idx} 
                                           onClick={() => { if (!isEditing) handleToggleTreinoExercicio(treino.id, ex.id); }}
                                           style={{ display: 'flex', alignItems: 'center', cursor: isEditing ? 'default' : 'pointer', opacity: ex.concluido ? 0.4 : 1, transition: 'all 0.3s ease', background: ex.concluido ? 'transparent' : 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '4px', border: '1px solid', borderColor: ex.concluido ? 'transparent' : 'rgba(255,255,255,0.05)' }}>
                                         
                                         {/* Checkbox Circular */}
                                         <div style={{ width: '22px', height: '22px', borderRadius: '50%', border: `1px solid ${ex.concluido ? 'var(--text-primary)' : 'var(--text-secondary)'}`, background: ex.concluido ? 'var(--text-primary)' : 'transparent', marginRight: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s ease', opacity: isEditing ? 0.3 : 1 }}>
                                            {ex.concluido && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--bg-primary)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>}
                                         </div>
                                         
                                         {/* Info */}
                                         <div style={{ flex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', textDecoration: (!isEditing && ex.concluido) ? 'line-through' : 'none' }}>
                                            <span style={{ fontSize: '1.1rem', fontFamily: 'var(--font-heading)' }}>{libItem ? libItem.titulo : `Movimento #${ex.id}`}</span>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', background: 'rgba(0,0,0,0.3)', padding: '0.2rem 0.5rem', borderRadius: '2px' }}>{libItem?.reps || '-'}</span>
                                              
                                              {/* Botão de Remover Exercício no Modo Edição */}
                                              {isEditing && (
                                                <button 
                                                  type="button"
                                                  onClick={(e) => {
                                                    e.stopPropagation();
                                                    // Remove do estado global selectedWorkoutIds
                                                    setSelectedWorkoutIds(prev => prev.filter(item => item !== ex.id));
                                                  }}
                                                  style={{ background: 'transparent', border: 'none', color: '#ff4444', cursor: 'pointer', padding: '0.2rem', display: 'flex', alignItems: 'center', opacity: 0.8, transition: 'opacity 0.2s' }}
                                                  onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                                                  onMouseLeave={(e) => e.currentTarget.style.opacity = '0.8'}
                                                  title="Remover Movimento"
                                                >
                                                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                                                </button>
                                              )}
                                            </div>
                                         </div>
                                      </div>
                                   );
                                 })}
                             </div>
                          )}
                       </div>
                     );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </main>

    </div>
  );
}
