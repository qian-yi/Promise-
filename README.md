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

  

  