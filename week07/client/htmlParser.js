const CSSParser = require('./cssParser');
const layout = require('./layout');
const EOF = Symbol('EOF');

module.exports = class HtmlParser {
  constructor() {
    this.cssParser = new CSSParser();
    this.returnState = null;
    this.currentToken = null;
    this.currentAttribute = {
      name: '',
      value: ''
    };
    this.currentTextNode = null;
    this.stack = [{
      name: 'document',
      children: []
    }];
  }

  parse(html) {
    this.state = this.parseData;
    for (const c of html) {
      this.state = this.state.call(this, c);
    }
    this.state = this.state.call(this, EOF);
    return this.stack[0];
  }

  parseData(c) {
    // if (c === '&') {
    //   this.returnState = this.parseData;
    //   return this.parseCharaterReference;
    // }
    if (c === EOF) {
      this.emit({
        type: 'EOF'
      });
    } else if (c === '<') {
      return this.parseTagOpen;
    } else {
      this.emit({
        type: 'TEXT',
        content: c
      });
    }
    return this.parseData;
  }

  parseTagOpen(c) {
    if (c === EOF) {
      console.error('eof-before-tag-name parse error. ');
      this.emit({
        type: 'EOF'
      });
      return this.parseTagOpen;
    } else if (c === '/') {
      return this.parseEndTagOpen;
    } else {
      this.currentToken = {
        type: 'START_TAG',
        tagName: ''
      }
      return this.parseTagName(c.toLowerCase());
    }
  }

  parseTagName(c) {
    if (c === EOF) {
      console.error('eof-in-tag parse error. ');
      this.emit({
        type: 'EOF'
      });
      return this.parseTagName;
    } else if ('\t\r\n '.indexOf(c) > -1) {
      return this.parseBeforeAttributeName;
    } else if (c === '/') {
      return this.parseSelfClosingStartTag;
    } else if (c === '>') {
      this.emit(this.currentToken);
      return this.parseData;
    } else {
      this.currentToken.tagName += c;
      return this.parseTagName;
    }
  }

  parseBeforeAttributeName(c) {
    if (c === EOF || '/>'.indexOf(c) > -1) {
      return this.parseAfterAttributeName(c);
    } else if ('\t\r\n '.indexOf(c) > -1) {
      return this.parseBeforeAttributeName;
    } else if (c === '=') {
      console.error('unexpected-equals-sign-before-attribute-name parse error.')
      this.currentAttribute = {
        name: c,
        value: ''
      }
      return this.parseAttributeName;
    } else {
      this.currentAttribute = {
        name: '',
        value: ''
      }
      return this.parseAttributeName(c);
    }
  }

  parseAttributeName(c) {
    if (c === EOF || '\t\r\n >/'.indexOf(c) > -1) {
      return this.parseAfterAttributeName(c);
    } else if (c === '=') {
      return this.parseBeforeAttributeValue;
    } else if ("\"'<".indexOf(c) > -1) {
      console.error(' unexpected-character-in-attribute-name parse error.');
    }
    this.currentAttribute.name += c;
    return this.parseAttributeName;
  }

  parseAfterAttributeName(c) {
    if (c === EOF) {
      console.error(' eof-in-tag parse error.');
      this.emit({
        type: 'EOF'
      });
      return this.parseAfterAttributeName;
    } else if ('\t\n\r '.indexOf(c) > -1) {
      return this.parseAfterAttributeName;
    } else if (c === '/') {
      return this.parseSelfClosingStartTag;
    } else if (c === '=') {
      return this.parseBeforeAttributeValue;
    } else if (c === '>') {
      this.emit(this.currentToken);
      return this.parseData;
    } else {
      this.currentAttribute = {
        name: '',
        value: ''
      }
      return this.parseAttributeName(c);
    }
  }

  parseBeforeAttributeValue(c) {
    if ('\t\n\r '.indexOf(c) > -1) {
      return this.parseBeforeAttributeValue;
    } else if (c === '"') {
      return this.parseAttributeValueDoubleQuoted;
    } else if (c === '\'') {
      return this.parseAttributeValueSingleQuoted;
    } else if (c === '>') {
      console.error('missing-attribute-value parse error.')
      this.emit(this.currentToken);
      return this.parseData;
    } else {
      return this.parseAttributeValueUnquoted(c);
    }
  }

  parseAttributeValueUnquoted(c) {
    if (c === EOF) {
      console.error('eof-in-tag parse error.');
      this.emit({
        type: 'EOF'
      });
      return this.parseAttributeValueUnquoted;
    } else if ('\t\n\r '.indexOf(c) > -1) {
      this.currentToken[this.currentAttribute.name] = this.currentAttribute.value;
      this.currentAttribute = {
        name: '',
        value: ''
      };
      return this.parseBeforeAttributeName;
    } else if (c === '>') {
      this.currentToken[this.currentAttribute.name] = this.currentAttribute.value;
      this.currentAttribute = {
        name: '',
        value: ''
      };
      this.emit(this.currentToken);
      return this.parseData;
    } else if ('"\'<=`'.indexOf(c) > -1) {
      console.error('unexpected-character-in-unquoted-attribute-value parse error. ');
    }
    this.currentAttribute.value += c;
    return this.parseAttributeValueUnquoted;
  }

  parseAttributeValueSingleQuoted(c) {
    if (c === EOF) {
      console.error('eof-in-tag parse error. ');
      this.emit({
        type: 'EOF'
      });
    } else if (c === '\'') {
      this.currentToken[this.currentAttribute.name] = this.currentAttribute.value;
      this.currentAttribute = {
        name: '',
        value: ''
      };
      return this.parseAfterAttributeValueQuoted;
    } else {
      this.currentAttribute.value += c;
    }
    return this.parseAttributeValueSingleQuoted;
  }

  parseAttributeValueDoubleQuoted(c) {
    if (c === EOF) {
      console.error('eof-in-tag parse error. ');
      this.emit({
        type: 'EOF'
      });
    } else if (c === '"') {
      this.currentToken[this.currentAttribute.name] = this.currentAttribute.value;
      this.currentAttribute = {
        name: '',
        value: ''
      };
      return this.parseAfterAttributeValueQuoted;
    } else {
      this.currentAttribute.value += c;
    }
    return this.parseAttributeValueDoubleQuoted;
  }

  parseAfterAttributeValueQuoted(c) {
    if (c === EOF) {
      console.error('eof-in-tag parse error.');
      this.emit({
        type: 'EOF'
      });
      return this.parseAfterAttributeValueQuoted;
    } else if ('\t\n\r '.indexOf(c) > -1) {
      return this.parseBeforeAttributeName;
    } else if (c === '/') {
      return this.parseSelfClosingStartTag;
    } else if (c === '>') {
      this.emit(this.currentToken);
      return this.parseData;
    } else {
      console.error(' missing-whitespace-between-attributes parse error. ');
      return this.parseBeforeAttributeName(c);
    }
  }

  parseSelfClosingStartTag(c) {
    if (c === '>') {
      this.currentToken.isSelfClosing = true;
      this.emit(this.currentToken);
      return this.parseData;
    } else if (c === EOF) {
      console.error('eof-in-tag parse error.');
      this.emit({
        type: 'EOF'
      });
      return this.parseSelfClosingStartTag;
    } else {
      console.error('unexpected-solidus-in-tag parse error. ');
      return this.parseBeforeAttributeName(c);
    }
  }

  parseEndTagOpen(c) {
    if (c === EOF) {
      console.error(' eof-before-tag-name parse error.');
      return this.parseEndTagOpen;
    } else if (c === '>') {
      console.error('missing-end-tag-name parse error. ');
      return this.parseData;
    } else {
      this.currentToken = {
        type: 'END_TAG',
        tagName: ''
      }
      return this.parseTagName(c);
    }
  }

  // parseCharaterReference(c) {
  //   return this.returnState;
  // }

  emit(token) {
    let top = this.stack[this.stack.length - 1];
    if (token.type === 'EOF') {
      return;
    } else if (token.type === 'TEXT') {
      if (this.currentTextNode === null) {
        this.currentTextNode = {
          type: 'text',
          content: ''
        }
        top.children.push(this.currentTextNode);
      }
      this.currentTextNode.content += token.content;
    } else if (token.type === 'START_TAG') {
      let element = {
        type: 'element',
        children: [],
        attributes: [],
        tagName: token.tagName
      }

      const siblings = top.children;
      let idx = siblings.length - 1;
      element.previousSibling = siblings[idx];
      while (siblings[idx] && siblings[idx].type === 'text') {
        idx--;
      }
      element.previousElementSibling = siblings[idx];

      if (element.previousSibling) {
        element.previousSibling.nextSibling = element;
      }
      if (element.previousElementSibling) {
        element.previousElementSibling.nextElementSibling = element;
      }
      element.parent = top;

      for (const p in token) {
        if (p !== 'type' && p !== 'tagName') {
          element.attributes.push({
            name: p,
            value: token[p]
          });
        }
      }
      this.cssParser.computeCSS(element);

      top.children.push(element);

      if (!token.isSelfClosing) {
        this.stack.push(element);
      }

      this.currentTextNode = null;
    } else if (token.type === 'END_TAG') {
      if (top.tagName === token.tagName) {
        if (top.tagName === 'style') {
          this.cssParser.addRules(top.children[0].content);
        }
        layout(top);
        this.stack.pop();
      } else {
        throw new Error(`the end tag doesn\`t match the ${top.tagName}!`);
      }

      this.currentTextNode = null;
    }
  }
}