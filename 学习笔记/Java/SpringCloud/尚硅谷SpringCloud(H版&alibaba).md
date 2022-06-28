## 0.SpringCloud升级，部分组件停用:

![image-20220625183733401](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/image-20220625183733401-6153455.png)

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

 cloud_pay_8001

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
  #它一般对应我们的实体类所在的包，这个时候会自动取对应包中不包括包名的简单类名作为包括包名的别名。多个package之间可以用逗号或者分号等来进行分隔（value的值一定要是包的全类名）
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
create table ``(
  `id` bigint(20) not null auto_increment comment 'id',
  `serial` varchar(200) default '',
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

​                **在resource下，创建mapper/PayMapper.xml**

```xml
<mapper namespace="com.atguigu.springcloud.dao.PaymentDao">
    <insert id="create" parameterType="com.atguigu.springcloud.entities.Payment" useGeneratedKeys="true" keyProperty="id">
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
    private  String serverPort;
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

### **1.pom**

### **2.yml配置文件**

```yaml
server:
	port: 80
```

### **3.主启动类**

### **4.复制pay模块的实体类，entity类**

### **5.写controller类**

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

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125222124.png)

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

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125222137.png)

### 4.使用maven，将common模块打包(install)，

 其他模块引入common

# 2.服务注册与发现

## 6.Eureka:

前面我们没有服务注册中心，也可以服务间调用，为什么还要服务注册?

当服务很多时，单靠代码手动管理是很麻烦的，需要一个公共组件，统一管理多服务，包括服务是否正常运行，等

Eureka用于**==服务注册==**，目前官网**已经停止更新**

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125222201.png)

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125222208.png)

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125222214.png)

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125222230.png)

### **单机版eureka:**

#### **1.创建项目cloud_eureka_server_7001**

#### **2.引入pom依赖**

 eurka最新的依赖变了

1.X和2.X的对比说明

```xml
以前的老版本（当前使用2018）
<dependency>
        <groupId>org.springframework.cloud</groupId>
        <artifactId>spring-cloud-starter-eureka</artifactId>
</dependency>
 
现在新版本（当前使用2020.2）
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-netflix-eureka-server</artifactId>
</dependency>
 
```

#### 3.配置文件:

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125222244.png)

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

#### **5.此时就可以启动当前项目了**

#### **6.其他服务注册到eureka:**

比如此时pay模块加入eureka:

##### 1.主启动类上，加注解，表示当前是eureka客户端

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

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125222257.png)

##### 2.修改pom，引入

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125222303.png)

##### 3.修改配置文件:

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125222309.png)

##### 4.pay模块重启，就可以注册到eureka中了

**==order模块的注册是一样的==**

### 集群版eureka:

#### 集群原理:

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125222316.png)

 ```java
1.就是pay模块启动时，注册自己，并且自身信息也放入eureka
2.order模块，首先也注册自己，放入信息，当要调用pay时，先从eureka拿到pay的调用地址
3.通过HttpClient调用并且还会缓存一份到本地，每30秒更新一次
 ```

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125222329.png)

**集群构建原理:**

 互相注册

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125222339.png)

#### **构建新erueka项目**

名字:cloud_eureka_server_7002

##### 1，pom文件:

 粘贴7001的即可

##### 2，配置文件:

 在写配置文件前，修改一下主机的hosts文件

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125222345.png)

首先修改之前的7001的eureka项目，因为多个eureka需要互相注册

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125222350.png)

然后修改7002

​            **7002也是一样的，只不过端口和地址改一下**

##### 3，主启动类:

 复制7001的即可

##### 4，然后启动7001，7002即可

*![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125222428.png)*

#### 将pay，order模块注册到eureka集群中:

##### 1，只需要修改配置文件即可:

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125222441.png)

##### 2，两个模块都修改上面的都一样即可

 然后启动两个模块

 要先启动7001，7002，然后是pay模块8001，然后是order(80)

### 3，将pay模块也配置为集群模式:

#### 0，创建新模块，8002

 名称: cloud_pay_8002

#### 1，pom文件，复制8001的

#### 2，pom文件复制8001的

#### 3，配置文件复制8001的

 端口修改一下，改为8002

 服务名称不用改，用一样的

#### 4.主启动类，复制8001的

#### 5，mapper，service，controller都复制一份

 然后就启动服务即可

 此时访问order模块，发现并没有负载均衡到两个pay，模块中，而是只访问8001

 虽然我们是使用RestTemplate访问的微服务，但是也可以负载均衡的        ![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125222452.png)

**注意这样还不可以，需要让RestTemplate开启负载均衡注解，还可以指定负载均衡算法，默认轮询**

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125222503.png)

### 4，修改服务主机名和ip在eureka的web上显示

比如修改pay模块

#### 1，修改配置文件:

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125222511.png)

### 5，eureka服务发现:

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125222523.png)

以pay模块为例

#### 1，首先添加一个注解，在controller中

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125222528.png)

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125222535.png)

#### 2，在主启动类上添加一个注解

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125222541.png)

**然后重启8001.访问/payment/discover**y

### 6，Eureka自我保护:

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125222554.png)

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125222559.png)

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125222605.png)

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125222611.png)

![image-20220625230507458](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/image-20220625230507458.png)

![image-20220625230253885](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/image-20220625230253885-6169376.png)

**eureka服务端配置:**

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125222623.png)



![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125222631.png)

​            **设置接受心跳时间间隔**

**客户端(比如pay模块):**

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125222639.png)

**此时启动erueka和pay.此时如果直接关闭了pay，那么eureka会直接删除其注册信息**

## 7，Zookeeper服务注册与发现:

### 1，启动zk，到linux上，没有图形化界面

### 2，创建新的pay模块，

单独用于注册到zk中

名字 : cloud_pay_8003

#### 1，pom依赖

#### 2，配置文件

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125222648.png)

#### 3，主启动类

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125222655.png)

#### 4，controller

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125222659.png)

#### 5，然后就可以启动

**此时启动，会报错，因为jar包与我们的zk版本不匹配**

解决:
修改pom文件，改为与我们zk版本匹配的jar包

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125222704-16535295892121.png)

**此时8003就注册到zk中了**

```java
我们在zk上注册的node是临时节点，当我们的服务一定时间内没有发送心跳
那么zk就会`将这个服务的node删除了
```

**这里测试，就不写service与dao什么的了**

### 3，创建order消费模块注册到zk

#### 1，创建项目

名字: cloud_order_zk_80

#### 2，pom

#### 3，配置文件

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125222713.png)

#### 4主启动类:

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125222719.png)

#### 5，RestTemolate

![注意，这里使用RestTemolate，要先注册它](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125222726.png)

#### 6，controller

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125222732.png)

**然后启动即可注册到zk**

#### 8，集群版zk注册:

只需要修改配置文件:

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125222737.png)

这个connect-string指定多个zk地址即可

connect-string: 1.2.3.4，2.3.4.5

## 8，Consul:

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125222746.png)

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125222756.png)

### 1，按照consul

需要下载一个安装包

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125222808.png)

启动是一个命令行界面，需要输入consul agen-dev启动

### 2，创建新的pay模块，8006

#### 1，项目名字

cloud_consule_pay_8006

#### 2，pom依赖

#### 3，配置文件

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125222816.png)

#### 4，主启动类

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125222822.png)

#### 5，controller

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125222827.png)

#### 6，启动服务

####  

### 3，创建新order模块

cloud-consul-order-80

#### 1，pom文件

#### 2，配置文件

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125222834.png)

#### 3，主启动类

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125222842.png)

#### 4，RestTemplate注册

配置类注册

#### 5，controller

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125222851.png)

#### 6，启动服务，测试

## 9，三个注册中心的异同:

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125222857.png)

![image-20220628213833694](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/image-20220628213833694-6423516-6423518.png)



![image-20220628213652280](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/image-20220628213652280-6423413.png)

![image-20220628214440410](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/image-20220628214440410-6423881.png)

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125222903.png)

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125222910.png)

# 3.服务调用

## 10，Ribbon负载均衡:

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125222925.png)

**Ribbon目前也进入维护，基本上不准备更新了**

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125222943.png)

**进程内LB(本地负载均衡)**

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125222957.png)

**集中式LB(服务端负载均衡)**

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125223005.png)

**区别**

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125223010.png)

**Ribbon就是负载均衡+RestTemplate**

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125223018.png)

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125223022.png)

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125223029.png)

### 使用Ribbon:

#### 1，默认我们使用eureka的新版本时，它默认集成了ribbon:

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125223035.png)

**==这个starter中集成了reibbon了==**

#### 2，我们也可以手动引入ribbon

**放到order模块中，因为只有order访问pay时需要负载均衡**

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125223041.png)

#### 3，RestTemplate类:

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125223048.png)

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125223101.png)

```java
RestTemplate的:
        xxxForObject()方法，返回的是响应体中的数据
        xxxForEntity()方法.返回的是entity对象，这个对象不仅仅包含响应体数据，还包含响应体信息(状态码等)
```

#### Ribbon常用负载均衡算法:

**IRule接口，Riboon使用该接口，根据特定算法从所有服务中，选择一个服务，**

IRule接口有7个实现类，每个实现类代表一个负载均衡算法

![image-20220627093455387](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/image-20220627093455387-16562936965981.png)

#### 使用Ribbon:

**==这里使用eureka的那一套服务==**

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125223113.png)

**==也就是不能放在主启动类所在的包及子包下==**

##### 1，修改order模块

##### 2，额外创建一个包

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125223118.png)

##### 3，创建配置类，指定负载均衡算法

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125223125.png)

##### 4，在主启动类上加一个注解

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125223134.png)

**表示，访问CLOUD_PAYMENT_SERVICE的服务时，使用我们自定义的负载均衡算法**

#### 自定义负载均衡算法:

##### 1，ribbon的轮询算法原理

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125223145.png)

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125223151.png)

##### 2，自定义负载均衡算法:

**1，给**pay模块(8001，8002)，的controller方法添加一个方法，返回当前节点端口

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125223201.png)

```java
  @GetMapping("/payment/lb")
  public String  getPayment(){
        return serverPort;
  }
```

**2，修改order模块**

去掉@LoadBalanced

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125223208.png)

##### 3，自定义接口

```java
public interface LoadBalance {
    ServiceInstance instance(List<ServiceInstance> serviceInstances);
}
```

 ==具体的算法在实现类中实现==

##### 4，接口实现类

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125223226.png)

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125223232.png)

##### 5，修改controller:

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125223238.png)

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125223243.png)

##### 6，启动服务，测试即可

## 11，OpenFeign

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125223250.png)

**是一个声明式的web客户端，只需要创建一个接口，添加注解即可完成微服务之间的调用**

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125223256.png)

==就是A要调用B，Feign就是在A中创建一个一模一样的B对外提供服务的的接口，我们调用这个接口，就可以服务到B==

### **Feign与OpenFeign区别**

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125223307.png)

### 使用OpenFeign

```java
之前的服务间调用，我们使用的是ribbon+RestTemplate
现在改为使用Feign
```

#### 1，新建一个order项目，用于feign测试

名字cloud_order_feign-80

#### 2，pom文件

#### 3，配置文件

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125223315.png)

#### 4，主启动类

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125223321.png)

#### 5，fegin需要调用的其他的服务的接口

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125223329.png)

#### 6，controller

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125223336.png)

#### 7测试:

启动两个erueka(7001，7002)

启动两个pay(8001，8002)

启动当前的order模块

**Feign默认使用ribbon实现负载均衡**

### OpenFeign超时机制:

==OpenFeign默认等待时间是1秒，超过1秒，直接报错==

#### 1，设置超时时间，修改配置文件:

**因为OpenFeign的底层是ribbon进行负载均衡，所以它的超时时间是由ribbon控制**

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125223343.png)

### OpenFeign日志:

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125223358.png)

**OpenFeign的日志级别有:**
![image-20220627094520089](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/image-20220627094520089-16562943216882.png)

#### 1，使用OpenFeign的日志:

**实现在配置类中添加OpenFeign的日志类**

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125223404.png)

#### 2，为指定类设置日志级别:

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125223414.png)

**配置文件中:**

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125223418.png)

#### 3，启动服务即可

# 4.服务降级:

## 12，Hystrix服务降级

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125223424.png)

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211129220449.png)



![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125223431.png)

### hystrix中的重要概念:

#### 1，服务降级

**比如当某个服务繁忙，不能让客户端的请求一直等待，应该立刻返回给客户端一个备选方案**

#### 2，服务熔断

**当某个服务出现问题，卡死了，不能让用户一直等待，需要关闭所有对此服务的访问，**然后调用服务降级**

#### 3，服务限流

**限流，比如秒杀场景，不能访问用户瞬间都访问服务器，限制一次只可以有多少请求**

### 使用hystrix，服务降级:

#### 1，创建带降级机制的pay模块 :

名字: cloud-hystrix-pay-8007

##### 2，pom文件

##### 3，配置文件

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125223439.png)

##### 4，主启动类

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125223446.png)

##### 5，service

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125223453.png)

##### 6controller

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125223954.png)

##### 7，先测试:

```java
此时使用压测工具，并发20000个请求，请求会延迟的那个方法，
压测中，发现，另外一个方法并没有被压测，但是我们访问它时，却需要等待
这就是因为被压测的方法它占用了服务器大部分资源，导致其他请求也变慢了
```

##### 8，先不加入hystrix，

#### 2，创建带降级的order模块:

##### 1，名字:  cloud-hystrix-order-80

##### 2，pom

##### 3，配置文件

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125224003.png)

##### 4，主启动类

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125224009.png)

##### 5，远程调用pay模块的接口:

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125224016.png)

##### 6，controller:

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125224022.png)

##### 7，测试

 启动order模块，访问pay

 再次压测2万并发，发现order访问也变慢了

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125224031.png)

**解决:**

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125224036.png)

##### ![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125224052.png)

#### 3，配置服务降级:

##### 1，修改pay模块

###### 1，为service的指定方法(会延迟的方法)添加@HystrixCommand注解

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125224100.png)

###### 2，主启动类上，添加激活hystrix的注解

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125224110.png)

###### 3，触发异常

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125224118.png)

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125224125.png)**可以看到，也触发了降级**

##### 2，修改order模块，进行服务降级

一般服务降级，都是放在客户端(order模块)，

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125224135.png)

###### 1，修改配置文件:

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125224141.png)

###### **2，主启动类添加直接，启用hystrix:**

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125224149.png)



###### 3，修改controller，添加降级方法什么的

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125224155.png)

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

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125224204.png)

###### 2，使用注解指定其为全局降级方法(默认降级方法)

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125224211.png)

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125224218.png)

###### 3，业务方法使用默认降级方法:

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125224225.png)

###### 4，测试:

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125224235.png)

##### 解决代码耦合度的问题:

修改order模块，这里开始，pay模块就不服务降级了，服务降级写在order模块即可

###### 1，Payservice接口是远程调用pay模块的，我们这里创建一个类实现service接口，在实现类中统一处理异常

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125224244.png)

###### 2，修改配置文件:添加:

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125224250.png)

###### 3，让PayService的实现类生效:

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125224255.png)

```java
它的运行逻辑是:
        当请求过来，首先还是通过Feign远程调用pay模块对应的方法
        但是如果pay模块报错，调用失败，那么就会调用PayMentFalbackService类的
        当前同名的方法，作为降级方法
```

###### 4，启动测试

启动order和pay正常访问--ok

==此时将pay服务关闭，order再次访问==

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125224303.png)

可以看到，并没有报500错误，而是降级访问==实现类==的同名方法

这样，即使服务器挂了，用户要不要一直等待，或者报错

问题:

​        **这样虽然解决了代码耦合度问题，但是又出现了过多重复代码的问题，每个方法都有一个降级方法**

### 使用服务熔断:

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125224310.png)

**比如并发达到1000，我们就拒绝其他用户访问，在有用户访问，就访问降级方法**

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125224316.png)

#### 1，修改前面的pay模块

##### **1，修改Payservice接口，添加服务熔断相关的方法:**

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125224322.png)

这里属性整体意思是:
10秒之内(窗口，会移动)，如果并发==超过==10个，或者10个并发中，失败了6个，就开启熔断器

![image-20200414152637247](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125224335.png)

IdUtil是Hutool包下的类，这个Hutool就是整合了所有的常用方法，比如UUID，反射，IO流等工具方法什么的都整合了

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125224344.png)

```java
断路器的打开和关闭，是按照一下5步决定的
        1，并发此时是否达到我们指定的阈值
        2，错误百分比，比如我们配置了60%，那么如果并发请求中，10次有6次是失败的，就开启断路器
        3，上面的条件符合，断路器改变状态为open(开启)
        4，这个服务的断路器开启，所有请求无法访问
        5，在我们的时间窗口期，期间，尝试让一些请求通过(半开状态)，如果请求还是失败，证明断路器还是开启状态，服务没有恢复
        如果请求成功了，证明服务已经恢复，断路器状态变为close关闭状态
```

##### 2，修改controller

添加一个测试方法;

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125224352.png)

##### 3，测试:

启动pay，order模块

==多次访问，并且错误率超过60%:==

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125224358.png)

此时服务熔断，此时即使访问正确的也会报错:

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125224413.png)

**但是，当过了几秒后，又恢复了**

 因为在10秒窗口期内，它自己会尝试接收部分请求，发现服务可以正常调用，慢慢的当错误率低于60%，取消熔断

### Hystrix所有可配置的属性:

**全部在这个方法中记录，以成员变量的形式记录，**

 以后需要什么属性，查看这个类即可

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125224423.png)

### 总结:

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125224433.png)

**==当断路器开启后:==**

​    ![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125224504.png)

**==其他参数:==**

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125224513.png)

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125224533.png)

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125224539.png)

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125224544.png)

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125224550.png)

**熔断整体流程:**

```java
1请求进来，首先查询缓存，如果缓存有，直接返回
        如果缓存没有，--->2
        2，查看断路器是否开启，如果开启的，Hystrix直接将请求转发到降级返回，然后返回
        如果断路器是关闭的，
        判断线程池等资源是否已经满了，如果已经满了
        也会走降级方法
        如果资源没有满，判断我们使用的什么类型的Hystrix，决定调用构造方法还是run方法
        然后处理请求
        然后Hystrix将本次请求的结果信息汇报给断路器，因为断路器此时可能是开启的
        (因为断路器开启也是可以接收请求的)
        断路器收到信息，判断是否符合开启或关闭断路器的条件，
        如果本次请求处理失败，又会进入降级方法
        如果处理成功，判断处理是否超时，如果超时了，也进入降级方法
        最后，没有超时，则本次请求处理成功，将结果返回给controller


```

### Hystrix服务监控:

#### HystrixDashboard

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125224558.png)

#### 2，使用HystrixDashboard:

##### 1，创建项目:

名字: cloud_hystrixdashboard_9001

##### 2，pom文件

##### 3，配置文件

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125224605.png)

##### 4，主启动类

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125224609.png)

##### 5，修改所有pay模块(8001，8002，8003...)

**他们都添加一个pom依赖:**

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125224615.png)

之前的pom文件中都添加过了，==这个是springboot的监控组件==

##### 6，启动9001即可

 访问: **localhost:9001/hystrix**

##### 7，注意，此时仅仅是可以访问HystrixDashboard，并不代表已经监控了8001，8002

 如果要监控，还需要配置:(8001为例)

==8001的主启动类添加:==

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125224621.png)

**其他8002，8003都是一样的**

##### 8，到此，可以启动服务

启动7001，8001，9001

**然后在web界面，指定9001要监控8001:**

##### ![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125224635.png)

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125224643.png)

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125224658.png)

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125224703.png)

![](.\图片\Hystrix的60.png)

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125224709.png)

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125224714.png)

# 5.服务网关:

zuul停更了，

## 13，GateWay

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125224720.png)

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125224725.png)

**gateway之所以性能好，因为底层使用WebFlux，而webFlux底层使用netty通信(NIO)**

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125224734.png)

### GateWay的特性:

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125224742.png)

### GateWay与zuul的区别:

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125224800.png)

### zuul1.x的模型:

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125224805.png)

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125224812.png)

### 什么是webflux:

**是一个非阻塞的web框架，类似springmvc这样的**

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125224817.png)

### GateWay的一些概念:

#### 1，路由:

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125224835.png)

就是根据某些规则，将请求发送到指定服务上

#### 2，断言:

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125224829.png)

就是判断，如果符合条件就是xxxx，反之yyyy

#### 3，过滤:

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125224842.png)

​    **路由前后，过滤请求**

### GateWay的工作原理:

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125224847.png)

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125224853.png)

### 使用GateWay:

想要新建一个GateWay的项目

名字:    cloud_gateway_9527

#### 1，pom

#### 2，配置文件

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125224900.png)

#### 3，主启动类

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125224907.png)

#### 4，针对pay模块，设置路由:

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125224912.png)

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125224922.png)

**==修改GateWay模块(9527)的配置文件==:**

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125224937.png)

这里表示，

 当访问localhost:9527/payment/get/1时，

 路由到localhost:8001/payment/get/1

#### 5，开始测试

**启动7001，8001，9527**

```java
如果启动GateWay报错
        可能是GateWay模块引入了web和监控的starter依赖，需要移除
```

访问:

 localhost:9527/payment/get/1

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125224948.png)

#### 6，GateWay的网关配置，

​        **GateWay的网关配置，除了支持配置文件，还支持硬编码方式**

#### 7使用硬编码配置GateWay:

##### 创建配置类:

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125224955.png)

#### 8，然后重启服务即可

### 重构:

上面的配置虽然首先了网关，但是是在配置文件中写死了要路由的地址

现在需要修改，不指定地址，而是根据微服务名字进行路由，我们可以在注册中心获取某组微服务的地址

需要:

 1个eureka，2个pay模块

#### 修改GateWay模块的配置文件:

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125225002.png)

#### 然后就可以启动微服务.测试

### Pridicate断言:

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125225009.png)

**我们之前在配置文件中配置了断言:**

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125225015.png)

**这个断言表示，如果外部访问路径是指定路径，就路由到指定微服务上**

可以看到，这里有一个Path，这个是断言的一种，==断言的类型==:

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125225022.png)

```java
After:
        可以指定，只有在指定时间后，才可以路由到指定微服务
```

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125225028.png)

 这里表示，只有在==2020年的2月21的15点51分37秒==之后，访问==才可以路由==

 在此之前的访问，都会报404

如何获取当前时区?**

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125225036.png)

```java
before:
        与after类似，他说在指定时间之前的才可以访问
        between:
        需要指定两个时间，在他们之间的时间才可以访问
```

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125225046.png)

```java
cookie:
        只有包含某些指定cookie(key，value)，的请求才可以路由
```

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125225104.png)

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125225112.png)

```java
Header:
        只有包含指定请求头的请求，才可以路由
```

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125225121.png)

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125225128.png)

测试:
![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125225141.png)

```java
host:
        只有指定主机的才可以访问，
        比如我们当前的网站的域名是www.aa.com
        那么这里就可以设置，只有用户是www.aa.com的请求，才进行路由
```

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125225150.png)

![gateway的34](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125225158.png)

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125225203.png)

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125225212.png)

可以看到，如果带了域名访问，就可以，但是直接访问ip地址.就报错了

```java
method:
        只有指定请求才可以路由，比如get请求...
```

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125225220.png)

```java
path:
        只有访问指定路径，才进行路由
        比如访问，/abc才路由
```

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125225228.png)

```java
Query:
        必须带有请求参数才可以访问
```

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125225238.png)

### Filter过滤器:

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125225244.png)

#### 生命周期:

**在请求进入路由之前，和处理请求完成，再次到达路由之前**

#### 种类:

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125225250.png)

GateWayFilter，单一的过滤器

**与断言类似，比如闲置，请求头，只有特定的请求头才放行，反之就过滤**:

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125225256.png)

GlobalFilter，全局过滤器:

#### **自定义过滤器:**

实现两个接口

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125225302.png)

​    **然后启动服务，即可，因为过滤器通过@COmponet已经加入到容器了**

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125225308.png)

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125225314.png)

# 6.服务配置:

## Spring Config分布式配置中心:

==微服务面临的问题==

```java
可以看到，每个微服务都需要一个配置文件，并且，如果有几个微服务都需要连接数据库
        那么就需要配4次数据库相关配置，并且当数据库发生改动，那么需要同时修改4个微服务的配置文件才可以
```

所以有了springconfig配置中心

![](.\图片\springconfig的1.png)

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125225327.png)

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125225333.png)

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125225340.png)

### 使用配置中心:

#### 0，使用github作为配置中心的仓库:

**初始化git环境:**

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125225347.png)

#### 1，新建config模块:

名字:   cloud-config-3344

#### 2，pom

#### 3，配置文件

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125225355.png)

#### 4，主启动类

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125225415.png)

#### 5，修改hosts:

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125225420.png)

#### 6，配置完成

测试，3344是否可以从github上获取配置

启动3344    (要先启动eureka)

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125225427.png)

它实际上就是，读取到配置文件中的GitHub的地址，然后拼接上/master/config-dev.yml

#### 7，读取配置文件的规则:

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125225442.png)

==2，==

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125225448.png)

**这里默认会读取master分支，因为我们配置文件中配置了**

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125225453.png)

==3==

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125225502.png)

注意，这个方式读取到的配置是==json格式==的

**所有规则:**

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125225514.png)

### 2，创建配置中心客户端:

#### 1，创建config客户端项目

名字:    cloud-config-client-3355

#### 2，pom

#### 3，配置文件

注意这个配置文件就不是application.yml

 而是bootstrap.yml

这个配置文件的作用是，先到配置中心加载配置，然后加载到application.yml中

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125225521.png)

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125225536.png)

#### 4，主启动类:

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125225541.png)

#### 5，controller类

就是上面提到的，以rest风格将配置对外暴露

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125225548.png)

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125225556.png)

**如果客户端运行正常，就会读取到github上配置文件的，config.info下的配置**

#### 6，测试:

启动3344，3355

 访问3355的 /configInfo

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125225607.png)

#### 7，问题::

```java
上面3355确实获取到了配置文件，但是如果此时配置文件修改了，3355是获取不到的
3344可以实时获取到最新配置文件，但是3355却获取不到
除非重启服务
```

#### **8，实现动态刷新:**

##### 1，修改3355，添加一个pom依赖:

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125225616.png)

##### 2，修改配置文件，添加一个配置:

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125225620.png)

##### 3，修改controller:

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125225625.png)

##### 4，此时重启服务

**此时3355还不可以动态获取**

因为此时，还需要==外部==发送post请求通知3355

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125225637.png)

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

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125225643.png)

![](.\图片\springconfig的27.png)

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125225648.png)

注意，这里年张图片，就代表两种广播方式

 图1:        **它是Bus直接通知给其中一个客户端，由这个客户端开始蔓延，传播给其他所有客户端**

 图2:        它**是通知给配置中心的服务端，有服务端广播给所有客户端**

**为什么被称为总线?**

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125225656.png)

```java
就是通过消息队列达到广播的效果
        我们要广播每个消息时，主要放到某个topic中，所有监听的节点都可以获取到
```

### 使用Bus:

#### 1，配置rabbitmq环境:

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125225704.png)

#### **2，之前只有一个配置中心客户端，这里在创建一个**

 ==**复制3355即可，创建为3366**==

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125225714.png)

全部复制3355的即可

#### 2，使用Bus实现全局广播

**Bus广播有两种方式:**

 ==就是上面两个图片的两种方式==

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125225721.png)

**这两种方式，第二种跟合适，因为:**

 ==第一种的缺点:==

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125225726.png)

#### **配置第二种方式:**

##### **1，配置3344(配置中心服务端):**

###### 1，修改配置文件:

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125225731.png)

###### 2，添加pom

**springboot的监控组件，和消息总线**

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125225741.png)

![](.\图片\Bus的2.png)

##### 2，修改3355(配置中心的客户端)

###### 1，pom:

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125225747.png)

![Bus的2](.\图片\Bus的2.png)

###### 2，配置文件:

==注意配置文件的名字，要改为bootstrap.yml==

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125225752.png)

![image-20200415102708661](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125225758)

##### 3，修改3366(也是配置中心的客户端)

 修改与3355是一模一样的

##### 4，测试

启动7001，3344，3355，3366

此时修改GitHub上的配置文件

==此时只需要刷新3344，即可让3355，3366动态获取最新的配置文件==

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125225806.png)

其原理就是:

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125225811.png)

**所有客户端都监听了一个rabbitMq的topic，我们将信息放入这个topic，所有客户端都可以送到，从而实时更新**

#### 配置定点通知

 就是只通知部分服务，比如只通知3355，不通知3366

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125225819.png)

![Bus的8](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125225824.png)

**只通知3355**

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125225832.png)

​    ![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125225845.png)

**可以看到，实际上就是通过==微服务的名称+端口号==进行指定**

# 8.消息驱动:

## Spring Cloud Stream:

```java
现在一个很项目可能分为三部分:
        前端--->后端---->大数据
        而后端开发使用消息中间件，可能会使用RabbitMq
        而大数据开发，一般都是使用Kafka，
        那么一个项目中有多个消息中间件，对于程序员，因为人员都不友好
```

而Spring Cloud Stream就类似jpa，屏蔽底层消息中间件的差异，程序员主要操作Spring Cloud Stream即可

 不需要管底层是kafka还是rabbitMq

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125225853.png)

### ==什么是Spring Cloud Stream==

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125225858.png)

![](.\图片\SpringCloudStream的3.png)

![](.\图片\SpringCloudStream的4.png)

![](.\图片\SpringCloudStream的5.png)

### ==**Spring Cloud Stream是怎么屏蔽底层差异的?**==

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125225915.png)

**绑定器:**

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125225921.png)

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125225926.png)

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125225933.png)

### **Spring Cloud Streamd 通信模式:**

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125225948.png)![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125225952.png)

### Spring Cloud Stream的业务流程:

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125225957.png)

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125230050.png)

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125230058.png)

```java
类似flume中的channel，source，sink 估计是借鉴(抄袭)的
source用于获取数据(要发送到mq的数据)
 channel类似SpringCloudStream中的中间件，用于存放source接收到的数据，或者是存放binder拉取的数据    
```

### 常用注解和api:

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125230109.png)

### 使用SpringCloudStream:

需要创建三个项目，一个生产者，两个消费者

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125230115.png)

### 1，创建生产者

#### 1，pom

#### 2，配置文件

![image-20200415114816133](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125230121)

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125230127.png)

#### 3，主启动类

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125230131.png)

#### 4，service和实现类

service定义发送消息

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125230137.png)

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125230141.png)

**这里，就会调用send方法，将消息发送给channel，**

​                **然后channel将消费发送给binder，然后发送到rabbitmq中**

#### 5，controller

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125230149.png)

#### 6，可以测试

**启动rabbitmq**

**启动7001，8801**

 确定8801后，会在rabbitmq中创建一个Exchange，就是我们配置文件中配置的exchange

**访问8801的/sendMessage**

### 创建消费者:

#### 1，pom文件

#### 2，配置文件

==**这里排版一点问题**==

**==input==就表示，当前服务是一个消费者，需要消费消息，下面就是指定消费哪个Exchange中的消息**

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125230201.png)

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125230212.png)

#### 3，主启动类

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125230221.png)

#### 4，业务类(消费数据)

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125230229.png)

**生产者发送消息时，使用send方法发送，send方法发送的是一个个Message，里面封装了数据**

#### 5，测试:

启动7001.8801.8802

**此时使用生产者生产消息**

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125230236.png)

==可以看到，消费者已经接收到消息了==

### 创建消费者2

创建8803，

==与8802创建一模一样，就不写了==

**创建8803主要是为了演示重复消费等问题**

...

....

...

### ==重复消费问题:==

此时启动7001.8801.8802.8803

此时生产者生产一条消息

但是此时查询消费者，发现8802，8803==都消费到了同一条数据==

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125230248.png)

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125230255.png)

#### 1，自定义分组

**修改8802，8803的配置文件**

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125230306.png)

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125230311.png)

**现在将8802，8803都分到了A组**

然后去重启02，03

**然后此时生产者生产两条消息**

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125230321.png)

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125230327.png)

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125230332.png)

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

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125230341.png)

**而来sleuth就是用于追踪每个请求的整体链路**

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125230346.png)

### 使用sleuth:

#### 1.安装zipkin:

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125230352.png)

**运行jar包**

 java -jar xxxx.jar

**然后就可以访问web界面， 默认zipkin监听的端口是9411**

 localhost:9411/zipkin/

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125230400.png)

**一条链路完整图片:**

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125230410.png)

**精简版:**

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125230416.png)

**可以看到，类似链表的形式**

#### 2，使用sleuth:

不需要额外创建项目，使用之前的8001和order的80即可

##### 1，修改8001

**引入pom:**

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125230422.png)

这个包虽然叫zipkin但是，里面包含了zpikin与sleuth

**修改配置文件:**

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125230429.png)

##### 2，修改80

**添加pom**

与上面是一样的

**添加配置**:

与上面也是一样的

##### 3，测试:

启动7001.8001，80，9411

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125230435.png)

# 10.Spring CloudAlibaba:

**之所以有Spring CloudAlibaba，是因为Spring Cloud Netflix项目进入维护模式**

​        **也就是，就不是不更新了，不会开发新组件了**

​        **所以，某些组件都有代替版了，比如Ribbon由Loadbalancer代替，等等**

==支持的功能==

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125230449.png)

几乎可以将之前的Spring Cloud代替

==具体组件==:
![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125230501.png)

## Nacos:

**服务注册和配置中心的组合**

 Nacos=erueka+config+bus

### 安装Nacos:

需要java8 和 Maven

**1，到github上下载安装包**

 解压安装包

**2，启动Nacos**

 在bin下，进入cod

 ./startup.cmd

**3，访问Nacos**

 Nacos默认监听8848

 localhost:8848/nacos

 账号密码:默认都是nacos

### 使用Nacos:

新建pay模块

​        **现在不需要额外的服务注册模块了，Nacos单独启动了**

名字: cloudalibaba-pay-9001

#### 1，pom

父项目管理alibaba的依赖:

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125230522.png)

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125230528.png)

9001的pom:

 另外一个文件.....

#### 2，配置文件

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125230532.png)

#### 3，启动类

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125230539.png)

#### 4，controller:

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125230545.png)

#### 5，测试

启动9001

然后查看Nacos的web界面，可以看到9001已经注册成功

### 创建其他Pay模块

 额外在创建9002，9003

 直接复制上面的即可

### 创建order模块

名字:  cloudalibaba-order-83

#### 1，pom

**为什么Nacos支持负载均衡?**

 Nacos直接集成了Ribon，所以有负载均衡

#### 2，配置文件

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125230557.png)

**这个server-url的作用是，我们在controller，需要使用RestTempalte远程调用9001，**

​        **这里是指定9001的地址**

#### 3，主启动类

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125230605.png)

#### 4，编写配置类

 ==因为Naocs要使用Ribbon进行负载均衡，那么就需要使用RestTemplate==

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

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125230627.png)

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125230635.png)

==下面这个curl命令，就是切换模式==

### 使用Nacos作为配置中心:

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125230643.png)

**==需要创建配置中心的客户端模块==**

cloudalibaba-Nacos-config-client-3377

#### 1.pom

#### 2.配置文件

这里需要配置两个配置文件，application.yml和bootstarp.yml

 主要是为了可以与spring clodu config无缝迁移

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211126215725.png)

```java
可以看到
```

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125230659.png)

#### 3.主启动类

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125230706.png)

#### 4.controller

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125230712.png)

```java
可以看到，这里也添加了@RefreshScope
之前在Config配置中心，也是添加这个注解实现动态刷新的

```

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125230720.png)

#### 5，在Nacos添加配置信息:

==**Nacos的配置规则:**==

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125230730.png)

**配置规则，就是我们在客户端如何指定读取配置文件，配置文件的命名的规则**

默认的命名方式:

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125230736.png)

```java
prefix:
        默认就是当前服务的服务名称
        也可以通过spring.cloud.necos.config.prefix配置
        spring.profile.active:
        就是我们在application.yml中指定的，当前是开发环境还是测试等环境
        这个可以不配置，如果不配置，那么前面的-也会没有
        file-extension
        就是当前文件的格式(后缀)，目前只支持yml和properties
```

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125230742.png)

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125230747.png)

==在web UI上创建配置文件:==

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125230754.png)

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125230802.png)

注意，DataId就是配置文件名字:

 名字一定要按照上面的==规则==命名，否则客户端会读取不到配置文件

#### 6，测试

重启3377客户端

访问3377

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125230809.png)

**拿到了配置文件中的值**

#### 7，注意默认就开启了自动刷新

此时我们修改了配置文件

客户端是可以立即更新的

 因为Nacos支持Bus总线，会自动发送命令更新所有客户端

### Nacos配置中心之分类配置:

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125230817.png)

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125230824.png)

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125230831.png)

NameSpace默认有一个:public名称空间

这三个类似java的: 包名 + 类名 + 方法名

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125230837.png)

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125230842.png)

#### 1，配置不同DataId:

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125230852.png)

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125230904.png)

 ==通过配置文件，实现多环境的读取:==

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125230908.png)

```java
此时，改为dev，就会读取dev的配置文件，改为test，就会读取test的配置文件
```

#### 2，配置不同的GroupID:

直接在新建配置文件时指定组

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125230915.png)

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125230920.png)

在客户端配置，使用指定组的配置文件:

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125230926.png)

**这两个配置文件都要修改**

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125230931.png)



重启服务，即可

#### 配置不同的namespace:

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125230937.png)

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125230943.png)

客户端配置使用不同名称空间:

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125230947.png)

**要通过命名空间id指定**

OK，测试

### Nacos集群和持久化配置:

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125230957.png)

Nacos默认有自带嵌入式数据库，derby，但是如果做集群模式的话，就不能使用自己的数据库

 不然每个节点一个数据库，那么数据就不统一了，需要使用外部的mysql

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125231003.png)

#### 1，单机版，切换mysql数据库:

 **将nacos切换到使用我们自己的mysql数据库:**

**1，nacos默认自带了一个sql文件，在nacos安装目录下**

 将它放到我们的mysql执行

**2，修改Nacos安装目录下的安排application.properties，添加:**

**数据库时区serverTimezone=UTC 可能会导致访问不到数据库**

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125231026.png)

**3，此时可以重启nacos，那么就会改为使用我们自己的mysql**

#### Linux上配置Nacos集群+Mysql数据库

官方架构图:

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125231037.png)

**需要一个Nginx作为VIP**

1，下载安装Nacos的Linux版安装包

2，进入安装目录，现在执行自带的sql文件

 进入mysql，执行sql文件

3.修改配置文件，切换为我们的mysql

 就是上面windos版要修改的几个属性

```
### If use MySQL as datasource:

spring.datasource.platform=mysql

### Count of DB:

db.num=1

### Connect URL of DB:

db.url.0=jdbc:mysql://127.0.0.1:3306/nacos?characterEncoding=utf8&connectTimeout=1000&socketTimeout=3000&autoReconnect=true&useUnicode=true&useSSL=false
db.user=root
db.password=password
```

4，修改cluster.conf，指定哪几个节点是Nacos集群

必须与Linux中hostname - i 中的IP一致

 这里使用3333，4444，5555作为三个Nacos节点监听的端口

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125231043.png)

5，我们这里就不配置在不同节点上了，就放在一个节点上

 既然要在一个节点上启动不同Nacos实例，就要修改startup.sh，使其根据不同端口启动不同Nacos实例

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125231050.png)

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125231055.png)

可以看到，这个脚本就是通过jvm启动nacos

 所以我们最后修改的就是，nohup java -Dserver.port=3344

![image-20211128215704352](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211128215705.png)

6，配置Nginx:

server后的IP填127.0.0.1

![image-20211128222208687](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211128222209.png)

​            ![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125231104.png)

7，启动Nacos:

nacos2.0.3 版本不用修改port，直接复制实例文件，然后修改cluster.conf文件中的IP和端口

./startup.sh -p 3333

 ./startup.sh -p 4444

 ./startup.sh -p 5555

![image-20211128222259008](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211128222259.png)

7，启动nginx

8，测试:

 访问192.168.159.121:1111或http://127.0.0.1:8848/nacos/

 如果可以进入nacos的web界面，就证明安装成功了

9，将微服务注册到Nacos集群:
![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125231117.png)

10，进入Nacos的web界面

 可以看到，已经注册成功

![image-20211128224944538](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211128224944.png)

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125231123.png)

## Sentinel:

实现熔断与限流，就是Hystrix

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125231129.png)

​    ![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125231138.png)

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

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125231148.png)

3. 主启动类

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125231156.png)

4. controller

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125231201.png)

5. 到这里就可以启动8401

 此时我们到sentinel中查看，发现并没有8401的任何信息 是因为，entinel是懒加载，需要我们执行一次访问，才会有信息。 访问localhost/8401/testA

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125231207.png)

6. 可以看到已经开始监听了

### sentinel的流控规则

#### 流量限制控制规则

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125231216.png)

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125231221.png)

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125231228.png)

#### 流控模式:

1. 直接快速失败

    ![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/202111291413326.png)

    ![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125231236.png)

       ==直接失败的效果:==

    ![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125231243.png)

2. 线程数:

   ​        ![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125231252.png)

   ​    ![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125231302.png)

   ```
   比如a请求过来，处理很慢，在一直处理，此时b请求又过来了
   此时因为a占用一个线程，此时要处理b请求就只有额外开启一个线程
   那么就会报错
   ```

   ![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125231311.png)


3. 关联:

   ![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125231316.png)

   ==应用场景:  比如**支付接口**达到阈值，就要限流下**订单的接口**，防止一直有订单

   ![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125231323.png)

   **当testA达到阈值，qps大于1，就让testB之后的请求直接失败**

   可以使用postman压测

4. 链路:
   多个请求调用同一个微服务

5. 预热Warm up:

    ​	 ![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125231338.png)

      ![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125231350.png)

     ![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125231357.png)

     ==应用场景==

     ![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125231414.png)

6. 排队等待:

    ![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125231420.png)

    ![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125231428.png)

### 降级规则:

**就是熔断降级**

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125231440.png)

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125231449.png)

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125231455.png)

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125231500.png)

#### 1.RT配置:

新增一个请求方法用于测试

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125231505.png)

==配置RT:==

 这里配置的PT，默认是秒级的平均响应时间

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125231511.png)

默认计算平均时间是: 1秒类进入5个请求，并且响应的平均值超过阈值(这里的200ms)，就报错

 1秒5请求是Sentinel默认设置的

==测试==

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125231517.png)

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125231523.png)

**默认熔断后.就直接抛出异常**

#### 2.异常比例:

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125231528.png)

修改请求方法

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125231533.png)

配置:

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125231540.png)

==如果没触发熔断，这正常抛出异常==:

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125231546.png)

==触发熔断==:

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125231552.png)

#### 3.异常数:

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125231600.png)

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125231606.png)

一分钟之内，有5个请求发送异常，进入熔断

### 热点规则:

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125231611.png)

​    ![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125231618.png)

比如:

 localhost:8080/aa?name=aa

 localhost:8080/aa?name=b'b

 加入两个请求中，带有参数aa的请求访问频次非常高，我们就现在name==aa的请求，但是bb的不限制

==如何自定义降级方法，而不是默认的抛出异常?==

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125231629.png)

**使用@SentinelResource直接实现降级方法，它等同Hystrix的@HystrixCommand**

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125231645.png)

==定义热点规则:==

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125231650.png)

![](/Users/jiusonghuang/Downloads/cloud2020-master/%E7%AC%94%E8%AE%B0-%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba)/./%E5%9B%BE%E7%89%87/sentinel%E7%9A%8442.png)

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/202111291726846.png)

**此时我们访问/testHotkey并且带上才是p1**

 如果qps大于1，就会触发我们定义的降级方法

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125231702.png)

**但是我们的参数是P2，就没有问题**

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125231707.png)

只有带了p1，才可能会触发热点限流

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125231714.png)

#### 2.设置热点规则中的其他选项:

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125231721.png)

**需求:**

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125231730.png)

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125231737.png)

==测试==

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125231742.png)

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125231747.png)

**注意:**

参数类型只支持，8种基本类型+String类

**==注意:==**

如果我们程序出现异常，是不会走blockHander的降级方法的，因为这个方法只配置了热点规则，没有配置限流规则

我们这里配置的降级方法是sentinel针对热点规则配置的

只有触发热点规则才会降级

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125231755.png)

### 系统规则:

系统自适应限流:
从整体维度对应用入口进行限流

对整体限流，比如设置qps到达100，这里限流会限制整个系统不可以

*![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125231808.png)*

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125231815.png)

==测试==:
![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125231825.png)

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125231831.png)

### @SentinelResource注解:

**用于配置降级等功能**

1，环境搭建

1. 为8401添加依赖

   添加我们自己的commone包的依赖

   ![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125231837.png)

   额外创建一个controller类

​     ![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125231844.png)


3. 配置限流

    **注意，我们这里配置规则，资源名指定的是@SentinelResource注解value的值，**

    **这样也是可以的，也就是不一定要指定访问路径**

    ![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125231851.png)

4. 测试.

    可以看到已经进入降级方法了

    ![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125231905.png)

5. ==此时我们关闭8401服务==

    可以看到，这些定义的规则是临时的，关闭服务，规则就没有了

    ![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125231911.png)

**可以看到上面配置的降级方法又出现Hystrix遇到的问题了**

 降级方法与业务方法耦合

 每个业务方法都需要对应一个降级方法

![image-20211129211547629](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211129211548.png)

#### 自定义限流处理逻辑:

1. ==单独创建一个类，用于处理限流==

   ![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125231923.png)

2. ==在controller中，指定使用自定义类中的方法作为降级方法==

   ![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125231928.png)

3. ==Sentinel中定义流控规则==:

   这里资源名，是以url指定，也可以使用@SentinelResource注解value的值指定

   ![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125231938.png)


4. ==测试==:

   ![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125231943.png)

5. ==整体==:

   ![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125231948.png)

### @SentinelResource注解的其他属性:

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125231955.png)

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125232000.png)

### 服务熔断:

1. **启动nacos和sentinel**

2. **新建两个pay模块 9003和9004**

1. pom

2. 配置文件

    ![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125232006.png)*

3. 主启动类

    ```java
    @SpringBootApplication
    @EnableDiscoveryClient
    public class PaymentMain9003 {
    
        public static void main(String[] args) {
            SpringApplication.run(PaymentMain9003.class，args);
        }
    }
     
    
    ```

4. controller

    ![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125232012.png)

     **然后启动9003.9004**

3. **新建一个order-84消费者模块:**

1. pom

    与上面的pay一模一样

2. 配置文件

    ![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125232016.png)

3. 主启动类

    ![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125232026.png)

4. 配置类

   ![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125232032.png)

5. controller

    ![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125232037.png)

    6.   **为业务方法添加fallback来指定降级方法**:

        ![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125232044.png)

        重启order

        测试:

        ![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125232052.png)

         

         所以fallback是用于管理异常的，当业务方法发生异常，可以降级到指定方法

    
    注意，我们这里并没有使用sentinel配置任何规则，但是却降级成功，就是因为fallback是用于管理异常的，当业务方法发生异常，可以降级到指定方法
    
    6.   **为业务方法添加blockHandler，看看是什么效果**
    
         ![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125232058.png)
    
         **重启84，访问业务方法:**
    
         ![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125232102.png)
    
          可以看到直接报错了，并没有降级，也就是说blockHandler只对sentienl定义的规则降级
    
    7.   **如果fallback和blockHandler都配置呢?**
    
         ![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125232107.png)
    
         **设置qps规则，阈值1**
    
         ![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125232116.png)
    
         **测试**:
    
         ![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125232122.png)
    
          可以看到，当两个都同时生效时，blockhandler优先生效
    
    8.  **@SentinelResource还有一个属性，exceptionsToIgnore**
    
        ![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125232133.png)
    
         **exceptionsToIgnore指定一个异常类，**
    
        **表示如果当前方法抛出的是指定的异常，不降级，直接对用户抛出异常**
    
         ![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125232148.png)

### sentinel整合ribbon+openFeign+fallback

1. 修改84模块，使其支持feign

    1. pom

       ![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125232155.png)

    2. 配置文件

       ![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125232200.png)

    3. 主启动类也要修改

       ![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125232204.png)

    4. 创建远程调用pay模块的接口

       ![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125232212.png)

    5. 创建这个接口的实现类，用于降级

       ![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125232217.png)

    6. 再次修改接口，指定降级类

    ![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125232222.png)

    7. controller添加远程调用

    ![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125232228.png)

    8. 测试

       启动9003，84

    9. 测试，如果关闭9003。看看84会不会降级

    ![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125232234.png)

    **可以看到，正常降级了**

**熔断框架比较**

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125232242.png)

### sentinel持久化规则

默认规则是临时存储的，重启sentinel就会消失

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125232248.png)

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

    ![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125232256.png)

     **实际上就是指定，我们的规则要保证在哪个名称空间的哪个分组下**

     			这里没有指定namespace， 但是是可以指定的

    ​			**注意，这里的dataid要与8401的服务名一致**

3. **在nacos中创建一个配置文件，dataId就是上面配置文件中指定的**

   ![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125232303.png)

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

   ![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/202111301141115.png)

4. 启动8401:

   ![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125232320.png)

   可以看到，直接读取到了规则(云服务器无法获取，这种方法是推模式，由nacos将限流策略推送到项目)

5. 关闭8401

    ![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125232327.png)

6. 此时重启8401，如果sentinel又可以正常读取到规则，那么证明持久化成功

    可以看到，又重新出现了

    ![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125232343.png)

## Seata:

![image-20211130154414714](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/202111301544299.png)

Seata 是一款开源的分布式事务解决方案，致力于提供高性能和简单易用的分布式事务服务。Seata 将为用户提供了 AT、TCC、SAGA 和 XA 事务模式，为用户打造一站式的分布式解决方案。

**分布式事务中的一些概念，也是seata中的概念:**

​        ![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125232404.png)

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125232357.png)

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125232410.png)

### seata安装:

1. **下载安装seata的安装包**

2. **修改file.conf**

3. ![image-20211130161912981](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/202111301619410.png)

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

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125232454.png)

下单--->库存--->账号余额

1. 创建三个数据库

   ```sql
   create database seata_order;
   create database seata_storage;
   create database seata_account;
   ```

2. 创建对应的表

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125232512.png)

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

   ![image-20211130164922599](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/202111301649182.png)

 订单seta-order-2001

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
        @MapperScan({"com.eiletxie.springcloud.alibaba.dao"})		指定我们的接口的位置
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
    2.   配置文件
    3.   主启动类
    4.    service层
    5.    dao层
    6.    controller层
    
     
    
     账号，seta-account-2003
    
    **看脑图**
    
    1.    pom     
    2.   配置文件
    3.   主启动类
    4.   service层
    5.    dao层
    6.    controller层
    
5. **全局创建完成后，首先测试不加seata**

   ![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125232609.png)

     ![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125232619.png)



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

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125232628.png)

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125232635.png)

**seata提供了四个模式:**

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125232641.png)

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125232653.png)

==第一阶段:==

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125232712.png)

​    ![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125232720.png)

==二阶段之提交==:

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125232728.png)

==二阶段之回滚:==

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125232740.png)

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125232750.png)

==断点==:

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125232756.png)

**可以看到，他们的xid全局事务id是一样的，证明他们在一个事务下**

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125232802.png)

**before 和 after的原理就是**

![](./%E5%B0%9A%E7%A1%85%E8%B0%B7SpringCloud(H%E7%89%88&alibaba).assets/20211125232808.png)

**在更新数据之前，先解析这个更新sql，然后查询要更新的数据，进行保存**

















