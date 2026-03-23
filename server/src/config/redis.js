const IORedis = require("ioredis");
const { REDIS_HOST, REDIS_PORT } = require('../../constants');

const connection = new IORedis({
  host: REDIS_HOST,
  port: REDIS_PORT,
  maxRetriesPerRequest: null
});

module.exports = connection;