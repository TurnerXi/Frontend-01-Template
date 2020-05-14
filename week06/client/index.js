const Request = require('./request.js');
const HtmlParser = require('./htmlParser.js');

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
  console.log(data);
})