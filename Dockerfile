# ---------- build ----------
FROM node:20-alpine AS builder

ARG NEXT_PUBLIC_APPLICATIONINSIGHTS_CONNECTION_STRING

ENV CI=true
ENV NEXT_PUBLIC_APPLICATIONINSIGHTS_CONNECTION_STRING=${NEXT_PUBLIC_APPLICATIONINSIGHTS_CONNECTION_STRING}

WORKDIR /app

RUN apk add --no-cache libc6-compat
RUN npm i -g pnpm

COPY package.json pnpm-lock.yaml ./

RUN --mount=type=cache,id=pnpm,target=/root/.pnpm-store \
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
