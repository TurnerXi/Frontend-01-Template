import './index.css';
export default class App {
  constructor() {
  }


  render() {
    const data = [
      { title: '蓝猫', url: "https://static001.geekbang.org/resource/image/bb/21/bb38fb7c1073eaee1755f81131f11d21.jpg" },
      { title: '橘猫加白', url: "https://static001.geekbang.org/resource/image/1b/21/1b809d9a2bdf3ecc481322d7c9223c21.jpg" },
      { title: '狸花加白', url: "https://static001.geekbang.org/resource/image/b6/4f/b6d65b2f12646a9fd6b8cb2b020d754f.jpg" },
      { title: '橘猫', url: "https://static001.geekbang.org/resource/image/73/e4/730ea9c393def7975deceb48b3eb6fe4.jpg" }
    ]
    return (
      <div>
        <Tab data={data}>
          {record => (
            <TabPanel title={record.title}>
              <img src={record.url} alt={record.title} />
            </TabPanel>
          )}
        </Tab>
      </div>
    )
  }
}


export class Tab {
  constructor() {
    this.state = {
      activeIndex: 0
    }
    this.props = {
      data: []
    }
  }
  changeTab(idx) {
    this.state.activeIndex = idx;
  }
  render() {
    const panelTitles = this.props.data.map(item => item.title);
    const { activeIndex } = this.state;
    return (<div class="tab-list">
      <div class="tab-title-list">
        {panelTitles.map((item, idx) => {
          const clz = ['tab-title', idx === activeIndex ? 'active' : ''].filter(Boolean).join(' ');
          return (<div class={clz} onClick={() => this.changeTab(idx)}>{item}</div>)
        })}
      </div>
      {this.children[0](this.props.data.find((_, idx) => idx === activeIndex))}
    </div>)
  }
}

export class TabPanel {
  constructor() {
    this.props = {
      title: ''
    }
  }

  render() {
    return (<div class='tab-content'>{this.children}</div>);
  }
}