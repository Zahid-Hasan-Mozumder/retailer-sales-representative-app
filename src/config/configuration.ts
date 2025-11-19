export default () => ({
  node: {
    env: process.env.NODE_ENV,
  },
  port: parseInt(process.env.PORT || '3000'),
  database: {
    url: process.env.DATABASE_URL,
  },
  auth: {
    accessTokenSecret: process.env.JWT_ACCESS_TOKEN_SECRET,
    refreshTokenSecret: process.env.JWT_REFRESH_TOKEN_SECRET,
  },
  redis: {
    url: process.env.REDIS_URL,
  },
});
