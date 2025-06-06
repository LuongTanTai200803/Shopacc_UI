# Sử dụng Node.js phiên bản 20 (đáp ứng yêu cầu >=20.0.0)
FROM node:20

# Tạo thư mục làm việc
WORKDIR /app

# Copy package.json và package-lock.json (tối ưu cache)
COPY package*.json ./

# Cài đặt dependencies
RUN npm ci

# Copy toàn bộ mã nguồn (bao gồm index.html, vite.config.js, src/)
COPY . .

# Build project
RUN npm run build

# Cài đặt serve để chạy production
RUN npm install -g serve

# Chạy server với port từ Railway
ENV PORT=3000
EXPOSE 3000
CMD sh -c "serve -s dist -l tcp://0.0.0.0:${PORT:-3000}"