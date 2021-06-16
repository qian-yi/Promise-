// 定义为常量好处: 复用并且写代码时有提示
const PENDING = 'pending'; // 等待
const FULFILLED = 'fulfilled'; // 成功
const REJECTED = 'rejected'; // 失败

class MyPromise {
  constructor(exectur) { // 执行器
    exectur(this.resolve,this.reject);
  }
  /* 
    Promise 状态是每一个 Promise 独有的,所以我们定义为实例属性
    因为我们需要频繁的去使用它 这里我们可以将三种状态定义为常量
    默认为 等待状态
  */
  status = PENDING;
  // 成功之后的值
  value = undefined;
  // 失败后的原因
  reason = undefined;
  // 成功回调
  successCallback = [];
  // 失败回调
  failCallback = [];
  /*
    定义成箭头函数原因:
      调用的时候是直接调用的 如: resolve() 
      为了改变this指向,箭头函数的this指向的是执行上下文环境,在这就是指向 MyPromise的实例对象 
  */
  resolve = value => {
    // 如果状态不是等待,阻止程序向下执行
    if(this.status !== PENDING) return;
    // 将状态更改为成功
    this.status = FULFILLED;
    // 保存成功之后的值
    this.value = value;
    // 判断成功回调是否存在 如果存在 就调用
    // this.successCallback && this.successCallback(this.value);
    while(this.successCallback.length) this.successCallback.shift()(this.value);
  }
  reject = reason => {
    // 如果状态不是等待,阻止程序向下执行
    if(this.status !== PENDING) return;
    // 将状态更改为失败
    this.status = REJECTED;
    // 保存失败后的原因
    this.reason = reason;
    // 判断失败回调是否存在 如果存在 就调用
    // this.failCallback && this.failCallback(this.reason);
    while(this.failCallback.length) this.failCallback.shift()(this.reason);
  }
  then(successCallback,failCallback) {
    let promise2 = new MyPromise((resolve,reject) => {
      // 判断状态
      if(this.status === FULFILLED) {
        // 为了获得返回的 promise2对象 将代码变成异步代码
        setTimeout(() => {
          // 拿到成功回调的返回值
          let x = successCallback(this.value);
          /* 
            判断x的值是普通值还是 promise 对象
              普通值：直接调用 resolve
              promise对象：查看promise对象返回的结果，再根据结果 决定调用 resolve 还是 reject
          */
          resolvePromise(promise2,x,resolve,reject);
        },0);
      }else if(this.status === REJECTED) {
        failCallback(this.reason);
      }else {
        // 等待状态
        // 将成功回调和失败回调存储起来
        this.successCallback.push(successCallback);
        this.failCallback.push(failCallback);
      }
    });
    return promise2;
  }
}

function resolvePromise(promise2, x,resolve,reject) {
  if(promise2 === x) {
    return reject(new TypeError('Chaining cycle detected for promise #<Promise>'));
  }
  // 判断 x是否是MyPromise 的实例
  if(x instanceof MyPromise) {
    // promise对象
    // x.then(value => resolve(value),reason => reject(reason));
    // => 简化
    x.then(resolve,reject);
  }else {
    // 普通值
    resolve(x);
  }
}

module.exports = MyPromise;

let promise = new Promise((resolve,reject) => {
  resolve('成功');
  /* reject('失败'); */
});

let p1 = promise.then(value => {
  console.log(value);
  return p1;
})
p1.then(() => {},reason => {
  console.log(reason.message);
})
