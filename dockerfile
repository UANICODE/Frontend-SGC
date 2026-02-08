# ========= BUILD =========
FROM node:20-alpine AS builder

WORKDIR /app

# Ativar pnpm via corepack
RUN corepack enable

# Copiar manifests
COPY package.json pnpm-lock.yaml ./

# Instalar TODAS as dependências (inclui dev)
RUN pnpm install --frozen-lockfile

# Copiar o código
COPY . .

# Build do Next.js
RUN pnpm build


# ========= RUN =========
FROM node:20-alpine AS runner

WORKDIR /app

RUN corepack enable

ENV NODE_ENV=production

# Copiar apenas o necessário do build
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3000

CMD ["pnpm", "start"]
