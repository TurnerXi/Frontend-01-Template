const assert = require('assert').strict;
const match = require('./pattern2.js');
const letters = 'abcdefghijklmnopqrstuvwxyz1234567890！@#￥%……&*（）';
const patterns = [];
const strings = [];
for (let i = 1; i < 100; i++) {
  let letter = '';
  for (let j = 0; j < 100; j++) {
    letter += getRandomLetter();
    if (letter.length >= i) {
      patterns.push(letter);
      letter = '';
    }
  }
}

for (let i = 0; i < 1000; i++) {
  strings.push(getRandomString(100));
}

function getRandomString(length) {
  let str = '';
  for (let i = 0; i < length; i++) {
    str += getRandomLetter();
  }
  return str;
}

function getRandomLetter() {
  return letters[Math.floor(Math.random() * 26)]
}

try {
  for (let i = 0; i < strings.length; i++) {
    for (let j = 0; j < patterns.length; j++) {
      const pattern = patterns[j];
      const string = strings[i];
      assert.equal(match(pattern, string), new RegExp(pattern).test(string), `'${pattern}', '${string}'`);
    }
  }
  console.log('all case passed');
} catch (e) {
  console.error(e.message);
}