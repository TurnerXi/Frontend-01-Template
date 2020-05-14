const assert = require('assert').strict;

let start;

module.exports = function match(pattern, string) {
  const states = pattern.split('').map((p, idx) => generate(p, idx, pattern.length))
  let idx = 0;
  let matchIdx = 0;
  start = states[idx];
  for (let i = 0; i < string.length; i++) {
    const c = string[i];
    idx = states[idx](c);
    if (idx === -1) {
      return true;
    } else if (idx > 0 && matchIdx === 0) {
      matchIdx = i;
    } else if (idx === 0 && matchIdx > 0) {
      i = matchIdx;
      matchIdx = 0;
    }
  }
  return false;
}

function generate(p, idx, len) {
  return function (c) {
    if (p === c) {
      return (idx + 1 === len) ? -1 : (idx + 1);
    } else if (idx !== 0) {
      return start(c);
    }
    return 0;
  }
}