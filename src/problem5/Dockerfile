FROM node:18 as builder

WORKDIR /app

COPY package.json ./
COPY package-lock.json ./

RUN npm install

COPY . .

RUN npm run build

FROM node:18

WORKDIR /app

# COPY .env.example .env
# COPY .env.default .env.production
# COPY .env.default .env.staging
# COPY .env.default .env.test
COPY --from=builder /app/package.json ./
COPY --from=builder /app/package-lock.json ./
COPY --from=builder /app/app-config.js .
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 9000

ENTRYPOINT ["node", "dist/src/index.js"]