使用容器总是感觉像使用魔法一样。对于那些理解底层原理的人来说容器很好用，但是对于不理解的人来说就是个噩梦。很幸运的是，我们已经研究容器技术很久了，甚至成功揭秘容器只是隔离并受限的Linux进程，运行容器并不需要镜像，以及另一个方面，构建镜像需要运行一些容器。 

![img](https://gitee.com/wowosong/pic-md/raw/master/20210910091025.webp)


现在是时候解决容器网络问题了。或者更准确地说，单主机容器网络问题。本文会回答这些问题：

- 如何虚拟化网络资源，让容器认为自己拥有独占网络？
- 如何让容器们和平共处，之间不会互相干扰，并且能够互相通信？
- 从容器内部如何访问外部世界（比如，互联网）？
- 从外部世界如何访问某台机器上的容器呢（比如，端口发布）？

最终结果很明显，单主机容器网络是已知的Linux功能的简单组合：

- 网络命名空间（namespace）
- 虚拟Ethernet设备（veth）
- 虚拟网络交换机（网桥）
- IP路由和网络地址翻译（NAT）

并且不需要任何代码就可以让这样的网络魔法发生……

## 前提条件

任意Linux发行版都可以。本文的所有例子都是在vagrant CentOS 8的虚拟机上执行的：

```
$ vagrant init centos/8 
$ vagrant up 
$ vagrant ssh 

[vagrant@localhost ~]$ uname -a 
Linux localhost.localdomain 4.18.0-147.3.1.el8_1.x86_64
```

为了简单起见，本文使用容器化解决方案（比如，Docker或者Podman）。我们会重点介绍基本概念，并使用最简单的工具来达到学习目标。

## network命名空间隔离容器

Linux网络栈包括哪些部分？显然，是一系列网络设备。还有别的吗？可能还包括一系列的路由规则。并且不要忘记，netfilter hook，包括由iptables规则定义的。

我们可以快速创建一个并不复杂的脚本inspect-net-stack.sh：

```
#!/usr/bin/env bash 
echo  "> Network devices" 
ip link 

echo -e "\n> Route table" 
ip route 

echo -e "\n> Iptables rules" 
iptables --list-rules
```

在运行脚本前，让我们修改下iptable rule：

```
$ sudo iptables -N ROOT_NS
```

这之后，在机器上执行上面的脚本，输出如下：

```
$ sudo ./inspect-net-stack.sh 
    > Network devices 
    1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN mode DEFAULT group default qlen 1000 link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00 
    2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc fq_codel state UP mode DEFAULT group default qlen 1000 link/ether 52:54:00:e3:27:77 brd ff:ff:ff:ff:ff:ff 
    > Route table 
    default via 10.0.2.2 dev eth0 proto dhcp metric 100 
    10.0.2.0/24 dev eth0 proto kernel scope link src 10.0.2.15 metric 100 
    > Iptables rules 
    -P INPUT ACCEPT 
    -P FORWARD ACCEPT 
    -P OUTPUT ACCEPT 
    -N ROOT_NS
```

我们对这些输出感兴趣，因为要确保即将创建的每个容器都有各自独立的网络栈。

你可能已经知道了，用于容器隔离的一个Linux命名空间是网络命名空间（network namespace）。从man ip-netns可以看到，“网络命名空间是网络栈逻辑上的另一个副本，它有自己的路由，防火墙规则和网络设备。”为了简化起见，这是本文使用的唯一的命名空间。我们并没有创建完全隔离的容器，而是将范围限制在网络栈上。

创建网络命名空间的一种方法是ip工具——是iproute2的一部分：

```
$ sudo ip netns add netns0 
$ ip netns 
netns0
```

如何使用刚才创建的命名空间呢？一个很好用的命令nsenter。进入一个或多个特定的命名空间，然后执行指定的脚本：

```
$ sudo nsenter --net=/var/run/netns/netns0 bash
     # 新建的bash进程在netns0里
 $ sudo ./inspect-net-stack.sh 
    > Network devices 1: lo: <LOOPBACK> mtu 65536 qdisc noop state DOWN mode DEFAULT group default qlen 1000 
    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00 
    > Route table 
    > Iptables rules 
    -P INPUT ACCEPT 
    -P FORWARD ACCEPT 
    -P OUTPUT ACCEPT
```

从上面的输出可以清楚地看到bash进程运行在netns0命名空间，这时看到的是完全不同的网络栈。这里没有路由规则，没有自定义的iptables chain，只有一个loopback的网络设备。

![img](https://gitee.com/wowosong/pic-md/raw/master/20210910091034.webp)

## 使用虚拟的Ethernet设备（veth）将容器连接到主机上

如果我们无法和某个专有的网络栈通信，那么它看上去就没什么用。幸运的是，Linux提供了好用的工具——虚拟Ethernet设备。从man veth可以看到，“veth设备是虚拟Ethernet设备。他们可以作为网络命名空间之间的通道（tunnel），从而创建连接到另一个命名空间里的物理网络设备的桥梁，但是也可以作为独立的网络设备使用。”

虚拟Ethernet设备通常都成对出现。不用担心，先看一下创建的脚本：

```
$ sudo ip link add veth0 type veth peer name ceth0
```

用这条简单的命令，我们就可以创建一对互联的虚拟Ethernet设备。默认选择了veth0和ceth0这两个名称。

```
$ ip link 
1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN mode DEFAULT group default qlen 1000 
 link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00 
2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc fq_codel state UP mode DEFAULT group default qlen 1000
  link/ether 52:54:00:e3:27:77 brd ff:ff:ff:ff:ff:ff 
5: ceth0@veth0: <BROADCAST,MULTICAST,M-DOWN> mtu 1500 qdisc noop state DOWN mode DEFAULT group default qlen 1000 
  link/ether 66:2d:24:e3:49:3f brd ff:ff:ff:ff:ff:ff 
6: veth0@ceth0: <BROADCAST,MULTICAST,M-DOWN> mtu 1500 qdisc noop state DOWN mode DEFAULT group default qlen 1000 
 link/ether 96:e8:de:1d:22:e0 brd ff:ff:ff:ff:ff:ff
```

创建的veth0和ceth0都在主机的网络栈（也称为root网络命名空间）上。将netns0命名空间连接到root命名空间，需要将一个设备留在root命名空间，另一个挪到netns0里：

```
$ sudo ip link set ceth0 netns netns0 
    # 列出所有设备，可以看到ceth0已经从root栈里消失了 
   $ ip link 1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN mode DEFAULT group default qlen 1000 
    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00 
   2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc fq_codel state UP mode DEFAULT group default qlen 1000 
   link/ether 52:54:00:e3:27:77 brd ff:ff:ff:ff:ff:ff 
   6: veth0@if5: <BROADCAST,MULTICAST> mtu 1500 qdisc noop state DOWN mode DEFAULT group default qlen 1000 
    link/ether 96:e8:de:1d:22:e0 brd ff:ff:ff:ff:ff:ff link-netns netns0
```

一旦启用设备并且分配了合适的IP地址，其中一个设备上产生的包会立刻出现在其配对设备里，从而连接起两个命名空间。从root命名空间开始：

```
$ sudo ip link set veth0 up 
$ sudo ip addr add 172.18.0.11/16 dev veth0
```

然后是netns0：

```
$ sudo nsenter --net=/var/run/netns/netns0 
$ ip link set lo up 
$ ip link set ceth0 up 
$ ip addr add 172.18.0.10/16 dev ceth0 
$ ip link 
1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN mode DEFAULT group default qlen 1000 
 link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00 
5: ceth0@if6: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc noqueue state UP mode DEFAULT group default qlen 1000 
 link/ether 66:2d:24:e3:49:3f brd ff:ff:ff:ff:ff:ff link-netnsid 0
```

![image-20210611230823894](https://gitee.com/wowosong/pic-md/raw/master/20210611230824.png)



检查连通性：

```
# 在netns0里ping root的 veth0 
 $ ping -c 2 172.18.0.11 
 PING 172.18.0.11 (172.18.0.11) 56(84) bytes of data. 
 64 bytes from 172.18.0.11: icmp_seq=1 ttl=64 time=0.038 ms 
 64 bytes from 172.18.0.11: icmp_seq=2 ttl=64 time=0.040 ms 
 --- 172.18.0.11 ping statistics --- 
 2 packets transmitted, 2 received, 0% packet loss, time 58ms 
 rtt min/avg/max/mdev = 0.038/0.039/0.040/0.001 ms 
     # 离开 netns0
   $ exit  
      # 在root命名空间里ping ceth0 
      $ ping -c 2 172.18.0.10 
      PING 172.18.0.10 (172.18.0.10) 56(84) bytes of data. 
      64 bytes from 172.18.0.10: icmp_seq=1 ttl=64 time=0.073 ms 
      64 bytes from 172.18.0.10: icmp_seq=2 ttl=64 time=0.046 ms 
      --- 172.18.0.10 ping statistics --- 
      2 packets transmitted, 2 received, 0% packet loss, time 3ms 
      rtt min/avg/max/mdev = 0.046/0.059/0.073/0.015 ms
```

同时，如果尝试从netns0命名空间访问其他地址，也同样可以成功：

```
# 在 root 命名空间 
   $ ip addr show dev eth0 
   2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc fq_codel state UP group default qlen 1000 
    link/ether 52:54:00:e3:27:77 brd ff:ff:ff:ff:ff:ff 
    inet 10.0.2.15/24 brd 10.0.2.255 scope global dynamic noprefixroute eth0 
  valid_lft 84057sec preferred_lft 84057sec
    inet6 fe80::5054:ff:fee3:2777/64 scope link 
     valid_lft forever preferred_lft forever 
    # 记住这里IP是10.0.2.15 
    $ sudo nsenter --net=/var/run/netns/netns0 
    # 尝试ping主机的eth0 
    $ ping 10.0.2.15 
    connect: Network is unreachable 
    # 尝试连接外网
    $ ping 8.8.8.8 
    connect: Network is unreachable
```

这也很好理解。在netns0路由表里没有这类包的路由。唯一的entry是如何到达172.18.0.0/16网络：

```
# 在netns0命名空间: 
    $ ip route 
    172.18.0.0/16 dev ceth0 proto kernel scope link src 172.18.0.10
```

Linux有好几种方式建立路由表。其中一种是直接从网络接口上提取路由。记住，命名空间创建后， netns0里的路由表是空的。但是随后我们添加了ceth0设备并且分配了IP地址172.18.0.0/16。因为我们使用的不是简单的IP地址，而是地址和子网掩码的组合，网络栈可以从其中提取出路由信息。目的地是172.18.0.0/16的每个网络包都会通过ceth0设备。但是其他包会被丢弃。类似的，root命名空间也有了个新的路由：

```
# 在root命名空间: 
    $ ip route 
    # ... 忽略无关行 ... 
    172.18.0.0/16 dev veth0 proto kernel scope link src 172.18.0.11
```

这里，就可以回答第一个问题了。我们了解了如何隔离，虚拟化并且连接Linux网络栈。



## 使用虚拟网络switch（网桥）连接容器

容器化思想的驱动力是高效的资源共享。所以，一台机器上只运行一个容器并不常见。相反，最终目标是尽可能地在共享的环境上运行更多的隔离进程。因此，如果按照上述veth方案，在同一台主机上放置多个容器的话会发生什么呢？让我们尝试添加第二个容器。

```
# 从 root 命名空间 
    $ sudo ip netns add netns1 
    $ sudo ip link add veth1 type veth peer name ceth1 
    $ sudo ip link set ceth1 netns netns1 
    $ sudo ip link set veth1 up 
    $ sudo ip addr add 172.18.0.21/16 dev veth1 
    $ sudo nsenter --net=/var/run/netns/netns1 
    $ ip link set lo up 
    $ ip link set ceth1 up 
    $ ip addr add 172.18.0.20/16 dev ceth1
```

检查连通性：

```
# 从netns1无法连通root 命名空间! 
    $ ping -c 2 172.18.0.21 
    PING 172.18.0.21 (172.18.0.21) 56(84) bytes of data. 
    From 172.18.0.20 icmp_seq=1 Destination Host Unreachable 
    From 172.18.0.20 icmp_seq=2 Destination Host Unreachable 
    --- 172.18.0.21 ping statistics --- 
    2 packets transmitted, 0 received, +2 errors, 100% packet loss, time 55ms pipe 2 
    # 但是路由是存在的! 
    $ ip route 
    172.18.0.0/16 dev ceth1 proto kernel scope link src 172.18.0.20 
    # 离开 `netns1` 
    $ exit  
    # 从 root 命名空间无法连通`netns1` 
    $ ping -c 2 172.18.0.20 
    PING 172.18.0.20 (172.18.0.20) 56(84) bytes of data. 
    From 172.18.0.11 icmp_seq=1 Destination Host Unreachable 
    From 172.18.0.11 icmp_seq=2 Destination Host Unreachable 

--- 172.18.0.20 ping statistics --- 
2 packets transmitted, 0 received, +2 errors, 100% packet loss, time 23ms pipe 2 
    # 从netns0可以连通`veth1` 
    $ sudo nsenter --net=/var/run/netns/netns0 
    $ ping -c 2 172.18.0.21 
    PING 172.18.0.21 (172.18.0.21) 56(84) bytes of data. 
    64 bytes from 172.18.0.21: icmp_seq=1 ttl=64 time=0.037 ms 
    64 bytes from 172.18.0.21: icmp_seq=2 ttl=64 time=0.046 ms 
    --- 172.18.0.21 ping statistics --- 
    2 packets transmitted, 2 received, 0% packet loss, time 33ms 
    rtt min/avg/max/mdev = 0.037/0.041/0.046/0.007 ms 
    # 但是仍然无法连通netns1 
    $ ping -c 2 172.18.0.20 
    PING 172.18.0.20 (172.18.0.20) 56(84) bytes of data. 
    From 172.18.0.10 icmp_seq=1 Destination Host Unreachable 
    From 172.18.0.10 icmp_seq=2 Destination Host Unreachable 
    --- 172.18.0.20 ping statistics --- 
    2 packets transmitted, 0 received, +2 errors, 100% packet loss, time 63ms pipe 2
```

晕！有地方出错了……netns1有问题。它无法连接到root，并且从root命名空间里也无法访问到它。但是，因为两个容器都在相同的IP网段172.18.0.0/16里，从netns0容器可以访问到主机的veth1。



这里花了些时间来找到原因，不过很明显遇到的是路由问题。先查一下root命名空间的路由表：

```
$ ip route 
    # ... 忽略无关行... # 
    172.18.0.0/16 dev veth0 proto kernel scope link src 172.18.0.11 
    172.18.0.0/16 dev veth1 proto kernel scope link src 172.18.0.21
```

在添加了第二个veth对之后，root的网络栈知道了新路由172.18.0.0/16 dev veth1 proto kernel scope link src 172.18.0.21，但是之前已经存在该网络的路由了。当第二个容器尝试ping veth1时，选中的是第一个路由规则，这导致网络无法连通。如果我们删除第一个路由sudo ip route delete 172.18.0.0/16 dev veth0 proto kernel scope link src 172.18.0.11，然后重新检查连通性，应该就没有问题了。netns1可以连通，但是netns0就不行了。

![image-20210611230903386](https://gitee.com/wowosong/pic-md/raw/master/20210611230903.png)



如果我们为netns1选择其他的网段，应该就都可以连通。但是，多个容器在同一个IP网段上应该是合理的使用场景。因此，我们需要调整veth方案。



别忘了还有Linux网桥——另一种虚拟化网络技术！Linux网桥作用类似于网络switch。它会在连接到其上的接口间转发网络包。并且因为它是switch，它是在L2层完成这些转发的。



试试这个工具。但是首先，需要清除已有设置，因为之前的一些配置现在不再需要了。删除网络命名空间：

```
$ sudo ip netns delete netns0 
$ sudo ip netns delete netns1 
$ sudo ip link delete veth0 
$ sudo ip link delete ceth0 
$ sudo ip link delete veth1 
$ sudo ip link delete ceth1
```

快速重建两个容器。注意，我们没有给新的veth0和veth1设备分配任何IP地址：

```
$ sudo ip netns add netns0 
$ sudo ip link add veth0 type veth peer name ceth0 
$ sudo ip link set veth0 up 
$ sudo ip link set ceth0 netns netns0 

$ sudo nsenter --net=/var/run/netns/netns0 
$ ip link set lo up 
$ ip link set ceth0 up 
$ ip addr add 172.18.0.10/16 dev ceth0 
$ exit 

$ sudo ip netns add netns1 
$ sudo ip link add veth1 type veth peer name ceth1 
$ sudo ip link set veth1 up 
$ sudo ip link set ceth1 netns netns1 

$ sudo nsenter --net=/var/run/netns/netns1 
$ ip link set lo up 
$ ip link set ceth1 up 
$ ip addr add 172.18.0.20/16 dev ceth1 
$ exit
```

确保主机上没有新的路由：

```
$ ip route 
default via 10.0.2.2 dev eth0 proto dhcp metric 100 
10.0.2.0/24 dev eth0 proto kernel scope link src 10.0.2.15 metric 100
```

最后创建网桥接口：

```
$ sudo ip link add br0 type bridge 
$ sudo ip link set br0 up
```

将veth0和veth1接到网桥上：

```
$ sudo ip link set veth0 master br0 
$ sudo ip link set veth1 master br0
```

![image-20210611230937113](https://gitee.com/wowosong/pic-md/raw/master/20210611230937.png)



检查容器间的连通性：

```
$ sudo nsenter --net=/var/run/netns/netns0 
$ ping -c 2 172.18.0.20 
PING 172.18.0.20 (172.18.0.20) 56(84) bytes of data. 
64 bytes from 172.18.0.20: icmp_seq=1 ttl=64 time=0.259 ms 
64 bytes from 172.18.0.20: icmp_seq=2 ttl=64 time=0.051 ms 
--- 172.18.0.20 ping statistics --- 
2 packets transmitted, 2 received, 0% packet loss, time 2ms 
rtt min/avg/max/mdev = 0.051/0.155/0.259/0.104 ms
$ sudo nsenter --net=/var/run/netns/netns1 
$ ping -c 2 172.18.0.10 
PING 172.18.0.10 (172.18.0.10) 56(84) bytes of data. 
64 bytes from 172.18.0.10: icmp_seq=1 ttl=64 time=0.037 ms 
64 bytes from 172.18.0.10: icmp_seq=2 ttl=64 time=0.089 ms 
--- 172.18.0.10 ping statistics --- 
2 packets transmitted, 2 received, 0% packet loss, time 36ms 
rtt min/avg/max/mdev = 0.037/0.063/0.089/0.026 ms
```

太好了！工作得很好。用这种新方案，我们根本不需要配置veth0和veth1。只需要在ceth0和ceth1端点分配两个IP地址。但是因为它们都连接在相同的Ethernet上（记住，它们连接到虚拟switch上），之间在L2层是连通的：

```
$ sudo nsenter --net=/var/run/netns/netns0 
$ ip neigh 
172.18.0.20 dev ceth0 lladdr 6e:9c:ae:02:60:de STALE 
$ exit 

$ sudo nsenter --net=/var/run/netns/netns1 
$ ip neigh 
172.18.0.10 dev ceth1 lladdr 66:f3:8c:75:09:29 STALE 
$ exit
```

太好了，我们学习了如何将容器变成友邻，让它们互不干扰，但是又可以连通。



## 连接外部世界（IP路由和地址伪装（masquerading））

容器间可以通信。但是它们能和主机，比如root命名空间，通信吗？

```
$ sudo nsenter --net=/var/run/netns/netns0 
$ ping 10.0.2.15 # eth0 address 
connect: Network is unreachable
```

这里很明显，netns0没有路由：

```
$ ip route 
172.18.0.0/16 dev ceth0 proto kernel scope link src 172.18.0.10
```

root命名空间不能和容器通信：

```
# 首先使用 exit 离开netns0: 
    $ ping -c 2 172.18.0.10 
    PING 172.18.0.10 (172.18.0.10) 56(84) bytes of data. 
    From 213.51.1.123 icmp_seq=1 Destination Net Unreachable 
    From 213.51.1.123 icmp_seq=2 Destination Net Unreachable 
    --- 172.18.0.10 ping statistics --- 
    2 packets transmitted, 0 received, +2 errors, 100% packet loss, time 3ms 

$ ping -c 2 172.18.0.20 
PING 172.18.0.20 (172.18.0.20) 56(84) bytes of data. 
From 213.51.1.123 icmp_seq=1 Destination Net Unreachable 
From 213.51.1.123 icmp_seq=2 Destination Net Unreachable 
--- 172.18.0.20 ping statistics --- 
2 packets transmitted, 0 received, +2 errors, 100% packet loss, time 3ms
```

要建立root和容器命名空间的连通性，我们需要给网桥网络接口分配IP地址：

```
$ sudo ip addr add 172.18.0.1/16 dev br0
```

一旦给网桥网络接口分配了IP地址，在主机的路由表里就会多一条路由：

```
$ ip route 
    # ...忽略无关行 ... 
    172.18.0.0/16 dev br0 proto kernel scope link src 172.18.0.1 

$ ping -c 2 172.18.0.10 
PING 172.18.0.10 (172.18.0.10) 56(84) bytes of data. 
64 bytes from 172.18.0.10: icmp_seq=1 ttl=64 time=0.036 ms 
64 bytes from 172.18.0.10: icmp_seq=2 ttl=64 time=0.049 ms 

--- 172.18.0.10 ping statistics --- 
2 packets transmitted, 2 received, 0% packet loss, time 11ms 
rtt min/avg/max/mdev = 0.036/0.042/0.049/0.009 ms 

$ ping -c 2 172.18.0.20 
PING 172.18.0.20 (172.18.0.20) 56(84) bytes of data. 
64 bytes from 172.18.0.20: icmp_seq=1 ttl=64 time=0.059 ms 
64 bytes from 172.18.0.20: icmp_seq=2 ttl=64 time=0.056 ms 

--- 172.18.0.20 ping statistics --- 
2 packets transmitted, 2 received, 0% packet loss, time 4ms 
rtt min/avg/max/mdev = 0.056/0.057/0.059/0.007 ms
```

容器可能也可以ping网桥接口，但是它们还是无法连接到主机的eth0。需要为容器添加默认的路由：

```
$ sudo nsenter --net=/var/run/netns/netns0 
$ ip route add default via 172.18.0.1 
$ ping -c 2 10.0.2.15 
PING 10.0.2.15 (10.0.2.15) 56(84) bytes of data. 
64 bytes from 10.0.2.15: icmp_seq=1 ttl=64 time=0.036 ms 
64 bytes from 10.0.2.15: icmp_seq=2 ttl=64 time=0.053 ms 
--- 10.0.2.15 ping statistics --- 
2 packets transmitted, 2 received, 0% packet loss, time 14ms 
rtt min/avg/max/mdev = 0.036/0.044/0.053/0.010 ms 
    # 为`netns1`也做上述配置
```

这个改动基本上把主机变成了路由，并且网桥接口变成了容器间的默认网关。

![image-20210611231013743](https://gitee.com/wowosong/pic-md/raw/master/20210611231013.png)



很好，我们将容器连接到root命名空间上。现在，继续尝试将它们连接到外部世界。Linux上默认disable了网络包转发（比如，路由功能）。我们需要先启用这个功能：

```
# 在 root 命名空间 
    sudo bash -c 'echo 1 > /proc/sys/net/ipv4/ip_forward'
```

再次检查连通性：

```
$ sudo nsenter --net=/var/run/netns/netns0 
$ ping 8.8.8.8 
    # hung住了...
```

还是不工作。哪里弄错了呢？如果容器可以向外部发包，那么目标服务器无法将包发回容器，因为容器的IP地址是私有的，那个特定IP的路由规则只有本地网络知道。并且有很多容器共享的是完全相同的私有IP地址172.18.0.10。这个问题的解决方法称为网络地址翻译（NAT）。在到达外部网络之前，容器发出的包会将源IP地址替换为主机的外部网络地址。主机还会跟踪所有已有的映射，会在将包转发回容器之前恢复之前被替换的IP地址。听上去很复杂，但是有一个好消息！iptables模块让我们只需要一条命令就可以完成这一切：

```
$ sudo iptables -t nat -A POSTROUTING -s 172.18.0.0/16 ! -o br0 -j MASQUERADE
```

命令非常简单。在nat表里添加了一条POSTROUTING chain的新路由，会替换伪装所有源于172.18.0.0/16网络的包，但是不通过网桥接口。



检查连通性：

```
$ sudo nsenter --net=/var/run/netns/netns0 
$ ping -c 2 8.8.8.8 PING 8.8.8.8 (8.8.8.8) 56(84) bytes of data. 
64 bytes from 8.8.8.8: icmp_seq=1 ttl=61 time=43.2 ms 
64 bytes from 8.8.8.8: icmp_seq=2 ttl=61 time=36.8 ms 
--- 8.8.8.8 ping statistics --- 
2 packets transmitted, 2 received, 0% packet loss, time 2ms 
rtt min/avg/max/mdev = 36.815/40.008/43.202/3.199 ms
```

要知道这里我们用的默认策略——允许所有流量，这在真实的环境里是非常危险的。主机的默认iptables策略是ACCEPT：

```
sudo iptables -S 
-P INPUT ACCEPT 
-P FORWARD ACCEPT 
-P OUTPUT ACCEPT
```

Docker默认限制所有流量，随后仅仅为已知的路径启用路由。



如下是在CentOS 8机器上，单个容器暴露了端口5005时，由Docker daemon生成的规则：

```
$ sudo iptables -t filter --list-rules 
-P INPUT ACCEPT 
-P FORWARD DROP 
-P OUTPUT ACCEPT 
-N DOCKER 
-N DOCKER-ISOLATION-STAGE-1 
-N DOCKER-ISOLATION-STAGE-2 
-N DOCKER-USER 
-A FORWARD -j DOCKER-USER 
-A FORWARD -j DOCKER-ISOLATION-STAGE-1 
-A FORWARD -o docker0 -m conntrack --ctstate RELATED,ESTABLISHED -j ACCEPT
-A FORWARD -o docker0 -j DOCKER 
-A FORWARD -i docker0 ! -o docker0 -j ACCEPT 
-A FORWARD -i docker0 -o docker0 -j ACCEPT 
-A DOCKER -d 172.17.0.2/32 ! -i docker0 -o docker0 -p tcp -m tcp --dport 5000 -j ACCEPT 
-A DOCKER-ISOLATION-STAGE-1 -i docker0 ! -o docker0 -j DOCKER-ISOLATION-STAGE-2 
-A DOCKER-ISOLATION-STAGE-1 -j RETURN 
-A DOCKER-ISOLATION-STAGE-2 -o docker0 -j DROP 
-A DOCKER-ISOLATION-STAGE-2 -j RETURN 
-A DOCKER-USER -j RETURN 

$ sudo iptables -t nat --list-rules 
-P PREROUTING ACCEPT 
-P INPUT ACCEPT 
-P POSTROUTING ACCEPT 
-P OUTPUT ACCEPT 
-N DOCKER 
-A PREROUTING -m addrtype --dst-type LOCAL -j DOCKER 
-A POSTROUTING -s 172.17.0.0/16 ! -o docker0 -j MASQUERADE 
-A POSTROUTING -s 172.17.0.2/32 -d 172.17.0.2/32 -p tcp -m tcp --dport 5000 -j MASQUERADE
-A OUTPUT ! -d 127.0.0.0/8 -m addrtype --dst-type LOCAL -j DOCKER 
-A DOCKER -i docker0 -j RETURN 
-A DOCKER ! -i docker0 -p tcp -m tcp --dport 5005 -j DNAT --to-destination 172.17.0.2:5000 

$ sudo iptables -t mangle --list-rules 
-P PREROUTING ACCEPT 
-P INPUT ACCEPT 
-P FORWARD ACCEPT 
-P OUTPUT ACCEPT
 -P POSTROUTING ACCEPT 

$ sudo iptables -t raw --list-rules 
-P PREROUTING ACCEPT 
-P OUTPUT ACCEPT
```



## 让外部世界可以访问容器（端口发布）

大家都知道可以将容器端口发布给一些（或者所有）主机的接口。但是端口发布到底是什么意思呢？



假设容器内运行着服务器：

```
$ sudo nsenter --net=/var/run/netns/netns0 
$ python3 -m http.server --bind 172.18.0.10 5000
```

如果我们试着从主机上发送一个HTTP请求到这个服务器，一切都工作得很好（root命名空间和所有容器接口之间有链接，当然可以连接成功）：

```
# 从 root 命名空间 
    $ curl 172.18.0.10:5000 
    <!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN"  "http://www.w3.org/TR/html4/strict.dtd"> 
    # ... 忽略无关行 ...
```

但是，如果要从外部访问这个服务器，应该使用哪个IP呢？我们知道的唯一IP是主机的外部接口地址eth0：

```
$ curl 10.0.2.15:5000 
curl: (7) Failed to connect to 10.0.2.15 port 5000: Connection refused
```

因此，我们需要找到方法，能够将到达主机eth05000端口的所有包转发到目的地172.18.0.10:5000。又是iptables来帮忙！

```
# 外部流量  
    sudo iptables -t nat -A PREROUTING -d 10.0.2.15 -p tcp -m tcp --dport 5000 -j DNAT --to-destination 172.18.0.10:5000 
    # 本地流量 (因为它没有通过 PREROUTING chain) 
    sudo iptables -t nat -A OUTPUT -d 10.0.2.15 -p tcp -m tcp --dport 5000 -j DNAT --to-destination 172.18.0.10:5000
```

另外，需要让iptables能够在桥接网络上截获流量：

```
sudo modprobe br_netfilter
```

测试：

```
curl 10.0.2.15:5000 
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN"  "http://www.w3.org/TR/html4/strict.dtd">
      # ... 忽略无关行 ...
```



## 理解Docker网络驱动



我们可以怎么使用这些知识呢？比如，可以试着理解Docker网络模式[1]。



从--network host模式开始。试着比较一下命令ip link和sudo docker run -it --rm --network host alpine ip link的输出。它们几乎一样！在host模式下，Docker简单地没有使用网络命名空间隔离，容器就在root网络命名空间里工作，并且和主机共享网络栈。



下一个模式是--network none。sudo docker run -it --rm --network host alpine ip link的输出只有一个loopback网络接口。这和之前创建的网络命名空间，没有添加veth设备前很相似。



最后是--network bridge（默认）模式。这正是我们前文尝试创建的模式。大家可以试试ip 和iptables命令，分别从主机和容器的角度观察一下网络栈。



## rootless容器和网络

Podman容器管理器的一个很好的特性是关注于rootless容器。但是，你可能注意到，本文使用了很多sudo命令。说明，没有root权限无法配置网络。Podman在root网络上的方案[2]和Docker非常相似。但是在rootless容器上，Podman使用了slirp4netns[3]项目：

```
从Linux 3.8开始，非特权用户可以创建user_namespaces(7)的同时创建network_namespaces(7)。但是，非特权网络命名空间并不是很有用，因为在主机和网络命名空间之间创建veth(4)仍然需要root权限

slirp4netns可以用完全非特权的方式将网络命名空间连接到Internet上，通过网络命名空间里的一个TAP设备连接到用户态的TCP/IP栈（slirp）。

```

rootless网络是很有限的：“从技术上说，容器本身没有IP地址，因为没有root权限，无法实现网络设备的关联。另外，从rootless容器ping是不会工作的，因为它缺少CAP_NET_RAW安全能力，而这是ping命令必需的。”但是它仍然比完全没有连接要好。



## 结论

本文介绍的组织容器网络的方案仅仅是可能方案的一种（可能是最为广泛使用的一种）。还有很多别的方式，由官方或者第三方插件实现，但是所有这些方案都严重依赖于Linux网络虚拟化技术[4]。因此，容器化可以认为是一种虚拟化技术。