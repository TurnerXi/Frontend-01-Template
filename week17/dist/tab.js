/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./tab/script.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./reactivity.js":
/*!***********************!*\
  !*** ./reactivity.js ***!
  \***********************/
/*! exports provided: reactivity, effect */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"reactivity\", function() { return reactivity; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"effect\", function() { return effect; });\nlet effective = null;\nconst reactivities = new Map();\nfunction reactivity(object) {\n  const effectivies = new Map();\n\n  if (reactivities.has(object)) {\n    return reactivities.get(object);\n  }\n\n  const handler = {\n    get(target, prop) {\n      if (prop === 'isProxy') {\n        return true;\n      } else if (prop === 'deps') {\n        return effectivies;\n      }\n\n      if (typeof target[prop] === 'object') {\n        return reactivity(target[prop]);\n      }\n\n      let deps = effectivies.get(prop);\n\n      if (!deps) {\n        deps = [];\n        effectivies.set(prop, deps);\n      }\n\n      if (effective && deps.indexOf(effective) < 0) {\n        deps.push(effective);\n      }\n\n      return target[prop];\n    },\n\n    set(target, prop, value) {\n      target[prop] = value;\n\n      if (effectivies.has(prop)) {\n        for (const func of effectivies.get(prop)) {\n          func.call(null);\n        }\n      }\n\n      return true;\n    }\n\n  };\n  const proxy = new Proxy(object, handler);\n  reactivities.set(object, proxy);\n  reactivities.set(proxy, proxy);\n  return proxy;\n}\nfunction effect(func) {\n  effective = func;\n  func();\n  effective = null;\n}\n\n//# sourceURL=webpack:///./reactivity.js?");

/***/ }),

/***/ "./tab/index.css":
/*!***********************!*\
  !*** ./tab/index.css ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("\n    let style = document.createElement('style');\n    style.innerHTML = \".tab-list {\\n  width: 500px;\\n  height: 500px;\\n  margin: auto;\\n}\\n\\n.tab-title-list {\\n  display: flex;\\n  margin-right: 3px;\\n}\\n\\n.tab-title {\\n  width: 80px;\\n  height: 30px;\\n  text-align: center;\\n  line-height: 30px;\\n  border-radius: 10px 10px 0 0;\\n  border: 1px solid #aaa;\\n  border-right-width: 0;\\n  border-bottom: 0;\\n  margin-right: -3px;\\n  background-color: #eee;\\n  cursor: pointer;\\n  user-select: none;\\n  box-sizing: border-box;\\n}\\n\\n.tab-title.active {\\n  z-index: 2;\\n  border-right-width: 1px;\\n  background: #fff;\\n}\\n\\n.tab-title:nth-last-of-type(1) {\\n  border-right-width: 1px;\\n}\\n\\n.tab-content {\\n  border: 1px solid #aaa;\\n  width: 100%;\\n  height: 280px;\\n}\\n\\nimg {\\n  max-width: 100%;\\n  max-height: 100%;\\n}\";\n    document.documentElement.appendChild(style);\n  \n\n//# sourceURL=webpack:///./tab/index.css?");

/***/ }),

/***/ "./tab/index.js":
/*!**********************!*\
  !*** ./tab/index.js ***!
  \**********************/
/*! exports provided: default, Tab, TabPanel */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return App; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"Tab\", function() { return Tab; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"TabPanel\", function() { return TabPanel; });\n/* harmony import */ var _index_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./index.css */ \"./tab/index.css\");\n/* harmony import */ var _index_css__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_index_css__WEBPACK_IMPORTED_MODULE_0__);\n// import Tab, { TabPanel } from '../Tab.js';\n\nclass App {\n  constructor() {}\n\n  render() {\n    const data = [{\n      title: '蓝猫',\n      url: \"https://static001.geekbang.org/resource/image/bb/21/bb38fb7c1073eaee1755f81131f11d21.jpg\"\n    }, {\n      title: '橘猫加白',\n      url: \"https://static001.geekbang.org/resource/image/1b/21/1b809d9a2bdf3ecc481322d7c9223c21.jpg\"\n    }, {\n      title: '狸花加白',\n      url: \"https://static001.geekbang.org/resource/image/b6/4f/b6d65b2f12646a9fd6b8cb2b020d754f.jpg\"\n    }, {\n      title: '橘猫',\n      url: \"https://static001.geekbang.org/resource/image/73/e4/730ea9c393def7975deceb48b3eb6fe4.jpg\"\n    }];\n    return create(\"div\", null, create(Tab, null, create(TabPanel, {\n      title: \"1\"\n    }, \"1\"), create(TabPanel, {\n      title: \"2\"\n    }, \"2\"), create(TabPanel, {\n      title: \"3\"\n    }, \"3\"), create(TabPanel, {\n      title: \"4\"\n    }, \"4\")));\n  }\n\n}\nclass Tab {\n  constructor() {\n    this.state = {\n      activeIndex: 0\n    };\n  }\n\n  changeTab(idx) {\n    this.state.activeIndex = idx;\n  }\n\n  render() {\n    const panelTitles = this.children.map(item => item.title);\n    const {\n      activeIndex\n    } = this.state;\n    return create(\"div\", {\n      class: \"tab-list\"\n    }, create(\"div\", {\n      class: \"tab-title-list\"\n    }, panelTitles.map((item, idx) => {\n      const clz = ['tab-title', idx === activeIndex ? 'active' : ''].filter(Boolean).join(' ');\n      return create(\"div\", {\n        class: clz,\n        onClick: () => this.changeTab(idx)\n      }, item);\n    })), this.children.find((_, idx) => idx === activeIndex));\n  }\n\n}\nclass TabPanel {\n  constructor() {\n    this.props = {\n      title: ''\n    };\n  }\n\n  render() {\n    let el = create(\"div\", {\n      class: \"tab-content\"\n    }, this.children);\n    el.title = this.props.title;\n    return el;\n  }\n\n}\n\n//# sourceURL=webpack:///./tab/index.js?");

/***/ }),

/***/ "./tab/script.js":
/*!***********************!*\
  !*** ./tab/script.js ***!
  \***********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./index.js */ \"./tab/index.js\");\n/* harmony import */ var _reactivity__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../reactivity */ \"./reactivity.js\");\n\n\n\nwindow.create = (tagName, attrs, ...children) => {\n  let node;\n\n  if (isComponent(tagName)) {\n    const {\n      _comp,\n      root\n    } = createComponent(tagName, attrs, children);\n    node = root;\n  } else {\n    node = createNormalElement(tagName, attrs, children);\n  }\n\n  return node;\n};\n\nfunction isComponent(tagname) {\n  return tagname instanceof Object;\n}\n\nfunction isFunc(func) {\n  return typeof func === 'function';\n}\n\nfunction createComponent(clz, attrs, children) {\n  const comp = new clz();\n\n  if (!comp.props) {\n    comp.props = {};\n  }\n\n  if (attrs) {\n    for (const key in attrs) {\n      if (attrs.hasOwnProperty(key)) {\n        comp.props[key] = attrs[key];\n      }\n    }\n\n    comp.props = Object(_reactivity__WEBPACK_IMPORTED_MODULE_1__[\"reactivity\"])(comp.props);\n  }\n\n  if (comp.state) {\n    comp.state = Object(_reactivity__WEBPACK_IMPORTED_MODULE_1__[\"reactivity\"])(comp.state);\n  }\n\n  if (isFunc(comp.created)) {\n    comp.created();\n  }\n\n  comp.children = children;\n  Object(_reactivity__WEBPACK_IMPORTED_MODULE_1__[\"effect\"])(() => {\n    if (isFunc(comp.updated) && comp.isMounted) {\n      comp.updated();\n    }\n\n    const node = comp.render();\n\n    if (comp.$el && comp.$el.parentElement) {\n      comp.$el.parentElement.replaceChild(node, comp.$el);\n    }\n\n    comp.$el = node;\n  });\n\n  if (isFunc(comp.mounted)) {\n    // TEMP\n    setTimeout(() => {\n      comp.isMounted = true;\n      comp.mounted();\n    }, 0);\n  }\n\n  return {\n    _comp: comp,\n    root: comp.$el\n  };\n}\n\nfunction createNormalElement(tagName, attrs, children) {\n  const node = document.createElement(tagName);\n\n  if (attrs) {\n    for (const key in attrs) {\n      if (attrs.hasOwnProperty(key)) {\n        if (key === 'style' && typeof attrs[key] === 'object') {\n          for (let name in attrs[key]) {\n            node.style[name] = attrs[key][name];\n          }\n        } else if (key.indexOf('on') === 0) {\n          node.addEventListener(key.replace('on', '').toLocaleLowerCase(), attrs[key], false);\n        } else {\n          node.setAttribute(key, attrs[key]);\n        }\n      }\n    }\n  }\n\n  if (children) {\n    for (let child of children) {\n      if (child instanceof Array) {\n        node.append(createFragment(child));\n      } else {\n        node.append(child);\n      }\n    }\n  }\n\n  return node;\n}\n\nfunction createFragment(nodes) {\n  let frag = document.createDocumentFragment();\n\n  for (let child of nodes) {\n    var isNode = child instanceof Node;\n    frag.appendChild(isNode ? child : document.createTextNode(String(child)));\n  }\n\n  return frag;\n}\n\nconst root = document.getElementById('app');\nroot.appendChild(create(_index_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"], null));\n\n//# sourceURL=webpack:///./tab/script.js?");

/***/ })

/******/ });