
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
    this.state = {
      activeIndex: -1
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

  created() {
  }

  changeLoop() {
    this.state.activeIndex++;
  }

  render() {
    const { autoplay, loop, datas } = this.props;
    const { activeIndex } = this.state;
    const len = data.length;

    return (
      <div style={style} id="container">
        {datas.map((item, idx) => {
          let style = Object.assign({}, imageStyle);
          return (<img src={item} style={style} draggable={false} />)
        })}
      </div >
    )
  }

  mounted() {
    const container = this.$el;
    const images = container.children;
    let position = 0;
    let len = images.length;
    const nextPic = () => {
      const nextPosition = (position + 1) % images.length;

      let current = images[position];
      let next = images[nextPosition];

      current.style.transition = 'none';
      next.style.transition = 'none';
      current.style.transform = `translateX(${-100 * position}%)`;
      next.style.transform = `translateX(${100 - 100 * nextPosition}%)`;

      setTimeout(() => {
        current.style.transition = 'transform ease 3s';
        next.style.transition = 'transform ease 3s';
        current.style.transform = `translateX(${-100 - 100 * position}%)`;
        next.style.transform = `translateX(${- 100 * nextPosition}%)`;
        position = nextPosition;
        setTimeout(nextPic, 3000);
      }, 16);
    }

    // setTimeout(nextPic, 3000);

    function mousedown(e) {
      let startX = e.pageX;
      let offsetX = 0;

      let lastPosition = (position - 1 + len) % len;
      let nextPosition = (position + 1) % len;

      let current = images[position];
      let last = images[lastPosition];
      let next = images[nextPosition];

      current.style.transition = 'none';
      last.style.transition = 'none';
      next.style.transition = 'none';

      current.style.transform = `translateX(${-100 * position}%)`;
      last.style.transform = `translateX(${- 100 * (lastPosition + 1)}%)`;
      next.style.transform = `translateX(${- 100 * (nextPosition - 1)}%)`;

      function mousemove(e) {
        offsetX = e.pageX - startX;
        current.style.transform = `translateX(calc(${- 100 * position}% + ${offsetX}px))`;
        last.style.transform = `translateX(calc(${- 100 * (lastPosition + 1)}% + ${offsetX}px))`;
        next.style.transform = `translateX(calc(${- 100 * (nextPosition - 1)}% + ${offsetX}px)`;
      }

      function mouseup(e) {
        let offset = 0;

        if (offsetX > container.offsetWidth / 2) {
          offset = 1;
        } else if (offsetX < -container.offsetWidth / 2) {
          offset = -1;
        }

        current.style.transition = 'transform ease 1.5s';
        last.style.transition = 'transform ease 1.5s';
        next.style.transition = 'transform ease 1.5s';

        last.style.transform = `translateX(${- 100 * (lastPosition + 1 - offset)}%)`;
        current.style.transform = `translateX(${- 100 * (position - offset)}%)`;
        next.style.transform = `translateX(${- 100 * (nextPosition - 1 - offset)}%)`;

        position = (position - offset + len) % len;
        container.removeEventListener('mousemove', mousemove, false);
        document.removeEventListener('mouseup', mouseup, false);
      }

      container.addEventListener('mousemove', mousemove, false);
      document.addEventListener('mouseup', mouseup, false);
    }
    container.addEventListener('mousedown', mousedown, false);
  }
}