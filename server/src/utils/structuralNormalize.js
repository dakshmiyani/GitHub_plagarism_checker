/**
 * Converts code into its "structural skeleton" to catch renamed variables/functions.
 * 
 * Logic:
 * 1. Remove comments and whitespace (standard normalization)
 * 2. Replace all string literals with "STR"
 * 3. Replace all numbers with "NUM"
 * 4. Replace specific keyword patterns but keep control flow keywords (if, while, for, return)
 * 5. This allows matching the logic structure even if variable names are changed.
 */
function getStructuralSkeleton(code) {
  return code
    .replace(/\/\/.*$/gm, "")                // Remove line comments
    .replace(/\/\*[\s\S]*?\*\//g, "")        // Remove block comments
    .replace(/(["'`])(?:(?!\1).|\\\1)*\1/g, "STR") // Replace all strings
    .replace(/\b\d+(\.\d+)?\b/g, "NUM")      // Replace all numbers
    // Replace variable/function names but KEEP keywords
    .replace(/\b(let|const|var|function|async|await|return|if|else|for|while|switch|case|break|continue|try|catch|finally|throw|class|extends|new|this|import|export|from|default)\b/g, '$1')
    .replace(/\b[a-zA-Z_][a-zA-Z0-9_]*\b/g, (match) => {
      // If it's one of the keywords we just kept, don't replace it
      const keywords = new Set(['let','const','var','function','async','await','return','if','else','for','while','switch','case','break','continue','try','catch','finally','throw','class','extends','new','this','import','export','from','default']);
      return keywords.has(match) ? match : "ID";
    })
    .replace(/\s+/g, " ")                    // Collapse whitespace
    .trim();
}

module.exports = getStructuralSkeleton;
