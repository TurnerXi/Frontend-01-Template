# 文件结构说明

```
├─client                          客户端目录
│      cssParser.js                 css内容解析器
│      htmlParser.js                html内容解析器
│      index.js                     入口文件
│      request.js                   Request封装
│      response.js                  Response封装
│      utils.js                     工具集合
│
├─fsm                             有限状态机作业
│      match.js                     有限状态机匹配'abababx'
│      pattern.js                   有限状态机匹配任意字符串
│      pattern2.js                  不使用状态机匹配任意字符串
│      test.js                      生成测试用例
│
├─images                          markdown使用图片
│      flow.png
│      HTML解析FSM.png
│
└─server                          服务端目录
    │  index.js
    │
    └─static                      静态资源目录
            index.html
```
