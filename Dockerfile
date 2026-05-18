FROM node:24-alpine AS base
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

#====================================================#

FROM base AS development
COPY . .
ENV NODE_ENV=development
EXPOSE 3000
CMD ["npm", "run", "dev"]

#====================================================#

FROM base AS builder
COPY . .
RUN npm run build
RUN npm prune --production

#====================================================#

FROM node:24-alpine3.21 AS production
WORKDIR /var/www/app
ENV NODE_ENV=production

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/bin ./bin
COPY --from=builder /app/lib ./lib
COPY --from=builder /app/package.json ./package.json

RUN chown -R node:node /var/www/app
USER node

EXPOSE 3000
CMD ["sh", "-c", "npm run start"]
