
# 使用继承简化bean配置(abstract & parent)

[上一篇：lazy-init：bean延迟初始化](http://www.itsoku.com/course/5/94)

[下一篇：lookup-method和replaced-method比较陌生，怎么玩的？](http://www.itsoku.com/course/5/96)

## 先来看一个案例

### ServiceA.java

```plain
package com.javacode2018.lesson001.demo12;

public class ServiceA {
}
```

### ServiceB.java

```java
package com.javacode2018.lesson001.demo12;

public class ServiceB {
    private String name;
    private ServiceA serviceA;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public ServiceA getServiceA() {
        return serviceA;
    }

    public void setServiceA(ServiceA serviceA) {
        this.serviceA = serviceA;
    }

    @Override
    public String toString() {
        return "ServiceB{" +
                "name='" + name + '\'' +
                ", serviceA=" + serviceA +
                '}';
    }
}
```

> 上面类中有2个属性，下面我们再创建一个ServiceC类，和ServiceB中的内容一样。

### ServiceC.java

```java
package com.javacode2018.lesson001.demo12;

public class ServiceC {
    private String name;
    private ServiceA serviceA;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public ServiceA getServiceA() {
        return serviceA;
    }

    public void setServiceA(ServiceA serviceA) {
        this.serviceA = serviceA;
    }

    @Override
    public String toString() {
        return "ServiceC{" +
                "name='" + name + '\'' +
                ", serviceA=" + serviceA +
                '}';
    }
}
```

下面我们使用spring来创建上面3个类对应的bean。

### beanExtend.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
    http://www.springframework.org/schema/beans/spring-beans-4.3.xsd">

    <bean id="serviceA" class="com.javacode2018.lesson001.demo12.ServiceA"/>

    <bean id="serviceB" class="com.javacode2018.lesson001.demo12.ServiceB">
        <property name="name" value="  喔喔松Java"/>
        <property name="serviceA" ref="serviceA"/>
    </bean>

    <bean id="serviceC" class="com.javacode2018.lesson001.demo12.ServiceB">
        <property name="name" value="  喔喔松Java"/>
        <property name="serviceA" ref="serviceA"/>
    </bean>

</beans>
```

创建测试用例。

### BeanExtendTest.java

```java
package com.javacode2018.lesson001.demo12;

import org.junit.Test;
import org.springframework.context.support.ClassPathXmlApplicationContext;

/**
 * 
 * bean定义继承案例
 */
public class BeanExtendTest {
    @Test
    public void normalBean() {
        String beanXml = "classpath:/com/javacode2018/lesson001/demo12/normalBean.xml";
        ClassPathXmlApplicationContext context = new ClassPathXmlApplicationContext(beanXml);
        System.out.println("serviceB:" + context.getBean(ServiceB.class));
        System.out.println("serviceC:" + context.getBean(ServiceC.class));
    }
}
```

### 运行输出

```plain
serviceB:ServiceB{name='  喔喔松Java', serviceA=com.javacode2018.lesson001.demo12.ServiceA@222114ba}
serviceC:ServiceC{name='  喔喔松Java', serviceA=com.javacode2018.lesson001.demo12.ServiceA@222114ba}
```

## 通过继承优化代码

我们再回头去看一下上面xml中，serviceB和serviceC两个bean的定义如下：

```xml
<bean id="serviceB" class="com.javacode2018.lesson001.demo12.ServiceB">
    <property name="name" value="  喔喔松Java"/>
    <property name="serviceA" ref="serviceA"/>
</bean>

<bean id="serviceC" class="com.javacode2018.lesson001.demo12.ServiceC">
    <property name="name" value="  喔喔松Java"/>
    <property name="serviceA" ref="serviceA"/>
</bean>
```

这2个bean需要注入的属性的值是一样的，都需要注入name和serviceA两个属性，并且2个属性的值也是一样的，我们可以将上面的公共的代码抽取出来，通过spring中继承的方式来做到代码重用。

可以将上面xml调整一下，我们来新建一个`extendBean.xml`，内容如下：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
    http://www.springframework.org/schema/beans/spring-beans-4.3.xsd">

    <bean id="serviceA" class="com.javacode2018.lesson001.demo12.ServiceA"/>

    <bean id="baseService" abstract="true">
        <property name="name" value="  喔喔松Java"/>
        <property name="serviceA" ref="serviceA"/>
    </bean>

    <bean id="serviceB" class="com.javacode2018.lesson001.demo12.ServiceB" parent="baseService"/>

    <bean id="serviceC" class="com.javacode2018.lesson001.demo12.ServiceC" parent="baseService"/>

</beans>
```

**上面多了一个baseService的bean，这个bean没有指定class对象，但是多了一个abstract=”true”的属性，表示这个bean是抽象的，abstract为true的bean在spring容器中不会被创建，只是会将其当做bean定义的模板，而serviceB和serviceC的定义中多了一个属性parent，用来指定当前bean的父bean名称，此处是baseService，此时serviceB和serviceC会继承baseService中定义的配置信息。**

来个测试用例看一下效果:

```java
@Test
public void extendBean() {
    String beanXml = "classpath:/com/javacode2018/lesson001/demo12/extendBean.xml";
    ClassPathXmlApplicationContext context = new ClassPathXmlApplicationContext(beanXml);
    System.out.println("serviceB:" + context.getBean(ServiceB.class));
    System.out.println("serviceC:" + context.getBean(ServiceC.class));
}
```

运行输出：

```java
serviceB:ServiceB{name='  喔喔松Java', serviceA=com.javacode2018.lesson001.demo12.ServiceA@222114ba}
serviceC:ServiceC{name='  喔喔松Java', serviceA=com.javacode2018.lesson001.demo12.ServiceA@222114ba}
```

输出和上面案例的输出基本一致。

但是这次bean xml中bean的定义简化了很多，将公共的bean配置提取出来了，通过parent属性来配置需要继承的bean。

**子bean中也可以重新定义父bean中已经定义好的配置，这样子配置会覆盖父bean中的配置信息**，我们将`extendBean.xml`中`serviceC`的定义改一下：

```xml
<bean id="serviceC" class="com.javacode2018.lesson001.demo12.ServiceC" parent="baseService">
    <property name="name" value="欢迎和【  喔喔松Java】一起学些spring!"/>
</bean>
```

运行`extendBean`输出：

```java
serviceB:ServiceB{name='  喔喔松Java', serviceA=com.javacode2018.lesson001.demo12.ServiceA@222114ba}
serviceC:ServiceC{name='欢迎和【  喔喔松Java】一起学些spring!', serviceA=com.javacode2018.lesson001.demo12.ServiceA@222114ba}
```

从输出中可以看出serviceC中的name对父bean中name的值进行了覆盖。

我们再来从容器中获取一下`baseService`，如下：

```java
System.out.println(context.getBean("baseService"));
```

运行会输出：

```java
org.springframework.beans.factory.BeanIsAbstractException: Error creating bean with name 'baseService': Bean definition is abstract

    at org.springframework.beans.factory.support.AbstractBeanFactory.checkMergedBeanDefinition(AbstractBeanFactory.java:1412)
```

会报`BeanIsAbstractException`异常，因为`baseService`是抽象的，不能够创建这个bean实例。

## 总结

1.  **bean元素的abstract属性为true的时候可以定义某个bean为一个抽象的bean，相当于定义了一个bean模板，spring容器并不会创建这个bean，从容器中查找abstract为true的bean的时候，会报错BeanIsAbstractException异常**
2.  **bean元素的parent属性可以指定当前bean的父bean，子bean可以继承父bean中配置信息，也可以自定义配置信息，这样可以覆盖父bean中的配置**

## 案例源码

```java
链接：https://pan.baidu.com/s/1p6rcfKOeWQIVkuhVybzZmQ 
提取码：zr99
```

[下一篇：lookup-method和replaced-method比较陌生，怎么玩的？](http://www.itsoku.com/course/5/96)

[上一篇：lazy-init：bean延迟初始化](http://www.itsoku.com/course/5/94)