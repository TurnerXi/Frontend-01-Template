class Response {
  constructor({
    statusCode,
    statusText,
    headers,
    body,
    length
  }) {
    this.statusCode = statusCode;
    this.statusText = statusText;
    this.headers = headers;
    this.body = body;
    this.length = length;
  }
}

Response.ResponseParser = class {
  constructor() {
    this.currentStatus = this.HANDLING_STATUS_LINE;
    this.statusLine = "";
    this.headers = {};
    this.headerName = "";
    this.headerValue = "";
    this.bodyParser = null;
    this.bodyLength = 0
    this.bodyContent = '';
  }

  receive(string) {
    for (let i = 0; i < string.length; i++) {
      this.currentStatus.call(this, string.charAt(i));
    }

    return this;
  }

  HANDLING_STATUS_LINE(c) {
    if (c !== '\r') {
      this.statusLine += c;
    } else {
      this.currentStatus = this.HANDLING_STATUS_LINE_END;
    }
  }

  HANDLING_STATUS_LINE_END(c) {
    this.currentStatus = this.HANDING_HEADER_NAME;
  }

  HANDING_HEADER_NAME(c) {
    if (c === '\r') {
      this.currentStatus = this.HANDING_HEANDER_BLOCK_END;
    } else if (c !== ':') {
      this.headerName += c;
    } else {
      this.currentStatus = this.HANDING_HEADER_NAME_END;
    }
  }

  HANDING_HEADER_NAME_END(c) {
    if (c === ' ') {
      this.currentStatus = this.HANDING_HEADER_VALUE;
    }
  }

  HANDING_HEADER_VALUE(c) {
    if (c === '\r') {
      this.headers[this.headerName] = this.headerValue;
      this.headerName = '';
      this.headerValue = '';
      this.currentStatus = this.HANDING_HEADER_VALUE_END
    } else {
      this.headerValue += c;
    }
  }

  HANDING_HEADER_VALUE_END(c) {
    this.currentStatus = this.HANDING_HEADER_NAME
  }

  HANDING_HEANDER_BLOCK_END(c) {
    if (this.headers['Transfer-Encoding'] === 'chunked') {
      this.bodyParser = new TrunkedBodyParser();
    }
    this.currentStatus = this.HANDING_BODY;
  }

  HANDING_BODY(c) {
    this.bodyParser.receiveChar(c);
    if (this.bodyParser.isFinish) {
      this.bodyLength = this.bodyParser.length;
      this.bodyContent = this.bodyParser.content;
    }
  }

  get isFinish() {
    return this.bodyParser && this.bodyParser.isFinish;
  }

  get response() {
    this.statusLine.match(/HTTP\/1\.1 ([0-9]+) ([\s\S]+)/);
    return new Response({
      statusCode: RegExp.$1,
      statusText: RegExp.$2,
      headers: this.headers,
      body: this.bodyContent,
      length: this.bodyLength
    })
  }
}


class TrunkedBodyParser {
  constructor() {
    this.currentStatus = this.HANDING_LENGTH_LINE;
    this.length = 0;
    this.currentLen = 0;
    this.content = '';
    this.isFinish = false;
  }

  receiveChar(c) {
    this.currentStatus.call(this, c);
  }

  HANDING_LENGTH_LINE(c) {
    if (c === '\r') {
      this.currentStatus = this.HANDING_LENGTH_LINE_END;
    } else {
      this.currentLen *= 16;
      this.currentLen += parseInt(c, 16);
    }
  }

  HANDING_LENGTH_LINE_END() {
    if (this.currentLen != 0) {
      this.length += this.currentLen;
      this.currentStatus = this.HANDING_TRUNK;
    } else {
      this.isFinish = true;
    }
  }

  HANDING_TRUNK(c) {
    if (this.currentLen) {
      this.content += c;
      this.currentLen--;
    } else {
      this.currentStatus = this.HANDING_TRUNK_END;
    }
  }

  HANDING_TRUNK_END() {
    this.currentStatus = this.HANDING_LENGTH_LINE;
  }
}


module.exports = Response;