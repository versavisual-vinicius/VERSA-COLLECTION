# Estágio 1: Build
FROM node:24-alpine AS builder

WORKDIR /app

# Ativa Corepack para pnpm 12
RUN corepack enable && corepack prepare pnpm@12.15.0 --activate

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm build

# Estágio 2: Runtime enxuto
FROM node:24-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=8080

RUN corepack enable && corepack prepare pnpm@12.15.0 --activate

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --prod --frozen-lockfile --ignore-scripts

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/dist-server ./dist-server
COPY server.mjs ./

EXPOSE 8080

CMD ["node", "server.mjs"]

