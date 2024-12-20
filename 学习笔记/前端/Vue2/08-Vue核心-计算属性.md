## 计算属性

## 1.插值方法实现

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8">
		<title>计算属性-插值方法</title>
		<script type="text/javascript" src="js/vue.js"></script>
	</head>
	<body>
		<div id="root">
			姓<input type="text" v-model='firstName' />
			<br />
			名<input type="text" v-model='lastName' />
			姓名<span>{{firstName}}-{{lastName}}</span>
		</div>
	</body>
	<script type="text/javascript">
		Vue.config.productionTip = false
		new Vue({
			el: "#root",
			data: {
				firstName: "123",
				lastName: "456"
			}
		})
	</script>
</html>

```

## 2.method实现

数据发生变化，模板就会被重新解析

```html
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <title>计算属性-methods实现</title>
        <script type="text/javascript" src="js/vue.js"></script>
    </head>
    <body>
        <div id="root">
            姓<input type="text" v-model='firstName' />
            <br />
            名<input type="text" v-model='lastName' />
            姓名:<span>{{fullName()}}</span>
        </div>
    </body>
    <script type="text/javascript">
        Vue.config.productionTip = false
        new Vue({
            el: "#root",
            data: {
                firstName: "123",
                lastName: "456"
            },
            methods:{
                fullName(){
                    console.log("a---->")
                    return this.firstName+"-"+this.lastName;
                }
            }
        })
    </script>
</html>

```

## 3 computed计算属性

计算属性
		1.定义：要用的属性不存在，要通过已有属性计算得来

​		2.原理：底层借助了defineproperty方法提供的setter和getter

​		3.get函数什么时候执行？

​		  （1）初次读取时执行一次

​		  （2）当依赖的数据发生改变时会被再次调用

​		4.优势：<span style="color:red;font-weight:bolder">与method实现相比，内部有缓存机制（复用），效率更高，调试方便</span>

​		5.备注：

​		<span style="color:red;font-weight:bolder">1.计算属性最终会出现在vm上，直接读取使用即可</span>

​		<span style="color:red;font-weight:bolder">2.如果计算属性要被修改，那必须写set函数去响应修改，且set中要引起计算时依赖的数据发生改变</span>

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8">
		<title>计算属性-计算属性实现</title>
		<script type="text/javascript" src="js/vue.js"></script>
	</head>
	<body>
		<!-- 计算属性
		1.定义：要用的属性不存在，要通过已有属性计算得来
		2.原理：底层借助了defineproperty方法提供的setter和getter
		3.get函数什么时候执行？
		  （1）初次读取时执行一次
		  （2）当依赖的数据发生改变时会被再次调用
		4.优势：与method实现相比，内部有缓存机制（复用），效率更高，调试方便
		5.备注：
			1.计算属性最终会出现在vm上，直接读取使用即可
			2.如果计算属性要被修改，那必须写set函数去响应修改，且set中要引起计算时依赖的数据发生改变 -->
		<div id="root">
			姓<input type="text" v-model='firstName' />
			<br />
			名<input type="text" v-model='lastName' />
			姓名:<span>{{fullName}}</span>

			姓名:<span>{{fullName}}</span>

		</div>
	</body>
	<script type="text/javascript">
		Vue.config.productionTip = false
			
		const vm=new Vue({
			el:'#root',
			data:{
				firstName:'123',
				lastName:'456'
			},
			computed:{
				fullName:{
					// get有什么用？当有人读取fullName时get就会被调用，且返回值就是fullName的值
					// get什么时候调用？1.初次读取fullName时，2.所依赖的数据发生变化时
					get(){
						console.log('get被调用...')
						console.log(this) 
						// this指向vm
						return this.firstName+'-'+this.lastName
					},
					// 当set什么时候被调用？当fullName被修改时调用
					set(value){
						console.log('set',value)
						const arr=value.split('-')
						this.firstName=arr[0]
						this.lastName=arr[1]
					}
				}
				fullName1(){
					return this.firstName+"-"+this.lastName
				}
			}
		})
		console.log(vm)
	</script>
</html>

```

## 侦听属性