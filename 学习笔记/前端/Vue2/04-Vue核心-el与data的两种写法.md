el与data的两种写法

1.el的两种写法

（1）new Vue时配置el属性

（2）先创建Vue实例，随后通过vm.$mount（'#root')指定el的值

2.data的两种写法

（1）对象式

（2）函数式

如何选择：目前哪种写法都可以，以后学习到组件时，data必须使用**函数式**，否则会报错。

3.一个重要的原则： **由Vue管理的函数，一定不要写箭头函数，一旦写了箭头函数，this就不再是Vue实例；**


```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8">
		<title>el与data的两种写法</title>
	</head>
	<script type="text/javascript" src="js/vue.js"></script>
	<!-- el与data的两种写法
	1.el的两种写法
	（1）new Vue时配置el属性
	（2）先创建Vue实例，随后通过vm.$mount（'#root')指定el的值

	2.data的两种写法
	（1）对象式
	（2）函数式
	如何选择：目前哪种写法都可以，以后学习到组件时，data必须使用函数式，否则会报错。
	3.一个重要的原则： 由Vue管理的函数，一定不要写箭头函数，一旦写了箭头函数，this就不再是Vue实例； -->
	<body>
		<div id="root">
			{{name}}
		</div>
	</body>
	<script type="text/javascript">
		Vue.config.productionTip = false
		// const vm = new Vue({
		// 	// el: '#root', 第一种写法
		// 	data: {
		// 		name: 'shangguigu'
		// 	}
		// })

		// const vm = new Vue({
		// 	el: '#root',
		// 	// data的第一种写法，对象式
		// 	data: {
		// 		name: 'shangguigu'
		// 	}
		// })

		const vm = new Vue({
			el: '#root',
			// data的第二种写法，函数式
			// data() {
			//使用箭头函数会有问题	
			// data: () => {
			// 	console.log("@@@", this)
			// 	return {
			// 		name: 'shangguigu'
			// 	}
			// }
			data: function() {
				console.log('@@@', this)
				return {
					name: 'shangguigu'
				}
			}
		})

		console.log(vm);
		//定时器
		setTimeout(() => {
			vm.$mount('#root') //第二种写法
		}, 1000);
	</script>
</html>
```