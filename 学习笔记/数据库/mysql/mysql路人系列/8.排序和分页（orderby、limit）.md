

#    排序和分页（order by 、limit）   

[MySQL教程](http://www.itsoku.com/course/3)  ->  排序和分页（order by 、limit）

[上一篇：select条件查询](http://www.itsoku.com/course/3/41)

[下一篇：分组查询（group by、having）](http://www.itsoku.com/course/3/43)



这是Mysql系列第8篇。

环境：mysql5.7.25，cmd命令中进行演示。

**代码中被\[\]包含的表示可选，|符号分开的表示可选其一。**

## 本章内容

*   [本章内容](#%E6%9C%AC%E7%AB%A0%E5%86%85%E5%AE%B9)
*   [排序查询（order by）](#%E6%8E%92%E5%BA%8F%E6%9F%A5%E8%AF%A2%EF%BC%88order%20by%EF%BC%89)
    *   [单字段排序](#%E5%8D%95%E5%AD%97%E6%AE%B5%E6%8E%92%E5%BA%8F)
    *   [多字段排序](#%E5%A4%9A%E5%AD%97%E6%AE%B5%E6%8E%92%E5%BA%8F)
    *   [按别名排序](#%E6%8C%89%E5%88%AB%E5%90%8D%E6%8E%92%E5%BA%8F)
    *   [按函数排序](#%E6%8C%89%E5%87%BD%E6%95%B0%E6%8E%92%E5%BA%8F)
    *   [where之后进行排序](#where%E4%B9%8B%E5%90%8E%E8%BF%9B%E8%A1%8C%E6%8E%92%E5%BA%8F)
*   [limit介绍](#limit%E4%BB%8B%E7%BB%8D)
    *   [获取前n行记录](#%E8%8E%B7%E5%8F%96%E5%89%8Dn%E8%A1%8C%E8%AE%B0%E5%BD%95)
    *   [获取最大的一条记录](#%E8%8E%B7%E5%8F%96%E6%9C%80%E5%A4%A7%E7%9A%84%E4%B8%80%E6%9D%A1%E8%AE%B0%E5%BD%95)
    *   [获取排名第n到m的记录](#%E8%8E%B7%E5%8F%96%E6%8E%92%E5%90%8D%E7%AC%ACn%E5%88%B0m%E7%9A%84%E8%AE%B0%E5%BD%95)
    *   [分页查询](#%E5%88%86%E9%A1%B5%E6%9F%A5%E8%AF%A2)
*   [避免踩坑](#%E9%81%BF%E5%85%8D%E8%B8%A9%E5%9D%91)
    *   [limit中不能使用表达式](#limit%E4%B8%AD%E4%B8%8D%E8%83%BD%E4%BD%BF%E7%94%A8%E8%A1%A8%E8%BE%BE%E5%BC%8F)
    *   [limit后面的2个数字不能为负数](#limit%E5%90%8E%E9%9D%A2%E7%9A%842%E4%B8%AA%E6%95%B0%E5%AD%97%E4%B8%8D%E8%83%BD%E4%B8%BA%E8%B4%9F%E6%95%B0)
    *   [排序分页存在的坑](#%E6%8E%92%E5%BA%8F%E5%88%86%E9%A1%B5%E5%AD%98%E5%9C%A8%E7%9A%84%E5%9D%91)
*   [总结](#%E6%80%BB%E7%BB%93)
*   [最新资料](#%E6%9C%80%E6%96%B0%E8%B5%84%E6%96%99)
    

## 排序查询（order by）

电商中：我们想查看今天所有成交的订单，按照交易额从高到低排序，此时我们可以使用数据库中的排序功能来完成。

**排序语法：**

```java
select 字段名 from 表名 order by 字段1 [asc|desc],字段2 [asc|desc];
```

> 需要排序的字段跟在`order by`之后；
> 
> asc|desc表示排序的规则，asc：升序，desc：降序，默认为asc；
> 
> 支持多个字段进行排序，多字段排序之间用逗号隔开。

### 单字段排序

```java
mysql> create table test2(a int,b varchar(10));
Query OK, 0 rows affected (0.01 sec)

mysql> insert into test2 values (10,'jack'),(8,'tom'),(5,'ready'),(100,'javacode');
Query OK, 4 rows affected (0.00 sec)
Records: 4  Duplicates: 0  Warnings: 0

mysql> select * from test2;
+------+----------+
| a    | b        |
+------+----------+
|   10 | jack     |
|    8 | tom      |
|    5 | ready    |
|  100 | javacode |
+------+----------+
4 rows in set (0.00 sec)

mysql> select * from test2 order by a asc;
+------+----------+
| a    | b        |
+------+----------+
|    5 | ready    |
|    8 | tom      |
|   10 | jack     |
|  100 | javacode |
+------+----------+
4 rows in set (0.00 sec)

mysql> select * from test2 order by a desc;
+------+----------+
| a    | b        |
+------+----------+
|  100 | javacode |
|   10 | jack     |
|    8 | tom      |
|    5 | ready    |
+------+----------+
4 rows in set (0.00 sec)

mysql> select * from test2 order by a;
+------+----------+
| a    | b        |
+------+----------+
|    5 | ready    |
|    8 | tom      |
|   10 | jack     |
|  100 | javacode |
+------+----------+
4 rows in set (0.00 sec)
```

### 多字段排序

比如学生表，先按学生年龄降序，年龄相同时，再按学号升序，如下：

```java
mysql> create table stu(id int not null comment '学号' primary key,age tinyint not null comment '年龄',name varchar(16) comment '姓名');
Query OK, 0 rows affected (0.01 sec)

mysql> insert into stu (id,age,name) values (1001,18,'  喔喔松Java'),(1005,20,'刘德华'),(1003,18,'张学友'),(1004,20,'张国荣'),(1010,19,'梁朝伟');
Query OK, 5 rows affected (0.00 sec)
Records: 5  Duplicates: 0  Warnings: 0

mysql> select * from stu;
+------+-----+---------------+
| id   | age | name          |
+------+-----+---------------+
| 1001 |  18 |   喔喔松Java    |
| 1003 |  18 | 张学友        |
| 1004 |  20 | 张国荣        |
| 1005 |  20 | 刘德华        |
| 1010 |  19 | 梁朝伟        |
+------+-----+---------------+
5 rows in set (0.00 sec)

mysql> select * from stu order by age desc,id asc;
+------+-----+---------------+
| id   | age | name          |
+------+-----+---------------+
| 1004 |  20 | 张国荣        |
| 1005 |  20 | 刘德华        |
| 1010 |  19 | 梁朝伟        |
| 1001 |  18 |   喔喔松Java    |
| 1003 |  18 | 张学友        |
+------+-----+---------------+
5 rows in set (0.00 sec)
```

### 按别名排序

```java
mysql> select * from stu;
+------+-----+---------------+
| id   | age | name          |
+------+-----+---------------+
| 1001 |  18 |   喔喔松Java    |
| 1003 |  18 | 张学友        |
| 1004 |  20 | 张国荣        |
| 1005 |  20 | 刘德华        |
| 1010 |  19 | 梁朝伟        |
+------+-----+---------------+
5 rows in set (0.00 sec)

mysql> select age '年龄',id as '学号' from stu order by 年龄 asc,学号 desc;
+--------+--------+
| 年龄   | 学号   |
+--------+--------+
|     18 |   1003 |
|     18 |   1001 |
|     19 |   1010 |
|     20 |   1005 |
|     20 |   1004 |
+--------+--------+
```

### 按函数排序

有学生表（id：编号，birth：出生日期，name：姓名），如下：

```java
mysql> drop table if exists student;
Query OK, 0 rows affected (0.01 sec)

mysql> CREATE TABLE student (
    ->   id int(11) NOT NULL COMMENT '学号',
    ->   birth date NOT NULL COMMENT '出生日期',
    ->   name varchar(16) DEFAULT NULL COMMENT '姓名',
    ->   PRIMARY KEY (id)
    -> );
Query OK, 0 rows affected (0.01 sec)

mysql> insert into student (id,birth,name) values (1001,'1990-10-10','  喔喔松Java'),(1005,'1960-03-01','刘德华'),(1003,'1960-08-16','张学友'),(1004,'1968-07-01','张国荣'),(1010,'1962-05-16','梁朝伟');
Query OK, 5 rows affected (0.00 sec)
Records: 5  Duplicates: 0  Warnings: 0

mysql>
mysql> SELECT * FROM student;
+------+------------+---------------+
| id   | birth      | name          |
+------+------------+---------------+
| 1001 | 1990-10-10 |   喔喔松Java    |
| 1003 | 1960-08-16 | 张学友        |
| 1004 | 1968-07-01 | 张国荣        |
| 1005 | 1960-03-01 | 刘德华        |
| 1010 | 1962-05-16 | 梁朝伟        |
+------+------------+---------------+
5 rows in set (0.00 sec)
```

需求：按照出生年份升序、编号升序，查询出编号、出生日期、出生年份、姓名，2种写法如下：

```java
mysql> SELECT id 编号,birth 出生日期,year(birth) 出生年份,name 姓名 from student ORDER BY year(birth) asc,id asc;
+--------+--------------+--------------+---------------+
| 编号   | 出生日期     | 出生年份     | 姓名          |
+--------+--------------+--------------+---------------+
|   1003 | 1960-08-16   |         1960 | 张学友        |
|   1005 | 1960-03-01   |         1960 | 刘德华        |
|   1010 | 1962-05-16   |         1962 | 梁朝伟        |
|   1004 | 1968-07-01   |         1968 | 张国荣        |
|   1001 | 1990-10-10   |         1990 |   喔喔松Java    |
+--------+--------------+--------------+---------------+
5 rows in set (0.00 sec)

mysql> SELECT id 编号,birth 出生日期,year(birth) 出生年份,name 姓名 from student ORDER BY 出生年份 asc,id asc;
+--------+--------------+--------------+---------------+
| 编号   | 出生日期     | 出生年份     | 姓名          |
+--------+--------------+--------------+---------------+
|   1003 | 1960-08-16   |         1960 | 张学友        |
|   1005 | 1960-03-01   |         1960 | 刘德华        |
|   1010 | 1962-05-16   |         1962 | 梁朝伟        |
|   1004 | 1968-07-01   |         1968 | 张国荣        |
|   1001 | 1990-10-10   |         1990 |   喔喔松Java    |
+--------+--------------+--------------+---------------+
5 rows in set (0.00 sec)
```

> 说明：
> 
> year函数：属于日期函数，可以获取对应日期中的年份。
> 
> 上面使用了2种方式排序，第一种是在order by中使用了函数，第二种是使用了别名排序。

### where之后进行排序

有订单数据如下：

```java
mysql> drop table if exists t_order;
Query OK, 0 rows affected, 1 warning (0.00 sec)

mysql> create table t_order(
    ->   id int not null auto_increment comment '订单编号',
    ->   price decimal(10,2) not null default 0 comment '订单金额',
    ->   primary key(id)
    -> )comment '订单表';
Query OK, 0 rows affected (0.01 sec)

mysql> insert into t_order (price) values (88.95),(100.68),(500),(300),(20.88),(200.5);
Query OK, 6 rows affected (0.00 sec)
Records: 6  Duplicates: 0  Warnings: 0

mysql> select * from t_order;
+----+--------+
| id | price  |
+----+--------+
|  1 |  88.95 |
|  2 | 100.68 |
|  3 | 500.00 |
|  4 | 300.00 |
|  5 |  20.88 |
|  6 | 200.50 |
+----+--------+
6 rows in set (0.00 sec)
```

需求：查询订单金额>=100的，按照订单金额降序排序，显示2列数据，列头：订单编号、订单金额，如下：

```java
mysql> select a.id 订单编号,a.price 订单金额 from t_order a where a.price>=100 order by a.price desc;
+--------------+--------------+
| 订单编号     | 订单金额     |
+--------------+--------------+
|            3 |       500.00 |
|            4 |       300.00 |
|            6 |       200.50 |
|            2 |       100.68 |
+--------------+--------------+
4 rows in set (0.00 sec)
```

## limit介绍

limit用来限制select查询返回的行数，常用于分页等操作。

**语法：**

```java
select 列 from 表 limit [offset,] count;
```

> 说明：
> 
> offset：表示偏移量，通俗点讲就是跳过多少行，offset可以省略，默认为0，表示跳过0行；范围：\[0,+∞)。
> 
> count：跳过offset行之后开始取数据，取count行记录；范围：\[0,+∞)。
> 
> limit中offset和count的值不能用表达式。

下面我们列一些常用的示例来加深理解。

### 获取前n行记录

```java
select 列 from 表 limit 0,n;
或者
select 列 from 表 limit n;
```

示例，获取订单的前2条记录，如下：

```java
mysql> create table t_order(
    ->   id int not null auto_increment comment '订单编号',
    ->   price decimal(10,2) not null default 0 comment '订单金额',
    ->   primary key(id)
    -> )comment '订单表';
Query OK, 0 rows affected (0.01 sec)

mysql> insert into t_order (price) values (88.95),(100.68),(500),(300),(20.88),(200.5);
Query OK, 6 rows affected (0.01 sec)
Records: 6  Duplicates: 0  Warnings: 0

mysql> select * from t_order;
+----+--------+
| id | price  |
+----+--------+
|  1 |  88.95 |
|  2 | 100.68 |
|  3 | 500.00 |
|  4 | 300.00 |
|  5 |  20.88 |
|  6 | 200.50 |
+----+--------+
6 rows in set (0.00 sec)

mysql> select a.id 订单编号,a.price 订单金额 from t_order a limit 2;
+--------------+--------------+
| 订单编号     | 订单金额     |
+--------------+--------------+
|            1 |        88.95 |
|            2 |       100.68 |
+--------------+--------------+
2 rows in set (0.00 sec)

mysql> select a.id 订单编号,a.price 订单金额 from t_order a limit 0,2;
+--------------+--------------+
| 订单编号     | 订单金额     |
+--------------+--------------+
|            1 |        88.95 |
|            2 |       100.68 |
+--------------+--------------+
2 rows in set (0.00 sec)
```

### 获取最大的一条记录

我们需要获取订单金额最大的一条记录，可以这么做：先按照金额降序，然后取第一条记录，如下：

```java
mysql> select a.id 订单编号,a.price 订单金额 from t_order a order by a.price desc;
+--------------+--------------+
| 订单编号     | 订单金额     |
+--------------+--------------+
|            3 |       500.00 |
|            4 |       300.00 |
|            6 |       200.50 |
|            2 |       100.68 |
|            1 |        88.95 |
|            5 |        20.88 |
+--------------+--------------+
6 rows in set (0.00 sec)

mysql> select a.id 订单编号,a.price 订单金额 from t_order a order by a.price desc limit 1;
+--------------+--------------+
| 订单编号     | 订单金额     |
+--------------+--------------+
|            3 |       500.00 |
+--------------+--------------+
1 row in set (0.00 sec)

mysql> select a.id 订单编号,a.price 订单金额 from t_order a order by a.price desc limit 0,1;
+--------------+--------------+
| 订单编号     | 订单金额     |
+--------------+--------------+
|            3 |       500.00 |
+--------------+--------------+
1 row in set (0.00 sec)
```

### 获取排名第n到m的记录

我们需要先跳过n-1条记录，然后取m-n+1条记录，如下：

```java
select 列 from 表 limit n-1,m-n+1;
```

如：我们想获取订单金额最高的3到5名的记录，我们需要跳过2条，然后获取3条记录，如下：

```java
mysql> select a.id 订单编号,a.price 订单金额 from t_order a order by a.price desc;
+--------------+--------------+
| 订单编号     | 订单金额     |
+--------------+--------------+
|            3 |       500.00 |
|            4 |       300.00 |
|            6 |       200.50 |
|            2 |       100.68 |
|            1 |        88.95 |
|            5 |        20.88 |
+--------------+--------------+
6 rows in set (0.00 sec)

mysql> select a.id 订单编号,a.price 订单金额 from t_order a order by a.price desc limit 2,3;
+--------------+--------------+
| 订单编号     | 订单金额     |
+--------------+--------------+
|            6 |       200.50 |
|            2 |       100.68 |
|            1 |        88.95 |
+--------------+--------------+
3 rows in set (0.00 sec)
```

### 分页查询

开发过程中，分页我们经常使用，分页一般有2个参数：

page：表示第几页，从1开始，范围\[1,+∞)

pageSize：每页显示多少条记录，范围\[1,+∞)

如：page = 2，pageSize = 10，表示获取第2页10条数据。

我们使用limit实现分页，语法如下：

```java
select 列 from 表名 limit (page - 1) * pageSize,pageSize;
```

需求：我们按照订单金额降序，每页显示2条，依次获取所有订单数据、第1页、第2页、第3页数据，如下：

```java
mysql> select a.id 订单编号,a.price 订单金额 from t_order a order by a.price desc;
+--------------+--------------+
| 订单编号     | 订单金额     |
+--------------+--------------+
|            3 |       500.00 |
|            4 |       300.00 |
|            6 |       200.50 |
|            2 |       100.68 |
|            1 |        88.95 |
|            5 |        20.88 |
+--------------+--------------+
6 rows in set (0.00 sec)

mysql> select a.id 订单编号,a.price 订单金额 from t_order a order by a.price desc limit 0,2;
+--------------+--------------+
| 订单编号     | 订单金额     |
+--------------+--------------+
|            3 |       500.00 |
|            4 |       300.00 |
+--------------+--------------+
2 rows in set (0.00 sec)

mysql> select a.id 订单编号,a.price 订单金额 from t_order a order by a.price desc limit 2,2;
+--------------+--------------+
| 订单编号     | 订单金额     |
+--------------+--------------+
|            6 |       200.50 |
|            2 |       100.68 |
+--------------+--------------+
2 rows in set (0.00 sec)

mysql> select a.id 订单编号,a.price 订单金额 from t_order a order by a.price desc limit 4,2;
+--------------+--------------+
| 订单编号     | 订单金额     |
+--------------+--------------+
|            1 |        88.95 |
|            5 |        20.88 |
+--------------+--------------+
2 rows in set (0.00 sec)
```

## 避免踩坑

### limit中不能使用表达式

```java
mysql> select * from t_order where limit 1,4+1;
ERROR 1064 (42000): You have an error in your SQL syntax; check the manual that corresponds to your MySQL server version for the right syntax to use near 'limit 1,4+1' at line 1
mysql> select * from t_order where limit 1+0;
ERROR 1064 (42000): You have an error in your SQL syntax; check the manual that corresponds to your MySQL server version for the right syntax to use near 'limit 1+0' at line 1
mysql>
```

**结论：limit后面只能够跟明确的数字。**

### limit后面的2个数字不能为负数

```plain
mysql> select * from t_order where limit -1;
ERROR 1064 (42000): You have an error in your SQL syntax; check the manual that corresponds to your MySQL server version for the right syntax to use near 'limit -1' at line 1
mysql> select * from t_order where limit 0,-1;
ERROR 1064 (42000): You have an error in your SQL syntax; check the manual that corresponds to your MySQL server version for the right syntax to use near 'limit 0,-1' at line 1
mysql> select * from t_order where limit -1,-1;
ERROR 1064 (42000): You have an error in your SQL syntax; check the manual that corresponds to your MySQL server version for the right syntax to use near 'limit -1,-1' at line 1
```

### 排序分页存在的坑

准备数据：

```java
mysql> insert into test1 (b) values (1),(2),(3),(4),(2),(2),(2),(2);
Query OK, 8 rows affected (0.01 sec)
Records: 8  Duplicates: 0  Warnings: 0

mysql> select * from test1;
+---+---+
| a | b |
+---+---+
| 1 | 1 |
| 2 | 2 |
| 3 | 3 |
| 4 | 4 |
| 5 | 2 |
| 6 | 2 |
| 7 | 2 |
| 8 | 2 |
+---+---+
8 rows in set (0.00 sec)

mysql> select * from test1 order by b asc;
+---+---+
| a | b |
+---+---+
| 1 | 1 |
| 2 | 2 |
| 5 | 2 |
| 6 | 2 |
| 7 | 2 |
| 8 | 2 |
| 3 | 3 |
| 4 | 4 |
+---+---+
8 rows in set (0.00 sec)
```

下面我们按照b升序，每页2条数据，来获取数据。

下面的sql依次为第1页、第2页、第3页、第4页、第5页的数据，如下：

```java
mysql> select * from test1 order by b asc limit 0,2;
+---+---+
| a | b |
+---+---+
| 1 | 1 |
| 2 | 2 |
+---+---+
2 rows in set (0.00 sec)

mysql> select * from test1 order by b asc limit 2,2;
+---+---+
| a | b |
+---+---+
| 8 | 2 |
| 6 | 2 |
+---+---+
2 rows in set (0.00 sec)

mysql> select * from test1 order by b asc limit 4,2;
+---+---+
| a | b |
+---+---+
| 6 | 2 |
| 7 | 2 |
+---+---+
2 rows in set (0.00 sec)

mysql> select * from test1 order by b asc limit 6,2;
+---+---+
| a | b |
+---+---+
| 3 | 3 |
| 4 | 4 |
+---+---+
2 rows in set (0.00 sec)

mysql> select * from test1 order by b asc limit 7,2;
+---+---+
| a | b |
+---+---+
| 4 | 4 |
+---+---+
1 row in set (0.00 sec)
```

**上面有2个问题：**

**问题1：看一下第2个sql和第3个sql，分别是第2页和第3页的数据，结果出现了相同的数据，是不是懵逼了。**

**问题2：整个表只有8条记录，怎么会出现第5页的数据呢，又懵逼了。**

我们来分析一下上面的原因：**主要是b字段存在相同的值，当排序过程中存在相同的值时，没有其他排序规则时，mysql懵逼了，不知道怎么排序了。**

就像我们上学站队一样，按照身高排序，那身高一样的时候如何排序呢？身高一样的就乱排了。

建议：排序中存在相同的值时，需要再指定一个排序规则，通过这种排序规则不存在二义性，比如上面可以再加上a降序，如下：

```java
mysql> select * from test1 order by b asc,a desc;
+---+---+
| a | b |
+---+---+
| 1 | 1 |
| 8 | 2 |
| 7 | 2 |
| 6 | 2 |
| 5 | 2 |
| 2 | 2 |
| 3 | 3 |
| 4 | 4 |
+---+---+
8 rows in set (0.00 sec)

mysql> select * from test1 order by b asc,a desc limit 0,2;
+---+---+
| a | b |
+---+---+
| 1 | 1 |
| 8 | 2 |
+---+---+
2 rows in set (0.00 sec)

mysql> select * from test1 order by b asc,a desc limit 2,2;
+---+---+
| a | b |
+---+---+
| 7 | 2 |
| 6 | 2 |
+---+---+
2 rows in set (0.00 sec)

mysql> select * from test1 order by b asc,a desc limit 4,2;
+---+---+
| a | b |
+---+---+
| 5 | 2 |
| 2 | 2 |
+---+---+
2 rows in set (0.00 sec)

mysql> select * from test1 order by b asc,a desc limit 6,2;
+---+---+
| a | b |
+---+---+
| 3 | 3 |
| 4 | 4 |
+---+---+
2 rows in set (0.00 sec)

mysql> select * from test1 order by b asc,a desc limit 8,2;
Empty set (0.00 sec)
```

看上面的结果，分页数据都正常了，第5页也没有数据了。

## 总结

*   order by … \[asc|desc\]用于对查询结果排序，asc：升序，desc：降序，asc|desc可以省略，默认为asc
*   limit用来限制查询结果返回的行数，有2个参数（offset，count），offset：表示跳过多少行，count：表示跳过offset行之后取count行
*   limit中offset可以省略，默认值为0
*   limit中offset 和 count都必须大于等于0
*   limit中offset和count的值不能用表达式
*   分页排序时，排序不要有二义性，二义性情况下可能会导致分页结果乱序，可以在后面追加一个主键排序

[下一篇：分组查询（group by、having）](http://www.itsoku.com/course/3/43)

[上一篇：select条件查询](http://www.itsoku.com/course/3/41)
