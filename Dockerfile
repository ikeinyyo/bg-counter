# ---------- build ----------
    FROM node:20-alpine AS builder
    WORKDIR /app
    RUN apk add --no-cache libc6-compat   # soluciona node-gyp en alpine
    RUN npm i -g pnpm
    
    COPY package.json pnpm-lock.yaml* ./
    
    # cache de la store de pnpm:
    RUN --mount=type=cache,id=pnpm,target=/root/.pnpm-store \
        pnpm install --frozen-lockfile --ignore-scripts
    
    COPY . .
    RUN pnpm build && pnpm prune --prod
    
    # ---------- runner ----------
    FROM node:20-alpine AS runner
    WORKDIR /app
    ENV NODE_ENV=production
    RUN npm i -g pnpm typescript          # ⇐ o quítalo si usas config.js
    
    # sólo lo necesario:
    COPY --from=builder /app/node_modules ./node_modules
    COPY --from=builder /app/.next ./.next
    COPY --from=builder /app/public ./public
    COPY --from=builder /app/next.config.ts ./next.config.ts
    COPY --from=builder /app/package.json ./package.json
    
    EXPOSE 3000
    CMD ["pnpm", "start"]
    