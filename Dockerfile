# Stage 1: Builder
FROM node:22-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Disable Husky during Docker build
ENV HUSKY=0

# Install all dependencies (including devDependencies for build)
RUN npm ci --ignore-scripts --only=production && \
    cp -R node_modules /prod_node_modules && \
    npm ci --ignore-scripts

# Copy source code and Prisma schema
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build Next.js for production
RUN npm run build

# Stage 2: Runtime
FROM node:22-alpine

WORKDIR /app

# Copy only production dependencies from builder
COPY --from=builder /prod_node_modules ./node_modules

# Copy necessary files from builder
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/prisma ./prisma

# Generate Prisma client in runtime (required for @prisma/client imports)
RUN npx prisma generate

# Expose port
EXPOSE 3000

# Start app
CMD ["npm", "start"]
