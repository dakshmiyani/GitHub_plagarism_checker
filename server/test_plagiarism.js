/**
 * Test script for plagiarism detection.
 * Usage: node test_plagiarism.js <repoUrl> [compareUrl1] [compareUrl2] ...
 *
 * Example:
 *   node test_plagiarism.js https://github.com/user/repo https://github.com/other/repo
 */
require("dotenv").config();

const axios = require("axios");

const BASE_URL = process.env.TEST_SERVER_URL || "http://localhost:3000";

const args = process.argv.slice(2);
if (args.length === 0) {
  console.error("Usage: node test_plagiarism.js <repoUrl> [compareUrl1] [compareUrl2]...");
  process.exit(1);
}

const repoUrl = args[0];
const compareUrls = args.slice(1);

async function run() {
  console.log("\n===== Plagiarism Check Test =====");
  console.log("Repo:       ", repoUrl);
  if (compareUrls.length > 0) {
    console.log("Compare to: ", compareUrls.join(", "));
  }
  console.log("");

  // Step 1: Submit job
  let jobId;
  try {
    const res = await axios.post(`${BASE_URL}/plagiarism/check`, {
      repoUrl,
      compareUrls
    });
    jobId = res.data.jobId;
    console.log(`✅ Job submitted — ID: ${jobId}`);
  } catch (err) {
    console.error("❌ Failed to submit job:", err.response?.data || err.message);
    process.exit(1);
  }

  // Step 2: Poll until done
  console.log("\nPolling for results (every 8s)...\n");
  let attempts = 0;
  const MAX_ATTEMPTS = 60; // 8 min max

  while (attempts < MAX_ATTEMPTS) {
    await new Promise(r => setTimeout(r, 8000));
    attempts++;

    try {
      const res = await axios.get(`${BASE_URL}/plagiarism/job/${jobId}`);
      const { status, result, failedReason } = res.data;

      console.log(`[Attempt ${attempts}] Status: ${status}`);

      if (status === "completed" && result) {
        console.log("\n===== PLAGIARISM REPORT =====");
        const r = result.report;
        if (!r) {
          console.log("Raw result:", JSON.stringify(result, null, 2));
        } else {
          console.log(`Repo:             ${r.repoUrl}`);
          console.log(`Plagiarism Score: ${r.plagiarismScore}%`);
          console.log(`Uniqueness Score: ${r.uniquenessScore}%`);
          console.log(`Verdict:          ${r.verdict}`);
          console.log(`Files Analyzed:   ${r.totalFilesAnalyzed}`);
          console.log(`Tokens:           ${r.totalTokens}`);
          console.log(`Time Taken:       ${r.timeTakenSeconds}s`);
          console.log(`Snippets Used:    ${r.searchSnippetsUsed}`);
          console.log(`GH Candidates:    ${r.candidatesChecked}`);

          if (r.matchedRepos && r.matchedRepos.length > 0) {
            console.log("\n📋 Direct Matches:");
            r.matchedRepos.forEach(m => {
              console.log(`  - ${m.repository}: ${m.similarity}%`);
            });
          } else {
            console.log("\n📋 No direct repo matches.");
          }

          if (r.githubMatches && r.githubMatches.length > 0) {
            console.log("\n🌐 GitHub Matches:");
            r.githubMatches.forEach(m => {
              console.log(`  - ${m.repository}: ${m.similarity}%`);
            });
          } else {
            console.log("🌐 No GitHub matches found.");
          }
        }
        break;
      }

      if (status === "failed") {
        console.error(`\n❌ Job failed: ${failedReason}`);
        break;
      }
    } catch (err) {
      console.error(`Poll error: ${err.message}`);
    }
  }

  if (attempts >= MAX_ATTEMPTS) {
    console.log("\n⏱ Timed out waiting for result.");
  }
}

run();
