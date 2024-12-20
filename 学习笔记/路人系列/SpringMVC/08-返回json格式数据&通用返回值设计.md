

# 返回json格式数据 & 通用返回值设计

[上一篇：返回页面常见的5种方式](http://www.itsoku.com/course/6/145)

[下一篇：SpringMVC返回null是什么意思？](http://www.itsoku.com/course/6/146)

目前比较流行前后端分离，后端只需为前端提供restfull接口，所有的接口都返回json格式的数据，前端接收到json数据之后再进行处理。

那么在SpringMVC中如何向前端输出json格式的数据呢？

常见的有3种方式，我们来了解下。

## 1、方式1：方法上添加@ResponseBody

### 需求

使用springmvc提供一个接口，以json格式输出用户列表。

### 3个步骤

#### step1：maven配置引入jackjson

> jackjson用于将java对象转换为json格式的字符串，也可以将json格式的字符串转换为java对象
> 
> 我们的接口需要将java对象转换为json格式的字符串输出到客户端，所以我们需要用到这个包。

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

#### step2：springmvc配置文件中添加注解驱动

```xml
<!-- 添加mvc注解驱动 -->
<mvc:annotation-driven/>
```

> 添加了这段代码之后，springmvc就被赋予了将java对象转换为json格式字符串输出到客户端的能力。

#### step3：处理器的方法上添加@ResponseBody注解

> 如下代码，我们希望list()方法用于向客户端以json格式输出用户列表。
> 
> 此时只需要在这个方法上面添加一个`@ResponseBody`注解，SpringMVC发现这个方法上有`@ResponseBody`这个注解，并且方法返回值是一个普通的java对象的时候，会将方法的返回值使用jackson转换为json格式的字符串，然后输出到客户端。

```java
@Controller
public class UserController {
    /**
     * 用户列表(用户id->用户信息)
     */
    Map<Long, UserDto> userDtoMap = new ConcurrentHashMap<>();

    {
        userDtoMap.put(1L, new UserDto(1L, "路人", 30));
        userDtoMap.put(2L, new UserDto(2L, "张三", 20));
        userDtoMap.put(3L, new UserDto(3L, "李四", 18));
    }

    @GetMapping("/user/list.do")
    @ResponseBody
    public Collection<UserDto> list() {
        return this.userDtoMap.values();
    }

}
```

### 验证效果

谷歌浏览器中访问下这个接口

![80d88201-f633-4826-b810-e9e416217ca5](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081725267.png)

F12看一下接口的响应头，如下，可以看到response的`Content-Type`的值为`application/json;chatset=UTF-8`，这个说明响应结果的内容格式是json格式。

![9b58bf26-e824-4915-87ca-1566dce53ad3](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081725698.png)

## 2、方式2：Controller上添加@ResponseBody注解

当我们controller中方法很多的时候，且所有方法都要求返回json格式的数据的时候，如果按照方式1，我们需要在每个方法上都要添加`@ResponseBody`注解，此时有更简单的方法，将所有方法上的`@ResponseBody`注解都去掉，然后在Controller上加上`@ResponseBody`就可以了。

比如下面这段代码，我们可以将2个方法上面的`@ResponseBody`干掉，然后在类上添加`@ResponseBody`注解就可以了。

```java
@Controller
public class UserController {

    Map<Long, UserDto> userDtoMap = new ConcurrentHashMap<>();

    {
        userDtoMap.put(1L, new UserDto(1L, "路人", 30));
        userDtoMap.put(2L, new UserDto(2L, "张三", 20));
        userDtoMap.put(3L, new UserDto(3L, "李四", 18));
    }

    @GetMapping("/user/list.do")
    @ResponseBody
    public Collection<UserDto> list() {
        return this.userDtoMap.values();
    }


    @GetMapping("/user/{id}.do")
    @ResponseBody
    public UserDto user(@PathVariable("id") Long id) {
        return this.userDtoMap.get(id);
    }

}
```

调整之后如下

```java
@Controller
@ResponseBody
public class UserController {

    Map<Long, UserDto> userDtoMap = new ConcurrentHashMap<>();

    {
        userDtoMap.put(1L, new UserDto(1L, "路人", 30));
        userDtoMap.put(2L, new UserDto(2L, "张三", 20));
        userDtoMap.put(3L, new UserDto(3L, "李四", 18));
    }

    @GetMapping("/user/list.do")
    public Collection<UserDto> list() {
        return this.userDtoMap.values();
    }


    @GetMapping("/user/{id}.do")
    public UserDto user(@PathVariable("id") Long id) {
        return this.userDtoMap.get(id);
    }

}
```

## 3、方式3：Controllers上使用@RestController

我们回头再看下上面代码，如下图，UserController上有2个注解`@Controller`和`@ResponseBody`，而SpringMVC提供了一个更好的注解`@RestController`，相当于这2个注解的合体，所以可以用来替换这2个注解。

![c3dcef44-6f95-4751-8084-f67bfba0611c](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081725036.png)

![c48ffe73-28e9-47aa-b3ab-a34b42ff87a4](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081725933.png)

![c9729993-1f00-40ad-8305-e7b54c34aec6](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081725659.png)

## 4、restfull接口通用返回值

客户端调用服务器端接口的时候，接口有可能会发生异常，这些异常信息需要返回给调用者，通常我们会为错误定义错误码以及提示信息。

一般我们会定义通用的返回值类型，格式如下：

```java
/**
 * rest接口通用返回值数据结构
 * @param <T>
 */
public class ResultDto<T> {
    //接口状态（成功还是失败）
    private Boolean success;
    //错误码
    private String code;
    //提示信息
    private String msg;
    //数据
    private T data;

    public static <T> ResultDto<T> success(T data) {
        return success(data, "操作成功!");
    }

    public static <T> ResultDto<T> success(T data, String msg) {
        ResultDto<T> result = new ResultDto<>();
        result.setSuccess(Boolean.TRUE);
        result.setMsg(msg);
        result.setData(data);
        return result;
    }

    //省略get、set方法

}
```

控制器中所有的方法都返回ResultDto类型的结果，如下代码

```java
@RestController
public class UserController {

    Map<Long, UserDto> userDtoMap = new ConcurrentHashMap<>();

    {
        userDtoMap.put(1L, new UserDto(1L, "路人", 30));
        userDtoMap.put(2L, new UserDto(2L, "张三", 20));
        userDtoMap.put(3L, new UserDto(3L, "李四", 18));
    }

    @GetMapping("/user/list.do")
    public ResultDto<Collection<UserDto>> list() {
        return ResultDto.success(this.userDtoMap.values());
    }


    @GetMapping("/user/{id}.do")
    public ResultDto<UserDto> user(@PathVariable("id") Long id) {
        return ResultDto.success(this.userDtoMap.get(id));
    }

}
```

## 5、案例代码

```html
git地址：https://gitee.com/javacode2018/springmvc-series
```

![6ca8839c-b604-4072-93a8-10cd38bbc5f6](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081726377.png)

## 6、总结

*   掌握@ResponseBody的用法，用来返回json格式的数据，注意需要在springmvc配置文件中添加注解驱动的配置，否则调用会报错
    
    ```xml
    <!-- 添加mvc注解驱动 -->
    <mvc:annotation-driven/>
    ```
    
*   掌握通用接口返回值的用法
    

[下一篇：SpringMVC返回null是什么意思？](http://www.itsoku.com/course/6/146)

[上一篇：返回页面常见的5种方式](http://www.itsoku.com/course/6/145)
