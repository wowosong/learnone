# Function.prototype.apply()

[`Function`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function) 实例的 **`apply()`** 方法会以给定的 `this` 值和作为数组（或[类数组对象](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Indexed_collections#使用类数组对象)）提供的 `arguments` 调用该函数。

## [apply尝试一下](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/apply#尝试一下)

<iframe class="interactive is-js-height" height="200" src="https://interactive-examples.mdn.mozilla.net/pages/js/function-apply.html" title="MDN Web Docs Interactive Example" loading="lazy" data-readystate="complete"></iframe>

## [语法](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/apply#语法)

```js
apply(thisArg)
apply(thisArg, argsArray)
```

### [参数](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/apply#参数)

- [`thisArg`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/apply#thisarg)

  ​    调用 `func` 时提供的 `this` 值。如果函数不处于[严格模式](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Strict_mode)，则 [`null`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/null) 和 [`undefined`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/undefined) 会被替换为全局对象，原始值会被转换为对象。  

- [`argsArray`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/apply#argsarray) 可选

  ​    一个类数组对象，用于指定调用 `func` 时的参数，或者如果不需要向函数提供参数，则为 [`null`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/null) 或 [`undefined`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/undefined)。  

### [返回值](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/apply#返回值)

使用指定的 `this` 值和参数调用函数的结果。

## [描述](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/apply#描述)

**备注：** **这个函数与 [`call()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/call) 几乎完全相同，只是函数参数在 `call()` 中逐个作为列表传递，而在 `apply()` 中它们会组合在一个对象中**，通常是一个数组——例如，`func.call(this, "eat", "bananas")` 与 `func.apply(this, ["eat", "bananas"])`。

通常情况下，在调用函数时，函数内部的 [`this`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/this) 的值是访问该函数的对象。使用 `apply()`，你可以在调用现有函数时将任意值分配给 `this`，而无需先将函数作为属性附加到对象上。这使得你可以将一个对象的方法用作通用的实用函数。

你还可以使用任何类数组对象作为第二个参数。实际上，这意味着它需要具有 `length` 属性，并且整数（“索引”）属性的范围在 `(0..length - 1)` 之间。例如，你可以使用一个 [`NodeList`](https://developer.mozilla.org/zh-CN/docs/Web/API/NodeList)，或者像 `{ 'length': 2, '0': 'eat', '1': 'bananas' }` 这样的自定义对象。你还可以使用 [`arguments`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Functions/arguments)，例如：

```js
function wrapper() {
  return anotherFn.apply(null, arguments);
}
```

使用[剩余参数](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Functions/rest_parameters)和参数的[展开语法](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Spread_syntax)，可以重写为：

```js
function wrapper(...args) {
  return anotherFn(...args);
}
```

一般而言，`fn.apply(null, args)` 等同于使用参数展开语法的 `fn(...args)`，只是在前者的情况下，`args` 期望是类数组对象，而在后者的情况下，`args` 期望是[可迭代对象](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Iteration_protocols#可迭代协议)。

**警告：** 不要使用 `apply()` 进行构造函数链式调用（例如，实现继承）。这会将构造函数作为普通函数调用，这意味着 [`new.target`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/new.target) 是 `undefined`，从而类会抛出错误，因为它们不能在没有 [`new`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/new) 的情况下调用。请改用 [`Reflect.construct()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Reflect/construct) 或 [`extends`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Classes/extends)。

## [示例](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/apply#示例)

### [用 apply() 将数组各项添加到另一个数组](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/apply#用_apply_将数组各项添加到另一个数组)

你可以使用 [`Array.prototype.push()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/push) 方法将元素追加到数组中。因为 `push()` 接受可变数量的参数，所以你也可以一次性添加多个元素。但是，如果你将一个数组传递给 `push()`，它实际上会将该数组作为单个元素添加，而不是逐个添加元素，导致最终得到一个数组内嵌的数组。另一方面，[`Array.prototype.concat()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/concat) 在这种情况下具有期望的行为，但它不会将元素追加到*已有*数组中，而是创建并返回一个新数组。

在这种情况下，你可以使用 `apply` 隐式地将一个数组作为一系列参数展开。

```js
const array = ["a", "b"];
const elements = [0, 1, 2];
array.push.apply(array, elements);
console.info(array); // ["a", "b", 0, 1, 2]
```

使用展开语法可以达到相同的效果。

```js
const array = ["a", "b"];
const elements = [0, 1, 2];
array.push(...elements);
console.info(array); // ["a", "b", 0, 1, 2]
```

### [使用 apply() 和内置函数](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/apply#使用_apply_和内置函数)

巧妙地使用 `apply()` 可以让你在某些情况下使用内置函数来完成一些任务，而这些任务通常需要手动遍历集合（或使用展开语法）。

例如，我们可以使用 [`Math.max()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Math/max) 和 [`Math.min()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Math/min) 来找出数组中的最大值和最小值。

```js
// 数组中的最小/最大值
const numbers = [5, 6, 2, 3, 7];

// 用 apply 调用 Math.min/Math.max
let max = Math.max.apply(null, numbers);
// 这等价于 Math.max(numbers[0], …) 或 Math.max(5, 6, …)

let min = Math.min.apply(null, numbers);

// 与基于简单循环的算法相比
max = -Infinity;
min = +Infinity;

for (let i = 0; i < numbers.length; i++) {
  if (numbers[i] > max) {
    max = numbers[i];
  }
  if (numbers[i] < min) {
    min = numbers[i];
  }
}
```

但要注意：通过使用 `apply()`（或展开语法）来处理任意长的参数列表，你可能会超过 JavaScript 引擎的参数长度限制。

调用具有太多参数的函数（即超过数万个参数）的后果是未指定的，并且在不同的引擎中会有所不同。（JavaScriptCore 引擎[将参数限制硬编码为 65536](https://webkit.org/b/80797)。）大多数引擎会抛出异常；但并没有规范要求阻止其他行为，例如任意限制应用函数实际接收的参数数量。为了说明后一种情况：假设这样的引擎限制为四个参数（实际限制当然要高得多），那么在上面的示例中，传递给 `apply` 的参数将变为 `5, 6, 2, 3`，而不是完整的数组。

如果你的值数组可能会增长到数万个，可以使用混合策略：将数组的片段分批通过 `apply` 调用函数：

```js
function minOfArray(arr) {
  let min = Infinity;
  const QUANTUM = 32768;

  for (let i = 0; i < arr.length; i += QUANTUM) {
    const submin = Math.min.apply(
      null,
      arr.slice(i, Math.min(i + QUANTUM, arr.length)),
    );
    min = Math.min(submin, min);
  }

  return min;
}

const min = minOfArray([5, 6, 2, 3, 7]);
```

# Function.prototype.bind()

[`Function`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function) 实例的 **`bind()`** 方法创建一个新函数，当调用该新函数时，它会调用原始函数并将其 `this` 关键字设置为给定的值，同时，还可以传入一系列指定的参数，这些参数会插入到调用新函数时传入的参数的前面。

## [bind尝试一下](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/bind#尝试一下)

<iframe class="interactive is-taller-height" height="200" src="https://interactive-examples.mdn.mozilla.net/pages/js/function-bind.html" title="MDN Web Docs Interactive Example" loading="lazy" data-readystate="complete"></iframe>

## [语法](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/bind#语法)

```js
bind(thisArg)
bind(thisArg, arg1)
bind(thisArg, arg1, arg2)
bind(thisArg, arg1, arg2, /* …, */ argN)
```

### [参数](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/bind#参数)

- [`thisArg`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/bind#thisarg)

  ​    在调用绑定函数时，作为 `this` 参数传入目标函数 `func` 的值。如果函数不在[严格模式](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Strict_mode)下，[`null`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/null) 和 [`undefined`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/undefined) 会被替换为全局对象，并且原始值会被转换为对象。如果使用 [`new`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/new) 运算符构造绑定函数，则忽略该值。  

- [`arg1, …, argN`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/bind#arg1_…_argn) 可选

  ​    在调用 `func` 时，插入到传入绑定函数的参数前的参数。  

### [返回值](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/bind#返回值)

使用指定的 `this` 值和初始参数（如果提供）创建的给定函数的副本。

## [描述](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/bind#描述)

`bind()` 函数创建一个新的*绑定函数（bound function）*。调用绑定函数通常会执行其所包装的函数，也称为*目标函数（target function）*。绑定函数将绑定时传入的参数（包括 `this` 的值和前几个参数）提前存储为其内部状态。而不是在实际调用时传入。通常情况下，你可以将 `const boundFn = fn.bind(thisArg, arg1, arg2)` 和 `const boundFn = (...restArgs) => fn.call(thisArg, arg1, arg2, ...restArgs)` 构建的绑定函数的调用效果视为等效（但就构建 `boundFn` 的过程而言，不是二者等效的）。

绑定函数可以通过调用 `boundFn.bind(thisArg, /* more args */)` 进一步进行绑定，从而创建另一个绑定函数 `boundFn2`。新绑定的 `thisArg` 值会被忽略，因为 `boundFn2` 的目标函数是 `boundFn`，而 `boundFn` 已经有一个绑定的 `this` 值了。当调用 `boundFn2` 时，它会调用 `boundFn`，而 `boundFn` 又会调用 `fn`。`fn` 最终接收到的参数按顺序为：`boundFn` 绑定的参数、`boundFn2` 绑定的参数，以及 `boundFn2` 接收到的参数。

```js
"use strict"; // 防止 `this` 被封装到到包装对象中

function log(...args) {
  console.log(this, ...args);
}
const boundLog = log.bind("this value", 1, 2);
const boundLog2 = boundLog.bind("new this value", 3, 4);
boundLog2(5, 6); // "this value", 1, 2, 3, 4, 5, 6
```

如果目标函数是可构造的，绑定函数也可以使用 `new` 运算符进行构造。这样做的效果就好像目标函数本身被构造一样。前置的参数会像通常一样传递给目标函数，而提供的 `this` 值会被忽略（因为构造函数会准备自己的 `this`，如 [`Reflect.construct`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Reflect/construct) 的参数所示）。如果直接构造绑定函数，[`new.target`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/new.target) 将指向目标函数（也就是说，绑定函数对 `new.target` 是透明的）。

```js
class Base {
  constructor(...args) {
    console.log(new.target === Base);
    console.log(args);
  }
}

const BoundBase = Base.bind(null, 1, 2);

new BoundBase(3, 4); // true, [1, 2, 3, 4]
```

然而，由于绑定函数没有 [`prototype`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/prototype) 属性，它不能作为 [`extends`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Classes/extends) 的基类。

```js
class Derived extends class {}.bind(null) {}
// TypeError: Class extends value does not have valid prototype property undefined
```

当将绑定函数用作 [`instanceof`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/instanceof) 运算符右操作数时，`instanceof` 会访问绑定函数内部存储的目标函数，并读取其 `prototype` 属性。

```js
class Base {}
const BoundBase = Base.bind(null, 1, 2);
console.log(new Base() instanceof BoundBase); // true
```

绑定函数具有以下属性：

- [`length`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/length)

  ​    目标函数的 `length` 减去被绑定的参数个数（不包括 `thisArg` 参数），最小值为 0。  

- [`name`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/name)

  ​    目标函数的 `name` 前加上 `"bound "` 前缀。  

绑定函数还会继承目标函数的[原型链](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Inheritance_and_the_prototype_chain)。然而，它不会继承目标函数的其他自有属性（例如，如果目标函数是一个类，则不会继承其[静态属性](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Classes/static)）。

## [示例](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/bind#示例)

### [创建绑定函数](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/bind#创建绑定函数)

`bind()` 最简单的用法是创建一个函数，无论如何调用，它都会使用特定的 `this` 值进行调用。

JavaScript 新手经常犯的一个错误是将一个方法从对象中提取出来，然后再调用，并期望方法中的 `this` 是原来的对象（比如在回调中传入这个方法）。

然而，如果不做特殊处理的话，通常会丢失原始对象。使用这个函数加上原始的对象来创建一个绑定函数，巧妙地解决了这个问题：

```js
// 顶级的“this”绑定到“globalThis”。
this.x = 9;
const module = {
  x: 81,
  getX() {
    return this.x;
  },
};

// “getX”的“this”参数绑定到“module”。
console.log(module.getX()); // 81

const retrieveX = module.getX;
// “retrieveX”的“this”参数在非严格模式下绑定到“globalThis”。
console.log(retrieveX()); // 9

// 创建一个新函数“boundGetX”，并将“this”参数绑定到“module”。
const boundGetX = retrieveX.bind(module);
console.log(boundGetX()); // 81
```

**备注：** 如果在[严格模式](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Strict_mode)下运行这个示例，`retrieveX` 的 `this` 参数会绑定到 `undefined` 而不是 `globalThis`，这会导致 `retrieveX()` 的调用失败。

如果在一个 ECMAScript 模块中运行这个示例，顶级的 `this` 会绑定到 `undefined` 而不是 `globalThis`，导致 `this.x = 9` 赋值失败。

如果在 Node CommonJS 模块中运行这个示例，则顶级的 `this` 会绑定到 `module.exports` 而不是 `globalThis`。然而，在非严格模式下，`retrieveX` 的 `this` 仍然会绑定到 `globalThis`，而在严格模式下会绑定为 `undefined`。因此，在非严格模式下（默认情况下），`retrieveX()` 调用会返回 `undefined`, 因为 `this.x = 9` 会写入的是一个不同的对象（`module.exports`），而 `getX` 读取的是另一个对象（`globalThis`）。

实际上，一些内置的“方法”也是返回绑定函数的 getter 方法，其中一个显著的例子是 [`Intl.NumberFormat.prototype.format()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat/format#使用_format_和_map)，当访问时，它返回一个绑定函数，你可以直接将其作为回调函数传递。

### [偏函数](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/bind#偏函数)

`bind()` 的另一个简单用法是创建一个具有预设初始参数的函数。

这些参数（如果有的话）会跟随提供的 `this` 值，并在传递给目标函数的参数列表的开头插入，其后是在调用绑定函数时传递的参数。

```js
function list(...args) {
  return args;
}

function addArguments(arg1, arg2) {
  return arg1 + arg2;
}

console.log(list(1, 2, 3)); // [1, 2, 3]

console.log(addArguments(1, 2)); // 3

// 创建一个带有预设前导参数的函数
const leadingThirtySevenList = list.bind(null, 37);

// 创建一个带有预设第一个参数的函数。
const addThirtySeven = addArguments.bind(null, 37);

console.log(leadingThirtySevenList()); // [37]
console.log(leadingThirtySevenList(1, 2, 3)); // [37, 1, 2, 3]
console.log(addThirtySeven(5)); // 42
console.log(addThirtySeven(5, 10)); // 42
//（最后一个参数 10 被忽略）
```

### [配合 setTimeout()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/bind#配合_settimeout)

在默认情况下，在 [`setTimeout()`](https://developer.mozilla.org/zh-CN/docs/Web/API/setTimeout) 内部，`this` 关键字将被设置为 [`globalThis`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/globalThis)，在浏览器中它是 [`window`](https://developer.mozilla.org/zh-CN/docs/Web/API/Window) 对象。当处理需要将 `this` 引用类实例的类方法时，你可以显式地将 `this` 绑定到回调函数，以便保持实例的引用。

```js
class LateBloomer {
  constructor() {
    this.petalCount = Math.floor(Math.random() * 12) + 1;
  }
  bloom() {
    // 延迟 1 秒后宣布开花
    setTimeout(this.declare.bind(this), 1000);
  }
  declare() {
    console.log(`I am a beautiful flower with ${this.petalCount} petals!`);
  }
}

const flower = new LateBloomer();
flower.bloom();
// 1 秒后调用“flower.declare()”
```

你还可以使用[箭头函数](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Functions/Arrow_functions)来实现此目的。

```js
class LateBloomer {
  bloom() {
    // 延迟 1 秒后宣布开花
    setTimeout(() => this.declare(), 1000);
  }
}
```

### [作为构造函数使用的绑定函数](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/bind#作为构造函数使用的绑定函数)

绑定函数自动适用于与 [`new`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/new) 运算符一起使用，以用于构造目标函数创建的新实例。当使用绑定函数是用来构造一个值时，提供的 `this` 会被忽略。然而，提供的参数仍会被插入到构造函数调用时的参数列表之前。

```js
function Point(x, y) {
  this.x = x;
  this.y = y;
}

Point.prototype.toString = function () {
  return `${this.x},${this.y}`;
};

const p = new Point(1, 2);
p.toString();
// '1,2'

// thisArg 的值并不重要，因为它被忽略了
const YAxisPoint = Point.bind(null, 0 /*x*/);

const axisPoint = new YAxisPoint(5);
axisPoint.toString(); // '0,5'

axisPoint instanceof Point; // true
axisPoint instanceof YAxisPoint; // true
new YAxisPoint(17, 42) instanceof Point; // true
```

请注意，你无需采取任何特殊措施来创建一个绑定函数，以便与 [`new`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/new) 运算符一起使用。[`new.target`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/new.target)、[`instanceof`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/instanceof)、[`this`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/this) 等都如预期工作，就好像构造函数从未被绑定一样。唯一的区别是它不能再用于 [`extends`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Classes/extends)。

相应地，你无需采取任何特殊措施来创建一个绑定函数，使其只能以普通方式调用，即使你更希望要求只能使用 [`new`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/new) 来调用绑定函数。如果你在没有使用 `new` 的情况下调用它，绑定的 `this` 将不再被忽略。

```js
const emptyObj = {};
const YAxisPoint = Point.bind(emptyObj, 0 /*x*/);

// 仍然可以作为普通函数调用
//（尽管通常这是不可取的）
YAxisPoint(13);

// 现在可以从外部观察对 `this` 的修改
console.log(emptyObj); // { x: 0, y: 13 }
```

如果你希望限制绑定函数只能使用 [`new`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/new) 调用，或者只能在没有使用 `new` 的情况下调用，目标函数必须强制执行该限制，例如通过检查 `new.target !== undefined` 或使用 [class](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Classes)。

### [绑定类](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/bind#绑定类)

在类上使用 `bind()` 会保留大部分类的语义，只是当前类的所有静态自有属性会丢失。然而，由于原型链被保留，你仍然可以访问从父类继承的静态属性。这意味着绑定后的类实例仍然可以享受到继承自父类的静态属性的功能。

```js
class Base {
  static baseProp = "基类属性";
}

class Derived extends Base {
  static derivedProp = "派生类属性";
}

const BoundDerived = Derived.bind(null);
console.log(BoundDerived.baseProp); // "基类属性"
console.log(BoundDerived.derivedProp); // undefined
console.log(new BoundDerived() instanceof Derived); // true
```

### [将方法转换为实用函数](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/bind#将方法转换为实用函数)

`bind()` 在某些情况下也非常有用，比如当你想将一个需要特定 `this` 值的方法转换为一个普通的实用函数，该函数将之前的 `this` 参数作为普通参数传入。这类似于通用实用函数的工作方式：而不是调用 `array.map(callback)`，你可以使用 `map(array, callback)`，这样可以避免修改 `Array.prototype`，并且可以在不是数组的类数组对象（比如 [`arguments`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Functions/arguments)）上使用 `map`。

以 [`Array.prototype.slice()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/slice) 为例，你可以使用它将类数组对象转换为真正的数组。你可以创建一个类似下面的快捷方式：

```js
const slice = Array.prototype.slice;

// ...

slice.call(arguments);
```

请注意，你不能保存 `slice.call` 并将其作为普通函数调用，因为 `call()` 方法还会读取其应该调用的函数作为其 `this` 值。在这种情况下，你可以使用 `bind()` 来绑定 `call()` 的 `this` 值。在下面的代码片段中，`slice()` 是一个绑定了 `this` 值为 [`Array.prototype.slice()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/slice) 的 [`Function.prototype.call()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/call) 的版本。这意味着可以消除额外的 `call()` 调用：

```js
// 与上一个示例中的“slice”相同
const unboundSlice = Array.prototype.slice;
const slice = Function.prototype.call.bind(unboundSlice);

// ...

slice(arguments);
```

# Function.prototype.call()

[`Function`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function) 实例的 **`call()`** 方法会以给定的 `this` 值和逐个提供的参数调用该函数。

## [call尝试一下](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/call#尝试一下)

<iframe class="interactive is-js-height" height="200" src="https://interactive-examples.mdn.mozilla.net/pages/js/function-call.html" title="MDN Web Docs Interactive Example" loading="lazy" data-readystate="complete"></iframe>

## [语法](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/call#语法)

```js
call(thisArg)
call(thisArg, arg1)
call(thisArg, arg1, arg2)
call(thisArg, arg1, arg2, /* …, */ argN)
```

### [参数](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/call#参数)

- [`thisArg`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/call#thisarg)

  ​    在调用 `func` 时要使用的 `this` 值。如果函数不在[严格模式](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Strict_mode)下，[`null`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/null) 和 [`undefined`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/undefined) 将被替换为全局对象，并且原始值将被转换为对象。  

- [`arg1, …, argN`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/call#arg1_…_argn) 可选

  ​    函数的参数。  

## [返回值](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/call#返回值)

使用指定的 `this` 值和参数调用函数后的结果。

## [描述](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/call#描述)

**备注：** 这个函数几乎与 [`apply()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/apply) 相同，只是函数的参数以列表的形式逐个传递给 `call()`，而在 `apply()` 中它们被组合在一个对象中，通常是一个数组——例如，`func.call(this, "eat", "bananas")` 与 `func.apply(this, ["eat", "bananas"])`。

通常，在调用函数时，函数内部的 [`this`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/this) 值是访问该函数的对象。使用 `call()`，你可以在调用现有函数时将任意值分配给 `this`，而无需首先将函数附加到对象上作为属性。这样可以将一个对象的方法用作通用的实用函数。

**警告：** 不要使用 `call()` 来链式调用构造函数（例如，实现继承）。这会将构造函数作为普通函数调用，这意味着 [`new.target`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/new.target) 的值为 `undefined`，而类会抛出错误，因为它们不能在没有 [`new`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/new) 的情况下被调用。请改用 [`Reflect.construct()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Reflect/construct) 或 [`extends`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Classes/extends)。

## [示例](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/call#示例)

### [使用 call() 调用函数并指定 this 值](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/call#使用_call_调用函数并指定_this_值)

在下面的示例中，当我们调用 `greet` 时，`this` 的值将绑定到对象 `obj`，即使 `greet` 不是 `obj` 的方法。

```js
function greet() {
  console.log(this.animal, "的睡眠时间一般在", this.sleepDuration, "之间");
}

const obj = {
  animal: "猫",
  sleepDuration: "12 到 16 小时",
};

greet.call(obj); // 猫 的睡眠时间一般在 12 到 16 小时 之间
```

### [使用 call() 在不指定第一个参数的情况下调用函数](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/call#使用_call_在不指定第一个参数的情况下调用函数)

如果省略第一个 `thisArg` 参数，则默认为 `undefined`。在非严格模式下，`this` 值将被替换为 [`globalThis`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/globalThis)（类似于全局对象）。

```js
globalThis.globProp = "Wisen";

function display() {
  console.log(`globProp 的值是 ${this.globProp}`);
}

display.call(); // 输出“globProp 的值是 Wisen”
```

在严格模式下，`this` 的值不会被替换，因此它保持为 `undefined`。

```js
"use strict";

globalThis.globProp = "Wisen";

function display() {
  console.log(`globProp 的值时 ${this.globProp}`);
}

display.call(); // 抛出 TypeError: Cannot read the property of 'globProp' of undefined
```

### [将方法转换为实用函数](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/call#将方法转换为实用函数)

`call()` 几乎等同于普通函数调用，只是将 `this` 作为普通参数传入，而不是作为函数所在的对象值。这类似于通用的实用函数的工作方式：你可以使用 `map(array, callback)` 来代替 `array.map(callback)`，这样可以避免对 `Array.prototype` 进行修改，还可以将 `map` 用于不是数组的类数组对象（例如 [`arguments`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Functions/arguments)）。

以 [`Array.prototype.slice()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/slice) 为例，你想要将类数组对象转换为真正的数组。你可以创建一个类似这样的快捷方式：

```js
const slice = Array.prototype.slice;

// ...

slice.call(arguments);
```

请注意，你不能将 `slice.call` 保存并将其作为普通函数调用，因为 `call()` 方法也会读取它的 `this` 值，而这个值应该是它要调用的函数。在这种情况下，你可以使用 [`bind()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/bind) 来绑定 `call()` 的 `this` 值。在下面的代码片段中，`slice()` 是一个绑定了 `this` 值为 [`Array.prototype.slice()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/slice) 的 [`Function.prototype.call()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/call) 的版本。这意味着额外的 `call()` 调用可以被省略：

```js
// 与前面示例中的“slice”相同
const unboundSlice = Array.prototype.slice;
const slice = Function.prototype.call.bind(unboundSlice);

// ...

slice(arguments);
```