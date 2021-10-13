// 回调函数 , Promise, 异步函数 使用上的区别；
function delay(time, value, callback) {
  setTimeout(function(){
    callback(value)
  }, time);
}
delay(2000,'hello',function(v){
  console.log(v)
  delay(1000,'world',function(v){
    console.log(v)
  })
})

function pDelay(time, value) {
  return new Promise(function(resolve,reject) {
    setTimeout(function(){
      resolve(value)
    }, time);
  })
}
pDelay(2000,'hello')
.then(console.log)
.then(pDelay.bind(null,1000,'word'))
.then(console.log)

function pDelay(time, value) {
  return new Promise(function(resolve,reject) {
    setTimeout(function(){
      resolve(value)
    }, time);
  })
}
async function main(){
  let s = await pDelay(2000,'hello')
  console.log(s)
  let s1 = await pDelay(1000,'word')
  console.log(s1)
}
main()

/*
new Promise(Function(resolve: Function, reject: Function)) {
  resolve()
  reject()
});
*/

function getData(id) {
  return new Promise(function (resolve, reject) {
    if (!id){
      return reject(new TypeError('没有id'));
      // throw new TypeError('没有id')
    }
    setTimeout(() => {
      resolve([1, 2, 3, 4]);
    }, 500);
  });
}

// promise.then 是 Promise的核心; 
// promise.then(onFulfilled:Function, onRejected:Function): promise
let pData = getData('123') // promise
// pData.then(
//   (data) => {
//     console.log('fulfilled', data);
//     return data.join(',');
//   },
//   (err) => {
//     console.log('rejected', err);
//     console.error(err);
//   }
// );

// then 不是监听
// setTimeout(() =>{
//   console.log('after 1000')
//   pData.then(
//     (data) => {
//       console.log('fulfilled1', data);
//     },
//     (err) => {
//       console.log('rejected2', err);
//     }
//   );
// },1000)

// then 方法第一次都返回一个新的promise对像
function getData(id) {
  return new Promise(function (resolve, reject) {
    if (!id){
      return reject(new TypeError('没有id'));
      // throw new TypeError('没有id')
    }
    setTimeout(() => {
      resolve([1, 2, 3, 4]);
    }, 500);
  });
}
let pData = getData('123') 
// console.log(pData.then())
// console.log(pData.then() === pData.then())
pData.then((data)=>{
  console.log(data);
  // return Promise.resolve('then2 err')
  return 'then1';
}).then((data)=>{
  console.log(data);
  // return Promise.reject('then2 err')
  throw 'then2 err'
})
.then(null,(err)=>{
  console.error(err)
  // throw 111
  return 111
})
// .catch((err)=>{
//   console.error(err)
// })
.finally(()=>{
  console.log('finally')
})
// .then(...(function(finallyFn){
//   return [v => {
//     finallyFn()
//     return v
//   },err=>{
//     finallyFn();
//     throw err
//   }]
// }(function(){
//   /* finally code */
// })))


// Pormise.prototype['finallyFn']= function (finallyFn){
//   finallyFn = typeof finallyFn === 'function' ? finallyFn : null;
//   return this.then(
//     (v) => {
//       null || finallyFn();
//       return v;
//     },
//     (err) => {
//       null || finallyFn();
//       throw err;
//     }
//   );
// }
/*
  习惯用 throw 来控制流程
  .catch .finally 都是基于.then 方法实现的
*/

// Promise.resolve, Promise.reject;
let onFulfilled = (v) => console.log('onfulfilled:',v);
let onRejected = (err) => console.log('onrejected:', err);
// Promise.resolve(1).then(onFulfilled,onRejected)
// Promise.reject(1).then(onFulfilled,onRejected)

// Promise.resolve(new Error('err')).then(onFulfilled,onRejected)
// Promise.resolve(Promise.reject(1)).then(onFulfilled,onRejected)

// Promise.all(promise[]): promise
Promise.all([1,2,3,Promise.reject(4)]).then(onFulfilled,onRejected)


// ES6 与 第三方的 Promise 混用
const Q = require('q');
const Ep = require('easy-promise');
Promise.defer = function(){
  let obj = {}
  obj.promise = new Promise((resolve,reject) =>{
    obj.resolve = resolve
    obj.reject = reject
  })
  return obj
}
let {promise:p, resolve:yes, reject:no} = Promise.defer();
let {promise:p1, resolve:yes1, reject:no1} = Q.defer();
let {promise:p2, resolve:yes2, reject:no2} = Ep.defer();

// console.log(p instanceof Promise);
// console.log(p1 instanceof Promise);
// console.log(p2 instanceof Promise);

p.then((v)=>{
  console.log('p', v)
  return p1
}).then((v)=>{
  console.log('p1', v)
  return p2
}).then((v)=>{
  console.log('p2', v)
})

yes('y')
yes1('y2')
yes2('y2')
//===========

// 异步函数 
// await 关键字代替 then ， 用同的语法，写异步过程；
let onFulfilled = (v) => console.log('onfulfilled:',v);
let onRejected = (err) => console.log('onrejected:', err);
async function asyncFn(){
  return 1;
}
let asyncFn1 = async ()=> 2;
// console.log(asyncFn())
// console.log(asyncFn1())

async function main(){
  let v = await 0;
  console.log(v)
  console.log(await asyncFn());
  console.log(await Promise.resolve(2));
  try{
    let v2 = await Promise.reject(1);
  }catch(err){
    console.log('err', err)
  }
  return 3;
}

main().then(onFulfilled,onRejected)
