import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { useAuth } from '../../contexts/AuthContext';
import { api } from '../../services/api';
import { Card } from '../../components/ui/Card/Card';
import { Input } from '../../components/ui/Input/Input';
import { Button } from '../../components/ui/Button/Button';
import './auth.css';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await api.auth.login({ email, senha });
      login(response.access_token, response.usuario);
      navigate('/treinos');
    } catch (err: any) {
      setError(err.message || 'Erro ao fazer login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="kali-auth-page">
      <Card className="kali-auth-card">
        <h1 className="kali-auth-logo">KALI</h1>
        <h2 className="kali-auth-title">Bem-vindo de volta</h2>
        
        <form onSubmit={handleSubmit} className="kali-auth-form">
          <Input 
            type="email" 
            label="Email" 
            value={email} 
            onChange={e => setEmail(e.target.value)} 
            required 
          />
          <Input 
            type="password" 
            label="Senha" 
            value={senha} 
            onChange={e => setSenha(e.target.value)} 
            required 
          />
          
          {error && <div className="kali-auth-error">{error}</div>}
          
          <Button type="submit" fullWidth isLoading={isLoading} className="kali-auth-submit">
            Entrar
          </Button>
        </form>
        
        <p className="kali-auth-link">
          Não tem uma conta? <Link to="/register">Cadastre-se</Link>
        </p>
      </Card>
    </div>
  );
};
