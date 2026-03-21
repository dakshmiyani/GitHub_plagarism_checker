const axios = require("axios");
const github = require("../../utils/githubRequest");
const parseRepoUrl = require("../../utils/repoUrlParser");
const fetchRepoTree = require("../../utils/fetchRepoTree");
const normalize = require("../../utils/normalizeCode");
const tokenize = require("../../utils/tokenize");
const { generateKgrams, winnow } = require("../../utils/winnowing");
const searchGithub = require("../../utils/githubSearch");
const compareFingerprints = require("../../utils/compareFingerprints").compareFingerprints;
const { containmentScore } = require("../../utils/compareFingerprints");
const { searchByMetadata } = require("../../utils/repoMetadataSearch");
const { 
  compareAtLineLevel, 
  extractLineHashes, 
  fetchAllFileContents,
  getCandidateLineHashes,
  compareHashes
} = require("../../utils/lineHashCompare");
const getStructuralSkeleton = require("../../utils/structuralNormalize");

/**
 * Returns a text verdict based on the highest similarity score (0–100).
 */
/**
 * Returns a text verdict based on the highest similarity score (0–100)
 * and whether significant exact line matches were found.
 */
function getVerdict(score, topMatch) {
  const hasManyExactLines = topMatch && topMatch.matchedLineCount >= 15;
  const highContainment   = topMatch && topMatch.containment >= 40; // ≥40% of base was 'taken'
  const partialCopy       = topMatch && topMatch.containment >= 25; // ≥25% = partial copy

  if (score >= 70 || (score >= 40 && hasManyExactLines) || (score >= 50 && highContainment))
    return "High Plagiarism Detected 🚨";
  if (score >= 40 || (score >= 15 && hasManyExactLines) || (score >= 25 && highContainment) || (score >= 20 && partialCopy))
    return "Moderate Plagiarism Detected ⚠️";
  if (score >= 10 || partialCopy)
    return "Low Similarity Found 🔍";
  return "Likely Original ✅";
}

/**
 * Wraps a promise with a timeout. Resolves to `fallback` if timed out.
 */
function withTimeout(promise, ms, fallback = null) {
  return Promise.race([
    promise,
    new Promise(resolve => setTimeout(() => resolve(fallback), ms))
  ]);
}

/**
 * Choose k-gram size adaptively based on token count.
 * Smaller repos need smaller k so we still get meaningful fingerprints.
 */
function chooseK(tokenCount) {
  if (tokenCount < 500)  return 3;
  if (tokenCount < 1500) return 4;
  if (tokenCount < 3000) return 5;
  return 7;
}

class PlagiarismManager {

  /**
   * Generates fingerprints for a repository.
   * Returns: { fingerprints, tokens, fileWiseTokens, searchSnippets, fileCount }
   */
  static async generateFingerprints(repoUrl, isDeep = false) {
    const { owner, repo } = parseRepoUrl(repoUrl);
    // Always scan all branches (up to 20) — code may be on any branch!
    // For candidates (not deep), we analyze fewer files to stay fast.
    const allFiles = await fetchRepoTree(owner, repo, 20);
    const fileCap = isDeep ? 50 : 20; // deep = base repo, shallow = candidate
    const files = allFiles.slice(0, fileCap);
    console.log(`  [FP] ${owner}/${repo}: ${files.length} files`);

    let allTokens = [];
    let structuralTokens = [];
    const fileWiseTokens = [];
    const searchSnippets = [];
    const uniqueStrings = new Set();
    const distinctivePaths = new Set();

    const BATCH_SIZE = 15;
    for (let i = 0; i < files.length; i += BATCH_SIZE) {
      const batch = files.slice(i, i + BATCH_SIZE);
      const results = await Promise.allSettled(
        batch.map(url => axios.get(url, { 
          timeout: 10000,
          headers: { 'User-Agent': 'RepoLens-Security-Engine/1.0' }
        }))
      );

      results.forEach((res, idx) => {
        if (res.status === "fulfilled") {
          const rawCode = res.value.data;
          const normalizedCode = normalize(rawCode);
          const tokens = tokenize(normalizedCode);
          for (let t = 0; t < tokens.length; t++) allTokens.push(tokens[t]);

          // Second pass: structural skeleton
          const skeleton = getStructuralSkeleton(rawCode);
          const sTokens = tokenize(skeleton);
          for (let t = 0; t < sTokens.length; t++) structuralTokens.push(sTokens[t]);

          if (tokens.length > 10) {
            fileWiseTokens.push({ path: batch[idx], tokens });

            // Extract useful function/logic lines (not JSX or pure import lines)
            const lines = rawCode.split("\n").map(l => l.trim());
            const goodLines = lines.filter(l =>
              l.length > 30 &&
              l.length < 200 &&
              !l.startsWith("import") &&
              !l.startsWith("export") &&
              !l.startsWith("require") &&
              !l.startsWith("//") &&
              !l.startsWith("*") &&
              !l.startsWith("<") &&   // skip JSX tags
              !l.endsWith("/>") &&    // skip self-closing JSX
              !l.includes('from "') &&
              !l.includes("from '") &&
              // Must contain actual logic indicators
              (l.includes("function") ||
               l.includes("const ") ||
               l.includes("let ") ||
               l.includes("return ") ||
               l.includes("if (") ||
               l.includes("=>") ||
               l.includes("async ") ||
               l.includes(".map(") ||
               l.includes(".filter(") ||
               l.includes(".forEach(") ||
               l.includes("from ") ||
               l.includes("import "))
            );

            if (goodLines.length > 0) {
              // Priority: pick longest lines first (usually more unique)
              const sortedLines = goodLines.sort((a, b) => b.length - a.length);
              const snippetsToTake = Math.min(5, sortedLines.length);
              for (let s = 0; s < snippetsToTake; s++) {
                searchSnippets.push(
                  sortedLines[s].replace(/\s+/g, " ").substring(0, 150)
                );
              }
            }

            // Extract unique string literals (error messages, unique titles, etc.)
            const stringMatches = rawCode.match(/(["'`])((?:(?!\1).|\\\1){30,150})\1/g);
            if (stringMatches) {
              stringMatches.forEach(match => {
                const inner = match.slice(1, -1).trim();
                if (inner.length > 30 && !inner.includes("http") && !inner.includes("<")) {
                  uniqueStrings.add(inner.substring(0, 100));
                }
              });
            }

            // Extract distinctive file paths
            const pathParts = batch[idx].split("/");
            const fileName = pathParts[pathParts.length - 1];
            if (fileName.length > 15 && !fileName.includes("index") && !fileName.includes("App")) {
              distinctivePaths.add(fileName);
            }
          }
        } else {
          console.log(`  [FP] Fetch error: ${res.reason?.message}`);
        }
      });
    }

    // Standard literal fingerprints
    const k = chooseK(allTokens.length);
    const grams = generateKgrams(allTokens, k);
    const fingerprints = winnow(grams, 4);

    // Structural fingerprints
    const structuralK = chooseK(structuralTokens.length);
    const sGrams = generateKgrams(structuralTokens, structuralK);
    const structuralFingerprints = winnow(sGrams, 4);

    console.log(`  [FP] ${owner}/${repo}: ${allTokens.length} tokens → k=${k} → ${fingerprints.length} literal / ${structuralFingerprints.length} structural FPs`);

    return {
      fingerprints,
      structuralFingerprints,
      tokens: allTokens,
      fileWiseTokens,
      searchSnippets,
      fileCount: fileWiseTokens.length,
      kUsed: k,
      rawFileUrls: files,
      uniqueStrings: Array.from(uniqueStrings).slice(0, 20),
      distinctivePaths: Array.from(distinctivePaths).slice(0, 20)
    };
  }

  /**
   * Strategy A: Check if the repo is itself a GitHub fork (most reliable clone detection),
   * then also search repos by name.
   */
  static async findByRepoName(owner, repo) {
    const candidates = [];

    // A1 — Is the repo itself a FORK? If so, grab the parent directly.
    try {
      const repoInfo = await withTimeout(
        github.get(`/repos/${owner}/${repo}`),
        10000
      );
      if (repoInfo && repoInfo.data) {
        if (repoInfo.data.fork && repoInfo.data.parent) {
          const parent = repoInfo.data.parent;
          console.log(
            `  [ForkCheck] ✅ ${owner}/${repo} IS A FORK of ${parent.full_name}`
          );
          candidates.push({
            repo: parent.full_name,
            url: parent.html_url,
            source: "parent-fork",
            priority: true
          });
          // Also add grandparent if this fork has a source
          if (repoInfo.data.source && repoInfo.data.source.full_name !== parent.full_name) {
            candidates.push({
              repo: repoInfo.data.source.full_name,
              url: repoInfo.data.source.html_url,
              source: "source-fork",
              priority: true
            });
          }
        } else {
          console.log(`  [ForkCheck] ${owner}/${repo} is NOT a GitHub fork.`);
        }
      }
    } catch (err) {
      console.log(`  [ForkCheck] Error: ${err.message}`);
    }

    // A2 — Find public forks of this repo (i.e., other teams forked FROM this one)
    try {
      const forksRes = await withTimeout(
        github.get(`/repos/${owner}/${repo}/forks`, {
          params: { per_page: 30, sort: "newest" }
        }),
        10000
      );

      if (forksRes && forksRes.data && forksRes.data.length > 0) {
        console.log(
          `  [NameSearch] Found ${forksRes.data.length} fork(s) of ${owner}/${repo}`
        );
        forksRes.data.forEach(fork => {
          candidates.push({
            repo: fork.full_name,
            url: fork.html_url,
            source: "fork"
          });
        });
      } else {
        console.log(`  [NameSearch] No public forks of ${owner}/${repo}.`);
      }
    } catch (err) {
      console.log(`  [ForkList] Error: ${err.message}`);
    }

    // A3 — GitHub repo name search (catches renamed clones)
    try {
      const cleanName = repo
        .replace(/[-_](main|master|clone|copy|final|v2|v3|new|backup|fork|app|project)$/i, "")
        .replace(/^(copy[-_]of[-_]|clone[-_]of[-_])/i, "")
        .replace(/-+/g, " ")
        .trim();

      if (cleanName.length >= 3) {
        const searchRes = await withTimeout(
          github.get("/search/repositories", {
            params: { q: cleanName, per_page: 20, sort: "stars" }
          }),
          12000
        );

        if (searchRes && searchRes.data && searchRes.data.items) {
          console.log(
            `  [NameSearch] Repo name search "${cleanName}": ${searchRes.data.items.length} result(s)`
          );
          searchRes.data.items.forEach(item => {
            if (item.full_name === `${owner}/${repo}`) return; // skip self
            if (!candidates.find(c => c.repo === item.full_name)) {
              candidates.push({
                repo: item.full_name,
                url: item.html_url,
                source: "name-search",
                stars: item.stargazers_count
              });
            }
          });
        }
      }
    } catch (err) {
      console.log(`  [NameSearch] Error: ${err.message}`);
    }

    return candidates;
  }

  /**
   * Compare a single candidate against the base using BOTH
   * fingerprint similarity AND exact line matching.
   * Returns the higher of the these scores as the final similarity.
   */
  static async compareCandidate(url, baseFingerprints, baseStructuralFPs, baseLineHashes, baseHashToLine, source = "unknown", isDeep = false) {
    try {
      const { 
        fingerprints: candidateFP, 
        structuralFingerprints: candidateSFP,
        rawFileUrls: candidateUrls 
      } = await this.generateFingerprints(url, isDeep);

      // 1. Literal similarity (exact tokens)
      const literalScore = compareFingerprints(baseFingerprints, candidateFP);

      // 2. Structural similarity (abstracted skeleton)
      const structuralScore = compareFingerprints(baseStructuralFPs, candidateSFP);

      // 3. Exact line matching (copy-paste detection)
      let lineScore = 0;
      let matchedLineCount = 0;
      let baseLineCount = 0;
      let sampleMatchedLines = [];
      let isSignificant = false;

      try {
        const { hashes: candidateHashes } = await getCandidateLineHashes(candidateUrls, 40);
        const lineResult = compareHashes(baseLineHashes, baseHashToLine, candidateHashes);
        
        lineScore        = lineResult.lineMatchScore;
        matchedLineCount = lineResult.matchedLineCount;
        baseLineCount    = lineResult.baseLineCount;
        sampleMatchedLines = lineResult.sampleMatchedLines;
        isSignificant    = lineResult.isSignificant;
      } catch (lineErr) {
        console.log(`  [Line] Error for ${url}: ${lineErr.message}`);
      }

      // 4. Containment: what % of the BASE fingerprints appear in the candidate?
      const literalContainment    = containmentScore(baseFingerprints, candidateFP);
      const structuralContainment = containmentScore(baseStructuralFPs, candidateSFP);
      const containment = Math.max(literalContainment, structuralContainment);

      // 5. Combined score — take the MAX of all methods
      const similarity = parseFloat(Math.max(literalScore, structuralScore, lineScore, containment).toFixed(2));

      console.log(
        `  [Compare] ${url}: literal=${literalScore.toFixed(1)}% | struct=${structuralScore.toFixed(1)}% | contain=${containment.toFixed(1)}% | lines=${lineScore.toFixed(1)}% | final=${similarity}% [${source}]`
      );

      return {
        repository: url,
        similarity,
        literalScore,
        structuralScore,
        containment,
        lineMatchScore: lineScore,
        matchedLineCount,
        baseLineCount,
        sampleMatchedLines,
        lineMatchFlagged: isSignificant,
        matchType: source
      };
    } catch (err) {
      console.log(`  [Compare] Error on ${url}: ${err.message}`);
      return null;
    }
  }

  /**
   * Main plagiarism detection entry point.
   *
   * @param {string}   repoUrl     - The repo being checked.
   * @param {string[]} compareUrls - Optional: other hackathon submission repo URLs.
   */
  static async detectGlobalPlagiarism(repoUrl, compareUrls = []) {
    const startTime = Date.now();
    console.log(`\n━━━ [Plagiarism] Starting scan: ${repoUrl} ━━━`);

    // ── Step 1: Fingerprint the base repo ─────────────────────────────────────
    const { owner, repo } = parseRepoUrl(repoUrl);
    const {
      fingerprints: baseFingerprints,
      structuralFingerprints: baseStructuralFPs,
      tokens: baseTokens,
      searchSnippets,
      fileCount,
      kUsed,
      rawFileUrls: baseRawUrls,
      uniqueStrings,
      distinctivePaths
    } = await this.generateFingerprints(repoUrl, true);

    console.log(
      `[Plagiarism] Base: ${baseTokens.length} tokens, ${fileCount} files, k=${kUsed}, ${baseFingerprints.length} literal / ${baseStructuralFPs.length} structural fingerprints`
    );

    if (baseFingerprints.length === 0) {
      console.log("[Plagiarism] ⚠️  No fingerprints — repo may be empty or binary-only.");
      return {
        report: {
          repoUrl,
          plagiarismScore: 0,
          uniquenessScore: 100,
          verdict: "Unable to analyze — no code files found",
          totalFilesAnalyzed: fileCount,
          totalTokens: baseTokens.length,
          totalFingerprintsGenerated: 0,
          timeTakenSeconds: 0,
          allMatches: [],
          directMatches: [],
          forkAndCloneMatches: [],
          githubCodeMatches: [],
          candidatesChecked: 0,
          searchSnippetsUsed: 0,
          topMatch: null
        }
      };
    }

    // ── Step 2: Gather candidates from all strategies ─────────────────────────
    const candidateMap = new Map();

    const addCandidate = (c) => {
      const key = c.repo;
      if (!candidateMap.has(key)) {
        candidateMap.set(key, { ...c });
      }
    };

    // Strategy A: Fork parent detection + public forks + name search
    console.log(`\n[Strategy A] Fork & name search for ${owner}/${repo}...`);
    const nameResults = await this.findByRepoName(owner, repo);
    nameResults.forEach(addCandidate);
    console.log(`  -> ${nameResults.length} candidate(s) from Strategy A`);

    // Strategy B: Explicit hackathon compareUrls
    if (compareUrls.length > 0) {
      console.log(`\n[Strategy B] Adding ${compareUrls.length} direct compare URL(s)...`);
      compareUrls.forEach(url => {
        addCandidate({ repo: url, source: "direct-compare" });
      });
    }

    // Strategy C: GitHub code search (limited, snippet-based)
    // Only use top 4 snippets to avoid rate limits (GitHub: 10 code searches/min)
    const uniqueSnippets = [...new Set(searchSnippets)].slice(0, 4);
    if (uniqueSnippets.length > 0) {
      console.log(`\n[Strategy C] Code search with ${uniqueSnippets.length} snippet(s)...`);
      for (const snippet of uniqueSnippets) {
        try {
          const results = await searchGithub(snippet);
          if (results.length > 0) {
            console.log(`  -> "${snippet.substring(0, 50)}..." → ${results.length} hit(s)`);
          }
          results.forEach(r => {
            const fullUrl = `https://github.com/${r.repo}`;
            if (fullUrl === repoUrl || r.repo === `${owner}/${repo}`) return;
            addCandidate({ repo: fullUrl, source: "code-search" });
          });
          await new Promise(res => setTimeout(res, 6000)); // wait 6s per search
        } catch (err) {
          console.log(`  -> Code search error: ${err.message}`);
          await new Promise(res => setTimeout(res, 10000)); // back off on error
        }
      }
    }

    // Strategy D: README heading + package.json dependency search
    // Most reliable for detecting tutorial clones with different repo names
    console.log(`\n[Strategy D] Metadata search (README + package.json)...`);
    try {
      const metaResults = await searchByMetadata(owner, repo);
      metaResults.forEach(addCandidate);
      console.log(`  -> ${metaResults.length} candidate(s) from Strategy D`);
    } catch (err) {
      console.log(`  -> Strategy D error: ${err.message}`);
    }

    // Strategy E: Search by Unique Strings and Distinctive File Paths
    // Capped at 6 queries with generous delays to stay within rate limits
    const discoveryQueries = [
      ...uniqueStrings.map(s => ({ q: `"${s}"`, type: "unique-string" })),
      ...distinctivePaths.map(p => ({ q: `filename:${p}`, type: "distinctive-path" }))
    ].slice(0, 6);

    if (discoveryQueries.length > 0) {
      console.log(`\n[Strategy E] Deep search for renamed clones (${discoveryQueries.length} queries)...`);
      for (const item of discoveryQueries) {
        try {
          const results = await searchGithub(item.q);
          if (results.length > 0) {
            console.log(`  -> "${item.q}" → ${results.length} hit(s)`);
          }
          results.forEach(r => {
            const fullUrl = `https://github.com/${r.repo}`;
            if (fullUrl === repoUrl || r.repo === `${owner}/${repo}`) return;
            addCandidate({ repo: fullUrl, source: item.type });
          });
          await new Promise(res => setTimeout(res, 6000)); // wait 6s per search
        } catch (err) {
          console.log(`  -> Strategy E error: ${err.message}`);
          await new Promise(res => setTimeout(res, 10000)); // back off on error
        }
      }
    }

    // Strategy F: Related Owner Scraping (THE "SILVER BULLET" FOR HIDDEN BRANCHES)
    // If we found ANY candidate so far, pull ALL repositories of those owners.
    // This catches renamed repos on non-default branches which aren't indexed by search.
    const uniqueOwners = new Set();
    candidateMap.forEach(c => {
      const parts = c.repo.replace(/https?:\/\/github\.com\//, "").split("/");
      if (parts.length >= 1) uniqueOwners.add(parts[0]);
    });

    if (uniqueOwners.size > 0) {
      console.log(`\n[Strategy F] Scraping all repos from ${uniqueOwners.size} related owner(s)...`);
      for (const ownerName of Array.from(uniqueOwners).slice(0, 5)) { // Limit to 5 owners
        try {
          const res = await github.get(`/users/${ownerName}/repos`, {
            params: { sort: "updated", per_page: 30 }
          });
          if (res && res.data && Array.isArray(res.data)) {
            console.log(`  -> ${ownerName} has ${res.data.length} recent repo(s)`);
            res.data.forEach(repoItem => {
              if (repoItem.full_name !== `${owner}/${repo}`) {
                addCandidate({ 
                  repo: repoItem.html_url, 
                  source: "owner-discovery" 
                });
              }
            });
          }
        } catch (err) {
          console.log(`  -> Owner scrape error for ${ownerName}: ${err.message}`);
        }
        await new Promise(res => setTimeout(res, 1000));
      }
    }

    // ── Step 0: Pre-extract base line hashes (for speed) ──────────────────────
    console.log(`\n[Line] Pre-extracting base repository hashes...`);
    let baseHashes = new Set();
    let baseHashToLine = new Map();
    try {
      const baseData = await fetchAllFileContents(baseRawUrls, 40);
      const extracted = extractLineHashes(baseData.allCode);
      baseHashes = extracted.hashes;
      baseHashToLine = extracted.hashToLine;
    } catch (err) {
      console.log(`  [Line] Failed to pre-extract base hashes: ${err.message}`);
    }

    // ── Step 3: Score each candidate ───────────────────────────────────────────
    let allCandidates = Array.from(candidateMap.values());

    // Sort so high-priority (fork parents, direct compares) are checked first
    allCandidates.sort((a, b) => {
      const priorityMap = { "parent-fork": 0, "source-fork": 1, "direct-compare": 2, "fork": 3 };
      return (priorityMap[a.source] ?? 99) - (priorityMap[b.source] ?? 99);
    });

    // Cap the number of candidates to check to ensure job completes within ~60 seconds
    allCandidates = allCandidates.slice(0, 40);

    console.log(`\n[Plagiarism] Scoring ${allCandidates.length} candidate(s)...`);

    const yieldEventLoop = () => new Promise(res => setImmediate(res));

    const matches = [];
    const BATCH = 5; 
    for (let i = 0; i < allCandidates.length; i += BATCH) {
      const batch = allCandidates.slice(i, i + BATCH);
      console.log(`  [Plagiarism] Comparing batch ${Math.floor(i/BATCH) + 1}... (${allCandidates.length - i} left)`);
      
      const batchResults = await Promise.allSettled(
        batch.map(async candidate => {
          const url = candidate.repo.startsWith("http")
            ? candidate.repo
            : `https://github.com/${candidate.repo}`;
          const source = candidate.source || "unknown";
          
          // Only perform deep branch scan for high-priority sources
          const isDeep = ["direct-compare", "parent-fork", "source-fork"].includes(source);
          
          return withTimeout(
            this.compareCandidate(url, baseFingerprints, baseStructuralFPs, baseHashes, baseHashToLine, source, isDeep),
            120000 
          );
        })
      );

      batchResults.forEach(res => {
        if (res.status === "fulfilled" && res.value) {
          matches.push(res.value);
        }
      });

      await yieldEventLoop(); // Allow BullMQ lock renewal heartbeats
    }

    // ── Step 4: Build rich report ──────────────────────────────────────────────
    // Only include repos with similarity > 0, sorted descending
    const sortedMatches = matches
      .filter(m => m && m.similarity > 0)
      .sort((a, b) => b.similarity - a.similarity);

    const directMatches = sortedMatches.filter(m => m.matchType === "direct-compare");
    const forkAndCloneMatches = sortedMatches.filter(
      m => m.matchType === "parent-fork" || m.matchType === "source-fork" ||
           m.matchType === "fork" || m.matchType === "name-search"
    );
    const githubCodeMatches = sortedMatches.filter(m => m.matchType === "code-search");

    // Plagiarism score = highest similarity across all matches
    const plagiarismScore =
      sortedMatches.length > 0
        ? parseFloat(sortedMatches[0].similarity.toFixed(2))
        : 0;

    const uniquenessScore = parseFloat((100 - plagiarismScore).toFixed(2));
    const verdict = getVerdict(plagiarismScore, sortedMatches[0]);
    const timeTakenSeconds = parseFloat(
      ((Date.now() - startTime) / 1000).toFixed(1)
    );

    console.log(`\n━━━ [Plagiarism] Done in ${timeTakenSeconds}s ━━━`);
    console.log(`Score: ${plagiarismScore}% | Uniqueness: ${uniquenessScore}%`);
    console.log(`Verdict: ${verdict}`);
    console.log(`Candidates checked: ${allCandidates.length} | Matches found: ${sortedMatches.length}`);
    if (sortedMatches.length > 0) {
      console.log(`Top match: ${sortedMatches[0].repository} @ ${sortedMatches[0].similarity.toFixed(2)}%`);
    }

    return {
      report: {
        repoUrl,
        plagiarismScore,
        uniquenessScore,
        verdict,
        totalFilesAnalyzed: fileCount,
        totalTokens: baseTokens.length,
        totalFingerprintsGenerated: baseFingerprints.length,
        kGramSizeUsed: kUsed,
        timeTakenSeconds,
        allMatches: sortedMatches,        // only non-zero, sorted
        directMatches,
        forkAndCloneMatches,
        githubCodeMatches,
        candidatesChecked: allCandidates.length,
        searchSnippetsUsed: uniqueSnippets.length,
        topMatch: sortedMatches.length > 0 ? sortedMatches[0] : null
      }
    };
  }
}

module.exports = PlagiarismManager;