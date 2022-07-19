# 图灵mysql

[toc]


# 1、深入理解Mysql索引底层数据结构与算法

![image-20211210103101138](/Users/jiusonghuang/pic-md/20211210103101.png)

##  二叉搜索树

 二叉搜索树是一种特殊的[二叉树](https://so.csdn.net/so/search?from=pc_blog_highlight&q=二叉树)，它的特点是：

1. 对于任意一个节点p，存储在p的左子树的中的所有节点中的值都小于p中的值

2. 对于任意一个节点p，存储在p的右子树的中的所有节点中的值都大于p中的值

   基于[二叉搜索树](https://so.csdn.net/so/search?from=pc_blog_highlight&q=二叉搜索树)的特性，**采用中序遍历的方式可以使得遍历结果是按照从小到大的顺序排列的**。

数据结构可视化网址：https://www.cs.usfca.edu/~galles/visualization/Algorithms.html

![image-20211210222221205](/Users/jiusonghuang/pic-md/20211210222221.png)

## B+Tree

mysql采用B+Tree数据结构，数据从左到右排序

查看mysql文件页大小（16K）：SHOW GLOBAL STATUS like 'Innodb_page_size’;

为什么mysql页文件默认16K？
假设我们一行数据大小为1K，那么一页就能存16条数据，也就是一个叶子节点能存16条数据；再看非叶子节点，假设主键ID为bigint类型，那么长度为8B，指针大小在Innodb源码中为6B，一共就是14B，那么一页里就可以存储16K/14=1170个(主键+指针)
那么一颗高度为2的B+树能存储的数据为：1170*16=18720条，一颗高度为3的B+树能存储的数据为：1170**1170*16=21902400（千万级条）

![image-20211210223842939](/Users/jiusonghuang/pic-md/20211210223843.png)

![image-20211210223907203](/Users/jiusonghuang/pic-md/20211210223907.png)

## hash索引

hash索引不支持范围查找，因为无法比较

![image-20211210231358763](/Users/jiusonghuang/pic-md/20211210231358.png)

![image-20211210231839615](/Users/jiusonghuang/pic-md/20211210231839.png)

![image-20211210223937092](/Users/jiusonghuang/pic-md/20211210223937.png)

## MyISAM引擎

MyISAM引擎中，myi文件存储索引数据，MYD存储数据，属于不同的文件。索引文件按照BTree组织索引的数据结构。

## InnoDB

InnoDB按照B+Tree存储数据，但是会包含完整的数据，将下一级节点中最小的节点 提上去作为上一级的节点（描述不准确）

![image-20211210224006859](/Users/jiusonghuang/pic-md/20211210224006.png)

## 索引最左前缀原理

![image-20211210224027377](/Users/jiusonghuang/pic-md/20211210224027.png)

![image-20211210224040308](/Users/jiusonghuang/pic-md/20211210224040.png)

## 联合索引

按照联合索引建立的字段顺序，自动建立BTree索引文件，联合主键，包含完整数据

如果跳过联合索引的字段顺序，就无法按照字段的顺序进行高效定位

# 2、Explain详解与索引最佳实践

**Mysql安装文档参考**：https://blog.csdn.net/yougoule/article/details/56680952 

## **Explain工具介绍** 

使用EXPLAIN关键字可以模拟优化器执行SQL语句，分析你的查询语句或是结构的性能瓶颈 

在 select 语句之前增加 explain 关键字，MySQL 会在查询上设置一个标记，执行查询会返回执行计划的信息，而不是 

执行这条SQL 

注意：如果 from 中包含子查询，仍会执行该子查询，将结果放入临时表中 

## **Explain分析示例** 

参考官方文档：https://dev.mysql.com/doc/refman/5.7/en/explain-output.html 

```SQL
示例表： 
DROP TABLE IF EXISTS `actor`; 
CREATE TABLE `actor` ( 
	`id` int(11) NOT NULL, 
	`name` varchar(45) DEFAULT NULL, 
	`update_time` datetime DEFAULT NULL, 
	PRIMARY KEY (`id`) 
) ENGINE=InnoDB DEFAULT CHARSET=utf8; 
INSERT INTO `actor` (`id`, `name`, `update_time`) VALUES (1,'a','2021-12-11 11:35:29'), (2,'b','2021-12-11 11:35:29'), (3,'c','2021-12-11 11:35:29'); 
DROP TABLE IF EXISTS `film`; 
 CREATE TABLE `film` ( 
	`id` int(11) NOT NULL AUTO_INCREMENT, 
	`name` varchar(10) DEFAULT NULL, 
	PRIMARY KEY (`id`), 
	KEY `idx_name` (`name`) 
	) ENGINE=InnoDB DEFAULT CHARSET=utf8; 
INSERT INTO `film` (`id`, `name`) VALUES (3,'film0'),(1,'film1'),(2,'film2'); 
DROP TABLE IF EXISTS `film_actor`; 
CREATE TABLE `film_actor` ( 
	`id` int(11) NOT NULL, 
 	`film_id` int(11) NOT NULL, 
	`actor_id` int(11) NOT NULL, 
 	`remark` varchar(255) DEFAULT NULL, 
	PRIMARY KEY (`id`), 
	KEY `idx_film_actor_id` (`film_id`,`actor_id`) 
) ENGINE=InnoDB DEFAULT CHARSET=utf8; 
INSERT INTO `film_actor` (`id`, `film_id`, `actor_id`) VALUES (1,1,1),(2,1,2),(3,2,1); 
```

```SQL
mysql> explain select * from actor;
```

![image-20211211113729938](/Users/jiusonghuang/pic-md/20211211113730.png)

在查询中的每个表会输出一行，如果有两个表通过 join 连接查询，那么会输出两行 

### **explain 两个变种** 

1）**explain extended**：会在 explain 的基础上额外提供一些查询优化的信息。紧随其后通过 show warnings 命令可 

以得到优化后的查询语句，从而看出优化器优化了什么。额外还有 filtered 列，是一个半分比的值，rows * 

filtered/100 可以**估算**出将要和 explain 中前一个表进行连接的行数（前一个表指 explain 中的id值比当前表id值小的 

表）。

```
 mysql> explain extended select * from film where id = 1; 
```

![image-20211211113857847](/Users/jiusonghuang/pic-md/20211211113857.png)

```
 mysql> show warnings; 
```

![image-20211211113943174](/Users/jiusonghuang/pic-md/20211211113943.png)

2）**explain partitions**：相比 explain 多了个 partitions 字段，如果查询是基于分区表的话，会显示查询将访问的分 

区。

### **explain中的列** 

接下来我们将展示 explain 中每个列的信息。 

**1. id列** 

id列的编号是 select 的序列号，有几个 select 就有几个id，并且id的顺序是按 select 出现的顺序增长的。 

id列越大执行优先级越高，id相同则从上往下执行，id为NULL最后执行。 

**2. select_type列** 

select_type 表示对应行是简单还是复杂的查询。 

1）simple：简单查询。查询不包含子查询和union 

```
mysql> explain select * from film where id = 2; 
```

![image-20211211114046872](/Users/jiusonghuang/pic-md/20211211114046.png)

2）primary：复杂查询中最外层的 select 

3）subquery：包含在 select 中的子查询（不在 from 子句中） 

4）derived：包含在 from 子句中的子查询。MySQL会将结果存放在一个临时表中，也称为派生表（derived的英文含 

义）

用这个例子来了解 primary、subquery 和 derived 类型 

```
mysql> set session optimizer_switch='derived_merge=off'; #关闭mysql5.7新特性对衍生表的合 并优化 mysql> explain select (select 1 from actor where id = 1) from (select * from film where id = 1) der;
```

![image-20211211114417281](/Users/jiusonghuang/pic-md/20211211114417.png)

```
mysql> set session optimizer_switch='derived_merge=on'; #还原默认配置 
```

5）union：在 union 中的第二个和随后的 select 

```
 mysql> explain select 1 union all select 1;
```

![image-20211211114735080](/Users/jiusonghuang/pic-md/20211211114735.png)

**3. table列** 

这一列表示 explain 的一行正在访问哪个表。 

当 from 子句中有子查询时，table列是 <derivenN> 格式，表示当前查询依赖 id=N 的查询，于是先执行 id=N 的查 

询。

当有 union 时，UNION RESULT 的 table 列的值为<union1,2>，1和2表示参与 union 的 select 行id。 

**4. type列** 

这一列表示**关联类型或访问类型**，即MySQL决定如何查找表中的行，查找数据行记录的大概范围。 

依次从最优到最差分别为：**system > const > eq_ref > ref > range > index > ALL** 

一般来说，**得保证查询达到range级别，最好达到ref** 

**NULL**：mysql能够在优化阶段分解查询语句，在执行阶段用不着再访问表或索引。例如：在索引列中选取最小值，可 

以单独查找索引来完成，不需要在执行时访问表 

```
mysql> explain select min(id) from film; 
```

![image-20211211114937081](/Users/jiusonghuang/pic-md/20211211114937.png)

**const, system**：mysql能对查询的某部分进行优化并将其转化成一个常量（可以看show warnings 的结果）。用于 

primary key 或 unique key 的所有列与常数比较时，所以表最多有一个匹配行，读取1次，速度比较快。**system是** 

**const的特例**，表里只有一条元组匹配时为system 

```
 mysql> explain extended select * from (select * from film where id = 1) tmp; 
```

![image-20211211115200895](/Users/jiusonghuang/pic-md/20211211115201.png)

```
mysql> show warnings; 
```

![image-20211211115302377](/Users/jiusonghuang/pic-md/20211211115302.png)

**eq_ref**：primary key 或 unique key 索引的所有部分被连接使用 ，最多只会返回一条符合条件的记录。这可能是在 

const 之外最好的联接类型了，简单的 select 查询不会出现这种 type。 

```
mysql> explain select * from film_actor left join film on film_actor.film_id = film.id; 
```

![image-20211211120035384](/Users/jiusonghuang/pic-md/20211211120035.png)

**ref**：相比 eq_ref，不使用唯一索引，而是使用普通索引或者唯一性索引的部分前缀，索引要和某个值相比较，可能会 

找到多个符合条件的行。 

1. 简单 select 查询，name是普通索引（非唯一索引） 

```
 mysql> explain select * from film where name = 'film1'; 
```

![image-20211211120147343](/Users/jiusonghuang/pic-md/20211211120147.png)

2.关联表查询，idx_film_actor_id是film_id和actor_id的联合索引，这里使用到了film_actor的左边前缀film_id部分。 

```
 mysql> explain select film_id from film left join film_actor on film.id = film_actor.film_id; 
```

![image-20211211120307101](/Users/jiusonghuang/pic-md/20211211120307.png)

**range**：范围扫描通常出现在 in(), between ,> ,<, >= 等操作中。使用一个索引来检索给定范围的行。 

```
 mysql> explain select * from actor where id > 1;
```

![image-20211211120510868](/Users/jiusonghuang/pic-md/20211211120511.png)

**index**：扫描全索引就能拿到结果，一般是扫描某个二级索引，这种扫描不会从索引树根节点开始快速查找，而是直接对二级索引的叶子节点遍历和扫描，速度还是比较慢的，这种查询一般为使用覆盖索引，二级索引一般比较小，所以这种通常比ALL快一些。 

```
mysql> explain select * from film; 
```

![image-20211211120805866](/Users/jiusonghuang/pic-md/20211211120806.png)

**ALL**：即全表扫描，扫描你的聚簇索引的所有叶子节点。通常情况下这需要增加索引来进行优化了。 

```
mysql> explain select * from actor; 
```

![image-20211211121154767](/Users/jiusonghuang/pic-md/20211211121154.png)

**5. possible_keys列** 

这一列显示查询可能使用哪些索引来查找。 

explain 时可能出现 possible_keys 有列，而 key 显示 NULL 的情况，这种情况是因为表中数据不多，mysql认为索引对此查询帮助不大，选择了全表查询。 

如果该列是NULL，则没有相关的索引。在这种情况下，可以通过检查 where 子句看是否可以创造一个适当的索引来提 高查询性能，然后用 explain 查看效果。 

**6. key列** 

这一列显示mysql实际采用哪个索引来优化对该表的访问。 

如果没有使用索引，则该列是 NULL。如果想强制mysql使用或忽视possible_keys列中的索引，在查询中使用 force index、ignore index。 

**7. key_len列** 

这一列显示了mysql在索引里使用的字节数，通过这个值可以算出具体使用了索引中的哪些列。 

举例来说，film_actor的联合索引 idx_film_actor_id 由 film_id 和 actor_id 两个int列组成，并且每个int是4字节。通过结果中的key_len=4可推断出查询使用了第一个列：film_id列来执行索引查找。 

```
 mysql> explain select * from film_actor where film_id = 2; 
```

![image-20211211121322169](/Users/jiusonghuang/pic-md/20211211121322.png)

key_len计算规则如下： 

- 字符串，char(n)和varchar(n)，5.0.3以后版本中，**n均代表字符数，而不是字节数，**如果是utf-8，一个数字 

或字母占1个字节，一个汉字占3个字节 

​			char(n)：如果存汉字长度就是 3n 字节 

​			varchar(n)：如果存汉字则长度是 3n + 2 字节，加的2字节用来存储字符串长度，因为varchar是变长字符串 

- 数值类型

​			tinyint：1字节 

​			smallint：2字节 

​			int：4字节 

​			bigint：8字节 

- 时间类型

​			date：3字节

​			timestamp：4字节 

​			datetime：8字节 

- 如果字段允许为 NULL，需要1字节记录是否为 NULL 

索引最大长度是768字节，当字符串过长时，mysql会做一个类似左前缀索引的处理，将前半部分的字符提取出来做索 引。

**8. ref列** 

这一列显示了在key列记录的索引中，表查找值所用到的列或常量，常见的有：const（常量），字段名（例：film.id） 

**9. rows列** 

这一列是mysql估计要读取并检测的行数，注意这个不是结果集里的行数。 

**10. Extra列** 

这一列展示的是额外信息。常见的重要值如下： 

1）**Using index**：使用覆盖索引 

**覆盖索引定义**：mysql执行计划explain结果里的key有使用索引，如果select后面查询的字段都可以从这个索引的树中 

获取，这种情况一般可以说是用到了覆盖索引，extra里一般都有using index；覆盖索引一般针对的是辅助索引，整个 

查询结果只通过辅助索引就能拿到结果，不需要通过辅助索引树找到主键，再通过主键去主键索引树里获取其它字段值 

```sql
1 mysql> explain select film_id from film_actor where film_id = 1; 
```

![image-20211211121702817](/Users/jiusonghuang/pic-md/20211211121702.png)

2）**Using where**：使用 where 语句来处理结果，并且查询的列未被索引覆盖 

```sql
l1 mysql> explain select * from actor where name = 'a'; 
```

![image-20211211121735812](/Users/jiusonghuang/pic-md/20211211121735.png)

3）**Using index condition**：查询的列不完全被索引覆盖，where条件中是一个前导列的范围； 

```sql
1 mysql> explain select * from film_actor where film_id > 1;
```

![image-20211211121813656](/Users/jiusonghuang/pic-md/20211211121813.png)

4）**Using temporary**：mysql需要创建一张临时表来处理查询。出现这种情况一般是要进行优化的，首先是想到用索 

引来优化。 

1. actor.name没有索引，此时创建了张临时表来distinct 

```sql
1 mysql> explain select distinct name from actor; 
```

![image-20211211121856879](/Users/jiusonghuang/pic-md/20211211121857.png)

2. film.name建立了idx_name索引，此时查询时extra是using index,没有用临时表 

```sql
mysql> explain select distinct name from film; 
```

![image-20211211121933066](/Users/jiusonghuang/pic-md/20211211121933.png)

5）**Using filesort**：将用外部排序而不是索引排序，数据较小时从内存排序，否则需要在磁盘完成排序。这种情况下一 

般也是要考虑使用索引来优化的。 

1. actor.name未创建索引，会浏览actor整个表，保存排序关键字name和对应的id，然后排序name并检索行记录 

```sql
mysql> explain select * from actor order by name;
```

![image-20211211122508113](/Users/jiusonghuang/pic-md/20211211122508.png)

​	2. film.name建立了idx_name索引,此时查询时extra是using index 

```sql
mysql> explain select * from film order by name; 
```

![image-20211211122903952](/Users/jiusonghuang/pic-md/20211211122904.png)

6）**Select tables optimized away**：使用某些聚合函数（比如 max、min）来访问存在索引的某个字段时 

```sql
mysql> explain select min(id) from film; 
```

![image-20211211123005292](/Users/jiusonghuang/pic-md/20211211123005.png)

### **索引最佳实践**

```sql
 1 示例表： 
 CREATE TABLE `employees` ( 
		`id` int(11) NOT NULL AUTO_INCREMENT, 
		`name` varchar(24) NOT NULL DEFAULT '' COMMENT '姓名', 
		`age` int(11) NOT NULL DEFAULT '0' COMMENT '年龄', 
		`position` varchar(20) NOT NULL DEFAULT '' COMMENT '职位', 
		`hire_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '入职时间', 
		PRIMARY KEY (`id`), 
		KEY `idx_name_age_position` (`name`,`age`,`position`) USING BTREE 
	) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8 COMMENT='员工记录表'; 
INSERT INTO employees(name,age,position,hire_time) VALUES('LiLei',22,'manager',NOW()); 
INSERT INTO employees(name,age,position,hire_time) VALUES('HanMeimei',23,'dev',NOW()); 
INSERT INTO employees(name,age,position,hire_time) VALUES('Lucy',23,'dev',NOW()); 
```

**1.全值匹配** 

KEY `idx_name_age_position` (`name`,`age`,`position`) USING BTREE 

```sql
 EXPLAIN SELECT * FROM employees WHERE name= 'LiLei'; 
```

![image-20211211124753838](/Users/jiusonghuang/pic-md/20211211124753.png)

```sql
 EXPLAIN SELECT * FROM employees WHERE name= 'LiLei' AND age = 22; 
```

![image-20211211124821796](/Users/jiusonghuang/pic-md/20211211124821.png)

```sql
 EXPLAIN SELECT * FROM employees WHERE name= 'LiLei' AND age = 22 AND position ='manager'; 
```

![image-20211211124846168](/Users/jiusonghuang/pic-md/20211211124846.png)

**2.最左前缀法则** 

如果索引了多列，要遵守最左前缀法则。指的是查询从索引的最左前列开始并且不跳过索引中的列。 

```sql
1 EXPLAIN SELECT * FROM employees WHERE name = 'Bill' and age = 31; 
```

![image-20211211125957740](/Users/jiusonghuang/pic-md/20211211125957.png)

```sql
2 EXPLAIN SELECT * FROM employees WHERE age = 30 AND position = 'dev'; 
```

![image-20211211130028522](/Users/jiusonghuang/pic-md/20211211130028.png)

```sql
3 EXPLAIN SELECT * FROM employees WHERE position = 'manager';
```

![image-20211211130106388](/Users/jiusonghuang/pic-md/20211211130106.png)

**3.不在索引列上做任何操作（计算、函数、（自动or手动）类型转换），会导致索引失效而转向全表扫描** 

```sql
1 EXPLAIN SELECT * FROM employees WHERE name = 'LiLei'; 
```

![image-20211211130146058](/Users/jiusonghuang/pic-md/20211211130146.png)

```sql
2 EXPLAIN SELECT * FROM employees WHERE left(name,3) = 'LiLei'; 
```

![image-20211211130208452](/Users/jiusonghuang/pic-md/20211211130208.png)

给hire_time增加一个普通索引： 

```sql
ALTER TABLE `employees` ADD INDEX `idx_hire_time` (`hire_time`) USING BTREE ; 

EXPLAIN select * from employees where date(hire_time) ='2018‐09‐30'; 
```

![image-20211211130253517](/Users/jiusonghuang/pic-md/20211211130253.png)

转化为日期范围查询，有可能会走索引： 

```sql
EXPLAIN select * from employees where hire_time >='2018‐09‐30 00:00:00' and hire_time < 
='2018‐09‐30 23:59:59'; 
```

添加索引之前

![image-20211211130515906](/Users/jiusonghuang/pic-md/20211211130516.png)

添加索引之后

![image-20211211130603823](/Users/jiusonghuang/pic-md/20211211130603.png)

还原最初索引状态 

```sql
 ALTER TABLE `employees` DROP INDEX `idx_hire_time`; 
```

**4.存储引擎不能使用索引中范围条件右边的列** 

```sql
 EXPLAIN SELECT * FROM employees WHERE name= 'LiLei' AND age = 22 AND position ='manager'; 
 EXPLAIN SELECT * FROM employees WHERE name= 'LiLei' AND age > 22 AND position ='manager'; 
```

![image-20211211130758360](/Users/jiusonghuang/pic-md/20211211130758.png)

**5.尽量使用覆盖索引（只访问索引的查询（索引列包含查询列）），减少 select \* 语句** 

```sql
EXPLAIN SELECT name,age FROM employees WHERE name= 'LiLei' AND age = 23 AND position ='manager'; 
```

![image-20211211130859573](/Users/jiusonghuang/pic-md/20211211130859.png)

```sql
EXPLAIN SELECT * FROM employees WHERE name= 'LiLei' AND age = 23 AND position ='manager'; 
```

![image-20211211131001108](/Users/jiusonghuang/pic-md/20211211131001.png)

**6.mysql在使用不等于（！=或者<>），****not in** **，****not exists** **的时候无法使用索引会导致全表扫描**；**<** **小于、** **>** **大于、** **<=**、**>=** **这些，mysql内部优化器会根据检索比例、表大小等多个因素整体评估是否使用索引** 

```sql
EXPLAIN SELECT * FROM employees WHERE name != 'LiLei'; 
```

![image-20211211131144953](/Users/jiusonghuang/pic-md/20211211131145.png)

**7.is null,is not null 一般情况下也无法使用索引** 

```sql
 EXPLAIN SELECT * FROM employees WHERE name is null 
```

![image-20211211131221307](/Users/jiusonghuang/pic-md/20211211131221.png)

**8.like以通配符开头（'$abc...'）mysql索引失效会变成全表扫描操作** 

```sql
EXPLAIN SELECT * FROM employees WHERE name like '%Lei'
```

![image-20211211131412055](/Users/jiusonghuang/pic-md/20211211131412.png)

```sql
EXPLAIN SELECT * FROM employees WHERE name like 'Lei%' 
```

![image-20211211131447289](/Users/jiusonghuang/pic-md/20211211131447.png)

问题：解决like'%字符串%'索引不被使用的方法？ 

a）使用覆盖索引，查询字段必须是建立覆盖索引字段 

```sql
EXPLAIN SELECT name,age,position FROM employees WHERE name like '%Lei%'; 
```

![image-20211211131534613](/Users/jiusonghuang/pic-md/20211211131534.png)

b）如果不能使用覆盖索引则可能需要借助搜索引擎 

**9.字符串不加单引号索引失效** 

```sql
 EXPLAIN SELECT * FROM employees WHERE name = '1000'; 
```

![image-20211211131649853](/Users/jiusonghuang/pic-md/20211211131650.png)

```sql
 EXPLAIN SELECT * FROM employees WHERE name = 1000; 
```

![image-20211211131719171](/Users/jiusonghuang/pic-md/20211211131719.png)

**10.少用or或in，用它查询时，mysql不一定使用索引，mysql内部优化器会根据检索比例、表大小等多个因素整体估是否使用索引，详见范围查询优化** 

```sql
EXPLAIN SELECT * FROM employees WHERE name = 'LiLei' or name = 'HanMeimei'; 
```

![image-20211211131816835](/Users/jiusonghuang/pic-md/20211211131817.png)

**11.范围查询优化** 

给年龄添加单值索引 

```sql
ALTER TABLE `employees` ADD INDEX `idx_age` (`age`) USING BTREE ; 
explain select * from employees where age >=1 and age <=2000; 
```

![image-20211211131857063](/Users/jiusonghuang/pic-md/20211211131857.png)

没走索引原因：mysql内部优化器会根据检索比例、表大小等多个因素整体评估是否使用索引。比如这个例子，可能是由于单次数据量查询过大导致优化器最终选择不走索引 

优化方法：可以将大的范围拆分成多个小范围

```sql
 explain select * from employees where age >=1 and age <=1000; 
 explain select * from employees where age >=1001 and age <=2000; 
```

![image-20211211132104393](/Users/jiusonghuang/pic-md/20211211132104.png)

还原最初索引状态 

```sql
 ALTER TABLE `employees` DROP INDEX `idx_age`; 
```

**索引使用总结：**like KK%相当于=常量，%KK和%KK% 相当于范围 

![image-20211211132335150](/Users/jiusonghuang/pic-md/20211211132335.png)

```sql
1 ‐‐ mysql5.7关闭ONLY_FULL_GROUP_BY报错 
select version(), @@sql_mode;
SET sql_mode=(SELECTREPLACE(@@sql_mode,'ONLY_FULL_GROUP_BY','')); 
```

文档：Explain详解与索引最佳实践 

```
http://note.youdao.com/noteshareid=59d7a574ef9a905e3bb0982bbe33e74d&sub=83A39BAAADD14B8F99E1DCEFFB7642CA
```

# 3、SQL底层执行原理详解

## MySQL的内部组件结构

![image-20211211152020218](/Users/jiusonghuang/pic-md/20211211152021.png)

大体来说，MySQL 可以分为 Server 层和存储引擎层两部分。 

### **Server层**

​	主要包括连接器、查询缓存、分析器、优化器、执行器等，涵盖 MySQL 的大多数核心服务功能，以及所有的内置函数 （如日期、时间、数学和加密函数等），所有跨存储引擎的功能都在这一层实现，比如存储过程、触发器、视图等。 

### **Store层**

​	存储引擎层负责数据的存储和提取。其架构模式是插件式的，支持 InnoDB、MyISAM、Memory 等多个存储引擎。现在最常用的存储引擎是 InnoDB，它从 MySQL 5.5.5 版本开始成为了默认存储引擎。也就是说如果我们在create table时不指定表的存储引擎类型,默认会给你设置存储引擎为InnoDB。

本节课演示表的DDL： 

```sql
 CREATE TABLE `test` ( 
   `id` int(11) NOT NULL AUTO_INCREMENT, 
   `name` varchar(255) DEFAULT NULL, 
   PRIMARY KEY (`id`) 
 ) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8; 
```

下面我们重点来分析连接器、查询缓存、分析器、优化器、执行器分别主要干了哪些事情。 

## **连接器**

我们知道由于MySQL是开源的，他有非常多种类的客户端：navicat，mysql front，jdbc，SQLyog等非常丰富的客户端，这些 客户端要向mysql发起通信都必须先跟Server端建立通信连接，而建立连接的工作就是有连接器完成的。 

第一步，你会先连接到这个数据库上，这时候接待你的就是连接器。连接器负责跟客户端建立连接、获取权限、维持和管理连接。连接命令一般是这么写的： 

```shell
[root@192 ~]# mysql ‐h host[数据库地址] ‐u root[用户] ‐p root[密码] ‐P 3306 
```

连接命令中的 mysql 是客户端工具，用来跟服务端建立连接。在完成经典的 TCP 握手后，连接器就要开始认证你的身份， 这个时候用的就是你输入的用户名和密码。 

```
1、如果用户名或密码不对，你就会收到一个"Access denied for user"的错误，然后客户端程序结束执行。 
2、如果用户名密码认证通过，连接器会到权限表里面查出你拥有的权限。之后，这个连接里面的权限判断逻辑，都将依赖于此时读到的权限。
```

这就意味着，一个用户成功建立连接后，即使你用管理员账号对这个用户的权限做了修改，也不会影响已经存在连接的权限。修改完成后，只有再新建的连接才会使用新的权限设置。用户的权限表在系统表空间的mysql的user表中。 

![image-20211211153004648](/Users/jiusonghuang/pic-md/20211211153004.png)

修改user密码 

```shell
 mysql> CREATE USER 'username'@'host' IDENTIFIED BY 'password'; //创建新用户 
 mysql> grant all privileges on *.* to 'username'@'%'; //赋权限,%表示所有(host) 
 mysql> flush privileges //刷新数据库 
 mysql> update user set password=password(”123456″) where user=’root’;(设置用户名密码) 
 mysql> show grants for root@"%"; 查看当前用户的权限 
```

连接完成后，如果你没有后续的动作，这个连接就处于空闲状态，你可以在 show processlist 命令中看到它。文本中这个图是 show processlist 的结果，其中的 Command 列显示为“Sleep”的这一行，就表示现在系统里面有一个空闲连接。 

![image-20211211154711388](/Users/jiusonghuang/pic-md/20211211154711.png)

客户端如果长时间不发送command到Server端，连接器就会自动将它断开。这个时间是由参数 wait_timeout 控制的，默认值是 8 小时。 

查看wait_timeout 

```shell
1 mysql> show global variables like "wait_timeout"; 
2 mysql>set global wait_timeout=28800; 设置全局服务器关闭非交互连接之前等待活动的秒数 
```

![image-20211211154844179](/Users/jiusonghuang/pic-md/20211211154844.png)

如果在连接被断开之后，客户端再次发送请求的话，就会收到一个错误提醒： Lost connection to MySQL server during 

query。这时候如果你要继续，就需要重连，然后再执行请求了。

数据库里面，长连接是指连接成功后，如果客户端持续有请求，则一直使用同一个连接。短连接则是指每次执行完很少的几次查询就断开连接，下次查询再重新建立一个。 

开发当中我们大多数时候用的都是长连接，把连接放在Pool内进行管理，但是长连接有些时候会导致 MySQL 占用内存涨得特别快，这是因为 MySQL 在执行过程中临时使用的内存是管理在连接对象里面的。这些资源会在连接断开的时候才释放。所以如果长连接累积下来，可能导致内存占用太大，被系统强行杀掉（OOM），从现象看就是 MySQL 异常重启了。 

怎么解决这类问题呢？ 

```
1、定期断开长连接。使用一段时间，或者程序里面判断执行过一个占用内存的大查询后，断开连接，之后要查询再重连。 
2、如果你用的是 MySQL 5.7 或更新版本，可以在每次执行一个比较大的操作后，通过执行 mysql_reset_connection来重新初始化连接资源。这个过程不需要重连和重新做权限验证，但是会将连接恢复到刚刚创建完时的状态。 
```

**查询缓存**

 常用的一些操作

```shell
mysql>show databases; 显示所有数据库 
mysql>use dbname； 打开数据库： 
mysql>show tables; 显示数据库mysql中所有的表； 
mysql>describe user; 显示表mysql数据库中user表的列信息）； 
```

连接建立完成后，你就可以执行 select 语句了。执行逻辑就会来到第二步：查询缓存。 

MySQL 拿到一个查询请求后，会先到查询缓存看看，之前是不是执行过这条语句。之前执行过的语句及其结果可能会以key-value 对的形式，被直接缓存在内存中。key 是查询的语句，value 是查询的结果。如果你的查询能够直接在这个缓存中找到 key，那么这个 value 就会被直接返回给客户端。 

如果语句不在查询缓存中，就会继续后面的执行阶段。执行完成后，执行结果会被存入查询缓存中。你可以看到，如果查询命中缓存，MySQL 不需要执行后面的复杂操作，就可以直接返回结果，这个效率会很高。 

**大多数情况查询缓存就是个鸡肋，为什么呢？** 

因为查询缓存往往弊大于利。查询缓存的失效非常频繁，只要有对一个表的更新，这个表上所有的查询缓存都会被清空。 

因此很可能你费劲地把结果存起来，还没使用呢，就被一个更新全清空了。对于更新压力大的数据库来说，查询缓存的命中率会非常低。 

一般建议大家在静态表里使用查询缓存，什么叫静态表呢？就是一般我们极少更新的表。比如，一个系统配置表、字典表，那这张表上的查询才适合使用查询缓存。好在 MySQL 也提供了这种“按需使用”的方式。你可以将my.cnf参数 

query_cache_type 设置成 DEMAND。 

```
my.cnf 
#query_cache_type有3个值 0代表关闭查询缓存OFF，1代表开启ON，2（DEMAND）代表当sql语句中有SQL_CACHE关键词时才缓存 
query_cache_type=2
```

这样对于默认的 SQL 语句都不使用查询缓存。而对于你确定要使用查询缓存的语句，可以用 SQL_CACHE 显式指定，像下面这个语句一样： 

```
 mysql> select SQL_CACHE * from test where ID=5； 
```

查看当前mysql实例是否开启缓存机制 

```
mysql> show global variables like "%query_cache_type%"; 
```

监控查询缓存的命中率: 

```
 mysql> show status like'%Qcache%'; //查看运行的缓存信息
```

![image-20211211213014673](/Users/jiusonghuang/pic-md/20211211213014.png)

- Qcache_free_blocks:表示查询缓存中目前还有多少剩余的blocks，如果该值显示较大，则说明查询缓存中的内存碎片过多了，可能在一定的时间进行整理。 
- Qcache_free_memory:查询缓存的内存大小，通过这个参数可以很清晰的知道当前系统的查询内存是否够用，是多了，还是不够用，DBA可以根据实际情况做出调整。 
- Qcache_hits:表示有多少次命中缓存。我们主要可以通过该值来验证我们的查询缓存的效果。数字越大，缓存效果越理想。
- Qcache_inserts: 表示多少次未命中然后插入，意思是新来的SQL请求在缓存中未找到，不得不执行查询处理，执行查询处理后把结果insert到查询缓存中。这样的情况的次数，次数越多，表示查询缓存应用到的比较少，效果也就不理想。当然系统刚启动后，查询缓存是空的，这很正常。 
- Qcache_lowmem_prunes:该参数记录有多少条查询因为内存不足而被移除出查询缓存。通过这个值，用户可以适当的调整缓存大小。 
- Qcache_not_cached: 表示因为query_cache_type的设置而没有被缓存的查询数量。 
- Qcache_queries_in_cache:当前缓存中缓存的查询数量。 
- Qcache_total_blocks:当前缓存的block数量。 

**mysql8.0已经移除了查询缓存功能** 

## **分析器**

如果没有命中查询缓存，就要开始真正执行语句了。首先，MySQL 需要知道你要做什么，因此需要对 SQL 语句做解析。 

分析器先会做“词法分析”。你输入的是由多个字符串和空格组成的一条 SQL 语句，MySQL 需要识别出里面的字符串分别是什么，代表什么。 

MySQL 从你输入的"select"这个关键字识别出来，这是一个查询语句。它也要把字符串“T”识别成“表名 T”，把字符串“ID”识别成“列 ID”。 

做完了这些识别以后，就要做“语法分析”。根据词法分析的结果，语法分析器会根据语法规则，判断你输入的这个 SQL 语句是否满足 MySQL 语法。 

如果你的语句不对，就会收到“You have an error in your SQL syntax”的错误提醒，比如下面这个语句 from 写成了"rom"。

```
1 mysql> select * fro test where id=1; 

2 ERROR 1064 (42000): You have an error in your SQL syntax; check the manual that corresponds to your MySQL server version for the right syntax to use near 'fro test where id=1' at line 1 
```

### **词法分析器原理** 

词法分析器分成6个主要步骤完成对sql语句的分析 

```
1、词法分析 
2、语法分析 
3、语义分析 
4、构造执行树 
5、生成执行计划 
6、计划的执行 
```

下图是SQL词法分析的过程步骤：![image-20211211164739121](/Users/jiusonghuang/pic-md/20211211164739.png)

SQL语句的分析分为词法分析与语法分析，mysql的词法分析由MySQLLex[MySQL自己实现的]完成，语法分析由Bison生成。关于语法树大家如果想要深入研究可以参考这篇wiki文章：https://en.wikipedia.org/wiki/LR_parser。那么除了Bison 外，Java当中也有开源的词法结构分析工具例如Antlr4，ANTLR从语法生成一个解析器，可以构建和遍历解析树，可以在IDEA 工具当中安装插件：**antlr v4 grammar plugin。插件使用详见课程** 

经过bison语法分析之后，会生成一个这样的语法树 

![image-20211211164817172](/Users/jiusonghuang/pic-md/20211211164817.png)

至此我们分析器的工作任务也基本圆满了。接下来进入到优化器 

## **优化器**

经过了分析器，MySQL 就知道你要做什么了。在开始执行之前，还要先经过优化器的处理。 

优化器是在表里面有多个索引的时候，决定使用哪个索引；或者在一个语句有多表关联（join）的时候，决定各个表的连接顺序。比如你执行下面这样的语句，这个语句是执行两个表的 join：

```
mysql> select * from test1 join test2 using(ID) where test1.name=yangguo and test2.name=xiaolongnv; 
```

既可以先从表 test1 里面取出 name=yangguo的记录的 ID 值，再根据 ID 值关联到表 test2，再判断 test2 里面 name的 

值是否等于 yangguo。 

也可以先从表 test2 里面取出 name=xiaolongnv 的记录的 ID 值，再根据 ID 值关联到 test1，再判断 test1 里面 name 

的值是否等于 yangguo。 

这两种执行方法的逻辑结果是一样的，但是执行的效率会有不同，而优化器的作用就是决定选择使用哪一个方案。优化器阶段完成后，这个语句的执行方案就确定下来了，然后进入执行器阶段。如果你还有一些疑问，比如优化器是怎么选择索引的，有没有可能选择错等等。 

## **执行器**

开始执行的时候，要先判断一下你对这个表T有没有执行查询的权限，如果没有，就会返回没有权限的错误，如下所示 (在工程实现上，如果命中查询缓存，会在查询缓存返回结果的时候，做权限验证。查询也会在优化器之前调用 precheck 验证权限)。

```
 mysql> select * from test where id=1; 
```

如果有权限，就打开表继续执行。打开表的时候，执行器就会根据表的引擎定义，去使用这个引擎提供的接口。 

比如我们这个例子中的表 test 中，ID 字段没有索引，那么执行器的执行流程是这样的： 

1. 调用 InnoDB 引擎接口取这个表的第一行，判断 ID 值是不是 10，如果不是则跳过，如果是则将这行存在结果集中； 

2. 调用引擎接口取“下一行”，重复相同的判断逻辑，直到取到这个表的最后一行。 

3. 执行器将上述遍历过程中所有满足条件的行组成的记录集作为结果集返回给客户端。 

至此，这个语句就执行完成了。对于有索引的表，执行的逻辑也差不多。第一次调用的是“取满足条件的第一行”这个接口，之后循环取“满足条件的下一行”这个接口，这些接口都是引擎中已经定义好的。你会在数据库的慢查询日志中看到一个rows_examined 的字段，表示这个语句执行过程中扫描了多少行。这个值就是在执行器每次调用引擎获取数据行的时候累加 的。在有些场景下，执行器调用一次，在引擎内部则扫描了多行，因此引擎扫描行数跟 rows_examined 并不是完全相同的。 

## **bin-log归档** 

删库是不需要跑路的，因为我们的SQL执行时，会将sql语句的执行逻辑记录在我们的bin-log当中，什么是bin-log呢？ 

binlog是Server层实现的二进制日志，他会记录我们的cud操作。Binlog有以下几个特点： 

```
1、Binlog在MySQL的Server层实现（引擎共用） 
2、Binlog为逻辑日志,记录的是一条语句的原始逻辑 
3、Binlog不限大小,追加写入,不会覆盖以前的日志 
```

如果我们误删了数据库，可以使用binlog进行归档!要使用binlog归档，首先我们得记录binlog，因此需要先开启MySQL的binlog功能。 

配置my.cnf 

```
配置开启binlog 
log‐bin=/usr/local/mysql/data/binlog/mysql‐bin 
注意5.7以及更高版本需要配置本项：server‐id=123454（自定义,保证唯一性）; 
#binlog格式，有3种statement,row,mixed 
binlog‐format=ROW 
#表示每1次执行写入就与硬盘同步，会影响性能，为0时表示，事务提交时mysql不做刷盘操作，由系统决定 
sync‐binlog=1
```

binlog命令 

```
mysql> show variables like '%log_bin%'; 查看bin‐log是否开启 
mysql> flush logs; 会多一个最新的bin‐log日志 
mysql> show master status; 查看最后一个bin‐log日志的相关信息 
mysql> reset master; 清空所有的bin‐log日志 
```

查看binlog内容 

```
mysql> /usr/local/mysql/bin/mysqlbinlog ‐‐no‐defaults /usr/local/mysql/data/binlog/mysql‐bin.000001 查看binlog内容 
```

binlog里的内容不具备可读性，所以需要我们自己去判断恢复的逻辑点位，怎么观察呢？看重点信息，比如begin，commit这种关键词信息，只要在binlog当中看到了，你就可以理解为begin-commit之间的信息是一个完整的事务逻辑,然后再根据位置position判断恢复即可。binlog内容如下： 

![image-20211211211504612](/Users/jiusonghuang/pic-md/20211211211504.png)

**数据归档操作** 

```
从bin‐log恢复数据 
恢复全部数据 
/usr/local/mysql/bin/mysqlbinlog ‐‐no‐defaults /usr/local/mysql/data/binlog/mysql‐bin.000001 
|mysql ‐uroot ‐p tuling(数据库名) 
 恢复指定位置数据 
/usr/local/mysql/bin/mysqlbinlog ‐‐no‐defaults ‐‐start‐position="408" ‐‐stop‐position="731" 
/usr/local/mysql/data/binlog/mysql‐bin.000001 |mysql ‐uroot ‐p tuling(数据库) 
 恢复指定时间段数据 
/usr/local/mysql/bin/mysqlbinlog ‐‐no‐defaults /usr/local/mysql/data/binlog/mysql‐bin.000001 
‐‐stop‐date= "2018‐03‐02 12:00:00" ‐‐start‐date= "2019‐03‐02 11:55:00"|mysql ‐uroot ‐p test(数据库) 
```

**归档测试准** 

1、定义一个存储过程，写入数据 

```sql
drop procedure if exists tproc;
delimiter $$
create procedure tproc(i int)
begin
    declare s int default 1;
    declare c char(50) default repeat('a',50);
    while s<=i do
        start transaction;
        insert into test values(null,c);
        commit;
        set s=s+1;
    end while;
end$$
delimiter ;
```

2、删除数据 

```sql
 mysql> truncate test; 
```

3、利用binlog归档 

```sql
mysql> /usr/local/mysql/bin/mysqlbinlog ‐‐no‐defaults /usr/local/mysql/data/binlog/mysql-bin.000001 |mysql ‐uroot ‐p tuling(数据库名)
```

4、归档完毕，数据恢复 

文档：一条SQL在MySQL中是如何执行的.note

链接：http://note.youdao.com/noteshare?id=6480d1e092ed1c14a53d86cd66a73139&sub=E23D6289647749E89B03C52DB85E3E84

# 4、Mysql索引优化实战一

**示例表**1

```sql
 CREATE TABLE employees ( 
	id int(11) NOT NULL AUTO_INCREMENT, 
  name varchar(24) NOT NULL DEFAULT '' COMMENT '姓名', 
  age int(11) NOT NULL DEFAULT '0' COMMENT '年龄', 
  position varchar(20) NOT NULL DEFAULT '' COMMENT '职位', 
  hire_time timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '入职时间', 
  PRIMARY KEY (id), 
  KEY idx_name_age_position (name,age,position) USING BTREE 
 ) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='员工记录表'; 
INSERT INTO employees(name,age,position,hire_time) VALUES('LiLei',22,'manager',NOW()); 
INSERT INTO employees(name,age,position,hire_time) VALUES('HanMeimei', 23,'dev',NOW()); 
INSERT INTO employees(name,age,position,hire_time) VALUES('Lucy',23,'dev',NOW()); 
‐‐ 插入一些示例数据 

DROP PROCEDURE IF EXISTS insert_emp;
delimiter;;
CREATE PROCEDURE insert_emp () 
BEGIN
	DECLARE i INT;
	SET i = 1;
	WHILE( i <= 100000 ) DO
		INSERT INTO employees ( NAME, age, position )VALUES( CONCAT( 'zhuge', i ), i, 'dev' );
		SET i = i + 1;
	END WHILE;
END;;
delimiter;
CALL insert_emp (); 
```

## **举一个大家不容易理解的综合例子：** 

**1、联合索引第一个字段用范围不会走索引** 

```sql
EXPLAIN SELECT * FROM employees WHERE name > 'LiLei' AND age = 22 AND position ='manager'; 
```

![image-20211212110310973](/Users/jiusonghuang/pic-md/20211212110311.png)

![image-20211212110728092](/Users/jiusonghuang/pic-md/20211212110728.png)

结论：联合索引第一个字段就用范围查找不会走索引，mysql内部可能觉得第一个字段就用范围，结果集应该很大，回表效率不高，还不如就全表扫描

**2、强制走索引** 

```sql
EXPLAIN SELECT * FROM employees force index(idx_name_age_position) WHERE name > 'LiLei' AND age = 22 AND position ='manager'; 
```

![image-20211212111138725](/Users/jiusonghuang/pic-md/20211212111139.png)

结论：虽然使用了强制走索引让联合索引第一个字段范围查找也走索引，扫描的行rows看上去也少了点，但是最终查找效率不一定比全表扫描高，因为回表效率不高 

做了一个小实验： 

```sql
 ‐‐ 关闭查询缓存 
 set global query_cache_size=0; 
 set global query_cache_type=0; 
```

‐‐ 执行时间0.333s 

```sql
SELECT * FROM employees WHERE name > 'LiLei'; 
```

‐‐ 执行时间0.444s

```sql
SELECT * FROM employees force index(idx_name_age_position) WHERE name > 'LiLei'; 
```

**3、覆盖索引优化** 

```sql
EXPLAIN SELECT name,age,position FROM employees WHERE name > 'LiLei' AND age = 22 AND position ='manager'; 
```

![image-20211212111927665](/Users/jiusonghuang/pic-md/20211212111927.png)

**4、in和or在表数据量比较大的情况会走索引，在表记录不多的情况下会选择全表扫描** 

```sql
EXPLAIN SELECT * FROM employees WHERE name in ('LiLei','HanMeimei','Lucy') AND age = 22 AND position ='manager'; 
```

![image-20211212112342620](/Users/jiusonghuang/pic-md/20211212112342.png)

```sql
EXPLAIN SELECT * FROM employees WHERE (name = 'LiLei' or name = 'HanMeimei') AND age = 22 AND position ='manager'; 
```

![image-20211212112419441](/Users/jiusonghuang/pic-md/20211212112419.png)

做一个小实验，将employees 表复制一张employees_copy的表，里面保留两三条记录 

```sql
EXPLAIN SELECT * FROM employees_copy WHERE name in ('LiLei','HanMeimei','Lucy') AND age = 22 AND position ='manager'; 
```

![image-20211212112533716](/Users/jiusonghuang/pic-md/20211212112607.png)

```sql
EXPLAIN SELECT * FROM employees_copy WHERE (name = 'LiLei' or name = 'HanMeimei') AND age = 22 AND position ='manager'; 
```

![image-20211212112640290](/Users/jiusonghuang/pic-md/20211212112640.png)

**5、like KK% 一般情况都会走索引** 

```sql
EXPLAIN SELECT * FROM employees WHERE name like 'LiLei%' AND age = 22 AND position ='manager'; 
```

![image-20211212125045577](/Users/jiusonghuang/pic-md/20211212125046.png)

```sql
EXPLAIN SELECT * FROM employees_copy WHERE name like 'LiLei%' AND age = 22 AND position ='manager'; 
```

![image-20211212125440632](/Users/jiusonghuang/pic-md/20211212125440.png)

这里给大家补充一个概念，**索引下推（Index Condition Pushdown，ICP）**, like KK%其实就是用到了索引下推优化 

## **什么是索引下推了？**

对于辅助的联合索引(name,age,position)，正常情况按照最左前缀原则，**SELECT \* FROM employees WHERE name like 'LiLei%'** **AND age = 22 AND position ='manager'** 这种情况只会走name字段索引，因为根据name字段过滤完，得到的索引行里的age和position是无序的，无法很好的利用索引。 

在MySQL5.6之前的版本，这个查询只能在联合索引里匹配到名字是 **'LiLei' 开头**的索引，然后拿这些索引对应的主键逐个回表，到主键索引上找出相应的记录，再比对**age**和**position**这两个字段的值是否符合。 

MySQL 5.6引入了索引下推优化，**可以在索引遍历过程中，对索引中包含的所有字段先做判断，过滤掉不符合条件的记录之后再回表，可以有效的减少回表次数**。使用了索引下推优化后，上面那个查询在联合索引里匹配到名字是 **'LiLei' 开头**的索引之后，同时还会在索引里过滤**age**和**position**这两个字段，拿着过滤完剩下的索引对应的主键id再回表查整行数据。 

索引下推会减少回表次数，对于innodb引擎的表索引下推只能用于二级索引，innodb的主键索引（聚簇索引）树叶子节点上保存的是全行数据，所以这个时候索引下推并不会起到减少查询全行数据的效果。 

## **为什么范围查找Mysql没有用索引下推优化？** 

估计应该是Mysql认为范围查找过滤的结果集过大，like KK% 在绝大多数情况来看，过滤后的结果集比较小，所以这里Mysql选择给 like KK% 用了索引下推优化，当然这也不是绝对的，有时like KK% 也不一定就会走索引下推。 

## **Mysql如何选择合适的索引** 

```sql
 mysql> EXPLAIN select * from employees where name > 'a';
```

![image-20211212130134236](/Users/jiusonghuang/pic-md/20211212130134.png)

如果用name索引需要遍历name字段联合索引树，然后还需要根据遍历出来的主键值（回表）去主键索引树里再去查出最终数据，成本比全表扫描还高，可以用覆盖索引优化，这样只需要遍历name字段的联合索引树就能拿到所有结果，如下： 

```sql
 mysql> EXPLAIN select name,age,position from employees where name > 'a' ; 
```

![image-20211212130237719](/Users/jiusonghuang/pic-md/20211212130237.png)

```sql
 mysql> EXPLAIN select * from employees where name > 'zzz' ; 
```

![image-20211212130159114](/Users/jiusonghuang/pic-md/20211212130159.png)

对于上面这两种 name>'a' 和 name>'zzz' 的执行结果，mysql最终是否选择走索引或者一张表涉及多个索引，mysql最 

终如何选择索引，我们可以用**trace工具**来一查究竟，开启trace工具会影响mysql性能，所以只能临时分析sql使用，用 

完之后立即关闭 

## **trace工具用法：**

```sql
 mysql> set session optimizer_trace="enabled=on",end_markers_in_json=on; ‐‐开启trace 
 mysql> select * from employees where name > 'a' order by position; 
 mysql> SELECT * FROM information_schema.OPTIMIZER_TRACE; 
 查看trace字段： 
 {
  "steps": [
    {
      "join_preparation": { —第一阶段： SQL准备阶段，格式化sql
        "select#": 1,
        "steps": [
          {
            "expanded_query": "/* select#1 */ select `employees`.`id` AS `id`,`employees`.`name` AS `name`,`employees`.`age` AS `age`,`employees`.`position` AS `position`,`employees`.`hire_time` AS `hire_time` from `employees` where (`employees`.`name` > 'a') order by `employees`.`position`"
          }
        ] /* steps */
      } /* join_preparation */
    },
    {
      "join_optimization": { —第二阶段：sql优化阶段
        "select#": 1,
        "steps": [
          {
            "condition_processing": { --条件处理
              "condition": "WHERE",
              "original_condition": "(`employees`.`name` > 'a')",
              "steps": [
                {
                  "transformation": "equality_propagation",
                  "resulting_condition": "(`employees`.`name` > 'a')"
                },
                {
                  "transformation": "constant_propagation",
                  "resulting_condition": "(`employees`.`name` > 'a')"
                },
                {
                  "transformation": "trivial_condition_removal",
                  "resulting_condition": "(`employees`.`name` > 'a')"
                }
              ] /* steps */
            } /* condition_processing */
          },
          {
            "substitute_generated_columns": {
            } /* substitute_generated_columns */
          },
          {
            "table_dependencies": [  - -表依赖详情
              {
                "table": "`employees`",
                "row_may_be_null": false,
                "map_bit": 0,
                "depends_on_map_bits": [
                ] /* depends_on_map_bits */
              }
            ] /* table_dependencies */
          },
          {
            "ref_optimizer_key_uses": [
            ] /* ref_optimizer_key_uses */
          },
          {
            "rows_estimation": [ —预估表的访问成本
              {
                "table": "`employees`",
                "range_analysis": {
                  "table_scan": {-- 全表扫描情况
                    "rows": 100114,  —扫描行数
                    "cost": 20314。 —查询成本
                  } /* table_scan */,
                  "potential_range_indexes": [ —查询可能使用的索引
                    {
                      "index": "PRIMARY", 主键索引
                      "usable": false,
                      "cause": "not_applicable"
                    },
                    {
                      "index": "idx_name_age_position", —辅助索引
                      "usable": true,
                      "key_parts": [
                        "name",
                        "age",
                        "position",
                        "id"
                      ] /* key_parts */
                    }
                  ] /* potential_range_indexes */,
                  "setup_range_conditions": [
                  ] /* setup_range_conditions */,
                  "group_index_range": {
                    "chosen": false,
                    "cause": "not_group_by_or_distinct"
                  } /* group_index_range */,
                  "analyzing_range_alternatives": { —分析各个索引使用成本
                    "range_scan_alternatives": [
                      {
                        "index": "idx_name_age_position",
                        "ranges": [
                          "a < name”。—索引使用范围
                        ] /* ranges */,
                        "index_dives_for_eq_ranges": true,
                        "rowid_ordered": false,  —使用该索引获取的记录是否按照主键排序
                        "using_mrr": false,
                        "index_only": false,  —是否使用覆盖索引
                        "rows": 50057,  —索引扫描行数
                        "cost": 60069, —索引使用成本
                        "chosen": false, —是否选择该索引
                        "cause": "cost"
                      }
                    ] /* range_scan_alternatives */,
                    "analyzing_roworder_intersect": {
                      "usable": false,
                      "cause": "too_few_roworder_scans"
                    } /* analyzing_roworder_intersect */
                  } /* analyzing_range_alternatives */
                } /* range_analysis */
              }
            ] /* rows_estimation */
          },
          {
            "considered_execution_plans": [
              {
                "plan_prefix": [
                ] /* plan_prefix */,
                "table": "`employees`",
                "best_access_path": { —最优访问路径
                  "considered_access_paths": [ —最终选择的访问路径
                    {
                      "rows_to_scan": 100114,
                      "access_type": "scan", —访问类型：为scan，全表扫描
                      "resulting_rows": 100114,
                      "cost": 20312,
                      "chosen": true, —确定选择
                      "use_tmp_table": true
                    }
                  ] /* considered_access_paths */
                } /* best_access_path */,
                "condition_filtering_pct": 100,
                "rows_for_plan": 100114,
                "cost_for_plan": 20312,
                "sort_cost": 100114,
                "new_cost_for_plan": 120426,
                "chosen": true
              }
            ] /* considered_execution_plans */
          },
          {
            "attaching_conditions_to_tables": {
              "original_condition": "(`employees`.`name` > 'a')",
              "attached_conditions_computation": [
              ] /* attached_conditions_computation */,
              "attached_conditions_summary": [
                {
                  "table": "`employees`",
                  "attached": "(`employees`.`name` > 'a')"
                }
              ] /* attached_conditions_summary */
            } /* attaching_conditions_to_tables */
          },
          {
            "clause_processing": {
              "clause": "ORDER BY",
              "original_clause": "`employees`.`position`",
              "items": [
                {
                  "item": "`employees`.`position`"
                }
              ] /* items */,
              "resulting_clause_is_simple": true,
              "resulting_clause": "`employees`.`position`"
            } /* clause_processing */
          },
          {
            "reconsidering_access_paths_for_index_ordering": {
              "clause": "ORDER BY",
              "steps": [
              ] /* steps */,
              "index_order_summary": {
                "table": "`employees`",
                "index_provides_order": false,
                "order_direction": "undefined",
                "index": "unknown",
                "plan_changed": false
              } /* index_order_summary */
            } /* reconsidering_access_paths_for_index_ordering */
          },
          {
            "refine_plan": [
              {
                "table": "`employees`"
              }
            ] /* refine_plan */
          }
        ] /* steps */
      } /* join_optimization */
    },
    {
      "join_execution": { —第三阶段： sql执行阶段
        "select#": 1,
        "steps": [
          {
            "filesort_information": [
              {
                "direction": "asc",
                "table": "`employees`",
                "field": "position"
              }
            ] /* filesort_information */,
            "filesort_priority_queue_optimization": {
              "usable": false,
              "cause": "not applicable (no LIMIT)"
            } /* filesort_priority_queue_optimization */,
            "filesort_execution": [
            ] /* filesort_execution */,
            "filesort_summary": {
              "rows": 100006,
              "examined_rows": 100006,
              "number_of_tmp_files": 30,
              "sort_buffer_size": 262056,
              "sort_mode": "<sort_key, packed_additional_fields>"
            } /* filesort_summary */
          }
        ] /* steps */
      } /* join_execution */
    }
  ] /* steps */
}
```

```
结论：全表扫描的成本低于索引扫描，所以mysql最终选择全表扫描 
mysql> select * from employees where name > 'zzz' order by position; 
mysql> SELECT * FROM information_schema.OPTIMIZER_TRACE; 
查看trace字段可知索引扫描的成本低于全表扫描，所以mysql最终选择索引扫描 
mysql> set session optimizer_trace="enabled=off"; ‐‐关闭trace 
```

## **常见sql深入优化** 

### **Order by与Group by优化** 

Case1： 

```sql
explain select * from employees where name='LiLei' and position='dev' ORDER BY age;
```

![image-20211212150117249](/Users/jiusonghuang/pic-md/20211212150117.png)

分析： 

利用最左前缀法则：中间字段不能断，因此查询用到了name索引，从key_len=74也能看出，age索引列用在排序过程中，因为Extra字段里没有using filesort 

Case 2： 

```sql
	explain select * from employees where name='LiLei'  ORDER BY position;
```

![image-20211212150823836](/Users/jiusonghuang/pic-md/20211212150824.png)

分析： 

从explain的执行结果来看：key_len=74，查询使用了name索引，由于用了position进行排序，跳过了age，出现了Using filesort。 

Case 3：分析： 

```sql
	explain select * from employees where name='LiLei'  ORDER BY age,position;
```

![image-20211212150320225](/Users/jiusonghuang/pic-md/20211212150320.png)

查找只用到索引name，age和position用于排序，无Using filesort。 

Case 4：

分析：

```sql
	explain select * from employees where name='LiLei'  ORDER BY position,age;
```

![image-20211212150930645](/Users/jiusonghuang/pic-md/20211212150930.png) 

和Case 3中explain的执行结果一样，但是出现了Using filesort，因为索引的创建顺序为name,age,position，但是排序的时候age和position颠倒位置了。 

Case 5： 

分析：

```sql
explain select * from employees where name='LiLei'  and age=18 ORDER BY position,age;
```

![image-20211212151248488](/Users/jiusonghuang/pic-md/20211212151248.png)

与Case 4对比，在Extra中并未出现Using filesort，因为age为常量，在排序中被优化，所以索引未颠倒，不会出现Using filesort。 

Case 6： 

分析： 

```sql
	explain select * from employees where name='zhugu'  ORDER BY age ASC,position desc;
```

![image-20211212151921847](/Users/jiusonghuang/pic-md/20211212151921.png)

虽然排序的字段列与索引顺序一样，且order by默认升序，这里position desc变成了降序，导致与索引的排序方式不同，从而产生Using filesort。Mysql8以上版本有降序索引可以支持该种查询方式。 

Case 7： 

分析： 

```sql
	explain select * from employees where name in ('LiLei','zhugu')  ORDER BY age,position;
```

![image-20211212152051825](/Users/jiusonghuang/pic-md/20211212152051.png)

对于排序来说，多个相等条件也是范围查询 

Case 8：

```sql
	explain select * from employees where name >'a' ORDER BY name;
```

![image-20211212152232228](/Users/jiusonghuang/pic-md/20211212152232.png)

数据量太大，可能不走索引

可以用覆盖索引优化 

```sql
	explain select name,age,position from employees where name >'a' ORDER BY name;
```

![image-20211212152335206](/Users/jiusonghuang/pic-md/20211212152335.png)

### **优化总结：** 

1、MySQL支持两种方式的排序filesort和index，Using index是指MySQL扫描索引本身完成排序。index效率高，filesort效率低。 

2、order by满足两种情况会使用Using index。 

1) order by语句使用索引最左前列。 

2) 使用where子句与order by子句条件列组合满足索引最左前列。 

3、尽量在索引列上完成排序，遵循索引建立（索引创建的顺序）时的最左前缀法则。 

4、如果order by的条件不在索引列上，就会产生Using filesort。 

5、能用覆盖索引尽量用覆盖索引 

6、group by与order by很类似，其实质是先排序后分组，遵照索引创建顺序的最左前缀法则。对于group by的优化如果不需要排序的可以加上**order by null禁止排序**。注意，where高于having，能写在where中的限定条件就不要去having限定了。 

## **Using filesort文件排序原理详解** 

**filesort文件排序方式** 

1. 单路排序：是一次性取出满足条件行的所有字段，然后在sort buffer中进行排序；用trace工具可以看到sort_mode信息里显示< sort_key, additional_fields >或者< sort_key, packed_additional_fields > 
2. 双路排序（又叫**回表**排序模式）：是首先根据相应的条件取出相应的**排序字段**和**可以直接定位行数据的行 ID**，然后在 sort buffer 中进行排序，排序完后需要再次取回其它需要的字段；用trace工具可以看到sort_mode信息里显示< sort_key, rowid > 

MySQL 通过比较系统变量 max_length_for_sort_data(**默认1024字节**) 的大小和需要查询的字段总大小来判断使用哪种排序模式。 

- 如果字段的总长度小于max_length_for_sort_data ，那么使用 单路排序模式； 
- 如果字段的总长度大于max_length_for_sort_data ，那么使用 双路排序模式。 

**示例验证下各种排序方式：**

```sql
	explain select * from employees where name='zhugu'  ORDER BY position;
```

![image-20211212153345666](/Users/jiusonghuang/pic-md/20211212153345.png)

查看下这条sql对应trace结果如下(只展示排序部分)： 

```
mysql> set session optimizer_trace="enabled=on",end_markers_in_json=on; ‐‐开启trace 
mysql> select * from employees where name = 'zhuge' order by position; 
mysql> select * from information_schema.OPTIMIZER_TRACE; 
```

 trace排序部分结果： 

```sql
{
      "join_execution": { —sql执行阶段
        "select#": 1,
        "steps": [
          {
            "filesort_information": [
              {
                "direction": "asc",
                "table": "`employees`",
                "field": "position"
              }
            ] /* filesort_information */,
            "filesort_priority_queue_optimization": {
              "usable": false,
              "cause": "not applicable (no LIMIT)"
            } /* filesort_priority_queue_optimization */,
            "filesort_execution": [
            ] /* filesort_execution */,
            "filesort_summary": {—文件排序信息
              "rows": 0, —预计扫描行数
              "examined_rows": 0,—参与排序的行
              "number_of_tmp_files": 0, 使用的临时文件个数，这个值如果为0代表全部使用的sort_buffer内存排序，否则使用的磁盘文件排序 
              "sort_buffer_size": 262056, —排序缓存的大小，单位Byte
              "sort_mode": "<sort_key, packed_additional_fields>"  —排序方式，这里用的单路排序
            } /* filesort_summary */
          }
        ] /* steps */
      } /* join_execution */
    }
  ] /* steps */
}
```



```sql
mysql> set max_length_for_sort_data = 10; ‐‐employees表所有字段长度总和肯定大于10字节 
mysql> select * from employees where name = 'zhuge' order by position; 
mysql> select * from information_schema.OPTIMIZER_TRACE; 
```

```sql
 {
      "join_execution": {
        "select#": 1,
        "steps": [
          {
            "filesort_information": [
              {
                "direction": "asc",
                "table": "`employees`",
                "field": "position"
              }
            ] /* filesort_information */,
            "filesort_priority_queue_optimization": {
              "usable": false,
              "cause": "not applicable (no LIMIT)"
            } /* filesort_priority_queue_optimization */,
            "filesort_execution": [
            ] /* filesort_execution */,
            "filesort_summary": {
              "rows": 0,
              "examined_rows": 0,
              "number_of_tmp_files": 0,
              "sort_buffer_size": 262136,
              "sort_mode": "<sort_key, rowid>"  —排序方式，这里用的双路排序
            } /* filesort_summary */
          }
        ] /* steps */
      } /* join_execution */
    }
  ] /* steps */
}
```



```sql
mysql> set session optimizer_trace="enabled=off"; ‐‐关闭trace 
```

我们先看**单路排序**的详细过程： 

1. 从索引name找到第一个满足 name = ‘zhuge’ 条件的主键 id 

2. 根据主键 id 取出整行，**取出所有字段的值，存入 sort_buffer 中** 

3. 从索引name找到下一个满足 name = ‘zhuge’ 条件的主键 id 

4. 重复步骤 2、3 直到不满足 name = ‘zhuge’ 

5. 对 sort_buffer 中的数据按照字段 position 进行排序 

6. 返回结果给客户端 

我们再看下**双路排序**的详细过程： 

1. 从索引 name 找到第一个满足 name = ‘zhuge’ 的主键id 

2. 根据主键 id 取出整行，**把排序字段 position 和主键 id 这两个字段放到 sort buffer 中** 

3. 从索引 name 取下一个满足 name = ‘zhuge’ 记录的主键 id 

4. 重复 3、4 直到不满足 name = ‘zhuge’ 

5. 对 sort_buffer 中的字段 position 和主键 id 按照字段 position 进行排序 

6. 遍历排序好的 id 和字段 position，按照 id 的值**回到原表**中取出所有字段的值返回给客户端 

其实对比两个排序模式，单路排序会把所有需要查询的字段都放到 sort buffer 中，而双路排序只会把主键和需要排序的字段放到 sort buffer 中进行排序，然后再通过主键回到原表查询需要的字段。 

如果 MySQL **排序内存** **sort_buffer** 配置的比较小并且没有条件继续增加了，可以适当把max_length_for_sort_data 配置小点，让优化器选择使用**双路排序**算法，可以在sort_buffer 中一次排序更多的行，只是需要再根据主键回到原表取数据。 

如果 MySQL 排序内存有条件可以配置比较大，可以适当增大 max_length_for_sort_data 的值，让优化器优先选择全字段排序(**单路排序**)，把需要的字段放到 sort_buffer 中，这样排序后就会直接从内存里返回查询结果了。 

所以，MySQL通过 **max_length_for_sort_data** 这个参数来控制排序，在不同场景使用不同的排序模式，从而提升排序效率。 

**注意**，如果全部使用sort_buffer内存排序一般情况下效率会高于磁盘文件排序，但不能因为这个就随便增大sort_buffer(默认1M)，mysql很多参数设置都是做过优化的，不要轻易调整。 

## **索引设计原则** 

**1、代码先行，索引后上** 

不知大家一般是怎么给数据表建立索引的，是建完表马上就建立索引吗？ 

这其实是不对的，一般应该等到主体业务功能开发完毕，把涉及到该表相关sql都要拿出来分析之后再建立索引。 

**2、联合索引尽量覆盖条件** 

比如可以设计一个或者两三个联合索引(尽量少建单值索引)，让每一个联合索引都尽量去包含sql语句里的where、order by、group by的字段，还要确保这些联合索引的字段顺序尽量满足sql查询的最左前缀原则。

**3、不要在小基数字段上建立索引** 

索引基数是指这个字段在表里总共有多少个不同的值，比如一张表总共100万行记录，其中有个性别字段，其值不是男就是女，那么该字段的基数就是2。 

如果对这种小基数字段建立索引的话，还不如全表扫描了，因为你的索引树里就包含男和女两种值，根本没法进行快速的二分查找，那用索引就没有太大的意义了。 

一般建立索引，尽量使用那些基数比较大的字段，就是值比较多的字段，那么才能发挥出B+树快速二分查找的优势来。 

**4、长字符串我们可以采用前缀索引** 

尽量对字段类型较小的列设计索引，比如说什么tinyint之类的，因为字段类型较小的话，占用磁盘空间也会比较小，此时你在搜索的时候性能也会比较好一点。 

当然，这个所谓的字段类型小一点的列，也不是绝对的，很多时候你就是要针对varchar(255)这种字段建立索引，哪怕多占用一些磁盘空间也是有必要的。 

对于这种varchar(255)的大字段可能会比较占用磁盘空间，可以稍微优化下，比如针对这个字段的前20个字符建立索引，就是说，对这个字段里的每个值的前20个字符放在索引树里，类似于 KEY index(name(20),age,position)。 

此时你在where条件里搜索的时候，如果是根据name字段来搜索，那么此时就会先到索引树里根据name字段的前20个字符去搜索，定位到之后前20个字符的前缀匹配的部分数据之后，再回到聚簇索引提取出来完整的name字段值进行比对。 

但是假如你要是order by name，那么此时你的name因为在索引树里仅仅包含了前20个字符，所以这个排序是没法用上索引的， group by也是同理。所以这里大家要对前缀索引有一个了解。 

**5、where与order by冲突时优先where** 

在where和order by出现索引设计冲突时，到底是针对where去设计索引，还是针对order by设计索引？到底是让where去用上索引，还是让order by用上索引?一般这种时候往往都是让where条件去使用索引来快速筛选出来一部分指定数据，接着再进行排序。 

因为大多数情况基于索引进行where筛选往往可以最快速度筛选出你要的少部分数据，然后做排序的成本可能会小很多。 

**6、基于慢sql查询做优化** 

可以根据监控后台的一些慢sql，针对这些慢sql查询做特定的索引优化。 

关于慢sql查询不清楚的可以参考这篇文章：https://blog.csdn.net/qq_40884473/article/details/89455740 

## **索引设计实战** 

![image-20211212160836331](/Users/jiusonghuang/pic-md/20211212160836.png)

![image-20211212161624909](/Users/jiusonghuang/pic-md/20211212161625.png)

![image-20211212161916856](/Users/jiusonghuang/pic-md/20211212161917.png)

以社交场景APP来举例，我们一般会去搜索一些好友，这里面就涉及到对用户信息的筛选，这里肯定就是对用户user表搜索了，这个表一般来说数据量会比较大，我们先不考虑分库分表的情况，比如，我们一般会筛选地区(省市)，性别，年龄，身高，爱好之类的，有的APP可能用户还有评分，比如用户的受欢迎程度评分，我们可能还会根据评分来排序等等。 

对于后台程序来说除了过滤用户的各种条件，还需要分页之类的处理，可能会生成类似sql语句执行： 

```sql
select xx from user where xx=xx and xx=xx order by xx limit xx,xx 
```

对于这种情况如何合理设计索引了，比如用户可能经常会根据省市优先筛选同城的用户，还有根据性别去筛选，那我们是否应该设计一个联合索引 (province,city,sex) 了？这些字段好像基数都不大，其实是应该的，因为这些字段查询太频繁了。 

假设又有用户根据年龄范围去筛选了，比如 where province=xx and city=xx and age>=xx and age<=xx，我们尝试着把age字段加入联合索引 (province,city,sex,age)，注意，一般这种范围查找的条件都要放在最后，之前讲过联合索引范围之后条件的是不能用索引的，但是对于当前这种情况依然用不到age 这个索引字段，因为用户没有筛选sex字段，那怎么优化了？其实我们可以这么来优化下sql的写法：

```sql
where province=xx and city=xx and sex in ('female','male') and age>=xx and age<=xx 
```

对于爱好之类的字段也可以类似sex字段处理，所以可以把爱好字段也加入索引 (province,city,sex,hobby,age) 

假设可能还有一个筛选条件，比如要筛选最近一周登录过的用户，一般大家肯定希望跟活跃用户交友了，这样能尽快收到反馈，对应后台sql可能是这样： 

```sql
where province=xx and city=xx and sex in ('female','male') and age>=xx and age<=xx and latest_login_time>= xx 
```

那我们是否能把 latest_login_time 字段也加入索引了？比如(province,city,sex,hobby,age,latest_login_time) ，显然是不行的，那怎么来优化这种情况了？其实我们可以试着再设计一个字段is_login_in_latest_7_days，用户如果一周内有登录值就为1，否则为0，那么我们就可以把索引设计成 (province,city,sex,hobby,is_login_in_latest_7_days,age) 来满足上面那种场景了！ 

一般来说，通过这么一个多字段的索引是能够过滤掉绝大部分数据的，就保留小部分数据下来基于磁盘文件进行order by语句的排序，最后基于limit进行分页，那么一般性能还是比较高的。 

不过有时可能用户会这么来查询，就查下受欢迎度较高的女性，比如sql：

```sql
where sex = 'female' order by score limit xx,xx
```

，那么上面那个索引是很难用上的，不能把太多的字段以及太多的值都用 in 语句拼接到sql里的，那怎么办了？其实我们可以再设计一个辅助的联合索引，比如 (sex,score)，这样就能满足查询要求了。 

以上就是给大家讲的一些索引设计的思路了，核心思想就是，尽量利用一两个复杂的多字段联合索引，抗下你80%以上的查询，然后用一两个辅助索引尽量抗下剩余的一些非典型查询，保证这种大数据量表的查询尽 

可能多的都能充分利用索引，这样就能保证你的查询速度和性能了！

文档：04-mysql索引优化实战一.note 

http://note.youdao.com/noteshare?id=d2e8a0ae8c9dc2a45c799b771a5899f6&sub=C1831C9ABBE84A29829DE1891B06EF5A

# 5、Mysql索引优化实战二

## **分页查询优化** 

```sql
 示例表： 
CREATE TABLE `employees` ( 
	`id` int(11) NOT NULL AUTO_INCREMENT, 
	`name` varchar(24) NOT NULL DEFAULT '' COMMENT '姓名', 
  `age` int(11) NOT NULL DEFAULT '0' COMMENT '年龄', 
  `position` varchar(20) NOT NULL DEFAULT '' COMMENT '职位', 
  `hire_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '入职时间', 
  PRIMARY KEY (`id`), 
  KEY `idx_name_age_position` (`name`,`age`,`position`) USING BTREE 
  ) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='员工记录表';  
```

很多时候我们业务系统实现分页功能可能会用如下sql实现 

```sql
 mysql> select * from employees limit 10000,10; 
```

表示从表 employees 中取出从 10001 行开始的 10 行记录。看似只查询了 10 条记录，实际这条 SQL 是先读取 10010 

条记录，然后抛弃前 10000 条记录，然后读到后面 10 条想要的数据。因此要查询一张大表比较靠后的数据，执行效率是非常低的。 

## **常见的分页场景优化技巧：** 

**1、根据自增且连续的主键排序的分页查询** 

首先来看一个根据自增且连续主键排序的分页查询的例子： 

```sql
 mysql> select * from employees limit 90000,5; 
```

![image-20211212163957628](/Users/jiusonghuang/pic-md/20211212163958.png)

该 SQL 表示查询从第 90001开始的五行数据，没添加单独 order by，表示通过**主键排序**。我们再看表 employees ，因 

为主键是自增并且连续的，所以可以改写成按照主键去查询从第 90001开始的五行数据，如下： 

```sql
 mysql> select * from employees where id > 90000 limit 5; 
```

![image-20211212164035780](/Users/jiusonghuang/pic-md/20211212164036.png)

查询的结果是一致的。我们再对比一下执行计划： 

```sql
 mysql> EXPLAIN select * from employees limit 90000,5; 
```

![image-20211212164147833](/Users/jiusonghuang/pic-md/20211212164148.png)

```sql
 mysql> EXPLAIN select * from employees where id > 90000 limit 5; 
```

![image-20211212164216079](/Users/jiusonghuang/pic-md/20211212164216.png)

显然改写后的 SQL 走了索引，而且扫描的行数大大减少，执行效率更高。

但是，这条改写的SQL 在很多场景并不实用，因为表中可能某些记录被删后，主键空缺，导致结果不一致，如下图试验所示（先删除一条前面的记录，然后再测试原 SQL 和优化后的 SQL）：

​    ![image-20211212165101886](/Users/jiusonghuang/pic-md/20211212165102.png)

   ![image-20211212165116986](/Users/jiusonghuang/pic-md/20211212165117.png)

两条 SQL 的结果并不一样，因此，如果主键不连续，不能使用上面描述的优化方法。

另外如果原 SQL 是 order by 非主键的字段，按照上面说的方法改写会导致两条 SQL 的结果不一致。所以这种改写得满足以下两个条件：

- 主键自增且连续
- 结果是按照主键排序的

**2、根据非主键字段排序的分页查询**

再看一个根据非主键字段排序的分页查询，SQL 如下：

```sql
mysql>  select * from employees ORDER BY name** limit 90000,5;
```

​    ![image-20211212165316226](/Users/jiusonghuang/pic-md/20211212165316.png)

```sql
mysql> EXPLAIN select * from employees ORDER BY name limit 90000,5; 
```

![image-20211212165403074](/Users/jiusonghuang/pic-md/20211212165403.png)

发现并没有使用 name 字段的索引（key 字段对应的值为 null），具体原因上节课讲过：**扫描整个索引并查找到没索引的行(可能要遍历多个索引树)的成本比扫描全表的成本更高，所以优化器放弃使用索引**。

知道不走索引的原因，那么怎么优化呢？

其实关键是**让排序时返回的字段尽可能少**，所以可以让排序和分页操作先查出主键，然后根据主键查到对应的记录，SQL改写如下

```sql
mysql> select * from employees e inner join (select id from employees order by name limit 90000,5) ed on e.id = ed.id;              
```

   ![image-20211212165533701](/Users/jiusonghuang/pic-md/20211212165533.png)

需要的结果与原 SQL 一致，执行时间减少了一半以上，我们再对比优化前后sql的执行计划：

   ![image-20211212165750860](/Users/jiusonghuang/pic-md/20211212165750.png)

原 SQL 使用的是 filesort 排序，而优化后的 SQL 使用的是索引排序。

## **Join关联查询优化**

```sql
-- 示例表：
CREATE TABLE `t1` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `a` int(11) DEFAULT NULL,
  `b` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_a` (`a`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

create table t2 like t1;

-- 插入一些示例数据
-- 往t1表插入1万行记录
DROP PROCEDURE IF EXISTS insert_t1;
delimiter;;
CREATE PROCEDURE insert_t1() 
BEGIN
	DECLARE i INT;
	SET i = 1;
	WHILE( i <= 100000 ) DO
		INSERT into t1(a,b) VALUE(i,i);
		SET i = i + 1;
	END WHILE;
END;;
delimiter;
CALL insert_t1 ();

-- 往t2表插入100行记录
DROP PROCEDURE IF EXISTS insert_t2;
delimiter;;
CREATE PROCEDURE insert_t2() 
BEGIN
	DECLARE i INT;
	SET i = 1;
	WHILE( i <= 100 ) DO
		INSERT into t2(a,b) VALUE(i,i);
		SET i = i + 1;
	END WHILE;
END;;
delimiter;
CALL insert_t2 ();
```

​          

### **mysql的表关联常见有两种算法**

- Nested-Loop Join 算法

- Block Nested-Loop Join 算法

#### **1、** **嵌套循环连接** **Nested-Loop Join(NLJ) 算法**

一次一行循环地从第一张表（称为**驱动表**）中读取行，在这行数据中取到关联字段，根据关联字段在另一张表（**被驱动表**）里取出满足条件的行，然后取出两张表的结果合集。

```sql
 mysql> EXPLAIN select * from t1 inner join t2 on t1.a= t2.a;              
```

​    ![image-20211212175824059](/Users/jiusonghuang/pic-md/20211212175824.png)

从执行计划中可以看到这些信息：

- 驱动表是 t2，被驱动表是 t1。先执行的就是驱动表(**执行计划结果的id如果一样则按从上到下顺序执行sql**)；优化器一般会优先选择**小表做驱动表，**用where条件过滤完驱动表，然后再跟被驱动表做关联查询。**所以使用 inner join 时，排在前面的表并不一定就是驱动表。**
- 当使用left join时，左表是驱动表，右表是被驱动表，当使用right join时，右表时驱动表，左表是被驱动表，当使用join时，mysql会选择数据量比较小的表作为驱动表，大表作为被驱动表。
- 使用了 NLJ算法。一般 join 语句中，如果执行计划 Extra 中未出现 **Using join buffer** 则表示使用的 join 算法是 NLJ。

**上面sql的大致流程如下：**

1. 从表 t2 中读取一行数据（如果t2表有查询过滤条件的，用先用条件过滤完，再从过滤结果里取出一行数据）；
2. 从第 1 步的数据中，取出关联字段 a，到表 t1 中查找；
3. 取出表 t1 中满足条件的行，跟 t2 中获取到的结果合并，作为结果返回给客户端；
4. 重复上面 3 步。

整个过程会读取 t2 表的所有数据(**扫描100行**)，然后遍历这每行数据中字段 a 的值，根据 t2 表中 a 的值索引扫描 t1 表中的对应行(**扫描100次 t1 表的索引，1次扫描可以认为最终只扫描 t1 表一行完整数据，也就是总共 t1 表也扫描了100行**)。因此整个过程扫描了 **200 行**。

如果被驱动表的关联字段没索引，**使用NLJ算法性能会比较低(下面有详细解释)**，mysql会选择Block Nested-Loop Join算法。

#### **2、** **基于块的嵌套循环连接Block Nested-Loop Join(BNL)算法**

把**驱动表**的数据读入到 join_buffer 中，然后扫描**被驱动表**，把**被驱动表**每一行取出来跟 join_buffer 中的数据做对比。

```SQL
mysql>EXPLAIN select * from t1 inner join t2 on t1.b= t2.b;              
```

![image-20211212180634294](/Users/jiusonghuang/pic-md/20211212180634.png)

Extra 中 的Using join buffer (Block Nested Loop)说明该关联查询使用的是 BNL 算法。

**上面sql的大致流程如下：**

1. 把 t2 的所有数据放入到 **join_buffer** 中
2. 把表 t1 中每一行取出来，跟 join_buffer 中的数据做对比
3. 返回满足 join 条件的数据

整个过程对表 t1 和 t2 都做了一次全表扫描，因此扫描的总行数为10000(表 t1 的数据总量) + 100(表 t2 的数据总量) = **10100**。并且 join_buffer 里的数据是无序的，因此对表 t1 中的每一行，都要做 100 次判断，所以内存中的判断次数是 100 * 10000= **100 万次**。

这个例子里表 t2 才 100 行，要是表 t2 是一个大表，join_buffer 放不下怎么办呢？·

join_buffer 的大小是由参数 join_buffer_size 设定的，默认值是 256k。如果放不下表 t2 的所有数据话，策略很简单，就是**分段放**。

比如 t2 表有1000行记录， join_buffer 一次只能放800行数据，那么执行过程就是先往 join_buffer 里放800行记录，然后从 t1 表里取数据跟 join_buffer 中数据对比得到部分结果，然后清空  join_buffer ，再放入 t2 表剩余200行记录，再次从 t1 表里取数据跟 join_buffer 中数据对比。所以就多扫了一次 t1 表。

**被驱动表的关联字段没索引为什么要选择使用 BNL 算法而不使用 Nested-Loop Join 呢？**

如果上面第二条sql使用 Nested-Loop Join，那么扫描行数为 100 * 10000 = 100万次，这个是**磁盘扫描**。

很显然，用BNL磁盘扫描次数少很多，相比于磁盘扫描，BNL的内存计算会快得多。

**因此MySQL对于被驱动表的关联字段没索引的关联查询，一般都会使用 BNL 算法。如果有索引一般选择 NLJ 算法，有索引的情况下 NLJ 算法比 BNL算法性能更高**

### **对于关联sql的优化**

- **关联字段加索引**，让mysql做join操作时尽量选择NLJ算法，驱动表因为需要全部查询出来，所以过滤的条件也尽量要走索引，避免全表扫描，总之，能走索引的过滤条件尽量都走索引
- **小表驱动大表**，写多表连接sql时如果**明确知道**哪张表是小表可以用straight_join写法固定连接驱动方式，省去mysql优化器自己判断的时间

**straight_join解释：straight_join**功能同join类似，但能让左边的表来驱动右边的表，能改表优化器对于联表查询的执行顺序。

比如：select * from t2 straight_join t1 on t2.a = t1.a; 代表指定mysql选着 t2 表作为驱动表。

- **straight_join**只适用于inner join，并不适用于left join，right join。（因为left join，right join已经代表指定了表的执行顺序）
- 尽可能让优化器去判断，因为大部分情况下mysql优化器是比人要聪明的。使用**straight_join**一定要慎重，因为部分情况下人为指定的执行顺序并不一定会比优化引擎要靠谱。

### **对于小表定义的明确**

在决定哪个表做驱动表的时候，应该是两个表按照各自的条件过滤，**过滤完成之后**，计算参与 join 的各个字段的总数据量，**数据量小的那个表，就是“小表”**，应该作为驱动表。

### **in和exsits优化**

原则：**小表驱动大表**，即小的数据集驱动大的数据集

**in：**当B表的数据集小于A表的数据集时，in优于exists               

```SQL
 select * from A where id in (select id from B)  
 #等价于： 　for(select id from B){      select * from A where A.id = B.id    }  
```

**exists：**当A表的数据集小于B表的数据集时，exists优于in

　　将主查询A的数据，放到子查询B中做条件验证，根据验证结果（true或false）来决定主查询的数据是否保留

```SQL
  select * from A where exists (select 1 from B where B.id = A.id) 
  #等价于:    for(select * from A){      select * from B where B.id = A.id    }     
  #A表与B表的ID字段应建立索引            
```

1、EXISTS (subquery)只返回TRUE或FALSE,因此子查询中的SELECT * 也可以用SELECT 1替换,官方说法是实际执行时会忽略SELECT清单,因此没有区别

2、EXISTS子查询的实际执行过程可能经过了优化而不是我们理解上的逐条对比

3、EXISTS子查询往往也可以用JOIN来代替，何种最优需要具体问题具体分析

### **count(\*)查询优化**

 -- 临时关闭mysql查询缓存，为了查看sql多次执行的真实时间

```SQL
mysql> set global query_cache_size=0; 
mysql> set global query_cache_type=0; 
mysql> EXPLAIN select count(1) from employees; 
mysql> EXPLAIN select count(id) from employees; 
mysql> EXPLAIN select count(name) from employees; 
mysql> EXPLAIN select count(*) from employees;   
```

**注意：以上4条sql只有根据某个字段count不会统计字段为null值的数据行**   ![image-20211212183033779](/Users/jiusonghuang/pic-md/20211212183034.png)

**四个sql的执行计划一样，说明这四个sql执行效率应该差不多**

**字段有索引：count(\*)≈count(1)>count(字段)>count(主键 id)    //字段有索引，count(字段)统计走二级索引，二级索引存储数据比主键索引少，所以count(字段)>count(主键 id)** 

**字段无索引：count(\*)≈count(1)>count(主键 id)>count(字段)    //字段没有索引count(字段)统计走不了索引，count(主键 id)还可以走主键索引，所以count(主键 id)>count(字段)**

count(1)跟count(字段)执行过程类似，不过count(1)不需要取出字段统计，就用常量1做统计，count(字段)还需要取出字段，所以理论上count(1)比count(字段)会快一点。

count(*) 是例外，mysql并不会把全部字段取出来，而是专门做了优化，不取值，按行累加，效率很高，所以不需要用count(列名)或count(常量)来替代 count(*)。

为什么对于count(id)，mysql最终选择辅助索引而不是主键聚集索引？因为二级索引相对主键索引存储数据更少，检索性能应该更高，mysql内部做了点优化(应该是在5.7版本才优化)。

### **常见优化方法**

**1、查询mysql自己维护的总行数**

对于**myisam存储引擎**的表做不带where条件的count查询性能是很高的，因为myisam存储引擎的表的总行数会被mysql存储在磁盘上，查询不需要计算

![image-20211212183834901](/Users/jiusonghuang/pic-md/20211212183835.png)

对于**innodb存储引擎**的表mysql不会存储表的总记录行数(因为有MVCC机制，后面会讲)，查询count需要实时计算

**2、show table status**

如果只需要知道表总行数的估计值可以用如下sql查询，性能很高

![image-20211212183257548](/Users/jiusonghuang/pic-md/20211212183257.png)

**3、将总数维护到Redis里**

插入或删除表数据行的时候同时维护redis里的表总行数key的计数值(用incr或decr命令)，但是这种方式可能不准，很难保证表操作和redis操作的事务一致性

**4、增加数据库计数表**

插入或删除表数据行的时候同时维护计数表，让他们在同一个事务里操作

## **阿里巴巴Mysql规范解读**

### **补充：MySQL数据类型选择**

在MySQL中，选择正确的数据类型，对于性能至关重要。一般应该遵循下面两步：

**（1）确定合适的大类型：数字、字符串、时间、二进制；**

**（2）确定具体的类型：有无符号、取值范围、变长定长等。**

在MySQL数据类型设置方面，尽量用更小的数据类型，因为它们通常有更好的性能，花费更少的硬件资源。并且，尽量把字段定义为NOT NULL，避免使用NULL。

#### **1、数值类型**

| 类型         | 大小                                     | 范围（有符号）                                               | 范围（无符号）                                               | 用途           |
| ------------ | ---------------------------------------- | ------------------------------------------------------------ | ------------------------------------------------------------ | -------------- |
| TINYINT      | 1 字节                                   | (-128, 127)                                                  | (0, 255)                                                     | 小整数值       |
| SMALLINT     | 2 字节                                   | (-32 768, 32 767)                                            | (0, 65 535)                                                  | 大整数值       |
| MEDIUMINT    | 3 字节                                   | (-8 388 608, 8 388 607)                                      | (0, 16 777 215)                                              | 大整数值       |
| INT或INTEGER | 4 字节                                   | (-2 147 483 648, 2 147 483 647)                              | (0, 4 294 967 295)                                           | 大整数值       |
| BIGINT       | 8 字节                                   | (-9 233 372 036 854 775 808, 9 223 372 036 854 775 807)      | (0, 18 446 744 073 709 551 615)                              | 极大整数值     |
| FLOAT        | 4 字节                                   | (-3.402 823 466 E+38, 1.175 494 351 E-38)，0，(1.175 494 351 E-38，3.402 823 466 351 E+38) | 0, (1.175 494 351 E-38, 3.402 823 466 E+38)                  | 单精度浮点数值 |
| DOUBLE       | 8 字节                                   | (1.797 693 134 862 315 7 E+308, 2.225 073 858 507 201 4 E-308), 0, (2.225 073 858 507 201 4 E-308, 1.797 693 134 862 315 7 E+308) | 0, (2.225 073 858 507 201 4 E-308, 1.797 693 134 862 315 7 E+308) | 双精度浮点数值 |
| DECIMAL      | 对DECIMAL(M,D) ，如果M>D，为M+2否则为D+2 | 依赖于M和D的值                                               | 依赖于M和D的值                                               | 小数值         |

#### **优化建议**

1. 如果整形数据没有负数，如ID号，建议指定为UNSIGNED无符号类型，容量可以扩大一倍。
2. 建议使用TINYINT代替ENUM、BITENUM、SET。
3. 避免使用整数的显示宽度(参看文档最后)，也就是说，不要用INT(10)类似的方法指定字段显示宽度，直接用INT。
4. DECIMAL最适合保存准确度要求高，而且用于计算的数据，比如价格。但是在使用DECIMAL类型的时候，注意长度设置。
5. 建议使用整形类型来运算和存储实数，方法是，实数乘以相应的倍数后再操作。
6. 整数通常是最佳的数据类型，因为它速度快，并且能使用AUTO_INCREMENT。

#### **2、日期和时间**

| 类型      | 大小(字节) | 范围                                       | 格式                | 用途                     |
| --------- | ---------- | ------------------------------------------ | ------------------- | ------------------------ |
| DATE      | 3          | 1000-01-01 到 9999-12-31                   | YYYY-MM-DD          | 日期值                   |
| TIME      | 3          | '-838:59:59' 到 '838:59:59'                | HH:MM:SS            | 时间值或持续时间         |
| YEAR      | 1          | 1901 到 2155                               | YYYY                | 年份值                   |
| DATETIME  | 8          | 1000-01-01 00:00:00 到 9999-12-31 23:59:59 | YYYY-MM-DD HH:MM:SS | 混合日期和时间值         |
| TIMESTAMP | 4          | 1970-01-01 00:00:00 到 2038-01-19 03:14:07 | YYYYMMDDhhmmss      | 混合日期和时间值，时间戳 |

#### **优化建议**

1. MySQL能存储的最小时间粒度为秒。
2. 建议用DATE数据类型来保存日期。MySQL中默认的日期格式是yyyy-mm-dd。
3. 用MySQL的内建类型DATE、TIME、DATETIME来存储时间，而不是使用字符串。
4. 当数据格式为TIMESTAMP和DATETIME时，可以用CURRENT_TIMESTAMP作为默认（MySQL5.6以后），MySQL会自动返回记录插入的确切时间。
5. TIMESTAMP是UTC时间戳，与时区相关。
6. DATETIME的存储格式是一个YYYYMMDD HH:MM:SS的整数，与时区无关，你存了什么，读出来就是什么。
7. 除非有特殊需求，一般的公司建议使用TIMESTAMP，它比DATETIME更节约空间，但是像阿里这样的公司一般会用DATETIME，因为不用考虑TIMESTAMP将来的时间上限问题。
8. 有时人们把Unix的时间戳保存为整数值，但是这通常没有任何好处，这种格式处理起来不太方便，我们并不推荐它。

#### **3、字符串**

| 类型       | 大小                | 用途                                                         |
| ---------- | ------------------- | ------------------------------------------------------------ |
| CHAR       | 0-255字节           | 定长字符串，char(n)当插入的字符数不足n时(n代表字符数)，插入空格进行补充保存。在进行检索时，尾部的空格会被去掉。 |
| VARCHAR    | 0-65535 字节        | 变长字符串，varchar(n)中的n代表最大字符数，插入的字符数不足n时不会补充空格 |
| TINYBLOB   | 0-255字节           | 不超过 255 个字符的二进制字符串                              |
| TINYTEXT   | 0-255字节           | 短文本字符串                                                 |
| BLOB       | 0-65 535字节        | 二进制形式的长文本数据                                       |
| TEXT       | 0-65 535字节        | 长文本数据                                                   |
| MEDIUMBLOB | 0-16 777 215字节    | 二进制形式的中等长度文本数据                                 |
| MEDIUMTEXT | 0-16 777 215字节    | 中等长度文本数据                                             |
| LONGBLOB   | 0-4 294 967 295字节 | 二进制形式的极大文本数据                                     |
| LONGTEXT   | 0-4 294 967 295字节 | 极大文本数据                                                 |

#### **优化建议**

1. 字符串的长度相差较大用VARCHAR；字符串短，且所有值都接近一个长度用CHAR。
2. CHAR和VARCHAR适用于包括人名、邮政编码、电话号码和不超过255个字符长度的任意字母数字组合。那些要用来计算的数字不要用VARCHAR类型保存，因为可能会导致一些与计算相关的问题。换句话说，可能影响到计算的准确性和完整性。
3. 尽量少用BLOB和TEXT，如果实在要用可以考虑将BLOB和TEXT字段单独存一张表，用id关联。
4. BLOB系列存储二进制字符串，与字符集无关。TEXT系列存储非二进制字符串，与字符集相关。
5. BLOB和TEXT都不能有默认值。

**PS：INT显示宽度**

我们经常会使用命令来创建数据表，而且同时会指定一个长度，如下。但是，这里的长度并非是TINYINT类型存储的最大长度，而是显示的最大长度。

```sql
  CREATE TABLE `user`(   
    `id` TINYINT(2) UNSIGNED 
  );              
```

这里表示user表的id字段的类型是TINYINT，可以存储的最大数值是255。所以，在存储数据时，如果存入值小于等于255，如200，虽然超过2位，但是没有超出TINYINT类型长度，所以可以正常保存；如果存入值大于255，如500，那么MySQL会自动保存为TINYINT类型的最大值255。

在查询数据时，不管查询结果为何值，都按实际输出。这里TINYINT(2)中2的作用就是，当需要在查询结果前填充0时，命令中加上ZEROFILL就可以实现，如:

```sql
`id` TINYINT(2) UNSIGNED ZEROFILL 
```

这样，查询结果如果是5，那输出就是05。如果指定TINYINT(5)，那输出就是00005，其实实际存储的值还是5，而且存储的数据不会超过255，只是MySQL输出数据时在前面填充了0。

换句话说，在MySQL命令中，字段的类型长度TINYINT(2)、INT(11)不会影响数据的插入，只会在使用ZEROFILL时有用，让查询结果前填充0。

文档：Mysql索引优化实战二.note

 http://note.youdao.com/noteshare?id=df15aba3aa76c225090d04d0dc776dd9&sub=B0D6000AA824407489097F4C87B3F36D              

# 6、深入理解Mysql事务隔离级别与锁机制

## **概述**

我们的数据库一般都会并发执行多个事务，多个事务可能会并发的对相同的一批数据进行增删改查操作，可能就会导致我们说的脏写、脏读、不可重复读、幻读这些问题。

这些问题的本质都是数据库的多事务并发问题，为了解决多事务并发问题，数据库设计了**事务隔离机制、锁机制、MVCC多版本并发控制隔离机制**，用一整套机制来**解决多事务并发问题**。接下来，我们会深入讲解这些机制，让大家彻底理解数据库内部的执行原理。

## **事务及其ACID属性**

事务是由一组SQL语句组成的逻辑处理单元,事务具有以下4个属性,通常简称为事务的ACID属性。

- 原子性(Atomicity) ：事务是一个原子操作单元,其对数据的修改，要么全都执行，要么全都不执行。
- 一致性(Consistent) ：在事务开始和完成时，数据都必须保持一致状态。这意味着所有相关的数据规则都必须应用于事务的修改，以保持数据的完整性。
- 隔离性(Isolation) ：数据库系统提供一定的隔离机制，保证事务在不受外部并发操作影响的“独立”环境执行。这意味着事务处理过程中的中间状态对外部是不可见的，反之亦然。
- 持久性(Durable) ：事务完成之后,它对于数据的修改是永久性的，即使出现系统故障也能够保持。

## **并发事务处理带来的问题**

 更新丢失(Lost Update)或脏写

　　当两个或多个事务选择同一行，然后基于最初选定的值更新该行时，由于每个事务都不知道其他事务的存在，就会发生丢失更新问题–**最后的更新覆盖了由其他事务所做的更新**。

 脏读（Dirty Reads）

　　一个事务正在对一条记录做修改，在这个事务完成并提交前，这条记录的数据就处于不一致的状态；这时，另一个事务也来读取同一条记录，如果不加控制，第二个事务读取了这些“脏”数据，并据此作进一步的处理，就会产生未提交的数据依赖关系。这种现象被形象的叫做“脏读”。

　　一句话：**事务A读取到了事务B已经修改但尚未提交的数据**，还在这个数据基础上做了操作。此时，如果B事务回滚，A读取的数据无效，不符合一致性要求。

不可重读（Non-Repeatable Reads） 

　　一个事务在读取某些数据后的某个时间，再次读取以前读过的数据，却发现其读出的数据已经发生了改变、或某些记录已经被删除了！这种现象就叫做“不可重复读”。

　　一句话：**事务A内部的相同查询语句在不同时刻读出的结果不一致，不符合隔离性**

幻读（Phantom Reads）

　　一个事务按相同的查询条件重新读取以前检索过的数据，却发现其他事务插入了满足其查询条件的新数据，这种现象就称为“幻读”。

　　一句话：**事务A读取到了事务B提交的新增数据，不符合隔离性**

## **事务隔离级别**

“脏读”、“不可重复读”和“幻读”，其实都是数据库读一致性问题，必须由数据库提供一定的事务隔离机制来解决。

![image-20211213203414948](/Users/jiusonghuang/pic-md/20211213203415.png)

数据库的事务隔离越严格,并发副作用越小,但付出的代价也就越大，因为事务隔离实质上就是使事务在一定程度上“串行化”进行,这显然与“并发”是矛盾的。

同时，不同的应用对读一致性和事务隔离程度的要求也是不同的，比如许多应用对“不可重复读"和“幻读”并不敏感，可能更关心数据并发访问的能力。

**常看当前数据库的事务隔离级别: show variables like 'tx_isolation';**

**设置事务隔离级别：set tx_isolation='REPEATABLE-READ';**

**Mysql默认的事务隔离级别是可重复读，用Spring开发程序时，如果不设置隔离级别默认用Mysql设置的隔离级别，如果Spring设置了就用已经设置的隔离级别**

## **锁详解**

锁是计算机协调多个进程或线程并发访问某一资源的机制。

在数据库中，除了传统的计算资源（如CPU、RAM、I/O等）的争用以外，数据也是一种供需要用户共享的资源。如何保证数据并发访问的一致性、有效性是所有数据库必须解决的一个问题，锁冲突也是影响数据库并发访问性能的一个重要因素。

### **锁分类**

- 从性能上分为乐观锁(用版本对比来实现)和悲观锁
- 从对数据库操作的类型分，分为读锁和写锁(都属于悲观锁)

读锁（共享锁，S锁(**S**hared)）：针对同一份数据，多个读操作可以同时进行而不会互相影响

写锁（排它锁，X锁(e**X**clusive)）：当前写操作没有完成前，它会阻断其他写锁和读锁

- 从对数据操作的粒度分，分为表锁和行锁

### **表锁**

每次操作锁住整张表。开销小，加锁快；不会出现死锁；锁定粒度大，发生锁冲突的概率最高，并发度最低；一般用在整表数据迁移的场景。

**基本操作**	

```sql
-建表SQL 
CREATE TABLE `mylock` (
  `id` INT (11) NOT NULL AUTO_INCREMENT,
  `NAME` VARCHAR (20) DEFAULT NULL, 
  PRIMARY KEY (`id`) ) ENGINE = MyISAM DEFAULT CHARSET = utf8;
  --插入数据 
  INSERT INTO`test`.`mylock` (`id`, `NAME`) VALUES ('1', 'a'); 
  INSERT INTO`test`.`mylock` (`id`, `NAME`) VALUES ('2', 'b');
  INSERT INTO`test`.`mylock` (`id`, `NAME`) VALUES ('3', 'c'); 
  INSERT INTO`test`.`mylock` (`id`, `NAME`) VALUES ('4', 'd');        
```

- 手动增加表锁

lock table 表名称 read(write),表名称2 read(write);

- 查看表上加过的锁

show open tables;

- 删除表锁

unlock tables;

**案例分析(加读锁）**

![image-20211213203856450](/Users/jiusonghuang/pic-md/20211213203856.png)

当前session和其他session都可以读该表

当前session中插入或者更新锁定的表都会报错，其他session插入或更新则会等待

**案例分析(加写锁）**

![image-20211213211033340](/Users/jiusonghuang/pic-md/20211213211033.png)

当前session对该表的增删改查都没有问题，其他session对该表的所有操作被阻塞

**案例结论**

1、对MyISAM表的读操作(加读锁) ，不会阻塞其他进程对同一表的读请求，但会阻塞对同一表的写请求。只有当读锁释放后，才会执行其它进程的写操作。

2、对MylSAM表的写操作(加写锁) ，会阻塞其他进程对同一表的读和写操作，只有当写锁释放后,才会执行其它进程的读写操作。

### **行锁**

每次操作锁住一行数据。开销大，加锁慢（如果没有索引，定位到具体的某一行会比较慢）；会出现死锁；锁定粒度最小，发生锁冲突的概率最低，并发度最高。

InnoDB与MYISAM的最大不同有两点：

- **InnoDB支持事务（TRANSACTION）**
- **InnoDB支持行级锁**

**行锁演示**

一个session开启事务更新不提交，另一个session更新同一条记录会阻塞，更新不同记录不会阻塞

**总结：**

MyISAM在执行查询语句SELECT前，会自动给涉及的所有表加读锁,在执行update、insert、delete操作会自动给涉及的表加写锁。

InnoDB在执行查询语句SELECT时(非串行隔离级别)，不会加锁。但是update、insert、delete操作会加行锁。

简而言之，就是**读锁会阻塞写，但是不会阻塞读。而写锁则会把读和写都阻塞**。

**行锁与事务隔离级别案例分析**

```sql
 CREATE TABLE `account` ( 
   `id` int(11) NOT NULL AUTO_INCREMENT, 
   `name` varchar(255) DEFAULT NULL, 
   `balance` int(11) DEFAULT NULL,  PRIMARY KEY (`id`) 
 ) ENGINE=InnoDB DEFAULT CHARSET=utf8; 
 INSERT INTO `test`.`account` (`name`, `balance`) VALUES ('lilei', '450'); 
 INSERT INTO `test`.`account` (`name`, `balance`) VALUES ('hanmei', '16000'); 
 INSERT INTO `test`.`account` (`name`, `balance`) VALUES ('lucy', '2400');       
```

​       

**读未提交：**

（1）打开一个客户端A，并设置当前事务模式为read uncommitted（未提交读），查询表account的初始值：

**set tx_isolation='**read-uncommitted**';**

```
mysql> set tx_isolation="read-uncommitted";
Query OK, 0 rows affected, 1 warning (0.05 sec)
```

（2）在客户端A的事务提交之前，打开另一个客户端B，更新表account： ![image-20211213214052474](/Users/jiusonghuang/pic-md/20211213214052.png)

（3）这时，虽然客户端B的事务还没提交，但是客户端A就可以查询到B已经更新的数据： ![image-20211213214118039](/Users/jiusonghuang/pic-md/20211213214118.png)

（4）一旦客户端B的事务因为某种原因回滚，所有的操作都将会被撤销，那客户端A查询到的数据其实就是**脏数据**： 

   ![image-20211213214700599](/Users/jiusonghuang/pic-md/20211213214700.png)　　　

（5）在客户端A执行更新语句update account set balance = balance - 50 where id =1，lilei的balance没有变成350，居然是400，是不是很奇怪，数据不一致啊，如果你这么想就太天真 了，在应用程序中，我们会用400-50=350，并不知道其他会话回滚了，要想解决这个问题可以采用读已提交的隔离级别

![image-20211213214727974](/Users/jiusonghuang/pic-md/20211213214728.png)

**3、读已提交**

（1）打开一个客户端A，并设置当前事务模式为read committed（未提交读），查询表account的所有记录：

**set tx_isolation='**read-committed**';**    ![image-20211213215412087](/Users/jiusonghuang/pic-md/20211213215412.png)　　　　

（2）在客户端A的事务提交之前，打开另一个客户端B，更新表account： 

![image-20211213215607054](/Users/jiusonghuang/pic-md/20211213215607.png)　　　　

（3）这时，客户端B的事务还没提交，客户端A不能查询到B已经更新的数据，解决了脏读问题： 

![image-20211213215729596](/Users/jiusonghuang/pic-md/20211213215729.png)　　　　

（4）客户端B的事务提交

![image-20211213215801437](/Users/jiusonghuang/pic-md/20211213215801.png)

　　　　

（5）客户端A执行与上一步相同的查询，结果 与上一步不一致，即产生了不可重复读的问题   ![image-20211213215816260](/Users/jiusonghuang/pic-md/20211213215816.png)

**4、可重复读**

（1）打开一个客户端A，并设置当前事务模式为repeatable read，查询表account的所有记录

**set tx_isolation='**repeatable-read**';**

![image-20211213220302209](/Users/jiusonghuang/pic-md/20211213220302.png)　　　　

（2）在客户端A的事务提交之前，打开另一个客户端B，更新表account并提交   ![image-20211213220318688](/Users/jiusonghuang/pic-md/20211213220318.png)　

（3）在客户端A查询表account的所有记录，与步骤（1）查询结果一致，没有出现不可重复读的问题![image-20211213220333490](/Users/jiusonghuang/pic-md/20211213220333.png)　

（4）在客户端A，接着执行update account set balance = balance - 50 where id = 1，balance没有变成400-50=350，lilei的balance值用的是步骤2中的350来算的，所以是300，数据的一致性倒是没有被破坏。可重复读的隔离级别下使用了MVCC(multi-version concurrency control)机制，select操作不会更新版本号，是快照读（历史版本）；insert、update和delete会更新版本号，是当前读（当前版本）。

 ![image-20211213220404449](/Users/jiusonghuang/pic-md/20211213220404.png)

（5）重新打开客户端B，插入一条新数据后提交 ![image-20211213220420588](/Users/jiusonghuang/pic-md/20211213220420.png)

（6）在客户端A查询表account的所有记录，没有查出新增数据，所以没有出现幻读

![image-20211213220434685](/Users/jiusonghuang/pic-md/20211213220434.png)

（7)验证幻读

在客户端A执行update account set balance=888 where id = 4;能更新成功，再次查询能查到客户端B新增的数据

  ![image-20211213220453987](/Users/jiusonghuang/pic-md/20211213220454.png)

**5、串行化**

（1）打开一个客户端A，并设置当前事务模式为serializable，查询表account的初始值：

**set tx_isolation='**serializable**';**

![image-20211213220759096](/Users/jiusonghuang/pic-md/20211213220759.png)

（2）打开一个客户端B，并设置当前事务模式为serializable，更新相同的id为1的记录会被阻塞等待，更新id为2的记录可以成功，说明在串行模式下innodb的查询也会被加上行锁。

如果客户端A执行的是一个范围查询，那么该**范围内的所有行包括每行记录所在的间隙区间范围**(就算该行数据还未被插入也会加锁，这种是间隙锁)**都会被加锁**。此时如果客户端B在该范围内插入数据都会被阻塞，所以就避免了幻读。

这种隔离级别并发性极低，开发中很少会用到。    ![image-20211213220813823](/Users/jiusonghuang/pic-md/20211213220814.png)

### **间隙锁(Gap Lock)**

间隙锁，锁的就是两个值之间的空隙。Mysql默认级别是repeatable-read，有办法解决幻读问题吗？间隙锁在某些情况下可以解决幻读问题。

假设account表里数据如下：

![image-20211213220906580](/Users/jiusonghuang/pic-md/20211213220906.png)

那么间隙就有 id 为 (3,10)，(10,20)，(20,正无穷) 这三个区间，

在Session_1下面执行 update account set name = 'zhuge' where id > 8 and id <18;，则其他Session没法在这个**范围所包含的所有行记录(包括间隙行记录)以及行记录所在的间隙**里插入或修改任何数据，**即id在(3,20]区间都无法修改数据，注意最后那个20也是包含在内的。**

**间隙锁是在可重复读隔离级别下才会生效。**

### **临键锁(Next-key Locks)**

Next-Key Locks是行锁与间隙锁的组合。像上面那个例子里的这个(3,20]的整个区间可以叫做临键锁。

**无索引行锁会升级为表锁(RR级别会升级为表锁，RC级别不会升级为表锁)**

锁主要是加在索引上，如果对非索引字段更新，行锁可能会变表锁

session1 执行：update account set balance = 800 where name = 'lilei';

session2 对该表任一行操作都会阻塞住

**InnoDB的行锁是针对索引加的锁，不是针对记录加的锁。并且该索引不能失效，否则都会从行锁升级为表锁****。**

锁定某一行还可以用lock in share mode(共享锁) 和for update(排它锁)，例如：select * from test_innodb_lock where a = 2 for update; 这样其他session只能读这行数据，修改则会被阻塞，直到锁定行的session提交

**结论**

Innodb存储引擎由于实现了行级锁定，虽然在锁定机制的实现方面所带来的性能损耗可能比表级锁定会要更高一下，但是在整体并发处理能力方面要远远优于MYISAM的表级锁定的。当系统并发量高的时候，Innodb的整体性能和MYISAM相比就会有比较明显的优势了。

但是，Innodb的行级锁定同样也有其脆弱的一面，当我们使用不当的时候，可能会让Innodb的整体性能表现不仅不能比MYISAM高，甚至可能会更差。

**行锁分析**

通过检查InnoDB_row_lock状态变量来分析系统上的行锁的争夺情况

```
show status like 'innodb_row_lock%';              
```

对各个状态量的说明如下：

Innodb_row_lock_current_waits: 当前正在等待锁定的数量

Innodb_row_lock_time: 从系统启动到现在锁定总时间长度

Innodb_row_lock_time_avg: 每次等待所花平均时间

Innodb_row_lock_time_max：从系统启动到现在等待最长的一次所花时间

Innodb_row_lock_waits: 系统启动后到现在总共等待的次数

对于这5个状态变量，比较重要的主要是：

Innodb_row_lock_time_avg （等待平均时长）

Innodb_row_lock_waits （等待总次数）

Innodb_row_lock_time（等待总时长）

尤其是当等待次数很高，而且每次等待时长也不小的时候，我们就需要分析系统中为什么会有如此多的等待，然后根据分析结果着手制定优化计划。

**查看INFORMATION_SCHEMA系统库锁相关数据表**

```sql
  -- 查看事务 
  select * from INFORMATION_SCHEMA.INNODB_TRX; 
  -- 查看锁 
  select * from INFORMATION_SCHEMA.INNODB_LOCKS; 
  -- 查看锁等待
  select * from INFORMATION_SCHEMA.INNODB_LOCK_WAITS; 
  -- 释放锁，trx_mysql_thread_id可以从INNODB_TRX表里查看到 
  kill trx_mysql_thread_id
  -- 查看锁等待详细信息 
  show engine innodb status\G;     
```

**死锁**

**set tx_isolation='**repeatable-read**';**

Session_1执行：select * from account where id=1 for update;

Session_2执行：select * from account where id=2 for update;

Session_1执行：select * from account where id=2 for update;

Session_2执行：select * from account where id=1 for update;

查看近期死锁日志信息：show engine innodb status\G; 

大多数情况mysql可以自动检测死锁并回滚产生死锁的那个事务，但是有些情况mysql没法自动检测死锁

**锁优化建议**

- 尽可能让所有数据检索都通过索引来完成，避免无索引行锁升级为表锁
- 合理设计索引，尽量缩小锁的范围
- 尽可能减少检索条件范围，避免间隙锁
- 尽量控制事务大小，减少锁定资源量和时间长度，涉及事务加锁的sql尽量放在事务最后执行
- 尽可能低级别事务隔离

文档：深入理解Mysql事务隔离级别与锁机制

http://note.youdao.com/noteshare?id=354ae85f3519bac0581919a458278a59&sub=9A8237E2B9B248B9A2F5FC5AED6CBCF1              

# 7、深入理解MVCC与BufferPool缓存机制

## **MVCC多版本并发控制机制**

Mysql在**可重复读隔离级别**下如何保证事务较高的隔离性，我们上节课给大家演示过，同样的sql查询语句在一个事务里多次执行查询结果相同，就算其它事务对数据有修改也不会影响当前事务sql语句的查询结果。

这个隔离性就是靠MVCC(**Multi-Version Concurrency Control**)机制来保证的，对一行数据的读和写两个操作默认是不会通过加锁互斥来保证隔离性，避免了频繁加锁互斥，而在串行化隔离级别为了保证较高的隔离性是通过将所有操作加锁互斥来实现的。

**Mysql在读已提交和可重复读隔离级别下都实现了MVCC机制。**

## **undo日志版本链与read view机制详解**

undo日志版本链是指一行数据被多个事务依次修改过后，在每个事务修改完后，Mysql会保留修改前的数据undo回滚日志，并且用两个隐藏字段trx_id和roll_pointer把这些undo日志串联起来形成一个历史记录版本链(见下图，需参考视频里的例子理解)    ![img](/Users/jiusonghuang/pic-md/20211214205530.png)

在**可重复读隔离级别**，当事务开启，执行任何查询sql时会生成当前事务的**一致性视图read-view，**该视图在事务结束之前都不会变化(**如果是读已提交隔离级别在每次执行查询sql时都会重新生成**)，这个视图由执行查询时所有未提交事务id数组（数组里最小的id为min_id）和已创建的最大事务id（max_id）组成，事务里的任何sql查询结果需要从对应版本链里的最新数据开始逐条跟read-view做比对从而得到最终的快照结果。

**版本链比对规则：**

1. 如果 row 的 trx_id 落在绿色部分( trx_id )

2. 如果 row 的 trx_id 落在红色部分( trx_id>max_id )，表示这个版本是由将来启动的事务生成的，是不可见的(若 row 的 trx_id 就是当前自己的事务是可见的）；

3. 如果 row 的 trx_id 落在黄色部分(min_id <=trx_id<= max_id)，那就包括两种情况

  a. 若 row 的 trx_id 在视图数组中，表示这个版本是由还没提交的事务生成的，不可见(若 row 的 trx_id 就是当前自己的事务是可见的)；

  b. 若 row 的 trx_id 不在视图数组中，表示这个版本是已经提交了的事务生成的，可见。

对于删除的情况可以认为是update的特殊情况，会将版本链上最新的数据复制一份，然后将trx_id修改成删除操作的trx_id，同时在该条记录的头信息（record header）里的（deleted_flag）标记位写上true，来表示当前记录已经被删除，在查询时按照上面的规则查到对应的记录如果delete_flag标记位为true，意味着记录已被删除，则不返回数据。

**注意：**begin/start transaction 命令并不是一个事务的起点，在执行到它们之后的第一个修改操作InnoDB表的语句，事务才真正启动，才会向mysql申请事务id，mysql内部是严格按照事务的启动顺序来分配事务id的。

**总结：**

MVCC机制的实现就是通过read-view机制与undo版本链比对机制，使得不同的事务会根据数据版本链对比规则读取同一条数据在版本链上的不同版本数据。

## **Innodb引擎SQL执行的BufferPool缓存机制** 

![img](/Users/jiusonghuang/pic-md/20211214205611.png)

**为什么Mysql不能直接更新磁盘上的数据而且设置这么一套复杂的机制来执行SQL了？**

因为来一个请求就直接对磁盘文件进行随机读写，然后更新磁盘文件里的数据性能可能相当差。

因为磁盘随机读写的性能是非常差的，所以直接更新磁盘文件是不能让数据库抗住很高并发的。

Mysql这套机制看起来复杂，但它可以保证每个更新请求都是**更新内存BufferPool**，然后**顺序写日志文件**，同时还能保证各种异常情况下的数据一致性。

更新内存的性能是极高的，然后顺序写磁盘上的日志文件的性能也是非常高的，要远高于随机读写磁盘文件。

正是通过这套机制，才能让我们的MySQL数据库在较高配置的机器上每秒可以抗下几干甚至上万的读写请求。

文档：深入理解MVCC与BufferPool缓存机制

http://note.youdao.com/noteshare?id=b36b975188fadf7bfbfd75c0d2d6b834&sub=5A7459FE4B464EC896F9DD9A4EB64942              

# 8、**高性能表结构及索引设计最佳实践**

有道云链接：http://note.youdao.com/noteshare?id=fd5eae820148eb4f7bd9ced08f48aab4&sub=16864635FE004046831CAF4D0B37E087

## **课程学习须知**

课程章节安排

![img](/Users/jiusonghuang/pic-md/20211226113321.png)

本课程是在第四期MySQL课程上做的一个升级和加深，会更加关注于MySQL内核执行和底层原理，所以请在学习掌握了第四期MySQL课程后再学习本课程，而且在第四期MySQL课程中已经讲述过的内容在本课程中不再重复讲述。同时：

1、一个知识点如果大部分同学明白，不会重复讲解，未明白的同学请看视频、笔记、请教同学或加老师QQ。

2、以上为本课的章节安排，不是课时安排，如果一章内容在一次课内未讲完，则会顺延到后面的课程继续讲解。

3、课程章节用不同的颜色标注了难度：

**绿色较容易**

**红色表示进阶知识，较难，需要思考和反复学习**

MySQL的版本众多，目前最新版本为MySQL8，考虑到实际的情况，本次课程以CentOS7下MySQL5.7.32社区 版本进行讲解，但是所讲述的内容在MySQL8中亦可适用。

如何安装运行MySQL，请咨询班主任获得往期视频讲解，并自行安装。如安装过程出错，请保证安装包完整无误,依赖包无误，并仔细阅读安装错误日志和检查操作系统层面的用户、用户组、文件和目录是否存在，各种权限是否正确等！同时安装Windows下的MySQL并不影响本课程的学习！

## **快速复习第四期MySQL**

### **深入理解Mysql索引底层数据结构与算法**

索引底层数据结构红黑树、B+树详解

面试常问的B树与B+树的区别是什么

索引在B+树上如何快速定位

千万级数据表如何用B+树索引快速查找

MylSAM与Innodb存储引擎底层索引实现区别

聚集索引、聚簇索引与稀疏索引到底是什么

为什么推荐使用自增整型的主键而不是UUID

很少使用的索引底层结构Hash是怎样的

联合索引底层数据存储结构又是怎样的

索引最左前缀原则底层实现原理

### **Explain详解与索引最佳实践**

Mysql执行计划Explain工具详解

Mysql优化经常用到的覆盖索引详解

从B+树底层来分析下常见索引优化规则

经常用到的like查询应该如何优化

索引优化最佳实践

### **—条SQL在MySQL中是如何执行的**

梳理下MySQL内部组件结构

为什么说Mysql的查询缓存很鸡肋

Mysql词法分析器原理详解

Mysql底层优化器与执行器详解

Mysql归档日志bin-log详解

不小心删库了如何快速恢复

### **Mysql索引优化实战**

Mysql索引下推优化详解

为什么范围查找Mysql没有用索引下推优化

Mysql内部选择索引机制揭秘

Mysql索引成本计算工具trace详解

看下常用的Order by与Group by优化细节

Using filesort文件排序原理详解

文件单路排序与双路排序详细过程

文件排序优化机制详解

互联网公司索引设计核心原则

社交场景APP索引设计优化实战

### **Mysql索引优化实战二**

最常用的分页查询如何高效优化

Join表关联查询优化

表关联嵌套循环连接Nested-Loop Join(NLJ)算法详解

基于块的嵌套循环连接Block Nested-Loop Join(BNL)算法

in和exsits优化细节小表驱动大表详解

count查询的各种形式优化细节

阿里巴巴Mysql优化规范详解

MySQL数据类型选择优化

### **深入理解Mysql事务隔离级别与锁机制**

Mysql事务及其ACID属性详解

Mysql事务隔离级别详解

Mysql底层锁机制详解

实例演示各种事务隔离级别效果

Mysql底层脏读与幻读如何解决

Mysql底层间隙锁(Gap Lock)详解与优化

Mysql底层临键锁(Next-key Locks)详解

lnnoDB的行锁到底锁的是什么

### **深入理解MVCC与BufferPool缓存机制**

彻底理解MVCC多版本并发控制机制

undo日志版本链与read view机制详解

通过实例演示理解MVCC内部版本链比对规则

lnnodb引擎SQL执行的BufferPool缓存机制

## **数据库表设计**

良好的表结构设计是高性能的基石，应该根据系统将要执行的业务查询来设计，这往往需要权衡各种因素。糟糕的表结构设计，会浪费大量的开发时间，严重延误项目开发周期，让人痛苦万分，而且直接影响到数据库的性能，并需要花费大量不必要的优化时间，效果往往还不怎么样。

在数据库表设计上有个很重要的设计准则，称为范式设计。

### **范式设计**

**什么是范式？**

范式来自英文Normal Form，简称NF。MySQL是关系型数据库，但是要想设计一个好的关系，必须使关系满足一定的约束条件，此约束已经形成了规范，分成几个等级，一级比一级要求得严格。满足这些规范的数据库是简洁的、结构明晰的，同时，不会发生插入(insert)、删除(delete)和更新(update)操作异常。反之则是乱七八糟，不仅给数据库的编程人员制造麻烦，而且面目可憎，可能存储了大量不需要的冗余信息。

目前关系数据库有六种范式：第一范式（1NF）、第二范式（2NF）、第三范式（3NF）、巴斯-科德范式（BCNF）、第四范式(4NF）和第五范式（5NF，又称完美范式）。满足最低要求的范式是第一范式（1NF）。在第一范式的基础上进一步满足更多规范要求的称为第二范式（2NF），其余范式以次类推。一般来说，数据库只需满足第三范式(3NF）就行了。

![image-20211226205028206](/Users/jiusonghuang/pic-md/20211226205028.png)

### **数据库设计的第一范式**

定义： 属于第一范式关系的所有属性都不可再分，即数据项不可分。

理解： 第一范式强调数据表的原子性，是其他范式的基础。例如下表

​    ![img](/Users/jiusonghuang/pic-md/20211226113545.png)

name-age列具有两个属性，一个name,一个 age不符合第一范式，把它拆分成两列

​    ![img](/Users/jiusonghuang/pic-md/20211226113603.png)

上表就符合第一范式关系。但日常生活中仅用第一范式来规范表格是远远不够的，依然会存在数据冗余过大、删除异常、插入异常、修改异常的问题，此时就需要引入规范化概念，将其转化为更标准化的表格，减少数据依赖。

实际上，1NF是所有关系型数据库的最基本要求，你在关系型数据库管理系统（RDBMS），例如SQL Server，Oracle，MySQL中创建数据表的时候，如果数据表的设计不符合这个最基本的要求，那么操作一定是不能成功的。也就是说，只要在RDBMS中已经存在的数据表，一定是符合1NF的。

### **数据库设计的第二范式**

第二范式（2NF）是在第一范式（1NF）的基础上建立起来的，即满足第二范式（2NF）必须先满足第一范式（1NF）。

第二范式（2NF）要求数据库表中的每个实例或行必须可以被惟一地区分。通常在实现来说，需要为表加上一个列，以存储各个实例的惟一标识。例如员工信息表中加上了员工编号（emp_id）列，因为每个员工的员工编号是惟一的，因此每个员工可以被惟一区分。这个惟一属性列被称为主关键字或主键、主码。

也就是说要求表中只具有一个业务主键，而且第二范式（2NF）要求实体的属性完全依赖于主关键字。所谓完全依赖是指不能存在仅依赖主关键字一部分的属性。什么意思呢？

有两张表：订单表，产品表

![img](/Users/jiusonghuang/pic-md/20211226113640.png)

​    ![img](/Users/jiusonghuang/pic-md/20211226113656.png)一个订单有多个产品，所以订单的主键为【订单ID】和【产品ID】组成的联合主键，这样2个组件不符合第二范式，而且产品ID和订单ID没有强关联，故，把订单表进行拆分为订单表与订单与商品的中间表    ![img](/Users/jiusonghuang/pic-md/20211226113746.png)

### **数据库设计的第三范式**

指每一个非主属性既不部分依赖于也不传递依赖于业务主键，也就是在第二范式的基础上消除了非主键对主键的传递依赖。例如，存在一个部门信息表，其中每个部门有部门编号（dept_id）、部门名称、部门简介等信息。那么在员工信息表中列出部门编号后就不能再将部门名称、部门简介等与部门有关的信息再加入员工信息表中。如果不存在部门信息表，则根据第三范式（3NF）也应该构建它，否则就会有大量的数据冗余。

   ![img](/Users/jiusonghuang/pic-md/20211226113804.png)

![img](/Users/jiusonghuang/pic-md/20211226113814.png)

其中

**产品 ID与订单编号存在关联关系**

**产品名称与订单编号存在关联关系**

**产品ID与产品名称存在关联关系**

订单表里如果如果产品ID发生改变，同一个表里产品名称也要跟着改变，这样不符合第三范式，应该**把**产品名称**这一列从订单表中删除。**

**范式说明**

真正的数据库范式定义上，相当难懂，比如第二范式（2NF）的定义“若某关系R属于第一范式，且每一个非主属性完全函数依赖于任何一个候选码，则关系R属于第二范式。”，这里面有着大堆专业术语的堆叠，比如“函数依赖”、“码”、“非主属性”、与“完全函数依赖”等等，而且有完备的公式定义，需要仔细研究的同学，请参考这本书：

​    ![img](/Users/jiusonghuang/pic-md/20211226113834.png)

### **反范式设计**

**什么叫反范式化设计**

完全符合范式化的设计真的完美无缺吗？很明显在实际的业务查询中会大量存在着表的关联查询，而大量的表关联很多的时候非常影响查询的性能。

所谓得反范式化就是为了性能和读取效率得考虑而适当得对数据库设计范式得要求进行违反。允许存在少量得冗余，换句话来说反范式化就是使用空间来换取时间。

**反范式设计-商品信息**

下面是范式设计的商品信息表

​    ![img](/Users/jiusonghuang/pic-md/20211226113852.png)

商品信息和分类信息经常一起查询，所以把分类信息也放到商品表里面，冗余存放。    ![img](/Users/jiusonghuang/pic-md/20211226113910.png)

### **范式化和反范式总结**

**范式化设计优缺点**

1、范式化的更新操作通常比反范式化要快。

2、当数据较好地范式化时，就只有很少或者没有重复数据，所以只需要修改更少的数据。

3、范式化的表通常更小，可以更好地放在内存里，所以执行操作会更快。

4、很少有多余的数据意味着检索列表数据时更少需要DISTINCT或者GROUP BY语句。在非范式化的结构中必须使用DISTINCT或者GROUPBY才能获得一份唯一的列表，但是如果是一张单独的表，很可能则只需要简单的查询这张表就行了。

范式化设计的缺点是通常需要关联。稍微复杂一些的查询语句在符合范式的表上都可能需要至少一次关联，也许更多。这不但代价昂贵，也可能使一些索引策略无效。例如，范式化可能将列存放在不同的表中，而这些列如果在一个表中本可以属于同一个索引。 

**反范式化设计优缺点**

1、反范式设计可以减少表的关联

2、可以更好的进行索引优化。

反范式设计缺点也很明显，1、存在数据冗余及数据维护异常，2、对数据的修改需要更多的成本。

### **实际工作中的反范式实现**

**性能提升-缓存和汇总**

范式化和反范式化的各有优劣，怎么选择最佳的设计?

请记住：小孩子才做选择，我们全都要；小孩才分对错，大人只看利弊。

而现实也是，完全的范式化和完全的反范式化设计都是实验室里才有的东西，在真实世界中很少会这么极端地使用。在实际应用中经常需要混用。

最常见的反范式化数据的方法是复制或者缓存，在不同的表中存储相同的特定列。

比如从父表冗余一些数据到子表的。前面我们看到的分类信息放到商品表里面进行冗余存放就是典型的例子。

缓存衍生值也是有用的。如果需要显示每个用户发了多少消息，可以每次执行一个对用户发送消息进行count的子查询来计算并显示它，也可以在user表用户中建一个消息发送数目的专门列，每当用户发新消息时更新这个值。

有需要时创建一张完全独立的汇总表或缓存表也是提升性能的好办法。“缓存表”来表示存储那些可以比较简单地从其他表获取（但是每次获取的速度比较慢）数据的表（例如，逻辑上冗余的数据)。而“汇总表”时,则保存的是使用GROUP BY语句聚合数据的表。

在使用缓存表和汇总表时，有个关键点是如何维护缓存表和汇总表中的数据，常用的有两种方式，实时维护数据和定期重建，这个取决于应用程序，不过一般来说，缓存表用实时维护数据更多点，往往在一个事务中同时更新数据本表和缓存表，汇总表则用定期重建更多，使用定时任务对汇总表进行更新。

**性能提升-计数器表**

计数器表在Web应用中很常见。比如网站点击数、用户的朋友数、文件下载次数等。对于高并发下的处理，首先可以创建一张独立的表存储计数器，这样可使计数器表小且快，并且可以使用一些更高级的技巧。

比如假设有一个计数器表，只有一行数据，记录网站的点击次数，网站的每次点击都会导致对计数器进行更新，问题在于，对于任何想要更新这一行的事务来说，这条记录上都有一个全局的互斥锁(mutex)。这会使得这些事务只能串行执行，会严重限制系统的并发能力。

怎么改进呢？可以将计数器保存在多行中，每次随机选择一行进行更新。在具体实现上，可以增加一个槽（slot)字段，然后预先在这张表增加100行或者更多数据，当对计数器更新时，选择一个随机的槽（slot)进行更新即可。

这种解决思路其实就是写热点的分散，在JDK的JDK1.8中新的原子类LongAdder也是这种处理方式，而我们在实际的缓冲中间件Redis等的使用、架构设计中，可以采用这种写热点的分散的方式，当然架构设计中对于写热点还有削峰填谷的处理方式，这种在MySQL的实现中也有体现，我们后面会讲到。

**反范式设计-分库分表中的查询**

例如,用户购买了商品,需要将交易记录保存下来,那么如果按照买家的纬度分表,则每个买家的交易记录都被保存在同一表中, 我们可以很快、 很方便地査到某个买家的购买情况, 但是某个商品被购买的交易数据很有可能分布在多张表中, 査找起来比较麻烦 。 反之, 按照商品维度分表, 则可以很方便地査找到该商品的购买情况, 但若要査找到买家的交易记录, 则会比较麻烦 。

所以常见的解决方式如下。

( 1 ) 在多个分片表查询后合并数据集, 这种方式的效率很低。

( 2 ) 记录两份数据, 一份按照买家纬度分表, 一份按照商品维度分表,,

( 3 ) 通过搜索引擎解决, 但如果实时性要求很高, 就需要实现实时搜索 

在某电商交易平台下, 可能有买家査询自己在某一时间段的订单, 也可能有卖家査询自已在某一时间段的订单, 如果使用了分库分表方案, 则这两个需求是难以满足的, 因此, 通用的解决方案是, 在交易生成时生成一份按照买家分片的数据副本和一份按照卖家分片的数据副本,查询时分别满足之前的两个需求,因此,查询的数据和交易的数据可能是分别存储的,并从不同的系统提供接口。

### **字段数据类型优化**

请参考第四期MySQL的《5、Mysql索引优化实战二》。

**MySQL索引辨析**

**范例表说明**

在我们的后续课程中，会经常使用到InnoDB表order_exp，基础表结构如下：

​    ![img](/Users/jiusonghuang/pic-md/20211226114022.png)

数据量大概在1万多行。

​    ![img](/Users/jiusonghuang/pic-md/20211226114038.png)

同时还有个几个派生表如s1，s2，order_exp_cut，表结构基本和order_exp一致，有少许差别，数据量上也比order_exp少：

   ![img](/Users/jiusonghuang/pic-md/20211226114051.png)

​    ![img](/Users/jiusonghuang/pic-md/20211226114104.png)

**InnoDB中的索引复习**

InnoDB中的索引是按照B+树来组织的，至于什么是B+树，请参考第四期MySQL的《01、深入理解Mysql索引底层数据结构与算法》。我们知道B+树的叶子节点用来放数据的，但是放什么数据呢？索引自然是要放的，因为B+树的作用本来就是就是为了快速检索数据而提出的一种数据结构，不放索引放什么呢？但是数据库中的表，数据才是我们真正需要的数据，索引只是辅助数据，甚至于一个表可以没有自定义索引。InnoDB中的数据到底是如何组织的？

**聚集索引/聚簇索引**

InnoDB中使用了聚集索引，就是将表的主键用来构造一棵B+树，并且将整张表的行记录数据存放在该B+树的叶子节点中。也就是所谓的索引即数据，数据即索引。由于聚集索引是利用表的主键构建的，所以每张表只能拥有一个聚集索引。

聚集索引的叶子节点就是数据页。换句话说，数据页上存放的是完整的每行记录。因此聚集索引的一个优点就是：通过过聚集索引能获取完整的整行数据。另一个优点是：对于主键的排序查找和范围查找速度非常快。

如果我们没有定义主键呢？MySQL会使用唯一性索引，没有唯一性索引，MySQL也会创建一个隐含列RowID来做主键，然后用这个主键来建立聚集索引。![img](/Users/jiusonghuang/pic-md/20211226114130.png)

**辅助索引/二级索引**

上边介绍的聚簇索引只能在搜索条件是主键值时才能发挥作用，因为B+树中的数据都是按照主键进行排序的,那如果我们想以别的列作为搜索条件怎么办？我们一般会建立多个索引，这些索引被称为辅助索引/二级索引。

对于辅助索引(Secondary Index，也称二级索引、非聚集索引)，叶子节点并不包含行记录的全部数据。叶子节点除了包含键值以外，每个叶子节点中的索引行中还包含了相应行数据的聚集索引键。

![img](/Users/jiusonghuang/pic-md/20211226114145.png)

比如辅助索引index(node)，那么叶子节点中包含的数据就包括了(主键、note)。

**回表**

辅助索引的存在并不影响数据在聚集索引中的组织，因此每张表上可以有多个辅助索引。当通过辅助索引来寻找数据时，InnoDB存储引擎会遍历辅助索引并通过叶级别的指针获得指向主键索引的主键，然后再通过主键索引（聚集索引）来找到一个完整的行记录。这个过程也被称为**回表**。也就是根据辅助索引的值查询一条完整的用户记录需要使用到2棵B+树----一次辅助索引，一次聚集索引。

​    ![img](/Users/jiusonghuang/pic-md/20211226114201.png)

 

为什么我们还需要一次回表操作呢?直接把完整的用户记录放到辅助索引d的叶子节点不就好了么？如果把完整的用户记录放到叶子节点是可以不用回表，但是太占地方了，相当于每建立一棵B+树都需要把所有的用户记录再都拷贝一遍，这就有点太浪费存储空间了。而且每次对数据的变化要在所有包含数据的索引中全部都修改一次，性能也非常低下。

很明显，回表的记录越少，性能提升就越高，需要回表的记录越多，使用二级索引的性能就越低，甚至让某些查询宁愿使用全表扫描也不使用二级索引。

那什么时候采用全表扫描的方式，什么时候使用采用二级索引 + 回表的方式去执行查询呢？这个就是查询优化器做的工作，查询优化器会事先对表中的记录计算一些统计数据，然后再利用这些统计数据根据查询的条件来计算一下需要回表的记录数，需要回表的记录数越多，就越倾向于使用全表扫描，反之倾向于使用二级索引 + 回表的方式。具体怎么算的，我们后面会详细说到。

**MRR**

从上文可以看出，每次从二级索引中读取到一条记录后，就会根据该记录的主键值执行回表操作。而在某个扫描区间中的二级索引记录的主键值是无序的，也就是说这些二级索引记录对应的聚簇索引记录所在的页面的页号是无序的。

每次执行回表操作时都相当于要随机读取一个聚簇索引页面，而这些随机IO带来的性能开销比较大。MySQL中提出了一个名为Disk-Sweep Multi-Range Read (**MRR，多范围读取**)的优化措施，即先读取一部分二级索引记录，将它们的主键值排好序之后再统一执行回表操作。

相对于每读取一条二级索引记录就立即执行回表操作，这样会节省一些IO开销。使用这个 MRR优化措施的条件比较苛刻，所以我们直接认为每读取一条二级索引记录就立即执行回表操作。MRR的详细信息，可以查询官方文档。

**联合索引/复合索引**

前面我们对索引的描述，隐含了一个条件，那就是构建索引的字段只有一个，但实践工作中构建索引的完全可以是多个字段。所以，将表上的多个列组合起来进行索引我们称之为联合索引或者复合索引，比如index(a,b)就是将a,b两个列组合起来构成一个索引。

千万要注意一点，建立联合索引只会建立1棵B+树，多个列分别建立索引会分别以每个列则建立B+树，有几个列就有几个B+树，比如，index(note)、index(b)，就分别对note,b两个列各构建了一个索引。

index(note,b)在索引构建上，包含了两个意思：

1、先把各个记录按照note列进行排序。

2、在记录的note列相同的情况下，采用b列进行排序

![img](/Users/jiusonghuang/pic-md/20211226114225.png)

**自适应哈希索引**

InnoDB存储引擎除了我们前面所说的各种索引，还有一种自适应哈希索引，我们知道B+树的查找次数,取决于B+树的高度,在生产环境中,B+树的高度一般为3~4层,故需要3~4次的IO查询。

所以在InnoDB存储引擎内部自己去监控索引表，如果监控到某个索引经常用，那么就认为是热数据，然后内部自己创建一个hash索引，称之为自适应哈希索引( Adaptive Hash Index,AHI)，创建以后，如果下次又查询到这个索引，那么直接通过hash算法推导出记录的地址，直接一次就能查到数据，比重复去B+tree索引中查询三四次节点的效率高了不少。

InnoDB存储引擎使用的哈希函数采用除法散列方式，其冲突机制采用链表方式。注意，对于自适应哈希索引仅是数据库自身创建并使用的，我们并不能对其进行干预。通过命令**show engine innodb status\G**可以看到当前自适应哈希索引的使用状况，如:

​    ![img](/Users/jiusonghuang/pic-md/20211226114243.png)

​    ![img](/Users/jiusonghuang/pic-md/20211226114259.png)

哈希索引只能用来搜索等值的查询,如 SELECT* FROM table WHERE index co=xxx。而对于其他查找类型,如范围查找,是不能使用哈希索引的,

因此这里会显示non- hash searches/s的统计情况。通过 hash searches: non-hash searches可以大概了解使用哈希索引后的效率。

由于AHI是由 InnoDB存储引擎控制的,因此这里的信息只供我们参考。不过我们可以通过观察 SHOW ENGINE INNODB STATUS的结果及参数 **innodb_adaptive_hash_index**来考虑是禁用或启动此特性,默认AHI为开启状态。

什么时候需要禁用呢？如果发现监视索引查找和维护哈希索引结构的额外开销远远超过了自适应哈希索引带来的性能提升就需要关闭这个功能。

同时在MySQL 5.7中，自适应哈希索引搜索系统被分区。每个索引都绑定到一个特定的分区，每个分区都由一个单独的 latch 锁保护。分区由 innodb_adaptive_hash_index_parts 配置选项控制 。在早期版本中，自适应哈希索引搜索系统受到单个 latch 锁的保护，这可能成为繁重工作负载下的争用点。innodb_adaptive_hash_index_parts 默认情况下，该 选项设置为8。最大设置为512。当然禁用或启动此特性和调整分区个数这个应该是DBA的工作，我们了解即可。

**全文检索之倒排索引**

什么是全文检索（Full-Text Search）？它是将存储于数据库中的整本书或整篇文章中的任意内容信息查找出来的技术。它可以根据需要获得全文中有关章、节、段、句、词等信息，也可以进行各种统计和分析。我们比较熟知的Elasticsearch、Solr等就是全文检索引擎，底层都是基于Apache Lucene的。

举个例子，现在我们要保存唐宋诗词，数据库中我们们会怎么设计？诗词表我们可能的设计如下：

| 朝代 | 作者   | 诗词年代 | 标题   | 诗词全文                                                     |
| ---- | ------ | -------- | ------ | ------------------------------------------------------------ |
| 唐   | 李白   |          | 静夜思 | 床前明月光，疑是地上霜。	举头望明月，低头思故乡。         |
| 宋   | 李清照 |          | 如梦令 | 常记溪亭日暮，沉醉不知归路，兴尽晚回舟，误入藕花深处。争渡，争渡，惊起一滩鸥鹭。 |
| ….   | ….     | …        | ….     | …….                                                          |

要根据朝代或者作者寻找诗，都很简单，比如“select 诗词全文 from 诗词表 where作者=‘李白’”，如果数据很多，查询速度很慢，怎么办？我们可以在对应的查询字段上建立索引加速查询。

但是如果我们现在有个需求：要求找到包含“望”字的诗词怎么办？用

“select 诗词全文 from 诗词表 where诗词全文 like‘%望%’”，这个意味着要扫描库中的诗词全文字段，逐条比对，找出所有包含关键词“望”字的记录，。基本上，数据库中一般的SQL优化手段都是用不上的。数量少，大概性能还能接受，如果数据量稍微大点，就完全无法接受了，更何况在互联网这种海量数据的情况下呢？怎么解决这个问题呢，用倒排索引。

比如现在有：

*蜀道难（唐）李白 蜀道之难难于上青天，侧身西望长咨嗟。* 

*静夜思（唐）李白 举头望明月，低头思故乡。* 

*春台望（唐）李隆基 暇景属三春，高台聊四望。* 

*鹤冲天(宋)柳永 黄金榜上，偶失龙头望。明代暂遗贤，如何向？未遂风云便，争不恣狂荡。何须论得丧？才子词人，自是白衣卿相。烟花巷陌，依约丹青屏障。幸有意中人，堪寻访。且恁偎红翠，风流事，平生畅。青春都一饷。忍把浮名，换了浅斟低唱！* 

都有望字，于是我们可以这么保存

| 序号 | 关键字 | 蜀道难 | 静夜思 | 春台望 | 鹤冲天 |
| ---- | ------ | ------ | ------ | ------ | ------ |
| 1    | 望     | 有     | 有     | 有     | 有     |
|      |        |        |        |        |        |

如果查哪个诗词中包含上，怎么办，上述的表格可以继续填入新的记录

| 序号 | 关键字 | 蜀道难 | 静夜思 | 春台望 | 鹤冲天 |
| ---- | ------ | ------ | ------ | ------ | ------ |
| 1    | 望     | 有     | 有     | 有     | 有     |
| 2    | 上     | 有     |        |        | 有     |

其实，上述诗词的中每个字都可以作为关键字，然后建立关键字和文档之间的对应关系，也就是标识关键字被哪些文档包含。

所以，倒排索引就是，将文档中包含的关键字全部提取处理，然后再将关键字和文档之间的对应关系保存起来，最后再对关键字本身做索引排序。用户在检索某一个关键字是，先对关键字的索引进行查找，再通过关键字与文档的对应关系找到所在文档。

在存储在关系型数据库中的数据，需要我们事先分析将数据拆分为不同的字段，而在es这类的存储中，需要应用程序根据规则自动提取关键字，并形成对应关系。

这些预先提取的关键字，在全文检索领域一般被称为term（词项），文档的词项提取在es中被称为文档分析，这是全文检索很核心的过程，必须要区分哪些是词项，哪些不是，比如很多场景下，apple和apples是同一个东西，望和看其实是同一个动作。

**MySQL中的全文索引**

MySQL 5.6 以前的版本，只有 MyISAM 存储引擎支持全文索引。从InnoDB 1.2.x版本开始，InnoDB存储引擎开始支持全文检索，对应的MySQL版本是5.6.x系列。

注意，不管什么引擎，只有字段的数据类型为 char、varchar、text 及其系列才可以建全文索引。

不过MySQL从设计之初就是关系型数据库，存储引擎虽然支持全文检索，整体架构上对全文检索支持并不好而且限制很多，比如每张表只能有一个全文检索的索引，不支持没有单词界定符( delimiter）的语言，如中文、日语、韩语等。

所以如果有大批量或者专门的全文检索需求，还是应该选择专门的全文检索引擎，毕竟Elastic靠着全文检索起家，然后产品化、公司化后依赖全文检索不断扩充产品线和应用场景，并推出商业版本的解决方案然后融资上市，现在的市值已达100亿美元（2021/12/06 -纽约证券交易所中的市值101.5亿美元）。

具体如何使用InnoDB存储引擎的全文检索，只提供简单的使用说明，更多的详情请自行查阅相关官方文档或者书籍，我们不做任何技术支持。官方文档路径：https://dev.mysql.com/doc/refman/8.0/en/fulltext-search.html

**创建**

创建表时创建全文索引

```sql
create table fulltext_test (
    id int(11) NOT NULL AUTO_INCREMENT,
    content text NOT NULL,
    tag varchar(255),
    PRIMARY KEY (id),
    FULLTEXT KEY content_tag_fulltext(content,tag)  
) DEFAULT CHARSET=utf8;
```

在已存在的表上创建全文索引

```sql
create fulltext index content_tag_fulltext
on fulltext_test(content,tag);
```

通过 SQL 语句 ALTER TABLE 创建全文索引

```sql
alter table fulltext_test
add fulltext index content_tag_fulltext(content,tag);
```

**使用全文索引**

和常用的模糊匹配使用 like + % 不同，全文索引有自己的语法格式，使用 match 和 against 关键字，比如

```sql
select * from fulltext_test 
where match(content,tag) against('xxx xxx');
```

*Elastic发家小故事*

*多年前，一个叫做 Shay Banon 的刚结婚不久的失业开发者，由于妻子要去伦敦学习厨师，他便跟着也去了。在他找工作的过程中，为了给妻子构建一个食谱的搜索引擎，他开始构建一个早期版本。*

*直接基于 Lucene 工作会比较困难，所以 Shay 开始抽象 Lucene 代码以便 Java 程序员可以在应用中添加搜索功能。他发布了他的第一个开源项目，叫做“ Compass”。*

*后来 Shay 找到一份工作，这份工作处在高性能和内存数据网格的分布式环境中，因此高性能的、实时的、分布式的搜索引擎也是理所当然需要的。然后他决定重写 Compass 库使其成为一个独立的服务叫做 Elasticsearch。*

*第一个公开版本出现在 2010 年 2 月，在那之后 Elasticsearch 已经成为 Github上最受欢迎的项目之一，代码贡献者超过300人。一家主营 Elasticsearch 的公司就此成立，他们一边提供商业支持一边开发新功能，不过 Elasticsearch 将永远开源且对所有人可用。*

**总结：MySQL有哪些索引类型**

从数据结构角度可分为B+树索引、哈希索引、以及FULLTEXT索引（现在MyISAM和InnoDB引擎都支持了）和R-Tree索引（用于对GIS数据类型创建SPATIAL索引）；

从物理存储角度可分为聚集索引（clustered index）、非聚集索引（non-clustered index）；

从逻辑角度可分为主键索引、普通索引，或者单列索引、多列索引、唯一索引、非唯一索引等等。

**面试题：什么是密集索引和稀疏索引？**

面试中还会被问到什么是密集索引和稀疏索引。

密集索引的定义：叶子节点保存的不只是键值，还保存了位于同一行记录里的其他列的信息，由于密集索引决定了表的物理排列顺序，一个表只有一个物理排列顺序，所以一个表只能创建一个密集索引。

稀疏索引：叶子节点仅保存了键位信息以及该行数据的地址，有的稀疏索引只保存了键位信息机器主键。

mysam存储引擎，不管是主键索引，唯一键索引还是普通索引都是稀疏索引，innodb存储引擎：有且只有一个密集索引。

所以，密集索引就是innodb存储引擎里的聚簇索引，稀疏索引就是innodb存储引擎里的普通二级索引。

**辨析覆盖索引/索引覆盖**

既然多个列可以组合起来构建为联合索引，那么辅助索引自然也可以由多个列组成。

覆盖索引也是我们经常见到的名词，InnoDB存储引擎支持覆盖索引(covering index，或称索引覆盖)，即从辅助索引中就可以得到查询的记录，而不需要查询聚集索引中的记录。使用覆盖索引的一个好处是辅助索引不包含整行记录的所有信息，故其大小要远小于聚集索引，因此可以减少大量的IO操作。所以记住，覆盖索引可以视为索引优化的一种方式，而并不是索引类型的一种。

除了覆盖索引这个概念外，在索引优化的范围内，还有前缀索引、三星索引等一系列概念，都会在我们后面的课程中学习到。

![img](/Users/jiusonghuang/pic-md/20211226220510.png)

**深入思考索引在查询中的使用**

索引在查询中的作用到底是什么？在我们的查询中发挥着什么样的作用呢？

请记住：

1、**一个索引就是一个B+树，索引让我们的查询可以快速定位和扫描到我们需要的数据记录上，加快查询的速度**。

2、**一个select查询语句在执行过程中一般最多能使用一个二级索引来加快查询，即使在where条件中用了多个二级索引。**

**索引的代价**

世界上从来没有只有好处没有坏处的东西，如果你有，请你一定要告诉我，让我也感受一下。虽然索引是个好东西，在学习如何更好的使用索引之前先要了解一下使用它的代价，它在空间和时间上都会拖后腿。

**空间上的代价**

这个是显而易见的，每建立一个索引都要为它建立一棵B+树，每一棵B+树的每一个节点都是一个数据页，一个页默认会占用16KB的存储空间，一棵很大的B+树由许多数据页组成会占据很多的存储空间。

**时间上的代价**

每次对表中的数据进行增、删、改操作时，都需要去修改各个B+树索引。而且我们讲过，B+树每层节点都是按照索引列的值从小到大的顺序排序而组成了双向链表。不论是叶子节点中的记录，还是非叶子内节点中的记录都是按照索引列的值从小到大的顺序而形成了一个单向链表。

而增、删、改操作可能会对节点和记录的排序造成破坏，所以存储引擎需要额外的时间进行一些记录移位，页面分裂、页面回收的操作来维护好节点和记录的排序。如果我们建了许多索引，每个索引对应的B+树都要进行相关的维护操作，这必然会对性能造成影响。

既然索引这么有用，我们是不是创建越多越好？既然索引有代价，我们还是别创建了吧？当然不是！按照经验，一般来说，一张表6-7个索引以下都能够取得比较好的性能权衡。

那么创建索引的时候有什么好的策略让我们充分利用索引呢？

**高性能的索引创建策略**

正确地创建和使用索引是实现高性能查询的基础。前面我们已经了解了索引相关的数据结构，各种类型的索引及其对应的优缺点。现在我们一起来看看如何真正地发挥这些索引的优势。

**索引列的类型尽量小**

我们在定义表结构的时候要显式的指定列的类型，以整数类型为例，有TTNYINT、NEDUMNT、INT、BIGTNT这么几种，它们占用的存储空间依次递增，我们这里所说的类型大小指的就是该类型表示的数据范围的大小。能表示的整数范围当然也是依次递增，如果我们想要对某个整数列建立索引的话，在表示的整数范围允许的情况下，尽量让索引列使用较小的类型，比如我们能使用INT就不要使用BIGINT，能使用NEDIUMINT就不要使用INT，这是因为:

·数据类型越小，在查询时进行的比较操作越快（CPU层次)

·数据类型越小，索引占用的存储空间就越少，在一个数据页内就可以放下更多的记录，从而减少磁盘/0带来的性能损耗，也就意味着可以把更多的数据页缓存在内存中，从而加快读写效率。

这个建议对于表的主键来说更加适用，因为不仅是聚簇索引中会存储主键值，其他所有的二级索引的节点处都会存储一份记录的主键值，如果主键适用更小的数据类型，也就意味着节省更多的存储空间和更高效的I/0。

**利用索引选择性和前缀索引**

**索引的选择性/离散性**

创建索引应该选择选择性/离散性高的列。索引的选择性/离散性是指，不重复的索引值（也称为基数，cardinality)和数据表的记录总数（N)的比值，范围从1/N到1之间。索引的选择性越高则查询效率越高，因为选择性高的索引可以让MySQL在查找时过滤掉更多的行。唯一索引的选择性是1，这是最好的索引选择性，性能也是最好的。

很差的索引选择性就是列中的数据重复度很高，比如性别字段，不考虑政治正确的情况下，只有两者可能，男或女。那么我们在查询时，即使使用这个索引，从概率的角度来说，依然可能查出一半的数据出来。

比如下面这个表：

​    ![img](/Users/jiusonghuang/pic-md/20211226114520.png)

哪列做为索引字段最好？当然是姓名字段，因为里面的数据没有任何重复，性别字段是最不适合做索引的，因为数据的重复度非常高。

怎么算索引的选择性/离散性？比如order_exp这个表：

**select  COUNT(DISTINCT order_no)/count(\*) cnt from order_exp;**

![img](/Users/jiusonghuang/pic-md/20211226114532.png)

**select  COUNT(DISTINCT order_status)/count(\*) cnt from order_exp;**    ![img](/Users/jiusonghuang/pic-md/20211226114554.png)

很明显，order_no列上的索引就比order_status列上的索引的选择性就要好，原因很简单，因为order_status列中的值只有-1,0,1三种。

**前缀索引**

有时候需要索引很长的字符列，这会让索引变得大且慢。一个策略是前面提到过的模拟哈希索引。

*模拟哈希索引：*

*order_exp表中order_note字段很长，想把它作为一个索引，我们可以增加一个order_not_hash字段来存储order_note的哈希值，然后在order_not_hash上建立索引，相对于之前的索引速度会有明显提升，一个是对完整的 order_note做索引，而后者则是用整数哈希值做索引，显然数字的比较比字符串的匹配要高效得多。*

*但是缺陷也很明显：*

*1、需要额外维护order_not_hash字段；*

*2、哈希算法的选择决定了哈希冲突的概率，不良的哈希算法会导致重复值很多；*

*3、不支持范围查找。*

还可以做些什么改进呢？还可以索引开始的部分字符，这样可以大大节约索引空间，从而提高索引效率。但这样也会降低索引的选择性。一般情况下我们需要保证某个列前缀的选择性也是足够高的，以满足查询性能。（尤其对于BLOB、TEXT或者很长的VARCHAR类型的列，应该使用前缀索引，因为MySQL不允许索引这些列的完整长度）。

诀窍在于要选择足够长的前缀以保证较高的选择性，同时又不能太长（以便节约空间)。前缀应该足够长，以使得前缀索引的选择性接近于索引整个列。

按照《阿里最新Java编程规范泰山版》中《(二) 索引规约》中的说法：

​    ![img](/Users/jiusonghuang/pic-md/20211226114630.png)

​    ![img](/Users/jiusonghuang/pic-md/20211226114638.png)

中建议，这个前缀的长度为20比较合适，但是其实后面的“count(distinct left(列名, 索引长度))/count(*)的区分度来确定”会更合适点。在工程实践中具体如何做呢？

可以这样：

**SELECT COUNT(DISTINCT LEFT(order_note,3))/COUNT(\*) AS sel3,**

**COUNT(DISTINCT LEFT(order_note,4))/COUNT(\*)AS sel4,**

**COUNT(DISTINCT LEFT(order_note,5))/COUNT(\*) AS sel5,**

**COUNT(DISTINCT LEFT(order_note, 6))/COUNT(\*) As sel6,**

**COUNT(DISTINCT LEFT(order_note, 7))/COUNT(\*) As sel7,**

**COUNT(DISTINCT LEFT(order_note, 8))/COUNT(\*) As sel8,**

**COUNT(DISTINCT LEFT(order_note, 9))/COUNT(\*) As sel9,**

**COUNT(DISTINCT LEFT(order_note, 10))/COUNT(\*) As sel10,**

**COUNT(DISTINCT LEFT(order_note, 11))/COUNT(\*) As sel11,**

**COUNT(DISTINCT LEFT(order_note, 12))/COUNT(\*) As sel12,**

**COUNT(DISTINCT LEFT(order_note, 13))/COUNT(\*) As sel13,**

**COUNT(DISTINCT LEFT(order_note, 14))/COUNT(\*) As sel14,**

**COUNT(DISTINCT LEFT(order_note, 15))/COUNT(\*) As sel15,**

**COUNT(DISTINCT order_note)/COUNT(\*) As total**

**FROM order_exp;**

​    ![img](/Users/jiusonghuang/pic-md/20211226114714.png)

可以看见，从第10个开始选择性的增加值很高，随着前缀字符的越来越多，选择度也在不断上升，但是增长到第15时，已经和第14没太大差别了，选择性提升的幅度已经很小了，都非常接近整个列的选择性了。

那么针对这个字段做前缀索引的话，从第13到第15都是不错的选择，甚至第12也不是不能考虑。

在上面的示例中，已经找到了合适的前缀长度，如何创建前缀索引:

**ALTER TABLE order_exp ADD KEY (order_note(14));**

建立前缀索引后查询语句并不需要更改：

select * from order_exp where order_note = 'xxxx' ;

前缀索引是一种能使索引更小、更快的有效办法，但另一方面也有其缺点MySQL无法使用前缀索引做ORDER BY和GROUP BY，也无法使用前缀索引做覆盖扫描。

有时候后缀索引 (suffix index)也有用途（例如，找到某个域名的所有电子邮件地址)。MySQL原生并不支持反向索引，但是可以把字符串反转后存储，并基于此建立前缀索引。可以通过触发器或者应用程序自行处理来维护索引。

**只为用于搜索、排序或分组的列创建索引**

也就是说，只为出现在WHERE 子句中的列、连接子句中的连接列创建索引，而出现在查询列表中的列一般就没必要建立索引了，除非是需要使用覆盖索引。又或者为出现在ORDER BY或GROUP BY子句中的列创建索引，这句话什么意思呢？比如：

SELECT * FROM order_exp ORDER BY insert_time, order_status,expire_time;

查询的结果集需要先按照insert_time值排序，如果记录的insert_time值相同，则需要按照order_status来排序，如果order_status的值相同，则需要按照expire_time排序。回顾一下联合索引的存储结构，u_idx_day_status索引本身就是按照上述规则排好序的，所以直接从索引中提取数据，然后进行回表操作取出该索引中不包含的列就好了。

当然ORDER BY的子句后边的列的顺序也必须按照索引列的顺序给出，如果给出ORDER BY order_status,expire_time, insert_time的顺序，那也是用不了B+树索引的，原因不用再说了吧。

SELECT insert_time, order_status,expire_time,count(*) FROM order_exp GROUP BY insert_time, order_status,expire_time;

这个查询语句相当于做了3次分组操作：

先把记录按照insert_time值进行分组，所有insert_time值相同的记录划分为一组。

将每个insert_time值相同的分组里的记录再按照order_status的值进行分组，将order_status值相同的记录放到一个小分组里。

再将上一步中产生的小分组按照expire_time的值分成更小的分组。

然后针对最后的分组进行统计，如果没有索引的话，这个分组过程全部需要在内存里实现，而如果有了索引的话，恰巧这个分组顺序又和我们的u_idx_day_status索引中的索引列的顺序是一致的，而我们的B+树索引又是按照索引列排好序的，这不正好么，所以可以直接使用B+树索引进行分组。和使用B+树索引进行排序是一个道理，分组列的顺序也需要和索引列的顺序一致。

**合理设计多列索引**

很多人对多列索引的理解都不够。一个常见的错误就是，为每个列创建独立的索引，或者按照错误的顺序创建多列索引。

我们遇到的最容易引起困惑的问题就是索引列的顺序。正确的顺序依赖于使用该索引的查询，并且同时需要考虑如何更好地满足排序和分组的需要。反复强调过，在一个多列B-Tree索引中，索引列的顺序意味着索引首先按照最左列进行排序，其次是第二列，等等。所以，索引可以按照升序或者降序进行扫描，以满足精确符合列顺序的ORDER BY、GROUP BY和DISTINCT等子句的查询需求。

所以多列索引的列顺序至关重要。对于如何选择索引的列顺序有一个经验法则：将选择性最高的列放到索引最前列。当不需要考虑排序和分组时，将选择性最高的列放在前面通常是很好的。这时候索引的作用只是用于优化WHERE条件的查找。在这种情况下，这样设计的索引确实能够最快地过滤出需要的行，对于在WHERE子句中只使用了索引部分前缀列的查询来说选择性也更高。

然而，性能不只是依赖于索引列的选择性，也和查询条件的有关。可能需要根据那些运行频率最高的查询来调整索引列的顺序，比如排序和分组，让这种情况下索引的选择性最高。

同时，在优化性能的时候，可能需要使用相同的列但顺序不同的索引来满足不同类型的查询需求。

**尽可能设计三星索引**

**三星索引概念**

对于一个查询而言，一个三星索引，可能是其最好的索引。

如果查询使用三星索引，一次查询通常只需要进行一次磁盘随机读以及一次窄索引片的扫描，因此其相应时间通常比使用一个普通索引的响应时间少几个数量级。

三星索引概念是在《Rrelational Database Index Design and the optimizers》 一书（这本书也是《高性能MySQL》作者强烈推荐的一本书）中提出来的。原文如下：

The index earns one star if it places relevant rows adjacent to each other,  

a second star if its rows are sorted in the order the query needs, 

and a final star if it contains all the columns needed for the query.

索引将相关的记录放到一起则获得一星；

如果索引中的数据顺序和查找中的排列顺序一致则获得二星；

如果索引中的列包含了查询中需要的全部列则获得三星。

**二星（排序星）**：

在满足一星的情况下，当查询需要排序，group by、 order by，如果查询所需的顺序与索引是一致的（索引本身是有序的），是不是就可以不用再另外排序了，一般来说排序可是影响性能的关键因素。

**三星（宽索引星）**：

在满足了二星的情况下，如果索引中所包含了这个查询所需的所有列（包括 where 子句 和 select 子句中所需的列，也就是覆盖索引），这样一来，查询就不再需要回表了，减少了查询的步骤和IO请求次数，性能几乎可以提升一倍。

一星按照原文稍微有点难以理解，其实它的意思就是：如果一个查询相关的索引行是相邻的或者至少相距足够靠近的话，必须扫描的索引片宽度就会缩至最短，也就是说，让索引片尽量变窄，也就是我们所说的索引的扫描范围越小越好。

这三颗星，哪颗最重要？第三颗星。因为将一个列排除在索引之外可能会导致很多磁盘随机读（回表操作）。第一和第二颗星重要性差不多，可以理解为第三颗星比重是50%，第一颗星为27%，第二颗星为23%，所以在大部分的情况下，会先考虑第一颗星，但会根据业务情况调整这两颗星的优先度。

**达成三星索引**

现在有表

```
create table customer(

cno int,

lname varchar(10),

fname varchar(10),

sex int,

weight int,

city varchar(10));
```

建立索引

```
create index idx_cust on customer(city,lname,fname,cno);
```

对于下面的SQL而言，这是个三星索引

```
select cno,fname from customer where lname =’xx’ and city =’yy’ order by fname;
```

来评估下：

第一颗星：所有等值谓词的列，是组合索引的开头的列，可以把索引片缩得很窄，符合。

第二颗星：order by的fname字段在组合索引中且是索引自动排序好的，符合。

第三颗星：select中的cno字段、fname字段在组合索引中存在，符合。

**达不成三星索引**

现在有表

CREATE TABLE `test` (

  `id` int(11) NOT NULL AUTO_INCREMENT,

  `user_name` varchar(100) DEFAULT NULL,

  `sex` int(11) DEFAULT NULL,

  `age` int(11) DEFAULT NULL,

  `c_date` datetime DEFAULT NULL,

  PRIMARY KEY (`id`),

  ) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8;

SQL语句如下：

```
select user_name,sex,age from test where user_name like 'test%'  and sex =1 ORDER BY age
```

如果我们建立索引(user_name,sex,age)：

第三颗星，满足

第一颗星，满足

第二颗星，不满足，user_name 采用了范围匹配，sex 是过滤列，此时age 列无法保证有序的。

上述我们看到，此时索引(user_name,sex,age)并不能满足三星索引中的第二颗星（排序）。

于是我们改改，建立索引(sex, age，user_name)：

第一颗星，不满足，只可以匹配到sex，sex选择性很差，意味着是一个宽索引片，

第二颗星，满足，等值sex 的情况下，age是有序的，

第三颗星，满足，select查询的列都在索引列中，

对于索引(sex,age，user_name)我们可以看到，此时无法满足第一颗星，窄索引片的需求。

以上2个索引，都是无法同时满足三星索引设计中的三个需求的，我们只能尽力满足2个。而在多数情况下，能够满足2颗星，已经能缩小很大的查询范围了，具体最终要保留那一颗星（排序星 or 窄索引片星），这个就需要看查询者自己的着重点了，无法给出标准答案。

**主键尽量是很少改变的列**

我们知道，行是按照聚集索引物理排序的，如果主键频繁改变(update)，物理顺序会改变，MySQL要不断调整B+树，并且中间可能会产生页面的分裂和合并等等，会导致性能会急剧降低。

**处理冗余和重复索引**

MySQL允许在相同列上创建多个索引，无论是有意的还是无意的。MySQL需要单独维护重复的索引，并且优化器在优化查询的时候也需要逐个地进行考虑，这会影响性能。重复索引是指在相同的列上按照相同的顺序创建的相同类型的索引。应该避免这样创建重复索引，发现以后也应该立即移除。

有时会在不经意间创建了重复索引，例如下面的代码:

CREATE TABLE test (

ID INT NOT NULL PRIMARY KEY,

A INT NOT NULL,

B INT NOT NULL,

UNIQUE(ID),

INDEX(ID)

) ENGINE=InnoDB;

这里创建了一个主键，又加上唯一限制，然后再加上索引以供查询使用。事实上，MySQL的唯一限制和主键限制都是通过索引实现的，因此，上面的写法实际上在相同的列上创建了三个重复的索引。通常并没有理由这样做，除非是在同一列上创建不同类型的索引来满足不同的查询需求。

冗余索引和重复索引有一些不同。如果创建了索引(A B)，再创建索引(A)就是冗余索引，因为这只是前一个索引的前缀索引。因此索引(AB)也可以当作索引(A)来使用（这种冗余只是对B-Tree索引来说的)。但是如果再创建索引 (B,A)，则不是冗余索引，索引(B)也不是，因为B不是索引(A,B)的最左前缀列。

已有的索引(A)，扩展为(A，ID)，其中ID是主键，对于InnoDB来说主键列已经包含在二级索引中了，所以这也是冗余的。

解决冗余索引和重复索引的方法很简单，删除这些索引就可以，但首先要做的是找出这样的索引。可以通过写一些复杂的访问INFORMATION_SCHEMA表的查询来找。

**删除未使用的索引**

除了冗余索引和重复索引，可能还会有一些服务器永远不用的索引。这样的索引完全是累赘，建议考虑删除。

**补充资料：磁盘和B+树**

为什么关系型数据库都选择了B+树，这个和磁盘的特性有着非常大的关系。

​    ![img](/Users/jiusonghuang/pic-md/20211226114844.png)

如果我们简化一下，可以这么看

​    ![img](/Users/jiusonghuang/pic-md/20211226114857.png)

一个磁盘由大小相同且同轴的圆形盘片组成，磁盘可以转动（各个磁盘必须同步转动）。在磁盘的一侧有磁头支架，磁头支架固定了一组磁头，每个磁头负责存取一个磁盘的内容。磁头不能转动，但是可以沿磁盘半径方向运动。

盘片被划分成一系列同心环，圆心是盘片中心，每个同心环叫做一个磁道，所有半径相同的磁道组成一个柱面。磁道被沿半径线划分成一个个小的段，每个段叫做一个扇区，每个扇区是磁盘的最小存储单元也是最小读写单元。现在磁盘扇区一般是512个字节~4k个字节。

磁盘上数据必须用一个三维地址唯一标示：柱面号、盘面号、扇区号。

读/写磁盘上某一指定数据需要下面步骤：

(1) 首先移动臂根据柱面号使磁头移动到所需要的柱面上，这一过程被称为定位或查找。

(2)所有磁头都定位到磁道上后，这时根据盘面号来确定指定盘面上的具体磁道。

(3) 盘面确定以后，盘片开始旋转，将指定块号的磁道段移动至磁头下。

经过上面步骤，指定数据的存储位置就被找到。这时就可以开始读/写操作了。

​    ![img](/Users/jiusonghuang/pic-md/20211226114913.png)

​    ![img](/Users/jiusonghuang/pic-md/20211226114935.png)

可以看见，磁盘读取依靠的是机械运动，分为寻道时间、旋转延迟、传输时间三个部分，这三个部分耗时相加就是一次磁盘IO的时间，一般大概9ms左右。寻道时间（seek）是将读写磁头移动至正确的磁道上所需要的时间，这部分时间代价最高；旋转延迟时间（rotation）是磁盘旋转将目标扇区移动到读写磁头下方所需的时间，取决于磁盘转速；数据传输时间（transfer）是完成传输数据所需要的时间，取决于接口的数据传输率，在纳秒级，远小于前两部分消耗时间。磁盘读取时间成本是访问内存的几百倍到几万倍之间。

为了提高效率，要尽量减少磁盘I/O。为了达到这个目的，磁盘往往不是严格按需读取，而是每次都会预读，即使只需要一个字节，磁盘也会从这个位置开始，顺序向后读取一定长度的数据放入内存，这个称之为**预读**。这样做的理论依据是计算机科学中著名的局部性原理：

**当一个数据被用到时，其附近的数据也通常会马上被使用。**

**程序运行期间所需要的数据通常比较集中。**

大家可以试运行下面这段代码：

```java
public static void main(String[] args) {
​    int[][] arr = new int[10000][10000];
​    int sum = 0;
​    long startTime = System.currentTimeMillis();
​    for (int i = 0; i < arr.length; i++) {
​       for (int j = 0; j < arr[0].length; j++) {
​         /*按行访问数组*/
​         sum += arr[i][j];
​       }
​    }
​    System.out.println("按行耗时：" + (System.currentTimeMillis() - startTime) + "ms");
​    sum = 0;
​    startTime = System.currentTimeMillis();
​    for (int i = 0; i < arr.length; i++) {
​       for (int j = 0; j < arr[0].length; j++) {
​         /*按列访问数组*/
​         sum += arr[j][i];
​       }
​    }
​    System.out.println("按列耗时：" + (System.currentTimeMillis() - startTime) + "ms");
  }
```

​    ![img](/Users/jiusonghuang/pic-md/20211226114956.png)

就能看到局部性原理对程序性能的影响。

由于磁盘顺序读取的效率很高（不需要寻道时间，只需很少的旋转时间），一般来说，磁盘的顺序读的效率是随机读的40到400倍都有可能，顺序写是随机写的10到100倍（SSD盘则差距要小的多，顺序读写的效率是随机读写的7到10倍，但是有评测表明机械硬盘的顺序写性能稍优于SSD。总的来说Mysql数据库如果由硬盘由机械的换成SSD的，性能会有很大的提升），因此对于具有局部性的程序来说，预读可以提高I/O效率。

预读的长度一般为页（page）的整倍数。页是计算机管理存储器的逻辑块，硬件及操作系统往往将主存和磁盘存储区分割为连续的大小相等的块，每个存储块称为一页，页大小通常为4k当然也有16K的，主存和磁盘以页为单位交换数据。当程序要读取的数据不在主存中时，会触发一个缺页异常，此时系统会向磁盘发出读盘信号，磁盘会找到数据的起始位置并向后连续读取一页或几页载入内存中，然后异常返回，程序继续运行。

按照磁盘的这种性质，如果是一个页存放一个B+树的节点，自然是可以存放很多的数据的，比如InnoDB里，默认定义的B+树的节点大小是16KB，这就是说，假如一个Key是8个字节，那么一个节点可以存放大约1000个Key，意味着B+数可以有1000个分叉。同时InnoDB每一次磁盘I/O，读取的都是 16KB的整数倍的数据。也就是说InnoDB在节点的读写上是可以充分利用磁盘顺序IO的高速读写特性。

同时按照B+树逻辑结构来说，在叶子节点一层，所有记录的主键按照从小到大的顺序排列，并且形成了一个双向链表。同一层的非叶子节点也互相串联，形成了一个双向链表。那么在实际读写的时候，很大的概率相邻的节点会放在相邻的页上，又可以充分利用磁盘顺序IO的高速读写特性。所以我们对MySQL优化的一大方向就是**尽可能的多让数据顺序读写，少让数据随机读写**。

# 9、**Mysql内核查询成本计算实战**

**Optimizer Trace**

有道云链接：http://note.youdao.com/noteshare?id=6c03ef8fa44c1d2d15e319e2f2ed5a6a&sub=3E5FB31F083F4AA69F55B65D395E8241

对于MySQL5.6之前的版本来说，只能通过EXPLAIN语句查看到最后优化器决定使用的执行计划，却无法知道它为什么做这个决策。我们可能有这样的疑问：“我就觉得使用其他的执行方案比EXPLAIN输出的这种方案强，凭什么优化器做的决定和我想的不一样呢？为什么MySQL一定要全文扫描，不用索引呢？”

在MySQL 5.6以及之后的版本中，MySQL提出了一个optimizer trace的功能，这个功能可以让我们方便的查看优化器生成执行计划的整个过程，这个功能的解释请参考第四期MySQL的《04-VIP-Mysql索引优化实战一》。

比如对于下面这个SQL语句：

```sql
SELECT * FROM order_exp WHERE order_no IN ('DD00_6S', 'DD00_9S', 'DD00_10S') AND  expire_time> '2021-03-22 18:28:28' AND expire_time<= '2021-03-22 18:35:09' AND insert_time> expire_time AND order_note LIKE '%7排1%' AND  order_status = 0;
```

我们执行如下的命令：

```sql
SET optimizer_trace="enabled=on";

SELECT * FROM order_exp WHERE order_no IN ('DD00_6S', 'DD00_9S', 'DD00_10S') AND  expire_time> '2021-03-22 18:28:28' AND expire_time<= '2021-03-22 18:35:09' AND insert_time> expire_time AND order_note LIKE '%7排1%' AND  order_status = 0;

SELECT * FROM information_schema.OPTIMIZER_TRACE\G  

```

可以看见全表扫描的成本：2169.9

![img](/Users/jiusonghuang/pic-md/20211228203742.png)

使用索引idx_order_no的成本为72.61：

   ![img](/Users/jiusonghuang/pic-md/20211228203806.png)

使用索引idx_expire_time的成本为47.81：

​    ![img](/Users/jiusonghuang/pic-md/20211228203827.png)

最终MySQL使用了idx_expire_time作为这个SQL查询过程中索引：

![img](/Users/jiusonghuang/pic-md/20211228203846.png)

因为优化器最终会选择成本最低的那种方案来作为最终的执行计划。

但是这些成本怎么来的呢？搞明白了这些成本的由来，就不会再有诸如“为什么MySQL一定要全文扫描，不用索引呢？为什么MySQL要用A索引不用B索引之类的疑问？”了，因为以上的答案都可以用成本分析来解答。所以接下来，我们就要深入MySQL的内核来看看这些成本是如何计算的。

## **什么是成本**

MySQL执行一个查询可以有不同的执行方案，它会选择其中成本最低，或者说代价最低的那种方案去真正的执行查询。什么是执行成本呢？其实在MySQL中一条查询语句的执行成本是由下边这两个方面组成的：

### **I/O成本**

我们的表经常使用的MyISAM、InnoDB存储引擎都是将数据和索引都存储到磁盘上的，当我们想查询表中的记录时，需要先把数据或者索引加载到内存中然后再操作。这个从磁盘到内存这个加载的过程损耗的时间称之为I/O成本。

### **CPU成本**

读取以及检测记录是否满足对应的搜索条件、对结果集进行排序等这些操作损耗的时间称之为CPU成本。

对于InnoDB存储引擎来说，页是磁盘和内存之间交互的基本单位，MySQL规定读取一个页面花费的成本默认是1.0，读取以及检测一条记录是否符合搜索条件的成本默认是0.2。1.0、0.2这些数字称之为成本常数，这两个成本常数我们最常用到，当然还有其他的成本常数。

注意，不管读取记录时需不需要检测是否满足搜索条件，其成本都算是0.2。

## **单表查询的成本**

### **MySQL查询成本计算实战**

在一条单表查询语句真正执行之前，MySQL的查询优化器会找出执行该语句所有可能使用的方案，对比之后找出成本最低的方案，这个成本最低的方案就是所谓的执行计划，之后才会调用存储引擎提供的接口真正的执行查询，这个过程总结一下就是这样：

1、根据搜索条件，找出所有可能使用的索引

2、计算全表扫描的代价

3、计算使用不同索引执行查询的代价

4、对比各种执行方案的代价，找出成本最低的那一个

我们依然以上面的查询语句来分析：

```sql
SELECT * FROM order_exp WHERE order_no IN ('DD00_6S', 'DD00_9S', 'DD00_10S') AND  expire_time> '2021-03-22 18:28:28' AND expire_time<= '2021-03-22 18:35:09' AND insert_time> expire_time AND order_note LIKE '%7排1%' AND  order_status = 0;
```

我们一步一步分析一下。

**1. 根据搜索条件，找出所有可能使用的索引**

MySQL把一个查询中可能使用到的索引称之为possible keys。

我们分析一下上边查询中涉及到的几个搜索条件：

order_no IN ('DD00_6S', 'DD00_9S', 'DD00_10S') ，这个搜索条件可以使用二级索引idx_order_no。

expire_time> '2021-03-22 18:28:28' AND expire_time<= '2021-03-22 18:35:09'，这个搜索条件可以使用二级索引idx_expire_time。

insert_time> expire_time，这个搜索条件的索引列由于没有和常数比较，所以并不能使用到索引。

order_note LIKE '%hello%'，order_note即使有索引，但是通过LIKE操作符和以通配符开头的字符串做比较，不可以适用索引。

order_status = 0，由于该列上只有联合索引，而且不符合最左前缀原则，所以不会用到索引。

综上所述，上边的查询语句可能用到的索引，也就是possible keys只有idx_order_no，idx_expire_time。

​    ![img](/Users/jiusonghuang/pic-md/20211228203939.png)

**2. 计算全表扫描的代价**

对于InnoDB存储引擎来说，全表扫描的意思就是把聚簇索引中的记录都依次和给定的搜索条件做一下比较，把符合搜索条件的记录加入到结果集，所以需要将聚簇索引对应的页面加载到内存中，然后再检测记录是否符合搜索条件。由于查询成本=I/O成本+CPU成本，所以计算全表扫描的代价需要两个信息：

## **聚簇索引占用的页面数**

### **该表中的记录数**

这两个信息从哪来呢？MySQL为每个表维护了一系列的统计信息，关于这些统计信息是如何收集起来的我们放在后边再说，现在看看怎么查看这些统计信息。

MySQL给我们提供了SHOW TABLE STATUS语句来查看表的统计信息，如果要看指定的某个表的统计信息，在该语句后加对应的LIKE语句就好了，比方说我们要查看order_exp这个表的统计信息可以这么写：

```sql
SHOW TABLE STATUS LIKE 'order_exp'\G
```

​    ![img](/Users/jiusonghuang/pic-md/20211228204001.png)

出现了很多统计选项，但我们目前只需要两个：

**Rows**

本选项表示表中的记录条数。对于使用MyISAM存储引擎的表来说，该值是准确的，对于使用InnoDB存储引擎的表来说，该值是一个估计值。从查询结果我们也可以看出来，由于我们的order_exp表是使用InnoDB存储引擎的，所以虽然实际上表中有10567条记录，但是SHOW TABLE STATUS显示的Rows值只有10354条记录。

**Data_length**

本选项表示表占用的存储空间字节数。使用MyISAM存储引擎的表来说，该值就是数据文件的大小，对于使用InnoDB存储引擎的表来说，该值就相当于聚簇索引占用的存储空间大小，也就是说可以这样计算该值的大小：

Data_length = 聚簇索引的页面数量 x 每个页面的大小

我们的order_exp使用默认16KB的页面大小，而上边查询结果显示Data_length的值是1589248，所以我们可以反向来推导出聚簇索引的页面数量：

聚簇索引的页面数量 = 1589248 ÷ 16 ÷ 1024 = 97

我们现在已经得到了聚簇索引占用的页面数量以及该表记录数的估计值，所以就可以计算全表扫描成本了。

现在可以看一下全表扫描成本的计算过程：

**I/O成本**

97 x 1.0 + 1.1 = 98.1

97指的是聚簇索引占用的页面数，1.0指的是加载一个页面的IO成本常数，后边的1.1是一个微调值。

*TIPS：MySQL在真实计算成本时会进行一些微调，这些微调的值是直接硬编码到代码里的，没有注释而且这些微调的值十分的小，并不影响我们大方向的分析。*

**CPU成本**

10354x 0.2 + 1.0 = 2071.8

10354指的是统计数据中表的记录数，对于InnoDB存储引擎来说是一个估计值，0.2指的是访问一条记录所需的CPU成本常数，后边的1.0是一个微调值。

**总成本：**

98.1 + 2071.8= 2169.9

综上所述，对于order_exp的全表扫描所需的总成本就是2169.9。

**TIPS：我们前边说过表中的记录其实都存储在聚簇索引对应B+树的叶子节点中，所以只要我们通过根节点获得了最左边的叶子节点，就可以沿着叶子节点组成的双向链表把所有记录都查看一遍。**

**也就是说全表扫描这个过程其实有的B+树非叶子节点是不需要访问的，但是MySQL在计算全表扫描成本时直接使用聚簇索引占用的页面数作为计算I/O成本的依据，是不区分非叶子节点和叶子节点的。**

**3. 计算使用不同索引执行查询的代价**

从第1步分析我们得到，上述查询可能使用到idx_order_no，idx_expire_time这两个索引，我们需要分别分析单独使用这些索引执行查询的成本，最后还要分析是否可能使用到索引合并（什么是索引合并，我们后面的课程会讲到）。这里需要提一点的是，MySQL查询优化器先分析使用唯一二级索引的成本，再分析使用普通索引的成本，我们这里两个索引都是普通索引，先算哪个都可以。我们先分析idx_expire_time的成本，然后再看使用idx_order_no的成本。

## **使用idx_expire_time执行查询的成本分析**

idx_expire_time对应的搜索条件是：expire_time> '2021-03-22 18:28:28' AND expire_time<= '2021-03-22 18:35:09' ，也就是说对应的范围区间就是：('2021-03-22 18:28:28' , '2021-03-22 18:35:09' )。

使用idx_expire_time搜索会使用用二级索引 + 回表方式的查询，MySQL计算这种查询的成本依赖两个方面的数据：

### **1、范围区间数量**

不论某个范围区间的二级索引到底占用了多少页面，查询优化器认为读取索引的一个范围区间的I/O成本和读取一个页面是相同的。本例中使用idx_expire_time的范围区间只有一个，所以相当于访问这个范围区间的二级索引付出的I/O成本就是：**1 x 1.0 = 1.0**

### **2、需要回表的记录数**

优化器需要计算二级索引的某个范围区间到底包含多少条记录，对于本例来说就是要计算idx_expire_time在('2021-03-22 18:28:28' ，'2021-03-22 18:35:09')这个范围区间中包含多少二级索引记录，计算过程是这样的：

步骤1：先根据expire_time> ‘2021-03-22 18:28:28’这个条件访问一下idx_expire_time对应的B+树索引，找到满足expire_time> ‘2021-03-22 18:28:28’这个条件的第一条记录，我们把这条记录称之为区间最左记录。我们前头说过在B+数树中定位一条记录的过程是很快的，是常数级别的，所以这个过程的性能消耗是可以忽略不计的。

步骤2：然后再根据expire_time<= ‘2021-03-22 18:35:09’这个条件继续从idx_expire_time对应的B+树索引中找出最后一条满足这个条件的记录，我们把这条记录称之为区间最右记录，这个过程的性能消耗也可以忽略不计的。

步骤3：如果区间最左记录和区间最右记录相隔不太远（在MySQL 5.7这个版本里，只要相隔不大于10个页面即可），那就可以精确统计出满足expire_time> ‘2021-03-22 18:28:28’ AND expire_time<= ‘2021-03-22 18:35:09’条件的二级索引记录条数。否则只沿着区间最左记录向右读10个页面，计算平均每个页面中包含多少记录，然后用这个平均值乘以区间最左记录和区间最右记录之间的页面数量就可以了。那么问题又来了，怎么估计区间最左记录和区间最右记录之间有多少个页面呢？解决这个问题还得回到B+树索引的结构中来。

我们假设区间最左记录在页b中，区间最右记录在页c中，那么我们想计算区间最左记录和区间最右记录之间的页面数量就相当于计算页b和页c之间有多少页面，而它们父节点中记录的每一条目录项记录都对应一个数据页，所以计算页b和页c之间有多少页面就相当于计算它们父节点（也就是页a）中对应的目录项记录之间隔着几条记录。在一个页面中统计两条记录之间有几条记录的成本就很小了。

不过还有问题，如果页b和页c之间的页面实在太多，以至于页b和页c对应的目录项记录都不在一个父页面中怎么办？既然是树，那就继续递归，之前我们说过一个B+树有4层高已经很了不得了，所以这个统计过程也不是很耗费性能。

知道了如何统计二级索引某个范围区间的记录数之后，就需要回到现实问题中来，MySQL根据上述算法测得idx_expire_time在区间('2021-03-22 18:28:28' ，'2021-03-22 18:35:09')之间大约有39条记录。

```sql
explain SELECT \* FROM order_exp WHERE expire_time> '2021-03-22 18:28:28' AND expire_time<= '2021-03-22 18:35:09';
```

![img](/Users/jiusonghuang/pic-md/20211228204024.png)

读取这39条二级索引记录需要付出的CPU成本就是：

**39 x 0.2 + 0.01 = 7.81**

其中39是需要读取的二级索引记录条数，0.2是读取一条记录成本常数，0.01是微调。

在通过二级索引获取到记录之后，还需要干两件事儿：

**1、根据这些记录里的主键值到聚簇索引中做回表操作**

MySQL评估回表操作的I/O成本依旧很简单粗暴，他们认为每次回表操作都相当于访问一个页面，也就是说二级索引范围区间有多少记录，就需要进行多少次回表操作，也就是需要进行多少次页面I/O。我们上边统计了使用idx_expire_time二级索引执行查询时，预计有39 条二级索引记录需要进行回表操作，所以回表操作带来的I/O成本就是：

**39 x 1.0 = 39 .0**

其中39 是预计的二级索引记录数，1.0是一个页面的I/O成本常数。

**2、回表操作后得到的完整用户记录，然后再检测其他搜索条件是否成立**

回表操作的本质就是通过二级索引记录的主键值到聚簇索引中找到完整的用户记录，然后再检测除expire_time> '2021-03-22 18:28:28' AND expire_time< '2021-03-22 18:35:09'这个搜索条件以外的搜索条件是否成立。

因为我们通过范围区间获取到二级索引记录共39 条，也就对应着聚簇索引中39 条完整的用户记录，读取并检测这些完整的用户记录是否符合其余的搜索条件的CPU成本如下：

**39 x 0.2 =7.8**

其中39 是待检测记录的条数，0.2是检测一条记录是否符合给定的搜索条件的成本常数。

**所以本例中使用idx_expire_time执行查询的成本就如下所示：**

I/O成本：

1.0 + 39 x 1.0 = 40 .0 (范围区间的数量 + 预估的二级索引记录条数)

CPU成本：

39 x 0.2 + 0.01 + 39 x 0.2 = 15.61 （读取二级索引记录的成本 + 读取并检测回表后聚簇索引记录的成本）

综上所述，使用idx_expire_time执行查询的总成本就是：

 40 .0 + 15.61 = 55.61

**使用idx_order_no执行查询的成本分析**

idx_order_no对应的搜索条件是：order_no IN ('DD00_6S', 'DD00_9S', 'DD00_10S')，也就是说相当于3个单点区间。

与使用idx_expire_time的情况类似，我们也需要计算使用idx_order_no时需要访问的范围区间数量以及需要回表的记录数，计算过程与上面类似，我们不详列所有计算步骤和说明了。

**范围区间数量**

使用idx_order_no执行查询时很显然有3个单点区间，所以访问这3个范围区间的二级索引付出的I/O成本就是：

3 x 1.0 = 3.0

**需要回表的记录数**

由于使用idx_expire_time时有3个单点区间，所以每个单点区间都需要查找一遍对应的二级索引记录数，三个单点区间总共需要回表的记录数是58。

```sql
explain SELECT * FROM order_exp WHERE order_no IN ('DD00_6S', 'DD00_9S', 'DD00_10S');   
```

![img](/Users/jiusonghuang/pic-md/20211228204048.png)

读取这些二级索引记录的CPU成本就是：58 x 0.2 + 0.01 = 11.61

得到总共需要回表的记录数之后，就要考虑：

根据这些记录里的主键值到聚簇索引中做回表操作，所需的I/O成本就是：58 x 1.0 = 58.0

回表操作后得到的完整用户记录，然后再比较其他搜索条件是否成立

此步骤对应的CPU成本就是：

58 x 0.2 = 11.6

所以本例中使用idx_order_no执行查询的成本就如下所示：

I/O成本：

3.0 + 58 x 1.0 = 61.0 (范围区间的数量 + 预估的二级索引记录条数)

CPU成本：

58 x 0.2 + 58 x 0.2 + 0.01 = 23.21 （读取二级索引记录的成本 + 读取并检测回表后聚簇索引记录的成本）

综上所述，使用idx_order_no执行查询的总成本就是：

61.0 + 23.21 = 84.21

**是否有可能使用索引合并（Index Merge）**

本例中SQL语句不满足索引合并的条件，所以并不会使用索引合并。而且MySQL查询优化器计算索引合并成本的算法也比较麻烦，我们不去了解。

**4. 对比各种方案，找出成本最低的那一个**

下边把执行本例中的查询的各种可执行方案以及它们对应的成本列出来：

全表扫描的成本：2169.9

使用idx_expire_time的成本：55.61

使用idx_order_no的成本：84.21

很显然，使用idx_expire_time的成本最低，所以当然选择idx_expire_time来执行查询。来和Tracer中的比较一下：

   ![img](/Users/jiusonghuang/pic-md/20211228204107.png)

   ![img](/Users/jiusonghuang/pic-md/20211228204119.png)

 ![img](/Users/jiusonghuang/pic-md/20211228204208.png)![img](/Users/jiusonghuang/pic-md/20211228204148.png)

嗯？除了全表扫描，其他的怎么好像有点对不上呢？

*请注意：*

*1、在MySQL的实际计算中，在和全文扫描比较成本时，使用索引的成本会去除读取并检测回表后聚簇索引记录的成本，也就是说，我们通过MySQL看到的成本将会是：idx_expire_time为47.81(55.61-7.8)，idx_order_no为72.61(84.21-11.6)。但是MySQL比较完成本后，会再计算一次使用索引的成本，此时就会加上前面去除的成本，也就是我们计算出来的值。*

   ![img](/Users/jiusonghuang/pic-md/20211228204227.png)

*2、MySQL的源码中对成本的计算实际要更复杂，但是基本思想和算法是没错的。*

## **基于索引统计数据的成本**

**index dive**

有时候使用索引执行查询时会有许多单点区间，比如使用IN语句就很容易产生非常多的单点区间，比如下边这个查询（下边查询语句中的...表示还有很多参数）：

```sql
SELECT * FROM order_exp WHERE order_no IN ('aa1', 'aa2', 'aa3', ... , 'zzz');
```

很显然，这个查询可能使用到的索引就是idx_order_no，由于这个索引并不是唯一二级索引，所以并不能确定一个单点区间对应的二级索引记录的条数有多少，需要我们去计算。就是先获取索引对应的B+树的区间最左记录和区间最右记录，然后再计算这两条记录之间有多少记录（记录条数少的时候可以做到精确计算，多的时候只能估算）。MySQL把这种通过直接访问索引对应的B+树来计算某个范围区间对应的索引记录条数的方式称之为index dive。

有零星几个单点区间的话，使用index dive的方式去计算这些单点区间对应的记录数也不是什么问题，如果IN语句里20000个参数怎么办？

这就意味着MySQL的查询优化器为了计算这些单点区间对应的索引记录条数，要进行20000次index dive操作，这性能损耗就很大，搞不好计算这些单点区间对应的索引记录条数的成本比直接全表扫描的成本都大了。MySQL考虑到了这种情况，所以提供了一个系统变量eq_range_index_dive_limit，我们看一下在MySQL 5.7.21中这个系统变量的默认值：

```sql
show variables like '%dive%';
```

![img](/Users/jiusonghuang/pic-md/20211228204253.png)

也就是说如果我们的IN语句中的参数个数小于200个的话，将使用index dive的方式计算各个单点区间对应的记录条数，如果大于或等于200个的话，可就不能使用index dive了，要使用所谓的索引统计数据来进行估算。怎么个估算法？

像会为每个表维护一份统计数据一样，MySQL也会为表中的每一个索引维护一份统计数据，查看某个表中索引的统计数据可以使用SHOW INDEX FROM 表名的语法，比如我们查看一下order_exp的各个索引的统计数据可以这么写：

```sql
show index from order_exp;    
```

![img](/Users/jiusonghuang/pic-md/20211228204319.png)

属性名	描述

Table	索引所属表的名称。

Non_unique	索引列的值是否是唯一的，聚簇索引和唯一二级索引的该列值为0，普通二级索引该列值为1。

Key_name	索引的名称。

Seq_in_index	索引列在索引中的位置，从1开始计数。比如对于联合索引u_idx_day_status，来说，`insert_time`, `order_status`, `expire_time`对应的位置分别是1、2、3。

Column_name	索引列的名称。

Collation	索引列中的值是按照何种排序方式存放的，值为A时代表升序存放，为NULL时代表降序存放。

Cardinality	索引列中不重复值的数量。后边我们会重点看这个属性的。

Sub_part	对于存储字符串或者字节串的列来说，有时候我们只想对这些串的前n个字符或字节建立索引，这个属性表示的就是那个n值。如果对完整的列建立索引的话，该属性的值就是NULL。

Packed	索引列如何被压缩，NULL值表示未被压缩。这个属性我们暂时不了解，可以先忽略掉。

Null	该索引列是否允许存储NULL值。

Index_type	使用索引的类型，我们最常见的就是BTREE，其实也就是B+树索引。

Comment	索引列注释信息。

Index_comment	索引注释信息。

Cardinality属性，Cardinality直译过来就是基数的意思，表示索引列中不重复值的个数。比如对于一个一万行记录的表来说，某个索引列的Cardinality属性是10000，那意味着该列中没有重复的值，如果Cardinality属性是1的话，就意味着该列的值全部是重复的。不过需要注意的是，对于InnoDB存储引擎来说，使用SHOW INDEX语句展示出来的某个索引列的Cardinality属性是一个估计值，并不是精确的。

前边说道，当IN语句中的参数个数大于或等于系统变量eq_range_index_dive_limit的值的话，就不会使用index dive的方式计算各个单点区间对应的索引记录条数，而是使用索引统计数据，这里所指的索引统计数据指的是这两个值：

使用SHOW TABLE STATUS展示出的Rows值，也就是一个表中有多少条记录。

使用SHOW INDEX语句展示出的Cardinality属性。

结合上一个Rows统计数据，我们可以针对索引列，计算出平均一个值重复多少次。

一个值的重复次数 ≈ Rows ÷ Cardinality

以order_exp表的idx_order_no索引为例，它的Rows值是10354，它对应的Cardinality值是10225，所以我们可以计算order_no列平均单个值的重复次数就是：

10354÷ 10225≈ 1.0126（条）

此时再看上边那条查询语句：

```sql
SELECT * FROM order_exp WHERE order_no IN ('aa1', 'aa2', 'aa3', ... , 'zzz');
```

假设IN语句中有20000个参数的话，就直接使用统计数据来估算这些参数需要单点区间对应的记录条数了，每个参数大约对应1.012条记录，所以总共需要回表的记录数就是：

20000 x1.0126= 20252

使用统计数据来计算单点区间对应的索引记录条数比index dive的方式简单，但是它的致命弱点就是：不精确！。使用统计数据算出来的查询成本与实际所需的成本可能相差非常大。

大家需要注意一下，在MySQL 5.7.3以及之前的版本中，eq_range_index_dive_limit的默认值为10，之后的版本默认值为200。所以如果大家采用的是5.7.3以及之前的版本的话，很容易采用索引统计数据而不是index dive的方式来计算查询成本。当你的查询中使用到了IN查询，但是却实际没有用到索引，就应该考虑一下是不是由于 eq_range_index_dive_limit 值太小导致的。

## **EXPLAIN输出成本**

前面我们已经对MySQL查询优化器如何计算成本有了比较深刻的了解。如何通过EXPLAIN语句查看成本呢？MySQL已经为我们提供了一种查看某个执行计划花费的成本的方式：

在EXPLAIN单词和真正的查询语句中间加上FORMAT=JSON。

这样我们就可以得到一个json格式的执行计划，里边包含该计划花费的成本，比如这样：

```sql
explain format=json SELECT * FROM order_exp WHERE order_no IN ('DD00_6S', 'DD00_9S', 'DD00_10S') AND  expire_time> '2021-03-22 18:28:28' AND expire_time<= '2021-03-22 18:35:09' AND insert_time> expire_time AND order_note LIKE '%7排1%' AND  order_status = 0\G
```

```sql
*************************** 1. row ***************************

EXPLAIN: {

  "query_block": {

​    "select_id": 1,  # 整个查询语句只有1个SELECT关键字，该关键字对应的id号为1

​    "cost_info": {

​      "query_cost": "55.61" # 整个查询的执行成本预计为55.61

​    },

​    "table": {

​      "table_name": "order_exp",

​      "access_type": "range",

​      "possible_keys": [

​        "idx_order_no",

​        "idx_expire_time"

​      ],

​      "key": "idx_expire_time",

​      "used_key_parts": [

​        "expire_time"

​      ],

​      "key_length": "5",

​      "rows_examined_per_scan": 39,

​      "rows_produced_per_join": 0,

​      "filtered": "0.13",

​      "index_condition": "((`mysqladv`.`order_exp`.`expire_time` > '2021-03-22 18:28:28') and (`mysqladv`.`order_exp`.`expire_time` <= '2021-03-22 18:35:09'))",

​      "cost_info": {

​        "read_cost": "55.60",

​        "eval_cost": "0.01",

​        "prefix_cost": "55.61",   #单独查询表的成本，也就是：read_cost + eval_cost

​        "data_read_per_join": "24"  #和连接查询相关的数据量，单位字节，这里无用

​      },

​      "used_columns": [

​        "id",

​        "order_no",

​        "order_note",

​        "insert_time",

​        "expire_duration",

​        "expire_time",

​        "order_status"

​      ],

​      "attached_condition": "((`mysqladv`.`order_exp`.`order_status` = 0) and (`mysqladv`.`order_exp`.`order_no` in ('DD00_6S','DD00_9S','DD00_10S')) and (`mysqladv`.`order_exp`.`insert_time` > `mysqladv`.`order_exp`.`expire_time`) and (`mysqladv`.`order_exp`.`order_note` like '%7排1%'))"

​    }

  }

}

1 row in set, 1 warning (0.00 sec)
```

## **连接查询的成本**

### **连接查询的概念**

下面的课程中可能牵涉连接查询中诸如“驱动表”之类的概念请参考第四期MySQL的《5、Mysql索引优化实战二》。

**Condition filtering介绍**

连接查询至少是要有两个表的，课程的讲述中可能使用order_exp表的派生表s1、s2和order_exp2。

我们前边说过，MySQL中连接查询采用的是嵌套循环连接算法，驱动表会被访问一次，被驱动表可能会被访问多次，所以对于两表连接查询来说，它的查询成本由下边两个部分构成：

### **单次查询驱动表的成本**

**多次查询被驱动表的成本（具体查询多少次取决于对驱动表查询的结果集中有多少条记录）**

对驱动表进行查询后得到的记录条数称之为驱动表的**扇出**（英文名：fanout）。很显然驱动表的扇出值越小，对被驱动表的查询次数也就越少，连接查询的总成本也就越低。当查询优化器想计算整个连接查询所使用的成本时，就需要计算出驱动表的扇出值，有的时候扇出值的计算是很容易的，比如下边这两个查询：

查询一：

```sql
SELECT * FROM order_exp AS s1 INNER JOIN order_exp2 AS s2;
```

假设使用s1表作为驱动表，很显然对驱动表的单表查询只能使用全表扫描的方式执行，驱动表的扇出值也很明确，那就是驱动表中有多少记录，扇出值就是多少。统计数据中s1表的记录行数是10573，也就是说优化器就直接会把10573当作s1表的扇出值。

查询二：

```sql
SELECT * FROM order_exp AS s1 INNER JOIN order_exp2 AS s2 
WHERE s1.expire_time> '2021-03-22 18:28:28' AND s1.expire_time<= '2021-03-22 18:35:09';
```

仍然假设s1表是驱动表的话，很显然对驱动表的单表查询可以使用idx_expire_time索引执行查询。此时范围区间( '2021-03-22 18:28:28', '2021-03-22 18:35:09')中有多少条记录，那么扇出值就是多少。

但是有的时候扇出值的计算就变得很棘手，比方说下边几个查询：

查询三：

```sql
SELECT * FROM order_exp AS s1 INNER JOIN order_exp2 AS s2 WHERE s1.order_note > 'xyz';
```

本查询和查询一类似，只不过对于驱动表s1多了一个order_note > 'xyz'的搜索条件。查询优化器又不会真正的去执行查询，所以它只能猜这10573记录里有多少条记录满足order_note > 'xyz'条件。

查询四：

```sql
SELECT * FROM order_exp AS s1 INNER JOIN order_exp2 AS s2 WHERE s1.expire_time> '2021-03-22 18:28:28' AND s1.expire_time<= '2021-03-22 18:35:09' AND s1.order_note > 'xyz';
```

本查询和查询二类似，只不过对于驱动表s1也多了一个order_note > 'xyz'的搜索条件。不过因为本查询可以使用idx_expire_time索引，所以只需要从符合二级索引范围区间的记录中猜有多少条记录符合order_note > 'xyz'条件，也就是只需要猜在39条记录中有多少符合order_note > 'xyz'条件。    ![img](/Users/jiusonghuang/pic-md/20211228204358.png)

查询五：

```sql
SELECT * FROM order_exp AS s1 INNER JOIN order_exp2 AS s2  WHERE s1.expire_time> '2021-03-22 18:28:28' AND s1.expire_time<= '2021-03-22 18:35:09' AND s1.order_no IN ('DD00_6S', 'DD00_9S', 'DD00_10S') AND   s1.order_note > 'xyz';
```

本查询和查询四类似，不过在驱动表s1选取idx_expire_time索引执行查询后，优化器需要从符合二级索引范围区间的记录中猜有多少条记录符合下边两个条件：

order_no IN ('DD00_6S', 'DD00_9S', 'DD00_10S') 

order_note > 'xyz'

也就是优化器需要猜在39条记录中有多少符合上述两个条件的。

说了这么多，其实就是想表达在这两种情况下计算驱动表扇出值时需要靠猜：

**如果使用的是全表扫描的方式执行的单表查询，那么计算驱动表扇出时需要猜满足搜索条件的记录到底有多少条。**

**如果使用的是索引执行的单表扫描，那么计算驱动表扇出的时候需要猜满足除使用到对应索引的搜索条件外的其他搜索条件的记录有多少条。**

MySQL把这个猜的过程称之为**condition filtering**。当然，这个过程可能会使用到索引，也可能使用到统计数据，也可能就是MySQL单纯的瞎猜，整个评估过程非常复杂，所以我们不去细讲。

在MySQL 5.7之前的版本中，查询优化器在计算驱动表扇出时，如果是使用全表扫描的话，就直接使用表中记录的数量作为扇出值，如果使用索引的话，就直接使用满足范围条件的索引记录条数作为扇出值。

在MySQL 5.7中，MySQL引入了这个condition filtering的功能，就是还要猜一猜剩余的那些搜索条件能把驱动表中的记录再过滤多少条，其实本质上就是为了让成本估算更精确。 我们所说的纯粹瞎猜其实是很不严谨的，MySQL称之为启发式规则。

### **两表连接的成本分析**

连接查询的成本计算公式是这样的：

连接查询总成本 = 单次访问驱动表的成本 + 驱动表扇出数 x 单次访问被驱动表的成本

对于左（外）连接和右（外）连接查询来说，它们的驱动表是固定的，所以想要得到最优的查询方案只需要分别为驱动表和被驱动表选择成本最低的访问方法。

可是对于内连接来说，驱动表和被驱动表的位置是可以互换的，所以需要考虑两个方面的问题：

不同的表作为驱动表最终的查询成本可能是不同的，也就是需要考虑最优的表连接顺序。然后分别为驱动表和被驱动表选择成本最低的访问方法。

很显然，计算内连接查询成本的方式更麻烦一些，下边我们就以内连接为例来看看如何计算出最优的连接查询方案。当然在某些情况下，左（外）连接和右（外）连接查询在某些特殊情况下可以被优化为内连接查询。

我们来看看内连接，比如对于下边这个查询来说：

```sql
SELECT * FROM order_exp AS s1 INNER JOIN order_exp2 AS s2 ON s1.order_no= s2.order_note  WHERE s1.expire_time> '2021-03-22 18:28:28' AND s1.expire_time<= '2021-03-22 18:35:09' AND s2.expire_time> '2021-03-22 18:35:09' AND s2.expire_time<= '2021-03-22 18:35:59';
```

可以选择的连接顺序有两种：

s1连接s2，也就是s1作为驱动表，s2作为被驱动表。

s2连接s1，也就是s2作为驱动表，s1作为被驱动表。

查询优化器需要分别考虑这两种情况下的最优查询成本，然后选取那个成本更低的连接顺序以及该连接顺序下各个表的最优访问方法作为最终的查询计划。我们定性的分析一下，不像分析单表查询那样定量的分析了：

**使用s1作为驱动表的情况**

分析对于驱动表的成本最低的执行方案，首先看一下涉及s1表单表的搜索条件有哪些：

s1.expire_time> '2021-03-22 18:28:28' AND s1.expire_time<= '2021-03-22 18:35:09' 

所以这个查询可能使用到idx_expire_time索引，从全表扫描和使用idx_expire_time这两个方案中选出成本最低的那个，很显然使用idx_expire_time执行查询的成本更低些。

然后分析对于被驱动表的成本最低的执行方案，此时涉及被驱动表s2的搜索条件就是：

1、s2.order_note = 常数（这是因为对驱动表s1结果集中的每一条记录，都需要进行一次被驱动表s2的访问，此时那些涉及两表的条件现在相当于只涉及被驱动表s2了。）

2、s2.expire_time> '2021-03-22 18:35:09' AND s2.expire_time<= '2021-03-22 18:35:59'

很显然，第一个条件由于order_note没有用到索引，所以并没有什么用，此时访问s2表时可用的方案也是全表扫描和使用idx_expire_time两种，假设使用idx_expire_time的成本更小。

所以此时使用s1作为驱动表时的总成本就是（暂时不考虑使用join buffer对成本的影响）：

使用idx_expire_time访问s1的成本 + s1的扇出 × 使用idx_expire_time访问s2的成本

**使用s2作为驱动表的情况**

分析对于驱动表的成本最低的执行方案

首先看一下涉及s2表单表的搜索条件有哪些：

s2.expire_time> '2021-03-22 18:35:09' AND s2.expire_time<= '2021-03-22 18:35:59'

所以这个查询可能使用到idx_expire_time索引，从全表扫描和使用idx_expire_time这两个方案中选出成本最低的那个，假设使用idx_expire_time执行查询的成本更低些。

然后分析对于被驱动表的成本最低的执行方案

此时涉及被驱动表s1的搜索条件就是：

1、s1.order_no = 常数

2、s1.expire_time> '2021-03-22 18:28:28' AND s1.expire_time<= '2021-03-22 18:35:09'

这时就很有趣了，使用idx_order_no可以进行ref方式的访问，使用idx_expire_time可以使用range方式的访问。

那么优化器需要从全表扫描、使用idx_order_no、使用idx_expire_time这几个方案里选出一个成本最低的方案。

这里有个问题，因为idx_expire_time的范围区间是确定的，怎么计算使用idx_expire_time的成本我们上边已经说过了，可是在没有真正执行查询前，s1.order_no = 常数中的常数值我们是不知道的，怎么衡量使用idx_order_no执行查询的成本呢？其实很简单，直接使用我们前面说过的索引统计数据就好了（就是索引列平均一个值重复多少次）。一般情况下，ref的访问方式要比range成本更低，这里假设使用idx_order_no进行对s1的访问。

所以此时使用s2作为驱动表时的总成本就是：

使用idx_expire_time访问s2的成本 + s2的扇出 × 使用idx_order_no访问s1的成本

最后优化器会比较这两种方式的最优访问成本，选取那个成本更低的连接顺序去真正的执行查询。从上边的计算过程也可以看出来，一般来讲，连接查询成本占大头的其实是驱动表扇出数 x 单次访问被驱动表的成本，所以我们的优化重点其实是下边这两个部分：

尽量减少驱动表的扇出

对被驱动表的访问成本尽量低

这一点对于我们实际书写连接查询语句时十分有用，我们需要尽量在被驱动表的连接列上建立索引，这样就可以使用ref访问方法来降低访问被驱动表的成本了。如果可以，被驱动表的连接列最好是该表的主键或者唯一二级索引列，这样就可以把访问被驱动表的成本降到更低了。

## **连接查询EXPLAIN输出连接成本**

连接查询在输出成本时和单表查询稍有不同，如下：

```sql
explain format=json SELECT * FROM order_exp AS s1 INNER JOIN order_exp2 AS s2 ON s1.order_no= s2.order_note  WHERE s1.expire_time> '2021-03-22 18:28:28' AND s1.expire_time<= '2021-03-22 18:35:09' AND s2.expire_time> '2021-03-22 18:35:09' AND s2.expire_time<= '2021-03-22 18:35:59'\G
```

```
*************************** 1. row ***************************

EXPLAIN: {

  "query_block": {

​    "select_id": 1,# 整个查询语句只有1个SELECT关键字，该关键字对应的id号为1

​    "cost_info": {

​      "query_cost": "840.51" # 整个查询的执行成本

​    },

​    "nested_loop": [   # 几个表之间采用嵌套循环连接算法执行

​      {

​        "table": {

​          "table_name": "s2",   # s2表是驱动表

​          "access_type": "range",  # 访问方法为range

​          "possible_keys": [

​            "idx_expire_time"

​          ],

​          "key": "idx_expire_time",

​          "used_key_parts": [

​            "expire_time"

​          ],

​          "key_length": "5",

​          "rows_examined_per_scan": 321, # 查询s2表大致需要扫描321条记录

​          "rows_produced_per_join": 321, # 驱动表s2的扇出是321

​          "filtered": "100.00",   # condition filtering代表的百分比

​          "index_condition": "((`mysqladv`.`s2`.`expire_time` > '2021-03-22 18:35:09') and (`mysqladv`.`s2`.`expire_time` <= '2021-03-22 18:35:59'))",

​          "cost_info": {

​            "read_cost": "386.21",

​            "eval_cost": "64.20",

​            "prefix_cost": "450.41", # 查询s1表总共的成本，read_cost + eval_cost

​            "data_read_per_join": "152K" # 读取的数据量

​          },

​          "used_columns": [

​            "id",

​            "order_no",

​            "order_note",

​            "insert_time",

​            "expire_duration",

​            "expire_time",

​            "order_status"

​          ]

​        }

​      },

​      {

​        "table": {

​          "table_name": "s1",  # s1表是被驱动表

​          "access_type": "ref", 

​          "possible_keys": [

​            "idx_order_no",

​            "idx_expire_time"

​          ],

​          "key": "idx_order_no",

​          "used_key_parts": [

​            "order_no"

​          ],

​          "key_length": "152",

​          "ref": [

​            "mysqladv.s2.order_note"

​          ],

​          "rows_examined_per_scan": 1, # 查询一次s1表大致需要扫描1条记录

​          "rows_produced_per_join": 16, # 被驱动表s2的扇出是16（由于没有多余的表进行连接，所以这个值无用）

​          "filtered": "4.94", # condition filtering代表的百分比

​          "index_condition": "(`mysqladv`.`s1`.`order_no` = `mysqladv`.`s2`.`order_note`)",

​          "cost_info": {

​            "read_cost": "325.08",

​            "eval_cost": "3.21",

​            "prefix_cost": "840.51", # 单次查询s2、多次查询s1表总共的成本

​            "data_read_per_join": "7K"

​          },

​          "used_columns": [

​            "id",

​            "order_no",

​            "order_note",

​            "insert_time",

​            "expire_duration",

​            "expire_time",

​            "order_status"

​          ],

​          "attached_condition": "((`mysqladv`.`s1`.`expire_time` > '2021-03-22 18:28:28') and (`mysqladv`.`s1`.`expire_time` <= '2021-03-22 18:35:09'))"

​        }

​      }

​    ]

  }

}

1 row in set, 1 warning (0.00 sec)
```

我们使用#后边跟随注释的形式为大家解释了EXPLAIN FORMAT=JSON语句的输出内容，s2表的"cost_info"中prefix_cost就是单独查询s2表的成本。

对于s1表的"cost_info"中，由于s1表是被驱动表，所以可能被读取多次，这里的read_cost和eval_cost是访问多次s2表后累加起来的值，而s1表中的prefix_cost的值代表的是整个连接查询预计的成本。

看完了上面的执行计划的输出，可能大家有疑惑，驱动表S2的查询成本为450.41，总查询成本为840.51，也就是说对被驱动表S1的查询成本也就是390左右，看起来用S1做驱动表好像更省一点。真的这样吗？我们把SQL语句改造一下，将INNER JOIN 替换为STRAIGHT_JOIN：

```sql
explain format=json SELECT * FROM order_exp AS s1 STRAIGHT_JOIN order_exp2 AS s2 ON s1.order_no= s2.order_note  WHERE s1.expire_time> '2021-03-22 18:28:28' AND s1.expire_time<= '2021-03-22 18:35:09' AND s2.expire_time> '2021-03-22 18:35:09' AND s2.expire_time<= '2021-03-22 18:35:59'\G
```

大家可以自行看看所需要的成本是多少，并自行解释一下原因。

### **多表连接的成本分析**

首先要考虑一下多表连接时可能产生出多少种连接顺序：

对于两表连接，比如表A和表B连接

只有 AB、BA这两种连接顺序。其实相当于2 × 1 = 2种连接顺序。

对于三表连接，比如表A、表B、表C进行连接

有ABC、ACB、BAC、BCA、CAB、CBA这么6种连接顺序。其实相当于3 × 2 × 1 = 6种连接顺序。

对于四表连接的话，则会有4 × 3 × 2 × 1 = 24种连接顺序。

对于n表连接的话，则有 n × (n-1) × (n-2) × ··· × 1种连接顺序，就是n的阶乘种连接顺序，也就是n!。

有n个表进行连接，MySQL查询优化器要每一种连接顺序的成本都计算一遍么？那就有n!种连接顺序。其实真的是要都算一遍，不过MySQL用了很多办法减少计算非常多种连接顺序的成本的方法：

**提前结束某种顺序的成本评估**

MySQL在计算各种链接顺序的成本之前，会维护一个全局的变量，这个变量表示当前最小的连接查询成本。如果在分析某个连接顺序的成本时，该成本已经超过当前最小的连接查询成本，那就压根儿不对该连接顺序继续往下分析了。比方说A、B、C三个表进行连接，已经得到连接顺序ABC是当前的最小连接成本，比方说10.0，在计算连接顺序BCA时，发现B和C的连接成本就已经大于10.0时，就不再继续往后分析BCA这个连接顺序的成本了。

**系统变量optimizer_search_depth**

为了防止无穷无尽的分析各种连接顺序的成本，MySQL提出了optimizer_search_depth系统变量，如果连接表的个数小于该值，那么就继续穷举分析每一种连接顺序的成本，否则只对与optimizer_search_depth值相同数量的表进行穷举分析。很显然，该值越大，成本分析的越精确，越容易得到好的执行计划，但是消耗的时间也就越长，否则得到不是很好的执行计划，但可以省掉很多分析连接成本的时间。

**根据某些规则压根儿就不考虑某些连接顺序**

即使是有上边两条规则的限制，但是分析多个表不同连接顺序成本花费的时间还是会很长，所以MySQL干脆提出了一些所谓的启发式规则（就是根据以往经验指定的一些规则），凡是不满足这些规则的连接顺序压根儿就不分析，这样可以极大的减少需要分析的连接顺序的数量，但是也可能造成错失最优的执行计划。他们提供了一个系统变量optimizer_prune_level来控制到底是不是用这些启发式规则。

不过按照《阿里最新Java编程规范泰山版》中《(二) 索引规约》中的说法：

​    ![img](/Users/jiusonghuang/pic-md/20211228204451.png)

当出现超过三个表的join时，就应该考虑改写SQL语句了，因为从我们上面的多表关联成本分析可以知道，就算是不考虑多表关联时需要查询的巨大记录条数，就算是几个表的关联成本计算也是个很耗费时间的过程。

**调节成本常数**

我们前边已经介绍了两个成本常数：

读取一个页面花费的成本默认是1.0

检测一条记录是否符合搜索条件的成本默认是0.2

其实除了这两个成本常数，MySQL还支持很多，它们被存储到了MySQL数据库的两个表中：

**SHOW TABLES FROM mysql LIKE '%cost%';**

   ![img](/Users/jiusonghuang/pic-md/20211228204504.png)

因为一条语句的执行其实是分为两层的：server层、存储引擎层。

在server层进行连接管理、查询缓存、语法解析、查询优化等操作，在存储引擎层执行具体的数据存取操作。也就是说一条语句在server层中执行的成本是和它操作的表使用的存储引擎是没关系的，所以关于这些操作对应的成本常数就存储在了server_cost表中，而依赖于存储引擎的一些操作对应的成本常数就存储在了engine_cost表中。

**mysql.server_cost表**

server_cost表中在server层进行的一些操作对应的成本常数，具体内容如下：

```sql
SELECT * FROM mysql.server_cost;
```

   ![img](/Users/jiusonghuang/pic-md/20211228204518.png)

我们先看一下server_cost各个列都分别是什么意思：

cost_name

表示成本常数的名称。

cost_value

表示成本常数对应的值。如果该列的值为NULL的话，意味着对应的成本常数会采用默认值。

last_update

表示最后更新记录的时间。

comment

注释。

从server_cost中的内容可以看出来，目前在server层的一些操作对应的成本常数有以下几种：

disk_temptable_create_cost	默认值40.0	 创建基于磁盘的临时表的成本，如果增大这个值的话会让优化器尽量少的创建基于磁盘的临时表。

disk_temptable_row_cost	默认值1.0	向基于磁盘的临时表写入或读取一条记录的成本，如果增大这个值的话会让优化器尽量少的创建基于磁盘的临时表。

key_compare_cost	0.1	两条记录做比较操作的成本，多用在排序操作上，如果增大这个值的话会提升filesort的成本，让优化器可能更倾向于使用索引完成排序而不是filesort。

memory_temptable_create_cost	默认值2.0	创建基于内存的临时表的成本，如果增大这个值的话会让优化器尽量少的创建基于内存的临时表。

memory_temptable_row_cost	默认值0.2	向基于内存的临时表写入或读取一条记录的成本，如果增大这个值的话会让优化器尽量少的创建基于内存的临时表。

row_evaluate_cost	默认值0.2	这个就是我们之前一直使用的检测一条记录是否符合搜索条件的成本，增大这个值可能让优化器更倾向于使用索引而不是直接全表扫描。

MySQL在执行诸如DISTINCT查询、分组查询、Union查询以及某些特殊条件下的排序查询都可能在内部先创建一个临时表，使用这个临时表来辅助完成查询（比如对于DISTINCT查询可以建一个带有UNIQUE索引的临时表，直接把需要去重的记录插入到这个临时表中，插入完成之后的记录就是结果集了）。在数据量大的情况下可能创建基于磁盘的临时表，也就是为该临时表使用MyISAM、InnoDB等存储引擎，在数据量不大时可能创建基于内存的临时表，也就是使用Memory存储引擎。大家可以看到，创建临时表和对这个临时表进行写入和读取的操作代价还是很高的就行了。

这些成本常数在server_cost中的初始值都是NULL，意味着优化器会使用它们的默认值来计算某个操作的成本，如果我们想修改某个成本常数的值的话，需要做两个步骤：

对我们感兴趣的成本常数做update更新操作，然后使用下边语句即可：

FLUSH OPTIMIZER_COSTS;

当然，在你修改完某个成本常数后想把它们再改回默认值的话，可以直接把cost_value的值设置为NULL，再使用FLUSH OPTIMIZER_COSTS语句让系统重新加载。

**mysql.engine_cost表**

engine_cost表表中在存储引擎层进行的一些操作对应的成本常数，具体内容如下：

```sql
SELECT * FROM mysql.engine_cost;
```

![img](/Users/jiusonghuang/pic-md/20211228204536.png)

与server_cost相比，engine_cost多了两个列：

engine_name列

指成本常数适用的存储引擎名称。如果该值为default，意味着对应的成本常数适用于所有的存储引擎。

device_type列

指存储引擎使用的设备类型，这主要是为了区分常规的机械硬盘和固态硬盘，不过在MySQL 5.7.X这个版本中并没有对机械硬盘的成本和固态硬盘的成本作区分，所以该值默认是0。

我们从engine_cost表中的内容可以看出来，目前支持的存储引擎成本常数只有两个：

io_block_read_cost	默认值1.0	从磁盘上读取一个块对应的成本。请注意我使用的是块，而不是页这个词。对于InnoDB存储引擎来说，一个页就是一个块，不过对于MyISAM存储引擎来说，默认是以4096字节作为一个块的。增大这个值会加重I/O成本，可能让优化器更倾向于选择使用索引执行查询而不是执行全表扫描。

memory_block_read_cost	默认值1.0	与上一个参数类似，只不过衡量的是从内存中读取一个块对应的成本。

怎么从内存中和从磁盘上读取一个块的默认成本是一样的？这主要是因为在MySQL目前的实现中，并不能准确预测某个查询需要访问的块中有哪些块已经加载到内存中，有哪些块还停留在磁盘上，所以MySQL简单的认为不管这个块有没有加载到内存中，使用的成本都是1.0。

与更新server_cost表中的记录一样，我们也可以通过更新engine_cost表中的记录来更改关于存储引擎的成本常数，做法一样。

**InnoDB中的统计数据**

我们前边学习查询成本的时候经常用到一些统计数据，比如通过SHOW TABLE STATUS可以看到关于表的统计数据，通过SHOW INDEX可以看到关于索引的统计数据，那么这些统计数据是怎么来的呢？它们是以什么方式收集的呢？

**统计数据存储方式**

InnoDB提供了两种存储统计数据的方式：

永久性的统计数据，这种统计数据存储在磁盘上，也就是服务器重启之后这些统计数据还在。

非永久性的统计数据，这种统计数据存储在内存中，当服务器关闭时这些这些统计数据就都被清除掉了，等到服务器重启之后，在某些适当的场景下才会重新收集这些统计数据。

MySQL给我们提供了系统变量innodb_stats_persistent来控制到底采用哪种方式去存储统计数据。在MySQL 5.6.6之前，innodb_stats_persistent的值默认是OFF，也就是说InnoDB的统计数据默认是存储到内存的，之后的版本中innodb_stats_persistent的值默认是ON，也就是统计数据默认被存储到磁盘中。

```sql
SHOW VARIABLES LIKE 'innodb_stats_persistent';
```

   ![img](/Users/jiusonghuang/pic-md/20211228204553.png)

不过最近的MySQL版本都基本不用基于内存的非永久性统计数据了，所以我们也就不深入研究。

不过InnoDB默认是以表为单位来收集和存储统计数据的，也就是说我们可以把某些表的统计数据（以及该表的索引统计数据）存储在磁盘上，把另一些表的统计数据存储在内存中。怎么做到的呢？我们可以在创建和修改表的时候通过指定STATS_PERSISTENT属性来指明该表的统计数据存储方式：

```
CREATE TABLE 表名 (...) Engine=InnoDB, STATS_PERSISTENT = (1|0);

ALTER TABLE 表名 Engine=InnoDB, STATS_PERSISTENT = (1|0);
```

当STATS_PERSISTENT=1时，表明我们想把该表的统计数据永久的存储到磁盘上，当STATS_PERSISTENT=0时，表明我们想把该表的统计数据临时的存储到内存中。如果我们在创建表时未指定STATS_PERSISTENT属性，那默认采用系统变量innodb_stats_persistent的值作为该属性的值。

**基于磁盘的永久性统计数据**

当我们选择把某个表以及该表索引的统计数据存放到磁盘上时，实际上是把这些统计数据存储到了两个表里：

```sql
SHOW TABLES FROM mysql LIKE 'innodb%';
```

   ![img](/Users/jiusonghuang/pic-md/20211228204606.png)

可以看到，这两个表都位于mysql系统数据库下边，其中：

innodb_table_stats存储了关于表的统计数据，每一条记录对应着一个表的统计数据。

innodb_index_stats存储了关于索引的统计数据，每一条记录对应着一个索引的一个统计项的统计数据。

**innodb_table_stats**

直接看一下这个innodb_table_stats表中的各个列都是干嘛的：    ![img](/Users/jiusonghuang/pic-md/20211228204622.png)

database_name	数据库名

table_name	表名

last_update	本条记录最后更新时间

n_rows	表中记录的条数

clustered_index_size	 表的聚簇索引占用的页面数量

sum_of_other_index_sizes	表的其他索引占用的页面数量

我们直接看一下这个表里的内容：

**SELECT \* FROM mysql.innodb_table_stats;**

![img](/Users/jiusonghuang/pic-md/20211228204646.png)

几个重要统计信息项的值如下：

n_rows的值是10350，表明order_exp表中大约有10350条记录，注意这个数据是估计值。

clustered_index_size的值是97，表明order_exp表的聚簇索引占用97个页面，这个值是也是一个估计值。

sum_of_other_index_sizes的值是81，表明order_exp表的其他索引一共占用81个页面，这个值是也是一个估计值。

**n_rows统计项的收集**

InnoDB统计一个表中有多少行记录是这样的：

按照一定算法（并不是纯粹随机的）选取几个叶子节点页面，计算每个页面中主键值记录数量，然后计算平均一个页面中主键值的记录数量乘以全部叶子节点的数量就算是该表的n_rows值。

可以看出来这个n_rows值精确与否取决于统计时采样的页面数量，MySQL用名为innodb_stats_persistent_sample_pages的系统变量来控制使用永久性的统计数据时，计算统计数据时采样的页面数量。该值设置的越大，统计出的n_rows值越精确，但是统计耗时也就最久；该值设置的越小，统计出的n_rows值越不精确，但是统计耗时特别少。所以在实际使用是需要我们去权衡利弊，该系统变量的默认值是20。

InnoDB默认是以表为单位来收集和存储统计数据的，我们也可以单独设置某个表的采样页面的数量，设置方式就是在创建或修改表的时候通过指定STATS_SAMPLE_PAGES属性来指明该表的统计数据存储方式：

CREATE TABLE 表名 (...) Engine=InnoDB, STATS_SAMPLE_PAGES = 具体的采样页面数量;

ALTER TABLE 表名 Engine=InnoDB, STATS_SAMPLE_PAGES = 具体的采样页面数量;

如果我们在创建表的语句中并没有指定STATS_SAMPLE_PAGES属性的话，将默认使用系统变量innodb_stats_persistent_sample_pages的值作为该属性的值。

clustered_index_size和sum_of_other_index_sizes统计项的收集牵涉到很具体的InnoDB表空间的知识和存储页面数据的细节，我们就不深入讲解了。

**innodb_index_stats**

直接看一下这个innodb_index_stats表中的各个列都是干嘛的：

**desc mysql.innodb_index_stats;**![img](/Users/jiusonghuang/pic-md/20211228204700.png)

字段名	描述

database_name	数据库名

table_name	表名

index_name	索引名

last_update	本条记录最后更新时间

stat_name	统计项的名称

stat_value	对应的统计项的值

sample_size	为生成统计数据而采样的页面数量

stat_description	对应的统计项的描述

innodb_index_stats表的每条记录代表着一个索引的一个统计项。可能这会大家有些懵逼这个统计项到底指什么，别着急，我们直接看一下关于order_exp表的索引统计数据都有些什么：

mysql> **SELECT \* FROM mysql.innodb_index_stats WHERE table_name = 'order_exp';**

![img](/Users/jiusonghuang/pic-md/20211228204718.png)

先查看index_name列，这个列说明该记录是哪个索引的统计信息，从结果中我们可以看出来，PRIMARY索引（也就是主键）占了3条记录，idx_expire_time索引占了6条记录。

针对index_name列相同的记录，stat_name表示针对该索引的统计项名称，stat_value展示的是该索引在该统计项上的值，stat_description指的是来描述该统计项的含义的。我们来具体看一下一个索引都有哪些统计项：

n_leaf_pages：表示该索引的叶子节点占用多少页面。

size：表示该索引共占用多少页面。

n_diff_pfxNN：表示对应的索引列不重复的值有多少。其中的NN长得有点儿怪呀，啥意思呢？

其实NN可以被替换为01、02、03... 这样的数字。比如对于u_idx_day_status来说：

n_diff_pfx01表示的是统计insert_time这单单一个列不重复的值有多少。

n_diff_pfx02表示的是统计insert_time,order_status这两个列组合起来不重复的值有多少。

n_diff_pfx03表示的是统计insert_time,order_status,expire_time这三个列组合起来不重复的值有多少。

n_diff_pfx04表示的是统计key_pare1、key_pare2、expire_time、id这四个列组合起来不重复的值有多少。

对于普通的二级索引，并不能保证它的索引列值是唯一的，比如对于idx_order_no来说，key1列就可能有很多值重复的记录。此时只有在索引列上加上主键值才可以区分两条索引列值都一样的二级索引记录。

对于主键和唯一二级索引则没有这个问题，它们本身就可以保证索引列值的不重复，所以也不需要再统计一遍在索引列后加上主键值的不重复值有多少。比如u_idx_day_statu和idx_order_no。

在计算某些索引列中包含多少不重复值时，需要对一些叶子节点页面进行采样，sample_size列就表明了采样的页面数量是多少。

对于有多个列的联合索引来说，采样的页面数量是：innodb_stats_persistent_sample_pages × 索引列的个数。

   ![img](/Users/jiusonghuang/pic-md/20211228204731.png)

当需要采样的页面数量大于该索引的叶子节点数量的话，就直接采用全表扫描来统计索引列的不重复值数量了。所以大家可以在查询结果中看到不同索引对应的size列的值可能是不同的。

**定期更新统计数据**

随着我们不断的对表进行增删改操作，表中的数据也一直在变化，innodb_table_stats和innodb_index_stats表里的统计数据也在变化。MySQL提供了如下两种更新统计数据的方式：

**开启innodb_stats_auto_recalc。**

系统变量innodb_stats_auto_recalc决定着服务器是否自动重新计算统计数据，它的默认值是ON，也就是该功能默认是开启的。

![img](/Users/jiusonghuang/pic-md/20211228204746.png)

每个表都维护了一个变量，该变量记录着对该表进行增删改的记录条数，如果发生变动的记录数量超过了表大小的10%，并且自动重新计算统计数据的功能是打开的，那么服务器会重新进行一次统计数据的计算，并且更新innodb_table_stats和innodb_index_stats表。不过自动重新计算统计数据的过程是异步发生的，也就是即使表中变动的记录数超过了10%，自动重新计算统计数据也不会立即发生，可能会延迟几秒才会进行计算。

再一次强调，InnoDB默认是以表为单位来收集和存储统计数据的，我们也可以单独为某个表设置是否自动重新计算统计数的属性，设置方式就是在创建或修改表的时候通过指定STATS_AUTO_RECALC属性来指明该表的统计数据存储方式：

CREATE TABLE 表名 (...) Engine=InnoDB, STATS_AUTO_RECALC = (1|0);

ALTER TABLE 表名 Engine=InnoDB, STATS_AUTO_RECALC = (1|0);

当STATS_AUTO_RECALC=1时，表明我们想让该表自动重新计算统计数据，当STATS_AUTO_RECALC=0时，表明不想让该表自动重新计算统计数据。如果我们在创建表时未指定STATS_AUTO_RECALC属性，那默认采用系统变量innodb_stats_auto_recalc的值作为该属性的值。

**手动调用ANALYZE TABLE语句来更新统计信息**

如果innodb_stats_auto_recalc系统变量的值为OFF的话，我们也可以手动调用ANALYZE TABLE语句来重新计算统计数据，比如我们可以这样更新关于order_exp表的统计数据：

mysql> **ANALYZE TABLE order_exp;**

   ![img](/Users/jiusonghuang/pic-md/20211228204802.png)ANALYZE TABLE语句会立即重新计算统计数据，也就是这个过程是同步的，在表中索引多或者采样页面特别多时这个过程可能会特别慢最好在业务不是很繁忙的时候再运行。

**手动更新innodb_table_stats和innodb_index_stats表**

其实innodb_table_stats和innodb_index_stats表就相当于一个普通的表一样，我们能对它们做增删改查操作。这也就意味着我们可以手动更新某个表或者索引的统计数据。比如说我们想把order_exp表关于行数的统计数据更改一下可以这么做：

步骤一：更新innodb_table_stats表。

步骤二：让MySQL查询优化器重新加载我们更改过的数据。

更新完innodb_table_stats只是单纯的修改了一个表的数据，需要让MySQL查询优化器重新加载我们更改过的数据，运行下边的命令就可以了：

FLUSH TABLE order_exp;

# 10、**从架构师角度全局理解Mysql性能优化**

**总论**

有道云链接：http://note.youdao.com/noteshare?id=f1d34fba6f218de1acf9160f45c284af&sub=9B48B919EE3C4046BC4CD564AA325A72

MySQL性能优化其实是个很大的课题，在优化上存在着一个调优金字塔的说法：    ![img](/Users/jiusonghuang/pic-md/20211229225458.png)

很明显从图上可以看出，越往上走，难度越来越高，收益却是越来越小的。比如硬件和OS调优，需要对硬件和OS有着非常深刻的了解，仅仅就磁盘一项来说，一般非DBA能想到的调整就是SSD盘比用机械硬盘更好，但其实它至少包括了，使用什么样的磁盘阵列（RAID）级别、是否可以分散磁盘IO、是否使用裸设备存放数据，使用哪种文件系统（Linux下常见的有ext2、3、4和xfs,zfs等，目前比较推荐的是XFS），操作系统的磁盘调度算法（目前比较推荐deadline，对机械硬盘和SSD都比较合适。从内核2.5开始，默认的I/O调度算法是Deadline，之后默认I/O调度算法为Anticipatory，直到内核2.6.17为止，从内核2.6.18开始，CFQ成为默认的IO调度算法，但CFQ并不推荐作为数据库服务器的磁盘调度算法）的选择，是否需要调整操作系统文件管理方面等等。

*TIPS：裸设备(raw device)，也叫裸分区（原始分区），是一种没有经过格式化，不被Unix通过文件系统来读取的特殊块设备文件。由应用程序负责对它进行读写操作。不经过文件系统的缓冲。它是不被操作系统直接管理的设备。这种设备少了操作系统这一层，I/O效率更高。*

*TIPS：小演示，查看磁盘调度算法：*

*# dmesg |grep -i scheduler*

*# df -m*

*# more /sys/block/vda/queue/scheduler*

*永久地修改IO调度算法,需要修改内核引导参数*   ![img](/Users/jiusonghuang/pic-md/20211229225525.png)

所以在进行优化时，首先需要关注和优化的应该是架构，如果架构不合理，即使是DBA能做的事情其实是也是比较有限的。

对于架构调优，在系统设计时首先需要充分考虑业务的实际情况，是否可以把不适合数据库做的事情放到数据仓库、搜索引擎或者缓存中去做；然后考虑写的并发量有多大，是否需要采用分布式；最后考虑读的压力是否很大，是否需要读写分离。对于核心应用或者金融类的应用，需要额外考虑数据安全因素，数据是否不允许丢失。

作为金字塔的底部的架构调优，采用更适合业务场景的架构能最大程度地提升系统的扩展性和可用性。在设计中进行垂直拆分能尽量解耦应用的依赖，对读压力比较大的业务进行读写分离能保证读性能线性扩展，而对于读写并发压力比较大的业务在MySQL上也有采用读写分离的大量案例。

在底层硬件系统、SQL语句和参数都基本定型的情况下，单个MySQL数据库能提供的性能、扩展性等就基本定型了。但是通过架构设计和优化，却能承载几倍、几十倍甚至百倍于单个MySQL数据库能力的业务请求能力。

对于MySQL调优，需要确认业务表结构设计是否合理，SQL语句优化是否足够，该添加的索引是否都添加了，是否可以剔除多余的索引等等。

最后确定系统、硬件有哪些地方需要优化，系统瓶颈在哪里，哪些系统参数需要调整优化，进程资源限制是否提到足够高；在硬件方面是否需要更换为具有更高I/O性能的存储硬件，是否需要升级内存、CPU、网络等。

如果在设计之初架构就不合理，比如没有进行读写分离，那么后期的MySQL和硬件、系统优化的成本就会很高，并且还不一定能最终解决问题。如果业务性能的瓶颈是由于索引等MySQL层的优化不够导致的，那么即使配置再高性能的I/O存储硬件或者CPU也无法支撑业务的全表扫描。

当然我们本课程重点关注的是MySQL方面的调优，特别是索引。SQL/索引调优要求对业务和数据流非常清楚。在阿里巴巴内部，有三分之二的DBA是业务DBA，从业务需求讨论到表结构审核、SQL语句审核、上线、索引更新、版本迭代升级，甚至哪些数据应该放到非关系型数据库中，哪些数据放到数据仓库、搜索引擎或者缓存中，都需要这些DBA跟踪和复审。他们甚至可以称为数据架构师（Data Architecher）。

## **查询性能优化**

前面的章节我们知道如何设计最优的库表结构、如何建立最好的索引，这些对于高性能来说是必不可少的。但这些还不够—还需要合理的设计查询。如果查询写得很糟糕，即使库表结构再合理、索引再合适，也无法实现高性能。

### **什么是慢查询**

慢查询日志，顾名思义，就是查询花费大量时间的日志，是指mysql记录所有执行超过long_query_time参数设定的时间阈值的SQL语句的日志。该日志能为SQL语句的优化带来很好的帮助。默认情况下，慢查询日志是关闭的，要使用慢查询日志功能，首先要开启慢查询日志功能。

### **慢查询配置**

我们已经知道慢查询日志可以帮助定位可能存在问题的SQL语句，从而进行SQL语句层面的优化。但是默认值为关闭的，需要我们手动开启。

**show VARIABLES like 'slow_query_log';**

![img](/Users/jiusonghuang/pic-md/20211229225548.png)

开启：

**set GLOBAL slow_query_log=1;**

![img](/Users/jiusonghuang/pic-md/20211229225601.png)

但是多慢算慢？MySQL中可以设定一个阈值，将运行时间超过该值的所有SQL语句都记录到慢查询日志中。long_query_time参数就是这个阈值。默认值为10，代表10秒。

**show VARIABLES like '%long_query_time%';**

当然也可以设置

**set global long_query_time=0;**   ---默认10秒，这里为了演示方便设置为0

   ![img](/Users/jiusonghuang/pic-md/20211229225617.png)

同时对于没有运行的SQL语句没有使用索引，则MySQL数据库也可以将这条SQL语句记录到慢查询日志文件，控制参数是：

**show VARIABLES like '%log_queries_not_using_indexes%';**

​    ![img](/Users/jiusonghuang/pic-md/20211229225637.png)

对于产生的慢查询日志，可以指定输出的位置，通过参数log_output来控制，可以输出到[TABLE][FILE][FILE,TABLE]。比如

set global log_output='FILE,TABLE'，缺省是输出到文件，我们的配置把慢查询输出到表，不过一般不推荐输出到表。

**show VARIABLES like 'log_output';ls** 

​    ![img](/Users/jiusonghuang/pic-md/20211229225656.png)

### **慢查询解读分析**

#### **日志格式**

开启慢查询功能以后，会根据我们的配置产生慢查询日志    ![img](/Users/jiusonghuang/pic-md/20211229225716.png)

从慢查询日志里面摘选一条慢查询日志，数据组成如下

“Time: 2021-04-05T07:50:53.243703Z”：查询执行时间

“User@Host: root[root] @ localhost []  Id:     3”：用户名 、用户的IP信息、线程ID号

“Query_time: 0.000495”：执行花费的时长【单位：秒】

“Lock_time: 0.000170”：执行获得锁的时长

“Rows_sent”：获得的结果行数

“Rows_examined”：扫描的数据行数

“SET timestamp”：这SQL执行的具体时间

最后一行：执行的SQL语句

#### **慢查询分析**

慢查询的日志记录非常多，要从里面找寻一条查询慢的日志并不是很容易的事情，一般来说都需要一些工具辅助才能快速定位到需要优化的SQL语句，下面介绍两个慢查询辅助工具

**mysqldumpslow**

常用的慢查询日志分析工具，汇总除查询条件外其他完全相同的SQL，并将分析结果按照参数中所指定的顺序输出。当然它的参数不少，我们常用的也就是那么几个。

**语法：**

mysqldumpslow -s r -t 10 slow-mysql.log

-s order (c,t,l,r,at,al,ar) 

​         c:总次数

​         t:总时间

​         l:锁的时间

​         r:获得的结果行数

​         at,al,ar :指t,l,r平均数  【例如：at = 总时间/总次数】

-s 对结果进行排序，怎么排，根据后面所带的 (c,t,l,r,at,al,ar)，缺省为at

-t  NUM       just show the top n queries：仅显示前n条查询

-g PATTERN   grep: only consider stmts that include this string：通过grep来筛选语句。

**./mysqldumpslow -s t -t 10 /home/mysql/mysql57/data/iZwz9j203ithc4gu1uvb2wZ-slow.log** 

![img](/Users/jiusonghuang/pic-md/20211229225744.png)

 **./mysqldumpslow -s t -t 10 /home/mysql/mysql57/data/iZwz9j203ithc4gu1uvb2wZ-slow.log -g select**

​    ![img](/Users/jiusonghuang/pic-md/20211229225753.png)

### **优化SQL查询方法论**

查询性能低下最基本的原因是访问的数据太多。大部分性能低下的查询都可以通过减少访问的数据量的方式进行优化。对于低效的查询，一般通过下面两个步骤来分析总是很有效:

1．确认应用程序是否在检索大量超过需要的数据。这通常意味着访问了太多的行，但有时候也可能是访问了太多的列。

2．确认MySQL服务器层是否在分析大量超过需要的数据行。

#### **业务层-请求了不需要的数据？**

有些查询会请求超过实际需要的数据，然后这些多余的数据会被应用程序丢弃。这会给MySQL服务器带来额外的负担，并增加网络开销，另外也会消耗应用服务器的CPU和内存资源。比如:

##### **查询不需要的记录**

例如先使用SELECT语句查询大量的结果，然后获取前面的N行后关闭结果集（例如取出100条记录，但是只是在页面上显示前面10条)。

##### **总是取出全部列**

每次看到SELECT*的时候都需要用怀疑的眼光审视，是不是真的需要返回全部的列？很可能不是必需的。取出全部列，会让优化器无法完成索引覆盖扫描这类优化,还会为服务器带来额外的I/O、内存和CPU的消耗。因此，一些DBA是严格禁止SELECT *的写法的，这样做有时候还能避免某些列被修改带来的问题。

什么时候应该允许查询返回超过需要的数据？如果这种有点浪费数据库资源的方式可以简化开发，因为能提高相同代码片段的复用性，如果清楚这样做的性能影响，那么这种做法也是值得考虑的。

或者如果应用程序使用了某种缓存机制，或者有其他考虑，获取超过需要的数据也可能有其好处，但不要忘记这样做的代价是什么。获取并缓存所有的列的查询，相比多个独立的只获取部分列的查询可能就更有好处。

##### **重复查询相同的数据**

不断地重复执行相同的查询，然后每次都返回完全相同的数据。比较好的方案是，当初次查询的时候将这个数据缓存起来，需要的时候从缓存中取出，这样性能显然会更好。

#### **执行层-是否在扫描额外的记录**

在确定查询只返回需要的数据以后，接下来应该看看查询为了返回结果是否扫描了过多的数据。对于MySQL，最简单的衡量查询开销的三个指标如下:

##### **响应时间、扫描的行数、返回的行数**

这三个指标都会记录到MySQL的慢日志中，所以检查慢日志记录是找出扫描行数过多的查询的好办法。

##### **响应时间**

响应时间是两个部分之和:服务时间和排队时间。

服务时间是指数据库处理这个查询真正花了多长时间。

排队时间是指服务器因为等待某些资源而没有真正执行查询的时间—-可能是等I/O操作完成，也可能是等待行锁，等等。

当你看到一个查询的响应时间的时候，首先需要问问自己，这个响应时间是否是一个合理的值。从我们的前面课程中，我们知道如何分析一个SQL查询需要哪些索引以及它的执行计划是什么,然后计算大概需要读取多少个页面和记录数，是能够大致分析出当前响应时间是不是一个合理的值。

##### **扫描的行数和返回的行数**

分析查询时，查看该查询扫描的行数是非常有帮助的。这在一定程度上能够说明该查询找到需要的数据的效率高不高。

理想情况下扫描的行数和返回的行数应该是相同的。但实际情况中这种“美事”并不多。

例如不正确的使用Limit，在系统中需要进行分页操作的时候，我们通常会使用LIMIT加上偏移量的办法实现，同时加上合适的ORDER BY子句。

在偏移量非常大的时候，SQL语句就变成了类似**select \* from order_exp limit 10000,10;**

这样的查询，这时MySQL需要查询10010条记录然后只返回最后10条，前面10 000条记录都将被抛弃，这样的代价非常高。在第四期MySQL《05-VIP-Mysql索引优化实战二》中专门讲过“分页查询优化”，请自行参考。

又或者在做一个关联查询时，服务器必须要扫描多行才能生成结果集中的一行。扫描的行数对返回的行数的比率通常很小，一般在1:1和10:1之间，不过有时候这个值也可能非常非常大。

##### **扫描的行数和访问类型**

在评估查询开销的时候，需要考虑一下从表中找到某一行数据的成本。MySQL有好几种访问方式可以查找并返回一行结果。有些访问方式可能需要扫描很多行才能返回一行结果，也有些访问方式可能无须扫描就能返回结果。

在EXPLAIN语句中的type列反应了访问类型。访问类型有很多种，从全表扫描到索引扫描、范围扫描、唯一索引查询、常数引用等，速度是从慢到快，扫描的行数也是从小到大。对其中相关的扫描表、扫描索引、范围访问和单值访问的概念要非常熟悉。

如果查询没有办法找到合适的访问类型，那么解决的最好办法通常就是增加一个合适的索引，为什么索引对于查询优化如此重要了。索引让 MySQL以最高效、扫描行数最少的方式找到需要的记录。

对于我们在SQL语句中常见的WHERE条件，一般 MySQL能够使用如下三种方式应用WHERE条件，从效率和扫描行数多少来评价的话，从好到坏依次为:

1、在索引中使用WHERE条件来过滤不匹配的记录。这是在存储引擎层完成的。

2、使用索引覆盖扫描（在Extra列中出现了Using index）来返回记录，直接从索引中过滤不需要的记录并返回命中的结果。这是在 MySQL服务器层完成的，但无须再回表查询记录。

3、从数据表中返回数据，然后过滤不满足条件的记录（在Extra列中出现Using Where)。这在 MySQL服务器层完成，MySQL需要先从数据表读出记录然后过滤。

好的索引可以让查询使用合适的访问类型，尽可能地只扫描需要的数据行。

如果发现查询需要扫描大量的数据但只返回少数的行，那么通常可以尝试下面的技巧去优化它:

1、使用索引覆盖扫描，把所有需要用的列都放到索引中，这样存储引擎无须回表获取对应行就可以返回结果了（在前面的章节中我们已经讨论过了)。

2、改变库表结构。例如使用单独的汇总表。

3、重写这个复杂的查询，让 MySQL优化器能够以更优化的方式执行这个查询。

### **重构SQL查询的方法论**

在优化有问题的查询时，目标应该是找到一个更优的方法获得实际需要的结果——而不一定总是需要从MySQL获取一模一样的结果集。有时候，可以将查询转换一种写法让其返回一样的结果,但是性能更好。但也可以通过修改应用代码,用另一种方式完成查询，最终达到一样的目的。

#### **一个复杂查询还是多个简单查询**

设计查询的时候一个需要考虑的重要问题是，是否需要将一个复杂的查询分成多个简单的查询。在传统实现中，总是强调需要数据库层完成尽可能多的工作，这样做的逻辑在于以前总是认为网络通信、查询解析和优化是一件代价很高的事情。但是这样的想法对于MySQL并不适用，MySQL 从设计上让连接和断开连接都很轻量级，在返回一个小的查询结果方面很高效。现代的网络速度比以前要快很多，无论是带宽还是延迟，即使是一个千兆网卡也能轻松满足每秒超过2000次的查询。

所以有时候，可以将一个复杂的大查询分解为多个小查询会效率更高。

不过，在应用设计的时候，如果一个查询能够胜任时还写成多个独立查询是不明智的。例如，应用对一个数据表做10次独立的查询来返回10行数据，每个查询返回一条结果，查询10次。

#### **切分查询**

有时候对于一个大查询我们需要“分而治之”，将大查询切分成小查询，每个查询功能完全一样，只完成一小部分，每次只返回一小部分查询结果。

删除旧的数据就是一个很好的例子。定期地清除大量数据时，如果用一个大的语句一次性完成的话，则可能需要一次锁住很多数据、占满整个事务日志、耗尽系统资源、阻塞很多小的但重要的查询。将一个大的DELETE语句切分成多个较小的查询可以尽可能小地影响MySQL性能，同时还可以减少MySQL复制的延迟。

一般来说，将每个SQL所处理的记录控制在5000到10000是个比较好的权衡值。

#### **分解关联查询**

很多高性能的应用都会对关联查询进行分解。简单地，可以对每一个表进行一次单表查询，然后将结果在应用程序中进行关联。到底为什么要这样做?乍一看，这样做并没有什么好处，原本一条查询，这里却变成多条查询，返回的结果又是一模一样的。事实上，用分解关联查询的方式重构查询有如下的优势:

**让缓存的效率更高。**许多应用程序可以方便地缓存单表查询对应的结果对象。将查询分解后，执行单个查询**可以减少锁的竞争**。

在应用层做关联，可以更容易对数据库进行拆分，**更容易做到高性能和可扩展**。查询本身效率也可能会有所提升。

可以**减少冗余记录的查询**。在应用层做关联查询，意味着对于某条记录应用只需要查询一次,而在数据库中做关联查询,则可能需要重复地访问一部分数据。从这点看，这样的重构还可能会减少网络和内存的消耗。

更进一步，这样做相当于**在应用中实现了哈希关联**，而不是使用MySQL的嵌套循环关联。某些场景哈希关联的效率要高很多。

在很多场景下，通过重构查询将关联放到应用程序中将会更加高效，这样的场景有很多，比如:当应用能够方便地缓存单个查询的结果的时候、当可以将数据分布到不同的MySQL服务器上的时候、当能够使用IN()的方式代替关联查询的时候、当查询中使用同一个数据表的时候。

## **从MySQL执行全流程考虑性能优化**

### **为什么查询速度会慢**

如果把查询看作是一个任务，那么它由一系列子任务组成，每个子任务都会消耗一定的时间。如果要优化查询，实际上要优化其子任务，要么消除其中一些子任务，要么减少子任务的执行次数，要么让子任务运行得更快。

在完成这些子任务的时候，查询需要在不同的地方花费时间，包括网络，CPU计算，生成统计信息和执行计划、锁等待（互斥等待）等操作，尤其是向底层存储引擎检索数据的调用操作,这些调用需要在内存操作,CPU操作和内存不足时导致的IO操作上消耗时间。根据存储引擎不同，可能还会产生大量的上下文切换以及系统调用。

优化查询的目的就是减少和消除这些操作所花费的时间。

### **查询执行的流程再回顾**

当希望MySQL 能够以更高的性能运行查询时，最好的办法就是弄清楚MySQL是如何优化和执行查询的。一旦理解这一点，很多查询优化工作实际上就是遵循一些原则让优化器能够按照预想的合理的方式运行。

换句话说，是时候回头看看我们前面讨论的内容了:MySQL执行一个查询的过程。根据下图，我们可以看到当向MySQL发送一个请求的时候，MySQL 到底做了些什么:

   ![img](/Users/jiusonghuang/pic-md/20211229225850.png)

1.客户端发送一条查询给服务器。

2．服务器先检查查询缓存，如果命中了缓存，则立刻返回存储在缓存中的结果。否则进入下一阶段（当然从MySQL8.0开始，这个部分就没有了）。

3．服务器端进行SQL解析、预处理，再由优化器生成对应的执行计划。

4. MySQL根据优化器生成的执行计划，调用存储引擎的API来执行查询。

5．将结果返回给客户端。

所以MySQL查询的生命周期大致可以按照顺序来看:从客户端，到服务器，然后在服务器上进行解析，生成执行计划，执行，并返回结果给客户端。其中“执行”可以认为是整个生命周期中最重要的阶段，这其中包括了大量为了检索数据到存储引擎的调用以及调用后的数据处理，包括排序、分组等。

上面的每一步都比想象的复杂，查询优化器固然是其中特别复杂也特别难理解的部分。但是其他部分就对查询的性能毫无影响？

### **MySQL客户端/服务器通信**

一般来说，不需要去理解MySQL通信协议的内部实现细节，只需要大致理解通信协议是如何工作的。MySQL客户端和服务器之间的通信协议是“半双工”的，这意味着，在任何一个时刻，要么是由服务器向客户端发送数据，要么是由客户端向服务器发送数据，这两个动作不能同时发生。所以，我们无法也无须将一个消息切成小块独立来发送。

这种协议让 MySQL通信简单快速，但是也从很多地方限制了MySQL。一个明显的限制是，这意味着没法进行流量控制。一旦一端开始发生消息，另一端要接收完整个消息才能响应它。这就像来回抛球的游戏﹔在任何时刻，只有一个人能控制球，而且只有控制球的人才能将球抛回去（发送消息)。

客户端用一个单独的数据包将查询传给服务器。这也是为什么当查询的语句很长的时候，参数max_allowed_packet就特别重要了。一旦客户端发送了请求，它能做的事情就只是等待结果了。

相反的，一般服务器响应给用户的数据通常很多，由多个数据包组成。当服务器开始响应客户端请求时，客户端必须完整地接收整个返回结果，而不能简单地只取前面几条结果，然后让服务器停止发送数据。这种情况下，客户端若接收完整的结果，然后取前面几条需要的结果，或者接收完几条结果后就“粗暴”地断开连接，都不是好主意。这也是在必要的时候一定要在查询中加上LIMIT限制的原因。

换一种方式解释这种行为:当客户端从服务器取数据时，看起来是一个拉数据的过程，但实际上是MySQL在向客户端推送数据的过程。客户端不断地接收从服务器推送的数据，客户端也没法让服务器停下来。

多数连接MySQL 的库函数都可以获得全部结果集并缓存到内存里，还可以逐行获取需要的数据。默认一般是获得全部结果集并缓存到内存中。MySQL通常需要等所有的数据都已经发送给客户端才能释放这条查询所占用的资源，所以接收全部结果并缓存通常可以减少服务器的压力，让查询能够早点结束、早点释放相应的资源。

当使用库函数从MySQL获取数据时，其结果看起来都像是从MySQL服务器获取数据，而实际上都是从这个库函数的缓存获取数据。多数情况下这没什么问题，但是如果需要返回一个很大的结果集的时候，这样做并不好，因为库函数会花很多时间和内存来存储所有的结果集。

对于Java程序来说，很有可能发生OOM，所以MySQL的JDBC里提供了setFetchSize() 之类的功能，来解决这个问题：

1、当statement设置以下属性时，采用的是流数据接收方式，每次只从服务器接收部份数据，直到所有数据处理完毕，不会发生JVM OOM。

setResultSetType(ResultSet.TYPE_FORWARD_ONLY);

setFetchSize(Integer.MIN_VALUE); 

2、调用statement的enableStreamingResults方法，实际上enableStreamingResults方法内部封装的就是第1种方式。

3、设置连接属性useCursorFetch=true (5.0版驱动开始支持)，statement以TYPE_FORWARD_ONLY打开，再设置fetch size参数，表示采用服务器端游标，每次从服务器取fetch_size条数据。

比如：

con = DriverManager.getConnection(url);

ps = (PreparedStatement) con.prepareStatement(sql,ResultSet.TYPE_FORWARD_ONLY,

ResultSet.CONCUR_READ_ONLY);

ps.setFetchSize(Integer.MIN_VALUE);

ps.setFetchDirection(ResultSet.FETCH_REVERSE);

rs = ps.executeQuery();

while (rs.next()) {……实际的业务处理}

### **生命周期中的查询优化处理**

查询的生命周期的下一步是将一个SQL转换成一个执行计划，MySQL再依照这个执行计划和存储引擎进行交互。这包括多个子阶段:解析SQL、预处理、优化SQL执行计划。这个过程中任何错误（例如语法错误）都可能终止查询。在实际执行中，这几部分可能一起执行也可能单独执行。

我们通过前面的学习，可以看到MySQL的查询优化器是一个非常复杂的部件，它使用了很多优化策略来生成一个最优的执行计划。优化策略可以简单地分为两种，一种是静态优化，一种是动态优化。静态优化可以直接对解析树进行分析，并完成优化。例如，优化器可以通过一些简单的代数变换将WHERE条件转换成另一种等价形式。静态优化不依赖于特别的数值，如WHERE条件中带入的一些常数等。静态优化在第一次完成后就一直有效，即使使用不同的参数重复执行查询也不会发生变化。可以认为这是一种“编译时优化”。

相反，动态优化则和查询的上下文有关，也可能和很多其他因素有关，例如WHERE条件中的取值、索引中条目对应的数据行数等。这需要在每次查询的时候都重新评估，可以认为这是“运行时优化”。

优化器是相当复杂性和智能的。建议大家“不要自以为比优化器更聪明”。如果没有必要，不要去干扰优化器的工作，让优化器按照它的方式工作。尽量按照优化器的提示去优化我们的表、索引和SQL语句，比如写查询，或者重新设计更优的库表结构，或者添加更合适的索引。但是请尽可能的保持SQL语句的简洁，SQL语句变得很复杂的情况下，请相信我，维护会成为一个地狱。而带来的最终的收益微乎其微。

当然，虽然优化器已经很智能了，但是有时候也无法给出最优的结果。有时候你可能比优化器更了解数据，例如，由于应用逻辑使得某些条件总是成立﹔还有时，优化器缺少某种功能特性，如哈希索引﹔再如前面提到的，从优化器的执行成本角度评估出来的最优执行计划，实际运行中可能比其他的执行计划更慢。

如果能够确认优化器给出的不是最佳选择，并且清楚优化背后的原理，那么也可以帮助优化器做进一步的优化。

当出现不理想的SQL查询时，我们就需要知道查询优化器是如何工作的，以便有针对性的进行改进，不管是SQL语句本身还是表结构相关，比如索引。这个时候请仔细耐心的对慢查询进行分析。

### **查询执行引擎**

在解析和优化阶段，MySQL将生成查询对应的执行计划，MySQL的查询执行引擎则根据这个执行计划来完成整个查询。相对于查询优化阶段，查询执行阶段不是那么复杂：MySQL 只是简单地根据执行计划给出的指令逐步执行。

### **返回结果给客户端**

查询执行的最后一个阶段是将结果返回给客户端。即使查询不需要返回结果集给客户端，MySQL仍然会返回这个查询的一些信息，如该查询影响到的行数。

如果查询可以被缓存，那么MySQL在这个阶段也会将结果存放到查询缓存中。

MySQL将结果集返回客户端是一个增量、逐步返回的过程。一旦服务器开始生成第一条结果时，MySQL就可以开始向客户端逐步返回结果集了。

这一点从MySQL的源码sql_union.cc中其实可以看得很清楚：

![https://note.youdao.com/yws/public/resource/f1d34fba6f218de1acf9160f45c284af/xmlnote/E0E3BFBF0BD8486598DFA4087AC8ABB1/2169](/Users/jiusonghuang/pic-md/20211229225949.png)

这样处理有两个好处﹔服务器端无须存储太多的结果，也就不会因为要返回太多结果而消耗太多内存。另外，这样的处理也让 MySQL客户端第一时间获得返回的结果。结果集中的每一行都会以一个满足MySQL客户端/服务器通信协议的封包发送，再通过TCP协议进行传输，在TCP传输的过程中，可能对MySQL的封包进行缓存然后批量传输。

### **查询状态**

对于一个MySQL连接，或者说一个线程，任何时刻都有一个状态，该状态表示了MySQL当前正在做什么。在一个查询的生命周期中，状态会变化很多次。

### **通过show profile分析SQL**

通过上面的描述可知，当我们通过应用程序访问MySQL服务时，有时候性能不一定全部卡在语句的执行上。当然通过慢查询日志定位那些执行效率较低的SQL语句时候我们常用的手段，但是：

一、慢查询日志在查询结束以后才记录，在应用反映执行效率出现问题的时候查询未必执行完成；

二、有时候问题的产生不一定是语句的执行，有可能是其他原因导致的。慢查询日志并不能定位问题。

**show processlist**

这个时候通过**show processlist;**查看线程状态非常有用,这可以让我们很快地了解当前MySQL在进行的线程,包括线程的状态、是否锁表等，可以实时地查看SQL 的执行情况，同时对一些锁表操作进行优化。在一个繁忙的服务器上，可能会看到大量的不正常的状态，例如statistics正占用大量的时间。这通常表示，某个地方有异常了。线程常见的状态有很多，比如

statistics

The server is calculating statistics to develop a query execution plan. If a thread is in this state for a long time, the server is probably disk-bound performing other work.

服务器正在计算统计信息以研究一个查询执行计划。如果线程长时间处于此状态，则服务器可能是磁盘绑定执行其他工作。

Creating tmp table

The thread is creating a temporary table in memory or on disk. If the table is created in memory but later is converted to an on-disk table, the state during that operation is Copying to tmp table on disk.

该线程正在内存或磁盘上创建临时表。如果表在内存中创建但稍后转换为磁盘表，则该操作期间的状态将为 Copying to tmp table on disk 

Sending data

The thread is reading and processing rows for a SELECT statement, and sending data to the client. Because operations occurring during this state tend to perform large amounts of disk access (reads), it is often the longest-running state over the lifetime of a given query.

线程正在读取和处理 SELECT 语句的行，并将数据发送到客户端。由于在此状态期间发生的操作往往会执行大量磁盘访问（读取），因此它通常是给定查询生命周期中运行时间最长的状态。

其余的可以参考：

https://dev.mysql.com/doc/refman/8.0/en/general-thread-states.html

**通过show profile分析**

对于每个线程到底时间花在哪里，可以通过show profile来分析。

1、首先检查当前MySQL是否支持profile

**select @@have_profiling;**

   ![img](/Users/jiusonghuang/pic-md/20211229230018.png)

2、默认profiling是关闭的，可以通过set语句在 Session级别开启 profiling:

​	**select @@profiling**;

​	**set profiling=1**;

   ![img](/Users/jiusonghuang/pic-md/20211229230030.png)

3、执行一个SQL查询

**select count(\*) from order_exp;**

4、通过show profiles语句，看到当前SQL的Query ID

**show profiles;**

​    ![img](/Users/jiusonghuang/pic-md/20211229230050.png)

5、通过show profile for query语句能够看到执行过程中线程的每个状态和消耗的时间

**show profile for query 1;**

![img](/Users/jiusonghuang/pic-md/20211229230107.png)

通过仔细检查show profile for query 的输出，能够发现在执行COUNT(*)的过程中，时间主要消耗在 Sending data这个状态上。

6、在获取到最消耗时间的线程状态后，MySQL 支持进一步选择all、cpu、block io、contextswitch、page faults等明细类型来查看MySQL在使用什么资源上耗费了过高的时间:

**show profile all for query 1\G**

​    ![img](/Users/jiusonghuang/pic-md/20211229230124.png)

能够发现Sending data状态下，时间主要消耗在 CPU上了。

所以show profile能够在做SQL优化时帮助我们了解时间都耗费到哪里去了，同时如果MySQL源码感兴趣，还可以通过show profile source for query查看SQL解析执行过程中每个步骤对应的源码的文件、函数名以及具体的源文件行数。

# **11、Mysql执行原理之索引合并详解**

有道云链接：http://note.youdao.com/noteshare?id=b2dfb5a96ae8a8378ea6f11d07a27e0e&sub=EE7F74C223B1410DA902E1876C2E56A3

我们前边说过MySQL在一般情况下执行一个查询时最多只会用到单个二级索引，但存在有特殊情况，在这些特殊情况下也可能在一个查询中使用到多个二级索引，MySQL中这种使用到多个索引来完成一次查询的执行方法称之为：索引合并/index merge，在前面的成本计算中我们说到过这个概念：“我们需要分别分析单独使用这些索引执行查询的成本，最后还要分析是否可能使用到索引合并”。

其实optimizer trace输出的文本中就有这个片段：

   ![img](/Users/jiusonghuang/pic-md/20211229230831.png)

具体的索引合并算法有下边三种。

## **Intersection合并**

Intersection翻译过来的意思是交集。这里是说某个查询可以使用多个二级索引，将从多个二级索引中查询到的结果取交集，比方说下边这个查询：

```sql
SELECT * FROM order_exp WHERE order_no = 'a' AND expire_time = 'b';
```

假设这个查询使用Intersection合并的方式执行的话，那这个过程就是这样的：

从idx_order_no二级索引对应的B+树中取出order_no= 'a'的相关记录。

从idx_insert_time二级索引对应的B+树中取出insert_time= 'b'的相关记录。

二级索引的记录都是由索引列 + 主键构成的，所以我们可以计算出这两个结果集中id值的交集。

按照上一步生成的id值列表进行回表操作，也就是从聚簇索引中把指定id值的完整用户记录取出来，返回给用户。

为啥不直接使用idx_order_no或者idx_insert_time只根据某个搜索条件去读取一个二级索引，然后回表后再过滤另外一个搜索条件呢？这里要分析一下两种查询执行方式之间需要的成本代价。

### **只读取一个二级索引的成本：**

按照某个搜索条件读取一个二级索引，根据从该二级索引得到的主键值进行回表操作，然后再过滤其他的搜索条件

### **读取多个二级索引之后取交集成本：**

按照不同的搜索条件分别读取不同的二级索引，将从多个二级索引得到的主键值取交集，然后进行回表操作。

虽然读取多个二级索引比读取一个二级索引消耗性能，但是大部分情况下读取二级索引的操作是顺序I/O，而回表操作是随机I/O，所以如果只读取一个二级索引时需要回表的记录数特别多，而读取多个二级索引之后取交集的记录数非常少，当节省的因为回表而造成的性能损耗比访问多个二级索引带来的性能损耗更高时，读取多个二级索引后取交集比只读取一个二级索引的成本更低。

MySQL在某些特定的情况下才可能会使用到Intersection索引合并，哪些情况呢？

**情况一：等值匹配**

二级索引列是等值匹配的情况，对于联合索引来说，在联合索引中的每个列都必须等值匹配，不能出现只匹配部分列的情况。

而下边这两个查询就不能进行Intersection索引合并：

```sql
SELECT * FROM order_exp WHERE order_no> 'a' AND insert_time = 'a' AND order_status = 'b' AND expire_time = 'c';

SELECT * FROM order_exp WHERE order_no = 'a' AND insert_time = 'a';
```

第一个查询是因为对order_no进行了范围匹配，第二个查询是因为联合索引u_idx_day_status中的order_status和expire_time列并没有出现在搜索条件中，所以这两个查询不能进行Intersection索引合并。

**情况二：主键列可以是范围匹配**

比方说下边这个查询可能用到主键和u_idx_day_status进行Intersection索引合并的操作：

```sql
SELECT * FROM order_exp WHERE id > 100 AND insert_time = 'a';
```

对于InnoDB的二级索引来说，记录先是按照索引列进行排序，如果该二级索引是一个联合索引，那么会按照联合索引中的各个列依次排序。而二级索引的用户记录是由索引列 + 主键构成的，二级索引列的值相同的记录可能会有好多条，这些索引列的值相同的记录又是按照主键的值进行排序的。

所以重点来了，之所以在二级索引列都是等值匹配的情况下才可能使用Intersection索引合并，是因为只有在这种情况下根据二级索引查询出的结果集是按照主键值排序的。

Intersection索引合并会把从多个二级索引中查询出的主键值求交集，如果从各个二级索引中查询的到的结果集本身就是已经按照主键排好序的，那么求交集的过程就很容易。

假设某个查询使用Intersection索引合并的方式从idx_order_no和idx_expire_time这两个二级索引中获取到的主键值分别是：

从idx_order_no中获取到已经排好序的主键值：1、3、5

从idx_expire_time中获取到已经排好序的主键值：2、3、4

那么求交集的过程就是这样：逐个取出这两个结果集中最小的主键值，如果两个值相等，则加入最后的交集结果中，否则丢弃当前较小的主键值，再取该丢弃的主键值所在结果集的后一个主键值来比较，直到某个结果集中的主键值用完了，时间复杂度是O(n)。

但是如果从各个二级索引中查询出的结果集并不是按照主键排序的话，那就要先把结果集中的主键值排序完再来做上边的那个过程，就比较耗时了。

 按照有序的主键值去回表取记录有个专有名词，叫：Rowid Ordered Retrieval，简称**ROR**。

另外，不仅是多个二级索引之间可以采用Intersection索引合并，索引合并也可以有聚簇索引参加，也就是我们上边写的情况二：在搜索条件中有主键的范围匹配的情况下也可以使用Intersection索引合并索引合并。为啥主键这就可以范围匹配了？还是得回到应用场景里：

```sql
SELECT * FROM order_exp WHERE id > 100 AND order_no = 'a';
```

假设这个查询可以采用Intersection索引合并，我们理所当然的以为这个查询会分别按照id > 100这个条件从聚簇索引中获取一些记录，在通过order_no= 'a'这个条件从idx_order_no二级索引中获取一些记录，然后再求交集，其实这样就把问题复杂化了，没必要从聚簇索引中获取一次记录。别忘了二级索引的记录中都带有主键值的，所以可以在从idx_order_no中获取到的主键值上直接运用条件id > 100过滤就行了，这样多简单。所以涉及主键的搜索条件只不过是为了从别的二级索引得到的结果集中过滤记录罢了，是不是等值匹配不重要。

当然，上边说的情况一和情况二只是发生Intersection索引合并的必要条件，不是充分条件。也就是说即使情况一、情况二成立，也不一定发生Intersection索引合并，这得看优化器的心情。优化器只有在单独根据搜索条件从某个二级索引中获取的记录数太多，导致回表开销太大，而通过Intersection索引合并后需要回表的记录数大大减少时才会使用Intersection索引合并。

## **Union合并**

我们在写查询语句时经常想把既符合某个搜索条件的记录取出来，也把符合另外的某个搜索条件的记录取出来，我们说这些不同的搜索条件之间是OR关系。有时候OR关系的不同搜索条件会使用到不同的索引，比方说这样：

```sql
SELECT * FROM order_exp WHERE order_no = 'a' OR expire_time = 'b'
```

Intersection是交集的意思，这适用于使用不同索引的搜索条件之间使用AND连接起来的情况；Union是并集的意思，适用于使用不同索引的搜索条件之间使用OR连接起来的情况。与Intersection索引合并类似，MySQL在某些特定的情况下才可能会使用到Union索引合并：

**情况一：等值匹配**

分析同Intersection合并

**情况二：主键列可以是范围匹配**

分析同Intersection合并

**情况三：使用Intersection索引合并的搜索条件**

就是搜索条件的某些部分使用Intersection索引合并的方式得到的主键集合和其他方式得到的主键集合取交集，比方说这个查询：

```sql
SELECT * FROM order_exp WHERE insert_time = 'a' AND order_status = 'b' AND expire_time = 'c' OR (order_no = 'a' AND expire_time = 'b');
```

优化器可能采用这样的方式来执行这个查询：

先按照搜索条件order_no = 'a' AND expire_time = 'b'从索引idx_order_no和idx_expire_time中使用Intersection索引合并的方式得到一个主键集合。

再按照搜索条件 insert_time = 'a' AND order_status = 'b' AND expire_time = 'c'从联合索引u_idx_day_status中得到另一个主键集合。

采用Union索引合并的方式把上述两个主键集合取并集，然后进行回表操作，将结果返回给用户。

当然，查询条件符合了这些情况也不一定就会采用Union索引合并，也得看优化器的心情。优化器只有在单独根据搜索条件从某个二级索引中获取的记录数比较少，通过Union索引合并后进行访问的代价比全表扫描更小时才会使用Union索引合并。

## **Sort-Union合并**

Union索引合并的使用条件太苛刻，必须保证各个二级索引列在进行等值匹配的条件下才可能被用到，比方说下边这个查询就无法使用到Union索引合并：

```sql
SELECT * FROM order_exp WHERE order_no< 'a' OR expire_time> 'z'
```

这是因为根据order_no< 'a'从idx_order_no索引中获取的二级索引记录的主键值不是排好序的，根据expire_time> 'z'从idx_expire_time索引中获取的二级索引记录的主键值也不是排好序的，但是order_no< 'a'和expire_time> 'z''这两个条件又特别让我们动心，所以我们可以这样：

先根据order_no< 'a'条件从idx_order_no二级索引中获取记录，并按照记录的主键值进行排序

再根据expire_time> 'z'条件从idx_expire_time二级索引中获取记录，并按照记录的主键值进行排序

因为上述的两个二级索引主键值都是排好序的，剩下的操作和Union索引合并方式就一样了。

上述这种先按照二级索引记录的主键值进行排序，之后按照Union索引合并方式执行的方式称之为Sort-Union索引合并，很显然，这种Sort-Union索引合并比单纯的Union索引合并多了一步对二级索引记录的主键值排序的过程。

## **联合索引替代Intersection索引合并**

```sql
SELECT * FROM order_exp WHERE order_no= 'a' And expire_time= 'z';
```

这个查询之所以可能使用Intersection索引合并的方式执行，还不是因为idx_order_no和idx_expire_time是两个单独的B+树索引，要是把这两个列搞一个联合索引，那直接使用这个联合索引就把事情搞定了，何必用啥索引合并呢，就像这样：

```sql
ALTER TABLE order_exp drop index idx_order_no, idx_expire_time, 

add index idx_order_no_expire_time(order_no, expire_time);
```

这样我们把idx_order_no, idx_expire_time都干掉，再添加一个联合索引idx_order_no_expire_time，使用这个联合索引进行查询简直是又快又好，既不用多读一棵B+树，也不用合并结果。

# 12、**Mysql内核查询优化规则详解**

有道云链接：http://note.youdao.com/noteshare?id=fbd0885f891bbcc6033eaeab1b837fe0&sub=674C8D7C45774906B2EFE35A23B96157

在前面的课程中我们看到当我们把SQL语句交给MySQL执行后，MySQL在执行的过程中会有很多的优化措施，比如索引条件下推，回表中的MRR、索引合并等等。但是在执行之前，MySQL会依据一些规则，竭尽全力的把我们的SQL语句进行转换，以期可以达到成某种可以更高效执行的形式，这个过程也可以被称作查询重写或者查询优化，很多时候这些优化可以由我们自行完成以减少MySQL的优化时间。

## **条件化简**

我们编写的查询语句的搜索条件本质上是一个表达式，这些表达式可能比较繁杂，或者不能高效的执行，MySQL的查询优化器会为我们简化这些表达式。

### **移除不必要的括号**

有时候表达式里有许多无用的括号，比如这样：

((a = 5 AND b = c) OR ((a > c) AND (c < 5)))

优化器会把那些用不到的括号给干掉，就是这样：

(a = 5 and b = c) OR (a > c AND c < 5)

### **常量传递（constant_propagation）**

有时候某个表达式是某个列和某个常量做等值匹配，比如这样：

a = 5

当这个表达式和其他涉及列a的表达式使用AND连接起来时，可以将其他表达式中的a的值替换为5，比如这样：

a = 5 AND b > a

就可以被转换为：

a = 5 AND b > 5

等值传递（equality_propagation）

有时候多个列之间存在等值匹配的关系，比如这样：

a = b and b = c and c = 5

这个表达式可以被简化为：

a = 5 and b = 5 and c = 5

### **移除没用的条件（trivial_condition_removal）**

对于一些明显永远为TRUE或者FALSE的表达式，优化器会移除掉它们，比如这个表达式：

(a < 1 and b = b) OR (a = 6 OR 5 != 5)

很明显，b = b这个表达式永远为TRUE，5 != 5这个表达式永远为FALSE，所以简化后的表达式就是这样的：

(a < 1 and TRUE) OR (a = 6 OR FALSE)

可以继续被简化为

a < 1 OR a = 6

### **表达式计算**

在查询开始执行之前，如果表达式中只包含常量的话，它的值会被先计算出来，比如这个：

a = 5 + 1

因为5 + 1这个表达式只包含常量，所以就会被化简成：

a = 6

但是这里需要注意的是，如果某个列并不是以单独的形式作为表达式的操作数时，比如出现在函数中，出现在某个更复杂表达式中，就像这样：

ABS(a) > 5

或者：

-a < -8

优化器是不会尝试对这些表达式进行化简的。我们前边说过只有搜索条件中索引列和常数使用某些运算符连接起来才可能使用到索引，所以如果可以的话，最好让索引列以单独的形式出现在表达式中。

### **常量表检测**

MySQL觉得下边这种查询运行的特别快：

使用主键等值匹配或者唯一二级索引列等值匹配作为搜索条件来查询某个表。

MySQL觉得这两种查询花费的时间特别少，少到可以忽略，所以也把通过这两种方式查询的表称之为常量表（英文名：constant tables）。优化器在分析一个查询语句时，先首先执行常量表查询，然后把查询中涉及到该表的条件全部替换成常数，最后再分析其余表的查询成本，比方说这个查询语句：

```sql
SELECT * FROM table1 INNER JOIN table2 ON table1.column1 = table2.column2 WHERE table1.primary_key = 1;
```

很明显，这个查询可以使用主键和常量值的等值匹配来查询table1表，也就是在这个查询中table1表相当于常量表，在分析对table2表的查询成本之前，就会执行对table1表的查询，并把查询中涉及table1表的条件都替换掉，也就是上边的语句会被转换成这样：

SELECT table1表记录的各个字段的常量值, table2.* FROM table1 INNER JOIN table2 ON table1表column1列的常量值 = table2.column2;

## **外连接消除**

我们知道，内连接的驱动表和被驱动表的位置可以相互转换，而左（外）连接和右（外）连接的驱动表和被驱动表是固定的。这就导致内连接可能通过优化表的连接顺序来降低整体的查询成本，而外连接却无法优化表的连接顺序。

我们之前说过，外连接和内连接的本质区别就是：对于外连接的驱动表的记录来说，如果无法在被驱动表中找到匹配ON子句中的过滤条件的记录，那么该记录仍然会被加入到结果集中，对应的被驱动表记录的各个字段使用NULL值填充；而内连接的驱动表的记录如果无法在被驱动表中找到匹配ON子句中的过滤条件的记录，那么该记录会被舍弃。查询效果就是这样：

```sql
SELECT * FROM e1 INNER JOIN e2 ON e1.m1 = e2.m2;
```

   ![img](/Users/jiusonghuang/pic-md/20211229231447.png)

**SELECT \* FROM e1 LEFT JOIN e2 ON e1.m1 = e2.m2;**

​    ![img](/Users/jiusonghuang/pic-md/20211229231500.png)

对于上边例子中的（左）外连接来说，由于驱动表e1中m1=1, n1='a'的记录无法在被驱动表e2中找到符合ON子句条件e1.m1 = e2.m2的记录，所以就直接把这条记录加入到结果集，对应的e2表的m2和n2列的值都设置为NULL。

因为凡是不符合WHERE子句中条件的记录都不会参与连接。只要我们在搜索条件中指定关于被驱动表相关列的值不为NULL，那么外连接中在被驱动表中找不到符合ON子句条件的驱动表记录也就被排除出最后的结果集了，也就是说：在这种情况下：外连接和内连接也就没有什么区别了！比方说这个查询：

**SELECT \* FROM e1 LEFT JOIN e2 ON e1.m1 = e2.m2 WHERE e2.n2 IS NOT NULL;**    ![img](/Users/jiusonghuang/pic-md/20211229231516.png)

由于指定了被驱动表e2的n2列不允许为NULL，所以上边的e1和e2表的左（外）连接查询和内连接查询是一样的。当然，我们也可以不用显式的指定被驱动表的某个列IS NOT NULL，只要隐含的有这个意思就行了，比方说这样：

**SELECT \* FROM e1 LEFT JOIN e2 ON e1.m1 = e2.m2 WHERE e2.m2 = 2;**

在这个例子中，我们在WHERE子句中指定了被驱动表e2的m2列等于2，也就相当于间接的指定了m2列不为NULL值，所以上边的这个左（外）连接查询其实和下边这个内连接查询是等价的：

**SELECT \* FROM e1 INNER JOIN e2 ON e1.m1 = e2.m2 WHERE e2.m2 = 2;**

我们把这种在外连接查询中，指定的WHERE子句中包含被驱动表中的列不为NULL值的条件称之为空值拒绝（英文名：reject-NULL）。在被驱动表的WHERE子句符合空值拒绝的条件后，外连接和内连接可以相互转换。这种转换带来的好处就是查询优化器可以通过评估表的不同连接顺序的成本，选出成本最低的那种连接顺序来执行查询。

## **子查询MySQL内部优化规则**

### **子查询语法**

在一个查询语句A里的某个位置也可以有另一个查询语句B，这个出现在A语句的某个位置中的查询B就被称为子查询，A也被称之为外层查询。子查询可以在一个外层查询的各种位置出现，比如：

**SELECT子句中**

也就是我们平时说的查询列表中，比如这样：

**SELECT (SELECT m1 FROM e1 LIMIT 1);**

其中的(SELECT m1 FROM e1 LIMIT 1)就是子查询。

**FROM子句中**

比如：

**SELECT m, n FROM (SELECT m2 + 1 AS m, n2 AS n FROM e2 WHERE m2 > 2) AS t;**

这个例子中的子查询是：(SELECT m2 + 1 AS m, n2 AS n FROM e2 WHERE m2 > 2)，这里可以把子查询的查询结果当作是一个表，子查询后边的AS t表明这个子查询的结果就相当于一个名称为t的表，这个名叫t的表的列就是子查询结果中的列，比如例子中表t就有两个列：m列和n列。这个放在FROM子句中的子查询本质上相当于一个表，但又和我们平常使用的表有点儿不一样，MySQL把这种由子查询结果集组成的表称之为**派生表**。

**WHERE或ON子句中**

把子查询放在外层查询的WHERE子句或者ON子句中可能是我们最常用的一种使用子查询的方式了，比如这样：

**SELECT \* FROM e1 WHERE m1 IN (SELECT m2 FROM e2);**

这个查询表明我们想要将(SELECT m2 FROM e2)这个子查询的结果作为外层查询的IN语句参数，整个查询语句的意思就是我们想找e1表中的某些记录，这些记录的m1列的值能在e2表的m2列找到匹配的值。

**ORDER BY子句、GROUP BY子句中**

虽然语法支持，但没啥意义。

### **按返回的结果集区分子查询**

因为子查询本身也算是一个查询，所以可以按照它们返回的不同结果集类型而把这些子查询分为不同的类型：

### **标量子查询**

那些只返回一个单一值的子查询称之为标量子查询，比如这样：

SELECT (SELECT m1 FROM e1 LIMIT 1);

或者这样：

SELECT * FROM e1 WHERE m1 = (SELECT MIN(m2) FROM e2);

SELECT * FROM e1 WHERE m1 < (SELECT MIN(m2) FROM e2);

这两个查询语句中的子查询都返回一个单一的值，也就是一个标量。这些标量子查询可以作为一个单一值或者表达式的一部分出现在查询语句的各个地方。

### **行子查询**

顾名思义，就是返回一条记录的子查询，不过这条记录需要包含多个列（只包含一个列就成了标量子查询了）。比如这样：

SELECT * FROM e1 WHERE (m1, n1) = (SELECT m2, n2 FROM e2 LIMIT 1);

其中的(SELECT m2, n2 FROM e2 LIMIT 1)就是一个行子查询，整条语句的含义就是要从e1表中找一些记录，这些记录的m1和n1列分别等于子查询结果中的m2和n2列。

### **列子查询**

列子查询自然就是查询出一个列的数据，不过这个列的数据需要包含多条记录（只包含一条记录就成了标量子查询了）。比如这样：

SELECT * FROM e1 WHERE m1 IN (SELECT m2 FROM e2);

其中的(SELECT m2 FROM e2)就是一个列子查询，表明查询出e2表的m2列的值作为外层查询IN语句的参数。

### **表子查询**

顾名思义，就是子查询的结果既包含很多条记录，又包含很多个列，比如这样：

SELECT * FROM e1 WHERE (m1, n1) IN (SELECT m2, n2 FROM e2);

其中的(SELECT m2, n2 FROM e2)就是一个表子查询，这里需要和行子查询对比一下，行子查询中我们用了LIMIT 1来保证子查询的结果只有一条记录，表子查询中不需要这个限制。

## **按与外层查询关系来区分子查询**

### **不相关子查询**

如果子查询可以单独运行出结果，而不依赖于外层查询的值，我们就可以把这个子查询称之为不相关子查询。我们前边介绍的那些子查询全部都可以看作不相关子查询。

### **相关子查询**

如果子查询的执行需要依赖于外层查询的值，我们就可以把这个子查询称之为相关子查询。比如：

SELECT * FROM e1 WHERE m1 IN (SELECT m2 FROM e2 WHERE n1 = n2);

例子中的子查询是(SELECT m2 FROM e2 WHERE n1 = n2)，可是这个查询中有一个搜索条件是n1 = n2，别忘了n1是表e1的列，也就是外层查询的列，也就是说子查询的执行需要依赖于外层查询的值，所以这个子查询就是一个相关子查询。

### **[NOT] IN/ANY/SOME/ALL子查询**

对于列子查询和表子查询来说，它们的结果集中包含很多条记录，这些记录相当于是一个集合，所以就不能单纯的和另外一个操作数使用操作符来组成布尔表达式了，MySQL通过下面的语法来支持某个操作数和一个集合组成一个布尔表达式：

### **IN或者NOT IN**

具体的语法形式如下：

操作数 [NOT] IN (子查询)

这个布尔表达式的意思是用来判断某个操作数在不在由子查询结果集组成的集合中，比如下边的查询的意思是找出e1表中的某些记录，这些记录存在于子查询的结果集中：

SELECT * FROM e1 WHERE (m1, n1) IN (SELECT m2, n2 FROM e2);

### **ANY/SOME（ANY和SOME是同义词）**

具体的语法形式如下：

操作数 比较符 ANY/SOME(子查询)

这个布尔表达式的意思是只要子查询结果集中存在某个值和给定的操作数做比较操作，比较结果为TRUE，那么整个表达式的结果就为TRUE，否则整个表达式的结果就为FALSE。比方说下边这个查询：

SELECT * FROM e1 WHERE m1 > ANY(SELECT m2 FROM e2);

这个查询的意思就是对于e1表的某条记录的m1列的值来说，如果子查询(SELECT m2 FROM e2)的结果集中存在一个小于m1列的值，那么整个布尔表达式的值就是TRUE，否则为FALSE，也就是说只要m1列的值大于子查询结果集中最小的值，整个表达式的结果就是TRUE，所以上边的查询本质上等价于这个查询：

SELECT * FROM e1 WHERE m1 > (SELECT MIN(m2) FROM e2);

另外，=ANY相当于判断子查询结果集中是否存在某个值和给定的操作数相等，它的含义和IN是相同的。

### **ALL**

具体的语法形式如下：

操作数 比较操作 ALL(子查询)

这个布尔表达式的意思是子查询结果集中所有的值和给定的操作数做比较操作比较结果为TRUE，那么整个表达式的结果就为TRUE，否则整个表达式的结果就为FALSE。比方说下边这个查询：

SELECT * FROM e1 WHERE m1 > ALL(SELECT m2 FROM e2);

这个查询的意思就是对于e1表的某条记录的m1列的值来说，如果子查询(SELECT m2 FROM e2)的结果集中的所有值都小于m1列的值，那么整个布尔表达式的值就是TRUE，否则为FALSE，也就是说只要m1列的值大于子查询结果集中最大的值，整个表达式的结果就是TRUE，所以上边的查询本质上等价于这个查询：

SELECT * FROM e1 WHERE m1 > (SELECT MAX(m2) FROM e2);

### **EXISTS子查询**

有的时候我们仅仅需要判断子查询的结果集中是否有记录，而不在乎它的记录具体是个啥，可以使用把EXISTS或者NOT EXISTS放在子查询语句前边，就像这样：

SELECT * FROM e1 WHERE EXISTS (SELECT 1 FROM e2);

对于子查询(SELECT 1 FROM e2)来说，我们并不关心这个子查询最后到底查询出的结果是什么，所以查询列表里填*、某个列名，或者其他啥东西都无所谓，我们真正关心的是子查询的结果集中是否存在记录。也就是说只要(SELECT 1 FROM e2)这个查询中有记录，那么整个EXISTS表达式的结果就为TRUE。

### **子查询语法注意事项**

子查询必须用小括号扩起来。

在SELECT子句中的子查询必须是标量子查询，如果子查询结果集中有多个列或者多个行，都不允许放在SELECT子句中，在想要得到标量子查询或者行子查询，但又不能保证子查询的结果集只有一条记录时，应该使用LIMIT 1语句来限制记录数量。

对于[NOT] IN/ANY/SOME/ALL子查询来说，子查询中不允许有LIMIT语句，而且这类子查询中ORDER BY子句、DISTINCT语句、没有聚集函数以及HAVING子句的GROUP BY子句没有什么意义。因为子查询的结果其实就相当于一个集合，集合里的值排不排序等一点儿都不重要。

不允许在一条语句中增删改某个表的记录时同时还对该表进行子查询。

## **子查询在MySQL中是怎么执行的**

### **想象子查询的执行方式**

想象中子查询的执行方式是这样的：

如果该子查询是不相关子查询，比如下边这个查询：

SELECT * FROM s1 WHERE order_note IN (SELECT order_note FROM s2);

先单独执行(SELECT order_note FROM s2)这个子查询。然后在将上一步子查询得到的结果当作外层查询的参数再执行外层查询SELECT * FROM s1 WHERE order_note IN (...)。

如果该子查询是相关子查询，比如下边这个查询：

SELECT * FROM s1 WHERE order_note IN (SELECT order_note FROM s2 WHERE s1.order_no= s2.order_no);

这个查询中的子查询中出现了s1.order_no= s2.order_no这样的条件，意味着该子查询的执行依赖着外层查询的值，先从外层查询中获取一条记录，本例中也就是先从s1表中获取一条记录，然后执行子查询。

最后根据子查询的查询结果来检测外层查询WHERE子句的条件是否成立，如果成立，就把外层查询的那条记录加入到结果集，否则就丢弃。

再次执行第一步，获取第二条外层查询中的记录，依次类推。

但真的是这样吗？其实MySQL用了一系列的办法来优化子查询的执行，下边我们来看看各种不同类型的子查询具体是怎么执行的。

### **标量子查询、行子查询的执行方式**

对于**不相关标量子查询或者行子查询**来说，它们的执行方式很简单，比方说下边这个查询语句：

SELECT * FROM s1 WHERE order_note = (SELECT order_note FROM s2 WHERE key3 = 'a' LIMIT 1);

它的执行方式和我们前面想象的一样：先单独执行(SELECT order_note FROM s2 WHERE key3 = 'a' LIMIT 1)这个子查询。然后在将上一步子查询得到的结果当作外层查询的参数再执行外层查询SELECT * FROM s1 WHERE order_note= ...。

也就是说，对于包含不相关的标量子查询或者行子查询的查询语句来说，MySQL会分别独立的执行外层查询和子查询，就当作两个单表查询就好了。

对于**相关的标量子查询或者行子查询**来说，比如下边这个查询：

SELECT * FROM s1 WHERE 

​    order_note = (SELECT order_note FROM s2 WHERE s1.order_no= s2.order_no LIMIT 1);

事情也和我们前面想象的一样，它的执行方式就是这样的：

先从外层查询中获取一条记录，本例中也就是先从s1表中获取一条记录。

然后从上一步骤中获取的那条记录中找出子查询中涉及到的值，本例中就是从s1表中获取的那条记录中找出s1.order_no列的值，然后执行子查询。

最后根据子查询的查询结果来检测外层查询WHERE子句的条件是否成立，如果成立，就把外层查询的那条记录加入到结果集，否则就丢弃。

再次执行第一步，获取第二条外层查询中的记录，依次类推。

也就是说对于两种使用标量子查询以及行子查询的场景中，MySQL优化器的执行方式并没有什么新鲜的。

## **MySQL对IN子查询的优化**

### **物化表**

对于不相关的IN子查询，比如这样：

SELECT * FROM s1 WHERE order_note IN (SELECT order_note FROM s2 WHERE order_no = 'a');

我们最开始的感觉就是这种不相关的IN子查询和不相关的标量子查询或者行子查询是一样一样的，都是把外层查询和子查询当作两个独立的单表查询来对待。但是MySQL为了优化IN子查询下了很大力气，所以整个执行过程并不像我们想象的那么简单。

对于不相关的IN子查询来说，如果子查询的结果集中的记录条数很少，那么把子查询和外层查询分别看成两个单独的单表查询效率很高，但是如果单独执行子查询后的结果集太多的话，就会导致这些问题：

1、结果集太多，可能内存中都放不下。

2、对于外层查询来说，如果子查询的结果集太多，那就意味着IN子句中的参数特别多，这就导致：无法有效的使用索引，只能对外层查询进行全表扫描。

在对外层查询执行全表扫描时，由于IN子句中的参数太多，这会导致检测一条记录是否符合和IN子句中的参数匹配花费的时间太长。

比如说IN子句中的参数只有两个：

SELECT * FROM tbl_name WHERE column IN (a, b);

这样相当于需要对tbl_name表中的每条记录判断一下它的column列是否符合column = a OR column = b。在IN子句中的参数比较少时这并不是什么问题，如果IN子句中的参数比较多时，比如这样：

SELECT * FROM tbl_name WHERE column IN (a, b, c ..., ...);

那么这样每条记录需要判断一下它的column列是否符合column = a OR column = b OR column = c OR ...，这样性能耗费可就多了。

MySQL的改进是不直接将不相关子查询的结果集当作外层查询的参数，而是将该结果集写入一个临时表里。写入临时表的过程是这样的：

1、该临时表的列就是子查询结果集中的列。

2、写入临时表的记录会被去重，临时表也是个表，只要为表中记录的所有列建立主键或者唯一索引。

一般情况下子查询结果集不会大的离谱，所以会为它建立基于内存的使用Memory存储引擎的临时表，而且会为该表建立哈希索引。

如果子查询的结果集非常大，超过了系统变量tmp_table_size或者max_heap_table_size，临时表会转而使用基于磁盘的存储引擎来保存结果集中的记录，索引类型也对应转变为B+树索引。

MySQL把这个将子查询结果集中的记录保存到临时表的过程称之为**物化**（英文名：Materialize）。为了方便起见，我们就把那个存储子查询结果集的临时表称之为物化表。正因为物化表中的记录都建立了索引（基于内存的物化表有哈希索引，基于磁盘的有B+树索引），通过索引执行IN语句判断某个操作数在不在子查询结果集中变得非常快，从而提升了子查询语句的性能。

### **物化表转连接**

事情到这就完了？我们还得重新审视一下最开始的那个查询语句：

SELECT * FROM s1 WHERE order_note IN (SELECT order_note FROM s2 WHERE order_no = 'a');

当我们把子查询进行物化之后，假设子查询物化表的名称为materialized_table，该物化表存储的子查询结果集的列为m_val，那么这个查询

就相当于表s1和子查询物化表materialized_table进行内连接：

SELECT s1.* FROM s1 INNER JOIN materialized_table ON order_note = m_val;

转化成内连接之后就有意思了，查询优化器可以评估不同连接顺序需要的成本是多少，选取成本最低的那种查询方式执行查询。我们分析一下上述查询中使用外层查询的表s1和物化表materialized_table进行内连接的成本都是由哪几部分组成的：

1、如果使用s1表作为驱动表的话，总查询成本由下边几个部分组成：

物化子查询时需要的成本

扫描s1表时的成本

s1表中的记录数量 × 通过m_val = xxx对materialized_table表进行单表访问的成本（我们前边说过物化表中的记录是不重复的，并且为物化表中的列建立了索引，所以这个步骤显然是非常快的）。

2、如果使用materialized_table表作为驱动表的话，总查询成本由下边几个部分组成：

物化子查询时需要的成本

扫描物化表时的成本

物化表中的记录数量 × 通过order_note= xxx对s1表进行单表访问的成本（如果order_note列上建立了索引，这个步骤还是非常快的）。

MySQL查询优化器会通过运算来选择上述成本更低的方案来执行查询。

### **将子查询转换为semi-join**

将子查询进行物化之后再执行查询都会有建立临时表的成本，能不能不进行物化操作直接把子查询转换为连接呢？让我们重新审视一下上边的查询语句：

SELECT * FROM s1 WHERE order_note IN (SELECT order_note FROM s2 WHERE order_no = 'a');

我们可以把这个查询理解成：对于s1表中的某条记录，如果我们能在s2表（准确的说是执行完WHERE s2.order_no= 'a'之后的结果集）中找到一条或多条记录，这些记录的order_note的值等于s1表记录的order_note列的值，那么该条s1表的记录就会被加入到最终的结果集。这个过程其实和把s1和s2两个表连接起来的效果很像：

SELECT s1.* FROM s1 INNER JOIN s2 

​    ON s1.order_note = s2.order_note 

​    WHERE s2.order_no= 'a';

只不过我们不能保证对于s1表的某条记录来说，在s2表（准确的说是执行完WHERE s2.order_no= 'a'之后的结果集）中有多少条记录满足s1.order_no = s2.order_no这个条件，不过我们可以分三种情况讨论：

情况一：对于s1表的某条记录来说，s2表中没有任何记录满足s1.order_note = s2.order_note 这个条件，那么该记录自然也不会加入到最后的结果集。

情况二：对于s1表的某条记录来说，s2表中有且只有1条记录满足s1.order_note = s2.order_note 这个条件，那么该记录会被加入最终的结果集。

情况三：对于s1表的某条记录来说，s2表中至少有2条记录满足s1.order_note = s2.order_note 这个条件，那么该记录会被多次加入最终的结果集。

对于s1表的某条记录来说，由于我们只关心s2表中是否存在记录满足s1.order_no = s2.order_note这个条件，而不关心具体有多少条记录与之匹配，又因为有情况三的存在，我们上边所说的IN子查询和两表连接之间并不完全等价。但是将子查询转换为连接又真的可以充分发挥优化器的作用，所以MySQL在这里提出了一个新概念 --- **半连接**（英文名：semi-join）。

将s1表和s2表进行半连接的意思就是：对于s1表的某条记录来说，我们只关心在s2表中是否存在与之匹配的记录，而不关心具体有多少条记录与之匹配，最终的结果集中只保留s1表的记录。为了让大家有更直观的感受，我们假设MySQL内部是这么改写上边的子查询的：

SELECT s1.* FROM s1 **SEMI JOIN** s2

​    ON s1.order_note = s2.order_note 

​    WHERE order_no= 'a';

注意： semi-join只是在MySQL内部采用的一种执行子查询的方式，MySQL并没有提供面向用户的semi-join语法。

**semi-join实例**

现在有三个表：商品表goods、订单表goods_order、订单详情表goods_order_detail。三个表中的数据有两种方式导入：

1、执行goods_stru.sql、goods_order_stru.sql、goods_order_detail_stru.sql建立原始表，然后执行存储过程create_goods产生原始数据，再执行存储过程randon_detail进行数据更新；

2、执行SQL脚本goods_all.sql、 goods_order_all.sql、 goods_order_detail_all.sql，同时导入表结构和数据。

三个表目前都没有索引：

​    ![img](/Users/jiusonghuang/pic-md/20211229231610.png)

​    ![img](/Users/jiusonghuang/pic-md/20211229231624.png)    !

![img](/Users/jiusonghuang/pic-md/20211229231641.png)

三个表目前的记录数如下：

​    ![img](/Users/jiusonghuang/pic-md/20211229231705.png)

现在有这么个业务场景：查找包含赠送商品且赠送商品编号是666的订单

select o.* from goods_order o where o.id in(select order_id from goods_order_detail od where od.goods_id=666 and od.price=0);

我们查看下MySQL对这个查询语句的改写：

mysql> show warnings;

/* select#1 */ select `mysqladv`.`o`.`id` AS `id`,`mysqladv`.`o`.`order_no` AS `order_no` from `mysqladv`.`goods_order` `o` semi join (`mysqladv`.`goods_order_detail` `od`) where ((`mysqladv`.`o`.`id` = ``.`order_id`) and (`mysqladv`.`od`.`price` = 0) and (`mysqladv`.`od`.`goods_id` = 666)) ![img](/Users/jiusonghuang/pic-md/20211229231723.png)

可以看到MySQL将这个子查询改造为了半连接semi join。

## **半连接的实现方法概述**

怎么实现这种所谓的半连接呢？MySQL准备了好几种办法，比如Table pullout （子查询中的表上拉）、DuplicateWeedout execution strategy （重复值消除）、LooseScan execution strategy （松散扫描）、Semi-join Materializationa半连接物化、FirstMatch execution strategy （首次匹配）等等。

### **Table pullout （子查询中的表上拉）**

当子查询的查询列表处只有主键或者唯一索引列时，可以直接把子查询中的表上拉到外层查询的FROM子句中，并把子查询中的搜索条件合并到外层查询的搜索条件中，比如假设s2中存在这个一个key2列，列上有唯一性索引：

SELECT * FROM s1 

​    WHERE key2 IN (SELECT key2 FROM s2 WHERE key3 = 'a');

由于key2列是s2表的一个唯一性二级索引列，所以我们可以直接把s2表上拉到外层查询的FROM子句中，并且把子查询中的搜索条件合并到外层查询的搜索条件中，上拉之后的查询就是这样的：

SELECT s1.* FROM s1 INNER JOIN s2 

​    ON s1.key2 = s2.key2 

​    WHERE s2.key3 = 'a';

为啥当子查询的查询列表处只有主键或者唯一索引列时，就可以直接将子查询转换为连接查询呢？因为主键或者唯一索引列中的数据本身就是不重复的嘛！所以对于同一条s1表中的记录，你不可能找到两条以上的符合s1.key2 = s2.key2的记录。

至于其他的，重复值消除、松散扫描等等我们就不更深入的讨论了，感兴趣的同学可以自行研究。

### **不能转为semi-join查询的子查询优化**

注意，并不是所有包含IN子查询的查询语句都可以转换为semi-join，对于不能转换的，MySQL有这几种方法：

1、对于不相关子查询来说，会尝试把它们物化之后再参与查询

比如我们上边提到的这个查询：

SELECT * FROM s1 WHERE order_note NOT IN (SELECT order_note FROM s2 WHERE order_no= 'a')

先将子查询物化，然后再判断order_note是否在物化表的结果集中可以加快查询执行的速度。

2、不管子查询是相关的还是不相关的，都可以把IN子查询尝试转为EXISTS子查询

其实对于任意一个IN子查询来说，都可以被转为EXISTS子查询，通用的例子如下：

outer_expr IN (SELECT inner_expr FROM ... WHERE subquery_where)

可以被转换为：

EXISTS (SELECT inner_expr FROM ... WHERE subquery_where AND outer_expr=inner_expr)

为啥要转换呢？这是因为不转换的话可能用不到索引，比方说下边这个查询：

SELECT * FROM s1  WHERE order_no IN (SELECT order_no FROM s2 where s1.order_note = s2.order_note) OR insert_time > ‘2021-03-22 18:28:28’;

这个查询中的子查询是一个相关子查询，而且子查询执行的时候不能使用到索引，但是将它转为EXISTS子查询后却可以使用到索引：

SELECT * FROM s1 WHERE EXISTS (SELECT 1 FROM s2 where s1.order_note = s2.order_note AND s2.order_no= s1.order_no) OR insert_time > ‘2021-03-22 18:28:28’;

转为EXISTS子查询时便可能使用到s2表的idx_order_no索引了。

所以如果执行 

EXPLAIN SELECT * FROM s1  WHERE order_no IN (SELECT order_no FROM s2 where s1.order_note = s2.order_note) OR insert_time > '2021-03-22 18:28:28';

show WARNINGS;

可以看见，MySQL确实把这个子查询转换为了exists子查询    ![img](/Users/jiusonghuang/pic-md/20211229231752.png)

需要注意的是，如果IN子查询不满足转换为semi-join的条件，又不能转换为物化表或者转换为物化表的成本太大，那么它就会被转换为EXISTS查询。

在MySQL5.5以及之前的版本没有引进semi-join和物化的方式优化子查询时，优化器都会把IN子查询转换为EXISTS子查询，所以很多技术书籍或者博客都是建议大家把子查询转为连接，不过随着MySQL的发展，最近的版本中引入了非常多的子查询优化策略，内部的转换工作优化器会为大家自动实现。

### **IN子查询小结**

如果IN子查询符合转换为semi-join的条件，查询优化器会优先把该子查询转换为semi-join，然后从前面所说的5种执行半连接的策略（既子查询中的表上拉、重复值消除等等）中选择成本最低的那种执行策略来执行子查询。

如果IN子查询不符合转换为semi-join的条件，那么查询优化器会从下边两种策略中找出一种成本更低的方式执行子查询：

先将子查询物化之后再执行查询

执行IN to EXISTS转换。

### **ANY/ALL子查询优化**

如果ANY/ALL子查询是不相关子查询的话，它们在很多场合都能转换成我们熟悉的方式去执行，比方说：

原始表达式	转换为

< ANY (SELECT inner_expr ...)	< (SELECT MAX(inner_expr) ...)

\> ANY (SELECT inner_expr ...)	> (SELECT MIN(inner_expr) ...)

< ALL (SELECT inner_expr ...)	< (SELECT MIN(inner_expr) ...)

\> ALL (SELECT inner_expr ...)	> (SELECT MAX(inner_expr) ...)

### **[NOT] EXISTS子查询的执行**

如果[NOT] EXISTS子查询是不相关子查询，可以先执行子查询，得出该[NOT] EXISTS子查询的结果是TRUE还是FALSE，并重写原先的查询语句，比如对这个查询来说：

SELECT * FROM s1 WHERE EXISTS (SELECT 1 FROM s2 WHERE expire_time= 'a')        OR order_no> ‘2021-03-22 18:28:28’0;

因为这个语句里的子查询是不相关子查询，所以优化器会首先执行该子查询，假设该EXISTS子查询的结果为TRUE，那么接着优化器会重写查询为：

SELECT * FROM s1 WHERE TRUE OR  order_no> ‘2021-03-22 18:28:28’0;

进一步简化后就变成了：

SELECT * FROM s1 WHERE TRUE;

对于相关的[NOT] EXISTS子查询来说，比如这个查询：

SELECT * FROM s1  WHERE EXISTS (SELECT 1 FROM s2 WHERE s1.order_note = s2.order_note);

很不幸，这个查询只能按照我们想象中的那种执行相关子查询的方式来执行。不过如果[NOT] EXISTS子查询中如果可以使用索引的话，那查询速度也会加快不少，比如：SELECT * FROM s1 WHERE EXISTS (SELECT 1 FROM s2 WHERE s1.order_note = s2.order_no);

上边这个EXISTS子查询中可以使用idx_order_no来加快查询速度。

# **13、InnoDB引擎底层存储和缓存原理**

有道云链接：http://note.youdao.com/noteshare?id=92b91d9f92729187e257226a8aa8fc7f&sub=2AB59938EC1D42C187588B54A136C433

到目前为止，MySQL对于我们来说还是一个黑盒，我们只负责使用客户端发送请求并等待服务器返回结果，表中的数据到底存到了哪里？以什么格式存放的？MySQL是以什么方式来访问的这些数据？这些问题我们统统不知道。要搞明白查询优化背后的原理，就必须深入MySQL的底层去一探究竟，而且事务、锁等的原理也要求我们必须深入底层。

## **InnoDB记录存储结构和索引页结构**

InnoDB是一个将表中的数据存储到磁盘上的存储引擎，所以即使关机后重启我们的数据还是存在的。而真正处理数据的过程是发生在内存中的，所以需要把磁盘中的数据加载到内存中，如果是处理写入或修改请求的话，还需要把内存中的内容刷新到磁盘上。而我们知道读写磁盘的速度非常慢，和内存读写差了几个数量级，所以当我们想从表中获取某些记录时，InnoDB存储引擎需要一条一条的把记录从磁盘上读出来么？

InnoDB采取的方式是：将数据划分为若干个页，以页作为磁盘和内存之间交互的基本单位，InnoDB中页的大小一般为 16 KB。也就是在一般情况下，一次最少从磁盘中读取16KB的内容到内存中，一次最少把内存中的16KB内容刷新到磁盘中。

我们平时是以记录为单位来向表中插入数据的，这些记录在磁盘上的存放方式也被称为行格式或者记录格式。InnoDB存储引擎设计了4种不同类型的行格式，分别是Compact、Redundant、Dynamic和Compressed行格式。

### **行格式**

我们可以在创建或修改表的语句中指定行格式：

CREATE TABLE 表名 (列的信息) ROW_FORMAT=行格式名称

### **COMPACT**

​    ![img](/Users/jiusonghuang/pic-md/20211229232309.png)

我们知道MySQL支持一些变长的数据类型，比如VARCHAR(M)、VARBINARY(M)、各种TEXT类型，各种BLOB类型，我们也可以把拥有这些数据类型的列称为变长字段，变长字段中存储多少字节的数据是不固定的，所以我们在存储真实数据的时候需要顺便把这些数据占用的字节数也存起来。如果该可变字段允许存储的最大字节数超过255字节并且真实存储的字节数超过127字节，则使用2个字节，否则使用1个字节。

表中的某些列可能存储NULL值，如果把这些NULL值都放到记录的真实数据中存储会很占地方，所以Compact行格式把这些值为NULL的列统一管理起来，存储到NULL值列表。每个允许存储NULL的列对应一个二进制位，二进制位的值为1时，代表该列的值为NULL。二进制位的值为0时，代表该列的值不为NULL。

还有一个用于描述记录的记录头信息，它是由固定的5个字节组成。5个字节也就是40个二进制位，不同的位代表不同的意思。

预留位1	1	没有使用

预留位2	1	没有使用

delete_mask	1	标记该记录是否被删除

min_rec_mask	1	B+树的每层非叶子节点中的最小记录都会添加该标记

n_owned	4	表示当前记录拥有的记录数

heap_no	13	表示当前记录在页的位置信息

record_type	3	表示当前记录的类型，0表示普通记录，1表示B+树非叶子节点记录，2表示最小记录，3表示最大记录

next_record	16	表示下一条记录的相对位置

​    ![img](/Users/jiusonghuang/pic-md/20211229232325.png)

记录的真实数据除了我们自己定义的列的数据以外，MySQL会为每个记录默认的添加一些列（也称为隐藏列），包括：

DB_ROW_ID(row_id)：非必须，6字节，表示行ID，唯一标识一条记录

DB_TRX_ID：必须，6字节，表示事务ID

DB_ROLL_PTR：必须，7字节，表示回滚指针

InnoDB表对主键的生成策略是：优先使用用户自定义主键作为主键，如果用户没有定义主键，则选取一个Unique键作为主键，如果表中连Unique键都没有定义的话，则InnoDB会为表默认添加一个名为row_id的隐藏列作为主键。 DB_TRX_ID（也可以称为trx_id） 和 DB_ROLL_PTR（也可以称为roll_ptr） 这两个列是必有的，但是 row_id 是可选的（在没有自定义主键以及Unique键的情况下才会添加该列）。

其他的行格式和Compact行格式差别不大。

### **Redundant行格式**

Redundant行格式是MySQL5.0之前用的一种行格式，不予深究。

### **Dynamic和Compressed行格式**

MySQL5.7的默认行格式就是Dynamic，Dynamic和Compressed行格式和Compact行格式挺像，只不过在处理行溢出数据时有所不同。Compressed行格式和Dynamic不同的一点是，Compressed行格式会采用压缩算法对页面进行压缩，以节省空间。

### **数据溢出**

如果我们定义一个表，表中只有一个VARCHAR字段，如下：

CREATE TABLE test_varchar( c VARCHAR(60000) )

然后往这个字段插入60000个字符，会发生什么？

前边说过，MySQL中磁盘和内存交互的基本单位是页，也就是说MySQL是以页为基本单位来管理存储空间的，我们的记录都会被分配到某个页中存储。而一个页的大小一般是16KB，也就是16384字节，而一个VARCHAR(M)类型的列就最多可以存储65532个字节，这样就可能造成一个页存放不了一条记录的情况。

在Compact和Redundant行格式中，对于占用存储空间非常大的列，在记录的真实数据处只会存储该列的该列的前768个字节的数据，然后把剩余的数据分散存储在几个其他的页中，记录的真实数据处用20个字节存储指向这些页的地址。这个过程也叫做行溢出，存储超出768字节的那些页面也被称为溢出页。

Dynamic和Compressed行格式，不会在记录的真实数据处存储字段真实数据的前768个字节，而是把所有的字节都存储到其他页面中，只在记录的真实数据处存储其他页面的地址。

## **索引页格式**

前边我们简单提了一下页的概念，它是InnoDB管理存储空间的基本单位，一个页的大小一般是16KB。

InnoDB为了不同的目的而设计了许多种不同类型的页，存放我们表中记录的那种类型的页自然也是其中的一员，官方称这种存放记录的页为索引（INDEX）页，不过要理解成数据页也没问题，毕竟存在着聚簇索引这种索引和数据混合的东西。

  ![img](/Users/jiusonghuang/pic-md/20211229232345.png)

一个InnoDB数据页的存储空间大致被划分成了7个部分：

File Header	文件头部	38字节	页的一些通用信息

Page Header	页面头部	56字节	数据页专有的一些信息

Infimum + Supremum	最小记录和最大记录	26字节	两个虚拟的行记录

User Records	用户记录	大小不确定	实际存储的行记录内容

Free Space	空闲空间	大小不确定	页中尚未使用的空间

Page Directory	页面目录	大小不确定	页中的某些记录的相对位置

File Trailer	文件尾部	8字节	校验页是否完整

### **User Records**

我们自己存储的记录会按照我们指定的行格式存储到User Records部分。但是在一开始生成页的时候，其实并没有User Records这个部分，每当我们插入一条记录，都会从Free Space部分，也就是尚未使用的存储空间中申请一个记录大小的空间划分到User Records部分，当Free Space部分的空间全部被User Records部分替代掉之后，也就意味着这个页使用完了，如果还有新的记录插入的话，就需要去申请新的页了。

当前记录被删除时，则会修改记录头信息中的delete_mask为1，也就是说被删除的记录还在页中，还在真实的磁盘上。这些被删除的记录之所以不立即从磁盘上移除，是因为移除它们之后把其他的记录在磁盘上重新排列需要性能消耗。

所以只是打一个删除标记而已，所有被删除掉的记录都会组成一个所谓的垃圾链表，在这个链表中的记录占用的空间称之为所谓的可重用空间，之后如果有新记录插入到表中的话，可能把这些被删除的记录占用的存储空间覆盖掉。

同时我们插入的记录在会记录自己在本页中的位置，写入了记录头信息中heap_no部分。heap_no值为0和1的记录是InnoDB自动给每个页增加的两个记录，称为伪记录或者虚拟记录。这两个伪记录一个代表最小记录，一个代表最大记录，这两条存放在页的User Records部分，他们被单独放在一个称为Infimum + Supremum的部分。

记录头信息中next_record记录了从当前记录的真实数据到下一条记录的真实数据的地址偏移量。这其实是个链表，可以通过一条记录找到它的下一条记录。但是需要注意注意再注意的一点是，下一条记录指得并不是按照我们插入顺序的下一条记录，而是按照主键值由小到大的顺序的下一条记录。而且规定 Infimum记录（也就是最小记录） 的下一条记录就是本页中主键值最小的用户记录，而本页中主键值最大的用户记录的下一条记录就是 Supremum记录（也就是最大记录）    ![img](/Users/jiusonghuang/pic-md/20211229232403.png)

我们的记录按照主键从小到大的顺序形成了一个单链表，记录被删除，则从这个链表上摘除。

### **Page Directory**

Page Directory主要是解决记录链表的查找问题。如果我们想根据主键值查找页中的某条记录该咋办？按链表查找的办法：从Infimum记录（最小记录）开始，沿着链表一直往后找，总会找到或者找不到。但是时间复杂度不低。

InnoDB的改进是，为页中的记录再制作了一个目录，他们的制作过程是这样的：

1、将所有正常的记录（包括最大和最小记录，不包括标记为已删除的记录）划分为几个组。

2、每个组的最后一条记录（也就是组内最大的那条记录）的头信息中的n_owned属性表示该记录拥有多少条记录，也就是该组内共有几条记录。

3、将每个组的最后一条记录的地址偏移量单独提取出来按顺序存储到靠近页的尾部的地方，这个地方就是所谓的Page Directory，也就是页目录页面目录中的这些地址偏移量被称为槽（英文名：Slot），所以这个页面目录就是由槽组成的。    ![img](/Users/jiusonghuang/pic-md/20211229232424.png)

4、每个分组中的记录条数是有规定的：对于最小记录所在的分组只能有 1 条记录，最大记录所在的分组拥有的记录条数只能在 1~8 条之间，剩下的分组中记录的条数范围只能在是 4~8 条之间。如下图：![img](/Users/jiusonghuang/pic-md/20211229232446.png)

这样，一个数据页中查找指定主键值的记录的过程分为两步：

通过二分法确定该记录所在的槽，并找到该槽所在分组中主键值最小的那条记录。

通过记录的next_record属性遍历该槽所在的组中的各个记录。

### **Page Header**

InnoDB为了能得到一个数据页中存储的记录的状态信息，比如本页中已经存储了多少条记录，第一条记录的地址是什么，页目录中存储了多少个槽等等，特意在页中定义了一个叫Page Header的部分，它是页结构的第二部分，这个部分占用固定的56个字节，专门存储各种状态信息。

### **File Header**

File Header针对各种类型的页都通用，也就是说不同类型的页都会以File Header作为第一个组成部分，它描述了一些针对各种页都通用的一些信息，比方说页的类型，这个页的编号是多少，它的上一个页、下一个页是谁，页的校验和等等，这个部分占用固定的38个字节。

页的类型，包括Undo日志页、段信息节点、Insert Buffer空闲列表、Insert Buffer位图、系统页、事务系统数据、表空间头部信息、扩展描述页、溢出页、索引页，有些页会在后面的课程看到。

同时通过上一个页、下一个页建立一个双向链表把许许多多的页就串联起来，而无需这些页在物理上真正连着。但是并不是所有类型的页都有上一个和下一个页的属性，数据页是有这两个属性的，所以所有的数据页其实是一个双向链表。

### **File Trailer**

我们知道InnoDB存储引擎会把数据存储到磁盘上，但是磁盘速度太慢，需要以页为单位把数据加载到内存中处理，如果该页中的数据在内存中被修改了，那么在修改后的某个时间需要把数据同步到磁盘中。但是在同步了一半的时候中断电了咋办？

为了检测一个页是否完整（也就是在同步的时候有没有发生只同步一半的尴尬情况），InnoDB每个页的尾部都加了一个File Trailer部分，这个部分由8个字节组成，可以分成2个小部分：

前4个字节代表页的校验和

这个部分是和File Header中的校验和相对应的。每当一个页面在内存中修改了，在同步之前就要把它的校验和算出来，因为File Header在页面的前边，所以校验和会被首先同步到磁盘，当完全写完时，校验和也会被写到页的尾部，如果完全同步成功，则页的首部和尾部的校验和应该是一致的。如果写了一半儿断电了，那么在File Header中的校验和就代表着已经修改过的页，而在File Trailer中的校验和代表着原先的页，二者不同则意味着同步中间出了错。

后4个字节代表页面被最后修改时对应的日志序列位置（LSN），这个也和校验页的完整性有关。

这个File Trailer与File Header类似，都是所有类型的页通用的。

## **InnoDB的体系结构**

前面，我们站在微观的角度了解了数据记录和页面的存储格式，现在我们需要站在宏观的角度看看InnoDB的内存结构和磁盘存储结构。

可以参考MySQL官方文档

https://dev.mysql.com/doc/refman/5.7/en/innodb-architecture.html

​    ![img](/Users/jiusonghuang/pic-md/20211229232513.png)

可以看见，比较关键的是其中的各种Buffer和Tabelspace（表空间），这些也是我们接下来要学习的重点。

太长不看版：   ![img](/Users/jiusonghuang/pic-md/20211229232531.png)

不过InnoDB的内存结构和磁盘存储结构在MySQL8.0有所变化：

https://dev.mysql.com/doc/refman/8.0/en/innodb-architecture.html

但是不影响我们后面对InnoDB内部原理的学习。

   ![img](/Users/jiusonghuang/pic-md/20211229232552.png)

### **InnoDB的表空间**

表空间是一个抽象的概念，对于系统表空间来说，对应着文件系统中一个或多个实际文件，一般是（ibdata1）；对于每个独立表空间（也就是上图的File-Per-Table Tablespaces）来说，对应着文件系统中一个名为表名.ibd的实际文件。![img](/Users/jiusonghuang/pic-md/20211229232609.png)

   ![img](/Users/jiusonghuang/pic-md/20211229232623.png)

大家可以把表空间想象成被切分为许许多多个页的池子，当我们想为某个表插入一条记录的时候，就从池子中捞出一个对应的页来把数据写进去。

再回忆一次，InnoDB是以页为单位管理存储空间的，我们的聚簇索引（也就是完整的表数据）和其他的二级索引都是以B+树的形式保存到表空间的，而B+树的节点就是数据页。

任何类型的页都有专门的地方保存页属于哪个表空间，同时表空间中的每一个页都对应着一个页号，这个页号由4个字节组成，也就是32个比特位，所以一个表空间最多可以拥有232个页，如果按照页的默认大小16KB来算，一个表空间最多支持64TB的数据。

### **独立表空间结构**

#### **区（extent）**

表空间中的页可以达到232个页，实在是太多了，为了更好的管理这些页面，InnoDB中还有一个区（英文名：extent）的概念。对于16KB的页来说，连续的64个页就是一个区，也就是说一个区默认占用1MB空间大小。

不论是系统表空间还是独立表空间，都可以看成是由若干个区组成的，每256个区又被划分成一个**组**。

第一个组最开始的3个页面的类型是固定的：用来登记整个表空间的一些整体属性以及本组所有的区被称为FSP_HDR，也就是extent 0 ~ extent 255这256个区，整个表空间只有一个FSP_HDR。

其余各组最开始的2个页面的类型是固定的，一个XDES类型，用来登记本组256个区的属性，FSP_HDR类型的页面其实和XDES类型的页面的作用类似，只不过FSP_HDR类型的页面还会额外存储一些表空间的属性。

引入区的主要目的是什么？我们每向表中插入一条记录，本质上就是向该表的聚簇索引以及所有二级索引代表的B+树的节点中插入数据。而B+树的每一层中的页都会形成一个双向链表，如果是以页为单位来分配存储空间的话，双向链表相邻的两个页之间的物理位置可能离得非常远。

我们介绍B+树索引的适用场景的时候特别提到范围查询只需要定位到最左边的记录和最右边的记录，然后沿着双向链表一直扫描就可以了，而如果链表中相邻的两个页物理位置离得非常远，就是所谓的随机I/O。再一次强调，磁盘的速度和内存的速度差了好几个数量级，随机I/O是非常慢的，所以我们应该尽量让链表中相邻的页的物理位置也相邻，这样进行范围查询的时候才可以使用所谓的顺序I/O。

一个区就是在物理位置上连续的64个页。在表中数据量大的时候，为某个索引分配空间的时候就不再按照页为单位分配了，而是按照区为单位分配，甚至在表中的数据十分非常特别多的时候，可以一次性分配多个连续的区，从性能角度看，可以消除很多的随机I/O。

#### **段（segment）**

我们提到的范围查询，其实是对B+树叶子节点中的记录进行顺序扫描，而如果不区分叶子节点和非叶子节点，统统把节点代表的页面放到申请到的区中的话，进行范围扫描的效果就大打折扣了。所以InnoDB对B+树的叶子节点和非叶子节点进行了区别对待，也就是说叶子节点有自己独有的区，非叶子节点也有自己独有的区。存放叶子节点的区的集合就算是一个段（segment），存放非叶子节点的区的集合也算是一个段。也就是说一个索引会生成2个段，一个叶子节点段，一个非叶子节点段。

段其实不对应表空间中某一个连续的物理区域，而是一个逻辑上的概念。

   ![img](/Users/jiusonghuang/pic-md/20211229232644.png)

### **系统表空间**

#### **整体结构**

系统表空间的结构和独立表空间基本类似，只不过由于整个MySQL进程只有一个系统表空间，在系统表空间中会额外记录一些有关整个系统信息的页面，所以会比独立表空间多出一些记录这些信息的页面，相当于是表空间之首，所以它的表空间 ID（Space ID）是0。

系统表空间有extent 1和extent两个区，也就是页号从64~191这128个页面被称为Doublewrite buffer，也就是双写缓冲区。

#### **双写缓冲区/双写机制**

双写缓冲区/双写机制是InnoDB的三大特性之一，还有两个是 Buffer Pool、自适应Hash索引。

它是一种特殊文件flush技术，带给InnoDB存储引擎的是数据页的可靠性。它的作用是，在把页写到数据文件之前，InnoDB先把它们写到一个叫doublewrite buffer（双写缓冲区）的连续区域内，在写doublewrite buffer完成后，InnoDB才会把页写到数据文件的适当的位置。如果在写页的过程中发生意外崩溃，InnoDB在稍后的恢复过程中在doublewrite buffer中找到完好的page副本用于恢复。

所以，虽然叫双写缓冲区，但是这个缓冲区不仅在内存中有，更多的是属于MySQL的系统表空间，属于磁盘文件的一部分。那为什么要引入一个双写机制呢？

InnoDB的页大小一般是16KB，其数据校验也是针对这16KB来计算的，将数据写入到磁盘是以页为单位进行操作的。而操作系统写文件是以4KB作为单位的，那么每写一个InnoDB的页到磁盘上，操作系统需要写4个块。

而计算机硬件和操作系统，在极端情况下（比如断电）往往并不能保证这一操作的原子性，16K的数据，写入4K时，发生了系统断电或系统崩溃，只有一部分写是成功的，这种情况下会产生partial page write（部分页写入）问题。这时页数据出现不一样的情形，从而形成一个"断裂"的页，使数据产生混乱。在InnoDB存储引擎未使用doublewrite技术前，曾经出现过因为部分写失效而导致数据丢失的情况。

doublewrite buffer是InnoDB在表空间上的128个页（2个区，extend1和extend2），大小是2MB。为了解决部分页写入问题，当MySQL将脏数据flush到数据文件的时候, 先使用memcopy将脏数据复制到内存中的一个区域（也是2M），之后通过这个内存区域再分2次，每次写入1MB到系统表空间，然后马上调用fsync函数，同步到磁盘上。在这个过程中是顺序写，开销并不大，在完成doublewrite写入后，再将数据写入各数据文件文件，这时是离散写入。

所以在正常的情况下, MySQL写数据页时，会写两遍到磁盘上，第一遍是写到doublewrite buffer，第二遍是写到真正的数据文件中。如果发生了极端情况（断电），InnoDB再次启动后，发现了一个页数据已经损坏，那么此时就可以从doublewrite buffer中进行数据恢复了。

前面说过，位于系统表空间上的doublewrite buffer实际上也是一个文件，写系统表空间会导致系统有更多的fsync操作, 而硬盘的fsync性能因素会降低MySQL的整体性能。不过在存储上，doublewrite是在一个连续的存储空间, 所以硬盘在写数据的时候是顺序写，而不是随机写，这样性能影响不大，相比不双写，降低了大概5-10%左右。

所以，在一些情况下可以关闭doublewrite以获取更高的性能。比如在slave上可以关闭，因为即使出现了partial page write问题，数据还是可以从中继日志中恢复。比如某些文件系统ZFS本身有些文件系统本身就提供了部分写失效的防范机制，也可以关闭。

在数据库异常关闭的情况下启动时，都会做数据库恢复（redo）操作，恢复的过程中，数据库都会检查页面是不是合法（校验等等），如果发现一个页面校验结果不一致，则此时会用到双写这个功能。

有经验的同学也许会想到，如果发生写失效，可以通过重做日志(Redo Log)进行恢复啊！但是要注意，重做日志中记录的是对页的物理操作，如偏移量800,写' aaaa'记录，而不是页面的全量记录，而如果发生partial page write（部分页写入）问题时，出现问题的是未修改过的数据，此时重做日志(Redo Log)无能为力。写doublewrite buffer成功了，这个问题就不用担心了。

如果是写doublewrite buffer本身失败，那么这些数据不会被写到磁盘，InnoDB此时会从磁盘载入原始的数据，然后通过InnoDB的事务日志来计算出正确的数据，重新写入到doublewrite buffer，这个速度就比较慢了。如果doublewrite buffer写成功的话,但是写数据文件失败，innodb就不用通过事务日志来计算了,而是直接用doublewrite buffer的数据再写一遍，速度上会快很多。

总体来说，doublewrite buffer的作用有两个: 提高innodb把缓存的数据写到硬盘这个过程的安全性；间接的好处就是，innodb的事务日志不需要包含所有数据的前后映像,而是二进制变化量，这可以节省大量的IO。

#### **InnoDB数据字典(Data Dictionary Header)**

我们平时使用INSERT语句向表中插入的那些记录称之为用户数据，MySQL只是作为一个软件来为我们来保管这些数据，提供方便的增删改查接口而已。但是每当我们向一个表中插入一条记录的时候，MySQL先要校验一下插入语句对应的表存不存在，插入的列和表中的列是否符合，如果语法没有问题的话，还需要知道该表的聚簇索引和所有二级索引对应的根页面是哪个表空间的哪个页面，然后把记录插入对应索引的B+树中。所以说，MySQL除了保存着我们插入的用户数据之外，还需要保存许多额外的信息，比方说：

某个表属于哪个表空间，表里边有多少列，表对应的每一个列的类型是什么，该表有多少索引，每个索引对应哪几个字段，该索引对应的根页面在哪个表空间的哪个页面，该表有哪些外键，外键对应哪个表的哪些列，某个表空间对应文件系统上文件路径是什么。

上述这些数据并不是我们使用INSERT语句插入的用户数据，实际上是为了更好的管理我们这些用户数据而不得已引入的一些额外数据，这些数据也称为元数据。InnoDB存储引擎特意定义了一些列的内部系统表（internal system table）来记录这些这些元数据：

表名	描述

SYS_TABLES	整个InnoDB存储引擎中所有的表的信息

SYS_COLUMNS	整个InnoDB存储引擎中所有的列的信息

SYS_INDEXES	整个InnoDB存储引擎中所有的索引的信息

SYS_FIELDS	整个InnoDB存储引擎中所有的索引对应的列的信息

SYS_FOREIGN	整个InnoDB存储引擎中所有的外键的信息

SYS_FOREIGN_COLS	整个InnoDB存储引擎中所有的外键对应列的信息

SYS_TABLESPACES	整个InnoDB存储引擎中所有的表空间信息

SYS_DATAFILES	整个InnoDB存储引擎中所有的表空间对应文件系统的文件路径信息

SYS_VIRTUAL	整个InnoDB存储引擎中所有的虚拟生成列的信息

这些系统表也被称为数据字典，它们都是以B+树的形式保存在系统表空间的某些页面中，其中SYS_TABLES、SYS_COLUMNS、SYS_INDEXES、SYS_FIELDS这四个表尤其重要，称之为基本系统表。

这4个表是表中之表，那这4个表的元数据去哪里获取呢？只能把这4个表的元数据，就是它们有哪些列、哪些索引等信息硬编码到代码中，然后InnoDB的又拿出一个固定的页面来记录这4个表的聚簇索引和二级索引对应的B+树位置，这个页面就是页号为7的页面Data Dictionary Header，类型为SYS，记录了数据字典的头部信息。除了这4个表的5个索引的根页面信息外，这个页号为7的页面还记录了整个InnoDB存储引擎的一些全局属性，比如Row ID。

数据字典头部信息中有个Max Row ID字段，我们说过如果我们不显式的为表定义主键，而且表中也没有UNIQUE索引，那么InnoDB存储引擎会默认为我们生成一个名为row_id的列作为主键。因为它是主键，所以每条记录的row_id列的值不能重复。

原则上只要一个表中的row_id列不重复就可以了，也就是说表a和表b拥有一样的row_id列也没啥关系，不过InnoDB只提供了这个Max Row ID字段，不论哪个拥有row_id列的表插入一条记录时，该记录的row_id列的值就是Max Row ID对应的值，然后再把Max Row ID对应的值加1，也就是说这个Max Row ID是全局共享的。

用户是不能直接访问InnoDB的这些内部系统表的，除非你直接去解析系统表空间对应文件系统上的文件。不过InnoDB考虑到查看这些表的内容可能有助于大家分析问题，所以在系统数据库information_schema中提供了一些以innodb_sys开头的表： 

   ![img](/Users/jiusonghuang/pic-md/20211229232709.png)

在information_schema数据库中的这些以INNODB_SYS开头的表并不是真正的内部系统表（内部系统表就是我们上边说过的以SYS开头的那些表），而是在存储引擎启动时读取这些以SYS开头的系统表，然后填充到这些以INNODB_SYS开头的表中。

### **InnoDB 的 Buffer Pool**

#### **缓存的重要性**

我们知道，对于使用InnoDB作为存储引擎的表来说，不管是用于存储用户数据的索引（包括聚簇索引和二级索引），还是各种系统数据，都是以页的形式存放在表空间中的，而所谓的表空间只不过是InnoDB对文件系统上一个或几个实际文件的抽象，也就是说我们的数据说到底还是存储在磁盘上的。

但是磁盘的速度慢，所以InnoDB存储引擎在处理客户端的请求时，当需要访问某个页的数据时，就会把完整的页的数据全部加载到内存中，也就是说即使我们只需要访问一个页的一条记录，那也需要先把整个页的数据加载到内存中。将整个页加载到内存中后就可以进行读写访问了，在进行完读写访问之后并不着急把该页对应的内存空间释放掉，而是将其缓存起来，这样将来有请求再次访问该页面时，就可以省去磁盘IO的开销了。

#### **Buffer Pool**

InnoDB为了缓存磁盘中的页，在MySQL服务器启动的时候就向操作系统申请了一片连续的内存，他们给这片内存起了个名，叫做Buffer Pool（中文名是缓冲池）。那它有多大呢？这个其实看我们机器的配置，默认情况下Buffer Pool只有128M大小。

**show variables like 'innodb_buffer_pool_size';**

   ![img](/Users/jiusonghuang/pic-md/20211229232730.png)

可以在启动服务器的时候配置innodb_buffer_pool_size参数的值，它表示Buffer Pool的大小，就像这样：

[server]

innodb_buffer_pool_size = 268435456

其中，268435456的单位是字节，也就是指定Buffer Pool的大小为256M。需要注意的是，Buffer Pool也不能太小，最小值为5M(当小于该值时会自动设置成5M)。

Buffer Pool的缺省值其实是偏小的，一个比较合理的设置方法是按比例设置，一般的网上惯例是给buffer pool设置的机器内存的60%左右，当然这个值偏保守，因为按照MySQL官方的说法（5.7版本和8.0版本都是）：

https://dev.mysql.com/doc/refman/8.0/en/innodb-parameters.html

![img](/Users/jiusonghuang/pic-md/20211229232745.png)

上文的意思是：更大的缓冲池只需更少的磁盘 I/O 来多次访问相同的表数据。在**专用**数据库服务器上，您可以将缓冲池大小设置为机器物理内存大小的 80%。配置缓冲池大小时请注意以下潜在问题，并准备在必要时缩减缓冲池的大小。

………………………………………………….。

InnoDB 为缓冲区和控制结构保留了额外的内存，因此分配的总空间比指定的缓冲池大小大约大 10%。

也就是说其实按照官方的分配最终Buffer Pool占据的空间可能达到机器物理内存的90%，这个内存占用还是有点冒险的，因为即使是**专用**数据库服务器，还需要考虑：

\* 每个查询至少需要几K的内存(有时候是几M)

\* 有各种其它内部的MySQL结构和缓存

\* InnoDB有一些结构是不用缓冲池的内存的(字典缓存，文件系统等)

\* 也有一些MySQL文件是在OS缓存里的(binary日志，relay日志,innodb事务日志等)

\* 此外也必须为操作系统留出些内存

所以比较权衡的值是70%~75%之间，但是需要监控好服务器的内存使用情况。当然最好的情况是在DBA的监控下根据业务的繁忙情况按照Buffer Pool的命中率来设置：

show engine innodb status\G

   ![img](/Users/jiusonghuang/pic-md/20211229232801.png)

对于读取多的情况,如果没达到98%以上，都说明buffer不够，可以扩，如果给命中都能达到98%~100%了，而且还有大量的free page那说明够用了。当然如果业务不繁忙或者是写多读少的情况下命中率参考意义就不大了。

总的来说，没有专人管理和实时监控的情况下，可以设置为60%较为稳妥，有专人管理和实时监控的情况下，可以设置为75%，并根据业务情况适度增大或者缩小。

#### **Buffer Pool内部组成**

Buffer Pool中默认的缓存页大小和在磁盘上默认的页大小是一样的，都是16KB。为了更好的管理这些在Buffer Pool中的缓存页，InnoDB为每一个缓存页都创建了一些所谓的控制信息，这些控制信息包括该页所属的表空间编号、页号、缓存页在Buffer Pool中的地址、链表节点信息、一些锁信息以及LSN信息，当然还有一些别的控制信息。

每个缓存页对应的控制信息占用的内存大小是相同的，我们称为控制块。控制块和缓存页是一一对应的，它们都被存放到 Buffer Pool 中，其中控制块被存放到 Buffer Pool 的前边，缓存页被存放到 Buffer Pool 后边，所以整个Buffer Pool对应的内存空间看起来就是这样的：

​    ![img](/Users/jiusonghuang/pic-md/20211229232817.png)

每个控制块大约占用缓存页大小的5%，而我们设置的innodb_buffer_pool_size并不包含这部分控制块占用的内存空间大小，也就是说InnoDB在为Buffer Pool向操作系统申请连续的内存空间时，这片连续的内存空间一般会比innodb_buffer_pool_size的值大5%左右。

#### **free链表的管理**

最初启动MySQL服务器的时候，需要完成对Buffer Pool的初始化过程，就是先向操作系统申请Buffer Pool的内存空间，然后把它划分成若干对控制块和缓存页。但是此时并没有真实的磁盘页被缓存到Buffer Pool中（因为还没有用到），之后随着程序的运行，会不断的有磁盘上的页被缓存到Buffer Pool中。

那么问题来了，从磁盘上读取一个页到Buffer Pool中的时候该放到哪个缓存页的位置呢？或者说怎么区分Buffer Pool中哪些缓存页是空闲的，哪些已经被使用了呢？最好在某个地方记录一下Buffer Pool中哪些缓存页是可用的，这个时候缓存页对应的控制块就派上大用场了，我们可以把所有空闲的缓存页对应的控制块作为一个节点放到一个链表中，这个链表也可以被称作free链表（或者说空闲链表）。刚刚完成初始化的Buffer Pool中所有的缓存页都是空闲的，所以每一个缓存页对应的控制块都会被加入到free链表中，假设该Buffer Pool中可容纳的缓存页数量为n，那增加了free链表的效果图就是这样的：

  ![img](/Users/jiusonghuang/pic-md/20211229232829.png)

有了这个free链表之后，每当需要从磁盘中加载一个页到Buffer Pool中时，就从free链表中取一个空闲的缓存页，并且把该缓存页对应的控制块的信息填上（就是该页所在的表空间、页号之类的信息），然后把该缓存页对应的free链表节点从链表中移除，表示该缓存页已经被使用了。

#### **缓存页的哈希处理**

我们前边说过，当我们需要访问某个页中的数据时，就会把该页从磁盘加载到Buffer Pool中，如果该页已经在Buffer Pool中的话直接使用就可以了。那么问题也就来了，我们怎么知道该页在不在Buffer Pool中呢？难不成需要依次遍历Buffer Pool中各个缓存页么？

我们其实是根据表空间号 + 页号来定位一个页的，也就相当于表空间号 + 页号是一个key，缓存页就是对应的value，怎么通过一个key来快速找着一个value呢？

所以我们可以用表空间号 + 页号作为key，缓存页作为value创建一个哈希表，在需要访问某个页的数据时，先从哈希表中根据表空间号 + 页号看看有没有对应的缓存页，如果有，直接使用该缓存页就好，如果没有，那就从free链表中选一个空闲的缓存页，然后把磁盘中对应的页加载到该缓存页的位置。

#### **flush链表的管理**

如果我们修改了Buffer Pool中某个缓存页的数据，那它就和磁盘上的页不一致了，这样的缓存页也被称为脏页（英文名：dirty page）。当然，最简单的做法就是每发生一次修改就立即同步到磁盘上对应的页上，但是频繁的往磁盘中写数据会严重的影响程序的性能。所以每次修改缓存页后，我们并不着急立即把修改同步到磁盘上，而是在未来的某个时间点进行同步。

但是如果不立即同步到磁盘的话，那之后再同步的时候我们怎么知道Buffer Pool中哪些页是脏页，哪些页从来没被修改过呢？总不能把所有的缓存页都同步到磁盘上吧，假如Buffer Pool被设置的很大，比方说300G，那一次性同步会非常慢。

所以，需要再创建一个存储脏页的链表，凡是修改过的缓存页对应的控制块都会作为一个节点加入到一个链表中，因为这个链表节点对应的缓存页都是需要被刷新到磁盘上的，所以也叫flush链表。链表的构造和free链表差不多。

​    ![img](/Users/jiusonghuang/pic-md/20211229232846.png)

### **LRU链表的管理**

#### **缓存不够的窘境**

Buffer Pool对应的内存大小毕竟是有限的，如果需要缓存的页占用的内存大小超过了Buffer Pool大小，也就是free链表中已经没有多余的空闲缓存页的时候该咋办？当然是把某些旧的缓存页从Buffer Pool中移除，然后再把新的页放进来，那么问题来了，移除哪些缓存页呢？

为了回答这个问题，我们还需要回到我们设立Buffer Pool的初衷，我们就是想减少和磁盘的IO交互，最好每次在访问某个页的时候它都已经被缓存到Buffer Pool中了。假设我们一共访问了n次页，那么被访问的页已经在缓存中的次数除以n就是所谓的缓存命中率，我们的期望就是让缓存命中率越高越好。

 从这个角度出发，回想一下我们的微信聊天列表，排在前边的都是最近很频繁使用的，排在后边的自然就是最近很少使用的，假如列表能容纳下的联系人有限，你是会把最近很频繁使用的留下还是最近很少使用的留下呢？当然是留下最近很频繁使用的了。

#### **简单的LRU链表**

管理Buffer Pool的缓存页其实也是这个道理，当Buffer Pool中不再有空闲的缓存页时，就需要淘汰掉部分最近很少使用的缓存页。不过，我们怎么知道哪些缓存页最近频繁使用，哪些最近很少使用呢？

再创建一个链表，由于这个链表是为了按照最近最少使用的原则去淘汰缓存页的，所以这个链表可以被称为LRU链表（LRU的英文全称：Least Recently Used）。当我们需要访问某个页时，可以这样处理LRU链表：

如果该页不在Buffer Pool中，在把该页从磁盘加载到Buffer Pool中的缓存页时，就把该缓存页对应的控制块作为节点塞到LRU链表的头部。

如果该页已经缓存在Buffer Pool中，则直接把该页对应的控制块移动到LRU链表的头部。

也就是说：只要我们使用到某个缓存页，就把该缓存页调整到LRU链表的头部，这样LRU链表尾部就是最近最少使用的缓存页。所以当Buffer Pool中的空闲缓存页使用完时，到LRU链表的尾部找些缓存页淘汰就行了。

缓存机制一直是各种系统提高性能的首选手段，使用了缓存就必然有缓存淘汰的需求，LRU就是常见的算法，再比如Redis中的缓存淘汰算法也一直是面试中的高频考点，其中就有volatile-lru、allkeys-lru等淘汰策略。

所以关于LRU缓存的实现在算法笔试中几乎所有的大厂都有考察，具体的实现，大家可以到《大厂高频笔试题Top20、精选LeetCode热题100详解-第三期》中查看，具体地址：

https://vip.tulingxueyuan.cn/detail/p_61a344ffe4b09240f0e4b59e/8。

#### **划分区域的LRU链表**

但是这种实现存在两种比较尴尬的情况：

情况一：InnoDB提供了预读（英文名：read ahead）。所谓预读，就是InnoDB认为执行当前的请求可能之后会读取某些页面，就预先把它们加载到Buffer Pool中。根据触发方式的不同，预读又可以细分为下边两种：

#### **线性预读**

InnoDB提供了一个系统变量innodb_read_ahead_threshold，如果顺序访问了某个区（extent）的页面超过这个系统变量的值，就会触发一次异步读取下一个区中全部的页面到Buffer Pool的请求。

这个innodb_read_ahead_threshold系统变量的值默认是56，我们可以在服务器启动时通过启动参数或者服务器运行过程中直接调整该系统变量的值，取值范围是0~64。

#### **随机预读**

如果Buffer Pool中已经缓存了某个区的13个连续的页面，不论这些页面是不是顺序读取的，都会触发一次异步读取本区中所有其他的页面到Buffer Pool的请求。InnoDB同时提供了innodb_random_read_ahead系统变量，它的默认值为OFF。

**show variables like '%_read_ahead%';**

​    ![img](/Users/jiusonghuang/pic-md/20211229232905.png)

*并且可以根据通过执行show engine innodb status命令显示的三个参数判断read-ahead算法的有效性：*

*read_ahead、read_ahead_evicted、read_ahead_rnd*    ![img](/Users/jiusonghuang/pic-md/20211229232919.png)

*如果通过监控发现，这个预读功能长期有效性很低，可以考虑关闭这个预读功能。*

如果预读到Buffer Pool中的页成功的被使用到，那就可以极大的提高语句执行的效率。可是如果用不到呢？这些预读的页都会放到LRU链表的头部，但是如果此时Buffer Pool的容量不太大而且很多预读的页面都没有用到的话，这就会导致处在LRU链表尾部的一些缓存页会很快的被淘汰掉，也就是所谓的劣币驱逐良币，会大大降低缓存命中率。

情况二：应用程序可能会写一些需要扫描全表的查询语句（比如没有建立合适的索引或者压根儿没有WHERE子句的查询）。

扫描全表意味着什么？意味着将访问到该表所在的所有页！假设这个表中记录非常多的话，那该表会占用特别多的页，当需要访问这些页时，会把它们统统都加载到Buffer Pool中，这也就意味着Buffer Pool中的所有页都被换了一次血，其他查询语句在执行时又得执行一次从磁盘加载到Buffer Pool的操作。而这种全表扫描的语句执行的频率也不高，每次执行都要把Buffer Pool中的缓存页换一次血，这严重的影响到其他查询对 Buffer Pool的使用，从而大大降低了缓存命中率。

总结一下上边说的可能降低Buffer Pool的两种情况：

加载到Buffer Pool中的页不一定被用到。

如果非常多的使用频率偏低的页被同时加载到Buffer Pool时，可能会把那些使用频率非常高的页从Buffer Pool中淘汰掉。

因为有这两种情况的存在，所以InnoDB把这个LRU链表按照一定比例分成两截，分别是：

一部分存储使用频率非常高的缓存页，所以这一部分链表也叫做热数据，或者称young区域。

另一部分存储使用频率不是很高的缓存页，所以这一部分链表也叫做冷数据，或者称old区域。

![img](/Users/jiusonghuang/pic-md/20211229232937.png)

我们是按照某个比例将LRU链表分成两半的，不是某些节点固定是young区域的，某些节点固定是old区域的，随着程序的运行，某个节点所属的区域也可能发生变化。那这个划分成两截的比例怎么确定呢？对于InnoDB存储引擎来说，我们可以通过查看系统变量innodb_old_blocks_pct的值来确定old区域在LRU链表中所占的比例，比方说这样：

**SHOW VARIABLES LIKE 'innodb_old_blocks_pct';**

   ![https://note.youdao.com/yws/public/resource/92b91d9f92729187e257226a8aa8fc7f/xmlnote/1A294333AA7F435FA0E44DD5000612F6/2242](/Users/jiusonghuang/pic-md/20211229232953.png)

从结果可以看出来，默认情况下，old区域在LRU链表中所占的比例是37%，也就是说old区域大约占LRU链表的3/8。这个比例我们是可以设置的，我们可以在启动时修改innodb_old_blocks_pct参数来控制old区域在LRU链表中所占的比例。在服务器运行期间，我们也可以修改这个系统变量的值，不过需要注意的是，这个系统变量属于全局变量。

有了这个被划分成young和old区域的LRU链表之后，InnoDB就可以针对我们上边提到的两种可能降低缓存命中率的情况进行优化了：

针对预读的页面可能不进行后续访问情况的优化：

InnoDB规定，当磁盘上的某个页面在初次加载到Buffer Pool中的某个缓存页时，该缓存页对应的控制块会被放到old区域的头部。这样针对预读到Buffer Pool却不进行后续访问的页面就会被逐渐从old区域逐出，而不会影响young区域中被使用比较频繁的缓存页。

针对全表扫描时，短时间内访问大量使用频率非常低的页面情况的优化：

在进行全表扫描时，虽然首次被加载到Buffer Pool的页被放到了old区域的头部，但是后续会被马上访问到，每次进行访问的时候又会把该页放到young区域的头部，这样仍然会把那些使用频率比较高的页面给顶下去。

有同学会想：可不可以在第一次访问该页面时不将其从old区域移动到young区域的头部，后续访问时再将其移动到young区域的头部。回答是：行不通！因为InnoDB规定每次去页面中读取一条记录时，都算是访问一次页面，而一个页面中可能会包含很多条记录，也就是说读取完某个页面的记录就相当于访问了这个页面好多次。

全表扫描有一个特点，那就是它的执行频率非常低，出现了全表扫描的语句也是我们应该尽快优化的对象。而且在执行全表扫描的过程中，即使某个页面中有很多条记录，也就是去多次访问这个页面所花费的时间也是非常少的。

所以在对某个处在old区域的缓存页进行第一次访问时就在它对应的控制块中记录下来这个访问时间，如果后续的访问时间与第一次访问的时间在某个时间间隔内，那么该页面就不会被从old区域移动到young区域的头部，否则将它移动到young区域的头部。上述的这个间隔时间是由系统变量innodb_old_blocks_time控制的：

**SHOW VARIABLES LIKE 'innodb_old_blocks_time';**

   ![img](/Users/jiusonghuang/pic-md/20211229233009.png)

这个innodb_old_blocks_time的默认值是1000，它的单位是毫秒，也就意味着对于从磁盘上被加载到LRU链表的old区域的某个页来说，如果第一次和最后一次访问该页面的时间间隔小于1s（很明显在一次全表扫描的过程中，多次访问一个页面中的时间不会超过1s），那么该页是不会被加入到young区域的， 当然，像innodb_old_blocks_pct一样，我们也可以在服务器启动或运行时设置innodb_old_blocks_time的值，这里需要注意的是，如果我们把innodb_old_blocks_time的值设置为0，那么每次我们访问一个页面时就会把该页面放到young区域的头部。

综上所述，正是因为将LRU链表划分为young和old区域这两个部分，又添加了innodb_old_blocks_time这个系统变量，才使得预读机制和全表扫描造成的缓存命中率降低的问题得到了遏制，因为用不到的预读页面以及全表扫描的页面都只会被放到old区域，而不影响young区域中的缓存页。

#### **更进一步优化LRU链表**

对于young区域的缓存页来说，我们每次访问一个缓存页就要把它移动到LRU链表的头部，这样开销是不是太大？

毕竟在young区域的缓存页都是热点数据，也就是可能被经常访问的，这样频繁的对LRU链表进行节点移动操作也会拖慢速度？为了解决这个问题，MySQL中还有一些优化策略，比如只有被访问的缓存页位于young区域的1/4的后边，才会被移动到LRU链表头部，这样就可以降低调整LRU链表的频率，从而提升性能

还有没有什么别的针对LRU链表的优化措施呢？当然还有，我们这里不继续说了，更多的需要看MySQL的源码，但是不论怎么优化，出发点就是：尽量高效的提高 Buffer Pool 的缓存命中率。

#### **其他的一些链表**

为了更好的管理Buffer Pool中的缓存页，除了我们上边提到的一些措施，InnoDB们还引进了其他的一些链表，比如unzip LRU链表用于管理解压页，zip clean链表用于管理没有被解压的压缩页，zip free数组中每一个元素都代表一个链表，它们组成所谓的伙伴系统来为压缩页提供内存空间等等。

#### **刷新脏页到磁盘**

后台有专门的线程每隔一段时间负责把脏页刷新到磁盘，这样可以不影响用户线程处理正常的请求。主要有两种刷新路径：

1、从LRU链表的冷数据中刷新一部分页面到磁盘。

后台线程会定时从LRU链表尾部开始扫描一些页面，扫描的页面数量可以通过系统变量innodb_lru_scan_depth来指定，如果从里边儿发现脏页，会把它们刷新到磁盘。这种刷新页面的方式被称之为BUF_FLUSH_LRU。

2、从flush链表中刷新一部分页面到磁盘。

后台线程也会定时从flush链表中刷新一部分页面到磁盘，刷新的速率取决于当时系统是不是很繁忙。这种刷新页面的方式被称之为BUF_FLUSH_LIST。

有时候后台线程刷新脏页的进度比较慢，导致用户线程在准备加载一个磁盘页到Buffer Pool时没有可用的缓存页，这时就会尝试看看LRU链表尾部有没有可以直接释放掉的未修改页面，如果没有的话会不得不将LRU链表尾部的一个脏页同步刷新到磁盘（和磁盘交互是很慢的，这会降低处理用户请求的速度）。这种刷新单个页面到磁盘中的刷新方式被称之为BUF_FLUSH_SINGLE_PAGE。

当然，有时候系统特别繁忙时，也可能出现用户线程批量的从flush链表中刷新脏页的情况，很显然在处理用户请求过程中去刷新脏页是一种严重降低处理速度的行为，这属于一种迫不得已的情况。

### **多个Buffer Pool实例**

我们上边说过，Buffer Pool本质是InnoDB向操作系统申请的一块连续的内存空间，在多线程环境下，访问Buffer Pool中的各种链表都需要加锁处理，在Buffer Pool特别大而且多线程并发访问特别高的情况下，单一的Buffer Pool可能会影响请求的处理速度。所以在Buffer Pool特别大的时候，我们可以把它们拆分成若干个小的Buffer Pool，每个Buffer Pool都称为一个实例，它们都是独立的，独立的去申请内存空间，独立的管理各种链表，所以在多线程并发访问时并不会相互影响，从而提高并发处理能力。

我们可以在服务器启动的时候通过设置innodb_buffer_pool_instances的值来修改Buffer Pool实例的个数

那每个Buffer Pool实例实际占多少内存空间呢？其实使用这个公式算出来的：innodb_buffer_pool_size/innodb_buffer_pool_instances

也就是总共的大小除以实例的个数，结果就是每个Buffer Pool实例占用的大小。

不过也不是说Buffer Pool实例创建的越多越好，分别管理各个Buffer Pool也是需要性能开销的，InnoDB规定：innodb_buffer_pool_instances能设置的最大值是64，而且当innodb_buffer_pool_size（默认128M）的值小于1G的时候设置多个实例是无效的，InnoDB会默认把innodb_buffer_pool_instances 的值修改为1。

按照官方的说明，最佳的innodb_buffer_pool_instances的数量是，innodb_buffer_pool_size除以innodb_buffer_pool_instances，可以让每个Buffer Pool实例达到1个G，这个公式在8.0和5.7中都适用。

https://dev.mysql.com/doc/refman/8.0/en/innodb-multiple-buffer-pools.html

   ![img](/Users/jiusonghuang/pic-md/20211229233032.png)

**innodb_buffer_pool_chunk_size**

在MySQL 5.7.5之前，Buffer Pool的大小只能在服务器启动时通过配置innodb_buffer_pool_size启动参数来调整大小，在服务器运行过程中是不允许调整该值的。不过MySQL在5.7.5以及之后的版本中支持了在服务器运行过程中调整Buffer Pool大小的功能，

但是有一个问题，就是每次当我们要重新调整Buffer Pool大小时，都需要重新向操作系统申请一块连续的内存空间，然后将旧的Buffer Pool中的内容复制到这一块新空间，这是极其耗时的。所以MySQL决定不再一次性为某个Buffer Pool实例向操作系统申请一大片连续的内存空间，而是以一个所谓的chunk为单位向操作系统申请空间。也就是说一个Buffer Pool实例其实是由若干个chunk组成的，一个chunk就代表一片连续的内存空间，里边儿包含了若干缓存页与其对应的控制块：   ![img](/Users/jiusonghuang/pic-md/20211229233052.png)

正是因为发明了这个chunk的概念，我们在服务器运行期间调整Buffer Pool的大小时就是以chunk为单位增加或者删除内存空间，而不需要重新向操作系统申请一片大的内存，然后进行缓存页的复制。这个所谓的chunk的大小是我们在启动操作MySQL服务器时通过innodb_buffer_pool_chunk_size启动参数指定的，它的默认值是134217728，也就是128M。不过需要注意的是，innodb_buffer_pool_chunk_size的值只能在服务器启动时指定，在服务器运行过程中是不可以修改的。

Buffer Pool的缓存页除了用来缓存磁盘上的页面以外，还可以存储锁信息、自适应哈希索引等信息。

#### **查看Buffer Pool的状态信息**

MySQL给我们提供了SHOW ENGINE INNODB STATUS语句来查看关于InnoDB存储引擎运行过程中的一些状态信息，其中就包括Buffer Pool的一些信息，我们看一下（为了突出重点，我们只把输出中关于Buffer Pool的部分提取了出来）：

**SHOW ENGINE INNODB STATUS\G**    ![img](/Users/jiusonghuang/pic-md/20211229233106.png)

这里边的每个值都代表什么意思如下，知道即可：

Total memory allocated：代表Buffer Pool向操作系统申请的连续内存空间大小，包括全部控制块、缓存页、以及碎片的大小。

Dictionary memory allocated：为数据字典信息分配的内存空间大小，注意这个内存空间和Buffer Pool没啥关系，不包括在Total memory allocated中。

Buffer pool size：代表该Buffer Pool可以容纳多少缓存页，注意，单位是页！

Free buffers：代表当前Buffer Pool还有多少空闲缓存页，也就是free链表中还有多少个节点。

Database pages：代表LRU链表中的页的数量，包含young和old两个区域的节点数量。

Old database pages：代表LRU链表old区域的节点数量。

Modified db pages：代表脏页数量，也就是flush链表中节点的数量。

Pending reads：正在等待从磁盘上加载到Buffer Pool中的页面数量。

当准备从磁盘中加载某个页面时，会先为这个页面在Buffer Pool中分配一个缓存页以及它对应的控制块，然后把这个控制块添加到LRU的old区域的头部，但是这个时候真正的磁盘页并没有被加载进来，Pending reads的值会跟着加1。

Pending writes LRU：即将从LRU链表中刷新到磁盘中的页面数量。

Pending writes flush list：即将从flush链表中刷新到磁盘中的页面数量。

Pending writes single page：即将以单个页面的形式刷新到磁盘中的页面数量。

Pages made young：代表LRU链表中曾经从old区域移动到young区域头部的节点数量。

Page made not young：在将innodb_old_blocks_time设置的值大于0时，首次访问或者后续访问某个处在old区域的节点时由于不符合时间间隔的限制而不能将其移动到young区域头部时，Page made not young的值会加1。

youngs/s：代表每秒从old区域被移动到young区域头部的节点数量。

non-youngs/s：代表每秒由于不满足时间限制而不能从old区域移动到young区域头部的节点数量。

Pages read、created、written：代表读取，创建，写入了多少页。后边跟着读取、创建、写入的速率。

Buffer pool hit rate：表示在过去某段时间，平均访问1000次页面，有多少次该页面已经被缓存到Buffer Pool了。

young-making rate：表示在过去某段时间，平均访问1000次页面，有多少次访问使页面移动到young区域的头部了。

not (young-making rate)：表示在过去某段时间，平均访问1000次页面，有多少次访问没有使页面移动到young区域的头部。

LRU len：代表LRU链表中节点的数量。

unzip_LRU：代表unzip_LRU链表中节点的数量。

I/O sum：最近50s读取磁盘页的总数。

I/O cur：现在正在读取的磁盘页数量。

I/O unzip sum：最近50s解压的页面数量。

I/O unzip cur：正在解压的页面数量。

**InnoDB体系图补充说明**

  ![img](/Users/jiusonghuang/pic-md/20211229233130.png)

其中的Insert/Change Buffer主要是用于对二级索引的写入优化，Undo空间则是undo日志一般放在系统表空间，但是通过参数配置后，也可以用独立表空间存放，所以用虚线表示。通用表空间和独立表空间不同，通用表空间是允许多个表存储数据的共享表空间。
