
import { TimeLine, Animation } from '../Animation/animation';

const style = {
  width: '500px',
  height: '300px',
  backgroundColor: '#ffff00',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  outline: '1px solid cyan',
  margin: 'auto'
}

const imageStyle = {
  width: '100%',
  height: '100%',
  display: 'inline-block'
}

export default class Carousel {
  constructor() {
    this.timer = null;
    this.isAutoplay = true;
    this.activeIndex = 0;
    this.state = {};
    this.config = {};
    this.events = {
      onChange: () => { },
      onClick: () => { },
      onHover: () => { },
      onSwipe: () => { },
      onResize: () => { },
      onDbclick: () => { }
    }
    this.props = Object.assign({
      loop: true,
      time: 2000,
      autoplay: true,
      color: 'rgba(255,255,255,.3)',
      forward: true,
      datas: []
    }, this.config, this.events);

    this.timeLine = new TimeLine;
  }

  next() {
    const { datas } = this.props;
    this.activeIndex = (this.activeIndex + 1) % datas.length;
  }

  prev() {
    const { datas } = this.props;
    this.activeIndex = (this.activeIndex - 1 + datas.length) % datas.length;
  }

  goto(num) {
    const { datas } = this.props;
    this.activeIndex = num < 0 ? 0 : num % datas.length;
  }

  play() {
    this.isAutoplay = true;
  }

  stop() {
    this.isAutoplay = false;
  }

  created() {
  }

  updated() {
    const { autoplay } = this.props;
    this.isAutoplay = autoplay;
  }

  render() {
    const { datas } = this.props;
    return (
      <div style={style} onMousedown={this.mousedown.bind(this)}>
        {datas.map(item => (<img src={item} style={imageStyle} draggable={false} />))}
      </div>
    )
  }

  startPlay() {
    const container = this.$el;
    const images = container.children;
    let position = this.activeIndex
    let nextPos = (position + 1) % images.length;
    this.timeLine = new TimeLine;
    let currentAni = Animation.create({
      el: images[position],
      styleName: 'transform',
      start: `translateX(${-100 * position}%)`,
      end: `translateX(${-100 - 100 * position}%)`,
      duration: 3
    })
    let nextAni = Animation.create({
      el: images[nextPos],
      styleName: 'transform',
      start: `translateX(${100 - 100 * nextPos}%)`,
      end: `translateX(${- 100 * nextPos}%)`,
      duration: 3
    })
    this.timeLine.add(currentAni);
    this.timeLine.add(nextAni);
    this.timeLine.start();

    setTimeout(() => {
      this.activeIndex = nextPos;
    }, 1500);
    setTimeout(() => {
      if (this.isAutoplay) {
        this.startPlay();
      }
    }, 3000);
  }

  mousedown(e) {
    let autoplay = this.isAutoplay;
    this.isAutoplay = false;
    this.timeLine.pause();

    const container = this.$el;
    const images = container.children;
    const size = images.length;

    let startX = e.pageX;
    let offsetX = 0;

    let position = this.activeIndex;
    let lastPosition = (position - 1 + size) % size;
    let nextPosition = (position + 1) % size;

    let current = images[position];
    let last = images[lastPosition];
    let next = images[nextPosition];

    current.style.transform = `translateX(calc(${- 100 * position}% + ${offsetX}px))`;
    last.style.transform = `translateX(calc(${- 100 * (lastPosition + 1)}% + ${offsetX}px))`;
    next.style.transform = `translateX(calc(${- 100 * (nextPosition - 1)}% + ${offsetX}px))`;

    const mousemove = (e) => {
      offsetX += e.pageX - startX;
      current.style.transform = `translateX(calc(${- 100 * position}% + ${offsetX}px))`;
      last.style.transform = `translateX(calc(${- 100 * (lastPosition + 1)}% + ${offsetX}px))`;
      next.style.transform = `translateX(calc(${- 100 * (nextPosition - 1)}% + ${offsetX}px))`;
      startX = e.pageX;
    }

    const mouseup = (e) => {
      let offset = 0;

      if (offsetX > container.offsetWidth / 2) {
        offset = 1;
      } else if (offsetX < -container.offsetWidth / 2) {
        offset = -1;
      }

      current.style.transform = `translateX(calc(${-100 - 100 * position}%))`;
      last.style.transform = `translateX(calc(${-100 - 100 * (lastPosition + 1)}%))`;
      next.style.transform = `translateX(calc(${-100 - 100 * (nextPosition - 1)}%))`;

      this.activeIndex = (this.activeIndex - offset + size) % size;

      position = this.activeIndex;
      lastPosition = (position - 1 + size) % size;
      nextPosition = (position + 1) % size;
      this.timeLine = new TimeLine;
      let currentAni = Animation.create({
        el: images[position],
        styleName: 'transform',
        start: `translateX(calc(${- 100 * position}% +${offsetX}px))`,
        end: `translateX(calc(${- 100 * position}% +0px))`,
        duration: .5
      })
      let lastAni = Animation.create({
        el: images[lastPosition],
        styleName: 'transform',
        start: `translateX(calc(${- 100 * (lastPosition + 1)}% +${offsetX}px))`,
        end: `translateX(calc(${- 100 * (lastPosition + 1)}% +0px))`,
        duration: .5
      })
      let nextAni = Animation.create({
        el: images[nextPosition],
        styleName: 'transform',
        start: `translateX(calc(${- 100 * (nextPosition - 1)}% +${offsetX}px))`,
        end: `translateX(calc(${- 100 * (nextPosition - 1)}% +0px))`,
        duration: .5
      })
      this.timeLine.add(currentAni);
      this.timeLine.add(lastAni);
      this.timeLine.add(nextAni);
      this.timeLine.start();

      if (autoplay) {
        setTimeout(() => {
          this.isAutoplay = autoplay;
          this.startPlay();
        }, 500);
      }

      container.removeEventListener('mousemove', mousemove, false);
      document.removeEventListener('mouseup', mouseup, false);
    }

    container.addEventListener('mousemove', mousemove, false);
    document.addEventListener('mouseup', mouseup, false);
  }

  mounted() {
    this.startPlay();
  }
}