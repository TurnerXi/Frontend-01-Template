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
/******/ 	return __webpack_require__(__webpack_require__.s = "./main.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./Carousel.vue":
/*!**********************!*\
  !*** ./Carousel.vue ***!
  \**********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return Carousel; });\n\n   class Carousel {\n      render(){\n        return create('div', {\"style\":\"width:500px;height:300px;margin:auto;background:red;\"},create('img', {\"isSelfClosing\":true}));\n      }\n    }\n  \n\n//# sourceURL=webpack:///./Carousel.vue?");

/***/ }),

/***/ "./main.js":
/*!*****************!*\
  !*** ./main.js ***!
  \*****************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _Carousel_vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Carousel.vue */ \"./Carousel.vue\");\n/* harmony import */ var _reactivity__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./reactivity */ \"./reactivity.js\");\n\n\n\nwindow.create = (tagName, attrs, ...children) => {\n  let node;\n\n  if (isComponent(tagName)) {\n    const {\n      _comp,\n      root\n    } = createComponent(tagName, attrs, children);\n    node = root;\n  } else {\n    node = createNormalElement(tagName, attrs, children);\n  }\n\n  return node;\n};\n\nfunction isComponent(tagname) {\n  return tagname instanceof Object;\n}\n\nfunction isFunc(func) {\n  return typeof func === 'function';\n}\n\nfunction createComponent(clz, attrs, children) {\n  const comp = new clz();\n\n  if (!comp.props) {\n    comp.props = {};\n  }\n\n  if (attrs) {\n    for (const key in attrs) {\n      if (attrs.hasOwnProperty(key)) {\n        comp.props[key] = attrs[key];\n      }\n    }\n\n    comp.props = Object(_reactivity__WEBPACK_IMPORTED_MODULE_1__[\"reactivity\"])(comp.props);\n  }\n\n  if (comp.state) {\n    comp.state = Object(_reactivity__WEBPACK_IMPORTED_MODULE_1__[\"reactivity\"])(comp.state);\n  }\n\n  if (isFunc(comp.created)) {\n    comp.created();\n  }\n\n  comp.children = children;\n  Object(_reactivity__WEBPACK_IMPORTED_MODULE_1__[\"effect\"])(() => {\n    if (isFunc(comp.updated)) {\n      comp.updated();\n    }\n\n    const node = comp.render();\n\n    if (comp.$el && comp.$el.parentElement) {\n      comp.$el.parentElement.replaceChild(node, comp.$el);\n    }\n\n    comp.$el = node;\n  });\n\n  if (isFunc(comp.mounted)) {\n    // TEMP\n    setTimeout(() => {\n      comp.mounted();\n    }, 0);\n  }\n\n  return {\n    _comp: comp,\n    root: comp.$el\n  };\n}\n\nfunction createNormalElement(tagName, attrs, children) {\n  const node = document.createElement(tagName);\n\n  if (attrs) {\n    for (const key in attrs) {\n      if (attrs.hasOwnProperty(key)) {\n        if (key === 'style' && typeof attrs[key] === 'object') {\n          for (let name in attrs[key]) {\n            node.style[name] = attrs[key][name];\n          }\n        } else if (key.indexOf('on') === 0) {\n          node.addEventListener(key.replace('on', '').toLocaleLowerCase(), attrs[key], false);\n        } else {\n          node.setAttribute(key, attrs[key]);\n        }\n      }\n    }\n  }\n\n  if (children) {\n    for (let child of children) {\n      if (child instanceof Array) {\n        node.append(createFragment(child));\n      } else {\n        node.append(child);\n      }\n    }\n  }\n\n  return node;\n}\n\nfunction createFragment(nodes) {\n  let frag = document.createDocumentFragment();\n\n  for (let child of nodes) {\n    var isNode = child instanceof Node;\n    frag.appendChild(isNode ? child : document.createTextNode(String(child)));\n  }\n\n  return frag;\n}\n\nconst root = document.getElementById('app');\nroot.appendChild(new _Carousel_vue__WEBPACK_IMPORTED_MODULE_0__[\"default\"]().render());\n\n//# sourceURL=webpack:///./main.js?");

/***/ }),

/***/ "./reactivity.js":
/*!***********************!*\
  !*** ./reactivity.js ***!
  \***********************/
/*! exports provided: reactivity, effect */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"reactivity\", function() { return reactivity; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"effect\", function() { return effect; });\nlet effective = null;\nconst reactivities = new Map();\nfunction reactivity(object) {\n  const effectivies = new Map();\n\n  if (reactivities.has(object)) {\n    return reactivities.get(object);\n  }\n\n  const handler = {\n    get(target, prop) {\n      if (prop === 'isProxy') {\n        return true;\n      } else if (prop === 'deps') {\n        return effectivies;\n      }\n\n      if (typeof target[prop] === 'object') {\n        return reactivity(target[prop]);\n      }\n\n      let deps = effectivies.get(prop);\n\n      if (!deps) {\n        deps = [];\n        effectivies.set(prop, deps);\n      }\n\n      if (effective && deps.indexOf(effective) < 0) {\n        deps.push(effective);\n      }\n\n      return target[prop];\n    },\n\n    set(target, prop, value) {\n      target[prop] = value;\n\n      if (effectivies.has(prop)) {\n        for (const func of effectivies.get(prop)) {\n          func.call(null);\n        }\n      }\n\n      return true;\n    }\n\n  };\n  const proxy = new Proxy(object, handler);\n  reactivities.set(object, proxy);\n  reactivities.set(proxy, proxy);\n  return proxy;\n}\nfunction effect(func) {\n  effective = func;\n  func();\n  effective = null;\n}\n\n//# sourceURL=webpack:///./reactivity.js?");

/***/ })

/******/ });