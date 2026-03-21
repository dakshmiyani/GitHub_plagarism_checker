function hash(str) {
  let h = 0;

  for (let i = 0; i < str.length; i++) {
    h = (h << 5) - h + str.charCodeAt(i);
    h |= 0;
  }

  return Math.abs(h);
}

function generateKgrams(tokens, k = 8) {
  const grams = [];

  for (let i = 0; i <= tokens.length - k; i++) {
    grams.push(hash(tokens.slice(i, i + k).join(" ")));
  }

  return grams;
}

function winnow(hashes, window = 4) {

  const fingerprints = new Set();

  for (let i = 0; i <= hashes.length - window; i++) {
    const slice = hashes.slice(i, i + window);
    fingerprints.add(Math.min(...slice));
  }

  return [...fingerprints];
}

module.exports = { generateKgrams, winnow };