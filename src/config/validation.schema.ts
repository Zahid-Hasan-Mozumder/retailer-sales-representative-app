import * as Joi from 'joi';

export const validationSchema = Joi.object({
    NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),

    // App Config
    PORT: Joi.number().default(3000),

    // Database Config
    DATABASE_URL: Joi.string().required(),

    // Auth Config
    JWT_ACCESS_TOKEN_SECRET: Joi.string().required(),
    JWT_REFRESH_TOKEN_SECRET: Joi.string().required(),

    // Redis Config
    REDIS_HOST: Joi.string().required(),
    REDIS_PORT: Joi.number().required(),
    REDIS_USERNAME: Joi.string().required(),
    REDIS_PASSWORD: Joi.string().required(),
});
