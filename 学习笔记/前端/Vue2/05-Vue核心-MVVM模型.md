## MVVM模型

![image-20221025172226160](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202310311622101.png)

**观察发现**：

​	1.**data中所有的属性，最后都出现在了vm身上**。

​	2.**vm身上所有的属性及Vue原型上所有属性，在Vue模板中都可以直接使用**

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8">
		<title>MVVM模型</title>
		<script type="text/javascript" src="js/vue.js"></script>
		<!--MVVM模型
		- M：模型Model，data中的数据
		- V：视图View，模板代码
		- VM：视图模型ViewModel，Vue实例
		观察发现：
		1.data中所有的属性，最后都出现在了vm身上。
		2.vm身上所有的属性及Vue原型上所有属性，在Vue模板中都可以直接使用
		-->
	</head>
	<body>
		<div id="root">
			<h2>{{name}}</h2>
			<h2>{{address}}</h2>
			<h2>测试一下{{1+1}}</h2>
			<h2>{{$options}}</h2>
			<h2>{{$emit}}</h2>
		</div>
	</body>
	<script type="text/javascript">
		const vm = new Vue({
			el: '#root',
			data: {
				name: "shangguigu",
				address: "chengdu",
				a: "123"
			}
		})
		console.log(vm)
	</script>
</html>

```

