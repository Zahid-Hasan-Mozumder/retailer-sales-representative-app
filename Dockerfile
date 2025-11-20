# syntax=docker/dockerfile:1
FROM node:18-slim AS builder
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi

# Copy source
COPY . .

# Build application and generate Prisma client
RUN npm run build
RUN npx prisma generate

FROM node:18-slim AS runner
WORKDIR /app
ENV NODE_ENV=production

# Copy metadata and built artifacts
COPY package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/generated ./generated
COPY prisma ./prisma

EXPOSE 3000

# Default command (compose overrides to run migrations before start)
CMD ["node", "dist/main"]