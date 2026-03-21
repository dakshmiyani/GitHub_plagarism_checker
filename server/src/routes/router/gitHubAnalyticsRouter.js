const express = require("express");
const GithubAnalyticsManager = require("../../businessLogic/managers/gitHubAnalyticsManager");
const { appWrapper } = require("../routeWrapper");
const { ACCESS_ROLES } = require("../../businessLogic/accessmanagement/roleConstants");

const router = express.Router();

/**
 * POST /github_analytics
 * Fetch analytics for a GitHub repository
 * Body: { repoUrl }
 * Access: ALL
 */

router.post(
  "/github_analytics",
  appWrapper(
    async (req, res) => {

      const { repoUrl } = req.body;

      const analytics = await GithubAnalyticsManager.getRepoAnalytics(repoUrl);

      return res.json({
        success: true,
        data: analytics,
        message: "GitHub analytics fetched successfully"
      });

    },
    [ACCESS_ROLES.ALL]
  )
);

module.exports = router;