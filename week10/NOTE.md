# CSSOM API

## Range API

> Range 接口表示一个包含节点与文本节点的一部分的文档片段。

- 创建方式

  - document.createRange
  - document.getSelection().getRangeAt(0)
  - new Range();

- 使用方式

```
// base
var range = new Range();
range.setStart(element,9);
range.setEnd(element,4);

// helper
range.setStartBefore();
range.setStartAfter();
range.setEndBefore();
range.setEndAfter();
range.selectNode();
range.selectNodeContents();

// modify
let fragment = range.extractContents(); // 摘取内容 创建fragment
range.insertNode(document.createTextNode('aaa'));
```

- 比较 DOM API

1. 以文本为单位操作 dom 元素，相比 domAPI 更加精确
2. extractContents 摘取元素内容在 fragment 中修改 dom，减少重排次数

## StyleSheet

#### 定义

```
[Exposed=Window]
interface StyleSheet {
  readonly attribute CSSOMString type;  // text/css
  readonly attribute USVString? href;   // link href
  readonly attribute (Element or ProcessingInstruction)? ownerNode;   // style / link Element
  readonly attribute CSSStyleSheet? parentStyleSheet;
  readonly attribute DOMString? title;
  [SameObject, PutForwards=mediaText] readonly attribute MediaList media;
  attribute boolean disabled; // 可写 ， 控制stylesheet是否生效
};

[Exposed=Window]
interface CSSStyleSheet : StyleSheet {
  readonly attribute CSSRule? ownerRule;
  [SameObject] readonly attribute CSSRuleList cssRules;
  unsigned long insertRule(CSSOMString rule, optional unsigned long index = 0);
  void deleteRule(unsigned long index);
};

[Exposed=Window]
interface CSSRule {
  attribute CSSOMString cssText;
  readonly attribute CSSRule? parentRule;
  readonly attribute CSSStyleSheet? parentStyleSheet;

  // the following attribute and constants are historical
  readonly attribute unsigned short type;
  const unsigned short STYLE_RULE = 1;
  const unsigned short CHARSET_RULE = 2;
  const unsigned short IMPORT_RULE = 3;
  const unsigned short MEDIA_RULE = 4;
  const unsigned short FONT_FACE_RULE = 5;
  const unsigned short PAGE_RULE = 6;
  const unsigned short MARGIN_RULE = 9;
  const unsigned short NAMESPACE_RULE = 10;
};

[Exposed=Window]
interface CSSStyleRule : CSSRule {
  attribute CSSOMString selectorText;
  [SameObject, PutForwards=cssText] readonly attribute CSSStyleDeclaration style;
};
```

### 示例

```
document.body.innerHTML = '<a>hello</a>';
document.head.appendChild(document.createElement('style'));
// 新增规则 insertRule
document.styleSheets[7].insertRule('a{color:green;}',0) //=> green
// 删除规则 deleteRule
document.styleSheets[7].deleteRule(0);  // => black
// 禁用规则 disabled = true
document.styleSheets[7].disabled = true
// 获取ruleList
document.styleSheets[7].cssRules // => [ CSSStyleRule, CSSMediaRule ...]
// 获取cssRule
document.styleSheets[7].cssRules[0].cssText // => "a { color: green; }"
// 获取selector
document.styleSheets[7].cssRules[0].selectorText // => 'a'
// 修改规则样式
document.styleSheets[7].cssRules[0].style.color = 'red' // => red
```

## getComputedStyle

window.getComputedStyle(elt, pseudoElt);

- elt 想要获取的元素
- pseudoElt 可选，伪元素
- 返回 CSSStyleDeclaration(living object)
  > document.styleSheets[7].cssRules[0].style 也返回 CSSStyleDeclaration 但两者不相等, 且 getComputedStyle 返回的 declaration 不可修改

## child window

```
let child = window.open('about:blank','_blank', 'width=100px,height=100px,left=10px;top=10px')
child.moveBy(50,50);
child.resizeBy(50,50);
child.moveTo(900,100);
child.resizeTo(999,200)
```

# CSSOM VIEW

## window scroll API

```
window.scrollX
window.scrollY
window.scroll(0,0) = window.scrollTo
winodw.scrollBy(0,10);
```

## Element scroll API

```
// 对应window的scrollAPI
Element.prototype.scrollLeft
Element.prototype.scrollTop
Element.prototype.scroll
Element.prototype.scrollBy = Element.prototype.scrollTo

// Element scrollAPI独有
Element.prototype.scrollHeight // 滚动区域总高度
Element.prototype.scrollWidth  // 滚动区域总宽度
```

## Element.prototype.getClientRects

> Element.getClientRects() 方法返回一个指向客户端中`每一个盒子`的边界矩形的`矩形集合`。每个 ClientRect 对象包含一组描述该边框`相对于视口`的只读属性——left、top、right 和 bottom

## Element.prototype.getBoundingClientRect

> Element.getBoundingClientRect() 方法返回元素的大小及其相对于视口的位置。返回的结果是包含`完整元素`的最小矩形，并且拥有 left, top, right, bottom, x, y, width, 和 height 这几个以像素为单位的只读属性用于描述整个边框。除了 width 和 height 以外的属性是`相对于视图窗口的左上角`来计算的。

## other

```
window.innerHeight  // 浏览器视窗高度
window.innerWidth   // 浏览器视窗宽度
=> document.documentElement.getBoundingClientRect();

window.outerWidth;  // 浏览器本身宽度
window.outerHeight; // 浏览器本身高度
```

# Data URLs

> Data URLs，即前缀为 data: 协议的 URL，其允许内容创建者向文档中嵌入小文件。

```
data:[<mediatype>][;base64],<data>
```

- mediatype 是个 MIME 类型的字符串，例如 "image/jpeg" 表示 JPEG 图像文件。如果被省略，则默认值为 text/plain;charset=US-ASCII

```
data:,ABC
data:,Hello%2C%20World!
data:text/plain;base64,SGVsbG8sIFdvcmxkIQ%3D%3D
data:text/html,%3Ch1%3EHello%2C%20World!%3C%2Fh1%3E
data:text/html,<script>alert('hi');</script>

<script>
let url = `data:text/html;base64,${btoa('Hellow, World!')}`
</script>

data:image/svg+xml,<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"> <circle cx="50" cy="50" r="50"/> </svg>

data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMTAwIDEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4gPGNpcmNsZSBjeD0iNTAiIGN5PSI1MCIgcj0iNTAiLz4gPC9zdmc+
```

# 作品

AI 五子棋：[https://turnerxi.github.io/Frontend-01-Template/week10/gobang.html](https://turnerxi.github.io/Frontend-01-Template/week10/gobang.html)
