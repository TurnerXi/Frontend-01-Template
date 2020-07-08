const noop = () => { }

export default class Carousel {
  constructor(config) {
    this.activeIndex = -1;
    this.config = config;
    this.properties = Object.assign({
      loop: true,
      time: 2000,
      autoplay: true,
      color: 'rgba(255,255,255,.3)',
      forward: true,
      datas: []
    }, config);
    this.events = {
      change: noop,
      click: noop,
      hover: noop,
      swipe: noop,
      resize: noop,
      dbclick: noop
    }
  }

  next() {

  }

  prev() {

  }

  goto(num) {
    this.activeIndex = num;
  }

  play() {
    this.properties.autoplay = true;
  }

  stop() {
    this.properties.autoplay = false;
  }

  init(attrs) {
    Object.assign(this.properties, attrs);
  }



  created() {
  }

}