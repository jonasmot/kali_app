# Kali App — Arquitetura

## Visão Geral

O Kali App é uma plataforma de treino de calistenia construída com:

- **Backend**: NestJS v11 + TypeScript + Prisma v7 + PostgreSQL
- **Frontend**: React 19 + TypeScript + Vite 8
- **Autenticação**: JWT via Passport.js (Local + JWT strategies)

## Diagrama de Módulos

```
┌─────────────────────────────────────────────────────────────┐
│                        AppModule                            │
├─────────────┬──────────────┬──────────────┬────────────────┤
│ ConfigModule│ PrismaModule │  AuthModule  │ ExerciciosModule│
│ (global)    │  (global)    │              │                │
│             │              │ ├ LocalStrat │ ├ Controller   │
│ env.valid.  │ PrismaService│ ├ JwtStrat   │ ├ Service      │
│             │ (pg adapter) │ ├ Controller │ └ DTOs         │
│             │              │ ├ Service    │                │
│             │              │ └ DTOs       ├────────────────┤
│             │              │              │ TreinosModule  │
│             │              ├──────────────┤                │
│             │              │UsuariosModule│ ├ Controller   │
│             │              │              │ ├ Service      │
│             │              │ └ Service    │ └ DTOs         │
└─────────────┴──────────────┴──────────────┴────────────────┘
```

## Fluxo de Autenticação

1. `POST /auth/register` → cria usuário com bcrypt hash → auto-login → JWT
2. `POST /auth/login` → LocalStrategy valida email+senha → JWT assinado
3. Rotas protegidas → JwtAuthGuard verifica Bearer token → `@CurrentUser()` injeta dados do usuário
4. Rotas públicas → decoradas com `@Public()` → bypass do guard

## Modelo de Dados

```
Usuario (1) ──→ (N) Treino (1) ──→ (N) TreinoExercicio (N) ←── (1) Exercicio
```

- **Usuario** possui múltiplos **Treinos**
- **Treino** contém múltiplos **Exercícios** via tabela de junção **TreinoExercicio**
- **TreinoExercicio** armazena: ordem, séries, repetições, e status de conclusão

## Estrutura do Frontend

```
src/
├── styles/          → Design system (tokens, reset, tipografia)
├── services/api.ts  → Cliente HTTP centralizado
├── types/           → Interfaces TypeScript compartilhadas
├── contexts/        → Estado global (AuthContext)
├── components/
│   ├── ui/          → Componentes atômicos (Button, Input, Card...)
│   └── layout/      → Layout (AppShell, Sidebar, ProtectedRoute)
├── features/
│   ├── auth/        → Login e Registro
│   ├── workouts/    → Gestão de treinos
│   └── exercises/   → Biblioteca de exercícios
└── App.tsx          → Rotas
```

## Variáveis de Ambiente

Consulte `.env.example` para todas as variáveis necessárias.
