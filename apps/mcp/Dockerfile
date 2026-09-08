# syntax=docker/dockerfile:1
FROM node:22-slim AS build
WORKDIR /app
RUN apt-get update && apt-get install -y --no-install-recommends python3 make g++ && rm -rf /var/lib/apt/lists/*
COPY package.json package-lock.json ./
COPY tsconfig.base.json ./
COPY packages ./packages
COPY apps/web ./apps/web
COPY apps/mcp ./apps/mcp
RUN npm ci
RUN cd apps/mcp && npx tsc -p tsconfig.json --noEmit false --outDir dist --rootDir src

FROM node:22-slim AS runtime
WORKDIR /app
ENV NODE_ENV=production PORT=3200
COPY --from=build --chown=node:node /app/node_modules ./node_modules
COPY --from=build --chown=node:node /app/apps/mcp/dist ./dist
COPY --from=build --chown=node:node /app/apps/mcp/package.json ./package.json
USER node
EXPOSE 3200
CMD ["node", "dist/server.js"]
