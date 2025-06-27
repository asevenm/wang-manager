# 构建阶段
FROM node AS build

RUN npm config set registry https://registry.npmmirror.com

WORKDIR /app
COPY . .
RUN yarn && yarn build-only

# 生产阶段
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf