
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
      start: `translateX(${-container.offsetWidth * position}px)`,
      end: `translateX(${- container.offsetWidth * (position + 1)}px)`,
      duration: 3
    })
    let nextAni = Animation.create({
      el: images[nextPos],
      styleName: 'transform',
      start: `translateX(${- container.offsetWidth * (nextPos - 1)}px)`,
      end: `translateX(${- container.offsetWidth * nextPos}px)`,
      duration: 3
    })
    this.timeLine.add(currentAni);
    this.timeLine.add(nextAni);
    this.timeLine.start();

    this.timer = setTimeout(() => {
      this.activeIndex = nextPos;
      this.startPlay();
    }, 3000);
  }

  mousedown(e) {
    // let autoplay = this.isAutoplay;
    // this.isAutoplay = false;
    this.timeLine.pause();
    clearTimeout(this.timer);

    const container = this.$el;
    const images = container.children;
    const size = images.length;
    for (let i = 0; i < size; i++) {
      if (images[i] === e.target) {
        this.activeIndex = i;
      }
    }
    let startX = e.pageX;
    let offsetX = 0;

    let position2 = this.activeIndex;
    let position1 = (position2 - 1 + size) % size;
    let position3 = (position2 + 1) % size;
    let position4 = (position2 + 2) % size;

    let first = images[position1];
    let second = images[position2];
    let third = images[position3];
    let forth = images[position4];


    first.style.transform = `translateX(${- container.offsetWidth * (position1 + 1) + offsetX}px)`;
    second.style.transform = `translateX(${- container.offsetWidth * position2 + offsetX}px)`;
    third.style.transform = `translateX(${- container.offsetWidth * (position3 - 1) + offsetX}px)`;
    forth.style.transform = `translateX(${- container.offsetWidth * (position4 - 2) + offsetX}px)`;

    const mousemove = (e) => {
      offsetX += e.pageX - startX;
      first.style.transform = `translateX(${- container.offsetWidth * (position1 + 1) + offsetX}px)`;
      second.style.transform = `translateX(${- container.offsetWidth * position2 + offsetX}px)`;
      third.style.transform = `translateX(${- container.offsetWidth * (position3 - 1) + offsetX}px)`;
      forth.style.transform = `translateX(${- container.offsetWidth * (position4 - 2) + offsetX}px)`;
      startX = e.pageX;
    }

    const mouseup = (e) => {
      let offset = 0;

      if (offsetX > container.offsetWidth * 3 / 2) {
        offset = 2;
      } else if (offsetX > container.offsetWidth / 2) {
        offset = 1;
      } else if (offsetX < -container.offsetWidth * 3 / 2) {
        offset = -2;
      } else if (offsetX < -container.offsetWidth / 2) {
        offset = -1;
      }
      this.timeLine = new TimeLine;
      let firstAni = Animation.create({
        el: images[position1],
        styleName: 'transform',
        start: `translateX(${- container.offsetWidth * (position1 + 1) + offsetX}px)`,
        end: `translateX(${- container.offsetWidth * (position1 - offset + 1)}px)`,
        duration: .5
      })
      let secondAni = Animation.create({
        el: images[position2],
        styleName: 'transform',
        start: `translateX(${- container.offsetWidth * position2 + offsetX}px)`,
        end: `translateX(${- container.offsetWidth * (position2 - offset)}px)`,
        duration: .5
      })
      let thirdAni = Animation.create({
        el: images[position3],
        styleName: 'transform',
        start: `translateX(${- container.offsetWidth * (position3 - 1) + offsetX}px)`,
        end: `translateX(${- container.offsetWidth * (position3 - offset - 1)}px)`,
        duration: .5
      })
      let forthAni = Animation.create({
        el: images[position4],
        styleName: 'transform',
        start: `translateX(${- container.offsetWidth * (position4 - 2) + offsetX}px)`,
        end: `translateX(${- container.offsetWidth * (position4 - offset - 2)}px))`,
        duration: .5
      })
      this.timeLine.add(firstAni);
      this.timeLine.add(secondAni);
      this.timeLine.add(thirdAni);
      this.timeLine.add(forthAni);
      this.timeLine.start();
      this.activeIndex = (this.activeIndex - offset + size) % size;

      // if (autoplay) {
      this.timer = setTimeout(() => {
        // this.isAutoplay = autoplay;
        this.startPlay();
      }, 3000);
      // }

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