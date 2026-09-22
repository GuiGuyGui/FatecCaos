# FatecCaos - Production Dockerfile for Render Web Service
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install production dependencies
RUN npm install --production

# Copy all project and public game build files
COPY . .

# Expose port (Render defaults to 10000 or process.env.PORT)
EXPOSE 10000

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:10000/health || exit 1

# Start the Web Service
CMD ["npm", "start"]
