# =========================
# BUILD STAGE
# =========================
FROM node:20-alpine AS builder

WORKDIR /app

# Ativar pnpm via corepack
RUN corepack enable

# Copiar arquivos de dependências
COPY package.json pnpm-lock.yaml ./

# Instalar dependências (com dev, necessário para build)
RUN pnpm install --frozen-lockfile

# Copiar o restante do código e build
COPY . .
RUN pnpm build

# =========================
# RUNTIME STAGE
# =========================
FROM node:20-alpine AS runner

WORKDIR /app

# Ativar pnpm no runtime
RUN corepack enable

ENV NODE_ENV=production

# Copiar apenas o necessário
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3000

CMD ["pnpm", "start"]
