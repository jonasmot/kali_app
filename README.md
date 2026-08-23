# Kali App 🏋️

Plataforma de treino de calistenia — selecione exercícios focados, monte suas rotinas e acompanhe seu progresso de forma simples e direta.

A aplicação foi refinada para focar na experiência do **Aluno**. Conta com 5 exercícios oficiais (Pull Ups, Push Ups, Dips, Muscle Ups, L-Sit) e um construtor de treinos seguro.

## 🛠️ Tecnologias e Stack

| Camada | Tecnologia | Hospedagem |
|:---|:---|:---|
| **Backend** | NestJS 11, TypeScript, Prisma ORM, Passport (JWT) | Railway |
| **Frontend** | React 19, Vite 8, TypeScript, Context API | Vercel |
| **Banco de Dados** | PostgreSQL | Supabase |

## 🏗️ Arquitetura

O Kali App segue uma separação clara entre cliente e servidor:
- **NestJS (Backend):** Arquitetura modular. Endpoints de treino e usuário são protegidos por JWT (`JwtAuthGuard`).
- **React (Frontend):** Usa `Vite` para build rápido. Adota o padrão de Features (`src/features`) separando Autenticação, Exercícios e Treinos.

## 🛡️ Segurança Aplicada
- Senhas são criptografadas em `Bcrypt` no momento de cadastro.
- Não há retorno de senhas e hashes em requisições de API (`exclude`).
- E-mails duplicados são rejeitados via API (com `ConflictException`).

## 📄 Licença

MIT
