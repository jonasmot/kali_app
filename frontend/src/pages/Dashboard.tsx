import { useState, useEffect } from 'react';
import '../App.css';
import { useAuth } from '../contexts/AuthContext';
import { Sidebar } from '../components/Sidebar';

export function Dashboard() {
  const { usuario, token } = useAuth();
  const [totalTreinos, setTotalTreinos] = useState(0);

  // Exemplo de fetch apenas para pegar as estatísticas ou progresso atual
  const fetchStats = async () => {
    try {
      const res = await fetch('http://localhost:3000/treino', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setTotalTreinos(data.length);
      }
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="dashboard-container">
      <Sidebar />

      {/* Main Content */}
      <main className="main-content">
        <header className="header" style={{ alignItems: 'flex-start', flexDirection: 'column', gap: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
            <div className="header-title">
              <h1 style={{ fontFamily: 'var(--font-heading)', letterSpacing: '0.05em' }}>O Tabuleiro, {usuario?.name}</h1>
              <p>Mensure sua ascensão e analise as marcas deixadas pelo seu esforço.</p>
            </div>
          </div>
        </header>

        <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
          {/* Main Chart / Progress Area */}
          <section style={{ 
            background: 'var(--bg-card)', 
            backdropFilter: 'blur(10px)', 
            border: '1px solid var(--border-color)', 
            padding: '2rem',
            borderRadius: '2px',
            minHeight: '300px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '1rem'
          }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
            <h2 style={{ fontFamily: 'var(--font-heading)' }}>Gráfico de Progressão Sombria</h2>
            <p style={{ color: 'var(--text-secondary)', fontStyle: 'italic', textAlign: 'center', maxWidth: '500px' }}>
              Aqui jazirá o registro visual do volume e intensidade dos seus rituais ao longo da lua. (Dataview em construção)
            </p>
          </section>

          {/* Stats Row */}
          <section className="dashboard-grid">
            <div className="stat-card">
              <div className="stat-header">
                <span>Rituais Concluídos</span>
                <div className="stat-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--accent-color)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"></path></svg>
                </div>
              </div>
              <div className="stat-value">{totalTreinos}</div>
            </div>
            
            <div className="stat-card">
              <div className="stat-header">
                <span>Frequência Semanal</span>
                <div className="stat-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--accent-color)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                </div>
              </div>
              <div className="stat-value">0 Dias</div>
            </div>

            <div className="stat-card">
              <div className="stat-header">
                <span>Maestria Adquirida</span>
                <div className="stat-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--accent-color)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                </div>
              </div>
              <div className="stat-value">Novato</div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
