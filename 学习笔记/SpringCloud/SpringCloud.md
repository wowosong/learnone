# SpringCloud

[TOC]

## 笔记版本

| name                 | version       |
| -------------------- | ------------- |
| Spring Cloud         | Hoxton.SR1    |
| Spring Boot          | 2.2.2.RELEASE |
| Spring Cloud Alibaba | 2.1.0.RELEASE |
| Java                 | Jav8          |
| Maven                | 3.5及以上     |
| MySQL                | 5.7及以上     |

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081048927.png)

通过查看 `Spring` 官网选择任意版本的 `Spring Cloud` 可以查看官方推荐与这个版本的 `Spring Cloud`  配套使用的 `Spring Boot` 版本





<hr/>

## 微服务架构编码构建

### IDEA 创建 Project 工作空间

#### 微服务 Cloud 整体聚合父工程 Project

##### New Project

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081048825.png)


##### 聚合总父工程名字

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081048502.png)


##### Maven选版本

不要使用 IDEA 自带的 Maven，使用自己安装的 Maven。

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081048869.png)


##### 字符编码

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081049617.png)

##### 注解生效激活

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081049083.png)


##### Java 编译版本

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081049429.png)


#### 父工程 pom

```xml
<?xml version="1.0" encoding="UTF-8"?>

<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
  <modelVersion>4.0.0</modelVersion>

  <groupId>org.hong</groupId>
  <artifactId>SpringCloud</artifactId>
  <version>1.0-SNAPSHOT</version>
  <!-- 父工程的打包方式应该为pom, 而不是jar或者war -->
  <packaging>pom</packaging>

  <!-- 统一管理jar包版本 -->
  <properties>
    <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
    <maven.compiler.source>1.8</maven.compiler.source>
    <maven.compiler.target>1.8</maven.compiler.target>
    <junit.version>4.12</junit.version>
    <log4j.version>1.2.17</log4j.version>
    <lombok.version>1.16.18</lombok.version>
    <mysql.version>5.1.47</mysql.version>
    <druid.version>1.1.16</druid.version>
    <mybatis.spring.boot.version>1.3.0</mybatis.spring.boot.version>
  </properties>

  <!-- dependencyManagement:子模块继承之后，提供作用：锁定版本 +子modlue不用写groupId和version  -->
  <dependencyManagement>
    <dependencies>
      <!--spring boot 2.2.2-->
      <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-dependencies</artifactId>
        <version>2.2.2.RELEASE</version>
        <type>pom</type>
        <scope>import</scope>
      </dependency>
      <!--spring cloud Hoxton.SR1-->
      <dependency>
        <groupId>org.springframework.cloud</groupId>
        <artifactId>spring-cloud-dependencies</artifactId>
        <version>Hoxton.SR1</version>
        <type>pom</type>
        <scope>import</scope>
      </dependency>
      <!--spring cloud alibaba 2.1.0.RELEASE-->
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
        <groupId>org.mybatis.spring.boot</groupId>
        <artifactId>mybatis-spring-boot-starter</artifactId>
        <version>${mybatis.spring.boot.version}</version>
      </dependency>
      <dependency>
        <groupId>junit</groupId>
        <artifactId>junit</artifactId>
        <version>${junit.version}</version>
      </dependency>
      <dependency>
        <groupId>log4j</groupId>
        <artifactId>log4j</artifactId>
        <version>${log4j.version}</version>
      </dependency>
      <dependency>
        <groupId>org.projectlombok</groupId>
        <artifactId>lombok</artifactId>
        <version>${lombok.version}</version>
        <optional>true</optional>
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





### REST 微服务构建

#### 微服务提供者支付 Module 模块

##### 创建 cloud-provider-payment8001 模块

**<span style='color: red;'>注意：这里使用 `Maven` 创建，而不是使用 `Spring Initializr`。</span>使用 `Spring Initializr` 也行，我习惯用这个。**

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081049544.png)


##### 修改 pom 文件

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <parent>
        <artifactId>springcloud</artifactId>
        <groupId>org.hong</groupId>
        <version>1.0-SNAPSHOT</version>
    </parent>
    <modelVersion>4.0.0</modelVersion>

    <artifactId>cloud-provider-payment8001</artifactId>

    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
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
        <!--mysql-connector-java-->
        <dependency>
            <groupId>mysql</groupId>
            <artifactId>mysql-connector-java</artifactId>
        </dependency>
        <!--jdbc-->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-jdbc</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-devtools</artifactId>
            <scope>runtime</scope>
            <optional>true</optional>
        </dependency>
        <!-- lombok -->
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <optional>true</optional>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
    </dependencies>

</project>
```



##### application.yaml

```yaml
server:
  port: 8001

spring:
  application:
    name: cloud-payment-service
  datasource:
    type: com.alibaba.druid.pool.DruidDataSource            # 当前数据源操作类型
    driver-class-name: org.gjt.mm.mysql.Driver              # mysql驱动包 com.mysql.jdbc.Driver
    url: jdbc:mysql://localhost:3306/springcloud?useUnicode=true&characterEncoding=utf-8&useSSL=false
    username: root
    password: 1234

mybatis:
  mapperLocations: classpath:mapper/*.xml
  type-aliases-package: org.hong.springcloud.entity    # 所有Entity别名类所在包
```



##### 主启动

```java
package org.hong.springcloud;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class PaymentMain8001 {
    public static void main(String[] args) {
        SpringApplication.run(PaymentMain8001.class, args);
    }
}
```



##### 业务类

###### 建表SQL

```sql
CREATE TABLE `payment` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `serial` varchar(200) DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8
-- 自己加几条数据
```



###### entity

**主实体 Payment**

```java
package org.hong.springcloud.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Payment implements Serializable {
    private Long id;
    private String serial;
}
```



**json 封装体 CommonResult**

```java
package org.hong.springcloud.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CommonResult<T> {
    private Integer code;
    private String message;
    private T data;

    public CommonResult(Integer code, String message){
        this(code, message, null);
    }
}

```



###### mapper

**mapper 接口 PaymentMapper**

```java
package org.hong.springcloud.mapper;

import org.apache.ibatis.annotations.Mapper;
import org.hong.springcloud.entity.Payment;

@Mapper
public interface PaymentMapper {
    int save(Payment payment);

    Payment getPaymentById(Long Id);
}
```

**mapper 映射文件 PaymentMapper.xml**

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper
        PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-mapper.dtd">

<mapper namespace="org.hong.springcloud.mapper.PaymentMapper">
    <resultMap id="baseResultMap" type="payment">
        <id column="id" property="id" jdbcType="BIGINT"></id>
        <result column="serial" property="serial" jdbcType="VARCHAR"></result>
    </resultMap>
    <insert id="save" parameterType="payment" useGeneratedKeys="true" keyColumn="id" keyProperty="id">
        INSERT INTO
            payment(serial)
        VALUES
            (#{serial});
    </insert>
    <select id="getPaymentById" parameterType="Long" resultMap="baseResultMap">
        SELECT
            id, serial
        FROM
            payment
        WHERE
            id = #{id}
    </select>
</mapper>
```



###### service

**接口 PaymentService**

```java
package org.hong.springcloud.service;

import org.hong.springcloud.entity.Payment;

public interface PaymentService {
    int save(Payment payment);

    Payment getPaymentById(Long id);
}
```

**实现类**

```java
package org.hong.springcloud.service.serviceimpl;

import org.hong.springcloud.entity.Payment;
import org.hong.springcloud.mapper.PaymentMapper;
import org.hong.springcloud.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PaymentServiceImpl implements PaymentService {
    @Autowired
    private PaymentMapper paymentMapper;

    @Override
    public int save(Payment payment) {
        return paymentMapper.save(payment);
    }

    @Override
    public Payment getPaymentById(Long id) {
        return paymentMapper.getPaymentById(id);
    }
}
```



###### controller

```java
package org.hong.springcloud.controller;

import lombok.extern.slf4j.Slf4j;
import org.hong.springcloud.entity.CommonResult;
import org.hong.springcloud.entity.Payment;
import org.hong.springcloud.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/payment")
@Slf4j
public class PaymentController {
    @Autowired
    private PaymentService paymentService;

    @PostMapping
    public CommonResult<Payment> save(@RequestBody Payment payment){
        int result = paymentService.save(payment);
        log.info("****插入结果:" + result);
        if(result > 0){
            return new CommonResult(200, "插入数据库成功", result);
        }else{
            return new CommonResult(444, "插入数据库失败", null);
        }
    }

    @GetMapping("/{id}")
    public CommonResult<Payment> getPaymentById(@PathVariable("id") Long id){
        Payment payment = paymentService.getPaymentById(id);
        log.info("****查询结果:" + payment);
        if(payment != null){
            return new CommonResult(200, "查询成功", payment);
        }else{
            return new CommonResult(444, "没有对应记录, 查询" + id, null);
        }
    }
}

```

测试运行，没问题





#### 热部署 Devtools

不配也行

##### 添加 Devtools 依赖

哪个微服务需要使用就添加到哪个微服务的 pom.xml 文件中

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-devtools</artifactId>
    <scope>runtime</scope>
    <optional>true</optional>
</dependency>
```



##### 修改父工程的 pom.xml 文件

把下面这一段粘贴到聚合父类总工程的pom.xml里

```xml
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



##### 修改 IDEA 设置

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081050084.png)


##### 更新值

使用快捷键 `ctrl + shift + alt + /` 打开如下对话框

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081050405.png)

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081050513.png)





#### 微服务消费者订单 Module 模块

##### 创建 `cloud-consumer-order81` 模块

步骤跟上面一样



##### 修改 pom.xml 文件

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <parent>
        <artifactId>springcloud</artifactId>
        <groupId>org.hong</groupId>
        <version>1.0-SNAPSHOT</version>
    </parent>
    <modelVersion>4.0.0</modelVersion>

    <artifactId>cloud-consumer-order81</artifactId>

    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-actuator</artifactId>
        </dependency>

        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-devtools</artifactId>
            <scope>runtime</scope>
            <optional>true</optional>
        </dependency>
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <optional>true</optional>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
    </dependencies>

</project>
```



##### application.yaml

```yaml
# 端口被占用就使用别的端口
server:
  port: 81
```



##### 主启动

```java
package org.hong.springcloud;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class OrderMain81 {
    public static void main(String[] args) {
        SpringApplication.run(OrderMain81.class, args);
    }
}
```



##### 业务类

###### entity

81端口需要进行支付操作，支付操作在8001端口，而支付操作的业务在8001端口，因此**81端口不应该出现与支付相关的 `service`、`mapper`**

81端口需要去调用8001端口暴露的接口，因此**81端口需要 `controller`**

81端口的 `controller` 也需要接收值和返回值，因此**81端口需要 `entity`**

**主实体 Payment**

```java
package org.hong.springcloud.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Payment implements Serializable {
    private Long id;
    private String serial;
}
```



**json 封装体 CommonResult**

```java
package org.hong.springcloud.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CommonResult<T> {
    private Integer code;
    private String message;
    private T data;

    public CommonResult(Integer code, String message){
        this(code, message, null);
    }
}
```



###### RestTemplate

`RestTemplate` 提供了多种便捷访问远程Http服务的方法， 是一种简单便捷的访问 `restful` 服务模板类，是 `Spring` 提供的用于访问 `Rest`服务的客户端模板工具集。简单的说，**通过 `RestTemplate` 可以让81端口调用到8001端口暴露的接口**。与 `JdbcTemplate`、`RedisTemplate` 一样，`RestTemplate` 也需要注入到 `IOC` 容器中。



###### ApplicationContextConfig

```java
package org.hong.springcloud.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

@Configuration
public class ApplicationContextConfig {
    @Bean
    public RestTemplate getRestTemplate(){
        return new RestTemplate();
    }
}
```



###### controller

```java
package org.hong.springcloud.controller;

import lombok.extern.slf4j.Slf4j;
import org.hong.springcloud.entity.CommonResult;
import org.hong.springcloud.entity.Payment;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

@RestController
@RequestMapping("/consumer")
@Slf4j
public class OrderController {
    public static final String PAYMENT_URL = "http://localhost:8001/";

    @Autowired
    private RestTemplate restTemplate;

    @PostMapping("/payment")
    public CommonResult<Payment> save(@RequestBody Payment payment){
        return restTemplate.postForObject(PAYMENT_URL + "payment", payment, CommonResult.class);
    }

    @GetMapping("/payment/{id}")
    public CommonResult<Payment> getPayment(@PathVariable("id") Long id){
        return restTemplate.getForObject(PAYMENT_URL + "/payment/" + id, CommonResult.class);
    }
}
```





#### 工程重构

##### 观察问题

两个微服务中都有一个公共的部分，造成了代码的冗余

![image-20220122120457531](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081050575.png)

---------



##### 新建公共工程

新建 `cloud-api-commons` 工程，公共部分写这个工程里面。怎么创建就不演示了，跟上面一样。

##### 修改 pom.xml 文件

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <parent>
        <artifactId>springcloud</artifactId>
        <groupId>org.hong</groupId>
        <version>1.0-SNAPSHOT</version>
    </parent>
    <modelVersion>4.0.0</modelVersion>

    <artifactId>cloud-api-commons</artifactId>

    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-devtools</artifactId>
            <scope>runtime</scope>
            <optional>true</optional>
        </dependency>
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <optional>true</optional>
        </dependency>
        <dependency>
            <groupId>cn.hutool</groupId>
            <artifactId>hutool-all</artifactId>
            <version>5.1.0</version>
        </dependency>
    </dependencies>
    
</project>
```



##### 编写公共部分

从任意一个微服务中，复制一份 `entity` 包下的内容到 `cloud-api-commons` 中。



##### maven 打包

先运行 `clean`，再运行 `install`，打包到本地仓库。

![image-20220122120400748](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081050263.png)

---



##### 改造81和8001端口服务

1.  删除各自的原先有过的 `entity` 文件夹

2.  在各自的 pom.xml 添加依赖

    ```xml
    <!-- 引入自己定义的api通用包，可以使用Payment支付Entity -->
    <dependency>
        <groupId>org.hong</groupId>
        <artifactId>cloud-api-commons</artifactId>
        <!-- project.version: 当前工程的版本号 -->
        <version>${project.version}</version>
    </dependency>
    ```

3.  将报错的地方导入正确的类路径

---



#### 目前工程样图

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081050370.png)

## Eureka 服务注册与发现

Eureka 已经停止更新了，进入了维护状态

### 概述

`Eureka` 包含两个组件：`Eureka Server` 和 `Eureka Client`

**`Eureka Server` 提供服务注册服务**
各个微服务节点通过配置启动后，会在EurekaServer中进行注册，这样EurekaServer中的服务注册表中将会存储所有可用服务节点的信息，服务节点的信息可以在界面中直观看到。

**`Eureka Client` 通过注册中心进行访问**
是一个Java客户端，用于简化Eureka Server的交互，客户端同时也具备一个内置的、使用轮询(round-robin)负载算法的负载均衡器。**在应用启动后，将会向Eureka Server发送心跳(默认周期为30秒)。如果Eureka Server在多个心跳周期内没有接收到某个节点的心跳，EurekaServer将会从服务注册表中把这个服务节点移除（默认90秒）**



### 单机 Eureka 构建步骤

#### 创建 EurekaServer 服务注册中心

##### 创建 Module

`cloud-eureka-server7001`



##### 修改 pom.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <parent>
        <artifactId>springcloud</artifactId>
        <groupId>org.hong</groupId>
        <version>1.0-SNAPSHOT</version>
    </parent>
    <modelVersion>4.0.0</modelVersion>

    <artifactId>cloud-eureka-server7001</artifactId>

    <dependencies>
        <!--eureka-server-->
        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-starter-netflix-eureka-server</artifactId>
        </dependency>
        <!-- 引入自己定义的api通用包，可以使用Payment支付Entity -->
        <dependency>
            <groupId>org.hong</groupId>
            <artifactId>cloud-api-commons</artifactId>
            <version>${project.version}</version>
        </dependency>
        <!--boot web actuator-->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-actuator</artifactId>
        </dependency>
        <!--一般通用配置-->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-devtools</artifactId>
            <scope>runtime</scope>
            <optional>true</optional>
        </dependency>
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
        <dependency>
            <groupId>junit</groupId>
            <artifactId>junit</artifactId>
        </dependency>
    </dependencies>
    
</project>
```



##### 主启动

```java
package org.hong.springcloud;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.eureka.server.EnableEurekaServer;

@SpringBootApplication
// @EnableEurekaServer: 表明当前服务是服务注册中心
@EnableEurekaServer
public class EurekaMain7001 {
    public static void main(String[] args) {
        SpringApplication.run(EurekaMain7001.class, args);
    }
}
```



##### application.yaml

```yaml
server:
  port: 7001

eureka:
  instance:
    hostname: localhost #eureka服务端的实例名称
  client:
    #false表示不向注册中心注册自己。
    register-with-eureka: false
    #false表示自己端就是注册中心，我的职责就是维护服务实例，并不需要去检索服务
    fetch-registry: false
    service-url:
      #设置与Eureka Server交互的地址查询服务和注册服务都需要依赖这个地址。
      defaultZone: http://${eureka.instance.hostname}:${server.port}/eureka/
```



##### 测试

浏览器访问 `http://localhost:7001/`

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081051580.png)

`No instances available` 没有服务被发现，因为没有注册服务进来当然不可能有服务被发现





#### 将8001端口服务注册进 EurekaServer 成为服务提供者 provider 

##### 修改 pom.xml

```xml
<!--eureka-client-->
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-netflix-eureka-client</artifactId>
</dependency>
```



##### 修改 application.yaml

直接粘贴到 `applicaiton.yaml` 文件中，`eureka` 节点就是根节点

```yaml
eureka:
  client:
    #表示是否将自己注册进EurekaServer默认为true。
    register-with-eureka: true
    #是否从EurekaServer抓取已有的注册信息，默认为true。单节点无所谓，集群必须设置为true才能配合ribbon使用负载均衡
    fetchRegistry: true
    #服务注册地址
    service-url:
      defaultZone: http://localhost:7001/eureka
```



##### 修改主启动类

```java
package org.hong.springcloud;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.eureka.EnableEurekaClient;

@SpringBootApplication
// 只加了这一个注解, 表明当前服务是Client
@EnableEurekaClient
public class PaymentMain8001 {
    public static void main(String[] args) {
        SpringApplication.run(PaymentMain8001.class, args);
    }
}
```



##### 测试

先要启动 EurekaServer，再启动 EurekaClient，访问 `http://localhost:7001/`

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081051720.png)

如果出现了服务名称代表成功，这个服务名称就是我们在 `yaml` 中配置的 `spring.appliction.name` 的值。

```yaml
spring:
  application:
    name: cloud-payment-service
```





#### 将81端口服务注册进 EurekaServer 成为服务服务消费者consumer

##### 修改 pom.xml

```xml
<!--eureka-client-->
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-netflix-eureka-client</artifactId>
</dependency>
```



##### 修改 application.yaml

```yaml
spring:
    application:
        name: cloud-order-service

eureka:
  client:
    #表示是否将自己注册进EurekaServer默认为true。
    register-with-eureka: true
    #是否从EurekaServer抓取已有的注册信息，默认为true。单节点无所谓，集群必须设置为true才能配合ribbon使用负载均衡
    fetchRegistry: true
    service-url:
      defaultZone: http://localhost:7001/eureka
```



##### 修改主启动类

```java
package org.hong.springcloud;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.eureka.EnableEurekaClient;

@SpringBootApplication
@EnableEurekaClient
public class OrderMain81 {
    public static void main(String[] args) {
        SpringApplication.run(OrderMain81.class, args);
    }
}
```



##### 测试

先启动 EurekaServer，7001服务；再要启动服务提供者provider，8001服务；访问 http://localhost:7001/

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081051879.png)

浏览器访问 http://localhost:81/consumer/payment/1 进行测试

 



### 集群 Eureka 构建步骤

Eureka 系统架构，`Eureka Server` 使用集群方式 ( 如果使用单机，Eureka 服务器一旦宕机，所有的服务都无法调用 )，`Service Provider` ( 服务提供者 )也使用集群；`Service Consumer` ( 服务使用者 ) 就不管我们的事情了。

![image-20220122120638425](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081051990.png)

<br/>

#### EurekaServer集群环境构建步骤

##### 创建 Module

新建 cloud-eureka-server7002



##### 修改 pom.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <parent>
        <artifactId>springcloud</artifactId>
        <groupId>org.hong</groupId>
        <version>1.0-SNAPSHOT</version>
    </parent>
    <modelVersion>4.0.0</modelVersion>

    <artifactId>cloud-eureka-server7002</artifactId>

    <dependencies>
        <!--eureka-server-->
        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-starter-netflix-eureka-server</artifactId>
        </dependency>
        <!-- 引入自己定义的api通用包，可以使用Payment支付Entity -->
        <dependency>
            <groupId>org.hong</groupId>
            <artifactId>cloud-api-commons</artifactId>
            <version>${project.version}</version>
        </dependency>
        <!--boot web actuator-->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-actuator</artifactId>
        </dependency>
        <!--一般通用配置-->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-devtools</artifactId>
            <scope>runtime</scope>
            <optional>true</optional>
        </dependency>
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
        <dependency>
            <groupId>junit</groupId>
            <artifactId>junit</artifactId>
        </dependency>
    </dependencies>

</project>
```



##### 主启动

```java
package org.hong.springcloud;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.eureka.server.EnableEurekaServer;

@SpringBootApplication
@EnableEurekaServer
public class EurekaMain7002 {
    public static void main(String[] args) {
        SpringApplication.run(EurekaMain7002.class, args);
    }
}
```



##### 修改映射配置

打开 `C:\Windows\System32\drivers\etc` 文件夹下的 `host` 文件添加如下配置

```shell
# 直接添加到host文件的最后面
# 作用: 浏览器访问eureka7001.com相当于访问127.0.0.1, 同理eureka7002.com也是
127.0.0.1 eureka7001.com
127.0.0.1 eureka7002.com
```

添加完后打开 `cmd` 刷新 dns 缓存，`ipconfig/flushdns`



##### application.xml

###### 7001

```yaml
server:
  port: 7001

eureka:
  instance:
    hostname: eureka7001.com #eureka服务端的实例名称
  client:
    register-with-eureka: false     #false表示不向注册中心注册自己。
    fetch-registry: false     #false表示自己端就是注册中心，我的职责就是维护服务实例，并不需要去检索服务
    service-url:
      # 7001与7002相互守望, 相互注册, 如果有多个用逗号分割
      defaultZone: http://eureka7002.com:7002/eureka/
```



###### 7002

```yaml
server:
  port: 7002

eureka:
  instance:
    hostname: eureka7002.com #eureka服务端的实例名称
  client:
    register-with-eureka: false     #false表示不向注册中心注册自己。
    fetch-registry: false     #false表示自己端就是注册中心，我的职责就是维护服务实例，并不需要去检索服务
    service-url:
      defaultZone: http://eureka7001.com:7001/eureka/
```



##### 测试

启动 7001 和 7002，并访问 `http://eureka7001.com:7001/` 和 `http://eureka7002.com:7002/`

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081051981.png)

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081051166.png)

7001访问页面可以看到7002，反之7002可以看到7001，环境构建成功



#### 8001微服务发布到 Eureka 集群中

##### application.yaml

```yaml
eureka:
  client:
    service-url:
      # 将8001微服务发布到到Eureka集群的每个节点中
	  defaultZone: http://eureka7001.com:7001/eureka,http://eureka7002.com:7002/eureka  # 集群版
```



#### 81微服务发布到 Eureka 集群中

##### application.yaml

```yaml
eureka:
  client:
    service-url:
      # 将81微服务发布到到Eureka集群的每个节点中
	  defaultZone: http://eureka7001.com:7001/eureka,http://eureka7002.com:7002/eureka  # 集群版
```



#### 测试

先要启动 `EurekaServer`，7001/7002服务；

再要启动服务提供者 `provider`，8001

再要启动消费者，81

访问 http://eureka7001.com:7001/、http://eureka7002.com:7002/，观察注册进去的服务

![image-20210601202841098](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081052344.png)

出现上述的2个服务代表搭建成功



#### 支付服务提供者8001集群环境构建

##### 创建 Module

新建 `cloud-provider-payment8002`



##### 修改 pom.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <parent>
        <artifactId>springcloud</artifactId>
        <groupId>org.hong</groupId>
        <version>1.0-SNAPSHOT</version>
    </parent>
    <modelVersion>4.0.0</modelVersion>

    <artifactId>cloud-provider-payment8002</artifactId>

    <dependencies>
        <!--eureka-client-->
        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-starter-netflix-eureka-client</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
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
        <!--mysql-connector-java-->
        <dependency>
            <groupId>mysql</groupId>
            <artifactId>mysql-connector-java</artifactId>
        </dependency>
        <!--jdbc-->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-jdbc</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-devtools</artifactId>
            <scope>runtime</scope>
            <optional>true</optional>
        </dependency>
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <optional>true</optional>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
        <!-- 引入自己定义的api通用包，可以使用Payment支付Entity -->
        <dependency>
            <groupId>org.hong</groupId>
            <artifactId>cloud-api-commons</artifactId>
            <version>${project.version}</version>
        </dependency>
    </dependencies>

</project>
```



##### application.xml

```yaml
server:
  port: 8002

spring:
  application:
  	# 服务名称不用改, 与8001一致
    name: cloud-payment-service
  datasource:
    type: com.alibaba.druid.pool.DruidDataSource            # 当前数据源操作类型
    driver-class-name: org.gjt.mm.mysql.Driver              # mysql驱动包 com.mysql.jdbc.Driver
    url: jdbc:mysql://localhost:3306/springcloud?useUnicode=true&characterEncoding=utf-8&useSSL=false
    username: root
    password: 1234

eureka:
  client:
    #表示是否将自己注册进EurekaServer默认为true。
    register-with-eureka: true
    #是否从EurekaServer抓取已有的注册信息，默认为true。单节点无所谓，集群必须设置为true才能配合ribbon使用负载均衡
    fetchRegistry: true
    service-url:
      #defaultZone: http://localhost:7001/eureka
      defaultZone: http://eureka7001.com:7001/eureka,http://eureka7002.com:7002/eureka  # 集群版


mybatis:
  mapperLocations: classpath:mapper/*.xml
  type-aliases-package: org.hong.springcloud.entity    # 所有Entity别名类所在包
```



##### 主启动

```java
package org.hong.springcloud;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.eureka.EnableEurekaClient;

@SpringBootApplication
@EnableEurekaClient
public class PaymentMain8002 {
    public static void main(String[] args) {
        SpringApplication.run(PaymentMain8002.class, args);
    }
}
```



##### 业务类

直接从8001微服务中粘贴过来



##### 修改8001/8002的Controller

修改的目的：查看当前调用的是哪个端口的服务

```java
package org.hong.springcloud.controller;

import lombok.extern.slf4j.Slf4j;
import org.hong.springcloud.entity.CommonResult;
import org.hong.springcloud.entity.Payment;
import org.hong.springcloud.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/payment")
@Slf4j
public class PaymentController {
    @Autowired
    private PaymentService paymentService;

    // 当前服务的端口号
    @Value("${server.port}")
    private String serverPort;

    @PostMapping
    public CommonResult<Payment> save(@RequestBody Payment payment){
        int result = paymentService.save(payment);
        log.info("****插入结果:" + result);
        if(result > 0){
            return new CommonResult(200, "插入数据库成功, serverPort: " + this.serverPort, result);
        }else{
            return new CommonResult(444, "插入数据库失败", null);
        }
    }

    @GetMapping("/{id}")
    public CommonResult<Payment> getPaymentById(@PathVariable Long id){
        Payment payment = paymentService.getPaymentById(id);
        log.info("****查询结果:" + payment);
        if(payment != null){
            return new CommonResult(200, "查询成功, serverPort: " + this.serverPort, payment);
        }else{
            return new CommonResult(444, "没有对应记录, 查询" + id, null);
        }
    }
}
```



##### 测试

先要启动 `EurekaServer`，7001/7002服务；

再要启动服务提供者 `provider`，8001

再要启动消费者，81

访问 http://eureka7001.com:7001/、http://eureka7002.com:7002/，观察注册进去的服务

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081052090.png)

可以看到 `cloud-payment-service` 服务一共有2个，此时我们的支付服务提供者集群环境搭建成功



##### 问题

访问 http://localhost:81/consumer/payment/1，观察返回的 json 数据。

```json
{"code":200,"message":"查询成功, serverPort: 8001","data":{"id":1,"serial":"hong"}}
```

无论我们发送多少次，真正执行查询的端口总是为8001端口。因为我们在进行服务调用的代码是写死的。





#### 负载均衡

订单服务访问地址不能写死，应该**使用微服务名称来进行访问**。

##### 修改81服务 Controller

```java
// 通过在eureka上注册过的微服务名称调用
public static final String PAYMENT_URL = "http://CLOUD-PAYMENT-SERVICE";
```

我们再次访问 http://localhost:81/consumer/payment/1

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081052610.png)

直接就 `GG` 了，因为我们少开启了一个功能。



##### 赋予 RestTemplate 负载均衡的能力

在配置 `RestTemplate` 的方法上加上 `@LoadBalanced` 注解即可。这是 `Ribbon` 里面的东西。

```java
package org.hong.springcloud.config;

import org.springframework.cloud.client.loadbalancer.LoadBalanced;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

@Configuration
public class ApplicationContextConfig {
    @Bean
    @LoadBalanced //使用@LoadBalanced注解赋予RestTemplate负载均衡的能力
    public RestTemplate getRestTemplate(){
        return new RestTemplate();
    }
}
```

再次访问 http://localhost:81/consumer/payment/1，每次访问8001/8002都是交替出现

Ribbon 和 Eureka 整合后 Consumer 可以直接调用服务而不用再关心地址和端口号，且该服务还有负载功能了。





### actuator 微服务信息完善

#### 服务名称修改

**修改 `cloud-provider-payment8002` 服务的 `application.yaml`**

```yaml
eureka:
  instance:
  	# 自定义信息
    instance-id: payment8001
```

**效果**

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081052586.png)



#### IP 信息提示

**修改 `cloud-provider-payment8002` 服务的 `application.yaml`**

```yaml
eureka:
  instance:
  	# IP 信息显示
    prefer-ip-address: true
```

**效果**

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081053932.png)





### 服务发现 Discovery

对于注册进 `Eureka` 里面的微服务，可以通过服务发现来获得该服务的信息

#### 修改8001的 Controller

```java
// import org.springframework.cloud.client.discovery.DiscoveryClient; 注意别导错包
// 容器里面已经有的, 我们获取就行
@Autowired
private DiscoveryClient discoveryClient;

@GetMapping("/discovery")
public Object discovery(){
    // 获取注册到Eureka中的所有微服务名称
    List<String> services = discoveryClient.getServices();
    services.forEach(element -> {
        log.info("****element:" + element);
    });

    // 获得指定微服务名称下的所有实例
    List<ServiceInstance> instances = discoveryClient.getInstances("CLOUD-PAYMENT-SERVICE");
    instances.forEach(instance -> {
        log.info(instance.getServiceId() + "\t" + instance.getHost() + "\t" + instance.getPort() + "\t" + instance.getUri());
    });
    return discoveryClient;
}
```



#### 修改8001的主启动类

```java
package org.hong.springcloud;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.netflix.eureka.EnableEurekaClient;

@SpringBootApplication
@EnableEurekaClient
@EnableDiscoveryClient // 添加@EnableDiscoveryClient注解
public class PaymentMain8001 {
    public static void main(String[] args) {
        SpringApplication.run(PaymentMain8001.class, args);
    }
}
```



#### 日志打印

```shell
2021-06-02 11:21:15.078  INFO 4756 --- [nio-8001-exec-1] o.h.s.controller.PaymentController       : ****element:cloud-payment-service
2021-06-02 11:21:15.079  INFO 4756 --- [nio-8001-exec-1] o.h.s.controller.PaymentController       : ****element:cloud-order-service
2021-06-02 11:21:15.080  INFO 4756 --- [nio-8001-exec-1] o.h.s.controller.PaymentController       : CLOUD-PAYMENT-SERVICE	192.168.200.1	8002	http://192.168.200.1:8002
2021-06-02 11:21:15.081  INFO 4756 --- [nio-8001-exec-1] o.h.s.controller.PaymentController       : CLOUD-PAYMENT-SERVICE	192.168.200.1	8001	http://192.168.200.1:8001
```

![image-20210602112318899](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081053215.png)





### Eureka 自我保护

#### 概述

保护模式主要用于一组客户端和 `Eureka Server` 之间存在网络分区场景下的保护。一旦进入保护模式，`Eureka Server` 将会尝试保护其服务注册表中的信息，<span style='color: red;'>不再删除服务注册表中的数据，也就是不会注销任何微服务。</span>



#### 故障现象

如果在 `Eureka Server` 的首页看到以下这段提示，则说明Eureka进入了保护模式：

![image-20210602112754416](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081053215.png)



#### 导致原因

为了防止 `Eureka Client` 可以正常运行，但是 与 `Eureka Server` 网络不通情况下，`Eureka Server` 不会立刻将 `Eureka Client` 服务剔除

默认情况下，如果 `EurekaServer` 在一定时间内没有接收到某个微服务实例的心跳，`Eureka Server` 将会注销该实例（默认90秒）。但是当网络分区故障发生(延时、卡顿、拥挤)时，微服务与 `Eureka Server` 之间无法正常通信，以上行为可能变得非常危险了——因为微服务本身其实是健康的，<span style='color: red;'>此时本不应该注销这个微服务</span>。`Eureka` 通过 “自我保护模式” 来解决这个问题——当 `Eureka Server` 节点在短时间内丢失过多客户端时（可能发生了网络分区故障），那么这个节点就会进入自我保护模式。

<span style='color: red;'>在自我保护模式中，`Eureka Server`会保护服务注册表中的信息，不再注销任何服务实例。</span>
它的设计哲学就是宁可保留错误的服务注册信息，也不盲目注销任何可能健康的服务实例。<span style='color: red;'>一句话讲解：好死不如赖活着</span>

综上，自我保护模式是一种应对网络异常的安全保护措施。它的架构哲学是宁可同时保留所有微服务（健康的微服务和不健康的微服务都会保留）也不盲目注销任何健康的微服务。使用自我保护模式，可以让 `Eureka` 集群更加的健壮、稳定。



#### 关闭自我保护

演示案例只启用7001和8001

##### 修改7001的 `application.yaml`

```yaml
eureka:
  server:
  	#关闭自我保护机制，保证不可用服务被及时踢除
    enable-self-preservation: false
    #检测微服务存活的时间间隔, 单位为毫秒, 为了测试才改的, 不一定非要改
    eviction-interval-timer-in-ms: 2000
```

##### 效果

![image-20210602120657459](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081053300.png)



##### 修改8001的 `application.yaml`

为了测试才改的，缩小时间间隔

```yaml
eureka:
  instance:
    #Eureka客户端向服务端发送心跳的时间间隔，单位为秒(默认是30秒)
    lease-renewal-interval-in-seconds: 1
    #Eureka服务端在收到最后一次心跳后等待时间上限，单位为秒(默认是90秒)，超时将剔除服务
    lease-expiration-duration-in-seconds: 2
```



##### 测试

先启动7001再启动8001

![image-20210602121615323](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081053996.png)

再关闭8001

![image-20210602121717159](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081054389.png)





<hr/>

## Consul 服务注册与发现

### Consul 简介

#### 概述

Consul 是一套开源的分布式服务发现和配置管理系统，由 HashiCorp 公司用 Go 语言开发。

提供了微服务系统中的服务治理、配置中心、控制总线等功能。这些功能中的每一个都可以根据需要单独使用，也可以一起使用以构建全方位的服务网格，总之Consul提供了一种完整的服务网格解决方案。

它具有很多优点。包括： 基于 raft 协议，比较简洁； 支持健康检查, 同时支持 HTTP 和 DNS 协议 支持跨数据中心的 WAN 集群 提供图形界面 跨平台，支持 Linux、Mac、Windows



#### Spring Cloud Consul 特性

-   服务发现：提供HTTP和DNS两种发现方式。
-   健康监测：支持多种方式，HTTP、TCP、Docker、Shell脚本定制化监控
-   KV存储：Key、Value的存储方式
-   多数据中心：Consul支持多数据中心
-   可视化Web界面



#### 下载地址

https://www.consul.io/downloads



#### 官方文档

https://www.springcloud.cc/spring-cloud-consul.html





### 安装并运行 Consul

官网安装说明：https://learn.hashicorp.com/consul/getting-started/install.html

-   下载完成后只有一个consul.exe文件，硬盘路径下双击运行，查看版本号信息

    ![image-20210602151911375](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081054044.png)

-   使用开发模式启动

    -   cmd 窗口输入 `consul agent -dev` 命令

    -   通过以下地址可以访问 `Consul` 的首页：http://localhost:8500

        ![image-20210602162654997.png](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081054415.png)



### 服务提供者

#### 新建 Module 支付服务 provider8006

`cloud-providerconsul-payment8006`



#### POM

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <parent>
        <artifactId>springcloud</artifactId>
        <groupId>org.hong</groupId>
        <version>1.0-SNAPSHOT</version>
    </parent>
    <modelVersion>4.0.0</modelVersion>

    <artifactId>cloud-providerconsul-payment8006</artifactId>

    <dependencies>
        <!--SpringCloud consul-server -->
        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-starter-consul-discovery</artifactId>
        </dependency>
        <!-- SpringBoot整合Web组件 -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-actuator</artifactId>
        </dependency>
        <!--日常通用jar包配置-->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-devtools</artifactId>
            <scope>runtime</scope>
            <optional>true</optional>
        </dependency>
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <optional>true</optional>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
    </dependencies>

</project>
```



#### YAML

```yaml
#consul服务端口号
server:
  port: 8006

spring:
  application:
    name: cloud-provider-payment
  #consul注册中心地址
  cloud:
    consul:
      host: localhost
      port: 8500
      discovery:
        #hostname: 127.0.0.1
        service-name: ${spring.application.name}
```



#### 主启动

```java
package org.hong.springcloud;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication
@EnableDiscoveryClient //该注解用于向使用consul或者zookeeper作为注册中心时注册服务
public class PaymentMain8006 {
    public static void main(String[] args) {
        SpringApplication.run(PaymentMain8006.class, args);
    }
}
```



#### Controller

我们主要还是想把微服务注册到 Consul 中，所以就写个简单的 Controller

```java
package org.hong.springcloud.controller;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/payment")
@Slf4j
public class PaymentController {
    @Value("${server.port}")
    private String serverPort;

    @GetMapping("/consul")
    public String paymentConsul(){
        return "springcloud with consul " + serverPort + "\t" + UUID.randomUUID().toString();
    }
}
```



#### 测试

运行 Consul 进入开发者模式，再启动8006，并访问 http://localhost:8500/ui/dc1/services

可以看到 `consul-provider-payment` 注册到的 Consul 中

![image-20210602162814966](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081054999.png)



### 服务消费者

#### 新建 Module 消费服务 order81

`cloud-consumerconsul-order81`



#### POM

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <parent>
        <artifactId>springcloud</artifactId>
        <groupId>org.hong</groupId>
        <version>1.0-SNAPSHOT</version>
    </parent>
    <modelVersion>4.0.0</modelVersion>

    <artifactId>cloud-consumerconsul-order81</artifactId>

    <dependencies>
        <!--SpringCloud consul-server -->
        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-starter-consul-discovery</artifactId>
        </dependency>
        <!-- SpringBoot整合Web组件 -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-actuator</artifactId>
        </dependency>
        <!--日常通用jar包配置-->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-devtools</artifactId>
            <scope>runtime</scope>
            <optional>true</optional>
        </dependency>
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <optional>true</optional>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
    </dependencies>


</project>
```



#### YAML

```yaml
###consul服务端口号
server:
  port: 81

spring:
  application:
    name: cloud-consumer-order
  ####consul注册中心地址
  cloud:
    consul:
      host: localhost
      port: 8500
      discovery:
        #hostname: 127.0.0.1
        service-name: ${spring.application.name}
```



#### 主启动

```java
package org.hong.springcloud;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication
@EnableDiscoveryClient //该注解用于向使用consul或者zookeeper作为注册中心时注册服务
public class OrderMain81 {
    public static void main(String[] args) {
        SpringApplication.run(OrderMain81.class, args);
    }
}
```



#### 配置 Bean

```java
package org.hong.springcloud.config;

import org.springframework.cloud.client.loadbalancer.LoadBalanced;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

@Configuration
public class ApplicationContextBean {
    @Bean
    @LoadBalanced
    public RestTemplate getRestTemplate(){
        return new RestTemplate();
    }
}
```



#### Controller

```java
package org.hong.springcloud.controller;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

@RestController
@RequestMapping("/consumer")
@Slf4j
public class OrderConsulController {
    public static final String INVOKE_URL = "http://cloud-provider-payment";

    @Autowired
    private RestTemplate restTemplate;

    @GetMapping(value = "/payment/consul")
    public String paymentInfo() {
        String result = restTemplate.getForObject(INVOKE_URL + "/payment/consul", String.class);
        System.out.println("消费者调用支付服务(consule)--->result:" + result);
        return result;
    }
}
```



#### 测试

查看是否注册到的 Consul 中

![image-20210602162946787](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081055784.png)

访问 http://localhost:81/consumer/payment/consul 进行测试





<hr/>

## Ribbon 负载均衡服务调用

恢复7001和8001的 Eureka 自我保护机制，环境使用7001、7002、8001、8002、81

### 概述

Spring Cloud Ribbon是基于Netflix Ribbon实现的一套<span style='color: red;'>客户端负载均衡的工具</span>。

简单的说，Ribbon是Netflix发布的开源项目，主要功能是提供<span style='color: red;'>客户端的软件负载均衡算法和服务调用</span>。Ribbon客户端组件提供一系列完善的配置项如连接超时，重试等。简单的说，就是在配置文件中列出Load Balancer（简称LB）后面所有的机器，Ribbon会自动的帮助你基于某种规则（如简单轮询，随机连接等）去连接这些机器。我们很容易使用Ribbon实现自定义的负载均衡算法。



### Ribbon 负载均衡演示

#### 架构说明

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081055899.png)

`Ribbon` 在工作时分成两步
第一步先选择 `Eureka Server `，它优先选择在同一个区域内负载较少的server.
第二步再根据用户指定的策略，在从server取到的服务注册列表中选择一个地址。
其中Ribbon提供了多种策略：比如轮询、随机和根据响应时间加权。



#### POM

之前写样例时候没有引入 `spring-cloud-starter-ribbon` 也可以使用ribbon,

```xml
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-netflix-ribbon</artifactId>
</dependency>
```

猜测 `spring-cloud-starter-netflix-eureka-client` 自带了` spring-cloud-starter-ribbon` 引用，
证明如下： 可以看到 `spring-cloud-starter-netflix-eureka-client` 确实引入了 Ribbon

![image-20220122120848381](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081055687.png)



#### 二说 RestTemplate 的使用

##### 官网

https://docs.spring.io/spring-framework/docs/5.2.2.RELEASE/javadoc-api/org/springframework/web/client/RestTemplate.html

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081056907.png)



##### getForObject方法/getForEntity方法

在81中Controller中新增方法

```java
@GetMapping("/payment2/{id}")
public CommonResult<Payment> getPayment2(@PathVariable("id") Long id){
    // 返回对象为ResponseEntity对象，包含了响应中的一些重要信息，比如响应头、响应状态码、响应体等
    ResponseEntity<CommonResult> entity = restTemplate.getForEntity(PAYMENT_URL + "/payment/" + id, CommonResult.class);
    log.info(entity.getStatusCode() + "\t" + entity.getHeaders());
    // 判断状态码
    if(entity.getStatusCode().is2xxSuccessful()){
        return entity.getBody();
    }else{
        return new CommonResult<>(444, "操作失败");
    }
}
```

getForObject：返回对象为响应体中数据转化成的对象，基本上可以理解为Json

getForEntity：返回对象为ResponseEntity对象，包含了响应中的一些重要信息，比如响应头、响应状态码、响应体等





### Ribbon 核心组件 IRule

#### IRule

IRule：根据特定算法中从服务列表中选取一个要访问的服务

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081056373.png)

-   `com.netflix.loadbalancer.RoundRobinRule`：轮询，默认使用
-   `com.netflix.loadbalancer.RandomRule`：随机
-   `com.netflix.loadbalancer.RetryRule`：先按照RoundRobinRule的策略获取服务，如果获取服务失败则在指定时间内会进行重试，获取可用的服务
-   `WeightedResponseTimeRule`：对RoundRobinRule的扩展，响应速度越快的实例选择权重越大，越容易被选择
-   `BestAvailableRule`：会先过滤掉由于多次访问故障而处于断路器跳闸状态的服务，然后选择一个并发量最小的服务
-   `AvailabilityFilteringRule`：先过滤掉故障实例，再选择并发较小的实例
-   `ZoneAvoidanceRule`：这个类的默认规则,复合判断server所在区域的性能和server的可用性选择服务器



#### 如何替换

##### 配置细节

官方文档明确给出了警告：
<span style='color: red;'>这个自定义配置类不能放在 `@ComponentScan` 所扫描的当前包下以及子包下，</span>
否则我们自定义的这个配置类就会被所有的Ribbon客户端所共享，达不到特殊化定制的目的了。

简单的说就是不要放在主启动类的包下



##### 新建 package

![image-20220122120936245](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081056310.png)

##### 新建 MySelfRule 规则类

```java
package org.hong.myrule;

import com.netflix.loadbalancer.IRule;
import com.netflix.loadbalancer.RandomRule;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class MySelfRule {
    @Bean
    public IRule myRule(){
        // 定义为随机
        return new RandomRule();
    }
}
```



##### 主启动类添加 @RibbonClient

```java
package org.hong.springcloud;

import org.hong.myrule.MySelfRule;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.eureka.EnableEurekaClient;
import org.springframework.cloud.netflix.ribbon.RibbonClient;

@SpringBootApplication
@EnableEurekaClient
// 在对指定的服务做负载均衡的时候采用指定的策略
// 注意: name的值请使用大写
@RibbonClient(name = "CLOUD-PAYMENT-SERVICE",configuration= MySelfRule.class)
public class OrderMain81 {
    public static void main(String[] args) {
        SpringApplication.run(OrderMain81.class, args);
    }
}
```



##### 测试

多次访问 http://localhost:81/consumer/payment/1 自行测试





### Ribbon 负载均衡算法

#### 原理

<span style='color: red;'>负载均衡算法：`rest接口第几次请求数 % 服务器集群总数量 = 实际调用服务器位置下标 ` ，每次服务重启动后rest接口计数从1开始。</span>

List\<ServiceInstance> instances = discoveryClient.getInstances("CLOUD-PAYMENT-SERVICE");

如：   List [0] instances = 127.0.0.1:8002
　　　List [1] instances = 127.0.0.1:8001

8001+ 8002 组合成为集群，它们共计2台机器，集群总数为2， 按照轮询算法原理：

当总请求数为1时： 1 % 2 =1 对应下标位置为1 ，则获得服务地址为127.0.0.1:8001
当总请求数位2时： 2 % 2 =0 对应下标位置为0 ，则获得服务地址为127.0.0.1:8002
当总请求数位3时： 3 % 2 =1 对应下标位置为1 ，则获得服务地址为127.0.0.1:8001
当总请求数位4时： 4 % 2 =0 对应下标位置为0 ，则获得服务地址为127.0.0.1:8002
如此类推......

 

 

<hr/>

##  OpenFeign 服务接口调用

###  概述

 Feign是一个声明式的 Web 服务客户端，让编写 Web 服务客户端变得非常容易

它的使用方法是<span style='color: red;'>定义一个服务接口然后在上面添加注解</span>。Feign也支持可拔插式的编码器和解码器。Spring Cloud对Feign进行了封装，使其支持了Spring MVC标准注解和HttpMessageConverters。Feign可以与Eureka和Ribbon组合使用以支持负载均衡



### OpenFeign 使用步骤

#### 新建 cloud-consumer-feign-order81



#### POM

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <parent>
        <artifactId>springcloud</artifactId>
        <groupId>org.hong</groupId>
        <version>1.0-SNAPSHOT</version>
    </parent>
    <modelVersion>4.0.0</modelVersion>

    <artifactId>cloud-consumer-feign-order81</artifactId>

    <dependencies>
        <!--openfeign-->
        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-starter-openfeign</artifactId>
        </dependency>
        <!--eureka client-->
        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-starter-netflix-eureka-client</artifactId>
        </dependency>
        <!-- 引入自己定义的api通用包，可以使用Payment支付Entity -->
        <dependency>
            <groupId>org.hong</groupId>
            <artifactId>cloud-api-commons</artifactId>
            <version>${project.version}</version>
        </dependency>
        <!--web-->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-actuator</artifactId>
        </dependency>
        <!--一般基础通用配置-->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-devtools</artifactId>
            <scope>runtime</scope>
            <optional>true</optional>
        </dependency>
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <optional>true</optional>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
    </dependencies>

</project>
```



#### YAML

```yaml
server:
  port: 81

eureka:
  client:
    # 消费端调用微服务, 只调用可以不用注册到Eureka, 服务名自然也不可以不写
    register-with-eureka: false
    service-url:
      defaultZone: http://eureka7001.com:7001/eureka/,http://eureka7002.com:7002/eureka/
```



#### 主启动

```java
package org.hong.springcloud;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
// @EnableFeignClients启用OpenFeign
@EnableFeignClients
public class OrderFeignMain81 {
    public static void main(String[] args) {
        SpringApplication.run(OrderFeignMain81.class, args);
    }
}
```



#### 业务类

##### 业务逻辑接口 + `@FeignClient` 配置调用 provider 服务

```java
package org.hong.springcloud.service;

import org.hong.springcloud.entity.CommonResult;
import org.hong.springcloud.entity.Payment;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

// @FeignClient注解会帮我们创建代理对象, 并注入到IOC容器中, Bean的名字为value值, 
// 这个Bean的名字就为CLOUD-PAYMENT-SERVICE
// 如果想自定义名称, 可以添加@Component注解指定名称
@FeignClient("CLOUD-PAYMENT-SERVICE")
public interface PaymentFeignService {
    @GetMapping("/payment/{id}") // 注意: REST风格的@PathVariable注解中一定要指定value值, 哪怕只有一个参数, 栽过坑
    CommonResult<Payment> getPaymentById(@PathVariable("id") Long id);
}
```



##### Controller

```java
package org.hong.springcloud.controller;

import lombok.extern.slf4j.Slf4j;
import org.hong.springcloud.entity.CommonResult;
import org.hong.springcloud.entity.Payment;
import org.hong.springcloud.service.PaymentFeignService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/consumer")
@Slf4j
public class OrderFeignController {
    @Autowired
    private PaymentFeignService paymentFeignService;

    @GetMapping("/payment/{id}")
    public CommonResult<Payment> getPaymentById(@PathVariable Long id){
        return paymentFeignService.getPaymentById(id);
    }
}
```



#### 测试

-   先启动2个eureka集群7001/7002
-   再启动2个微服务8001/8002
-   启动81OpenFeign
-   http://localhost:81/consumer/payment/1
-   Feign自带负载均衡配置项

![image-20220122121012940](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081056123.png)

#### 总结

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081056333.png)

`@FeignClient` 的 `value` 属性对应微服务名

`PaymentFeignService` 接口中的抽象方法对应 `@FeignClient` 指定服务暴露的 `Controller` 的方法签名；抽象方法上还需要标注对应的 `GetMapping、PostMapping、PutMapping、DeleteMapping` 等请求方式的注解和完整的请求路径，也可以在接口上使用 `RequestMapping` 注解

虽然标注了 `GetMapping` 等注解，但是这个路径是无法被访问的，因为我们在接口上没有使用 `@Controller` 自然也就无法访问。

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081057474.png)





### OpenFeign 超时控制

#### 概述

<span style='color: red;'>默认 `Feign` 客户端只等待一秒钟</span>，但是服务端处理需要超过1秒钟，导致Feign客户端不想等待了，直接返回报错。为了避免这样的情况，有时候我们需要设置 `Feign` 客户端的超时控制。



#### 超时设置  故意设置超时演示出错情况

##### 服务提供方8001故意写暂停程序

```java
@Value("${server.port}")
private String serverPort;

@GetMapping("/feign/timeout")
public String paymentFeignTimeOut(){
    try {
        Thread.sleep(3000);
    } catch (InterruptedException e) {
        e.printStackTrace();
    }
    return this.serverPort;
}
```



##### 服务消费方81添加超时方法PaymentFeignService

```java
package org.hong.springcloud.service;

import org.hong.springcloud.entity.CommonResult;
import org.hong.springcloud.entity.Payment;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

@FeignClient("CLOUD-PAYMENT-SERVICE")
@RequestMapping("/payment") // 提取了细分路径
public interface PaymentFeignService {
    @GetMapping("/{id}")
    CommonResult<Payment> getPaymentById(@PathVariable("id") Long id);

    // 新增加
    @GetMapping("/feign/timeout")
    String paymentFeignTimeOut();
}
```



##### 服务消费方81添加超时方法OrderFeignController

```java
@GetMapping("/payment/feign/timeout")
public String paymentFeignTimeOut(){
    return paymentFeignService.paymentFeignTimeOut();
}
```



##### 测试

-   启动7001、7002 Eureka 注册中心

-   启动8001服务提供者

-   启动81服务消费者

-   访问 http://localhost:81/consumer/payment/feign/timeout

    ![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081057275.png)



#### YML 文件里需要开启 OpenFeign 客户端超时控制

二选一，推荐下面哪个

```yaml
#设置feign客户端超时时间(OpenFeign默认支持ribbon)
ribbon:
  #指的是建立连接后从服务器读取到可用资源所用的时间
  ReadTimeout: 5000
  #指的是建立连接所用的时间,适用于网络状况正常的情况下,两端连接所用的时间
  ConnectTimeout: 5000
```

```yaml
feign:
  client:
    config:
      #default代表所有服务
      default:
        #建立连接所用的时间，适用于网络状况正常的情况下，两端连接所需要的时间
        ConnectTimeOut: 5000
        #指建立连接后从服务端读取到可用资源所用的时间
        ReadTimeOut: 5000
```





### OpenFeign 日志打印功能

#### 概述

Feign 提供了日志打印功能，我们可以通过配置来调整日志级别，从而了解 Feign 中 Http 请求的细节。说白了就是<span style='color: red;'>对Feign接口的调用情况进行监控和输出</span>



#### 日志级别

-   NONE：默认的，不显示任何日志；
-   BASIC：仅记录请求方法、URL、响应状态码及执行时间；
-   HEADERS：除了 BASIC 中定义的信息之外，还有请求和响应的头信息；
-   FULL：除了 HEADERS 中定义的信息之外，还有请求和响应的正文及元数据。



#### 启用日志

##### 配置日志 Bean

```java
package org.hong.springcloud.config;

import feign.Logger;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class FeignConfig {
    @Bean
    public Logger.Level feignLoggerLevel() {
        return Logger.Level.FULL;
    }
}
```



##### YAML 文件里开启日志的 Feign 客户端

```yaml
logging:
  level:
    # feign日志以什么级别监控哪个接口
    # 这里的级别就不是上面写的FULL..那些级别了, 而是正儿八经的日志级别debug、info...
    # 注意: 如果接口的全限定名写错了是不会报错的, 而是没有日志输出, 如果日志没得输出可能是这里错了
    org.hong.springcloud.service.PaymentFeignService: debug
```



##### 效果

![image-20210603210350708](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081058868.png)





<hr/>

## Hystrix 断路器

Hystrix 已经停止更新了，进入了维护状态

### 分布式系统面临的问题

<span style='color: red;'>复杂分布式体系结构中的应用程序有数十个依赖关系，每个依赖关系在某些时候将不可避免地失败。</span>

![image-20220122121146673](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081058218.png)

**服务雪崩**
多个微服务之间调用的时候，假设微服务A调用微服务B和微服务C，微服务B和微服务C又调用其它的微服务，这就是所谓的“扇出”。如果扇出的链路上某个微服务的调用响应时间过长或者不可用，对微服务A的调用就会占用越来越多的系统资源，进而引起系统崩溃，所谓的“雪崩效应”.

对于高流量的应用来说，单一的后端依赖可能会导致所有服务器上的所有资源都在几秒钟内饱和。比失败更糟糕的是，这些应用程序还可能导致服务之间的延迟增加，备份队列，线程和其他系统资源紧张，导致整个系统发生更多的级联故障。这些都表示需要对故障和延迟进行隔离和管理，以便单个依赖关系的失败，不能取消整个应用程序或系统。
所以，通常当你发现一个模块下的某个实例失败后，这时候这个模块依然还会接收流量，然后这个有问题的模块还调用了其他的模块，这样就会发生级联故障，或者叫雪崩。

 

###  Hystrix 概述

Hystrix是一个用于处理分布式系统的延迟和容错的开源库，在分布式系统里，许多依赖不可避免的会调用失败，比如超时、异常等，Hystrix能够保证在一个依赖出问题的情况下，<span style='color: red;'>不会导致整体服务失败，避免级联故障，以提高分布式系统的弹性</span>。

“断路器”本身是一种开关装置，当某个服务单元发生故障之后，通过断路器的故障监控（类似熔断保险丝），<span style='color: red;'>向调用方返回一个符合预期的、可处理的备选响应（FallBack），而不是长时间的等待或者抛出调用方无法处理的异常</span>，这样就保证了服务调用方的线程不会被长时间、不必要地占用，从而避免了故障在分布式系统中的蔓延，乃至雪崩。

 **功能**

-   服务降级
-   服务熔断
-   接近实时的监控
-   ...

 

### Hystrix 重要概念

-   服务降级
    -   服务器忙，请稍后再试，不让客户端等待并立刻返回一个友好提示，fallback
    -   哪些情况会出发降级
        1.  程序运行异常
        2.  超时
        3.  服务熔断触发服务降级
        4.  线程池 / 信号量打满也会导致服务降级
-   服务熔断
    -   类比保险丝达到最大服务访问后，直接拒绝访问，拉闸限电，然后调用服务降级的方法并返回友好提示
    -   服务的降级 > 进而熔断 > 恢复调用链路
-   服务限流
    -   秒杀高并发等操作，严禁一窝蜂的过来拥挤，大家排队，一秒钟N个，有序进行





### Hystrix 案例

#### 新建 `cloud-provider-hystrix-payment8001`



##### POM

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <parent>
        <artifactId>springcloud</artifactId>
        <groupId>org.hong</groupId>
        <version>1.0-SNAPSHOT</version>
    </parent>
    <modelVersion>4.0.0</modelVersion>

    <artifactId>cloud-provider-hystrix-payment8001</artifactId>

    <dependencies>
        <!--hystrix-->
        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-starter-netflix-hystrix</artifactId>
        </dependency>
        <!--eureka client-->
        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-starter-netflix-eureka-client</artifactId>
        </dependency>
        <!--web-->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-actuator</artifactId>
        </dependency>
        <dependency><!-- 引入自己定义的api通用包，可以使用Payment支付Entity -->
            <groupId>org.hong</groupId>
            <artifactId>cloud-api-commons</artifactId>
            <version>${project.version}</version>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-devtools</artifactId>
            <scope>runtime</scope>
            <optional>true</optional>
        </dependency>
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <optional>true</optional>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
    </dependencies>

</project>
```



##### YAML

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
      defaultZone: http://eureka7001.com:7001/eureka,http://eureka7002.com:7002/eureka # 集群版
      #defaultZone: http://eureka7001.com:7001/eureka # 单机版
```



##### 主启动

```java
package org.hong.springcloud;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.eureka.EnableEurekaClient;

@SpringBootApplication
@EnableEurekaClient //本服务启动后会自动注册进eureka服务中
public class PaymentHystrixMain8001 {
    public static void main(String[] args) {
        SpringApplication.run(PaymentHystrixMain8001.class, args);
    }
}
```



##### 业务类

###### service

这里省略 `service` 接口，直接写类

```java
package org.hong.springcloud.service;

import org.springframework.stereotype.Service;

import java.util.concurrent.TimeUnit;

@Service
public class PaymentService {
    /**
     * 正常访问，一切OK
     *
     * @param id
     * @return
     */
    public String paymentInfo_OK(Integer id) {
        return "线程池:" + Thread.currentThread().getName() + "paymentInfo_OK,id: " + id + "\t" + "O(∩_∩)O";
    }

    /**
     * 超时访问，演示降级
     *
     * @param id
     * @return
     */
    public String paymentInfo_TimeOut(Integer id) {
        try {
            TimeUnit.SECONDS.sleep(3);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        return "线程池:" + Thread.currentThread().getName() + "paymentInfo_TimeOut,id: " + id + "\t" + "(●'◡'●)，耗费3秒";
    }

}
```



###### controller

```java
package org.hong.springcloud.controller;

import lombok.extern.slf4j.Slf4j;
import org.hong.springcloud.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/payment/hystrix")
@Slf4j
public class PaymentController {
    @Autowired
    private PaymentService paymentService;

    @Value("${server.port}")
    private String serverPort;


    @GetMapping("/ok/{id}")
    public String paymentInfo_OK(@PathVariable("id") Integer id) {
        String result = paymentService.paymentInfo_OK(id);
        log.info("****result: "+result);
        return result;
    }

    @GetMapping("/timeout/{id}")
    public String paymentInfo_TimeOut(@PathVariable("id") Integer id) {
        String result = paymentService.paymentInfo_TimeOut(id);
        log.info("****result: "+result);
        return result;
    }

}
```



##### 测试

-   启动7001/7002注册中心
-   启动 cloud-provider-hystrix-payment8001
-   访问 controller
    -   http://localhost:8001/payment/hystrix/ok/1
    -   http://localhost:8001/payment/hystrix/timeout/1
    -   访问不出错即可
-   上述为根基平台，从正确 > 错误 > 降级熔断 > 恢复





#### 新建 `cloud-consumer-feign-hystrix-order81`

##### POM

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <parent>
        <artifactId>springcloud</artifactId>
        <groupId>org.hong</groupId>
        <version>1.0-SNAPSHOT</version>
    </parent>
    <modelVersion>4.0.0</modelVersion>

    <artifactId>cloud-consumer-feign-hystrix-order81</artifactId>

    <dependencies>
        <!--openfeign-->
        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-starter-openfeign</artifactId>
        </dependency>
        <!--hystrix-->
        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-starter-netflix-hystrix</artifactId>
        </dependency>
        <!--eureka client-->
        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-starter-netflix-eureka-client</artifactId>
        </dependency>
        <!-- 引入自己定义的api通用包，可以使用Payment支付Entity -->
        <dependency>
            <groupId>org.hong</groupId>
            <artifactId>cloud-api-commons</artifactId>
            <version>${project.version}</version>
        </dependency>
        <!--web-->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-actuator</artifactId>
        </dependency>
        <!--一般基础通用配置-->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-devtools</artifactId>
            <scope>runtime</scope>
            <optional>true</optional>
        </dependency>
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <optional>true</optional>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
    </dependencies>

</project>
```



##### YAML

```yaml
server:
  port: 81

eureka:
  client:
    register-with-eureka: false
    service-url:
      defaultZone: http://eureka7001.com:7001/eureka/,http://eureka7002.com:7002/eureka/
      
#设置feign客户端超时时间(OpenFeign默认支持ribbon)
ribbon:
  #指的是建立连接后从服务器读取到可用资源所用的时间
  ReadTimeout: 5000
  #指的是建立连接所用的时间,适用于网络状况正常的情况下,两端连接所用的时间
  ConnectTimeout: 5000
```



##### 主启动

```java
package org.hong.springcloud;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableFeignClients
public class OrderHystrixMain81 {
    public static void main(String[] args) {
        SpringApplication.run(OrderHystrixMain81.class, args);
    }
}
```



##### 业务类

###### service

```java
package org.hong.springcloud.service;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

@FeignClient("CLOUD-PROVIDER-HYSTRIX-PAYMENT")
@RequestMapping("/payment/hystrix")
public interface PaymentHystrixService {
    @GetMapping("/ok/{id}")
    String paymentInfo_OK(@PathVariable("id") Integer id);

    @GetMapping("/timeout/{id}")
    String paymentInfo_TimeOut(@PathVariable("id") Integer id) throws InterruptedException;
}
```



###### controller

```java
package org.hong.springcloud.controller;

import lombok.extern.slf4j.Slf4j;
import org.hong.springcloud.service.PaymentHystrixService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/consumer")
@Slf4j
public class OrderHystirxController {
    @Autowired
    private PaymentHystrixService paymentHystrixService;

    @GetMapping("/payment/hystrix/ok/{id}")
    public String paymentInfo_OK(@PathVariable("id") Integer id) {
        String result = paymentHystrixService.paymentInfo_OK(id);
        return result;
    }

    @GetMapping("/payment/hystrix/timeout/{id}")
    public String paymentInfo_TimeOut(@PathVariable("id") Integer id) {
        String result = paymentHystrixService.paymentInfo_TimeOut(id);
        return result;
    }
}
```



##### 正常测试

启动 `cloud-consumer-feign-hystrix-order81`

访问 http://localhost:81/consumer/payment/hystrix/ok/1、http://localhost:81/consumer/payment/hystrix/timeout/1



#### Jmeter高并发测试

![image-20220122121801667](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081058857.png)

![image-20220122121829427](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081058767.png)

![image-20220122121900188](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081058550.png)

![image-20220122121936020](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081058034.png)
使用 `Jmeter` 进行压力测试，然后访问 http://localhost:81/consumer/payment/hystrix/ok/1，出现明显的卡顿

![image-20220122121306613](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081103514.png)

8001同一层次的其它接口服务被困死，因为 `tomcat` 线程池里面的工作线程已经被挤占完毕；80此时调用8001，客户端访问响应缓慢，转圈圈。



#### 如何解决

-   对方服务(8001)超时了，调用者(80)不能一直卡死等待，必须有服务降级
-   对方服务(8001)宕机了，调用者(80)不能一直卡死等待，必须有服务降级
-   对方服务(8001)OK，调用者(80)自己出故障或有自我要求（自己的等待时间小于服务提供者），自己处理降级



#### 服务降级

##### 8001fallback

设置自身调用超时时间的峰值，峰值内可以正常运行，超过了需要有兜底的方法处理，作服务降级fallback

###### 业务类启用

```java
package org.hong.springcloud.service;

import com.netflix.hystrix.contrib.javanica.annotation.HystrixCommand;
import com.netflix.hystrix.contrib.javanica.annotation.HystrixProperty;
import org.springframework.stereotype.Service;

import java.util.concurrent.TimeUnit;

@Service
public class PaymentService {
    /**
     * 正常访问，一切OK
     *
     * @param id
     * @return
     */
    @HystrixCommand(fallbackMethod = "paymentInfo_OKHandler")
    public String paymentInfo_OK(Integer id) {
        int a = 10/ 0;
        return "线程池:" + Thread.currentThread().getName() + " paymentInfo_OK,id: " + id + "\t" + "O(∩_∩)O";
    }

    public String paymentInfo_OKHandler(Integer id){
        return "线程池:" + Thread.currentThread().getName() + "系统繁忙, 请稍后再试" + "\t" + "/(ㄒoㄒ)/~~";
    }

    /**
     * 超时访问，演示降级
     *
     * @param id
     * @return
     */
    // fallbackMethod对应兜底方法的方法名
    @HystrixCommand(fallbackMethod = "paymentInfo_TimeOutHandler", commandProperties = {
            // 设置超时时间
            @HystrixProperty(name="execution.isolation.thread.timeoutInMilliseconds", value="2500")
    })
    public String paymentInfo_TimeOut(Integer id) {
        try {
            TimeUnit.SECONDS.sleep(3);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        return "线程池:" + Thread.currentThread().getName() + " paymentInfo_TimeOut,id: " + id + "\t" + "(●'◡'●)，耗费3秒";
    }

    // fallbackMethod的方法签名除了方法名不一样, 其余部分必须与原方法一致
    public String paymentInfo_TimeOutHandler(Integer id) {
        return "线程池:" + Thread.currentThread().getName() + "系统繁忙, 请稍后再试" + "\t" + "/(ㄒoㄒ)/~~";
    }

}
```



###### 主启动激活

**@EnableCircuitBreaker**

```java
package org.hong.springcloud;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.circuitbreaker.EnableCircuitBreaker;
import org.springframework.cloud.netflix.eureka.EnableEurekaClient;

@SpringBootApplication
@EnableEurekaClient //本服务启动后会自动注册进eureka服务中
@EnableHystrix
public class PaymentHystrixMain8001 {
    public static void main(String[] args) {
        SpringApplication.run(PaymentHystrixMain8001.class, args);
    }
}
```



###### 效果

![image-20220122121415243](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081109755.png)

##### 80fallback

###### 主启动

```java
package org.hong.springcloud;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.hystrix.EnableHystrix;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableFeignClients
@EnableHystrix // 开启Hystrix
public class OrderHystrixMain81 {
    public static void main(String[] args) {
        SpringApplication.run(OrderHystrixMain81.class, args);
    }
}
```



###### Controller

```java
// 配置服务降级
@GetMapping("/payment/hystrix/timeout/{id}")
@HystrixCommand(fallbackMethod = "paymentTimeOutFallbackMethod",commandProperties = {
        @HystrixProperty(name="execution.isolation.thread.timeoutInMilliseconds",value="1500")
})
public String paymentInfo_TimeOut(@PathVariable("id") Integer id) {
    String result = paymentHystrixService.paymentInfo_TimeOut(id);
    return result;
}
public String paymentTimeOutFallbackMethod(@PathVariable("id") Integer id) {
    return "我是消费者80,对方支付系统繁忙请10秒钟后再试或者自己运行出错请检查自己,o(╥﹏╥)o";
}
```



###### 测试

 修改8001服务提供这超时时间为5秒

```java
@HystrixCommand(fallbackMethod = "paymentInfo_TimeOutHandler", commandProperties = {
        // 设置超时时间
        @HystrixProperty(name="execution.isolation.thread.timeoutInMilliseconds", value="5000") // 修改8001服务提供这超时时间为5秒
})
public String paymentInfo_TimeOut(Integer id) {
    try {
        TimeUnit.SECONDS.sleep(3);
    } catch (InterruptedException e) {
        e.printStackTrace();
    }
    return "线程池:" + Thread.currentThread().getName() + " paymentInfo_TimeOut,id: " + id + "\t" + "(●'◡'●)，耗费3秒";
}

// fallbackMethod的方法签名除了方法名不一样, 其余部分必须与原方法一致
public String paymentInfo_TimeOutHandler(Integer id) {
    return "线程池:" + Thread.currentThread().getName() + "系统繁忙, 请稍后再试" + "\t" + "/(ㄒoㄒ)/~~";
}
```

访问 http://localhost:81/consumer/payment/hystrix/timeout/1

![image-20220122121447632](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081109777.png)

1.5秒后返回提示信息



##### 统一服务降级

每个方法都配置一个对应的备用方法是不合适，会造成代码膨胀

```java
package org.hong.springcloud.controller;

import com.netflix.hystrix.contrib.javanica.annotation.DefaultProperties;
import com.netflix.hystrix.contrib.javanica.annotation.HystrixCommand;
import com.netflix.hystrix.contrib.javanica.annotation.HystrixProperty;
import lombok.extern.slf4j.Slf4j;
import org.hong.springcloud.service.PaymentHystrixService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/consumer")
@Slf4j
// 全局服务降级配置
@DefaultProperties(defaultFallback = "paymentGlobalFallbackMethod")
public class OrderHystirxController {
    @Autowired
    private PaymentHystrixService paymentHystrixService;

    @GetMapping("/payment/hystrix/ok/{id}")
    // 配置了全局服务降级不代表所有的方法都会生效,
    // 想要全局配置生效还必须在方法上使用@HystrixCommand注解, 但是不指定具体的配置, 代表这个方法使用全局配置
    @HystrixCommand
    public String paymentInfo_OK(@PathVariable("id") Integer id) {
        int a = 10 / 0;
        String result = paymentHystrixService.paymentInfo_OK(id);
        return result;
    }

    @GetMapping("/payment/hystrix/timeout/{id}")
    // 如果方法上面指定了备用方法, 则使用, 如果没有则使用类上面的全局配置, 就近原则
    @HystrixCommand(fallbackMethod = "paymentTimeOutFallbackMethod",commandProperties = {
            @HystrixProperty(name="execution.isolation.thread.timeoutInMilliseconds",value="1500")
    })
    public String paymentInfo_TimeOut(@PathVariable("id") Integer id) {
        String result = paymentHystrixService.paymentInfo_TimeOut(id);
        return result;
    }
    public String paymentTimeOutFallbackMethod(@PathVariable("id") Integer id) {
        return "我是消费者80,对方支付系统繁忙请10秒钟后再试或者自己运行出错请检查自己,o(╥﹏╥)o";
    }

    // 统一服务降级: 不能有形参
    public String paymentGlobalFallbackMethod(){
        return "Global异常处理, 请稍后重试!";
    }
}
```



##### 解耦合

服务降级和 `Controller` 在一起，非常的混乱，服务降级应该与 `Service` 在一起，但是我们现在使用的是 `OpenFeign` 做的服务调用，`Service` 写的是接口，接口中只能写抽象方法，无法定义服务降级的方法，因此需要为 `Service` 接口创建一个实现类，统一为接口里面的方法进行异常处理，如果 `Service` 接口对应的代理对象无法完成服务，就由我们创建的实现类来完成。

###### YAML

```yaml
# 开启feign对hystrix的支持, 可以直接在@FeignClient注解中的fallback属性指定回调的类
feign:
  hystrix:
    enabled: true
```



###### 创建 `Service` 实现类

```java
package org.hong.springcloud.service.serviceimpl;

import org.hong.springcloud.service.PaymentHystrixService;
import org.springframework.stereotype.Service;

@Service
public class PaymentHystrixServiceImpl implements PaymentHystrixService {
    @Override
    public String paymentInfo_OK(Integer id) {
        return "服务调用失败, 来源: PaymentHystrixServiceImpl paymentInfo_OK";
    }

    @Override
    public String paymentInfo_TimeOut(Integer id) {
        return "服务调用失败, 来源: PaymentHystrixServiceImpl paymentInfo_TimeOut";
    }
}
```



###### `Service` 接口

```java
package org.hong.springcloud.service;

import org.hong.springcloud.service.serviceimpl.PaymentHystrixServiceImpl;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@Component
@FeignClient(value = "CLOUD-PROVIDER-HYSTRIX-PAYMENT", fallback = PaymentHystrixServiceImpl.class)
//@RequestMapping("/payment/hystrix") 注意: 这里就不能在类上使用@RequestMapping等注解了, 不然会报URL重复注册的错误
public interface PaymentHystrixService {
    @GetMapping("/payment/hystrix/ok/{id}")
    String paymentInfo_OK(@PathVariable("id") Integer id);

    @GetMapping("/payment/hystrix/timeout/{id}")
    String paymentInfo_TimeOut(@PathVariable("id") Integer id);
}
```



###### Controller

将之前手动制造的异常删除，并移除 `@HystrixCommand` 注解，不再使用 `Controller` 内部的服务降级

```java
@GetMapping("/payment/hystrix/ok/{id}")
public String paymentInfo_OK(@PathVariable("id") Integer id) {
    String result = paymentHystrixService.paymentInfo_OK(id);
    return result;
}
```



###### 测试

启动注册中心，启动8001，启动81服务，访问 http://localhost:81/consumer/payment/hystrix/timeout/1

![image-20220122121525757](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081109535.png)

**<span style='color: red;'>`yaml` 中配置的Ribbon超时时间对 `fallback` 不会生效，依旧是默认的1秒。feign配置的超时时间依旧生效</span>**

```yaml
#设置feign客户端超时时间(OpenFeign默认支持ribbon)
ribbon:
  #指的是建立连接后从服务器读取到可用资源所用的时间
  ReadTimeout: 5000
  #指的是建立连接所用的时间,适用于网络状况正常的情况下,两端连接所用的时间
  ConnectTimeout: 5000
```

可以修改断路器的超时时间

```yaml
hystrix:
  command: # 全局配置
    default:
      execution:
        isolation:
          thread:
            timeoutInMilliseconds: 4000 # 断路器超时时间，默认1000ms
```

关闭8001服务，访问 http://localhost:81/consumer/payment/hystrix/ok/1

![image-20220122121550969](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081109755.png)

实现 `Service` 的方式只会在 `Feign` 调用出现问题的时候触发，如果 `Feign` 调用没有出现问题，而是在 `Controller` 出现问题则会触发 `@DefaultProperties` 或 `@HystrixCommand` 注解对应的服务降级。



#### 服务熔断

##### 什么是熔断

>   熔断机制概述

熔断机制是应对雪崩效应的一种微服务链路保护机制。当扇出链路的某个微服务出错不可用或者响应时间太长时，
会进行服务的降级，进而熔断该节点微服务的调用，快速返回错误的响应信息。
当检测到该节点微服务调用响应正常后，恢复调用链路。

在Spring Cloud框架里，熔断机制通过Hystrix实现。Hystrix会监控微服务间调用的状况，当失败的调用到一定阈值，缺省是5秒内20次调用失败，就会启动熔断机制。熔断机制的注解是@HystrixCommand。

熔断开启的时候，任何请求进入都会直接进入fallback，不会进入正常流程。


##### 实操

修改 `cloud-provider-hystrix-payment8001`

###### PaymentService

```java
//=========服务熔断
// 在窗口期内(10s)如果请求数量超过10, 开始计算是否打开熔断, 计算依据: 请求错误率高于60%,
// 距离最后一次错误请求10s后将会允许一个请求进入, 如果成功, 关闭熔断, 失败继续等待下一个10s
@HystrixCommand(fallbackMethod = "paymentCircuitBreaker_fallback",commandProperties = {
        // 是否开启熔断器
        @HystrixProperty(name = "circuitBreaker.enabled",value = "true"),
        // 在窗口期内(一个时间段内) 收到的请求数量超过该设置的数量后，将开始计算是否打开熔断器
        @HystrixProperty(name = "circuitBreaker.requestVolumeThreshold",value = "10"),
        // 窗口期时间
        @HystrixProperty(name = "circuitBreaker.sleepWindowInMilliseconds",value = "10000"),
        // 当请求的错误率高于该百分比时，开启熔断器。
        @HystrixProperty(name = "circuitBreaker.errorThresholdPercentage",value = "60"),
})
public String paymentCircuitBreaker(@PathVariable("id") Integer id) {
    if(id < 0)
    {
        throw new RuntimeException("******id 不能负数");
    }
    String serialNumber = IdUtil.simpleUUID();

    return Thread.currentThread().getName()+"\t"+"调用成功，流水号: " + serialNumber;
}
public String paymentCircuitBreaker_fallback(@PathVariable("id") Integer id) {
    return "id 不能负数，请稍后再试，/(ㄒoㄒ)/~~   id: " +id;
}
```



###### PaymentController

```java
@GetMapping("/circuit/{id}")
public String paymentCircuitBreaker(@PathVariable("id") Integer id) {
    String result = paymentService.paymentCircuitBreaker(id);
    log.info("****result: "+result);
    return result;
}
```



##### 测试

多次访问 http://localhost:8001/payment/hystrix/circuit/-1，达到熔断要求后，再次访问 http://localhost:8001/payment/hystrix/circuit/1 将无法访问！

![image-20220122121617761](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081116832.png)

在熔断期间访问 http://localhost:8001/payment/hystrix/ok/1，正常访问

![image-20220122121633882](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081116107.png)

熔断针对的是某个方法，一个方法触发熔断不会影响别的方法。



##### 总结

###### 熔断类型

-   熔断打开：请求不再进行调用当前服务，内部设置时钟一般为MTTR（平均故障处理时间)，当打开时长达到所设时钟则进入半熔断状态
-   熔断关闭：熔断关闭不会对服务进行熔断
-   熔断半开：部分请求根据规则调用当前服务，如果请求成功且符合规则则认为当前服务恢复正常，关闭熔断



###### 断路器开启或者关闭的条件

1.  当满足一定的阀值的时候（默认10秒内超过20个请求次数）
2.  当失败率达到一定的时候（默认10秒内超过50%的请求失败）
3.  到达以上阀值，断路器将会开启
4.  当开启的时候，所有请求都不会进行转发
5.  一段时间之后（默认是5秒），这个时候断路器是半开状态，会让其中一个请求进行转发。如果成功，断路器会关闭，若失败，继续开启。重复4和5



###### 断路器在什么情况下开始起作用

涉及到断路器的三个重要参数：快照时间窗、请求总数阀值、错误百分比阀值。
1：快照时间窗：断路器确定是否打开需要统计一些请求和错误数据，而统计的时间范围就是快照时间窗，默认为最近的10秒。

2：请求总数阀值：在快照时间窗内，必须满足请求总数阀值才有资格熔断。默认为20，意味着在10秒内，如果该hystrix命令的调用次数不足20次，即使所有的请求都超时或其他原因失败，断路器都不会打开。

3：错误百分比阀值：当请求总数在快照时间窗内超过了阀值，比如发生了30次调用，如果在这30次调用中，有15次发生了超时异常，也就是超过50%的错误百分比，在默认设定50%阀值情况下，这时候就会将断路器打开。



###### 断路器打开之后

1.  再有请求调用的时候，将不会调用主逻辑，而是直接调用降级fallback。通过断路器，实现了自动地发现错误并将降级逻辑切换为主逻辑，减少响应延迟的效果。
2.  原来的主逻辑要如何恢复呢？
    对于这一问题，hystrix也为我们实现了自动恢复功能。
    当断路器打开，对主逻辑进行熔断之后，hystrix会启动一个休眠时间窗，在这个时间窗内，降级逻辑是临时的成为主逻辑，
    当休眠时间窗到期，断路器将进入半开状态，释放一次请求到原来的主逻辑上，如果此次请求正常返回，那么断路器将继续闭合，
    主逻辑恢复，如果这次请求依然有问题，断路器继续进入打开状态，休眠时间窗重新计时。



###### ALL 配置

```java
//========================All
@HystrixCommand(fallbackMethod = "str_fallbackMethod",
        groupKey = "strGroupCommand",
        commandKey = "strCommand",
        threadPoolKey = "strThreadPool",

        commandProperties = {
                // 设置隔离策略，THREAD 表示线程池 SEMAPHORE：信号池隔离
                @HystrixProperty(name = "execution.isolation.strategy", value = "THREAD"),
                // 当隔离策略选择信号池隔离的时候，用来设置信号池的大小（最大并发数）
                @HystrixProperty(name = "execution.isolation.semaphore.maxConcurrentRequests", value = "10"),
                // 配置命令执行的超时时间
                @HystrixProperty(name = "execution.isolation.thread.timeoutinMilliseconds", value = "10"),
                // 是否启用超时时间
                @HystrixProperty(name = "execution.timeout.enabled", value = "true"),
                // 执行超时的时候是否中断
                @HystrixProperty(name = "execution.isolation.thread.interruptOnTimeout", value = "true"),
                // 执行被取消的时候是否中断
                @HystrixProperty(name = "execution.isolation.thread.interruptOnCancel", value = "true"),
                // 允许回调方法执行的最大并发数
                @HystrixProperty(name = "fallback.isolation.semaphore.maxConcurrentRequests", value = "10"),
                // 服务降级是否启用，是否执行回调函数
                @HystrixProperty(name = "fallback.enabled", value = "true"),
                // 是否启用断路器
                @HystrixProperty(name = "circuitBreaker.enabled", value = "true"),
                // 该属性用来设置在滚动时间窗中，断路器熔断的最小请求数。例如，默认该值为 20 的时候，
                // 如果滚动时间窗（默认10秒）内仅收到了19个请求， 即使这19个请求都失败了，断路器也不会打开。
                @HystrixProperty(name = "circuitBreaker.requestVolumeThreshold", value = "20"),
                // 该属性用来设置在滚动时间窗中，表示在滚动时间窗中，在请求数量超过
                // circuitBreaker.requestVolumeThreshold 的情况下，如果错误请求数的百分比超过50,
                // 就把断路器设置为 "打开" 状态，否则就设置为 "关闭" 状态。
                @HystrixProperty(name = "circuitBreaker.errorThresholdPercentage", value = "50"),
                // 该属性用来设置当断路器打开之后的休眠时间窗。 休眠时间窗结束之后，
                // 会将断路器置为 "半开" 状态，尝试熔断的请求命令，如果依然失败就将断路器继续设置为 "打开" 状态，
                // 如果成功就设置为 "关闭" 状态。
                @HystrixProperty(name = "circuitBreaker.sleepWindowinMilliseconds", value = "5000"),
                // 断路器强制打开
                @HystrixProperty(name = "circuitBreaker.forceOpen", value = "false"),
                // 断路器强制关闭
                @HystrixProperty(name = "circuitBreaker.forceClosed", value = "false"),
                // 滚动时间窗设置，该时间用于断路器判断健康度时需要收集信息的持续时间
                @HystrixProperty(name = "metrics.rollingStats.timeinMilliseconds", value = "10000"),
                // 该属性用来设置滚动时间窗统计指标信息时划分"桶"的数量，断路器在收集指标信息的时候会根据
                // 设置的时间窗长度拆分成多个 "桶" 来累计各度量值，每个"桶"记录了一段时间内的采集指标。
                // 比如 10 秒内拆分成 10 个"桶"收集这样，所以 timeinMilliseconds 必须能被 numBuckets 整除。否则会抛异常
                @HystrixProperty(name = "metrics.rollingStats.numBuckets", value = "10"),
                // 该属性用来设置对命令执行的延迟是否使用百分位数来跟踪和计算。如果设置为 false, 那么所有的概要统计都将返回 -1。
                @HystrixProperty(name = "metrics.rollingPercentile.enabled", value = "false"),
                // 该属性用来设置百分位统计的滚动窗口的持续时间，单位为毫秒。
                @HystrixProperty(name = "metrics.rollingPercentile.timeInMilliseconds", value = "60000"),
                // 该属性用来设置百分位统计滚动窗口中使用 “ 桶 ”的数量。
                @HystrixProperty(name = "metrics.rollingPercentile.numBuckets", value = "60000"),
                // 该属性用来设置在执行过程中每个 “桶” 中保留的最大执行次数。如果在滚动时间窗内发生超过该设定值的执行次数，
                // 就从最初的位置开始重写。例如，将该值设置为100, 滚动窗口为10秒，若在10秒内一个 “桶 ”中发生了500次执行，
                // 那么该 “桶” 中只保留 最后的100次执行的统计。另外，增加该值的大小将会增加内存量的消耗，并增加排序百分位数所需的计算时间。
                @HystrixProperty(name = "metrics.rollingPercentile.bucketSize", value = "100"),
                // 该属性用来设置采集影响断路器状态的健康快照（请求的成功、 错误百分比）的间隔等待时间。
                @HystrixProperty(name = "metrics.healthSnapshot.intervalinMilliseconds", value = "500"),
                // 是否开启请求缓存
                @HystrixProperty(name = "requestCache.enabled", value = "true"),
                // HystrixCommand的执行和事件是否打印日志到 HystrixRequestLog 中
                @HystrixProperty(name = "requestLog.enabled", value = "true"),
        },
        threadPoolProperties = {
                // 该参数用来设置执行命令线程池的核心线程数，该值也就是命令执行的最大并发量
                @HystrixProperty(name = "coreSize", value = "10"),
                // 该参数用来设置线程池的最大队列大小。当设置为 -1 时，线程池将使用 SynchronousQueue 实现的队列，
                // 否则将使用 LinkedBlockingQueue 实现的队列。
                @HystrixProperty(name = "maxQueueSize", value = "-1"),
                // 该参数用来为队列设置拒绝阈值。 通过该参数， 即使队列没有达到最大值也能拒绝请求。
                // 该参数主要是对 LinkedBlockingQueue 队列的补充,因为 LinkedBlockingQueue
                // 队列不能动态修改它的对象大小，而通过该属性就可以调整拒绝请求的队列大小了。
                @HystrixProperty(name = "queueSizeRejectionThreshold", value = "5"),
        }
)
public String strConsumer() {
    return "hello 2020";
}
public String str_fallbackMethod() {
    return "*****fall back str_fallbackMethod";
}
 
```



#### 服务限流

后面alibaba的Sentinel说明



### 服务监控 HystrixDashboard

#### 仪表盘9001

##### 新建 `cloud-consumer-hystrix-dashboard9001`



##### POM

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <parent>
        <artifactId>springcloud</artifactId>
        <groupId>org.hong</groupId>
        <version>1.0-SNAPSHOT</version>
    </parent>
    <modelVersion>4.0.0</modelVersion>

    <artifactId>cloud-consumer-hystrix-dashboard9001</artifactId>

    <dependencies>
        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-starter-netflix-hystrix-dashboard</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-actuator</artifactId>
        </dependency>

        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-devtools</artifactId>
            <scope>runtime</scope>
            <optional>true</optional>
        </dependency>
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <optional>true</optional>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
    </dependencies>


</project>
```



##### YAML

```yaml
server:
  port: 9001
```



##### 主启动

```java
package org.hong.springcloud;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.hystrix.dashboard.EnableHystrixDashboard;

@SpringBootApplication
@EnableHystrixDashboard
public class HystrixDashboardMain9001 {
    public static void main(String[] args) {
        SpringApplication.run(HystrixDashboardMain9001.class, args);
    }
}
```



##### 所有 Provider 微服务提供类都需要监控依赖配置

```xml
<!-- actuator监控信息完善 -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-actuator</artifactId>
</dependency>
```



##### 启动9001

访问 http://localhost:9001/hystrix

![image-20220122122356756](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081116067.png)

#### 断路器演示(服务监控hystrixDashboard)

##### 修改cloud-provider-hystrix-payment8001

出现下面情况需要更改

![image-20210604231508647](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081116914.png)

注意:新版本Hystrix需要在主启动类MainAppHystrix8001中指定监控路径

```java
package org.hong.springcloud;

import com.netflix.hystrix.contrib.metrics.eventstream.HystrixMetricsStreamServlet;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.servlet.ServletRegistrationBean;
import org.springframework.cloud.netflix.eureka.EnableEurekaClient;
import org.springframework.cloud.netflix.hystrix.EnableHystrix;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
@EnableEurekaClient //本服务启动后会自动注册进eureka服务中
@EnableHystrix
public class PaymentHystrixMain8001 {
    public static void main(String[] args) {
        SpringApplication.run(PaymentHystrixMain8001.class, args);
    }

    /**
     *此配置是为了服务监控而配置，与服务容错本身无关，springcloud升级后的坑
     *ServletRegistrationBean因为springboot的默认路径不是"/hystrix.stream"，
     *只要在自己的项目里配置上下面的servlet就可以了
     */
    @Bean
    public ServletRegistrationBean getServlet() {
        HystrixMetricsStreamServlet streamServlet = new HystrixMetricsStreamServlet();
        ServletRegistrationBean registrationBean = new ServletRegistrationBean(streamServlet);
        registrationBean.setLoadOnStartup(1);
        registrationBean.addUrlMappings("/hystrix.stream");
        registrationBean.setName("HystrixMetricsStreamServlet");
        return registrationBean;
    }
}
```



##### 监控测试

启动注册中心，启动8001，启动9001



##### 9001监控8001

![image-20220122122456458](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081116372.png)

![image-20220122122519969](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081116845.png)

![image-20220122122553320](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081116501.png)



<hr/>

## Gateway 新一代网关

### 概述


Cloud全家桶中有个很重要的组件就是网关，在1.x版本中都是采用的Zuul网关；但在2.x版本中，zuul的升级一直跳票，SpringCloud最后自己研发了一个网关替代Zuul，那就是SpringCloud Gateway一句话：gateway是原zuul1.x版的替代

![image-20210605100023792](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081116279.png)

SpringCloud Gateway 是 Spring Cloud 的一个全新项目，**基于 Spring 5.0+Spring Boot 2.0 和 Project Reactor 等技术开发的网关**，它旨在为微服务架构提供一种简单有效的统一的 API 路由管理方式。

SpringCloud Gateway 作为 Spring Cloud 生态系统中的网关，目标是替代 Zuul，在Spring Cloud 2.0以上版本中，没有对新版本的Zuul 2.0以上最新高性能版本进行集成，仍然还是使用的Zuul 1.x非Reactor模式的老版本。而为了提升网关的性能，SpringCloud Gateway是基于WebFlux框架实现的，而WebFlux框架底层则使用了高性能的Reactor模式通信框架Netty。

Spring Cloud Gateway的目标提供统一的路由方式且基于 Filter 链的方式提供了网关基本的功能，例如：安全，监控/指标，和限流。

>   能做什么

-   反向代理
-   鉴权
-   流量控制
-   熔断
-   日志监控



### 三大核心概念

>   Route(路由)

路由是构建网关的基本模块，它由ID，目标URI，一系列的断言和过滤器组成，如果断言为true则匹配该路由

>   Predicate(断言)

参考的是Java8的 `java.util.function.Predicate`，开发人员可以匹配HTTP请求中的所有内容(例如请求头或请求参数)，如果请求与断言相匹配则进行路由

>   Filter(过滤)

指的是Spring框架中GatewayFilter的实例，使用过滤器，可以在请求被路由前或者之后对请求进行修改。



### 入门配置

#### 新建 `cloud-gateway-gateway9527`



#### POM

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <parent>
        <artifactId>springcloud</artifactId>
        <groupId>org.hong</groupId>
        <version>1.0-SNAPSHOT</version>
    </parent>
    <modelVersion>4.0.0</modelVersion>

    <artifactId>cloud-gateway-gateway9527</artifactId>

    <dependencies>
        <!--gateway-->
        <!-- 注意: gateway是基于webflux, 所以导入了gateway后就别再导入webmvc了 -->
        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-starter-gateway</artifactId>
        </dependency>
        <!--eureka-client-->
        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-starter-netflix-eureka-client</artifactId>
        </dependency>
        <!-- 引入自己定义的api通用包，可以使用Payment支付Entity -->
        <dependency>
            <groupId>org.hong</groupId>
            <artifactId>cloud-api-commons</artifactId>
            <version>${project.version}</version>
        </dependency>
        <!--一般基础配置类-->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-devtools</artifactId>
            <scope>runtime</scope>
            <optional>true</optional>
        </dependency>
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <optional>true</optional>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
    </dependencies>

</project>
```



#### YAML

```yaml
server:
  port: 9527

spring:
  application:
    name: cloud-gateway

eureka:
  instance:
    hostname: cloud-gateway-service
  client: #服务提供者provider注册进eureka服务列表内
    service-url:
      register-with-eureka: true
      fetch-registry: true
      defaultZone: http://eureka7001.com:7001/eureka
```



#### 主启动

```java
package org.hong.springcloud;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.eureka.EnableEurekaClient;

@SpringBootApplication
@EnableEurekaClient
public class GateWayMain9527 {
    public static void main(String[] args) {
        SpringApplication.run(GateWayMain9527.class, args);
    }
}
```



#### 没有业务类



#### YAML 新增网关配置

```yaml
spring:
  cloud:
    gateway:
      routes:
        - id: payment_routh  						# 路由的ID，没有固定规则但要求唯一，建议配合服务名
          uri: http://localhost:8001            	# 匹配后提供服务的路由地址
          predicates:
            # 当通过网关9527访问下面的断言时, 会跳转到uri+断言的地址
            # 访问: http://localhost:9527/payment/1 -> http://localhost:8001/payment/1
            - Path=/payment/discovery,/payment/**	# 断言, 路径相匹配的进行路由, 逗号分割多个断言
```



#### 测试

启动注册中心，启动 `cloud-provider-payment8001`，启动9527网关，访问 http://localhost:9527/payment/1

```json
// 页面输出
{"code":200,"message":"查询成功, serverPort: 8001","data":{"id":2,"serial":"Tom"}}
```



#### 代码中配置网关

与 `YAML` 配置效果一样，自行测试

```java
package org.hong.springcloud.config;

import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class GateWayConfig {
    @Bean
    public RouteLocator customRouteLocator(RouteLocatorBuilder builder) {
        RouteLocatorBuilder.Builder routes = builder.routes();
        routes.route("payment", r -> r.path("/payment/**", "/payment/discovery").uri("http://localhost:8001"));
        return routes.build();
    }
}
```



### 负载均衡

>   当前问题

现在配置的路由直接写死了服务的 `localhost:8001`，最好是使用服务名来进行访问。

>   YAML

```yaml
spring:
  application:
    name: cloud-gateway
  cloud:
    gateway:
      routes:
        - id: payment_routh 
          # uri: http://localhost:8001
          # 修改uri; [lb: lb->Load Balance, 代表开启负载均衡功能]
          # lb://服务名
          uri: lb://CLOUD-PAYMENT-SERVICE
          predicates:
            - Path=/payment/discovery,/payment/** 
```



### Predicate 的使用

#### 概述

Spring Cloud Gateway将路由匹配作为Spring WebFlux HandlerMapping基础架构的一部分。
Spring Cloud Gateway包括许多内置的Route Predicate工厂。所有这些Predicate都与HTTP请求的不同属性匹配。多个Route Predicate工厂可以进行组合

Spring Cloud Gateway 创建 Route 对象时， 使用 RoutePredicateFactory 创建 Predicate 对象，Predicate 对象可以赋值给 Route。 Spring Cloud Gateway 包含许多内置的Route Predicate Factories。



#### 常用的 Route Predicate

![image-20220122122633273](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081116079.png)

![image-20220122122653779](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081116552.png)



#### After Route Predicate

>   YAML

```yaml
spring:
  application:
    name: cloud-gateway
  cloud:
    gateway:
      routes:
        - id: payment_routh 
          uri: lb://CLOUD-PAYMENT-SERVICE
          predicates:
            - Path=/payment/discovery,/payment/** 
           	# 这个After路由谓词工厂接受一个参数，datetime(这是一个javaZonedDateTime)。此谓词匹配在指定日期时间之后发生的请求。
			- After=2021-06-05T15:40:03.685+08:00[Asia/Shanghai]
```

`payment_routh` 配置的路由必须 `2021-06-05 15:40:03.685(上海时区)` 后才能访问



#### Before Route Predicate

```yaml
spring:
  application:
    name: cloud-gateway
  cloud:
    gateway:
      routes:
        - id: payment_routh 
          uri: lb://CLOUD-PAYMENT-SERVICE
          predicates:
            - Path=/payment/discovery,/payment/** 
			- Before=2021-06-05T15:40:03.685+08:00[Asia/Shanghai],2021-06-06T15:40:03.685+08:00[Asia/Shanghai]
```

指定时间之前能够访问



#### Between Route Predicate

```yaml
spring:
  application:
    name: cloud-gateway
  cloud:
    gateway:
      routes:
        - id: payment_routh 
          uri: lb://CLOUD-PAYMENT-SERVICE
          predicates:
            - Path=/payment/discovery,/payment/** 
			- Between=2021-06-05T15:40:03.685+08:00[Asia/Shanghai]
```

指定的两个时间之间能够访问



#### 时间格式

运行下面的代码可以查看时间格式

```java
package org.hong.test;

import java.time.ZonedDateTime;

public class ZonedDateTimeDemo {
    public static void main(String[] args) {
        ZonedDateTime zbj = ZonedDateTime.now(); // 默认时区
        System.out.println(zbj);
//        ZonedDateTime zny = ZonedDateTime.now(ZoneId.of("America/New_York")); // 用指定时区获取当前时间
//        System.out.println(zny);
    }
}
```



#### Cookie Route Predicate

```yaml
spring:
  application:
    name: cloud-gateway
  cloud:
    gateway:
      routes:
        - id: payment_routh 
          uri: lb://CLOUD-PAYMENT-SERVICE
          predicates:
            - Path=/payment/discovery,/payment/** 
            - Cookie=name,hong
```

Cookie Route Predicate需要两个参数，一个是 Cookie name ,一个是正则表达式。
路由规则会通过获取对应的 Cookie name 值和正则表达式去匹配，如果匹配上就会执行路由，如果没有匹配上则不执行

`cmd` 命令行访问 `curl http://localhost:9527/payment/1 --cookie "name=hong"` 进行测试

![image-20220122122717568](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081116167.png)



#### Header Route Predicate

```yaml
spring:
  cloud:
    gateway:
      routes:
      - id: header_route
        uri: https://example.org
        predicates:
        - Header=X-Request-Id, \d+
```

如果请求有名为`X-Request-Id`其值与`\d+`正则表达式(即它的值为一个或多个数字)。



#### Host Route Predicate

这个`Host`路由谓词工厂接受一个参数：主机名列表`patterns`。该模式是一种Ant样式模式。`.`作为分离器。此谓词匹配`Host`匹配模式的标头。

```yaml
spring:
  cloud:
    gateway:
      routes:
      - id: host_route
        uri: https://example.org
        predicates:
        # 逗号分割, 
        - Host=**.somehost.org,**.anotherhost.org
```

如果请求具有`Host`值为`www.somehost.org`或`beta.somehost.org`或`www.anotherhost.org`



#### Method Route Predicate

这个`Method`路由谓词工厂采取`methods`参数，它是一个或多个参数：要匹配的HTTP方法。

```yaml
spring:
  cloud:
    gateway:
      routes:
      - id: method_route
        uri: https://example.org
        predicates:
        - Method=GET,POST
```

如果请求方法是`GET`或者是`POST`



#### Path Route Predicate

```yaml
spring:
  application:
    name: cloud-gateway
  cloud:
    gateway:
      routes:
      - id: payment_routh 
        uri: lb://CLOUD-PAYMENT-SERVICE
        predicates:
        - Path=/payment/discovery,/payment/** 
```



#### Query Route Predicate

```yaml
spring:
  application:
    name: cloud-gateway
  cloud:
    gateway:
      routes:
      - id: payment_routh 
        uri: lb://CLOUD-PAYMENT-SERVICE
        predicates:
        - Path=/payment/discovery,/payment/** 
        - Query=username, \d+  # 要有参数名username并且值还要是整数才能路由
```

http://localhost:9527/payment/lb?username=31 才能正确访问



### Filter 的使用

#### 自定义过滤器

```java
package org.hong.springcloud.filter;

import lombok.extern.slf4j.Slf4j;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

/*
 * 实现GlobalFilter定义全局过滤器
 * 实现Ordered定义优先级
 */
@Component
@Slf4j
public class MyGateWayFilter implements GlobalFilter, Ordered {
    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        log.info("MyGateWayFilter执行");
        ServerHttpRequest request = exchange.getRequest();
        // 请求必须带一个uname的参数
        String uname = request.getQueryParams().getFirst("uname");
        if(null == uname){
            log.error("用户名为null, 登录驳回");
            exchange.getResponse().setStatusCode(HttpStatus.NOT_ACCEPTABLE);
            // 过滤链结束
            return exchange.getResponse().setComplete();
        }
        // 过滤链放行
        return chain.filter(exchange);
    }

    @Override
    public int getOrder() {
        return 0;
    }
}
```





<hr/>

## SpringCloud Config 分布式配置中心

### 概述

微服务意味着要将单体应用中的业务拆分成一个个子服务，每个服务的粒度相对较小，因此系统中会出现大量的服务。由于每个服务都需要必要的配置信息才能运行，所以一套集中式的、动态的配置管理设施是必不可少的。

SpringCloud提供了ConfigServer来解决这个问题，我们每一个微服务自己带着一个application.yml，上百个配置文件的管

>   作用

-   运行期间动态调整配置，不再需要在每个服务部署的机器上编写配置文件，服务会向配置中心统一拉取配置自己的信息
-   当配置发生变动时，服务不需要重启即可感知到配置的变化并应用新的配置
-   将配置信息以REST接口的形式暴露

>   与 GitHub 整合

由于SpringCloud Config默认使用Git来存储配置文件(也有其它方式,比如支持SVN和本地文件)，但最推荐的还是Git，而且使用的是http/https访问的形式。



### Config 服务端配置与测试

本次使用 `Gitee` 。

#### 创建 `springcloud-config` 仓库

![image-20220122122751226](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081117916.png)

#### 本地仓库搭建

-   `https://github.com/zzyybs/springcloud-config` 下载并解压
-   进入目录 `git init` 初始化本地仓库
-   `git add .` 提交所有文件
-   `git commit -m “springcloud-config init” 提交暂存区文件`
-   `git remote add [别名] [远程地址]` 创建别名，方便后续操作
-   `git push [别名] master` 推送到 Gitee



#### 微服务搭建

##### 新建 `cloud-config-center-3344`

它即为 Cloud 的配置中心模块` cloudConfig Center`



##### POM

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <parent>
        <artifactId>springcloud</artifactId>
        <groupId>org.hong</groupId>
        <version>1.0-SNAPSHOT</version>
    </parent>
    <modelVersion>4.0.0</modelVersion>

    <artifactId>cloud-config-center-3344</artifactId>

    <dependencies>
        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-config-server</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-starter-netflix-eureka-client</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>

        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-actuator</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-devtools</artifactId>
            <scope>runtime</scope>
            <optional>true</optional>
        </dependency>
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <optional>true</optional>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
    </dependencies>

</project>
```



##### YAML

```yaml
server:
  port: 3344

spring:
  application:
    name:  cloud-config-center # 注册进Eureka服务器的微服务名
  cloud:
    config:
      server:
        git:
          uri: https://gitee.com/hong-0105/springcloud-config.git # GitHub上面的git仓库名字
          # 搜索目录, 这个目录是GitHub上的目录, 不是本地目录
          search-paths:
            - springcloud-config
          # 如果远程仓库不是公开的, 需要额外配置username和password
          #username: username
          #password: password
      # 读取分支
      label: master

#服务注册到eureka地址
eureka:
  client:
    service-url:
      defaultZone: http://eureka7001.com:7001/eureka/,http://eureka7002.com:7002/eureka/
```



##### 主启动

```java
package org.hong.springcloud;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.config.server.EnableConfigServer;
import org.springframework.cloud.netflix.eureka.EnableEurekaClient;

@SpringBootApplication
@EnableEurekaClient
@EnableConfigServer
public class ConfigCenterMain3344 {
    public static void main(String[] args) {
        SpringApplication.run(ConfigCenterMain3344.class, args);
    }
}
```



#### 测试

启动注册中心，启动3344配置中心。访问 http://localhost:3344/master/config-dev.yml，如果有数据返回就成功了

![image-20220122122820651](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081117100.png)

#### 配置读取规则

>   我们并没有写过任何 Controller 的内容，为什么还能访问到呢？

读取 GitHub 上的信息有特定的规则，这里写几个常用的规则。

>   前置知识

以 http://localhost:3344/master/config-dev.yml 路径为例，其中：

-   master：{lable}
-   config：{application}
-   dev：{profile}

>   常用规则

`/{label}/{application}-{profile}.yml`：读取 `label` 分支上 `search-paths` 目录中的 `{application}-{profile}.yml` 文件

`/{application}-{profile}.yml`：这种方式没有指明分支，使用的是 `YAML` 配置上的 `lable` 属性作为读取的分支

`/{application}/{profile}[/{label}]`：与方式一差不多



### Config 客户端配置与测试

#### 新建 `cloud-config-client-3355`



#### POM

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <parent>
        <artifactId>springcloud</artifactId>
        <groupId>org.hong</groupId>
        <version>1.0-SNAPSHOT</version>
    </parent>
    <modelVersion>4.0.0</modelVersion>

    <artifactId>cloud-config-client-3355</artifactId>
    
    <dependencies>
        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-starter-config</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-starter-netflix-eureka-client</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-actuator</artifactId>
        </dependency>

        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-devtools</artifactId>
            <scope>runtime</scope>
            <optional>true</optional>
        </dependency>
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <optional>true</optional>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
    </dependencies>

</project>
```



#### boostrap.yaml

##### 概述

`applicaiton.yml` 是用户级的资源配置项
`bootstrap.yml` 是系统级的，优先级更加高

Spring Cloud会创建一个“Bootstrap Context”，作为Spring应用的`Application Context`的父上下文。初始化的时候，**`Bootstrap Context`负责从外部源加载配置属性并解析配置**。这两个上下文共享一个从外部获取的`Environment`。

`Bootstrap`属性有高优先级，默认情况下，它们不会被本地配置覆盖。 `Bootstrap context`和`Application Context`有着不同的约定，所以新增了一个`bootstrap.yml`文件，保证`Bootstrap Context`和`Application Context`配置的分离。

要将Client模块下的application.yml文件改为bootstrap.yml,这是很关键的，
**因为bootstrap.yml是比application.yml先加载的。bootstrap.yml优先级高于application.yml**

 

```yaml
server:
  port: 3355

spring:
  application:
    name: config-client
  cloud:
    # Config客户端配置
    # 最终访问地址 http://localhost:3344/master/config-dev.yml
    config:
      label: master #分支名称
      name: config #配置文件名称
      profile: dev #读取后缀名称
      uri: http://localhost:3344 #配置中心地址k

#服务注册到eureka地址
eureka:
  client:
    service-url:
      defaultZone: http://eureka7001.com:7001/eureka/,http://eureka7002.com:7002/eureka/
```



#### 主启动

```java
package org.hong.springcloud;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.eureka.EnableEurekaClient;

@SpringBootApplication
@EnableEurekaClient
public class ConfigClientMain3355 {
    public static void main(String[] args) {
        SpringApplication.run(ConfigClientMain3355.class,args);
    }
}
```



#### 业务类

```java
package org.hong.springcloud.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/config")
public class ConfigClientController {
    @Value("${config.info}")
    private String configInfo;

    @GetMapping("/info")
    public String getConfigInfo() {
        return configInfo;
    }
}
```



#### 测试

启动注册中心，启动3344配置中心，启动3355，访问 http://localhost:3355/config/info

![image-20220122122848512](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081117673.png)

页面输出 Gitee上 `master` 分支上 `config-dev.yml` 文件中 `config.info` 的信息。

>   修改文件内容再次访问

通过 `Gitee` 或 `GitHub` 上编辑文件内容。

访问 http://localhost:3344/master/config-dev.yml，3344注册中心会每次向 GitHub 发送请求

![image-20220122122910474](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081117412.png)

访问 http://localhost:3355/config/info，3355 ConfigClient 客户端还是原来的数据

![image-20220122122926790](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081117992.png)

### Config 客户端之动态刷新

>   修改3355模

#### POM 引入 actuator 监控

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-actuator</artifactId>
</dependency>
```



#### 修改 YAML 暴露监控端口

```yaml
# 暴露监控端点
management:
  endpoints:
    web:
      exposure:
        include: "*"
```



#### Controller 上增加 @RefreshScope 注解

`@RefreshScope`



#### 测试

重启 3355 配置客户端，修改 Gitee 上的配置文件，再次进行访问，发现3355还是没有自动刷新 /(ㄒoㄒ)/~~

>   需要多加一步，通知3355配置已经更新了

cmd 窗口输入 `curl -X POST "http://localhost:3355/actuator/refresh"`，发送一次 POST 请求通知3355更新配置

>   问题

如果有多个微服务呢？每个微服务都要执行一次post请求，手动刷新？可否广播，一次通知，处处生效？这就需要用到**服务总线**





<hr/>

## SpringCloud Bus 消息总线





<hr/>

## SpringCloud Stream 消息驱动











# SpringCloud Alibaba

>   概述

-   服务限流降级：默认支持 Servlet、Feign、RestTemplate、Dubbo 和 RocketMQ 限流降级功能的接入，可以在运行时通过控制台实时修改限流降级规则，还支持查看限流降级 Metrics 监控。
-   服务注册与发现：适配 Spring Cloud 服务注册与发现标准，默认集成了 Ribbon 的支持。
-   分布式配置管理：支持分布式系统中的外部化配置，配置更改时自动刷新。
-   消息驱动能力：基于 Spring Cloud Stream 为微服务应用构建消息驱动能力。
-   阿里云对象存储：阿里云提供的海量、安全、低成本、高可靠的云存储服务。支持在任何应用、任何时间、任何地点存储和访问任意类型的数据。
-   分布式任务调度：提供秒级、精准、高可靠、高可用的定时（基于 Cron 表达式）任务调度服务。同时提供分布式的任务执行模型，如网格任务。网格任务支持海量子任务均匀分配到所有 Worker（schedulerx-client）上执行。

>   学习资料

官网：https://spring.io/projects/spring-cloud-alibaba#overview

中文：https://github.com/alibaba/spring-cloud-alibaba/blob/master/README-zh.md

英文：https://spring-cloud-alibaba-group.github.io/github-pages/greenwich/spring-cloud-alibaba.html



## SpringCloud Alibaba Nacos服务注册和配置中心

### Nacos 简介

>   为什么叫Nacos

前四个字母分别为Naming和Configuration的前两个字母，最后的s为Service。

>   是什么

Nacos就是注册中心 + 配置中心的组合；`Nacos = Eureka + Config +Bus`

>   官方文档

https://spring-cloud-alibaba-group.github.io/github-pages/greenwich/spring-cloud-alibaba.html#_spring_cloud_alibaba_nacos_discovery

https://nacos.io/zh-cn/index.html



### 安装并运行 Nacos

>   运行环境

本地Java8 + Maven环境

>   下载地址

https://github.com/alibaba/nacos/releases

>   安装

直接解压到非中文目录就行

>   运行

打开 `cmd` 终端，运行 `startup.cmd -m standalone` 这个命令会以单机的方式启动 `nacos`，如果不加 `-m standalone` 会以集群的方式启动

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081117439.png)

>   访问监控页

http://localhost:8848/nacos

默认用户名和密码都是 `nacos`

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081117986.png)



### Nacos 作为服务注册中心演示

#### 基于Nacos的服务提供者

##### 新建 cloudalibaba-provider-payment9001



###### 父 POM

```xml
<?xml version="1.0" encoding="UTF-8"?>

<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
  <modelVersion>4.0.0</modelVersion>

  <groupId>org.hong</groupId>
  <artifactId>springcloud</artifactId>
  <version>1.0-SNAPSHOT</version>
  <modules>
    <module>cloud-provider-payment8001</module>
      <module>cloud-consumer-order81</module>
      <module>cloud-api-commons</module>
      <module>cloud-eureka-server7001</module>
      <module>cloud-eureka-server7002</module>
      <module>cloud-provider-payment8002</module>
      <module>cloud-providerconsul-payment8006</module>
      <module>cloud-consumerconsul-order81</module>
      <module>cloud-consumer-feign-order81</module>
      <module>cloud-provider-hystrix-payment8001</module>
      <module>cloud-consumer-feign-hystrix-order81</module>
      <module>cloud-consumer-hystrix-dashboard9001</module>
      <module>cloud-gateway-gateway9527</module>
      <module>cloud-config-center-3344</module>
      <module>cloud-config-client-3355</module>
    <module>cloudalibaba-provider-payment9001</module>
  </modules>
  <!-- 父工程的打包方式应该为pom, 而不是jar或者war -->
  <packaging>pom</packaging>

  <!-- 统一管理jar包版本 -->
  <properties>
    <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
    <maven.compiler.source>1.8</maven.compiler.source>
    <maven.compiler.target>1.8</maven.compiler.target>
    <junit.version>4.12</junit.version>
    <log4j.version>1.2.17</log4j.version>
    <lombok.version>1.16.18</lombok.version>
    <mysql.version>5.1.47</mysql.version>
    <druid.version>1.1.16</druid.version>
    <mybatis.spring.boot.version>1.3.0</mybatis.spring.boot.version>
  </properties>

  <!-- dependencyManagement:子模块继承之后，提供作用：锁定版本 +子modlue不用写groupId和version  -->
  <dependencyManagement>
    <dependencies>
      <!--spring boot 2.2.2-->
      <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-dependencies</artifactId>
        <version>2.2.2.RELEASE</version>
        <type>pom</type>
        <scope>import</scope>
      </dependency>
      <!--spring cloud Hoxton.SR1-->
      <dependency>
        <groupId>org.springframework.cloud</groupId>
        <artifactId>spring-cloud-dependencies</artifactId>
        <version>Hoxton.SR1</version>
        <type>pom</type>
        <scope>import</scope>
      </dependency>
      <!-- ###### -->
      <!--spring cloud alibaba 2.1.0.RELEASE-->
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
        <groupId>org.mybatis.spring.boot</groupId>
        <artifactId>mybatis-spring-boot-starter</artifactId>
        <version>${mybatis.spring.boot.version}</version>
      </dependency>
      <dependency>
        <groupId>junit</groupId>
        <artifactId>junit</artifactId>
        <version>${junit.version}</version>
      </dependency>
      <dependency>
        <groupId>log4j</groupId>
        <artifactId>log4j</artifactId>
        <version>${log4j.version}</version>
      </dependency>
      <dependency>
        <groupId>org.projectlombok</groupId>
        <artifactId>lombok</artifactId>
        <version>${lombok.version}</version>
        <optional>true</optional>
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



###### 本 POM

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <parent>
        <artifactId>springcloud</artifactId>
        <groupId>org.hong</groupId>
        <version>1.0-SNAPSHOT</version>
    </parent>
    <modelVersion>4.0.0</modelVersion>

    <artifactId>cloudalibaba-provider-payment9001</artifactId>

    <dependencies>
        <!--SpringCloud ailibaba nacos -->
        <dependency>
            <groupId>com.alibaba.cloud</groupId>
            <artifactId>spring-cloud-starter-alibaba-nacos-discovery</artifactId>
        </dependency>
        <!-- SpringBoot整合Web组件 -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-actuator</artifactId>
        </dependency>
        <!--日常通用jar包配置-->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-devtools</artifactId>
            <scope>runtime</scope>
            <optional>true</optional>
        </dependency>
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <optional>true</optional>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
    </dependencies>

</project>
```



###### YAML

```yaml
server:
  port: 9001

spring:
  application:
    name: nacos-payment-provider
  cloud:
    nacos:
      discovery:
        server-addr: localhost:8848 #配置Nacos地址

management:
  endpoints:
    web:
      exposure:
        include: '*'
```



###### 业务类

```java
package org.hong.springcloudalibaba.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/payment")
public class PaymentController {
    @Value("${server.port}")
    private String serverPort;

    @GetMapping("/nacos/{id}")
    public String getPayment(@PathVariable("id") Integer id) {
        return "nacos registry, serverPort: " + serverPort + "\t id" + id;
    }
}
```



###### 测试

启动9001，访问 http://localhost:9001/payment/nacos/1

>   nacos控制台

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081118815.png)

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081118681.png)

nacos服务注册中心 + 服务提供者9001都OK了



##### 新建 cloudalibaba-provider-payment9002

为了演示 `nacos` 的负载均衡，根据9001创建一个9002

>   偷懒方法



![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081118803.png)

<table>
    <tr>
        <td>
        	<img src="https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081119843.png" alt="image-20210607150129768" style="zoom:80%;" />
        </td>
    	<td>
        	<img src="https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081122951.png" alt="image-20210607150216340" style="zoom:80%;" />
            直接启动就行了
        </td>
    </tr>
</table>



#### 基于 Nacos 的服务消费者

##### 新建 cloudalibaba-consumer-nacos-order83



##### POM

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <parent>
        <artifactId>springcloud</artifactId>
        <groupId>org.hong</groupId>
        <version>1.0-SNAPSHOT</version>
    </parent>
    <modelVersion>4.0.0</modelVersion>

    <artifactId>cloudalibaba-consumer-nacos-order83</artifactId>

    <dependencies>
        <!--SpringCloud ailibaba nacos -->
        <dependency>
            <groupId>com.alibaba.cloud</groupId>
            <artifactId>spring-cloud-starter-alibaba-nacos-discovery</artifactId>
        </dependency>
        <!-- 引入自己定义的api通用包，可以使用Payment支付Entity -->
        <dependency>
            <groupId>org.hong</groupId>
            <artifactId>cloud-api-commons</artifactId>
            <version>${project.version}</version>
        </dependency>
        <!-- SpringBoot整合Web组件 -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-actuator</artifactId>
        </dependency>
        <!--日常通用jar包配置-->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-devtools</artifactId>
            <scope>runtime</scope>
            <optional>true</optional>
        </dependency>
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <optional>true</optional>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
    </dependencies>

</project>
```

>   为什么 Nacos 支持负载均衡

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081122118.png)



##### YAML

```yaml
server:
  port: 83

spring:
  application:
    name: nacos-order-consumer
  cloud:
    nacos:
      discovery:
        server-addr: localhost:8848
```



##### 主启动

```java
package org.hong.springcloudalibaba;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication
@EnableDiscoveryClient
public class OrderNacosMain83 {
    public static void main(String[] args) {
        SpringApplication.run(OrderNacosMain83.class, args);
    }
}
```



##### 业务类

>   ApplicationContextBean

```java
package org.hong.springcloudalibaba.config;

import org.springframework.cloud.client.loadbalancer.LoadBalanced;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

@Configuration
public class ApplicationContextBean {
    @Bean
    @LoadBalanced
    public RestTemplate getRestTemplate() {
        return new RestTemplate();
    }
}
```



##### 测试

>   启动83消费服务。

>   Nacos 控制台

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081122028.png)

>   测试负载均衡

访问 http://localhost:83/consumer/payment/nacos/1，轮询访问 9001/9002



### Nacos 作为服务配置中心演示

#### Nacos 作为配置中心-基础配置

##### 新建 cloudalibaba-config-nacos-client3377



##### POM

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <parent>
        <artifactId>springcloud</artifactId>
        <groupId>org.hong</groupId>
        <version>1.0-SNAPSHOT</version>
    </parent>
    <modelVersion>4.0.0</modelVersion>

    <artifactId>cloudalibaba-config-nacos-client3377</artifactId>

    <dependencies>
        <!--nacos-config-->
        <dependency>
            <groupId>com.alibaba.cloud</groupId>
            <artifactId>spring-cloud-starter-alibaba-nacos-config</artifactId>
        </dependency>
        <!--nacos-discovery-->
        <dependency>
            <groupId>com.alibaba.cloud</groupId>
            <artifactId>spring-cloud-starter-alibaba-nacos-discovery</artifactId>
        </dependency>
        <!--web + actuator-->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-actuator</artifactId>
        </dependency>
        <!--一般基础配置-->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-devtools</artifactId>
            <scope>runtime</scope>
            <optional>true</optional>
        </dependency>
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <optional>true</optional>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
    </dependencies>

</project>
```



##### YAML

>   bootstrap.yam

```yaml
# nacos配置
server:
  port: 3377

spring:
  application:
    name: nacos-config-client
  cloud:
    nacos:
      discovery:
        server-addr: localhost:8848 #Nacos服务注册中心地址
      config:
        server-addr: localhost:8848 #Nacos作为配置中心地址
        file-extension: yaml #指定yaml格式的配置

  # ${spring.application.name}-${spring.profile.active}.${spring.cloud.nacos.config.file-extension}
```

>   application.yaml

```yaml
spring:
  profiles:
    active: dev # 表示开发环境
```



##### 主启动

```java
package org.hong.springcloudalibaba;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication
@EnableDiscoveryClient
public class NacosConfigClientMain3377 {
    public static void main(String[] args) {
        SpringApplication.run(NacosConfigClientMain3377.class, args);
    }
}
```



##### 业务类

```java
package org.hong.springcloudalibaba.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.context.config.annotation.RefreshScope;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RefreshScope //在控制器类加入@RefreshScope注解使当前类下的配置支持Nacos的动态刷新功能。
public class ConfigClientController {
    @Value("${config.info}")
    private String configInfo;

    @GetMapping("/config/info")
    public String getConfigInfo() {
        return configInfo;
    }
}
```



##### 在 Nacos 中添加配置信息

>   匹配规则

```properties
# 注意: 老版本的Nacos会把yaml和yml当作两个不同的后缀
${spring.application.name}-${spring.profile.active}.${spring.cloud.nacos.config.file-extension}
```

-   `prefix` 默认为 `spring.application.name` 的值，也可以通过配置项 `spring.cloud.nacos.config.prefix`来配置。
-   `spring.profiles.active` 即为当前环境对应的 profile，详情可以参考 [Spring Boot文档](https://docs.spring.io/spring-boot/docs/current/reference/html/boot-features-profiles.html#boot-features-profiles)。 **注意：当 `spring.profiles.active` 为空时，对应的连接符 `-` 也将不存在，dataId 的拼接格式变成 `${prefix}.${file-extension}`**
-   `file-exetension` 为配置内容的数据格式，可以通过配置项 `spring.cloud.nacos.config.file-extension` 来配置。目前只支持 `properties` 和 `yaml` 类型。
-   通过 Spring Cloud 原生注解 `@RefreshScope` 实现配置自动更新：

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081123849.png)



>   Nacos 控制台添加配置

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081123332.png)

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081123773.png)



##### 测试

启动3377，访问 http://localhost:3377/config/info，有内容输出就OK了

修改 Nacos 上的配置信息，再次访问 http://localhost:3377/config/info，配置及时刷新



#### Nacos 作为配置中心-分类配置

##### 概述

Nacos 配置分类的三个概念：`Namespace `、`Group`、`DataID`

**类似 Java 里面的 package 名和类名，最外层的 namespace 是可以用于区分部署环境的，Group 和 DataID 逻辑上区分两个目标对象。**

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081123469.png)

>   默认情况：
>
>   Namespace=public，Group=DEFAULT_GROUP, 默认 Cluster 是 DEFAULT

Nacos 默认的命名空间是 public，Namespace 主要用来实现隔离。
比方说我们现在有三个环境：开发、测试、生产环境，我们就可以创建三个 Namespace，不同的 Namespace 之间是隔离的。

Group默认是 DEFAULT_GROUP，Group 可以把不同的微服务划分到同一个分组里面去

Service就是微服务；一个Service可以包含多个Cluster（集群），Nacos 默认 Cluste r是DEFAULT，Cluster 是对指定微服务的一个虚拟划分。
比方说为了容灾，将 Service 微服务分别部署在了杭州机房和广州机房，这时就可以给杭州机房的Service微服务起一个集群名称（HZ），给广州机房的Service微服务起一个集群名称（GZ），还可以尽量让同一个机房的微服务互相调用，以提升性能。

最后是Instance，就是微服务的实例。



##### DataID方案

指定 `spring.profile.active` 和配置文件的 `DataID` 来使不同环境下读取不同的配置

>   默认空间+默认分组+新建dev和test两个DataID

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081123154.png)

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081123554.png)

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081123254.png)



>   通过 `spring.profile.active` 属性进行多环境下配置文件的读取
>
>   application.yaml

```yaml
spring:
  profiles:
    #active: dev # 表示开发环境
    active: test # 表示测试环境
```

>   测试

重启3377，访问 http://localhost:3377/config/info，`spring.profile.active` 属性是什么就读取什么配置



##### Group方案

>   新建配置

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081123857.png)
![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081123425.png)
![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081126004.png)



>   修改YAML文件

>   application.yaml

```yaml
spring:
  profiles:
    #active: dev # 表示开发环境
    #active: test # 表示测试环境
    active: info
```

>   bootstrap.yaml

```yaml
# nacos配置
server:
  port: 3377

spring:
  application:
    name: nacos-config-client
  cloud:
    nacos:
      discovery:
        server-addr: localhost:8848 #Nacos服务注册中心地址
      config:
        server-addr: localhost:8848 #Nacos作为配置中心地址
        file-extension: yaml #指定yaml格式的配置
        group: TEST_GROUP # 指定组, 默认为DEFAULT_GROUP

# ${spring.application.name}-${spring.profile.active}.${spring.cloud.nacos.config.file-extension}
```

>   测试

重启3377，访问 http://localhost:3377/config/info，`spring.cloud.cloud.nacos.config` 属性是什么就读取什么配置



##### Namespace方案

>   创建命名空间

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081126964.png)
![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081126281.png)

>   切换命名空间

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081126568.png)
![]()

>   新建配置

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081126428.png)
![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081126574.png)

>   修改YAML文件

>   application.yaml

```yaml
spring:
  profiles:
    #active: dev # 表示开发环境
    #active: test # 表示测试环境
    active: info
```

>   bootstrap.yaml

```yaml
# nacos配置
server:
  port: 3377

spring:
  application:
    name: nacos-config-client
  cloud:
    nacos:
      discovery:
        server-addr: localhost:8848 #Nacos服务注册中心地址
      config:
        server-addr: localhost:8848 #Nacos作为配置中心地址
        file-extension: yaml #指定yaml格式的配置
        group: DEFAULT_GROUP # 指定组, 默认为DEFAULT_GROUP
        namespace: e103b6c2-e1d7-4169-89e2-7d64a1b68689 # 指定namespace, 请使用namespace的id, 不要使用namespace的名称

# ${spring.application.name}-${spring.profile.active}.${spring.cloud.nacos.config.file-extension}
```

>   测试

重启3377，访问 http://localhost:3377/config/info，`spring.cloud.cloud.nacos.namespace` 属性是什么就读取什么配置



#### Nacos 作为配置中心-通用配置

通过自定义扩展的数据ID配置，既可以解决多个应用间配置共享的问题，又可以支持一个应用有多个配置文件。

为了更加清晰的在多个应用间配置共享的数据ID，你可以通过以下的方式来配置：

```properties
# 配置支持共享的 Data Id
spring.cloud.nacos.config.shared-configs[0].data-id=common.yaml

# 配置 Data Id 所在分组，缺省默认 DEFAULT_GROUP
spring.cloud.nacos.config.shared-configs[0].group=GROUP_APP1

# 配置Data Id 在配置变更时，是否动态刷新，缺省默认 false
spring.cloud.nacos.config.shared-configs[0].refresh=true
```

可以看到：

-   通过`spring.cloud.nacos.config.shared-configs[n].data-id`来支持多个共享数据ID的配置。
-   通过`spring.cloud.nacos.config.shared-configs[n].group`来配置自定义数据ID所在的组，不明确配置的话，默认是默认组。
-   通过`spring.cloud.nacos.config.shared-configs[n].refresh`来控制该数据ID在配置变更时，是否支持应用中动态刷新，默认false。



### Nacos 集群和持久化配置

本次搭建使用 `1台Nginx`、`3台Naco`、`1台MySql` 进行搭建；

>   官网推荐

请求首先经过 Nginx 集群，Nginx 使用反向代理转发到 Nacos 中，Nacos 从 MySQL 中读取配置。

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081126464.png)
#### 官网说明

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081126660.png)
![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081127554.png)


#### Windows 持久化

`Nacos` 默认自带的是嵌入式数据库derby，在集群模式下的 `Nacos` 需要保持数据的一致性就不能使用自带的数据库了，需要切换到外部的数据库，`Nacos` 目前只支持 `MySql` 数据库。



##### derby 到 MySql 切换配置步骤

###### 执行 SQL 脚本

在 `nacos\conf` 目录下找到  `Nacos` 自带的 `nacos-mysql.sql` 脚本，并运行。

<span style='color: red;'>注意： `nacos-mysql.sql` 脚本可能只有建表语句，我们需要自己创建一个 `nacos_config` 数据库</span>

```mysql
/*
 * Copyright 1999-2018 Alibaba Group Holding Ltd.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/******************************************/
/*   数据库全名 = nacos_config   */
/*   表名称 = config_info   */
/******************************************/
CREATE TABLE `config_info` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT 'id',
  `data_id` varchar(255) NOT NULL COMMENT 'data_id',
  `group_id` varchar(255) DEFAULT NULL,
  `content` longtext NOT NULL COMMENT 'content',
  `md5` varchar(32) DEFAULT NULL COMMENT 'md5',
  `gmt_create` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `gmt_modified` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '修改时间',
  `src_user` text COMMENT 'source user',
  `src_ip` varchar(50) DEFAULT NULL COMMENT 'source ip',
  `app_name` varchar(128) DEFAULT NULL,
  `tenant_id` varchar(128) DEFAULT '' COMMENT '租户字段',
  `c_desc` varchar(256) DEFAULT NULL,
  `c_use` varchar(64) DEFAULT NULL,
  `effect` varchar(64) DEFAULT NULL,
  `type` varchar(64) DEFAULT NULL,
  `c_schema` text,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_configinfo_datagrouptenant` (`data_id`,`group_id`,`tenant_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='config_info';

/******************************************/
/*   数据库全名 = nacos_config   */
/*   表名称 = config_info_aggr   */
/******************************************/
CREATE TABLE `config_info_aggr` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT 'id',
  `data_id` varchar(255) NOT NULL COMMENT 'data_id',
  `group_id` varchar(255) NOT NULL COMMENT 'group_id',
  `datum_id` varchar(255) NOT NULL COMMENT 'datum_id',
  `content` longtext NOT NULL COMMENT '内容',
  `gmt_modified` datetime NOT NULL COMMENT '修改时间',
  `app_name` varchar(128) DEFAULT NULL,
  `tenant_id` varchar(128) DEFAULT '' COMMENT '租户字段',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_configinfoaggr_datagrouptenantdatum` (`data_id`,`group_id`,`tenant_id`,`datum_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='增加租户字段';


/******************************************/
/*   数据库全名 = nacos_config   */
/*   表名称 = config_info_beta   */
/******************************************/
CREATE TABLE `config_info_beta` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT 'id',
  `data_id` varchar(255) NOT NULL COMMENT 'data_id',
  `group_id` varchar(128) NOT NULL COMMENT 'group_id',
  `app_name` varchar(128) DEFAULT NULL COMMENT 'app_name',
  `content` longtext NOT NULL COMMENT 'content',
  `beta_ips` varchar(1024) DEFAULT NULL COMMENT 'betaIps',
  `md5` varchar(32) DEFAULT NULL COMMENT 'md5',
  `gmt_create` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `gmt_modified` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '修改时间',
  `src_user` text COMMENT 'source user',
  `src_ip` varchar(50) DEFAULT NULL COMMENT 'source ip',
  `tenant_id` varchar(128) DEFAULT '' COMMENT '租户字段',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_configinfobeta_datagrouptenant` (`data_id`,`group_id`,`tenant_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='config_info_beta';

/******************************************/
/*   数据库全名 = nacos_config   */
/*   表名称 = config_info_tag   */
/******************************************/
CREATE TABLE `config_info_tag` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT 'id',
  `data_id` varchar(255) NOT NULL COMMENT 'data_id',
  `group_id` varchar(128) NOT NULL COMMENT 'group_id',
  `tenant_id` varchar(128) DEFAULT '' COMMENT 'tenant_id',
  `tag_id` varchar(128) NOT NULL COMMENT 'tag_id',
  `app_name` varchar(128) DEFAULT NULL COMMENT 'app_name',
  `content` longtext NOT NULL COMMENT 'content',
  `md5` varchar(32) DEFAULT NULL COMMENT 'md5',
  `gmt_create` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `gmt_modified` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '修改时间',
  `src_user` text COMMENT 'source user',
  `src_ip` varchar(50) DEFAULT NULL COMMENT 'source ip',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_configinfotag_datagrouptenanttag` (`data_id`,`group_id`,`tenant_id`,`tag_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='config_info_tag';

/******************************************/
/*   数据库全名 = nacos_config   */
/*   表名称 = config_tags_relation   */
/******************************************/
CREATE TABLE `config_tags_relation` (
  `id` bigint(20) NOT NULL COMMENT 'id',
  `tag_name` varchar(128) NOT NULL COMMENT 'tag_name',
  `tag_type` varchar(64) DEFAULT NULL COMMENT 'tag_type',
  `data_id` varchar(255) NOT NULL COMMENT 'data_id',
  `group_id` varchar(128) NOT NULL COMMENT 'group_id',
  `tenant_id` varchar(128) DEFAULT '' COMMENT 'tenant_id',
  `nid` bigint(20) NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`nid`),
  UNIQUE KEY `uk_configtagrelation_configidtag` (`id`,`tag_name`,`tag_type`),
  KEY `idx_tenant_id` (`tenant_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='config_tag_relation';

/******************************************/
/*   数据库全名 = nacos_config   */
/*   表名称 = group_capacity   */
/******************************************/
CREATE TABLE `group_capacity` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `group_id` varchar(128) NOT NULL DEFAULT '' COMMENT 'Group ID，空字符表示整个集群',
  `quota` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '配额，0表示使用默认值',
  `usage` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '使用量',
  `max_size` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '单个配置大小上限，单位为字节，0表示使用默认值',
  `max_aggr_count` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '聚合子配置最大个数，，0表示使用默认值',
  `max_aggr_size` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '单个聚合数据的子配置大小上限，单位为字节，0表示使用默认值',
  `max_history_count` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '最大变更历史数量',
  `gmt_create` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `gmt_modified` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '修改时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_group_id` (`group_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='集群、各Group容量信息表';

/******************************************/
/*   数据库全名 = nacos_config   */
/*   表名称 = his_config_info   */
/******************************************/
CREATE TABLE `his_config_info` (
  `id` bigint(64) unsigned NOT NULL,
  `nid` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `data_id` varchar(255) NOT NULL,
  `group_id` varchar(128) NOT NULL,
  `app_name` varchar(128) DEFAULT NULL COMMENT 'app_name',
  `content` longtext NOT NULL,
  `md5` varchar(32) DEFAULT NULL,
  `gmt_create` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `gmt_modified` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `src_user` text,
  `src_ip` varchar(50) DEFAULT NULL,
  `op_type` char(10) DEFAULT NULL,
  `tenant_id` varchar(128) DEFAULT '' COMMENT '租户字段',
  PRIMARY KEY (`nid`),
  KEY `idx_gmt_create` (`gmt_create`),
  KEY `idx_gmt_modified` (`gmt_modified`),
  KEY `idx_did` (`data_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='多租户改造';


/******************************************/
/*   数据库全名 = nacos_config   */
/*   表名称 = tenant_capacity   */
/******************************************/
CREATE TABLE `tenant_capacity` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `tenant_id` varchar(128) NOT NULL DEFAULT '' COMMENT 'Tenant ID',
  `quota` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '配额，0表示使用默认值',
  `usage` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '使用量',
  `max_size` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '单个配置大小上限，单位为字节，0表示使用默认值',
  `max_aggr_count` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '聚合子配置最大个数',
  `max_aggr_size` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '单个聚合数据的子配置大小上限，单位为字节，0表示使用默认值',
  `max_history_count` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '最大变更历史数量',
  `gmt_create` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `gmt_modified` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '修改时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_tenant_id` (`tenant_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='租户容量信息表';


CREATE TABLE `tenant_info` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT 'id',
  `kp` varchar(128) NOT NULL COMMENT 'kp',
  `tenant_id` varchar(128) default '' COMMENT 'tenant_id',
  `tenant_name` varchar(128) default '' COMMENT 'tenant_name',
  `tenant_desc` varchar(256) DEFAULT NULL COMMENT 'tenant_desc',
  `create_source` varchar(32) DEFAULT NULL COMMENT 'create_source',
  `gmt_create` bigint(20) NOT NULL COMMENT '创建时间',
  `gmt_modified` bigint(20) NOT NULL COMMENT '修改时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_tenant_info_kptenantid` (`kp`,`tenant_id`),
  KEY `idx_tenant_id` (`tenant_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='tenant_info';

CREATE TABLE `users` (
	`username` varchar(50) NOT NULL PRIMARY KEY,
	`password` varchar(500) NOT NULL,
	`enabled` boolean NOT NULL
);

CREATE TABLE `roles` (
	`username` varchar(50) NOT NULL,
	`role` varchar(50) NOT NULL,
	UNIQUE INDEX `idx_user_role` (`username` ASC, `role` ASC) USING BTREE
);

CREATE TABLE `permissions` (
    `role` varchar(50) NOT NULL,
    `resource` varchar(255) NOT NULL,
    `action` varchar(8) NOT NULL,
    UNIQUE INDEX `uk_role_permission` (`role`,`resource`,`action`) USING BTREE
);

INSERT INTO users (username, password, enabled) VALUES ('nacos', '$2a$10$EuWPZHzz32dJN7jexM34MOeYirDdFAZm2kuWj7VEOJhhZkDrxfvUu', TRUE);

INSERT INTO roles (username, role) VALUES ('nacos', 'ROLE_ADMIN');

```



###### 修改配置文件

在 `nacos\conf` 目录下找到 `application.properties` 文件，文件末尾添加如下内容：

```properties
spring.datasource.platform=mysql
 
db.num=1
db.url.0=jdbc:mysql://127.0.0.1:3306/nacos_config?characterEncoding=utf8&connectTimeout=1000&socketTimeout=3000&autoReconnect=true
db.user=root
db.password=1234
```

重新启动 `Nacos`，可以看到是个全新的空记录界面，以前是记录进 `derby`，现在记录进 `MySQL`，因为目前 `MySql` 中的没有记录，所有 `Nacos` 没有显示配置。



#### Linux 版 Nacos + MySQL 生产环境配置

MySQL 环境自己下。

##### 安装 Nacos

https://github.com/alibaba/nacos/releases/tag/1.4.2

-   `mkdir /opt/nacos` 创建一个存放安装包的目录
-   `cd /opt/nacos` 进入目录
-   `tar -zxf nacos-server-1.4.2.tar.gz ` 进行解压
-   `mv nacos /usr/local/` 移动解压后的文件夹



##### 切换数据库

-   `systemctl start mysqld.service` 启动 MySQL

-   `mysql -u root -p` 进入 MySQL 命令行，输入密码登录

-   `create database nacos_config;` 创建数据库

-   `use nacos_config` 切换数据库

-   `source /usr/local/nacos/conf/nacos-mysql.sql` 执行 SQL 脚本

    ![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081127481.png)

-   `cd /usr/local/nacos/conf`

-   ` cp application.properties application.properties.bak` 进行备份

-   `vim application.properties` 修改配置，复制下面内容到文件末尾

    ```properties
    spring.datasource.platform=mysql
     
    db.num=1
    db.url.0=jdbc:mysql://127.0.0.1:3306/nacos_config?characterEncoding=utf8&connectTimeout=1000&socketTimeout=3000&autoReconnect=true
    db.user=root
    db.password=1234
    ```

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081127124.png)
![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081127726.png)


##### Nacos 集群配置

-   `cp cluster.conf.example cluster.conf` 备份

-   `vim cluster.conf` 进行集群配置，告诉 Nacos 当前集群中的成员 `ip地址:端口号` 尽量不要写 `127.0.0.1`

    ```sh
    # 里面只有这些内容
    192.168.200.130:3333
    192.168.200.130:4444
    192.168.200.130:5555
    ```

    ![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081133161.png)

-   `cd ../bin/` 切换到 bin 目录

-   `cp startup.sh startup.sh.bak` 备份

-   `vim startup.sh`

    大致在中间

    ![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081133227.png)

    末尾

    ![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081133530.png)

-   `cd ../conf` 切换目录

-   `vim cluster.conf` 

    ```conf
    192.168.200.130:3333
    192.168.200.130:4444
    192.168.200.130:5555
    ```

    ![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081133537.png)



##### Nginx 配置

-   `cd /usr/local/nginx/conf/` 切换目录

-   `vim nginx.conf` 

    http 块中增加配置

    ![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081133238.png)



##### 测试

-   `cd /usr/local/nacos/bin/` 切换目录

-   `./startup.sh -t 3333`、`./startup.sh -t 4444`、`./startup.sh -t 5555` 启动 Nacos 集群

-   `cd /usr/local/nginx/sbin/` 切换目录

-   `./nginx ` 启动 Nginx

-   浏览器访问 http://192.168.200.130:1111/nacos/#/login

    ![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081134641.png)





<hr/>

## SpringCloud Alibaba Sentinel实现熔断与限流

### 概述

>   官网

https://github.com/alibaba/Sentinel/wiki/%E4%BB%8B%E7%BB%8D

>   是什么

一句话解释，之前我们讲解过的Hystrix

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081134966.png)

>   下载地址

https://github.com/alibaba/Sentinel/releases

下载到本地 `sentinel-dashboard-1.7.0.jar`

>   官方文档

https://spring-cloud-alibaba-group.github.io/github-pages/greenwich/spring-cloud-alibaba.html#_spring_cloud_alibaba_sentinel



### 安装 Sentinel 控制台

>   Sentinel 分为两个部分

-   核心库（Java 客户端）不依赖任何框架/库，能够运行于所有 Java 运行时环境，同时对 Dubbo / Spring Cloud 等框架也有较好的支持。
-   控制台（Dashboard）基于 Spring Boot 开发，打包后可以直接运行，不需要额外的 Tomcat 等应用容器。



>   运行

java8环境 + 8080端口

命令：`java -jar sentinel-dashboard-1.8.1.jar`

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081134243.png)



>   访问 sentinel 管理界面

访问 http://localhost:8080，账号密码均为 `sentinel`

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081134882.png)



### 初始化演示工程

>   启动 Windows 下的 Nacos

`startup.cmd -m standalone`



#### 创建 Sentinel 微服务

##### 新建 Module

`cloudalibaba-sentinel-service8401`



##### POM

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <parent>
        <artifactId>springcloud</artifactId>
        <groupId>org.hong</groupId>
        <version>1.0-SNAPSHOT</version>
    </parent>
    <modelVersion>4.0.0</modelVersion>

    <artifactId>cloudalibaba-sentinel-service8401</artifactId>

    <dependencies>
        <!--SpringCloud ailibaba nacos -->
        <dependency>
            <groupId>com.alibaba.cloud</groupId>
            <artifactId>spring-cloud-starter-alibaba-nacos-discovery</artifactId>
        </dependency>
        <!--SpringCloud ailibaba sentinel-datasource-nacos 后续做持久化用到-->
        <dependency>
            <groupId>com.alibaba.csp</groupId>
            <artifactId>sentinel-datasource-nacos</artifactId>
        </dependency>
        <!--SpringCloud ailibaba sentinel -->
        <dependency>
            <groupId>com.alibaba.cloud</groupId>
            <artifactId>spring-cloud-starter-alibaba-sentinel</artifactId>
        </dependency>
        <!--openfeign-->
        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-starter-openfeign</artifactId>
        </dependency>
        <!-- SpringBoot整合Web组件+actuator -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-actuator</artifactId>
        </dependency>
        <!--日常通用jar包配置-->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-devtools</artifactId>
            <scope>runtime</scope>
            <optional>true</optional>
        </dependency>
        <dependency>
            <groupId>cn.hutool</groupId>
            <artifactId>hutool-all</artifactId>
            <version>4.6.3</version>
        </dependency>
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <optional>true</optional>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
        <dependency>
            <groupId>org.hong</groupId>
            <artifactId>cloud-api-commons</artifactId>
            <version>${project.version}</version>
        </dependency>
    </dependencies>

</project>
```



##### YAML

```yaml
server:
  port: 8401

spring:
  application:
    name: cloudalibaba-sentinel-service
  cloud:
    nacos:
      discovery:
        #Nacos服务注册中心地址
        server-addr: localhost:8848
    sentinel:
      transport:
        #配置Sentinel dashboard地址
        dashboard: localhost:8080
        #默认8719端口，假如被占用会自动从8719开始依次+1扫描,直至找到未被占用的端口
        port: 8719

management:
  endpoints:
    web:
      exposure:
        include: '*'
```



##### 主启动

```java
package org.hong.springcloudalibaba;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication
@EnableDiscoveryClient
public class MainApp8401 {
    public static void main(String[] args) {
        SpringApplication.run(MainApp8401.class, args);
    }
}
```



##### 业务类

```java
package org.hong.springcloudalibaba.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class FlowLimitController {
    @GetMapping("/testA")
    public String testA() {
        return "------testA";
    }

    @GetMapping("/testB")
    public String testB() {
        return "------testB";
    }
}
```



#### 启动微服务8401

##### 查看 Sentinel 监控页

空空如也，什么都没有，因为 Sentinel 采用的是懒加载的机制

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081134879.png)



##### Sentinel 懒加载

项目第一次启动不会被立即加载到 Sentinel 中，需要进行一次访问才会被注册进去。http://localhost:8401/testA

>   效果

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081134276.png)



### 流控规则

#### 基本介绍

**流量控制**（flow control），其原理是监控应用流量的 QPS 或并发线程数等指标，当达到指定的阈值时对流量进行控制，以避免被瞬时的流量高峰冲垮，从而保障应用的高可用性。

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081135551.png)

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081136131.png)



#### 流控模式

##### 直接

###### QPS 的流量控制

表示1秒钟内查询1次就是OK，若超过次数1，就直接-快速失败，报默认错误

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081136762.png)

>   测试

快速点击访问 http://localhost:8401/testA

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081136116.png)
>   思考

直接调用默认报错信息，技术方面OK，but 是否应该有我们自己的后续处理?



###### 线程数的流量控制

从 QPS 修改为线程数。

同一时间处理的线程数超过1个，直接失败。

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081136064.png)

>   修改 Controller

```java
@GetMapping("/testA")
public String testA() throws InterruptedException {
    Thread.sleep(800);
    return "------testA";
}
```

>   重启8401，快速访问 http://localhost:8401/testA

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081136072.png)

##### 关联

>   概述

当与A关联的资源B达到阀值后，就限流A自己；场景：支付接口有大量请求，限流订单接口。

###### 操作

当关联资源 `/testB` 的 QPS 阀值超过1时，就限流 `/testA` 的 `Rest` 访问地址，<span style='color: red;'>**当关联资源到阈值后限制配置好的资源名**</span>

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081136870.png)



###### 测试

恢复 `/testA` 方法。

>   Postman 模拟并发访问 testB

创建一个请求，自测 testB。再点击右下角的 `Runner`

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081136714.png)

20 个线程每 0.3 秒 进行一次请求

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081136562.png)

浏览器访问 http://localhost:8401/testA

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081136022.png)



#### 流控效果

>   修改 Controller

```java
package org.hong.springcloudalibaba.controller;

import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Slf4j
public class FlowLimitController {
    @GetMapping("/testA")
    public String testA() {
        return "------testA";
    }

    @GetMapping("/testB")
    public String testB() {
        log.info(Thread.currentThread().getName());
        return "------testB";
    }
}
```

##### 快速失败

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081136665.png)



##### 预热

>   简介

当流量突然增大的时候，我们常常会希望系统从空闲状态到繁忙状态的切换的时间长一些。即如果系统在此之前长期处于空闲的状态，我们希望处理请求的数量是缓步的增多，经过预期的时间以后，到达系统处理请求个数的最大值。Warm Up（冷启动，预热）模式就是为了实现这个目的的。

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081136484.png)
>   公式

默认 `coldFactor` 为 3，即请求 QPS 从 `threshold / 3` 开始，经预热时长逐渐升至设定的 QPS 阈值。

>   配置

案例：阀值为10 + 预热时长设置5秒。
`系统初始化的阀值为10 / 3 约等于3`，`即阀值刚开始为3`；`然后过了5秒后阀值才慢慢升高恢复到10`

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081137486.png)

>   测试

刚开始多次访问 http://localhost:8401/testB，如果阈值达到3以上失败，5秒后阈值变为10



##### 匀速排队

>   官网

https://github.com/alibaba/Sentinel/wiki/%E6%B5%81%E9%87%8F%E6%8E%A7%E5%88%B6

匀速排队（`RuleConstant.CONTROL_BEHAVIOR_RATE_LIMITER`）方式会严格控制请求通过的间隔时间，也即是让请求以均匀的速度通过，对应的是漏桶算法。

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081137249.png)

>   配置

匀速排队，让请求以均匀的速度通过，阀值类型必须设成QPS，否则无效。
设置含义：`/testB` 每秒1次请求，超过的话就排队等待，等待的超时时间为2000毫秒。

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081137070.png)

>   测试

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081137118.png)

结果：虽然我们 Postman 0.2 秒发起一次请求，由于我们设置了阈值为1，最后 Postman 还是1秒发送一个请求

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081137241.png)



### 降级规则

#### 官网

https://github.com/alibaba/Sentinel/wiki/%E7%86%94%E6%96%AD%E9%99%8D%E7%BA%A7

>   概述

除了流量控制以外，对调用链路中不稳定的资源进行熔断降级也是保障高可用的重要措施之一。一个服务常常会调用别的模块，可能是另外的一个远程服务、数据库，或者第三方 API 等。例如，支付的时候，可能需要远程调用银联提供的 API；查询某个商品的价格，可能需要进行数据库查询。然而，这个被依赖服务的稳定性是不能保证的。如果依赖的服务出现了不稳定的情况，请求的响应时间变长，那么调用服务的方法的响应时间也会变长，线程会产生堆积，最终可能耗尽业务自身的线程池，服务本身也变得不可用。

>   **注意**：本文档针对 Sentinel 1.8.0 及以上版本。1.8.0 版本对熔断降级特性进行了全新的改进升级，请使用最新版本以更好地利用熔断降级的能力。



#### 熔断策略

Sentinel 提供以下几种熔断策略：

-   **慢调用比例 (`SLOW_REQUEST_RATIO`)**：选择以慢调用比例作为阈值，需要设置允许的慢调用 RT（即最大的响应时间），请求的响应时间大于该值则统计为慢调用。当单位统计时长（`statIntervalMs`）内请求数目大于设置的最小请求数目，并且慢调用的比例大于阈值，则接下来的熔断时长内请求会自动被熔断。经过熔断时长后熔断器会进入探测恢复状态（HALF-OPEN 状态），若接下来的一个请求响应时间小于设置的慢调用 RT 则结束熔断，若大于设置的慢调用 RT 则会再次被熔断。
-   **异常比例 (`ERROR_RATIO`)**：当单位统计时长（`statIntervalMs`）内请求数目大于设置的最小请求数目，并且异常的比例大于阈值，则接下来的熔断时长内请求会自动被熔断。经过熔断时长后熔断器会进入探测恢复状态（HALF-OPEN 状态），若接下来的一个请求成功完成（没有错误）则结束熔断，否则会再次被熔断。异常比率的阈值范围是 `[0.0, 1.0]`，代表 0% - 100%。
-   **异常数 (`ERROR_COUNT`)**：当单位统计时长内的异常数目超过阈值之后会自动进行熔断。经过熔断时长后熔断器会进入探测恢复状态（HALF-OPEN 状态），若接下来的一个请求成功完成（没有错误）则结束熔断，否则会再次被熔断。

<span style='color: red;'>注意异常降级**仅针对业务异常**，对 Sentinel 限流降级本身的异常（`BlockException`）不生效。</span>



#### 慢调用比例

>   Controller

```java
package org.hong.springcloudalibaba.controller;

import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Slf4j
public class FlowLimitController {
    @GetMapping("/testA")
    public String testA() throws InterruptedException {
        log.info(Thread.currentThread().getName());
        Thread.sleep(1000);
        return "------testA";
    }

    @GetMapping("/testB")
    public String testB() {
        log.info(Thread.currentThread().getName());
        return "------testB";
    }
}
```

>   配置

1秒中内请求达到5个，并且响应时长大于500毫秒的请求数量为30%，触发熔断

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081137750.png)

>   jmeter 压测

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081137451.png)

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081137009.png)

>   访问 http://localhost:8401/testA

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081137645.png)

>   结果

触发熔断后，后续的请求不会进入方法中，直接失败。

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081137577.png)



#### 异常比例

>   Controller

```java
@GetMapping("/testC")
public String testC() {
    int a = 10 / 0;
    log.info(Thread.currentThread().getName());
    return "------testC";
}
```

>   配置

1秒中内请求达到5个，并且请求异常比例达到30%，触发熔断

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081137108.png)

>   jmeter 压测

修改之前的 jmeter 配置的请求路径，再运行

>   访问 http://localhost:8401/testC

触发熔断后不再进入 Controller，直接失败，没有出现500的页面

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081137708.png)


#### 异常数

依旧使用 `/testD`

>   配置

1秒中内请求达到5个，并且请求异常数量 >= 2，触发熔断

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081138899.png)

>   jmeter 压测

运行之前的 jmeter 测试

>   访问 http://localhost:8401/testC

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081138233.png)



### 热点 key 限流

#### Controller

```java
@GetMapping("/testD")
@SentinelResource("testD")
public String testD(@RequestParam(value = "key1", required = false) String key1,
                    @RequestParam(value = "key2", required = false) String key2){
    return "------testD";
}
```



#### 配置

访问资源 `testD`，并且该资源对应的 `Controller` 方法的第 `0个参数(下标从0开始)` 不为 `null` 的情况下，该资源1秒只能访问1次。

**<span style='color: red;'>注意：这里的资源不再对应 `Controller` 方法的路径了 ( 我也感觉奇怪 )，就算不写@SentinelResource注解也不对应 `Controller` 方法的路径</span>**

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081138331.png)



#### 测试

>   多次访问 http://localhost:8401/testD?key1=1&key2=2

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081138356.png)

>   多次访问 http://localhost:8401/testD?key2=1&key1=2，参数调用位置访问

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081138771.png)

>   多次访问 http://localhost:8401/testD?key2=1，不携带参数key1

无论多少次都OK



##### 结论

热点 key 限流关注的是资源对应的 `Controller` 方法形参列表的索引有关，与浏览器访问时携带的索引无关。

因此 Rest 风格使用也一样。



#### 自定义错误方法

之前每次热点 key 被限流后，浏览器直接显示 500 页面，不友好，能不能让我们自定义错误方法呢？

>   Controller

```java
@GetMapping("/testD")
@SentinelResource(value = "testD", blockHandler = "testDBlockHandler")// blockHandler: 定义出现BlockException后执行的兜底方法
public String testD(@RequestParam(value = "key1", required = false) String key1,
                    @RequestParam(value = "key2", required = false) String key2){
    return "------testD";
}
public String testDBlockHandler(String key1, String key2, BlockException e){
    return "------testD /(ㄒoㄒ)/~~";
}
```

>   多次访问 http://localhost:8401/testD?key1=1&key2=2

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081138067.png)

**<span style='color: red;'>注意：`blockHandler` 只能处理 `Sentinel` 控制台配置的违规情况，其他的管不到。</span>**



##### 测试 RunTimeException

>   Controller

```java
@GetMapping("/testD")
@SentinelResource(value = "testD", blockHandler = "tetsDBlockHandler")
public String testD(@RequestParam(value = "key1", required = false) String key1,
                    @RequestParam(value = "key2", required = false) String key2){
    int a = 10 /0;
    return "------testD";
}
public String tetsDBlockHandler(String key1, String key2, BlockException e){
    return "------testD /(ㄒoㄒ)/~~";
}
```

>   多次访问 http://localhost:8401/testD

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081139668.png)



#### 参数例外项

我们可以在热点 key 限流的基础上指定 key 为特定值的时候，它的限流与其他的不一样。

>   配置

最后记得点击 `添加` 按钮！

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081139915.png)

>   注意

参数类型是能设置 `String` 和基本数据类型

>   结果

当访问 http://localhost:8401/testD?key1=5&key2=2，即 `key1=5` 时，阈值为10。 



### 系统规则

>   官网

https://github.com/alibaba/Sentinel/wiki/%E7%B3%BB%E7%BB%9F%E8%87%AA%E9%80%82%E5%BA%94%E9%99%90%E6%B5%81

#### 概述

系统保护规则是从应用级别的入口流量进行控制，从单台机器的 load、CPU 使用率、平均 RT、入口 QPS 和并发线程数等几个维度监控应用指标，让系统尽可能跑在最大吞吐量的同时保证系统整体的稳定性。

系统保护规则是应用整体维度的，而不是资源维度的，并且**仅对入口流量生效**。入口流量指的是进入应用的流量（`EntryType.IN`），比如 Web 服务或 Dubbo 服务端接收的请求，都属于入口流量。

系统规则支持以下的模式：

-   **Load 自适应**（仅对 Linux/Unix-like 机器生效）：系统的 load1 作为启发指标，进行自适应系统保护。当系统 load1 超过设定的启发值，且系统当前的并发线程数超过估算的系统容量时才会触发系统保护（BBR 阶段）。系统容量由系统的 `maxQps * minRt` 估算得出。设定参考值一般是 `CPU cores * 2.5`。
-   **CPU usage**（1.5.0+ 版本）：当系统 CPU 使用率超过阈值即触发系统保护（取值范围 0.0-1.0），比较灵敏。
-   **平均 RT**：当单台机器上所有入口流量的平均 RT 达到阈值即触发系统保护，单位是毫秒。
-   **并发线程数**：当单台机器上所有入口流量的并发线程数达到阈值即触发系统保护。
-   **入口 QPS**：当单台机器上所有入口流量的 QPS 达到阈值即触发系统保护。



#### 配置

整个单台及其1秒只能进入1个请求

为了演示效果才配的 `入口 QPS`；如果要配推荐配 `CPU 使用率`，这个挺不错的。

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081139697.png)

>   多次访问 http://localhost:8401/testB

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081140942.png)



### @SentinelResource

通常我们在对映射请求路径时都会使用 Rest 风格，Rest 风格不好对应资源名，因此推荐使用 `@SentinelResource`。

#### 官网概述

**@SentinelResource 注解**

>   注意：注解方式埋点不支持 private 方法。

`@SentinelResource` 用于定义资源，并提供可选的异常处理和 fallback 配置项。 `@SentinelResource` 注解包含以下属性：

-   `value`：资源名称，必需项（不能为空）
-   `entryType`：entry 类型，可选项（默认为 `EntryType.OUT`）
-   `blockHandler` / `blockHandlerClass`: `blockHandler` 对应处理 `BlockException` 的函数名称，可选项。blockHandler 函数访问范围需要是 `public`，返回类型需要与原方法相匹配，参数类型需要和原方法相匹配并且最后加一个额外的参数，类型为 `BlockException`。blockHandler 函数默认需要和原方法在同一个类中。若希望使用其他类的函数，则可以指定 `blockHandlerClass` 为对应的类的 `Class` 对象，注意对应的函数必需为 static 函数，否则无法解析。
-   `fallback` / `fallbackClass`：`fallback` 函数名称，可选项，用于在抛出异常的时候提供 fallback 处理逻辑。fallback 函数可以针对所有类型的异常（除了 `exceptionsToIgnore` 里面排除掉的异常类型）进行处理。fallback 函数签名和位置要求：
    -   返回值类型必须与原函数返回值类型一致；
    -   方法参数列表需要和原函数一致，或者可以额外多一个 `Throwable` 类型的参数用于接收对应的异常。
    -   fallback 函数默认需要和原方法在同一个类中。若希望使用其他类的函数，则可以指定 `fallbackClass` 为对应的类的 `Class` 对象，注意对应的函数必需为 static 函数，否则无法解析。
-   `defaultFallback`（since 1.6.0）：默认的 fallback 函数名称，可选项，通常用于通用的 fallback 逻辑（即可以用于很多服务或方法）。默认 fallback 函数可以针对所有类型的异常（除了 `exceptionsToIgnore` 里面排除掉的异常类型）进行处理。若同时配置了 fallback 和 defaultFallback，则只有 fallback 会生效。defaultFallback 函数签名要求：
    -   返回值类型必须与原函数返回值类型一致；
    -   方法参数列表需要为空，或者可以额外多一个 `Throwable` 类型的参数用于接收对应的异常。
    -   defaultFallback 函数默认需要和原方法在同一个类中。若希望使用其他类的函数，则可以指定 `fallbackClass` 为对应的类的 `Class` 对象，注意对应的函数必需为 static 函数，否则无法解析。
-   `exceptionsToIgnore`（since 1.6.0）：用于指定哪些异常被排除掉，不会计入异常统计中，也不会进入 fallback 逻辑中，而是会原样抛出。

1.8.0 版本开始，`defaultFallback` 支持在类级别进行配置。

>   注：1.6.0 之前的版本 fallback 函数只针对降级异常（`DegradeException`）进行处理，**不能针对业务异常进行处理**。

特别地，若 blockHandler 和 fallback 都进行了配置，则被限流降级而抛出 `BlockException` 时只会进入 `blockHandler` 处理逻辑。若未配置 `blockHandler`、`fallback` 和 `defaultFallback`，则被限流降级时会将 `BlockException` **直接抛出**（若方法本身未定义 throws BlockException 则会被 JVM 包装一层 `UndeclaredThrowableException`）。



#### 按资源名称限流+后续处理

##### RateLimitController

```java
package org.hong.springcloudalibaba.controller;

import com.alibaba.csp.sentinel.annotation.SentinelResource;
import com.alibaba.csp.sentinel.slots.block.BlockException;
import org.hong.springcloud.entity.CommonResult;
import org.hong.springcloud.entity.Payment;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class RateLimitController {
    @GetMapping("/byResource")
    @SentinelResource(value = "byResource", blockHandler = "handleException")
    public CommonResult byResource() {
        return new CommonResult(200, "按资源名称限流测试OK", new Payment(2020L, "serial001"));
    }

    public CommonResult handleException(BlockException exception) {
        return new CommonResult(444, exception.getClass().getCanonicalName() + "\t 服务不可用");
    }
}
```

##### 配置

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081141053.png)

##### 测试

多次访问 http://localhost:8401/byResource

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081141763.png)

**<span style='color: red;'>使用资源名配置，`Sentinel` 默认的兜底方法将会失效。</span>**



#### 按照Url地址限流+后续处理

##### RateLimitController

```java
@GetMapping("/rateLimit/byUrl")
@SentinelResource(value = "byUrl", blockHandler = "handleException")
public CommonResult byUrl() {
        return new CommonResult(200,"按url限流测试OK",new Payment(2020L,"serial002"));
}
```

##### 配置

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081141450.png)

##### 测试

多次访问 http://localhost:8401/rateLimit/byUrl

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081141716.png)

**<span style='color: red;'>使用 Url 配置限流，`@SentinelResource` 注解配置的兜底方法将失效</span>**



#### 自定义兜底方法面临的问题

1.  系统默认的，没有体现我们自己的业务要求。
2.  依照现有条件，我们自定义的处理方法又和业务代码耦合在一块，不直观。
3.  每个业务方法都添加一个兜底的，那代码膨胀加剧。
4.  全局统一的处理方法没有体现。



#### 客户自定义限流处理逻辑

##### 创建 CustomerBlockHandler 类用于自定义限流处理逻辑

```java
package org.hong.springcloudalibaba.myhandler;

import com.alibaba.csp.sentinel.slots.block.BlockException;
import org.hong.springcloud.entity.CommonResult;

public class CustomerBlockHandler {
    public static CommonResult handleException(BlockException blockException){
        return new CommonResult(2020,"自定义的限流处理信息......CustomerBlockHandler");
    }
}
```



##### RateLimitController

```java
@GetMapping("/rateLimit/customerBlockHandler")
/*
 * value: 设置资源名
 * blockHandlerClass: 设置兜底方法来自哪个类
 * blockHandler: 设置兜底方法名
 */
@SentinelResource(value = "customerBlockHandler",
        blockHandlerClass = CustomerBlockHandler.class,
        blockHandler = "handleException")
public CommonResult customerBlockHandler() {
    return new CommonResult(200,"按客户自定义限流处理逻辑");
}
```



##### Sentinel 控制台配置

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081141748.png)



##### 测试

多次访问 http://localhost:8401/rateLimit/customerBlockHandler

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081141228.png)



##### 进一步说明

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081141011.png)



### 服务熔断功能

`Sentinel` 整合 `Ribbon` + `OpenFeign` + `@SentinelResource 注解的 fallback 属性`

#### Ribbon 系列

##### 服务提供者 9003/9004

###### 创建 Module

新建 `cloudalibaba-provider-payment9003/9004` 两个一样的做法



###### POM

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <parent>
        <artifactId>springcloud</artifactId>
        <groupId>org.hong</groupId>
        <version>1.0-SNAPSHOT</version>
    </parent>
    <modelVersion>4.0.0</modelVersion>

    <artifactId>cloudalibaba-provider-payment9003</artifactId>

    <dependencies>
        <!--SpringCloud ailibaba nacos -->
        <dependency>
            <groupId>com.alibaba.cloud</groupId>
            <artifactId>spring-cloud-starter-alibaba-nacos-discovery</artifactId>
        </dependency>
        <dependency><!-- 引入自己定义的api通用包，可以使用Payment支付Entity -->
            <groupId>org.hong</groupId>
            <artifactId>cloud-api-commons</artifactId>
            <version>${project.version}</version>
        </dependency>
        <!-- SpringBoot整合Web组件 -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-actuator</artifactId>
        </dependency>
        <!--日常通用jar包配置-->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-devtools</artifactId>
            <scope>runtime</scope>
            <optional>true</optional>
        </dependency>
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <optional>true</optional>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
    </dependencies>

</project>
```



###### YAML

记得修改端口号

```yaml
server:
  port: 9003

spring:
  application:
    name: nacos-payment-provider
  cloud:
    nacos:
      discovery:
        server-addr: localhost:8848 #配置Nacos地址

management:
  endpoints:
    web:
      exposure:
        include: '*'
```



###### 主启动

```java
package org.hong.springcloudalibaba;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication
@EnableDiscoveryClient
public class PaymentMain9003 {
    public static void main(String[] args) {
        SpringApplication.run(PaymentMain9003.class, args);
    }
}
```



###### 业务类

>   PaymentController

```java
package org.hong.springcloudalibaba.controller;

import org.hong.springcloud.entity.CommonResult;
import org.hong.springcloud.entity.Payment;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;

@RestController
public class PaymentController {
    @Value("${server.port}")
    private String serverPort;

    public static HashMap<Long, Payment> hashMap = new HashMap<>();

    static {
        hashMap.put(1L, new Payment(1L, "28a8c1e3bc2742d8848569891fb42181"));
        hashMap.put(2L, new Payment(2L, "bba8c1e3bc2742d8848569891ac32182"));
        hashMap.put(3L, new Payment(3L, "6ua8c1e3bc2742d8848569891xt92183"));
    }

    @GetMapping(value = "/paymentSQL/{id}")
    public CommonResult<Payment> paymentSQL(@PathVariable("id") Long id) {
        Payment payment = hashMap.get(id);
        CommonResult<Payment> result = new CommonResult(200, "from mysql,serverPort:  " + serverPort, payment);
        return result;
    }

}
```



##### 服务消费者 84

###### 创建 Module

新建 `cloudalibaba-consumer-nacos-order84`



###### POM

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <parent>
        <artifactId>springcloud</artifactId>
        <groupId>org.hong</groupId>
        <version>1.0-SNAPSHOT</version>
    </parent>
    <modelVersion>4.0.0</modelVersion>

    <artifactId>cloudalibaba-consumer-nacos-order84</artifactId>

    <dependencies>
        <!--SpringCloud ailibaba nacos -->
        <dependency>
            <groupId>com.alibaba.cloud</groupId>
            <artifactId>spring-cloud-starter-alibaba-nacos-discovery</artifactId>
        </dependency>
        <!--SpringCloud ailibaba sentinel -->
        <dependency>
            <groupId>com.alibaba.cloud</groupId>
            <artifactId>spring-cloud-starter-alibaba-sentinel</artifactId>
        </dependency>
        <!-- 引入自己定义的api通用包，可以使用Payment支付Entity -->
        <dependency>
            <groupId>org.hong</groupId>
            <artifactId>cloud-api-commons</artifactId>
            <version>${project.version}</version>
        </dependency>
        <!-- SpringBoot整合Web组件 -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-actuator</artifactId>
        </dependency>
        <!--日常通用jar包配置-->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-devtools</artifactId>
            <scope>runtime</scope>
            <optional>true</optional>
        </dependency>
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <optional>true</optional>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
    </dependencies>

</project>
```



###### YAML

```yaml
server:
  port: 84

spring:
  application:
    name: nacos-order-consumer
  cloud:
    nacos:
      discovery:
        server-addr: localhost:8848
    sentinel:
      transport:
        #配置Sentinel dashboard地址
        dashboard: localhost:8080
        #默认8719端口，假如被占用会自动从8719开始依次+1扫描,直至找到未被占用的端口
        port: 8719

#消费者将要去访问的微服务名称(注册成功进nacos的微服务提供者)
service-url:
  nacos-user-service: http://nacos-payment-provider
 
```



###### 主启动

```java
package org.hong.springcloudalibaba;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication
@EnableDiscoveryClient
public class OrderNacosMain84 {
    public static void main(String[] args) {
        SpringApplication.run(OrderNacosMain84.class, args);
    }
}
```



###### ApplicationContextConfig

```java
package org.hong.springcloudalibaba.config;

import org.springframework.cloud.client.loadbalancer.LoadBalanced;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

@Configuration
public class ApplicationContextConfig {
    @Bean
    @LoadBalanced
    public RestTemplate getRestTemplate(){
        return new RestTemplate();
    }
}
```



###### 业务类

>   CircleBreakerController

```java
package org.hong.springcloudalibaba.controller;

import com.alibaba.csp.sentinel.annotation.SentinelResource;
import lombok.extern.slf4j.Slf4j;
import org.hong.springcloud.entity.CommonResult;
import org.hong.springcloud.entity.Payment;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

@RestController
@RequestMapping("/consumer")
@Slf4j
public class CircleBreakerController {
    public static final String SERVICE_URL = "http://nacos-payment-provider";

    @Autowired
    private RestTemplate restTemplate;

    @RequestMapping("/fallback/{id}")
    @SentinelResource(value = "fallback")
    public CommonResult<Payment> fallback(@PathVariable Long id) {
        CommonResult<Payment> result = restTemplate.getForObject(SERVICE_URL + "/paymentSQL/" + id, CommonResult.class, id);
        if (id == 4) {
            throw new IllegalArgumentException("IllegalArgumentException,非法参数异常....");
        } else if (result.getData() == null) {
            throw new NullPointerException("NullPointerException,该ID没有对应记录,空指针异常");
        }
        return result;
    }
}
```



##### 测试

访问 http://localhost:84/consumer/fallback/1，9003/9004 轮询出现即可。

访问 http://localhost:84/consumer/fallback/4、http://localhost:84/consumer/fallback/5，出现异常。

目的：给 `RunTimeException` 提供兜底方法



##### 只配置 fallback

**<span style='color: red;'>fallback 只处理运行时异常</span>**

###### Controller

```java
@RequestMapping("/fallback/{id}")
// @SentinelResource(value = "fallback")
@SentinelResource(value = "fallback", fallback = "handlerFallback")
public CommonResult<Payment> fallback(@PathVariable Long id) {
    CommonResult<Payment> result = restTemplate.getForObject(SERVICE_URL + "/paymentSQL/" + id, CommonResult.class, id);
    if (id == 4) {
        throw new IllegalArgumentException("IllegalArgumentException,非法参数异常....");
    } else if (result.getData() == null) {
        throw new NullPointerException("NullPointerException,该ID没有对应记录,空指针异常");
    }
    return result;
}
public CommonResult handlerFallback(@PathVariable  Long id, Throwable e) {
    Payment payment = new Payment(id,"null");
    return new CommonResult<>(444,"兜底异常handlerFallback,exception内容  " + e.getMessage(),payment);
}
```



###### 测试

访问 http://localhost:84/consumer/fallback/4

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081142743.png)



##### 只配置 blockHandler

**<span style='color: red;'>blockHandler 只处理配置违规</span>**

###### Controller

```java
@RequestMapping("/fallback/{id}")
// @SentinelResource(value = "fallback")
// @SentinelResource(value = "fallback", fallback = "handlerFallback")
@SentinelResource(value = "fallback", blockHandler = "blockHandler")
public CommonResult<Payment> fallback(@PathVariable Long id) {
    CommonResult<Payment> result = restTemplate.getForObject(SERVICE_URL + "/paymentSQL/" + id, CommonResult.class, id);
    if (id == 4) {
        throw new IllegalArgumentException("IllegalArgumentException,非法参数异常....");
    } else if (result.getData() == null) {
        throw new NullPointerException("NullPointerException,该ID没有对应记录,空指针异常");
    }
    return result;
}
public CommonResult blockHandler(@PathVariable  Long id, BlockException blockException) {
    Payment payment = new Payment(id,"null");
    return new CommonResult<>(445,"blockHandler-sentinel限流,无此流水: blockException  "+blockException.getMessage(),payment);
}
```



###### 配置

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081142943.png)



###### 测试

多次访问 http://localhost:84/consumer/fallback/1

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081142141.png)



##### fallback 和 blockHandler 都配置

###### Controller

```java
package org.hong.springcloudalibaba.controller;

import com.alibaba.csp.sentinel.annotation.SentinelResource;
import com.alibaba.csp.sentinel.slots.block.BlockException;
import lombok.extern.slf4j.Slf4j;
import org.hong.springcloud.entity.CommonResult;
import org.hong.springcloud.entity.Payment;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

@RestController
@RequestMapping("/consumer")
@Slf4j
public class CircleBreakerController {
    public static final String SERVICE_URL = "http://nacos-payment-provider";

    @Autowired
    private RestTemplate restTemplate;

    @RequestMapping("/fallback/{id}")
    // @SentinelResource(value = "fallback")
    // @SentinelResource(value = "fallback", fallback = "handlerFallback")
    // @SentinelResource(value = "fallback", blockHandler = "blockHandler")
    @SentinelResource(value = "fallback", blockHandler = "blockHandler", fallback = "handlerFallback")
    public CommonResult<Payment> fallback(@PathVariable Long id) {
        CommonResult<Payment> result = restTemplate.getForObject(SERVICE_URL + "/paymentSQL/" + id, CommonResult.class, id);
        if (id == 4) {
            throw new IllegalArgumentException("IllegalArgumentException,非法参数异常....");
        } else if (result.getData() == null) {
            throw new NullPointerException("NullPointerException,该ID没有对应记录,空指针异常");
        }
        return result;
    }
    public CommonResult handlerFallback(@PathVariable  Long id, Throwable e) {
        Payment payment = new Payment(id,"null");
        return new CommonResult<>(444,"兜底异常handlerFallback,exception内容  " + e.getMessage(),payment);
    }
    public CommonResult blockHandler(@PathVariable  Long id, BlockException blockException) {
        Payment payment = new Payment(id,"null");
        return new CommonResult<>(445,"blockHandler-sentinel限流,无此流水: blockException  "+blockException.getMessage(),payment);
    }
}
```



###### Sentinel 配置

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081142946.png)



###### 测试

访问 http://localhost:84/consumer/fallback/4

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081142722.png)

多次访问 http://localhost:84/consumer/fallback/1

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081143415.png)

**<span style='color: red;'>若 blockHandler 和 fallback 都进行了配置，则被限流降级而抛出 BlockException 时只会进入 blockHandler 处理逻辑。</span>**



#### Feign 系列

在 84 模块中添加 Feign

##### POM

```xml
<!--SpringCloud openfeign -->
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-openfeign</artifactId>
</dependency>
```



##### YAML

```yaml
# 激活Sentinel对Feign的支持
feign:
  sentinel:
    enabled: true 
```



##### 主启动

```java
package org.hong.springcloudalibaba;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableDiscoveryClient
@EnableFeignClients // 开启Feign
public class OrderNacosMain84 {
    public static void main(String[] args) {
        SpringApplication.run(OrderNacosMain84.class, args);
    }
}
```



##### 业务类

###### Service

```java
package org.hong.springcloudalibaba.service;

import org.hong.springcloud.entity.CommonResult;
import org.hong.springcloud.entity.Payment;
import org.hong.springcloudalibaba.service.serviceimpl.PaymentFallbackService;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(value = "nacos-payment-provider", fallback = PaymentFallbackService.class)
public interface PaymentService {
    @GetMapping(value = "/paymentSQL/{id}")
    CommonResult<Payment> paymentSQL(@PathVariable("id") Long id);
}
```



###### Service实现类

```java
package org.hong.springcloudalibaba.service.serviceimpl;

import org.hong.springcloud.entity.CommonResult;
import org.hong.springcloud.entity.Payment;
import org.hong.springcloudalibaba.service.PaymentService;
import org.springframework.stereotype.Service;

@Service
public class PaymentFallbackService implements PaymentService {
    @Override
    public CommonResult<Payment> paymentSQL(Long id) {
        return new CommonResult<>(444,"服务降级返回,没有该流水信息",new Payment(id, "errorSerial......"));
    }
}
```



###### Controller

```java
//==================OpenFeign
@Resource
private PaymentService paymentService;

@GetMapping(value = "/openfeign/{id}")
public CommonResult<Payment> paymentSQL(@PathVariable("id") Long id) {
    return paymentService.paymentSQL(id);
}
```



##### 测试

开启 Nacos、Sentinel、84服务，测试84服务远程调用 `nacos-payment-provider` 失败会不会触发 Feign 的兜底方法。

访问 http://localhost:84/consumer/openfeign/1

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081143247.png)



### 规则持久化

>   为什么要持久化

一旦我们重启应用，Sentinel 将消失，生产环境需要将配置规则进行持久化。

>   案例效果

将限流配置规则持久化进 Nacos 保存，只要刷新 8401 某个 rest 地址，Sentinel 控制台的流控规则就能看到，只要Nacos里面的配置不删除，针对 8401 上 Sentinel 上的流控规则持续有效



#### POM

```xml
<!--SpringCloud ailibaba sentinel-datasource-nacos 持久化-->
<dependency>
    <groupId>com.alibaba.csp</groupId>
    <artifactId>sentinel-datasource-nacos</artifactId>
</dependency>
```



#### YAML

```yaml
server:
  port: 8401

spring:
  application:
    name: cloudalibaba-sentinel-service
  cloud:
    nacos:
      discovery:
        #Nacos服务注册中心地址
        server-addr: localhost:8848
    sentinel:
      transport:
        #配置Sentinel dashboard地址
        dashboard: localhost:8080
        #默认8719端口，假如被占用会自动从8719开始依次+1扫描,直至找到未被占用的端口
        port: 8719
      ##############  新增  ###################
      datasource:
        # 名称随意, 可以配置多个
        flow:
          nacos: # 表明使用Nacos进行持久化
            server-addr: localhost:8848 # Nacos地址
            dataId: cloudalibaba-sentinel-service # 读取Nacos中的哪个dataId
            groupId: DEFAULT_GROUP # 指定组名
            data-type: json # 指定解析格式, 默认就时json
            rule-type: flow # 指定从Nacos中读取出来的配置以(限流、降级、热点...)进行解析
      ########################################

management:
  endpoints:
    web:
      exposure:
        include: '*'

```

##### rule-type 详解

`rule-type` 对应的一个枚举类 `com.alibaba.cloud.sentinel.datasource.RuleType` 表示配置的角色

```java
// 下面时部分常用的枚举对象, 在yaml中如何配置相关属性可以进入对应的xxxRule中进行查看
public enum RuleType {

   /**
    * flow: 限流
    */
   FLOW("flow", FlowRule.class),
   /**
    * degrade: 降级
    */
   DEGRADE("degrade", DegradeRule.class),
   /**
    * param flow: 热点key限流
    */
   PARAM_FLOW("param-flow", ParamFlowRule.class),
   /**
    * system: 系统规则
    */
   SYSTEM("system", SystemRule.class),
   /**
    * authority: 授权
    */
   AUTHORITY("authority", AuthorityRule.class)
       
}
```



#### Nacos 配置

json 串可以是一个集合，写多个配置

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081143731.png)

```json
[
    {
        "resource": "/rateLimit/byUrl",
        "limitApp": "default",
        "grade": 1,
        "count": 1,
        "strategy": 0,
        "controlBehavior": 0,
        "clusterMode": false
    },{
        "resource": "byResource",
        "limitApp": "default",
        "grade": 1,
        "count": 1,
        "strategy": 0,
        "controlBehavior": 0,
        "clusterMode": false
    }
]
```

##### flow 模式 json 串属性详解

```yaml
resource: 资源名称；
limitApp: 来源应用；
grade: 阈值类型，0表示线程数，1表示QPS；
count: 单机阈值；
strategy: 流控模式，0表示直接，1表示关联，2表示链路；
controlBehavior: 流控效果，0表

示快速失败，1表示Warm Up，2表示排队等待；
clusterMode: 是否集群。
```



#### 测试

启动 Nacos、Sentinel、8401服务，多次访问 http://localhost:8401/rateLimit/byUrl

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081143727.png)

观察 Sentinel 控制台，自动出现2个流控规则

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081143933.png)



<hr/>

## SpringCloud Alibaba Seata处理分布式事务

### Seata 概述

>   官网地址

http://seata.io/zh-cn

>   概述

Seata 是一款开源的分布式事务解决方案，致力于提供高性能和简单易用的分布式事务服务。



#### Seata 术语

**TC (Transaction Coordinator) - 事务协调者**

维护全局和分支事务的状态，驱动全局事务提交或回滚。

**TM (Transaction Manager) - 事务管理器**

定义全局事务的范围：开始全局事务、提交或回滚全局事务。

**RM (Resource Manager) - 资源管理器**

管理分支事务处理的资源，与 TC 交谈以注册分支事务和报告分支事务的状态，并驱动分支事务提交或回滚。

 

#### Seata 处理过程

1.  TM 向 TC 申请开启一个全局事务，全局事务创建成功并生成一个全局唯一的 XID。
2.  XID 在微服务调用链路的上下文中传播。
3.  RM 向 TC 注册分支事务，接着执行这个分支事务并提交（重点：RM在第一阶段就已经执行了本地事务的提交/回滚），最后将执行结果汇报给TC。
4.  TM 根据 TC 中所有的分支事务的执行情况，发起全局提交或回滚决议。
5.  TC 调度 XID 下管辖的全部分支事务完成提交或回滚请求。

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081143275.png)

>   为什么Seata在第一阶段就直接提交了分支事务？

 Seata能够在第一阶段直接提交事务，是因为 **Seata 框架为每一个 RM 维护了一张 UNDO_LOG 表（这张表需要客户端自行创建），其中保存了每一次本地事务的回滚数据**。因此，**二阶段的回滚并不依赖于本地数据库事务的回滚，而是RM直接读取这张UNDO_LOG表，并将数据库中的数据更新为UNDO_LOG中存储的历史数据。**

 **如果第二阶段是提交命令，那么RM事实上并不会对数据进行提交（因为一阶段已经提交了），而实发起一个异步请求删除UNDO_LOG中关于本事务的记录。**





### Seata-TC 事务协调者搭建

#### 下载地址

https://github.com/seata/seata/releases

下载版本：`seata-server-1.4.2`，这个就是 TC



#### 修改 file.conf 文件

将压缩包解压后进入 `conf` 目录，对 `file.conf` 文件进行修改

>   修改事务日志存储模式

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081144650.png)

>   修改数据库连接信息

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081144490.png)



#### 创建数据库

>   根据db信息创建数据库

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081144180.png)

>   建表

建表的脚本不在 Seata 文件夹中，需要在官网上找。

地址：https://github.com/seata/seata/tree/develop/script/server/db

```mysql
-- -------------------------------- The script used when storeMode is 'db' --------------------------------
-- the table to store GlobalSession data
CREATE TABLE IF NOT EXISTS `global_table`
(
    `xid`                       VARCHAR(128) NOT NULL,
    `transaction_id`            BIGINT,
    `status`                    TINYINT      NOT NULL,
    `application_id`            VARCHAR(32),
    `transaction_service_group` VARCHAR(32),
    `transaction_name`          VARCHAR(128),
    `timeout`                   INT,
    `begin_time`                BIGINT,
    `application_data`          VARCHAR(2000),
    `gmt_create`                DATETIME,
    `gmt_modified`              DATETIME,
    PRIMARY KEY (`xid`),
    KEY `idx_gmt_modified_status` (`gmt_modified`, `status`),
    KEY `idx_transaction_id` (`transaction_id`)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8;

-- the table to store BranchSession data
CREATE TABLE IF NOT EXISTS `branch_table`
(
    `branch_id`         BIGINT       NOT NULL,
    `xid`               VARCHAR(128) NOT NULL,
    `transaction_id`    BIGINT,
    `resource_group_id` VARCHAR(32),
    `resource_id`       VARCHAR(256),
    `branch_type`       VARCHAR(8),
    `status`            TINYINT,
    `client_id`         VARCHAR(64),
    `application_data`  VARCHAR(2000),
    `gmt_create`        DATETIME(6),
    `gmt_modified`      DATETIME(6),
    PRIMARY KEY (`branch_id`),
    KEY `idx_xid` (`xid`)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8;

-- the table to store lock data
CREATE TABLE IF NOT EXISTS `lock_table`
(
    `row_key`        VARCHAR(128) NOT NULL,
    `xid`            VARCHAR(128),
    `transaction_id` BIGINT,
    `branch_id`      BIGINT       NOT NULL,
    `resource_id`    VARCHAR(256),
    `table_name`     VARCHAR(32),
    `pk`             VARCHAR(36),
    `gmt_create`     DATETIME,
    `gmt_modified`   DATETIME,
    PRIMARY KEY (`row_key`),
    KEY `idx_branch_id` (`branch_id`)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8;
```



#### Nacos 创建命名空间

也可以不创建，直接放在 public 空间中也可以，非必要要求

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081144149.png)



#### 修改 registry.conf 文件

>   修改注册中心信息

设置 TC 启动后在 Nacos 的哪个命名空间等信息。不写命名空间，默认为 public

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081144393.png)

>   修改配置中心信息

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081144488.png)



#### 启动 Seata

>   先启动 Nacos

`startup.cmd -m standalone`

>   再启动 Seata

运行 `seata-server.bat` 文件

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081144168.png)



### 使用 Nacos 作为 Seata 的配置中心

下载 `nacos-config.sh` 和 `config.txt` https://github.com/seata/seata/tree/develop/script/config-center

`config.txt`：直接放在 `Seata` 解压的最外层目录中 `seata-server-1.4.2`。

`nacos-config.sh`：在 `Seata` 解压的最外层目录中创建 `script` 文件，放在里面

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081144611.png)



#### 修改 config.txt

分布式事务组可以定义一种全部使用一个，也可以每个微服务定义一个，前提保证后缀名一致。

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081144455.png)

选择 DB 模式，修改 DB 配置

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081144531.png)



#### 向 Nacos 推送配置

打开`git bash`或`linux`类命令行，执行sh脚本（注意脚本是否有执行的权限）

```shell
-h nacos地址, 默认本机
-p 端口, 默认8848
-t 命名空间不写默认public
-u 用户名
-p 密码

sh nacos-config.sh -t 422e91b9-5de2-4c7f-aff0-fd6bc3f2cae1
```

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081144507.png)



### 订单/库存/账户业务数据库准备

#### 分布式事务业务说明


这里我们会创建三个服务，一个订单服务，一个库存服务，一个账户服务。

当用户下单时，会在订单服务中创建一个订单，然后通过远程调用库存服务来扣减下单商品的库存，再通过远程调用账户服务来扣减用户账户里面的余额，最后在订单服务中修改订单状态为已完成。

该操作跨越三个数据库，有两次远程调用，很明显会有分布式事务问题。



#### 创建业务数据库

`seata_order`：存储订单的数据库；

`seata_storage`：存储库存的数据库；

`seata_account`：存储账户信息的数据库。

```mysql
CREATE DATABASE seata_order;
 
CREATE DATABASE seata_storage;
 
CREATE DATABASE seata_account;
```



#### 创建对应的业务表

>   `seata_order` 库下建 `t_order` 表

```mysql
CREATE TABLE t_order (
  `id` BIGINT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `user_id` BIGINT(11) DEFAULT NULL COMMENT '用户id',
  `product_id` BIGINT(11) DEFAULT NULL COMMENT '产品id',
  `count` INT(11) DEFAULT NULL COMMENT '数量',
  `money` DECIMAL(11,0) DEFAULT NULL COMMENT '金额',
  `status` INT(1) DEFAULT NULL COMMENT '订单状态：0：创建中；1：已完结' 
) ENGINE=INNODB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;
```

>   `seata_storage` 库下建 `t_storage `

```mysql
 CREATE TABLE t_storage (
 `id` BIGINT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
 `product_id` BIGINT(11) DEFAULT NULL COMMENT '产品id',
 `total` INT(11) DEFAULT NULL COMMENT '总库存',
 `used` INT(11) DEFAULT NULL COMMENT '已用库存',
 `residue` INT(11) DEFAULT NULL COMMENT '剩余库存'
) ENGINE=INNODB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;
 
 
INSERT INTO seata_storage.t_storage(`id`, `product_id`, `total`, `used`, `residue`)
VALUES ('1', '1', '100', '0', '100');
 
SELECT * FROM t_storage;
```

>   `seata_account` 库下建 `t_account `

```mysql
 CREATE TABLE t_account (
  `id` BIGINT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY COMMENT 'id',
  `user_id` BIGINT(11) DEFAULT NULL COMMENT '用户id',
  `total` DECIMAL(10,0) DEFAULT NULL COMMENT '总额度',
  `used` DECIMAL(10,0) DEFAULT NULL COMMENT '已用余额',
  `residue` DECIMAL(10,0) DEFAULT '0' COMMENT '剩余可用额度'
) ENGINE=INNODB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;
 
INSERT INTO seata_account.t_account(`id`, `user_id`, `total`, `used`, `residue`)  VALUES ('1', '1', '1000', '0', '1000');
 
SELECT * FROM t_account;
```



#### 创建日志回滚表

每个数据库中都运行下面的脚本。保存之前的数据，第二阶段回滚的依据。

```mysql
-- 注意此处0.3.0+ 增加唯一索引 ux_undo_log
CREATE TABLE `undo_log` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `branch_id` bigint(20) NOT NULL,
  `xid` varchar(100) NOT NULL,
  `context` varchar(128) NOT NULL,
  `rollback_info` longblob NOT NULL,
  `log_status` int(11) NOT NULL,
  `log_created` datetime NOT NULL,
  `log_modified` datetime NOT NULL,
  `ext` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ux_undo_log` (`xid`,`branch_id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;
```



### 创建 Maven 父工程

创建 `seata-parent-module`

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>2.1.4.RELEASE</version>
    </parent>
    <modelVersion>4.0.0</modelVersion>

    <groupId>org.hong</groupId>
    <artifactId>seata-parent-module</artifactId>
    <version>1.0-SNAPSHOT</version>

    <!-- 后面的模块聚合进来
 -->
    <modules>
        <module>../seata-order-service2001</module>
        <module>../seata-storage-service2002</module>
        <module>../seata-account-service2003</module>
        <module>../seata-api-commons</module>
    </modules>

    <!-- 父工程的打包方式应该为pom, 而不是jar或者war -->
    <packaging>pom</packaging>

    <properties>
        <java.version>1.8</java.version>
        <spring-cloud.version>Greenwich.SR1</spring-cloud.version>
        <spring-cloud-alibaba.version>2.1.0.RELEASE</spring-cloud-alibaba.version>
        <seata.version>1.4.2</seata.version>
        <lombok.version>1.18.8</lombok.version>
        <mybatis-plus.version>3.4.0</mybatis-plus.version>
    </properties>

    <dependencies>
        <!--seata-->
        <dependency>
            <groupId>com.alibaba.cloud</groupId>
            <artifactId>spring-cloud-starter-alibaba-seata</artifactId>
            <exclusions>
                <exclusion>
                    <artifactId>seata-all</artifactId>
                    <groupId>io.seata</groupId>
                </exclusion>
            </exclusions>
        </dependency>
        <dependency>
            <groupId>io.seata</groupId>
            <artifactId>seata-spring-boot-starter</artifactId>
            <version>${seata.version}</version>
        </dependency>
        <dependency>
            <groupId>io.seata</groupId>
            <artifactId>seata-all</artifactId>
            <version>${seata.version}</version>
        </dependency>
        <!--nacos-->
        <dependency>
            <groupId>com.alibaba.cloud</groupId>
            <artifactId>spring-cloud-starter-alibaba-nacos-discovery</artifactId>
        </dependency>
        <!--feign-->
        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-starter-openfeign</artifactId>
        </dependency>
        <!--mybatis-plus-->
        <dependency>
            <groupId>com.baomidou</groupId>
            <artifactId>mybatis-plus-boot-starter</artifactId>
            <version>${mybatis-plus.version}</version>
        </dependency>

        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-actuator</artifactId>
        </dependency>

        <dependency>
            <groupId>mysql</groupId>
            <artifactId>mysql-connector-java</artifactId>
            <version>5.1.49</version>
            <scope>runtime</scope>
        </dependency>

        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <optional>true</optional>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
        <dependency>
            <groupId>org.hong</groupId>
            <artifactId>seata-api-commons</artifactId>
            <version>1.0-SNAPSHOT</version>
        </dependency>
    </dependencies>

    <dependencyManagement>
        <dependencies>
            <!--Spring Cloud-->
            <dependency>
                <groupId>org.springframework.cloud</groupId>
                <artifactId>spring-cloud-dependencies</artifactId>
                <version>${spring-cloud.version}</version>
                <type>pom</type>
                <scope>import</scope>
            </dependency>
            <!--Spring Cloud Alibaba-->
            <dependency>
                <groupId>com.alibaba.cloud</groupId>
                <artifactId>spring-cloud-alibaba-dependencies</artifactId>
                <version>${spring-cloud-alibaba.version}</version>
                <type>pom</type>
                <scope>import</scope>
            </dependency>
            <!-- lombok -->
            <dependency>
                <groupId>org.projectlombok</groupId>
                <artifactId>lombok</artifactId>
                <version>${lombok.version}</version>
            </dependency>
        </dependencies>
    </dependencyManagement>

</project>
```



### 创建公共模块

创建 `seata-api-commons`，抽取实体类等...

#### POM

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">

    <modelVersion>4.0.0</modelVersion>

    <parent>
        <groupId>org.hong</groupId>
        <artifactId>seata-parent-module</artifactId>
        <version>1.0-SNAPSHOT</version>
    </parent>

    <artifactId>seata-api-commons</artifactId>

    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-devtools</artifactId>
            <scope>runtime</scope>
            <optional>true</optional>
        </dependency>
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <optional>true</optional>
        </dependency>
        <dependency>
            <groupId>cn.hutool</groupId>
            <artifactId>hutool-all</artifactId>
            <version>5.1.0</version>
        </dependency>
    </dependencies>

</project>
```



#### CommonResult 统一返回结果

```java
package org.hong.springcloudalibaba.domain;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CommonResult<T> {
    private Integer code;
    private String message;
    private T data;

    public CommonResult(Integer code, String message){
        this(code, message, null);
    }
}
```



#### Account 实体

```java
package org.hong.springcloudalibaba.domain;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Account {
    private Integer id;
    private Integer userId;
    private Integer total;
    private Integer used;
    private Double residue;
}
```



#### Order 实体

```java
package org.hong.springcloudalibaba.domain;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Order {
    private Integer id;
    private Integer userId;
    private Integer productId;
    private Integer count;
    private Double money;
    private Integer status;
}
```



#### Storage 实体

```java
package org.hong.springcloudalibaba.domain;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Storage {
    private Integer id;
    private Integer productId;
    private Integer total;
    private Double used;
    private Integer residue;
}
```



### 创建账户服务

创建 `seata-account-service2003`

#### POM

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <artifactId>seata-account-service2003</artifactId>

    <!-- 继承一个父工程 -->
    <parent>
        <artifactId>seata-parent-module</artifactId>
        <groupId>org.hong</groupId>
        <version>1.0-SNAPSHOT</version>
    </parent>

</project>
```

 

#### YAML

```yaml
server:
  port: 2003
spring:
  application:
    name: seata-account-service
  cloud:
    nacos:
      discovery:
        #nacos服务地址
        server-addr: 127.0.0.1:8848
        #nacos命名空间ID
        namespace: 422e91b9-5de2-4c7f-aff0-fd6bc3f2cae1
    alibaba:
      seata:
        #事务群组，要和下方vgroup-mapping保持一致（可以每个应用独立取名，也可以使用相同的名字），要在服务端config.txt中service.vgroup_mapping中存在,并且要保证多个群组情况下后缀名要保持一致[-group]
        tx-service-group: ${spring.application.name}-group

  datasource:
    driver-class-name: com.mysql.jdbc.Driver
    url: jdbc:mysql://127.0.0.1:3306/seata_account?serverTimezone=Asia/Shanghai&useUnicode=true&characterEncoding=utf-8&zeroDateTimeBehavior=convertToNull&useSSL=false&allowPublicKeyRetrieval=true
    username: root
    password: 1234

seata:
  application-id: ${spring.application.name}
  #事务群组（可以每个应用独立取名，也可以使用相同的名字），要与服务端nacos-config.txt中service.vgroup_mapping中存在,并且要保证多个群组情况下后缀名要保持一致[-group]
  service:
    vgroup-mapping:
      seata-account-service-group: default

  registry:
    type: nacos
    nacos:
      server-addr: ${spring.cloud.nacos.discovery.server-addr}
      username: nacos
      password: nacos
      #seata分组名称
      group: SEATA_GROUP
      #nacos命名空间ID
      namespace: 422e91b9-5de2-4c7f-aff0-fd6bc3f2cae1
      #seata服务名
      application: seata-server

  config:
    type: nacos
    nacos:
      server-addr: ${spring.cloud.nacos.discovery.server-addr}
      username: nacos
      password: nacos
      #seata分组名称
      group: SEATA_GROUP
      #nacos命名空间ID
      namespace: 422e91b9-5de2-4c7f-aff0-fd6bc3f2cae1



# feign组件超时设置，用于查看seata数据库中的临时数据内容
feign:
  client:
    config:
      default:
        connect-timeout: 30000
        read-timeout: 30000


mybatis-plus:
  mapper-locations: classpath:mapper/*.xml
  configuration:
    log-impl: org.apache.ibatis.logging.stdout.StdOutImpl
```



#### 主启动

```java
package org.hong.springcloudalibaba;

import io.seata.spring.annotation.datasource.EnableAutoDataSourceProxy;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableDiscoveryClient
@EnableFeignClients
@EnableAutoDataSourceProxy // 开启数据源自动代理
public class SeataAccountMainApp2003 {
    public static void main(String[] args) {
        SpringApplication.run(SeataAccountMainApp2003.class, args);
    }
}
```



#### AccountMapper 接口

```java
package org.hong.springcloudalibaba.mapper;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.hong.springcloudalibaba.domain.Account;

@Mapper
public interface AccountMapper {
    boolean save(Account account);

    boolean decrease(@Param("userId") int userId,
                     @Param("money") double money);

    Account getOne(int userId);
}
```



#### AccountMapper 配置文件

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper
        PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-mapper.dtd">

<mapper namespace="org.hong.springcloudalibaba.mapper.AccountMapper">

    <insert id="save" useGeneratedKeys="true" keyProperty="id" keyColumn="id">
        INSERT INTO
            T_ACCOUNT(user_id, total, used, residue)
        VALUES
            (#{userId}, #{total}, #{used}, #{residue})
    </insert>
    <update id="decrease">
        UPDATE
            T_ACCOUNT
        SET
            residue = residue - #{money},
            used = used + #{money}
        WHERE
            user_id = #{userId}
    </update>
    <select id="getOne" resultType="org.hong.springcloudalibaba.domain.Account">
        SELECT * FROM T_ACCOUNT WHERE user_id = #{userId}
    </select>
</mapper>
```



#### AccountService 接口

```java
package org.hong.springcloudalibaba.service;

import org.hong.springcloudalibaba.domain.Account;

public interface AccountService {
    boolean save(Account account);

    boolean decrease(int userId, double money);

    Account getOne(int userId);
}
```



#### AccountServiceImpl 实现类

```java
package org.hong.springcloudalibaba.service.serviceimpl;

import org.hong.springcloudalibaba.domain.Account;
import org.hong.springcloudalibaba.mapper.AccountMapper;
import org.hong.springcloudalibaba.service.AccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AccountServiceImpl implements AccountService {
    @Autowired
    private AccountMapper accountMapper;

    @Override
    public boolean save(Account order) {
        return accountMapper.save(order);
    }

    @Override
    public boolean decrease(int userId, double money) {
        Account one = this.getOne(userId);
        if(one.getResidue() < money){
            throw new RuntimeException("余额不足");
        }
        return accountMapper.decrease(userId, money);
    }

    @Override
    public Account getOne(int userId) {
        return accountMapper.getOne(userId);
    }
}
```



#### AccountController

```java
package org.hong.springcloudalibaba.controller;

import org.hong.springcloudalibaba.domain.Account;
import org.hong.springcloudalibaba.domain.CommonResult;
import org.hong.springcloudalibaba.domain.Storage;
import org.hong.springcloudalibaba.service.AccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/account")
public class AccountController {
    @Autowired
    private AccountService accountService;

    @PostMapping
    public CommonResult<Account> save(@RequestBody Account account){
        boolean result = accountService.save(account);
        if(result){
            return new CommonResult<>(200, "数据提交成功", account);
        }else{
            return new CommonResult<>(444, "数据提交失败", null);
        }
    }

    @PutMapping("/{userId}/{money}")
    public CommonResult<Storage> decrease(@PathVariable("userId") int userId,
                                          @PathVariable("money") double money){
        boolean result = accountService.decrease(userId, money);
        if(result){
            return new CommonResult<>(200, "数据提交成功", null);
        }else{
            return new CommonResult<>(444, "数据提交失败", null);
        }
    }
}
```



### 创建库存服务

#### POM

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <artifactId>seata-storage-service2002</artifactId>

    <parent>
        <artifactId>seata-parent-module</artifactId>
        <groupId>org.hong</groupId>
        <version>1.0-SNAPSHOT</version>
    </parent>

</project>
```



#### YAML

```yaml
server:
  port: 2002
spring:
  application:
    name: seata-storage-service
  cloud:
    nacos:
      discovery:
        #nacos服务地址
        server-addr: 127.0.0.1:8848
        #nacos命名空间ID
        namespace: 422e91b9-5de2-4c7f-aff0-fd6bc3f2cae1
    alibaba:
      seata:
        #事务群组，要和下方vgroup-mapping保持一致（可以每个应用独立取名，也可以使用相同的名字），要与服务端nacos-config.txt中service.vgroup_mapping中存在,并且要保证多个群组情况下后缀名要保持一致-group
        tx-service-group: ${spring.application.name}-group

  datasource:
    driver-class-name: com.mysql.jdbc.Driver
    url: jdbc:mysql://127.0.0.1:3306/seata_storage?serverTimezone=Asia/Shanghai&useUnicode=true&characterEncoding=utf-8&zeroDateTimeBehavior=convertToNull&useSSL=false&allowPublicKeyRetrieval=true
    username: root
    password: 1234

seata:
  application-id: ${spring.application.name}
  #事务群组（可以每个应用独立取名，也可以使用相同的名字），要与服务端nacos-config.txt中service.vgroup_mapping中存在,并且要保证多个群组情况下后缀名要保持一致-group
  service:
    vgroup-mapping:
      seata-storage-service-group: default

  registry:
    type: nacos
    nacos:
      server-addr: ${spring.cloud.nacos.discovery.server-addr}
      username: nacos
      password: nacos
      #seata分组名称
      group: SEATA_GROUP
      #nacos命名空间ID
      namespace: 422e91b9-5de2-4c7f-aff0-fd6bc3f2cae1
      #seata服务名
      application: seata-server

  config:
    type: nacos
    nacos:
      server-addr: ${spring.cloud.nacos.discovery.server-addr}
      username: nacos
      password: nacos
      #seata分组名称
      group: SEATA_GROUP
      #nacos命名空间ID
      namespace: 422e91b9-5de2-4c7f-aff0-fd6bc3f2cae1



# feign组件超时设置，用于查看seata数据库中的临时数据内容
feign:
  client:
    config:
      default:
        connect-timeout: 30000
        read-timeout: 30000


mybatis-plus:
  mapper-locations: classpath:mapper/*.xml
  configuration:
    log-impl: org.apache.ibatis.logging.stdout.StdOutImpl
```



#### 主启动

```java
package org.hong.springcloudalibaba;

import io.seata.spring.annotation.datasource.EnableAutoDataSourceProxy;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableDiscoveryClient
@EnableFeignClients
@EnableAutoDataSourceProxy
public class SeataStorageMainApp2002 {
    public static void main(String[] args) {
        SpringApplication.run(SeataStorageMainApp2002.class, args);
    }
}
```



#### StorageMapper 接口

```java
package org.hong.springcloudalibaba.mapper;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.hong.springcloudalibaba.domain.Storage;

@Mapper
public interface StorageMapper {
    boolean save(Storage storage);

    boolean decrease(@Param("productId") int productId,
                     @Param("count") int count);

    Storage getOne(int productId);
}
```



#### StorageMapper 配置文件

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper
        PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-mapper.dtd">

<mapper namespace="org.hong.springcloudalibaba.mapper.StorageMapper">
    <insert id="save" useGeneratedKeys="true" keyProperty="id" keyColumn="id">
        INSERT INTO
            T_STORAGE(product_id, total, used, residue)
        VALUES
            (#{productId}, #{total}, #{used}, #{residue})
    </insert>
    <update id="decrease">
        UPDATE
            t_storage
        SET
            residue = residue - #{count},
            used = used + #{count}
        WHERE
            product_id = #{productId}
    </update>
    <select id="getOne" resultType="org.hong.springcloudalibaba.domain.Storage">
        SELECT * FROM t_storage WHERE product_id = #{productId}
    </select>
</mapper>
```



#### StorageService 接口

```java
package org.hong.springcloudalibaba.service;

import org.hong.springcloudalibaba.domain.Storage;

public interface StorageService {
    boolean save(Storage storage);

    boolean decrease(int productId, int count);

    Storage getOne(int productId);
}
```



#### StorageServiceImpl 实现类

```java
package org.hong.springcloudalibaba.service.serviceimpl;

import org.hong.springcloudalibaba.domain.Storage;
import org.hong.springcloudalibaba.mapper.StorageMapper;
import org.hong.springcloudalibaba.service.StorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class StorageServiceImpl implements StorageService {
    @Autowired
    private StorageMapper storageMapper;

    @Override
    public boolean save(Storage storage) {
        return storageMapper.save(storage);
    }

    @Override
    public boolean decrease(int productId, int count) {
        Storage one = this.getOne(productId);
        if(one.getResidue() < count){
            throw new RuntimeException("库存不足");
        }
        return storageMapper.decrease(productId, count);
    }

    @Override
    public Storage getOne(int productId) {
        return storageMapper.getOne(productId);
    }
}
```



#### StorageController

```java
package org.hong.springcloudalibaba.controller;

import org.hong.springcloudalibaba.domain.CommonResult;
import org.hong.springcloudalibaba.domain.Storage;
import org.hong.springcloudalibaba.service.StorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/storage")
public class StorageController {
    @Autowired
    private StorageService storageService;

    @PostMapping
    public CommonResult<Storage> save(@RequestBody Storage storage){
        boolean result = storageService.save(storage);
        if(result){
            return new CommonResult<>(200, "数据提交成功", storage);
        }else{
            return new CommonResult<>(444, "数据提交失败", null);
        }
    }

    @PutMapping("/{productId}/{count}")
    public CommonResult<Storage> decrease(@PathVariable("productId") int productId,
                                          @PathVariable("count") int count){
        boolean result = storageService.decrease(productId, count);
        if(result){
            return new CommonResult<>(200, "数据提交成功", null);
        }else{
            return new CommonResult<>(444, "数据提交失败", null);
        }
    }
}
```



### 创建订单服务

#### POM

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">

    <modelVersion>4.0.0</modelVersion>
    <artifactId>seata-order-service2001</artifactId>

    <parent>
        <artifactId>seata-parent-module</artifactId>
        <groupId>org.hong</groupId>
        <version>1.0-SNAPSHOT</version>
    </parent>

</project>
```



#### YAML

```yaml
server:
  port: 2001
spring:
  application:
    name: seata-order-service
  cloud:
    nacos:
      discovery:
        #nacos服务地址
        server-addr: 127.0.0.1:8848
        #nacos命名空间ID
        namespace: 422e91b9-5de2-4c7f-aff0-fd6bc3f2cae1
    alibaba:
      seata:
        #事务群组，要和下方vgroup-mapping保持一致（可以每个应用独立取名，也可以使用相同的名字），要与服务端nacos-config.txt中service.vgroup_mapping中存在,并且要保证多个群组情况下后缀名要保持一致-group
        tx-service-group: ${spring.application.name}-group

  datasource:
    driver-class-name: com.mysql.jdbc.Driver
    url: jdbc:mysql://127.0.0.1:3306/seata_order?serverTimezone=Asia/Shanghai&useUnicode=true&characterEncoding=utf-8&zeroDateTimeBehavior=convertToNull&useSSL=false&allowPublicKeyRetrieval=true
    username: root
    password: 1234

seata:
  application-id: ${spring.application.name}
  #事务群组（可以每个应用独立取名，也可以使用相同的名字），要与服务端nacos-config.txt中service.vgroup_mapping中存在,并且要保证多个群组情况下后缀名要保持一致-group
  service:
    vgroup-mapping:
      seata-order-service-group: default

  registry:
    type: nacos
    nacos:
      server-addr: ${spring.cloud.nacos.discovery.server-addr}
      username: nacos
      password: nacos
      #seata分组名称
      group: SEATA_GROUP
      #nacos命名空间ID
      namespace: 422e91b9-5de2-4c7f-aff0-fd6bc3f2cae1
      #seata服务名
      application: seata-server

  config:
    type: nacos
    nacos:
      server-addr: ${spring.cloud.nacos.discovery.server-addr}
      username: nacos
      password: nacos
      #seata分组名称
      group: SEATA_GROUP
      #nacos命名空间ID
      namespace: 422e91b9-5de2-4c7f-aff0-fd6bc3f2cae1



# feign组件超时设置，用于查看seata数据库中的临时数据内容
feign:
  client:
    config:
      default:
        connect-timeout: 30000
        read-timeout: 30000


mybatis-plus:
  mapper-locations: classpath:mapper/*.xml
  configuration:
    log-impl: org.apache.ibatis.logging.stdout.StdOutImpl
```



#### 主启动

```java
package org.hong.springcloudalibaba;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.openfeign.EnableFeignClients;

//开启feign接口
@EnableFeignClients
//注册服务
@EnableDiscoveryClient
//排除默认数据源配置
@SpringBootApplication(exclude = DataSourceAutoConfiguration.class)
public class SeataOrderMainApp2001 {
    public static void main(String[] args) {
        SpringApplication.run(SeataOrderMainApp2001.class, args);
    }
}
```



#### DataSourceProxyConfig

也可以使用 `@EnableAutoDataSourceProxy` 注解

```java
package org.hong.springcloudalibaba.config;

import com.alibaba.druid.pool.DruidDataSource;
import com.baomidou.mybatisplus.extension.spring.MybatisSqlSessionFactoryBean;
import org.apache.ibatis.session.SqlSessionFactory;
import org.mybatis.spring.transaction.SpringManagedTransactionFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;

import javax.sql.DataSource;

/**
 * TODO
 * Mybtis-plus数据源代理
 *
 * @version 1.0
 * @date 2021/5/28 10:45
 */
@Configuration
public class DataSourceProxyConfig {

    @Value("${mybatis-plus.mapper-locations}")
    private String mapperLocations;

    @Bean
    @ConfigurationProperties(prefix = "spring.datasource")
    public DataSource druidDataSource() {
        return new DruidDataSource();
    }

    @Bean
    public SqlSessionFactory sqlSessionFactoryBean(DataSource dataSource) throws Exception {
        MybatisSqlSessionFactoryBean sqlSessionFactoryBean = new MybatisSqlSessionFactoryBean();
        sqlSessionFactoryBean.setDataSource(dataSource);
        sqlSessionFactoryBean.setMapperLocations(new PathMatchingResourcePatternResolver()
                .getResources(mapperLocations));
        sqlSessionFactoryBean.setTransactionFactory(new SpringManagedTransactionFactory());
        return sqlSessionFactoryBean.getObject();
    }
}
```



#### OrderMapper

```java
package org.hong.springcloudalibaba.mapper;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.hong.springcloudalibaba.domain.Order;

@Mapper
public interface OrderMapper {
    boolean save(Order order);

    boolean updateStatus(@Param("id") int id,
                         @Param("status") int status);
}
```



#### OrderMapper 配置文件

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper
        PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-mapper.dtd">

<mapper namespace="org.hong.springcloudalibaba.mapper.OrderMapper">

    <insert id="save" useGeneratedKeys="true" keyProperty="id" keyColumn="id">
        INSERT INTO
            T_ORDER(user_id, product_id, `count`, money, status)
        VALUES
            (#{userId}, #{productId}, #{count}, #{money}, 0)
    </insert>
    <update id="updateStatus">
        UPDATE
            T_ORDER
        SET
            status = #{status}
        WHERE
            id = #{id}
    </update>
</mapper>
```



#### OpenFeign 远程调用接口

##### AccountServiceOpenFeign

```java
package org.hong.springcloudalibaba.service.openfeign;

import org.hong.springcloudalibaba.domain.Account;
import org.hong.springcloudalibaba.domain.CommonResult;
import org.hong.springcloudalibaba.domain.Storage;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient("seata-account-service")
public interface AccountServiceOpenFeign {
    @PostMapping("/account")
    CommonResult<Account> save(@RequestBody Account account);

    @PutMapping("/account/{userId}/{money}")
    CommonResult<Storage> decrease(@PathVariable("userId") int userId,
                                   @PathVariable("money") double money);
}
```



##### StorageServiceOpenFeign

```java
package org.hong.springcloudalibaba.service.openfeign;

import org.hong.springcloudalibaba.domain.CommonResult;
import org.hong.springcloudalibaba.domain.Storage;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient("seata-storage-service")
public interface StorageServiceOpenFeign {
    @PostMapping("/storage")
    CommonResult<Storage> save(@RequestBody Storage storage);

    @PutMapping("/storage/{productId}/{count}")
    CommonResult<Storage> decrease(@PathVariable("productId") int productId,
                                   @PathVariable("count") int count);
}
```



#### OrderService 接口

```java
package org.hong.springcloudalibaba.service;

import org.hong.springcloudalibaba.domain.Order;

public interface OrderService {
    boolean save(Order order);
}
```



#### OrderServiceImpl 实现

```java
package org.hong.springcloudalibaba.service.serviceimpl;

import io.seata.spring.annotation.GlobalTransactional;
import lombok.extern.slf4j.Slf4j;
import org.hong.springcloudalibaba.domain.CommonResult;
import org.hong.springcloudalibaba.domain.Order;
import org.hong.springcloudalibaba.domain.Storage;
import org.hong.springcloudalibaba.mapper.OrderMapper;
import org.hong.springcloudalibaba.service.OrderService;
import org.hong.springcloudalibaba.service.openfeign.AccountServiceOpenFeign;
import org.hong.springcloudalibaba.service.openfeign.StorageServiceOpenFeign;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class OrderServiceImpl implements OrderService {
    @Autowired
    private OrderMapper orderMapper;
    @Autowired
    private AccountServiceOpenFeign accountServiceOpenFeign;
    @Autowired
    private StorageServiceOpenFeign storageServiceOpenFeign;

    @Override
    // name: 全局唯一id
    // rollbackFor: 对哪些异常进行处理
    @GlobalTransactional(name = "order-service-tx", rollbackFor = {Exception.class})
    public boolean save(Order order) {
        int count = order.getCount();
        log.info("正在生成订单");
        boolean save = orderMapper.save(order);
        log.info("订单生成成功");

        log.info("正在扣除用户金额");
        CommonResult<Storage> decrease = accountServiceOpenFeign.decrease(1, (count * 25.5));
        log.info("用户金额扣除成功");

        log.info("正在扣减库存");
        CommonResult<Storage> decrease1 = storageServiceOpenFeign.decrease(1, count);
        log.info("库存扣减成功");

        log.info("正在修改订单状态");
        boolean updateStatus = orderMapper.updateStatus(order.getId(), 1);
        log.info("订单状态修改成功");
        return save && decrease.getCode() == 200 && decrease1.getCode() == 200 && updateStatus;
    }

```



#### OrderController

```java
package org.hong.springcloudalibaba.controller;

import org.hong.springcloudalibaba.domain.CommonResult;
import org.hong.springcloudalibaba.domain.Order;
import org.hong.springcloudalibaba.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/order")
public class OrderController {
    @Autowired
    private OrderService orderService;

    @GetMapping("/test/{count}")
    public CommonResult<Object> test1(@PathVariable("count") int count){
        Order order = new Order(null, 1, 1, count, 25.5, 0);
        boolean customer = orderService.save(order);
        if(customer){
            return new CommonResult<>(200, "操作成功", order);
        }else{
            return new CommonResult<>(444, "操作失败");
        }
    }
}
```



### 测试

1.  启动 Nacos
2.  启动 Seata
3.  启动 2001、2002、2003

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081145225.png)



浏览器访问 http://localhost:2001/order/test/5

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081145149.png)

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081145445.png)



再访问 http://localhost:2001/order/test/10

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081145191.png)

并没有生成新的订单，但是

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081145235.png)

再访问 http://localhost:2001/order/test/5，主键是 `10` 而不是 `9`；其实上面的错误操作创建了一条订单数据，由于后续操作失败的问题，`Seata` 帮我们进行了数据回滚，删除了脏数据。

![](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202401081145688.png)





## Spring Cloud OSS 文件上传到阿里云

### 开通 OSS 服务

https://mp.weixin.qq.com/s?src=11&timestamp=1625919665&ver=3182&signature=vYmRU6XjbRoFmPhMhrmePYL*Yv5N*dIJ*L9OR1h4AVTg-jl2DF4FHZ2Tb4*4fyYv*U1HbWsBahqpi1yPBwOgsbrWGZfVhszEIroE3bNWhKVSA-Qm9w42qy*ZVHZzMrD-&new=1



### Hello World

#### Maven

```xml
<dependency>
    <groupId>com.aliyun.oss</groupId>
    <artifactId>aliyun-sdk-oss</artifactId>
    <version>3.10.2</version>
</dependency>
```

#### 代码

```java
@Test
void upLoad() throws FileNotFoundException {
    // yourEndpoint填写Bucket所在地域对应的Endpoint。以华东1（杭州）为例，Endpoint填写为https://oss-cn-hangzhou.aliyuncs.com。
    String endpoint = "oss-cn-shenzhen.aliyuncs.com";
    // 阿里云账号AccessKey拥有所有API的访问权限，风险很高。强烈建议您创建并使用RAM用户进行API访问或日常运维，请登录RAM控制台创建RAM用户。
    String accessKeyId = "LTAI5tKCTDSF3GF4D6ia9ZqP";
    String accessKeySecret = "djRxDUkYeX66v2GoLeFueyOLVTRdH7";

    // 创建OSSClient实例。
    OSS ossClient = new OSSClientBuilder().build(endpoint, accessKeyId, accessKeySecret);

    // 填写本地文件的完整路径。如果未指定本地路径，则默认从示例程序所属项目对应本地路径中上传文件流。
    InputStream inputStream = new FileInputStream("C:\\Users\\Administrator\\Pictures\\Saved Pictures\\-42c5bb13b37d4af6.jpg");
    // 依次填写Bucket名称（例如examplebucket）和Object完整路径（例如exampledir/exampleobject.txt）。Object完整路径中不能包含Bucket名称。
    ossClient.putObject("hong-gulimall", "yuan.jpg", inputStream);

    // 关闭OSSClient。
    ossClient.shutdown();

    System.out.println("上传完成");
}
```



### 整合 Spring

#### Maven

```xml
<!-- oss -->
<dependency>
    <groupId>com.alibaba.cloud</groupId>
    <artifactId>spring-cloud-starter-alicloud-oss</artifactId>
    <version>2.2.0.RELEASE</version>
</dependency>
```

#### application.yaml

```yaml
spring:
  cloud:
    alicloud:
      access-key: LTAI5tKCTDSF3GF4D6ia9ZqP
      secret-key: djRxDUkYeX66v2GoLeFueyOLVTRdH7
      oss:
        endpoint: oss-cn-shenzhen.aliyuncs.com
```

#### 代码

```java
package org.hong.gulimall.product;

import com.aliyun.oss.OSSClient;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.InputStream;

@SpringBootTest
class GulimallProductApplicationTests {

    @Autowired
    private OSSClient ossClient;

    @Test
    void upLoad() throws FileNotFoundException {
        // 填写本地文件的完整路径。如果未指定本地路径，则默认从示例程序所属项目对应本地路径中上传文件流。
        InputStream inputStream = new FileInputStream("C:\\Users\\Administrator\\Pictures\\Saved Pictures\\-42c5bb13b37d4af6.jpg");
        // 依次填写Bucket名称（例如examplebucket）和Object完整路径（例如exampledir/exampleobject.txt）。Object完整路径中不能包含Bucket名称。
        ossClient.putObject("hong-gulimall", "yuan.jpg", inputStream);

        // 关闭OSSClient。
        ossClient.shutdown();

        System.out.println("上传完成");
    }

}
```