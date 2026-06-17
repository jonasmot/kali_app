# Kali App ⚔️

O **Kali App** (A Forja de Rituais) é um ecossistema completo focado em atletas de **Calistenia**. Ele permite aos usuários explorarem uma biblioteca de movimentos, forjarem "Rituais" (rotinas de treino customizadas) e acompanharem a conclusão de cada sessão com um layout dark mode imersivo e de alta performance.

## 🌟 Principais Funcionalidades

- **Library de Movimentos:** Explore os principais movimentos calistênicos categorizados por "escolas" (Membros Superiores, Membros Inferiores, Core, Movimentos Estáticos).
- **Forja de Rituais:** Selecione movimentos diretamente da biblioteca e crie treinos customizados.
- **Acompanhamento de Progresso:** Um sistema de checklist elegante, onde você tica os movimentos executados e assiste sua barra de progresso encher em tempo real.
- **Gerenciamento Completo:** Capacidade de criar, editar (inline mode) e excluir rituais de forma orgânica e integrada.

## 🛠️ Tecnologias Utilizadas

A aplicação adota uma stack moderna e de alta performance:

### Backend
- **[NestJS](https://nestjs.com/):** Framework Node.js robusto, estruturado e escalável.
- **[Prisma ORM](https://www.prisma.io/):** ORM que permite uma interação segura e tipada com o banco de dados.
- **PostgreSQL:** Banco de dados relacional que garante a persistência robusta dos usuários, rituais e histórico de treinos.

### Frontend
- **[React 18](https://react.dev/):** Construção declarativa de interfaces de usuário ricas e reativas.
- **[Vite](https://vitejs.dev/):** Ferramenta de build extremamente veloz com hot-reload (HMR) otimizado.
- **CSS Vanilla Customizado:** Estilização premium com tema escuro (Dark Mode), glassmorphism, sombras sutis e micro-interações responsivas, dispensando frameworks pesados de utilitários.

## 🚀 Como Rodar o Projeto Localmente

Siga o passo a passo abaixo para levantar tanto a API (Backend) quanto a interface (Frontend) em sua máquina local para testes e contribuição.

### 1. Pré-requisitos
- **Node.js** (versão 18+ recomendada)
- **PostgreSQL** instalado e rodando (local ou na nuvem)

### 2. Configurando o Backend (API)
O servidor NestJS e as configurações do banco de dados ficam na raiz deste repositório.

1. Instale as dependências:
   ```bash
   npm install
   ```

2. Configure a Conexão com o Banco:
   Crie um arquivo `.env` na raiz do repositório contendo a URL de conexão do PostgreSQL. Substitua as credenciais pelas da sua máquina:
   ```env
   DATABASE_URL="postgresql://seu_usuario:sua_senha@localhost:5432/seu_banco?schema=public"
   ```

3. Sincronize as Tabelas (Prisma):
   Ajuste o banco para bater com o Schema do Prisma:
   ```bash
   npx prisma db push
   # (Caso precise criar histórico de migrações, use: npx prisma migrate dev)
   ```

4. Suba o Servidor Backend:
   ```bash
   npm run start:dev
   ```
   > A API deve subir e ficar ouvindo em `http://localhost:3000`.

### 3. Configurando o Frontend (UI)
O sistema React está inteiramente contido na sub-pasta `frontend/`.

1. Entre no diretório do front:
   ```bash
   cd frontend
   ```

2. Instale as dependências visuais:
   ```bash
   npm install
   ```

3. Rode o servidor Vite:
   ```bash
   npm run dev
   ```
   > O frontend estará rodando e pronto para uso em `http://localhost:5173`.
   
## 📌 Contribuição
Se você for clonar, sinta-se à vontade para expandir a `MOCK_LIBRARY` do front-end com novos exercícios e imagens, ou plugar o front para consumir novos endpoints Restful implementados no backend.

---
*Forjado para elevar os treinos de força corporal para o próximo nível.*
