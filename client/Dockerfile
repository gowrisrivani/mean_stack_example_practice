# ---- Build Stage ----
FROM node:20-slim AS build

# Set working directory inside container
WORKDIR /usr/src/app

# Copy only dependency files first (this prevents copying node_modules from Windows)
COPY package*.json ./

# Install fresh Linux-compatible dependencies
RUN npm ci

# Copy the rest of the Angular project files
COPY . .

# Build the Angular app for production
RUN npm run build -- --configuration production

# ---- Run Stage ----
FROM nginx:alpine

# Copy the built app from the build stage
COPY --from=build /usr/src/app/dist/client/browser /usr/share/nginx/html

# Replace default nginx config with yours
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80 inside container
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]

