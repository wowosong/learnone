## 数据绑定

1. Vue中有2种数据绑定方式
   1. 单向绑定（v-bind)；数据只能从data流向页面
   2. 双向绑定（v-model):数据不仅能从data流向页面，还可以从页面流向data。
      备注：
      1. 双向绑定一般都应用在表单类元素上，（如input。select等）
      2. v-model:value 可以简写为v-model，因为v-model默认收集的就是value值。

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8">

		<title>数据绑定</title>
		<script type="text/javascript" src="js/vue.js"></script>
		<!-- Vue中有2种数据绑定方式
          1.单向绑定（v-bind)；数据只能从data流向页面
          2.双向绑定（v-model):数据不仅能从data流向页面，还可以从页面流向data。
          备注：
          1.双向绑定一般都应用在表单类元素上，（如input/select等）
          2.v-model:value 可以简写为v-model，因为v-model默认收集的就是value值。
         -->
	</head>
	<body>
		<div id="root">
			<h1>{{name}}</h1>
			单向数据绑定<input type="text" v-bind:value="name" />
			<br />
			双向数据绑定<input type="text" v-model:value="name" />
			如下代码是错误的，因为v-model只能应用在表单类元素（输入类元素）上
			<h2 v-model:x="name">1234</h2>
		</div>
	</body>
	<script type="text/javascript">
		new Vue({
			el: "#root",
			data: {
				name: "shanggui"
			}
		})
	</script>
</html>

```

