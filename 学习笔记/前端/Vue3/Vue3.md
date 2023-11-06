# 【Vue】带你快速上手Vue3 - 使用 - Composition API - 响应式原理 - 新特性

> 本文是根据B站尚硅谷的视频[《尚硅谷Vue2.0+Vue3.0全套教程，全网最新最强vuejs从入门到精通》](https://link.juejin.cn/?target=https%3A%2F%2Fwww.bilibili.com%2Fvideo%2FBV1Zy4y1K7SH%3Fp%3D136 "https://www.bilibili.com/video/BV1Zy4y1K7SH?p=136") Vue3部分形成的笔记

# 一、简介

2020年9月18日，Vue.js发布3.0版本，代号：One Piece（海贼王）

[github.com/vuejs/vue-n…](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Fvuejs%2Fvue-next%2Freleases%2Ftag%2Fv3.0.0 "https://github.com/vuejs/vue-next/releases/tag/v3.0.0")

> 新事物的出现一定会有他的意义，所以我们先来看看Vue3相比Vue2有哪些改进呢？

### 1.性能的提升

*   打包大小减少**41%**
    
*   初次渲染快**55%**, 更新渲染快**133%**
    
*   内存减少**54%**
    

> 以上数据来自官方，看到这，学习Vue3的热情又高涨了一些

### 2.源码的升级

*   **使用`Proxy`代替`defineProperty`实现响应式**
    
*   重写虚拟`DOM`的实现和`Tree-Shaking`
    

> 博主之前的源码系列笔记都是Vue2的，这次就来对比学习吧

### 3.拥抱TypeScript

*   Vue3可以更好的支持`TypeScript`

> 不说了，下一个要学的技术栈就是TS！！！

### 4.新的特性

1.  Composition API（组合API）
    
    *   **`setup`配置**
    *   **`ref`与`reactive`**
    *   **`watch`与`watchEffect`**
    *   **`provide`与 `inject`**
2.  新的内置组件
    
    *   `Fragment`
    *   `Teleport`
    *   `Suspense`
3.  其他改变
    
    *   新的生命周期钩子
    *   **`data` 选项应始终被声明为一个函数**
    *   移除`keyCode`支持作为 `v-on` 的修饰符

> 这里有很多新名词，别着急，我们 ~快速~ 慢慢上手！

# 二、创建一个Vue项目

## 1\. 使用 vue-cli 创建

官方文档：[cli.vuejs.org/zh/guide/cr…](https://link.juejin.cn/?target=https%3A%2F%2Fcli.vuejs.org%2Fzh%2Fguide%2Fcreating-a-project.html%23vue-create "https://cli.vuejs.org/zh/guide/creating-a-project.html#vue-create")

```bash
## 查看@vue/cli版本，确保@vue/cli版本在4.5.0以上
vue --version
## 安装或者升级你的@vue/cli
npm install -g @vue/cli
## 创建Vue项目，选择Vue3
vue create vue_test
## 启动
cd vue_test
npm run serve
```

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311062207462.webp)

当然也可以用可视化面板创建

> 博主认为，作为前端开发工程师，一切的可视化都是好的！！哈哈，我喜欢用可视化面板，包括git的操作，我也喜欢用VScode的可视化面板操作

```shell
vue ui 
```

创建项目的时候预设选择Vue3即可 
![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311062207300.png)
![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311062207003.png)

## 2\. 使用 vite 创建

官方文档：[v3.cn.vuejs.org/guide/insta…](https://link.juejin.cn/?target=https%3A%2F%2Fv3.cn.vuejs.org%2Fguide%2Finstallation.html%23vite "https://v3.cn.vuejs.org/guide/installation.html#vite")

vite官网：[vitejs.cn](https://link.juejin.cn/?target=https%3A%2F%2Fvitejs.cn "https://vitejs.cn")

* 什么是vite？—— 是Vue团队打造的新一代前端构建工具。
* 优势如下：
  
    *   开发环境中，无需打包操作，可快速的冷启动。
    *   轻量快速的热重载（HMR）。
    *   真正的按需编译，不再等待整个应用编译完成。
* 传统构建 与 vite构建对比图
 ![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311062208933.png) 
  **传统构建模式，是将所有资源都打包好，再上线**
  ![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311062208237.png)

 而Vite有点按需加载的意思在那里了~

接下来我们就用Vite来创建一个Vue3的项目

```powershell
## 创建工程
npm init vite-app yk_vue3
## 进入工程目录
cd yk_vue3
## 安装依赖
npm install
## 运行
npm run dev

```

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311062208403.png)
构建速度明显vite快 
![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311062208811.png)

> 项目构建完了，我们就来看看Vue3与Vue2在直观上，有哪些区别吧~

# 三、分析文件目录

## main.js

Vue2项目的main.js

```javascript
import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')

```

看看vm是什么

```javascript
const vm = new Vue({
  render: h => h(App),
})

console.log(vm)

vm.$mount('#app')

```
![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311062208726.png) 

我们再来看看Vue3项目中的main.js

```javascript
import { createApp } from 'vue'
import App from './App.vue'

createApp(App).mount('#app')

```

我们来分析一下吧

```javascript
// 引入的不再是Vue构造函数了，引入的是一个名为createApp的工厂函数
import { createApp } from 'vue'
import App from './App.vue'

// 创建应用实例对象——app(类似于之前Vue2中的vm，但app比vm更“轻”)
const app = createApp(App)
console.log(app)
// 挂载
app.mount('#app')


```

这里的app到底是啥，我们输出到控制台看看
![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311062208153.png)

## App.vue

我们再来看看组件

**在`template`标签里可以没有根标签了**

```html
<template>
	<!-- Vue3组件中的模板结构可以没有根标签 -->
	<img alt="Vue logo" src="./assets/logo.png">
	<HelloWorld msg="Welcome to Your Vue.js App"/>
</template>
```

> 接下来我们就来正式的学习Vue3的内容了~

# 四、Composition API

官方翻译的是组合式 API

官方文档: [v3.cn.vuejs.org/guide/compo…](https://link.juejin.cn/?target=https%3A%2F%2Fv3.cn.vuejs.org%2Fguide%2Fcomposition-api-introduction.html "https://v3.cn.vuejs.org/guide/composition-api-introduction.html")

在Vue2中，我们使用的是Options API ，配置项式的API，我们要创建一个Vue实例，然后在里面传入一个配置对象，里面要写data、methods、watch等的东西，而Vue3提出了全新的 Composition API，组合式API，我们不用直接创建Vue实例，而是创建一个app，然后按需引入需要的API，来进行使用...

> 1、2小节内容可以先跳过，看完这一章回来再看这个对比图效果更佳

## 1.Options API 存在的问题

使用传统Options API（配置式API）中，新增或者修改一个需求，就需要分别在data，methods，computed里修改 。

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311062208785.webp)

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311062208432.webp)

## 2.Composition API 的优势

我们可以更加优雅的组织我们的代码，函数。让相关功能的代码更加有序的组织在一起。

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311062208739.webp) 

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311062208977.webp)

> 看不明白不要慌，学完下面的内容，再回来看你就懂了~

## 3\. 常用的Composition API

### ① 拉开序幕的`setup`

1.  理解：Vue3.0中一个新的配置项，值为一个函数。
2.  `setup`是所有**Composition API（组合API）**_“ 表演的舞台 ”_。
3.  **组件中所用到的：数据、方法等等，均要配置在`setup`中。**
4.  `setup`函数的两种返回值：
    1.  **若返回一个对象，则对象中的属性、方法， 在模板中均可以直接使用。（重点关注！）**
    2.  若返回一个渲染函数：则可以自定义渲染内容。（了解） (不常用)

```html
<template>
  <h1>博主的信息</h1>
  <h2>姓名：{{name}}</h2>
  <h2>年龄：{{age}}</h2>
  <h2>性别：{{gender}}</h2>
  <button @click="sayInfo">显示信息</button>
</template>

<script>
// import {h} from 'vue'
export default {
  name: "App",
  //此处只是测试一下setup，暂时不考虑响应式的问题。
  setup(){
    // 数据
    let name = "YK菌"
    let age = 18
    let gender = "男"

    // 方法
    function sayInfo(){
      alert(`你好${name}，你太厉害了吧`)
    }
    return {
      name,age, gender,sayInfo
    }
    // return ()=> h('h1','YK菌yyds')
  }
};
</script>

```

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311062209866.webp)

如果返回的是渲染函数

那你在`template`里写的模板都不奏效了，页面渲染的就是你写的h函数中的内容 

![img1](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311062209851.webp)

5.  注意点：
    1.  尽量**不要**与Vue2.x配置混用
        *   Vue2.x配置（data、methods、computed...）中**可以访问到**setup中的属性、方法。
        *   但在setup中**不能访问到**Vue2.x配置（data、methods、computed...）。
        *   如果有重名, `setup`优先。
    2.  `setup`不能是一个`async`函数，因为返回值不再是对象, 而是`promise`, 模板看不到return对象中的属性。（**后期也可以返回一个Promise实例，但需要Suspense和异步组件的配合**）

> 上面的数据不是响应式的数据，我们修改它，页面不会有更新，如何定义响应式的数据呢？

### ② `ref` 函数

*   作用: 定义一个**响应式**的数据
*   语法: `const xxx = ref(initValue)`
    *   创建一个包含响应式数据的**引用对象（reference对象，简称ref对象）**。
    *   **JS中操作数据： `xxx.value`**
    *   **模板中读取数据: 不需要`.value`，直接：`<div>{{xxx}}</div>`**
*   备注：
    *   接收的数据可以是：基本类型、也可以是对象类型。
    *   基本类型的数据：响应式依靠的是类上的`getter`与`setter`完成的（我们等下看下源码你就知道了）。
    *   对象类型的数据：内部 _“ 求助 ”_ 了Vue3.0中的一个新函数—— `reactive`函数。

```html
<template>
  <h1>博主的信息</h1>
  <h2>姓名：{{ name }}</h2>
  <h2>年龄：{{ age }}</h2>
  <h2>职业： {{ job.type }}</h2>
  <h2>工资：{{ job.salary }}</h2>
  <button @click="sayInfo">显示信息</button>
  <button @click="changeInfo">修改信息</button>
</template>

<script>
import { ref } from "vue";
export default {
  name: "App",
  setup() {
    // 数据
    let name = ref("YK菌");
    let age = ref(18);
    let job = ref({
      type: "前端工程师",
      salary: "30K",
    });
    // 方法
    function sayInfo() {
      alert(`你好${name.value}，你太厉害了吧，薪水${job.value.salary}这么高`);
    }
    function changeInfo() {
      name.value = "三十年后的YK菌";
      age.value = 48;
      job.value.type = "工程师";
      job.value.salary = "200K";
    }
    return {
      name,
      age,
      job,
      sayInfo,
      changeInfo,
    };
  },
};
</script>
```

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311062210296.webp)

通过看源码可以知道调用ref会返回一个RefImpl的实例对象，RefImpl类中有getter和setter可以检测到数据的变化

```js
function ref(value) {
    return createRef(value, false);
}

function createRef(rawValue, shallow) {
    if (isRef(rawValue)) {
        return rawValue;
    }
    return new RefImpl(rawValue, shallow);
}

class RefImpl {
    constructor(value, _shallow) {
        this._shallow = _shallow;
        this.dep = undefined;
        this.__v_isRef = true;
        this._rawValue = _shallow ? value : toRaw(value);
        this._value = _shallow ? value : convert(value);
    }
    get value() {
        trackRefValue(this);
        return this._value;
    }
    set value(newVal) {
        newVal = this._shallow ? newVal : toRaw(newVal);
        if (hasChanged(newVal, this._rawValue)) {
            this._rawValue = newVal;
            this._value = this._shallow ? newVal : convert(newVal);
            triggerRefValue(this, newVal);
        }
    }
}
```

### ③ `reactive`函数

*   作用: 定义一个**对象类型**的响应式数据（**基本类型不要用它，要用`ref`函数**）
*   语法：`const 代理对象= reactive(源对象)`接收一个对象（或数组），返回一个**代理对象（`Proxy`的实例对象，简称`proxy`对象）**
*   `reactive`定义的响应式数据是“深层次的”。
*   内部基于 ES6 的 `Proxy` 实现，通过代理对象操作源对象内部数据进行操作。

```html
<template>
  <h1>博主的信息</h1>
  <h2>姓名：{{ yk.name }}</h2>
  <h2>年龄：{{ yk.age }}</h2>
  <h2>职业： {{ yk.job.type }}</h2>
  <h2>工资：{{ yk.job.salary }}</h2>
  <h2>爱好：{{ yk.hobby }}</h2>
  <h3>测试数据：{{ yk.job.a.b.c }}</h3>
  <button @click="changeInfo">修改信息</button>
</template>

<script>
import { reactive } from "vue";
export default {
  name: "App",
  setup() {
    // 数据
    let yk = reactive({
      name: "YK菌",
      age: 18,
      hobby: ["写博客", "学习", "看书"],
      job: {
        type: "前端工程师",
        salary: "30K",
        a: {
          b: {
            c: 666,
          },
        },
      },
    });

    // 方法
    function changeInfo() {
      yk.name = "三十年后的YK菌";
      yk.age = 48;
      yk.job.type = "工程师";
      yk.job.salary = "200K";
      yk.job.a.b.c = 888;
      // 直接通过数组下标修改，可以触发响应式
      yk.hobby[0] = "写小说";
    }
    return {
      yk,
      changeInfo,
    };
  },
};
</script>
```

### ④ Vue3.0中的响应式原理

#### Vue2.x的响应式

*   实现原理
    
    *   对象类型：通过`Object.defineProperty()`对属性的读取、修改进行拦截（数据劫持）。
        
    *   数组类型：通过重写更新数组的一系列方法来实现拦截。（对数组的变更方法进行了包裹）。
        
        ```javascript
        Object.defineProperty(data, 'count', {
            get () {}, 
            set () {}
        })
        ```
    
*   存在问题
    
    *   **新增**属性、**删除**属性, 界面不会更新。
    *   直接通过**下标修改**数组, 界面不会自动更新。
*   解决方案
    
    *   **使用`Vue.set`、`Vue.delete`或者`vm.$set`、`vm.$delete`这些API**

模拟Vue2中实现响应式

```javascript
//源数据
let person = {
	name:'张三',
	age:18
}
//模拟Vue2中实现响应式
let p = {}
Object.defineProperty(p,'name',{
	configurable:true,
	get(){ //有人读取name时调用
		return person.name
	},
	set(value){ //有人修改name时调用
		console.log('有人修改了name属性，我发现了，我要去更新界面！')
		person.name = value
	}
})
Object.defineProperty(p,'age',{
	get(){ //有人读取age时调用
		return person.age
	},
	set(value){ //有人修改age时调用
		console.log('有人修改了age属性，我发现了，我要去更新界面！')
		person.age = value
	}
})

```

#### Vue3.0的响应式

上面例子中看到数组可以通过下标进行修改，我们再测试下**增加属性和删除属性**在Vue3中好不好使

```html
<template>
  <h1>博主的信息</h1>
  <h2>姓名：{{ yk.name }}</h2>
  <h2 v-show="yk.age">年龄：{{ yk.age }}</h2>
  <h2 v-show="yk.gender">性别：{{ yk.gender }}</h2>
  <h2>职业： {{ yk.job.type }}</h2>
  <h2>工资：{{ yk.job.salary }}</h2>
  <h2>爱好：{{ yk.hobby }}</h2>
  <h3>测试数据：{{ yk.job.a.b.c }}</h3>
  <button @click="changeInfo">修改信息</button>
  <button @click="addGender">增加性别</button>
  <button @click="deleteAge">删除年龄</button>
</template>

<script>
import { reactive } from "vue";
export default {
  name: "App",
  setup() {
    // 数据
    let yk = reactive({
      name: "YK菌",
      age: 18,
      hobby: ["写博客", "学习", "看书"],
      job: {
        type: "前端工程师",
        salary: "30K",
        a: {
          b: {
            c: 666,
          },
        },
      },
    });

    // 方法
    function changeInfo() {
      yk.name = "三十年后的YK菌";
      yk.age = 48;
      yk.job.type = "工程师";
      yk.job.salary = "200K";
      yk.a.b.c = 888;
      yk.hobby[0] = "写小说";
    }

    function addGender() {
      yk.gender = "男";
    }
    function deleteAge() {
      delete yk.age;
    }

    return {
      yk,
      changeInfo,
      addGender,
      deleteAge,
    };
  },
};
</script>

```

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311062211599.webp) 

*   实现原理
    *   通过 `Proxy`（代理）: **拦截对象中任意属性的变化, 包括：属性值的读写、属性的添加、属性的删除等**。
    *   通过`Reflect`（反射）: **对源对象的属性进行操作**。
    *   MDN文档中描述的`Proxy`与`Reflect`：
        *   Proxy：[developer.mozilla.org/zh-CN/docs/…](https://link.juejin.cn/?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fzh-CN%2Fdocs%2FWeb%2FJavaScript%2FReference%2FGlobal_Objects%2FProxy "https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Proxy")
            
        *   Reflect：[developer.mozilla.org/zh-CN/docs/…](https://link.juejin.cn/?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fzh-CN%2Fdocs%2FWeb%2FJavaScript%2FReference%2FGlobal_Objects%2FReflect "https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Reflect")
            

关于代理与反射，可以看这篇博文

模拟Vue3中实现响应式

```js
let person = {
	name:'YK菌',
	age:18
}

const p = new Proxy(person,{
	//有人读取p的某个属性时调用
	get(target,propName){
		console.log(`有人读取了p身上的${propName}属性`)
       // return target[propName]
		return Reflect.get(target,propName)
	},
	//有人修改p的某个属性、或给p追加某个属性时调用
	set(target,propName,value){
		console.log(`有人修改了p身上的${propName}属性，我要去更新界面了！`)
        // target[propName] = value
		return Reflect.set(target,propName,value)
	},
	//有人删除p的某个属性时调用
	deleteProperty(target,propName){
		console.log(`有人删除了p身上的${propName}属性，我要去更新界面了！`)
		// return delete target[propName]
       return Reflect.deleteProperty(target,propName)
	}
})

```

### ⑤ `reactive`对比`ref`

*   从**定义**数据角度对比
    *   `ref`用来定义：**基本类型数据**。
    *   `reactive`用来定义：**对象（或数组）类型数据**。
    *   备注：**`ref`也可以用来定义对象（或数组）类型数据, 它内部会自动通过`reactive`转为代理对象。**

* * *

*   从**原理**角度对比
    *   `ref`通过类中的的`getter`与`setter`来实现响应式（数据劫持）。
    *   `reactive`通过使用**Proxy**来实现响应式（数据劫持）, 并通过**Reflect**操作**源对象**内部的数据。

* * *

*   从**使用**角度对比
    *   **`ref`定义的数据：操作数据需要`.value`，读取数据时模板中直接读取不需要`.value`。**
    *   **reactive定义的数据：操作数据与读取数据：均不需要`.value`。**

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311062211758.png)

### ⑥ `setup`的两个注意点

*   `setup`执行的时机
    
    *   在`beforeCreate`之前执行一次，`this`是`undefined`。
*   `setup`的参数

**将`setup`接收的两个参数`(props, context)`打印在控制台，如下**
![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311062211814.png)

*   `props`：值为对象，包含：**组件外部传递过来，且组件内部声明接收了的属性**。
*   `context`：上下文对象
    *   `attrs`: 值为对象，包含：**组件外部传递过来，但没有在props配置中声明的属性, 相当于 `this.$attrs`。**
    *   `slots`: **收到的插槽内容, 相当于 `this.$slots`。**
    *   `emit`: **分发自定义事件的函数, 相当于 `this.$emit`。**

测试一下

App组件和HelloWorld组件

##### 父组件向子组件传递属性参数

```html
<template>
  <h1>博主的信息</h1>
  <HelloWorld msg="你好啊" school="ABC"></HelloWorld>
</template>

<script>
import HelloWorld from "./components/HelloWorld.vue";
export default {
  name: "App",
  components: { HelloWorld },
};
</script>

<style></style>

```

```html
<template>
  <h2>姓名：{{ yk.name }}</h2>
</template>

<script>
import { reactive } from "@vue/reactivity";
export default {
  name: "HelloWorld",
  props: ['msg'], // 不写全会报警告
  setup(props, context) {
    let yk = reactive({
      name: "YK菌",
    });
    console.log('props-----',props);
    console.log()
    console.log('context.attrs-----', context.attrs)
    return { yk };
  },
};
</script>

```
![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311062217907.png)

##### 自定义事件

```javascript
<template>
  <h1>博主的信息</h1>
  <HelloWorld @hello="showHelloMsg"></HelloWorld>
</template>

<script>
import HelloWorld from "./components/HelloWorld.vue";
export default {
  name: "App",
  setup() {
    function showHelloMsg(value) {
      alert(`你好啊，你触发了hello事件，我收到的参数是:${value}！`);
    }
    return { showHelloMsg };
  },
  components: { HelloWorld },
};
</script>

```

```javascript
<template>
  <h2>姓名：{{ yk.name }}</h2>
  <button @click="test">测试触发一下HelloWorld组件的Hello事件</button>
</template>

<script>
import { reactive } from "@vue/reactivity";
export default {
  name: "HelloWorld",
  emits:["hello"], // 不写能执行，但是会报警告
  setup(props, context) {
    let yk = reactive({
      name: "YK菌",
    });
    function test() {
      context.emit("hello", "**子组件的信息**");
    }
    return { yk,test };
  },
};
</script>

```
![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311062216568.png)
![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311062216766.png)

##### 插槽

默认插槽

```html
<template>
  <h1>博主的信息</h1>
  <HelloWorld>
    <span>YK菌，你好</span>
  </HelloWorld>
</template>
```

```html
<template>
  <h2>姓名：{{ yk.name }}</h2>
  <slot></slot>
</template>
```
![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311062216913.png)

具名插槽

```html
<template>
  <h1>博主的信息</h1>
  <HelloWorld>
	<template v-slot:ykMsg>
		<span>YK菌，你好</span>
	</template>
  </HelloWorld>
</template>
```

```html
<template>
  <h2>姓名：{{ yk.name }}</h2>
  <slot name="ykMsg"></slot>
</template>
```
![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311062213577.png)

### ⑦计算属性与监视

#### `computed`函数

*   与Vue2.x中`computed`配置功能一致
    
*   写法
    

```javascript
import {computed} from 'vue'

setup(){
    ...
	//计算属性 —— 简写
    let fullName = computed(()=>{
        return person.firstName + '-' + person.lastName
    })
    //计算属性 —— 完整
    let fullName = computed({
        get(){
            return person.firstName + '-' + person.lastName
        },
        set(value){
            const nameArr = value.split('-')
            person.firstName = nameArr[0]
            person.lastName = nameArr[1]
        }
    })
}
```

#### `watch`函数

*   与Vue2.x中`watch`配置功能一致
    
*   两个小“坑”：
    
    *   **监视`reactive`定义的响应式数据时：`oldValue`无法正确获取、强制开启了深度监视（`deep`配置失效）。**
    *   **监视`reactive`定义的响应式数据中某个属性时：`deep`配置有效。**

情况一：监视ref定义的响应式数据

```javascript
//情况一：监视ref定义的响应式数据
watch(sum,(newValue,oldValue)=>{
	console.log('sum变化了',newValue,oldValue)
},{immediate:true})
```

如果用ref定义了一个对象

```javascript
watch(person.value,(newValue,oldValue)=>{
	console.log('person变化了',newValue,oldValue)
}) 
```

或者这样

```javascript
watch(person,(newValue,oldValue)=>{
    console.log('person变化了',newValue,oldValue)
},{deep: true}
) 
```

情况二：监视多个ref定义的响应式数据

```javascript
//情况二：监视多个ref定义的响应式数据
watch([sum,msg],(newValue,oldValue)=>{
	console.log('sum或msg变化了',newValue,oldValue)
})
```

情况三：监视reactive定义的响应式数据

*   若watch监视的是reactive定义的响应式数据，则无法正确获得oldValue！！
*   若watch监视的是reactive定义的响应式数据，则强制开启了深度监视

```javascript
watch(person,(newValue,oldValue)=>{
	console.log('person变化了',newValue,oldValue)
},{immediate:true,deep:false}) //此处的deep配置不再奏效
```

情况四：监视reactive定义的响应式数据中的某个属性

```javascript
//情况四：监视reactive定义的响应式数据中的某个属性
watch(()=>person.job,(newValue,oldValue)=>{
	console.log('person的job变化了',newValue,oldValue)
},{immediate:true,deep:true}) 
```

情况五：监视reactive定义的响应式数据中的某些属性

```javascript
//情况五：监视reactive定义的响应式数据中的某些属性
watch([()=>person.job,()=>person.name],(newValue,oldValue)=>{
	console.log('person的job变化了',newValue,oldValue)
},{immediate:true,deep:true})
```

特殊情况

```javascript
//特殊情况
watch(()=>person.job,(newValue,oldValue)=>{
    console.log('person的job变化了',newValue,oldValue)
},{deep:true}) 
//此处由于监视的是reactive素定义的对象中的某个属性，所以deep配置有效
```

#### `watchEffect`函数

*   `watch`的套路是：既要指明监视的属性，也要指明监视的回调。
    
*   `watchEffect`的套路是：不用指明监视哪个属性，监视的回调中用到哪个属性，那就监视哪个属性。
    
*   `watchEffect`有点像`computed`：
    
    *   但`computed`注重的计算出来的值（回调函数的返回值），所以必须要写返回值。
    *   而`watchEffect`更注重的是过程（回调函数的函数体），所以不用写返回值。

```javascript
//watchEffect所指定的回调中用到的数据只要发生变化，则直接重新执行回调。
watchEffect(()=>{
    const x1 = sum.value
    const x2 = person.age
    console.log('watchEffect配置的回调执行了')
})
```

### ⑧ 生命周期

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311062213259.png)

*   Vue3.0中可以继续使用Vue2.x中的生命周期钩子，但有有两个被更名：
    *   `beforeDestroy`改名为 `beforeUnmount`
    *   `destroyed`改名为 `unmounted`

可以直接以配置项的形式使用生命周期钩子，也可以使用组合式API的形式使用，尽量统一

一般来说，组合式API里的钩子会比配置项的钩子先执行，组合式API的钩子名字有变化

*   Vue3.0也提供了 Composition API 形式的生命周期钩子，与Vue2.x中钩子对应关系如下：
    *   `beforeCreate`\===>`setup()`
    *   `created`\=======>`setup()`
    *   `beforeMount` ===>`onBeforeMount`
    *   `mounted`\=======>`onMounted`
    *   `beforeUpdate`\===>`onBeforeUpdate`
    *   `updated` =======>`onUpdated`
    *   `beforeUnmount` ==>`onBeforeUnmount`
    *   `unmounted` =====>`onUnmounted`

### ⑨ 自定义`hook`函数（重点）

*   什么是`hook`？—— 本质是一个函数，把`setup`函数中使用的Composition API进行了封装。
    
*   类似于vue2.x中的`mixin`。
    
*   自定义`hook`的优势: 复用代码，让`setup`中的逻辑更清楚易懂。
    

创建一个hooks文件夹，里面创建文件usePoint.js

```javascript
import { reactive, onMounted, onBeforeUnmount } from "vue";
export default function() {
  //实现鼠标“打点”相关的数据
  let point = reactive({
    x: 0,
    y: 0,
  });

  //实现鼠标“打点”相关的方法
  function savePoint(event) {
    point.x = event.pageX;
    point.y = event.pageY;
    console.log(event.pageX, event.pageY);
  }

  //实现鼠标“打点”相关的生命周期钩子
  onMounted(() => {
    window.addEventListener("click", savePoint);
  });

  onBeforeUnmount(() => {
    window.removeEventListener("click", savePoint);
  });

  return point;
}
```

在组件中使用

```html
<template>
	<h2>我是HelloWorld组件</h2>
	<h2>当前点击时鼠标的坐标为：x：{{point.x}}，y：{{point.y}}</h2>
</template>

<script>
	import usePoint from '../hooks/usePoint'
	export default {
		name:'HelloWorld',
		setup(){
			const point = usePoint()
			return {point}
		}
	}
</script>
```

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311062214627.webp)

### ⑩ `toRef`

*   作用：创建一个 `ref` 对象，其value值指向另一个对象中的某个属性。
    
*   语法：`const name = toRef(person,'name')`
    
*   应用: **要将响应式对象中的某个属性单独提供给外部使用时。**
    
*   扩展：`toRefs`与`toRef`功能一致，但可以批量创建多个 ref 对象，语法：`toRefs(person)`
    

```html
<template>
	<h4>{{person}}</h4>
	<h2>姓名：{{name}}</h2>
	<h2>年龄：{{age}}</h2>
	<h2>薪资：{{job.j1.salary}}K</h2>
	<button @click="name+='~'">修改姓名</button>
	<button @click="age++">增长年龄</button>
	<button @click="job.j1.salary++">涨薪</button>
</template>

<script>
	import {ref,reactive,toRef,toRefs} from 'vue'
	export default {
		name: 'Demo',
		setup(){
			//数据
			let person = reactive({
				name:'张三',
				age:18,
				job:{
					j1:{
						salary:20
					}
				}
			})

			// const name1 = person.name
			// console.log('%%%',name1)

			// const name2 = toRef(person,'name')
			// console.log('####',name2)

			const x = toRefs(person)
			console.log('******',x)

			return {
				person,
				// name:toRef(person,'name'),
				// age:toRef(person,'age'),
				// salary:toRef(person.job.j1,'salary'),
				...toRefs(person)
			}
		}
	}
</script>

```

# 五、其它 Composition API

## 1\. `shallowReactive` 与 `shallowRef`

*   `shallowReactive`：只处理对象最外层属性的响应式（浅响应式）。
    
*   `shallowRef`：只处理基本数据类型的响应式, 不进行对象的响应式处理。
    
*   什么时候使用?
    
    *   如果有一个对象数据，结构比较深, 但变化时只是外层属性变化 ===> `shallowReactive`。
    *   如果有一个对象数据，后续功能不会修改该对象中的属性，而是生新的对象来替换 ===> `shallowRef`。

## 2\. `readonly` 与 `shallowReadonly`

*   `readonly`: 让一个响应式数据变为只读的（深只读）。
*   `shallowReadonly`：让一个响应式数据变为只读的（浅只读）。
*   应用场景: 不希望数据被修改时。

## 3\. `toRaw` 与 `markRaw`

*   `toRaw`
    *   作用：将一个由`reactive`生成的**响应式对象**转为**普通对象**。
    *   使用场景：用于读取响应式对象对应的普通对象，对这个普通对象的所有操作，不会引起页面更新。
*   `markRaw`
    
    *   作用：标记一个对象，使其永远不会再成为响应式对象。
    *   应用场景:
        1.  有些值不应被设置为响应式的，例如复杂的第三方类库等。
        2.  当渲染具有不可变数据源的大列表时，跳过响应式转换可以提高性能。

## 4\. `customRef`

*   作用：创建一个自定义的 `ref`，并对其依赖项跟踪和更新触发进行显式控制。
    
*   实现防抖效果
    

```html
<template>
  <input type="text" v-model="keyWord" />
  <h3>{{ keyWord }}</h3>
</template>

<script>
import { customRef } from "vue";
export default {
  name: "App",
  setup() {
    //自定义一个ref——名为：myRef
    function myRef(value, delay) {
      let timer;
      return customRef((track, trigger) => {
        return {
          get() {
            console.log(`有人从myRef这个容器中读取数据了，我把${value}给他了`);
            track(); // 通知Vue追踪value的变化（提前和get商量一下，让他认为这个value是有用的）
            return value;
          },
          set(newValue) {
            console.log(`有人把myRef这个容器中数据改为了：${newValue}`);
            clearTimeout(timer);
            timer = setTimeout(() => {
              value = newValue;
              trigger(); // 通知Vue去重新解析模板
            }, delay);
          },
        };
      });
    }

    // let keyWord = ref('hello') //使用Vue提供的ref
    let keyWord = myRef("hello", 500); //使用程序员自定义的ref

    return { keyWord };
  },
};
</script>

```

## 5\. `provide` 与 `inject`
![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311062214124.png)

*   作用：实现**祖与后代组件间**通信
    
*   套路：父组件有一个 `provide` 选项来提供数据，后代组件有一个 `inject` 选项来开始使用这些数据
    
*   具体写法：
    

祖组件中：

```javascript
setup(){
	......
    let car = reactive({name:'奔驰',price:'40万'})
    provide('car',car) // 给自己的后代组件传递数据
    ......
}

```

后代组件中：

```javascript
setup(props,context){
	......
    const car = inject('car') // 拿到祖先的数据
    return {car}
	......
}

```

## 6\. 响应式数据的判断

*   `isRef`: 检查一个值是否为一个 `ref` 对象
*   `isReactive`: 检查一个对象是否是由 `reactive` 创建的响应式代理
*   `isReadonly`: 检查一个对象是否是由 `readonly` 创建的只读代理
*   `isProxy`: 检查一个对象是否是由 `reactive` 或者 `readonly` 方法创建的代理

Composition API 差不多就介绍完了，此时回去再看那个动图，就会感觉Vue3真香！

# 六、新的组件

## 1\. `Fragment`

*   在Vue2中: 组件必须有一个根标签
*   在Vue3中: 组件可以没有根标签, 内部会将多个标签包含在一个`Fragment`虚拟元素中
*   好处: 减少标签层级, 减小内存占用

## 2\. `Teleport`

*   什么是`Teleport`？—— `Teleport` 是一种能够将我们的**组件html结构**移动到指定位置的技术。

```html
<teleport to="移动位置">
	<div v-if="isShow" class="mask">
		<div class="dialog">
			<h3>我是一个弹窗</h3>
			<button @click="isShow = false">关闭弹窗</button>
		</div>
	</div>
</teleport>

```

以一个弹窗组件为示例来看看

我们来个嵌套的盒子，然后在最里面的盒子设置弹窗

App

```html
<template>
  <div class="app">
    <h3>我是App组件</h3>
    <Child />
  </div>
</template>

<script>
import Child from "./components/Child";
export default {
  name: "App",
  components: { Child },
};
</script>

<style>
.app {
  background-color: gray;
  padding: 10px;
}
</style>


```

Child

```html
<template>
  <div class="child">
    <h3>我是Child组件</h3>
    <Son />
  </div>
</template>

<script>
import Son from "./Son";
export default {
  name: "Child",
  components: { Son },
};
</script>

<style>
.child {
  background-color: skyblue;
  padding: 10px;
}
</style>


```

Son

```html
<template>
  <div class="son">
    <h3>我是Son组件</h3>
    <Dialog />
  </div>
</template>

<script>
import Dialog from "./Dialog.vue";
export default {
  name: "Son",
  components: { Dialog },
};
</script>

<style>
.son {
  position: relative;
  background-color: orange;
  padding: 10px;
}
</style>


```

Dialog

```html
<template>
  <div>
    <button @click="isShow = true">点我弹个窗</button>
    <div v-if="isShow" class="mask">
      <div class="dialog">
        <h3>我是一个弹窗</h3>
        <h4>一些内容</h4>
        <h4>一些内容</h4>
        <h4>一些内容</h4>
        <button @click="isShow = false">关闭弹窗</button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
export default {
  name: "Dialog",
  setup() {
    let isShow = ref(false);
    return { isShow };
  },
};
</script>

<style>
.mask {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.5);
}
.dialog {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  width: 300px;
  height: 300px;
  background-color: green;
}
</style>


```

我故意给最里面的盒子加了定位，因为相对定位会找他外层最近的定位盒子进行定位，所以效果就是这样了，我们希望这个弹窗是在body下呈现的
![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311062214192.png)
![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311062215276.png)

我们在Dialog组件中加一个`teleport`标签

```html
<template>
  <div>
    <button @click="isShow = true">点我弹个窗</button>
    <teleport to="body">
    <div v-if="isShow" class="mask">
      <div class="dialog">
        <h3>我是一个弹窗</h3>
        <h4>一些内容</h4>
        <h4>一些内容</h4>
        <h4>一些内容</h4>
        <button @click="isShow = false">关闭弹窗</button>
      </div>
    </div>
    </teleport>
  </div>
</template>

```

这样就好了
![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311062215920.png)
![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311062215629.png)

## 3\. `Suspense`

*   等待异步组件时渲染一些额外内容，让应用有更好的用户体验
    
*   使用步骤：
    
    *   异步引入组件

```javascript
import {defineAsyncComponent} from 'vue'
const Child = defineAsyncComponent(()=>import('./components/Child.vue'))

```

使用`Suspense`包裹组件，并配置好`default`与 `fallback`

```html
<template>
	<div class="app">
		<h3>我是App组件</h3>
		<Suspense>
			<template v-slot:default>
				<Child/>
			</template>
			<template v-slot:fallback>
				<h3>加载中.....</h3>
			</template>
		</Suspense>
	</div>
</template>

```

default：就是组件要显示的内容

fallback：就是组件没加载完全的“备胎”

# 七、其他

## 1.全局API的转移

*   Vue 2.x 有许多全局 API 和配置。
    *   例如：注册全局组件、注册全局指令等。

```javascript
//注册全局组件
Vue.component('MyButton', {
  data: () => ({
    count: 0
  }),
  template: '<button @click="count++">Clicked {{ count }} times.</button>'
})

//注册全局指令
Vue.directive('focus', {
  inserted: el => el.focus()
}

```

Vue3.0中对这些API做出了调整：

*   将全局的API，即：`Vue.xxx`调整到应用实例（`app`）上
    
    | 2.x 全局 API（`Vue`） | 3.x 实例 API (`app`) |
    | --- | --- |
    | Vue.config.xxxx | app.config.xxxx |
    | Vue.config.productionTip | **移除** |
    | Vue.component | app.component |
    | Vue.directive | app.directive |
    | Vue.mixin | app.mixin |
    | Vue.use | app.use |
    | Vue.prototype | app.config.globalProperties |
    

## 2.其他改变

### ① `data`选项应始终被声明为一个函数

### ② 过渡类名的更改

Vue2.x写法

```css
.v-enter,
.v-leave-to {
  opacity: 0;
}
.v-leave,
.v-enter-to {
  opacity: 1;
}

```

Vue3.x写法

```css
.v-enter-from,
.v-leave-to {
  opacity: 0;
}

.v-leave-from,
.v-enter-to {
  opacity: 1;
}

```

### ③ 移除`keyCode`作为 `v-on` 的修饰符，同时也不再支持`config.keyCodes`

### ④ 移除`v-on.native`修饰符

*   父组件中绑定事件

```javascript
<my-component
  v-on:close="handleComponentEvent"
  v-on:click="handleNativeClickEvent"
/>

```

子组件中声明自定义事件

```javascript
<script>
  export default {
    emits: ['close']
  }
</script>

```

### ⑤ 移除过滤器（filter）

> 过滤器虽然这看起来很方便，但它需要一个自定义语法，打破大括号内表达式是 “只是 JavaScript” 的假设，这不仅有学习成本，而且有实现成本！建议用方法调用或计算属性去替换过滤器。

# 参考

*   Vue3官方文档 [v3.cn.vuejs.org/](https://link.juejin.cn/?target=https%3A%2F%2Fv3.cn.vuejs.org%2F "https://v3.cn.vuejs.org/")
*   Vite官方文档 [cn.vitejs.dev/](https://link.juejin.cn/?target=https%3A%2F%2Fcn.vitejs.dev%2F "https://cn.vitejs.dev/")
*   Vue-cli官方文档 [cli.vuejs.org/zh/](https://link.juejin.cn/?target=https%3A%2F%2Fcli.vuejs.org%2Fzh%2F "https://cli.vuejs.org/zh/")
*   尚硅谷Vue3视频 [www.bilibili.com/video/BV1Zy…](https://link.juejin.cn/?target=https%3A%2F%2Fwww.bilibili.com%2Fvideo%2FBV1Zy4y1K7SH%3Fp%3D136 "https://www.bilibili.com/video/BV1Zy4y1K7SH?p=136")
