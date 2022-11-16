# Java基础

![img](./Java%E5%BC%80%E5%8F%91%E6%8C%87%E5%8D%97.assets/20210610222515.jpeg)

## 集合

### [一、集合是什么 ?](https://java.springlearn.cn/#/BasicJava/集合是什么?id=一、集合是什么-)

#### [1. 集合知识概念](https://java.springlearn.cn/#/BasicJava/集合是什么?id=_1-集合知识概念)

前面我们学习过了，Java中的基本类型，任何单一的数据都可以用基本类型来表达，这些单一的基本类型被统一的组合或者管理起来的就是集合，或者叫容器也可以。

**举例:**

我们用数据来表示一个学校的存在。首先我们先来分析一波，学校的组成。

- 学校的组成 = 班级的集合
- 班级 = 学生的集合

前面我们说了，单一的数据类型都可以用基本类型来表示。那么我们用 `String` 类型来表示学生的名字。

A班一共有3个学生(小明，小红，小张)。那么小明等人就可以用基本类型来表示，而A班就可以用集合来表示。 S学校一共有2个班级(A,B)。 因为A和B都是学生的集合,所以A、B都是集合。而S学校同样是A、B的集合。

#### [2. Java中的具体体现](https://java.springlearn.cn/#/BasicJava/集合是什么?id=_2-java中的具体体现)

1. 集合类存放于 `java.util` 包中

2. 集合类型主要有3种：`list` (列表）、`set` (集）、和 `map` (映射)。

   **后面会详细讲解**

   1. **list 集合允许出现重复的元素**
   2. **Set 集合中元素不能是重复的**
   3. **map 是一个特殊集合容器，是有key-value组成的，我们也可以叫字典。因为它跟字典一样，可以根据key，来找到对应的数据value。

### [二、用伪代码构建一个学校](https://java.springlearn.cn/#/BasicJava/集合是什么?id=二、用伪代码构建一个学校)

#### [1. 定义A班级学生](https://java.springlearn.cn/#/BasicJava/集合是什么?id=_1-定义a班级学生)

```java
 //1. 定义A班级里面的学生
  String student_a_1 = "小明a";
  String student_a_2 = "小红a";
  String student_a_3 = "小张a";
```

#### [2. 定义A班级并添加学生](https://java.springlearn.cn/#/BasicJava/集合是什么?id=_2-定义a班级并添加学生)

```java
  //2. 定义A班级
  List<String> class_a = new ArrayList<>();
  class_a.add(student_a_1);
  class_a.add(student_a_2);
  class_a.add(student_a_3);
```

#### [3. 定义B班级学生](https://java.springlearn.cn/#/BasicJava/集合是什么?id=_3-定义b班级学生)

```java
  //3. 定义B班级里面的学生
  String student_b_1 = "小明b";
  String student_b_2 = "小红b";
  String student_b_3 = "小张b";
```

#### [4. 定义B班级并添加学生](https://java.springlearn.cn/#/BasicJava/集合是什么?id=_4-定义b班级并添加学生)

```java
  //4. 定义B班级
  List<String> class_b = new ArrayList<>();
  class_b.add(student_b_1);
  class_b.add(student_b_2);
  class_b.add(student_b_3);
```

#### [5. 定义学校并添加AB两个班级](https://java.springlearn.cn/#/BasicJava/集合是什么?id=_5-定义学校并添加ab两个班级)

```java
  //5. 定义学校
  List<List> school = new ArrayList<>();
  school.add(class_a);
  school.add(class_b);
```

### [三、集合实现类及常用API ?](https://java.springlearn.cn/#/BasicJava/集合是什么?id=三、集合实现类及常用api-)

Java 集合框架主要包括两种类型的容器，一种是集合（Collection），存储一个元素集合，另一种是Map，存储键/值对映射。

![img](./Java%E5%BC%80%E5%8F%91%E6%8C%87%E5%8D%97.assets/20210611102637-16677959466452.png)

#### [1. Collection](https://java.springlearn.cn/#/BasicJava/集合是什么?id=_1-collection)

Collection 接口又有 3 种子类型，List、Set 和 Queue。其中List和Set是最长用的。Queue相对来说用的比较少，作为入门基本学习前两个已经够用了。

因为List和Set都是实现自Collection，所以List和Set的API是一样的，只要初学者记住Collection的常用方法和List和Set各个实现类的特点即可掌握。

**List 和 Set 区别**

| 类型 | 是否有序(插入顺序，并不是排序的意思) | 是否允许重复 |
| ---- | ------------------------------------ | ------------ |
| List | 有序                                 | 允许         |
| Set  | 无序 ( `LinkedHashSet` 有序)         | 不允许       |

**List实现类特点**

| 类型       | 是否有序 | 允许重复 | 原理             | 特点                       | 线程安全 |
| ---------- | -------- | -------- | ---------------- | -------------------------- | -------- |
| ArrayList  | 有序     | 允许     | 底层是数组实现   | 查询修改快，增删慢         | 不安全   |
| LinkedList | 有序     | 允许     | 底层是链表实现的 | 查询修改慢，增删快         | 不安全   |
| Vertor     | 有序     | 允许     | 底层是数组实现   | 查询修改快，增删慢，效率低 | 安全     |

**Set实现类特点**

| 类型          | 是否有序 | 允许重复 | 原理                 | 特点                            | 线程安全 |
| ------------- | -------- | -------- | -------------------- | ------------------------------- | -------- |
| LinkedHashSet | 有序     | 不允许   | 底层是Hash和列表实现 | 具有 HashSet 的查找效率，且有序 | 不安全   |
| HashSet       | 有序     | 不允许   | 底层是哈希算法实现的 | 无序，效率高                    | 不安全   |
| TreeSet       | 有序     | 不允许   | 基于红黑树实现       | 支持排序,查询效率低于Hash       | 不安全   |

**Collection常用API**

| 方法名称 | 说明                   |
| -------- | ---------------------- |
| 添加     | add                    |
| 删除     | remove                 |
| 修改     | 通过删除和在此添加实现 |
| 查询     | get索引                |
| 查询全部 | 迭代器或者增强for      |

**总结**

- **安全的不高效，高效的不安全。要根据使用环境确定使用哪一个。**
- **一般开发中List基本都是 `ArrayList`,而 `Set` 使用 `HashSet`。**

#### [2. Map](https://java.springlearn.cn/#/BasicJava/集合是什么?id=_2-map)

Map是一种特殊的集合容器，它的数据结构是key-value的形式，类似于字典。Map的主要作用就是作为字典使用,通过key来查询value比如上面的例子，就可以根据学生的名字，来找到学生具体所在的班级，我们对Map的学习主要学习其各个实现类的特点和常用API即可

```java
public class Test {
    public static void main(String[] args) {                                         
        //1. 声明一个学校,key来表示学生姓名，value来表示学生所在的班级
        Map<String, String> school = new ConcurrentHashMap<>();
        //2. 初始化数据
        school.put("小明", "三年二班");
        school.put("小红", "三年一班");
        school.put("小张", "三年三班");
          //3. 获取小明的班级
        System.out.println(school.get("小明"));
    }
}
```

**实现类特点**

| 类型              | 是否有序 | 允许重复       | 原理                        | 特点                                 | 线程安全 |
| ----------------- | -------- | -------------- | --------------------------- | ------------------------------------ | -------- |
| HashMap           | 无序     | 重复时覆盖旧值 | 底层数组+链表实现           | 可以存储null键和null值，效率最高     | 不安全   |
| HashTable         | 无序     | 重复时覆盖旧值 | 底层数组+链表实现           | 无论key还是value都不能为null，效率低 | 安全     |
| ConcurrentHashMap | 无序     | 重复时覆盖旧值 | 底层采用分段的数组+链表实现 | 效率高于HashTable                    | 安全     |

**Map集合常用API**

| 方法名称              | 说明                                                         |
| --------------------- | ------------------------------------------------------------ |
| V get(Object key)     | 返回 Map 集合中指定键对象所对应的值。V 表示值的数据类型      |
| V put(K key, V value) | 向 Map 集合中添加键-值对，返回 key 以前对应的 value，如果没有， 则返回 null |
| V remove(Object key)  | 从 Map 集合中删除 key 对应的键-值对，返回 key 对应的 value，如果没有，则返回null |
| Set entrySet()        | 返回 Map 集合中所有键-值对的 Set 集合，此 Set 集合中元素的数据类型为 Map.Entry |
| Set keySet()          | 返回 Map 集合中所有键对象的 Set 集合                         |

```
Map<String,String> map=new HashMap<>();
map.put("stu1","student1");
map.put("stu2","student2");
map.put("stu3","student3");
System.out.println(map.remove("stu2"));
System.out.println("map:"+map);
Set<Map.Entry<String, String>> entries = map.entrySet();
Set<String> keySet = map.keySet();
System.out.println("entries:"+entries);
for (Map.Entry<String, String> entry : entries) {
    System.out.println(entry.getValue());
}
System.out.println("keySet:"+keySet);
for (String s : keySet) {
    System.out.println(s);
}
```

| 方法名称              | 说明                                                         |
| --------------------- | ------------------------------------------------------------ |
| V get(Object key)     | 返回 Map 集合中指定键对象所对应的值。V 表示值的数据类型      |
| V put(K key, V value) | 向 Map 集合中添加键-值对，返回 key 以前对应的 value，如果没有， 则返回 null |
| V remove(Object key)  | 从 Map 集合中删除 key 对应的键-值对，返回 key 对应的 value，如果没有，则返回null |
| Set entrySet()        | 返回 Map 集合中所有键-值对的 Set 集合，此 Set 集合中元素的数据类型为 Map.Entry |
| Set keySet()          |                                                              |

### [四、 Java集合进阶知识点](https://java.springlearn.cn/#/BasicJava/集合是什么?id=四、-java集合进阶知识点)

#### [1. Collection高级](https://java.springlearn.cn/#/BasicJava/集合是什么?id=_1-collection高级)

#### [2. Map高级](https://java.springlearn.cn/#/BasicJava/集合是什么?id=_2-map高级)

这里所说的高级，基本就是面试时候，面试官会经常考的知识点。

- ①线程安全
- ②哈希碰撞
- ③加载因子
- ④为什么ConcurrentHashMap效率高并安全

**① 线程安全**

```
HashTable` 是线程安全的，因为它的所有方法都被 `synchronized`修饰，所以安全，但是效率相对是低于 `HashMap` 的。 `HashMap` 虽然是线程不安全但是效率比较高。小编建议如果在不涉及多线程操作的情况下，建议使用HashMap。 那么什么情况是不涉及多线程呢? 最简单的场景就是在只需要在方法中使用的时候可以用HashMap。但是凡事要作为对象的实例变量的情况下，一定就不能使用HashMap。因为它线程不安全。建议使用`ConcurrentHashMap
```

**②哈希碰撞**

什么是哈希碰撞，前面说了凡事Hash开头的Map实现类，底层都是使用Hash来实现的，即将Key通过hash算法得到一个位置，然后在该位置上存储value。但是假如key1和key2通过算法得到的位置是一样的，即说明出现了hash碰撞的场景。那么如何避免哈希膨胀呢? 答案就是扩容，默认当HashMap中的键值对达到数组大小的75%时，即会触发扩容。通过扩容的方式来避免哈希碰撞

**③加载因子**

![img](./Java%E5%BC%80%E5%8F%91%E6%8C%87%E5%8D%97.assets/20210611102646-16677959657635.png)

前面说哈希碰撞时候，解决方案就是扩容，那么如何知道要扩容呢? 默认当Hash达到75%时候就扩容，这个75%就叫做加载因子。

**④为什么ConcurrentHashMap效率高并安全**

Hashtable的synchronized是针对整张Hash表的，即每次锁住整张表让线程独占，ConcurrentHashMap允许多个修改操作并发进行，其关键在于使用了锁分离技术。通过把整个Map分为N个Segment，可以提供相同的线程安全，但是效率提升N倍，默认提升16倍。(读操作不加锁，由于HashEntry的value变量是 volatile的，也能保证读取到最新的值。)

面试时候可以简单回答: 每一个Segment相当于HashTable，假如Map分成了N个分段，一般情况如果并发的数量小于N都不会出现锁阻断情况，但是当并发数大于N时候，同样会有性能为题，ConcurrentHashMap相当于HashTable和HashMap的一个这种方案。

## 异常体系

### [一、Java异常体系其实很简单](https://java.springlearn.cn/#/BasicJava/异常体系?id=一、java异常体系其实很简单)

其实Java的异常体系是非常简单的,简单到只要你看过本文就能明白百分之八九十的样子。当你清楚了Java的异常体系 那么在遇到项目执行异常的时候,基本看报错的异常就大概明白问题出在哪里,遇到的错误多了,就成长了,处理的问题就是 你未来在技术路上所积累的财富。

![img](./Java%E5%BC%80%E5%8F%91%E6%8C%87%E5%8D%97.assets/20210610222537-16677959780588.png)

在Java的异常体系中 `Throwable` 我们可以理解为是一个根异常,即所有的异常都是它的子类

![img](./Java%E5%BC%80%E5%8F%91%E6%8C%87%E5%8D%97.assets/20210610222542.png)

### [二、Error](https://java.springlearn.cn/#/BasicJava/异常体系?id=二、error)

前面我们说了Java的异常体系中 `Throwable` 可以理解是一个根异常,那么 `Error` 就是这个根节点的一个子节点。 `Error` 类对象由 `Java` 虚拟机生成并抛出，大多数错误与代码编写者所执行的操作无关。程序无法处理的异常，一般伴随者jvm虚拟机停止，或者断电之类 这种问题，是无法通过程序来解决的。

**这种异常基本很少,如果遇到也不要慌,跟你的业务逻辑没有关系,顶多是Java代码写的有问题,只要不是业务问题其实大多都能先通过重启解决; 但是假如项目还未上线,只是在开发过程中出现这种问题一定要弄清楚原因,是那一部分代码编写异常导致的,否则上线可能有重大隐患**

**经验教学:**

1. 如果是在项目系统过程中遇到这种问题,可能是因为Jar包冲突导致的。
2. 如果是在项目运行过程中遇到这种问题,可能是因为对象创建过多没有释放,导致堆栈溢出。这个时候就要看GC是否频繁,然后对堆栈日志进行分析,看存在最多的对象是哪一个,然后分析代码解决。

### [三、Exception](https://java.springlearn.cn/#/BasicJava/异常体系?id=三、exception)

`Exception` 异常时我们平时在开发中遇到最多，其实 `Exception` 也分为两种即:

1. `checkException` 编译异常，这种异常，是哪些没有遵守java语言规则，容易看出和解决的
2. `uncheckException` 运行异常，运行异常，具有不确定性，往往难以排查，包括处理逻辑问题。

然而 `checkException` 和 `uncheckException` 其实只是一个概念,并没有对应的 `Java异常类`。我们基本可以忽略 `checkException` 因为这种异常基本现在的编译器都会给我们做了，我们在写代码时候就会实时的给我提示错误了。我们 只用关心 `uncheckException`即可。

**uncheckException**

![img](./Java%E5%BC%80%E5%8F%91%E6%8C%87%E5%8D%97.assets/20210610222548-166779599166312.png)

```
RuntimeException` + `Error` 和其子类都是属于 `uncheckException
```

前面我们已经对 `Error` 做了说明，现在就主要来看下 `RuntimeException`。 `RuntimeException` 从名字来看就是运行异常,所谓运行异常就是可能在程序运行过程中发生的异常,这种异常一般是可以通过代码逻辑进行处理的。 我们举例一个例子，我们都知道0不能作为除数。但是假如在下面这个代码中

```
public class Tester {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.print("请输入被除数a:");
        int a = sc.nextInt();
        System.out.print("请输入除数b:");
        int b = sc.nextInt();
        System.out.println("a/b=" + a / b);
    }
}
```

当输入a=8,b=2,那么结果就是4。

**假如我们输入b=0呢?**

学过数学都知道0不能做除数,程序也不运行你这么输入,但是却不能阻止你,只能通过报错的方式来告诉你。

![img](./Java%E5%BC%80%E5%8F%91%E6%8C%87%E5%8D%97.assets/20210610222552-166779600035915.png)

那么我们就要对这个异常进行处理,当发现有这个异常就在控制台来提醒用户。那么代码就会变成这样

```
public class Tester {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.print("请输入被除数a:");
        int a = sc.nextInt();
        System.out.print("请输入除数b:");
        int b = sc.nextInt();
        try {
            System.out.println("a/b=" + a / b);
        } catch (ArithmeticException ate) {
            //对算术异常进行捕捉
            System.err.println("0不能作为除数,请输入不为0的任意数");
        }
    }
}
```

当出现算术异常直接提示: "0不能作为除数,请输入不为0的任意数" ![img](/Users/jiusonghuang/pic-md/20210610222600.png)

那么像这种程序中无可避免会出现，且又能通过逻辑来处理的异常就是运行异常。运行异常一般都可以正常运行,只是在特定情况下会导致异常发生。 像这面这个例子,我们只要看到 `ArithmeticException` 就知道是算术异常。所以只要我们对运行异常类有一个认识，其实就能解决大多数的程序问题了。 下面我们来看下运行异常都要有哪些类把。

**只要对下面运行异常类进行熟悉了,基本就清楚掌握了Java的异常体系了**

![img](./Java%E5%BC%80%E5%8F%91%E6%8C%87%E5%8D%97.assets/20210610222606-166779601227518.png)

![img](./Java%E5%BC%80%E5%8F%91%E6%8C%87%E5%8D%97.assets/20210610220013-166779601942321.png)

