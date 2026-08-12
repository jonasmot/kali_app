import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Usuario } from '../types';
import { api } from '../services/api';

interface AuthContextData {
  usuario: Usuario | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, usuario: Usuario) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextData | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('kali_token');
      if (token) {
        try {
          const user = await api.auth.me();
          setUsuario(user);
        } catch (error) {
          console.error('Token validation failed', error);
          localStorage.removeItem('kali_token');
        }
      }
      setIsLoading(false);
    };

    loadUser();
  }, []);

  const login = (token: string, user: Usuario) => {
    localStorage.setItem('kali_token', token);
    setUsuario(user);
  };

  const logout = () => {
    localStorage.removeItem('kali_token');
    setUsuario(null);
  };

  return (
    <AuthContext.Provider value={{ usuario, isAuthenticated: !!usuario, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
