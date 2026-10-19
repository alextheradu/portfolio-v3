FROM node:22.12.0-bookworm-slim AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM node:22.12.0-bookworm-slim

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY astro.config.mjs ./
COPY --from=builder /app/dist ./dist

ENV HOST=0.0.0.0
ENV PORT=3000

EXPOSE 3000

CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "3000"]
