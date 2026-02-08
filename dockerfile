# =========================
# BUILD STAGE
# =========================
FROM node:20-alpine AS builder

WORKDIR /app

# Ativar pnpm
RUN corepack enable

# Copiar arquivos de dependências
COPY package.json pnpm-lock.yaml ./

# Instalar dependências
RUN pnpm install --frozen-lockfile

# Copiar código e build
COPY . .
RUN pnpm build

# =========================
# RUNTIME STAGE
# =========================
FROM node:20-alpine AS runner

WORKDIR /app

# Ativar pnpm
RUN corepack enable

ENV NODE_ENV=production

# Copiar build
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3000

# Forçar Next.js a escutar em todas as interfaces
CMD ["pnpm", "start", "--hostname", "0.0.0.0"]
