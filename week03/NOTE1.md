# 每周总结

## Statement 语句

- Grammar

  - 简单语句
  - 组合语句
  - 声明

- Runtime
  - Completion Recored
  - Lexical Enviorment

### Completion Record 语句完成记录

#### [[type]] 完成类型

- normal
- break
- continue
- return
- throw

#### [[value]] 返回值

```
Number,String,Boolean,Object,undefined,Symbol,Null
```

#### [[target]] 返回位置

```
label
```

### 简单语句

- ExpressionStatement

```
a = 1 + 2;
```

- EmptyStatement

```
;
```

- DebuggerStatement

```
debugger;
```

- ThrowStatement

```
throw a;
```

- ContinueStatement

```
continue;
```

- BreakStatement

```
break;
```

- ReturnStatement

```
return a;
```

### 复合语句

- BlockStatement
  > [type=normal][value=x] [target=x]

```
{
  ...
}

例1：
{
    a:1
    console.log(12)
}
=>
12

其中a被当成label


例2：
{
  const a = 1;
}
console.log(a)
=>
Script snippet %2316:4 Uncaught ReferenceError: a is not defined
```

- IterationStatement

```
while()
do{}while();
for( ; ; ){}
for( in ){}
for( of ){}
for await( of )
```

> 对 const 和 let 的影响

```
for(let i=0;i<10;i++){
  let i = 0 ;
  console.log(i);
}

执行条件与执行体相当于父子作用域
{
  let i = 0;
  {
    let i = 1;
    console.log(i); => 1
  }
  console.log(i); => 0
}
```

> for of 针对[[iterator]]属性，可以用在所有带有 iterator 属性的对象上，基本用于 Array 和 generator

```
function* gen(){
  yield 1;
  yield 2;
  yield 3;
}

for(let i of gen()){
  console.log(i); => 1, 2, 3
}

let arr = [1,2,3];
for(let i of arr){
  console.log(i); => 1,2,3
}
```

- labeledStatement

```
a: for(let i=0;i<10;i++){
    for(let j =0 ;j<10;j++){
        if(j>=5){
            break a; => 结束外层循环
        }
        console.log(i,j) => 0,0 0,1 0,2 0,3 0,4
    }
}

可用于IteratorStatement、BreakStatement、ContinueStatement、SwitchStatement消费标签
```

- TryStatement

```
try{

}catch(e){

}

注意：**try和catch后面的大括号不是block，但会产生作用域**???，且不能省略
```

### 声明
- FunctionDeclaration
```
FunctionDeclaration :
  function BindingIdentifier ( FormalParameters ) {
  FunctionBody }
  [+Default] function ( FormalParameters ) { FunctionBody }
FunctionExpression :
  function BindingIdentifier opt ( FormalParameters ) {
  FunctionBody }
```
> 函数声明预处理
```
1. Let names be BoundNames of FormalParameterList.
2. Append to names the BoundNames of FunctionRestParameter.
3. Return names.
```
- GenerationDeclaration
- AsyncFunctionDeclaration
- AsyncGeneratorDeclaration
- VariableStatement
- ClassDeclaration
- LexicalDeclaration

> 待完善...

## Types 类型系统
- Number
- String
- Boolean
- Object
- Null
- Undefined
- Symbol

## Object 对象
### 面向对象概念
#### 面向对象本质：唯一性、状态、行为
```
对象三要素：
唯一性  ->    任何一个对象都是唯一的，与状态无关
状态    ->    描述对象
行为    ->    状态的改变
```
#### 面向对象架构：封装、继承、多态
```
封装=>封装、复用、解耦
> 封装性/内聚：屏蔽实现细节
> 复用性：封装的粒度合适、抽象合理
> 解耦：相关性低的对象解耦提高复用性

继承=>Class Based Oriented Object 的子系统

多态=>对象的动态性
```
> 每一个对象对应一份存储。 减小存储的手段——**享元模式(Flyweight)[1]**

#### Object-Class
> 采用“归类”或“分类”的原则区分对象
#### Object-Prototype
> 采用“相似”的方式描述对象，任何对象只需要描述与原型的区别，更加简单和方便
#### Object in Javascript
```
        property / Data Property
      /          \ Accessor Property
Object
      \ prototype
```

- Data Property 数据属性
  - [[value]]
  - writable
  - enumeralbe
  - configurable

- Accessor Property 访问性属性
  - get
  - set
  - enumerable
  - configurable

### ObjectAPI/Grammar
- 基本对象能力
  - {}
  - .
  - []
  - Object.defineProperty
> 创建对象，访问属性，设置属性访问性

- Prototype Based API(ES5)
  - Object.create 指定原型的基础上创建对象
  - Object.setPrototypeOf 改变对象原型
  - Object.getPrototypeOf 获取对象原型

- Class Based API(ES6)
  - class 创建类
  - extends 继承类
  - new 创建对象

- deprecated API （x）
  - new
  - function
  - prototype

### Special Object
> javascript 中有一些特殊的对象，这些对象带有除property和prototype之外的行为属性
- Function [[call]]
> function内置属性包含[[call]]和[[contructor]]，通过new或call可以产生不同的行为
- Array [[length]]
- Date [[]]





-


## 参考：
1. [享元模式](https://zh.wikipedia.org/wiki/%E4%BA%AB%E5%85%83%E6%A8%A1%E5%BC%8F)
> 享元模式（英语：Flyweight Pattern）是一种软件设计模式。它使用共享物件，用来尽可能减少内存使用量以及分享资讯给尽可能多的相似物件；它适合用于当大量物件只是重复因而导致无法令人接受的使用大量内存。通常物件中的部分状态是可以分享。常见做法是把它们放在外部数据结构，当需要使用时再将它们传递给享元。