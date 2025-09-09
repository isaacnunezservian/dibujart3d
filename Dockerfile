# FOUNDATION LAYER
# Use official Node.js 18 on Alpine Linux (lightweight)
# Alpine = 5MB base vs Ubuntu = 200MB base
FROM node:18-alpine

# WORKSPACE SETUP
# Create /app directory inside container
# All subsequent commands run from /app
WORKDIR /app

# DEPENDENCY OPTIMIZATION
# Copy package files first for better caching
# If source code changes, dependencies won't reinstall
COPY package*.json ./

# INSTALL OPENSSL 1.1
RUN apk add --no-cache openssl

# DEPENDENCY INSTALLATION
# npm ci: faster, deterministic installs
# --only=production: skip devDependencies (smaller image)
RUN npm ci --only=production

# SOURCE CODE COPY
# Copy all source files (respects .dockerignore)
COPY . .

# PRISMA CLIENT GENERATION
# Generate Prisma client inside container
# Required because client is platform-specific
RUN npx prisma generate

# BUILD APPLICATION
# Compile TypeScript to JavaScript
# Creates dist/ directory with production-ready code
RUN npm run build



# NETWORK CONFIGURATION
# Document that app listens on port 3001
# Allows port mapping when running container
EXPOSE 3001

# STARTUP COMMAND
# Command to run when container starts
# Executes the built JavaScript (dist/index.js)
CMD ["npm", "start"]

# When you change source code:
# Layers 1-2 are cached (unchanged)
# Only layers 3-4 rebuild