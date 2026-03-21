const github = require("./githubRequest");

/**
 * Search GitHub Code Search for a snippet.
 * Fast and rate-limit-safe: only 1 page, 10 results, 10s timeout.
 * Returns empty array immediately on 429 to allow caller-side backoff.
 */
async function searchGithub(snippet) {
  // Sanitize: keep only alphanumeric, underscores, spaces
  const sanitized = snippet
    .replace(/[^a-zA-Z0-9_\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  // If the sanitized query is too short, skip it — it will be too generic
  if (sanitized.length < 20) return [];

  // Take the first 80 chars to keep the query focused
  const query = sanitized.substring(0, 80);

  try {
    const res = await Promise.race([
      github.get("/search/code", {
        params: { q: query, per_page: 10, page: 1 }
      }),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("GitHub search timeout")), 12000)
      )
    ]);

    if (!res || !res.data || !res.data.items) return [];

    // Deduplicate by repo name
    const uniqueRepos = new Map();
    res.data.items.forEach(item => {
      const key = item.repository.full_name;
      if (!uniqueRepos.has(key)) {
        uniqueRepos.set(key, {
          repo: key,
          url: item.html_url
        });
      }
    });

    return Array.from(uniqueRepos.values());
  } catch (err) {
    // Fail-fast on rate limit instead of slow retry
    if (err.response && err.response.status === 429) {
      console.log(`[githubSearch] Rate limited — skipping (caller will back off).`);
      return [];
    }
    console.log(`[githubSearch] Error: ${err.message}`);
    return [];
  }
}

module.exports = searchGithub;