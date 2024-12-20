

# @Controller、@RequestMapping

[上一篇：Helloword](http://www.itsoku.com/course/6/139)

[下一篇：接口测试利器 HTTP Client](http://www.itsoku.com/course/6/141)

## 1、本文内容

*   @Controller用法
*   @RequestMapping 用在方法上
*   @RequestMapping 用在类上
*   @RequestMapping 6种规则详解
*   http请求头中的Content-Type是干什么的？
*   http请求头中的Accept是干什么的？
*   @PostMapping、@GetMapping、@DeleteMapping、@PutMapping

## 2、@Controller

用来标注在类上，表示这个类是一个控制器类，可以用来处理http请求，通常会和@RequestMapping一起使用。

源码如下，这个注解上面有@Component注解，说明被@Controller标注的类会被注册到spring容器中，value属性用来指定这个bean的名称，也可以不指定，由容器自动生成。

```java
@Target(\{ElementType.TYPE\})
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Component
public @interface Controller \{

    @AliasFor(annotation = Component.class)
    String value() default "";

\}
```

## 3、@RequestMapping

### 3.1、作用

表示请求映射，一般用在我们自定义的Controller类上或者Controller内部的方法上。

通过这个注解指定配置一些规则，满足这些规则的请求会被标注了@RequestMapping的方法处理。

### 3.2、源码

源码如下，包含了8个属性，这些属性都是用来配置规则的，大家通过名称的基本上可以知道每个属性是来配置哪些规则的。

```java
@Target(\{ElementType.TYPE, ElementType.METHOD\})
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Mapping
public @interface RequestMapping \{

    String name() default "";

    @AliasFor("path")
    String[] value() default \{\};

    @AliasFor("value")
    String[] path() default \{\};

    RequestMethod[] method() default \{\};

    String[] params() default \{\};

    String[] headers() default \{\};

    String[] produces() default \{\};

\}
```

### 3.3、规则匹配原理

当springmvc容器启动时，会扫描标注有@Controller注解的类，将这些Controller中标注有@RequestMapping的方法收集起来，得到一个Map<@RequestMapping,Method>（@RequestMapping和方法的映射），当一个请求到达DispatcherServlet的时候，其内部会根据请求的信息（url、参数、header、请求的类型【通过头中的Content-type指定】、可以接受的类型【可以通过头中的Accept指定】）去这个Map中和@RequestMapping中的规则进行匹配，从而得到可以处理这个请求的方法，然后进行调用，所有的@RequestMapping都匹配失败的时候，会返回404

### 3.4、通过@RequestMapping可配置6种规则

@RequestMapping支持6种规则，这些规则都是通过@RequestMapping中的属性进行配置的，多个属性的值是AND关系

下面我们一起来熟悉这6种规则。

#### 3.4.1、规则1：通过value、path来限制请求地址

##### 用法

可以指定value、path这2个属性中的任意一个，作用是一样的，用来对请求的url进行限制。

##### 多个值的关系

这几个属性的类型都是String类型的数组，说明可以指定多个值，多个值之间是OR关系。

##### 案例

| url的值 | 说明 |
| --- | --- |
| \\{"/user/insert"\\} | 可以处理/user/insert这个请求 |
| \\{"/user/list","/user/getList"\\} | 可以同时处理/user/list和/user/getList这2个请求 |

#### 3.4.2、规则2：通过header属性来限制请求头

##### 用法

通过header属性来对请求中的header进行限制，比如我们希望请求中必须必须携带token这个头，那么就可以使用这个。

##### 多个值的关系

AND关系

##### 案例

| header的值 | 说明 |
| --- | --- |
| \{"header1"\} | 请求的header中必须有header1这个头，值随意 |
| \{"header1=v1"\} | 必须包含header1为v1的头 |
| \{"!header1\} | 这里用到了!符号，表示头中不能有header1这个头 |
| \{"header1","header2=v2"\} | header的值是and关系，所以这个值表示：头中必须包含header1以及header2，且header2的值为v2 |

#### 3.4.3、规则3：通过params属性来限制请求参数

##### 用法

通过params属性来限制请求中的参数，比如我们希望请求中必须有某些指定的参数时，才能被指定的方法处理，可以使用这个。

##### 多个值的关系

AND关系

##### 案例

| params的值 | 说明 |
| --- | --- |
| \{"name"\} | 请求中必须包含name参数，值随意 |
| \{"name=路人"\} | 请求中必须包含`name`这个参数，且值必须是`路人` |
| \{"name","age=1"\} | 请求中必须包含参数name和参数age，且age的值为1 |
| \{"!age"\} | 请求中不能有参数age |

#### 3.4.4、规则4：通过method属性来限制http请求额方法

##### 用法

如果需要限制某个方法只能处理http的post请求，那么就可以通过method属性来进行设置，如果不指定method的值，表示对http请求额method无限制。

##### 多个值的关系

OR关系

##### 案例

| method的值 | 说明 |
| --- | --- |
| \{POST\} | 只能接受post请求 |
| \{POST,GET\} | post、get请求都可以处理 |

#### 3.4.5、规则5：通过consumes属性来限制请求的类型

##### Content-Type是什么？

熟悉http请求的朋友应该对Content-Type这个属性比较眼熟吧，这个属性是用来做什么的？

Content-Type用来指定http请求中body的数据的类型，是Json呢？还是文本呢？还是图片、pdf呢？

这些就可以通过Content-Type来进行指定，这样服务器接受到请求的时候，就知道body中数据的类型了，比如application/json，就表示body中是一个json数据，那么服务器就可以以json的方式来解析body中的数据。

来几个大家熟悉的

| Content-Type的值 | 说明 |
| --- | --- |
| application/x-www-form-urlencoded | 这个是我们最常见的，通常我们在页面中通过post方式来提交一个表单，那么这个请求的类型就是这种 |
| multipart/form-data | 通过表单上传文件用的就是这种类型，这种表示请求的body有多部分组成 |
| application/json | 表示body中的数据是一个json格式的数据 |
| image/gif | 表示body中的数据是gif图片 |

Content-Type通常有主类型和子类型，中间通过/分割，这里就不详细展开了，有兴趣的朋友可以去百度专门研究下。

##### consumes属性用法

而@RquestMapping中的consumers就是用来对Content-Type进行限制。

##### 多个值的关系

OR关系

##### 案例

| consumes的值 | 说明 |
| --- | --- |
| \{"application/x-www-form-urlencoded"\} | 请求中Content-Type的类型必须是application/x-www-form-urlencoded类型 |
| \{"application/\*"\} | Content-Type的类型必须是application类型的，比如：application/json、application/pdf、application/x-www-form-urlencoded |
| \{"image/gif", "image/png"\} | Content-Type的可以是\["image/gif", "image/png"\]中的任意一种 |

#### 3.4.6、规则6：通过produces属性来限制客户端可以接受的类型

##### Accept是什么？

熟悉http请求的朋友应该对Accept这个属性比较眼熟吧，这个属性是用来做什么的？

和Content-Type刚好相反，Content-Type用来指定客户端发送的数据的类型，而**Accept是用来指定客户端希望接受的数据的类型的**。

比如客户端希望服务器端返回json格式的数据，那么可以这么指定

```html
Accept: application/json
```

值可以Content-Type的值类似，这里就不举例了。

##### produces属性用法

指定返回的内容类型，仅当request请求头中的(Accept)类型中包含该指定类型才返回。

##### 多个值的关系

OR关系

##### 案例

| produces的值 | 说明 |
| --- | --- |
| \{"application/json"\} | 服务器端支持返回application/json类型数据，所以要求Accept也可以接受这种类型的数据 |
| \{"image/gif", "image/png"\} | 服务器端支持返回\["image/gif", "image/png"\]中其中一种类型数据，所以要求Accept也可以接受这2中种类型中任意一种就可以 |

## 4、6种规则对照表

| 属性 | 多个值之间的关系 | 说明 |
| --- | --- | --- |
| value、path | OR | 限制url |
| header | AND | 限制请求头 |
| params | AND | 限制请求的参数 |
| method | OR | 限制http请求的method |
| consumes | OR | 限制Content-Type的类型（客户端发送数据的类型） |
| produces | OR | 限制Aceept的类型（客户端可接受数据的类型） |

## 5、其他几个注解

| 注解 | 相当于 |
| --- | --- |
| @PostMapping | @RequestMapping(method=RequestMethod.POST) |
| @GetMapping | @RequestMapping(method=RequestMethod.GET) |
| @DeleteMapping | @RequestMapping(method=RequestMethod.DELETE) |
| @PutMapping | @RequestMapping(method=RequestMethod.PUT) |

## 6、@RequestMapping用在类上

### 作用

用于将方法上@RequestMapping共有的规则提取出来，放在类上，起到重用的作用，可以简化代码。

### 案例

如下图的controller中有4个方法都有@RequestMapping，他们的value属性的值都以`/user`开头，那么我们就可以将这部分提取出来放在这个类上面。

![9b0266de-6464-40af-9e57-1ebce79f11d9](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081711216.png)

简化之后，变成了下面这样，将他们共有的部分提取到类上的@RequestMapping中了，起到了共用的作用。

![fb70bcf5-7d7c-4d80-b481-0efe14e62c48](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081712148.png)

## 7、SpringMVC系列源码

```html
https://gitee.com/javacode2018/springmvc-series
```

## 8、总结

@RequestMaping中value、path、consumers、producers稍微用到的多一些，其他几个属性用到的比较少，了解即可。

关于6种规则，大家可以自己去试试，会springboot的朋友，可以直接使用springboot快速写一些用例结合postman测试下，加深记忆和理解。


[下一篇：接口测试利器 HTTP Client](http://www.itsoku.com/course/6/141)

[上一篇：Helloword](http://www.itsoku.com/course/6/139)
