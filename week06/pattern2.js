module.exports = function match(pattern, string) {
  return strStr(string, pattern) >= 0;
}

var strStr = function (string, pattern) {
  let patternIdx = 0;
  let matchIdx = -1;

  if (pattern === '') {
    return 0
  }
  for (let i = 0; i < string.length; i++) {
    patternIdx = next(string[i]);
    if (patternIdx === pattern.length) {
      return matchIdx === -1 ? 0 : matchIdx;
    } else if (patternIdx > 0 && matchIdx === -1) {
      matchIdx = i;
    } else if (patternIdx === 0 && matchIdx > -1) {
      i = matchIdx;
      matchIdx = -1;
    }
  }

  function next(c) {
    if (pattern[patternIdx] === c) {
      return patternIdx + 1;
    }
    return 0;
  }

  return -1;
};