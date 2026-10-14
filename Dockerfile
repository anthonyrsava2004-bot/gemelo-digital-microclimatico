# Etapa 1: Construcción (Builder)
FROM node:20-alpine AS builder

WORKDIR /app

# Instalar dependencias
COPY package*.json ./
RUN npm ci

# Copiar código fuente y compilar bundle frontend + servidor
COPY . .
RUN npm run build

# Etapa 2: Entorno de producción ligero (Runner)
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Instalar únicamente dependencias de ejecución
COPY package*.json ./
RUN npm ci --omit=dev

# Copiar el artefacto compilado desde la etapa de construcción
COPY --from=builder /app/dist ./dist

EXPOSE 3000

CMD ["node", "dist/server.cjs"]
