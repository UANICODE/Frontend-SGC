# =========================
# BUILD STAGE
# =========================
FROM node:20-alpine AS builder

WORKDIR /app

# Ativar pnpm via corepack
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copiar manifests primeiro (cache eficiente)
COPY package.json pnpm-lock.yaml ./

# Instalar dependências (com dev, necessário para build)
RUN pnpm install --frozen-lockfile

# Copiar código
COPY . .

# Build do Next.js
RUN pnpm build


# =========================
# RUNTIME STAGE
# =========================
FROM node:20-alpine AS runner

WORKDIR /app

# Segurança básica
RUN addgroup -g 1001 nodejs \
 && adduser -u 1001 -G nodejs -s /bin/sh -D nextjs

# Ativar pnpm no runtime
RUN corepack enable && corepack prepare pnpm@latest --activate

ENV NODE_ENV=production

# Copiar apenas o output necessário
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/pnpm-lock.yaml ./pnpm-lock.yaml

# Instalar SOMENTE dependências de produção
RUN pnpm install --prod --frozen-lockfile

# Ajustar permissões
RUN chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 3000

CMD ["pnpm", "start"]
