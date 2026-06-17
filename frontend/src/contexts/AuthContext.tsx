import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

interface Usuario {
  id: number;
  email: string;
  name: string;
}

interface AuthContextType {
  token: string | null;
  usuario: Usuario | null;
  login: (token: string, usuario: Usuario) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [usuario, setUsuario] = useState<Usuario | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('kali_token');
    const storedUsuario = localStorage.getItem('kali_usuario');
    if (storedToken && storedUsuario) {
      setToken(storedToken);
      setUsuario(JSON.parse(storedUsuario));
    }
  }, []);

  const login = (newToken: string, novoUsuario: Usuario) => {
    localStorage.setItem('kali_token', newToken);
    localStorage.setItem('kali_usuario', JSON.stringify(novoUsuario));
    setToken(newToken);
    setUsuario(novoUsuario);
  };

  const logout = () => {
    localStorage.removeItem('kali_token');
    localStorage.removeItem('kali_usuario');
    setToken(null);
    setUsuario(null);
  };

  return (
    <AuthContext.Provider value={{ token, usuario, login, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};
