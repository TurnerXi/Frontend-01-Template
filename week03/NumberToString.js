function convertNumberToString(num, radix) {
  if (num === 0 || Number.isNaN(num) === NaN) return "0";
  if (typeof num != 'number') return '0';
  if (num === Infinity) return "Infinity";
  if (num === -Infinity) return "-Infinity";

  const sign = num / Math.abs(num);
  num = Math.abs(num);
  radix = radix || 10;
  const dic = '0123456789ABCDEF';

  let fraction = num - Math.floor(num);
  let integer = num - fraction;
  let str = "";
  while (integer > 0) {
    str = dic[integer % radix] + str;
    integer = Math.floor(integer / radix);
  }

  if (fraction > 0) {
    str += '.';
  }

  let count = 0;
  while (fraction > 0 && count < 16) {
    let temp = fraction * radix;
    fraction = temp - Math.floor(temp);
    str += dic[temp - fraction];
    count++;
  }

  return (sign === -1 ? '-' : '') + str;
}