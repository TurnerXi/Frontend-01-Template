## Exotic Object - ECMAScript 特殊对象

### Ordinary Object - 常规对象

ECMAScript 中内置对象的实际语义是通过称为内部方法的算法指定的。
ECMAScript 引擎中的每个对象都与一组内部方法相关联，这些内部方法定义了其运行时行为。

| 基本内部方法          | 参数                                          | 说明                                                     |
| --------------------- | --------------------------------------------- | -------------------------------------------------------- |
| [[GetPrototypeOf]]    | ()-> Object\|Null                             | 返回对象的原型                                           |
| [[SetPrototypeOf]]    | ()-> Boolean                                  | 将对象与其他对象的相关联，将其他对象作为其原型以继承属性 |
| [[IsExtensible]]      | ()-> Boolean                                  | 判断对象是否可以新增额外的属性                           |
| [[PreventExtensions]] | ()->Boolean                                   | 控制是否可以向对象新增额外的属性                         |
| [[GetOwnProperty]]    | (propertykey)->Undefined\|Property Descriptor | 获取对象的属性描述器                                     |
| [[DefineOwnProperty]] | (propertyKey,PropertyDescriptor)->Boolean     | 创建或修改对象属性                                       |
| [[HasProperty]]       | (propertyKey)->Boolean                        | 判断对象自身包含或者继承了某个属性                       |
| [[Get]]               | (propertyKey,Receiver)->any                   | getter                                                   |
| [[Set]]               | (propertyKey,value,Receiver)->Boolean         | setter                                                   |
| [[Delete]]            | (propertyKey) -> Boolean                      | 删除属性                                                 |
| [[OwnPropertyKeys]]   | ()->List of propertyKey                       | 返回自身的属性 key                                       |

同时，所有作为 function 的对象包含[[Call]]和[[Constuctor]]两个插槽：

|               |                                |                                      |
| ------------- | ------------------------------ | ------------------------------------ |
| [[Call]]      | (any, a List of any) → any     | 函数调用，参数为 this 指针和传入参数 |
| [[Construct]] | (a List of any,Object)→ Object | 构造器                               |

所有实现这些插槽的对象称为常规对象，除此之外，需要实现额外插槽的对象称为特殊对象
> ECMA-262第9.1章定义了所有基本内部插槽的实现。

### 特殊对象

#### Bound Function 绑定函数

绑定函数是包装另一个函数对象的特殊对象, 与常规 Function 对象不同，不需要实现函数对象的内部插槽，而是要实现以下插槽：

|                         |                 |                                          |
| ----------------------- | --------------- | ---------------------------------------- |
| [[BoundTargetFunction]] | Callable Object | 被包装的函数对象                         |
| [[BoundThis]]           | Any             | 传入参数作为调用被包装函数的 this 指针   |
| [[BoundArguments]]      | List of Any     | 传入参数作为被包装函数调用时的第一个参数 |

> [Function].bind(any,...) -> [BoundFunction]

#### Array 数组对象

Array 对象是一个特殊对象，它对数组索引属性键进行特殊处理。其属性名称是数组索引的属性也称为元素。<br>
每个 Array 对象都有一个不可配置的“length”属性，该属性的值始终是一个小于 232 的非负整数。<br>
“length”属性的值在数值上大于每个其名称为数组索引的属性的名称；每当创建或更改 Array 对象的自身属性时，都会根据需要调整其他属性以保持该不变性。<br>
具体来说，每当添加自己的名称为数组索引的属性时，如果需要，将“length”属性的值更改为比该数组索引的数值大一；<br>
并且只要更改“length”属性的值，就会删除名称为数组索引且其值不小于新长度的每个自己的属性。<br>
此约束仅适用于 Array 对象自身的属性，不受可能从其原型继承的“长度”或数组索引属性的影响。<br>
Array 对象为[[DefineOwnProperty]]内部方法提供了替代定义来支持 length 属性的变化。

#### String 字符串对象

字符串对象封装了字符串值并暴露字符串每个元素的虚拟整数索引数据属性。<br>
字符串对象始终具有数据属性名为“length”的值，其值为封装的字符串中元素的数量。<br>
字符串对象数据属性和“length”属性不可写且不可配置。<br>
字符串对象除了具有与普通对象相同的内部插槽以为，还具有[[StringData]]内部插槽。<br>
字符串对象为[[GetOwnProperty]] 、 [[DefineOwnProperty]]和[[OwnPropertyKeys]] 内部方法提供替代定义。

### Arguments 参数对象

参数对象在函数调用时提供数组索引属性映射到形式参数<br>
参数对象具有与普通对象相同的内部插槽。<br>
参数对象同时具有额外的[[ParameterMap]]内部插槽。<br>
参数对象对 [[GetOwnProperty]] 、 [[DefineOwnProperty]] 、 [[Get]] 、 [[Set]]、[[Delete]]进行重新定义。

### Integer-Indexed 整数索引

整数索引是一个字符串值的属性键，它是规范的数字字符串<br>
整数索引具有与普通对象相同的内部插槽。<br>
整数索引同时具有额外的[[ViewedArrayBuffer]] 、[[ArrayLength]] 、[[ByteOffset]] 、[[TypedArrayName]] <br>
整数索引象对[[GetOwnProperty]] 、[[HasProperty]] 、[[DefineOwnProperty]] 、 [[Get]] 、 [[Set]] 、[[OwnPropertyKeys]]进行重新定义。

### Module Namespace 模块名称空间

模块名称空间暴露了从 ECMAScript 模块导出的绑定。<br>
模块名称空间字符串键与导出模块之间存在一对一的对应关系。<br>
模块名称空间每个导出的属性具有数据属性{[[[Writable]]：true，[[Enumerable]]：true，[[Configurable]]：false}。<br>
模块名称空间对象是不可扩展的。<br>
模块名称空间具有额外的[[Module]] 、[[Exports]]、[[Prototype]]。<br>
模块名称空间为所有内部方法提供替代定义，除了[[GetPrototypeOf]]。

### Immutable Prototype 不可变原型

不可变原型具有额外的[[Prototype]]，且一旦被初始化就不可改变。<br>
不可变原型除了重新定义[[SetPrototypeOf]]外，与常规对象具有相同的内部插槽。
