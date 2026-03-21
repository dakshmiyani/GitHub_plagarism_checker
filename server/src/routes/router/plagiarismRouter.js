const express = require("express");
const plagiarismQueue = require("../../queues/plagiarismQueue");
const { Queue } = require("bullmq");
const connection = require("../../config/redis");

const queue = new Queue("plagiarism-check", { connection });
const router = express.Router();

/**
 * GET /plagiarism/job/:id
 * Poll status of a plagiarism check job.
 */
router.get("/job/:id", async (req, res) => {
  try {
    const job = await queue.getJob(req.params.id);

    if (!job) {
      return res.status(404).json({ error: "Job not found" });
    }

    const state = await job.getState();

    res.json({
      jobId: job.id,
      status: state,
      result: job.returnvalue || null,
      failedReason: job.failedReason || null
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * POST /plagiarism/check
 * Start a plagiarism scan.
 *
 * Body:
 *   { repoUrl: string, compareUrls?: string[] }
 *
 * compareUrls — optional array of other hackathon repos to compare directly.
 */
router.post("/check", async (req, res) => {
  const { repoUrl, compareUrls = [] } = req.body;

  if (!repoUrl) {
    return res.status(400).json({ error: "repoUrl is required" });
  }

  const job = await plagiarismQueue.add("scanRepo", {
    repoUrl,
    compareUrls
  });

  res.json({
    success: true,
    jobId: job.id,
    message: "Plagiarism scan started. Poll /plagiarism/job/:id for results."
  });
});

module.exports = router;