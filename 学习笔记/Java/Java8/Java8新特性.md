## **主要内容**

1. Lambda 表达式

2. 函数式接口

3. 方法引用与构造器引用

4. Stream API

5. 接口中的默认方法与静态方法

6. 新时间日期API

7. 其他新特性

## Java 8新特性简介

⚫ 速度更快

⚫ 代码更少（增加了新的语法 **Lambda** **表达式**） 

⚫ 强大的 **Stream API** 

⚫ 便于并行

⚫ 最大化减少空指针异常 Optional 

其中最为核心的为 Lambda 表达式与Stream API

## 1-Lambda表达式

### 为什么使用Lambda表达式

Lambda 是一个**匿名函数**，我们可以把 Lambda表达式理解为是**一段可以传递的代码**（将代码像数据一样进行传递）。可以写出更简洁、更灵活的代码。作为一种更紧凑的代码风格，使Java的语言表达能力得到了提升。

### Lambda表达式

#### 从匿名类到 Lambda 的转换

```java
//匿名内部类
Runnable runnable=new Runnable() {
  @Override
  public void run() {
    System.out.println("hello lamda");
  }
};
runnable.run();
//Lambda表达式
Runnable runnable1=()-> System.out.println("hello world");;
runnable1.run();
```

```java
Comparator<String > com=new Comparator<String>() {
  @Override
  public int compare(String o1, String  o2) {
    return Integer.compare(o1.length(),o2.length());
  }
};
TreeSet treeSet=new TreeSet(com);

TreeSet<String> treeSet1=new TreeSet<String >((o1, o2) ->  Integer.compare(o1.length(),o2.length()));
```

### Lambda表达式语法

Lambda 表达式在Java 语言中引入了一个新的语法元素和操作符。**这个操作符为 “->” ， 该操作符被称为 Lambda 操作符或剪头操作符。它将 Lambda 分两个部分：**

**左侧：**指定了 Lambda 表达式需要的所有参数

**右侧：**指定了 Lambda 体，即 Lambda 表达式要执行的功能。

语法格式一：无参，无返回值，Lambda体只需一条语句

```java
Runnable runnable1=()-> System.out.println("hello world");;
```

语法格式二：Lambda需要一个参数

```java
Consumer<String> consumer=(x)-> System.out.println(x);
consumer.accept("wowosong");
```

语法格式三：Lambda只需要一个参数时，参数的小括号可以省略

```java
Consumer<String> consumer=x-> System.out.println(x);
consumer.accept("wowosong");
```

语法格式四：Lambda需要两个参数，并且有返回值

```java
BinaryOperator<Long> bo=(x,y)->{
  System.out.println("方式");
  return x+y;
};
System.out.println(bo.apply(1L,10L));
```

语法格式五：当Lambda体只有一条语句时，return与大括号可以省略

```java
BinaryOperator<Long> bo=(x,y)->x+y
System.out.println(bo.apply(1L,10L));
```

语法格式六：

```java
BinaryOperator<Long> bo=(Long x,Long y)->{
  //数据类型可以省略，因为可由编译器推断得出，称为“类型推断”
  System.out.println("方式");
  return x+y;
};
```

### **类型推断**

上述 Lambda 表达式中的参数类型都是由编译器推断得出的。Lambda 表达式中无需指定类型，程序依然可以编译，这是因为 javac 根据程序的上下文，在后台推断出了参数的类型。Lambda 表达式的类型依赖于上下文环境，是由编译器推断出来的。这就是所谓的 **“类型推断”**

## 2-函数式接口

### 什么是函数式接口

只包含一个抽象方法的接口，称为**函数式接口**。 

⚫ 你可以通过 Lambda 表达式来创建该接口的对象。（若 Lambda 表达式抛出一个受检异常，那么该异常需要在目标接口的抽象方法上进行声明）。

⚫ 我们可以在任意函数式接口上使用 **@FunctionalInterface** 注解，这样做可以检查它是否是一个函数式接口，同时 javadoc 也会包含一条声明，说明这个接口是一个函数式接口。

### 自定义函数式接口

```java
@FunctionalInterface
public interface MyFunction<> {
  public double getValue();
}
```

函数式接口中使用泛型：

```java
@FunctionalInterface
public interface MyFunction<T> {
  public T getValue(T t);
}
```

作为参数传递Lambda表达式

```java
public Object strHandler(MyFunction mf, String string){
  return mf.getValue(string);
}
```

作为参数传递Lambda表达式：

```java
@Test
public void  test4(){
  String test = (String) strHandler((x) ->x.toString().toUpperCase(), "test");
  System.out.println(test);
}
```

作为参数传递 Lambda 表达式：为了将 Lambda 表达式作为参数传递，接收Lambda 表达式的参数类型必须是与该 Lambda 表达式兼容的函数式接口的类型。

###  Java内置四大核心函数式接口

| 函数式接口             | 参数类型 | 返回类型 | 用途                                                         |
| ---------------------- | -------- | -------- | ------------------------------------------------------------ |
| Consumer<T>消费性接口  | T        | void     | 对类型为T的对应应用操作，包括方法：void accept(T t)          |
| Supplier<T>供给型接口  | 无       | T        | 返回类型为T的对象，包含方法：T get();                        |
| Function<T>函数型接口  | T        | R        | 对类型为T的对象应用操作，并返回结果。结果是R类型的对象。包含方法：R apply(T t); |
| Predicate<T>断定型接口 | T        | boolean  | 确定类型为T的对象是否满足某约束，并返回boolean值。包含方法boolean test(T t); |

#### 消费性接口

```java
public void  test5(){
  happy(1000,(x)->{
    System.out.println(x+":"+x*2);
  });

}
public void happy(double money,Consumer<Double> consumer){
  consumer.accept(money);
}
```

#### 供给型接口

```java
@Test
public void  test6(){
  List<Integer> num = getNum(100, () -> (int) (Math.random() * 100));
  num.forEach(System.out::println);

}
public List<Integer> getNum(int num, Supplier<Integer> supplier){
  List<Integer> list=new ArrayList<>();

  for (int i = 0; i <num ; i++) {
    Integer integer = supplier.get();
    list.add(integer);
  }
  return list;
}
```

####  函数型接口

```java
@Test
public  void test7(){
  String string = handlerString("wowosong", (x) -> {
    return x.toUpperCase();
  });
  System.out.println(string);

}
public String handlerString(String string, Function<String,String> function){
  return function.apply(string);
}
```

#### 断定型接口

```java
@Test
public void test8(){
  List<String> list= Arrays.asList("111","221111111111112","333");
  List<String> list1 = filterString(list, (x) -> x.length() > 10);
  for (String s : list1) {
    System.out.println(s);
  }
}
public List<String> filterString(List<String> list, Predicate<String> predicate){
  List<String> list1=new ArrayList<>();
  for (String s : list) {
    if(predicate.test(s)){
      list1.add(s);
    }
  }
  return  list1;
}
```

#### 其他接口

| 函数式接口                                             | 参数类型                 | 返回类型                 | 用途                                                         |
| ------------------------------------------------------ | ------------------------ | ------------------------ | ------------------------------------------------------------ |
| BiFunction<T,U,R>                                      | T,U                      | R                        | 对类型为T,U参数应用操作，返回R类型的结果。包含方法为R apply(T t,U u); |
| UnaryOperator<T> (Funciton子接口)                      | T                        | T                        | 对类型为T的对象进行一元运算，并返回T类型的结果。包含方法为T apply(T t); |
| BinaryOperator<T>(BiFunction子接口)                    | T,T                      | T                        | 对类型为T的对象进行二元运算，并返回T类型的结果。包含方法为 T apply(T t1,T t2); |
| BiConsumer<T,U>                                        | T,U                      | void                     | 对类型为T，U参数应用操作。包含方法为void accept(T t,U u)     |
| ToIntFunction<T> ToLongFunction<T> ToDoubleFunction<T> | T                        | int <br/>long<br/>double | 分别计算int/long/double值的函数                              |
| IntFunction<R> <br> LongFunction<R> DoubleFunction<R>  | int <br/>long<br/>double | R                        | 参数分别为int/long/double类型的函数                          |

## 3-方法引用与构造器引用

### 方法引用

当要传递给Lambda体的操作，已经有实现的方法了，可以使用方法引用！ （**实现抽象方法的参数列表，必须与方法引用方法的参数列表保持一致！**）方法引用：使用操作符 “**::**” 将方法名和对象或类的名字分隔开来。

如下三种主要使用情况： 

⚫ **对象::实例方法**

```java
Consumer<Integer> consumer=(x)-> System.out.println(x);
Consumer<Integer> consumer1=System.out::println;
consumer1.accept(1111);
consumer.accept(11);
```

⚫ **类::静态方法**

```java
Comparator<Integer> comparator=(x,y)->Integer.compare(x,y);
Comparator<Integer> comparator1=Integer::compare;
```

⚫ **类::实例方法**

```java
BiPredicate<String,String> biPredicate=(x,y)->x.equals(y);
BiPredicate<String,String> biPredicate1=String::equals;
```

注意：(1)**Lambda体中调用方法的参数列表与返回值类型要与函数式接口中抽象方法的函数列表和返回值类型保持一致**

(2)**当需要引用方法的第一个参数是调用对象，并且第二个参数是需要引用方法的第二个参数(或无参数)时：ClassName::methodName**

### **构造器引用**

**格式：** **ClassName::new** 

与函数式接口相结合，自动与函数式接口中方法兼容。可以把构造器引用赋值给定义的方法，与构造器参数列表要与接口中抽象方法的参数列表一致！

```java
Supplier<Employee> supplier=()->new Employee("1",30,"wowosong");
Supplier<Employee> supplier1=Employee::new;
Employee employee = supplier.get();
Employee employee1 = supplier1.get();
System.out.println(employee1);
```

### **数组引用**

**格式：** type[] :: new

```java
Function<Integer,Integer[]> function=(x)->new Integer[x];
Function<Integer,Integer[]> function1=Integer[]:: new;
Integer[] apply1 = function.apply(11);
System.out.println(apply1.length);
```

## 4-强大的Stream API

了解Stream

Java8中有两大最为重要的改变**。第一个是 Lambda 表达式；另外一个则是 Stream API(java.util.stream.\*)。**Stream 是 Java8 中处理集合的关键抽象概念，它可以指定你希望对集合进行的操作，可以执行非常复杂的查找、过滤和映射数据等操作。使用Stream API 对集合数据进行操作，就类似于使用 SQL 执行的数据库查询。也可以使用 Stream API 来并行执行操作。简而言之，Stream API 提供了一种高效且易于使用的处理数据的方式。

### 什么是Stream

**流(Stream) 到底是什么呢？**

是数据渠道，用于操作数据源（集合、数组等）所生成的元素序列。 

**“集合讲的是数据，流讲的是计算！”**

**注意：** 

①Stream 自己不会存储元素。 

②Stream 不会改变源对象。相反，他们会返回一个持有结果的新Stream。 

③Stream 操作是延迟执行的。这意味着他们会等到需要结果的时候才执行。

### Stream的操作三个步骤

⚫ **创建 Stream**

一个数据源（如：集合、数组），获取一个流

⚫ **中间操作**

一个中间操作链，对数据源的数据进行处理

⚫ **终止操作(终端操作)**

一个终止操作，执行中间操作链，并产生结果

![image-20210810204319399](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071306414.png)

#### 创建Stream

Java8 中的 Collection 接口被扩展，提供了

两个获取流的方法： 

⚫ default Stream<E> stream() : 返回一个顺序流

⚫ default Stream<E> parallelStream() : 返回一个并行流

```java
//1.通过Collection系列集合提供的stream或parallelstream()
List<String> list=new ArrayList<>();
Stream<String> stream = list.stream();
Stream<String> stringStream1 = list.parallelStream();
```

**由数组创建流**

**Java8 中的 Arrays 的静态方法 stream() 可以获取数组流：** 

⚫ static <T> Stream<T> stream(T[] array): 返回一个流

**重载形式，能够处理对应基本类型的数组：** 

⚫ public static IntStream stream(int[] array)

⚫ public static LongStream stream(long[] array)

⚫ public static DoubleStream stream(double[] array)

```java
//2.通过Arrays中的静态方法stream（）获得数组流
Employee[] employees=new Employee[10];
Stream<Employee> employeeStream = Arrays.stream(employees);
```

**由值创建流**

**可以使用静态方法 Stream.of(), 通过显示值**

创建一个流。它可以接收任意数量的参数。 

⚫ public static<T> Stream<T> of(T... values) : 返回一个流

```java
//3.通过Stream类中的静态方法of（）
Stream<String> stringStream = Stream.of("111", "222", "333");
```

**由函数创建流：创建无限流**

可以使用静态方法 Stream.iterate() 和Stream.generate(), 创建无限流。 

⚫ 迭代

public static<T> Stream<T> iterate(final T seed, final UnaryOperator<T> f) 

⚫ 生成

public static<T> Stream<T> generate(Supplier<T> s) :

```java
//4.创建无限流
Stream<Object> generate = Stream.generate(()->Math.random());
Stream<Integer> iterate = Stream.iterate(0, (x) -> x + 2);
iterate.limit(10).forEach(System.out::println);
```

#### **Stream** **的中间操作**

**多个中间操作可以连接起来形成一个流水线，除非流水线上触发终止操作，否则中间操作不会执行任何的处理！而在终止操作时一次性全部处理，称为“惰性求值”。**

内部迭代：由Stream API完成

**筛选与切片**

| 方法                 | 描述                                                         |
| -------------------- | ------------------------------------------------------------ |
| filter(Peredicate p) | 接收Lambda,从流中排除某些元素。                              |
| distinct()           | 筛选，通过流所生成元素的hashCode()和equals()去除重复元素。   |
| limit(long maxSize)  | 截断流，使其元素不超过给定数量。                             |
| skip(long n)         | 跳过元素，返回一个扔掉了前n个元素的流。若流中元素不足n个，则返回一个空流。与limit（n)互补。 |

**映射**

| 方法                            | 描述                                                         |
| ------------------------------- | ------------------------------------------------------------ |
| map(Function f)                 | 接收一个函数作为参数，该函数会被应用到每个元素上，并将其映射成一个新的元素。 |
| mapToDouble(ToDoubleFunction f) | 接收一个函数作为参数，该函数会被应用到每个元素上，产生一个新的DoubleStream。 |
| mapToInt(ToIntFunction f)       | 接收一个函数作为参数，该函数会被应用到每个元素上，产生一个新的IntStream。 |
| mapToLong(ToLongFunction f)     | 接收一个函数作为参数，该函数会被应用到每个元素上，产生一个新的LongStream。 |
| flatMap(Function f)             | 接收一个函数作为参数，将流中的每个值都换成另一个流，然后把所有流连接成一个流 |

```java
List<Integer> collect1 = employeeList.stream().map(employee -> {
  return employee.getAge();
}).collect(Collectors.toList());
```

**排序**

| 方法                   | 描述                               |
| ---------------------- | ---------------------------------- |
| sorted                 | 产生一个新流，其中按自然顺序排序   |
| sorted(Compartor comp) | 产生一个新流，其中按比较器顺序排序 |

```java
Stream<Employee> sorted = employeeList.stream().sorted((x, y) -> Integer.compare(x.getAge(), y.getAge()));
```

#### **Stream** **的终止操作**

终端操作会从流的流水线生成结果。其结果可以是任何不是流的值，例如：List、Integer，甚至是 void 。

**查找与匹配**

| 方法                   | 匹配                     |
| ---------------------- | ------------------------ |
| allMatch(Predicate p)  | 检查是否匹配所有元素     |
| anyMatch(Predicate p)  | 检查是否至少匹配一个元素 |
| noneMatch(Predicate p) | 检查是否没有匹配所有元素 |
| findFirst()            | 返回第一个元素           |
| findAny()              | 返回当前流中的任意元素   |

```java
Optional<Integer> first = collect1.stream().findFirst();
System.out.println(first);
```

**最大与最小值**

| 方法                | 描述                                                         |
| ------------------- | ------------------------------------------------------------ |
| count()             | 返回流中元素总数                                             |
| max(Comparator c)   | 返回流中最大值                                               |
| min(Comparator c)   | 返回流中最小值                                               |
| forEach(Consumer c) | 内部迭代（使用Collection接口需要用户去做迭代，称为外部迭代。相反，Stream API使用内部迭代---它帮你把迭代做了） |

```java
Optional<Employee> max = employeeList.stream().max((x, y) -> Integer.compare(x.getAge(), y.getAge()));
Optional<Integer> min = employeeList.stream().map(Employee::getAge).min(Integer::compareTo);
```

**规约**

| 方法                             | 描述                                                    |
| -------------------------------- | ------------------------------------------------------- |
| reduce(T iden，BinaryOperator b) | 可以将流中元素反复结合起来，得到一个值。返回T           |
| reduce(BinaryOperator b)         | 可以将流中元素反复结合起来，得到一个值。返回Optional<T> |

备注：map和reduce的连接通常称为map-reduce模式，因Google用它来进行网络搜索而出名。

```java
Stream<String> stringStream = Stream.of("111", "222", "333");
String reduce = stringStream.reduce("", (x, y) -> x + y);
System.out.println(reduce);
Optional<Integer> reduce1 = employeeList.stream().map(Employee::getAge).reduce(Integer::sum);
```

**收集**

| 方法                 | 描述                                                         |
| -------------------- | ------------------------------------------------------------ |
| collect(Collector c) | 将流转换为其他形式。接收一个Collector接口的实现，用于给Stream中元素做汇总的方法 |

Collector 接口中方法的实现决定了如何对流执行收集操作(如收集到 List、Set、Map)。但是 Collectors 实用类提供了很多静态方法，可以方便地创建常见收集器实例，具体方法与实例如下表：

![image-20210810223247618](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071306120.png)

```java
List<String> collect2 = employeeList.stream().map(Employee::getName).collect(Collectors.toList());
System.out.println(collect2);
Double collect3 = employeeList.stream().collect(Collectors.averagingDouble(Employee::getAge));
System.out.println(collect3);
Double collect4 = employeeList.stream().collect(Collectors.summingDouble(Employee::getAge));
System.out.println(collect4);
DoubleSummaryStatistics collect5 = employeeList.stream().collect(Collectors.summarizingDouble(Employee::getAge));
System.out.println(collect5);
```

![image-20210810224030737](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071306509.png)

```java
Optional<Employee> collect6 = employeeList.stream().collect(Collectors.maxBy((x, y) -> Double.compare(x.getAge(), y.getAge())));
System.out.println(collect6);
Optional<Employee> collect7 = employeeList.stream().collect(Collectors.minBy((x, y) -> Double.compare(x.getAge(), y.getAge())));
System.out.println(collect7);
Map<Integer, List<Employee>> collect8 = employeeList.stream().collect(Collectors.groupingBy(Employee::getAge));
System.out.println(collect8);
Map<Boolean, List<Employee>> collect9 = employeeList.stream().collect(Collectors.partitioningBy(employee -> employee.getAge() > 40));
System.out.println(collect9);
String collect10 = employeeList.stream().map(Employee::getName).collect(Collectors.joining(","));
System.out.println(collect10);
```

### 并行流与串行流

**并行流**就是把一个内容分成多个数据块，并用不同的线程分别处理每个数据块的流。

Java 8 中将并行进行了优化，我们可以很容易的对数据进行并行操作。Stream API 可以声明性地通过 parallel() 与sequential() 在并行流与顺序流之间进行切换。

#### 了解 Fork/Join 框架

**Fork/Join 框架：**就是在必要的情况下，将一个大任务，进行拆分(fork)成若干个小任务（拆到不可再拆时），再将一个个的小任务运算的结果进行 join 汇总. 

![image-20210811211918682](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071306953.png)

#### Fork/Join 框架与传统线程池的区别

采用 “工作窃取”模式（work-stealing）：

当执行新的任务时它可以将其拆分分成更小的任务执行，并将小任务加到线程队列中，然后再从一个随机线程的队列中偷一个并把它放在自己的队列中。

相对于一般的线程池实现,fork/join框架的优势体现在对其中包含的任务的处理方式上.在一般的线程池中,如果一个线程正在执行的任务由于某些原因无法继续运行,那么该线程会处于等待状态.而在fork/join框架实现中,如果某个子问题由于等待另外一个子问题的完成而无法继续运行.那么处理该子问题的线程会主动寻找其他尚未运行的子问题来执行.这种方式减少了线程的等待时间,提高了性能.

## 5-新时间日期API

### 使用LocalDate、LocalTime、LocalDateTime

⚫ LocalDate、LocalTime、LocalDateTime 类的实例是不可变的对象，分别表示使用 ISO-8601日历系统的日期、时间、日期和时间。它们提供了简单的日期或时间，并不包含当前的时间信 息。也不包含与时区相关的信息。

```java
SimpleDateFormat sd =new SimpleDateFormat("yyyy-MM-dd");//存在线程安全问题
LocalDateTime ldf=LocalDateTime.now();
System.out.println(ldf);
```

![image-20210811224711342](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071306852.png)

### **Instant** **时间戳**

⚫ 用于“时间戳”的运算。它是以Unix元年(传统的设定为UTC时区1970年1月1日午夜时分)开始所经历的描述进行运算

```java
Instant instant=Instant.now();
System.out.println(instant);
OffsetDateTime offsetDateTime = instant.atOffset(ZoneOffset.ofHours(8));
System.out.println(offsetDateTime);
```

### **Duration** **和** **Period**

⚫ **Duration:用于计算两个“时间”间隔**

```java
Instant instant=Instant.now();
System.out.println(instant);
OffsetDateTime offsetDateTime = instant.atOffset(ZoneOffset.ofHours(8));
System.out.println(offsetDateTime);
try {
  Thread.sleep(1000);
}catch (Exception e){

}
Instant instant1 = Instant.now();
long l = Duration.between(instant, instant1).toMillis();
System.out.println(l);
```

⚫ **Period:用于计算两个“日期”间隔**

```java
LocalDate localDate=LocalDate.of(2021,6,21);
LocalDate localDate1=LocalDate.now();
Period between = Period.between(localDate, localDate1);
System.out.println(between.getMonths());
```

### **日期的操纵**

⚫ TemporalAdjuster : 时间校正器。有时我们可能需要获取例如：将日期调整到“下个周日”等操作。 

⚫ TemporalAdjusters: 该类通过静态方法提供了大量的常用 TemporalAdjuster 的实现。

例如获取下个周日：

```java
LocalDate with = LocalDate.now().with(TemporalAdjusters.previous(DayOfWeek.MONDAY));
System.out.println("-----"+with);
```

### **解析与格式化**

java.time.format.DateTimeFormatter类：该类提供了三种格式化方法： 

⚫ 预定义的标准格式

⚫ 语言环境相关的格式

⚫ 自定义的格式

```java
DateTimeFormatter dft =DateTimeFormatter.ISO_DATE;
LocalDateTime now = LocalDateTime.now();
String format1 = now.format(dft);
System.out.println(format1);
DateTimeFormatter dateTimeFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd:HH:mm:ss");
String parse = dateTimeFormatter.format(now);
System.out.println(parse);
LocalDateTime parse1 = now.parse(parse, dateTimeFormatter);
System.out.println(parse1);
```

### **时区的处理**

⚫ Java8 中加入了对时区的支持，带时区的时间为分别为：ZonedDate、ZonedTime、ZonedDateTime，其中每个时区都对应着 ID，地区ID都为 “{区域}/{城市}”的格式

例如 ：Asia/Shanghai 等

ZoneId：该类中包含了所有的时区信息

getAvailableZoneIds() : 可以获取所有时区时区信息

of(id) : 用指定的时区信息获取ZoneId 对象

![image-20210811232218744](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071306727.png)

```java
Set<String> availableZoneIds = ZoneId.getAvailableZoneIds();
System.out.println(availableZoneIds);
LocalDateTime now1 = LocalDateTime.now(ZoneId.of("America/Cuiaba"));
System.out.println(now1);
```

## 6-**Optional** **类**

**Optional<T> 类(java.util.Optional) 是一个容器类，代表一个值存在或不存在，原来用 null 表示一个值不存在，现在 Optional 可以更好的表达这个概念。并且可以避免空指针异常。**

**常用方法：**

Optional.of(T t) : 创建一个 Optional 实例

Optional.empty() : 创建一个空的 Optional 实例

Optional.ofNullable(T t):若 t 不为 null,创建 Optional 实例,否则创建空实例

isPresent() : 判断是否包含值

orElse(T t) : 如果调用对象包含值，返回该值，否则返回t 

orElseGet(Supplier s) :如果调用对象包含值，返回该值，否则返回 s 获取的值

map(Function f): 如果有值对其处理，并返回处理后的Optional，否则返回 Optional.empty()

flatMap(Function mapper):与 map 类似，要求返回值必须是Optional

```java
Optional<Employee> optional = Optional.of(new Employee());
Employee employee = optional.get();
System.out.println(employee);
Optional<Employee> optional = Optional.of(new Employee());
if (optional.isPresent()) {
  optional.get();
  optional.orElse(new Employee());
}
Employee employee = optional.get();
System.out.println(employee);
Optional<Integer> integer = optional.map(Employee::getAge);
System.out.println(integer.get());
```

## 7-接口中的默认方法与静态方法

### **接口中的默认方法**

**Java 8中允许接口中包含具有具体实现的方法，该方法称为“默认方法”，默认方法使用 default 关键字修饰。**

```java
interface MyFunc<T> {
  T func(int a);
  default String getName(){
    return "Hello Java8";
  }
}
```

**接口默认方法的”类优先”原则**

**若一个接口中定义了一个默认方法，而另外一个父类或接口中又定义了一个同名的方法时**

⚫ 选择父类中的方法。如果一个父类提供了具体的实现，那么接口中具有相同名称和参数的默认方法会被忽略。 

⚫ 接口冲突。如果一个父接口提供一个默认方法，而另一个接口也提供了一个具有相同名称和参数列表的方法（不管方法是否是默认方法），那么**必须覆盖该方法来解决冲突**

```java
//接口默认方法的“类优先”原则
interface MyFunc{
  default String getName(){
    return "Hello Java8";
  }
}
interface Named{
  default String getName(){
    return "Hello atguigu";
  }
}
class MyClass implements MyFunc,Named{
  default String getName(){
    return Named.super.getName();
  }
}
```

### **接口中的静态方法**

```java
//Java8中，接口中允许添加静态方法。
// 例如：
interface Named{
  public Integer myFun();
  default String getName(){
    return "Hello atguigu";
  }
  static void show(){
    System.out.println("Hello lambda");
  }
}
```

## 8-**重复注解与类型注解**

**重复注解与类型注解**

Java 8对注解处理提供了两点改进：可重复的注解及可用于类型的注解。

```java
@Target({ElementType.TYPE, ElementType.METHOD, ElementType.FIELD, ElementType.CONSTRUCTOR, ElementType.LOCAL_VARIABLE, ElementType.PARAMETER})
@Retention(RetentionPolicy.RUNTIME)
public @interface MyAnnations {
  MyAnnation[] value();
}
```

```java
@Repeatable(MyAnnations.class)
@Target({ElementType.TYPE,ElementType.METHOD,ElementType.FIELD,ElementType.CONSTRUCTOR,ElementType.LOCAL_VARIABLE,ElementType.PARAMETER})
@Retention(RetentionPolicy.RUNTIME)
public @interface MyAnnation {
  String value() default "atguigu";
}
```

```java
@Test
public void testAnnation() throws NoSuchMethodException {
  Class<TestLamda> clazz = TestLamda.class;
  Method show = clazz.getMethod("Show");
  MyAnnation[] annotationsByType = show.getAnnotationsByType(MyAnnation.class);
  Arrays.stream(annotationsByType).forEach(System.out::println);
}
@MyAnnation(value = "hello")
@MyAnnation(value = "world")
public void Show(@MyAnnation("abc") String id){
  System.out.println("show ...");
}
```

