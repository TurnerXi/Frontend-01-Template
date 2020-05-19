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
    if (!element.computedStyle) {
      element.computedStyle = {};
    }

    for (const rule of this.rules) {
      const { selectors, declarations } = rule;

      for (const selector of selectors) {

        if (this.isMatch(element, selector)) {

          const { computedStyle } = element;
          const specificity = this.computePriority(selector);

          for (const declaration of declarations) {

            const property = computedStyle[declaration.property];
            if (!property || this.compareSpec(specificity, property.specificity) >= 0) {
              computedStyle[declaration.property] = {
                value: declaration.value,
                specificity: specificity,
              };
            }

          }
        }
      }
    }
  }

  computePriority(selector) {
    const p = [0, 0, 0, 0];
    const selectors = selector.split(/[ \n\r\t>]/);
    const reg = /([\.\[#:]?([^\.\[#:]+))+?/g;
    for (const simpleSeletor of selectors) {
      let result;
      while ((result = reg.exec(simpleSeletor))) {
        const match = result[1];
        if (match[0] === '#') {
          p[2]++;
        } else if (match[0] === '.' || match[0] === '[') {
          p[1]++;
        } else if (match[0] === ':') {
          // TODO pseudo style
        } else {
          p[0]++;
        }
      }
    }
    return p;
  }

  compareSpec(spec1, spec2) {
    for (let i = spec1.length - 1; i > 0; i--) {
      if (spec1[i] !== spec2[i]) {
        return spec1[i] - spec2[i];
      }
    }
    return 0;
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
    if (simpleSeletor.indexOf('>') > -1) {
      const lastIndex = simpleSeletor.lastIndexOf('>');
      return (
        this._isMatch(element.parent, simpleSeletor.substring(0, lastIndex)) &&
        this._isMatch(element, simpleSeletor.substring(lastIndex + 1))
      );
    } else if (simpleSeletor.indexOf('+') > -1) {
      const lastIndex = simpleSeletor.lastIndexOf('+');
      return (
        this._isMatch(element.previousElementSibling, simpleSeletor.substring(0, lastIndex)) &&
        this._isMatch(element, simpleSeletor.substring(lastIndex + 1))
      );
    } else {
      const reg = /([\.\[#:]?([^\.\[#:]+))+?/g;
      let result;
      let attrs = element.attributes ?
        element.attributes.reduce((obj, item) => {
          obj[item.name] = item.value;
          return obj;
        }, {}) : {};
      while ((result = reg.exec(simpleSeletor))) {
        let matched = false;
        const match = result[1];
        const name = result[2];
        if (match[0] === '#') {
          matched = attrs.id === name;
        } else if (match[0] === '.') {
          const classList = attrs.class.split(' ');
          matched = classList.indexOf(name) >= 0;
        } else if (match[0] === '[') {
          name = name.substring(0, name.length - 1);
          const [attrName, isBlur, attrValue] = name.split(/(\*?)=/);
          if (Object.keys(attrs).indexOf(attrName) > -1) {
            matched = !attrValue || attrs[attrName] === attrValue || (isBlur && attrs[attrName].indexOf(attrValue) > -1);
          } else {
            matched = false;
          }
        } else if (match[0] === ':') {
          // TODO pseudo style
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
};