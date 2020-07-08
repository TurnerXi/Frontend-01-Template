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
/******/ 	return __webpack_require__(__webpack_require__.s = "./script.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./Carousel.js":
/*!*********************!*\
  !*** ./Carousel.js ***!
  \*********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return Carousel; });\nclass Carousel {\n  constructor(config) {\n    this.activeIndex = -1;\n    this.config = config;\n    this.properties = Object.assign({\n      loop: true,\n      time: 2000,\n      autoplay: true,\n      color: 'rgba(255,255,255,.3)',\n      forward: true,\n      datas: []\n    }, config);\n    this.events = {\n      change: () => {},\n      click: () => {},\n      hover: () => {},\n      swipe: () => {},\n      resize: () => {},\n      dbclick: () => {}\n    };\n  }\n\n  next() {}\n\n  prev() {}\n\n  goto(num) {\n    this.activeIndex = num;\n  }\n\n  play() {\n    this.properties.autoplay = true;\n  }\n\n  stop() {\n    this.properties.autoplay = false;\n  }\n\n  init(attrs, children) {\n    this.children = children;\n    Object.assign(this.properties, attrs);\n  }\n\n  created() {}\n\n  render() {\n    const {\n      autoplay,\n      loop\n    } = this.properties;\n    return create(\"div\", {\n      style: \"width: 500px;height:300px;background-color:#ffff00;\"\n    }, \"hello world ! \", loop ? '循环' : '非循环');\n  }\n\n  mounted() {}\n\n}\n\n//# sourceURL=webpack:///./Carousel.js?");

/***/ }),

/***/ "./index.js":
/*!******************!*\
  !*** ./index.js ***!
  \******************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _Carousel__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Carousel */ \"./Carousel.js\");\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (() => {\n  const root = document.getElementById('app');\n  root.appendChild(create(_Carousel__WEBPACK_IMPORTED_MODULE_0__[\"default\"], {\n    autoplay: false,\n    loop: false\n  }, \"abc\") // <div attr=\"123\">\n  //   <span>hello world!</span>\n  //   <span>hello world!</span>\n  //   <span>hello world!</span>\n  //   <span>hello world!</span>\n  //   <span>hello world!</span>\n  // </div>\n  );\n});\n\n//# sourceURL=webpack:///./index.js?");

/***/ }),

/***/ "./script.js":
/*!*******************!*\
  !*** ./script.js ***!
  \*******************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./index.js */ \"./index.js\");\n\n\nwindow.create = (tagName, attrs, ...children) => {\n  if (isComponent(tagName)) {\n    return createComponent(tagName, attrs, children);\n  }\n\n  return createNormalElement(tagName, attrs, children);\n};\n\nfunction isComponent(tagname) {\n  return new Function(`return typeof ${tagname} !== 'undefined'`)();\n}\n\nfunction createComponent(tagName, attrs, children) {\n  const comp = new Function(`return new ${tagName}()`)();\n  comp.init(attrs, children);\n  comp.created();\n  const node = comp.render();\n  comp.mounted();\n  return node;\n}\n\nfunction createNormalElement(tagName, attrs, children) {\n  const node = document.createElement(tagName);\n\n  if (attrs) {\n    for (const key in attrs) {\n      if (attrs.hasOwnProperty(key)) {\n        node.setAttribute(key, attrs[key]);\n      }\n    }\n  }\n\n  if (children) {\n    for (let child of children) {\n      node.append(child);\n    }\n  }\n\n  return node;\n}\n\nObject(_index_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"])();\n\n//# sourceURL=webpack:///./script.js?");

/***/ })

/******/ });