const express = require("express");
const HealthCheckManager = require("../../businessLogic/managers/HealthCheckManager");

const router = express.Router();

/**
 * GET /health
 * Get server, database, and redis health status
 * Access: OPEN
 */
router.get("/", async (req, res) => {
  const health = await HealthCheckManager.getHealthStatus();
  const isHealthy = health.database === "up" && health.redis === "up";
  res.status(isHealthy ? 200 : 503).json(health);
});

module.exports = router;
