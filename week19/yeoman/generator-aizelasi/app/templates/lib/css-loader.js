const css = require('css');
module.exports = function (source, map) {
  let stylesheet = css.parse(source);
  // for (let rule of stylesheet.stylesheet.rules) {
  // console.log(rule);
  // }
  return `
    let style = document.createElement('style');
    style.innerHTML = ${JSON.stringify(css.stringify(stylesheet))};
    document.documentElement.appendChild(style);
  `;
}