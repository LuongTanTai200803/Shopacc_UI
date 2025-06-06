# Sử dụng Node.js phiên bản 20 (đáp ứng yêu cầu >=20.0.0)
FROM node:20

# Tạo thư mục làm việc
WORKDIR /app

# Copy package.json và package-lock.json (tối ưu cache)
COPY package*.json ./

# Cài đặt dependencies
RUN npm ci


# Build project
RUN npm run build

# Cài đặt serve để chạy production
RUN npm install -g serve

# Chạy server với port từ Railway
ENV PORT=3000
EXPOSE 3000
CMD ["serve", "-s", "dist", "-l", "3000"]