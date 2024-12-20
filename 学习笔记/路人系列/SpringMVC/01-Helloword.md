

# Helloword-Java

[SpringMVC教程](http://www.itsoku.com/course/6)  ->  Helloword

[1、Helloword](http://www.itsoku.com/course/6/139)

[2、@Controller、@RequestMapping](http://www.itsoku.com/course/6/140)

[3、接口测试利器 HTTP Client](http://www.itsoku.com/course/6/141)

[4、如何接受请求中的参数？](http://www.itsoku.com/course/6/142)

[5、@RequestBody接收Json格式数据](http://www.itsoku.com/course/6/143)

[6、吃透文件上传](http://www.itsoku.com/course/6/144)

[7、返回页面常见的5种方式](http://www.itsoku.com/course/6/145)

[8、返回json格式数据 & 通用返回值设计](http://www.itsoku.com/course/6/159)

[9、SpringMVC返回null是什么意思？](http://www.itsoku.com/course/6/146)

[10、异步处理请求](http://www.itsoku.com/course/6/147)

[11、如何集成静态资源？](http://www.itsoku.com/course/6/148)

[12、拦截器怎么用？](http://www.itsoku.com/course/6/149)

[13、统一异常处理](http://www.itsoku.com/course/6/150)

[14、实战篇：通用返回值 & 异常处理设计](http://www.itsoku.com/course/6/151)

[15、全注解的方式 & 原理解析](http://www.itsoku.com/course/6/152)

[16、源码解析SpringMVC处理请求的流程](http://www.itsoku.com/course/6/153)

[17、源码解析SpringMVC容器的启动过程](http://www.itsoku.com/course/6/154)

[18、RequestBodyAdvice：对@ReuqestBody进行增强](http://www.itsoku.com/course/6/155)

[19、ResponseBodyAdvice：对@ResponseBody进行增强](http://www.itsoku.com/course/6/156)

[20、RESTful接口详解](http://www.itsoku.com/course/6/157)

[21、接口调用利器RestTemplate](http://www.itsoku.com/course/6/158)

[22、CORS通信](http://www.itsoku.com/course/6/197)

[23、浏览器安全策略 & CORS](http://www.itsoku.com/course/6/198)

[24、Http中的Content-Type详解](http://www.itsoku.com/course/6/199)

[下一篇：@Controller、@RequestMapping](http://www.itsoku.com/course/6/140)

大家好，我是路人，前段时间把spring系列写完之后，就直接写springboot系列了，但是发现了一个问题，有不少粉丝问我springmvc系列哪里看？这些粉丝中可能有些朋友根本没有接触过springmvc，然后直接被我带入了springboot，会突然感觉很懵逼。

目前大多数公司都会使用Springboot来开发微服务，为其他端提供接口，而这些功能都是依靠springmvc实现的，所以为了大家看我的文章能够顺畅一些，还是决定先把springmvc系列补上，不管大家是否学过springmvc，都希望你们和我一起再过一遍springmvc，因为每个人对springmvc的理解也是不一样的，我会采用大量案例来进行讲解，也会介绍原理及源码，希望对你有所帮助。

## 1、为什么需要学springmvc？

工作需要

> 目前用到java的企业，99.99%都会用到springmvc，即使没有直接使用springmvc，也会使用springboot，而springboot中基本上都会用到springmvc

面试需要

> 企业都在使用springmvc，所以面试的时候基本都会问到相关的问题。

更好的学习springboot、springcloud

> 如果想学好 springboot 和 springcloud，那么必须先掌握spring、springmvc这2个技术。

## 2、预备知识

学习springmvc之前，需要先掌握2个系列的课程：maven和spring，还未学的朋友，先去补补。

*   [  喔喔松Java - maven系列](https://mp.weixin.qq.com/s/RfgETkcpLM_aSLUihGsJow)
*   [  喔喔松Java - spring高手系列](https://mp.weixin.qq.com/s/E7wNLtU-453b9YC3XoUvqQ)

## 3、软件版本

*   idea 2020.3.3
*   jdk1.8
*   ≥maven3.6.1
*   spring5.3.6
*   apache-tomcat-9.0.46

## 4、本文目标

通过springmvc实现一个helloword，将项目发布到tomcat中，然后在首页中发起一个请求，请求交给springmvc处理，由springmvc向客户端输出一个helloword，通过这个案例让大家熟悉下springmvc的使用步骤。

## 5、Helloword案例

### 开发步骤

```html
1、创建一个maven项目
2、在项目中创建一个maven web模块
3、maven中添加springmvc相关依赖
4、web.xml中配置springmvc
5、添加springmvc配置文件
6、写一个HelloWordController
7、将项目部署到tomcat中
8、浏览器中验证效果
```

下面跟着我一步步来操作。

### step1：创建一个maven项目

使用idea创建父子项目，打开idea->File->New->Project

![d49bb2db-2429-46a2-93bb-81c3d004f09f](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081703905.png)

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081703496.png)

按照下图输入对应的信息

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081703257.png)

点击Finish，项目创建成功，如下图

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081704329.png)

按照下图中的说明，将红框的部分删除

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081704903.png)

将pom.xml文件内容替换为下面的内容

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>com.javacode2018</groupId>
    <artifactId>springmvc-series</artifactId>
    <version>1.0-SNAPSHOT</version>
    <packaging>pom</packaging>

    <properties>
        <maven.compiler.source>8</maven.compiler.source>
        <maven.compiler.target>8</maven.compiler.target>
    </properties>

</project>
```

此时项目结构如下图

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081704707.png)

如下图，`File->Settings`中指定项目maven的版本

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081705445.png)

### step2、项目中创建一个maven模块

选中项目->点击鼠标右键->New->Module，创建一个maven模块

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081706501.png"")

如下图，通过maven的插件来创建web模块，这个地方的maven插件需要注意下，不要选错了

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081706907.png)

点击上图中的Next，进入下面页面，输入模块的信息，然后点击Next

![bf2f40cb-61c6-43c4-a2f4-19ce453c4830](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081707711.png)

如下图，继续点击Finish，完成模块的创建

![14a7f68d-f539-4c9b-985c-89c217e2b2e0](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081707826.png)

项目结构如下图

![e43851fb-75f3-406d-b054-5b97dace7f0c](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081707256.png)

chat01-helloword模块中需要添加几个文件夹，操作如下图：

![9f335365-d78e-4dee-8651-e1ef45acfd97](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081707126.png)

![3c1ac9a5-3c5a-4576-b19f-9169905ec0b9](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081707747.png)

![12cd9067-7607-4f0b-8e7b-618da45244c8](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081707460.png)

### step3、maven中添加springmvc相关依赖

将下面内容替换到chat01-helloword/pom.xml中，主要添加了springmvc和servlet的依赖配置信息。

```xml
<?xml version="1.0" encoding="UTF-8"?>

<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>com.javacode2018</groupId>
    <artifactId>chat01-helloword</artifactId>
    <version>1.0-SNAPSHOT</version>
    <packaging>war</packaging>

    <name>chat01-helloword Maven Webapp</name>
    <url>http://www.itsoku.com</url>

    <properties>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
    </properties>

    <dependencies>
        <!-- 添加springmvc依赖 -->
        <dependency>
            <groupId>org.springframework</groupId>
            <artifactId>spring-webmvc</artifactId>
            <version>5.3.6</version>
        </dependency>

        <!-- 添加servlet 依赖 -->
        <dependency>
            <groupId>jakarta.servlet</groupId>
            <artifactId>jakarta.servlet-api</artifactId>
            <version>5.0.0-M1</version>
            <scope>provided</scope>
        </dependency>
    </dependencies>

    <build>
        <finalName>chat01-helloword</finalName>
    </build>
</project>
```

### step4、web.xml中配置springmvc

web.xml版本太低了，我们先升级下他的版本

![68342a5f-8f3e-44bf-a4a8-3fc1b11997d7](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081708189.png)

点击`File->Project Structure->Module`，进入到下面界面

![c35c3ad3-d5e4-441a-a3ab-003476b93ef8](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081708629.png)

点击上图中的`-`按钮，如下图，然后确定删除

![44071805-6e90-4812-8180-ce8729d4a07b](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081708318.png)

![d1645060-bb48-40d2-82fb-74ab41f75315](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081708678.png)

然后按照下面操作，添加新版本的web.xml文件

![5853634c-9dd2-42e5-8c2e-9933a285f816](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081708616.png)

![f2e495da-0720-4da2-9f68-9c5b22c5c453](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081708618.png)

![46de4e5b-a615-494b-bff0-a904e0c3479d](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081709690.png)

![43aa95b0-b78d-4f2e-b5af-8ab59a02533e](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081709826.png)

web.xml版本升级成功

![97e24de9-0818-4788-8ec5-68291e727d51](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081709666.png)

在web.xml中添加springmvc的配置，可以直接将下面替换到web.xml中，主要就是配置了一个DispatcherServlet这个servlet，这个springmvc的核心配置

```xml
<?xml version="1.0" encoding="UTF-8"?>
<web-app xmlns="http://xmlns.jcp.org/xml/ns/javaee"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://xmlns.jcp.org/xml/ns/javaee http://xmlns.jcp.org/xml/ns/javaee/web-app_4_0.xsd"
         version="4.0">
    <!--
         声明springmvc核心配置对象：DispatcherServlet,这是一个servlet
         这个servlet的url-parttern配置的是：*.do
         表示以.do结尾的请求都发送给DispatcherServlet这个servlet去处理
     -->
    <servlet>
        <servlet-name>springmvc</servlet-name>
        <servlet-class>org.springframework.web.servlet.DispatcherServlet</servlet-class>
        <init-param>
            <!-- contextConfigLocation 用来指定springmvc配置文件的位置，文件名称不一定要交springmvc，大家可以随意起名 -->
            <param-name>contextConfigLocation</param-name>
            <param-value>classpath:springmvc.xml</param-value>
        </init-param>
        <!-- load-on-startup：表示web容器启动的时，当前对象创建的顺序，值越小初始化越早，大于等于0 -->
        <load-on-startup>0</load-on-startup>
    </servlet>
    <servlet-mapping>
        <servlet-name>springmvc</servlet-name>
        <url-pattern>*.do</url-pattern>
    </servlet-mapping>
</web-app>
```

### step5、添加springmvc配置文件

`chat01-helloword->resource->鼠标右键->New->XXML Configuration File->Spring Config`

![da0cfbe9-248b-4123-b341-d59bf459c672](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081709305.png)

输入文件名称：springmvc.xml

![031a2609-b384-49f0-ae44-c0212924e6e2](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081709632.png)

文件添加成功

![8646e0fb-39c4-4c0f-86c2-6f93780bcd03](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081709746.png)

替换下这个文件的内容

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:context="http://www.springframework.org/schema/context"
       xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd http://www.springframework.org/schema/context https://www.springframework.org/schema/context/spring-context.xsd">

    <!-- springmvc容器（也就是一个spring容器）会扫描指定包中的组件，将其注册到springmvc容器中 -->
    <context:component-scan base-package="com.javacode2018.springmvcseries.chat01"/>

</beans>
```

### step6、写一个HelloWordController

> 这个类中创建了一个hello方法，方法上面添加了一个@RequestMapping 注解，是Springmvc中的一个注解，value属性用来指定一个url列表，springmvc会将这些指定的url请求转发给当前方法处理。
> 
> 我们希望访问/hello.do的时候，跳转到/WEB-INF/view/hello.jsp这个页面，这个页面中输出一段内容

```java
package com.javacode2018.springmvcseries.chat01;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

@Controller
public class HelloController {
    /**
     * @RequestMapping：用来表示url和方法的映射
     * value属性用来指定一个url列表，springmvc会将这些指定的url请求转发给当前方法处理
     * @return
     */
    @RequestMapping("/hello.do")
    public ModelAndView hello() {
        ModelAndView modelAndView = new ModelAndView();
        modelAndView.setViewName("/WEB-INF/view/hello.jsp");
        //稍后将这个信息显示在hello.jsp中，modelAndView.addObject相当于request.setAttribute(name,value)
        modelAndView.addObject("msg","这是第一个springboot程序!");
        return modelAndView;
    }
}
```

/WEB-INF/view/中添加hello.jsp内容如下

![e7bb27e4-02c9-4e64-8f33-2f410afe3c77](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081710694.png)

```jsp
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <title>spingmvc系列</title>
</head>
<body>
    <h1>hello SpringMVC</h1>
</body>
</html>
```

修改index.jsp的内容，如下，主要添加一个超链接，当点击这个超链接的时候，请求会发给springmvc，然后springmvc会将请求转发给HelloController的hello方法，然后通过这个方法最后将hello.jsp内容输出

```jsp
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <title>spingmvc系列</title>
</head>
<body>
<div style="text-align: center">
    <h1>hello SpringMVC</h1>
    <h1>msg:${msg}</h1>
</div>
</body>
</html>
```

### step7、将项目部署到tomcat中

这里我们将项目部署到tomcat10中，过程如下：

![7b0997ed-0fa9-4d27-b6b6-39d3d73f60d9](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081710605.png)

![86bce316-89fe-4fa2-9d48-db5f5baf0e4b](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081710716.png)

![3a8f6931-82fd-4177-8e60-5ae73509c239](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081710830.png)

![fec8842a-b1c8-43a7-93f4-da453b211ed8](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081710505.png)

![c2fcd1ef-e4d1-42f8-bf97-a1c4e6d3eec4](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081710515.png)

如下图，启动tomcat

![efa92d5b-fb1f-4829-bc91-e0d9f0b38864](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081710098.png)

### step8、验证效果

访问：[http://localhost:8080/chat01/](http://localhost:8080/chat01/)

![a7b777af-9615-478f-993d-e964f50974e8](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081711535.png)

点击页面中的连接，会跳转到[http://localhost:8080/chat01/hello.do，输出](http://localhost:8080/chat01/hello.do%EF%BC%8C%E8%BE%93%E5%87%BA)

![54ee2497-b3bb-44a0-b145-74de8c953dde](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081711743.png)

## 6、SpringMVC处理器请的过程

### 6.1、详细的过程

1、tomcat启动的时候，会初始化DispatcherServlet，DispatcherServlet中会创建一个springmvc容器，其实就是我们熟悉的spring容器（ApplicationContext），只不过这个容器的类型是（WebApplicationContext），此容器会加载web.xml中contextConfigLocation指定的springmvc配置文件

![8e174878-38ad-4548-9af8-4dc399a7249e](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081711240.png)

2、由于springmvc.xml中指定了扫描包的规则，而HelloController符合这个扫描规则，所以会被注册到springmvc容器中

![cf55920d-f6df-4129-8f47-b7c7745b08c7](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081711768.png)

3、当发起\*.do请求的时候，请求会到达DispatcherServlet中央处理器，中央处理器会根据请求路径，去springmvc容器中找到能够处理这个请求的方法，具体由哪个方法来处理这个请求呢？

这里就是通过@RequestMapping来匹配的，这个注解可以将请求和方法进行映射，匹配的请求会被@RequestMapping标注的方法处理，所以在这个步骤中springmvc容器会发现HelloController这个bean的hello方法方法可以处理/hello.do请求

4、DispatcherServlet中通过反射来调用helloController这个bean的hello方法

5、DispatcherServlet接收到了hello方法的返回值

6、DispatcherServlet根据hello方法的返回值，做跳转操作，相当于

```java
request.getRequestDispatcher("/WEB-INF/view/hello.jsp").forward(request,response);
```

### 6.2、简化过程

**客户端发送请求 —-> 到达tomcat —-> tomcat发现是请求是\*.do的请求 —-> tomcat 将请求转发给中央调度器DispatcherServlet —-> 中央调度器根据url将转发给我们自定义的controller —-> DispacherServlet根据controller的返回结果做跳转操作 —-> 将结果输出到客户端**

## 7、总结

本文主要通过一个案例详细介绍了springmvc开发项目的一个过程，大家把案例敲一遍，有问题，欢迎留言交流。

## 8、软件及代码位置

软件地址：

```html
链接：https://pan.baidu.com/s/1_Ol-UZkN_6woMBtjcFygvQ 
提取码：e66j
```

代码位于码云上

```html
https://gitee.com/javacode2018/springmvc-series
```

[下一篇：@Controller、@RequestMapping](http://www.itsoku.com/course/6/140)
