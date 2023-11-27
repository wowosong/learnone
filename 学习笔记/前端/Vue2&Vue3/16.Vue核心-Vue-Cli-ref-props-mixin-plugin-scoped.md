## ref属性

**ref**被用来给元素或子组件注册引用信息（ID的替代者）

- 应用在**html**标签上获取的是真实的**DOM**元素，应用在组件标签上获取的是组件实例对象**vc**
- 使用方式
  - 打标识：\<h1 ref="xxx">\</h1>或\<School ref="xxx">\</School>
  - 获取：**this.$refs.xxx**

```html
<template>
    <div>
        <MySchool ref="sch"/>
        <h1 v-text="msg" ref="title"></h1>
        <MyStudent name='李四' sex='男'></MyStudent>
        <!-- <my-school></my-school> -->
        <my-student name='张三' sex="女" :age="40"></my-student>
        <button ref="btn" @click="showDom">输入DOM元素</button>
    </div>
</template>
<script>
import MySchool from "./components/School.vue";
import MyStudent from "./components/Student.vue";
export default {
  name: "App",
  data(){
   return {
     msg:"huangjiusong"
   }
  },
  components: {
    MySchool,
    MyStudent,
  },
  methods: {
    showDom(){
      console.log('@@@',this.$refs.title)
      console.log('@@@',this.$refs.sch)
      console.log('@@@',this.$refs.btn);
    }
  },
};
</script>
<style>

</style>
```

## props属性

配置项props

​      功能：让组件接收外部传过来的数据

​        (1)传递数据：

​            \<Demo name="xxx"/>

​        (2)接收数据：

​            第一种方式（只接收）: **props:['name']**

​            第二种方式：**props:{ name:String   }**

​            第三种方式（限制类型/限制必要性/指定默认值）

```javascript
props:{
 name:{
   type:String,//类型
   required:true,//必须性
   default:'老王',//默认值
  }
}
```

​            备注：

​            props是只读的，Vue底层会监测你对props的修改，如果进行了修改，就会发出警告，

​            若业务需求确实需要修改，那么请复制props内容到data中一份，然后去修改data中的数据

src/App.vue

```html
<template>
    <div>
        <MySchool ref="sch"/>
        <h1 v-text="msg" ref="title"></h1>
        <MyStudent name='李四' sex='男'></MyStudent>
        <!-- <my-school></my-school> -->
        <my-student name='张三' sex="女" :age="40"></my-student>
        <button ref="btn" @click="showDom">输入DOM元素</button>
    </div>
</template>
<script>
import MySchool from "./components/School.vue";
import MyStudent from "./components/Student.vue";
export default {
  name: "App",
  data(){
   return {
     msg:"huangjiusong"
   }
  },
  components: {
    MySchool,
    MyStudent,
  },
  methods: {
    showDom(){
      console.log('@@@',this.$refs.title)
      console.log('@@@',this.$refs.sch)
      console.log('@@@',this.$refs.btn);
    }
  },
};
</script>
<style>

</style>
```

src/components/Student.vue

```javascript
<template>
  <!-- 组件结构 -->
  <div class="demo">
    <h2>{{msg}}</h2>
    <h2>{{ name }}</h2>
    <h2>{{ myAge +1}}</h2>
    <h2>{{ sex }}</h2>
    配置项props
      功能：让组件接收外部传过来的数据
        (1)传递数据：
            <Demo name="xxx"/>
        (2)接收数据：
            第一种方式（只接收）
            props:['name']
            第二种方式：
            props:{
              name:String
            }
            第三种方式（限制类型/限制必要性/指定默认值）
            props:{
              name:{
                type:String,//类型
                required:true,//必须性
                default:'老王',//默认值
              }
            }
            备注：
            props是只读的，Vue底层会监测你对props的修改，如果进行了修改，就会发出警告，
            若业务需求确实需要修改，那么请复制props内容到data中一份，然后去修改data中的数据
    <button @click="updateAge">修改收到的年龄</button>
  </div>
</template>
<script>
//默认暴露
export default {
  name: "my-student",
  data() {
    console.log(this)
    return {
      msg:"test",
      myAge:this.age
    };
  },
  // 第一种方式
  // props: ["name", "sex", "age"],
  // 接收的同时对数据进行类型限制
  // 第二种方式
  // props:{
  //   name:String,
  //   age: Number,
  //   sex:String
  // },
  // 第三种方式
  props:{
    name:{
      type:String,
      required:true
    },
    age:{
      type:Number,
      default:99//默认值
    },
    sex:{
      type:String,
      required:true
    }
  },
  methods: {
    click1() {
      alert(this.name);
    },
    updateAge(){
      this.myAge++
    }
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

## mixin混入

功能：可以把多个组件公用的配置提取到一个混入对象

​    使用方式：

​      第一步定义混合，例如：

​      {

​        data(){...},

​        methods:{...}

​      }

​      第二步使用混入，例如：

​      （1）全局混入：Vue.mixin(xxx)

​        (2) 局部混入：mixins:['xxx']

备注：

​       1.组件和混入对象含有同名选项时，这些选项将以恰当的方式进行"合并"，在发生冲突时以组件优先

```javascript
export const hunhe2={
    data(){
        return{
            x:100,
            y:200
        }
    }
}
data() {
    return {
      name: "尚硅谷",
      address: "成都",
      x:2100
    };
  },
  created() {
    console.log(this.$data)
    address: "成都",name: "尚硅谷",x: 2100,y: 200
  },
```

 2.同名生命周期钩子将合并为一个数组，因此都将被调用。另外，混入对象的钩子将在组件自身钩子前调用

```javascript
export const hunhe={
    methods:{
        showName(){
            alert(this.name)
        }
    },
    mounted() {
        console.log("你好")
    },
}
mounted() {
	console.log("mixin...")
},
```

src/mixin.js

```javascript
export const hunhe={
    methods:{
        showName(){
            alert(this.name)
        }
    },
    mounted() {
        console.log("你好")
    },
}
export const hunhe2={
    data(){
        return{
            x:100,
            y:200
        }
    }
}
```

src/components/SchoolMixin.vue

```html

<template>
  <!-- 组件结构 -->
  <div class="demo">
    <h2 @click="showName">{{ name }}</h2>
    <h2>{{ address }}</h2>
  </div>
</template>
<script>
import {hunhe,hunhe2} from '../mixin';
//默认暴露
export default{
  name: "my-min-school",
  data() {
    return {
      name: "尚硅谷",
      address: "成都",
      x:2100
    };
  },
  created() {
    console.log(this.$data)
  },
  mounted() {
    console.log("mixin...")
  },
  mixins:[hunhe,hunhe2]
}
</script>
<style>
/* 样式的注释 */
.demo {
  background-color: aqua;
}
</style>
```

src/components/StudentMixin.vue

```javascript
<template>
  <!-- 组件结构 -->
  <div class="demo">
    <!-- 功能：可以把多个组件公用的配置提取到一个混入对象
    使用方式：
      第一步定义混合，例如：
      {
        data(){...},
        methods:{...}
      }
      第二步使用混入，例如：
      （1）全局混入：Vue.mixin(xxx)
       (2) 局部混入：mixins:['xxx']
       备注：
       1.组件和混入对象含有同名选项时，这些选项将以恰当的方式进行"合并"，在发生冲突时以组件优先
       2.同名生命周期钩子将合并为一个数组，因此都将被调用。另外，混入对象的钩子将在组件自身钩子前调用
        -->
        <h2 @click="showName">姓名：{{name}}</h2>
    <h2>性别：{{ sex }}</h2>
  </div>
</template>
<script>
//默认暴露
//引入一个混合
import {hunhe} from '../mixin'
export default {
  name: "my-min-student",
  data() {
    return {
      name:"test",
      sex:'男'
    };
  },
  mixins:[hunhe]
};
</script>
<style>

</style>
```

src/App.vue

```html
<template>
    <div>
        <!-- <MySchool ref="sch"/>--->
        <!-- <h1 v-text="msg" ref="title"></h1> -->
        <!-- <MyStudent name='李四' sex='男'></MyStudent> -->
        <!-- <my-school></my-school> -->
        <!-- <my-student name='张三' sex="女" :age="40"></my-student> -->
        <!-- <button ref="btn" @click="showDom">输入DOM元素</button> -->
        <my-student-min></my-student-min>
        <my-school-min></my-school-min>
    </div>
</template>
<script>
    // import MySchool from "./components/School.vue";
    // import MyStudent from "./components/Student.vue";
    import MyStudentMin from "./components/StudentMixin.vue";
    import MySchoolMin from "./components/SchoolMixin.vue";
    export default {
        name: "App",
        data(){
            return {
                msg:"huangjiusong"
            }
        },
        components: {
            // MySchool,
            // MyStudent,
            MyStudentMin,
            MySchoolMin
        }
        // methods: {
        //   showDom(){
        //     console.log('@@@',this.$refs.title)
        //     console.log('@@@',this.$refs.sch)
        //     console.log('@@@',this.$refs.btn);
        //   }
        // },
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
import {hunhe,hunhe2} from './mixin'
// 关闭vue的生产提示
Vue.config.productionTip = false
Vue.mixin(hunhe)
Vue.mixin(hunhe2)
// 创建VUE实例对象
new Vue({
    el:"#app",
    // 将APP组件放入容器中
    render: h => h(App)
    // render(createElement){
    //   console.log("render")
    //   return createElement("h1","你好啊")
    // }
    // template:"<h2>你好</h2>"
})//.$mount('#app')

```

## plugin插件

插件

功能：用于增强Vue

本质：包含install 方法的一个对象，install的第一个参数是Vue，第二个以后的参数时插件使用者传递的数据。

定义插件：

​    对象.install=function (Vue,options){

​        //1.添加全局过滤器

​        Vue.filter(...)

​        //2.添加全局指令

​        Vue.directives(...)

​        //3.配置全局混入（合）

​        Vue.mixin(...)

​        4.添加实例方法

​        Vue.prototype.#myMethod=function(){...}

​        Vue.prototype.$myProperty=xxx

​    }

## scoped

scope

1.作用：让样式在局部生效，防止冲突

2.写法：\<style scoped>