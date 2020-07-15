
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
    this.offsetX = 0;
    this.isAutoplay = true;
    this.state = {
      activeIndex: 0,
    };
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
    console.log(123);
  }

  render() {
    const { datas } = this.props;
    const { activeIndex } = this.state;
    const len = datas.length;
    return (
      <div style={style} onMousedown={this.mousedown.bind(this)}>
        {datas.map((item, idx) => {
          let style = Object.assign({}, imageStyle);
          if (activeIndex === (idx + 1) % len) {
            style.transform = `translateX(calc(${-100 - 100 * idx}% - ${this.offsetX}px))`;
          } else if (activeIndex === idx) {
            style.transform = `translateX(calc(${- 100 * idx}% - ${this.offsetX}px))`;
          } else if (activeIndex === (idx - 1 + len) % len) {
            style.transform = `translateX(calc(${100 - 100 * idx}% - ${this.offsetX}px))`;
          }
          return (<img src={item} style={style} draggable={false} />)
        })}
      </div>
    )
  }

  startPlay() {
    const { datas } = this.props;
    let { activeIndex } = this.state;
    const container = this.$el;
    const images = container.children;
    const size = datas.length;
    if (!this.isAutoplay) {
      setTimeout(this.startPlay.bind(this), 3000);
    } else {
      this.offsetX += 10;
      if (this.offsetX >= 500) {
        this.offsetX = 0;
        activeIndex = (activeIndex + 1) % datas.length;
        Object.assign(this.state, { activeIndex });
        setTimeout(this.startPlay.bind(this), 3000);
      } else {
        const nextPosition = (activeIndex + 1) % size;

        let current = images[activeIndex];
        let next = images[nextPosition];
        current.style.transform = `translateX(calc(${- 100 * activeIndex}% - ${this.offsetX}px))`;
        next.style.transform = `translateX(calc(${- 100 * (nextPosition - 1)}% - ${this.offsetX}px)`;

        requestAnimationFrame(this.startPlay.bind(this));
      }
    }
  }

  mousedown(e) {
    this.offsetX = 0;
    let autoplay = this.isAutoplay;
    this.isAutoplay = false;

    const { datas } = this.props;
    let { activeIndex } = this.state;
    const container = this.$el;
    const images = container.children;
    const size = datas.length;

    let startX = e.pageX;
    let offsetX = this.offsetX;

    let position = activeIndex;
    let lastPosition = (position - 1 + size) % size;
    let nextPosition = (position + 1) % size;

    let current = images[position];
    let last = images[lastPosition];
    let next = images[nextPosition];

    current.style.transform = `translateX(${-100 * position}%)`;
    last.style.transform = `translateX(${- 100 * (lastPosition + 1)}%)`;
    next.style.transform = `translateX(${- 100 * (nextPosition - 1)}%)`;

    const mousemove = (e) => {
      offsetX = e.pageX - startX;
      current.style.transform = `translateX(calc(${- 100 * position}% + ${offsetX}px))`;
      last.style.transform = `translateX(calc(${- 100 * (lastPosition + 1)}% + ${offsetX}px))`;
      next.style.transform = `translateX(calc(${- 100 * (nextPosition - 1)}% + ${offsetX}px)`;
    }

    const mouseup = (e) => {
      let offset = 0;

      if (offsetX > container.offsetWidth / 2) {
        offset = 1;
      } else if (offsetX < -container.offsetWidth / 2) {
        offset = -1;
      }
      this.isAutoplay = autoplay;
      this.state.activeIndex = (position - offset + size) % size;

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