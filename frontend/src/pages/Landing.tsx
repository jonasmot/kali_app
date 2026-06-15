import { Link } from 'react-router-dom';
import './Landing.css';

export function Landing() {
  return (
    <div className="landing-container">
      <nav className="landing-nav">
        <div className="brand">
          <div className="brand-dot"></div>
          KaliApp
        </div>
        <div className="nav-actions">
          <Link to="/dashboard" className="btn-secondary">Entrar</Link>
          <Link to="/dashboard" className="btn-primary">Começar Grátis</Link>
        </div>
      </nav>

      <main className="hero-section">
        <div className="hero-content">
          <div className="badge">Nova Era do Fitness</div>
          <h1 className="hero-title">
            Domine Seus Treinos com <span className="text-accent">Precisão.</span>
          </h1>
          <p className="hero-subtitle">
            O aplicativo definitivo para atletas e entusiastas. Registre, acompanhe e evolua seu condicionamento físico em um ambiente focado e premium.
          </p>
          <div className="hero-actions">
            <Link to="/dashboard" className="btn-primary btn-large">Acessar o Dashboard</Link>
          </div>
        </div>
        
        {/* Decorative elements representing app aesthetics */}
        <div className="hero-visual">
          <div className="glass-card mockup-card">
            <div className="mockup-header">
              <div className="mockup-dot red"></div>
              <div className="mockup-dot yellow"></div>
              <div className="mockup-dot green"></div>
            </div>
            <div className="mockup-body">
              <div className="skeleton-title"></div>
              <div className="skeleton-chart">
                <div className="bar b1"></div>
                <div className="bar b2"></div>
                <div className="bar b3"></div>
                <div className="bar b4"></div>
              </div>
              <div className="skeleton-line"></div>
              <div className="skeleton-line short"></div>
            </div>
          </div>
          <div className="glow-orb primary-orb"></div>
          <div className="glow-orb secondary-orb"></div>
        </div>
      </main>
    </div>
  );
}
