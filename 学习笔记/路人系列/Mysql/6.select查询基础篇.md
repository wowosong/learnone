

#    select查下基础篇   

[MySQL教程](http://www.itsoku.com/course/3)  ->  select查下基础篇

[上一篇：DML常见操作](http://www.itsoku.com/course/3/39)

[下一篇：select条件查询](http://www.itsoku.com/course/3/41)


这是Mysql系列第6篇。

环境：mysql5.7.25，cmd命令中进行演示。

DQL(Data QueryLanguage)：数据查询语言，通俗点讲就是从数据库获取数据的，按照DQL的语法给数据库发送一条指令，数据库将按需求返回数据。

DQL分多篇来说，本文属于第1篇。

## 基本语法

```java
select 查询的列 from 表名;
```

注意：

select语句中不区分大小写，SELECT和select、FROM和from效果一样。

查询的结果放在一个表格中，表格的第1行称为列头，第2行开始是数据，类属于一个二维数组。

## 查询常量

```java
select 常量值1,常量值2,常量值3;
```

如：

```java
mysql> select 1,'b';
+---+---+
| 1 | b |
+---+---+
| 1 | b |
+---+---+
1 row in set (0.00 sec)
```

## 查询表达式

```java
select 表达式;
```

如：

```java
mysql> select 1+2,3*10,10/3;
+-----+------+--------+
| 1+2 | 3*10 | 10/3   |
+-----+------+--------+
|   3 |   30 | 3.3333 |
+-----+------+--------+
1 row in set (0.00 sec)
```

## 查询函数

```java
select 函数;
```

如：

```java
mysql> select mod(10,4),isnull(null),ifnull(null,'第一个参数为空返回这个值'),ifnull(1,'第一个参数为空返回这个值，否知返回第一个参数');
+-----------+--------------+-----------------------------------------------------+--------------------------------------------------------------------------------+
| mod(10,4) | isnull(null) | ifnull(null,'第一个参数为空返回这个值')             | ifnull(1,'第一个参数为空返回这个值，否知返回第一个参数')                       |
+-----------+--------------+-----------------------------------------------------+--------------------------------------------------------------------------------+
|         2 |            1 | 第一个参数为空返回这个值                            | 1                                                                              |
+-----------+--------------+-----------------------------------------------------+--------------------------------------------------------------------------------+
1 row in set (0.00 sec)
```

说明一下：

mod函数，对两个参数取模运算。

isnull函数，判断参数是否为空，若为空返回1，否则返回0。

ifnull函数，2个参数，判断第一个参数是否为空，如果为空返回第2个参数的值，否则返回第1个参数的值。

## 查询指定的字段

```java
select 字段1,字段2,字段3 from 表名;
```

如：

```java
mysql> drop table if exists test1;
Query OK, 0 rows affected (0.01 sec)

mysql> create table test1(a int not null comment '字段a',b varchar(10) not null default '' comment '字段b');
Query OK, 0 rows affected (0.01 sec)

mysql> insert into test1 values(1,'a'),(2,'b'),(3,'c');
Query OK, 3 rows affected (0.01 sec)
Records: 3  Duplicates: 0  Warnings: 0

mysql> select a,b from test1;
+---+---+
| a | b |
+---+---+
| 1 | a |
| 2 | b |
| 3 | c |
+---+---+
3 rows in set (0.00 sec)
```

说明：

test1表有两个字段a、b，`select a,b from test1;`用于查询`test1`中两个字段的数据。

## 查询所有列

```java
select * from 表名
```

**说明：**

\*表示返回表中所有字段。

如：

```java
mysql> select * from test1;
+---+---+
| a | b |
+---+---+
| 1 | a |
| 2 | b |
| 3 | c |
+---+---+
3 rows in set (0.00 sec)
```

## 列别名

在创建数据表时，一般都会使用英文单词或英文单词缩写来设置字段名，在查询时列名都会以英文的形式显示，这样会给用户查看数据带来不便，这种情况可以使用别名来代替英文列名，增强阅读性。

**语法：**

```java
select 列 [as] 别名 from 表;
```

**使用双引号创建别名:**

```java
mysql> select a "列1",b "列2" from test1;
+------+------+
| 列1  | 列2  |
+------+------+
|    1 | a    |
|    2 | b    |
|    3 | c    |
+------+------+
3 rows in set (0.00 sec)
```

**使用单引号创建别名：**

```java
mysql> select a '列1',b '列2' from test1;;
+------+------+
| 列1  | 列2  |
+------+------+
|    1 | a    |
|    2 | b    |
|    3 | c    |
+------+------+
3 rows in set (0.00 sec)
```

**不用引号创建别名：**

```java
mysql> select a 列1,b 列2 from test1;
+------+------+
| 列1  | 列2  |
+------+------+
|    1 | a    |
|    2 | b    |
|    3 | c    |
+------+------+
3 rows in set (0.00 sec)
```

**使用as创建别名：**

```java
mysql> select a as 列1,b as 列 2 from test1;
ERROR 1064 (42000): You have an error in your SQL syntax; check the manual that corresponds to your MySQL server version for the right syntax to use near '2 from test1' at line 1
mysql> select a as 列1,b as '列 2' from test1;
+------+-------+
| 列1  | 列 2  |
+------+-------+
|    1 | a     |
|    2 | b     |
|    3 | c     |
+------+-------+
3 rows in set (0.00 sec)
```

> 别名中有特殊符号的，比如空格，此时别名必须用引号引起来。

**懵逼示例，看效果：**

```java
mysql> select 'a' 'b';
+----+
| a  |
+----+
| ab |
+----+
1 row in set (0.00 sec)

mysql> select 'a' b;
+---+
| b |
+---+
| a |
+---+
1 row in set (0.00 sec)

mysql> select 'a' "b";
+----+
| a  |
+----+
| ab |
+----+
1 row in set (0.00 sec)

mysql> select 'a' as "b";
+---+
| b |
+---+
| a |
+---+
1 row in set (0.00 sec)
```

认真看一下第1个和第3个返回的结果（列头和数据），是不是懵逼状态，建议这种的最好使用**as**，as后面跟上别名。

## 表别名

```java
select 别名.字段,别名.* from 表名 [as] 别名;
```

如：

```java
mysql> select t.a,t.b from test1 as t;
+---+---+
| a | b |
+---+---+
| 1 | a |
| 2 | b |
| 3 | c |
+---+---+
3 rows in set (0.00 sec)

mysql> select t.a as '列 1',t.b as 列2 from test1 as t;
+-------+------+
| 列 1  | 列2  |
+-------+------+
|     1 | a    |
|     2 | b    |
|     3 | c    |
+-------+------+
3 rows in set (0.00 sec)

mysql> select t.* from test1 as t;                   ;;
+---+---+
| a | b |
+---+---+
| 1 | a |
| 2 | b |
| 3 | c |
+---+---+
3 rows in set (0.00 sec)

mysql> select * from test1 as t;
+---+---+
| a | b |
+---+---+
| 1 | a |
| 2 | b |
| 3 | c |
+---+---+
3 rows in set (0.00 sec)
```

## 总结

*   **建议别名前面跟上as关键字**
    
*   **查询数据的时候，避免使用select \*，建议需要什么字段写什么字段**
    

[下一篇：select条件查询](http://www.itsoku.com/course/3/41)

[上一篇：DML常见操作](http://www.itsoku.com/course/3/39)
