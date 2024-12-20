## 列表渲染

### 基本列表

v-for指令：

1.用于展示列表数据

2.语法：v-for="(item,index) in xxx " :key="yyy" key可以是index，是遍历对象的唯一标识

3.可遍历：数组、对象、字符串（用的很少）、指定次数（很少用）

```html
<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <title>列表渲染</title>
    <script type="text/javascript" src="js/vue.js"></script>
</head>
v-for指令：
1.用于展示列表数据
2.语法：v-for="(item,index) in xxx " :key="yyy"
3.可遍历：数组、对象、字符串（用的很少）、指定次数（很少用）
<body>

    <div id="root">
        {{name}}
        <ul>
            <li>xxx</li>
            <li>yyyy</li>
            <li>xxxx</li>
            <h3>遍历数组</h3>
            <!-- 遍历数组 -->
            <!-- <li v-for="(person,index) in persons" :key="person.id">  -->
            <li v-for="(person,index) of persons" :key="person.id">
                <p>{{person.id}}-{{person.name}}-{{person.age}}-{{index}}</p>
            </li>
            <h3>遍历对象</h3>
            <!-- 遍历对象 -->
            <li v-for="(key,value) in car">
                {{value}}-{{key}}
            </li>
            <h3>遍历字符串</h3>
            <!-- 遍历字符串 -->
            <li v-for="char in name[2]">
                {{char}}
            </li>
            <!-- 遍历指定的次数 -->
            <h3>遍历指定的次数</h3>
            <li v-for="(number,index) of 5">
                {{number}}-{{index}}
            </li>
        </ul>

    </div>

</body>
<script type="text/javascript">
    Vue.config.productionTip = false
    const vm = new Vue({
        el: '#root',
        data: {
            name: '欢迎来到尚硅谷',
            persons: [{
                    "id": 1,
                    "name": "huangjiusong",
                    "age": 31
                },
                {
                    "id": 2,
                    "name": "huangjiusong1",
                    "age": 32
                },
                {
                    "id": 3,
                    "name": "huangjiusong2",
                    "age": 33
                },

            ],
            car:{
                brand:"比亚迪",
                price:'180000',
                color:"red"
            }
        },

    })
</script>

</html>
```

### key的作用与原理

**原理**

![image-20221026160024947](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311062159587.png)

![image-20221026160053116](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311062159767.png)

**面试题：react vue中key有什么作用？？？**(key的内部原理)

1. 虚拟DOM中key的作用，**key**是**虚拟DOM中对象的标识**，当数据发生变化时，**Vue会根据新数据生成新的虚拟DOM，随后Vue进行新的虚拟DOM与旧虚拟DOM的差异比较**，比较规则如下

2. 对比规则：

   1. 旧虚拟DOM中找到了与新虚拟DOM相同的key：

     ①若虚拟DOM中内容没变，直接使用之前的真实DOM；

     ②若虚拟DOM中内容变了，则生成新的真实DOM，随后替换掉页面中之前的真实DOM

   2. 旧虚拟DOM中未找到与新虚拟DOM相同的key:

         创建新的真实DOM，随后渲染到页面

3. 用**index**作为**key**可能会引发的问题：

     1. 若对数据进行：逆序添加、逆序删除等**破坏顺序操作**；会产生没有必要的真实DOM更新===》界面效果没问题，但效率低

     2. 如果结构中还包含**输入类的DOM**：会产生错误的DOM更新====》界面有问题

4. 开发中如何选择key？

     1. 最好使用每条数据的**唯一标识作为key**，比如id，手机号、身份证号、学号等唯一值；

     2. 如果不存在对数据的逆序添加、逆序删除等破坏性操作，仅仅用于渲染列表用于展示，使用**index**作为**key**是没有问题的。 

```html
<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <title>列表渲染</title>
    <script type="text/javascript" src="js/vue.js"></script>
</head>
<!-- **面试题：react vue中key有什么作用？？？**(key的内部原理)

1. 虚拟DOM中key的作用，**key**是**虚拟DOM中对象的标识**，当数据发生变化时，**Vue会根据新数据生成新的虚拟DOM，随后Vue进行新的虚拟DOM与旧虚拟DOM的差异比较**，比较规则如下
2. 对比规则：
   1. 旧虚拟DOM中找到了与新虚拟DOM相同的key：
    ①若虚拟DOM中内容没变，直接使用之前的真实DOM；
    ②若虚拟DOM中内容变了，则生成新的真实DOM，随后替换掉页面中之前的真实DOM
    2.旧虚拟DOM中未找到与新虚拟DOM相同的key:
     创建新的真实DOM，随后渲染到页面
3.用index作为key可能会引发的问题：
    1.若对数据进行：逆序添加、逆序删除等破坏顺序操作；会产生没有必要的真实DOM更新===》界面效果没问题，但效率低
    2.如果结构中还包含输入类的DOM：会产生错误的DOM更新====》界面有问题
4.开发中如何选择key？
    1.最好使用每条数据的唯一标识作为key，比如id，手机号、身份证号、学号等唯一值；
    2.如果不存在对数据的逆序添加、逆序删除等破坏性操作，仅仅用于渲染列表用于展示，使用index作为key是没有问题的。 -->
<body>

    <div id="root">
        <button @click="add" style="color:red;">点我添加</button>
        <ul>
            <h3>遍历数组</h3>
            <!-- 遍历数组 -->
            <!-- :key="person.id" -->
            <li v-for="(person,index) in persons" :key="index">
                {{person.id}}-{{person.name}}-{{person.age}}-{{index}}
                <input type="text">
            </li>
        </ul>

    </div>

</body>
<script type="text/javascript">
    Vue.config.productionTip = false
    const vm = new Vue({
        el: '#root',
        data: {
            persons: [{
                    id: '001',
                    name: "huangjiusong",
                    age: 31
                },
                {
                    id: '002',
                    name: "huangjiusong1",
                    age: 32
                },
                {
                    id: '003',
                    name: "huangjiusong2",
                    age: 33
                },

            ],
        },
        methods:{
            add(){
                const p={
                    id:"004",
                    name:"huangjiusong4"
                }
                this.persons.unshift(p)
                
                // this.persons.push(p)
            }
        }

    })
</script>

</html>
```

### 列表过滤

```html
<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <title>列表渲染</title>
    <script type="text/javascript" src="js/vue.js"></script>
</head>

<body>

    <div id="root">
        <input type="text" v-model="keyword" placeholder="请输入名字">
        <ul>
            <h3>遍历数组</h3>
            <!-- 遍历数组 -->
            <!-- :key="person.id" -->
            <li v-for="(person,index) in filterPerson" :key="index">
                {{person.id}}-{{person.name}}-{{person.age}}-{{index}}
                <input type="text">
            </li>
        </ul>

    </div>

</body>
<script type="text/javascript">
    Vue.config.productionTip = false
    // const vm = new Vue({
    //     el: '#root',
    //     data: {
    //         keyword: '',
    //         persons: [{
    //                 id: '001',
    //                 name: "huangjiusong",
    //                 age: 31
    //             },
    //             {
    //                 id: '002',
    //                 name: "huangjiusong1",
    //                 age: 32
    //             },
    //             {
    //                 id: '003',
    //                 name: "huangjiusong2",
    //                 age: 33
    //             },

    //         ],
    //         filterPerson: []
    //     },
    //     methods: {

    //     },
    //     // 监视属性
    //     watch: {
    //         keyword: {
    //             immediate: true,
    //             handler(value) {
    //                 console.log("-----", value);
    //                 this.filterPerson = this.persons.filter((p) => {
    //                     return p.name.indexOf(value) !== -1
    //                 })
    //             }

    //         }
    //     }

    // })
    const vm = new Vue({
        el: '#root',
        data: {
            keyword: '',
            persons: [{
                    id: '001',
                    name: "huangjiusong",
                    age: 31
                },
                {
                    id: '002',
                    name: "huangjiusong1",
                    age: 32
                },
                {
                    id: '003',
                    name: "huangjiusong2",
                    age: 33
                },

            ],
        },
        methods: {

        },
        // 监视属性
        computed: {
            filterPerson() {
               return this.filterPerson = this.persons.filter((p) => {
                    return p.name.indexOf(this.keyword) !== -1
                })
            }
        }

    })
</script>

</html>
```

### 列表排序

```html
<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <title>列表排序</title>
    <script type="text/javascript" src="js/vue.js"></script>
</head>

<body>

    <div id="root">
        <input type="text" v-model="keyword" placeholder="请输入名字">
        <button @click="sortType=2">年龄升序</button>
        <button @click="sortType=1">年龄降序</button>
        <button @click="sortType=0">原顺序</button>
        <ul>
            <h3>遍历数组</h3>
            <!-- 遍历数组 -->
            <li v-for="(person,index) in filterPerson" :key="index">
                {{person.id}}-{{person.name}}-{{person.age}}-{{index}}
                <input type="text">
            </li>
        </ul>

    </div>

</body>
<script type="text/javascript">
    Vue.config.productionTip = false
    const vm = new Vue({
        el: '#root',
        data: {
            keyword: '',
            sortType: 0, //0 原顺序，1 降序 2 升序
            persons: [{
                    id: '001',
                    name: "马冬梅",
                    age: 30
                },
                {
                    id: '002',
                    name: "周冬雨",
                    age: 32
                },
                {
                    id: '003',
                    name: "周杰伦",
                    age: 33
                },
                {
                    id: '004',
                    name: "温兆伦",
                    age: 28
                },

            ],
        },
        methods: {

        },
        // 监视属性
        computed: {
            filterPerson() {
                const arr = this.filterPerson = this.persons.filter((p) => {
                    return p.name.indexOf(this.keyword) !== -1
                })
                if (this.sortType) {
                    arr.sort((p1, p2) => {
                        return this.sortType === 1 ? p2.age - p1.age : p1.age - p2.age
                    })
                }
                return arr
            }
        }

    })
</script>

</html>
```

**模拟一个数据监测**

```javascript
let data = {
    name: "shangguigu",
    address: "chengdu"
}
//定时器
setInterval(() => {
    if(data.name!='shangguigu'){
        console.log("数据被修改",data.name)
    }
}, 100);
function Observer(obj){
    const keys=Object.keys(obj)
    keys.forEach((k)=>{
        Object.defineProperty(this,k,{
            get(){
                return obj[k]
            },
            set(value){
                console.log(`${k}被改了，我要去解析模板，生成模拟DOM。。。我要开始忙了`)
                obj[k]=value
            }
        })
    })
}
const obs=new Observer(data);
console.log(obs);
let vm={};
vm._data=data=obs;
```

**原理**

**1.Vue会监视data中所有层次的数据**
**2.如何监测对象中的数据？**
**​	通过setter实现监视，且要在new Vue()时就传入要监测的户籍**

- **对象创建后追加的属性，Vue默认不做响应处理**
- **如需给后添加的属性做响应式，请使用如何API**
  **Vue.set(target,propertyName/index,value)**
  **vue.\$set(target,propertyName/index,value)**
3. **如何监测数组中的数据？**

  ​	通过包裹数组更新元素的方法实现，本质就是做了两件事
  ​		a.调用原生对应的方法对数组进行更新
  ​		b.重新解析模板，进而更新页面

4. **在Vue修改数组中的某个元素一定要用如下方法**
    **push() pop() unshift() shift() splice() sort() reverse()这几个方法重写了Vue.set()h或vm.\$set()**
    **特别注意：Vue.set()和vm.\$set()不能给vm或vm的根数据对象（data等）添加属性**
