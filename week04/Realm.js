const globalProperties = [
  "Infinity",
  "NaN",
  "undefined",
  "Function",
  "Object",
  "eval",
  "isFinite",
  "isNaN",
  "parseFloat",
  "parseInt",
  "decodeURI",
  "decodeURIComponent",
  "encodeURI",
  "encodeURIComponent",
  "Array",
  "ArrayBuffer",
  "BigInt",
  "BigInt64Array",
  "BigUint64Array",
  "Boolean",
  "DataView",
  "Date",
  "Error",
  "EvalError",
  "Float32Array",
  "Float64Array",
  "Int8Array",
  "Int16Array",
  "Int32Array",
  "Map",
  "Number",
  "Promise",
  "Proxy",
  "RangeError",
  "ReferenceError",
  "RegExp",
  "Set",
  "SharedArrayBuffer",
  "String",
  "Symbol",
  "SyntaxError",
  "TypeError",
  "Uint8Array",
  "Uint8ClampedArray",
  "Uint16Array",
  "Uint32Array",
  "URIError",
  "WeakMap",
  "WeakSet",
  "Atomics",
  "JSON",
  "Math",
  "Reflect",
];

const Node = (function () {
  let id = 1;
  return function ({
    name,
    path,
    object,
    parent
  }) {
    this.id = id++;
    this.name = name;
    this.path = path;
    this.object = object;
    this.parent = parent;
    this.type = typeof object;
  }
})()

const set = new Set();
const queue = [];
const realms = [];

for (const p of globalProperties) {
  if (!!window[p] && (window[p] instanceof Object)) {
    queue.push(new Node({
      name: p,
      path: [p],
      object: window[p]
    }));
  }
}



while (queue.length > 0) {
  let current = queue.shift();
  if (set.has(current.object)) {
    if (current.object !== Function.prototype) {
      const objects = realms.map(item => item.object);
      const idx = objects.indexOf(current.object);
      if (idx > -1) {
        realms.push(Object.assign({}, current, {
          path: current.path.join('.'),
          ref: realms[idx].id
        }));
      }
    }
    continue;
  };
  set.add(current.object);

  const path = current.path.slice();
  realms.push(Object.assign({}, current, {
    path: current.path.join('.'),
  }));

  if (current.object instanceof Object) {

    if (current.object['__proto__'] != null) {
      queue.push(new Node({
        name: '__proto__',
        path: path.concat(['__proto__']),
        object: current.object.__proto__,
        parent: current.id
      }));
    }

    for (const p of Object.getOwnPropertyNames(current.object)) {
      const property = Object.getOwnPropertyDescriptor(current.object, p);
      if (property.hasOwnProperty('value') && !!property.value && (typeof property.value === 'object' || typeof property.value === 'function')) {
        queue.push(new Node({
          name: p,
          path: path.concat([p]),
          object: property.value,
          parent: current.id
        }))
      }
      if (property.hasOwnProperty('get') && !!property.value && (typeof property.value === 'object' || typeof property.value === 'function')) {
        queue.push(new Node({
          name: p,
          path: path.concat([p]),
          object: property.get,
          parent: current.id
        }))
      }
      if (property.hasOwnProperty('set') && !!property.value && (typeof property.value === 'object' || typeof property.value === 'function')) {
        queue.push(new Node({
          name: p,
          path: path.concat([p]),
          object: property.set,
          parent: current.id
        }));
      }
    }

  }
}