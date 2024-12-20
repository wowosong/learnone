# [redis底层设计（一）——内部数据结构](https://www.cnblogs.com/gaopengfirst/p/10062980.html)

redis是一个key-value存储系统。和Memcached类似，它支持存储的value类型相对更多，包括string(字符串)、list(链表)、set(集合)、zset(sorted set --有序集合)和hash（哈希类型）。这些数据类型都支持push/pop、add/remove及取交集并集和差集及更丰富的操作，而且这些操作都是原子性的。在此基础上，redis支持各种不同方式的排序。与memcached一样，为了保证效率，数据都是缓存在内存中。区别的是redis会周期性的把更新的数据写入磁盘或者把修改操作写入追加的记录文件，并且在此基础上实现了master-slave(主从)同步。

# 1 内部数据结构

## 1.1 简单动态字符串sds:

Sds （Simple Dynamic String，简单动态字符串）是Redis 底层所使用的字符串表示，它被用在几乎所有的Redis 模块中。

### 1.1.1 sds的用途：

a.实现字符串对象（StringObject）：数据库的键总是包含一个sds值，而数据库的值保存的是String类型的时候值中包含sds值，否则包含的是long类型的值。

b.在redis程序内部用作char\*类型的替代品：char\*类型的功能单一抽象层次低不能支持redis的一些常用操作（长度计算和追加操作），

### 1.1.2 redis中的字符串：

在C 语言中，字符串可以用一个\\0 结尾的char 数组来表示。比如说，hello world 在C 语言中就可以表示为"hello world\\0" 。这种简单的字符串表示在大多数情况下都能满足要求，但是，它并不能高效地支持长度计算和追加（append）这两种操作：  
• 每次计算字符串长度（strlen(s)）的复杂度为θ(N) 。

• 对字符串进行N 次追加，必定需要对字符串进行N 次内存重分配（realloc）。

在Redis 内部，字符串的追加和长度计算并不少见，而APPEND 和STRLEN 更是这两种操作在Redis 命令中的直接映射，这两个简单的操作不应该成为性能的瓶颈。Redis 除了处理C 字符串之外，还需要处理单纯的字节数组，以及服务器协议等内容，所以为了方便起见，Redis 的字符串表示还应该是二进制安全的：程序不应对字符串里面保存的数据做任何假设，数据可以是以\\0 结尾的C 字符串，也可以是单纯的字节数组，或者其他格式的数据。（这就是redis用sds替换char\*的原因：sds可以高效的实现追加和长度计算，并且还是二进制安全的）

```c
typedef char *sds;
struct sdshdr {
    // buf 已占用长度
    int len;
    // buf 剩余可用长度
    int free;
    // 实际保存字符串数据的地方
    char buf[];
};
```

其实类型sds是char\*的别名，而结构sdshdr则保存了len、free、bug这三个参数属性。通过len 属性，sdshdr 可以实现复杂度为θ(1) 的长度计算操作。另一方面，通过对buf 分配一些额外的空间，并使用free 记录未使用空间的大小，sdshdr 可以让执行追加操作所需的内存重分配次数大大减少

###  1.1.3 优化追加操作：

当执行追加操作时，比如现在给key=‘Hello World’的字符串后追加‘ again!’，则这时的len=18，free由0变成了18，此时的buf='Hello World again!\\0                  '，也就是buf的内存空间是18+18+1=37个字节，其中‘\\0’占1个字节，redis给字符串多**分配了18个字节的预分配空间**，所以下次还有append追加的时候，如果预分配空间足够，就无须在进行空间分配了。在当前版本中，**当新字符串的长度小于1M时，redis会分配他们所需大小一倍的空间，当大于1M的时候，就为他们额外多分配1M的空间**。

思考：这种分配策略会浪费内存资源吗？

答：执行过APPEND 命令的字符串会带有额外的预分配空间，这些预分配空间不会被释放，除非该字符串所对应的键被删除，或者等到关闭Redis 之后，再次启动时**重新载入的字符串对象将不会有预分配空间**。因为执行APPEND 命令的字符串键数量通常并不多，占用内存的体积通常也不大，所以这一般并不算什么问题。另一方面，如果执行APPEND 操作的键很多，而字符串的体积又很大的话，那可能就需要修改Redis 服务器，让它定时释放一些字符串键的预分配空间，从而更有效地使用内存。

### 1.1.4 小结：

a.redis的字符串表示为sds，而不是C字符串（以\\0结尾的char\*）。

b.对比C字符串，sds有以下特性：高效的执行长度计算；高效的执行追加操作；二进制安全

c.sds会为追加操作进行优化，加快追加操作的速度，并降低内存分配的次数，代价是多占用了一些内存 ，而且这些内存不会被主动释放。

## 1.2 双向链表

链表作为数组之外的一种常用序列抽象，是大多数高级语言的基本数据类型，因为C 语言本身不支持链表类型，大部分C 程序都会自己实现一种链表类型，Redis 也不例外——它实现了一个**双向链表结构**。

### 1.2.1 双向链表的应用：

双向链表作为一种通用的数据结构，在Redis 内部使用得非常多：它既是Redis 列表结构的底层实现之一，还被大量Redis 模块所使用，用于构建Redis 的其他功能。

注意：redis列表使用两种数据结构作为底层实现：双向链表和压缩列表。因为双向链表占用的内存比压缩列表的要多，所以在创建新的列表键时，列表会优先考虑使用压缩列表作为底层实现，并且在有需要的时候，才会从压缩列表实现转换到双向链表实现。

除了实现列表类型以外，双向列表还被很多redis内部模块所应用：

a.事务模块使用双向链表来按顺序保存输入的命令；

b.服务器模块使用双向链表来保存多个客户端；

c.订阅/发送模块使用双向链表来保存订阅模式的多个客户端；

d.时间模块使用双向链表来保存时间事件（time event）

除此之外，其实类似的应用还有很多。

### 1.2.2 双向链表的实现：

双向链表是由listNode和list两个数据结构组成，如下：![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071242558.png)

其中listNode是双向链表的节点，包含prev(前驱指针)、next(后继指针)和value(数值)；list是双向链表本身，包含head（表头指针）、tail（表尾指针）、len（节点数量）、dup（复制函数）、free（释放函数）和match（对比函数）

举个例子：当删除一个listNode时，如果包含这个节点的list的list->free函数不为空，那么删除函数就会先调用list->free（listNode->value）清空节点的值，再执行余下的删除操作（比如说释放节点）。

从结构上总结出他们的性能特征：

a. listNode带有prev和next两个指针，因此对链表的遍历可以在两个方向上进行：从表头到表尾，或者从表尾到表头。

b.list保存了head和tail两个指针，因此对链表的表头和表尾进行插入的复杂度都是θ（1）——这是实现LPUSH、RPOP、RPUSH、LPOP的关键。

c.list带有保存九点数量的len属性，所以计算链表长度的复杂度为θ（1），所以LLEN的命令性能很高。

### 1.2.3 迭代器：

redis为双向链表实现了一个迭代器，这个迭代器可以从两个方向对双向链表进行迭代：

\*沿着节点的next指针前进，从表头向表尾迭代；

\*沿着节点的prev指针前进，从表尾向表头迭代；

### 1.2.4 小结：

**redis实现了自己的双向链表结构**；

**双向链表主要有两个作用**：

  -作为redis列表类型的底层实现之一；

  -作为通用数据结构，被其他功能模块所使用；

**双向链表及其节点的性能特性如下**：

  -节点带有前驱和后继指针，访问前驱节点和后继节点的时间复杂度为θ（1），并且堆链表的迭代可以在从表头到表尾和从表尾到表头两个方向进行；

  -链表带有只想表头和表尾的指针，因此对表头和表尾进行处理的复杂度为θ（1）；

  -链表带有记录节点数量的属性，所以可以在θ（1）复杂度内返回链表的节点数量（长度）；

## 1.3 字典

字典，又名映射（map）或关联数组（associative array），他是一种抽象的数据结构，由一集键值对组成，各个键值对的键各不相同，程序可以将新的键值对添加到字典中，或者基于键进行查找、更新或删除操作。

### 1.3.1字典的应用

字典的主要用途有以下两个：

1)实现数据库键空间（key space）

redis是一个键值对数据库，数据库中的键值对就是由字典保存：每个数据库都有一个与之相对应的字典，这个字典被称为键空间（key space）。当用户添加一个键值对到数据库时（不论数据库是什么类型），程序就将该键值对添加到键空间；当用户从数据库删除一个键值对时，程序就会将这个键值对从键空间删除

2)用作Hash类型键的其中一种底层实现

redis的Hush类型键使用以下两种数据结构作为底层实现：字典、压缩列表。因为压缩列表比字典更节省内存，所以程序在创建新Hush键时，默认使用压缩列表作为底层实现，当有需要时，程序才会将底层实现从压缩列表转换为字典。

### 1.3.2 字典的实现

在众多可能的实现中，redis选择了高效且实现简单的哈希表作为字典的底层实现。

```c
/*
* 字典
**
每个字典使用两个哈希表，用于实现渐进式rehash
*/
typedef struct dict {
// 特定于类型的处理函数
dictType *type;
// 类型处理函数的私有数据
void *privdata;
// 哈希表（2 个）
dictht ht[2];
// 记录rehash 进度的标志，值为-1 表示rehash 未进行
int rehashidx;
// 当前正在运作的安全迭代器数量
int iterators;
} dict;
```
以下是用于处理dict 类型的API ，它们的作用及相应的算法复杂度：

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071243062.png)

注意：dict 类型使用了两个指针分别指向两个哈希表，其中0号哈希表（ht\[0\]）表示字典主要使用的哈希表，而1号哈希表（ht\[1\]）表示只有在程序对0号哈希表进行rehash时才使用。

```c
/*
* 哈希表
*/
typedef struct dictht {
// 哈希表节点指针数组（俗称桶，bucket）
dictEntry **table;
// 指针数组的大小
unsigned long size;
// 指针数组的长度掩码，用于计算索引值
unsigned long sizemask;
// 哈希表现有的节点数量
unsigned long used;
} dictht;
```

table属性是一个数组，数组的每个元素都是一个指向dictEntry结构的指针。每个dictEntry都保存着一个键值对，以及一个指向另一个dictEntry结构的指针：

```c
/*
* 哈希表节点
*/
typedef struct dictEntry {
// 键
void *key;
// 值
union {
void *val;
uint64_t u64;
int64_t s64;
} v;
// 链往后继节点
struct dictEntry *next;
} dictEntry;
```

next属性指向另一个dictEntry结构，多个dictEntry可以通过next指针串连成链表，dictht使用链地址法来处理键碰撞（链地址法：将全部具有同样哈希地址的而不同keyword的数据元素连接到同一个单链表中。假设选定的哈希表长度为m，则可将哈希表定义为一个有m个头指针组成的指针数组T\[0..m-1\]。凡是哈希地址为i的数据元素，均以节点的形式插入到T\[i\]为头指针的单链表中。而且新的元素插入到链表的前端，这不仅由于方便。还由于常常发生这种事实：新近插入的元素最有可能不久又被访问。）哈希表例子：

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071243448.png)

### 1.3.3 添加键值对到字典

根据字典所处的状态，将一个给定的键值对添加到字典可能会引起一系列复杂的操作：

\*如果字典未初始化（字典的0号哈希表的table属性为空），那么程序需要怼0号哈希表进行初始化；

\*如果在插入时发生了键碰撞，那么程序需要处理碰撞；

\*如果新插入的元素使得字典满足了rehash条件，那么需要启动相应的rehash程序；

下面分别介绍添加操作在以上三种情况下的执行：

（1）字典为空

程序会根据dict.h/DICT\_HT\_INITIAL\_SIZE 里指定的大小为d->ht\[0\]->table 分配空间（在目前的版本中，DICT\_HT\_INITIAL\_SIZE 的值为4 ）。下面是添加键值对后的样子：

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071243533.png)

（2）添加新键值对时发生碰撞处理

在哈希表实现中，当两个不同的键拥有相同的哈希值时，我们称这两个键发生碰撞，而哈希表实现必须对碰撞进行处理。一般会采用链地址法（使用链表将多个哈希值相同的节点串连在一起），如下：

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071243834.png)

对于一个新的键值对key4 和value4 ，如果key4 的哈希值和key1 的哈希值相同，那么它们将在哈希表的0 号索引上发生碰撞。通过将key4-value4 和key1-value1 两个键值对用链表连接起来，就可以解决碰撞的问题：

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071243115.png)

（3）触发rehash操作：

对于使用链地址法来解决碰撞问题的哈希表dictht 来说，哈希表的性能依赖于它的大小（size属性）和它所保存的节点的数量（used 属性）之间的比率：

• 比率在1:1 时，哈希表的性能最好；  
• 如果节点数量比哈希表的大小要大很多的话，那么哈希表就会退化成多个链表，哈希表本身的性能优势就不再存在；

如下：![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071243880.png)

对于上面这个哈希表，平均每次失败查询需要5个节点，效率极低。为了在字典的键值对不断增多的情况下保持良好的性能，字典需要对所使用的哈希表（ht\[0\]）进行rehash 操作：在不修改任何键值对的情况下，对哈希表进行扩容，尽量将比率维持在1:1左右。dictAdd 在每次向字典添加新键值对之前，都会对哈希表ht\[0\] 进行检查，对于ht\[0\] 的size 和used 属性，如果它们之间的比率ratio = used / size 满足以下任何一个条件的话，rehash 过程就会被激活：

1. 自然rehash ：ratio >= 1 ，且变量dict\_can\_resize 为真。  
2. 强制rehash ： ratio 大于变量dict\_force\_resize\_ratio （目前版本中，dict\_force\_resize\_ratio 的值为5 ）。

### 1.3.4 rehash执行过程：

1.创建一个比ht\[0\]->table 更大的ht\[1\]->table；

2.将ht\[0\]->table中的所有键值对前一代ht\[1\]->table；

3.将原有ht\[0\]的数据清空，并将ht\[1\]替换成新的ht\[0\]；

下面具体介绍rehash的完整过程：

a.开始rehash

设置字典的rehashidx为0，标志着rehash的开始；为ht\[1\]->table分配空间，大小至少是ht\[0\]->table 的两倍；![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071243326.png)

b.rehash进行中

在这个阶段，ht\[0\]->table 的节点会被逐渐迁移到ht\[1\]->table ，因为rehash 是分多次进行的，字典的rehashidx 变量会记录rehash 进行到ht\[0\] 的哪个索引位置上：![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071243254.png)

c.rehash完毕：

在rehash 的最后阶段，程序会执行以下工作：  
1. 释放ht\[0\] 的空间；  
2. 用ht\[1\] 来代替ht\[0\] ，使原来的ht\[1\] 成为新的ht\[0\] ；  
3. 创建一个新的空哈希表，并将它设置为ht\[1\] ；  
4. 将字典的rehashidx 属性设置为-1 ，标识rehash 已停止；  
以下是字典rehash 完毕之后的样子：![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071243008.png)

对比字典rehash之前和之后，新的ht\[0\]空间更大，并且字典原有的键值对也没有被修改或者删除。

### 1.3.5 渐进式rehash：

在一个有很多键值对的字典里，某个用户在添加新键值对时触发了rehash　　过程，如果这个rehash 过程必须将所有键值对迁移完毕之后才将结果返回给用户，这样的处理　　方式将是非常不友好的。另一方面，要求服务器必须阻塞直到rehash 完成，这对于Redis 服务器本身也是不能接受的。为了解决这个问题，Redis 使用了渐进式（incremental）的rehash 方式：通过将rehash 分散到多个步骤中进行，从而避免了集中式的计算。  
渐进式rehash 主要由\_dictRehashStep 和dictRehashMilliseconds 两个函数进行：  
    • \_dictRehashStep 用于对数据库字典、以及哈希键的字典进行被动rehash ；  
    • dictRehashMilliseconds 则由Redis 服务器常规任务程序（server cron job）执行，用于对数据库字典进行主动rehash ；

\_dictRehashStep：每次执行\_dictRehashStep ，ht\[0\]->table 哈希表第一个不为空的索引上的所有节点就会全部迁移到ht\[1\]->table 。在rehash 开始进行之后（d->rehashidx 不为-1），每次执行一次添加、查找、删除操作，\_dictRehashStep 都会被执行一次。因为字典会保持哈希表大小和节点数的比率在一个很小的范围内，所以每个索引上的节点数量不会很多（从目前版本的rehash 条件来看，平均只有一个，最多通常也不会超过五个），所以在执行操作的同时，对单个索引上的节点进行迁移，几乎不会对响应时间造成影响。

dictRehashMilliseconds： 可以在指定的毫秒数内，对字典进行rehash 。当Redis 的服务器常规任务执行时，dictRehashMilliseconds 会被执行，在规定的时间内，尽可能地对数据库字典中那些需要rehash 的字典进行rehash ，从而加速数据库字典的rehash进程。

在哈希表进行rehash 时，字典还会采取一些特别的措施，确保rehash 顺利、正确地进行：  
    • 因为在rehash 时，字典会同时使用两个哈希表，所以在这期间的所有查找、删除等操作，除了在ht\[0\] 上进行，还需要在ht\[1\] 上进行。  
    • 在执行添加操作时，新的节点会直接添加到ht\[1\] 而不是ht\[0\] ，这样保证ht\[0\] 的节点数量在整个rehash 过程中都只减不增。

### 1.3.6 字典的收缩：

上面描述了通过rehash对字典的扩展，如果哈希表的也用节点数比已用节点数搭很多，那么也可以通过哈希表进行rehash来收缩字典。执行步骤如下：

1）创建一个比ht\[0\]->table 小的ht\[1\]->table ;

2）将ht\[0\]->table中的所有键值对迁移到ht\[1\]->table ；

3）将原有的ht\[0\]的数据清空，并将ht\[1\]替换成ht\[0\]；  

字典的收缩规则由htNeedsResize函数定义：

```c
/*
* 检查字典的使用率是否低于系统允许的最小比率
**
是的话返回1 ，否则返回0 。
*/
int htNeedsResize(dict *dict) {
long long size, used;
// 哈希表已用节点数量
size = dictSlots(dict);
// 哈希表大小
used = dictSize(dict);
// 当哈希表的大小大于DICT_HT_INITIAL_SIZE
// 并且字典的填充率低于REDIS_HT_MINFILL 时
// 返回1
return (size && used && size > DICT_HT_INITIAL_SIZE &&
(used*100/size < REDIS_HT_MINFILL));
}
```

在默认情况下，REDIS\_HT\_MINFILL 的值为10 ，也即是说，当字典的填充率低于10% 时，程序就可以对这个字典进行收缩操作了。  
字典收缩和字典扩展的一个区别是：  
• 字典的扩展操作是自动触发的（不管是自动扩展还是强制扩展）；  
• 而字典的收缩操作则是由程序手动执行。  
因此，使用字典的程序可以决定何时对字典进行收缩：  
• 当字典用于实现哈希键的时候，每次从字典中删除一个键值对，程序就会执行一次htNeedsResize 函数，如果字典达到了收缩的标准，程序将立即对字典进行收缩；  
• 当字典用于实现数据库键空间（key space） 的时候， 收缩的时机由redis.c/tryResizeHashTables 函数决定。

### 1.3.7 字典的迭代：

字典有自己的迭代器实现——对字典进行迭代实际上就是对字典所使用的哈希表进行迭代：

    • 迭代器首先迭代字典的第一个哈希表，然后，如果rehash正在进行的话，就继续对第二个哈希表进行迭代；
    
    • 当迭代哈希表时，找到第一个不为空的索引，然后迭代这个索引上的所有节点。
    
    • 当这个索引迭代完了，继续查找下一个不为空的索引，如此循环，一直到整个哈希表都迭代完为止。

字典的迭代器有两种：

    • 安全迭代器
    
    • 不安全迭代器

```c
/*
* 字典迭代器
*/
typedef struct dictIterator {
dict *d; // 正在迭代的字典
int table, // 正在迭代的哈希表的号码（0 或者1）
index, // 正在迭代的哈希表数组的索引
safe; // 是否安全？
dictEntry *entry, // 当前哈希节点
*nextEntry; // 当前哈希节点的后继节点
} dictIterator;
```

以下是这个迭代器的api:

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071243543.png)

### 1.3.8 小结：　　　　

• 字典是由键值对构成的抽象数据结构；

• Redis 中的数据库和哈希键都是基于字典来实现的；

• Redis 字典的底层实现为哈希表，每个字典使用两个哈希表，一般情况下只使用0号哈希表，只有在rehash进行时，才会使用0号和1号哈希表；

• 哈希表使用链地址法来解决键冲突的问题；

• rehash可以用于扩展和收缩哈希表；

• 对哈希表的rehash是分多次、渐进式地进行。

## 1.4 跳跃表

跳跃表是一种随机化的数据，这种数据结构以有序的方式在层次化的链表中保存元素，如下图：

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071243906.png)

从上图中我们可以看出跳跃表的结构组成：

• 表头（head）：负责维护跳跃表的节点指针。  
• 跳跃表节点：保存着元素值，以及多个层。  
• 层：保存着指向其他元素的指针。高层的指针越过的元素数量大于等于低层的指针，为了提高查找的效率，程序总是从高层先开始访问，然后随着元素值范围的缩小，慢慢降低层次。  
• 表尾：全部由NULL 组成，表示跳跃表的末尾。

### 1.4.1 跳跃表的实现：

a.允许重复的score值：多个不同的member的score值可以相同；

b.进行对比操作时，不仅要检查score值，还要检查member：当score值可以重复时，单靠score值无法判断一个元素的身份，所以需要连member域都一并检查才行；

c.每个节点都带有一个高度为1层的后腿指针，用于从表头方向向表尾方向迭代：当执行ZERVRANGE或ZREVRSNGEBYSCORE这类以逆序处理有序集的命令时，就会用到这个属性。

```c
typedef struct zskiplist {
// 头节点，尾节点
struct zskiplistNode *header, *tail;
// 节点数量
unsigned long length;
// 目前表内节点的最大层数
int level;
} zskiplist;
跳跃表的节点由redis.h/zskiplistNode 定义：
typedef struct zskiplistNode {
// member 对象
robj *obj;
// 分值
double score;
// 后退指针
struct zskiplistNode *backward;
// 层
struct zskiplistLevel {
// 前进指针
struct zskiplistNode *forward;
// 这个层跨越的节点数量
unsigned int span;
} level[];
} zskiplistNode;
```

### 1.4.2 跳跃表的应用：

和字典、链表或者字符串这几种在redis中大量使用的数据结构不同，跳跃表在redis的唯一作用就是实现有序集数据类型。

跳跃表将指向有序集的score值和member域的指针作为元素，并以score值为索引，对有序集元素进行排序。

### 1.4.3 小结：

跳跃表是一种随机化数据结构，它的查找、添加、删除操作都可以在对数期望时间下完成；

跳跃表目前在redis的唯一作用就是作为有序集类型的底层数据结构（之一，另一个构成有序集的结构是字典）；

为了适应自身的需求，redis基于William Pugh 论文中描述的跳跃表进行了修改，包括：

    a.score值可重复；
    
    b.对比一个元素需要同时检查它的score值和member域；
    
    c. 每个节点带有高度为1层的后退指针，用于从表尾方向向表头方向迭代。 

标签: [redis](https://www.cnblogs.com/gaopengfirst/tag/redis/), [设计与实现](https://www.cnblogs.com/gaopengfirst/tag/%E8%AE%BE%E8%AE%A1%E4%B8%8E%E5%AE%9E%E7%8E%B0/), [数据结构](https://www.cnblogs.com/gaopengfirst/tag/%E6%95%B0%E6%8D%AE%E7%BB%93%E6%9E%84/)

[«](https://www.cnblogs.com/gaopengfirst/p/10037887.html) 上一篇： [JVM深度解析](https://www.cnblogs.com/gaopengfirst/p/10037887.html "发布于 2018-11-29 13:58")  
[»](https://www.cnblogs.com/gaopengfirst/p/10065796.html) 下一篇： [redis底层设计（二）——内存映射数据结构](https://www.cnblogs.com/gaopengfirst/p/10065796.html "发布于 2018-12-04 18:08")