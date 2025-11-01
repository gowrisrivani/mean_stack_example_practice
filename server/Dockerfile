# ---- Build Stage ----
FROM node:20-slim

WORKDIR /usr/app

# Install dependencies
COPY package*.json ./
RUN npm ci --omit=dev

# Copy source and build
COPY . .
RUN npm run build

# Expose port (your Express app runs on 5200)
EXPOSE 5200

# Start the server
CMD ["node", "dist/server.js"]
