
# @Conditional通过条件来控制bean的注册

[上一篇：@Import 注解详解](http://www.itsoku.com/course/5/101)

[下一篇：注解实现依赖注入（@Autowired、@Resource、@Primary、@Qulifier）](http://www.itsoku.com/course/5/103)

## 先看几个问题

1.  @Conditional是做什么的?
2.  @Conditional多个条件是什么逻辑关系？
3.  条件判断在什么时候执行？
4.  ConfigurationCondition和Condition有什么区别？什么时候使用ConfigurationCondition？
5.  多个Condition执行的顺序是什么样的？可以配置优先级么？
6.  可以介绍一下@Conditional常见的一些用法么？

## @Conditional注解

**@Conditional注解是从spring4.0才有的，可以用在任何类型或者方法上面，通过@Conditional注解可以配置一些条件判断，当所有条件都满足的时候，被@Conditional标注的目标才会被spring容器处理。**

比如可以通过@Conditional来控制bean是否需要注册，控制被@Configuration标注的配置类是需要需要被解析等。

效果就像这段代码，相当于在spring容器解析目标前面加了一个条件判断：

```java
if(@Conditional中配置的多个条件是否都匹配){
//spring继续处理被@Conditional注解标注的对象
}
```

@Conditional源码：

```java
@Target({ElementType.TYPE, ElementType.METHOD})
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface Conditional {
    Class<? extends Condition>[] value();
}
```

这个注解只有一个value参数，Condition类型的数组，Condition是一个接口，表示一个条件判断，内部有个方法返回true或false，当所有Condition都成立的时候，@Conditional的结果才成立。

下面我们来看一下Condition接口。

## Condition接口

用来表示条件判断的接口，源码如下：

```java
@FunctionalInterface
public interface Condition {

    /**
     * 判断条件是否匹配
     * context:条件判断上下文
     */
    boolean matches(ConditionContext context, AnnotatedTypeMetadata metadata);

}
```

是一个函数式接口，内部只有一个matches方法，用来判断条件是否成立的，2个参数：

*   context：条件上下文，ConditionContext接口类型的，可以用来获取容器中的个人信息
*   metadata：用来获取被@Conditional标注的对象上的所有注解信息

## ConditionContext接口

这个接口中提供了一些常用的方法，可以用来获取spring容器中的各种信息，看一下源码：

```java
public interface ConditionContext {

    /**
     * 返回bean定义注册器，可以通过注册器获取bean定义的各种配置信息
     */
    BeanDefinitionRegistry getRegistry();

    /**
     * 返回ConfigurableListableBeanFactory类型的bean工厂，相当于一个ioc容器对象
     */
    @Nullable
    ConfigurableListableBeanFactory getBeanFactory();

    /**
     * 返回当前spring容器的环境配置信息对象
     */
    Environment getEnvironment();

    /**
     * 返回资源加载器
     */
    ResourceLoader getResourceLoader();

    /**
     * 返回类加载器
     */
    @Nullable
    ClassLoader getClassLoader();

}
```

## 比较关键性的问题：条件判断在什么时候执行？

Spring对配置类的处理主要分为2个阶段：

### 配置类解析阶段

会得到一批配置类的信息，和一些需要注册的bean

### bean注册阶段

将配置类解析阶段得到的配置类和需要注册的bean注册到spring容器中

### 看一下什么是配置类

类中有下面任意注解之一的就属于配置类：

1.  类上有@Compontent注解
2.  类上有@Configuration注解
3.  类上有@CompontentScan注解
4.  类上有@Import注解
5.  类上有@ImportResource注解
6.  类中有@Bean标注的方法

> 判断一个类是不是一个配置类，是否的是下面这个方法，有兴趣的可以看一下：
> 
> org.springframework.context.annotation.ConfigurationClassUtils#isConfigurationCandidate

spring中处理这2个过程会循环进行，直到完成所有配置类的解析及所有bean的注册。

### Spring对配置类处理过程

源码位置：

```java
org.springframework.context.annotation.ConfigurationClassPostProcessor#processConfigBeanDefinitions
```

整个过程大致的过程如下：

1.  通常我们会通过new AnnotationConfigApplicationContext()传入多个配置类来启动spring容器
2.  spring对传入的多个配置类进行解析
3.  配置类解析阶段：这个过程就是处理配置类上面6中注解的过程，此过程中又会发现很多新的配置类，比如@Import导入的一批新的类刚好也符合配置类，而被@CompontentScan扫描到的一些类刚好也是配置类；此时会对这些新产生的配置类进行同样的过程解析
4.  bean注册阶段：配置类解析后，会得到一批配置类和一批需要注册的bean，此时spring容器会将这批配置类作为bean注册到spring容器，同样也会将这批需要注册的bean注册到spring容器
5.  经过上面第3个阶段之后，spring容器中会注册很多新的bean，这些新的bean中可能又有很多新的配置类
6.  Spring从容器中将所有bean拿出来，遍历一下，会过滤得到一批未处理的新的配置类，继续交给第3步进行处理
7.  step3到step6，这个过程会经历很多次，直到完成所有配置类的解析和bean的注册

从上面过程中可以了解到：

1.  可以在配置类上面加上@Conditional注解，来控制是否需要解析这个配置类，配置类如果不被解析，那么这个配置上面6种注解的解析都会被跳过
2.  可以在被注册的bean上面加上@Conditional注解，来控制这个bean是否需要注册到spring容器中
3.  如果配置类不会被注册到容器，那么这个配置类解析所产生的所有新的配置类及所产生的所有新的bean都不会被注册到容器

一个配置类被spring处理有2个阶段：配置类解析阶段、bean注册阶段（将配置类作为bean被注册到spring容器)。

如果将Condition接口的实现类作为配置类上@Conditional中，那么这个条件会对两个阶段都有效，此时通过Condition是无法精细的控制某个阶段的，如果想控制某个阶段，比如可以让他解析，但是不能让他注册，此时就就需要用到另外一个接口了：ConfigurationCondition

## ConfigurationCondition接口

看一下这个接口的源码：

```java
public interface ConfigurationCondition extends Condition {

    /**
     * 条件判断的阶段，是在解析配置类的时候过滤还是在创建bean的时候过滤
     */
    ConfigurationPhase getConfigurationPhase();


    /**
     * 表示阶段的枚举：2个值
     */
    enum ConfigurationPhase {

        /**
         * 配置类解析阶段，如果条件为false，配置类将不会被解析
         */
        PARSE_CONFIGURATION,

        /**
         * bean注册阶段，如果为false，bean将不会被注册
         */
        REGISTER_BEAN
    }

}
```

ConfigurationCondition接口相对于Condition接口多了一个getConfigurationPhase方法，用来指定条件判断的阶段，是在解析配置类的时候过滤还是在创建bean的时候过滤。

## @Conditional使用的3步骤

1.  自定义一个类，实现Condition或ConfigurationCondition接口，实现matches方法
2.  在目标对象上使用@Conditional注解，并指定value的指为自定义的Condition类型
3.  启动spring容器加载资源，此时@Conditional就会起作用了

## 案例1：阻止配置类的处理

在配置类上面使用@Conditional，这个注解的value指定的Condition当有一个为false的时候，spring就会跳过处理这个配置类。

自定义一个Condition类：

```java
package com.javacode2018.lesson001.demo25.test3;

import org.springframework.context.annotation.Condition;
import org.springframework.context.annotation.ConditionContext;
import org.springframework.core.type.AnnotatedTypeMetadata;

public class MyCondition1 implements Condition {
    @Override
    public boolean matches(ConditionContext context, AnnotatedTypeMetadata metadata) {
        return false;
    }
}
```

matches方法内部我们可以随意发挥，此处为了演示效果就直接返回false。

来个配置类，在配置类上面使用上面这个条件，此时会让配置类失效，如下：

```java
package com.javacode2018.lesson001.demo25.test3;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Conditional;
import org.springframework.context.annotation.Configuration;

@Conditional(MyCondition1.class) //@1
@Configuration
public class MainConfig3 {
    @Bean
    public String name() { //@1
        return "  喔喔松Java";
    }
}
```

> @1：使用了自定义的条件类
> 
> @2：通过@Bean标注这name这个方法，如果这个配置类成功解析，会将name方法的返回值作为bean注册到spring容器

来个测试类，启动spring容器加载MainConfig3配置类，如下：

```java
package com.javacode2018.lesson001.demo25;

import com.javacode2018.lesson001.demo25.test3.MainConfig3;
import org.junit.Test;
import org.springframework.context.annotation.AnnotationConfigApplicationContext;

import java.util.Map;

public class ConditionTest {

    @Test
    public void test3() {
        AnnotationConfigApplicationContext context = new AnnotationConfigApplicationContext(MainConfig3.class);
        Map<String, String> serviceMap = context.getBeansOfType(String.class);
        serviceMap.forEach((beanName, bean) -> {
            System.out.println(String.format("%s->%s", beanName, bean));
        });
    }
}
```

test3中，从容器中获取String类型的bean，运行test3没有任何输出。

我们可以将MainConfig3上面的@Conditional去掉，再次运行输出：

```plain
name->  喔喔松Java
```

## 案例2：阻止bean的注册

来个配置类，如下：

```java
package com.javacode2018.lesson001.demo25.test4;

import com.javacode2018.lesson001.demo25.test3.MyCondition1;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Conditional;
import org.springframework.context.annotation.Configuration;

@Configuration
public class MainConfig4 {
    @Conditional(MyCondition1.class) //@1
    @Bean
    public String name() {
        return "  喔喔松Java";
    }

    @Bean
    public String address() {
        return "上海市";
    }
}
```

上面2个方法上面使用了@Bean注解来定义了2个bean，name方法上面使用了@Conditional注解，这个条件会在name这个bean注册到容器之前会进行判断，当条件为true的时候，name这个bean才会被注册到容器。

ConditionTest中新增个测试用例来加载上面这个配置类，从容器中获取String类型所有bean输出，代码如下：

```java
@Test
public void test4() {
    AnnotationConfigApplicationContext context = new AnnotationConfigApplicationContext(MainConfig4.class);
    Map<String, String> serviceMap = context.getBeansOfType(String.class);
    serviceMap.forEach((beanName, bean) -> {
        System.out.println(String.format("%s->%s", beanName, bean));
    });
}
```

运行输出：

```java
address->上海市
```

可以看到容器中只有一个address被注册了，而name这个bean没有被注册。

## 案例3：bean不存在的时候才注册

### 需求

IService接口有两个实现类Service1和Service1，这两个类会放在2个配置类中通过@Bean的方式来注册到容器，此时我们想加个限制，只允许有一个IService类型的bean被注册到容器。

可以在@Bean标注的2个方法上面加上条件限制，当容器中不存在IService类型的bean时，才将这个方法定义的bean注册到容器，下面来看代码实现。

### 代码实现

#### 条件判断类：OnMissingBeanCondition

```java
package com.javacode2018.lesson001.demo25.test1;

import org.springframework.beans.factory.config.ConfigurableListableBeanFactory;
import org.springframework.context.annotation.Condition;
import org.springframework.context.annotation.ConditionContext;
import org.springframework.context.annotation.ConfigurationCondition;
import org.springframework.core.type.AnnotatedTypeMetadata;

import java.util.Map;

public class OnMissingBeanCondition implements Condition {
    @Override
    public boolean matches(ConditionContext context, AnnotatedTypeMetadata metadata) {
        //获取bean工厂
        ConfigurableListableBeanFactory beanFactory = context.getBeanFactory();
        //从容器中获取IService类型bean
        Map<String, IService> serviceMap = beanFactory.getBeansOfType(IService.class);
        //判断serviceMap是否为空
        return serviceMap.isEmpty();
    }

}
```

> 上面matches方法中会看容器中是否存在IService类型的bean，不存在的时候返回true

#### IService接口

```java
package com.javacode2018.lesson001.demo25.test1;

public interface IService {
}
```

#### 接口有2个实现类

##### Service1

```java
package com.javacode2018.lesson001.demo25.test1;

public class Service1 implements IService {
}
```

##### Service2

```java
package com.javacode2018.lesson001.demo25.test1;

public class Service2 implements IService {
}
```

#### 来一个配置类负责注册Service1到容器

```java
package com.javacode2018.lesson001.demo25.test1;


import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Conditional;
import org.springframework.context.annotation.Configuration;

@Configuration
public class BeanConfig1 {
    @Conditional(OnMissingBeanCondition.class) //@1
    @Bean
    public IService service1() {
        return new Service1();
    }
}
```

> @1：方法之前使用了条件判断

#### 再来一个配置类负责注册Service2到容器

```java
package com.javacode2018.lesson001.demo25.test1;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Conditional;
import org.springframework.context.annotation.Configuration;

@Configuration
public class BeanConfig2 {
    @Conditional(OnMissingBeanCondition.class)//@1
    @Bean
    public IService service2() {
        return new Service2();
    }
}
```

> @1：方法之前使用了条件判断

#### 来一个总的配置类，导入另外2个配置类

```java
package com.javacode2018.lesson001.demo25.test1;

import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;

@Configuration
@Import({BeanConfig1.class,BeanConfig2.class}) //@1
public class MainConfig1 {
}
```

> @1：通过@Import将其他2个配置类导入

#### 来个测试用例

ConditionTest新增一个方法，方法中从容器中获取IService类型的bean，然后输出：

```java
@Test
public void test1() {
    AnnotationConfigApplicationContext context = new AnnotationConfigApplicationContext(MainConfig1.class);
    Map<String, IService> serviceMap = context.getBeansOfType(IService.class);
    serviceMap.forEach((beanName, bean) -> {
        System.out.println(String.format("%s->%s", beanName, bean));
    });
}
```

运行输出：

```java
service1->com.javacode2018.lesson001.demo25.test1.Service1@2cd76f31
```

可以看出容器中只有一个IService类型的bean。

可以将@Bean标注的2个方法上面的@Conditional去掉，再运行会输出：

```java
service1->com.javacode2018.lesson001.demo25.test1.Service1@49438269
service2->com.javacode2018.lesson001.demo25.test1.Service2@ba2f4ec
```

此时没有条件限制，2个Service都会注册到容器。

## 案例4：根据环境选择配置类

平常我们做项目的时候，有开发环境、测试环境、线上环境，每个环境中有些信息是不一样的，比如数据库的配置信息，下面我们来模拟不同环境中使用不同的配置类来注册不同的bean。

### 自定义一个条件的注解

```java
package com.javacode2018.lesson001.demo25.test2;

import org.springframework.context.annotation.Conditional;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Conditional(EnvCondition.class) //@1
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
public @interface EnvConditional {
    //环境(测试环境、开发环境、生产环境)
    enum Env { //@2
        TEST, DEV, PROD
    }

    //环境
    Env value() default Env.DEV; //@3
}
```

> @1：注意这个注解比较特别，这个注解上面使用到了@Conditional注解，这个地方使用到了一个自定义Conditione类：EnvCondition
> 
> @2：枚举，表示环境，定义了3个环境
> 
> @3：这个参数用指定环境
> 
> 上面这个注解一会我们会用在不同环境的配置类上面

### 下面来3个配置类

让3个配置类分别在不同环境中生效，会在这些配置类上面使用上面自定义的@EnvConditional注解来做条件限定。

每个配置类中通过@Bean来定义一个名称为name的bean，一会通过输出这个bean来判断哪个配置类生效了。

下面来看3个配置类的代码

#### 测试环境配置类

```java
package com.javacode2018.lesson001.demo25.test2;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@EnvConditional(EnvConditional.Env.TEST)//@1
public class TestBeanConfig {
    @Bean
    public String name() {
        return "我是测试环境!";
    }
}
```

> @1指定的测试环境

#### 开发环境配置类

```java
package com.javacode2018.lesson001.demo25.test2;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@EnvConditional(EnvConditional.Env.DEV) //@1
public class DevBeanConfig {
    @Bean
    public String name() {
        return "我是开发环境!";
    }
}
```

> @1：指定的开发环境

#### 生产环境配置类

```java
package com.javacode2018.lesson001.demo25.test2;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@EnvConditional(EnvConditional.Env.PROD) //@1
public class ProdBeanConfig {
    @Bean
    public String name() {
        return "我是生产环境!";
    }
}
```

> @1：指定的生产环境

### 下面来看一下条件类：EnvCondition

条件类会解析配置类上面@EnvConditional注解，得到环境信息。

然后和目前的环境对比，决定返回true还是false，如下：

```java
package com.javacode2018.lesson001.demo25.test2;

import org.springframework.context.annotation.Condition;
import org.springframework.context.annotation.ConditionContext;
import org.springframework.core.type.AnnotatedTypeMetadata;

public class EnvCondition implements Condition {
    @Override
    public boolean matches(ConditionContext context, AnnotatedTypeMetadata metadata) {
        //当前需要使用的环境
        EnvConditional.Env curEnv = EnvConditional.Env.DEV; //@1
        //获取使用条件的类上的EnvCondition注解中对应的环境
        EnvConditional.Env env = (EnvConditional.Env) metadata.getAllAnnotationAttributes(EnvConditional.class.getName()).get("value").get(0);
        return env.equals(curEnv);
    }

}
```

> @1：这个用来指定当前使用的环境，此处假定当前使用的是开发环境，这个我们以后可以任意发挥，比如将这些放到配置文件中，此处方便演示效果。

### 来个测试用例

```java
@Test
public void test2() {
    AnnotationConfigApplicationContext context = new AnnotationConfigApplicationContext(MainConfig2.class);
    System.out.println(context.getBean("name"));
}
```

### 运行输出

```java
我是开发环境!
```

可以看到开发环境生效了。

修改一下EnvCondition的代码，切换到生产环境：

```java
EnvConditional.Env curEnv = EnvConditional.Env.PROD;
```

再次运行test2方法输出：

```java
我是生产环境!
```

生产环境配置类生效了。

## 案例5：Condition指定优先级

### 多个Condition按顺序执行

@Condtional中value指定多个Condtion的时候，默认情况下会按顺序执行，还是通过代码来看一下效果。

下面代码中定义了3个Condition，每个Condition的matches方法中会输出当前类名，然后在配置类上面同时使用这3个Condition：

```java
package com.javacode2018.lesson001.demo25.test5;

import org.springframework.context.annotation.Condition;
import org.springframework.context.annotation.ConditionContext;
import org.springframework.context.annotation.Conditional;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.type.AnnotatedTypeMetadata;

class Condition1 implements Condition {
    @Override
    public boolean matches(ConditionContext context, AnnotatedTypeMetadata metadata) {
        System.out.println(this.getClass().getName());
        return true;
    }
}

class Condition2 implements Condition {
    @Override
    public boolean matches(ConditionContext context, AnnotatedTypeMetadata metadata) {
        System.out.println(this.getClass().getName());
        return true;
    }
}

class Condition3 implements Condition {
    @Override
    public boolean matches(ConditionContext context, AnnotatedTypeMetadata metadata) {
        System.out.println(this.getClass().getName());
        return true;
    }
}

@Configuration
@Conditional({Condition1.class, Condition2.class, Condition3.class})
public class MainConfig5 {
}
```

来个测试用例

```java
@Test
public void test5() {
    AnnotationConfigApplicationContext context = new AnnotationConfigApplicationContext(MainConfig5.class);
}
```

运行输出：

```java
com.javacode2018.lesson001.demo25.test5.Condition1
com.javacode2018.lesson001.demo25.test5.Condition2
com.javacode2018.lesson001.demo25.test5.Condition3
com.javacode2018.lesson001.demo25.test5.Condition1
com.javacode2018.lesson001.demo25.test5.Condition2
com.javacode2018.lesson001.demo25.test5.Condition3
com.javacode2018.lesson001.demo25.test5.Condition1
com.javacode2018.lesson001.demo25.test5.Condition2
com.javacode2018.lesson001.demo25.test5.Condition3
```

上面有多行输出，是因为spring解析整个配置类的过程中，有好几个地方都会执行条件判断。

咱们只用关注前3行，可以看出输出的属性和@Conditional中value值的顺序是一样的。

### 指定Condition的顺序

自定义的Condition可以实现PriorityOrdered接口或者继承Ordered接口，或者使用@Order注解，通过这些来指定这些Condition的优先级。

**排序规则：先按PriorityOrdered排序，然后按照order的值进行排序；也就是：PriorityOrdered asc,order值 asc**

```java
下面这几个都可以指定order的值
接口：org.springframework.core.Ordered，有个getOrder方法用来返回int类型的值
接口：org.springframework.core.PriorityOrdered，继承了Ordered接口，所以也有getOrder方法
注解：org.springframework.core.annotation.Order，有个int类型的value参数指定Order的大小
```

看案例代码：

```java
package com.javacode2018.lesson001.demo25.test6;


import org.springframework.context.annotation.Condition;
import org.springframework.context.annotation.ConditionContext;
import org.springframework.context.annotation.Conditional;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.Ordered;
import org.springframework.core.PriorityOrdered;
import org.springframework.core.annotation.Order;
import org.springframework.core.type.AnnotatedTypeMetadata;

@Order(1) //@1
class Condition1 implements Condition {
    @Override
    public boolean matches(ConditionContext context, AnnotatedTypeMetadata metadata) {
        System.out.println(this.getClass().getName());
        return true;
    }
}

class Condition2 implements Condition, Ordered { //@2
    @Override
    public boolean matches(ConditionContext context, AnnotatedTypeMetadata metadata) {
        System.out.println(this.getClass().getName());
        return true;
    }

    @Override
    public int getOrder() { //@3
        return 0;
    }
}

class Condition3 implements Condition, PriorityOrdered { //@4
    @Override
    public boolean matches(ConditionContext context, AnnotatedTypeMetadata metadata) {
        System.out.println(this.getClass().getName());
        return true;
    }

    @Override
    public int getOrder() {
        return 1000;
    }
}

@Configuration
@Conditional({Condition1.class, Condition2.class, Condition3.class})//@5
public class MainConfig6 {
}
```

> @1：Condition1通过@Order指定顺序，值为1
> 
> @2：Condition2通过实现了Ordered接口来指定顺序，@3：getOrder方法返回1
> 
> @4：Condition3实现了PriorityOrdered接口，实现这个接口需要重写getOrder方法，返回1000
> 
> @5：Condtion顺序为1、2、3

根据排序的规则，PriorityOrdered的会排在前面，然后会再按照order升序，最后可以顺序是：

```plain
Condtion3->Condtion2->Condtion1
```

来个测试用例看看效果是不是我们分析的这样：

```java
@Test
public void test6() {
    AnnotationConfigApplicationContext context = new AnnotationConfigApplicationContext(MainConfig6.class);
}
```

运行test6，部分输出如下：

```java
com.javacode2018.lesson001.demo25.test6.Condition3
com.javacode2018.lesson001.demo25.test6.Condition2
com.javacode2018.lesson001.demo25.test6.Condition1
```

结果和我们分析的一致。

## 案例6：ConfigurationCondition使用

ConfigurationCondition使用的比较少，很多地方对这个基本上也不会去介绍，Condition接口基本上可以满足99%的需求了，但是springboot中却大量用到了ConfigurationCondition这个接口。

ConfigurationCondition通过解释比较难理解，来个案例感受一下：

### 来一个普通的类：Service

```java
package com.javacode2018.lesson001.demo25.test7;

public class Service {
}
```

### 来一个配置类，通过配置类注册上面这个Service

```java
package com.javacode2018.lesson001.demo25.test7;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class BeanConfig1 {
    @Bean
    public Service service() {
        return new Service();
    }
}
```

### 再来一个配置类：BeanConfig2

```java
package com.javacode2018.lesson001.demo25.test7;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class BeanConfig2 {
    @Bean
    public String name() {
        return "  喔喔松Java";
    }
}
```

### 来一个总的配置类

```java
package com.javacode2018.lesson001.demo25.test7;

import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;

@Configuration
@Import({BeanConfig1.class, BeanConfig2.class})
public class MainConfig7 {
}
```

> 上面通过@Import引入了另外2个配置类

### 来个测试用例加载MainConfig7配置类

```java
@Test
public void test7() {
    AnnotationConfigApplicationContext context = new AnnotationConfigApplicationContext(MainConfig7.class);
    context.getBeansOfType(String.class).forEach((beanName, bean) -> {
        System.out.println(String.format("%s->%s", beanName, bean));
    });
}
```

上面从容器中获取String类型的bean，然后输出。

### 运行输出

```java
name->  喔喔松Java
```

### 现在我们有个需求

当容器中有Service这种类型的bean的时候，BeanConfig2才生效。

很简单吧，加个Condition就行了，内部判断容器中是否有Service类型的bean，继续

### 来个自定义的Condition

```java
package com.javacode2018.lesson001.demo25.test7;


import org.springframework.beans.factory.config.ConfigurableListableBeanFactory;
import org.springframework.context.annotation.Condition;
import org.springframework.context.annotation.ConditionContext;
import org.springframework.core.type.AnnotatedTypeMetadata;

public class MyCondition1 implements Condition {
    @Override
    public boolean matches(ConditionContext context, AnnotatedTypeMetadata metadata) {
        //获取spring容器
        ConfigurableListableBeanFactory beanFactory = context.getBeanFactory();
        //判断容器中是否存在Service类型的bean
        boolean existsService = !beanFactory.getBeansOfType(Service.class).isEmpty();
        return existsService;
    }
}
```

上面代码很简单，判断容器中是否有IService类型的bean。

### BeanConfig2上使用Condition条件判断

```java
@Configuration
@Conditional(MyCondition1.class)
public class BeanConfig2 {
    @Bean
    public String name() {
        return "  喔喔松Java";
    }
}
```

### 再次运行test7输出

无任何输出

### 为什么？

在文章前面我们说过，配置类的处理会依次经过2个阶段：配置类解析阶段和bean注册阶段，Condition接口类型的条件会对这两个阶段都有效，解析阶段的时候，容器中是还没有Service这个bean的，配置类中通过@Bean注解定义的bean在bean注册阶段才会被注册到spring容器，所以BeanConfig2在解析阶段去容器中是看不到Service这个bean的，所以就被拒绝了。

**此时我们需要用到ConfigurationCondition了，让条件判断在bean注册阶段才起效。**

### 自定义一个ConfigurationCondition类

```java
package com.javacode2018.lesson001.demo25.test7;

import org.springframework.beans.factory.config.ConfigurableListableBeanFactory;
import org.springframework.context.annotation.ConditionContext;
import org.springframework.context.annotation.ConfigurationCondition;
import org.springframework.core.type.AnnotatedTypeMetadata;

public class MyConfigurationCondition1 implements ConfigurationCondition {
    @Override
    public ConfigurationPhase getConfigurationPhase() {
        return ConfigurationPhase.REGISTER_BEAN; //@1
    }

    @Override
    public boolean matches(ConditionContext context, AnnotatedTypeMetadata metadata) {
        //获取spring容器
        ConfigurableListableBeanFactory beanFactory = context.getBeanFactory();
        //判断容器中是否存在Service类型的bean
        boolean existsService = !beanFactory.getBeansOfType(Service.class).isEmpty();
        return existsService;
    }
}
```

> @1：指定条件在bean注册阶段，这个条件才有效
> 
> matches方法中的内容直接复制过来，判断规则不变。

### 修改BeanConfig2的类容

```java
将
@Conditional(MyCondition1.class)
替换为
@Conditional(MyConfigurationCondition1.class)
```

### 再次运行test7输出

```java
name->  喔喔松Java
```

此时name这个bean被输出了。

可以再试试将BeanConfig1中service方法上面的@Bean去掉，此时Service就不会被注册到容器，再运行一下test7，会发现没有输出了，此时BeanConfig2会失效。

**判断bean存不存在的问题，通常会使用ConfigurationCondition这个接口，阶段为：REGISTER\_BEAN，这样可以确保条件判断是在bean注册阶段执行的。**

对springboot比较熟悉的，它里面有很多@Conditionxxx这样的注解，可以去看一下这些注解，很多都实现了ConfigurationCondition接口。

## Spring中这块的源码

**@Conditional注解是被下面这个类处理的**

```java
org.springframework.context.annotation.ConfigurationClassPostProcessor
```

**又是这个类，说了很多次了，非常重要的一个类，大家下去了多撸一下这个类的源码，这样理解起来更顺畅一些。**

## 案例源码

```java
https://gitee.com/javacode2018/spring-series
```

**  喔喔松java所有案例代码以后都会放到这个上面，大家watch一下，可以持续关注动态。**

## 总结

1.  @Conditional注解可以标注在spring需要处理的对象上（配置类、@Bean方法），相当于加了个条件判断，通过判断的结果，让spring觉得是否要继续处理被这个注解标注的对象
2.  spring处理配置类大致有2个过程：解析配置类、注册bean，这两个过程中都可以使用@Conditional来进行控制spring是否需要处理这个过程
3.  Condition默认会对2个过程都有效
4.  ConfigurationCondition控制得更细一些，可以控制到具体那个阶段使用条件判断

[下一篇：注解实现依赖注入（@Autowired、@Resource、@Primary、@Qulifier）](http://www.itsoku.com/course/5/103)

[上一篇：@Import 注解详解](http://www.itsoku.com/course/5/101)