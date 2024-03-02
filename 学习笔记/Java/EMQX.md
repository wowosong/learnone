## 5.学习收获

学习完本课程我们能具备以下能力：

1. 能够掌握MQTT这种基于发布/订阅模式的物联网消息通信协议，理解其原理和实现方式，对协议的数据格式非常清楚，能有效应对面试及工作
2. 能够搭建EMQX Broker消息服务器环境，掌握它的基本使用步骤。
3. 能够使用EMQX Broker轻松连接物联网设备，完成设备端的身份认证和数据双向通信。
4. 能够掌握EMQX Broker消息发布/订阅的ACL权限控制，WebHook网络钩子，集群的搭建和使用。
5. 能够掌握EMQX Broker中的保留消息，共享订阅，延迟发布，代理订阅，主题重写，黑名单，速率限制，规则引擎等功能。

## 6.适用人群

目标人群：

1. 想要从事物联网行业的技术人员
2. 想要完善物联网技术体系的IT人员
3. 毕业想从事java开发工作且跟物联网相关的大学生

# 第一章MQTT协议与EMQ

学习目标

目标1: 能够说出MQTT协议的概念，特点及作用

目标2:能够说出发布/订阅，代理，主题，会话，服务质量的相关概念，MQTT协议中的动作

目标3:能够说出MQTT协议的组成，固定头中的组成结构，可变头主要的组成结构

目标4:能够说出EMQX是什么,完成EMQXBroker环境搭建以及websocket客户端完成消息数据的收发

## 1.MQTT协议介绍

随着5G时代的来临，万物物联的伟大构想正在成为现实。联网的物联网设备在2018年已经达到了70亿，在未来两年，仅智能水电气表就将超过10亿

![image-20240122213907863](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401222139673.png)

![image-20240122213958171](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401222140322.png)

![image-20240122214208073](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401222142543.png)

mqtt官网：http://mgtt.org/

mqtt中文网：http://mqtt.p2hp.com/

### 1.1 MQTT简介

​	MQTT(Message Queuing Telemetry Transport,演息队列遥测传输协议),是一种基于发布/订阅(publish/subscribe)模式的"轻量级"通讯协议，该协议构建于TCP/IP协议上，由IBM在1999年发布。

​	MQTT最大优点在于，可以以极少的代码和有限的带宽，为连接远程设备提供实时可靠的消息服务。作为一种低开销、低带宽占用的即时通讯协议，使其在物联网、小型设备、移动应用等方面有较广泛的应用。

​	MQTT是一个基于客户端-服务器的消息发布/订阅传输协议。MQTT协议是轻量、简单、开放和易于实现的，这些特点使它适用范围非常广泛。在很多情况下，包括受限的环境中，如：机器与机器(M2M)通信和物联网(IoT)。其在，通过卫星链路通信传感器、偶尔拨号的医疗设备、智能家居、及一些小型化设备中已广泛使用。

![image-20240122214538168](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401222145760.png)

### 1.2 MQTT协议设计规范

由于物联网的环境是非常特别的，所以MQTT遵循以下设计原则：

●     (1)精简，不添加可有可无的功能；

●     (2)发布/订阅(Pub/Sub)模式，方便消息在传感器之间传递，解耦Client/Server模式，带来的好处在于不必预先知道对方的存在(ip/port),不必同时运行；

●    (3)允许用户动态创建主题(不需要预先创建主题),零运维成本；

●    (4)把传输量降到最低以提高传输效率；

●    (5)把低带宽、高延迟、不稳定的网络等因素考虑在内；

●    (6)支持连续的会话保持和控制(心跳);

●    (7)理解客户端计算能力可能很低；

●    (8)提供服务质量(quality of service level:QoS)管理；

●    (9)不强求传输数据的类型与格式，保持灵活性(指的是应用层业务数据)。

### 1.3 MQTT协议主要特性

MQTT协议工作在低带宽、不可靠的网络的远程传感器和控制设备通讯而设计的协议，它具有以下主要的几项特性：

●      (1)开放消息协议，简单易实现。

●      (2)使用发布/订阅消息模式，提供一对多的消息发布，解除应用程序耦合。

●      (3)对负载(协议携带的应用数据)内容屏蔽的消息传输。

●      (4)基于TCP/IP网络连接，提供有序，无损，双向连接。

​	主流的MQTT是基于TCP连接进行数据推送的，但是同样有基于UDP的版本，叫做MQTT-SN。这两种版本由于基于不同的连接方式，优缺点自然也就各有不同了。

●      (5)消息服务质量(QoS)支持，可靠传输保证；有三种消息发布服务质量：

​	QoS0:"至多一次",消息发布完全依赖底层TCP/IP网络。会发生消息丢失或重复。这一级别可用于如下情况，环境传感器数据，丢失一次读记录无所谓，因为不久后还会有第二次发送。这一种方式主要普通APP的推送，倘若你的智能设备在消息推送时未联网，推送过去没收到，再次联网也就收不到了。

​	QoS1:"至少一次",确保消息到达，但消息重复可能会发生。

​	QoS2:"只有一次",确保消息到达一次。在一些要求比较严格的计费系统中，可以使用此级别。在计费系统中，消息重复或丢失会导致不正确的结果。这种最高质量的消息发布服务还可以用于即时通讯类的APP的推送，确保用户收到且只会收到一次。

●      (6)1字节固定报头，2字节心跳报文，最小化传输开销和协议交换，有效减少网络流量。

​	这就是为什么在介绍里说它非常适合"在物联网领域，传感器与服务器的通信，信息的收集，要知道嵌入式设备的运算能力和带宽都相对薄弱，使用这种协议来传递消息再适合不过了。
●      (7)在线状态感知：使用Last Will和Testament特性通知有关各方客户端异常中断的机制。

​	Last Will:即遗言机制，用于通知同一主题下的其他设备，发送遗言的设备已经断开了连接。

​	Testament:遗嘱机制，功能类似于Last Will。

### 1.4 MQTT协议应用领域

MQTT协议广泛应用于物联网、移动互联网、智能硬件、车联网、电力能源等领域。

- 物联网M2M通信，物联网大数据采集
- Android消息推送，WEB消息推送
- 移动即时消息，例如Facebook Messenger
- 智能硬件、智能家具、智能电器
- 车联网通信，电动车站桩采集
- 智慧城市、远程医疗、远程教育
- 电力、石油与能源等行业市场

![image-20240122221238756](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401222212296.png)

## 2.MQTT协议原理

### 2.1 MQTT协议实现方式

实现MQTT协议需要客户端和服务器端通讯完成，在通讯过程中，MQTT协议中有三种身份：发布者(Publish)、代理(Broker)  (服务器)、订阅者(Subscribe)。其中，消息的发布者和订阅者都是客户端，消息代理是服务器，消息发布者可以同时是订阅者。

MQTT传输的消息分为：主题(Topic)和负载(payload)两部分：

●(1)Topic,可以理解为消息的类型，订阅者订阅(Subscribe)后，就会收到该主题的消息内容(payload);

●(2)payload,可以理解为消息的内容，是指订阅者具体要使用的内容。

### 2.2 网络传输与应用消息

MQTT会构建底层网络传输：它将建立客户端到服务器的连接，提供两者之间的一个有序的、无损的、基于字节流的双向传输。
当应用数据通过MQTT网络发送时，MQTT会把与之相关的服务质量(QoS)和主题名(Topic)相关连。

### 2.3 MQTT客户端

一个使用MQTT协议的应用程序或者设备，它总是建立到服务器的网络连接。客户端可以：

●(1)发布其他客户端可能会订阅的信息；

●(2)订阅其它客户端发布的消息；

●(3)退订或删除应用程序的消息；

●(4)断开与服务器连接。

### 2.4 MQTT服务器端

MQTT服务器以称为"消息代理"(Broker),可以是一个应用程序或一台设备。它是位于消息发布者和订阅者之间，它可以：

●(1)接受来自客户的网络连接；

●(2)接受客户发布的应用信息；

●(3)处理来自客户端的订阅和退订请求；

●(4)向订阅的客户转发应用程序消息。

### 2.5发布/订阅、主题、会话

​	MQTT是基于**发布(Publish)/订阅(Subscribe)**模式来进行通信及数据交换的，与HTTP**的请求(Request)/应答(Response)**的模式有本质的不同。
​	订阅者(Subscriber)会向**消息服务器(Broker)**订阅一个主题(Topic)。成功订阅后，消息服务器会将该主题下的消息转发给所有的订阅者。
​	主题(Topic)以/为分隔符区分不同的层级。包含通配符'+'或'#的主题又称为**主题过滤器(Topic Filters)**;不含通配符的称为**主题名(Topic Names)**例如：

```shell
chat/room/1

sensor/10/temperature

sensor/+/temperature

$SYS/broker/metrics/packets/received

$SYS/broker/metrics/#
```

'+':表示通配一个层级，例如a/+,匹配a/x,a/y
'#':表示通配多个层级，例如a/#,匹配a/x,a/b/c/d

注：‘+’通配一个层级，’#’通配多个层级(必须在末尾)。

发布者(Publisher)只能向‘主题名’发布消息，订阅者(Subscriber)则可以通过订阅'主题过滤器'来通配多个主题名称。

**会话(Session)**

每个客户端与服务器建立连接后就是一个会话，客户端和服务器之间有状态交互。会话存在于一个网络之间，也可能在客户端和服务器之间跨越多个连续的网络连接。

### 2.6 MQTT协议中的方法

​	MQTT协议中定义了一些方法(也被称为动作),来于表示对确定资源所进行操作。这个资源可以代表预先存在的数据或动态生成数据，这取决于服务器的实现。通常来说，资源指服务器上的文件或输出。主要方法有：

●     (1)CONNECT:客户端连接到服务器

●      (2)CONNACK:连接确认

●      (3)PUBLISH:发布消息

●      (4)PUBACK:发布确认

●      (5)PUBREC:发布的消息已接收

●     (6)PUBREL:发布的消息已释放

●     (7)PUBCOMP:发布完成

●     (8)SUBSCRIBE:订阅请求

●     (9)SUBACK:订阅确认

●     (10)UNSUBSCRIBE:取消订阅

●     (11)UNSUBACK:取消订阅确认

●    (12)PINGREQ:客户端发送心跳

●    (13)PINGRESP:服务端心跳响应

●    (14)DISCONNECT:断开连接

●    (15)AUTH:认证

## 3.MQTT协议数据包结构

官方文档中对于MQTT协议包的结构有着具体的说明：http://mqtt.org/documentation
在MQTT协议中，一个MQTT数据包由：固定头(Fixed header)、可变头(Variable header)、消息体(payload)三部分构成。MQTT数据包结构如下：

![image-20240229161728614](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202402291617933.png)

- (1)固定头(Fixed header)。存在于所有MQTT数据包中，表示数据包类型及数据包的分组类标识，如连接，发布，订阅，心跳等。其中固定头是必须的，所有类型的MQTT协议中，都必须包含固定头。
- (2)可变头(Variable header)。存在于部分MQTT数据包中，数据包类型决定了可变头是否存在及其具体内容。可变头部不是可选的意思，而是指这部分在有些协议类型中存在，在有些协议中不存在。
- (3)消息体(Payload)。存在于部分MQTT数据包中，表示客户端收到的具体内容。与可变头一样，在有些协议类型中有消息内容，有些协议类型中没有消息内容。

### 3.1固定头(Fixed header)

![image-20240122222900415](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401222229773.png)

​	固定头存在于所有MQTT数据包中，固定头包含两部分内容，首字节(字节1)和剩余消息报文长度(从第二个字节开始，长度为1-4字节),剩余长度是当前包中剩余内容长度的字节数，包括变量头和有效负载中的数据)。剩余长度不包含用来编码剩余长度的字节。

​	剩余长度使用了一种可变长度的结构来编码，这种结构使用单一字节表示0-127的值。大于127的值如下处理。每个字节的低7位用来编码数据，最高位用来表示是否还有后续字节。因此每个字节可以编码128个值，再加上一个标识位。剩余长度最多可以用四个字节来表示。

**数据包类型**
位置：第一个字节(Byte 1)中的7-4个bit位(Bit[7-4]),表示4位无符号值
通过第一个字节的高4位确定消息报文的类型，4个bit位能确定16种类型，其中0000和1111是保留字段。MQTT消息报文类型如下：

![image-20240122223319158](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401222233392.png)

![image-20240122223602937](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401222236350.png)

<img src="https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401222239308.png" alt="image-20240122223929543" style="zoom:80%;" />

![image-20240122224021916](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401222240910.png)

![image-20240122224213454](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401222242793.png)

![image-20240122224326691](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401222243817.png)

![image-20240122224610931](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401222246762.png)

![image-20240122224651570](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401222246362.png)

![image-20240122224826043](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401222248947.png)



![image-20240122225514442](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401222255449.png)

![image-20240122225257923](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401222253214.png)

![image-20240122230041623](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401222300636.png)

![image-20240122230139796](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401222301683.png)

![image-20240122230237958](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401222302943.png)

![image-20240122231222743](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401222312023.png)

![image-20240122231439452](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401222314217.png)

**总结**：我们介绍了MQTT协议的消息格式，MQTT消息格式包含Fixed Header,Variable Header和Payload。因为MQTT消息格式非常精简，所以可以高效的传输数据。

Fixed Header中包含首字节，高4位用来表示报文类型，低4位用于类型控制。目前只有PUBLISH使用了类型控制字段。其它控制字段被保留并且必须与协议定义保持一致。

Fixed Header同时包含Remaining Length,这是剩余消息长度，最大长度为4字节，理论上一条MQTT最大可以传输256MB数据。Remaining Length=Variable Header+Payload长度。

Variable Header是可变头部，有些报文类型中需要包含可变头部，可变头部根据报文类型不同而不同。比如Packet Identifier在发布，订阅/取消订阅等报文中都使用到。

Payload是消息内容，也只在某些报文类型中出现，其内容和格式也根据报文类型不同而不同。

## 4.EMQX简介

​	MQTT属于是物联网的通信协议，在MQTT协议中有两大角色：客户端(发布者/订阅者),服务端(Mqttbroker);针对客户端和服务端需要有遵循该协议的的具体实现，EMQ/EMQ X就是MQTT Broker的一种实现。

​	EMQ官网：https://www.emqx.io/cn/

### 4.1 EMQ X是什么

​	EMQX基于Erlang/OTP平台开发的MQTT消息服务器，是开源社区中最流行的MQTT消息服务器。

​	EMQX是开源百万级分布式MQTT消息服务器(MQTT Messaging Broker),用于支持各种接入标准MQTT协议的设备，实现从设备端到服务器端的消息传递，以及从服务器端到设备端的设备控制消息转发。从而实现物联网设备的数据采集，和对设备的操作和控制。

### 4.2为什么选择EMQ X

到目前为止，比较流行的MQTT Broker有几个：

1.Eclipse Mosquitto:https://github.com/eclipse/mosquitto
	使用C语言实现的MQTT Brgker。Eclipse组织还还包含了大量的MQTT客户端项目：https://www.eclipse.org/paho/#

2.EMQX:https://github.com/emqx/emqx

3.使用Erlang语言开发的MQTT Broker,支持许多其他IoT协议比如CoAP、LwM2M等Mosca:https://github.com/mcollina/mosca使用Node.JS开发的MQTT Broker,简单易用。

4.VerneMQ:https://github.com/vernemq/vernemq同样使用Erlang开发的MQTT Broker

   从支持MQTT5.0、稳定性、扩展性、集群能力等方面考虑，EMQX的表现应该是最好的。

 与别的MQTT服务器相比**EMQX主要有以下的特点**：

 ●     经过100+版本的迭代，EMQX目前为开源社区中最流行的MQTT消息中间件，在各种客户严格的生产环境上经受了严苛的考验；

 ●    EMQX支持丰富的物联网协议，包括MQTT、MQTT-SN、CoAP、LwM2M、LoRaWAN和WebSocket等；

 ●    优化的架构设计，支持超大规模的设备连接。企业版单机能支持百万的MQTT连接；集群能支持千万级别的MQTT连接；

 ●    易于安装和使用；

 ●    灵活的扩展性，支持企业的一些定制场景；

 ●    中国本地的技术支持服务，通过微信、QQ等线上渠道快速响应客户需求；

 ●    基于Apache 2.0协议许可，完全开源。EMQX的代码都放在Github中，用户可以查看所有源代码。

 ●    EMQX3.0支持MQTT 5.0协议，是开源社区中第一个支持5.0协议规范的消息服务器，并且完全兼容MQTTV3.1和V3.1.1协议。除了MQTT协议之外，EMQX还支持别的一些物联网协议

 ●    单机支持百万连接，集群支持千万级连接；毫秒级消息转发。EMQX中应用了多种技术以实现上述功能，

 - 利用Erlang/OTP平台的软实时、高并发和容错(电信领域久经考验的语言)
 - 全异步架构
 - 连接、会话、路由、集群的分层设计
 - 消息平面和控制平面的分离等

 ●    扩展模块和插件，EMQX提供了灵活的扩展机制，可以实现私有协议、认证鉴权、数据持久化、桥接转发和管理控制台等的扩展

 ●    桥接：EMQX可以跟别的消息系统进行对接，比如EMQXEnterprise版本中可以支持将消息转发到Kafka、RabbitMQ或者别的EMQ节点等

 ●    共享订阅：共享订阅支持通过负载均衡的方式在多个订阅者之间来分发MQTT消息。比如针对物联网等数据采集场景，会有比较多的设备在发送数据，通过共享订阅的方式可以在订阅端设置多个订阅者来实现这几个订阅者之间的工作负载均衡

### 4.3 EMQX与物联网平台的关系是什么

​	典型的物联网平台包括设备硬件、数据采集、数据存储、分析、Web/移动应用等。EMQX位于数据采集这一层，分别与硬件和数据存储、分析进行交互，是物联网平台的核心：前端的硬件通过MQTT协议与位于数据采集层的EMQX交互，通过EMQX将数据采集后，通过EMQX提供的数据接口，将数据保存到后台的持久化平台中(各种关系型数据库和NOSQL数据库),或者流式数据处理框架等，上层应用通过这些数据分析后得到的结果呈现给最终用户。

### 4.4 EMQX有哪些产品

​	EMQX公司主要提供三个产品，可在官网首页产品导航查看每一种产品；主要体现在支持的连接数量、产品功能和商业服务等方面的区别：

●    EMQX Broker:EMQX开源版，完整支持MQTTV3.1.1/V5.0协议规范，完整支持TCP、TLS、WebSocket连接，支持百万级连接和分布式集群架构；LDAP,MySQL,Redis,MongoDB等扩展插件集成，支持插件模式扩展服务器功能；支持跨Linux、Windows、macOS平台安装，支持公有云、私有云、K8S/容器部署

●    EMQXEnterprise:EMQX企业版，在开源版基础上，支持物联网主流协议MQTT、MQTT-SN、CoAP/LWM2M、HTTP、WebSocket-站式设备接入；JT-808/GBT-32960等行业协议支持，基于TCP/UDP私有协议的旧网设备接入兼容，多重安全机制与认证鉴权；高并发软实时消息路由；强大灵活的内置规则引擎；企业服务与应用集成；多种数据库持久化支持；消息变换桥接转发Kafka;管理监控中心

●    EMQXPlatform:EMQX平台版，EMQXPlatform是面向千万级超大型IoT网络和应用，全球首选电信级物联网终端接入解决方案。千万级大容量；多物联网协议；电信级高可靠；卓越5G网络支持；跨云跨IDC部署；兼容历史系统；完善的咨询服务(从咨询到运维)

### 4.5 EMQX消息服务器功能列表

### 4.6 EMQ X服务端环境搭建与配

#### 4.6.1安装

EMQX目前支持的操作系统：

Centos6

Centos7

OpenSUSE 

tumbleweed

Debian 8

Debian 9

Debian 10

Ubuntu 14.04

Ubuntu 16.04

Ubuntu 18.04

macOS 10.13

macOS 10.14

macOS 10.15

Windows Server 2019

![image-20240302100820649](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202403021008890.png)

![image-20240302101056623](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202403021010731.png)