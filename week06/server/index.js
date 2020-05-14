const http = require('http');
const fs = require('fs')
const path = require('path');

const server = http.createServer(function (req, resp) {
  var jsonData = "";
  req.on('data', function (chunk) {
    jsonData += chunk;
  });
  req.on('end', function () {
    resp.setHeader('Transfer-Encoding', 'chunked');
    try {
      const file = fs.readFileSync(path.resolve(__dirname, req.url === '/' ? './static/index.html' : `./static${req.url}`));
      resp.end(file);
    } catch (e) {
      console.error("cannot found file：" + e.path);
    }
  })
})

server.listen(443, function () {
  console.log('listening on 443');
})