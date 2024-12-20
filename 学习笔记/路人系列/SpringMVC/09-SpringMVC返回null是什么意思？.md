

# SpringMVC返回null是什么意思？

[上一篇：返回json格式数据 & 通用返回值设计](http://www.itsoku.com/course/6/159)

[下一篇：异步处理请求](http://www.itsoku.com/course/6/147)

## 1、回顾一下

目前为止，springmvc系列中，已经介绍了大量Controller的用法，大家有没有注意到，目前所有controller中的方法接收到请求之后，都是有返回值的，返回值主要有2种类型：

1、 输出的是页面：也就是视图（会向客户端输出页面），此时方法的返回值可以是String（视图名称）、ModelAndView（页面中有数据的情况）

2、输出的是json格式的数据：需要用到@ResponseBody注解

这2种情况中，都是springmvc来处理返回值的，接受到返回值之后，会调用response来进行页面跳转或者调用输出流将json格式的数据输出。

## 2、思考一个问题

当方法的返回值为void或者方法中返回null的时候，springmvc会怎么处理呢？

比如下面2个方法：

```java
@GetMapping("/test1")
public void test(){
}

@GetMapping("/test1")
public Object test(){
    return null;
}
```

**当出现上面这2种情况的时候，springmvc调用这些方法之后，请求就结束了，springmvc会认为在控制器的方法中响应已经被处理过了，不需要springmvc去处理了。**

## 3、springmvc的处理流程

![abd3aa52-f1c6-4bc0-8590-b1cc3cfabfa2](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081726134.png)

## 4、使用场景

当响应结果比较复杂的时候，springmvc无法处理这些响应结果的时候，我们可以在控制器的方法中使用response来主动控制输出的结果。

比如下载文件、断点下载文件等比较复杂的响应，此时我们可以在处理器的方法中使用HttpServletResponse来自己控制输出的内容，可以执行更细粒度的操作。

## 5、总结

到目前我们主要掌握了3种类型的返回值，工作中基本上最常用的就是这3种方式，咱们要掌握好：

*   第1种：返回视图，即页面，此时返回值可以是String（视图名称）、或者ModelAndView
    
*   第2种：返回json格式数据，此时需要用到@ResponseBody注解
    
*   第3种：方法返回值为void或者return null；此时需要我们在方法中自己通过HttpServletResponse对象来主动向客户端输出结果。

## 6、案例代码

```html
git地址：https://gitee.com/javacode2018/springmvc-series
```

[下一篇：异步处理请求](http://www.itsoku.com/course/6/147)

[上一篇：返回json格式数据 & 通用返回值设计](http://www.itsoku.com/course/6/159)
