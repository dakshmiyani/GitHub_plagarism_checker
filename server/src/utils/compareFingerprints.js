/**
 * Compare two fingerprint arrays using Jaccard similarity.
 * Returns a float in the range 0–100 (percentage).
 */
function compareFingerprints(a, b) {
  if (!a || !b || a.length === 0 || b.length === 0) return 0;

  const setA = new Set(a);
  const setB = new Set(b);

  let matches = 0;
  for (const val of setA) {
    if (setB.has(val)) matches++;
  }

  const similarity = (matches / Math.max(setA.size, setB.size)) * 100;
  return parseFloat(similarity.toFixed(2));
}

/**
 * Containment score: what fraction of BASE fingerprints appear in the CANDIDATE?
 *
 * Unlike Jaccard, this is NOT symmetric:
 * - If someone copies 50% of the base code, containment = ~50% but Jaccard = ~33%
 * - If someone adds a lot of new code on top of copied code,
 *   containment stays high while Jaccard drops.
 *
 * Use this to detect partial copies ("half the code was taken").
 *
 * @param {number[]} base      - fingerprints of the ORIGINAL repo being checked
 * @param {number[]} candidate - fingerprints of the SUSPECT repo
 * @returns {number} 0–100
 */
function containmentScore(base, candidate) {
  if (!base || !candidate || base.length === 0 || candidate.length === 0) return 0;

  const setBase = new Set(base);
  const setCandidate = new Set(candidate);

  let matches = 0;
  for (const val of setBase) {
    if (setCandidate.has(val)) matches++;
  }

  // What % of the base's fingerprints exist in the candidate?
  const score = (matches / setBase.size) * 100;
  return parseFloat(score.toFixed(2));
}

module.exports = { compareFingerprints, containmentScore };