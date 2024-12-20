
# 集成junit

[上一篇：Spring集成MyBatis](http://www.itsoku.com/course/5/135)

[下一篇：Spring上下文生命周期](http://www.itsoku.com/course/5/137)

通常我们写完代码之后，为了确保代码的正确性，都需要自己测试一遍，看一下代码的运行结果和我们期望的结果是不是一样的，也就是我们常说的单元测试，java中最常用的单元测试框架是junit，本文主要介绍3个内容：

1、玩转junit

2、spring集成junit

3、开发工具中使用junit

## 1、背景

我们写了一个工具类，有2个方法

```java
package com.javacode2018.junit.demo1;

public class MathUtils {
    /**
     * 获取最大的数字
     *
     * @param args
     * @return
     */
    public static int max(int... args) {
        int result = Integer.MIN_VALUE;
        for (int arg : args) {
            result = result > arg ? result : arg;
        }
        return result;
    }

    /**
     * 获取最小的数字
     *
     * @param args
     * @return
     */
    public static int min(int... args) {
        int result = Integer.MAX_VALUE;
        for (int arg : args) {
            result = result < arg ? result : arg;
        }
        return result;
    }

}
```

然后我们想测试这两个方法，下面我们来写测试代码，如下，测试一下max方法和min方法的结果和我们期望的结果是否一致，不一致的时候，输出一段文字

```java
package com.javacode2018.junit.demo1;

public class MathUtilsTest1 {
    public static void main(String[] args) {
        testMax();
        testMin();
    }

    public static void testMax() {
        int result = MathUtils.max(1, 2, 3);
        if (result != 3) {
            System.out.println(String.format("max 方法有问题，期望结果是3，实际结果是%d", result));
        }
    }

    public static void testMin() {
        int result = MathUtils.min(1, 2, 3);
        if (result != 1) {
            System.out.println(String.format("min 方法有问题，期望结果是3，实际结果是%d", result));
        }
    }
}
```

上面我们要测试的方法就2个，若需测试的方法很多的时候，咱们需要写大量的这种测试代码，工作量还是蛮大的，而junit做的事情和上面差不多，都是用来判断被测试的方法和期望的结果是否一致，不一致的时候给出提示，不过junit用起来更容易一些，还有各种开发用到的ide（eclipse、idea）结合的更好一些，用起来特别的顺手。

## 2、junit用法详解

### 2.1、使用步骤

1)、添加junit maven配置，这里我们就用4.13，你们也可以用最新的

```xml
<dependency>
    <groupId>junit</groupId>
    <artifactId>junit</artifactId>
    <version>4.13</version>
</dependency>
```

2)、写测试用例，在写好的测试方法上面添加@Test注解，比如我们需要对上面案例中的max方法进行测试，通常我们会新建一个测试类，类名为被测试的类加上Test后缀，即：MathUtilsTest，然后在这个类我们需要写max方法的测试方法，如下，需要我们在max方法上面加上@Test注解

```java
package com.javacode2018.junit.demo1;

import org.junit.Assert;
import org.junit.Test;

public class MathUtilsTest {
    @Test
    public void max() throws Exception {
        int result = MathUtils.max(1, 2, 3);
        //判断测试结果和我们期望的结果是否一致
        Assert.assertEquals(result, 3);
    }
}
```

3、运行测试用例，现在测试代码都写好了，下面我们写个类来启动测试用例，这里需要使用JUnitCore.runClasses方法来运行测试用例，如下：

```java
package com.javacode2018.junit.demo1;

import org.junit.runner.JUnitCore;
import org.junit.runner.Result;
import org.junit.runner.notification.Failure;

public class Demo1TestRunner {
    public static void main(String[] args) {
        //使用JUnitCore.runClasses方法传入测试用例的类，然后获取测试用例的运行结果
        Result result = JUnitCore.runClasses(MathUtilsTest.class);
        //获取失败的用例
        for (Failure failure : result.getFailures()) {
            System.out.println(failure);
        }
        //获取所有测试用例是否执行成功
        System.out.println(result.wasSuccessful());
    }
}
```

### 2.2、同时运行多个测试用例

可以一个测试类中写多个测试方法，每个方法上加上@Test注解就可以了，然后通过JUnitCore来执行就可以，下面代码中我们写2个方法对MathUtils中的max和min方法都进行测试，我们故意将执行结果和期望结果搞成不一致的，运行下面代码，然后看看运行结果。

```java
package com.javacode2018.junit.demo2;

import com.javacode2018.junit.demo1.MathUtils;
import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.JUnitCore;
import org.junit.runner.Result;
import org.junit.runner.manipulation.Ordering;
import org.junit.runner.notification.Failure;

public class MathUtilsTest2 {
    @Test
    public void max() throws Exception {
        int result = MathUtils.max(1, 2, 3);
        //判断测试结果和我们期望的结果是否一致
        Assert.assertEquals(result, 1);
    }

    @Test
    public void min() throws Exception {
        int result = MathUtils.min(1, 2, 3);
        //判断测试结果和我们期望的结果是否一致
        Assert.assertEquals(result, 3);
    }

    public static void main(String[] args) {
        Result result = JUnitCore.runClasses(MathUtilsTest2.class);

        System.out.println("失败用例个数:" + result.getFailures().size());
        for (Failure failure : result.getFailures()) {
            System.out.println(failure);
        }
        System.out.println("运行测试用例个数:" + result.getRunCount());
        System.out.println("运行测试用例总耗时(ms):" + result.getRunTime());
        System.out.println("测试用例是否都成功了：" + result.wasSuccessful());
    }
}
```

运行输出如下，运行了2个用例，失败了2个，测试的详细信息都被输出了

```java
失败用例个数:2
max(com.javacode2018.junit.demo2.MathUtilsTest2): expected:<3> but was:<1>
min(com.javacode2018.junit.demo2.MathUtilsTest2): expected:<1> but was:<3>
运行测试用例个数:2
运行测试用例总耗时(ms):11
测试用例是否都成功了：false
```

### 2.3、使用断言

什么是断言？

断言是用来判断程序的运行结果和我们期望的结果是不是一致的，如果不一致，会抛出异常，断言中有3个信息比较关键

1、被测试的数据

2、期望的数据

3、抛出异常

断言提供的方法将被测试的数据和期望的数据进行对比，如果不一样的时候，将抛出异常，程序可以捕获这个异常，这样就可以知道测试失败了。

junit中的**org.junit.Assert**类中提供了大量静态方法，用来判断被测试的数据和期望的数据是否一致，不一致，将抛出异常，这里随便列几个大家看一下吧

```java
//判断condition如果不是true，将抛出异常，异常的提示信息是message
public static void assertTrue(String message, boolean condition) 

//判断expected和actual是否相等，如果不相等，将抛出异常
public static void assertEquals(Object expected, Object actual)
```

用法，如：

```java
int result = MathUtils.max(1, 2, 3);
//判断测试结果和我们期望的结果是否一致
Assert.assertEquals(result, 1);
```

### 2.4、测试套件：批量运行测试用例

到目前为止，我们还只能一次运行一个测试类，如下

```plain
JUnitCore.runClasses(MathUtilsTest2.class)
```

但是在实际项目中，我们可能会有很多测试类，需要批量运行。

比如我们有下面2个测试类

MathUtilsTest3001.java

```java
package com.javacode2018.junit.demo3;

import com.javacode2018.junit.demo1.MathUtils;
import org.junit.Assert;
import org.junit.Test;

public class MathUtilsTest3001 {
    @Test
    public void max() throws Exception {
        int result = MathUtils.max(1, 2, 3);
        //判断测试结果和我们期望的结果是否一致
        Assert.assertEquals(result, 3);
    }

    @Test
    public void min() throws Exception {
        int result = MathUtils.min(1, 2, 3);
        //判断测试结果和我们期望的结果是否一致
        Assert.assertEquals(result, 1);
    }
}
```

MathUtilsTest3002.java

```java
package com.javacode2018.junit.demo3;

import com.javacode2018.junit.demo1.MathUtils;
import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.JUnitCore;
import org.junit.runner.Result;
import org.junit.runner.notification.Failure;

public class MathUtilsTest3002 {
    @Test
    public void max() throws Exception {
        int result = MathUtils.max(100, 99, 200);
        //判断测试结果和我们期望的结果是否一致
        Assert.assertEquals(result, 200);
    }

    @Test
    public void min() throws Exception {
        int result = MathUtils.min(1, -1, 10);
        //判断测试结果和我们期望的结果是否一致
        Assert.assertEquals(result, -1);
    }
}
```

现在我们希望同时运行上面2个测试类，我们可以这么做，创建一个AllTest.java类，注意这个类上有2个注解比较特殊，都是junit提供的，@RunWith表示这是一个测试套件类，需要批量运行测试类，具体要运行哪些测试类呢，通过@Suite.SuiteClasses来指定

```java
package com.javacode2018.junit.demo3;

import org.junit.runner.RunWith;
import org.junit.runners.Suite;

@RunWith(Suite.class)
@Suite.SuiteClasses({MathUtilsTest3001.class, MathUtilsTest3002.class})
public class AllTest {
}
```

下面来个启动类，将AllTest传递给JUnitCore.runClasses

```java
package com.javacode2018.junit.demo3;

import com.javacode2018.junit.demo1.MathUtilsTest;
import com.javacode2018.junit.demo2.MathUtilsTest2;
import org.junit.runner.JUnitCore;
import org.junit.runner.Result;
import org.junit.runner.notification.Failure;

public class Demo3TestRunner {
    public static void main(String[] args) {
        //@1：传入AllTest
        Result result = JUnitCore.runClasses(AllTest.class);

        System.out.println("失败用例个数:" + result.getFailures().size());
        for (Failure failure : result.getFailures()) {
            System.out.println(failure);
        }
        System.out.println("运行测试用例个数:" + result.getRunCount());
        System.out.println("运行测试用例总耗时(ms):" + result.getRunTime());
        System.out.println("测试用例是否都成功了：" + result.wasSuccessful());
    }
}
```

运行输出

```java
失败用例个数:0
运行测试用例个数:4
运行测试用例总耗时(ms):12
测试用例是否都成功了：true
```

测试套件中不仅可以包含基本的测试类，而且可以包含其它的测试套件，这样可以很方便的分层管理不同模块的单元测试代码，比如下面代码，Module2Test和Module2Test都是测试套件

```java
@RunWith(Suite.class)
@Suite.SuiteClasses({Test1.class, Test2.class})
public class Module2Test {
}

@RunWith(Suite.class)
@Suite.SuiteClasses({Test1.class, Test2.class})
public class Module2Test {
}

@RunWith(Suite.class)
@Suite.SuiteClasses({Module2Test.class, Module2Test.class, Test3.java})
public class AllTest {
}

//运行AllTest
JUnitCore.runClasses(AllTest.class);
```

### 2.5、Junit常用注解

#### 1）@Test注解

@Test：将一个普通方法修饰成一个测试方法

@Test(excepted=xx.class)：xx.class 表示异常类，表示测试的方法抛出此异常时，认为是正常的测试通过的

@Test(timeout = 毫秒数)：测试方法执行时间是否符合预期

#### 2）@BeforeClass

会在所有的方法执行前被执行，static 方法 （全局只会执行一次，而且是第一个运行）

#### 3）@AfterClass

会在所有的方法执行之后进行执行，static 方法 （全局只会执行一次，而且是最后一个运行）

#### 4）@Before

会在每一个测试方法被运行前执行一次

#### 5）@After

会在每一个测试方法运行后被执行一次

#### 6）@Ignore

所修饰的测试方法会被测试运行器忽略

#### 7）@RunWith

可以更改测试运行器 org.junit.runner.Runner

下面的案例，基本上用到了上面所有的注解，大家结合输出理解一下。

```java
package com.javacode2018.junit.demo4;

import com.javacode2018.junit.demo1.MathUtils;
import org.junit.*;
import org.junit.runner.JUnitCore;
import org.junit.runner.Result;
import org.junit.runner.notification.Failure;

import java.util.concurrent.TimeUnit;

public class MathUtilsTest4 {

    @BeforeClass
    public static void bc() {
        System.out.println("@BeforeClass");
        System.out.println("-----------------");
    }

    @AfterClass
    public static void ac() {
        System.out.println("@AfterClass");
    }

    @Before
    public void bf() {
        System.out.println("@Before:" + this);
    }

    @After
    public void af() {
        System.out.println("@After:" + this);
        System.out.println("##################");
    }

    @Test
    public void max() throws Throwable {
        System.out.println("max():" + this);
        int result = MathUtils.max(1, 2, 3);
        //判断测试结果和我们期望的结果是否一致
        Assert.assertEquals(result, 3);
    }

    @Test
    public void min() throws Exception {
        System.out.println("min():" + this);
        int result = MathUtils.min(1, 2, 3);
        //判断测试结果和我们期望的结果是否一致
        Assert.assertEquals(result, 1);
    }

    //方法运行时间超过了timeout，表示测试用例运行失败
    @Test(timeout = 1000)
    public void timeOutTest() throws InterruptedException {
        System.out.println("timeOutTest():" + this);
        TimeUnit.SECONDS.sleep(2000);
    }

    //方法若未抛出expected指定的异常，表示测试用例运行失败
    @Test(expected = NullPointerException.class)
    public void expectedTest() {
        System.out.println("expectedTest():" + this);
        new RuntimeException("异常不匹配");
    }

    @Test
    @Ignore
    public void ignoredMethod() {
        System.out.println("我是被忽略的方法");
    }

    public static void main(String[] args) {
        Result result = JUnitCore.runClasses(MathUtilsTest4.class);
        System.out.println("-----------------");
        System.out.println("运行测试用例个数:" + result.getRunCount());
        System.out.println("失败用例个数:" + result.getFailures().size());
        for (Failure failure : result.getFailures()) {
            System.out.println(failure);
        }
        System.out.println("运行测试用例总耗时(ms):" + result.getRunTime());
        System.out.println("测试用例是否都成功了：" + result.wasSuccessful());

    }
}
```

运行结果如下

```java
@BeforeClass
-----------------
@Before:com.javacode2018.junit.demo4.MathUtilsTest4@78e03bb5
timeOutTest():com.javacode2018.junit.demo4.MathUtilsTest4@78e03bb5
@After:com.javacode2018.junit.demo4.MathUtilsTest4@78e03bb5
##################
@Before:com.javacode2018.junit.demo4.MathUtilsTest4@48533e64
max():com.javacode2018.junit.demo4.MathUtilsTest4@48533e64
@After:com.javacode2018.junit.demo4.MathUtilsTest4@48533e64
##################
@Before:com.javacode2018.junit.demo4.MathUtilsTest4@7e0b37bc
min():com.javacode2018.junit.demo4.MathUtilsTest4@7e0b37bc
@After:com.javacode2018.junit.demo4.MathUtilsTest4@7e0b37bc
##################
@Before:com.javacode2018.junit.demo4.MathUtilsTest4@1a93a7ca
expectedTest():com.javacode2018.junit.demo4.MathUtilsTest4@1a93a7ca
@After:com.javacode2018.junit.demo4.MathUtilsTest4@1a93a7ca
##################
@AfterClass
-----------------
运行测试用例个数:4
失败用例个数:3
timeOutTest(com.javacode2018.junit.demo4.MathUtilsTest4): test timed out after 1000 milliseconds
max(com.javacode2018.junit.demo4.MathUtilsTest4): hah 
expectedTest(com.javacode2018.junit.demo4.MathUtilsTest4): Expected exception: java.lang.NullPointerException
运行测试用例总耗时(ms):1018
测试用例是否都成功了：false
```

从输出中可以看出

*   @BeforeClass和@AfterClass标注的方法只会运行一次
*   每个@Test标注的方法运行之前会先运行@Before标注的方法，然后运行@Test标注的这个方法，之后再运行@After
*   从this的输出看出，每个@Test运行的时候，当前类的实例都会重新创建一个新的
*   不论@Test标注的方法是否异常，@AfterClass、@After标注的方法都会执行，且异常会被淹没，输出中看不到异常信息

### 2.6、参数化测试

Junit 4 引入了一个新的功能**参数化测试**。

参数化测试允许开发人员使用不同的值反复运行同一个测试，你将遵循 5 个步骤来创建**参数化测试**。

*   用 @RunWith(Parameterized.class) 来注释 test 类。
*   创建一个由 @Parameters 注释的公共的静态方法，它返回一个对象的集合(数组)来作为测试数据集合。
*   创建一个公共的构造函数，它接受和一行测试数据相等同的东西。
*   为每一列测试数据创建一个实例变量。
*   用实例变量作为测试数据的来源来创建你的测试用例。

可能大家看了上面的理解，还是比较迷糊。

比如我们com.javacode2018.junit.demo1.MathUtils#max测试下面几组数组

```java
1,2,3
100,99,80
30,-1,100
```

我们可以这么写

```java
package com.javacode2018.junit.demo5;

import com.javacode2018.junit.demo1.MathUtils;
import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.JUnitCore;
import org.junit.runner.Result;
import org.junit.runner.RunWith;
import org.junit.runner.notification.Failure;
import org.junit.runners.Parameterized;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@RunWith(Parameterized.class)
public class MathUtilsTest5 {

    public static class TestData {
        int[] testData;//测试数据
        int expectedValue;//预期的结果

        public TestData(int[] testData, int expectedValue) {
            this.testData = testData;
            this.expectedValue = expectedValue;
        }

        @Override
        public String toString() {
            return "TestData{" +
                    "testData=" + Arrays.toString(testData) +
                    ", expectedValue=" + expectedValue +
                    '}';
        }
    }

    private TestData testData;

    @Parameterized.Parameters
    public static List<TestData> initTestData() {
        System.out.println("initTestData()");
        //key：期望的结果，value：max方法需要测试的数据
        List<TestData> result = new ArrayList<>();
        result.add(new TestData(new int[]{1, 2, 3}, 3));
        result.add(new TestData(new int[]{100, 99, 80}, 100));
        result.add(new TestData(new int[]{30, -1, 100}, 100));
        return result;
    }

    public MathUtilsTest5(TestData testData) {
        System.out.println("MathUtilsTest5构造器:" + testData);
        this.testData = testData;
    }

    @Test
    public void maxTest() throws Throwable {
        System.out.println(this.hashCode() + ",maxTest():" + this.testData);
        int result = MathUtils.max(this.testData.testData);
        //判断测试结果和我们期望的结果是否一致
        Assert.assertEquals(this.testData.expectedValue, result);
        System.out.println("###################");
    }

    public static void main(String[] args) {
        Result result = JUnitCore.runClasses(MathUtilsTest5.class);
        System.out.println("-----------------");
        System.out.println("运行测试用例个数:" + result.getRunCount());
        System.out.println("失败用例个数:" + result.getFailures().size());
        for (Failure failure : result.getFailures()) {
            System.out.println(failure);
        }
        System.out.println("运行测试用例总耗时(ms):" + result.getRunTime());
        System.out.println("测试用例是否都成功了：" + result.wasSuccessful());

    }
}
```

为了方便大家理解代码的运行过程，代码中添加了很多日志输出，运行结果如下，结合代码和输出，理解很容易

```java
initTestData()
MathUtilsTest5构造器:TestData{testData=[1, 2, 3], expectedValue=3}
721748895,maxTest():TestData{testData=[1, 2, 3], expectedValue=3}
###################
MathUtilsTest5构造器:TestData{testData=[100, 99, 80], expectedValue=100}
463345942,maxTest():TestData{testData=[100, 99, 80], expectedValue=100}
###################
MathUtilsTest5构造器:TestData{testData=[30, -1, 100], expectedValue=100}
195600860,maxTest():TestData{testData=[30, -1, 100], expectedValue=100}
###################
-----------------
运行测试用例个数:3
失败用例个数:0
运行测试用例总耗时(ms):12
测试用例是否都成功了：true
```

## 3、Spring集成junit

spring集成junit比较简单，下面我们来个案例感受一下。

### 3.1、加入maven配置

```java
<dependency>
    <groupId>org.springframework</groupId>
    <artifactId>spring-test</artifactId>
    <version>5.2.6.RELEASE</version>
</dependency>
<dependency>
    <groupId>junit</groupId>
    <artifactId>junit</artifactId>
    <version>4.13</version>
</dependency>
```

### 3.2、来个spring的入口配置类

```java
package com.javacode2018.springjunit;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class MainConfig {
    @Bean
    public String name() {
        return "  喔喔松java";
    }

    @Bean
    public int age() {
        return 30;
    }
}
```

### 3.3、来个junit测试类集成spring

下面我们来个测试类，对上面的MainConfig中注册的2个bean进行测试

```java
package com.javacode2018.springjunit;

import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringRunner;

@RunWith(SpringRunner.class) //@1
@ContextConfiguration(classes = {MainConfig.class}) //@2
public class MainConfigTest {

    @Autowired
    private String name;

    @Autowired
    private int age;

    @Test
    public void nameTest() {
        System.out.println(this.name);
        Assert.assertEquals("  喔喔松java", this.name);
    }

    @Test
    public void ageTest() {
        System.out.println(this.age);
        Assert.assertEquals(30, this.age);
    }
}
```

注意上面的@1和@2的代码了，这就是spring集成junit的关键代码，@Runwith的值是`org.springframework.test.context.junit4.SpringRunner`，@ContextConfiguration注解通过classes属性指定spring启动类，如果是xml的方式，可以使用另外一个属性value或者locations来指定入口xml的位置。

上面代码中name和age属性上面都有@Autowired注解，这2个属性会被自动从spring容器中注入进来。

### 3.4、来个测试启动类

```java
package com.javacode2018.springjunit;

import org.junit.runner.JUnitCore;
import org.junit.runner.Result;
import org.junit.runner.notification.Failure;

public class TestRunner {

    public static void main(String[] args) {
        Result result = JUnitCore.runClasses(MainConfigTest.class);
        System.out.println("-----------------");
        System.out.println("运行测试用例个数:" + result.getRunCount());
        System.out.println("失败用例个数:" + result.getFailures().size());
        for (Failure failure : result.getFailures()) {
            System.out.println(failure);
        }
        System.out.println("运行测试用例总耗时(ms):" + result.getRunTime());
        System.out.println("测试用例是否都成功了：" + result.wasSuccessful());

    }

}
```

运行输出

```java
30
  喔喔松java
-----------------
运行测试用例个数:2
失败用例个数:0
运行测试用例总耗时(ms):422
测试用例是否都成功了：true
```

## 4、开发工具中使用junit

上面介绍的所有案例，都是通过main方法中用JUnitCore.runClasses来运行测试用例的，实际上有更简单的方式。

java的常用开发工具有eclipse和idea，这两个工具都将junit集成好了，通过开发工具继承的功能，运行测试用例更方便，不需要我们写JUnitCore.runClasses代码了。

我们来演示一下，如下图

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202312081122756.png)

点击1处的蓝色箭头，即可运行当前测试类中的所有用例，即2个测试方法，运行效果如下，左边显示了运行的测试用例列表，右边的显示了输出信息。

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202312081122589.png)

图中的2和3也可以点击，只会运行选中的那个测试方法，比如点击2，只会运行nameTest()这个用例，效果如下

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202312081122787.png)

## 5、总结

1、本文详细介绍了junit的用法，常用的注解有@Test、@BeforeClass、@AfterClass、@Before、@After、@Ignore、@RunWith，这些都要掌握

2、spring中集成junit，主要的配置就是在测试类上面需要加上下面代码

```java
@RunWith(SpringRunner.class) //@1
@ContextConfiguration(classes = {MainConfig.class}) //@2
```

3、开发工具中使用junit更容易

## 6、案例源码

```java
git地址：
https://gitee.com/javacode2018/spring-series

本文案例对应源码：
    spring-series\lesson-008-junit
    spring-series\lesson-008-springjunit
```


[下一篇：Spring上下文生命周期](http://www.itsoku.com/course/5/137)

[上一篇：Spring集成MyBatis](http://www.itsoku.com/course/5/135)