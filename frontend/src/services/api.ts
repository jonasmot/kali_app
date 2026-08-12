import type { Usuario, Exercicio, Treino, AuthResponse } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

async function fetchWithAuth<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('kali_token');
  const headers = new Headers(options.headers || {});
  
  headers.set('Content-Type', 'application/json');
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers
  });

  if (!response.ok) {
    let errorData;
    try {
      errorData = await response.json();
    } catch {
      errorData = { message: 'Erro desconhecido na API' };
    }
    throw {
      statusCode: response.status,
      message: errorData.message || 'Erro na requisição',
      error: errorData.error || 'API_ERROR'
    };
  }

  // Handle empty responses (like DELETE)
  const text = await response.text();
  return text ? JSON.parse(text) : ({} as T);
}

export const api = {
  auth: {
    register: (data: Partial<Usuario> & { senha?: string }) => 
      fetchWithAuth<AuthResponse>('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
    login: (data: Partial<Usuario> & { senha?: string }) => 
      fetchWithAuth<AuthResponse>('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
    me: () => fetchWithAuth<Usuario>('/auth/me', { method: 'GET' })
  },
  exercicios: {
    list: (grupo_muscular?: string) => {
      const qs = grupo_muscular && grupo_muscular !== 'Todos' ? `?grupo_muscular=${encodeURIComponent(grupo_muscular)}` : '';
      return fetchWithAuth<Exercicio[]>(`/exercicios${qs}`, { method: 'GET' });
    },
    create: (data: Partial<Exercicio>) =>
      fetchWithAuth<Exercicio>('/exercicios', { method: 'POST', body: JSON.stringify(data) })
  },
  treinos: {
    list: () => fetchWithAuth<Treino[]>('/treinos', { method: 'GET' }),
    create: (data: { nome: string; descricao?: string; exercicios: { exercicio_id: number; ordem: number; series?: number; repeticoes?: number }[] }) =>
      fetchWithAuth<Treino>('/treinos', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: number, data: Partial<Treino>) =>
      fetchWithAuth<Treino>(`/treinos/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
    delete: (id: number) => fetchWithAuth<void>(`/treinos/${id}`, { method: 'DELETE' }),
    updateExercicio: (treinoId: number, exercicioId: number, data: { concluido?: boolean; series?: number; repeticoes?: number }) =>
      fetchWithAuth<void>(`/treinos/${treinoId}/exercicios/${exercicioId}`, { method: 'PATCH', body: JSON.stringify(data) })
  }
};
