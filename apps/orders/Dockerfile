# --------------------------
# Development image
# --------------------------
FROM node:22-alpine AS development

WORKDIR /usr/src/app

# Install all dependencies
COPY package.json ./
COPY pnpm-lock.yaml ./
COPY tsconfig.json ./
COPY nest-cli.json ./

RUN npm install -g pnpm

RUN pnpm install

# Copy all files
COPY apps/orders ./apps/orders
COPY libs ./libs

# Build the application
RUN pnpm build orders

# --------------------------
# Production image
# --------------------------
FROM node:22-alpine AS production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

# Install production dependencies
COPY package.json ./
COPY pnpm-lock.yaml ./

RUN npm install -g pnpm

RUN pnpm install --prod --frozen-lockfile

# Copy built files from development image
COPY --from=development /usr/src/app/dist ./dist

# Set the user to node for security
USER node

CMD ["node", "dist/apps/orders/main.js"]
