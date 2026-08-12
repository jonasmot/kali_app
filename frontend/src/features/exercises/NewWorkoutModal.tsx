import React, { useState } from 'react';
import './exercises.css';

interface NewWorkoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (nome: string, descricao: string) => void;
  selectedCount: number;
}

export const NewWorkoutModal: React.FC<NewWorkoutModalProps> = ({ isOpen, onClose, onSubmit, selectedCount }) => {
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (nome.trim()) {
      onSubmit(nome, descricao);
      setNome('');
      setDescricao('');
    }
  };

  return (
    <div className="kali-modal-overlay">
      <div className="kali-modal-content" style={{ maxWidth: '500px', width: '90%', background: 'var(--bg-elevated)', padding: 'var(--space-xl)', borderRadius: 'var(--radius-lg)', boxShadow: '0 10px 25px rgba(0,0,0,0.5)' }}>
        <h2 style={{ marginBottom: 'var(--space-sm)' }}>Criar Novo Treino</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: 'var(--space-lg)' }}>
          Você selecionou <strong>{selectedCount}</strong> exercício(s).
        </p>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xs)' }}>
            <label htmlFor="nome" style={{ fontWeight: 600 }}>Nome do Treino *</label>
            <input 
              type="text" 
              id="nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="ex.: push, pull, legs"
              required
              style={{ padding: 'var(--space-sm)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: '#fff' }}
            />
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xs)' }}>
            <label htmlFor="descricao" style={{ fontWeight: 600 }}>Descrição (Opcional)</label>
            <textarea 
              id="descricao"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="anotações..."
              rows={3}
              style={{ padding: 'var(--space-sm)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: '#fff', resize: 'vertical' }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-sm)', marginTop: 'var(--space-md)' }}>
            <button type="button" onClick={onClose} style={{ padding: '0.6rem 1.2rem', borderRadius: 'var(--radius-md)', border: 'none', background: 'transparent', color: '#fff', cursor: 'pointer' }}>Cancelar</button>
            <button type="submit" style={{ padding: '0.6rem 1.2rem', borderRadius: 'var(--radius-md)', border: 'none', background: 'var(--accent-primary)', color: '#fff', fontWeight: 'bold', cursor: 'pointer' }}>Salvar Treino</button>
          </div>
        </form>
      </div>
    </div>
  );
};
