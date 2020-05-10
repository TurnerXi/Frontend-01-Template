# 每周总结

# 结构化程序设计

## JS 执行粒度

- JsContext -> Realm
- 宏任务
- 微任务（Promise）
- 函数调用（Execution Context）
- 语句/声明
- 表达式
- 直接量/变量/this

## 事件循环机制

1. 浏览器通过循环遍历任务队列依次执行各个任务

2. 每个任务可以称为一个微任务，多个微任务组成一个宏任务

3. 在 JSContext 中，当调用 evaluateScript 或 callWithArguments 时重新创建一个由微任务队列组成的宏任务。

4. Promise.then 是 JS 标准内的异步方法，运行会产生一个微任务加入当前任务队列

5. setTimeout、setInteval、requrestAnimation、Event 触发事件等属于浏览器提供方法，非 js 引擎内方法，当回调函数触发时执行 callWithArguments 进入 js 引擎创建一个新的任务队列执行回调函数。

### 伪代码

```
// 浏览器向js运行环境中注入setTimeout等函数
[context injectFunction @"setTimeout"] = function(callback,timeout){
  let begin = Date.now();
  while(Date.now()-begin<timeout){
    sleep(12);
  }
  // 调用回调方法进入js引擎执行回调
  [context callWithArguments @"callback"]
}

// 浏览器调用js引擎执行js代码或调用js函数
[context evaluateScript] || [context callWithArguments]
    // js引擎内部
    // 初始化微任务队列
    jsEngine.queue = []
    jsEngine.queue.push(job); // 入队
    while(jsEngin.queue.length>0){
      let job = jsEngin.queue.shift(); // 出队
      job.execute(function(callback){ // WHEN promise.then
          jsEngine.queue.push(callback) // 遇到enqueue时将回调函数入队
      });
    }
    exit; // 队列执行完毕，退出js引擎

```

## Realm

> 2018 开始引入 JS 标准的概念

### 什么是 Realm

Realm 表示 JS 运行环境中的一套完整的 JS 内置对象(Object/Array/Date...)

1. 每个 Realm 中会创建一整套内置对象
2. 不同 Realm 中的对象不相等(内存中存放位置不一样)
3. 不同 Realm 相互隔离，可以通过 window 对象进行通讯

### Realm 中有多少对象

1. 寻找 GlobalObject 上的所有属性

Global Object 定义：

```
  在控件进入任何执行上下文之前创建的。
  没有[[Construct]]内部方法；它不能与new运算符一起用作构造函数。
  没有[[Call]]内部方法；它不能作为函数调用。
  有一个[[Prototype]]内部插槽，其值取决于实现。
  除本规范中定义的属性外，还可能具有主机定义的属性。这可能包括其值为全局对象本身的属性。
```

1.1. Value Properties of the Global Object：

```
globalThis
Infinity
NaN
undefined
```

1.2. Function Properties of the Global Object：

```
eval
isFinite
isNaN
parseFloat
parseInt
URI Handling Functions
  decodeURI
  decodeURIComponent
  encodeURI
  encodeURIComponent ( uriCompone
```

1.3. Constructor Properties of the Global Object：

```
Array
ArrayBuffer
BigInt
BigInt64Array
BigUint64Array
Boolean
DataView
Date
Error
EvalError
Float32Array
Float64Array
Function
Int8Array
Int16Array
Int32Array
Map
Number
Object
Promise
Proxy
RangeError
ReferenceError
RegExp
Set
SharedArrayBuffer
String
Symbol
SyntaxError
TypeError
Uint8Array
Uint8ClampedArray
Uint16Array
Uint32Array
URIError
WeakMap
WeakSet
```

1.4. Other Properties of the Global Object

```
Atomics
JSON
Math
Reflect
```

2. 逐层遍历每个 Object 的属性直至找到所有 Object

## Execution Context

### 函数调用的过程：

> 执行上下文用于跟踪 ECMAScript 实现对代码的运行时分析。在任何时间点，每个实际执行代码的代理程序最多有一个执行上下文。这称为代理的运行执行上下文。

> 执行上下文堆栈用于跟踪执行上下文。运行中的执行上下文始终是此堆栈的顶部元素。每当控制权从与当前正在运行的执行上下文关联的可执行代码转移到与该执行上下文不关联的可执行代码时，都会创建一个新的执行上下文。新创建的执行上下文被压入堆栈，并成为正在运行的执行上下文。

```
// 初始化时创建执行上下文栈
Execution Context Stack = []

Running Execution Context = null;

Function.call = function(){
  // 调用开始时创建执行上下文
  Execution Context = {}

  // 入栈
  Execution Context Stack.push(Execution Context);
  // 将当前执行上下文作为运行时执行上下文
  Running Execution Context = Execution Context;

  // 开始真正的函数调用
  ===========Function calling===================
  Running Execution Context [x] = 1 ;// var x = 1;
  // another function call
  ...
  ===========Function called====================

  // 出栈
  Execution Context Stack.pop(Execution Context);
}

```

### Execution Context 包含属性

> 执行上下文包含跟踪其关联代码的执行进度所需的任何特定于实现的状态。

- code evaluation state

  代码执行位置（async 函数和 generator 函数使用）

- Function

  如果此执行上下文正在分析 Function 对象的代码，则此组件的值就是该 Function 对象。 如果上下文正在分析脚本或模块的代码，则该值为 null。

- Script or Module

  在脚本或模块执行时表示当前执行脚本或模块的引用，如果没有原始脚本或模块（如 InitializeHostDefinedRealm 中创建的原始执行上下文的情况），则该值为 null。

- Generator

  Generator 执行时表示 Generator 的引用

- Realm

  对资源引用的代码所需的 Realm Record

- LexicalEnvironment

  取变量值的环境

- VariableEnvironment

  取变量的环境

#### LexicalEnvironment

> 执行上下文中 LexicalExnirionment 和 VariableEnvironment 的每一项属性的都是 Environment Record

包含内容：

- this
- new.target
- super
- 变量

例 1：

```
var y=2;
function foo2(){
  console.log(y)
}
export foo2;
========================
Function: foo2
  Environment Records:
    z:3
  Code:
    console.log(y);
```

例 2:

```
var y=2;
function foo2(){
  var z = 3;
  return function foo3(){
    console.log(y,z);
  }
}
var foo3 = foo2();
export foo3;
===============================
// 作用域链
Function: foo3
  Environment Records:         Environment Records:
    z: 3                 =>      y: 2
    this:global
  Code:
    console.log(y,z)
```

#### Realm

包含代码所需的所有 Realm 资源

> 在 JS 中，函数表达式和对象直接量均会创建对象。

> 使用.做隐式转换也会创建对象。

> 这些对象也是有原型的，这些原型就是从 Realm 中获取的。

```
var obj = {};
=========================
Object.getPrototypeOf({}) => Object.prototype
其中Object.prototype来自Realm
```

## Environment Records

> 环境记录用于根据 ECMAScript 代码的词法嵌套结构来定义标识符与特定变量和函数的关联。

> 通常，环境记录与 ECMAScript 代码的某些特定语法结构相关联，例如 FunctionDeclaration，BlockStatement 或 TryStatement 的 Catch 子句。每次评估此类代码时，都会创建一个新的环境记录来记录由该代码创建的标识符绑定。

> 每个环境记录都有一个[[OuterEnv]]字段，该字段为 null 或对外部环境记录的引用。这用于对环境记录值的逻辑嵌套进行建模。

> （内部）环境记录的外部引用是对逻辑上围绕内部环境记录的环境记录的引用。外部环境记录当然可以具有自己的外部环境记录。

> 环境记录可以用作多个内部环境记录的外部环境。例如，如果一个 FunctionDeclaration 包含两个嵌套的 FunctionDeclaration，则每个嵌套函数的环境记录将以周围环境当前评估的环境记录作为其外部环境记录

### 环境记录的构成

- declarative Environment Record

  > 声明性环境记录用于定义 ECMAScript 语言语法元素（例如 FunctionDeclarations，VariableDeclarations 和 Catch 子句）的效果，这些元素直接将标识符绑定与 ECMAScript 语言值相关联。

  - function Environment Record

    > 函数环境记录对应于 ECMAScript 函数对象的调用，并且包含该函数内顶级声明的绑定。 它可以建立一个新的 this 绑定。 它还捕获支持超级方法调用所需的状态。

  - module Environment Record

    > 模块环境记录包含模块顶级声明的绑定。 它还包含模块显式导入的绑定。 其[[OuterEnv]]是全局环境记录。

- object Environment Record

  > 对象环境记录用于定义 ECMAScript 元素（如 WithStatement）的效果，这些元素将标识符绑定与某些对象的属性相关联。

- global Environment Record

  > 全局环境记录用于脚本全局声明。 它没有外部环境。 其[[OuterEnv]]为空。 它可能预装了标识符绑定，并且包括一个关联的全局对象，该对象的属性提供了某些全局环境的标识符绑定。 在执行 ECMAScript 代码时，可以将其他属性添加到全局对象，并且可以修改初始属性。

# Mile Stone

JS 部分课程结束

完成 JS 知识体系建立

后续使用 ECMA 标准完善各个知识点
