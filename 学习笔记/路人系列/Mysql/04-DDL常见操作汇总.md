

#    DDL常见操作汇总   

环境：mysql5.7.25，cmd命令中进行演示。

DDL：Data Define Language数据定义语言，主要用来对数据库、表进行一些管理操作。

如：建库、删库、建表、修改表、删除表、对列的增删改等等。

文中涉及到的语法用\[\]包含的内容属于可选项，下面做详细说明。

## 库的管理

### 创建库

```java
create database [if not exists] 库名;
```

### 删除库

```java
drop databases [if exists] 库名;
```

### 建库通用的写法

```java
drop database if exists 旧库名;
create database 新库名;
```

### 示例

```java
mysql> show databases like 'javacode2018';
+-------------------------+
| Database (javacode2018) |
+-------------------------+
| javacode2018            |
+-------------------------+
1 row in set (0.00 sec)

mysql> drop database if exists javacode2018;
Query OK, 0 rows affected (0.00 sec)

mysql> show databases like 'javacode2018';
Empty set (0.00 sec)

mysql> create database javacode2018;
Query OK, 1 row affected (0.00 sec)
```

`show databases like 'javacode2018';`列出`javacode2018`库信息。

## 表管理

### 创建表

```java
create table 表名(
    字段名1 类型[(宽度)] [约束条件] [comment '字段说明'],
    字段名2 类型[(宽度)] [约束条件] [comment '字段说明'],
    字段名3 类型[(宽度)] [约束条件] [comment '字段说明']
)[表的一些设置];
```

**注意：**

1.  在同一张表中，字段名不能相同
2.  宽度和约束条件为可选参数，字段名和类型是必须的
3.  最后一个字段后不能加逗号
4.  类型是用来限制 字段 必须以何种数据类型来存储记录
5.  类型其实也是对字段的约束(约束字段下的记录必须为XX类型)
6.  类型后写的 约束条件 是在类型之外的 额外添加的约束

**约束说明**

**not null**：标识该字段不能为空

```java
mysql> create table test1(a int not null comment '字段a');
Query OK, 0 rows affected (0.01 sec)

mysql> insert into test1 values (null);
ERROR 1048 (23000): Column 'a' cannot be null
mysql> insert into test1 values (1);
Query OK, 1 row affected (0.00 sec)

mysql> select * from test1;
+---+
| a |
+---+
| 1 |
+---+
1 row in set (0.00 sec)
```

**default value**：为该字段设置默认值，默认值为value

```java
mysql> drop table IF EXISTS test2;
Query OK, 0 rows affected (0.01 sec)

mysql> create table test2(
    ->   a int not null comment '字段a',
    ->   b int not null default 0 comment '字段b'
    -> );
Query OK, 0 rows affected (0.02 sec)

mysql> insert into test2(a) values (1);
Query OK, 1 row affected (0.00 sec)

mysql> select *from test2;
+---+---+
| a | b |
+---+---+
| 1 | 0 |
+---+---+
1 row in set (0.00 sec)
```

> 上面插入时未设置b的值，自动取默认值0

**primary key**：标识该字段为该表的主键，可以唯一的标识记录，插入重复的会报错

两种写法，如下：

方式1：跟在列后，如下：

```java
mysql> drop table IF EXISTS test3;
Query OK, 0 rows affected, 1 warning (0.00 sec)

mysql> create table test3(
    ->   a int not null comment '字段a' primary key
    -> );
Query OK, 0 rows affected (0.01 sec)

mysql> insert into test3 (a) values (1);
Query OK, 1 row affected (0.01 sec)

mysql> insert into test3 (a) values (1);
ERROR 1062 (23000): Duplicate entry '1' for key 'PRIMARY'
```

方式2：在所有列定义之后定义，如下：

```java
mysql> drop table IF EXISTS test4;
Query OK, 0 rows affected, 1 warning (0.00 sec)

mysql> create table test4(
    ->   a int not null comment '字段a',
    ->   b int not null default 0 comment '字段b',
    ->   primary key(a)
    -> );
Query OK, 0 rows affected (0.02 sec)

mysql> insert into test4(a,b) values (1,1);
Query OK, 1 row affected (0.00 sec)

mysql> insert into test4(a,b) values (1,2);
ERROR 1062 (23000): Duplicate entry '1' for key 'PRIMARY'
```

> 插入重复的值，会报违法主键约束

方式2支持多字段作为主键，多个之间用逗号隔开，语法：primary key(字段1,字段2,字段n)，示例：

```java
mysql> drop table IF EXISTS test7;
Query OK, 0 rows affected, 1 warning (0.00 sec)

mysql>
mysql> create table test7(
    ->    a int not null comment '字段a',
    ->    b int not null comment '字段b',
    ->   PRIMARY KEY (a,b)
    ->  );
Query OK, 0 rows affected (0.02 sec)

mysql>
mysql> insert into test7(a,b) VALUES (1,1);
Query OK, 1 row affected (0.00 sec)

mysql> insert into test7(a,b) VALUES (1,1);
ERROR 1062 (23000): Duplicate entry '1-1' for key 'PRIMARY'
```

**foreign key**：为表中的字段设置外键

**语法：foreign key(当前表的列名) references 引用的外键表(外键表中字段名称)**

```java
mysql> drop table IF EXISTS test6;
Query OK, 0 rows affected (0.01 sec)

mysql> drop table IF EXISTS test5;
Query OK, 0 rows affected (0.01 sec)

mysql>
mysql> create table test5(
    ->   a int not null comment '字段a' primary key
    -> );
Query OK, 0 rows affected (0.02 sec)

mysql>
mysql> create table test6(
    ->   b int not null comment '字段b',
    ->   ts5_a int not null,
    ->   foreign key(ts5_a) references test5(a)
    -> );
Query OK, 0 rows affected (0.01 sec)

mysql> insert into test5 (a) values (1);
Query OK, 1 row affected (0.00 sec)

mysql> insert into test6 (b,test6.ts5_a) values (1,1);
Query OK, 1 row affected (0.00 sec)

mysql> insert into test6 (b,test6.ts5_a) values (2,2);
ERROR 1452 (23000): Cannot add or update a child row: a foreign key constraint fails (`javacode2018`.`test6`, CONSTRAINT `test6_ibfk_1` FOREIGN KEY (`ts5_a`) REFERENCES `test5` (`a`))
```

> 说明：表示test6中ts5\_a字段的值来源于表test5中的字段a。
> 
> 注意几点：
> 
> *   两张表中需要建立外键关系的字段类型需要一致
> *   要设置外键的字段不能为主键
> *   被引用的字段需要为主键
> *   被插入的值在外键表必须存在，如上面向test6中插入ts5\_a为2的时候报错了，原因：2的值在test5表中不存在

**unique key(uq)**：标识该字段的值是唯一的

支持一个到多个字段，插入重复的值会报违反唯一约束，会插入失败。

定义有2种方式。

方式1：跟在字段后，如下：

```java
mysql> drop table IF EXISTS test8;
Query OK, 0 rows affected, 1 warning (0.00 sec)

mysql>
mysql> create table test8(
    ->    a int not null comment '字段a' unique key
    ->  );
Query OK, 0 rows affected (0.01 sec)

mysql>
mysql> insert into test8(a) VALUES (1);
Query OK, 1 row affected (0.00 sec)

mysql> insert into test8(a) VALUES (1);
ERROR 1062 (23000): Duplicate entry '1' for key 'a'
```

方式2：所有列定义之后定义，如下：

```java
mysql> drop table IF EXISTS test9;
Query OK, 0 rows affected, 1 warning (0.00 sec)

mysql>
mysql> create table test9(
    ->    a int not null comment '字段a',
    ->   unique key(a)
    ->  );
Query OK, 0 rows affected (0.01 sec)

mysql>
mysql> insert into test9(a) VALUES (1);
Query OK, 1 row affected (0.00 sec)

mysql> insert into test9(a) VALUES (1);
ERROR 1062 (23000): Duplicate entry '1' for key 'a'
```

方式2支持多字段，多个之间用逗号隔开，语法：primary key(字段1,字段2,字段n)，示例：

```java
mysql> drop table IF EXISTS test10;
Query OK, 0 rows affected, 1 warning (0.00 sec)

mysql>
mysql> create table test10(
    ->   a int not null comment '字段a',
    ->   b int not null comment '字段b',
    ->   unique key(a,b)
    -> );
Query OK, 0 rows affected (0.01 sec)

mysql>
mysql> insert into test10(a,b) VALUES (1,1);
Query OK, 1 row affected (0.00 sec)

mysql> insert into test10(a,b) VALUES (1,1);
ERROR 1062 (23000): Duplicate entry '1-1' for key 'a'
```

**auto\_increment**：标识该字段的值自动增长（整数类型，而且为主键）

```java
mysql> drop table IF EXISTS test11;
Query OK, 0 rows affected, 1 warning (0.00 sec)

mysql>
mysql> create table test11(
    ->   a int not null AUTO_INCREMENT PRIMARY KEY comment '字段a',
    ->   b int not null comment '字段b'
    -> );
Query OK, 0 rows affected (0.01 sec)

mysql>
mysql> insert into test11(b) VALUES (10);
Query OK, 1 row affected (0.00 sec)

mysql> insert into test11(b) VALUES (20);
Query OK, 1 row affected (0.00 sec)

mysql> select * from test11;
+---+----+
| a | b  |
+---+----+
| 1 | 10 |
| 2 | 20 |
+---+----+
2 rows in set (0.00 sec)
```

> 字段a为自动增长，默认值从1开始，每次+1
> 
> 关于自动增长字段的初始值、步长可以在mysql中进行设置，比如设置初始值为1万，每次增长10

**注意：**

**自增长列当前值存储在内存中，数据库每次重启之后，会查询当前表中自增列的最大值作为当前值，如果表数据被清空之后，数据库重启了，自增列的值将从初始值开始**

我们来演示一下：

```java
mysql> delete from test11;
Query OK, 2 rows affected (0.00 sec)

mysql> insert into test11(b) VALUES (10);
Query OK, 1 row affected (0.00 sec)

mysql> select * from test11;
+---+----+
| a | b  |
+---+----+
| 3 | 10 |
+---+----+
1 row in set (0.00 sec)
```

上面删除了test11数据，然后插入了一条，a的值为3，执行下面操作：

> 删除test11数据，重启mysql，插入数据，然后看a的值是不是被初始化了？如下：

```java
mysql> delete from test11;
Query OK, 1 row affected (0.00 sec)

mysql> select * from test11;
Empty set (0.00 sec)

mysql> exit
Bye

C:\Windows\system32>net stop mysql
mysql 服务正在停止..
mysql 服务已成功停止。


C:\Windows\system32>net start mysql
mysql 服务正在启动 .
mysql 服务已经启动成功。


C:\Windows\system32>mysql -uroot -p
Enter password: *******
Welcome to the MySQL monitor.  Commands end with ; or \g.
Your MySQL connection id is 2
Server version: 5.7.25-log MySQL Community Server (GPL)

Copyright (c) 2000, 2019, Oracle and/or its affiliates. All rights reserved.

Oracle is a registered trademark of Oracle Corporation and/or its
affiliates. Other names may be trademarks of their respective
owners.

Type 'help;' or '\h' for help. Type '\c' to clear the current input statement.

mysql> use javacode2018;
Database changed
mysql> select * from test11;
Empty set (0.01 sec)

mysql> insert into test11 (b) value (100);
Query OK, 1 row affected (0.00 sec)

mysql> select * from test11;
+---+-----+
| a | b   |
+---+-----+
| 1 | 100 |
+---+-----+
1 row in set (0.00 sec)
```

### 删除表

```java
drop table [if exists] 表名;
```

### 修改表名

```java
alter table 表名 rename [to] 新表名;
```

### 表设置备注

```java
alter table 表名 comment '备注信息';
```

### 复制表

#### 只复制表结构

```java
create table 表名 like 被复制的表名;
```

如：

```java
mysql> create table test12 like test11;
Query OK, 0 rows affected (0.01 sec)

mysql> select * from test12;
Empty set (0.00 sec)

mysql> show create table test12;
+--------+-------+
| Table  | Create Table                                                                                                                                           
+--------+-------+
| test12 | CREATE TABLE `test12` (
  `a` int(11) NOT NULL AUTO_INCREMENT COMMENT '字段a',
  `b` int(11) NOT NULL COMMENT '字段b',
  PRIMARY KEY (`a`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8     |
+--------+-------+
1 row in set (0.00 sec)
```

#### 复制表结构+数据

```java
create table 表名 [as] select 字段,... from 被复制的表 [where 条件];
```

如：

```java
mysql> create table test13 as select * from test11;
Query OK, 1 row affected (0.02 sec)
Records: 1  Duplicates: 0  Warnings: 0

mysql> select * from test13;
+---+-----+
| a | b   |
+---+-----+
| 1 | 100 |
+---+-----+
1 row in set (0.00 sec)
```

表结构和数据都过来了。

## 表中列的管理

### 添加列

```java
alter table 表名 add column 列名 类型 [列约束];
```

示例：

```java
mysql> drop table IF EXISTS test14;
Query OK, 0 rows affected, 1 warning (0.00 sec)

mysql>
mysql> create table test14(
    ->   a int not null AUTO_INCREMENT PRIMARY KEY comment '字段a'
    -> );
Query OK, 0 rows affected (0.02 sec)

mysql> alter table test14 add column b int not null default 0 comment '字段b';
Query OK, 0 rows affected (0.03 sec)
Records: 0  Duplicates: 0  Warnings: 0

mysql> alter table test14 add column c int not null default 0 comment '字段c';
Query OK, 0 rows affected (0.05 sec)
Records: 0  Duplicates: 0  Warnings: 0

mysql> insert into test14(b) values (10);
Query OK, 1 row affected (0.00 sec)

mysql> select * from test14;                                                 c
+---+----+---+
| a | b  | c |
+---+----+---+
| 1 | 10 | 0 |
+---+----+---+
1 row in set (0.00 sec)
```

### 修改列

```java
alter table 表名 modify column 列名 新类型 [约束];
或者
alter table 表名 change column 列名 新列名 新类型 [约束];
```

**2种方式区别：modify不能修改列名，change可以修改列名**

我们看一下test14的表结构：

```java
mysql> show create table test14;
+--------+--------+
| Table  | Create Table |
+--------+--------+
| test14 | CREATE TABLE `test14` (
  `a` int(11) NOT NULL AUTO_INCREMENT COMMENT '字段a',
  `b` int(11) NOT NULL DEFAULT '0' COMMENT '字段b',
  `c` int(11) NOT NULL DEFAULT '0' COMMENT '字段c',
  PRIMARY KEY (`a`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8       |
+--------+--------+
1 row in set (0.00 sec)
```

我们将字段c名字及类型修改一下，如下:

```java
mysql> alter table test14 change column c d varchar(10) not null default '' comment '字段d';
Query OK, 0 rows affected (0.01 sec)
Records: 0  Duplicates: 0  Warnings: 0

mysql> show create table test14;                                                          ;;
+--------+--------+
| Table  | Create Table |
+--------+--------+
| test14 | CREATE TABLE `test14` (
  `a` int(11) NOT NULL AUTO_INCREMENT COMMENT '字段a',
  `b` int(11) NOT NULL DEFAULT '0' COMMENT '字段b',
  `d` varchar(10) NOT NULL DEFAULT '' COMMENT '字段d',
  PRIMARY KEY (`a`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8       |
+--------+--------+
1 row in set (0.00 sec)
```

### 删除列

```java
alter table 表名 drop column 列名;
```

示例：

```java
mysql> alter table test14 drop column d;
Query OK, 0 rows affected (0.05 sec)
Records: 0  Duplicates: 0  Warnings: 0

mysql> show create table test14;
+--------+--------+
| Table  | Create Table |
+--------+--------+
| test14 | CREATE TABLE `test14` (
  `a` int(11) NOT NULL AUTO_INCREMENT COMMENT '字段a',
  `b` int(11) NOT NULL DEFAULT '0' COMMENT '字段b',
  PRIMARY KEY (`a`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8     |
+--------+--------+
1 row in set (0.00 sec)
```
