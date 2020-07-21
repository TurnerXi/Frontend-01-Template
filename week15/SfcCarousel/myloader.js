const HtmlParser = require('./htmlParser');
const parser = new HtmlParser();

module.exports = function (source) {
  let tree = parser.parse(source);

  let template = null;
  let script = null;

  for (let node of tree.children) {
    if (node.tagName === 'template') {
      template = node;
    } else if (node.tagName === 'script') {
      script = node.children[0].content;
    }
  }

  // console.log(template);
  // console.log(script)

  // let createCode = "";

  let visit = (node) => {
    if (!node) return '';
    if (node.type == 'text') {
      if (node.content.match(/^\s+$/)) {
        return null;
      } else {
        return node.content;
      }
    }

    let attrs = {};

    if (node.attributes) {
      for (const attr of node.attributes) {
        attrs[attr.name] = attr.value;
      }
    }

    let children = node.children.map(node => visit(node)).filter(Boolean).join(',');
    if (children) {
      return `create('${node.tagName}', ${JSON.stringify(attrs)},${children})`;
    } else {
      return `create('${node.tagName}', ${JSON.stringify(attrs)})`;
    }
  }

  let root = null;
  for (const ele of template.children) {
    if (ele.type === 'element') {
      root = ele;
    }
  }

  return `
   export default class Carousel {
      render(){
        return ${visit(root)};
      }
    }
  `;
}