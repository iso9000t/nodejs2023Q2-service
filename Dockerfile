# Define node version for reuse in different stages
ARG NODE_VERSION=20-alpine

# Development stage
FROM node:${NODE_VERSION} AS development
USER node
WORKDIR /app

# Install dependencies
COPY ["package.json", "package-lock.json*", "./"]
RUN npm ci

# Generate Prisma client
COPY prisma ./prisma
RUN npx prisma generate

# Copy application code
COPY --chown=node:node . .
CMD ["npm", "run", "start:dev"]

# Build stage
FROM node:${NODE_VERSION} AS build
USER node
WORKDIR /app

# Copying necessary files
COPY --chown=node:node --from=development /app/node_modules ./node_modules
COPY --chown=node:node . .

# Build application
RUN npm run build

# Setting production environment
ENV NODE_ENV production

# Install production dependencies only
RUN npm ci --omit=dev && npm cache clean --force

# Production stage
FROM node:${NODE_VERSION} AS production
USER node
WORKDIR /app

# Copying necessary artifacts for production
COPY --chown=node:node --from=build /app/node_modules ./node_modules
COPY --chown=node:node --from=build /app/dist ./dist
COPY --chown=node:node ./doc ./doc

# Command to run the application
CMD ["node", "dist/main.js"]
