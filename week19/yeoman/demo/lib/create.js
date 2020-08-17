import { effect, reactivity } from './reactivity';

window.create = (tagName, attrs, ...children) => {
  let node;
  if (isComponent(tagName)) {
    const { _comp, root } = createComponent(tagName, attrs, children);
    node = root;
  } else {
    node = createNormalElement(tagName, attrs, children);
  }
  return node;
}

function isComponent(tagname) {
  return tagname instanceof Object;
}

function isFunc(func) {
  return typeof func === 'function';
}

function createComponent(clz, attrs, children) {
  const comp = new clz();
  if (!comp.props) {
    comp.props = {};
  }
  if (attrs) {
    for (const key in attrs) {
      if (attrs.hasOwnProperty(key)) {
        comp.props[key] = attrs[key];
      }
    }
    comp.props = reactivity(comp.props);
  }

  if (comp.state) {
    comp.state = reactivity(comp.state);
  }

  if (isFunc(comp.created)) {
    comp.created();
  }

  comp.children = children;
  effect(() => {
    if (isFunc(comp.updated) && comp.isMounted) {
      comp.updated();
    }
    const node = comp.render();
    if (comp.$el && comp.$el.parentElement) {
      comp.$el.parentElement.replaceChild(node, comp.$el);
    }
    comp.$el = node;
  })
  if (isFunc(comp.mounted)) {
    // TEMP
    setTimeout(() => {
      comp.isMounted = true;
      comp.mounted();
    }, 0);
  }
  return {
    _comp: comp,
    root: comp.$el
  };
}

function createNormalElement(tagName, attrs, children) {
  const node = document.createElement(tagName);
  if (attrs) {
    for (const key in attrs) {
      if (attrs.hasOwnProperty(key)) {
        if (key === 'style' && typeof attrs[key] === 'object') {
          for (let name in attrs[key]) {
            node.style[name] = attrs[key][name];
          }
        } else if (key.indexOf('on') === 0) {
          node.addEventListener(key.replace('on', '').toLocaleLowerCase(), attrs[key], false);
        } else {
          node.setAttribute(key, attrs[key]);
        }
      }
    }
  }
  if (children) {
    for (let child of children) {
      if (child instanceof Array) {
        node.append(createFragment(child));
      } else {
        node.append(child);
      }
    }
  }
  return node;
}

function createFragment(nodes) {
  let frag = document.createDocumentFragment();
  for (let child of nodes) {
    var isNode = child instanceof Node;
    frag.appendChild(isNode ? child : document.createTextNode(String(child)));
  }
  return frag;
}
