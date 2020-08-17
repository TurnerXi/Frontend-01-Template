
let effective = null;
const reactivities = new Map();

export function reactivity(object) {
  const effectivies = new Map();

  if (reactivities.has(object)) {
    return reactivities.get(object);
  }

  const handler = {
    get(target, prop) {
      if (prop === 'isProxy') {
        return true;
      } else if (prop === 'deps') {
        return effectivies;
      }

      if (typeof target[prop] === 'object') {
        return reactivity(target[prop]);
      }

      let deps = effectivies.get(prop)
      if (!deps) {
        deps = [];
        effectivies.set(prop, deps);
      }
      if (effective && deps.indexOf(effective) < 0) {
        deps.push(effective);
      }
      return target[prop];
    },
    set(target, prop, value) {
      target[prop] = value;
      if (effectivies.has(prop)) {
        for (const func of effectivies.get(prop)) {
          func.call(null);
        }
      }

      return true
    }
  }
  const proxy = new Proxy(object, handler);
  reactivities.set(object, proxy);
  reactivities.set(proxy, proxy);
  return proxy;
}

export function effect(func) {
  effective = func;
  func();
  effective = null
}