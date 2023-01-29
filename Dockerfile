FROM node:18-alpine as builder

ARG DATABASE_URL
ARG MAIL_HOST
ARG MAIL_PORT
ARG MAIL_USER
ARG MAIL_PASSWORD
ARG ACCESS_TOKEN_SECRET
ARG REFRESH_TOKEN_SECRET
ARG ACCESS_TOKEN_EXPIRATION
ARG REFRESH_TOKEN_EXPIRATION
ARG GOOGLE_CLIENT_ID
ARG STRIPE_SECRET_KEY
ARG FRONTEND_URL
ARG NODE_ENV

WORKDIR /app

RUN npm install -g pnpm

RUN apk add --update --no-cache openssl1.1-compat python3 build-base gcc && ln -sf /usr/bin/python3 /usr/bin/python

COPY . .

RUN pnpm install
RUN pnpm build

FROM node:18-alpine as helpr-api

WORKDIR /app

RUN npm install -g pnpm

COPY --from=builder /app .

RUN npx prisma generate

CMD ["pnpm", "start"]

EXPOSE 8080