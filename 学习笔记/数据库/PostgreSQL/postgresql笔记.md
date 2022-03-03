# 14.1. 使用`EXPLAIN`

PostgreSQL为它收到的每个查询设计一个**查询计划**。选择正确的计划来匹配查询结构和数据的属性对于良好的性能来说绝对是至关重要的，因此系统包含一个复杂的*计划器*来尝试选择好的计划。您可以使用[EXPLAIN](https://www.postgresql.org/docs/9.4/sql-explain.html)命令查看规划器为任何查询创建的查询计划。计划阅读是一门需要一定经验才能掌握的艺术，但本节试图涵盖基础知识。

本节中的示例是在使用 9.3 开发源进行`VACUUM ANALYZE`后从回归测试数据库中提取的。如果您自己尝试这些示例，您应该能够获得类似的结果，但您的估计成本和行数可能略有不同，因为`ANALYZE`的统计数据是随机样本而不是精确的，并且因为成本本质上有点依赖于平台。

这些示例使用`EXPLAIN`的默认“文本”输出格式，该格式紧凑且便于人类阅读。如果您想将`EXPLAIN`的输出提供给程序进行进一步分析，您应该改用其中一种机器可读的输出格式（XML、JSON 或 YAML）。

## 14.1.1. `解释`基础

查询计划的结构是*计划节点*树。树底层的节点是扫描节点：它们从表中返回原始行。不同的表访问方法有不同类型的扫描节点：顺序扫描、索引扫描和位图索引扫描。还有非表行源，例如`VALUES`子句和`FROM 中的`集合返回函数，它们有自己的扫描节点类型。如果查询需要对原始行进行连接、聚合、排序或其他操作，那么在扫描节点之上会有额外的节点来执行这些操作。同样，通常有不止一种可能的方法来执行这些操作，因此这里也可以出现不同的节点类型。`EXPLAIN`的输出``计划树中的每个节点都有一行，显示基本节点类型以及计划者为执行该计划节点所做的成本估计。可能会出现其他行，从节点的摘要行缩进，以显示节点的其他属性。第一行（最顶层节点的摘要行）是计划的估计总执行成本；规划者寻求最小化的正是这个数字。

这是一个简单的例子，只是为了显示输出的样子：

```
EXPLAIN SELECT * FROM tenk1;

                         QUERY PLAN
-------------------------------------------------------------
 Seq Scan on tenk1  (cost=0.00..458.00 rows=10000 width=244)
```

由于这个查询没有`WHERE`子句，它必须扫描表的所有行，所以规划器选择使用简单的顺序扫描计划。括号中引用的数字是（从左到右）：

- 估计启动成本。这是输出阶段可以开始之前花费的时间，例如，在排序节点中进行排序的时间。
- 估计总成本。这是在计划节点运行完成的假设下陈述的，即检索所有可用行。实际上，节点的父节点可能会停止读取所有可用行（请参阅下面的`LIMIT`示例）。
- 此计划节点输出的估计行数。同样，假设节点运行完成。
- 此计划节点输出的行的估计平均宽度（以字节为单位）。

成本以由计划者的成本参数确定的任意单位进行衡量（参见[第 18.7.2 节](https://www.postgresql.org/docs/9.4/runtime-config-query.html#RUNTIME-CONFIG-QUERY-CONSTANTS)）。传统的做法是以磁盘页面获取为单位来衡量成本；也就是说，[seq_page_cost](https://www.postgresql.org/docs/9.4/runtime-config-query.html#GUC-SEQ-PAGE-COST)通常设置为`1.0`，而其他成本参数则[与之](https://www.postgresql.org/docs/9.4/runtime-config-query.html#GUC-SEQ-PAGE-COST)相关。本节中的示例使用默认成本参数运行。

重要的是要了解上层节点的成本包括其所有子节点的成本。同样重要的是要意识到成本只反映了计划者关心的事情。特别是，成本不考虑将结果行传输到客户端所花费的时间，这可能是实际经过时间的一个重要因素；但是计划者忽略了它，因为它不能通过改变计划来改变它。（我们相信，每个正确的计划都会输出相同的行集。）

的`行`值是有点麻烦，因为它是不受计划节点处理或扫描行的数量，而是由节点发射的数。这通常小于扫描的数量，这是由在节点上应用的任何`WHERE 子句`条件过滤的结果。理想情况下，顶级行估计将近似于查询实际返回、更新或删除的行数。

回到我们的例子：

```
EXPLAIN SELECT * FROM tenk1;

                         QUERY PLAN
-------------------------------------------------------------
 Seq Scan on tenk1  (cost=0.00..458.00 rows=10000 width=244)
```

这些数字的推导非常简单。如果你这样做：

```
SELECT relpages, reltuples FROM pg_class WHERE relname = 'tenk1';
```

你会发现它`tenk1`有 358 个磁盘页和 10000 行。估计成本计算为（读取的磁盘页面 * [seq_page_cost](https://www.postgresql.org/docs/9.4/runtime-config-query.html#GUC-SEQ-PAGE-COST)）+（扫描的行数 * [cpu_tuple_cost](https://www.postgresql.org/docs/9.4/runtime-config-query.html#GUC-CPU-TUPLE-COST)）。默认情况下，`seq_page_cost`为 1.0，`cpu_tuple_cost`为 0.01，因此估计成本为 (358 * 1.0) + (10000 * 0.01) = 458。

现在让我们修改查询以添加`WHERE`条件：

```
EXPLAIN SELECT * FROM tenk1 WHERE unique1 < 7000;

                         QUERY PLAN
------------------------------------------------------------
 Seq Scan on tenk1  (cost=0.00..483.00 rows=7001 width=244)
   Filter: (unique1 < 7000)
```

请注意，`EXPLAIN`输出显示`WHERE`子句被应用为附加到 Seq Scan 计划节点的“过滤器”条件。这意味着计划节点检查它扫描的每一行的条件，并且只输出通过条件的那些。由于`WHERE`子句，输出行的估计已减少。但是，扫描仍然需要访问所有 10000 行，因此成本并没有降低；事实上，它已经上升了一点（准确地说是 10000 * [cpu_operator_cost](https://www.postgresql.org/docs/9.4/runtime-config-query.html#GUC-CPU-OPERATOR-COST)）以反映检查`WHERE`条件所花费的额外 CPU 时间。

此查询将选择的实际行数为 7000，但`行`估计值只是近似值。如果你试图重复这个实验，你可能会得到一个稍微不同的估计；此外，它可以在每个`ANALYZE`命令之后更改，因为`ANALYZE`生成的统计数据来自表的随机样本。

现在，让我们使条件更具限制性：

```
EXPLAIN SELECT * FROM tenk1 WHERE unique1 < 100; 

                                  查询计划
------------------------------------------------ ------------------------------ 
 Tenk1 上的位图堆扫描（成本=5.07..229.20 行=101 宽度=244）
   重新检查Cond: (unique1 < 100) 
   -> Tenk1_unique1 上的位图索引扫描 (cost=0.00..5.04 rows=101 width=0) 
         Index Cond: (unique1 < 100)
```



```
EXPLAIN SELECT * FROM tenk1 WHERE unique1 < 100;

                                  QUERY PLAN
------------------------------------------------------------------------------
 Bitmap Heap Scan on tenk1  (cost=5.07..229.20 rows=101 width=244)
   Recheck Cond: (unique1 < 100)
   ->  Bitmap Index Scan on tenk1_unique1  (cost=0.00..5.04 rows=101 width=0)
         Index Cond: (unique1 < 100)
```

这里规划器决定使用两步计划：子计划节点访问索引以找到匹配索引条件的行的位置，然后上层计划节点实际上从表本身中获取这些行。单独获取行比顺序读取要昂贵得多，但由于并非必须访问表的所有页面，因此这仍然比顺序扫描便宜。（使用两个计划级别的原因是上计划节点在读取它们之前将索引标识的行位置按物理顺序排序，以最小化单独获取的成本。节点名称中提到的“位图”是一种机制进行排序。）

现在让我们向`WHERE`子句添加另一个条件：

```
解释 SELECT * FROM tenk1 WHERE unique1 < 100 AND stringu1 = 'xxx'; 

                                  查询计划
------------------------------------------------ ------------------------------ 
 Tenk1 上的位图堆扫描 (cost=5.04..229.43 rows=1 width=244)
   重新检查Cond: (unique1 < 100) 
   Filter: (stringu1 = 'xxx'::name) 
   -> Tenk1_unique1 上的位图索引扫描 (cost=0.00..5.04 rows=101 width=0) 
         Index Cond: (unique1 < 100)
```



```
EXPLAIN SELECT * FROM tenk1 WHERE unique1 < 100 AND stringu1 = 'xxx';

                                  QUERY PLAN
------------------------------------------------------------------------------
 Bitmap Heap Scan on tenk1  (cost=5.04..229.43 rows=1 width=244)
   Recheck Cond: (unique1 < 100)
   Filter: (stringu1 = 'xxx'::name)
   ->  Bitmap Index Scan on tenk1_unique1  (cost=0.00..5.04 rows=101 width=0)
         Index Cond: (unique1 < 100)
```

添加的条件`stringu1 = 'xxx'`减少了输出行计数估计，但不会降低成本，因为我们仍然必须访问相同的行集。请注意，`stringu1`子句不能用作索引条件，因为该索引仅位于`unique1`列上。相反，它被用作索引检索的行的过滤器。因此，成本实际上略有增加以反映这种额外的检查。

在某些情况下，规划器会更喜欢“简单”的索引扫描计划：

```
解释 SELECT * FROM tenk1 WHERE unique1 = 42; 

                                 查询计划
------------------------------------------------ -----------------------------
 索引 在tenk1 上使用tenk1_unique1 扫描（成本=0.29..8.30 行=1 宽度=244）
   索引条件：（唯一 1 = 42
```



```
EXPLAIN SELECT * FROM tenk1 WHERE unique1 = 42;

                                 QUERY PLAN
-----------------------------------------------------------------------------
 Index Scan using tenk1_unique1 on tenk1  (cost=0.29..8.30 rows=1 width=244)
   Index Cond: (unique1 = 42)
```

在这种类型的计划中，表行是按索引顺序获取的，这使得它们的读取成本更高，但数量太少以至于对行位置进行排序的额外成本是不值得的。对于仅获取一行的查询，您最常看到这种计划类型。它也常用于具有与索引顺序匹配的`ORDER BY`条件的查询，因为这样就不需要额外的排序步骤来满足`ORDER BY`。

如果在`WHERE 中`引用的几个列上有单独的索引，规划器可能会选择使用索引的 AND 或 OR 组合：

```
EXPLAIN SELECT * FROM tenk1 WHERE unique1 < 100 AND unique2 > 9000; 

                                     查询计划
------------------------------------------------ -------------------------------------
 位图堆扫描对tenk1 (cost=25.08..60.21 行=10 width=244) 
   Recheck Cond: ((unique1 < 100) AND (unique2 > 9000)) 
   -> BitmapAnd (cost=25.08..25.08 rows=10 width=0) 
         -> Bitmap Index Scan on tenk1_unique1 (cost=0.00) ..5.04 rows=101 width=0) 
               Index Cond: (unique1 < 100) 
         -> 位图索引扫描tenk1_unique2 (cost=0.00..19.78 rows=999 width=0) 
               Index Cond: (unique2 > 9000)
```



```
EXPLAIN SELECT * FROM tenk1 WHERE unique1 < 100 AND unique2 > 9000;

                                     QUERY PLAN
-------------------------------------------------------------------------------------
 Bitmap Heap Scan on tenk1  (cost=25.08..60.21 rows=10 width=244)
   Recheck Cond: ((unique1 < 100) AND (unique2 > 9000))
   ->  BitmapAnd  (cost=25.08..25.08 rows=10 width=0)
         ->  Bitmap Index Scan on tenk1_unique1  (cost=0.00..5.04 rows=101 width=0)
               Index Cond: (unique1 < 100)
         ->  Bitmap Index Scan on tenk1_unique2  (cost=0.00..19.78 rows=999 width=0)
               Index Cond: (unique2 > 9000)
```

但这需要访问两个索引，因此与仅使用一个索引并将另一个条件视为过滤器相比，这不一定是一种胜利。如果您改变所涉及的范围，您会看到计划相应地发生变化。

这是一个显示`LIMIT`效果的示例：

```
EXPLAIN SELECT * FROM tenk1 WHERE unique1 < 100 AND unique2 > 9000 LIMIT 2; 

                                     查询计划
------------------------------------------------ -------------------------------------
 限制（成本=0.29..14.48 行=2 宽度= 244) 
   -> 在tenk1 上使用tenk1_unique2 进行索引扫描（成本=0.29..71.27 行=10 宽度=244）
         索引条件：（unique2 > 9000）
         过滤器：（unique1 < 100）
```



```
EXPLAIN SELECT * FROM tenk1 WHERE unique1 < 100 AND unique2 > 9000 LIMIT 2;

                                     QUERY PLAN
-------------------------------------------------------------------------------------
 Limit  (cost=0.29..14.48 rows=2 width=244)
   ->  Index Scan using tenk1_unique2 on tenk1  (cost=0.29..71.27 rows=10 width=244)
         Index Cond: (unique2 > 9000)
         Filter: (unique1 < 100)
```

这是与上面相同的查询，但我们添加了一个`LIMIT`以便不需要检索所有行，并且计划器改变了要做什么的想法。请注意，索引扫描节点的总成本和行数显示为好像它已运行完成。但是，Limit 节点预计会在仅检索这些行的五分之一后停止，因此其总成本仅为其五分之一，这就是查询的实际估计成本。此计划优于向先前计划添加限制节点，因为限制无法避免支付位图扫描的启动成本，因此使用该方法的总成本将超过 25 个单位。

让我们尝试使用我们一直在讨论的列连接两个表：

```
说明 SELECT * 
FROM tenk1 t1, tenk2 t2 
WHERE t1.unique1 < 10 AND t1.unique2 = t2.unique2; 

                                      查询计划
------------------------------------------------ --------------------------------------
 嵌套循环（成本=4.65..118.62 行=10 width=488) 
   -> Tenk1 t1 上的位图堆扫描 (cost=4.36..39.47 rows=10 width=244) Recheck 
         Cond: (unique1 < 10) 
         -> Tenk1_unique1 上的 Bitmap Index Scan (cost=0.00..4.36 rows= 10 width=0) 
               Index Cond: (unique1 < 10) 
   -> Index Scan using tenk2_unique2 on tenk2 t2 (cost=0.29..7.91 rows=1 width=244) 
         Index Cond: (unique2 = t1.unique2)
```



```
EXPLAIN SELECT *
FROM tenk1 t1, tenk2 t2
WHERE t1.unique1 < 10 AND t1.unique2 = t2.unique2;

                                      QUERY PLAN
--------------------------------------------------------------------------------------
 Nested Loop  (cost=4.65..118.62 rows=10 width=488)
   ->  Bitmap Heap Scan on tenk1 t1  (cost=4.36..39.47 rows=10 width=244)
         Recheck Cond: (unique1 < 10)
         ->  Bitmap Index Scan on tenk1_unique1  (cost=0.00..4.36 rows=10 width=0)
               Index Cond: (unique1 < 10)
   ->  Index Scan using tenk2_unique2 on tenk2 t2  (cost=0.29..7.91 rows=1 width=244)
         Index Cond: (unique2 = t1.unique2)
```

在这个计划中，我们有一个嵌套循环连接节点，其中两个表扫描作为输入或子节点。节点摘要行的缩进反映了计划树结构。连接的第一个或“外部”子节点是一个位图扫描，类似于我们之前看到的那些。它的成本和行数与我们从`SELECT ... WHERE unique1 < 10 中`得到的相同，因为我们在该节点上应用了`WHERE`子句`unique1 < 10`。该`t1.unique2 = t2.unique2`条款还不相关，因此它不影响外层扫描的行数。嵌套循环连接节点将运行其第二个或“内部”对于从外部孩子获得的每一行，child 一次。当前外行的列值可以插入到内层扫描中；在这里，来自`外行的 t1.unique2`值可用，因此我们得到一个计划和成本，类似于我们在上面看到的简单`SELECT ... WHERE t2.unique2 =常量`情况。（估计成本实际上比上面看到的要低一些，因为在`t2`上重复索引扫描期间预计会发生缓存。）然后循环节点的成本根据外扫描，加上每个外行的内扫描重复一次（10 * 7.91，这里），加上一点 CPU 时间用于连接处理。

在此示例中，连接的输出行数与两次扫描的行数的乘积相同，但并非在所有情况下都是如此，因为可以有额外的`WHERE`子句提及两个表，因此只能在连接点应用, 不向任一输入扫描。下面是一个例子：

```
EXPLAIN SELECT * 
FROM tenk1 t1,tenk2 t2 
WHERE t1.unique1 < 10 AND t2.unique2 < 10 AND t1.hundred < t2.hundred; 

                                         查询计划
------------------------------------------------ ---------------------------------------------
 嵌套循环（成本= 4.65..49.46 rows=33 width=488) 
   Join Filter: (t1.hundred < t2.hundred) 
   -> Bitmap Heap Scan on tenk1 t1 (cost=4.36..39.47 rows=10 width=244) Recheck 
         Cond: (unique1) < 10) 
         -> 位图索引扫描对tenk1_unique1 (cost=0.00..4.36 rows=10 width=0) 
               Index Cond: (unique1 < 10) 
   -> Materialise (cost=0.29..8.51 rows=10 width=244)
         -> 在tenk2 t2 上使用tenk2_unique2 进行索引扫描（成本=0.29..8.46 行=10 宽度=244）
               索引条件：（unique2 < 10）
```



```
EXPLAIN SELECT *
FROM tenk1 t1, tenk2 t2
WHERE t1.unique1 < 10 AND t2.unique2 < 10 AND t1.hundred < t2.hundred;

                                         QUERY PLAN
---------------------------------------------------------------------------------------------
 Nested Loop  (cost=4.65..49.46 rows=33 width=488)
   Join Filter: (t1.hundred < t2.hundred)
   ->  Bitmap Heap Scan on tenk1 t1  (cost=4.36..39.47 rows=10 width=244)
         Recheck Cond: (unique1 < 10)
         ->  Bitmap Index Scan on tenk1_unique1  (cost=0.00..4.36 rows=10 width=0)
               Index Cond: (unique1 < 10)
   ->  Materialize  (cost=0.29..8.51 rows=10 width=244)
         ->  Index Scan using tenk2_unique2 on tenk2 t2  (cost=0.29..8.46 rows=10 width=244)
               Index Cond: (unique2 < 10)
```

条件`t1.hundred < t2.hundred`不能在`tenk2_unique2`索引中测试，所以它应用于连接节点。这会减少连接节点的估计输出行数，但不会更改任一输入扫描。

请注意，此处规划器已选择“具体化”连接的内部关系，方法是在其顶部放置一个具体化计划节点。这意味着`t2`索引扫描将只执行一次，即使嵌套循环连接节点需要读取该数据十次，对来自外部关系的每一行读取一次。Materialize 节点在读取数据时将数据保存在内存中，然后在每次后续传递时从内存中返回数据。

在处理外部连接时，您可能会看到连接计划节点同时附加了“连接过滤器”和普通的“过滤器”条件。联接筛选条件来自外部联接的`ON`子句，因此联接筛选条件失败的行仍可能作为空扩展行发出。但是在外连接规则之后应用了一个简单的过滤条件，因此可以无条件地删除行。在内部联接中，这些类型的过滤器之间没有语义差异。

如果我们稍微改变查询的选择性，我们可能会得到一个非常不同的连接计划：

```
解释 SELECT * 
FROM tenk1 t1, tenk2 t2 
WHERE t1.unique1 < 100 AND t1.unique2 = t2.unique2; 

                                        查询计划
------------------------------------------------ ------------------------------------------ 
 Hash Join (cost=230.47.. 713.98 rows=101 width=488) 
   Hash Cond: (t2.unique2 = t1.unique2) 
   -> Seq Scan on tenk2 t2 (cost=0.00..445.00 rows=10000 width=244) 
   -> Hash (cost=229.20.. 229.20 行=101 宽度=244) 
         -> 在tenk1 t1 上进行位图堆扫描（成本=5.07..229.20 行=101 宽度=244）
               重新检查条件：（unique1 < 100）
               -> 在tenk1_unique1 上进行位图索引扫描（成本=0.00。 .5.04 行=101 宽度=0)
                     索引条件：（unique1 < 100）
```



```
EXPLAIN SELECT *
FROM tenk1 t1, tenk2 t2
WHERE t1.unique1 < 100 AND t1.unique2 = t2.unique2;

                                        QUERY PLAN
------------------------------------------------------------------------------------------
 Hash Join  (cost=230.47..713.98 rows=101 width=488)
   Hash Cond: (t2.unique2 = t1.unique2)
   ->  Seq Scan on tenk2 t2  (cost=0.00..445.00 rows=10000 width=244)
   ->  Hash  (cost=229.20..229.20 rows=101 width=244)
         ->  Bitmap Heap Scan on tenk1 t1  (cost=5.07..229.20 rows=101 width=244)
               Recheck Cond: (unique1 < 100)
               ->  Bitmap Index Scan on tenk1_unique1  (cost=0.00..5.04 rows=101 width=0)
                     Index Cond: (unique1 < 100)
```

在这里，规划器选择使用散列连接，其中一个表的行被输入到内存中的散列表中，然后扫描另一个表并探测散列表以查找每一行的匹配项。再次注意缩进如何反映计划结构：`tenk1`上的位图扫描是哈希节点的输入，它构建哈希表。然后将其返回到 Hash Join 节点，该节点从其外部子计划中读取行并在哈希表中搜索每一行。

另一种可能的连接类型是合并连接，如下所示：

```
解释 SELECT * 
FROM tenk1 t1, onek t2 
WHERE t1.unique1 < 100 AND t1.unique2 = t2.unique2; 

                                        查询计划
------------------------------------------------ ------------------------------------------
 合并加入 (cost=198.11.. 268.19 rows=10 width=488) 
   Merge Cond: (t1.unique2 = t2.unique2) 
   -> Index Scan using tenk1_unique2 on tenk1 t1 (cost=0.29..656.28 rows=101 width=244) 
         Filter: (unique1 < 100) 
   -> Sort (cost=197.83..200.33 rows=1000 width=244) 
         Sort Key: t2.unique2 
         -> Seq Scan on onek t2 (cost=0.00..148.00 rows=1000 width=244)
```



```
EXPLAIN SELECT *
FROM tenk1 t1, onek t2
WHERE t1.unique1 < 100 AND t1.unique2 = t2.unique2;

                                        QUERY PLAN
------------------------------------------------------------------------------------------
 Merge Join  (cost=198.11..268.19 rows=10 width=488)
   Merge Cond: (t1.unique2 = t2.unique2)
   ->  Index Scan using tenk1_unique2 on tenk1 t1  (cost=0.29..656.28 rows=101 width=244)
         Filter: (unique1 < 100)
   ->  Sort  (cost=197.83..200.33 rows=1000 width=244)
         Sort Key: t2.unique2
         ->  Seq Scan on onek t2  (cost=0.00..148.00 rows=1000 width=244)
```

合并连接要求其输入数据按连接键排序。在此计划中，`tenk1`数据通过使用索引扫描以正确顺序访问行进行排序，但对`onek`首选顺序扫描和排序，因为该表中有更多行要访问。（由于索引扫描需要非顺序磁盘访问，因此在对多行进行排序时，顺序扫描和排序经常胜过索引扫描。）

查看变体计划的一种方法是使用[第 18.7.1 节中](https://www.postgresql.org/docs/9.4/runtime-config-query.html#RUNTIME-CONFIG-QUERY-ENABLE)描述的启用/禁用标志强制计划器忽略它认为最便宜的任何策略。（这是一个粗略的工具，但很有用。另见[第 14.3 节](https://www.postgresql.org/docs/9.4/explicit-joins.html)。）例如，如果我们不相信顺序扫描和排序是在前面的例子中处理 table `onek`的最佳方法，我们可以尝试

```
SET enable_sort = off; 

解释 SELECT * 
FROM tenk1 t1, onek t2 
WHERE t1.unique1 < 100 AND t1.unique2 = t2.unique2; 

                                        查询计划
------------------------------------------------ ------------------------------------------
 合并连接 (cost=0.56.. 292.65 rows=10 width=488) 
   Merge Cond: (t1.unique2 = t2.unique2) 
   -> Index Scan using tenk1_unique2 on tenk1 t1 (cost=0.29..656.28 rows=101 width=244) 
         Filter: (unique1 < 100) 
   -> 在 onek t2 上使用 onek_unique2 进行索引扫描（成本=0.28..224.79 行=1000 宽度=244）
```



```
SET enable_sort = off;

EXPLAIN SELECT *
FROM tenk1 t1, onek t2
WHERE t1.unique1 < 100 AND t1.unique2 = t2.unique2;

                                        QUERY PLAN
------------------------------------------------------------------------------------------
 Merge Join  (cost=0.56..292.65 rows=10 width=488)
   Merge Cond: (t1.unique2 = t2.unique2)
   ->  Index Scan using tenk1_unique2 on tenk1 t1  (cost=0.29..656.28 rows=101 width=244)
         Filter: (unique1 < 100)
   ->  Index Scan using onek_unique2 on onek t2  (cost=0.28..224.79 rows=1000 width=244)
```

这表明规划器认为通过索引扫描对`onek`进行排序比顺序扫描和排序昂贵约 12%。当然，下一个问题是这是否正确。我们可以使用`EXPLAIN ANALYZE`进行调查，如下所述。

## 14.1.2. `解释分析`

可以使用`EXPLAIN`的`ANALYZE`选项检查规划器估计的准确性。使用此选项，`EXPLAIN`实际执行查询，然后显示每个计划节点内累积的真实行数和真实运行时间，以及普通`EXPLAIN`显示的相同估计值。例如，我们可能会得到这样的结果：

```
EXPLAIN ANALYZE SELECT * 
FROM tenk1 t1, tenk2 t2 
WHERE t1.unique1 < 10 AND t1.unique2 = t2.unique2; 

                                                           查询计划
------------------------------------------------ -------------------------------------------------- ------------------------------- 
 Nested Loop (cost=4.65..118.62 rows=10 width=488) (实际时间= 0.128..0.377行= 10个循环= 1）
   - >位图堆扫描上tenk1 T1（成本= 4.36..39.47行= 10宽度= 244）（实际时间= 0.057..0.121行= 10个循环= 1）
         重新检查Cond: (unique1 < 10) 
         -> Tenk1_unique1 上的位图索引扫描 (cost=0.00..4.36 rows=10 width=0) (actual time=0.024..0.024 rows=10 loops=1) 
               Index Cond: (unique1 < 10 )
   -> 在tenk2 t2 上使用tenk2_unique2 进行索引扫描（成本=0.29..7.91 行=1 宽度=244）（实际时间=0.021..0.022 行=1 循环=10）
         索引条件：（unique2 = t1.unique2）
 规划时间：0.181 毫秒
 执行时间：0.501 毫秒
```



```
EXPLAIN ANALYZE SELECT *
FROM tenk1 t1, tenk2 t2
WHERE t1.unique1 < 10 AND t1.unique2 = t2.unique2;

                                                           QUERY PLAN
---------------------------------------------------------------------------------------------------------------------------------
 Nested Loop  (cost=4.65..118.62 rows=10 width=488) (actual time=0.128..0.377 rows=10 loops=1)
   ->  Bitmap Heap Scan on tenk1 t1  (cost=4.36..39.47 rows=10 width=244) (actual time=0.057..0.121 rows=10 loops=1)
         Recheck Cond: (unique1 < 10)
         ->  Bitmap Index Scan on tenk1_unique1  (cost=0.00..4.36 rows=10 width=0) (actual time=0.024..0.024 rows=10 loops=1)
               Index Cond: (unique1 < 10)
   ->  Index Scan using tenk2_unique2 on tenk2 t2  (cost=0.29..7.91 rows=1 width=244) (actual time=0.021..0.022 rows=1 loops=10)
         Index Cond: (unique2 = t1.unique2)
 Planning time: 0.181 ms
 Execution time: 0.501 ms
```

请注意，“实际时间”值以实时毫秒为单位，而`成本`估计以任意单位表示；所以他们不太可能匹配。通常最重要的是寻找估计的行数是否合理地接近现实。在这个例子中，估计都是完全正确的，但这在实践中很不寻常。

在一些查询计划中，一个子计划节点可能被执行多次。例如，内部索引扫描将在上述嵌套循环计划中的每个外部行执行一次。在这种情况下，`循环`值报告节点的总执行次数，显示的实际时间和行值是每次执行的平均值。这样做是为了使数字与显示成本估算的方式具有可比性。乘以`循环`值以获得实际在节点中花费的总时间。在上面的例子中，我们总共花费了 0.220 毫秒在`tenk2`上执行索引扫描。

在某些情况下，`EXPLAIN ANALYZE 会`显示超出计划节点执行时间和行计数的其他执行统计信息。例如，Sort 和 Hash 节点提供额外信息：

```
EXPLAIN ANALYZE SELECT * 
FROM tenk1 t1, tenk2 t2 
WHERE t1.unique1 < 100 AND t1.unique2 = t2.unique2 ORDER BY t1.fivethous; 

                                                                 查询计划
------------------------------------------------ -------------------------------------------------- ------------------------------------------
 排序（成本=717.34..717.59 rows=101 width=488) (actual time=7.761..7.774 rows=100 loops=1) 
   Sort Key: t1.fivethous 
   Sort Method: quicksort Memory: 77kB 
   -> Hash Join (cost=230.47..713.98 rows=101 width =488)（实际时间=0.711..7.427行=100循环=1）
         哈希条件：（t2.unique2 = t1.unique2）
         -> 在tenk2 t2 上的Seq Scan (cost=0.00..445.00 rows=10000 width=244) (actual time=0.007..2.583 rows=10000 loops=1) 
         -> Hash (cost=229.20..229.20 rows=101 width) =244)（实际时间=0.659..0.659 行=100 次循环=1）
               桶：1024 批次：1 内存使用：28kB 
               -> 位图堆扫描在tenk1 t1（成本=5.07..229.20 行=101 宽度=244） （实际时间=0.080..0.526 行=100 次循环=1）
                     重新检查条件：（unique1 < 100）
                     -> Tenk1_unique1 上的位图索引扫描（成本=0.00..5.04 行=101 宽度=0）（实际时间=0.049。 .0.049 行=100 次循环=1）
                           索引条件：（unique1 < 100）
 规划时间：0.194 ms
 执行时间：8.008 ms
```



```
EXPLAIN ANALYZE SELECT *
FROM tenk1 t1, tenk2 t2
WHERE t1.unique1 < 100 AND t1.unique2 = t2.unique2 ORDER BY t1.fivethous;

                                                                 QUERY PLAN
--------------------------------------------------------------------------------------------------------------------------------------------
 Sort  (cost=717.34..717.59 rows=101 width=488) (actual time=7.761..7.774 rows=100 loops=1)
   Sort Key: t1.fivethous
   Sort Method: quicksort  Memory: 77kB
   ->  Hash Join  (cost=230.47..713.98 rows=101 width=488) (actual time=0.711..7.427 rows=100 loops=1)
         Hash Cond: (t2.unique2 = t1.unique2)
         ->  Seq Scan on tenk2 t2  (cost=0.00..445.00 rows=10000 width=244) (actual time=0.007..2.583 rows=10000 loops=1)
         ->  Hash  (cost=229.20..229.20 rows=101 width=244) (actual time=0.659..0.659 rows=100 loops=1)
               Buckets: 1024  Batches: 1  Memory Usage: 28kB
               ->  Bitmap Heap Scan on tenk1 t1  (cost=5.07..229.20 rows=101 width=244) (actual time=0.080..0.526 rows=100 loops=1)
                     Recheck Cond: (unique1 < 100)
                     ->  Bitmap Index Scan on tenk1_unique1  (cost=0.00..5.04 rows=101 width=0) (actual time=0.049..0.049 rows=100 loops=1)
                           Index Cond: (unique1 < 100)
 Planning time: 0.194 ms
 Execution time: 8.008 ms
```



Sort 节点显示使用的排序方法（特别是排序是在内存中还是在磁盘上）以及所需的内存或磁盘空间量。哈希节点显示哈希桶和批次的数量以及用于哈希表的峰值内存量。（如果批次数超过一，也会涉及磁盘空间使用，但未显示。）

另一种类型的额外信息是过滤条件删除的行数：

```
EXPLAIN ANALYZE SELECT * FROM tenk1 WHERE ten < 7;

                                               QUERY PLAN
---------------------------------------------------------------------------------------------------------
 Seq Scan on tenk1  (cost=0.00..483.00 rows=7000 width=244) (actual time=0.016..5.107 rows=7000 loops=1)
   Filter: (ten < 7)
   Rows Removed by Filter: 3000
 Planning time: 0.083 ms
 Execution time: 5.905 ms
```



```
EXPLAIN ANALYZE SELECT * FROM tenk1 WHERE 10 < 7; 

                                               查询计划
------------------------------------------------ -------------------------------------------------- -------
 对tenk1的Seq扫描（成本=0.00..483.00行=7000宽度=244）（实际时间=0.016..5.107行=7000循环=1）
   过滤器：（十<7）
   行被删除过滤器：3000
 规划时间：0.083 毫秒
 执行时间：5.905 毫秒
```

这些计数对于在连接节点上应用的过滤条件特别有价值。的“删除行”当至少一个扫描行，或潜在的加入对在的连接的情况下节点线只出现，被过滤器条件拒绝。

“有损”索引扫描会出现类似于过滤条件的情况。例如，考虑搜索包含特定点的多边形：

```
EXPLAIN ANALYZE SELECT * FROM polygon_tbl WHERE f1 @> polygon '(0.5,2.0)';

                                              QUERY PLAN
------------------------------------------------------------------------------------------------------
 Seq Scan on polygon_tbl  (cost=0.00..1.05 rows=1 width=32) (actual time=0.044..0.044 rows=0 loops=1)
   Filter: (f1 @> '((0.5,2))'::polygon)
   Rows Removed by Filter: 4
 Planning time: 0.040 ms
 Execution time: 0.083 ms
```



```
EXPLAIN ANALYZE SELECT * FROMpolygon_tbl WHERE f1 @>polygon '(0.5,2.0)'; 

                                              查询计划
------------------------------------------------ -------------------------------------------------- ----
 对polygon_tbl进行Seq Scan (cost=0.00..1.05 rows=1 width=32) (actual time=0.044..0.044 rows=0 loops=1) 
   Filter: (f1 @> '((0.5,2) )'::polygon)
   被过滤器移除的行数：4
 规划时间：0.040 ms
 执行时间：0.083 ms
```

规划器认为（非常正确）这个样本表太小而无法进行索引扫描，所以我们有一个简单的顺序扫描，其中所有行都被过滤条件拒绝。但是如果我们强制使用索引扫描，我们会看到：

```
SET enable_seqscan TO off;

EXPLAIN ANALYZE SELECT * FROM polygon_tbl WHERE f1 @> polygon '(0.5,2.0)';

                                                        QUERY PLAN
--------------------------------------------------------------------------------------------------------------------------
 Index Scan using gpolygonind on polygon_tbl  (cost=0.13..8.15 rows=1 width=32) (actual time=0.062..0.062 rows=0 loops=1)
   Index Cond: (f1 @> '((0.5,2))'::polygon)
   Rows Removed by Index Recheck: 1
 Planning time: 0.034 ms
 Execution time: 0.144 ms
```



```
设置 enable_seqscan 关闭；

EXPLAIN ANALYZE SELECT * FROMpolygon_tbl WHERE f1 @>polygon '(0.5,2.0)'; 

                                                        查询计划
------------------------------------------------ -------------------------------------------------- ------------------------
 使用 gpolygonind 对polygon_tbl 进行索引扫描（成本=0.13..8.15 行=1 宽度=32）（实际时间=0.062。 .0.062 rows=0 loops=1) 
   Index Cond: (f1 @> '((0.5,2))'::polygon) 
   Rows Removed by Index Recheck: 1
 规划时间：0.034 ms
 执行时间：0.144 ms
```

在这里我们可以看到索引返回了一个候选行，然后被索引条件的重新检查拒绝了。发生这种情况是因为 GiST 索引对于多边形包含测试是“有损的”：它实际上返回具有与目标重叠的多边形的行，然后我们必须对这些行进行精确的包含测试。

`EXPLAIN`有一个`BUFFERS`选项，可与`ANALYZE`一起使用以获取更多运行时统计信息：

```
EXPLAIN (ANALYZE, BUFFERS) SELECT * FROM tenk1 WHERE unique1 < 100 AND unique2 > 9000;

                                                           QUERY PLAN
---------------------------------------------------------------------------------------------------------------------------------
 Bitmap Heap Scan on tenk1  (cost=25.08..60.21 rows=10 width=244) (actual time=0.323..0.342 rows=10 loops=1)
   Recheck Cond: ((unique1 < 100) AND (unique2 > 9000))
   Buffers: shared hit=15
   ->  BitmapAnd  (cost=25.08..25.08 rows=10 width=0) (actual time=0.309..0.309 rows=0 loops=1)
         Buffers: shared hit=7
         ->  Bitmap Index Scan on tenk1_unique1  (cost=0.00..5.04 rows=101 width=0) (actual time=0.043..0.043 rows=100 loops=1)
               Index Cond: (unique1 < 100)
               Buffers: shared hit=2
         ->  Bitmap Index Scan on tenk1_unique2  (cost=0.00..19.78 rows=999 width=0) (actual time=0.227..0.227 rows=999 loops=1)
               Index Cond: (unique2 > 9000)
               Buffers: shared hit=5
 Planning time: 0.088 ms
 Execution time: 0.423 ms
```



```
EXPLAIN (ANALYZE, BUFFERS) SELECT * FROM tenk1 WHERE unique1 < 100 AND unique2 > 9000; 

                                                           查询计划
------------------------------------------------ -------------------------------------------------- -------------------------------
 位图堆扫描对tenk1 (cost=25.08..60.21 rows=10 width=244) （实际时间=0.323..0.342行=10个循环=1）
   重新检查Cond：（（unique1 < 100）AND（unique2 > 9000））
   缓冲区：shared hit=15 
   -> BitmapAnd（cost=25.08..25.08 rows=10宽度=0）（实际时间=0.309..0.309行=0循环=1）
         缓冲区：共享命中=7- 
         >位图索引扫描tenk1_unique1（成本=0.00..5.04行=101宽度=0）（实际时间= 0.043..0.043 行=100 个循环=1)
               Index Cond: (unique1 < 100) 
               Buffers: shared hit=2 
         -> Bitmap Index Scan on tenk1_unique2 (cost=0.00..19.78 rows=999 width=0) (actual time=0.227..0.227 rows=999 loops=1)
               索引条件：(unique2 > 9000)
               缓冲区：共享命中=5
 规划时间：0.088 毫秒
 执行时间：0.423 毫秒
```

`BUFFERS`提供的数字有助于识别查询的哪些部分是 I/O 密集程度最高的。

请记住，因为`EXPLAIN ANALYZE`实际上运行查询，所以任何副作用都会照常发生，即使查询可能输出的任何结果都被丢弃以支持打印`EXPLAIN`数据。如果您想在不更改表的情况下分析数据修改查询，您可以在之后回滚该命令，例如：

```
BEGIN;

EXPLAIN ANALYZE UPDATE tenk1 SET hundred = hundred + 1 WHERE unique1 < 100;

                                                           QUERY PLAN
--------------------------------------------------------------------------------------------------------------------------------
 Update on tenk1  (cost=5.07..229.46 rows=101 width=250) (actual time=14.628..14.628 rows=0 loops=1)
   ->  Bitmap Heap Scan on tenk1  (cost=5.07..229.46 rows=101 width=250) (actual time=0.101..0.439 rows=100 loops=1)
         Recheck Cond: (unique1 < 100)
         ->  Bitmap Index Scan on tenk1_unique1  (cost=0.00..5.04 rows=101 width=0) (actual time=0.043..0.043 rows=100 loops=1)
               Index Cond: (unique1 < 100)
 Planning time: 0.079 ms
 Execution time: 14.727 ms

ROLLBACK;
```



```
开始; 

EXPLAIN ANALYZE UPDATE tenk1 SET百 = 百 + 1 WHERE unique1 < 100; 

                                                           查询计划
------------------------------------------------ -------------------------------------------------- ------------------------------
 更新tenk1 (cost=5.07..229.46 rows=101 width=250) (实际时间=14.628..14.628 rows=0 loops=1) 
   -> Bitmap Heap Scan on tenk1 (cost=5.07..229.46 rows=101 width=250) (actual time=0.101..0.439 rows=100 loops=1) Recheck 
         Cond : (unique1 < 100) 
         -> Tenk1_unique1 上的位图索引扫描 (cost=0.00..5.04 rows=101 width=0) (actual time=0.043..0.043 rows=100 loops=1) 
               Index Cond: (unique1 < 100)
 规划时间：0.079 ms
 执行时间：14.727 ms 

ROLLBACK；
```

如本例所示，当查询是`INSERT`、`UPDATE`或`DELETE 时`命令，应用表更改的实际工作由顶级插入、更新或删除计划节点完成。该节点下的计划节点执行定位旧行和/或计算新数据的工作。所以在上面，我们看到了与我们已经看到的相同类型的位图表扫描，其输出被馈送到存储更新行的更新节点。值得注意的是，尽管数据修改节点可能需要相当长的运行时间（在这里，它消耗了大部分时间），但规划器目前并未在成本估算中添加任何内容来说明该工作。这是因为每个正确的查询计划要完成的工作都是相同的，因此它不会影响计划决策。

`EXPLAIN ANALYZE`显示的`Planning time`是从已解析的查询生成查询计划并对其进行优化所花费的时间。它不包括解析或重写。``

`EXPLAIN ANALYZE`显示的`执行时间`包括执行器启动和关闭时间，以及运行任何触发的触发器的时间，但不包括解析、重写或计划时间。执行`BEFORE`触发器所花费的时间（如果有）包含在相关插入、更新或删除节点的时间中；但是执行`AFTER`触发器所花费的时间不计算在内，因为`AFTER`触发器是在整个计划完成`后`触发的。每个触发器花费的总时间（`BEFORE`或`AFTER`````````````) 也单独显示。请注意，延迟约束触发器直到事务结束才会执行，因此`EXPLAIN ANALYZE`根本不会考虑。

## 14.1.3. 注意事项

由`EXPLAIN ANALYZE`测量的运行时间可以通过两种重要方式偏离同一查询的正常执行。首先，由于没有将输出行交付给客户端，因此不包括网络传输成本和 I/O 转换成本。其次，由`EXPLAIN ANALYZE`添加的测量开销可能很大，尤其是在`gettimeofday()`操作系统调用速度较慢的机器上。您可以使用[pg_test_timing](https://www.postgresql.org/docs/9.4/pgtesttiming.html)工具来测量系统上的计时开销。

`EXPLAIN`结果不应该外推到与您实际测试的情况大不相同的情况；例如，不能假设玩具大小的表上的结果适用于大表。计划器的成本估算不是线性的，因此它可能会为更大或更小的表选择不同的计划。一个极端的例子是，在一个只占用一个磁盘页面的表上，无论索引是否可用，您几乎总是会得到一个顺序扫描计划。规划器意识到在任何情况下都需要读取一个磁盘页面来处理表，因此花费额外的页面读取来查看索引是没有价值的。（我们在上面的`polygon_tbl`示例中看到了这种情况。）

在某些情况下，实际值和估计值不会很好地匹配，但没有什么是真正的错误。当计划节点执行因`LIMIT`或类似效果而停止时，就会发生一种这样的情况。例如，在我们之前使用的`LIMIT`查询中，

```
EXPLAIN ANALYZE SELECT * FROM tenk1 WHERE unique1 < 100 AND unique2 > 9000 LIMIT 2;

                                                          QUERY PLAN
-------------------------------------------------------------------------------------------------------------------------------
 Limit  (cost=0.29..14.71 rows=2 width=244) (actual time=0.177..0.249 rows=2 loops=1)
   ->  Index Scan using tenk1_unique2 on tenk1  (cost=0.29..72.42 rows=10 width=244) (actual time=0.174..0.244 rows=2 loops=1)
         Index Cond: (unique2 > 9000)
         Filter: (unique1 < 100)
         Rows Removed by Filter: 287
 Planning time: 0.096 ms
 Execution time: 0.336 ms
```



```
EXPLAIN ANALYZE SELECT * FROM tenk1 WHERE unique1 < 100 AND unique2 > 9000 LIMIT 2; 

                                                          查询计划
------------------------------------------------ -------------------------------------------------- -----------------------------
 限制（成本=0.29..14.71 行=2 宽度=244）（实际时间=0.177. .0.249 rows=2 loops=1) 
   -> Index Scan using tenk1_unique2 on tenk1 (cost=0.29..72.42 rows=10 width=244) (actual time=0.174..0.244 rows=2 loops=1) 
         Index Cond: ( unique2 > 9000) 
         Filter: (unique1 < 100) 
         Rows Removed by Filter: 287
 规划时间：0.096 ms
 执行时间：0.336 ms
```

索引扫描节点的估计成本和行数显示为好像它已运行完成。但实际上，Limit 节点在获得 2 行后就停止请求行，因此实际行数仅为 2，并且运行时间少于成本估算所建议的。这不是估计错误，只是估计值和真实值的显示方式存在差异。

合并连接也有可能混淆粗心的测量工件。如果合并连接耗尽了另一个输入，并且一个输入中的下一个键值大于另一个输入的最后一个键值，则合并连接将停止读取一个输入；在这种情况下，不再有匹配项，因此无需扫描第一个输入的其余部分。这会导致无法读取一个孩子的全部内容，其结果类似于`LIMIT 中`提到的结果。此外，如果外部（第一个）子项包含具有重复键值的行，则备份内部（第二个）子项并重新扫描其与该键值匹配的行部分。`解释分析`计算相同内部行的这些重复排放，就好像它们是真正的附加行。当存在许多外部重复项时，内部子计划节点报告的实际行数可能明显大于内部关系中的实际行数。

由于实现限制，BitmapAnd 和 BitmapOr 节点始终将其实际行数报告为零。