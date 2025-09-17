FROM node:alpine AS builder

WORKDIR /app
RUN mkdir -p /app/config

COPY client/package.json ./client/package.json
COPY client/yarn.lock ./client/yarn.lock
COPY client/tsconfig.json ./client/tsconfig.json
COPY client/vite.config.ts ./client/vite.config.ts
COPY client/index.html ./client/index.html
COPY client/src ./client/src
COPY client/public ./client/public
COPY config/config.json ./config/config.json
COPY config/nginx.conf ./config/nginx.conf

WORKDIR /app/client

RUN yarn install --immutable

RUN yarn build

FROM nginx:alpine

COPY --from=builder /app/client/build /usr/share/nginx/html
COPY --from=builder /app/config/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
