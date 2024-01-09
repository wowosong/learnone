

# 接口测试利器 HTTP Client


SpringMVC系列或者是SpringBoot系列中都会有大量的案例，这些案例都需要运行来验证效果，所以急需一款高效的接口测试工具。

可能大家用的比较多的是swagger或者postman，这2个确实不错，不过今天今天给大家推荐一种更简单的接口测试工具。

这款工具就是idea中的自带的：**HTTP Client**，这款工具特别好用，主要的优点：

**1、若想测试一个接口，只需要几行代码**

**2、运行特别容易**

**3、方便切换各种环境**

## 1、创建一个springboot项目

idea中创建一个springboot项目，来个controller，内容如下，模拟了5种常见的情况，基本上包含了我们开发中所有的场景

```java
@RestController
public class IndexController {
    //get请求
    @RequestMapping("/get")
    public String get() {
        return "get";
    }

    //post请求，模拟表单提交
    @PostMapping("/post")
    public Map<String, String[]> post(HttpServletRequest request) {
        return request.getParameterMap();
    }

    //post请求json数据
    @PostMapping("/body")
    public List<Integer> body(@RequestBody List<Integer> list) {
        return list;
    }

    //put请求
    @PutMapping("/put")
    public String put() {
        return "put";
    }

    //模拟多文件上传，顺便带上表单数据
    @PostMapping("/upload")
    public Map<String, Object> upload(@RequestParam("file1") MultipartFile file1,
                                      @RequestParam("file2") MultipartFile file2,
                                      User user,
                                      HttpServletRequest request) {
        Map<String, Object> result = new HashMap<>();
        result.put("file1.size", file1.getSize());
        result.put("file1.name", file1.getName());
        result.put("file2.originalFilename", file1.getOriginalFilename());
        result.put("file2.size", file2.getSize());
        result.put("file2.name", file2.getName());
        result.put("file2.originalFilename", file2.getOriginalFilename());
        result.put("params", request.getParameterMap());
        result.put("user", user);
        return result;
    }

    static class User {
        private String userName;
        private int age;

        public String getUserName() {
            return userName;
        }

        public void setUserName(String userName) {
            this.userName = userName;
        }

        public int getAge() {
            return age;
        }

        public void setAge(int age) {
            this.age = age;
        }
    }
}
```

项目结构如下图 

 ![59a702a0-e5f1-48dd-be7d-2d224dcdd161](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081712960.png)

启动项目，下面我们来对这几个接口进行测试。

## 2、测试上面5个接口

下面我们通过`HTTP Client`工具来对上面几个接口进测试。

### 2.1、创建http后缀的文件

文件必须以http为后缀，这种文件会自动被**HTTP Client**插件识别，效果如下

![7ab2564c-9986-48aa-bd14-7781df9f68f6-1](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081712769.png)

### 2.2、将下面内容丢到创建好的文件中

```
### get 请求
GET http://localhost:8080/get

### post 提交表单
POST http://localhost:8080/post
Content-Type: application/x-www-form-urlencoded

name=张三&age=23

### body 中传递json数据
POST http://localhost:8080/body
Content-Type: application/json

[3,10,40]

### put请求
PUT http://localhost:8080/put


### 多文件上传文件接口测试
POST http://localhost:8080/upload
Content-Type: multipart/form-data; boundary=WebAppBoundary

--WebAppBoundary
Content-Disposition: form-data; name="file1"; filename="pic_1.jpeg"

< C:\Users\Think\Desktop\1.jpeg
--WebAppBoundary--

--WebAppBoundary
Content-Disposition: form-data; name="file2"; filename="pic_2.jpeg"

< C:\Users\Think\Desktop\2.jpeg
--WebAppBoundary--

--WebAppBoundary--
Content-Disposition: form-data;name=userName

tom
--WebAppBoundary--

--WebAppBoundary--
Content-Disposition: form-data;name=age

23
--WebAppBoundary--
###
```

接口格式很简单，如下

```
请求方式 地址
header部分，key=value格式，每个一行

参数部分(注意这个上面要有个空行)
```

此时文件的效果是下面这样，点击红框中的按钮，即可以运行这个测试用例

![02d6b612-910d-4fbb-ba2c-a1a61ffc9545](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081712716.png)

### 2.3、运行接口

![a9001b04-70b2-4cf9-8ae4-4deb71ae7add](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081712334.png)

## 3、http文件内容如何写？

**HTTP Client**提供了很多案例，点击**Examples**案例可以看到各种请求案例，这里就不细说了，大家一看就懂。

![e64b7865-ddcd-4dd8-aab5-5990deb0b439](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081712046.png)

## 4、文件上传的写法

多文件上传且携带表单数据，这个比较特别，下面是接口代码

```java
//模拟多文件上传，顺便带上表单数据
@PostMapping("/upload")
public Map<String, Object> upload(@RequestParam("file1") MultipartFile file1,
                                  @RequestParam("file2") MultipartFile file2,
                                  User user,
                                  HttpServletRequest request) {
}
```

对应的**HTTP Client**的写法如下：

```java
### 多文件上传文件接口测试
POST http://localhost:8080/upload
Content-Type: multipart/form-data; boundary=WebAppBoundary

--WebAppBoundary
Content-Disposition: form-data; name="file1"; filename="pic_1.jpeg"

< C:\Users\Think\Desktop\1.jpeg
--WebAppBoundary--

--WebAppBoundary
Content-Disposition: form-data; name="file2"; filename="pic_2.jpeg"

< C:\Users\Think\Desktop\2.jpeg
--WebAppBoundary--

--WebAppBoundary--
Content-Disposition: form-data;name=userName

tom
--WebAppBoundary--

--WebAppBoundary--
Content-Disposition: form-data;name=age

23
--WebAppBoundary--
###
```

你可以把这个请求想象为页面中的一个表单，表单有4个元素：2个File元素，用来选择需要上传的2个文件，2个输入框，分别用来输入userName和age，用—WebAppBoundary来隔离每个元素，如果有多个元素，都需要用—WebAppBoundary隔离开来，如下：

![15c1120a-9346-4e47-b655-4b8cee2228d2](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081713709.png)

## 5、环境切换

我们测试接口的时候，有开发环境、测试环境、UAT环境，生产环境，每个环境的接口信息都不一样，比如接口地址。

**HTTP Client**中可以创建环境配置文件，来对不同的环境信息进行配置，操作如下

### 5.1、创建环境配置文件

![a7c6c727-0be8-4f6f-b001-8b765f395602](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081713728.png)

生成了一个环境配置文件，如下

![72438f5d-f298-4154-be3a-54a66d29e76f](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081713418.png)

文件内容格式

```json
{
  "环境名称": {环境参数json格式},
  "环境名称": {环境参数json格式}
}
```

如

```json
{
  "dev": {
    "url": "http://localhost:8080",
    "name": "张三"
  },
  "test": {
    "url": "http://localhost:9090",
    "name": "李四"
  }
}
```

### 5.2、http文件中引用环境配置信息

通过{{key}}可以引用环境中的信息，运行的时候会被替换，如：

```java
GET {{url}}/get
```

### 5.3、运行的时候选择环境

运行的时候会提示你选择环境，此时环境中的配置信息就被用上了

![302941b6-d911-496f-a68d-c8d3af4dee8c](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081713958.png)



[下一篇：如何接受请求中的参数？](http://www.itsoku.com/course/6/142)

[上一篇：@Controller、@RequestMapping](http://www.itsoku.com/course/6/140)
