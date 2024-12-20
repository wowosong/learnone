## 收集表单数据

收集表单数据

  若：\<input type="text"> 则v-model收集的是value值，用户输入的就是value值

  若: \<input type="radio"> 则v-model收集的是value值，且要给标签配置value值

  若：\<input type="checkbox"> 

​    1.没有配置input的value属性，那么收集的就是checked（勾选or未勾选，是布尔值）

​    2.配置input的value值：

​      （1）v-model的初始值是非数组，那么收集的就是checked（勾选or未勾选，是布尔值）

​      （2）v-model的初始值是数组，那么收集的就是value组成的数组

​    备注：v-model的三个修饰符：

​      lazy：失去焦点再收集数据

​      number：输入字符串转为有效的数字

​      trim：输入首尾空格过滤

```html
<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <title>收集表单数据</title>
    <script type="text/javascript" src="js/vue.js"></script>
</head>

<body>

    收集表单数据
    若：<input type="text"> 则v-model收集的是value值，用户输入的就是value值
    若: <input type="radio"> 则v-model收集的是value值，且要给标签配置value值
    若：<input type="checkbox"> 
        1.没有配置input的value属性，那么收集的就是checked（勾选or未勾选，是布尔值）
        2.配置input的value值：
            （1）v-model的初始值是非数组，那么收集的就是checked（勾选or未勾选，是布尔值）
            （2）v-model的初始值是数组，那么收集的就是value组成的数组
        备注：v-model的三个修饰符：
            lazy：失去焦点再收集数据
            number：输入字符串转为有效的数字
            trim：输入首尾空格过滤
    <div id="root">
        <form @submit.prevent="demo">
            <!-- <label for="demo">账号：</label> -->
            账号： <input type="text" v-model.trim="userInfo.username"><br>
            密码：<input type="password" v-model="userInfo.password"><br>
            年龄：<input type="number" v-model.number="userInfo.age"> <br>
            性别：
            男<input type="radio" name="sex" value="male" v-model="userInfo.sex">
            女<input type="radio" name="sex" value="female" v-model="userInfo.sex"><br>
            爱好：
            学习<input type="checkbox" value="learn" name="hobby" v-model="userInfo.hobby">
            打游戏<input type="checkbox" value="playgame" name="hobby" v-model="userInfo.hobby">
            吃饭<input type="checkbox" value="eating" name="hobby" v-model="userInfo.hobby">
            <br>
            所属校区
            <select name="" value="" v-model="userInfo.city">
                <option value="beijing">北京</option>
                <option value="shanghai">上海</option>
                <option value="wuhan">武汉</option>
                <option value="shenzhen">深圳</option>
            </select><br>
            其他信息：
            <textarea name="" id="" cols="30" rows="10" v-model.lazy="userInfo.other"></textarea><br>
            <input type="checkbox" v-model="userInfo.agree">
            阅读并接受<a href="http://www.baidu.com">《用户协议》</a><br>
            <button>提交</button>
        </form>
    </div>

</body>
<script type="text/javascript">
    Vue.config.productionTip = false
    const vm = new Vue({
        el: '#root',
        data: {
            userInfo: {
                username: "",
                password: "",
                age:"",
                sex: "female",
                hobby: [],
                city: "beijing",
                other: "",
                agree: ""
            }

        },
        methods: {
            demo() {
                // console.log(this._data);
                // console.log(JSON.stringify(this._data));
                console.log(this.userInfo);
            }
        }
    })
</script>

</html>
```

## 过滤器（vue3已移除）

过滤器：

定义：对要显示的数据进行特定格式化后再显示（适用于一些简单逻辑的处理）

  语法：

​    **1.注册过滤器：Vue.filter(name,callback) 或new Vue(filters:{})**

​    **2.使用过滤器：{{xxx|过滤器名称}} 或v-bind:属性="xxx|过滤器名"**

  备注：

​    1.过滤器也可以接受额外参数，多个过滤器可以串联

​    2.并没有改变原本的数据，是产生新的对应的数据

```html
<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <title>过滤器</title>
    <script type="text/javascript" src="js/vue.js"></script>
    <script type="text/javascript" src="js/dayjs.js"></script>
</head>
过滤器：
定义：对要显示的数据进行特定格式化后再显示（适用于一些简单逻辑的处理）
    语法：
        1.注册过滤器：Vue.filter(name,callback) 或new Vue(filters:{})
        2.使用过滤器：{{xxx|过滤器名称}} 或v-bind:属性="xxx|过滤器名"

    备注：
        1.过滤器也可以接受额外参数，多个过滤器可以串联
        2.并没有改变原本的数据，是产生新的对应的数据
<body>

    <div id="root">
        <h2>显示格式化的时间</h2>
        <!-- 计算属性实现 -->
        <h3>现在的时间是{{fmtTime}}</h3>
        <!-- methods实现 -->
        <h3>现在的时间是{{getFmtTime()}}</h3>
        <h3>现在的时间3{{time|timeFormat("YYYY-MM-DD")|myslice}}</h3>
        <h3 :x="msg|myslice">尚硅谷</h3>
    </div>
    <div id="root2">
        <h2>现在{{name|myslice}}</h2>
    </div>

</body>
<script type="text/javascript">
    Vue.config.productionTip = false
    Vue.filter('myslice',function(value){
        return value.slice(0,4)
    })
    const vm = new Vue({
        el: '#root',
        data: {
            time:1666837026848,
            msg:"你好，尚硅谷"
        },
        methods: {
            getFmtTime(){
                return dayjs(this.time).format('YYYY年-MM月-DD日 HH:mm:ss')
            }
        },
        computed:{
            fmtTime(){
                return dayjs(this.time).format('YYYY年-MM月-DD日 HH:mm:ss')
            }
        },
        //局部过滤器
        filters:{
            timeFormat(value,format='YYYY年-MM月-DD日 HH:mm:ss'){
                return dayjs(value).format(format)
            },
            myslice(value){
                return value.slice(0,4)
            }
        }
    })
    new Vue({
        el:"#root2",
        data:{
            name:"huangjiusong"
        }
    })
</script>

</html>
```

## 内置指令

```html
<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <title>内置指令</title>
    <script type="text/javascript" src="js/vue.js"></script>
</head>

<body>
        <!-- 学过的指令：
        v-bind:单向绑定解析表达式，可简写为:xxx
        v-model:双向数据绑定
        v-for:遍历数组 对象 字符串
        v-on:绑定事件监听，可简写为@
        v-if:条件渲染（动态控制节点是否存在）
        v-else:条件渲染（动态控制节点是否存在）
        v-show:条件渲染（动态控制节点是否展示） -->


        <!-- v-text指令：
            1.作用：向其所在的节点中渲染文本内容
            2.与插值语法的区别：
                v-text会替换掉节点中的内容，{{xxx}}则不会 -->
        <!-- v-html命令
            1.作用：向指定节点中渲染包含html结构的内容。
            2.与插值语法的区别：
                （1）v-html会替换掉节点中的内容，{{xxx}}则不会
                （2）v-html可以识别html结构
            3.严重注意： v-html有安全性问题
                （1）在网站上动态渲染任何html是非常危险的，容易导致xss攻击。
                （2）一定要在可信的内容上使用v-html，永不要用在用户提交的内容上 -->
        <!-- v-cloak命令：
            1.本质是一个特殊属性，Vue实例创建完毕并接管容器后，会删掉v-cloak属性
            2.使用css配合v-cloak可以解决网速较慢时页面展示{{xxx}}的问题 -->
        <!-- v-once命令：
            1.v-once命令所在节点在初次动态渲染后，就被视为静态内容了。
            2.以后数据的改变就不会引起v-once所在节点的更新，可以用于性能优化 -->
            <!-- v-pre命令
            1.跳过其所在节点的编译过程
            2.可利用它跳过：没有使用指令语法、没有使用插值语法的节点，会加快编译 -->
    <div id="root">
        <h3>{{name}}</h3>
        <div v-text="str" style="font-size: 20px;"></div>
        <div v-html="str1"></div>
        <h2 v-cloak>{{name}}</h2>
        <h2 v-once>初始化：{{n}}</h2>
        <h2 >当前的值{{n}}</h2>
        <button  @click="n++">点我加1</button>
        <h2 >m的值{{m}}</h2>
        <!-- <button v-pre @click="m++">点我加2</button> -->
    </div>

</body>
<script type="text/javascript">
    Vue.config.productionTip = false
    const vm = new Vue({
        el: '#root',
        data: {
            name:"huangjiusong",
            str:"1234",
            str1:"<h3>你好</h3>",
            n:0,
            m:0
        },
        methods: {
        }
    })
</script>

</html>
```

## 自定义指令

```html
<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <title>自定义指令</title>
    <script type="text/javascript" src="js/vue.js"></script>
</head>
<!-- 需求1：定义一个v-big指令，和v-text指令功能类似，但会把绑定的数值方法10倍；
    需求2：定义一个v-fbind指令，和v-bind功能类似，但可以让其所绑定的input元素默认获取焦点 -->
        自定义指令总结：
        一、定义语法：
        （1）局部指令：
        new Vue({directives:{ 指令名：配置对象}}) 或new Vue({directives:{ 指令名：回调函数}})
        （2）全局指令：
        Vue.directive(指令名：配置对象) 或Vue.directive(指令名：回调函数)
        二、配置对象中常用的三个回调：
        （1）bind:指令与元素成功绑定时调用
        （2）inserted:指令所在元素被插入页面时被调用
        （3）update:指令所在模板结构被重新解析时调用。
        三、备注：
        1.指令定义时不加v-，但使用是要加v-；
        2.指令名如果是多个单词，要使用kebab-case命名方式，不要用驼峰命名。
<body>
    <div id="root">

        <h2>当前n的值：<span v-text="n"></span>
        </h2>
        <h2>放大10倍的n值:<span v-big="n"></span></h2>
        <button @click="n++">点我++</button>
        <h2>输入：<input type="text" v-fbind.value="n" /></h2>
    </div>

</body>
<script type="text/javascript">
    Vue.config.productionTip = false
    Vue.directive("fbind", {
        bind(e, b) {
            console.log("bind")
            e.value = b.value
        },
        inserted(a, b) {
            console.log("insert");
            a.focus()
        },
        update(e, b) {
            console.log("update");
            e.value = b.value
            e.focus()
        }
    })
    // 全局指令
    Vue.directive("big",(element,binding)=>{
        element.innerText = binding.value * 10
    })
    const vm = new Vue({
        el: '#root',
        data: {
            n: 0
        },
        directives: {
            // big函数什么时候被调用？
            //1. 指令与元素成功绑定时
            //2. 指令所在的模板被重新解析时
            // big(element, binding) {
            //     element.innerText = binding.value * 10
            // },
            // fbind: {
            //     bind(e, b) {
            //         console.log("bind")
            //         e.value = b.value
            //     },
            //     inserted(a, b) {
            //         console.log("insert");
            //         a.focus()
            //     },
            //     update(e, b) {
            //         console.log("update");
            //         e.value = b.value
            //         e.focus()
            //     }
            // }
            // fbind(element, binding) {
            //     element.value = binding.value

            //     element.focus()
            // }
        }
    })
</script>

</html>
```

