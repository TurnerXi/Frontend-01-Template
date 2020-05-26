const fs = require('fs');
const https = require('https');
const cheerio = require('cheerio');

const standards = JSON.parse(fs.readFileSync('./css-standards.json', 'utf8'));

function request(url) {
  return new Promise((resolve, reject) => {
    var body = '';
    https.get(url, function (res) {
      console.log(`GET ${url} ${res.statusCode}`);
      res.on('data', function (d) {
        body += d;
      }).on('end', function () {
        resolve(body)
      });
    }).on('error', function (e) {
      console.error(`GET ${url} ${e.message}`)
      reject();
    }).end();
  })
}

void async function () {
  for (const standard of standards) {
    console.log(standard.name);
    let html = await request(standard.url);
    const $ = cheerio.load(html);
    console.log($('.propdef').html());
  }
}();