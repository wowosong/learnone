
# 专辑：Spring教程_Spring声明事务怎么用的？

[上一篇：Spring中编程式事务怎么用的？](http://www.itsoku.com/course/5/125)

[下一篇：详解Spring事务中7种传播行为](http://www.itsoku.com/course/5/127)

spring事务有2种用法：**编程式事务和声明式事务**。

编程式事务上一篇文章中已经介绍了，不熟悉的建议先看一下编程式事务的用法。

这篇主要介绍声明式事务的用法，我们在工作中基本上用的都是声明式事务，所以这篇文章是比较重要的，建议各位打起精神，正式开始。

## 什么是声明式事务？

所谓声明式事务，就是通过配置的方式，比如通过配置文件（xml）或者注解的方式，告诉spring，哪些方法需要spring帮忙管理事务，然后开发者只用关注业务代码，而事务的事情spring自动帮我们控制。

比如注解的方式，只需在方法上面加一个`@Transaction`注解，那么方法执行之前spring会自动开启一个事务，方法执行完毕之后，会自动提交或者回滚事务，而方法内部没有任何事务相关代码，用起来特别的方法。

```java
@Transaction
public void insert(String userName){
    this.jdbcTemplate.update("insert into t_user (name) values (?)", userName);
}
```

## 声明式事务的2种实现方式

1.  **配置文件的方式**，即在spring xml文件中进行统一配置，开发者基本上就不用关注事务的事情了，代码中无需关心任何和事务相关的代码，一切交给spring处理。
2.  **注解的方式**，只需在需要spring来帮忙管理事务的方法上加上@Transaction注解就可以了，注解的方式相对来说更简洁一些，都需要开发者自己去进行配置，可能有些同学对spring不是太熟悉，所以配置这个有一定的风险，做好代码review就可以了。

配置文件的方式这里就不讲了，用的相对比较少，我们主要掌握注解的方式如何使用，就可以了。

## 声明式事务注解方式5个步骤

### 1、启用Spring的注释驱动事务管理功能

在spring配置类上加上`@EnableTransactionManagement`注解

```java
@EnableTransactionManagement
public class MainConfig4 {
}
```

简要介绍一下原理：**当spring容器启动的时候，发现有@EnableTransactionManagement注解，此时会拦截所有bean的创建，扫描看一下bean上是否有@Transaction注解（类、或者父类、或者接口、或者方法中有这个注解都可以），如果有这个注解，spring会通过aop的方式给bean生成代理对象，代理对象中会增加一个拦截器，拦截器会拦截bean中public方法执行，会在方法执行之前启动事务，方法执行完毕之后提交或者回滚事务。稍后会专门有一篇文章带大家看这块的源码。**

如果有兴趣的可以自己先去读一下源码，主要是下面这个这方法会

```java
org.springframework.transaction.interceptor.TransactionInterceptor#invoke
```

再来看看 EnableTransactionManagement 的源码

```java
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Import(TransactionManagementConfigurationSelector.class)
public @interface EnableTransactionManagement {

    /**
     * spring是通过aop的方式对bean创建代理对象来实现事务管理的
     * 创建代理对象有2种方式，jdk动态代理和cglib代理
     * proxyTargetClass：为true的时候，就是强制使用cglib来创建代理
     */
    boolean proxyTargetClass() default false;

    /**
     * 用来指定事务拦截器的顺序
     * 我们知道一个方法上可以添加很多拦截器，拦截器是可以指定顺序的
     * 比如你可以自定义一些拦截器，放在事务拦截器之前或者之后执行，就可以通过order来控制
     */
    int order() default Ordered.LOWEST_PRECEDENCE;
}
```

### 2、定义事务管理器

事务交给spring管理，那么你肯定要创建一个或者多个事务管理者，有这些管理者来管理具体的事务，比如启动事务、提交事务、回滚事务，这些都是管理者来负责的。

spring中使用PlatformTransactionManager这个接口来表示事务管理者。

PlatformTransactionManager多个实现类，用来应对不同的环境

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202312081114709.png)

**JpaTransactionManager**：如果你用jpa来操作db，那么需要用这个管理器来帮你控制事务。

**DataSourceTransactionManager**：如果你用是指定数据源的方式，比如操作数据库用的是：JdbcTemplate、mybatis、ibatis，那么需要用这个管理器来帮你控制事务。

**HibernateTransactionManager**：如果你用hibernate来操作db，那么需要用这个管理器来帮你控制事务。

**JtaTransactionManager**：如果你用的是java中的jta来操作db，这种通常是分布式事务，此时需要用这种管理器来控制事务。

比如：我们用的是mybatis或者jdbctemplate，那么通过下面方式定义一个事务管理器。

```java
@Bean
public PlatformTransactionManager transactionManager(DataSource dataSource) {
    return new DataSourceTransactionManager(dataSource);
}
```

### 3、需使用事务的目标上加@Transaction注解

*   @Transaction放在接口上，那么接口的实现类中所有public都被spring自动加上事务
*   @Transaction放在类上，那么当前类以及其下无限级子类中所有pubilc方法将被spring自动加上事务
*   @Transaction放在public方法上，那么该方法将被spring自动加上事务
*   注意：**@Transaction只对public方法有效**

下面我们看一下@Transactional源码：

```java
@Target({ElementType.TYPE, ElementType.METHOD})
@Retention(RetentionPolicy.RUNTIME)
@Inherited
@Documented
public @interface Transactional {

    /**
     * 指定事务管理器的bean名称，如果容器中有多事务管理器PlatformTransactionManager，
     * 那么你得告诉spring，当前配置需要使用哪个事务管理器
     */
    @AliasFor("transactionManager")
    String value() default "";

    /**
     * 同value，value和transactionManager选配一个就行，也可以为空，如果为空，默认会从容器中按照类型查找一个事务管理器bean
     */
    @AliasFor("value")
    String transactionManager() default "";

    /**
     * 事务的传播属性
     */
    Propagation propagation() default Propagation.REQUIRED;

    /**
     * 事务的隔离级别，就是制定数据库的隔离级别，数据库隔离级别大家知道么？不知道的可以去补一下
     */
    Isolation isolation() default Isolation.DEFAULT;

    /**
     * 事务执行的超时时间（秒），执行一个方法，比如有问题，那我不可能等你一天吧，可能最多我只能等你10秒
     * 10秒后，还没有执行完毕，就弹出一个超时异常吧
     */
    int timeout() default TransactionDefinition.TIMEOUT_DEFAULT;

    /**
     * 是否是只读事务，比如某个方法中只有查询操作，我们可以指定事务是只读的
     * 设置了这个参数，可能数据库会做一些性能优化，提升查询速度
     */
    boolean readOnly() default false;

    /**
     * 定义零(0)个或更多异常类，这些异常类必须是Throwable的子类，当方法抛出这些异常及其子类异常的时候，spring会让事务回滚
     * 如果不配做，那么默认会在 RuntimeException 或者 Error 情况下，事务才会回滚 
     */
    Class<? extends Throwable>[] rollbackFor() default {};

    /**
     * 和 rollbackFor 作用一样，只是这个地方使用的是类名
     */
    String[] rollbackForClassName() default {};

    /**
     * 定义零(0)个或更多异常类，这些异常类必须是Throwable的子类，当方法抛出这些异常的时候，事务不会回滚
     */
    Class<? extends Throwable>[] noRollbackFor() default {};

    /**
     * 和 noRollbackFor 作用一样，只是这个地方使用的是类名
     */
    String[] noRollbackForClassName() default {};

}
```

参数介绍

| 参数 | 描述 |
| --- | --- |
| value | 指定事务管理器的bean名称，如果容器中有多事务管理器PlatformTransactionManager，那么你得告诉spring，当前配置需要使用哪个事务管理器 |
| transactionManager | 同value，value和transactionManager选配一个就行，也可以为空，如果为空，默认会从容器中按照类型查找一个事务管理器bean |
| propagation | 事务的传播属性，下篇文章详细介绍 |
| isolation | 事务的隔离级别，就是制定数据库的隔离级别，数据库隔离级别大家知道么？不知道的可以去补一下 |
| timeout | 事务执行的超时时间（秒），执行一个方法，比如有问题，那我不可能等你一天吧，可能最多我只能等你10秒 10秒后，还没有执行完毕，就弹出一个超时异常吧 |
| readOnly | 是否是只读事务，比如某个方法中只有查询操作，我们可以指定事务是只读的 设置了这个参数，可能数据库会做一些性能优化，提升查询速度 |
| rollbackFor | 定义零(0)个或更多异常类，这些异常类必须是Throwable的子类，当方法抛出这些异常及其子类异常的时候，spring会让事务回滚 如果不配做，那么默认会在 RuntimeException 或者 Error 情况下，事务才会回滚 |
| rollbackForClassName | 同 rollbackFor，只是这个地方使用的是类名 |
| noRollbackFor | 定义零(0)个或更多异常类，这些异常类必须是Throwable的子类，当方法抛出这些异常的时候，事务不会回滚 |
| noRollbackForClassName | 同 noRollbackFor，只是这个地方使用的是类名 |

### 4、执行db业务操作

在@Transaction标注类或者目标方法上执行业务操作，此时这些方法会自动被spring进行事务管理。

如，下面的insertBatch操作，先删除数据，然后批量插入数据，方法上加上了@Transactional注解，此时这个方法会自动受spring事务控制，要么都成功，要么都失败。

```java
@Component
public class UserService {
    @Autowired
    private JdbcTemplate jdbcTemplate;

    //先清空表中数据，然后批量插入数据，要么都成功要么都失败
    @Transactional
    public void insertBatch(String... names) {
        jdbcTemplate.update("truncate table t_user");
        for (String name : names) {
            jdbcTemplate.update("INSERT INTO t_user(name) VALUES (?)", name);
        }
    }
}
```

### 5、启动spring容器，使用bean执行业务操作

```java
@Test
public void test1() {
    AnnotationConfigApplicationContext context = new AnnotationConfigApplicationContext();
    context.register(MainConfig4.class);
    context.refresh();

    UserService userService = context.getBean(UserService.class);
    userService.insertBatch("java高并发系列", "mysql系列", "maven系列", "mybatis系列");
}
```

## 案例1

### 准备数据库

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

### spring配置类

```java
package com.javacode2018.tx.demo4;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.datasource.DataSourceTransactionManager;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.annotation.EnableTransactionManagement;
import org.springframework.transaction.support.TransactionTemplate;

import javax.sql.DataSource;

@EnableTransactionManagement //@1
@Configuration
@ComponentScan
public class MainConfig4 {
    //定义一个数据源
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

    //定义一个JdbcTemplate,用来执行db操作
    @Bean
    public JdbcTemplate jdbcTemplate(DataSource dataSource) {
        return new JdbcTemplate(dataSource);
    }

    //定义我一个事物管理器
    @Bean
    public PlatformTransactionManager transactionManager(DataSource dataSource) { //@2
        return new DataSourceTransactionManager(dataSource);
    }
}
```

**@1**：使用@EnableTransactionManagement注解开启spring事务管理

**@2**：定义事务管理器

### 来个业务类

```java
package com.javacode2018.tx.demo4;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

@Component
public class UserService {
    @Autowired
    private JdbcTemplate jdbcTemplate;

    //先清空表中数据，然后批量插入数据，要么都成功要么都失败
    @Transactional //@1
    public int insertBatch(String... names) {
        int result = 0;
        jdbcTemplate.update("truncate table t_user");
        for (String name : names) {
            result += jdbcTemplate.update("INSERT INTO t_user(name) VALUES (?)", name);
        }
        return result;
    }

    //获取所有用户信息
    public List<Map<String, Object>> userList() {
        return jdbcTemplate.queryForList("SELECT * FROM t_user");
    }
}
```

**@1**：insertBatch方法上加上了@Transactional注解，让spring来自动为这个方法加上事务

### 测试类

```java
package com.javacode2018.tx.demo4;

import org.junit.Test;
import org.springframework.context.annotation.AnnotationConfigApplicationContext;

public class Demo4Test {
    @Test
    public void test1() {
        AnnotationConfigApplicationContext context = new AnnotationConfigApplicationContext();
        context.register(MainConfig4.class);
        context.refresh();

        UserService userService = context.getBean(UserService.class);
        //先执行插入操作
        int count = userService.insertBatch(
                "java高并发系列",
                "mysql系列",
                "maven系列",
                "mybatis系列");
        System.out.println("插入成功（条）：" + count);
        //然后查询一下
        System.out.println(userService.userList());
    }
}
```

### 运行输出

```plain
插入成功（条）：4
[{id=1, name=java高并发系列}, {id=2, name=mysql系列}, {id=3, name=maven系列}, {id=4, name=mybatis系列}]
```

**有些朋友可能会问，如何知道这个被调用的方法有没有使用事务？** 下面我们就来看一下。

## 如何确定方法有没有用到spring事务

### 方式1：断点调试

spring事务是由TransactionInterceptor拦截器处理的，最后会调用下面这个方法，设置个断点就可以看到详细过程了。

```plain
org.springframework.transaction.interceptor.TransactionAspectSupport#invokeWithinTransaction
```

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202312081114645.png)

### 方式2：看日志

spring处理事务的过程，有详细的日志输出，开启日志，控制台就可以看到事务的详细过程了。

#### 添加maven配置

```xml
<dependency>
    <groupId>ch.qos.logback</groupId>
    <artifactId>logback-classic</artifactId>
    <version>1.2.3</version>
</dependency>
```

#### src\\main\\resources新建logback.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<configuration>
    <appender name="STDOUT" class="ch.qos.logback.core.ConsoleAppender">
        <encoder>
            <pattern>[%d{MM-dd HH:mm:ss.SSS}][%thread{20}:${PID:- }][%X{trace_id}][%level][%logger{56}:%line:%method\(\)]:%msg%n##########**********##########%n</pattern>
        </encoder>
    </appender>

    <logger name="org.springframework" level="debug">
        <appender-ref ref="STDOUT" />
    </logger>

</configuration>
```

再来运行一下案例1

```java
[09-10 11:20:38.830][main: ][][DEBUG][o.s.jdbc.datasource.DataSourceTransactionManager:370:getTransaction()]:Creating new transaction with name [com.javacode2018.tx.demo4.UserService.insertBatch]: PROPAGATION_REQUIRED,ISOLATION_DEFAULT
##########**********##########
[09-10 11:20:39.120][main: ][][DEBUG][o.s.jdbc.datasource.DataSourceTransactionManager:265:doBegin()]:Acquired Connection [ProxyConnection[PooledConnection[com.mysql.jdbc.JDBC4Connection@65fe9e33]]] for JDBC transaction
##########**********##########
[09-10 11:20:39.125][main: ][][DEBUG][o.s.jdbc.datasource.DataSourceTransactionManager:283:doBegin()]:Switching JDBC Connection [ProxyConnection[PooledConnection[com.mysql.jdbc.JDBC4Connection@65fe9e33]]] to manual commit
##########**********##########
[09-10 11:20:39.139][main: ][][DEBUG][org.springframework.jdbc.core.JdbcTemplate:502:update()]:Executing SQL update [truncate table t_user]
##########**********##########
[09-10 11:20:39.169][main: ][][DEBUG][org.springframework.jdbc.core.JdbcTemplate:860:update()]:Executing prepared SQL update
##########**********##########
[09-10 11:20:39.169][main: ][][DEBUG][org.springframework.jdbc.core.JdbcTemplate:609:execute()]:Executing prepared SQL statement [INSERT INTO t_user(name) VALUES (?)]
##########**********##########
[09-10 11:20:39.234][main: ][][DEBUG][org.springframework.jdbc.core.JdbcTemplate:860:update()]:Executing prepared SQL update
##########**********##########
[09-10 11:20:39.235][main: ][][DEBUG][org.springframework.jdbc.core.JdbcTemplate:609:execute()]:Executing prepared SQL statement [INSERT INTO t_user(name) VALUES (?)]
##########**********##########
[09-10 11:20:39.236][main: ][][DEBUG][org.springframework.jdbc.core.JdbcTemplate:860:update()]:Executing prepared SQL update
##########**********##########
[09-10 11:20:39.237][main: ][][DEBUG][org.springframework.jdbc.core.JdbcTemplate:609:execute()]:Executing prepared SQL statement [INSERT INTO t_user(name) VALUES (?)]
##########**********##########
[09-10 11:20:39.238][main: ][][DEBUG][org.springframework.jdbc.core.JdbcTemplate:860:update()]:Executing prepared SQL update
##########**********##########
[09-10 11:20:39.239][main: ][][DEBUG][org.springframework.jdbc.core.JdbcTemplate:609:execute()]:Executing prepared SQL statement [INSERT INTO t_user(name) VALUES (?)]
##########**********##########
[09-10 11:20:39.241][main: ][][DEBUG][o.s.jdbc.datasource.DataSourceTransactionManager:741:processCommit()]:Initiating transaction commit
##########**********##########
[09-10 11:20:39.241][main: ][][DEBUG][o.s.jdbc.datasource.DataSourceTransactionManager:328:doCommit()]:Committing JDBC transaction on Connection [ProxyConnection[PooledConnection[com.mysql.jdbc.JDBC4Connection@65fe9e33]]]
##########**********##########
[09-10 11:20:39.244][main: ][][DEBUG][o.s.jdbc.datasource.DataSourceTransactionManager:387:doCleanupAfterCompletion()]:Releasing JDBC Connection [ProxyConnection[PooledConnection[com.mysql.jdbc.JDBC4Connection@65fe9e33]]] after transaction
##########**********##########
插入成功（条）：4
[09-10 11:20:39.246][main: ][][DEBUG][org.springframework.jdbc.core.JdbcTemplate:427:query()]:Executing SQL query [SELECT * FROM t_user]
##########**********##########
[09-10 11:20:39.247][main: ][][DEBUG][org.springframework.jdbc.datasource.DataSourceUtils:115:doGetConnection()]:Fetching JDBC Connection from DataSource
##########**********##########
[{id=1, name=java高并发系列}, {id=2, name=mysql系列}, {id=3, name=maven系列}, {id=4, name=mybatis系列}]
```

#### 来理解一下日志

insertBatch方法上有@Transaction注解，所以会被拦截器拦截，下面是在insertBatch方法调用之前，创建了一个事务。

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202312081114840.png)

insertBatch方法上@Transaction注解参数都是默认值，@Transaction注解中可以通过`value或者transactionManager`来指定事务管理器，但是没有指定，此时spring会在容器中按照事务管理器类型找一个默认的，刚好我们在spring容器中定义了一个，所以直接拿来用了。事务管理器我们用的是`new DataSourceTransactionManager(dataSource)`，从事务管理器的datasource中获取一个数据库连接，然后通过连接设置事务为手动提交，然后将（datasource->这个连接)丢到ThreadLocal中了，具体为什么，可以看[上一篇](https://mp.weixin.qq.com/s/T_Yb7ROQkkZUMftkyc5aeQ)文章。

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202312081115122.png)

下面就正是进入insertBatch方法内部了，通过jdbctemplate执行一些db操作，jdbctemplate内部会通过datasource到上面的threadlocal中拿到spring事务那个连接，然后执行db操作。

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202312081115570.png)

最后insertBatch方法执行完毕之后，没有任何异常，那么spring就开始通过数据库连接提交事务了。

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202312081115091.png)

## 总结

本文讲解了一下spring中编程式事务的使用步骤。

主要涉及到了2个注解：

@EnableTransactionManagement：开启spring事务管理功能

@Transaction：将其加在需要spring管理事务的类、方法、接口上，只会对public方法有效。

大家再消化一下，有问题，欢迎留言交流。

**下篇文章将详细介绍事务的传播属性，敬请期待。**

## 案例源码

```java
git地址：
https://gitee.com/javacode2018/spring-series

本文案例对应源码：spring-series\lesson-002-tx\src\main\java\com\javacode2018\tx\demo4
```

[下一篇：详解Spring事务中7种传播行为](http://www.itsoku.com/course/5/127)

[上一篇：Spring中编程式事务怎么用的？](http://www.itsoku.com/course/5/125)