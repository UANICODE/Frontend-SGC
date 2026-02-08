# Dockerfile
FROM node:20-alpine

# Diretório de trabalho
WORKDIR /app

# Copiar package.json e package-lock.json primeiro (para cache de dependências)
COPY package*.json ./

# Instalar dependências
RUN npm install --production

# Copiar todo o código
COPY . .

# Build do Next.js
RUN npm run build

# Expor porta padrão do Next.js
EXPOSE 3000

# Rodar Next.js
CMD ["npm", "start"]
