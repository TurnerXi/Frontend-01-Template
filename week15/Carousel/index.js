import Carousel from './Carousel';
export default class App {
  constructor() {
    this.state = {
      loop: true,
      time: 2000,
      autoplay: true,
      color: 'rgba(255,255,255,.3)',
      forward: true,
      datas: [
        "https://static001.geekbang.org/resource/image/bb/21/bb38fb7c1073eaee1755f81131f11d21.jpg",
        "https://static001.geekbang.org/resource/image/1b/21/1b809d9a2bdf3ecc481322d7c9223c21.jpg",
        "https://static001.geekbang.org/resource/image/b6/4f/b6d65b2f12646a9fd6b8cb2b020d754f.jpg",
        "https://static001.geekbang.org/resource/image/73/e4/730ea9c393def7975deceb48b3eb6fe4.jpg"
      ]
    }
  }

  toggleAutoPlay() {
    this.state.autoplay = !this.state.autoplay;
  }

  render() {
    const { autoplay, datas } = this.state;
    return (
      <div>
        <Carousel autoplay={autoplay} datas={datas} />
        {/* <button onClick={this.toggleAutoPlay.bind(this)} style="margin: 20px auto;display: block;">{autoplay ? '暂停' : '播放'}</button> */}
      </div>
    )
  }
}