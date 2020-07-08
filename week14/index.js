import Carousel from './Carousel';
export default () => {
  const root = document.getElementById('app');
  root.appendChild(
    <Carousel autoplay={false} loop={false}>
      abc
    </Carousel>
    // <div attr="123">
    //   <span>hello world!</span>
    //   <span>hello world!</span>
    //   <span>hello world!</span>
    //   <span>hello world!</span>
    //   <span>hello world!</span>
    // </div>
  )
}