## 监视属性

```html
<!DOCTYPE html>
<html>

<head>
	<meta charset="utf-8">
	<title>计算属性-计算属性实现</title>
	<script type="text/javascript" src="js/vue.js"></script>
</head>

<body>
	<div id="root">

		<p>今天天气很{{info}}</p>
		<button @click="changeWeather"> 切换天气</button>
		{{x}}
		<!-- <button @click="isHot=!isHot"> 切换天气</button> -->
	</div>
</body>
<script type="text/javascript">
	Vue.config.productionTip = false
	const vm = new Vue({
		el: '#root',
		data: {
			isHot: true,
			x:1
		},
		computed: {
			info() {
				return this.isHot ? "炎热" : "凉爽"
			}
		},
		methods: {
			changeWeather() {
				this.isHot = !this.isHot,
				this.x++
			}

		},
	})
	console.log(vm)
</script>

</html>
```

## 监视属性(侦听属性）的基本用法

监视属性watch：

1. **当被监视的属性变化时，回调函数自动调用，进行相关操作**
2. **监视的属性必须存在，才能进行监视**
3. **配置想属性immediate：false，改为true，则初始化时调用一次handler（newValue，oldValue）**
4. 监视的两种方法：

​        （1）new Vue时传入watch配置

​        （2）通过vm.$watch监视

```html

<!DOCTYPE html>
<html>

    <head>
        <meta charset="utf-8">
        <title>计算属性-计算属性实现</title>
        <script type="text/javascript" src="js/vue.js"></script>

    </head>

    <body>
        <div id="root">
            <!---监视属性watch：
            1.当被监视的属性变化时，回调函数自动调用，进行相关操作
            2.监视的属性必须存在，才能进行监视
            3.监视的两种方法：
            （1）new Vue时传入watch配置
            （2）通过vm.$watch监视
            --->
            <p>今天天气很{{info}}</p>
            <button @click="changeWeather"> 切换天气</button>
            {{x}}
            <!-- <button @click="isHot=!isHot"> 切换天气</button> -->
        </div>
    </body>
    <script type="text/javascript">
        Vue.config.productionTip = false
        const vm = new Vue({
            el: '#root',
            data: {
                isHot: true,
                x: 1
            },
            computed: {
                info() {
                    return this.isHot ? "炎热" : "凉爽"
                }
            },
            methods: {
                changeWeather() {
                    this.isHot = !this.isHot;
                    this.x++
                }

            },
            //方式1
            watch: {
                isHot: {
                    // immediate:true,初始化时让handler调用一下
                    // handler什么时候调用？当isHot被修改时
                    handler(newValue, oldValue) {
                        console.log("isHot被修改...", oldValue, newValue)
                    }
                }
            },
        });
        //方法二
        vm.$watch("isHot", {
            // immediate:true,初始化时让handler调用一下
            // handler什么时候调用？当isHot被修改时
            handler(newValue, oldValue) {
                console.log("isHot被修改...", oldValue, newValue)
            }
        })
        console.log(vm)
    </script>

</html>

```

## 深度监视

**深度监视：**

  **（1）Vue中的watch默认不监测对象内部值的改变（一层）**

  **（2）配置deep：true可以监测对象内部值改变（多层）**

**备注：**

  **（1）Vue自身可以监测对象内部值的改变，但Vue提供的watch默认不可以**

  **（2）使用watch时应该根据数据的具体结构，决定是否采用深度监视**

```html
<!DOCTYPE html>
<html>

    <head>
        <meta charset="utf-8">
        <title>监视属性-深度监视</title>
        <script type="text/javascript" src="js/vue.js"></script>
    </head>

    <!-- 深度监视：
    （1）Vue中的watch默认不监测对象内部值的改变（一层）
    （2）配置deep：true可以监测对象内部值改变（多层）
    备注：
    （1）Vue自身可以监测对象内部值的改变，但Vue提供的watch默认不可以
    （2）使用watch时应该根据数据的具体结构，决定是否采用深度监视 
    -->
    <body>
        <div id="root">
            <p>今天天气很{{info}}</p>
            <button @click="changeWeather"> 切换天气</button>
            <br>
            <h3> a:{{numbers.a}}</h3>
            <button @click="numbers.a++">点我让a++</button>
            <h3> b:{{numbers.b}}</h3>
            <button @click="numbers.b++">点我让b++</button>

            <button @click="numbers={a:666,b:888}">彻底改变numbers</button>
        </div>
    </body>
    <script type="text/javascript">
        Vue.config.productionTip = false
        const vm = new Vue({
            el: '#root',
            data: {
                isHot: true,
                numbers: {
                    a: 1,
                    b: 1
                }
            },
            computed: {
                info() {
                    return this.isHot ? "炎热" : "凉爽"
                }
            },
            methods: {
                changeWeather() {
                    this.isHot = !this.isHot,
                        this.x++
                }

            },
            watch: {
                isHot: {
                    // immediate:true,初始化时让handler调用一下
                    // handler什么时候调用？当isHot被修改时
                    handler(newValue, oldValue) {
                        console.log("isHot被修改...", oldValue, newValue)
                    }
                },
                // 监视多级结构中某个属性的编号
                // "numbers.a":{
                // "numbers.a":{
                // 	handler(newValue,oldValue){
                // 		console.log("a被修改",oldValue,newValue)
                // 	}
                // }
                // 监视多级结构中所有属性的变化
                numbers: {
                    deep:true,
                    handler(){
                        console.log("numbers被修改...");
                    }
                }
            },
        })
        vm.$watch("isHot", {
            // immediate:true,初始化时让handler调用一下
            // handler什么时候调用？当isHot被修改时
            handler(newValue, oldValue) {
                console.log("isHot被修改...", oldValue, newValue)
            }
        })
        console.log(vm)
    </script>

</html>
```

![image-20221026104540374](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311062159596.png)

## 计算属性与侦听属性

**computed和watch之间的区别**

1. **computed能完成的功能，watch都可以完成**
2. **watch能完成的功能，computed不一定，例如：watch可以进行异步操作**

**两个重要的小原则：**

1. **被Vue管理的函数，最好写成普通函数，这样this的指向才是vm或组件实例对象**
2. **所有不被Vue所管理的函数（定时器的回调函数、ajax的回调函数、Promise回调函数），最好写成箭头函数，这样this的指向才是vm或组件实例对象**

使用计算属性

```javascript
fullName1:function(){
	return this.firstName+"-"+this.lastName
}
```

 使用watch

```javascript
watch: {
    firstName2:{

    };
    firstName(value) {
        setTimeout(() => {
            this.fullName = value + '-' + this.lastName
        }, 1000);
    };
    firstName1(value) {
        this.fullName = value + '-' + this.lastName
        console.log(this)
    };
    lastName(value) {
        this.fullName = value + '-' + this.firstName
        console.log(this)
    }
}
```

