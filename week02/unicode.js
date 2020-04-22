// 写一个 UTF-8 Encoding 的函数

function utf8_encoding(c) {
  var bstr = c.codePointAt(0).toString(2);
  // 007F 0xxxxxxx
  // 07FF 110XXXXX 10XXXXXX
  // FFFF 1110XXXX 10XXXXXX 10XXXXXX
  // 10FFFF 11110XXX 10XXXXXX 10XXXXXX
  var bit = 1;
  var c = 1;

  // 计算所需位数及控制位总数
  while (bstr.length > bit * 8 - c) {
    bit++;
    if (bit === 2) {
      c += 4;
    } else {
      c += 3;
    }
  }

  if (bit === 1) {
    return parseInt(leftPadding(bstr, 8, '0'), 2).toString(16);
  } else {
    bstr = leftPadding(bstr, 8 * bit - c, '0'); // 补位

    var first = Array(bit).fill('1').join('') + '0' + bstr.substring(0, 7 - bit); //高8位

    var last = Array(bit - 1)
      .fill('10')
      .map((item, idx) => {
        return item + bstr.substring(idx * 6 + 7 - bit, 6 * (idx + 1) + 7 - bit);
      })
      .join('');

    return parseInt(first + last, 2).toString(16);
  }

  function leftPadding(str, len, token) {
    return (
      Array(len - str.length)
        .fill(token)
        .join('') + str
    );
  }
}
