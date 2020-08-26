const path = require('path');
const https = require('https');
const http = require('http');
const fs = require('fs');
const unzipper = require('unzipper');

const CLIENT_ID = 'e878072eba08f524a865';
const CLIENT_SECRET = '648257f1a0dde1aeaed94da7736042561fe4753f';

const server = http.createServer((req, res) => {
  console.log(`\x1B[32m${req.url}\x1B[0m`);
  const urlObj = new URL(req.url, 'http://localhost');
  const search = urlObj.searchParams;
  if (!search.get('filename') || !search.get('code') || !search.get('state')) {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('NOT FOUND');
    return;
  }
  auth(search.get('code'), search.get('state')).then(() => {
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
  }).catch((e) => {
    res.writeHead(400, { 'Content-Type': 'text/plain' });
    res.end(e);
  });
})

server.listen(3010, () => {
  console.log('\x1B[32mlisten on 3010\x1B[0m');
})

async function auth(code, state) {
  if (Buffer.from(CLIENT_ID).toString('base64') !== state) {
    throw new Error('auth failed !');
  }
  const tokenStr = await request(`https://github.com/login/oauth/access_token?code=${code}&state=${state}&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}`, {
    headers: {
      Accept: 'application/json'
    }
  })
  const { access_token } = JSON.parse(tokenStr);
  const userinfo = await request('https://api.github.com/user', {
    headers: {
      Authorization: `token ${access_token}`
    }
  })
  return;
}

function request(url, opt) {
  return new Promise((resolve, reject) => {
    const req = https.request(url, opt);
    let chunk = ''
    req.on('data', (data) => {
      chunk += data;
    })
    req.on('end', () => {
      resolve(chunk)
    })
    req.on('error', (e) => {
      console.error(e);
      reject(e);
    })
    req.end();
  })
}