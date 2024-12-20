## 非单文件组件

 Vue使用组件的三大步骤：

  **一：定义组件（创建组件）**

  **二：注册组件**

  **三：使用组件（写组件标签）**

一、如何定义一个组件？

使用Vue.extend(options)创建，其中options和new Vue(options)时传入的那个options一样，但也有点区别。

区别如下：

  1.el不要写，为什么？ 最终所有的组件都要经过一个vm的管理，由从vm中的el决定哪个容器。

  2.data必须编写成函数，为什么？  避免组件被复用时，数据存在引用关系。

  备注：使用template可以配置组件结构

二、如何注册组件？

 1.局部注册：由new Vue的时候传入components选项

 2.全局注册：靠Vue.component('组件名',组件)

三、编写组件标签

  \<school>\</school>

```html
<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <title>组件化编程</title>
    <script type="text/javascript" src="js/vue.js"></script>
</head>

<!-- Vue使用组件的三大步骤：
    一：定义组件（创建组件）
    二：注册组件
    三：使用组件（写组件标签）
一、如何定义一个组件？
使用Vue.extend(options)创建，其中options和new Vue(options)时传入的那个options一样，但也有点区别。
区别如下：
    1.el不要写，为什么？ 最终所有的组件都要经过一个vm的管理，由从vm中的el决定哪个容器。
    2.data必须编写成函数，为什么？  避免组件被复用时，数据存在引用关系。
    备注：使用template可以配置组件结构
二、如何注册组件？
    1.局部注册：由new Vue的时候传入components选项
    2.全局注册：靠Vue.component('组件名',组件)
三、编写组件标签
    <school></school> -->
<body>
    <div id="root">
        <h2>{{msg}}</h2>
        <hr>
        <!-- <h2>{{schoolName}}</h2>
        <h2>{{address}}</h2>
        <h2>{{studentName}}</h2>
        <h2>{{age}}</h2> -->
        <!-- 第三步：编写组件标签 -->
        <hello></hello>
        <student></student>
        <hr>
        <school></school>
        <hr>
    </div>
<div id="root2">
    <!-- <student></student> -->
    <hello></hello>
</div>
</body>
<script type="text/javascript">
    Vue.config.productionTip = false
    const school = Vue.extend({
        // el:"#root",
        template: `<div>
            <h2>{{schoolName}}</h2>
            <h2>{{address}}</h2>
            <button @click="showName">点我提示学校名</button>
            </div>`,
        data() {
            return {
                schoolName: "尚硅谷",
                address: "成都"
            }
        },
        methods: {
            showName() {
                alert(this.schoolName)
            }
        }
    })
    const student = Vue.extend({
        template: `<div>
            <h2>{{studentName}}</h2>
        <h2>{{age}}</h2>
            </div>`,
        data() {
            return {
                studentName: "黄久松",
                age: 30
            }
        }
    })
    // 创建hello组件
    const hello=Vue.extend({
        template:`<div>
            <h2>你好，{{name}}</h2></div>`,
        data(){
            return {
                name:"张三丰"
            }
        }
    })
    
    // 全局注册组件
    Vue.component("hello",hello)
    const vm = new Vue({
        el: "#root",
        data: {
            msg: "你好"
        },
        // data:{
        //     schoolName:"12314",
        //     address:"chengdu",
        //     studentName:"111",
        //     age:"43"
        // }
        // 第二步：局部注册
        components: {
            // xuexiao: school,
            // xuesheng: student
            school,
            student
        }
    })
    new Vue({
        el:'#root2',
        data:{

        },
        // components:{
        //     student
        // }
    })
</script>

</html>
```

## 组件注意事项

```html
几个注意点：
    1.关于组件名：
        一个单词组成：  
            第一种写法（首写字母小写）：school
            第二种写法（首写字母大写）：School
        多个单词组成：
            第一种写法（kebab-case命名)：my-school
            第二种写法（CamelCase命名）：MySchool（需要VUE脚手架支持）
        备注：
            （1）组件名尽可能回避HTML汇总已有的元素名称，例如：h1/H1都不行
            （2）可以使用name配置项指定组件在开发工具中呈现的名字。
    2.关于组件标签
        第一种写法：<school></school>
        第二种写法：<school/>
        备注：不用使用脚手架时，<school/>会导致后面的组件不能渲染。
    3.一个简写方式：
        const school=Vue.extend(options)可简写为const school=options,因为父组件components引入时会自动创建
```

## 组件嵌套

![img](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311062206058.png)

```html
<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <title>组件嵌套</title>
    <script type="text/javascript" src="js/vue.js"></script>
</head>

<body>
    <div id="root">
        <hr>
        <!-- 第三步：编写组件标签 -->
        <!-- <school></school>
        <hello></hello> -->


        <!-- <app></app> -->
        <hr>
    </div>
</body>
<script type="text/javascript">
    Vue.config.productionTip = false

    // 定义子组件
    const student = Vue.extend({
        name: "Student", //可以配置显示在Vue开发工具中显示的名字
        template: `<div>
            <h2>{{name}}</h2>
            <h2>{{age}}</h2>
            </div>`,
        data() {
            return {
                name: "黄久松",
                age: 30
            }
        }
    })
    const hello = Vue.extend({
        template: `<h1>{{msg}}</h1>`,
        data() {
            return {
                msg: '你好'
            }
        }
    })
    const school = Vue.extend({
        // el:"#root",
        name: "SchoolTest", //可以配置显示在Vue开发工具中显示的名字
        template: `<div>
            <h2>{{schoolName}}</h2>
            <h2>{{address}}</h2>
            <student></student>
            </div>`,
        data() {
            return {
                schoolName: "尚硅谷",
                address: "成都"
            }
        },
        components: {
            student
        }
    })
    const app = Vue.extend({
        template: `
            <div>
                <school></school>
                <hello></hello>
                </div>    
        `,
        components: {
            school,
            hello
        }
    })
    const vm = new Vue({
        el: "#root",
        // components: {
        //     school,
        //     hello
        // }
        template:`<app></app>`,
        components:{
            app
        }
    })
</script>

</html>
```

## VueComponent

关于VueComponent：
    1.school组件本质是一个名为VueCOmponent的构造函数，且不是程序员定义的，是Vue.extend生成的

​    2.我们只需要写\<school>\</school>或\<school/>，Vue解析时会帮我们创建school组件的实例对象

​        即Vue帮我们执行的：new VueComponent(options)

​    3.特别注意： 每次调用Vue.extend,返回的都是一个全新的VueComponent！！！！

​    4.关于this的指向：

​        （1）组件配置中，

​            data函数、methods中的函数、watch中的函数，computed中的函数，它们的this均是【VueComponent实例对象】

​        （2）new Vue(options)配置中：

​            data函数、methods中的函数、watch中的函数，computed中的函数，它们的this均是【Vue实例对象】

​    5.VueComponent的实例对象，以后简称vc(也可称之为：组件实例对象)

​        Vue的实例对象，以后简称vm。 

```html
<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <title>VueComponent</title>
    <script type="text/javascript" src="js/vue.js"></script>
</head>



<body>
    <div id="root">
        <school></school>
        <hello></hello>
    </div>
</body>
<script type="text/javascript">
    Vue.config.productionTip = false
    const test = Vue.extend({
        template: `<span>test</span>`,
    })
    const hello = Vue.extend({
        template: `<div><h1>{{msg}}</h1>
            <test></test>
            </div>`,
        data() {
            return {
                msg: "你好帅"
            }
        },
        components: {
            test
        }
    })
    const school = Vue.extend({
        name: "SchoolTest", //可以配置显示在Vue开发工具中显示的名字
        template: `<div>
            <h2>{{schoolName}}</h2>
            <h2>{{address}}</h2>
            <button @click="showName">点我提示学校名称</button>
            </div>`,
        data() {
            return {
                schoolName: "尚硅谷",
                address: "成都"
            }
        },
        methods: {
            showName() {
                console.log("@", this);
                console.log("学校名称：" + this.schoolName);
            }
        }
    })
    // console.log("@",school);
    // console.log("@",hello);
    const vm = new Vue({
        el: "#root",
        components: {
            school,
            hello
        }
    })
    console.log("@", vm)
</script>

</html>
```

## 一个重要的内置关系

一个重要的内置关系：**VueComponent.prototype.__proto===Vue.prototype**

 为什么要有这个关系：让组件实例对象（vc)可以访问Vue原型上的属性和方法

![img](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311062206144.png)


# Vue组件化编程

## 模块与组件/模块化与组件化

98	 

![image.png](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311062206913.png)

**模块**

a. 理解：向外提供特定功能的js程序，一般就是一个js文件

b.为什么：js文件很多很复杂

c.作用：复用/简化js的编写，提高js运行效率

**组件**

a.定义：用来实现**局部功能**的代码和**资源**的**集合**（html/js/css/image....）

b.为什么：一个洁面的功能很复杂

c.作用：复用编码，简化项目编码，提高运行效率

**模块化：**

当应用中的js都以模块来编写的，那这个应用就是一个模块化的应用

**组件化**：

当应用中的功能都是多组件的方式来编写的，那这个应用就是一个组件化的应用

## 非单文件组件

非单文件组件：一个文件中包含n个组件

单文件组件：一个文件只包含一个组件

### 基本使用
