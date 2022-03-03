

#    DML常见操作   

[MySQL教程](http://www.itsoku.com/course/3)  ->  DML常见操作    

[上一篇：DDL常见操作汇总](http://www.itsoku.com/course/3/38)

[下一篇：select查下基础篇](http://www.itsoku.com/course/3/40)

这是Mysql系列第5篇。

环境：mysql5.7.25，cmd命令中进行演示。

DML(Data Manipulation Language)数据操作语言，以INSERT、UPDATE、DELETE三种指令为核心，分别代表插入、更新与删除，**是必须要掌握的指令**，DML和SQL中的select熟称CRUD（增删改查）。

文中涉及到的语法用\[\]包含的内容属于可选项，下面做详细说明。

## 插入操作

### 插入单行2种方式

#### 方式1

```java
insert into 表名[(字段,字段)] values (值,值);
```

> **说明：**
> 
> 值和字段需要一一对应
> 
> 如果是字符型或日期类型，值需要用单引号引起来；如果是数值类型，不需要用单引号
> 
> 字段和值的个数必须一致，位置对应
> 
> 字段如果不能为空，则必须插入值
> 
> 可以为空的字段可以不用插入值，但需要注意：字段和值都不写；或字段写上，值用null代替
> 
> 表名后面的字段可以省略不写，此时表示所有字段，顺序和表中字段顺序一致。

#### 方式2

```java
insert into 表名 set 字段 = 值,字段 = 值;
```

方式2不常见，建议使用方式1

### 批量插入2种方式

#### 方式1

```java
insert into 表名 [(字段,字段)] values (值,值),(值,值),(值,值);
```

#### 方式2

```java
insert into 表 [(字段,字段)]
数据来源select语句;
```

> **说明：**
> 
> 数据来源select语句可以有很多种写法，需要注意：select返回的结果和插入数据的字段数量、顺序、类型需要一致。
> 
> 关于select的写法后面文章会详细介绍。

如：

```sql
-- 删除test1
drop table if exists test1;
-- 创建test1
create table test1(a int,b int);
-- 删除test2
drop table if exists test2;
-- 创建test2
create table test2(c1 int,c2 int,c3 int);
-- 向test2中插入数据
insert into test2 values (100,101,102),(200,201,202),(300,301,302),(400,401,402);
-- 向test1中插入数据
insert into test1 (a,b) select 1,1 union all select 2,2 union all select 2,2;
-- 向test1插入数据，数据来源于test2表
insert into test1 (a,b) select c2,c3 from test2 where c1>=200;

select * from test1;

mysql> select * from test1;
+------+------+
| a    | b    |
+------+------+
|    1 |    1 |
|    2 |    2 |
|    2 |    2 |
|  201 |  202 |
|  301 |  302 |
|  401 |  402 |

mysql> select * from test2;
+------+------+------+
| c1   | c2   | c3   |
+------+------+------+
|  100 |  101 |  102 |
|  200 |  201 |  202 |
|  300 |  301 |  302 |
|  400 |  401 |  402 |
+------+------+------+
4 rows in set (0.00 sec)
```

## 数据更新

### 单表更新

#### 语法：

```java
update 表名 [[as] 别名] set [别名.]字段 = 值,[别名.]字段 = 值 [where条件];
```

> 有些表名可能名称比较长，为了方便操作，可以给这个表名起个简单的别名，更方便操作一些。
> 
> 如果无别名的时候，表名就是别名。

#### 示例：

```java
mysql> update test1 t set t.a = 2;
Query OK, 4 rows affected (0.00 sec)
Rows matched: 6  Changed: 4  Warnings: 0

mysql> update test1 as t set t.a = 3;
Query OK, 6 rows affected (0.00 sec)
Rows matched: 6  Changed: 6  Warnings: 0

mysql> update test1 set a = 1,b=2;
Query OK, 6 rows affected (0.00 sec)
Rows matched: 6  Changed: 6  Warnings: 0
```

### 多表更新

> 可以同时更新多个表中的数据

#### 语法：

```java
update 表1 [[as] 别名1],表名2 [[as] 别名2]
set [别名.]字段 = 值,[别名.]字段 = 值
[where条件]
```

#### 示例：

```java
-- 无别名方式
update test1,test2 set test1.a = 2 ,test1.b = 2, test2.c1 = 10;
-- 无别名方式
update test1,test2 set test1.a = 2 ,test1.b = 2, test2.c1 = 10 where test1.a = test2.c1;
-- 别名方式更新
update test1 t1,test2 t2 set t1.a = 2 ,t1.b = 2, t2.c1 = 10 where t1.a = t2.c1;
-- 别名的方式更新多个表的多个字段
update test1 as t1,test2 t2 set t1.a = 2 ,t1.b = 2, t2.c1 = 10 where t1.a = t2.c1;
```

### 使用建议

建议采用单表方式更新，方便维护。

## 删除数据操作

### 使用delete删除

#### delete单表删除

```java
delete [别名] from 表名 [[as] 别名] [where条件];
```

> 注意：
> 
> 如果无别名的时候，表名就是别名
> 
> 如果有别名，delete后面必须写别名
> 
> 如果没有别名，delete后面的别名可以省略不写。

#### 示例

```java
-- 删除test1表所有记录
delete from test1;
-- 删除test1表所有记录
delete test1 from test1;
-- 有别名的方式，删除test1表所有记录
delete t1 from test1 t1;
-- 有别名的方式删除满足条件的记录
delete t1 from test1 t1 where t1.a>100;
```

> 上面的4种写法，大家可以认真看一下。

#### 多表删除

> 可以同时删除多个表中的记录，语法如下：

```java
delete [别名1,别名2] from 表1 [[as] 别名1],表2 [[as] 别名2] [where条件];
```

> 说明：
> 
> 别名可以省略不写，但是需要在delete后面跟上表名，多个表名之间用逗号隔开。

#### 示例1

```java
delete t1 from test1 t1,test2 t2 where t1.a=t2.c2;
```

> 删除test1表中的记录，条件是这些记录的字段a在test.c2中存在的记录

看一下运行效果：

```java
-- 删除test1
drop table if exists test1;
-- 创建test1
create table test1(a int,b int);
-- 删除test2
drop table if exists test2;
-- 创建test2
create table test2(c1 int,c2 int,c3 int);
-- 向test2中插入数据
insert into test2 values (100,101,102),(200,201,202),(300,301,302),(400,401,402);
-- 向test1中插入数据
insert into test1 (a,b) select 1,1 union all select 2,2 union all select 2,2;
-- 向test1插入数据，数据来源于test2表
insert into test1 (a,b) select c2,c3 from test2 where c1>=200;

mysql> select * from test1;
+------+------+
| a    | b    |
+------+------+
|    1 |    1 |
|    2 |    2 |
|    2 |    2 |
|  201 |  202 |
|  301 |  302 |
|  401 |  402 |

mysql> select * from test2;
+------+------+------+
| c1   | c2   | c3   |
+------+------+------+
|  100 |  101 |  102 |
|  200 |  201 |  202 |
|  300 |  301 |  302 |
|  400 |  401 |  402 |
+------+------+------+
4 rows in set (0.00 sec)

mysql> delete t1 from test1 t1,test2 t2 where t1.a=t2.c2;
Query OK, 3 rows affected (0.00 sec)

mysql> select * from test1;
+------+------+
| a    | b    |
+------+------+
|    1 |    1 |
|    2 |    2 |
|    2 |    2 |
+------+------+
3 rows in set (0.00 sec)
```

从上面的输出中可以看到test1表中3条记录被删除了。

#### 示例2

```java
delete t2,t1 from test1 t1,test2 t2 where t1.a=t2.c2;
```

> 同时对2个表进行删除，条件是test.a=test.c2的记录

看一下运行效果：

```java
-- 删除test1
drop table if exists test1;
-- 创建test1
create table test1(a int,b int);
-- 删除test2
drop table if exists test2;
-- 创建test2
create table test2(c1 int,c2 int,c3 int);
-- 向test2中插入数据
insert into test2 values (100,101,102),(200,201,202),(300,301,302),(400,401,402);
-- 向test1中插入数据
insert into test1 (a,b) select 1,1 union all select 2,2 union all select 2,2;
-- 向test1插入数据，数据来源于test2表
insert into test1 (a,b) select c2,c3 from test2 where c1>=200;

mysql> select * from test1;
+------+------+
| a    | b    |
+------+------+
|    1 |    1 |
|    2 |    2 |
|    2 |    2 |
|  201 |  202 |
|  301 |  302 |
|  401 |  402 |
+------+------+
6 rows in set (0.00 sec)

mysql> select * from test2;
+------+------+------+
| c1   | c2   | c3   |
+------+------+------+
|  100 |  101 |  102 |
|  200 |  201 |  202 |
|  300 |  301 |  302 |
|  400 |  401 |  402 |
+------+------+------+
4 rows in set (0.00 sec)

mysql> delete t2,t1 from test1 t1,test2 t2 where t1.a=t2.c2;
Query OK, 6 rows affected (0.00 sec)

mysql> select * from test1;
+------+------+
| a    | b    |
+------+------+
|    1 |    1 |
|    2 |    2 |
|    2 |    2 |
+------+------+
3 rows in set (0.00 sec)

mysql> select * from test2;
+------+------+------+
| c1   | c2   | c3   |
+------+------+------+
|  100 |  101 |  102 |
+------+------+------+
1 row in set (0.00 sec)
```

从输出中可以看出test1和test2总计6条记录被删除了。

**平时我们用的比较多的方式是`delete from 表名`这种语法，上面我们介绍了再delete后面跟上表名的用法，大家可以在回顾一下，加深记忆。**

### 使用truncate删除

#### 语法

```java
truncate 表名;
```

### drop，truncate，delete区别

*   drop (删除表)：删除内容和定义，释放空间，简单来说就是**把整个表去掉**，以后要新增数据是不可能的，除非新增一个表。
    
    drop语句将删除表的结构被依赖的约束（constrain），触发器（trigger）索引（index），依赖于该表的存储过程/函数将被保留，但其状态会变为：invalid。
    
    如果要删除表定义及其数据，请使用 drop table 语句。
    
*   truncate (清空表中的数据)：删除内容、释放空间但不删除定义(**保留表的数据结构**)，与drop不同的是，只是清空表数据而已。
    
    注意：truncate不能删除具体行数据，要删就要把整个表清空了。
    
*   delete (删除表中的数据)：delete 语句用于**删除表中的行**。delete语句执行删除的过程是每次从表中删除一行，并且同时将该行的删除操作作为事务记录在日志中保存，以便进行进行回滚操作。
    
    truncate与不带where的delete ：只删除数据，而不删除表的结构（定义）
    
    truncate table 删除表中的所有行，但表结构及其列、约束、索引等保持不变。
    
    对于由foreign key约束引用的表，不能使用truncate table ，而应使用不带where子句的delete语句。由于truncate table 记录在日志中，所以它不能激活触发器。
    
    delete语句是数据库操作语言(dml)，这个操作会放到 rollback segement 中，**事务提交之后才生效**；如果有相应的 trigger，执行的时候将被触发。
    
    **truncate、drop 是数据库定义语言(ddl)，操作立即生效**，原数据不放到 rollback segment 中，不能回滚，操作不触发 trigger。
    
    **如果有自增列，truncate方式删除之后，自增列的值会被初始化，delete方式要分情况（如果数据库被重启了，自增列值也会被初始化，数据库未被重启，则不变）**
    
*   **如果要删除表定义及其数据，请使用 drop table 语句**
    
*   **安全性：小心使用 drop 和 truncate，尤其没有备份的时候，否则哭都来不及**
*   **删除速度，一般来说: drop> truncate > delete**

|  | drop | truncate | delete |
| --- | --- | --- | --- |
| 条件删除 | 不支持 | 不支持 | 支持 |
| 删除表结构 | 支持 | 不支持 | 不支持 |
| 事务的方式删除 | 不支持 | 不支持 | 支持 |
| 触发触发器 | 否 | 否 | 是 |

[下一篇：select查下基础篇](http://www.itsoku.com/course/3/40)

[上一篇：DDL常见操作汇总](http://www.itsoku.com/course/3/38)
