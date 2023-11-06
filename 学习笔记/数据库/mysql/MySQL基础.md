##本单元目标

	一、为什么要学习数据库
	二、数据库的相关概念      
		DBMS、DB、SQL
	三、数据库存储数据的特点
	四、初始MySQL
	    MySQL产品的介绍        
	    MySQL产品的安装          ★        
	    MySQL服务的启动和停止     ★
	    MySQL服务的登录和退出     ★      
	    MySQL的常见命令和语法规范      
	五、DQL语言的学习   ★              
	    基础查询        ★             
	    条件查询  	   ★			
	    排序查询  	   ★				
	    常见函数        ★               
	    分组函数        ★              
	    分组查询		   ★			
	    连接查询	 	★			
	    子查询       √                  
	    分页查询       ★              
	    union联合查询	√			
	
	六、DML语言的学习    ★             
		插入语句						
		修改语句						
		删除语句						
	七、DDL语言的学习  
		库和表的管理	 √				
		常见数据类型介绍  √          
		常见约束  	  √			
	八、TCL语言的学习
		事务和事务处理                 
	九、视图的讲解           √
	十、变量                      
	十一、存储过程和函数   
	十二、流程控制结构       

## 数据库的好处

​	1.持久化数据到本地
​	2.可以实现结构化查询，方便管理
​	

## 数据库相关概念

​	1、DB：数据库，保存一组有组织的数据的容器
​	2、DBMS：数据库管理系统，又称为数据库软件（产品），用于管理DB中的数据
​	3、SQL:结构化查询语言，用于和DBMS通信的语言

## 数据库存储数据的特点

​	1、将数据放到表中，表再放到库中
​	2、一个数据库中可以有多个表，每个表都有一个的名字，用来标识自己。表名具有唯一性。
​	3、表具有一些特性，这些特性定义了数据在表中如何存储，类似java中 “类”的设计。
​	4、表由列组成，我们也称为字段。所有表都是由一个或多个列组成的，每一列类似java 中的”属性”
​	5、表中的数据是按行存储的，每一行类似于java中的“对象”。



## MySQL产品的介绍和安装

### MySQL服务的启动和停止

​	方式一：计算机——右击管理——服务
​	方式二：通过管理员身份运行
​	net start 服务名（启动服务）
​	net stop 服务名（停止服务）

### MySQL服务的登录和退出   

​	方式一：通过mysql自带的客户端
​	只限于root用户

	方式二：通过windows自带的客户端
	登录：
	mysql 【-h主机名 -P端口号 】-u用户名 -p密码
	
	退出：
	exit或ctrl+C



## MySQL的常见命令 

```sql
1.查看当前所有的数据库
show databases;
2.打开指定的库
use 库名
3.查看当前库的所有表
show tables;
4.查看其它库的所有表
show tables from 库名;
5.创建表
create table 表名(
    列名 列类型,
    列名 列类型，
    。。。
);
6.查看表结构
desc 表名;
7.查看服务器的版本
方式一：登录到mysql服务端
select version();
方式二：没有登录到mysql服务端
mysql --version
或
mysql --V
```

## MySQL的语法规范

​	1.不区分大小写,但建议关键字大写，表名、列名小写
​	2.每条命令最好用分号结尾
​	3.每条命令根据需要，可以进行缩进 或换行
​	4.注释
​		单行注释：#注释文字
​		单行注释：-- 注释文字
​		多行注释：/* 注释文字  */

### SQL的语言分类

​	DQL（Data Query Language）：数据查询语言
​		select 
​	DML(Data Manipulate Language):数据操作语言
​		insert 、update、delete
​	DDL（Data Define Languge）：数据定义语言
​		create、drop、alter
​	TCL（Transaction Control Language）：事务控制语言
​		commit、rollback

### SQL的常见命令

```sql
show databases； 查看所有的数据库
use 库名； 打开指定的库
show tables ; 显示库中的所有表
show tables from 库名;显示指定库中的所有表
create table 表名(
	字段名 字段类型,	
	字段名 字段类型
); 创建表

desc 表名; 查看指定表的结构
select * from 表名;显示表中的所有数据
```

## DQL语言的学习

### 进阶1：基础查询

​	语法：
​	SELECT  要查询的东西 【FROM 表名】;

类似于Java中 :System.out.println(要打印的东西);
    特点：
    ①通过select查询完的结果 ，是一个虚拟的表格，不是真实存在
    ② 要查询的东西 可以是常量值、可以是表达式、可以是字段、可以是函数

### 进阶2：条件查询

​	条件查询：根据条件过滤原始表的数据，查询到想要的数据
​	语法：
​	select 
​		要查询的字段|表达式|常量值|函数
​	from 
​		表
​	where 
​		条件 ;

```sql
分类：
一、条件表达式
	示例：salary>10000
	条件运算符：
	> < >= <= = != <>

二、逻辑表达式
示例：salary>10000 && salary<20000

逻辑运算符：

	and（&&）:两个条件如果同时成立，结果为true，否则为false
	or(||)：两个条件只要有一个成立，结果为true，否则为false
	not(!)：如果条件成立，则not后为false，否则为true

三、模糊查询
示例：last_name like 'a%'
```

### 进阶3：排序查询	

```sql
语法：
select
	要查询的东西
from
	表
where 
	条件

order by 排序的字段|表达式|函数|别名 【asc|desc】
```

### 进阶4：常见函数

​	一、单行函数

	1、字符函数
	    concat拼接
	    substr截取子串
	    upper转换成大写
	    lower转换成小写
	    trim去前后指定的空格和字符
	    ltrim去左边空格
	    rtrim去右边空格
	    replace替换
	    lpad左填充
	    rpad右填充
	    instr返回子串第一次出现的索引
	    length 获取字节个数
	2、数学函数
		round 四舍五入
		rand 随机数
		floor向下取整
		ceil向上取整
		mod取余
		truncate截断
	3、日期函数
		now当前系统日期+时间
		curdate当前系统日期
		curtime当前系统时间
		str_to_date 将字符转换成日期
		date_format将日期转换成字符
	4、流程控制函数
		if 处理双分支
		case语句 处理多分支
			情况1：处理等值判断
			情况2：处理条件判断
		
	5、其他函数
		version版本
		database当前库
		user当前连接用户


二、分组函数


		sum 求和
		max 最大值
		min 最小值
		avg 平均值
		count 计数
	
		特点：
		1、以上五个分组函数都忽略null值，除了count(*)
		2、sum和avg一般用于处理数值型
			max、min、count可以处理任何数据类型
	    3、都可以搭配distinct使用，用于统计去重后的结果
		4、count的参数可以支持：
			字段、*、常量值，一般放1
	
		   建议使用 count(*)

### 进阶5：分组查询

```sql
	语法：
	select 查询的字段，分组函数
	from 表
	group by 分组的字段
```

	特点：
	1、可以按单个字段分组
	2、和分组函数一同查询的字段最好是分组后的字段
	3、分组筛选
			针对的表	位置			关键字
	分组前筛选：	原始表		group by的前面		where
	分组后筛选：	分组后的结果集	group by的后面		having
	
	4、可以按多个字段分组，字段之间用逗号隔开
	5、可以支持排序
	6、having后可以支持别名

### 进阶6：多表连接查询

	笛卡尔乘积：如果连接条件省略或无效则会出现
	解决办法：添加上连接条件

一、传统模式下的连接 ：等值连接——非等值连接


	1.等值连接的结果 = 多个表的交集
	2.n表连接，至少需要n-1个连接条件
	3.多个表不分主次，没有顺序要求
	4.一般为表起别名，提高阅读性和性能

二、sql99语法：通过join关键字实现连接

```sql
含义：1999年推出的sql语法
支持：
等值连接、非等值连接 （内连接）
外连接
交叉连接

语法：

select 字段，...
from 表1
【inner|left outer|right outer|cross】join 表2 on  连接条件
【inner|left outer|right outer|cross】join 表3 on  连接条件
【where 筛选条件】
【group by 分组字段】
【having 分组后的筛选条件】
【order by 排序的字段或表达式】

好处：语句上，连接条件和筛选条件实现了分离，简洁明了！
```


三、自连接

案例：查询员工名和直接上级的名称

sql99

```sql
SELECT e.last_name,m.last_name
FROM employees e
JOIN employees m ON e.`manager_id`=m.`employee_id`;
```

sql92


```sql
SELECT e.last_name,m.last_name
FROM employees e,employees m 
WHERE e.`manager_id`=m.`employee_id`;
```

### 进阶7：子查询

含义：

	一条查询语句中又嵌套了另一条完整的select语句，其中被嵌套的select语句，称为子查询或内查询
	在外面的查询语句，称为主查询或外查询

特点：

	1、子查询都放在小括号内
	2、子查询可以放在from后面、select后面、where后面、having后面，但一般放在条件的右侧
	3、子查询优先于主查询执行，主查询使用了子查询的执行结果
	4、子查询根据查询结果的行数不同分为以下两类：
	① 单行子查询
		结果集只有一行
		一般搭配单行操作符使用：> < = <> >= <= 
		非法使用子查询的情况：
		a、子查询的结果为一组值
		b、子查询的结果为空
		
	② 多行子查询
		结果集有多行
		一般搭配多行操作符使用：any、all、in、not in
		in： 属于子查询结果中的任意一个就行
		any和all往往可以用其他查询代替

### 进阶8：分页查询

应用场景：

	实际的web项目中需要根据用户的需求提交对应的分页查询的sql语句

语法：

```sql
select 字段|表达式,...
from 表
【where 条件】
【group by 分组字段】
【having 条件】
【order by 排序的字段】
limit 【起始的条目索引，】条目数;
```

特点：

```sql
1.起始条目索引从0开始

2.limit子句放在查询语句的最后

3.公式：select * from  表 limit （page-1）*sizePerPage,sizePerPage
假如:
每页显示条目数sizePerPage
要显示的页数 page
```

### 进阶9：联合查询

引入：
	union 联合、合并

语法：

```sql
select 字段|常量|表达式|函数 【from 表】 【where 条件】 union 【all】
select 字段|常量|表达式|函数 【from 表】 【where 条件】 union 【all】
select 字段|常量|表达式|函数 【from 表】 【where 条件】 union  【all】
.....
select 字段|常量|表达式|函数 【from 表】 【where 条件】
```

特点：

	1、多条查询语句的查询的列数必须是一致的
	2、多条查询语句的查询的列的类型几乎相同
	3、union代表去重，union all代表不去重

## DML语言

### 插入

语法：
	insert into 表名(字段名，...) values(值1，...);

特点：

	1、字段类型和值类型一致或兼容，而且一一对应
	2、可以为空的字段，可以不用插入值，或用null填充
	3、不可以为空的字段，必须插入值
	4、字段个数和值的个数必须一致
	5、字段可以省略，但默认所有字段，并且顺序和表中的存储顺序一致

### 修改

修改单表语法：

```sql
update 表名 set 字段=新值,字段=新值
【where 条件】
```
修改多表语法：

```sql
update 表1 别名1,表2 别名2
set 字段=新值，字段=新值
where 连接条件
and 筛选条件
```

### 删除

方式1：delete语句 

单表的删除： ★

```sql
	delete from 表名 【where 筛选条件】
```

多表的删除：

```sql
	delete 别名1，别名2
	from 表1 别名1，表2 别名2
	where 连接条件
	and 筛选条件;
```


方式2：truncate语句

```sql
truncate table 表名
```


两种方式的区别【面试题】
	
```sql
#1.truncate不能加where条件，而delete可以加where条件

#2.truncate的效率高一丢丢

#3.truncate 删除带自增长的列的表后，如果再插入数据，数据从1开始
#delete 删除带自增长列的表后，如果再插入数据，数据从上一次的断点处开始

#4.truncate删除不能回滚，delete删除可以回滚
```

## DDL语句

### 库和表的管理

库的管理：

```sql
一、创建库
create database 库名
二、删除库
drop database 库名
```
表的管理：

```sql
#1.创建表
CREATE TABLE IF NOT EXISTS stuinfo(
	stuId INT,
	stuName VARCHAR(20),
	gender CHAR,
	bornDate DATETIME);

DESC studentinfo;
#2.修改表 alter
语法：ALTER TABLE 表名 ADD|MODIFY|DROP|CHANGE COLUMN 字段名 【字段类型】;

#①修改字段名
ALTER TABLE studentinfo CHANGE  COLUMN sex gender CHAR;

#②修改表名
ALTER TABLE stuinfo RENAME [TO]  studentinfo;
#③修改字段类型和列级约束
ALTER TABLE studentinfo MODIFY COLUMN borndate DATE ;

#④添加字段

ALTER TABLE studentinfo ADD COLUMN email VARCHAR(20) first;
#⑤删除字段
ALTER TABLE studentinfo DROP COLUMN email;
#3.删除表

DROP TABLE [IF EXISTS] studentinfo;
```

### 常见类型

	整型：
		
	小数：
		浮点型
		定点型
	字符型：
	日期型：
	Blob类型：

### 常见约束

	NOT NULL
	DEFAULT
	UNIQUE
	CHECK
	PRIMARY KEY
	FOREIGN KEY

## 数据库事务

### 含义

​	通过一组逻辑操作单元（一组DML——sql语句），将数据从一种状态切换到另外一种状态

### 特点

​	（ACID）
​	原子性：要么都执行，要么都回滚
​	一致性：保证数据的状态操作前和操作后保持一致
​	隔离性：多个事务同时操作相同数据库的同一个数据时，一个事务的执行不受另外一个事务的干扰
​	持久性：一个事务一旦提交，则数据将持久化到本地，除非其他事务对其进行修改

相关步骤：

	1、开启事务
	2、编写事务的一组逻辑操作单元（多条sql语句）
	3、提交事务或回滚事务

### 事务的分类：

隐式事务，没有明显的开启和结束事务的标志

	比如
	insert、update、delete语句本身就是一个事务


显式事务，具有明显的开启和结束事务的标志

```sql
	1、开启事务
	取消自动提交事务的功能

	2、编写事务的一组逻辑操作单元（多条sql语句）
	insert
	update
	delete

	3、提交事务或回滚事务
```
### 使用到的关键字

```sql
set autocommit=0;
start transaction;
commit;
rollback;

savepoint  断点
commit to 断点
rollback to 断点
```

### 事务的隔离级别:

事务并发问题如何发生？

	当多个事务同时操作同一个数据库的相同数据时
事务的并发问题有哪些？

	脏读：一个事务读取到了另外一个事务未提交的数据
	不可重复读：同一个事务中，多次读取到的数据不一致
	幻读：一个事务读取数据时，另外一个事务进行更新，导致第一个事务读取到了没有更新的数据

如何避免事务的并发问题？

```sql
通过设置事务的隔离级别
1、READ UNCOMMITTED
2、READ COMMITTED 可以避免脏读
3、REPEATABLE READ 可以避免脏读、不可重复读和一部分幻读
4、SERIALIZABLE可以避免脏读、不可重复读和幻读
```

设置隔离级别：

```sql
set session|global  transaction isolation level 隔离级别名;
```
查看隔离级别：

```sql
select @@tx_isolation;
```

## 视图

含义：理解成一张虚拟的表

视图和表的区别：

| 使用方式 | 占用物理空间                            |
| -------- | --------------------------------------- |
| 视图     | 完全相同	不占用，仅仅保存的是sql逻辑 |
| 表       | 完全相同	占用                        |


视图的好处：


	1、sql语句提高重用性，效率高
	2、和表实现了分离，提高了安全性

### 视图的创建

​	语法：
​	CREATE VIEW  视图名
​	AS
​	查询语句;

### 视图的增删改查

​	1、查看视图的数据 ★

```sql
SELECT * FROM my_v4;
SELECT * FROM my_v1 WHERE last_name='Partners';

2、插入视图的数据
INSERT INTO my_v4(last_name,department_id) VALUES('虚竹',90);

3、修改视图的数据

UPDATE my_v4 SET last_name ='梦姑' WHERE last_name='虚竹';

4、删除视图的数据
DELETE FROM my_v4;
```

### 某些视图不能更新

​	包含以下关键字的sql语句：分组函数、distinct、group  by、having、union或者union all
​	常量视图
​	Select中包含子查询
​	join
​	from一个不能更新的视图
​	where子句的子查询引用了from子句中的表

### 视图逻辑的更新

```sql
#方式一：
CREATE OR REPLACE VIEW test_v7
AS
SELECT last_name FROM employees
WHERE employee_id>100;
```

```sql
#方式二:
ALTER VIEW test_v7
AS
SELECT employee_id FROM employees;

SELECT * FROM test_v7;
```
### 视图的删除

```sql
DROP VIEW test_v1,test_v2,test_v3;
```

### 视图结构的查看	

```sql
DESC test_v7;
SHOW CREATE VIEW test_v7;
```

## 存储过程

含义：一组经过预先编译的sql语句的集合
好处：

	1、提高了sql语句的重用性，减少了开发程序员的压力
	2、提高了效率
	3、减少了传输次数

分类：

	1、无返回无参
	2、仅仅带in类型，无返回有参
	3、仅仅带out类型，有返回无参
	4、既带in又带out，有返回有参
	5、带inout，有返回有参
	注意：in、out、inout都可以在一个存储过程中带多个
### 创建存储过程

语法：

```sql
create procedure 存储过程名(in|out|inout 参数名  参数类型,...)
begin
	存储过程体

end
```

类似于方法：

	修饰符 返回类型 方法名(参数类型 参数名,...){
	
		方法体;
	}

注意

```sql
1、需要设置新的结束标记
delimiter 新的结束标记
示例：
delimiter $

CREATE PROCEDURE 存储过程名(IN|OUT|INOUT 参数名  参数类型,...)
BEGIN
	sql语句1;
	sql语句2;

END $

2、存储过程体中可以有多条sql语句，如果仅仅一条sql语句，则可以省略begin end

3、参数前面的符号的意思
in:该参数只能作为输入 （该参数不能做返回值）
out：该参数只能作为输出（该参数只能做返回值）
inout：既能做输入又能做输出



CREATE PROCEDURE multiData (in num INT) 
BEGIN
	DECLARE i INT;
	SET i = 0;
	WHILE i < num DO	
		INSERT INTO single_table(key1,key2,key3,key_part1,key_part2,key_part3,common_field)
		VALUES(CONCAT("java",i),i,CONCAT("java",i),CONCAT("java",i),CONCAT("java",i),CONCAT("java",i),CONCAT("java",i));
		SET i = i + 1;
END WHILE;
END

call multiData(10000)
```

### 调用存储过程

​	call 存储过程名(实参列表)

## 函数

### 创建函数

学过的函数：LENGTH、SUBSTR、CONCAT等
语法：

```sql
CREATE FUNCTION 函数名(参数名 参数类型,...) RETURNS 返回类型
BEGIN
	函数体
END
```

### 调用函数

​	SELECT 函数名（实参列表）

### 函数和存储过程的区别

|          | 关键字    | 调用语法        | 返回值          | 应用场景                                                 |
| -------- | --------- | --------------- | --------------- | -------------------------------------------------------- |
| 函数     | FUNCTION  | SELECT 函数()   | 只能是一个      | 一般用于查询结果为一个值并返回时，当有返回值而且仅仅一个 |
| 存储过程 | PROCEDURE | CALL 存储过程() | 可以有0个或多个 | 一般用于更新                                             |

## 流程控制结构

### 系统变量

一、全局变量

作用域：针对于所有会话（连接）有效，但不能跨重启

```sql
查看所有全局变量
SHOW GLOBAL VARIABLES;
查看满足条件的部分系统变量
SHOW GLOBAL VARIABLES LIKE '%char%';
查看指定的系统变量的值
SELECT @@global.autocommit;
为某个系统变量赋值
SET @@global.autocommit=0;
SET GLOBAL autocommit=0;
```

二、会话变量

作用域：针对于当前会话（连接）有效

```sql
查看所有会话变量
SHOW SESSION VARIABLES;
查看满足条件的部分会话变量
SHOW SESSION VARIABLES LIKE '%char%';
查看指定的会话变量的值
SELECT @@autocommit;
SELECT @@session.tx_isolation;
为某个会话变量赋值
SET @@session.tx_isolation='read-uncommitted';
SET SESSION tx_isolation='read-committed';
```

### 自定义变量

一、用户变量

声明并初始化：

```sql
SET @变量名=值;
SET @变量名:=值;
SELECT @变量名:=值;
```
赋值：

```sql
方式一：一般用于赋简单的值
SET 变量名=值;
SET 变量名:=值;
SELECT 变量名:=值;
```


```sql
方式二：一般用于赋表 中的字段值
SELECT 字段名或表达式 INTO 变量
FROM 表;
```

使用：

```sql
select @变量名;
```

二、局部变量

声明：

```sql
declare 变量名 类型 【default 值】;
```
赋值：

```sql
方式一：一般用于赋简单的值
SET 变量名=值;
SET 变量名:=值;
SELECT 变量名:=值;
```


```sql
方式二：一般用于赋表中的字段值
SELECT 字段名或表达式 INTO 变量
FROM 表;
```

使用：

```sql
select 变量名
```

二者的区别：

			作用域			定义位置		语法
用户变量	当前会话		会话的任何地方		加@符号，不用指定类型
局部变量	定义它的BEGIN END中 	BEGIN END的第一句话	一般不用加@,需要指定类型

### 分支

一、if函数
	语法：if(条件，值1，值2)
	特点：可以用在任何位置

二、case语句

语法：

```sql
情况一：类似于switch
case 表达式
when 值1 then 结果1或语句1(如果是语句，需要加分号) 
when 值2 then 结果2或语句2(如果是语句，需要加分号)
...
else 结果n或语句n(如果是语句，需要加分号)
end 【case】（如果是放在begin end中需要加上case，如果放在select后面不需要）

情况二：类似于多重if
case 
when 条件1 then 结果1或语句1(如果是语句，需要加分号) 
when 条件2 then 结果2或语句2(如果是语句，需要加分号)
...
else 结果n或语句n(如果是语句，需要加分号)
end 【case】（如果是放在begin end中需要加上case，如果放在select后面不需要）
```


特点：
	可以用在任何位置

三、if elseif语句

语法：

```sql
if 情况1 then 语句1;
elseif 情况2 then 语句2;
...
else 语句n;
end if;
```

特点：
	只能用在begin end中！！！！！！！！！！！！！！！

三者比较：

|          | 应用场合          |
| -------- | ----------------- |
| if函数   | 简单双分支        |
| case结构 | 等值判断 的多分支 |
| if结构   | 区间判断 的多分支 |

### 循环

语法：


```sql
【标签：】WHILE 循环条件  DO
	循环体
END WHILE 【标签】;
```

特点：

	只能放在BEGIN END里面
	
	如果要搭配leave跳转语句，需要使用标签，否则可以不用标签
	
	leave类似于java中的break语句，跳出所在循环！！！

# explain

对于互联网公司来说，随着用户量和数据量的不断增加，慢查询是无法避免的问题。一般情况下如果出现慢查询，意味着接口响应慢、接口超时等问题。如果是高并发的场景，可能会出现数据库连接被占满的情况，直接导致服务不可用。

慢查询的确会导致很多问题，我们要如何优化慢查询呢？

主要解决办法有：

- 监控sql执行情况，发邮件、短信报警，便于快速识别慢查询sql
- 打开数据库慢查询日志功能
- 简化业务逻辑
- 代码重构、优化
- 异步处理
- sql优化
- 索引优化

其他的办法先不说，后面有机会再单独介绍。今天我重点说说索引优化，因为它是解决慢查询sql问题最有效的手段。

如何查看某条sql的索引执行情况呢？

没错，在sql前面加上`explain`关键字，就能够看到它的执行计划，通过执行计划，我们可以清楚的看到表和索引执行的情况，索引有没有执行、索引执行顺序和索引的类型等。

索引优化的步骤是：

1. 使用`explain`查看sql执行计划
2. 判断哪些索引使用不当
3. 优化sql，sql可能需要多次优化才能达到索引使用的最优值

既然索引优化的第一步是使用`explain`，我们先全面的了解一下它。

## **explain介绍**

先看看mysql的官方文档是怎么描述explain的：

![image-20211207201504041](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311061340325.png)

- EXPLAIN可以使用于 SELECT， DELETE， INSERT， REPLACE，和 UPDATE语句。

- 当EXPLAIN与可解释的语句一起使用时，MySQL将显示来自优化器的有关语句执行计划的信息。也就是说，MySQL解释了它将如何处理该语句，包括有关如何连接表以及以何种顺序连接表的信息。

- 当EXPLAIN与非可解释的语句一起使用时，它将显示在命名连接中执行的语句的执行计划。

- 对于SELECT语句， EXPLAIN可以显示的其他执行计划的警告信息。


## **explain详解**

explain的语法：

```sql
{EXPLAIN | DESCRIBE | DESC}
    tbl_name [col_name | wild]

{EXPLAIN | DESCRIBE | DESC}
    [explain_type]
    {explainable_stmt | FORCONNECTION connection_id}

explain_type: {
    EXTENDED
  | PARTITIONS
  | FORMAT = format_name
}

format_name: {
    TRADITIONAL
  | JSON
}

explainable_stmt: {
    SELECTstatement
  | DELETEstatement
  | INSERTstatement
  | REPLACEstatement
  | UPDATEstatement
}
```

用一条简单的sql看看使用`explain`关键字的效果：

```sql
explain select * from test1;
```

执行结果：

![image-20211210070144544](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311061340799.png)

从上图中看到执行结果中会显示12列信息，每列具体信息如下：

![图片](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311061340847.png)

说白了，我们要搞懂这些列的具体含义才能正常判断索引的使用情况。

话不多说，直接开始介绍吧。

### id列

该列的值是select查询中的序号，比如：1、2、3、4等，它决定了表的执行顺序。

某条sql的执行计划中一般会出现三种情况：

1. id相同
2. id不同
3. id相同和不同都有

那么这三种情况表的执行顺序是怎么样的呢？

#### 1.id相同

执行sql如下：

```sql
explain select * from test1 t1 inner join test1 t2 on t1.id=t2.id
```

结果：

![image-20211210070220385](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311061341025.png)

我们看到执行结果中的两条数据id都是1，是相同的。

这种情况表的执行顺序是怎么样的呢？

**答案：从上到下执行，先执行表t1，再执行表t2。**

执行的表要怎么看呢？

**答案：看table字段，这个字段后面会详细解释。**

#### 2.id不同

执行sql如下：

```sql
explain select * from test1 t1 where t1.id = (select id from  test1 t2 where  t2.id=2);
```

结果：

![image-20211210070243364](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311061341947.png)

我们看到执行结果中两条数据的id不同，第一条数据是1，第二条数据是2。

这种情况表的执行顺序是怎么样的呢？

**答案：序号大的先执行，这里会从下到上执行，先执行表t2，再执行表t1。**

#### 3.id相同和不同都有

执行sql如下：

```sql
explain
select t1.* from test1 t1
inner join (select max(id) mid from test1 group by id) t2
on t1.id=t2.mid
```

结果：

![image-20211210070300316](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311061341465.png)

我们看到执行结果中三条数据，前面两条数据的的id相同，第三条数据的id跟前面的不同。

这种情况表的执行顺序又是怎么样的呢？

**答案：先执行序号大的，先从下而上执行。遇到序号相同时，再从上而下执行。所以这个列子中表的顺序顺序是：test1、t1、**

**也许你会在这里心生疑问：`<derived2>` 是什么鬼？**

它表示派生表，别急后面会讲的。

**还有一个问题：id列的值允许为空吗？**

答案在后面揭晓。

### select_type列

该列表示select的类型。具体包含了如下11种类型：

![image-20211210073420615](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311061341558.png)

但是常用的其实就是下面几个：

| 类型         |                  含义                  |
| :----------- | :------------------------------------: |
| SIMPLE       |  简单SELECT查询，不包含子查询和UNION   |
| PRIMARY      | 复杂查询中的最外层查询，表示主要的查询 |
| SUBQUERY     |    SELECT或WHERE列表中包含了子查询     |
| DERIVED      |     FROM列表中包含的子查询，即衍生     |
| UNION        |         UNION关键字之后的查询          |
| UNION RESULT |        从UNION后的表获取结果集         |

下面看看这些SELECT类型具体是怎么出现的：

1. SIMPLE

   执行sql如下：

   ```sql
explain select * from test1;
   ```

   结果：
   
   ![image-20211210073441005](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311061341557.png)

   它只在简单SELECT查询中出现，不包含子查询和UNION，这种类型比较直观就不多说了。

2. PRIMARY 和 SUBQUERY

   执行sql如下：

   ```sql
   explain select * from test1 t1 where t1.id = (select id from  test1 t2 where  t2.id=2);
   ```

   结果：

   ![image-20211210073539892](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311061341034.png)

   我们看到这条嵌套查询的sql中，最外层的t1表是PRIMARY类型，而最里面的子查询t2表是SUBQUERY类型。

3. DERIVED

   执行sql如下：

   ```sql
explain
   select t1.* from test1 t1
   inner join (select max(id) mid from test1 group by id) t2
   on t1.id=t2.mid
   ```
   
   结果：

   ![image-20211210073559756](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311061341290.png)

   最后一条记录就是衍生表，它一般是FROM列表中包含的子查询，这里是sql中的分组子查询。

4. UNION 和 UNION RESULT

   执行sql如下：

   ```sql
   explain
   select * from test1
   union
   select * from test2
   ```

   结果：

   ![image-20211210073618457](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311061341972.png)

   test2表是UNION关键字之后的查询，所以被标记为UNION，test1是最主要的表，被标记为PRIMARY。而<union1,2>表示id=1和id=2的表union，其结果被标记为UNION RESULT。

UNION 和 UNION RESULT一般会成对出现。

**此外，回答上面的问题：id列的值允许为空吗？**

如果仔细看上面那张图，会发现id列是可以允许为空的，并且是在SELECT类型为： UNION RESULT的时候。

### table列

该列的值表示输出行所引用的表的名称，比如前面的：test1、test2等。

但也可以是以下值之一：

- `<unionM,N>`：具有和id值的行的M并集N。
- `<derivedN>`：用于与该行的派生表结果id的值N。派生表可能来自（例如）FROM子句中的子查询 。
- `<subqueryN>`：子查询的结果，其id值为N

### partitions列

该列的值表示查询将从中匹配记录的分区

### type列

**该列的值表示连接类型，是查看索引执行情况的一个重要指标。包含如下类型：**

![image-20211210073717052](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311061342230.png)

**执行结果从最好到最坏的的顺序是从上到下。**

我们需要重点掌握的是下面几种类型：

**system > const > eq_ref > ref > range > index > ALL**

在演示之前，先说明一下test2表中只有一条数据：

| id   | code | name |
| ---- | ---- | ---- |
| 1    | 001  | 上海 |

并且code字段上面建了一个普通索引：

![image-20211210073732024](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311061342977.png)

下面逐一看看常见的几个连接类型是怎么出现的：

1. system

   这种类型要求数据库表中只有一条数据，是const类型的一个特例，一般情况下是不会出现的。

2. const

   通过一次索引就能找到数据，一般用于主键或唯一索引作为条件的查询sql中，执行sql如下：

   ```sql
   explain select * from test2 where id=1;
   ```

   结果：

   ![image-20211210073745510](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311061342573.png)

3. eq_ref

   常用于主键或唯一索引扫描。执行sql如下：

   ```sql
   explain select * from test2 t1 inner join test2 t2 on t1.id=t2.id;
   ```

   结果：

   ![image-20211210065933329](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311061342073.png)

   此时，有人可能感到不解，const和eq_ref都是对主键或唯一索引的扫描，有什么区别？

    答：const只索引一次，而eq_ref主键和主键匹配，由于表中有多条数据，一般情况下要索引多次，才能全部匹配上。

4. ref

   常用于非主键和唯一索引扫描。执行sql如下：

   ```
   explain select * from test2 where code = '001';
   ```

   结果：

   ![image-20211210065919442](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311061342864.png)

5. range

   常用于范围查询，比如：between ... and 或 In 等操作，执行sql如下：

   ```
   explain select * from test2 where id between 1 and 2;
   ```

   结果：

   ![image-20211210065901704](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311061342124.png)

6. index

   全索引扫描。执行sql如下：

   ```
   explain select code from test2;
   ```

   结果：

   ![image-20211210065844450](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311061342808.png)

7. ALL

   全表扫描。执行sql如下：

   ```
   explain select *  from test2;
   ```

   结果：

   ![image-20211210065827501](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311061342784.png)

### possible_keys列

该列表示可能的索引选择。

请注意，此列完全独立于表的顺序，这就意味着possible_keys在实践中，某些键可能无法与生成的表顺序一起使用。

![image-20211210065812567](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311061342576.png)

如果此列是NULL，则没有相关的索引。**在这种情况下，您可以通过检查该WHERE 子句以检查它是否引用了某些适合索引的列，从而提高查询性能。**

### key列

该列表示实际用到的索引。

可能会出现possible_keys列为NULL，但是key不为NULL的情况。

演示之前，先看看test1表结构：

![image-20211210065757587](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311061342880.png)

test1表中数据：

| id   | code | name |
| ---- | ---- | ---- |
| 1    | 001  | 张飞 |
| 2    | 002  | 关羽 |

使用的索引：

![image-20211210065742962](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311061343777.png)

**code和name字段使用了联合索引。**

执行sql如下：

```
explain select code  from test1;
```

结果：

![image-20211210065726086](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311061343988.png)

这条sql预计没有使用索引，但是实际上使用了**全索引扫描方式**的索引。

### key_len列 

该列表示使用索引的长度。**上面的key列可以看出有没有使用索引，key_len列则可以更进一步看出索引使用是否充分。不出意外的话，它是最重要的列。**

![image-20211210065710126](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311061343724.png)

**有个关键的问题浮出水面：key_len是如何计算的？**

决定key_len值的三个因素：

 **1.字符集**

 **2.长度**

 **3.是否为空** 

常用的字符编码占用字节数量如下：

| 字符编码  | 占用字节数 |
| --------- | ---------- |
| GBK       | 2          |
| UTF8      | 3          |
| ISO8859-1 | 1          |
| GB2312    | 2          |
| UTF-16    | 2          |

目前我的数据库字符编码格式用的：UTF8占3个字节。**show variables like 'character_set_database';**

mysql常用字段占用字节数：

| 字段类型   | 占用字节数 |
| :--------- | :--------: |
| char(n)    |     n      |
| varchar(n) |   n + 2    |
| tinyint    |     1      |
| smallint   |     2      |
| int        |     4      |
| bigint     |     8      |
| date       |     3      |
| timestamp  |     4      |
| datetime   |     8      |

##### 此外，如果字段类型允许为空则加1个字节。

##### 上图中的 184是怎么算的？

184 = 30 * 3 + 2 + 30 * 3 + 2

```
1) 列长度：

2) 列是否为空： NULL(+1)，NOT NULL(+0)

3) 字符集： 如 utf8mb4=4,utf8=3,gbk=2,latin1=1

4) 列类型为字符： 如 varchar(+2), char(+0)

计算公式：key_len=(表字符集长度) * 列长度 + 1(null) + 2(变长列)
```

 再把test1表的code字段类型改成char，并且改成允许为空：

![image-20211210065651962](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311061343323.png)

执行sql如下：

```
explain select code  from test1;
```

##### 结果：

![image-20211210065632710](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311061343897.png)

##### 怎么算的？

183 = 30 * 3 + 1 + 30 * 3 + 2

**还有一个问题：为什么这列表示索引使用是否充分呢，还有使用不充分的情况？**

执行sql如下：

```sql
explain select code  from test1 where code='001';
```

##### 结果：

![image-20211210065614694](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311061343896.png)

上图中使用了联合索引：idx_code_name，**如果索引全匹配key_len应该是183，但实际上却是92，这就说明没有使用所有的索引，索引使用不充分。**

### ref列 

该列表示索引命中的列或者常量。

执行sql如下：

```
explain select *  from test1 t1 inner join test1 t2 on t1.id=t2.id where t1.code='001';
```

结果：

![image-20211210065550136](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311061343684.png)

我们看到表t1命中的索引是const(常量)，而t2命中的索引是列sue库的t1表的id字段。

### rows列

该列表示MySQL认为执行查询必须检查的行数。

![image-20211210065533278](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311061343990.png)

对于InnoDB表，此数字是估计值，可能并不总是准确的。

### filtered列

该列表示按表条件过滤的表行的估计百分比。最大值为100，这表示未过滤行。**值从100减小表示过滤量增加**。

![image-20211210065517222](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311061344085.png)

**rows显示了检查的估计行数，rows× filtered显示了与下表连接的行数。例如，如果 rows为1000且 filtered为50.00（50％），则与下表连接的行数为1000×50％= 500。**

### Extra列

该字段包含有关MySQL如何解析查询的其他信息，这列还是挺重要的，但是里面包含的值太多，就不一一介绍了，只列举几个常见的。

1. **Impossible WHERE**

   表示WHERE后面的条件一直都是false，

   执行sql如下：

   ```sql
   explain select code  from test1 where 'a' = 'b';
   ```

   结果：

   ![image-20211210065459314](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311061344749.png)

2. **Using filesort**

   表示按文件排序，**一般是在指定的排序和索引排序不一致的情况才会出现。**

   执行sql如下：

   ```sql
explain select code  from test1 order by name desc;
   ```
   
   结果：

   ![image-20211210065438315](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311061344411.png)

   这里建立的是code和name的联合索引，**顺序是code在前，name在后，这里直接按name降序，跟之前联合索引的顺序不一样。**

3. **Using index**

   表示是否用了覆盖索引，说白了它表示是否所有获取的列都走了索引。

   ![image-20211210065417704](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311061345232.png)

   上面那个例子中其实就用到了：Using index，因为只返回一列code，它字段走了索引。

4. **Using temporary**

   表示是否使用了临时表，一般多见于order by 和 group by语句。

   执行sql如下：

   ```sql
   explain select name  from test1 group by name;
   ```

   结果：

   ![image-20211210065354397](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311061345810.png)

5. **Using where**

   表示使用了where条件过滤。

6. **Using join buffer**

  表示是否使用连接缓冲。来自较早联接的表被部分读取到联接缓冲区中，然后从缓冲区中使用它们的行来与当前表执行联接。

## 索引优化的过程

  1.先用慢查询日志定位具体需要优化的sql

  2.使用explain执行计划查看索引使用情况

  3.重点关注：

```sql
 key（查看有没有使用索引）
 key_len（查看索引使用是否充分）
 type（查看索引类型）
 Extra（查看附加信息：排序、临时表、where条件为false等）
```

  一般情况下根据这4列就能找到索引问题。

  4.根据步骤1找出的索引问题优化sql

  5.再回到第2步

### 索引建立规范

##### 【建议】（1）避免在更新比较频繁、区分度不高的列上单独建立索引

解读：区分度不高的列单独创建索引的优化效果很小，但是较为频繁的更新则会让索引的维护成本更高

##### 【强制】（2） JOIN的表不允许超过五个。需要JOIN的字段，数据类型必须绝对一致; 多表关联查询时，保证被关联的字段需要有索引。

解读：太多表的`JOIN`会让Mysql的优化器更难权衡出一个“最佳”的执行计划（可能性为表数量的阶乘），同时要注意关联字段的类型、长度、字符编码等等是否一致。

##### 【强制】（3）在一个联合索引中，若第一列索引区分度等于1，那么则不需要建立联合索引。

解读：索引通过第一列就能够完全定位的数据，所以联合索引的后边部分是不需要的。

##### 【强制】（4）建立联合索引时，必须将区分度更高的字段放在左边

解读：区分度更高的列放在左边，能够在一开始就有效的过滤掉无用数据。提高索引的效率，相应我们在`Mapper`中编写`SQL`的`WHERE`条件中有多个条件时，需要先看看当前表是否有现成的联合索引直接使用，注意各个条件的顺序尽量和索引的顺序一致。

##### 【建议】（5）利用覆盖索引来进行查询操作，避免回表

解读：覆盖查询即是查询只需要通过索引即可拿到所需DATA，而不再需要再次回表查询，所以效率相对很高。我们在使用`EXPLAIN`的结果，extra列会出现：`"using index"`。这里也要强调一下不要使用`“SELECT * ”`，否则几乎不可能使用到覆盖索引。

##### 【建议】（6）在较长VARCHAR字段,例如VARCHAR(100)上建立索引时，应指定索引长度，没必要对全字段建立索引，根据实际文本区分度决定索引长度即可。

解读：索引的长度与区分度是一对矛盾体，一般对字符串类型数据，若长度为20的索引，区分度会高达90%以上，则可以考虑创建长度例为20的索引，而非全字段索引。例如可以使用`SELECT COUNT(DISTINCT LEFT(lesson_code, 20)) / COUNT(*) FROM lesson;`来确定`lesson_code`字段字符长度为20时文本区分度。

##### 【建议】（7）如果有ORDER BY的场景，请注意利用索引的有序性。ORDER BY最后的字段是联合索引的一部分，并且放在索引组合顺序的最后，避免出现file_sort的情况，影响查询性能。

解读：1、假设有查询条件为`WHERE a=? and b=? ORDER BY c；` 存在索引：`a_b_c`，则此时可以利用索引排序。2、反例：在查询条件中包含了范围查询，那么索引有序性无法利用，如:`WHERE a>10 ORDER BY b;` 索引`a_b`无法排序。

##### 【建议】（8）在`where`中索引的列不能某个表达式的一部分，也不能是函数的参数。

解读：即是某列上已经添加了索引，但是若此列成为表达式的一部分、或者是函数的参数，Mysql无法将此列单独解析出来，索引也不会生效。

##### 【建议】 （9）我们在`where`条件中使用范围查询时，索引最多用于一个范围条件，超过一个则后边的不走索引。

解读：Mysql能够使用多个范围条件里边的最左边的第一个范围查询，但是后边的范围查询则无法使用。

##### 【建议】 （10）在多个表进行外连接时，表之间的关联字段类型必须完全一致

解读：当两个表进行Join时，字段类型若没有完全一致，则加索引也不会生效，这里的完全一致包括但不限于字段类型、字段长度、字符集、collection等等