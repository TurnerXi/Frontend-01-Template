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
      change: () => { },
      click: () => { },
      hover: () => { },
      swipe: () => { },
      resize: () => { },
      dbclick: () => { }
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

  init(attrs, children) {
    this.children = children;
    Object.assign(this.properties, attrs);
  }

  created() {
  }

  render() {
    const { autoplay, loop } = this.properties;
    return (
      <div style="width: 500px;height:300px;background-color:#ffff00;">
        hello world ! {loop ? '循环' : '非循环'}
      </div>
    )
  }

  mounted() {
  }
}