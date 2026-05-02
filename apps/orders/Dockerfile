# --------------------------
# Development image
# --------------------------
FROM node:22-alpine AS development

WORKDIR /usr/src/app

COPY package.json ./
COPY pnpm-lock.yaml ./
COPY tsconfig.json ./
COPY nest-cli.json ./

RUN npm install -g pnpm

RUN pnpm install --frozen-lockfile

COPY apps/orders ./apps/orders
COPY libs ./libs

RUN pnpm build orders

# --------------------------
# Production image
# --------------------------
FROM node:22-alpine AS production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package.json ./
COPY pnpm-lock.yaml ./

RUN npm install -g pnpm

RUN pnpm install --prod --frozen-lockfile

COPY --from=development /usr/src/app/dist ./dist

USER node

EXPOSE 3000

CMD ["node", "dist/apps/orders/main.js"]
