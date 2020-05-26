# 浏览器工作原理(三)

## 排版 - Flexible

### 概念

MainAxis: 主轴
以 Flex 排版方向作为主轴

CrossAxis：交叉轴
垂直于主轴的房间为交叉轴

Flex 轴相关属性

- flex-direction: row/row-reverse
  - MainAxis: width x left right
  - CrossAxis: height y top bottom
- flex-direction: column/column-reverse
  - MainAxis: height y top bottom
  - CrossAxis: width x left right

### FlexBox

![FlexBox](../documents/images/flex_terms.png)

### Flexbox 的关键特性

- flex 布局中的项目可以增大和缩小。
- 可以将空间（Space）分配到项目本身、项目之间或项目周围。
- 可以对齐主轴或交叉轴上的项目

#### Flex 容器相关属性

##### 布局

- flex-direction：row(default)|row-reverse|column|column-reverse
  > 定义主轴的方向
- flex-wrap: nowrap(default)|wrap|wrap-reverse
  > 定义是否允许子元素换行
- flex-flow: row nowrap(default)
  > flex-direction 和 flex-wrap 的缩写

```
Formal syntax: <'flex-direction'> || <'flex-wrap'>
```

##### 排版

- align-content: normal(default) | center | start | end |flex-start | flex-end | space-between | space-around |space-evenly | stretch | baseline
  > 沿交叉轴分配整体剩余空间，对 flex-wrap：nowrap 无效
- align-items：normal(default) | center | start | end |flex-start | flex-end | stretch
  > 沿交叉轴分配所有行内剩余空间
- justify-content：normal(default) | center | flex-start | flex-end | space-between | space-around
  > 沿主轴分配剩余空间

#### Flex 元素相关属性

- flex-grow: 0(default) | <number>
  > 指定元素在主轴上的增长系数（按比例增长）
- flex-shrink: 1(default) | <number>
  > 指定元素在主轴上的收缩规则（按比例收缩，只在容器宽度小于所有元素宽度之和时生效！！！）
- flex-basis：auto(default) | <'width'>
  > 指定元素在主轴上的初始盒子大小，优先级高于 width|height！！！！
- flex：none | [ <'flex-grow'> <'flex-shrink'>? || <'flex-basis'> ]
  > 简写属性，用来设置 flex-grow, flex-shrink 与 flex-basis。
- align-self: normal(default) | center | start | end |flex-start | flex-end | stretch
  > 指定元素在交叉轴上的行内对齐位置，覆盖已有的 align-items 的值
- order: 0(default) | <integer>
  > 指定元素在布局时的顺序

> 注：以去掉兼容性不好的属性

### 步骤

1. 处理属性
2. 收集元素入行

- 根据主轴尺寸，把元素分行
- 若设置了 no-wrap, 则强行分配进第一行

3. 计算主轴

- 找出所有 Flex 元素
- 把主轴方向的剩余尺寸按比例分配给这些元素
- 若剩余空间为负数，所有 flex 元素 flex 为 0，等比压缩剩余元素

4. 计算交叉轴

- 根据每一行中最大元素尺寸计算行高
- 根据行高 flex-align 和 item-align，确定元素具体位置

## 渲染

采用 images 工具绘制 dom 的宽、高、left、top、backgroundColor

## 番外

绘制文字想法：使用 text-to-svg 引用字体库将文字转成 svg -> 使用 svg-to-png 将 svg 转成 png -> 使用 lwip/sharp 等图像库按照位置大小拼合图像
