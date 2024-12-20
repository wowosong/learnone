## 初始化脚手架

### 说明

1. Vue脚手架是Vue官方提供的标准化开发工具（开发平台）

2. 最新的版本是4.x
3. [文档 Vue CLi](https://cli.vuejs.org/zh/)（https://cli.vuejs.org/zh/）

### 具体步骤

1. 如果下载缓慢请配置**npm**淘宝镜像 **npm config set registry http://registry.npm.taobao.org**

2. 全局安装@vue/cli npm install -g @vue/li

3. 切换到创建项目的目录，使用命令创建项目**vue create XXX**

4. 选择使用**vue**的版本

5. 启动项目**npm run serve**

6. 打包项目**npm run build**

7. 暂停项目**Ctrl+C**

   Vue脚手架隐藏了所有webpack相关的配置，若想查看具体的webpack配置，请执行**vue inspect > output.js**

## 脚手架文件结构

<img src="https://learnone.oss-cn-beijing.aliyuncs.com/pic/202310311711338.png" alt="image-20221028201757096" style="zoom:50%;" /> 

src/components/School.vue

```html
<template>
  <!-- 组件结构 -->
  <div class="demo">
    <h2>{{ schoolName }}</h2>
    <h2>{{ address }}</h2>
    <button @click="click1">点我取x</button>
  </div>
</template>
<script>
//默认暴露
export default{
  name: "my-school",
  data() {
    return {
      schoolName: "尚硅谷",
      address: "成都"
    };
  },
  methods: {
    click1() {
      alert(this.schoolName);
    },
  },
}
</script>
<style>
/* 样式的注释 */
.demo {
  background-color: aqua;
}
</style>
```

src/components/Student.vue

```html
<template>
  <!-- 组件结构 -->
  <div class="demo">
    <h2>{{ studentName }}</h2>
    <h2>{{ age }}</h2>
  </div>
</template>
<script>
//默认暴露
export default{
  name: "my-student",
  data() {
    return {
      studentName: "黄久松",
      age: "30"
    };
  },
  methods: {
    click1() {
      alert(this.studentName);
    },
  },
};
</script>
<style>
/* 样式的注释 */
.demo {
  background-color: aqua;
}
</style>
```

src/App.vue

```html
<template>
    <div>
        <MySchool></MySchool>
        <MyStudent></MyStudent>
    </div>
</template>
<script>
import MySchool from "./components/School.vue";
import MyStudent from "./components/Student.vue";
export default {
  name: "App",
  components: {
    MySchool,
    MyStudent,
  },
};
</script>
<style>
</style>
```

src/main.js

```javascript
// 该文件是整个项目的入口文件
// 引入VUE
import Vue from 'vue'

// import Vue from 'vue/dist/vue'
// 引入App组件，是所有组件的父组件
import App from './App.vue'
// 关闭vue的生产提示
Vue.config.productionTip = false
// 创建VUE实例对象
new Vue({
  el:"#app",
  // 将APP组件放入容器中
  render: h => h(App),
  // render(createElement){
  //   console.log("render")
  //   return createElement("h1","你好啊")
  // }
  // template:"<h2>你好</h2>"
})//.$mount('#app')

```

public/index.html

```html
<!DOCTYPE html>
<html lang="">
  <head>
    <meta charset="utf-8">
    <!-- 针对IE浏览器的特殊配置，让IE浏览器以最高级别渲染页面 -->
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <!-- 开启移动端的理想视口 -->
    <meta name="viewport" content="width=device-width,initial-scale=1.0">
    <!-- 配置页签的图标 -->
    <link rel="icon" href="<%= BASE_URL %>favicon.ico">
    <!-- 配置网页的标题 -->
    <title><%= htmlWebpackPlugin.options.title %></title>
  </head>
  <body>
    <noscript>
      <!-- 当浏览器不支持js时noscript中的内容就会被渲染出来 -->
      <strong>We're sorry but <%= htmlWebpackPlugin.options.title %> doesn't work properly without JavaScript enabled. Please enable it to continue.</strong>
    </noscript>
    <div id="app"></div>
    <!-- built files will be auto injected -->
  </body>
</html>

```

## render函数

```javascript
// 该文件是整个项目的入口文件
// 引入VUE
import Vue from 'vue'

// import Vue from 'vue/dist/vue'
// 引入App组件，是所有组件的父组件
import App from './App.vue'
// 关闭vue的生产提示
Vue.config.productionTip = false
// 创建VUE实例对象
new Vue({
  el:"#app",
  // 将APP组件放入容器中
  render: h => h(App),
  // render(createElement){
  //   console.log("render")
  //   return createElement("h1","你好啊")
  // }
  // template:"<h2>你好</h2>"
})//.$mount('#app')

```

## 关于不同版本的函数

1.**vue.js**与**vue.runtime.xxx.js**的区别

​	a.vue.js是完整版的**Vue**，包含：核心功能+模板解析器

​	b.vue.runtime.xxx.js是运行版的Vue，只包含核心功能，没有模板解析器esm就是ES6 module

2.因为vue.runtime.xxx.js没有模版解析器，所以不能使用**template**配置项，需要使用render函数接收到**createElement**函数去指定具体内容

## vue.config.js配置文件

**vue inspect > output.js**可以查看到Vue脚手架的默认配置

使用**vue.config.js**可以对脚手架进行个性化定制，和**package.json**统计目录，详见配置参考｜Vue CLi**https://cli.vuejs.org/zh/config/#vue-config-js**

```
module.exports={
	pages:{
		index:{
			entry:'src/index/main.js'//入口
		}
	},
	lineOnSave:false //关闭语法检查
}
```

