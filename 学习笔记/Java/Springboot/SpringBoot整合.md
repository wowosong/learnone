## 一、 Spring Boot与缓存

### 一、 JSR107

Java Caching定义了5个核心接口，分别是CachingProvider, CacheManager, Cache, Entry 和 Expiry。

* CachingProvider定义了创建、配置、获取、管理和控制多个CacheManager。一个应用可以在运行期访问多个CachingProvider。
* CacheManager定义了创建、配置、获取、管理和控制多个唯一命名的Cache，这些Cache存在于CacheManager的上下文中。一个CacheManager仅被一个CachingProvider所拥有。
* Cache是一个类似Map的数据结构并临时存储以Key为索引的值。一个Cache仅被一个CacheManager所拥有。
* Entry是一个存储在Cache中的key-value对。
* Expiry 每一个存储在Cache中的条目有一个定义的有效期。一旦超过这个时间，条目为过期的状态。一旦过期，条目将不可访问、更新和删除。缓存有效期可以通过ExpiryPolicy设置。

![image-20220117222233535](https://gitee.com/wowosong/pic-md/raw/master/20220117222233.png)

### 二、Spring缓存抽象

Spring从3.1开始定义了org.springframework.cache.Cache
和org.springframework.cache.CacheManager接口来统一不同的缓存技术；
并支持使用JCache（JSR-107）注解简化我们开发；

* Cache接口为缓存的组件规范定义，包含缓存的各种操作集合；
* Cache接口下Spring提供了各种xxxCache的实现；如RedisCache，EhCacheCache , ConcurrentMapCache等；
* 每次调用需要缓存功能的方法时，Spring会检查检查指定参数的指定的目标方法是否已经被调用过；如果有就直接从缓存中获取方法调用后的结果，如果没有就调用方法并缓存结果后返回给用户。下次调用直接从缓存中获取。
* 使用Spring缓存抽象时我们需要关注以下两点；
  1、确定方法需要被缓存以及他们的缓存策略
  2、从缓存中读取之前缓存存储的数据

![image-20220117222402373](https://gitee.com/wowosong/pic-md/raw/master/20220117222402.png)

### 三、几个重要概念&缓存注解

| **Cache**          | **缓存接口，定义缓存操作。实现有：**RedisCache**、**EhCacheCache**、**ConcurrentMapCache**等** |
| ------------------ | ------------------------------------------------------------ |
| **CacheManager**   | **缓存管理器，管理各种缓存（**Cache）组件                    |
| **@Cacheable**     | **主要针对方法配置，能够根据方法的请求参数对其结果进行缓存** |
| **@CacheEvict**    | **清空缓存**                                                 |
| **@CachePut**      | **保证方法被调用，又希望结果被缓存。**                       |
| **@EnableCaching** | **开启基于注解的缓存**                                       |
| **keyGenerator**   | **缓存数据时key生成策略**                                    |
| **serialize**      | **缓存数据时value序列化策略**                                |

| **@Cacheable<br/>@CachePut<br/>@CacheEvict**<br/> **主要的参数** |                                                              |                                                              |
| ------------------------------------------------------------ | ------------------------------------------------------------ | ------------------------------------------------------------ |
| value                                                        | 缓存的名称，在 spring 配置文件中定义，必须指定至少一个       | 例如：@Cacheable(value=”mycache”) <br/>或者 @Cacheable(value={”cache1”,”cache2”} |
| key                                                          | 缓存的 key，可以为空，如果指定要按照 SpEL 表达式编写，如果不指定，则缺省按照方法的所有参数进行组合 | 例如：@Cacheable(value=”testcache”,<br/>key=”#userName”)     |
| condition                                                    | 缓存的条件，可以为空，使用 SpEL 编写，返回 true 或者 false，只有为 true 才进行缓存/清除缓存，在调用方法之前之后都能判断 | 例如：@Cacheable(value=”testcache”,<br/>condition=”#userName.length()>2”) |
| allEntries (**@CacheEvict** )                                | 是否清空所有缓存内容，缺省为 false，如果指定为 true，则方法调用后将立即清空所有缓存 | 例如：@CachEvict(value=”testcache”,<br/>allEntries=true)     |
| beforeInvocation **(@CacheEvict)**                           | 是否在方法执行前就清空，缺省为 false，如果指定为 true，则在方法还没有执行的时候就清空缓存，缺省情况下，如果方法执行抛出异常，则不会清空缓存 | 例如： @CachEvict(value=”testcache”，beforeInvocation=true)  |
| unless **(@CachePut) (@Cacheable)**                          | 用于否决缓存的，不像condition，该表达式只在方法执行之后判断，此时可以拿到返回值result进行判断。条件为true不会缓存，fasle才缓存 | 例如：@Cacheable(value=”testcache”,<br/>unless=”#result == null”) |

**Cache SpEL available metadata**

| **名字**      | **位置**           | **描述**                                                     | **示例**             |
| ------------- | ------------------ | ------------------------------------------------------------ | -------------------- |
| methodName    | root object        | 当前被调用的方法名                                           | #root.methodName     |
| method        | root object        | 当前被调用的方法                                             | #root.method.name    |
| target        | root object        | 当前被调用的目标对象                                         | #root.target         |
| targetClass   | root object        | 当前被调用的目标对象类                                       | #root.targetClass    |
| args          | root object        | 当前被调用的方法的参数列表                                   | #root.args[0]        |
| caches        | root object        | 当前方法调用使用的缓存列表（如@Cacheable(value={"cache1", "cache2"})），则有两个cache | #root.caches[0].name |
| argument name | evaluation context | 方法参数的名字. 可以直接 #参数名 ，也可以使用 #p0或#a0 的形式，0代表参数的索引； | #iban 、 #a0 、 #p0  |
| result        | evaluation context | 方法执行后的返回值（仅当方法执行之后的判断有效，如‘unless’，’cache put’的表达式 ’cache evict’的表达式beforeInvocation=false） | #result              |

### 四、缓存使用

1、引入spring-boot-starter-cache模块
2、@EnableCaching开启缓存
3、使用缓存注解
4、切换为其他缓存

### 五、整合redis实现缓存

1. 引入spring-boot-starter-data-redis
2. application.yml配置redis连接地址
3. 使用RestTemplate操作redis
   1. redisTemplate.opsForValue();//操作字符串
   2. redisTemplate.opsForHash();//操作hash
   3. redisTemplate.opsForList();//操作list
   4. redisTemplate.opsForSet();//操作set
   5. redisTemplate.opsForZSet();//操作有序set
4. 配置缓存、CacheManagerCustomizers
5. 测试使用缓存、切换缓存、 CompositeCacheManager

## 二、Spring Boot与消息(JMS、 AMQP、 RabbitMQ)

### 一、概述

* 大多应用中，可通过消息服务中间件来提升系统异步通信、扩展解耦能力

* 消息服务中两个重要概念：
         消息代理（message broker）和目的地（destination）
  当消息发送者发送消息以后，将由消息代理接管，消息代理保证消息传递到指定目的地。
* 消息队列主要有两种形式的目的地
  * 队列（queue）：点对点消息通信（point-to-point）
  * 主题（topic）：发布（publish）/订阅（subscribe）消息通信

![image-20220117233429841](https://gitee.com/wowosong/pic-md/raw/master/20220117233430.png)

![image-20220117233451041](https://gitee.com/wowosong/pic-md/raw/master/20220117233451.png)

* 点对点式：
  - 消息发送者发送消息，消息代理将其放入一个队列中，消息接收者从队列中获取消息内容，消息读取后被移出队列
  - 消息只有唯一的发送者和接受者，但并不是说只能有一个接收者
* 发布订阅式：
  - 发送者（发布者）发送消息到主题，多个接收者（订阅者）监听（订阅）这个主题，那么就会在消息到达时同时收到消息
* JMS（Java Message Service）JAVA消息服务：
  - 基于JVM消息代理的规范。ActiveMQ、HornetMQ是JMS实现
* AMQP（Advanced Message Queuing Protocol）
  - 高级消息队列协议，也是一个消息代理的规范，兼容JMS
  - RabbitMQ是AMQP的实现

|              | JMS                                                          | AMQP                                                         |
| ------------ | ------------------------------------------------------------ | ------------------------------------------------------------ |
| 定义         | Java api                                                     | 网络线级协议                                                 |
| 跨语言       | 否                                                           | 是                                                           |
| 跨平台       | 否                                                           | 是                                                           |
| Model        | 提供两种消息模型：（1）、Peer-2-Peer（2）、Pub/sub           | 提供了五种消息模型：<br/>（1）、direct exchange<br/>（2）、fanout exchange<br/>（3）、topic change<br/>（4）、headers exchange<br/>（5）、system exchange本质来讲，后四种和JMS的pub/sub模型没有太大差别，仅是在路由机制上做了更详细的划分； |
| 支持消息类型 | 多种消息类型：TextMessage<br/>MapMessage<br/>BytesMessage<br/>StreamMessage<br/>ObjectMessageMessage （只有消息头和属性） | byte[]当实际应用时，有复杂的消息，可以将消息序列化后发送。   |
| 综合评价     | JMS 定义了JAVA API层面的标准；在java体系中，<br/>多个client均可以通过JMS进行交互，不需要应用修改代码，但是其对跨平台的支持较差； | AMQP定义了wire-level层的协议标准；天然具有跨平台、跨语言特性。 |

* Spring支持
  - spring-jms提供了对JMS的支持
  - spring-rabbit提供了对AMQP的支持
  - 需要ConnectionFactory的实现来连接消息代理
  - 提供JmsTemplate、RabbitTemplate来发送消息
  - @JmsListener（JMS）、@RabbitListener（AMQP）注解在方法上监听消息代理发布的消息
  - @EnableJms、@EnableRabbit开启支持
* Spring Boot自动配置
	- JmsAutoConfiguration
  - RabbitAutoConfiguration

### 二、RabbitMQ简介

**RabbitMQ简介**：
RabbitMQ是一个由erlang开发的AMQP(Advanved Message Queue Protocol)的开源实现。

**核心概念**
Message
消息，消息是不具名的，它由消息头和消息体组成。消息体是不透明的，而消息头则由一系列的可选属性组成，这些属性包括routing-key（路由键）、priority（相对于其他消息的优先权）、delivery-mode（指出该消息可能需要持久性存储）等。

**Publisher**
消息的生产者，也是一个向交换器发布消息的客户端应用程序。

**Exchange**
交换器，用来接收生产者发送的消息并将这些消息路由给服务器中的队列。
Exchange有4种类型：direct(默认)，fanout, topic, 和headers，不同类型的Exchange转发消息的策略有所区别

**Queue**
消息队列，用来保存消息直到发送给消费者。它是消息的容器，也是消息的终点。一个消息可投入一个或多个队列。消息一直在队列里面，等待消费者连接到这个队列将其取走。

**Binding**
绑定，用于消息队列和交换器之间的关联。一个绑定就是基于路由键将交换器和消息队列连接起来的路由规则，所以可以将交换器理解成一个由绑定构成的路由表。
Exchange 和Queue的绑定可以是多对多的关系。

**Connection**
网络连接，比如一个TCP连接。

**Channel**
信道，多路复用连接中的一条独立的双向数据流通道。信道是建立在真实的TCP连接内的虚拟连接，AMQP 命令都是通过信道发出去的，不管是发布消息、订阅队列还是接收消息，这些动作都是通过信道完成。因为对于操作系统来说建立和销毁 TCP 都是非常昂贵的开销，所以引入了信道的概念，以复用一条 TCP 连接。

**Consumer**
消息的消费者，表示一个从消息队列中取得消息的客户端应用程序。

**Virtual Host**
虚拟主机，表示一批交换器、消息队列和相关对象。虚拟主机是共享相同的身份认证和加密环境的独立服务器域。每个 vhost 本质上就是一个 mini 版的 RabbitMQ 服务器，拥有自己的队列、交换器、绑定和权限机制。vhost 是 AMQP 概念的基础，必须在连接时指定，RabbitMQ 默认的 vhost 是 / 。

**Broker**
表示消息队列服务器实体

![image-20220117234131378](https://gitee.com/wowosong/pic-md/raw/master/20220117234131.png)

### 三、RabbitMQ运行机制

AMQP 中的消息路由

* AMQP 中消息的路由过程和 Java 开发者熟悉的 JMS 存在一些差别，AMQP 中增加了 Exchange 和 Binding 的角色。生产者把消息发布到 Exchange 上，消息最终到达队列并被消费者接收，而 Binding 决定交换器的消息应该发送到那个队列。

<img src="https://gitee.com/wowosong/pic-md/raw/master/20220117234117.png" alt="image-20220117234117408" style="zoom:67%;" />

#### Exchange 类型

* Exchange分发消息时根据类型的不同分发策略有区别，目前共四种类型：direct、fanout、topic、headers 。headers 匹配 AMQP 消息的 header 而不是路由键， headers 交换器和 direct 交换器完全一致，但性能差很多，目前几乎用不到了，所以直接看另外三种类型：

<img src="https://gitee.com/wowosong/pic-md/raw/master/20220117234231.png" alt="image-20220117234231798" style="zoom:67%;" />

消息中的路由键（routing key）如果和 Binding 中的 binding key 一致， 交换器就将消息发到对应的队列中。路由键与队列名完全匹配，如果一个队列绑定到交换机要求路由键为“dog”，则只转发 routing key 标记为“dog”的消息，不会转发“dog.puppy”，也不会转发“dog.guard”等等。它是完全匹配、单播的模式。

<img src="https://gitee.com/wowosong/pic-md/raw/master/20220117234322.png" alt="image-20220117234322249" style="zoom:50%;" />

每个发到 fanout 类型交换器的消息都会分到所有绑定的队列上去。fanout 交换器不处理路由键，只是简单的将队列绑定到交换器上，每个发送到交换器的消息都会被转发到与该交换器绑定的所有队列上。很像子网广播，每台子网内的主机都获得了一份复制的消息。fanout 类型转发消息是最快的。

<img src="https://gitee.com/wowosong/pic-md/raw/master/20220117234357.png" alt="image-20220117234357568" style="zoom:50%;" />

topic 交换器通过模式匹配分配消息的路由键属性，将路由键和某个模式进行匹配，此时队列需要绑定到一个模式上。它将路由键和绑定键的字符串切分成单词，这些单词之间用点隔开。它同样也会识别两个通配符：符号“#”和符号“*”。#匹配0个或多个单词，*匹配一个单词。

### 四、RabbitMQ整合

* 引入 spring-boot-starter-amqp
* application.yml配置
* 测试RabbitMQ
  - AmqpAdmin：管理组件
  - RabbitTemplate：消息发送处理组件

![image-20220117234459577](https://gitee.com/wowosong/pic-md/raw/master/20220117234459.png)