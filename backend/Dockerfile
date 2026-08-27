FROM node:24-alpine AS dependencies
WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM dependencies AS build
COPY . .
RUN npm run build

FROM node:24-alpine AS production-dependencies
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev

FROM node:24-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY --from=production-dependencies /app/package*.json ./
COPY --from=production-dependencies /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
EXPOSE 3000
CMD ["node", "dist/main.js"]
