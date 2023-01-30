FROM node:18-alpine as helpr-api

ARG DATABASE_URL
ARG MAILER_HOST
ARG MAILER_PORT
ARG MAILER_USER
ARG MAILER_PASSWORD
ARG AUTH_TOKEN_SECRET
ARG REFRESH_TOKEN_SECRET
ARG AUTH_TOKEN_EXPIRATION
ARG REFRESH_TOKEN_EXPIRATION
ARG STRIPE_SECRET_KEY
ARG FRONTEND_URL
ARG APP_ENV
ARG API_URL

WORKDIR /app

RUN npm install -g pnpm

RUN apk add --update --no-cache python3 build-base gcc && ln -sf /usr/bin/python3 /usr/bin/python

COPY . .

RUN pnpm install
RUN pnpm build

RUN npx prisma generate

CMD ["pnpm", "start"]

EXPOSE 3000