# Gunakan image resmi Node.js
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Salin file dependency
COPY package*.json ./

# Install dependency
RUN npm install

# Salin semua file project
COPY . .

# Build TypeScript
RUN npm run build

EXPOSE 3000

# Jalankan aplikasi
CMD ["npm", "start"]
