
# @Aspect中@Pointcut 12种用法

[上一篇：ProxyFactoryBean创建AOP代理](http://www.itsoku.com/course/5/115)

[下一篇：@Aspect中5中通知详解](http://www.itsoku.com/course/5/117)

**本文主要内容：掌握@Pointcut的12种用法。**

## Aop相关阅读

阅读本文之前，需要先掌握下面几篇篇文章内容，不然会比较吃力。

1.  [代理详解（java动态代理&CGLIB代理)](http://www.itsoku.com/course/5/97)
2.  [jdk动态代理和cglib代理](http://www.itsoku.com/course/5/112)
3.  [Aop概念详解](http://www.itsoku.com/course/5/113)
4.  [AOP核心源码、原理详解](http://www.itsoku.com/course/5/114)
5.  [ProxyFactoryBean创建AOP代理](http://www.itsoku.com/course/5/115)

本文继续AOP，目前手动Aop中三种方式已经介绍2种了，本文将介绍另外一种：`AspectJProxyFactory`，可能大家对这个比较陌生，但是`@Aspect`这个注解大家应该很熟悉吧，通过这个注解在spring环境中实现aop特别的方便。

而`AspectJProxyFactory`这个类可以通过解析`@Aspect`标注的类来生成代理aop代理对象，对开发者来说，使创建代理变的更简洁了。

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202312081105455.png)

## 先了解几个概念

文中会涉及几个概念，先了解一下。

### target

用来表示目标对象，即需要通过aop来增强的对象。

### proxy

代理对象，target通过aop增强之后生成的代理对象。

## AspectJ

### AspectJ是什么?

AspectJ是一个面向切面的框架，是目前最好用，最方便的AOP框架，和spring中的aop可以集成在一起使用，通过Aspectj提供的一些功能实现aop代理变得非常方便。

### AspectJ使用步骤

```java
1.创建一个类，使用@Aspect标注
2.@Aspect标注的类中，通过@Pointcut定义切入点
3.@Aspect标注的类中，通过AspectJ提供的一些通知相关的注解定义通知
4.使用AspectJProxyFactory结合@Ascpect标注的类，来生成代理对象
```

先来个案例，感受一下AspectJ是多么的方便。

来个类

```java
package com.javacode2018.aop.demo9.test1;

public class Service1 {

    public void m1() {
        System.out.println("我是 m1 方法");
    }

    public void m2() {
        System.out.println(10 / 0);
        System.out.println("我是 m2 方法");
    }
}
```

通过`AspectJ`来对`Service1`进行增强，来2个通知，一个前置通知，一个异常通知，这2个通知需要对`Service1`中的所有方法生效，实现如下：

```java
package com.javacode2018.aop.demo9.test1;

import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.AfterThrowing;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.aspectj.lang.annotation.Pointcut;

//@1：这个类需要使用@Aspect进行标注
@Aspect
public class Aspect1 {

    //@2：定义了一个切入点，可以匹配Service1中所有方法
    @Pointcut("execution(* com.javacode2018.aop.demo9.test1.Service1.*(..))")
    public void pointcut1() {
    }

    //@3：定义了一个前置通知，这个通知对刚刚上面我们定义的切入点中的所有方法有效
    @Before(value = "pointcut1()")
    public void before(JoinPoint joinPoint) {
        //输出连接点的信息
        System.out.println("前置通知，" + joinPoint);
    }

    //@4：定义了一个异常通知，这个通知对刚刚上面我们定义的切入点中的所有方法有效
    @AfterThrowing(value = "pointcut1()", throwing = "e")
    public void afterThrowing(JoinPoint joinPoint, Exception e) {
        //发生异常之后输出异常信息
        System.out.println(joinPoint + ",发生异常：" + e.getMessage());
    }

}
```

> @1：类上使用@Aspect标注
> 
> @2：通过@Pointcut注解标注在方法上面，用来定义切入点
> 
> @3：使用@Before标注在方法上面，定义了一个前置通知，通过value引用了上面已经定义的切入点，表示这个通知会对Service1中的所有方法生效，在通知中可以通过这个`类名.方法名()`引用`@Pointcut`定义的切入点，表示这个通知对这些切入点有效，若`@Before和@Pointcut`在一个类的时候，直接通过`方法名()`引用当前类中定义的切入点
> 
> @4：这个使用`@AfterThrowing`定义了一个异常通知，也是对通过value引用了上面已经定义的切入点，表示这个通知会对Service1中的所有方法生效，若Service1中的方法抛出了Exception类型的异常，都会回调`afterThrowing`方法。

来个测试类

```java
package com.javacode2018.aop.demo9;

import com.javacode2018.aop.demo9.test1.Aspect1;
import com.javacode2018.aop.demo9.test1.Service1;
import org.junit.Test;
import org.springframework.aop.aspectj.annotation.AspectJProxyFactory;

public class AopTest9 {
    @Test
    public void test1() {
        try {
            //对应目标对象
            Service1 target = new Service1();
            //创建AspectJProxyFactory对象
            AspectJProxyFactory proxyFactory = new AspectJProxyFactory();
            //设置被代理的目标对象
            proxyFactory.setTarget(target);
            //设置标注了@Aspect注解的类
            proxyFactory.addAspect(Aspect1.class);
            //生成代理对象
            Service1 proxy = proxyFactory.getProxy();
            //使用代理对象
            proxy.m1();
            proxy.m2();
        } catch (Exception e) {
        }
    }
}
```

运行输出

```java
前置通知，execution(void com.javacode2018.aop.demo9.test1.Service1.m1())
我是 m1 方法
前置通知，execution(void com.javacode2018.aop.demo9.test1.Service1.m2())
execution(void com.javacode2018.aop.demo9.test1.Service1.m2()),发生异常：/ by zero
```

使用是不是特方便。

### AspectJProxyFactory原理

`@Aspect`标注的类上，这个类中，可以通过通过`@Pointcut`来定义切入点，可以通过`@Before、@Around、@After、@AfterRunning、@AfterThrowing`标注在方法上来定义通知，定义好了之后，将`@Aspect`标注的这个类交给`AspectJProxyFactory`来解析生成`Advisor`链，进而结合目标对象一起来生成代理对象，大家可以去看一下源码，比较简单，这里就不多解释了。

本文的重点在`@Aspect`标注的类上，`@Aspect`中有2个关键点比较重要

*   @Pointcut：标注在方法上，用来定义切入点，有11种用法，本文主要讲解这11种用法。
*   @Aspect类中定义通知：可以通过`@Before、@Around、@After、@AfterRunning、@AfterThrowing`标注在方法上来定义通知，这个下一篇介绍。

## @Pointcut的12种用法

### 作用

用来标注在方法上来定义切入点。

### 定义

格式：@ 注解(value=“表达标签 (表达式格式)”)

如：

```java
@Pointcut("execution(* com.javacode2018.aop.demo9.test1.Service1.*(..))")
```

### 表达式标签（10种）

*   execution：用于匹配方法执行的连接点
*   within：用于匹配指定类型内的方法执行
*   this：用于匹配当前AOP代理对象类型的执行方法；注意是AOP代理对象的类型匹配，这样就可能包括引入接口的类型匹配
*   target：用于匹配当前目标对象类型的执行方法；注意是目标对象的类型匹配，这样就不包括引入接口的类型匹配
*   args：用于匹配当前执行的方法传入的参数为指定类型的执行方法
*   @within：用于匹配所以持有指定注解类型内的方法
*   @target：用于匹配当前目标对象类型的执行方法，其中目标对象持有指定的注解
*   @args：用于匹配当前执行的方法传入的参数持有指定注解的执行
*   @annotation：用于匹配当前执行方法持有指定注解的方法
*   bean：Spring AOP扩展的，AspectJ没有对于指示符，用于匹配特定名称的Bean对象的执行方法

**10种标签组成了12种用法**

### 1、execution

使用`execution(方法表达式)`匹配方法执行。

#### execution格式

```java
execution(modifiers-pattern? ret-type-pattern declaring-type-pattern? name-pattern(param-pattern) throws-pattern?)
```

*   其中带 ?号的 modifiers-pattern?，declaring-type-pattern?，hrows-pattern?是可选项
*   ret-type-pattern,name-pattern, parameters-pattern是必选项
*   modifier-pattern? 修饰符匹配，如public 表示匹配公有方法
*   ret-type-pattern 返回值匹配，\* 表示任何返回值，全路径的类名等
*   declaring-type-pattern? 类路径匹配
*   name-pattern 方法名匹配， _代表所有，set_，代表以set开头的所有方法
*   (param-pattern) 参数匹配，指定方法参数(声明的类型)，(..)代表所有参数，(\*,String)代表第一个参数为任何值,第二个为String类型，(..,String)代表最后一个参数是String类型
*   throws-pattern? 异常类型匹配

#### 举例说明

| **表达式** | **描述** |
| --- | --- |
| public \*.\*(..) | 任何公共方法的执行 |
| _com.javacode2018..IPointcutService._() | com.javacode2018包及所有子包下IPointcutService接口中的任何无参方法 |
| _com.javacode2018..\\_.\*(..) | com.javacode2018包及所有子包下任何类的任何方法 |
| \* com.javacode2018..IPointcutService.() | com.javacode2018包及所有子包下IPointcutService接口的任何只有一个参数方法 |
| _com.javacode2018..IPointcutService+._() | com.javacode2018包及所有子包下IPointcutService接口及子类型的的任何无参方法 |
| _Service1.\\_(String) | 匹配Service1中只有1个参数的且参数类型是String的方法 |
| _Service1.\\_(\*,String) | 匹配Service1中只有2个参数的且第二个参数类型是String的方法 |
| _Service1.\\_(..,String) | 匹配Service1中最后1个参数类型是String的方法 |

#### 类型匹配语法

很多地方会按照类型的匹配，先来说一下类型匹配的语法。

首先让我们来了解下AspectJ类型匹配的通配符：

*   **\***：匹配任何数量字符
*   **..**：匹配任何数量字符的重复，如在类型模式中匹配任何数量子包；而在方法参数模式中匹配任何数量参数（0个或者多个参数）
*   **+：**匹配指定类型及其子类型；仅能作为后缀放在类型模式后边

| 表达式 | 说明 |
| --- | --- |
| java.lang.String | 匹配String类型 |
| java.\*.String | 匹配java包下的任何`一级子包`下的String类型，如匹配java.lang.String，但不匹配java.lang.ss.String |
| java..\* | 匹配java包及任何子包下的任何类型，如匹配java.lang.String、java.lang.annotation.Annotation |
| java.lang.\*ing | 匹配任何java.lang包下的以ing结尾的类型 |
| java.lang.Number+ | 匹配java.lang包下的任何Number类型及其子类型，如匹配java.lang.Number，也匹配java.lang.Integer、java.math.BigInteger |

### 2、within

#### 用法

`within(类型表达式)`：目标对象target的类型是否和within中指定的类型匹配

| **表达式** | **描述** |
| --- | --- |
| within(com.javacode2018..\*) | com.javacode2018包及子包下的任何方法执行 |
| within(com.javacode2018..IPointcutService+) | com.javacode2018包或所有子包下IPointcutService类型及子类型的任何方法 |
| within(com.javacode2018.Service1) | 匹配类com.javacode2018.Service1中定义的所有方法，不包含其子类中的方法 |

#### 匹配原则

```java
target.getClass().equals(within表达式中指定的类型)
```

#### 案例

有2个类，父子关系

父类C1

```java
package com.javacode2018.aop.demo9.test2;

public class C1 {
    public void m1() {
        System.out.println("我是m1");
    }

    public void m2() {
        System.out.println("我是m2");
    }
}
```

子类C2

```java
package com.javacode2018.aop.demo9.test2;

public class C2 extends C1 {
    @Override
    public void m2() {
        super.m2();
    }

    public void m3() {
        System.out.println("我是m3");
    }
}
```

来个Aspect类

```java
package com.javacode2018.aop.demo9.test2;

import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.aspectj.lang.annotation.Pointcut;

@Aspect
public class AspectTest2 {

    @Pointcut("within(C1)") //@1
    public void pc() {
    }

    @Before("pc()") //@2
    public void beforeAdvice(JoinPoint joinpoint) {
        System.out.println(joinpoint);
    }

}
```

> 注意`@1`匹配的类型是`C1`，也就是说被代理的对象的类型必须是C1类型的才行，需要和C1完全匹配

下面我们对`C2`创建代理

```java
@Test
public void test2(){
    C2 target = new C2();
    AspectJProxyFactory proxyFactory = new AspectJProxyFactory();
    proxyFactory.setTarget(target);
    proxyFactory.addAspect(AspectTest2.class);

    C2 proxy = proxyFactory.getProxy();
    proxy.m1();
    proxy.m2();
    proxy.m3();
}
```

运行输出

```java
我是m1
我是m2
我是m3
```

原因是目标对象是C2类型的，C2虽然是C1的子类，但是within中表达式指定的是要求类型必须是C1类型的才匹配。

如果将within表达式修改为下面任意一种就可以匹配了

```java
@Pointcut("within(C1+)") 
@Pointcut("within(C2)")
```

再次运行输出

```java
execution(void com.javacode2018.aop.demo9.test2.C1.m1())
我是m1
execution(void com.javacode2018.aop.demo9.test2.C2.m2())
我是m2
execution(void com.javacode2018.aop.demo9.test2.C2.m3())
我是m3
```

### 3、this

#### 用法

`this(类型全限定名)`：通过aop创建的代理对象的类型是否和this中指定的类型匹配；注意判断的目标是代理对象；this中使用的表达式必须是类型全限定名，不支持通配符。

#### 匹配原则

```java
如:this(x)，则代理对象proxy满足下面条件时会匹配
x.getClass().isAssignableFrom(proxy.getClass());
```

#### 案例

来个接口

```java
package com.javacode2018.aop.demo9.test3;

public interface I1 {
    void m1();
}
```

来个实现类

```java
package com.javacode2018.aop.demo9.test3;

public class Service3 implements I1 {

    @Override
    public void m1() {
        System.out.println("我是m1");
    }

}
```

来个@Aspect类

```java
package com.javacode2018.aop.demo9.test3;

import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.aspectj.lang.annotation.Pointcut;

@Aspect
public class AspectTest3 {

    //@1：匹配proxy是Service3类型的所有方法
    @Pointcut("this(Service3)")
    public void pc() {
    }

    @Before("pc()")
    public void beforeAdvice(JoinPoint joinpoint) {
        System.out.println(joinpoint);
    }

}
```

测试代码

```java
@Test
public void test3() {
    Service3 target = new Service3();
    AspectJProxyFactory proxyFactory = new AspectJProxyFactory();
    proxyFactory.setTarget(target);
    //获取目标对象上的接口列表
    Class<?>[] allInterfaces = ClassUtils.getAllInterfaces(target);
    //设置需要代理的接口
    proxyFactory.setInterfaces(allInterfaces);
    proxyFactory.addAspect(AspectTest3.class);
    //获取代理对象
    Object proxy = proxyFactory.getProxy();
    //调用代理对象的方法
    ((I1) proxy).m1();

    System.out.println("proxy是否是jdk动态代理对象：" + AopUtils.isJdkDynamicProxy(proxy));
    System.out.println("proxy是否是cglib代理对象：" + AopUtils.isCglibProxy(proxy));
    //判断代理对象是否是Service3类型的
    System.out.println(Service3.class.isAssignableFrom(proxy.getClass()));
}
```

运行输出

```java
我是m1
proxy是否是jdk动态代理对象：true
proxy是否是cglib代理对象：false
false
```

从输出中可以看出m1方法没有被增强，原因：this表达式要求代理对象必须是Service3类型的，输出中可以看出代理对象并不是Service3类型的，此处代理对象proxy是使用jdk动态代理生成的。

我们可以将代码调整一下，使用cglib来创建代理

```java
proxyFactory.setProxyTargetClass(true);
```

再次运行，会发现m2被拦截了，结果如下

```java
execution(void com.javacode2018.aop.demo9.test3.Service3.m1())
我是m1
proxy是否是jdk动态代理对象：false
proxy是否是cglib代理对象：true
true
```

### 4、target

#### 用法

`target(类型全限定名)`：判断目标对象的类型是否和指定的类型匹配；注意判断的是目标对象的类型；表达式必须是类型全限定名，不支持通配符。

#### 匹配原则

```java
如:target(x)，则目标对象target满足下面条件时会匹配
x.getClass().isAssignableFrom(target.getClass());
```

#### 案例

```java
package com.javacode2018.aop.demo9.test4;

import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.aspectj.lang.annotation.Pointcut;

@Aspect
public class AspectTest4 {

    //@1：目标类型必须是Service3类型的
    @Pointcut("target(com.javacode2018.aop.demo9.test3.Service3)")
    public void pc() {
    }

    @Before("pc()")
    public void beforeAdvice(JoinPoint joinpoint) {
        System.out.println(joinpoint);
    }

}
```

测试代码

```java
@Test
public void test4() {
    Service3 target = new Service3();
    AspectJProxyFactory proxyFactory = new AspectJProxyFactory();
    proxyFactory.setProxyTargetClass(true);
    proxyFactory.setTarget(target);
    proxyFactory.addAspect(AspectTest4.class);
    //获取代理对象
    Object proxy = proxyFactory.getProxy();
    //调用代理对象的方法
    ((I1) proxy).m1();
    //判断target对象是否是Service3类型的
    System.out.println(Service3.class.isAssignableFrom(target.getClass()));
}
```

运行输出

```java
execution(void com.javacode2018.aop.demo9.test3.Service3.m1())
我是m1
true
```

#### within、this、target对比

| 表达式标签 | 判断的对象 | 判断规则(x：指表达式中指定的类型) |
| --- | --- | --- |
| **within** | target对象 | target.getClass().equals(表达式中指定的类型) |
| **this** | proxy对象 | x.getClass().isAssignableFrom(proxy.getClass()); |
| **target** | target对象 | x.getClass().isAssignableFrom(target.getClass()); |

### 5、args

#### 用法

`args(参数类型列表)`匹配当前执行的方法传入的参数是否为args中指定的类型；注意是匹配传入的参数类型，不是匹配方法签名的参数类型；参数类型列表中的参数必须是类型全限定名，不支持通配符；args属于动态切入点，也就是执行方法的时候进行判断的，这种切入点开销非常大，非特殊情况最好不要使用。

#### 举例说明

| **表达式** | **描述** |
| --- | --- |
| args(String) | 匹配只有一个参数且传入的参数类型是String类型的方法 |
| args(\*,String) | 匹配只有2个参数的且第2个参数类型是String的方法 |
| args(..,String) | 匹配最后1个参数类型是String的方法 |

#### 案例

下面的m1方法参数是Object类型的。

```java
package com.javacode2018.aop.demo9.test5;

public class Service5 {
    public void m1(Object object) {
        System.out.println("我是m1方法,参数：" + object);
    }
}
```

Aspect类

```java
package com.javacode2018.aop.demo9.test5;

import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.aspectj.lang.annotation.Pointcut;

import java.util.Arrays;
import java.util.stream.Collectors;

@Aspect
public class AspectTest5 {
    //@1：匹配只有1个参数其类型是String类型的
    @Pointcut("args(String)")
    public void pc() {
    }

    @Before("pc()")
    public void beforeAdvice(JoinPoint joinpoint) {
        System.out.println("请求参数：" + Arrays.stream(joinpoint.getArgs()).collect(Collectors.toList()));
    }
}
```

测试代码，调用2次m1方法，第一次传入一个String类型的，第二次传入一个int类型的，看看效果

```java
@Test
public void test5() {
    Service5 target = new Service5();
    AspectJProxyFactory proxyFactory = new AspectJProxyFactory();
    proxyFactory.setTarget(target);
    proxyFactory.addAspect(AspectTest5.class);
    Service5 proxy = proxyFactory.getProxy();
    proxy.m1("路人");
    proxy.m1(100);
}
```

运行输出

```java
请求参数：[路人]
我是m1方法,参数：路人
我是m1方法,参数：100
```

输出中可以看出，m1第一次调用被增强了，第二次没有被增强。

**args会在调用的过程中对参数实际的类型进行匹配，比较耗时，慎用。**

### 6、@within

#### 用法

`@within(注解类型)`：匹配指定的注解内定义的方法。

#### 匹配规则

调用目标方法的时候，通过java中`Method.getDeclaringClass()`获取当前的方法是哪个类中定义的，然后会看这个类上是否有指定的注解。

```java
被调用的目标方法Method对象.getDeclaringClass().getAnnotation(within中指定的注解类型) != null
```

来看3个案例。

#### 案例1

**目标对象上有@within中指定的注解，这种情况时，目标对象的所有方法都会被拦截。**

##### 来个注解

```java
package com.javacode2018.aop.demo9.test9;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.TYPE)
public @interface Ann9 {
}
```

##### 来个目标类，用@Ann9标注

```java
package com.javacode2018.aop.demo9.test9;

@Ann9
public class S9 {
    public void m1() {
        System.out.println("我是m1方法");
    }
}
```

##### 来个Aspect类

```java
package com.javacode2018.aop.demo9.test9;

import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.aspectj.lang.annotation.Pointcut;

@Aspect
public class AspectTest9 {
    /**
     * 定义目标方法的类上有Ann9注解
     */
    @Pointcut("@within(Ann9)")
    public void pc() {
    }

    @Before("pc()")
    public void beforeAdvice(JoinPoint joinPoint) {
        System.out.println(joinPoint);
    }
}
```

##### 测试代码

```java
@Test
public void test9() {
    S9 target = new S9();
    AspectJProxyFactory proxyFactory = new AspectJProxyFactory();
    proxyFactory.setTarget(target);
    proxyFactory.addAspect(AspectTest9.class);
    S9 proxy = proxyFactory.getProxy();
    proxy.m1();
}
```

> m1方法在类S9中定义的，S9上面有Ann9注解，所以匹配成功

##### 运行输出

```java
execution(void com.javacode2018.aop.demo9.test9.S9.m1())
我是m1方法
```

#### 案例2

**定义注解时未使用`@Inherited`，说明子类无法继承父类上的注解**，这个案例中我们将定义一个这样的注解，将注解放在目标类的父类上，来看一下效果。

##### 定义注解Ann10

```java
package com.javacode2018.aop.demo9.test10;

import java.lang.annotation.*;

@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.TYPE)
@Inherited
public @interface Ann10 {
}
```

##### 来2个父子类

> 注意：
> 
> S10Parent为父类，并且使用了Anno10注解，内部定义了2个方法大家注意一下
> 
> 而S10位代理的目标类，继承了S10Parent，内部重写了父类的m2方法，并且又新增了一个m3方法

```java
package com.javacode2018.aop.demo9.test10;

@Ann10
class S10Parent {

    public void m1() {
        System.out.println("我是S10Parent.m1()方法");
    }

    public void m2() {
        System.out.println("我是S10Parent.m2()方法");
    }
}

public class S10 extends S10Parent {

    @Override
    public void m2() {
        System.out.println("我是S10.m2()方法");
    }

    public void m3() {
        System.out.println("我是S10.m3()方法");
    }
}
```

##### 来个Aspect类

```java
package com.javacode2018.aop.demo9.test10;

import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.aspectj.lang.annotation.Pointcut;

@Aspect
public class AspectTest10 {
    //匹配目标方法声明的类上有@Anno10注解
    @Pointcut("@within(com.javacode2018.aop.demo9.test10.Ann10)")
    public void pc() {
    }

    @Before("pc()")
    public void beforeAdvice(JoinPoint joinPoint) {
        System.out.println(joinPoint);
    }
}
```

##### 测试用例

> S10为目标类，依次执行代理对象的m1、m2、m3方法，最终会调用目标类target中对应的方法。

```java
@Test
public void test10() {
    S10 target = new S10();
    AspectJProxyFactory proxyFactory = new AspectJProxyFactory();
    proxyFactory.setTarget(target);
    proxyFactory.addAspect(AspectTest10.class);
    S10 proxy = proxyFactory.getProxy();
    proxy.m1();
    proxy.m2();
    proxy.m3();
}
```

##### 运行输出

```java
execution(void com.javacode2018.aop.demo9.test10.S10Parent.m1())
我是S10Parent.m1()方法
我是S10.m2()方法
我是S10.m3()方法
```

##### 分析结果

从输出中可以看出，只有m1方法被拦截了，其他2个方法没有被拦截。

确实是这样的，m1方法的是由S10Parent定义的，这个类上面有Ann10注解。

而m2方法虽然也在S10Parent中定义了，但是这个方法被子类S10重写了，所以调用目标对象中的m2方法的时候，此时发现m2方法是由S10定义的，而`S10.class.getAnnotation(Ann10.class)`为空，所以这个方法不会被拦截。

同样m3方法也是S10中定义的，也不会被拦截。

#### 案例3

对案例2进行改造，在注解的定义上面加上`@Inherited`，此时子类可以继承父类的注解，此时3个方法都会被拦截了。

下面上代码，下面代码为案例2代码的一个拷贝，不同地方只是注解的定义上多了`@Inherited`

##### 定义注解Ann11

```java
import java.lang.annotation.*;

@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.TYPE)
@Inherited
public @interface Ann11 {
}
```

##### 2个父子类

```java
package com.javacode2018.aop.demo9.test11;

@Ann11
class S11Parent {

    public void m1() {
        System.out.println("我是S11Parent.m1()方法");
    }

    public void m2() {
        System.out.println("我是S11Parent.m2()方法");
    }
}

public class S11 extends S11Parent {

    @Override
    public void m2() {
        System.out.println("我是S11.m2()方法");
    }

    public void m3() {
        System.out.println("我是S11.m3()方法");
    }
}
```

##### Aspect类

```java
package com.javacode2018.aop.demo9.test11;

import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.aspectj.lang.annotation.Pointcut;

@Aspect
public class AspectTest11 {

    @Pointcut("@within(com.javacode2018.aop.demo9.test11.Ann11)")
    public void pc() {
    }

    @Before("pc()")
    public void beforeAdvice(JoinPoint joinPoint) {
        System.out.println(joinPoint);
    }
}
```

##### 测试用例

```java
@Test
public void test11() {
    S11 target = new S11();
    AspectJProxyFactory proxyFactory = new AspectJProxyFactory();
    proxyFactory.setTarget(target);
    proxyFactory.addAspect(AspectTest11.class);
    S11 proxy = proxyFactory.getProxy();
    proxy.m1();
    proxy.m2();
    proxy.m3();
}
```

##### 运行输出

```java
execution(void com.javacode2018.aop.demo9.test11.S11Parent.m1())
我是S11Parent.m1()方法
execution(void com.javacode2018.aop.demo9.test11.S11.m2())
我是S11.m2()方法
execution(void com.javacode2018.aop.demo9.test11.S11.m3())
我是S11.m3()方法
```

> 这次3个方法都被拦截了。

##### 

### 7、@target

#### 用法

`@target(注解类型)`：判断目标对象target类型上是否有指定的注解；@target中注解类型也必须是全限定类型名。

#### 匹配规则

```java
target.class.getAnnotation(指定的注解类型) != null
```

2种情况可以匹配

*   注解直接标注在目标类上
*   注解标注在父类上，但是注解必须是可以继承的，即定义注解的时候，需要使用`@Inherited`标注

#### 案例1

**注解直接标注在目标类上，这种情况目标类会被匹配到。**

##### 自定义一个注解`Ann6`

```java
package com.javacode2018.aop.demo9.test6;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.TYPE)
public @interface Ann6 {
}
```

##### 目标类`S6`上直接使用`@Ann1`

```java
package com.javacode2018.aop.demo9.test6;

@Ann6
public class S6 {
    public void m1() {
        System.out.println("我是m1");
    }
}
```

##### 来个`Aspect`类

```java
package com.javacode2018.aop.demo9.test6;

import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.aspectj.lang.annotation.Pointcut;

@Aspect
public class AspectTest6 {
    //@1：目标类上有@Ann1注解
    @Pointcut("@target(Ann1)")
    public void pc() {
    }

    @Before("pc()")
    public void beforeAdvice(JoinPoint joinPoint) {
        System.out.println(joinPoint);
    }
}
```

##### 测试代码

```java
@Test
public void test6() {
    S6 target = new S6();
    AspectJProxyFactory proxyFactory = new AspectJProxyFactory();
    proxyFactory.setTarget(target);
    proxyFactory.addAspect(AspectTest6.class);
    S6 proxy = proxyFactory.getProxy();
    proxy.m1();
    System.out.println("目标类上是否有 @Ann6 注解：" + (target.getClass().getAnnotation(Ann6.class) != null));
}
```

##### 运行输出

```java
execution(void com.javacode2018.aop.demo9.test6.S6.m1())
我是m1
目标类上是否有 @Ann6 注解：true
```

#### 案例2

**注解标注在父类上，注解上没有`@Inherited`，这种情况下，目标类无法匹配到，下面看代码**

##### 注解Ann7

```java
package com.javacode2018.aop.demo9.test7;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.TYPE)
public @interface Ann7 {
}
```

##### 来2个父子类，父类上有`@Ann7`，之类`S7`为目标类

```java
package com.javacode2018.aop.demo9.test7;

import java.lang.annotation.Target;

@Ann7
class S7Parent {
}

public class S7 extends S7Parent {
    public void m1() {
        System.out.println("我是m1");
    }

    public static void main(String[] args) {
        System.out.println(S7.class.getAnnotation(Target.class));
    }
}
```

##### 来个Aspect类

```java
package com.javacode2018.aop.demo9.test7;

import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.aspectj.lang.annotation.Pointcut;

@Aspect
public class AspectTest7 {
    /**
     * 匹配目标类上有Ann7注解
     */
    @Pointcut("@target(com.javacode2018.aop.demo9.test7.Ann7)")
    public void pc() {
    }

    @Before("pc()")
    public void beforeAdvice(JoinPoint joinPoint) {
        System.out.println(joinPoint);
    }
}
```

##### 测试代码

```java
@Test
public void test7() {
    S7 target = new S7();
    AspectJProxyFactory proxyFactory = new AspectJProxyFactory();
    proxyFactory.setTarget(target);
    proxyFactory.addAspect(AspectTest7.class);
    S7 proxy = proxyFactory.getProxy();
    proxy.m1();
    System.out.println("目标类上是否有 @Ann7 注解：" + (target.getClass().getAnnotation(Ann7.class) != null));
}
```

##### 运行输出

```java
我是m1
目标类上是否有 @Ann7 注解：false
```

##### 分析结果

@Ann7标注在了父类上，但是@Ann7定义的时候没有使用`@Inherited`，说明之类无法继承父类上面的注解，所以上面的目标类没有被拦截，下面我们将`@Ann7`的定义改一下，加上`@Inherited`

```java
package com.javacode2018.aop.demo9.test7;

import java.lang.annotation.*;

@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.TYPE)
@Inherited
public @interface Ann7 {
}
```

##### 再次运行输出

```java
execution(void com.javacode2018.aop.demo9.test7.S7.m1())
我是m1
目标类上是否有 @Ann7 注解：true
```

此时目标对象被拦截了。

### 8、@args

#### 用法

@args(注解类型)：方法参数所属的类上有指定的注解；注意不是参数上有指定的注解，而是参数类型的类上有指定的注解。

#### 案例1

```java
@Pointcut("@args(Ann8)")：匹配方法只有一个参数，并且参数所属的类上有Ann8注解
```

可以匹配下面的代码，m1方法的第一个参数类型是Car类型，Car类型上有注解Ann8

```java
@Ann8
class Car {
}

public void m1(Car car) {
    System.out.println("我是m1");
}
```

#### 案例2

```java
@Pointcut("@args(*,Ann8)")：匹配方法只有2个参数，且第2个参数所属的类型上有Ann8注解
```

可以匹配下面代码

```java
@Ann8
class Car {
}

public void m1(String name,Car car) {
    System.out.println("我是m1");
}
```

#### 案例3

```java
@Pointcut("@args(..,com.javacode2018.aop.demo9.test8.Ann8)")：匹配参数数量大于等于1，且最后一个参数所属的类型上有Ann8注解
@Pointcut("@args(*,com.javacode2018.aop.demo9.test8.Ann8,..)")：匹配参数数量大于等于2，且第2个参数所属的类型上有Ann8注解
@Pointcut("@args(..,com.javacode2018.aop.demo9.test8.Ann8,*)")：匹配参数数量大于等于2，且倒数第2个参数所属的类型上有Ann8注解
```

这个案例代码，大家自己写一下，体验一下。

### 9、@annotation

#### 用法

@annotation(注解类型)：匹配被调用的方法上有指定的注解。

#### 案例

##### 定义一个注解，可以用在方法上

```java
package com.javacode2018.aop.demo9.test12;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.METHOD)
public @interface Ann12 {
}
```

##### 定义2个类

> S12Parent为父类，内部定义了2个方法，2个方法上都有@Ann12注解
> 
> S12是代理的目标类，也是S12Parent的子类，内部重写了m2方法，重写之后m2方法上并没有@Ann12注解，S12内部还定义2个方法m3和m4，而m3上面有注解@Ann12

```java
package com.javacode2018.aop.demo9.test12;

class S12Parent {

    @Ann12
    public void m1() {
        System.out.println("我是S12Parent.m1()方法");
    }

    @Ann12
    public void m2() {
        System.out.println("我是S12Parent.m2()方法");
    }
}

public class S12 extends S12Parent {

    @Override
    public void m2() {
        System.out.println("我是S12.m2()方法");
    }

    @Ann12
    public void m3() {
        System.out.println("我是S12.m3()方法");
    }

    public void m4() {
        System.out.println("我是S12.m4()方法");
    }
}
```

##### 来个Aspect类

> 当被调用的目标方法上有@Ann12注解的时，会被beforeAdvice处理。

```java
package com.javacode2018.aop.demo9.test12;

import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.aspectj.lang.annotation.Pointcut;

@Aspect
public class AspectTest12 {

    @Pointcut("@annotation(com.javacode2018.aop.demo9.test12.Ann12)")
    public void pc() {
    }

    @Before("pc()")
    public void beforeAdvice(JoinPoint joinPoint) {
        System.out.println(joinPoint);
    }
}
```

##### 测试用例

> S12作为目标对象，创建代理，然后分别调用4个方法

```java
@Test
public void test12() {
    S12 target = new S12();
    AspectJProxyFactory proxyFactory = new AspectJProxyFactory();
    proxyFactory.setTarget(target);
    proxyFactory.addAspect(AspectTest12.class);
    S12 proxy = proxyFactory.getProxy();
    proxy.m1();
    proxy.m2();
    proxy.m3();
    proxy.m4();
}
```

##### 运行输出

```java
execution(void com.javacode2018.aop.demo9.test12.S12Parent.m1())
我是S12Parent.m1()方法
我是S12.m2()方法
execution(void com.javacode2018.aop.demo9.test12.S12.m3())
我是S12.m3()方法
我是S12.m4()方法
```

##### 分析结果

m1方法位于S12Parent中，上面有@Ann12注解，被拦截了，m3方法上有@Ann12注解，被拦截了，而m4上没有@Ann12注解，没有被拦截，这3个方法的执行结果都很容易理解。

重点在于m2方法的执行结果，没有被拦截，m2方法虽然在S12Parent中定义的时候也有@Ann12注解标注，但是这个方法被S1给重写了，在S1中定义的时候并没有@Ann12注解，代码中实际上调用的是S1中的m2方法，发现这个方法上并没有@Ann12注解，所以没有被拦截。

### 10、bean

#### 用法

bean(bean名称)：这个用在spring环境中，匹配容器中指定名称的bean。

#### 案例

##### 来个类BeanService

```java
package com.javacode2018.aop.demo9.test13;

public class BeanService {
    private String beanName;

    public BeanService(String beanName) {
        this.beanName = beanName;
    }

    public void m1() {
        System.out.println(this.beanName);
    }
}
```

##### 来个Aspect类

```java
package com.javacode2018.aop.demo9.test13;

import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.aspectj.lang.annotation.Pointcut;
import org.springframework.stereotype.Component;

@Aspect
public class Aspect13 {
    //拦截spring容器中名称为beanService2的bean
    @Pointcut("bean(beanService2)")
    public void pc() {
    }

    @Before("pc()")
    public void beforeAdvice(JoinPoint joinPoint) {
        System.out.println(joinPoint);
    }
}
```

##### 来个spring配置类

```java
package com.javacode2018.aop.demo9.test13;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.EnableAspectJAutoProxy;

@Configuration
@EnableAspectJAutoProxy // 这个可以启用通过AspectJ方式自动为符合条件的bean创建代理
public class MainConfig13 {

    //将Aspect13注册到spring容器
    @Bean
    public Aspect13 aspect13() {
        return new Aspect13();
    }

    @Bean
    public BeanService beanService1() {
        return new BeanService("beanService1");
    }

    @Bean
    public BeanService beanService2() {
        return new BeanService("beanService2");
    }
}
```

> 这个配置类中有个`@EnableAspectJAutoProxy`，这个注解大家可能比较陌生，这个属于aop中自动代理的范围，后面会有文章详细介绍这块，这里大家暂时先不用关注。

##### 测试用例

> 下面启动spring容器，加载配置类MainConfig13，然后分别获取beanService1和beanService2，调用他们的m1方法，看看效果

```java
@Test
public void test13() {
    AnnotationConfigApplicationContext context = new AnnotationConfigApplicationContext(MainConfig13.class);
    //从容器中获取beanService1
    BeanService beanService1 = context.getBean("beanService1", BeanService.class);
    beanService1.m1();
    //从容器中获取beanService2
    BeanService beanService2 = context.getBean("beanService2", BeanService.class);
    beanService2.m1();
}
```

##### 运行输出

```java
beanService1
execution(void com.javacode2018.aop.demo9.test13.BeanService.m1())
beanService2
```

> beanService2的m1方法被拦截了。

### 11、reference pointcut

表示引用其他命名切入点。

有时，我们可以将切入专门放在一个类中集中定义。

其他地方可以通过引用的方式引入其他类中定义的切入点。

语法如下：

```java
@Pointcut("完整包名类名.方法名称()")
```

> 若引用同一个类中定义切入点，包名和类名可以省略，直接通过方法就可以引用。

比如下面，我们可以将所有切入点定义在一个类中

```java
package com.javacode2018.aop.demo9.test14;

import org.aspectj.lang.annotation.Pointcut;

public class AspectPcDefine {
    @Pointcut("bean(bean1)")
    public void pc1() {
    }

    @Pointcut("bean(bean2)")
    public void pc2() {
    }
}
```

下面顶一个一个Aspect类，来引用上面的切入点

```java
package com.javacode2018.aop.demo9.test14;

import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;

@Aspect
public class Aspect14 {

    @Pointcut("com.javacode2018.aop.demo9.test14.AspectPcDefine.pc1()")
    public void pointcut1() {
    }

    @Pointcut("com.javacode2018.aop.demo9.test14.AspectPcDefine.pc1() || com.javacode2018.aop.demo9.test14.AspectPcDefine.pc2()")
    public void pointcut2() {
    }

}
```

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202312081107841.png)

### 12、组合型的pointcut

Pointcut定义时，还可以使用&&、||、!运算符。

*   &&：多个匹配都需要满足
*   ||：多个匹配中只需满足一个
*   !：匹配不满足的情况下

```java
@Pointcut("bean(bean1) || bean(bean2)") //匹配bean1或者bean2
@Pointcut("@target(Ann1) && @Annotation(Ann2)") //匹配目标类上有Ann1注解并且目标方法上有Ann2注解
@Pointcut("@target(Ann1) && !@target(Ann2)") // 匹配目标类上有Ann1注解但是没有Ann2注解
```

## 总结

本文详解了@Pointcut的12种用法，案例大家一定要敲一遍，敲的过程中，会遇到问题，然后解决问题，才能够加深理解。

有问题的也欢迎大家留言交流，谢谢！

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202312081107966.png)

## 案例源码

```java
https://gitee.com/javacode2018/spring-series
```

[下一篇：@Aspect中5中通知详解](http://www.itsoku.com/course/5/117)

[上一篇：ProxyFactoryBean创建AOP代理](http://www.itsoku.com/course/5/115)