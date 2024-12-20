SpringCloud升级，部分ss组件停用:

![image-20220625183733401](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071550986.png)

1. Eureka停用，可以使用zk作为服务注册中心
2. 服务调用，Ribbon准备停更，代替为LoadBalance
3. Feign改为OpenFeign
4. Hystrix停更，改为resilence4j或者阿里巴巴的sentienl
5. Zuul改为gateway
6. 服务配置Config，还有Apoll，改为 Nacos
7. 服务总线Bus改为Nacos

# 环境搭建:

## 1.创建父工程，pom依赖

```xml
<?xml version="1.0" encoding="UTF-8"?>

<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>org.atguigu.springcloud</groupId>
    <artifactId>cloud2020</artifactId>
    <version>1.0-SNAPSHOT</version>
    <modules>
        <module>cloud-provider-payment8001</module>
        <module>cloud-consumer-order80</module>
        <module>cloud-api-common</module>
        <module>cloud-eureka-server7001</module>
        <module>cloud-eureka-server7002</module>
        <module>cloud-provider-payment8002</module>
        <module>cloud-provider-payment8004</module>
        <module>cloud-consumerzk-order80</module>
        <module>cloud-provider-payment8006</module>
        <module>cloud-consumerconsul-order80</module>
        <module>cloud-consumer-feign-order80</module>
        <module>cloud-provider-hystrix-payment8001</module>
        <module>cloud-consumer-hystrix-feign-order80</module>
        <module>cloud-consumer-hystrix-dashboard9001</module>
        <module>cloud-gateway-gateway9527</module>
        <module>cloud-config-center-3344</module>
        <module>cloud-config-client3355</module>
        <module>cloud-config-client-3366</module>
        <module>cloud-stream-rabbitmq-provider8801</module>
        <module>cloud-stream-rabbitmq-consumer8802</module>
        <module>cloud-stream-rabbitmq-consumer8803</module>
        <module>cloudalibaba-provider-payment9001</module>
        <module>cloudalibaba-provider-payment9002</module>
        <module>cloudalibaba-consumer-nacos-order83</module>
        <module>cloudalibaba-config-nacos-client3377</module>
        <module>cloudAlibaba-sentinelservice8401</module>
        <module>cloudalibaba-provider-payment9003</module>
        <module>cloudalibaba-provider-payment9004</module>
        <module>cloudalibaba-consumer-nacos-order84</module>
        <module>seata-order-service-2001</module>
        <module>seata-storage-service</module>
        <module>seata-account-service2003</module>
    </modules>
    <packaging>pom</packaging>
    <!--  统一管理jar版本-->
    <properties>
        <project.build.sourceEncodging>UTF-8</project.build.sourceEncodging>
        <maven.compiler.source>1.8</maven.compiler.source>
        <maven.complier.target>1.8</maven.complier.target>
        <junit.version>4.12</junit.version>
        <log4j.version>1.2.17</log4j.version>
        <lombok.version>1.16.18</lombok.version>
        <mysql.version>5.1.47</mysql.version>
        <druid.version>1.1.16</druid.version>
        <mybatis.spring.boot.version>1.3.0</mybatis.spring.boot.version>
    </properties>
    <!--  子模块继承之后，提供作用：锁定版本和子module不用写groupId和verison-->
    <dependencyManagement>
        <dependencies>
            <dependency>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-dependencies</artifactId>
                <version>2.2.2.RELEASE</version>
                <type>pom</type>
                <scope>import</scope>
            </dependency>
            <dependency>
                <groupId>org.springframework.cloud</groupId>
                <artifactId>spring-cloud-dependencies</artifactId>
                <version>Hoxton.SR1</version>
                <type>pom</type>
                <scope>import</scope>
            </dependency>
            <dependency>
                <groupId>com.alibaba.cloud</groupId>
                <artifactId>spring-cloud-alibaba-dependencies</artifactId>
                <version>2.1.0.RELEASE</version>
                <type>pom</type>
                <scope>import</scope>
            </dependency>
            <dependency>
                <groupId>mysql</groupId>
                <artifactId>mysql-connector-java</artifactId>
                <version>${mysql.version}</version>
            </dependency>
            <dependency>
                <groupId>com.alibaba</groupId>
                <artifactId>druid</artifactId>
                <version>${druid.version}</version>
            </dependency>
            <dependency>
                <groupId>junit</groupId>
                <artifactId>junit</artifactId>
                <version>${junit.version}</version>
                <scope>test</scope>
            </dependency>
            <dependency>
                <groupId>org.projectlombok</groupId>
                <artifactId>lombok</artifactId>
                <version>${lombok.version}</version>
                <scope>provided</scope>
            </dependency>
            <dependency>
                <groupId>log4j</groupId>
                <artifactId>log4j</artifactId>
                <version>${log4j.version}</version>
            </dependency>
            <dependency>
                <groupId>org.mybatis.spring.boot</groupId>
                <artifactId>mybatis-spring-boot-starter</artifactId>
                <version>${mybatis.spring.boot.version}</version>
            </dependency>
        </dependencies>
    </dependencyManagement>


    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
                <configuration>
                    <fork>true</fork>
                    <addResources>true</addResources>
                </configuration>
            </plugin>
        </plugins>
    </build>
</project>

```

## 2.创建子模块pay模块

1. 建Module
2. 改POM，引入依赖
3. 写yml
4. 主启动类
5. 业务类

### 1.子模块名字:

 cloud\_pay\_8001

### 2.pom依赖

```xml
<dependencies>
    <dependency>
        <groupId>org.springframework.cloud</groupId>
        <artifactId>spring-cloud-starter-zipkin</artifactId>
        <version>2.2.1.RELEASE</version>
    </dependency>
    <dependency>
        <groupId>org.springframework.cloud</groupId>
        <artifactId>spring-cloud-starter-netflix-eureka-client</artifactId>
    </dependency>
    <!--包含了sleuth+zipkin-->
    <dependency>
        <groupId>org.atguigu.springcloud</groupId>
        <artifactId>cloud-api-common</artifactId>
        <version>1.0-SNAPSHOT</version>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>//图形监控
        <artifactId>spring-boot-starter-actuator</artifactId>
    </dependency>
    <dependency>
        <groupId>org.mybatis.spring.boot</groupId>
        <artifactId>mybatis-spring-boot-starter</artifactId>
    </dependency>
    <dependency>
        <groupId>com.alibaba</groupId>
        <artifactId>druid-spring-boot-starter</artifactId>
        <version>1.1.10</version>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-test</artifactId>
        <scope>test</scope>
    </dependency>
    <!-- https://mvnrepository.com/artifact/mysql/mysql-connector-java -->
    <dependency>
        <groupId>mysql</groupId>
        <artifactId>mysql-connector-java</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-jdbc</artifactId>
    </dependency>
    <dependency>
        <groupId>org.projectlombok</groupId>
        <artifactId>lombok</artifactId>
        <optional>true</optional>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-devtools</artifactId>
        <scope>runtime</scope>
        <optional>true</optional>
    </dependency>
</dependencies>
```

### 3.创建application.yml

```yml
server:
  port: 8001
spring:
  application:
    name: cloud-payment-service
  datasource:
    # 当前数据源操作类型
    type: com.alibaba.druid.pool.DruidDataSource
    # mysql驱动类
    driver-class-name: com.mysql.cj.jdbc.Driver
      url: jdbc:mysql://localhost:3306/db2019?useUnicode=true&characterEncoding=
        UTF-8&useSSL=false&serverTimezone=GMT%2B8
    username: root
    password: root
mybatis:
  mapper-locations: classpath*:mapper/*.xml
  type-aliases-package: com.atguigu.springcloud.entities
  #它一般对应我们的实体类所在的包，这个时候会自动取对应包中不包括包名的简单类名作为包括包名的别名。
  #多个package之间可以用逗号或者分号等来进行分隔（value的值一定要是包的全类名）
```

### 4.主启动类

```java
@SpringBootApplication
@EnableEurekaClient
public class PaymentMain8001 {
    public static void main(String[] args) {
        SpringApplication.run(PaymentMain8001.class,args);
    }
}
```

### 5.业务类

#### 1.sql

```sql
create table (
    id bigint(20) not null auto_increment comment 'id',
    serial varchar(200) default '',
    primary key(`id`)
)engine=InnoDB AUTO_INCREMENT=1 default charset=utf8
```

#### 2.实体类

```java
public class Payment implements Serializable{
  private Long id;
  private String serial;
}
```

#### 3.entity类

```java
public class CommontResult<T>{
    private Integer code ;
    private String message;
    private T data;
    public CommonResult(Integer code,String message){
        this(code,message,null);
    }
}
```

#### 4.dao层:

```java
@Mapper
public interface PaymentDao{
    public int create(Payment payment);
    public Payment getPaymentByID(@Param("id") Long id);
}
```

#### 5.mapper配置文件类

**在resource下，创建mapper/PayMapper.xml**

```xml
<mapper namespace="com.atguigu.springcloud.dao.PaymentDao">
    <insert id="create" parameterType="com.atguigu.springcloud.entities.Payment"
            useGeneratedKeys="true" keyProperty="id">
        insert into payment(serial) values(#{serial})
    </insert>
    <select id="getPaymentById" resultMap="BaseResultMap" paramterType='Long'>
        select id,serial from payment where id=#{id}
    </select>
    <resultMap id="BaseResultMap" type="com.atguigu.springcloud.entities.Payment">
        <id column="id" property="id" jdbcType="BIGINT"></id>
        <result column="serial" property="serial" jdbcType="VARCHAR"></result>
    </resultMap>
</mapper>
```

#### 6.写service和serviceImpl

```java
public interface PaymentService{
    public int create(Payment payment);
    public Payment getPaymentByID(@Param("id") Long id);
}
```

```java
@Service 
public class PaymentServiceImpl implements PaymentService{
    @Resource
    private PayementDao paymentDao;
    public int creae(Payment payment){
        return paymentDao.create(payment);
    }
    public Payment getPaymentByID(Long id){
        return paymentDao.getPaymentByID(id);
    }
}
```

#### 7.controller

```java
@RestController
@Slf4j
@RequestMapping
public class PaymentController {
    @Autowired
    private PaymentService paymentService;

    @Resource
    private DiscoveryClient discoveryClient;
    
    @Value("${server.port}")
    private String serverPort;
    
    @PostMapping(value = "/payment/create")
    public CommonResult Create(@RequestBody Payment payment){
        int i = paymentService.create(payment);
        log.info("插入结果{}",i);
        if(i>0){
            return new CommonResult(200,"插入成功,serverPort:"+serverPort,i);
        }else {
            return new CommonResult(400,"插入失败",null);
        }
    }
    @GetMapping(value = "/payment/getPaymentByid/{id}")
    public CommonResult getPaymentByid(@PathVariable String id){
        Payment payment = paymentService.getPaymentById(id);
        log.info("获取结果{}",payment);
        return new CommonResult(200,"获取成功,serverPort:"+serverPort,payment);
    }
}
```

## 3.热部署:

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-devtools</artifactId>
    <scope>runtime</scope>
    <optional>true</optional>
</dependency>
```

```xml
<!--cloud工程pom -->
<build>
    <plugins>
        <plugin>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-maven-plugin</artifactId>
            <configuration>
                <fork>true</fork>
                <addResources>true</addResources>
            </configuration>
        </plugin>
    </plugins>
</build>
```

## 4.order模块

1. 建Module
2. 改POM，引入依赖
3. 写yml
4. 主启动类
5. 业务类

### 1.pom

### 2.yml配置文件

```yml
server:
	port: 80
```

### 3.主启动类

### 4.复制pay模块的实体类，entity类

### 5.写controller类

 因为这里是消费者类，主要是消费，那么就没有service和dao，需要调用pay模块的方法， 并且这里还没有微服务的远程调用，那么如果要调用另外一个模块，则需要使用基本的api调用，使用RestTemplate调用pay模块，RestTemplate提供了多种便捷访问远程Http服务的方法，是一种简单便捷的访问restful服务模版类，是Spring提供的用于访问Rest服务的客户端模版工具类。

**使用**

使用RestTemplate访问restful接口非常简单粗暴无脑。（url，requestMap，ResponseBean.class）这三个参数分别代表REST请求地址/请求参数/HTTP响应转换被转换成的对象类型。    

 将restTemplate注入到容器

```java
@Configuration
public class ApplicationContextConfig{
    @Bean
    //@LoadBalanced 暂时注解掉，使用自定义负载
    public RestTemplate getRestTemplate(){
        return new RestTemplate();
    }
}
```

编写controller:

```java
@Slf4j
@RestController
public class OrderController {
    //    单机版
    private  static final  String PAYMENT_URL="http://localhost:8001"; 
    @Resource
    private RestTemplate restTemplate;


    @GetMapping("/consumer/payment/create")
    public CommonResult<Payment> create(Payment payment) {
        return restTemplate.postForObject(PAYMENT_URL + "/payment/create", payment, CommonResult.class);
    }

    @GetMapping("/consumer/payment/getId/{id}")
    public CommonResult<Payment> getId(@PathVariable("id") String id) {
        return restTemplate.getForObject(PAYMENT_URL + "/payment/getPaymentByid/" + id, CommonResult.class);
    }
}
```

## 5.重构

新建一个模块，将重复代码抽取到一个公共模块中

### 1.创建common模块

### 2.抽取公共pom

```xml
<dependencies>
    <dependency>
        <groupId>org.projectlombok</groupId>
        <artifactId>lombok</artifactId>
        <optional>true</optional>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-devtools</artifactId>
        <scope>runtime</scope>
        <optional>true</optional>
    </dependency>
    <dependency>
        <groupId>cn.hutool</groupId>
        <artifactId>hutool-all</artifactId>
        <version>5.7.3</version>
    </dependency>
</dependencies>

```

### 3.entity和实体类放入common中

![image-20231107173634263](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071736236.png) 

### 4.使用maven，将common模块打包(install)，

 其他模块引入common

# 2.服务注册与发现

## 6.Eureka:

前面我们没有服务注册中心，也可以服务间调用，为什么还要服务注册?

当服务很多时，单靠代码手动管理是很麻烦的，需要一个公共组件，统一管理多服务，包括服务是否正常运行，等

Eureka用于<span style="color:red">服务注册</span>**，目前官网**<span style="color:red">已经停止更新</span>

**什么是服务治理**

Spring Cloud封装了Netflix公司开发的Eureka模块来实现**服务治理**

在传统的rpc远程调用框架中，管理每个服务与服务之间的依赖关系比较复杂，管理比较复杂，

所以需要使用服务治理，管理服务于服务之间的依赖关系，可以实现服务调用、负载均衡、容错等，实现服务发现与注册。

**什么是服务注册与发现**

Eureka采用了CS的设计架构，Eureka Server作为服务注册功能的服务器，它是服务注册中信。而系统中的其他微服务，使用Eureka的客

户端连接到Eureka Server并维持心跳连接。这样系统的维护人员就可以通过Eureka Server来监控系统中各个微服务是否正常运行。

在服务注册与发现中，有一个注册中心。当服务器启动的时候，会把当前自己服务器的信息。比如服务地址、通讯地址等以别名方式注册

到注册中心上。另一方（消费者-服务提供者），以该别名的方式去注册中心上获取到实际的服务通讯地址，然后再实现本地RPC调用。

RPC远程调用框架核心设计思想：在于注册中心，因为使用注册中心管理每个服务与服务之间的一个依赖关系（服务治理概念）。在任何

rpc远程框架中，都会有一个注册中心（存放服务地址相关信息（接口地址））
![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071551573.png)

**<span style="color:blue;font:bold">Eureka包含两个组件：Eureka Server和Eureka Client</span>**

<span style="color:red;font-weight:bolder">Eureka Server</span>提供服务注册服务

各个微服务节点通过配置启动后，会在Eureka Server中进行注册，这样Eureka Server中的服务注册表中将会存储所欲可用服务节点的信

息，服务节点的信息可以在界面中直观看到。

<span style="color:red;font-weight:bolder">Eureka Client</span>通过注册中心进行访问

是一个Java客户端，用于简化Eureka Server 的交互，客户端同时也具备一个内置的、使用轮询(round-robin)负载算法的负载均衡器。在

应用启动后，将会向Eureka Server发送心跳(默认周期为30秒)。如果Eureka Server在多个心跳周期内没有接收到某个节点的心跳。

Eureka Server将会从服务注册表中把这个服务节点移除(默认90秒)

### 单机版eureka:

#### 1.创建项目cloud\_eureka\_server\_7001

#### 2.引入pom依赖

 eurka最新的依赖变了

1.X和2.X的对比说明

```xml
<!--以前的老版本（当前使用2018）-->
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-eureka</artifactId>
</dependency>

<!--现在新版本（当前使用2020.2）-->
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-netflix-eureka-server</artifactId>
</dependency>

```

#### 3.配置文件:

```yml
server:
  port: 7001

eureka:
  instance:
    #    hostname: localhost # eurka服务端的实例名称
    hostname: eureka7001.com
  client:
    #    不向euraka注册自己
    register-with-eureka: false
    #    false表示自己端就是注册中心，我的职责就是维护实例，并不需要去检索服务
    fetch-registry: false

    service-url:
      #      单机下配置
      #      设置与Eurka Server交互端地址查询服务和注册服务都需要依赖这个地址
      defaultZone: http://${eureka.instance.hostname}:${server.port}/eureka/

      #      集群下配置
      #defaultZone: http://eureka7002.com:7002/eureka/
  server:
    enable-self-preservation: false
    eviction-interval-timer-in-ms: 2000
```

#### 4.主启动类

```java
@SpringBootApplication
@EnableEurekaServer //启动euarka服务端
public class EurekaMain7001 {
    public static void main(String[] args) {
        SpringApplication.run(EurekaMain7001.class,args);
    }
}
```

#### 5.此时就可以启动当前项目了

#### 6.其他服务注册到eureka:

比如此时pay模块加入eureka:

##### 1.主启动类上，加注解@EnableEurekaClient，表示当前是eureka客户端

```java
@SpringBootApplication
@EnableEurekaClient
//@EnableDiscoveryClient
public class PaymentMain8001 {
    public static void main(String[] args) {
        SpringApplication.run(PaymentMain8001.class,args);
    }
}
```

##### 2.修改pom，引入Client的依赖

```xml
<!-- eureka-client -->
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-netflix-eureka-client</artifactId> 
</dependency>
```

##### 3.修改配置文件:

```yaml
eureka:
  client:
      #表示是否将自己注册进EurekaServer，默认为true。
      register-with-eureka: true
      #是否从Eureka Server抓取已有的注册信息，默认为true。单节点无所谓，集群必须设置为true，
      #才能配合ribbon使用负载均衡
      fetchRegistry: true
      service-url:
        defaultZone: http://localhost:7001/eureka
```

##### 4.pay模块重启，就可以注册到eureka中了

**order模块的注册是一样的**

### 集群版eureka:

#### 集群原理:

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071551465.png)

1.就是pay模块启动时，注册自己，并且自身信息也放入eureka
2.order模块，首先也注册自己，放入信息，当要调用pay时，先从eureka拿到pay的调用地址
3.通过HttpClient调用并且还会缓存一份到本地，每30秒更新一次

<span style="color:red">问题：微服务RPC远程服务调用最核心的是什么？</span>

高可用，试想你的注册中心只有一个only one。它出了故障就呵呵了，会导致整个服务环境不可用，所以解决办法：搭建Eureka注册中心集群，实现负载均衡+故障容错

**集群构建原理:**

 互相注册

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071551752.png)

#### 构建新erueka项目

名字:cloud\_eureka\_server\_7002

##### 1，pom文件:

 粘贴7001的即可

##### 2，配置文件:

 在写配置文件前，修改一下主机的hosts文件

```properties
127.0.0.1 eureka7001.com
127.0.0.1 eureka7002.com
127.0.0.1 eureka7003.com
```

首先修改之前的7001的eureka项目，因为多个eureka需要互相注册

```yaml
server:
  port: 7001
eureka:
  instance:
    # hostname: localhost
    hostname: eureka7001.com 
    #eureka服务端的实例名称
  client:
    # 不向euraka注册自己
    register-with-eureka: false
    # false表示自己端就是注册中心，我的职责就是维护实例，并不需要去检索服务
    fetch-registry: false
    service-url:
      # 单机下配置
      # 设置与Eurka Server交互端地址查询服务和注册服务都需要依赖这个地址
      defaultZone: http://eureka7002.com:7002/eureka/ #注意：这里指定的是7002的地址 
```

然后修改7002

**7002也是一样的，只不过端口和地址改一下**

##### 3，主启动类:

 复制7001的即可

##### 4，然后启动7001，7002即可

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071551929.png)

#### 将pay，order模块注册到eureka集群中:

##### 1，只需要修改配置文件即可:

```yaml
eureka:
  client:
    #表示是否将自己注册进EurekaServer，默认为true。
	register-with-eureka: true
	#是否从Eureka Server抓取已有的注册信息，默认为true。
	#单节点无所谓，集群必须设置为true，才能配合ribbon使用负载均衡
    fetch-registry: true
    service-url:
      #defaultZone: http://eureka7001.com:7001/eureka/
 		defaultZone: http://eureka7001.com:7001/eureka/,http://eureka7002.com:7002/eureka/
```

##### 2，两个模块都修改上面的都一样即可

 然后启动两个模块

 要先启动7001，7002，然后是pay模块8001，然后是order(80)

### 3，将pay模块也配置为集群模式:

#### 0，创建新模块，8002

 名称: cloud\_pay\_8002

#### 1,pom文件，复制8001的

#### 2,pom文件复制8001的

#### 3,配置文件复制8001的

 端口修改一下，改为8002

 服务名称不用改，用一样的

#### 4,主启动类，复制8001的

#### 5,mapper，service，controller都复制一份

 然后就启动服务即可

 此时访问order模块，发现并没有负载均衡到两个pay，模块中，而是只访问8001

 虽然我们是使用RestTemplate访问的微服务，但是也可以负载均衡的        

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071552575.png)

**<span style="color:red">注意这样还不可以，需要让RestTemplate开启负载均衡注解，还可以指定负载均衡算法，默认轮询</span>**

```java
@Configuration
public class RestTemplateConfig {
    @Bean
    @LoadBalanced
	//暂时注解掉，使用自定义负载，不能同时存在
    public RestTemplate getRestTemplate(){
        return new RestTemplate();
    }
}
```



### 4，修改服务主机名和ip在eureka的web上显示

比如修改pay模块

#### 1，修改配置文件:

```yaml
eureka:
  client:
    #表示是否将自己注册进EurekaServer，默认为true。
	register-with-eureka: true
	#是否从Eureka Server抓取已有的注册信息，默认为true。
	#单节点无所谓，集群必须设置为true，才能配合ribbon使用负载均衡
    fetch-registry: true
    service-url:
      #defaultZone: http://eureka7001.com:7001/eureka/ 单机版
 	   defaultZone: http://eureka7001.com:7001/eureka/,http://eureka7002.com:7002/eureka/ 
       #集群版
  instance:
    instance-id: payment8001
    prefer-ip-address: true #访问路径可以显示IP地址
```

### 5，eureka服务发现:

<span style="color:red;font-weight:bolder"><span style='text-decoration:underline'>对于注册进Eureka里面的微服务，可以通过服务发现来获得该服务的信息</span></span>

以pay模块为例

#### 1，首先添加一个注解，在controller中

```java
@RestController
@Slf4j
@RequestMapping
public class PaymentController {
    @Autowired
    private PaymentService paymentService;

    @Resource
    private DiscoveryClient discoveryClient;

    @Value("${server.port}")
    private  String serverPort;

    @GetMapping(value = "/payment/discovery")
    public Object discovery(){
        List<String> services = discoveryClient.getServices();//拿到所有注册的信息
        services.forEach(System.out::println);
        List<ServiceInstance> instances = discoveryClient.getInstances("CLOUD-PAYMENT-SERVICE");
        //拿到指定服务名称的所有服务的注册信息，比如pay模块，他们两个的名字都是一样的，所有这里返回的是一个list
        for (ServiceInstance instance : instances) {
            log.info("instance:"+instance.getHost()+",port:"+
                     instance.getPort()+","+"url:"+instance.getUri());
        }
        return this.discoveryClient;
    }
}
```

#### 2，在主启动类上添加一个注解

```java
@SpringBootApplication
@EnableEurekaClient
@EnableDiscoveryClient  //添加该注解
public class PaymentMain8001{
    public static void main(String[]){
         SpringApplication.run(PaymentMain8001.class,args);
    }
}
```

**然后重启8001.访问/payment/discover**y

### 6，Eureka自我保护:

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071552548.png)

**概述**

保护模式主要用于一组客户端和Eureka Server之间存在网络分区场景下的保护。一旦进入保护模式，**<span style="color:red">Eureka Server将会尝试保护其服务注册表中的信息，不再删除服务注册中的数据，也就是不会注销任何微服务</span>**

<span style="color:red;text-decoration:underline">**一句话：某个时刻某一个微服务不可用了，Eureka不会立刻清理，依旧会对该微服务的信息进行保存，属于CAP里面的AP分支**</span>

<span style="color:blue">**为什么会产生Eureka自我保护机制？**</span>

为了防止EurekaClient可以正常运行，但是与Eureka Server网络不通情况下EurekaServer<span style="color:red">**不会立刻**</span>将EurekaClient服务剔除

<span style="color:blue">**什么是自我保护模式？**</span>

默认情况下，如果EurekaServer在一定时间内没有接收到某个微服务实例的心跳，EurekaServer将会注销该实例(默认90秒)。但是当网络分区故障发生(延时、卡顿、拥挤)时，微服务与EurekaServer之间无法正常通信，以上行为可能变得非常危险了-----因为微服务本身其实是健康的，<span style="color:red">**此时本不应该注销这个微服务**</span>。Eureka通过"自我保护模式"来解决这个问题-----当EurekaServer节点在短时间内丢失过多客户端时(可能发生了网络分区故障)，那么这个节点就会进入自我保护模式。

<span style="color:red">**在自我保护模式中，EurekaServer会保护服务注册表中的信息，不再注销任何服务实例。**</span>

它的设计哲学就是宁可保留错误的服务注册信息，也不盲目注销任何可能健康的服务实例。\=\=\=><span style="color:red">**一句话讲解：好死不如赖活**</span>

综上，自我保护模式就是一种应对网络异常的安全保护措施。它的架构哲学是<span style="color:red">**宁可同时保留所有微服务（健康的微服务和不健康的微服务都会保留）也不盲目注销任何健康的微服务**</span>。使用自我保护模式，可以让Eureka集群更加的健壮、稳定。

![image-20221229112515222](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071552472.png) 

自我保护机制：默认情况下EurekaClient定时向EurekaServer端发送心跳包。如果EurekaServer端在一定时间内(默认90秒)没有收到

EurekaClient发送心跳包，便会直接从服务注册列表中剔除该服务，但是在短时间内(90秒内)丢失了大量的服务实例心跳，这时候

EurekaServer会开启自我保护机制，不会剔除该服务(该现象可能出现在如果网络不通，但是EurekaClient以为出现宕机，此时如果换做

别的注册中心如果一定时间内没有收到心跳，就会将剔除该服务，这样就出现了严重失误，因为客户端还能正常发送心跳，只是网络延迟

问题，而保护机制是为了解决此问题而产生的)

<span style="color:red">**eureka服务端配置:**</span>

出厂默认自我保护机制是开启的

```yaml
server:
	enable-self-preservation: false //可以禁用自我保护模式
```

**设置接受心跳时间间隔**

```yaml
eviction-interval-timer-in-ms: 2000
```

**客户端(比如pay模块):**

```yaml
eureka:
  client:
    register-with-eureka: true
    fetch-registry: true
    service-url:
      defaultZone: http://eureka7001.com:7001/eureka/
#      defaultZone: http://eureka7001.com:7001/eureka/,http://eureka7002.com:7002/eureka/
#心跳检测与续约时间
#开发时设置小些，保证服务关闭后注册中心能及时剔除服务
  instance:
    instance-id: payment8001
    prefer-ip-address: true
#    Eureka客户端向服务端法发送心跳的时间间隔，默认30秒
    lease-renewal-interval-in-seconds: 1
#    Eureka服务端子收到最后一次心跳后等待时间上限，默认为90秒，单位为秒，超时将剔除服务
	lease-expiration-duration-in-seconds: 2
```

**此时启动erueka和pay.此时如果直接关闭了pay，那么eureka会直接删除其注册信息**

## 7，Zookeeper服务注册与发现:

### 1，启动zk，到linux上，没有图形化界面

### 2，创建新的pay模块，

单独用于注册到zk中

名字 : cloud\_pay\_8003

#### 1，pom依赖

#### 2，配置文件

```yaml
#8004表示注册到zookeeper服务器的支付服务提供者端口号
server:
  port: 8004
#服务别名---- 注册zookeeper到注册中心名称
spring:
  application:
    name: cloud-provider-payment
    datasource:
      type: com.alibaba.druid.pool.DruidDataSource
  cloud:
    zookeeper:
      connect-string: 47.105.184.98:2181
```

#### 3，主启动类

```java
@SpringBootApplication
@EnableDiscoveryClient
public class PaymentMain8004 {
    public static void main(String[] args) {
        SpringApplication.run(PaymentMain8004.class,args);
    }
}
```

#### 4，controller

```java
@RestController
@Slf4j
public class PaymentController {

    @Value("${server.port}")
    private String serverPort;

    @GetMapping("/payment/zk")
    public String getZk(){
        return "springcloud with zookeeper: port: "+serverPort+",  "+ UUID.randomUUID().toString();
    }
}
```

#### 5，然后就可以启动

**此时启动，会报错，因为jar包与我们的zk版本不匹配**

解决:
修改pom文件，改为与我们zk版本匹配的jar包

```xml
<!-- SpringBoot整合zookeeper客户端 -->
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-zookeeper-discovery</artifactId>
    <!--先排除自带的zookeeper3.5.3-->
    <exclusions>
        <exclusion>
            <groupId>org.apache.zookeeper</groupId>
            <artifactId>zookeeper</artifactId>
        </exclusion>
    </exclusions>
</dependency>
<!--添加zookeeper3.4.9版本-->
<dependency>
    <groupId>org.apache.zookeeper</groupId>
    <artifactId>zookeeper</artifactId>
    <version>3.4.9</version>
</dependency>
```

**此时8003就注册到zk中了**

**我们在zk上注册的node是临时节点，当我们的服务一定时间内没有发送心跳**
**那么zk就会将这个服务的node删除了**

**这里测试，就不写service与dao什么的了**

### 3，创建order消费模块注册到zk

#### 1，创建项目

名字: cloud\_order\_zk\_80

#### 2，pom

#### 3，配置文件

```yaml
server:
  port: 80
spring:
  application:
    name: cloud-order-service
  cloud:
  #注册到zookeeper地址
    zookeeper:
      connect-string: 47.105.184.98:2181
```

#### 4，主启动类:

```java
@SpringBootApplication
@EnableDiscoveryClient
public class OrderZk80 {
    public static void main(String[] args) {
        SpringApplication.run(OrderZk80.class,args);
    }
}
```

#### 5，RestTemplate

```java
@Configuration
public class RestTemplateConfig {
    @Bean
    @LoadBalanced
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }
}
```

#### 6，controller

```java
@RestController
@Slf4j
public class Orderzk80Controller {
    public static final String INVOKE_URL = "http://cloud-provider-payment";
    @Resource
    RestTemplate restTemplate;

    @GetMapping("/payment/zk")
    public String getPaymentbyid() {
        log.warn("orderzk80");
        return restTemplate.getForObject(INVOKE_URL + "/payment/zk", String.class);
    }
}
```

**然后启动即可注册到zk**

#### 8，集群版zk注册:

只需要修改配置文件:

```yaml
server:
  port: 80
spring:
  application:
    name: cloud-order-service
  cloud:
  #注册到zookeeper地址
    zookeeper:
      connect-string: 47.105.184.98:2181
```

这个connect\-string指定多个zk地址即可

connect\-string: 1.2.3.4，2.3.4.5

## 8，Consul:

Consul是一套开源的分布式服务发现和配置管理系统，由HashiCorp公司用Go语言开发。

提供了微服务系统中的服务治理、配置中心、控制总线等功能，这些功能中的每一个都可以根据需要单独使用，也可以一起使用以构建全方位的服务网格，总之Consul提供了一种完整的服务网格解决方案。

它具有很多优点，包括：基于Raft协议，比较简洁：支持健康检查，同时支持HTTP和DNS协议，支持跨数据中心的WAN集群，提供图形界面，跨平台，支持Linux、Mac、Windows。

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071552794.png)

### 1.安装consul

需要下载一个安装包

- 管网安装说明：https://learn.hashicorp.com/consul/getting-started/install.html
- 下载完成后只有一个consul.exe文件：硬盘路径下双击运行，查看版本号信息
- 使用开发模式启动：
  - 启动命令：consul agent \-dev
  - 通过一下地址可以访问Consul的首页：http://localhost:8500
  - 结果页面

启动是一个命令行界面，需要输入consul agen\-dev启动

### 2，创建新的pay模块，8006

#### 1，项目名字

cloud\_consule\_pay\_8006

#### 2，pom依赖

#### 3，配置文件

```yaml
#Consul服务端口号
server:
  port: 8006
spring:
  application:
    name: cloud-provider-payment
    datasource:
      type: com.alibaba.druid.pool.DruidDataSource
#consul注册中心地址
  cloud:
    consul:
      host: 127.0.0.1
#      host: 47.105.184.98
      port: 8500
      discovery:
        service-name: ${spring.application.name} ###对外暴露的服务名称
```

#### 4，主启动类

```java
@SpringBootApplication
@EnableDiscoveryClient
public class PaymentMain8006 {
    public static void main(String[] args) {
        SpringApplication.run(PaymentMain8006.class,args);
    }
}
```

#### 5，controller

```java
@RestController
@Slf4j
public class PaymentController {
    @Value("${server.port}")
    private String serverPort;

    @GetMapping(value = "/payment/consul")
    public String getConsul(){
        return "springcloud with consul: port: "+serverPort+","+ UUID.randomUUID().toString();
    }
}
```

#### 6，启动服务

### 3，创建新order模块

cloud\-consul\-order\-80

#### 1，pom文件

#### 2，配置文件

```yaml
server:
  port: 80
spring:
  application:
    name: cloud-order-service
    datasource:
      type: com.alibaba.druid.pool.DruidDataSource
#consul注册中心地址
  cloud:
    consul:
#      host: 47.105.184.98
      host: 127.0.0.1
      port: 8500
      discovery:
        service-name: ${spring.application.name}
```

#### 3，主启动类

```java
@SpringBootApplication
@EnableDiscoveryClient
public class OrderConsul80 {
    public static void main(String[] args) {
        SpringApplication.run(OrderConsul80.class, args);
    }
}
```

#### 4，RestTemplate注册

配置类注册

```java
@Configuration
public class RestTemlateConfig {
    @Bean
    @LoadBalanced
    public RestTemplate restTemplate(){
        return new RestTemplate();
    }
}
```

#### 5，controller

```java
@Slf4j
@RestController
public class OrderConsul80Controller {

    @Resource
    private RestTemplate restTemplate;

    private  static final  String INVOKE_URL="http://cloud-provider-payment";
    @GetMapping("/payment/consul")
    public String getConsul(){
        return restTemplate.getForObject(INVOKE_URL+"/payment/consul",String.class);
    }
}
```

#### 6，启动服务，测试

## 9，三个注册中心的异同:

| 组件名    | 语言 | CAP  | 服务健康检查 | 对外暴露接口 | Spring Cloud集成 |
| --------- | ---- | ---- | ------------ | ------------ | ---------------- |
| Eureka    | Java | AP   | 可配支持     | HTTP         | 已集成           |
| Consul    | Go   | CP   | 支持         | HTTP/DNS     | 已集成           |
| Zookeeper | Java | CP   | 支持         | 客户端       | 已集成           |

<span style="color:red">**最多只能同时较好的满足两个。**</span>

CAP理论的核心是：<span style="color:red">**一个分布式系统不可能同时很好的满足一致性、可用性和分区容错性这三个需求，**</span>因此根据CAP原理将NoSQL数据库分成了满足CA原则、满足CP原则和满足AP原则三大类：

- CA \-单点集群，满足一致性、可用性的系统，通常在可扩性上不太强大。
- CP \-满足一致性、分区容忍性的系统，通常性能不是特别高。
- AP \-满足可用性、分区容忍性的系统，通常可能对一致性要求低一些。 

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071553960.png)

**CP架构**

当网络分区出现后，为了保证一致性，就必须拒接请求，否则无法保证一致性

**<span style="color:red">结论：违背了可用性A的要求，只满足一致性和分区容错，即CP</span>**

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071553447.png)

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071554789.png)

# 3.服务调用

## 10，Ribbon负载均衡:

Spring Cloud Ribbon是基于Netflix Ribbon实现的一套<span style="color:red">**客户端负载均衡的工具**</span>。

简单的说，Ribbon是Netflix发布的开源项目，主要功能是提供<span style="color:red">**客户端的软件负载均衡算法和服务调用。**</span>Ribbon客户端组件提供一系列的配置项如**连接超时、重试**等。简单的说，就是在配置文件中列出Load  Blancer(简称LB)后面的所有的机器，Ribbon会自动的帮助你**基于某种规则(如简单轮询/随机连接等)**去连接这些机器。我们很容易使用Ribbon实现自定义的负载均衡算法。

**Ribbon目前也进入维护，基本上不准备更新了**

- <span style="color:red;font-weight:bolder">能干嘛</span>
  - LB(负载均衡)
  
    - 集中式LB
  
    - 进程内LB
  
	- 前面我们讲解过了80通过轮训负载访问8001/8002
	
	- 一句话

<span style="color:red">**进程内LB(本地负载均衡)**</span>

将LB逻辑集成到消费方，消费方从服务注册中心获知有哪些地址可用，然后自己再从这些地址中选择出一个合适的服务器。<span style="color:red">**Ribbon就属于进程内LB，**</span>它只是一个类库，集成于消费方进程，消费方通过它来获取到服务提供方的地址<span style="color:red">**（本地jvm进程进行负载均衡）**</span>

<span style="color:red">**集中式LB(服务端负载均衡)**</span>

即在服务的消费方和提供方之间使用独立的LB设施（可以是硬件，如**F5**，也可以是软件，如**Nginx**）,由该设施负责把访问请求通过某种策略转发至服务的提供方；

**区别**

<span style="color:blue">**LB负载均衡（Load Balance）是什么**</span>

简单的说就是将用户的请求平摊的分配到多个服务商，从而达到系统的HA（高可用）。

常见的负载均衡有软件Nginx、LVS，硬件F5等。

<span style="color:blue">**Ribbon本地负载均衡客户端VSNginx服务端负载均衡区别**</span>

Nginx是服务器负载均衡，客户端所有请求都会交给Nginx，然后由Nginx实现转发请求，即负载均衡是由服务端实现的。

Ribbon本地负载均衡，在调用微服务接口时，会在注册中心上获取注册信息服务列表之后缓存到JVM本地，从而在本地实现RPC远程服务调用技术。

**Ribbon就是负载均衡+RestTemplate**

总结：Ribbon其实就是一个软负载均衡的客户端组件，它可以和其他所需请求的客户端结合使用，和eureka结合只是其中的一个实例。

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071554417.png)

Ribbon在工作时分成两步

第一步先选择EurekaServer，它优先选择在同一个区域内负载较少的server.

第二步再根据用户指定的策略，在从server取到的服务注册列表中选择一个地址。

其中Ribbon提供了多种策略：比如轮询、随机和根据响应时间加权。

### 使用Ribbon:

#### 1，认我们使用eureka的新版本时，它默认集成了ribbon:

```xml
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-netflix-eureka-client</artifactId>
</dependency>
```

**这个starter中集成了ribbon了**

#### 2，我们也可以手动引入ribbon

**放到order模块中，因为只有order访问pay时需要负载均衡**

```xml
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-netflix-ribbon</artifactId>
</dependency>
```

#### 3，RestTemplate类:

```java
//返回对象为响应体中数据转化成的对象，基本上可以理解为Json
@GetMapping("/consumer/payment/getId/{id}")
public CommonResult<Payment> getId(@PathVariable("id") String id) {
    return restTemplate.getForObject(PAYMENT_URL + "/payment/getPaymentByid/" + id, CommonResult.class);
}

@GetMapping("/consumer/payment/getEntity/{id}")
public CommonResult<Payment> getId1(@PathVariable("id") String id) {
    //返回对象为ResponseEntity对象，包含了响应中的一些重要信息，比如响应头、响应状态码、响应体等
    ResponseEntity<CommonResult> entity = 
        restTemplate.getForEntity(PAYMENT_URL + "/payment/getPaymentByid/" + id, CommonResult.class);
    if (entity.getStatusCode().is2xxSuccessful()) {
        return entity.getBody();//这个ResponseEntity中有判断，这里是判断，状态码是不是2xx,
    } else {
        return new CommonResult<>(444, "操作失败");
    }
}
```

```java
RestTemplate的:
	xxxForObject()方法，返回的是响应体中的数据
  	xxxForEntity()方法.返回的是entity对象，这个对象不仅仅包含响应体数据，还包含响应体信息(状态码等)
```

#### Ribbon常用负载均衡算法:

**IRule接口，Riboon使用该接口，根据特定算法从所有服务中，选择一个服务，**

IRule接口有7个实现类，每个实现类代表一个负载均衡算法

![image-20220627093455387](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071554180.png) 

#### 使用Ribbon:

**这里使用eureka的那一套服务**

官方文档明确给出了警告：

<span style="color:red">**这个自定义配置不能放在@ComponentScan所扫描的当前包下以及子包下，否则我们自定义的这个配置类就会被所有的Ribbon客户端所共享，达不到特殊化定制的目的。也就是不能放在主启动类所在的包及子包下**</span>

##### 1，修改order模块

##### 2，额外创建一个包

![image-20231109141502809](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311091415743.png) 

##### 3，创建配置类，指定负载均衡算法

```java
@Configuration
public class Myrule {
    @Bean
    public IRule myRule(){
        return new RandomRule();//定义为随机
    }
}
```

##### 4，在主启动类上加一个注解

```java
@SpringBootApplication
@EnableEurekaClient
@RibbonClient(name = "CLOUD-PAYMENT-SERVICE",configuration = Myrule.class)
public class OrderMain80 {
    public static void main(String[] args) {
        SpringApplication.run(OrderMain80.class, args);
    }
}
```

**表示，访问CLOUD_PAYMENT_SERVICE的服务时，使用我们自定义的负载均衡算法**

#### 自定义负载均衡算法:

##### 1，ribbon的轮询算法原理

<span style="color:red">**负载均衡算法：rest接口第几次请求数 % 服务器集群总数量 \= 实际调用服务器位置下标，每次服务重启动后rest接口计数从1开始**</span>

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071554633.png)

##### 2，自定义负载均衡算法:

**1，给**pay模块(8001，8002)，的controller方法添加一个方法，返回当前节点端口

```java
@Value("${server.port}")
private String serverPort;
@GetMapping("/payment/lb")
public String  getPayment(){
    return serverPort;
}
```

**2，修改order模块**

去掉@LoadBalanced

```java
@Configuration
public class RestTemlateConfig {
    @Bean
    //@LoadBalanced //注释掉
    public RestTemplate restTemplate(){
        return new RestTemplate();
    }
}
```

##### 3，自定义接口

```java
public interface LoadBalance {
    ServiceInstance instance(List<ServiceInstance> serviceInstances);
}
```

 **具体的算法在实现类中实现**

##### 4，接口实现类

```java
@Component
public class MyLoadBalanceImpl implements LoadBalance {
  private AtomicInteger atomicInteger = new AtomicInteger(0);
  //这个方法是获取下一个要调用服务的id
  public final int getAndIncrement() {
    int current;
    int next;
    do {
      current = this.atomicInteger.get();
      next = current >= 2147483647 ? 0 : current + 1;
    } while (!this.atomicInteger.compareAndSet(current, next));
      //调用CAS进行自旋锁，每次next+1
    System.out.println("*******第几次访问，next:" + next);
    return next;
  }
}
```

```java
@Override
public ServiceInstance instance(List<ServiceInstance> serviceInstances) {
  int size = serviceInstances.size();
  int index = 0;
  if (size > 0) {
    //getAndIncrement() 拿到id，进行取余得到真正要调用服务的下标
    index = getAndIncrement() % size;
  }
  return serviceInstances.get(index);
}
```



##### 5，修改controller:

```java
@Resource
private DiscoveryClient discoveryClient;

@Resource
private LoadBalance loadBalance;//自定义类
```

```java
@GetMapping("/consumer/payment/lb")
public String getPaymentLB() {
  //拿到指定服务下的所有服务
  List<ServiceInstance> instances = discoveryClient.getInstances("CLOUD-PAYMENT-SERVICE");
  if (instances == null || instances.size() < 0) {
    return null;
  }
  ServiceInstance instance = loadBalance.instance(instances);
  URI uri = instance.getUri();
  return restTemplate.getForObject(uri + "/payment/lb", String.class);
}
```

##### 6，启动服务，测试即可

## 11，OpenFeign

Feign是一个声明式WebService客户端。使用Feign能让编写Web Service客户端更加简单。

它的使用方法是<span style="color:red">**定义一个服务接口，然后在上面添加注解**</span>。Feign也支持可插拔式的编码器和解码器。Spring Cloud对Feign进行了封装，使其支持了Spring MVC标准注解和HttpMessageConverters。Feign可以与Eureka和Ribbon组合以支持负载均衡。

**是一个声明式的web客户端，只需要创建一个接口，添加注解即可完成微服务之间的调用**

<span style="color:blue">**Feign能干什么**</span>

Feign旨在使编写Java HTTP客户端变得更容易，就是远程调用其他服务。

前面在使用Ribbon+RestTemplate时，利用RestTemplate对http请求的封装处理，形成了一套模板化的调用方法。但是在实际开发中，由于对服务依赖的调用可能不止一处，<span style="color:red">**往往一个接口会被多处调用，所以通常都会针对每个微服务自行封装一些客户端类来包装这些依赖服务的调用。**</span>所以，Feign在此基础上做了进一步封装，由他来帮助我们定义和实现依赖服务接口的定义。在Feign的实现下，<span style="color:red">**我们只需创建一个接口并使用注解的方式来配置它（以前是Dao接口上面标注Mapper注解，现在是一个微服务接口上标准一个Feign注解即可），**</span>即可完成对服务提供方的接口绑定，简化了使用Spring Cloud Ribbon时，自动封装服务调用客户端开发量。

<span style="color:blue">**Feign集成了Ribbon**</span>

利用Ribbon维护Payment的服务列表信息，并且通过轮询实现了客户端的负载均衡。而与Ribbon不同的是，<span style="color:red">**通过fegin只需要定义服务绑定接口且以声明式的方法，**</span>优雅而简单的实现了服务调用

**就是A要调用B，Feign就是在A中创建一个一模一样的B对外提供服务的的接口，我们调用这个接口，就可以服务到B**

### **Feign与OpenFeign区别**

| <span style="color:red;">Feign</span>                        | <span style="color:red">OpenFeign</span>                     |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| Feign是Spring Cloud组件中的一个轻量级RESTful的HTTP服务客户端，Feign内置了Ribbon，用来做客户端负载均衡，去调用服务注册中心的服务。Feign的使用方式是：使用Feign的注解定义接口，调用这个接口，就可以调用服务注册中心的服务 | OpenFeign是Spring Cloud在Feign的基础上支持了SpringMVC的注解，如@RequestMapping等等。OpenFeign的@FeignClient可以解析SpringMVC的@RequestMapping注解下的接口，并通过动态代理的方式产生实现类，实现类中做负载均衡并调用其他服务。 |
| \<dependency> \<groupId>org.springframework.cloud\</groupId>     \<artifactId>spring-cloud-starter-feign\</artifactId>\</dependency> | \<dependency>     \<groupId>org.springframework.cloud\</groupId>     \<artifactId>spring-cloud-starter-openfeign\</artifactId>\</dependency> |

### 使用OpenFeign

之前的服务间调用，我们使用的是ribbon\+RestTemplate
现在改为使用Feign

#### 1，新建一个order项目，用于feign测试

名字cloud\_order\_feign\-80

#### 2，pom文件

#### 3，配置文件

```yaml
server:
  port: 80
spring:
  application:
    name: cloud-order-service
eureka:
  client:
    register-with-eureka: true
    fetch-registry: true
    service-url:
      defaultZone: http://localhost:7001/eureka/
  #      defaultZone: http://eureka7001.com:7001/eureka/,http://eureka7002.com:7002/eureka/
```

#### 4，主启动类

```java
@SpringBootApplication
@EnableFeignClients
public class OrderFeiginMain80 {
    public static void main(String[] args) {
        SpringApplication.run(OrderFeiginMain80.class,args);
    }
}
```

#### 5，fegin需要调用的其他的服务的接口

```java
@Component
/*指定这个接口对应要调用的微服务的服务名称*/
@FeignClient(name = "CLOUD-PAYMENT-SERVICE",configuration = FeignLogLevelConfig.class)
public interface PaymentFeignService {

  @GetMapping(value = "/payment/getPaymentByid/{id}")
  CommonResult getPaymentByid(@PathVariable("id") String id);

  @GetMapping(value = "/payment/feign/timout")
  String paymentFeignTimemout();
}
```

#### 6，controller

```java
@RestController
@Slf4j
public class OrderFeignController {
  @Resource
  private PaymentFeignService paymentFeignService;
  @GetMapping(value = "/payment/get/{id}")
  public CommonResult<Payment> getPaymentById(@PathVariable("id") String id){
    return paymentFeignService.getPaymentByid(id);
  }
}
```

#### 7测试:

启动两个erueka(7001，7002)

启动两个pay(8001，8002)

启动当前的order模块

**Feign默认使用ribbon实现负载均衡**

### OpenFeign超时机制:

**OpenFeign默认等待时间是1秒，超过1秒，直接报错**

#### 1，设置超时时间，修改配置文件:

**因为OpenFeign的底层是ribbon进行负载均衡，所以它的超时时间是由ribbon控制**

```yaml
#设置feign客户端超时时间，(OpenFeign默认支持ribbon)
ribbon:
#指的是建立连接所用的时间，适用于网络状况正常的情况下，两端连接所用的时间
ReadTimeout: 5000
#指的是建立连接后从服务器读取到可用资源所用的时间，默认为5秒
ConnectTimeout: 5000
```

### OpenFeign日志:

Feign提供了日志打印功能，我们可以通过配置来调整日志级别，从而了解Feign中Http请求的细节。说白了就是对<span style="color:red">**Feign接口的调用情况进行监控和输出**</span>

**OpenFeign的日志级别有:**

```java
public static enum Level {
  NONE,
  BASIC,
  HEADERS,
  FULL;

  private Level() {
  }
}
```

#### 1，使用OpenFeign的日志:

**实现在配置类中添加OpenFeign的日志类**

```java
@Configuration
public class FeignLogLevelConfig {
  @Bean
  public Logger.Level feignLoglevelConfig(){
    return  Logger.Level.FULL;
  }
}
```

#### 2，为指定类设置日志级别:

```java
@Component
@FeignClient(name = "CLOUD-PAYMENT-SERVICE",configuration = FeignLogLevelConfig.class)
public interface PaymentFeignService {

}
```

**配置文件中:**

```yaml
logging:
  # 开启OpenFeign的日志功能，设置日志级别
    level:
      #feign日志以什么级别监控哪个接口
      com.atguigu.springcloud.service.PaymentFeignService: debug
```

#### 3，启动服务即可

# 4.服务降级:

## 12，Hystrix服务降级

<span style="color:blue">**服务雪崩**</span>

多个微服务之间调用的时候，假设微服务A调用微服务B和微服务C，微服务B和微服务C又调用了其他的微服务。这就是所谓的<span style="color:red">**"扇出"**</span>。如果扇出的链路上某个微服务的调用响应时间过长或者不可用，对微服务A的调用就会占用越来越多的系统资源，进而引起系统崩溃，所谓的<span style="color:red">**"雪崩效应"**</span>。

对于高流量的应用来说，单一的后端依赖可能会导致<span style="color:red">**所有服务器上的所有资源都会在几秒内饱和**</span>。比失败更糟糕的是，这些应用程序还可能导致服务之间的延迟增加，备份队列，线程和其他系统资源紧张，导致整个系统发生更多的级联故障。这些都表示需要对故障和延迟进行隔离和管理，以便单个依赖关系的失败，不能取消整个应用程序或系统。

所以，通常当你发现一个模块下的某个实例失败后，这时候这个模块依然还会接收流量，然后这个有问题的模块还调用了其他的模块，这样就会发生级联故障，或者叫雪崩。

Hystrix是一个用于处理分布式系统的<span style="color:red">**延迟**</span>和<span style="color:red">**容错**</span>的开源库，在分布式系统里，许多依赖不可毕淼的会调用失败，比如超时、异常等，Hystrix能够保证在一个依赖出问题的情况下，<span style="color:red">**不会导致整体服务失败，避免级联故障，以提高分布式系统的弹性。**</span>

"断路器"本身是一种开关装置，当某个服务单元发生故障之后，通过断路器的故障监控（类似熔断保险丝），<span style="color:red">**向调用方返回一个符合预期的、可处理的备选响应（Fallback），而不是长时间的等待或者抛出调用方无法处理的异常**</span>，这样就保证了服务调用方的线程不会被长时间、不必要地占用，从而避免了故障在分布式系统中的蔓延，乃至雪崩。

![image-20221229161827362](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071555267.png) 

### hystrix中的重要概念:

#### 1，服务降级

**比如当某个服务繁忙，不能让客户端的请求一直等待，应该立刻返回给客户端一个备选方案**

#### 2，服务熔断

**当某个服务出现问题，卡死了，不能让用户一直等待，需要关闭所有对此服务的访问，**然后调用服务降级

#### 3，服务限流

**限流，比如秒杀场景，不能访问用户瞬间都访问服务器，限制一次只可以有多少请求**

### 使用hystrix，服务降级:

#### 1，创建带降级机制的pay模块 :

名字: cloud\-hystrix\-pay\-8007

##### 2，pom文件

##### 3，配置文件

```yaml
server:
  port: 8001
spring:
  application:
    name: cloud-provider-hystrix-payment
eureka:
  client:
    register-with-eureka: true
    fetch-registry: true
    service-url:
      defaultZone: http://eureka7001.com:7001/eureka/
```

##### 4，主启动类

```java
@SpringBootApplication
@EnableEurekaClient
public class PaymentHystrix8001 {
    public static void main(String[] args) {
        SpringApplication.run(PaymentHystrix8001.class, args);
    }
}
```

##### 5，service

```java
@Service
public class PaymentHystrixService {
  //服务降级
  public String payment_ok(Integer id) {
    return "线程池：" + Thread.currentThread().getName()
      + "payment_ok, id: " + id + "\t" + "哈哈";
  }
  public String payment_timeout(Integer id) {
    int time = 13;
    try {
      TimeUnit.SECONDS.sleep(time);
    } catch (InterruptedException e) {
      e.printStackTrace();
    }
    return "线程池：" + Thread.currentThread().getName() 
      + "payment_timeout, id: " + id + "\t" + "哈哈" + "耗时：" + time + "秒";
  }
}
```

##### 6,  controller

```java
@RestController
@Slf4j
public class paymentController {
    @Resource
    private PaymentHystrixService paymentHystrixService;
    @Value("${server.port}")
    private String sererPort;

    @GetMapping(value = "/payment/hystrix/ok/{id}")
    public String paymentInfo_ok(@PathVariable("id") Integer id) {
        String result = paymentHystrixService.payment_ok(id);
        log.info(">>>>>>result:" + result);
        return result;
    }

    @GetMapping(value = "/payment/hystrix/timeout/{id}")
    public String paymentInfo_timeout(@PathVariable("id") Integer id) {
        String result = paymentHystrixService.payment_timeout(id);
        log.info(">>>>>>result:" + result);
        return result;
    }
}
```

##### 7，先测试:

此时使用压测工具，并发20000个请求，请求会延迟的那个方法，
压测中，发现，另外一个方法并没有被压测，但是我们访问它时，却需要等待，这就是因为被压测的方法它占用了服务器大部分资源，导致其他请求也变慢了

##### 8，先不加入hystrix，

#### 2，创建带降级的order模块:

##### 1，名字:  cloud\-hystrix\-order\-80

##### 2，pom

##### 3，配置文件

```yaml
server:
  port: 80
spring:
  application:
    name: cloud-order-hystrix-feign-service
eureka:
  client:
    register-with-eureka: true
    fetch-registry: true
    service-url:
      defaultZone: http://eureka7001.com:7001/eureka/
```

##### 4，主启动类

```java
@SpringBootApplication
@EnableFeignClients
@EnableHystrix
@EnableCircuitBreaker
public class OrderHystrixFeignMain80 {
    public static void main(String[] args) {
        SpringApplication.run(OrderHystrixFeignMain80.class,args);
    }
}
```

##### 5，远程调用pay模块的接口:

```java
@Component
@FeignClient(value = "CLOUD-PROVIDER-HYSTRIX-PAYMENT")
public interface PaymentFeignService {
    @GetMapping(value = "/payment/hystrix/ok/{id}")
    String paymentInfo_ok(@PathVariable("id") String id);

    @GetMapping(value = "/payment/hystrix/timeout/{id}")
    String paymentInfo_timeout(@PathVariable("id") Integer id);

}
```

##### 6，controller:

```java
@Slf4j
@RestController 
public class OrderHystrixFeiginController {
    @Resource
    private PaymentFeignService paymentFeignService;
    @GetMapping("/consumer/hystrix/paymentok/{id}")
    public String paymentInfo_ok(@PathVariable("id") String id){
        String result = paymentFeignService.paymentInfo_ok(id);
        return  result;
    }
    
    @GetMapping("/consumer/hystrix/paymenttimeout/{id}")
    public String paymentFeignTimemout(@PathVariable("id") Integer id) {
        String s = paymentFeignService.paymentInfo_timeout(id);
        return s;
    }
}
```

##### 7，测试

 启动order模块，访问pay

 再次压测2万并发，发现order访问也变慢了

**问题现象：**

8000同一层次的其他接口服务被困死，因为tomcat线程池里面的工作线程已经被挤占完毕，80此时调用8001，客户端访问响应缓慢，转圈圈

**解决:**

![202311071555850](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071555850.png)

<span style="color:red">调用者（80)自己出故障或有自我要求（自己的等待时间小于服务提供者)，自己处理降级</span>

#### 3，配置服务降级:

##### 1，修改pay模块

###### 1，为service的指定方法(会延迟的方法)添加@HystrixCommand注解

![202311071555560](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071555560.png)

###### 2，主启动类上，添加激活hystrix的注解

```java
@SpringBootApplication
@EnableEurekaClient
@EnableDiscoveryClient
@EnableCircuitBreaker
public class PaymentHystrix8001 {
  public static void main(String[] args) {
    SpringApplication.run(PaymentHystrix8001.class, args);
  }
}
```

###### 3，触发异常

![202311071555704](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071555704.png)

![202311071555521](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071555521.png)**可以看到，也触发了降级**

##### 2，修改order模块，进行服务降级

一般服务降级，都是放在客户端(order模块)，

我们自己配置过的热部署方式对Java代码的改动明显，但对@HystrixCommand内属性的修改建议重启微服务

###### 1，修改配置文件:

```yaml
feign:
  hystrix:
    enabled: true
```

###### **2，主启动类添加直接，启用hystrix:**

```java
@SpringBootApplication
@EnableFeignClients
@EnableHystrix
@EnableCircuitBreaker
public class OrderHystrixFeignMain80 {
    public static void main(String[] args) {
        SpringApplication.run(OrderHystrixFeignMain80.class,args);
    }
}
```

###### 3，修改controller，添加降级方法什么的

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071555300.png)

###### 4，测试

启动pay模块，order模块，

**注意:，这里pay模块和order模块都开启了服务降级**

 但是order这里，设置了1.5秒就降级，所以访问时，一定会降级

##### 4，重构:

**上面出现的问题:**
1，降级方法与业务方法写在了一块，耦合度高

 2.每个业务方法都写了一个降级方法，重复代码多

##### **解决重复代码的问题**:

**配置一个全局的降级方法，所有方法都可以走这个降级方法，至于某些特殊创建，再单独创建方法**

###### 1，创建一个全局方法

```java
public String paymentglobalHandler() {
    return "我是消费者order80的全局handler" + "哈哈~~~~+++++";
}
```

###### 2，使用注解指定其为全局降级方法(默认降级方法)

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071555505.png)

<span style="color:red;font-weight:bolder">@DefaultProperties(defaultFallback="")</span>

- 每个方法配置一个服务降级方法，技术上可以，实际上傻X
- N除了个别重要核心业务有专属，其他普通的可以通过@DefaultProperties(defaultFallback="")同意跳转到统一处理结果页面
- 通用的和独享的各自分开，避免了代码膨胀，合并减少了代码量

###### 3，业务方法使用默认降级方法:

![202311071555015](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071555015.png)

###### 4，测试:

![202311071555801](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071555801.png) 

##### 解决代码耦合度的问题:

修改order模块，这里开始，pay模块就不服务降级了，服务降级写在order模块即可

###### 1，Payservice接口是远程调用pay模块的，我们这里创建一个类实现service接口，在实现类中统一处理异常

![202311071555912](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071555912.png)

###### 2，修改配置文件:添加:

```yaml
feign:
  hystrix:
    enabled: true
```

###### 3，让PayService的实现类生效:

![202311071555631](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071555631.png)

**它的运行逻辑是:
	当请求过来，首先还是通过Feign远程调用pay模块对应的方法，但是如果pay模块报错，调用失败，那么就会调用PayMentFalbackService类的当前同名的方法，作为降级方法**

###### 4，启动测试

启动order和pay正常访问\-\-ok

**此时将pay服务关闭，order再次访问**

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071555814.png) 

可以看到，并没有报500错误，而是降级访问**实现类**的同名方法；这样，即使服务器挂了，用户要不要一直等待，或者报错

问题:

**这样虽然解决了代码耦合度问题，但是又出现了过多重复代码的问题，每个方法都有一个降级方法**

### 使用服务熔断:

```
类比保险丝达到最大服务访问后，直接拒接访问，拉闸限电，然后调用服务降级的方法并返回友好提示。
就是保险丝---->服务的降级---->进而熔断--->恢复调用链路
```

**比如并发达到1000，我们就拒绝其他用户访问，在有用户访问，就访问降级方法**

<span style="color:blue">**熔断机制概述**</span>

熔断机制是应对雪崩效应的一种微服务链路保护机制。当扇出链路的某个微服务出错不可用或响应时间太长时，会进行服务的**<span style='text-decoration:underline'>降级</span>**，进而**熔断该节点微服务的调用**，快速返回错误的响应信息。

当检测到该节点微服务调用<span style="color:red;text-decoration:underline">**响应正常后，恢复调用链路**</span>。

在Spring  Cloud框架里，熔断机制通过Hystrix实现。Hystrix会监控微服务间调用的状况，当失败的调用到一定阈值，缺省是5秒内20次调用失败，就会启动熔断机制。熔断机制的注解是@HystrixCommand。

#### 1，修改前面的pay模块

##### **1，修改Payservice接口，添加服务熔断相关的方法:**

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071556646.png)

这里属性整体意思是:
10秒之内(窗口，会移动)，如果并发**超过**10个，或者10个并发中，失败了6个，就开启熔断器

```java
@HystrixCommand(fallbackMethod = "paymenetCircuitBreaker_fallback", commandProperties = {
  //开启断路器
  @HystrixProperty(name = "circuitBreaker.enabled", value = "true"),
  //请求次数超过了峰值，断路器将会从关闭变为打开
  @HystrixProperty(name = "circuitBreaker.requestVolumeThreshold", value = "10"),
  //时间范围
  @HystrixProperty(name = "circuitBreaker.sleepWindowInMilliseconds", value = "10000"),
  //失败率达到多少后跳闸
  @HystrixProperty(name = "circuitBreaker.errorThresholdPercentage", value = "60")
})
public String paymenetCircuitBreaker(@PathVariable("id") Integer id) 
```

涉及到断路器的三个重要参数：快照时间窗/请求总数阈值/错误百分比阈值

1. 快照时间窗：断路器确定是否打开需要统计一些请求和错误数据，而统计的时间范围就是快照时间窗，默认为最近的10秒；
2. 请求总数阈值：在快照时间窗内，必须满足请求总数阈值才有资格熔断。默认为20，意味着在10秒内，如果该hystrix命令的调用次数不足20次，即使所有的请求都超时或其他原因失败，断路器都不会打开；
3. 错误百分比阈值：当请求总数在快照时间窗内超过了阈值，比如发生了30次调用，如果在这30次调用中，有15次发生了超时异常，也就是超过50%的错误百分比，在默认设定50%阈值情况下，这时候就会将断路器打开；

IdUtil是Hutool包下的类，这个Hutool就是整合了所有的常用方法，比如UUID，反射，IO流等工具方法什么的都整合了

![202311071556752](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071556752.png)

断路器的打开和关闭，是按照一下5步决定的
    1，并发此时是否达到我们指定的阈值
    2，错误百分比，比如我们配置了60%，那么如果并发请求中，10次有6次是失败的，就开启断路器
    3，上面的条件符合，断路器改变状态为open(开启)
    4，这个服务的断路器开启，所有请求无法访问
    5，在我们的时间窗口期，期间，尝试让一些请求通过(半开状态)，如果请求还是失败，证明断路器还是开启状态，服务没有恢复
    如果请求成功了，证明服务已经恢复，断路器状态变为close关闭状态

##### 2，修改controller

添加一个测试方法;

```java
//服务熔断
@GetMapping(value = "/payment/circuit/{id}")
public String paymentCircuitBreaker(@PathVariable("id") Integer id) {
  String result = paymentService.paymentCircuitBreaker(id);
  log.info(">>>>>>result:" + result);
  return result;
} 
```

##### 3，测试:

启动pay，order模块

<span style="background-color:yellow">多次访问，并且错误率超过60%:</span>

![202311071557811](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071557811.png) 

此时服务熔断，此时即使访问正确的也会报错:

![202311071557593](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071557593.png) 

**但是，当过了几秒后，又恢复了**

 因为在10秒窗口期内，它自己会尝试接收部分请求，发现服务可以正常调用，慢慢的当错误率低于60%，取消熔断

### Hystrix所有可配置的属性:

**全部在这个方法中记录，以成员变量的形式记录，**

 以后需要什么属性，查看这个类即可

![202311071557987](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071557987.png) 

### 总结:

![202311071558776](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071558776.png)

**当断路器开启后:**

1. 再有请求调用的时候，将不会<span style="color:red">调用主逻辑</span>，而是直接**调用降级fallback**。通过断路器，实现了自动地发现错误并将降级逻辑切换为主逻辑，将少响应延迟的效果

1. 原来的主逻辑要如何恢复呢？

  对于这一问题，hystrix也为我们实现了<span style='color:red;font-weight:bolder'>自动恢复</span>功能。
  当断路器打开，对主逻辑进行<span style='color:red;font-weight:bolder'>熔断之后</span>，Hystrix会启动一个<span style='color:red;font-weight:bolder'>休眠时间窗，在这个时间窗内，降级逻辑是临时的成为主逻辑，</span><span style='color:red;font-weight:bolder'>当休眠时间窗到期，断路器将进入半开状态，释放一次请求到原来的主逻辑上，</span>如果此次请求正常返回，那么断路器将继续闭合，断路器关闭，主逻辑恢复，如果这次请求依然有问题，断路器继续进入打开状态，<span style='color:red;font-weight:bolder'>休眠时间窗重新计时</span>。

**其他参数:**

![202311071558006](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071558006.png)

![202311071558526](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071558526.png)

![202311071558446](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071558446.png)

![202311071558039](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071558039.png)

![202311071558278](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071558278.png)

**熔断整体流程:**

- 1.请求进来，首先查询缓存，如果缓存有，直接返回
    如果缓存没有，\=\=\=\>2
-  2.查看断路器是否开启，如果开启的，Hystrix直接将请求转发到降级返回，然后返回
    如果断路器是关闭的，
    - 判断线程池等资源是否已经满了，如果已经满了，也会走降级方法
    - 如果资源没有满，判断我们使用的什么类型的Hystrix，决定调用构造方法还是run方法，然后处理请求；
      然后Hystrix将本次请求的结果信息汇报给断路器，因为断路器此时可能是开启的；(因为断路器开启也是可以接收请求的)
      断路器收到信息，判断是否符合开启或关闭断路器的条件，如果本次请求处理失败，又会进入降级方法；如果处理成功，判断处理是否超时，如果超时了，也进入降级方法；最后，没有超时，则本次请求处理成功，将结果返回给controller

### Hystrix服务监控:

#### HystrixDashboard

除了隔离依赖服务的调用以外，Hystrix还提供了<span style="color:red">准实时的调用监控（Hystrix Dashboard）</span>，Hystrix会持续地记录所有通过Hystrix发起的请求的执行信息，并以统计报表和图形的形式展示给用户，包括每秒执行多少请求多少成功，多少失败等。Netflix通过hystrix\-metrics\-event\-stream项目实现了对以上指标的监控。Spring Cloud也提供了Hystrix Dashboard的整合，对监控内容转化成可视化界面。

#### 2，使用HystrixDashboard:

##### 1，创建项目:

名字: cloud\_hystrixdashboard\_9001

##### 2，pom文件

##### 3，配置文件

```yaml
server:
	port: 9000
```

##### 4，主启动类

```java
@SpringBootApplication
@EnableHystrixDashboard
//表示开启HystrixDashboard
public class HystrixDashBoard9001 {
    public static void main(String[] args) {
        SpringApplication.run(HystrixDashBoard9001.class,args);
    }
}
```

##### 5，修改所有pay模块(8001，8002，8003...)

**他们都添加一个pom依赖:**

```xml
<dependency>
    <!-- actuator监控信息完善-->
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-actuator</artifactId>
</dependency>
```

之前的pom文件中都添加过了，**这个是springboot的监控组件**

##### 6，启动9001即可

 访问: **localhost:9001/hystrix**

##### 7，注意，此时仅仅是可以访问HystrixDashboard，并不代表已经监控了8001，8002

 如果要监控，还需要配置:(8001为例)

**8001的主启动类添加:**

```java
@SpringBootApplication
@EnableEurekaClient
@EnableDiscoveryClient
@EnableCircuitBreaker
public class PaymentHystrix8001 {
    public static void main(String[] args) {
        SpringApplication.run(PaymentHystrix8001.class, args);
    }
    /**
    * 此配置是为了服务监控而配置，与服务容错本身无关，SpringCloud升级后坑，
    * ServletRegistrationBean因为Springboot的默认路径不是"/hystrix.stream",
    * 只要在自己的项目里配置上下面的Servlet就可以了
    */
    @Bean
    public ServletRegistrationBean getServlet() {
        HystrixMetricsStreamServlet streamServlet = new HystrixMetricsStreamServlet();
        ServletRegistrationBean registrationBean = new ServletRegistrationBean(streamServlet);
        registrationBean.setLoadOnStartup(1);
        registrationBean.addUrlMappings("/actuator/hystrix.stream");
        registrationBean.setName("HystrixMetricsStreamServlet");
        return registrationBean;
    }
    
}
```

**其他8002，8003都是一样的**

##### 8，到此，可以启动服务

启动7001，8001，9001

**然后在web界面，指定9001要监控8001:**

![202311071559133](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071559133.png)

##### 

![202311071559108](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071559108.png)

![202311071600786](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071600786.png)

![202311071600277](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071600277.png)

![202311071600496](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071600496.png)

![202212291705063](https://gitee.com/wowosong/pic-md/raw/master/202212291705063.png)

# 5.服务网关:

zuul停更了，

## 13，GateWay

Gateway是在Spring生态系统之上构建的API网关服务，基于Spring 5，Spring Boot 2 和Project Reactor等技术。Gateway旨在提供一种简单而有效的方式来对API进行路由，以及提供一些强大的过滤器功能，例如：熔断、限流、重试等。

SpringCloud Gateway是SpringCloud的一个全新项目，基于Spring 5.0\+Spring Boot 2.0和Project Reactor等技术开发的网关，它旨在为微服务架构提供一种简单有效的统一的API路由管理方式。

SpringCloud Gateway作为Spring Cloud生态系统中的网关，目标是替代Zuul，在Spring Cloud 2.0以上版本中，没有对新版的Zuul2.0以上最新高性能版本进行集成，仍然还是**使用的Zuul1.x非Reactor模式的老版本**。而**为了提升网关的性能**，**Spring Cloud Gateway是基于WebFlux框架事项的，而WebFlux框架底层则使用了高性能的Reactor模式通信框架Netty**。

Spring Cloud Gateway的目标提供统一的路由方式且基于Filter链的方式提供了网关基本的功能。例如：安全、监控/指标，和限流。

**Gateway之所以性能好，因为底层使用WebFlux，而webFlux底层使用netty通信(NIO)**

![202311071600418](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071600418.png)

### GateWay的特性:

Spring Cloud Gateway具有如下特性：

- <span style="color:red">**基于Spring Framework 5，Project Reactor 和Spring Boot 2.0进行构建；**</span>
- 动态路由：能够匹配任何请求属性；
- 可以对路由指定Predicate(断言)和Filter(过滤器)；
- 集成Hystrix的断路器功能；
- 集成Spring Cloud服务发现功能；
- 易于编写的Predicate(断言)和Filter(过滤器)；
- 请求限流功能；
- 支持路径重写。

### GateWay与zuul的区别:

在Spring Cloud Finchley正式版之前，Spring Cloud推荐的网关是Netflix提供的Zuul：

1. Zuul 1.x，是一个基于阻塞I/O的API Gateway
2. Zuul 1.x<span style="color:red">**基于Servlet 2.5使用阻塞架构**</span>它不支持**<span style='text-decoration:underline'>任何长连接(如WebSocket)</span>**Zuul的设计模式和Nginx较像，<span style='text-decoration:underline'>**每次I/O操作**</span>都是从<span style='text-decoration:underline'>**工作线程中选择一个执行**</span>，<span style='text-decoration:underline'>**请求线程被阻塞到工作线程完成**</span>，但是差别是Nginx用C\+\+实现，Zuul用Java实现，而JVM本身会有第一次加载较慢的情况，使得Zuul的性能相对较差。
3. Zuul 2.x理念更先进，想**<span style='text-decoration:underline'>基于Netty非阻塞和支持长连接</span>**，但SpringCloud目前还没有整合。Zuul2.x的性能较Zuul1.x有较大提升。在性能方面，根据官方提供的基准测试，SpringCloud Gateway的RPS(每秒请求数)是Zuul的1.6倍。
4. Spring Cloud Gateway建立在Spring Framework 5、Project Reactor和Spring Boot 2之上，使用**<span style='text-decoration:underline'>非阻塞API</span>**。
5. Spring Cloud Gateway还支持WebSocket，并且与Spring紧密集成拥有更好的开发体验

### zuul1.x的模型:

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071600439.png)

<span style="color:blue">**上述模式的缺点：**</span>

Servlet是一个简单的网络IO模型，当请求进入servlet container时，Servlet Container就会为其绑定一个线程。在<span style="color:blue">**并发不高的场景下**</span>这种模式是适用的。但是<span style='text-decoration:underline'>**一旦高并发**</span>(比如抽风用jmeter压)，<span style='text-decoration:underline'>**线程数量就会上涨，而线程资源代价是昂贵的(上下文切换，内存消耗大)严重影响请求的处理时间**</span>。在一些简单业务场景下，不希望为每个request分配一个线程，只需要1个或几个线程就能应对极大并发的请求，这种业务场景下Servlet模型没有优势。

所以Zuul 1.x是<span style="color:blue">**基于Servlet之上的一个阻塞式处理模型**</span>，即Spring实现了处理所有request请求的一个Servlet(DispatcherServlet)并由该Servlet阻塞式处理。所以Spring Cloud Zuul无法摆脱Servlet模型的弊端。

### 什么是webflux:

**是一个非阻塞的web框架，类似springmvc这样的**

传统的Web框架，比如说：structs2，springmvc等都是<span style="color:blue;text-decoration:underline">**基于Servlet API与Servlet容器基础之上运行的。**</span>但是<span style="color:blue;text-decoration:underline">**在Servlet 3.1之后有了异步非阻塞的支持。**</span>而**<span style='text-decoration:underline'>WebFlux是一个典型非阻塞异步的框架。它的核心是基于Reactor的相关API实现的</span>**。相对于传统的web框架来说，它可以运行在诸如Netty，Undertow及支持Servlet3.1的容器上。非阻塞式\+函数式编程(Spring 5必须让你使用Java 8)

Spring WebFlux是Spring 5.0引入的新的响应式框架，区别于Spring MVC，它不需要依赖Servlet API，它是完全异步非阻塞的，并且基于Reactor来实现响应式流规范。

### GateWay的一些概念:

#### 1，路由:

<span style='text-decoration:underline'>路由是构建网关的基本模块，它由ID，目标URI，一系列的断言和过滤器组成，如果断言为true则匹配该路由</span>

就是根据某些规则，将请求发送到指定服务上

#### 2，断言:

参考的是Java8的java.util.function.Predicate

开发人员可以匹配HTTP请求中的<span style="color:red">**所有内容**</span>（例如请求头或请求参数），<span style="color:red">**如果请求与断言相匹配则进行路由。**</span>

就是判断，如果符合条件就是xxxx，反之yyyy

#### 3，过滤:

**<span style='text-decoration:underline'>指的是Spring框架中GatewayFilter的实例，使用过滤器，可以在请求被路由前或之后对请求进行修改。</span>**

**路由前后，过滤请求**

### GateWay的工作原理:

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071600751.png) 

客户端向Spring Cloud Gateway发出请求。然后在Gateway Handler Mapping（类似MVC的映射器）中找到与请求<span style="color:red">**相匹配的路由**</span>，将其发送到Gateway Web Handler。

Handler再通过指定的<span style="color:red">**过滤器链来将请求发送到我们实际的服务执行业务逻辑，然后返回**</span>。

过滤器之间用虚线分开是因为过滤器可能会在发送代理请求之前（"pre")或之后("post")执行业务逻辑。

Filter在"pre"类型的过滤器可以做参数校验、权限校验、流量监控、日志输出、协议转换等，在"post"类型的过滤器中可以做响应内容、响应头的修改，日志的输出、流量监控等有着非常重要的作用。

### 使用GateWay:

想要新建一个GateWay的项目

名字:    cloud\_gateway\_9527

#### 1，pom

#### 2，配置文件

```yaml
server:
  port: 9572
spring:
  application:
    name: cloud-gateway9572-service
  cloud:
    gateway:
      discovery:
        locator:
          enabled: true
eureka:
  client:
    register-with-eureka: true
    fetch-registry: true
    service-url:
      defaultZone: http://eureka7001.com:7001/eureka/ 
```

#### 3，主启动类

```java
@SpringBootApplication
@EnableEurekaClient
@EnableDiscoveryClient
public class Gateway9572 {
    public static void main(String[] args) {
        SpringApplication.run(Gateway9572.class,args);
    }
}

```

#### 4，针对pay模块，设置路由:

<span style="color:red">**我们目前不想暴露8001端口，希望在8001外面套一层9527**</span>

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071601200.png)

**修改GateWay模块(9527)的配置文件:**

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071601121.png)

这里表示，

 当访问localhost:9527/payment/get/1时，

 路由到localhost:8001/payment/get/1

#### 5，开始测试

**启动7001，8001，9527**

如果启动GateWay报错
可能是GateWay模块引入了web和监控的starter依赖，需要移除

访问:

 localhost:9527/payment/get/1

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071601791.png)

#### 6，GateWay的网关配置，

​        **GateWay的网关配置，除了支持配置文件，还支持硬编码方式**

#### 7，使用硬编码配置GateWay:

##### 创建配置类:

```java
@Configuration
public class GatewayConfig {
    @Bean
    //javaconfig方式配置
    public RouteLocator routeLocator(RouteLocatorBuilder builder) {
        //id为test1对应配置文件中的routes
        RouteLocator build = builder.routes().route("test1", r -> r.path("/guonei").uri("http://news.baidu.com/guonei")).build();
        // 当访问localhost:9527/guonei时，路由到http://news.baidu.com/guonei
        return build;
    }
}
```

#### 8，然后重启服务即可

### 重构:

上面的配置虽然首先了网关，但是是在配置文件中写死了要路由的地址

现在需要修改，不指定地址，而是根据微服务名字进行路由，我们可以在注册中心获取某组微服务的地址

需要:

 1个eureka，2个pay模块

#### 修改GateWay模块的配置文件:

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071601903.png)

#### 然后就可以启动微服务.测试

### Pridicate断言:

Spring Cloud Gateway将路由匹配作为Spring WebFlux HandlerMapping基础架构的一部分。

Spring Cloud Gateway包括许多内置的Route Predicate工厂。所有这些Predicate都与HTTP请求的不同属性匹配。多个Route Predicate可以进行组合

Spring Cloud Gateway创建Route对象时，使用RoutePredicateFactory创建Predicate对象，Predicate对象可以赋值给Route。Spring Cloud Gateway包含许多内置的Route Predicate Factories。

所有这些谓词都匹配HTTP请求的不同属性。多种谓词工厂可以组合，并通过逻辑and。

**我们之前在配置文件中配置了断言:**

```yaml
routes:
	- id: payment_route #路由的ID，没有固定规则但要求唯一
	  uri: lb://cloud-payment-service #匹配后提供服务的路由地址
	  #uri: http://localhost:8001
	  predicates:
        - Path= /payment/getPaymentByid/** #断言，路径相匹配的进行路由
```

**这个断言表示，如果外部访问路径是指定路径，就路由到指定微服务上**

可以看到，这里有一个Path，这个是断言的一种，断言的类型:

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071601813.png)

```java
After:
	可以指定，只有在指定时间后，才可以路由到指定微服务
```

```yaml
- id: payment_route2 #路由的ID，没有固定规则但要求唯一
  uri: lb://cloud-payment-service #匹配后提供服务的路由地址
# uri: http://localhost:8001
  predicates:
   - Path= /payment/lb/** #断言，路径相匹配的进行路由
   - After=2021-11-24T16:41:45.278+08:00[Asia/Shanghai]
```

 这里表示，只有在**2020年的2月21的15点51分37秒**之后，访问**才可以路由**

 在此之前的访问，都会报404

**如何获取当前时区?**

```java
public static void main(String[] args) {
    final ZonedDateTime now = ZonedDateTime.now();//默认时区
    System.out.println(now); 
}
```

```
before:
   与after类似，他说在指定时间之前的才可以访问
   between:
   需要指定两个时间，在他们之间的时间才可以访问
```

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071601568.png)

```
cookie:
  只有包含某些指定cookie(key，value)，的请求才可以路由
```

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071601313.png)

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071601838.png) 

```java
Header:
   只有包含指定请求头的请求，才可以路由
```

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071601094.png)

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071602679.png) 

测试:
![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071602923.png)

```
host:
	只有指定主机的才可以访问，
    比如我们当前的网站的域名是www.aa.com
    那么这里就可以设置，只有用户是www.aa.com的请求，才进行路由
```

```yaml
 - Host=**.somehost.org,**.anotherhost.org
```

Host Route Predicate接收一组参数，**一组匹配的域名列表**，这个模板是一个ant分割的模板，用\.号作为分隔符。它通过参数中的**主机地址作为匹配规则**。

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071602417.png)

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071602435.png)

可以看到，如果带了域名访问，就可以，但是直接访问ip地址.就报错了

```
method:
  只有指定请求才可以路由，比如get请求...
```

```yaml
- id: method_route
    uri: https://www.example.org
    predicates:
    	- Method=GET
```

```java
path:
	只有访问指定路径，才进行路由
    比如访问，/abc才路由
```

```yaml
- id: payment_route2
  uri: lb://cloud-payment-service
# uri: http://localhost:8001
  predicates:
    - Path= /payment/lb/**
```

```java
Query:
   必须带有请求参数才可以访问
```

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071603287.png) 

### Filter过滤器:

路由过滤器可用于修改进入的HTTP请求和返回的HTTP响应，路由过滤器只能指定路由进行使用。Spring Cloud Gateway内置了多种路由过滤器，他们都由GatewayFilter的工厂类来产生

#### 生命周期:

**在请求进入路由之前，和处理请求完成，再次到达路由之前**

#### 种类:

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071603778.png)  

GateWayFilter，单一的过滤器

**与断言类似，比如闲置，请求头，只有特定的请求头才放行，反之就过滤**:

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071603976.png)

GlobalFilter，全局过滤器:

#### **自定义过滤器:**

实现两个接口

```java
@Component
@Slf4j
public class myGatewayFilter implements GlobalFilter, Ordered {
    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        log.info("*************myGatewayFilter*************:{}",new Date());
        String username = exchange.getRequest().getQueryParams().getFirst("username");
        //获取到请求参数username
        //如果username为空，就直接过滤掉，不走路由
        if(username==null){
            exchange.getResponse().setStatusCode(HttpStatus.FORBIDDEN);
            log.info("*************username：{}，非法用户*************",username);
            return exchange.getResponse().setComplete();
        }
        return chain.filter(exchange);//反之，调用下一个过滤器，也就是执行
    }

    @Override
    public int getOrder() {
        return 0;
    }
}
```

​    **然后启动服务即可，因为过滤器通过@Component已经加入到容器了**

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071603294.png)  

 ![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071603384.png)

# 6.服务配置:

## Spring Config分布式配置中心:

**微服务面临的问题**

**可以看到，每个微服务都需要一个配置文件，并且，如果有几个微服务都需要连接数据库**
**那么就需要配4次数据库相关配置，并且当数据库发生改动，那么需要同时修改4个微服务的配置文件才可以**

所以有了Springconfig配置中心

SpringCloud Config为微服务架构中的微服务提供<span style='text-decoration:underline;font-weight:bolder'>集中化的外部配置支持</span>**，配置服务器为<span style="color:red"><span style='text-decoration:underline;font-weight:bolder'>各个不同微服务应用</span></span>的所有环境提供了一个<span style="color:red;text-decoration:underline;font-weight:bolder">中心化的外部匹配</span>。

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071603879.png)

SpringCloud Config分为<span style="color:red">**服务端和客户端两部分。**</span>

服务端也称为<span style="color:red">**分布式配置中心，它是一个独立的微服务应用**</span>，用来连接配置服务器并为客户端提供获取配置信息，加密/解密信息等访问接口。

客户端则是通过指定的配置中心来管理应用资源，以及与业务相关的配置内容，并在**<span style='text-decoration:underline'>启动的时候从配置中心获取和加载配置信息</span>**。**<span style='text-decoration:underline'>配置服务器默认采用git来存储配置信息</span>**，这样就有助于对环境配置进行版本管理，并且可以通过git客户端工具来方便的管理和访问配置内容。

- 集中**管理配置**文件
- 不同环境不同配置，动态化的配置更新，分环境部署比如dev/test/prod/beta/release
- 运行期间**动态调整**配置，不在需要在每个服务部署的机器上编写配置文件，**服务会向配置中心统一拉取配置自己的信息**
- 当配置发生变动时，服务**不需要重启**即可感知到配置的变化并应用新的配置
- 将配置信息以REST接口的形式暴露，**post、curl访问刷新均可**........

### 使用配置中心:

#### 0，使用github作为配置中心的仓库:

**初始化git环境:**

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071603486.png)

#### 1，新建config模块:

名字:   cloud\-config\-3344

#### 2，pom

#### 3，配置文件

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071604647.png)

#### 4，主启动类

```java
@SpringBootApplication
@EnableEurekaClient
@EnableConfigServer 
//启动配置中心的服务端
@RefreshScope
public class ConfigServerMain3344 {
    public static void main(String[] args) {
        SpringApplication.run(ConfigServerMain3344.class,args);
    }
}
```

#### 5，修改hosts:

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071604923.png)

#### 6，配置完成

测试，3344是否可以从github上获取配置

启动3344    (要先启动eureka)

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071604081.png)

它实际上就是，读取到配置文件中的GitHub的地址，然后拼接上/master/config\-dev.yml

#### 7，读取配置文件的规则:

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071604980.png)

**2**，

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071604791.png)

**这里默认会读取master分支，因为我们配置文件中配置了**

```yaml
spring:
  application:
    name: cloud-config-center3344
  cloud:
    config:
      server:
        git:
          #搜索目录
          search-paths: springcloud-config
          uri: https://gitee.com/wowosong/springcloud-config.git 
          #gitee的git仓库名字
          username: 164644354@qq.com
          password: Huangluo03270254
      #读取分支
      label: master
```

**3**

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071604371.png)

注意，这个方式读取到的配置是json格式的

**所有规则:**

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071604782.png) 

### 2，创建配置中心客户端:

#### 1，创建config客户端项目

名字:    cloud\-config\-client\-3355

#### 2，pom

#### 3，配置文件

注意这个配置文件就不是application.yml

 而是bootstrap\.yml

这个配置文件的作用是，先到配置中心加载配置，然后加载到application\.yml中

application\.yml是用户级的资源配置项

bootstrap.yml是<span style='text-decoration:underline;font-weight:bolder'>系统级的</span>，<span style="color:red;font-weight:bolder">优先级更加高</span>

Spring Cloud会创建一个"Bootstrap Context"，作为Spring应用的"Application Context"的<span style="color:red">**父上下文**</span>。初始化的时候，"Bootstrap Context"负责**<span style="color:blue;text-decoration:underline">从外部源</span>加载配置属性并解析配置**。这两个上下文共享一个从外部获取的"Environment"。

**<span  style="color:blue;text-decoration:underline">"Bootstrap"属性有高优先级</span>**，默认情况下，<span style="color:blue;text-decoration:underline">**它们不会被本地配置覆盖**</span>。"Bootstrap Context"和"Application Context"有着不同的约定，所以新增了一个"Bootstrap.yml"文件，保证"Bootstrap Context"和"Application Context"配置的分离。

<span style="color:red">**要将Client模块下的application\.yml文件改为bootstrap\.yml，这是很关键的，**</span>

**<span  style="color:blue;text-decoration:underline">因为bootstrap.yml是比application\.yml先加载的。bootstrap\.yml优先级高于application\.yml</span>**

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071604056.png)

#### 4，主启动类:

```java
@SpringBootApplication
@EnableEurekaClient
public class ConfigClient3355 {
    public static void main(String[] args) {
        SpringApplication.run(ConfigClient3355.class,args);
    }
} 
```

#### 5，controller类

就是上面提到的，以rest风格将配置对外暴露

```java
@RestController
public class ConfigClientController {
    @Value("${config.info}")
    private String configInfo;

    @GetMapping(value = "getInfo")
    public String getInfo() {
        return configInfo;
    }
} 
```

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071604606.png) 

**如果客户端运行正常，就会读取到github上配置文件的，config.info下的配置**

#### 6，测试:

启动3344，3355

 访问3355的/configInfo

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071604054.png) 

#### 7，问题::

```
上面3355确实获取到了配置文件，但是如果此时配置文件修改了，3355是获取不到的
3344可以实时获取到最新配置文件，但是3355却获取不到
除非重启服务
```

#### **8，实现动态刷新:**

##### 1，修改3355，添加一个pom依赖:

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-actuator</artifactId>
</dependency> 
```

##### 2，修改配置文件，添加一个配置:

```yaml
#暴露监控端点
management:
  endpoints:
    web:
      exposure:
        include: "*" 
```

##### 3，修改controller:添加RefreshScope注解

```java
@RestController
@RefreshScope
public class ConfigClientController {
    @Value("${config.info}")
    private String configInfo;

    @GetMapping(value = "getInfo")
    public String getInfo() {
        return configInfo;
    }
} 
```

##### 4，此时重启服务

**此时3355还不可以动态获取**

因为此时，还需要**外部发送**post请求通知3355

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071605588.png) 

**此时在刷新3355，发现可以获取到最新的配置文件了，这就实现了动态获取配置文件，因为3355并没有重启**

具体流程就是:

 我们启动好服务后

 运维人员，修改了配置文件，然后发送一个post请求通知3355

 3355就可以获取最新配置文件

**问题:**

 如果有多个客户端怎么办(3355，3356，3357.....)

 虽然可以使用shell脚本，循环刷新

 但是，可不可以使用广播，一次通知??

 这些springconfig做不到，需要使用springcloud Bus消息总线

# 7.消息总线:

## SpringCloud Bus:

<span style="color:red">**Spring Cloud Bus配合Spring Cloud Config使用可以实现配置的动态刷新。**</span>

![image-20230106222614592](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071605599.png) 

<span style="color:red">**Spring Cloud Bus能管理和传播分布式系统间的消息，就像一个分布式执行器，可用于广播状态更改、事件推送等，也可以当作微服务间的通信通道。**</span>

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071605284.png)

注意，这里两张图片，就代表两种广播方式

 图1:        **它是Bus直接通知给其中一个客户端，由这个客户端开始蔓延，传播给其他所有客户端**

 图2:        **它是通知给配置中心的服务端，有服务端广播给所有客户端**

**为什么被称为总线?**

<span style="color:blue">**什么是总线**</span>

在微服务架构的系统中，通常会使用<span style="color:red">**轻量级的消息代理**</span>来构建一个公用的消息主题，并让系统中所有微服务实例都连接上来。由于<span style="color:red">**该主题中产生的消息会被所有实例监听和消费，所以称它为消息总线**</span>。在总线上的各个实例，都可以方便地广播一些需要让其他连接在该主题上的实例都知道的消息。

<span style="color:blue">**基本原理**</span>

ConfigClient实例都监听MQ中同一个topic(默认是SpringCloudBus)。当一个服务刷新数据的时候，它会把这个信息放入到Topic中，这样其他监听同一Topic的服务就能得到通知，然后去更新自身的配置。

**就是通过消息队列达到广播的效果**
**我们要广播每个消息时，主要放到某个topic中，所有监听的节点都可以获取到**

### 使用Bus:

#### 1，配置rabbitmq环境:

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071605459.png)

#### **2，之前只有一个配置中心客户端，这里在创建一个**

 **复制3355即可，创建为3366**

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071605869.png)

全部复制3355的即可

#### 2，使用Bus实现全局广播

**Bus广播有两种方式:**

 **就是上面两个图片的两种方式**

- 利用消息总线触发一个客户端/bus/refresh，而刷新所有客户端的配置
- 利用消息总线触发一个服务端ConfigServer的/bus/refresh端点，而刷新所有客户端的配置

**这两种方式，第二种跟合适，因为:**

 **第一种的缺点:**

- **打破了微服务的职责单一性，因为微服务本身是业务模块，它本不应该承担配置刷新的职责。**
- 破坏了微服务各节点的对等性。<span style="color:red">**因为第一种，有一个客户端需要额外的承担刷新职责，而其他的客户端却只有业务职责**</span>
- **有一定的局限性。例如，微服务在迁移时，它的网路地址常常会发生变化，此时如果要做到自动刷新，那就会增加更多的修改**

#### **配置第二种方式:**

##### **1，配置3344(配置中心服务端):**

###### 1，修改配置文件:

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071605609.png) 

###### 2，添加pom

**springboot的监控组件，和消息总线**

```xml
<!-- 添加消息总线RabbitMQ支持--> 
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-bus-amqp</artifactId>
</dependency>

<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-actuator</artifactId>
</dependency> 
```

##### 2，修改3355(配置中心的客户端)

###### 1，pom:

```xml
<!-- 添加消息总线RabbitMQ支持--> 
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-bus-amqp</artifactId>
</dependency>

<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-actuator</artifactId>
</dependency>  
```

###### 2，配置文件:

**注意配置文件的名字，要改为bootstrap\.yml**

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071605642.png) 

![image-20231107160612888](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071606729.png) 

##### 3，修改3366(也是配置中心的客户端)

 修改与3355是一模一样的

##### 4，测试

启动7001，3344，3355，3366

此时修改GitHub上的配置文件

**此时只需要刷新3344，即可让3355，3366动态获取最新的配置文件**

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071606273.png) 

其原理就是:

<span style="color:blue">**基本原理**</span>

ConfigClient实例都监听MQ中同一个topic(默认是<span style="color:red">**SpringCloudBus**</span>)。当一个服务刷新数据的时候，它会把这个信息放入到Topic中，这样其他监听同一Topic的服务就能得到通知，然后去更新自身的配置。

**所有客户端都监听了一个rabbitMq的topic，我们将信息放入这个topic，所有客户端都可以送到，从而实时更新**

#### 配置定点通知

 就是只通知部分服务，比如只通知3355，不通知3366

```
公式：http://localhost:3344/actuator/bus-refresh/{destination}
```

```
/bus-refresh请求不再发送到具体的服务实例上，而是发给config server并通过destination参数类指定需要更新配置的服务或实例
```

**只通知3355**

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071606214.png)

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071606138.png) 

**可以看到，实际上就是通过<span style="color:red">微服务的名称+端口号</span>进行指定**

# 8.消息驱动:

## Spring Cloud Stream:

**现在一个很项目可能分为三部分:**

```
前端--->后端---->大数据
```

​    **而后端开发使用消息中间件，可能会使用RabbitMq**
​    **而大数据开发，一般都是使用Kafka，**
​    那么一个项目中有多个消息中间件，对于程序员，因为人员都不友好

而Spring Cloud Stream就类似jpa，屏蔽底层消息中间件的差异，程序员主要操作Spring Cloud Stream即可，不需要管底层是kafka还是rabbitMq。

**<span style='text-decoration:underline'>屏蔽底层消息中间件的差异，降低切换成本，统一消息的编程模型</span>** 

### <span style="color:blue">什么是Spring Cloud Stream</span>

官方定义Spring Cloud Stream是一个构建消息驱动微服务的框架。

应用程序通过inputs(生产者)或者outputs(消费者)来与Spring Cloud Stream中binder对象交互。<span style="color:red">**我们主要就是操作binder对象与底层mq交换**</span>。

通过我们配置来binding(绑定)，而Spring Cloud Stream的binder对象负责与消息中间件交互。

所以我么只需要搞清楚如何与Spring Cloud Stream交互就可以方便使用消息驱动的方式。

通过使用Spring Integration来连接消息代理中间件以实现消息事件驱动。

Spring Cloud Stream为一些供应商的消息中间件产品提供了个性化的自动化配置实现，引用了发布-订阅、消费组、分区的三个核心概念。

<span style="color:red">**目前仅支持RabbitMQ、Kafka**</span>

<span style="color:blue">**为什么用Cloud Stream**</span>

比方说我们用到了RabbitMQ和Kafka，由于这两个消息中间件的架构上的不同，像RabbitMQ有exchange，Kafka有Topic和Partitions分区。

![SpringCloudStream的4](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071609626.png)

这些中间件的差异性导致我们实际项目开发给我们造成了一定的困扰，我们如果用了两个消息队列的其中一种，后面的业务需求，我想往另外一种消息队列进行迁移，这时候无疑就是一个灾难性的，<span style="color:red">**一大堆东西都要重新推倒重新做**</span>，因为它跟我们的系统耦合了，这时候SpringCloud Stream给我们提供了一种解耦合的方式。

### **Spring Cloud Stream是怎么屏蔽底层差异的?**

在没有绑定器这个概念的情况下，我们的SpringBoot应用要直接与消息中间件进行信息交互的时候，由于各消息中间件构建的初衷不同，它们的实现细节上会有较大的差异性。

通过定义绑定器作为中间层，<span style="color:red">**完美地实现了应用程序与消息中间件细节之间的隔离。**</span>

通过向应用程序暴露统一的<span style="color:blue">**Channel通道**</span>，使得应用程序不需要再考虑各种不同的消息中间件实现。

<span style="color:red">**通过定义绑定器Binder作为中间层，实现了应用程序与消息中间件细节之间的隔离。**</span>

**绑定器:**

<span style="color:red">**Binder**</span>

- **INPUT对应于消费者**
- **OUTPUT对应于生产者**

<span style="color:red">**Binder**</span>

在没有绑定器这个概念的情况下，我们的SpringBoot应用要直接与消息中间件进行信息交互的时候，由于各消息中间件构建的初衷不同，它们的实现细节上会有较大的差异性。通过定义绑定器作为中间层，<span style="color:red">**完美地实现了应用程序与消息中间件细节之间的隔离。**</span>Stream对消息中间件的进一步封装，可以做到代码层面对中间件的无感知，甚至于动态的切换中间件（RabbitMQ切换为Kafka)，使得微服务开发的高度解耦，服务可以更多地关注自己的业务流程。

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071609168.png)

### **Spring Cloud Stream 通信模式:**

**Stream中的消息通信方式遵循了发布-订阅模式**

Topic主题进行广播

- **在RabbitMQ就是Exchange**
- **在Kafka中就是Topic**

### Spring Cloud Stream的业务流程:

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071609673.png)

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071610356.png)

**Source和Sink：**

**简单的可理解为参照对象是Spring Cloud Stream自身，从Stream发布消息就是输出，接受消息就是输入。**

**Channel**

通道，是队列Queue的一种抽象，在消息通讯系统中就是实现存储和转发的媒介。

```
类似flume中的channel，source，sink 估计是借鉴(抄袭)的
source用于获取数据(要发送到mq的数据)
channel类似SpringCloudStream中的中间件，用于存放source接收到的数据，或者是存放binder拉取的数据    
```

### 常用注解和api:

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071610698.png)

### 使用SpringCloudStream:

需要创建三个项目，一个生产者，两个消费者

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071610111.png)

### 1，创建生产者

#### 1，pom

#### 2，配置文件

![image-20231107161145091](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071611800.png)

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071611899.png)

#### 3，主启动类

```java
@SpringBootApplication
@EnableEurekaClient
public class StreamRabbitmqMain8801 {
    public static void main(String[] args) {
        SpringApplication.run(StreamRabbitmqMain8801.class,args);
    }
}
```

#### 4，service和实现类

service定义发送消息

```java
public interface IMessageProvicderService {
    public String send();
}
```

```java
@EnableBinding(Source.class)
//表示当前这个类是source，负责生产消息，并且发送给channel
@Slf4j
public class IMessageProviderServiceImpl  implements IMessageProvicderService {
    @Resource
    private MessageChannel output;
    //channel，我们将消息发送到这个channel，消息发送管道
    @Override
    public String send() {
        String uuid= UUID.randomUUID().toString();
        output.send(MessageBuilder.withPayload(uuid).build());
        //发送，build方法会构建一个Message类
        log.info("Send Message:{}",uuid);
        return uuid;
    }
}
```

**这里，就会调用send方法，将消息发送给channel，然后channel将消费发送给binder，然后发送到rabbitmq中**

#### 5，controller

```java
@RestController
public class StremController {
    @Resource
    private  IMessageProvicderService provicderService;
    @GetMapping(value = "sendMsg")
    public void send(){
        String send = provicderService.send();
    }
} 
```

#### 6，可以测试

**启动rabbitmq**

**启动7001，8801**

 确定8801后，会在rabbitmq中创建一个Exchange，就是我们配置文件中配置的exchange

**访问8801的/sendMessage**

### 创建消费者:

#### 1，pom文件

#### 2，配置文件

**这里排版一点问题**

**input就表示，当前服务是一个消费者，需要消费消息，下面就是指定消费哪个Exchange中的消息**

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071612673.png)

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071612180.png) 

#### 3，主启动类

```java
@SpringBootApplication
@EnableEurekaClient
public class StreamRabbitMQMain8802 {
    public static void main(String[] args) {
        SpringApplication.run(StreamRabbitMQMain8802.class,args);
    }
} 
```

#### 4，业务类(消费数据)

```java
@Component
@EnableBinding(Sink.class)
//启动绑定，就是表示当前类是sink，负责介绍channel发送过来的数据进行消费
@Slf4j
public class MessageRecieverController {

    @Value("${server.port}")
    private String serverPort;


    @StreamListener(Sink.INPUT)
    //这里表示监听sink的input，而input我们在配置文件中配置了，绑定在一个指定Exchange上获取数据
    public void input(Message<String> message){
        System.out.println(message.getPayload()+"serverPort:  "+serverPort);
        log.info("收到Message----->：{},  Port:{}",message.getPayload(),serverPort);
    }
}
```

**生产者发送消息时，使用send方法发送，send方法发送的是一个个Message，里面封装了数据**

#### 5，测试:

启动7001.8801.8802

**此时使用生产者生产消息**

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071612065.png)

可以看到，消费者已经接收到消息了

### 创建消费者2

创建8803，

与8802创建一模一样，就不写了

**创建8803主要是为了演示重复消费等问题**

...

....

...

### 重复消费问题:

此时启动7001.8801.8802.8803

此时生产者生产一条消息

但是此时查询消费者，发现8802，8803<span style='background-color:yellow'>都消费到了同一条数据</span>

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071612086.png)

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071621316.png) 

#### 1，自定义分组

**修改8802，8803的配置文件**

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071622123.png) 

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071624948.png) 

**现在将8802，8803都分到了A组**

然后去重启02，03

**然后此时生产者生产两条消息**

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071624164.png)

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071624708.png)

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071624263.png)

**可以看到，每人只消费了一条消息，并且没有重复消费**

### 持久化问题:

就是当服务挂了，怎么消费没有消费的数据??

这里，先将8802移除A组，

 然后将02，03服务关闭

此时生产者开启，发送3条消息

 此时重启02，03

 可以看到，当02退出A组后，它就获取不到在它宕机的时间段内的数据

 但是03重启后，直接获取到了宕机期间它没有消费的数据，并且消费了

总结:
也就是，当我们没有配置分组时，会出现消息漏消费的问题

 而配置分组后，我们可以自动获取未消费的数据

# 9.链路追踪:

## Spring Cloud Sleuth

**sleuth要解决的问题:**

在微服务框架中，一个由客户端发起的请求在后端系统中会经过多个不同的服务节点调用来协同产生最后的请求结果，每一个前端请求都会形成一个复杂的分布式服务调用链路，链路中的任何一环出现高延时或错误都会引起整个请求最后的失败。

**而sleuth就是用于追踪每个请求的整体链路**

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071625390.png)

### 使用sleuth:

#### 1.安装zipkin:

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071625161.png)

**运行jar包**

 java \-jar xxxx.jar

**然后就可以访问web界面， 默认zipkin监听的端口是9411**

 localhost:9411/zipkin/

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071625950.png)

**一条链路完整图片:**

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071625914.png)

**精简版:**

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071625793.png)

**可以看到，类似链表的形式**

#### 2，使用sleuth:

不需要额外创建项目，使用之前的8001和order的80即可

##### 1，修改8001

**引入pom:**

```xml
<dependency> 
    <!-- 包含了sleuth和zipkin -->
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-zipkin</artifactId>
    <version>2.2.1.RELEASE</version>
</dependency>
 
```

这个包虽然叫zipkin但是，里面包含了zpikin与sleuth

**修改配置文件:**

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071625650.png) 

##### 2，修改80

**添加pom**

与上面是一样的

**添加配置**:

与上面也是一样的

##### 3，测试:

启动7001.8001，80，9411

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071625363.png)















