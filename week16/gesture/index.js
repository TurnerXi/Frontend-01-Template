// let element = document.body;

const MOUSE_SYMBOL = Symbol('mouse');
const contexts = Object.create(null);

// enableGusture(element);

export function enableGesture(element) {

  window.addEventListener('contextmenu', e => e.target === element && e.preventDefault());
  document.addEventListener('dragstart', e => e.target === element && e.preventDefault());
  document.addEventListener('selectstart', e => e.target === element && e.preventDefault());
  document.addEventListener('touchmove', e => e.target === element && e.preventDefault(), { passive: false });

  if (document.body.ontouchstart !== null) {
    element.addEventListener('mousedown', (e) => {
      contexts[MOUSE_SYMBOL] = Object.create(null);

      start(e, contexts[MOUSE_SYMBOL]);

      let mousemove = (e) => {
        move(e, contexts[MOUSE_SYMBOL]);
      }

      let mouseup = (e) => {
        end(e, contexts[MOUSE_SYMBOL]);

        document.removeEventListener('mousemove', mousemove);
        document.removeEventListener('mouseup', mouseup);
      }

      document.addEventListener('mousemove', mousemove);
      document.addEventListener('mouseup', mouseup);
    })
  }

  element.addEventListener('touchstart', (e) => {
    for (const touch of e.changedTouches) {
      contexts[touch.identifier] = Object.create(null);
      start(touch, contexts[touch.identifier]);
    }
  })

  element.addEventListener('touchmove', (e) => {
    for (const touch of e.changedTouches) {
      move(touch, contexts[touch.identifier]);
    }
  })

  element.addEventListener('touchend', (e) => {
    for (const touch of e.changedTouches) {
      end(touch, contexts[touch.identifier]);
    }
  })

  element.addEventListener('touchancel', (e) => {
    for (const touch of e.changedTouches) {
      cancel(touch, contexts[touch.identifier]);
    }
  })


  const start = (event, context) => {
    element.dispatchEvent(Object.assign(new CustomEvent('start'), {
      startX: event.startX,
      startY: event.startY,
      pageX: event.pageX,
      pageY: event.pageY
    }))

    context.startX = event.pageX, context.startY = event.pageY;
    context.isTap = true;
    context.isPan = false;
    context.isPress = false;

    context.timeHandler = setTimeout(() => {
      if (!context.isTap) return;
      context.isTap = false;
      context.isPan = false;
      context.isPress = true;
      element.dispatchEvent(new CustomEvent('pressstart'));
    }, 500);
  }

  const move = (event, context) => {
    let dx = event.pageX - context.startX, dy = event.pageY - context.startY;
    if (dx ** 2 + dy ** 2 > 100 && !context.isPan) {
      context.isTap = false;
      context.isPan = true;
      context.isPress = false;
      context.moves = [];
      context.panStartX = event.pageX;
      context.panStartY = event.pageY;
      // console.log('panstart');
      element.dispatchEvent(Object.assign(new CustomEvent('panstart'), {
        startX: event.pageX,
        startY: event.pageY,
        pageX: event.pageX,
        pageY: event.pageY
      }))
    }

    if (context.isPan) {
      context.moves.push({ dx, dy, t: Date.now() });
      context.moves = context.moves.filter(record => Date.now() - record.t < 300);
      element.dispatchEvent(Object.assign(new CustomEvent('pan'), {
        startX: context.panStartX,
        startY: context.panStartY,
        pageX: event.pageX,
        pageY: event.pageY
      }))
    }
  }

  const end = (event, context) => {
    if (context.isTap) {
      element.dispatchEvent(Object.assign(new CustomEvent('tap'), {
        pageX: event.pageX,
        pageY: event.pageY
      }))
    } else if (context.isPan) {
      let dx = event.pageX - context.startX, dy = event.pageY - context.startY;
      const record = context.moves[0];
      let speedX = (dx - record.dx) / (Date.now() - record.t);
      let speedY = (dy - record.dy) / (Date.now() - record.t);
      let speed = Math.sqrt(speedX ** 2 + speedY ** 2);

      let isFlick = speed > 1;
      if (isFlick) {
        element.dispatchEvent(Object.assign(new CustomEvent('flick'), {
          startX: context.panStartX,
          startY: context.panStartY,
          pageX: event.pageX,
          pageY: event.pageY,
          speedX,
          speedY,
          speed
        }))
      }
      element.dispatchEvent(Object.assign(new CustomEvent('panend'), {
        startX: context.panStartX,
        startY: context.panStartY,
        pageX: event.pageX,
        pageY: event.pageY,
        speedX,
        speedY,
        speed,
        isFlick
      }))
    } else if (context.isPress) {
      element.dispatchEvent(new CustomEvent('pressend'))
    }
    clearTimeout(context.timeHandler);
  }

  const cancel = (event, context) => {
    console.log('cancel');
    clearTimeout(context.timeHandler);
  }

  return element;
}