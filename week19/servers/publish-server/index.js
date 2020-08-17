const http = require('http');
const fs = require('fs');

const server = http.createServer((req, res) => {
  let matched = req.url.match(/filename=([^&]+)/);
  let filename = matched && matched[1];
  if (!filename) {
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('error');
    return;
  }
  let writeStream = fs.createWriteStream('./published/' + filename);
  req.pipe(writeStream);

  req.on('end', () => {
    writeStream.end();
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('okay');
  })
})

server.listen(3010, () => {
  console.log('\x1B[32mlisten on 3010\x1B[0m');
})