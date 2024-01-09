# @RequestBody接收Json格式数据

[上一篇：如何接受请求中的参数？](http://www.itsoku.com/course/6/142)

[下一篇：吃透文件上传](http://www.itsoku.com/course/6/144)

## 1、本文内容

1、掌握接收json格式数据的使用步骤及原理

2、掌握@RequestBody注解的用法

3、（重点）springmvc控制器具体可以接收哪些参数呢？

## 2、软件版本

1、idea 2020.3.3

2、jdk1.8

3、≥maven3.6.1

4、spring5.3.6

5、apache-tomcat-9.0.46

## 3、json格式数据的好处

当http请求传输的数据格式比较复杂的时，可以采用json格式

*   数据量更小
*   组装数据更容易
*   数据结构看起来更清晰

## 4、Http发起json格式的请求

1、头中需要设置Content-Type的值为application/json

2、请求body中数据格式为json文本

![fa5e0bdb-6ca3-4b15-9b98-83a89414b6db](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081717163.png)

## 5、我们来实现一个需求

http发送json格式的请求，如：

```json
## 发送json请求(body中数据为json格式)
POST http://localhost:8080/chat03/user/add.do
Content-Type: application/json;charset=UTF-8

{
  "name": "路人",
  "age": 10,
  "address": "上海"
}
```

我们希望下面这个方法可以处理这个请求，由springmvc负责将body中的json格式的数据转换为UserDto对象，然后传递给下面的add方法。

```java
@PostMapping("/user/add.do")
public ModelAndView add(UserDto user)
```

```java
public class UserDto {
    //姓名
    private String name;
    //年龄
    private Integer age;
    //地址
    private String address;

    //省略get、set

    @Override
    public String toString() {
        return "UserDto{" +
                "name='" + name + '\'' +
                ", age=" + age +
                ", address='" + address + '\'' +
                '}';
    }
}
```

## 6、SpringMVC接受json格式数据(3个步骤)

### 步骤1：maven添加jackson配置

```xml
<!-- 添加jackson配置 -->
<dependency>
    <groupId>com.fasterxml.jackson.core</groupId>
    <artifactId>jackson-core</artifactId>
    <version>2.11.4</version>
</dependency>

<dependency>
    <groupId>com.fasterxml.jackson.core</groupId>
    <artifactId>jackson-databind</artifactId>
    <version>2.11.4</version>
</dependency>
```

jackson是一个json工具包，可以将json格式的字符串和java对象互转。
而我们body中的数据是json格式的，controller中方法是java对象，所以需要将json数据转换为java对象。而json库有很多，比如jackson、gson、fastjson，此处我们使用springmvc推荐的jackson。

### 步骤2：springmvc中添加mvc驱动配置

```xml
<!-- 添加mvc注解驱动 -->
<mvc:annotation-driven/>
```

**这2个步骤配置好了之后，springmvc就被赋予了一个强大的功能，有能力将body中json格式的数据转换为java对象。**

透露一下原理：springmvc容器中被添加了一个MappingJackson2HttpMessageConverter对象，这个类可以将body中json格式的数据转换为java对象，内部用到的是jackson。MappingJackson2HttpMessageConverter这类就是在步骤1添加的maven包中。

### 步骤3：方法参数使用@RquestBody注解标注

当我们希望controller中处理器的方法参数的数据来源于http请求的body时，需要在参数的前面加上@RequestBody注解

```java
@PostMapping("/user/add.do")
public ModelAndView add(@RequestBody UserDto user) {
    System.out.println("user:" + user);

    ModelAndView modelAndView = new ModelAndView();
    modelAndView.setViewName("/WEB-INF/view/result.jsp");
    modelAndView.addObject("msg", user);
    return modelAndView;
}
```

就这么简单，此时这个方法就可以接受json格式的数据，springmvc会自动将body中json格式的字符串转换为UserDto对象，然后传递给上面的add方法的第一个参数。

### 案例代码

1、拉取代码

```plain
https://gitee.com/javacode2018/springmvc-series
```

2、导入idea

![44ea9929-72a8-4cfb-adca-3a77e9305c69](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081718707.png)

3、发布到tomcat

4、运行用例，用例的位置

![e2f37629-9fc8-4008-94c7-790a389f0893](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081718211.png)

输出的结果如下，可以看出json数据被UserDto接收成功了。

![378382cf-271f-408f-bcfa-5d18e47cfc8d](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081718500.png)

## 7、@RequestBody注解

### 作用

**用来接收http请求body的数据。**

HTTP请求大家比较熟悉，比如POST方式提交的请求，是有个body部分的，在springmvc中，我们希望控制器的方法中某个参数的值为http请求中的body的值，那么只需要在这个参数的前面加上@RequestBody注解，springmvc会将http请求中body的数据读取出来，然后传递给这个参数。

来看2个案例。

### 案例1：使用String类型接受body

```java
public void m1(@RequestBody String body)
```

springmvc会将请求中body部分的数据读取出来，转换为String类型传递给这个参数。

### 案例2：使用字节数组接受body的数据

```java
public void m1(@RequestBody byte[] bytes);
```

springmvc会将请求中body部分的数据读取出来，然后转换为字节数组然后传递给bytes参数。

### 2个案例代码位置

![5d77095a-e7db-4b1c-b051-0be0f17991b1](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081719951.png)

## 8、(重点)HandlerMethodArgumentResolver

这里给大家扩展点知识，到目前我们知道可以使用@RequestParam接收表单的值，@RequestBody可以接收请求中body的数据，@PathVariable可以接受url中动态参数。

**那么问题来了，控制器的方法具体可以接收哪些类型的参数呢？这是个好问题**

**说句实话，可以接收参数的类型非常的多，这里我教大家大家一招，看看springmvc具体可以接受哪些类型的参数。**

这里只需要掌握一个关键的接口就可以了：**HandlerMethodArgumentResolver（控制器方法参数解析器）**，这个接口特别重要，负责将http请求中的数据转换为controller中的方法能够接收的数据，就是根据控制器中方法参数信息，将http请求中的信息，转换控制器方法需要的参数的值。

这个接口有2个方法大家需要掌握

```java
public interface HandlerMethodArgumentResolver {

    //判断当前解析器是否能处理这个parameter这个参数，也就是说是否能够将请求中的数据转换为parameter指定的参数的值
    boolean supportsParameter(MethodParameter parameter);

    //解析参数：从http请求中解析出控制器需要的参数的值
    Object resolveArgument(MethodParameter parameter, @Nullable ModelAndViewContainer mavContainer,
            NativeWebRequest webRequest, @Nullable WebDataBinderFactory binderFactory) throws Exception;

}
```

这个接口有很多实现类，列几个比较熟悉的，当大家想知道springmvc还可以接收哪些类型的参数，以及这些参数有什么特点的时候，看看源码

| 实现类 | 对应的控制器参数 | 说明 |
| --- | --- | --- |
| PathVariableMapMethodArgumentResolver | @PathVariable 标注参数 | 从url中提取参数的值 |
| RequestHeaderMethodArgumentResolver | @RequestHeader标注参数 | 从http头中提取参数值 |
| RequestParamMethodArgumentResolver | @RequestParam标注参数 | http请求参数中获取值 |
| RequestResponseBodyMethodProcessor | @RequestBody标注参数 | 提取body数据，转换为参数类型 |
| ServletResponseMethodArgumentResolver | ServletResponse、OutputStream、Writer这3种类型的参数 | 这几种类型用来控制http请求的响应输出流 |
| HttpEntityMethodProcessorHttpEntity | HttpEntity类型的参数 | HttpEntity中包含了http请求头和body的所有信息 |
| ExpressionValueMethodArgumentResolver | @Value标注的参数 | spel表达式，从spring容器中获取值 |
| MapMethodProcessor | 参数为Map或者子类型 | \- |
| ModelMethodProcessor | 参数为org.springframework.ui.Model 或子类型 | \- |
| ModelAttributeMethodProcessor | @ModelAttribute标注的参数 | \- |

## 9、tomcat9乱码问题

大家在tomcat9中跑案例的时候，控制台可能会输出乱码，需要配置下编码

![b2b7d373-ffc7-4365-be86-74bf8558dccf](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081719141.png)

[下一篇：吃透文件上传](http://www.itsoku.com/course/6/144)

[上一篇：如何接受请求中的参数？](http://www.itsoku.com/course/6/142)