const Request = require('./request.js');
const HtmlParser = require('./htmlParser.js');
const { handleCircular } = require('./utils.js');
const htmlParser = new HtmlParser();

const request = new Request({
  host: '127.0.0.1',
  port: 443,
  headers: {
    'Content-Type': 'application/json'
  }
})

request.post('/', {
  name: 'TurnerXi'
}).then(data => {
  let dom = htmlParser.parse(data.body);
  console.log(JSON.stringify(dom, handleCircular, " "));
})