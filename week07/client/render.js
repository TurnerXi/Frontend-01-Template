const images = require('images');
module.exports = function render(viewport, element) {
  if (element._computedStyle) {
    const { left, top, width, height } = element._computedStyle;
    const img = images(width, height);

    if (element._computedStyle['background-color']) {
      let color = element._computedStyle['background-color'];
      color.match(/rgb\((\d+), (\d+), (\d+)\)/);
      img.fill(Number(RegExp.$1), Number(RegExp.$2), Number(RegExp.$3));
      viewport.draw(img, left || 0, top || 0);
    }
  }

  if (element.children) {
    for (const child of element.children) {
      render(viewport, child);
    }
  }
}