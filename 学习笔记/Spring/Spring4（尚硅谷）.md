Spring 是什么(1)

1. Spring 是一个开源框架.

2. Spring 为简化企业级应用开发而生. 使用 Spring 可以使简单的 JavaBean 实现以前只有 EJB 才能实现的功能.

3. Spring 是一个 IOC(DI) 和 AOP 容器框架.

# Spring 是什么(2)

具体描述 Spring·

轻量级：Spring 是非侵入性的 - 基于 Spring 开发的应用中的对象可以不依赖于 Spring 的 API

依赖注入(DI --- dependency injection、IOC)

面向切面编程(AOP --- aspect oriented programming)

容器: Spring 是一个容器, 因为它包含并且管理应用对象的生命周期

框架: Spring 实现了使用简单的组件配置组合成一个复杂的应用. 在 Spring 中可以使用 XML 和 Java 注解组合这些对象

一站式：在 IOC 和 AOP 的基础上可以整合各种企业应用的开源框架和优秀的第三方类库 （实际上 Spring 自身也提供了展现层的 SpringMVC 和 持久层的 Spring JDBC）

![image-20210626114512017](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311061721999.png)

#  搭建 Spring 开发环境

把以下 jar 包加入到工程的 classpath 下:

```xml
commons-logging-1.2.jar
spring-beans-5.2.3.RELEASE.jar
spring-context-5.2.3.RELEASE.jar
spring-core-5.2.3.RELEASE.jar
spring-expression-5.2.3.RELEASE.jar
```

Spring 的配置文件: 一个典型的 Spring 项目需要创建一个或多个 Bean 配置文件, 这些配置文件用于在 Spring IOC 容器里配置 Bean. 

Bean 的配置文件可以放在 classpath 下, 也可以放在其它目录下.

# 建立 Spring 项目

```java
package com.hbd.beans;

public class HelloWorld {
    private String name;
    private Integer age;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        System.out.println("settings name....");
        this.name = name;
    }

    public Integer getAge() {
        return age;
    }

    public void setAge(Integer age) {
        this.age = age;
    }
    public void HelloWorld(){
        System.out.println("hello  "+name);
    }
    public HelloWorld(){
        System.out.println("Helloworld's constructor.....");
    }
}
```

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd">
    <bean id="helloWorld" class="com.hbd.beans.HelloWorld">
        <property name="age" value="12"></property>
        <property name="name" value="wowosong"></property>
    </bean>
</beans>
```

```java
package com.hbd.beans;

import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

public class Main {
    public static void main(String[] args) {
        //1.创建spring的IOC容器
        //ApplicationContext 代表IOC容器
        //ClassPathXmlApplicationContext：是ApplicationContext接口的实现类，该实现类从类路径下来加载配置文件
        ApplicationContext context = new ClassPathXmlApplicationContext("applicationContext.xml");
        //2.从容器中获取Bean
        //利用ID定位到容器中的Bean
        HelloWorld helloworld = (HelloWorld) context.getBean("helloWorld");
        //利用类型返回IOC容器中的bean，但是要求IOC容器中必须只有一个该类型的bean
        HelloWorld helloWorld=context.getBean(HelloWorld.class);
        //3.调用方法
        helloworld.HelloWorld();
    }
}
```

运行结果：

```xml
Helloworld's constructor.....
settings name....
hello  wowosong
```

## Spring 中的 Bean 配置

## IOC & DI 概述

IOC(Inversion of Control)：其思想是反转资源获取的方向。传统的资源查找方式要求组件向容器发起请求查找资源。作为回应, 容器适时

的返回资源。而应用了 IOC 之后, 则是容器主动地将资源推送给它所管理的组件, 组件所要做的仅是选择一种合适的方式来接受资源。这种

行为也被称为查找的被动形式

DI(Dependency Injection) — IOC 的另一种表述方式：即组件以一些预先定义好的方式(例如: setter 方法)接受来自如容器的资源注入. 相

对于 IOC 而言，这种表述更直接

![image-20210626170713309](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311061721827.png)

![image-20210626171045182](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311061721746.png)

![image-20210626171127941](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311061722292.png)

## 配置 bean

1. 配置形式：**基于 XML 文件的方式；基于注解的方式**

* 在 xml 文件中通过 bean 节点来配置 bean
```xml
<!-- 配置bean时，通过反射的方式在IOC容器中创建bean，所以要求Bean中必须有无参构造器-->
<bean id="helloworld" class="com.hbd.wowosong.beans.Helloworld">
    <property name="name" value="wowosong"></property>
    <property name="age" value="30"></property>
</bean>
```

* id：Bean 的名称。
      在 IOC 容器中必须是唯一的
      若 id 没有指定，Spring 自动将权限定性类名作为 Bean 的名字
      id 可以指定多个名字，名字之间可用逗号、分号、或空格分隔

2. Bean 的配置方式：**通过全类名（反射）、通过工厂方法（静态工厂方法 & 实例工厂方法）、FactoryBean**

## IOC 容器 BeanFactory & ApplicationContext 概述

   - 在 Spring IOC 容器读取 Bean 配置创建 Bean 实例之前, 必须对它进行实例化。 只有在容器实例化后, 才可以从 IOC 容器里获取 Bean 实例并使用。

   - Spring 提供了两种类型的 IOC 容器实现. 
     
     **BeanFactory: IOC 容器的基本实现.**
     
     **ApplicationContext: 提供了更多的高级特性. 是 BeanFactory 的子接口.**
     
     BeanFactory 是 Spring 框架的基础设施，面向 Spring 本身；**ApplicationContext 面向使用 Spring 框架的开发者，几乎所有的应**
     
     **用场合都直接使用 ApplicationContext 而非底层的 BeanFactory**
     
     无论使用何种方式, 配置文件时相同的.

### ApplicationContext

 1. ApplicationContext 的主要实现类：

   ClassPathXmlApplicationContext：从 类路径下加载配置文件

   FileSystemXmlApplicationContext: 从文件系统中加载配置文件

 2. ConfigurableApplicationContext 扩展于 ApplicationContext，新增加两个主要方法：**refresh() 和 close()**， 让 

    ApplicationContext 具有启动、刷新和关闭上下文的能力

 3. ApplicationContext 在初始化上下文时就实例化所有单例的 Bean。

 4. WebApplicationContext 是专门为 WEB 应用而准备的，它允许从相对于 WEB 根目录的路径中完成初始化工作

**从 IOC 容器中获取 Bean**

1. 调用 ApplicationContext 的 getBean() 方法，在父接口ListableBeanFactory中

![image-20211218103139137](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311061722916.png)

## 依赖注入的方式：

**Spring 支持 3 种依赖注入的方式：属性注入，构造器注入，工厂方法注入（很少使用，不推荐）**

### 属性注入

1. 属性注入即通过 setter 方法注入Bean 的属性值或依赖的对象

2. 属性注入使用 \<property> 元素, 使用 name 属性指定 Bean 的属性名称，value 属性或\<value> 子节点指定属性值 

3. 属性注入是实际应用中最常用的注入方式  

   ```xml
   <!--    配置bean时，通过反射的方式在IOC容器中创建bean，所以要求Bean中必须有无参构造器-->
   <!--    id:标识容器中bean，id唯一-->
   <bean id="helloworld" class="com.hbd.wowosong.beans.Helloworld">
       <property name="name" value="wowosong"></property>
       <property name="age" value="30"></property>
   </bean>
   ```

### 构造器注入

1. 通过构造方法注入Bean 的属性值或依赖的对象，它保证了 Bean 实例在实例化后就可以使用。

2. 构造器注入在 \<constructor-arg> 元素里声明属性, \<constructor-arg> 中没有 name 属性

```xml
<!--
 通过构造方法配置bean的属性,xml中配置的属性应该与bean中构造器中的属性一致，否则提示异常
 -->
<bean id="car" class="com.hbd.beans.Car">
   <constructor-arg value="Audo"></constructor-arg>
   <constructor-arg value="123"></constructor-arg>
   <constructor-arg value="1200"></constructor-arg>
</bean>
```

```java
package com.hbd.beans;

public class Car {
    private String brand;
    private String corp;
    private int price;
    private int maxSpeed;

    public Car(String brand, String corp, int price) {
        super();
        this.brand = brand;
        this.corp = corp;
        this.price = price;
    }

    @Override
    public String toString() {
        return "Car{" +
            "brand='" + brand + '\'' +
            ", corp='" + corp + '\'' +
            ", price=" + price +
            ", maxSpeed=" + maxSpeed +
            '}';
    }
}
```

### 构造方法注入

按索引匹配入参：

```xml
<!--    通过构造方法获取bean-->
<bean id="car" class="com.hbd.wowosong.beans.Car">
    <constructor-arg index="0" value="Audo"/>
    <constructor-arg index="1" value="chengdu"/>
    <constructor-arg index="2" value="123" type="double"/> 将price改成double类型
</bean>
```

按类型匹配入参：

```xml
<!---
    使用构造器注入属性可以指定参数的位置和参数的类型，以区分重载的构造器
 -->
<bean id="car1" class="com.hbd.beans.Car">
    <constructor-arg value="Audo" type="java.lang.String"></constructor-arg>
    <constructor-arg value="上海" type="java.lang.String"></constructor-arg>
    <constructor-arg value="123" type="int"></constructor-arg>
</bean>
```

### 注入属性值细节

- 字面值

1. 字面值：可用字符串表示的值，可以通过 \<value> 元素标签或 value 属性进行注入。

```xml
<constructor-arg  type="java.lang.String">
    <value>"上海"</value>
</constructor-arg>
```

2. 基本数据类型及其封装类、String 等类型都可以采取字面值注入的方式

3. 若字面值中包含特殊字符，可以使用 \<![CDATA[]]> 把字面值包裹起来。

```xml
<constructor-arg index="1" type="java.lang.String">
    <!--            如果字面值包含特殊字符可以使用[<![CDATA[]]> 包裹起来-->
    <!--            属性值也可以使用value子节点进行配置-->
    <value>[<![CDATA[Shanghai]]>]</value>
</constructor-arg>
```

## 引用其它 Bean

 1. 组成应用程序的 Bean 经常需要相互协作以完成应用程序的功能. 要使 Bean 能够相互访问, 就必须在 Bean 配置文件中指定对 Bean 的引用

 2. 在 Bean 的配置文件中, 可以通过 \<ref> 元素或 ref  属性为 Bean 的属性或构造器参数指定对 Bean 的引用. 

```xml
<bean id="person" class="com.hbd.beans.Person">
    <constructor-arg value="wowosong"></constructor-arg>
    <constructor-arg value="12"></constructor-arg>
    <constructor-arg name="car" ref="car"></constructor-arg>
</bean>

<bean id="person" class="com.hbd.beans.Person">
    <property name="name" value="wowosong"></property>
    <property name="age" value="12"></property>
    <!--- 可以通过property的ref属性建立bean之间的引用关系--->
    <property name="car" >
        <ref bean="car">
            </property>
        <property name="car" ref="car">
        </property>
    </property>
</bean>
```

 3. 也可以在属性或构造器里包含 Bean 的声明, 这样的 Bean 称为内部 Bean

   当 Bean 实例仅仅给一个特定的属性使用时, 可以将其声明为内部 Bean. 内部 Bean 声明直接包含在 \<property> 或 \<constructor-arg> 

元素里， 不需要设置任何 id 或 name 属性

   **内部 Bean 不能使用在任何其他地方**

   ```xml
   <bean id="person" class="com.hbd.beans.Person">
       <property name="name" value="wowosong"></property>
       <property name="age" value="12"></property>
       <property name="car">
           <bean class="com.hbd.beans.Car">
               <constructor-arg name="brand" value="Ford"></constructor-arg>
               <constructor-arg name="corp" value="Chengdu"></constructor-arg>
               <constructor-arg name="price" value="1100000"></constructor-arg>
           </bean>
       </property>
   </bean>
   ```

##  注入参数详解：null 值和级联属性

1. 可以使用专用的 \<null/> 元素标签为 Bean 的字符串或其它对象类型的属性注入 null 值

```xml
<bean id="person3" class="com.hbd.wowosong.beans.Person">
    <constructor-arg value="qwer"></constructor-arg>
    <constructor-arg value="33"></constructor-arg>
    <!--        <constructor-arg ref="car1"></constructor-arg>-->
    <!--        测试null-->
    <constructor-arg ><null/></constructor-arg>
</bean>
<bean id="person1" class="com.hbd.beans.Person">
    <constructor-arg  value="wowosong"></constructor-arg>
    <constructor-arg  value="12"></constructor-arg>
    <constructor-arg ref="car"></constructor-arg>
    <!--- 
       为级联属性赋值，注意：属性需要先初始化(要有set和get方法)后才可以为级联属性赋值，否则会有异常，和Structs2不同
      --->
    <!--下面的car.maxSpeed等属性赋值，会覆盖上面构造器注入的属性值 -->
    <property name="car.maxSpeed" value="1111111111"></property>
    <property name="car.price" value="123"></property>
    <property name="car.brand" value="Mazada"></property>
    <property name="car.corp" value="Xi'an"></property>
</bean>
```

```java
public void setPrice(double price) {
    this.price=price;
}

public void setMaxSpeed(int maxSpeed) {
    this.maxSpeed=maxSpeed;
}

public void setBrand(String brand) {
    this.brand=brand;
}

public void setCorp(String corp) {
    this.corp=corp;
}
```

2. 和 Struts、Hiberante 等框架一样，Spring 支持级联属性的配置。

## **集合属性**

1. 在 Spring中可以通过一组内置的 xml 标签(例如: \<list>, \<set> 或 \<map>) 来配置集合属性.

```xml
<!---测试集合属性-->
<bean id="person2" class="com.hbd.beans.collections.Person">
    <property name="age" value="1100"></property>
    <property name="name" value="wowosong"></property>
    <property name="carList" >
        <list>
            <ref bean="car"/>
            <ref bean="car1"/>
        </list>
    </property>
</bean>

Person{name='wowosong', age=1100, carList=[Car{brand='Mazada', corp='Xi'an', price=123.0, maxSpeed=1111111111}, Car{brand='Audo', corp='<上海>', price=0.0, maxSpeed=123}]}
```

2. 配置 java.util.List 类型的属性, 需要指定 \<list>  标签, 在标签里包含一些元素. 这些标签可以通过 \<value> 指定简单的常量值, 通过 

   \<ref> 指定对其他 Bean 的引用. 通过\<bean> 指定内置 Bean 定义. 通过 \<null/> 指定空元素. 甚至可以内嵌其他集合.

3. 数组的定义和 List 一样, 都使用 \<list>

```xml
<bean id="person" class="com.hbd.wowosong.collections.beans.Person">
    <property name="name" value="wowosong"></property>
    <property name="age" value="40"></property>
    <property name="cars" >
        <list>
            <ref bean="carp1"></ref>
            <ref bean="carp"></ref>
            <bean class="com.hbd.wowosong.collections.beans.Car">
                <constructor-arg value="Ford"></constructor-arg>
                <constructor-arg value="111111"></constructor-arg>
                <constructor-arg value="30"></constructor-arg>
            </bean>
        </list>
    </property>
</bean>
```

4. 配置 java.util.Set 需要使用 \<set> 标签, 定义元素的方法与 List 一样.

5. Java.util.Map 通过 \<map> 标签定义, \<map> 标签里可以使用多个 \<entry> 作为子标签. 每个条目包含一个键和一个值. 

```xml
<!--
      配置map属性
  -->
<bean id="newPerson" class="com.hbd.beans.collections.newPerson">
    <property name="age" value="1100"></property>
    <property name="name" value="wowosong"></property>
    <property name="carList" >
        <!--
       使用map节点及map的entry 子节点配置map类型的成员变量
       -->
        <map>
            <entry key="AA" value-ref="car"></entry>
            <entry key="BB" value-ref="car1"></entry>
        </map>
    </property>
</bean>
```

6. 必须在 \<key> 标签里定义键

7. **因为键和值的类型没有限制, 所以可以自由地为它们指定 \<value>, \<ref>, \<bean> 或 \<null> 元素.** 

8. 可以将 Map 的键和值作为 \<entry> 的属性定义: 简单常量使用 key 和 value 来定义; **Bean 引用通过 key-ref 和 value-ref 属性定义**

9. 使用 \<props> 定义 java.util.Properties, 该标签使用多个 \<prop> 作为子标签. 每个 \<prop> 标签必须定义 key 属性. 

```xml
<!--
       配置properties属性值
  -->
<bean id="DataSource" class="com.hbd.beans.collections.DataSource">
    <property name="properties">
        <props >
            使用props和prop子节点为properties赋值
            <prop key="user"></prop>
            <prop key="password"></prop>
            <prop key="jdbcUrl">jdbc:mysql://test</prop>
            <prop key="driverClass">com.mysql.jdbc.Driver</prop>
        </props>
    </property>
</bean>
```

## **使用 utility scheme 定义集合**

1. 使用基本的集合标签定义集合时, 不能将集合作为独立的 Bean 定义, 导致其他 Bean 无法引用该集合, 所以无法在不同 Bean 之间共享集合.

2. 可以使用 util schema 里的集合标签定义独立的集合 Bean. 需要注意的是, 必须在 \<beans> 根元素里添加 util schema 定义

```xml
<util:list id="cars">
    <ref  bean="car" />
    <ref  bean="car1"/>
</util:list>

<bean id="person6" class="com.hbd.beans.collections.Person">
    <property name="age" value="11"></property>
    <property name="name" value="wowosong"></property>
    <property name="carList" ref="cars"></property>
</bean>
```

## **使用 p 命名空间**

1. 为了简化 XML 文件的配置，越来越多的 XML 文件采用属性而非子元素配置信息。

2. Spring 从 2.5 版本开始引入了一个新的 p 命名空间，可以通过 \<bean> 元素属性的方式配置 Bean 的属性。

```xml
<bean id="person3" class="com.hbd.beans.collections.Person" p:name="wowosong" p:age="31" p:carList-ref="cars">
</bean>
```

3. 使用 p 命名空间后，基于 XML 的配置方式将进一步简化

## **自动装配**

### XML 配置里的 Bean 自动装配

1. Spring IOC 容器可以自动装配 Bean. 需要做的仅仅是在 \<bean> 的 autowire 属性里指定自动装配的模式

2. byType(根据类型自动装配): 若 IOC 容器中有多个与目标 Bean 类型一致的 Bean. 在这种情况下, Spring 将无法判定哪个 Bean 最合适该属性, 所以不能执行自动装配.

```xml
<bean id="address" class="com.hbd.beans.autoware.Address" p:city="chengdu" p:street="Huayang"></bean>
<bean id="car" class="com.hbd.beans.autoware.Car" p:price="10000" p:brand="baoma"></bean>
<bean id="person" class="com.hbd.beans.autoware.Person" p:name="wowosong" p:address="chengduhuayang" p:car-ref="car" p:address-ref="address"></bean>
<bean id="person2" class="com.hbd.beans.autoware.Person" p:name="wowosong" autowire="byType"></bean>
```

3. byName(根据名称自动装配): 必须将目标 Bean 的名称和属性名设置的完全相同.

###   autowire 属性里指定自动装配的模式

```xml
<bean id="address" class="com.hbd.beans.autoware.Address" p:city="chengdu" p:street="Huayang">
</bean>

<bean id="car" class="com.hbd.beans.autoware.Car" p:price="10000" p:brand="baoma"></bean>

<bean id="person" class="com.hbd.beans.autoware.Person" p:name="wowosong" p:address="chengduhuayang" p:car-ref="car" p:address-ref="address">
</bean>

<bean id="person1" class="com.hbd.beans.autoware.Person" p:name="wowosong" autowire="byName">
</bean>
```

4. constructor(通过构造器自动装配): 当 Bean 中存在多个构造器时, 此种自动装配方式将会很复杂. 不推荐使用

### XML 配置里的 Bean 自动装配的缺点

1. 在 Bean 配置文件里设置 autowire 属性进行自动装配将会装配 Bean 的所有属性. 然而, 若只希望装配个别属性时, autowire 属性就不够灵活了. 
2. autowire 属性要么根据类型自动装配, 要么根据名称自动装配, 不能两者兼而有之.
3. 一般情况下，在实际的项目中很少使用自动装配功能，因为和自动装配功能所带来的好处比起来，明确清晰的配置文档更有说服力一些

## bean 之间的关系：

### **继承**

```xml
<!--	bean配置的继承：使用bean的parent属性指定继承哪个bean的配置-->
<!--    抽象bean：bean的abstract属性为true的bean，这样的bean不能被实例化，只能被继承配置-->
<!--    若一个bean 的class属性没有指定，则该bean必须是一个抽象bean-->
<bean id="person3" class="com.hbd.beans.autoware.Person" parent="person">
</bean>
```

Spring 允许继承 bean 的配置， 被继承的 bean 称为父 bean. 继承这个父 Bean 的 Bean 称为子 Bean。

**子 Bean 从父 Bean 中继承配置, 包括 Bean 的属性配置**

**子 Bean 也可以覆盖从父 Bean 继承过来的配置**

父 Bean 可以作为配置模板, 也可以作为 Bean 实例. 若只想把父 Bean 作为模板, **可以设置 \<bean> 的abstract 属性为 true, 这样Spring 将不会实例化这个 Bean**

并不是 \<bean> 元素里的所有属性都会被继承. 比如: autowire, abstract 等.

**也可以忽略父 Bean 的 class 属性, 让子 Bean 指定自己的类, 而共享相同的属性配置. 但此时 abstract 必须设为 true**

###  **依赖**

```xml
<bean id="person4" class="com.hbd.beans.autoware.Person" depends-on="car">
</bean>
```

Spring 允许继承 bean 的配置, 被继承的 bean 称为父 bean. 继承这个父 Bean 的 Bean 称为子 Bean

子 Bean 从父 Bean 中继承配置, 包括 Bean 的属性配置

子 Bean 也可以覆盖从父 Bean 继承过来的配置

父 Bean 可以作为配置模板, 也可以作为 Bean 实例. **若只想把父 Bean 作为模板, 可以设置 \<bean> 的abstract 属性为 true, 这样 Spring 将不会实例化这个 Bean**

并不是 \<bean> 元素里的所有属性都会被继承. 比如: autowire, abstract 等.

也可以忽略父 Bean 的 class 属性, 让子 Bean 指定自己的类, 而共享相同的属性配置. 但此时 abstract 必须设为 true

## bean 的作用域

**singleton；prototype；WEB 环境作用域**

在 Spring 中, 可以在 \<bean> 元素的 scope 属性里设置 Bean 的作用域. 

默认情况下, Spring 只为每个在 IOC 容器里声明的 Bean 创建唯一一个实例, 整个 IOC 容器范围内都能共享该实例：所有后续的 getBean() 调用和 Bean 引用都将返回这个唯一的 Bean 实例.该作用域被称为 singleton, 它是所有 Bean 的默认作用域.

```xml
<!--
    使用bean的scope属性来配置bean的作用域
    singleton：默认值，容器初始化时创建bean实例，在整个容器的生命周期内只创建这一个，单例
    prototype：原型的。容器初始化时不创建bean实例，而在每次请求时都创建一个新的bean实例，并返回
-->
<bean id="car" class="com.hbd.wowosong.scope.Car" scope="prototype">
    <property name="brand" value="Ford"></property>
    <property name="price" value="10000" ></property>
</bean>
```

| 类别      | 说明                                                         |
| --------- | ------------------------------------------------------------ |
| singleton | 在SpringIOC容器中仅存在一个Bean实例，Bean以单实例的方式存在  |
| prototype | 每次调用getBean()时都会返回一个新的实例                      |
| request   | 每次HTTP请求请求都会创建一个新的Bean，该作用域仅适用于WebApplicationContext环境 |
| session   | 同一个HTTP Session共享一个Bean，不同的HTTP Session使用不用的Bean。该作用域仅适用于WebApplicationContext环境 |

## **使用外部属性文件**

在配置文件里配置 Bean 时, 有时需要在 Bean 的配置里混入系统部署的细节信息(例如: 文件路径, 数据源配置信息等). 而这些部署细节实际上需要和 Bean 配置相分离

   ```xml
   <bean id="dataSource" class="com.mchange.v2.c3p0.ComboPooledDataSource">
       <property name="user" value="root"></property>
       <property name="password" value="password" ></property>
       <property name="driverClass" value="com.mysql.jdbc.Driver" ></property>
       <property name="jdbcUrl" value="jdbc:mysql://127.0.0.1:3306/test" ></property>
   </bean>
   ```

Spring 提供了一个 PropertyPlaceholderConfigurer 的 BeanFactory 后置处理器, 这个处理器允许用户将 Bean 配置的部分内容外移到属性文件中. 可以在 Bean 配置文件里使用形式为 ${var} 的变量, PropertyPlaceholderConfigurer 从属性文件里加载属性，并使用这些属性来替换变量.

   ```xml
   <!--导入属性文件-->
   <context:property-placeholder location="db.properties"></context:property-placeholder>
   <bean id="dataSource" class="com.mchange.v2.c3p0.ComboPooledDataSource">
       <property name="user" value="${user}"></property>
       <property name="password" value="${password}" ></property>
       <property name="driverClass" value="${driveClass}" ></property>
       <property name="jdbcUrl" value="${jdbcUrl}" ></property>
   </bean>
   ```

   ```properties
   user=root
   password=password
   jdbcUrl=jdbc:mysql://127.0.0.1:3306/test
   driveClass=com.mysql.jdbc.Driver
   ```

   Spring 还允许在属性文件中使用 ${propName}，以实现属性之间的相互引用。

## spEL 

* Spring 表达式语言（简称SpEL）：是一个支持运行时查询和操作对象图的强大的表达式语言。

* 语法类似于 EL：SpEL 使用 #{…} 作为定界符，所有在大框号中的字符都将被认为是 SpEL

* SpEL 为 bean 的属性进行动态赋值提供了便利

* 通过 SpEL 可以实现：

  * 通过 bean 的 id 对 bean 进行引用

  * 调用方法以及引用对象中的属性

  * 计算表达式的值

  * 正则表达式的匹配

### SpEL：字面量

* 字面量的表示：

```properties
整数：<property name="count" value="#{5}"/>
小数：<property name="frequency" value="#{89.7}"/>
科学计数法：<property name="capacity" value="#{1e4}"/>
String可以使用单引号或者双引号作为字符串的定界符号：
<property name="name" value="#{'Chuck'}"/>
或 <property name='name' value='#{"Chuck"}'/>
Boolean：<property name="enabled" value="#{false}"/>
```

* SpEL：引用 Bean、属性和方法（1）

- **引用其他对象：**

<! --  通过value属性和SpEl配置Bean之间的应用关系-->

```properties
<property name="prefix" value="#{prefixGenerator}"></property>
```

- **引用其他对象的属性**

```properties
<! --  通过value属性和SpEl配置suffix属性值为另外一个Bean的suffix的属性值-->

<property name="suffix" value="#{sequenceGenerator2.suffix}"></property>
```

- **调用其他方法，还可以链式操作**
```properties
<! --  通过value属性和SpEl配置suffix属性值为另外一个Bean的方法的返回值 -->

<property name="suffix" value="#{sequenceGenerator2.toString()}"></property>

<! --  方法的连缀 -->

<property name="suffix" value="#{sequenceGenerator2.toString(),toUpperCase()}"></property>
```

* SpEL支持的运算符号（1）

- **算术运算符**：+，-，*，/，%，^:

```properties
<property name="adjustedAmount" value="#{counter.total+42}"/>

<property name="adjustedAmount" value="#{counter.total-20}"/>

<property name="circumference" value="#{2 * T(java.lang.Math).PI * circle.radius}"/>

<property name="average" value="#{counter.total/counter.count}"/>

<property name="adjustedAmount" value="#{counter.total%counter.count}"/>

<property name="area" value="#{T(java.lang.Math).PI * circle.radius ^ 2}"/>
```

- **加号还可以用作字符串连接**：

```properties
<constructor-arg value ="#{performer.firstName+ ''+ performer.lastName}"/>
```

- **比较运算符： <，>，==，<=，>=，lt，gt，eq，le，ge**

```properties
<property name="equal" value="#{counter.total == 20}"/>

<property name="hasCapacity" value="#{counter.total le 10000}"/>
```

* SpEL支持的运算符号（2）

- 逻辑运算符： and，or，not， |

```properties
<property name="largeCircle" value="#{shape.kind=='circle' and shape.perimeter gt 10000}"/>

<property name="outOfStock" value="#{not product.available}"/>

<property name="outOfStock" value="#{not product.available}"/>
```

- if-else运算符：？:(ternary),?:(Elvis)

```properties
<constructor-arg value ="#{songSelector.selectSong()=='Jingle Bells'?piano:'Jingle Bells'}"/>
```

- 正则表达式： matches

```properties
<constructor-arg value ="#{admin.email matches '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}'}"/>
```

* SpEL：引用 Bean、属性和方法（2）

调用静态方法或静态属性：通过T()调用一个类的静态方法，它将返回一个Class Object，然后再调用相应的方法或属性：

```xml
<property name="tyrePermiter" value="#{T(java.lang.Math).PI*80}"></property>
```

```xml
<bean id="address" class="com.hbd.wowosong.spel.Address">
    <!--        使用spel为属性赋值一个字面值-->
    <property name="city" value="#{'Beijing'}"></property>
    <property name="street" value="WudaoKou"></property>
</bean>
<bean id="car" class="com.hbd.wowosong.spel.Car">
    <property name="brand" value="Audo8"></property>
    <property name="price" value="500000"></property>
    <!--        使用SpEL引用类的静态属性-->
    <property name="tyrePermiter" value="#{T(java.lang.Math).PI*80}"></property>
</bean>
<bean id="person" class="com.hbd.wowosong.spel.Person">
    <!--        使用SpEl引用其他bean-->
    <property name="car" value="#{car}"></property>
    <!--        使用SpEL引用其他bean的属性-->
    <property name="city" value="#{address.city}"></property>
    <!--        使用SpEl中使用运算符-->
    <property name="info" value="#{car.price>30000?'金领':'白领'}"></property>
    <property name="name" value="Tom"></property>
</bean>
```

##  IOC 容器中 Bean 的生命周期

* Spring IOC 容器可以管理 Bean 的生命周期, Spring 允许在 Bean 生命周期的特定点执行定制的任务. 

* Spring IOC 容器对 Bean 的生命周期进行管理的过程:

  * 通过构造器或工厂方法创建 Bean 实例
  * 为 Bean 的属性设置值和对其他 Bean 的引用
  * 调用 Bean 的初始化方法
  * Bean 可以使用了
  * 当容器关闭时, 调用 Bean 的销毁方法

* 在 Bean 的声明里设置 init-method 和 destroy-method 属性, 为 Bean 指定初始化和销毁方法.

```xml
<bean id="car" class="com.hbd.wowosong.cycle.Car" init-method="init" destroy-method="destory">
  <property name="brand" value="Audo A7"></property>
</bean>
```

```java
public class Car {
    public Car() {
        System.out.println("Car's Constructor。。。。");
    }
    private String brand;

    public String getBrand() {
        return brand;
    }

    public void setBrand(String brand) {
        this.brand = brand;
    }
    public void init(){
        System.out.println("init.....");
    }
    public void destory(){
        System.out.println("destory....");
    }

    @Override
    public String toString() {
        return "Car{" +
            "brand='" + brand + '\'' +
            '}';
    }
}
```

### **创建 Bean 后置处理器**

* Bean 后置处理器允许在调用初始化方法前后对 Bean 进行额外的处理.

* Bean 后置处理器对 IOC 容器里的**所有 Bean 实例逐一处理**, 而非单一实例. 其典型应用是: 检查 Bean 属性的正确性或根据特定的标准更改 Bean 的属性.

* 对Bean 后置处理器而言, 需要实现BeanPostProcessor 接口. 在初始化方法被调用前后, Spring 将把每个 Bean 实例分别传递给上述接口的以下两个方法:

```java
/**
  	 * Apply this BeanPostProcessor to the given new bean instance <i>before</i> any bean
  	 * initialization callbacks (like InitializingBean's {@code afterPropertiesSet}
  	 * or a custom init-method). The bean will already be populated with property values.
  	 * The returned bean instance may be a wrapper around the original.
  	 * @param bean the new bean instance
  	 * @param beanName the name of the bean
  	 * @return the bean instance to use, either the original or a wrapped one;
  	 * if {@code null}, no subsequent BeanPostProcessors will be invoked
  	 * @throws org.springframework.beans.BeansException in case of errors
  	 * @see org.springframework.beans.factory.InitializingBean#afterPropertiesSet
  	 */
Object postProcessBeforeInitialization(Object bean, String beanName) throws BeansException;
/**
  	 * Apply this BeanPostProcessor to the given new bean instance <i>after</i> any bean
  	 * initialization callbacks (like InitializingBean's {@code afterPropertiesSet}
  	 * or a custom init-method). The bean will already be populated with property values.
  	 * The returned bean instance may be a wrapper around the original.
  	 * <p>In case of a FactoryBean, this callback will be invoked for both the FactoryBean
  	 * instance and the objects created by the FactoryBean (as of Spring 2.0). The
  	 * post-processor can decide whether to apply to either the FactoryBean or created
  	 * objects or both through corresponding {@code bean instanceof FactoryBean} checks.
  	 * <p>This callback will also be invoked after a short-circuiting triggered by a
  	 * {@link InstantiationAwareBeanPostProcessor#postProcessBeforeInstantiation} method,
  	 * in contrast to all other BeanPostProcessor callbacks.
  	 * @param bean the new bean instance
  	 * @param beanName the name of the bean
  	 * @return the bean instance to use, either the original or a wrapped one;
  	 * if {@code null}, no subsequent BeanPostProcessors will be invoked
  	 * @throws org.springframework.beans.BeansException in case of errors
  	 * @see org.springframework.beans.factory.InitializingBean#afterPropertiesSet
  	 * @see org.springframework.beans.factory.FactoryBean
  	 */
Object postProcessAfterInitialization(Object bean, String beanName) throws BeansException;
```

  ```xml
  <!---实现BeanPostProcessor接口，并提供postProcessBeforeInitialization：init-method之前调用
      postProcessAfterInitialization：init-method之后调用
      bean：bean实例本身
      beanName：IOC容器中bean的名字
      返回值：返回到用户的bean，注意：可以在以上两个方法中修改返回的bean，甚至返回一个新的bean
      配置后置处理器：不需要配置id，IOC容器自动识别是一个BeanPostProcessor后置处理器
   -->
  <bean class="com.hbd.wowosong.cycle.MyBeanPostProcessor"></bean>
  ```

  ```java
  public class MyBeanPostProcessor implements BeanPostProcessor {
      @Override
      public Object postProcessBeforeInitialization(Object bean, String beanName) throws BeansException {
          System.out.println("postProcessBeforeInitialization.....beanName:"+beanName);
          System.out.println(bean);
          return bean;
      }
  
      @Override
      public Object postProcessAfterInitialization(Object bean, String beanName) throws BeansException {
          System.out.println("postProcessAfterInitialization.....beanName:"+beanName);
          Car car = new Car();
          car.setBrand("Ford");
          return car;
      }
  }
  ```

  ```properties
  Car's Constructor。。。。
  postProcessBeforeInitialization.....beanName:car
  Car{brand='Audo A7'}
  init.....
  postProcessAfterInitialization.....beanName:car
  Car's Constructor。。。。
  Car{brand='Ford'}
  destory....
  ```

## 通过调用静态工厂方法创建 Bean

调用静态工厂方法创建 Bean是将对象创建的过程封装到静态方法中. 当客户端需要对象时, 只需要简单地调用静态方法, 而不同关心创建对象的细节.

**要声明通过静态方法创建的 Bean, 需要在 Bean 的 class 属性里指定拥有该工厂的方法的类, 同时在 factory-method 属性里指定工厂方法的名称. 最后, 使用 \<constrctor-arg> 元素为该方法传递方法参数.**

```java
/**
 * 静态工厂方法：直接调用某个类的静态方式就可以返回bean实例
 */
public class StaticCarFactory {
    private static Map<String, Car> map = new HashMap<>();

    static {
        map.put("audi", new Car("audo", 1000000));
        map.put("Ford", new Car("Ford", 400000));
    }

    /**
     * 静态工厂方法
     *
     * @param name
     * @return
     */
    public static Car getCar(String name) {
        return map.get(name);
    }
}
```

```xml
<!--
通过静态工厂方法来配置bean，注意不是配置静态工厂方法实例，而是配置bean实例
class属性：指向静态工厂方法的全类名
factory-method：指向静态工厂方法的方法名
constructor-arg：如果工厂方法需要传入参数，则使用constructor-arg来配置参数
-->     
<bean id="staticFactory" class="com.hbd.wowosong.factory.StaticCarFactory" factory-method="getCar">
    <constructor-arg value="baoma"></constructor-arg>
</bean>
```

## 通过调用实例工厂方法创建 Bean

实例工厂方法: 将对象的创建过程封装到另外一个对象实例的方法里. 当客户端需要请求对象时, 只需要简单的调用该实例方法而不需要关心对象的创建细节.

要声明通过实例工厂方法创建的 Bean

- 在 bean 的 factory-bean 属性里指定拥有该工厂方法的 Bean

- 在 factory-method 属性里指定该工厂方法的名称

- 使用 construtor-arg 元素为工厂方法传递方法参数

```java
/**
 * 实例工厂方法：实例工厂方法。即现需要创建工厂本身，再调用工厂的实例方法返回bean的实例
 */
public class InstanceCarFactory {

    private Map<String,Car> cars=null;
    public InstanceCarFactory(){
        //通过构造器
        cars=new HashMap<String,Car>();
        cars.put("audi",new Car("audi",100000));
        cars.put("Tesal",new Car("Tesal",30000));
    }
    private Car getCar(String name){
        return cars.get(name);
    }
}
```

```xml
<!--    配置工厂实例-->
<bean id="carFactory" class="com.hbd.wowosong.factory.InstanceCarFactory">
</bean>
<!--    通过实例工厂方法来配置bean-->
<!-- 
    factory-bean属性：执行实例工厂方法的bean
    factory-method：指向静态工厂方法的名字
    constructor-arg：如果工厂方法需要传入参数，则使用constructor-arg来配置参数
-->

<bean id="car2" factory-bean="carFactory" factory-method="getCar">
    <constructor-arg value="audi"></constructor-arg>
</bean>
```

## 实现 FactoryBean 接口在 Spring IOC 容器中配置 Bean

- Spring 中有两种类型的 Bean, 一种是普通Bean, 另一种是**工厂Bean, 即FactoryBean**. 
- 工厂 Bean 跟普通Bean不同, 其返回的对象不是指定类的一个实例, 其返回的是该工厂 Bean 的 getObject 方法所返回的对象
- FactoryBean与BeanFactory的区别：https://www.cnblogs.com/aspirant/p/9082858.html

```java
package beans;

import org.springframework.beans.factory.FactoryBean;

/**
 * 自定义的FactoryBean需要实现FactoryBean的接口
 */
public class CarFactoryBean implements FactoryBean<Car> {
    private String brand;

    public String getBrand() {
        return brand;
    }

    @Override
    /**
     * 返回bean对象
     *
     */
    public Car getObject() throws Exception {
        return new Car(brand,"guangdong",500000);
    }

    /**
     * 返回bean类型
     * @return
     */
    @Override
    public Class<?> getObjectType() {
        return null;
    }

    @Override
    public boolean isSingleton() {
        return false;
    }

    public void setBrand(String brand) {
    }
}
```

```xml
<!--
  通过FactoryBean来配置bean实例
   class指向FactroyBean的全类名
   roperty：配置FactoryBean的属性
   但是实际返回的实例指向FactoryBean的getObject方法返回的bean实例
-->
<bean id="car" class="com.hbd.wowosong.factorybean.CarFactoryBean">
    <property name="brand" value="BMW"></property>
</bean>
```

## 基于注解的方式（基于注解配置 Bean；基于注解来装配 Bean 的属性）

### 在 classpath 中扫描组件

1. 组件扫描(component scanning):  Spring 能够从 classpath 下自动扫描, 侦测和实例化具有特定注解的组件. 

2. 特定组件包括:
    @Component: 基本注解, 标识了一个受 Spring 管理的组件
    @Respository: 标识持久层组件
    @Service: 标识服务层(业务层)组件
    @Controller: 标识表现层组件

3. 对于扫描到的组件, Spring 有默认的命名策略: **使用非限定类名, 第一个字母小写. 也可以在注解中通过 value 属性值标识组件的名称**

4. **当在组件类上使用了特定的注解之后, 还需要在 Spring 的配置文件中声明 <context:component-scan> ：**

5. base-package 属性指定一个需要扫描的基类包，Spring 容器将会扫描这个基类包里及其子包中的所有类. 

6. 当需要扫描多个包时, 可以使用逗号分隔.

7. 如果仅希望扫描特定的类而非基包下的所有类，可使用 resource-pattern 属性过滤特定的类，示例:

```properties
<context:component-scan base-package="com.hbd.wowosong.annotation"  resource-pattern="/autowire/*.class">
```

8. <context:include-filter> 子节点表示要包含的目标类

```xml
<context:component-scan base-package="com.hbd.wowosong.annotation">
   <context:exclude-filter type="annotation"expression="org.springframework.stereotype.Repository"/>
</context:component-scan>
<!--指定SpringIOC容器扫描的包-->
```

9. <context:exclude-filter> 子节点表示要排除在外的目标类

10. <context:component-scan> 下可以拥有若干个 <context:include-filter> 和 <context:exclude-filter> 子节点

11. <context:include-filter> 和 <context:exclude-filter> 子节点支持多种类型的过滤表达式：

| 类别       | 示例                      | 说明                                                         |
| ---------- | ------------------------- | ------------------------------------------------------------ |
| annotation | com.atguigu.XxxAnnotation | 所有标注了XxxAnnotation的类。该类型采用目标类是否标注了某个注解进行过滤 |
| assinable  | com.atguigu.XxxService    | 所有继承或扩展了XxxService的类。该类型采用目标类是否继承或扩展某个特定类进行过滤 |
| aspectj    | com.atguigu.Service       | 所有类名以Service结束的类及继承或扩展它们的类。该类型采用AspectJ表达式进行过滤 |
| regex      | com.atguigu\.anno.*       | 所有com.atguigu.anno包下的类。该类型采用正则表达式根据类的类进行过滤 |
| custom     | com.atguigu.XxxTypeFilter | 采用XxxTypeFilter通过代码的方式定义过滤规则。该类必须实现org.springframework.core.type.TypeFilter接口 |

## 组件装配

<context:component-scan> **元素还会自动注册 AutowiredAnnotationBeanPostProcessor 实例, 该实例可以自动装配具有 @Autowired 和 @Resource 、@Inject注解的属性.**

### 使用 @Autowired 自动装配 Bean

@Autowired 注解自动装配具有兼容类型的单个 Bean属性
1. **构造器, 普通字段(即使是非 public), 一切具有参数的方法都可以应用@Autowired 注解**
2. **默认情况下, 所有使用 @Autowired 注解的属性都需要被设置. 当 Spring 找不到匹配的 Bean 装配属性时, 会抛出异常, 若某一属性允许不被设置, 可以设置 @Autowired 注解的 required 属性为 false**
3. **默认情况下, 当 IOC 容器里存在多个类型兼容的 Bean 时, 通过类型的自动装配将无法工作. 此时可以在 @Qualifier 注解里提供 Bean 的名称. Spring 允许对方法的入参标注 @Qualifiter 已指定注入 Bean 的名称**
4. **@Autowired 注解也可以应用在数组类型的属性上, 此时 Spring 将会把所有匹配的 Bean 进行自动装配.**
5. **@Autowired 注解也可以应用在集合属性上, 此时 Spring 读取该集合的类型信息, 然后自动装配所有与之兼容的 Bean.** 
6. **@Autowired 注解用在 java.util.Map 上时, 若该 Map 的键值为 String, 那么 Spring 将自动装配与之 Map 值类型兼容的 Bean, 此时 Bean 的名称作为键值**

### 使用 @Resource 或 @Inject自动装配 Bean

- Spring 还支持 @Resource 和 @Inject 注解，这两个注解和 @Autowired 注解的功用类似
- @Resource 注解要求提供一个 Bean 名称的属性，若该属性为空，则自动采用标注处的变量或方法名作为 Bean 的名称
- @Inject 和 @Autowired 注解一样也是按类型匹配注入的 Bean， 但没有 required 属性
- 建议使用 **@Autowired 注解**

## 泛型依赖注入

**Spring 4.x 中可以为子类注入子类对应的泛型类型的成员变量的引用;创建两个带泛型的类,并配置两者的依赖关系，对于继承这两个类的子类,如果泛型相同,则会继承这种依赖关系**： 

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311061722817.png)

```java
public class BaseService<T> {
    @Autowired
    protected BaseRepository<T> repository;

    public void add(){
        System.out.println("add...");
        System.out.println(repository);
    }
}
```

```java
public class BaseRepository<T> {
  
}
```

```java
@Repository
public class UserRepository extends BaseRepository<User> {
  
}
```

```java
@Service
public class UserService extends BaseService<User> {
  
}
```

```
add...
com.hbd.wowosong.generic.di.UserRepository@ba8d91c
```

## 整合多个配置文件

1. Spring 允许通过 \<import> 将多个配置文件引入到一个文件中，进行配置文件的集成。这样在启动 Spring 容器时，仅需要指定这个合并好的配置文件就可以。
2. import 元素的 resource 属性支持 Spring 的标准的路径资源

| 地址前缀   | 示例                                      | 对应资源类型                                        |
| ---------- | ----------------------------------------- | --------------------------------------------------- |
| classpath: | classpath:spring-mvc.xml                  | 从类路径下加载资源，classpath:和classpath:/是等价的 |
| file       | file:/conf/security/spring-shiro.xml      | 从文件系统目录中装载资源，可采用绝对或相对路径      |
| http://    | http://www.atguigu.com/resource/beans.xml | 从web服务器中加载资源                               |
| ftp://     | ftp://www.atguigu.com/resource/beans.xml  | 从ftp服务器中加载资源                               |

## Spring AOP

<img src="https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311061722467.png" alt="image-20211219205555657" style="zoom:50%;" />

```java
package com.hbd.wowosong.aop;

public class ArithmeticCaculatorImpl implements ArithmeticCaculator {
    @Override
    public int add(int x, int y) {
        System.out.println("The method add begins with[" + x + "," + y + "]");
        int result = x + y;
        System.out.println("The method add  end with[" + x + "," + y + "]");

        return result;
    }

    @Override
    public int sub(int x, int y) {
        System.out.println("The method sub begins with[" + x + "," + y + "]");
        int result = x - y;
        System.out.println("The method sub  end with[" + x + "," + y + "]");
        return result;
    }

    @Override
    public int mul(int x, int y) {
        System.out.println("The method mul begins with[" + x + "," + y + "]");
        int result = x * y;
        System.out.println("The method mul  end with[" + x + "," + y + "]");

        return result;
    }

    @Override
    public int div(int x, int y) {
        System.out.println("The method div begins with[" + x + "," + y + "]");
        int result = x / y;
        System.out.println("The method div  end with[" + x + "," + y + "]");

        return result;
    }
}
```

```java
package com.hbd.wowosong.aop;

public interface ArithmeticCaculator {
    int add(int x, int y);

    int sub(int x, int y);

    int mul(int x, int y);

    int div(int x, int y);
}

```

### 问题

代码混乱：越来越多的非业务需求(日志和验证等)加入后, 原有的业务方法急剧膨胀.  每个方法在处理核心逻辑的同时还必须兼顾其他多个关注点. 

代码分散: 以日志需求为例, 只是为了满足这个单一需求, 就不得不在多个模块（方法）里多次重复相同的日志代码. 如果日志需求发生变化, 必须修改所有模块.

### 使用动态代理解决上述问题

代理设计模式的原理: **使用一个代理将对象包装起来, 然后用该代理对象取代原始对象.** 任何对原始对象的调用都要通过代理. 代理对象决定是否以及何时将方法调用转到原始对象上.实现**InvocationHandler**

![image-20210812212835845](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311061723646.png)

```java
public class ArithmeticCaculatorLogProxyHandler implements InvocationHandler {
    //第一种实现
    public Log log = LogFactory.getLog(this.getClass());
    /**
     * 被代理对象
     */
    private Object target;

    public ArithmeticCaculatorLogProxyHandler(Object target) {
        super();
        this.target = target;
    }

    @Override
    public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
        String methodName = method.getName();
        log.info("The method name: " + methodName + " method args: " + Arrays.asList(args));
        Object result = method.invoke(target, args);
        log.info("The method name: " + methodName + " result: " + result);
        return result;
    }

    public static Object createProxy(Object target) {
        return Proxy.newProxyInstance(target.getClass().getClassLoader(), target.getClass().getInterfaces(), new ArithmeticCaculatorLogProxyHandler(target));
    }
}
```

```java
package com.hbd.wowosong.aop;

public class ArithmeticCaculatorImpl implements ArithmeticCaculator {
    @Override
    public int add(int x, int y) {
        int result = x + y;
        return result;
    }

    @Override
    public int sub(int x, int y) {
        int result = x - y;
        return result;
    }

    @Override
    public int mul(int x, int y) {
        int result = x * y;
        return result;
    }

    @Override
    public int div(int x, int y) {
        int result = x / y;
        return result;
    }
}
```

```java
package com.hbd.wowosong.aop;

import java.lang.reflect.InvocationHandler;
import java.lang.reflect.Method;
import java.lang.reflect.Proxy;
import java.util.Arrays;

public class ArithmeticCaculatorLogProxy {
    private  ArithmeticCaculator  target;

    public ArithmeticCaculatorLogProxy(ArithmeticCaculator target) {
        this.target = target;
    }

    public ArithmeticCaculator getLoggingProxy(){
        ArithmeticCaculator proxy=null;
        //        代理对象由哪一个类加载器负责加载
        ClassLoader loader=target.getClass().getClassLoader();
        //        代理对象的类型，即其中由哪些方法
        Class<?>[] interfaces=new Class[]{ArithmeticCaculator.class};
        //       当调用代理对象其中的方法时，该执行的代码
        InvocationHandler h =new InvocationHandler() {
            @Override
            public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
                /**
                 * proxy: 正在返回的那个代理对象，一般情况下在invoke方法中都不使用该对象
                 * method：正在被调用方法
                 * args：调用方法时，传入的参数
                 */
                String methodName = method.getName();
                //                日志
                System.out.println("The method...."+methodName+"begin with"+ Arrays.asList(args));
                //                执行方法
                Object result = method.invoke(target, args);
                System.out.println("The method...."+methodName+"end with "+result);
                return result;
            }
        };
        proxy= (ArithmeticCaculator)Proxy.newProxyInstance(loader,interfaces,h);
        return proxy;
    }
}
```

```java
ArithmeticCaculator target = new ArithmeticCaculatorImpl();
ArithmeticCaculator proxy=new ArithmeticCaculatorLogProxy(target).getLoggingProxy();
ArithmeticCaculator proxy1 = (ArithmeticCaculator) 					 ArithmeticCaculatorLogProxyHandler.createProxy(target);
int add2 = proxy1.add(111, 2);
int add = proxy.add(1, 2);
System.out.println(add);
```

### AOP 简介

1. AOP(Aspect-Oriented Programming， 面向切面编程): 

   是一种新的方法论。 是对传统 OOP(Object-Oriented Programming。 面向对象编程) 的补充。

2. AOP 的主要编程对象是切面(aspect)，而切面模块化横切关注点.
   在应用 AOP 编程时，仍然需要定义公共功能，但可以明确的定义这个功能在哪里，以什么方式应用，并且不必修改受影响的类。这样一来横切关注点就被模块化到特殊的对象(切面)里。
   
3. AOP 的好处：
   每个事物逻辑位于一个位置，代码不分散，便于维护和升级业务模块更简洁, 只包含核心业务代码。

![image-20210812214231774](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311061723650.png)

**AOP 术语**

* **切面**(Aspect):  横切关注点(跨越应用程序多个模块的功能)被模块化的特殊对象
* 通知(Advice):  切面必须要完成的工作
* 目标(Target): 被通知的对象
* 代理(Proxy): 向目标对象应用通知之后创建的对象
* **连接点（Joinpoint）**：程序执行的某个特定位置：如类**某个方法调用前、调用后、方法抛出异常后**等。连接点由两个信息确定：**方法表示的程序执行点；相对点表示的方位。**例如 ArithmethicCalculator#add() 方法执行前的连接点，执行点为 ArithmethicCalculator#add()； 方位为该方法执行前的位置
* **切点（pointcut）**：每个类都拥有多个连接点：例如 ArithmethicCalculator 的所有方法实际上都是连接点，即连接点是程序类中客观存在的事务。AOP 通过切点定位到特定的连接点。类比：连接点相当于数据库中的记录，切点相当于查询条件。切点和连接点不是一对一的关系，一个切点匹配多个连接点，切点通过 org.springframework.aop.Pointcut 接口进行描述，它使用类和方法作为连接点的查询条件。

### Spring  AOP

**AspectJ：Java 社区里最完整最流行的 AOP 框架.**
在 Spring2.0 以上版本中, 可以使用基于 AspectJ 注解或基于 XML 配置的 AOP

#### 在 Spring 中启用 AspectJ 注解支持

1. 要在 Spring 应用中使用 AspectJ 注解， 必须在 classpath 下包含 AspectJ 类库: aopalliance.jar、aspectj.weaver.jar 和 spring-aspects.jar
2. 将 aop Schema 添加到 \<beans> 根元素中.
3. 要在 Spring IOC 容器中启用 AspectJ 注解支持, 只要在 Bean 配置文件中定义一个空的 XML 元素 <aop:aspectj-autoproxy>
4. 当 Spring IOC 容器侦测到 Bean 配置文件中的 <aop:aspectj-autoproxy> 元素时, 会自动为与 AspectJ 切面匹配的 Bean 创建代理.

#### 用 AspectJ 注解声明切面

1. 要在 Spring 中声明 AspectJ 切面, 只需要在 IOC 容器中将切面声明为 Bean 实例. 当在 Spring IOC 容器中初始化 AspectJ 切面之后, Spring IOC 容器就会为那些与 AspectJ 切面相匹配的 Bean 创建代理.

2. 在 AspectJ 注解中, **切面只是一个带有 @Aspect 注解的 Java 类**. 

3. 通知是标注有某种注解的简单的 Java 方法.

4. AspectJ 支持 5 种类型的通知注解: 

   **@Before: 前置通知, 在方法执行之前执行**

   **@After: 后置通知, 在方法执行之后执行** 

   **@AfterRunning: 返回通知, 在方法返回结果之后执行**

   **@AfterThrowing: 异常通知, 在方法抛出异常之后**

   **@Around: 环绕通知, 围绕着方法执行**

#### 前置通知

前置通知:在方法执行之前执行的通知
前置通知使用 @Before 注解, 并将切入点表达式的值作为注解值.

```java
//声明为一个切面
@Aspect
@Component
@Order(0)
public class LoggingAspect {
    @Pointcut("execution(* com.hbd.wowosong.aopimpl.ArithmeticCaculatorImpl.*(..))")
    public void declareJointPoint() {
        System.out.println("-----declareJointPoint-------");
    }

    @Before("declareJointPoint()")
    public void BeforeMethod(JoinPoint joinPoint) {
        String name = joinPoint.getSignature().getName();
        Object[] args = joinPoint.getArgs();
        System.out.println("The method " + name + " begin with args " + Arrays.asList(args) + " ");
    }
```

标识这个方法是一个前置通知，切点表达式表示执行ArithmeticCaculatorImpl接口的所有方法。*代表匹配任意修饰符及任意返回值，参数列表中的...匹配任意数量的参数

#### 利用方法签名编写 AspectJ 切入点表达式

1. 最典型的切入点表达式时根据方法的签名来匹配各种方法:
2. execution \* com.atguigu.spring.ArithmeticCalculator.\*(..): 匹配 ArithmeticCalculator 中声明的所有方法,第一个 \* 代表任意修饰符及任意返回值. 第二个 \* 代表任意方法. .. 匹配任意数量的参数. 若目标类与接口与该切面在同一个包中, 可以省略包名.
3. execution public \* ArithmeticCalculator.\*(..): 匹配 ArithmeticCalculator 接口的所有公有方法.
4. execution public double ArithmeticCalculator.\*(..): 匹配 ArithmeticCalculator 中返回 double 类型数值的方法
5. execution public double ArithmeticCalculator.\*(double, ..): 匹配第一个参数为 double 类型的方法, .. 匹配任意数量任意类型的参数
6. execution public double ArithmeticCalculator.\*(double, double): 匹配参数类型为 double, double 类型的方法.

#### 合并切入点表达式

在 AspectJ 中, 切入点表达式可以通过操作符 &&, ||, ! 结合起来. 

```java
@Pointcut("execution(* com.hbd.wowosong.aopimpl.ArithmeticCaculatorImpl.*(..)) || execution(* com.hbd.wowosong.aopimpl.ArithmeticCaculatorImpl.*(..))")
public void declareJointPoint() {
    System.out.println("-----declareJointPoint-------");
}

@Before("declareJointPoint()")
public void BeforeMethod(JoinPoint joinPoint) {
    String name = joinPoint.getSignature().getName();
    Object[] args = joinPoint.getArgs();
    System.out.println("The method " + name + " begin with args " + Arrays.asList(args) + " ");
}
```

#### 让通知访问当前连接点的细节

可以在通知方法中声明一个类型为 JoinPoint 的参数. 然后就能访问链接细节. 如方法名称和参数值. 

```java
@Before("execution(* *.*(..))")
public void BeforeMethod(JoinPoint joinPoint) {
    String name = joinPoint.getSignature().getName();
    Object[] args = joinPoint.getArgs();
    System.out.println("The method " + name + " begin with args " + Arrays.asList(args) + " ");
}
```

标识这个方法是一个前置通知，切点表达式表示执行任意类的所有方法。第一个\*代表匹配任意修饰符及任意返回值，第二个\*代表任意类的对象，第三个\*代表任意方法，参数列表中的...匹配任意数量的参数

#### 后置通知

1. 后置通知是在连接点完成之后执行的, **即连接点返回结果或者抛出异常的时候, 下面的后置通知记录了方法的终止.** 
2. 一个切面可以包括一个或者多个通知.还不能访问目标方法的结果

```java
@After("declareJointPoint()")
public void AfterMethod(JoinPoint joinPoint) {
    String name = joinPoint.getSignature().getName();
    Object[] args = joinPoint.getArgs();
    System.out.println("The method " + name + " end  ");
}
```

```java
package com.hbd.wowosong.aopimpl;

public interface ArithmeticCaculator {
    int add(int x, int y);

    int sub(int x, int y);

    int mul(int x, int y);

    int div(int x, int y);
}
```

```java
package com.hbd.wowosong.aopimpl;

import org.springframework.stereotype.Component;

@Component
public class ArithmeticCaculatorImpl implements ArithmeticCaculator {
    @Override
    public int add(int x, int y) {
        int result = x + y;
        return result;
    }

    @Override
    public int sub(int x, int y) {
        int result = x - y;
        return result;
    }

    @Override
    public int mul(int x, int y) {
        int result = x * y;
        return result;
    }

    @Override
    public int div(int x, int y) {
        int result = x / y;
        return result;
    }
}

```

```java
package com.hbd.wowosong.aopimpl;

import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.After;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.springframework.stereotype.Component;

import java.util.Arrays;

//声明为一个切面
@Aspect
@Component
public class LoggingAspect {
    @Before("execution(* com.hbd.wowosong.aopimpl.ArithmeticCaculatorImpl.*(int,int))")
    public void  BeforeMethod(JoinPoint joinPoint){
        String name = joinPoint.getSignature().getName();
        Object[] args = joinPoint.getArgs();
        System.out.println("The method "+name+"begin with args "+ Arrays.asList(args)+" ");
    }
    @After("execution(* com.hbd.wowosong.aopimpl.ArithmeticCaculatorImpl.*(int,int))")
    public void  AfterMethod(JoinPoint joinPoint){
        String name = joinPoint.getSignature().getName();
        Object[] args = joinPoint.getArgs();
        System.out.println("The method "+name+" end  ");
    }
}

```

```xml
<aop:aspectj-autoproxy></aop:aspectj-autoproxy>
<!--    使用AspectJ注解作用：自动为匹配的类生成代理对象-->
```

#### 返回通知

无论连接点是正常返回还是抛出异常, 后置通知都会执行. **如果只想在连接点返回的时候记录日志, 应使用返回通知代替后置通知.**

* 在返回通知中, 只要将 returning 属性添加到 @AfterReturning 注解中, 就可以访问连接点的返回值. 该属性的值即为用来传入返回值的参数名称. 
* **必须在通知方法的签名中添加一个同名参数. 在运行时, Spring AOP 会通过这个参数传递返回值.**
* **原始的切点表达式需要出现在 pointcut 属性中**

```java
/**
     * 在方法正常返回后的执行代码
     * @param joinPoint
     */
@AfterReturning(value = "execution(* com.hbd.wowosong.aopimpl.ArithmeticCaculatorImpl.*(int,int))",returning = "result")
public void  AfterReturning(JoinPoint joinPoint,Object result){
    String name = joinPoint.getSignature().getName();
    Object[] args = joinPoint.getArgs();
    System.out.println("The method "+name+" end  with "+result);
}
```

#### 异常通知

* 只在连接点抛出异常时才执行异常通知
* 将 throwing 属性添加到 @AfterThrowing 注解中, 也可以访问连接点抛出的异常. Throwable 是所有错误和异常类的超类. 所以在异常通知方法可以捕获到任何错误和异常.
* 如果只对某种特殊的异常类型感兴趣, 可以将参数声明为其他异常的参数类型. 然后通知就只在抛出这个类型及其子类的异常时才被执行.

```java
/**
 * 在方法异常后的执行代码
 *
 * @param joinPoint
 */
@AfterThrowing(value = "execution(* com.hbd.wowosong.aopimpl.ArithmeticCaculatorImpl.*(int,int))", throwing = "ex")
public void AfterThrowing(JoinPoint joinPoint, Exception ex) {
    String name = joinPoint.getSignature().getName();
    System.out.println("The method " + name + "  occur  with " + ex);
}
```

#### 环绕通知

* 环绕通知是所有通知类型中功能最为强大的, 能够全面地控制连接点. 甚至可以控制是否执行连接点.
* **对于环绕通知来说, 连接点的参数类型必须是 ProceedingJoinPoint . 它是 JoinPoint 的子接口, 允许控制何时执行, 是否执行连接点.**
* 在环绕通知中需要明确调用 ProceedingJoinPoint 的 proceed() 方法来执行被代理的方法. 如果忘记这样做就会导致通知被执行了, 但目标方法没有被执行.
* 注意: 环绕通知的方法需要返回目标方法执行之后的结果, 即调用 joinPoint.proceed(); 的返回值, 否则会出现空指针异常

```java
@Around(value = "execution(* com.hbd.wowosong.aopimpl.ArithmeticCaculatorImpl.*(..))")
public Object Around(ProceedingJoinPoint proceedingJoinPoint) {
    String name = proceedingJoinPoint.getSignature().getName();
    System.out.println("Around.....");
    Object result=null;
    try {
        // 前置通知
        System.out.println("The method around "+name+" args with :"+Arrays.asList(proceedingJoinPoint.getArgs()));
        //执行目标方法
        result = proceedingJoinPoint.proceed();
        System.out.println("The method around "+name+" ends with :"+result);
    } catch (Throwable e) {
        // 异常通知
        System.out.println("The method   around " + name + "  occur  with " + e);
        e.printStackTrace();
    }
    // 后置通知
    System.out.println("The method   around " + name + "  ends");

    return result;
}
```

#### 指定切面的优先级

* 在同一个连接点上应用不止一个切面时, 除非明确指定, 否则它们的优先级是不确定的.
* **切面的优先级可以通过实现 Ordered 接口或利用 @Order 注解指定.**
* **实现 Ordered 接口, getOrder() 方法的返回值越小, 优先级越高.**
* 若使用 @Order 注解, 序号出现在注解中

```JAVA
package com.hbd.wowosong.aopimpl;

import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.util.Arrays;
@Aspect
@Component
@Order(1)
public class ValidationAspect {
    @Before("execution(* com.hbd.wowosong.aopimpl.ArithmeticCaculatorImpl.*(int,int))")
    public void BeforeMethod(JoinPoint joinPoint) {
        String name = joinPoint.getSignature().getName();
        Object[] args = joinPoint.getArgs();
        System.out.println("---->validate " + name + " begin with args " + Arrays.asList(args) + " ");
    }
}

```

#### 重用切入点定义

* 在编写 AspectJ 切面时, 可以直接在通知注解中书写切入点表达式. 但同一个切点表达式可能会在多个通知中重复出现.
* 在 AspectJ 切面中, 可以**通过 @Pointcut 注解将一个切入点声明成简单的方法**. 切入点的方法体通常是空的, 因为将切入点定义与应用程序逻辑混在一起是不合理的. 
* 切入点方法的访问控制符同时也控制着这个切入点的可见性. 如果切入点要在多个切面中共用, 最好将它们集中在一个公共的类中. 在这种情况下, 它们必须被声明为 public. 在引入这个切入点时, 必须将类名也包括在内. 如果类没有与这个切面放在同一个包中, 还必须包含包名.
* **其他通知可以通过方法名称引入该切入点.**

```java
@Pointcut("execution(* com.hbd.wowosong.aopimpl.ArithmeticCaculatorImpl.*(..))")
public void declareJointPoint(){

}
@Before("declareJointPoint()")
public void BeforeMethod(JoinPoint joinPoint) {
    String name = joinPoint.getSignature().getName();
    Object[] args = joinPoint.getArgs();
    System.out.println("The method " + name + " begin with args " + Arrays.asList(args) + " ");
}
```

#### 用基于 XML 的配置声明切面

* 除了使用 AspectJ 注解声明切面, Spring 也支持在 Bean 配置文件中声明切面. 这种声明是通过 aop schema 中的 XML 元素完成的.

*  正常情况下, 基于注解的声明要优先于基于 XML 的声明. 通过 AspectJ 注解, 切面可以与 AspectJ 兼容, 而基于 XML 的配置则是 Spring 专有的. 由于 AspectJ 得到越来越多的 AOP 框架支持, 所以以注解风格编写的切面将会有更多重用的机会.

  ```xml
  <bean id="arithmeticCaculator" class="com.hbd.wowosong.aopxml.ArithmeticCaculatorImpl">
  </bean>
  <bean id="loggingAspect"  class="com.hbd.wowosong.aopxml.LoggingAspect"></bean>
  <bean id="validationAspect" class="com.hbd.wowosong.aopxml.ValidationAspect"></bean>
  <!--    配置AOP-->
  <aop:config>
      <aop:pointcut id="pointcut" expression="execution(*  com.hbd.wowosong.aopxml.ArithmeticCaculatorImpl.*(int ,int))"/>
      <aop:aspect ref="loggingAspect" order="2">
          <aop:before method="BeforeMethod" pointcut-ref="pointcut"></aop:before>
          <aop:after method="AfterMethod" pointcut-ref="pointcut"></aop:after>
          <aop:after-returning method="AfterReturning" returning="result" pointcut-ref="pointcut"></aop:after-returning>
          <aop:after-throwing method="AfterThrowing" pointcut-ref="pointcut" throwing="ex"></aop:after-throwing>
      </aop:aspect>
      <aop:aspect ref="validationAspect" order="1">
          <aop:before method="BeforeMethod" pointcut-ref="pointcut"></aop:before>
      </aop:aspect>
  </aop:config>
  ```


##### 基于 XML ---- 声明切面

* 当使用 XML 声明切面时, 需要在 \<beans> 根元素中导入 aop Schema
* 在 Bean 配置文件中, 所有的 Spring AOP 配置都必须定义在 <aop:config> 元素内部. 对于每个切面而言, 都要创建一个 <aop:aspect> 元素来为具体的切面实现引用后端 Bean 实例. 
*  切面 Bean 必须有一个标示符, 供 <aop:aspect> 元素引用

##### 基于 XML ---- 声明切入点

* 切入点使用 <aop:pointcut> 元素声明
* 切入点必须定义在 <aop:aspect> 元素下, 或者直接定义在 <aop:config> 元素下.
  * 定义在 <aop:aspect> 元素下: 只对当前切面有效
  * 定义在 <aop:config> 元素下: 对所有切面都有效
* 基于 XML 的 AOP 配置不允许在切入点表达式中用名称引用其他切入点.

##### 基于 XML ---- 声明通知

* 在 aop Schema 中, 每种通知类型都对应一个特定的 XML 元素. 
* 通知元素需要使用 \<pointcut-ref> 来引用切入点, 或用 \<pointcut> 直接嵌入切入点表达式.  method 属性指定切面类中通知方法的名称.

##### 声明引入

可以利用 <aop:declare-parents> 元素在切面内部声明引入

## Spring对 JDBC 的支持

### JdbcTemplate 简介

* 为了使 JDBC 更加易于使用, Spring 在 JDBC API 上定义了一个抽象层, 以此建立一个 JDBC 存取框架。
* 作为 Spring JDBC 框架的核心, JDBC 模板的设计目的是为不同类型的 JDBC 操作提供模板方法。每个模板方法都能控制整个过程, 并允许覆盖过程中的特定任务。 **通过这种方式, 可以在尽可能保留灵活性的情况下, 将数据库存取的工作量降到最低。**

### 使用 JdbcTemplate 更新数据库

```java
//用SQL语句和参数更新数据库：
//update 
public int update(String sql,Object... args) throws DataAccessException
//批量更新数据库
//batchUpdate
public int[] batchUpdate(String sql,List<Object[]> batchArgs)
```

### 使用 JdbcTemplate 查询数据库

```java
//* 查询单行：
public <T> t queryForObject(String sql,ParameterizedRowMapper<T> rm,Object... args) throw DataAccessException
//* 便利的BeanPropertyRowMapper实现
org.springframework.jdbc.core.sample.ParameterizedRowMapper<T>
//* 查询多行：
public <T> List<T> query(String sql,ParameterizedRowMapper<T> rm,Object... args) throw DataAccessException
//* 单值查询：
public <T> T queryForObject(String sql,Class<T> requireType,Object... args) throws DataAccesException
```

```java
/**
* 从数据库中获取一条记录，实际得到对应的一个对象
* 注意不是调用queryForObject(String sql,Class<Emplpoyee> requireType,Object... args)方法
* 而需要调用queryForObject(String sql,RowMapper<Employee> rowMapper,Object... args)
* 1. 其中的RowMapper指定如何去映射结果集的行，常规的实现类为BeanPropertyRowMapper
* 2. 使用SQL中列的别名完成列名和类的属性值的映射，例如last_name lastName
**/
```

### 简化 JDBC 模板查询

* 每次使用都创建一个 JdbcTemplate 的新实例, 这种做法效率很低下.

* **JdbcTemplate 类被设计成为线程安全的, 所以可以再 IOC 容器中声明它的单个实例, 并将这个实例注入到所有的 DAO 实例中.**

* JdbcTemplate 也利用了 Java 1.5 的特定(自动装箱, 泛型, 可变长度等)来简化开发

* Spring JDBC 框架还提供了一个 JdbcDaoSupport 类来简化 DAO 实现. 该类声明了 jdbcTemplate 属性, 它可以从 IOC 容器中注入, 或者自动从数据源中创建.

```java
public class Main {

  private ApplicationContext ctx = null;
  private JdbcTemplate jdbcTemplate = null;

  {
      ctx = new ClassPathXmlApplicationContext("beans-jdbctemplate.xml");
      jdbcTemplate = ((JdbcTemplate) ctx.getBean("jdbcTemplate"));
  }

  @Test
  public void test() {
      DataSource bean = ctx.getBean(DataSource.class);
      System.out.println(bean);
  }

  @Test
  public void test_insert() {
      int update = jdbcTemplate.update("update student set learnNo=1234 where id =?", 1);
      System.out.println(update);
  }
  @Test
  public void test_queryForObject() {
      String sql="select id,name,age,position,hire_time hireTime from employees  where id =?";
      Employee employee = jdbcTemplate.queryForObject(sql, new BeanPropertyRowMapper<Employee>(Employee.class),4);

      System.out.println(employee);
  }
  @Test
  public void test_queryForList() {
      String sql="select id,name,age,position,hire_time hireTime from employees  where id >?";
      List<Employee> query = jdbcTemplate.query(sql, new BeanPropertyRowMapper<Employee>(Employee.class), 100004);
      System.out.println(query);
  }
  @Test
  public void test_querycount() {
      String sql="select count(id)from employees  where id >?";
      Long count= jdbcTemplate.queryForObject(sql, Long.class,12000);
      System.out.println(count);
  }
  @Test
  public void test_BatchInsert() {
      String sql ="insert into student(id,learnNo,birthday,sex,name)  values(?,?,?,?,?) ";
      List<Object[]> list=new ArrayList<>();
      list.add(new Object[]{5,51000,"2010-12-15","男","test05"});
      list.add(new Object[]{6,61000,"2010-12-16","女","test06"});
      list.add(new Object[]{7,71000,"2010-12-17","男","test07"});
      int[] ints = jdbcTemplate.batchUpdate(sql, list);
      System.out.println(ints);
  }
}
```

### 注入 JDBC 模板示例代码

```xml
<context:property-placeholder location="db.properties"></context:property-placeholder>
<bean id="dataSource" class="com.mchange.v2.c3p0.ComboPooledDataSource">
    <property name="user" value="${user}"></property>
    <property name="password" value="${password}"></property>
    <property name="driverClass" value="${driveClass}"></property>
    <property name="jdbcUrl" value="${jdbcUrl}"></property>
    <property name="initialPoolSize" value="${initialPoolSize}"></property>
    <property name="maxPoolSize" value="${maxPoolSize}"></property>
</bean>
<bean id="jdbcTemplate" class="org.springframework.jdbc.core.JdbcTemplate">
    <property name="dataSource" ref="dataSource"></property>
</bean>
```

### 在 JDBC 模板中使用具名参数

* 在经典的 JDBC 用法中, SQL 参数是用占位符 ? 表示，并且受到位置的限制。 定位参数的问题在于, 一旦参数的顺序发生变化，就必须改变参数绑定. 

* 在 Spring JDBC 框架中, 绑定 SQL 参数的另一种选择是使用具名参数(named parameter). 

* 具名参数: SQL 按名称(以冒号开头)而不是按位置进行指定. 具名参数更易于维护, 也提升了可读性. 具名参数由框架类在运行时用占位符取代

* **具名参数只在 NamedParameterJdbcTemplate 中得到支持**

```xml
<bean id="parameterJdbcTemplate" class="org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate">
  <constructor-arg ref="dataSource"></constructor-arg>
</bean>
```

```java
@Test
public void test_nameparmeter() {
  String sql="insert into student(id,learnNo,birthday,sex,name)  values(:id,:learnNo,:birthday,:sex,:name) ";
  Map<String,Object> map=new HashMap<>();
  map.put("id",111);
  map.put("learnNo",789);
  map.put("birthday","2017-10-20");
  map.put("sex","女");
  map.put("name","test1234");
  int update = namedParameterJdbcTemplate.update(sql, map);
  System.out.println(update);
}
```

  * 在SQL语句中使用具名参数时，可以在一个Map中提供参数值，参数名为键；

  * 也可以使用SqlParameterSource参数
  
  * 批量更新时可以提供Map或SqlParameterSource的数组

```java
public int update(String sql,Map args) throws DataAccessException 

public int update(String sql,SqlParamterSource args) throws DataAccessException 

public int[] batchUpdate(String sql,Map[] batchValue) 

public int[] update(String sql,SqlParamterSource args) 
```

```java
/**
* 使用具名参数时，可以使用update(String sql,SqlParameterSource paramSource)方法进行更新操作
* 1.SQL语句中的参数名和类的属性一致
* 2.使用SqlParameterSource的BeanPropertySqlParameterSource 实现类作为参数
*/
@Test
public void test_nameparmeter() {
  String sql="insert into student(id,learnNo,birthday,sex,name)  values(:id,:learnNo,:birthday,:sex,:name) ";
  Map<String,Object> map=new HashMap<>();
  map.put("id",1111);
  map.put("learnNo",789);
  map.put("birthday","2017-10-20");
  map.put("sex","女");
  map.put("name","test1234");
  int update = namedParameterJdbcTemplate.update(sql, map);
  System.out.println(update);
}
```

## Spring  中的事务管理

### 事务简介

* 事务管理是企业级应用程序开发中必不可少的技术,  **用来确保数据的完整性和一致性.** 

* 事务就是一系列的动作, 它们被当做一个单独的工作单元. 这些动作要么全部完成, 要么全部不起作用

* **事务的四个关键属性(ACID)**
  * 原子性(atomicity): 事务是一个原子操作, 由一系列动作组成. 事务的原子性确保动作要么全部完成要么完全不起作用.
  * 一致性(consistency): 一旦所有事务动作完成，事务就被提交. 数据和资源就处于一种满足业务规则的一致性状态中.
  * 隔离性(isolation): 可能有许多事务会同时处理相同的数据, 因此每个事物都应该与其他事务隔离开来, 防止数据损坏.
  * 持久性(durability): 一旦事务完成, 无论发生什么系统错误, 它的结果都不应该受到影响. 通常情况下, 事务的结果被写到持久化存储器中.

### 事务管理的问题

问题: 

* 必须为不同的方法重写类似的样板代码
* 这段代码是特定于 JDBC 的, 一旦选择类其它数据库存取技术, 代码需要作出相应的修改

```java
// 使用Statement实现对数据表的查询操作
public <T> T get(String sql, Class<T> clazz) {
    T t = null;
    Connection conn = null;
    Statement st = null;
    ResultSet rs = null;
    try {
        // 1.加载配置文件
        InputStream is = getClass().getClassLoader().getResourceAsStream("jdbc.properties");
        Properties pros = new Properties();
        pros.load(is);

        // 2.读取配置信息
        String user = pros.getProperty("user");
        String password = pros.getProperty("password");
        String url = pros.getProperty("url");
        String driverClass = pros.getProperty("driverClass");

        // 3.加载驱动
        Class.forName(driverClass);

        // 4.获取连接
        conn = DriverManager.getConnection(url, user, password);

        st = conn.createStatement();

        rs = st.executeQuery(sql);

        // 获取结果集的元数据
        ResultSetMetaData rsmd = rs.getMetaData();

        // 获取结果集的列数
        int columnCount = rsmd.getColumnCount();

        if (rs.next()) {

            t = clazz.newInstance();

            for (int i = 0; i < columnCount; i++) {
                // 1. 获取列的名称
                // String columnName = rsmd.getColumnName(i+1);
                // 1. 获取列的别名
                String columnName = rsmd.getColumnLabel(i + 1);
                System.out.println(columnName);

                // 2. 根据列名获取对应数据表中的数据
                Object columnVal = rs.getObject(columnName);

                // 3. 将数据表中得到的数据，封装进对象
                Field field = clazz.getDeclaredField(columnName);
                field.setAccessible(true);
                field.set(t, columnVal);
            }
            return t;
        }
    } catch (Exception e) {
        e.printStackTrace();
    } finally {
        // 关闭资源
        if (rs != null) {
            try {
                rs.close();
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }
        if (st != null) {
            try {
                st.close();
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }

        if (conn != null) {
            try {
                conn.close();
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }
    }

    return null;
}
```

### Spring 中的事务管理

* 作为企业级应用程序框架，Spring 在不同的事务管理 API 之上定义了一个抽象层. 而应用程序开发人员不必了解底层的事务管理 API，就可以使用 Spring 的事务管理机制.
* **Spring 既支持编程式事务管理, 也支持声明式的事务管理**. 
* 编程式事务管理: 将事务管理代码嵌入到业务方法中来控制事务的提交和回滚. **在编程式管理事务时, 必须在每个事务操作中包含额外的事务管理代码.** 
* 声明式事务管理: 大多数情况下比编程式事务管理更好用. 它将事务管理代码从业务方法中分离出来, 以声明的方式来实现事务管理. **事务管理作为一种横切关注点, 可以通过 AOP 方法模块化. Spring 通过 Spring AOP 框架支持声明式事务管理.**

### Spring 中的事务管理器

* Spring 从不同的事务管理 API 中抽象了一整套的事务机制. 开发人员不必了解底层的事务API, 就可以利用这些事务机制. 有了这些事务机制, 事务管理代码就能独立于特定的事务技术了.
* Spring 的核心事务管理抽象是Interface **PlatformTransactionManager** 它为事务管理封装了一组独立于技术的方法. 无论使用 Spring 的哪种事务管理策略(编程式或声明式), **事务管理器都是必须的**.

### Spring 中的事务管理器的不同实现

* org.springframework.jdbc.datasource Class DataSourceTransactionManager:**在应用程序中只需要处理一个数据源, 而且通过 JDBC 存取**
* org.springframework.transaction.jtd Class JtaTransactionManager: 在 JavaEE 应用服务器上用 JTA(Java Transaction API) 进行事务管理
* org.springframework.orm.hibernate3 Class HibernateTransactionManage ：**用 Hibernate 框架存取数据库**
  ……
* 事务管理器以普通的 Bean 形式声明在 Spring IOC 容器中

### 需求

![image-20211220204212636](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311061723178.png)

### 用事务通知声明式地管理事务

* **事务管理是一种横切关注点**
* 为了在 Spring 2.x 中启用声明式事务管理, 可以通过 tx Schema 中定义的 <tx:advice> 元素声明事务通知, 为此必须事先将这个 Schema 定义添加到 \<beans> 根元素中去.
* 声明了事务通知后, 就需要将它与切入点关联起来. 由于事务通知是在 <aop:config> 元素外部声明的, 所以它无法直接与切入点产生关联. 所以必须在 <aop:config> 元素中声明一个增强器通知与切入点关联起来.
* **由于 Spring AOP 是基于代理的方法, 所以只能增强公共方法. 因此, 只有公有方法才能通过 Spring AOP 进行事务管理.**

### 用事务通知声明式地管理事务示例代码

![image-20211221124555153](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311061723199.png)

### 用 @Transactional 注解声明式地管理事务

* 除了在带有切入点，通知和增强器的 Bean 配置文件中声明事务外，Spring 还允许简单地用 @Transactional 注解来标注事务方法. 

* 为了将方法定义为支持事务处理的, 可以为方法添加 @Transactional 注解. **根据 Spring AOP 基于代理机制，只能标注公有方法.**

* **可以在方法或者类级别上添加 @Transactional 注解. 当把这个注解应用到类上时, 这个类中的所有公共方法都会被定义成支持事务处理的.** 

* 在 Bean 配置文件中只需要启用 <tx:annotation-driven> 元素, 并为之指定事务管理器就可以了. 

* 如果事务处理器的名称是 transactionManager, 就可以在<tx:annotation-driven> 元素中省略 transaction-manager 属性. 这个元素会自动检测该名称的事务处理器.

### 用 @Transactional 注解声明式地管理事务配置文件示例代码

```xml
<!-- 配置事务管理器-->
<bean id="transactionManager" class="org.springframework.jdbc.datasource.DataSourceTransactionManager">
    <property name="dataSource" ref="dataSource2"></property>
</bean>
<tx:annotation-driven transaction-manager="transactionManager"></tx:annotation-driven>
```

```java
//使用propagation指定事务的传播行为，即当前事务方法被另一个事务方法调用
//默认为require
@Transactional(propagation = Propagation.REQUIRED)
@Override
public void purcharse(String username, String isbn) {
    //获取书的单价
    int bookPriceByIsBn = bookShopDao.findBookPriceByIsBn(isbn);
    //更新书的库存
    bookShopDao.updateBookStock(isbn);
    //更新用户余额
    bookShopDao.updateUserAccount(username,bookPriceByIsBn);
}
```

### 事务传播属性

* **当事务方法被另一个事务方法调用时, 必须指定事务应该如何传播. 例如: 方法可能继续在现有事务中运行, 也可能开启一个新事务, 并在自己的事务中运行.**
* 事务的传播行为可以由传播属性指定. Spring 定义了 7  种类传播行为.

### Spring 支持的事务传播行为

| 传播属性     | 描述                                                         |
| ------------ | ------------------------------------------------------------ |
| REQUIRED     | 如果有事务在运行，当前的方法就在这个事务内运行，否则就启动一个新的事务，并在自己的事务内运行 |
| REQUIRED_NEW | 当前的方法必须启动新事务，并在它自己的的事务内运行，如果有事务正在运行，应该将它挂起 |
| SUPPORTS     | 如果有事务在运行，当前的方法就在这个事务内运行，否则它可以不运行在事务中 |
| NOT_SUPPORTS | 当前的方法不应该运行在事务中，如果有运行的事务，将它挂起     |
| MANDATORY    | 当前的方法必须运行在事务内部，如果没有正在运行的事务，就抛出异常 |
| NEVER        | 当前的方法不应该运行在事务中，如果有运行的事务，就抛出异常   |
| NESTED       | 如果有事务在运行，当前的方法就应该在这个事务的嵌套事务内运行，否则就启动一个新的事务，并在它自己的事务内运行 |

#### REQUIRED 传播行为

* 当 bookService 的 purchase() 方法被另一个事务方法 checkout() 调用时, 它默认会在现有的事务内运行. 这个默认的传播行为就是 REQUIRED. 因此在 checkout() 方法的开始和终止边界内只有一个事务. **这个事务只在 checkout() 方法结束的时候被提交, 结果用户一本书都买不了**
* 事务传播属性可以在 @Transactional 注解的 propagation 属性中定义

![image-20211221132204515](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311061723397.png)

#### REQUIRES_NEW 传播行为

* 另一种常见的传播行为是 REQUIRES_NEW. 它表示该方法必须启动一个新事务, 并在自己的事务内运行. 如果有事务在运行, 就应该先挂起它.

```java
//REQUIRES_NEW:事务自己的事务，调用的事务方法的事务被挂起
@Transactional(propagation = Propagation.REQUIRES_NEW)
@Override
public void purcharse(String username, String isbn) {
```

### 在 Spring 2.x 事务通知中配置传播属性

在 Spring 2.x 事务通知中, 可以像下面这样在 <tx:method> 元素中设定传播事务属性

```xml
<tx:advice id="bookShopTxAdvice" transaction-manage="transactionManager">
    <tx:attributes>
        <tx:method name="purchase" propagation="REQUIRES_NEW"></tx:method>
    </tx:attributes>
</tx:advice>
```

### 并发事务所导致的问题

* 当同一个应用程序或者不同应用程序中的多个事务在同一个数据集上并发执行时, 可能会出现许多意外的问题
* 并发事务所导致的问题可以分为下面三种类型:
  * **脏读**: 对于两个事物 T1, T2, T1  读取了已经被 T2 更新但 还没有被提交的字段. 之后, 若 T2 回滚, T1读取的内容就是临时且无效的.
  * **不可重复读**:对于两个事物 T1, T2, T1  读取了一个字段, 然后 T2 更新了该字段. 之后, T1再次读取同一个字段, 值就不同了.
  * **幻读**:对于两个事物 T1, T2, T1  从一个表中读取了一个字段, 然后 T2 在该表中插入了一些新的行. 之后, 如果 T1 再次读取同一个表, 就会多出几行.

#### 事务的隔离级别

* 从理论上来说, 事务应该彼此完全隔离, 以避免并发事务所导致的问题. 然而, 那样会对性能产生极大的影响, 因为事务必须按顺序运行. 
* 在实际开发中, 为了提升性能, 事务会以较低的隔离级别运行.
* 事务的隔离级别可以通过隔离事务属性指定

#### Spring 支持的事务隔离级别

| 隔离级别         | 描述                                                         |
| ---------------- | ------------------------------------------------------------ |
| DEFAULT          | 使用底层数据库的默认隔离级别，对于大多数数据库来说，默认隔离级别都是READ_COMMITED |
| READ_UNCOMMITTED | 允许事务读取未被其他事务提交的变更，脏读、不可重复读和幻读都会出现 |
| READ_COMMITED    | 只允许事务读取已经被其他事务提交的变更，可以避免脏读。**但不可重复读和幻读问题仍然可能出现** |
| REPEATABLE__READ | 确保事务可以多次从一个字段中读取相同的值。在这个事务持续期间，禁止其他事务对这个字段进行更新。可以避免脏读和不可重复读。但**幻读问题仍然存在**。 |
| SERIALIZABLE     | 确保事务可以从一个表中读取相同的行。在这个事务持续期间，禁止其他事务对该表执行插入，更新和删除操作。所有并发都可以避免。但性能十分底下。 |

* 事务的隔离级别要得到底层数据库引擎的支持，而不是应用程序或者框架的支持.
* Oracle 支持的 2 种事务隔离级别：READ_COMMITED , SERIALIZABLE
* Mysql 支持 4 种事务隔离级别.

#### 设置隔离事务属性

用 @Transactional 注解声明式地管理事务时可以在 @Transactional 的 isolation 属性中设置隔离级别

```java
//使用isolation来设置事务的隔离级别，常用的是read_commited
@Transactional(propagation = Propagation.REQUIRES_NEW,isolation = Isolation.READ_COMMITTED)
```

在 Spring 2.x 事务通知中, 可以在 <tx:method> 元素中指定隔离级别

```xml
<tx:advice id="txAdvice" transaction-manager="transactionManager">
    <tx:attributes>
        <tx:method name="*"/>
        <!--根据方法名，指定事务属性-->
        <tx:method name="purcharse" propagation="REQUIRES_NEW" rollback-for="" isolation="READ_COMMITTED" no-rollback-for=""></tx:method>
        <tx:method name="find*" read-only="true" timeout="30"></tx:method>
    </tx:attributes>
</tx:advice>
```

#### 设置回滚事务属性

* 默认情况下只有未检查异常(RuntimeException和Error类型的异常)会导致事务回滚. 而受检查异常不会.
* 事务的回滚规则可以通过 @Transactional 注解的 rollbackFor 和 noRollbackFor 属性来定义. 这两个属性被声明为 Class[] 类型的, 因此可以为这两个属性指定多个异常类.
  * rollbackFor:  遇到时必须进行回滚

```java
//1.使用propagation指定事务的传播行为，即当前事务方法被另个事务方法调用
//默认为require
//REQUIRES_NEW:事务自己的事务，调用的事务方法的事务被挂起
//2.使用isolation来设置事务的隔离级别，常用的是read_commited
//3.默认情况下spring对所有异常情况都进行回滚，也可以通过对应的属性进行设置
//@Transactional(propagation = Propagation.REQUIRES_NEW,isolation = Isolation.READ_COMMITTED,
//noRollbackFor = UserAccountException.class)
//4.使用readonly 指定事务为只读，表示这个事务只读数据不更新数据，可以数据库引擎进行优化事务;若真的是一个只读数据的方法，应设置readonly=true
//5.timeout可以指定事务强制回滚前，事务可以占用的时间
@Transactional(propagation = Propagation.REQUIRES_NEW,isolation = Isolation.READ_COMMITTED,readOnly = false,timeout = 3)
@Override
public void purcharse(String username, String isbn) {
    try {
        Thread.sleep(5000);
    } catch (InterruptedException e) {
        e.printStackTrace();
    }
    //获取书的单价
    int bookPriceByIsBn = bookShopDao.findBookPriceByIsBn(isbn);
    //更新书的库存
    bookShopDao.updateBookStock(isbn);
    //更新用户余额
    bookShopDao.updateUserAccount(username, bookPriceByIsBn);
}
```

* 在 Spring 2.x 事务通知中, 可以在 <tx:method> 元素中指定回滚规则. 如果有不止一种异常, 用逗号分隔.

```xml
<!--   2.配置事务属性-->
<tx:advice id="txAdvice" transaction-manager="transactionManager">
    <tx:attributes>
        <tx:method name="*"/>
        <!--根据方法名，指定事务属性-->
        <tx:method name="purcharse" propagation="REQUIRES_NEW" rollback-for="" isolation="READ_COMMITTED" no-rollback-for=""></tx:method>
        <tx:method name="find*" read-only="true"></tx:method>
    </tx:attributes>
</tx:advice>
```

#### 超时和只读属性

* 由于事务可以在行和表上获得锁,  因此长事务会占用资源, 并对整体性能产生影响. 
* 如果一个事物只读取数据但不做修改, 数据库引擎可以对这个事务进行优化.
* 超时事务属性: 事务在强制回滚之前可以保持多久. 这样可以防止长期运行的事务占用资源.
* 只读事务属性: 表示这个事务只读取数据但不更新数据, 这样可以帮助数据库引擎优化事务.

#### 设置超时和只读事务属性

* 超时和只读属性可以在 @Transactional 注解中定义.超时属性以秒为单位来计算.

```java
//1.使用propagation指定事务的传播行为，即当前事务方法被另个事务方法调用
//默认为require
//REQUIRES_NEW:事务自己的事务，调用的事务方法的事务被挂起
//2.使用isolation来设置事务的隔离级别，常用的是read_commited
//3.默认情况下spring对所有异常情况都进行回滚，也可以通过对应的属性进行设置
//@Transactional(propagation = Propagation.REQUIRES_NEW,isolation = Isolation.READ_COMMITTED,
//noRollbackFor = UserAccountException.class)
//4.使用readonly 指定事务为只读，表示这个事务只读数据不更新数据，可以数据库引擎进行优化事务;若真的是一个只读数据的方法，应设置readonly=true
//5.timeout可以指定事务强制回滚前，事务可以占用的时间
@Transactional(propagation = Propagation.REQUIRES_NEW,isolation = Isolation.READ_COMMITTED,readOnly = false,timeout = 3)
```

* 在 Spring 2.x 事务通知中, 超时和只读属性可以在 <tx:method> 元素中进行指定.

```xml
<!--   2.配置事务属性-->
<tx:advice id="txAdvice" transaction-manager="transactionManager">
    <tx:attributes>
        <tx:method name="*"/>
        <!-- 根据方法名，指定事务属性-->
        <tx:method name="purcharse" propagation="REQUIRES_NEW" rollback-for="" isolation="READ_COMMITTED" no-rollback-for=""></tx:method>
        <tx:method name="find*" read-only="true" timeout="30"></tx:method>
    </tx:attributes>
</tx:advice>
```

### Spring_使用XML文件的方式配置事务

```xml
<bean id="bookShopService" class="com.hbd.wowosong.xml.tx.service.impl.BookShopServiceImpl">
    <property name="bookShopDao" ref="bookShopDao"></property>
</bean>
<bean id="cashier" class="com.hbd.wowosong.xml.tx.service.impl.CashierImpl">
    <property name="bookShopService" ref="bookShopService"></property>
</bean>
<!--   1. 配置事务管理器-->
<bean id="transactionManager" class="org.springframework.jdbc.datasource.DataSourceTransactionManager">
    <property name="dataSource" ref="dataSource2"></property>
</bean>
<!--   2.配置事务属性-->
<tx:advice id="txAdvice" transaction-manager="transactionManager">
    <tx:attributes>
        <tx:method name="*"/>
        <!--根据方法名，指定事务属性-->
        <tx:method name="purcharse" propagation="REQUIRES_NEW"></tx:method>
        <tx:method name="find*" read-only="true"></tx:method>
    </tx:attributes>
</tx:advice>
<!--    3.配置事务切入点，以及把切入点和事务关联-->
<aop:config>
    <aop:pointcut id="txPoint" expression="execution(* com.hbd.wowosong.xml.tx.service.*.*(..))"/>
    <aop:advisor pointcut-ref="txPoint" advice-ref="txAdvice"></aop:advisor>
</aop:config>
```

## Spring  整合 Hibernate

* **Spring 支持大多数流行的 ORM 框架, 包括 Hibernate JDO, TopLink, Ibatis 和 JPA。**
* Spring 对这些 ORM 框架的支持是一致的，因此可以把和 Hibernate 整合技术应用到其他 ORM 框架上.
* **Spring 2.0 同时支持 Hibernate 2.x 和 3.x. 但 Spring 2.5 只支持 Hibernate 3.1 或更高版本**

### 在 Spring 中配置 SessionFactory

* 对于 Hibernate 而言, 必须从原生的 Hibernate API 中构建 SessionFactory. 此外, 应用程序也无法利用 Spring 提供的数据存储机制(例如: Spring 的事务管理机制)
* Spring 提供了对应的工厂 Bean, 可以用单实例的形式在 IOC 容器中创建 SessionFactory 实例.

![image-20211221144453970](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311061723260.png)

* 可以利用 LocalSessionFactoryBean 工厂 Bean, 声明一个使用 XML 映射文件的 SessionFactory 实例.
* 需要为该工厂 Bean 指定 configLocation 属性来加载 Hibernate 配置文件.

![image-20211221144518752](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311061723469.png)

* 如果在 Spring IOC 容器中配置数据源. 可以将该数据源注入到 LocalSessionFactoryBean 的 dataSource 属性中. 该属性可以指定的数据源会覆盖掉 Hibernate 配置文件里的数据库配置.

```xml
<!-- 配置自动扫描的包 -->
<context:component-scan base-package="com.hbd.wowosong.hibernate"></context:component-scan>

<!-- 配置数据源 -->
<!-- 导入资源文件 -->
<context:property-placeholder location="classpath:db.properties"/>

<bean id="dataSource3" class="com.mchange.v2.c3p0.ComboPooledDataSource">
    <property name="user" value="${jdbc.user}"></property>
    <property name="password" value="${jdbc.password}"></property>
    <property name="driverClass" value="${jdbc.driveClass}"></property>
    <property name="jdbcUrl" value="${jdbc.jdbcUrl}"></property>
    <property name="initialPoolSize" value="${jdbc.initialPoolSize}"></property>
    <property name="maxPoolSize" value="${jdbc.maxPoolSize}"></property>
</bean>
```

* 可以将所有配置合并到 LocalSessionFactoryBean 中,从而忽略 Hibernate 配置文件. 
* 可以在 LocalSessionFactoryBean 的 mappingResources 属性中指定 XML 映射文件的位置.该属性为 String[] 类型. 因此可以指定一组映射文件.
* 在 hibernateProperties 属性中指定数据库方言等.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:context="http://www.springframework.org/schema/context"
       xmlns:tx="http://www.springframework.org/schema/tx"
       xmlns:aop="http://www.springframework.org/schema/aop"
       xsi:schemaLocation="http://www.springframework.org/schema/aop http://www.springframework.org/schema/aop/spring-aop-4.0.xsd
                           http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd
                           http://www.springframework.org/schema/tx http://www.springframework.org/schema/tx/spring-tx-4.0.xsd
                           http://www.springframework.org/schema/context http://www.springframework.org/schema/context/spring-context-4.0.xsd">

    <!-- 配置 Hibernate 的 SessionFactory 实例: 通过 Spring 提供的 LocalSessionFactoryBean 进行配置 -->
    <bean id="sessionFactory" class="org.springframework.orm.hibernate5.LocalSessionFactoryBean">
        <!-- 配置数据源属性 -->
        <property name="dataSource" ref="dataSource3"></property>
        <!-- 配置 hibernate 配置文件的位置及名称 -->
        <property name="configLocation" value="classpath:hibernate.cfg.xml"></property>
        <!-- 使用 hibernateProperties 属相来配置 Hibernate 原生的属性 -->
        <property name="hibernateProperties">
            <props>
                <prop key="hibernate.dialect">org.hibernate.dialect.MySQL5InnoDBDialect</prop>
                <prop key="hibernate.show_sql">true</prop>
                <prop key="hibernate.format_sql">true</prop>
                <prop key="hibernate.hbm2ddl.auto">update</prop>
            </props>
        </property>
        <!-- 配置 hibernate 映射文件的位置及名称, 可以使用通配符 -->
        <!--value="classpath:com/hbd/wowosong/hibernate/entity/*.hbm.xml"-->
        <property name="mappingLocations">
            <list>
                <value>classpath:com/hbd/wowosong/hibernate/entity/Account1Entity.hbm.xml</value>
                <value>classpath:com/hbd/wowosong/hibernate/entity/Book1Entity.hbm.xml</value>
            </list>
        </property>
    </bean>

    <!-- 配置 Spring 的声明式事务 -->
    <!-- 1. 配置事务管理器 -->
    <bean id="transactionManager" class="org.springframework.orm.hibernate5.HibernateTransactionManager">
        <property name="sessionFactory" ref="sessionFactory"></property>
    </bean>

    <!-- 2. 配置事务属性, 需要事务管理器 -->
    <tx:advice id="txAdvice" transaction-manager="transactionManager">
        <tx:attributes>
            <tx:method name="get*" read-only="true"/>
            <tx:method name="purchase" propagation="REQUIRES_NEW"/>
            <tx:method name="*"/>
        </tx:attributes>
    </tx:advice>

    <!-- 3. 配置事务切点, 并把切点和事务属性关联起来 -->
    <aop:config>
        <aop:pointcut expression="execution(* com.hbd.wowosong.hibernate.service.*.*(..))"
                      id="txPointcut"/>
        <aop:advisor advice-ref="txAdvice" pointcut-ref="txPointcut"/>
    </aop:config>
</beans>

```

