import { cubicBezier } from './cubicBezier.js';

const noop = () => { };

const BezierMap = {
  'ease': cubicBezier(.25, .1, .25, 1),
  'linear': cubicBezier(0, 0, 1, 1),
  'easeIn': cubicBezier(.42, 0, 1, 1),
  'easeOut': cubicBezier(0, 0, .58, 1),
  'easeInOut': cubicBezier(.42, 0, .58, 1),
}

export class TimeLine {
  constructor() {
    this.animations = new Set;
    this.addTimes = new Map;
    this.startTime = null;
    this.requrestID = null;
    this.pauseTime = null;
    this.state = 'inited'
  }

  add(animation, isSync = true) {
    this.animations.add(animation);
    let addTime = 0;
    if (this.state === 'playing' && isSync) {
      addTime = Date.now() - this.startTime;
    }
    this.addTimes.set(animation, addTime);
    if (this.requrestID === null) {
      this.tick();
    }
  }

  tick() {
    let t = Date.now() - this.startTime;
    for (const animation of this.animations) {
      const { duration, delay, timingFunc } = animation;
      const addTime = this.addTimes.get(animation);
      const progress = (t - addTime - delay) / duration;
      if (progress < 1) {
        animation.setProgression(timingFunc(progress));
      } else if (progress >= 1) {
        animation.setProgression(1);
      }

      if (progress >= 1) {
        this.animations.delete(animation);
        this.addTimes.delete(animation);
      }

    }
    if (this.animations.size) {
      this.requrestID = requestAnimationFrame(() => this.tick());
    } else {
      this.requrestID = null;
    }
  }

  start() {
    if (this.state !== 'inited') return;
    this.state = 'playing';
    this.startTime = Date.now();
    this.tick();
  }

  reset() {
    if (this.state === 'playing') {
      this.pause();
    }
    this.animations = new Set;
    this.addTimes = new Map;
    this.requrestID = null;
    this.state = 'playing';
    this.startTime = Date.now();
    this.pauseTime = null;
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
  constructor({ el, styleName, start, end, duration, timingFunc = 'ease', delay = 0, onMove = noop, onEnd = noop }) {
    this.el = el;
    this.styleName = styleName;
    this.start = start;
    this.end = end;
    this.duration = duration * 1000;
    this.finished = false;
    this.onEnd = onEnd;
    this.onMove = onMove;
    if (typeof timingFunc === 'function') {
      this.timingFunc = timingFunc;
    } else {
      this.timingFunc = BezierMap[timingFunc] || BezierMap['ease'];
    }
    this.delay = delay * 1000;
  }

  setProgression(val) {
    this.progression = val;
    this.onMove(val);

    if (val === 1) {
      this.finished = true;
      this.onEnd();
    }
  }

}

Animation.create = (config) => {
  if (config.styleName.toLowerCase().indexOf('color') > -1) {
    return new ColorAnimation(config);
  } else {
    return new NumberAnimation(config);
  }
}

class ColorAnimation extends Animation {

  constructor(config) {
    super(config);
    const { start, end } = config;
    this.startVals = this.getValues(start);
    this.endVals = this.getValues(end);
  }

  setProgression(val) {
    super.setProgression(val);
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
    let reg = /[-+]?\d*\.?\d+/g
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

class NumberAnimation extends Animation {

  constructor(config) {
    super(config);
    const { start, end } = config;
    this.startVals = this.getValues(start);
    this.endVals = this.getValues(end);
  }

  setProgression(val) {
    super.setProgression(val);
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
    let reg = /[-+]?\d*\.?\d+/g
    let result = null;
    let values = [];
    while (result = reg.exec(str)) {
      values.push(Number(result[0]));
    }
    return values;
  }

  setValues(values) {
    const { el, styleName, start } = this;
    let reg = /[-+]?\d*\.?\d+/g
    let idx = 0;
    const value = start.replace(reg, () => values[idx++]);
    el.style[styleName] = value;
  }
}
