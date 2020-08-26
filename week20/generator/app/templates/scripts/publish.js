const path = require('path');
const webpack = require('webpack');
const webpackConfig = require('../webpack.config.js');
const ProgressBarPlugin = require('progress-bar-webpack-plugin')
const archiver = require('archiver');
const https = require('https');
const http = require('http');
const child_process = require('child_process');
const argv = require('minimist')(process.argv.slice(2));

const CLIENT_ID = 'e878072eba08f524a865';
const STATE_CODE = Buffer.from(CLIENT_ID).toString('base64');

const compiler = webpack(webpackConfig);

compiler.apply(new ProgressBarPlugin({
  format: '  build [:bar] :percent (:elapsed seconds)',
  clear: false,
  width: 60
}))

const server = http.createServer((req, res) => {
  console.log(`\x1B[32m${req.url}\x1B[0m`);
  const urlObj = new URL(req.url, 'http://localhost');
  if (urlObj.pathname === '/') {
    const code = urlObj.searchParams.get('code');
    const state = urlObj.searchParams.get('state');
    if (state === STATE_CODE) {
      publish(code, state)
      res.end('okay');
      server.close();
    } else {
      res.end('auth failed !');
    }
    return;
  }
  res.end('');
})

server.listen(8080, () => {
  const redirectURI = encodeURIComponent('http://localhost:8080');
  const url = `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}^&redirect_uri=${redirectURI}^&state=${STATE_CODE}`
  child_process.exec(`start ${url}`);
  // console.log('\x1B[32mlisten on 8080\x1B[0m');
})

function publish(code, state) {
  compiler.run((err, stats) => {
    const { url } = argv;
    const req = http.request(url, {
      method: 'POST',
      path: `/?filename=package.zip&code=${code}&state=${state}`,
      headers: {
        'Content-Type': 'application/octet-stream'
      }
    }, (res) => {
      res.setEncoding('utf8');
      res.on('data', (chunk) => {
        console.log(chunk);
      });
    });

    var archive = archiver('zip', {
      zlib: { level: 9 } // Sets the compression level.
    });

    archive.on('error', function (err) {
      throw err;
    });

    archive.directory(path.resolve(__dirname, '../dist/'), false);
    archive.pipe(req);

    req.on('error', (e) => {
      console.error(`请求遇到问题: ${e.message}`);
    });

    archive.on('end', () => {
      req.end();
    })

    archive.finalize();
  });
}

