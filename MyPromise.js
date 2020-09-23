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
  successCallback = undefined;
  // 失败回调
  failCallback = undefined;
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
    this.successCallback && this.successCallback(this.value);
  }
  reject = reason => {
    // 如果状态不是等待,阻止程序向下执行
    if(this.status !== PENDING) return;
    // 将状态更改为失败
    this.status = REJECTED;
    // 保存失败后的原因
    this.reason = reason;
    // 
    this.failCallback && this.failCallback(this.reason);
  }
  then(successCallback,failCallback) {
    // 判断状态
    if(this.status === FULFILLED) {
      successCallback(this.value);
    }else if(this.status === REJECTED) {
      failCallback(this.reason);
    }else {
      // 等待状态
      // 将成功回调和失败回调存储起来
      this.successCallback = successCallback;
      this.failCallback = failCallback;
    }
  }
}

module.exports = MyPromise;

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