/**
 * Quick local test — runs plagiarism check directly (no queue/server needed).
 * Usage:  node test_direct.js <repoUrl> [compareUrl...]
 * Example: node test_direct.js https://github.com/dakshmiyani/Movify-main
 */
require("dotenv").config();
const PlagiarismManager = require("./src/businessLogic/managers/PlagiarismManager");

const args = process.argv.slice(2);
if (!args[0]) {
  console.error("Usage: node test_direct.js <repoUrl> [compareUrl...]");
  process.exit(1);
}

const [repoUrl, ...compareUrls] = args;

async function run() {
  console.log("=== Direct Plagiarism Test ===");
  console.log("Repo:      ", repoUrl);
  console.log("Compare:   ", compareUrls.length ? compareUrls : "(none — fork/name search only)");
  console.log("");

  try {
    const result = await PlagiarismManager.detectGlobalPlagiarism(repoUrl, compareUrls);
    const r = result.report;

    console.log("\n========== PLAGIARISM REPORT ==========");
    console.log(`Repo:               ${r.repoUrl}`);
    console.log(`Plagiarism Score:   ${r.plagiarismScore}%`);
    console.log(`Uniqueness Score:   ${r.uniquenessScore}%`);
    console.log(`Verdict:            ${r.verdict}`);
    console.log(`Files Analyzed:     ${r.totalFilesAnalyzed}`);
    console.log(`Total Tokens:       ${r.totalTokens}`);
    console.log(`Fingerprints:       ${r.totalFingerprintsGenerated}`);
    console.log(`Candidates Checked: ${r.candidatesChecked}`);
    console.log(`Snippets Used:      ${r.searchSnippetsUsed}`);
    console.log(`Time Taken:         ${r.timeTakenSeconds}s`);

    if (r.topMatch) {
      console.log(`\n🔴 Top Match:`);
      console.log(`  Repo:       ${r.topMatch.repository}`);
      console.log(`  Similarity: ${r.topMatch.similarity}%`);
      console.log(`  Source:     ${r.topMatch.matchType}`);
    }

    if (r.forkAndCloneMatches && r.forkAndCloneMatches.length > 0) {
      console.log(`\n🔁 Forks / Clones:`);
      r.forkAndCloneMatches.forEach(m =>
        console.log(`  ${m.repository} → ${m.similarity}% [${m.matchType}]`)
      );
    }

    if (r.directMatches && r.directMatches.length > 0) {
      console.log(`\n📋 Direct Compare Matches:`);
      r.directMatches.forEach(m =>
        console.log(`  ${m.repository} → ${m.similarity}%`)
      );
    }

    if (r.githubCodeMatches && r.githubCodeMatches.length > 0) {
      console.log(`\n🌐 GitHub Code Search Matches:`);
      r.githubCodeMatches.forEach(m =>
        console.log(`  ${m.repository} → ${m.similarity}%`)
      );
    }

    if (r.allMatches && r.allMatches.length === 0) {
      console.log("\n✅ No matches found above threshold.");
    }

    console.log("\n=======================================");
  } catch (err) {
    console.error("Error:", err.message);
    console.error(err.stack);
  }
}

run();
