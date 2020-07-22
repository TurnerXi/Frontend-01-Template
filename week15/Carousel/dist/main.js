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

/***/ "../Animation/animation.js":
/*!*********************************!*\
  !*** ../Animation/animation.js ***!
  \*********************************/
/*! exports provided: TimeLine, Animation */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"TimeLine\", function() { return TimeLine; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"Animation\", function() { return Animation; });\n/* harmony import */ var _cubicBezier_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./cubicBezier.js */ \"../Animation/cubicBezier.js\");\n\nconst BezierMap = {\n  'ease': Object(_cubicBezier_js__WEBPACK_IMPORTED_MODULE_0__[\"cubicBezier\"])(.25, .1, .25, 1),\n  'linear': Object(_cubicBezier_js__WEBPACK_IMPORTED_MODULE_0__[\"cubicBezier\"])(0, 0, 1, 1),\n  'easeIn': Object(_cubicBezier_js__WEBPACK_IMPORTED_MODULE_0__[\"cubicBezier\"])(.42, 0, 1, 1),\n  'easeOut': Object(_cubicBezier_js__WEBPACK_IMPORTED_MODULE_0__[\"cubicBezier\"])(0, 0, .58, 1),\n  'easeInOut': Object(_cubicBezier_js__WEBPACK_IMPORTED_MODULE_0__[\"cubicBezier\"])(.42, 0, .58, 1)\n};\nclass TimeLine {\n  constructor() {\n    this.animations = [];\n    this.startTime = null;\n    this.requrestID = null;\n    this.pauseTime = null;\n    this.state = 'inited';\n  }\n\n  add(animation, isSync = true) {\n    this.animations.push(animation);\n    animation.finished = false;\n    animation.addTime = 0;\n\n    if (this.state === 'playing' && !isSync) {\n      animation.addTime = Date.now() - this.startTime;\n    }\n  }\n\n  tick() {\n    let t = Date.now() - this.startTime;\n    let animations = this.animations.filter(item => !item.finished);\n\n    for (let animation of animations) {\n      let {\n        progression,\n        duration,\n        delay,\n        addTime,\n        timingFunc\n      } = animation;\n\n      if (progression === undefined) {\n        animation.progression = 0;\n      } else {\n        let progress = (t - addTime - delay) / duration;\n\n        if (progress < 1) {\n          animation.progression = timingFunc(progress);\n        } else if (progress >= 1) {\n          animation.progression = 1;\n          animation.finished = true;\n        }\n      }\n    }\n\n    if (animations.length) {\n      this.requrestID = requestAnimationFrame(() => this.tick());\n    }\n  }\n\n  start() {\n    if (this.state !== 'inited') return;\n    this.state = 'playing';\n    this.startTime = Date.now();\n    this.tick();\n  }\n\n  restart() {\n    if (this.state === 'playing') {\n      this.pause();\n    }\n\n    this.animations = [];\n    this.requrestID = null;\n    this.state = 'playing';\n    this.startTime = Date.now();\n    this.pauseTime = null;\n    this.tick();\n  }\n\n  pause() {\n    if (this.state !== 'playing') return;\n    this.state = 'paused';\n    this.pauseTime = Date.now();\n\n    if (this.requrestID) {\n      cancelAnimationFrame(this.requrestID);\n    }\n  }\n\n  resume() {\n    if (this.state !== 'paused') return;\n    this.state = 'playing';\n    this.startTime += Date.now() - this.pauseTime;\n    this.tick();\n  }\n\n}\nclass Animation {\n  constructor({\n    el,\n    styleName,\n    start,\n    end,\n    duration,\n    timingFunc = 'ease',\n    delay = 0\n  }) {\n    this.el = el;\n    this.styleName = styleName;\n    this.start = start;\n    this.end = end;\n    this.duration = duration * 1000;\n\n    if (typeof timingFunc === 'function') {\n      this.timingFunc = timingFunc;\n    } else {\n      this.timingFunc = BezierMap[timingFunc] || BezierMap['ease'];\n    }\n\n    this.delay = delay * 1000;\n  }\n\n}\n\nAnimation.create = config => {\n  if (config.styleName.toLowerCase().indexOf('color') > -1) {\n    return new ColorAnimation(config);\n  } else {\n    return new PixelAnimation(config);\n  }\n};\n\nclass ColorAnimation extends Animation {\n  constructor(config) {\n    super(config);\n    const {\n      start,\n      end\n    } = config;\n    this.startVals = this.getValues(start);\n    this.endVals = this.getValues(end);\n  }\n\n  get progression() {\n    return this._progression;\n  }\n\n  set progression(val) {\n    this._progression = val;\n    const {\n      startVals,\n      endVals\n    } = this;\n    let values = [];\n\n    for (let i = 0; i < startVals.length; i++) {\n      const startVal = startVals[i];\n      const endVal = endVals[i];\n      values[i] = (endVal - startVal) * val + startVal;\n    }\n\n    this.setValues(values);\n  }\n\n  getValues(str) {\n    let reg = /[-+]?\\d?[\\.]?\\d+/g;\n    let result = null;\n    let values = [];\n\n    while (result = reg.exec(str)) {\n      values.push(Number(result[0]));\n    }\n\n    return values;\n  }\n\n  setValues(values) {\n    const {\n      el,\n      styleName,\n      start\n    } = this;\n    let reg = /[-+]?\\d*\\.?\\d+/g;\n    let idx = 0;\n    const value = start.replace(reg, () => {\n      if (idx === 3) {\n        return values[idx];\n      } else {\n        return parseInt(values[idx++]);\n      }\n    });\n    el.style[styleName] = value;\n  }\n\n}\n\nclass PixelAnimation extends Animation {\n  constructor(config) {\n    super(config);\n    const {\n      start,\n      end\n    } = config;\n    this.startVals = this.getValues(start);\n    this.endVals = this.getValues(end);\n  }\n\n  get progression() {\n    return this._progression;\n  }\n\n  set progression(val) {\n    this._progression = val;\n    const {\n      startVals,\n      endVals\n    } = this;\n    let values = [];\n\n    for (let i = 0; i < startVals.length; i++) {\n      const startVal = startVals[i];\n      const endVal = endVals[i];\n      values[i] = (endVal - startVal) * val + startVal;\n    }\n\n    this.setValues(values);\n  }\n\n  getValues(str) {\n    let reg = /[-+]?\\d*\\.?\\d+/g;\n    let result = null;\n    let values = [];\n\n    while (result = reg.exec(str)) {\n      values.push(Number(result[0]));\n    }\n\n    return values;\n  }\n\n  setValues(values) {\n    const {\n      el,\n      styleName,\n      start\n    } = this;\n    let reg = /[-+]?\\d*\\.?\\d+/g;\n    let idx = 0;\n    const value = start.replace(reg, () => values[idx++]);\n    el.style[styleName] = value;\n  }\n\n}\n\n//# sourceURL=webpack:///../Animation/animation.js?");

/***/ }),

/***/ "../Animation/cubicBezier.js":
/*!***********************************!*\
  !*** ../Animation/cubicBezier.js ***!
  \***********************************/
/*! exports provided: cubicBezier */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"cubicBezier\", function() { return cubicBezier; });\nfunction cubicBezier(p1x, p1y, p2x, p2y) {\n  const ZERO_LIMIT = 1e-6; // Calculate the polynomial coefficients,\n  // implicit first and last control points are (0,0) and (1,1).\n\n  const ax = 3 * p1x - 3 * p2x + 1;\n  const bx = 3 * p2x - 6 * p1x;\n  const cx = 3 * p1x;\n  const ay = 3 * p1y - 3 * p2y + 1;\n  const by = 3 * p2y - 6 * p1y;\n  const cy = 3 * p1y;\n\n  function sampleCurveDerivativeX(t) {\n    // `ax t^3 + bx t^2 + cx t' expanded using Horner 's rule.\n    return (3 * ax * t + 2 * bx) * t + cx;\n  }\n\n  function sampleCurveX(t) {\n    return ((ax * t + bx) * t + cx) * t;\n  }\n\n  function sampleCurveY(t) {\n    return ((ay * t + by) * t + cy) * t;\n  } // Given an x value, find a parametric value it came from.\n\n\n  function solveCurveX(x) {\n    var t2 = x;\n    var derivative;\n    var x2; // https://trac.webkit.org/browser/trunk/Source/WebCore/platform/animation\n    // First try a few iterations of Newton's method -- normally very fast.\n    // http://en.wikipedia.org/wiki/Newton's_method\n\n    for (let i = 0; i < 8; i++) {\n      // f(t)-x=0\n      x2 = sampleCurveX(t2) - x;\n\n      if (Math.abs(x2) < ZERO_LIMIT) {\n        return t2;\n      }\n\n      derivative = sampleCurveDerivativeX(t2); // == 0, failure\n\n      /* istanbul ignore if */\n\n      if (Math.abs(derivative) < ZERO_LIMIT) {\n        break;\n      }\n\n      t2 -= x2 / derivative;\n    } // Fall back to the bisection method for reliability.\n    // bisection\n    // http://en.wikipedia.org/wiki/Bisection_method\n\n\n    var t1 = 1;\n    /* istanbul ignore next */\n\n    var t0 = 0;\n    /* istanbul ignore next */\n\n    t2 = x;\n    /* istanbul ignore next */\n\n    while (t1 > t0) {\n      x2 = sampleCurveX(t2) - x;\n\n      if (Math.abs(x2) < ZERO_LIMIT) {\n        return t2;\n      }\n\n      if (x2 > 0) {\n        t1 = t2;\n      } else {\n        t0 = t2;\n      }\n\n      t2 = (t1 + t0) / 2;\n    } // Failure\n\n\n    return t2;\n  }\n\n  function solve(x) {\n    return sampleCurveY(solveCurveX(x));\n  }\n\n  return solve;\n}\n\n//# sourceURL=webpack:///../Animation/cubicBezier.js?");

/***/ }),

/***/ "./Carousel.js":
/*!*********************!*\
  !*** ./Carousel.js ***!
  \*********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return Carousel; });\n/* harmony import */ var _Animation_animation__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../Animation/animation */ \"../Animation/animation.js\");\n\nconst style = {\n  width: '500px',\n  height: '300px',\n  backgroundColor: '#ffff00',\n  whiteSpace: 'nowrap',\n  overflow: 'hidden',\n  outline: '1px solid cyan',\n  margin: 'auto'\n};\nconst imageStyle = {\n  width: '100%',\n  height: '100%',\n  display: 'inline-block'\n};\nclass Carousel {\n  constructor() {\n    this.timer = null;\n    this.isAutoplay = true;\n    this.activeIndex = 0;\n    this.state = {};\n    this.config = {};\n    this.events = {\n      onChange: () => {},\n      onClick: () => {},\n      onHover: () => {},\n      onSwipe: () => {},\n      onResize: () => {},\n      onDbclick: () => {}\n    };\n    this.props = Object.assign({\n      loop: true,\n      time: 2000,\n      autoplay: true,\n      color: 'rgba(255,255,255,.3)',\n      forward: true,\n      datas: []\n    }, this.config, this.events);\n    this.timeLine = new _Animation_animation__WEBPACK_IMPORTED_MODULE_0__[\"TimeLine\"]();\n  }\n\n  next() {\n    const {\n      datas\n    } = this.props;\n    this.activeIndex = (this.activeIndex + 1) % datas.length;\n  }\n\n  prev() {\n    const {\n      datas\n    } = this.props;\n    this.activeIndex = (this.activeIndex - 1 + datas.length) % datas.length;\n  }\n\n  goto(num) {\n    const {\n      datas\n    } = this.props;\n    this.activeIndex = num < 0 ? 0 : num % datas.length;\n  }\n\n  play() {\n    this.isAutoplay = true;\n  }\n\n  stop() {\n    this.isAutoplay = false;\n  }\n\n  created() {}\n\n  updated() {\n    const {\n      autoplay\n    } = this.props;\n    this.isAutoplay = autoplay;\n  }\n\n  render() {\n    const {\n      datas\n    } = this.props;\n    return create(\"div\", {\n      style: style,\n      onMousedown: this.mousedown.bind(this)\n    }, datas.map(item => create(\"img\", {\n      src: item,\n      style: imageStyle,\n      draggable: false\n    })));\n  }\n\n  startPlay() {\n    const container = this.$el;\n    const images = container.children;\n    let position = this.activeIndex;\n    let nextPos = (position + 1) % images.length;\n    this.timeLine = new _Animation_animation__WEBPACK_IMPORTED_MODULE_0__[\"TimeLine\"]();\n    let currentAni = _Animation_animation__WEBPACK_IMPORTED_MODULE_0__[\"Animation\"].create({\n      el: images[position],\n      styleName: 'transform',\n      start: `translateX(${-container.offsetWidth * position}px)`,\n      end: `translateX(${-container.offsetWidth * (position + 1)}px)`,\n      duration: 3\n    });\n    let nextAni = _Animation_animation__WEBPACK_IMPORTED_MODULE_0__[\"Animation\"].create({\n      el: images[nextPos],\n      styleName: 'transform',\n      start: `translateX(${-container.offsetWidth * (nextPos - 1)}px)`,\n      end: `translateX(${-container.offsetWidth * nextPos}px)`,\n      duration: 3\n    });\n    this.timeLine.add(currentAni);\n    this.timeLine.add(nextAni);\n    this.timeLine.start();\n    this.timer = setTimeout(() => {\n      this.activeIndex = nextPos;\n      this.startPlay();\n    }, 3000);\n  }\n\n  mousedown(e) {\n    // let autoplay = this.isAutoplay;\n    // this.isAutoplay = false;\n    this.timeLine.pause();\n    clearTimeout(this.timer);\n    const container = this.$el;\n    const images = container.children;\n    const size = images.length;\n\n    for (let i = 0; i < size; i++) {\n      if (images[i] === e.target) {\n        this.activeIndex = i;\n      }\n    }\n\n    let startX = e.pageX;\n    let offsetX = 0;\n    let position2 = this.activeIndex;\n    let position1 = (position2 - 1 + size) % size;\n    let position3 = (position2 + 1) % size;\n    let position4 = (position2 + 2) % size;\n    let first = images[position1];\n    let second = images[position2];\n    let third = images[position3];\n    let forth = images[position4];\n    first.style.transform = `translateX(${-container.offsetWidth * (position1 + 1) + offsetX}px)`;\n    second.style.transform = `translateX(${-container.offsetWidth * position2 + offsetX}px)`;\n    third.style.transform = `translateX(${-container.offsetWidth * (position3 - 1) + offsetX}px)`;\n    forth.style.transform = `translateX(${-container.offsetWidth * (position4 - 2) + offsetX}px)`;\n\n    const mousemove = e => {\n      offsetX += e.pageX - startX;\n      first.style.transform = `translateX(${-container.offsetWidth * (position1 + 1) + offsetX}px)`;\n      second.style.transform = `translateX(${-container.offsetWidth * position2 + offsetX}px)`;\n      third.style.transform = `translateX(${-container.offsetWidth * (position3 - 1) + offsetX}px)`;\n      forth.style.transform = `translateX(${-container.offsetWidth * (position4 - 2) + offsetX}px)`;\n      startX = e.pageX;\n    };\n\n    const mouseup = e => {\n      let offset = 0;\n\n      if (offsetX > container.offsetWidth * 3 / 2) {\n        offset = 2;\n      } else if (offsetX > container.offsetWidth / 2) {\n        offset = 1;\n      } else if (offsetX < -container.offsetWidth * 3 / 2) {\n        offset = -2;\n      } else if (offsetX < -container.offsetWidth / 2) {\n        offset = -1;\n      }\n\n      this.timeLine = new _Animation_animation__WEBPACK_IMPORTED_MODULE_0__[\"TimeLine\"]();\n      let firstAni = _Animation_animation__WEBPACK_IMPORTED_MODULE_0__[\"Animation\"].create({\n        el: images[position1],\n        styleName: 'transform',\n        start: `translateX(${-container.offsetWidth * (position1 + 1) + offsetX}px)`,\n        end: `translateX(${-container.offsetWidth * (position1 - offset + 1)}px)`,\n        duration: .5\n      });\n      let secondAni = _Animation_animation__WEBPACK_IMPORTED_MODULE_0__[\"Animation\"].create({\n        el: images[position2],\n        styleName: 'transform',\n        start: `translateX(${-container.offsetWidth * position2 + offsetX}px)`,\n        end: `translateX(${-container.offsetWidth * (position2 - offset)}px)`,\n        duration: .5\n      });\n      let thirdAni = _Animation_animation__WEBPACK_IMPORTED_MODULE_0__[\"Animation\"].create({\n        el: images[position3],\n        styleName: 'transform',\n        start: `translateX(${-container.offsetWidth * (position3 - 1) + offsetX}px)`,\n        end: `translateX(${-container.offsetWidth * (position3 - offset - 1)}px)`,\n        duration: .5\n      });\n      let forthAni = _Animation_animation__WEBPACK_IMPORTED_MODULE_0__[\"Animation\"].create({\n        el: images[position4],\n        styleName: 'transform',\n        start: `translateX(${-container.offsetWidth * (position4 - 2) + offsetX}px)`,\n        end: `translateX(${-container.offsetWidth * (position4 - offset - 2)}px))`,\n        duration: .5\n      });\n      this.timeLine.add(firstAni);\n      this.timeLine.add(secondAni);\n      this.timeLine.add(thirdAni);\n      this.timeLine.add(forthAni);\n      this.timeLine.start();\n      this.activeIndex = (this.activeIndex - offset + size) % size; // if (autoplay) {\n\n      this.timer = setTimeout(() => {\n        // this.isAutoplay = autoplay;\n        this.startPlay();\n      }, 3000); // }\n\n      container.removeEventListener('mousemove', mousemove, false);\n      document.removeEventListener('mouseup', mouseup, false);\n    };\n\n    container.addEventListener('mousemove', mousemove, false);\n    document.addEventListener('mouseup', mouseup, false);\n  }\n\n  mounted() {\n    this.startPlay();\n  }\n\n}\n\n//# sourceURL=webpack:///./Carousel.js?");

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