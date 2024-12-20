
# Spring集成MyBatis

[上一篇：Spring实现数据库读写分离](http://www.itsoku.com/course/5/134)

[下一篇：集成junit](http://www.itsoku.com/course/5/136)

## 1、本文内容

本文主要介绍mybatis和spring集成的两种方式，对MyBatis不熟悉的，建议先看一下：[MyBatis系列](http://www.itsoku.com/course/4)

目前注解的方式我们用的比较多，所以主要介绍注解的方式，xml的方式这里就暂时不介绍了。

注解的方式mybatis集成spring主要有2种方式：

1、方式1：mapper xml文件放在resource目录，和Mapper接口不在一个目录的情况

2、方式2：mapper xml文件和Mapper接口在同一个目录

还会介绍另外一个点：**多数据库的时候，如何配置？**

## 2、案例代码

```java
git地址：
https://gitee.com/javacode2018/spring-series

方式1源码：spring-series\lesson-005-mybatis
方式2源码：spring-series\lesson-006-mybatis
```

## 3、准备db脚本

```java
/*创建数据库javacode2018*/
DROP DATABASE IF EXISTS `javacode2018`;
CREATE DATABASE `javacode2018`;
USE `javacode2018`;

/*创建表结构*/
DROP TABLE IF EXISTS `t_user`;
CREATE TABLE t_user (
  id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '主键，用户id，自动增长',
  `name` VARCHAR(32) NOT NULL DEFAULT '' COMMENT '姓名'
) COMMENT '用户表';

SELECT * FROM t_user;
```

下面我们来通过mybatis对上面的表执行插入和查询的操作。

## 4、方式1

### 4.1、项目结构

这种方式，Mapper接口和mapper xml文件放在不同的位置，mapper xml文件放在resource/mapper目录，如下图

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202312081121731.png)

### 4.2、UserModel

```java
package com.javacode2018.mybatis.model;

import lombok.*;

/**
 * 公众号：  喔喔松Java，工作10年的前阿里P7分享Java、算法、数据库方面的技术干货！
 * <a href="http://www.itsoku.com">个人博客</a>
 */
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class UserModel {
    private Long id;
    private String name;
}
```

### 4.3、UserMapper

这个是mapper接口，类上面需要添加**@Mapper注解**，用来标注这是一个Mapper接口

```java
package com.javacode2018.mapper;

import com.javacode2018.mybatis.model.UserModel;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

/**
 * 公众号：  喔喔松Java，工作10年的前阿里P7分享Java、算法、数据库方面的技术干货！
 * <a href="http://www.itsoku.com">个人博客</a>
 */
@Mapper
public interface UserMapper {
    void insert(UserModel userModel);
    List<UserModel> getList();
}
```

### 4.4、UserMapper.xml

在spring-series\\lesson-005-mybatis\\src\\main\\resources\\mapper中添加UserMapper.xml文件，这个文件名大家可以随意起名，不一定非要叫UserMapper，具体位置大家可以看看上面的项目结构图

```java
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="com.javacode2018.mapper.UserMapper">

    <insert id="insert" parameterType="com.javacode2018.mybatis.model.UserModel" keyProperty="id" useGeneratedKeys="true">
        <![CDATA[ INSERT INTO `t_user` (name) VALUES (#{name})]]>
    </insert>

    <select id="getList" resultType="com.javacode2018.mybatis.model.UserModel">
        <![CDATA[
        SELECT id,name FROM t_user
        ]]>
    </select>

</mapper>
```

### 4.5、IUserService

```java
package com.javacode2018.service;

import com.javacode2018.mybatis.model.UserModel;

import java.util.List;

/**
 * 公众号：  喔喔松Java，工作10年的前阿里P7分享Java、算法、数据库方面的技术干货！
 * <a href="http://www.itsoku.com">个人博客</a>
 */
public interface IUserService {
    /**
     * 插入用户信息
     *
     * @param userModel
     * @return
     */
    UserModel insert(UserModel userModel);

    /**
     * 查询用户所有记录
     *
     * @return
     */
    List<UserModel> getList();
}
```

### 4.6、UserServiceImpl

IUserService的实现类，内部将Usermapper通过@Autowired注入进来，通过userMapper来访数据库，userMapper实际上是mybatis创建的一个代理对象。

```java
package com.javacode2018.service;

import com.javacode2018.mapper.UserMapper;
import com.javacode2018.mybatis.model.UserModel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * 公众号：  喔喔松Java，工作10年的前阿里P7分享Java、算法、数据库方面的技术干货！
 * <a href="http://www.itsoku.com">个人博客</a>
 */
@Service
public class UserServiceImpl implements IUserService {
    @Autowired
    private UserMapper userMapper;

    @Transactional(rollbackFor = Exception.class)
    @Override
    public UserModel insert(UserModel userModel) {
        userMapper.insert(userModel);
        return userModel;
    }

    @Transactional(propagation = Propagation.SUPPORTS, readOnly = true)
    @Override
    public List<UserModel> getList() {
        return userMapper.getList();
    }
}
```

### 4.7、spring配置类MainConfig

```java
package com.javacode2018;

import com.javacode2018.mapper.UserMapper;
import org.apache.ibatis.annotations.Mapper;
import org.mybatis.spring.SqlSessionFactoryBean;
import org.mybatis.spring.annotation.MapperScan;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.Resource;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;
import org.springframework.jdbc.datasource.DataSourceTransactionManager;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.TransactionManager;
import org.springframework.transaction.annotation.EnableTransactionManagement;

import javax.sql.DataSource;
import java.io.IOException;

/**
 *
 */
@EnableTransactionManagement //开启事务支持
@ComponentScan
@Configuration
// @MapperScan这个注解是关键，会扫描标记有@Mapper注解的Mapper接口，将其注册到spring容器中
@MapperScan(basePackageClasses = {UserMapper.class}, annotationClass = Mapper.class)
public class MainConfig {
    //定义数据源
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

    //定义事务管理器
    @Bean
    public TransactionManager transactionManager(DataSource dataSource) {
        return new DataSourceTransactionManager(dataSource);
    }

    //定义SqlSessionFactoryBean，用来创建SqlSessionFactory
    @Bean
    public SqlSessionFactoryBean sqlSessionFactoryBean(DataSource dataSource) throws IOException {
        SqlSessionFactoryBean sqlSessionFactoryBean = new SqlSessionFactoryBean();
        sqlSessionFactoryBean.setDataSource(dataSource);
        //获取所有mapper.xml文件
        Resource[] resources = new PathMatchingResourcePatternResolver().getResources("classpath*:mapper/**/*.xml");
        sqlSessionFactoryBean.setMapperLocations(resources);
        return sqlSessionFactoryBean;
    }
}
```

这个类中有2个关键信息：

1、**@MapperScan注解**：这个注解是关键，会扫描标记有@Mapper注解的Mapper接口类，然后给Mapper接口生成代理对象，将其注册到spring容器中，这个注解有几个属性需要注意下

*   value或者basePackages：String类型的数组，用来指定扫描的包
*   basePackageClasses：可以指定一个类，扫描范围为这个类所在的包及其所有子包
*   sqlSessionFactoryRef：用来指定sqlSessionFactory的bean名称，当我们的系统中需要操作多个库的时候，每个库对应一个SqlSessionFactory，此时可以通过这个属性指定需要使用哪个SqlSessionFactory。

2、**定义SqlSessionFactoryBean**：通过名字大家可以看出，这个是用来生成SqlSessionFactory的，内部需要指定数据源和本地mapper xml的位置，我们将mapper xml文件放在resouce/mapper文件中，此处我们采用通配符的方式，加载classpath中mapper目录及子目录中的所有xml文件

```java
Resource[] resources = new PathMatchingResourcePatternResolver().getResources("classpath*:mapper/**/*.xml");
sqlSessionFactoryBean.setMapperLocations(resources);
```

### 4.8、测试效果

来个测试类

```java
package com.javacode2018;

import com.javacode2018.mybatis.model.UserModel;
import com.javacode2018.service.IUserService;
import org.junit.Test;
import org.springframework.context.annotation.AnnotationConfigApplicationContext;

import java.util.List;

/**
 * 
 */
public class MybatisSpringTest {
    @Test
    public void insert() {
        AnnotationConfigApplicationContext context = new AnnotationConfigApplicationContext(MainConfig.class);
        IUserService userService = context.getBean(IUserService.class);
        UserModel userModel = UserModel.builder().name("张三").build();
        userService.insert(userModel);
        System.out.println(userModel);
    }

    @Test
    public void getList() {
        AnnotationConfigApplicationContext context = new AnnotationConfigApplicationContext(MainConfig.class);
        IUserService userService = context.getBean(IUserService.class);
        List<UserModel> userModelList = userService.getList();
        System.out.println(userModelList);
    }
}
```

insert方法用来插入数据，执行输出

```java
UserModel(id=1, name=张三)
```

getList方法用来查询表中所有数据，运行输出

```java
[UserModel(id=1, name=张三)]
```

### 4.8、小结：回顾步骤

主要分为3步

1、Mapper接口上添加@Mapper注解

```java
@Mapper
public interface UserMapper
```

2、定义mapper xml文件，如将user.xml文件放在了spring-series\\lesson-005-mybatis\\src\\main\\resources\\mapper目录

3、spring配置类中添加@MapperScan注解，用来扫描@Mapper标注的类，将其注册到spring容器中

```java
@MapperScan(basePackageClasses = {UserMapper.class}, annotationClass = Mapper.class)
```

4、定义SqlSessionFactoryBean

```java
@Bean
public SqlSessionFactoryBean sqlSessionFactoryBean(DataSource dataSource) throws IOException {
    SqlSessionFactoryBean sqlSessionFactoryBean = new SqlSessionFactoryBean();
    //指定数据源
    sqlSessionFactoryBean.setDataSource(dataSource);
    //获取所有mapper.xml文件
    Resource[] resources = new PathMatchingResourcePatternResolver().getResources("classpath*:mapper/**/*.xml");
    //设置mapper的位置
    sqlSessionFactoryBean.setMapperLocations(resources);
    return sqlSessionFactoryBean;
}
```

## 5、方式2

### 5.1、项目结构

这种方式，将mapper xml文件和mapper接口放在同一个目录，下面我们新建一个项目lesson-006-mybatis，结构如下

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202312081121385.png)

对比两个图，主要的区别：方式1中将UserMapper.xml文件放在了src\\main\\resources\\mapper目录中，而这种将UserMapper.xml和UserMapper接口放在了同一个目录。

### 5.2、修改SqlSessionFactoryBean的定义

需要修改MainConfig中SqlSessionFactoryBean的定义，如下，更简洁了，不需要在指定mapper xml的位置了，这里需要注意一点，方式2中将mapper xml文件和mapper接口放在一个目录的时候，**这2个文件的名字必须一样**，这样在定义SqlSessionFactoryBean的时候才不需要指定mapper xml的位置。

```java
@Bean
public SqlSessionFactoryBean sqlSessionFactoryBean(DataSource dataSource) throws IOException {
    SqlSessionFactoryBean sqlSessionFactoryBean = new SqlSessionFactoryBean();
    sqlSessionFactoryBean.setDataSource(dataSource);
    return sqlSessionFactoryBean;
}
```

### 5.3、调整一下pom.xml配置

pom文件中需要加入下面配置，这样maven在打包的时候，才会将src/main/java目录中的xml打包目录目录中，否则打包之后这些xml都丢失了，这个一定要注意。

```xml
<build>
    <resources>
        <resource>
            <directory>${project.basedir}/src/main/java</directory>
            <includes>
                <include>**/*.xml</include>
            </includes>
        </resource>
        <resource>
            <directory>${project.basedir}/src/main/resources</directory>
            <includes>
                <include>**/*</include>
            </includes>
        </resource>
    </resources>
</build>
```

### 5.4、小结

如果使用方式2需要注意下面2点：

1、mapper接口和mapper xml必须同名，且放在同一个目录

2、需要在pom.xml文件中加入指定的配置，否则打包之后xml丢失了

## 6、集成多个数据源

有时候我们的系统中需要用到多个数据源，每个数据源对应一个SqlSessionFactory，@MapperScan注解中可以通过sqlSessionTemplateRef来指定SqlSessionFactory的bean名称。

### 6.1、多数据源开发步骤

#### 1、步骤1：@MapperScan中指定SqlSessionFactory的bean名称

每个db对应一个模块，通过包区分不同的模块，每个模块中指定一个spring的配置类，配置类需配置3个bean：数据源、事务管理器、SqlSessionFactory，下面是一个模块的spring配置类，注意下面代码的@MapperScan注解，当系统中有多个sqlSessionFactory的时候需要用过sqlSessionFactoryRef属性指定了sqlSessionFactory的bean名称。

由于有多个数据源，所以代码中需要通过@Qualifier(DATASOURCE\_BEAN\_NAME)来限定注入的datasource的bean名称。

```java
package com.javacode2018.mybatis.module1;

import org.apache.ibatis.annotations.Mapper;
import org.mybatis.spring.SqlSessionFactoryBean;
import org.mybatis.spring.annotation.MapperScan;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.datasource.DataSourceTransactionManager;
import org.springframework.transaction.TransactionManager;
import org.springframework.transaction.annotation.EnableTransactionManagement;

import javax.sql.DataSource;
import java.io.IOException;

@Configuration
@MapperScan(annotationClass = Mapper.class, sqlSessionFactoryRef = Module1SpringConfig.SQL_SESSION_FACTORY_BEAN_NAME)
@ComponentScan
@EnableTransactionManagement
public class Module1SpringConfig {
    public final static String DATASOURCE_BEAN_NAME = "dataSourcemodule1";
    public final static String TRANSACTION_MANAGER_BEAN_NAME = "transactionManagermodule1";
    public final static String SQL_SESSION_FACTORY_BEAN_NAME = "sqlSessionFactorymodule1";

    //定义数据源
    @Bean
    public DataSource dataSourcemodule1() {
        org.apache.tomcat.jdbc.pool.DataSource dataSource = new org.apache.tomcat.jdbc.pool.DataSource();
        dataSource.setDriverClassName("com.mysql.jdbc.Driver");
        dataSource.setUrl("jdbc:mysql://localhost:3306/module1?characterEncoding=UTF-8");
        dataSource.setUsername("root");
        dataSource.setPassword("root123");
        dataSource.setInitialSize(5);
        return dataSource;
    }

    //定义事务管理器
    @Bean
    public TransactionManager transactionManagermodule1(@Qualifier(DATASOURCE_BEAN_NAME) DataSource dataSource) {
        return new DataSourceTransactionManager(dataSource);
    }

    //定义SqlSessionFactoryBean，用来创建SqlSessionFactory
    @Bean
    public SqlSessionFactoryBean sqlSessionFactorymodule1(@Qualifier(DATASOURCE_BEAN_NAME) DataSource dataSource) throws IOException {
        SqlSessionFactoryBean sqlSessionFactoryBean = new SqlSessionFactoryBean();
        sqlSessionFactoryBean.setDataSource(dataSource);
        return sqlSessionFactoryBean;
    }
}
```

#### 2、步骤2：指定事务管理器

每个db对应一个datasource，每个datasource需要指定一个事务管理器，通过@Transaction注解的transactionManager属性指定事务管理器，如下

```java
@Transactional(transactionManager = Module1SpringConfig.TRANSACTION_MANAGER_BEAN_NAME, rollbackFor = Exception.class)
```

### 6.2、案例

下面我们通过案例来感受一下多个db的时候如何实现的。

#### 1、案例代码

```java
spring-series\lesson-007-mybatis
```

#### 2、项目结构图

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202312081121829.png)

*   案例中我们准备了2个数据库：module1和module2，每个库中创建了一个t\_user表
*   module1库对应的所有类放在com.javacode2018.mybatis.module1包中
*   module2库对应的所有类放在com.javacode2018.mybatis.module2包中
*   Module1SpringConfig是module1的spring配置类
*   Module2SpringConfig是module2的spring配置类

#### 3、项目如何运行？

**1、导入项目到idea中**

**2、执行sql脚本**

```java
/*创建2个库：module1和module2，每个库中创建一个t_user表*/
DROP DATABASE IF EXISTS `module1`;
CREATE DATABASE `module1`;

DROP DATABASE IF EXISTS `module2`;
CREATE DATABASE `module2`;

/*创建表结构*/
DROP TABLE IF EXISTS module1.t_user;
CREATE TABLE module1.t_user (
  id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '主键，用户id，自动增长',
  `name` VARCHAR(32) NOT NULL DEFAULT '' COMMENT '姓名'
) COMMENT '用户表';

DROP TABLE IF EXISTS module2.t_user;
CREATE TABLE module2.t_user (
  id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '主键，用户id，自动增长',
  `name` VARCHAR(32) NOT NULL DEFAULT '' COMMENT '姓名'
) COMMENT '用户表';

SELECT * FROM module1.t_user;
SELECT * FROM module2.t_user;
```

**3、运行测试用例**

```java
com.javacode2018.mybatis.MybatisSpringTest
```

这个用例中有2个方法，大家可以运行一下，看看2个db的时候，效果如何。

### 6.3、小结

系统中集成多个数据源这种方式，大家作为了解就可以了，不建议这么使用，通常一个业务库对应一个module，模块与模块之间相互隔离，独立部署，便于维护扩展。

## 7、Spring集成MyBatis的原理

有些朋友可能想研究spring中是如何集成mybatis的，对这块比较感兴趣，这里我就不细说了，如果大家有兴趣的，可以先看一下我前面写的[MyBatis高手系列](http://mp.weixin.qq.com/mp/homepage?__biz=MzA5MTkxMDQ4MQ==&hid=5&sn=2f7eca739b566b009d1128f0508e0e5b&scene=18#wechat_redirect)，以及目前spring系列所有的文章，那么mybatis集成spring的原理，可以从@MapperScan注解下手，你会秒懂的！！！这里就留个大家去研究了。

再插2句，一直有很多粉丝说让我写springboot系列，为什么我要花这么多时间来写spring系列？写了这么多，用到的有多少？

大家如果将spring的原理吃透了，springboot不是小意思么，所以建议大家先把spring系列的所有文章吃透，那么springboot即使我还没写，你们自己去看一下源码也是很容易的懂了。看不懂是因为欠缺的太多，spring中的很多原理你还没有掌握，所以看springboot会懵逼，一点点来吧，先把基础打牢，基础ok了，后面学东西会很快的，慢就是快，细品！！！

## 8、总结

本文介绍了spring中集成mybatis的2种方式，2种方式的重点都在上面的小结中，相对来说还是挺简单的，具体用哪种方式，大家自由选择。


[下一篇：集成junit](http://www.itsoku.com/course/5/136)

[上一篇：Spring实现数据库读写分离](http://www.itsoku.com/course/5/134)