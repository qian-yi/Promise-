### Promise源码实现   --- 各分支实现步骤汇总

- ```css
  分支一：首先明白实现一个Promise 需要些什么基本的核心逻辑
  	1. Promise 就是一个类  在执行这个类的时候  需要传递一个执行器进去 执行器会立即执行
  	2. Promise 中有三种状态 分别为 成功(fulfilled)  失败(rejected)  等待(pending)
  			状态只能由  pending -> fulfilled
  							或 pending -> rejected
  			一旦状态确定 就不可更改
  	3. resolve和reject函数是用来更改状态的
  			- 调用 resolve 状态会由等待 -> 成功
  			- 调用 reject 状态会由等待 -> 失败
  	4. then 方法内部做的事情就是判断状态,
  			如果状态是成功 调用成功回调函数
  			如果状态是失败 调用失败回调函数
  		 then 是定义在原型对象当中的
  	5. then 成功回调有一个参数 表示成功之后的值
  		 then 失败回调有一个参数 表示失败后的原因
  	
  let promise = new Promise((resolve,reject) => {
    resolve('成功');
    /* reject('失败'); */
  });
  promise.then(value => {
    console.log(value);
  },reason => {
    console.log(reason);
  })
  ```


- ```css
  分支二: 在 Promise 类中加入异步逻辑
  	1. 执行器立即执行时,是个异步代码的情况,由于主线程不会等待异步代码，因此 then会马上执行
  	2. then方法里面 我们判断了下当前状态 这时状态是等待，所以我们不清楚何时去调用成功回调或失败回调，因此我们 要将成功回调和失败回调存储起来
  	3. 等异步结束后，我们再去判断成功回调或失败回调是否存在 如果存在 就调用
  
  let promise = new Promise((resolve,reject) => {
    setTimeout(() => {
      resolve('成功');
    },2000)
    /* reject('失败'); */
  });
  ```
  
- ```css
  分支三：实现 then 方法多次调用添加多个处理函数
  	1. 同一个 Promise 对象上的 then 方法是可以被多次调用的
    2. 当状态变成成功或者失败时，then里面所对应的函数是要被依次调用的
    3. 是同步的话，依次调用就行
    	 是异步的情况 我们需要把状态先用数组存储起来
  	4. 当状态变为成功或失败时 通过循环依次调用其对应的回调函数
  
  let promise = new Promise((resolve,reject) => {
    setTimeout(() => {
      resolve('成功');
    },2000)
    /* reject('失败'); */
  });
  promise.then(value => {
    console.log(value);
  },reason => {
    console.log(reason);
  })
  
  promise.then(value => {
    console.log(value);
  },reason => {
    console.log(reason);
  })
  ```

  