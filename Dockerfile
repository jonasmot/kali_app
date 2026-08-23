# ============================================================
# Kali App — Dockerfile (NestJS Backend)
# ============================================================
# Multi-stage build: build separado do runtime para imagem menor.
# ============================================================

# --- Estágio 1: Build ---
FROM node:22-alpine AS builder

WORKDIR /app

# Copiar apenas os arquivos de dependências primeiro (cache de camadas)
COPY package*.json ./
COPY prisma ./prisma/

RUN npm ci

# Copiar o código-fonte e fazer o build
COPY . .

# Gerar o Prisma Client ANTES da compilação do TypeScript
RUN npx prisma generate

# Fazer o build do NestJS
RUN npm run build

# --- Estágio 2: Runtime ---
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Copiar apenas o necessário do estágio de build
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/package.json ./package.json

# Porta exposta (configurável via env PORT)
EXPOSE 3000

# Comando de inicialização em produção
CMD ["node", "dist/main"]
