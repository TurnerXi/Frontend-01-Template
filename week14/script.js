import App from './index.js';

window.create = (tagName, attrs, ...children) => {
  if (isComponent(tagName)) {
    return createComponent(tagName, attrs, children);
  }
  return createNormalElement(tagName, attrs, children);
}


function isComponent(tagname) {
  return new Function(`return typeof ${tagname} !== 'undefined'`)()
}

function createComponent(tagName, attrs, children) {
  const comp = new Function(`return new ${tagName}()`)();
  comp.init(attrs, children);
  comp.created();
  const node = comp.render();
  comp.mounted();
  return node;
}

function createNormalElement(tagName, attrs, children) {
  const node = document.createElement(tagName);
  if (attrs) {
    for (const key in attrs) {
      if (attrs.hasOwnProperty(key)) {
        node.setAttribute(key, attrs[key]);
      }
    }
  }
  if (children) {
    for (let child of children) {
      node.append(child);
    }
  }
  return node;
}

App();