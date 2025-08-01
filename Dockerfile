# Etapa 1: build da aplicação
FROM node:20-alpine AS builder

WORKDIR /app

# Copia apenas arquivos de dependências para instalar mais rápido (melhor cache)
COPY package.json pnpm-lock.yaml* package-lock.json* yarn.lock* ./

# Instala dependências
RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile

# Copia todo o projeto (menos o que estiver no .dockerignore)
COPY . .

# Gera o build do Next.js
RUN pnpm build

# Etapa 2: imagem final enxuta
FROM node:20-alpine AS runner

WORKDIR /app

# Só precisamos do build e das dependências de produção
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/next.config.js ./next.config.js

ENV NODE_ENV=production
ENV PORT=3001

EXPOSE 3001

CMD ["npm", "run", "start"]