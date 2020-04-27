function convertStringToNumber(str, radix) {
  radix = radix || 10;
  let sign = 1;
  if (str.indexOf('-') === 0) {
    sign = -1;
    str = str.substring(1);
  }
  let chars = str.split('');
  let number = 0;
  let i = 0;
  while (i < chars.length && chars[i] != '.') {
    number = number * radix;
    let distance = chars[i].toUpperCase().codePointAt() - '0'.codePointAt();
    if (radix > 9 && distance > 9) {
      distance -= 7;
    }
    if (distance < 0 || distance >= radix) {
      return number;
    }
    number += distance;
    i++;
  }

  if (chars[i] === '.') {
    i++;
  }

  let fraction = 1;
  while (i < chars.length) {
    fraction = fraction / radix;
    let distance = chars[i].toUpperCase().codePointAt() - '0'.codePointAt();
    if (radix > 9 && distance > 9) {
      distance -= 7;
    }
    if (distance < 0 || distance >= radix) {
      return number;
    }
    number += distance * fraction;
    i++;
  }


  return number * sign;
}