function similarity(a, b) {

  const setA = new Set(a);
  const setB = new Set(b);

  let matches = 0;

  for (const v of setA) {
    if (setB.has(v)) matches++;
  }

  return Math.floor(
    (matches / Math.max(setA.size, setB.size)) * 100
  );
}

module.exports = similarity;