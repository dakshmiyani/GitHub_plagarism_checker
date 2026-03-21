const github = require("./githubRequest");

/**
 * Fetch all unique code files across ALL branches of a repo.
 * Returns files interleaved (round-robin) across branches so that
 * every branch gets proportional coverage in fingerprint analysis.
 *
 * This prevents bypass attempts where code is only pushed to a non-default branch.
 */
async function fetchRepoTree(owner, repo, maxBranches = 20) {
  // ── Step 1: Get all branches ───────────────────────────────────────────────
  let branches = [];
  try {
    const branchRes = await github.get(`/repos/${owner}/${repo}/branches`, {
      params: { per_page: 50 }
    });
    branches = branchRes.data.map(b => b.name);
  } catch (err) {
    console.log(`  [Tree] Could not list branches for ${owner}/${repo}: ${err.message}`);
  }

  let defaultBranch = "main";
  try {
    const repoInfo = await github.get(`/repos/${owner}/${repo}`);
    defaultBranch = repoInfo.data.default_branch || "main";
  } catch (err) {
    console.log(`  [Tree] Could not get repo info: ${err.message}`);
  }

  // Put default branch first, then others
  const branchSet = new Set([defaultBranch, ...branches]);
  const branchesToScan = [...branchSet].slice(0, maxBranches);

  console.log(
    `  [Tree] Scanning ${branchesToScan.length} branch(es) for ${owner}/${repo}: [${branchesToScan.join(", ")}]`
  );

  // ── Step 2: Fetch tree for each branch in parallel ─────────────────────────
  const treeResults = await Promise.allSettled(
    branchesToScan.map(branch =>
      github.get(`/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`)
    )
  );

  // ── Step 3: Collect files per branch (with deduplication across branches) ──
  const seenPaths = new Set();
  const filesByBranch = []; // Array of arrays, one per branch

  treeResults.forEach((res, idx) => {
    const branch = branchesToScan[idx];
    if (res.status === "rejected") {
      console.log(`  [Tree] Branch "${branch}" skipped: ${res.reason?.message}`);
      return;
    }

    const data = res.value?.data;
    if (!data || !data.tree) return;

    const branchFiles = data.tree.filter(file => {
      if (file.type !== "blob") return false;
      const path = file.path.toLowerCase();

      if (!/\.(js|jsx|ts|tsx|py|java|cpp|c|cs|go|rb|php|swift|kt|rs)$/i.test(path)) return false;

      const boilerplate = [
        "eslint.config", ".eslintrc", "vite.config",
        "webpack.config", "babel.config", "jest.config",
        "tsconfig.json", "jsconfig.json",
        "package-lock.json", "yarn.lock", "pnpm-lock.yaml",
        ".gitignore", "license"
      ];
      if (boilerplate.some(b => path.includes(b))) return false;

      if (
        path.includes("/node_modules/") ||
        path.includes("/.git/") ||
        path.includes("/dist/") ||
        path.includes("/build/") ||
        path.includes("/__pycache__/")
      ) return false;

      return true;
    });

    // For this branch, only include files not yet seen in earlier branches
    const branchUniqueFiles = [];
    branchFiles.forEach(file => {
      if (!seenPaths.has(file.path)) {
        seenPaths.add(file.path);
        const encodedPath = file.path.split("/").map(part => encodeURIComponent(part)).join("/");
        branchUniqueFiles.push({
          path: file.path,
          branch,
          rawUrl: `https://raw.githubusercontent.com/${owner}/${repo}/${encodeURIComponent(branch)}/${encodedPath}`
        });
      }
    });

    if (branchUniqueFiles.length > 0) {
      console.log(`  [Tree] Branch "${branch}": ${branchFiles.length} code file(s) found`);
      filesByBranch.push(branchUniqueFiles);
    }
  });

  // ── Step 4: Interleave files round-robin across branches ────────────────────
  // This ensures every branch is proportionally represented in the top-N files
  const interleaved = [];
  const pointers = new Array(filesByBranch.length).fill(0);
  let added = true;

  while (added) {
    added = false;
    for (let b = 0; b < filesByBranch.length; b++) {
      if (pointers[b] < filesByBranch[b].length) {
        interleaved.push(filesByBranch[b][pointers[b]]);
        pointers[b]++;
        added = true;
      }
    }
  }

  console.log(
    `  [Tree] Total unique code files across all branches: ${interleaved.length}` +
    (interleaved.length > 0
      ? ` | First few: ${interleaved.slice(0, 3).map(f => f.path).join(", ")}`
      : "")
  );

  return interleaved.map(f => f.rawUrl);
}

module.exports = fetchRepoTree;
