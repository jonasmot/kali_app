# Kali App 🏋️

Plataforma de treino de calistenia — selecione exercícios focados, monte suas rotinas e acompanhe seu progresso de forma simples e direta.

A aplicação foi refinada para focar na experiência do **Aluno**. Conta com 5 exercícios oficiais (Pull Ups, Push Ups, Dips, Muscle Ups, L-Sit) demonstrados em **Pixel Art GIFs** e um construtor de treinos seguro.

## 🚀 Acesse a Plataforma (Deploy)

- **Frontend (Vercel):** [https://jxn4s-kali.vercel.app](https://jxn4s-kali.vercel.app)
- **Backend API (Railway):** [https://kali-app.up.railway.app](https://kali-app.up.railway.app)
- **Swagger Docs:** [https://kali-app.up.railway.app/api](https://kali-app.up.railway.app/api)

## 🛠️ Tecnologias e Stack

| Camada | Tecnologia | Hospedagem |
|:---|:---|:---|
| **Backend** | NestJS 11, TypeScript, Prisma ORM, Passport (JWT) | Railway |
| **Frontend** | React 19, Vite 8, TypeScript, Context API | Vercel |
| **Banco de Dados** | PostgreSQL (com `@prisma/adapter-pg`) | Supabase |
| **Arquivos (Mídia)**| Cloud Storage | Supabase Storage |

## 🏗️ Arquitetura

O Kali App segue uma separação clara entre cliente e servidor:
- **NestJS (Backend):** Arquitetura modular focada em segurança. Endpoints de treino e usuário são protegidos por JWT (`JwtAuthGuard`). Um usuário só tem permissão para ver, editar ou apagar os seus próprios treinos.
- **React (Frontend):** Usa `Vite` para build rápido. Adota o padrão de Features (`src/features`) separando Autenticação, Exercícios e Treinos. Substitui feedbacks nativos do navegador (`alert()`) por tratamento de erros elegantes e Toasts focados em UX.

## ⚙️ Rodando Localmente

### Pré-requisitos
- Node.js 20+
- Um banco de dados PostgreSQL (ex: Supabase)
- Yarn (para rodar o Frontend)

### 1. Backend

```bash
# Na pasta raiz, instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env
# Edite o .env adicionando o DATABASE_URL do seu banco Supabase

# Sincronize o banco e crie os exercícios base
npx prisma db push
npx prisma generate
npx prisma db seed

# Inicie o servidor
npm run start:dev
```
O backend ficará disponível em `http://localhost:3000`.

### 2. Frontend

```bash
cd frontend

# Instale as dependências
yarn install

# Crie um arquivo .env na pasta frontend e aponte para o backend local
echo "VITE_API_URL=http://localhost:3000" > .env

# Inicie o frontend
yarn dev
```
O frontend ficará disponível em `http://localhost:5173`.

## 🛡️ Segurança Aplicada
- Senhas são criptografadas em `Bcrypt` no momento de cadastro.
- Não há retorno de senhas e hashes em requisições de API (`exclude`).
- E-mails duplicados são rejeitados via API (com `ConflictException` sendo devolvida e exibida no Frontend).
- Autorização estrita por ID (usuários não conseguem mutar o estado de outros perfis).

## 📄 Licença

MIT
