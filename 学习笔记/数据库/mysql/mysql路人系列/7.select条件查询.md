

#    select条件查询   

[MySQL教程](http://www.itsoku.com/course/3)  ->  select条件查询

[上一篇：select查下基础篇](http://www.itsoku.com/course/3/40)

[下一篇：排序和分页（order by 、limit）](http://www.itsoku.com/course/3/42)



这是Mysql系列第7篇。

环境：mysql5.7.25，cmd命令中进行演示。

电商中：我们想查看某个用户所有的订单，或者想查看某个用户在某个时间段内所有的订单，此时我们需要对订单表数据进行筛选，按照用户、时间进行过滤，得到我们期望的结果。

此时我们需要使用条件查询来对指定表进行操作，我们需要了解sql中的条件查询常见的玩法。

## 本篇内容

*   [本篇内容](#%E6%9C%AC%E7%AF%87%E5%86%85%E5%AE%B9)
*   [条件查询](#%E6%9D%A1%E4%BB%B6%E6%9F%A5%E8%AF%A2)
*   [条件查询运算符](#%E6%9D%A1%E4%BB%B6%E6%9F%A5%E8%AF%A2%E8%BF%90%E7%AE%97%E7%AC%A6)
    *   [等于（=）](#%E7%AD%89%E4%BA%8E%EF%BC%88=%EF%BC%89)
    *   [不等于（<>、!=）](#%E4%B8%8D%E7%AD%89%E4%BA%8E%EF%BC%88%3C%3E%E3%80%81!=%EF%BC%89)
    *   [大于（>）](#%E5%A4%A7%E4%BA%8E%EF%BC%88%3E%EF%BC%89)
*   [逻辑查询运算符](#%E9%80%BB%E8%BE%91%E6%9F%A5%E8%AF%A2%E8%BF%90%E7%AE%97%E7%AC%A6)
    *   [AND（并且）](#AND%EF%BC%88%E5%B9%B6%E4%B8%94%EF%BC%89)
    *   [OR（或者）](#OR%EF%BC%88%E6%88%96%E8%80%85%EF%BC%89)
*   [like（模糊查询）](#like%EF%BC%88%E6%A8%A1%E7%B3%8A%E6%9F%A5%E8%AF%A2%EF%BC%89)
*   [BETWEEN AND(区间查询)](#BETWEEN%20AND(%E5%8C%BA%E9%97%B4%E6%9F%A5%E8%AF%A2))
*   [IN查询](#IN%E6%9F%A5%E8%AF%A2)
*   [NOT IN查询](#NOT%20IN%E6%9F%A5%E8%AF%A2)
*   [NULL存在的坑](#NULL%E5%AD%98%E5%9C%A8%E7%9A%84%E5%9D%91)
*   [IS NULL/IS NOT NULL（NULL值专用查询）](#IS%20NULL/IS%20NOT%20NULL%EF%BC%88NULL%E5%80%BC%E4%B8%93%E7%94%A8%E6%9F%A5%E8%AF%A2%EF%BC%89)
    *   [IS NULL（返回值为空的记录）](#IS%20NULL%EF%BC%88%E8%BF%94%E5%9B%9E%E5%80%BC%E4%B8%BA%E7%A9%BA%E7%9A%84%E8%AE%B0%E5%BD%95%EF%BC%89)
    *   [IS NULL（返回值不为空的记录）](#IS%20NULL%EF%BC%88%E8%BF%94%E5%9B%9E%E5%80%BC%E4%B8%8D%E4%B8%BA%E7%A9%BA%E7%9A%84%E8%AE%B0%E5%BD%95%EF%BC%89)
*   [<=>（安全等于）](#%3C=%3E%EF%BC%88%E5%AE%89%E5%85%A8%E7%AD%89%E4%BA%8E%EF%BC%89)
*   [经典面试题](#%E7%BB%8F%E5%85%B8%E9%9D%A2%E8%AF%95%E9%A2%98)
*   [总结](#%E6%80%BB%E7%BB%93)
*   [最新资料](#%E6%9C%80%E6%96%B0%E8%B5%84%E6%96%99)
    

## 条件查询

语法：

```java
select 列名 from 表名 where 列 运算符 值
```

> 说明：
> 
> 注意关键字where，where后面跟上一个或者多个条件，条件是对前面数据的过滤，只有满足where后面条件的数据才会被返回。

下面介绍常见的查询运算符。

## 条件查询运算符

| 操作符 | 描述 |
| --- | --- |
| \= | 等于 |
| <> 或者 != | 不等于 |
| \> | 大于 |
| < | 小于 |
| \>= | 大于等于 |
| <= | 小于等于 |

### 等于（=）

```java
select 列名 from 表名 where 列 = 值;
```

> 说明：
> 
> 查询出指定的列和对应的值相等的记录。
> 
> 值如果是字符串类型，需要用单引号或者双引号引起来。

示例：

```java
mysql> create table test1 (a int,b varchar(10));
Query OK, 0 rows affected (0.01 sec)

mysql> insert into test1 values (1,'abc'),(2,'bbb');
Query OK, 2 rows affected (0.01 sec)
Records: 2  Duplicates: 0  Warnings: 0

mysql> select * from test1;
+------+------+
| a    | b    |
+------+------+
|    1 | abc  |
|    2 | bbb  |
+------+------+
2 rows in set (0.00 sec)

mysql> select * from test1 where a=2;
+------+------+
| a    | b    |
+------+------+
|    2 | bbb  |
+------+------+
1 row in set (0.00 sec)

mysql> select * from test1 where b = 'abc';
+------+------+
| a    | b    |
+------+------+
|    1 | abc  |
+------+------+
1 row in set (0.00 sec)

mysql> select * from test1 where b = "abc";
+------+------+
| a    | b    |
+------+------+
|    1 | abc  |
+------+------+
1 row in set (0.00 sec)
```

### 不等于（<>、!=）

不等于有两种写法：<>或者!=

```java
select 列名 from 表名 where 列 <> 值;
或者
select 列名 from 表名 where 列 != 值;
```

示例：

```java
mysql> select * from test1 where a<>1;
+------+------+
| a    | b    |
+------+------+
|    2 | bbb  |
+------+------+
1 row in set (0.00 sec)

mysql> select * from test1 where a!=1;
+------+------+
| a    | b    |
+------+------+
|    2 | bbb  |
+------+------+
1 row in set (0.00 sec)
```

> **注意：**
> 
> <> 这个是最早的用法。
> 
> !=是后来才加上的。
> 
> 两者意义相同，在可移植性上前者优于后者
> 
> 故而sql语句中尽量使用<>来做不等判断

### 大于（>）

```java
select 列名 from 表名 where 列 > 值;
```

示例：

```java
mysql> select * from test1 where a>1;
+------+------+
| a    | b    |
+------+------+
|    2 | bbb  |
+------+------+
1 row in set (0.00 sec)

mysql> select * from test1 where b>'a';
+------+------+
| a    | b    |
+------+------+
|    1 | abc  |
|    2 | bbb  |
+------+------+
2 rows in set (0.00 sec)

mysql> select * from test1 where b>'ac';
+------+------+
| a    | b    |
+------+------+
|    2 | bbb  |
+------+------+
1 row in set (0.00 sec)
```

> **说明：**
> 
> 数值按照大小比较。
> 
> 字符按照_ASC_II码对应的值进行比较，比较时按照字符对应的位置一个字符一个字符的比较。

其他几个运算符（<、<=、>=）在此就不介绍了，用法和上面类似，大家可以自己练习一下。

## 逻辑查询运算符

当我们需要使用多个条件进行查询的时候，需要使用逻辑查询运算符。

| 逻辑运算符 | 描述 |
| --- | --- |
| AND | 多个条件都成立 |
| OR | 多个条件中满足一个 |

### AND（并且）

```java
select 列名 from 表名 where 条件1 and 条件2;
```

> 表示返回满足条件1和条件2的记录。

示例：

```java
mysql> create table test3(a int not null,b varchar(10) not null);
Query OK, 0 rows affected (0.01 sec)

mysql> insert into test3 (a,b) values (1,'a'),(2,'b'),(2,'c'),(3,'c');
Query OK, 4 rows affected (0.00 sec)
Records: 4  Duplicates: 0  Warnings: 0

mysql> select * from test3;
+---+---+
| a | b |
+---+---+
| 1 | a |
| 2 | b |
| 2 | c |
| 3 | c |
+---+---+
4 rows in set (0.00 sec)

mysql> select * from test3 t where t.a=2 and t.b='c';
+---+---+
| a | b |
+---+---+
| 2 | c |
+---+---+
1 row in set (0.00 sec)
```

> 查询出了a=2 并且 b=’c’的记录，返回了一条结果。

### OR（或者）

```java
select 列名 from 表名 where 条件1 or 条件2;
```

> 满足条件1或者满足条件2的记录都会被返回。

示例：

```java
mysql> select * from test3;
+---+---+
| a | b |
+---+---+
| 1 | a |
| 2 | b |
| 2 | c |
| 3 | c |
+---+---+
4 rows in set (0.00 sec)

mysql> select * from test3 t where t.a=1 or t.b='c';
+---+---+
| a | b |
+---+---+
| 1 | a |
| 2 | c |
| 3 | c |
+---+---+
3 rows in set (0.00 sec)
```

> 查询出了a=1或者b=’c’的记录，返回了3条记录。

## like（模糊查询）

有个学生表，包含（学生id，年龄，姓名），当我们需要查询姓“张”的学生的时候，如何查询呢？

此时我们可以使用sql中的like关键字。语法：

```java
select 列名 from 表名 where 列 like pattern;
```

> pattern中可以包含通配符，有以下通配符：
> 
> %：表示匹配任意一个或多个字符
> 
> \_：表示匹配任意一个字符。

**学生表，查询名字姓“张”的学生，如下：**

```java
mysql> create table stu (id int not null comment '编号',age smallint not null comment '年龄',name varchar(10) not null comment '姓名');
Query OK, 0 rows affected (0.01 sec)

mysql> insert into stu values (1,22,'张三'),(2,25,'李四'),(3,26,'张学友'),(4,32,'刘德华'),(5,55,'张良');
Query OK, 5 rows affected (0.00 sec)
Records: 5  Duplicates: 0  Warnings: 0

mysql> select * from stu;
+----+-----+-----------+
| id | age | name      |
+----+-----+-----------+
|  1 |  22 | 张三      |
|  2 |  25 | 李四      |
|  3 |  26 | 张学友    |
|  4 |  32 | 刘德华    |
|  5 |  55 | 张良    |
+----+-----+-----------+
5 rows in set (0.00 sec)

mysql> select * from stu a where a.name like '张%';
+----+-----+-----------+
| id | age | name      |
+----+-----+-----------+
|  1 |  22 | 张三      |
|  3 |  26 | 张学友    |
|  5 |  55 | 张良    |
+----+-----+-----------+
3 rows in set (0.00 sec)
```

**查询名字中带有’学’的学生，’学’的位置不固定，可以这么查询，如下：**

```java
mysql> select * from stu a where a.name like '%学%'; ;
+----+-----+-----------+
| id | age | name      |
+----+-----+-----------+
|  3 |  26 | 张学友    |
|  5 |  55 | 张良    |
+----+-----+-----------+
2 rows in set (0.00 sec)
```

**查询姓’张’，名字2个字的学生：**

```java
mysql> select * from stu a where a.name like '张_';
+----+-----+--------+
| id | age | name   |
+----+-----+--------+
|  1 |  22 | 张三   |
+----+-----+--------+
1 row in set (0.00 sec)
```

> 上面的_代表任意一个字符，如果要查询姓’张’的3个字的学生，条件变为了’张\__‘，2个下划线符号。

## BETWEEN AND(区间查询)

操作符 BETWEEN … AND 会选取介于两个值之间的数据范围，这些值可以是数值、文本或者日期，属于一个闭区间查询。

```java
selec 列名 from 表名 where 列名 between 值1 and 值2;
```

> 返回对应的列的值在\[值1,值2\]区间中的记录
> 
> 使用between and可以提高语句的简洁度
> 
> 两个临界值不要调换位置，只能是大于等于左边的值，并且小于等于右边的值。

**示例：**

查询年龄在\[25,32\]的，如下：

```java
mysql> select * from stu;
+----+-----+-----------+
| id | age | name      |
+----+-----+-----------+
|  1 |  22 | 张三      |
|  2 |  25 | 李四      |
|  3 |  26 | 张学友    |
|  4 |  32 | 刘德华    |
|  5 |  55 | 张良    |
+----+-----+-----------+
5 rows in set (0.00 sec)

mysql> select * from stu t where t.age between 25 and 32;
+----+-----+-----------+
| id | age | name      |
+----+-----+-----------+
|  2 |  25 | 李四      |
|  3 |  26 | 张学友    |
|  4 |  32 | 刘德华    |
+----+-----+-----------+
3 rows in set (0.00 sec)
```

下面两条sql效果一样

```java
select * from stu t where t.age between 25 and 32;
select * from stu t where t.age >= 25 and t.age <= 32;
```

## IN查询

我们需要查询年龄为10岁、15岁、20岁、30岁的人，怎么查询呢？可以用or查询，如下：

```java
mysql> create table test6(id int,age smallint);
Query OK, 0 rows affected (0.01 sec)

mysql> insert into test6 values(1,14),(2,15),(3,18),(4,20),(5,28),(6,10),(7,10),(8,30);
Query OK, 8 rows affected (0.00 sec)
Records: 8  Duplicates: 0  Warnings: 0

mysql> select * from test6;
+------+------+
| id   | age  |
+------+------+
|    1 |   14 |
|    2 |   15 |
|    3 |   18 |
|    4 |   20 |
|    5 |   28 |
|    6 |   10 |
|    7 |   10 |
|    8 |   30 |
+------+------+
8 rows in set (0.00 sec)

mysql> select * from test6 t where t.age=10 or t.age=15 or t.age=20 or t.age = 30;
+------+------+
| id   | age  |
+------+------+
|    2 |   15 |
|    4 |   20 |
|    6 |   10 |
|    7 |   10 |
|    8 |   30 |
+------+------+
5 rows in set (0.00 sec)
```

**用了这么多or，有没有更简单的写法？有，用IN查询**

IN 操作符允许我们在 WHERE 子句中规定多个值。

```java
select 列名 from 表名 where 字段 in (值1,值2,值3,值4);
```

> in 后面括号中可以包含多个值，对应记录的字段满足in中任意一个都会被返回
> 
> in列表的值类型必须一致或兼容
> 
> in列表中不支持通配符。

上面的示例用IN实现如下：

```java
mysql> select * from test6 t where t.age in (10,15,20,30);
+------+------+
| id   | age  |
+------+------+
|    2 |   15 |
|    4 |   20 |
|    6 |   10 |
|    7 |   10 |
|    8 |   30 |
+------+------+
5 rows in set (0.00 sec)
```

相对于or简洁了很多。

## NOT IN查询

not in和in刚好相反，in是列表中被匹配的都会被返回，NOT IN是和列表中都不匹配的会被返回。

```plain
select 列名 from 表名 where 字段 not in (值1,值2,值3,值4);
```

如查询年龄不在10、15、20、30之内的，如下：

```java
mysql> select * from test6 t where t.age not in (10,15,20,30);
+------+------+
| id   | age  |
+------+------+
|    1 |   14 |
|    3 |   18 |
|    5 |   28 |
+------+------+
3 rows in set (0.00 sec)
```

## NULL存在的坑

我们先看一下效果，然后在解释，示例如下：

```plain
mysql> create table test5 (a int not null,b int,c varchar(10));
Query OK, 0 rows affected (0.01 sec)

mysql> insert into test5 values (1,2,'a'),(3,null,'b'),(4,5,null);
Query OK, 3 rows affected (0.01 sec)
Records: 3  Duplicates: 0  Warnings: 0

mysql> select * from test5;
+---+------+------+
| a | b    | c    |
+---+------+------+
| 1 |    2 | a    |
| 3 | NULL | b    |
| 4 |    5 | NULL |
+---+------+------+
3 rows in set (0.00 sec)
```

上面我们创建了一个表test5，3个字段，a不能为空，b、c可以为空，插入了3条数据，睁大眼睛看效果了：

```java
mysql> select * from test5 where b>0;
+---+------+------+
| a | b    | c    |
+---+------+------+
| 1 |    2 | a    |
| 4 |    5 | NULL |
+---+------+------+
2 rows in set (0.00 sec)

mysql> select * from test5 where b<=0;
Empty set (0.00 sec)

mysql> select * from test5 where b=NULL;
Empty set (0.00 sec)

mysql> select * from test5 t where t.b between 0 and 100;
+---+------+------+
| a | b    | c    |
+---+------+------+
| 1 |    2 | a    |
| 4 |    5 | NULL |
+---+------+------+
2 rows in set (0.00 sec)

mysql> select * from test5 where c like '%';
+---+------+------+
| a | b    | c    |
+---+------+------+
| 1 |    2 | a    |
| 3 | NULL | b    |
+---+------+------+
2 rows in set (0.00 sec)

mysql> select * from test5 where c in ('a','b',NULL);
+---+------+------+
| a | b    | c    |
+---+------+------+
| 1 |    2 | a    |
| 3 | NULL | b    |
+---+------+------+
2 rows in set (0.00 sec)

mysql> select * from test5 where c not in ('a','b',NULL);
Empty set (0.00 sec)
```

认真看一下上面的查询：

上面带有条件的查询，对字段b进行条件查询的，b的值为NULL的都没有出现。

对c字段进行like ‘%’查询、in、not查询，c中为NULL的记录始终没有查询出来。

between and查询，为空的记录也没有查询出来。

**结论：查询运算符、like、between and、in、not in对NULL值查询不起效。**

**那NULL如何查询呢？继续向下看**

## IS NULL/IS NOT NULL（NULL值专用查询）

上面介绍的各种运算符对NULL值均不起效，mysql为我们提供了查询空值的语法：IS NULL、IS NOT NULL。

### IS NULL（返回值为空的记录）

```java
select 列名 from 表名 where 列 is null;
```

> 查询指定的列的值为NULL的记录。

如：

```java
mysql> create table test7 (a int,b varchar(10));
Query OK, 0 rows affected (0.01 sec)

mysql> insert into test7 (a,b) values (1,'a'),(null,'b'),(3,null),(null,null),(4,'c');
Query OK, 5 rows affected (0.00 sec)
Records: 5  Duplicates: 0  Warnings: 0

mysql> select * from test7;
+------+------+
| a    | b    |
+------+------+
|    1 | a    |
| NULL | b    |
|    3 | NULL |
| NULL | NULL |
|    4 | c    |
+------+------+
5 rows in set (0.00 sec)

mysql> select * from test7 t where t.a is null;
+------+------+
| a    | b    |
+------+------+
| NULL | b    |
| NULL | NULL |
+------+------+
2 rows in set (0.00 sec)

mysql> select * from test7 t where t.a is null or t.b is null;
+------+------+
| a    | b    |
+------+------+
| NULL | b    |
|    3 | NULL |
| NULL | NULL |
+------+------+
3 rows in set (0.00 sec)
```

### IS NULL（返回值不为空的记录）

```java
select 列名 from 表名 where 列 is not null;
```

> 查询指定的列的值不为NULL的记录。

如：

```java
mysql> select * from test7 t where t.a is not null;
+------+------+
| a    | b    |
+------+------+
|    1 | a    |
|    3 | NULL |
|    4 | c    |
+------+------+
3 rows in set (0.00 sec)

mysql> select * from test7 t where t.a is not null and t.b is not null;
+------+------+
| a    | b    |
+------+------+
|    1 | a    |
|    4 | c    |
+------+------+
2 rows in set (0.00 sec)
```

## <=>（安全等于）

<=>：既可以判断NULL值，又可以判断普通的数值，可读性较低，用得较少

**示例：**

```java
mysql> create table test8 (a int,b varchar(10));
Query OK, 0 rows affected (0.01 sec)

mysql> insert into test8 (a,b) values (1,'a'),(null,'b'),(3,null),(null,null),(4,'c');
Query OK, 5 rows affected (0.01 sec)
Records: 5  Duplicates: 0  Warnings: 0

mysql> select * from test8;
+------+------+
| a    | b    |
+------+------+
|    1 | a    |
| NULL | b    |
|    3 | NULL |
| NULL | NULL |
|    4 | c    |
+------+------+
5 rows in set (0.00 sec)

mysql> select * from test8 t where t.a<=>null;
+------+------+
| a    | b    |
+------+------+
| NULL | b    |
| NULL | NULL |
+------+------+
2 rows in set (0.00 sec)

mysql> select * from test8 t where t.a<=>1;
+------+------+
| a    | b    |
+------+------+
|    1 | a    |
+------+------+
1 row in set (0.00 sec)
```

可以看到<=>可以将NULL查询出来。

## 经典面试题

下面的2个sql查询结果一样么？

```java
select * from students;
select * from students where name like '%';
```

结果分2种情况：

当name没有NULL值时，返回的结果一样。

当name有NULL值时，第2个sql查询不出name为NULL的记录。

## 总结

*   **like中的%可以匹配一个到多个任意的字符，\_可以匹配任意一个字符**
*   **空值查询需要使用IS NULL或者IS NOT NULL，其他查询运算符对NULL值无效**
*   **建议创建表的时候，尽量设置表的字段不能为空，给字段设置一个默认值**
*   **<=>（安全等于）玩玩可以，建议少使用**

[下一篇：排序和分页（order by 、limit）](http://www.itsoku.com/course/3/42)

[上一篇：select查下基础篇](http://www.itsoku.com/course/3/40)

