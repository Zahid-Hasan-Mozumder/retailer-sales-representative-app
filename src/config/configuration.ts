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
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT || '6379'),
        username: process.env.REDIS_USERNAME,
        password: process.env.REDIS_PASSWORD,
    },
});