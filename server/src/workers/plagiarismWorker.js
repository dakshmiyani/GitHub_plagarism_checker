require("dotenv").config();
const { Worker } = require("bullmq");
const connection = require("../config/redis");
const PlagiarismManager = require("../businessLogic/managers/PlagiarismManager");
const logger = require("../utils/logger");

const worker = new Worker(
  "plagiarism-check",
  async job => {
    const { repoUrl, compareUrls = [] } = job.data;

    logger.info(`[Worker] Job ${job.id} — scanning: ${repoUrl}`);
    if (compareUrls.length > 0) {
      logger.info(`[Worker] Comparing against ${compareUrls.length} other repo(s).`);
    }

    const result = await PlagiarismManager.detectGlobalPlagiarism(
      repoUrl,
      compareUrls
    );

    return result;
  },
  { 
    connection, 
    concurrency: 2,
    lockDuration: 600000, // 10 minutes
    lockRenewTime: 30000, 
    stalledInterval: 300000 // 5 minutes before considering it stalled
  }
);

worker.on("completed", job => {
  const report = job.returnvalue && job.returnvalue.report;
  if (report) {
    logger.info(
      `[Worker] ✅ Job ${job.id} completed — Score: ${report.plagiarismScore}% — Verdict: ${report.verdict}`
    );
  } else {
    logger.info(`[Worker] ✅ Job ${job.id} completed.`);
  }
});

worker.on("failed", (job, err) => {
  logger.error(`[Worker] ❌ Job ${job.id} failed: ${err.message}`, { err });
});

logger.info("[Worker] Started and waiting for plagiarism jobs...");
