const getSearchString = (data) => {
  return Object.keys(data).map(key => `${key}=${encodeURIComponent(data[key])}`).join('&');
}

const getBodyString = function (contentType, data) {
  if (contentType === 'application/x-www-form-urlencoded') {
    return getSearchString(data);
  } else if (contentType === 'application/json') {
    return JSON.stringify(data);
  }
  // multipart/form-data
  // text/xml

  return '';
}

const handleCircular = (function () {
  var cache = [];
  var keyCache = []
  return function (key, value) {
    if (typeof value === 'object' && value !== null) {
      var index = cache.indexOf(value);
      if (index !== -1) {
        return '[Circular ' + keyCache[index] + ']';
      }
      cache.push(value);
      keyCache.push(key || 'root');
    }
    return value;
  }
})();

module.exports = {
  getBodyString,
  getSearchString,
  handleCircular
}