const path = require('path');
const http = require('http');
const fs = require('fs');
const unzipper = require('unzipper');

const server = http.createServer((req, res) => {
  console.log(`\x1B[32m${req.url}\x1B[0m`);
  let matched = req.url.match(/filename=([^&]+)/);
  let filename = matched && matched[1];
  if (!filename) {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('NOT FOUND');
    return;
  }
  let dir = path.resolve(__dirname, '../web-server/public');
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }

  let writeStream = unzipper.Extract({ path: dir })
  //fs.createWriteStream(path.resolve(dir, filename));
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