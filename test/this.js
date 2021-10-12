// 严格模式  
'use strict';
function getThis1() {
  return this;
}
function getThis2() {
  'use strict';
  return this;
}
console.log(getThis1()); // 非严格模式: node 环境为 global , 浏览器环境为 window
console.log(getThis2()); // 严格模式 undefined

// 全局环境不要用this, 明确使用 window / global;
console.log(this); //node 环境为 {}, 浏览器环境为 window
//================================================================

// call, apply, bind 和箭头函数中的`this`
let obj = {
  getThis(a, b) {
    return this;
  },
};
let getThis = obj.getThis;
console.log(obj === obj.getThis()); // true
console.log(obj === getThis()); // false

console.log('--call apply--');
// call(target,arg1,arg2), apply(target,[arg1,arg2]) 指定 this 执行函数
console.log(obj === getThis.call(obj, 'a', 'b')); // true
console.log(obj === getThis.apply(obj, ['a', 'b'])); // true

// <Item onChange={this.onChange.bind(this)} />
console.log('--bind--');
// bind(target,arg1,arg2):function 生成一个 绑定this等参数的新函数
getThis = getThis.bind(obj, 'a');
console.log(obj === getThis()); // true

console.log('--()=>{}--');
let getThis2;
let _this;
function setGetThis2() {
  _this = this;
  getThis2 = () => this;
}
setGetThis2();
console.log(global === getThis2()); // true
console.log(undefined === getThis2()); // true
setGetThis2.call(obj);
console.log(obj === getThis2()); // true
// call, bind 不会改变箭头函数的 this 指向
console.log(obj === getThis2.call(null)); // true
console.log(obj === getThis2.bind(null)()); // true


// class 方法中,绑定 this
class Class1 {
  constructor() {
    this.getThis3 = () => this;
    this.getThis4 = this.getThis1.bind(this);
  }
  getThis1() {
    return this;
  }
  getThis2 = () => this;
}
let c1 = new Class1();
let { getThis1, getThis2, getThis3, getThis4 } = c1;
console.log('getThis1', c1 === getThis1()); // false
console.log('getThis2', c1 === getThis2()); // true
console.log('getThis3', c1 === getThis3()); // true
console.log('getThis4', c1 === getThis4()); // true
