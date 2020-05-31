# 重学 CSS(一)

## 选择器语法

### 简单选择器

- \*(universal selector)
- div svg|a(Type selector)
- .cls(class selector)
- #id(identify selector)
- [attr=value](attribute selector)
- :hover(psuedo class selector)
- ::before(psuedo element selector)

### 选择器语法

![selector](../images/selector.png)

- 复合选择器
  - <简单选择器><简单选择器><简单选择器>
  - \*或 div 必须写在最前面
- 复杂选择器
  - <复合选择器><sp><复合选择器>
  - <复合选择器>">"<复合选择器>
  - <复合选择器>"~"<复合选择器>
  - <复合选择器>"+"<复合选择器>
  - <复合选择器>"||"<复合选择器>

### 选择器优先级

![specificity](../images/specificity.png)

```
A = count(#)
B = count(.)+count([])+count(:)
C = count(<>)+count(::)

count(\*) = 0
count(:is(*)||:not(*)||:has(*)) = count($1)
count(:nth-child(*)||:nth-last-child(*)) = count(:) + count($1)
count(:where) = 0

specificity = [inline,A,B,C]
```

### 伪类

- 链接/行为
  - :any-link
  - :link :visited
  - :hover
  - :active
  - :focus
  - :target(通过当前 url 的 hash 判断是否选中)
- 树结构
  - :empty
  - :nth-child()
  - :nth-last-child()
  - :first-child :last-child :only-child
    > 不推荐使用:nth-last-child/:last-child/:only-child，不能在开始元素入栈时判断是否选中
- 逻辑型
  - :not
  - :where :has

### 伪元素

- ::before
- ::after
- ::firstline(不能直接从源代码中判断是否 firstline, 不产生盒模型, 不能使用盒模型相关属性)
- ::firstletter(直接从源代码中可以判断是否 firstletter，可以产生盒模型)
