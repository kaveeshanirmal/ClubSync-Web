# Base image
FROM node:18-alpine

# Working directory
WORKDIR /app

# Copy dependencies
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build Next.js for production
RUN npm run build -- --no-lint

# Expose port
EXPOSE 3000

# Start app
CMD ["npm", "start"]