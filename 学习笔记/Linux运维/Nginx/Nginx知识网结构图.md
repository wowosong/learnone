Nginx 是一个高性能的 HTTP 和反向代理服务器，特点是占用内存少，并发能力强，事实上 Nginx 的并发能力确实在同类型的网页服务器中表现较好。Nginx 专为性能优化而开发，性能是其最重要的要求，十分注重效率，有报告 Nginx 能支持高达 50000 个并发连接数。



# Nginx 知识网结构图

Nginx 的知识网结构图如下：

![图片](./Nginx%E7%9F%A5%E8%AF%86%E7%BD%91%E7%BB%93%E6%9E%84%E5%9B%BE.assets/20220110221001.webp)

## 正向代理

**正向代理：**局域网中的电脑用户想要直接访问网络是不可行的，只能通过代理服务器来访问，这种代理服务就被称为正向代理。

![图片](./Nginx%E7%9F%A5%E8%AF%86%E7%BD%91%E7%BB%93%E6%9E%84%E5%9B%BE.assets/20210906180046.webp)

## 反向代理

**反向代理：**客户端无法感知代理，因为客户端访问网络不需要配置，只要把请求发送到反向代理服务器，由反向代理服务器去选择目标服务器获取数据，然后再返回到客户端。

此时反向代理服务器和目标服务器对外就是一个服务器，暴露的是代理服务器地址，隐藏了真实服务器 IP 地址。

![图片](./Nginx%E7%9F%A5%E8%AF%86%E7%BD%91%E7%BB%93%E6%9E%84%E5%9B%BE.assets/20210906180050.webp)

## **负载均衡**



客户端发送多个请求到服务器，服务器处理请求，有一些可能要与数据库进行交互，服务器处理完毕之后，再将结果返回给客户端。

普通请求和响应过程如下图：

![图片](./Nginx%E7%9F%A5%E8%AF%86%E7%BD%91%E7%BB%93%E6%9E%84%E5%9B%BE.assets/20210906180054.webp)

但是随着信息数量增长，访问量和数据量飞速增长，普通架构无法满足现在的需求。

我们首先想到的是升级服务器配置，可以由于摩尔定律的日益失效，单纯从硬件提升性能已经逐渐不可取了，怎么解决这种需求呢？

我们可以增加服务器的数量，构建集群，将请求分发到各个服务器上，将原来请求集中到单个服务器的情况改为请求分发到多个服务器，也就是我们说的负载均衡。

图解负载均衡：

![图片](./Nginx%E7%9F%A5%E8%AF%86%E7%BD%91%E7%BB%93%E6%9E%84%E5%9B%BE.assets/20210906180057.webp)

假设有 15 个请求发送到代理服务器，那么由代理服务器根据服务器数量，平均分配，每个服务器处理 5 个请求，这个过程就叫做负载均衡。

## 动静分离

为了加快网站的解析速度，可以把动态页面和静态页面交给不同的服务器来解析，加快解析的速度，降低由单个服务器的压力。

动静分离之前的状态：

![图片](./Nginx%E7%9F%A5%E8%AF%86%E7%BD%91%E7%BB%93%E6%9E%84%E5%9B%BE.assets/20210906180100.webp)

动静分离之后：

![图片](./Nginx%E7%9F%A5%E8%AF%86%E7%BD%91%E7%BB%93%E6%9E%84%E5%9B%BE.assets/20220110221023)



## Nginx安装

Nginx 如何在 Linux 安装

参考链接：

```
https://blog.csdn.net/yujing1314/article/details/97267369
```

Nginx 常用命令

查看版本：

```
./nginx -v
```

启动：

```
./nginx
```

关闭（有两种方式，推荐使用 ./nginx -s quit）：

```
 ./nginx -s stop
 ./nginx -s quit
```

重新加载 Nginx 配置：

```
./nginx -s reload
```

Nginx 的配置文件

配置文件分三部分组成：

### **①全局块**

从配置文件开始到 events 块之间，主要是设置一些影响 Nginx 服务器整体运行的配置指令。

并发处理服务的配置，值越大，可以支持的并发处理量越多，但是会受到硬件、软件等设备的制约。

![图片](./Nginx%E7%9F%A5%E8%AF%86%E7%BD%91%E7%BB%93%E6%9E%84%E5%9B%BE.assets/20210906180105.webp)

### **②events 块**

影响 Nginx 服务器与用户的网络连接，常用的设置包括是否开启对多 workprocess 下的网络连接进行序列化，是否允许同时接收多个网络连接等等。

支持的最大连接数：

![图片](./Nginx%E7%9F%A5%E8%AF%86%E7%BD%91%E7%BB%93%E6%9E%84%E5%9B%BE.assets/20210906180108.webp)



### **③HTTP 块**

诸如反向代理和负载均衡都在此配置。

```
location[ = | ~ | ~* | ^~] url{

}
```

location 指令说明，该语法用来匹配 url，语法如上：

- **=：**用于不含正则表达式的 url 前，要求字符串与 url 严格匹配，匹配成功就停止向下搜索并处理请求。
- **~：**用于表示 url 包含正则表达式，并且区分大小写。
- **~\*：**用于表示 url 包含正则表达式，并且不区分大小写。
- **^~：**用于不含正则表达式的 url 前，要求 Nginx 服务器找到表示 url 和字符串匹配度最高的 location 后，立即使用此 location 处理请求，而不再匹配。
- 如果有 url 包含正则表达式，不需要有 ~ 开头标识。

## 反向代理实战

### **①配置反向代理**

目的：在浏览器地址栏输入地址 www.123.com 跳转 Linux 系统 Tomcat 主页面。

### **②具体实现**

先配置 Tomcat，因为比较简单，此处不再赘叙，并在 Windows 访问：

![图片](./Nginx%E7%9F%A5%E8%AF%86%E7%BD%91%E7%BB%93%E6%9E%84%E5%9B%BE.assets/20210906180111.webp)



具体流程如下图：

![图片](./Nginx%E7%9F%A5%E8%AF%86%E7%BD%91%E7%BB%93%E6%9E%84%E5%9B%BE.assets/20210906180115.webp)

修改之前：

![图片](./Nginx%E7%9F%A5%E8%AF%86%E7%BD%91%E7%BB%93%E6%9E%84%E5%9B%BE.assets/20220110221041)



配置如下：

![图片](./Nginx%E7%9F%A5%E8%AF%86%E7%BD%91%E7%BB%93%E6%9E%84%E5%9B%BE.assets/20210906180118.webp)

再次访问：

![图片](./Nginx%E7%9F%A5%E8%AF%86%E7%BD%91%E7%BB%93%E6%9E%84%E5%9B%BE.assets/20210906180121.webp)

### **③反向代理 2**

目标：

- 访问 http://192.168.25.132:9001/edu/ 直接跳转到 192.168.25.132:8080
- 访问 http://192.168.25.132:9001/vod/ 直接跳转到 192.168.25.132:8081

**准备：**配置两个 Tomcat，端口分别为 8080 和 8081，都可以访问，端口修改配置文件即可。

![图片](./Nginx%E7%9F%A5%E8%AF%86%E7%BD%91%E7%BB%93%E6%9E%84%E5%9B%BE.assets/20210906180128.webp)

![图片](./Nginx%E7%9F%A5%E8%AF%86%E7%BD%91%E7%BB%93%E6%9E%84%E5%9B%BE.assets/20210906180131.webp)

新建文件内容分别添加 8080！！！和 8081！！！

![图片](./Nginx%E7%9F%A5%E8%AF%86%E7%BD%91%E7%BB%93%E6%9E%84%E5%9B%BE.assets/20210906180134.webp)

![图片](./Nginx%E7%9F%A5%E8%AF%86%E7%BD%91%E7%BB%93%E6%9E%84%E5%9B%BE.assets/20220110221052)

响应如下图：

![图片](./Nginx%E7%9F%A5%E8%AF%86%E7%BD%91%E7%BB%93%E6%9E%84%E5%9B%BE.assets/20210906180137.webp)

![图片](./Nginx%E7%9F%A5%E8%AF%86%E7%BD%91%E7%BB%93%E6%9E%84%E5%9B%BE.assets/20210906180143.webp)

具体配置如下：

![图片](./Nginx%E7%9F%A5%E8%AF%86%E7%BD%91%E7%BB%93%E6%9E%84%E5%9B%BE.assets/20220110220948)

重新加载 Nginx：

```
./nginx -s reload
```

访问：

![图片](./Nginx%E7%9F%A5%E8%AF%86%E7%BD%91%E7%BB%93%E6%9E%84%E5%9B%BE.assets/20210906180147.webp)

![图片](./Nginx%E7%9F%A5%E8%AF%86%E7%BD%91%E7%BB%93%E6%9E%84%E5%9B%BE.assets/20210906174133.webp)

实现了同一个端口代理，通过 edu 和 vod 路径的切换显示不同的页面。

## **反向代理小结**

**第一个例子：**浏览器访问 www.123.com，由 host 文件解析出服务器 ip 地址
192.168.25.132 www.123.com。

然后默认访问 80 端口，而通过 Nginx 监听 80 端口代理到本地的 8080 端口上，从而实现了访问 www.123.com，最终转发到 tomcat 8080 上去。

第二个例子：

- 访问 http://192.168.25.132:9001/edu/ 直接跳转到 192.168.25.132:8080
- 访问 http://192.168.25.132:9001/vod/ 直接跳转到 192.168.25.132:8081

实际上就是通过 Nginx 监听 9001 端口，然后通过正则表达式选择转发到 8080 还是 8081 的 Tomcat 上去。

## 负载均衡实战

①修改 nginx.conf，如下图：

![图片](./Nginx%E7%9F%A5%E8%AF%86%E7%BD%91%E7%BB%93%E6%9E%84%E5%9B%BE.assets/20210906174140.webp)

![图片](./Nginx%E7%9F%A5%E8%AF%86%E7%BD%91%E7%BB%93%E6%9E%84%E5%9B%BE.assets/20210906180156.webp)

②重启 Nginx：

```
./nginx -s reload
```

③在 8081 的 Tomcat 的 webapps 文件夹下新建 edu 文件夹和 a.html 文件，填写内容为 8081！！！！

④在地址栏回车，就会分发到不同的 Tomcat 服务器上：

![图片](./Nginx%E7%9F%A5%E8%AF%86%E7%BD%91%E7%BB%93%E6%9E%84%E5%9B%BE.assets/20220110221108)

![图片](./Nginx%E7%9F%A5%E8%AF%86%E7%BD%91%E7%BB%93%E6%9E%84%E5%9B%BE.assets/20210906180159.webp)

负载均衡方式如下：

- 轮询（默认）。
- weight，代表权，权越高优先级越高。
- fair，按后端服务器的响应时间来分配请求，相应时间短的优先分配。
- ip_hash，每个请求按照访问 ip 的 hash 结果分配，这样每一个访客固定的访问一个后端服务器，可以解决 Session 的问题。

![图片](./Nginx%E7%9F%A5%E8%AF%86%E7%BD%91%E7%BB%93%E6%9E%84%E5%9B%BE.assets/20210906180202.webp) 

![图片](./Nginx%E7%9F%A5%E8%AF%86%E7%BD%91%E7%BB%93%E6%9E%84%E5%9B%BE.assets/20210906180206.webp) 

![图片](./Nginx%E7%9F%A5%E8%AF%86%E7%BD%91%E7%BB%93%E6%9E%84%E5%9B%BE.assets/20210906180210.webp)

## 动静分离实战

什么是动静分离？把动态请求和静态请求分开，不是讲动态页面和静态页面物理分离，可以理解为 Nginx 处理静态页面，Tomcat 处理动态页面。

动静分离大致分为两种：

- 纯粹将静态文件独立成单独域名放在独立的服务器上，也是目前主流方案。
- 将动态跟静态文件混合在一起发布，通过 Nginx 分开。

### 动静分离图析：

![图片](./Nginx%E7%9F%A5%E8%AF%86%E7%BD%91%E7%BB%93%E6%9E%84%E5%9B%BE.assets/20210906180213.webp)



实战准备，准备静态文件：

![图片](./Nginx%E7%9F%A5%E8%AF%86%E7%BD%91%E7%BB%93%E6%9E%84%E5%9B%BE.assets/20210906180216.webp)

![图片](./Nginx%E7%9F%A5%E8%AF%86%E7%BD%91%E7%BB%93%E6%9E%84%E5%9B%BE.assets/20210906180219.webp)

配置 Nginx，如下图：

![图片](./Nginx%E7%9F%A5%E8%AF%86%E7%BD%91%E7%BB%93%E6%9E%84%E5%9B%BE.assets/20210906180223.webp)

## Nginx 高可用

如果 Nginx 出现问题：

![图片](./Nginx%E7%9F%A5%E8%AF%86%E7%BD%91%E7%BB%93%E6%9E%84%E5%9B%BE.assets/20210906180226.webp)

解决办法：

![图片](./Nginx%E7%9F%A5%E8%AF%86%E7%BD%91%E7%BB%93%E6%9E%84%E5%9B%BE.assets/20210906180230.webp)

前期准备：

- **两台 Nginx 服务器**
- **安装 Keepalived**
- **虚拟 ip**

### 安装 Keepalived：

```
[root@192 usr]# yum install keepalived -y
[root@192 usr]# rpm -q -a keepalived
keepalived-1.3.5-16.el7.x86_64
```

修改配置文件：

```
[root@192 keepalived]# cd /etc/keepalived
[root@192 keepalived]# vi keepalived.conf
```

分别将如下配置文件复制粘贴，覆盖掉 keepalived.conf，虚拟 ip 为 192.168.25.50。

两台机器上安装nginx，编译安装的话需要另外安装pcre包支持，安装在/usr/local/nginx

Keepalived-master 和backup 安装keepalived 和ipvsadm（lvs安装包）

对应主机 ip 需要修改的是：

- smtp_server 192.168.25.147（主）smtp_server 192.168.25.147（备）
- state MASTER（主） state BACKUP（备）

```
global_defs {
   notification_email {
     acassen@firewall.loc
     failover@firewall.loc
     sysadmin@firewall.loc
   }
   notification_email_from Alexandre.Cassen@firewall.loc
   smtp_server 192.168.25.147
   smtp_connect_timeout 30
   router_id LVS_DEVEL # 访问的主机地址
}

vrrp_script chk_nginx {
  script "/usr/local/src/nginx_check.sh"  # 检测文件的地址
  interval 2   # 检测脚本执行的间隔
  weight 2   # 权重
}

vrrp_instance VI_1 {
    state BACKUP    # 主机MASTER、备机BACKUP    
    interface ens33   # 网卡
    virtual_router_id 51 # 同一组需一致
    priority 90  # 访问优先级，主机值较大，备机较小
    advert_int 1
    authentication {
        auth_type PASS
        auth_pass 1111
    }
    virtual_ipaddress {
        192.168.25.50  # 虚拟ip
    }
}
```

启动代码如下：

```
[root@192 sbin]# systemctl start keepalived.service
```

![图片](./Nginx%E7%9F%A5%E8%AF%86%E7%BD%91%E7%BB%93%E6%9E%84%E5%9B%BE.assets/20210906180235.webp)



访问虚拟 ip 成功：

![图片](./Nginx%E7%9F%A5%E8%AF%86%E7%BD%91%E7%BB%93%E6%9E%84%E5%9B%BE.assets/20210906180238.webp)

关闭主机 147 的 Nginx 和 Keepalived，发现仍然可以访问。

## 原理解析

![图片](./Nginx%E7%9F%A5%E8%AF%86%E7%BD%91%E7%BB%93%E6%9E%84%E5%9B%BE.assets/20210906180241.webp)

如下图，就是启动了一个 master，一个 worker，master 是管理员，worker是具体工作的进程。

![图片](./Nginx%E7%9F%A5%E8%AF%86%E7%BD%91%E7%BB%93%E6%9E%84%E5%9B%BE.assets/20210906180247.webp)

worker 如何工作？如下图：

![图片](./Nginx%E7%9F%A5%E8%AF%86%E7%BD%91%E7%BB%93%E6%9E%84%E5%9B%BE.assets/20210906180249.webp)



小结

worker 数应该和 CPU 数相等；一个 master 多个 worker 可以使用热部署，同时 worker 是独立的，一个挂了不会影响其他的。

*原文链接：https://blog.csdn.net/yujing1314/article/details/107000737*