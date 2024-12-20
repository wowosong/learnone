# MyBatis

[TOC]

mybatis运行原理：
1.通过加载mybatis全局配置文件以及mapper映射文件初始化configuration对象和Executor对象（通过全局配置文件中的defaultExecutorType初始化）；

2.创建一个defaultSqlSession对象，将configuration对象和Executor对象注入给defaulSqlSession对象中；

3.defaulSqlSession通过getMapper()获取mapper接口的代理对象mapperProxy （mapperProxy中包含defaultSQLSession对象）

4.执行增删改查：
    1）通过defaulSqlSession中的属性Executor创建statementHandler对象；

​    2）创建statementHandler对象的同时也创建parameterHandler和resultSetHandler；

​    3） 通过parameterHandler设置预编译参数及参数值；

​    4）调用statementHandler执行增删改查；

​    5）通过resultsetHandler封装查询结果



## MyBatis接口式编程 Hello World

### 搭建环境

#### 搭建数据库MySQL

```sql
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `name` varchar(30) DEFAULT NULL,
    `pwd` varchar(30) DEFAULT NULL,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


INSERT INTO `user`(`name`, `pwd`) VALUES ('hong', '123456');
INSERT INTO `user`(`name`, `pwd`) VALUES ('Tom', '123456');
INSERT INTO `user`(`name`, `pwd`) VALUES ('Jerry', '123456');
```

#### Maven

```xml
<dependencies>
    <!-- MySQL驱动 -->
    <dependency>
        <groupId>mysql</groupId>
        <artifactId>mysql-connector-java</artifactId>
        <version>5.1.47</version>
    </dependency>
    <!-- MyBatis -->
    <dependency>
        <groupId>org.mybatis</groupId>
        <artifactId>mybatis</artifactId>
        <version>3.5.2</version>
    </dependency>
    <dependency>
        <groupId>org.projectlombok</groupId>
        <artifactId>lombok</artifactId>
        <version>1.18.18</version>
    </dependency>
    <!-- 日志 -->
    <dependency>
        <groupId>log4j</groupId>
        <artifactId>log4j</artifactId>
        <version>1.2.17</version>
    </dependency>

    <!-- Junit -->
    <dependency>
        <groupId>junit</groupId>
        <artifactId>junit</artifactId>
        <version>4.12</version>
    </dependency>
</dependencies>
```

#### jdbc.properties

```properties
driver=com.mysql.jdbc.Driver
url=jdbc:mysql://localhost:3306/mybatis?userSSL=true&amp;useUnicode=true&amp;characterEncoding=UTF-8
username=root
password=1234
```

#### log4j.properties

```properties
log4j.rootLogger=DEBUG,A1
log4j.appender.A1=org.apache.log4j.ConsoleAppender
log4j.appender.A1.layout=org.apache.log4j.PatternLayout
log4j.appender.A1.layout.ConversionPattern=[%t] [%c]-[%p] %m%n
```

### 编写代码

#### 实体类

```java
package org.hong.pojo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class User {
    private Integer id;
    private String name;
    private String pwd;
}
```



#### Mapper 接口

```java
package org.hong.mapper;

import org.hong.pojo.User;

import java.util.List;

public interface UserMapper {
    List<User> getAll();
}
```



#### Mapper.xml 文件

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper
        PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<!--
    namespace:名称空间, 对应接口的全类名
 -->
<mapper namespace="org.hong.mapper.UserMapper">
    <!--
        select: 配置查询
        id: 唯一标识, 对应接口中的方法名
        resultType: 返回值类型, 类的全类名, 如果返回值是集合写集合中泛型的类型
     -->
    <select id="getAll" resultType="org.hong.pojo.User">
        select * from user
    </select>
</mapper>
```

#### MyBatis 核心配置文件

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE configuration
        PUBLIC "-//mybatis.org//DTD Config 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-config.dtd">

<!-- configuration: 核心配置文件 -->
<configuration>
    <!-- 
  properties: 引入外部properties文件 必须放在最前面,否则会报错
   resource: 类路径下
   url: 磁盘路径或网络路径
   -->
    <properties resource="jdbc.properties"/>
    <!-- 设置日志输出, 方便观察sql语句和参数 -->
    <settings>
        <setting name="logImpl" value="LOG4J"/>
    </settings>
    <!--
        environments配置项目的运行环境, 可以配置多个
        default: 启用的环境
     -->
    <environments default="development">
        <environment id="development">
            <transactionManager type="JDBC"/>
            <dataSource type="POOLED">
                <!-- 数据库连接信息 -->
                <property name="driver" value="${driver}"/>
                <property name="url" value="${url}"/>
                <property name="username" value="${username}"/>
                <property name="password" value="${password}"/>
            </dataSource>
        </environment>
    </environments>
    <!-- 每一个Mapper.xml都需要在MyBatis核心配置文件中注册!!! -->
    <mappers>
        <mapper resource="org/hong/mapper/UserMapper.xml"/>
    </mappers>
</configuration>
```

### 测试用例

```java
package org.hong.test;

import org.apache.ibatis.io.Resources;
import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;
import org.apache.ibatis.session.SqlSessionFactoryBuilder;
import org.hong.mapper.UserMapper;
import org.hong.pojo.User;
import org.junit.Test;

import java.io.IOException;
import java.io.InputStream;
import java.util.List;

public class HelloTest {
    public SqlSessionFactory getSqlSessionFactory() throws IOException {
        // MyBatis全局配置文件路径
        String resource = "mybatis-config.xml";
        // 获取MyBatis全局配置文件的输入流
        InputStream is = Resources.getResourceAsStream(resource);
        // 获取SqlSessionFactory对象
        SqlSessionFactory factory = new SqlSessionFactoryBuilder().build(is);
        return factory;
    }

    @Test
    public void testHello() throws IOException {
        // 1、获取SqlSessionFactory对象
        SqlSessionFactory factory = getSqlSessionFactory();

        // 2、获取SqlSession对象
        SqlSession openSession = factory.openSession();
        try {
            // 3、获取接口的实现类对象
            // 会为接口自动创建代理对象, 代理对象去执行增删改查方法, sql语句会从mapper.xml中获取
            UserMapper mapper = openSession.getMapper(UserMapper.class);
            List<User> list = mapper.getAll();
            list.forEach(System.out::println);
        } finally {
            // 4、SqlSession代表和数据库的一次对话, 用完必须关闭
            openSession.close();
        }
    }
}
```

### 控制台打印

```shell
## 发送的sql语句就是我们在mapper.xml中配置的sql语句
[org.hong.mapper.UserMapper.getAll]-==>  Preparing: select * from user 
[org.hong.mapper.UserMapper.getAll]-==> Parameters: 
[org.hong.mapper.UserMapper.getAll]-<==      Total: 4
User(id=1, name=hong, pwd=123456)
User(id=2, name=Tom, pwd=123456)
User(id=3, name=Jerry, pwd=123456)
```

## CRUD 初体验

接着上面的来！！！

### MyBatisUtil 工具类

```java
package org.hong.util;

import org.apache.ibatis.io.Resources;
import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;
import org.apache.ibatis.session.SqlSessionFactoryBuilder;

import java.io.IOException;
import java.io.InputStream;

public class MyBatisUtil {

    private static SqlSessionFactory sqlSessionFactory;

    static {
        try {
            // 获取sqlSessionFactory对象
            String resource = "mybatis-config.xml";
            InputStream inputStream = Resources.getResourceAsStream(resource);
            sqlSessionFactory = new SqlSessionFactoryBuilder().build(inputStream);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    // 既然有了 SqlSessionFactory，顾名思义，我们可以从中获得 SqlSession 的实例。
    // SqlSession 提供了在数据库执行 SQL 命令所需的所有方法
    public static SqlSession getSqlSession(){
        // openSession(): 此方式打开SQL会话, 事务是开启状态
        // openSession(true): 此方式打开SQL会话, 事务是关闭状态
        return sqlSessionFactory.openSession();
    }

    public static SqlSessionFactory getSqlSessionFactory() {
        return sqlSessionFactory;
    }
}
```

### save

**接口方法**

```java
// 保存
int save(User user);
```

**方法映射**

```xml
<!--
    insert: 配置insert语句
        id: 对应的方法名
        parameterType: 指定参数类型为pojo, 可以直接写属性名获得属性值, 优先调用getting方法, 如果没				 有getting方法则直接从属性中取值
 -->
<insert id="save" parameterType="org.hong.pojo.User">
    insert into user(name, pwd) values(#{name}, #{pwd})
</insert>
```

**测试用例**

```java
@Test
public void save(){
    // 1.获取sqlSession对象
    SqlSession sqlSession = MyBatisUtil.getSqlSession();
    // 2.获取需要的mapper接口的代理对象
    UserMapper mapper = sqlSession.getMapper(UserMapper.class);
    // 3.调用对应的方法执行操作
    User user = new User();
    user.setName("SAVE");
    user.setPwd("123");
    int save = mapper.save(user);
    System.out.println(save);
    System.out.println(user);
    // 4.提交事务
    sqlSession.commit();
    // 5.关闭sqlSession
    sqlSession.close();
}
```

**控制台打印**

```shell
## 发送的sql语句
[main] [org.hong.mapper.UserMapper.save]-[DEBUG] ==>  Preparing: insert into user(name, pwd) values(?, ?) 
## 预编译放入的参数值, 从传入的pojo对象中取出对应的属性值
[main] [org.hong.mapper.UserMapper.save]-[DEBUG] ==> Parameters: SAVE(String), 123(String)
## 影响行数
[main] [org.hong.mapper.UserMapper.save]-[DEBUG] <==    Updates: 1
## 编写的save方法返回的值int类型, 意义是数据库影响行数
1
## 插入后的对象打印, id值并没有回填到对象中, 因为我们没有开启这个功能, 后面会说到
User(id=null, name=SAVE, pwd=123)
```



### get

**接口方法**

```java
// 根据id查询
User get(int id);
```

**方法映射**

```xml
<!-- 方法参数是int类型的, 所以没有写parameterType属性 -->
<select id="get" resultType="org.hong.pojo.User">
    <!-- 插入id值 -->
    select * from user where id = #{id}
</select>
```

**测试用例**

```java
@Test
public void get(){
    // 1.获取sqlSession对象
    SqlSession sqlSession = MyBatisUtil.getSqlSession();
    // 2.获取需要的mapper接口的代理对象
    UserMapper mapper = sqlSession.getMapper(UserMapper.class);
    // 3.调用对应的方法执行操作
    User user = mapper.get(1);
    System.out.println(user);
    // 4.提交事务
    sqlSession.commit();
    // 5.关闭sqlSession
    sqlSession.close();
}
```

**控制台打印**

```shell
[main] [org.hong.mapper.UserMapper.get]-[DEBUG] ==>  Preparing: select * from user where id = ? 
[main] [org.hong.mapper.UserMapper.get]-[DEBUG] ==> Parameters: 1(Integer)
[main] [org.hong.mapper.UserMapper.get]-[DEBUG] <==      Total: 1
User(id=1, name=hong, pwd=123456)
```



### update

**接口方法**

```java
// 修改
int update(User user);
```

**方法映射**

```xml
<update id="update" parameterType="org.hong.pojo.User">
    update user set name = #{name}, pwd = #{pwd} where id = #{id}
</update>
```

**测试用例**

```java
@Test
public void update(){
    // 1.获取sqlSession对象
    SqlSession sqlSession = MyBatisUtil.getSqlSession();
    // 2.获取需要的mapper接口的代理对象
    UserMapper mapper = sqlSession.getMapper(UserMapper.class);
    // 3.调用对应的方法执行操作
    User user = mapper.get(1);
    user.setName("谢禹宏");
    int update = mapper.update(user);
    System.out.println(user);
    // 4.提交事务
    sqlSession.commit();
    // 5.关闭sqlSession
    sqlSession.close();
}
```

**控制台打印**

```shell
## 查询sql
[main] [org.hong.mapper.UserMapper.get]-[DEBUG] ==>  Preparing: select * from user where id = ? 
[main] [org.hong.mapper.UserMapper.get]-[DEBUG] ==> Parameters: 1(Integer)
[main] [org.hong.mapper.UserMapper.get]-[DEBUG] <==      Total: 1
## 修改sql
[main] [org.hong.mapper.UserMapper.update]-[DEBUG] ==>  Preparing: update user set name = ?, pwd = ? where id = ? 
[main] [org.hong.mapper.UserMapper.update]-[DEBUG] ==> Parameters: (String), 123456(String), 1(Integer)
[main] [org.hong.mapper.UserMapper.update]-[DEBUG] <==    Updates: 1
User(id=1, name=谢禹宏, pwd=123456)
```



### delete

**接口方法**

```java
// 删除
boolean delete(int id);
```

**方法映射**

```xml
<delete id="delete">
    delete from user where id = #{id}
</delete>
```

**测试用例**

```java
@Test
public void delete(){
    // 1.获取sqlSession对象
    SqlSession sqlSession = MyBatisUtil.getSqlSession();
    // 2.获取需要的mapper接口的代理对象
    UserMapper mapper = sqlSession.getMapper(UserMapper.class);
    // 3.调用对应的方法执行操作
    boolean delete = mapper.delete(10);
    System.out.println(delete);
    // 4.提交事务
    sqlSession.commit();
    // 5.关闭sqlSession
    sqlSession.close();
}
```

**控制台打印**

```shell
[main] [org.hong.mapper.UserMapper.delete]-[DEBUG] ==>  Preparing: delete from user where id = ? 
[main] [org.hong.mapper.UserMapper.delete]-[DEBUG] ==> Parameters: 10(Integer)
[main] [org.hong.mapper.UserMapper.delete]-[DEBUG] <==    Updates: 0
## 因为我们删除一个不存在的数据, 影响行数为0, 所以MyBatis返回false
false
```



### 最终版

#### Mapper 接口

```java
package org.hong.mapper;

import org.hong.pojo.User;


public interface UserMapper {
    // 保存
    int save(User user);

    // 根据id查询
    User get(int id);

    // 修改
    int update(User user);

    // 删除
    boolean delete(int id);
}
```

#### Mapper.xml

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper
        PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-mapper.dtd">

<mapper namespace="org.hong.mapper.UserMapper">

    <!--
        insert: 配置insert语句
        id: 对应的方法名
        parameterType: 指定参数类型为pojo, 可以直接写属性名获得属性值, 优先调用getting方法, 如果没有getting方法则直接从属性中取值
     -->
    <insert id="save" parameterType="org.hong.pojo.User">
        insert into user(name, pwd) values(#{name}, #{pwd})
    </insert>
    <!-- 方法参数是int类型的, 所以没有写parameterType属性 -->
    <select id="get" resultType="org.hong.pojo.User">
        <!-- 插入id值 -->
        select * from user where id = #{id}
    </select>
    <update id="update" parameterType="org.hong.pojo.User">
        update user set name = #{name}, pwd = #{pwd} where id = #{id}
    </update>
    <delete id="delete">
        delete from user where id = #{id}
    </delete>
</mapper>
```

#### 测试用例

```java
package org.hong.test;

import org.apache.ibatis.session.SqlSession;
import org.hong.mapper.UserMapper;
import org.hong.pojo.User;
import org.hong.util.MyBatisUtil;
import org.junit.Test;

public class CRUDTest {
    @Test
    public void save(){
        // 1.获取sqlSession对象
        SqlSession sqlSession = MyBatisUtil.getSqlSession();
        // 2.获取需要的mapper接口的代理对象
        UserMapper mapper = sqlSession.getMapper(UserMapper.class);
        // 3.调用对应的方法执行操作
        User user = new User();
        user.setName("SAVE ID");
        user.setPwd("123");
        int save = mapper.save(user);
        System.out.println(save);
        System.out.println(user);
        // 4.提交事务
        sqlSession.commit();
        // 5.关闭sqlSession
        sqlSession.close();
    }

    @Test
    public void get(){
        // 1.获取sqlSession对象
        SqlSession sqlSession = MyBatisUtil.getSqlSession();
        // 2.获取需要的mapper接口的代理对象
        UserMapper mapper = sqlSession.getMapper(UserMapper.class);
        // 3.调用对应的方法执行操作
        User user = mapper.get(1);
        System.out.println(user);
        // 4.提交事务
        sqlSession.commit();
        // 5.关闭sqlSession
        sqlSession.close();
    }

    @Test
    public void update(){
        // 1.获取sqlSession对象
        SqlSession sqlSession = MyBatisUtil.getSqlSession();
        // 2.获取需要的mapper接口的代理对象
        UserMapper mapper = sqlSession.getMapper(UserMapper.class);
        // 3.调用对应的方法执行操作
        User user = mapper.get(1);
        user.setName("谢禹宏");
        int update = mapper.update(user);
        System.out.println(user);
        // 4.提交事务
        sqlSession.commit();
        // 5.关闭sqlSession
        sqlSession.close();
    }

    @Test
    public void delete(){
        // 1.获取sqlSession对象
        SqlSession sqlSession = MyBatisUtil.getSqlSession();
        // 2.获取需要的mapper接口的代理对象
        UserMapper mapper = sqlSession.getMapper(UserMapper.class);
        // 3.调用对应的方法执行操作
        boolean delete = mapper.delete(10);
        System.out.println(delete);
        // 4.提交事务
        sqlSession.commit();
        // 5.关闭sqlSession
        sqlSession.close();
    }
}
```

## save 回填主键值

在上面 save 的基础上进行更改

### 获取自增主键的值

**接口方法**

```java
// 保存
int save(User user);
```

**方法映射**

```xml
<!--
    useGeneratedKeys="true": 开启获取自增主键的策略
    keyColumn: 指定数据库主键的列名
    keyProperty: 指定对应的主键属性, ps(获取到主键值后, 将这个值封装给javaBean的哪个属性)
 -->
<insert id="save" parameterType="org.hong.pojo.User" useGeneratedKeys="true" keyColumn="id" keyProperty="id">
    insert into user(name, pwd) values(#{name}, #{pwd})
</insert>
```

**测试用例**

```java
@Test
public void save(){
    // 1.获取sqlSession对象
    SqlSession sqlSession = MyBatisUtil.getSqlSession();
    // 2.获取需要的mapper接口的代理对象
    UserMapper mapper = sqlSession.getMapper(UserMapper.class);
    // 3.调用对应的方法执行操作
    User user = new User();
    user.setName("SAVE ID");
    user.setPwd("123");
    int save = mapper.save(user);
    System.out.println(save);
    System.out.println(user);
    // 4.提交事务
    sqlSession.commit();
    // 5.关闭sqlSession
    sqlSession.close();
}
```

**控制台打印**

```shell
## 发送的sql语句
[main] [org.hong.mapper.UserMapper.save]-[DEBUG] ==>  Preparing: insert into user(name, pwd) values(?, ?) 
[main] [org.hong.mapper.UserMapper.save]-[DEBUG] ==> Parameters: SAVE ID(String), 123(String)
[main] [org.hong.mapper.UserMapper.save]-[DEBUG] <==    Updates: 1
1
## 主键回填到了对象中
User(id=4, name=SAVE ID, pwd=123)
```



### 获取Oracle序列的值

这里就不具体演示了，看不懂就算了，反正用的也不多。

```xml
<insert id="addEmp">
  <!-- selectKey: 配置查询主键的sql语句
            keyProperty:查出的主键值封装给javaBean的哪个属性
            order: 
                BEFORE:当前sql在插入sql之前运行
                AFTER:当前sql在插入sql之后运行
            resultType:查出的数据的返回值类型

            BEFORE运行顺序:
                先运行selectKey查询id的sql;查出id值封装给javaBean的id属性
                再运行插入的sql;就可以取出id属性对应的值
            AFTER运行顺序:
                先运行插入的sql（从序列中取出新值作为id）;
                再运行selectKey查询id的sql, 回填到javaBean的id属性中
  -->
    <selectKey keyProperty="id" order="BEFORE" resultType="Integer">
        <!-- 编写查询主键的sql语句 -->
        select EMPLOYEES_SEQ.nextval from dual 
    </selectKey>
    <!-- 插入时的主键是从序列中拿到的 -->
    <!-- BEFORE:-->
    insert into employees(EMPLOYEE_ID,LAST_NAME,EMAIL) 
    values(#{id},#{lastName},#{email}) 
</insert>
```

## 参数处理

### 单个参数

#{arg}: 直接取出参数值；只有一个参数时可以随便写

**接口方法**

```java
// 单个参数
User getOneParam(int id);
```

**方法映射**

```xml
<select id="getOneParam" resultType="org.hong.pojo.User">
    select * from user where id = #{user_id}
</select>
```

**测试用例**

```java
@Test
public void testOneParam(){
    // 1.获取sqlSession对象
    SqlSession sqlSession = MyBatisUtil.getSqlSession();
    // 2.获取需要的mapper接口的代理对象
    UserMapper mapper = sqlSession.getMapper(UserMapper.class);
    // 3.调用对应的方法执行操作
    User oneParam = mapper.getOneParam(1);
    System.out.println(oneParam);
    // 4.提交事务
    sqlSession.commit();
    // 5.关闭sqlSession
    sqlSession.close();
}
```

**控制台打印**

```shell
## 正常运行
[main] [org.hong.mapper.UserMapper.getOneParam]-[DEBUG] ==>  Preparing: select * from user where id = ? 
[main] [org.hong.mapper.UserMapper.getOneParam]-[DEBUG] ==> Parameters: 1(Integer)
[main] [org.hong.mapper.UserMapper.getOneParam]-[DEBUG] <==      Total: 1
User(id=1, name=谢禹宏, pwd=123456)
```



### 多个参数

MyBatis会做特殊处理，**多个参数会被封装成一个 `map`**

​	**key：**<span style='color:red'>`param1...paramN`</span> **or** <span style='color:red'>`arg0...argN-1 `</span>

​	**value：**传入的参数

**接口方法**

```java
// 多个参数
User getParams(String name, String pwd);
```

**方法映射**

```xml
<select id="getParams" resultType="org.hong.pojo.User">
    <!-- 
        参数name可以使用 #{arg0} 或 #{param1} 取出
        参数pwd可以使用 #{arg1} 或 #{param2} 取出
     -->
    select * from user where name = #{arg0} and pwd = #{param2}
</select>
```

**测试用例**

```java
@Test
public void testParams(){
    // 1.获取sqlSession对象
    SqlSession sqlSession = MyBatisUtil.getSqlSession();
    // 2.获取需要的mapper接口的代理对象
    UserMapper mapper = sqlSession.getMapper(UserMapper.class);
    // 3.调用对应的方法执行操作
    User user = mapper.getParams("Tom", "123456");
    System.out.println(user);
    // 4.提交事务
    sqlSession.commit();
    // 5.关闭sqlSession
    sqlSession.close();
}
```

**控制台打印**

```shell
## 正常运行
[main] [org.hong.mapper.UserMapper.getParams]-[DEBUG] ==>  Preparing: select * from user where name = ? and pwd = ? 
[main] [org.hong.mapper.UserMapper.getParams]-[DEBUG] ==> Parameters: Tom(String), 123456(String)
[main] [org.hong.mapper.UserMapper.getParams]-[DEBUG] <==      Total: 1
User(id=2, name=Tom, pwd=123456)
```



### 命名参数

<span style='color:red'>使用注解 `@Param` 指定参数的 `key`</span>

多个参数会被封装成一个map

​		**key：**<span style='color:red'>使用 `@param` 注解给参数多加一个 `key`</span>，原来的 `arg` 和 `param` 依旧能使用

​		**value：**参数值

**接口方法**

```java
// 命名参数
User getAnnoParam(@Param("name") String name, String pwd);
```

**方法映射**

```xml
<select id="getAnnoParam" resultType="org.hong.pojo.User">
    select * from user where name = #{name} and pwd = #{param2}
</select>
```

**测试用例**

```java
@Test
public void testAnnoParam(){
    // 1.获取sqlSession对象
    SqlSession sqlSession = MyBatisUtil.getSqlSession();
    // 2.获取需要的mapper接口的代理对象
    UserMapper mapper = sqlSession.getMapper(UserMapper.class);
    // 3.调用对应的方法执行操作
    User user = mapper.getAnnoParam("Tom", "123456");
    System.out.println(user);
    // 4.提交事务
    sqlSession.commit();
    // 5.关闭sqlSession
    sqlSession.close();
}
```

**控制台打印**

```shell
## 正常运行
[main] [org.hong.mapper.UserMapper.getAnnoParam]-[DEBUG] ==>  Preparing: select * from user where name = ? and pwd = ? 
[main] [org.hong.mapper.UserMapper.getAnnoParam]-[DEBUG] ==> Parameters: Tom(String), 123456(String)
[main] [org.hong.mapper.UserMapper.getAnnoParam]-[DEBUG] <==      Total: 1
User(id=2, name=Tom, pwd=123456)
```



### POJO

​	**多个参数正好是业务逻辑的数据模型(实体类),直接传入pojo(对象)**

​	#{属性名}: 取出传入的pojo对应属性的值

**接口方法**

```java
// pojo
int updatePojo(User user);
```

**方法映射**

```xml
<update id="updatePojo">
    update user set name = #{name}, pwd = #{pwd} where id = #{id}
</update>
```

**测试用例**

```java
@Test
public void testUpdatePojo(){
    // 1.获取sqlSession对象
    SqlSession sqlSession = MyBatisUtil.getSqlSession();
    // 2.获取需要的mapper接口的代理对象
    UserMapper mapper = sqlSession.getMapper(UserMapper.class);
    // 3.调用对应的方法执行操作
    User user = mapper.getOneParam(1);
    user.setPwd("654321");
    int i = mapper.updatePojo(user);
    System.out.println(i);
    // 4.提交事务
    sqlSession.commit();
    // 5.关闭sqlSession
    sqlSession.close();
}
```

**控制台打印**

```shell
## 正常运行
[main] [org.hong.mapper.UserMapper.getOneParam]-[DEBUG] ==>  Preparing: select * from user where id = ? 
[main] [org.hong.mapper.UserMapper.getOneParam]-[DEBUG] ==> Parameters: 1(Integer)
[main] [org.hong.mapper.UserMapper.getOneParam]-[DEBUG] <==      Total: 1
[main] [org.hong.mapper.UserMapper.updatePojo]-[DEBUG] ==>  Preparing: update user set name = ?, pwd = ? where id = ? 
[main] [org.hong.mapper.UserMapper.updatePojo]-[DEBUG] ==> Parameters: 谢禹宏(String), 654321(String), 1(Integer)
[main] [org.hong.mapper.UserMapper.updatePojo]-[DEBUG] <==    Updates: 1
1
```



### Map

**如果多个参数不是业务模型中的数据模型, 没有对应的pojo, 可以传入map**

​	\#{key}: 取出map中key对应的值

**接口方法**

```java
//map
User getMapParam(Map<String, Object> map);
```

**方法映射**

```xml
<select id="getMapParam" resultType="org.hong.pojo.User">
    select * from user where name = #{name} and pwd = #{pwd}
</select>
```

**测试用例**

```java
@Test
public void testMap(){
    // 1.获取sqlSession对象
    SqlSession sqlSession = MyBatisUtil.getSqlSession();
    // 2.获取需要的mapper接口的代理对象
    UserMapper mapper = sqlSession.getMapper(UserMapper.class);
    // 3.调用对应的方法执行操作
    Map<String, Object> map = new HashMap<>();
    map.put("name", "Tom");
    map.put("pwd", "123456");
    User mapParam = mapper.getMapParam(map);
    System.out.println(mapParam);
    // 4.提交事务
    sqlSession.commit();
    // 5.关闭sqlSession
    sqlSession.close();
}
```

**控制台打印**

```shell
## 正常运行
[main] [org.hong.mapper.UserMapper.getMapParam]-[DEBUG] ==>  Preparing: select * from user where name = ? and pwd = ? 
[main] [org.hong.mapper.UserMapper.getMapParam]-[DEBUG] ==> Parameters: Tom(String), 123456(String)
[main] [org.hong.mapper.UserMapper.getMapParam]-[DEBUG] <==      Total: 1
User(id=2, name=Tom, pwd=123456)
```



### TO

**多个参数不是业务模型中的数据, 但经常要使用,<span style='color:red'> 推荐编写TO(Transfer Object)数据传输对象, 就是再专门写个类</span>**



### #{} 和 ${} 的区别

`#{}是占位符，${}是拼接符。`

```xml
#{}是预编译处理，${}是字符串替换。
Mybatis 在处理#{}时，会将 sql 中的#{}替换为?号，调用 PreparedStatement 的set 方法来赋值。
Mybatis 在处理$ {}时，就是把${}替换成变量的值。
使用#{}可以有效的防止 SQL 注入，提高系统安全性。
```

**接口方法**

```java
// #{}和${}的区别
List<User> getOrderBy(String order);
```

**方法映射**

```xml
<!-- #{}和${}的区别 -->
<select id="getOrderBy" resultType="org.hong.pojo.User">
    select * from user order by id ${order}
</select>
```

**测试用例**

```java
@Test
public void test$(){
    // 1.获取sqlSession对象
    SqlSession sqlSession = MyBatisUtil.getSqlSession();
    // 2.获取需要的mapper接口的代理对象
    UserMapper mapper = sqlSession.getMapper(UserMapper.class);
    // 3.调用对应的方法执行操作
    List<User> desc = mapper.getOrderBy("desc");
    desc.forEach(System.out :: println);
    // 4.提交事务
    sqlSession.commit();
    // 5.关闭sqlSession
    sqlSession.close();
}
```

**控制台打印**

```shell
## 使用${}方式取值不会被预编译, 而是将${xxx}替换成对应的值, 再发送sql, 通常用来动态拼接sql, 比如排序
[main] [org.hong.mapper.UserMapper.getOrderBy]-[DEBUG] ==>  Preparing: select * from user order by id desc 
[main] [org.hong.mapper.UserMapper.getOrderBy]-[DEBUG] ==> Parameters: 
[main] [org.hong.mapper.UserMapper.getOrderBy]-[DEBUG] <==      Total: 5
User(id=5, name=SAVE ID, pwd=123)
User(id=4, name=SAVE ID, pwd=123)
User(id=3, name=Jerry, pwd=123456)
User(id=2, name=Tom, pwd=123456)
User(id=1, name=谢禹宏, pwd=987654)
```





### 最终版

#### Mapper 接口

```java
package org.hong.mapper;

import org.apache.ibatis.annotations.Param;
import org.hong.pojo.User;

import java.util.Map;


public interface UserMapper {
    // 单个参数
    User getOneParam(int id);

    // 多个参数
    User getParams(String name, String pwd);

    // 命名参数
    User getAnnoParam(@Param("name") String name, String pwd);

    // pojo
    int updatePojo(User user);

    //map
    User getMapParam(Map<String, Object> map);

    // #{}和${}的区别
    List<User> getOrderBy(String order);
}
```

#### Mapper.xml 文件

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper
        PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-mapper.dtd">

<mapper namespace="org.hong.mapper.UserMapper">
    <!-- 单个参数 -->
    <select id="getOneParam" resultType="org.hong.pojo.User">
        select * from user where id = #{user_id}
    </select>

    <!-- 多个参数 -->
    <select id="getParams" resultType="org.hong.pojo.User">
        <!--
            参数name可以使用 #{0} 或 #{param1} 取出
            参数pwd可以使用 #{1} 或 #{param2} 取出
         -->
        select * from user where name = #{arg0} and pwd = #{param2}
    </select>

    <!-- 命名参数 -->
    <select id="getAnnoParam" resultType="org.hong.pojo.User">
        select * from user where name = #{name} and pwd = #{param2}
    </select>

    <!-- pojo -->
    <update id="updatePojo">
        update user set name = #{name}, pwd = #{pwd} where id = #{id}
    </update>

    <!-- map -->
    <select id="getMapParam" resultType="org.hong.pojo.User">
        select * from user where name = #{name} and pwd = #{pwd}
    </select>

    <!-- #{}和${}的区别 -->
    <select id="getOrderBy" resultType="org.hong.pojo.User">
        select * from user order by id ${order}
    </select>
</mapper>
```

#### 测用例

```java
package org.hong.test;

import org.apache.ibatis.session.SqlSession;
import org.hong.mapper.UserMapper;
import org.hong.pojo.User;
import org.hong.util.MyBatisUtil;
import org.junit.Test;

import java.util.HashMap;
import java.util.Map;

public class CRUDTest {
    @Test
    public void testOneParam(){
        // 1.获取sqlSession对象
        SqlSession sqlSession = MyBatisUtil.getSqlSession();
        // 2.获取需要的mapper接口的代理对象
        UserMapper mapper = sqlSession.getMapper(UserMapper.class);
        // 3.调用对应的方法执行操作
        User oneParam = mapper.getOneParam(1);
        System.out.println(oneParam);
        // 4.提交事务
        sqlSession.commit();
        // 5.关闭sqlSession
        sqlSession.close();
    }

    @Test
    public void testParams(){
        // 1.获取sqlSession对象
        SqlSession sqlSession = MyBatisUtil.getSqlSession();
        // 2.获取需要的mapper接口的代理对象
        UserMapper mapper = sqlSession.getMapper(UserMapper.class);
        // 3.调用对应的方法执行操作
        User oneParam = mapper.getParams("Tom", "123456");
        System.out.println(oneParam);
        // 4.提交事务
        sqlSession.commit();
        // 5.关闭sqlSession
        sqlSession.close();
    }

    @Test
    public void testAnnoParam(){
        // 1.获取sqlSession对象
        SqlSession sqlSession = MyBatisUtil.getSqlSession();
        // 2.获取需要的mapper接口的代理对象
        UserMapper mapper = sqlSession.getMapper(UserMapper.class);
        // 3.调用对应的方法执行操作
        User user = mapper.getAnnoParam("Tom", "123456");
        System.out.println(user);
        // 4.提交事务
        sqlSession.commit();
        // 5.关闭sqlSession
        sqlSession.close();
    }

    @Test
    public void testUpdatePojo(){
        // 1.获取sqlSession对象
        SqlSession sqlSession = MyBatisUtil.getSqlSession();
        // 2.获取需要的mapper接口的代理对象
        UserMapper mapper = sqlSession.getMapper(UserMapper.class);
        // 3.调用对应的方法执行操作
        User user = mapper.getOneParam(1);
        user.setPwd("654321");
        int i = mapper.updatePojo(user);
        System.out.println(i);
        // 4.提交事务
        sqlSession.commit();
        // 5.关闭sqlSession
        sqlSession.close();
    }

    @Test
    public void testMap(){
        // 1.获取sqlSession对象
        SqlSession sqlSession = MyBatisUtil.getSqlSession();
        // 2.获取需要的mapper接口的代理对象
        UserMapper mapper = sqlSession.getMapper(UserMapper.class);
        // 3.调用对应的方法执行操作
        Map<String, Object> map = new HashMap<>();
        map.put("name", "Tom");
        map.put("pwd", "123456");
        User mapParam = mapper.getMapParam(map);
        System.out.println(mapParam);
        // 4.提交事务
        sqlSession.commit();
        // 5.关闭sqlSession
        sqlSession.close();
    }

    @Test
    public void test$(){
        // 1.获取sqlSession对象
        SqlSession sqlSession = MyBatisUtil.getSqlSession();
        // 2.获取需要的mapper接口的代理对象
        UserMapper mapper = sqlSession.getMapper(UserMapper.class);
        // 3.调用对应的方法执行操作
        List<User> desc = mapper.getOrderBy("desc");
        desc.forEach(System.out :: println);
        // 4.提交事务
        sqlSession.commit();
        // 5.关闭sqlSession
        sqlSession.close();
    }
}
```



### 总结

```java
public User getEmp(@Param("id")Integer id, Strig name);
// 取值: id-->#{id|param1}		name-->#{param2}

public User getEmp(Integer id, @Param("e")Emp emp);
// 取值: id-->#{param1} 	name-->#{param2.name|e.name}

public User getEmpById(List<Integer> ids);
/*
	##特别注意: 
		如果是Collection(List, Set) or Array, 也会特殊处理, 把传入的list或数组封装在map中。
		Key: Collection(collection) | List(list) | Array(array) | Set(set)
			取值: 取出第一个id的值: #{list[0]}
	*/
```





## 返回List和Map

### List

**接口方法**

```java
// 返回List集合
List<User> getList();
```

**方法映射**

```xml
<!-- resultType: 如果返回的是一个集合, 要写集合中元素的类型 -->
<select id="getList" resultType="org.hong.pojo.User">
    select * from user
</select>
```

**测试用例**

```java
@Test
public void testList(){
    // 1.获取sqlSession对象
    SqlSession sqlSession = MyBatisUtil.getSqlSession();
    // 2.获取需要的mapper接口的代理对象
    UserMapper mapper = sqlSession.getMapper(UserMapper.class);
    // 3.调用对应的方法执行操作
    List<User> list = mapper.getList();
    list.forEach(System.out :: println);
    // 4.提交事务
    sqlSession.commit();
    // 5.关闭sqlSession
    sqlSession.close();
}
```

**控制台打印**

```shell
## 正常运行
[main] [org.hong.mapper.UserMapper.getList]-[DEBUG] ==>  Preparing: select * from user 
[main] [org.hong.mapper.UserMapper.getList]-[DEBUG] ==> Parameters: 
[main] [org.hong.mapper.UserMapper.getList]-[DEBUG] <==      Total: 4
User(id=1, name=谢禹宏, pwd=654321)
User(id=2, name=Tom, pwd=123456)
User(id=3, name=Jerry, pwd=123456)
User(id=4, name=SAVE ID, pwd=123)
```



### Map

#### key -> 列名		value -> 列值

**接口方法**

```java
// 返回Map集合, key -> 列名、value -> 列值
Map<String, Object> getMapColumnToValue(int id);
```

**方法映射**

```xml
<!-- resultType: key->列名、value->列值, 写Map的全类名 -->
<select id="getMapColumnToValue" resultType="java.util.Map">
    select * from user where id = #{id}
</select>
```

**测试用例**

```java
@Test
public void testMapColumnToValue(){
    // 1.获取sqlSession对象
    SqlSession sqlSession = MyBatisUtil.getSqlSession();
    // 2.获取需要的mapper接口的代理对象
    UserMapper mapper = sqlSession.getMapper(UserMapper.class);
    // 3.调用对应的方法执行操作
    Map<String, Object> mapColumnToValue = mapper.getMapColumnToValue(1);
    mapColumnToValue.forEach((key, value) -> System.out.println(key + "->" + value));
    // 4.提交事务
    sqlSession.commit();
    // 5.关闭sqlSession
    sqlSession.close();
}
```

**控制台打印**

```shell
 ## 正常运行
[main] [org.hong.mapper.UserMapper.getMapColumnToValue]-[DEBUG] ==>  Preparing: select * from user where id = ? 
[main] [org.hong.mapper.UserMapper.getMapColumnToValue]-[DEBUG] ==> Parameters: 1(Integer)
[main] [org.hong.mapper.UserMapper.getMapColumnToValue]-[DEBUG] <==      Total: 1
name->谢禹宏
id->1
pwd->654321
```



#### key -> 主键		value -> 实体对象

**接口方法**

```java
// 返回Map集合, key -> 主键值、value -> 对应的实体对象
@MapKey("id")
Map<Integer, User> getMapPrimayToEntity();
```

**方法映射**

```xml
<!-- resultType: key->主键、value->实体对象, 写实体对象的全类名 -->
<select id="getMapPrimayToEntity" resultType="org.hong.pojo.User">
    select * from user
</select>
```

**测试用例**

```java
@Test
public void testMapPrimayToEntity(){
    // 1.获取sqlSession对象
    SqlSession sqlSession = MyBatisUtil.getSqlSession();
    // 2.获取需要的mapper接口的代理对象
    UserMapper mapper = sqlSession.getMapper(UserMapper.class);
    // 3.调用对应的方法执行操作
    Map<Integer, User> mapPrimayToEntity = mapper.getMapPrimayToEntity();
    mapPrimayToEntity.forEach((key, value) -> System.out.println(key + "->" + value));
    // 4.提交事务
    sqlSession.commit();
    // 5.关闭sqlSession
    sqlSession.close();
}
```

**控制台打印**

```shell
 ## 正常运行
[main] [org.hong.mapper.UserMapper.getMapPrimayToEntity]-[DEBUG] ==>  Preparing: select * from user 
[main] [org.hong.mapper.UserMapper.getMapPrimayToEntity]-[DEBUG] ==> Parameters: 
[main] [org.hong.mapper.UserMapper.getMapPrimayToEntity]-[DEBUG] <==      Total: 4
1->User(id=1, name=谢禹宏, pwd=654321)
2->User(id=2, name=Tom, pwd=123456)
3->User(id=3, name=Jerry, pwd=123456)
4->User(id=4, name=SAVE ID, pwd=123)
```



### 最终版

#### Mapper 接口

```java
package org.hong.mapper;

import org.apache.ibatis.annotations.MapKey;
import org.hong.pojo.User;

import java.util.List;
import java.util.Map;


public interface UserMapper {
    // 返回List集合
    List<User> getList();

    // 返回Map集合, key -> 列名、value -> 列值
    Map<String, Object> getMapColumnToValue(int id);

    // 返回Map集合, key -> 主键值、value -> 对应的实体对象
    @MapKey("id") // 告诉MyBatis封装Map的时候使用实体类的哪个属性作为map的key
    Map<Integer, User> getMapPrimayToEntity();
}
```

#### Mapper.xml 文件

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper
        PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-mapper.dtd">

<mapper namespace="org.hong.mapper.UserMapper">

    <!-- resultType: 如果返回的是一个集合, 要写集合中元素的类型 -->
    <select id="getList" resultType="org.hong.pojo.User">
        select * from user
    </select>

    <!-- resultType: key->列名、value->列值, 写Map的全类名 -->
    <select id="getMapColumnToValue" resultType="java.util.Map">
        select * from user where id = #{id}
    </select>

    <!-- resultType: key->主键、value->实体对象, 写实体对象的全类名 -->
    <select id="getMapPrimayToEntity" resultType="org.hong.pojo.User">
        select * from user
    </select>

</mapper>
```

#### 测试用例

```java
package org.hong.test;

import org.apache.ibatis.session.SqlSession;
import org.hong.mapper.UserMapper;
import org.hong.pojo.User;
import org.hong.util.MyBatisUtil;
import org.junit.Test;

import java.util.List;
import java.util.Map;

public class ResultTypeTest {
    @Test
    public void testList(){
        // 1.获取sqlSession对象
        SqlSession sqlSession = MyBatisUtil.getSqlSession();
        // 2.获取需要的mapper接口的代理对象
        UserMapper mapper = sqlSession.getMapper(UserMapper.class);
        // 3.调用对应的方法执行操作
        List<User> list = mapper.getList();
        list.forEach(System.out :: println);
        // 4.提交事务
        sqlSession.commit();
        // 5.关闭sqlSession
        sqlSession.close();
    }

    @Test
    public void testMapColumnToValue(){
        // 1.获取sqlSession对象
        SqlSession sqlSession = MyBatisUtil.getSqlSession();
        // 2.获取需要的mapper接口的代理对象
        UserMapper mapper = sqlSession.getMapper(UserMapper.class);
        // 3.调用对应的方法执行操作
        Map<String, Object> mapColumnToValue = mapper.getMapColumnToValue(1);
        mapColumnToValue.forEach((key, value) -> System.out.println(key + "->" + value));
        // 4.提交事务
        sqlSession.commit();
        // 5.关闭sqlSession
        sqlSession.close();
    }

    @Test
    public void testMapPrimayToEntity(){
        // 1.获取sqlSession对象
        SqlSession sqlSession = MyBatisUtil.getSqlSession();
        // 2.获取需要的mapper接口的代理对象
        UserMapper mapper = sqlSession.getMapper(UserMapper.class);
        // 3.调用对应的方法执行操作
        Map<Integer, User> mapPrimayToEntity = mapper.getMapPrimayToEntity();
        mapPrimayToEntity.forEach((key, value) -> System.out.println(key + "->" + value));
        // 4.提交事务
        sqlSession.commit();
        // 5.关闭sqlSession
        sqlSession.close();
    }
}
```





## 配置解析

### 核心配置文件 （mybatis-config.xml）

MyBatis的配置文件包含了影响MyBatis行为的设置和属性信息

```properties
configuration（配置）
properties（属性）
settings（设置）
typeAliases（类型别名）
typeHandlers（类型处理器）
objectFactory（对象工厂）
plugins（插件）
environments（环境配置）
environment（环境变量）
transactionManager（事务管理器）
dataSource（数据源）
databaseIdProvider（数据库厂商标识）
mappers（映射器）
```



### 环境配置（environments）

MyBatis 可以配置成适应多种环境

**不过要记住：尽管可以配置多个环境，但每个 SqlSessionFactory 实例只能选择一种环境。**

学会使用配置多套运行环境

MyBatis 默认的事务管理器就是JDBC，连接池：POOLED

```xml
<!-- default: 表示使用哪种环境 -->
<environments default="test">
    <!-- MySql环境 -->
    <environment id="mysql">
        <transactionManager type="JDBC"/>
        <dataSource type="POOLED">
            <property name="driver" value="com.mysql.jdbc.Driver"/>
            <property name="url" value="jdbc:mysql://localhost:3306/mybatis?userSSL=true&amp;useUnicode=true&amp;characterEncoding=UTF-8"/>
            <property name="username" value="root"/>
            <property name="password" value="1234"/>
        </dataSource>
    </environment>
    <!-- Oracle环境 -->
    <environment id="oracle环境">
        <transactionManager type="JDBC"/>
        <dataSource type="POOLED">
            <property name="driver" value="Driver: com.ibm.db2.jdbc.app.DB2Driver"/>
            <property name="url" value="jdbc:db2://localhost:5000/orcl"/>
            <property name="username" value="scott"/>
            <property name="password" value="ccat"/>
        </dataSource>
    </environment>
</environments>
```



### 属性（properties）

我们可以通过properties属性来实现引用配置文件

这些属性可以在外部进行配置，并可以进行动态替换。你既可以在典型的 Java 属性文件中配置这些属性，也可以在 properties 元素的子元素中设置。（db.properties）

**编写一个 properties 配置文件**

```properties
driver=com.mysql.jdbc.Driver
url=jdbc:mysql://localhost:3306/mybatis?userSSL=true&amp;useUnicode=true&amp;characterEncoding=UTF-8
username=root
password=1234
```

**在核心配置文件中引入**

```xml
<!-- 
	引入外部配置文件
	首先读取在 properties 元素体内指定的属性。
	然后根据 properties 元素中的 resource 属性读取类路径下属性文件，或根据 url 属性指定的路径读取属性文件，并覆盖之前读取过的同名属性。
-->
<properties resource="db.properties">
    <property name="username" value="root"/>
</properties>
```

**使用**

```xml
<environments default="development">
    <environment id="development">
        <transactionManager type="JDBC"/>
        <dataSource type="POOLED">
            <property name="driver" value="${driver}"/>
            <property name="url" value="${url}"/>
            <property name="username" value="${username}"/>
            <property name="password" value="${password}"/>
        </dataSource>
    </environment>
</environments>
```



### 类型别名（typeAliases）

- 类型别名可为 Java 类型设置一个缩写名字。存在的意义仅在于用来**降低冗余的全限定类名书写**

- **MyBatis中的别名是不区分大小写的**

    ```xml
    <!-- 可以给实体类起别名 -->
    <typeAliases>
        <typeAlias type="pojo.User" alias="User"/>
    </typeAliases>
    ```

- 也可以指定一个包名，MyBatis 会在包名下面搜索需要的 Java Bean

    每一个在包 `org.hong.pojo` 中的 Java Bean，在**没有注解**的情况下，会使用 **Bean 的首字母小写的非限定类名来作为它的别名**，比如 `org.hong.pojo.User` 的别名为 `user`

    ```xml
    <typeAliases>
        <package name="org.hong.pojo"/>
    </typeAliases>
    ```

- 若有注解，则别名为其注解值。通常用来解决不同包中相同类名的别名冲突

    ```java
    @Alias("author")
    public class Author {
        ...
    }
    ```

下面是一些为常见的 Java 类型内建的类型别名。它们都是不区分大小写的，

注意，为了应对原始类型的命名重复，采取了特殊的命名风格。

| 别名         | 映射的类型  |
| :----------- | :---------- |
| _byte        | byte        |
| _long        | long        |
| _short       | short       |
| **_int**     | **int**     |
| **_integer** | **int**     |
| _double      | double      |
| _float       | float       |
| _boolean     | boolean     |
| string       | String      |
| byte         | Byte        |
| long         | Long        |
| short        | Short       |
| **int**      | **Integer** |
| **integer**  | **Integer** |
| double       | Double      |
| float        | Float       |
| boolean      | Boolean     |
| date         | Date        |
| decimal      | BigDecimal  |
| bigdecimal   | BigDecimal  |
| object       | Object      |
| map          | Map         |
| hashmap      | HashMap     |
| list         | List        |
| arraylist    | ArrayList   |
| collection   | Collection  |
| iterator     | Iterator    |



### 设置（settings）

| 设置名                   | 描述                                                         | 有效值                                                       | 默认值                                       |
| :----------------------- | :----------------------------------------------------------- | :----------------------------------------------------------- | :------------------------------------------- |
| cacheEnabled             | 全局性地开启或关闭所有映射器配置文件中已配置的任何缓存。     | true \| false                                                | true                                         |
| lazyLoadingEnabled       | 延迟加载的全局开关。当开启时，所有关联对象都会延迟加载。 特定关联关系中可通过设置 `fetchType` 属性来覆盖该项的开关状态。 | true \| false                                                | false                                        |
| aggressiveLazyLoading    | 开启时，任一方法的调用都会加载该对象的所有延迟加载属性。 否则，每个延迟加载属性会按需加载（参考 `lazyLoadTriggerMethods`)。 | true \| false                                                | false （在 3.4.1 及之前的版本中默认为 true） |
| mapUnderscoreToCamelCase | 是否开启驼峰命名自动映射，即从经典数据库列名 A_COLUMN 映射到经典 Java 属性名 aColumn。 | true \| false                                                | false                                        |
| logImpl                  | 指定 MyBatis 所用日志的具体实现，未指定时将自动查找。        | SLF4J \| LOG4J \| LOG4J2 \| JDK_LOGGING \| COMMONS_LOGGING \| STDOUT_LOGGING \| NO_LOGGING | 未设置                                       |

```xml
<settings>
    <!-- 开启驼峰命名 -->
    <setting name="mapUnderscoreToCamelCase" value="true"/>
</settings>
```



### 映射器（mappers）

**方式一**

```xml
<!-- 使用相对于类路径的资源引用 -->
<mappers>
  <mapper resource="org/hong/mapper/UserMapper.xml"/>
</mappers>
```

**方式二**

```xml
<!-- 使用映射器接口实现类的完全限定类名 -->
<mappers>
  <mapper class="org.hong.mapper.UserMapper"/>
</mappers>
```

**方式三**

```xml
<!-- 将包内的映射器接口实现全部注册为映射器 -->
<mappers>
  <package name="org.hong.mapper"/>
</mappers>
```

方式二&方式三的**注意点**：

- 接口和对应的Mapper配置文件**必须同名**
- 接口和对应的Mapper配置文件**编译后必须在同一个文件夹下**
    1. 可以把接口和对应的Mapper**创建在同一个包下**
    2. 可以在**resources文件加中创建和接口相同层数并且名称相同的包，然后创建接口对应的Mapper**



### 生命周期和作用域

生命周期和作用域，是至关重要的，因为错误的使用会导致非常严重的**并发问题**

#### SqlSessionFactoryBuilder

- 一旦创建了 SqlSessionFactory，就不再需要它了。 因此 SqlSessionFactoryBuilder 实例的最佳作用域是方法作用域（**局部变量**）。

    

#### SqlSessionFactory

- 可以想象为数据库连接池
- SqlSessionFactory 一旦被创建就应该在应用的运行期间一直存在，**没有任何理由丢弃它或重新创建另一个实例。**
- 因此 SqlSessionFactory 的最佳作用域是应用作用域（**Application**）。
- 最简单的就是使用**单例模式**或者静态单例模式。



#### SqlSession

- 想象为连接到连接池的一个请求
- SqlSession 的实例不是线程安全的，因此是不能被共享的，所以它的最佳的作用域是请求或方法作用域
- 用完之后需要马上关闭，否则会导致资源被占用





## 日志

### 日志工厂

如果一个数据库操作出现了异常，我们需要排错。日志就是最好的助手！！！

曾经：sout，Debug

现在：日志工厂！

|         |                                                       |                                                              |        |
| ------- | ----------------------------------------------------- | ------------------------------------------------------------ | ------ |
| logImpl | 指定 MyBatis 所用日志的具体实现，未指定时将自动查找。 | SLF4J \| LOG4J \| LOG4J2 \| JDK_LOGGING \| COMMONS_LOGGING \| STDOUT_LOGGING \| NO_LOGGING | 未设置 |

- SLF4J 
- **LOG4J  【掌握】**
- LOG4J2 
- JDK_LOGGING 
- COMMONS_LOGGING 
- **STDOUT_LOGGING  【掌握】**
- NO_LOGGING

在MyBatis中具体使用那个日志实现，在设置中设定！



### STDOUT_LOGGING（标准日志输出）

在mybatis核心配置文件中，配置我们的日志

```xml
<settings>
    <setting name="logImpl" value="STDOUT_LOGGING"/>
</settings>
```

```xml
<!-- 日志的重点部分 -->
Opening JDBC Connection
Created connection 1205555397.
Setting autocommit to false on JDBC Connection [com.mysql.jdbc.JDBC4Connection@47db50c5]
==>  Preparing: select * from User 
==> Parameters: 
<==    Columns: id, name, pwd
<==        Row: 1, 张三, 123456
<==      Total: 1
User{id=1, name='张三', password='123456'}
Resetting autocommit to true on JDBC Connection [com.mysql.jdbc.JDBC4Connection@47db50c5]
Closing JDBC Connection [com.mysql.jdbc.JDBC4Connection@47db50c5]
Returned connection 1205555397 to pool.
```



### LOG4J 

什么是log4j？

- Log4j是Apache的一个[开放源代码](https://baike.sogou.com/lemma/ShowInnerLink.htm?lemmaId=269184&ss_c=ssc.citiao.link)项目，通过使用Log4j，我们可以控制日志信息输送的目的地是控制台、文件、GUI组件
- 我们也可以控制每一条日志的输出格式。
- 通过定义每一条日志信息的级别，我们能够更加细致地控制日志的生成过程。
- 通过一个配置文件来灵活地进行配置，而不需要修改应用的代码。

1. 先导入log4j的jar包

    ```xml
    <dependencies>
        <dependency>
            <groupId>log4j</groupId>
            <artifactId>log4j</artifactId>
            <version>1.2.17</version>
        </dependency>
    </dependencies>
    ```

2. log4j.properties

    ```properties
    #将等级为DEBUG的日志信息输出到console和file这两个目的地，console和file的定义在下面的代码
    log4j.rootLogger=DEBUG,console,file
    
    #控制台输出的相关设置
    log4j.appender.console = org.apache.log4j.ConsoleAppender
    log4j.appender.console.Target = System.out
    log4j.appender.console.Threshold=DEBUG
    log4j.appender.console.layout = org.apache.log4j.PatternLayout
    log4j.appender.console.layout.ConversionPattern=[%c]-%m%n
    
    #文件输出的相关设置
    log4j.appender.file = org.apache.log4j.RollingFileAppender
    log4j.appender.file.File=./log/hong.log
    log4j.appender.file.MaxFileSize=10mb
    log4j.appender.file.Threshold=DEBUG
    log4j.appender.file.layout=org.apache.log4j.PatternLayout
    log4j.appender.file.layout.ConversionPattern=[%p][%d{yy-MM-dd}][%c]%m%n
    
    #日志输出级别
    log4j.logger.org.mybatis=DEBUG
    log4j.logger.java.sql=DEBUG
    log4j.logger.java.sql.Statement=DEBUG
    log4j.logger.java.sql.ResultSet=DEBUG
    log4j.logger.java.sql.PreparedStatement=DEBUG
    ```

3. 配置log4j为日志的实现

    ```xml
    <settings>
        <setting name="logImpl" value="LOG4J"></setting>
    </settings>
    ```

4. Log4j的使用！，直接运行测试查询



**简单使用**

1. 在要使用Log4j的类中，导入包 import org.apache.log4j.Logger;

2. 日志对象，参数为当前类的class

    ```java
    static Logger logger = Logger.getLogger(UserMapperTest.class);
    ```

3. 日志级别

    ```java
    logger.info("info:进入了testLog4j");
    logger.debug("debug:进入了testLog4j");
    logger.error("error:进入了testLog4j");
    ```

    



## 注解开发

**简单的sql语句使用注解，复杂的sql语句和结果集映射使用xml配置文件**

### save

**接口方法**

```java
@Insert("insert into user(name, pwd) values(#{name}, #{pwd})")
int save(User user);
```

**测试用例**

```java
@Test
public void save(){
    // 1.获取sqlSession对象
    SqlSession sqlSession = MyBatisUtil.getSqlSession();
    // 2.获取需要的mapper接口的代理对象
    UserMapper mapper = sqlSession.getMapper(UserMapper.class);
    // 3.调用对应的方法执行操作
    User user = new User();
    user.setName("SAVE ID");
    user.setPwd("123");
    int save = mapper.save(user);
    System.out.println(save);
    System.out.println(user);
    // 4.提交事务
    sqlSession.commit();
    // 5.关闭sqlSession
    sqlSession.close();
}
```

**控制台打印**

```shell
[main] [org.hong.mapper.UserMapper.save]-[DEBUG] ==>  Preparing: insert into user(name, pwd) values(?, ?) 
[main] [org.hong.mapper.UserMapper.save]-[DEBUG] ==> Parameters: SAVE ID(String), 123(String)
[main] [org.hong.mapper.UserMapper.save]-[DEBUG] <==    Updates: 1
1
User(id=null, name=SAVE ID, pwd=123)
```



### select

**接口方法**

```java
@Select("select * from user where id = #{id}")
User get(int id);
```

**测试用例**

```java
@Test
public void get(){
    // 1.获取sqlSession对象
    SqlSession sqlSession = MyBatisUtil.getSqlSession();
    // 2.获取需要的mapper接口的代理对象
    UserMapper mapper = sqlSession.getMapper(UserMapper.class);
    // 3.调用对应的方法执行操作
    User user = mapper.get(1);
    System.out.println(user);
    // 4.提交事务
    sqlSession.commit();
    // 5.关闭sqlSession
    sqlSession.close();
}
```

**控制台打印**

```shell
[main] [org.hong.mapper.UserMapper.get]-[DEBUG] ==>  Preparing: select * from user where id = ? 
[main] [org.hong.mapper.UserMapper.get]-[DEBUG] ==> Parameters: 1(Integer)
[main] [org.hong.mapper.UserMapper.get]-[DEBUG] <==      Total: 1
User(id=1, name=谢禹宏, pwd=654321)
```



### update

**接口方法**

```java
@Update("update user set name = #{name}, pwd = #{pwd} where id = #{id}")
int update(User user);
```

**测试用例**

```java
@Test
public void update(){
    // 1.获取sqlSession对象
    SqlSession sqlSession = MyBatisUtil.getSqlSession();
    // 2.获取需要的mapper接口的代理对象
    UserMapper mapper = sqlSession.getMapper(UserMapper.class);
    // 3.调用对应的方法执行操作
    User user = mapper.get(1);
    user.setPwd("987654");
    int update = mapper.update(user);
    System.out.println(user);
    // 4.提交事务
    sqlSession.commit();
    // 5.关闭sqlSession
    sqlSession.close();
}
```

**控制台打印**

```shell
[main] [org.hong.mapper.UserMapper.get]-[DEBUG] ==>  Preparing: select * from user where id = ? 
[main] [org.hong.mapper.UserMapper.get]-[DEBUG] ==> Parameters: 1(Integer)
[main] [org.hong.mapper.UserMapper.get]-[DEBUG] <==      Total: 1
[main] [org.hong.mapper.UserMapper.update]-[DEBUG] ==>  Preparing: update user set name = ?, pwd = ? where id = ? 
[main] [org.hong.mapper.UserMapper.update]-[DEBUG] ==> Parameters: 谢禹宏(String), 987654(String), 1(Integer)
[main] [org.hong.mapper.UserMapper.update]-[DEBUG] <==    Updates: 1
User(id=1, name=谢禹宏, pwd=987654)
```



### delete

**接口方法**

```java
@Delete("delete from user where id = #{id}")
int delete(int id);
```

**测试用例**

```java
@Test
public void delete(){
    // 1.获取sqlSession对象
    SqlSession sqlSession = MyBatisUtil.getSqlSession();
    // 2.获取需要的mapper接口的代理对象
    UserMapper mapper = sqlSession.getMapper(UserMapper.class);
    // 3.调用对应的方法执行操作
    int delete = mapper.delete(10);
    System.out.println(delete);
    // 4.提交事务
    sqlSession.commit();
    // 5.关闭sqlSession
    sqlSession.close();
}
```

**控制台打印**

```shell
[main] [org.hong.mapper.UserMapper.delete]-[DEBUG] ==>  Preparing: delete from user where id = ? 
[main] [org.hong.mapper.UserMapper.delete]-[DEBUG] ==> Parameters: 10(Integer)
[main] [org.hong.mapper.UserMapper.delete]-[DEBUG] <==    Updates:
0
```

### 最终版

#### Mapper 接口

```java
package org.hong.mapper;

import org.apache.ibatis.annotations.Delete;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;
import org.hong.pojo.User;

import java.util.List;


public interface UserMapper {
    @Insert("insert into user(name, pwd) values(#{name}, #{pwd})")
    int save(User user);

    @Select("select * from user where id = #{id}")
    User get(int id);

    @Update("update user set name = #{name}, pwd = #{pwd} where id = #{id}")
    int update(User user);

    @Delete("delete from user where id = #{id}")
    int delete(int id);
}
```

#### 测试用例

```java
package org.hong.test;

import org.apache.ibatis.session.SqlSession;
import org.hong.mapper.UserMapper;
import org.hong.pojo.User;
import org.hong.util.MyBatisUtil;
import org.junit.Test;

public class AnnotationTest {
    @Test
    public void save(){
        // 1.获取sqlSession对象
        SqlSession sqlSession = MyBatisUtil.getSqlSession();
        // 2.获取需要的mapper接口的代理对象
        UserMapper mapper = sqlSession.getMapper(UserMapper.class);
        // 3.调用对应的方法执行操作
        User user = new User();
        user.setName("SAVE ID");
        user.setPwd("123");
        int save = mapper.save(user);
        System.out.println(save);
        System.out.println(user);
        // 4.提交事务
        sqlSession.commit();
        // 5.关闭sqlSession
        sqlSession.close();
    }

    @Test
    public void get(){
        // 1.获取sqlSession对象
        SqlSession sqlSession = MyBatisUtil.getSqlSession();
        // 2.获取需要的mapper接口的代理对象
        UserMapper mapper = sqlSession.getMapper(UserMapper.class);
        // 3.调用对应的方法执行操作
        User user = mapper.get(1);
        System.out.println(user);
        // 4.提交事务
        sqlSession.commit();
        // 5.关闭sqlSession
        sqlSession.close();
    }

    @Test
    public void update(){
        // 1.获取sqlSession对象
        SqlSession sqlSession = MyBatisUtil.getSqlSession();
        // 2.获取需要的mapper接口的代理对象
        UserMapper mapper = sqlSession.getMapper(UserMapper.class);
        // 3.调用对应的方法执行操作
        User user = mapper.get(1);
        user.setPwd("987654");
        int update = mapper.update(user);
        System.out.println(user);
        // 4.提交事务
        sqlSession.commit();
        // 5.关闭sqlSession
        sqlSession.close();
    }

    @Test
    public void delete(){
        // 1.获取sqlSession对象
        SqlSession sqlSession = MyBatisUtil.getSqlSession();
        // 2.获取需要的mapper接口的代理对象
        UserMapper mapper = sqlSession.getMapper(UserMapper.class);
        // 3.调用对应的方法执行操作
        int delete = mapper.delete(10);
        System.out.println(delete);
        // 4.提交事务
        sqlSession.commit();
        // 5.关闭sqlSession
        sqlSession.close();
    }
}
```

## resultMap（结果集映射）

### 自定义 `Java Bean` 封装规则

#### 修改 User 实体类

别问为什么要闲得蛋疼的修改，现在要演示**实体类属性和数据库列名不一致如何映射**

```java
package org.hong.pojo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class User {
    private Integer user_id;
    private String username;
    private String password;
}
```

#### Mapper 接口

```java
package org.hong.mapper;

import org.hong.pojo.User;

import java.util.List;

public interface UserMapper {
    List<User> getAll();
}
```

#### Mapper.xml 文件

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper
        PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-mapper.dtd">

<mapper namespace="org.hong.mapper.UserMapper">
    <!--
        resultMap: 自定义结果集映射规则
            id: 唯一标识, 方便被引用
            type: 映射到的实体类的全类名
     -->
    <resultMap id="user" type="org.hong.pojo.User">
        <!--
            id: 映射实体类中与主键对应的属性
                column: 主键列的列名
                property: 主键列对应的属性
         -->
        <id property="user_id" column="id"></id>

        <!-- result: 映射普通属性 -->
        <result property="username" column="name"></result>
        <result property="password" column="pwd"></result>
    </resultMap>
    <!--
        如果javaBen属性名和列名不一致, 不应该再使用resultType配置返回值类型
        而是使用resultMap引用自定义的结果集映射规则
     -->
    <select id="getAll" resultMap="user">
        select * from user
    </select>
</mapper>
```

#### 测试用例

```java
package org.hong.test;

import org.apache.ibatis.session.SqlSession;
import org.hong.mapper.UserMapper;
import org.hong.pojo.User;
import org.hong.util.MyBatisUtil;
import org.junit.Test;

import java.util.List;

public class ResultMapTest {
    @Test
    public void tesResultMap(){
        SqlSession sqlSession = MyBatisUtil.getSqlSession();
        UserMapper mapper = sqlSession.getMapper(UserMapper.class);

        List<User> list = mapper.getAll();
        list.forEach(System.out :: println);

        sqlSession.commit();
        sqlSession.close();
    }
}
```

#### 控制台打印

```shell
## 虽然数据表的列名与实体类的属性名不一致, 但是我们配置了resultMap, 正常执行, 帅, 不愧是我
[main] [org.hong.mapper.UserMapper.getAll]-[DEBUG] ==>  Preparing: select * from user 
[main] [org.hong.mapper.UserMapper.getAll]-[DEBUG] ==> Parameters: 
[main] [org.hong.mapper.UserMapper.getAll]-[DEBUG] <==      Total: 5
User(user_id=1, username=谢禹宏, password=987654)
User(user_id=2, username=Tom, password=123456)
User(user_id=3, username=Jerry, password=123456)
User(user_id=4, username=SAVE ID, password=123)
User(user_id=5, username=SAVE ID, password=123)
```

### 环境搭建

接下来演示一个部门对应多个员工，一个员工对应一个部门的关系映射。

#### SQL

```mysql
CREATE TABLE `dept` (
    `id` INT(10) NOT NULL,
    `name` VARCHAR(30) DEFAULT NULL,
    PRIMARY KEY (`id`)
) ENGINE=INNODB DEFAULT CHARSET=utf8

INSERT INTO dept(`id`, `name`) VALUES (1, '开发部'); 
INSERT INTO dept(`id`, `name`) VALUES (2, '测试部'); 

CREATE TABLE `employee` (
    `id` INT(10) NOT NULL,
    `name` VARCHAR(30) DEFAULT NULL,
    `did` INT(10) DEFAULT NULL,
    PRIMARY KEY (`id`),
    KEY `fkdid` (`did`),
    CONSTRAINT `fkdid` FOREIGN KEY (`did`) REFERENCES `dept` (`id`)
) ENGINE=INNODB DEFAULT CHARSET=utf8

INSERT INTO `employee` (`id`, `name`, `did`) VALUES ('1', '小明', '1'); 
INSERT INTO `employee` (`id`, `name`, `did`) VALUES ('2', '小红', '2'); 
INSERT INTO `employee` (`id`, `name`, `did`) VALUES ('3', '小张', '1'); 
INSERT INTO `employee` (`id`, `name`, `did`) VALUES ('4', '小李', '2'); 
INSERT INTO `employee` (`id`, `name`, `did`) VALUES ('5', '小王', '1');
```

#### 实体类

```java
package org.hong.pojo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Dept {
    private Integer id;
    private String name;
}
```

```java
package org.hong.pojo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Employee {
    private Integer id;
    private String name;
    // 多对一, 查询N方的同时获取到1方
    private Dept dept;
}
```

#### MyBatisUtil 工具类

```java
package org.hong.util;

import org.apache.ibatis.io.Resources;
import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;
import org.apache.ibatis.session.SqlSessionFactoryBuilder;

import java.io.IOException;
import java.io.InputStream;

public class MyBatisUtil {

    private static SqlSessionFactory sqlSessionFactory;

    static {
        try {
            // 获取sqlSessionFactory对象
            String resource = "mybatis-config.xml";
            InputStream inputStream = Resources.getResourceAsStream(resource);
            sqlSessionFactory = new SqlSessionFactoryBuilder().build(inputStream);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    // 既然有了 SqlSessionFactory，顾名思义，我们可以从中获得 SqlSession 的实例。
    // SqlSession 提供了在数据库执行 SQL 命令所需的所有方法
    public static SqlSession getSqlSession(){
        // openSession(): 此方式打开SQL会话, 事务是开启状态
        // openSession(true): 此方式打开SQL会话, 事务是关闭状态
        return sqlSessionFactory.openSession();
    }

    public static SqlSessionFactory getSqlSessionFactory() {
        return sqlSessionFactory;
    }
}
```

#### jdbc.properties

```properties
driver=com.mysql.jdbc.Driver
url=jdbc:mysql://localhost:3306/mybatis?userSSL=true&amp;useUnicode=true&amp;characterEncoding=UTF-8
username=root
password=1234
```

#### log4j.properties

```properties
log4j.rootLogger=DEBUG,A1
log4j.appender.A1=org.apache.log4j.ConsoleAppender
log4j.appender.A1.layout=org.apache.log4j.PatternLayout
log4j.appender.A1.layout.ConversionPattern=[%t] [%c]-[%p] %m%n
```

#### MyBatis 核心配置文件

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE configuration
        PUBLIC "-//mybatis.org//DTD Config 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-config.dtd">

<!-- configuration: 核心配置文件 -->
<configuration>

    <!-- 导入外部配置文件, 放在最前面 -->
    <properties resource="jdbc.properties"/>

    <!-- 设置日志输出, 方便观察sql语句和参数 -->
    <settings>
        <setting name="logImpl" value="LOG4J"/>
    </settings>

    <!--
        environments配置项目的运行环境, 可以配置多个
        default: 启用的环境
     -->
    <environments default="development">
        <environment id="development">
            <transactionManager type="JDBC"/>
            <dataSource type="POOLED">
                <!-- 数据库连接信息 -->
                <property name="driver" value="${driver}"/>
                <property name="url" value="${url}"/>
                <property name="username" value="${username}"/>
                <property name="password" value="${password}"/>
            </dataSource>
        </environment>
    </environments>

    <!-- 每一个Mapper.xml都需要在MyBatis核心配置文件中注册!!! -->
    <mappers>
        <package name="org.hong.mapper"/>
    </mappers>

</configuration>
```

### 多对一

#### 实体类

```java
package org.hong.pojo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Dept {
    private Integer id;
    private String name;
}
```

```java
package org.hong.pojo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Employee {
    private Integer id;
    private String name;
    // 多对一, 查询N方的同时获取到1方
    private Dept dept;
}
```



#### 联合查询

##### DeptMapper.java

```java
package org.hong.mapper;

import org.hong.pojo.Dept;

public interface DeptMapper {

}
```

##### EmployeeMapper.java

```java
package org.hong.mapper;

import org.hong.pojo.Employee;

import java.util.List;

public interface EmployeeMapper {
    List<Employee> getAll();
}
```

##### DeptMapper.xml

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper
        PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-mapper.dtd">

<mapper namespace="org.hong.mapper.DeptMapper">
    <resultMap id="deptBase" type="org.hong.pojo.Dept">
        <id property="id" column="did"></id>
        <result property="name" column="dname"></result>
    </resultMap>
</mapper>
```

##### EmployeeMapper.xml

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper
        PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-mapper.dtd">

<mapper namespace="org.hong.mapper.EmployeeMapper">
    <!-- 创建一个只封装普通属性的resultMap映射规则 -->
    <resultMap id="employeeBase" type="org.hong.pojo.Employee">
        <id property="id" column="id"></id>
        <result property="name" column="name"></result>
    </resultMap>

    <!-- 使用extends属性继承一个resultMap可以获得指定的resultMap定义过的映射规则, 就可以省略普通属性, 只写级联属性的规则 -->
    <resultMap id="employee1" type="org.hong.pojo.Employee" extends="employeeBase">
        <!-- 方式一: 联合查询, 级联属性封装结果 -->
        <result property="dept.id" column="did"></result>
        <!-- 两张表都有name字段, 在进行封装的时候就会出现问题, 要么查询的时候取别名, 要么在建表的时候就避免 -->
        <result property="dept.name" column="dname"></result>
    </resultMap>

    <resultMap id="employee2" type="org.hong.pojo.Employee" extends="employeeBase">
        <!--
            方式二: 给指定联合的javaBean对象编写映射规则
                association:定义关联对象的封装规则
                    property: 指定哪个属性是联合的对象
                    javaType: 指定这个属性对象的类型[不能省略]
         -->
        <association property="dept" javaType="org.hong.pojo.Dept">
            <id property="id" column="did"></id>
            <result property="name" column="dname"></result>
        </association>
    </resultMap>

    <resultMap id="employee3" type="org.hong.pojo.Employee" extends="employeeBase">
        <!--方式三: 使用association节点的resultMap属性指定级联对象的映射规则, 而不是再写一份 -->
        <association property="dept" resultMap="org.hong.mapper.DeptMapper.deptBase">				</association>
    </resultMap>

    <!-- 查询Employee的同时查询出对应Dept, 此时使用resultType就做不到了, 需要使用resultMap引用自自定义的映射规则 -->
    <select id="getAll" resultMap="employee3">
        <!-- 内连接 -->
        select e.*, d.id did, d.name dname from employee e inner join dept d on e.did = d.id
    </select>
</mapper>
```



#### 嵌套查询

##### DeptMapper.java

```java
package org.hong.mapper;

import org.hong.pojo.Dept;

public interface DeptMapper {
    Dept get(int id);
}
```

##### EmployeeMapper.java

```java
package org.hong.mapper;

import org.hong.pojo.Employee;

import java.util.List;

public interface EmployeeMapper {
    List<Employee> getAll();
}
```

##### DeptMapper.xml

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper
        PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-mapper.dtd">

<mapper namespace="org.hong.mapper.DeptMapper">
    <select id="get" resultType="org.hong.pojo.Dept">
        select * from dept where id = #{id}
    </select>
</mapper>
```

##### EmployeeMapper.xml

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper
        PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-mapper.dtd">

<mapper namespace="org.hong.mapper.EmployeeMapper">
    <!--
        思路:
            1.查询所有员工的信息
            2.根据查询出来的员工的did查询对应的部门
  -->
    <resultMap id="employee" type="org.hong.pojo.Employee">
        <id property="id" column="id"></id>
        <result property="name" column="name"></result>
        <!--
            association:定义关联对象的封装规则
              select: 表明当前属性是调用select指定的方法查出的结果
              column: 指定将那一列的值传给select
         -->
        <association property="dept"
                     column="did"
                     javaType="org.hong.pojo.Dept"
                     select="org.hong.mapper.DeptMapper.get"></association>
    </resultMap>

    <!-- 查询Employee的同时查询出对应Dept, 此时使用resultType就做不到了, 需要使用resultMap -->
    <select id="getAll" resultMap="employee">
        select * from employee
    </select>
</mapper>
```



#### 测试用例

```java
package org.hong.test;

import org.apache.ibatis.session.SqlSession;
import org.hong.mapper.EmployeeMapper;
import org.hong.pojo.Employee;
import org.hong.util.MyBatisUtil;
import org.junit.Test;

import java.util.List;

public class ResultTest {
    @Test
    public void testManyToOne(){
        SqlSession sqlSession = MyBatisUtil.getSqlSession();
        EmployeeMapper mapper = sqlSession.getMapper(EmployeeMapper.class);

        List<Employee> list = mapper.getAll();
        list.forEach(e -> System.out.println(e.getName()));
        list.forEach(e -> System.out.println(e.getDept().getName()));

        sqlSession.commit();
        sqlSession.close();
    }
}
```

####  控制台打印

##### 联合查询

```shell
## 联合查询的控制台打印, 只发送一条sql
[main] [org.hong.mapper.EmployeeMapper.getAll]-[DEBUG] ==>  Preparing: select e.*, d.id did, d.name dname from employee e inner join dept d on e.did = d.id 
[main] [org.hong.mapper.EmployeeMapper.getAll]-[DEBUG] ==> Parameters: 
[main] [org.hong.mapper.EmployeeMapper.getAll]-[DEBUG] <==      Total: 5
小明
小张
小王
小红
小李
开发部
开发部
开发部
测试部
测试部
```

##### 嵌套查询

可以发现，似乎并没有懒加载，直接一次把所有 sql 发出去了，这是因为我们还没有开启 MyBatis 的懒加载功能

```shell
## 先发送查询Employee表的sql
[main] [org.hong.mapper.EmployeeMapper.getAll]-[DEBUG] ==>  Preparing: select * from employee 
[main] [org.hong.mapper.EmployeeMapper.getAll]-[DEBUG] ==> Parameters: 
## 再发送查询Dept表的sql
[main] [org.hong.mapper.DeptMapper.get]-[DEBUG] ====>  Preparing: select * from dept where id = ? 
[main] [org.hong.mapper.DeptMapper.get]-[DEBUG] ====> Parameters: 1(Integer)
[main] [org.hong.mapper.DeptMapper.get]-[DEBUG] <====      Total: 1
[main] [org.hong.mapper.DeptMapper.get]-[DEBUG] ====>  Preparing: select * from dept where id = ? 
[main] [org.hong.mapper.DeptMapper.get]-[DEBUG] ====> Parameters: 2(Integer)
[main] [org.hong.mapper.DeptMapper.get]-[DEBUG] <====      Total: 1
[main] [org.hong.mapper.EmployeeMapper.getAll]-[DEBUG] <==      Total: 5
小明
小红
小张
小李
小王
开发部
测试部
开发部
测试部
开发部
```

### 一对多

#### 实体类

```java
package org.hong.pojo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Dept {
    private Integer id;
    private String name;
    private List<Employee> employees;
}
```

```java
package org.hong.pojo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Employee {
    private Integer id;
    private String name;
}
```



#### 联合查询

##### DeptMapper.java

```java
package org.hong.mapper;

import org.hong.pojo.Dept;

public interface DeptMapper {
    Dept get(int id);
}
```

##### EmployeeMapper.java

```java
package org.hong.mapper;

import org.hong.pojo.Employee;

import java.util.List;

public interface EmployeeMapper {
    
}
```

##### DeptMapper.xml

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper
        PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-mapper.dtd">

<mapper namespace="org.hong.mapper.DeptMapper">
    <resultMap id="deptBase" type="org.hong.pojo.Dept">
        <id column="id" property="id"></id>
        <result column="name" property="name"></result>
    </resultMap>

    <resultMap id="dept2" type="org.hong.pojo.Dept" extends="deptBase">
        <!-- 方式一 -->
        <collection property="employees" ofType="org.hong.pojo.Employee">
            <id column="eid" property="id"></id>
            <result column="ename" property="name"></result>
        </collection>
    </resultMap>

    <resultMap id="dept3" type="org.hong.pojo.Dept" extends="deptBase">
        <!-- 方式二 -->
        <!-- 
           collection: 表示查询的多条数据
            ofType: 指定集合中属性对象的类型[不能省略];
              需要注意的是, collection使用ofType来指定集合中对象的类型, 而不是javaType
           -->
        <collection property="employees"
                    ofType="org.hong.pojo.Employee" 
                    resultMap="org.hong.mapper.EmployeeMapper.employeeBase">
        </collection>
    </resultMap>

    <select id="get" resultMap="dept2">
        select d.*, e.id eid, e.name ename from dept d inner join employee e on d.id = e.did where d.id = #{id}
    </select>
</mapper>
```

##### EmployeeMapper.xml

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper
        PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-mapper.dtd">

<mapper namespace="org.hong.mapper.EmployeeMapper">
    <resultMap id="employeeBase" type="org.hong.pojo.Employee">
        <id column="eid" property="id"></id>
        <id column="ename" property="name"></id>
    </resultMap>
</mapper>
```



#### 嵌套查询

##### DeptMapper.java

```java
package org.hong.mapper;

import org.hong.pojo.Dept;

public interface DeptMapper {
    Dept get(int id);
}
```

##### EmployeeMapper.java

```java
package org.hong.mapper;

import org.hong.pojo.Employee;

import java.util.List;

public interface EmployeeMapper {
    List<Employee> getByDid(int did);
}
```

##### DeptMapper.xml

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper
        PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-mapper.dtd">

<mapper namespace="org.hong.mapper.DeptMapper">
    <resultMap id="deptBase" type="org.hong.pojo.Dept">
        <id column="id" property="id"></id>
        <result column="name" property="name"></result>
    </resultMap>
    <resultMap id="dept1" type="org.hong.pojo.Dept" extends="deptBase">
        <!--
   collection: 定义关联集合类型的属性的封装规则
                ofType: 指定集合里面元素的类型
                select: 表明当前属性是调用select指定的方法查出的结果
                column: 指定将那一列的值传给select
   -->
        <collection property="employees"
                    column="id"
                    select="org.hong.mapper.EmployeeMapper.getByDid"></collection>
    </resultMap>

    <select id="get" resultMap="dept1">
        select * from dept where id = #{id}
    </select>
</mapper>
```

##### EmployeeMapper.xml

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper
        PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-mapper.dtd">

<mapper namespace="org.hong.mapper.EmployeeMapper">
    <select id="getByDid" resultType="org.hong.pojo.Employee">
        select * from employee where did = #{did}
    </select>
</mapper>
```



#### 测试用例

```java
package org.hong.test;

import org.apache.ibatis.session.SqlSession;
import org.hong.mapper.DeptMapper;
import org.hong.pojo.Dept;
import org.hong.util.MyBatisUtil;
import org.junit.Test;

public class ResultTest {
    @Test
    public void testOneToMany(){
        SqlSession sqlSession = MyBatisUtil.getSqlSession();
        DeptMapper mapper = sqlSession.getMapper(DeptMapper.class);

        Dept dept = mapper.get(1);
        System.out.println(dept);

        sqlSession.commit();
        sqlSession.close();
    }
}
```



#### 控制台打印

##### 联合查询

```shell
[main] [org.hong.mapper.DeptMapper.get]-[DEBUG] ==>  Preparing: select d.*, e.id eid, e.name ename from dept d inner join employee e on d.id = e.did where d.id = ? 
[main] [org.hong.mapper.DeptMapper.get]-[DEBUG] ==> Parameters: 1(Integer)
[main] [org.hong.mapper.DeptMapper.get]-[DEBUG] <==      Total: 3
Dept(id=1, name=开发部, employees=[Employee(id=1, name=小明), Employee(id=3, name=小张), Employee(id=5, name=小王)])
```

##### 嵌套查询

```shell
[main] [org.hong.mapper.DeptMapper.get]-[DEBUG] ==>  Preparing: select * from dept where id = ? 
[main] [org.hong.mapper.DeptMapper.get]-[DEBUG] ==> Parameters: 1(Integer)
[main] [org.hong.mapper.DeptMapper.get]-[DEBUG] <==      Total: 1
[main] [org.hong.mapper.EmployeeMapper.getByDid]-[DEBUG] ==>  Preparing: select * from employee where did = ? 
[main] [org.hong.mapper.EmployeeMapper.getByDid]-[DEBUG] ==> Parameters: 1(Integer)
[main] [org.hong.mapper.EmployeeMapper.getByDid]-[DEBUG] <==      Total: 3
Dept(id=1, name=开发部, employees=[Employee(id=1, name=小明), Employee(id=3, name=小张), Employee(id=5, name=小王)])
```



### 嵌套查询的懒加载

#### 全局懒加载

修改 MyBatis 的核心配置文件

```xml
<settings>
    <setting name="logImpl" value="LOG4J"/>
    <!--
        aggressiveLazyLoading:
            启用时: 有延迟加载属性的对象在被调用时将会完全加载任意属性。
            禁用时: 调用哪个懒载属性就加载哪个属性, 按需加载
     -->
    <setting name="aggressiveLazyLoading" value="false"/>
    <!--
        lazyLoadingEnabled:
            全局启用或禁用延迟加载。
   禁用时: 所有关联对象都会即时加载。
     -->
    <setting name="lazyLoadingEnabled" value="true"/>
</settings>
```

#### 局部懒加载

```xml
<resultMap id="employee" type="org.hong.pojo.Employee">
    <id property="id" column="id"></id>
    <result property="name" column="name"></result>
    <!--
        association:定义关联对象的封装规则
           select: 表明当前属性是调用select指定的方法查出的结果
           column: 指定将那一列的值传给select
           fetchType: 关联属性的加载策略, 可以覆盖全局的lazyLoadingEnabled, fetchType属性同样可以作用于collection标签
               lazy: 延迟加载
               eager: 即时加载
     -->
    <association property="dept"
                 column="did"
                 javaType="org.hong.pojo.Dept"
                 fetchType="lazy"
                 select="org.hong.mapper.DeptMapper.get"></association>
</resultMap>
```



### 总结

-   **嵌套查询**的方式在查询时会向数据库<span style='color:red'>发送**多次**SQL语句</span>
-   **联合查询**的方式只会向数据库<span style='color:red'>发送**一次**SQL语句</span>

<hr/>

-   **resultMap**：自定义某个javaBean的封装规则
-   **resultMap的属性**：
    -   id：唯一标识
    -   type：自定义规则的java类型
-   **resultMap包含的标签**：
    -   result：指定其余键的封装规则
    -   id：指定主键的封装规则, id定义主键底层会有优化
        -   column：指定数据库的列
        -   property：指定对应的javaBean属性

<hr/>

-   **association**：定义关联<span style='color:red'>**对象**的封装规则</span>

-   **collection**：定义关联<span style='color:red'>**集合类型**的属性的封装规则</span>

    -   **property**：当前封装的<span style='color:red'>对象的属性</span>

    -   <span style='color:red'>**javaType**</span>：指定<span style='color:red'>**实体类中属性的类型**</span>

    -   <span style='color:red'>**ofType**</span>：指定映射到List或集合中的pojo类型，<span style='color:red'>**泛型中的约束类型**</span>

    -   **select**：表明<span style='color:red'>当前属性是调用select指定的方法查出的结果</span>

    -   **column**： 指定将<span style='color:red'>哪一列的值传给select</span>

        -   ```java
            // 传递多列的值
            column="{key1=column1, key2=column2}"
                key: select指定的查询的#{key}中的key
                    colnmn: 列名
            ```

        -   <span style='background:yellow;color:red'>流程：使用select指定的方法(传入column指定的列的参数值)查出对象, 并封装给property</span>

    -   **fetchType**：在全局配置中设置了延迟加载的情况下可以将联合属性修改为立即加载

        -   lazy: 延迟, 默认
        -   eager: 立即





## 动态SQL

**动态SQL就是根据不同的条件生成不同的SQL语句**

如果你之前用过 JSTL 或任何基于类 XML 语言的文本处理器，你对动态 SQL 元素可能会感觉似曾相识。在 MyBatis 之前的版本中，需要花时间了解大量的元素。借助功能强大的基于 OGNL 的表达式，MyBatis 3 替换了之前的大部分元素，大大精简了元素种类，现在要学习的元素种类比原来的一半还要少。

### 搭建环境

#### SQL

```mysql
DROP TABLE IF EXISTS `blog`;
CREATE TABLE `blog` (
    `id` varchar(50) NOT NULL COMMENT '博客id',
    `title` varchar(100) NOT NULL COMMENT '博客标题',
    `author` varchar(30) NOT NULL COMMENT '博客作者',
    `create_time` datetime NOT NULL COMMENT '创建时间',
    `views` int(30) NOT NULL COMMENT '浏览量',
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO `blog` VALUES ('0001', 'hong/My-Note', '谢禹宏', '2021-04-21 00:00:00', '100');
INSERT INTO `blog` VALUES ('0002', 'MyBatis-Plus', '苞米豆', '2021-04-21 00:00:00', '100');
INSERT INTO `blog` VALUES ('0003', 'Hello MyBatis', '母鸡', '2021-04-21 00:00:00', '120');
INSERT INTO `blog` VALUES ('0004', 'Hello Vuew', '尤雨溪', '2021-01-21 00:00:00', '100');
INSERT INTO `blog` VALUES ('0005', 'Hello Linux', '林纳斯', '2001-04-21 00:00:00', '120');
```

#### 实体类

```java
package org.hong.pojo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Blog {
    private String id;
    private String title;
    private String author;
    private Date createTime;
    private Integer views;
}
```

#### MyBatisUtil 工具类

```java
package org.hong.util;

import org.apache.ibatis.io.Resources;
import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;
import org.apache.ibatis.session.SqlSessionFactoryBuilder;

import java.io.IOException;
import java.io.InputStream;

public class MyBatisUtil {

    private static SqlSessionFactory sqlSessionFactory;

    static {
        try {
            // 获取sqlSessionFactory对象
            String resource = "mybatis-config.xml";
            InputStream inputStream = Resources.getResourceAsStream(resource);
            sqlSessionFactory = new SqlSessionFactoryBuilder().build(inputStream);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    // 既然有了 SqlSessionFactory，顾名思义，我们可以从中获得 SqlSession 的实例。
    // SqlSession 提供了在数据库执行 SQL 命令所需的所有方法
    public static SqlSession getSqlSession(){
        // openSession(): 此方式打开SQL会话, 事务是开启状态
        // openSession(true): 此方式打开SQL会话, 事务是关闭状态
        return sqlSessionFactory.openSession();
    }

    public static SqlSessionFactory getSqlSessionFactory() {
        return sqlSessionFactory;
    }
}
```

#### jdbc.properties

```properties
driver=com.mysql.jdbc.Driver
url=jdbc:mysql://localhost:3306/mybatis?userSSL=true&amp;useUnicode=true&amp;characterEncoding=UTF-8
username=root
password=1234
```

#### log4j.properties

```properties
log4j.rootLogger=DEBUG,A1

log4j.appender.A1=org.apache.log4j.ConsoleAppender
log4j.appender.A1.layout=org.apache.log4j.PatternLayout
log4j.appender.A1.layout.ConversionPattern=[%t] [%c]-[%p] %m%n
```

#### MyBatis 核心配置文件

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE configuration
        PUBLIC "-//mybatis.org//DTD Config 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-config.dtd">

<!-- configuration: 核心配置文件 -->
<configuration>

    <!-- 导入外部配置文件, 放在最前面 -->
    <properties resource="jdbc.properties"/>

    <settings>
        <!-- 设置日志输出, 方便观察sql语句和参数 -->
        <setting name="logImpl" value="LOG4J"/>
        <!-- 开启驼峰命名法 -->
        <setting name="mapUnderscoreToCamelCase" value="true"/>
    </settings>

    <!--
        environments配置项目的运行环境, 可以配置多个
        default: 启用的环境
     -->
    <environments default="development">
        <environment id="development">
            <transactionManager type="JDBC"/>
            <dataSource type="POOLED">
                <!-- 数据库连接信息 -->
                <property name="driver" value="${driver}"/>
                <property name="url" value="${url}"/>
                <property name="username" value="${username}"/>
                <property name="password" value="${password}"/>
            </dataSource>
        </environment>
    </environments>

    <!-- 每一个Mapper.xml都需要在MyBatis核心配置文件中注册!!! -->
    <mappers>
        <package name="org.hong.mapper"/>
    </mappers>

</configuration>
```

#### BlogMapper.java

```java
package org.hong.mapper;

public interface BlogMapper {
    
}
```

####  BlogMapper.xml

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper
        PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-mapper.dtd">

<mapper namespace="org.hong.mapper.BlogMapper">
    
</mapper>
```



### if

#### 接口方法

```java
// 查询博客, 携带了哪个字段查询条件就带上这个字段的值
List<Blog> getByBlog(Blog blog);
```

#### 方法映射

```xml
<!-- if -->
<select id="getByBlog" resultType="org.hong.pojo.Blog">
    select * from blog where
    <!-- test: 判断的表达式 (OGNL)-->
    <if test="title != null and title.trim() != ''">
        title like #{title}
    </if>
    <if test="author != null and author.trim() != ''">
        and author like #{author}
    </if>
</select>
```

#### 测试用例

```java
@Test
public void testIf(){
    SqlSession sqlSession = MyBatisUtil.getSqlSession();
    BlogMapper mapper = sqlSession.getMapper(BlogMapper.class);

    Blog blog = new Blog();
    blog.setTitle("%MyBatis%");
    // 这里赋值一个空字符串
    blog.setAuthor("");
    List<Blog> list = mapper.getByBlog(blog);
    list.forEach(System.out :: println);

    sqlSession.commit();
    sqlSession.close();
}
```

#### 控制台打印

```shell
## 发送的sql并没有带上author字段
[main] [org.hong.mapper.BlogMapper.getByBlog]-[DEBUG] ==>  Preparing: select * from blog where title like ? 
[main] [org.hong.mapper.BlogMapper.getByBlog]-[DEBUG] ==> Parameters: %MyBatis%(String)
[main] [org.hong.mapper.BlogMapper.getByBlog]-[DEBUG] <==      Total: 2
Blog(id=0002, title=MyBatis-Plus, author=苞米豆, createTime=2021-04-21, views=100)
Blog(id=0003, title=Hello MyBatis, author=母鸡, createTime=2021-04-21, views=120)
```

#### 问题

如果**不给 title 赋值**，SQL 就会变成这样：`select * from user where and author like #{author}`

这样的 SQL 明显是非法的，如何解决？

**解决方案：**

1.  在 where 添加后面添加 1=1, 以后的条件都 `and xxx`<span style='color:red'>`（不推荐, 会导致数据库性损失）`</span>
2.  MyBatis 使用 `where` 标签来将所有的查询条件包括在内，MyBatis 会<span style='color:red'>**`自动的忽略 where 后第一个不合法的 and 或 or`**</span>, 并且在<span style='color:red'>**`有条件的情况下自动拼接上 where`**</span>



### where

Mapper 接口和测试不变，对 `if` 演示的方法映射进行改造！！！

#### 方法映射

```xml
<!-- where -->
<select id="getByBlog" resultType="org.hong.pojo.Blog">
    select * from blog
    <where>
        <if test="title != null and title.trim() != ''">
            and title like #{title}
        </if>
        <if test="author != null and author.trim() != ''">
            and author like #{author}
        </if>
    </where>
</select>
```

#### 测试用例

```java
@Test
public void testWhere(){
    SqlSession sqlSession = MyBatisUtil.getSqlSession();
    BlogMapper mapper = sqlSession.getMapper(BlogMapper.class);

    Blog blog = new Blog();
    blog.setTitle("");
    blog.setAuthor("%谢%");
    List<Blog> list = mapper.getByBlog(blog);
    list.forEach(System.out :: println);

    sqlSession.commit();
    sqlSession.close();
}
```

#### 控制台打印

```shell
## MyBatis帮我们加上了where并且忽略了where后面第一个不合法的and或or
[main] [org.hong.mapper.BlogMapper.getByBlog]-[DEBUG] ==>  Preparing: select * from blog WHERE author like ? 
[main] [org.hong.mapper.BlogMapper.getByBlog]-[DEBUG] ==> Parameters: %谢%(String)
[main] [org.hong.mapper.BlogMapper.getByBlog]-[DEBUG] <==      Total: 1
Blog(id=0001, title=hong/My-Note, author=谢禹宏, createTime=2020-01-01, views=100)
```

#### 问题

我们进行模糊查询时，每次给属性赋值都加上了 `%%`，显示的加上通配符，这样并不是很好，应该让 MyBatis 为我们加上通配符，想要完成这个功能需要使用 `bind` 元素。 



### bind

元素允许你在 OGNL 表达式以外创建一个变量，并将其绑定到当前的上下文。<span style='color:red'>**通常用来拼接模糊查询**</span>

Mapper 接口和测试不变，对 `where` 演示的方法映射进行改造！！！

#### 方法映射

```xml
<select id="getByBlog" resultType="org.hong.pojo.Blog">
    select * from blog
    <where>
        <if test="title != null and title.trim() != ''">
            <!-- bind -->
            <bind name="newTitle" value="'%' + title + '%'"/>
            and title like #{newTitle}
        </if>
        <if test="author != null and author.trim() != ''">
            <bind name="newAuthor" value="'%' + author + '%'"/>
            and author like #{newAuthor}
        </if>
    </where>
</select>
```

#### 测试用例

```java
@Test
public void testBind(){
    SqlSession sqlSession = MyBatisUtil.getSqlSession();
    BlogMapper mapper = sqlSession.getMapper(BlogMapper.class);

    Blog blog = new Blog();
    // 直接赋值了一个y, 没有使用通配符
    blog.setTitle("y");
    List<Blog> list = mapper.getByBlog(blog);
    list.forEach(System.out :: println);

    sqlSession.commit();
    sqlSession.close();
}
```

#### 控制台打印

```shell
[main] [org.hong.mapper.BlogMapper.getByBlog]-[DEBUG] ==>  Preparing: select * from blog WHERE title like ? 
## MyBatis为sql语句赋值的参数, 可以发现y的左右两边加上了%通配符
[main] [org.hong.mapper.BlogMapper.getByBlog]-[DEBUG] ==> Parameters: %y%(String)
[main] [org.hong.mapper.BlogMapper.getByBlog]-[DEBUG] <==      Total: 3
Blog(id=0001, title=hong/My-Note, author=谢禹宏, createTime=2020-01-01, views=100)
Blog(id=0002, title=MyBatis-Plus, author=苞米豆, createTime=2021-04-21, views=100)
Blog(id=0003, title=Hello MyBatis, author=母鸡, createTime=2021-04-21, views=120)
```

到这里，我们的 `getByBlog` 方法就变得很优雅了！！！



### set

`set `元素会动态地在行首插入 `SET `关键字，并会删掉额外的逗号（这些逗号是在使用条件语句给列赋值时引入的）。

#### 接口方法

```java
// 修改, 但是只修改属性值不为null的属性
int update(Blog blog);
```

#### 方法映射

```xml
<!-- set -->
<update id="update">
    update blog
    <set>
        <if test="title != null and title.trim() != ''">
            , title = #{title}
        </if>
        <if test="author != null and author.trim() != ''">
            , author = #{author}
        </if>
        <if test="createTime != null">
            , create_time = #{createTime}
        </if>
        <if test="views != null and views > 0">
            , views = #{views}
        </if>
    </set>
    where id = #{id}
</update>
```

#### 测试用例

```d
@Test
    public void testSet(){

    SqlSession sqlSession = MyBatisUtil.getSqlSession();
    BlogMapper mapper = sqlSession.getMapper(BlogMapper.class);

    Blog blog = new Blog();
    blog.setId("0001");
    blog.setCreateTime(Date.valueOf("2020-1-1"));
    int update = mapper.update(blog);

    sqlSession.commit();
    sqlSession.close();
}
```

#### 控制台打印

```shell
## mybatis帮我们加上了set关键字, 并且删除了set后面第一个不合法的逗号
[main] [org.hong.mapper.BlogMapper.update]-[DEBUG] ==>  Preparing: update blog SET create_time = ? where id = ? 
[main] [org.hong.mapper.BlogMapper.update]-[DEBUG] ==> Parameters: 2020-01-01(Date), 0001(String)
[main] [org.hong.mapper.BlogMapper.update]-[DEBUG] <==    Updates: 1
```



### choose\{when, otherwise\}

有时候，我们不想使用所有的条件，而只是想从多个条件中选择一个使用。针对这种情况，MyBatis 提供了 choose 元素，它有点像 Java 中的 switch 语句。<span style ="color:red">`（choose --> switch，when --> case，otherwise --> default）`</span>

#### 接口方法

```java
// 有id, 根据id精准匹配; 有title就根据title进行模糊查询; 如果都没有就查询author为苞米豆的blog
List<Blog> getByBlogChoose(Blog blog);
```

#### 方法映射

```xml
<select id="getByBlogChoose" resultType="org.hong.pojo.Blog">
    select * from blog
    <where>
        <choose>
            <when test="id != null and id > 0">
                and id = #{id}
            </when>
            <when test="title != null and title.trim() != ''">
                <bind name="title" value="'%' + title + '%'"/>
                and title like #{title}
            </when>
            <otherwise>
                and author = '苞米豆'
            </otherwise>
        </choose>
    </where>
</select>
```

#### 测试用例

```java
@Test
public void testChoose(){
    SqlSession sqlSession = MyBatisUtil.getSqlSession();
    BlogMapper mapper = sqlSession.getMapper(BlogMapper.class);

    // 赋值 id 和 title
    Blog blog1 = new Blog();
    blog1.setId("0001");
    blog1.setTitle("my");
    List<Blog> list1 = mapper.getByBlogChoose(blog1);
    System.out.println(list1);

    // 只赋值 title
    Blog blog2 = new Blog();
    blog2.setTitle("my");
    List<Blog> list2 = mapper.getByBlogChoose(blog2);
    System.out.println(list2);

    // 什么都不赋值
    List<Blog> list3 = mapper.getByBlogChoose(null);
    System.out.println(list3);

    sqlSession.commit();
    sqlSession.close();
}
```

#### 控制台打印

```shell
## 给 id 和 title 属性赋值, 因为choose只会进入一个hwen, 所以查询条件只有id, 没有title
[main] [org.hong.mapper.BlogMapper.getByBlogChoose]-[DEBUG] ==>  Preparing: select * from blog WHERE id = ? 
[main] [org.hong.mapper.BlogMapper.getByBlogChoose]-[DEBUG] ==> Parameters: 0001(String)
[main] [org.hong.mapper.BlogMapper.getByBlogChoose]-[DEBUG] <==      Total: 1
[Blog(id=0001, title=hong/My-Note, author=谢禹宏, createTime=2020-01-01, views=100)]
## 只给 title 属性赋值, 查询条件加上了title
[main] [org.hong.mapper.BlogMapper.getByBlogChoose]-[DEBUG] ==>  Preparing: select * from blog WHERE title like ? 
[main] [org.hong.mapper.BlogMapper.getByBlogChoose]-[DEBUG] ==> Parameters: %my%(String)
[main] [org.hong.mapper.BlogMapper.getByBlogChoose]-[DEBUG] <==      Total: 3
[Blog(id=0001, title=hong/My-Note, author=谢禹宏, createTime=2020-01-01, views=100), Blog(id=0002, title=MyBatis-Plus, author=苞米豆, createTime=2021-04-21, views=100), Blog(id=0003, title=Hello MyBatis, author=母鸡, createTime=2021-04-21, views=120)]
## 什么都没给, 传了一个null, 进入了otherwise中
[main] [org.hong.mapper.BlogMapper.getByBlogChoose]-[DEBUG] ==>  Preparing: select * from blog WHERE author = '苞米豆' 
[main] [org.hong.mapper.BlogMapper.getByBlogChoose]-[DEBUG] ==> Parameters: 
[main] [org.hong.mapper.BlogMapper.getByBlogChoose]-[DEBUG] <==      Total: 1
[Blog(id=0002, title=MyBatis-Plus, author=苞米豆, createTime=2021-04-21, views=100)]
```



### foreach

#### 接口方法

```java
// 通过id的List集合查询多条数据
List<Blog> getByIds(List<String> ids);
```

#### 方法映射

```xml
<select id="getByIds" resultType="org.hong.pojo.Blog">
    select * from blog
    <where>
        <if test="list != null and list.size() > 0">
            <!--
                collection: 指定遍历的集合; 只能写与集合类型对应的名字,如果想使用其他名称则必须使用@param注解指定名称
                item: 将当前遍历的元素赋值给指定的变量
                separator: 元素之间的分隔符
                open: 指定开始符号
                close: 指定结束符号
                index: 遍历List的时候是index索引, item是当前值
                       遍历Map的时候index是map的key, item是map的值
            -->
            <foreach collection="collection" item="id" open="and id in(" separator="," close=")">
                #{id}
            </foreach>
        </if>
    </where>
</select>
```

#### 测试用例

```java
@Test
public void testForeach(){
    SqlSession sqlSession = MyBatisUtil.getSqlSession();
    BlogMapper mapper = sqlSession.getMapper(BlogMapper.class);

    String []ids = new String[] {"0001", "0002", "0003"};
    List<Blog> list = mapper.getByIds(Arrays.asList(ids));
    list.forEach(System.out :: println);

    sqlSession.commit();
    sqlSession.close();
}
```

#### 控制台打印

```shell
[main] [org.hong.mapper.BlogMapper.getByIds]-[DEBUG] ==>  Preparing: select * from blog WHERE id in( ? , ? , ? ) 
[main] [org.hong.mapper.BlogMapper.getByIds]-[DEBUG] ==> Parameters: 0001(String), 0002(String), 0003(String)
[main] [org.hong.mapper.BlogMapper.getByIds]-[DEBUG] <==      Total: 3
Blog(id=0001, title=hong/My-Note, author=谢禹宏, createTime=2020-01-01, views=100)
Blog(id=0002, title=MyBatis-Plus, author=苞米豆, createTime=2021-04-21, views=100)
Blog(id=0003, title=Hello MyBatis, author=母鸡, createTime=2021-04-21, views=120)
```



### Sql (抽取可重用SQL片段)

场景：在真实开发中我们不能写这样的 SQL 语句 `select * from xxx`，是不能写 `*` 的，但是每写一个查询语句都写上全部的列名，就造成了代码的冗余，而且也不易于维护。还好 MyBatis 提供了解决方案。如果表中字段发生了更改，我们只需要修改 `sql` 片段就 OK 了。

#### 接口方法

```java
List<Blog> getAll();
```

#### 方法映射

```xml
<!--
    sql: 抽取片段
    id: 唯一标识
 -->
<sql id="column">
    id, title, author, create_time, views
</sql>
<select id="getAll" resultType="org.hong.pojo.Blog">
    <!--
        include: 引入sql节点定义的sql片段
            refid: 引用指定id的sql片段
     -->
    select <include refid="column"/> from blog
</select>
```

#### 测试用例

```java
@Test
public void testSql(){
    SqlSession sqlSession = MyBatisUtil.getSqlSession();
    BlogMapper mapper = sqlSession.getMapper(BlogMapper.class);

    List<Blog> list = mapper.getAll();
    list.forEach(System.out :: println);

    sqlSession.commit();
    sqlSession.close();
}
```

#### 控制台打印

```shell
## mybatis为我们拼接上了列名
[main] [org.hong.mapper.BlogMapper.getAll]-[DEBUG] ==>  Preparing: select id, title, author, create_time, views from blog 
[main] [org.hong.mapper.BlogMapper.getAll]-[DEBUG] ==> Parameters: 
[main] [org.hong.mapper.BlogMapper.getAll]-[DEBUG] <==      Total: 5
Blog(id=0001, title=hong/My-Note, author=谢禹宏, createTime=2020-01-01, views=100)
Blog(id=0002, title=MyBatis-Plus, author=苞米豆, createTime=2021-04-21, views=100)
Blog(id=0003, title=Hello MyBatis, author=母鸡, createTime=2021-04-21, views=120)
Blog(id=0004, title=Hello Vuew, author=尤雨溪, createTime=2021-01-21, views=100)
Blog(id=0005, title=Hello Linux, author=林纳斯, createTime=2001-04-21, views=120)
```





## 缓存

### 简介

1.  什么是缓存 [ Cache ] ? 
    -   存在内存中的临时数据
    -   将用户经常查询的数据放在缓存（内存）中，用户查询数据就不用从数据库中查询，从缓存中查询，从而提高查询小龙，解决了高并发系统的性能问题。
2.  为什么使用缓存
    -   减少和数据库的交互次数，减少系统开销，提高系统效率
3.  什么样的数据能使用缓存？
    -   经常查询并且不经常改变的数据



### MyBatis缓存

-   MyBatis包含一个非常强大的查询缓存特性，它可以非常方便地定制和配置缓存。缓存可以极大的提升查询效率。
-   MyBatis系统中默认定义了两个缓存：**一级缓存**和**二级缓存**
    -   默认情况下，只有一级缓存开启。（SqlSession级别的缓存，也称为本地缓存）
    -   二级缓存需要手动开启和配置，他是基于namespace级别的缓存。
    -   为了提高拓展性，MyBatis定义了缓存接口Cache。我们可以通过实现Cache接口来定义二级缓存



### 一级缓存

-   一级缓存也叫本地缓存
    -   与数据库同一次会话期间查询到的数据会放在本地缓存中
    -   以后如果需要获取相同的数据，直接从缓存中拿，没必要再取查询数据库



### 二级缓存

-   二级缓存也叫全局缓存，一级缓存作用域太低了，所有诞生了二级缓存
-   基于namespace级别的缓存，一个名称空间对应一个二级缓存
-   工作机制
    -   一个会话查询一条数据，这个数据会被放到当前会话的一级缓存中；
    -   如果当前会话关闭了，这个会话对应的一级缓存就没了；但是我们开启了二级缓存，会话关闭了，一级缓存中的数据会被保存到二级缓存中；
    -   新的会话查询信息，就可以从二级缓存中获取内容
    -   不同的mapper查出的数据会放再自己对应的缓存中



### 缓存失效的情况

-   <span style='color:red'>不同的SqlSession</span>对应不同的一级缓存
-   同一个SqlSession但是<span style='color:red'>查询条件不同</span>
-   一个SqlSession<span style='color:red'>两次查询期间执行了任何一次增删改操作</span>
-   同一个SqlSession两次查询期间<span style='color:red'>手动清空了缓存</span>



### 二级缓存的使用

-   开启全局缓存

    ```xml
    <!-- 开启二级缓存总开关 --> 
    <setting name="cacheEnabled" value="true"/>
    ```

-   开启Mapper.xml的二级缓存

    ```xml
    <!-- 
     开启mapper下的namespace的二级缓存,
     cache标签中的所有属性都是可选的
     --> 
    <cache
           eviction="FIFO"
           flushInterval="60000"
           size="512"
           readOnly="true"/>
    ```

-   cache标签的属性

    ```
    eviction: 缓存的回收策略, 默认的是 LRU
    	LRU – 最近最少使用的:移除最长时间不被使用的对象。
    	FIFO – 先进先出:按对象进入缓存的顺序来移除它们。
    	SOFT – 软引用:移除基于垃圾回收器状态和软引用规则的对象。
    	WEAK – 弱引用:更积极地移除基于垃圾收集器状态和弱引用规则的对象。
    
    flushInterval: 缓存刷新间隔, 默认不清空
    	缓存多长时间清空一次, 设置一个毫秒值
    
    readOnly: 是否只读, 默认false
    	true: 只读, mybatis认为所有从缓存中获取数据的操作都是只读操作, 不会修改数据。mybatis为了加快获取速度, 直接就会将数据在缓存中的引用交给用户。不安全, 速度快
    	false: 非只读, mybatis觉得获取的数据可能会被修改。mybatis会利用序列化&反序列的技术克隆一份新的数据给你。安全, 速度慢。
    
    size: 缓存存放多少元素;
    
    type: 指定自定义缓存的全类名;
    ```

    

### 缓存原理图

![image-20211218122751234](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071136594.png)

### MyBatis整合ehcache

1.  导入第三方缓存jar包和与第三方缓存整合的适配包

    ```xml
    <dependency>
    	<groupId>net.sf.ehcache</groupId>
    	<artifactId>ehcache-web</artifactId>
    	<version>2.0.4</version>
    	<optional>true</optional>
    </dependency>
    ```

2.  mapper.xml 中使用自定义缓存

    ```xml
    <cache type="org.mybatis.caches.ehcache.EhcacheCache"/>
    ```






## 逆向工程 ( MBG )

`MyBatis Generator` 简称 `MBG` ，是一个专门为 `MyBatis` 框架使用者定制的**代码生成器**，可以快速的根据表生成对应的映射文件，接口，以及 `bean` 类。支持基本的增删改查，以及 `QBC` 风格的条件查询。但是表连接、存储过程等这些复杂 `sql` 的定义需要我们手工编写

**Maven**

```xml
<dependency>
    <groupId>org.mybatis.generator</groupId>
    <artifactId>mybatis-generator-core</artifactId>
    <version>1.4.0</version>
</dependency>
```

**generationConfig.xml**

```xml
<?xml version='1.0' encoding='UTF-8'?>
<!DOCTYPE generatorConfiguration
        PUBLIC "-//mybatis.org//DTD MyBatis Generator Configuration 1.0//EN"
        "http://mybatis.org/dtd/mybatis-generator-config_1_0.dtd">

<generatorConfiguration>
    <!--
        targetRuntime: 生成策略
            MyBatis3Simple: 简单版的CRUD
            MyBatis3: 豪华版的CRUD, 支持QBC风格
     -->
    <context id="mybatisGenerator" targetRuntime="MyBatis3">
        <commentGenerator>
            <!-- 是否去除自动生成的注释 true：是 ： false:否 -->
            <property name="suppressAllComments" value="true" />
        </commentGenerator>
        <!--数据库连接的信息：驱动类、连接地址、用户名、密码 -->
        <jdbcConnection driverClass="com.mysql.jdbc.Driver"
                        connectionURL="jdbc:mysql://localhost:3306/mybatis?userSSL=true&amp;useUnicode=true&amp;characterEncoding=UTF-8"
                        userId="root"
                        password="1234">
        </jdbcConnection>

        <!-- 默认false，把JDBC DECIMAL 和 NUMERIC 类型解析为 Integer，为 true时把JDBC DECIMAL 和
            NUMERIC 类型解析为java.math.BigDecimal -->
        <javaTypeResolver>
            <property name="forceBigDecimals" value="false" />
        </javaTypeResolver>

        <!-- targetProject:生成POJO类的位置 -->
        <javaModelGenerator targetPackage="org.hong.pojo"
                            targetProject=".\src\main\java">
            <!-- enableSubPackages:是否让schema作为包的后缀 -->
            <property name="enableSubPackages" value="false" />
            <!-- 从数据库返回的值被清理前后的空格 -->
            <property name="trimStrings" value="true" />
        </javaModelGenerator>
        <!-- targetProject:mapper映射文件生成的位置 -->
        <sqlMapGenerator targetPackage="org.hong.mapper"
                         targetProject=".\src\main\resources">
            <!-- enableSubPackages:是否让schema作为包的后缀 -->
            <property name="enableSubPackages" value="false" />
        </sqlMapGenerator>
        <!-- targetPackage：mapper接口生成的位置 -->
        <javaClientGenerator type="XMLMAPPER"
                             targetPackage="org.hong.mapper"
                             targetProject=".\src\main\java">
            <!-- enableSubPackages:是否让schema作为包的后缀 -->
            <property name="enableSubPackages" value="false" />
        </javaClientGenerator>
        <!-- 指定数据库表 -->
        <table tableName="blog" domainObjectName="Blog"></table>
    </context>
</generatorConfiguration>
```

**Test**

```java
public class MyBatisTest {
    // 运行这个单元测试, 自动生成
    @Test
    public void testMbg() throws IOException, XMLParserException, InvalidConfigurationException, SQLException, InterruptedException {
        List<String> warnings = new ArrayList<String>();
        boolean overwrite = true;
        File configFile = new File("IDEA使用绝对路径/generationConfig.xml");
        ConfigurationParser cp = new ConfigurationParser(warnings);
        Configuration config = cp.parseConfiguration(configFile);
        DefaultShellCallback callback = new DefaultShellCallback(overwrite);
        MyBatisGenerator myBatisGenerator = new MyBatisGenerator(config, callback, warnings);
        myBatisGenerator.generate(null);
    }

    @Test
    public void testMyBatis3(){
        SqlSession sqlSession = MyBatisUtil.getSqlSession();
        try {
            BlogMapper mapper = sqlSession.getMapper(BlogMapper.class);
            // 1.查询所有
            List<Blog> blogs = mapper.selectByExample(null);
            // 2.查询博客标题中带字母s的, 作者名字中带大字的
            // blogExample对象封装查询条件
            BlogExample blogExample = new BlogExample();
            // 3.创建Criteria, 这个Criteria就是拼装查询条件
            BlogExample.Criteria criteria = blogExample.createCriteria();
            // andXXXYYY表示添加and条件, XXX代表字段名, YYY代表条件(like,is...)
            criteria.andTitleLike("%s%");
            // 4.添加另外一组添加, 再次创建创建Criteria
            BlogExample.Criteria criteria2 = blogExample.createCriteria();
            // 设置Criteria的条件
            criteria2.andAuthorLike("%大%");
            // 5.调用or()表示这组添加与其他Criteria的关系
            blogExample.or(criteria2);
            blogs = mapper.selectByExample(blogExample);
            for (Blog blog : blogs) {
                System.out.println(blog);
            }
        } finally {
            sqlSession.close();
        }
    }
}
```

运行 `Test` 会自动生成 `mapper` 和 `pojo`，注意：移动文件后记得改配置文件的 `parameterType`、`type` 等属性。





## pageHelper 分页查询

### 环境搭建

跟动态 SQL 的环境一样

#### SQL

```mysql
DROP TABLE IF EXISTS `blog`;
CREATE TABLE `blog` (
    `id` varchar(50) NOT NULL COMMENT '博客id',
    `title` varchar(100) NOT NULL COMMENT '博客标题',
    `author` varchar(30) NOT NULL COMMENT '博客作者',
    `create_time` datetime NOT NULL COMMENT '创建时间',
    `views` int(30) NOT NULL COMMENT '浏览量',
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO `blog` VALUES ('0001', 'hong/My-Note', '谢禹宏', '2021-04-21 00:00:00', '100');
INSERT INTO `blog` VALUES ('0002', 'MyBatis-Plus', '苞米豆', '2021-04-21 00:00:00', '100');
INSERT INTO `blog` VALUES ('0003', 'Hello MyBatis', '母鸡', '2021-04-21 00:00:00', '120');
INSERT INTO `blog` VALUES ('0004', 'Hello Vuew', '尤雨溪', '2021-01-21 00:00:00', '100');
INSERT INTO `blog` VALUES ('0005', 'Hello Linux', '林纳斯', '2001-04-21 00:00:00', '120');
```

#### Maven

```xml
<dependency>
    <groupId>com.github.pagehelper</groupId>
    <artifactId>pagehelper</artifactId>
    <version>5.2.0</version>
</dependency>
```

#### 实体类

```java
package org.hong.pojo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Blog {
    private String id;
    private String title;
    private String author;
    private Date create_time;
    private Integer views;
}
```

#### MyBatisUtil 工具类

```java
package org.hong.util;

import org.apache.ibatis.io.Resources;
import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;
import org.apache.ibatis.session.SqlSessionFactoryBuilder;

import java.io.IOException;
import java.io.InputStream;

public class MyBatisUtil {

    private static SqlSessionFactory sqlSessionFactory;

    static {
        try {
            // 获取sqlSessionFactory对象
            String resource = "mybatis-config.xml";
            InputStream inputStream = Resources.getResourceAsStream(resource);
            sqlSessionFactory = new SqlSessionFactoryBuilder().build(inputStream);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    // 既然有了 SqlSessionFactory，顾名思义，我们可以从中获得 SqlSession 的实例。
    // SqlSession 提供了在数据库执行 SQL 命令所需的所有方法
    public static SqlSession getSqlSession(){
        // openSession(): 此方式打开SQL会话, 事务是开启状态
        // openSession(true): 此方式打开SQL会话, 事务是关闭状态
        return sqlSessionFactory.openSession();
    }

    public static SqlSessionFactory getSqlSessionFactory() {
        return sqlSessionFactory;
    }
}
```

#### jdbc.properties

```properties
driver=com.mysql.jdbc.Driver
url=jdbc:mysql://localhost:3306/mybatis?userSSL=true&amp;useUnicode=true&amp;characterEncoding=UTF-8
username=root
password=1234
```

#### log4j.properties

```properties
log4j.rootLogger=DEBUG,A1

log4j.appender.A1=org.apache.log4j.ConsoleAppender
log4j.appender.A1.layout=org.apache.log4j.PatternLayout
log4j.appender.A1.layout.ConversionPattern=[%t] [%c]-[%p] %m%n
```

#### MyBatis 核心配置文件

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE configuration
        PUBLIC "-//mybatis.org//DTD Config 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-config.dtd">

<!-- configuration: 核心配置文件 -->
<configuration>

    <!-- 导入外部配置文件, 放在最前面 -->
    <properties resource="jdbc.properties"/>

    <settings>
        <!-- 设置日志输出, 方便观察sql语句和参数 -->
        <setting name="logImpl" value="LOG4J"/>
        <!-- 开启驼峰命名法 -->
        <setting name="mapUnderscoreToCamelCase" value="true"/>
    </settings>

    <!--
        environments配置项目的运行环境, 可以配置多个
        default: 启用的环境
     -->
    <environments default="development">
        <environment id="development">
            <transactionManager type="JDBC"/>
            <dataSource type="POOLED">
                <!-- 数据库连接信息 -->
                <property name="driver" value="${driver}"/>
                <property name="url" value="${url}"/>
                <property name="username" value="${username}"/>
                <property name="password" value="${password}"/>
            </dataSource>
        </environment>
    </environments>

    <!-- 每一个Mapper.xml都需要在MyBatis核心配置文件中注册!!! -->
    <mappers>
        <package name="org.hong.mapper"/>
    </mappers>

</configuration>
```

#### BlogMapper.java

```java
package org.hong.mapper;

public interface BlogMapper {
    
}
```

####  BlogMapper.xml

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper
        PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-mapper.dtd">

<mapper namespace="org.hong.mapper.BlogMapper">

</mapper>
```



### 配置拦截器插件

**MyBatis 核心配置文件**

```xml
<plugins>
    <!-- com.github.pagehelper为PageHelper类所在包名 -->
    <plugin interceptor="com.github.pagehelper.PageInterceptor"></plugin>
</plugins>
```

**Spring 配置文件** ( SSM整合后的配置 )

```xml
<bean id="sqlSessionFactory" class="org.mybatis.spring.SqlSessionFactoryBean">
  <!-- 注意其他配置 -->
  <property name="plugins">
    <array>
      <bean class="com.github.pagehelper.PageInterceptor">
        <property name="properties"></property>
      </bean>
    </array>
  </property>
</bean>
```



### 接口方法

```java
@Select("select * from blog")
List<Blog> getByPage();
```



### 测试用例

```java
package org.hong.test;

import com.github.pagehelper.Page;
import com.github.pagehelper.PageHelper;
import org.apache.ibatis.session.SqlSession;
import org.hong.mapper.BlogMapper;
import org.hong.pojo.Blog;
import org.hong.util.MyBatisUtil;
import org.junit.Test;

import java.util.List;

public class PageHelperTest {
    @Test
    public void testHello(){
        SqlSession sqlSession = MyBatisUtil.getSqlSession();

        // 调用PageHelper类的startPage方法指定查询页数和每页的数量, 会返回一个page对象
        /**
         * 原理: 调用startPage方法后, PageHelper会在当前线程中绑定一个page对象, 跟返回的对象是同一个对象,
         *       然后在MyBatis执行我们的查询时, 会被PageHelper拦截, 并拿出与当前线程绑定的page对象,
         *       并修改MyBatis即将执行的sql语句, 为sql语句添加上分页的功能。
         *       为什么PageHelper会拦截MyBatis的执行, 这是MyBatis的插件机制的问题, 想要了解自己去百度。
         */
        Page<Object> page = PageHelper.startPage(2, 2);

        BlogMapper mapper = sqlSession.getMapper(BlogMapper.class);
        List<Blog> blogs = mapper.getByPage();
        blogs.forEach(System.out :: println);

        // page对象封装了查询信息
        System.out.println("当前页码:" + page.getPageNum());
        System.out.println("总记录数:" + page.getTotal());
        System.out.println("每页的记录数:" + page.getPageSize());
        System.out.println("总页码:" + page.getPages());

        sqlSession.close();
    }
}
```



### 控制台打印

```shell
## PageHelper首先会查询表中的总记录数
[main] [org.hong.mapper.BlogMapper.getByPage_COUNT]-[DEBUG] ==>  Preparing: SELECT count(0) FROM blog 
[main] [org.hong.mapper.BlogMapper.getByPage_COUNT]-[DEBUG] ==> Parameters: 
[main] [org.hong.mapper.BlogMapper.getByPage_COUNT]-[DEBUG] <==      Total: 1
## 接着MyBatis会发送被PageHelper改造过的sql语句, 进行分页查询
[main] [org.hong.mapper.BlogMapper.getByPage]-[DEBUG] ==>  Preparing: select * from blog LIMIT ?, ? 
[main] [org.hong.mapper.BlogMapper.getByPage]-[DEBUG] ==> Parameters: 2(Long), 2(Integer)
[main] [org.hong.mapper.BlogMapper.getByPage]-[DEBUG] <==      Total: 2
Blog(id=0003, title=Hello MyBatis, author=母鸡, createTime=2021-04-21, views=120)
Blog(id=0004, title=Hello Vuew, author=尤雨溪, createTime=2021-01-21, views=100)
## page对象封装的信息
当前页码:2
总记录数:5
每页的记录数:2
总页码:3
```



### 常见的使用方式

更多使用方式去看官网，知道这几种就够用了。

方式一与方式二的环境跟上面一样，只有测试用例不一样

#### 方式一 ( 推荐使用 )

```java
@Test
public void testPage1(){
    SqlSession sqlSession = MyBatisUtil.getSqlSession();

    BlogMapper mapper = sqlSession.getMapper(BlogMapper.class);
    // startPage(起始页数, 每页的数量)
    Page<Object> page = PageHelper.startPage(2, 2);
    List<Blog> blogs = mapper.getByPage();
    blogs.forEach(System.out :: println);

    sqlSession.close();
}
```

**控制台打印**

```shell
[main] [org.hong.mapper.BlogMapper.getByPage_COUNT]-[DEBUG] ==>  Preparing: SELECT count(0) FROM blog 
[main] [org.hong.mapper.BlogMapper.getByPage_COUNT]-[DEBUG] ==> Parameters: 
[main] [org.hong.mapper.BlogMapper.getByPage_COUNT]-[DEBUG] <==      Total: 1
[main] [org.hong.mapper.BlogMapper.getByPage]-[DEBUG] ==>  Preparing: select * from blog LIMIT ?, ? 
[main] [org.hong.mapper.BlogMapper.getByPage]-[DEBUG] ==> Parameters: 2(Long), 2(Integer)
[main] [org.hong.mapper.BlogMapper.getByPage]-[DEBUG] <==      Total: 2
Blog(id=0003, title=Hello MyBatis, author=母鸡, createTime=2021-04-21, views=120)
Blog(id=0004, title=Hello Vuew, author=尤雨溪, createTime=2021-01-21, views=100)
```



#### 方式二 ( 推荐使用 )

```java
@Test
public void testPage2(){
    SqlSession sqlSession = MyBatisUtil.getSqlSession();

    BlogMapper mapper = sqlSession.getMapper(BlogMapper.class);
    // offsetPage(起始索引, 查询条数)
    Page<Object> page = PageHelper.offsetPage(1, 3);
    List<Blog> blogs = mapper.getByPage();
    blogs.forEach(System.out :: println);

    sqlSession.close();
}
```

**控制台打印**

```shell
[main] [org.hong.mapper.BlogMapper.getByPage_COUNT]-[DEBUG] ==>  Preparing: SELECT count(0) FROM blog 
[main] [org.hong.mapper.BlogMapper.getByPage_COUNT]-[DEBUG] ==> Parameters: 
[main] [org.hong.mapper.BlogMapper.getByPage_COUNT]-[DEBUG] <==      Total: 1
[main] [org.hong.mapper.BlogMapper.getByPage]-[DEBUG] ==>  Preparing: select * from blog LIMIT ?, ? 
[main] [org.hong.mapper.BlogMapper.getByPage]-[DEBUG] ==> Parameters: 1(Long), 3(Integer)
[main] [org.hong.mapper.BlogMapper.getByPage]-[DEBUG] <==      Total: 3
Blog(id=0002, title=MyBatis-Plus, author=苞米豆, createTime=2021-04-21, views=100)
Blog(id=0003, title=Hello MyBatis, author=母鸡, createTime=2021-04-21, views=120)
Blog(id=0004, title=Hello Vuew, author=尤雨溪, createTime=2021-01-21, views=100)
```



#### 方式三

配置 `PageHelper` 插件时**配置 `supportMethodsArguments` 属性为 `true`**

```xml
<plugins>
    <!-- com.github.pagehelper为PageHelper类所在包名 -->
    <plugin interceptor="com.github.pagehelper.PageInterceptor">
        <property name="supportMethodsArguments" value="true"/>
    </plugin>
</plugins>
```

##### 接口方法

```java
// 我们不需要处理pageNum和pageSize
@Select("select * from blog")
List<Blog> getPageMethod(@Param("pageNum")Integer pageNum,
                         // 起始页数, 必须使用@Param注解指定key为pageNum
                         @Param("pageSize")Integer pageSize); 
// 每页数量, 必须使用@Param注解指定key为pageSize
```

##### 测试用例

```java
@Test
public void testPage3(){
    SqlSession sqlSession = MyBatisUtil.getSqlSession();

    BlogMapper mapper = sqlSession.getMapper(BlogMapper.class);
    /**
    * 注意:
    *  1.如果传入的是0或者负数, PageHelper依旧会进行分页
    *  2.如果传入的两个参数中任意一个参数为null, PageHelper将不会进行分页
    *  3.根据这个特性, 建议在声明接口方法时不要使用int, 而是使用Integer
    */
    List<Blog> blogs = mapper.getPageMethod(1, 2);
    blogs.forEach(System.out :: println);

    sqlSession.close();
}
```

##### 控制台打印

```shell
[main] [org.hong.mapper.BlogMapper.getPageMethod_COUNT]-[DEBUG] ==>  Preparing: SELECT count(0) FROM blog 
[main] [org.hong.mapper.BlogMapper.getPageMethod_COUNT]-[DEBUG] ==> Parameters: 
[main] [org.hong.mapper.BlogMapper.getPageMethod_COUNT]-[DEBUG] <==      Total: 1
[main] [org.hong.mapper.BlogMapper.getPageMethod]-[DEBUG] ==>  Preparing: select * from blog LIMIT ? 
[main] [org.hong.mapper.BlogMapper.getPageMethod]-[DEBUG] ==> Parameters: 2(Integer)
[main] [org.hong.mapper.BlogMapper.getPageMethod]-[DEBUG] <==      Total: 2
Blog(id=0001, title=hong/My-Note, author=谢禹宏, createTime=2020-01-01, views=100)
Blog(id=0002, title=MyBatis-Plus, author=苞米豆, createTime=2021-04-21, views=100)
```



#### 方式四

在实体类中声明 `pageNum` 和 `pageSize` 属性。不建议使用，侵入性太强 了。

##### 实体类

```java
package org.hong.pojo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Blog {
    private String id;
    private String title;
    private String author;
    private Date createTime;
    private Integer views;
	
    // 当实体对象中的pageNum!= null && pageSize!= null时, 会自动分页
    private Integer pageNum;
    private Integer pageSize;
}
```

##### 接口方法

```java
@Select("select * from blog")
List<Blog> getPojo(Blog blog);
```

##### 测试用例

```java
@Test
public void testPage4(){
    SqlSession sqlSession = MyBatisUtil.getSqlSession();

    BlogMapper mapper = sqlSession.getMapper(BlogMapper.class);
    Blog blog = new Blog();
    blog.setPageNum(2);
    blog.setPageSize(2);
    List<Blog> pojo = mapper.getPojo(blog);
    pojo.forEach(System.out :: println);

    sqlSession.close();
}
```

##### 控制台打印

```shell
[main] [org.hong.mapper.BlogMapper.getPojo_COUNT]-[DEBUG] ==>  Preparing: SELECT count(0) FROM blog 
[main] [org.hong.mapper.BlogMapper.getPojo_COUNT]-[DEBUG] ==> Parameters: 
[main] [org.hong.mapper.BlogMapper.getPojo_COUNT]-[DEBUG] <==      Total: 1
[main] [org.hong.mapper.BlogMapper.getPojo]-[DEBUG] ==>  Preparing: select * from blog LIMIT ?, ? 
[main] [org.hong.mapper.BlogMapper.getPojo]-[DEBUG] ==> Parameters: 2(Long), 2(Integer)
[main] [org.hong.mapper.BlogMapper.getPojo]-[DEBUG] <==      Total: 2
Blog(id=0003, title=Hello MyBatis, author=母鸡, createTime=2021-04-21, views=120, pageNum=null, pageSize=null)
Blog(id=0004, title=Hello Vuew, author=尤雨溪, createTime=2021-01-21, views=100, pageNum=null, pageSize=null)
```



### 常用的属性

-   `pageSizeZero`：默认值为 `false`，当该参数设置为 `true` 时，如果 `pageSize=0` 或者 `RowBounds.limit = 0` 就会查询出全部的结果（相当于没有执行分页查询，但是返回结果仍然是 `Page` 类型）。
-   **`reasonable`**：分页合理化参数，默认值为`false`。当该参数设置为 `true` 时，`pageNum<=0` 时会查询第一页， `pageNum>pages`（超过总数时），会查询最后一页。默认`false` 时，直接根据参数进行查询。
-   `supportMethodsArguments`：支持通过 Mapper 接口参数来传递分页参数，默认值`false`，分页插件会从查询方法的参数值中，自动根据上面 `params` 配置的字段中取值，查找到合适的值时就会自动分页。





## 批量操作

使用 `pageHelper` 分页查询的环境进行演示。

### 方法接口

```java
@Insert("insert into blog values(#{id}, #{title}, #{author}, #{createTime}, #{views})")
void save(Blog blog);
```

### 测试用例

```java
package org.hong.test;

import org.apache.ibatis.session.ExecutorType;
import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;
import org.hong.mapper.BlogMapper;
import org.hong.pojo.Blog;
import org.hong.util.MyBatisUtil;
import org.junit.Test;

import java.sql.Date;
import java.time.LocalDate;

public class BatchTest {
    @Test
    public void testBatch(){
        SqlSessionFactory sqlSessionFactory = MyBatisUtil.getSqlSessionFactory();
        // 调用openSession时传入ExecutorType枚举类的对象, 指明执行类型
        SqlSession sqlSession = sqlSessionFactory.openSession(ExecutorType.BATCH);
        try {
            long start = System.currentTimeMillis();
            BlogMapper mapper = sqlSession.getMapper(BlogMapper.class);
            for (int i = 1; i <= 100000; i++) {
                Blog blog = new Blog();
                blog.setId("00" + i);
                blog.setTitle("测试Batch" + "-" + i);
                blog.setAuthor("谢禹宏");
                blog.setCreateTime(Date.valueOf(LocalDate.now()));
                blog.setViews(i);
                mapper.save(blog);
                if(i % 500 == 0){
                    //手动每500条提交一次, 提交后无法回滚
                    sqlSession.commit();
                    //清理缓存, 防止溢出
                    sqlSession.clearCache();
                }
            }
            sqlSession.commit();
            long end = System.currentTimeMillis();
            System.out.println(end - start);
        } catch (Exception e){
            sqlSession.rollback();
        } finally {
            sqlSession.close();
        }
    }
}
```

### MyBatis-Spring 整合配置

在 `Spring` 配置文件中配置一个独立的 `SqlSession` 对象，将这个对象设置为批处理模式。

```xml
<bean id="sqlSession" class="org.mybatis.spring.SqlSessionTemplate">
    <constructor-arg name="sqlSessionFactory" ref="sqlSessionFactory"/>
    <constructor-arg name="executorType" value="BATCH"/>
</bean>
```

在 `service` 层自动装配这个对象，使用时 `getMapper` 获取需要的 `Mapper`，再进行批处理。





## SSM（Spring、SpringMVC、MyBatis）

### Maven

```xml
<dependencies>
    <dependency>
        <groupId>junit</groupId>
        <artifactId>junit</artifactId>
        <version>4.13</version>
        <scope>test</scope>
    </dependency>
    <!-- servlet -->
    <dependency>
        <groupId>javax.servlet</groupId>
        <artifactId>servlet-api</artifactId>
        <version>2.5</version>
    </dependency>
    <!-- jsp -->
    <dependency>
        <groupId>javax.servlet.jsp</groupId>
        <artifactId>jsp-api</artifactId>
        <version>2.2</version>
    </dependency>
    <!-- jstl -->
    <dependency>
        <groupId>javax.servlet</groupId>
        <artifactId>jstl</artifactId>
        <version>1.2</version>
    </dependency>
    <!-- spring-webmvc -->
    <dependency>
        <groupId>org.springframework</groupId>
        <artifactId>spring-webmvc</artifactId>
        <version>5.2.4.RELEASE</version>
    </dependency>
    <!-- spring-jdbc -->
    <dependency>
        <groupId>org.springframework</groupId>
        <artifactId>spring-jdbc</artifactId>
        <version>5.2.4.RELEASE</version>
    </dependency>
    <!-- spring-aop是基于aspect, 因此导入aspectjweaver -->
    <dependency>
        <groupId>org.apache.geronimo.bundles</groupId>
        <artifactId>aspectjweaver</artifactId>
        <version>1.6.8_2</version>
    </dependency>
    <!-- lombok -->
    <dependency>
        <groupId>org.projectlombok</groupId>
        <artifactId>lombok</artifactId>
        <version>1.18.10</version>
    </dependency>
    <!-- mysql驱动 -->
    <dependency>
        <groupId>mysql</groupId>
        <artifactId>mysql-connector-java</artifactId>
        <version>5.1.46</version>
    </dependency>
    <!-- druid -->
    <dependency>
        <groupId>com.alibaba</groupId>
        <artifactId>druid</artifactId>
        <version>1.2.4</version>
    </dependency>
    <!-- mybatis -->
    <dependency>
        <groupId>org.mybatis</groupId>
        <artifactId>mybatis</artifactId>
        <version>3.5.3</version>
    </dependency>
    <!-- 日志 -->
    <dependency>
        <groupId>log4j</groupId>
        <artifactId>log4j</artifactId>
        <version>1.2.17</version>
    </dependency>
    <!-- mybatis-spring, mybatis整合spring的jar包 -->
    <dependency>
        <groupId>org.mybatis</groupId>
        <artifactId>mybatis-spring</artifactId>
        <version>2.0.3</version>
    </dependency>
    <!-- MBG -->
    <dependency>
        <groupId>org.mybatis.generator</groupId>
        <artifactId>mybatis-generator-core</artifactId>
        <version>1.4.0</version>
    </dependency>
</dependencies>
```

### web.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<web-app xmlns="http://xmlns.jcp.org/xml/ns/javaee"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://xmlns.jcp.org/xml/ns/javaee http://xmlns.jcp.org/xml/ns/javaee/web-app_4_0.xsd"
         version="4.0">

    <!-- 1.启动Spring容器 -->
    <context-param>
        <!-- 配置Spring配置文件的位置 -->
        <param-name>contextConfigLocation</param-name>
        <param-value>classpath:applicationContext.xml</param-value>
    </context-param>
    <listener>
        <listener-class>org.springframework.web.context.ContextLoaderListener</listener-class>
    </listener>

    <!-- 2.SpringMVC的前端控制器, 拦截所有请求 -->
    <servlet>
        <servlet-name>dispatcherServlet</servlet-name>
        <servlet-class>org.springframework.web.servlet.DispatcherServlet</servlet-class>
        <init-param>
            <!-- 配置SpringMVC配置文件的位置 -->
            <param-name>contextConfigLocation</param-name>
            <param-value>classpath:spring-mvc.xml</param-value>
        </init-param>
        <!-- 设置启动级别 -->
        <load-on-startup>1</load-on-startup>
    </servlet>
    <servlet-mapping>
        <servlet-name>dispatcherServlet</servlet-name>
        <url-pattern>/</url-pattern>
    </servlet-mapping>

    <!-- 3.字符编码过滤器, 一定放在所有过滤器的前面 -->
    <filter>
        <filter-name>characterEncodingFilter</filter-name>
        <filter-class>org.springframework.web.filter.CharacterEncodingFilter</filter-class>
        <init-param>
            <!-- 设置字符集 -->
            <param-name>encoding</param-name>
            <param-value>UTF-8</param-value>
        </init-param>
        <init-param>
            <!-- 是否需要字符编码过滤器设置请求编码, 设置的字符集为encoding -->
            <param-name>forceRequestEncoding</param-name>
            <param-value>true</param-value>
        </init-param>
        <init-param>
            <!-- 是否需要字符编码过滤器设置响应编码, 设置的字符集为encoding -->
            <param-name>forceResponseEncoding</param-name>
            <param-value>true</param-value>
        </init-param>
    </filter>
    <filter-mapping>
        <filter-name>characterEncodingFilter</filter-name>
        <url-pattern>/*</url-pattern>
    </filter-mapping>

    <!-- 4.REST风格的URI -->
    <filter>
        <filter-name>hiddenHttpMethodFilter</filter-name>
        <filter-class>org.springframework.web.filter.HiddenHttpMethodFilter</filter-class>
    </filter>
    <filter-mapping>
        <filter-name>hiddenHttpMethodFilter</filter-name>
        <url-pattern>/*</url-pattern>
    </filter-mapping>

</web-app>
```

### spring-mvc.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:mvc="http://www.springframework.org/schema/mvc"
       xmlns:context="http://www.springframework.org/schema/context"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
                           http://www.springframework.org/schema/beans/spring-beans.xsd
                           http://www.springframework.org/schema/mvc
                           http://www.springframework.org/schema/mvc/spring-mvc.xsd
                           http://www.springframework.org/schema/context
                           http://www.springframework.org/schema/context/spring-context.xsd">

    <!-- SpringMVC配置文件, 包含网站跳转逻辑的控制配置 -->
    <context:component-scan base-package="org.hong" use-default-filters="false">
        <!-- 只扫描控制器 -->
        <context:include-filter type="annotation" expression="org.springframework.stereotype.Controller"/>
    </context:component-scan>

    <!-- 配置视图解析器, 方便页面返回 -->
    <bean class="org.springframework.web.servlet.view.InternalResourceViewResolver">
        <property name="prefix" value="/WEB-INF/views/"/>
        <property name="suffix" value=".jsp"/>
    </bean>

    <!-- 两个标准配置 -->
    <!-- 将SpringMVC不能处理的请求交给Tomcat -->
    <mvc:default-servlet-handler></mvc:default-servlet-handler>
    <!-- 能支持SpringMVC更高级的一些功能, JSR303校验, 快捷的ajax...映射动态请求 -->
    <mvc:annotation-driven></mvc:annotation-driven>

</beans>
```

### dbconfig.properties

```properties
jdbc.driverClassName=com.mysql.jdbc.Driver
jdbc.url=jdbc:mysql:///ssm
jdbc.username=root
jdbc.password=1234
```

### applicationContext.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:context="http://www.springframework.org/schema/context"
       xmlns:aop="http://www.springframework.org/schema/aop"
       xmlns:tx="http://www.springframework.org/schema/tx"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
       http://www.springframework.org/schema/beans/spring-beans.xsd
       http://www.springframework.org/schema/context
       http://www.springframework.org/schema/context/spring-context.xsd
       http://www.springframework.org/schema/aop
       http://www.springframework.org/schema/aop/spring-aop.xsd
       http://www.springframework.org/schema/tx
       http://www.springframework.org/schema/tx/spring-tx.xsd">

    <!-- Spring配置文件, 这里主要配置和业务逻辑有关的 -->
    <context:component-scan base-package="org.hong">
        <context:exclude-filter type="annotation" expression="org.springframework.stereotype.Controller"/>
    </context:component-scan>

    <!-- 引入外部properties文件 -->
    <context:property-placeholder location="classpath:dbconfig.properties"></context:property-placeholder>
    <!-- 数据源 -->
    <bean id="dataSource" class="com.alibaba.druid.pool.DruidDataSource">
        <property name="driverClassName" value="${jdbc.driverClassName}"/>
        <property name="url" value="${jdbc.url}"/>
        <property name="username" value="${jdbc.username}"/>
        <property name="password" value="${jdbc.password}"/>
    </bean>

    <!-- 配置MyBatis整合 -->
    <bean id="sessionFactory" class="org.mybatis.spring.SqlSessionFactoryBean">
        <!-- 指定MyBatis全局配置文件的位置 -->
        <property name="configLocation" value="classpath:mybatis-config.xml"/>
        <!-- 指定数据源 -->
        <property name="dataSource" ref="dataSource"/>
        <!-- 指定MyBatis Mapper文件的位置 -->
        <property name="mapperLocations" value="classpath:org/hong/mapper"/>
    </bean>
    <!-- 配置扫描器, 将Mapper接口生成代理注入到Spring -->
    <bean id="mapperScannerConfigurer" class="org.mybatis.spring.mapper.MapperScannerConfigurer">
        <!-- 指定mapper接口所在包 -->
        <property name="basePackage" value="org.hong.mapper"/>
        <!-- 指定sqlSessionFactoryBean配置在Spring中的id值 -->
        <property name="sqlSessionFactoryBeanName" value="sessionFactory"/>
    </bean>
    <!-- 配置一个专门用来进行Batch操作的sqlSession -->
    <bean id="sessionTemplate" class="org.mybatis.spring.SqlSessionTemplate">
        <!-- 指定sqlSessionFactory -->
        <constructor-arg name="sqlSessionFactory" ref="sessionFactory"/>
        <!-- 设置执行类型为Batch -->
        <constructor-arg name="executorType" value="BATCH"/>
    </bean>

    <!-- 事务控制 -->
    <bean id="transactionManager" class="org.springframework.jdbc.datasource.DataSourceTransactionManager">
        <!-- 控制主数据源 -->
        <property name="dataSource" ref="dataSource"/>
    </bean>
    <!-- 使用xml配置形式的事务(重要的都是使用xml) -->
    <aop:config>
        <!-- 配置切入点表达式 -->
        <aop:pointcut id="txPoint" expression="execution(* org.hong.service..*(..))"/>
        <!-- 配置事务增强 -->
        <aop:advisor advice-ref="txAdvice" pointcut-ref="txPoint"></aop:advisor>
    </aop:config>
    <!-- 配置事务增强, 事务如何切入; 并指定事务管理器, 事务管理器名称默认就是transactionManager -->
    <tx:advice id="txAdvice" transaction-manager="transactionManager">
        <tx:attributes>
            <!-- 所有方法都是事务方法 -->
            <tx:method name="*"/>
            <!-- 以get开始的方法设置只读事务, 底层有优化 -->
            <tx:method name="get*" read-only="true"/>
        </tx:attributes>
    </tx:advice>

</beans>
```

### log4j.properties

```properties
log4j.rootLogger=DEBUG,A1

log4j.appender.A1=org.apache.log4j.ConsoleAppender
log4j.appender.A1.layout=org.apache.log4j.PatternLayout
log4j.appender.A1.layout.ConversionPattern=[%t] [%c]-[%p] %m%n
```

### mybatis-config.xml

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE configuration
        PUBLIC "-//mybatis.org//DTD Config 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-config.dtd">

<!-- configuration: 核心配置文件 -->
<configuration>
    <settings>
        <!-- 开启驼峰命名法 -->
        <setting name="mapUnderscoreToCamelCase" value="true"/>
        <!-- 日志 -->
        <setting name="logImpl" value="LOG4J"/>
    </settings>
    <!-- 批量起别名 -->
    <typeAliases>
        <package name="org.hong.pojo"/>
    </typeAliases>
</configuration>
```

### 项目结构

![image-20211218122854798](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071136187.png)

### 测试 SSM

测试查询全部

#### SQL

```mysql
CREATE TABLE `tbl_dept` (
    `dept_id` INT(10) NOT NULL AUTO_INCREMENT,
    `dept_name` VARCHAR(30) DEFAULT NULL,
    PRIMARY KEY (`dept_id`)
) ENGINE=INNODB DEFAULT CHARSET=utf8;
INSERT INTO tbl_dept(`dept_id`, `dept_name`) VALUES (1, '开发部'); 
INSERT INTO tbl_dept(`dept_id`, `dept_name`) VALUES (2, '测试部'); 

CREATE TABLE `tbl_employee` (
    `emp_id` INT(10) NOT NULL AUTO_INCREMENT,
    `emp_name` VARCHAR(30) DEFAULT NULL,
    `emp_gender` VARCHAR(30) DEFAULT NULL,
    `emp_email` VARCHAR(30) DEFAULT NULL,
    `d_id` INT(10) DEFAULT NULL,
    PRIMARY KEY (`emp_id`)
) ENGINE=INNODB DEFAULT CHARSET=utf8;
INSERT INTO `tbl_employee`(`emp_id`, `emp_name`, `emp_gender`, `emp_email`, `d_id`) VALUES (1, 'Hong', '男', '190464706@qq.com', 1);
INSERT INTO `tbl_employee`(`emp_id`, `emp_name`, `emp_gender`, `emp_email`, `d_id`) VALUES (2, 'Tom', '男', 'Tom@qq.com', 2);
INSERT INTO `tbl_employee`(`emp_id`, `emp_name`, `emp_gender`, `emp_email`, `d_id`) VALUES (3, 'Jerry', '男', 'Jerry@qq.com', 1);
INSERT INTO `tbl_employee`(`emp_id`, `emp_name`, `emp_gender`, `emp_email`, `d_id`) VALUES (4, 'Bob', '男', 'Bob@qq.com', 1);
INSERT INTO `tbl_employee`(`emp_id`, `emp_name`, `emp_gender`, `emp_email`, `d_id`) VALUES (5, 'Lucy', '女', 'Lucy@qq.com', 2);
INSERT INTO `tbl_employee`(`emp_id`, `emp_name`, `emp_gender`, `emp_email`, `d_id`) VALUES (6, 'Jessica', '女', 'Jessica@qq.com', 2);
```

#### 实体类

```java
package org.hong.pojo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Dept {
    private Integer id;
    private String name;
}
```

```java
package org.hong.pojo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Employee {
    private Integer id;
    private String name;
    private String gender;
    private String email;
    private Dept dept;
}
```

#### Mapper 接口

```java
package org.hong.mapper;

public interface DeptMapper {
  
}
```

```java
package org.hong.mapper;

import org.hong.pojo.Employee;

import java.util.List;

public interface EmployeeMapper {
    List<Employee> getAll();
}
```

#### Mapper.xml 文件

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN" "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="org.hong.mapper.DeptMapper">
  <resultMap id="BaseResultMap" type="org.hong.pojo.Dept">
    <id column="dept_id" jdbcType="INTEGER" property="id" />
    <result column="dept_name" jdbcType="VARCHAR" property="name" />
  </resultMap>
</mapper>
```

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN" "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="org.hong.mapper.EmployeeMapper">
    <resultMap id="BaseResultMap" type="org.hong.pojo.Employee">
        <id column="emp_id" jdbcType="INTEGER" property="id" />
        <result column="emp_name" jdbcType="VARCHAR" property="name" />
        <result column="emp_gender" jdbcType="CHAR" property="gender" />
        <result column="emp_email" jdbcType="VARCHAR" property="email" />
    </resultMap>
    <resultMap id="EmployeeJoin" type="Employee" extends="BaseResultMap">
        <association property="dept" resultMap="org.hong.mapper.DeptMapper.BaseResultMap"></association>
    </resultMap>

    <sql id="JoinColumn">
        emp_id, emp_name, emp_gender, emp_email, dept_id, dept_name
    </sql>

    <select id="getAll" resultMap="EmployeeJoin">
        select <include refid="JoinColumn"/> from tbl_employee left join tbl_dept on d_id = dept_id
    </select>
</mapper>
```

#### service 接口

```java
package org.hong.service;

import org.hong.pojo.Employee;

import java.util.List;

public interface EmployeeService {
    List<Employee> getAll();
}
```

#### serviceimpl 实现类

```java
package org.hong.service.serviceimpl;

import org.hong.mapper.EmployeeMapper;
import org.hong.pojo.Employee;
import org.hong.service.EmployeeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EmployeeServiceImpl implements EmployeeService {
    @Autowired
    private EmployeeMapper employeeMapper;

    @Override
    public List<Employee> getAll() {
        // 使用 MyBatis-Spring 之后，你不再需要直接使用 SqlSessionFactory 了，
        // 因为你的 bean 可以被注入一个线程安全的 SqlSession，
        // 它能基于 Spring 的事务配置来自动提交、回滚、关闭 session。
        return employeeMapper.getAll();
    }
}
```

#### EmployeeController

```java
package org.hong.controller;

import org.hong.pojo.Employee;
import org.hong.service.EmployeeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.List;

@Controller
public class EmployeeController {
    @Autowired
    private EmployeeService employeeService;

    @GetMapping("/employee")
    public String getAll(Model model){
        List<Employee> employees = employeeService.getAll();
        model.addAttribute("employees", employees);
        return "list";
    }
}
```

整合完毕！！！

#### list.jsp

```jsp
<%--
    Created by IntelliJ IDEA.
    User: 谢禹宏
        Date: 2021-04-22
            Time: 10:37
                To change this template use File | Settings | File Templates.
                --%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<html>
    <head>
        <title>Title</title>
    </head>
    <body>
        <table align="center">
            <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Gender</th>
                <th>Email</th>
                <th>DeptName</th>
            </tr>
            <c:forEach items="${requestScope.employees}" var="employee">
                <tr>
                    <td>${employee.id}</td>
                    <td>${employee.name}</td>
                    <td>${employee.gender}</td>
                    <td>${employee.email}</td>
                    <td>${employee.dept.name}</td>
                </tr>
            </c:forEach>
        </table>
    </body>
</html>
```

#### 访问 `/employee`

**控制台打印**

```shell
## MyBatis-Spring帮我们创建了sqlSession对象
[http-nio-8080-exec-6] [org.mybatis.spring.SqlSessionUtils]-[DEBUG] Creating a new SqlSession
## 并且注册了一个transaction事务到sqlSession对象中
[http-nio-8080-exec-6] [org.mybatis.spring.SqlSessionUtils]-[DEBUG] Registering transaction synchronization for SqlSession [org.apache.ibatis.session.defaults.DefaultSqlSession@3a361206]
## JDBC Connection交给Spring管理
[http-nio-8080-exec-6] [org.mybatis.spring.transaction.SpringManagedTransaction]-[DEBUG] JDBC Connection [com.mysql.jdbc.JDBC4Connection@3fe4f94] will be managed by Spring
## MyBatis发送sql
[http-nio-8080-exec-6] [org.hong.mapper.EmployeeMapper.getAll]-[DEBUG] ==>  Preparing: select emp_id, emp_name, emp_gender, emp_email, dept_id, dept_name from tbl_employee left join tbl_dept on d_id = dept_id 
[http-nio-8080-exec-6] [org.hong.mapper.EmployeeMapper.getAll]-[DEBUG] ==> Parameters: 
[http-nio-8080-exec-6] [org.hong.mapper.EmployeeMapper.getAll]-[DEBUG] <==      Total: 2
## 进入事务和sqlSession释放环节
[http-nio-8080-exec-6] [org.mybatis.spring.SqlSessionUtils]-[DEBUG] Releasing transactional SqlSession [org.apache.ibatis.session.defaults.DefaultSqlSession@3a361206]
## 提交事务
[http-nio-8080-exec-6] [org.mybatis.spring.SqlSessionUtils]-[DEBUG] Transaction synchronization committing SqlSession [org.apache.ibatis.session.defaults.DefaultSqlSession@3a361206]
## 注销事务
[http-nio-8080-exec-6] [org.mybatis.spring.SqlSessionUtils]-[DEBUG] Transaction synchronization deregistering SqlSession [org.apache.ibatis.session.defaults.DefaultSqlSession@3a361206]
## 关闭sqlSession
[http-nio-8080-exec-6] [org.mybatis.spring.SqlSessionUtils]-[DEBUG] Transaction synchronization closing SqlSession [org.apache.ibatis.session.defaults.DefaultSqlSession@3a361206]
```



### SqlSessionTemplate

`SqlSessionTemplate` 是 MyBatis-Spring 的核心。**作为 `SqlSession` 的一个实现**，这意味着可以使用它无缝代替你代码中已经在使用的 `SqlSession`。 **<span style='color:red'>`SqlSessionTemplate` 是线程安全的</span >**，可以被多个 DAO 或映射器所共享使用。

当调用 SQL 方法时（包括由 `getMapper()` 方法返回的映射器中的方法），**`SqlSessionTemplate` 将会保证使用的 `SqlSession` 与当前 Spring 的事务相关。 此外，<span style='color:red'>它管理 session 的生命周期，包含必要的关闭、提交或回滚操作</span>。**另外，它也负责将 MyBatis 的异常翻译成 Spring 中的 `DataAccessExceptions`。

由于模板可以参与到 Spring 的事务管理中，并且由于其是线程安全的，可以供多个映射器类使用，你应该**总是**用 `SqlSessionTemplate` 来替换 MyBatis 默认的 `DefaultSqlSession` 实现。在同一应用程序中的不同类之间混杂使用可能会引起数据一致性的问题。

可以使用 `SqlSessionFactory` 作为构造方法的参数来创建 `SqlSessionTemplate` 对象。



**总结**

-   `SqlSessionTemplate` 是 `SqlSession` 接口的一个实现类。`SqlSessionTemplate`  就是 `SqlSession`，并且是线程安全的。
-   `SqlSessionTemplate` 会管理 `seesion` 的生命周期，包括事务的提交或回滚和 `session` 的关闭。我们使用时不需要关注 `sqlSession` 的创建、关闭和事务提交或回滚。

