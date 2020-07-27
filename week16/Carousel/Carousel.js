
import { TimeLine, Animation } from '../Animation/animation';
import { enableGesture } from '../gesture';

const style = {
  width: '500px',
  height: '300px',
  backgroundColor: '#fff',
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
    this.timeLine.start();
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

    if (this.timer) {
      clearTimeout(this.timer);
    }
    this.timeLine.reset();
    this.timer = setTimeout(() => {
      this.startPlay();
    }, 3000);
  }

  render() {
    const { datas } = this.props;
    return (
      <div style={style} >
        {
          datas.map((item, idx) => enableGesture(
            <img src={item}
              style={imageStyle}
              onStart={(e) => this.onStart(e, idx)}
              onPanstart={(e) => this.onPanstart(e, idx)}
              onTap={(e) => this.onPressend(e, idx)}
              onPressend={(e) => this.onPressend(e, idx)}
              onPan={(e) => this.onPan(e, idx)}
              onPanend={(e) => this.onPanend(e, idx)}
            />
          ))
        }
      </div>
    )
  }

  mounted() {
    this.startPlay();
  }

  startPlay() {
    const container = this.$el;
    const images = container.children;
    let position = this.activeIndex
    let nextPos = (position + 1) % images.length;

    let currentAni = Animation.create({
      el: images[position],
      styleName: 'transform',
      start: `translateX(${-container.offsetWidth * position}px)`,
      end: `translateX(${- container.offsetWidth * (position + 1)}px)`,
      duration: 3,
      onMove: function (progress) {
        if (this.el === undefined) { console.log(this.el, position, progress, this.timeLine) }
        this.el.dataset.offset = -container.offsetWidth * position - progress * container.offsetWidth
      }
    })
    let nextAni = Animation.create({
      el: images[nextPos],
      styleName: 'transform',
      start: `translateX(${- container.offsetWidth * (nextPos - 1)}px)`,
      end: `translateX(${- container.offsetWidth * nextPos}px)`,
      duration: 3,
      onMove: function (progress) {
        if (this.el === undefined) { console.log(this.el, position, progress, this.timeLine) }
        this.el.dataset.offset = -container.offsetWidth * (nextPos - 1) - progress * container.offsetWidth
      }
    })

    this.timeLine.add(currentAni);
    this.timeLine.add(nextAni);

    this.timer = setTimeout(() => {
      this.activeIndex = nextPos;
      this.startPlay();
    }, 3000);
  }

  onStart() {
    if (this.timer) {
      clearTimeout(this.timer);
    }
    this.timeLine.pause();
  }

  onPanstart() {
    this.timeLine.reset();
  }

  onPan({ startX, startY, pageX, pageY }, idx) {
    const container = this.$el;
    const images = container.children;
    const size = images.length;

    let prePosition = (idx - 1 + size) % size;
    let curPosition = idx;
    let nextPosition = (idx + 1) % size;

    let preItem = images[prePosition];
    let curItem = images[curPosition];
    let nextItem = images[nextPosition];

    let offset = Number(curItem.dataset.offset) + container.offsetWidth * curPosition;
    let offsetX = pageX - startX + offset;
    preItem.style.transform = `translateX(${- container.offsetWidth * (prePosition + 1) + offsetX}px)`;
    curItem.style.transform = `translateX(${- container.offsetWidth * curPosition + offsetX}px)`;
    nextItem.style.transform = `translateX(${- container.offsetWidth * (nextPosition - 1) + offsetX}px)`;
  }

  onPressend(e, idx) {
    this.timeLine.resume();
    this.timer = setTimeout(() => {
      this.activeIndex = (this.activeIndex + 1) % this.props.datas.length;
      this.startPlay();
    }, 3000);
  }

  onPanend({ startX, startY, pageX, pageY, speedX, speedY, isFlick }, idx) {
    const container = this.$el;
    const images = container.children;
    const size = images.length;

    let prePosition = (idx - 1 + size) % size;
    let curPosition = idx;
    let nextPosition = (idx + 1) % size;

    let preItem = images[prePosition];
    let curItem = images[curPosition];
    let nextItem = images[nextPosition];

    let offset = Number(curItem.dataset.offset) + container.offsetWidth * curPosition;
    let offsetX = pageX - startX + offset;

    let direction = 0;
    if (isFlick) {
      direction = pageX > startX ? 1 : -1;
    } else {
      if (offsetX > container.offsetWidth / 2) {
        direction = 1;
      } else if (offsetX < -container.offsetWidth / 2) {
        direction = -1;
      }
    }

    this.timeLine.add(Animation.create({
      el: preItem,
      styleName: 'transform',
      start: `translateX(${- container.offsetWidth * (prePosition + 1) + offsetX}px)`,
      end: `translateX(${- container.offsetWidth * (prePosition + 1 - direction)}px)`,
      duration: .5
    }));

    this.timeLine.add(Animation.create({
      el: curItem,
      styleName: 'transform',
      start: `translateX(${- container.offsetWidth * curPosition + offsetX}px)`,
      end: `translateX(${- container.offsetWidth * (curPosition - direction)}px)`,
      duration: .5
    }));

    this.timeLine.add(Animation.create({
      el: nextItem,
      styleName: 'transform',
      start: `translateX(${- container.offsetWidth * (nextPosition - 1) + offsetX}px)`,
      end: `translateX(${- container.offsetWidth * (nextPosition - 1 - direction)}px)`,
      duration: .5
    }));
    this.timer = setTimeout(() => {
      this.activeIndex = (curPosition - direction + size) % size;
      this.startPlay();
    }, isFlick ? 3000 : 500);
  }
}