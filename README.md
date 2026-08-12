# Kali App 🏋️

Plataforma de treino de calistenia — gerencie exercícios, monte rotinas e acompanhe seu progresso.

## Stack

| Camada | Tecnologia |
|:---|:---|
| Backend | NestJS 11, TypeScript, Prisma 7, PostgreSQL |
| Frontend | React 19, Vite 8, TypeScript, CSS Custom Properties |
| Auth | JWT + Passport.js (Local + JWT) |
| Docs API | Swagger/OpenAPI em `/api` |

## Setup Rápido

### Pré-requisitos

- Node.js 20+
- PostgreSQL rodando localmente
- Yarn (frontend)

### 1. Backend

```bash
# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env
# Editar .env com suas credenciais do PostgreSQL

# Gerar Prisma Client
npx prisma generate

# Aplicar migrações
npx prisma migrate dev

# Popular banco com exercícios
npx prisma db seed

# Iniciar servidor (modo desenvolvimento)
npm run start:dev
```

O servidor estará em `http://localhost:3000` e a documentação Swagger em `http://localhost:3000/api`.

### 2. Frontend

```bash
cd frontend

# Instalar dependências
yarn install

# Iniciar dev server
yarn dev
```

O frontend estará em `http://localhost:5173`.

## Documentação

- [Arquitetura](docs/ARCHITECTURE.md) — Visão geral dos módulos e fluxos
- [Swagger](http://localhost:3000/api) — Documentação interativa da API (quando o servidor está rodando)

## Estrutura do Projeto

```
kali_app/
├── prisma/              # Schema e migrações do banco
├── src/                 # Backend NestJS
│   ├── auth/            # Autenticação (JWT + Passport)
│   ├── common/          # Guards, decorators, filters
│   ├── config/          # Validação de env vars
│   ├── exercicios/      # CRUD de exercícios
│   ├── prisma/          # Serviço de banco de dados
│   ├── treinos/         # CRUD de treinos (scoped por usuário)
│   └── usuarios/        # Gestão de usuários
├── frontend/            # Frontend React + Vite
│   └── src/
│       ├── components/  # UI components + layout
│       ├── features/    # Páginas por funcionalidade
│       ├── services/    # Cliente API centralizado
│       └── styles/      # Design system
└── docs/                # Documentação
```

## Scripts

### Backend
| Script | Descrição |
|:---|:---|
| `npm run start:dev` | Servidor com hot reload |
| `npm run build` | Build de produção |
| `npm run seed` | Popular banco com exercícios |

### Frontend
| Script | Descrição |
|:---|:---|
| `yarn dev` | Dev server com HMR |
| `yarn build` | Build de produção |
| `yarn lint` | Verificação de lint |

## Licença

MIT
