

# RESTful接口详解

本文主要2个主题：介绍RESTful、SpringMVC中RESTful案例。

## 目录

*   [目录](#%E7%9B%AE%E5%BD%95)
*   [1、RESTful简介](#1%E3%80%81RESTful%E7%AE%80%E4%BB%8B)
*   [2、RESTful的实现](#2%E3%80%81RESTful%E7%9A%84%E5%AE%9E%E7%8E%B0)
*   [3、HiddenHttpMethodFilter](#3%E3%80%81HiddenHttpMethodFilter)
*   [4、RESTful案例](#4%E3%80%81RESTful%E6%A1%88%E4%BE%8B)
    *   [4.1、需求](#4.1%E3%80%81%E9%9C%80%E6%B1%82)
    *   [4.2、git代码位置](#4.2%E3%80%81git%E4%BB%A3%E7%A0%81%E4%BD%8D%E7%BD%AE)
    *   [4.3、UserController](#4.3%E3%80%81UserController)
    *   [4.4、添加HiddenHttpMethodFilter](#4.4%E3%80%81%E6%B7%BB%E5%8A%A0HiddenHttpMethodFilter)
    *   [4.5、测试效果](#4.5%E3%80%81%E6%B5%8B%E8%AF%95%E6%95%88%E6%9E%9C)
*   [最新资料](#%E6%9C%80%E6%96%B0%E8%B5%84%E6%96%99)
    

## 1、RESTful简介

REST：Representational State Transfer，表现层资源状态转移。

**a>资源**

资源是一种看待服务器的方式，即，将服务器看作是由很多离散的资源组成。每个资源是服务器上一个可命名的抽象概念。因为资源是一个抽象的概念，所以它不仅仅能代表服务器文件系统中的一个文件、数据库中的一张表等等具体的东西，可以将资源设计的要多抽象有多抽象，只要想象力允许而且客户端应用开发者能够理解。与面向对象设计类似，资源是以名词为核心来组织的，首先关注的是名词。一个  
资源可以由一个或多个URI来标识。URI既是资源的名称，也是资源在Web上的地址。对某个资源感兴趣的客户端应用，可以通过资源的URI与其进行交互。

**b>资源的表述**

资源的表述是一段对于资源在某个特定时刻的状态的描述。可以在客户端-服务器端之间转移（交换）。资源的表述可以有多种格式，例如HTML/XML/JSON/纯文本/图片/视频/音频等等。资源的表述格式可以通过协商机制来确定。请求-响应方向的表述通常使用不同的格式。

**c>状态转移**

状态转移说的是：在客户端和服务器端之间转移（transfer）代表资源状态的表述。通过转移和操作资源的表述，来间接实现操作资源的目的。

## 2、RESTful的实现

具体说，就是 HTTP 协议里面，四个表示操作方式的动词：GET、POST、PUT、DELETE。

它们分别对应四种基本操作：GET 用来获取资源，POST 用来新建资源，PUT 用来更新资源，DELETE用来删除资源。

REST 风格提倡 URL 地址使用统一的风格设计，从前到后各个单词使用斜杠分开，不使用问号键值对方式携带请求参数，而是将要发送给服务器的数据作为 URL 地址的一部分，以保证整体风格的一致性。

| 操作 | 传统方式 | REST风格 |
| --- | --- | --- |
| 查询操作 | getUserById?id=1 | user/1—>get请求方式 |
| 保存操作 | saveUser | user—>post请求方式 |
| 删除操作 | deleteUser?id=1 | user/1—>delete请求方式 |
| 更新操作 | updateUser | user—>put请求方式 |

## 3、HiddenHttpMethodFilter

由于浏览器只支持发送get和post方式的请求，那么该如何发送put和delete请求呢？

SpringMVC 提供了 **HiddenHttpMethodFilter** 帮助我们将 POST 请求转换为 DELETE 或 PUT 请求。

**HiddenHttpMethodFilter** 处理put和delete请求的条件：

*   当前请求的请求方式必须为post
    
*   前请求必须传输请求参数\_method
    

满足以上条件，HiddenHttpMethodFilter 过滤器就会将当前请求的请求方式转换为请求参数\_method的值，因此请求参数\_method的值才是最终的请求方式。

在web.xml中注册HiddenHttpMethodFilter

```xml
<filter>
    <filter-name>HiddenHttpMethodFilter</filter-name>
    <filter-class>org.springframework.web.filter.HiddenHttpMethodFilter</filterclass>
</filter>
<filter-mapping>
    <filter-name>HiddenHttpMethodFilter</filter-name>
    <url-pattern>/*</url-pattern>
</filter-mapping>
```

> **使用注意：**
> 
> 目前为止，SpringMVC中提供了两个过滤器：CharacterEncodingFilter和HiddenHttpMethodFilter
> 
> 在web.xml中注册时，必须先注册CharacterEncodingFilter，再注册HiddenHttpMethodFilter
> 
> 原因：
> 
> *   在 CharacterEncodingFilter 中通过 request.setCharacterEncoding(encoding) 方法设置字符集的
>     
> *   request.setCharacterEncoding(encoding) 方法要求前面不能有任何获取请求参数的操作而 HiddenHttpMethodFilter 恰恰有一个获取请求方式的操作：
>     
>     ```java
>     String paramValue = request.getParameter(this.methodParam);
>     ```
>     

## 4、RESTful案例

### 4.1、需求

通过restfull实现用户的增删改查，需要提供5个接口。

| 接口 | method | 描述 |
| --- | --- | --- |
| /user/list | GET | 获取用户列表 |
| /user/{userId} | GET | 根据用户id获取用户信息 |
| /user | POST | 新增用户信息 |
| /user | PUT | 保存用户信息 |
| /user/{userId} | DELETE | 删除用户信息 |

### 4.2、git代码位置

```http
https://gitee.com/javacode2018/springmvc-series
```

![b3154f49-1399-4494-b429-6245161e8c44](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081743304.png)

### 4.3、UserController

> UserController中实现了需求中提到的4个接口，大家重点看下每个接口的方法上用到的注解。

```java
@RestController
public class UserController {
    private List<User> userList = new ArrayList<>();

    {
        userList.add(new User(1, "Spring高手系列"));
        userList.add(new User(2, "SpringMVC系列"));
    }

    @GetMapping("/user/list")
    public List<User> list() {
        System.out.println("list()");
        return userList;
    }

    @GetMapping("/user/{userId}")
    public User getUser(@PathVariable("userId") Integer userId) {
        System.out.println("getUser()");
        for (User user : userList) {
            if (user.getUserId().equals(userId)) {
                return user;
            }
        }
        return null;
    }

    @PostMapping(value = "/user", produces = "text/html;charset=UTF-8")
    public String add(User user) {
        System.out.println("add()");
        this.userList.add(user);
        return "新增成功";
    }

    @PutMapping(value = "/user", produces = "text/html;charset=UTF-8")
    public String modify(User user) {
        System.out.println("modify()");
        for (User item : userList) {
            if (item.getUserId().equals(user.getUserId())) {
                item.setName(user.getName());
            }
        }
        return "修改成功";
    }

    @DeleteMapping(value = "/user/{userId}", produces = "text/html;charset=UTF-8")
    public String delete(@PathVariable("userId") Integer userId) {
        System.out.println("delete()");
        Iterator<User> iterator = userList.iterator();
        while (iterator.hasNext()) {
            User user = iterator.next();
            if (user.getUserId().equals(userId)) {
                iterator.remove();
            }
        }
        return "删除成功";
    }


    public static class User {
        private Integer userId;
        private String name;

        public User() {
        }

        public User(Integer userId, String name) {
            this.userId = userId;
            this.name = name;
        }

        public Integer getUserId() {
            return userId;
        }

        public void setUserId(Integer userId) {
            this.userId = userId;
        }

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        @Override
        public String toString() {
            return "User{" +
                    "userId=" + userId +
                    ", name='" + name + '\'' +
                    '}';
        }
    }
}
```

### 4.4、添加HiddenHttpMethodFilter

```java
HiddenHttpMethodFilter hiddenHttpMethodFilter = new HiddenHttpMethodFilter();
```

![d9c035ea-1006-4df8-8485-e3b850fcdfc6](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081743211.png)

### 4.5、测试效果

将项目发布到tomcat，如下图，跑一下UserController.http中的5个用例，点击每个用户中的绿色箭头即可运行，注意下后面3个用例都是POST方式提交的，但是参数中多了一个\_method参数用来指定提交的类型，这个参数会被HiddenHttpMethodFilter解析。

![2f42bcaf-abc7-4c60-8647-474f42dcea9a](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081744922.png)

[下一篇：接口调用利器RestTemplate](http://www.itsoku.com/course/6/158)

[上一篇：ResponseBodyAdvice：对@ResponseBody进行增强](http://www.itsoku.com/course/6/156)

