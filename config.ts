export const config = () => ({
  env: process.env.NODE_ENV,
  jwt: {
    access_token_secret: process.env.ACCESS_TOKEN_SECRET,
    refresh_token_secret: process.env.REFRESH_TOKEN_SECRET,
    access_token_expiration: process.env.ACCESS_TOKEN_EXPIRATION,
    refresh_token_expiration: process.env.REFRESH_TOKEN_EXPIRATION,
  },
  google: {
    client_id: process.env.GOOGLE_CLIENT_ID,
  },
  mailer: {
    host: process.env.MAILER_HOST,
    port: process.env.MAILER_PORT,
    auth: {
      user: process.env.MAILER_USER,
      password: process.env.MAILER_PASSWORD,
    },
  },
  stripe: {
    secret_key: process.env.STRIPE_SECRET_KEY,
  },
  frontend_url: process.env.FRONTEND_URL,
  cookie_domain: process.env.COOKIE_DOMAIN,
});
