# syntax=docker/dockerfile:1
#
# OP Video Engine — Frontend image contract (F4, PR-F03).
# Owner-run only: the agent never executes `docker build`. Frozen pnpm
# install, standalone Next.js output, non-root runtime, owner-supplied
# candidate SHA / API target as required build args.

FROM node:22.22.3-alpine AS base
RUN corepack enable && corepack prepare pnpm@10.15.1 --activate
WORKDIR /app

FROM base AS deps
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

FROM base AS builder
ARG BUILD_SHA
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_BUILD_SHA=${BUILD_SHA}
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm run build

FROM node:22.22.3-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
USER nextjs
EXPOSE 3000
ENV PORT=3000
CMD ["node", "server.js"]
