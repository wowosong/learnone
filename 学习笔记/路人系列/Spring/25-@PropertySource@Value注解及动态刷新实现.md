
# @PropertySource、@Value注解及动态刷新实现

[上一篇：父子容器](http://www.itsoku.com/course/5/106)

[下一篇：国际化详解](http://www.itsoku.com/course/5/108)

疫情期间找工作确实有点难度，想拿到满意的薪资，确实要点实力啊！

面试官：Spring中的@Value用过么，介绍一下

我：@Value可以标注在字段上面，可以将外部配置文件中的数据，比如可以将数据库的一些配置信息放在配置文件中，然后通过@Value的方式将其注入到bean的一些字段中

面试官：那就是说@Value的数据来源于配置文件了？

我：嗯，我们项目最常用更多就是通过@Value来引用Properties文件中的配置

面试官：@Value数据来源还有其他方式么？

我：此时我异常开心，刚好问的我都研究过，我说：当然有，可以将配置信息放在db或者其他存储介质中，容器启动的时候，可以将这些信息加载到Environment中，@Value中应用的值最终是通过Environment来解析的，所以只需要扩展一下Environment就可以实现了。

面试官：不错嘛，看来你对spring研究的还是可以，是不是喜欢研究spring源码？

我：笑着说，嗯，平时有空的时候确实喜欢捣鼓捣鼓源码，感觉自己对spring了解的还可以，不能算精通，也算是半精通吧

面试官：看着我笑了笑，那@Value的注入的值可以动态刷新么？

我：应该可以吧，我记得springboot中有个@RefreshScope注解就可以实现你说的这个功能

面试官：那你可以说一下@RefreshScope是如何实现的么，可以大概介绍一下？

我：嗯。。。这个之前看过一点，不过没有看懂

面试官：没关系，你可以回去了再研究一下；你期望工资多少？

我：3万吧

面试官：今天的面试还算是可以的，不过如果@RefreshScope能回答上来就更好了，这块是个加分项，不过也确实有点难度，2.5万如何？

我：（心中默默想了想：2.5万，就是一个问题没有回答好，砍了5000，有点狠啊，我要回去再研究研究，3万肯定是没问题的），我说：最低2.9万

面试官：那谢谢你，今天面试就到这里，出门右拐，不送！

我有个好习惯，每次面试回去之后，都会进行复盘，把没有搞定的问题一定要想办法搞定，这样才不虚。

## 这次面试问题如下

1.  @Value的用法
2.  @Value数据来源
3.  @Value动态刷新的问题

下面我们一个个来整理一下，将这几个问题搞定，助大家在疫情期间面试能够过关斩将，拿高薪。

## @Value的用法

系统中需要连接db，连接db有很多配置信息。

系统中需要发送邮件，发送邮件需要配置邮件服务器的信息。

还有其他的一些配置信息。

我们可以将这些配置信息统一放在一个配置文件中，上线的时候由运维统一修改。

那么系统中如何使用这些配置信息呢，spring中提供了@Value注解来解决这个问题。

通常我们会将配置信息以key=value的形式存储在properties配置文件中。

通过@Value(“${配置文件中的key}”)来引用指定的key对应的value。

### @Value使用步骤

#### 步骤一：使用@PropertySource注解引入配置文件

将@PropertySource放在类上面，如下

```java
@PropertySource({"配置文件路径1","配置文件路径2"...})
```

> @PropertySource注解有个value属性，字符串数组类型，可以用来指定多个配置文件的路径。

如：

```java
@Component
@PropertySource({"classpath:com/javacode2018/lesson002/demo18/db.properties"})
public class DbConfig {
}
```

#### 步骤二：使用@Value注解引用配置文件的值

通过@Value引用上面配置文件中的值：

语法

```java
@Value("${配置文件中的key:默认值}")
@Value("${配置文件中的key}")
```

如：

```java
@Value("${password:123}")
```

> 上面如果password不存在，将123作为值

```java
@Value("${password}")
```

> 上面如果password不存在，值为${password}

假如配置文件如下

```properties
jdbc.url=jdbc:mysql://localhost:3306/javacode2018?characterEncoding=UTF-8
jdbc.username=javacode
jdbc.password=javacode
```

使用方式如下：

```java
@Value("${jdbc.url}")
private String url;

@Value("${jdbc.username}")
private String username;

@Value("${jdbc.password}")
private String password;
```

下面来看案例

#### 案例

##### 来个配置文件db.properties

```java
jdbc.url=jdbc:mysql://localhost:3306/javacode2018?characterEncoding=UTF-8
jdbc.username=javacode
jdbc.password=javacode
```

##### 来个配置类，使用@PropertySource引入上面的配置文件

```java
package com.javacode2018.lesson002.demo18.test1;

import org.springframework.beans.factory.annotation.Configurable;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.PropertySource;

@Configurable
@ComponentScan
@PropertySource({"classpath:com/javacode2018/lesson002/demo18/db.properties"})
public class MainConfig1 {
}
```

##### 来个类，使用@Value来使用配置文件中的信息

```java
package com.javacode2018.lesson002.demo18.test1;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class DbConfig {

    @Value("${jdbc.url}")
    private String url;

    @Value("${jdbc.username}")
    private String username;

    @Value("${jdbc.password}")
    private String password;

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    @Override
    public String toString() {
        return "DbConfig{" +
                "url='" + url + '\'' +
                ", username='" + username + '\'' +
                ", password='" + password + '\'' +
                '}';
    }
}
```

> 上面重点在于注解@Value注解，注意@Value注解中的

##### 来个测试用例

```java
package com.javacode2018.lesson002.demo18;

import com.javacode2018.lesson002.demo18.test1.DbConfig;
import com.javacode2018.lesson002.demo18.test1.MainConfig1;
import org.junit.Test;
import org.springframework.context.annotation.AnnotationConfigApplicationContext;

public class ValueTest {

    @Test
    public void test1() {
        AnnotationConfigApplicationContext context = new AnnotationConfigApplicationContext();
        context.register(MainConfig1.class);
        context.refresh();

        DbConfig dbConfig = context.getBean(DbConfig.class);
        System.out.println(dbConfig);
    }
}
```

##### 运行输出

```java
DbConfig{url='jdbc:mysql://localhost:3306/javacode2018?characterEncoding=UTF-8', username='javacode', password='javacode'}
```

上面用起来比较简单，很多用过的人看一眼就懂了，这也是第一个问题，多数人都是ok的，下面来看@Value中数据来源除了配置文件的方式，是否还有其他方式。

## @Value数据来源

通常情况下我们@Value的数据来源于配置文件，不过，还可以用其他方式，比如我们可以将配置文件的内容放在数据库，这样修改起来更容易一些。

我们需要先了解一下@Value中数据来源于spring的什么地方。

spring中有个类

```java
org.springframework.core.env.PropertySource
```

> 可以将其理解为一个配置源，里面包含了key->value的配置信息，可以通过这个类中提供的方法获取key对应的value信息

内部有个方法：

```java
public abstract Object getProperty(String name);
```

通过name获取对应的配置信息。

系统有个比较重要的接口

```java
org.springframework.core.env.Environment
```

用来表示环境配置信息，这个接口有几个方法比较重要

```java
String resolvePlaceholders(String text);
MutablePropertySources getPropertySources();
```

resolvePlaceholders用来解析`${text}`的，@Value注解最后就是调用这个方法来解析的。

getPropertySources返回MutablePropertySources对象，来看一下这个类

```java
public class MutablePropertySources implements PropertySources {

    private final List<PropertySource<?>> propertySourceList = new CopyOnWriteArrayList<>();

}
```

内部包含一个`propertySourceList`列表。

spring容器中会有一个`Environment`对象，最后会调用这个对象的`resolvePlaceholders`方法解析@Value。

大家可以捋一下，最终解析@Value的过程：

```java
1. 将@Value注解的value参数值作为Environment.resolvePlaceholders方法参数进行解析
2. Environment内部会访问MutablePropertySources来解析
3. MutablePropertySources内部有多个PropertySource，此时会遍历PropertySource列表，调用PropertySource.getProperty方法来解析key对应的值
```

通过上面过程，如果我们想改变@Value数据的来源，只需要将配置信息包装为PropertySource对象，丢到Environment中的MutablePropertySources内部就可以了。

下面我们就按照这个思路来一个。

来个邮件配置信息类，内部使用@Value注入邮件配置信息

```java
package com.javacode2018.lesson002.demo18.test2;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

/**
 * 邮件配置信息
 */
@Component
public class MailConfig {

    @Value("${mail.host}")
    private String host;

    @Value("${mail.username}")
    private String username;

    @Value("${mail.password}")
    private String password;

    public String getHost() {
        return host;
    }

    public void setHost(String host) {
        this.host = host;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    @Override
    public String toString() {
        return "MailConfig{" +
                "host='" + host + '\'' +
                ", username='" + username + '\'' +
                ", password='" + password + '\'' +
                '}';
    }
}
```

再来个类`DbUtil`，`getMailInfoFromDb`方法模拟从db中获取邮件配置信息，存放在map中

```java
package com.javacode2018.lesson002.demo18.test2;

import java.util.HashMap;
import java.util.Map;

public class DbUtil {
    /**
     * 模拟从db中获取邮件配置信息
     *
     * @return
     */
    public static Map<String, Object> getMailInfoFromDb() {
        Map<String, Object> result = new HashMap<>();
        result.put("mail.host", "smtp.qq.com");
        result.put("mail.username", "路人");
        result.put("mail.password", "123");
        return result;
    }
}
```

来个spring配置类

```java
package com.javacode2018.lesson002.demo18.test2;

import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;

@Configuration
@ComponentScan
public class MainConfig2 {
}
```

下面是重点代码

```java
@Test
public void test2() {
    AnnotationConfigApplicationContext context = new AnnotationConfigApplicationContext();

    /*下面这段是关键 start*/
    //模拟从db中获取配置信息
    Map<String, Object> mailInfoFromDb = DbUtil.getMailInfoFromDb();
    //将其丢在MapPropertySource中（MapPropertySource类是spring提供的一个类，是PropertySource的子类）
    MapPropertySource mailPropertySource = new MapPropertySource("mail", mailInfoFromDb);
    //将mailPropertySource丢在Environment中的PropertySource列表的第一个中，让优先级最高
    context.getEnvironment().getPropertySources().addFirst(mailPropertySource);
    /*上面这段是关键 end*/

    context.register(MainConfig2.class);
    context.refresh();
    MailConfig mailConfig = context.getBean(MailConfig.class);
    System.out.println(mailConfig);
}
```

> 注释比较详细，就不详细解释了。

直接运行，看效果

```java
MailConfig{host='smtp.qq.com', username='路人', password='123'}
```

有没有感觉很爽，此时你们可以随意修改`DbUtil.getMailInfoFromDb`，具体数据是从db中来，来时从redis或者其他介质中来，任由大家发挥。

上面重点是下面这段代码，大家需要理解

```java
/*下面这段是关键 start*/
//模拟从db中获取配置信息
Map<String, Object> mailInfoFromDb = DbUtil.getMailInfoFromDb();
//将其丢在MapPropertySource中（MapPropertySource类是spring提供的一个类，是PropertySource的子类）
MapPropertySource mailPropertySource = new MapPropertySource("mail", mailInfoFromDb);
//将mailPropertySource丢在Environment中的PropertySource列表的第一个中，让优先级最高
context.getEnvironment().getPropertySources().addFirst(mailPropertySource);
/*上面这段是关键 end*/
```

咱们继续看下一个问题

**如果我们将配置信息放在db中，可能我们会通过一个界面来修改这些配置信息，然后保存之后，希望系统在不重启的情况下，让这些值在spring容器中立即生效。**

@Value动态刷新的问题的问题，springboot中使用@RefreshScope实现了。

## 实现@Value动态刷新

### 先了解一个知识点

这块需要先讲一个知识点，用到的不是太多，所以很多人估计不太了解，但是非常重要的一个点，我们来看一下。

这个知识点是`自定义bean作用域`，对这块不了解的先看一下这篇文章：[bean作用域详解](https://mp.weixin.qq.com/s?__biz=MzA5MTkxMDQ4MQ==&mid=2648933960&idx=1&sn=f4308f8955f87d75963c379c2a0241f4&chksm=88621e76bf159760d404c253fa6716d3ffce4de8df0fc1d0d5dd0cf00a81bc170a30829ee58f&token=1314297026&lang=zh_CN&scene=21#wechat_redirect)

bean作用域中有个地方没有讲，来看一下@Scope这个注解的源码，有个参数是：

```java
ScopedProxyMode proxyMode() default ScopedProxyMode.DEFAULT;
```

这个参数的值是个ScopedProxyMode类型的枚举，值有下面4中

```java
public enum ScopedProxyMode {
    DEFAULT,
    NO,
    INTERFACES,
    TARGET_CLASS;
}
```

前面3个，不讲了，直接讲最后一个值是干什么的。

当@Scope中proxyMode为TARGET\_CLASS的时候，会给当前创建的bean通过cglib生成一个代理对象，通过这个代理对象来访问目标bean对象。

理解起来比较晦涩，还是来看代码吧，容易理解一些，来个自定义的Scope案例。

**自定义一个bean作用域的注解**

```java
package com.javacode2018.lesson002.demo18.test3;

import org.springframework.context.annotation.Scope;
import org.springframework.context.annotation.ScopedProxyMode;

import java.lang.annotation.*;

@Target({ElementType.TYPE, ElementType.METHOD})
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Scope(BeanMyScope.SCOPE_MY) //@1
public @interface MyScope {
    /**
     * @see Scope#proxyMode()
     */
    ScopedProxyMode proxyMode() default ScopedProxyMode.TARGET_CLASS;//@2
}
```

> @1：使用了@Scope注解，value为引用了一个常量，值为my，一会下面可以看到。
> 
> @2：注意这个地方，参数名称也是proxyMode，类型也是ScopedProxyMode，而@Scope注解中有个和这个同样类型的参数，spring容器解析的时候，会将这个参数的值赋给@MyScope注解上面的@Scope注解的proxyMode参数，所以此处我们设置proxyMode值，最后的效果就是直接改变了@Scope中proxyMode参数的值。此处默认值取的是ScopedProxyMode.TARGET\_CLASS

**@MyScope注解对应的Scope实现如下**

```java
package com.javacode2018.lesson002.demo18.test3;

import org.springframework.beans.factory.ObjectFactory;
import org.springframework.beans.factory.config.Scope;
import org.springframework.lang.Nullable;

/**
 * @see MyScope 作用域的实现
 */
public class BeanMyScope implements Scope {

    public static final String SCOPE_MY = "my"; //@1

    @Override
    public Object get(String name, ObjectFactory<?> objectFactory) { 
        System.out.println("BeanMyScope >>>>>>>>> get:" + name); //@2
        return objectFactory.getObject(); //@3
    }

    @Nullable
    @Override
    public Object remove(String name) {
        return null;
    }

    @Override
    public void registerDestructionCallback(String name, Runnable callback) {

    }

    @Nullable
    @Override
    public Object resolveContextualObject(String key) {
        return null;
    }

    @Nullable
    @Override
    public String getConversationId() {
        return null;
    }
}
```

> @1：定义了一个常量，作为作用域的值
> 
> @2：这个get方法是关键，自定义作用域会自动调用这个get方法来创建bean对象，这个地方输出了一行日志，为了一会方便看效果
> 
> @3：通过objectFactory.getObject()获取bean实例返回。

**下面来创建个类，作用域为上面自定义的作用域**

```java
package com.javacode2018.lesson002.demo18.test3;

import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
@MyScope //@1 
public class User {

    private String username;

    public User() { 
        System.out.println("---------创建User对象" + this); //@2
        this.username = UUID.randomUUID().toString(); //@3
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

}
```

> @1：使用了自定义的作用域@MyScope
> 
> @2：构造函数中输出一行日志
> 
> @3：给username赋值，通过uuid随机生成了一个

**来个spring配置类，加载上面@Component标注的组件**

```java
package com.javacode2018.lesson002.demo18.test3;

import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;

@ComponentScan
@Configuration
public class MainConfig3 {
}
```

**下面重点来了，测试用例**

```java
@Test
public void test3() throws InterruptedException {
    AnnotationConfigApplicationContext context = new AnnotationConfigApplicationContext();
    //将自定义作用域注册到spring容器中
    context.getBeanFactory().registerScope(BeanMyScope.SCOPE_MY, new BeanMyScope());//@1
    context.register(MainConfig3.class);
    context.refresh();

    System.out.println("从容器中获取User对象");
    User user = context.getBean(User.class); //@2
    System.out.println("user对象的class为：" + user.getClass()); //@3

    System.out.println("多次调用user的getUsername感受一下效果\n");
    for (int i = 1; i <= 3; i++) {
        System.out.println(String.format("********\n第%d次开始调用getUsername", i));
        System.out.println(user.getUsername());
        System.out.println(String.format("第%d次调用getUsername结束\n********\n", i));
    }
}
```

> @1：将自定义作用域注册到spring容器中
> 
> @2：从容器中获取User对应的bean
> 
> @3：输出这个bean对应的class，一会认真看一下，这个类型是不是User类型的
> 
> 代码后面又搞了3次循环，调用user的getUsername方法，并且方法前后分别输出了一行日志。

**见证奇迹的时候到了，运行输出**

```java
从容器中获取User对象
user对象的class为：class com.javacode2018.lesson002.demo18.test3.User$$EnhancerBySpringCGLIB$$80233127
多次调用user的getUsername感受一下效果

********
第1次开始调用getUsername
BeanMyScope >>>>>>>>> get:scopedTarget.user
---------创建User对象com.javacode2018.lesson002.demo18.test3.User@6a370f4
7b41aa80-7569-4072-9d40-ec9bfb92f438
第1次调用getUsername结束
********

********
第2次开始调用getUsername
BeanMyScope >>>>>>>>> get:scopedTarget.user
---------创建User对象com.javacode2018.lesson002.demo18.test3.User@1613674b
01d67154-95f6-44bb-93ab-05a34abdf51f
第2次调用getUsername结束
********

********
第3次开始调用getUsername
BeanMyScope >>>>>>>>> get:scopedTarget.user
---------创建User对象com.javacode2018.lesson002.demo18.test3.User@27ff5d15
76d0e86f-8331-4303-aac7-4acce0b258b8
第3次调用getUsername结束
********
```

从输出的前2行可以看出：

1.  调用context.getBean(User.class)从容器中获取bean的时候，此时并没有调用User的构造函数去创建User对象
    
2.  第二行输出的类型可以看出，getBean返回的user对象是一个cglib代理对象。
    

**后面的日志输出可以看出，每次调用user.getUsername方法的时候，内部自动调用了BeanMyScope#get 方法和 User的构造函数。**

**通过上面的案例可以看出，当自定义的Scope中proxyMode=ScopedProxyMode.TARGET\_CLASS的时候，会给这个bean创建一个代理对象，调用代理对象的任何方法，都会调用这个自定义的作用域实现类（上面的BeanMyScope）中get方法来重新来获取这个bean对象。**

### 动态刷新@Value具体实现

那么我们可以利用上面讲解的这种特性来实现@Value的动态刷新，可以实现一个自定义的Scope，这个自定义的Scope支持@Value注解自动刷新，需要使用@Value注解自动刷新的类上面可以标注这个自定义的注解，当配置修改的时候，调用这些bean的任意方法的时候，就让spring重启初始化一下这个bean，这个思路就可以实现了，下面我们来写代码。

#### 先来自定义一个Scope：RefreshScope

```java
package com.javacode2018.lesson002.demo18.test4;

import org.springframework.context.annotation.Scope;
import org.springframework.context.annotation.ScopedProxyMode;

import java.lang.annotation.*;

@Target({ElementType.TYPE, ElementType.METHOD})
@Retention(RetentionPolicy.RUNTIME)
@Scope(BeanRefreshScope.SCOPE_REFRESH)
@Documented
public @interface RefreshScope {
    ScopedProxyMode proxyMode() default ScopedProxyMode.TARGET_CLASS; //@1
}
```

> 要求标注@RefreshScope注解的类支持动态刷新@Value的配置
> 
> @1：这个地方是个关键，使用的是ScopedProxyMode.TARGET\_CLASS

#### 这个自定义Scope对应的解析类

下面类中有几个无关的方法去掉了，可以忽略

```java
package com.javacode2018.lesson002.demo18.test4;


import org.springframework.beans.factory.ObjectFactory;
import org.springframework.beans.factory.config.Scope;
import org.springframework.lang.Nullable;

import java.util.concurrent.ConcurrentHashMap;

public class BeanRefreshScope implements Scope {

    public static final String SCOPE_REFRESH = "refresh";

    private static final BeanRefreshScope INSTANCE = new BeanRefreshScope();

    //来个map用来缓存bean
    private ConcurrentHashMap<String, Object> beanMap = new ConcurrentHashMap<>(); //@1

    private BeanRefreshScope() {
    }

    public static BeanRefreshScope getInstance() {
        return INSTANCE;
    }

    /**
     * 清理当前
     */
    public static void clean() {
        INSTANCE.beanMap.clear();
    }

    @Override
    public Object get(String name, ObjectFactory<?> objectFactory) {
        Object bean = beanMap.get(name);
        if (bean == null) {
            bean = objectFactory.getObject();
            beanMap.put(name, bean);
        }
        return bean;
    }

}
```

> 上面的get方法会先从beanMap中获取，获取不到会调用objectFactory的getObject让spring创建bean的实例，然后丢到beanMap中
> 
> 上面的clean方法用来清理beanMap中当前已缓存的所有bean

#### 来个邮件配置类，使用@Value注解注入配置，这个bean作用域为自定义的@RefreshScope

```java
package com.javacode2018.lesson002.demo18.test4;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

/**
 * 邮件配置信息
 */
@Component
@RefreshScope //@1
public class MailConfig {

    @Value("${mail.username}") //@2
    private String username;

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    @Override
    public String toString() {
        return "MailConfig{" +
                "username='" + username + '\'' +
                '}';
    }
}
```

> @1：使用了自定义的作用域@RefreshScope
> 
> @2：通过@Value注入mail.username对一个的值
> 
> 重写了toString方法，一会测试时候可以看效果。

#### 再来个普通的bean，内部会注入MailConfig

```java
package com.javacode2018.lesson002.demo18.test4;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class MailService {
    @Autowired
    private MailConfig mailConfig;

    @Override
    public String toString() {
        return "MailService{" +
                "mailConfig=" + mailConfig +
                '}';
    }
}
```

代码比较简单，重写了toString方法，一会测试时候可以看效果。

#### 来个类，用来从db中获取邮件配置信息

```java
package com.javacode2018.lesson002.demo18.test4;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

public class DbUtil {
    /**
     * 模拟从db中获取邮件配置信息
     *
     * @return
     */
    public static Map<String, Object> getMailInfoFromDb() {
        Map<String, Object> result = new HashMap<>();
        result.put("mail.username", UUID.randomUUID().toString());
        return result;
    }
}
```

#### 来个spring配置类，扫描加载上面的组件

```java
package com.javacode2018.lesson002.demo18.test4;

import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;

@Configuration
@ComponentScan
public class MainConfig4 {
}
```

#### 来个工具类

内部有2个方法，如下：

```java
package com.javacode2018.lesson002.demo18.test4;

import org.springframework.context.support.AbstractApplicationContext;
import org.springframework.core.env.MapPropertySource;

import java.util.Map;

public class RefreshConfigUtil {
    /**
     * 模拟改变数据库中都配置信息
     */
    public static void updateDbConfig(AbstractApplicationContext context) {
        //更新context中的mailPropertySource配置信息
        refreshMailPropertySource(context);

        //清空BeanRefreshScope中所有bean的缓存
        BeanRefreshScope.getInstance().clean();
    }

    public static void refreshMailPropertySource(AbstractApplicationContext context) {
        Map<String, Object> mailInfoFromDb = DbUtil.getMailInfoFromDb();
        //将其丢在MapPropertySource中（MapPropertySource类是spring提供的一个类，是PropertySource的子类）
        MapPropertySource mailPropertySource = new MapPropertySource("mail", mailInfoFromDb);
        context.getEnvironment().getPropertySources().addFirst(mailPropertySource);
    }

}
```

> updateDbConfig方法模拟修改db中配置的时候需要调用的方法，方法中2行代码，第一行代码调用refreshMailPropertySource方法修改容器中邮件的配置信息
> 
> BeanRefreshScope.getInstance().clean()用来清除BeanRefreshScope中所有已经缓存的bean，那么调用bean的任意方法的时候，会重新出发spring容器来创建bean，spring容器重新创建bean的时候，会重新解析@Value的信息，此时容器中的邮件配置信息是新的，所以@Value注入的信息也是新的。

来个测试用例

```java
@Test
public void test4() throws InterruptedException {
    AnnotationConfigApplicationContext context = new AnnotationConfigApplicationContext();
    context.getBeanFactory().registerScope(BeanRefreshScope.SCOPE_REFRESH, BeanRefreshScope.getInstance());
    context.register(MainConfig4.class);
    //刷新mail的配置到Environment
    RefreshConfigUtil.refreshMailPropertySource(context);
    context.refresh();

    MailService mailService = context.getBean(MailService.class);
    System.out.println("配置未更新的情况下,输出3次");
    for (int i = 0; i < 3; i++) { //@1
        System.out.println(mailService);
        TimeUnit.MILLISECONDS.sleep(200);
    }

    System.out.println("模拟3次更新配置效果");
    for (int i = 0; i < 3; i++) { //@2
        RefreshConfigUtil.updateDbConfig(context); //@3
        System.out.println(mailService);
        TimeUnit.MILLISECONDS.sleep(200);
    }
}
```

> @1：循环3次，输出mailService的信息
> 
> @2：循环3次，内部先通过@3来模拟更新db中配置信息，然后在输出mailService信息

#### 见证奇迹的时刻，来看效果

```java
配置未更新的情况下,输出3次
MailService{mailConfig=MailConfig{username='df321543-8ca7-4563-993a-bd64cbf50d53'}}
MailService{mailConfig=MailConfig{username='df321543-8ca7-4563-993a-bd64cbf50d53'}}
MailService{mailConfig=MailConfig{username='df321543-8ca7-4563-993a-bd64cbf50d53'}}
模拟3次更新配置效果
MailService{mailConfig=MailConfig{username='6bab8cea-9f4f-497d-a23a-92f15d0d6e34'}}
MailService{mailConfig=MailConfig{username='581bf395-f6b8-4b87-84e6-83d3c7342ca2'}}
MailService{mailConfig=MailConfig{username='db337f54-20b0-4726-9e55-328530af6999'}}
```

> 上面MailService输出了6次，前3次username的值都是一样的，后面3次username的值不一样了，说明修改配置起效了。

### 小结

动态@Value实现的关键是@Scope中proxyMode参数，值为ScopedProxyMode.DEFAULT，会生成一个代理，通过这个代理来实现@Value动态刷新的效果，这个地方是关键。

有兴趣的可以去看一下springboot中的@RefreshScope注解源码，和我们上面自定义的@RefreshScope类似，实现原理类似的。

#### 

## 总结

本次面试过程中3个问题，我们都搞定了，希望你也已经掌握了，有问题的欢迎给我留言，交流！

## 案例源码

```java
https://gitee.com/javacode2018/spring-series
```

[下一篇：国际化详解](http://www.itsoku.com/course/5/108)

[上一篇：父子容器](http://www.itsoku.com/course/5/106)