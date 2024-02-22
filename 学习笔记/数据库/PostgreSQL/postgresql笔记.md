## 14.1. 使用`EXPLAIN`

- [14.1.1. `EXPLAIN`基础](http://www.postgres.cn/docs/14/using-explain.html#USING-EXPLAIN-BASICS)
- [14.1.2. `EXPLAIN ANALYZE`](http://www.postgres.cn/docs/14/using-explain.html#USING-EXPLAIN-ANALYZE)
- [14.1.3. 警告](http://www.postgres.cn/docs/14/using-explain.html#USING-EXPLAIN-CAVEATS)



PostgreSQL为每个收到的查询产生一个*查询计划*。 选择正确的计划来匹配查询结构和数据的属性对于好的性能来说绝对是最关键的，因此系统包含了一个复杂的*规划器*来尝试选择好的计划。 你可以使用[EXPLAIN](http://www.postgres.cn/docs/14/sql-explain.html)命令察看规划器为任何查询生成的查询计划。 阅读查询计划是一门艺术，它要求一些经验来掌握，但是本节只试图覆盖一些基础。

本节中的例子都是从 9.3 开发源代码的回归测试数据库中抽取出来的，并且在此之前做过一次`VACUUM ANALYZE`。你应该能够在自己尝试这些例子时得到相似的结果，但是你的估计代价和行计数可能会小幅变化，因为`ANALYZE`的统计信息是随机采样而不是精确值，并且代价也与平台有某种程度的相关性。

这些例子使用`EXPLAIN`的默认“text”输出格式，这种格式紧凑并且便于人类阅读。如果你想把`EXPLAIN`的输出交给一个程序做进一步分析，你应该使用它的某种机器可读的输出格式（XML、JSON 或 YAML）。

### 14.1.1. `EXPLAIN`基础

查询计划的结构是一个***计划结点*的树**。**最底层的结点是扫描结点：它们从表中返回未经处理的行**。 不同的表访问模式有不同的扫描结点类型：**顺序扫描、索引扫描、位图索引扫描**。 也还有不是表的行来源，例如**`VALUES`子句和`FROM`中返回集合的函数，它们有自己的结点类型**。如果查询需要连接、聚集、排序、或者在未经处理的行上的其它操作，那么就会在扫描结点之上有其它额外的结点来执行这些操作。 并且，做这些操作通常都有多种方法，因此在这些位置也有可能出现不同的结点类型。 `EXPLAIN`给计划树中每个结点都输出一行，显示基本的结点类型和计划器为该计划结点的执行所做的开销估计。 第一行（最上层的结点）是对该计划的总执行开销的估计；计划器试图最小化的就是这个数字。

这里是一个简单的例子，只是用来显示输出看起来是什么样的：

```
EXPLAIN SELECT * FROM tenk1;

                         QUERY PLAN
-------------------------------------------------------------
 Seq Scan on tenk1  (cost=0.00..458.00 rows=10000 width=244)
```



由于这个查询没有`WHERE`子句，它必须扫描表中的所有行，因此计划器只能选择使用一个简单的顺序扫描计划。被包含在圆括号中的数字是（从左至右）：

- 估计的启动开销。在输出阶段可以开始之前消耗的时间，例如在一个排序结点里执行排序的时间。
- 估计的总开销。这个估计值基于的假设是计划结点会被运行到完成，即所有可用的行都被检索。不过实际上一个结点的父结点可能很快停止读所有可用的行（见下面的`LIMIT`例子）。
- 这个计划结点输出行数的估计值。同样，也假定该结点能运行到完成。
- 预计这个计划结点输出的行平均宽度（以字节计算）。



开销是用规划器的开销参数（参见[第 20.7.2 节](http://www.postgres.cn/docs/14/runtime-config-query.html#RUNTIME-CONFIG-QUERY-CONSTANTS)）所决定的捏造单位来衡量的。传统上以取磁盘页面为单位来度量开销； 也就是[seq_page_cost](http://www.postgres.cn/docs/14/runtime-config-query.html#GUC-SEQ-PAGE-COST)将被按照习惯设为`1.0`，其它开销参数将相对于它来设置。 本节的例子都假定这些参数使用默认值。

有一点很重要：**一个上层结点的开销包括它的所有子结点的开销**。还有一点也很重要：这个开销只反映规划器关心的东西。**特别是这个开销没有考虑结果行传递给客户端所花费的时间，这个时间可能是实际花费时间中的一个重要因素**；但是它被规划器忽略了，因为它无法通过修改计划来改变（我们相信，每个正确的计划都将输出同样的行集）。

**`行数`值有一些小技巧，因为它不是计划结点处理或扫描过的行数，而是该结点发出的行数。这通常比被扫描的行数少一些， 因为有些被扫描的行会被应用于此结点上的任意`WHERE`子句条件过滤掉。 理想中顶层的行估计会接近于查询实际返回、更新、删除的行数**。

回到我们的例子：

```sql
EXPLAIN SELECT * FROM tenk1;

                         QUERY PLAN
-------------------------------------------------------------
 Seq Scan on tenk1  (cost=0.00..458.00 rows=10000 width=244)
```



这些数字的产生非常直接。如果你执行：

```
SELECT relpages, reltuples FROM pg_class WHERE relname = 'tenk1';
```

你会发现`tenk1`有358个磁盘页面和10000行。 开销被计算为 （页面读取数*[seq_page_cost](http://www.postgres.cn/docs/14/runtime-config-query.html#GUC-SEQ-PAGE-COST)）+（扫描的行数*[cpu_tuple_cost](http://www.postgres.cn/docs/14/runtime-config-query.html#GUC-CPU-TUPLE-COST)）。默认情况下，`seq_page_cost`是1.0，`cpu_tuple_cost`是0.01， 因此估计的开销是 (358 * 1.0) + (10000 * 0.01) = 458。

现在让我们修改查询并增加一个`WHERE`条件：

```sql
EXPLAIN SELECT * FROM tenk1 WHERE unique1 < 7000;

                         QUERY PLAN
------------------------------------------------------------
 Seq Scan on tenk1  (cost=0.00..483.00 rows=7001 width=244)
   Filter: (unique1 < 7000)
```

请注意`EXPLAIN`输出显示`WHERE`子句被当做一个“过滤器”条件附加到顺序扫描计划结点。 这意味着该计划结点为它扫描的每一行检查该条件，并且只输出通过该条件的行。因为`WHERE`子句的存在，估计的输出行数降低了。不过，扫描仍将必须访问所有 10000 行，因此开销没有被降低；实际上开销还有所上升（准确来说，上升了 10000 * [cpu_operator_cost](http://www.postgres.cn/docs/14/runtime-config-query.html#GUC-CPU-OPERATOR-COST)）以反映检查`WHERE`条件所花费的额外 CPU 时间。

这条查询实际选择的行数是 7000，但是估计的`rows`只是个近似值。如果你尝试重复这个试验，那么你很可能得到略有不同的估计。 此外，这个估计会在每次`ANALYZE`命令之后改变， 因为`ANALYZE`生成的统计数据是从该表中随机采样计算的。

现在，让我们把条件变得更严格：

```
EXPLAIN SELECT * FROM tenk1 WHERE unique1 < 100;

                                  QUERY PLAN
------------------------------------------------------------------------------
 Bitmap Heap Scan on tenk1  (cost=5.07..229.20 rows=101 width=244)
   Recheck Cond: (unique1 < 100)
   ->  Bitmap Index Scan on tenk1_unique1  (cost=0.00..5.04 rows=101 width=0)
         Index Cond: (unique1 < 100)
```

这里，规划器决定使用一个两步的计划：子计划结点访问一个索引来找出匹配索引条件的行的位置，然后上层计划结点实际地从表中取出那些行。独立地抓取行比顺序地读取它们的开销高很多，但是不是所有的表页面都被访问，这么做实际上仍然比一次顺序扫描开销要少（使用两层计划的原因是**因为上层规划结点把索引标识出来的行位置在读取之前按照物理位置排序，这样可以最小化单独抓取的开销**。**结点名称里面提到的“位图”是执行该排序的机制**）。

现在让我们给`WHERE`子句增加另一个条件：

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

新增的条件`stringu1 = 'xxx'`减少了估计的输出行计数， 但是没有减少开销，因为我们仍然需要访问相同的行集合。 请注意，`stringu1`子句不能被应用为一个索引条件，因为这个索引只是在`unique1`列上。 它被用来过滤从索引中检索出的行。因此开销实际上略微增加了一些以反映这个额外的检查。

在某些情况下规划器将更倾向于一个“simple”索引扫描计划：

```
EXPLAIN SELECT * FROM tenk1 WHERE unique1 = 42;

                                 QUERY PLAN
------------------------------------------------------------------------------
 Index Scan using tenk1_unique1 on tenk1  (cost=0.29..8.30 rows=1 width=244)
   Index Cond: (unique1 = 42)
```

在这类计划中，表行被按照索引顺序取得，这使得读取它们开销更高，但是其中有一些是对行位置排序的额外开销。 你很多时候将在只取得一个单一行的查询中看到这种计划类型。 它也经常被用于拥有匹配索引顺序的`ORDER BY`子句的查询中， 因为那样就不需要额外的排序步骤来满足`ORDER BY`。在此示例中，**添加 `ORDER BY unique1`将使用相同的计划，因为索引已经隐式提供了请求的排序**。

规划器可以通过多种方式实现`ORDER BY`子句。上面的例子表明，这样的排序子句可以隐式实现。 **规划器还可以添加一个明确的`sort`步骤：**

```
EXPLAIN SELECT * FROM tenk1 ORDER BY unique1;
                            QUERY PLAN
-------------------------------------------------------------------
 Sort  (cost=1109.39..1134.39 rows=10000 width=244)
   Sort Key: unique1
   ->  Seq Scan on tenk1  (cost=0.00..445.00 rows=10000 width=244)
```

如果计划的一部分保证对所需排序键的前缀(**对排序字段部分排序**)进行排序，那么计划器可能会决定使用`incremental sort`步骤：

```
EXPLAIN SELECT * FROM tenk1 ORDER BY four, ten LIMIT 100;
                                              QUERY PLAN
------------------------------------------------------------------------------------------------------
 Limit  (cost=521.06..538.05 rows=100 width=244)
   ->  Incremental Sort  (cost=521.06..2220.95 rows=10000 width=244)
         Sort Key: four, ten
         Presorted Key: four
         ->  Index Scan using index_tenk1_on_four on tenk1  (cost=0.29..1510.08 rows=10000 width=244)
```

与常规排序相比，**增量排序**允许在对整个结果集进行排序之前返回元组，这尤其可以使用`LIMIT`查询进行优化。 它还可以减少内存使用和将排序溢出到磁盘的可能性，但其代价是将结果集拆分为多个排序批次的开销增加。

如果**在`WHERE`引用的多个行上有独立的索引，规划器可能会选择使用这些索引的一个 AND 或 OR 组合**：

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

但是这要求访问两个索引，所以与只使用一个索引并把其他条件作为过滤器相比，它不一定能胜出。如果你变动涉及到的范围，你将看到计划也会相应改变。

下面是一个例子，它展示了`LIMIT`的效果：

```
EXPLAIN SELECT * FROM tenk1 WHERE unique1 < 100 AND unique2 > 9000 LIMIT 2;

                                     QUERY PLAN
-------------------------------------------------------------------------------------
 Limit  (cost=0.29..14.48 rows=2 width=244)
   ->  Index Scan using tenk1_unique2 on tenk1  (cost=0.29..71.27 rows=10 width=244)
         Index Cond: (unique2 > 9000)
         Filter: (unique1 < 100)
```



这是和上面相同的查询，但是我们增加了一个`LIMIT`，这样不是所有的行都需要被检索，并且规划器改变了它的决定。注意索引扫描结点的总开销和行计数显示出好像它会被运行到完成。但是，Limit结点在检索到这些行的五分之一后就会停止，因此它的总开销只是索引扫描结点的五分之一，并且这是查询的实际估计开销。之所以用这个计划而不是在之前的计划上增加一个Limit结点是因为Limit无法避免在位图扫描上花费启动开销，所以采用这种方法，**总成本将超过前者成本的25个单位（位图扫描的成本）**。

让我们尝试连接两个表，使用我们已经讨论过的列：

```
EXPLAIN SELECT *
FROM tenk1 t1, tenk2 t2
WHERE t1.unique1 < 10 AND t1.unique2 = t2.unique2;

                                      QUERY PLAN
-------------------------------------------------------------------------------------
 Nested Loop  (cost=4.65..118.62 rows=10 width=488)
   ->  Bitmap Heap Scan on tenk1 t1  (cost=4.36..39.47 rows=10 width=244)
         Recheck Cond: (unique1 < 10)
         ->  Bitmap Index Scan on tenk1_unique1  (cost=0.00..4.36 rows=10 width=0)
               Index Cond: (unique1 < 10)
   ->  Index Scan using tenk2_unique2 on tenk2 t2  (cost=0.29..7.91 rows=1 width=244)
         Index Cond: (unique2 = t1.unique2)
```



在这个计划中，我们有一个嵌套循环连接结点，它有两个表扫描作为输入或子结点。该结点的摘要行的缩进反映了计划树的结构。连接的第一个（或“outer”）子结点是一个与前面见到的相似的位图扫描。它的开销和行计数与我们从`SELECT ... WHERE unique1 < 10`得到的相同，因为我们将`WHERE`子句`unique1 < 10`用在了那个结点上。`t1.unique2 = t2.unique2`子句现在还不相关，因此它不影响 outer 扫描的行计数。嵌套循环连接结点将为从 outer 子结点得到的每一行运行它的第二个（或“inner”）子结点。当前 outer 行的列值可以被插入 inner 扫描。这里，来自 outer 行的`t1.unique2`值是可用的，所以我们得到的计划和开销与前面见到的简单`SELECT ... WHERE t2.unique2 = *`constant`*`情况相似（估计的开销实际上比前面看到的略低，是因为在`t2`上的重复索引扫描会利用到高速缓存）。**循环结点的开销则被以 outer 扫描的开销为基础设置，外加对每一个 outer 行都要进行一次 inner 扫描 （10 * 7.87），再加上用于连接处理一点 CPU 时间。**

在这个例子里，连接的输出行计数等于两个扫描的行计数的乘积，但通常并不是所有的情况中都如此， 因为可能有同时提及两个表的 额外`WHERE`子句，并且因此它只能被应用于连接点，而不能影响**任何一个输入扫描**。这里是一个例子：

```
EXPLAIN SELECT *
FROM tenk1 t1, tenk2 t2
WHERE t1.unique1 < 10 AND t2.unique2 < 10 AND t1.hundred < t2.hundred;

                                         QUERY PLAN
-------------------------------------------------------------------------------------
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

条件`t1.hundred < t2.hundred`不能在`tenk2_unique2`索引中被测试，因此它被应用在连接结点。这缩减了连接结点的估计输出行计数，但是没有改变任何输入扫描。

**注意这里规划器选择了“物化”连接的 inner 关系，方法是在它的上方放了一个物化计划结点。这意味着`t2`索引扫描将只被做一次，即使嵌套循环连接结点需要读取其数据十次（每个来自 outer 关系的行都要读一次）。物化结点在读取数据时将它保存在内存中，然后在每一次后续执行时从内存返回数据。**

在处理外连接时，你可能会看到连接计划结点同时附加有“连接过滤器”和普通“过滤器”条件。**连接过滤器条件来自于外连接的`ON`子句，因此一个无法通过连接过滤器条件的行也能够作为一个空值扩展的行被保留**。但是一个普通过滤器条件被应用在外连接条件之后并且因此无条件移除行。在一个内连接中，这两种过滤器类型没有语义区别。

如果我们把查询的选择度改变一点，我们可能得到一个非常不同的连接计划：

```
EXPLAIN SELECT *
FROM tenk1 t1, tenk2 t2
WHERE t1.unique1 < 100 AND t1.unique2 = t2.unique2;

                                        QUERY PLAN
-------------------------------------------------------------------------------------
 Hash Join  (cost=230.47..713.98 rows=101 width=488)
   Hash Cond: (t2.unique2 = t1.unique2)
   ->  Seq Scan on tenk2 t2  (cost=0.00..445.00 rows=10000 width=244)
   ->  Hash  (cost=229.20..229.20 rows=101 width=244)
         ->  Bitmap Heap Scan on tenk1 t1  (cost=5.07..229.20 rows=101 width=244)
               Recheck Cond: (unique1 < 100)
               ->  Bitmap Index Scan on tenk1_unique1  (cost=0.00..5.04 rows=101 width=0)
                     Index Cond: (unique1 < 100)
```



这里规划器选择了使用一个**哈希连接**，在其中一个表的行被放入一个**内存哈希表**，在这之后其他表被扫描，并且为每一行查找哈希表来寻找匹配。同样要注意缩进是如何反映计划结构的**：`tenk1`上的位图扫描是哈希结点的输入，哈希结点会构造哈希表。然后哈希表会返回给哈希连接结点，哈希连接结点将从它的 outer 子计划读取行，并为每一个行搜索哈希表。**

另一种可能的连接类型是一个**归并连接**，如下所示：

```
EXPLAIN SELECT *
FROM tenk1 t1, onek t2
WHERE t1.unique1 < 100 AND t1.unique2 = t2.unique2;

                                        QUERY PLAN
-------------------------------------------------------------------------------------
 Merge Join  (cost=198.11..268.19 rows=10 width=488)
   Merge Cond: (t1.unique2 = t2.unique2)
   ->  Index Scan using tenk1_unique2 on tenk1 t1  (cost=0.29..656.28 rows=101 width=244)
         Filter: (unique1 < 100)
   ->  Sort  (cost=197.83..200.33 rows=1000 width=244)
         Sort Key: t2.unique2
         ->  Seq Scan on onek t2  (cost=0.00..148.00 rows=1000 width=244)
```



**归并连接要求它的输入数据按照连接键被排序**。在这个计划中，`tenk1`数据进行索引扫描时被排序，以便能够按照正确的顺序来访问行。但是对于`onek`则更倾向于一个**顺序扫描和排序**，因为在那个onek表中有更多行需要被访问（**对于很多行的排序，顺序扫描加排序常常比一个索引扫描好，因为索引扫描需要非顺序（无序的）的磁盘访问**）。

一种查看变体计划的方法是强制规划器丢弃它认为开销最低的任何策略，这可以使用[第 20.7.1 节](http://www.postgres.cn/docs/14/runtime-config-query.html#RUNTIME-CONFIG-QUERY-ENABLE)中描述的启用/禁用标志实现（这是一个野蛮的工具，但是很有用。另见[第 14.3 节](http://www.postgres.cn/docs/14/explicit-joins.html)）。例如，如果我们并不认同在前面的例子中顺序扫描加排序是处理表`onek`的最佳方法，我们可以尝试：

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

这显示规划器认为用索引扫描来排序`onek`的开销要比用顺序扫描加排序的方式高大约12%。当然，下一个问题是是否真的是这样。我们可以通过使用`EXPLAIN ANALYZE`来仔细研究一下，如下文所述。

### 14.1.2. `EXPLAIN ANALYZE`

可以通过使用`EXPLAIN`的`ANALYZE`选项来检查规划器估计值的准确性。通过使用这个选项，`EXPLAIN`会实际执行该查询，然后显示真实的行计数和在每个计划结点中累计的真实运行时间，还会有一个普通`EXPLAIN`显示的估计值。例如，我们可能得到这样一个结果：

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

注意“actual time”值是以毫秒计的真实时间，而`cost`估计值被以任意的单位表示，因此它们不大可能匹配上。在这里面要查看的最重要的一点是估计的行计数是否合理地接近实际值。在这个例子中，估计值都是完全正确的，但是在实际中非常少见。

在某些查询计划中，可以多次执行一个子计划结点。例如，inner 索引扫描可能会因为上层嵌套循环计划中的每一个 outer 行而被执行一次。在这种情况下，`loops`值报告了执行该结点的总次数，并且 actual time 和行数值是这些执行的平均值。这是为了让这些数字能够与开销估计显示的方式有可比性。将这些值乘上`loops`值可以得到在该结点中实际消耗的总时间。在上面的例子中，我们在执行`tenk2`的索引扫描上花费了总共 0.220 毫秒。

在某些情况中，`EXPLAIN ANALYZE`会显示计划结点执行时间和行计数之外的额外执行统计信息。例如，排序和哈希结点提供额外的信息：

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

**排序结点显示使用的排序方法（尤其是，排序是在内存中还是磁盘上进行）和需要的内存或磁盘空间量**。**哈希结点显示了哈希桶的数量和批数**，以及哈希表所使用的内存量的峰值（如果批数超过1，也将会涉及到磁盘空间使用，但是并没有被显示）。

**另一种类型的额外信息是被一个过滤器条件移除的行数：**

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

这些值对于被应用在连接结点上的过滤器条件特别有价值。只有在至少有一个被扫描行或者在连接结点中一个可能的连接对被过滤器条件拒绝时，“Rows Removed”行才会出现。

一个与过滤器条件相似的情况出现在“有损”索引扫描中。例如，一个查询，它搜索包含一个指定点的多边形：

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

规划器认为（非常正确）这个采样表太小不值得劳烦一次索引扫描，因此我们得到了一个普通的顺序扫描，其中的所有行都被过滤器条件拒绝。但是如果我们强制使用索引扫描，我们看到：

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

这里我们可以看到索引返回一个候选行，然后它会被索引条件重新检查和拒绝。这是因为一个 GiST 索引对于多边形包含测试是 “有损的”：它确实返回覆盖目标的多边形的行，然后我们必须在那些行上做精确的包含性测试。

`EXPLAIN`有一个`BUFFERS`选项可以和`ANALYZE`一起使用，来得到更多运行时统计信息：

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

**BUFFERS提供的数字帮助我们标识查询的哪些部分是对 I/O 最敏感的。**

记住因为`EXPLAIN ANALYZE`会实际执行查询，任何副作用仍然会发生，即使查询可能输出的任何结果被丢弃，来支持打印`EXPLAIN`数据。如果你想要分析一个数据修改查询而不想改变你的表，你可以在分析完后回滚命令，例如：

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



正如在这个例子中所看到的，当查询是一个`INSERT`、`UPDATE`或`DELETE`命令时，**应用表更改的实际工作由顶层插入、更新或删除计划结点完成**。这个结点之下的计划结点执行定位旧行以及/或者计算新数据的工作。因此在上面，我们看到我们已经见过的位图表扫描，它的输出被交给一个更新结点，更新结点会存储被更新过的行。还有一点值得注意的是，尽管**数据修改结点可能产生可观的运行时间（这里，它消耗最大份额的时间**），规划器当前并没有对开销估计增加任何东西来说明这些工作。这是因为这些工作对每一个正确的查询计划都得做，所以它不影响执行计划的选择。

当一个`UPDATE`或者`DELETE`命令影响继承层次的数据时， 输出可能像这样：

```
EXPLAIN UPDATE parent SET f2 = f2 + 1 WHERE f1 = 101;
                                    QUERY PLAN
-----------------------------------------------------------------------------------
 Update on parent  (cost=0.00..24.53 rows=4 width=14)
   Update on parent
   Update on child1
   Update on child2
   Update on child3
   ->  Seq Scan on parent  (cost=0.00..0.00 rows=1 width=14)
         Filter: (f1 = 101)
   ->  Index Scan using child1_f1_key on child1  (cost=0.15..8.17 rows=1 width=14)
         Index Cond: (f1 = 101)
   ->  Index Scan using child2_f1_key on child2  (cost=0.15..8.17 rows=1 width=14)
         Index Cond: (f1 = 101)
   ->  Index Scan using child3_f1_key on child3  (cost=0.15..8.17 rows=1 width=14)
         Index Cond: (f1 = 101)
```

在这个例子中，更新节点需要考虑三个子表以及最初提到的父表。因此有四个输入 的扫描子计划，每一个对应于一个表。为清晰起见，在更新节点上标注了将被更新的相关目标表，显示的顺序与相应的子计划相同（这些标注是从 PostgreSQL 9.5 开始新增的，在以前的版本中读者必须通过观察子计划才能知道这些目标表）。

**`EXPLAIN ANALYZE`显示的 `Planning time`是从一个已解析的查询生成查询计划并进行优化所花费的时间，其中不包括解析和重写。**

**`EXPLAIN ANALYZE`显示的`Execution time`包括执行器的启动和关闭时间，以及运行被触发的任何触发器的时间，但是它不包括解析、重写或规划的时间。如果存在执行`BEFORE`触发器的时间，它将被包括在相关的插入、更新或删除结点的时间内；但是用来执行`AFTER` 触发器的时间没有被计算，因为`AFTER`触发器是在整个计划完成后被触发的。在每个触发器（`BEFORE`或`AFTER`）也被独立地显示。注意延迟约束触发器将不会被执行，直到事务结束，并且因此根本不会被`EXPLAIN ANALYZE`考虑**。

### 14.1.3. 警告

**有两种重要的因素可能会导致`EXPLAIN ANALYZE`所测量的运行时间偏离同一个查询的正常执行。首先，由于不会有输出行被递交给客户端，网络传输开销和 I/O 转换开销没有被包括在内。其次，由`EXPLAIN ANALYZE`所增加的测量开销可能会很可观，特别是在操作系统调用`gettimeofday()`很慢的机器上。你可以使用[pg_test_timing](http://www.postgres.cn/docs/14/pgtesttiming.html)工具来度量在你的系统上的计时开销。**

`EXPLAIN`结果不应该被用来推断与你实际测试的非常不同的情形。例如，一个很小的表上的结果不能被假定成适合大型表。规划器的成本估计不是线性的，并且因此它可能为一个更大或更小的表选择一个不同的计划。一个极端例子是，在一个只占据一个磁盘页面的表上，你将几乎总是得到一个顺序扫描计划，而不管索引是否可用。规划器认识到它在任何情况下都将采用一次磁盘页面读取来处理该表，因此用额外的页面读取去访问一个索引是没有价值的（我们已经在前面的`polygon_tbl`例子中见过）。

在一些情况中，实际的值和估计的值不会匹配得很好，但是这并非错误。这样的情况发生当计划结点的执行被`LIMIT`或类似的效果很快停止。例如，在我们之前用过的`LIMIT`查询中：

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

索引扫描结点的估计开销和行计数显示它已经运行到完成。但是实际上，限制结点在得到2行之后就停止请求行，因此实际的行计数只有 2 ，并且运行时间远低于成本估计所建议的时间。这并非估计错误，这仅仅是估计值和实际值显示方式上的不同。

归并连接也有类似的现象。如果一个归并连接用尽了一个输入并且其中的最后一个键值小于另一个输入中的下一个键值，它将停止读取另一个输入。在这种情况下，不会有更多的匹配并且因此不需要扫描第二个输入的剩余部分。这会导致不读取一个子结点的所有内容，其结果就像在`LIMIT`中所提到的。另外，如果 outer （第一个）子结点包含带有重复键值的行，inner（第二个）子结点会被倒退并且被重新扫描来找能匹配那个键值的行。`EXPLAIN ANALYZE`会统计相同 inner 行的重复动作，就好像它们是真实的额外行。当有很多 outer 重复时，对 inner 子计划结点所报告的实际行计数会显著地大于实际在 inner 关系中的行数。

由于实现的限制，BitmapAnd 和 BitmapOr 结点总是报告它们的实际行计数为零。

通常，`EXPLAIN`将显示规划器生成的每个计划节点。 但是，在某些情况下，执行器可以决定不执行某些节点，因为根据规划时不可用的参数值能确定这些节点不会产生任何行。 （当前，**这仅会在扫描分区表的Append或MergeAppend节点的子节点中发生**。） 发生这种情况时，将从`EXPLAIN`输出中省略这些计划节点，并显示`Subplans Removed：N`的标识。





## 20.7. 查询规划

- [20.7.1. 规划器方法配制](http://www.postgres.cn/docs/14/runtime-config-query.html#RUNTIME-CONFIG-QUERY-ENABLE)
- [20.7.2. 规划器代价常量](http://www.postgres.cn/docs/14/runtime-config-query.html#RUNTIME-CONFIG-QUERY-CONSTANTS)
- [20.7.3. 遗传查询优化](http://www.postgres.cn/docs/14/runtime-config-query.html#RUNTIME-CONFIG-QUERY-GEQO)
- [20.7.4. 其他规划器选项](http://www.postgres.cn/docs/14/runtime-config-query.html#RUNTIME-CONFIG-QUERY-OTHER)

### 20.7.1. 规划器方法配制

这些配置参数提供了影响查询优化器选择查询规划的原始方法。 如果优化器为特定的查询选择的缺省规划并不是最优，那么我们就可以通过使用这些 配置参数强制优化器选择一个更好的规划来临时解决这个问题。 不过，永久地关闭这些设置几乎从不是个好主意。 更好的改善优化器选择规划的方法包括调节Section 18.6.2、 更频繁运行ANALYZE、增大配置参数 default_statistics_target的值、使用 ALTER TABLE SET STATISTICS为某个字段增加收集的统计信息。 这些配置参数影响查询优化器选择查询计划的暴力方法。 如果优化器为一个特定查询选择的默认计划不是最优的，一种***临时\***解决方案是使用这些配置参数之一来强制优化器选择不同的计划。 提高优化器选择的计划质量的更好的方式包括调整规划器的代价常数（见[第 20.7.2 节](http://www.postgres.cn/docs/14/runtime-config-query.html#RUNTIME-CONFIG-QUERY-CONSTANTS)）、手工运行[`ANALYZE`](http://www.postgres.cn/docs/14/sql-analyze.html) 、增加[default_statistics_target](http://www.postgres.cn/docs/14/runtime-config-query.html#GUC-DEFAULT-STATISTICS-TARGET)配置参数的值以及使用`ALTER TABLE SET STATISTICS`增加为特定列收集的统计信息量。

- `enable_async_append` (`boolean`)

  激活或禁用查询计划的关于异步感知附加计划类型的使用。 默认为`on`。

- `enable_bitmapscan` (`boolean`)

  允许或禁止查询规划器使用位图扫描计划类型。默认值是`on`。

- `enable_gathermerge` (`boolean`)

  启用或者禁用查询规划器对收集归并计划类型的使用。默认值是`on`。

- `enable_hashagg` (`boolean`)

  允许或禁用查询规划器使用哈希聚集计划类型。默认值是`on`。

- `enable_hashjoin` (`boolean`)

  允许或禁止查询规划器使用哈希连接计划类型。默认值是`on`。

- `enable_incremental_sort` (`boolean`)

  启用或禁用查询规划器对增量排序步骤的使用。默认为`on`。

- `enable_indexscan` (`boolean`)

  允许或禁止查询规划器使用索引扫描计划类型。默认值是`on`。

- `enable_indexonlyscan` (`boolean`)

  允许或禁止查询规划器使用只用索引扫描计划类型（见[第 11.9 节](http://www.postgres.cn/docs/14/indexes-index-only-scans.html)）。默认值是`on`。

- `enable_material` (`boolean`)

  允许或者禁止查询规划器使用物化。它不可能完全禁用物化，但是关闭这个变量将阻止规划器插入物化节点，除非为了保证正确性。默认值是`on`。

- `enable_memoize` (`boolean`)

  启用或禁用查询计划器对memoize计划的使用，以便缓存在嵌套循环连接中参数化扫描的结果。 在当前参数的结果已经在缓存中时，此计划类型允许跳过对底层计划的扫描。 当新条目需要更多空间时，不太常用的查询结果可能会从缓存中去除。 默认值是`on`。

- `enable_mergejoin` (`boolean`)

  允许或禁止查询规划器使用归并连接计划类型。默认值是`on`。

- `enable_nestloop` (`boolean`)

  允许或禁止查询规划器使用嵌套循环连接计划。它不可能完全禁止嵌套循环连接，但是关闭这个变量将使得规划器尽可能优先使用其他方法。默认值是`on`。

- `enable_parallel_append` (`boolean`)

  允许或禁止查询规划器使用并行追加计划类型。默认值是`on`。

- `enable_parallel_hash` (`boolean`)

  允许或禁止查询规划器对并行哈希使用哈希连接计划类型。如果哈希连接计划也没有启用，这个参数没有效果。默认值是`on`。

- `enable_partition_pruning` (`boolean`)

  允许或者禁止查询规划器从查询计划中消除一个分区表的分区。这也控制着规划器产生允许执行器在查询执行期间移除（忽略）分区的查询计划的能力。默认值是`on`。详情请参考[第 5.11.4 节](http://www.postgres.cn/docs/14/ddl-partitioning.html#DDL-PARTITION-PRUNING)。

- `enable_partitionwise_join` (`boolean`)

  允许或者禁止查询规划器使用面向分区的连接，这使得分区表之间的连接以连接匹配的分区的方式来执行。 面向分区的连接当前只适用于连接条件包括所有分区键的情况，连接条件必须是相同的数据类型并且子分区集合要1对1匹配。 由于面向分区的连接规划在规划期间会使用可观的CPU时间和内存，所以默认值为`off`。

- `enable_partitionwise_aggregate` (`boolean`)

  允许或者禁止查询规划器使用面向分区的分组或聚集，这使得在分区表上的分组或聚集可以在每个分区上分别执行。如果`GROUP BY`子句不包括分区键，只有部分聚集能够以基于每个分区的方式执行，并且finalization必须最后执行。由于面向分区的分组或聚集在规划期间会使用可观的CPU时间和内存，所以默认值为`off`。

- `enable_seqscan` (`boolean`)

  允许或禁止查询规划器使用顺序扫描计划类型。它不可能完全禁止顺序扫描，但是关闭这个变量将使得规划器尽可能优先使用其他方法。默认值是`on`。

- `enable_sort` (`boolean`)

  允许或禁止查询规划器使用显式排序步骤。它不可能完全禁止显式排序，但是关闭这个变量将使得规划器尽可能优先使用其他方法。默认值是`on`。

- `enable_tidscan` (`boolean`)

  允许或禁止查询规划器使用TID扫描计划类型。默认值是`on`。

### 20.7.2. 规划器代价常量

这一节中描述的*代价*变量可以按照任意尺度衡量。我们只关心它们的相对值，将它们以相同的因子缩放不会影响规划器的选择。默认情况下，这些代价变量是基于顺序页面获取的代价的，即`seq_page_cost`被设置为`1.0`并且其他代价变量都参考它来设置。不过你可以使用你喜欢的不同尺度，例如在一个特定机器上的真实执行时间。

### 注意

不幸的是，没有一种良好定义的方法来决定代价变量的理想值。它们最好被作为一个特定安装将接收到的查询的平均值来对待。这意味着基于少量的实验来改变它们是有风险的。

- `seq_page_cost` (`floating point`)

  设置规划器计算一次顺序磁盘页面抓取的开销。默认值是1.0。 通过设置同名的表空间参数，这个值可以重写为一个特定的表空间。 参阅ALTER TABLESPACE。 设置规划器对一系列顺序磁盘页面获取中的一次的代价估计。默认值是 1.0。通过把表和索引放在一个特殊的表空间（要设置该表空间的同名参数）中可以覆盖这个值（见[ALTER TABLESPACE](http://www.postgres.cn/docs/14/sql-altertablespace.html)）。

- `random_page_cost` (`floating point`)

  设置规划器对一次非顺序获取磁盘页面的代价估计。默认值是 4.0。通过把表和索引放在一个特殊的表空间（要设置该表空间的同名参数）中可以覆盖这个值（见[ALTER TABLESPACE](http://www.postgres.cn/docs/14/sql-altertablespace.html)）。减少这个值（相对于`seq_page_cost`）将导致系统更倾向于索引扫描；提高它将让索引扫描看起来相对更昂贵。你可以一起提高或降低两个值来改变磁盘 I/O 代价相对于 CPU 代价的重要性，后者由下列参数描述。对磁盘存储的随机访问通常比顺序访问要贵不止四倍。但是，由于对磁盘的大部分随机访问（例如被索引的读取）都被假定在高速缓冲中进行，所以使用了一个较低的默认值（4.0）。默认值可以被想成把随机访问建模为比顺序访问慢 40 倍，而期望 90% 的随机读取会被缓存。如果你相信 90% 的缓冲率对你的负载是一个不正确的假设，你可以增加 random_page_cost 来更好的反映随机存储读取的真正代价。 相应地，如果你的数据可以完全放在高速缓存中（例如当数据库小于服务器总内存时），降低 random_page_cost 可能是合适的。 为具有很低的随机读取代价的存储（例如固态驱动器）采用较低的 random_page_cost 值可能更好，例如`1.1`。提示虽然允许你将random_page_cost设置的比 seq_page_cost小，但是物理上的实际情况并不受此影响。 然而当所有数据库都位于内存中时，两者设置为相等是非常合理的，因为 在此情况下，乱序抓取并不比顺序抓取开销更大。同样，在缓冲率很高的 数据库上，你应当相对于 CPU 开销同时降低这两个值，因为获取内存中 的页比通常情况下的开销小许多。 尽管系统可以是你把`random_page_cost`设置得小于`seq_page_cost`，但是实际上没有意义。不过，如果数据库被整个缓存在 RAM 中，将它们设置为相等是有意义的，因为在那种情况中不按顺序访问页面是没有惩罚值的。同样，在一个高度缓存化的数据库中，你应该相对于 CPU 参数降低这两个值，因为获取一个已经在 RAM 中的页面的代价要远小于通常情况下的代价。

- `cpu_tuple_cost` (`floating point`)

  设置规划器对一次查询中处理每一行的代价估计。默认值是 0.01。

- `cpu_index_tuple_cost` (`floating point`)

  设置规划器对一次索引扫描中处理每一个索引项的代价估计。默认值是 0.005。

- `cpu_operator_cost` (`floating point`)

  设置规划器对于一次查询中处理每个操作符或函数的代价估计。默认值是 0.0025。

- `parallel_setup_cost` (`floating point`)

  设置规划器对启动并行工作者进程的代价估计。默认是 1000。

- `parallel_tuple_cost` (`floating point`)

  设置规划器对于从一个并行工作者进程传递一个元组给另一个进程的代价估计。默认是 0.1。

- `min_parallel_table_scan_size` (`integer`)

  为必须扫描的表数据量设置一个最小值，扫描的表数据量超过这一个值才会考虑使用并行扫描。 对于并行顺序扫描，被扫描的表数据量总是等于表的尺寸，但是在使用索引时，被扫描的表数据量通常会更小。 如果指定值时没有单位，则以块为单位，即`BLCKSZ`字节，通常为8kB。默认值是8兆字节（`8MB`）。

- `min_parallel_index_scan_size` (`integer`)

  为必须扫描的索引数据量设置一个最小值，扫描的索引数据量超过这一个值时才会考虑使用并行扫描。 注意并行索引扫描通常并不会触及整个索引，它是规划器认为该扫描会实际用到的相关页面的数量。 这个参数还用于决定特定的索引是否参与并行vacuum。参见[VACUUM](http://www.postgres.cn/docs/14/sql-vacuum.html)。 如果指定值时没有单位，则以块为单位，即`BLCKSZ`字节，通常为8kB。默认值是512千字节（`512kB`）。

- `effective_cache_size` (`integer`)

  设置规划器对一个单一查询可用的有效磁盘缓冲区尺寸的假设。 这个参数会被考虑在使用一个索引的代价估计中，更高的数值会使得索引扫描更可能被使用，更低的数值会使得顺序扫描更可能被使用。 在设置这个参数时，你还应该考虑PostgreSQL的共享缓冲区以及将被用于PostgreSQL数据文件的内核磁盘缓冲区，尽管有些数据可能在两个地方都存在。 另外，还要考虑预计在不同表上的并发查询数目，因为它们必须共享可用的空间。 这个参数对PostgreSQL分配的共享内存尺寸没有影响，它也不会保留内核磁盘缓冲，它只用于估计的目的。系统也不会假设在查询之间数据会保留在磁盘缓冲中。 如果指定值时没有单位，则以块为单位，即`BLCKSZ`字节，通常为8kB。 默认值是 4吉字节（`4GB`）。(如果`BLCKSZ`不是8kB，默认值会按比例缩放它。)

- `jit_above_cost` (`floating point`)

  设置激活JIT编译的查询代价，如果查询代价超过这个值就会激活JIT编译（如果启用了JIT，见[第 32 章](http://www.postgres.cn/docs/14/jit.html)）。执行JIT会消耗一些规划时间，但是能够加速查询执行。将这个值设置为`-1`会禁用JIT编译。默认值是`100000`。

- `jit_inline_above_cost` (`floating point`)

  设置JIT编译尝试内联函数和操作符的查询代价阈值，如果查询代价超过这个值，JIT编译就会尝试内联。内联会增加规划时间，但是可以提高执行速度。将这个参数设置成小于`jit_above_cost`是没有意义的。将这个参数设置为`-1`会禁用内联。默认值是`500000`。

- `jit_optimize_above_cost` (`floating point`)

  设置JIT编译应用优化的查询代价阈值，如果查询代价超过这个值，JIT编译就会应用开销较大的优化。这类优化会增加规划时间，但是更能够改进执行速度。将这个参数设置成小于`jit_above_cost`是没有意义的，并且将它设置成大于`jit_inline_above_cost`也未必有益。将这个参数设置为`-1`会禁用开销较大的优化。默认值是`500000`。

### 20.7.3. 遗传查询优化

GEQO是一个使用探索式搜索来执行查询规划的算法。它可以降低负载查询的规划时间。 同时，GEQO的检索是随机的，因此它的规划可能会不可确定。 更多信息参阅Chapter 50。 遗传查询规划器（GEQO）是一种使用启发式搜索来进行查询规划的算法。它可以降低对于复杂查询（连接很多表的查询）的规划时间，但是代价是它产生的计划有时候要差于使用穷举搜索算法找到的计划。详见[第 60 章](http://www.postgres.cn/docs/14/geqo.html)。

- `geqo` (`boolean`)

  允许或禁止遗传查询优化。默认是启用。在生产环境中通常最好不要关闭它。`geqo_threshold`变量提供了对 GEQO 更细粒度的空值。

- `geqo_threshold` (`integer`)

  只有当涉及的`FROM`项数量至少有这么多个的时候，才使用遗传查询优化（注意一个`FULL OUTER JOIN`只被计为一个`FROM`项）。默认值是 12。对于更简单的查询，通常会使用普通的穷举搜索规划器，但是对于有很多表的查询穷举搜索会花很长时间，通常比执行一个次优的计划带来的惩罚值还要长。因此，在查询尺寸上的一个阈值是管理 GEQO 使用的一种方便的方法。

- `geqo_effort` (`integer`)

  控制 GEQO 里规划时间和查询规划的有效性之间的平衡。这个变量必须是 一个范围从 1 到 10 的整数。缺省值是 5 。大的数值增加花在进行查询 规划上面的时间，但是也很可能会提高选中更有效的查询规划的几率。 控制 GEQO 中规划时间和查询计划质量之间的折中。这个变量必须是位于 1 到 10 之间的一个整数。默认值是 5。更大的值会增加花在查询规划上的时间，但是同时也增加了选择一个高效查询计划的可能性。`geqo_effort`实际并不直接做任何事情；它只是被用来计算其他影响 GEQO 行为的变量（如下所述）的默认值。如果你愿意，你可以手工设置其他参数。

- `geqo_pool_size` (`integer`)

  控制 GEQO 使用的池尺寸，它就是遗传种群中的个体数目。它必须至少为 2，且有用的值通常在 100 到 1000 之间。如果它被设置为零（默认设置）则会基于`geqo_effort`和查询中表的数量选择一个合适的值。

- `geqo_generations` (`integer`)

  控制 GEQO 使用的子代数目。子代的意思是算法的迭代次数。它必须至少 是 1 ，有用的值范围和池大小相同。如果设置为零(缺省)，那么将基于 geqo_pool_size选取合适的值。 控制 GEQO 使用的代数，也是算法的迭代次数。它必须至少为 1，并且有用值的范围和池尺寸相同。如果它被设置为零（默认设置）则会基于`geqo_pool_size`选择一个合适的值。

- `geqo_selection_bias` (`floating point`)

  控制 GEQO 使用的选择偏好。选择偏好是种群中的选择压力。值可以是 1.5 到 2.0 之间，后者是默认值。

- `geqo_seed` (`floating point`)

  控制 GEQO 使用的随机数生成器的初始值，随机数生成器用于在连接顺序搜索空间中选择随机路径。该值可以从 0 （默认值）到 1。变化该值会改变被探索的连接路径集合，并且可能导致找到一个更好或更差的路径。

### 20.7.4. 其他规划器选项

- `default_statistics_target` (`integer`)

  为没有通过`ALTER TABLE SET STATISTICS`设置列相关目标的表列设置默认统计目标。更大的值增加了需要做`ANALYZE`的时间，但是可能会改善规划器的估计质量。默认值是 100。有关PostgreSQL查询规划器使用的统计信息的更多内容， 请参考[第 14.2 节](http://www.postgres.cn/docs/14/planner-stats.html)。

- `constraint_exclusion` (`enum`)

  控制查询规划器对表约束的使用，以优化查询。 `constraint_exclusion`的允许值是`on`（对所有表检查约束）、`off`（从不检查约束）和`partition`（只对继承的子表和`UNION ALL`子查询检查约束）。 `partition`是默认设置。它通常与传统的继承树一起使用来提高性能。当对一个特定表允许这个参数，规划器比较查询条件和表的`CHECK`约束，并且忽略那些条件违反约束的表扫描。例如：`CREATE TABLE parent(key integer, ...); CREATE TABLE child1000(check (key between 1000 and 1999)) INHERITS(parent); CREATE TABLE child2000(check (key between 2000 and 2999)) INHERITS(parent); ... SELECT * FROM parent WHERE key = 2400; `在启用约束排除时，这个`SELECT`将完全不会扫描`child1000`，从而提高性能。目前，约束排除只在通过继承树实现表分区的情况中被默认启用。为所有表启用它会增加额外的规划开销，特别是在简单查询上并且不会产生任何好处。 如果没有用传统继承树分区的表时，最好是完全关闭它。(注意分区表的等效特性是由单独的参数控制的，[enable_partition_pruning](http://www.postgres.cn/docs/14/runtime-config-query.html#GUC-ENABLE-PARTITION-PRUNING).)更多关于使用约束排除实现分区的信息请参阅[第 5.11.5 节](http://www.postgres.cn/docs/14/ddl-partitioning.html#DDL-PARTITIONING-CONSTRAINT-EXCLUSION)。

- `cursor_tuple_fraction` (`floating point`)

  设置规划器对将被检索的一个游标的行的比例的估计。默认值是 0.1。更小的值使得规划器偏向为游标使用“快速开始”计划，它将很快地检索前几行但是可能需要很长时间来获取所有行。更大的值强调总的估计时间。最大设置为 1.0，游标将和普通查询完全一样地被规划，只考虑总估计时间并且不考虑前几行会被多快地返回。

- `from_collapse_limit` (`integer`)

  如果生成的`FROM`列表不超过这么多项，规划器将把子查询融合到上层查询。较小的值可以减少规划时间，但是可能 会生成较差的查询计划。默认值是 8。详见[第 14.3 节](http://www.postgres.cn/docs/14/explicit-joins.html)。将这个值设置为[geqo_threshold](http://www.postgres.cn/docs/14/runtime-config-query.html#GUC-GEQO-THRESHOLD)或更大，可能触发使用 GEQO 规划器，从而产生非最优计划。见[第 20.7.3 节](http://www.postgres.cn/docs/14/runtime-config-query.html#RUNTIME-CONFIG-QUERY-GEQO)。

- `jit` (`boolean`)

  决定如果可用（见[第 32 章](http://www.postgres.cn/docs/14/jit.html)），PostgreSQL是否可以使用JIT编译。默认值是`on`。

- `join_collapse_limit` (`integer`)

  如果得出的列表中不超过这么多项，那么规划器将把显式`JOIN`（除了`FULL JOIN`）结构重写到 `FROM`项列表中。较小的值可减少规划时间，但是可能会生成差些的查询计划。默认情况下，这个变量被设置成和`from_collapse_limit`相同， 这样适合大多数使用。把它设置为 1 可避免任何显式`JOIN`的重排序。因此查询中指定的显式连接顺序就是关系被连接的实际顺序。因为查询规划器并不是总能 选取最优的连接顺序，高级用户可以选择暂时把这个变量设置为 1，然后显式地指定他们想要的连接顺序。更多信息请见[第 14.3 节](http://www.postgres.cn/docs/14/explicit-joins.html)。将这个值设置为[geqo_threshold](http://www.postgres.cn/docs/14/runtime-config-query.html#GUC-GEQO-THRESHOLD)或更大，可能触发使用 GEQO 规划器，从而产生非最优计划。见[第 20.7.3 节](http://www.postgres.cn/docs/14/runtime-config-query.html#RUNTIME-CONFIG-QUERY-GEQO)。

- `plan_cache_mode` (`enum`)

  准备语句（显式准备或隐式生成的，例如 PL/pgSQL）可以使用自定义或通用计划执行。 使用其特定的参数值集为每个执行重新生成自定义计划，而通用计划不依赖于参数值，并且可以在执行中重复使用。 因此，使用通用计划可以节省计划时间，但如果理想计划严重依赖参数值，则通用计划可能效率低下。 这些选项之间的选择通常是自动进行的，但可以通过`plan_cache_mode`覆盖它。 允许的值为 `auto` (默认的),`force_custom_plan` 和 `force_generic_plan`。 这个设置是在执行缓存计划时考虑，而不是在准备计划时考虑。 更多信息请参阅 [PREPARE](http://www.postgres.cn/docs/14/sql-prepare.html).