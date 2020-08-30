var page = require('webpage').create();

page.open('http://localhost:3000', function (status) {
  if (status === 'success') {
    var title = page.evaluate(function () {
      return document.title;
    })
    console.log(title);
  }
  phantom.exit();
})