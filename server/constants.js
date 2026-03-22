const getRequiredEnv = (key) => {
    const value = process.env[key];
    if (!value) {
        throw new Error(`Missing required environment variable: ${key}`);
    }
    return value;
};

const NODE_ENV = getRequiredEnv("NODE_ENV");
const PORT = Number(getRequiredEnv("PORT"));
const DATABASE_URL = getRequiredEnv("DATABASE_URL");
const JWT_SECRET_KEY = getRequiredEnv("JWT_SECRET_KEY");
const GITHUB_TOKEN = getRequiredEnv("GITHUB_TOKEN");
const REDIS_HOST = getRequiredEnv("REDIS_HOST");
const REDIS_PORT = Number(getRequiredEnv("REDIS_PORT"));
const LOG_LEVEL = getRequiredEnv("LOG_LEVEL");
const IS_PRODUCTION = NODE_ENV === "production";

module.exports = {
    NODE_ENV,
    PORT,
    DATABASE_URL,
    JWT_SECRET_KEY,
    GITHUB_TOKEN,
    REDIS_HOST,
    REDIS_PORT,
    LOG_LEVEL,
    IS_PRODUCTION,
    getRequiredEnv
};
