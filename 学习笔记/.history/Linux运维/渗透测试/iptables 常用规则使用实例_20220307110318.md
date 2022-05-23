在本文中列出了一些实用的iptables规则，可以参考。



​																		**清空数据包流量、清空链、清空规则**

使用下面几个命令可以清空iptables表：

```
# 使用-t选项选择哪个表，表有filter, nat , mangle三个表
iptables -t filter -F
iptables -t filter -X
iptables -t filter -Z
```

`-F`清空所有链的规则，`-X`删除自定义的链，`-Z`清空数据包流量。

​																								**设置默认策略**

默认链策略是ACCEPT。对于所有INPUT，FORWARD和OUTPUT链，将其更改为DROP，如下所示：

```
iptables -P INPUT DROP
iptables -P OUTPUT DROP
iptables -P FORWARDING DROP
```

将INPUT和OUTPUT链的默认策略都设置为DROP时，对每个防火墙规则要求，都应定义两个规则，一个用于INPUT，一个用于OUTPUT。

如果信任内部用户，则可以省略上面的OUTPUT。即默认情况下不丢弃所有OUTPUT数据包。在这种情况下，对于拥有的每个防火墙规则要求，只需定义一个规则即可。即只为INPUT定义规则，因为所有数据包的传出都是ACCEPT。

​																							**阻止指定的IP地址进入**

```
BLOCK_THIS_IP="x.x.x.x" iptables -A INPUT -s "$BLOCK_THIS_IP" -j DROP
或者
iptables -A INPUT -i ens160 -s "$BLOCK_THIS_IP" -j DROP
或者 iptables -A INPUT -i ens160 -p tcp -s "$BLOCK_THIS_IP" -j DROP
```

定义一个变量，值写入要阻止的ip地址。上面第一条规则的意思是从某个ip进入的流量拒绝掉。第二条规则是阻止某个ip地址从eth0进入的流量。第三条规则指的是拒绝某个ip地址从eth0进入访问tcp协议的流量。



​																						**允许外部用户ssh登录本机**

以下规则允许ens160接口上的所有传入的ssh连接。

```
iptables -A INPUT -i ens160 -p tcp --dport 22 -m state --state NEW,ESTABLISHED -j ACCEPT
iptables -A OUTPUT -o ens160 -p tcp --sport 22 -m state --state ESTABLISHED -j ACCEPT
```

下面是允许指定网段的ip地址连接本机的ssh服务：

```
iptables -A INPUT -i ens160 -p tcp -s 192.168.100.0/24 --dport 22 -m state --state NEW,ESTABLISHED -j ACCEPT
iptables -A OUTPUT -o ens160 -p tcp --sport 22 -m state --state ESTABLISHED -j ACCEPT
```



​																					**允许本机使用ssh登录远程主机**

以下规则允许传出ssh连接。当从内部ssh连接到外部服务器时可以使用：

```
iptables -A OUTPUT -o ens160 -p tcp --dport 22 -m state --state NEW,ESTABLISHED -j ACCEPT
iptables -A INPUT -i ens160 -p tcp --sport 22 -m state --state ESTABLISHED -j ACCEPT
```



​																			**使用multiport模块，允许外部访问本机的80,443**

下面使用`multiport`模块，可以减少写入规则条数。下面实例允许外部访问本机的http,https服务。

```
iptables -A INPUT -i ens160 -p tcp -m multiport --dports 80,443 -m state --state NEW,ESTABLISHED -j ACCEPT
iptables -A OUTPUT -o ens160 -p tcp -m multiport --sports 80,443 -m state --state ESTABLISHED -j ACCEPT
```

![图片](https://mmbiz.qpic.cn/mmbiz_png/K0TMNq37VN1UvekvLGTOfXYy3AKNJIw4IVJu4CRa3Xbhv5oV0XLUhtUicSopTVgqnh3EBicylgicNCRbcPU1lNnwA/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)





​																			**允许本地访问外部的http,https服务**

下面命令允许本机访问外面的http,https服务：

```
iptables -A OUTPUT -o ens160 -p tcp -m multiport --dports 80,443 -m state --state NEW,ESTABLISHED -j ACCEPT
iptables -A INPUT -i ens160 -p tcp -m multiport --sports 80,443 -m state --state ESTABLISHED -j ACCEPT
```

![图片](https://gitee.com/wowosong/pic-md/raw/master/202203071102222.webp)





​																						**允许外部ping本机**

以下规则允许外部用户能够ping你的服务器：

```
iptables -A INPUT -p icmp --icmp-type echo-request -j ACCEPT
iptables -A OUTPUT -p icmp --icmp-type echo-reply -j ACCEPT
```




​																					**允许本机ping外部**

以下规则允许从内部ping到任何外部服务器：

```
iptables -A OUTPUT -p icmp --icmp-type echo-request -j ACCEPT
iptables -A INPUT -p icmp --icmp-type echo-reply -j ACCEPT
```

![image-20210611225430618](https://gitee.com/wowosong/pic-md/raw/master/20210611225430.png)**



​																	防DDOS攻击

下面规则将帮助你预防Web服务器上的拒绝服务（DoS）攻击：

```
iptables -A INPUT -p tcp --dport 80 -m limit --limit 25/minute --limit-burst 100 -j ACCEPT
```

- -m limit：使用limit模块
- --limit 25/minute：此限制每分钟最多25个连接。根据具体要求更改此值
- --limit-burst 100：该值表示只有在连接总数达到limit-burst级别后，才执行limit 25/minute。