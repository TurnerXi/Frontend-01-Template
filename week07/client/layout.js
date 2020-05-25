module.exports = function layout(element) {
  if (!element.computedStyle) {
    return;
  }

  const elementStyle = getStyle(element);

  if (elementStyle.display !== 'flex') return;

  const items = element.children.filter(e => e.type === 'element');
  items.sort((a, b) => (a.order || 0) - (b.order || 0));

  const style = elementStyle;

  processDefaultValue(style);

  const properties = generateFlexBox(style);

  const { mainSize, crossSize } = properties;

  // autoSize
  let isAutoMainSize = false;
  if (!style[mainSize]) {
    style[mainSize] = 0;
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (!!item._computedStyle[mainSize]) {
        style[mainSize] += item._computedStyle[mainSize];
      }
    }
    isAutoMainSize = true;
  }

  const flexLines = getFlexLines(items, style, isAutoMainSize, properties);

  calcMainAxisProperty(flexLines, style, properties);

  let crossSpace = 0;
  if (!style[crossSize]) {
    style[crossSize] = 0;
    for (let i = 0; i < flexLines.length; i++) {
      const flexLine = flexLines[i];
      style[crossSize] += flexLine.crossSpace;
    }
  } else {
    crossSpace = style[crossSize];
    for (let i = 0; i < flexLines.length; i++) {
      crossSpace -= flexLines[i].crossSpace;
    }
  }

  calcCrossAxisProperty(flexLines, style, crossSpace, properties);

  console.log(items);
}

function getFlexLines(items, style, isAutoMainSize, properties) {
  const { mainSize, crossSize } = properties;
  let flexLine = [];
  let flexLines = [flexLine];
  let mainSpace = style[mainSize];
  let crossSpace = 0;
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const itemStyle = getStyle(item);

    if (itemStyle[mainSize] === null) {
      itemStyle[mainSize] = 0;
    }

    if (itemStyle.flex) {
      flexLine.push(item);

    } else if (style.flexWrap === 'nowrap' && isAutoMainSize) {
      mainSpace -= itemStyle[mainSize];
      if (itemStyle[crossSize]) {
        crossSpace = Math.max(crossSpace, itemStyle[crossSize]);
      }
      flexLine.push(item);

    } else {
      if (itemStyle[mainSize] > style[mainSize]) {
        itemStyle[mainSize] = style[mainSize];
      }

      if (mainSpace < itemStyle[mainSize]) {
        flexLine.mainSpace = mainSpace;
        flexLine.crossSpace = crossSpace;
        flexLine = [item];
        flexLines.push(flexLine);
        mainSpace = style[mainSize];
        crossSpace = 0;
      } else {
        flexLine.push(item);
      }

      if (itemStyle[crossSize]) {
        crossSpace = Math.max(crossSpace, itemStyle[crossSize]);
      }

      mainSpace -= itemStyle[mainSize];
    }
  }
  flexLine.mainSpace = mainSpace;
  if (style.flexWrap === 'nowrap' || isAutoMainSize) {
    flexLine.crossSpace = (style[crossSize] !== undefined) ? style[crossSize] : crossSpace;
  }
  else {
    flexLine.crossSpace = crossSpace;
  }

  return flexLines;
}

function calcMainAxisProperty(flexLines, style, { mainSize, mainBase, mainStart, mainEnd, mainSign }) {
  let mainSpace = 0;
  if (style.flexWrap === 'nowrap') {
    mainSpace = flexLines[0].mainSpace;
  }
  if (mainSpace < 0) {
    let scale = style[mainSize] / (style[mainSize] - mainSpace);
    let currentMain = mainBase;
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      let itemStyle = getStyle(item);
      if (itemStyle.flex) {
        itemStyle[mainSize] = 0;
      }
      itemStyle[mainSize] *= scale;
      itemStyle[mainStart] = currentMain;
      itemStyle[mainEnd] = itemStyle[mainStart] + mainSign * itemStyle[mainSize];
      currentMain = itemStyle[mainEnd];
    }
  } else {
    flexLines.forEach((line) => {
      let mainSpace = line.mainSpace;
      let flexTotal = 0;
      for (let i = 0; i < line.length; i++) {
        const item = line[i];
        let itemStyle = getStyle(item);
        if (itemStyle.flex !== null) {
          flexTotal += itemStyle.flex;
        }
      }
      if (flexTotal > 0) {
        let currentMain = mainBase;
        for (let i = 0; i < line.length; i++) {
          const item = line[i];
          let itemStyle = getStyle(item);
          if (item.flex) {
            itemStyle[mainSize] = item.flex * mainSpace / flexTotal;
          }
          itemStyle[mainStart] = currentMain;
          itemStyle[mainEnd] = itemStyle[mainStart] + mainSign * itemStyle[mainSize];
          currentMain = itemStyle[mainEnd];
        }
      } else {
        let step = 0;
        let currentMain = mainBase;
        if (style.justifyContent === 'flex-end') {
          currentMain = mainSpace * mainSign + mainBase;
        } else if (style.justifyContent === 'center') {
          currentMain = mainBase + mainSpace * mainSign / 2;
        } else if (style.justifyContent === 'space-between') {
          step = mainSign * mainSpace / (line.length - 1);
        } else if (style.justifyContent === 'space-around') {
          step = mainSign * mainSpace / (line.length - 1);
          currentMain = step / 2 + mainBase;
        }
        for (let i = 0; i < line.length; i++) {
          const item = line[i];
          let itemStyle = getStyle(item);
          itemStyle[mainStart] = currentMain;
          itemStyle[mainEnd] = itemStyle[mainStart] + mainSign * itemStyle[mainSize];
          currentMain = itemStyle[mainEnd] + step;
        }
      }
    });
  }
}


function calcCrossAxisProperty(flexLines, style, crossSpace, { crossSize, crossBase, crossEnd, crossStart, crossSign }) {
  let start = crossBase;
  let step = 0;
  if (style.alignContent === 'flex-end') {
    start = crossBase + crossSign * crossSpace;
    step = 0;
  } else if (style.alignContent === 'space-between') {
    start = crossBase;
    step = crossSpace / (flexLines.length - 1);
  } else if (style.alignContent === 'space-around') {
    start = crossBase + crossSign * crossSpace / (2 * flexLines.length);
    step = crossSpace / flexLines.length;
  } else if (style.alignContent === 'stretch') {
    start = crossBase;
    step = crossSpace / flexLines.length;
  } else if (style.alignContent === 'center') {
    start = crossBase + crossSign * crossSpace / 2;
    step = 0;
  }

  flexLines.forEach(flexLine => {
    for (let i = 0; i < flexLine.length; i++) {
      const item = flexLine[i];
      const itemStyle = getStyle(item);
      const alignItem = item.computedStyle.alignSelf || style.alignItems || 'flex-start';

      if (alignItem === 'flex-start') {
        itemStyle[crossStart] = start;
        itemStyle[crossEnd] = itemStyle[crossStart] + crossSign * itemStyle[crossSize];
      } else if (alignItem === 'flex-end') {
        itemStyle[crossStart] = start + crossSign * (flexLine.crossSpace - itemStyle[crossSize]);
        itemStyle[crossEnd] = item[crossStart] + crossSign * itemStyle[crossSize];
      } else if (alignItem === 'center') {
        let space = (flexLine.crossSpace - itemStyle[crossSize]) / 2
        itemStyle[crossStart] = start + crossSign * space;
        itemStyle[crossEnd] = itemStyle[crossStart] + crossSign * itemStyle[crossSize];
      } else if (alignItem === 'stretch') {
        itemStyle[crossSize] = itemStyle[crossSize] || flexLine.crossSpace;
        itemStyle[crossStart] = start;
        itemStyle[crossEnd] = itemStyle[crossStart] + crossSign * itemStyle[crossSize];
      }
    }
    start += crossSign * step;
  });
}

function getStyle(element) {
  if (!element._computedStyle) {
    element._computedStyle = {};
    for (let prop in element.computedStyle) {
      let p = element._computedStyle[prop] = element.computedStyle[prop].value;

      if (p.toString().match(/px$/) || p.toString().match(/^[0-9\.]+$/)) {
        p = parseInt(p);
      }

      Object.defineProperty(element._computedStyle, prop, {
        get() {
          return p;
        },
        set(value) {
          p = value;
          if (['width', 'height', 'top', 'left', 'bottom', 'right'].indexOf(prop) > -1) {
            element.computedStyle[prop] = value + 'px';
          }
        }
      })
    }
  }
  return element._computedStyle;
}

function processDefaultValue(style) {
  ['width', 'height'].forEach(size => {
    if (style[size] === '' || style[size] === 'auto') {
      style[size] = null;
    }
  });

  for (const key in style) {
    if (style.hasOwnProperty(key)) {
      const camelCaseKey = key.split('-').map((str, idx) => idx === 0 ? str : (str[0].toUpperCase() + str.substr(1))).join('')
      style[camelCaseKey] = style[key];
    }
  }


  if (!style.flexDirection || style.flexDirection === 'auto') {
    style.flexDirection = 'row';
  }
  if (!style.alignItems || style.alignItems === 'auto') {
    style.alignItems = 'stretch';
  }
  if (!style.justifyContent || style.justifyContent === 'auto') {
    style.justifyContent = 'flex-start';
  }
  if (!style.flexWrap || style.flexWrap === 'auto') {
    style.flexWrap = 'nowrap';
  }
  if (!style.alignContent || style.alignContent === 'auto') {
    style.alignContent = 'stretch';
  }
}

function generateFlexBox(style) {
  let mainSize, mainStart, mainEnd, mainSign, mainBase,
    crossSize, crossStart, crossEnd, crossSign, crossBase;
  if (style.flexDirection === 'row' || style.flexDirection === 'row-reverse') {
    mainSize = 'width';
    if (style.flexDirection === 'row') {
      mainStart = 'left';
      mainEnd = 'right';
      mainSign = +1;
      mainBase = 0;
    } else {
      mainStart = 'right';
      mainEnd = 'left';
      mainSign = -1;
      mainBase = style.width;
    }

    crossSize = 'height';
    crossStart = 'top';
    crossEnd = 'bottom';
  } else if (style.flexDirection === 'column' || style.flexDirection === 'column-reverse') {
    mainSize = 'height';
    if (style.flexDirection === 'column') {
      mainStart = 'top';
      mainEnd = 'bottom';
      mainSign = +1;
      mainBase = 0;
    } else {
      mainStart = 'bottom';
      mainEnd = 'top';
      mainSign = -1;
      mainBase = style.height;
    }

    crossSize = 'width';
    crossStart = 'left';
    crossEnd = 'right';
  }

  if (style.flexWrap === 'wrap-reverse') {
    let temp = crossStart;
    crossStart = crossEnd;
    crossEnd = temp;
    crossSign = -1;
    crossBase = style[crossSize];
  } else {
    crossBase = 0;
    crossSign = +1;
  }
  return {
    mainSize,
    mainStart,
    mainEnd,
    mainSign,
    mainBase,
    crossSize,
    crossStart,
    crossEnd,
    crossSign,
    crossBase
  }
}