-  1 Stream概述
- 2 Stream的创建
- 3 Stream的使用
- 4 Stream源码解读

------

![image-20211210195601838](./%E6%84%9F%E5%8F%97JavaLambda%E4%B9%8B%E7%BE%8E.assets/20211210195602.png)

先贴上几个案例，水平高超的同学可以挑战一下：

1. 从员工集合中筛选出salary大于8000的员工，并放置到新的集合里。
2. 统计员工的最高薪资、平均薪资、薪资之和。
3. 将员工按薪资从高到低排序，同样薪资者年龄小者在前。
4. 将员工按性别分类，将员工按性别和地区分类，将员工按薪资是否高于8000分为两部分。

用传统的迭代处理也不是很难，但代码就显得冗余了，跟Stream相比高下立判。

# 1 Stream概述

Java 8 是一个非常成功的版本，这个版本新增的`Stream`，配合同版本出现的 `Lambda` ，给我们操作集合（Collection）提供了极大的便利。

那么什么是`Stream`？

> `Stream`将要处理的元素集合看作一种流，在流的过程中，借助`Stream API`对流中的元素进行操作，比如：筛选、排序、聚合等。

`Stream`可以由数组或集合创建，对流的操作分为两种：

1. 中间操作，每次返回一个新的流，可以有多个。
2. 终端操作，每个流只能进行一次终端操作，终端操作结束后流无法再次使用。终端操作会产生一个新的集合或值。

另外，`Stream`有几个特性：

1. stream不存储数据，而是按照特定的规则对数据进行计算，一般会输出结果。
2. stream不会改变数据源，通常情况下会产生一个新的集合或一个值。
3. stream具有延迟执行特性，只有调用**终端操作**时，中间操作才会执行。

# 2 Stream的创建

`Stream`可以通过集合数组创建。

1、通过 `java.util.Collection.stream()` 方法用集合创建流

```java
List<String> list = Arrays.asList("a", "b", "c");
// 创建一个顺序流
Stream<String> stream = list.stream();
// 创建一个并行流
Stream<String> parallelStream = list.parallelStream();
```

2、使用`java.util.Arrays.stream(T[] array)`方法用数组创建流

```java
int[] array={1,3,5,6,8};
IntStream stream = Arrays.stream(array);

```

3、使用`Stream`的静态方法：`of()、iterate()、generate()`

```java
Stream<Integer> stream = Stream.of(1, 2, 3, 4, 5, 6);

Stream<Integer> stream2 = Stream.iterate(0, (x) -> x + 3).limit(4);
stream2.forEach(System.out::println);

Stream<Double> stream3 = Stream.generate(Math::random).limit(3);
stream3.forEach(System.out::println);
```

输出结果：

> 0 3 6 9 0.6796156909271994 0.1914314208854283 0.8116932592396652

**`stream`和`parallelStream`的简单区分：** `stream`是顺序流，由主线程按顺序对流执行操作，而`parallelStream`是并行流，内部以多线程并行执行的方式对流进行操作，但前提是流中的数据处理没有顺序要求。例如筛选集合中的奇数，两者的处理不同之处：![图片](./%E6%84%9F%E5%8F%97JavaLambda%E4%B9%8B%E7%BE%8E.assets/20210611101318.webp)

如果流中的数据量足够大，并行流可以加快处速度。

除了直接创建并行流，还可以通过`parallel()`把顺序流转换成并行流：

```java
Optional<Integer> findFirst = list.stream().parallel().filter(x->x>6).findFirst();
1
```

# 3 Stream的使用

在使用stream之前，先理解一个概念：`Optional` 。

> `Optional`类是一个可以为`null`的容器对象。如果值存在则`isPresent()`方法会返回`true`，调用`get()`方法会返回该对象。更详细说明请见：菜鸟教程Java 8 Optional类

**接下来，大批代码向你袭来！我将用20个案例将Stream的使用整得明明白白，只要跟着敲一遍代码，就能很好地掌握。**

## 案例使用的员工类

这是后面案例中使用的员工类：

```java
List<Person> personList = new ArrayList<Person>();
personList.add(new Person("Tom", 8900, "male", "New York"));
personList.add(new Person("Jack", 7000, "male", "Washington"));
personList.add(new Person("Lily", 7800, "female", "Washington"));
personList.add(new Person("Anni", 8200, "female", "New York"));
personList.add(new Person("Owen", 9500, "male", "New York"));
personList.add(new Person("Alisa", 7900, "female", "New York"));

class Person {
  private String name;  // 姓名
  private int salary; // 薪资
  private int age; // 年龄
  private String sex; //性别
  private String area;  // 地区

  // 构造方法
  public Person(String name, int salary, int age,String sex,String area) {
    this.name = name;
    this.salary = salary;
    this.age = age;
    this.sex = sex;
    this.area = area;
  }
  // 省略了get和set，请自行添加

}
```

## 3.1 遍历/匹配（foreach/find/match）

`Stream`也是支持类似集合的遍历和匹配元素的，只是`Stream`中的元素是以`Optional`类型存在的。`Stream`的遍历、匹配非常简单。

![图片](./%E6%84%9F%E5%8F%97JavaLambda%E4%B9%8B%E7%BE%8E.assets/20210611101325.png)

```java
// import已省略，请自行添加，后面代码亦是

public class StreamTest {
  public static void main(String[] args) {
    List<Integer> list = Arrays.asList(7, 6, 9, 3, 8, 2, 1);

    // 遍历输出符合条件的元素
    list.stream().filter(x -> x > 6).forEach(System.out::println);
    // 匹配第一个
    Optional<Integer> findFirst = list.stream().filter(x -> x > 6).findFirst();
    // 匹配任意（适用于并行流）
    Optional<Integer> findAny = list.parallelStream().filter(x -> x > 6).findAny();
    // 是否包含符合特定条件的元素
    boolean anyMatch = list.stream().anyMatch(x -> x < 6);
    System.out.println("匹配第一个值：" + findFirst.get());
    System.out.println("匹配任意一个值：" + findAny.get());
    System.out.println("是否存在大于6的值：" + anyMatch);
  }
}
```

## 3.2 筛选（filter）

筛选，是按照一定的规则校验流中的元素，将符合条件的元素提取到新的流中的操作。![图片](./%E6%84%9F%E5%8F%97JavaLambda%E4%B9%8B%E7%BE%8E.assets/20210611101335.webp)

**案例一：筛选出`Integer`集合中大于7的元素，并打印出来**

```java
public class StreamTest {
  public static void main(String[] args) {
    List<Integer> list = Arrays.asList(6, 7, 3, 8, 1, 2, 9);
    Stream<Integer> stream = list.stream();
    stream.filter(x -> x > 7).forEach(System.out::println);
  }
}
```

预期结果：

> 8 9

**案例二：筛选员工中工资高于8000的人，并形成新的集合。** 形成新集合依赖`collect`（收集），后文有详细介绍。

```java
public class StreamTest {
  public static void main(String[] args) {
    List<Person> personList = new ArrayList<Person>();
    personList.add(new Person("Tom", 8900, 23, "male", "New York"));
    personList.add(new Person("Jack", 7000, 25, "male", "Washington"));
    personList.add(new Person("Lily", 7800, 21, "female", "Washington"));
    personList.add(new Person("Anni", 8200, 24, "female", "New York"));
    personList.add(new Person("Owen", 9500, 25, "male", "New York"));
    personList.add(new Person("Alisa", 7900, 26, "female", "New York"));
    List<String> fiterList = personList.stream().filter(x -> x.getSalary() > 8000).map(Person::getName).collect(Collectors.toList());
    System.out.print("高于8000的员工姓名：" + fiterList);
  }
}
```

运行结果：

> 高于8000的员工姓名：[Tom, Anni, Owen]

## 3.3 聚合（max/min/count)

`max`、`min`、`count`这些字眼你一定不陌生，没错，在mysql中我们常用它们进行数据统计。Java stream中也引入了这些概念和用法，极大地方便了我们对集合、数组的数据统计工作。

![图片](./%E6%84%9F%E5%8F%97JavaLambda%E4%B9%8B%E7%BE%8E.assets/20210611101339.png)

**案例一：获取`String`集合中最长的元素。**

```java
public class StreamTest {
  public static void main(String[] args) {
    List<String> list = Arrays.asList("adnm", "admmt", "pot", "xbangd", "weoujgsd");
    Optional<String> max = list.stream().max(Comparator.comparing(String::length));
    System.out.println("最长的字符串：" + max.get());
  }
}
```

输出结果：

> 最长的字符串：weoujgsd

**案例二：获取`Integer`集合中的最大值。**

```java
public class StreamTest {
  public static void main(String[] args) {
    List<Integer> list = Arrays.asList(7, 6, 9, 4, 11, 6);
    // 自然排序
    Optional<Integer> max = list.stream().max(Integer::compareTo);
    // 自定义排序
    Optional<Integer> max2 = list.stream().max(new Comparator<Integer>() {
      @Override
      public int compare(Integer o1, Integer o2) {
        return o1.compareTo(o2);
      }
    });
    System.out.println("自然排序的最大值：" + max.get());
    System.out.println("自定义排序的最大值：" + max2.get());
  }
}
```

输出结果：

> 自然排序的最大值：11 自定义排序的最大值：11

**案例三：获取员工工资最高的人。**

```java
public class StreamTest {
  public static void main(String[] args) {
    List<Person> personList = new ArrayList<Person>();
    personList.add(new Person("Tom", 8900, 23, "male", "New York"));
    personList.add(new Person("Jack", 7000, 25, "male", "Washington"));
    personList.add(new Person("Lily", 7800, 21, "female", "Washington"));
    personList.add(new Person("Anni", 8200, 24, "female", "New York"));
    personList.add(new Person("Owen", 9500, 25, "male", "New York"));
    personList.add(new Person("Alisa", 7900, 26, "female", "New York"));
    Optional<Person>max=personList.stream().max(Comparator.comparingInt(Person::getSalary));
    System.out.println("员工工资最大值：" + max.get().getSalary());
  }
}
```

输出结果：

> 员工工资最大值：9500

**案例四：计算`Integer`集合中大于6的元素的个数。**

```java
import java.util.Arrays;
import java.util.List;

public class StreamTest {
  public static void main(String[] args) {
    List<Integer> list = Arrays.asList(7, 6, 4, 8, 2, 11, 9);
    long count = list.stream().filter(x -> x > 6).count();
    System.out.println("list中大于6的元素个数：" + count);
  }
}
```

输出结果：

> list中大于6的元素个数：4

## 3.4 映射(map/flatMap)

映射，可以将一个流的元素按照一定的映射规则映射到另一个流中。分为`map`和`flatMap`：

- `map`：接收一个函数作为参数，该函数会被应用到每个元素上，并将其映射成一个新的元素。
- `flatMap`：接收一个函数作为参数，将流中的每个值都换成另一个流，然后把所有流连接成一个流。

![图片](./%E6%84%9F%E5%8F%97JavaLambda%E4%B9%8B%E7%BE%8E.assets/20210611102007.webp)

**案例一：英文字符串数组的元素全部改为大写。整数数组每个元素+3。**

```java
public class StreamTest {
 public static void main(String[] args) {
  String[] strArr = { "abcd", "bcdd", "defde", "fTr" };
  List<String> strList = Arrays.stream(strArr).map(String::toUpperCase).collect(Collectors.toList());

  List<Integer> intList = Arrays.asList(1, 3, 5, 7, 9, 11);
  List<Integer> intListNew = intList.stream().map(x -> x + 3).collect(Collectors.toList());

  System.out.println("每个元素大写：" + strList);
  System.out.println("每个元素+3：" + intListNew);
 }
}
```

输出结果：

> 每个元素大写：[ABCD, BCDD, DEFDE, FTR] 每个元素+3：[4, 6, 8, 10, 12, 14]

**案例二：将员工的薪资全部增加1000。**

```java
public class StreamTest {
  public static void main(String[] args) {
    List<Person> personList = new ArrayList<Person>();
    personList.add(new Person("Tom", 8900, 23, "male", "New York"));
    personList.add(new Person("Jack", 7000, 25, "male", "Washington"));
    personList.add(new Person("Lily", 7800, 21, "female", "Washington"));
    personList.add(new Person("Anni", 8200, 24, "female", "New York"));
    personList.add(new Person("Owen", 9500, 25, "male", "New York"));
    personList.add(new Person("Alisa", 7900, 26, "female", "New York"));

    // 不改变原来员工集合的方式
    List<Person> personListNew = personList.stream().map(person -> {
      Person personNew = new Person(person.getName(), 0, 0, null, null);
      personNew.setSalary(person.getSalary() + 10000);
      return personNew;
    }).collect(Collectors.toList());
    System.out.println("一次改动前：" + personList.get(0).getName() + "-->" + personList.get(0).getSalary());
    System.out.println("一次改动后：" + personListNew.get(0).getName() + "-->" + personListNew.get(0).getSalary());

    // 改变原来员工集合的方式
    List<Person> personListNew2 = personList.stream().map(person -> {
      person.setSalary(person.getSalary() + 10000);
      return person;
    }).collect(Collectors.toList());
    System.out.println("二次改动前：" + personList.get(0).getName() + "-->" + personListNew.get(0).getSalary());
    System.out.println("二次改动后：" + personListNew2.get(0).getName() + "-->" + personListNew.get(0).getSalary());
  }
}
```

输出结果：

> 一次改动前：Tom–>8900 一次改动后：Tom–>18900 
>
> 二次改动前：Tom–>18900 二次改动后：Tom–>18900

**案例三：将两个字符数组合并成一个新的字符数组。**

```java
public class StreamTest {
  public static void main(String[] args) {
    List<String> list = Arrays.asList("m,k,l,a", "1,3,5,7");
    List<String> listNew = list.stream().flatMap(s -> {
      // 将每个元素转换成一个stream
      String[] split = s.split(",");
      Stream<String> s2 = Arrays.stream(split);
      return s2;
    }).collect(Collectors.toList());

    System.out.println("处理前的集合：" + list);
    System.out.println("处理后的集合：" + listNew);
  }
}
```

输出结果：

> 处理前的集合：[m-k-l-a, 1-3-5] 处理后的集合：[m, k, l, a, 1, 3, 5]

```
map.forEach((s, integer) -> map2.put(s, integer));
map.forEach(map2::put);
```

## 3.5 归约(reduce)

归约，也称缩减，顾名思义，是把一个流缩减成一个值，能实现对集合求和、求乘积和求最值操作。![图片](./%E6%84%9F%E5%8F%97JavaLambda%E4%B9%8B%E7%BE%8E.assets/20210611102018.png)

**案例一：求`Integer`集合的元素之和、乘积和最大值。**

```java
public class StreamTest {
  public static void main(String[] args) {
    List<Integer> list = Arrays.asList(1, 3, 2, 8, 11, 4);
    // 求和方式1
    Optional<Integer> sum = list.stream().reduce((x, y) -> x + y);
    // 求和方式2
    Optional<Integer> sum2 = list.stream().reduce(Integer::sum);
    // 求和方式3
    Integer sum3 = list.stream().reduce(0, Integer::sum);

    // 求乘积
    Optional<Integer> product = list.stream().reduce((x, y) -> x * y);

    // 求最大值方式1
    Optional<Integer> max = list.stream().reduce((x, y) -> x > y ? x : y);
    // 求最大值写法2
    Integer max2 = list.stream().reduce(1, Integer::max);

    System.out.println("list求和：" + sum.get() + "," + sum2.get() + "," + sum3);
    System.out.println("list求积：" + product.get());
    System.out.println("list求最大值：" + max.get() + "," + max2);
  }
}
```

输出结果：

> list求和：29,29,29 list求积：2112 list求和：11,11

**案例二：求所有员工的工资之和和最高工资。**

```java
public class StreamTest {
  public static void main(String[] args) {
    List<Person> personList = new ArrayList<Person>();
    personList.add(new Person("Tom", 8900, 23, "male", "New York"));
    personList.add(new Person("Jack", 7000, 25, "male", "Washington"));
    personList.add(new Person("Lily", 7800, 21, "female", "Washington"));
    personList.add(new Person("Anni", 8200, 24, "female", "New York"));
    personList.add(new Person("Owen", 9500, 25, "male", "New York"));
    personList.add(new Person("Alisa", 7900, 26, "female", "New York"));

    // 求工资之和方式1：
    Optional<Integer> sumSalary = personList.stream().map(Person::getSalary).reduce(Integer::sum);
    // 求工资之和方式2：
    Integer sumSalary2 = personList.stream().reduce(0, (sum, p) -> sum += p.getSalary(),
                                                    (sum1, sum2) -> sum1 + sum2);
    // 求工资之和方式3：
    Integer sumSalary3 = personList.stream().reduce(0, (sum, p) -> sum += p.getSalary(), Integer::sum);

    // 求最高工资方式1：
    Integer maxSalary = personList.stream().reduce(0, (max, p) -> max > p.getSalary() ? max : p.getSalary(), Integer::max);
    // 求最高工资方式2：
    Integer maxSalary2 = personList.stream().reduce(0, (max, p) -> max > p.getSalary() ? max : p.getSalary(),  (max1, max2  -> max1 > max2 ? max1 : max2);

                                                    System.out.println("工资之和：" + sumSalary.get() + "," + sumSalary2 + "," + sumSalary3);
                                                    System.out.println("最高工资：" + maxSalary + "," + maxSalary2);
                                                    }
                                                    }
```

输出结果：

> 工资之和：49300,49300,49300 最高工资：9500,9500

## 3.6 收集(collect)

`collect`，收集，可以说是内容最繁多、功能最丰富的部分了。从字面上去理解，就是把一个流收集起来，最终可以是收集成一个值也可以收集成一个新的集合。

> `collect`主要依赖`java.util.stream.Collectors`类内置的静态方法。

### 3.6.1 归集(toList/toSet/toMap)

因为流不存储数据，那么在流中的数据完成处理后，需要将流中的数据重新归集到新的集合里。`toList`、`toSet`和`toMap`比较常用，另外还有`toCollection`、`toConcurrentMap`等复杂一些的用法。

下面用一个案例演示`toList`、`toSet`和`toMap`：

```java
public class StreamTest {
  public static void main(String[] args) {
    List<Integer> list = Arrays.asList(1, 6, 3, 4, 6, 7, 9, 6, 20);
    List<Integer> listNew = list.stream().filter(x -> x % 2 == 0).collect(Collectors.toList());
    Set<Integer> set = list.stream().filter(x -> x % 2 == 0).collect(Collectors.toSet());

    List<Person> personList = new ArrayList<Person>();
    personList.add(new Person("Tom", 8900, 23, "male", "New York"));
    personList.add(new Person("Jack", 7000, 25, "male", "Washington"));
    personList.add(new Person("Lily", 7800, 21, "female", "Washington"));
    personList.add(new Person("Anni", 8200, 24, "female", "New York"));
    Map<?,Person> map = personList.stream().filter(p>p.getSalary()>8000).collect(Collectors.toMap(Person::getName, p-> p));
    System.out.println("toList:" + listNew);
    System.out.println("toSet:" + set);
    System.out.println("toMap:" + map);
  }
}
```

运行结果：

> toList：[6, 4, 6, 6, 20] 
>
> toSet：[4, 20, 6] 
>
> toMap：{Tom=mutest.Person@5fd0d5ae, Anni=mutest.Person@2d98a335}

### 3.6.2 统计(count/averaging)

`Collectors`提供了一系列用于数据统计的静态方法：

- 计数：`count`
- 平均值：`averagingInt`、`averagingLong`、`averagingDouble`
- 最值：`maxBy`、`minBy`
- 求和：`summingInt`、`summingLong`、`summingDouble`
- 统计以上所有：`summarizingInt`、`summarizingLong`、`summarizingDouble`

**案例：统计员工人数、平均工资、工资总额、最高工资。**

```java
public class StreamTest {
  public static void main(String[] args) {
    List<Person> personList = new ArrayList<Person>();
    personList.add(new Person("Tom", 8900, 23, "male", "New York"));
    personList.add(new Person("Jack", 7000, 25, "male", "Washington"));
    personList.add(new Person("Lily", 7800, 21, "female", "Washington"));

    // 求总数
    Long count = personList.stream().collect(Collectors.counting());
    // 求平均工资
    Doubleaverage=personList.stream().collect(Collectors.averagingDouble(Person::getSalary));
    // 求最高工资
    Optional<Integer>max=personList.stream().map(Person::getSalary).collect(Collectors.maxBy(Integer::compare));
    // 求工资之和
    Integer sum = personList.stream().collect(Collectors.summingInt(Person::getSalary));
    // 一次性统计所有信息
    DoubleSummaryStatistics collect=personList.stream().collect(Collectors.summarizingDouble(Person::getSalary));

    System.out.println("员工总数：" + count);
    System.out.println("员工平均工资：" + average);
    System.out.println("员工工资总和：" + sum);
    System.out.println("员工工资所有统计：" + collect);
  }
}
```

运行结果：

> 员工总数：3 员工平均工资：7900.0 
>
> 员工工资总和：23700 
>
> 员工工资所有统计：DoubleSummaryStatistics{count=3, sum=23700.000000,min=7000.000000, average=7900.000000, max=8900.000000}

### 3.6.3 分组(partitioningBy/groupingBy)

- 分区：将`stream`按条件分为两个`Map`，比如员工按薪资是否高于8000分为两部分。
- 分组：将集合分为多个Map，比如员工按性别分组。有单级分组和多级分组。

![图片](./%E6%84%9F%E5%8F%97JavaLambda%E4%B9%8B%E7%BE%8E.assets/20210611102027.png)

**案例：将员工按薪资是否高于8000分为两部分；将员工按性别和地区分组**

```java
public class StreamTest {
  public static void main(String[] args) {
    List<Person> personList = new ArrayList<Person>();
    personList.add(new Person("Tom", 8900, "male", "New York"));
    personList.add(new Person("Jack", 7000, "male", "Washington"));
    personList.add(new Person("Lily", 7800, "female", "Washington"));
    personList.add(new Person("Anni", 8200, "female", "New York"));
    personList.add(new Person("Owen", 9500, "male", "New York"));
    personList.add(new Person("Alisa", 7900, "female", "New York"));

    // 将员工按薪资是否高于8000分组
    Map<Boolean, List<Person>> part = personList.stream().collect(Collectors.partitioningBy(x -> x.getSalary() > 8000));
    // 将员工按性别分组
    Map<String, List<Person>> group = personList.stream().collect(Collectors.groupingBy(Person::getSex));
    // 将员工先按性别分组，再按地区分组
    Map<String, Map<String, List<Person>>> group2 = personList.stream().collect(Collectors.groupingBy(Person::getSex, Collectors.groupingBy(Person::getArea)));
    System.out.println("员工按薪资是否大于8000分组情况：" + part);
    System.out.println("员工按性别分组情况：" + group);
    System.out.println("员工按性别、地区：" + group2);
  }
}
```

输出结果：

```java
员工按薪资是否大于8000分组情况：{false=[mutest.Person@2d98a335, mutest.Person@16b98e56, mutest.Person@7ef20235], true=[mutest.Person@27d6c5e0, mutest.Person@4f3f5b24, mutest.Person@15aeb7ab]}
员工按性别分组情况：{female=[mutest.Person@16b98e56, mutest.Person@4f3f5b24, mutest.Person@7ef20235], male=[mutest.Person@27d6c5e0, mutest.Person@2d98a335, mutest.Person@15aeb7ab]}
员工按性别、地区：{female={New York=[mutest.Person@4f3f5b24, mutest.Person@7ef20235], Washington=[mutest.Person@16b98e56]}, male={New York=[mutest.Person@27d6c5e0, mutest.Person@15aeb7ab], Washington=[mutest.Person@2d98a335]}}
```

### 3.6.4 接合(joining)

`joining`可以将stream中的元素用特定的连接符（没有的话，则直接连接）连接成一个字符串。

```java
public class StreamTest {
  public static void main(String[] args) {
    List<Person> personList = new ArrayList<Person>();
    personList.add(new Person("Tom", 8900, 23, "male", "New York"));
    personList.add(new Person("Jack", 7000, 25, "male", "Washington"));
    personList.add(new Person("Lily", 7800, 21, "female", "Washington"));

    String names = personList.stream().map(p -> p.getName()).collect(Collectors.joining(","));
    System.out.println("所有员工的姓名：" + names);
    List<String> list = Arrays.asList("A", "B", "C");
    String string = list.stream().collect(Collectors.joining("-"));
    System.out.println("拼接后的字符串：" + string);
  }
}
```

运行结果：

> 所有员工的姓名：Tom,Jack,Lily 拼接后的字符串：A-B-C

### 3.6.5 归约(reducing)

`Collectors`类提供的`reducing`方法，相比于`stream`本身的`reduce`方法，增加了对自定义归约的支持。

```java
public class StreamTest {
  public static void main(String[] args) {
    List<Person> personList = new ArrayList<Person>();
    personList.add(new Person("Tom", 8900, 23, "male", "New York"));
    personList.add(new Person("Jack", 7000, 25, "male", "Washington"));
    personList.add(new Person("Lily", 7800, 21, "female", "Washington"));

    // 每个员工减去起征点后的薪资之和（这个例子并不严谨，但一时没想到好的例子）
    Integer sum = personList.stream().collect(Collectors.reducing(0, Person::getSalary, (i, j) -> (i + j - 5000)));
    System.out.println("员工扣税薪资总和：" + sum);
    // stream的reduce
    Optional<Integer> sum2 =personList.stream().map(Person::getSalary).reduce(Integer::sum);
    System.out.println("员工薪资总和：" + sum2.get());
  }
}
```

运行结果：

> 员工扣税薪资总和：8700 员工薪资总和：23700

## 3.7 排序(sorted)

sorted，中间操作。有两种排序：

- sorted()：自然排序，流中元素需实现Comparable接口
- sorted(Comparator com)：Comparator排序器自定义排序

**案例：将员工按工资由高到低（工资一样则按年龄由大到小）排序**

```java
public class StreamTest {
  public static void main(String[] args) {
    List<Person> personList = new ArrayList<Person>();

    personList.add(new Person("Sherry", 9000, 24, "female", "New York"));
    personList.add(new Person("Tom", 8900, 22, "male", "Washington"));
    personList.add(new Person("Jack", 9000, 25, "male", "Washington"));
    personList.add(new Person("Lily", 8800, 26, "male", "New York"));
    personList.add(new Person("Alisa", 9000, 26, "female", "New York"));

    // 按工资升序排序（自然排序）
    List<String> newList = personList.stream().sorted(Comparator.comparing(Person::getSalary)).map(Person::getName)
      .collect(Collectors.toList());
    // 按工资倒序排序
    List<String> newList2 = personList.stream().sorted(Comparator.comparing(Person::getSalary).reversed())
      .map(Person::getName).collect(Collectors.toList());
    // 先按工资再按年龄升序排序
    List<String> newList3 = personList.stream()
      .sorted(Comparator.comparing(Person::getSalary).thenComparing(Person::getAge)).map(Person::getName)
      .collect(Collectors.toList());
    // 先按工资再按年龄自定义排序（降序）
    List<String> newList4 = personList.stream().sorted((p1, p2) -> {
      if (p1.getSalary() == p2.getSalary()) {
        return p2.getAge() - p1.getAge();
      } else {
        return p2.getSalary() - p1.getSalary();
      }
    }).map(Person::getName).collect(Collectors.toList());

    System.out.println("按工资升序排序：" + newList);
    System.out.println("按工资降序排序：" + newList2);
    System.out.println("先按工资再按年龄升序排序：" + newList3);
    System.out.println("先按工资再按年龄自定义降序排序：" + newList4);
  }
}
```

运行结果：

> 按工资自然排序：[Lily, Tom, Sherry, Jack, Alisa] 
>
> 按工资降序排序：[Sherry, Jack, Alisa,Tom, Lily] 
>
> 先按工资再按年龄自然排序：[Sherry, Jack, Alisa, Tom, Lily] 
>
> 先按工资再按年龄自定义降序排序：[Alisa, Jack, Sherry, Tom, Lily]

## 3.8 提取/组合

流也可以进行合并、去重、限制、跳过等操作。

![图片](./%E6%84%9F%E5%8F%97JavaLambda%E4%B9%8B%E7%BE%8E.assets/20210611101915.webp)

![图片](./%E6%84%9F%E5%8F%97JavaLambda%E4%B9%8B%E7%BE%8E.assets/20210611101919.webp)

![图片](./%E6%84%9F%E5%8F%97JavaLambda%E4%B9%8B%E7%BE%8E.assets/20210611101922.webp)

```java
public class StreamTest {
  public static void main(String[] args) {
    String[] arr1 = { "a", "b", "c", "d" };
    String[] arr2 = { "d", "e", "f", "g" };

    Stream<String> stream1 = Stream.of(arr1);
    Stream<String> stream2 = Stream.of(arr2);
    // concat:合并两个流 distinct：去重
    List<String> newList = Stream.concat(stream1, stream2).distinct().collect(Collectors.toList());
    // limit：限制从流中获得前n个数据
    List<Integer> collect = Stream.iterate(1, x -> x + 2).limit(10).collect(Collectors.toList());
    // skip：跳过前n个数据
    List<Integer> collect2 = Stream.iterate(1, x -> x + 2).skip(1).limit(5).collect(Collectors.toList());

    System.out.println("流合并：" + newList);
    System.out.println("limit：" + collect);
    System.out.println("skip：" + collect2);
  }
}
```

运行结果：

> 流合并：[a, b, c, d, e, f, g]
>
> limit：[1, 3, 5, 7, 9, 11, 13, 15, 17, 19] 
>
> skip：[3, 5, 7, 9, 11]

# 4 Optional 

从 Java 8 引入的一个很有趣的特性是 Optional  类。Optional 类主要解决的问题是臭名昭著的空指针异常（NullPointerException） —— 每个 Java 程序员都非常了解的异常。本质上，这是一个包含有可选值的包装类，这意味着 Optional 类既可以含有对象也可以为空。

Optional 是 Java 实现函数式编程的强劲一步，并且帮助在范式中实现。但是 Optional 的意义显然不止于此。

------

我们从一个简单的用例开始。在 Java 8 之前，任何访问对象方法或属性的调用都可能导致 NullPointerException：

```java
String isocode = user.getAddress().getCountry().getIsocode().toUpperCase();
```

在这个小示例中，如果我们需要确保不触发异常，就得在访问每一个值之前对其进行明确地检查：

```java
if (user != null) {
  Address address = user.getAddress();
  if (address != null) {
    Country country = address.getCountry();
    if (country != null) {
      String isocode = country.getIsocode();
      if (isocode != null) {
        isocode = isocode.toUpperCase();
      }
    }
  }
}
```

你看到了，这很容易就变得冗长，难以维护。

为了简化这个过程，我们来看看用 Optional  类是怎么做的。从创建和验证实例，到使用其不同的方法，并与其它返回相同类型的方法相结合，下面是见证 Optional  奇迹的时刻。

------

## 4.1**创建 Optional  实例**

重申一下，这个类型的对象可能包含值，也可能为空。你可以使用同名方法创建一个空的 Optional。

```java
@Test(expected = NoSuchElementException.class)
public void whenCreateEmptyOptional_thenNull() {
  Optional<User> emptyOpt = Optional.empty();
  emptyOpt.get();
}
```

毫不奇怪，尝试访问 emptyOpt 变量的值会导致 NoSuchElementException。

你可以使用  of() 和 ofNullable() 方法创建包含值的 Optional。两个方法的不同之处在于如果你把 null 值作为参数传递进去，of() 方法会抛出 NullPointerException：

```java
@Test(expected = NullPointerException.class)
public void whenCreateOfEmptyOptional_thenNullPointerException() {
  Optional<User> opt = Optional.of(user);
}
```

你看，我们并没有完全摆脱 NullPointerException。因此，你应该明确对象不为 null  的时候使用 of()。

如果对象即可能是 null 也可能是非 null，你就应该使用 ofNullable() 方法：

```java
Optional<User> opt = Optional.ofNullable(user);
```

------

## 4.2**访问 Optional 对象的值**

从 Optional 实例中取回实际值对象的方法之一是使用 get() 方法：

```java
@Test
public void whenCreateOfNullableOptional_thenOk() {
  String name = "John";
  Optional<String> opt = Optional.ofNullable(name);

  assertEquals("John", opt.get());
}
```

不过，你看到了，这个方法会在值为 null 的时候抛出异常。要避免异常，你可以选择首先验证是否有值：

```java
@Test
public void whenCheckIfPresent_thenOk() {
  User user = new User("john@gmail.com", "1234");
  Optional<User> opt = Optional.ofNullable(user);
  assertTrue(opt.isPresent());
  assertEquals(user.getEmail(), opt.get().getEmail());
}
```

检查是否有值的另一个选择是 ifPresent() 方法。该方法除了执行检查，还接受一个Consumer(消费者) 参数，如果对象不是空的，就对执行传入的 Lambda 表达式：

```java
opt.ifPresent( u -> assertEquals(user.getEmail(), u.getEmail()));
```

这个例子中，只有 user 用户不为 null 的时候才会执行断言。

接下来，我们来看看提供空值的方法。

## 4.3**返回默认值**

Optional 类提供了 API 用以返回对象值，或者在对象为空的时候返回默认值。

这里你可以使用的第一个方法是 orElse()，它的工作方式非常直接，如果有值则返回该值，否则返回传递给它的参数值：

```java
@Test
public void whenEmptyValue_thenReturnDefault() {
  User user = null;
  User user2 = new User("anna@gmail.com", "1234");
  User result = Optional.ofNullable(user).orElse(user2);
  assertEquals(user2.getEmail(), result.getEmail());
}
```

这里 user 对象是空的，所以返回了作为默认值的 user2。

如果对象的初始值不是 null，那么默认值会被忽略：

```java
@Test
public void whenValueNotNull_thenIgnoreDefault() {
  User user = new User("john@gmail.com","1234");
  User user2 = new User("anna@gmail.com", "1234");
  User result = Optional.ofNullable(user).orElse(user2);
  assertEquals("john@gmail.com", result.getEmail());
}
```

第二个同类型的 API 是 orElseGet() —— 其行为略有不同。这个方法会在有值的时候返回值，如果没有值，它会执行作为参数传入的 Supplier(供应者) 函数式接口，并将返回其执行结果：

```java
User result = Optional.ofNullable(user).orElseGet( () -> user2);
```

#### orElse() 和 orElseGet() 的不同之处

乍一看，这两种方法似乎起着同样的作用。然而事实并非如此。我们创建一些示例来突出二者行为上的异同。

我们先来看看对象为空时他们的行为：

```java
@Test
public void givenEmptyValue_whenCompare_thenOk() {
  User user = null;
  logger.debug("Using orElse");
  User result = Optional.ofNullable(user).orElse(createNewUser());
  logger.debug("Using orElseGet");
  User result2 = Optional.ofNullable(user).orElseGet(() -> createNewUser());
}

private User createNewUser() {
  logger.debug("Creating New User");
  return new User("extra@gmail.com", "1234");
}
```

上面的代码中，两种方法都调用了 createNewUser() 方法，这个方法会记录一个消息并返回 User 对象。

代码输出如下：

```java
Using orElse
Creating New User
Using orElseGet
Creating New User
```

由此可见，当对象为空而返回默认对象时，行为并无差异。

我们接下来看一个类似的示例，但这里 Optional  不为空：

```java
@Test
public void givenPresentValue_whenCompare_thenOk() {
  User user = new User("john@gmail.com", "1234");
  logger.info("Using orElse");
  User result = Optional.ofNullable(user).orElse(createNewUser());
  logger.info("Using orElseGet");
  User result2 = Optional.ofNullable(user).orElseGet(() -> createNewUser());
}
```

这次的输出：

```
Using orElse
Creating New User
Using orElseGet
```

这个示例中，两个 Optional  对象都包含非空值，两个方法都会返回对应的非空值。不过，orElse() 方法仍然创建了 User 对象。与之相反，orElseGet() 方法不创建 User 对象。

在执行较密集的调用时，比如调用 Web 服务或数据查询，这个差异会对性能产生重大影响。

## 4.4**返回异常**

除了 orElse() 和 orElseGet() 方法，Optional 还定义了 orElseThrow() API —— 它会在对象为空的时候抛出异常，而不是返回备选的值：

```java
@Test(expected = IllegalArgumentException.class)
public void whenThrowException_thenOk() {
  User result = Optional.ofNullable(user)
    .orElseThrow( () -> new IllegalArgumentException());
}
```

这里，如果 user 值为 null，会抛出 IllegalArgumentException。

这个方法让我们有更丰富的语义，可以决定抛出什么样的异常，而不总是抛出 NullPointerException。

现在我们已经很好地理解了如何使用 Optional，我们来看看其它可以对 Optional 值进行转换和过滤的方法。推荐阅读：[面试题阶段汇总](http://mp.weixin.qq.com/s?__biz=MzIyNDU2ODA4OQ==&mid=2247489003&idx=1&sn=69bf19d900079e204e36df58525654bf&chksm=e80da39ddf7a2a8bf0765f9b95f359a3944fc40c4a192bb3fe9adedfbcd0070cd27234bcf6b3&scene=21#wechat_redirect)

## 4.5**转换值**

有很多种方法可以转换 Optional  的值。我们从 map() 和 flatMap() 方法开始。

先来看一个使用 map() API 的例子：

```java
@Test
public void whenMap_thenOk() {
  User user = new User("anna@gmail.com", "1234");
  String email = Optional.ofNullable(user)
    .map(u -> u.getEmail()).orElse("default@gmail.com");

  assertEquals(email, user.getEmail());
}
```

map() 对值应用(调用)作为参数的函数，然后将返回的值包装在 Optional 中。这就使对返回值进行链试调用的操作成为可能 —— 这里的下一环就是 orElse()。

相比这下，flatMap() 也需要函数作为参数，并对值调用这个函数，然后直接返回结果。

下面的操作中，我们给 User 类添加了一个方法，用来返回 Optional：

```java
public class User {    
  private String position;

  public Optional<String> getPosition() {
    return Optional.ofNullable(position);
  }

  //...
}
```

既然 getter 方法返回 String 值的 Optional，你可以在对 User 的 Optional 对象调用 flatMap() 时，用它作为参数。其返回的值是解除包装的 String 值：

```java
@Test
public void whenFlatMap_thenOk() {
  User user = new User("anna@gmail.com", "1234");
  user.setPosition("Developer");
  String position = Optional.ofNullable(user)
    .flatMap(u -> u.getPosition()).orElse("default");

  assertEquals(position, user.getPosition().get());
}
```

## 4.6**过滤值**

除了转换值之外，Optional  类也提供了按条件“过滤”值的方法。

filter() 接受一个 Predicate 参数，返回测试结果为 true 的值。如果测试结果为 false，会返回一个空的 Optional。

来看一个根据基本的电子邮箱验证来决定接受或拒绝 User(用户) 的示例：

```java
@Test
public void whenFilter_thenOk() {
  User user = new User("anna@gmail.com", "1234");
  Optional<User> result = Optional.ofNullable(user)
    .filter(u -> u.getEmail() != null && u.getEmail().contains("@"));

  assertTrue(result.isPresent());
}
```

如果通过过滤器测试，result 对象会包含非空值。推荐阅读：[面试题阶段汇总](http://mp.weixin.qq.com/s?__biz=MzIyNDU2ODA4OQ==&mid=2247489003&idx=1&sn=69bf19d900079e204e36df58525654bf&chksm=e80da39ddf7a2a8bf0765f9b95f359a3944fc40c4a192bb3fe9adedfbcd0070cd27234bcf6b3&scene=21#wechat_redirect)

## 4.7**Optional 类的链式方法**

为了更充分的使用 Optional，你可以链接组合其大部分方法，因为它们都返回相同类似的对象。

我们使用 Optional  重写最早介绍的示例。

首先，重构类，使其 getter 方法返回 Optional 引用：

```java
public class User {
  private Address address;

  public Optional<Address> getAddress() {
    return Optional.ofNullable(address);
  }

  // ...
}
public class Address {
  private Country country;

  public Optional<Country> getCountry() {
    return Optional.ofNullable(country);
  }

  // ...
}
```

上面的嵌套结构可以用下面的图来表示：

![图片](./%E6%84%9F%E5%8F%97JavaLambda%E4%B9%8B%E7%BE%8E.assets/20210611101933.webp)

现在可以删除 null 检查，替换为 Optional 的方法：

```java
@Test
public void whenChaining_thenOk() {
  User user = new User("anna@gmail.com", "1234");

  String result = Optional.ofNullable(user)
    .flatMap(u -> u.getAddress())
    .flatMap(a -> a.getCountry())
    .map(c -> c.getIsocode())
    .orElse("default");

  assertEquals(result, "default");
}
```

上面的代码可以通过方法引用进一步缩减：

```java
String result = Optional.ofNullable(user)
  .flatMap(User::getAddress)
  .flatMap(Address::getCountry)
  .map(Country::getIsocode)
  .orElse("default");
```

结果现在的代码看起来比之前采用条件分支的冗长代码简洁多了。

## 4.9**Java 9 增强**

我们介绍了 Java 8 的特性，Java 9 为 Optional 类添加了三个方法：or()、ifPresentOrElse() 和 stream()。

or() 方法与 orElse() 和 orElseGet() 类似，它们都在对象为空的时候提供了替代情况。or() 的返回值是由 Supplier 参数产生的另一个 Optional 对象。

如果对象包含值，则 Lambda 表达式不会执行：

```java
@Test
public void whenEmptyOptional_thenGetValueFromOr() {
  User result = Optional.ofNullable(user)
    .or( () -> Optional.of(new User("default","1234"))).get();

  assertEquals(result.getEmail(), "default");
}
```

上面的示例中，如果 user 变量是 null，它会返回一个 Optional，它所包含的 User 对象，其电子邮件为 “default”。

ifPresentOrElse() 方法需要两个参数：一个 Consumer 和一个 Runnable。如果对象包含值，会执行 Consumer 的动作，否则运行 Runnable。

如果你想在有值的时候执行某个动作，或者只是跟踪是否定义了某个值，那么这个方法非常有用：

```java
Optional.ofNullable(user).ifPresentOrElse( u -> logger.info("User is:" + u.getEmail()),
                                          () -> logger.info("User not found"));
```

最后介绍的是新的 stream() 方法，它通过把实例转换为 Stream 对象，让你从广大的 Stream API 中受益。如果没有值，它会得到空的 Stream；有值的情况下，Stream 则会包含单一值。

我们来看一个把 Optional 处理成 Stream 的例子：

```java
@Test
public void whenGetStream_thenOk() {
  User user = new User("john@gmail.com", "1234");
  List<String> emails = Optional.ofNullable(user)
    .stream()
    .filter(u -> u.getEmail() != null && u.getEmail().contains("@"))
    .map( u -> u.getEmail())
    .collect(Collectors.toList());

  assertTrue(emails.size() == 1);
  assertEquals(emails.get(0), user.getEmail());
}
```

这里对 Stream 的使用带来了其 filter()、map() 和 collect() 接口，以获取 List。

## 4.10 **Optional  应该怎样用？**

在使用 Optional 的时候需要考虑一些事情，以决定什么时候怎样使用它。

重要的一点是 Optional 不是 Serializable。因此，它不应该用作类的字段。

如果你需要序列化的对象包含 Optional 值，Jackson 库支持把 Optional 当作普通对象。也就是说，Jackson 会把空对象看作 null，而有值的对象则把其值看作对应域的值。这个功能在 jackson-modules-java8 项目中。

------

它在另一种情况下也并不怎么有用，就是在将其类型用作方法或构建方法的参数时。这样做会让代码变得复杂，完全没有必要：

```java
User user = new User("john@gmail.com", "1234", Optional.empty());
```

使用重载方法来处理非要的参数要容易得多。

Optional 主要用作返回类型。在获取到这个类型的实例后，如果它有值，你可以取得这个值，否则可以进行一些替代行为。

Optional 类有一个非常有用的用例，就是将其与流或其它返回 Optional 的方法结合，以构建流畅的API。

我们来看一个示例，使用 Stream 返回 Optional 对象的 findFirst() 方法：

```java
@Test
public void whenEmptyStream_thenReturnDefaultOptional() {
  List<User> users = new ArrayList<>();
  User user = users.stream().findFirst().orElse(new User("default", "1234"));

  assertEquals(user.getEmail(), "default");
}
```

## **总结**

Optional 是 Java 语言的有益补充 —— 它旨在减少代码中的 NullPointerExceptions，虽然还不能完全消除这些异常。

它也是精心设计，自然融入 Java 8 函数式支持的功能。

总的来说，这个简单而强大的类有助于创建简单、可读性更强、比对应程序错误更少的程序。