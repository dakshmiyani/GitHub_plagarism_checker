function tokenize(code) {
  // 1. First split by non-alphanumeric (already handled in normalize slightly, but good to be explicit)
  // 2. Then split by CamelCase (e.g. getMovies -> get Movies)
  const expandedCode = code.replace(/([a-z0-9])([A-Z])/g, '$1 $2');
  return expandedCode.match(/[a-zA-Z0-9_]+/g) || [];
}

module.exports = tokenize;