import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

interface Treino {
  id: string;
  nome: string;
  categoria: string;
  data_inicio: string;
}

export function Dashboard() {
  const [treinos, setTreinos] = useState<Treino[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [nome, setNome] = useState('');
  const [categoria, setCategoria] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Fetch data from NestJS backend
  const fetchTreinos = async () => {
    try {
      const res = await fetch('http://localhost:3000/treino');
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
  }, []);

  const handleCreateTreino = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome || !categoria) return;

    setIsLoading(true);
    try {
      const res = await fetch('http://localhost:3000/treino', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nome, categoria }),
      });

      if (res.ok) {
        // Refresh list
        fetchTreinos();
        // Close modal and reset
        setIsModalOpen(false);
        setNome('');
        setCategoria('');
      }
    } catch (error) {
      console.error('Erro ao criar treino:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <Link to="/" style={{ textDecoration: 'none' }}>
          <div className="brand">
            <div className="brand-dot"></div>
            KaliApp
          </div>
        </Link>
        
        <nav className="nav-links">
          <a href="#" className="nav-item active">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
            Dashboard
          </a>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="header">
          <div className="header-title">
            <h1>Visão Geral</h1>
            <p>Acompanhe e gerencie seus treinos diários.</p>
          </div>
          
          <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            Novo Treino
          </button>
        </header>

        {/* Stats Row */}
        <section className="dashboard-grid">
          <div className="stat-card">
            <div className="stat-header">
              <span>Total de Treinos</span>
              <div className="stat-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--accent-color)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"></path></svg>
              </div>
            </div>
            <div className="stat-value">{treinos.length}</div>
          </div>
          <div className="stat-card">
            <div className="stat-header">
              <span>Nível de Atividade</span>
              <div className="stat-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--accent-color)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
              </div>
            </div>
            <div className="stat-value">{treinos.length > 0 ? 'Ativo' : 'Iniciante'}</div>
          </div>
        </section>

        {/* Treinos List */}
        <h2 className="section-title">Meus Treinos Recentes</h2>
        <section className="dashboard-grid">
          {treinos.length === 0 ? (
            <p style={{ color: 'var(--text-secondary)' }}>Nenhum treino registrado. Crie o seu primeiro!</p>
          ) : (
            treinos.map(treino => (
              <div className="treino-card" key={treino.id}>
                <div className="treino-card-header">
                  <div>
                    <h3 className="treino-title">{treino.nome}</h3>
                    <div className="treino-date" style={{ marginTop: '0.5rem' }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                      {new Date(treino.data_inicio).toLocaleDateString('pt-BR')}
                    </div>
                  </div>
                  <span className="treino-category">{treino.categoria}</span>
                </div>
              </div>
            ))
          )}
        </section>
      </main>

      {/* Modal Novo Treino */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Registrar Novo Treino</h2>
            <form onSubmit={handleCreateTreino} className="modal-form">
              <div className="form-group">
                <label>Nome do Treino</label>
                <input 
                  type="text" 
                  value={nome} 
                  onChange={(e) => setNome(e.target.value)} 
                  placeholder="Ex: Peito e Tríceps" 
                  required 
                />
              </div>
              <div className="form-group">
                <label>Categoria</label>
                <select 
                  value={categoria} 
                  onChange={(e) => setCategoria(e.target.value)}
                  required
                >
                  <option value="" disabled>Selecione uma categoria...</option>
                  <option value="Hipertrofia">Hipertrofia</option>
                  <option value="Força">Força</option>
                  <option value="Resistência">Resistência</option>
                  <option value="Cardio">Cardio</option>
                  <option value="Mobilidade">Mobilidade</option>
                </select>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setIsModalOpen(false)}>Cancelar</button>
                <button type="submit" className="btn-primary" disabled={isLoading}>
                  {isLoading ? 'Salvando...' : 'Salvar Treino'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
