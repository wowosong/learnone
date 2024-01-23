# 变量

## JavaScript 有三种声明方式。

如果一条语句独占一行的话，那么分号是可以省略的。（译者注：并不建议这么做。）但如果一行中有多条语句，那么这些语句必须以分号分开。

**备注：** ECMAScript 规定了在语句的末尾自动插入分号（[ASI](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Lexical_grammar#自动分号补全)）。

**虽然不是必需的，但是在一条语句的末尾加上分号是一个很好的习惯。这个习惯可以大大减少代码中产生 bug 的可能性。**

你可以用以下三种方式声明变量：

- 使用关键词 `var` 。例如 `var x = 42`。这个语法可以用来声明局部变量和全局变量。
- 直接赋值。例如 `x = 42`。<span style='color:red'>**在函数外使用这种形式赋值，会产生一个全局变量**</span>。在严格模式下会产生错误。因此你不应该使用这种方式来声明变量。
- 使用关键词 `let` 。例如 `let y = 13`。这个语法可以用来声明块作用域的局部变量。參考下方[变量的作用域 (Variable scope)](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Grammar_and_types#变量的作用域)。

### `var`

**`var` 语句** 用于声明一个<span style="color:red">**函数范围或全局范围**</span>的变量，并可将其初始化为一个值（可选）。 声明一个变量，**可选**初始化一个值。  **用 var声明的变量的作用域是它当前的执行上下文及其闭包（嵌套函数），或者对于声明在任何函数外的变量来说是全局**。使用 var 重复声明 JavaScript 变量并不会抛出错误（即使在严格模式 (strict mode) 下），同时，变量也不会丢失其值，直到调用其他的赋值操作。变量的初始化值。该值可以是任何合法的表达式。**默认值为 undefined**。

**[解构赋值]**语法也可用于变量声明。就像这样 `let { bar } = foo`。这会创建一个名为 `bar` 的变量，并且将 `foo` 对象中属性名与之相同的属性的值赋给它。

使用 `var` 声明的变量将在任何代码执行前被创建，这被称为**变量提升**。这些变量的初始值为 `undefined`。

在全局上下文中，使用 `var` 声明的变量将作为全局对象的**不可配置**属性被添加。这意味着它的属性描述符无法被修改，也无法使用 [`delete`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/delete) 删除。其对应的名字也将被添加到 [全局环境记录（global environment record）](https://www.ecma-international.org/ecma-262/10.0/index.html#sec-global-environment-records)（它构成了全局词法环境 (global lexical environment) 的一部分）的 `[[VarNames]]` 插槽内的列表中。`[[VarNames]]` 中的命名列表使运行时能够区分“全局变量”和“全局对象的直接属性”。

全局变量（以全局对象的属性的形式被创建）不可配置的原因是：该标识符被视为一个变量，而不是全局对象的**直接属性**。JavaScript 具有自动化的内存管理机制，因此“能够使用 `delete` 删除全局变量”是没有意义的。

```js
var x = 0;
function f() {
  var x = (y = 1); // x 在函数内部声明，y 则在全局作用域下声明
}
f();

console.log(x, y); // 0 1

// 在非严格模式下：
// x 是全局变量。
// y 是隐式声明的全局变量。
```

在严格模式下运行相同的示例：

```js
"use strict";

var x = 0;
function f() {
  var x = (y = 1); // 严格模式下将抛出 ReferenceError
}
f();

console.log(x, y);
```

### 隐式全局变量和外部函数作用域

看起来像是隐式全局作用域的变量也有可能是其外部函数变量的引用：

```js
var x = 0; // x 是全局变量，并且赋值为 0

console.log(typeof z); // // undefined，因为 z 还不存在

function a() {
  var y = 2; // y 被声明成函数 a 作用域的变量，并且赋值为 2

  console.log(x, y); // 0 2

  function b() {
    x = 3; // 全局变量 x 被赋值为 3
    y = 4; // 已存在的外部函数的 y 变量被赋值为 4
    z = 5; // 创建新的全局变量 z，并且赋值为 5
    // (在严格模式下抛出 ReferenceError)
  }

  b(); // 调用 b 时创建了全局变量 z
  console.log(x, y, z); // 3 4 5
}

a(); // Also calls b.
console.log(x, z); // 3 5
console.log(typeof y); // undefined，因为 y 是 a 函数的局部变量
```

### `let`

​    **` let`** 声明用于声明可**重新赋值的块级作用域局部变量**，并且可以将每个变量初始化为一个值（可选）。**声明一个块作用域的局部变量，可选初始化一个值**。  用 `var` 或 `let` 语句声明的变量，如果没有赋初始值，则其值为 `undefined`。

**用 `let` 声明的变量的作用域是最靠近并包含 `let` 声明的以下花括号闭合语法结构的一个：**

- [块](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/block)语句
- [`switch`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/switch) 语句
- [`try...catch`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/try...catch) 语句
- `let` 位于其开头的 [`for` 语句之一](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements#迭代器)的主体
- 函数主体
- 类[静态初始化块 (en-US)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/Static_initialization_blocks)

如果没有被这些结构包含，则是当前模块或脚本的顶级作用域。

相较于 [`var`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/var)，`let` 声明有以下不同点：

- `let` 声明的作用域是块或函数。
- `let` 声明的变量只能在执行到声明所在的位置之后才能被访问（参见[暂时性死区](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/let#暂时性死区)）。因此，`let` 声明通常被视为是[非提升的](https://developer.mozilla.org/zh-CN/docs/Glossary/Hoisting)。
- `let` 声明在脚本的顶级作用域上声明变量时不会在[全局对象](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/globalThis)上创建属性。
- `let` 声明的变量不能被同一个作用域中的任何其他声明[重复声明](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/let#重复声明)。
- `let` [是*声明*，而不是*语句*](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements#difference_between_statements_and_declarations)的开头。这意味着，你不能将单独的 `let` 声明当做块的主体使用（因为这样做会让变量无法被访问）。

### `const`

​    声明一个块作用域的只读常量，其作用域可以是**全局或本地声明的块**。 常量是块级范围的，非常类似用 [let](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/let) 语句定义的变量。**但常量的值是无法（通过重新赋值）改变的，也不能被重新声明，常量必须要求一个初始值**。

此声明创建一个常量，其作用域可以是全局或本地声明的块。与[`var`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/var)变量不同，**全局常量不会变为 window 对象的属性**。需要一个常数的初始化器；也就是说，你必须在声明的同一语句中指定它的值（这是有道理的，因为以后不能更改）。

**`const` 声明**创建一个值的只读引用。但这并不意味着它所持有的值是不可变的，**只是变量标识符不能重新分配**。例如，在引用内容是对象的情况下，这意味着可以改变对象的内容（例如，其参数）。

关于“[暂存死区](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/let#temporal_dead_zone_and_errors_with_let)”的所有讨论都适用于[`let`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/let)和`const`。

**一个常量不能和它所在作用域内的其他变量或函数拥有相同的名称。**

|       | 是否初始化      | 是否可重复声明 | 作用域     | 变量提升 | 是否可以改变 |
| ----- | --------------- | -------------- | ---------- | -------- | ------------ |
| var   | 可选，undefined | 可以           | 函数或全局 | 存在     | 可以         |
| let   | 可选，undefined | 不可以         | 块或函数   | 不存在   | 可以         |
| const | 必须填          | 不可以         | 块或全局   | 不存在   | 只读引用     |

## 变量的作用域

**在函数之外声明的变量，叫做*全局*变量，因为它可被当前文档中的任何其他代码所访问。在函数内部声明的变量，叫做*局部*变量，因为它只能在当前函数的内部访问。**

ECMAScript 6 之前的 JavaScript 没有[语句块](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Control_flow_and_error_handling#语句块)作用域；相反，**语句块中声明的变量将成为语句块所在函数（或全局作用域）的局部变量**。例如，如下的代码将在控制台输出 5，因为 `x` 的作用域是声明了 `x` 的那个函数（或全局范围），而不是 `if` 语句块。

```js
if (true) {
  var x = 5;
}
console.log(x); // 5
```

如果使用 ECMAScript 6 中的 `let` 声明，上述行为将发生变化。

```js
if (true) {
  let y = 5;
}
console.log(y); // ReferenceError: y 没有被声明
```

## 全局变量

实际上，全局变量是*全局对象*的属性。在网页中，（译注：缺省的）全局对象是 [`window`](https://developer.mozilla.org/zh-CN/docs/Web/API/Window) ，所以你可以用形如 `window.`*`variable`* 的语法来设置和访问全局变量。

因此，你可以通过指定 window 或 frame 的名字，在当前 window 或 frame 访问另一个 window 或 frame 中声明的变量。例如，在文档里声明一个叫 `phoneNumber` 的变量，那么你就可以在子框架里使用 `parent.phoneNumber` 的方式来引用它。

## 常量

你可以用关键字 `const` 创建一个只读的常量。常量标识符的命名规则和变量相同：必须以字母、下划线（_）或美元符号（$）开头并可以包含有字母、数字或下划线。

```js
const PI = 3.14;
```

常量不可以通过重新赋值改变其值，也不可以在代码运行时重新声明。它必须被初始化为某个值。

**常量的作用域规则与 `let` 块级作用域变量相同**。若省略 `const` 关键字，则该标识符将被视为变量。

在同一作用域中，不能使用与变量名或函数名相同的名字来命名常量。例如：

```js
// 这会造成错误
function f() {}
const f = 5;

// 这也会造成错误
function f() {
  const g = 5;
  var g;

  //语句
}
```

然而，对象属性被赋值为常量是不受保护的，所以下面的语句执行时不会产生错误。

```js
const MY_OBJECT = { key: "value" };
MY_OBJECT.key = "otherValue";
```

同样的，数组的被定义为常量也是不受保护的，所以下面的语句执行时也不会产生错误。

```js
const MY_ARRAY = ["HTML", "CSS"];
MY_ARRAY.push("JAVASCRIPT");
console.log(MY_ARRAY); //logs ['HTML','CSS','JAVASCRIPT'];
```

## 变量提升

JavaScript 变量的另一个不同寻常的地方是，你可以先使用变量稍后再声明变量而不会引发异常。这一概念称为变量提升；JavaScript  变量感觉上是被“提升”或移到了函数或语句的最前面。但是，提升后的变量将返回 undefined  值。因此在使用或引用某个变量之后进行声明和初始化操作，这个被提升的变量仍将返回 undefined 值。

在 ECMAScript 6 中，`let` 和 `const` 同样**会被提升**变量到代码块的顶部但是不会被赋予初始值。在变量声明之前引用这个变量，将抛出引用错误（ReferenceError）。这个变量将从代码块一开始的时候就处在一个“**暂时性死区**”，直到这个变量被声明为止。

## 函数提升

对于函数来说，**只有函数声明会被提升到顶部，而函数表达式不会被提升。**

```js
/* 函数声明 */

foo(); // "bar"

function foo() {
  console.log("bar");
}

/* 函数表达式 */

baz(); // 类型错误：baz 不是一个函数

var baz = function () {
  console.log("bar2");
};
```
