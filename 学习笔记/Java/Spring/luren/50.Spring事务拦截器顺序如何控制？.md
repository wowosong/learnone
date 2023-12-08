
# Spring事务拦截器顺序如何控制？
[上一篇：实战篇：手把手带你实现事务消息！](http://www.itsoku.com/course/5/131)

[下一篇：Spring事务失效常见的几种情况](http://www.itsoku.com/course/5/133)

## 1、前言

咱们知道 Spring 事务是通过aop的方式添加了一个事务拦截器，事务拦截器会拦截目标方法的执行，在方法执行前后添加了事务控制。

那么spring事务拦截器的顺序如何控制呢，若我们自己也添加了一些拦截器，此时事务拦截器和自定义拦截器共存的时候，他们的顺序是怎么执行的？如何手动来控制他们的顺序？？

可能有些朋友会问，控制他们的顺序，这个功能有什么用呢？为什么要学这个

学会了这些，你可以实现很多牛逼的功能，比如

1、读写分离

2、通用幂等框架

3、分布式事务框架

对这些有兴趣么？那么咱们继续。

## 2、事务拦截器顺序设置

@EnableTransactionManagement 注解有个 order属性，默认值是Integer.MAX\_VALUE，用来指定事务拦截器的顺序，值越小，拦截器的优先级越高，如：

```java
@EnableTransactionManagement(order = 2)
```

下面来看案例。

## 3、案例

我们自定义2个拦截器：一个放在事务拦截器之前执行，一个放在事务拦截器之后执行

| 拦截器 | 顺序 |
| --- | --- |
| TransactionInterceptorBefore | 1 |
| @EnableTransactionManagement 事务拦截器 | 2 |
| TransactionInterceptorAfter | 3 |

### 3.1、准备sql

```java
DROP DATABASE IF EXISTS javacode2018;
CREATE DATABASE if NOT EXISTS javacode2018;

USE javacode2018;
DROP TABLE IF EXISTS t_user;
CREATE TABLE t_user(
  id int PRIMARY KEY AUTO_INCREMENT,
  name varchar(256) NOT NULL DEFAULT '' COMMENT '姓名'
);
```

### 3.2、Spring配置类MainConfig10

@1：开启了事务管理功能，并且设置了事务拦截器的顺序是2，spring事务拦截器完整类名是

```java
org.springframework.transaction.interceptor.TransactionInterceptor
```

@2：开启aop功能

```java
package com.javacode2018.tx.demo10;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.EnableAspectJAutoProxy;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.datasource.DataSourceTransactionManager;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.annotation.EnableTransactionManagement;

import javax.sql.DataSource;

@Configuration //说明当前类是一个配置类
@ComponentScan //开启bean自动扫描注册功能
@EnableTransactionManagement(order = 2) //@1：设置事务拦截器的顺序是2
@EnableAspectJAutoProxy // @2：开启@Aspect Aop功能
public class MainConfig10 {
    @Bean
    public DataSource dataSource() {
        org.apache.tomcat.jdbc.pool.DataSource dataSource = new org.apache.tomcat.jdbc.pool.DataSource();
        dataSource.setDriverClassName("com.mysql.jdbc.Driver");
        dataSource.setUrl("jdbc:mysql://localhost:3306/javacode2018?characterEncoding=UTF-8");
        dataSource.setUsername("root");
        dataSource.setPassword("root123");
        dataSource.setInitialSize(5);
        return dataSource;
    }

    //定义一个jdbcTemplate
    @Bean
    public JdbcTemplate jdbcTemplate(DataSource dataSource) {
        return new JdbcTemplate(dataSource);
    }

    //定义事务管理器transactionManager
    @Bean
    public PlatformTransactionManager transactionManager(DataSource dataSource) {
        return new DataSourceTransactionManager(dataSource);
    }
}
```

### 3.3、定义一个有事务的Service类

addUser方法上面添加了@Transactional注解，表示使用spring来管理事务，方法内部向db中插入了一条数据，为了方便分析结果，方法内部输出了2行日志

```java
package com.javacode2018.tx.demo10;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
public class UserService {
    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Transactional
    public void addUser() {
        System.out.println("--------UserService.addUser start");
        this.jdbcTemplate.update("insert into t_user(name) VALUES (?)", "张三");
        System.out.println("--------UserService.addUser end");
    }
}
```

### 3.4、自定义第1个拦截器，放在事务拦截器之前执行

下面通过Aspect的方式定义了一个拦截器，顺序通过@Order(1)设置的是1，那么这个拦截器会在事务拦截器之前执行。

```java
package com.javacode2018.tx.demo10;

import org.aopalliance.intercept.Joinpoint;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

@Component
@Aspect
@Order(1) //@1
public class TransactionInterceptorBefore {

    @Pointcut("execution(* com.javacode2018.tx.demo10.UserService.*(..))")
    public void pointcut() {
    }

    @Around("pointcut()")
    public Object tsBefore(ProceedingJoinPoint joinPoint) throws Throwable {
        System.out.println("--------before start!!!");
        Object result = joinPoint.proceed();
        System.out.println("--------before end!!!");
        return result;
    }
}
```

### 3.4、自定义第2个拦截器，放在事务拦截器后面执行

这个拦截器的order是3，会在事务拦截器后面执行。

```java
package com.javacode2018.tx.demo10;

import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

@Component
@Aspect
@Order(2)
public class TransactionInterceptorAfter {

    @Pointcut("execution(* com.javacode2018.tx.demo10.UserService.*(..))")
    public void pointcut() {
    }

    @Around("pointcut()")
    public Object tsAfter(ProceedingJoinPoint joinPoint) throws Throwable {
        System.out.println("--------after start!!!");
        Object result = joinPoint.proceed();
        System.out.println("--------after end!!!");
        return result;
    }
}
```

### 3.5、添加测试类

```java
package com.javacode2018.tx.demo10;

import org.junit.Before;
import org.junit.Test;
import org.springframework.context.annotation.AnnotationConfigApplicationContext;
import org.springframework.jdbc.core.JdbcTemplate;

public class Demo10Test {

    private UserService userService;

    private JdbcTemplate jdbcTemplate;

    @Before
    public void before() {
        AnnotationConfigApplicationContext context = new AnnotationConfigApplicationContext(MainConfig10.class);
        userService = context.getBean(UserService.class);
        this.jdbcTemplate = context.getBean("jdbcTemplate", JdbcTemplate.class);
        jdbcTemplate.update("truncate table t_user");
    }

    @Test
    public void test1() {
        this.userService.addUser();
    }
}
```

### 3.6、分析test1方法代码执行顺序

咱们先不执行，下分析一下test1方法执行顺序，test1方法内部会调用userService的addUser方法，这个方法会被3个拦截器拦截。

自定义的2个拦截器和事务拦截器TransactionInterceptor拦截，执行顺序如下：

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202312081120535.jpg)

下面来运行一下，看看结果和我们分析的是否一致。

### 3.7、运行test1输出

```java
--------before start!!!
--------after start!!!
--------UserService.addUser start
--------UserService.addUser end
--------after end!!!
--------before end!!!
```

结果和上图中一致，大家可以在3个拦截器中设置一下断点，调试一下可以看到更详细的信息，可加深理解。

## 4、总结

今天的内容算是比较简单的，重点要掌握如何设置事务拦截器的顺序，@EnableTransactionManagement 有个 order属性，默认值是Integer.MAX\_VALUE，用来指定事务拦截器的顺序，值越小，拦截器的优先级越高。

后面我们会通过这个功能实现读写分离，通用幂等性的功能。

## 5、案例源码

```java
git地址：
https://gitee.com/javacode2018/spring-series

本文案例对应源码：
    spring-series\lesson-002-tx\src\main\java\com\javacode2018\tx\demo10
```

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202312081120572.png)


[下一篇：Spring事务失效常见的几种情况](http://www.itsoku.com/course/5/133)

[上一篇：实战篇：手把手带你实现事务消息！](http://www.itsoku.com/course/5/131)