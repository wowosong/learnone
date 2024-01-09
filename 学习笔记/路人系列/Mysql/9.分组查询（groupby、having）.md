

#    分组查询（group by、having）   

[MySQL教程](http://www.itsoku.com/course/3)  ->  分组查询（group by、having）

[上一篇：排序和分页（order by 、limit）](http://www.itsoku.com/course/3/42)

[下一篇：常用函数汇总](http://www.itsoku.com/course/3/44)



这是Mysql系列第9篇。

环境：mysql5.7.25，cmd命令中进行演示。

## 本篇内容

*   [本篇内容](#%E6%9C%AC%E7%AF%87%E5%86%85%E5%AE%B9)
*   [分组查询](#%E5%88%86%E7%BB%84%E6%9F%A5%E8%AF%A2)
*   [聚合函数](#%E8%81%9A%E5%90%88%E5%87%BD%E6%95%B0)
*   [准备数据](#%E5%87%86%E5%A4%87%E6%95%B0%E6%8D%AE)
*   [单字段分组](#%E5%8D%95%E5%AD%97%E6%AE%B5%E5%88%86%E7%BB%84)
*   [多字段分组](#%E5%A4%9A%E5%AD%97%E6%AE%B5%E5%88%86%E7%BB%84)
*   [分组前筛选数据](#%E5%88%86%E7%BB%84%E5%89%8D%E7%AD%9B%E9%80%89%E6%95%B0%E6%8D%AE)
*   [分组后筛选数据](#%E5%88%86%E7%BB%84%E5%90%8E%E7%AD%9B%E9%80%89%E6%95%B0%E6%8D%AE)
*   [where和having的区别](#where%E5%92%8Chaving%E7%9A%84%E5%8C%BA%E5%88%AB)
*   [分组后排序](#%E5%88%86%E7%BB%84%E5%90%8E%E6%8E%92%E5%BA%8F)
*   [where & group by & having & order by & limit 一起协作](#where%20&%20group%20by%20&%20having%20&%20order%20by%20&%20limit%20%E4%B8%80%E8%B5%B7%E5%8D%8F%E4%BD%9C)
*   [mysql分组中的坑](#mysql%E5%88%86%E7%BB%84%E4%B8%AD%E7%9A%84%E5%9D%91)
    *   [示例](#%E7%A4%BA%E4%BE%8B)
*   [总结](#%E6%80%BB%E7%BB%93)
*   [最新资料](#%E6%9C%80%E6%96%B0%E8%B5%84%E6%96%99)
    

## 分组查询

**语法：**

```java
SELECT column, group_function,... FROM table
[WHERE condition]
GROUP BY group_by_expression
[HAVING group_condition];
```

> 说明：
> 
> group\_function：聚合函数。
> 
> group\_by\_expression：分组表达式，多个之间用逗号隔开。
> 
> group\_condition：分组之后对数据进行过滤。
> 
> 分组中，select后面只能有两种类型的列：
> 
> 1.  出现在group by后的列
> 2.  或者使用聚合函数的列

## 聚合函数

| 函数名称 | 作用 |
| --- | --- |
| max | 查询指定列的最大值 |
| min | 查询指定列的最小值 |
| count | 统计查询结果的行数 |
| sum | 求和，返回指定列的总和 |
| avg | 求平均值，返回指定列数据的平均值 |

分组时，可以使用使用上面的聚合函数。

## 准备数据

```java
drop table if exists t_order;

-- 创建订单表
create table t_order(
  id int not null AUTO_INCREMENT COMMENT '订单id',
  user_id bigint not null comment '下单人id',
  user_name varchar(16) not null default '' comment '用户名',
  price decimal(10,2) not null default 0 comment '订单金额',
  the_year SMALLINT not null comment '订单创建年份',
  PRIMARY KEY (id)
) comment '订单表';

-- 插入数据
insert into t_order(user_id,user_name,price,the_year) values
  (1001,'  喔喔松Java',11.11,'2017'),
  (1001,'  喔喔松Java',22.22,'2018'),
  (1001,'  喔喔松Java',88.88,'2018'),
  (1002,'刘德华',33.33,'2018'),
  (1002,'刘德华',12.22,'2018'),
  (1002,'刘德华',16.66,'2018'),
  (1002,'刘德华',44.44,'2019'),
  (1003,'张学友',55.55,'2018'),
  (1003,'张学友',66.66,'2019');
```

```java
mysql> select * from t_order;
+----+---------+---------------+-------+----------+
| id | user_id | user_name     | price | the_year |
+----+---------+---------------+-------+----------+
|  1 |    1001 |   喔喔松Java    | 11.11 |     2017 |
|  2 |    1001 |   喔喔松Java    | 22.22 |     2018 |
|  3 |    1001 |   喔喔松Java    | 88.88 |     2018 |
|  4 |    1002 | 刘德华        | 33.33 |     2018 |
|  5 |    1002 | 刘德华        | 12.22 |     2018 |
|  6 |    1002 | 刘德华        | 16.66 |     2018 |
|  7 |    1002 | 刘德华        | 44.44 |     2019 |
|  8 |    1003 | 张学友        | 55.55 |     2018 |
|  9 |    1003 | 张学友        | 66.66 |     2019 |
+----+---------+---------------+-------+----------+
9 rows in set (0.00 sec)
```

## 单字段分组

**需求：**查询每个用户下单数量，输出：用户id、下单数量，如下：

```java
mysql> SELECT 
            user_id 用户id, COUNT(id) 下单数量
        FROM
            t_order
        GROUP BY user_id;
+----------+--------------+
| 用户id   | 下单数量     |
+----------+--------------+
|     1001 |            3 |
|     1002 |            4 |
|     1003 |            2 |
+----------+--------------+
3 rows in set (0.00 sec)
```

## 多字段分组

**需求：**查询每个用户每年下单数量，输出字段：用户id、年份、下单数量，如下：

```java
mysql> SELECT 
            user_id 用户id, the_year 年份, COUNT(id) 下单数量
        FROM
            t_order
        GROUP BY user_id , the_year;
+----------+--------+--------------+
| 用户id   | 年份   | 下单数量     |
+----------+--------+--------------+
|     1001 |   2017 |            1 |
|     1001 |   2018 |            2 |
|     1002 |   2018 |            3 |
|     1002 |   2019 |            1 |
|     1003 |   2018 |            1 |
|     1003 |   2019 |            1 |
+----------+--------+--------------+
6 rows in set (0.00 sec)
```

## 分组前筛选数据

> 分组前对数据进行筛选，使用where关键字

**需求：**需要查询2018年每个用户下单数量，输出：用户id、下单数量，如下：

```java
mysql> SELECT 
            user_id 用户id, COUNT(id) 下单数量
        FROM
            t_order t
        WHERE
            t.the_year = 2018
        GROUP BY user_id;
+----------+--------------+
| 用户id   | 下单数量     |
+----------+--------------+
|     1001 |            2 |
|     1002 |            3 |
|     1003 |            1 |
+----------+--------------+
3 rows in set (0.00 sec)
```

## 分组后筛选数据

> 分组后对数据筛选，使用having关键字

**需求：**查询2018年订单数量大于1的用户，输出：用户id，下单数量，如下：

**方式1：**

```java
mysql> SELECT
          user_id 用户id, COUNT(id) 下单数量
        FROM
          t_order t
        WHERE
          t.the_year = 2018
        GROUP BY user_id
        HAVING count(id)>=2;
+----------+--------------+
| 用户id   | 下单数量     |
+----------+--------------+
|     1001 |            2 |
|     1002 |            3 |
+----------+--------------+
2 rows in set (0.00 sec)
```

**方式2：**

```java
mysql> SELECT
          user_id 用户id, count(id) 下单数量
        FROM
          t_order t
        WHERE
          t.the_year = 2018
        GROUP BY user_id
        HAVING 下单数量>=2;
+----------+--------------+
| 用户id   | 下单数量     |
+----------+--------------+
|     1001 |            2 |
|     1002 |            3 |
+----------+--------------+
2 rows in set (0.00 sec)
```

## where和having的区别

where是在分组（聚合）前对记录进行筛选，而having是在分组结束后的结果里筛选，最后返回整个sql的查询结果。

可以把having理解为两级查询，即含having的查询操作先获得不含having子句时的sql查询结果表，然后在这个结果表上使用having条件筛选出符合的记录，最后返回这些记录，因此，having后是可以跟聚合函数的，并且这个聚集函数不必与select后面的聚集函数相同。

## 分组后排序

**需求**：获取每个用户最大金额，然后按照最大金额倒序，输出：用户id，最大金额，如下：

```java
mysql> SELECT
          user_id 用户id, max(price) 最大金额
        FROM
          t_order t
        GROUP BY user_id
        ORDER BY 最大金额 desc;
+----------+--------------+
| 用户id   | 最大金额     |
+----------+--------------+
|     1001 |        88.88 |
|     1003 |        66.66 |
|     1002 |        44.44 |
+----------+--------------+
3 rows in set (0.00 sec)
```

## where & group by & having & order by & limit 一起协作

where、group by、having、order by、limit这些关键字一起使用时，先后顺序有明确的限制，语法如下：

```java
select 列 from 
表名
where [查询条件]
group by [分组表达式]
having [分组过滤条件]
order by [排序条件]
limit [offset,] count;
```

> **注意：**
> 
> **写法上面必须按照上面的顺序来写。**

**示例：**

**需求：**查询出2018年，下单数量大于等于2的，按照下单数量降序排序，最后只输出第1条记录，显示：用户id，下单数量，如下：

```java
mysql> SELECT
          user_id 用户id, COUNT(id) 下单数量
        FROM
          t_order t
        WHERE
          t.the_year = 2018
        GROUP BY user_id
        HAVING count(id)>=2
        ORDER BY 下单数量 DESC
        LIMIT 1;
+----------+--------------+
| 用户id   | 下单数量     |
+----------+--------------+
|     1002 |            3 |
+----------+--------------+
1 row in set (0.00 sec)
```

## mysql分组中的坑

本文开头有介绍，分组中select后面的列只能有2种：

1.  出现在group by后面的列
2.  使用聚合函数的列

oracle、sqlserver、db2中也是按照这种规范来的。

文中使用的是5.7版本，默认是按照这种规范来的。

mysql早期的一些版本，没有上面这些要求，select后面可以跟任何合法的列。

### 示例

**需求：获取每个用户下单的最大金额及下单的年份，输出：用户id，最大金额，年份，写法如下：**

```java
mysql> select
          user_id 用户id, max(price) 最大金额, the_year 年份
        FROM t_order t
        GROUP BY t.user_id;
ERROR 1055 (42000): Expression #3 of SELECT list is not in GROUP BY clause and contains nonaggregated column 'javacode2018.t.the_year' which is not functionally dependent on columns in GROUP BY clause; this is incompatible with sql_mode=only_full_group_by
```

上面的sql报错了，原因因为`the_year`不符合上面说的2条规则（select后面的列必须出现在group by中或者使用聚合函数），而`sql_mode`限制了这种规则，我们看一下`sql_mode`的配置：

```java
mysql> select @@sql_mode;
+-------------------------------------------------------------------------------------------------------------------------------------------+
| @@sql_mode                                                                                                                                |
+-------------------------------------------------------------------------------------------------------------------------------------------+
| ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION |
+-------------------------------------------------------------------------------------------------------------------------------------------+
1 row in set (0.00 sec)
```

sql\_mode中包含了`ONLY_FULL_GROUP_BY`，这个表示select后面的列必须符合上面的说的2点规范。

可以将`ONLY_FULL_GROUP_BY`去掉，select后面就可以加任意列了，我们来看一下效果。

修改mysql中的`my.ini`文件：

```java
sql_mode=STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION
```

重启mysql，再次运行，效果如下：

```java
mysql> select
          user_id 用户id, max(price) 最大金额, the_year 年份
        FROM t_order t
        GROUP BY t.user_id;
+----------+--------------+--------+
| 用户id   | 最大金额     | 年份   |
+----------+--------------+--------+
|     1001 |        88.88 |   2017 |
|     1002 |        44.44 |   2018 |
|     1003 |        66.66 |   2018 |
+----------+--------------+--------+
3 rows in set (0.03 sec)
```

看一下上面的数据，第一条`88.88`的年份是`2017`年，我们再来看一下原始数据：

```java
mysql> select * from t_order;
+----+---------+---------------+-------+----------+
| id | user_id | user_name     | price | the_year |
+----+---------+---------------+-------+----------+
|  1 |    1001 |   喔喔松Java    | 11.11 |     2017 |
|  2 |    1001 |   喔喔松Java    | 22.22 |     2018 |
|  3 |    1001 |   喔喔松Java    | 88.88 |     2018 |
|  4 |    1002 | 刘德华        | 33.33 |     2018 |
|  5 |    1002 | 刘德华        | 12.22 |     2018 |
|  6 |    1002 | 刘德华        | 16.66 |     2018 |
|  7 |    1002 | 刘德华        | 44.44 |     2019 |
|  8 |    1003 | 张学友        | 55.55 |     2018 |
|  9 |    1003 | 张学友        | 66.66 |     2019 |
+----+---------+---------------+-------+----------+
9 rows in set (0.00 sec)
```

对比一下，user\_id=1001、price=88.88是第3条数据，即the\_year是2018年，但是上面的分组结果是2017年，结果和我们预期的不一致，此时mysql对这种未按照规范来的列，乱序了，mysql取的是第一条。

**正确的写法，提供两种，如下：**

```java
mysql> SELECT
          user_id 用户id,
          price 最大金额,
          the_year 年份
        FROM
          t_order t1
        WHERE
          (t1.user_id , t1.price)
          IN
          (SELECT
             t.user_id, MAX(t.price)
           FROM
             t_order t
           GROUP BY t.user_id);
+----------+--------------+--------+
| 用户id   | 最大金额     | 年份   |
+----------+--------------+--------+
|     1001 |        88.88 |   2018 |
|     1002 |        44.44 |   2019 |
|     1003 |        66.66 |   2019 |
+----------+--------------+--------+
3 rows in set (0.00 sec)

mysql> SELECT
          user_id 用户id,
          price 最大金额,
          the_year 年份
        FROM
          t_order t1,(SELECT
                        t.user_id uid, MAX(t.price) pc
                      FROM
                        t_order t
                      GROUP BY t.user_id) t2
        WHERE
          t1.user_id = t2.uid
        AND  t1.price = t2.pc;
+----------+--------------+--------+
| 用户id   | 最大金额     | 年份   |
+----------+--------------+--------+
|     1001 |        88.88 |   2018 |
|     1002 |        44.44 |   2019 |
|     1003 |        66.66 |   2019 |
+----------+--------------+--------+
3 rows in set (0.00 sec)
```

上面第1种写法，比较少见，`in`中使用了多字段查询。

**建议：在写分组查询的时候，最好按照标准的规范来写，select后面出现的列必须在group by中或者必须使用聚合函数。**

## 总结

1.  在写分组查询的时候，最好按照标准的规范来写，**select后面出现的列必须在group by中或者必须使用聚合函数**。
2.  select语法顺序：select、from、where、group by、having、order by、limit，顺序不能搞错了，否则报错。
3.  **in多列查询的使用，下去可以试试**

[下一篇：常用函数汇总](http://www.itsoku.com/course/3/44)

[上一篇：排序和分页（order by 、limit）](http://www.itsoku.com/course/3/42)
