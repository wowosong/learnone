

# ResponseBodyAdvice：对@ResponseBody进行增强

## 目录

*   [目录](#%E7%9B%AE%E5%BD%95)
*   [1、前言](#1%E3%80%81%E5%89%8D%E8%A8%80)
*   [2、接口如何实现统一返回值？](#2%E3%80%81%E6%8E%A5%E5%8F%A3%E5%A6%82%E4%BD%95%E5%AE%9E%E7%8E%B0%E7%BB%9F%E4%B8%80%E8%BF%94%E5%9B%9E%E5%80%BC%EF%BC%9F)
*   [3、案例：通过RequestBodyAdvice实现统一返回值](#3%E3%80%81%E6%A1%88%E4%BE%8B%EF%BC%9A%E9%80%9A%E8%BF%87RequestBodyAdvice%E5%AE%9E%E7%8E%B0%E7%BB%9F%E4%B8%80%E8%BF%94%E5%9B%9E%E5%80%BC)
    *   [3.1、git代码位置](#3.1%E3%80%81git%E4%BB%A3%E7%A0%81%E4%BD%8D%E7%BD%AE)
    *   [3.2、定义返回值的通用类型](#3.2%E3%80%81%E5%AE%9A%E4%B9%89%E8%BF%94%E5%9B%9E%E5%80%BC%E7%9A%84%E9%80%9A%E7%94%A8%E7%B1%BB%E5%9E%8B)
    *   [3.3、自定义一个ResponseBodyAdvice](#3.3%E3%80%81%E8%87%AA%E5%AE%9A%E4%B9%89%E4%B8%80%E4%B8%AAResponseBodyAdvice)
    *   [3.4、来个controller测试效果](#3.4%E3%80%81%E6%9D%A5%E4%B8%AAcontroller%E6%B5%8B%E8%AF%95%E6%95%88%E6%9E%9C)
    *   [3.5、验证接口输出](#3.5%E3%80%81%E9%AA%8C%E8%AF%81%E6%8E%A5%E5%8F%A3%E8%BE%93%E5%87%BA)
*   [4、多个ResponseBodyAdvice指定顺序](#4%E3%80%81%E5%A4%9A%E4%B8%AAResponseBodyAdvice%E6%8C%87%E5%AE%9A%E9%A1%BA%E5%BA%8F)
*   [5、@ControllerAdvice指定增强的范围](#5%E3%80%81@ControllerAdvice%E6%8C%87%E5%AE%9A%E5%A2%9E%E5%BC%BA%E7%9A%84%E8%8C%83%E5%9B%B4)
*   [6、ResponseBodyAdvice原理](#6%E3%80%81ResponseBodyAdvice%E5%8E%9F%E7%90%86)
*   [7、留个问题](#7%E3%80%81%E7%95%99%E4%B8%AA%E9%97%AE%E9%A2%98)
*   [最新资料](#%E6%9C%80%E6%96%B0%E8%B5%84%E6%96%99)
    

## 1、前言

上一篇中介绍了RequestBodyAdvice接口，可以对@RequestBody进行增强，本文介绍另外一个相似的接口：`ResponseBodyAdvice`，这个可以对@ResponseBody进行增强，可以拦截@ResponseBody标注的方法的返回值，对返回值进行统一处理，比如进行加密、包装等操作；比如通过他可以实现统一的返回值。

## 2、接口如何实现统一返回值？

要求系统中所有返回json格式数据的接口都需要返回下面格式的数据。

```json
{
  "success": true,
  "code": null,
  "msg": "操作成功!",
  "data": 具体的数据
}
```

但是咱们系统中所有的接口返回值都是下面这种格式的，难道咱们要一个个去手动改一下接口的返回值么？

![34864be1-f678-4c15-8ce1-f969bafb410e](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081043807.png)

SpringMVC为我们提供了更简单的方法，此时我们可以使用RequestBodyAdvice来实现，拦截所有@ResponseBody接口，将接口的返回值包装一下，包装为统一的格式返回，下面来看具体代码如何实现。

## 3、案例：通过RequestBodyAdvice实现统一返回值

### 3.1、git代码位置

```http
https://gitee.com/javacode2018/springmvc-series
```

![0cd1ab2e-41c2-414c-8aad-0c4ed734e005](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081043936.png)

### 3.2、定义返回值的通用类型

```java
package com.javacode2018.springmvc.chat14.dto;

/**
 * rest接口通用返回值数据结构
 *
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

    public Boolean getSuccess() {
        return success;
    }

    public void setSuccess(Boolean success) {
        this.success = success;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getMsg() {
        return msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }

    public T getData() {
        return data;
    }

    public void setData(T data) {
        this.data = data;
    }

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

    public static <T> ResultDto<T> error(String msg) {
        return error(null, msg);
    }

    public static <T> ResultDto<T> error(String code, String msg) {
        return error(code, msg, null);
    }

    public static <T> ResultDto<T> error(String code, String msg, T data) {
        ResultDto<T> result = new ResultDto<>();
        result.setSuccess(Boolean.FALSE);
        result.setCode(code);
        result.setMsg(msg);
        result.setData(data);
        return result;
    }
}
```

### 3.3、自定义一个ResponseBodyAdvice

```java
package com.javacode2018.springmvc.chat14.config;

import com.javacode2018.springmvc.chat14.dto.ResultDto;
import org.springframework.core.MethodParameter;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.servlet.mvc.method.annotation.ResponseBodyAdvice;

import java.util.HashSet;
import java.util.Set;

@ControllerAdvice
public class ResultDtoResponseBodyAdvice implements ResponseBodyAdvice<Object> {

    //不支持的类型列表
    private static final Set<Class<?>> NO_SUPPORTED_CLASSES = new HashSet<>(8);

    static {
        NO_SUPPORTED_CLASSES.add(ResultDto.class);
        NO_SUPPORTED_CLASSES.add(String.class);
        NO_SUPPORTED_CLASSES.add(byte[].class);
        NO_SUPPORTED_CLASSES.add(Resource.class);
        NO_SUPPORTED_CLASSES.add(javax.xml.transform.Source.class);
    }

    @Override
    public boolean supports(MethodParameter returnType, Class<? extends HttpMessageConverter<?>> converterType) {
        //如果返回值是NO_SUPPORTED_CLASSES中的类型，则不会被当前类的beforeBodyWrite方法处理，即不会被包装为ResultDto类型
        if (NO_SUPPORTED_CLASSES.contains(returnType.getParameterType())) {
            return false;
        } else {
            return true;
        }
    }

    @Override
    public Object beforeBodyWrite(Object body, MethodParameter returnType, MediaType selectedContentType, Class<? extends HttpMessageConverter<?>> selectedConverterType, ServerHttpRequest request, ServerHttpResponse response) {
        return ResultDto.success(body);
    }
}
```

> *   需要实现ResponseBodyAdvice接口
> *   类上需要标注@ControllerAdvice注解
> *   springmvc内部会对@ResponseBody方法的返回值进行处理，会先调用ResponseBodyAdvice的supports方法，如果方法返回true，则会进到其`beforeBodyWrite`方法中，我们在这个方法中将其包装为需求中统一的格式返回。
> *   大家需要注意supports方法，内部排除NO\_SUPPORTED\_CLASSES中指定的5种类型，这几种类型的返回值不会被处理。

### 3.4、来个controller测试效果

```java
@RestController
public class UserController {
    @RequestMapping("/user")
    public User user() {
        return new User("路人", 30);
    }

    @RequestMapping("/user/list")
    public List<User> list() {
        List<User> result = Arrays.asList(new User("SpringMVC系列", 3), new User("SpringBoot系列", 2));
        return result;
    }

    @RequestMapping("/user/m1")
    public String m1() {
        return "ok";
    }

    @RequestMapping("/user/m2")
    public Integer m2() {
        return 1;
    }

    @RequestMapping("/user/m3")
    public ResultDto<String> m3() {
        return ResultDto.success("ok");
    }

    public static class User {
        private String name;
        private Integer age;

        public User() {
        }

        public User(String name, Integer age) {
            this.name = name;
            this.age = age;
        }

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public Integer getAge() {
            return age;
        }

        public void setAge(Integer age) {
            this.age = age;
        }

        @Override
        public String toString() {
            return "User{" +
                    "name='" + name + '\'' +
                    ", age=" + age +
                    '}';
        }
    }
}
```

controller中定义了5个接口，来看看他们的返回值，顺便看下他们是否会被ResultDtoResponseBodyAdvice处理为统一的格式呢？

| 方法/接口 | 返回值 | 是否会被ResultDtoResponseBodyAdvice处理？ |
| --- | --- | --- |
| /user | User | 是 |
| /user/list | List\<User> | 是 |
| /user/m1 | String | 否 |
| /user/m2 | Integer | 是 |
| /user/m3 | ResultDto | 否 |

### 3.5、验证接口输出

![82c6f60e-aae8-4a4a-aaa7-896e02f70d44](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081044833.png)

**/user接口：** 输出如下，说明被统一处理了

```json
{
  "success": true,
  "code": null,
  "msg": "操作成功!",
  "data": {
    "name": "路人",
    "age": 30
  }
}
```

**/user/list接口：** 输出如下，说明被统一处理了

```json
{
  "success": true,
  "code": null,
  "msg": "操作成功!",
  "data": [
    {
      "name": "SpringMVC系列",
      "age": 3
    },
    {
      "name": "SpringBoot系列",
      "age": 2
    }
  ]
}
```

**/user/m1接口：** 输出如下，说明没有被统一处理，直接将controller中方法返回的值直接输出了

```plain
ok
```

**/user/m2接口：** 输出如下，说明也被统一处理了

```json
{
  "success": true,
  "code": null,
  "msg": "操作成功!",
  "data": 1
}
```

**/user/m3接口：** 直接返回的是ResultDto类型的，没有被统一处理

```json
{
  "success": true,
  "code": null,
  "msg": "操作成功!",
  "data": "ok"
}
```

## 4、多个ResponseBodyAdvice指定顺序

当程序中定义了多个`ResponseBodyAdvice`，可以通过下面2种方式来指定顺序。

**方式1**：使用`@org.springframework.core.annotation.Order`注解指定顺序，顺序按照value的值从小到大

**方式2**：实现`org.springframework.core.Ordered`接口，顺序从小到大

## 5、@ControllerAdvice指定增强的范围

@ControllerAdvice注解相当于对Controller的功能进行了增强，目前来看，对所有的controller方法都增强了。

那么，能否控制一下增强的范围呢？比如对某些包中的controller进行增强，或者通过其他更细的条件来控制呢？

确实可以，可以通过@ControllerAdvice中的属性来指定增强的范围，需要满足这些条件的才会被@ControllerAdvice注解标注的bean增强，每个属性都是数组类型的，所有的条件是或者的关系，满足一个即可。

```java
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Component
public @interface ControllerAdvice {

    /**
     * 用来指定controller所在的包，满足一个就可以
     */
    @AliasFor("basePackages")
    String[] value() default {};

    /**
     * 用来指定controller所在的包，满足一个就可以
     */
    @AliasFor("value")
    String[] basePackages() default {};

    /**
     * controller所在的包必须为basePackageClasses中同等级或者子包中，满足一个就可以
     */
    Class<?>[] basePackageClasses() default {};

    /**
     * 用来指定Controller需要满足的类型，满足assignableTypes中指定的任意一个就可以
     */
    Class<?>[] assignableTypes() default {};

    /**
     * 用来指定Controller上需要有的注解，满足annotations中指定的任意一个就可以
     */
    Class<? extends Annotation>[] annotations() default {};

}
```

**扩展知识**：这块的判断对应的源码如下，有兴趣的可以看看。

```plain
org.springframework.web.method.HandlerTypePredicate#test
```

![6b4dbfac-5d59-4d16-8d22-a07e9ece7649](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081045404.png)

## 6、ResponseBodyAdvice原理

有些朋友可能对`@ControllerAdvice和ResponseBodyAdvice`的原理比较感兴趣，想研究一下他们的源码，关键代码在下面这个方法中，比较简单，有兴趣的可以去翻阅一下，这里就不展开说了。

```java
org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerAdapter#afterPropertiesSet
org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerAdapter#initControllerAdviceCache
```

## 7、留个问题

当系统异常的时候，如何统一异常的输出呢？这里留给大家去思考一下，可以在留言中发表你的想法。
