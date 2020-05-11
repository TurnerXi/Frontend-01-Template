const net = require('net');
const Response = require('./response');
const {
  getBodyString,
  getSearchString
} = require('./utils');

module.exports = class Request {
  constructor(options) {
    const {
      method,
      host,
      port,
      path,
      headers
    } = options;
    this.method = method || 'GET';
    this.host = host || '127.0.0.1';
    this.port = port || 80;
    this.path = path || '/';
    this.base = `http://${this.host}:${this.port}${this.path.indexOf('/')===0?this.path:('/'+this.path)}`
    this.headers = headers || {};
    this.socket = null;
  }

  send({
    path,
    conf,
    callback
  }) {
    conf = conf || {};
    let {
      method,
      headers,
      data = {},
      body = {},
    } = conf;

    method = method || this.method;

    headers = Object.assign({
      'Content-Type': method === 'GET' ?
        'text/plain' : 'application/x-www-form-urlencoded',
    }, this.headers, headers);

    callback = callback || new Function();
    const url = new URL(path || '/', this.base);
    url.search = getSearchString(data);
    let bodyString = getBodyString(headers['Content-Type'], body);

    const doWrite = () => {
      this.socket.write([
        `${method} ${url.pathname} HTTP/1.1`,
        `Host: ${url.hostname}`,
        `Content-Type: ${headers['Content-Type']}`,
        `Content-Length: ${bodyString.length}`,
        '',
        bodyString
      ].join('\r\n'))
    }
    if (this.socket) {
      doWrite();
    } else {
      this.socket = net.createConnection({
        host: url.hostname,
        port: url.port
      }, doWrite);
    }

    return new Promise((resolve, reject) => {
      let buffer = '';
      this.socket.on('data', data => {
        buffer += data.toString();
        this.socket.end();
      });
      this.socket.on('end', () => {
        const parser = new Response.ResponseParser().receive(buffer);
        resolve(parser.response);
        callback.call(null, parser.response);
      });
    })
  }

  get(path, data, callback) {
    if (data && typeof data === 'function') {
      callback = data;
      data = null;
    }
    return this.send({
      path,
      conf: {
        method: 'GET',
        data
      },
      callback
    })
  }

  post(path, data, callback) {
    if (data && typeof data === 'function') {
      callback = data;
      data = null;
    }
    return this.send({
      path,
      conf: {
        method: 'POST',
        body: data
      },
      callback
    })
  }
}