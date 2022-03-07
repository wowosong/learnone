# 高可用集群水平扩展

Redis3.0以后的版本虽然有了集群功能，提供了比之前版本的哨兵模式更高的性能与可用性，但是集群的水平扩展却比较麻烦，今天就来带大家看看redis高可用集群如何做水平扩展，原始集群(见下图)由6个节点组成，6个节点分布在三台机器上，采用三主三从的模式

![https://note.youdao.com/yws/public/resource/174eaa7104ce961f8012d521d8155bd9/xmlnote/221AD066597C4ABA9F78442499F9673B/55284](https://gitee.com/wowosong/pic-md/raw/master/20220306163407.bin)

## 1、启动集群

\# 启动整个集群

```shell
/usr/local/redis-5.0.3/src/redis-server /usr/local/redis-cluster/8001/redis.conf
/usr/local/redis-5.0.3/src/redis-server /usr/local/redis-cluster/8002/redis.conf
/usr/local/redis-5.0.3/src/redis-server /usr/local/redis-cluster/8003/redis.conf
/usr/local/redis-5.0.3/src/redis-server /usr/local/redis-cluster/8004/redis.conf
/usr/local/redis-5.0.3/src/redis-server /usr/local/redis-cluster/8005/redis.conf
/usr/local/redis-5.0.3/src/redis-server /usr/local/redis-cluster/8006/redis.conf
```

\# 客户端连接8001端口的redis实例

```shell
/usr/local/redis-5.0.3/src/redis-cli -a zhuge -c -h 192.168.0.61 -p 8001
```

\# 查看集群状态

```shell
192.168.0.61:8001> cluster  nodes
```

![https://note.youdao.com/yws/public/resource/174eaa7104ce961f8012d521d8155bd9/xmlnote/FEA96A65F9F84A3A9D47F2C5B27C36F0/55272](https://gitee.com/wowosong/pic-md/raw/master/20220306163412.bin)

 从上图可以看出，整个集群运行正常，三个master节点和三个slave节点，8001端口的实例节点存储0-5460这些hash槽，8002端口的实例节点存储5461-10922这些hash槽，8003端口的实例节点存储10923-16383这些hash槽，这三个master节点存储的所有hash槽组成redis集群的存储槽位，slave点是每个主节点的备份从节点，不显示存储槽位

## 2、集群操作

我们在原始集群基础上再增加一主(8007)一从(8008)，增加节点后的集群参见下图，新增节点用虚线框表示

![https://note.youdao.com/yws/public/resource/174eaa7104ce961f8012d521d8155bd9/xmlnote/A8BDF25026C54D6288C9D17AD29540F8/55313](https://gitee.com/wowosong/pic-md/raw/master/20220306163416.bin)

### 增加redis实例

\# 在/usr/local/redis-cluster下创建8007和8008文件夹，并拷贝8001文件夹下的redis.conf文件到8007和8008这两个文件夹下

```shell

mkdir 8007 8008

cd 8001

cp redis.conf /usr/local/redis-cluster/8007/

cp redis.conf /usr/local/redis-cluster/8008/

修改8007文件夹下的redis.conf配置文件

vim /usr/local/redis-cluster/8007/redis.conf

修改如下内容：

port:8007

dir /usr/local/redis-cluster/8007/

cluster-config-file nodes-8007.conf

修改8008文件夹下的redis.conf配置文件

vim /usr/local/redis-cluster/8008/redis.conf

修改内容如下：

port:8008

dir /usr/local/redis-cluster/8008/

cluster-config-file nodes-8008.conf

启动8007和8008俩个服务并查看服务状态

/usr/local/redis-5.0.3/src/redis-server /usr/local/redis-cluster/8007/redis.conf

/usr/local/redis-5.0.3/src/redis-server /usr/local/redis-cluster/8008/redis.conf

ps -el | grep redis

```

*   查看redis集群的命令帮助

```shell
cd /usr/local/redis-5.0.3
src/redis-cli --cluster help
```

![https://note.youdao.com/yws/public/resource/174eaa7104ce961f8012d521d8155bd9/xmlnote/2423DA80B6644F34AE45B26CAE6C4592/70145](https://gitee.com/wowosong/pic-md/raw/master/20220306163421.bin)

1.create：创建一个集群环境host1:port1 ... hostN:portN

2.call：可以执行redis命令

3.add-node：将一个节点添加到集群里，第一个参数为新节点的ip:port，第二个参数为集群中任意一个已经存在的节点的ip:port

4.del-node：移除一个节点

5.reshard：重新分片

6.check：检查集群状态

*   配置8007为集群主节点

\# 使用add-node命令新增一个主节点8007(master)，前面的ip:port为新增节点，后面的ip:port为已知存在节点，看到日志最后有"\[OK\] New node added correctly"提示代表新节点加入成功

```shell
/usr/local/redis-5.0.3/src/redis-cli -a zhuge --cluster add-node 192.168.0.61:8007 192.168.0.61:8001
```

\# 查看集群状态

```shell
/usr/local/redis-5.0.3/src/redis-cli -a zhuge -c -h 192.168.0.61 -p 8001

192.168.0.61:8001> cluster nodes
```

![https://note.youdao.com/yws/public/resource/174eaa7104ce961f8012d521d8155bd9/xmlnote/7A46E1A0B3844AC69AB3FF44576A5E54/81628](https://gitee.com/wowosong/pic-md/raw/master/20220306163427.bin)

注意：当添加节点成功以后，新增的节点不会有任何数据，因为它还没有分配任何的slot(hash槽)，我们需要为新节点手工分配hash槽

\# 使用redis-cli命令为8007分配hash槽，找到集群中的任意一个主节点，对其进行重新分片工作。

```shell
/usr/local/redis-5.0.3/src/redis-cli -a zhuge --cluster reshard 192.168.0.61:8001
```

输出如下：

... ...

How many slots do you want to move (from 1 to 16384)? 600

(ps:需要多少个槽移动到新的节点上，自己设置，比如600个hash槽)

What is the receiving node ID? 2728a594a0498e98e4b83a537e19f9a0a3790f38

(ps:把这600个hash槽移动到哪个节点上去，需要指定节点id)

Please enter all the source node IDs.

  Type 'all' to use all the nodes as source nodes for the hash slots.

  Type 'done' once you entered all the source nodes IDs.

Source node 1:all

(ps:输入all为从所有主节点(8001,8002,8003)中分别抽取相应的槽数指定到新节点中，抽取的总槽数为600个)

 ... ...

Do you want to proceed with the proposed reshard plan (yes/no)? yes

(ps:输入yes确认开始执行分片任务)

... ...

\# 查看下最新的集群状态

```shell
/usr/local/redis-5.0.3/src/redis-cli -a zhuge -c -h 192.168.0.61 -p 8001

192.168.0.61:8001> cluster nodes
```

![https://note.youdao.com/yws/public/resource/174eaa7104ce961f8012d521d8155bd9/xmlnote/0A16C9A2FADF4EC7978BA3086737829D/55436](https://gitee.com/wowosong/pic-md/raw/master/20220306163431.bin)

如上图所示，现在我们的8007已经有hash槽了，也就是说可以在8007上进行读写数据啦！到此为止我们的8007已经加入到集群中，并且是主节点(Master)

*   配置8008为8007的从节点

\# 添加从节点8008到集群中去并查看集群状态

```shell
/usr/local/redis-5.0.3/src/redis-cli -a zhuge --cluster add-node 192.168.0.61:8008 192.168.0.61:8001
```

![https://note.youdao.com/yws/public/resource/174eaa7104ce961f8012d521d8155bd9/xmlnote/1ADA96E883D44948B38733E36308FF5B/55446](https://gitee.com/wowosong/pic-md/raw/master/20220306163435.bin)

如图所示，还是一个master节点，没有被分配任何的hash槽。

\# 我们需要执行replicate命令来指定当前节点(从节点)的主节点id为哪个,首先需要连接新加的8008节点的客户端，然后使用集群命令进行操作，把当前的8008(slave)节点指定到一个主节点下(这里使用之前创建的8007主节点)

```shell
/usr/local/redis-5.0.3/src/redis-cli -a zhuge -c -h 192.168.0.61 -p 8008

192.168.0.61:8008> cluster replicate 2728a594a0498e98e4b83a537e19f9a0a3790f38  #后面这串id为8007的节点id
```

\# 查看集群状态，8008节点已成功添加为8007节点的从节点

![https://note.youdao.com/yws/public/resource/174eaa7104ce961f8012d521d8155bd9/xmlnote/D9F88580B9B44045A7E920C2B42E62C9/81647](https://gitee.com/wowosong/pic-md/raw/master/20220306163439.bin)

*    删除8008从节点

\# 用del-node删除从节点8008，指定删除节点ip和端口，以及节点id(红色为8008节点id)

```shell
/usr/local/redis-5.0.3/src/redis-cli -a zhuge --cluster del-node 192.168.0.61:8008 a1cfe35722d151cf70585cee21275565393c0956
```

\# 再次查看集群状态，如下图所示，8008这个slave节点已经移除，并且该节点的redis服务也已被停止

![https://note.youdao.com/yws/public/resource/174eaa7104ce961f8012d521d8155bd9/xmlnote/DDDF2566F749493FB06652155AFA516F/81657](https://gitee.com/wowosong/pic-md/raw/master/20220306163443.bin)

*   删除8007主节点

最后，我们尝试删除之前加入的主节点8007，这个步骤相对比较麻烦一些，因为主节点的里面是有分配了hash槽的，所以我们这里必须先把8007里的hash槽放入到其他的可用主节点中去，然后再进行移除节点操作，不然会出现数据丢失问题(目前只能把master的数据迁移到一个节点上，暂时做不了平均分配功能)，执行命令如下：

```shell
/usr/local/redis-5.0.3/src/redis-cli -a zhuge --cluster reshard 192.168.0.61:8007
```

输出如下：

 ... ...

How many slots do you want to move (from 1 to 16384)? 600

What is the receiving node ID? dfca1388f124dec92f394a7cc85cf98cfa02f86f

(ps:这里是需要把数据移动到哪？8001的主节点id)

Please enter all the source node IDs.

  Type 'all' to use all the nodes as source nodes for the hash slots.

  Type 'done' once you entered all the source nodes IDs.

Source node 1:2728a594a0498e98e4b83a537e19f9a0a3790f38

(ps:这里是需要数据源，也就是我们的8007节点id)

Source node 2:done

(ps:这里直接输入done 开始生成迁移计划)

 ... ...

Do you want to proceed with the proposed reshard plan (yes/no)? Yes

(ps:这里输入yes开始迁移)

至此，我们已经成功的把8007主节点的数据迁移到8001上去了，我们可以看一下现在的集群状态如下图，你会发现8007下面已经没有任何hash槽了，证明迁移成功！

![https://note.youdao.com/yws/public/resource/174eaa7104ce961f8012d521d8155bd9/xmlnote/C287B21534E1435CACBA9B44C7001F2B/81668](https://gitee.com/wowosong/pic-md/raw/master/20220306163447.bin)

\# 最后我们直接使用del-node命令删除8007主节点即可

```shell
/usr/local/redis-5.0.3/src/redis-cli -a zhuge --cluster del-node 192.168.0.61:8007 2728a594a0498e98e4b83a537e19f9a0a3790f38
```

**查看集群状态，一切还原为最初始状态啦！大功告成!**

![https://note.youdao.com/yws/public/resource/174eaa7104ce961f8012d521d8155bd9/xmlnote/BB195C96D620421EAA1FBEA9104ED8A8/81676](https://gitee.com/wowosong/pic-md/raw/master/20220306163453.bin)

```plain
文档：03-VIP-Redis高可用集群之水平扩展
```

```plain
链接：http://note.youdao.com/noteshare?id=174eaa7104ce961f8012d521d8155bd9&sub=5CB163DE61434F4E92C5B62C22EC095E
```
