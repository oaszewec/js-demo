# js 语法解惑

===

## 大纲

- 字面量, 隐式转换, 非严格比较符的一些细节；
- `||` , `||=` , `??` , `??=` , `?.` 等运算符规则及应用；
- 解构操作，展开和剩余运算符的应用；
- call, apply, bind 和箭头函数中的`this`;
- 回调函数,`Promise`与异步函数
- 生成器函数, ts 装饰器简介;

===

## `JavaScript` 字面量

- 数字字面量
- 函数字面量

---

### 数字字面量

```js
console.log(010);  //8
console.log(018);  //18
console.log(0o10); //8
console.log(0x10); //16
console.log(0b10); //2    es6
console.log(1e2);  //100
console.log(.1);   //0.1
console.log(123n); //123  无精度限制的整数类型 BigInt es2010

console.log(parseInt('010')); //10    //es3  8
console.log(parseInt('018')); //18
console.log(parseInt('010', 10)); //10
console.log(parseInt('010', 16)); //16
console.log(parseInt('01z', 36)); //71
console.log(parseInt('0o10')); //0
console.log(parseInt('0b10')); //0
console.log(parseInt('0x10')); //16  *
console.log(parseInt('1e2')); //1
console.log(parseFloat('.1')); //0.1
```

---

### 函数字面量

```js
// 定义一个myFunction函数
function myFunction(a, b) {
  return a + b;
}
// 将一个函数赋值给 变量/常量;
let fn = function(a, b) {
  return a + b;
};
let fn1 = function abc(a, b) {
  return a + b;
};

// 箭头函数
let fn2 = a => ++a;
let fn3 = (a, b) => a + b;
let fn4 = (a, b) => ({n：a + b});
// 对像方法
let obj = {
  fn: function () {},
  fn1() {},
  fn2: () => {},
};
```

===

## 隐式转换

- Number
- Boolean

---

### `Number`
转换规则 
```js
console.table([ null, undefined, true, false, '', '010', '0x10', '0o10', '0b10', '1e2'].map( v =>{
    return[`${v}`, Number(v)];
}))
/*
┌─────────────┬─────┐
│   'null'    │  0  │
│ 'undefined' │ NaN │
│   'true'    │  1  │
│   'false'   │  0  │
│     ''      │  0  │
│    '010'    │ 10  │
│   '0x10'    │ 16  │
│   '0o10'    │  8  │
│   '0b10'    │  2  │
│    '1e2'    │ 100 │
└─────────────┴─────┘*/

// 对像转 number, 会通过 valueOf() 和 toString() 取值再转换 
let obj = {
    name:'abc',
    age:20,
    // valueOf : function(){ return '123'},
    // toString : function(){ return this.age},
}
console.log(+obj);
```
---

> 在执行计算操作时，会先尝试将非Number数据转为Number;  
```js
// 加号运算符, 优先转自符串 优先;
console.log(1 + '1')  // '11'
console.log('1' + 1)  // '11'
console.log(1 + '1' - 1); // 10
console.log(1 + null)  //1
console.log(1 + undefined)  //NaN
console.log(1 + true)  //2
console.log({} + null)  //[object Object]null
console.log({valueOf:()=>1} + null)  //1

// 其他关于Number
let a = '10.1';
a = Number(a)
a = +a; // 可以用 '一元加运算符' 替代 Number();
a = a - 0; // 利用减号操作符 触发转换; 

a = ~~a; // 取整
a = a >> 0; // 取整

```
> JavaScript 将数字存储为 `Float64` , 但所有按位运算都以 `Int32` 执行。

---

### `Boolean`

> `false` 情况 `false` , `0` , `undefined` , `null` , `NaN` , `''`;  
> `!` , `||`, `&&`, `if` , `while` 等都会触发隐式转换;

```js
console.log(!!{}); // true
console.log(!![]); // true
console.log(0 || 5); // ?

if (a) {}
if (Boolean(a)) {}
if (!!a) {}


if (~arr.indexOf(item)) {
  /*在arr检索到item*/
} 

var i;
console.log(i=[1,2,3].indexOf(1), ~i, !!~i);  // ~-1 === 0 
console.log(i=[1,2,3].indexOf(9), ~i, !!~i);  // ~0 === -1

if (a !== a) {
  /*code*/
} // 判断 NaN 的情况.  NaN !== NaN  // true

// if(!x.includes(v)){}
```

---

### 非严格比较符 **==**
```js
console.log(!![]); // true
console.log(null == undefined);
console.log(null == NaN);
console.log('' == 0);
console.log(12 == ['12']);
console.log(false == []);

if(x){}
if(!!x){}
if(x == true){}
```
Note: 121221121

---

<table style="font-size:.4em;">
<!-- <table> -->
  <thead>
		<tr>
			<th>Type(x)</th>
			<th>Type(y)</th>
			<th>Result</th>
			<th>example</th>
		</tr>
  </thead>
	<tbody>
		<tr>
			<td colspan="2">x y 类型相同</td>
			<td><b>参考全等 (===) 规则</b></td>
			<td>
			    1 == 1 // true <br> 
			    ({} == {}) // false <br>
			    [] == [] // false
			</td>
		</tr>
		<tr>
			<td>null</td>
			<td>Undefined</td>
			<td><b>true</b></td>
			<td></td>
		</tr>
		<tr>
			<td>Undefined</td>
			<td>null</td>
			<td><b>true</b></td>
			<td></td>
		</tr>
		<tr>
			<td>Number</td>
			<td>String</td>
			<td>x == <span style="color:#CC0099;">toNumber</span>(y)</td>
			<td  rowspan="2">
			    1 == "1" //true<br>
			    0 == ""  //true<br>
			    "0.1" == 0.1 //true<br>
			    "0.1a" == 0.1 //false
			</td>
		</tr>
		<tr>
			<td>String</td>
			<td>Number</td>
			<td><span style="color:#CC0099;">toNumber</span>(x) == y</td>
		</tr>
		<tr>
			<td>Boolean</td>
			<td>(any)</td>
			<td><span style="color:#CC0099;">toNumber</span>(x) == y</td>
			<td rowspan="2">
<pre style="margin:.2em; line-height:1.2; width:auto;">
false == [] //true
过程如下:
Number(false) == []
0 == [] 
// 0 == toPrimitive([])
0 == "" 
// 0 == Number("")
0 == 0  
true</pre>
			</td>
		</tr>
		<tr>
			<td>(any)</td>
			<td>Boolean</td>
			<td>x == <span style="color:#CC0099;">toNumber</span>(y)</td>
		</tr>
		<tr>
			<td>String or Number</td>
			<td>Object</td>
			<td>x == <span style="color:#009900;">toPrimitive</span>(y)</td>
			<td rowspan="2">
<pre style="margin:.2em; line-height:1.2; width:auto;">
toPrimitive 规则:
优先调用对像的 `valueOf` 方法转换;
如果对像没有 `valueOf` 方法, 或者 `valueOf` 方法返回的值不是原数据类型,
则调用 `toString` 方法转换;
以下对比结果都为 `true` :
"[object Object]" == {} // true
1 == {valueOf : function(){ return "1" }}
1 == {toString: function(){ return "1" }}
0 == {
    toString: function(){ return "1" },
    valueOf : function(){ return "0" }
}</pre>
			</td>
		</tr>
		<tr>
			<td>Object</td>
			<td>String or Number</td>
			<td><span style="color:#009900;">toPrimitive</span>(x) == y</td>
		</tr>
		<tr>
			<td colspan="2">其它情况…</td>
			<td><b>false</b></td>
			<td>
                [] == {}<br>
                "" == null<br>
                "" == undefined<br>
                ...
			</td>
		</tr>
	</tbody>
</table>

> 非严格比较符规则 [Abstract Equality Comparison Algorithm](http://www.ecma-international.org/ecma-262/5.1/#sec-11.9.3)

===

## 参数默认值<!-- .element: style="font-size:1.5em;" --> `||`, `||=`, `??`, `??=`, `?.`

> `??` 空值合并运算符  
>  `?.` 链判断运算符（可选链运算符）

```js
// 函数入参默认值
let fn = function (x = 'x', y, z) {
  // 入参x为 undefined，x 会使用默认值
  y = y || 'y'; // 入参y值为 js false值, y 都将赋值为 'y'
  z = z ?? 'z'; // 入参z 为 undefined / null, y 都将赋值为 'z'
  // y ||= 'y';
  // z ??= 'z';
  console.log(x, y, z);
};
fn();
[undefined, null, false, 0, NaN, ''].map((v) => {
  console.log(`--${v === '' ? '""' : v}--`);
  fn(v, v, v);
});

// 变量默认值
let res = {};
let list = res.data.list || []; // /* TypeError: Cannot read property 'data' of undefined */
let list = (res && res.body && res.body.data) || {};

// es2010  ?. 链判断运算符（可选链运算符）
let ab = a?.b; // 等同于 let ab = a == null ? undefined : a.b;
// 用 链判断运算符 写安全代码
let res = {};
let success = res?.code === 200;
let list = res?.data?.list ?? []; // 安全写法
```

===

## 解构操作，展开和剩余运算符<!-- .element: style="font-size:1.5em;" -->

```js
// 解构
let obj = { a: 1, b: 2 };
let arr = [1, 2, 3, 4];
let { a, b } = obj;
let [, , c] = arr;
// 展开运算符
let arr1 = [...arr]; // 浅拷贝数组
let arr2 = [...arr, ...arr1]; // 合并数组
let obj1 = { ...obj }; // 浅拷贝对像
let obj2 = Object.assign({}, obj);

let obj3 = { ...obj, ...{ c: 3 } };
let obj4 = Object.assign(obj, { c: 3 });
// console.log(obj4 === obj); // true

// 剩余运算符
let [a1, a2, a3, ...other] = [1, 2, 3, 4, 5, 6]; // 储存剩余于项
let { a, c, ...other1 } = { a: 1, b: 2, c: 3, d: 4 }; // 储存剩余属性
function fn(arg1, arg2, ...args) {
  // 储存剩余参数
  console.log('fn', args);
}
console.log('other', other);
console.log(`other1`, other1);
fn(1, 2, 3, 4, 5);
```

===

## <!-- .element: style="font-size:1.5em;" -->`JavaScript` 中的 `this`

与其他语言相比，函数的 `this` 关键字在 JavaScript 中的表现略有不同，此外，在严格模式和非严格模式之间也会有一些差别。

1. 在绝大多数情况下，函数的调用方式决定了 this 的值（运行时绑定）。
2. this 不能在执行期间被赋值，并且在每次函数被调用时 this 的值也可能会不同。
3. ES5 引入了 bind 方法来设置函数的 this 值，而不用考虑函数如何被调用的。
4. ES2015 引入了箭头函数，箭头函数不提供自身的 this 绑定（this 的值将保持为闭合词法上下文的值）。

> [Javascript 严格模式详解](http://www.ruanyifeng.com/blog/2013/01/javascript_strict_mode.html)

===

## <!-- .element: style="font-size:1.5em;" -->回调函数, 异步函数 与 `Promise`

1.  函数的参数可以是函数
2.  函数的返回值也可以是函数 

---

```js
// 函数的参数可以是函数
function fnA(arg) {
  console.log(arg);
}
function fnB(fn) {
  fn('input');
}
fnB(fnA); // input

// 函数的返回值也可以是函数
function getShowFn(arg) {
  return function () {
    console.log(arg);
  };
}
var show = getShowFn('a');
show(); // a
```

---

### 回调函数

> 兼容性好，多层回调代码可读性降低;

```js
function getData(id, callback) {
  console.log('run getData');
  if (!id) return callback(new TypeError('没有id'));
  setTimeout(() => {
    callback(null, [1, 2, 3, 4]);
  }, 1000);
}
let data;
getData('id', function (err, _data) {
  data = _data
  console.log('2', data);
});
console.log('1',data);
```

---

### 异步函数 与 Promise

> ES6 原生支持`Promise` ES2016 引入`async/await`

- `Promise` 有三种状态：`pending`（进行中）、`fulfilled`（已成功）和 `rejected`（已失败），状态不可逆
- `Promise` 可以混用 (原生`Promise`和大多数第三方实现都符合`Promise/A+`标准)
- 异步函数是基于`Promise`实现的

---

### 生成器函数, ts 装饰器

```js
function* anotherGenerator(i) {
  console.log(`run anotherGenerator`)
  let arg1 = yield (i + 1);
  yield i + 2 + (arg1 ?? 0);
}

// 1.生成器函数的返回值 是一个生成器对像
var gen1 = anotherGenerator(1);
console.log(gen1);
console.log('1:', gen1.next()) //2
console.log('2:', gen1.next(10)) //13
console.log('3:', gen1.next())

function* generator(i){
  yield i;
  yield* anotherGenerator(i);// 移交执行权
  yield i + 10;
}

var gen2 = generator(10);

console.log(gen2.next().value); // 10
console.log(gen2.next().value); // 10
console.log(gen2.next().value); // 10
console.log(gen2.next().value); // 10
console.log(gen2.next().value); // 10
```


## 前端基础学习网站推荐

- [https://www.w3school.com.cn/](https://www.w3school.com.cn/)
- [https://wangdoc.com/](https://wangdoc.com/)
- [ECMAScript 6 入门](https://es6.ruanyifeng.com/)
- [运算符优先级] (https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Operator_Precedence#table)

