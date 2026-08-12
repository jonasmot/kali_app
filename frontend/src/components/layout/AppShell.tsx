import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { SegmentedControl } from '../ui/SegmentedControl/SegmentedControl';
import './AppShell.css';

export const AppShell: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const getActiveTab = () => {
    if (location.pathname.includes('/treinos')) return 'Treinos';
    if (location.pathname.includes('/perfil')) return 'Perfil';
    return 'Biblioteca';
  };

  const handleTabChange = (option: string) => {
    if (option === 'Biblioteca') navigate('/exercicios');
    else if (option === 'Perfil') navigate('/perfil');
    else navigate('/treinos');
  };

  return (
    <div className="kali-app-shell">
      <div className="kali-top-nav">
        <SegmentedControl 
          options={['Biblioteca', 'Treinos', 'Perfil']}
          activeOption={getActiveTab()}
          onChange={handleTabChange}
        />
      </div>
      <main className="kali-main-content">
        <div className="kali-content-container">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
