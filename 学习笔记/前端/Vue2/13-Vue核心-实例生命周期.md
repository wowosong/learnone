## 引出生命周期

生命周期：

**1.又名：生命周期回调函数、生命周期函数、生命周期钩子**

**2.是什么？VUE在关键时刻帮着我们调用的一些特殊名称的函数。**

**3.生命周期函数的名字不可更改，但函数的具体内容是由程序员根据需要编写的。**

**4.生命周期函数中的this指向vm或组件实例对象**

```html
<!DOCTYPE html>
<html>

    <head>
        <meta charset="utf-8">
        <title>引出生命周期</title>
        <script type="text/javascript" src="js/vue.js"></script>
    </head>
    <!-- 生命周期：
    1.又名：生命周期回调函数、生命周期函数、生命周期钩子
    2.是什么？VUE在关键时刻帮着我们调用的一些特殊名称的函数。
    3.生命周期函数的名字不可更改，但函数的具体内容是由程序员根据需要编写的。
    4.生命周期函数中的this指向vm或组件实例对象 
    -->

    <body>
        <div id="root">
            <h2 :style="{opacity}">欢迎学习Vue</span>
        </div>
    </body>
    <script type="text/javascript">
        Vue.config.productionTip = false

        const vm = new Vue({
            el: '#root',
            data: {
                opacity: 1
            },
            methods: {
                change() {
                    setInterval(() => {
                        vm.opacity -= 0.01
                        if (vm.opacity <= 0) vm.opacity = 1
                    }, 16);
                }
            },
            // Vue完成模板的解析并把初始的真实的DOM元素放入页面后（挂载完毕后）调用mounted
            mounted() {
                setInterval(() => {
                    vm.opacity -= 0.01
                    if (vm.opacity <= 0) vm.opacity = 1
                }, 16)
            },
        })
        // 不推荐
        // setInterval(() => {
        //     vm.opacity -= 0.01
        //     if (vm.opacity <= 0) vm.opacity = 1
        // }, 16);
    </script>

</html>
```

## 分析生命周期

![生命周期](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311062207054.png)

```html
<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <title>分析生命周期</title>
    <script type="text/javascript" src="js/vue.js"></script>
</head>


<body>
    <div id="root">
        <h2>当前的值是{{n}}</h2>
        <button @click="add">点我+1</button>
        <button @click="bye">点我销毁</button>
    </div>

</body>
<script type="text/javascript">
    Vue.config.productionTip = false

    const vm = new Vue({
        el: '#root',
        // template:`<div>
        //     <h2>当前的值是{{n}}</h2>
        //     <button @click="add">点我+1</button>
        //     </div>`,
        data: {
            n: 1
        },
        methods: {
            add() {
                this.n++,
                    console.log("add")
            },
            bye() {
                console.log("bye...")
                this.$destroy()
            }
        },
        beforeCreate() {
            console.log("beforeCreate")
        },
        created() {
            console.log("create...");
        },
        beforeMount() {
            console.log("beforeMount");
        },
        mounted() {
            console.log("mounted")
        },
        beforeUpdate() {
            console.log("beforeUpdated...");
        },
        updated() {
            console.log('updated...')
        },
        beforeDestroy() {
            console.log("beforeDestroy...");
            console.log(this.n)
            this.add()
        },
        destroyed() {
            console.log("destroyed...");
        }
    })

    // vm.$mount("#root")
</script>

</html>
```



## 总结生命周期

常用的生命周期钩子：

1.mounted:发送Ajax请求、启动定时器、绑定自定义事件、订阅消息等【初始化操作】

2.beforeDestroy：清除定时器、解绑自定义事件、取消订阅消息等【收尾工作】

关于销毁Vue实例：

1.销毁后借助Vue开发者工具看不到任何信息。

2.销毁后自定义事件会失效，但原生DOM事件依然后效

3.一般不会在beforeDestroy操作数据，因为即使操作数据，也不会再触发更新流程了。

```html
<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <title>总结生命周期</title>
    <script type="text/javascript" src="js/vue.js"></script>
</head>
<!---常用的生命周期钩子：
1.mounted:发送Ajax请求、启动定时器、绑定自定义事件、订阅消息等【初始化操作】
2.beforeDestroy：清除定时器、解绑自定义事件、取消订阅消息等【收尾工作】
关于销毁Vue实例：
1.销毁后借助Vue开发者工具看不到任何信息。
2.销毁后自定义事件会失效，但原生DOM事件依然后效
3.一般不会在beforeDestory操作数据，因为即使操作数据，也不会再触发更新流程了。
--->
<body>
    <div id="root">
        <h2 :style="{opacity}">欢迎学习Vue</span></h2>
        <button @click="stop">停止变换</button>
        <button @click="setId">透明度设置为1</button>
    </div>

</body>
<script type="text/javascript">
    Vue.config.productionTip = false

    const vm = new Vue({
        el: '#root',
        data: {
            opacity: 1
        },
        methods: {
            stop() {
                // clearInterval(this.timer)
                this.$destroy()
            },
            setId() {
                this.opacity = 1
            }
        },
        // Vue完成模板的解析并把初始的真实的DOM元素放入页面后（挂载完毕后）调用mounted
        mounted() {
            this.timer = setInterval(() => {
                console.log("setInterval");
                vm.opacity -= 0.01
                if (vm.opacity <= 0) vm.opacity = 1
            }, 16)
        },
        beforeDestroy() {
            console.log("beforeDestroy...");
            clearInterval(this.timer)
        }
    })
</script>

</html>
```

