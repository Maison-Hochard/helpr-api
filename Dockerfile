FROM node:18-alpine as builder

ARG DATABASE_URL
ARG MAILER_HOST
ARG MAILER_PORT
ARG MAILER_USER
ARG MAILER_PASSWORD
ARG AUTH_TOKEN_SECRET
ARG REFRESH_TOKEN_SECRET
ARG AUTH_TOKEN_EXPIRATION
ARG REFRESH_TOKEN_EXPIRATION
ARG GOOGLE_CLIENT_ID
ARG STRIPE_SECRET_KEY
ARG FRONTEND_URL
ARG APP_ENV

WORKDIR /api

RUN npm install -g pnpm

RUN apk add --update --no-cache openssl1.1-compat python3 build-base gcc && ln -sf /usr/bin/python3 /usr/bin/python

COPY . .

COPY package.json package.json

RUN pnpm install

RUN npx prisma generate

RUN pnpm build

FROM node:18-alpine as helpr-api

WORKDIR /api

RUN npm install -g pnpm

COPY --from=builder /api .

CMD ["pnpm", "start"]

EXPOSE 8080