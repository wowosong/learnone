## 绑定样式

### class样式

```html
  <!-- 绑定class样式---字符串写法，适用于：样式的类名不确定，需要动态指定 -->
  <!-- 绑定class样式---数组写法，适用于：要绑定的样式个数不确定，名字也不确定 -->
  <!-- 绑定class样式---对象写法，适用于：要绑定的样式个数确定、名字也确定，但要动态决定用不用 -->
  <!-- 绑定style样式---对象写法 -->
   <!-- 绑定style样式---数组写法 -->
<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <title>绑定样式、条件渲染</title>
    <script type="text/javascript" src="js/vue.js"></script>
</head>

<body>
    
    <div id="root">
        <!-- 绑定class样式---字符串写法，适用于：样式的类名不确定，需要动态指定 -->
        <div class="basic" :class="mood" @click="changeMood">{{name}}</div><br />
        <!-- 绑定class样式---数组写法，适用于：要绑定的样式个数不确定，名字也不确定 -->
        <div class="basic" :class="classArr">{{name}}</div><br />
        <!-- 绑定class样式---对象写法，适用于：要绑定的样式个数确定、名字也确定，但要动态决定用不用 -->
        <div class="basic" :class="classObj">{{name}}</div><br />
        <!-- 绑定style样式---对象写法 -->
        <div class="basic" :style="styleObj2">{{name}}</div><br />
        <!-- 绑定style样式---数组写法 -->
        <div class="basic" :style="styleArr">{{name}}</div><br />
    </div>

</body>
<script type="text/javascript">
    Vue.config.productionTip = false
    const vm = new Vue({
        el: '#root',
        data: {
            name: '尚硅谷',
            mood: "normal",
            classArr: ['atguigu1', 'atguigu2', 'atguigu3'],
            classObj: {
                atguigu1: false,
                atguigu2: false
            },
            styleObj: {
                fontsize: '40px',
                color: 'red'
            },
            styleObj2: {
                backgroundColor: 'orange'
            },
            styleArr: [{
                fontsize: '40px',
                color: 'blue'
            }, {
                backgroundColor: 'gray'
            }]
        },
        methods:{
            changeMood(){
                const arr=['happy','sad','normal']
                const index=Math.floor(Math.random()*3)
                this.mood=arr[index]
            }
        }

    })
</script>
<style>
    .basic{
        width: 300px;height: 50px;border: 1px solid black;
    }
    .happy{
        border: 3px solid red; background-color: rgba(255,255,0,0.644);
        background: linear-gradient(30deg,yellow,pink,orange,yellow);
    }
    .sad{border: 4px dashed rgb(2,197, 2); background-color: skyblue;}
    .normal{
        background-color: #bfa;
    }
    .atguigu1{background-color: yellowgreen;}

    .atguigu2{ font-size: 20px; text-shadow: 2px 2px 10px red;}
    .atguigu3{border-radius: 20px;}
</style>

</html>
```

## 条件渲染

条件渲染：

   1.v-if

​    写法：

​    （1）v-if="表达式"

​    （2）v-else-if="表达式"

​       (3)v-else="表达式"

​    适用于：切花频率较低的场景

​    特点：不展示的DOM元素直接被移除

​    注意：v-if可以和v-else-if v-else 一起使用，但要求结构不能被打断

  2.v-show

​    写法：v-show="表达式"

​    适用于：切换频率较高的场景

​    特点：不展示的DOM元素未被移除，仅仅是使用样式隐藏掉

  3.备注：使用v-if时，元素可能无法获取到，而使用v-show一定可以获取到

```html
<!DOCTYPE html>
<html>

    <head>
        <meta charset="utf-8">
        <title>条件渲染2</title>
        <script type="text/javascript" src="js/vue.js"></script>
    </head>

    <!---条件渲染：
        1.v-if
        写法：
        （1）v-if="表达式"
        （2）v-else-if="表达式"
        (3)v-else="表达式"
        适用于：切花频率较低的场景
        特点：不展示的DOM元素直接被移除
        注意：v-if可以和v-else-if v-else 一起使用，但要求结构不能被打断
        2.v-show
        写法：v-show="表达式"
        适用于：切换频率较高的场景
        特点：不展示的DOM元素未被移除，仅仅是使用样式隐藏掉
        3.备注：使用-v-if时，元素可能无法获取到，而使用v-show一定可以获取到
    --->
    <body>

        <div id="root">
            <!-- 使用v-show做条件渲染 -->
            <h2 v-show="a">{{name}}</h2>
            <!-- 使用v-if 做条件渲染 -->
            <!-- <h2 v-show="1==1">{{name}}</h2> -->
            n当前的值{{n}}
            <button @click="n++">点我加一</button>
            <h2 v-if="false"> {{name}}</h2>
            <div v-show="n===1">Angular</div>
            <div v-show="n===2">Vue</div>
            <div v-show="n===3">React</div>


            <div v-if="n===1">Angular</div>
            <div v-else-if="n===2">Vue</div>
            <div v-else-if="n===3">React</div>
            <div v-else>哈哈</div>
            <!-- v-if与template结合使用，不能和v-show一起使用 -->
            <template v-if="n===1">
                <h1>尚硅谷</h1>
                <h2>腾讯</h2>
                <h2>华为</h2>
            </template>
        </div>

    </body>
    <script type="text/javascript">
        Vue.config.productionTip = false
        const vm = new Vue({
            el: '#root',
            data: {
                name: '欢迎来到尚硅谷',
                a:false,
                n:0
            },

        })
    </script>
</html>
```

