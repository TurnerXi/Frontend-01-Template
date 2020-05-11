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

module.exports = {
  getBodyString,
  getSearchString
}