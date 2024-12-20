## Vue简介

### 官网

1) 英文官网: https://vuejs.org/

2. 中文官网: https://cn.vuejs.org/

### 介绍与描述

- Vue是一套用来动态**构建用户界面的渐进式JavaScript框架**
  - 构建用户界面：把数据通过某种办法变成用户界面
  - 渐进式：Vue可以自底向上逐层的应用，简单应用只需要一个轻量小巧的核心库，复杂应用可以引入各式各样的Vue插件
- 作者：尤雨溪

![image-20221025145403655](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202310311622460.png)

### Vue的特点

1. 遵循MVVM模式
2. 编码简洁，体积小，运行效率高，适合移动/PC端开发
3. 它本身只关注UI，可以引入其他第三方库开发项目
4. 采用组件化 模式，提高代码复用率，且让代码更好维护

![image-20221025145525161](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202310311622796.png) 

5. 声明式编码，让编码人员无需直接操作DOM，提高开发 效率

![image-20221025150517366](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311062158012.png)

   使用虚拟DOM和Diff算法，尽量复用DOM节点

![image-20221025150611885](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311062158765.png) 

### 与其他JS框架的关联

   1. 借鉴 angular 的**模板**和**数据绑定**技术
   2. 借鉴 react 的**组件化**和**虚拟 DOM** 技术

### Vue周边库
​	vue-cli: vue 脚手架

​	vue-resource(axios): ajax 请求

​	vue-router: 路由

​	vuex: 状态管理

​	vue-lazyload: 图片懒加载

​	vue-scroller: 页面滑动相关

​	mint-ui: 基于 vue 的 UI 组件库(移动端)

​	element-ui: 基于 vue 的 UI 组件库(PC 端)

## 初识Vue

前置工作

1. 给浏览器安装Vue Devtools插件

2. 标签引入Vue包

3. （可选）阻止Vue在启动是生成生产提示，Vue.config.productionTip = false

初识Vue

1. 想让Vue工作，就必须创建一个Vue实例，且要写入一个配置对象

2. root容器里的代码依然符合html规范，只不过混入了一些特殊的Vue语法

3. root容器里的代码被称为**Vue模板**

4. Vue实例与容器是**一一对应**的

5. 真实开发中只有一个Vue实例，并且会配合着组件一起使用

6. \{ \{xxx\} \}中的xxx必须要写js表达式，且xxx可以自动读取到data中的所有属性

   注意区分：js表达式和js代码（语句）

    a.表达式：一个表达式会产生一个值，可以放在任何一个需要值的地方

    `a   a+b   demo(1)    x===y?'a':'b'`

   b.js代码（语句）

    `if(){}  for(){}`

7. 一旦data中的数据发生变化，那么模板中用到该数据的地方也会自动更新

```html
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <title>Vue初识</title>
        <!-- 引入vue -->
        <script type="text/javascript" src="js/vue.js"></script>
    </head>

    <body>
        <!-- 准备一个容器 -->
        <div id="root">
            <p> {{name}}</p>
            <p>{{address}}</p>
        </div>

    </body>
    <script type="text/javascript" >
        Vue.config.productionTip = false //阻止vue在启动时生成生产提示
        const vm = new Vue({
            el: "#root",//el用于指定当前vue实例为哪个容器服务,值通常为css选择器字符串.
            data: { //data中的用于存储数据,数据供el所指定的容器使用,值我们暂时先写成一个对象
                name: "huangjiusong",
                address: "chengdu"
            }
        })
        console.log(vm)
    </script>
</html>

```

   

