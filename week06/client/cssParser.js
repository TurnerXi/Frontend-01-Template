const css = require('css');
module.exports = class CSSParser {
  constructor() {
    this.rules = [];
  }

  addRules(text) {
    const ast = css.parse(text);
    this.rules.push(...ast.stylesheet.rules);
  }

  computeCSS(element) {
    for (const rule of this.rules) {
      const {
        selectors,
        declarations
      } = rule;
      for (const selector of selectors) {
        if (this.isMatch(element, selector)) {
          console.log("Element", element, 'matched rule', rule);
          break;
        }
      }
    }
  }

  isMatch(element, selector) {
    const arr = selector.split(' ').reverse();
    let current = element;
    while (arr.length > 0 && current) {
      if (this._isMatch(current, arr[0])) {
        arr.shift();
      }
      current = current.parent;
    }
    return arr.length === 0;
  }

  _isMatch(element, simpleSeletor) {
    if (!element) {
      return false;
    }
    if (simpleSeletor === '*') {
      return true;
    }
    if (simpleSeletor.indexOf(">") > -1) {
      const lastIndex = simpleSeletor.lastIndexOf(">");
      return this._isMatch(element.parent, simpleSeletor.substring(0, lastIndex)) &&
        this._isMatch(element, simpleSeletor.substring(lastIndex + 1));
    } else if (simpleSeletor.indexOf('+') > -1) {
      const lastIndex = simpleSeletor.lastIndexOf("+");
      return this._isMatch(element.previousElementSibling, simpleSeletor.substring(0, lastIndex)) &&
        this._isMatch(element, simpleSeletor.substring(lastIndex + 1));
    } else {
      const reg = /([\.\[#:]?([^\.\[#:]+))+?/g;
      let result;
      let attrs = element.attributes ? element.attributes.reduce((obj, item) => {
        obj[item.name] = item.value;
        return obj;
      }, {}) : {};
      while (result = reg.exec(simpleSeletor)) {
        let matched = false;
        const match = result[1];
        const name = result[2];
        if (match[0] === '#') {
          matched = attrs.id === name;
        } else if (match[0] === '.') {
          const classList = attrs.class.split(' ');
          matched = classList.indexOf(name) >= 0
        } else if (match[0] === '[') {
          name = name.substring(0, name.length - 1);
          const [attrName, isBlur, attrValue] = name.split(/(\*?)=/);
          if (Object.keys(attrs).indexOf(attrName) > -1) {
            matched = !attrValue || attrs[attrName] === attrValue || (isBlur && attrs[attrName].indexOf(attrValue) > -1)
          } else {
            matched = false;
          }
        } else if (match[0] === ':') {
          matched = true;
        } else {
          matched = name === element.tagName;
        }
        if (!matched) {
          return false;
        }
      }
    }
    return true;
  }

}