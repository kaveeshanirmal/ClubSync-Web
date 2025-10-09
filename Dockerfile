# Base image
FROM node:22-alpine

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

# Set environment variable to skip build optimization
ENV NEXT_SKIP_BUILD_OPTIMIZATION=1

# Build Next.js for production
RUN npm run build

# Expose port
EXPOSE 3000

# Start app
CMD ["npm", "start"]