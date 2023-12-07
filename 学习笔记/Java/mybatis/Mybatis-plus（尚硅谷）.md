# **第** **1** **章 简介**

## **1.1 MyBatisPlus** **介绍**

MyBatis-Plus(简称MP),是一个 MyBatis的增强工具包，只做增强不做改变为简化开发工作、提高生产率而生。我们的愿景是成为Mybatis最好的搭档，就像 魂斗罗 中的1P、2P，基友搭配，效率翻倍。

## **1.2** **代码及文档发布地址**

官方地址:

http://mp.baomidou.com

代码发布地址:

Github: https://github.com/baomidou/mybatis-plus

Gitee: https://gitee.com/baomidou/mybatis-plus

文档发布地址:

http://mp.baomidou.com/#/?id=%E7%AE%80%E4%BB%8B

## **1.3** **前置知识**

Mybatis

Spring 

Maven

# **第** **2** **章 集成** **MP**

## **2.1** **创建测试表**

```sql
-- 创建库
CREATE DATABASE mp;
-- 使用库
USE mp;
-- 创建表
CREATE TABLE tbl_employee(
    id INT(11) PRIMARY KEY AUTO_INCREMENT,
    last_name VARCHAR(50),
    email VARCHAR(50),
    gender CHAR(1),
    age int
);

INSERT INTO tbl_employee(last_name,email,gender,age)VALUES('Tom','tom@atguigu.com',1,22);
INSERT INTO tbl_employee(last_name,email,gender,age)VALUES('Jerry','jerry@atguigu.com',0,25);
INSERT INTO tbl_employee(last_name,email,gender,age)VALUES('Black','black@atguigu.com',1,30);
INSERT INTO tbl_employee(last_name,email,gender,age)VALUES('White','white@atguigu.com',0,35);
```

## 2.2创建javaBean

```java
package com.example.mybatisplus.domain;

import lombok.Data;
/**
 * 定义JavaBean中成员变量时使用的类型
 * 因为每个基本类型都有一个默认值
 *  int --> 0
 *  boolean --> false
 */
@Data
public class Employee {
    private Integer id;
    private String lastName;
    private String email;
    private Integer gender;
    private Integer age;

    @Override
    public String toString() {
        return "Employee{" +
            "id=" + id +
            ", lastName='" + lastName + '\'' +
            ", email='" + email + '\'' +
            ", gender=" + gender +
            ", age=" + age +
            '}';
    }
}

```

## 2.3依赖配置

1)在pom.xml中加入对MP、Spring、连接池、Junit、Mysql驱动等依赖

```xml
<dependencies>
    <!-- mp依赖
         mybatisPlus 会自动的维护Mybatis 以及MyBatis-spring相关的依赖
     -->
    <dependency>
        <groupId>com.baomidou</groupId>
        <artifactId>mybatis-plus</artifactId>
        <version>2.3</version>
    </dependency>
    <!--junit -->
    <dependency>
        <groupId>junit</groupId>
        <artifactId>junit</artifactId>
        <version>4.9</version>
    </dependency>
    <!-- log4j -->
    <dependency>
        <groupId>log4j</groupId>
        <artifactId>log4j</artifactId>
        <version>1.2.17</version>
    </dependency>
    <!-- c3p0 -->
    <dependency>
        <groupId>com.mchange</groupId>
        <artifactId>c3p0</artifactId>
        <version>0.9.5.2</version>
    </dependency>
    <!-- mysql -->
    <dependency>
        <groupId>mysql</groupId>
        <artifactId>mysql-connector-java</artifactId>
        <version>5.1.37</version>依赖要与数据库版本一致，不然会异常
    </dependency>
    <!-- spring -->
    <dependency>
        <groupId>org.springframework</groupId>
        <artifactId>spring-context</artifactId>
        <version>4.3.10.RELEASE</version>
    </dependency>
    <dependency>
        <groupId>org.springframework</groupId>
        <artifactId>spring-orm</artifactId>
        <version>4.3.10.RELEASE</version>
    </dependency>

</dependencies>
```

**特别说明：Mybatis及mybatis-spring依赖请勿加入项目配置，以免引起版本冲突！！！Mybatis-plus会自动帮你维护。**

2)加入MyBatis的全局配置文件

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE configuration
PUBLIC "-//mybatis.org//DTD Config 3.0//EN"
"http://mybatis.org/dtd/mybatis-3-config.dtd">
<configuration>

</configuration>
```

3)加入log4j.xml

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE log4j:configuration SYSTEM "log4j.dtd">

<log4j:configuration xmlns:log4j="http://jakarta.apache.org/log4j/">

    <appender name="STDOUT" class="org.apache.log4j.ConsoleAppender">
        <param name="Encoding" value="UTF-8" />
        <layout class="org.apache.log4j.PatternLayout">
            <param name="ConversionPattern" value="%-5p %d{MM-dd HH:mm:ss,SSS} %m  (%F:%L) \n" />
        </layout>
    </appender>
    <logger name="java.sql">
        <level value="debug" />
    </logger>
    <logger name="org.apache.ibatis">
        <level value="info" />
    </logger>
    <root>
        <level value="debug" />
        <appender-ref ref="STDOUT" />
    </root>
</log4j:configuration>

```

4)加入db.properties连接信息配置

```properties
jdbc.driver=com.mysql.jdbc.Driver 
jdbc.url=jdbc:mysql://localhost:3306/mp jdbc.username=root 
jdbc.password=1234
```

5)加入spring的配置文件applicationContext.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:context="http://www.springframework.org/schema/context"
       xmlns:tx="http://www.springframework.org/schema/tx"
       xmlns:mybatis-spring="http://mybatis.org/schema/mybatis-spring"
       xsi:schemaLocation="http://mybatis.org/schema/mybatis-spring http://mybatis.org/schema/mybatis-spring-1.2.xsd
                           http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd
                           http://www.springframework.org/schema/context http://www.springframework.org/schema/context/spring-context-4.0.xsd
                           http://www.springframework.org/schema/tx http://www.springframework.org/schema/tx/spring-tx-4.0.xsd">

    <!-- 数据源 -->
    <context:property-placeholder location="classpath:db.properties"/>
    <bean id="dataSource" class="com.mchange.v2.c3p0.ComboPooledDataSource">
        <property name="driverClass" value="${jdbc.driver}"></property>
        <property name="jdbcUrl" value="${jdbc.url}"></property>
        <property name="user" value="${jdbc.username}"></property>
        <property name="password" value="${jdbc.password}"></property>
    </bean>

    <!-- 事务管理器 -->
    <bean id="dataSourceTransactionManager" 
          class="org.springframework.jdbc.datasource.DataSourceTransactionManager">
        <property name="dataSource" ref="dataSource"></property>
    </bean>
    <!-- 基于注解的事务管理 -->
    <tx:annotation-driven transaction-manager="dataSourceTransactionManager"/>

    <!--  配置SqlSessionFactoryBean 
    Mybatis提供的: org.mybatis.spring.SqlSessionFactoryBean
    MP提供的:com.baomidou.mybatisplus.spring.MybatisSqlSessionFactoryBean
    -->
    <!--	<bean id="sqlSessionFactoryBean" class="org.mybatis.spring.SqlSessionFactoryBean">-->

    <bean id="sqlSessionFactoryBean" class="com.baomidou.mybatisplus.spring.MybatisSqlSessionFactoryBean">
        <!-- 数据源 -->
        <property name="dataSource" ref="dataSource"></property>
        <property name="configLocation" value="classpath:mybatis-config.xml"></property>
        <!-- 别名处理 -->
        <property name="typeAliasesPackage" value="domain"></property>

        <!-- 注入全局MP策略配置 -->
        <property name="globalConfig" ref="globalConfiguration"></property>
    </bean>

    <!-- 定义MybatisPlus的全局策略配置-->
    <bean id ="globalConfiguration" class="com.baomidou.mybatisplus.entity.GlobalConfiguration">
        <!-- 在2.3版本以后，dbColumnUnderline 默认值就是true -->
        <property name="dbColumnUnderline" value="true"></property>

        <!-- 全局的主键策略 -->
        <property name="idType" value="0"></property>

        <!-- 全局的表前缀策略配置 -->
        <property name="tablePrefix" value="tbl_"></property>

    </bean>

    <!-- 
    配置mybatis 扫描mapper接口的路径
    -->
    <bean class="org.mybatis.spring.mapper.MapperScannerConfigurer">
        <property name="basePackage" value="mapper"></property>
    </bean>	
</beans>

```

## 2.4测试

```java
package com.mp.test;

import org.junit.Test;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.SQLException;

public class Mptest {
    private ApplicationContext ioc=new ClassPathXmlApplicationContext("applicationContext.xml");
    @Test
    public void test() throws SQLException {

        DataSource dataSource=ioc.getBean("dataSource",DataSource.class);
        Connection connection = dataSource.getConnection();
        System.out.println(connection);
    }
}
```

## 2.5集成MP

Mybatis-Plus的集成非常简单，对于Spring，我们仅仅需要把Mybatis自带的MybatisSqlSessionFactoryBean替换为MP自带的即可。

```xml
<bean id="sqlSessionFactoryBean" class="com.baomidou.mybatisplus.spring.MybatisSqlSessionFactoryBean">
    <!--数据源-->
    <property name="dataSource" ref="dataSource"></property>
    <property name="configLocation" value="classpath:mybatis-config.xml"></property>
    <!--别名处理-->
    <property name="typeAliasesPackage" value="domain"></property>
</bean>
```

# 第3章入门HelloWorld

## 3.1通用CRUD

1)提出问题:

假设我们已存在一张tbl_employee表，且已有对应的实体类Employee，实现tbl_employee表的CRUD操作我们需要做什么呢？

2)实现方式:

   **基于Mybatis:**

​		**需要编写EmployeeMapper接口，并手动编写CRUD方法;**

​		**提供EmployeeMapper.xml映射文件，并手动编写每个方法对应的SQL语句.**

   **基于MP:**

​		只需要创建EmployeeMapper接口，并继承BaseMapper接口。这就是使用MP 需要完成的所有操作，甚至不需要创建SQL映射文件。

```java
package mapper;

import com.baomidou.mybatisplus.mapper.BaseMapper;
import domain.Employee;

/**
 * Mapper接口
 * 基于mybatis：在mapper接口中编写crud相关方法，提供Mapper接口所对应的sql映射文件以及方法对应的sql语句
 * 基于MP：在XXXMapper接口中继承BaseMapper接口即可
 * BaseMapper<T>:泛型指定的是当前mapper接口所操作的实体类类型
 */
public interface EmployeeMapper  extends BaseMapper<Employee> {

}
```

## 3.2插入操作

1. Integer insert(Tentity);

   insert方法在插入时，会根据实体类的每个属性进行非空判断，只有非空属性对应的字段才会出现到sql语句中

   ```java
   private ApplicationContext ioc=new ClassPathXmlApplicationContext("applicationContext.xml");
   private EmployeeMapper employeeMapper=ioc.getBean("employeeMapper",EmployeeMapper.class);
   
   /**
        * 通用插入操作
        */
   
   @Test
   public void TestCommonInsert(){
       Employee employee = new Employee();
       employee.setAge(1);
       employee.setEmail("164644354@qq.com");
       employee.setId(1);
       employee.setLastName("wowosong");
       employee.setGender(1);
       Integer result = employeeMapper.insert(employee);
       System.out.println(result);
   }
   ```

2. @TableId

   ```java
   /**
    * @TableId:
    * value :指定表中的主键列的列名，如果实体属性名与列名一致，可以省略不指定
    * type：指定主键策略
    */
   @TableId(value = "",type = IdType.AUTO)
   
   ```

3. @TableName 

   ```java
   /**
    * Mybatis-plus默认使用实体类的类名去数据库查找对应的表
    */
   @Data
   @TableName(value = "tbl_employee")
   public class Employee {
       /**
        * @TableId:
        * value :指定表中的主键列的列名，如果实体属性名与列名一致，可以省略不指定
        * type：指定主键策略
        */
   
   }
   ```

4. 全局的MP表前缀配置: <propertyname="tablePrefix" value="tbl_"></property>

   ```xml
   <!-- 定义MybatisPlus的全局策略配置-->
   <bean id ="globalConfiguration" class="com.baomidou.mybatisplus.entity.GlobalConfiguration">
       <!-- 在2.3版本以后，dbColumnUnderline 默认值就是true -->
       <!--驼峰命名到下划线>
     <property name="dbColumnUnderline" value="true"></property>
   
     <!-- 全局的主键策略 -->
       <property name="idType" value="0"></property>
   
       <!-- 全局的表前缀策略配置 -->
       <property name="tablePrefix" value="tbl_"></property>
   </bean>
   ```

   ```xml
   配置全局策略后需要注入到mybatis-plus
   <bean id="sqlSessionFactoryBean" class="com.baomidou.mybatisplus.spring.MybatisSqlSessionFactoryBean">
       <!-- 数据源 -->
       <property name="dataSource" ref="dataSource"></property>
       <property name="configLocation" value="classpath:mybatis-config.xml"></property>
       <!-- 别名处理 -->
       <property name="typeAliasesPackage" value="domain"></property>
   
       <!-- 注入全局MP策略配置 -->
       <property name="globalConfig" ref="globalConfiguration"></property>
   </bean>
   ```

5. 全局的MP下划线到驼峰命名配置:<propertyname="dbColumnUnderline"value="true"></property>

6. 全局的MP主键策略配置:<propertyname="idType"value="0"></property>

7. @TableField 

   ```java
   public class Employee {
       /**
        * @TableField:
        * value :指定表中列的列名，如果实体属性名与列名一致，可以省略不指定
        * exist：指定字段是否在数据库中存在
        */
   
       @TableField(value = "last_name",exist = true)
       private String lastName;
       @TableField(exist=false)
       private  Double salary;
   }
   ```

8. 支持主键自增的数据库插入数据获取主键值

   Mybatis:需要通过useGeneratedKeys以及keyProperty来设置

   MP:自动将主键值回写到实体类中

   ```java
    Integer result = employeeMapper.insert(employee);
    Integer key =employee.getId();
   ```

9. Integer insertAllColumn(Tentity)

   insertAllColumn方法在插入时，不管属性是否为空，所有属性对应的字段都会出现到sql语句中

   ```java
   Integer result = employeeMapper.insertAllColumn(employee);
   ```

## 3.3更新操作

1)Integer updateById(@Param("et")Tentity);

updateById方法在更新时，会根据实体类的每个属性进行非空判断，只有非空属性对应的字段才会出现到sql语句中

```java
/**
 * 通用更新操作
 */
@Test
public void testCommonUpdte(){
    Employee employee = new Employee();
    employee.setId(1);
    employee.setEmail("wowosong@qq.com");
    employee.setLastName("test");
    Integer integer = employeeMapper.updateById(employee);
    System.out.println(integer);
}

```

```sql
Preparing:  UPDATE tbl_employee SET last_name=?, email=? WHERE id=?   (JakartaCommonsLoggingImpl.java:54) 
DEBUG 06-14 22:32:20,673 ==> Parameters: test(String), wowosong@qq.com(String), 1(Integer)  (JakartaCommonsLoggingImpl.java:54) 
```

2)Integer updateAllColumnById(@Param("et")Tentity)

updateAllColumnById方法在更新时，不管属性是否为空，所有属性对应的字段都会出现到sql语句中

```java
/**
 * 通用更新操作
 */
@Test
public void testCommonUpdte(){
    Employee employee = new Employee();
    employee.setId(1);
    employee.setEmail("wowosong@qq.com");
    employee.setLastName("test");
    Integer integer1 = employeeMapper.updateAllColumnById(employee);
    System.out.println(integer1);
}

```

```sql
Preparing: UPDATE tbl_employee SET last_name=?,email=?,gender=?,age=? WHERE id=？(JakartaCommonsLoggingImpl.java:54) 
DEBUG 06-14 22:31:09,870 ==> Parameters: test(String), wowosong@qq.com(String), null, null, 1(Integer)  (JakartaCommonsLoggingImpl.java:54) 
```

3）int update(@Param(Constants.ENTITY) T updateEntity, @Param(Constants.WRAPPER) Wrapper<T> whereWrapper);

```java
// 根据 whereWrapper 条件，更新记录
int update(@Param(Constants.ENTITY) T updateEntity, @Param(Constants.WRAPPER) Wrapper<T> whereWrapper);
```

## **3.4** **查询操作**

1) T selectById(Serializable id);

```java
/**
 * 通用查询操作
 */
@Test
public void testSelect(){
    Employee employee = employeeMapper.selectById(1);
    System.out.println(employee);
}
```

```
Preparing: SELECT id,last_name AS lastName,email,gender,age FROM tbl_employee WHERE id=?   (JakartaCommonsLoggingImpl.java:54) 
DEBUG 06-15 21:36:14,203 ==> Parameters: 1(Integer)  (JakartaCommonsLoggingImpl.java:54)
```

2) T selectOne(@Param("ew") T entity);

**返回值有多条数据时，会出现异常，需要注意！！！**

```java
//通过多列查询
Employee employee = new Employee();
employee.setLastName("wowosong");
employee.setId(1);
Employee employee1 = employeeMapper.selectOne(employee);
System.out.println(employee1);
```

```sql
Preparing: SELECT id,last_name AS lastName,email,gender,age FROM tbl_employee WHERE id=? AND last_name=?   (JakartaCommonsLoggingImpl.java:54) 
DEBUG 06-15 21:40:18,197 ==> Parameters: 1(Integer), wowosong(String)  (JakartaCommonsLoggingImpl.java:54) 
```

3) List<T> selectBatchIds(List<? extends Serializable> idList);

```java
//  通过多个ID查询
List<Integer> list= Arrays.asList(1,2,3,4,1);
employeeMapper.selectBatchIds(list);
```

```sql
Preparing: SELECT id,last_name AS lastName,email,gender,age FROM tbl_employee WHERE id IN ( ? , ? , ? , ? , ? )   (JakartaCommonsLoggingImpl.java:54) 
DEBUG 06-15 21:46:11,451 ==> Parameters: 1(Integer), 2(Integer), 3(Integer), 4(Integer), 1(Integer)  (JakartaCommonsLoggingImpl.java:54)
```

4) List<T> selectByMap(@Param("cm") Map<String, Object> columnMap);

```java
//通过Map封装查询
Map map=new HashMap();
map.put("id",1);
map.put("last_Name","wowosong");//写列名
employeeMapper.selectByMap(map);
```

```sql
Preparing: SELECT id,last_name AS lastName,email,gender,age FROM tbl_employee WHERE id = ? AND last_Name = ?   (JakartaCommonsLoggingImpl.java:54) 
DEBUG 06-15 21:50:17,267 ==> Parameters: 1(Integer), wowosong(String)  (JakartaCommonsLoggingImpl.java:54) 
```

5) List<T> selectPage(RowBounds rowBounds, @Param("ew") Wrapper<T> wrapper);

```java
//分页查询
List<Employee> employees = employeeMapper.selectPage(new Page(2, 2), null);
System.out.println(employees); 
```

```sql
Preparing: SELECT id,last_name AS lastName,email,gender,age FROM tbl_employee   (JakartaCommonsLoggingImpl.java:54) 
DEBUG 06-15 21:55:37,146 ==> Parameters:   (JakartaCommonsLoggingImpl.java:54) 
```

## **3.5** **删除操作**

1) Integer deleteById(Serializable id);

```java
/**
* 通用删除操作
*/
@Test
public void testDelete(){
    Integer integer = employeeMapper.deleteById(1);
    System.out.println(integer);
}
```

```sql
Preparing: DELETE FROM tbl_employee WHERE id=?   (JakartaCommonsLoggingImpl.java:54) 
DEBUG 06-15 22:00:34,820 ==> Parameters: 1(Integer)  (JakartaCommonsLoggingImpl.java:54)
```

2) Integer deleteByMap(@Param("cm") Map<String, Object> columnMap);

```java
//根据条件删除
Map<String,Object> map=new HashMap<String, Object>();
map.put("id",1);
employeeMapper.deleteByMap(map);
```

```sql
Preparing: DELETE FROM tbl_employee WHERE id = ?   (JakartaCommonsLoggingImpl.java:54) 
DEBUG 06-15 22:03:06,177 ==> Parameters: 1(Integer)  (JakartaCommonsLoggingImpl.java:54) 
```

3) Integer deleteBatchIds(List<? extends Serializable> idList);

**idList不能为空，否则sql异常**

```java
//根据多个IDs删除
List<Integer> list=new ArrayList<Integer>();
list.add(1);
list.add(2);
employeeMapper.deleteBatchIds(list);
```

```sql
 Preparing: DELETE FROM tbl_employee WHERE id IN ( ? , ? )   (JakartaCommonsLoggingImpl.java:54) 
DEBUG 06-15 22:07:14,567 ==> Parameters: 1(Integer), 2(Integer)  (JakartaCommonsLoggingImpl.java:54) 
```

## **3.6 MP** **启动注入** **SQL** **原理分析**

1) 问题: xxxMapper 继承了 BaseMapper<T>, BaseMapper 中提供了通用的 CRUD 方法，方法来源于 BaseMapper, 有方法就必须有 SQL, **因为 MyBatis 最终还是需要通过SQL 语句操作数据.**

前置知识:MyBatis 源码中比较重要的一些对象， MyBatis 框架的执行流程

Configuration

MappedStatement

……..

2) 通过现象看到本质

A． employeeMapper 的本质 org.apache.ibatis.binding.MapperProxy

B． MapperProxy 中 sqlSession –>SqlSessionFactory

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071128424.png)

C． SqlSessionFacotry 中 → Configuration→ MappedStatements每一个 mappedStatement 都表示 **Mapper 接口中的一个方法与 Mapper 映射文件中的一个 SQL**。

MP 在启动就会挨个分析 xxxMapper 中的方法，并且将对应的 SQL 语句处理好，保存到 configuration 对象中的mappedStatements 中. 

D.  本质

```
DEBUG 06-15 22:19:48,493 Invoking afterPropertiesSet() on bean with name 'sqlSessionFactoryBean'  (AbstractAutowireCapableBeanFactory.java:1670) 
DEBUG 06-15 22:19:48,631 DeBug: MyBatis Plus Global configuration Initializing !  (JakartaCommonsLoggingImpl.java:54) 
DEBUG 06-15 22:19:48,644 addMappedStatement: com.baomidou.mybatisplus.mapper.SqlRunner.SelectList  (JakartaCommonsLoggingImpl.java:54) 
DEBUG 06-15 22:19:48,645 addMappedStatement: com.baomidou.mybatisplus.mapper.SqlRunner.SelectObjs  (JakartaCommonsLoggingImpl.java:54) 
DEBUG 06-15 22:19:48,646 addMappedStatement: com.baomidou.mybatisplus.mapper.SqlRunner.Insert  (JakartaCommonsLoggingImpl.java:54) 
DEBUG 06-15 22:19:48,646 addMappedStatement: com.baomidou.mybatisplus.mapper.SqlRunner.Update  (JakartaCommonsLoggingImpl.java:54) 
DEBUG 06-15 22:19:48,647 addMappedStatement: com.baomidou.mybatisplus.mapper.SqlRunner.Delete  (JakartaCommonsLoggingImpl.java:54) 
DEBUG 06-15 22:19:48,647 addMappedStatement: com.baomidou.mybatisplus.mapper.SqlRunner.Count  (JakartaCommonsLoggingImpl.java:54) 
DEBUG 06-15 22:19:48,650 Mybatis-plus init success.  (JakartaCommonsLoggingImpl.java:54) 
```

Configuration： **MyBatis 或者 MP 全局配置对象**

MappedStatement：一个 MappedStatement 对象对应 Mapper 配置文件中的一个select/update/insert/delete 节点，主要描述的是一条 SQL 语句

SqlMethod : 枚举对象 ，MP 支持的 SQL 方法

TableInfo：数据库表反射信息 ，可以获取到数据库表相关的信息

SqlSource: SQL 语句处理对象

MapperBuilderAssistant： 用于缓存、SQL 参数、查询结果集处理等。通过 MapperBuilderAssistant 将每一个 mappedStatement添加到 configuration 中的 mappedstatements 中

![image-20210615225843047](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071129508.png)

![image-20210615225919151](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071129655.png)

## **3.7** **通用** **CRUD** **小结**

1) 以上是基本的 CRUD 操作，如您所见，我们仅仅需要继承一个 BaseMapper 即可实现大部分单表 CRUD 操作。BaseMapper 提供了多达 17 个方法给大家使用, 可以极其方便的实现单一、批量、分页等操作。极大的减少开发负担，难道这就是 MP 的强大之处了吗？

2) 提出需求:

现有一个需求，我们需要分页查询 tbl_employee 表中，年龄在 18~50 之间性别为男且姓名为 xx 的所有用户，这时候我们该如何实现上述需求呢？

MyBatis : 需要在 SQL 映射文件中编写带条件查询的 SQL,并基于 PageHelper 插件完成分页. 实现以上一个简单的需求，往往需要我们做很多重复单调的工作。普通的 Mapper能够解决这类痛点吗？

MP: 依旧不用编写 SQL 语句, MP 提供了功能强大的条件构造器 EntityWrapper

# **第** **4** **章 条件构造器** **EntityWrapper**

## **4.1 EntityWrapper** **简介**

1) Mybatis-Plus 通过 EntityWrapper（简称 EW，MP 封装的一个查询条件构造器）或者Condition（与 EW 类似） 来让用户自由的构建查询条件，简单便捷，没有额外的负担，能够有效提高开发效率

2) 实体包装器，主要用于处理 sql 拼接，排序，实体参数查询等

3) **注意: 使用的是数据库字段，不是 Java 属性!**

4) 条件参数说明:

![image-20210616204149905](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071129108.png)

## **4.2** **使用** **EntityWrapper**的方式打开如上需求

```java
/**
 *
分页查询 tbl_employee表中，年龄在 18~50之间性别为男且姓名为 xx的所有用户，这时候我们该如何实现上述需求呢？
 */
@Test
public void  testWrapper(){
    List<Employee> employees = employeeMapper.selectPage(new Page<Employee>(1, 2),
                                                         new EntityWrapper<Employee>().between("age", 15, 18).eq("gender", 1).eq("last_name", "wowosong"));
    System.out.println(employees);
}

```

```sql
Preparing: SELECT id,last_name AS lastName,email,gender,age FROM tbl_employee WHERE (age BETWEEN ? AND ? AND gender = ? AND last_name = ?)   (JakartaCommonsLoggingImpl.java:54) 
DEBUG 06-16 20:52:27,050 ==> Parameters: 15(Integer), 18(Integer), 1(Integer), wowosong(String)  (JakartaCommonsLoggingImpl.java:54) 
```



## **4.3** **带条件的查询**

1) List<T> selectList(@Param("ew") Wrapper<T> wrapper);

```java
/**
 * 查询出性别为男，且名字中含老师，或邮箱中含a
 */
List<Employee> employees = employeeMapper.selectList(new EntityWrapper<Employee>()
                                                     .eq("gender", 1).like("last_name", "老师").or()
                                                     .like("email", "a"));
//WHERE (gender = ? AND last_name LIKE ? OR email LIKE ?).orNew() 
// (gender = ? AND last_name LIKE ?) OR (email LIKE ?) 
System.out.println(employees);
```

```sql
 Preparing: SELECT id,last_name AS lastName,email,gender,age FROM tbl_employee WHERE (gender = ? AND last_name LIKE ? OR email LIKE ?)   (JakartaCommonsLoggingImpl.java:54) 
DEBUG 06-16 21:00:59,860 ==> Parameters: 1(Integer), %老师%(String), %a%(String)  (JakartaCommonsLoggingImpl.java:54) 
```



## **4.4** **带条件的修改**

1) Integer update(@Param("et") T entity, @Param("ew") Wrapper<T> wrapper);

```java
/**
 * 条件构造器 更新操作
 */
@Test
public void testEntityUpdateWrapper(){
    Employee employee = new Employee();
    employee.setLastName("111");
    employee.setEmail("1231@qq.com");
    employeeMapper.update(employee,new EntityWrapper<Employee>().
                          eq("last_name","wowosong"));
}

```

```sql
UPDATE tbl_employee SET last_name=?, email=? WHERE (last_name = ?)   (JakartaCommonsLoggingImpl.java:54) 
DEBUG 06-16 21:38:30,423 ==> Parameters: 111(String), 1231@qq.com(String), wowosong(String)  (JakartaCommonsLoggingImpl.java:54) 
```



## **4.5** **带条件的删除**

1) Integer delete(@Param("ew") Wrapper<T> wrapper);

```java
/**
 * 条件构造器 更新操作
 */
@Test
public void testEntityDeleteWrapper(){
    Employee employee = new Employee();
    employee.setLastName("111");
    employee.setEmail("1231@qq.com");
    employeeMapper.delete(new EntityWrapper<Employee>().
                          eq("last_name","wowosong"));
}
```

```sql
Preparing: DELETE FROM tbl_employee WHERE (last_name = ?)   (JakartaCommonsLoggingImpl.java:54) 
DEBUG 06-16 21:45:55,470 ==> Parameters: wowosong(String)  (JakartaCommonsLoggingImpl.java:54) 
```

## 4.6 orderDesc排序

```java
List<Employee> age = employeeMapper.selectList(new EntityWrapper<Employee>().orderDesc(Arrays.asList("age")));
System.out.println(age);
```

```sql
Preparing: SELECT id,last_name AS lastName,email,gender,age FROM tbl_employee ORDER BY age DESC   (JakartaCommonsLoggingImpl.java:54) 
DEBUG 06-16 21:53:30,643 ==> Parameters:   (JakartaCommonsLoggingImpl.java:54)
```

## **4.7** **使用** **Condition** **的方式打开如上需求**

```java
List<Employee> userListCondition = employeeMapper.selectPage(
    new Page<Employee>(2,3), 
    Condition.create().
    eq("gender", 1).
    eq("last_name", "MyBatisPlus").
    between("age", 18, 50));
```

## **4.7** **小结**

MP: EntityWrapper Condition 条件构造器

MyBatis MBG : xxxExample→Criteria : QBC( Query By Criteria)

Hibernate 、 通用 Mapper

# **第** **5** **章：**ActiveRecord(活动记录)

Active Record(活动记录)，是一种领域模型模式，特点是一个模型类对应关系型数据库中的一个表，而模型类的一个实例对应表中的一行记录。

ActiveRecord 一直广受动态语言（ PHP 、 Ruby 等）的喜爱，而 Java 作为准静态语言，对于 ActiveRecord 往往只能感叹其优雅，所以 MP 也在 AR 道路上进行了一定的探索

## **5.1** **如何使用** **AR** 模式

1) 仅仅需要让实体类继承 Model 类且实现主键指定方法，即可开启 AR 之旅.

```java

@TableName(value = "tbl_employee")
public class Employee extends Model<Employee> {
    /**
     * @TableId:
     * value :指定表中的主键列的列名，如果实体属性名与列名一致，可以省略不指定
     * type：指定主键策略
     */
    @TableId(value = "",type = IdType.AUTO)
    private Integer id;
    @TableField(value = "last_name",exist = true)
    private String lastName;
    private String email;
    private Integer gender;
    private Integer age;
    @TableField(exist = false)
    private  Double salary;

    @Override
    public String toString() {
        return "Employee{" +
            "id=" + id +
            ", lastName='" + lastName + '\'' +
            ", email='" + email + '\'' +
            ", gender=" + gender +
            ", age=" + age +
            '}';
    }

    protected Serializable pkVal() {
        return this.id;
    }
}
```

## 5.2 AR基本CRUD

1) 插入操作

public boolean insert()

```java
/**
 * AR 插入操作
 */
@Test
public void testAR(){
    Employee employee = new Employee();
    employee.setId(1);
    employee.setLastName("wowosong");
    employee.setEmail("huang@qq.com");
    employee.setGender(1);
    employee.setAge(30);
    employee.insert();
}

```

```sql
Preparing: INSERT INTO tbl_employee ( last_name, email, gender, age ) VALUES ( ?, ?, ?, ? )   (JakartaCommonsLoggingImpl.java:54) 
DEBUG 06-16 22:16:22,392 ==> Parameters: wowosong(String), huang@qq.com(String), 1(Integer), 30(Integer)  (JakartaCommonsLoggingImpl.java:54) 
```

2) 修改操作

public boolean updateById()

```java
/**
 * AR 更新操作
 */
@Test
public void testARUpdate(){
    Employee employee = new Employee();
    employee.setId(1);
    employee.setLastName("wowosong");
    employee.setEmail("huang@qq.com");
    employee.setGender(1);
    employee.setAge(30);
    boolean b = employee.updateById();
    System.out.println(b);
} 

```

```sql
Preparing: UPDATE tbl_employee SET last_name=?, email=?, gender=?, age=? WHERE id=?   (JakartaCommonsLoggingImpl.java:54) 
DEBUG 06-16 22:19:58,528 ==> Parameters: wowosong(String), huang@qq.com(String), 1(Integer), 30(Integer), 1(Integer)  (JakartaCommonsLoggingImpl.java:54) 
DEBUG 06-16 22:19:58,532 <==    Updates: 0  (JakartaCommonsLoggingImpl.java:54) 
```

3) 查询操作

public T selectById()

```java
/**
 * AR 查询操作
 */
@Test
public void testARSelect(){
    Employee employee = new Employee();
    employee.setId(3);
    Employee employee1 = employee.selectById();
    System.out.println(employee1);
}

```

```sql
Preparing: SELECT id,last_name AS lastName,email,gender,age FROM tbl_employee WHERE id=?   (JakartaCommonsLoggingImpl.java:54) 
DEBUG 06-16 22:23:45,244 ==> Parameters: 3(Integer)  (JakartaCommonsLoggingImpl.java:54) 
```

public T selectById(Serializable id)

```java
/**
 * AR 查询操作
 */
@Test
public void testARSelect(){
    Employee employee = new Employee();
    Employee employee2 = employee.selectById(4);
    System.out.println(employee2);
}

```

```sql
Preparing: SELECT id,last_name AS lastName,email,gender,age FROM tbl_employee WHERE id=?   (JakartaCommonsLoggingImpl.java:54) 
DEBUG 06-16 22:25:15,316 ==> Parameters: 4(Integer)  (JakartaCommonsLoggingImpl.java:54) 
```

public List<T> selectAll()

```java
/**
 * AR 查询操作
 */
@Test
public void testARSelect(){
    Employee employee = new Employee();
    List<Employee> employees = employee.selectAll();
    System.out.println(employees);
}

```

```sql

Preparing: SELECT id,last_name AS lastName,email,gender,age FROM tbl_employee   (JakartaCommonsLoggingImpl.java:54) 
DEBUG 06-16 22:26:17,573 ==> Parameters:   (JakartaCommonsLoggingImpl.java:54) 
```

public List<T> selectList(Wrapper wrapper)

```java
/**
 * AR 查询操作
 */
@Test
public void testARSelect(){
    Employee employee = new Employee();
    List<Employee> employees = employee.selectList(new EntityWrapper().eq("last_name", "wowosong"));
    System.out.println(employees);
}

```

```sql
Preparing: SELECT id,last_name AS lastName,email,gender,age FROM tbl_employee WHERE (last_name = ?)   (JakartaCommonsLoggingImpl.java:54) 
DEBUG 06-16 22:29:30,471 ==> Parameters: wowosong(String)  (JakartaCommonsLoggingImpl.java:54) 
```

public int selectCount(Wrapper wrapper)

```java
/**
 * AR 查询操作
 */
@Test
public void testARSelect(){
    Employee employee = new Employee();
    int i = employee.selectCount(new EntityWrapper().eq("last_name", "wowosong"));
    System.out.println(i);
}

```

```sql
Preparing: SELECT COUNT(1) FROM tbl_employee WHERE (last_name = ?)   (JakartaCommonsLoggingImpl.java:54) 
DEBUG 06-16 22:30:36,104 ==> Parameters: wowosong(String)  (JakartaCommonsLoggingImpl.java:54) 
```

4) 删除操作

public boolean deleteById()

```java
/**
 * AR 删除操作
 */
@Test
public void testARDelete(){
    Employee employee = new Employee();
    employee.setId(3);
    employee.deleteById();
}

```

```sql
DELETE FROM tbl_employee WHERE id=?   (JakartaCommonsLoggingImpl.java:54) 
DEBUG 06-16 22:34:21,790 ==> Parameters: 3(Integer)  (JakartaCommonsLoggingImpl.java:54)
```

public boolean deleteById(Serializable id)

```java
/**
 * AR 删除操作
 */
@Test
public void testARDelete(){
    Employee employee = new Employee();
    employee.deleteById(4);
}

```

```sql
 DELETE FROM tbl_employee WHERE id=?   (JakartaCommonsLoggingImpl.java:54) 
DEBUG 06-16 22:34:21,790 ==> Parameters: 4(Integer)  (JakartaCommonsLoggingImpl.java:54)
```

public boolean delete(Wrapper wrapper)

```java
/**
 * AR 删除操作
 */
@Test
public void testARDelete(){
    Employee employee = new Employee();
    boolean delete = employee.delete(new EntityWrapper().eq("last_name", "wowosong"));
    System.out.println(delete);
}

```

```sql
Preparing: DELETE FROM tbl_employee WHERE (last_name = ?)   (JakartaCommonsLoggingImpl.java:54) 
DEBUG 06-16 22:32:27,514 ==> Parameters: wowosong(String)  (JakartaCommonsLoggingImpl.java:54) 
```

5) 分页复杂操作

public Page<T> selectPage(Page<T> page, Wrapper<T> wrapper)

```java
/**
 * AR 分页查询
 */
@Test
public void testSelectPage(){
    Employee employee = new Employee();
    Page<Employee> employeePage = employee.selectPage(new Page<Employee>(1, 2), new EntityWrapper<Employee>().eq("last_name", "wowosong"));
    List<Employee> records = employeePage.getRecords();
    System.out.println("records:"+records);
}

```

```sql
  Preparing: SELECT id,last_name AS lastName,email,gender,age FROM tbl_employee WHERE (last_name = ?)   (JakartaCommonsLoggingImpl.java:54) 
DEBUG 06-17 21:19:52,411 ==> Parameters: wowosong(String)  (JakartaCommonsLoggingImpl.java:54) 
```

## **5.3 AR** **小结**

1) AR 模式提供了一种更加便捷的方式实现 CRUD 操作，其本质还是调用的 Mybatis 对应的方法，类似于语法糖

语法糖是指计算机语言中添加的某种语法，这种语法对原本语言的功能并没有影响.可以更方便开发者使用，可以避免出错的机会，让程序可读性更好.

2) 到此，我们简单领略了 Mybatis-Plus 的魅力与高效率，值得注意的一点是：我们提供了强大的代码生成器，可以快速生成各类代码，真正的做到了即开即用

# **第** **6** **章：代码生成器**

1) MP 提供了大量的自定义设置，生成的代码完全能够满足各类型的需求

2) MP 的代码生成器 和 Mybatis MBG 代码生成器: 

MP 的代码生成器都是基于 java 代码来生成。MBG 基于 xml 文件进行代码生成

MyBatis 的代码生成器可生成: 实体类、Mapper 接口、Mapper 映射文件

MP 的代码生成器可生成: 实体类(可以选择是否支持 AR)、Mapper 接口、Mapper 映射文件、 Service 层、Controller 层.

3) 表及字段命名策略选择

在 MP 中，我们建议数据库表名 和 表字段名采用驼峰命名方式， 如果采用下划线命名方式 请开启全局下划线开关，如果表名字段名命名方式不一致请注解指定，我们建议最好保持一致。

这么做的原因是为了避免在对应实体类时产生的性能损耗，这样字段不用做映射就能直接和实体类对应。当然如果项目里不用考虑这点性能损耗，那么你采用下滑线也是没问题的，只需要在生成代码时配置 dbColumnUnderline 属性就可以

## **6.1** **代码生成器依赖**

1) 模板引擎

MP 的代码生成器默认使用的是 Apache 的 Velocity 模板，当然也可以更换为别的模板

技术，例如 freemarker。此处不做过多的介绍。

需要加入 Apache Velocity 的依赖

```xml
<dependency> 
    <groupId>org.apache.velocity</groupId> 
    <artifactId>velocity-engine-core</artifactId> 
    <version>2.0</version>
</dependency>
```

2) 加入 slf4j ,查看日志输出信息

```xml
<dependency> 
    <groupId>org.slf4j</groupId>
    <artifactId>slf4j-api</artifactId>
    <version>1.7.7</version>
</dependency> 
<dependency> 
    <groupId>org.slf4j</groupId> 
    <artifactId>slf4j-log4j12</artifactId> 
    <version>1.7.7</version>
</dependency>
```

## **6.2 MP** **代码生成器示例代码**

```java
@Test
public void testGenerator() {
    //全局配置
    GlobalConfig config = new GlobalConfig();
    config.setActiveRecord(true) //是否支持AR模式
        .setAuthor("weiyunhui") //作者
        .setOutputDir("D:\\workspace_my\\mp03\\src\\main\\java") 
        //生成路径
        .setFileOverride(true)//文件覆盖
        .setServiceName("%sService") //设置生成的service接口名首字母是否为I
        .setIdType(IdType.AUTO); //主键策略
    //数据源配置
    DataSourceConfig dsConfig = new DataSourceConfig();
    dsConfig.setDbType(DbType.MYSQL)
        .setUrl("jdbc:mysql://localhost:3306/mp")
        .setDriverName("com.mysql.jdbc.Driver")
        .setUsername("root")
        .setPassword("password");
    //策略配置
    StrategyConfig stConfig = new StrategyConfig();
    stConfig.setCapitalMode(true) // 全局大写命名
        .setDbColumnUnderline(true) //表名 字段名 是否使用下滑线命名
        .setNaming(NamingStrategy.underline_to_camel) // 数据库表映射到实体的命名策略
        .setInclude("tbl_employee") //生成的表
        .setTablePrefix("tbl_"); // 表前缀
    //包名策略
    PackageConfig pkConfig = new PackageConfig();
    pkConfig.setParent("com.atguigu.mp")
        .setController("controller")
        .setEntity("beans")
        .setService("service");
    AutoGenerator ag = new   AutoGenerator().setGlobalConfig(config)
        .setDataSource(dsConfig)
        .setStrategy(stConfig)
        .setPackageInfo(pkConfig);
    ag.execute();
}
```

## **6.3 ServiceImpl** **说明**

EmployeeServiceImpl 继承了 ServiceImpl 类，mybatis-plus 通过这种方式为我们注入了 EmployeeMapper，这样可以使用 service 层默认为我们提供的很多方法,也可以调用我们自己在 dao 层编写的操作数据库的方法. 

EmployeeServiceImpl 继承了 ServiceImpl 类,

1.在ServiceImpl中已经完成mapper对象的注入，直接在EmployeeServiceImpl中进行使用

2.在ServiceImpl中也帮我们提供了常用的CRUD方法，基本的一些CRUD方法在Service中不需要我们自己再进行定义。

# **第** **7** 章：插件扩展

## **7.1 Mybatis** **插件机制简介**

1) 插件机制: 

Mybatis 通过插件(Interceptor) 可以做到拦截四大对象相关方法的执行,根据需求，完成相关数据的动态改变。

Executor

StatementHandler

ParameterHandler

ResultSetHandler

2) 插件原理

四大对象的每个对象在创建时，都会执行 interceptorChain.pluginAll()，会经过每个插件对象的 plugin()方法，目的是为当前的四大对象创建代理。代理对象就可以拦截到四大对象相关方法的执行，因为要执行四大对象的方法需要经过代理.

## **7.2** **分页插件**

1) com.baomidou.mybatisplus.plugins.PaginationInterceptor

## **7.3** **执行分析插件**

1) com.baomidou.mybatisplus.plugins.SqlExplainInterceptor

2) SQL 执行分析拦截器，只支持 MySQL5.6.3 以上版本

3) 该插件的作用是分析 DELETE UPDATE 语句,防止小白或者恶意进行 DELETE UPDATE 全表操作

4) 只建议在开发环境中使用，不建议在生产环境使用

5) 在插件的底层 通过 SQL 语句分析命令:Explain 分析当前的 SQL 语句，

**根据结果集中的 Extra 列来断定当前是否全表操作。**

## **7.4** **性能分析插件**

1) com.baomidou.mybatisplus.plugins.PerformanceInterceptor

2) 性能分析拦截器，用于输出每条 SQL 语句及其执行时间

3) SQL 性能执行分析,开发环境使用*，*超过指定时间，停止运行。有助于发现问题

## **7.5** **乐观锁插件**

1) com.baomidou.mybatisplus.plugins.OptimisticLockerInterceptor

2) 如果想实现如下需求: 当要更新一条记录的时候，希望这条记录没有被别人更新

3) 乐观锁的实现原理:

取出记录时，获取当前 version 2 

更新时，带上这个 version 2 

执行更新时， set version = yourVersion+1 where version = yourVersion

如果 version 不对，就更新失败

4) @Version 用于注解实体字段，必须要有。

# **第** **8** **章：自定义全局操作**

根据 MybatisPlus 的 AutoSqlInjector 可以自定义各种你想要的 sql ,注入到全局中，相当于自定义 Mybatisplus 自动注入的方法。

之前需要在 xml 中进行配置的 SQL 语句，现在通过扩展 AutoSqlInjector 在加载 mybatis 环境时就注入。

## **8.1 AutoSqlInjector** 

1) 在 Mapper 接口中定义相关的 CRUD 方法

2) 扩展 AutoSqlInjector inject 方法，实现 Mapper 接口中方法要注入的 SQL;

```java
package com.atguigu.mp.injector;

import org.apache.ibatis.builder.MapperBuilderAssistant;
import org.apache.ibatis.mapping.SqlSource;
import org.apache.ibatis.session.Configuration;

import com.baomidou.mybatisplus.entity.TableInfo;
import com.baomidou.mybatisplus.mapper.AutoSqlInjector;

/**
 * 自定义全局操作
 */
public class MySqlInjector  extends AutoSqlInjector{

    /**
	 * 扩展inject 方法，完成自定义全局操作
	 */
    @Override
    public void inject(Configuration configuration, MapperBuilderAssistant builderAssistant, Class<?> mapperClass,
                       Class<?> modelClass, TableInfo table) {
        //将EmployeeMapper中定义的deleteAll， 处理成对应的MappedStatement对象，加入到configuration对象中。

        //注入的SQL语句
        String sql = "delete from " +table.getTableName();
        //注入的方法名   一定要与EmployeeMapper接口中的方法名一致
        String method = "deleteAll" ;

        //构造SqlSource对象
        SqlSource sqlSource = languageDriver.createSqlSource(configuration, sql, modelClass);

        //构造一个删除的MappedStatement
        this.addDeleteMappedStatement(mapperClass, method, sqlSource);

    }
}
```

3) 在 MP 全局策略中，配置 自定义注入器

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:context="http://www.springframework.org/schema/context"
       xmlns:tx="http://www.springframework.org/schema/tx"
       xmlns:mybatis-spring="http://mybatis.org/schema/mybatis-spring"
       xsi:schemaLocation="http://mybatis.org/schema/mybatis-spring http://mybatis.org/schema/mybatis-spring-1.2.xsd
                           http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd
                           http://www.springframework.org/schema/context http://www.springframework.org/schema/context/spring-context-4.0.xsd
                           http://www.springframework.org/schema/tx http://www.springframework.org/schema/tx/spring-tx-4.0.xsd">


    <!-- 数据源 -->
    <context:property-placeholder location="classpath:db.properties"/>
    <!-- Mysql
 <bean id="dataSource" class="com.mchange.v2.c3p0.ComboPooledDataSource">
  <property name="driverClass" value="${jdbc.driver}"></property>
  <property name="jdbcUrl" value="${jdbc.url}"></property>
  <property name="user" value="${jdbc.username}"></property>
  <property name="password" value="${jdbc.password}"></property>
 </bean>
  -->
    <!-- Oracle -->
    <bean id="dataSource" class="com.mchange.v2.c3p0.ComboPooledDataSource">
        <property name="driverClass" value="${orcl.driver}"></property>
        <property name="jdbcUrl" value="${orcl.url}"></property>
        <property name="user" value="${orcl.username}"></property>
        <property name="password" value="${orcl.password}"></property>
    </bean>

    <!-- 事务管理器 -->
    <bean id="dataSourceTransactionManager" 
          class="org.springframework.jdbc.datasource.DataSourceTransactionManager">
        <property name="dataSource" ref="dataSource"></property>
    </bean>
    <!-- 基于注解的事务管理 -->
    <tx:annotation-driven transaction-manager="dataSourceTransactionManager"/>

    <!--  配置SqlSessionFactoryBean 
  Mybatis提供的: org.mybatis.spring.SqlSessionFactoryBean
  MP提供的:com.baomidou.mybatisplus.spring.MybatisSqlSessionFactoryBean
  -->
    <bean id="sqlSessionFactoryBean" class="com.baomidou.mybatisplus.spring.MybatisSqlSessionFactoryBean">
        <!-- 数据源 -->
        <property name="dataSource" ref="dataSource"></property>
        <property name="configLocation" value="classpath:mybatis-config.xml"></property>
        <!-- 别名处理 -->
        <property name="typeAliasesPackage" value="com.atguigu.mp.beans"></property>	
        <!-- 注入全局MP策略配置 -->
        <property name="globalConfig" ref="globalConfiguration"></property>
        <!-- 插件注册 -->
        <property name="plugins">
            <list>
                <!-- 注册分页插件 -->
                <bean class="com.baomidou.mybatisplus.plugins.PaginationInterceptor"></bean>
                <!-- 注册执行分析插件
    <bean class="com.baomidou.mybatisplus.plugins.SqlExplainInterceptor">
     <property name="stopProceed" value="true"></property>
    </bean>
     -->
                <!-- 注册性能分析插件 -->
                <bean class="com.baomidou.mybatisplus.plugins.PerformanceInterceptor">
                    <property name="format" value="true"></property>
                    <!-- <property name="maxTime" value="5"></property> -->
                </bean>
                <!-- 注册乐观锁插件 -->
                <bean 	                    class="com.baomidou.mybatisplus.plugins.OptimisticLockerInterceptor">
                </bean>
            </list>
        </property>
    </bean>

    <!-- 定义MybatisPlus的全局策略配置-->
    <bean id ="globalConfiguration" class="com.baomidou.mybatisplus.entity.GlobalConfiguration">
        <!-- 在2.3版本以后，dbColumnUnderline 默认值就是true -->
        <property name="dbColumnUnderline" value="true"></property>

        <!-- Mysql 全局的主键策略 -->
        <!-- <property name="idType" value="0"></property> -->
        <!-- Oracle全局主键策略 -->
        <property name="idType" value="1"></property>

        <!-- 全局的表前缀策略配置 -->
        <property name="tablePrefix" value="tbl_"></property>

        <!--注入自定义全局操作 
  <property name="sqlInjector" ref="mySqlInjector"></property>
   -->
        <!-- 注入逻辑删除 -->
        <property name="sqlInjector" ref="logicSqlInjector"></property>

        <!-- 注入逻辑删除全局值 -->
        <property name="logicDeleteValue" value = "-1"></property>
        <property name="logicNotDeleteValue" value="1"></property>

        <!-- 注入公共字段填充处理器 -->
        <property name="metaObjectHandler" ref="myMetaObjectHandler"></property>

        <!-- 注入Oracle主键Sequence -->
        <property name="keyGenerator" ref="oracleKeyGenerator"></property>
    </bean>

    <!-- 定义自定义注入器 -->
    <bean id="mySqlInjector" class="com.atguigu.mp.injector.MySqlInjector"></bean>
    <!-- 逻辑删除 -->
    <bean id="logicSqlInjector" class="com.baomidou.mybatisplus.mapper.LogicSqlInjector"></bean>
    <!-- 公共字段填充 处理器 -->
    <bean id="myMetaObjectHandler" class="com.atguigu.mp.metaObjectHandler.MyMetaObjectHandler"> </bean>

    <!-- 配置Oracle主键Sequence -->
    <bean id="oracleKeyGenerator" class="com.baomidou.mybatisplus.incrementer.OracleKeyGenerator"></bean>
    <!-- 
  配置mybatis 扫描mapper接口的路径
  -->
    <bean class="org.mybatis.spring.mapper.MapperScannerConfigurer">
        <property name="basePackage" value="com.atguigu.mp.mapper"></property>
    </bean>
</beans>
```

## **8.2** **自定义注入器的应用之 逻辑删除**

假删除、逻辑删除: 并不会真正的从数据库中将数据删除掉，而是将当前被删除的这条数据中的一个逻辑删除字段置为删除状态.

tbl_user logic_flag = 1 → -1 

1) com.baomidou.mybatisplus.mapper.LogicSqlInjector
2) logicDeleteValue 逻辑删除全局值
3) logicNotDeleteValue 逻辑未删除全局值
4) **在 POJO 的逻辑删除字段 添加 @TableLogic 注解**

5) **会在 mp 自带查询和更新方法的 sql 后面，追加『逻辑删除字段』=『LogicNotDeleteValue默认值』** 

删除方法: deleteById()和其他 delete 方法, **底层 SQL 调用的是 update tbl_xxx set 『逻辑删除字段』=『logicDeleteValue 默认值』**

# **第** **9** **章：公共字段自动填充**

## **9.1** **元数据处理器接口**

com.baomidou.mybatisplus.mapper.MetaObjectHandler

insertFill(MetaObject metaObject) 

updateFill(MetaObject metaObject)

metaobject: 元对象. 是 Mybatis 提供的一个用于更加方便，更加优雅的访问对象的属性，给对象的属性设置值 的一个对象. 还会用于包装对象. 支持对 Object 、Map、Collection等对象进行包装

本质上 metaObject 获取对象的属性值或者是给对象的属性设置值，最终是要通过 Reflector 获取到属性的对应方法的 Invoker, 最终 invoke.

## **9.2** **开发步骤**

1) 注解填充字段 @TableFile(fill = FieldFill.INSERT) 查看 FieldFill

2) 自定义公共字段填充处理器

```java
package com.atguigu.mp.metaObjectHandler;

import org.apache.ibatis.reflection.MetaObject;

import com.baomidou.mybatisplus.mapper.MetaObjectHandler;

/**
 * 自定义公共字段填充处理器
 */
public class MyMetaObjectHandler extends MetaObjectHandler {

    /**
	 * 插入操作 自动填充
	 */
    @Override
    public void insertFill(MetaObject metaObject) {
        //获取到需要被填充的字段的值
        Object fieldValue = getFieldValByName("name", metaObject);
        if(fieldValue == null) {
            System.out.println("*******插入操作 满足填充条件*********");
            setFieldValByName("name", "weiyunhui", metaObject);
        }
    }
    /**
	 * 修改操作自动填充
	 */
    @Override
    public void updateFill(MetaObject metaObject) {
        Object fieldValue = getFieldValByName("name", metaObject);
        if(fieldValue == null) {
            System.out.println("*******修改操作 满足填充条件*********");
            setFieldValByName("name", "weiyh", metaObject);
        }
    }
}

```

3) MP 全局注入自定义公共字段填充处理器

```xml
<!-- 公共字段填充 处理器 -->
<bean id="myMetaObjectHandler" class="com.atguigu.mp.metaObjectHandler.MyMetaObjectHandler"> </bean>
<!-- 注入公共字段填充处理器 -->
<property name="metaObjectHandler" ref="myMetaObjectHandler"></property>
```

# **第** **10** **章** **Oracle** **主键** **Sequence**

MySQL: 支持主键自增。 IdType.Auto

Oracle: 序列(Sequence)

1) 实体类配置主键 Sequence @KeySequence(value=”序列名”，clazz=xxx.class 主键属性类型)

2) 全局 MP 主键生成策略为 IdType.INPUT 

3) 全局 MP 中配置 Oracle 主键 Sequence

com.baomidou.mybatisplus.incrementer.OracleKeyGenerator

4) 可以将@keySequence 定义在父类中，可实现多个子类对应的多个表公用一个 Sequence

# **第** **11** **章** **Idea** **快速开发插件**

MybatisX 辅助 idea 快速开发插件，为效率而生.

可以实现 java 与 xml 跳转，根据 Mapper 接口中的方法自动生成 xml 结构.

官方安装： File -> Settings -> Plugins -> Browse Repositories.. 输入 mybatisx 安装下载

Jar 安装： File -> Settings -> Plugins -> Install plugin from disk.. 选中 mybatisx..jar 安装

