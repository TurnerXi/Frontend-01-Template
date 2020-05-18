# 浏览器工作原理(二)

## HTML 解析

### 状态机解析 html 内容

![HTML解析FSM](./images/HTML解析FSM.png)

1. 创建 FSM
2. 解析标签
3. 创建元素
4. 处理属性

### 构建 HTML 树结构

1. 创建栈
2. 遇到开始标签时入栈，遇到结束标签时出栈
3. 文本节点不入栈，多个文本节点需要合并
4. 将当前元素作为栈顶元素的子元素

## CSS 解析

## 收集 css 规则

1. 遇到 style 标签时，保存 css 规则
2. 调用 css Parser 分析 CSS 规则生成 ast 树

## 调用 css 计算

1. 在 emit startTag 时计算 css 样式而非在 emit endTag

   > 若在 endTag 时计算, 会使得在整个元素及子元素加载完成后才开始渲染样式

2. 选择器匹配

- css 词法[附一]
- css 语法[附二]

3. 优先级比较

# 有限状态机

- 每一个状态都是一个**机器**
  - 每个机器都是独立的单元，负责自身的数据处理逻辑
  - 所有机器输入一致
  - 每个机器本身没有状态，每个输入对应一个输出不受其他变量影响
- 每个机器知道下一个状态
  - 每个机器都有确定的下一个状态(Moore)
  - 每个机器根据输入决定下一个状态（Mealy）

# 附录

一、css Lexical scanner

```

%option case-insensitive

h [0-9a-f]
nonascii [\240-\377]
unicode \\{h}{1,6}(\r\n|[ \t\r\n\f])?
escape {unicode}|\\[^\r\n\f0-9a-f]
nmstart [_a-z]|{nonascii}|{escape}
nmchar [_a-z0-9-]|{nonascii}|{escape}
string1 \"([^\n\r\f\\"]|\\{nl}|{escape})_\"
string2 \'([^\n\r\f\\']|\\{nl}|{escape})_\'
badstring1 \"([^\n\r\f\\"]|\\{nl}|{escape})_\\?
badstring2 \'([^\n\r\f\\']|\\{nl}|{escape})_\\?
badcomment1 \/\*[^*]_\*+([^/_][^*]_\*+)_
badcomment2 \/\*[^*]_(\*+[^/_][^*]_)_
baduri1 url\({w}([!#$%&*-\[\]-~]|{nonascii}|{escape})_{w}
baduri2 url\({w}{string}{w}
baduri3 url\({w}{badstring}
comment \/\*[^_]_\*+([^/_][^*]_\*+)_\/
ident -?{nmstart}{nmchar}_
name {nmchar}+
num [0-9]+|[0-9]_"."[0-9]+
string {string1}|{string2}
badstring {badstring1}|{badstring2}
badcomment {badcomment1}|{badcomment2}
baduri {baduri1}|{baduri2}|{baduri3}
url ([!#$%&*-~]|{nonascii}|{escape})\*
s [ \t\r\n\f]+
w {s}?
nl \n|\r\n|\r|\f

A a|\\0{0,4}(41|61)(\r\n|[ \t\r\n\f])?
C c|\\0{0,4}(43|63)(\r\n|[ \t\r\n\f])?
D d|\\0{0,4}(44|64)(\r\n|[ \t\r\n\f])?
E e|\\0{0,4}(45|65)(\r\n|[ \t\r\n\f])?
G g|\\0{0,4}(47|67)(\r\n|[ \t\r\n\f])?|\\g
H h|\\0{0,4}(48|68)(\r\n|[ \t\r\n\f])?|\\h
I i|\\0{0,4}(49|69)(\r\n|[ \t\r\n\f])?|\\i
K k|\\0{0,4}(4b|6b)(\r\n|[ \t\r\n\f])?|\\k
L l|\\0{0,4}(4c|6c)(\r\n|[ \t\r\n\f])?|\\l
M m|\\0{0,4}(4d|6d)(\r\n|[ \t\r\n\f])?|\\m
N n|\\0{0,4}(4e|6e)(\r\n|[ \t\r\n\f])?|\\n
O o|\\0{0,4}(4f|6f)(\r\n|[ \t\r\n\f])?|\\o
P p|\\0{0,4}(50|70)(\r\n|[ \t\r\n\f])?|\\p
R r|\\0{0,4}(52|72)(\r\n|[ \t\r\n\f])?|\\r
S s|\\0{0,4}(53|73)(\r\n|[ \t\r\n\f])?|\\s
T t|\\0{0,4}(54|74)(\r\n|[ \t\r\n\f])?|\\t
U u|\\0{0,4}(55|75)(\r\n|[ \t\r\n\f])?|\\u
X x|\\0{0,4}(58|78)(\r\n|[ \t\r\n\f])?|\\x
Z z|\\0{0,4}(5a|7a)(\r\n|[ \t\r\n\f])?|\\z

%%

{s} {return S;}

\/\*[^*]_\*+([^/_][^*]_\*+)_\/ /_ ignore comments _/
{badcomment} /_ unclosed comment at EOF _/

"<!--"		{return CDO;}
"-->" {return CDC;}
"~=" {return INCLUDES;}
"|=" {return DASHMATCH;}

{string} {return STRING;}
{badstring} {return BAD_STRING;}

{ident} {return IDENT;}

"#"{name} {return HASH;}

@{I}{M}{P}{O}{R}{T} {return IMPORT_SYM;}
@{P}{A}{G}{E} {return PAGE_SYM;}
@{M}{E}{D}{I}{A} {return MEDIA_SYM;}
"@charset " {return CHARSET_SYM;}

"!"({w}|{comment})\*{I}{M}{P}{O}{R}{T}{A}{N}{T} {return IMPORTANT_SYM;}

{num}{E}{M} {return EMS;}
{num}{E}{X} {return EXS;}
{num}{P}{X} {return LENGTH;}
{num}{C}{M} {return LENGTH;}
{num}{M}{M} {return LENGTH;}
{num}{I}{N} {return LENGTH;}
{num}{P}{T} {return LENGTH;}
{num}{P}{C} {return LENGTH;}
{num}{D}{E}{G} {return ANGLE;}
{num}{R}{A}{D} {return ANGLE;}
{num}{G}{R}{A}{D} {return ANGLE;}
{num}{M}{S} {return TIME;}
{num}{S} {return TIME;}
{num}{H}{Z} {return FREQ;}
{num}{K}{H}{Z} {return FREQ;}
{num}{ident} {return DIMENSION;}

{num}% {return PERCENTAGE;}
{num} {return NUMBER;}

"url("{w}{string}{w}")" {return URI;}
"url("{w}{url}{w}")" {return URI;}
{baduri} {return BAD_URI;}

{ident}"(" {return FUNCTION;}

. {return \*yytext;}

```

二. css grammer

```
*: 0 or more
+: 1 or more
?: 0 or 1
|: separates alternatives
[ ]: grouping
The productions are:

stylesheet
  : [ CHARSET_SYM STRING ';' ]?
    [S|CDO|CDC]* [ import [ CDO S* | CDC S* ]* ]*
    [ [ ruleset | media | page ] [ CDO S* | CDC S* ]* ]*
  ;
import
  : IMPORT_SYM S*
    [STRING|URI] S* media_list? ';' S*
  ;
media
  : MEDIA_SYM S* media_list '{' S* ruleset* '}' S*
  ;
media_list
  : medium [ COMMA S* medium]*
  ;
medium
  : IDENT S*
  ;
page
  : PAGE_SYM S* pseudo_page?
    '{' S* declaration? [ ';' S* declaration? ]* '}' S*
  ;
pseudo_page
  : ':' IDENT S*
  ;
operator
  : '/' S* | ',' S*
  ;
combinator
  : '+' S*
  | '>' S*
  ;
unary_operator
  : '-' | '+'
  ;
property
  : IDENT S*
  ;
ruleset
  : selector [ ',' S* selector ]*
    '{' S* declaration? [ ';' S* declaration? ]* '}' S*
  ;
selector
  : simple_selector [ combinator selector | S+ [ combinator? selector ]? ]?
  ;
simple_selector
  : element_name [ HASH | class | attrib | pseudo ]*
  | [ HASH | class | attrib | pseudo ]+
  ;
class
  : '.' IDENT
  ;
element_name
  : IDENT | '*'
  ;
attrib
  : '[' S* IDENT S* [ [ '=' | INCLUDES | DASHMATCH ] S*
    [ IDENT | STRING ] S* ]? ']'
  ;
pseudo
  : ':' [ IDENT | FUNCTION S* [IDENT S*]? ')' ]
  ;
declaration
  : property ':' S* expr prio?
  ;
prio
  : IMPORTANT_SYM S*
  ;
expr
  : term [ operator? term ]*
  ;
term
  : unary_operator?
    [ NUMBER S* | PERCENTAGE S* | LENGTH S* | EMS S* | EXS S* | ANGLE S* |
      TIME S* | FREQ S* ]
  | STRING S* | IDENT S* | URI S* | hexcolor | function
  ;
function
  : FUNCTION S* expr ')' S*
  ;
/*
 * There is a constraint on the color that it must
 * have either 3 or 6 hex-digits (i.e., [0-9a-fA-F])
 * after the "#"; e.g., "#000" is OK, but "#abcd" is not.
 */
hexcolor
  : HASH S*
  ;

```
