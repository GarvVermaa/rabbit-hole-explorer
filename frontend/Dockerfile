# ── Stage 1: Install dependencies ──────────────────────────────────────────
FROM node:20-alpine AS deps
WORKDIR /app

# Copy root package.json (needed for the "file:.." dependency)
COPY package.json ./

# Copy frontend package files
COPY frontend/package.json frontend/package-lock.json ./frontend/

WORKDIR /app/frontend
RUN npm ci

# ── Stage 2: Build the Next.js app ────────────────────────────────────────
FROM node:20-alpine AS builder
WORKDIR /app

# Copy root package.json
COPY package.json ./

# Copy installed node_modules from deps stage
COPY --from=deps /app/frontend/node_modules ./frontend/node_modules

# Copy frontend source code
COPY frontend/ ./frontend/

# Build argument for the API URL (baked into the client bundle)
ARG NEXT_PUBLIC_API_URL=http://localhost:5000/api
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

WORKDIR /app/frontend
RUN npm run build

# ── Stage 3: Production image ─────────────────────────────────────────────
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs && \
    adduser  --system --uid 1001 nextjs

# Copy the standalone server output
COPY --from=builder /app/frontend/.next/standalone ./
# Copy static assets
COPY --from=builder /app/frontend/.next/static ./frontend/.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "frontend/server.js"]
