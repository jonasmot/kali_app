export interface Usuario {
  id: number;
  email: string;
  nome: string;
  tipo_perfil_id: number;
}

export interface Exercicio {
  id: number;
  titulo: string;
  descricao: string | null;
  grupo_muscular: string;
  video_url: string | null;
  autor_id: number | null;
  criado_em: string;
}

export interface TreinoExercicio {
  id: number;
  treino_id: number;
  exercicio_id: number;
  concluido: boolean;
  ordem: number;
  series: number | null;
  repeticoes: number | null;
  exercicio: Exercicio;
}

export interface Treino {
  id: number;
  nome: string;
  descricao?: string;
  usuario_id: number;
  criado_em: string;
  atualizado_em: string;
  exercicios: TreinoExercicio[];
}

export interface AuthResponse {
  access_token: string;
  usuario: Usuario;
}

export interface ApiError {
  statusCode: number;
  message: string | string[];
  error: string;
}
