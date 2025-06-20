# 构建阶段
FROM node:22 AS build
WORKDIR /app
COPY . .
RUN yarn && yarn build

# 生产阶段
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html