## 模板语法

Vue模板语法有2大类

1.  插值语法：

   功能：用于解析标签体的内容

   写法：{{xxx}}. xxx是js表达式，且可以直接**读取到data中的所有属性**

2. 指令语法

   功能：用于解析标签（包括：标签属性、标签体内容，绑定事件....)

   举例：v-bind:href="xxx" 或简写为:href="xxx" xxx同样要写js表达式，且可以**直接读取到data中所有属性**

   备注：Vue中有很多的指令，且形式都是：v-???，此处只是拿v-bind举例

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8">

		<title>模板语法</title>
		<script src="js/vue.js" type="text/javascript"></script>
		<!--- Vue模板语法有2大类
		  1.插值语法：
		    功能：用于解析标签体的内容
			写法：{{xxx}}. xxx是js表达式，且可以直接读取到data中的所有属性
		  2.指令语法
		    功能：用于解析标签（包括：标签属性、标签体内容，绑定事件....)
			举例：v-bind:href="xxx" 或简写为:href="xxx" xxx同样要写js表达式，且可以直接读取到data中所有属性
			备注：Vue中有很多的指令，且形式都是：v-???，此处只是拿v-bind举例
			--->
	</head>
	<body>
		<div id="root">
			<!-- 插值语法 -->
			<h1>插值语法</h1>
			<h2>{{name}}</h2>
			<h2>指令语法</h2>
			<a v-bind:href="url">点我</a>
			<a v-bind:href="baidu.url" x="hello">点我去百度</a>
		</div>

	</body>
	<script type="text/javascript">
		new Vue({
			el: "#root",
			x: "12313",
			data: {
				name: "huangjiusong",
				url: "http://www.baidu.com",
				baidu: {
					url: "http://www.baidu.com"
				}
			}
		})
	</script>
</html>

```

