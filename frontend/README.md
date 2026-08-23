# Kali App - Frontend 🖥️

## 🚀 Tecnologias

- **React 19**
- **Vite 8**
- **TypeScript**
- **React Router Dom**
- **Context API**
- **CSS Modules / Custom Properties**

## 🏗️ Estrutura de Diretórios (Features)

A aplicação segue uma arquitetura baseada em *Features*, garantindo que cada escopo do projeto tenha seus componentes, estilos e lógicas isolados:

```
src/
├── assets/         # Ícones, imagens estáticas
├── components/     # Componentes de UI genéricos (Button, Input, Card, Header)
├── contexts/       # Context API (AuthContext)
├── features/       # Módulos principais da aplicação
│   ├── auth/       # Telas e lógicas de Login/Registro
│   ├── exercises/  # Listagem de exercícios e Modal de criação de treino
│   └── workouts/   # Dashboard de treinos e acompanhamento de séries
├── services/       # Integração com a API (fetch wrapper com JWT)
├── styles/         # Variáveis CSS globais e reset
├── types/          # Interfaces TypeScript globais (Usuario, Treino, Exercicio)
└── App.tsx         # Rotas e provedores base
```

## 🔐 Autenticação e Segurança

A comunicação com a API backend é feita através de **JWT (JSON Web Tokens)**:
- O token é armazenado no `localStorage`.
- Todas as requisições autenticadas (através de `services/api.ts`) anexam automaticamente o token no cabeçalho `Authorization: Bearer <token>`.
- Componentes bloqueados verificam o estado de autenticação consumindo o `useAuth()` e redirecionam para o `/login` caso o usuário não esteja logado.

## 🎨 UI/UX e Feedbacks
- **Toasts / Banners Visuais**: A aplicação trata de erros exibindo diretamente na interface de forma amigável.
- **Mídia**: Os exercícios são demonstrados em formato GIF (Estilo *Pixel Art* via CSS `image-rendering: pixelated`) puxados remotamente, visando baixo consumo de banda e animação ininterrupta.

## 🛠️ Como rodar localmente

```bash
# 1. Instalar as dependências
yarn install

# 2. Rodar o servidor de desenvolvimento
yarn dev
```