# 每周总结

## 上周知识补充

### IEEE Float

依然没搞懂，待研究...

## 表达式(Expressions)

### Tree vs Priority

```
表达式生成树实现优先级
1+2*3
       +
      / \
     1   *
        / \
       2   3
```

### Left HandSide

#### MemberExpression

```
MemberExpression :
  PrimaryExpression                                       =>    a
  MemberExpression [ Expression ]                         =>    a[b]
  MemberExpression . IdentifierName                       =>    a.b
  MemberExpression TemplateLiteral                        =>    a`b`
  SuperProperty                                           =>    super[b] super.b
  MetaProperty                                            =>    new.target
  new MemberExpression Arguments                          =>    new Foo
```

- new.target
  输出被 new 实例化的函数体

```
function foo(){
  console.log(new.target);
}
foo() => undefined
new foo() => func
```

- `` a`b` ``
  template 作为参数调用 foo 函数,实际传入参数如下

```
function foo(){
  console.log(arguments);
}

var name = "xpc";
foo`Hello ${name}！`;

>>

[['Hello','!'], 'xpc']
```

- new Foo() 实例化包含两步，第一步 new Foo 创建实例，第二步(new Foo)()执行构造函数

```
new Foo() =>  (new Foo)()
new new Foo() => new (new Foo()) => new ((new Foo)())
```

- a.b a[b]
  MemberExpression 返回 Reference 类型, 在使用 delete 和 assign 时有体现

```
var foo = {bar : 1}

delete foo.bar => foo: {}
delete 1 => foo: {bar: 1}
```

#### CallExpression

```
CallExpression :
  CoverCallExpressionAndAsyncArrowHead  => foo()
  SuperCall                             => super()
  CallExpression Arguments              => foo()()
  CallExpression [ Expression ]         => foo()[b]
  CallExpression . IdentifierName       => foo().b
  CallExpression TemplateLiteral        => foo()`b`
```

##### 优先级

```
new foo()['b'] => new foo (MemberExpression) => new foo() (CallExpression) => new foo()['b'] (CallExpression)
```

### Right HandSide

#### Update Expressions

```
UpdateExpression :
  LeftHandSideExpression
  LeftHandSideExpression [no LineTerminator here] ++
  LeftHandSideExpression [no LineTerminator here] --
  ++ UnaryExpression
  -- UnaryExpression

右自增：左值表达式与++之间不能有++
例：
a
++
b
++
c
=>
a
++b
++c
```

#### Unary 单目运算符

```
UnaryExpression :
  UpdateExpression            => a++
  delete UnaryExpression      => delete a
  void UnaryExpression        => void a
  typeof UnaryExpression      => typeof a
  + UnaryExpression           => +a
  - UnaryExpression           => -a
  ~ UnaryExpression           => ~a (按位取反)
  ! UnaryExpression           => !a
  [+Await] AwaitExpression    => await a

```

- void

```
void anything => undefined
```

- typeof

```
typeof null => object
typeof function(){} => 'function'
typeof 1 => number
typeof 'b' => string
...
```

- !

```
!!1 === true
```

#### ExponentiationExpression \*\*指数运算

```
ExponentiationExpression :
  UpdateExpression ** ExponentiationExpression  => 右结合

例：
2 ** 3 ** 2
=>
2 ** (3 ** 2)
=>
2 ** 9
=> 512
```

#### Multiplicative 乘法

> \* / %

```
MultiplicativeExpression :
  ExponentiationExpression
  MultiplicativeExpression MultiplicativeOperator
  ExponentiationExpression
MultiplicativeOperator : one of
* / %
```

#### Addtive

> \+ -

```
AdditiveExpression :
  MultiplicativeExpression
  AdditiveExpression + MultiplicativeExpression
  AdditiveExpression - MultiplicativeExpression
```

#### Shift

> << >> >>>

```
ShiftExpression :
  ShiftExpression << AdditiveExpression
  ShiftExpression >> AdditiveExpression
  ShiftExpression >>> AdditiveExpression
```

#### RelationShip

> < > <= >= instanceof in

```
RelationalExpression :
  ShiftExpression
  RelationalExpression < ShiftExpression
  RelationalExpression > ShiftExpression
  RelationalExpression <= ShiftExpression
  RelationalExpression >= ShiftExpression
  RelationalExpression instanceof ShiftExpression
  [+In] RelationalExpression in ShiftExpression
```

#### Equality

> == != === !===

```
EqualityExpression :
  EqualityExpression == RelationalExpression
  EqualityExpression != RelationalExpression
  EqualityExpression === RelationalExpression
  EqualityExpression !== RelationalExpression
```

#### Bitwise

> & ^ |

```
BitwiseANDExpression :
  BitwiseANDExpression & EqualityExpression
BitwiseXORExpression :
  BitwiseXORExpression ^ BitwiseANDExpression
BitwiseORExpression :
  BitwiseORExpression | BitwiseXORExpression
```

#### Logical

> && ||

```
LogicalANDExpression :
  BitwiseORExpression
  LogicalANDExpression && BitwiseORExpression
LogicalORExpression :
  LogicalANDExpression
  LogicalORExpression || LogicalANDExpression
```

#### Conditional

> ? :

```
ConditionalExpression :
  LogicalORExpression ? AssignmentExpression : AssignmentExpression
```

> 注意： 逻辑运算和三目运算都有短路效果

### Left HandSide && RightHandSide

> Left HandSide 语法上可以为 MemberExpression、NewExpression、CallExpression， 运行时必须是 Reference

```
a = 1; //正确
a.b = 1; // 正确
foo() = 1; // 运行时错误
new Foo = 1; // 运行时错误
a+b = 1; // 语法错误
```

### 类型转换

|           | Number           | String           | Boolean   | Undefined | Null | Object | Symbol |
| --------- | ---------------- | ---------------- | --------- | --------- | ---- | ------ | ------ |
| Number    | -                | String           | 0->false  | -         | -    | Boxing | -      |
| String    | Number           | -                | ""->false | -         | -    | Boxing | -      |
| Boolean   | false->0 true->1 | "true" "false"   | -         | -         | -    | Boxing | -      |
| Undefined | NaN              | 'undefined'      | false     | -         | x    | x      | x      |
| Null      | 0                | 'null'           | false     | x         | -    | x      | x      |
| Object    | valueOf          | valueOf toString | true      | x         | x    | -      | x      |
| Symbol    | x                | x                | x         | x         | x    | Boxing | -      |

#### Boxing 装箱

- Number

```
new Number(1) => Object Number
Object(1) => Object Number
Number(1) => Primary Number
```

- String

```
new String('1') => Object String
Object('1') => Object String
String('1') => Primary String
```

- Boolean

```
new Boolean(true) => Object Boolean
Object(true) => Object Boolean
Boolean(true) => Primary Boolean
```

- Symbol

```
Object(Symbol(1)) => Object Symbol
Symbol(1) => Symbol

Object(Symbol(1)).constructor => Symbol() { }
Object(Symbol(1)) instanceof Symbol => true
Object.getPrototypeOf(Object(Symbol(1)))  === Symbol.prototype
```

#### UnBoxing 拆箱

- Number (valueOf)

```
1 + {} = "1[object Object]"
1 + {valueOf(){return 2}} => 3
1 + {[Symbol.toPrimitive](){return 1},valueOf(){return 2}} => 2
```

- String (valueOf toString)

```
"1" + {valueOf(){return 2}} => '12'
"1" + {toString(){return '3'}} => '13'
"1" + {valueOf(){return 2},toString(){return '3'}} => '12'
"1" + {[Symbol.toPrimitive](){return 1},valueOf(){return 2}} => '11'
"1" + {[Symbol.toPrimitive](){return },valueOf(){return 2}} => '1undefined'
```
