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
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return Carousel; });\nconst style = {\n  width: '500px',\n  height: '300px',\n  backgroundColor: '#ffff00',\n  whiteSpace: 'nowrap',\n  overflow: 'hidden',\n  outline: '1px solid cyan',\n  margin: 'auto'\n};\nconst imageStyle = {\n  width: '100%',\n  height: '100%',\n  display: 'inline-block'\n};\nclass Carousel {\n  constructor() {\n    this.timer = null;\n    this.offsetX = 0;\n    this.isAutoplay = true;\n    this.state = {\n      activeIndex: 0\n    };\n    this.config = {};\n    this.events = {\n      onChange: () => {},\n      onClick: () => {},\n      onHover: () => {},\n      onSwipe: () => {},\n      onResize: () => {},\n      onDbclick: () => {}\n    };\n    this.props = Object.assign({\n      loop: true,\n      time: 2000,\n      autoplay: true,\n      color: 'rgba(255,255,255,.3)',\n      forward: true,\n      datas: []\n    }, this.config, this.events);\n  }\n\n  next() {\n    const {\n      datas\n    } = this.props;\n    this.activeIndex = (this.activeIndex + 1) % datas.length;\n  }\n\n  prev() {\n    const {\n      datas\n    } = this.props;\n    this.activeIndex = (this.activeIndex - 1 + datas.length) % datas.length;\n  }\n\n  goto(num) {\n    const {\n      datas\n    } = this.props;\n    this.activeIndex = num < 0 ? 0 : num % datas.length;\n  }\n\n  play() {\n    this.isAutoplay = true;\n  }\n\n  stop() {\n    this.isAutoplay = false;\n  }\n\n  created() {}\n\n  updated() {\n    const {\n      autoplay\n    } = this.props;\n    this.isAutoplay = autoplay;\n    console.log(123);\n  }\n\n  render() {\n    const {\n      datas\n    } = this.props;\n    const {\n      activeIndex\n    } = this.state;\n    const len = datas.length;\n    return create(\"div\", {\n      style: style,\n      onMousedown: this.mousedown.bind(this)\n    }, datas.map((item, idx) => {\n      let style = Object.assign({}, imageStyle);\n\n      if (activeIndex === (idx + 1) % len) {\n        style.transform = `translateX(calc(${-100 - 100 * idx}% - ${this.offsetX}px))`;\n      } else if (activeIndex === idx) {\n        style.transform = `translateX(calc(${-100 * idx}% - ${this.offsetX}px))`;\n      } else if (activeIndex === (idx - 1 + len) % len) {\n        style.transform = `translateX(calc(${100 - 100 * idx}% - ${this.offsetX}px))`;\n      }\n\n      return create(\"img\", {\n        src: item,\n        style: style,\n        draggable: false\n      });\n    }));\n  }\n\n  startPlay() {\n    const {\n      datas\n    } = this.props;\n    let {\n      activeIndex\n    } = this.state;\n    const container = this.$el;\n    const images = container.children;\n    const size = datas.length;\n\n    if (!this.isAutoplay) {\n      setTimeout(this.startPlay.bind(this), 3000);\n    } else {\n      this.offsetX += 10;\n\n      if (this.offsetX >= 500) {\n        this.offsetX = 0;\n        activeIndex = (activeIndex + 1) % datas.length;\n        Object.assign(this.state, {\n          activeIndex\n        });\n        setTimeout(this.startPlay.bind(this), 3000);\n      } else {\n        const nextPosition = (activeIndex + 1) % size;\n        let current = images[activeIndex];\n        let next = images[nextPosition];\n        current.style.transform = `translateX(calc(${-100 * activeIndex}% - ${this.offsetX}px))`;\n        next.style.transform = `translateX(calc(${-100 * (nextPosition - 1)}% - ${this.offsetX}px)`;\n        requestAnimationFrame(this.startPlay.bind(this));\n      }\n    }\n  }\n\n  mousedown(e) {\n    this.offsetX = 0;\n    let autoplay = this.isAutoplay;\n    this.isAutoplay = false;\n    const {\n      datas\n    } = this.props;\n    let {\n      activeIndex\n    } = this.state;\n    const container = this.$el;\n    const images = container.children;\n    const size = datas.length;\n    let startX = e.pageX;\n    let offsetX = this.offsetX;\n    let position = activeIndex;\n    let lastPosition = (position - 1 + size) % size;\n    let nextPosition = (position + 1) % size;\n    let current = images[position];\n    let last = images[lastPosition];\n    let next = images[nextPosition];\n    current.style.transform = `translateX(${-100 * position}%)`;\n    last.style.transform = `translateX(${-100 * (lastPosition + 1)}%)`;\n    next.style.transform = `translateX(${-100 * (nextPosition - 1)}%)`;\n\n    const mousemove = e => {\n      offsetX = e.pageX - startX;\n      current.style.transform = `translateX(calc(${-100 * position}% + ${offsetX}px))`;\n      last.style.transform = `translateX(calc(${-100 * (lastPosition + 1)}% + ${offsetX}px))`;\n      next.style.transform = `translateX(calc(${-100 * (nextPosition - 1)}% + ${offsetX}px)`;\n    };\n\n    const mouseup = e => {\n      let offset = 0;\n\n      if (offsetX > container.offsetWidth / 2) {\n        offset = 1;\n      } else if (offsetX < -container.offsetWidth / 2) {\n        offset = -1;\n      }\n\n      this.isAutoplay = autoplay;\n      this.state.activeIndex = (position - offset + size) % size;\n      container.removeEventListener('mousemove', mousemove, false);\n      document.removeEventListener('mouseup', mouseup, false);\n    };\n\n    container.addEventListener('mousemove', mousemove, false);\n    document.addEventListener('mouseup', mouseup, false);\n  }\n\n  mounted() {\n    this.startPlay();\n  }\n\n}\n\n//# sourceURL=webpack:///./Carousel.js?");

/***/ }),

/***/ "./index.js":
/*!******************!*\
  !*** ./index.js ***!
  \******************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return App; });\n/* harmony import */ var _Carousel__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Carousel */ \"./Carousel.js\");\n\nclass App {\n  constructor() {\n    this.state = {\n      loop: true,\n      time: 2000,\n      autoplay: true,\n      color: 'rgba(255,255,255,.3)',\n      forward: true,\n      datas: [\"https://static001.geekbang.org/resource/image/bb/21/bb38fb7c1073eaee1755f81131f11d21.jpg\", \"https://static001.geekbang.org/resource/image/1b/21/1b809d9a2bdf3ecc481322d7c9223c21.jpg\", \"https://static001.geekbang.org/resource/image/b6/4f/b6d65b2f12646a9fd6b8cb2b020d754f.jpg\", \"https://static001.geekbang.org/resource/image/73/e4/730ea9c393def7975deceb48b3eb6fe4.jpg\"]\n    };\n  }\n\n  toggleAutoPlay() {\n    this.state.autoplay = !this.state.autoplay;\n  }\n\n  render() {\n    const {\n      autoplay,\n      datas\n    } = this.state;\n    return create(\"div\", null, create(_Carousel__WEBPACK_IMPORTED_MODULE_0__[\"default\"], {\n      autoplay: autoplay,\n      datas: datas\n    }), create(\"button\", {\n      onClick: this.toggleAutoPlay.bind(this),\n      style: \"margin: 20px auto;display: block;\"\n    }, autoplay ? '暂停' : '播放'));\n  }\n\n}\n\n//# sourceURL=webpack:///./index.js?");

/***/ }),

/***/ "./reactivity.js":
/*!***********************!*\
  !*** ./reactivity.js ***!
  \***********************/
/*! exports provided: reactivity, effect */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"reactivity\", function() { return reactivity; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"effect\", function() { return effect; });\nlet effective = null;\nconst reactivities = new Map();\nfunction reactivity(object) {\n  const effectivies = new Map();\n\n  if (reactivities.has(object)) {\n    return reactivities.get(object);\n  }\n\n  const handler = {\n    get(target, prop) {\n      if (prop === 'isProxy') {\n        return true;\n      } else if (prop === 'deps') {\n        return effectivies;\n      }\n\n      if (typeof target[prop] === 'object') {\n        return reactivity(target[prop]);\n      }\n\n      let deps = effectivies.get(prop);\n\n      if (!deps) {\n        deps = [];\n        effectivies.set(prop, deps);\n      }\n\n      if (effective && deps.indexOf(effective) < 0) {\n        deps.push(effective);\n      }\n\n      return target[prop];\n    },\n\n    set(target, prop, value) {\n      target[prop] = value;\n\n      if (effectivies.has(prop)) {\n        for (const func of effectivies.get(prop)) {\n          func.call(null);\n        }\n      }\n\n      return true;\n    }\n\n  };\n  const proxy = new Proxy(object, handler);\n  reactivities.set(object, proxy);\n  reactivities.set(proxy, proxy);\n  return proxy;\n}\nfunction effect(func) {\n  effective = func;\n  func();\n  effective = null;\n}\n\n//# sourceURL=webpack:///./reactivity.js?");

/***/ }),

/***/ "./script.js":
/*!*******************!*\
  !*** ./script.js ***!
  \*******************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./index.js */ \"./index.js\");\n/* harmony import */ var _reactivity__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./reactivity */ \"./reactivity.js\");\n\n\n\nwindow.create = (tagName, attrs, ...children) => {\n  let node;\n\n  if (isComponent(tagName)) {\n    const {\n      _comp,\n      root\n    } = createComponent(tagName, attrs, children);\n    node = root;\n  } else {\n    node = createNormalElement(tagName, attrs, children);\n  }\n\n  return node;\n};\n\nfunction isComponent(tagname) {\n  return tagname instanceof Object;\n}\n\nfunction isFunc(func) {\n  return typeof func === 'function';\n}\n\nfunction createComponent(clz, attrs, children) {\n  const comp = new clz();\n\n  if (!comp.props) {\n    comp.props = {};\n  }\n\n  if (attrs) {\n    for (const key in attrs) {\n      if (attrs.hasOwnProperty(key)) {\n        comp.props[key] = attrs[key];\n      }\n    }\n\n    comp.props = Object(_reactivity__WEBPACK_IMPORTED_MODULE_1__[\"reactivity\"])(comp.props);\n  }\n\n  if (comp.state) {\n    comp.state = Object(_reactivity__WEBPACK_IMPORTED_MODULE_1__[\"reactivity\"])(comp.state);\n  }\n\n  if (isFunc(comp.created)) {\n    comp.created();\n  }\n\n  comp.children = children;\n  Object(_reactivity__WEBPACK_IMPORTED_MODULE_1__[\"effect\"])(() => {\n    if (isFunc(comp.updated)) {\n      comp.updated();\n    }\n\n    const node = comp.render();\n\n    if (comp.$el && comp.$el.parentElement) {\n      comp.$el.parentElement.replaceChild(node, comp.$el);\n    }\n\n    comp.$el = node;\n  });\n\n  if (isFunc(comp.mounted)) {\n    // TEMP\n    setTimeout(() => {\n      comp.mounted();\n    }, 0);\n  }\n\n  return {\n    _comp: comp,\n    root: comp.$el\n  };\n}\n\nfunction createNormalElement(tagName, attrs, children) {\n  const node = document.createElement(tagName);\n\n  if (attrs) {\n    for (const key in attrs) {\n      if (attrs.hasOwnProperty(key)) {\n        if (key === 'style' && typeof attrs[key] === 'object') {\n          for (let name in attrs[key]) {\n            node.style[name] = attrs[key][name];\n          }\n        } else if (key.indexOf('on') === 0) {\n          node.addEventListener(key.replace('on', '').toLocaleLowerCase(), attrs[key], false);\n        } else {\n          node.setAttribute(key, attrs[key]);\n        }\n      }\n    }\n  }\n\n  if (children) {\n    for (let child of children) {\n      if (child instanceof Array) {\n        node.append(createFragment(child));\n      } else {\n        node.append(child);\n      }\n    }\n  }\n\n  return node;\n}\n\nfunction createFragment(nodes) {\n  let frag = document.createDocumentFragment();\n\n  for (let child of nodes) {\n    var isNode = child instanceof Node;\n    frag.appendChild(isNode ? child : document.createTextNode(String(child)));\n  }\n\n  return frag;\n}\n\nconst root = document.getElementById('app');\nroot.appendChild(create(_index_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"], null));\n\n//# sourceURL=webpack:///./script.js?");

/***/ })

/******/ });