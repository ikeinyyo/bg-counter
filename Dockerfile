# ---------- build ----------
FROM node:20-alpine AS builder

ARG TARGETARCH
ENV CI=true

WORKDIR /app

RUN apk add --no-cache libc6-compat
RUN npm install --global pnpm@10.14.0
RUN pnpm config set store-dir /root/.pnpm-store

COPY package.json pnpm-lock.yaml ./

RUN --mount=type=cache,id=pnpm-${TARGETARCH},target=/root/.pnpm-store \
    pnpm install --frozen-lockfile --ignore-scripts

COPY . .

RUN pnpm build


# ---------- runner ----------
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

EXPOSE 3000

CMD ["node", "server.js"]
