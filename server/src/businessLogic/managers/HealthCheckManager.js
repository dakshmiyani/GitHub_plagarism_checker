const Db = require("../../models/libs/Db");
const redis = require("../../config/redis");

class HealthCheckManager {
  static async getHealthStatus() {
    const health = {
      server: "up",
      database: "down",
      redis: "down",
      timestamp: new Date().toISOString()
    };

    try {
      await Db.getQueryBuilder().raw('SELECT 1');
      health.database = "up";
    } catch (err) {
      console.error("Health check database error:", err);
    }

    try {
      await redis.ping();
      health.redis = "up";
    } catch (err) {
      console.error("Health check redis error:", err);
    }

    return health;
  }
}

module.exports = HealthCheckManager;
