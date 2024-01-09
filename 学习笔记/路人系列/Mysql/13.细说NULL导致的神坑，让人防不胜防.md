

#    细说NULL导致的神坑，让人防不胜防   

[MySQL教程](http://www.itsoku.com/course/3)  ->  细说NULL导致的神坑，让人防不胜防

[上一篇：子查询（本篇非常重要，高手必备）](http://www.itsoku.com/course/3/46)

[下一篇：事务详解](http://www.itsoku.com/course/3/48)

这是Mysql系列第13篇。

环境：mysql5.7.25，cmd命令中进行演示。

**当数据的值为NULL的时候，可能出现各种意想不到的效果，让人防不胜防，我们来看看NULL导致的各种神坑，如何避免？**

## 比较运算符中使用NULL

> 认真看下面的效果

```java
mysql> select 1>NULL;
+--------+
| 1>NULL |
+--------+
|   NULL |
+--------+
1 row in set (0.00 sec)

mysql> select 1<NULL;
+--------+
| 1<NULL |
+--------+
|   NULL |
+--------+
1 row in set (0.00 sec)

mysql> select 1<>NULL;
+---------+
| 1<>NULL |
+---------+
|    NULL |
+---------+
1 row in set (0.00 sec)

mysql> select 1>NULL;
+--------+
| 1>NULL |
+--------+
|   NULL |
+--------+
1 row in set (0.00 sec)

mysql> select 1<NULL;
+--------+
| 1<NULL |
+--------+
|   NULL |
+--------+
1 row in set (0.00 sec)

mysql> select 1>=NULL;
+---------+
| 1>=NULL |
+---------+
|    NULL |
+---------+
1 row in set (0.00 sec)

mysql> select 1<=NULL;
+---------+
| 1<=NULL |
+---------+
|    NULL |
+---------+
1 row in set (0.00 sec)

mysql> select 1!=NULL;
+---------+
| 1!=NULL |
+---------+
|    NULL |
+---------+
1 row in set (0.00 sec)

mysql> select 1<>NULL;
+---------+
| 1<>NULL |
+---------+
|    NULL |
+---------+
1 row in set (0.00 sec)

mysql> select NULL=NULL,NULL!=NULL;
+-----------+------------+
| NULL=NULL | NULL!=NULL |
+-----------+------------+
|      NULL |       NULL |
+-----------+------------+
1 row in set (0.00 sec)

mysql> select 1 in (null),1 not in (null),null in (null),null not in (null);
+-------------+-----------------+----------------+--------------------+
| 1 in (null) | 1 not in (null) | null in (null) | null not in (null) |
+-------------+-----------------+----------------+--------------------+
|        NULL |            NULL |           NULL |               NULL |
+-------------+-----------------+----------------+--------------------+
1 row in set (0.00 sec)

mysql> select 1=any(select null),null=any(select null);
+--------------------+-----------------------+
| 1=any(select null) | null=any(select null) |
+--------------------+-----------------------+
|               NULL |                  NULL |
+--------------------+-----------------------+
1 row in set (0.00 sec)

mysql> select 1=all(select null),null=all(select null);
+--------------------+-----------------------+
| 1=all(select null) | null=all(select null) |
+--------------------+-----------------------+
|               NULL |                  NULL |
+--------------------+-----------------------+
1 row in set (0.00 sec)
```

**结论：任何值和NULL使用运算符（>、<、>=、<=、!=、<>）或者（in、not in、any/some、all）比较时，返回值都为NULL，NULL作为布尔值的时候，不为1也不为0。**

## 准备数据

```java
mysql> create table test1(a int,b int);
Query OK, 0 rows affected (0.01 sec)

mysql> insert into test1 values (1,1),(1,null),(null,null);
Query OK, 3 rows affected (0.00 sec)
Records: 3  Duplicates: 0  Warnings: 0

mysql> select * from test1;
+------+------+
| a    | b    |
+------+------+
|    1 |    1 |
|    1 | NULL |
| NULL | NULL |
+------+------+
3 rows in set (0.00 sec)
```

上面3条数据，认真看一下，特别是注意上面NULL的记录。

## IN、NOT IN和NULL比较

### IN和NULL比较

```java
mysql> select * from test1;
+------+------+
| a    | b    |
+------+------+
|    1 |    1 |
|    1 | NULL |
| NULL | NULL |
+------+------+
3 rows in set (0.00 sec)

mysql> select * from test1 where a in (null);
Empty set (0.00 sec)

mysql> select * from test1 where a in (null,1);
+------+------+
| a    | b    |
+------+------+
|    1 |    1 |
|    1 | NULL |
+------+------+
2 rows in set (0.00 sec)
```

**结论：当IN和NULL比较时，无法查询出为NULL的记录。**

### NOT IN 和NULL比较

```java
mysql> select * from test1 where a not in (1);
Empty set (0.00 sec)

mysql> select * from test1 where a not in (null);
Empty set (0.00 sec)

mysql> select * from test1 where a not in (null,2);
Empty set (0.00 sec)

mysql> select * from test1 where a not in (2);
+------+------+
| a    | b    |
+------+------+
|    1 |    1 |
|    1 | NULL |
+------+------+
2 rows in set (0.00 sec)
```

**结论：当NOT IN 后面有NULL值时，不论什么情况下，整个sql的查询结果都为空。**

## EXISTS、NOT EXISTS和NULL比较

```java
mysql> select * from test2;
+------+------+
| a    | b    |
+------+------+
|    1 |    1 |
|    1 | NULL |
| NULL | NULL |
+------+------+
3 rows in set (0.00 sec)

mysql> select * from test1 t1 where exists (select * from test2 t2 where t1.a = t2.a);
+------+------+
| a    | b    |
+------+------+
|    1 |    1 |
|    1 | NULL |
+------+------+
2 rows in set (0.00 sec)

mysql> select * from test1 t1 where not exists (select * from test2 t2 where t1.a = t2.a);
+------+------+
| a    | b    |
+------+------+
| NULL | NULL |
+------+------+
1 row in set (0.00 sec)
```

上面我们复制了表test1创建了表test2。

查询语句中使用exists、not exists对比test1.a=test2.a，**因为=不能比较NULL**，结果和预期一致。

## 判断NULL只能用IS NULL、IS NOT NULL

```java
mysql> select 1 is not null;
+---------------+
| 1 is not null |
+---------------+
|             1 |
+---------------+
1 row in set (0.00 sec)

mysql> select 1 is null;
+-----------+
| 1 is null |
+-----------+
|         0 |
+-----------+
1 row in set (0.00 sec)

mysql> select null is null;
+--------------+
| null is null |
+--------------+
|            1 |
+--------------+
1 row in set (0.00 sec)

mysql> select null is not null;
+------------------+
| null is not null |
+------------------+
|                0 |
+------------------+
1 row in set (0.00 sec)
```

看上面的效果，返回的结果为1或者0。

**结论：判断是否为空只能用IS NULL、IS NOT NULL。**

## 聚合函数中NULL的坑

### 示例

```java
mysql> select count(a),count(b),count(*) from test1;
+----------+----------+----------+
| count(a) | count(b) | count(*) |
+----------+----------+----------+
|        2 |        1 |        3 |
+----------+----------+----------+
1 row in set (0.00 sec)
```

count(a)返回了2行记录，a字段为NULL的没有统计出来。

count(b)返回了1行记录，为NULL的2行记录没有统计出来。

count(\*)可以统计所有数据，不论字段的数据是否为NULL。

### 再继续看

```java
mysql> select * from test1 where a is null;
+------+------+
| a    | b    |
+------+------+
| NULL | NULL |
+------+------+
1 row in set (0.00 sec)

mysql> select count(a) from test1 where a is null;
+----------+
| count(a) |
+----------+
|        0 |
+----------+
1 row in set (0.00 sec)
```

上面第1个sql使用is null查询出了结果，第2个sql中count(a)返回的是0行。

**结论：count(字段)无法统计字段为NULL的值，count(\*)可以统计值为null的行。**

## NULL不能作为主键的值

```java
mysql> create table test3(a int primary key,b int);
Query OK, 0 rows affected (0.01 sec)

mysql> insert into test3 values (null,1);
ERROR 1048 (23000): Column 'a' cannot be null
```

上面我们创建了一个表`test3`，字段`a`未指定不能为空，插入了一条NULL的数据，报错原因：`a 字段的值不能为NULL`，我们看一下表的创建语句：

```java
mysql> show create table test3;
+-------+------------+
| Table | Create Table      |
+-------+------------+
| test3 | CREATE TABLE `test3` (
  `a` int(11) NOT NULL,
  `b` int(11) DEFAULT NULL,
  PRIMARY KEY (`a`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8
+-------+------------+
1 row in set (0.00 sec)
```

从上面的脚本可以看出，当字段为主键的时候，字段会自动设置为`not null`。

**结论：当字段为主键的时候，字段会自动设置为not null。**

**看了上面这些还是比较晕，NULL的情况确实比较难以处理，容易出错，最有效的方法就是避免使用NULL。所以，强烈建议创建字段的时候字段不允许为NULL，设置一个默认值。**

## 总结

*   **NULL作为布尔值的时候，不为1也不为0**
*   **任何值和NULL使用运算符（>、<、>=、<=、!=、<>）或者（in、not in、any/some、all），返回值都为NULL**
*   **当IN和NULL比较时，无法查询出为NULL的记录**
*   **当NOT IN 后面有NULL值时，不论什么情况下，整个sql的查询结果都为空**
*   **判断是否为空只能用IS NULL、IS NOT NULL**
*   **count(字段)无法统计字段为NULL的值，count(\*)可以统计值为null的行**
*   **当字段为主键的时候，字段会自动设置为not null**
*   **NULL导致的坑让人防不胜防，强烈建议创建字段的时候字段不允许为NULL，给个默认值**

[下一篇：事务详解](http://www.itsoku.com/course/3/48)

[上一篇：子查询（本篇非常重要，高手必备）](http://www.itsoku.com/course/3/46)
