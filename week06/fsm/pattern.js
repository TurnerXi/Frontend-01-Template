module.exports = function match(pattern, string) {
  return strStr(string,pattern) >= 0;
}

var strStr = function(string, pattern) {
    if(pattern === ''){
        return 0
    }
    const states = pattern.split('').map((p, idx) => generate(p, idx, pattern.length))
    let idx = 0;
    let matchIdx = -1;
    for (let i = 0; i < string.length; i++) {
        idx = states[idx](string[i]);
        if (idx === -1) {
            return matchIdx===-1?0:matchIdx;
        } else if (idx > 0 && matchIdx === -1) {
            matchIdx = i;
        } else if (idx === 0 && matchIdx > -1) {
            i = matchIdx;
            matchIdx = -1;
        }
    }
    return -1;
};

function generate(p, idx, len) {
  return function (c) {
    if (p === c) {
      return (idx + 1 === len) ? -1 : (idx + 1);
    }
    return 0;
  }
}
