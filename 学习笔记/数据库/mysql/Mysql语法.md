# Mysql sql 语法

## mysql语法

## • SELECT - 从数据库中提取数据
• UPDATE - 更新数据库中的数据<br/>
• DELETE - 从数据库中删除数据<br/>
• INSERT INTO - 向数据库中插入新数据<br/>
• CREATE DATABASE - 创建新数据库<br/>
• ALTER DATABASE - 修改数据库<br/>
• CREATE TABLE - 创建新表<br/>
• ALTER TABLE - 变更（改变）数据库表<br/>
• DROP TABLE - 删除表<br/>
• CREATE INDEX - 创建索引（搜索键）<br/>
• DROP INDEX - 删除索引<br/>

### SELECT语句和WHERE子句

　句法：

```sql
SELECT [*] FROM [TableName] WHERE [condition1]
```

### SELECT语句与WHERE和/或子句

　句法：

```sql
SELECT [*] FROM [TableName] WHERE [condition1] [AND [OR]] [condition2]...
```

### SELECT语句与ORDER BY

　句法：

```sql
SELECT column_name() FROM  table_name   BY   column_name()  ASC or  DESC  
```

SELECT  DISTINCT(区分)子句

　句法：

```sql
SELECT DISTINCT  column1, column2....columnN   table_name;  
```

SELECT  IN子句

　句法：

```sql
SELECT  column1, column2....columnN FROM    table_name  WHERE   column_name   IN (val-1, val-2,...val-N);
```

### SELECT LIKE (类)子句

　句法：

```sql
SELECT  column1, column2....columnN  FROM    table_name WHERE  column_name LIKE { PATTERN };
```




### SELECT  COUNT(计数)子句

　句法：

```sql
SELECT COUNT(column_name) FROM   table_name WHERE  CONDITION;
```

SELECT与HAVING子句

　句法：

```sql
SELECT SUM(column_name) FROM   table_name WHERE  CONDITION GROUP BY column_name HAVING (arithematic function condition);
```

### INSERT INTO语句

　句法：

```sql
INSERT INTO  table_name (column , column1, column2, column3, ...)  VALUES  ( value, value1, value2, value3 ...)
```

### UPDATE语句

　句法：

```sql
UPDATE  table_name  SET column = value , column1=value1,... WHERE  someColumn=someValue
```


### DELETE语句

　句法：

```sql
DELETE FROM tableName WHERE someColumn = someValue
```

ANY关键字
假设any内部的查询语句返回的结果个数是三个，如:result1,result2,result3,那么，

```sql
select ...from ... where a > any(...);
->select ...from ... where a > result1 or a > result2 or a > result3;
```

2.ALL关键字
ALL关键字与any关键字类似，只不过上面的or改成and。即:

```sql
select ...from ... where a > all(...);
->select ...from ... where a > result1 and a > result2 and a > result3;
```

3.SOME关键字
some关键字和any关键字是一样的功能。所以:

```sql
select ...from ... where a > some(...);
->select ...from ... where a > result1 or a > result2 or a > result3;
```

### SQL IN 语法

```sql
SELECT column_name(s) FROM table_name WHERE column_name IN (value1, value2, ...);
```

### 或者

```sql
SELECT column_name(s) FROM table_name WHERE column_name IN (SELECT STATEMENT);
```

## SQL 连接（Joins）


　SQL join 用于把来自两个或多个表的行结合起来。

### SQL JOIN


　SQL JOIN 子句用于把来自两个或多个表的行结合起来，基于这些表之间的共同字段。
　简单地说，就是先确定一个主表作为结果集，然后，把其他表的行有选择性地“连接”在主表结果集上。 

　最常见的 JOIN 类型：SQL INNER JOIN（简单的 JOIN）。 SQL INNER JOIN 从多个表中返回满足 JOIN 条件的所有行。

```sql
SELECT Orders.OrderID, Customers.CustomerName, Orders.OrderDate FROM Orders INNER JOIN Customers ON Orders.CustomerID=Customers.CustomerID;
```

值得注意的是，连接是在WHERE子句中执行的。
　可以使用几个操作符连接表，例如=、<、>、<=、>=、！=、BETWEEN、LIKE、 和NOT。

### 不同的 SQL JOIN

　在我们继续讲解实例之前，我们先列出您可以使用的不同的 SQL JOIN 类型：
• INNER JOIN：如果表中有至少一个匹配，则返回行
• LEFT JOIN：即使右表中没有匹配，也从左表返回所有的行
• RIGHT JOIN：即使左表中没有匹配，也从右表返回所有的行
• FULL JOIN：只要其中一个表中存在匹配，则返回行
• **SELF JOIN**：用于将表连接到自己，就好像该表是两个表一样，临时重命名了SQL语句中的至少一个表 

• **CARTESIAN JOIN**：从两个或多个连接表返回记录集的笛卡儿积 

|          |                                                              |
| -------- | ------------------------------------------------------------ |
| GROUP BY | SELECT column_name, aggregate_function(column_name) FROM table_name WHERE column_name operator value GROUP BY column_name |
| HAVING   | SELECT column_name, aggregate_function(column_name) FROM table_name WHERE column_name operator value GROUP BY column_name HAVING aggregate_function(column_name) operator value |

## SQL 处理重复数据


　有时候，数据表中会存在相同的记录。在获取表中记录时，相较于取得重复记录来说，取得唯一的记录显然更有意义。
　我们之前讨论过的 SQL DISTINCT 关键字，与 SELECT 语句一起使用可以时，可以达到消除所有重复记录，只返回唯一记录的目的。

语法：
　利用 DISTINCT 关键字来消除重复记录的基本语法如下所示：

```sql
SELECT DISTINCT  column1, column2,.....columnN  FROM  table_name  WHERE  [condition]
```

## SQL 注入

　如果你从网页中获取用户输入，并将其插入到 SQL 数据库中的话，那么你很可能已经暴露于一种被称作 SQL 注入的安全风险之下了。
　本节将会教你如何防止 SQL 注入，以及如何保护 Perl 这样的服务器端脚本中的程序和 SQL 语句。
　注入通常发生在获取用户输入的时候，例如预期得到用户的名字，但是得到的却是一段很可能会在你不知情的情况下运行的 SQL 语句。
　绝对不要相信用户提供的数据，处理这些数据之前必须进行验证；通常，验证工作由模式匹配来完成。
　下面的例子中，name 仅限由字母、数字和下划线组成，并且长度在 8 到 20 之间（你可以根据需要修改这些规则）。

```
if (preg_match("/^\w{8,20}$/", $_GET['username'], $matches)){   
		$result = mysql_query("SELECT * FROM CUSTOMERS  WHERE name=$matches[0]");
	}else { 
    	echo "user name not accepted";
    }
```

　为了展示问题所在，请考虑下面这段代码：

```
// supposed input$name = "Qadir'; 
DELETEFROM CUSTOMERS;";
mysql_query("SELECT * FROM CUSTOMSRS WHEREname='{$name}'");
```

　下面的函数调用本来是要从 CUSTOMERS 表中取得 name 字段与用户给定的输入相匹配的记录。通常情况下，$name 只包含字母和数字，或许还有空格，例如字符串 ilia。但是，这里通过在 $name 上附加一段全新的查询语句，将原有的函数调用变为了数据库的灾难：注入的 DELETE 语句将会删除表中所有的记录。
　幸运的是，如果你在使用　MySQL 的话，mysql_query() 函数不允许查询堆积（query stacking），或者说在一次函数调用中执行多次 SQL 查询。如果你试图进行堆积式查询的话，函数调用将会失败。
　然而，其他的 PHP 数据库扩展，例如 SQLite 和 PostgreSQL 会愉快地接受堆积式查询，执行字符串中所有的查询，并由此产生严重的安全问题。

## 阻止 SQL 注入

　你可以在 Perl 或者 PHP 等脚本语言中巧妙地处理所有的转义字符。PHP 的 MySQL 扩展提供了一个 mysql_real_escape_string() 函数，来转义那些对 MySQL 有特殊意义的字符。

```sql
if (get_magic_quotes_gpc()) {
	$name = stripslashes($name);
}
$name = mysql_real_escape_string($name);
mysql_query("SELECT * FROM CUSTOMERS WHERE name='{$name}'");
```




## LIKE 困境

　要破解 LIKE 困境，必须有一种专门的转义机制，将用户提供的 '%' 和 '_' 转换为字面值。为此你可以使用 addcslashes() 函数，该函数允许指定要进行转义的字符的范围。

```sql
$sub = addcslashes(mysql_real_escape_string("%str"), "%_");
// $sub == \%str\_
mysql_query("SELECT * FROM messages   WHERE subject LIKE '{$sub}%'");
```



## SQL HAVING 子句

　HAVING 子句使你能够指定过滤条件，从而控制查询结果中哪些组可以出现在最终结果里面。所以having中指定的列必须是select 返回的结果集中的字段。
　WHERE 子句对被选择的列施加条件，而 HAVING 子句则对 GROUP BY 子句所产生的组施加条件。

语法  
　下面可以看到 HAVING 子句在 SEL ECT 查询中的位置：

```sql
SELECT FROM WHERE GROUP BY  HAVING ORDER BY
```

在 SELECT 查询中，HAVING 子句必须紧随 GROUP BY 子句，并出现在 ORDER BY 子句（如果有的话）之前。
带有 HAVING 子句的 SELECT 语句的语法如下所示：

```sql
SELECT  column1, column2    FROM  table1, table2 WHERE  [ conditions ]  GROUP BY  column1, column2  HAVING [ conditions ] ORDER BY  column1, column2
```



## SQL COUNT() 函数

COUNT() 函数返回匹配指定条件的行数。

SQL COUNT(column_name) 语法COUNT(column_name) 函数返回指定列的值的数目（NULL 不计入）

## Case When

来自MySQL触发器里的流程控制语句 知识。

MySQL 的 case when 的语法有两种：

1. 简单函数 
   `CASE [col_name] WHEN [value1] THEN [result1]…ELSE [default] END`
2. 搜索函数 
   `CASE WHEN [expr] THEN [result1]…ELSE [default] END`

```sql
SELECT
	count( * ) AS allCount,
	sum( CASE WHEN pr.state = '1' THEN 1 ELSE 0 END ) AS "normalCount",
	sum( CASE WHEN pr.state = '2' THEN 1 ELSE 0 END ) AS "exCount" 
FROM
	patrol_rec pr 
GROUP BY
	pr."state"
```

