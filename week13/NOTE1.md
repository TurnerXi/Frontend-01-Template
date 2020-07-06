# 编程与算法训练（四）

## Proxy

> Proxy 对象用于定义基本操作的自定义行为（如属性查找、赋值、枚举、函数调用等）。

```
const p = new Proxy(target, handler)
```

- target

> 要使用 Proxy 包装的目标对象（可以是任何类型的对象，包括原生数组，函数，甚至另一个代理）。

- handler

> 一个通常以函数作为属性的对象，各属性中的函数分别定义了在执行各种操作时代理 p 的行为。

- handler.getPrototypeOf()

  Object.getPrototypeOf 方法的捕捉器。

- handler.setPrototypeOf()

  Object.setPrototypeOf 方法的捕捉器。

- handler.isExtensible()

  Object.isExtensible 方法的捕捉器。

- handler.preventExtensions()

  Object.preventExtensions 方法的捕捉器。

- handler.getOwnPropertyDescriptor()

  Object.getOwnPropertyDescriptor 方法的捕捉器。

- handler.defineProperty()

  Object.defineProperty 方法的捕捉器。

- handler.has()

  in 操作符的捕捉器。

- handler.get()

  属性读取操作的捕捉器。

- handler.set()

  属性设置操作的捕捉器。

- handler.deleteProperty()

  delete 操作符的捕捉器。

- handler.ownKeys()

  Object.getOwnPropertyNames 方法和 Object.getOwnPropertySymbols - 方法的捕捉器。

- handler.apply()

  函数调用操作的捕捉器。

- handler.construct()

  new 操作符的捕捉器。

## 练习

### reactivity 调色盘

[https://turnerxi.github.io/Frontend-01-Template/week13/palette.html](https://turnerxi.github.io/Frontend-01-Template/week13/palette.html)

### draggable && range

[https://turnerxi.github.io/Frontend-01-Template/week13/range.html](https://turnerxi.github.io/Frontend-01-Template/week13/range.html)
