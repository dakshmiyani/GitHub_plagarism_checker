const axios = require("axios");
const github = require("./githubRequest");

/**
 * Fetches metadata (README + package.json) from multiple branches if needed.
 * Returns { readme, packageJson, branchFound }
 */
async function fetchRepoMetadata(owner, repo) {
  let branches = [];
  try {
    const branchRes = await github.get(`/repos/${owner}/${repo}/branches`, {
      params: { per_page: 10 }
    });
    branches = branchRes.data.map(b => b.name);
  } catch (_) {}

  let defaultBranch = "main";
  try {
    const repoInfo = await github.get(`/repos/${owner}/${repo}`);
    defaultBranch = repoInfo.data.default_branch || "main";
  } catch (_) {}

  // Prioritize default branch, then others
  const branchesToTry = [...new Set([defaultBranch, ...branches])].slice(0, 10);
  
  for (const branch of branchesToTry) {
    let readme = "";
    let packageJson = null;

    // Fetch README
    for (const name of ["README.md", "readme.md", "Readme.md", "README.MD"]) {
      try {
        const res = await axios.get(
          `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${name}`,
          { timeout: 5000 }
        );
        if (res.data && typeof res.data === "string" && res.data.length > 30) {
          readme = res.data;
          break;
        }
      } catch (_) {}
    }

    // Fetch package.json
    try {
      const res = await axios.get(
        `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/package.json`,
        { timeout: 5000 }
      );
      if (res.data && typeof res.data === "object") {
        packageJson = res.data;
      }
    } catch (_) {}

    // If we found either, return it
    if (readme || packageJson) {
      return { readme, packageJson, branchFound: branch };
    }
  }

  return { readme: "", packageJson: null, branchFound: null };
}

/**
 * Strategy D: Search GitHub using README headings + package.json dependency fingerprint.
 * This is now more aggressive and branch-aware.
 */
async function searchByMetadata(owner, repo) {
  const candidates = [];
  const seen = new Set([`${owner}/${repo}`]);

  const { readme, packageJson } = await fetchRepoMetadata(owner, repo);

  // ── D1: README heading search ──────────────────────────────────────────────
  if (readme && readme.length > 20) {
    const headingMatch = readme.match(/^#{1,2}\s+(.+)$/m);
    if (headingMatch) {
      const heading = headingMatch[1]
        .replace(/[^a-zA-Z0-9 ]/g, "")
        .trim()
        .substring(0, 60);

      if (heading.length >= 5) {
        console.log(`  [Meta] Searching by README heading: "${heading}"`);
        try {
          const res = await github.get("/search/repositories", {
            params: { q: `"${heading}" in:readme`, per_page: 20, sort: "stars" }
          });
          if (res && res.data && res.data.items) {
            res.data.items.forEach(item => {
              if (!seen.has(item.full_name)) {
                seen.add(item.full_name);
                candidates.push({
                  repo: item.full_name,
                  url: item.html_url,
                  source: "readme-search"
                });
              }
            });
          }
        } catch (err) {
          console.log(`  [Meta] README search error: ${err.message}`);
        }
        await new Promise(r => setTimeout(r, 1000));
      }
    }
  }

  // ── D2: package.json dependency fingerprint search ─────────────────────────
  if (packageJson && packageJson.dependencies) {
    const commonDeps = new Set([
      "react", "react-dom", "react-scripts", "express", "axios",
      "lodash", "typescript", "next", "vite", "vue", "svelte",
      "dotenv", "cors", "body-parser", "mongoose", "sequelize"
    ]);

    const distinctiveDeps = Object.keys(packageJson.dependencies)
      .filter(dep => !commonDeps.has(dep))
      .slice(0, 5);

    if (distinctiveDeps.length >= 1) {
      const depQuery = distinctiveDeps.map(d => `"${d}"`).join(" ");
      console.log(`  [Meta] Searching by dependencies: ${distinctiveDeps.join(", ")}`);
      try {
        const res = await github.get("/search/code", {
          params: { q: `${depQuery} filename:package.json`, per_page: 20 }
        });
        if (res && res.data && res.data.items) {
          res.data.items.forEach(item => {
            const fullName = item.repository.full_name;
            if (!seen.has(fullName)) {
              seen.add(fullName);
              candidates.push({
                repo: fullName,
                url: `https://github.com/${fullName}`,
                source: "dependency-search"
              });
            }
          });
        }
      } catch (err) {
        console.log(`  [Meta] Dependency search error: ${err.message}`);
      }
    }
  }

  return candidates;
}

module.exports = { searchByMetadata, fetchRepoMetadata };
