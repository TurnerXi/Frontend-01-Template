function* wildcard(source, pattern) {
  let starCount = 0;
  for (let i = 0; i < pattern.length; i++) {
    if (pattern[i] === '*') {
      starCount++;
    }
  }

  if (starCount === 0) {
    for (let i = 0; i < source.length; i++) {
      yield [i, i];
      if (source[i] !== pattern[i] && pattern[i] !== '?') {
        return false;
      }
    }
    return true;
  }

  let i = 0; // pattern指针
  let lastIndex = 0;// source指针
  // 处理头部
  while (pattern[i] !== '*') {
    yield [i, i];
    if (source[i] !== pattern[i] && pattern[i] !== '?') {
      return false;
    }
    i++;
  }

  lastIndex = i;

  // 处理前n-1颗星
  for (let j = 0; j < starCount - 1; j++) {
    yield [lastIndex, i];
    i++;
    let subPattern = "";
    while (pattern[i] !== '*') {
      subPattern += pattern[i];
      yield [lastIndex, i];
      i++;
    }
    let reg = new RegExp(subPattern.replace(/\?/g, "[\\s\\S]"), 'g');

    reg.lastIndex = lastIndex;
    if (!reg.exec(source)) {
      return false;
    }
    while (lastIndex < reg.lastIndex) {
      lastIndex++;
      yield [lastIndex, i];
    }
  }

  // 处理最后一颗星
  for (let k = 0; k <= source.length - lastIndex && pattern[pattern.length - k - 1] !== '*'; k++) {
    yield [source.length - k - 1, pattern.length - k - 1];
    if (pattern[pattern.length - k - 1] !== source[source.length - k - 1] && pattern[pattern.length - k - 1] !== '?') {
      return false;
    }
  }

  return true;
}

const w = wildcard('abcbhcdedccdee', 'a*b?c*de*ee');
let n = w.next();
while (!n.done) {
  console.log(n.value);
  n = w.next();
}

console.log(n.value);