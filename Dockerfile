# Stage 1: Development Dependencies
FROM node:20-alpine AS development-dependencies-env
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# Stage 2: Production Dependencies
FROM node:20-alpine AS production-dependencies-env
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev && \
    npm prune --production && \
    npm cache clean --force && \
    rm -rf /tmp/* ~/.npm

# Stage 3: Build
FROM node:20-alpine AS build-env
WORKDIR /app
COPY . ./
COPY --from=development-dependencies-env /app/node_modules ./node_modules
RUN npm run build && \
    rm -rf node_modules

# Stage 4: Production Runtime
FROM node:20-alpine

# Create user FIRST (before copying files)
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

WORKDIR /app

# Copy files with correct ownership from the start
COPY --chown=nodejs:nodejs package.json package-lock.json ./
COPY --chown=nodejs:nodejs --from=production-dependencies-env /app/node_modules ./node_modules
COPY --chown=nodejs:nodejs --from=build-env /app/build ./build
COPY --chown=nodejs:nodejs instrument.server.mjs ./

USER nodejs

EXPOSE 5173

CMD ["npm", "run", "start"]