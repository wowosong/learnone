# 10.Spring CloudAlibaba:

**之所以有Spring CloudAlibaba，是因为Spring Cloud Netflix项目进入维护模式，也就是，就不是不更新了，不会开发新组件了，所以，某些组件都有代替版了，比如Ribbon由Loadbalancer代替，等等**

**支持的功能**

- **服务限流降级**：默认支持Servlet、Feign、RestTemplate、Dubbo和RocketMQ限流降级功能的接入，可以在运行时通过控制台实时修改限流降级规则，还支持查看限流降级Metrics监控。
- **服务注册与发现**：适配Spring Cloud服务注册与发现标准，默认集成了Ribbon的支持。
- **分布式配置管理**：支持分布式系统中的外部化配置，配置更改时自动刷新。
- **消息驱动能力**：基于Spring Cloud Stream为微服务应用构建消息驱动能力。
- **阿里云对象存储**：阿里云提供的海量、安全、低成本、高可靠的云存储服务。支持在任何应用、任何时间、任何地点存储和访问任意类型的数据。
- **分布式任务调度**：提供秒级、精准、高可靠、高可用的定时（基于Cron表达式）任务调度服务。同时提供分布式的任务执行模型，如网格任务。网格任务支持海量子任务均匀分配到所有Worker(schedulerx-client)上执行。

几乎可以将之前的Spring Cloud代替

**具体组件**:

**Sentinel**

阿里巴巴开源产品，把流量作为切入点，从流量控制、熔断降级、系统负载保护等多个维度保护服务的稳定性。

**Nacos**

阿里巴巴开源产品，一个更易于构建云原生应用的动态服务发现、配置管理和服务管理平台。

**RocketMQ**

Apache RocketMQ 基于Java的高性能、高吞吐量的分布式消息和流计算平台。

**Dubbo**

Apache Dubbo是一个高性能的Java RPC框架。

**Seata**

阿里巴巴开源产品，一个易于使用的高性能微服务分布式事务解决方案。

**Alibaba Cloud OSS**

阿里云对象存储服务（Object Storage Service，简称OSS)，是阿里云提供的海量、安全、低成本、高可靠的云存储服务。您可以在认可应用、任何时间、任何地点存储和访问任意类型的数据。

## Nacos:

**服务注册和配置中心的组合**

 Nacos\=erueka\+config\+bus

### 安装Nacos:

需要java8 和 Maven

**1，到github上下载安装包**

 解压安装包

**2，启动Nacos**

 在bin下，进入cod

\./startup.cmd

**3，访问Nacos**

 Nacos默认监听8848

 localhost:8848/nacos

 账号密码:默认都是nacos

### 使用Nacos:

新建pay模块

**现在不需要额外的服务注册模块了，Nacos单独启动了**

名字: cloudalibaba\-pay\-9001

#### 1，pom

父项目管理alibaba的依赖:

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071626517.png) 

```xml
<dependency>
        <groupId>com.alibaba.cloud</groupId>
        <artifactId>spring-cloud-alibaba-dependencies</artifactId>
        <version>2.1.0.RELEASE</version>
        <type>pom</type>
        <scope>import</scope>
      </dependency>
```

9001的pom:

 另外一个文件.....

#### 2，配置文件

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071626304.png) 

#### 3，启动类

```java
@SpringBootApplication
@EnableDiscoveryClient
public class AlibabaPayment9001 {
    public static void main(String[] args) {
        SpringApplication.run(AlibabaPayment9001.class,args);
    }
} 
```

#### 4，controller:

```java
@RestController
@Slf4j
public class paymentController {
    @Value("${server.port}")
    private  String serverPort;
    @GetMapping("/payment/nacos")
    public String getFromNacos(){
        log.info("The info from nacos port:{}",serverPort);
        return "The info from nacos port: "+serverPort;
    }
}
```

#### 5，测试

启动9001

然后查看Nacos的web界面，可以看到9001已经注册成功

### 创建其他Pay模块

 额外在创建9002，9003

 直接复制上面的即可

### 创建order模块

名字:  cloudalibaba\-order\-83

#### 1，pom

**为什么Nacos支持负载均衡?**

 Nacos直接集成了Ribon，所以有负载均衡

#### 2，配置文件

```yml
server:
	port:83
spring:
	application
		name:nacos-order-consumer
	cloud:
		nacos:
			discovery:
				server-addr:localhost:8848
#消费者将要去访问的微服务名称(注册成功nacos的微服务提供者)
service-url:
	nacos-user-service:http://nacos-payment-provider 
```

**这个server-url的作用是，我们在controller，需要使用RestTempalte远程调用9001，这里是指定9001的地址**

#### 3，主启动类

```java
@SpringBootApplication
@EnableDiscoveryClient
public class AlibabaPayment9002 {
    public static void main(String[] args) {
        SpringApplication.run(AlibabaPayment9002.class,args);
    }
} 
```

#### 4，编写配置类

 **因为Naocs要使用Ribbon进行负载均衡，那么就需要使用RestTemplate**

```java
@Configuration
public class NacosConfig {
    @Bean
    @LoadBalanced
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }
}
```

#### 5，controller:

```java
@RestController
@Slf4j
public class Order83Controller {
    @Resource
    private RestTemplate restTemplate;
    @Value("${service-url.nacos-user-service}")
    private String serviceUrl;
    @Autowired
    private PaymentService paymentService;
    @GetMapping("/consumer/payment/nacos")
    public String getServerPort(){
        return restTemplate.getForObject(serviceUrl+"/payment/nacos"， String.class);
    }
    @GetMapping("/consumer/payment/nacosfeign")
    public String getServerPort1(){
        return paymentService.getFromNacos();
    }

}
```

#### 6，测试

启动83，访问9001，9002，可以看到，实现了负载均衡

### Nacos与其他服务注册的对比

Nacos它既可以支持CP，也可以支持AP，可以切换

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071628916.png)

<span style="color:blue">**何时选择使用何种模式？**</span>

一般来说，如果不需要存储服务级别的信息且服务实例是通过nacos-client注册，并能够保存心跳上报，那么就可以选择AP模式。当前主流的服务如Spring Cloud和Dubbo服务，都适用于AP模式，AP模式为了服务的可能性而减弱了一致性，因此AP模式下只支持注册临时实例。

如果需要在服务级别编辑或存储配置信息，那么CP是必须，K8S服务和DNS服务则适用于CP模式。

CP模式下则支持注册持久化实例，此时则是以Raft协议为集群运行模式，该模式下注册实例之前必须先注册服务，如果服务不存在，则会返回错误。

**下面这个curl命令，就是切换模式**

```shell
curl -X PUT '$NACOS_SERVER:8848/nacos/v1/ns/operator/switches?entry=serverMode&value=CP'
```

### 使用Nacos作为配置中心:

**Nacos同Spring Cloud Config一样，在项目初始化时，要保证先从配置中心进行配置拉取，拉取配置之后，才能保证项目的正常启动**
**SpringBoot中配置文件的加载是存在优先级顺序的，bootstrap优先级高于application**

**需要创建配置中心的客户端模块**

cloudalibaba\-Nacos\-config\-client\-3377

#### 1.pom

#### 2.配置文件

这里需要配置两个配置文件，application\.yml和bootstarp\.yml

 主要是为了可以与spring cloud config无缝迁移

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071628380.png) 

```java
可以看到
```

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071628198.png) 

#### 3.主启动类

```java
@SpringBootApplication
@EnableDiscoveryClient
public class AlibabaNacosConfigMain3377 {
    public static void main(String[] args) {
        SpringApplication.run(AlibabaNacosConfigMain3377.class,args);
    }
} 
```

#### 4.controller

```java
@RestController
@Slf4j
@RefreshScope //支持Nacos的动态刷新功能
public class NacosConfigController {
   
    @Value("${configInfo.info}")
    private String info;
  
    @GetMapping("/getConfigInfo")
    public String getConfigInfo(){
        return "ConfigInfo: "+info;
    }
} 
```

**可以看到，这里也添加了@RefreshScope**
**之前在Config配置中心，也是添加这个注解实现动态刷新的**

**通过Spring Cloud原生注解<span style="color:blue">@RefreshScope</span>实现配置自动更新**

#### 5，在Nacos添加配置信息:

**Nacos的配置规则:**

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071628118.png)

**配置规则，就是我们在客户端如何指定读取配置文件，配置文件的命名的规则**

默认的命名方式:

```yml
${prefix}-${spring.profile.active}.${file-extension} 
```

```yml
prefix:
    默认就是当前服务的服务名称
    也可以通过spring.cloud.necos.config.prefix配置
    spring.profile.active:
    就是我们在application.yml中指定的，当前是开发环境还是测试等环境
    这个可以不配置，如果不配置，那么前面的-也会没有
    file-extension
    就是当前文件的格式(后缀)，目前只支持yml和properties
```

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071628438.png)

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071629762.png)

**在web UI上创建配置文件:**

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071629018.png)

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071629498.png)

注意，DataId就是配置文件名字:

 名字一定要按照上面的规则命名，否则客户端会读取不到配置文件

#### 6，测试

重启3377客户端

访问3377

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071630709.png) 

**拿到了配置文件中的值**

#### 7，注意默认就开启了自动刷新

此时我们修改了配置文件

客户端是可以立即更新的

 因为Nacos支持Bus总线，会自动发送命令更新所有客户端

### Nacos配置中心之分类配置:

**问题1：**

实际开发中，通常一个系统会准备

- dev开发环境

- test测试环境

- prod生产环境

如何保证指定环境启动时服务能正确读取到Nacos上相应环境的配置文件呢？

**问题2：**

一个大型分布式微服务系统会有很多微服务子项目，每个微服务项目又都会有相应的开发环境、测试环境、预发环境、正式环境....

那怎么对这些微服务配置进行管理呢？

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071630349.png)

**Namespace\+Group\+Data ID三者关系？为什么这么设计？** 

NameSpace默认有一个：public名称空间

这三个类似java的: 包名 \+ 类名 \+ 方法名

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071631139.png)

**默认情况：**
**Namespace=public,Group=DEFAULT_GROUP,默认Cluster是DEFAULT**

Nacos默认的命名空间是**public**,Namespace主要用来实现**隔离**。

比方说我们现在有三个环境：开发、测试、生产环境，我们就可以创建三个**Namespace，**不同的Namespace之间是隔离的。

Group默认是DEFAULT_GROUP,Group可以把**不同的微服务**划分到同一个分组里面去

Service就是微服务；一个Service可以包含多个Cluster(集群),**Nacos默认Cluster是DEFAULT，**Cluster是对指定微服务的一个虚拟划分。

比方说为了容灾，将Service微服务分别部署在了杭州机房和广州机房，

这时就可以给杭州机房的Service微服务起一个集群名称(HZ),

给广州机房的Service微服务起一个集群名称(GZ),还可以尽量让同一个机房的微服务互相调用，以提升性能。

#### 1，配置不同DataId:

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071631806.png)

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071631470.png)

**通过配置文件，实现多环境的读取:**

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071632044.png)

```java
此时，改为dev，就会读取dev的配置文件，改为test，就会读取test的配置文件
```

#### 2，配置不同的GroupID:

直接在新建配置文件时指定组

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071632496.png) 

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071632337.png) 

在客户端配置，使用指定组的配置文件:

```
bootstrap + application 
```

**这两个配置文件都要修改**

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071632029.png)

重启服务，即可

#### 配置不同的namespace:

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071632154.png)

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071632756.png)

客户端配置使用不同名称空间:

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071633190.png) 

**要通过命名空间id指定**

OK，测试

### Nacos集群和持久化配置:

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071633963.png)

Nacos默认有自带嵌入式数据库，derby，但是如果做集群模式的话，就不能使用自己的数据库

 不然每个节点一个数据库，那么数据就不统一了，需要使用外部的mysql

默认Nacos使用嵌入式数据库实现数据的存储。所以，如果启动多个默认配置下的Nacos节点，数据存储是存在一致性问题的。为了解决这个问题，Nacos采用了<span style="color:red">**集中式存储的方式来支持集群化部署，目前只支持Mysql的存储**</span>

**Nacos支持三种部署模式**

- 单机模式\- 用于测试和单机试用。
- 集群模式\-用于生产环境，确保高可用。
- 多集群模式\- 用于多数据中心场景。

#### 1，单机版，切换mysql数据库:

 **将nacos切换到使用我们自己的mysql数据库:**

**1，nacos默认自带了一个sql文件，在nacos安装目录下**

 将它放到我们的mysql执行

**2，修改Nacos安装目录下的安排application\.properties，添加:**

**数据库时区serverTimezone=UTC 可能会导致访问不到数据库**

```properties
spring.datasource.platform=mysql

db.num=1
db.url.O=jdbc:mysql://127.0.0.1:3306/nacos_config?characterEncoding=utf8&connectTimeout=1000&socketTimeout=3000&autoReconnect=true
db.user=root
db.password=123456
```

**3，此时可以重启nacos，那么就会改为使用我们自己的mysql**

#### Linux上配置Nacos集群+Mysql数据库

官方架构图:

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071633994.png)

**需要一个Nginx作为VIP**

1，下载安装Nacos的Linux版安装包

2，进入安装目录，现在执行自带的sql文件

 进入mysql，执行sql文件

3.修改配置文件，切换为我们的mysql

 就是上面windos版要修改的几个属性

```properties
### If use MySQL as datasource:

spring.datasource.platform=mysql

### Count of DB:

db.num=1

### Connect URL of DB:

db.url.0=jdbc:mysql://127.0.0.1:3306/nacos?characterEncoding=utf8&connectTimeout=1000&socketTimeout=3000&autoReconnect=true&useUnicode=true&useSSL=false
db.user=root
db.password=password
```

4，修改cluster\.conf，指定哪几个节点是Nacos集群

必须与Linux中hostname \- i 中的IP一致

 这里使用3333，4444，5555作为三个Nacos节点监听的端口

```properties
192.168.111.144:3333
192.168.111.144:4444
192.168.111.144:5555 
```

5，我们这里就不配置在不同节点上了，就放在一个节点上

 既然要在一个节点上启动不同Nacos实例，就要修改startup\.sh，使其根据不同端口启动不同Nacos实例

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071633505.png) 

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071634650.png) 

可以看到，这个脚本就是通过jvm启动nacos

 所以我们最后修改的就是，nohup java \-Dserver\.port\=3344

![image-20211128215704352](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071634113.png)

6，配置Nginx:

server后的IP填127.0.0.1

![image-20211128222208687](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071634360.png)

​            ![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071635348.png)

7，启动Nacos:

nacos2.0.3 版本不用修改port，直接复制实例文件，然后修改cluster.conf文件中的IP和端口

\./startup.sh -p 3333

 \./startup.sh -p 4444

 \./startup.sh -p 5555

![image-20211128222259008](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071635374.png)

7，启动nginx

8，测试:

 访问192.168.159.121:1111或http://127.0.0.1:8848/nacos/

 如果可以进入nacos的web界面，就证明安装成功了

9，将微服务注册到Nacos集群:

```yml
spring:
	application:
		name:nacos-payment-provider
	cloud:
		nacos:
			discovery:
				#server-addr:localhost:8848 #配置Nacos地址
				#换成nginx的1111端口，做集群
				server-addr:192.168.111.144:1111 
				#换成nginx的即可，由nginx代理到其中一个节点
```

10，进入Nacos的web界面

 可以看到，已经注册成功

![image-20211128224944538](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071635587.png)

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071635568.png)

## Sentinel:

实现熔断与限流，就是Hystrix

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071635230.png)

​    ![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071635892.png)

### 使用sentinel

1.下载sentinel的jar包

2.运行sentinel

 由于是一个jar包，所以可以直接java -jar运行

 注意，默认sentinel占用8080端口

3.访问sentinel

 localhost:8080

### 微服务整合sentinel

#### 1.启动Nacos

#### 2.新建一个项目8401，主要用于配置sentinel

1. pom

2. 配置文件

```yml
server:
	port:8401
spring:
    application:
		name:cloudalibaba-sentinel-service
	cloud:
		nacos:
			discovery:
                #Nacos服务注册中心地址
                server-addr:localhost:8848
		sentinel:
            transport:
                #配置Sentinel dashboard地址
                dashboard:localhost:8080
                #默认8719端口，假如被占用会自动从8719开始依次+1扫描，直至找到未被占用的端口
                port:8719
management:
	endpoints:
		web:
			exposure:
				include: '*'
```

3. 主启动类

```java
@SpringBootApplication
@EnableDiscoveryClient
public class AlibabaSentinelMain {
    public static void main(String[] args) {
        SpringApplication.run(AlibabaSentinelMain.class,args);
    }
}
```

4. controller 

```java
@RestController
@Slf4j
public class AlibabaSentinelController {
    @GetMapping("/testA")
    public String getTestA() {
        return "------testA------";
    }

    @GetMapping("/testB")
    public String getTestB() {
        log.info("pass request.... testB "+Thread.currentThread().getName()+"===============");
        return "------testB------";
    }
}
```

5. 到这里就可以启动8401

 此时我们到sentinel中查看，发现并没有8401的任何信息 是因为，sentinel是懒加载，需要我们执行一次访问，才会有信息。 访问localhost/8401/testA

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071635632.png) 

6. 可以看到已经开始监听了

### sentinel的流控规则

#### 流量限制控制规则

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071635892.png)

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071636237.png) 

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071636803.png) 

#### 流控模式:

1. 直接快速失败

   -  **QPS(每秒钟的请求数量)：当调用该api的QPS达到阈值的时候，进行限流**

   ![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071636576.png) 

      **直接失败的效果:**

   ![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071636743.png) 

2. 线程数:

   - 线程数：当调用该api的线程数达到阈值的时候，进行限流


![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071636922.png) 

**比如a请求过来，处理很慢，在一直处理，此时b请求又过来了**
**此时因为a占用一个线程，此时要处理b请求就只有额外开启一个线程**
**那么就会报错**

   ![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071637638.png)


3. 关联:

   - **当关联的资源达到阈值时，就限流自己。**

   - **当与A关联的资源B达到阈值后，就限流A自己**

   - **B惹事，A挂了**

   应用场景:  比如**支付接口**达到阈值，就要限流下**订单的接口**，防止一直有订单

   ![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071637520.png) 

   **当testA达到阈值，qps大于1，就让testB之后的请求直接失败**

   可以使用postman压测

4. 链路:
   多个请求调用同一个微服务

5. 预热Warm up:

- Warm Up(RuleConstant.CONTROL_BEHAVIOR_WARM_UP)方式，即预热/冷启动方式。当系统长期处于低水位的情况下，当流量突然增加时，直接把系统拉升到高水位可能瞬间把系统压垮。通过"冷启动"，让通过的流量缓慢增加，在一定时间内逐渐增加到阈值上限，给冷系统一个预热的时间，避免冷系统被压垮。详细文档可以参考"流量控制-Warm Up文档"

- Warm Up:根据codeFactor(冷加载因子，默认为3)的值。从阈值/codeFactor，经过预热时长，才打到设置的QPS阈值。

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071637689.png)

**应用场景**

如：秒杀系统在开启的瞬间，会有很多流量上来，很有可能把系统打死，预热方式就是把为了保护系统，可慢慢的把流量放进来，慢慢的把阈值增长到设置的阈值。

7. 排队等待:

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071637077.png)

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071637344.png)

### 降级规则:

**就是熔断降级**

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311091440432.png)   

- <span style="color:blue;font-weight:bolder">RT(平均响应时间，秒级)</span>

  - 平均响应时间 超出阈值且 在时间窗口内通过的请求\>\=5，两个条件同时满足后触发降级，窗口期过后关闭断路器；就是窗口期内的请求的平均响应时间如果大于阈值，则熔断降级。

  - RT最大4900（5秒），更大的需要通过-Dcsp.sentinel.statistic.max.rt\=XXXX才能生效

- <span style="color:blue;font-weight:bolder">异常比例（秒级）</span>

  QPS\>\=5且异常比例（秒级统计）超过阈值时，触发降级；时间窗口结束后，关闭降级

- <span style="color:blue;font-weight:bolder">异常数（分钟级）</span>

  - 异常数（分钟统计）超过阈值时，触发降级；时间窗口结束后，关闭降级

Sentinel熔断降级会在调用链路中<span style='text-decoration:underline'>**某个资源**</span>出现不稳定状态时（例如<span style='text-decoration:underline'>**调用超时或异常比例升高**</span>)，对这个资源的调用进行**<span style='text-decoration:underline'>限制</span>**，让**<span style='text-decoration:underline'>请求快速失败</span>**，避免影响到其他的资源而导致级联错误。

当资源被降级后，在接下来的降级时间窗口之内，对该资源的调用都自动熔断（默认行为是抛出DegradeException)。

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071638675.png) 

#### 1.RT配置:

新增一个请求方法用于测试

```java
@GetMapping("/testD")
public String testD(){
    //暂停几秒钟线程
    try{
        TimeUnit.SECONDS.sleep(1);
    }catch{
        log.info("testD 测试RT");
        return "------testD";
    }
} 
```

**配置RT**:

 这里配置的RT，默认是秒级的平均响应时间

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071638867.png) 

默认计算平均时间是: 1秒类进入5个请求，并且响应的平均值超过阈值(这里的200ms)，就报错

 1秒5请求是Sentinel默认设置的

**测试**

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071638571.png)

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071638124.png) 

**默认熔断后.就直接抛出异常**

#### 2.异常比例:

- 异常比例（DEGRADE_GRADE_EXCEPTION_RATIO）：当资源的每秒请求量\>\=5，并且每秒异常总数占通过量的比值超过阈值（DegradeRule中的count）之后，资源进入降级状态，即在接下的时间窗口（DegradeRule中的timeWindow，以s为单位）之内，对这个方法的调用都会自动地返回。异常比率的阈值范围是[0.0，1.0]，代表0%-100%

修改请求方法

```java
@GetMapping("/testD")
public String testD(){
    //暂停几秒钟线程
    //try{
    //TimeUnit.SECONDS.sleep(1);
    //}catch{
    log.info("testD 异常比例");
    int age=10/0;
    return "------testD";
    //}
}  
```

配置:

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071638422.png) 

**如果没触发熔断，这正常抛出异常**:

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071639192.png) 

**触发熔断**:

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071639923.png) 

#### 3.异常数:

- 异常数（DEGRADE_GRADE_EXCEPTIO_COUNT）:当资源<span style='text-decoration:underline'>**近1分钟的异常数目超过阈值**</span>之后会进行熔断。注意由于统计时间窗口是分钟级别的，若timeWindow小于60s，则结束熔断状态后仍可能再进入熔断状态。
- <span style="color:red">**时间窗口一定要大于等于60秒**</span>

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071639486.png) 

一分钟之内，有5个请求发送异常，进入熔断

### 热点规则:

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071639025.png)  

何为热点？热点即经常访问的数据。很多时候我们希望统计<span style="color:red;font-weight:bolder;text-decoration:underline">某个热点数据</span>中访问<span style="color:red;font-weight:bolder;text-decoration:underline">频次最高的Top K数据</span>，并对其访问进行限制。比例：

- 商品ID为参数，统计一段时间内最常购买的商品ID并进行限制
- 用户ID为参数，针对<span style="color:red;font-weight:bolder;text-decoration:underline">一段时间内**频繁访问的用户ID进行限制**</span>

比如:

 localhost:8080/aa?name=aa

 localhost:8080/aa?name=b'b

 加入两个请求中，带有参数aa的请求访问频次非常高，我们就现在name==aa的请求，但是bb的不限制

**如何自定义降级方法，而不是默认的抛出异常?**

<span style="color:blue">**兜底方法**</span>

<span style="color:blue">**分为系统默认和客户自定义两种**</span>

之前的case，限流出问题后，都是用sentinel系统默认的提示，Blocked by Sentinel（flow limiting）

我们能不能自定义？类似Hystrix，某个方法出问题了，就找对应的兜底降级方法？

**结论**

<span style="color:blue">**从HystrixCommand到@SentinelResource**</span>

**使用@SentinelResource直接实现降级方法，它等同Hystrix的@HystrixCommand**

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071639775.png) 

**定义热点规则:**

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071639199.png) 

![sentinel的42](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071639057.png) 

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071639911.png) 

**此时我们访问/testHotkey并且带上才是p1**

 如果qps大于1，就会触发我们定义的降级方法

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071639663.png) 

**但是我们的参数是P2，就没有问题**

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071639838.png) 

只有带了p1，才可能会触发热点限流

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071639858.png)

#### 2.设置热点规则中的其他选项:

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071640207.png) 

**需求:**

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071640335.png)

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071640522.png)

==测试==

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071643754.png)

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071643779.png)

**注意:**

参数类型只支持，8种基本类型+String类

**==注意:==**

如果我们程序出现异常，是不会走blockHander的降级方法的，因为这个方法只配置了热点规则，没有配置限流规则

我们这里配置的降级方法是sentinel针对热点规则配置的

只有触发热点规则才会降级

<span style="color:blue">**@SentinelResource**</span>

处理的是Sentinel控制台配置的违规情况，有blockHandler方法配置的兜底处理；

<span style="color:blue">**RuntimeException**</span>

int age =10/0，这个是Java运行时报出的运行时异常RuntimeException，@SentinelResource不管

总结

<span style="color:blue">**@SentinelResource主管配置出错，运行出错该走异常，走异常**</span>

### 系统规则:

系统自适应限流:
从整体维度对应用入口进行限流

对整体限流，比如设置qps到达100，这里限流会限制整个系统不可以

*![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071643292.png)*

系统规则支持以下的模式：

-  <span style="color:red;font-weight:bolder;text-decoration:underline">Load自适应（仅对Linux/Unix-like机器生效)</span>：系统的load1作为启发指标，进行自适应系统保护。当系统load1超过设定的启发值，且系统当前的并发线程数超过估算的系统容量时才会触发系统保护（BBR阶段)。<span style="color:red;font-weight:bolder;text-decoration:underline">系统容量由系统的maxQps * minRt估算得出。设定参考值一般是CPU cores * 2.5。</span>
-  CPU usage(1.5.0+ 版本)：当系统CPU使用率超过阈值即触发系统保护（取值范围0.0-1.0）,比较灵敏。
-  平均RT：当单台机器上所有入口流量的平均RT达到阈值即触发系统保护，单位是毫秒。
-  并发线程数：当单台机器上所有入口流量的并发线程数达到阈值即触发系统保护。
-  入口QPS：当单台机器上所有入口流量的QPS达到阈值即触发系统保护。

**测试**:
![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071643934.png)

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071643706.png) 

### @SentinelResource注解:

**用于配置降级等功能**

1，环境搭建

2，为8401添加依赖

   添加我们自己的commone包的依赖

   ```xml
<dependency>
    <!-- 引入自己定义的api通用包，可以使用Payment支付Entity -->
    <groupId>org.atguigu.springcloud</groupId>
    <artifactId>cloud-api-common</artifactId>
    <version>1.0-SNAPSHOT</version>
</dependency> 
   ```

   额外创建一个controller类

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071655457.png)

3，配置限流

**注意，我们这里配置规则，资源名指定的是@SentinelResource注解value的值，这样也是可以的，也就是不一定要指定访问路径**


![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071656070.png) 

4. 测试.

   可以看到已经进入降级方法了

   ![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071656463.png)

5. 此时我们关闭8401服务

   可以看到，这些定义的规则是临时的，关闭服务，规则就没有了

   ![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071656442.png)

**可以看到上面配置的降级方法又出现Hystrix遇到的问题了**

 降级方法与业务方法耦合

 每个业务方法都需要对应一个降级方法

- **系统默认的，没有体现我们自己的业务要求。**
- **依照现有条件，我们自定义的处理方法又和业务代码耦合一块，不直观。**
- **每个业务方法都添加一个兜底的，那代码膨胀加剧。**
- **全家统一的处理方法没有体现。** 

#### 自定义限流处理逻辑:

1. **单独创建一个类，用于处理限流**

   ![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071656922.png) 

2. **在controller中，指定使用自定义类中的方法作为降级方法**

   ![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071656050.png)

3. **Sentinel中定义流控规则**:

   这里资源名，是以url指定，也可以使用@SentinelResource注解value的值指定

   ![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071656435.png) 


4. **测试**:

   ![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071656398.png) 

5. **整体**:

   ![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071656388.png) 

### @SentinelResource注解的其他属性:

<span style="color:red">**注意：注解方式埋点不支持private方法。**</span>

@SentinelResource用于定义资源，并提供可选的异常处理和fallback配置项。@SentinelResource注解包含以下属性：

- value：资源名称，必需项(不能为空)

- entryType: entry类型，可选项(默认为EntryType.OUT)

- blockHandler/blockHanderClass：blockHander对应处理BlockException的函数名称，可选项。blockHandler函数访问范围需要是public。返回类型需要与原方法相匹配，参数类型需要和原方法相匹配并且最后加一个额外的参数，类型为BlockException。blockHandler函数默认需要和原方法在同一个类中。若希望使用其他类的函数，则可以指定blockHandlerClass为对应的类的Class对象。注意对应的函数必须为static函数，否则无法解析。

- fallback：fallback函数名称，可选项，用于在抛出异常的时候提供发了fallback处理逻辑。fallback函数可以针对所有类型的异常(除了ExceptionToIgnore里面排除掉的异常类型)进行处理。

  **fallback函数签名和位置要求：**

  - 返回值类型必须与原函数返回值类型一致；

  - 方法参数列表需要和原函数一致，或者可以额外多一个Throwable类型的参数用于接受对应的异常。

  - fallback函数默认需要和原方法在同一个类中。若希望使用其他类的函数，则可以指定fallbackClass为对应的类的Class对象。注意对应的函数必须为static函数，否则无法解析。

- defaultFallback(since 1.6.0)：默认的fallback函数名称，可选项。通常用于通用的fallback逻辑(即可以用于很多服务或方法)。默认的fallback函数可以针对所有类型的异常(除了ExceptionToIgnore里面排除掉的异常类型)进行处理。若同时配置了fallback和defaultFallback，则只有fallback会生效。

  **defaultFallback函数签名要求：**

  - 返回值类型必须与原函数返回值类型一致；
  - 方法参数列表需要为空，或则可以额外多一个Throwable类型的参数用于接收对应的异常。

Sentinel主要有三个核心API：

-  **SphU定义资源**
-  **Tracer定义统计**
-  **ContextUtil定义了上下文**

### 服务熔断:

1. **启动nacos和sentinel**

2. **新建两个pay模块 9003和9004**

3. pom

4. 配置文件

   ![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071656871.png)*

5. 主启动类

   ```java
   @SpringBootApplication
   @EnableDiscoveryClient
   public class PaymentMain9003 {
   
       public static void main(String[] args) {
           SpringApplication.run(PaymentMain9003.class，args);
       }
   }
    
   
   ```

6. controller

   ![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071657416.png)

    **然后启动9003.9004**

7. **新建一个order-84消费者模块:**

8. pom

   与上面的pay一模一样

9. 配置文件

   ![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071657551.png) 

10. 主启动类

    ![](https://gitee.com/wowosong/pic-md/raw/master/202301052139956.png) 

11. 配置类

    ![](https://gitee.com/wowosong/pic-md/raw/master/202301032250507.png) 

12. controller

    ![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071657331.png)

    6.   **为业务方法添加fallback来指定降级方法**:

         ![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071657190.png)

         重启order

         测试:

         ![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071657052.png)所以fallback是用于管理异常的，当业务方法发生异常，可以降级到指定方法

    

    注意，我们这里并没有使用sentinel配置任何规则，但是却降级成功，就是因为fallback是用于管理异常的，当业务方法发生异常，可以降级到指定方法

    6.   **为业务方法添加blockHandler，看看是什么效果**

         ![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071657263.png)

         **重启84，访问业务方法:**

         ![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071658611.png) 

          可以看到直接报错了，并没有降级，也就是说blockHandler只对sentienl定义的规则降级

    7.   **如果fallback和blockHandler都配置呢?**

         ![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071658203.png) 

         **设置qps规则，阈值1**

         ![](https://gitee.com/wowosong/pic-md/raw/master/202301032251229.png)

         **测试**:

         ![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071658550.png) 

          可以看到，当两个都同时生效时，blockhandler优先生效

    8.  **@SentinelResource还有一个属性，exceptionsToIgnore**

        ![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071658461.png)

         **exceptionsToIgnore指定一个异常类，**

        **表示如果当前方法抛出的是指定的异常，不降级，直接对用户抛出异常**

         ![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071658237.png)

### sentinel整合ribbon+openFeign+fallback

1. 修改84模块，使其支持feign

   1. pom

      ![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071658267.png) 

   2. 配置文件

      ![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071658942.png) 

   3. 主启动类也要修改

      ![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071658671.png)

   4. 创建远程调用pay模块的接口

      ![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071658616.png)

   5. 创建这个接口的实现类，用于降级

      ![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071659824.png) 

   6. 再次修改接口，指定降级类

   ![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071659284.png)

   7. controller添加远程调用

   ![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071659766.png)

   8. 测试

      启动9003，84

   9. 测试，如果关闭9003。看看84会不会降级

   ![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071659826.png)

   **可以看到，正常降级了**

**熔断框架比较**

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071659815.png) 

### sentinel持久化规则

默认规则是临时存储的，重启sentinel就会消失；

**将限流配置规则持久化进<span style="color:red">Nacos保存</span>，只要刷新8401某个rest地址，sentinel控制台的流控规则就能看到，只要<span style="color:red">Nacos里面的配置不删除</span>，针对8401上sentinel伤的流控规则持续有效；**

**这里以之前的8401为案例进行修改:**

1. 修改8401的pom

   ```xml
   添加:
   <!-- SpringCloud ailibaba sentinel-datasource-nacos 持久化需要用到-->
   <dependency>
       <groupId>com.alibaba.csp</groupId>
       <artifactId>sentinel-datasource-nacos</artifactId>
   </dependency>
    
   ```


2. 修改配置文件:

   添加:

   ![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071659188.png) 

    **实际上就是指定，我们的规则要保证在哪个名称空间的哪个分组下，这里没有指定namespace， 但是是可以指定的**

   **注意，这里的dataid要与8401的服务名一致**

3. **在nacos中创建一个配置文件，dataId就是上面配置文件中指定的**

   ![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071659241.png) 

   json中这些属性的含义: ​

```json
[
 {
"resource": "/rateLimit/byUrl"，
"limitApp": "default"，
"grade":1，
"count":1，
"strategy":0，
"controlBehavior":0，
"clusterMode": false
 }
]
```

```
resource：资源名称；
limitApp：来源应用；
grade：阈值类型，0表示线程数，1表示QPS；
count：单机阈值；
strategy：流控模式，0表示直接，1表示关联，2表示链路
controlBehav：流控效果，0表示快速失败，1表示Warm Up，2表示排队等待；
clusterMode：是否集群
```

4. 启动8401:

   ![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071700428.png)

   可以看到，直接读取到了规则(云服务器无法获取，这种方法是推模式，由nacos将限流策略推送到项目)

5. 关闭8401

   ![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071700801.png)

6. 此时重启8401，如果sentinel又可以正常读取到规则，那么证明持久化成功

   可以看到，又重新出现了

   ![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071700092.png)

## Seata:

![image-20211130154414714](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071700693.png) 

Seata 是一款开源的分布式事务解决方案，致力于提供高性能和简单易用的分布式事务服务。Seata 将为用户提供了 AT、TCC、SAGA 和 XA 事务模式，为用户打造一站式的分布式解决方案。

**分布式事务中的一些概念，也是seata中的概念:**

​        ![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071700232.png)

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071700490.png)

1. <span style="color:red;font-weight:bolder;text-decoration:underline">TM向TC申请开启一个全局事务，全局事务创建成功并生成一个全局唯一的XID；</span>
2. XID在微服务调用链路的上下文中传播；<span style="color:red;font-weight:bolder;text-decoration:underline">也就是在多个TM、RM中传播；</span>
3. RM向TC<span style="color:red;font-weight:bolder;text-decoration:underline">注册分支事务，</span>将其纳入XID对应全局事务的管辖；
4. <span style="color:red;font-weight:bolder;text-decoration:underline">TM向TC</span>发起针对XID的<span style="color:red;font-weight:bolder;text-decoration:underline">全局提交或回滚决议</span>；
5. <span style="color:red;font-weight:bolder;text-decoration:underline">TC调度XID</span>下管辖的全部分支事务完成提交或回滚请求。

![image-20231109152417017](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311091524536.png)

### seata安装:

1. **下载安装seata的安装包**

2. **修改file.conf**

3. ![image-20211130161912981](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071700395.png) 

   ```properties
   service {
     #vgroup->rgroup
     vgroup_mapping.my_test_tx_group = "fsp_tx_group" 指定事务名称
     #only support single node
     default.grouplist = "127.0.0.1:8091"
     #degrade current not support
     enableDegrade = false
     #disable
     disable = false
     #unit ms，s，m，h，d represents milliseconds， seconds， minutes， hours， days， default permanent
     max.commit.retry.timeout = "-1"
     max.rollback.retry.timeout = "-1"
   }
   ```

   ```properties
   store {
     ## store mode: file、db
     mode = "db" 指定使用数据库存储日志
   
     ## file store
     file {
       dir = "sessionStore"
   
       # branch session size ， if exceeded first try compress lockkey， still exceeded throws exceptions
       max-branch-session-size = 16384
       # globe session size ， if exceeded throws exceptions
       max-global-session-size = 512
       # file buffer size ， if exceeded allocate new buffer
       file-write-buffer-cache-size = 16384
       # when recover batch read size
       session.reload.read_size = 100
       # async， sync
       flush-disk-mode = async
     }
   
     ## database store
     db {
       ## the implement of javax.sql.DataSource， such as 		DruidDataSource(druid)/BasicDataSource(dbcp) etc.
       datasource = "dbcp"
       ## mysql/oracle/h2/oceanbase etc.
       db-type = "mysql"
       driver-class-name = "com.mysql.cj.jdbc.Driver"
       url = "jdbc:mysql://127.0.0.1:3306/seata" 指定自己的数据库信息
       user = "root"
       password = "password"
       min-conn = 1
       max-conn = 3
       global.table = "global_table"
       branch.table = "branch_table"
       lock-table = "lock_table"
       query-limit = 100
     }
   }
   ```

4. **mysql建库建表**

   1.上面指定了数据库为seata，所以创建一个数据库名为seata

   2.建表，在seata的安装目录下有一个db_store.sql，运行即可

5. **继续修改配置文件，修改registry.conf**

配置seata作为微服务，指定注册中心

```properties
registry {
  # file 、nacos 、eureka、redis、zk、consul、etcd3、sofa
  type = "nacos"  指定注册服务的类型，此处使用nacos

  nacos {
    serverAddr = "localhost:8848" 指定nacos地址
    namespace = ""
    cluster = "default"
  }
  eureka {
    serviceUrl = "http://localhost:8761/eureka"
    application = "default"
    weight = "1"
  }
  redis {
    serverAddr = "localhost:6379"
    db = "0"
  }
  zk {
    cluster = "default"
    serverAddr = "127.0.0.1:2181"
    session.timeout = 6000
    connect.timeout = 2000
  }
  consul {
    cluster = "default"
    serverAddr = "127.0.0.1:8500"
  }
  etcd3 {
    cluster = "default"
    serverAddr = "http://localhost:2379"
  }
  sofa {
    serverAddr = "127.0.0.1:9603"
    application = "default"
    region = "DEFAULT_ZONE"
    datacenter = "DefaultDataCenter"
    cluster = "default"
    group = "SEATA_GROUP"
    addressWaitTime = "3000"
  }
  file {
    name = "file.conf"
  }
}
```

5. 启动

先启动nacos，再启动seata-server(运行安装目录下的，seata-server.bat)

**业务说明**

这里我们会创建三个服务，<span style="color:red;background-color:black;font-weight:bolder;text-decoration:underline">一个订单服务，一个库存服务，一个账户服务.</span>

<span style="color:blue;font-weight:bolder;text-decoration:underline">当用户下单时，会在订单服务中创建一个订单，然后通过远程调用库存服务来扣减下单商品的库存，再通过远程调用账户服务来扣减用不账户里面的余额，最后在订单服务中修改订单状态为已完成。</span>

该操作跨越三个数据库，有两次远程调用，很明显会有分布式事务问题。

下单\-\-\-\>库存\-\-\-\>账号余额

1. 创建三个数据库

   ```sql
   create database seata_order;
   create database seata_storage;
   create database seata_account;
   ```

2. 创建对应的表

   - seata\_order库下建t\_order表
   - seata\_staorage库下建t\_storage表
   - seata\_account库下建t\_account表 

3. 三个数据库各个创建回滚日志表，方便查看

```sql
- ----------------------------
-- Table structure for undo_log
-- ----------------------------
DROP TABLE IF EXISTS `undo_log`;
CREATE TABLE `undo_log`  (
  `id` bigint(0) NOT NULL AUTO_INCREMENT，
  `branch_id` bigint(0) NOT NULL，
  `xid` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL，
  `context` varchar(128) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL，
  `rollback_info` longblob NOT NULL，
  `log_status` int(0) NOT NULL，
  `log_created` datetime(0) NOT NULL，
  `log_modified` datetime(0) NOT NULL，
  `ext` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL，
  PRIMARY KEY (`id`) USING BTREE，
  UNIQUE INDEX `ux_undo_log`(`xid`， `branch_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

SET FOREIGN_KEY_CHECKS = 1;

```

**注意：每个库都要执行一次，这个sql生成回滚日志表**

4. 每个业务都创建一个微服务，也就是要有三个微服务：订单，库存，账号

   ![image-20211130164922599](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071701338.png) 

 订单seta\-order\-2001

1. pom

2. 配置文件

   ```yaml
   server:
     port: 2001
   
   spring:
     application:
       name: seata-order-service
     cloud:
       alibaba:
         seata:
           # 自定义事务组名称需要与seata-server中的对应，我们之前在seata的配置文件中配置的名字
           tx-service-group: fsp_tx_group
       nacos:
         discovery:
           server-addr: 127.0.0.1:8848
     datasource:
       # 当前数据源操作类型
       type: com.alibaba.druid.pool.DruidDataSource
       # mysql驱动类
       driver-class-name: com.mysql.cj.jdbc.Driver
       url: jdbc:mysql://localhost:3306/seata_order?useUnicode=true&characterEncoding=UTF-8&useSSL=false&serverTimezone=GMT%2B8
       username: root
       password: root
   feign:
     hystrix:
       enabled: false
   logging:
     level:
       io:
         seata: info
   
   mybatis:
     mapperLocations: classpath*:mapper/*.xml
   ```

   还要额外创建其他配置文件，创建一个file.conf:

    ```properties
   transport {
     # tcp udt unix-domain-socket
     type = "TCP"
     #NIO NATIVE
     server = "NIO"
     #enable heartbeat
     heartbeat = true
     #thread factory for netty
     thread-factory {
       boss-thread-prefix = "NettyBoss"
       worker-thread-prefix = "NettyServerNIOWorker"
       server-executor-thread-prefix = "NettyServerBizHandler"
       share-boss-worker = false
       client-selector-thread-prefix = "NettyClientSelector"
       client-selector-thread-size = 1
       client-worker-thread-prefix = "NettyClientWorkerThread"
       # netty boss thread size，will not be used for UDT
       boss-thread-size = 1
       #auto default pin or 8
       worker-thread-size = 8
     }
     shutdown {
       # when destroy server， wait seconds
       wait = 3
     }
     serialization = "seata"
     compressor = "none"
   }
   service {
     #vgroup->rgroup
     # 事务组名称
     vgroup_mapping.fsp_tx_group = "default"
     #only support single node
     default.grouplist = "127.0.0.1:8091"
     #degrade current not support
     enableDegrade = false
     #disable
     disable = false
     #unit ms，s，m，h，d represents milliseconds， seconds， minutes， hours， days， default permanent
     max.commit.retry.timeout = "-1"
     max.rollback.retry.timeout = "-1"
   }
   
   client {
     async.commit.buffer.limit = 10000
     lock {
       retry.internal = 10
       retry.times = 30
     }
     report.retry.count = 5
     tm.commit.retry.count = 1
     tm.rollback.retry.count = 1
   }
   
   ## transaction log store
   store {
     ## store mode: file、db
     #mode = "file"
     mode = "db"
   
     ## file store
     file {
       dir = "sessionStore"
   
       # branch session size ， if exceeded first try compress lockkey， still exceeded throws exceptions
       max-branch-session-size = 16384
       # globe session size ， if exceeded throws exceptions
       max-global-session-size = 512
       # file buffer size ， if exceeded allocate new buffer
       file-write-buffer-cache-size = 16384
       # when recover batch read size
       session.reload.read_size = 100
       # async， sync
       flush-disk-mode = async
     }
   
     ## database store
     db {
       ## the implement of javax.sql.DataSource， such as DruidDataSource(druid)/BasicDataSource(dbcp) etc.
       datasource = "dbcp"
       ## mysql/oracle/h2/oceanbase etc.
       db-type = "mysql"
       driver-class-name = "com.mysql.jdbc.Driver"
       url = "jdbc:mysql://127.0.0.1:3306/seata"
       user = "root"
       password = "password"
       min-conn = 1
       max-conn = 3
       global.table = "global_table"
       branch.table = "branch_table"
       lock-table = "lock_table"
       query-limit = 100
     }
   }
   lock {
     ## the lock store mode: local、remote
     mode = "remote"
   
     local {
       ## store locks in user's database
     }
   
     remote {
       ## store locks in the seata's server
     }
   }
   recovery {
     #schedule committing retry period in milliseconds
     committing-retry-period = 1000
     #schedule asyn committing retry period in milliseconds
     asyn-committing-retry-period = 1000
     #schedule rollbacking retry period in milliseconds
     rollbacking-retry-period = 1000
     #schedule timeout retry period in milliseconds
     timeout-retry-period = 1000
   }
   
   transaction {
     undo.data.validation = true
     undo.log.serialization = "jackson"
     undo.log.save.days = 7
     #schedule delete expired undo_log in milliseconds
     undo.log.delete.period = 86400000
     undo.log.table = "undo_log"
   }
   
   ## metrics settings
   metrics {
     enabled = false
     registry-type = "compact"
     # multi exporters use comma divided
     exporter-list = "prometheus"
     exporter-prometheus-port = 9898
   }
   
   support {
     ## spring
     spring {
       # auto proxy the DataSource bean
       datasource.autoproxy = false
     }
   }
    ```

   创建registry.conf:

   ```properties
   registry {
     # file 、nacos 、eureka、redis、zk、consul、etcd3、sofa
     type = "nacos"
    
     nacos {
       #serverAddr = "localhost"
       serverAddr = "localhost:8848"
       namespace = ""
       cluster = "default"
     }
     eureka {
       serviceUrl = "http://localhost:8761/eureka"
       application = "default"
       weight = "1"
     }
     redis {
       serverAddr = "localhost:6379"
       db = "0"
     }
     zk {
       cluster = "default"
       serverAddr = "127.0.0.1:2181"
       session.timeout = 6000
       connect.timeout = 2000
     }
     consul {
       cluster = "default"
       serverAddr = "127.0.0.1:8500"
     }
     etcd3 {
       cluster = "default"
       serverAddr = "http://localhost:2379"
     }
     sofa {
       serverAddr = "127.0.0.1:9603"
       application = "default"
       region = "DEFAULT_ZONE"
       datacenter = "DefaultDataCenter"
       cluster = "default"
       group = "SEATA_GROUP"
       addressWaitTime = "3000"
     }
     file {
       name = "file.conf"
     }
   }
    
   config {
     # file、nacos 、apollo、zk、consul、etcd3
     type = "file"
    
     nacos {
       serverAddr = "localhost"
       namespace = ""
     }
     consul {
       serverAddr = "127.0.0.1:8500"
     }
     apollo {
       app.id = "seata-server"
       apollo.meta = "http://192.168.1.204:8801"
     }
     zk {
       serverAddr = "127.0.0.1:2181"
       session.timeout = 6000
       connect.timeout = 2000
     }
     etcd3 {
       serverAddr = "http://localhost:2379"
     }
     file {
       name = "file.conf"
     }
   }
   
   ```

   实际上就是要将seata中的我们之前修改的两个配置文件复制到这个项目下

3. **主启动类**

   ```java
   @SpringBootApplication(exclude = DataSourceAutoConfiguration.class) //取消数据源的自动创建
   @EnableDiscoveryClient
   @EnableFeignClients
   public class SeataOrderMain2001 {
   
       public static void main(String[] args) {
           SpringApplication.run(SeataOrderMain2001.class，args);
       }
   }
   ```

   4.   **service层**

        ```java
        public interface OrderService {
        
            /**
             * 创建订单
             * @param order
             */
            void create(Order order);
        }
        ```

        ```java
        @FeignClient(value = "seata-storage-service")
        public interface StorageService {
        
            /**
             * 减库存
             * @param productId
             * @param count
             * @return
             */
            @PostMapping(value = "/storage/decrease")
            CommonResult decrease(@RequestParam("productId") Long productId， @RequestParam("count") Integer count);
        }
        ```

        ```java
        @FeignClient(value = "seata-account-service")
        public interface AccountService {
        
            /**
             * 减余额
             * @param userId
             * @param money
             * @return
             */
            @PostMapping(value = "/account/decrease")
            CommonResult decrease(@RequestParam("userId") Long userId， @RequestParam("money") BigDecimal money);
        }
         
         
        
        ```

        ```java
        @Service
        @Slf4j
        public class OrderServiceImpl implements OrderService {
        
            @Resource
            private OrderDao orderDao;
            @Resource
            private AccountService accountService;
            @Resource
            private StorageService storageService;
        
            /**
             * 创建订单->调用库存服务扣减库存->调用账户服务扣减账户余额->修改订单状态
             * 简单说:
             * 下订单->减库存->减余额->改状态
             * GlobalTransactional seata开启分布式事务，异常时回滚，name保证唯一即可
             * @param order 订单对象
             */
            @Override
            ///@GlobalTransactional(name = "fsp-create-order"， rollbackFor = Exception.class)
            public void create(Order order) {
                // 1 新建订单
                log.info("----->开始新建订单");
                orderDao.create(order);
        
                // 2 扣减库存
                log.info("----->订单微服务开始调用库存，做扣减Count");
                storageService.decrease(order.getProductId()， order.getCount());
                log.info("----->订单微服务开始调用库存，做扣减End");
        
                // 3 扣减账户
                log.info("----->订单微服务开始调用账户，做扣减Money");
                accountService.decrease(order.getUserId()， order.getMoney());
                log.info("----->订单微服务开始调用账户，做扣减End");
        
                // 4 修改订单状态，从0到1，1代表已完成
                log.info("----->修改订单状态开始");
                orderDao.update(order.getUserId()， 0);
        
                log.info("----->下订单结束了，O(∩_∩)O哈哈~");
            }
        }
        ```

   5.   **dao层也就是接口**

        ```java
        @Mapper
        public interface OrderDao {
            /**
             * 1 新建订单
             * @param order
             * @return
             */
            int create(Order order);
        
            /**
             * 2 修改订单状态，从0改为1
             * @param userId
             * @param status
             * @return
             */
            int update(@Param("userId") Long userId， @Param("status") Integer status);
        }
        ```

         在resource下创建mapper文件夹，编写mapper.xml

        ```xml
        <?xml version="1.0" encoding="UTF-8" ?>
        <!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
                "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
        <mapper namespace="com.eiletxie.springcloud.alibaba.dao.OrderDao">
        
            <resultMap id="BaseResultMap" type="com.eiletxie.springcloud.alibaba.domain.Order">
                <id column="id" property="id" jdbcType="BIGINT"></id>
                <result column="user_id" property="userId" jdbcType="BIGINT"></result>
                <result column="product_id" property="productId" jdbcType="BIGINT"></result>
                <result column="count" property="count" jdbcType="INTEGER"></result>
                <result column="money" property="money" jdbcType="DECIMAL"></result>
                <result column="status" property="status" jdbcType="INTEGER"></result>
            </resultMap>
        
            <insert id="create" parameterType="com.eiletxie.springcloud.alibaba.domain.Order" useGeneratedKeys="true"
                    keyProperty="id">
                insert into t_order(user_id，product_id，count，money，status) values (#{userId}，#{productId}，#{count}，#{money}，0);
            </insert>
        
            <update id="update">
                update t_order set status =1 where user_id =#{userId} and status=#{status};
           </update>
        </mapper>
         
        ```

   6.   **controller层**

        ```java
        @RestController
        public class OrderController {
            @Resource
            private OrderService orderService;
        
        
            /**
             * 创建订单
             *
             * @param order
             * @return
             */
            @GetMapping("/order/create")
            public CommonResult create(Order order) {
                orderService.create(order);
                return new CommonResult(200， "订单创建成功");
            }
        
        
        }
        ```

        

   7. **entity类(也叫domain类)**

      ```java
      @Data
      @AllArgsConstructor
      @NoArgsConstructor
      public class CommonResult<T> {
          private Integer code;
          private String message;
          private T data;
      
          public CommonResult(Integer code， String message) {
              this(code， message， null);
          }
      }
       
      ```

      ```java
      @Data
      @AllArgsConstructor
      @NoArgsConstructor
      public class Order {
          private Long id;
          private String userId;
          private Long productId;
          private Integer count;
          private BigDecimal money;
          //0创建中 1 已完成
          private Integer status;
      
      }
      ```

      

   8.   config配置类

        ```java
        @Configuration
        @MapperScan({"com.eiletxie.springcloud.alibaba.dao"})	
        //指定我们的接口的位置
        public class MyBatisConfig {
        
        }
        
        ```

        ```java
        /**
         * @Author EiletXie
         * @Since 2020/3/18 21:51
         * 使用Seata对数据源进行代理
         */
        @Configuration
        public class DataSourceProxyConfig {
        
            @Value("${mybatis.mapperLocations}")
            private String mapperLocations;
        
            @Bean
            @ConfigurationProperties(prefix = "spring.datasource")
            public DataSource druidDataSource() {
                return new DruidDataSource();
            }
        
            @Bean
            public DataSourceProxy dataSourceProxy(DataSource druidDataSource) {
                return new DataSourceProxy(druidDataSource);
            }
        
            @Bean
            public SqlSessionFactory sqlSessionFactoryBean(DataSourceProxy dataSourceProxy) throws Exception {
                SqlSessionFactoryBean bean = new SqlSessionFactoryBean();
                bean.setDataSource(dataSourceProxy);
                ResourcePatternResolver resolver = new PathMatchingResourcePatternResolver();
                bean.setMapperLocations(resolver.getResources(mapperLocations));
                return bean.getObject();
            }
        }
         
        ```

        

     库存seta-storage-2002

   **看脑图**

   1.    pom   
   2.    配置文件
   3.    主启动类
   4.    service层
   5.    dao层
   6.    controller层

    

    账号，seta-account-2003

   **看脑图**

   1.    pom     
   2.    配置文件
   3.    主启动类
   4.    service层
   5.    dao层
   6.    controller层

4. **全局创建完成后，首先测试不加seata**

   ![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071701363.png)

     ![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071701736.png)



6. 使用seata:

   **在订单模块的serviceImpl类中的create方法添加启动分布式事务的注解**

   ```java
    /**
    	这里添加开启分布式事务的注解，name指定当前全局事务的名称
    	rollbackFor表示，发生什么异常需要回滚
    	noRollbackFor:表示，发生什么异常不需要回滚
    */
    @GlobalTransactional(name = "fsp-create-order"，rollbackFor = Exception.class)
    ///@GlobalTransactional(name = "fsp-create-order"， rollbackFor = Exception.class)
    public void create(Order order) {
        // 1 新建订单
        log.info("----->开始新建订单");
        orderDao.create(order);
    
        // 2 扣减库存
        log.info("----->订单微服务开始调用库存，做扣减Count");
        storageService.decrease(order.getProductId()， order.getCount());
        log.info("----->订单微服务开始调用库存，做扣减End");
    
        // 3 扣减账户
        log.info("----->订单微服务开始调用账户，做扣减Money");
        accountService.decrease(order.getUserId()， order.getMoney());
        log.info("----->订单微服务开始调用账户，做扣减End");
    
        // 4 修改订单状态，从0到1，1代表已完成
        log.info("----->修改订单状态开始");
        orderDao.update(order.getUserId()， 0);
    
        log.info("----->下订单结束了，O(∩_∩)O哈哈~");
    }
    
   ```

7. 此时在测试

   发现发生异常后，直接回滚了，前面的修改操作都回滚了

### setat原理:

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071701108.png)

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071701232.png)

**seata提供了四个模式:**

AT、TCC、SAGA和XA事务模式。

<span style="color:red;font-weight:bolder;text-decoration:underline">AT模式</span>

**前提**

- 基于支持本地ACID事务的关系型数据库；

- Java应用，通过JDBC访问数据库。

**整体机制**

两阶段提交协议的演变：

- <span style="color:red;font-weight:bolder;text-decoration:underline">一阶段</span>：业务数据和回滚日志记录在同一个本地事务中提交，释放本地锁和连接资源。
- <span style="color:red;font-weight:bolder;text-decoration:underline">**二阶段**</span>：
  - 提交异步化，非常快速地完成。
  - 回滚通过一阶段的回滚日志进行反向补偿。 

**第一阶段:**

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071702152.png) 

在一阶段，Sea他会拦截”业务SQL“，

- 解析SQL语义，找到“业务SQL"<span style="color:red;font-weight:bolder;">要更新的业务数据，在业务数据被更新前，将其保存成"before image"</span>(<span style="color:red;font-weight:bolder;">**也就是将原数据保存一份，方便回滚**),</span>
- <span style="color:red;font-weight:bolder;">执行“业务SQL”更新业务数据</span>，在业务数据更新之后，<span style="color:red;font-weight:bolder;">更新后的数据也保存一份</span>
- 将其保存成“after image”,<span style="color:red;font-weight:bolder;">最后生成行锁。</span>

<span style="color:red;font-weight:bolder;">以上操作全部在一个数据库事务内完成，这样保证了一阶段操作的原子性。</span>

**二阶段之提交**:

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071702562.png)

**二阶段之回滚:**

二阶段如果是回滚的话，Seata就需要<span style='text-decoration:underline'>回滚</span>一阶段**<span style='text-decoration:underline'>已经执行的“业务SQL”</span>**，还原<span style="color:red;font-weight:bolder;">（补偿）</span>业务数据。

回滚方式便是用“**<span style='text-decoration:underline'>before image</span>**<span style='text-decoration:underline'>**”还原业务数据**</span>；但在还原前要首先要<span style='text-decoration:underline'>**校验脏写**</span>，对比“数据库当前业务数据”和“after image”<span style="color:red;font-weight:bolder;">(可能在回滚之前，其他请求已经成功修改过这条数据，那么当前就不能回滚了)</span>，如果两份数据完全一致就说明<span style='text-decoration:underline'>**没有脏写**</span>，可以还原业务数据，如果不一致就说明有脏写，出现脏写就需要转**<span style='text-decoration:underline'>人工处理</span>**。

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071702532.png)

**断点**:

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071702275.png)

**可以看到，他们的xid全局事务id是一样的，证明他们在一个事务下**

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071703900.png)

**before 和 after的原理就是**

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071703145.png) 

**在更新数据之前，先解析这个更新sql，然后查询要更新的数据，进行保存**



