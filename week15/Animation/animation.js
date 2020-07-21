import { cubicBezier } from './cubicBezier.js';

const BezierMap = {
  'ease': cubicBezier(.25, .1, .25, 1),
  'linear': cubicBezier(0, 0, 1, 1),
  'easeIn': cubicBezier(.42, 0, 1, 1),
  'easeOut': cubicBezier(0, 0, .58, 1),
  'easeInOut': cubicBezier(.42, 0, .58, 1),
}

export class TimeLine {
  constructor() {
    this.animations = [];
    this.startTime = null;
    this.requrestID = null;
    this.pauseTime = null;
    this.state = 'inited'
  }

  add(animation, isSync = true) {
    this.animations.push(animation);
    animation.finished = false;
    animation.addTime = 0;
    if (this.state === 'playing' && !isSync) {
      animation.addTime = Date.now() - this.startTime;
    }
  }

  tick() {
    let t = Date.now() - this.startTime;
    let animations = this.animations.filter(item => !item.finished);
    for (let animation of animations) {
      let { progression, duration, delay, addTime, timingFunc } = animation;
      if (progression === undefined) {
        animation.progression = 0
      } else {
        let progress = (t - addTime - delay) / duration;
        if (progress < 1) {
          animation.progression = timingFunc(progress);
        } else if (progress >= 1) {
          animation.progression = 1;
          animation.finished = true;
        }
      }
    }
    if (animations.length) {
      this.requrestID = requestAnimationFrame(() => this.tick());
    }
  }

  start() {
    if (this.state !== 'inited') return;
    this.state = 'playing';
    this.startTime = Date.now();
    this.tick();
  }

  restart() {
    if (this.state === 'playing') {
      this.pause();
    }
    this.animations = [];
    this.requrestID = null;
    this.state = 'playing';
    this.startTime = Date.now();
    this.pauseTime = null;
    this.tick();
  }

  pause() {
    if (this.state !== 'playing') return;
    this.state = 'paused';
    this.pauseTime = Date.now();
    if (this.requrestID) {
      cancelAnimationFrame(this.requrestID);
    }
  }

  resume() {
    if (this.state !== 'paused') return;
    this.state = 'playing';
    this.startTime += Date.now() - this.pauseTime;
    this.tick();
  }
}


export class Animation {
  constructor({ el, styleName, start, end, duration, timingFunc = 'ease', delay = 0 }) {
    this.el = el;
    this.styleName = styleName;
    this.start = start;
    this.end = end;
    this.duration = duration * 1000;
    if (typeof timingFunc === 'function') {
      this.timingFunc = timingFunc;
    } else {
      this.timingFunc = BezierMap[timingFunc] || BezierMap['ease'];
    }
    this.delay = delay * 1000;
  }
}

Animation.create = (config) => {
  if (config.styleName.toLowerCase().indexOf('color') > -1) {
    return new ColorAnimation(config);
  } else {
    return new PixelAnimation(config);
  }
}

class ColorAnimation extends Animation {

  constructor(config) {
    super(config);
    const { start, end } = config;
    this.startVals = this.getValues(start);
    this.endVals = this.getValues(end);
  }

  get progression() {
    return this._progression;
  }

  set progression(val) {
    this._progression = val;
    const { startVals, endVals } = this;
    let values = [];
    for (let i = 0; i < startVals.length; i++) {
      const startVal = startVals[i];
      const endVal = endVals[i];
      values[i] = (endVal - startVal) * val + startVal;
    }
    this.setValues(values);
  }

  getValues(str) {
    let reg = /[-+]?\d?[\.]?\d+/g
    let result = null;
    let values = [];
    while (result = reg.exec(str)) {
      values.push(Number(result[0]));
    }
    return values;
  }

  setValues(values) {
    const { el, styleName, start } = this;
    let reg = /[-+]?\d?[\.]?\d+/g
    let idx = 0;
    const value = start.replace(reg, () => {
      if (idx === 3) {
        return values[idx];
      } else {
        return parseInt(values[idx++]);
      }
    });
    el.style[styleName] = value;
  }

}

class PixelAnimation extends Animation {

  constructor(config) {
    super(config);
    const { start, end } = config;
    this.startVals = this.getValues(start);
    this.endVals = this.getValues(end);
  }

  get progression() {
    return this._progression;
  }

  set progression(val) {
    this._progression = val;
    const { startVals, endVals } = this;
    let values = [];
    for (let i = 0; i < startVals.length; i++) {
      const startVal = startVals[i];
      const endVal = endVals[i];
      values[i] = (endVal - startVal) * val + startVal;
    }
    this.setValues(values);
  }

  getValues(str) {
    let reg = /[-+]?\d?[\.]?\d+/g
    let result = null;
    let values = [];
    while (result = reg.exec(str)) {
      values.push(Number(result[0]));
    }
    return values;
  }

  setValues(values) {
    const { el, styleName, start } = this;
    let reg = /[-+]?\d?[\.]?\d+/g
    let idx = 0;
    const value = start.replace(reg, () => values[idx++]);
    el.style[styleName] = value;
  }
}
