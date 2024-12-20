# mybatis-plus 实践及架构原理

**mybatis** 增强工具包，简化 **CURD** 操作。 

启动加载 XML 配置时注入单表 SQL 操作 ，为简化开发工作提供生产率而生。mybatis-plus 只做增强不做改变，这里不提倡 SQL 写在代码中。 

**Maven** 坐标 http://search.maven.org/#search%7Cga%7C1%7Cmybatis-plus 

```xml
<dependency> 
  <groupId>com.baomidou</groupId> 
  <artifactId>mybatis-plus</artifactId> 
  <version>maven 官方最新版本号为准</version> 
</dependency> 
```

功能

1、单表CURD （简单+批量）操作，自动完成。 

2、分页插件，Count 查询自动或自定义SQL 查询。 

3、Spring 根据不同环境加载不同配置支持。 

使用

1、代码自动生成，查看类com.baomidou.mybatisplus.test.AutoGeneratorTest 

2、使用方法，查看类com.baomidou.mybatisplus.test.UserMapperTest 

**mybatis 架构图**

![image-20210709220630492](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071130036.png)

![image-20210709220710270](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071130174.png)

![image-20210709220745461](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071130997.png)

![image-20210709220807474](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071130970.png)

![image-20210709220832171](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071130053.png)

![image-20210709220913827](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071130647.png)

![image-20210709220930918](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071130440.png)

![image-20210709220946357](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071130722.png)



![image-20210709221004589](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311071130893.png)