# 每周总结

## 编程语言通识

### 语法分类

#### 非形式语言

中文、英文

#### 形式语言(乔姆斯基谱系[1])

| 文法 | 语言           | 自动机               | 产生式规则       |
| ---- | -------------- | -------------------- | ---------------- |
| 0-型 | 递归可枚举语言 | 图灵机               | α -> β（无限制） |
| 1-型 | 上下文相关语言 | 线性有界非确定图灵机 | αAβ -> αγβ       |
| 2-型 | 上下文无关语言 | 非确定下推自动机     | A -> γ           |
| 3-型 | 正则语言       | 有限状态自动机       | A -> aB A -> a   |

> 正则语言类包含于上下文无关语言类，上下文无关语言类包含于上下文相关语言类，上下文相关语言类包含于递归可枚举语言类。

- 0 型文法

```
设G = (VN,VT,P,S)， 如果每个产生式α->β，α属于VN∪VT且至少含有一个非终结符，β属于VN∪VT，则G是一个0型文法
特征：递归可枚举

VN: 终结符
VT: 非中介符
S: 一个非终结符，开始符号
P: 一个有限产生式集合
```

- 1 型文法

```
在0型文法基础上，每一个α->β都有β长度>=α长度
例：A->Bα符合1型文法
    αA->B不符合1型文法
```

- 2 型文法

```
在1型文法的基础上，再满足：每一个α->β都有α是非终结符
例：A->Ba符合2型文法要求
   Ab->Bab符合1型文法要求，但不符合2型文法要求，α=Ab, Ab不是一个非终结符，与上下文相关

计算机语言：js语法在**出现以后，java
```

- 3 型文法

```
在2型文法的基础上再满足：A->α|αB(右线性)或A->α|Bα(左线性)，且左线性与右线性不能同时出现在一个语法规则中。
例：A->ab,A->aB,B->a,B->c不符合3型文法
   A->a, A-Ba,B->a,B->cB不符合3型文法

计算机语言：js语法在**出现以前，
```

### 产生式(BNF-巴克斯·诺尔范式[2])

#### 范式规则

<符号> ::= <使用符号的表达式> | <使用符号的表达式>

> <符号>表示非终结符，‘|’表示或，从未在左端出现的符号为终结符

#### 定义语法(四则运算)

```
<Number> ::= "0" | "1" | "2" ....| "9"
<DecimalNumber> ::= "0" | (("1"|...|"9") <Number>*)

<PrimaryExpression> ::= <DecimalNumber> |
 "(" <LogicExpression> ")"

<MultiplicativeExpression> ::= <PrimaryExpression> |
  <MultiplicativeExpression> "*" <PrimaryExpression> |
  <MultiplicativeExpression> "/" <PrimaryExpression>

<AddtiveExpression> ::= <MultiplicativeExpression> |
  <AddtiveExpression> "+" <MultiplicativeExpression> |
  <AddtiveExpression> "-" <MultiplicativeExpression>

<LogicExpression> ::= <AdditiveExpression> |
  <LogicExpression> "||" <AdditiveExpression> |
  <LogicExpression> "&&" <AdditiveExpression>
```

### 图灵完备性

1. 命令式---图灵机

- goto
- if 和 while

2. 声明式---lambda

- 递归

### 动态与静态类型检查

1. 动态语言类型检查

- Runtime

2. 静态语言类型检查

- Compiletime

### 类型系统概念

- 动态类型系统与静态类型系统
- 强类型与弱类型
  > 区别：有隐式转换为弱类型，无隐式转换为强类型
- 复合类型
  - 结构体
    > 函数声明确定函数类型
  - 函数签名
    > 函数声明、参数列表、返回值类型确定函数类型
- 子类型
  - 逆变/协变
    > 父类型数组传入子类型元素-->协变
    > 函数声明为子类型参数，可以传入父类型参数-->逆变

### 一般命令式编程语言组成

- Atom(原子)
  - Identifier
  - Literal
- Expression(表达式)
  - Atom
  - Operator(操作符)
  - Punctuator(操作符+辅助运算符)
- Statement(语句)
  - Expression
  - Keyword
  - Punctuator
  - ...
- Structure(结构化)
  - Function
  - Class
  - Process
  - Namespace
  - ....
- Program(程序)
  - Program
  - Module
  - Package
  - Library

## Javascript

### 语法(Grammary Summary)

#### 词法(Lexical Grammary)

1. 源代码(SourceCharacter) ::

- Unicode 码点(any Unicode[6] code point)
  - LINE FEED (LF 换行) `\u000a`
  - SPACE (SP 空格) `\u0020`
  - NO-BREAK SPACE (NBSP 不换行空格) `\u00A0`
  - ...

2. 输入元素(InputElement) ::

- WhiteSpace
  - TAB (制表符)
  - VT (纵向制表符)
  - FF (FORM FEED分页符)
  - SP (空格)
  - NBSP (非换行空格)
  - ZWNBSP (零宽空格)
  - USP (unicode空格)
- LineTerminator
  - LF （LINE FEED换行） `\u000A` `\n`
  - CR (CARRIAGE RETURN回车) `\u000D` `\r`
  - LS
  - PS
- Comment
  - //
  - /\*\*/
- Token
  - 标志符名称(IdentifierName)
    - 标志符(Identifier)
      - 变量名
      - 属性名
      > 变量名不能是关键字，属性名可以是关键字
      ```
      语法结构：
      IdentifierName ::
        IdentifierStart
        IdentifierName IdentifierPart

      IdentifierStart ::
        UnicodeIDStart
        $
        _
        \ UnicodeEscapeSequence

      IdentifierPart ::
        UnicodeIDContinue
        $
        \ UnicodeEscapeSequence
        <ZWNJ> `零宽非连接符\u200C`
        <ZWJ>  `零宽连接符\u200D`

      UnicodeIDStart ::
        any Unicode code point with the Unicode property “ID_Start”

      UnicodeIDContinue ::
        any Unicode code point with the Unicode property “ID_Continue”

      例：
      var $abc; var _abc; var \u5389\u5bb3;
      var abc$; var abc\u5390; var abc\u200Dabc;var abc\u200Cabc
      反例：
      var \u200Aabc;var \uFEFF;var 123;var true;...

      最佳实践： 控制在ASCII范围内
      ```
    - 关键字(Keywords)
      - for
      - if
      - let
      - ...
    - 保留字(Future Resolved Keywords)
      - enum
  - 符号(Punctuator)
    - =
    - <
    - \>
    - ....
  - 直接量(Literal)
    - Number
      - IEEE 754 Double Float[8]
        - Sign (1位 符号位)
        - Exponent (11位 指数偏移值)
        - Fraction (52位 分数值)
        > Value = sign * exponent * fraction

        > 二进制浮点数是以符号数值表示法的格式存储——最高有效位被指定为符号位（sign bit）；“指数部分”，即次高有效的e个比特，存储指数部分；最后剩下的f个低有效位的比特，存储“有效数”（significand）的小数部分（在非规约形式下整数部分默认为0，其他情况下一律默认为1）。

        > 精度比较：转成整数
      - Grammar
        - (十进制)DecimalLiteral
          - 0
          - 0.
          - .2
          - 1e3
        - (2进制)BinaryIntegerLiteral `0b11 => 3`
        - (8进制)OctalIntegerLiteral  `0o11 => 9`
        - (16进制)HexIntegerLiteral   `0x11 => 17`
        ```
        NumericLiteral ::
          DecimalLiteral
          BinaryIntegerLiteral
          OctalIntegerLiteral
          HexIntegerLiteral

        DecimalLiteral ::
          DecimalIntegerLiteral . DecimalDigitsopt ExponentPartopt
          . DecimalDigits ExponentPartopt
          DecimalIntegerLiteral ExponentPartopt

        DecimalIntegerLiteral ::
          0
          NonZeroDigit DecimalDigitsopt

        DecimalDigits ::
          DecimalDigit DecimalDigits
          DecimalDigit

        DecimalDigit :: one of
          0 1 2 3 4 5 6 7 8 9

        NonZeroDigit :: one of
          1 2 3 4 5 6 7 8 9

        ExponentPart ::
          ExponentIndicator SignedInteger

        ExponentIndicator :: one of
          e E

        SignedInteger ::
          DecimalDigits
          + DecimalDigits
          - DecimalDigits

        BinaryIntegerLiteral ::
          0b BinaryDigits
          0B BinaryDigits

        BinaryDigits ::
          BinaryDigit
          BinaryDigits BinaryDigit

        BinaryDigit :: one of
          0 1

        OctalIntegerLiteral ::
          0o OctalDigits
          0O OctalDigits

        OctalDigits ::
          OctalDigit
          OctalDigits OctalDigit

        OctalDigit :: one of
          0 1 2 3 4 5 6 7

        HexIntegerLiteral ::
          0x HexDigits
          0X HexDigits

        HexDigits ::
          HexDigit
          HexDigits HexDigit

        HexDigit :: one of
          0 1 2 3 4 5 6 7 8 9 a b c d e f A B C D E F
        ```
    - String
      - Encoding
        - ASCII 0-198
        - Unicode
        - UCS U+0000-U+FFFF (Unicode BMP范围)
        - GB (ASCII+中文)
          - GB2312
          - GBK(GB13000)
          - GB18030
        - ISO-8859 (ASCII+国际标准字符)
        - BIG5 (ASCII+繁体中文)
        > 所有标准都包含ASCII字符
      - Grammar
        - 'abc'
        - "abc"
        - `abc`
        ```
         `the template grammar is ${a}`
         =>
         `the template grammar is ${
            a
          }`
        ```
      ```
      StringLiteral ::
        " DoubleStringCharacters(opt) "
        ' SingleStringCharacters(opt) '

      DoubleStringCharacters ::
        DoubleStringCharacter DoubleStringCharacters(opt)

      SingleStringCharacters ::
        SingleStringCharacter SingleStringCharacters(opt)

      DoubleStringCharacter ::
        SourceCharacter but not one of " or \ or LineTerminator
        <LS>
        <PS>
        \ EscapeSequence
        LineContinuation

      SingleStringCharacter ::
        SourceCharacter but not one of ' or \ or LineTerminator
        <LS>
        <PS>
        \ EscapeSequence
        LineContinuation

      LineContinuation ::
        \
        LineTerminatorSequence

      EscapeSequence ::
        CharacterEscapeSequence
        0 [lookahead ∉ DecimalDigit]
        HexEscapeSequence
        UnicodeEscapeSequence

      CharacterEscapeSequence ::
        SingleEscapeCharacter
        NonEscapeCharacter

      SingleEscapeCharacter ::
        one of ' " \ b f n r t v

      NonEscapeCharacter ::
        SourceCharacter but not one of EscapeCharacter or LineTerminator

      EscapeCharacter ::
        SingleEscapeCharacter
        DecimalDigit
        x
        u

      HexEscapeSequence ::
        x HexDigit HexDigit

      UnicodeEscapeSequence ::
        u Hex4Digits
        u{ CodePoint }

      Hex4Digits ::
        HexDigit HexDigit HexDigit HexDigit
      ```
    - Boolean
    - Object
    - Undefined
    - Null
    - Symbol

## 参考资料:

1. [乔姆斯基谱系](https://zh.wikipedia.org/wiki/%E4%B9%94%E5%A7%86%E6%96%AF%E5%9F%BA%E8%B0%B1%E7%B3%BB)
   > 乔姆斯基体系是由诺·乔姆斯基于 1956 年提出的，是刻画形式文法表达能力的一个分类谱系。
2. [巴克斯·诺尔范式(Backus Normal Form)](https://zh.wikipedia.org/wiki/%E5%B7%B4%E7%A7%91%E6%96%AF%E8%8C%83%E5%BC%8F)
   > BNF 是一种用于表示上下文无关文法的语言，上下文无关文法描述了一类形式语言。它是由约翰·巴科斯（John Backus）和彼得·诺尔（Peter Naur）首先引入的用来描述计算机语言语法的符号集。
3. [编译原理维基百科](https://zh.wikipedia.org/wiki/Category:%E7%BC%96%E8%AF%91%E5%8E%9F%E7%90%86)
4. [图灵机](https://zh.wikipedia.org/wiki/%E5%9B%BE%E7%81%B5%E6%9C%BA)：
   > 图灵机（英语：Turing machine），又称确定型图灵机，是英国数学家艾伦·图灵于 1936 年提出的一种将人的计算行为抽象掉的数学逻辑机，其更抽象的意义为一种计算模型，可以看作等价于任何有限逻辑数学过程的终极强大逻辑机器。
5. 图灵完备性
   > 在可计算性理论里，如果一系列操作数据的规则（如指令集、编程语言、细胞自动机）可以用来模拟单带图灵机，那么它是图灵完全的。
6. [Unicode](http://www.fileformat.info/info/unicode/index.htm)
   > Unicode 字典
7. [Unicode Wiki](https://zh.wikipedia.org/wiki/Unicode)
   > Unicode（中文：万国码、国际码、统一码、单一码）是计算机科学领域里的一项业界标准。它对世界上大部分的文字系统进行了整理、编码，使得电脑可以用更为简单的方式来呈现和处理文字。
8. [IEEE 754](https://zh.wikipedia.org/wiki/IEEE_754)
    > IEEE二进制浮点数算术标准（IEEE 754）是20世纪80年代以来最广泛使用的浮点数运算标准，为许多CPU与浮点运算器所采用。这个标准定义了表示浮点数的格式（包括负零-0）与反常值（denormal number），一些特殊数值（（无穷（Inf）与非数值（NaN）），以及这些数值的“浮点数运算符”；它也指明了四种数值舍入规则和五种例外状况（包括例外发生的时机与处理方式）。