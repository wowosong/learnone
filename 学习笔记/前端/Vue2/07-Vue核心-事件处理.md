## 事件处理

### 事件的基本方法

事件的基本使用：

​	**1.使用v-on:xxx或@xxx绑定事件，其中xxx是事件名**

​	**2.事件中的回调需要配置在methods对象中，最终会在vm上；**

​	**3.methods中配置的函数，不要用箭头函数！否则this就不是vm实例了；**

​	**4.methods中配置的函数，都是被vue所管理的函数，this的指向是vm或组件实例对象；**

​	**5.@click="demo"和@click="demo($event)"效果一致，但后者可以传参；**

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8">
		<title></title>
		<script type="text/javascript" src="js/vue.js"></script>
	</head>

	<!--- 事件的基本使用：
	1.使用v-on:xxx或@xxx绑定事件，其中xxx是事件名
	2.事件中的回调需要配置在methods对象中，最终会在vm上；
	3.methods中配置的函数，不要用箭头函数！否则this就不是vm实例了；
	4.methods中配置的函数，都是被vue所管理的函数，this的指向是vm或组件实例对象；
	5.@click="demo"和@click="demo($event)"效果一致，但后者可以传参；
 	--->
	<body>
		<div id="root">
			<h2>名称：{{name}}</h2>
			<button v-on:click="showInfo">点我提示(不传参)</button>
			<button @click="showInfo1(66,$event)">点我提示1（传参）</button>
		</div>
	</body>
	<script type="text/javascript">
		Vue.config.productionTip = false

		const vm = new Vue({
			el: "#root",
			data: {
				name: "尚硅谷",
			},
			methods: {
				//使用箭头函数，this就不是vm实例了
				// showInfo(a,b,c,d) {
				showInfo(event) {
					console.log(event.target.innerText);
					console.log(this) //==》this是vm
					console.log(vm == this)
					alert("123")
					// console.log("12313")
				},
				showInfo1(number, event) {
					console.log(number)
					console.log(event)
					console.log(event.target.innerText);
					console.log(this) //==》this是vm
					console.log(vm == this)
					alert("456")
					// console.log("12313")
				}
			}
		})
	</script>
</html>

```

![image-20221025204925428](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311031746777.png)

### 事件修饰符

**Vue中的事件修饰符**

1. **prevent 阻止默认事件（常用）**

2. **stop 组织事件冒泡（常用）**

3. **once 事件只触发一次（常用）**

4. **capture 使用事件的捕获模式**

5. **self 只有event.target是当前操作的元素时才触发事件**

6. **passive 事件的默认行为立即执行，无需等待事件回调执行完毕**

**修饰符可以连续写，比如可以这么用：@click.prevent.stop='showInfo'**

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8">
		<title></title>
		<script type="text/javascript" src="js/vue.js"></script>
		<style>
			*{
				margin: 20px;
			}
			.demo1{
				height: 50px;
				background-color: skyblue;
			}
			.box1{
				padding: 5px;
				background-color: skyblue;
			}
			.box2{
				padding: 5px;
				background-color: azure;
			}
			.list{
				width: 200px;
				height: 200px;
				background-color: bisque;
				overflow: auto;
			}
				
			li{
				height: 100px;
			}
		</style>
	</head>

	
	<body>
		<div id="root">
			<!-- 阻止默认行为 -->
			<a href="http://www.baidu.com" @click.prevent="showInfo">点我提示</a>
			<!-- 阻止事件冒泡 -->
			<div class="demo1" @click="showInfo">
				<button @click.stop="showInfo">Click Me</button>
			</div>
			<!-- 只触发一次 -->
			<button @click.once="showInfo">Click Me</button>
			<!-- 使用事件的捕获模式 -->
			<div class="box1" @click.capture="showMsg(1)">
				div1
				<div class="box2" @click="showMsg(2)">
					div2
				</div>
			</div>
			<div class="demo1" @click="showInfo">
				<button @click.self="showInfo">Click Me</button>
			</div>
			<ul @wheel='demo' class="list"> 
			<!-- scroll -->
			<!-- wheel -->
				<li>1</li>
				<li>2</li>
				<li>3</li>
			</ul>
		</div>
	</body>
	<script type="text/javascript">
		Vue.config.productionTip = false

		const vm = new Vue({
			el: "#root",
			data: {
				name: "尚硅谷",
			},
			methods: {
				//使用箭头函数，this就不是vm实例了
				// showInfo(a,b,c,d) {
				showInfo(event) {
					// event.preventDefault()
					// console.log("test")
					console.log(event.target)
					// alert("test")
				},
				showMsg(msg){
					alert(msg)
				},
				demo(msg){
					console.log("@@@",msg)
					console.log();
				}
			}
		})
	</script>
</html>

```

### 键盘事件

![image-20221025212838288](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311031746177.png)
