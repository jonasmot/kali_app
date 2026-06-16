import { Link } from 'react-router-dom';
import './Landing.css';

export function Landing() {
  return (
    <div className="landing-container">
      <nav className="landing-nav">
        <div className="brand">
          <div className="brand-dot"></div>
          KALI
        </div>
        <div className="nav-actions">
          <Link to="/login" className="btn-secondary">Acessar</Link>
          <Link to="/register" className="btn-ghost">Ingressar</Link>
        </div>
      </nav>

      <main className="hero-section">
        <div className="hero-content">
          <div className="gothic-divider"></div>
          <h1 className="hero-title">
            Forja na <br/>
            <span className="text-somber">Escuridão.</span>
          </h1>
          <p className="hero-subtitle">
            O santuário definitivo para o aperfeiçoamento da carne e do espírito. Registre sua ascensão na calistenia com disciplina e precisão monástica.
          </p>
          <div className="hero-actions">
            <Link to="/register" className="btn-primary btn-large">Iniciar a Jornada</Link>
          </div>
          <div className="gothic-divider bottom"></div>
        </div>
      </main>
    </div>
  );
}
