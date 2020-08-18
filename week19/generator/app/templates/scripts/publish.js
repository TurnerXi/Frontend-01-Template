const path = require('path');
const webpack = require('webpack');
const webpackConfig = require('../webpack.config.js');
const ProgressBarPlugin = require('progress-bar-webpack-plugin')
const archiver = require('archiver');
const http = require('http');
const argv = require('minimist')(process.argv.slice(2));

const compiler = webpack(webpackConfig);

compiler.apply(new ProgressBarPlugin({
  format: '  build [:bar] :percent (:elapsed seconds)',
  clear: false,
  width: 60
}))

compiler.run((err, stats) => {
  const { url } = argv;

  const req = http.request(url, {
    method: 'POST',
    path: '/?filename=package.zip',
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

