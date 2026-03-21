const axios = require("axios");

/**
 * Normalizes a single line of code for comparison.
 * - Strips comments, trims whitespace, lowercases
 * - Returns null if the line is too trivial to be meaningful
 */
function normalizeLine(line) {
  let l = line
    .replace(/\/\/.*$/, "")       // strip inline comments
    .replace(/\/\*.*?\*\//g, "")  // strip inline block comments
    .replace(/\s+/g, " ")         // collapse whitespace
    .trim()
    .toLowerCase();

  // Filter out trivial lines that appear everywhere (noise)
  if (l.length < 15) return null;

  const trivialPatterns = [
    /^import .+/,                          // import statements
    /^export (default )?(\{|\*)/,          // export statements
    /^(module\.exports|exports\.) ?=/,     // CommonJS exports
    /^(const|let|var) .+ = require\(/,    // require()
    /^\{$/, /^\}$/, /^\};$/, /^\};?$/,    // lone braces
    /^return (true|false|null|undefined);?$/,
    /^console\.(log|error|warn)\(/,        // console logs
    /^\/\//,                               // comment-only lines
    /^\/\*/,
    /^\*\/?/,
  ];

  if (trivialPatterns.some(p => p.test(l))) return null;
  return l;
}

/**
 * Extract a set of normalized, non-trivial line hashes from raw code.
 * Also stores reversed map: hash → original line (for report evidence).
 *
 * @param {string} rawCode
 * @returns {{ hashes: Set<string>, hashToLine: Map<string, string> }}
 */
function extractLineHashes(rawCode) {
  const hashes = new Set();
  const hashToLine = new Map();

  rawCode.split("\n").forEach(line => {
    const normalized = normalizeLine(line);
    if (!normalized) return;
    hashes.add(normalized);
    hashToLine.set(normalized, line.trim());
  });

  return { hashes, hashToLine };
}

/**
 * Fetch all file contents from a list of raw GitHub URLs.
 * Returns concatenated raw text of all files.
 *
 * @param {string[]} rawUrls
 * @param {number}   cap  - Max files to fetch (for speed)
 * @returns {Promise<{ allCode: string, perFile: Array<{url, code}> }>}
 */
async function fetchAllFileContents(rawUrls, cap = 40) {
  const urls = rawUrls.slice(0, cap);
  const perFile = [];

  const BATCH = 5;
  for (let i = 0; i < urls.length; i += BATCH) {
    const batch = urls.slice(i, i + BATCH);
    const results = await Promise.allSettled(
      batch.map(url => axios.get(url, { timeout: 10000 }))
    );
    results.forEach((res, idx) => {
      if (res.status === "fulfilled" && typeof res.value.data === "string") {
        perFile.push({ url: batch[idx], code: res.value.data });
      }
    });
  }

  return {
    allCode: perFile.map(f => f.code).join("\n"),
    perFile
  };
}

/**
 * Helper to fetch content and extract hashes for a candidate repo.
 */
async function getCandidateLineHashes(candidateUrls, cap = 40) {
  const data = await fetchAllFileContents(candidateUrls, cap);
  return extractLineHashes(data.allCode);
}

/**
 * Compare a candidate's hashes against pre-extracted base hashes.
 */
function compareHashes(baseHashes, baseHashToLine, candidateHashes, minMatches = 5) {
  let matchedLineCount = 0;
  const sampleMatchedLines = [];

  for (const hash of baseHashes) {
    if (candidateHashes.has(hash)) {
      matchedLineCount++;
      if (sampleMatchedLines.length < 5) {
        sampleMatchedLines.push(baseHashToLine.get(hash) || hash);
      }
    }
  }

  const baseLineCount = baseHashes.size;
  const lineMatchScore =
    baseLineCount > 0
      ? parseFloat(((matchedLineCount / baseLineCount) * 100).toFixed(2))
      : 0;

  return {
    lineMatchScore,
    matchedLineCount,
    baseLineCount,
    sampleMatchedLines,
    isSignificant: matchedLineCount >= minMatches || lineMatchScore >= 10
  };
}

/**
 * Legacy wrapper for backward compatibility.
 */
async function compareAtLineLevel(baseUrls, candidateUrls, minMatches = 5) {
  const baseData = await fetchAllFileContents(baseUrls, 40);
  const { hashes: baseHashes, hashToLine: baseHashToLine } = extractLineHashes(baseData.allCode);
  const { hashes: candidateHashes } = await getCandidateLineHashes(candidateUrls, 40);

  return compareHashes(baseHashes, baseHashToLine, candidateHashes, minMatches);
}

module.exports = { 
  compareAtLineLevel, 
  extractLineHashes, 
  fetchAllFileContents,
  getCandidateLineHashes,
  compareHashes
};
