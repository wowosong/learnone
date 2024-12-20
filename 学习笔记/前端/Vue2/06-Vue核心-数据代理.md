## Object.defineproperty方法

Object.defineproperty方法

```html
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <title>回顾Object.defineproperty方法</title>
    </head>
    <body>
    </body>
    <script type="text/javascript">
        let number = 18
        let person = {
            name: 'huangjiusong',
            sex: "男",
            // age: "12314"
            // age: number
        }
        Object.defineProperty(person, 'age', {
            // value: 18,
            // enumerable: true, // 控制属性是否可以枚举，默认值是false
            // writable: true, //控制属性是否可以被修改，默认值是false
            // configurable: true, //控制属性是否可以删除，默认值是false
            //当有人读取person的age属性时，get函数(getter)就会被调用，且返回值就是age的值
            get: function() {
                console.log("有人读取age...")
                // return "hello"
                return number
            },
            //当有人修改person的age属性时，set函数(setter)就会被调用，且会收到具体的修改值
            set(value) {
                console.log("有人修改age...", value)
                number = value
            }
        })
        console.log(person)
        // console.log(Object.keys(person))
        //通过Object.defineProperty添加的属性不会被Object.keys查询
    </script>
</html>

```

**数据代理：通过一个对象代理对另一个对象中的属性的操作（读写）**

```javascript
let obj={x:100}
let obj2={y:200}
Object.defineProperty(obj2,'x',{
  get(){
    return obj.x
  },
  set(value){
    obj.x=value
  }
})
```

1.Vue中的数据代理：

​	通过vm对象来代理data对象中属性的操作（读/写）

2.Vue中数据代理的好处：

​	更加方便的操作data中的数据

3.基本原理：

​	通过Object.defineproperty()把data对象中的所有属性添加到vm上。

​	为每一个添加到vm上的属性，都指定一个getter/setter。

​	在getter/setter内部去操作（读/写）data中对应的属性

![image-20221025201146670](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311031704049.png)

**Vue将data中的数据拷贝了一份到\_\_data属性中，又将\_\_data里面的属性提到Vue实例中（如name），通过defineproperty方法实现数据代理，这样通过getter/setter操作name，进而操作\_\_data中的name。而\_\_data又对data进行数据劫持，实现响应式**。

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8">
		<title></title>
		<script type="text/javascript" src="js/vue.js"></script>
	</head>

	<!-- 1.Vue中的数据代理：
		通过vm对象来代理data对象中属性的操作（读/写）
	2.Vue中数据代理的好处：
		更加方便的操作data中的数据
	3.基本原理：
		通过Object.defineproperty()把data对象中的所有属性添加到vm上。
		为每一个添加到vm上的属性，都指定一个getter/setter。
		在getter/setter内部去操作（读/写）data中对应的属性 -->
	<body>
		<div id="root">
			<h2>名称：{{name}}</h2>
			<h2>名称1:{{_data.name}}</h2>
			<h2>地址：{{address}}</h2>
		</div>
	</body>
	<script type="text/javascript">
		Vue.config.productionTip = false

		let data = {
			name: "尚硅谷",
			address: "成都"
		}
		const vm = new Vue({
			el: "#root",
			data: data
		})
	</script>
</html>

```

