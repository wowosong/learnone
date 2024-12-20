

#    MySQL如何确保数据不丢失的？有几点我们可以借鉴   

[MySQL教程](http://www.itsoku.com/course/3)  ->  MySQL如何确保数据不丢失的？有几点我们可以借鉴    

[上一篇：聊聊如何使用MySQL实现分布式锁](http://www.itsoku.com/course/3/60)

[下一篇：MySQL系列测试库脚本](http://www.itsoku.com/course/3/196)

这是Mysql系列第27篇。

**本篇文章我们先来看一下mysql是如何确保数据不丢失的，通过本文我们可以了解mysql内部确保数据不丢失的原理，学习里面优秀的设计要点，然后我们再借鉴这些优秀的设计要点进行实践应用，加深理解。**

## 预备知识

1.  mysql内部是使用b+树的结构将数据存储在磁盘中，b+树中节点对应mysql中的页，mysql和磁盘交互的最小单位为页，页默认情况下为16kb，表中的数据记录存储在b+树的叶子节点中，当我们需要修改、删除、插入数据时，都需要按照页来对磁盘进行操作。
2.  磁盘顺序写比随机写效率要高很多，通常我们使用的是机械硬盘，机械硬盘写数据的时候涉及磁盘寻道、磁盘旋转寻址、数据写入的时间，耗时比较长，如果是顺序写，省去了寻道和磁盘旋转的时间，效率会高几个数量级。
3.  内存中数据读写操作比磁盘中数据读写操作速度高好多个数量级。

## mysql确保数据不丢失原理分析

我们来思考一下，下面这条语句的执行过程是什么样的：

```java
start transaction;
update t_user set name = '喔喔松Java' where user_id = 666;
commit;
```

按照正常的思路，通常过程如下：

1.  找到user\_id=666这条记录所在的页p1，将p1从磁盘加载到内存中
2.  在内存中对p1中user\_id=666这条记录信息进行修改
3.  mysql收到commit指令
4.  将p1页写入磁盘
5.  给客户端返回更新成功

上面过程可以确保数据被持久化到了磁盘中。

我们将需求改一下，如下：

```java
start transaction;
update t_user set name = '  喔喔松Java' where user_id = 666;
update t_user set name = 'javacode2018' where user_id = 888;
commit;
```

来看一下处理过程：

1.  找到user\_id=666这条记录所在的页p1，将p1从磁盘加载到内存中
2.  在内存中对p1中user\_id=666这条记录信息进行修改
3.  找到user\_id=888这条记录所在的页p2，将p2从磁盘加载到内存中
4.  在内存中对p2中user\_id=888这条记录信息进行修改
5.  mysql收到commit指令
6.  将p1页写入磁盘
7.  将p2页写入磁盘
8.  给客户端返回更新成功

上面过程我们看有什么问题

1.  假如6成功之后，mysql宕机了，此时p1修改已写入磁盘，但是p2的修改还未写入磁盘，最终导致user\_id=666的记录被修改成功了，user\_id=888的数据被修改失败了，数据是有问题的
2.  上面p1和p2可能位于磁盘的不同位置，涉及到磁盘随机写的问题，导致整个过程耗时也比较长

**上面问题可以归纳为2点：无法确保数据可靠性、随机写导致耗时比较长。**

关于上面问题，我们看一下mysql是如何优化的，mysql内部引入了一个redo log，这是一个文件，对于上面2条更新操作，mysql实现如下：

> mysql内部有个redo log buffer，是内存中一块区域，我们将其理解为数组结构，向redo log文件中写数据时，会先将内容写入redo log buffer中，后续会将这个buffer中的内容写入磁盘中的redo log文件，这个redo log buffer是整个mysql中所有连接共享的内存区域，可以被重复使用。

1.  mysql收到start transaction后，生成一个全局的事务编号trx\_id，比如trx\_id=10
    
2.  user\_id=666这个记录我们就叫r1，user\_id=888这个记录叫r2
    
3.  找到r1记录所在的数据页p1，将其从磁盘中加载到内存中
    
4.  在内存中找到r1在p1中的位置，然后对p1进行修改（这个过程可以描述为：将p1中的pos\_start1到pos\_start2位置的值改为v1），这个过程我们记为rb1(内部包含事务编号trx\_id)，将rb1放入redo log buffer数组中，此时p1的信息在内存中被修改了，和磁盘中p1的数据不一样了
    
5.  找到r2记录所在的数据页p2，将其从磁盘中加载到内存中
    
6.  在内存中找到r2在p2中的位置，然后对p2进行修改（这个过程可以描述为：将p2中的pos\_start1到pos\_start2位置的值改为v2），这个过程我们记为rb2(内部包含事务编号trx\_id)，将rb2放入redo log buffer数组中，此时p2的信息在内存中被修改了，和磁盘中p2的数据不一样了
    
7.  此时redo log buffer数组中有2条记录\[rb1,rb2\]
    
8.  mysql收到commit指令
    
9.  将redo log buffer数组中内容写入到redo log文件中，写入的内容：
    
    ```java
    1.start trx=10;
    2.写入rb1
    3.写入rb2
    4.end trx=10;
    ```
    
10.  返回给客户端更新成功。


上面过程执行完毕之后，数据是这样的：

1.  内存中p1、p2页被修改了，还未同步到磁盘中，此时内存中数据页和磁盘中数据页是不一致的，此时内存中数据页我们称为脏页
2.  对p1、p2页修改被持久到磁盘中的redolog文件中了，不会丢失

认真看一下上面过程中第9步骤，一个成功的事务记录在redo log中是有start和end的，redo log文件中如果一个trx\_id对应start和end成对出现，说明这个事务执行成功了，如果只有start没有end说明是有问题的。

**那么对p1、p2页的修改什么时候会同步到磁盘中呢？**

redo log是mysql中所有连接共享的文件，对mysql执行insert、delete和上面update的过程类似，都是先在内存中修改页数据，然后将修改过程持久化到redo log所在的磁盘文件中，然后返回成功。redo log文件是有大小的，需要重复利用的（redo log有多个，多个之间采用环形结构结合几个变量来做到重复利用，这块知识不做说明，有兴趣的可以去网上找一下），**当redo log满了，或者系统比较闲的时候**，会对redo log文件中的内容进行处理，处理过程如下：

1.  读取redo log信息，读取一个完整的trx\_id对应的信息，然后进行处理
    
2.  比如读取到了trx\_id=10的完整内容，包含了start end，表示这个事务操作是成功的，然后继续向下
    
3.  判断p1在内存中是否存在，如果存在，则直接将p1信息写到p1所在的磁盘中；如果p1在内存中不存在，则将p1从磁盘加载到内存，通过redo log中的信息在内存中对p1进行修改，然后将其写到磁盘中
    
    > 上面的update之后，p1在内存中是存在的，并且p1是已经被修改过的，可以直接刷新到磁盘中。
    > 
    > 如果上面的update之后，mysql宕机，然后重启了，p1在内存中是不存在的，此时系统会读取redo log文件中的内容进行恢复处理。
    
4.  将redo log文件中trx\_id=10的占有的空间标记为已处理，这块空间会被释放出来可以重复利用了
    
5.  如果第2步读取到的trx\_id对应的内容没有end，表示这个事务执行到一半失败了（可能是第9步骤写到一半宕机了），此时这个记录是无效的，可以直接跳过不用处理
    

上面的过程做到了：数据最后一定会被持久化到磁盘中的页中，不会丢失，做到了可靠性。

并且内部采用了先把页的修改操作先在内存中进行操作，然后再写入了redo log文件，此处redo log是按顺序写的，使用到了io的顺序写，效率会非常高，相对于用户来说响应会更快。

对于将数据页的变更持久化到磁盘中，此处又采用了异步的方式去读取redo log的内容，然后将页的变更刷到磁盘中，这块的设计也非常好，异步刷盘操作！

但是有一种情况，当一个事务commit的时候，刚好发现redo log不够了，此时会先停下来处理redo log中的内容，然后在进行后续的操作，遇到这种情况时，整个事物响应会稍微慢一些。

mysql中还有一个binlog，在事务操作过程中也会写binlog，先说一下binlog的作用，binlog中详细记录了对数据库做了什么操作，算是对数据库操作的一个流水，这个流水也是相当重要的，主从同步就是使用binlog来实现的，从库读取主库中binlog的信息，然后在从库中执行，最后，从库就和主库信息保持同步一致了。还有一些其他系统也可以使用binlog的功能，比如可以通过binlog来实现bi系统中etl的功能，将业务数据抽取到数据仓库，**阿里提供了一个java版本的项目：canal**，这个项目可以模拟从库从主库读取binlog的功能，也就是说可以通过java程序来监控数据库详细变化的流水，这个大家可以脑洞大开一下，可以做很多事情的，有兴趣的朋友可以去研究一下；所以binlog对mysql来说也是相当重要的，我们来看一下系统如何确保redo log 和binlog在一致性的，都写入成功的。

还是以update为例：

```plain
start transaction;
update t_user set name = '  喔喔松Java' where user_id = 666;
update t_user set name = 'javacode2018' where user_id = 888;
commit;
```

> 一个事务中可能有很多操作，这些操作会写很多binlog日志，为了加快写的速度，mysql先把整个过程中产生的binlog日志先写到内存中的binlog cache缓存中，后面再将binlog cache中内容一次性持久化到binlog文件中。一个事务的 binlog 是不能被拆开的，因此不论这个事务多大，也要确保一次性写入。这就涉及到了 binlog cache 的保存问题。系统给 binlog cache 分配了一片内存，每个线程一个，参数 binlog\_cache\_size 用于控制单个线程内 binlog cache 所占内存的大小。如果超过了这个参数规定的大小，就要暂存到磁盘。

过程如下：

1.  mysql收到start transaction后，生成一个全局的事务编号trx\_id，比如trx\_id=10
    
2.  user\_id=666这个记录我们就叫r1，user\_id=888这个记录叫r2
    
3.  找到r1记录所在的数据页p1，将其从磁盘中加载到内存中
    
4.  在内存中对p1进行修改
    
5.  将p1修改操作记录到redo log buffer中
    
6.  将p1修改记录流水记录到binlog cache中
    
7.  找到r2记录所在的数据页p2，将其从磁盘中加载到内存中
    
8.  在内存中对p2进行修改
    
9.  将p2修改操作记录到redo log buffer中
    
10.  将p2修改记录流水记录到binlog cache中
    
11.  mysql收到commit指令
    
12.  将redo log buffer携带trx\_id=10写入到redo log文件，持久化到磁盘，**这步操作叫做redo log prepare**，内容如下
     
    > 1.start trx=10;  
    > 2.写入rb1  
    > 3.写入rb2  
    > 4.prepare trx=10;
    > 
    > **注意上面是prepare了，不是之前说的end了。**
    
13.  将binlog cache携带trx\_id=10写入到binlog文件，持久化到磁盘
    
14.  向redo log中写入一条数据：`end trx=10;`表示redo log中这个事务完成了，**这步操作叫做redo log commit**
    
15.  返回给客户端更新成功


我们来分析一下上面过程可能出现的一些情况：

步骤10操作完成后，mysql宕机了

> 宕机之前，所有修改都位于内存中，mysql重启之后，内存修改还未同步到磁盘，对磁盘数据没有影响，所以无影响。

步骤12执行完毕之后，mysql宕机了

> 此时redo log prepare过程是写入redo log文件了，但是binlog写入失败了，此时mysql重启之后会读取redo log进行恢复处理，查询到trx\_id=10的记录是prepare状态，会去binlog中查找trx\_id=10的操作在binlog中是否存在，如果不存在，说明binlog写入失败了，此时可以将此操作回滚

步骤13执行完毕之后，mysql宕机

> 此时redo log prepare过程是写入redo log文件了，但是binlog写入失败了，此时mysql重启之后会读取redo log进行恢复处理，查询到trx\_id=10的记录是prepare状态，会去binlog中查找trx\_id=10的操作在binlog是存在的，然后接着执行上面的步骤14和15.

### 做一个总结

上面的过程设计比较好的地方，有2点

**日志先行，io顺序写，异步操作，做到了高效操作**

> 对数据页，先在内存中修改，然后使用io顺序写的方式持久化到redo log文件；然后异步去处理redo log，将数据页的修改持久化到磁盘中，效率非常高，整个过程，其实就是 MySQL 里经常说到的 WAL 技术，WAL 的全称是 Write-Ahead Logging，它的关键点就是先写日志，再写磁盘。

**两阶段提交确保redo log和binlog一致性**

> 为了确保redo log和binlog一致性，此处使用了二阶段提交技术，redo log 和binlog的写分了3步走：
> 
> 1.  携带trx\_id，redo log prepare到磁盘
>     
> 2.  携带trx\_id，binlog写入磁盘
>     
> 3.  携带trx\_id，redo log commit到磁盘
>     
> 
> 上面3步骤，可以确保同一个trx\_id关联的redo log 和binlog的可靠性。

关于上面2点优秀的设计，我们平时开发的过程中也可以借鉴，下面举2个常见的案例来学习一下。

## 案例：电商中资金账户高频变动解决方案

电商中有账户表和账户流水表，2个表结构如下：

```java
drop table IF EXISTS t_acct;
create table t_acct(
  acct_id int primary key NOT NULL COMMENT '账户id',
  balance decimal(12,2) NOT NULL COMMENT '账户余额',
  version INT NOT NULL DEFAULT 0 COMMENT '版本号，每次更新+1'
)COMMENT '账户表';

drop table IF EXISTS t_acct_data;
create table t_acct_data(
  id int AUTO_INCREMENT PRIMARY KEY COMMENT '编号',
  acct_id int primary key NOT NULL COMMENT '账户id',
  price DECIMAL(12,2) NOT NULL COMMENT '交易额',
  open_balance decimal(12,2) NOT NULL COMMENT '期初余额',
  end_balance decimal(12,2) NOT NULL COMMENT '期末余额'
) COMMENT '账户流水表';

INSERT INTO t_acct(acct_id, balance, version) VALUES (1,10000,0);
```

上面向账户表t\_acct插入了一条数据，余额为10000，当我们下单成功或者充值的时候，会对上面2个表进行操作，会修改t\_acct的数据，顺便向t\_acct\_data表写一条流水，这个t\_acct\_data表有个期初和期末的流水，关系如下：

```java
end_balance = open_balance + price;
open_balance为操作业务时，t_acct表的balance的值。
```

如给账户1充值100，过程如下：

```java
t1：开启事务：start transaction;
t2：R1 = (select * from t_acct where acct_id = 1);
t3：创建几个变量
    v_balance = R1.balance;
t4：update t_acct set balnce = v_balance+100,version = version + 1 where acct_id = 1;
t5：insert into t_acct_data(acct_id,price,open_balnace,end_balance) 
    values (1,100,#v_balance#,#v_balance+100#)
t6：提交事务：commit;
```

分析一下上面过程存在的问题：

我们开启2个线程【thread1、thread2】模拟分别充值100，正常情况下数据应该是这样的：

```java
t_acct表记录：
(1,10200,1);
t_acct_data表产生2条数据：
(1,100,10000,10100);
(2,100,10100,10200);
```

但是当2个线程同时执行到t2的时候获取R1记录信息是一样的，变量v\_balance的值也一样的，最后执行完成之后，数据变成了下面这样：

```java
t_acct表：1，10200
t_acct_data表产生2条数据：
1,100,10000,10100;
2,100,10100,10100;
```

导致`t_acct_data`产生的2条数据是一样的，这种情况是有问题的，这就是并发导致的问题。

上篇文章中有说道乐观锁可以解决这种并发问题，有兴趣的可以去看一下，过程如下：

```java
t1：打开事务start transaction
t2：R1 = (select * from t_acct where acct_id = 1);
t3：创建几个变量
    v_version = R1.version;
    v_balance = R1.balance;
    v_open_balance = v_balance;
    v_balance = R1.balance + 100;
    v_open_balance = v_balance;
t3：对R1进行编辑
t4：执行更新操作
    int count = (update t_acct set balance = #v_balance#,version = version + 1 where acct_id = 1 and version = #v_version#);
t5：if(count==1){
        //向t_acct_data表写入数据
        insert into t_acct_data(acct_id,price,open_balnace,end_balance) values (1,100,#v_open_balance#,#v_open_balance#)
        //提交事务
        commit;
    }else{
        //回滚事务
        rollback;
    }
```

上面的过程中，如果2个线程同时执行到t2看到的R1数据是一样的，但是最后走到t4的时候会被数据库加锁，2个线程的update在mysql中会排队执行，最后只有一个update的结果返回的影响行数是1，然后根据t5，会有一个会被回滚，另外一个被提交，避免了并发导致的问题。

我们分析一下上面过程会有什么问题？

刚才上面也提到了，并发量大的时候，只有部分会成功，比如10个线程同时执行到t2的时候，其中只有1个会成功，其他9个都会失败，**并发量大的情况下失败的概率比较高**，这个大家可以并发测试一下，失败率很高，下面我们继续优化。

分析一下问题主要出现在写t\_acct\_data上面，如果没有这个表的操作，我们直接用一个update就完成了操作，速度是非常快的，上面我们学到的了mysql中先写日志，然后异步刷盘的方式，此处我们也可以采用这种思路，先记录一条交易日志，然后异步根据交易日志将交易流水写到`t_acct_data`表中。

那我们继续优化，新增一个账户操作日志表：

```java
drop table IF EXISTS t_acct_log;
create table t_acct_log(
  id INT AUTO_INCREMENT PRIMARY KEY COMMENT '编号',
  acct_id int primary key NOT NULL COMMENT '账户id',
  price DECIMAL(12,2) NOT NULL COMMENT '交易额',
  status SMALLINT NOT NULL DEFAULT 0 COMMENT '状态,0:待处理，1：处理成功'
) COMMENT '账户操作日志表';
```

顺便对t\_acct标做一下改造，新增一个字段`old_balance`，新结构如下：

```java
drop table IF EXISTS t_acct;
create table t_acct(
  acct_id int primary key NOT NULL COMMENT '账户id',
  balance decimal(12,2) NOT NULL COMMENT '账户余额',
  old_balance decimal(12,2) NOT NULL COMMENT '账户余额(老的值)',
  version INT NOT NULL DEFAULT 0 COMMENT '版本号，每次更新+1'
)COMMENT '账户表';

INSERT INTO t_acct(acct_id, balance,old_balance,version) VALUES (1,10000,10000,0);
```

> 新增了一个old\_balance字段，这个字段的值刚开始的时候和balance的值是一致的，后面会在job中进行改变，可以先向下看，后面有解释

假设账户v\_acct\_id交易金额为v\_price，过程如下：

```java
t1.开启事务：start transaction;
t2.insert into t_acct_log(acct_id,price,status) values (#v_acct_id#,#v_price#,0)
t3.int count = (update t_acct set balnce = v_balance+#v_price#,version = version+1 where acct_id = #v_acct_id# and v_balance+#v_price#>=0);
t6.if(count==1){
        //提交事务
        commit;
    }else{
        //回滚事务
        rollback;
    }
```

> 可以看到上面没有记录流水了，变成插入了一条日志`t_acct_log`，后面我们异步根据`t_acct_log`的数据来生成`t_acct_data`记录。
> 
> 上面这个操作支撑并发操作还是比较高的，测试了一下每秒500笔，并且都成功了，效率非常高。

新增一个job，查询t\_acct\_log中状态为0的记录，然后遍历进行一个个处理，处理过程如下：

```java
假设t_acct_log中当前需要处理的记录为L1
t1：打开事务start transaction
t2：创建变量
    v_price = L1.price;
    v_acct_id = L1.acct_id;
t3：R1 = (select * from t_acct where acct_id = #v_acct_id#);
t4：创建几个变量
    v_old_balance = R1.old_balance;
    v_open_balance = v_old_balance;
    v_old_balance = R1.old_balance + v_price;
    v_open_balance = v_old_balance;
t5：int count = (update t_acct set old_balance = #v_old_balance#,version = version + 1 where acct_id = #v_acct_id# and version = #v_version#);
t6：if(count==1){
        //更新t_acct_log的status置为1
        count = (update t_acct_log set status=1 where status=0 and id = #L1.id#);
    }

    if(count==1){
        //提交事务
        commit;
    }else{
        //回滚事务
        rollback;
    }
```

> 上面t5中update条件中加了`version`，t6中的update条件中加了`status=0`的操作，主要是为了防止并发操作修改可能会出错的问题。
> 
> 上面t\_acct\_log中所有status=0的记录被处理完毕之后，t\_acct表中的balance和old\_balance会变为一致。

上面这种方式采用了先写账户操作日志，然后异步对日志进行操作，在生成流水，借鉴了mysql中的设计，大家也可以学习学习。

## 案例2：跨库转账问题

> 此处我们使用mysql上面介绍的二阶段提交来解决。

如从A库的T1表转100到B库的T1表。

我们创建一个C库，在C库新增一个转账订单表，如：

```java
drop table IF EXISTS t_transfer_order;
create table t_transfer_order(
  id int NOT NULL AUTO_INCREMENT primary key COMMENT '账户id',
  from_acct_id int NOT NULL COMMENT '转出方账户',
  to_acct_id int NOT NULL COMMENT '转入方账户',
  price decimal(12,2) NOT NULL COMMENT '转账金额',
  addtime int COMMENT '入库时间（秒）',
  status SMALLINT NOT NULL DEFAULT 0 COMMENT '状态，0：待处理，1：转账成功，2：转账失败',
  version INT NOT NULL DEFAULT 0 COMMENT '版本号，每次更新+1'
) COMMENT '转账订单表';
```

A、B库加3张表，如：

```java
drop table IF EXISTS t_acct;
create table t_acct(
  acct_id int primary key NOT NULL COMMENT '账户id',
  balance decimal(12,2) NOT NULL COMMENT '账户余额',
  version INT NOT NULL DEFAULT 0 COMMENT '版本号，每次更新+1'
)COMMENT '账户表';

drop table IF EXISTS t_order;
create table t_order(
  transfer_order_id int primary key NOT NULL COMMENT '转账订单id',
  price decimal(12,2) NOT NULL COMMENT '转账金额',
  status SMALLINT NOT NULL DEFAULT 0 COMMENT '状态，1：转账成功，2：转账失败',
  version INT NOT NULL DEFAULT 0 COMMENT '版本号，每次更新+1'
) COMMENT '转账订单表';

drop table IF EXISTS t_transfer_step_log;
create table t_transfer_step_log(
  id int primary key NOT NULL COMMENT '账户id',
  transfer_order_id int NOT NULL COMMENT '转账订单id',
  step SMALLINT NOT NULL COMMENT '转账步骤，0：正向操作，1：回滚操作',
  UNIQUE KEY (transfer_order_id,step)
) COMMENT '转账步骤日志表';
```

> `t_transfer_step_log`表用于记录转账日志操作步骤的，`transfer_order_id,step`上加了唯一约束，表示每个步骤只能执行一次，可以确保步骤的幂等性。

定义几个变量：

> v\_from\_acct\_id:转出方账户
> 
> v\_to\_acct\_id:转入方账户
> 
> v\_price:交易金额

整个转账流程如下：

> 每个步骤都有返回值，返回值是数组类型的，含义是：0：处理中（结果未知），1：成功，2：失败

```java
step1:创建转账订单,订单状态为0，表示处理中
C1：start transaction;
C2：insert into t_transfer_order(from_acct_id,to_acct_id,price,addtime,status,version) 
    values(#v_from_acct_id#,#v_to_acct_id#,#v_price#,0,unix_timestamp(now()));
C3：获取刚才insert成功的订单id，放在变量v_transfer_order_id中
C4：commit;

step2:A库操作如下
A1：AR1 = (select * from t_order where transfer_order_id = #v_transfer_order_id#);
A2：if(AR1!=null){
        return AR1.status==1?1:2;
    }
A3：start transaction;
A4：AR2 = (select 1 from t_acct where acct_id = #v_from_acct_id#);
A5：if(AR2.balance<v_price){
        //表示余额不足，那转账肯定是失败了，插入一个转账失败订单
        insert into t_order (transfer_order_id,price,status) values (#transfer_order_id#,#v_price#,2);
        commit;
        //返回失败的状态2
        return 2;
    }else{
        //通过乐观锁 & balance - #v_price# >= 0更新账户资金，防止并发操作
        int count = (update t_acct set balance = balance - #v_price#, version = version + 1 where acct_id = #v_from_acct_id# and balance - #v_price# >= 0 and version = #AR2.version#);
        //count为1表示上面的更新成功
        if(count==1){
            //插入转账成功订单，状态为1
            insert into t_order (transfer_order_id,price,status) values (#transfer_order_id#,#v_price#,1);
            //插入步骤日志
            insert into t_transfer_step_log (transfer_order_id,step) values (#v_transfer_order_id#,1);
            commit;
            return 1;
        }else{
            //插入转账失败订单，状态为2
            insert into t_order (transfer_order_id,price,status) values (#transfer_order_id#,#v_price#,2);
            commit;
            return 2;
        }
    }

step3:
    if(step2的结果==1){
        //表示A库中扣款成功了
        执行step4;
    }else if(step2的结果==2){
        //表示A库中扣款失败了
        执行step6;
    }

step4:对B库进行操作，如下：
B1：BR1 = (select * from t_order where transfer_order_id = #v_transfer_order_id#);
B2：if(BR1!=null){
    return BR1.status==1?1:2;
}else{
     执行B3;
}
B3：start transaction;
B4：BR2 = (select 1 from t_acct where acct_id = #v_to_acct_id#);
B5：int count = (update t_acct set balance = balance + #v_price#, version = version + 1 where acct_id = #v_to_acct_id# and version = #BR2.version#);
if(count==1){
    //插入订单，状态为1
    insert into t_order (transfer_order_id,price,status) values (#transfer_order_id#,#v_price#,1);
    //插入日志
    insert into t_transfer_step_log (transfer_order_id,step) values (#v_transfer_order_id#,1);
    commit;
    return 1;
}else{
    //进入到此处说明有并发，返回0
    rollback;
    return 0;
}

step5:
    if(step4的结果==1){
        //表示B库中加钱成功了
        执行step7;
    }

step6:对C库操作（转账失败，将订单置为失败）
C1：AR1 = (select 1 from t_transfer_order where id = #v_transfer_order_id#);
C2：if(AR1.status==1 || AR1.status=2){
        return AR1.status=1?"转账成功":"转账失败";
    }
C3：start transaction;
C4：int count = (udpate t_transfer_order set status = 2,version = version+1 where id = #v_transfer_order_id# and version = version + #AR1.version#)
C5：if(count==1){
        commit;
        return "转账失败";
    }else{
        rollback;
        return "处理中";
    }

step7:对C库操作（转账成功，将订单置为成功）
C1：AR1 = (select 1 from t_transfer_order where id = #v_transfer_order_id#);
C2：if(AR1.status==1 || AR1.status=2){
        return AR1.status=1?"转账成功":"转账失败";
    }
C3：start transaction;
C4：int count = (udpate t_transfer_order set status = 1,version = version+1 where id = #v_transfer_order_id# and version = version + #AR1.version#)
C5：if(count==1){
        commit;
        return "转账成功";
    }else{
        rollback;
        return "处理中";
    }
```

还需要新增一个补偿的job，处理C库中状态为0的超过10分钟的转账订单订单，过程如下：

```java
while(true){
    List list = select * from t_transfer_order where status = 0 and addtime+10*60<unix_timestamp(now());
    if(list为空){
        //插叙无记录，退出循环
        break;
    }
    //循环遍历list进行处理
    for(Object r:list){
        //调用上面的steap2进行处理，最终订单状态会变为1或者2
    }
}
```

说一下：这个job的处理有不好的地方，可能会死循环，这个留给大家去思考一下，如何解决？欢迎留言



[下一篇：MySQL系列测试库脚本](http://www.itsoku.com/course/3/196)

[上一篇：聊聊如何使用MySQL实现分布式锁](http://www.itsoku.com/course/3/60)
