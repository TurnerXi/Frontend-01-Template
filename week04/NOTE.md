# 每周总结

## 事件循环机制

1. 浏览器通过循环遍历任务队列依次执行各个任务

2. 每个任务可以称为一个微任务，多个微任务组成一个宏任务

3. 在JSContext中，当调用evaluateScript或callWithArguments时重新创建一个由微任务队列组成的宏任务。

4. Promise.then是JS标准内的异步方法，运行会产生一个微任务加入当前任务队列

5. setTimeout、setInteval、requrestAnimation、Event触发事件等属于浏览器提供方法，非js引擎内方法，当回调函数触发时执行callWithArguments进入js引擎创建一个新的任务队列执行回调函数。

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

