const micromatch = require("micromatch")

function isMatch(patterns, currentPath) {
  const isMatched = micromatch.isMatch(currentPath, patterns)
  return isMatched
}
exports.isMatch = isMatch
